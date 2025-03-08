import React, { useState } from 'react';
import { format } from 'date-fns';

interface DateRangeSelectorProps {
    startDate: Date;
    endDate: Date;
    onDateRangeChange: (start: Date, end: Date) => void;
}

export default function DateRangeSelector({
    startDate,
    endDate,
    onDateRangeChange
}: DateRangeSelectorProps) {
    const [localStartDate, setLocalStartDate] = useState(format(startDate, 'yyyy-MM-dd'));
    const [localEndDate, setLocalEndDate] = useState(format(endDate, 'yyyy-MM-dd'));

    const handleApply = () => {
        const start = new Date(localStartDate);
        const end = new Date(localEndDate);
        onDateRangeChange(start, end);
    };

    const quickRanges = [
        { label: 'Last 7 Days', days: 7 },
        { label: 'Last 30 Days', days: 30 },
        { label: 'Last 90 Days', days: 90 },
        { label: 'This Year', days: 365 }
    ];

    const handleQuickRange = (days: number) => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - days);

        setLocalStartDate(format(start, 'yyyy-MM-dd'));
        setLocalEndDate(format(end, 'yyyy-MM-dd'));
        onDateRangeChange(start, end);
    };

    return (
        <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
                <label className="text-sm">From:</label>
                <input
                    type="date"
                    value={localStartDate}
                    onChange={(e) => setLocalStartDate(e.target.value)}
                    className="border rounded px-2 py-1"
                />
            </div>
            <div className="flex items-center space-x-2">
                <label className="text-sm">To:</label>
                <input
                    type="date"
                    value={localEndDate}
                    onChange={(e) => setLocalEndDate(e.target.value)}
                    className="border rounded px-2 py-1"
                />
            </div>
            <button
                onClick={handleApply}
                className="btn btn-secondary"
            >
                Apply
            </button>
            <div className="flex space-x-2">
                {quickRanges.map((range) => (
                    <button
                        key={range.label}
                        onClick={() => handleQuickRange(range.days)}
                        className="btn btn-secondary text-xs"
                    >
                        {range.label}
                    </button>
                ))}
            </div>
        </div>
    );
}