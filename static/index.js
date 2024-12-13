window.addEventListener('load', function() {
  const roomInput = document.querySelector('#room-input');
  const joinButton = document.querySelector('#join-button');
  const createButton = document.querySelector('#create-button');

  joinButton.addEventListener('click', function(e) {
    e.preventDefault();
    const room = roomInput.value;
    window.location.href = `/live/${room}`;
  });

  createButton.addEventListener('click', function(e) {
    e.preventDefault();
    const room = roomInput.value;
    window.location.href = "/create";
  });
});
