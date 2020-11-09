---
title: Tutorial - web app accesses Microsoft Graph as the user | Azure
description: In this tutorial, you learn how to access data in Microsoft Graph on behalf of a signed in user.
services: microsoft-graph, app-service-web
author: rwike77
manager: CelesteDG

ms.service: app-service-web
ms.topic: tutorial
ms.workload: identity
ms.date: 11/06/2020
ms.author: ryanwi
ms.reviewer: stsoneff
#Customer intent: As an application developer, I want to learn how to access data in Microsoft Graph on behalf of a signed-in user.
---

# Tutorial: access Microsoft Graph from a secured app as the user

Learn how to access Microsoft Graph from a web app running on Azure App Service.

:::image type="content" alt-text="Access Microsoft Graph" source="./media/scenario-secure-app-access-microsoft-graph/webapp-access-graph.svg" border="false":::

You want to add access to Microsoft Graph from your web app and perform some action as the signed-in user. This section describes how to grant delegated permissions to the web app and get the signed-in user's profile information from Azure Active Directory.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Grant delegated permissions to a web app
> * Call Microsoft Graph from a web app on behalf of a signed-in user

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

* A web application running on Azure App Service that has the [App Service authentication/authorization module enabled](scenario-secure-app-authentication-app-service.md).

## Grant front-end access to call Microsoft Graph

