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

Joined group call or meeting status can be captured from `MeetingUIClientCallDelegate` delegate. The status includes connection states, participants count, and modalities like microphone or camera state.   

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

Implement `MeetingUIClientCallDelegate` protocol methods that your app needs and add stubs for ones that are not needed.

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
    
    func onIsMutedChanged() {
    }
    
    func onIsSendingVideoChanged() {
    }
    
    func onIsHandRaisedChanged(_ participantIds: [Any]) {
    }
```

## Bring your own identity from the app to the participants in the SDK call.

The app can assign its users identity values to the participants in the call or meeting and override the default values. The values include avatar, name, subtitle, and role.  

### Assigning avatars for call participants

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

Add and implement `avatarFor` protocol method and map each `identifier` to the corresponding avatar.

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

## Use Teams Embed SDK and Azure Communication Calling SDK in the same app

Teams Embed SDK provides also Azure Communication Calling SDK (ACS) within it, which allows to use both of the SDK features in the same app. 
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

Initialization is done by creating new `CallClient`. Add the creation to `viewDidLoad` or to any other method.

```swift
override func viewDidLoad() {
    super.viewDidLoad()
    self.callClient = CallClient()
}
```
Use all ACS APIs like they are described in its documentation. The API usage is not discussed in this documentation. 

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

Teams Embed SDK initialization is also done during creating `MeetingUIClient`. Add the creation to `viewDidLoad` or to any other method.
```swift
override func viewDidLoad() {
    super.viewDidLoad()
    do {
        let communicationTokenRefreshOptions = CommunicationTokenRefreshOptions(initialToken: "<USER_ACCESS_TOKEN>", refreshProactively: true, tokenRefresher: fetchTokenAsync(completionHandler:))
        let credential = try CommunicationTokenCredential(withOptions: communicationTokenRefreshOptions)
        meetingUIClient = MeetingUIClient(with: credential)
    }
    catch {
        print("Failed to create communication token credential")
    }
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
Use the Teams Embed SDK APIs like they are described in its documentation. The API usage is not discussed in this documentation. 

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

Add other mandatory `MeetingUIClientCallDelegate` protocol methods to the class

```swift
    func meetingUIClientCall(didUpdateRemoteParticipantCount remoteParticipantCount: UInt) {
        print("Remote participant count has changed to: \(remoteParticipantCount)")
    }

    func onIsMutedChanged() {
        print("Mute state changed to: \(meetingUIClientCall?.isMuted ?? false)")
    }
    
    func onIsSendingVideoChanged() {
        print("Sending video state changed to: \(meetingUIClientCall?.isSendingVideo ?? false)")
    }
    
    func onIsHandRaisedChanged(_ participantIds: [Any]) {
        print("Self participant raise hand status changed to: \(meetingUIClientCall?.isHandRaised ?? false)")
    }
```

## Receive information about user actions in the UI and add your own custom functionalities.

The `MeetingUIClientCallUserEventDelegate` delegate methods are called upon user actions in remote participant's profile.
While joining the call or meeting, set the join options property `enableNamePlateOptionsClickDelegate` to `true`.
Setting this property would enable the name plate options in remote participant's profile and enable the `MeetingUIClientCallUserEventDelegate`.

Add the `MeetingUIClientCallUserEventDelegate` to your class.

```swift
class ViewController: UIViewController, MeetingUIClientCallUserEventDelegate {

    private var meetingUIClient: MeetingUIClient?
    private var meetingUIClientCall: MeetingUIClientCall?
```

Set the `self.meetingUIClientCall?.meetingUIClientCallUserEventDelegate` to `self` after joining the call or meeting has started successfully.

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
                self.meetingUIClientCall?.meetingUIClientCallUserEventDelegate = self
            }
        }
    })
}
```

Add and implement `onNamePlateOptionsClicked` protocol method and map each `identifier` to the corresponding call participant user.
This method is called on single tap of user tile or user title text from call main screen.

```swift
func onNamePlateOptionsClicked(identifier: CommunicationIdentifier) {
    if let userIdentifier = identifier as? CommunicationUserIdentifier
        {
            if (userIdentifier.identifier.starts(with: "8:acs:")) {
                // Custom behavior based on the user here.
                print("Acs user tile clicked")
            }
        }
}
```

Add and implement `onParticipantViewLongPressed` protocol method and map each `identifier` to the corresponding call participant user.
This method is called on long press of user tile from call main screen.

```swift
func onParticipantViewLongPressed(identifier: CommunicationIdentifier) {
    if let userIdentifier = identifier as? CommunicationUserIdentifier
        {
            if (userIdentifier.identifier.starts(with: "8:acs:")) {
                // Custom behavior based on the user here.
                print("Acs user tile clicked")
            }
        }
}
```
## User experience customization

The user experience in the SDK can be customized by providing app-specific icons or replacing call controls bars. 

### Customize UI icons in a call or meeting

The icons shown in the call or meeting could be customized through method `public func set(iconConfig: Dictionary<MeetingUIClientIconType, String>)` exposed in `MeetingUIClient`.
The list of possible icons that could be customized are available in `MeetingUIClientIconType`.

```swift
class ViewController: UIViewController {

