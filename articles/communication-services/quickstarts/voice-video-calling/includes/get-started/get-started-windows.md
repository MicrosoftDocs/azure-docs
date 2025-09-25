---
author: probableprime
ms.service: azure-communication-services
ms.topic: include
ms.date: 05/10/2025
ms.author: rifox
ms.custom: sfi-ropc-nochange
---

This article describes how to start a call using the Azure Communication Services Calling SDK for Windows.

## [UWP](#tab/uwp)

You can download the sample app from GitHub at [Calling SDK for .NET](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/Calling).

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

Right select your project and go to `Manage Nuget Packages` to install `Azure.Communication.Calling.WindowsClient` [1.4.0](https://www.nuget.org/packages/Azure.Communication.Calling.WindowsClient/1.4.0) or later. Make sure `Include Prerelease` is checked if you want to see the versions for public preview.

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

        <!-- Don't forget to replace ‘CallingQuickstart’ with your project’s name -->


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
        private CallAgent callAgent;
        private CommunicationCall call;

        private LocalOutgoingAudioStream micStream;

        #region Page initialization
        public MainPage()
        {
            this.InitializeComponent();
            // Additional UI customization code goes here
        }

        protected override async void OnNavigatedTo(NavigationEventArgs e)
        {
            await InitCallAgentAndDeviceManagerAsync();

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
        private async void OnIncomingCallAsync(object sender, IncomingCallReceivedEventArgs args)
        {
            // Handle incoming call event
        }

        private async void OnStateChangedAsync(object sender, PropertyChangedEventArgs args)
        {
            // Handle connected and disconnected state change of a call
        }
        #endregion

        #region Helper methods

        private async Task InitCallAgentAndDeviceManagerAsync()
        {
            //Initialize the call agent and search for devices
        }


        private async Task<CommunicationCall> StartCallAsync(string acsCallee)
        {
            // Start a call to an Azure Communication Services user using the CallAgent and the callee id
        }

        #endregion
    }
}
```

### Object model

The next table listed the classes and interfaces handle some of the major features of the Azure Communication Services Calling SDK:

| Name | Description |
| --- | --- |
| `CallClient` | The `CallClient` is the main entry point to the Calling SDK.|
| `CallAgent` | Use the `CallAgent` to start and manage calls. |
| `CommunicationCall` | Use the `CommunicationCall` to manage an ongoing call. |
| `CallTokenCredential` | Use the `CallTokenCredential` as the token credential to instantiate the `CallAgent`.|
| `CallIdentifier` | Use `CallIdentifier` to represent the identity of the user, which can be one of the following options: `UserCallIdentifier`, `PhoneNumberCallIdentifier`, and so on. |

### Authenticate the client

Initialize a `CallAgent` instance with a User Access Token that enables us to make and receive calls, and optionally obtain a DeviceManager instance to query for client device configurations.

In the code, replace `<AUTHENTICATION_TOKEN>` with a User Access Token. If you don't already have a token available, see [user access token](../../../identity/access-tokens.md).

Add `InitCallAgentAndDeviceManagerAsync` function, which bootstraps the SDK. You can customize this helper to meet the requirements of your application.

```C#
        private async Task InitCallAgentAndDeviceManagerAsync()
        {
            this.callClient = new CallClient(new CallClientOptions() {
                Diagnostics = new CallDiagnosticsOptions() { 
                    
                    // make sure to put your project AppName
                    AppName = "CallingQuickstart",

                    AppVersion="1.0",

                    Tags = new[] { "Calling", "ACS", "Windows" }
                    }

                });

            // Set up local audio stream using the first mic enumerated
            var deviceManager = await this.callClient.GetDeviceManagerAsync();
            var mic = deviceManager?.Microphones?.FirstOrDefault();

            micStream = new LocalOutgoingAudioStream();

            var tokenCredential = new CallTokenCredential(authToken, callTokenRefreshOptions);

            var callAgentOptions = new CallAgentOptions()
            {
                DisplayName = $"{Environment.MachineName}/{Environment.UserName}",
            };

            this.callAgent = await this.callClient.CreateCallAgentAsync(tokenCredential, callAgentOptions);

            this.callAgent.IncomingCallReceived += OnIncomingCallAsync;
        }
```

### Start the call

Once you obtain a `StartCallOptions` object, you can use `CallAgent` cto initiate the Azure Communication Services call:

```C#
        private async Task<CommunicationCall> StartCallAsync(string acsCallee)
        {
            var options = new StartCallOptions();
            var call = await this.callAgent.StartCallAsync( new [] { new UserCallIdentifier(acsCallee) }, options);
            return call;
        }
