---
author: probableprime
ms.service: azure-communication-services
ms.topic: include
ms.date: 10/16/2022
ms.author: rifox
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-windows.md)]

### Request access to the microphone

The app requires access to the camera to run properly. In UWP apps, the camera capability should be declared in the app manifest file.

The following steps exemplify how to achieve that.

1. In the `Solution Explorer` panel, double click on the file with `.appxmanifest` extension.
2. Click on the `Capabilities` tab.
3. Select the `Camera` check box from the capabilities list.

### Create UI buttons to place and hang up the call

This simple sample app contains two buttons. One for placing the call and another to hang up a placed call.
The following steps exemplify how to add these buttons to the app.

1. In the `Solution Explorer` panel, double click on the file named `MainPage.xaml` for UWP, or `MainWindows.xaml` for WinUI 3.
2. In the central panel, look for the XAML code under the UI preview.
3. Modify the XAML code by the following excerpt:
```xml
<TextBox x:Name="CalleeTextBox" PlaceholderText="Who would you like to call?" />
<StackPanel>
    <Button x:Name="CallButton" Content="Start/Join call" Click="CallButton_Click" />
    <Button x:Name="HangupButton" Content="Hang up" Click="HangupButton_Click" />
</StackPanel>
```

### Setting up the app with Calling SDK APIs

The Calling SDK APIs are in two different namespaces.
The following steps inform the C# compiler about these namespaces allowing Visual Studio's Intellisense to assist with code development.

1. In the `Solution Explorer` panel, click on the arrow on the left side of the file named `MainPage.xaml` for UWP, or `MainWindows.xaml` for WinUI 3.
2. Double click on file named `MainPage.xaml.cs` or `MainWindows.xaml.cs`.
3. Add the following commands at the bottom of the current `using` statements.

```csharp
using Azure.Communication.Calling.WindowsClient;
```

Keep `MainPage.xaml.cs` or `MainWindows.xaml.cs` open. The next steps will add more code to it.

## Allow app interactions

The UI buttons previously added need to operate on top of a placed `CommunicationCall`. It means that a `CommunicationCall` data member should be added to the `MainPage` or `MainWindow` class.
Additionally, to allow the asynchronous operation creating `CallAgent` to succeed, a `CallAgent` data member should also be added to the same class.

Add the following data members to the `MainPage` or `MainWindow` class:
```csharp
CallAgent callAgent;
CommunicationCall call;
```

## Create button handlers

Previously, two UI buttons were added to the XAML code. The following code adds the handlers to be executed when a user selects the button.
The following code should be added after the data members from the previous section.

```csharp
private async void CallButton_Click(object sender, RoutedEventArgs e)
{
    // Start call
}

private async void HangupButton_Click(object sender, RoutedEventArgs e)
{
    // End the current call
}
```

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Calling client library for UWP.

| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| `CallClient` | The `CallClient` is the main entry point to the Calling client library. |
| `CallAgent` | The `CallAgent` is used to start and join calls. |
| `CommunicationCall` | The `CommunicationCall` is used to manage placed or joined calls. |
| `CommunicationTokenCredential` | The `CommunicationTokenCredential` is used as the token credential to instantiate the `CallAgent`.|
| `CallAgentOptions` | The `CallAgentOptions` contains information to identify the caller. |
| `HangupOptions` | The `HangupOptions` informs if a call should be terminated to all its participants. |

## Register video schema handler

A UI component, like XAML's MediaElement or MediaPlayerElement, you need the app registering a configuration for rendering local and remote video feeds.
Add the following content between the `Package` tags of the `Package.appxmanifest`:

```xml
<Extensions>
    <Extension Category="windows.activatableClass.inProcessServer">
        <InProcessServer>
            <Path>RtmMvrUap.dll</Path>
            <ActivatableClass ActivatableClassId="VideoN.VideoSchemeHandler" ThreadingModel="both" />
        </InProcessServer>
    </Extension>
</Extensions>
```

## Initialize the CallAgent

To create a `CallAgent` instance from `CallClient`, you must use `CallClient.CreateCallAgentAsync` method that asynchronously returns a `CallAgent` object once it's initialized.

To create `CallAgent`, you must pass a `CallTokenCredential` object and a `CallAgentOptions` object. Keep in mind that `CallTokenCredential` throws if a malformed token is passed.

