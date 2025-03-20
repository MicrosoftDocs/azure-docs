---
title: Include file
description: Include file
services: api-center
author: dlepow

ms.service: azure-api-center
ms.topic: include
ms.date: 03/04/2025
ms.author: danlep
ms.custom: Include file
---

## Create Microsoft Entra app registration

First configure an app registration in your Microsoft Entra ID tenant. The app registration enables the API Center portal to access data from your API center on behalf of a signed-in user.

1. In the [Azure portal](https://portal.azure.com), navigate to **Microsoft Entra ID** > **App registrations**.
1. Select **+ New registration**. 
1. On the **Register an application** page, set the values as follows:
    
    1. Set **Name** to a meaningful name such as *api-center-portal*
    1. Under **Supported account types**, select **Accounts in this organizational directory (Single tenant)**. 
    1. In **Redirect URI**, select **Single-page application (SPA)** and set the URI. 
        Enter the URI of your API Center portal deployment, in the following form: `https://<service-name>.portal.<location>.azure-api-center.ms`. Replace `<service name>` and `<location>` with the name of your API center and the location where it's deployed, Example: `https://myapicenter.portal.eastus.azure-api-center.ms`.
    1. Select **Register**.
    1. Turn into **Authentication** page, click **Add a platform** and select the **Mobile and desktop applications**, add following three Redirect URIs into this section: `https://vscode.dev/redirect`, `http://localhost`, and `ms-appx-web://Microsoft.AAD.BrokerPlugin/<application-client-id>`. Replace `<application-client-id>` with this AAD App.
1. On the **Overview** page, copy the **Application (client) ID**. You set this value when you publish the portal.