Now that you've enabled authentication and authorization on your web app, the web app is registered with the Microsoft identity platform and is backed by an Azure AD application. In this step, you give the web app permissions to access Microsoft Graph on the user's behalf. (Technically, you give the web app's Azure AD application the permissions to access Microsoft Graph's AD application on the user's behalf.)

In the [Azure portal](https://portal.azure.com) menu, select **Azure Active Directory** or search for and select Azure Active Directory from any page.

Select **App registrations** > **Owned applications** > **View all applications in this directory**. Select your web app name, then select **API permissions**.

Select **Add a permission**, then select Microsoft APIs, and Microsoft Graph.

Select **Delegated permissions** and select **User.Read** from the list.  Click **Add permissions**.

## Configure App Service to return a usable access token

The web app now has the required permissions to access Microsoft Graph as the signed-in user. In this step, you configure App Service authentication and authorization to give you a usable access token for accessing Microsoft Graph. For this step, you need the client/app ID of the downstream service (Microsoft Graph). *00000003-0000-0000-c000-000000000000* is the app ID of Microsoft Graph.

> [!IMPORTANT]
> If you do not configure App Service to return a usable access token, you receive a ```CompactToken parsing failed with error code: 80049217``` error when you call Microsoft Graph APIs in your code.

Navigate to [Azure Resource Explorer](https://resources.azure.com/) and using the resource tree, locate your web app.  The resource URL should be similar to: `https://resources.azure.com/subscriptions/subscription-id/resourceGroups/SecureWebApp/providers/Microsoft.Web/sites/SecureWebApp20200915115914`

The Azure Resource Explorer is now opened with your web app selected in the resource tree. At the top of the page, click **Read/Write** to enable editing of your Azure resources.

In the left browser, drill down to **config** > **authsettings**.

In the **authsettings** view, click **Edit**. Set ```additionalLoginParams``` to the following JSON string, using the client ID you copied.

```json
"additionalLoginParams": ["response_type=code id_token","resource=00000003-0000-0000-c000-000000000000"],
```

Save your settings by clicking **PUT**. This setting can take several minutes to take effect.  Your web app is now configured to access Microsoft Graph with a proper access token.  If you don't, Microsoft Graph returns an error saying that the format of the compact token is incorrect.

## Call Microsoft Graph (.NET)

Your web app now has the required permissions and also adds Microsoft Graph's client ID to the login parameters. Using the [Microsoft.Identity.Web library](https://github.com/AzureAD/microsoft-identity-web/), the web app gets an access token for authentication with Microsoft Graph. In version 1.2.0 and later, the Microsoft.Identity.Web library integrates with and can run alongside the App Service authentication/authorization module.  Microsoft.Identity.Web detects that the web app is hosted in App Services and gets the access token from the App Services authentication/authorization module.  The access token is then passed along to authenticated requests with the Microsoft Graph API.

> [!NOTE]
> The Microsoft.Identity.Web library is not required in your web app for basic authentication/authorization or to authenticate requests with Microsoft Graph.  It is possible to [securely call downstream APIs](tutorial-auth-aad.md#call-api-securely-from-server-code) with only the App Service authentication/authorization module enabled.  
> However, the App Service authentication/authorization is designed for more basic authentication scenarios.  For more complex scenarios (handling custom claims, for example), you need the Microsoft.Identity.Web library or [Microsoft Authentication Library](/azure/active-directory/develop/msal-overview). There is a little more setup and configuration work in the beginning, but the Microsoft.Identity.Web library can run alongside the App Service authentication/authorization module.  Later, when your web app needs to handle more complex scenarios, you can disable the App Service authentication/authorization module and Microsoft.Identity.Web will already be a part of your app.

### Install client library packages

Install the [Microsoft.Identity.Web](https://www.nuget.org/packages/Microsoft.Identity.Web/) and [Microsoft.Graph](https://www.nuget.org/packages/Microsoft.Graph) NuGet packages in your project using the .NET Core command-line interface or the Package Manager Console in Visual Studio.

# [Command Line](#tab/command-line)

Open a command line and switch to the directory that contains your project file.

Run the install commands:

```dotnetcli
dotnet add package Microsoft.Graph

dotnet add package Microsoft.Identity.Web
```

# [Package Manager](#tab/package-manager)
Open the project/solution in Visual Studio, and open the console using the **Tools** > **NuGet Package Manager** > **Package Manager Console** command.

Run the install commands:
```powershell
Install-Package Microsoft.Graph

Install-Package Microsoft.Identity.Web
```

---

### Startup.cs

In the *Startup.cs* file, the ```AddMicrosoftIdentityWebApp``` method adds Microsoft.Identity.Web to your web app.  The ```AddMicrosoftGraph``` method adds Microsoft Graph support.

```csharp
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Identity.Web;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;

// Some code omitted for brevity.
public class Startup
{
    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddAuthentication(OpenIdConnectDefaults.AuthenticationScheme)
                .AddMicrosoftIdentityWebApp(Configuration.GetSection("AzureAd"))
                    .EnableTokenAcquisitionToCallDownstreamApi()
                        .AddMicrosoftGraph(Configuration.GetSection("Graph"))
                        .AddInMemoryTokenCaches();

        services.AddRazorPages();
    }
}

```

### appsettings.json

*AzureAd* specifies the configuration for the Microsoft.Identity.Web library.  In the [Azure portal](https://portal.azure.com), select **Azure Active Directory** from the portal menu and select **App registrations**. Select the app registration created when you enabled the App Service authentication/authorization module (the app registration should have the same name as your web app).  You can find the tenant ID and client ID in the app registration overview page.  The domain name can be found in the Azure Active Directory overview page for your tenant.

*Graph* specifies the Microsoft Graph endpoint and the initial scopes needed by the app.

```json
{
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "Domain": "fourthcoffeetest.onmicrosoft.com",
    "TenantId": "[tenant-id]",
    "ClientId": "[client-id]",
    // To call an API
    "ClientSecret": "[secret-from-portal]", // Not required by this scenario
    "CallbackPath": "/signin-oidc"
  },

  "Graph": {
    "BaseUrl": "https://graph.microsoft.com/v1.0",
    "Scopes": "user.read"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  },
  "AllowedHosts": "*"
}
```

### Index.cshtml.cs

The following example shows how to call Microsoft Graph as the signed-in user and get some user info.  The ```GraphServiceClient``` object is injected into the controller and authentication has been configured for you by the Microsoft.Identity.Web library.

```csharp
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Graph;
using System.IO;
using Microsoft.Identity.Web;
using Microsoft.Extensions.Logging;

// Some code omitted for brevity.

[AuthorizeForScopes(Scopes = new[] { "user.read" })]
public class IndexModel : PageModel
{
    private readonly ILogger<IndexModel> _logger;
    private readonly GraphServiceClient _graphServiceClient;

    public IndexModel(ILogger<IndexModel> logger, GraphServiceClient graphServiceClient)
    {
        _logger = logger;
        _graphServiceClient = graphServiceClient;
    }

    public async Task OnGetAsync()
    {
        try
        {
            var user = await _graphServiceClient.Me.Request().GetAsync();
            ViewData["Me"] = user;
            ViewData["name"] = user.DisplayName;

            using (var photoStream = await _graphServiceClient.Me.Photo.Content.Request().GetAsync())
            {
                byte[] photoByte = ((MemoryStream)photoStream).ToArray();
                ViewData["photo"] = Convert.ToBase64String(photoByte);
            }
        }
        catch (Exception ex)
        {
            ViewData["photo"] = null;
        }
    }
}
```

## Clean up resources

If you are done with this tutorial and no longer need the web app or associated resources, [clean up the resources you created](scenario-secure-app-clean-up-resources.md).

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
>
> * Grant delegated permissions to a web app
> * Call Microsoft Graph from a web app on behalf of a signed-in user

> [!div class="nextstepaction"]
> [App service accesses Microsoft Graph as the app](scenario-secure-app-access-microsoft-graph-as-app.md)
