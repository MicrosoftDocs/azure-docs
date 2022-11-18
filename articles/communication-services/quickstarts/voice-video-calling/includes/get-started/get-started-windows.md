---
author: probableprime
ms.service: azure-communication-services
ms.topic: include
ms.date: 03/10/2021
ms.author: rifox
---

In this quickstart, you'll learn how to start a call using the Azure Communication Services Calling SDK for Windows.

## UWP sample code

You can download the sample app from [GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/Calling).

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
Check `Internet (Client & Server)` to gain inbound and outbound access to the Internet. Check `Microphone` to access the audio feed of the microphone. 

:::image type="content" source="../../media/windows/request-access.png" alt-text="Screenshot showing requesting access to Internet and Microphone in Visual Studio.":::

#### Set up the app framework

We need to configure a basic layout to attach our logic. In order to place an outbound call we need a `TextBox` to provide the User ID of the callee. We also need a `Start Call` button and a `Hang Up` button. 
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

Open to `App.xaml.cs` (right click and choose View Code) and add this line to the top:
```C#
using CallingQuickstart;
```

Open the `MainPage.xaml.cs` and replace the content with following implementation: 
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

        public MainPage()
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

The following classes and interfaces handle some of the major features of the Azure Communication Services Calling SDK:

| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| CallClient | The CallClient is the main entry point to the Calling SDK.|
| CallAgent | The CallAgent is used to start and manage calls. |
| CommunicationTokenCredential | The CommunicationTokenCredential is used as the token credential to instantiate the CallAgent.| 
| CommunicationUserIdentifier | The CommunicationUserIdentifier is used to represent the identity of the user which can be one of the following: CommunicationUserIdentifier/PhoneNumberIdentifier/CallingApplication. |

### Authenticate the client

Initialize a `CallAgent` instance with a User Access Token which will enable us to make and receive calls, and optionally obtain a DeviceManager instance to query for client device configurations.

In the following code, replace `<AUTHENTICATION_TOKEN>` with a User Access Token. Refer to the [user access token](../../../access-tokens.md) documentation if you don't already have a token available.

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
```

### Start a call

Add the implementation to the `CallButton_Click` to start a call with the `callAgent` we created, and hook up call state event handler.

```C#
var startCallOptions = new StartCallOptions();

var callees = new ICommunicationIdentifier[1] { new CommunicationUserIdentifier(CalleeTextBox.Text.Trim()) };

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
await this.Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () => {
    State.Text = state.ToString();
});
```

### Run the code

You can build and run the code on Visual Studio. Please note that for solution platforms we support `ARM64`, `x64` and `x86`. 

You can make an outbound call by providing a user ID in the text field and clicking the `Start Call` button. Calling `8:echo123` connects you with an echo bot, this is great for getting started and verifying your audio devices are working.

:::image type="content" source="../../media/windows/run-the-app.png" alt-text="Screenshot showing running the UWP quickstart app":::


## WinUI 3 sample code

You can download the sample app from [GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/CallingWinUI).

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

#### Set up the app framework

We need to configure a basic layout to attach our logic. In order to place an outbound call we need a `TextBox` to provide the User ID of the callee. We also need a `Start Call` button and a `Hang Up` button. 
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
| CallClient | The CallClient is the main entry point to the Calling SDK.|
| CallAgent | The CallAgent is used to start and manage calls. |
| CommunicationTokenCredential | The CommunicationTokenCredential is used as the token credential to instantiate the CallAgent.| 
| CommunicationUserIdentifier | The CommunicationUserIdentifier is used to represent the identity of the user which can be one of the following: CommunicationUserIdentifier/PhoneNumberIdentifier/CallingApplication. |

### Authenticate the client

Initialize a `CallAgent` instance with a User Access Token which will enable us to make and receive calls, and optionally obtain a DeviceManager instance to query for client device configurations.

In the following code, replace `<AUTHENTICATION_TOKEN>` with a User Access Token. Refer to the [user access token](../../../access-tokens.md) documentation if you don't already have a token available.

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

You can build and run the code on Visual Studio. Please note that for solution platforms we support `ARM64`, `x64` and `x86`. 

You can make an outbound call by providing a user ID in the text field and clicking the `Start Call` button. Calling `8:echo123` connects you with an echo bot, this is great for getting started and verifying your audio devices are working.

:::image type="content" source="../../media/windows/run-the-winui-app.png" alt-text="Screenshot showing running the WinUI quickstart app":::
