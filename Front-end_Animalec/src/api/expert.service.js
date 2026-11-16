import API_URL from './config.js'

const headers = token => ({
  'Content-Type': 'application/json',
  'Authorization': token
});

async function request(url, options) {
  const response = await fetch(url, options);
  if (response.ok) {
    return await response.json();
  } else {
    throw Error(handleResponses(response.status));
  }
}

const expertService = {
  getExperts(token) {
    return request(`${API_URL}/experts`, { method: "GET", headers: headers(token) });
  },

  addExpert(token, payload) {
    return request(`${API_URL}/experts`, {
      method: "POST",
      headers: headers(token),
      body: JSON.stringify(payload)
    });
  },

  editExpert(token, payload) {
    return request(`${API_URL}/experts/${payload._id}`, {
      method: "PUT",
      headers: headers(token),
      body: JSON.stringify(payload)
    });
  },

  removeExpert(token, id) {
    return request(`${API_URL}/experts/${id}`, { method: "DELETE", headers: headers(token) });
  },

  // Vista pública do animal: só registos ativos e dados não sensíveis
  getExpertsByAnimal(token, animalId) {
    return request(`${API_URL}/animals/${animalId}/experts`, { method: "GET", headers: headers(token) });
  }
};

function handleResponses(code) {
  let message = ""
  switch (code) {
    case 401:
      message = "Não está autorizado a executar esta ação!"
      break;
    case 406:
      message = "Dados inválidos. Verifique os campos e as associações."
      break;
    default:
      message = "Mensagem desconhecida"
      break;
  }
  return message
}

export default expertService;
