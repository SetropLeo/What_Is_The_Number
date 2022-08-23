// Elementos da tela
const btnSendGuess = document.getElementById('btn-send-guess');
const btnStartNewGame = document.getElementById('btn-new-game');
const referenceText = document.getElementById('text-reference');
const numberInput = document.getElementById('input-number');
const numberUnity = document.getElementById('unity');
const numberTen = document.getElementById('ten');
const numberHundred = document.getElementById('hundred');

// Variável Global
let requisitionNumber;

// Busca o valor na API
const getNumber = async () => {
  const response = await fetch('https://us-central1-ss-devops.cloudfunctions.net/rand?min=1&max=300');
  const responseJson = await response.json();

  // Verifica se o response vem com erro.  // Caso sim, ativa o estado de erro. // Caso não, seta o valor na variável global.
  if (response.status !== 200) {
    setResponseError(responseJson);
    toggleDisabledFields(true);
    showReferenceText();
  } else {
    requisitionNumber = responseJson.value;
  }
};

// Ao clicar, recebe o valor do palpite (caso o input não esteja vazio).
const onClickSendGuess = () => {
  let guess;

  // Verifica se não foi enviado um valor nulo ou inválido.
  if (numberInput.value !== '') {
    clearNumberFields();
    guess = Number(numberInput.value);
    setGuessValue(guess);

    // Verifica se o valor é unidade|dezena|centena e apresenta as casas numéricas.
    if (guess >= 100) {
      numberHundred.classList.remove('none');
      numberTen.classList.remove('none');
    } else if (guess >= 10) {
      numberTen.classList.remove('none');
    }

    // Verifica o valor do palpite e compara com o número sorteado.
    if (guess == requisitionNumber) {
      setWin();
    } else if (guess > requisitionNumber) {
      referenceText.innerHTML = 'É menor';
    } else {
      referenceText.innerHTML = 'É maior';
    }

    numberInput.value = '';
    showReferenceText();
  }
};

// Seta os estados iniciais do jogo. // Esconde campos e habilita os campos necessários. // Remove as estilizações desnecessárias.
const setInitialStates = () => {
  referenceText.classList.add('hidden');
  numberTen.classList.add('none');
  numberHundred.classList.add('none');

  referenceText.classList.remove('error', 'success');
  numberUnity.classList.remove('error', 'success');
  numberTen.classList.remove('error', 'success');
  numberHundred.classList.remove('error', 'success');
  numberUnity.setAttribute('class', 'num-0');

  toggleBtnNewGame();
  toggleDisabledFields(false);
};

const setGuessValue = (guess) => {
  [numberUnity, numberTen, numberHundred].forEach((number, index) => {
    let value = guess.toString()[index];
    value ? number.setAttribute('class', `num-${value}`) : '';
  });
};

// Seta o estado de vitória.
const setWin = () => {
  referenceText.innerHTML = 'Você acertou!!!!!';

  referenceText.classList.add('success');
  numberUnity.classList.add('success');
  numberTen.classList.add('success');
  numberHundred.classList.add('success');

  toggleBtnNewGame();
  showReferenceText();
  toggleDisabledFields(true);
};

// Seta o estado de erro.
const setResponseError = (error) => {
  setGuessValue(error.StatusCode);
  toggleBtnNewGame();

  numberUnity.classList.add('error');
  numberTen.classList.add('error');
  numberHundred.classList.add('error');
  referenceText.classList.add('error');
  btnSendGuess.classList.add('disabled');
  referenceText.innerHTML = 'ERRO';
};

// Alterna entre oculto|não oculto os campos de texto e enviar palpite.
const toggleDisabledFields = (state) => {
  numberInput.disabled = state;
  btnSendGuess.disabled = state;
};

// Habilita o texto de referência.
const showReferenceText = () => {
  referenceText.classList.remove('hidden');
};

// Alterna entre oculto|não oculto o botão de nova partida.
const toggleBtnNewGame = () => {
  btnStartNewGame.classList.toggle('hidden');
};

// Limpa as casas numéricas (Volta para unidade).
const clearNumberFields = () => {
  numberHundred.classList.add('none');
  numberTen.classList.add('none');
};

// Verifica o valor do palpite e impede o preenchimento com mais de 3 caracteres
const maxLengthInputCheck = (object) => {
  if (object.value != undefined && object.value.length == 4)
    object.value = object.value.slice(0, 3);
};

// Ao clicar, inicia uma nova partida
const onClickStartNewGame = () => {
  setInitialStates();
  getNumber();
};

// Listeners
btnSendGuess.addEventListener('click', onClickSendGuess);
btnStartNewGame.addEventListener('click', onClickStartNewGame);

// Função inicializadora
onClickStartNewGame();
