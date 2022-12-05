---
title: Request camera and microphone access using Azure Communication Services UI Library
titleSuffix: An Azure Communication Services tutorial
description: Learn how to use Azure Communication Services with the UI Library to create an experience that gets users ready to join a call.
author: jaburnsi
manager: alkwa
services: azure-communication-services

ms.author: jaburnsi
ms.date: 11/17/2022
ms.topic: tutorial
ms.service: azure-communication-services
ms.subservice: calling
---

# Request camera and microphone access using Azure Communication Services UI Library

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]

This tutorial is a continuation of a 3-part series of Call Readiness tutorials and follows on from the previous: [Ensure user is on a supported browser](./call-readiness-tutorial-part-1-browser-support.md).

## Download code

Access the full code for this tutorial on [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/ui-library-call-readiness).

## Requesting access to the camera and microphone

For calling applications it is often vital a user has given permission to use the microphone and camera.
This is especially true for applications that require the user to be seen by others.
In this section we will create a series of components that will encourage the user to grant access to the camera and microphone
and display a prompt to the user if access is not granted.

### Creating prompts for camera and microphone access

we will first create a series of device permissions prompts to get users into a state where they have accepted the microphone and camera permissions. These will use the `CameraAndMicrophoneDomainPermissions` component
from the UI Library. Like the Unsupported Browser prompt, we will also host these inside a FluentUI `modal`.

`DevicePermissionPrompts.tsx`

```tsx
import { CameraAndMicrophoneDomainPermissions } from '@azure/communication-react';
import { Modal } from '@fluentui/react';

export const AcceptDevicePermissionRequestPrompt = (props: { isOpen: boolean }): JSX.Element => (
  <PermissionsModal isOpen={props.isOpen} type="request" />
);

export const CheckingDeviceAccessPrompt = (props: { isOpen: boolean }): JSX.Element => (
  <PermissionsModal isOpen={props.isOpen} type="check" />
)

export const PermissionsDeniedPrompt = (props: { isOpen: boolean }): JSX.Element => (
  <PermissionsModal isOpen={props.isOpen} type="denied" />
);

const PermissionsModal = (props: { isOpen: boolean, type: "denied" | "request" | "check" }): JSX.Element => (
  <Modal isOpen={props.isOpen}>
    <CameraAndMicrophoneDomainPermissions
      appName={'this site'}
      type={props.type}
      onTroubleshootingClick={() => alert('This callback should be used to take the user to further troubleshooting')}
    />
  </Modal>
);
```

### Checking for camera and microphone access

Here we will add two new utility functions to check and request for camera and microphone access. Create a file called `devicePermissionUtils.ts` with two functions `checkDevicePermissionsState` and `requestCameraAndMicrophonePermissions`.
`checkDevicePermissionsState` will use the [PermissionAPI](https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API). However, querying for camera and microphone is not supported on Firefox and thus we ensure this method returns `unknown` in this case. Later we will ensure we handle the `unknown` case when prompting the user for permissions.

`devicePermissionUtils.ts`

```ts
import { DeviceAccess } from "@azure/communication-calling";
import { StatefulCallClient } from "@azure/communication-react";

/**
 * Check if the user needs to be prompted for camera and microphone permissions.
 *
 * @remarks
 * The Permissions API we are using is not supported in Firefox, Android WebView or Safari < 16.
 * In those cases this will return 'unknown'.
 */
export const checkDevicePermissionsState = async (): Promise<{camera: PermissionState, microphone: PermissionState} | 'unknown'> => {
  try {
    const [micPermissions, cameraPermissions] = await Promise.all([
      navigator.permissions.query({ name: "microphone" as PermissionName }),
      navigator.permissions.query({ name: "camera" as PermissionName })
    ]);
    return { camera: cameraPermissions.state, microphone: micPermissions.state };
  } catch (e) {
    console.info("Permissions API unsupported", e);
    return 'unknown';
  }
}

/** Use the DeviceManager to request for permissions to access the camera and microphone. */
export const requestCameraAndMicrophonePermissions = async (callClient: StatefulCallClient): Promise<DeviceAccess> =>
  await (await callClient.getDeviceManager()).askDevicePermission({ audio: true, video: true });

```

### Prompting the user to grant access to the camera and microphone

Now we have the prompts and check and request logic, we will update the `PreCallChecksComponent` to prompt the user regarding device permissions.
In this component we will display different prompts to the user based on the device permission state:

