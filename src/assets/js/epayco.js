function showCustomerEpayco(contractId, document, cardName, email, amount, type, tokenService, idSandbox, quota) {
  //var amount = $('input#anticipated_collection_cashsum').val();
  //amount = '1';
  var parsedAmount = amount
  //var parsedAmount = amount.replace('$', '').replace('.', '');
  /*$('script.epayco-button').attr('data-epayco-amount', parsedAmount);
  $('button.epayco-button-render').click();*/
  var urlConfirmation = 'https://msplanscontractspo.azurewebsites.net/api/PlansContracts/CreatePaymentIndividual'
  if (idSandbox) {
    urlConfirmation = 'https://msplanscontractsposandbox.azurewebsites.net/api/PlansContracts/CreatePaymentIndividual'
  }

  var handler = ePayco.checkout.configure({
    key: '730d7cb5cddc13577f64e271a10b9b47',
    test: true
  });

  var data = {
    //Parametros compra (obligatorio)
    name: type,
    description: type + " - Contrato " + contractId,
    currency: "cop",
    amount: parsedAmount,
    tax_base: "0",
    tax: "0",
    country: "co",
    lang: "es",

    //Onpage="false" - Standard="true"
    external: "false",

    confirmation: urlConfirmation,
    //confirmation: "https://consensussa.net/legalisappEmail/public/pruebaconfirmation/",
    response: '',
    method_confirmation: "POST",

    extra1: document,
    extra2: tokenService,
    extra3: contractId,
    extra4: quota,

    //Atributos cliente
    name_billing: cardName,
    type_doc_billing: "cc",
    number_doc_billing: document,
    email_billing: email

  }
  handler.open(data);
}

function showPaymentEpaycoContract(contract, document, cardName, email, type, tokenService, idSandbox, amount) {
  var parsedAmount = amount
  var urlConfirmation = 'https://msplanscontractspo.azurewebsites.net/api/PlansContracts/CreatePaymentIndividual'
  if (idSandbox) {
    urlConfirmation = 'https://msplanscontractsposandbox.azurewebsites.net/api/PlansContracts/CreatePaymentIndividual'
  }
  var handler = ePayco.checkout.configure({
    key: '730d7cb5cddc13577f64e271a10b9b47',
    test: true
  });

  var data = {
    name: type,
    description: type + " - Contrato " + contract,
    currency: "cop",
    amount: parsedAmount,
    tax_base: "0",
    tax: "0",
    country: "co",
    lang: "es",
    external: "false",
    confirmation: urlConfirmation,
    response: '',
    method_confirmation: "POST",
    extra1: document,
    extra2: tokenService,
    extra3: contract,
    name_billing: cardName,
    type_doc_billing: "cc",
    number_doc_billing: document,
    email_billing: email

  }
  handler.open(data);
}
