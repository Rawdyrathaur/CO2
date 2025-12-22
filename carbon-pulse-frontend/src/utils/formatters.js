export const getPerMessageImpact = (totalKg, messageCount) => {
  if (messageCount === 0) return 0;
  return (totalKg * 1000) / messageCount; // Convert kg to grams
};

export const formatNumber = (num, decimals = 2) => {
  return Number(num).toFixed(decimals);
};

export const formatCarbonKg = (kg) => {
  return kg.toFixed(4);
};
