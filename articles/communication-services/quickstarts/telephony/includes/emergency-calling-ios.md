---
author: DaybreakQuip
ms.service: azure-communication-services
ms.topic: include
ms.date: 07/20/2023
ms.author: zehangzheng
---
[!INCLUDE [Emergency Calling Notice](../../../includes/emergency-calling-notice-include.md)]

## Prerequisites

- A working [Communication Services calling app for iOS](../pstn-call.md)

## Important considerations

- The capability to dial an emergency number and receive a callback might be a requirement for your application. Verify the emergency calling requirements with your legal counsel.
- Microsoft uses country/region codes according to the ISO 3166-1 alpha-2 standard.
- Supported ISO codes are US (United States), PR (Puerto Rico), CA (Canada), and GB (United Kingdom), and DK (Denmark) only.
- If you don't provide the country/region ISO code to the Azure Communication Services Calling SDK, Microsoft uses the IP address to determine the country or region of the caller.

  If the IP address can't provide reliable geolocation (for example, the user is on a virtual private network), you must set the ISO code of the calling country or region by using the API in the Calling SDK.
- If users are dialing from a US territory (for example, Guam, US Virgin Islands, Northern Mariana Islands, or American Samoa), you must set the ISO code to US.
- Azure Communication Services direct routing is currently in public preview and not intended for production workloads. Emergency dialing is out of scope for Azure Communication Services direct routing.
- For information about billing for the emergency service in Azure Communication Services, see the [pricing page](https://azure.microsoft.com/pricing/details/communication-services/).

## Set up a button for testing

Replace the code for `NavigationView` in your *ContentView.swift* file with the following snippet. It adds a new button for testing emergency calls.

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

## Specify the country or region

Specify the ISO code of the country or region where the caller is located. For a list of supported ISO codes, see the [conceptual article about emergency calling](/azure/communication-services/concepts/telephony/emergency-calling-concept).  

In your *ContentView.swift* file, replace your code with the following snippet in the `onAppear` method for `NavigationView`:

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

## Add functionality to the call button

Add functionality to your emergency call button by adding the following code to your *ContentView.swift* file. A temporary caller ID is assigned for your emergency call whether or not you provide the `alternateCallerId` parameter.

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
> 933 is a test call service. You can use it to test emergency calling services without interrupting live 911 emergency call services. 911 must be dialed in actual emergency situations.

## Run the app and place a call

:::image type="content" source="../media/emergency-calling/emergency-calling-ios-app.png" alt-text="Screenshot of a completed iOS calling application.":::

Build and run your app on the iOS simulator by selecting **Product** > **Run** or by using the &#8984;+R keyboard shortcut. You can place a call to 933 by selecting the **933 Test Call** button.