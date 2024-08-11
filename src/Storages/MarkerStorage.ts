import { makeAutoObservable } from 'mobx';
import {collection, getDocs, addDoc, deleteDoc, doc, where, query, writeBatch } from 'firebase/firestore';
import {db} from '../API/firebaseConfig';

type Marker = {
    id: number;
    lat: number;
    lng: number;
    time: string;
};

class MarkerStore {
    public markers: Marker[] = [];
    public currentId: number = 0;

    constructor() {
        makeAutoObservable(this);
        this.fetchDataFromFirestore();
    }

    addMarker = (lat: number, lng: number) => {
        this.currentId += 1;
        const newMarker = {
            id: this.currentId,
            lat: lat,
            lng: lng,
            time: this.getCurrentTimeString()
        };
        this.markers.push(newMarker);
        this.addDataToFirestore(newMarker);
    }

    removeMarker = async (id: number) => {
        this.markers = this.markers.filter(marker => marker.id !== id);

        try {
            const q = query(collection(db, "markers"), where("id", "==", id));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (document) => {
                const markerDoc = doc(db, "markers", document.id);
                await deleteDoc(markerDoc);
                this.calculateCurrentId(this.markers);
            });
        } catch (error) {
            console.error("Error removing document: ", error);
        }
    }

    removeAllMarkers = async () => {
        this.markers = [];

        try {
            const querySnapshot = await getDocs(collection(db, "markers"));
            const batch = writeBatch(db); // Create a batch instance

            querySnapshot.forEach((document) => {
                const markerDoc = doc(db, "markers", document.id);
                batch.delete(markerDoc);
                this.calculateCurrentId(this.markers);
            });

            await batch.commit();
        } catch (error) {
            console.error("Error removing all documents: ", error);
        }
    }
    
    get getMarkers() {
        return this.markers.slice();
    }

    private calculateCurrentId = (data : Marker[]) => {
        this.currentId = data.reduce((max, marker) => (marker.id > max ? marker.id : max), 0);
    }

    private getCurrentTimeString = (): string => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    private fetchDataFromFirestore = async () => {
        const querySnapshot = await getDocs(collection(db, "markers"));

        const data: any[] = [];
        querySnapshot.forEach((doc) => {
            data.push({ id: Number(doc.id), ...doc.data() });
        });

        this.markers = data;
        this.calculateCurrentId(data);
    }

    private addDataToFirestore = async (marker : Marker) => {
        try {
            await addDoc(collection(db, "markers"), {...marker});
        }
        catch (error){
            console.error(error);
        }
    }
}

const markerStore = new MarkerStore();
export default markerStore;
