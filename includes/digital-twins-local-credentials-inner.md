---
author: baanders
description: include file for setting up local authentication for DefaultAzureCredential in Azure Digital Twins samples - without intro
ms.service: digital-twins
ms.topic: include
ms.date: 10/22/2020
ms.author: baanders
---

With `DefaultAzureCredential`, the sample will search for credentials in your local environment, like an Azure sign-in in a local [Azure CLI](/cli/azure/install-azure-cli?view=azure-cli-latest&preserve-view=true) or in Visual Studio or Visual Studio Code. For this reason, you should **sign in to Azure locally** through one of these mechanisms to set up credentials for the sample.

If you're using Visual Studio or Visual Studio Code to run the code sample, make sure you're signed in to that editor with the same Azure credentials that you want to use to access your Azure Digital Twins instance.

Otherwise, you can [install the local Azure CLI](/cli/azure/install-azure-cli?view=azure-cli-latest&preserve-view=true), start a command prompt on your machine, and run the `az login` command to sign in to your Azure account. After you sign in, when you run your code sample, it should log you in automatically.