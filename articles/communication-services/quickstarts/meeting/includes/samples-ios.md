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

## Teams Embed call or meeting status events capturing

Add the `MeetingUIClientCallDelegate` to your class and add needed variables.

```swift
class ViewController: UIViewController, MeetingUIClientCallDelegate {

    private var meetingUIClient: MeetingUIClient?
    private var meetingUIClientCall: MeetingUIClientCall?
    
    //Rest of the UIViewController code
}
```

Set the `self.meetingUIClientCall?.meetingUIClientCallDelegate` to `self` after joining the call or meeting has started successfully.

```swift
private func joinMeeting() {
    let meetingJoinOptions = MeetingUIClientMeetingJoinOptions(displayName: "John Smith", enablePhotoSharing: true, enableNamePlateOptionsClickDelegate: true)
    let meetingLocator = MeetingUIClientTeamsMeetingLinkLocator(meetingLink: "<MEETING_URL>")
    meetingUIClient?.join(meetingLocator: meetingLocator, joinCallOptions: meetingJoinOptions, completionHandler: { (meetingUIClientCall: MeetingUIClientCall?, error: Error?) in
        if (error != nil) {
            print("Join meeting failed: \(error!)")
        }
        else {
            if (meetingUIClientCall != nil) {
                self.meetingUIClientCall? = meetingUIClientCall
                self.meetingUIClientCall?.meetingUIClientCallDelegate = self
            }
        }
    })
}
```

Implement the `didUpdateCallState` and `didUpdateRemoteParticipantCount` methods of the `MeetingUIClientCallDelegate` protocol.

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
    
    func meetingUIClient(didUpdateRemoteParticipantCount remoteParticipantCount: UInt) {
        print("Remote participant count has changed to: \(remoteParticipantCount)")
    }
```

## Assigning avatars for users

Add the `MeetingUIClientCallIdentityProviderDelegate` to your class.

```swift
class ViewController: UIViewController, MeetingUIClientCallIdentityProviderDelegate {

    private var meetingUIClient: MeetingUIClient?
    private var meetingUIClientCall: MeetingUIClientCall?
```

Set the `self.meetingUIClientCall?.MeetingUIClientIdentityProviderDelegate` to `self` after joining the call or meeting has started successfully.

```swift
private func joinMeeting() {
    let meetingJoinOptions = MeetingUIClientMeetingJoinOptions(displayName: "John Smith", enablePhotoSharing: true, enableNamePlateOptionsClickDelegate: true)
    let meetingLocator = MeetingUIClientTeamsMeetingLinkLocator(meetingLink: "<MEETING_URL>")
    meetingUIClient?.join(meetingLocator: meetingLocator, joinCallOptions: meetingJoinOptions, completionHandler: { (meetingUIClientCall: MeetingUIClientCall?, error: Error?) in
        if (error != nil) {
            print("Join meeting failed: \(error!)")
        }
        else {
            if (meetingUIClientCall != nil) {
                self.meetingUIClientCall? = meetingUIClientCall
                self.meetingUIClientCall?.meetingUIClientCallIdentityProviderDelegate = self
            }
        }
    })
}
```

Add and implement `avatarFor` protocol method and map each `identifier` with to the corresponding avatar.

```swift
    func avatarFor(identifier: CommunicationIdentifier, size: MeetingUIClientAvatarSize, completionHandler: @escaping (UIImage?) -> Void) {
        if let userIdentifier = identifier as? CommunicationUserIdentifier
        {
            if (userIdentifier.identifier.starts(with: "8:teamsvisitor:")) {
                // Anonymous teams user will start with prefix 8:teamsvistor:
                let image = UIImage (named: "avatarPink")
                completionHandler(image!)
            }
            else if (userIdentifier.identifier.starts(with: "8:orgid:")) {
                // OrgID user will start with prefix 8:orgid:
                let image = UIImage (named: "avatarDoctor")
                completionHandler(image!)
            }
            else if (userIdentifier.identifier.starts(with: "8:acs:")) {
                // ACS user will start with prefix 8:acs:
                let image = UIImage (named: "avatarGreen")
                completionHandler(image!)
            } else {
                completionHandler(nil)
            }
        } else {
            completionHandler(nil)
        }
    }

```

Add other mandatory MeetingUIClientCallIdentityProviderDelegate protocol methods to the class and they may be left with empty implementations.
```swift
	func displayNameFor(identifier: CommunicationIdentifier, completionHandler: @escaping (String?) -> Void) {
	}
    
