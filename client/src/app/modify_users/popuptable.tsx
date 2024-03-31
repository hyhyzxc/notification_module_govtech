import { useState, useEffect } from 'react';
import axios from 'axios';

type PopupTableProps = {
  onClose: () => void;
};

const PopupTable: React.FC<PopupTableProps> = ({onClose}) => {
  
    

  

  return (
    <>
      
      {(
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-md">
            <h2 className="text-lg font-semibold mb-4">Popup Table Content</h2>
            <table className="w-full">
              {/* Table content goes here */}
            </table>
            <button
              onClick={() => {
                onClose();
              }}
              className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PopupTable;
