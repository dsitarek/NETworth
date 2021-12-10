import React, { useState, useEffect } from 'react';
import { getUser } from '../api/auth';
import { LineCard } from '../components/index';
import { getLines } from '../data/databaseCalls';

export default function Lines() {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    const userId = getUser();
    getLines(userId.id).then(setLines);
  }, []);

  return (
    <div className="lines-container">
      <span className="lines-header">My Lines</span>

      {lines ? lines.map((line) => <LineCard key={line.line_id} line={line} />) : ''}

    </div>
  );
}