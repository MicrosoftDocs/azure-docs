[!INCLUDE [Public Preview](../../../../includes/public-preview-include-document.md)]

In this quickstart, you'll learn how to start a 1:1 video call using the Azure Communication Services Calling SDK for Windows.

## UWP sample code

### Prerequisites

To complete this tutorial, you’ll need the following prerequisites:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- Install [Visual Studio 2019](https://visualstudio.microsoft.com/downloads/) with Universal Windows Platform development workload. 
- A deployed Communication Services resource. [Create a Communication Services resource](../../../create-communication-resource.md). You'll need to **record your connection string** for this quickstart.
- A [User Access Token](../../../access-tokens.md) for your Azure Communication Service. You can also use the Azure CLI and run the command below with your connection string to create a user and an access token.

  ```azurecli-interactive
  az communication identity token issue --scope voip --connection-string "yourConnectionString"
  ```

  For details, see [Use Azure CLI to Create and Manage Access Tokens](../../../access-tokens.md?pivots=platform-azcli).

### Setting up

#### Creating the project

In Visual Studio, create a new project with the **Blank App (Universal Windows)** template to set up a single-page Universal Windows Platform (UWP) app.

:::image type="content" source="../../media/windows/create-a-new-project.png" alt-text="Screenshot showing the New UWP Project window within Visual Studio.":::

#### Install the package

Right click your project and go to `Manage Nuget Packages` to install `Azure.Communication.Calling` [1.0.0-beta.33](https://www.nuget.org/packages/Azure.Communication.Calling/1.0.0-beta.33) or above. Make sure Include Preleased is checked.

#### Request access

Go to `Package.appxmanifest` and click `Capabilities`.
Check `Internet (Client & Server)` to gain inbound and outbound access to the Internet. 
Check `Microphone` to access the audio feed of the microphone. 
Check `WebCam` to access the camera of the device. 

Add the following code to your `Package.appxmanifest` by right-clicking and choosing View Code. 
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

#### Set up the app framework

We need to configure a basic layout to attach our logic. In order to place an outbound call we need a `TextBox` to provide the User ID of the callee. We also need a `Start Call` button and a `Hang Up` button. 
We also need to preview the local video and render the remote video of the other participant. So we need two elements to display the video streams.

Open the `MainPage.xaml` of your project and replace the content with following implementation. 

```C#
<Page
    x:Class="CallingQuickstart.MainPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:local="using:CallingQuickstart"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d"
    Background="{ThemeResource ApplicationPageBackgroundThemeBrush}" Width="800" Height="600">
    <Grid>
        <Grid.RowDefinitions>
            <RowDefinition Height="60*"/>
            <RowDefinition Height="200*"/>
            <RowDefinition Height="60*"/>
        </Grid.RowDefinitions>
        <TextBox x:Name="CalleeTextBox" Text="Who would you like to call?" TextWrapping="Wrap" VerticalAlignment="Center" Grid.Row="0" Height="40" Margin="10,10,10,10" />
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
        <StackPanel Grid.Row="2" Orientation="Horizontal">
            <Button x:Name="CallButton" Content="Start Call" Click="CallButton_Click" VerticalAlignment="Center" Margin="10,0,0,0" Height="40" Width="200"/>
            <Button x:Name="HangupButton" Content="Hang Up" Click="HangupButton_Click" VerticalAlignment="Center" Margin="10,0,0,0" Height="40" Width="200"/>
            <TextBlock x:Name="State" Text="Status" TextWrapping="Wrap" VerticalAlignment="Center" Margin="40,0,0,0" Height="40" Width="200"/>
        </StackPanel>
    </Grid>
</Page>
```

Open to `App.xaml.cs` (right click and choose View Code) and add this line to the top:
```C#
using CallingQuickstart;
```

Open the `MainPage.xaml.cs` (right click and choose View Code) and replace the content with following implementation: 
```C#
using Azure.Communication.Calling;
using Azure.WinRT.Communication;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Windows.Foundation;
using Windows.UI.ViewManagement;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;

namespace CallingQuickstart
{
    public sealed partial class MainPage : Page
    {
        CallAgent callAgent;
        Call call;
        DeviceManager deviceManager;
        Dictionary<string, RemoteParticipant> remoteParticipantDictionary = new Dictionary<string, RemoteParticipant>();

        public MainPage()
        {
            this.InitializeComponent();
            Task.Run(() => this.InitCallAgentAndDeviceManagerAsync()).Wait();
        }

        private async Task InitCallAgentAndDeviceManagerAsync()
        {
            // Initialize call agent and Device Manager
        }

        private async void Agent_OnIncomingCallAsync(object sender, IncomingCall incomingCall)
        {
            // Accept an incoming call
        }

        private async void CallButton_Click(object sender, RoutedEventArgs e)
        {
            // Start a call with video
        }

        private async void HangupButton_Click(object sender, RoutedEventArgs e)
        {
            // End the current call
        }

        private async void Call_OnStateChangedAsync(object sender, PropertyChangedEventArgs args)
        {
            var state = (sender as Call)?.State;
            await this.Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () => {
                State.Text = state.ToString();
            });
        }
    }
}
```

### Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Calling SDK:

| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| CallClient | The CallClient is the main entry point to the Calling SDK.|
| CallAgent | The CallAgent is used to start and manage calls. |
| CommunicationTokenCredential | The CommunicationTokenCredential is used as the token credential to instantiate the CallAgent.| 
| CommunicationUserIdentifier | The CommunicationUserIdentifier is used to represent the identity of the user which can be one of the following: CommunicationUserIdentifier/PhoneNumberIdentifier/CallingApplication. |

### Authenticate the client

To initialize a `CallAgent` you will need a User Access Token. Generally this token will be generated from a service with authentication specific to the application. For more information on user access tokens check the [User Access Tokens](../../../access-tokens.md) guide. 

For the quickstart, replace `<AUTHENTICATION_TOKEN>` with a user access token generated for your Azure Communication Service resource.

Once you have a token initialize a `CallAgent` instance with it which will enable us to make and receive calls. In order to access the cameras on the device we also need to get Device Manager instance. 

Add the following code to the `InitCallAgentAndDeviceManagerAsync` function. 
```C#
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

### Start a call with video

Add the implementation to the `CallButton_Click` to start a call with video. We need to enumerate the cameras with device manager instance and construct `LocalVideoStream`. We need to set the `VideoOptions` with `LocalVideoStream` and pass it with `startCallOptions` to set initial options for the call. By attaching `LocalVideoStream` to a `MediaElement` we can see the preview of the local video. 
```C#
var startCallOptions = new StartCallOptions();

if ((LocalVideo.Source == null) && (this.deviceManager.Cameras?.Count > 0))
{
    var videoDeviceInfo = this.deviceManager.Cameras?.FirstOrDefault();
    if (videoDeviceInfo != null)
    {
        var localVideoStream = new LocalVideoStream(videoDeviceInfo);

        var localUri = await localVideoStream.MediaUriAsync();

        await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () =>
        {
            LocalVideo.Source = localUri;
            LocalVideo.Play();
        });

        startCallOptions.VideoOptions = new VideoOptions(new[] { localVideoStream });
    }
}

var callees = new ICommunicationIdentifier[1] { new CommunicationUserIdentifier(CalleeTextBox.Text.Trim()) };

this.call = await this.callAgent.StartCallAsync(callees, startCallOptions);
this.call.OnRemoteParticipantsUpdated += Call_OnRemoteParticipantsUpdatedAsync;
this.call.OnStateChanged += Call_OnStateChangedAsync;
```

### Accept an incoming call

Add the implementation to the `Agent_OnIncomingCallAsync` to answer an incoming call with video, pass the `LocalVideoStream` to `acceptCallOptions`. 

```C#
var acceptCallOptions = new AcceptCallOptions();

if (this.deviceManager.Cameras?.Count > 0)
{
    var videoDeviceInfo = this.deviceManager.Cameras?.FirstOrDefault();
    if (videoDeviceInfo != null)
    {
        var localVideoStream = new LocalVideoStream(videoDeviceInfo);

        var localUri = await localVideoStream.MediaUriAsync();

        await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () =>
        {
            LocalVideo.Source = localUri;
            LocalVideo.Play();
        });

        acceptCallOptions.VideoOptions = new VideoOptions(new[] { localVideoStream });
    }
}