- If the device permission state is unknown we will display a prompt to the user informing them we are checking for device permissions.
- If we are requesting permissions we will display a prompt to the user encouraging them to accept the permissions request.
- If the permissions are denied we will display a prompt to the user informing them that they have denied permissions and that they will need to grant permissions to continue.

`CallReadinessCheckComponent`

```tsx
import { useEffect, useState } from 'react';
import { BrowserUnsupportedPrompt } from './UnsupportedBrowserPrompt';
import { CheckingDeviceAccessPrompt, PermissionsDeniedPrompt, AcceptDevicePermissionRequestPrompt } from './DevicePermissionPrompts';
import { useCallClient } from '@azure/communication-react';
import { checkBrowserSupport } from './browserSupportUtils';
import { checkDevicePermissionsState, requestCameraAndMicrophonePermissions } from './devicePermissionUtils';

type PreCallChecksState = 'runningChecks' |
  'browserUnsupported' |
  'checkingDeviceAccess' |
  'promptingForDeviceAccess' |
  'deniedDeviceAccess' |
  'finished';

/**
 * This component is a demo of how to use the StatefulCallClient with CallReadiness Components to get a user
 * ready to join a call.
 * This component checks the browser support and if camera and microphone permissions have been granted.
 */
export const PreCallChecksComponent = (props: {
  /**
   * Callback triggered when the tests are complete and successful
   */
  onTestsSuccessful: () => void
}): JSX.Element => {
  const [currentCheckState, setCurrentCheckState] = useState<PreCallChecksState>('runningChecks');

  // Run call readiness checks when component mounts
  const callClient = useCallClient();
  useEffect(() => {
    const runCallReadinessChecks = async (): Promise<void> => {

      // First we'll begin with a browser support check.
      const browserSupport = await checkBrowserSupport(callClient);
      if (!browserSupport) {
        setCurrentCheckState('browserUnsupported');
        // If browser support fails, we'll stop here and display a modal to the user.
        return;
      }

      // Next we will check if we need to prompt the user for camera and microphone permissions.
      // The prompt check only works if the browser supports the PermissionAPI for querying camera and microphone.
      // In the event that is not supported, we show a more generic prompt to the user.
      const devicePermissionState = await checkDevicePermissionsState();
      if (devicePermissionState === 'unknown') {
        // We don't know if we need to request camera and microphone permissions, so we'll show a generic prompt.
        setCurrentCheckState('checkingDeviceAccess');
      } else if (devicePermissionState.camera === 'prompt' || devicePermissionState.microphone === 'prompt') {
        // We know we need to request camera and microphone permissions, so we'll show the prompt.
        setCurrentCheckState('promptingForDeviceAccess');
      }

      // Now the user has an appropriate prompt, we can request camera and microphone permissions.
      const devicePermissionsState = await requestCameraAndMicrophonePermissions(callClient);

      if (!devicePermissionsState.audio || !devicePermissionsState.video) {
        // If the user denied camera and microphone permissions, we prompt the user to take corrective action.
        setCurrentCheckState('deniedDeviceAccess');
      } else {
        setCurrentCheckState('finished');
        // Test finished successfully, trigger callback to parent component to take user to the next stage of the app.
        props.onTestsSuccessful();
      }
    };

    runCallReadinessChecks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* We show this when the browser is unsupported */}
      <BrowserUnsupportedPrompt isOpen={currentCheckState === 'browserUnsupported'} />

      {/* We show this when we are prompting the user to accept device permissions */}
      <AcceptDevicePermissionRequestPrompt isOpen={currentCheckState === 'promptingForDeviceAccess'} />

      {/* We show this when the PermissionsAPI is not supported and we are checking what permissions the user has granted or denied */}
      <CheckingDeviceAccessPrompt isOpen={currentCheckState === 'checkingDeviceAccess'} />

      {/* We show this when the user has failed to grant camera and microphone access */}
      <PermissionsDeniedPrompt isOpen={currentCheckState === 'deniedDeviceAccess'} />
    </>
  );
}

```

The app will now present the user with prompts to guide them through device access:

![Gif showing user being prompted for camera and microphone access](../media/call-readiness/prompt-device-permissions.gif)

## Next steps

> [!div class="nextstepaction"]
> [Part 3: Selecting a microphone and camera for the call](./call-readiness-tutorial-part-3-camera-and-microphone-setup.md)
