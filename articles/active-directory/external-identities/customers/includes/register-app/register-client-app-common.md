---
author: kengaderdus
ms.service: active-directory
ms.subservice: ciam
ms.topic: include
ms.date: 03/30/2023
ms.author: kengaderdus
---
<!--Doesn't apply to daemon app-->

To enable your application to sign in users with Microsoft Entra, Azure Active Directory (Azure AD) for customers must be made aware of the application you create. The app registration establishes a trust relationship between the app and Microsoft Entra. When you register an application, Azure AD generates a unique identifier known as an **Application (client) ID**, a value used to identify your app when creating authentication requests.

The following steps show you how to register your app in the Microsoft Entra admin center:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com/).
1. If you have access to multiple tenants, make sure you use the directory that contains your Azure AD for customers tenant:

    1. Select the **Directories + subscriptions** icon :::image type="icon" source="../../media/common/portal-directory-subscription-filter.png" border="false"::: in the toolbar. 
    1. On the **Portal settings | Directories + subscriptions** page, find your Azure AD for customers directory in the **Directory name** list, and then select **Switch**. 

1. On the sidebar menu, select **Azure Active Directory**.
1. Select **Applications**, then select **App Registrations**.
1. Select **+ New registration**.
1. In the **Register an application** page that appears;

    1. Enter a meaningful application **Name** that is displayed to users of the app, for example *ciam-client-app*.
    1. Under **Supported account types**, select **Accounts in this organizational directory only**.

1. Select **Register**.
1. The application's **Overview** pane displays upon successful registration. Record the **Application (client) ID** to be used in your application source code.