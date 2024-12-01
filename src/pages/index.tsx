import { useEffect, useState } from "react";
import { 
    fetchWaters, 
    fetchEmotions, 
    fetchWatersByDate, 
    fetchEmotionsByDate,
    fetchOverallRealtime,
    fetchOverallInRoom
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

interface Realtime {
    airQuality_string: string;
    airQuality_val: number;
    humidity: number;
    id: string;
    lightIntensity_string: string;
    lightIntensity_val: number;
    soilMoisture: number;
    temperature: number;
}

interface YourRoom {
    "_id": string,
    "date": string,
    "id": string,
    "count": number,
    "timestamp": string,
    "averages": {
      "temperature": number,
      "humidity": number,
      "airQuality_val": number,
      "lightIntensity_val": number,
      "soilMoisture": number
    },
    "min_values": {
      "temperature": number,
      "humidity": number,
      "airQuality_val": number,
      "lightIntensity_val": number,
      "soilMoisture": number
    },
    "max_values": {
      "temperature": number,
      "humidity": number,
      "airQuality_val": number,
      "lightIntensity_val": number,
      "soilMoisture": number
    }
  }

function Home() {

    setTimeout(async () =>{
        const response = await fetchOverallRealtime();
        setOverallRealtime(response);
    }, 3000)
    const [waters, setWaters] = useState<WaterData[]>([]);
    // const [emotions, setEmotions] = useState<Emotion[]>([]);
    const [filteredWaters, setFilteredWaters] = useState<WaterData[]>([]);
    const [filteredEmotions, setFilteredEmotions] = useState<Emotion[]>([]);
    // const [overallRealtime , setOverallRealtime] = useState<Realtime>();
    const [overallRealtime, setOverallRealtime] = useState<Realtime>({
        airQuality_string: '',
        airQuality_val: 0,
        humidity: 0,
        id: '',
        lightIntensity_string: '',
        lightIntensity_val: 0,
        soilMoisture: 0,
        temperature: 0
    });    
    const [yourRoom, setYourRoom] = useState<YourRoom[]>([]);
    const [date, setDate] = useState<string>(() => {
        const options: Intl.DateTimeFormatOptions = { 
            timeZone: 'Asia/Bangkok', 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit' 
        };
        const todayInBangkok = new Intl.DateTimeFormat('en-GB', options).format(new Date());
        return todayInBangkok.split('/').reverse().join('-'); // Convert to YYYY-MM-DD format
    });
    
    const [displayDate, setDisplayDate] = useState<String>()

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const waterResponse = await fetchWaters();
                const emotionResponse = await fetchEmotions();
                setWaters(waterResponse.data);
                setEmotions(emotionResponse.data.flatMap((item: any) => item.emotions || []));
                handleFetchOverallRealtime();
                handleFetch();
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
            console.log(date)
            console.log(response)
            setFilteredWaters(response.data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };
    
    const handleFetchOverallRealtime = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchOverallRealtime();
            setOverallRealtime(response);
            console.log(response);
            console.log(response);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }

    const handleFetchYourRoom = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchOverallInRoom(date);
            setYourRoom(response.data);
            console.log(response.data)
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }

    const [emotions, setEmotions] = useState([
        { name: "angry", count: 0 },
        { name: "fear", count: 0 },
        { name: "neutral", count: 0 },
        { name: "sad", count: 0 },
        { name: "disgust", count: 0 },
        { name: "happy", count: 0 },
        { name: "surprise", count: 0 },
      ]);

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
            const defaultEmotions: Emotion[] = [
                { emotion: "angry", count: 0 },
                { emotion: "fear", count: 0 },
                { emotion: "neutral", count: 0 },
                { emotion: "sad", count: 0 },
                { emotion: "disgust", count: 0 },
                { emotion: "happy", count: 0 },
                { emotion: "surprise", count: 0 },
            ];
            
            setDisplayDate(date)
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

    const handleFetch = async () => {
        setLoading(true);
        setError(null);
    
        try {
          // Call each fetch function here
          await handleFetchEmotionsByDate();
          await handleFetchWatersByDate();
          await handleFetchYourRoom();
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
      };
    

    return (
        <div className="p-4 bg-white h-full bg-cover bg-center">
            <h1 className="text-6xl font-bold flex justify-center mt-12 text-secondary">Dashboard</h1>

            {/* Section: Watering Data */}
            <section className="flex justify-center my-4 border-2 border-secondary p-4 rounded-3xl">
                <div className="flex flex-col">
                    <div className="flex justify-center items-center">
                        <h2 className="text-secondary text-3xl font-extrabold text-center my-4">Overall at Now</h2>
                        <button onClick={handleFetchOverallRealtime}>
                            <img src="./overall/refresh.png" alt="refresh" className="w-[24px] h-[24px] ml-2"/>
                        </button>
                    </div>


                    {/* {waters.map((water) => (
                        <div className="flex flex-col items-center mb-4" key={water._id}>
                            <h3 className="text-dark-transparent text-mobile-h2 md:text-desktop-h3">{water.date}</h3>
                            <div className="text-mobile-base md:text-desktop-base flex">
                                <p className="text-secondary">Times: &nbsp;</p>
                                <p>{water.water_time.length}</p>
                            </div>
                        </div>
                    ))} */}

                    {/* temp , humi , air , light , soil */}
                        {/* <div>
                            <p>Air Quality: {overallRealtime.airQuality_string} ({overallRealtime.airQuality_val})</p>
                            <p>Humidity: {overallRealtime.humidity}%</p>
                            <p>Light Intensity: {overallRealtime.lightIntensity_string} ({overallRealtime.lightIntensity_val})</p>
                            <p>Soil Moisture: {overallRealtime.soilMoisture}%</p>
                            <p>Temperature: {overallRealtime.temperature}°C</p>
                        </div> */}
                    <div className="flex justify-center items-center text-lg text-dark-transparent font-semibold">
                        <div className="flex-col justify-center items-center">
                            <div className="flex justify-center">
                                <img className="w-1/3" src="./overall/temp.png" alt="temp" />
                            </div>
                            <div className="flex justify-center">
                                <p className="mt-2">Temperature: {overallRealtime.temperature}°C</p>
                            </div>
                        </div>
                        <div className="flex-col justify-center items-center">
                            <div className="flex justify-center">
                                <img className="w-1/3" src="./overall/humidity.png" alt="humidity" />
                            </div>
                            <div className="flex justify-center">
                                <p className="mt-2">Humidity: {overallRealtime.humidity}%</p>
                            </div>
                        </div>
                        <div className="flex-col justify-center items-center mt-6">
                            <div className="flex justify-center">
                                <img className="w-1/3" src="./overall/air.png" alt="air" />
                            </div>
                            <div className="flex-col justify-center">
                                <p className="mt-2 flex justify-center">Air Quality: {overallRealtime.airQuality_val}</p>
                                <p className=" flex justify-center text-sm">({overallRealtime.airQuality_string})</p>
                            </div>
                        </div>
                        <div className="flex-col justify-center items-center mt-6">
                            <div className="flex justify-center">
                                <img className="w-1/3" src="./overall/light.png" alt="temp" />
                            </div>
                            <div className="flex-col justify-center">
                                <p className="mt-2 flex justify-center">Light Intensity: {overallRealtime.airQuality_val}</p>
                                <p className=" flex justify-center text-sm">({overallRealtime.lightIntensity_string})</p>
                            </div>
                        </div>
                        <div className="flex-col justify-center items-center">
                            <div className="flex justify-center">
                                <img className="w-1/3" src="./overall/soil.png" alt="temp" />
                            </div>
                            <div className="flex justify-center">
                                <p className="mt-2">Soil Moisture: {overallRealtime.soilMoisture}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            <div className="py-4">
                <div className="flex justify-center pb-4">
                    <h2 className="text-secondary text-3xl font-bold">Search Data by Date</h2>
                </div>
                <div className=" justify-center flex">
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
                <div className="flex justify-center mt-4">
                    <button
                        onClick={handleFetch}
                        disabled={!date || loading}
                        className="text-white text-xl font-semibold bg-secondary hover:bg-secondary-hover px-4 py-3 rounded w-60"
                    >
                        {loading ? "Finding Data..." : "Search"}
                    </button>
                </div>
            </div>


            {/* Section: Emotions */}
            <section className="bg-white border-2 border-secondary p-4 rounded-3xl flex-col justify-center">
                <div className="flex content-center justify-center">
                    <h2 className="text-secondary text-3xl font-bold">Emotions</h2>
                </div>
                {/* Filtered Emotion Data */}
                <div className="flex justify-center">
                    <h3 className="text-2xl font-extrabold text-secondary">Emotion Results for: {displayDate}</h3>
                </div>
                <div className="flex flex-col md:flex-row min-h-24">
                    {/* First Group: angry fear */}
                    <div className="flex flex-col md:flex-row mb-4 md:mb-0">
                        <div className="flex-col justify-center md:mx-4 mx-2 ">
                            <div className="flex justify-center">
                                <img src="./emotion/angry.svg" alt="angry" className=" w-1/6 md:w-1/2" />
                            </div>
                            <p className="text-desktop-highlight flex justify-center mt-4">{getEmotionPercentage("angry")}%</p>
                            <p className="text-desktop-highlight flex justify-center ">Angry : {filteredEmotions.find((e) => e.emotion === "angry")?.count || 0}</p>
                        </div>
                        <div className="flex-col justify-center md:mx-4 mt-4 md:mt-0 mx-2">
                            <div className="flex justify-center">
                                <img src="./emotion/fear.svg" alt="fear" className=" w-1/6 md:w-1/2" />
                            </div>
                            <p className="text-desktop-highlight flex justify-center mt-4">{getEmotionPercentage("fear")}%</p>
                            <p className="text-desktop-highlight flex justify-center ">Fear : {filteredEmotions.find((e) => e.emotion === "fear")?.count || 0}</p>
                        </div>
                    </div>

                    {/* Second Group: neutral sad */}
                    <div className="flex flex-col md:flex-row mb-4 md:mb-0">
                        <div className="flex-col justify-center md:mx-4 mx-2 md:">
                            <div className="flex justify-center">
                                <img src="./emotion/neutral.svg" alt="neutral" className=" w-1/6 md:w-1/2" />
                            </div>
                            <p className="text-desktop-highlight flex justify-center mt-4">{getEmotionPercentage("neutral")}%</p>
                            <p className="text-desktop-highlight flex justify-center ">Neutral : {filteredEmotions.find((e) => e.emotion === "neutral")?.count || 0}</p>
                        </div>
                        <div className="flex-col justify-center md:mx-4 mt-4 md:mt-0 mx-2">
                            <div className="flex justify-center">
                                <img src="./emotion/sad.svg" alt="sad" className=" w-1/6 md:w-1/2" />
                            </div>
                            <div className="text-desktop-highlight flex justify-center mt-4">{getEmotionPercentage("sad")}%</div>
                            <p className="text-desktop-highlight flex justify-center ">Sad : {filteredEmotions.find((e) => e.emotion === "sad")?.count || 0}</p>
                        </div>
                    </div>

                    {/* Third Group: disgust happy */}
                    <div className="flex flex-col md:flex-row mb-4 md:mb-0">
                        <div className="flex-col justify-center md:mx-4 mx-2 md:">
                            <div className="flex justify-center">
                                <img src="./emotion/disgust.svg" alt="disgust" className=" w-1/6 md:w-1/2" />
                            </div>
                            <p className="text-desktop-highlight flex justify-center mt-4">{getEmotionPercentage("disgust")}%</p>
                            <p className="text-desktop-highlight flex justify-center ">Disgust : {filteredEmotions.find((e) => e.emotion === "disgust")?.count || 0}</p>
                        </div>
                        <div className="flex-col items-center justify-center md:mx-4 mt-4 md:mt-0 mx-2">
                            <div className="flex justify-center">
                                <img src="./emotion/happy.svg" alt="happy" className=" w-1/6 md:w-1/2" />
                            </div>
                            <p className="text-desktop-highlight flex justify-center mt-4">{getEmotionPercentage("happy")}%</p>
                            <p className="text-desktop-highlight flex justify-center ">Happy : {filteredEmotions.find((e) => e.emotion === "happy")?.count || 0}</p>
                        </div>
                    </div>

                    {/* Surprise */}
                    <div className="flex flex-col md:flex-row mb-4 md:mb-0">
                        <div className="flex-col items-center justify-center md:mx-4 mx-2 md:">
                            <div className="flex justify-center">
                                <img src="./emotion/surprise.svg" alt="Surprise" className=" w-1/6 md:w-1/2" />
                            </div>
                            <p className="text-desktop-highlight flex justify-center mt-4">{getEmotionPercentage("surprise")}%</p>
                            <p className="text-desktop-highlight flex justify-center ">Surprise : {filteredEmotions.find((e) => e.emotion === "surprise")?.count || 0}</p>
                        </div>
                    </div>
                    
                </div>
            </section>

            {/* Section: Search by Date */}
            <section className="flex-col align-center text-xl my-8">
                <div className="bg-white border-2 border-secondary rounded-3xl flex-col justify-center w-100 my-4 py-4">
                    {/* <div className=" justify-center flex">
                        <button onClick={handleFetchWatersByDate} disabled={!date || loading}>
                            {loading ? "Loading Waters..." : "Fetch Waters"}
                        </button>
                    </div> */}
                    {error && <p style={{ color: "red" }}>Error: {error}</p>}

                    <div className="flex content-center justify-center">
                        <h2 className="text-secondary text-3xl font-bold">Watering</h2>
                    </div>

                    {/* Filtered Water Data */}
                    <div className="flex justify-center">
                        <h3 className="text-2xl font-extrabold text-secondary">Watering Results for: {date}</h3>
                    </div>

                    <div className="flex justify-center my-2">
                        <img src="./overall/watering.png" alt="watering" className="w-1/12" />
                    </div>


                    <div className="flex justify-center my-4">
                        {filteredWaters.length === 0 ? (
                        <p>No watering data available</p>
                        ) : (
                            filteredWaters.map((water) => (
                                <div className="flex-col justify-center" key={water._id}>
                                    <div className="flex justify-center">
                                        <h3>Date: {water.date}</h3>
                                    </div>
                                    <p>Water times: {water.water_time.map((wt) => wt.time).join(", ")}</p>
                                </div>
                            ))
                        )}
                    </div>

                </div>
            </section>
                
            <section className="flex-col p-4 border-2 border-secondary rounded-3xl">
                <div className="flex justify-center">
                    <h2 className="text-3xl font-bold text-secondary">Overall in your room</h2>
                </div>
                <div>
                    {/* temp , humi , air , light , soil */}
                        {/* <div>
                            <p>Air Quality: {overallRealtime.airQuality_string} ({overallRealtime.airQuality_val})</p>
                            <p>Humidity: {overallRealtime.humidity}%</p>
                            <p>Light Intensity: {overallRealtime.lightIntensity_string} ({overallRealtime.lightIntensity_val})</p>
                            <p>Soil Moisture: {overallRealtime.soilMoisture}%</p>
                            <p>Temperature: {overallRealtime.temperature}°C</p>
                        </div> */}
                    <div className="flex justify-center items-center text-lg text-dark-transparent">
                        <div className="flex-col justify-center items-center mt-6">
                            <div className="flex justify-center">
                                <img className="w-1/3" src="./overall/temp.png" alt="temp" />
                            </div>
                            <div className="flex-col justify-center items-center text-center">
                                <div className="flex justify-center mt-2 font-semibold">Temperature</div>
                                <div className="flex justify-center">Avg: {yourRoom[0]?.averages?.temperature}°C</div>
                                <div className="flex justify-center">Min: {yourRoom[0]?.min_values?.temperature}°C</div>
                                <div className="flex justify-center">Max: {yourRoom[0]?.max_values?.temperature}°C</div>
                            </div>
                        </div>
                        <div className="flex-col justify-center items-center mt-6">
                            <div className="flex justify-center">
                                <img className="w-1/3" src="./overall/humidity.png" alt="humidity" />
                            </div>
                            <div className="flex-col justify-center items-center text-center">
                                <div className="flex justify-center mt-2 font-semibold">Humidity</div>
                                <div className="flex justify-center">Avg: {yourRoom[0]?.averages?.humidity}%</div>
                                <div className="flex justify-center">Min: {yourRoom[0]?.min_values?.humidity}%</div>
                                <div className="flex justify-center">Max: {yourRoom[0]?.max_values?.humidity}%</div>
                            </div>
                        </div>
                        <div className="flex-col justify-center items-center mt-6">
                            <div className="flex justify-center">
                                <img className="w-1/3" src="./overall/air.png" alt="air" />
                            </div>
                            <div className="flex-col justify-center">
                                <p className="mt-2 flex justify-center font-semibold">Air Quality</p>
                                <div className="flex justify-center">Avg: {yourRoom[0]?.averages?.airQuality_val}</div>
                                <div className="flex justify-center">Min: {yourRoom[0]?.min_values?.airQuality_val}</div>
                                <div className="flex justify-center">Max: {yourRoom[0]?.max_values?.airQuality_val}</div>
                            </div>
                        </div>
                        <div className="flex-col justify-center items-center mt-6">
                            <div className="flex justify-center">
                                <img className="w-1/3" src="./overall/light.png" alt="temp" />
                            </div>
                            <div className="flex-col justify-center">
                                <p className="mt-2 flex justify-center font-semibold">Light Intensity</p>
                                <div className="flex justify-center">Avg: {yourRoom[0]?.averages?.lightIntensity_val}</div>
                                <div className="flex justify-center">Min: {yourRoom[0]?.min_values?.lightIntensity_val}</div>
                                <div className="flex justify-center">Max: {yourRoom[0]?.max_values?.lightIntensity_val}</div>
                            </div>
                        </div>
                        <div className="flex-col justify-center items-center mt-6">
                            <div className="flex justify-center">
                                <img className="w-1/3" src="./overall/soil.png" alt="temp" />
                            </div>
                            <div className="flex-col justify-center">
                                <div className="mt-2 flex justify-center font-semibold">Soil Moisture</div>
                                <div className="flex justify-center">Avg: {yourRoom[0]?.averages?.soilMoisture}</div>
                                <div className="flex justify-center">Min: {yourRoom[0]?.min_values?.soilMoisture}</div>
                                <div className="flex justify-center">Max: {yourRoom[0]?.max_values?.soilMoisture}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
        </div>
    );
};

export default Home;
