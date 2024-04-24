let currentPage = 1;

  function nextPage() {
    if (currentPage < 2) {
      document.getElementById(`page${currentPage}`).style.transform = "translateX(-100%)";
      document.getElementById(`page${currentPage + 1}`).style.transform = "translateX(0%)";
      currentPage++;
    }
  }

  function prevPage() {
    if (currentPage > 1) {
      document.getElementById(`page${currentPage}`).style.transform = "translateX(100%)";
      document.getElementById(`page${currentPage - 1}`).style.transform = "translateX(0%)";
      currentPage--;
    }
  }
