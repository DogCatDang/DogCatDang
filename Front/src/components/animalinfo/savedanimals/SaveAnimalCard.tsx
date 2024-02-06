import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import LikeButton from "../../../components/animalinfo/LikeButton";
import { useEffect, useState } from "react";

export interface SaveAnimal {
  animalId: number;
  code: string;
  animalType: string;
  breed: string;
  age: string;
  weight: string;
  rescueDate: string;
  selectedCity: string;
  selectedDistrict: string;
  detailInfo: string;
  isNeuter: boolean;
  gender: string;
  feature: string;
  state: string;
  imgName: string;
  imgUrl: string;
  userNickname: string;
  like: boolean;
  rescueLocation: string;
}

interface AnimalCardProps {
  animals: SaveAnimal;
}

const Card = styled.div`
  background-color: rgb(255, 255, 255);
  border: 1px solid #ccc;
  padding: 5px 20px 15px 20px;
  position: relative;
  box-shadow: 2px 2px 2px rgb(45,45,45, 0.4);
  border-radius: 10px;
`;

function SaveAnimalCard(props: AnimalCardProps) {
  const [liked, setLiked] = useState(props.animals.like);
  const navigate = useNavigate();

  useEffect(() => {
    setLiked(props.animals.like);
  }, [props.animals.like]);

  const gotoDetailPage = () => {
    navigate(`/save-animals/${props.animals.animalId}`);
  };
  const handleToggleLike = () => {
    setLiked(!liked);
  };

  function getShortenedLocation(fullLocation: string) {
    const parts = fullLocation.split(' ');
  
    const shortenedLocation = parts.slice(0, 2).join(' ');
    return shortenedLocation;
  }

  return (
    <Card>
      <div onClick={gotoDetailPage}>
        <div style={{ fontSize: "10px" }}>
          보호 기관 : {props.animals.userNickname}
        </div>
        {/* <img className="img" src={ 'images/img'+ (props.num + 1) +'.jpg' } /> */}
        <img
          src="src/assets/dog.jpg"
          alt="rkdkdwl"
          style={{ border: "1px solid #ccc" }}
        ></img>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto" }}>
          <div>
            <div>
              <strong>{props.animals.breed.replace(/_/g, " ")}</strong> |{" "}
              <strong>{props.animals.age}살 </strong>
            </div>
            <p style={{ fontSize: "13px" }}>
              {props.animals.gender} |{" "}
              {props.animals.isNeuter ? "중성화 완료" : "중성화 알 수 없음"}
            </p>

            <p style={{ fontSize: "10px", opacity: "0.7" }}>
              지역 : {getShortenedLocation(props.animals.rescueLocation)}
            </p>
          </div>
        </div>
      </div>
          <div style={{ position: 'absolute', right: '8%', bottom: '4%' }}>
            <LikeButton
              animalId={props.animals.animalId}
              isActive={liked}
              onToggle={handleToggleLike}
            ></LikeButton>
          </div>
    </Card>
  );
}

export default SaveAnimalCard;
