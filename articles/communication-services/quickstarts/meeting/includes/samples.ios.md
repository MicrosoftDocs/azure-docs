---
author: palatter
ms.service: azure-communication-services
ms.topic: include
ms.date: 24/02/2021
ms.author: palatter
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../create-communication-resource.md).
- A `User Access Token` to enable the call client. For more information on [how to get a `User Access Token`](../../access-tokens.md)
- Complete the quickstart for [getting started with adding meeting composite to your application](../getting-started-with-meeting-composite.md)

## Meeting Composite Events

Add the `MeetingUIClientDelegate` to your class.

```swift
class ViewController: UIViewController, MeetingUIClientDelegate {

    private var meetingClient: MeetingUIClient?
```

Set the `meetingUIClientDelegate` to `self`.

```swift
override func viewDidLoad() {
    super.viewDidLoad()
    
    meetingClient?.meetingUIClientDelegate = self
}
```

Implement the `didUpdateCallState` and `didUpdateRemoteParticipantCount` functions.

```swift
    func meetingUIClient(didUpdateCallState callState: CallState) {
        switch callState {
        case .connecting:
            print("Call state has changed to 'Connecting'")
        case .connected:
            print("Call state has changed to 'Connected'")
        case .waitingInLobby:
            print("Call state has changed to 'Waiting in Lobby'")
        case .ended:
            print("Call state has changed to 'Ended'")
        }
    }
    
    func meetingUIClient(didUpdateRemoteParticipantCount remoteParticpantCount: UInt) {
        print("Remote participant count has changed to: \(remoteParticpantCount)")
    }
```

## Assigning avatars for users

Add the `MeetingIdentityProviderDelegate` to your class.

```swift
class ViewController: UIViewController, MeetingIdentityProviderDelegate {

    private var meetingClient: MeetingUIClient?
```

Set the `MeetingIdentityProviderDelegate` to `self` before joining the meeting.

```swift
private func joinMeeting() {
    meetingClient?.meetingIdentityProviderDelegate = self
    let meetingJoinOptions = MeetingJoinOptions(displayName: "John Smith")

    meetingClient?.join(meetingUrl: meetingURL, meetingJoinOptions: meetingJoinOptions, completionHandler: { (error: Error?) in
        if (error != nil) {
            print("Join meeting failed: \(error!)")
        }
    })
}
```

Map each `userMri` with the corresponding avatar.

```swift
func avatarForUserMri(userMri: String, completionHandler completion: @escaping (UIImage?) -> Void) {
        if (userMri .starts(with: "8:teamsvisitor:")) {
            // Anonymous teams user will start with prefix 8:teamsvistor:
            let image = UIImage (named: "avatarPink")
            completion(image!)
        }
        else if (userMri .starts(with: "8:orgid:")) {
            // OrgID user will start with prefix 8:orgid:
            let image = UIImage (named: "avatarDoctor")
            completion(image!)
        }
        else if (userMri .starts(with: "8:acs:")) {
            // ACS user will start with prefix 8:acs:
            let image = UIImage (named: "avatarGreen")
            completion(image!)
        }
        else {
            completion(nil)
        }
}
```