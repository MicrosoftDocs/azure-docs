---
ms.date: 01/06/2023
ms.topic: how-to
author: raosanat
ms.author: sanathr
title: CallKit integration in ACS Calling SDK
ms.service: azure-communication-services
ms.subservice: calling
description: Steps on how to integrate CallKit with ACS Calling SDK
---

 # Integrate with CallKit

  In this document, we'll go through how to integrate CallKit with your iOS application. 

  > [!NOTE]
  > This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment. To use this api please use 'beta' release of Azure Communication Services Calling iOS SDK

  ## Prerequisites

  - An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
  - A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
  - A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../quickstarts/identity/access-tokens.md).
  - Optional: Complete the quickstart to [add voice calling to your application](../../quickstarts/voice-video-calling/getting-started-with-calling.md)

  ## CallKit Integration (within SDK)

 CallKit Integration in the ACS iOS SDK handles interaction with CallKit for us. To perform any call operations like mute/unmute, hold/resume, we only need to call the API on the ACS SDK. 

  ### Initialize call agent with CallKitOptions

  With configured instance of `CallKitOptions`, we can create the `CallAgent` with handling of `CallKit`.  

  ```Swift
  let options = CallAgentOptions()
  let callKitOptions = CallKitOptions(with: createProviderConfig())
  options.callKitOptions = callKitOptions

  // Configure the properties of `CallKitOptions` instance here

  self.callClient!.createCallAgent(userCredential: userCredential,
      options: options,
      completionHandler: { (callAgent, error) in
      // Initialization
  })
  ```

  ### Specify call recipient info for outgoing calls

  First we need to create an instance of `StartCallOptions()` for outgoing calls, or `JoinCallOptions()` for group call: 
  ```Swift
  let options = StartCallOptions()
  ```
  or
  ```Swift
  let options = JoinCallOptions()
  ```
  Then create an instance of `CallKitRemoteInfo`
  ```Swift
  options.callKitRemoteInfo = CallKitRemoteInfo()
  ```

  1. Assign value for `callKitRemoteInfo.displayNameForCallKit` to customize display name for call recipients and configure `CXHandle` value. This value specified in `displayNameForCallKit` is exactly how it will show up in the last dialed call log.

  ```Swift
  options.callKitRemoteInfo.displayNameForCallKit = "DISPLAY_NAME"
  ```
  2. Assign the `cxHandle` value is what the application will receive when user calls back on that contact
  ```Swift
  options.callKitRemoteInfo.cxHandle = CXHandle(type: .generic, value: "VALUE_TO_CXHANDLE")
  ```

  ### Specify call recipient info for incoming calls

  First we need to create an instance of `CallKitOptions`: 

  ```Swift
  let callKitOptions = CallKitOptions(with: createProviderConfig())
  ```

  Configure the properties of `CallKitOptions` instance: 

  Block that is passed to variable `provideRemoteInfo` will be called by the SDK when we receive an incoming call and we need to get a display name for the incoming caller, which we need to pass to the CallKit.

  ```Swift
  callKitOptions.provideRemoteInfo = self.provideCallKitRemoteInfo

  func provideCallKitRemoteInfo(callerInfo: CallerInfo) -> CallKitRemoteInfo
  {
      let callKitRemoteInfo = CallKitRemoteInfo()
      callKitRemoteInfo.displayName = "CALL_TO_PHONENUMBER_BY_APP"      
      callKitRemoteInfo.cxHandle = CXHandle(type: .generic, value: "VALUE_TO_CXHANDLE")
      return callKitRemoteInfo
  }
  ```

  ### Configure audio session

  Configure audio session will be called before placing or accepting incoming call and before resuming the call after it has been put on hold.
  
  ```Swift
  callKitOptions.configureAudioSession = self.configureAudioSession

  public func configureAudioSession() -> Error? {
      let audioSession: AVAudioSession = AVAudioSession.sharedInstance()
      var configError: Error?
      do {
          try audioSession.setCategory(.playAndRecord)
      } catch {
          configError = error
      }
      return configError
  }
  ```

  NOTE: In cases where Contoso has already configured audio sessions DO NOT provide `nil` but return `nil` error in the block 

  ```Swift
  callKitOptions.configureAudioSession = self.configureAudioSession

  public func configureAudioSession() -> Error? {
      return nil
  }
  ```
  if `nil` is provided for `configureAudioSession` then SDK will call the default implementation in the SDK.

  ### Handle incoming push notification payload

  When the app receives incoming push notification payload, we need to call `handlePush` to process it. ACS Calling SDK will then raise the `IncomingCall` event.

  ```Swift
  public func handlePushNotification(_ pushPayload: PKPushPayload)
  {
      let callNotification = PushNotificationInfo.fromDictionary(pushPayload.dictionaryPayload)
      if let agent = self.callAgent {
          agent.handlePush(notification: callNotification) { (error) in }
      }
  }

  // Event raised by the SDK
  public func callAgent(_ callAgent: CallAgent, didRecieveIncomingCall incomingcall: IncomingCall) {
  }
  ```

  We can use `reportIncomingCallFromKillState` to handle push notifications when the app is closed. 
  `reportIncomingCallFromKillState` API shouldn't be called if `CallAgent` instance is already available when push is received.

  ```Swift
  if let agent = self.callAgent {
    /* App is not in a killed state */
    agent.handlePush(notification: callNotification) { (error) in }
  } else {
    /* App is in a killed state */
    CallClient.reportIncomingCallFromKillState(with: callNotification, callKitOptions: callKitOptions) { (error) in
        if (error == nil) {
            DispatchQueue.global().async {
                self.callClient = CallClient()
                let options = CallAgentOptions()
                let callKitOptions = CallKitOptions(with: createProviderConfig())
                callKitOptions.provideRemoteInfo = self.provideCallKitRemoteInfo
                callKitOptions.configureAudioSession = self.configureAudioSession
                options.callKitOptions = callKitOptions
                self.callClient!.createCallAgent(userCredential: userCredential,
                    options: options,
                    completionHandler: { (callAgent, error) in
                    if (error == nil) {
                        self.callAgent = callAgent
                        self.callAgent!.handlePush(notification: callNotification) { (error) in }
                    }
                })
            }
        } else {
            os_log("SDK couldn't handle push notification KILL mode reportToCallKit FAILED", log:self.log)
        }
    }
  }
  ```
  
 ## CallKit Integration (within App)
  
  If you wish to integrate the CallKit within the app and not use the CallKit implementation in the SDK, please take a look at the quickstart sample [here](https://github.com/Azure-Samples/communication-services-ios-quickstarts/tree/main/Add%20Video%20Calling).
  But one of the important things to take care of is to start the audio at the right time. Like following
  
 ```Swift
let mutedAudioOptions = AudioOptions()
mutedAudioOptions.speakerMuted = true
mutedAudioOptions.muted = true

let copyStartCallOptions = StartCallOptions()
copyStartCallOptions.audioOptions = mutedAudioOptions

callAgent.startCall(participants: participants,
                    options: copyStartCallOptions,
                    completionHandler: completionBlock)
```

Muting speaker and microphone will ensure that physical audio devices aren't used until the CallKit calls the `didActivateAudioSession` on `CXProviderDelegate`. Otherwise the call may get dropped or no audio will be flowing.

```Swift
func provider(_ provider: CXProvider, didActivate audioSession: AVAudioSession) {
   activeCall.unmute { error in
       if error == nil {
           print("Successfully unmuted mic")
           activeCall.speaker(mute: false) { error in
               if error == nil {
                   print("Successfully unmuted speaker")
               }
           }
       }
   }
}
```

> [!NOTE]
> In some cases CallKit doesn't call `didActivateAudioSession` even though the app has elevated audio permissions, in that case the audio will stay muted until the call back is received. And the UI has to reflect the state of the speaker and microphone. The remote participant/s in the call will see that the user has muted audio as well. User will have to manually unmute in those cases.

  ## Next steps
  - [Learn how to manage video](./manage-video.md)
  - [Learn how to manage calls](./manage-calls.md)
  - [Learn how to record calls](./record-calls.md)
