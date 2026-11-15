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

const sponsorService = {
  getSponsors(token) {
    return request(`${API_URL}/sponsors`, { method: "GET", headers: headers(token) });
  },

  addSponsor(token, payload) {
    return request(`${API_URL}/sponsors`, {
      method: "POST",
      headers: headers(token),
      body: JSON.stringify(payload)
    });
  },

  editSponsor(token, payload) {
    return request(`${API_URL}/sponsors/${payload._id}`, {
      method: "PUT",
      headers: headers(token),
      body: JSON.stringify(payload)
    });
  },

  removeSponsor(token, id) {
    return request(`${API_URL}/sponsors/${id}`, { method: "DELETE", headers: headers(token) });
  },

  // Vista pública do animal: só registos ativos e dados não sensíveis
  getSponsorsByAnimal(token, animalId) {
    return request(`${API_URL}/animals/${animalId}/sponsors`, { method: "GET", headers: headers(token) });
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

export default sponsorService;
