export const toggleBookmark = async (
  post_id: string,
  nowLoginUserName?: string
) => {
  const data = {
    postId: post_id, // 게시물 ID를 적절히 지정해야 합니다.
    userId: nowLoginUserName || "",
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
        if (response.status === 401) {
          alert(`로그인 후 사용 가능한 기능입니다.😊`);
          return;
        }
      }
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });
};

export const toggleLike = async (post_id: String, nowLoginUserName: string) => {
  const data = {
    postId: post_id, // 게시물 ID를 적절히 지정해야 합니다.
    userId: nowLoginUserName || "",
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
        if (response.status === 401) {
          alert(`로그인 후 사용 가능한 기능입니다.😊`);
          return;
        }
      }
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });
};
