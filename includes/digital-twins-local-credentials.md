---
author: baanders
description: include file for setting up local authentication for DefaultAzureCredential in Azure Digital Twins samples
ms.service: digital-twins
ms.topic: include
ms.date: 10/22/2020
ms.author: baanders
---

### Set up local Azure credentials

This sample uses [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential?preserve-view=true&view=azure-dotnet) (part of the `Azure.Identity` library) to authenticate users with the Azure Digital Twins instance when you run it on your local machine. For more on different ways a client app can authenticate with Azure Digital Twins, see [*How-to: Write app authentication code*](../articles/digital-twins/how-to-authenticate-client.md).

With this type of authentication, the sample will search for credentials within your local environment, such as an Azure login in a local [Azure CLI](/cli/azure/install-azure-cli?view=azure-cli-latest&preserve-view=true) or in Visual Studio/Visual Studio Code. This means that you should **log into Azure locally** through one of these mechanisms to set up credentials for the ADT Explorer app.

If you're using Visual Studio or Visual Studio Code to run the code sample, ensure that you're logged into that IDE using the same Azure credentials that you want to use to access your Azure Digital Twins instance.

Otherwise, you can [install the local **Azure CLI**](/cli/azure/install-azure-cli?view=azure-cli-latest&preserve-view=true), start a command prompt on your machine, and run the `az login` command to log into your Azure account.