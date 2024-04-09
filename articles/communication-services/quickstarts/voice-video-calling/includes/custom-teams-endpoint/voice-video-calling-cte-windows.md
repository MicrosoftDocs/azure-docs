---
author: jesseo
ms.service: azure-communication-services
ms.topic: include
ms.date: 07/19/2023
ms.author: jesseo
---

Get started with Azure Communication Services by using the Communication Services calling SDK to add 1:1 voice & video calling to your app. You'll learn how to start and answer a call using the Azure Communication Services Calling SDK for Windows.

[!INCLUDE [Public Preview](../../../../includes/public-preview-include-document.md)]

## [UWP](#tab/uwp)

## Sample Code

If you'd like to skip ahead to the end, you can download this quickstart as a sample on [GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/Calling).

### Prerequisites

To complete this tutorial, you need the following prerequisites:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Install [Visual Studio 2022](https://visualstudio.microsoft.com/downloads/) with Universal Windows Platform development workload.
- A deployed Communication Services resource. [Create a Communication Services resource](../../../create-communication-resource.md). You need to **record your connection string** for this quickstart.
- A [User Access Token](../../../manage-teams-identity.md?pivots=programming-language-csharp) for your Azure Communication Service.
- Obtain Teams thread ID to for call operations using [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer). Read more about [how to create chat thread ID](/graph/api/chat-post?preserve-view=true&tabs=javascript&view=graph-rest-1.0#example-2-create-a-group-chat).
  
### Setting up

#### Creating the project

In Visual Studio, create a new project with the **Blank App (Universal Windows)** template to set up a single-page Universal Windows Platform (UWP) app.

:::image type="content" source="../../media/windows/create-a-new-project.png" alt-text="Screenshot showing the New UWP Project window within Visual Studio.":::

#### Install the package

Right select your project and go to `Manage Nuget Packages` to install `Azure.Communication.Calling.WindowsClient` [1.2.0-beta.1](https://www.nuget.org/packages/Azure.Communication.Calling.WindowsClient/1.2.0-beta.1) or superior. Make sure Include Preleased is checked.

#### Request access

Go to `Package.appxmanifest` and select `Capabilities`.
Check `Internet (Client)` and `Internet (Client & Server)` to gain inbound and outbound access to the Internet. Check `Microphone` to access the audio feed of the microphone, and `Webcam` to access the video feed of the camera.

:::image type="content" source="../../media/windows/request-access.png" alt-text="Screenshot showing requesting access to Internet and Microphone in Visual Studio.":::

#### Set up the app framework

We need to configure a basic layout to attach our logic. In order to place an outbound call, we need a `TextBox` to provide the User ID of the callee. We also need a `Start/Join call` button and a `Hang up` button. A `Mute` and a `BackgroundBlur` checkboxes are also included in this sample to demonstrate the features of toggling audio states and video effects.

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
            <StackPanel Orientation="Horizontal">
                <Button x:Name="CallButton" Content="Start/Join call" Click="CallButton_Click" VerticalAlignment="Center" Margin="10,0,0,0" Height="40" Width="123"/>
                <Button x:Name="HangupButton" Content="Hang up" Click="HangupButton_Click" VerticalAlignment="Center" Margin="10,0,0,0" Height="40" Width="123"/>
                <CheckBox x:Name="MuteLocal" Content="Mute" Margin="10,0,0,0" Click="MuteLocal_Click" Width="74"/>
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
        private TeamsCallAgent teamsCallAgent;
        private TeamsCommunicationCall teamsCall;

        private LocalOutgoingAudioStream micStream;
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

        private async void MuteLocal_Click(object sender, RoutedEventArgs e)
        {
            // Toggle mute/unmute audio state of a call
        }
        #endregion

        #region API event handlers
        private async void OnIncomingCallAsync(object sender, TeamsIncomingCallReceivedEventArgs args)
        {
            // Handle incoming call event
        }

        private async void OnStateChangedAsync(object sender, PropertyChangedEventArgs args)
        {
            // Handle connected and disconnected state change of a call
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
| `TeamsCallAgent` | The `TeamsCallAgent` is used to start and manage calls. |
| `TeamsCommunicationCall` | The `TeamsCommunicationCall` is used to manage an ongoing call. |
| `CallTokenCredential` | The `CallTokenCredential` is used as the token credential to instantiate the `TeamsCallAgent`.|
|` CallIdentifier` | The `CallIdentifier` is used to represent the identity of the user, which can be one of the following options: `MicrosoftTeamsUserCallIdentifier`, `UserCallIdentifier`, `PhoneNumberCallIdentifier` etc. |

### Authenticate the client

Initialize a `TeamsCallAgent` instance with a User Access Token that enables us to make and receive calls, and optionally obtain a DeviceManager instance to query for client device configurations.

In the code, replace `<AUTHENTICATION_TOKEN>` with a User Access Token. Refer to the [user access token](../../../manage-teams-identity.md?pivots=programming-language-csharp) documentation if you don't already have a token available.

Add `InitCallAgentAndDeviceManagerAsync` function, which bootstraps the SDK. This helper can be customized to meet the requirements of your application.

```C#
        private async Task InitCallAgentAndDeviceManagerAsync()
        {
            this.callClient = new CallClient(new CallClientOptions() {
                Diagnostics = new CallDiagnosticsOptions() { 
                    AppName = "CallingQuickstart",
                    AppVersion="1.0",
                    Tags = new[] { "Calling", "CTE", "Windows" }
                    }
                });

            // Set up local video stream using the first camera enumerated
            var deviceManager = await this.callClient.GetDeviceManagerAsync();
            var camera = deviceManager?.Cameras?.FirstOrDefault();
            var mic = deviceManager?.Microphones?.FirstOrDefault();
            micStream = new LocalOutgoingAudioStream();

            var tokenCredential = new CallTokenCredential(authToken, callTokenRefreshOptions);

            this.teamsCallAgent = await this.callClient.CreateTeamsCallAgentAsync(tokenCredential);
            this.teamsCallAgent.IncomingCallReceived += OnIncomingCallAsync;
        }
```

### Start a call

Add the implementation to the `CallButton_Click` to start various kinds of calls with the `teamsCallAgent` object we created, and hook up `RemoteParticipantsUpdated` and `StateChanged` event handlers on `TeamsCommunicationCall` object.

```C#
        private async void CallButton_Click(object sender, RoutedEventArgs e)
        {
            var callString = CalleeTextBox.Text.Trim();

            teamsCall = await StartCteCallAsync(callString);
            if (teamsCall != null)
            {
                teamsCall.StateChanged += OnStateChangedAsync;
            }
        }
```

### End a call

End the current call when the `Hang up` button is clicked. Add the implementation to the HangupButton_Click to end a call, and stop the preview and video streams.

```C#
        private async void HangupButton_Click(object sender, RoutedEventArgs e)
        {
            var teamsCall = this.teamsCallAgent?.Calls?.FirstOrDefault();
            if (teamsCall != null)
            {
                await teamsCall.HangUpAsync(new HangUpOptions() { ForEveryone = false });
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
                var teamsCall = this.teamsCallAgent?.Calls?.FirstOrDefault();
                if (teamsCall != null)
                {
                    if ((bool)muteCheckbox.IsChecked)
                    {
                        await teamsCall.MuteOutgoingAudioAsync();
                    }
                    else
                    {
                        await teamsCall.UnmuteOutgoingAudioAsync();
                    }
                }

                // Update the UI to reflect the state
            }
        }
```

### Start the call

Once a `StartTeamsCallOptions` object is obtained, `TeamsCallAgent` can be used to initiate the Teams call:

```C#
        private async Task<TeamsCommunicationCall> StartCteCallAsync(string cteCallee)
        {
            var options = new StartTeamsCallOptions();
            var teamsCall = await this.teamsCallAgent.StartCallAsync( new MicrosoftTeamsUserCallIdentifier(cteCallee), options);
            return call;
        }
```

### Accept an incoming call

`TeamsIncomingCallReceived` event sink is set up in the SDK bootstrap helper `InitCallAgentAndDeviceManagerAsync`.

```C#
    this.teamsCallAgent.IncomingCallReceived += OnIncomingCallAsync;
```

Application has an opportunity to configure how the incoming call should be accepted, such as video and audio stream kinds.
```C#
        private async void OnIncomingCallAsync(object sender, TeamsIncomingCallReceivedEventArgs args)
        {
            var teamsIncomingCall = args.IncomingCall;

            var acceptCallOptions = new AcceptCallOptions() { };

            teamsCall = await teamsIncomingCall.AcceptAsync(acceptCallOptions);
            teamsCall.StateChanged += OnStateChangedAsync;
        }
```

### Monitor and respond to call state change event

`StateChanged` event on `TeamsCommunicationCall` object is fired when an in progress call transactions from one state to another. Application is offered the opportunities to reflect the state changes on UI or insert business logics.

```C#
        private async void OnStateChangedAsync(object sender, PropertyChangedEventArgs args)
        {
            var teamsCall = sender as TeamsCommunicationCall;

            if (teamsCall != null)
            {
                var state = teamsCall.State;

                // Update the UI

                switch (state)
                {
                    case CallState.Connected:
                        {
                            await teamsCall.StartAudioAsync(micStream);

                            break;
                        }
                    case CallState.Disconnected:
                        {
                            teamsCall.StateChanged -= OnStateChangedAsync;

                            teamsCall.Dispose();

                            break;
                        }
                    default: break;
                }
            }
        }
```

### Run the code

You can build and run the code on Visual Studio. For solution platforms, we support `ARM64`, `x64` and `x86`. 

You can make an outbound call by providing a user ID in the text field and clicking the `Start Call/Join` button. Calling `8:echo123` connects you with an echo bot, this feature is great for getting started and verifying your audio devices are working.

:::image type="content" source="../../media/windows/run-the-app.png" alt-text="Screenshot showing running the UWP quickstart app":::

## [WinUI 3](#tab/WinUI3)

## Sample Code

If you'd like to skip ahead to the end, you can download this quickstart as a sample on [GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/CallingWinUI).

### Prerequisites

To complete this tutorial, you need the following prerequisites:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- Install [Visual Studio 2022](https://visualstudio.microsoft.com/downloads/) and [Windows App SDK version 1.3](/windows/apps/windows-app-sdk/stable-channel#version-13).
- Basic understanding of how to create a WinUI 3 app. [Create your first WinUI 3 (Windows App SDK) project](/windows/apps/winui/winui3/create-your-first-winui3-app?pivots=winui3-packaged-csharp) is a good resource to start with.
- A deployed Communication Services resource. [Create a Communication Services resource](../../../create-communication-resource.md). You need to **record your connection string** for this quickstart.
- A [User Access Token](../../../manage-teams-identity.md?pivots=programming-language-csharp) for your Azure Communication Service.
- Obtain Teams thread ID to for call operations using [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer). Read more about [how to create chat thread ID](/graph/api/chat-post?preserve-view=true&tabs=javascript&view=graph-rest-1.0#example-2-create-a-group-chat).
  
### Setting up

#### Creating the project

In Visual Studio, create a new project with the **Blank App, Packaged (WinUI 3 in Desktop)** template to set up a single-page WinUI 3 app.

:::image type="content" source="../../media/windows/create-a-new-winui-project.png" alt-text="Screenshot showing the New WinUI Project window within Visual Studio.":::

#### Install the package

Right select your project and go to `Manage Nuget Packages` to install `Azure.Communication.Calling.WindowsClient` [1.2.0-beta.1](https://www.nuget.org/packages/Azure.Communication.Calling.WindowsClient/1.2.0-beta.1) or superior. Make sure Include Preleased is checked.

#### Request access

:::image type="content" source="../../media/windows/request-access.png" alt-text="Screenshot showing requesting access to Internet and Microphone in Visual Studio.":::

#### Set up the app framework

We need to configure a basic layout to attach our logic. In order to place an outbound call, we need a `TextBox` to provide the User ID of the callee. We also need a `Start/Join call` button and a `Hang up` button. A `Mute` and a `BackgroundBlur` checkboxes are also included in this sample to demonstrate the features of toggling audio states and video effects.

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
            <StackPanel Orientation="Horizontal">
                <Button x:Name="CallButton" Content="Start/Join call" Click="CallButton_Click" VerticalAlignment="Center" Margin="10,0,0,0" Height="40" Width="123"/>
                <Button x:Name="HangupButton" Content="Hang up" Click="HangupButton_Click" VerticalAlignment="Center" Margin="10,0,0,0" Height="40" Width="123"/>
                <CheckBox x:Name="MuteLocal" Content="Mute" Margin="10,0,0,0" Click="MuteLocal_Click" Width="74"/>
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
        private TeamsCallAgent teamsCallAgent;
        private TeamsCommunicationCall teamsCall;

        private LocalOutgoingAudioStream micStream;
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

        private async void MuteLocal_Click(object sender, RoutedEventArgs e)
        {
            // Toggle mute/unmute audio state of a call
        }
        #endregion

        #region API event handlers
        private async void OnIncomingCallAsync(object sender, TeamsIncomingCallReceivedEventArgs args)
        {
            // Handle incoming call event
        }

        private async void OnStateChangedAsync(object sender, PropertyChangedEventArgs args)
        {
            // Handle connected and disconnected state change of a call
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
| `TeamsCallAgent` | The `TeamsCallAgent` is used to start and manage calls. |
| `TeamsCommunicationCall` | The `TeamsCommunicationCall` is used to manage an ongoing call. |
| `CallTokenCredential` | The `CallTokenCredential` is used as the token credential to instantiate the `TeamsCallAgent`.|
|` CallIdentifier` | The `CallIdentifier` is used to represent the identity of the user, which can be one of the following options: `MicrosoftTeamsUserCallIdentifier`, `UserCallIdentifier`, `PhoneNumberCallIdentifier` etc. |

### Authenticate the client

Initialize a `TeamsCallAgent` instance with a User Access Token that enables us to make and receive calls, and optionally obtain a DeviceManager instance to query for client device configurations.

In the code, replace `<AUTHENTICATION_TOKEN>` with a User Access Token. Refer to the [user access token](../../../manage-teams-identity.md?pivots=programming-language-csharp) documentation if you don't already have a token available.

Add `InitCallAgentAndDeviceManagerAsync` function, which bootstraps the SDK. This helper can be customized to meet the requirements of your application.

```C#
        private async Task InitCallAgentAndDeviceManagerAsync()
        {
            this.callClient = new CallClient(new CallClientOptions() {
                Diagnostics = new CallDiagnosticsOptions() { 
                    AppName = "CallingQuickstart",
                    AppVersion="1.0",
                    Tags = new[] { "Calling", "CTE", "Windows" }
                    }
                });

            // Set up local video stream using the first camera enumerated
            var deviceManager = await this.callClient.GetDeviceManagerAsync();
            var camera = deviceManager?.Cameras?.FirstOrDefault();
            var mic = deviceManager?.Microphones?.FirstOrDefault();
            micStream = new LocalOutgoingAudioStream();

            var tokenCredential = new CallTokenCredential(authToken, callTokenRefreshOptions);

            var teamsCallAgentOptions = new TeamsCallAgentOptions();

            this.teamsCallAgent = await this.callClient.CreateTeamsCallAgentAsync(tokenCredential, teamsCallAgentOptions);
            this.teamsCallAgent.IncomingCallReceived += OnIncomingCallAsync;
        }
```

### Start a call

Add the implementation to the `CallButton_Click` to start various kinds of calls with the `teamsCallAgent` object we created, and hook up `RemoteParticipantsUpdated` and `StateChanged` event handlers on `TeamsCommunicationCall` object.

```C#
        private async void CallButton_Click(object sender, RoutedEventArgs e)
        {
            var callString = CalleeTextBox.Text.Trim();

            teamsCall = await StartCteCallAsync(callString);
            if (teamsCall != null)
            {
                teamsCall.StateChanged += OnStateChangedAsync;
            }
        }
```

### End a call

End the current call when the `Hang up` button is clicked. Add the implementation to the HangupButton_Click to end a call, and stop the preview and video streams.

```C#
        private async void HangupButton_Click(object sender, RoutedEventArgs e)
        {
            var teamsCall = this.teamsCallAgent?.Calls?.FirstOrDefault();
            if (teamsCall != null)
            {
                await teamsCall.HangUpAsync(new HangUpOptions() { ForEveryone = false });
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
                var teamsCall = this.teamsCallAgent?.Calls?.FirstOrDefault();
                if (teamsCall != null)
                {
                    if ((bool)muteCheckbox.IsChecked)
                    {
                        await teamsCall.MuteOutgoingAudioAsync();
                    }
                    else
                    {
                        await teamsCall.UnmuteOutgoingAudioAsync();
                    }
                }

                // Update the UI to reflect the state
            }
        }
```

### Customize the call

`StartTeamsCallOptions` provides options to configure audio and video to fit the requirements of the calling scenarios.

```C#
        private StartTeamsCallOptions GetStartTeamsCallOptions()
        {
            var startTeamsCallOptions = new StartTeamsCallOptions() {
                    OutgoingAudioOptions = new OutgoingAudioOptions() { IsMuted = true, Stream = micStream  },
                    OutgoingVideoOptions = new OutgoingVideoOptions() { Streams = new OutgoingVideoStream[] { cameraStream } }
                };
            
            return startTeamsCallOptions;
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

Once a `StartTeamsCallOptions` object is obtained, `TeamsCallAgent` can be used to initiate the Teams call:

```C#
        private async Task<TeamsCommunicationCall> StartCteCallAsync(string cteCallee)
        {
            var options = new StartTeamsCallOptions();
            var teamsCall = await this.teamsCallAgent.StartCallAsync( new MicrosoftTeamsUserCallIdentifier(cteCallee), options);
            return teamsCall;
        }
```

### Accept an incoming call

`TeamsIncomingCallReceived` event sink is set up in the SDK bootstrap helper `InitCallAgentAndDeviceManagerAsync`.

```C#
    this.teamsCallAgent.IncomingCallReceived += OnIncomingCallAsync;
```

Application has an opportunity to configure how the incoming call should be accepted, such as video and audio stream kinds.
```C#
        private async void OnIncomingCallAsync(object sender, TeamsIncomingCallReceivedEventArgs args)
        {
            var teamsIncomingCall = args.IncomingCall;

            var acceptCallOptions = new AcceptCallOptions() { };

            teamsCall = await teamsIncomingCall.AcceptAsync(acceptCallOptions);
            teamsCall.StateChanged += OnStateChangedAsync;
        }
```

### Monitor and respond to call state change event

`StateChanged` event on `TeamsCommunicationCall` object is fired when an in progress call transactions from one state to another. Application is offered the opportunities to reflect the state changes on UI or insert business logics.

```C#
        private async void OnStateChangedAsync(object sender, PropertyChangedEventArgs args)
        {
            var teamsCall = sender as TeamsCommunicationCall;

            if (teamsCall != null)
            {
                var state = teamsCall.State;

                // Update the UI

                switch (state)
                {
                    case CallState.Connected:
                        {
                            await teamsCall.StartAudioAsync(micStream);

                            break;
                        }
                    case CallState.Disconnected:
                        {
                            teamsCall.StateChanged -= OnStateChangedAsync;

                            teamsCall.Dispose();

                            break;
                        }
                    default: break;
                }
            }
        }
```

### Run the code

You can build and run the code on Visual Studio. For solution platforms, we support `ARM64`, `x64` and `x86`. 

You can make an outbound call by providing a user ID in the text field and clicking the `Start Call` button. Calling `8:echo123` connects you with an echo bot, this feature is great for getting started and verifying your audio devices are working.

:::image type="content" source="../../media/windows/run-the-winui-app.png" alt-text="Screenshot showing running the WinUI quickstart app":::