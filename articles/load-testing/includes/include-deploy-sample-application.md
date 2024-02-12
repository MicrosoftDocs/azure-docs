---
title: "Include file"
description: "Include file"
services: load-testing
author: ntrogh
ms.service: load-testing
ms.author: nicktrog
ms.custom: "include file"
ms.topic: "include"
ms.date: 09/19/2023
---

1. Open Windows PowerShell, sign in to Azure, and set the subscription:

   ```azurecli
   az login
   az account set --subscription <your-Azure-Subscription-ID>
   ```

1. Clone the sample application's source repo:

   ```powershell
   git clone https://github.com/Azure-Samples/nodejs-appsvc-cosmosdb-bottleneck.git
   ```

   The sample application is a Node.js app that consists of an Azure App Service web component and an Azure Cosmos DB database. The repo includes a PowerShell script that deploys the sample app to your Azure subscription. It also has an Apache JMeter script that you'll use in later steps.

1. Go to the Node.js app's directory and deploy the sample app by using this PowerShell script:

   ```powershell
   cd nodejs-appsvc-cosmosdb-bottleneck
   .\deploymentscript.ps1
   ```

   > [!TIP]
   > You can install PowerShell on [Linux/WSL](/powershell/scripting/install/installing-powershell-on-linux) or [macOS](/powershell/scripting/install/installing-powershell-on-macos).
   >
   > After you install it, you can run the previous command as `pwsh ./deploymentscript.ps1`.

1. At the prompt, provide:

   * Your Azure subscription ID.
   * A unique name for your web app.
   * A location. By default, the location is `eastus`. You can get region codes by running the [Get-AzLocation](/powershell/module/az.resources/get-azlocation) command.

   > [!IMPORTANT]
   > For your web app's name, use only lowercase letters and numbers. Don't use spaces or special characters.

1. After deployment finishes, go to the running sample application by opening `https://<yourappname>.azurewebsites.net` in a browser window.