```

### End a call

End the current call when the end user clicks the **Hang up** button. Add the implementation to the `HangupButton_Click` to end a call, and stop the preview and video streams.

```C#
        private async void HangupButton_Click(object sender, RoutedEventArgs e)
        {
            var call = this.callAgent?.Calls?.FirstOrDefault();
            if (call != null)
            {
                await call.HangUpAsync(new HangUpOptions() { ForEveryone = false });
            }
        }
```

### Toggle mute/unmute on audio

Mute the outgoing audio when the end user clicks the **Mute** button. Add the implementation to `MuteLocal_Click` to mute the call.

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

                // Update the UI to reflect the state
            }
        }
```

### Accept an incoming call

`IncomingCallReceived` event sink is set up in the SDK bootstrap helper `InitCallAgentAndDeviceManagerAsync`.

```C#
    this.callAgent.IncomingCallReceived += OnIncomingCallAsync;
```

Application has an opportunity to configure how the incoming call should be accepted, such as video and audio stream kinds.
```C#
        private async void OnIncomingCallAsync(object sender, IncomingCallReceivedEventArgs args)
        {
            var incomingCall = args.IncomingCall;

            var acceptCallOptions = new AcceptCallOptions() { };

            call = await incomingCall.AcceptAsync(acceptCallOptions);
            call.StateChanged += OnStateChangedAsync;
        }
```

### Monitor and response to call state change event

The `StateChanged` event on `CommunicationCall` object runs when an in progress call transitions from one state to another. This change gives you the opportunity to reflect the state changes or execute business logic in your application.

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
                            call.StateChanged -= OnStateChangedAsync;

                            call.Dispose();

                            break;
                        }
                    default: break;
                }
            }
        }
```

### Make call button work

Once the `Callee ID` isn't null or empty, you can start a call.

You must change the call state using the `OnStateChangedAsync` action.

```C#

    private async void CallButton_Click(object sender, RoutedEventArgs e)
    {
        var callString = CalleeTextBox.Text.Trim();

        if (!string.IsNullOrEmpty(callString))
        {
            call = await StartCallAsync(callString);

            call.StateChanged += OnStateChangedAsync;
        }
    
        
    }

```

### Run the code

You can build and run the code on Visual Studio. For solution platforms, we support `ARM64`, `x64`, and `x86`. 

To make an outbound call, provide a user ID in the text field and click the **Start Call/Join** button. Calling `8:echo123` connects you with an echo bot. Use this feature to get started and verifying that your audio devices are working.

:::image type="content" source="../../media/windows/run-the-app.png" alt-text="Screenshot showing running the UWP quickstart app":::

## [WinUI 3](#tab/WinUI3)

You can download the sample app from GitHub at [Calling SDK for Windows](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/CallingWinUI).

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
  
### Setting up

#### Creating the project

In Visual Studio, create a new project with the **Blank App, Packaged (WinUI 3 in Desktop)** template to set up a single-page WinUI 3 app.

:::image type="content" source="../../media/windows/create-a-new-winui-project.png" alt-text="Screenshot showing the New WinUI Project window within Visual Studio.":::

#### Install the package

Right select your project and go to `Manage Nuget Packages` to install `Azure.Communication.Calling.WindowsClient` [1.2.0-beta.1](https://www.nuget.org/packages/Azure.Communication.Calling.WindowsClient/1.2.0-beta.1) or superior. Make sure Include Preleased is checked.

#### Request access

:::image type="content" source="../../media/windows/request-access.png" alt-text="Screenshot showing requesting access to Internet and Microphone in Visual Studio.":::

#### Set up the app framework

Configure a basic layout to attach our logic. To place an outbound call, we need a `TextBox` to provide the User ID of the callee. We also need a `Start/Join call` button and a `Hang up` button. We include a `Mute` and a `BackgroundBlur` checkboxes this sample to demonstrate the features of toggling audio states and video effects.

Open the `MainPage.xaml` of your project and add the `Grid` node to your `Page`:

Configure a basic layout to attach our logic. To place an outbound call, we need a `TextBox` to provide the User ID of the callee. We also need a `Start Call` button and a `Hang Up` button.
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
        private CallAgent callAgent;
        private CommunicationCall call;

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
        private async void OnIncomingCallAsync(object sender, IncomingCallReceivedEventArgs args)
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
| `CallAgent` | Use the `CallAgent` to start and manage calls. |
| `CommunicationCall` | Use the `CommunicationCall` to manage an ongoing call. |
| `CallTokenCredential` | Use the `CallTokenCredential` as the token credential to instantiate the `CallAgent`.|
| `CallIdentifier` | Use `CallIdentifier` to represent the identity of the user, which can be one of the following options: `UserCallIdentifier`, `PhoneNumberCallIdentifier`, and so on. |

### Authenticate the client

Initialize a `CallAgent` instance with a User Access Token that enables us to make and receive calls. You can also optionally obtain a DeviceManager instance to query for client device configurations.

In the code, replace `<AUTHENTICATION_TOKEN>` with a User Access Token. If you don't already have a token available, see [user access token](../../../identity/access-tokens.md).

Add the `InitCallAgentAndDeviceManagerAsync` function, which bootstraps the SDK. You can customize this helper to meet the requirements of your application.

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

            var tokenCredential = new CallTokenCredential(authToken, callTokenRefreshOptions);

            var callAgentOptions = new CallAgentOptions()
            {
                DisplayName = $"{Environment.MachineName}/{Environment.UserName}",
            };

            this.callAgent = await this.callClient.CreateCallAgentAsync(tokenCredential, callAgentOptions);
            this.callAgent.IncomingCallReceived += OnIncomingCallAsync;
        }
```

