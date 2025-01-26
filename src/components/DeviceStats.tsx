import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

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

const DeviceStats = ({ stats }: LocationStats) => {
    const deviceCount = stats.reduce<Record<string, number>>((acc, item) => {
        if (!acc[item.device]) {
            acc[item.device] = 0;
        }
        acc[item.device]++;
        return acc;
    }, {});

    const result = Object.keys(deviceCount).map((device) => ({
        device,
        count: deviceCount[device],
    }));

    return (
        <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
                <PieChart width={700} height={400}>
                    <Pie
                        data={result}
                        labelLine={false}
                        label={({ device, percent }) =>
                            `${device}: ${(percent * 100).toFixed(0)}%`
                        }
                        dataKey="count"
                    >
                        {result.map((_, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export default DeviceStats