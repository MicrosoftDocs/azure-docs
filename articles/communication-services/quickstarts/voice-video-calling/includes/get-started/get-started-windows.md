---
author: probableprime
ms.service: azure-communication-services
ms.topic: include
ms.date: 03/10/2021
ms.author: rifox
---

In this quickstart, you learn how to start a call using the Azure Communication Services Calling SDK for Windows.

## [UWP](#tab/uwp)
You can download the sample app from [GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/Calling).

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

Right select your project and go to `Manage Nuget Packages` to install `Azure.Communication.Calling.WindowsClient` [1.0.0-beta.11](https://www.nuget.org/packages/Azure.Communication.Calling.WindowsClient/1.0.0-beta.11) or superior. Make sure Include Preleased is checked.

#### Request access

Go to `Package.appxmanifest` and select `Capabilities`.
Check `Internet (Client & Server)` to gain inbound and outbound access to the Internet. Check `Microphone` to access the audio feed of the microphone. 

:::image type="content" source="../../media/windows/request-access.png" alt-text="Screenshot showing requesting access to Internet and Microphone in Visual Studio.":::

#### Set up the app framework

We need to configure a basic layout to attach our logic. In order to place an outbound call, we need a `TextBox` to provide the User ID of the callee. We also need a `Start/Join call` button and a `Hang up` button. The `Mute` and a `BackgroundBlur` checkbox are also included in this sample to demonstrate the features of toggling audio states and video effects.

Open the `MainPage.xaml` of your project and add the `Grid` node to your `Page`:

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
            <StackPanel Orientation="Horizontal" Margin="10">
                <TextBlock VerticalAlignment="Center">Cameras:</TextBlock>
                <ComboBox x:Name="CameraList" HorizontalAlignment="Left" Grid.Column="0" DisplayMemberPath="Name" SelectionChanged="CameraList_SelectionChanged" Margin="10"/>
            </StackPanel>
            <StackPanel Orientation="Horizontal">
                <Button x:Name="CallButton" Content="Start/Join call" Click="CallButton_Click" VerticalAlignment="Center" Margin="10,0,0,0" Height="40" Width="123"/>
                <Button x:Name="HangupButton" Content="Hang up" Click="HangupButton_Click" VerticalAlignment="Center" Margin="10,0,0,0" Height="40" Width="123"/>
                <CheckBox x:Name="MuteLocal" Content="Mute" Margin="10,0,0,0" Click="MuteLocal_Click" Width="74"/>
                <CheckBox x:Name="BackgroundBlur" Content="Background blur" Width="142" Margin="10,0,0,0" Click="BackgroundBlur_Click"/>
            </StackPanel>
        </StackPanel>
        <TextBox Grid.Row="5" x:Name="Stats" Text="" TextWrapping="Wrap" VerticalAlignment="Center" Height="30" Margin="0,2,0,0" BorderThickness="2" IsReadOnly="True" Foreground="LightSlateGray" />
    </Grid>
</Page>
```

Open the `MainPage.xaml.cs` and replace the content with following implementation: 
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

        private LocalOutgoingAudioStream micStream;
        private LocalOutgoingVideoStream cameraStream;

        private BackgroundBlurEffect backgroundBlurVideoEffect = new BackgroundBlurEffect();
        private LocalVideoEffectsFeature localVideoEffectsFeature;

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
        private async void CameraList_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            // Switch cameras
        }

        private async void CallButton_Click(object sender, RoutedEventArgs e)
        {
            // Start a call
        }

        private async void HangupButton_Click(object sender, RoutedEventArgs e)
        {
            // Hang up a call
        }

        private async void MuteLocal_Click(object sender, RoutedEventArgs e)
        {
            // Toggle mute/unmute audio state of a call
        }

        private async void BackgroundBlur_Click(object sender, RoutedEventArgs e)
        {
            // Toggle background blur video effect
        }
        #endregion

        #region Video Effects Event Handlers
        private void OnVideoEffectDisabled(object sender, VideoEffectDisabledEventArgs e)
        {
            // Handle video effect disabled event
        }

        private void OnVideoEffectEnabled(object sender, VideoEffectEnabledEventArgs e)
        {
            // Handle video effect enabled event
        }
        #endregion

        #region API event handlers
        private async void OnTokenRefreshRequestedAsync(object sender, CallTokenRefreshRequestedEventArgs e)
        {
            // Refresh authentication token
        }

        private async void OnCallsUpdatedAsync(object sender, CallsUpdatedEventArgs args)
        {
            // Handle participant updated events of a call
        }

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

The next table listed the classes and interfaces handle some of the major features of the Azure Communication Services Calling SDK:

| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| `CallClient` | The `CallClient` is the main entry point to the Calling SDK.|
| `CallAgent` | The `CallAgent` is used to start and manage calls. |
| `CommunicationCall` | The `CommunicationCall` is used to manage an ongoing call. |
| `CallTokenCredential` | The `CallTokenCredential` is used as the token credential to instantiate the `CallAgent`.|
|` CallIdentifier` | The `CallIdentifier` is used to represent the identity of the user, which can be one of the following options: `UserCallIdentifier`, `PhoneNumberCallIdentifier` etc. |

### Authenticate the client

Initialize a `CallAgent` instance with a User Access Token that enables us to make and receive calls, and optionally obtain a DeviceManager instance to query for client device configurations.

In the code, replace `<AUTHENTICATION_TOKEN>` with a User Access Token. Refer to the [user access token](../../../identity/access-tokens.md) documentation if you don't already have a token available.

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
            var mic = deviceManager?.Microphones?.FirstOrDefault();
            micStream = new LocalOutgoingAudioStream();

            CameraList.ItemsSource = deviceManager.Cameras.ToList();

            if (camera != null)
            {
                CameraList.SelectedIndex = 0;
            }

            callTokenRefreshOptions.TokenRefreshRequested += OnTokenRefreshRequestedAsync;

            var tokenCredential = new CallTokenCredential(authToken, callTokenRefreshOptions);

            var callAgentOptions = new CallAgentOptions()
            {
                DisplayName = $"{Environment.MachineName}/{Environment.UserName}",
                //https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes/blob/master/all/all.csv
                EmergencyCallOptions = new EmergencyCallOptions() { CountryCode = "840" }
            };

            try
            {
                this.callAgent = await this.callClient.CreateCallAgentAsync(tokenCredential, callAgentOptions);
                //await this.callAgent.RegisterForPushNotificationAsync(await this.RegisterWNS());
                this.callAgent.CallsUpdated += OnCallsUpdatedAsync;
                this.callAgent.IncomingCallReceived += OnIncomingCallAsync;

            }
            catch(Exception ex)
            {
                if (ex.HResult == -2147024809)
                {
                    // E_INVALIDARG
                    // Handle possible invalid token
                }
            }
        }
```

### Start a call

Add the implementation to the `CallButton_Click` to start various kinds of calls with the `callAgent` object we created, and hook up `RemoteParticipantsUpdated` and `StateChanged` event handlers on `CommunicationCall` object.

```C#
        private async void CallButton_Click(object sender, RoutedEventArgs e)
        {
            var callString = CalleeTextBox.Text.Trim();

            if (!string.IsNullOrEmpty(callString))
            {
                if (callString.StartsWith("8:")) // 1:1 ACS call
                {
                    call = await StartAcsCallAsync(callString);
                }
                else if (callString.StartsWith("+")) // 1:1 phone call
                {
                    call = await StartPhoneCallAsync(callString, "+12000000000");
                }
                else if (Guid.TryParse(callString, out Guid groupId))// Join group call by group guid
                {
                    call = await JoinGroupCallByIdAsync(groupId);
                }
                else if (Uri.TryCreate(callString, UriKind.Absolute, out Uri teamsMeetinglink)) //Teams meeting link
                {
                    call = await JoinTeamsMeetingByLinkAsync(teamsMeetinglink);
                }
            }

            if (call != null)
            {
                call.RemoteParticipantsUpdated += OnRemoteParticipantsUpdatedAsync;
                call.StateChanged += OnStateChangedAsync;
            }
        }
```

### End a call

End the current call when the `Hang Up` button is clicked. Add the implementation to the HangupButton_Click to end a call, and stop the preview and video streams.

```C#
        private async void HangupButton_Click(object sender, RoutedEventArgs e)
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
                    if (errorCode != 98) // sam_status_failed_to_hangup_for_everyone (98)
                    {
                        throw;
                    }
                }
            }
        }
```

### Toggle mute/unmute on audio

Mute the outgoing audio when the `Mute` button is clicked. Add the implementation to the MuteLocal_Click to mute the call.

```C#
        private async void MuteLocal_Click(object sender, RoutedEventArgs e)
        {
            var muteCheckbox = sender as CheckBox;

            if (muteCheckbox != null)
            {
                var call = this.callAgent?.Calls?.FirstOrDefault();
                if (call != null)
                {
                    if ((bool)muteCheckbox.IsChecked)
                    {
                        await call.MuteOutgoingAudioAsync();
                    }
                    else
                    {
                        await call.UnmuteOutgoingAudioAsync();
                    }
                }

                // Upate the UI to reflect the state
            }
        }
```

### Toggle Background Blur video effect

Enable or disable background blur video effect on local video stream. Add the implementation to the `BackgroundBlur_Click` to toggle the video effect.

```C#
        private async void BackgroundBlur_Click(object sender, RoutedEventArgs e)
        {
            if (localVideoEffectsFeature.IsEffectSupported(backgroundBlurVideoEffect))
            {
                var backgroundBlurCheckbox = sender as CheckBox;
                if (backgroundBlurCheckbox.IsChecked.Value)
                {
                    localVideoEffectsFeature.EnableEffect(backgroundBlurVideoEffect);
                }
                else
                {
                    localVideoEffectsFeature.DisableEffect(backgroundBlurVideoEffect);
                }
            }
        }
```

### Apply video effect on local video stream

Application has the opportunities to stay notified about video effect change events on local outgoing video stream (such as web cameras) and further customize the behaviors.

```C#
        private void InitVideoEffectsFeature(LocalOutgoingVideoStream videoStream) {
            localVideoEffectsFeature = videoStream.Features.VideoEffects;
            localVideoEffectsFeature.VideoEffectEnabled += OnVideoEffectEnabled;
            localVideoEffectsFeature.VideoEffectDisabled += OnVideoEffectDisabled;
            localVideoEffectsFeature.VideoEffectError += OnVideoEffectError;
        }
```

### Switch camera

When multiple video cameras are present on the system, the following code snippet selects an active camera source as the feed for local video stream.

```C#
            if (cameraStream != null)
            {
                await cameraStream?.StopPreviewAsync();
                if (call != null)
                {
                    await call?.StopVideoAsync(cameraStream);
                }
            }
            var selectedCamerea = CameraList.SelectedItem as VideoDeviceDetails;
            cameraStream = new LocalOutgoingVideoStream(selectedCamerea);

            InitVideoEffectsFeature(cameraStream);

            var localUri = await cameraStream.StartPreviewAsync();

            // Bind the video stream to MediaPlayerElement
            LocalVideo.Source = MediaSource.CreateFromUri(localUri);

            if (call != null) {
                await call?.StartVideoAsync(cameraStream);
            }
```

### Customize the call

`StartCallOptions` provides options to configure audio and video to fit the requirements of the calling scenarios.

```C#
        private StartCallOptions GetStartCallOptions()
        {
            var startCallOptions = startCallOptions = new StartCallOptions() {
                    OutgoingAudioOptions = new OutgoingAudioOptions() { IsMuted = true, Stream = micStream  },
                    OutgoingVideoOptions = new OutgoingVideoOptions() { Streams = new OutgoingVideoStream[] { cameraStream } }
                };
            
            return startCallOptions;
        }

```
In the meeting join scenario, `JoinCallOptions` is made available to customize the audio and video calling experience.
```C#
        private JoinCallOptions GetJoinCallOptions()
        {
            return new JoinCallOptions() {
                OutgoingAudioOptions = new OutgoingAudioOptions() { IsMuted = true },
                OutgoingVideoOptions = new OutgoingVideoOptions() { Streams = new OutgoingVideoStream[] { cameraStream } }
            };
        }

```

### Start the call

Once a `StartCallOptions` object is obtained, `CallAgent` can be used to initiate the ACS call:

```C#
        private async Task<CommunicationCall> StartAcsCallAsync(string acsCallee)
        {
            var options = GetStartCallOptions();
            var call = await this.callAgent.StartCallAsync( new [] { new UserCallIdentifier(acsCallee) }, options);
            return call;
        }

```

Or, join a group call using group ID (a GUID).
```C#
        private async Task<CommunicationCall> JoinGroupCallByIdAsync(Guid groupId)
        {
            var joinCallOptions = GetJoinCallOptions();

            var groupCallLocator = new GroupCallLocator(groupId);
            var call = await this.callAgent.JoinAsync(groupCallLocator, joinCallOptions);
            return call;
        }
```

Or, join a Teams call using meeting link (a valid Uri).
```C#
        private async Task<CommunicationCall> JoinTeamsMeetingByLinkAsync(Uri teamsCallLink)
        {
            var joinCallOptions = GetJoinCallOptions();

            var teamsMeetingLinkLocator = new TeamsMeetingLinkLocator(teamsCallLink.AbsoluteUri);
            var call = await callAgent.JoinAsync(teamsMeetingLinkLocator, joinCallOptions);
            return call;
        }

```

Or, start a PSTN call using the alternateCallerId, which is a provisioned phone number found in the Communication Service of your Azure subscription.
```C#
        private async Task<CommunicationCall> StartPhoneCallAsync(string acsCallee, string alternateCallerId)
        {
            var options = GetStartCallOptions();
            options.AlternateCallerId = new PhoneNumberCallIdentifier(alternateCallerId);

            var call = await this.callAgent.StartCallAsync( new [] { new PhoneNumberCallIdentifier(acsCallee) }, options);
            return call;
        }
```

### Accept an incoming call

`IncomingCallReceived` event sink is set up in the SDK bootstrap helper `InitCallAgentAndDeviceManagerAsync'.

```C#
    this.callAgent.IncomingCallReceived += OnIncomingCallAsync;
```

Application has an opportunity to configure how the incoming call should be accepted, such as video and audio stream kinds.
```C#
        private async void OnIncomingCallAsync(object sender, IncomingCallReceivedEventArgs args)
        {
            var incomingCall = args.IncomingCall;

            var acceptCallOptions = new AcceptCallOptions() { 
                IncomingVideoOptions = new IncomingVideoOptions()
                {
                    StreamKind = VideoStreamKind.RemoteIncoming
                } 
            };

            call = await incomingCall.AcceptAsync(acceptCallOptions);
            call.StateChanged += OnStateChangedAsync;
            call.RemoteParticipantsUpdated += OnRemoteParticipantsUpdatedAsync;
        }
```

### Monitor and response to call state change event

`StateChanged` event on `CommunicationCall` object is fired when an in progress call transactions from one state to another. Application is offered the opportunities to reflect the state changes on UI or insert business logics.

```C#
        private async void OnStateChangedAsync(object sender, PropertyChangedEventArgs args)
        {
            var call = sender as CommunicationCall;

            if (call != null)
            {
                var state = call.State;

                // Update the UI

                switch (state)
                {
                    case CallState.Connected:
                        {
                            await call.StartAudioAsync(micStream);

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

### Monitor and response to remote participant video change events

`VideoStreamStateChanged` event on `RemoteParticipant` object is fired when a video stream on remote participant has changed.

```C#
        private async Task OnParticipantChangedAsync(IEnumerable<RemoteParticipant> removedParticipants, IEnumerable<RemoteParticipant> addedParticipants)
        {
            foreach (var participant in removedParticipants)
            {
                foreach(var incomingVideoStream in participant.IncomingVideoStreams)
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
```
`VideoStreamStateChanged` on `RemoteParticipant` is where UI binding and remote video stream cleanup logics should be implemented.
```C#
        private void OnVideoStreamStateChanged(object sender, VideoStreamStateChangedEventArgs e)
        {
            CallVideoStream callVideoStream = e.Stream;

            switch (callVideoStream.Direction)
            {
                case StreamDirection.Outgoing:
                    OnOutgoingVideoStreamStateChanged(callVideoStream as OutgoingVideoStream);
                    break;
                case StreamDirection.Incoming:
                    OnIncomingVideoStreamStateChangedAsync(callVideoStream as IncomingVideoStream);
                    break;
            }
        }
```

For example, `VideoStreamState.Available` state on remote incoming video stream can be used to set up the UI binding for remote participant, and `VideoStreamState.Stopped` is where application can stop the preview and video:
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

### Run the code

You can build and run the code on Visual Studio. For solution platforms, we support `ARM64`, `x64` and `x86`. 

You can make an outbound call by providing a user ID in the text field and clicking the `Start Call/Join` button. Calling `8:echo123` connects you with an echo bot, this feature is great for getting started and verifying your audio devices are working.

:::image type="content" source="../../media/windows/run-the-app.png" alt-text="Screenshot showing running the UWP quickstart app":::

## [WinUI 3](#tab/WinUI3)

You can download the sample app from [GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/CallingWinUI).

### Prerequisites

To complete this tutorial, you need the following prerequisites:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- Install [Visual Studio 2022](https://visualstudio.microsoft.com/downloads/) and [Windows App SDK version 1.3](https://learn.microsoft.com/en-us/windows/apps/windows-app-sdk/stable-channel#version-13). 
- Basic understanding of how to create a WinUI 3 app. [Create your first WinUI 3 (Windows App SDK) project](https://learn.microsoft.com/windows/apps/winui/winui3/create-your-first-winui3-app?pivots=winui3-packaged-csharp) is a good resource to start with.
- A deployed Communication Services resource. [Create a Communication Services resource](../../../create-communication-resource.md). You need to **record your connection string** for this quickstart.
- A [User Access Token](../../../identity/access-tokens.md) for your Azure Communication Service. You can also use the Azure CLI and run the command with your connection string to create a user and an access token.


  ```azurecli-interactive
  az communication identity token issue --scope voip --connection-string "yourConnectionString"
  ```

  For details, see [Use Azure CLI to Create and Manage Access Tokens](../../../identity/access-tokens.md?pivots=platform-azcli).
  
### Setting up

#### Creating the project

In Visual Studio, create a new project with the **Blank App, Packaged (WinUI 3 in Desktop)** template to set up a single-page WinUI 3 app.

:::image type="content" source="../../media/windows/create-a-new-winui-project.png" alt-text="Screenshot showing the New WinUI Project window within Visual Studio.":::

#### Install the package

Right select your project and go to `Manage Nuget Packages` to install `Azure.Communication.Calling.WindowsClient` [1.0.0-beta.11](https://www.nuget.org/packages/Azure.Communication.Calling.WindowsClient/1.0.0-beta.11) or superior. Make sure Include Preleased is checked.

#### Request access

:::image type="content" source="../../media/windows/request-access.png" alt-text="Screenshot showing requesting access to Internet and Microphone in Visual Studio.":::

#### Set up the app framework

We need to configure a basic layout to attach our logic. In order to place an outbound call, we need a `TextBox` to provide the User ID of the callee. We also need a `Start/Join call` button and a `Hang up` button. The `Mute` and a `BackgroundBlur` checkbox are also included in this sample to demonstrate the features of toggling audio states and video effects.

Open the `MainPage.xaml` of your project and add the `Grid` node to your `Page`:

We need to configure a basic layout to attach our logic. In order to place an outbound call, we need a `TextBox` to provide the User ID of the callee. We also need a `Start Call` button and a `Hang Up` button.
Open the `MainPage.xaml` of your project and add the `Grid` node to your `Page`:

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
            <StackPanel Orientation="Horizontal" Margin="10">
                <TextBlock VerticalAlignment="Center">Cameras:</TextBlock>
                <ComboBox x:Name="CameraList" HorizontalAlignment="Left" Grid.Column="0" DisplayMemberPath="Name" SelectionChanged="CameraList_SelectionChanged" Margin="10"/>
            </StackPanel>
            <StackPanel Orientation="Horizontal">
                <Button x:Name="CallButton" Content="Start/Join call" Click="CallButton_Click" VerticalAlignment="Center" Margin="10,0,0,0" Height="40" Width="123"/>
                <Button x:Name="HangupButton" Content="Hang up" Click="HangupButton_Click" VerticalAlignment="Center" Margin="10,0,0,0" Height="40" Width="123"/>
                <CheckBox x:Name="MuteLocal" Content="Mute" Margin="10,0,0,0" Click="MuteLocal_Click" Width="74"/>
                <CheckBox x:Name="BackgroundBlur" Content="Background blur" Width="142" Margin="10,0,0,0" Click="BackgroundBlur_Click"/>
            </StackPanel>
        </StackPanel>
        <TextBox Grid.Row="5" x:Name="Stats" Text="" TextWrapping="Wrap" VerticalAlignment="Center" Height="30" Margin="0,2,0,0" BorderThickness="2" IsReadOnly="True" Foreground="LightSlateGray" />
    </Grid>
</Page>

```

Open the `MainPage.xaml.cs` and replace the content with following implementation: 
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

        private LocalOutgoingAudioStream micStream;
        private LocalOutgoingVideoStream cameraStream;

        private BackgroundBlurEffect backgroundBlurVideoEffect = new BackgroundBlurEffect();
        private LocalVideoEffectsFeature localVideoEffectsFeature;

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
        private async void CameraList_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            // Switch cameras
        }

        private async void CallButton_Click(object sender, RoutedEventArgs e)
        {
            // Start a call
        }

        private async void HangupButton_Click(object sender, RoutedEventArgs e)
        {
            // Hang up a call
        }

        private async void MuteLocal_Click(object sender, RoutedEventArgs e)
        {
            // Toggle mute/unmute audio state of a call
        }

        private async void BackgroundBlur_Click(object sender, RoutedEventArgs e)
        {
            // Toggle background blur video effect
        }
        #endregion

        #region Video Effects Event Handlers
        private void OnVideoEffectDisabled(object sender, VideoEffectDisabledEventArgs e)
        {
            // Handle video effect disabled event
        }

        private void OnVideoEffectEnabled(object sender, VideoEffectEnabledEventArgs e)
        {
            // Handle video effect enabled event
        }
        #endregion

        #region API event handlers
        private async void OnTokenRefreshRequestedAsync(object sender, CallTokenRefreshRequestedEventArgs e)
        {
            // Refresh authentication token
        }

        private async void OnCallsUpdatedAsync(object sender, CallsUpdatedEventArgs args)
        {
            // Handle participant updated events of a call
        }

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

The next table listed the classes and interfaces handle some of the major features of the Azure Communication Services Calling SDK:

| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| `CallClient` | The `CallClient` is the main entry point to the Calling SDK.|
| `CallAgent` | The `CallAgent` is used to start and manage calls. |
| `CommunicationCall` | The `CommunicationCall` is used to manage an ongoing call. |
| `CallTokenCredential` | The `CallTokenCredential` is used as the token credential to instantiate the `CallAgent`.|
|` CallIdentifier` | The `CallIdentifier` is used to represent the identity of the user, which can be one of the following options: `UserCallIdentifier`, `PhoneNumberCallIdentifier` etc. |

### Authenticate the client

Initialize a `CallAgent` instance with a User Access Token that enables us to make and receive calls, and optionally obtain a DeviceManager instance to query for client device configurations.

In the code, replace `<AUTHENTICATION_TOKEN>` with a User Access Token. Refer to the [user access token](../../../identity/access-tokens.md) documentation if you don't already have a token available.

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
            var mic = deviceManager?.Microphones?.FirstOrDefault();
            micStream = new LocalOutgoingAudioStream();

            CameraList.ItemsSource = deviceManager.Cameras.ToList();

            if (camera != null)
            {
                CameraList.SelectedIndex = 0;
            }

            callTokenRefreshOptions.TokenRefreshRequested += OnTokenRefreshRequestedAsync;

            var tokenCredential = new CallTokenCredential(authToken, callTokenRefreshOptions);

            var callAgentOptions = new CallAgentOptions()
            {
                DisplayName = $"{Environment.MachineName}/{Environment.UserName}",
                //https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes/blob/master/all/all.csv
                EmergencyCallOptions = new EmergencyCallOptions() { CountryCode = "840" }
            };

            try
            {
                this.callAgent = await this.callClient.CreateCallAgentAsync(tokenCredential, callAgentOptions);
                //await this.callAgent.RegisterForPushNotificationAsync(await this.RegisterWNS());
                this.callAgent.CallsUpdated += OnCallsUpdatedAsync;
                this.callAgent.IncomingCallReceived += OnIncomingCallAsync;

            }
            catch(Exception ex)
            {
                if (ex.HResult == -2147024809)
                {
                    // E_INVALIDARG
                    // Handle possible invalid token
                }
            }
        }
```

### Start a call

Add the implementation to the `CallButton_Click` to start various kinds of calls with the `callAgent` object we created, and hook up `RemoteParticipantsUpdated` and `StateChanged` event handlers on `CommunicationCall` object.

```C#
        private async void CallButton_Click(object sender, RoutedEventArgs e)
        {
            var callString = CalleeTextBox.Text.Trim();

            if (!string.IsNullOrEmpty(callString))
            {
                if (callString.StartsWith("8:")) // 1:1 ACS call
                {
                    call = await StartAcsCallAsync(callString);
                }
                else if (callString.StartsWith("+")) // 1:1 phone call
                {
                    call = await StartPhoneCallAsync(callString, "+12000000000");
                }
                else if (Guid.TryParse(callString, out Guid groupId))// Join group call by group guid
                {
                    call = await JoinGroupCallByIdAsync(groupId);
                }
                else if (Uri.TryCreate(callString, UriKind.Absolute, out Uri teamsMeetinglink)) //Teams meeting link
                {
                    call = await JoinTeamsMeetingByLinkAsync(teamsMeetinglink);
                }
            }

            if (call != null)
            {
                call.RemoteParticipantsUpdated += OnRemoteParticipantsUpdatedAsync;
                call.StateChanged += OnStateChangedAsync;
            }
        }
```

### End a call

End the current call when the `Hang Up` button is clicked. Add the implementation to the HangupButton_Click to end a call, and stop the preview and video streams.

```C#
        private async void HangupButton_Click(object sender, RoutedEventArgs e)
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
                    if (errorCode != 98) // sam_status_failed_to_hangup_for_everyone (98)
                    {
                        throw;
                    }
                }
            }
        }
```

### Toggle mute/unmute on audio

Mute the outgoing audio when the `Mute` button is clicked. Add the implementation to the MuteLocal_Click to mute the call.

```C#
        private async void MuteLocal_Click(object sender, RoutedEventArgs e)
        {
            var muteCheckbox = sender as CheckBox;

            if (muteCheckbox != null)
            {
                var call = this.callAgent?.Calls?.FirstOrDefault();
                if (call != null)
                {
                    if ((bool)muteCheckbox.IsChecked)
                    {
                        await call.MuteOutgoingAudioAsync();
                    }
                    else
                    {
                        await call.UnmuteOutgoingAudioAsync();
                    }
                }

                // Upate the UI to reflect the state
            }
        }
```

### Toggle Background Blur video effect

Enable or disable background blur video effect on local video stream. Add the implementation to the `BackgroundBlur_Click` to toggle the video effect.

```C#
        private async void BackgroundBlur_Click(object sender, RoutedEventArgs e)
        {
            if (localVideoEffectsFeature.IsEffectSupported(backgroundBlurVideoEffect))
            {
                var backgroundBlurCheckbox = sender as CheckBox;
                if (backgroundBlurCheckbox.IsChecked.Value)
                {
                    localVideoEffectsFeature.EnableEffect(backgroundBlurVideoEffect);
                }
                else
                {
                    localVideoEffectsFeature.DisableEffect(backgroundBlurVideoEffect);
                }
            }
        }
```

### Apply video effect on local video stream

Application has the opportunities to stay notified about video effect change events on local outgoing video stream (such as web cameras) and further customize the behaviors.

```C#
        private void InitVideoEffectsFeature(LocalOutgoingVideoStream videoStream) {
            localVideoEffectsFeature = videoStream.Features.VideoEffects;
            localVideoEffectsFeature.VideoEffectEnabled += OnVideoEffectEnabled;
            localVideoEffectsFeature.VideoEffectDisabled += OnVideoEffectDisabled;
            localVideoEffectsFeature.VideoEffectError += OnVideoEffectError;
        }
```

### Switch camera

When multiple video cameras are present on the system, the following code snippet selects an active camera source as the feed for local video stream.

```C#
            if (cameraStream != null)
            {
                await cameraStream?.StopPreviewAsync();
                if (call != null)
                {
                    await call?.StopVideoAsync(cameraStream);
                }
            }
            var selectedCamerea = CameraList.SelectedItem as VideoDeviceDetails;
            cameraStream = new LocalOutgoingVideoStream(selectedCamerea);

            InitVideoEffectsFeature(cameraStream);

            var localUri = await cameraStream.StartPreviewAsync();

            // Bind the video stream to MediaPlayerElement
            LocalVideo.Source = MediaSource.CreateFromUri(localUri);

            if (call != null) {
                await call?.StartVideoAsync(cameraStream);
            }
```

### Customize the call

`StartCallOptions` provides options to configure audio and video to fit the requirements of the calling scenarios.

```C#
        private StartCallOptions GetStartCallOptions()
        {
            var startCallOptions = startCallOptions = new StartCallOptions() {
                    OutgoingAudioOptions = new OutgoingAudioOptions() { IsMuted = true, Stream = micStream  },
                    OutgoingVideoOptions = new OutgoingVideoOptions() { Streams = new OutgoingVideoStream[] { cameraStream } }
                };
            
            return startCallOptions;
        }

```
In the meeting join scenario, `JoinCallOptions` is made available to customize the audio and video calling experience.
```C#
        private JoinCallOptions GetJoinCallOptions()
        {
            return new JoinCallOptions() {
                OutgoingAudioOptions = new OutgoingAudioOptions() { IsMuted = true },
                OutgoingVideoOptions = new OutgoingVideoOptions() { Streams = new OutgoingVideoStream[] { cameraStream } }
            };
        }

```

### Start the call

Once a `StartCallOptions` object is obtained, `CallAgent` can be used to initiate the ACS call:

```C#
        private async Task<CommunicationCall> StartAcsCallAsync(string acsCallee)
        {
            var options = GetStartCallOptions();
            var call = await this.callAgent.StartCallAsync( new [] { new UserCallIdentifier(acsCallee) }, options);
            return call;
        }

```

Or, join a group call using group ID (a GUID).
```C#
        private async Task<CommunicationCall> JoinGroupCallByIdAsync(Guid groupId)
        {
            var joinCallOptions = GetJoinCallOptions();

            var groupCallLocator = new GroupCallLocator(groupId);
            var call = await this.callAgent.JoinAsync(groupCallLocator, joinCallOptions);
            return call;
        }
```

Or, join a Teams call using meeting link (a valid Uri).
```C#
        private async Task<CommunicationCall> JoinTeamsMeetingByLinkAsync(Uri teamsCallLink)
        {
            var joinCallOptions = GetJoinCallOptions();

            var teamsMeetingLinkLocator = new TeamsMeetingLinkLocator(teamsCallLink.AbsoluteUri);
            var call = await callAgent.JoinAsync(teamsMeetingLinkLocator, joinCallOptions);
            return call;
        }

```

Or, start a PSTN call using the alternateCallerId, which is a provisioned phone number found in the Communication Service of your Azure subscription.
```C#
        private async Task<CommunicationCall> StartPhoneCallAsync(string acsCallee, string alternateCallerId)
        {
            var options = GetStartCallOptions();
            options.AlternateCallerId = new PhoneNumberCallIdentifier(alternateCallerId);

            var call = await this.callAgent.StartCallAsync( new [] { new PhoneNumberCallIdentifier(acsCallee) }, options);
            return call;
        }
```

### Accept an incoming call

`IncomingCallReceived` event sink is set up in the SDK bootstrap helper `InitCallAgentAndDeviceManagerAsync'.

```C#
    this.callAgent.IncomingCallReceived += OnIncomingCallAsync;
```

Application has an opportunity to configure how the incoming call should be accepted, such as video and audio stream kinds.
```C#
        private async void OnIncomingCallAsync(object sender, IncomingCallReceivedEventArgs args)
        {
            var incomingCall = args.IncomingCall;

            var acceptCallOptions = new AcceptCallOptions() { 
                IncomingVideoOptions = new IncomingVideoOptions()
                {
                    StreamKind = VideoStreamKind.RemoteIncoming
                } 
            };

            call = await incomingCall.AcceptAsync(acceptCallOptions);
            call.StateChanged += OnStateChangedAsync;
            call.RemoteParticipantsUpdated += OnRemoteParticipantsUpdatedAsync;
        }
```

### Monitor and response to call state change event

`StateChanged` event on `CommunicationCall` object is fired when an in progress call transactions from one state to another. Application is offered the opportunities to reflect the state changes on UI or insert business logics.

```C#
        private async void OnStateChangedAsync(object sender, PropertyChangedEventArgs args)
        {
            var call = sender as CommunicationCall;

            if (call != null)
            {
                var state = call.State;

                // Update the UI

                switch (state)
                {
                    case CallState.Connected:
                        {
                            await call.StartAudioAsync(micStream);

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

### Monitor and response to remote participant video change events

`VideoStreamStateChanged` event on `RemoteParticipant` object is fired when a video stream on remote participant has changed.

```C#
        private async Task OnParticipantChangedAsync(IEnumerable<RemoteParticipant> removedParticipants, IEnumerable<RemoteParticipant> addedParticipants)
        {
            foreach (var participant in removedParticipants)
            {
                foreach(var incomingVideoStream in participant.IncomingVideoStreams)
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
```
`VideoStreamStateChanged` on `RemoteParticipant` is where UI binding and remote video stream cleanup logics should be implemented.
```C#
        private void OnVideoStreamStateChanged(object sender, VideoStreamStateChangedEventArgs e)
        {
            CallVideoStream callVideoStream = e.Stream;

            switch (callVideoStream.Direction)
            {
                case StreamDirection.Outgoing:
                    OnOutgoingVideoStreamStateChanged(callVideoStream as OutgoingVideoStream);
                    break;
                case StreamDirection.Incoming:
                    OnIncomingVideoStreamStateChangedAsync(callVideoStream as IncomingVideoStream);
                    break;
            }
        }
```

For example, `VideoStreamState.Available` state on remote incoming video stream can be used to set up the UI binding for remote participant, and `VideoStreamState.Stopped` is where application can stop the preview and video:
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

                            this.DispatcherQueue.TryEnqueue(() =>
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

### Run the code

You can build and run the code on Visual Studio. For solution platforms, we support `ARM64`, `x64` and `x86`. 

You can make an outbound call by providing a user ID in the text field and clicking the `Start Call` button. Calling `8:echo123` connects you with an echo bot, this feature is great for getting started and verifying your audio devices are working.

:::image type="content" source="../../media/windows/run-the-winui-app.png" alt-text="Screenshot showing running the WinUI quickstart app":::
