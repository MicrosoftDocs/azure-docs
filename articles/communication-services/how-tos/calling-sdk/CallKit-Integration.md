 # Integrate with CallKit

  In this document we will go through how to integrate CallKit with your iOS application. 

  > [!NOTE]
  > This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment. To use this api please use 'beta' release of Azure Communication Services Calling iOS SDK

  ## Prerequisites

  - An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
  - A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
  - A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../quickstarts/access-tokens.md).
  - Optional: Complete the quickstart to [add voice calling to your application](../../quickstarts/voice-video-calling/getting-started-with-calling.md)

  ## CallKit Integration

 CallKit Integration in the ACS iOS SDK handles interaction with CallKit for us. To perform any call operations like mute/unmute, hold/resume, we only need to call the API on the ACS SDK. 

  ### Specify call recipient info

  First we need to create an instance of `StartCallOptions()` for outgoing calls, or `JoinCallOptions()` for group call: 
  ```Swift
  let options = StartCallOptions()
  ```
  or
  ```Swift
  let options = JoinCallOptions()
  ```
  Then create an instance of CallKitRemoteInfo()
  ```Swift
  options.callKitRemoteInfo = CallKitRemoteInfo()
  ```
  Assign value for `callKitRemoteInfo.displayNameForCallKit` to customize display name for call recipients and configure `CXHandle` value. 
  ```Swift
  options.callKitRemoteInfo.displayNameForCallKit = "DISPLAY_NAME"
  options.callKitRemoteInfo.cxHandle = CXHandle(type: .generic, value: "VALUE_TO_CXHANDLE")
  ```

  ### Configure call capabilities and recipient info with CallKitOptions

  We can specify call capabilities and configure audioSession with `CallKitOptions`. 

  First we need to create an instance of `CallKitOptions`: 

  ```Swift
  let callKitOptions = CallKitOptions(with: createProviderConfig())
  ```

  Configure the properties of `CallKitOptions` instance: 

  ```Swift
  callKitOptions.provideRemoteInfo = self.provideCallKitRemoteInfo
  callKitOptions.configureAudioSession = self.configureAudioSession

  public func createProviderConfig() -> CXProviderConfiguration {
      let providerConfig : CXProviderConfiguration = CXProviderConfiguration(localizedName: "NAME_OF_APP")

      // Assign call capabilities with providerConfig

      return providerConfig
  }

  func provideCallKitRemoteInfo(callerInfo: CallerInfo) -> CallKitRemoteInfo
  {
      let callKitRemoteInfo = CallKitRemoteInfo()

      // Assign values for cxHandle and displayNameForCallKit
      
      return callKitRemoteInfo;
  }

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

  ### Initialize call agent with CallKitOptions

  With configured instance of `CallKitOptions`, we can create the `CallAgent` with handling of `CallKit`.  

  ```Swift
  let callKitOptions = CallKitOptions(with: createProviderConfig())

  // Configure the properties of `CallKitOptions` instance here

  self.callClient!.createCallAgent(userCredential: userCredential,
      options: options,
      completionHandler: { (callAgent, error) in
      // Initialization
  })
  ```

  ### Handle incoming push notification payload

  When the app receives incoming push notification payload, we need to call `handlePush` to process it. With this API we can raise the IncomingCall event. 

  ```Swift
  public func handlePushNotification(_ pushPayload: PKPushPayload)
  {
      let callNotification = PushNotificationInfo.fromDictionary(pushPayload.dictionaryPayload)
      if let agent = self.callAgent {
          agent.handlePush(notification: callNotification) { (error) in
              if error == nil {
                  os_log("==> SDK handle push notification NORMAL mode PASSED", log:self.log)
              } else {
                  os_log("==> SDK handle push notification NORMAL mode FAILED", log:self.log)
              }
              assert(error == nil, "SDK couldn't handle push notification")
          }
      }
  }

  # Event raised by the SDK
  public func callAgent(_ callAgent: CallAgent, didRecieveIncomingCall incomingcall: IncomingCall) {
  }
  ```

  We can use `reportIncomingCallToCallKit` to handle push notifications when the app is closed. 
  `reportIncomingCallToCallKit` API should not be called if `CallAgent` instance is already available when push is recieved.

  ```Swift
  CallClient.reportIncomingCallToCallKit(with: callNotification, callKitOptions: callKitOptions) { (error) in
      if (error == nil) {
          self.callClient = CallClient()

          let callKitOptions = CallKitOptions(with: createProviderConfig())
          callKitOptions.provideRemoteInfo = self.provideCallKitRemoteInfo
          callKitOptions.configureAudioSession = self.configureAudioSession
          options.callKitOptions = callKitOptions 
          self.callClient!.createCallAgent(userCredential: userCredential,
                                           options: options,
                                           completionHandler: { (callAgent, error) in
              if error != nil {
                  os_log("==> createCallAgent FAILED", log:self.log)
              } else {
                  os_log("==> createCallAgent SUCCEEDED", log:self.log)
                  if registerForPush {
                      self.registerPushNotification(nil)
                  }
                  os_log("==> SDK initialize completed, calling handlePush", log:self.log)
                  
                  self.callAgent!.handlePush(notification: callNotification) { (error) in
                      if error == nil {
                          os_log("==> SDK handle push notification KILL state FULL: PASSED", log:self.log)
                      } else {
                          os_log("==> SDK handle push notification KILL state FULL: FAILED", log:self.log)
                      }
                      assert(error == nil, "SDK couldn't handle push notification")
                  }
              }
          })
      } else {
          os_log("==>SDK couldn't handle push notification KILL mode reportIncomingCallToCallKit FAILED", log:self.log)
      }        
  }
  ```

  ## Next steps
  - [Learn how to manage video](./manage-video.md)
  - [Learn how to manage calls](./manage-calls.md)
  - [Learn how to record calls](./record-calls.md)
