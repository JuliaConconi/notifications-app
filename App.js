import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RealizarLogin from './src/screens/realizarLogin';
import ListarJogadores from './src/screens/listarJogadores';
import EditarUsuario from './src/screens/editarUsuario'; ///////////////////////
import SobreNos from './src/screens/sobreNos';
import PaginaPrincipal  from './src/screens/paginaPrincipal';
import Lampada from './src/screens/lampada';
import CalculoIMC from './src/screens/calculoIMC';
import ListarIMG from './src/screens/listarIMG';
import UploadIMG from './src/screens/uploadIMG'
import ListarVideo from './src/screens/listarVideo'
import UploadVideo from './src/screens/uploadVideo';
import AdicionarUsuario from './src/screens/adicionarUsuario';

const Stack = createNativeStackNavigator();

export default function App(){
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName='RealizarLogin'>
        <Stack.Screen name='RealizarLogin' component={RealizarLogin}/>
        <Stack.Screen name='ListarJogadores' component={ListarJogadores}/>
        <Stack.Screen name='EditarUsuario' component={EditarUsuario}/>
        <Stack.Screen name='SobreNos' component={SobreNos}/>
        <Stack.Screen name='PaginaPrincipal' component={PaginaPrincipal}/>
        <Stack.Screen name='Lampada' component={Lampada}/>
        <Stack.Screen name='CalculoIMC' component={CalculoIMC}/>
        <Stack.Screen name='ListarIMG' component={ListarIMG}/>
        <Stack.Screen name='UploadIMG' component={UploadIMG}/>
        <Stack.Screen name='ListarVideo' component={ListarVideo}/>
        <Stack.Screen name='UploadVideo' component={UploadVideo}/>
        <Stack.Screen name='AdicionarUsuario' component={AdicionarUsuario}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}


// export default App;