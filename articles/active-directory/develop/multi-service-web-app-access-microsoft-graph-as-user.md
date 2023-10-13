---
title: Tutorial - Web app accesses Microsoft Graph as the user
description: In this tutorial, you learn how to access data in Microsoft Graph from a web app for a signed-in user.
services: microsoft-graph, app-service-web
author: rwike77
manager: CelesteDG

ms.service: app-service
ms.topic: tutorial
ms.workload: identity
ms.date: 09/15/2023
ms.author: ryanwi
ms.reviewer: stsoneff
ms.devlang: csharp, javascript
ms.custom: azureday1
#Customer intent: As an application developer, I want to learn how to access data in Microsoft Graph from a web app for a signed-in user.
ms.subservice: web-apps
---

# Tutorial: Access Microsoft Graph from a secured app as the user

Learn how to access Microsoft Graph from a web app running on Azure App Service.

:::image type="content" alt-text="Diagram that shows accessing Microsoft Graph." source="./media/multi-service-web-app-access-microsoft-graph/web-app-access-graph.svg" border="false":::

You want to add access to Microsoft Graph from your web app and perform some action as the signed-in user. This section describes how to grant delegated permissions to the web app and get the signed-in user's profile information from Microsoft Entra ID.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Grant delegated permissions to a web app.
> * Call Microsoft Graph from a web app for a signed-in user.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

* A web application running on Azure App Service that has the [App Service authentication/authorization module enabled](multi-service-web-app-authentication-app-service.md).

## Grant front-end access to call Microsoft Graph

Now that you've enabled authentication and authorization on your web app, the web app is registered with the Microsoft identity platform and is backed by a Microsoft Entra application. In this step, you give the web app permissions to access Microsoft Graph for the user. (Technically, you give the web app's Microsoft Entra application the permissions to access the Microsoft Graph Microsoft Entra application for the user.)

