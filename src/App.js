import React, { useEffect, useRef, useState } from 'react';
import 'mathlive';

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
    '\\frac{1}{2}',
    '\\sum_{n=1}^{10} n^2',
    '\\int_{0}^{\\pi} \\sin(x) dx',
    'a^2 + b^2 = c^2',
    '\\dots + x_n',
  ];

  const wrongExamples = [
    '\\frac12',
    '\\sum_n=1^10',
    '(\\dots\\upslopeellipsis)',
    '\\int_0^\\pi sin x dx',
    'a^2 + = c^2',
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
      futureOutputRef,
    ].forEach((ref) => {
      if (ref.current) ref.current.remove();
    });
  }

  function applyCommonConfig(mf) {
    mf.readOnly = true;
    mf.tabIndex = -1;

    mf.addEventListener('mount', () => {
      mf.macros = {
        ...mf.macros,
        dots: '\\cdots',
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
    if (currentPreviewRef.current) currentPreviewRef.current.value = latex;

    if (currentOutputRef.current) currentOutputRef.current.value = latex;

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
    <div style={styles.page}>
      <h4 style={styles.title}>Impact Comparison Dashboard</h4>

      {/* TOP EXAMPLES */}
      <div style={styles.exampleGrid}>
        <div style={styles.exampleCard}>
          <h3>Correct LaTeX Examples</h3>
          {correctExamples.map((ex, i) => (
            <div
              key={i}
              onClick={() => applyExample(ex)}
              style={{
                ...styles.exampleItem,
                ...(selectedExample === ex ? styles.selectedGood : {}),
              }}
            >
              {ex}
            </div>
          ))}
        </div>

        <div style={styles.exampleCard}>
          <h3>Wrong LaTeX Examples</h3>
          {wrongExamples.map((ex, i) => (
            <div
              key={i}
              onClick={() => applyExample(ex)}
              style={{
                ...styles.exampleItem,
                ...(selectedExample === ex ? styles.selectedBad : {}),
              }}
            >
              {ex}
            </div>
          ))}
        </div>
      </div>

      {/* INPUT */}
      <div style={styles.card}>
        <h3>User Input</h3>
        <textarea
          ref={inputRef}
          onInput={handleInput}
          placeholder="Type LaTeX here..."
          style={styles.textarea}
        />
      </div>

      {/* PREVIEW */}
      <div style={styles.section}>
        <h3>Preview Comparison</h3>
        <div style={styles.grid}>
          <div style={styles.panel}>
            <h4>Future / Planned Impact (Fresh)</h4>
            <div ref={futurePreviewContainer} />
          </div>
          <div style={styles.panel}>
            <h4>Current Impact (Update)</h4>
            <div ref={currentPreviewContainer} />
          </div>
        </div>
      </div>

      {/* OUTPUT */}
      <div style={styles.section}>
        <h3>Output Comparison</h3>
        <div style={styles.grid}>
          <div style={styles.panel}>
            <h4>Future Output (Fresh)</h4>
            <div ref={futureOutputContainer} />
          </div>
          <div style={styles.panel}>
            <h4>Current Output (Update)</h4>
            <div ref={currentOutputContainer} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= MODERN STYLES ================= */

const styles = {
  page: {
    maxWidth: '1300px',
    margin: '40px auto',
    padding: '20px',
    fontFamily: 'Inter, system-ui, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },

  title: {
    fontSize: '24px',
    fontWeight: '600',
  },

  exampleGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '5px',
  },

  exampleCard: {
    background: '#ffffff',
    padding: '5px',
    borderRadius: '14px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
  },

  exampleItem: {
    padding: '8px 12px',
    borderRadius: '8px',
    background: '#f5f7fa',
    cursor: 'pointer',
    fontFamily: 'monospace',
    marginBottom: '6px',
    transition: '0.2s',
  },

  selectedGood: {
    background: '#e6f4ff',
    border: '1px solid #4dabf7',
  },

  selectedBad: {
    background: '#fff1f0',
    border: '1px solid #ff4d4f',
  },

  card: {
    background: '#ffffff',
    padding: '20px',
    borderRadius: '14px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
  },

  textarea: {
    width: '100%',
    minHeight: '120px',
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #ddd',
    fontFamily: 'monospace',
  },

  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },

  panel: {
    background: '#fafafa',
    padding: '16px',
    borderRadius: '14px',
    border: '1px solid #eee',
  },
};
