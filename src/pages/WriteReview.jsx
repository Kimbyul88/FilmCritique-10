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
    console.dir(reviewData);
    const formData = new FormData();
    formData.append("title", reviewData.title);
    formData.append("rating", reviewData.rating);
    formData.append("review", reviewData.review);
    formData.append("username", reviewData.username);
    formData.append("password", reviewData.password);
    formData.append("date_watched", reviewData.dateWatched);
    formData.append("poster", reviewData.poster);
    console.dir(formData.title);
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "multipart/form-data",
    };
    try {
      console.log("Submitting review data:", formData);
      console.log("Submitting review data:", reviewData.poster);
      let response;
      if (reviewid) {
        console.log(reviewData);
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

      // if (response.status === 400) {
      //   console.log("patch failed");
      //   return;
      // } else {
      //   // console.error("Failed to submit review!");
      // }
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
