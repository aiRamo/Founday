import MatchingResults from '../MatchingResults';
import {firebase} from '../firebaseConfig';
import 'firebase/database';

const db = firebase.database();
  
interface MatchingResult {
  matchingItems: any;
  weakMatches: any;
};

export async function getMatchingFoundItems(lostItems: any): Promise<{ [key: string]: MatchingResult }> {
  const foundItemsRef = db.ref('/FoundItems');
  const foundItemsSnapshot = await foundItemsRef.once('value');
  const foundItems = foundItemsSnapshot.val() as { [key: string]: any };
  
  const results: { [key: string]: MatchingResult } = {};
  
  console.log(`Found ${Object.values(foundItems).length} items in database`);
  
  console.log('Matching lost items with found items...');
  for (const lostItem of lostItems) {
    console.log(`Matching lost item ${lostItem.title} with found items...`);
    
    const matchingItems: any = [];
    const weakMatches: any = [];

    for (const foundItem of Object.values(foundItems)) {
      console.log(`Checking found item ${foundItem.itemName}... ${foundItem.author} AND ${lostItem.author}`);

      if (foundItem.author !== lostItem.author && foundItem.category === lostItem.category) {
        console.log(`Found item ${foundItem.itemName} matches lost item ${lostItem.title} category`);

        const lostCoords = lostItem.location.split(',');
        const foundCoords = foundItem.location.split(',');
  
        const lostX = parseFloat(lostCoords[0]);
        const lostY = parseFloat(lostCoords[1]);
        const foundX = parseFloat(foundCoords[0]);
        const foundY = parseFloat(foundCoords[1]);
  
        const hypotenuse = Math.sqrt(Math.pow(foundX - lostX, 2) + Math.pow(foundY - lostY, 2));
        console.log(`Distance between lost item ${lostItem.title} and found item ${foundItem.itemName} = ${hypotenuse}`);
  
        if (hypotenuse <= 0.04) {
          console.log(`Found item ${foundItem.itemName} is a strong match for lost item ${lostItem.itemName}`);
          matchingItems.push(foundItem);
          console.log(JSON.stringify(matchingItems));
        } else {
          console.log(`Found item ${foundItem.itemName} is a weak match for lost item ${lostItem.itemName}`);
          weakMatches.push(foundItem);
        }
      }
    }
    console.log(`Found ${matchingItems.length} strong matches and ${weakMatches.length} weak matches for lost item ${lostItem.title}`);
    results[lostItem.title] = { matchingItems, weakMatches };
  }

  console.log('Matching completed.');
  console.log(JSON.stringify(results));
  return results;
}