call = await incomingCall.AcceptAsync(acceptCallOptions);
```

### Remote participant and remote video streams

All remote participants are available through the `RemoteParticipants` collection on a call instance. Once the call is connected we can access the remote participants of the call and handle the remote video streams. 

```C#

private async void Call_OnVideoStreamsUpdatedAsync(object sender, RemoteVideoStreamsEventArgs args)
{
    foreach (var remoteVideoStream in args.AddedRemoteVideoStreams)
    {
        await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, async () =>
        {
            RemoteVideo.Source = await remoteVideoStream.Start();
        });
    }

    foreach (var remoteVideoStream in args.RemovedRemoteVideoStreams)
    {
        remoteVideoStream.Stop();
    }
}

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

private async void Call_OnRemoteParticipantsUpdatedAsync(object sender, ParticipantsUpdatedEventArgs args)
{
    foreach (var remoteParticipant in args.AddedParticipants)
    {
        String remoteParticipantMRI = remoteParticipant.Identifier.ToString();
        this.remoteParticipantDictionary.TryAdd(remoteParticipantMRI, remoteParticipant);
        await AddVideoStreamsAsync(remoteParticipant.VideoStreams);
        remoteParticipant.OnVideoStreamsUpdated += Call_OnVideoStreamsUpdatedAsync;
    }

    foreach (var remoteParticipant in args.RemovedParticipants)
    {
        String remoteParticipantMRI = remoteParticipant.Identifier.ToString();
        this.remoteParticipantDictionary.Remove(remoteParticipantMRI);
    }
}
```

#### Render remote videos

For each remote video stream, attach it to the `MediaElement`. 

```C#
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

