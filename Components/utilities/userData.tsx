import { useAuth } from '../firebaseAuth';
import { getDatabase, ref, onValue } from 'firebase/database';

export function useUserData() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<any>();

  useEffect(() => {
    if (user) {
      // Get a reference to the user's data in the database
      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);

      // Listen for changes to the user's data
      const unsubscribe = onValue(userRef, (snapshot) => {
        setUserData(snapshot.val());
      });

      // Unsubscribe from the listener when the component unmounts
      return () => {
        unsubscribe();
      };
    }
  }, [user]);

  return { userData };
}