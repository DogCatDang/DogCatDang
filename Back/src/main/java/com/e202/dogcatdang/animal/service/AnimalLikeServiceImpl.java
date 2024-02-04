package com.e202.dogcatdang.animal.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.e202.dogcatdang.db.entity.Animal;
import com.e202.dogcatdang.db.entity.AnimalLike;
import com.e202.dogcatdang.db.entity.User;
import com.e202.dogcatdang.db.repository.AnimalLikeRespository;
import com.e202.dogcatdang.db.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class AnimalLikeServiceImpl implements AnimalLikeService{

	private final AnimalLikeRespository animalLikeRespository;
	private final UserRepository userRepository;

	// like 등록
	// 해당 user와 animal로 animallike 생성 후 저장
	public void likeAnimal(Long userId, Animal animal) {
		// userId로 사용자 엔티티 찾아오기
		User user = userRepository.findById(userId)
			.orElseThrow(() -> new EntityNotFoundException(userId + "를 가진 사용자가 없습니다."));

		AnimalLike animalLike = AnimalLike.builder()
				.user(user)
			    .animal(animal)
			    .build();
		animalLikeRespository.save(animalLike);
	}

	// like 취소
	public void unlikeAnimal(Long userId, Animal animal) {
		// userId로 사용자 엔티티 찾아오기
		User user = userRepository.findById(userId)
			.orElseThrow(() -> new EntityNotFoundException(userId + "를 가진 사용자가 없습니다."));
		
		AnimalLike animalLike = animalLikeRespository.findByUserAndAnimal(user, animal);
		// 해당 user와 animal을 가진 animallike가 있다면 삭제
		if (animalLike != null) {
			animalLikeRespository.delete(animalLike);
		}
	}

	// user가 animal에 like를 했는지 boolean 값으로 확인
	public boolean isAnimalLikedByUser(Animal animal, User user) {
		return animalLikeRespository.existsByAnimalAndUser(animal, user);
	}

	// 현재 user가 like 한 동물 목록 확인
	public List<Animal> getLikedAnimalsByUser(User user) {
		List<AnimalLike> animalLikes = animalLikeRespository.findByUser(user);
		return animalLikes.stream().map(AnimalLike::getAnimal).collect(Collectors.toList());
	}
}
