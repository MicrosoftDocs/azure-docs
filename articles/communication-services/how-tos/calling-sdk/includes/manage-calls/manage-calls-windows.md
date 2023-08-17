---
author: probableprime
ms.service: azure-communication-services
ms.topic: include
ms.date: 10/16/2022
ms.author: rifox
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-windows.md)]

### Request access to the microphone

The app requires access to the microphone to run properly. In UWP apps, the microphone capability should be declared in the app manifest file.

The following steps exemplify how to achieve that.

1. In the `Solution Explorer` panel, double click on the file with `.appxmanifest` extension.
2. Click on the `Capabilities` tab.
3. Select the `Microphone` check box from the capabilities list.

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

Add the following data members to the `MainPage` pr `MainWindow` class:
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
```

Change the `<AUTHENTICATION_TOKEN>` with a valid credential token for your resource. Refer to the [user access token](../../../../quickstarts/identity/access-tokens.md) documentation if a credential token has to be sourced.

## Create CallAgent and place a call

The objects needed for creating a `CallAgent` are now ready. It's time to asynchronously create `CallAgent` and place a call.

The following code should be added after handling the exception from the previous step.

```csharp
var startCallOptions = new StartCallOptions();
var callees = new [] { new UserCallIdentifier(CalleeTextBox.Text.Trim()) };

this.call = await this.callAgent.StartCallAsync(callees, startCallOptions);
this.call.nStateChanged += Call_OnStateChangedAsync;
```

Feel free to use `8:echo123` to talk to the Azure Communication Services echo bot.

## End a call

Once a call is placed, the `HangupAsync` method of the `CommunicationCall` object should be used to hang up the call.

An instance of `HangupOptions` should also be used to inform if the call must be terminated to all its participants.

The following code should be added inside `HangupButton_Click`.

```csharp
this.call.OnStateChanged -= Call_OnStateChangedAsync;
await this.call.HangUpAsync(new HangUpOptions() { ForEveryone = false });
```

## Run the code

Make sure Visual Studio builds the app for `x64`, `x86` or `ARM64`, then hit `F5` to start running the app. After that, click on the `Call` button to place a call to the callee defined.

Keep in mind that the first time the app runs, the system prompts user for granting access to the microphone.
