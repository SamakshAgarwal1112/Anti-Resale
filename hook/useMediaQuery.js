// useMediaQuery.js (make sure it's correctly defined)

import { useState, useEffect } from 'react';

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);

    media.addListener(listener);  // Add listener for updates

    // Set initial state
    setMatches(media.matches);

    // Cleanup listener on unmount
    return () => media.removeListener(listener);
  }, [query]);

  return matches;
}
