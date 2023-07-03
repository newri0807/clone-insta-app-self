export const toggleBookmark = async (post_id: string, type: boolean) => {
  const data = {
    postId: post_id, // 게시물 ID를 적절히 지정해야 합니다.
    userId: localStorage.getItem("userId") || "",
  };

  await fetch("/api/post/bookmark", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        // 성공적인 응답 처리
        console.log("Bookmark🔖 posted successfully!");
      } else {
        // 실패한 응답 처리
        console.error("Failed to post Bookmark🔖.");
      }
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });
};

export const toggleLike = async (post_id: String) => {
  const data = {
    postId: post_id, // 게시물 ID를 적절히 지정해야 합니다.
    userId: localStorage.getItem("userId") || "",
  };

  await fetch("/api/post/like", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        // 성공적인 응답 처리
        console.log("Like❤️‍🔥 posted successfully!");
      } else {
        // 실패한 응답 처리
        console.error("Failed to post Like❤️‍🔥.");
      }
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });
};
