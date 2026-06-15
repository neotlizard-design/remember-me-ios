const dialog = document.querySelector("#donateDialog");
const openButton = document.querySelector("#openDonate");
const amountButtons = [...document.querySelectorAll("[data-amount]")];
const quickAmountButtons = [...document.querySelectorAll("[data-quick-amount]")];
const customAmount = document.querySelector("#customAmount");
const shareButton = document.querySelector("#shareDonation");
const dialogNote = document.querySelector("#dialogNote");

let selectedAmount = 10;

openButton.addEventListener("click", () => {
  const matchingButton = amountButtons.find(
    (button) => Number(button.dataset.amount) === selectedAmount,
  );
  amountButtons.forEach((button) => button.classList.toggle("selected", button === matchingButton));
  customAmount.value = matchingButton ? "" : selectedAmount;
  dialog.showModal();
});

quickAmountButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedAmount = Number(button.dataset.quickAmount);
    quickAmountButtons.forEach((item) => item.classList.toggle("selected", item === button));
  });
});

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    dialog.close();
  }
});

amountButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedAmount = Number(button.dataset.amount);
    customAmount.value = "";
    amountButtons.forEach((item) => item.classList.toggle("selected", item === button));
    quickAmountButtons.forEach((item) =>
      item.classList.toggle("selected", Number(item.dataset.quickAmount) === selectedAmount),
    );
    dialogNote.textContent = "תוכלו לשלוח את ההודעה בוואטסאפ או בכל אפליקציה אחרת.";
  });
});

customAmount.addEventListener("input", () => {
  const amount = Number(customAmount.value);
  if (amount > 0) {
    selectedAmount = Math.min(amount, 100);
    amountButtons.forEach((button) => button.classList.remove("selected"));
    quickAmountButtons.forEach((button) => button.classList.remove("selected"));
  }
});

shareButton.addEventListener("click", async () => {
  const amount = Math.max(1, Math.min(Number(selectedAmount) || 10, 100));
  const text = `היי רונן, אני רוצה לעזור עם ${amount} ש״ח כדי שתחזיר לאניי את הכסף. איך להעביר לך?`;
  const shareData = {
    title: "עוזרים לרונן להגיע ל-100 ש״ח",
    text,
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      dialogNote.textContent = "תודה שעזרת לרונן להתקרב ליעד!";
      return;
    }

    await navigator.clipboard.writeText(`${text}\n${window.location.href}`);
    dialogNote.textContent = "ההודעה הועתקה. עכשיו אפשר להדביק ולשלוח לרונן.";
  } catch (error) {
    if (error.name !== "AbortError") {
      dialogNote.textContent = "לא הצלחנו לפתוח שיתוף. אפשר לצלם מסך ולשלוח לרונן.";
    }
  }
});
