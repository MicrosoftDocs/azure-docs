---
ms.date: 03/20/2024
ms.topic: how-to
author: pavelprystinka
ms.author: pprystinka
title: TelecomManager integration in Azure Communication Services calling SDK
ms.service: azure-communication-services
ms.subservice: calling
description: Steps on how to integrate TelecomManager with Azure Communication Services calling SDK
---

 # Integrate with TelecomManager

  This document describes how to integrate TelecomManager with your Android application. 
  
  ## Prerequisites

  - An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
  - A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
  - A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../quickstarts/identity/access-tokens.md).
  - Optional: Complete the quickstart to [add voice calling to your application](../../quickstarts/voice-video-calling/getting-started-with-calling.md)

  ## TelecomManager integration

  [!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]

 `TelecomManager` Integration in the Azure Communication Services Android SDK handles interaction with other VoIP and PSTN calling Apps that also integrated with `TelecomManager`.

  ### Configure `TelecomConnectionService`
  Add `TelecomConnectionService` to your App `AndroidManifest.xml`
  ```
  <application>
    ...
    <service
        android:name="com.azure.android.communication.calling.TelecomConnectionService"
        android:permission="android.permission.BIND_TELECOM_CONNECTION_SERVICE"
        android:exported="true">
        <intent-filter>
            <action android:name="android.telecom.ConnectionService" />
        </intent-filter>
    </service>
  </application>
  ```

  ### Initialize call agent with TelecomManagerOptions

  With configured instance of `TelecomManagerOptions`, we can create the `CallAgent` with `TelecomManager` enabled.  

  ```Java
  CallAgentOptions options = new CallAgentOptions();
  TelecomManagerOptions telecomManagerOptions = new TelecomManagerOptions("<your app's phone account id>");
  options.setTelecomManagerOptions(telecomManagerOptions);

  CallAgent callAgent = callClient.createCallAgent(context, credential, options).get();
  Call call = callAgent.join(context, locator, joinCallOptions);
  ```

    
  ### Configure audio output device

  When TelecomManager integration is enabled for the App, the audio output device has to be selected via telecom manager API only.
  
  ```Java
  call.setTelecomManagerAudioRoute(android.telecom.CallAudioState.ROUTE_SPEAKER);
  ```

  ### Configure call resume behavior

  When call is interrupted with other call, for instance incoming PSTN call, ACS call is placed `OnHold`. You can configure what happens once PSTN call is over resume call automatically, or wait for user to request call resume.


  ```Java
  telecomManagerOptions.setResumeCallAutomatically(true);
  ````

  ## Next steps
  - [Learn how to manage video](./manage-video.md)
  - [Learn how to manage calls](./manage-calls.md)
  - [Learn how to record calls](./record-calls.md)
