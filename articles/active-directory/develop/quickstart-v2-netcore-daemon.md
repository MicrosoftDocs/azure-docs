---
title: "Quickstart: Get token & call Microsoft Graph in a console app"
description: In this quickstart, you learn how a .NET Core sample app can use the client credentials flow to get a token and call Microsoft Graph.
services: active-directory
author: OwenRichards1
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 01/10/2022
ROBOTS: NOINDEX
ms.author: owenrichards
ms.reviewer: jmprieur
ms.custom: devx-track-csharp, aaddev, identityplatformtop40, "scenarios:getting-started", "languages:aspnet-core", mode-api
#Customer intent: As an application developer, I want to learn how my .NET Core app can get an access token and call an API that's protected by the Microsoft identity platform by using the client credentials flow.
---

# Quickstart: Get a token and call the Microsoft Graph API by using a console app's identity


> [!div renderon="docs"]
> Welcome! This probably isn't the page you were expecting. While we work on a fix, this link should take you to the right article:
>
> > [Quickstart: .NET Core console that calls an API](console-app-quickstart.md?pivots=devlang-dotnet-core)
>
> We apologize for the inconvenience and appreciate your patience while we work to get this resolved.

> [!div renderon="portal" class="sxs-lookup"]
> The following quickstart uses a code sample to demonstrates how a .NET Core console application can get an access token to call the Microsoft Graph API and display a [list of users](/graph/api/user-list) in the directory. It also demonstrates how a job or a Windows service can run with an application identity, instead of a user's identity. The sample console application in this quickstart is also a daemon application, therefore it's a confidential client application.
>
> ## Prerequisites
>
> This quickstart requires the [.NET Core 6.0 SDK](https://dotnet.microsoft.com/download).
>
> > [!div class="sxs-lookup"]
> ### Download and configure your quickstart app
>
> #### Step 1: Configure your application in the Azure portal
> For the code sample in this quickstart to work, create a client secret and add the Graph API's **User.Read.All** application permission.
> > [!div class="nextstepaction"]
> > [Make these changes for me]()
>
> > [!div class="alert alert-info"]
> > ![Already configured](media/quickstart-v2-netcore-daemon/green-check.png) Your application is configured with these attributes.
>
> #### Step 2: Download your Visual Studio project
>
> > [!div class="sxs-lookup"]
> > Run the project by using Visual Studio 2022.
> > [!div class="sxs-lookup" id="autoupdate" class="nextstepaction"]
> > [Download the code sample](https://github.com/Azure-Samples/active-directory-dotnetcore-daemon-v2/archive/master.zip)
>
> [!INCLUDE [active-directory-develop-path-length-tip](../../../includes/active-directory-develop-path-length-tip.md)]
>
> > [!div class="sxs-lookup"]
> > > [!NOTE]
> > > `Enter_the_Supported_Account_Info_Here`
>
> #### Step 3: Admin consent
>
> Running the application now results in the output `HTTP 403 - Forbidden* error: "Insufficient privileges to complete the operation`. This error occurs because any app-only permission requires a global administrator of the directory to give consent to the application. Select one of the following options, depending on the role.
>
> ##### Global tenant administrator
>
> For a global tenant administrator, go to the **API Permissions** page and select **Grant admin consent for Enter_the_Tenant_Name_Here**.
> > [!div id="apipermissionspage"]
> > [Go to the API Permissions page]()
>
> ##### Standard user
>
> For a standard user of your tenant, ask a global administrator to grant admin consent to the application. To do this, provide the following URL to the administrator:
>
> ```url
> https://login.microsoftonline.com/Enter_the_Tenant_Id_Here/adminconsent?client_id=Enter_the_Application_Id_Here
> ```
>
> The error `AADSTS50011: No reply address is registered for the application` may be displayed after you grant consent to the app by using the preceding URL. This error occurs because the application and the URL don't have a redirect URI. This can be ignored.
>
> #### Step 4: Run the application
>
> In Visual Studio, press **F5** to run the application. Otherwise, run the application via command prompt, console, or terminal:
>
> ```dotnetcli
> cd {ProjectFolder}\1-Call-MSGraph\daemon-console
> dotnet run
> ```
>
> In that code:
> * `{ProjectFolder}` is the folder where you extracted the .zip file. An example is `C:\Azure-Samples\active-directory-dotnetcore-daemon-v2`.
> 
> A list of users in Azure Active Directory should be displayed as a result.
>
> This quickstart application uses a client secret to identify itself as a confidential client. The client secret is added as a plain-text file to the project files. For security reasons, it is recommended to use a certificate instead of a client secret before considering the application as a production application. For more information on how to use a certificate, see [these instructions](https://github.com/Azure-Samples/active-directory-dotnetcore-daemon-v2/#variation-daemon-application-using-client-credentials-with-certificates).
>
> ## More information
>
> This section gives an overview of the code required to sign in users. This overview can be useful to understand how the > code works, what the main arguments are, and how to add sign-in to an existing .NET Core console application.
>
> > [!div class="sxs-lookup"]
> ### How the sample works
>
> ![Diagram that shows how the sample app generated by this quickstart works.](media/quickstart-v2-netcore-daemon/> netcore-daemon-intro.svg)
>
> ### MSAL.NET
>
> Microsoft Authentication Library (MSAL, in the [Microsoft.Identity.Client](https://www.nuget.org/packages/Microsoft.Identity.Client) package) is the library that's used to sign in users and request tokens for accessing an API protected by the Microsoft identity platform. This quickstart requests tokens by using the application's own identity instead of delegated permissions. The authentication flow in this case is known as a [client credentials OAuth flow](v2-oauth2-client-creds-grant-flow.md). For more information on how to use MSAL.NET with a client credentials flow, see [this article](https://aka.ms/msal-net-client-credentials).
>
> MSAL.NET can be installed by running the following command in the Visual Studio Package Manager Console:
>
> ```dotnetcli
> dotnet add package Microsoft.Identity.Client
> ```
>
> ### MSAL initialization
>
> Add the reference for MSAL by adding the following code:
>
> ```csharp
> using Microsoft.Identity.Client;
> ```
>
> Then, initialize MSAL with the following:
>
> ```csharp
> IConfidentialClientApplication app;
> app = ConfidentialClientApplicationBuilder.Create(config.ClientId)
>                                           .WithClientSecret(config.ClientSecret)
>                                           .WithAuthority(new Uri(config.Authority))
>                                           .Build();
> ```
>
>  | Element | Description |
>  |---------|---------|
>  | `config.ClientSecret` | The client secret created for the application in the Azure portal. |
>  | `config.ClientId` | The application (client) ID for the application registered in the Azure portal. This value can be found on the app's **Overview** page in the Azure portal. |
>  | `config.Authority`    | (Optional) The security token service (STS) endpoint for the user to authenticate. It's usually `https://login.microsoftonline.com/{tenant}` for the public cloud, where `{tenant}` is the name of the tenant or the tenant ID.|
>
> For more information, see the [reference documentation for `ConfidentialClientApplication`](/dotnet/api/microsoft.identity.client.iconfidentialclientapplication).
>
> ### Requesting tokens
>
> To request a token by using the app's identity, use the `AcquireTokenForClient` method:
>
> ```csharp
> result = await app.AcquireTokenForClient(scopes)
>                   .ExecuteAsync();
> ```
>
> |Element| Description |
> |---------|---------|
> | `scopes` | Contains the requested scopes. For confidential clients, this value should use a format similar to `{Application ID URI}/.default`. This format indicates that the requested scopes are the ones that are statically defined in the app object set in the Azure portal. For Microsoft Graph, `{Application ID URI}` points to `https://graph.microsoft.com`. For custom web APIs, `{Application ID URI}` is defined in the Azure portal, under **Application Registration (Preview)** > **Expose an API**. |
>
> For more information, see the [reference documentation for `AcquireTokenForClient`](/dotnet/api/microsoft.identity.client.confidentialclientapplication.acquiretokenforclient).
>
> [!INCLUDE [Help and support](../../../includes/active-directory-develop-help-support-include.md)]
>
> ## Next steps
>
> To learn more about daemon applications, see the scenario overview:
>
> > [!div class="nextstepaction"]
> > [Daemon application that calls web APIs](scenario-daemon-overview.md)
