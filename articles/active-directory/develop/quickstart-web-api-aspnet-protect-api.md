---
title: "Quickstart: Call an ASP.NET web API that is protected by the Microsoft identity platform"
description: In this quickstart, learn how to call an ASP.NET web API that's protected by the Microsoft identity platform from a Windows Desktop (WPF) application.
services: active-directory
author: cilwerner
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.topic: quickstart
ms.workload: identity
ms.date: 04/17/2023
ms.author: cwerner 
ms.reviewer: jmprieur
ms.custom: devx-track-csharp, aaddev, identityplatformtop40, "scenarios:getting-started", "languages:ASP.NET", mode-api, engagement-fy23
#Customer intent: As an application developer, I want to know how to set up OpenId Connect authentication in a web application that's built by using Node.js with Express.
---

# Quickstart: Call an ASP.NET web API that is protected by the Microsoft identity platform

The following quickstart uses, uses a code sample that demonstrates how to protect an ASP.NET web API by restricting access to its resources to authorized accounts only. The sample supports authorization of personal Microsoft accounts and accounts in any Microsoft Entra organization.

The article also uses a Windows Presentation Foundation (WPF) app to demonstrate how to request an access token to access a web API.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Visual Studio 2022. Download [Visual Studio for free](https://www.visualstudio.com/downloads/).

## Clone or download the sample

The code sample can be obtained in two ways:

* Clone it from your shell or command line:

   ```console
   git clone https://github.com/AzureADQuickStarts/AppModelv2-NativeClient-DotNet.git
   ```

* [Download it as a ZIP file](https://github.com/AzureADQuickStarts/AppModelv2-NativeClient-DotNet/archive/complete.zip).

[!INCLUDE [active-directory-develop-path-length-tip](includes/error-handling-and-tips/path-length-tip.md)]

## Register the web API (TodoListService)

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

Register your web API in **App registrations** in the Azure portal.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator). 
1. If you have access to multiple tenants, use the **Directories + subscriptions** filter :::image type="icon" source="./media/quickstart-configure-app-access-web-apis/portal-01-directory-subscription-filter.png" border="false"::: in the top menu to select the tenant containing your client app's registration.
1. Browse to **Identity** > **Applications** > **App registrations** and select **New registration**.
1. Enter a **Name** for your application, for example `AppModelv2-NativeClient-DotNet-TodoListService`. Users of your app might see this name, and you can change it later.
1. For **Supported account types**, select **Accounts in any organizational directory**.
1. Select **Register** to create the application.
1. On the app **Overview** page, look for the **Application (client) ID** value, and then record it for later use. You'll need it to configure the Visual Studio configuration file for this project (that is, `ClientId` in the *TodoListService\appsettings.json* file).
1. Under **Manage**, select **Expose an API** > **Add a scope**. Accept the proposed Application ID URI (`api://{clientId}`) by selecting **Save and continue**, and then enter the following information:

    1. For **Scope name**, enter `access_as_user`.
    1. For **Who can consent**, ensure that the **Admins and users** option is selected.
    1. In the **Admin consent display name** box, enter `Access TodoListService as a user`.
    1. In the **Admin consent description** box, enter `Accesses the TodoListService web API as a user`.
    1. In the **User consent display name** box, enter `Access TodoListService as a user`.
    1. In the **User consent description** box, enter `Accesses the TodoListService web API as a user`.
    1. For **State**, keep **Enabled**.
1. Select **Add scope**.

### Configure the service project

Configure the service project to match the registered web API.

1. Open the solution in Visual Studio, and then open the *appsettings.json* file under the root of the TodoListService project.

1. Replace the value of the `Enter_the_Application_Id_here` by the Client ID (Application ID) value from the application you registered in the **App registrations** portal both in the `ClientID` and the `Audience` properties.

### Add the new scope to the app.config file

To add the new scope to the TodoListClient *app.config* file, follow these steps:

1. In the TodoListClient project root folder, open the *app.config* file.

1. Paste the Application ID from the application that you registered for your TodoListService project in the `TodoListServiceScope` parameter, replacing the `{Enter the Application ID of your TodoListService from the app registration portal}` string.

  > [!NOTE]
  > Make sure that the Application ID uses the following format: `api://{TodoListService-Application-ID}/access_as_user` (where `{TodoListService-Application-ID}` is the GUID representing the Application ID for your TodoListService app).

## Register the web app (TodoListClient)

Register your TodoListClient app in **App registrations** in the Azure portal, and then configure the code in the TodoListClient project. If the client and server are considered the same application, you can reuse the application that's registered in step 2. Use the same application if you want users to sign in with a personal Microsoft account.

### Register the app

To register the TodoListClient app, follow these steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator). 
1. Browse to **Identity** > **Applications** > **App registrations** and select **New registration**.
1. Select **New registration**.
1. When the **Register an application page** opens, enter your application's registration information:

    1. In the **Name** section, enter a meaningful application name that will be displayed to users of the app (for example, **NativeClient-DotNet-TodoListClient**).
    1. For **Supported account types**, select **Accounts in any organizational directory**.
    1. Select **Register** to create the application.

   > [!NOTE]
   > In the TodoListClient project *app.config* file, the default value of `ida:Tenant` is set to `common`. The possible values are:
   >
   > - `common`: You can sign in by using a work or school account or a personal Microsoft account (because you selected **Accounts in any organizational directory** in a previous step).
   > - `organizations`: You can sign in by using a work or school account.
   > - `consumers`: You can sign in only by using a Microsoft personal account.

