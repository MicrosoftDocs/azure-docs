---
author: kengaderdus
ms.service: active-directory
ms.subservice: ciam
ms.topic: include
ms.date: 03/30/2023
ms.author: kengaderdus
---
To enable your application sign in with Microsoft Entra, register your app in the Azure AD for customers directory. The app registration establishes a trust relationship between the app and Microsoft Entra.

During app registration, you'll specify the *Redirect URI*. The redirect URI is the endpoint to which the user is redirected by Microsoft Entra after they authenticate with Microsoft Entra. The app registration process generates an *Application ID*, also known as the *client ID*, that uniquely identifies your app. After your app is registered, Microsoft Entra uses both the application ID, and the redirect URI to create authentication requests.

Follow these steps to register your app in the Microsoft Entra admin center:

1. 1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com/).

1. If you have access to multiple tenants, make sure you use the directory that contains your Microsoft Entra tenant:
    
    1. Select the **Directories + subscriptions** icon in the portal toolbar. 
    
    1. On the **Portal settings | Directories + subscriptions** page, find your Azure AD for customers directory in the **Directory name** list, and then select **Switch**. 

1. In the Microsoft Entra admin center, select **Azure Active Directory**.

1. Select **Applications**, and then select **App Registrations**.

1. Select **New registration**.

1. In the **Register an application page** that appears, enter your application's registration information:
    
    1. In the **Name** section, enter a meaningful application name that will be displayed to users of the app, for example `ciam-client-app`.
    
    1. Under **Supported account types**, select **Accounts in this organizational directory only (Contoso CIAM only - Single tenant)**

1. Select **Register** to create the application.

1. Record the **Application (client) ID** and **Directory (tenant) ID** for later use, when you configure the sample application.