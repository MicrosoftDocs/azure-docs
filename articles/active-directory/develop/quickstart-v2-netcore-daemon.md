---
title: Get token & call Microsoft Graph with console app identity | Azure
titleSuffix: Microsoft identity platform
description: Learn how to get a token and call a protected Microsoft Graph API with it from a .NET Core app
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: quickstart
ms.workload: identity
ms.date: 07/16/2019
ms.author: jmprieur
ms.custom: aaddev, identityplatformtop40, scenarios:getting-started, languages:aspnet-core
#Customer intent: As an application developer, I want to learn how my .NET Core app can get an access token and call an API that's protected by an Microsoft identity platform endpoint using client credentials flow.
---

# Quickstart: Acquire a token and call Microsoft Graph API using console app's identity

In this quickstart, you'll learn how to write a .NET Core application that can get an access token using the app's own identity and then call the Microsoft Graph API to display a [list of users](https://docs.microsoft.com/graph/api/user-list) in the directory. This scenario is useful for situations where headless, unattended job or a windows service needs to run with an application identity, instead of a user's identity. (See [How the sample works](#how-the-sample-works) for an illustration.)

## Prerequisites

This quickstart requires [.NET Core 2.2](https://www.microsoft.com/net/download/dotnet-core/2.2).

> [!div renderon="docs"]
> ## Register and download your quickstart app

> [!div renderon="docs" class="sxs-lookup"]
>
> You have two options to start your quickstart application: Express (Option 1 below), and Manual (Option 2)
>
> ### Option 1: Register and auto configure your app and then download your code sample
>
> 1. Go to the new [Azure portal - App registrations](https://portal.azure.com/?Microsoft_AAD_RegisteredApps=true#blade/Microsoft_AAD_RegisteredApps/applicationsListBlade/quickStartType/DotNetCoreDaemonQuickstartPage/sourceType/docs) pane.
> 1. Enter a name for your application and select **Register**.
> 1. Follow the instructions to download and automatically configure your new application with just one click.
>
> ### Option 2: Register and manually configure your application and code sample

> [!div renderon="docs"]
> #### Step 1: Register your application
> To register your application and add the app's registration information to your solution manually, follow these steps:
>
> 1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
> 1. If your account gives you access to more than one tenant, select your account in the top right corner, and set your portal session to the desired Azure AD tenant.
> 1. Navigate to the Microsoft identity platform for developers [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) page.
> 1. Select **New registration**.
> 1. When the **Register an application** page appears, enter your application's registration information.
> 1. In the **Name** section, enter a meaningful application name that will be displayed to users of the app, for example `Daemon-console`, then select **Register** to create the application.
> 1. Once registered, select the **Certificates & secrets** menu.
> 1. Under **Client secrets**, select **+ New client secret**. Give it a name and select **Add**. Copy the secret on a safe location. You will need it to use in your code.
> 1. Now, select the **API Permissions** menu, select **+ Add a permission** button, select **Microsoft Graph**.
> 1. Select **Application permissions**.
> 1. Under **User** node, select **User.Read.All**, then select **Add permissions**

> [!div class="sxs-lookup" renderon="portal"]
> ### Download and configure your quickstart app
>
> #### Step 1: Configure your application in Azure portal
> For the code sample for this quickstart to work, you need to create a client secret, and add Graph API's **User.Read.All** application permission.
> > [!div renderon="portal" id="makechanges" class="nextstepaction"]
> > [Make these changes for me]()
>
> > [!div id="appconfigured" class="alert alert-info"]
> > ![Already configured](media/quickstart-v2-netcore-daemon/green-check.png) Your application is configured with these attributes.

#### Step 2: Download your Visual Studio project

> [!div renderon="docs"]
> [Download the Visual Studio project](https://github.com/Azure-Samples/active-directory-dotnetcore-daemon-v2/archive/master.zip)

> [!div class="sxs-lookup" renderon="portal"]
> Run the project using Visual Studio 2019.
> [!div renderon="portal" id="autoupdate" class="nextstepaction"]
> [Download the code sample](https://github.com/Azure-Samples/active-directory-dotnetcore-daemon-v2/archive/master.zip)

> [!div class="sxs-lookup" renderon="portal"]
> > [!NOTE]
> > `Enter_the_Supported_Account_Info_Here`

> [!div renderon="docs"]
> #### Step 3: Configure your Visual Studio project
>
> 1. Extract the zip file to a local folder close to the root of the disk, for example, **C:\Azure-Samples**.
> 1. Open the solution in Visual Studio - **1-Call-MSGraph\daemon-console.sln** (optional).
> 1. Edit **appsettings.json** and replace the values of the fields `ClientId`, `Tenant` and `ClientSecret` with the following:
>
>    ```json
>    "Tenant": "Enter_the_Tenant_Id_Here",
>    "ClientId": "Enter_the_Application_Id_Here",
>    "ClientSecret": "Enter_the_Client_Secret_Here"
>    ```
>   Where:
>   - `Enter_the_Application_Id_Here` - is the **Application (client) ID** for the application you registered.
>   - `Enter_the_Tenant_Id_Here` - replace this value with the **Tenant Id** or **Tenant name** (for example, contoso.microsoft.com)
>   - `Enter_the_Client_Secret_Here` - replace this value with the client secret created on step 1.

> [!div renderon="docs"]
> > [!TIP]
> > To find the values of **Application (client) ID**, **Directory (tenant) ID**, go to the app's **Overview** page in the Azure portal. To generate a new key, go to **Certificates & secrets** page.

> [!div class="sxs-lookup" renderon="portal"]
> #### Step 3: Admin consent

> [!div renderon="docs"]
> #### Step 4: Admin consent

If you try to run the application at this point, you'll receive *HTTP 403 - Forbidden* error: `Insufficient privileges to complete the operation`. This happens because any *app-only permission* requires Admin consent, which means that a global administrator of your directory must give consent to your application. Select one of the options below depending on your role:

##### Global tenant administrator

> [!div renderon="docs"]
> If you are a global tenant administrator, go to **API Permissions** page in the Azure Portal's Application Registration (Preview) and select **Grant admin consent for {Tenant Name}** (Where {Tenant Name} is the name of your directory).

> [!div renderon="portal" class="sxs-lookup"]
> If you are a global administrator, go to **API Permissions** page select **Grant admin consent for Enter_the_Tenant_Name_Here**
> > [!div id="apipermissionspage"]
> > [Go to the API Permissions page]()

##### Standard user

If you're a standard user of your tenant, then you need to ask a global administrator to grant admin consent for your application. To do this, give the following URL to your administrator:

```url
https://login.microsoftonline.com/Enter_the_Tenant_Id_Here/adminconsent?client_id=Enter_the_Application_Id_Here
```

> [!div renderon="docs"]
>> Where:
>> * `Enter_the_Tenant_Id_Here` - replace this value with the **Tenant Id** or **Tenant name** (for example, contoso.microsoft.com)
>> * `Enter_the_Application_Id_Here` - is the **Application (client) ID** for the application you registered.

> [!NOTE]
> You may see the error *'AADSTS50011: No reply address is registered for the application'* after granting consent to the app using the preceding URL. This happen because this application and the URL do not have a redirect URI - please ignore the error.

> [!div class="sxs-lookup" renderon="portal"]
> #### Step 4: Run the application

> [!div renderon="docs"]
> #### Step 5: Run the application

If you're using Visual Studio, press **F5** to run the application, otherwise, run the application via command prompt or console:

```console
cd {ProjectFolder}\daemon-console\1-Call-Graph
dotnet run
```

> Where:
> * *{ProjectFolder}* is the folder where you extracted the zip file. Example **C:\Azure-Samples\active-directory-dotnetcore-daemon-v2**

You should see a list of users in your Azure AD directory as result.

> [!IMPORTANT]
> This quickstart application uses a client secret to identify itself as confidential client. Because the client secret is added as a plain-text to your project files, for security reasons, it is recommended that you use a certificate instead of a client secret before considering the application as production application. For more information on how to use a certificate, see [these instructions](https://github.com/Azure-Samples/active-directory-dotnetcore-daemon-v2/#variation-daemon-application-using-client-credentials-with-certificates) in the GitHub repository for this sample.

## More information

### How the sample works
![Shows how the sample app generated by this quickstart works](media/quickstart-v2-netcore-daemon/netcore-daemon-intro.svg)

### MSAL.NET

MSAL ([Microsoft.Identity.Client](https://www.nuget.org/packages/Microsoft.Identity.Client)) is the library used to sign in users and request tokens used to access an API protected by Microsoft identity platform. As described, this quickstart requests tokens by using the application own identity instead of delegated permissions. The authentication flow used in this case is known as *[client credentials oauth flow](v2-oauth2-client-creds-grant-flow.md)*. For more information on how to use MSAL.NET with client credentials flow, see [this article](https://aka.ms/msal-net-client-credentials).

 You can install MSAL.NET by running the following command in Visual Studio's **Package Manager Console**:

```powershell
Install-Package Microsoft.Identity.Client
```

Alternatively, if you are not using Visual Studio, you can run the following command to add MSAL to your project:

```console
dotnet add package Microsoft.Identity.Client
```

### MSAL initialization

You can add the reference for MSAL by adding the following code:

```csharp
using Microsoft.Identity.Client;
```

Then, initialize MSAL using the following code:

```csharp
IConfidentialClientApplication app;
app = ConfidentialClientApplicationBuilder.Create(config.ClientId)
                                          .WithClientSecret(config.ClientSecret)
                                          .WithAuthority(new Uri(config.Authority))
                                          .Build();
```

> | Where: | Description |
> |---------|---------|
> | `config.ClientSecret` | Is the client secret created for the application in Azure Portal. |
> | `config.ClientId` | Is the **Application (client) ID** for the application registered in the Azure portal. You can find this value in the app's **Overview** page in the Azure portal. |
> | `config.Authority`    | (Optional) The STS endpoint for user to authenticate. Usually <https://login.microsoftonline.com/{tenant}> for public cloud, where {tenant} is the name of your tenant or your tenant Id.|

For more information, please see the [reference documentation for `ConfidentialClientApplication`](https://docs.microsoft.com/dotnet/api/microsoft.identity.client.iconfidentialclientapplication?view=azure-dotnet)

### Requesting tokens

To request a token using app's identity, use `AcquireTokenForClient` method:

```csharp
result = await app.AcquireTokenForClient(scopes)
                  .ExecuteAsync();
```

> |Where:| Description |
> |---------|---------|
> | `scopes` | Contains the scopes requested. For confidential clients, this should use the format similar to `{Application ID URI}/.default` to indicate that the scopes being requested are the ones statically defined in the app object set in the Azure Portal (for Microsoft Graph, `{Application ID URI}` points to `https://graph.microsoft.com`). For custom web APIs, `{Application ID URI}` is defined under **Expose an API** section in Azure Portal's Application Registration (Preview). |

For more information, please see the [reference documentation for `AcquireTokenForClient`](https://docs.microsoft.com/dotnet/api/microsoft.identity.client.confidentialclientapplication.acquiretokenforclient?view=azure-dotnet)

[!INCLUDE [Help and support](../../../includes/active-directory-develop-help-support-include.md)]

## Next steps

To learn more about daemon applications, see the scenario landing page

> [!div class="nextstepaction"]
> [Daemon application that calls web APIs](scenario-daemon-overview.md)

For the daemon application tutorial, see:

> [!div class="nextstepaction"]
> [Daemon .NET Core console tutorial](https://github.com/Azure-Samples/active-directory-dotnetcore-daemon-v2)

Learn more about permissions and consent:

> [!div class="nextstepaction"]
> [Permissions and Consent](v2-permissions-and-consent.md)

To know more about the auth flow for this scenario, see the Oauth 2.0 client credentials flow:

> [!div class="nextstepaction"]
> [Client credentials Oauth flow](v2-oauth2-client-creds-grant-flow.md)