	func subTitleFor(identifier: CommunicationIdentifier, completionHandler: @escaping (String?) -> Void) {
	}
    
	func roleFor(identifier: CommunicationIdentifier, completionHandler: @escaping (MeetingUIClientUserRole) -> Void) {
	}
```

## Use Azure Communication Calling SDK via Teams Embed SDK

Teams Embed SDK provides also Azure Communication Calling SDK (ACS) within it, which allows to use both SDK features in the same app. 
Only one SDK can be initialized and used at the time. Having both SDKs initialized and used at the same time will result in unexpected behavior. 

Import `TeamsAppSDK` to access Azure Communication Calling SDK from Teams Embed SDK. 
```swift
import TeamsAppSDK
```

Declare variables for ACS usage
```swift
class ViewController: UIViewController {

    private var callClient: CallClient?
    private var callAgent: CallAgent?
    private var call: Call?
    
    //Rest of the UIViewController code
}
    
```

Initialization is done by creating new `CallClient`

```swift
self.callClient = CallClient()
```
Use all ACS APIs like they are described in its documentation.

Dispose the ACS SDK and set `nil` to its variables after the usage is not needed anymore or the app needs to use Teams Embed SDK.
```swift
    public func disposeAcsSdk()
    {
        self.call = nil
        self.callAgent?.dispose()
        self.callClient?.dispose()
        self.callAgent = nil
        self.callClient = nil
    }

```

Teams Embed SDK initialization is also done during creating `MeetingUIClient`.
```swift
do {
    let communicationTokenRefreshOptions = CommunicationTokenRefreshOptions(initialToken: "<USER_ACCESS_TOKEN>", refreshProactively: true, tokenRefresher: fetchTokenAsync(completionHandler:))
	let credential = try CommunicationTokenCredential(withOptions: communicationTokenRefreshOptions)
    meetingUIClient = MeetingUIClient(with: credential)
}
catch {
    print("Failed to create communication token credential")
}


private func fetchTokenAsync(completionHandler: @escaping TokenRefreshHandler) {
    func getTokenFromServer(completionHandler: @escaping (String) -> Void) {
        completionHandler("<USER_ACCESS_TOKEN>")
    }
    getTokenFromServer { newToken in
        completionHandler(newToken, nil)
    }
}

```
Use the Teams Embed SDK APIs like they are described in its documentation. 

Dispose the Teams Embed SDK and set `nil` to its variables after the usage is not needed anymore or the app needs to use ACS SDK.
```swift
    private func disposeTeamsSdk() {
        self.meetingUIClient?.dispose(completionHandler: { (error: Error?) in
            if (error != nil) {
                print("Dispose failed: \(error!)")
            } else {
                self.meetingUIClient = nil
                self.meetingUIClientCall = nil
            }
        })        
    }

```

Disposing Teams Embed SDK is only possible if there are no active calls. The `meetingUIClient?.dispose` will return error in its completion handler if there's an active call. 
Hang up the active call and call `self.disposeTeamsSdk()` if there was no active call left.
```swift
	
	private var shouldDispose: Bool = false

	public func endMeeting() {
        meetingUIClientCall?.hangUp(completionHandler: { (error: Error?) in
            if (error != nil) {
                print("End meeting failed: \(error!)")
                // There are no active calls
                self.disposeTeamsSdk()
            } else {
            	// Ending active call is in progress.
	            self.shouldDispose = true;
            }
        })
    }

```

Implement `MeetingUIClientCallDelegate` protocol method `meetingUIClientCall(didUpdateCallState callState: MeetingUIClientCallState)` to get status update about active call being ended and dispose the Teams Embed SDK after it.
```swift
    func meetingUIClientCall(didUpdateCallState callState: MeetingUIClientCallState) {
        switch callState {
        case .connecting:
        case .connected:
        case .waitingInLobby:
        case .ended:
        	if (self.shouldDispose) {
            	self.disposeTeamsSdk()
            }
        @unknown default:
            print("Unsupported state")
        }
    }
```