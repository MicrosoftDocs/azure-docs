---
author: baanders
description: include file for setting up local authentication for DefaultAzureCredential in Azure Digital Twins samples - with intro
ms.service: azure-digital-twins
ms.topic: include
ms.date: 08/15/2025
ms.author: baanders
---

### Set up local Azure credentials

This sample uses [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential?view=azure-dotnet&preserve-view=true) (part of the `Azure.Identity` library) to authenticate with the Azure Digital Twins instance when you run the sample on your local machine. `DefaultAzureCredential` is one of many authentication options. For more information about the different ways a client app can authenticate with Azure Digital Twins, see [Write app authentication code](../how-to-authenticate-client.md).

[!INCLUDE [Azure Digital Twins: local credentials prereq (inner)](digital-twins-local-credentials-inner.md)]