---
author: baanders
description: include file for DefaultAzureCredential in Azure Digital Twins samples - note
ms.service: digital-twins
ms.topic: include
ms.date: 10/22/2020
ms.author: baanders
---

>[!NOTE]
> This sample uses [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential) (part of the `Azure.Identity` library) to authenticate users with the Azure Digital Twins instance when you run it on your local machine. With this type of authentication, the sample will search for Azure credentials within your local environment, such as a login from a local [Azure CLI](/cli/azure/install-azure-cli) or in Visual Studio/Visual Studio Code.
>
> For more on using `DefaultAzureCredential` and other authentication options, see [*How-to: Write app authentication code*](../articles/digital-twins/how-to-authenticate-client.md).