---
title: "Tutorial: Call an API and display the results"
description: Call an API and display the results.
author: davidmu1
ms.author: davidmu
manager: CelesteDG
ms.service: active-directory
ms.topic: tutorial
ms.date: 10/18/2022
#Customer intent: As an application developer, I want to use my app to call a web API, in this case Microsoft Graph. I need to know how to modify my 
---

# Tutorial: Call an API and display the results

At this point, the application can be configured to call an API. For the purposes of this tutorial, the Microsoft Graph API will be called to display the profile information of the logged-in user. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Configure the application to know about the API
> * Add authorization to a class
> * Add code to call the API
> * Test the application

## Prerequisites

* Completion of the prerequisites and steps in [Tutorial: Prepare an application for authentication in the tenant](web-app-tutorial-04-prepare-tenant-app.md).
* Although any integrated development environment (IDE) that supports .NET applications can be used, the following IDEs are used for this tutorial. They can be downloaded from the [Downloads](https://visualstudio.microsoft.com/downloads) page.
    - Visual Studio 2022
    - Visual Studio Code
    - Visual Studio 2022 for Mac

## Add the API configuration

Open the *appsettings.json* file and add a reference to `"DownstreamAPI"` to configure the API. The *.json* file should take the following format:

```csharp
{
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "TenantId": "Enter the tenant ID here",
    "ClientId": "Enter the client ID here",
    "ClientCertificates": [
      {
        "SourceType": "StoreWithThumbprint",
        "CertificateStorePath": "CurrentUser/My",
        "CertificateThumbprint": "Enter the certificate thumbprint here"
      }    
    ],
    "CallbackPath": "/signin-oidc"
  },
  "DownstreamApi": {
    "BaseUrl": "https://graph.microsoft.com/v1.0/me",
    "Scopes": "user.read"
      },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

This previous configuration definition defines an endpoint for accessing Microsoft Graph. To define the configuration for an application owned by the organization, the value of the `Scopes` attribute is slightly different. The application URI is combined with the specified scope.

## Get the configuration settings and acquire a token

1. Open the *Program.cs* file and add the following code after the definition of `var builder` to retrieve the defined scopes from the configuration:

    ```csharp
    IEnumerable<string>? initialScopes = builder.Configuration["DownstreamApi:Scopes"]?.Split(' ');
    ```

1. Directly below the code added in the previous step, add the following code to configure the service to acquire a token:

   ```csharp
   builder.Services.AddMicrosoftIdentityWebAppAuthentication(builder.Configuration, "AzureAd")
    .EnableTokenAcquisitionToCallDownstreamApi(initialScopes)
        .AddDownstreamWebApi("DownstreamApi", builder.Configuration.GetSection("DownstreamApi"))
        .AddInMemoryTokenCaches();
   ```

## Call the API and display the results

The `AuthorizeForScopes` attribute is provided by `Microsoft.Identity.Web`. It makes sure that the user is asked for consent if needed, and incrementally.

1. Under **Pages**, open the *Index.cshtml.cs* file and add the following to the top of the file;

    ```csharp
    using System.Text.Json;
    using Microsoft.Identity.Web;
    ```

1. Add the `AuthorizeForScopes` attribute to the `IndexModel` class:

    ```csharp
    [AuthorizeForScopes(ScopeKeySection = "DownstreamApi:Scopes")]
    public class IndexModel : PageModel
    ```

1. Add the following code to define the API object:
    ```csharp
    private readonly IDownstreamWebApi _downstreamWebApi;
    ```

1. Add the API object to the logger:
    ```csharp
    public IndexModel(ILogger<IndexModel> logger, IDownstreamWebApi downstreamWebApi)
    {
      _logger = logger;
      _downstreamWebApi = downstreamWebApi;
    }
    ```

1. Add the following code to call the API and display the result:

    ```csharp
    public async Task OnGet()
    {
      using var response = await _downstreamWebApi.CallWebApiForUserAsync("DownstreamApi").ConfigureAwait(false);
      if (response.StatusCode == System.Net.HttpStatusCode.OK)
      {
        var apiResult = await response.Content.ReadFromJsonAsync<JsonDocument>().ConfigureAwait(false);
        ViewData["ApiResult"] = JsonSerializer.Serialize(apiResult, new JsonSerializerOptions { WriteIndented = true });
      }
      else
      {
        var error = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
        throw new HttpRequestException($"Invalid status code in the HttpResponseMessage: {response.StatusCode}: {error}");
      }
    }
    ```

1. Now open the *Index.cshtml* file, which handles how the API is displayed to the user. Add the following code at the bottom of the file.

	```html
    <p>Before rendering the page, the Page Model was able to make a call to Microsoft Graph's <code>/me</code> API for your user and received the following:</p>

    <p><pre><code class="language-js">@ViewData["ApiResult"]</code></pre></p>

    <p>Refreshing this page will continue to use the cached access token acquired for Microsoft Graph, which is valid for future page views will attempt to refresh this token as it nears its expiration.</p>
    ```

## Test the application

### [Visual Studio](#tab/visual-studio)
1. In Visual Studio, start the application by selecting **Start without debugging**.
1. Select **Accept** to accept the request for permissions. Information similar to the following example should be displayed:


### [Visual Studio Code](#tab/visual-studio-code)
1. In Visual Studio Code, start the application by typing the following in the terminal;

    ```powershell
    dotnet run
    ```
1. Select **Accept** to accept the request for permissions. Information similar to the following example should be displayed:


### [Visual Studio for Mac](#tab/visual-studio-for-mac)
1. In Visual Studio, start the application by selecting the **Play the executing solution**.
1. Accept, trust and allow requests and changes to be made if any pop-up windows appear. Information similar to the following example should be displayed:

---

:::image type="content" source="./media/web-app-tutorial-05-call-web-api/display-api-call-results.png" alt-text="Screenshot depicting the results of the API call.":::

## See also

Completion of this tutorial set can be the first part of the potential developer journey. The following can guide the experience even further by using resources available on the Microsoft identity platform. <!-- Not perfect, needs changing -->

> [!div class="nextstepaction"]
> [Tutorial: Register a web API with the Microsoft identity platform](web-app-tutorial-01-register-application.md)
<!-- Directed to start -->

## Next steps

> [!div class="nextstepaction"]
> [How to add multi-factor authentication to your web app](web-app-tutorial-01-register-application.md)