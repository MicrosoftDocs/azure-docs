---
author: raosanat
ms.service: azure-communication-services
ms.topic: include
ms.date: 07/25/2023
ms.author: raosanat
---

[!INCLUDE [Event Grid event source for voice and video calling events](../../articles/event-grid/communication-services-voice-video-events.md)]

# Deliver Voip Push Notification to Devices without ACS Calling SDK

This tutorial explains how to deliver VOIP push notifications to native applications without using the Azure Communication Services register push notifications API [!INCLUDE [here](./how-tos/calling-sdk/push-notifications.md)].

## Current Limitations
The current limitations of using the ACS Native Calling SDK are that 
 1. There is a 24-hour limit after the register push notification API is called when the device token information is saved. After 24 hours, the device endpoint information is deleted. Any incoming calls on those devices won’t be delivered to the devices if those devices do not call the register push notification API again.
 2. Cannot deliver push notifications using Baidu or any other notification types supported by Azure Notification Hub but not yet supported in the ACS SDK.

## Setup for listening the events from Event Grid Notification
To listen to the `Microsoft.Communication.IncomingCall` event from Event Grid notifications of the Azure Communication Calling resource in Azure.
1. Azure functions with APIs
    1. Save device endpoint information
    2. Delete device endpoint information
    3. Get device endpoint information for a given `CommunicationIdentifier`.
2. Azure function API with EventGridTrigger that listens to the `Microsoft.Communication.IncomingCall` event from the Azure Communication resource.
3. Some kind of database like MongoDb to save the device endpoint information.
4. Azure Notification Hub to deliver the VOIP notifications.

## Steps to deliver the Push Notifications
Here are the steps to deliver the push notification:
1. Instead of calling the API `CallAgent.registerPushNotifications` with device token when the application starts, send the device token to the Azure function app.
2. When there is an incoming call to be sent to the user, the `EventGridTrigger` Azure function API will be triggered with the incoming call payload.
3. Get all the device token information from the database.
4. Convert the payload to how the VOIP push notification payload is expected by `PushNotificationInfo.fromDictionary` like in iOS SDK.
5. Send the push payload using the REST API provided by Azure Notification Hub.
6. VOIP push is successfully delivered to the device and `CallAgent.handlePush` API should be called.

## Sample
Code sample for this is provided here. 
