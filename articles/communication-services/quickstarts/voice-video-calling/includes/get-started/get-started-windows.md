---
author: probableprime
ms.service: azure-communication-services
ms.topic: include
ms.date: 03/10/2021
ms.author: rifox
---

In this quickstart, you learn how to start a call using the Azure Communication Services Calling SDK for Windows.

## UWP sample code

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

Right select your project and go to `Manage Nuget Packages` to install `Azure.Communication.Calling.WindowsClient` [1.0.0](https://www.nuget.org/packages/Azure.Communication.Calling.WindowsClient/1.0.0) or superior.

#### Request access

Go to `Package.appxmanifest` and select `Capabilities`.
Check `Internet (Client & Server)` to gain inbound and outbound access to the Internet. Check `Microphone` to access the audio feed of the microphone. 

:::image type="content" source="../../media/windows/request-access.png" alt-text="Screenshot showing requesting access to Internet and Microphone in Visual Studio.":::

#### Set up the app framework

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
        </Grid>
        <StackPanel Grid.Row="2" Orientation="Horizontal">
            <Button x:Name="CallButton" Content="Start Call" Click="CallButton_Click" VerticalAlignment="Center" Margin="10,0,0,0" Height="40" Width="200"/>
            <Button x:Name="HangupButton" Content="Hang Up" Click="HangupButton_Click" VerticalAlignment="Center" Margin="10,0,0,0" Height="40" Width="200"/>
            <TextBlock x:Name="State" Text="Status" TextWrapping="Wrap" VerticalAlignment="Center" Margin="40,0,0,0" Height="40" Width="200"/>
        </StackPanel>
    </Grid>
</Page>
```

Open to `App.xaml.cs` (right click over the file and choose View Code) and add this line to the top:
```C#
using CallingQuickstart;
```

Open the `MainPage.xaml.cs` and replace the content with following implementation: 
```C#
using Azure.Communication.Calling.WindowsClient;
using System;
using System.Collections.Generic;
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
        private const string authToken = "<ACS auth token>";

        private CallClient callClient;
        private CallTokenRefreshOptions callTokenRefreshOptions;
        private CallAgent callAgent;
        private CommunicationCall call = null;
        
        private LocalOutgoingAudioStream micStream;

        #region Page initialization
        public MainPage()
        {
            this.InitializeComponent();
            
            // Hide default title bar.
            var coreTitleBar = CoreApplication.GetCurrentView().TitleBar;
            coreTitleBar.ExtendViewIntoTitleBar = true;

            QuickstartTitle.Text = $"{Package.Current.DisplayName} - Ready";
            Window.Current.SetTitleBar(AppTitleBar);

            CallButton.IsEnabled = true;
            HangupButton.IsEnabled = !CallButton.IsEnabled;
            MuteLocal.IsChecked = MuteLocal.IsEnabled = !CallButton.IsEnabled;

            ApplicationView.PreferredLaunchViewSize = new Windows.Foundation.Size(800, 600);
            ApplicationView.PreferredLaunchWindowingMode = ApplicationViewWindowingMode.PreferredLaunchViewSize;
        }
        
        protected override async void OnNavigatedTo(NavigationEventArgs e)
        {
            await InitCallAgentAndDeviceManagerAsync();

            base.OnNavigatedTo(e);
        }
#endregion
        private async Task InitCallAgentAndDeviceManagerAsync()
        {
            // Create and cache CallAgent and optionally fetch DeviceManager
        }

        private async void CallButton_Click(object sender, RoutedEventArgs e)
        {
            // Start call
        }

        private async void HangupButton_Click(object sender, RoutedEventArgs e)
        {
            // End the current call
        }

        private async void Call_OnStateChangedAsync(object sender, PropertyChangedEventArgs args)
        {
            // Update call state
        }
    }
}
```

### Object model

The next table listed the classes and interfaces handle some of the major features of the Azure Communication Services Calling SDK:

| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| `CallClient` | The `CallClient` is the main entry point to the Calling SDK.|
| `CallAgent` | The `CallAgent` is used to start and manage calls. |
| `CommunicationCall` | The `CommunicationCall` is used to manage placed or joined calls. |
| `CallTokenCredential` | The `CallTokenCredential` is used as the token credential to instantiate the `CallAgent`.|
|` CommunicationUserIdentifier` | The `CommunicationUserIdentifier` is used to represent the identity of the user, which can be one of the following options: `CommunicationUserIdentifier`, `PhoneNumberIdentifier`, `CallingApplication`. |

### Authenticate the client

Initialize a `CallAgent` instance with a User Access Token that enables us to make and receive calls, and optionally obtain a DeviceManager instance to query for client device configurations.

In the code, replace `<AUTHENTICATION_TOKEN>` with a User Access Token. Refer to the [user access token](../../../identity/access-tokens.md) documentation if you don't already have a token available.

Add the code to the `InitCallAgentAndDeviceManagerAsync` function.

```C#
this.callClient = new CallClient(new CallClientOptions() {
    Diagnostics = new CallDiagnosticsOptions() { 
        AppName = "CallingQuickstart",
        AppVersion="1.0",
        Tags = new[] { "Calling", "ACS", "Windows" }
        }
    });

