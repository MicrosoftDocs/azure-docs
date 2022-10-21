---
author: DaybreakQuip
ms.service: azure-communication-services
ms.topic: include
ms.date: 12/09/2021
ms.author: zehangzheng
---
[!INCLUDE [Emergency Calling Notice](../../../includes/emergency-calling-notice-include.md)]

## Prerequisites

- A working [Communication Services calling iOS app](../pstn-call.md).

## Important considerations
- The capability to dial 911 and receive a call-back may be a requirement for your application. Verify the E911 requirements with your legal counsel. 
- Microsoft uses country codes according to ISO 3166-1 alpha-2 standard 
- If the country ISO code is not provided to the SDK, the IP address will be used to determine the country of the caller. 
- In case IP address cannot provide reliable geolocation, for example the user is on a Virtual Private Network, it is required to set the ISO Code of the calling country using the API in the Azure Communication Services Calling SDK. 
- If users are dialing from a US territory (for example Guam, US Virgin Islands, Northern Marianas, or American Samoa), it is required to set the ISO code to the US   
- Supported ISO codes are US and Puerto Rico only
- Azure Communication Services direct routing is currently in public preview and not intended for production workloads. So E911 dialing is out of scope for Azure Communication Services direct routing.
- The 911 service is temporarily free to use for Azure Communication Services customers within reasonable use, however billing for the service will be enabled in 2022.   
- Calls to 911 are capped at 10 concurrent calls per Azure Resource.     


## Setting up
Replace the code for `NavigationView` in your **ContentView.swift** with following snippet. It will add a new button for testing emergency calls.

```swift
NavigationView {
    Form {
        Section {
            TextField("Who would you like to call?", text: $callee)
            Button(action: startCall) {
                Text("Start Call")
            }.disabled(callAgent == nil)
            Button(action: endCall) {
                Text("End Call")
            }.disabled(call == nil)
            Button (action: emergencyCall) {
              Text("933 Test Call")
            }.disabled(callAgent == nil)
            Text(status)
            Text(message)
        }
    }
    .navigationBarTitle("Emergency Calling Quickstart")
}
```
## Emergency test call to phone 
Specify the ISO code of the country where the caller is located. If the ISO code is not provided, the IP address will be used to determine the callers location.  Microsoft uses the ISO 3166-1 alpha-2 standard for country ISO codes, supported ISO codes are listed on the concept page for emergency calling.   

In your **ContentView.swift**, replace your code with the following snippet in your `NavigationView`'s `onAppear` method to specify the emergency country:

```swift
var userCredential: CommunicationTokenCredential?
do {
    userCredential = try CommunicationTokenCredential(token: "<USER ACCESS TOKEN>")
} catch {
    print("ERROR: It was not possible to create user credential.")
    return
}

self.callClient = CallClient()
let emergencyOptions = EmergencyCallOptions()
emergencyOptions.countryCode = "<COUNTRY CODE>"
let callAgentOptions = CallAgentOptions()
callAgentOptions.emergencyCallOptions= emergencyOptions

// Creates the call agent
self.callClient?.createCallAgent(userCredential: userCredential!, options: callAgentOptions) { (agent, error) in
    if error != nil {
        print("ERROR: It was not possible to create a call agent.")
        return
    }
    else {
        self.callAgent = agent
        print("Call agent successfully created.")
    }
}

```
> [!WARNING]
> Note Azure Communication Services supports enhanced emergency calling to 911 from the United States and Puerto Rico only, calling 911 from other countries is not supported.

## Start a call to 933 test call service

Add the following code to your **ContentView.swift** to add functionality to your emergency call button. For US only, a temporary Caller Id will be assigned for your emergency call despite of whether alternateCallerId param is provided or not. 

```swift
func emergencyCall() {
        // Ask permissions
        AVAudioSession.sharedInstance().requestRecordPermission { (granted) in
            if granted {
                let startCallOptions = StartCallOptions()
                self.callAgent!.startCall(participants: [PhoneNumberIdentifier(phoneNumber: "933")], options: startCallOptions) { (call, error) in
                    if (error == nil) {
                        self.call = call
                    } else {
                        print("Failed to get call object")
                    }
                }
            }
        }
    }
```
> [!IMPORTANT]
> 933 is a test emergency call service, used to test emergency calling services without interrupting live production emergency calling handling 911 services.  911 must be dialled in actual emergency situations.

## Launch the app

:::image type="content" source="../media/emergency-calling/emergency-calling-ios-app.png" alt-text="Screenshot of the completed iOS application.":::

Build and run your app on iOS simulator by selecting **Product** > **Run** or by using the (&#8984;-R) keyboard shortcut. You can place a call to 933 by clicking the **933 Test Call** button.