### Call state update
We need to clean the video renderers once the call is disconnected and handle the case when the remote participants initially join the call.

```C#
private async void Call_OnStateChanged(object sender, PropertyChangedEventArgs args)
{
    switch (((Call)sender).State)
    {
        case CallState.Disconnected:
            await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () =>
            {
                LocalVideo.Source = null;
                RemoteVideo.Source = null;
            });
            break;

        case CallState.Connected:
            foreach (var remoteParticipant in call.RemoteParticipants)
            {
                String remoteParticipantMRI = remoteParticipant.Identifier.ToString();
                remoteParticipantDictionary.TryAdd(remoteParticipantMRI, remoteParticipant);
                await AddVideoStreams(remoteParticipant.VideoStreams);
                remoteParticipant.OnVideoStreamsUpdated += Call_OnVideoStreamsUpdated;
            }
            break;

        default:
            break;
    }
}
```

### End a call

End the current call when the `Hang Up` button is clicked. Add the implementation to the HangupButton_Click to end a call with the callAgent we created, and tear down the participant update and call state event handlers.

```C#
this.call.OnRemoteParticipantsUpdated -= Call_OnRemoteParticipantsUpdatedAsync;
this.call.OnStateChanged -= Call_OnStateChangedAsync;
await this.call.HangUpAsync(new HangUpOptions());
```

### Run the code

You can build and run the code on Visual Studio. Please note that for solution platforms we support `ARM64`, `x64` and `x86`. 

You can make an outbound video call by providing a user ID in the text field and clicking the `Start Call` button. 

Note: Calling `8:echo123` will stop the video stream because echo bot does not support video streaming. 

For more information on user IDs (identity) check the [User Access Tokens](../../../access-tokens.md) guide. 


## WinUI 3 sample code

### Prerequisites

