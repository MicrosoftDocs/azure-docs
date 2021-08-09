---
title: Quickstart - Add calling to an Windows app using Azure Communication Services
description: In this quickstart, you learn how to use the Azure Communication Services Calling SDK for Windows.
author: tophpalmer
ms.author: mikben
ms.date: 06/30/2021
ms.topic: quickstart
ms.service: azure-communication-services
---

In this quickstart, you'll learn how to start a call using the Azure Communication Services Calling SDK for Windows.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../../create-communication-resource.md).
- A `User Access Token` to enable the call client. For more information on [how to get a `User Access Token`](../../../access-tokens.md)
- Any edition of [Visual Studio 2019](https://visualstudio.microsoft.com/downloads/) with the `Universal Windows Platform development` workload alongside with Windows SDK `10.0.17134` or greater installed. Additionally, the `NuGet package manager` and `NuGet targets and build tasks` components should also be installed.
- Optional: Complete the quick start for [getting started with adding calling to your application](../../getting-started-with-calling.md)

## Setting up

### Creating the Visual Studio project

In Visual Studio 2019, create a new `Blank App (Universal Windows)` project. After entering the project name, feel free to pick any Windows SDK greater than `10.0.17134`. 

### Install the package and dependencies with NuGet Package Manager

Tha Calling SDK APIs and libraries are publicly available via a NuGet package.
The following steps exemplify how to find, download, and install the Calling SDK NuGet package.

1. Open NuGet Package Manager (`Tools` -> `NuGet Package Manager` -> `Manage NuGet Packages for Solution`)
2. Click on `Browse` and then type `Azure.Communication.Calling` in the search box.
3. Make sure that `Include prerelease` check box is selected.
4. Click on the `Azure.Communication.Calling` package.
5. Select the checkbox corresponding to the CS project on the right-side tab.
6. Click on the `Install` button.


### Request access to the microphone

The app will require access to the microphone to run properly. In UWP apps, the microphone capability should be declared in the app manifest file. 
he following steps exemplify how to achieve that.

1. In the `Solution Explorer` panel, double click on the file with `.appxmanifest` extension.
2. Click on the `Capabilities` tab.
3. Select the `Microphone` check box from the capabilities list.


### Create UI buttons to place and hang up the call

This simple sample app will contain two buttons. One for placing the call and another to hang up a placed call.
The following steps exemplify how to add these buttons to the app.

1. In the `Solution Explorer` panel, double click on the file named `MainPage.xaml`.
2. In the central panel, look for the XMAL code under the UI preview.
3. Replace the `<Grid>` to `</Grid>` XAML code by the following excerpt:
```xml
<StackPanel Orientation="Horizontal" VerticalAlignment="Center" HorizontalAlignment="Center">
    <Button x:Name="callButton" Click="CallHandler" Margin="10,10,10,10" HorizontalAlignment="Stretch" VerticalAlignment="Stretch">Call</Button>
    <Button x:Name="hangupButton" Click="HangupHandler" Margin="10,10,10,10" HorizontalAlignment="Stretch" VerticalAlignment="Stretch">Hang up</Button>
</StackPanel>
```

### Setting up the app with Calling SDK APIs

The Calling SDK APIs are in two different namespaces.
The following steps inform the C# compiler about these namespaces allowing Visual Studio's Intellisense to assist with code development.

1. In the `Solution Explorer` panel, click on the arrow on the left side of the file named `MainPage.xaml`.
2. Double click on file named `MainPage.xaml.cs` which showed up.
3. Add the following commands at the bottom of the current `using` statements.

```csharp
using Azure.Communication;
using Azure.Communication.Calling;
```

Please keep `MainPage.xaml.cs` open. The next steps will add more code to it.

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

## Allow app interactions

The UI buttons previously added need to operate on top of a placed `Call`. It means that a `Call` data member should be added to the `MainPage` class.
Additionally, to allow the asynchronous operation creating `CallAgent` to succeed, a `CallAgent` data member should also be added to the same class.

Please add the following data members to the `MainPage` class:
```csharp
CallAgent agent_;
Call call_;
```

## Create button handlers

Previously, two UI buttons were added to the XAML code. The following code adds the handlers to be executed when an user click on the button.
The following code should be added after the data members from the previous section.

```csharp
private void CallHandler(object sender, RoutedEventArgs e)
{
}

private void HangupHandler(object sender, RoutedEventArgs e)
{
}
```

## Initialize the CallAgent

To create a `CallAgent` instance from `CallClient` you must use `CallClient.CreateCallAgent` method that asynchronously returns a `CallAgent` object once it is initialized.

To create `CallAgent`, you must pass a `CommunicationTokenCredential` object and a `CallAgentOptions` object. Keep in mind that `CommunicationTokenCredential` throws if a malformed token is passed.

The following code should be added inside `CallHandler`.

```csharp
CallClient client = new CallClient();
CommunicationTokenCredential creds;

CallAgentOptions callAgentOptions = new CallAgentOptions
{
  DisplayName = "<CALLER NAME>"
};

try
{
    creds = new CommunicationTokenCredential("<CREDENTIAL TOKEN>");
}
catch (Exception)
{
    throw new Exception("Invalid credential token");
}
```

`<USER ACCESS TOKEN>` must be replaced by a valid credential token for your resource. Refer to the [user access token](../../../../quickstarts/access-tokens.md) documentation if a credential token has to be sourced.

## Create CallAgent and place a call

The objects needed for creating a `CallAgent` are now ready. It is time to asynchronously create `CallAgent` and place a call.

The following code should be added after handling the exception from the previous step.

```csharp
client.CreateCallAgent(creds, callAgentOptions).Completed +=
async (IAsyncOperation<CallAgent> asyncInfo, AsyncStatus asyncStatus) =>
{
    agent_ = asyncInfo.GetResults();

    CommunicationUserIdentifier target = new CommunicationUserIdentifier("<CALLEE>");

    StartCallOptions startCallOptions = new StartCallOptions();
    call_ = await agent_.StartCallAsync(new List<ICommunicationIdentifier>() { target }, startCallOptions);
};
```

Replace `<CALLEE>` with any other identity from your tenant. Alternatively, feel free to use `8:echo123` to talk to the ACS echo bot.

## End a call

Once a call is placed, the `Hangup` method of the `Call` object should be used to hang up the call.

An instance of `HangupOptions` should also be used to inform if the call must be terminated to all its participants.

The following code should be added inside `HangupHandler`.

```csharp
HangUpOptions hangupOptions = new HangUpOptions();
call_.HangUpAsync(hangupOptions).Completed +=
(IAsyncAction asyncInfo, AsyncStatus asyncStatus) =>
{
};
```

## Run the code

Make sure Visual Studio will build the app for `x64`, `x86` or `ARM64`, then hit `F5` to start running the app. After that, click on the `Call` button to place a call to the callee defined.

Keep in mind that the first time the app runs, the system will prompt user for granting access to the microphone.
