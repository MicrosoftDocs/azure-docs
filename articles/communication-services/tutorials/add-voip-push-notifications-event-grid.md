---
title: Using Event Grid Notifications to send VOIP push payload to ANH.
titleSuffix: Azure Communication Services and Event Grid. 
description: Using Event Grid Notification from Azure Communication Services Native Calling to Incoming VOIP payload to devices via ANH. 
author: raosanat
ms.service: azure-communication-services
ms.topic: tutorial
ms.date: 07/25/2023
ms.author: sanathr
---

# Deliver VOIP Push Notification to Devices without ACS Calling SDK

This tutorial explains how to deliver VOIP push notifications to native applications without using the Azure Communication Services register push notifications API [here](../how-tos/calling-sdk/push-notifications.md).

## Current Limitations
The current limitations of using the ACS Native Calling SDK are that 
 * There's a 24-hour limit after the register push notification API is called when the device token information is saved. After 24 hours, the device endpoint information is deleted. Any incoming calls on those devices will not be delivered to the devices if those devices don't call the register push notification API again.
 * Can't deliver push notifications using Baidu or any other notification types supported by Azure Notification Hub but not yet supported in the ACS SDK.

## Setup for listening the events from Event Grid Notification
To listen to the `Microsoft.Communication.IncomingCall` event from Event Grid notifications of the Azure Communication Calling resource in Azure.
1. Azure functions with APIs
    1. Save device endpoint information.
    2. Delete device endpoint information.
    3. Get device endpoint information for a given `CommunicationIdentifier`.
2. Azure function API with EventGridTrigger that listens to the `Microsoft.Communication.IncomingCall` event from the Azure Communication resource.
3. Some kind of database like MongoDb to save the device endpoint information.
4. Azure Notification Hub to deliver the VOIP notifications.

## Steps to deliver the Push Notifications
Here are the steps to deliver the push notification:
1. Instead of calling the API `CallAgent.registerPushNotifications` with device token when the application starts, send the device token to the Azure function app.
2. When there's an incoming call for an ACS user, Azure Communication calling resource will trigger the `EventGridTrigger` Azure function API with the incoming call payload.
3. Get all the device token information from the database.
4. Convert the payload to how the VOIP push notification payload is by `PushNotificationInfo.fromDictionary` API like in iOS SDK.
5. Send the push payload using the REST API provided by Azure Notification Hub.
6. VOIP push is successfully delivered to the device and `CallAgent.handlePush` API should be called.

## Sample
Code sample is provided [here](https://github.com/Azure-Samples/communication-services-ios-quickstarts/tree/main/add-calling-push-notifications-event-grid).
