---
author: baanders
description: include file for setting up local authentication for DefaultAzureCredential in Azure Digital Twins samples - with intro
ms.service: digital-twins
ms.topic: include
ms.date: 10/22/2020
ms.author: baanders
---

### Set up local Azure credentials

This sample uses [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential?view=azure-dotnet&preserve-view=true) (part of the `Azure.Identity` library) to authenticate users with the Azure Digital Twins instance when you run it on your local machine. For more information on different ways a client app can authenticate with Azure Digital Twins, see [Write app authentication code](../articles/digital-twins/how-to-authenticate-client.md).

[!INCLUDE [Azure Digital Twins: local credentials prereq (inner)](digital-twins-local-credentials-inner.md)]