    private var meetingUIClient: MeetingUIClient?
    private var meetingUIClientCall: MeetingUIClientCall?
```

After initializing the meetingUIClient, set the icon configuration `meetingUIClient?.set(iconConfig: self.getIconConfig())`  for the call icons supported in `MeetingUIClientIconType`.

```swift
private func initMeetingUIClient() {
    meetingUIClient = MeetingUIClient(with: credential)
    meetingUIClient?.set(iconConfig: self.getIconConfig())
}

func getIconConfig() -> Dictionary<MeetingUIClientIconType, String> {
    var iconConfig = Dictionary<MeetingUIClientIconType, String>()
    iconConfig.updateValue("camera_fill", forKey: MeetingUIClientIconType.VideoOn)
    iconConfig.updateValue("camera_off", forKey: MeetingUIClientIconType.VideoOff)
    iconConfig.updateValue("microphone_fill", forKey: MeetingUIClientIconType.MicOn)
    iconConfig.updateValue("microphone_off", forKey: MeetingUIClientIconType.MicOff)
    iconConfig.updateValue("speaker_fill", forKey: MeetingUIClientIconType.Speaker)
    return iconConfig
}
```

### Customize main call screen

The `MeetingUIClient` provides support to customize the main call screen UI. Currently it supports customizing the UI using `MeetingUIClientInCallScreenDelegate` protocol methods.
Call screen control actions are exposed through the methods present in `MeetingUIClientCall`.

Add the `MeetingUIClientInCallScreenDelegate` to your class.

```swift
class ViewController: UIViewController, MeetingUIClientInCallScreenDelegate {

