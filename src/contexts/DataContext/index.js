import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const getData = useCallback(async () => {
    try {
      setData(await api.loadData());
    } catch (err) {
      setError(err);
    }
  }, []);
  

  // 5.Ajout de la logique pour trier les événements et obtenir le dernier 'last'
  const events = data?.events;
  const sortedEvents = events?.sort((evtA, evtB) => new Date(evtA.date) > new Date(evtB.date) ? -1 : 1); // On trie les événements par date décroissante
  const last = sortedEvents?.[0];  // On prend le premier élément du tableau trié comme le dernier événement

  useEffect(() => {
    if (data) return;
    getData();
  });
  
  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        data,
        error,
        last  // Ajout de 'last' dans le contexte pour le rendre accessible dans toute l'application
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useData = () => useContext(DataContext);

export default DataContext;
