> [!WARNING]
> This document is under construction and needs the following items to be addressed: 
> - note the "raw materials" located in `calling-client-samples`

Get started with Azure Communication Services by using the Communication Services client library to manage your media devices.

## Prerequisites
To be able to place an outgoing telephone call, you need following:
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- An Azure Communication Service resource. Further details can be found in the [Create an Azure Communication Resource](../../create-communication-resource.md) quickstart.
- Complete the quickstart for adding calling to your application [here](../getting-started-with-calling.md)

## Device Manager

As part of the `CallClient` class, there is a `DeviceManager` class which interacts with your device to expose the full set of devices available for camera, microphone and speaker functionality.

```javascript

const deviceManager = callClient.deviceManager;

```

## Enumerate Devices

The `DeviceManager` gives the ability to enumerate all devices by type using the `getCameraList`, `getMicrophoneList` and `getSpeakerList` methods.

```javascript

// enumerate local cameras
const localCameras = deviceManager.getCameraList(); // [VideoDeviceInfo, VideoDeviceInfo...]
// enumerate local cameras
const localMicrophones = deviceManager.getMicrophoneList(); // [AudioDeviceInfo, AudioDeviceInfo...]
// enumerate local cameras
const localSpeakers = deviceManager.getSpeakerList(); // [AudioDeviceInfo, AudioDeviceInfo...]

```

## Get Current Default Device

`DeviceManager` allows you to get the default device being used, using the `getCamera`, `getMicrophone` and `getSpeaker` methods.

```javascript

// get default camera
const defaultCamera = deviceManager.getCamera();

// get default microphone
const defaultMicrophone = deviceManager.getMicrophone();

// get default speaker
const defaultSpeaker = deviceManager.getSpeaker();

```

## Set Default Device

Using the `DeviceManager` , you can then set what device to use, invoking the `setCamera`, `setMicrophone` and `setSpeaker` methods.

```javascript

// [asynchronous] set default camera
await deviceManager.setCamera(VideoDeviceInfo);

// [asynchronous] set default microphone
await deviceMicrophone.setMicrophone(AudioDeviceInfo);

// [asynchronous] set default speaker
await deviceManager.setSpeaker(AudioDeviceInfo);

```

Each method will require a device to be passed in. Devices are procured from the previous step, [Enumerate Devices](#enumerate-devices).

### Request Permission for camera and microphone

In order to access camera and microphone, you'll need to request permission from the user to properly access it. For that, `DeviceManager` has a `askDevicePermission` method to prompt the user for permission.

```javascript

const result = await deviceManager.askDevicePermission(audio: true, video: true); // resolves with Promise<IDeviceAccess>;
// result.audio = true|false
// result.video = true|false

```

You can also check the current permission state for a device type\

```javascript

const result = deviceManager.getPermissionState('Microphone'); // for microphone permission state
const result = deviceManager.getPermissionState('Camera'); // for camera permission state

console.log(result); // 'Granted' | 'Denied' | 'Prompt' | 'Unknown';

```

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. You can find out more about cleaning up resources [here](../../create-communication-resource.md#clean-up-resources).

## Next steps

For more information, see the following articles:
- Check out our calling hero sample [here](../../../samples/calling-hero-sample.md)
- Learn how to add video to your calls [here](../add-video-to-app.md)
- Learn how to manage call participants [here](../manage-participants.md)
- Learn more about how calling works [here](../../../concepts/voice-video-calling/about-call-types.md)
