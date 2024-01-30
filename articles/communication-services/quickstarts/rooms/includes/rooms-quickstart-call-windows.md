---
title: include file
description: include file
services: azure-communication-services
author: mrayyan
manager: alexokun

ms.service: azure-communication-services
ms.date: 07/20/2023
ms.topic: include
ms.custom: include file
ms.author: t-siddiquim
---

## Join a room call

To join a room call, set up your windows application using the [Add video calling to your client app](../../voice-video-calling/get-started-with-video-calling.md?pivots=platform-windows) guide. Alternatively, you can download the video calling quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/Calling).


Create a `callAgent` with a valid user token:
```csharp

var creds = new CallTokenCredential("<user-token>");

CallAgentOptions callAgentOptions = new CallAgentOptions();
callAgentOptions.DisplayName = "<display-name>";
callAgent = await callClient.CreateCallAgentAsync(creds, callAgentOptions);

```

Use the `callAgent` and `RoomCallLocator` to join a room call, the `CallAgent.JoinAsync` method will return a `CommunicationCall` object:

```csharp

RoomCallLocator roomCallLocator = new RoomCallLocator('<RoomId>');

CommunicationCall communicationCall = await callAgent.JoinAsync(roomCallLocator, joinCallOptions);

```

Subscribe to `CommunicationCall` events to get updates:

```csharp
private async void CommunicationCall_OnStateChanged(object sender, PropertyChangedEventArgs args) {
	var call = sender as CommunicationCall;
	if (sender != null)
	{
		switch (call.State){
			// Handle changes in call state
		}
	}
}
		
```

To display the role of call participants, subscribe to the role changes:

```csharp
private void RemoteParticipant_OnRoleChanged(object sender, Azure.Communication.Calling.WindowsClient.PropertyChangedEventArgs args)
{
    _ = Windows.ApplicationModel.Core.CoreApplication.MainView.CoreWindow.Dispatcher.RunAsync(CoreDispatcherPriority.Normal, () =>
    {
        System.Diagnostics.Trace.WriteLine("Raising Role change, new Role: " + remoteParticipant_.Role);
        PropertyChanged(this, new System.ComponentModel.PropertyChangedEventArgs("RemoteParticipantRole"));
    });
}

```

The ability to join a room call and display the roles of call participants is available in the Windows NuGet Release [version 1.1.0](https://www.nuget.org/packages/Azure.Communication.Calling.WindowsClient/1.1.0) and above.

You can learn more about roles of room call participants in the [rooms concept documentation](../../../concepts/rooms/room-concept.md#predefined-participant-roles-and-permissions).
