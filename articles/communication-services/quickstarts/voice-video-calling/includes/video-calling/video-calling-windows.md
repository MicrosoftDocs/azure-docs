
In this quickstart, you learn how to start a 1:1 video call using the Azure Communication Services Calling SDK for Windows.

## [UWP](#tab/uwp)

### Prerequisites

To complete this tutorial, you need the following prerequisites:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Install [Visual Studio 2022](https://visualstudio.microsoft.com/downloads/) with Universal Windows Platform development workload.
- A deployed Communication Services resource. [Create a Communication Services resource](../../../create-communication-resource.md). You need to **record your connection string** for this quickstart.
- A [User Access Token](../../../identity/access-tokens.md) for your Azure Communication Service. You can also use the Azure CLI and run the command with your connection string to create a user and an access token.

  ```azurecli-interactive
  az communication identity token issue --scope voip --connection-string "yourConnectionString"
  ```

  For details, see [Use Azure CLI to Create and Manage Access Tokens](../../../identity/access-tokens.md?pivots=platform-azcli).

### Setting up

#### Creating the project

In Visual Studio, create a new project with the **Blank App (Universal Windows)** template to set up a single-page Universal Windows Platform (UWP) app.

:::image type="content" source="../../media/windows/create-a-new-project.png" alt-text="Screenshot showing the New UWP Project window within Visual Studio.":::

#### Install the package

Right select your project and go to `Manage Nuget Packages` to install `Azure.Communication.Calling.WindowsClient` [1.0.0](https://www.nuget.org/packages/Azure.Communication.Calling.WindowsClient/1.0.0) or superior. Make sure Include Preleased is checked.

#### Request access


Go to `Package.appxmanifest` and click `Capabilities`.
Check `Internet (Client)` and `Internet (Client & Server)` to gain inbound and outbound access to the Internet. 
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

We need to configure a basic layout to attach our logic. In order to place an outbound call, we need a `TextBox` to provide the User ID of the callee. We also need a `Start/Join Call` button and a `Hang up` button.
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
            <RowDefinition Height="16*"/>
            <RowDefinition Height="30*"/>
            <RowDefinition Height="200*"/>
            <RowDefinition Height="60*"/>
            <RowDefinition Height="16*"/>
        </Grid.RowDefinitions>
        <TextBox Grid.Row="1" x:Name="CalleeTextBox" PlaceholderText="Who would you like to call?" TextWrapping="Wrap" VerticalAlignment="Center" Height="30" Margin="10,10,10,10" />

        <Grid x:Name="AppTitleBar" Background="LightSeaGreen">
            <!-- Width of the padding columns is set in LayoutMetricsChanged handler. -->
            <!-- Using padding columns instead of Margin ensures that the background paints the area under the caption control buttons (for transparent buttons). -->
            <TextBlock x:Name="QuickstartTitle" Text="Calling Quickstart sample title bar" Style="{StaticResource CaptionTextBlockStyle}" Padding="7,7,0,0"/>
        </Grid>

        <Grid Grid.Row="2">
            <Grid.RowDefinitions>
                <RowDefinition/>
            </Grid.RowDefinitions>
            <Grid.ColumnDefinitions>
                <ColumnDefinition Width="*"/>
                <ColumnDefinition Width="*"/>
            </Grid.ColumnDefinitions>
            <MediaPlayerElement x:Name="LocalVideo" HorizontalAlignment="Center" Stretch="UniformToFill" Grid.Column="0" VerticalAlignment="Center" AutoPlay="True" />
            <MediaPlayerElement x:Name="RemoteVideo" HorizontalAlignment="Center" Stretch="UniformToFill" Grid.Column="1" VerticalAlignment="Center" AutoPlay="True" />
        </Grid>
        <StackPanel Grid.Row="3" Orientation="Vertical" Grid.RowSpan="2">
            <StackPanel Orientation="Horizontal">
                <Button x:Name="CallButton" Content="Start/Join call" Click="CallButton_Click" VerticalAlignment="Center" Margin="10,0,0,0" Height="40" Width="123"/>
                <Button x:Name="HangupButton" Content="Hang up" Click="HangupButton_Click" VerticalAlignment="Center" Margin="10,0,0,0" Height="40" Width="123"/>
            </StackPanel>
        </StackPanel>
        <TextBox Grid.Row="5" x:Name="Stats" Text="" TextWrapping="Wrap" VerticalAlignment="Center" Height="30" Margin="0,2,0,0" BorderThickness="2" IsReadOnly="True" Foreground="LightSlateGray" />
    </Grid>
</Page>

```

Open the `MainPage.xaml.cs` (right click and choose View Code) and replace the content with following implementation: 
```C#
using Azure.Communication.Calling.WindowsClient;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using Windows.ApplicationModel;
using Windows.ApplicationModel.Core;
using Windows.Media.Core;
using Windows.Networking.PushNotifications;
using Windows.UI;
using Windows.UI.ViewManagement;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

namespace CallingQuickstart
{
    public sealed partial class MainPage : Page
    {
        private const string authToken = "<AUTHENTICATION_TOKEN>";

        private CallClient callClient;
        private CallTokenRefreshOptions callTokenRefreshOptions = new CallTokenRefreshOptions(false);
        private CallAgent callAgent;
        private CommunicationCall call;

        private LocalOutgoingVideoStream cameraStream;

        #region Page initialization
        public MainPage()
        {
            this.InitializeComponent();
            // Additional UI customization code goes here
        }

        protected override async void OnNavigatedTo(NavigationEventArgs e)
        {
            base.OnNavigatedTo(e);
        }
        #endregion

        #region UI event handlers
        private async void CallButton_Click(object sender, RoutedEventArgs e)
        {
            // Start a call
        }

        private async void HangupButton_Click(object sender, RoutedEventArgs e)
        {
            // Hang up a call
        }
        #endregion

        #region API event handlers
        private async void OnIncomingCallAsync(object sender, IncomingCallReceivedEventArgs args)
        {
            // Handle incoming call event
        }

        private async void OnStateChangedAsync(object sender, PropertyChangedEventArgs args)
        {
            // Handle connected and disconnected state change of a call
        }

        private async void OnRemoteParticipantsUpdatedAsync(object sender, ParticipantsUpdatedEventArgs args)
        {
            // Handle remote participant arrival or departure events and subscribe to individual participant's VideoStreamStateChanged event
        }

        private void OnVideoStreamStateChanged(object sender, VideoStreamStateChangedEventArgs e)
        {
            // Handle incoming or outgoing video stream change events
        }

        private async void OnIncomingVideoStreamStateChangedAsync(IncomingVideoStream incomingVideoStream)
        {
            // Handle incoming IncomingVideoStreamStateChanged event and process individual VideoStreamState
        }
        #endregion
    }
}
```

### Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Calling SDK:

| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| `CallClient` | The `CallClient` is the main entry point to the Calling SDK.|
| `CallAgent` | The `CallAgent` is used to start and manage calls. |
| `CommunicationCall` | The `CommunicationCall` is used to manage an ongoing call. |
| `CallTokenCredential` | The `CallTokenCredential` is used as the token credential to instantiate the `CallAgent`.|
|` CallIdentifier` | The `CallIdentifier` is used to represent the identity of the user, which can be one of the following options: `UserCallIdentifier`, `PhoneNumberCallIdentifier` etc. |

### Authenticate the client

To initialize a `CallAgent`, you need a User Access Token. Generally this token is generated from a service with authentication specific to the application. For more information on user access tokens, check the [User Access Tokens](../../../identity/access-tokens.md) guide.

For the quickstart, replace `<AUTHENTICATION_TOKEN>` with a user access token generated for your Azure Communication Service resource.

Once you have a token, initialize a `CallAgent` instance with it, which enable us to make and receive calls. In order to access the cameras on the device, we also need to get Device Manager instance. 

Add `InitCallAgentAndDeviceManagerAsync` function, which bootstraps the SDK. This helper can be customized to meet the requirements of your application.

```C#
        private async Task InitCallAgentAndDeviceManagerAsync()
        {
            this.callClient = new CallClient(new CallClientOptions() {
                Diagnostics = new CallDiagnosticsOptions() { 
                    AppName = "CallingQuickstart",
                    AppVersion="1.0",
                    Tags = new[] { "Calling", "ACS", "Windows" }
                    }
                });

            // Set up local video stream using the first camera enumerated
            var deviceManager = await this.callClient.GetDeviceManagerAsync();
            var camera = deviceManager?.Cameras?.FirstOrDefault();

            var tokenCredential = new CallTokenCredential(authToken, callTokenRefreshOptions);

            var callAgentOptions = new CallAgentOptions()
            {
                DisplayName = $"{Environment.MachineName}/{Environment.UserName}",
            };

            this.callAgent = await this.callClient.CreateCallAgentAsync(tokenCredential, callAgentOptions);
            this.callAgent.CallsUpdated += OnCallsUpdatedAsync;
            this.callAgent.IncomingCallReceived += OnIncomingCallAsync;

            // Bind the local video stream to `MediaPlayerElement`
            var localUri = await cameraStream.StartPreviewAsync();
            await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, async () =>
            {
                LocalVideo.Source = MediaSource.CreateFromUri(localUri);
            });
        }
```

### Start a call with video

Add the implementation to the `CallButton_Click` to start a ACS call with video. We need to set the `OutgoingVideoOptions` to configure outgoing video. `OutgoingVideoOptions` accepts an array of outgoing video streams. The `cameraStream` associated with local camera device is used in this sample code. It is all set at this point to start a video call by calling `StartCallAsync` on `CallAgent` and passing in the configured `StartCallOption` object along with the callee identifier.

```C#
        var startCallOptions = new StartCallOptions();
        startCallOptions = new StartCallOptions() {
            OutgoingVideoOptions = new OutgoingVideoOptions() { Streams = new OutgoingVideoStream[] { cameraStream } }
        };

        var callees = new ICommunicationIdentifier[1] { new CommunicationUserIdentifier(CalleeTextBox.Text.Trim()) };

        this.call = await this.callAgent.StartCallAsync(callees, startCallOptions);
        // Set up handler for remote participant updated events, such as VideoStreamStateChanged event
        this.call.RemoteParticipantsUpdated += OnRemoteParticipantsUpdatedAsync;
        // Set up handler for call StateChanged event
        this.call.StateChanged += OnStateChangedAsync;
```
### Handle remote participant and remote incoming video

Incoming video is associated with specific remote participants, therefore RemoteParticipantsUpdated is the key event to stay notified and obtain references to the changing participants.

```C#
        private async void OnRemoteParticipantsUpdatedAsync(object sender, ParticipantsUpdatedEventArgs args)
        {
            foreach (var participant in args.RemovedParticipants)
            {
                foreach(var incomingVideoStream in participant.IncomingVideoStreams)
                {
                    var remoteVideoStream = incomingVideoStream as RemoteIncomingVideoStream;
                    if (remoteVideoStream != null)
                    {
                        await remoteVideoStream.StopPreviewAsync();
                    }
                }
                // Tear down the event handler on the departing participant
                participant.VideoStreamStateChanged -= OnVideoStreamStateChanged;
            }

            foreach (var participant in args.AddedParticipants)
            {
                // Set up handler for VideoStreamStateChanged of the participant who just joined the call
                participant.VideoStreamStateChanged += OnVideoStreamStateChanged;
            }
        }
```

All remote participants are available through the `RemoteParticipants` collection on a call instance. Once the call is connected, we can access the remote participants of the call and handle the remote video streams. 

```C#
        private void OnVideoStreamStateChanged(object sender, VideoStreamStateChangedEventArgs e)
        {
            CallVideoStream callVideoStream = e.Stream;

            switch (callVideoStream.Direction)
            {
                case StreamDirection.Outgoing:
                    //OnOutgoingVideoStreamStateChanged(callVideoStream as OutgoingVideoStream);
                    break;
                case StreamDirection.Incoming:
                    OnIncomingVideoStreamStateChangedAsync(callVideoStream as IncomingVideoStream);
                    break;
            }
        }
```

A video stream will transit through a sequence of internal states. `VideoStreamState.Available` is the perferred state to bind the video stream to UI element for rendering the video stream, such as `MediaPlayerElement`, and `VideoStreamState.Stopped` is typically where the cleanup tasks such as stopping video preview should be done.

```C#
        private async void OnIncomingVideoStreamStateChangedAsync(IncomingVideoStream incomingVideoStream)
        {
            switch (incomingVideoStream.State)
            {
                case VideoStreamState.Available:
                    switch (incomingVideoStream.Kind)
                    {
                        case VideoStreamKind.RemoteIncoming:
                            var remoteVideoStream = incomingVideoStream as RemoteIncomingVideoStream;
                            var uri = await remoteVideoStream.StartPreviewAsync();

                            await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () =>
                            {
                                RemoteVideo.Source = MediaSource.CreateFromUri(uri);
                            });
                            break;

                        case VideoStreamKind.RawIncoming:
                            break;
                    }
                    break;

                case VideoStreamState.Started:
                    break;

                case VideoStreamState.Stopping:
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

### Accept an incoming call

Add the implementation to the `OnIncomingCallAsync` to answer an incoming call with video, pass the `IncomingVideoOptions` instance to `acceptCallOptions`, where `IncomingVideoOptions.StreamKind` can be set to `VideoStreamKind.RemoteIncoming` to enable acceptance of remote video.

```C#
            var incomingCall = args.IncomingCall;

            var acceptCallOptions = new AcceptCallOptions() { 
                IncomingVideoOptions = new IncomingVideoOptions()
                {
                    StreamKind = VideoStreamKind.RemoteIncoming
                } 
            };

            call = await incomingCall.AcceptAsync(acceptCallOptions);
            // Set up handler for remote participant updated events, such as VideoStreamStateChanged event
            call.RemoteParticipantsUpdated += OnRemoteParticipantsUpdatedAsync;
            // Set up handler for incoming call StateChanged event
            call.StateChanged += OnStateChangedAsync;
```


### Call state update
We need to clean the video renderers once the call is disconnected and handle the case when the remote participants initially join the call.

```C#
        private async void OnStateChangedAsync(object sender, PropertyChangedEventArgs args)
        {
            var call = sender as CommunicationCall;

            if (call != null)
            {
                var state = call.State;

                switch (state)
                {
                    case CallState.Connected:
                        {
                            break;
                        }
                    case CallState.Disconnected:
                        {
                            call.RemoteParticipantsUpdated -= OnRemoteParticipantsUpdatedAsync;
                            call.StateChanged -= OnStateChangedAsync;

                            call.Dispose();

                            break;
                        }
                    default: break;
                }
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

You can build and run the code on Visual Studio. For solution platforms, we support `ARM64`, `x64` and `x86`. 

You can make an outbound video call by providing a user ID in the text field and clicking the `Start Call` button. 

Note: Calling `8:echo123` stops the video stream because echo bot doesn't support video streaming. 

For more information on user IDs (identity) check the [User Access Tokens](../../../identity/access-tokens.md) guide. 

## [WinUI 3](#tab/WinUI3)

### Prerequisites

To complete this tutorial, you need the following prerequisites:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- Install [Visual Studio 2022](https://visualstudio.microsoft.com/downloads/) and [Windows App SDK version 1.3](/windows/apps/windows-app-sdk/stable-channel#version-13).
- Basic understanding of how to create a WinUI 3 app. [Create your first WinUI 3 (Windows App SDK) project](/windows/apps/winui/winui3/create-your-first-winui3-app?pivots=winui3-packaged-csharp) is a good resource to start with.
- A deployed Communication Services resource. [Create a Communication Services resource](../../../create-communication-resource.md). You need to **record your connection string** for this quickstart.
- A [User Access Token](../../../identity/access-tokens.md) for your Azure Communication Service. You can also use the Azure CLI and run the command with your connection string to create a user and an access token.

  ```azurecli-interactive
  az communication identity token issue --scope voip --connection-string "yourConnectionString"
  ```

  For details, see [Use Azure CLI to Create and Manage Access Tokens](../../../identity/access-tokens.md?pivots=platform-azcli).

#### Set up the app framework

We need to configure a basic layout to attach our logic. In order to place an outbound call, we need a `TextBox` to provide the User ID of the callee. We also need a `Start/Join Call` button and a `Hang up` button.
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
    mc:Ignorable="d">
    <Grid>
        <Grid.RowDefinitions>
            <RowDefinition Height="16*"/>
            <RowDefinition Height="30*"/>
            <RowDefinition Height="200*"/>
            <RowDefinition Height="60*"/>
            <RowDefinition Height="16*"/>
        </Grid.RowDefinitions>
        <TextBox Grid.Row="1" x:Name="CalleeTextBox" PlaceholderText="Who would you like to call?" TextWrapping="Wrap" VerticalAlignment="Center" Height="30" Margin="10,10,10,10" />

        <Grid Grid.Row="2">
            <Grid.RowDefinitions>
                <RowDefinition/>
            </Grid.RowDefinitions>
            <Grid.ColumnDefinitions>
                <ColumnDefinition Width="*"/>
                <ColumnDefinition Width="*"/>
            </Grid.ColumnDefinitions>
            <MediaPlayerElement x:Name="LocalVideo" HorizontalAlignment="Center" Stretch="UniformToFill" Grid.Column="0" VerticalAlignment="Center" AutoPlay="True" />
            <MediaPlayerElement x:Name="RemoteVideo" HorizontalAlignment="Center" Stretch="UniformToFill" Grid.Column="1" VerticalAlignment="Center" AutoPlay="True" />
        </Grid>
        <StackPanel Grid.Row="3" Orientation="Vertical" Grid.RowSpan="2">
            <StackPanel Orientation="Horizontal">
                <Button x:Name="CallButton" Content="Start/Join call" Click="CallButton_Click" VerticalAlignment="Center" Margin="10,0,0,0" Height="40" Width="123"/>
                <Button x:Name="HangupButton" Content="Hang up" Click="HangupButton_Click" VerticalAlignment="Center" Margin="10,0,0,0" Height="40" Width="123"/>
            </StackPanel>
        </StackPanel>
        <TextBox Grid.Row="5" x:Name="Stats" Text="" TextWrapping="Wrap" VerticalAlignment="Center" Height="30" Margin="0,2,0,0" BorderThickness="2" IsReadOnly="True" Foreground="LightSlateGray" />
    </Grid>
</Page>

```

Open the `MainPage.xaml.cs` (right click and choose View Code) and replace the content with following implementation: 
```C#
using Azure.Communication.Calling.WindowsClient;
using Microsoft.UI;
using Microsoft.UI.Windowing;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Navigation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Windows.ApplicationModel;
using Windows.Media.Core;
using WinRT.Interop;

namespace CallingQuickstart
{
    public sealed partial class MainPage : Page
    {
        private const string authToken = "<AUTHENTICATION_TOKEN>";

        private CallClient callClient;
        private CallTokenRefreshOptions callTokenRefreshOptions = new CallTokenRefreshOptions(false);
        private CallAgent callAgent;
        private CommunicationCall call;

        private LocalOutgoingVideoStream cameraStream;

        #region Page initialization
        public MainPage()
        {
            this.InitializeComponent();
            // Additional UI customization code goes here
        }

        protected override async void OnNavigatedTo(NavigationEventArgs e)
        {
            base.OnNavigatedTo(e);
        }
        #endregion

        #region UI event handlers
        private async void CallButton_Click(object sender, RoutedEventArgs e)
        {
            // Start a call
        }

        private async void HangupButton_Click(object sender, RoutedEventArgs e)
        {
            // Hang up a call
        }
        #endregion

        #region API event handlers
        private async void OnIncomingCallAsync(object sender, IncomingCallReceivedEventArgs args)
        {
            // Handle incoming call event
        }

        private async void OnStateChangedAsync(object sender, PropertyChangedEventArgs args)
        {
            // Handle connected and disconnected state change of a call
        }

        private async void OnRemoteParticipantsUpdatedAsync(object sender, ParticipantsUpdatedEventArgs args)
        {
            // Handle remote participant arrival or departure events and subscribe to individual participant's VideoStreamStateChanged event
        }

        private void OnVideoStreamStateChanged(object sender, VideoStreamStateChangedEventArgs e)
        {
            // Handle incoming or outgoing video stream change events
        }

        private async void OnIncomingVideoStreamStateChangedAsync(IncomingVideoStream incomingVideoStream)
        {
            // Handle incoming IncomingVideoStreamStateChanged event and process individual VideoStreamState
        }
        #endregion
    }
}
```

### Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Calling SDK:

| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| `CallClient` | The `CallClient` is the main entry point to the Calling SDK.|
| `CallAgent` | The `CallAgent` is used to start and manage calls. |
| `CommunicationCall` | The `CommunicationCall` is used to manage an ongoing call. |
| `CallTokenCredential` | The `CallTokenCredential` is used as the token credential to instantiate the `CallAgent`.|
|` CallIdentifier` | The `CallIdentifier` is used to represent the identity of the user, which can be one of the following options: `UserCallIdentifier`, `PhoneNumberCallIdentifier` etc. |

### Authenticate the client

To initialize a `CallAgent`, you need a User Access Token. Generally this token is generated from a service with authentication specific to the application. For more information on user access tokens, check the [User Access Tokens](../../../identity/access-tokens.md) guide.

For the quickstart, replace `<AUTHENTICATION_TOKEN>` with a user access token generated for your Azure Communication Service resource.

Once you have a token, initialize a `CallAgent` instance with it, which enable us to make and receive calls. In order to access the cameras on the device, we also need to get Device Manager instance. 

Add `InitCallAgentAndDeviceManagerAsync` function, which bootstraps the SDK. This helper can be customized to meet the requirements of your application.

```C#
        private async Task InitCallAgentAndDeviceManagerAsync()
        {
            this.callClient = new CallClient(new CallClientOptions() {
                Diagnostics = new CallDiagnosticsOptions() { 
                    AppName = "CallingQuickstart",
                    AppVersion="1.0",
                    Tags = new[] { "Calling", "ACS", "Windows" }
                    }
                });

            // Set up local video stream using the first camera enumerated
            var deviceManager = await this.callClient.GetDeviceManagerAsync();
            var camera = deviceManager?.Cameras?.FirstOrDefault();

            var tokenCredential = new CallTokenCredential(authToken, callTokenRefreshOptions);

            var callAgentOptions = new CallAgentOptions()
            {
                DisplayName = $"{Environment.MachineName}/{Environment.UserName}",
            };

            this.callAgent = await this.callClient.CreateCallAgentAsync(tokenCredential, callAgentOptions);
            this.callAgent.CallsUpdated += OnCallsUpdatedAsync;
            this.callAgent.IncomingCallReceived += OnIncomingCallAsync;

            // Bind the local video stream to `MediaPlayerElement`
            var localUri = await cameraStream.StartPreviewAsync();
            this.DispatcherQueue.TryEnqueue(async () =>
            {
                LocalVideo.Source = MediaSource.CreateFromUri(localUri);
            });
        }
```

### Start a call with video

Add the implementation to the `CallButton_Click` to start a ACS call with video. We need to set the `OutgoingVideoOptions` to configure outgoing video. `OutgoingVideoOptions` accepts an array of outgoing video streams. The `cameraStream` associated with local camera device is used in this sample code. It is all set at this point to start a video call by calling `StartCallAsync` on `CallAgent` and passing in the configured `StartCallOption` object along with the callee identifier.

```C#
        var startCallOptions = new StartCallOptions();
        startCallOptions = new StartCallOptions() {
            OutgoingVideoOptions = new OutgoingVideoOptions() { Streams = new OutgoingVideoStream[] { cameraStream } }
        };

        var callees = new ICommunicationIdentifier[1] { new CommunicationUserIdentifier(CalleeTextBox.Text.Trim()) };

        this.call = await this.callAgent.StartCallAsync(callees, startCallOptions);
        // Set up handler for remote participant updated events, such as VideoStreamStateChanged event
        this.call.RemoteParticipantsUpdated += OnRemoteParticipantsUpdatedAsync;
        // Set up handler for call StateChanged event
        this.call.StateChanged += OnStateChangedAsync;
```
### Handle remote participant and remote incoming video

Incoming video is associated with specific remote participants, therefore RemoteParticipantsUpdated is the key event to stay notified and obtain references to the changing participants.

```C#
        private async void OnRemoteParticipantsUpdatedAsync(object sender, ParticipantsUpdatedEventArgs args)
        {
            foreach (var participant in args.RemovedParticipants)
            {
                foreach(var incomingVideoStream in participant.IncomingVideoStreams)
                {
                    var remoteVideoStream = incomingVideoStream as RemoteIncomingVideoStream;
                    if (remoteVideoStream != null)
                    {
                        await remoteVideoStream.StopPreviewAsync();
                    }
                }
                // Tear down the event handler on the departing participant
                participant.VideoStreamStateChanged -= OnVideoStreamStateChanged;
            }

            foreach (var participant in args.AddedParticipants)
            {
                // Set up handler for VideoStreamStateChanged of the participant who just joined the call
                participant.VideoStreamStateChanged += OnVideoStreamStateChanged;
            }
        }
```

All remote participants are available through the `RemoteParticipants` collection on a call instance. Once the call is connected, we can access the remote participants of the call and handle the remote video streams. 

```C#
        private void OnVideoStreamStateChanged(object sender, VideoStreamStateChangedEventArgs e)
        {
            CallVideoStream callVideoStream = e.Stream;

            switch (callVideoStream.Direction)
            {
                case StreamDirection.Outgoing:
                    //OnOutgoingVideoStreamStateChanged(callVideoStream as OutgoingVideoStream);
                    break;
                case StreamDirection.Incoming:
                    OnIncomingVideoStreamStateChangedAsync(callVideoStream as IncomingVideoStream);
                    break;
            }
        }
```

A video stream will transit through a sequence of internal states. `VideoStreamState.Available` is the perferred state to bind the video stream to UI element for rendering the video stream, such as `MediaPlayerElement`, and `VideoStreamState.Stopped` is typically where the cleanup tasks such as stopping video preview should be done.

```C#
        private async void OnIncomingVideoStreamStateChangedAsync(IncomingVideoStream incomingVideoStream)
        {
            switch (incomingVideoStream.State)
            {
                case VideoStreamState.Available:
                    switch (incomingVideoStream.Kind)
                    {
                        case VideoStreamKind.RemoteIncoming:
                            var remoteVideoStream = incomingVideoStream as RemoteIncomingVideoStream;
                            var uri = await remoteVideoStream.StartPreviewAsync();

                            this.DispatcherQueue.TryEnqueue(async () =>
                            {
                                RemoteVideo.Source = MediaSource.CreateFromUri(uri);
                            });
                            break;

                        case VideoStreamKind.RawIncoming:
                            break;
                    }
                    break;

                case VideoStreamState.Started:
                    break;

                case VideoStreamState.Stopping:
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

### Accept an incoming call

Add the implementation to the `OnIncomingCallAsync` to answer an incoming call with video, pass the `IncomingVideoOptions` instance to `acceptCallOptions`, where `IncomingVideoOptions.StreamKind` can be set to `VideoStreamKind.RemoteIncoming` to enable acceptance of remote video.

```C#
            var incomingCall = args.IncomingCall;

            var acceptCallOptions = new AcceptCallOptions() { 
                IncomingVideoOptions = new IncomingVideoOptions()
                {
                    StreamKind = VideoStreamKind.RemoteIncoming
                } 
            };

            call = await incomingCall.AcceptAsync(acceptCallOptions);
            // Set up handler for remote participant updated events, such as VideoStreamStateChanged event
            call.RemoteParticipantsUpdated += OnRemoteParticipantsUpdatedAsync;
            // Set up handler for incoming call StateChanged event
            call.StateChanged += OnStateChangedAsync;
```


### Call state update
We need to clean the video renderers once the call is disconnected and handle the case when the remote participants initially join the call.

```C#
        private async void OnStateChangedAsync(object sender, PropertyChangedEventArgs args)
        {
            var call = sender as CommunicationCall;

            if (call != null)
            {
                var state = call.State;

                switch (state)
                {
                    case CallState.Connected:
                        {
                            break;
                        }
                    case CallState.Disconnected:
                        {
                            call.RemoteParticipantsUpdated -= OnRemoteParticipantsUpdatedAsync;
                            call.StateChanged -= OnStateChangedAsync;

                            call.Dispose();

                            break;
                        }
                    default: break;
                }
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

You can build and run the code on Visual Studio. For solution platforms, we support `ARM64`, `x64` and `x86`. 

You can make an outbound video call by providing a user ID in the text field and clicking the `Start Call` button. 

Note: Calling `8:echo123` stops the video stream because echo bot doesn't support video streaming. 

For more information on user IDs (identity) check the [User Access Tokens](../../../identity/access-tokens.md) guide. 
