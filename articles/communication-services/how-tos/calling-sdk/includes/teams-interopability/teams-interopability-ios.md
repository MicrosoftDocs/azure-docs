---
author: jiyoonlee
ms.service: azure-communication-services
ms.topic: include
ms.date: 05/14/2024
ms.author: jiyoonlee
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-windows.md)]

## Meeting join methods
To join a Teams meeting, use the `CallAgent.join` method and pass a `JoinMeetingLocator` and a `JoinCallOptions`.

### Meeting ID and passcode
The `TeamsMeetingIdLocator` locates a meeting using a meeting ID and passcode. These can be found under a Teams meeting's join info.
A Teams meeting ID will be 12 characters long and will consist of numeric digits grouped in threes (i.e. `000 000 000 000`).
A passcode will consist of 6 alphabet characters (i.e. `aBcDeF`). The passcode is case sensitive.

```swift
String meetingId, passcode
let locator = TeamsMeetingIdLocator(meetingId: meetingId, passcode: passcode)
```

### Meeting link
The `TeamsMeetingLinkLocator` locates a meeting using a link to a Teams meeting. This can found under a Teams meeting's join info. 
```swift
String meetingLink
let locator = TeamsMeetingLinkLocator(meetingLink: meetingLink)
```

## Join meeting using locators
After creating these Teams meeting locators, you can use it to join a Teams meeting using `CallAgent.join` as shown below.

```swift
func joinTeamsMeeting() {
    // Ask permissions
    AVAudioSession.sharedInstance().requestRecordPermission { (granted) in
        if granted {
            let joinCallOptions = JoinCallOptions()
            
            // Insert meeting locator code for specific join methods here

            // for CallAgent callAgent
            self.callAgent?.join(with: teamsMeetingLinkLocator, joinCallOptions: joinCallOptions) 
        }
    }
}
```