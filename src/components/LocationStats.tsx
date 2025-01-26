import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface StatsProp {
    city: string
    country: string
    created_at: string
    device: string
    id: string
    url_id: string
}

interface LocationStats {
    stats: StatsProp[]
}

const LocationStats = ({ stats }: LocationStats) => {
    const cityCount = stats.reduce<Record<string, number>>((acc, item) => {
        if (acc[item.city]) {
            acc[item.city] += 1;
        } else {
            acc[item.city] = 1;
        }
        return acc;
    }, {});

    const cities = Object.entries(cityCount).map(([city, count]) => ({
        city,
        count,
    }));

    return (
        <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
                <LineChart width={700} height={300} data={cities.slice(0, 5)}>
                    <XAxis dataKey="city" />
                    <YAxis />
                    <Tooltip labelStyle={{ color: "green" }} />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default LocationStats