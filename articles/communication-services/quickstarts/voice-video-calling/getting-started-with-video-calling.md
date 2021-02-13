# QuickStart: Add 1:1 video calling to your app

This QuickStart used Azure Communication Client Library 1.0.0.beta-4. 

- [QuickStart: Add 1:1 video calling to your app](#quickstart-add-11-video-calling-to-your-app)
  - [Prerequisites](#prerequisites)
  - [Setting up](#setting-up)
    - [Create a new Node.js application](#create-a-new-nodejs-application)
    - [Install the package](#install-the-package)
    - [Set up the app framework](#set-up-the-app-framework)
  - [Object model](#object-model)
  - [Authenticate the client and access DeviceManager](#authenticate-the-client-and-access-devicemanager)
  - [Place a 1:1 outgoing video call to a user](#place-a-11-outgoing-video-call-to-a-user)
  - [Receive an incoming call](#receive-an-incoming-call)
  - [End the current call](#end-the-current-call)
  - [Subscribe to call updates](#subscribe-to-call-updates)
  - [Start and end video during the call](#start-and-end-video-during-the-call)
  - [Run the code](#run-the-code)
  - [Clean up resources](#clean-up-resources)
  
## Prerequisites
- Obtain an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/en-us/free/?WT.mc_id=A261C142F).
- You need to have [Node.js](https://nodejs.org/en/) Active LTS and Maintenance LTS versions (8.11.1 and 10.14.1)
- Create an active Communication Services resource. [Create a Communication Services resource](https://docs.microsoft.com/en-gb/azure/communication-services/quickstarts/create-communication-resource?tabs=windows&pivots=platform-azp).
- Create a User Access Token to instantiate the call client. [Learn how to create and manage user access tokens](https://docs.microsoft.com/en-gb/azure/communication-services/quickstarts/access-tokens?pivots=programming-language-csharp).

## Setting up
### Create a new Node.js application
Open your terminal or command window create a new directory for your app, and navigate to it.

        mkdir calling-quickstart && cd calling-quickstart

### Install the package
Use the npm install command to install the Azure Communication Services Calling client library for JavaScript.

        npm install @azure/communication-common --save
        npm install @azure/communication-calling --save

### Set up the app framework

This quickstart uses webpack to bundle the application assets. Run the following command to install the webpack, webpack-cli and webpack-dev-server npm packages and list them as development dependencies in your package.json:

        npm install webpack@4.42.0 webpack-cli@3.3.11 webpack-dev-server@3.10.3 --save-dev

Create an index.html file in the root directory of your project. We'll use this file to configure a basic layout that will allow the user to place a 1:1 video call.

Here's the code:

        <!DOCTYPE html>
        <html>
        <head>
            <title>Communication Client - 1:1 Video Calling Sample</title>
        </head>

        <body>
            <h4>Azure Communication Services</h4>
            <h1>1:1 Video Calling Quickstart</h1>
            <input 
            id="callee-id-input"
            type="text"
            placeholder="Who would you like to call?"
            style="margin-bottom:1em; width: 200px;"
            />

            <div>
            <button id="call-button" type="button" disabled="true">
                start call
            </button>
            &nbsp;
            <button id="hang-up-button" type="button" disabled="true">
                hang up
            </button>
            &nbsp;
            <button id="startVideo" type="button" disabled="true">
                start video
            </button>
            &nbsp;
            <button id="stopVideo" type="button" disabled="true">
                stop video
            </button>     
            </div>

            <div>Local Video</div>
            <div style="height:200px; width:300px; background-color:black; position:relative;">
            <div id="myVideo" style="background-color: black; position:absolute; top:50%; transform: translateY(-50%);">
            </div>
            </div>
            <div>Remote Video</div>
            <div style="height:200px; width:300px; background-color:black; position:relative;"> 
            <div id="remoteVideo" style="background-color: black; position:absolute; top:50%; transform: translateY(-50%);">
            </div>
            </div>

            <script src="./bundle.js"></script>
        </body>
        </html>

Create a file in the root directory of your project called client.js to contain the application logic for this quickstart. Add the following code to import the calling client and get references to the DOM elements. 

        import { CallClient, CallAgent, Renderer, LocalVideoStream, RemoteVideoStream, RemoteParticipant} from "@azure/communication-calling";
        import { AzureCommunicationUserCredential } from '@azure/communication-common';

        let call;
        let callAgent;
        const calleeInput = document.getElementById("callee-id-input");
        const callButton = document.getElementById("call-button");
        const hangUpButton = document.getElementById("hang-up-button");
        const stopVideoButton = document.getElementById("stopVideo");
        const startVideoButton = document.getElementById("startVideo");

        let placeCallOptions;
        let deviceManager;
        let localVideoStream;
        let remoteVideoStream;
        let rendererLocal;
        let rendererRemote;

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Calling client library:


| Name      | Description | 
| :---        |    :----   |
| CallClient  | The CallClient is the main entry point to the Calling client library.      |
| CallAgent  | The CallAgent is used to start and manage calls.        |
| DeviceManager | The DeviceManager is used to manage media devices.    |
| AzureCommunicationTokenCredential | The AzureCommunicationTokenCredential class implements the CommunicationTokenCredential interface which is used to instantiate the CallAgent.        |

## Authenticate the client and access DeviceManager

You need to replace <USER_ACCESS_TOKEN> with a valid user access token for your resource. Refer to the user access token documentation if you don't already have a token available. Using the CallClient, initialize a CallAgent instance with a CommunicationUserCredential which will enable us to make and receive calls. 
To access the DeviceManager a callAgent instance must first be created. You can then use the getDeviceManager method on the CallClient instance to get the DeviceManager.
Add the following code to client.js:

        async function init() {
            const callClient = new CallClient();
            const tokenCredential = new AzureCommunicationUserCredential("<USER ACCESS TOKEN>");
            callAgent = await callClient.createCallAgent(tokenCredential, { displayName: 'optional ACS user name' });
    
            deviceManager = await callClient.getDeviceManager();
            callButton.disabled = false;
        }
        init();

## Place a 1:1 outgoing video call to a user
Add an event listener to initiate a call when the callButton is clicked:

First you have to enumerate local cameras using the deviceManager getCameraList API. In this Quickstart we are using the first camera in the collection. Once the desired camera is selected, a LocalVideoStream instance will be constructed and passed within videoOptions as an item within the localVideoStream array to the call method. Once your call connects it will automatically start sending a video stream to the other participant. 

The functions refered here will be explained below. 

        callButton.addEventListener("click", async () => {       
            const localVideoDevice = deviceManager.getCameraList()[0];
            localVideoStream = new LocalVideoStream(localVideoDevice);
            placeCallOptions = {videoOptions: {localVideoStreams:[localVideoStream]}};

            localVideoView();
            stopVideoButton.disabled = false;
            startVideoButton.disabled = true;

            const userToCall = calleeInput.value;
            call = callAgent.call(
            [{ communicationUserId: userToCall }],
            placeCallOptions
            );

            call.remoteParticipants.forEach( p => {
            subscribeToRemoteParticipant(p);
            })

            call.on('remoteParticipantsUpdated', e => {
            e.added.forEach( p=>{
                subscribeToRemoteParticipant(p);
            })
            });

            hangUpButton.disabled = false;
            callButton.disabled = true;
        });
   
To render a LocalVideoStream, you need to create a new instance of Renderer, and then create a new RendererView instance using the asynchronous createView method. You may then attach view.target to any UI element. 

        async function localVideoView() {
            rendererLocal = new Renderer(localVideoStream);
            const view = await rendererLocal.createView();
            document.getElementById("myVideo").appendChild(view.target);
        }

All remote participants are available through the remoteParticipants collection on a call instance. You can subscribe to the remoteParticipants collection of the current call and inspect the videoStreams collections to list the streams of each participant. You also need to subscribe to the remoteParticipantsUpdated event to handle added remote participants. 


        function subscribeToRemoteParticipant(p) {
            p.videoStreams.forEach(v => {
                handleVideoStreams(v);
            });
            p.on('videoStreamsUpdated', e => {
                e.added.forEach(v => {
                handleVideoStreams(v);
                })
            });
        }

You have to subscribe to a isAvailableChanged event to render the remoteVideoStream. If the isAvailable property changes to true, a remote participant is sending a stream. Whenever availability of a remote stream changes you can choose to destroy the whole Renderer, a specific RendererView or keep them, but this will result in displaying blank video frame.

        function handleVideoStreams(v) {
            remoteVideoStream = v;
            remoteVideoView();
            remoteVideoStream.on('availabilityChanged', async () => {
                if (remoteVideoStream.isAvailable) {
                    remoteVideoView();
                } else {
                    rendererRemote.dispose();
                }
            });
            if (remoteVideoStream.isAvailable) {
                remoteVideoView();
            }
        }

To render a RemoteVideoStream, you need to create a new instance of Renderer, and then create a new RendererView instance using the asynchronous createView method. You may then attach view.target to any UI element. 

        async function remoteVideoView() {
            rendererRemote = new Renderer(remoteVideoStream);
            const view = await rendererRemote.createView();
            document.getElementById("remoteVideo").appendChild(view.target);
        }

## Receive an incoming call
To handle incoming calls you need to subscribe to callsUpdated event of callAgent Interface. Once there is an incoming call, you need to enumerate local cameras and construct a LocalVideoStream instance to send a video stream to the other participant. You also need to subscribe to remoteParticipants to handle remote video streams. 

Put the implementation in init() to handle incoming calls. 

        callAgent.on('callsUpdated', e => {
            e.added.forEach(addedCall => {
            if(addedCall.isIncoming) {
                const localVideoDevice = deviceManager.getCameraList()[0];
                localVideoStream = new LocalVideoStream(localVideoDevice);
                localVideoView();

                addedCall.remoteParticipants.forEach( p => {
                subscribeToRemoteParticipant(p);
                })

                addedCall.on('remoteParticipantsUpdated', e => {
                e.added.forEach( p=>{
                    subscribeToRemoteParticipant(p);
                })
                });
                addedCall.accept({videoOptions: {localVideoStreams:[localVideoStream]}});
                stopVideoButton.disabled = false;
                }
            });
        })

## End the current call
Add an event listener to end the current call when the hangUpButton is clicked:

        hangUpButton.addEventListener("click", async () => {
        // dispose of the renderers
        rendererLocal.dispose();
        rendererRemote.dispose();
        // end the current call
        await call.hangUp();
        // toggle button states
        hangUpButton.disabled = true;
        callButton.disabled = false;
        stopVideoButton.disabled = true;
        });

## Subscribe to call updates
You need to subscribe to the event when the remote participant ends the call to dispose of video renderers and toggle button states. 

        callAgent.on('callsUpdated', e => {
            e.removed.forEach(removedCall => {
                // dispose of video renders
                rendererLocal.dispose();
                rendererRemote.dispose();
                // toggle button states
                hangUpButton.disabled = true;
                callButton.disabled = false;
                stopVideoButton.disabled = true;
            })
        })

## Start and end video during the call
You can stop the video during the current call by adding an event listener to the Stop Video button to dispose of the renderer of localVideoStream. 
        
        stopVideoButton.addEventListener("click", async () => {
            call.stopVideo(localVideoStream);
            rendererLocal.dispose();
            startVideoButton.disabled = false;
            stopVideoButton.disabled = true;
        });

You can add an event listener to the Start Video button to turn the video back on when it was stopped during the current call. 

        startVideoButton.addEventListener("click", async () => {
            call.startVideo(localVideoStream);
            localVideoView();
            stopVideoButton.disabled = false;
            startVideoButton.disabled = true;
        });

## Run the code
Use the webpack-dev-server to build and run your app. Run the following command to bundle application host in on a local webserver:

        npx webpack-dev-server --entry ./client.js --output bundle.js --debug --devtool inline-source-map

Open your browser and navigate to http://localhost:8080/. You should see the following:

![1:1 Video Calling page](VideoCalling.PNG)

You can make an 1:1 outgoing video call by providing a user ID in the text field and clicking the Start Call button. 

## Clean up resources
If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](https://docs.microsoft.com/en-gb/azure/communication-services/quickstarts/create-communication-resource?tabs=windows&pivots=platform-azp#clean-up-resources).