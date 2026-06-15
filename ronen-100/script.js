const dialog = document.querySelector("#donateDialog");
const openButtons = [...document.querySelectorAll("[data-open-donate]")];
const amountCards = [...document.querySelectorAll("[data-card-amount]")];
const amountButtons = [...document.querySelectorAll("[data-amount]")];
const customAmount = document.querySelector("#customAmount");
const shareButton = document.querySelector("#shareDonation");
const dialogNote = document.querySelector("#dialogNote");

let selectedAmount = 10;

function syncAmountControls() {
  const matchingButton = amountButtons.find(
    (button) => Number(button.dataset.amount) === selectedAmount,
  );

  amountButtons.forEach((button) => {
    button.classList.toggle("selected", button === matchingButton);
  });

  customAmount.value = matchingButton ? "" : selectedAmount;
}

function openDonationDialog(amount) {
  if (amount) {
    selectedAmount = amount;
  }

  syncAmountControls();
  dialogNote.textContent = "ההעברה עצמה מתואמת ישירות מול רונן.";
  dialog.showModal();
}

openButtons.forEach((button) => {
  button.addEventListener("click", () => openDonationDialog());
});

amountCards.forEach((card) => {
  card.addEventListener("click", () => {
    openDonationDialog(Number(card.dataset.cardAmount));
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
  });
});

customAmount.addEventListener("input", () => {
  const amount = Number(customAmount.value);

  if (amount > 0) {
    selectedAmount = Math.min(amount, 100);
    amountButtons.forEach((button) => button.classList.remove("selected"));
  }
});

shareButton.addEventListener("click", async () => {
  const amount = Math.max(1, Math.min(Number(selectedAmount) || 10, 100));
  const text = `היי רונן, אני רוצה להשתתף עם ${amount} ש״ח כדי לעזור לך להחזיר לינאי את הכסף. איך אפשר להעביר?`;
  const shareData = {
    title: "100 לרונן",
    text,
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      dialogNote.textContent = "תודה. אתם חלק מהדרך ל־100 ש״ח.";
      return;
    }

    await navigator.clipboard.writeText(`${text}\n${window.location.href}`);
    dialogNote.textContent = "ההודעה הועתקה. אפשר להדביק ולשלוח לרונן.";
  } catch (error) {
    if (error.name !== "AbortError") {
      dialogNote.textContent = "לא הצלחנו לפתוח שיתוף. אפשר לצלם מסך ולשלוח לרונן.";
    }
  }
});
