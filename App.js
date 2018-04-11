/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { Button,Alert,CameraRoll } from 'react-native';
import { TouchableHighlight, TouchableOpacity, TouchableNativeFeedback, TouchableWithoutFeedback, } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { StackNavigator,} from 'react-navigation';
import RNFetchBlob from 'react-native-fetch-blob';
import RNTesseractOcr from 'react-native-tesseract-ocr';

import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const dirs = RNFetchBlob.fs.dirs;

type Props = {};
export class App extends Component<Props> {

  pressed(){
    //Alert.alert("You tapped the button!")
  }

   //Call this function to add a picture to the camera roll
   //expects promise with uri
   //saveToCameraRollFolder(data)
   //{
        //CameraRoll.saveToCameraRoll(data.uri);
      //  RNFetchBlob.fs.writeFile(PATH_TO_WRITE, PATH_TO_ANOTHER_FILE, 'uri')
        //.then(()=>{ ... })
   //}

   addPictureToDirectory(data)
   {
        string = /\/[a-zA-Z0-9-\.]+$/;
        picString = data.match(string);
        if (picString == null)
        {
            Promise.reject("Failed to add picture");
        }
        else
        {
         Promise.resolve(RNFetchBlob.fs.appendFile(dirs.PictureDir + "/TranslationApp" + picString[0], data, 'uri')
            .then(()=>{}));
        }
   }

   //Takes a picture
   takePicture = async function() {
       if (this.camera) {
         const options = { quality: 0.5 };
         const data = await this.camera.takePictureAsync(options);
         this.camera.takePictureAsync(options).then(data => {
                this.addPictureToDirectory(data.uri);
          })
       }
     };

  render() {
    return (
      <View style={styles.container}>
         <RNCamera
                     ref={ref => {
                       this.camera = ref;
                     }}
                     style = {styles.preview}
                     type={RNCamera.Constants.Type.back}
                     flashMode={RNCamera.Constants.FlashMode.off}
                     permissionDialogTitle={'Permission to use camera'}
                     permissionDialogMessage={'We need your permission to use your camera phone'}
                 />

                 <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center',}}>
                 <TouchableOpacity
                     onPress={this.takePicture.bind(this)}
                     style = {styles.capture}
                 >
                     <Text style={{fontSize: 14}}> SNAP </Text>
                 </TouchableOpacity>
                 </View>

      </View>
    );
  }
}

class DetailsScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Details Screen</Text>
        <Button
                                                   title="Go to Camera"
                                                   onPress={() => this.props.navigation.navigate('Camera')}
                                                 />
      </View>

    );
  }
}

export default StackNavigator({
    Details: {
      screen: DetailsScreen,
    },
    Camera: {
        screen: App,
    },
},
  {
    initialRouteName: 'Details',
  }
);
const styles = StyleSheet.create({

  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
   buttonText: {
      padding: 20,
      color: 'purple'
   },
   preview: {
       flex: 1,
       justifyContent: 'flex-end',
       alignItems: 'center'
     },

   capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20
      }
});
