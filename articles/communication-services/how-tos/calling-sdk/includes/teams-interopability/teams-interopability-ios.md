---
author: jiyoonlee
ms.service: azure-communication-services
ms.topic: include
ms.date: 10/16/2022
ms.author: jiyoonlee
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-windows.md)]

## Meeting join methods
To join a Teams meeting, use the `CallAgent.Jjoin` method and pass a `JoinMeetingLocator` and a `JoinCallOptions`.

### Meeting ID and passcode
A Teams meeting ID will be 12 characters long and will consist of numeric digits grouped in threes (i.e. `000 000 000 000`).
A passcode will consist of 6 alphabet characters (i.e. `aBcDeF`).

```swift
String meetingId, passcode
let locator = TeamsMeetingIdLocator(meetingId: meetingId, passcode: passcode)
```

### Meeting link
```swift
String meetingLink
let locator = TeamsMeetingLinkLocator(meetingLink: meetingLink)
```

## Join meeting using locators
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