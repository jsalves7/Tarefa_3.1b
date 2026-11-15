// Textos visíveis para os valores internos (sem acentos) guardados na API
export const SPONSOR_TYPES = {
  empresa: "Empresa",
  instituicao: "Instituição",
  particular: "Particular"
};

export const ANIMAL_GROUPS = {
  anfibio: "Anfíbio",
  ave: "Ave",
  mamifero: "Mamífero",
  peixe: "Peixe",
  reptil: "Réptil"
};

export const typeLabel = type => SPONSOR_TYPES[type] || type;
export const groupLabel = group => ANIMAL_GROUPS[group] || group;
