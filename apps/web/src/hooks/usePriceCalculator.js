
export const NORMAL_SUBJECTS = [
  '1 matéria',
  '2 matérias',
  '3 matérias',
  '4 matérias',
  '5 matérias',
  '6 matérias'
];

export const TRANSVERSAL_SUBJECTS = [
  '1 matéria',
  '2 matérias',
  '3 matérias',
  '4 matérias',
  '5 matérias'
];

export const PRICING = {
  fullPortal: 135,
  fullPortalWithReferral: 100
};

export function calculateNormalSubjectPrice(subjectName) {
  if (!subjectName) return 0;
  // Extrai o número do nome da matéria (ex: "2 matérias" -> 2)
  const match = subjectName.match(/\d+/);
  const number = match ? parseInt(match[0], 10) : 0;
  return number * 10;
}

export function calculateTransversalPrice(subjectName) {
  if (!subjectName) return 0;
  // Extrai o número do nome da matéria transversal (ex: "3 matérias" -> 3)
  const match = subjectName.match(/\d+/);
  const number = match ? parseInt(match[0], 10) : 0;
  return number * 15;
}

export function calculateTotalPrice(normalSubjectName, transversalSubjectName) {
  let total = 0;
  if (normalSubjectName) {
    total += calculateNormalSubjectPrice(normalSubjectName);
  }
  if (transversalSubjectName) {
    total += calculateTransversalPrice(transversalSubjectName);
  }
  return total;
}

export function getPlanName(planType) {
  if (planType === 'full') return 'Portal completo';
  if (planType === 'fullWithReferral') return 'Portal completo com indicação';
  return 'Matérias individuais';
}
