import React, { useState } from "react";
import Webcam from "react-webcam";
import Slider from "./Slider";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from '@windmill/react-ui'



const Recorder = () => {
  const [timer, setTimer] = useState(2);
  const handleTimer = (event) => {
    setTimer(event.target.value);
  };

  // Webcam npm
  const webcamRef = React.useRef(null);
  const mediaRecorderRef = React.useRef(null);
  const [capturing, setCapturing] = React.useState(false);
  const [preview, setPreview] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);

  // Handling data
  const handleDataAvailable = React.useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStartCaptureClick = React.useCallback(() => {
    setCapturing(true);
    console.log("Timer in recording button:", timer);
    setTimeout(handleStopCaptureClick, timer * 60000);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleDataAvailable, timer]);

  const handleStopCaptureClick = React.useCallback(() => {
    if (mediaRecorderRef.current.state === "inactive") {
      setCapturing(false);
    } else {
      mediaRecorderRef.current.stop();
    }
    setCapturing(false);
  }, [mediaRecorderRef, setCapturing]);

  const handleDownload = React.useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "react-webcam-stream-capture.webm";
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  const closeModal = () => {
    document.getElementById("previewModal").style.display = "none";
    setPreview(false);
  };

  return (
    <div>
      <div class="max-w-md mx-auto mt-4 bg-white rounded-xl shadow-xl overflow-hidden md:max-w-2xl">
        <div class="md:flex">
          <div class="md:shrink-0 rounded-lg p-4">
            <Webcam audio={false} ref={webcamRef} className="py-4" />
          </div>
          <div class="p-8">
            <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold"> <Slider
              timer={timer}
              handleTimer={handleTimer}
            /></div>
            <div class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">{capturing ? (
              <button
                className="flex bg-red-700 hover:bg-red-300 text-sm md:text-lg text-white text-center p-2 rounded"
                onClick={handleStopCaptureClick}
              >
                <svg width="24" height="24" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                  <path d="M6.5 7H3.6C3.26863 7 3 7.26863 3 7.6V16.4C3 16.7314 3.26863 17 3.6 17H14.4C14.7314 17 15 16.7314 15 16.4V15M11.5 7H14.4C14.7314 7 15 7.26863 15 7.6V10.719C15 11.2277 15.5933 11.5056 15.9841 11.1799L20.0159 7.82009C20.4067 7.49443 21 7.77232 21 8.28103V15.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M3 3L21 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                Stop Recording
              </button>
            ) : (
              <button
                className="flex bg-gray-400 hover:bg-gray-900 text-white text-sm md:text-lg text-center py-2 px-2 rounded"
                onClick={handleStartCaptureClick}
              >
                <svg width="24" height="24" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                  <path d="M15 12V16.4C15 16.7314 14.7314 17 14.4 17H3.6C3.26863 17 3 16.7314 3 16.4V7.6C3 7.26863 3.26863 7 3.6 7H14.4C14.7314 7 15 7.26863 15 7.6V12ZM15 12L20.0159 7.82009C20.4067 7.49443 21 7.77232 21 8.28103V15.719C21 16.2277 20.4067 16.5056 20.0159 16.1799L15 12Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                Start Recording
              </button>
            )}</div>
            <div class="mt-2 text-slate-500">{recordedChunks.length > 0 && (
              <div className="d-flex">
                <button
                  className="flex bg-transparent border border-green-500 text-sm md:text-lg text-green-500 hover:bg-green-500 hover:text-white text-center p-2 my-4 rounded"
                  onClick={handleDownload}
                >
                  <svg width="24" height="24" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-2">
                    <path d="M12 13V22M12 22L15.5 18.5M12 22L8.5 18.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M20 17.6073C21.4937 17.0221 23 15.6889 23 13C23 9 19.6667 8 18 8C18 6 18 2 12 2C6 2 6 6 6 8C4.33333 8 1 9 1 13C1 15.6889 2.50628 17.0221 4 17.6073" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  Download
                </button>
                <button type="button"
                  class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                  data-bs-toggle="modal" data-bs-target="#videoModalFullscreen">
                  PreView VIDeo
                </button>
                {/* <button
                  className="flex bg-transparent border border-yellow-500 text-sm md:text-lg text-yellow-500 hover:bg-yellow-500 hover:text-white text-center py-2 px-4 rounded"
                  onClick={() => setPreview(true)}>

                  <svg width="24" height="24" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-2">
                    <path d="M21 7.6V20.4C21 20.7314 20.7314 21 20.4 21H7.6C7.26863 21 7 20.7314 7 20.4V7.6C7 7.26863 7.26863 7 7.6 7H20.4C20.7314 7 21 7.26863 21 7.6Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M18 4H4.6C4.26863 4 4 4.26863 4 4.6V18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M12.9087 11.5452C12.5088 11.3053 12 11.5933 12 12.0597V15.9403C12 16.4067 12.5088 16.6947 12.9087 16.4548L16.1425 14.5145C16.5309 14.2815 16.5309 13.7185 16.1425 13.4855L12.9087 11.5452Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  Preview

                </button> */}
              </div>
            )}</div>
          </div>
        </div>
      </div>

      <Modal isOpen={preview} onClose={closeModal} id="previewModal" className="z-50">
        <ModalHeader>Preview your recording</ModalHeader>
        <ModalBody>
          <video controls>
            <source
              src={URL.createObjectURL(
                new Blob(recordedChunks, { type: "video/webm" })
              )}
              type="video/webm"
            />
          </video>
        </ModalBody>
        <button className="flex bg-transparent border border-red-500 text-sm md:text-lg text-red-500 hover:bg-green-500 hover:text-white text-center p-2 my-4 rounded" onClick={closeModal}>X Close preview</button>
        <button
          className="flex bg-transparent border border-green-500 text-sm md:text-lg text-green-500 hover:bg-green-500 hover:text-white text-center p-2 my-4 rounded"
          onClick={handleDownload}
        >
          <svg width="24" height="24" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-2">
            <path d="M12 13V22M12 22L15.5 18.5M12 22L8.5 18.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M20 17.6073C21.4937 17.0221 23 15.6889 23 13C23 9 19.6667 8 18 8C18 6 18 2 12 2C6 2 6 6 6 8C4.33333 8 1 9 1 13C1 15.6889 2.50628 17.0221 4 17.6073" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          Download
        </button>

      </Modal>
    </div>
  );
};

export default Recorder;
