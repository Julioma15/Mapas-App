import {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import MapView, {Marker} from 'react-native-maps';

import * as Location from 'expo-location'
export default function App() {
 const [location, setLocation] = useState(null)
 const [loading, setLoading] = useState(false)
 const [error, setError] = useState(null)

useEffect(()=>{
  getLocation()
}, [])

async function getLocation (){

  try{
  setLoading(true)
  setError(null)
  // pedir permisos en primer plano (más común para obtener ubicación inmediata)
  let {status} = await Location.requestForegroundPermissionsAsync()
  if (status!== 'granted'){
    setError('permiso de ubicacion negado')
    setLoading(false)
    return
  }


  let lastKnown =await Location.getLastKnownPositionAsync({})
  if (lastKnown) {
    setLocation(lastKnown.coords)
    setLoading(false)
    return
  }

  let currentLocation = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
    maximumAge: 1000
  })
  setLocation(currentLocation.coords)
  setLoading(false)
} catch (error) {
  console.log('Error', error)
  setError(error.message)
  setLoading(false)

}

}
if (loading) {
  return (
    <View style={styles.centerContainer}>
      <Text style={styles.loadingText}>🦐🎈Obteniendo ubicación...</Text>
    </View>
  )
}
if (error || !location) {
  return (
    <View style={styles.centerContainer}>
      <Text style={styles.errorText}>{error || 'error desconocido'}</Text>
      <TouchableOpacity style={styles.button} onPress={getLocation}>
        <Text style={styles.buttonText}>Reintentar</Text>
      </TouchableOpacity>
    </View>
  )
}

 return(
 <View style={styles.container}>
  <MapView
    style={styles.map}
    initialRegion={{
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01
    }}
    showsUserLocation = {true}
    showsMyLocationButton ={true}

  >
    <Marker
      coordinate={{
        latitude: location.latitude,
        longitude: location.longitude
      }}
      title="Tu ubicación"
      description={`Lat: ${location.latitude.toFixed(6)}, Lng: ${location.longitude.toFixed(6)}`}
      pinColor="red"
    />

  </MapView>

  <View style={styles.infoContainer}>
    <Text style={styles.infoTitle}>📍Tu ubicacion</Text>
    <Text style={styles.infoText}>
      Lat: {location.latitude.toFixed(6)}
    </Text>
    <Text style={styles.infoText}>
      Lng: {location.longitude.toFixed(6)}
    </Text>
  </View>

  <TouchableOpacity style={styles.refreshButton} onPress={getLocation}>
    <Text style={styles.buttonText}>Actualizar🔁</Text>
  </TouchableOpacity>
 </View>
 );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  map :{
    flex:1
  },
  loadingText:{
    fontSize:18,
    color: '#333',
    fontWeight:'600'
  },
  errorText: {
    fontSize: 16,
    color: '#ff0000',
    textAlign: 'center',
    marginBottom: 20
  },
  infoContainer:{
    position: 'absolute',
    top: 60,
    left:20,
    right:20,
    backgroundColor: 'white',
    padding:15,
    borderRadius:12,
    shadowColor: 'black',
    shadowOffset: {width:0, height:2},
    shadowOpacity: 0.25,
    shadowRadius:3.84,
    elevation: 5
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,

  },
  infoText: {
    fontSize: 14,
    color: '#555',
    marginVertical: 2,

  },
  refreshButton: {
    position: 'absolute',
    bottom:40,
    alignSelf:'center',
    backgroundColor:'blue',
    paddingHorizontal:30,
    paddingVertical:15,
    borderRadius: 25,
    shadowColor:'#000',
    shadowOffset: {width:0, height:2},
    shadowOpacity: 0.25,
    shadowRadius:3.84,
    elevation:5
  },
  button:{
    backgroundColor:'blue',
    paddingHorizontal:30,
    paddingVertical:15,
    borderRadius:25

  },
  buttonText:{
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }





});


