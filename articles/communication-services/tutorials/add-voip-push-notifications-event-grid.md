---
author: raosanat
ms.service: azure-communication-services
ms.topic: include
ms.date: 07/25/2023
ms.author: raosanat
---

[!INCLUDE [Event Grid event source for voice and video calling events](../../articles/event-grid/communication-services-voice-video-events.md)]

# Deliver Voip Push Notification to Devices without ACS Calling SDK

This tutorial explains how to get VOIP push notifications delivered to Native applications without using the Azure Communcation services register push notifications API [!INCLUDE [here](./how-tos/calling-sdk/push-notifications.md)].

## Current Limitations
Currently there are following limitations in using the ACS Native Calling SDK :
1. There is a 24 hour limit after the register push notification API is called is when the device token informations is saved. After 24 hours the device endpoint information is deleted. Any incoming calls on those devices won't be delivered
   to the devices if those device do not call the register push notification API again.
2. Deliver push using Baidu or any other notification types supported by Azure Notification Hub but not yet supported in the ACS SDK.

## Setup for listening the events from Event Grid Notification
To get around the above limitation we can listen to `Microsoft.Communication.IncomingCall` event from Event Grid notifications of the Azure Communication Calling resource in Azure.
Following services will be required :
1. Azure functions with API's
   1. Save Device Endpoint information - Saves the infomation about device token, `CoummunicationIdentifier` and unique device UUID.
   2. Delete Device Endpoint information.
   3. Get Device Endpoint information for a give `CoummunicationIdentifier`.
2. Azure function API with `EventGridTrigger` should listen to `Microsoft.Communication.IncomingCall` event from the Azure Communication resource.
3. Some kind of a database like MongoDb to save the Device endpoint information.
4. Azure Notification Hub to deliver the VOIP notifications.

## Steps to deliver the Push Notifications
Following is the order of steps to deliver the push notification.
1. When the application starts instead of calling the API `CallAgent.registerPushNotifications` with device token. Send the device token to the Azure function app.
2. When there is an incoming call to be sent to the user, the EventGridTrigger Azure function API wil be trigger with the incoming call payload.
3. Get all the device token information from the database.
4. Convert the payload to how the VOIP push notification payload is expected by `PushNotificationInfo.fromDictionary` like in iOS SDK.
5. Send the push payload using the REST API provided by Azure Notification Hub.
6. VOIP push is successfully delivered to the device and `CallAgent.handlePush` API should be called.

## Sample
Code sample for this is provided here. 
