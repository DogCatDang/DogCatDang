package com.e202.dogcatdang.user.Service;

import com.e202.dogcatdang.db.entity.User;
import com.e202.dogcatdang.db.repository.UserRepository;
import com.e202.dogcatdang.exception.DuplicateEmailException;
import com.e202.dogcatdang.user.dto.JoinDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

@Service
public class JoinService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public JoinService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public void joinUser(JoinDTO joinDTO) {
        String username = joinDTO.getUsername();
        String password = joinDTO.getPassword();
        String role = joinDTO.getRole();
        String phone = joinDTO.getPhone();
        String email = joinDTO.getEmail();
        String address = joinDTO.getAddress();
        String nickname = joinDTO.getNickname();


        Boolean isExistUsername = userRepository.existsByUsername(username);
        Boolean isExistEmail = userRepository.existsByEmail(email);
//        Boolean isExistPhone = userRepository.existsByPhone(phone);
        Boolean isExistNickname = userRepository.existsByNickname(nickname);


        //중복 검사
        if(isExistUsername || isExistEmail || isExistNickname){
            throw new DuplicateEmailException("already exists: " );
        }

        User data = new User();
        data.setUsername(username);
        data.setPassword(bCryptPasswordEncoder.encode(password));
        //data.setRole("ROLE_ADMIN");
        data.setRole(role);
        data.setEmail(email);
        data.setAddress(address);
        data.setNickname(nickname);
        data.setPhone(phone);


        userRepository.save(data);

    }
}