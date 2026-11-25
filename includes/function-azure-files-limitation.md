---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 04/18/2025
ms.author: glenga
---

Azure Files is an example of a service that doesn't yet support Microsoft Entra authentication for Server Message Block (SMB) file shares. Azure Files is the default file system for Windows deployments on Premium and Consumption plans. You might remove Azure Files entirely from your app. However, this introduces specific limitations in your app, including scaling limitations. 

To continue using Azure Files, you should at least store the connection string credential in [Azure Key Vault](/azure/key-vault/general/overview). That way, the secret is centrally managed, including key rotations. Your app must use a managed identity when accessing the connection string from Key Vault. 