    private var meetingUIClient: MeetingUIClient?
    private var meetingUIClientCall: MeetingUIClientCall?
```

Set the `meetingUIClient?.meetingUIClientInCallScreenDelegate` to `self` before joining the call or meeting.

```swift
private func joinGroupCall() {
    meetingUIClient?.meetingUIClientInCallScreenDelegate = self
    let groupJoinOptions = MeetingUIClientGroupCallJoinOptions(displayName: "John Smith", enablePhotoSharing: true, enableNamePlateOptionsClickDelegate: true, enableCallStagingScreen: true)
    let groupLocator = MeetingUIClientGroupCallLocator(groupId: "<GROUP_ID>")
    meetingUIClient?.join(meetingLocator: groupLocator, joinCallOptions: groupJoinOptions, completionHandler: { (meetingUIClientCall: MeetingUIClientCall?, error: Error?) in
        if (error != nil) {
            print("Join call failed: \(error!)")
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

Add and implement `provideControlTopBar` protocol method to provide the main call screen top information bar.

```swift
func provideControlTopBar() -> UIView? {
    let topView = UIStackView.init()
    // add your customization here
    return topView
}
```

Add other mandatory `MeetingUIClientInCallScreenDelegate` protocol methods to the class and they may be left with empty implementations to return nil.
```swift
func provideControlBottomBar() -> UIView? {
    return nil
}

func provideScreenBackgroudColor() -> UIColor? {
    return nil
}
```

## Customize on staging call screen

The `MeetingUIClient` provides support to customize the staging call screen UI. Currently it supports customizing the UI using `MeetingUIClientStagingScreenDelegate` protocol methods.
While joining the call or meeting, set the join options property `enableCallStagingScreen` to `true` to display the staging screen.

Add the `MeetingUIClientStagingScreenDelegate` to your class.

```swift
class ViewController: UIViewController, MeetingUIClientStagingScreenDelegate {

    private var meetingUIClient: MeetingUIClient?
    private var meetingUIClientCall: MeetingUIClientCall?
```

Set the `meetingUIClient?.meetingUIClientStagingScreenDelegate` to `self` before joining the call or meeting.

```swift
private func joinGroupCall() {
    meetingUIClient?.meetingUIClientStagingScreenDelegate = self
    let groupJoinOptions = MeetingUIClientGroupCallJoinOptions(displayName: "John Smith", enablePhotoSharing: true, enableNamePlateOptionsClickDelegate: true, enableCallStagingScreen: true)
    let groupLocator = MeetingUIClientGroupCallLocator(groupId: "<GROUP_ID>")
    meetingUIClient?.join(meetingLocator: groupLocator, joinCallOptions: groupJoinOptions, completionHandler: { (meetingUIClientCall: MeetingUIClientCall?, error: Error?) in
        if (error != nil) {
            print("Join call failed: \(error!)")
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

Add and implement `provideJoinButtonCornerRadius` protocol method to modify the join button corner to have rounded look.

```swift
func provideJoinButtonCornerRadius() -> CGFloat {
    return 24
}
```

Add other mandatory `MeetingUIClientStagingScreenDelegate` protocol methods to the class and they may be left with empty implementations to return nil.
```swift
func provideJoinButtonBackgroundColor() -> UIColor? {
    return nil
}

func provideStagingScreenBackgroundColor() -> UIColor? {
    return nil
}
```

## Customize on connecting call screen

The `MeetingUIClient` provides support to customize the connecting call screen UI. Currently it supports customizing the UI using `MeetingUIClientConnectingScreenDelegate` protocol methods.
Use the icon configuration method `set(iconConfig: Dictionary<MeetingUIClientIconType, String>)` exposed in `MeetingUIClient` to change only the icons displayed and use the functionality provided by the `MeetingUIClient`.


Add the `MeetingUIClientConnectingScreenDelegate` to your class.

```swift
class ViewController: UIViewController, MeetingUIClientConnectingScreenDelegate {

    private var meetingUIClient: MeetingUIClient?
    private var meetingUIClientCall: MeetingUIClientCall?
```

Set the `meetingUIClient?.meetingUIClientConnectingScreenDelegate` to `self` before joining the call or meeting.

```swift
private func joinGroupCall() {
    meetingUIClient?.meetingUIClientConnectingScreenDelegate = self
    let groupJoinOptions = MeetingUIClientGroupCallJoinOptions(displayName: "John Smith", enablePhotoSharing: true, enableNamePlateOptionsClickDelegate: true, enableCallStagingScreen: true)
    let groupLocator = MeetingUIClientGroupCallLocator(groupId: "<GROUP_ID>")
    meetingUIClient?.join(meetingLocator: groupLocator, joinCallOptions: groupJoinOptions, completionHandler: { (meetingUIClientCall: MeetingUIClientCall?, error: Error?) in
        if (error != nil) {
            print("Join call failed: \(error!)")
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

Add and implement `provideConnectingScreenBackgroundColor` protocol method to modify the background color of the connecting screen.

```swift
func provideConnectingScreenBackgroundColor() -> UIColor?
    return 24
}
```

## Perform operations with the call

Call control actions are exposed through the methods present in `MeetingUIClientCall`.
These methods are useful in controlling the call actions if the UI had been customized using the `MeetingUIClient` customization delegates.

Added needed variables to the calls.
```swift
class ViewController: UIViewController {

    private var meetingUIClient: MeetingUIClient?
    private var meetingUIClientCall: MeetingUIClientCall?
```

Assign the `self.meetingUIClientCall` variable the `meetingUIClientCall` value from the `join` method `completionHandler`
```swift
private func joinGroupCall() {
    let groupJoinOptions = MeetingUIClientGroupCallJoinOptions(displayName: "John Smith", enablePhotoSharing: true, enableNamePlateOptionsClickDelegate: true, enableCallStagingScreen: true)
    let groupLocator = MeetingUIClientGroupCallLocator(groupId: "<GROUP_ID>")
    meetingUIClient?.join(meetingLocator: groupLocator, joinCallOptions: groupJoinOptions, completionHandler: { (meetingUIClientCall: MeetingUIClientCall?, error: Error?) in
        if (error != nil) {
            print("Join call failed: \(error!)")
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
### Mute and unmute

Invoke the `mute` method to mute the microphone for an active call if one exists.
Microphone status changes in notified in the `onIsMutedChanged` method of `MeetingUIClientCallDelegate`

```swift
// Mute the microphone for an active call.
public func mute(completionHandler: @escaping (Error?) -> Void)

    meetingUIClientCall?.mute { [weak self] (error) in
        if error != nil {
            print("Mute call failed: \(error!)")
        }
}
```

Invoke the `unmute` method to unmute the microphone for an active call if one exists.

```swift
// Unmute the microphone for an active call.
public func unmute(completionHandler: @escaping (Error?) -> Void)

meetingUIClientCall?.unmute { [weak self] (error) in
    if error != nil {
        print("Mute call failed: \(error!)")
    }
}
```

### Other operations available in from the  `MeetingUIClientCall` class.

```swift
// Start the video for an active call.
public func startVideo(completionHandler: @escaping (Error?) -> Void)

// Stop the video for an active call.
public func startVideo(completionHandler: @escaping (Error?) -> Void)

// Set the preferred audio route in the call for self user.
public func setAudio(route: MeetingUIClientAudioRoute, completionHandler: @escaping (Error?) -> Void)

// Raise the hand of current user for an active call.
public func raiseHand(completionHandler: @escaping (Error?) -> Void)

// Lower the hand of user provided in the identifier for an active call.
// public func lowerHand(identifier: CommunicationIdentifier, completionHandler: @escaping (Error?) -> Void)

// Show the call roster for an active call.
public func showCallRoster(completionHandler: @escaping (Error?) -> Void)

// Change the layout in the call for self user.
public func getSupportedLayoutModes() -> [MeetingUIClientLayoutMode]
public func changeLayout(mode: MeetingUIClientLayoutMode, completionHandler: @escaping (Error?) -> Void)

// Hangs up the call or leaves the meeting.
public func hangUp(completionHandler: @escaping (Error?) -> Void)

// Set the user role for an active call.
public func setRoleFor(identifier: CommunicationIdentifier, userRole: MeetingUIClientUserRole, completionHandler: @escaping (Error?) -> Void)
```
