---
author: probableprime
ms.service: azure-communication-services
ms.topic: include
ms.date: 06/05/2025
ms.author: micahvivion
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-windows.md)]

## Implement the sample app in Visual Studio

This section describes how to develop the app to manage calls working in Visual Studio.

### Request access to the microphone

The app requires access to the microphone. In Universal Windows Platform (UWP) apps, the microphone capability must be declared in the app manifest file.

To access the microphone:

1. In the `Solution Explorer` panel, double click on the file with `.appxmanifest` extension.
2. Click on the `Capabilities` tab.
3. Select the `Microphone` check box from the capabilities list.

### Create UI buttons to place and hang up the call

This sample app contains two buttons. One for placing the call and another to hang up a placed call.

Add two buttons to the app.

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

### Set up the app with Calling SDK APIs

The Calling SDK APIs are in two different namespaces.

The following steps inform the C# compiler about these namespaces, enabling Visual Studio's Intellisense to help with code development.

1. In the `Solution Explorer` panel, click on the arrow on the left side of the file named `MainPage.xaml` for UWP, or `MainWindows.xaml` for WinUI 3.
2. Double click on file named `MainPage.xaml.cs` or `MainWindows.xaml.cs`.
3. Add the following commands at the bottom of the current `using` statements.

```csharp
using Azure.Communication.Calling.WindowsClient;
```

Keep `MainPage.xaml.cs` or `MainWindows.xaml.cs` open. The next steps add more code.

## Enable app interactions

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

| Name | Description |
| --- | --- |
| `CallClient` | The `CallClient` is the main entry point to the Calling client library. |
| `CallAgent` | The `CallAgent` is used to start and join calls. |
| `CommunicationCall` | The `CommunicationCall` is used to manage placed or joined calls. |
| `CommunicationTokenCredential` | The `CommunicationTokenCredential` is used as the token credential to instantiate the `CallAgent`.|
| `CallAgentOptions` | The `CallAgentOptions` contains information to identify the caller. |
| `HangupOptions` | The `HangupOptions` informs if a call should be terminated to all its participants. |

## Initialize the CallAgent

To create a `CallAgent` instance from `CallClient`, you must use `CallClient.CreateCallAgentAsync` method that asynchronously returns a `CallAgent` object once it's initialized.

To create `CallAgent`, you must pass a `CallTokenCredential` object and a `CallAgentOptions` object. Keep in mind that `CallTokenCredential` throws if a malformed token is passed.

To call during app initialization, add the following code inside and helper function.

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

Change the `<AUTHENTICATION_TOKEN>` with a valid credential token for your resource. If you need to source a credential token, see [user access token](../../../../quickstarts/identity/access-tokens.md).

## Create CallAgent and place a call

The objects you need to create a `CallAgent` are now ready. It's time to asynchronously create `CallAgent` and place a call.

Add the following code after handling the exception from the previous step.

```csharp
var startCallOptions = new StartCallOptions();
var callees = new [] { new UserCallIdentifier(CalleeTextBox.Text.Trim()) };

this.call = await this.callAgent.StartCallAsync(callees, startCallOptions);
this.call.OnStateChanged += Call_OnStateChangedAsync;
```

Use `8:echo123` to talk to the Azure Communication Services echo bot.

## Mute and unmute

To mute or unmute the outgoing audio, use the `MuteOutgoingAudioAsync` and `UnmuteOutgoingAudioAsync` asynchronous operations:

```csharp
// mute outgoing audio
await this.call.MuteOutgoingAudioAsync();

// unmute outgoing audio
await this.call.UnmuteOutgoingAudioAsync();
```

## Mute other participants

> [!NOTE]
> Use the Azure Communication Services Calling Windows SDK version 1.9.0 or higher. 

When a PSTN participant is muted, they must receive an announcement that they have been muted and that they can press a key combination (such as **\*6**) to unmute themselves. When they press **\*6**, they must be unmuted.

To mute all other participants or mute a specific participant, use the asynchronous operations `MuteAllRemoteParticipantsAsync` on the call and `MuteAsync` on the remote participant:

```csharp
// mute all participants except yourself
await this.call.MuteAllRemoteParticipantsAsync();

// mute specific participant in the call
await this.call.RemoteParticipants.FirstOrDefault().MuteAsync();
```

To notify the local participant that they're muted by others, subscribe to the `MutedByOthers` event.

## End a call

Once a call is placed, use the `HangupAsync` method of the `CommunicationCall` object to hang up the call.

Use an instance of `HangupOptions` to inform all participants if the call must be terminated.

Add the following code inside `HangupButton_Click`:

```csharp
this.call.OnStateChanged -= Call_OnStateChangedAsync;
await this.call.HangUpAsync(new HangUpOptions() { ForEveryone = false });
```

## Run the code

1. Make sure Visual Studio builds the app for `x64`, `x86` or `ARM64`.
2. Press **F5** to start running the app.
3. Once the app is running, click the **Call** button to place a call to the defined recipient.

The first time the app runs, the system prompts the user to grant access to the microphone.