The following code should be added inside and helper function to be called in app initialization.

```csharp
var callClient = new CallClient();
this.deviceManager = await callClient.GetDeviceManagerAsync();

var tokenCredential = new CallTokenCredential("<AUTHENTICATION_TOKEN>");
var callAgentOptions = new CallAgentOptions()
{
    DisplayName = "<DISPLAY_NAME>"
};

this.callAgent = await callClient.CreateCallAgentAsync(tokenCredential, callAgentOptions);
this.callAgent.CallsUpdated += Agent_OnCallsUpdatedAsync;
this.callAgent.IncomingCallReceived += Agent_OnIncomingCallAsync;
```

Change the `<AUTHENTICATION_TOKEN>` with a valid credential token for your resource. Refer to the [user access token](../../../../quickstarts/identity/access-tokens.md) documentation if a credential token has to be sourced.

## Place a 1:1 call with video camera

The objects needed for creating a `CallAgent` are now ready. It's time to asynchronously create `CallAgent` and place a video call.

```csharp
private async void CallButton_Click(object sender, RoutedEventArgs e)
{
    var callString = CalleeTextBox.Text.Trim();

    if (!string.IsNullOrEmpty(callString))
    {
        if (callString.StartsWith("8:")) // 1:1 ACS call
        {
            this.call = await StartAcsCallAsync(callString);
        }
    }

    if (this.call != null)
    {
        this.call.RemoteParticipantsUpdated += OnRemoteParticipantsUpdatedAsync;
        this.call.StateChanged += OnStateChangedAsync;
    }
}

private async Task<CommunicationCall> StartAcsCallAsync(string acsCallee)
{
    var options = await GetStartCallOptionsAsynnc();
    var call = await this.callAgent.StartCallAsync( new [] { new UserCallIdentifier(acsCallee) }, options);
    return call;
}

var micStream = new LocalOutgoingAudioStream(); // Create a default local audio stream
var cameraStream = new LocalOutgoingVideoStreamde(this.viceManager.Cameras.FirstOrDefault() as VideoDeviceDetails); // Create a default video stream

private async Task<StartCallOptions> GetStartCallOptionsAsynnc()
{
    return new StartCallOptions() {
        OutgoingAudioOptions = new OutgoingAudioOptions() { IsMuted = true, Stream = micStream  },
        OutgoingVideoOptions = new OutgoingVideoOptions() { Streams = new OutgoingVideoStream[] { cameraStream } }
    };
}
```

## Local camera preview

We can optionally set up local camera preview. The video can be rendered through `MediaPlayerElement`:

```xml
<Grid>
    <MediaPlayerElement x:Name="LocalVideo" AutoPlay="True" />
    <MediaPlayerElement x:Name="RemoteVideo" AutoPlay="True" />
</Grid>
```
To initialize the local preview `MediaPlayerElement`:
```csharp
private async void CameraList_SelectionChanged(object sender, SelectionChangedEventArgs e)
{
    if (cameraStream != null)
    {
        await cameraStream?.StopPreviewAsync();
        if (this.call != null)
        {
            await this.call?.StopVideoAsync(cameraStream);
        }
    }
    var selectedCamerea = CameraList.SelectedItem as VideoDeviceDetails;
    cameraStream = new LocalOutgoingVideoStream(selectedCamerea);

    var localUri = await cameraStream.StartPreviewAsync();
    LocalVideo.Source = MediaSource.CreateFromUri(localUri);

    if (this.call != null) {
        await this.call?.StartVideoAsync(cameraStream);
    }
}
```

## Render remote camera stream

