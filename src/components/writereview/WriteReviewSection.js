import React, { useState, useRef, useEffect } from "react";
import Line from "../common/Line";
import styled from "styled-components";
import uploadposter from "../../assets/icon/poster.png";
import { DisplayMd, BodyMediumXs } from "../../styles/font";
import StarRate from "./StarRate";
import { useParams } from "react-router-dom";
import { instance } from "../../api/instance";

const WriteReviewSection = ({
  reviewData,
  onReviewDataChange,
  onSubmit,
  formRef,
}) => {
  const { reviewid } = useParams();
  const [inputValues, setInputValues] = useState({
    title: "",
    review: "",
    username: "",
    password: "",
    dateWatched: "",
  });

  const [previewSource, setPreviewSource] = useState(uploadposter);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (reviewid) {
      const fetchReviewData = async () => {
        try {
          const res = await instance.get(`/critique/review/${reviewid}/`);
          const fetchedData = res.data;
          onReviewDataChange(fetchedData);
          setInputValues({
            title: fetchedData.title,
            review: fetchedData.review,
            rating: fetchedData.rating,
            username: fetchedData.username,
            password: fetchedData.password,
            dateWatched: fetchedData.date_watched,
          });
          console.dir(reviewData);
          setPreviewSource(fetchedData.poster);
        } catch (e) {
          alert(e);
        }
      };
      fetchReviewData();
    }
  }, [reviewid]);

  const onInputHandler = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setInputValues({
      ...inputValues,
      [name]: value,
    });
    onReviewDataChange({
      ...reviewData,
      [name]: value,
    });
  };

  const handleUpload = (e) => {
    if (!e.target.files) return;
    const uploadFile = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(uploadFile);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleImgUpload = (e) => {
    if (!e) {
      console.log("not e");
      return;
    }
    if (!e.target.files) return;
    handleUpload(e);
    const uploadFile = e.target.files[0];
    onReviewDataChange({
      ...reviewData,
      poster: uploadFile,
    });
  };

  const handleRatingChange = (rating) => {
    onReviewDataChange({
      ...reviewData,
      rating,
    });
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  return (
    <WriteReviewContainer>
      <Line />
      <form onSubmit={onSubmit} ref={formRef}>
        <div className="poster">
          <DisplayMd>Poster</DisplayMd>
          <PosterImg src={previewSource} onClick={handleImageClick} />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImgUpload}
            style={{ display: "none" }}
          />
        </div>
        <Line />
        <div className="film-title">
          <div className="word-limit">
            <DisplayMd>Film Title</DisplayMd>
            <BodyMediumXs>{inputValues.title.length}/30</BodyMediumXs>
          </div>
          <ShortInput
            name="title"
            onChange={onInputHandler}
            maxLength="30"
            value={inputValues.title}
          />
        </div>
        <Line />
        <div className="rate">
          <DisplayMd>Rate</DisplayMd>
          <StarRate onChange={handleRatingChange} value={inputValues.rating} />
        </div>
        <Line />
        <div className="date-watched">
          <DisplayMd>Date Watched</DisplayMd>
          <ShortInput
            value={inputValues.dateWatched}
            placeholder="xxxx-xx-xx"
            name="dateWatched"
            onChange={onInputHandler}
          />
        </div>
        <Line />
        <div className="review">
          <div className="word-limit">
            <DisplayMd>Review</DisplayMd>
            <BodyMediumXs>{inputValues.review.length}/1000</BodyMediumXs>
          </div>
          <ReviewInput
            name="review"
            onChange={onInputHandler}
            maxLength="1000"
            value={inputValues.review}
          />
        </div>
        <Line />
        <div className="username">
          <div className="word-limit">
            <DisplayMd>Username</DisplayMd>
            <BodyMediumXs>{inputValues.username.length}/20</BodyMediumXs>
          </div>
          <ShortInput
            name="username"
            onChange={onInputHandler}
            maxLength="20"
            value={inputValues.username}
          />
        </div>
        <Line />
        <div className="password">
          <div className="word-limit">
            <DisplayMd>Password</DisplayMd>
            <BodyMediumXs>{inputValues.password.length}/6</BodyMediumXs>
          </div>
          <ShortInput
            name="password"
            onChange={onInputHandler}
            maxLength="6"
            value={inputValues.password}
          />
        </div>
      </form>
    </WriteReviewContainer>
  );
};

export default WriteReviewSection;

const WriteReviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--surface-surface-primary, #f6f6f6);

  .film-title,
  .rate,
  .date-watched,
  .review,
  .username,
  .password {
    display: flex;
    padding: var(--spacing-spacing-2xl, 24px) var(--spacing-spacing-md, 16px);
    align-items: flex-start;
    align-self: stretch;
    flex-direction: column;
    gap: var(--spacing-spacing-xs, 12px);
  }
  .poster {
    display: flex;
    padding: var(--spacing-spacing-2xl, 24px) var(--spacing-spacing-md, 16px);
    justify-content: space-between;
    align-items: flex-start;
    align-self: stretch;
  }
  .word-limit {
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;
  }
`;

const PosterImg = styled.img`
  width: 90px;
  height: 135px;
  border-radius: var(--radius-radius-sm, 4px);
  cursor: pointer;
`;

const ShortInput = styled.input`
  font-family: pretendard;
  height: 49px;
  width: 100%;
  padding: var(--size-160, 16px) var(--spacing-spacing-md, 16px);
  border-radius: var(--radius-radius-md, 8px);
  border: 1px solid var(--border-border-tertiary, #e1e1e1);
`;

const ReviewInput = styled.textarea`
  height: 242px;
  width: 100%;
  padding: var(--size-160, 16px) var(--spacing-spacing-md, 16px);
  border-radius: var(--radius-radius-md, 8px);
  border: 1px solid var(--border-border-tertiary, #e1e1e1);
`;