In the [Microsoft Entra admin center](https://entra.microsoft.com) menu, select **Applications**.

Select **App registrations** > **Owned applications** > **View all applications in this directory**. Select your web app name, and then select **API permissions**.

Select **Add a permission**, and then select Microsoft APIs and Microsoft Graph.

Select **Delegated permissions**, and then select **User.Read** from the list. Select **Add permissions**.

## Configure App Service to return a usable access token

The web app now has the required permissions to access Microsoft Graph as the signed-in user. In this step, you configure App Service authentication and authorization to give you a usable access token for accessing Microsoft Graph. For this step, you need to add the User.Read scope for the downstream service (Microsoft Graph): `https://graph.microsoft.com/User.Read`.

> [!IMPORTANT]
> If you don't configure App Service to return a usable access token, you receive a ```CompactToken parsing failed with error code: 80049217``` error when you call Microsoft Graph APIs in your code.

# [Azure Resource Explorer](#tab/azure-resource-explorer)
Go to [Azure Resource Explorer](https://resources.azure.com/) and using the resource tree, locate your web app. The resource URL should be similar to `https://resources.azure.com/subscriptions/subscriptionId/resourceGroups/SecureWebApp/providers/Microsoft.Web/sites/SecureWebApp20200915115914`.
[//]: # (BROKEN LINK HttpLinkUnauthorized ABOVE: https://resources.azure.com/)

The Azure Resource Explorer is now opened with your web app selected in the resource tree. At the top of the page, select **Read/Write** to enable editing of your Azure resources.

In the left browser, drill down to **config** > **authsettingsV2**.

In the **authsettingsV2** view, select **Edit**. Find the **login** section of **identityProviders** -> **azureActiveDirectory** and add the following **loginParameters** settings: `"loginParameters":[ "response_type=code id_token","scope=openid offline_access profile https://graph.microsoft.com/User.Read" ]` .

```json
"identityProviders": {
    "azureActiveDirectory": {
      "enabled": true,
      "login": {
        "loginParameters":[
          "response_type=code id_token",
          "scope=openid offline_access profile https://graph.microsoft.com/User.Read"
        ]
      }
    }
  }
},
```

Save your settings by selecting **PUT**. This setting can take several minutes to take effect. Your web app is now configured to access Microsoft Graph with a proper access token. If you don't, Microsoft Graph returns an error saying that the format of the compact token is incorrect.

# [Azure CLI](#tab/azure-cli)

Use the Azure CLI to call the App Service Web App REST APIs to [get](/rest/api/appservice/web-apps/get-auth-settings) and [update](/rest/api/appservice/web-apps/update-auth-settings) the auth configuration settings so your web app can call Microsoft Graph. Open a command window and login to Azure CLI:

```azurecli
az login
```

Get your existing 'config/authsettingsv2’ settings and save to a local *authsettings.json* file.

```azurecli
az rest --method GET --url '/subscriptions/{SUBSCRIPTION_ID}/resourceGroups/{RESOURCE_GROUP}/providers/Microsoft.Web/sites/{WEBAPP_NAME}/config/authsettingsv2/list?api-version=2020-06-01' > authsettings.json
```

Open the authsettings.json file using your preferred text editor. Find the **login** section of **identityProviders** -> **azureActiveDirectory** and add the following **loginParameters** settings: `"loginParameters":[ "response_type=code id_token","scope=openid offline_access profile https://graph.microsoft.com/User.Read" ]` .

```json
"identityProviders": {
    "azureActiveDirectory": {
      "enabled": true,
      "login": {
        "loginParameters":[
          "response_type=code id_token",
          "scope=openid offline_access profile https://graph.microsoft.com/User.Read"
        ]
      }
    }
  }
},
```

Save your changes to the *authsettings.json* file and upload the local settings to your web app:

```azurecli
az rest --method PUT --url '/subscriptions/{SUBSCRIPTION_ID}/resourceGroups/{RESOURCE_GROUP}/providers/Microsoft.Web/sites/{WEBAPP_NAME}/config/authsettingsv2?api-version=2020-06-01' --body @./authsettings.json
```
---

## Call Microsoft Graph

Your web app now has the required permissions and also adds Microsoft Graph's client ID to the login parameters.

# [C#](#tab/programming-language-csharp)
Using the [Microsoft.Identity.Web library](https://github.com/AzureAD/microsoft-identity-web/), the web app gets an access token for authentication with Microsoft Graph. In version 1.2.0 and later, the Microsoft.Identity.Web library integrates with and can run alongside the App Service authentication/authorization module. Microsoft.Identity.Web detects that the web app is hosted in App Service and gets the access token from the App Service authentication/authorization module. The access token is then passed along to authenticated requests with the Microsoft Graph API.

To see this code as part of a sample application, see the [sample on GitHub](https://github.com/Azure-Samples/ms-identity-easyauth-dotnet-storage-graphapi/tree/main/2-WebApp-graphapi-on-behalf).

> [!NOTE]
> The Microsoft.Identity.Web library isn't required in your web app for basic authentication/authorization or to authenticate requests with Microsoft Graph. It's possible to [securely call downstream APIs](/azure/app-service/tutorial-auth-aad#call-api-securely-from-server-code) with only the App Service authentication/authorization module enabled.
> 
> However, the App Service authentication/authorization is designed for more basic authentication scenarios. For more complex scenarios (handling custom claims, for example), you need the Microsoft.Identity.Web library or [Microsoft Authentication Library](msal-overview.md). There's a little more setup and configuration work in the beginning, but the Microsoft.Identity.Web library can run alongside the App Service authentication/authorization module. Later, when your web app needs to handle more complex scenarios, you can disable the App Service authentication/authorization module and Microsoft.Identity.Web will already be a part of your app.

### Install client library packages

Install the [Microsoft.Identity.Web](https://www.nuget.org/packages/Microsoft.Identity.Web/) and [Microsoft.Identity.Web.GraphServiceClient](https://www.nuget.org/packages/Microsoft.Identity.Web.GraphServiceClient) NuGet packages in your project by using the .NET Core command-line interface or the Package Manager Console in Visual Studio.

#### .NET Core command line

Open a command line, and switch to the directory that contains your project file.

Run the install commands.

```dotnetcli
dotnet add package Microsoft.Identity.Web.GraphServiceClient

dotnet add package Microsoft.Identity.Web
```

#### Package Manager Console

Open the project/solution in Visual Studio, and open the console by using the **Tools** > **NuGet Package Manager** > **Package Manager Console** command.

Run the install commands.
```powershell
Install-Package Microsoft.Identity.Web.GraphServiceClient

Install-Package Microsoft.Identity.Web
```

### Startup.cs

In the *Startup.cs* file, the ```AddMicrosoftIdentityWebApp``` method adds Microsoft.Identity.Web to your web app. The ```AddMicrosoftGraph``` method adds Microsoft Graph support.

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
      services.AddOptions();
      string[] initialScopes = Configuration.GetValue<string>("DownstreamApi:Scopes")?.Split(' ');

      services.AddAuthentication(OpenIdConnectDefaults.AuthenticationScheme)
              .AddMicrosoftIdentityWebApp(Configuration.GetSection("AzureAd"))
              .EnableTokenAcquisitionToCallDownstreamApi(initialScopes)
                      .AddMicrosoftGraph(Configuration.GetSection("DownstreamApi"))
                      .AddInMemoryTokenCaches(); 

      services.AddAuthorization(options =>
      {
          // By default, all incoming requests will be authorized according to the default policy
          options.FallbackPolicy = options.DefaultPolicy;
      });
      services.AddRazorPages()
          .AddMvcOptions(options => {})                
          .AddMicrosoftIdentityUI();

      services.AddControllersWithViews()
              .AddMicrosoftIdentityUI();
    }
}

```

### appsettings.json

*Microsoft Entra ID* specifies the configuration for the Microsoft.Identity.Web library. In the [Microsoft Entra admin center](https://entra.microsoft.com), select **Applications** from the portal menu and then select **App registrations**. Select the app registration created when you enabled the App Service authentication/authorization module. (The app registration should have the same name as your web app.) You can find the tenant ID and client ID in the app registration overview page. The domain name can be found in the Microsoft Entra overview page for your tenant.

*Graph* specifies the Microsoft Graph endpoint and the initial scopes needed by the app.

```json
{
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "Domain": "[Enter the domain of your tenant, e.g. contoso.onmicrosoft.com]",
    "TenantId": "[Enter 'common', or 'organizations' or the Tenant Id (Obtained from the Entra admin center. Select 'Endpoints' from the 'App registrations' blade and use the GUID in any of the URLs), e.g. da41245a5-11b3-996c-00a8-4d99re19f292]",
    "ClientId": "[Enter the Client Id (Application ID obtained from the Microsoft Entra admin center), e.g. ba74781c2-53c2-442a-97c2-3d60re42f403]",
    "ClientSecret": "[Copy the client secret added to the app from the Microsoft Entra admin center]",
    "ClientCertificates": [
    ],
    // the following is required to handle Continuous Access Evaluation challenges
    "ClientCapabilities": [ "cp1" ],
    "CallbackPath": "/signin-oidc"
  },
  "DownstreamApis": {
    "MicrosoftGraph": {
      // Specify BaseUrl if you want to use Microsoft graph in a national cloud.
      // See https://learn.microsoft.com/graph/deployments#microsoft-graph-and-graph-explorer-service-root-endpoints
      // "BaseUrl": "https://graph.microsoft.com/v1.0",

      // Set RequestAppToken this to "true" if you want to request an application token (to call graph on 
      // behalf of the application). The scopes will then automatically
      // be ['https://graph.microsoft.com/.default'].
      // "RequestAppToken": false

      // Set Scopes to request (unless you request an app token).
      "Scopes": [ "User.Read" ]

      // See https://aka.ms/ms-id-web/downstreamApiOptions for all the properties you can set.
    }
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

The following example shows how to call Microsoft Graph as the signed-in user and get some user information. The ```GraphServiceClient``` object is injected into the controller, and authentication has been configured for you by the Microsoft.Identity.Web library.

```csharp
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Graph;
using System.IO;
using Microsoft.Identity.Web;
using Microsoft.Extensions.Logging;

// Some code omitted for brevity.

[AuthorizeForScopes(Scopes = new[] { "User.Read" })]
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
            var user = await _graphServiceClient.Me.GetAsync();
            ViewData["Me"] = user;
            ViewData["name"] = user.DisplayName;

            using (var photoStream = await _graphServiceClient.Me.Photo.Content.GetAsync())
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

# [Node.js](#tab/programming-language-nodejs)

Using a custom **AuthProvider** class that encapsulates authentication logic, the web app gets the user's access token from the incoming requests header. The **AuthProvider** instance detects that the web app is hosted on App Service and gets the access token from the App Service authentication/authorization module. The access token is then passed down to the Microsoft Graph SDK client to make an authenticated request to the `/me` endpoint.

To see this code as part of a sample application, see *graphController.js* in the [sample on GitHub](https://github.com/Azure-Samples/ms-identity-easyauth-nodejs-storage-graphapi/tree/main/2-WebApp-graphapi-on-behalf).

> [!NOTE]
> The App Service authentication/authorization is designed for more basic authentication scenarios. Later, when your web app needs to handle more complex scenarios, you can disable the App Service authentication/authorization module and the **AuthProvider** instance in the sample will fallback to use [MSAL Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node), which is the recommended library for adding authentication/authorization to Node.js applications.

```nodejs
const graphHelper = require('../utils/graphHelper');

// Some code omitted for brevity.

exports.getProfilePage = async(req, res, next) => {

    try {
        const graphClient = graphHelper.getAuthenticatedClient(req.session.protectedResources["graphAPI"].accessToken);

        const profile = await graphClient
            .api('/me')
            .get();

        res.render('profile', { isAuthenticated: req.session.isAuthenticated, profile: profile, appServiceName: appServiceName });   
    } catch (error) {
        next(error);
    }
}
```

To query Microsoft Graph, use the [Microsoft Graph JavaScript SDK](https://github.com/microsoftgraph/msgraph-sdk-javascript). The code for this is located in [utils/graphHelper.js](https://github.com/Azure-Samples/ms-identity-easyauth-nodejs-storage-graphapi/blob/main/2-WebApp-graphapi-on-behalf/utils/graphHelper.js):

```nodejs
const graph = require('@microsoft/microsoft-graph-client');

// Some code omitted for brevity.

getAuthenticatedClient = (accessToken) => {
    // Initialize Graph client
    const client = graph.Client.init({
        // Use the provided access token to authenticate requests
        authProvider: (done) => {
            done(null, accessToken);
        }
    });

    return client;
}
```
---

## Clean up resources

If you're finished with this tutorial and no longer need the web app or associated resources, [clean up the resources you created](multi-service-web-app-clean-up-resources.md).

## Next steps

> [!div class="nextstepaction"]
> [App service accesses Microsoft Graph as the app](multi-service-web-app-access-microsoft-graph-as-app.md)
