---
title: Immersive Reader C# client library quickstart 
titleSuffix: Azure AI services
description: Learn how to build a web app using C#, and add the Immersive Reader API functionality.
#services: cognitive-services
author: sharmas
manager: nitinme
ms.service: azure-ai-immersive-reader
ms.topic: include
ms.date: 02/14/2024
ms.author: sharmas
ms.custom: "devx-track-js, devx-track-csharp"
---

In this quickstart guide, you build a web app from scratch using C#, and integrate Immersive Reader using the client library. A full working sample of this quickstart is [available on GitHub](https://github.com/microsoft/immersive-reader-sdk/tree/master/js/samples/quickstart-csharp).

## Prerequisites

* An Azure subscription. You can [create one for free](https://azure.microsoft.com/free/ai-services).
* An Immersive Reader resource configured for Microsoft Entra authentication. Follow [these instructions](../../how-to-create-immersive-reader.md) to get set up. Save the output of your session into a text file so you can configure the environment properties.
* [Visual Studio 2022](https://visualstudio.microsoft.com/downloads).

## Create a web app project

Create a new project in Visual Studio, using the ASP.NET Core Web Application template with built-in Model-View-Controller, and ASP.NET Core 6. Name the project *QuickstartSampleWebApp*.

:::image type="content" source="../../media/quickstart-csharp/1-create-project.png" alt-text="Screenshot of Visual Studio screen to create new project.":::

:::image type="content" source="../../media/quickstart-csharp/2-configure-project.png" alt-text="Screenshot of Visual Studio screen to configure project.":::

:::image type="content" source="../../media/quickstart-csharp/3-create-mvc.png" alt-text="Screenshot of Aspnet core web app screen.":::

## Set up authentication

Right-click on the project in the **Solution Explorer** and choose **Manage User Secrets**. This opens a file called *secrets.json*. This file isn't checked into source control. To learn more, see [Safe storage of app secrets](/aspnet/core/security/app-secrets?tabs=windows). Replace the contents of *secrets.json* with the following, supplying the values given when you created your Immersive Reader resource.

> [!IMPORTANT]
> Remember to never post secrets publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../key-vault/general/overview.md).

```json
{
  "TenantId": "YOUR_TENANT_ID",
  "ClientId": "YOUR_CLIENT_ID",
  "ClientSecret": "YOUR_CLIENT_SECRET",
  "Subdomain": "YOUR_SUBDOMAIN"
}
```

### Install Identity Client NuGet package

The following code uses objects from the `Microsoft.Identity.Client` NuGet package so you need to add a reference to that package in your project.

> [!IMPORTANT]
> The [Microsoft.IdentityModel.Clients.ActiveDirectory](https://www.nuget.org/packages/Microsoft.IdentityModel.Clients.ActiveDirectory) NuGet package and Azure AD Authentication Library (ADAL) have been deprecated. No new features have been added since June 30, 2020. We strongly encourage you to upgrade. For more information, see the [migration guide](/entra/identity-platform/msal-migration).

Open the NuGet Package Manager Console from **Tools** -> **NuGet Package Manager** -> **Package Manager Console** and run the following command:

```console
    Install-Package Microsoft.Identity.Client -Version 4.59.0
```

### Update the controller to acquire the token

Open *Controllers\HomeController.cs*, and add the following code after the `using` statements at the top of the file.

```csharp
using Microsoft.Identity.Client;
```

Configure the controller to obtain the Microsoft Entra ID values from *secrets.json*. At the top of the `HomeController` class, after ```public class HomeController : Controller {```, add the following code.

```csharp
private readonly string TenantId;     // Azure subscription TenantId
private readonly string ClientId;     // Microsoft Entra ApplicationId
private readonly string ClientSecret; // Microsoft Entra Application Service Principal password
private readonly string Subdomain;    // Immersive Reader resource subdomain (resource 'Name' if the resource was created in the Azure portal, or 'CustomSubDomain' option if the resource was created with Azure CLI PowerShell. Check the Azure portal for the subdomain on the Endpoint in the resource Overview page, for example, 'https://[SUBDOMAIN].cognitiveservices.azure.com/')

private IConfidentialClientApplication _confidentialClientApplication;
private IConfidentialClientApplication ConfidentialClientApplication
{
    get {
        if (_confidentialClientApplication == null) {
            _confidentialClientApplication = ConfidentialClientApplicationBuilder.Create(ClientId)
            .WithClientSecret(ClientSecret)
            .WithAuthority($"https://login.windows.net/{TenantId}")
            .Build();
        }

        return _confidentialClientApplication;
    }
}

public HomeController(Microsoft.Extensions.Configuration.IConfiguration configuration)
{
    TenantId = configuration["TenantId"];
    ClientId = configuration["ClientId"];
    ClientSecret = configuration["ClientSecret"];
    Subdomain = configuration["Subdomain"];

    if (string.IsNullOrWhiteSpace(TenantId))
    {
        throw new ArgumentNullException("TenantId is null! Did you add that info to secrets.json?");
    }

    if (string.IsNullOrWhiteSpace(ClientId))
    {
        throw new ArgumentNullException("ClientId is null! Did you add that info to secrets.json?");
    }

    if (string.IsNullOrWhiteSpace(ClientSecret))
    {
        throw new ArgumentNullException("ClientSecret is null! Did you add that info to secrets.json?");
    }

    if (string.IsNullOrWhiteSpace(Subdomain))
    {
        throw new ArgumentNullException("Subdomain is null! Did you add that info to secrets.json?");
    }
}

/// <summary>
/// Get a Microsoft Entra ID authentication token
/// </summary>
public async Task<string> GetTokenAsync()
{
    const string resource = "https://cognitiveservices.azure.com/";

    var authResult = await ConfidentialClientApplication.AcquireTokenForClient(
        new[] { $"{resource}/.default" })
        .ExecuteAsync()
        .ConfigureAwait(false);

    return authResult.AccessToken;
}

[HttpGet]
public async Task<JsonResult> GetTokenAndSubdomain()
{
    try
    {
        string tokenResult = await GetTokenAsync();

        return new JsonResult(new { token = tokenResult, subdomain = Subdomain });
    }
    catch (Exception e)
    {
        string message = "Unable to acquire Microsoft Entra token. Check the console for more information.";
        Debug.WriteLine(message, e);
        return new JsonResult(new { error = message });
    }
}
```

## Add sample content

First, open *Views\Shared\Layout.cshtml*. Before the line ```</head>```, add the following code:

```html
@RenderSection("Styles", required: false)
```

Now add sample content to this web app. Open *Views\Home\Index.cshtml* and replace all automatically generated code with this sample:

```html
@{
    ViewData["Title"] = "Immersive Reader C# Quickstart";
}

@section Styles {
    <style type="text/css">
        .immersive-reader-button {
            background-color: white;
            margin-top: 5px;
            border: 1px solid black;
            float: right;
        }
    </style>
}

<div class="container">
    <button class="immersive-reader-button" data-button-style="iconAndText" data-locale="en"></button>

    <h1 id="ir-title">About Immersive Reader</h1>
    <div id="ir-content" lang="en-us">
        <p>
            Immersive Reader is a tool that implements proven techniques to improve reading comprehension for emerging readers, language learners, and people with learning differences.
            The Immersive Reader is designed to make reading more accessible for everyone. The Immersive Reader
            <ul>
                <li>
                    Shows content in a minimal reading view
                </li>
                <li>
                    Displays pictures of commonly used words
                </li>
                <li>
                    Highlights nouns, verbs, adjectives, and adverbs
                </li>
                <li>
                    Reads your content out loud to you
                </li>
                <li>
                    Translates your content into another language
                </li>
                <li>
                    Breaks down words into syllables
                </li>
            </ul>
        </p>
        <h3>
            The Immersive Reader is available in many languages.
        </h3>
        <p lang="es-es">
            El Lector inmersivo está disponible en varios idiomas.
        </p>
        <p lang="zh-cn">
            沉浸式阅读器支持许多语言
        </p>
        <p lang="de-de">
            Der plastische Reader ist in vielen Sprachen verfügbar.
        </p>
        <p lang="ar-eg" dir="rtl" style="text-align:right">
            يتوفر \"القارئ الشامل\" في العديد من اللغات.
        </p>
    </div>
</div>
```

Notice that all of the text has a `lang` attribute, which describes the languages of the text. This attribute helps the Immersive Reader provide relevant language and grammar features.

## Add JavaScript to handle launching Immersive Reader

The Immersive Reader library provides functionality such as launching the Immersive Reader, and rendering Immersive Reader buttons. To learn more, see the [JavaScript SDK reference](../../reference.md).

At the bottom of *Views\Home\Index.cshtml*, add the following code:

```html
@section Scripts
{
    <script src="https://ircdname.azureedge.net/immersivereadersdk/immersive-reader-sdk.1.4.0.js"></script>
    <script>
        function getTokenAndSubdomainAsync() {
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: "@Url.Action("GetTokenAndSubdomain", "Home")",
                    type: "GET",
                    success: function (data) {
                        if (data.error) {
                            reject(data.error);
                        } else {
                            resolve(data);
                        }
                    },
                    error: function (err) {
                        reject(err);
                    }
                });
            });
        }
    
        $(".immersive-reader-button").click(function () {
            handleLaunchImmersiveReader();
        });
    
        function handleLaunchImmersiveReader() {
            getTokenAndSubdomainAsync()
                .then(function (response) {
                    const token = response["token"];
                    const subdomain = response["subdomain"];
    
                    // Learn more about chunk usage and supported MIME types https://learn.microsoft.com/azure/ai-services/immersive-reader/reference#chunk
                    const data = {
                        title: $("#ir-title").text(),
                        chunks: [{
                            content: $("#ir-content").html(),
                            mimeType: "text/html"
                        }]
                    };
    
                    // Learn more about options https://learn.microsoft.com/azure/ai-services/immersive-reader/reference#options
                    const options = {
                        "onExit": exitCallback,
                        "uiZIndex": 2000
                    };
    
                    ImmersiveReader.launchAsync(token, subdomain, data, options)
                        .catch(function (error) {
                            alert("Error in launching the Immersive Reader. Check the console.");
                            console.log(error);
                        });
                })
                .catch(function (error) {
                    alert("Error in getting the Immersive Reader token and subdomain. Check the console.");
                    console.log(error);
                });
        }
    
        function exitCallback() {
            console.log("This is the callback function. It is executed when the Immersive Reader closes.");
        }
    </script>
}
```

## Build and run the app

From the menu bar, select **Debug > Start Debugging**, or press **F5** to start the application.

In your browser, you should see:

:::image type="content" source="../../media/quickstart-csharp/4-build-app.png" alt-text="Screenshot of the app running in the browser.":::

### Launch the Immersive Reader

When you select the **Immersive Reader** button, the Immersive Reader launches with the content on the page.

:::image type="content" source="../../media/quickstart-csharp/5-view-immersive-reader.png" alt-text="Screenshot of the Immersive Reader app.":::

## Next step

> [!div class="nextstepaction"]
> [Explore the Immersive Reader SDK reference](../../reference.md)
