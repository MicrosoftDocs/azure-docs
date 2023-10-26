---
title: include file
description: include file
ms.topic: include
ms.custom: include file
services: time-series-insights
ms.service: time-series-insights
author: deepakpalled
ms.author: dpalled
manager: cshankar
ms.date: 10/02/2020
---


* After selecting the appropriate platform in step 4 of [Configure platform](../articles/active-directory/develop/quickstart-register-app.md#configure-platform-settings) settings, configure your **Redirect URIs** and **Access Tokens** in the side panel to the right of the user interface.

    * **Redirect URIs** must match the address supplied by the authentication request:

        * For apps hosted in a local development environment, select **Public client (mobile & desktop)**. Make sure to set **public client** to **Yes**.
        * For Single-Page Apps hosted on Azure App Service, select **Web**.

    * Determine whether a **Logout URL** is appropriate.

    * Enable the implicit grant flow by checking **Access tokens** or **ID tokens**.

    [![Create Redirect URIs](media/time-series-insights-registration/auth-redirect-uri.png)](media/time-series-insights-registration/auth-redirect-uri.png#lightbox)

    Click **Configure**, then **Save**.

* Associate your Microsoft Entra app Azure Time Series Insights. Select **API permissions** > **Add a permission** > **APIs my organization uses**.

    [![Associate an API with your Microsoft Entra app](media/time-series-insights-registration/app-api-permission.png)](media/time-series-insights-registration/app-api-permission.png#lightbox)

   Type `Azure Time Series Insights` into the search bar then select `Azure Time Series Insights`.

* Next, specify the kind API permission your app requires. By default, **Delegated permissions** will be highlighted. Choose a permission type then, select **Add permissions**.

    [![Specify the kind of API permission your app requires](media/time-series-insights-registration/app-permission-grant.png)](media/time-series-insights-registration/app-permission-grant.png#lightbox)

* [Add Credentials](../articles/active-directory/develop/quickstart-register-app.md#add-credentials) if the application will be calling your environment's APIs as itself. Credentials allow your application to authenticate as itself, requiring no interaction from a user at runtime.
