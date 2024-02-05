package com.e202.dogcatdang.comment.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.e202.dogcatdang.board.dto.ResponseBoardSummaryDto;
import com.e202.dogcatdang.comment.dto.ResponseCommentDto;
import com.e202.dogcatdang.db.entity.Board;
import com.e202.dogcatdang.db.entity.Comment;
import com.e202.dogcatdang.db.repository.CommentRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class CommentServiceImpl implements CommentService {

	CommentRepository commentRepository;
	@Override
	public List<ResponseCommentDto> findByBoardId(Long boardId) {
		List<Comment> commentList = commentRepository.findByBoardId(boardId);

		List<ResponseCommentDto> commentDtoList = new ArrayList<>();

		for (Comment comment : commentList) {
			ResponseCommentDto responseCommentDto = ResponseCommentDto.builder()
				.comment(comment)
				.build();

			commentDtoList.add(responseCommentDto);
		}

		return commentDtoList;
	}
}