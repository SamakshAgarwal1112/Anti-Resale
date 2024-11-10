import React, { useState } from 'react';
import { Button } from './ui/button';

const AadharModal = ({ onClose, onSubmit }) => {
    const [aadharId, setAadharId] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { value } = e.target;
        if (/^\d*$/.test(value)) {
            setAadharId(value);
            if (value.length === 12) {
                setError('');
            }
        }
    };

    const handleSubmit = () => {
        if (aadharId.length < 12) {
            setError('Aadhar ID must be 12 digits');
            return;
        }
        onSubmit(aadharId); // Call the parent function to send Aadhar ID to the backend
        onClose(); // Close the modal after submission
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-80 text-center shadow-lg">
                <h2 className="text-lg font-semibold text-blue-600 mb-4">Enter Your Aadhar ID</h2>
                <input
                    type="text"
                    value={aadharId}
                    onChange={handleChange}
                    maxLength="12"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                    placeholder="12-digit Aadhar ID"
                />
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                <div className="mt-4 flex justify-center space-x-4">
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">
                        Submit
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AadharModal;
