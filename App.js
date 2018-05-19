/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { Button,Alert,CameraRoll, ScrollView } from 'react-native';
import { TouchableHighlight, TouchableOpacity, TouchableNativeFeedback, TouchableWithoutFeedback, } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { StackNavigator,} from 'react-navigation';
import RNFetchBlob from 'react-native-fetch-blob';
import RNTesseractOcr from 'react-native-tesseract-ocr';
import { Platform, StyleSheet, Text, View, Dimensions } from 'react-native';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const dirs = RNFetchBlob.fs.dirs;

type Props = {};

//for tab view
const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

export class App extends Component<Props> {

GalleryRoute = () => <View style={[ styles.container, { backgroundColor: 'blue' } ]} >
                        <Button
                            title="Open Image Gallery"
                            
                        />
                     </View>
CameraRoute = () => <View style={[ styles.container, { backgroundColor: 'black' } ]} >
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
LibraryRoute = () => <View style={[ styles.container, { backgroundColor: 'green' } ]} />;

//for tab view
      state = {
        index: 0,
        routes: [
          { key: 'gallery', title: 'Gallery' },
          { key: 'camera', title: 'Camera' },
          { key: 'library', title: 'Library' },
        ],
      };

    _handleIndexChange = index => this.setState({ index });

    _renderFooter = props => <TabBar {...props} />;

    _renderScene = SceneMap({
        gallery: this.GalleryRoute,
        camera: this.CameraRoute,
        library: this.LibraryRoute,
    });

    //Adds a picture to the app's photo gallery album
   addPictureToDirectory(data)
   {
        //regex to get image name
        string = /\/[a-zA-Z0-9-\.]+$/;
        //puts the image name into the variable picString
        picString = data.match(string);
        //Location of the album
        fileLocation = dirs.PictureDir + "/TranslationApp";
        if (picString == null)
        {
            Promise.reject("Failed to add picture");
        }
        else
        {
         //adds the image to the image album
         Promise.resolve(RNFetchBlob.fs.appendFile(fileLocation + picString[0], data, 'uri'))
            .then(()=>{})
        }

        //updates the media files in android to show in picture gallery
        RNFetchBlob.fs.scanFile([{path : fileLocation + picString[0], mime : 'image'}])
        .then(() => {
             console.log("Scan file success");
        })
        .catch((err) =>{
             console.log("Scan file error");
        })
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
         <TabViewAnimated
            navigationState={this.state}
            renderScene={this._renderScene}
            renderFooter={this._renderFooter}
            onIndexChange={this._handleIndexChange}
            initialLayout={initialLayout}
         />
      </View>
    );
  }
}

class LibraryScreen extends React.Component {
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
    Library: {
      screen: LibraryScreen,
    },
    Camera: {
        screen: App,
    },
},
  {
    initialRouteName: 'Camera',
  }
);
const styles = StyleSheet.create({
  libraryButton: {
    width: 50,
    height: 50,
    backgroundColor: 'white',
    top: -20,
    left: 10,
  },
  container: {
    flex: 1,
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