1. On the app **Overview** page, select **Authentication**, and then complete these steps to add a platform:

    1. Under **Platform configurations**, select the **Add a platform** button.
    1. For **Mobile and desktop applications**, select **Mobile and desktop applications**.
    1. For **Redirect URIs**, select the `https://login.microsoftonline.com/common/oauth2/nativeclient` check box.
    1. Select **Configure**.

1. Select **API permissions**, and then complete these steps to add permissions:

    1. Select the **Add a permission** button.
    1. Select the **My APIs** tab.
    1. In the list of APIs, select **AppModelv2-NativeClient-DotNet-TodoListService API** or the name you entered for the web API.
    1. Select the **access_as_user** permission check box if it's not already selected. Use the Search box if necessary.
    1. Select the **Add permissions** button.

### Configure your project

Configure your TodoListClient project by adding the Application ID to the *app.config* file.

1. In the **App registrations** portal, on the **Overview** page, copy the value of the **Application (client) ID**.

1. From the TodoListClient project root folder, open the *app.config* file, and then paste the Application ID value in the `ida:ClientId` parameter.

## Run your projects

Start both projects. For Visual Studio users;

1. Right click on the Visual Studio solution and select **Properties**

1. In the **Common Properties** select **Startup Project** and then **Multiple startup projects**. 

1. For both projects choose **Start** as the action

1. Ensure the TodoListService service starts first by moving it to the first position in the list, using the up arrow.

Sign in to run your TodoListClient project.

1. Press F5 to start the projects. The service page opens, as well as the desktop application.

1. In the TodoListClient, at the upper right, select **Sign in**, and then sign in with the same credentials you used to register your application, or sign in as a user in the same directory.

   If you're signing in for the first time, you might be prompted to consent to the TodoListService web API.

   To help you access the TodoListService web API and manipulate the *To-Do* list, the sign-in also requests an access token to the *access_as_user* scope.

## Pre-authorize your client application

You can allow users from other directories to access your web API by pre-authorizing the client application to access your web API. You do this by adding the Application ID from the client app to the list of pre-authorized applications for your web API. By adding a pre-authorized client, you're allowing users to access your web API without having to provide consent.

1. In the **App registrations** portal, open the properties of your TodoListService app.
1. In the **Expose an API** section, under **Authorized client applications**, select **Add a client application**.
1. In the **Client ID** box, paste the Application ID of the TodoListClient app.
1. In the **Authorized scopes** section, select the scope for the `api://<Application ID>/access_as_user` web API.
1. Select **Add application**.

### Run your project

1. Press <kbd>F5</kbd> to run your project. Your TodoListClient app opens.
1. At the upper right, select **Sign in**, and then sign in by using a personal Microsoft account, such as a *live.com* or *hotmail.com* account, or a work or school account.

## Optional: Limit sign-in access to certain users

By default, any personal accounts, such as *outlook.com* or *live.com* accounts, or work or school accounts from organizations that are integrated with Microsoft Entra ID can request tokens and access your web API.

To specify who can sign in to your application, by changing the `TenantId` property in the *appsettings.json* file.

[!INCLUDE [Help and support](includes/error-handling-and-tips/help-support-include.md)]

## Next steps

Learn more about the protected web API scenario that the Microsoft identity platform supports.
> [!div class="nextstepaction"]
> [Protected web API scenario](scenario-protected-web-api-overview.md)
