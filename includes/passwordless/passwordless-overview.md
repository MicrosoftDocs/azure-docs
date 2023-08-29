---
title: "include file"
description: "include file"
services: storage
author: alexwolfmsft
ms.service: azure-storage
ms.topic: include
ms.date: 09/09/2022
ms.author: alexwolf
ms.custom: include file
---

Application requests to most Azure services must be authorized. Using the `DefaultAzureCredential` class provided by the Azure Identity client library is the recommended approach for implementing passwordless connections to Azure services in your code.

You can also authorize requests to Azure services using passwords, connection strings, or other credentials directly. However, this approach should be used with caution. Developers must be diligent to never expose these secrets in an unsecure location. Anyone who gains access to the password or secret key is able to authenticate. `DefaultAzureCredential` offers improved management and security benefits over the account key to allow passwordless authentication. Both options are demonstrated in the following example.