---
title: "Quickstart: Call an ASP.NET web API that is protected by the Microsoft identity platform"
description: In this quickstart, learn how to call an ASP.NET web API that's protected by the Microsoft identity platform from a Windows Desktop (WPF) application.
services: active-directory
author: Dickson-Mwendia
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 08/16/2022
ROBOTS: NOINDEX
ms.author: dmwendia
ms.custom: devx-track-csharp, aaddev, identityplatformtop40, "scenarios:getting-started", "languages:ASP.NET", mode-api
#Customer intent: As an application developer, I want to know how to set up OpenId Connect authentication in a web application that's built by using Node.js with Express.
---

# Quickstart: Call an ASP.NET web API that's protected by Microsoft identity platform

> [!div renderon="docs"]
> Welcome! This probably isn't the page you were expecting. While we work on a fix, this link should take you to the right article:
>
> > [Quickstart: Call an ASP.NET web API that is protected by the Microsoft identity platform](quickstart-web-api-aspnet-protect-api.md)
> 
> We apologize for the inconvenience and appreciate your patience while we work to get this resolved.

> [!div renderon="portal" id="display-on-portal" class="sxs-lookup"]
> # Quickstart: Call an ASP.NET web API that's protected by Microsoft identity platform
>
> In this quickstart, you download and run a code sample that demonstrates how to protect an ASP.NET web API by restricting access to its resources to authorized accounts only. The sample supports authorization of personal Microsoft accounts and accounts in any Microsoft Entra organization.
> 
> The article also uses a Windows Presentation Foundation (WPF) app to demonstrate how you can request an access token to access a web API.
> 
> ## Prerequisites
> 
> * An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
> * Visual Studio 2017 or 2019. Download [Visual Studio for free](https://www.visualstudio.com/downloads/).
> 
> ## Clone or download the sample
> 
> You can obtain the sample in either of two ways:
> 
> * Clone it from your shell or command line:
> 
>    ```console
>    git clone https://github.com/AzureADQuickStarts/AppModelv2-NativeClient-DotNet.git
>    ```
> 
> * [Download it as a ZIP file](https://github.com/AzureADQuickStarts/AppModelv2-NativeClient-DotNet/archive/complete.zip).
> 
> [!INCLUDE [active-directory-develop-path-length-tip](./includes/error-handling-and-tips/path-length-tip.md)]
> 
> ## Register the web API (TodoListService)
> 
> Register your web API in **App registrations** in the Azure portal.
> 
> 1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Application Administrator](../roles/permissions-reference.md#application-administrator).
> 1. Browse to **Identity** > **Applications** > **App registrations**.
> 1. Select **New registration**.
> 1. Enter a **Name** for your application, for example `AppModelv2-NativeClient-DotNet-TodoListService`. Users of your app might see this name, and you can change it later.
> 1. For **Supported account types**, select **Accounts in any organizational directory**.
> 1. Select **Register** to create the application.
> 1. On the app **Overview** page, look for the **Application (client) ID** value, and then record it for later use. You'll need it to configure the Visual Studio configuration file for this project (that is, `ClientId` in the *TodoListService\Web.config* file).
> 1. Under **Manage**, select **Expose an API** > **Add a scope**. Accept the proposed Application ID URI (`api://{clientId}> `) by selecting **Save and continue**, and then enter the following information:
> 
>     1. For **Scope name**, enter `access_as_user`.
>     1. For **Who can consent**, ensure that the **Admins and users** option is selected.
>     1. In the **Admin consent display name** box, enter `Access TodoListService as a user`.
>     1. In the **Admin consent description** box, enter `Accesses the TodoListService web API as a user`.
>     1. In the **User consent display name** box, enter `Access TodoListService as a user`.
>     1. In the **User consent description** box, enter `Accesses the TodoListService web API as a user`.
>     1. For **State**, keep **Enabled**.
> 1. Select **Add scope**.
> 
> ### Configure the service project
> 
> Configure the service project to match the registered web API.
> 
> 1. Open the solution in Visual Studio, and then open the *Web.config* file under the root of the TodoListService project.
> 
> 1. Replace the value of the `ida:ClientId` parameter with the Client ID (Application ID) value from the application you registered in the **App registrations** portal.
> 
> ### Add the new scope to the app.config file
> 
> To add the new scope to the TodoListClient *app.config* file, follow these steps:
> 
> 1. In the TodoListClient project root folder, open the *app.config* file.
> 
> 1. Paste the Application ID from the application that you registered for your TodoListService project in the `TodoListServiceScope` parameter, replacing the `{Enter the Application ID of your TodoListService from the app registration portal}` string.
> 
>   > [!NOTE]
>   > Make sure that the Application ID uses the following format: `api://{TodoListService-Application-ID}/access_as_user` (where `{TodoListService-Application-ID}` is the GUID representing the Application ID for your TodoListService app).
> 
> ## Register the web app (TodoListClient)
> 
> Register your TodoListClient app in **App registrations** in the Azure portal, and then configure the code in the TodoListClient project. If the client and server are considered the same application, you can reuse the application that's registered in step 2. Use the same application if you want users to sign in with a personal Microsoft account.
> 
> ### Register the app
> 
> To register the TodoListClient app, follow these steps:
> 
> 1. Go to the Microsoft identity platform for developers [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) portal.
> 1. Select **New registration**.
> 1. When the **Register an application page** opens, enter your application's registration information:
> 
>     1. In the **Name** section, enter a meaningful application name that will be displayed to users of the app (for example, **NativeClient-DotNet-TodoListClient**).
>     1. For **Supported account types**, select **Accounts in any organizational directory**.
>     1. Select **Register** to create the application.
> 
>    > [!NOTE]
>    > In the TodoListClient project *app.config* file, the default value of `ida:Tenant` is set to `common`. The possible values are:
>    >
>    > - `common`: You can sign in by using a work or school account or a personal Microsoft account (because you selected **Accounts in any organizational directory** in a previous step).
>    > - `organizations`: You can sign in by using a work or school account.
>    > - `consumers`: You can sign in only by using a Microsoft personal account.
> 
> 1. On the app **Overview** page, select **Authentication**, and then complete these steps to add a platform:
> 
>     1. Under **Platform configurations**, select the **Add a platform** button.
>     1. For **Mobile and desktop applications**, select **Mobile and desktop applications**.
>     1. For **Redirect URIs**, select the `https://login.microsoftonline.com/common/oauth2/nativeclient` check box.
>     1. Select **Configure**.
> 
> 1. Select **API permissions**, and then complete these steps to add permissions:
> 
>     1. Select the **Add a permission** button.
>     1. Select the **My APIs** tab.
>     1. In the list of APIs, select **AppModelv2-NativeClient-DotNet-TodoListService API** or the name you entered for the web API.
>     1. Select the **access_as_user** permission check box if it's not already selected. Use the Search box if necessary.
>     1. Select the **Add permissions** button.
> 
> ### Configure your project
> 
> Configure your TodoListClient project by adding the Application ID to the *app.config* file.
> 
> 1. In the **App registrations** portal, on the **Overview** page, copy the value of the **Application (client) ID**.
> 
> 1. From the TodoListClient project root folder, open the *app.config* file, and then paste the Application ID value in the `ida:ClientId` parameter.
> 
> ## Run your projects
> 
> Start both projects. If you are using Visual Studio:
> 
> 1. Right click on the Visual Studio solution and select **Properties**
> 
> 1. In the **Common Properties** select **Startup Project** and then **Multiple startup projects**. 
> 
> 1. For both projects choose **Start** as the action
> 
> 1. Ensure the TodoListService service starts first by moving it to the first position in the list, using the up arrow.
> 
> Sign in to run your TodoListClient project.
> 
> 1. Press F5 to start the projects. The service page opens, as well as the desktop application.
> 
> 1. In the TodoListClient, at the upper right, select **Sign in**, and then sign in with the same credentials you used to register your application, or sign in as a user in the same directory.
> 
>    If you're signing in for the first time, you might be prompted to consent to the TodoListService web API.
> 
>    To help you access the TodoListService web API and manipulate the *To-Do* list, the sign-in also requests an access token to the *access_as_user* scope.
> 
> ## Pre-authorize your client application
> 
> You can allow users from other directories to access your web API by pre-authorizing the client application to access your web API. You do this by adding the Application ID from the client app to the list of pre-authorized applications for your web API. By adding a pre-authorized client, you're allowing users to access your web API without having to provide consent.
> 
> 1. In the **App registrations** portal, open the properties of your TodoListService app.
> 1. In the **Expose an API** section, under **Authorized client applications**, select **Add a client application**.
> 1. In the **Client ID** box, paste the Application ID of the TodoListClient app.
> 1. In the **Authorized scopes** section, select the scope for the `api://<Application ID>/access_as_user` web API.
> 1. Select **Add application**.
> 
> ### Run your project
> 
> 1. Press <kbd>F5</kbd> to run your project. Your TodoListClient app opens.
> 1. At the upper right, select **Sign in**, and then sign in by using a personal Microsoft account, such as a *live.com* or *hotmail.com* account, or a work or school account.
> 
> ## Optional: Limit sign-in access to certain users
> 
> By default, any personal accounts, such as *outlook.com* or *live.com* accounts, or work or school accounts from organizations that are integrated with Microsoft Entra ID can request tokens and access your web API.
> 
> To specify who can sign in to your application, use one of the following options:
> 
> ### Option 1: Limit access to a single organization (single tenant)
> 
> You can limit sign-in access to your application to user accounts that are in a single Microsoft Entra tenant, including guest accounts of that tenant. This scenario is common for line-of-business applications.
> 
> 1. Open the *App_Start\Startup.Auth* file, and then change the value of the metadata endpoint that's passed into the `OpenIdConnectSecurityTokenProvider` to `https://login.microsoftonline.com/{Tenant ID}/v2.0/.well-known/openid-configuration`. You can also use the tenant name, such as `contoso.onmicrosoft.com`.
> 1. In the same file, set the `ValidIssuer` property on the `TokenValidationParameters` to `https://sts.windows.net/{Tenant ID}/`, and set the `ValidateIssuer` argument to `true`.
> 
> ### Option 2: Use a custom method to validate issuers
> 
> You can implement a custom method to validate issuers by using the `IssuerValidator` parameter. For more information about this parameter, see [TokenValidationParameters class](/dotnet/api/microsoft.identitymodel.tokens.tokenvalidationparameters).
> 
> [!INCLUDE [Help and support](./includes/error-handling-and-tips/help-support-include.md)]
> 
> ## Next steps
> 
> Learn more about the protected web API scenario that the Microsoft identity platform supports.
> > [!div class="nextstepaction"]
> > [Protected web API scenario](scenario-protected-web-api-overview.md)
