---
author: probableprime
ms.service: azure-communication-services
ms.topic: include
ms.date: 10/16/2022
ms.author: rifox
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-windows.md)]

### Request access to the microphone

The app will require access to the camera to run properly. In UWP apps, the camera capability should be declared in the app manifest file. 
he following steps exemplify how to achieve that.

1. In the `Solution Explorer` panel, double click on the file with `.appxmanifest` extension.
2. Click on the `Capabilities` tab.
3. Select the `Camera` check box from the capabilities list.

### Create UI buttons to place and hang up the call

This simple sample app will contain two buttons. One for placing the call and another to hang up a placed call.
The following steps exemplify how to add these buttons to the app.

1. In the `Solution Explorer` panel, double click on the file named `MainPage.xaml` for UWP, or `MainWindows.xaml` for WinUI 3.
2. In the central panel, look for the XAML code under the UI preview.
3. Modify the XAML code by the following excerpt:
```xml
<TextBox x:Name="CalleeTextBox" Text="Who would you like to call?" TextWrapping="Wrap" VerticalAlignment="Center" Grid.Row="0" Height="40" Margin="10,10,10,10" />
<StackPanel Orientation="Horizontal">
    <Button x:Name="CallButton" Content="Start Call" Click="CallButton_Click" VerticalAlignment="Center" Margin="10,0,0,0" Height="40" Width="200"/>
    <Button x:Name="HangupButton" Content="Hang Up" Click="HangupButton_Click" VerticalAlignment="Center" Margin="10,0,0,0" Height="40" Width="200"/>
</StackPanel>
```

### Setting up the app with Calling SDK APIs

The Calling SDK APIs are in two different namespaces.
The following steps inform the C# compiler about these namespaces allowing Visual Studio's Intellisense to assist with code development.

1. In the `Solution Explorer` panel, click on the arrow on the left side of the file named `MainPage.xaml` for UWP, or `MainWindows.xaml` for WinUI 3.
2. Double click on file named `MainPage.xaml.cs` or `MainWindows.xaml.cs`.
3. Add the following commands at the bottom of the current `using` statements.

```csharp
using Azure.Communication;
using Azure.Communication.Calling;
```

Please keep `MainPage.xaml.cs` or `MainWindows.xaml.cs` open. The next steps will add more code to it.

## Allow app interactions

The UI buttons previously added need to operate on top of a placed `Call`. It means that a `Call` data member should be added to the `MainPage` or `MainWindow` class.
Additionally, to allow the asynchronous operation creating `CallAgent` to succeed, a `CallAgent` data member should also be added to the same class.

Please add the following data members to the `MainPage` or `MainWindow` class:
```csharp
CallAgent callAgent;
Call call;
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
| CallClient | The CallClient is the main entry point to the Calling client library. |
| CallAgent | The CallAgent is used to start and join calls. |
| Call | The Call is used to manage placed or joined calls. |
| CommunicationTokenCredential | The CommunicationTokenCredential is used as the token credential to instantiate the CallAgent.|
| CallAgentOptions | The CallAgentOptions contains information to identify the caller. |
| HangupOptions | The HangupOptions informs if a call should be terminated to all its participants. |

## Register video handler

A UI component, like XAML's MediaElement or MediaPlayerElement, will require the app registering a configuration for rendering local and remote video feeds.
Please add the following content between the `Package` tags of the `Package.appxmanifest`:

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

To create a `CallAgent` instance from `CallClient` you must use `CallClient.CreateCallAgent` method that asynchronously returns a `CallAgent` object once it is initialized.

To create `CallAgent`, you must pass a `CommunicationTokenCredential` object and a `CallAgentOptions` object. Keep in mind that `CommunicationTokenCredential` throws if a malformed token is passed.

The following code should be added inside and helper function to be called in app initialization.

```csharp
var callClient = new CallClient();
this.deviceManager = await callClient.GetDeviceManager();

var tokenCredential = new CommunicationTokenCredential("<AUTHENTICATION_TOKEN>");
var callAgentOptions = new CallAgentOptions()
{
    DisplayName = "<DISPLAY_NAME>"
};

this.callAgent = await callClient.CreateCallAgent(tokenCredential, callAgentOptions);
this.callAgent.OnCallsUpdated += Agent_OnCallsUpdatedAsync;
this.callAgent.OnIncomingCall += Agent_OnIncomingCallAsync;
```

`<AUTHENTICATION_TOKEN>` must be replaced by a valid credential token for your resource. Refer to the [user access token](../../../../quickstarts/access-tokens.md) documentation if a credential token has to be sourced.

## Place a 1:1 call with video camera

The objects needed for creating a `CallAgent` are now ready. It is time to asynchronously create `CallAgent` and place a video call.

The following code should be added after handling the exception from the previous step.

```csharp
var startCallOptions = new StartCallOptions();

if ((LocalVideo.Source == null) && (this.deviceManager.Cameras?.Count > 0))
{
    var videoDeviceInfo = this.deviceManager.Cameras?.FirstOrDefault();
    if (videoDeviceInfo != null)
    {
        // <Initialize local camera preview>
        startCallOptions.VideoOptions = new VideoOptions(new[] { localVideoStream });
    }
}

