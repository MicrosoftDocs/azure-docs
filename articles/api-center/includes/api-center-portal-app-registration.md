---
title: Include file
description: Include file
services: api-center
author: dlepow

ms.service: azure-api-center
ms.topic: include
ms.date: 05/28/2025
ms.author: danlep
ms.custom: Include file
---

First configure an app registration in your Microsoft Entra ID tenant. The app registration enables the API Center portal to access data from your API center on behalf of a signed-in user.

API Center can set up the app registration automatically, or you can create the app registration manually. 

#### Set up the app registration automatically

To set up the app registration automatically, follow these steps:

1. In the [Azure portal](https://portal.azure.com), navigate to your API center.
1. In the left-hand menu, select **API Center portal** > **Settings**.
1. On the **Identity provider** tab, select **Start set up**.
1. Select **Save + publish**.

#### Set up the app registration manually

If you want to create the app registration manually, follow these steps:

1. In the [Azure portal](https://portal.azure.com), navigate to **Microsoft Entra ID** > **App registrations**.
1. Select **+ New registration**. 
1. On the **Register an application** page, set the values as follows:
    
    1. Set **Name** to a meaningful name such as *api-center-portal*
    1. Under **Supported account types**, select **Accounts in this organizational directory (Single tenant)**. 
    1. In **Redirect URI**, select **Single-page application (SPA)** and set the URI. 
        Enter the URI of your API Center portal deployment, in the following form: `https://<service-name>.portal.<location>.azure-api-center.ms`. Replace `<service name>` and `<location>` with the name of your API center and the location where it's deployed, Example: `https://myapicenter.portal.eastus.azure-api-center.ms`.
    1. Select **Register**.

#### Configure additional redirect URIs for VS Code extension

When enabling the API Center portal view in the Visual Studio Code extension for API Center, also configure the following redirect URIs in the app registration:

1. In the [Azure portal](https://portal.azure.com), navigate to your app registration.
1. On the **Manage** > **Authentication** page, select **Add a platform** and select **Mobile and desktop applications**. 
1. Configure the following three custom redirect URIs:<br/>
    `https://vscode.dev/redirect`<br/>
    `http://localhost`<br/>
    `ms-appx-web://Microsoft.AAD.BrokerPlugin/<application-client-id>`<br/>
    
    Replace `<application-client-id>` with the application (client) ID of this app. You can find this value on the **Overview** page of the app registration. 