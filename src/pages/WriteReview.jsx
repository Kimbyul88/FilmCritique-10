import React, { useRef, useState } from "react";
import Header from "../components/common/Header";
import WriteReviewSection from "../components/writereview/WriteReviewSection";
import { useNavigate, useParams } from "react-router-dom";
import { instance } from "../api/instance";
const WriteReview = () => {
  const { reviewid } = useParams();
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [reviewData, setReviewData] = useState({
    poster: {},
    title: "",
    rating: "",
    review: "",
    username: "",
    password: "",
    dateWatched: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "multipart/form-data",
    };
    const formData = new FormData();

    if (reviewData.title) formData.append("title", reviewData.title);
    if (reviewData.rating) formData.append("rating", reviewData.rating);
    if (reviewData.review) formData.append("review", reviewData.review);
    if (reviewData.username) formData.append("username", reviewData.username);
    if (reviewData.password) formData.append("password", reviewData.password);
    if (reviewData.dateWatched)
      formData.append("date_watched", reviewData.dateWatched);
    if (reviewData.poster instanceof File) {
      formData.append("poster", reviewData.poster);
    }

    try {
      console.log("Submitting review data:", formData);
      console.log("Submitting review data:", reviewData.poster);
      let response;
      if (reviewid) {
        response = await instance.patch(
          `/critique/review/${reviewid}/`,
          formData,
          {
            headers,
          }
        );
      } else {
        response = await instance.post("/critique/review/", formData, {
          headers,
        });
      }
    } catch (e) {
      console.error(e);
      if (e.response && e.response.data) {
        console.error("server res:", e.response.data);
      }
    } finally {
      navigate("/");
    }
  };

  const handleReviewDataChange = (data) => {
    setReviewData(data);
  };

  const handleButtonClick = () => {
    formRef.current.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true })
    );
  };

  return (
    <div>
      <Header onButtonClick={handleButtonClick} />
      <WriteReviewSection
        onReviewDataChange={handleReviewDataChange}
        reviewData={reviewData}
        onSubmit={handleSubmit}
        formRef={formRef}
      />
    </div>
  );
};

export default WriteReview;
