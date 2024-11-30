export const fetchWaters = async () => {
    const response = await fetch("https://favourable-dani-maiimmainorn-89734900.koyeb.app/waters");
    console.log("Response status:", response.status);
    if (!response.ok) {
        throw new Error("Failed to fetch waters");
    }
    return response.json();
};
  
export const fetchEmotions = async () => {
    const response = await fetch("https://favourable-dani-maiimmainorn-89734900.koyeb.app/emotions");
    if (!response.ok) {
        throw new Error("Failed to fetch emotions");
    }
    return response.json();
};

export const fetchWatersByDate = async (date: string) => {
    const response = await fetch(`https://favourable-dani-maiimmainorn-89734900.koyeb.app/waters/${date}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch waters for date: ${date}`);
    }
    return response.json();
};

export const fetchEmotionsByDate = async (date: string) => {
    const response = await fetch(`https://favourable-dani-maiimmainorn-89734900.koyeb.app/emotions/${date}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch emotions for date: ${date}`);
    }
    return response.json();
};

  