var callees = new ICommunicationIdentifier[1] { new CommunicationUserIdentifier(CalleeTextBox.Text.Trim()) };

this.call = await this.callAgent.StartCallAsync(callees, startCallOptions);
this.call.OnRemoteParticipantsUpdated += Call_OnRemoteParticipantsUpdatedAsync;
this.call.OnStateChanged += Call_OnStateChangedAsync;
```

## Local camera preview

We can optionally set up local camera preview. The video can be rendered through UWP `MediaElement`:

```xml
<Grid Grid.Row="1">
    <Grid.RowDefinitions>
        <RowDefinition/>
    </Grid.RowDefinitions>
    <Grid.ColumnDefinitions>
        <ColumnDefinition Width="*"/>
        <ColumnDefinition Width="*"/>
    </Grid.ColumnDefinitions>
    <MediaElement x:Name="LocalVideo" HorizontalAlignment="Center" Stretch="UniformToFill" Grid.Column="0" VerticalAlignment="Center"/>
    <MediaElement x:Name="RemoteVideo" HorizontalAlignment="Center" Stretch="UniformToFill" Grid.Column="1" VerticalAlignment="Center"/>
</Grid>
```
To initialize the local preview `MedialElement`:
```csharp
var localVideoStream = new LocalVideoStream(videoDeviceInfo);

var localUri = await localVideoStream.MediaUriAsync();

await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () =>
{
    LocalVideo.Source = localUri;
    LocalVideo.Play();
});
```

Or, by `MediaPlayerElement` in WinUI 3:
```xml
<Grid Grid.Row="1">
    <Grid.RowDefinitions>
        <RowDefinition/>
    </Grid.RowDefinitions>
    <Grid.ColumnDefinitions>
        <ColumnDefinition Width="*"/>
        <ColumnDefinition Width="*"/>
    </Grid.ColumnDefinitions>
    <MediaPlayerElement x:Name="LocalVideo" HorizontalAlignment="Center" Stretch="UniformToFill" Grid.Column="0" VerticalAlignment="Center"/>
    <MediaPlayerElement x:Name="RemoteVideo" HorizontalAlignment="Center" Stretch="UniformToFill" Grid.Column="1" VerticalAlignment="Center"/>
</Grid>
```
To initialize the local preview `MediaPlayerElement`:
```csharp
var videoDeviceInfo = this.deviceManager.Cameras?.FirstOrDefault();
if (videoDeviceInfo != null)
{
    var localVideoStream = new LocalVideoStream(videoDeviceInfo);

    var localUri = await localVideoStream.MediaUriAsync();

    this.DispatcherQueue.TryEnqueue(() => {
        LocalVideo.Source = MediaSource.CreateFromUri(localUri);
        LocalVideo.MediaPlayer.Play();
    });
}
```

## Render remote camera stream

Set up even handler in response to `OnCallsUpdated` event:
```csharp
private async void Agent_OnCallsUpdatedAsync(object sender, CallsUpdatedEventArgs args)
{
    foreach (var call in args.AddedCalls)
    {
        foreach (var remoteParticipant in call.RemoteParticipants)
        {
            var remoteParticipantMRI = remoteParticipant.Identifier.ToString();
            this.remoteParticipantDictionary.TryAdd(remoteParticipantMRI, remoteParticipant);
            await AddVideoStreamsAsync(remoteParticipant.VideoStreams);
            remoteParticipant.OnVideoStreamsUpdated += Call_OnVideoStreamsUpdatedAsync;
        }
    }
}

```
Start rendering remote video stream on `MediaElement` for UWP app:
```csharp
private async Task AddVideoStreamsAsync(IReadOnlyList<RemoteVideoStream> remoteVideoStreams)
{
    foreach (var remoteVideoStream in remoteVideoStreams)
    {
        var remoteUri = await remoteVideoStream.Start();

        await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () =>
        {
            RemoteVideo.Source = remoteUri;
            RemoteVideo.Play();
        });
    }
}
```
Or, render remote video stream on `MediaPlayerElement` for Win32 3 app:
```csharp
private async Task AddVideoStreamsAsync(IReadOnlyList<RemoteVideoStream> remoteVideoStreams)
{
    foreach (var remoteVideoStream in remoteVideoStreams)
    {
        var remoteUri = await remoteVideoStream.Start();

        this.DispatcherQueue.TryEnqueue(() => {
            RemoteVideo.Source = MediaSource.CreateFromUri(remoteUri);
            RemoteVideo.MediaPlayer.Play();
        });
    }
}
```

## End a call

Once a call is placed, the `HangupAsync` method of the `Call` object should be used to hang up the call.

An instance of `HangupOptions` should also be used to inform if the call must be terminated to all its participants.

The following code should be added inside `HangupButton_Click`.

```csharp
this.call.OnStateChanged -= Call_OnStateChangedAsync;
await this.call.HangUpAsync(new HangUpOptions());
```

## Run the code

Make sure Visual Studio will build the app for `x64`, `x86` or `ARM64`, then hit `F5` to start running the app. After that, click on the `Call` button to place a call to the callee defined.

Keep in mind that the first time the app runs, the system will prompt user for granting access to the microphone.