Set up even handler in response to `OnCallsUpdated` event:
```csharp
private async void OnCallsUpdatedAsync(object sender, CallsUpdatedEventArgs args)
{
    var removedParticipants = new List<RemoteParticipant>();
    var addedParticipants = new List<RemoteParticipant>();

    foreach(var call in args.RemovedCalls)
    {
        removedParticipants.AddRange(call.RemoteParticipants.ToList<RemoteParticipant>());
    }

    foreach (var call in args.AddedCalls)
    {
        addedParticipants.AddRange(call.RemoteParticipants.ToList<RemoteParticipant>());
    }

    await OnParticipantChangedAsync(removedParticipants, addedParticipants);
}

private async void OnRemoteParticipantsUpdatedAsync(object sender, ParticipantsUpdatedEventArgs args)
{
    await OnParticipantChangedAsync(
        args.RemovedParticipants.ToList<RemoteParticipant>(),
        args.AddedParticipants.ToList<RemoteParticipant>());
}

private async Task OnParticipantChangedAsync(IEnumerable<RemoteParticipant> removedParticipants, IEnumerable<RemoteParticipant> addedParticipants)
{
    foreach (var participant in removedParticipants)
    {
        foreach(var incomingVideoStream in  participant.IncomingVideoStreams)
        {
            var remoteVideoStream = incomingVideoStream as RemoteIncomingVideoStream;
            if (remoteVideoStream != null)
            {
                await remoteVideoStream.StopPreviewAsync();
            }
        }
        participant.VideoStreamStateChanged -= OnVideoStreamStateChanged;
    }

    foreach (var participant in addedParticipants)
    {
        participant.VideoStreamStateChanged += OnVideoStreamStateChanged;
    }
}

private void OnVideoStreamStateChanged(object sender, VideoStreamStateChangedEventArgs e)
{
    CallVideoStream callVideoStream = e.CallVideoStream;

    switch (callVideoStream.StreamDirection)
    {
        case StreamDirection.Outgoing:
            OnOutgoingVideoStreamStateChanged(callVideoStream as OutgoingVideoStream);
            break;
        case StreamDirection.Incoming:
            OnIncomingVideoStreamStateChanged(callVideoStream as IncomingVideoStream);
            break;
    }
}

```
Start rendering remote video stream on `MediaPlayerElement`:
```csharp
private async void OnIncomingVideoStreamStateChanged(IncomingVideoStream incomingVideoStream)
{
    switch (incomingVideoStream.State)
    {
        case VideoStreamState.Available:
            {
                switch (incomingVideoStream.Kind)
                {
                    case VideoStreamKind.RemoteIncoming:
                        var remoteVideoStream = incomingVideoStream as RemoteIncomingVideoStream;
                        var uri = await remoteVideoStream.StartPreviewAsync();

                        await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () =>
                        {
                            RemoteVideo.Source = MediaSource.CreateFromUri(uri);
                        });

                        /* Or WinUI 3
                        this.DispatcherQueue.TryEnqueue(() => {
                            RemoteVideo.Source = MediaSource.CreateFromUri(uri);
                            RemoteVideo.MediaPlayer.Play();
                        });
                        */

                        break;

                    case VideoStreamKind.RawIncoming:
                        break;
                }

                break;
            }
        case VideoStreamState.Started:
            break;
        case VideoStreamState.Stopping:
            break;
        case VideoStreamState.Stopped:
            if (incomingVideoStream.Kind == VideoStreamKind.RemoteIncoming)
            {
                var remoteVideoStream = incomingVideoStream as RemoteIncomingVideoStream;
                await remoteVideoStream.StopPreviewAsync();
            }
            break;
        case VideoStreamState.NotAvailable:
            break;
    }
}
```

## End a call

Once a call is placed, the `HangupAsync` method of the `CommunicationCall` object should be used to hang up the call.

An instance of `HangupOptions` should also be used to inform if the call must be terminated to all its participants.

The following code should be added inside `HangupButton_Click`.

```csharp
var call = this.callAgent?.Calls?.FirstOrDefault();
if (call != null)
{
    var call = this.callAgent?.Calls?.FirstOrDefault();
    if (call != null)
    {
        foreach (var localVideoStream in call.OutgoingVideoStreams)
        {
            await call.StopVideoAsync(localVideoStream);
        }

        try
        {
            if (cameraStream != null)
            {
                await cameraStream.StopPreviewAsync();
            }

            await call.HangUpAsync(new HangUpOptions() { ForEveryone = false });
        }
        catch(Exception ex) 
        { 
            var errorCode = unchecked((int)(0x0000FFFFU & ex.HResult));
            if (errorCode != 98) // Sample error code, sam_status_failed_to_hangup_for_everyone (98)
            {
                throw;
            }
        }
    }
}
```

## Run the code

Make sure Visual Studio builds the app for `x64`, `x86` or `ARM64`, then hit `F5` to start running the app. After that, click on the `CommunicationCall` button to place a call to the callee defined.

Keep in mind that the first time the app runs, the system prompts user for granting access to the microphone.
