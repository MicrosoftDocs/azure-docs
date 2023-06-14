---
author: baanders
description: include file for setting up local authentication for DefaultAzureCredential in Azure Digital Twins samples - without intro
ms.service: digital-twins
ms.topic: include
ms.date: 10/22/2020
ms.author: baanders
---

With `DefaultAzureCredential`, the sample will search for credentials in your local environment, like an Azure sign-in in a local [Azure CLI](/cli/azure/install-azure-cli) or in Visual Studio or Visual Studio Code. For this reason, you should *sign in to Azure locally* through one of these mechanisms to set up credentials for the sample.

If you're using Visual Studio or Visual Studio Code to run code samples, make sure you're [signed in to that editor](/visualstudio/ide/signing-in-to-visual-studio) with the same Azure credentials that you want to use to access your Azure Digital Twins instance. If you're using a local CLI window, run the `az login` command to sign in to your Azure account. After this, when you run your code sample, you should be authenticated automatically. 