### Start a call

Add the implementation to the `CallButton_Click` to start various kinds of calls with the `callAgent` object we created. Hook up `RemoteParticipantsUpdated` and `StateChanged` event handlers on `CommunicationCall` object.

```C#
        private async void CallButton_Click(object sender, RoutedEventArgs e)
        {
            var callString = CalleeTextBox.Text.Trim();

            call = await StartCallAsync(callString);
            if (call != null)
            {
                call.StateChanged += OnStateChangedAsync;
            }
        }
```

### End a call

End the current call when the user clicks the **Hang up** button. Add the implementation to `HangupButton_Click` to end a call, and stop the preview and video streams.

```C#
        private async void HangupButton_Click(object sender, RoutedEventArgs e)
        {
            var call = this.callAgent?.Calls?.FirstOrDefault();
            if (call != null)
            {
                await call.HangUpAsync(new HangUpOptions() { ForEveryone = false });
            }
        }
```

### Toggle mute/unmute on audio

Mute the outgoing audio when the `Mute` button is clicked. Add the implementation to `MuteLocal_Click` to mute the call.

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

                // Update the UI to reflect the state
            }
        }
```

### Customize the call

Use `StartCallOptions` to configure audio and video to fit the requirements of the calling scenarios.

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
In the meeting join scenario, you can use `JoinCallOptions` is to customize the audio and video calling experience.

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

Once you obtain a `StartCallOptions`,  you can use`CallAgent` to initiate the Azure Communication Services call:

```C#
        private async Task<CommunicationCall> StartCallAsync(string acsCallee)
        {
            var options = new StartCallOptions();
            var call = await this.callAgent.StartCallAsync( new [] { new UserCallIdentifier(acsCallee) }, options);
            return call;
        }

```

### Accept an incoming call

`IncomingCallReceived` event sink is set up in the SDK bootstrap helper `InitCallAgentAndDeviceManagerAsync`.

```C#
    this.callAgent.IncomingCallReceived += OnIncomingCallAsync;
```

You can use the application to configure how the incoming call should be accepted, such as video and audio stream types.

```C#
        private async void OnIncomingCallAsync(object sender, IncomingCallReceivedEventArgs args)
        {
            var incomingCall = args.IncomingCall;

            var acceptCallOptions = new AcceptCallOptions() { };

            call = await incomingCall.AcceptAsync(acceptCallOptions);
            call.StateChanged += OnStateChangedAsync;
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
                            call.StateChanged -= OnStateChangedAsync;

                            call.Dispose();

                            break;
                        }
                    default: break;
                }
            }
        }
```

### Run the code

You can build and run the code on Visual Studio. For solution platforms, we support `ARM64`, `x64`, and `x86`. 

You can make an outbound call by providing a user ID in the text field and clicking the **Start Call** button. Calling `8:echo123` connects you with an echo bot. Use this feature to get started and verify that your audio devices are working.

:::image type="content" source="../../media/windows/run-the-winui-app.png" alt-text="Screenshot showing running the WinUI quickstart app":::
