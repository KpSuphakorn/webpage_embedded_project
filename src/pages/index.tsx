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
    const [emotions, setEmotions] = useState<Emotion[]>([]);
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

    const handleFetchEmotionsByDate = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchEmotionsByDate(date);
            setFilteredEmotions(response.data?.[0]?.emotions || []);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 bg-secondary h-screen bg-cover bg-center">
            <h1 className="text-mobile-h1 md:text-desktop-h1 text-primary">Dashboard</h1>

            {/* Section: Watering Data */}
            <section className="my-4 bg-light-grey p-4 rounded-3xl">
                <h2 className="text-secondary text-mobile-h2 md:text-desktop-h2">Watering Data</h2>

                {waters.map((water) => (
                    <div key={water._id}>
                        <h3 className="text-dark-transparent text-mobile-h2 md:text-desktop-h3">{water.date}</h3>
                        <div className="text-mobile-base md:text-desktop-base flex">
                            <p className="text-secondary" >Times :&nbsp;</p>
                            <p className="t">{water.water_time.length}</p>
                        </div>
                    </div>
                ))}
            </section>

            {/* Section: Emotions */}
            <section className="bg-light-grey p-4 rounded-3xl">
                <h2 className="text-secondary text-mobile-h2 md:text-desktop-h2">Emotions</h2>
                <ul>
                    {emotions.map((emotion, index) => (
                        <li key={`${emotion.emotion}-${index}`}>
                            {emotion.emotion}: {emotion.count}
                        </li>
                    ))}
                </ul>
            </section>

            {/* Section: Search by Date */}
            <section>
                <h2>Search Data by Date</h2>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                <button onClick={handleFetchWatersByDate} disabled={!date || loading}>
                    {loading ? "Loading Waters..." : "Fetch Waters"}
                </button>
                <button onClick={handleFetchEmotionsByDate} disabled={!date || loading}>
                    {loading ? "Loading Emotions..." : "Fetch Emotions"}
                </button>
                {error && <p style={{ color: "red" }}>Error: {error}</p>}

                {/* Filtered Water Data */}
                <h3>Watering Results for: {date}</h3>
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

                {/* Filtered Emotion Data */}
                <h3>Emotion Results for: {date}</h3>
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
            </section>
        </div>
    );
};

export default Home;
