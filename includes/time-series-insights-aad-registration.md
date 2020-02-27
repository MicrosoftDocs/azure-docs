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
ms.date: 02/03/2020
---

1. In the [Azure portal](https://ms.portal.azure.com/), select **Azure Active Directory** > **App registrations** > **New registration**.

   [![New application registration in Azure Active Directory](media/time-series-insights-aad-registration/active-directory-new-application-registration.png)](media/time-series-insights-aad-registration/active-directory-new-application-registration.png#lightbox)

    Your app will be listed here after you register it.

1. Give the application a name and select **Accounts in this organizational directory only** to specify the **Supported account types** that may access the API. Choose a valid URI  to redirect users to after they authenticate, then **Register**.

   [![Create the application in Azure Active Directory](media/time-series-insights-aad-registration/active-directory-registration.png)](media/time-series-insights-aad-registration/active-directory-registration.png#lightbox)

1. Important Azure Active Directory app information is displayed in your listed app's **Overview** blade. Select your app under **Owned applications**, then **Overview**.

   [![Copy the application ID](media/time-series-insights-aad-registration/active-directory-copy-application-id.png)](media/time-series-insights-aad-registration/active-directory-copy-application-id.png#lightbox)

   Copy your **Application (client) ID** to use in your client application.

1. The **Authentication** blade specifies important authentication configuration settings. 

    1. Add **Redirect URIs** and configure **Access Tokens** by selecting **+ Add a platform**.

    1. Determine whether the app is a **public client** or not by selecting **Yes** or **No**.

    1. Verify which accounts and tenants are supported.

    [![Configure Implicit grant](media/time-series-insights-aad-registration/active-directory-auth-blade.png)](media/time-series-insights-aad-registration/active-directory-auth-blade.png#lightbox)

1. After selecting the appropriate platform, configure your **Redirect URIs** and **Access Tokens** in the side panel to the right of the user interface.

    1. **Redirect URIs** must match the address supplied by the authentication request:

        * For apps hosted in a local development environment, select **Public client (mobile & desktop)**. Make sure to set **public client** to **Yes**.
        * For Single-Page Apps hosted on Azure App Service, select **Web**.

    1. Determine whether a **Logout URL** is appropriate.

    1. Enable the implicit grant flow by checking **Access tokens** or **ID tokens**.

    [![Create Redirect URIs](media/time-series-insights-aad-registration/active-directory-auth-redirect-uri.png)](media/time-series-insights-aad-registration/active-directory-auth-redirect-uri.png#lightbox)

    Click **Configure**, then **Save**.

1. Select **Certificates & secrets** then **New client secret** to create an application password that your client app can use to prove its identity.

   [![Create a new client secret](media/time-series-insights-aad-registration/active-directory-application-keys-save.png)](media/time-series-insights-aad-registration/active-directory-application-keys-save.png#lightbox)

   Your client secret password will then be displayed. Copy the key to your favorite text editor.

   > [!NOTE]
   > You have the ability to import a certificate instead. For enhanced security, a certificate is recommended. To use a certificate, select **Upload certificate**.

1. Associate your Azure Active Directory app Azure TIme Series Insights. Select **API permissions** > **Add a permission** > **APIs my organization uses**. 

    [![Associate an API with your Azure Active Directory app](media/time-series-insights-aad-registration/active-directory-app-api-permission.png)](media/time-series-insights-aad-registration/active-directory-app-api-permission.png#lightbox)

   Type `Azure Time Series Insights` into the search bar then select `Azure Time Series Insights`.

1. Next, specify the kind API permission your app requires. By default, **Delegated permissions** will be highlighted. Choose a permission type then, select **Add permissions**.

    [![Specify the kind of API permission your app requires](media/time-series-insights-aad-registration/active-directory-app-permission-grant.png)](media/time-series-insights-aad-registration/active-directory-app-permission-grant.png#lightbox)
