import React, { useEffect, useRef, useState } from 'react';

const MemoryVisualizer = ({ results }) => {
  const canvasRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [algorithm, setAlgorithm] = useState('fifo');
  const [isAnimating, setIsAnimating] = useState(false);
  const animationFrameRef = useRef(null);
  const animationStateRef = useRef({ progress: 0, direction: 'in' });

  const algorithms = ['fifo', 'lru', 'optimal'];
  const frames = results[algorithm]?.stats?.[0]?.memory.length || 0;
  const steps = results[algorithm]?.stats || [];
  const totalSteps = steps.length;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const frameWidth = 60;
    const frameHeight = 60;
    const frameSpacing = 20;
    const startX = (width - (frames * (frameWidth + frameSpacing) - frameSpacing)) / 2;
    const startY = 100;

    const drawFrame = (x, y, page, isFault, progress, direction) => {
      ctx.beginPath();
      ctx.rect(x, y, frameWidth, frameHeight);
      ctx.strokeStyle = 'black';
      ctx.stroke();
      ctx.fillStyle = isFault ? 'rgba(255, 99, 132, 0.5)' : 'rgba(75, 192, 192, 0.5)';
      ctx.fill();

      if (page) {
        const offset = direction === 'in' ? (1 - progress) * frameWidth : progress * frameWidth;
        const pageX = direction === 'in' ? x + offset : x - offset;
        ctx.beginPath();
        ctx.arc(pageX + frameWidth / 2, y + frameHeight / 2, 20, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(page, pageX + frameWidth / 2, y + frameHeight / 2);
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw title and step info
      ctx.fillStyle = 'black';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${algorithm.toUpperCase()} Memory State`, width / 2, 30);
      ctx.font = '16px Arial';
      ctx.fillText(
        totalSteps > 0
          ? `Step ${currentStep + 1}/${totalSteps} - Page: ${steps[currentStep].page}`
          : 'No simulation data',
        width / 2,
        60
      );

      if (totalSteps === 0) return;

      // Draw frames
      const step = steps[currentStep];
      const prevStep = currentStep > 0 ? steps[currentStep - 1] : null;
      step.memory.forEach((page, i) => {
        const x = startX + i * (frameWidth + frameSpacing);
        const isFault = step.fault;
        let progress = animationStateRef.current.progress;
        let direction = animationStateRef.current.direction;

        // Determine if this page is entering or leaving
        if (prevStep && page !== prevStep.memory[i]) {
          direction = 'in';
        } else if (prevStep && !step.memory.includes(prevStep.memory[i])) {
          direction = 'out';
        }

        drawFrame(x, startY, page, isFault, progress, direction);
      });

      // Draw status
      ctx.fillStyle = step.fault ? 'red' : 'green';
      ctx.font = '16px Arial';
      ctx.fillText(step.fault ? 'Fault' : 'Hit', width / 2, startY + frameHeight + 30);
    };

    const animate = () => {
      if (!isAnimating) return;
      animationStateRef.current.progress += 0.05;
      if (animationStateRef.current.progress >= 1) {
        animationStateRef.current.progress = 0;
        setIsAnimating(false);
      }
      draw();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    draw();
    if (isAnimating) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentStep, algorithm, results, isAnimating]);

  const handleNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      setIsAnimating(true);
      animationStateRef.current = { progress: 0, direction: 'in' };
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setIsAnimating(true);
      animationStateRef.current = { progress: 0, direction: 'out' };
    }
  };

  const handleAlgorithmChange = (algo) => {
    setAlgorithm(algo);
    setCurrentStep(0);
    setIsAnimating(false);
    animationStateRef.current = { progress: 0, direction: 'in' };
  };

  return (
    <div className="p-4 bg-white rounded shadow mt-4">
      <h2 className="text-xl font-semibold mb-4">Memory Visualization</h2>
      <div className="mb-4">
        <label className="mr-2">Algorithm:</label>
        <select
          value={algorithm}
          onChange={(e) => handleAlgorithmChange(e.target.value)}
          className="border p-2 rounded"
        >
          {algorithms.map((algo) => (
            <option key={algo} value={algo}>
              {algo.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
      <canvas ref={canvasRef} width={600} height={200} className="w-full border"></canvas>
      <div className="flex space-x-4 mt-4 justify-center">
        <button
          onClick={handlePrevStep}
          disabled={currentStep === 0}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          Previous Step
        </button>
        <button
          onClick={handleNextStep}
          disabled={currentStep === totalSteps - 1 || totalSteps === 0}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          Next Step
        </button>
      </div>
    </div>
  );
};

export default MemoryVisualizer;