// Set up local video stream using the first camera enumerated
var deviceManager = await this.callClient.GetDeviceManagerAsync();
var mic = deviceManager?.Microphones?.FirstOrDefault();
micStream = new LocalOutgoingAudioStream();

callTokenRefreshOptions = new CallTokenRefreshOptions(false);
callTokenRefreshOptions.TokenRefreshRequested += OnTokenRefreshRequestedAsync;

var tokenCredential = new CallTokenCredential(authToken, callTokenRefreshOptions);

var callAgentOptions = new CallAgentOptions()
{
    DisplayName = "Contoso",
    //https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes/blob/master/all/all.csv
    EmergencyCallOptions = new EmergencyCallOptions() { CountryCode = "840" }
};


try
{
    this.callAgent = await this.callClient.CreateCallAgentAsync(tokenCredential, callAgentOptions);
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
```

### Start a call

Add the implementation to the `CallButton_Click` to start a call with the `callAgent` we created, and hook up call state event handler.

```C#
var callString = CalleeTextBox.Text.Trim();

if (!string.IsNullOrEmpty(callString))
{
    if (callString.StartsWith("8:")) // 1:1 ACS call
    {
        call = await StartAcsCallAsync(callString);
    }
    else if (callString.StartsWith("+")) // 1:1 phone call
    {
        call = await StartPhoneCallAsync(callString, "+12133947338");
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
```

Add the methods to start or join the different types of Call (1:1 ACS call, 1:1 phone call, ACS Group call, Teams meeting join, etc.).

```C#
private async Task<CommunicationCall> StartAcsCallAsync(string acsCallee)
{
    var options = await GetStartCallOptionsAsynnc();
    var call = await this.callAgent.StartCallAsync( new [] { new UserCallIdentifier(acsCallee) }, options);
    return call;
}

private async Task<CommunicationCall> StartPhoneCallAsync(string acsCallee, string alternateCallerId)
{
    var options = await GetStartCallOptionsAsynnc();
    options.AlternateCallerId = new PhoneNumberCallIdentifier(alternateCallerId);

    var call = await this.callAgent.StartCallAsync( new [] { new PhoneNumberCallIdentifier(acsCallee) }, options);
    return call;
}

private async Task<CommunicationCall> JoinGroupCallByIdAsync(Guid groupId)
{
    var joinCallOptions = await GetJoinCallOptionsAsync();

    var groupCallLocator = new GroupCallLocator(groupId);
    var call = await this.callAgent.JoinAsync(groupCallLocator, joinCallOptions);
    return call;
}

private async Task<CommunicationCall> JoinTeamsMeetingByLinkAsync(Uri teamsCallLink)
{
    var joinCallOptions = await GetJoinCallOptionsAsync();

    var teamsMeetingLinkLocator = new TeamsMeetingLinkLocator(teamsCallLink.AbsoluteUri);
    var call = await callAgent.JoinAsync(teamsMeetingLinkLocator, joinCallOptions);
    return call;
}

private async Task<StartCallOptions> GetStartCallOptionsAsynnc()
{
    return new StartCallOptions() {
        OutgoingAudioOptions = new OutgoingAudioOptions() { IsOutgoingAudioMuted = true, OutgoingAudioStream = micStream  },
        OutgoingVideoOptions = new OutgoingVideoOptions() { OutgoingVideoStreams = new OutgoingVideoStream[] { cameraStream } }
    };
}

private async Task<JoinCallOptions> GetJoinCallOptionsAsync()
{
    return new JoinCallOptions() {
        OutgoingAudioOptions = new OutgoingAudioOptions() { IsOutgoingAudioMuted = true },
        OutgoingVideoOptions = new OutgoingVideoOptions() { OutgoingVideoStreams = new OutgoingVideoStream[] { cameraStream } }
    };
}
```

### End a call

End the current call when the `Hang Up` button is clicked. Add the implementation to the HangupButton_Click to end a call with the callAgent we created, and tear down the call state event handler.

```C#
var call = this.callAgent?.Calls?.FirstOrDefault();
if (call != null)
{
    try
    {
        await call.HangUpAsync(new HangUpOptions() { ForEveryone = true });
    }
    catch(Exception ex) 
    {
    }
}
```

### Track call state

Stay notified about the state of current call. Add the implementation to the OnStateChangedAsync method

```C#
var call = sender as CommunicationCall;

if (call != null)
{
    var state = call.State;

    await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () =>
    {
        QuickstartTitle.Text = $"{Package.Current.DisplayName} - {state.ToString()}";
        Window.Current.SetTitleBar(AppTitleBar);

        HangupButton.IsEnabled = state == CallState.Connected || state == CallState.Ringing;
        CallButton.IsEnabled = !HangupButton.IsEnabled;
        MuteLocal.IsEnabled = !CallButton.IsEnabled;
    });

    switch (state)
    {
        case CallState.Connected:
            {
                break;
            }
        case CallState.Disconnected:
            {
                break;
            }
        default: break;
    }
}
```

### Run the code

You can build and run the code on Visual Studio. For solution platforms, we support `ARM64`, `x64` and `x86`. 

You can make an outbound call by providing a user ID in the text field and clicking the `Start Call` button. Calling `8:echo123` connects you with an echo bot, this feature is great for getting started and verifying your audio devices are working.

:::image type="content" source="../../media/windows/run-the-app.png" alt-text="Screenshot showing running the UWP quickstart app":::

## WinUI 3 sample code

You can download the sample app from [GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/CallingWinUI).

### Prerequisites

To complete this tutorial, you need the following prerequisites:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- Install [Visual Studio 2022](https://visualstudio.microsoft.com/downloads/) and [Windows App SDK version 1.2 preview 2](https://learn.microsoft.com/windows/apps/windows-app-sdk/preview-channel#version-12-preview-2-120-preview2). 
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

Right click over your project and go to `Manage Nuget Packages` to install `Azure.Communication.Calling.WindowsClient` [1.0.0](https://www.nuget.org/packages/Azure.Communication.Calling.WindowsClient/1.0.0) or superior.

#### Request access

:::image type="content" source="../../media/windows/request-access.png" alt-text="Screenshot showing requesting access to Internet and Microphone in Visual Studio.":::

#### Set up the app framework

We need to configure a basic layout to attach our logic. In order to place an outbound call, we need a `TextBox` to provide the User ID of the callee. We also need a `Start Call` button and a `Hang Up` button.
Open the `MainWindow.xaml` of your project and add the `Grid` node to your `Window`:

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
        </Grid>
        <StackPanel Grid.Row="2" Orientation="Horizontal">
            <Button x:Name="CallButton" Content="Start Call" Click="CallButton_Click" VerticalAlignment="Center" Margin="10,0,0,0" Height="40" Width="200"/>
            <Button x:Name="HangupButton" Content="Hang Up" Click="HangupButton_Click" VerticalAlignment="Center" Margin="10,0,0,0" Height="40" Width="200"/>
            <TextBlock x:Name="State" Text="Status" TextWrapping="Wrap" VerticalAlignment="Center" Margin="40,0,0,0" Height="40" Width="200"/>
        </StackPanel>
    </Grid>
</Window>
```

Open the `MainWindow.xaml.cs` and replace the content with following implementation: 
```C#
using Azure.Communication.Calling.WindowsClient;
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
        CommunicationCall call;
        DeviceManager deviceManager;

        public MainWindow()
        {
            this.InitializeComponent();
            Task.Run(() => this.InitCallAgentAndDeviceManagerAsync()).Wait();
        }

        private async Task InitCallAgentAndDeviceManagerAsync()
        {
            // Create and cache CallAgent and optionally fetch DeviceManager
        }

        private async void CallButton_Click(object sender, RoutedEventArgs e)
        {
            // Start call
        }

        private async void HangupButton_Click(object sender, RoutedEventArgs e)
        {
            // End call
        }

        private async void Call_OnStateChangedAsync(object sender, PropertyChangedEventArgs args)
        {
            // Update call state
        }
    }
}
```

### Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Calling SDK:

| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| `CallClient` | The `CallClient` is the main entry point to the Calling client library. |
| `CallAgent` | The `CallAgent` is used to start and join calls. |
| `CommunicationCall` | The `CommunicationCall` is used to manage placed or joined calls. |
| `CallTokenCredential` | The `CallTokenCredential` is used as the token credential to instantiate the `CallAgent`.|
| `CommunicationUserIdentifier` | The `CommunicationUserIdentifier` is used to represent the identity of the user, which can be one of the following options: `CommunicationUserIdentifier`, `PhoneNumberIdentifier` or `CallingApplication`. |

### Authenticate the client

Initialize a `CallAgent` instance with a User Access Token, which enables us to make and receive calls, and optionally obtain a DeviceManager instance to query for client device configurations.

In the following code, replace `<AUTHENTICATION_TOKEN>` with a User Access Token. Refer to the [user access token](../../../identity/access-tokens.md) documentation if you don't already have a token available.

Add the following code to the `InitCallAgentAndDeviceManagerAsync` function. 

```C#
var callClient = new CallClient();
this.deviceManager = await callClient.GetDeviceManagerAsync();

callTokenRefreshOptions = new CallTokenRefreshOptions(false);
callTokenRefreshOptions.TokenRefreshRequested += OnTokenRefreshRequestedAsync;

var tokenCredential = new CallTokenCredential("<AUTHENTICATION_TOKEN>");
var callAgentOptions = new CallAgentOptions()
{
    DisplayName = "<DISPLAY_NAME>"
};

this.callAgent = await callClient.CreateCallAgentAsync(tokenCredential, callAgentOptions);
this.callAgent.OnCallsUpdated += Agent_OnCallsUpdatedAsync;
this.callAgent.OnIncomingCall += Agent_OnIncomingCallAsync;
```

### Start a call

Add the implementation to the `CallButton_Click` to start a call with the `callAgent` we created, and hook up call state event handler.

```C#
var startCallOptions = new StartCallOptions();

var callees = new ICommunicationIdentifier[1]
{
    new CommunicationUserIdentifier(CalleeTextBox.Text.Trim())
};

this.call = await this.callAgent.StartCallAsync(callees, startCallOptions);
this.call.OnStateChanged += Call_OnStateChangedAsync;
```

### End a call

End the current call when the `Hang Up` button is clicked. Add the implementation to the HangupButton_Click to end a call with the callAgent we created, and tear down the call state event handler.

```C#
this.call.OnStateChanged -= Call_OnStateChangedAsync;
await this.call.HangUpAsync(new HangUpOptions());
```

### Track call state

Stay notified about the state of current call.

```C#
var state = (sender as Call)?.State;
this.DispatcherQueue.TryEnqueue(() => {
    State.Text = state.ToString();
});
```

### Run the code

You can build and run the code on Visual Studio. For solution platforms, we support `ARM64`, `x64` and `x86`. 

You can make an outbound call by providing a user ID in the text field and clicking the `Start Call` button. Calling `8:echo123` connects you with an echo bot, this feature is great for getting started and verifying your audio devices are working.

:::image type="content" source="../../media/windows/run-the-winui-app.png" alt-text="Screenshot showing running the WinUI quickstart app":::
