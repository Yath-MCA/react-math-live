import React, { useEffect, useRef, useState } from "react";
import "mathlive";
import "./dashboard.css";

export default function FullImpactDashboard() {
  const inputRef = useRef(null);

  const currentPreviewContainer = useRef(null);
  const futurePreviewContainer = useRef(null);
  const currentOutputContainer = useRef(null);
  const futureOutputContainer = useRef(null);

  const currentPreviewRef = useRef(null);
  const futurePreviewRef = useRef(null);
  const currentOutputRef = useRef(null);
  const futureOutputRef = useRef(null);

  const [selectedExample, setSelectedExample] = useState(null);

  const correctExamples = [
    "\\frac{1}{2}",
    "\\sum_{n=1}^{10} n^2",
    "\\int_{0}^{\\pi} \\sin(x) dx",
    "a^2 + b^2 = c^2",
    "\\dots + x_n"
  ];

  const wrongExamples = [
    "\\frac12",
    "\\sum_n=1^10",
    "(\\dots\\upslopeellipsis)",
    "\\int_0^\\pi sin x dx",
    "a^2 + = c^2"
  ];

  useEffect(() => {
    createUpdateInstances();
    return () => cleanupAll();
  }, []);

  function cleanupAll() {
    [
      currentPreviewRef,
      futurePreviewRef,
      currentOutputRef,
      futureOutputRef
    ].forEach(ref => {
      if (ref.current) ref.current.remove();
    });
  }

  function applyCommonConfig(mf) {
    mf.readOnly = true;
    mf.tabIndex = -1;

    mf.addEventListener("mount", () => {
      mf.macros = {
        ...mf.macros,
        dots: "\\cdots"
      };
    });
  }

  function createUpdateInstances() {
    const cp = new window.MathfieldElement();
    const co = new window.MathfieldElement();

    applyCommonConfig(cp);
    applyCommonConfig(co);

    currentPreviewContainer.current.appendChild(cp);
    currentOutputContainer.current.appendChild(co);

    currentPreviewRef.current = cp;
    currentOutputRef.current = co;
  }

  function recreateFreshInstances(latex) {
    if (futurePreviewRef.current) futurePreviewRef.current.remove();
    if (futureOutputRef.current) futureOutputRef.current.remove();

    const fp = new window.MathfieldElement();
    const fo = new window.MathfieldElement();

    applyCommonConfig(fp);
    applyCommonConfig(fo);

    fp.value = latex;
    fo.value = latex;

    futurePreviewContainer.current.appendChild(fp);
    futureOutputContainer.current.appendChild(fo);

    futurePreviewRef.current = fp;
    futureOutputRef.current = fo;
  }

  function updateAll(latex) {
    if (currentPreviewRef.current)
      currentPreviewRef.current.value = latex;

    if (currentOutputRef.current)
      currentOutputRef.current.value = latex;

    recreateFreshInstances(latex);
  }

  function handleInput() {
    const latex = inputRef.current.value;
    setSelectedExample(null);
    updateAll(latex);
  }

  function applyExample(example) {
    setSelectedExample(example);
    inputRef.current.value = example;
    updateAll(example);
  }

  return (
    <div className="dashboard">

      <h2 className="dashboard-title">Impact Comparison Dashboard</h2>

      {/* Examples */}
      <div className="example-grid">
        <div className="example-card">
          <h4>Correct LaTeX</h4>
          {correctExamples.map((ex, i) => (
            <div
              key={i}
              onClick={() => applyExample(ex)}
              className={`example-item ${
                selectedExample === ex ? "selected-good" : ""
              }`}
            >
              {ex}
            </div>
          ))}
        </div>

        <div className="example-card">
          <h4>Wrong LaTeX</h4>
          {wrongExamples.map((ex, i) => (
            <div
              key={i}
              onClick={() => applyExample(ex)}
              className={`example-item ${
                selectedExample === ex ? "selected-bad" : ""
              }`}
            >
              {ex}
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="card">
        <textarea
          ref={inputRef}
          onInput={handleInput}
          placeholder="Type LaTeX here..."
          className="input-area"
        />
      </div>

      {/* Preview */}
      <div className="section">
        <div className="grid">
          <div className="panel">
            <h5>Future Impact (Fresh)</h5>
            <div ref={futurePreviewContainer} />
          </div>

          <div className="panel">
            <h5>Current Impact (Update)</h5>
            <div ref={currentPreviewContainer} />
          </div>
        </div>
      </div>

      {/* Output */}
      <div className="section">
        <div className="grid">
          <div className="panel">
            <h5>Future Output (Fresh)</h5>
            <div ref={futureOutputContainer} />
          </div>

          <div className="panel">
            <h5>Current Output (Update)</h5>
            <div ref={currentOutputContainer} />
          </div>
        </div>
      </div>
    </div>
  );
}
