---
title: include file
description: include file
author: vicancy
ms.service: azure-signalr-service
ms.topic: include
ms.date: 12/11/2024
ms.author: lianwei
ms.custom: include file
---

> [!IMPORTANT]
> Raw connection strings appear in this article for demonstration purposes only.
>
> A connection string includes the authorization information required for your application to access Azure SignalR Service. The access key inside the connection string is similar to a root password for your service. In production environments, always protect your access keys. Use Azure Key Vault to manage and rotate your keys securely and [secure your connection string using Microsoft Entra ID](../concept-connection-string.md#use-microsoft-entra-id) and [authorize access with Microsoft Entra ID](../signalr-concept-authorize-azure-active-directory.md).
>
> Avoid distributing access keys to other users, hard-coding them, or saving them anywhere in plain text that is accessible to others. Rotate your keys if you believe they may have been compromised.