To complete this tutorial, you’ll need the following prerequisites:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- Install [Visual Studio 2022](https://visualstudio.microsoft.com/downloads/) and [Windows App SDK version 1.2 preview 2](https://learn.microsoft.com/windows/apps/windows-app-sdk/preview-channel#version-12-preview-2-120-preview2). 
- Basic understanding of how to create a WinUI 3 app. [Create your first WinUI 3 (Windows App SDK) project](https://learn.microsoft.com/windows/apps/winui/winui3/create-your-first-winui3-app?pivots=winui3-packaged-csharp) is a good resource to start with.
- A deployed Communication Services resource. [Create a Communication Services resource](../../../create-communication-resource.md). You'll need to **record your connection string** for this quickstart.
- A [User Access Token](../../../access-tokens.md) for your Azure Communication Service. You can also use the Azure CLI and run the command below with your connection string to create a user and an access token.

  ```azurecli-interactive
  az communication identity token issue --scope voip --connection-string "yourConnectionString"
  ```

  For details, see [Use Azure CLI to Create and Manage Access Tokens](../../../access-tokens.md?pivots=platform-azcli).

### Setting up

#### Creating the project

In Visual Studio, create a new project with the **Blank App, Packaged (WinUI 3 in Desktop)** template to set up a single-page WinUI 3 app.

:::image type="content" source="../../media/windows/create-a-new-winui-project.png" alt-text="Screenshot showing the New WinUI Project window within Visual Studio.":::

#### Install the package

Right click your project and go to `Manage Nuget Packages` to install `Azure.Communication.Calling` [1.0.0-beta.33](https://www.nuget.org/packages/Azure.Communication.Calling/1.0.0-beta.33) or above. Make sure Include Preleased is checked.

#### Request access

:::image type="content" source="../../media/windows/request-access.png" alt-text="Screenshot showing requesting access to Internet and Microphone in Visual Studio.":::

Add the following code to your `app.manifest`:
```xml
<file name="RtmMvrMf.dll">
    <activatableClass name="VideoN.VideoSchemeHandler" threadingModel="both" xmlns="urn:schemas-microsoft-com:winrt.v1" />
</file>
```

#### Set up the app framework

We need to configure a basic layout to attach our logic. In order to place an outbound call we need a `TextBox` to provide the User ID of the callee. We also need a `Start Call` button and a `Hang Up` button. 
We also need to preview the local video and render the remote video of the other participant. So we need two elements to display the video streams.

Open the `MainWindow.xaml` of your project and replace the content with following implementation. 

```C#
<Window
    x:Class="CallingQuickstart.MainWindow"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:local="using:CallingQuickstart"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">
    <Grid>
        <Grid.RowDefinitions>
            <RowDefinition Height="60*"/>
            <RowDefinition Height="200*"/>
            <RowDefinition Height="60*"/>
        </Grid.RowDefinitions>
        <TextBox x:Name="CalleeTextBox" Text="Who would you like to call?" TextWrapping="Wrap" VerticalAlignment="Center" Height="40" Margin="10,10,10,10" />
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
        <StackPanel Grid.Row="2" Orientation="Horizontal">
            <Button x:Name="CallButton" Content="Start Call" Click="CallButton_Click" VerticalAlignment="Center" Margin="10,0,0,0" Height="40" Width="200"/>
            <Button x:Name="HangupButton" Content="Hang Up" Click="HangupButton_Click" VerticalAlignment="Center" Margin="10,0,0,0" Height="40" Width="200"/>
            <TextBlock x:Name="State" Text="Status" TextWrapping="Wrap" VerticalAlignment="Center" Margin="40,0,0,0" Height="40" Width="200"/>
        </StackPanel>
    </Grid>
</Window>
```

Open to `App.xaml.cs` (right click and choose View Code) and add this line to the top:
```C#
using CallingQuickstart;
```

Open the `MainWindow.xaml.cs` (right click and choose View Code) and replace the content with following implementation: 
```C#
using Azure.Communication.Calling;
using Azure.WinRT.Communication;
using Microsoft.UI.Xaml;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Windows.Media.Core;

namespace CallingQuickstart
{
    public sealed partial class MainWindow : Window
    {
        CallAgent callAgent;
        Call call;
        DeviceManager deviceManager;
        Dictionary<string, RemoteParticipant> remoteParticipantDictionary = new Dictionary<string, RemoteParticipant>();

        public MainWindow()
        {
            this.InitializeComponent();
            Task.Run(() => this.InitCallAgentAndDeviceManagerAsync()).Wait();
        }

        private async Task InitCallAgentAndDeviceManagerAsync()
        {
            // Initialize call agent and Device Manager
        }

        private async void Agent_OnIncomingCallAsync(object sender, IncomingCall incomingCall)
        {
            // Accept an incoming call
        }

        private async void CallButton_Click(object sender, RoutedEventArgs e)
        {
            // Start a call with video
        }

        private async void HangupButton_Click(object sender, RoutedEventArgs e)
        {
            // End the current call
        }

        private async void Call_OnStateChangedAsync(object sender, PropertyChangedEventArgs args)
        {
            var state = (sender as Call)?.State;
            this.DispatcherQueue.TryEnqueue(() => {
                State.Text = state.ToString();
            });
        }
    }
}

```

### Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Calling SDK:

| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| CallClient | The CallClient is the main entry point to the Calling SDK.|
| CallAgent | The CallAgent is used to start and manage calls. |
| CommunicationTokenCredential | The CommunicationTokenCredential is used as the token credential to instantiate the CallAgent.| 
| CommunicationUserIdentifier | The CommunicationUserIdentifier is used to represent the identity of the user which can be one of the following: CommunicationUserIdentifier/PhoneNumberIdentifier/CallingApplication. |

### Authenticate the client

To initialize a `CallAgent` you will need a User Access Token. Generally this token will be generated from a service with authentication specific to the application. For more information on user access tokens check the [User Access Tokens](../../../access-tokens.md) guide. 

For the quickstart, replace `<AUTHENTICATION_TOKEN>` with a user access token generated for your Azure Communication Service resource.

Once you have a token initialize a `CallAgent` instance with it which will enable us to make and receive calls. In order to access the cameras on the device we also need to get Device Manager instance. 

Add the following code to the `InitCallAgentAndDeviceManagerAsync` function. 
```C#
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

### Start a call with video

Add the implementation to the `CallButton_Click` to start a call with video. We need to enumerate the cameras with device manager instance and construct `LocalVideoStream`. We need to set the `VideoOptions` with `LocalVideoStream` and pass it with `startCallOptions` to set initial options for the call. By attaching `LocalVideoStream` to a `MediaPlayerElement` we can see the preview of the local video. 
```C#
var startCallOptions = new StartCallOptions();

if (this.deviceManager.Cameras?.Count > 0)
{
    var videoDeviceInfo = this.deviceManager.Cameras?.FirstOrDefault();
    if (videoDeviceInfo != null)
    {
        var localVideoStream = new LocalVideoStream(videoDeviceInfo);

        var localUri = await localVideoStream.MediaUriAsync();

        this.DispatcherQueue.TryEnqueue(() => {
            LocalVideo.Source = MediaSource.CreateFromUri(localUri);
            LocalVideo.MediaPlayer.Play();
        });

        startCallOptions.VideoOptions = new VideoOptions(new[] { localVideoStream });
    }
}

var callees = new ICommunicationIdentifier[1]
{
    new CommunicationUserIdentifier(CalleeTextBox.Text.Trim())
};

this.call = await this.callAgent.StartCallAsync(callees, startCallOptions);
this.call.OnRemoteParticipantsUpdated += Call_OnRemoteParticipantsUpdatedAsync;
this.call.OnStateChanged += Call_OnStateChangedAsync;
```

### Accept an incoming call

Add the implementation to the `Agent_OnIncomingCallAsync` to answer an incoming call with video, pass the `LocalVideoStream` to `acceptCallOptions`. 

```C#
var acceptCallOptions = new AcceptCallOptions();

if (this.deviceManager.Cameras?.Count > 0)
{
    var videoDeviceInfo = this.deviceManager.Cameras?.FirstOrDefault();
    if (videoDeviceInfo != null)
    {
        var localVideoStream = new LocalVideoStream(videoDeviceInfo);

        var localUri = await localVideoStream.MediaUriAsync();

        this.DispatcherQueue.TryEnqueue(() => {
            LocalVideo.Source = MediaSource.CreateFromUri(localUri);
            LocalVideo.MediaPlayer.Play();
        });

        acceptCallOptions.VideoOptions = new VideoOptions(new[] { localVideoStream });
    }
}

call = await incomingCall.AcceptAsync(acceptCallOptions);
```

### Remote participant and remote video streams

All remote participants are available through the `RemoteParticipants` collection on a call instance. Once the call is connected we can access the remote participants of the call and handle the remote video streams. 

```C#
private async void Call_OnVideoStreamsUpdatedAsync(object sender, RemoteVideoStreamsEventArgs args)
{
    foreach (var remoteVideoStream in args.AddedRemoteVideoStreams)
    {
        this.DispatcherQueue.TryEnqueue(async () => {
            RemoteVideo.Source = MediaSource.CreateFromUri(await remoteVideoStream.Start());
            RemoteVideo.MediaPlayer.Play();
        });
    }

    foreach (var remoteVideoStream in args.RemovedRemoteVideoStreams)
    {
        remoteVideoStream.Stop();
    }
}

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

private async void Call_OnRemoteParticipantsUpdatedAsync(object sender, ParticipantsUpdatedEventArgs args)
{
    foreach (var remoteParticipant in args.AddedParticipants)
    {
        String remoteParticipantMRI = remoteParticipant.Identifier.ToString();
        this.remoteParticipantDictionary.TryAdd(remoteParticipantMRI, remoteParticipant);
        await AddVideoStreamsAsync(remoteParticipant.VideoStreams);
        remoteParticipant.OnVideoStreamsUpdated += Call_OnVideoStreamsUpdatedAsync;
    }

    foreach (var remoteParticipant in args.RemovedParticipants)
    {
        String remoteParticipantMRI = remoteParticipant.Identifier.ToString();
        this.remoteParticipantDictionary.Remove(remoteParticipantMRI);
    }
}
```

#### Render remote videos

For each remote video stream, attach it to the `MediaPlayerElement`. 

```C#
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

### Call state update
We need to clean the video renderers once the call is disconnected and handle the case when the remote participants initially join the call.

```C#
private async void Call_OnStateChanged(object sender, PropertyChangedEventArgs args)
{
    switch (((Call)sender).State)
    {
        case CallState.Disconnected:
            this.DispatcherQueue.TryEnqueue(() => { =>
            {
                LocalVideo.Source = null;
                RemoteVideo.Source = null;
            });
            break;

        case CallState.Connected:
            foreach (var remoteParticipant in call.RemoteParticipants)
            {
                String remoteParticipantMRI = remoteParticipant.Identifier.ToString();
                remoteParticipantDictionary.TryAdd(remoteParticipantMRI, remoteParticipant);
                await AddVideoStreams(remoteParticipant.VideoStreams);
                remoteParticipant.OnVideoStreamsUpdated += Call_OnVideoStreamsUpdated;
            }
            break;

        default:
            break;
    }
}
```

### End a call

End the current call when the `Hang Up` button is clicked. Add the implementation to the HangupButton_Click to end a call with the callAgent we created, and tear down the participant update and call state event handlers.

```C#
this.call.OnRemoteParticipantsUpdated -= Call_OnRemoteParticipantsUpdatedAsync;
this.call.OnStateChanged -= Call_OnStateChangedAsync;
await this.call.HangUpAsync(new HangUpOptions());
```

### Run the code

You can build and run the code on Visual Studio. Please note that for solution platforms we support `ARM64`, `x64` and `x86`. 

You can make an outbound video call by providing a user ID in the text field and clicking the `Start Call` button. 

Note: Calling `8:echo123` will stop the video stream because echo bot does not support video streaming. 

For more information on user IDs (identity) check the [User Access Tokens](../../../access-tokens.md) guide. 
