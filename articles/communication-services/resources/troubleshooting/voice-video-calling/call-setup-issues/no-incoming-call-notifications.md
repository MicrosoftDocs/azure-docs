---
title: Call setup issues - The user doesn't receive incoming call notifications
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to troubleshoot when the user doesn't receive incoming call notifications.
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 04/10/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# The user doesn't receive incoming call notifications
If the user isn't receiving incoming call notifications, it may be due to an issue with their network.
Normally, when an incoming call is received, the application should receive an `incomingCall` event through the signaling connection.
However, if the user's network is experiencing problems, such as disconnection or firewall issues, they may not be able to receive this notification.

## How to detect using the SDK
The application can listen the [connectionStateChanged event](/javascript/api/azure-communication-services/@azure/communication-calling/callagent?view=azure-communication-services-js&preserve-view=true#@azure-communication-calling-callagent-on-2) on callAgent object.
If the connection state isn't `Connected`, the user can't receive incoming call notifications.

## How to mitigate or resolve
This error happens when the signaling connection fails.
The application can listen for the `connectionStateChanged` event and display a warning message when the connection state isn't `Connected`.
It could be because the token is expired. The app should fix this issue if it receives tokenExpired event.
Other reasons, such as network issues, users should check their network to see if the disconnection is due to poor connectivity or other network issues.
