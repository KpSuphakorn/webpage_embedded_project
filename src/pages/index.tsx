import { useEffect, useState } from "react";
import { 
    fetchWaters, 
    fetchEmotions, 
    fetchWatersByDate, 
    fetchEmotionsByDate 
} from "../libs/api";

interface WaterData {
    _id: string;
    date: string;
    water_time: { time: string }[];
}

interface Emotion {
    emotion: string;
    count: number;
}

const Home = () => {
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
        <div>
            <h1>Dashboard</h1>

            {/* Section: Watering Data */}
            <section>
                <h2>Watering Data</h2>
                {waters.map((water) => (
                    <div key={water._id}>
                        <h3>{water.date}</h3>
                        <p>Times: {water.water_time.length}</p>
                    </div>
                ))}
            </section>

            {/* Section: Emotions */}
            <section>
                <h2>Emotions</h2>
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
