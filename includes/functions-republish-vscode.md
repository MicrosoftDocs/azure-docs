---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 05/20/2020
ms.author: glenga
---
1. In Visual Studio Code, select F1 to open the command palette. In the command palette, search for and select **Azure Functions: Deploy to function app**.

1. If you're not signed in, you're prompted to **Sign in to Azure**. After you sign in from the browser, go back to Visual Studio Code. If you have multiple subscriptions, **Select a subscription** that contains your function app.

1. Select your existing function app in Azure. When you're warned about overwriting all files in the function app, select **Deploy** to acknowledge the warning and continue.

The project is rebuilt, repackaged, and uploaded to Azure. The existing project is replaced by the new package, and the function app restarts.