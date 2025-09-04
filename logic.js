let LeForTier = [];
let numberOfHide = [];
let targetTier = 0;
let LPO = 0;


$(".bounes").on("change", function () {
  let LPO = 1.58; // base city bonus


  if($("#none").is(":checked")){
    LPO = 1.58;
  }
  if ($("#dailyBounes10").is(":checked")) {
    LPO = 1.68;
  }
  if ($("#dailyBounes20").is(":checked")) {
    LPO = 1.78;
  }
  if ($("#focus").is(":checked")) {
    LPO += 0.59;
  }

  $("#LPO").val(LPO.toFixed(2));
});

function calculate() {
  let numberOfLeather = Number($("#numLeather").val());
  LPO = Number($("#LPO").val());
  targetTier = Number($("#targetTier").val());
  LeForTier = [0, 0, 0, 0, 0, 0, 0];
  let currLeather = numberOfLeather;

  // Calculate leather per tier
  for (let i = targetTier - 1; i >= 2; i--) {
    LeForTier[i - 2] = Math.ceil(currLeather / LPO);
    currLeather = LeForTier[i - 2];
  }
  LeForTier[targetTier - 2] = numberOfLeather;

  // Calculate hides per tier
  for (let i = 2; i <= targetTier; i++) {
    switch (i) {
      case 2:
        numberOfHide[i - 2] = Math.ceil(LeForTier[i - 2] / LPO);
        break;
      case 3:
      case 4:
        numberOfHide[i - 2] = LeForTier[i - 3] * 2;
        break;
      case 5:
        numberOfHide[i - 2] = LeForTier[i - 3] * 3;
        break;
      case 6:
        numberOfHide[i - 2] = LeForTier[i - 3] * 4;
        break;
      case 7:
      case 8:
        numberOfHide[i - 2] = LeForTier[i - 3] * 5;
        break;
      default:
        numberOfHide[i - 2] = 0;
    }
  }

  // Build the table rows
  let rows = "";
  for (let i = 2; i <= targetTier; i++) {
    let hidePrice = Number($("#T" + i).val()) || 0;
    let cost = numberOfHide[i - 2] * hidePrice;

    rows += `
      <tr>
        <td>Tier ${i}</td>
        <td>${LeForTier[i - 2]}</td>
        <td>${numberOfHide[i - 2]}</td>
        <td>${hidePrice}</td>
        <td class="cost" data-tier="${i}">${cost}</td>
      </tr>`;
  }

  $("#result tbody").html(rows);
  $("#result").show();

  // Update totals
  costCalc();
}

// claculations 
function costCalc() {
  let totalCost = 0;

  for (let i = 0; i < numberOfHide.length; i++) {
    let price = Number($("#T" + (i + 2)).val()) || 0;
    let cost = numberOfHide[i] * price;
    totalCost += cost;

    $(`#result tbody tr:eq(${i}) td.cost`).text(cost);
  }

  let leatherPrice = Number($("#leatherPrice").val()) || 0;
  let totalLeatherValue = LeForTier[targetTier - 2] * leatherPrice;

  let profit = totalLeatherValue - totalCost;

  $("#totalCost").text(totalCost);
  $("#totalValue").text(totalLeatherValue);
  $("#profit").text(profit);
}

