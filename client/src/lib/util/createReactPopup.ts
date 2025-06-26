import { Map, Popup } from "mapbox-gl";
import { createRoot } from "react-dom/client";

function createReactPopup(coordinates: [number, number], reactElement: React.ReactNode, popup: Popup) {
  const container = document.createElement('div');
  container.style.setProperty('pointer-events', 'none')

  createRoot(container).render(reactElement);

  return popup
    .setLngLat(coordinates)
    .setDOMContent(container)
}

export default createReactPopup;