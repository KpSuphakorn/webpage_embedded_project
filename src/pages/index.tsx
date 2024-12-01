import { useEffect, useState } from "react";
import { 
    fetchWaters, 
    fetchEmotions, 
    fetchWatersByDate, 
    fetchEmotionsByDate 
} from "../libs/api";
// import '../global.css';


interface WaterData {
    _id: string;
    date: string;
    water_time: { time: string }[];
}

interface Emotion {
    emotion: string;
    count: number;
}

function Home() {
    const [waters, setWaters] = useState<WaterData[]>([]);
    // const [emotions, setEmotions] = useState<Emotion[]>([]);
    const [filteredWaters, setFilteredWaters] = useState<WaterData[]>([]);
    const [filteredEmotions, setFilteredEmotions] = useState<Emotion[]>([]);
    const [date, setDate] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const waterResponse = await fetchWaters();
                const emotionResponse = await fetchEmotions();
                setWaters(waterResponse.data);
                setEmotions(emotionResponse.data.flatMap((item: any) => item.emotions || []));
            } catch (err) {
                setError((err as Error).message);
            }
        };
        fetchData();
    }, []);

    // Fetch data by date
    const handleFetchWatersByDate = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchWatersByDate(date);
            setFilteredWaters(response.data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const [emotions, setEmotions] = useState([
        { name: "angry", count: 0 },
        { name: "fear", count: 0 },
        { name: "neutral", count: 0 },
        { name: "sad", count: 0 },
        { name: "disgust", count: 0 },
        { name: "happy", count: 0 },
        { name: "surprise", count: 0 },
      ]);

    // const handleFetchEmotionsByDate = async () => {
    //     setLoading(true);
    //     setError(null);
    //     try {
    //         const response = await fetchEmotionsByDate(date);
    //         setFilteredEmotions(response.data?.[0]?.emotions || []);
    //     } catch (err) {
    //         setError((err as Error).message);
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    const angryCount = filteredEmotions.find((e) => e.emotion === "angry")?.count || 0;
    const fearCount = filteredEmotions.find((e) => e.emotion === "fear")?.count || 0;
    const neutralCount = filteredEmotions.find((e) => e.emotion === "neutral")?.count || 0;
    const sadCount = filteredEmotions.find((e) => e.emotion === "sad")?.count || 0;
    const disgustCount = filteredEmotions.find((e) => e.emotion === "disgust")?.count || 0;
    const happyCount = filteredEmotions.find((e) => e.emotion === "happy")?.count || 0;
    const surpriseCount = filteredEmotions.find((e) => e.emotion === "surprise")?.count || 0;

    const handleFetchEmotionsByDate = async () => {
        setLoading(true);
        setError(null);
    
        try {
            const response = await fetchEmotionsByDate(date);
    
            // สร้าง array ของอารมณ์ที่มีค่าเริ่มต้นเป็น 0
            const defaultEmotions: Emotion[] = [
                { emotion: "angry", count: 0 },
                { emotion: "fear", count: 0 },
                { emotion: "neutral", count: 0 },
                { emotion: "sad", count: 0 },
                { emotion: "disgust", count: 0 },
                { emotion: "happy", count: 0 },
                { emotion: "surprise", count: 0 },
            ];
    
            // ดึงข้อมูลจาก response และอัปเดต count ตามอารมณ์ที่มีใน response
            const updatedEmotions = defaultEmotions.map((emotion) => {
                const found = response.data?.[0]?.emotions.find(
                    (e: Emotion) => e.emotion === emotion.emotion
                );
                return found ? { ...emotion, count: found.count } : emotion;
            });
    
            setFilteredEmotions(updatedEmotions); // อัปเดต state ด้วยอารมณ์ที่ปรับแล้ว
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };    

    const totalEmotions = filteredEmotions.reduce((sum, e) => sum + e.count, 0);

    const getEmotionPercentage = (emotionName: string) => {
        const emotion = filteredEmotions.find((e) => e.emotion === emotionName);
        const count = emotion?.count || 0;
        return totalEmotions > 0 ? ((count / totalEmotions) * 100).toFixed(2) : "0.00";
    };

    

    return (
        <div className="p-4 bg-secondary h-full bg-cover bg-center">
            <h1 className="text-6xl font-bold flex justify-center mt-12 text-white">Dashboard</h1>

            {/* Section: Watering Data */}
            <section className="flex justify-center my-4 bg-light-grey p-4 rounded-3xl">
                <div className="flex-col">
                    <h2 className="text-secondary text-mobile-h2 md:text-desktop-h2">Watering Data</h2>

                    {waters.map((water) => (
                        <div className="" key={water._id}>
                            <h3 className="text-dark-transparent text-mobile-h2 md:text-desktop-h3">{water.date}</h3>
                            <div className="text-mobile-base md:text-desktop-base flex">
                                <p className="text-secondary" >Times :&nbsp;</p>
                                <p className="t">{water.water_time.length}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Section: Emotions */}
            <section className="bg-light-grey p-4 rounded-3xl flex-col justify-center">
                <div className="flex content-center justify-center">
                    <h2 className="text-secondary text-mobile-h2 md:text-desktop-h2">Emotions</h2>
                </div>
                {/* <ul>
                    {emotions.map((emotion, index) => (
                        <li key={`${emotion.emotion}-${index}`}>
                            {emotion.emotion}: {emotion.count}
                        </li>
                    ))}
                </ul> */}
                <div className="flex flex-col md:flex-row min-h-24 p-4">
                    {/* First Group: angry fear */}
                    <div className="flex flex-col md:flex-row mb-4 md:mb-0">
                        <div className="flex-col justify-center md:mx-4 mx-2 ">
                            <img src="./emotion/angry.svg" alt="angry" className=" w-1/6 md:w-full" />
                            <p className="text-desktop-highlight flex justify-center mt-4">{getEmotionPercentage("angry")}%</p>
                        </div>
                        <div className="flex-col justify-center md:mx-4 mt-4 md:mt-0 mx-2">
                            <img src="./emotion/fear.svg" alt="fear" className=" w-1/6 md:w-full" />
                            <p className="text-desktop-highlight flex justify-center mt-4">{getEmotionPercentage("fear")}%</p>
                        </div>
                    </div>

                    {/* Second Group: neutral sad */}
                    <div className="flex flex-col md:flex-row mb-4 md:mb-0">
                        <div className="flex-col justify-center md:mx-4 mx-2 md:">
                            <img src="./emotion/neutral.svg" alt="neutral" className=" w-1/6 md:w-full" />
                            <p className="text-desktop-highlight flex justify-center mt-4">{getEmotionPercentage("neutral")}%</p>
                        </div>
                        <div className="flex-col justify-center md:mx-4 mt-4 md:mt-0 mx-2">
                            <img src="./emotion/sad.svg" alt="sad" className=" w-1/6 md:w-full" />
                            <p className="text-desktop-highlight flex justify-center mt-4">{getEmotionPercentage("sad")}%</p>
                        </div>
                    </div>

                    {/* Third Group: disgust happy */}
                    <div className="flex flex-col md:flex-row mb-4 md:mb-0">
                        <div className="flex-col justify-center md:mx-4 mx-2 md:">
                            <img src="./emotion/disgust.svg" alt="disgust" className=" w-1/6 md:w-full" />
                            <p className="text-desktop-highlight flex justify-center mt-4">{getEmotionPercentage("disgust")}%</p>
                        </div>
                        <div className="flex-col justify-center md:mx-4 mt-4 md:mt-0 mx-2">
                            <img src="./emotion/happy.svg" alt="happy" className=" w-1/6 md:w-full" />
                            <p className="text-desktop-highlight flex justify-center mt-4">{getEmotionPercentage("happy")}%</p>
                        </div>
                    </div>

                    {/* Surprise */}
                    <div className="flex flex-col md:flex-row mb-4 md:mb-0">
                        <div className="flex-col justify-center md:mx-4 mx-2 md:">
                            <img src="./emotion/surprise.svg" alt="surprise" className=" w-1/6 md:w-full" />
                            <p className="text-desktop-highlight flex justify-center mt-4">{getEmotionPercentage("surprise")}%</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section: Search by Date */}
            <section className="flex-col align-center text-xl">
                <div className="flex justify-center py-4 ">
                    <h2 className="text-white text-2xl font-bold">Search Data by Date</h2>
                </div>
                <div className="bg-white rounded-3xl flex-col justify-center w-100 my-4 py-4">
                    <div className=" justify-center flex">
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <div className=" justify-center flex">
                        <button onClick={handleFetchWatersByDate} disabled={!date || loading}>
                            {loading ? "Loading Waters..." : "Fetch Waters"}
                        </button>
                    </div>
                    <div className=" justify-center flex">
                        <button onClick={handleFetchEmotionsByDate} disabled={!date || loading}>
                            {loading ? "Loading Emotions..." : "Fetch Emotions"}
                        </button>
                    </div>
                    {error && <p style={{ color: "red" }}>Error: {error}</p>}

                    {/* Filtered Water Data */}
                    <div className="flex justify-center">
                        <h3 className="text-2xl text-bold text-cyan-800">Watering Results for: {date}</h3>
                    </div>
                    <div className="flex justify-center">
                        {filteredWaters.length === 0 ? (
                        <p>No watering data available</p>
                        ) : (
                            filteredWaters.map((water) => (
                                <div key={water._id}>
                                    <h3>Date: {water.date}</h3>
                                    <p>Water times: {water.water_time.map((wt) => wt.time).join(", ")}</p>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Filtered Emotion Data */}
                    <div className="flex justify-center">
                        <h3 className="text-2xl text-bold text-cyan-800">Emotion Results for: {date}</h3>
                    </div>
                    <div className="flex justify-center">
                        {filteredEmotions.length === 0 ? (
                            <p>No emotion data available</p>
                        ) : (
                            <ul>
                                {filteredEmotions.map((emotion) => (
                                    <li key={emotion.emotion}>
                                        {emotion.emotion}: {emotion.count}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
