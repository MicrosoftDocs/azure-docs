---
title: Using the Azure Communication Services Teams Embed for iOS
description: In this overview, you will learn how to use the Azure Communication Services Teams Embed library for iOS.
author: palatter
ms.author: palatter
ms.date: 24/02/2021
ms.topic: conceptual
ms.service: azure-communication-services
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../create-communication-resource.md).
- A `User Access Token` to enable the call client. For more information on [how to get a `User Access Token`](../../access-tokens.md)
- Complete the quickstart for [getting started with adding Teams Embed to your application](../getting-started-with-teams-embed.md)

## Teams Embed Events

Add the `MeetingUIClientDelegate` to your class.

```swift
class ViewController: UIViewController, MeetingUIClientDelegate {

    private var meetingUIClient: MeetingUIClient?
```

Set the `meetingUIClientDelegate` to `self`.

```swift
override func viewDidLoad() {
    super.viewDidLoad()
    
    meetingUIClient?.meetingUIClientDelegate = self
}
```

Implement the `didUpdateCallState` and `didUpdateRemoteParticipantCount` functions.

```swift
    func meetingUIClient(didUpdateCallState callState: MeetingUIClientCallState) {
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

Add the `MeetingUIClientIdentityProviderDelegate` to your class.

```swift
class ViewController: UIViewController, MeetingUIClientIdentityProviderDelegate {

    private var meetingUIClient: MeetingUIClient?
```

Set the `MeetingUIClientIdentityProviderDelegate` to `self` before joining the meeting.

```swift
private func joinMeeting() {
    meetingUIClient?.meetingUIClientIdentityProviderDelegate = self
    let meetingJoinOptions = MeetingUIClientMeetingJoinOptions(displayName: "John Smith", enablePhotoSharing: true, enableNamePlateOptionsClickDelegate: true)
    let meetingLocator = MeetingUIClientTeamsMeetingLinkLocator(meetingLink: <MEETING_URL>)
    meetingUIClient?.join(meetingLocator: meetingLocator, joinCallOptions: meetingJoinOptions, completionHandler: { (error: Error?) in
        if (error != nil) {
            print("Join meeting failed: \(error!)")
        }
    })
}
```

Add and implement `avatarFor` and map each `userMri` with the corresponding avatar.

```swift
    func avatarFor(userIdentifier: String, completionHandler: @escaping (UIImage?) -> Void) {
        if (userIdentifier.starts(with: "8:teamsvisitor:")) {
            // Anonymous teams user will start with prefix 8:teamsvistor:
            let image = UIImage (named: "avatarPink")
            completionHandler(image!)
        }
        else if (userIdentifier.starts(with: "8:orgid:")) {
            // OrgID user will start with prefix 8:orgid:
            let image = UIImage (named: "avatarDoctor")
            completionHandler(image!)
        }
        else if (userIdentifier.starts(with: "8:acs:")) {
            // ACS user will start with prefix 8:acs:
            let image = UIImage (named: "avatarGreen")
            completionHandler(image!)
        }
        else {
            completionHandler(nil)
        }
}

```

Add other mandatory MeetingUIClientIdentityProviderDelegate protocol methods to the class and they may be left with empty implementation.
```swift
    func displayNameFor(userIdentifier: String, completionHandler: @escaping (String?) -> Void) {
    }
    
    func subTitleFor(userIdentifier: String, completionHandler: @escaping (String?) -> Void) {
    }
```
