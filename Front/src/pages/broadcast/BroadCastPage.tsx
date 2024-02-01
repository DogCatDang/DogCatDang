import { useState, useEffect, useCallback } from "react";
import {
  OpenVidu,
  Session as OVSession,
  Publisher,
  Subscriber,
} from "openvidu-browser";
import axios, { AxiosError } from "axios";
import Form from "../../components/Broadcast/Form";
import SessionComponent from "../../components/Broadcast/SessionComponent";

const OPENVIDU_SERVER_URL = `http://localhost:4443`;
const OPENVIDU_SERVER_SECRET = "MY_SECRET";

const BroadCastPage = () => {
  const [session, setSession] = useState<OVSession | undefined>(undefined);
  const [sessionId, setSessionId] = useState("");
  const [subscriber, setSubscriber] = useState<Subscriber | undefined>(
    undefined
  );
  const [publisher, setPublisher] = useState<Publisher | undefined>(undefined);
  const [OV, setOV] = useState<OpenVidu | undefined>(undefined);
  const nickname = `${Math.random()}`;
  const userId = Math.random() * 100;

  const leaveSession = useCallback(() => {
    if (session) {
      session.disconnect();
      setOV(undefined);
      setSession(undefined);
      setSessionId("");
      setSubscriber(undefined);
      setPublisher(undefined);
    }
  }, [session]);

  useEffect(() => {
    return () => {
      leaveSession();
    };
  }, [leaveSession]);

  const joinSession = () => {
    const newOV = new OpenVidu();
    setOV(newOV);
    setSession(newOV.initSession());
  };

  const getToken = useCallback(async (): Promise<string> => {
    const createToken = async (sessionIds: string): Promise<string> => {
      const response = await axios.post(
        `${OPENVIDU_SERVER_URL}/api/sessions/${sessionIds}/connection`,
        {},
        {
          headers: {
            Authorization: `Basic ${btoa(
              `OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`
            )}`,
            "Content-Type": "application/json",
            withCredentials: true,
          },
        }
      );
      return response.data.token;
    };

    const createSession = async (sessionIds: string): Promise<string> => {
      try {
        const data = JSON.stringify({ customSessionId: sessionIds });
        const response = await axios.post(
          `${OPENVIDU_SERVER_URL}/api/sessions`,
          data,
          {
            headers: {
              Authorization: `Basic ${btoa(
                `OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`
              )}`,
              "Content-Type": "application/json",
              withCredentials: true,
            },
          }
        );

        return (response.data as { id: string }).id;
      } catch (error) {
        const errorResponse = (error as AxiosError)?.response;
        if (errorResponse?.status === 409) {
          return sessionIds;
        }

        return "";
      }
    };

    try {
      const newSessionId = await createSession(sessionId);
      const token = await createToken(newSessionId);
      return token;
    } catch (error) {
      throw new Error("Failed to get token.");
    }
  }, [sessionId]);

  const sessionIdChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSessionId(event.target.value);
  };

  useEffect(() => {
    if (!session) return;

    session.on("streamCreated", (event) => {
      const subscribers = session.subscribe(event.stream, "#streamingVideo");
      setSubscriber(subscribers);
    });

    getToken().then((token) => {
      session.connect(token, { nickname, userId }).then(() => {
        if (OV) {
          const publishers = OV.initPublisher(undefined, {
            audioSource: undefined,
            videoSource: undefined,
            publishAudio: true,
            publishVideo: true,
            frameRate: 10,
          });

          setPublisher(publishers);
          session.publish(publishers);
        }
      });
    });
  }, [session, OV, sessionId, getToken, nickname, userId]);

  return (
    <div>
      <h1>진행화면</h1>
      <>
        {session ? (
          <SessionComponent
            publisher={publisher as Publisher}
            subscriber={subscriber as Subscriber}
            session={session}
          />
        ) : (
          <Form
            joinSession={joinSession}
            sessionId={sessionId}
            sessionIdChangeHandler={sessionIdChangeHandler}
          />
        )}
      </>
    </div>
  );
};

export default BroadCastPage;
