---
title: "Quickstart: Create a web app that launches the Immersive Reader with C#"
titlesuffix: Azure Cognitive Services
description: In this quickstart, you build a web app from scratch and add the Immersive Reader API functionality.
services: cognitive-services
author: metanMSFT
manager: nitinme

ms.service: cognitive-services
ms.subservice: immersive-reader
ms.topic: quickstart
ms.date: 06/20/2019
ms.author: metan
#Customer intent: As a developer, I want to quickly integrate the Immersive Reader into my web application so that I can see the Immersive Reader in action and understand the value it provides.
---

# Quickstart: Create a web app that launches the Immersive Reader (C#)

The [Immersive Reader](https://www.onenote.com/learningtools) is an inclusively designed tool that implements proven techniques to improve reading comprehension.

In this quickstart, you build a web app from scratch and integrate the Immersive Reader by using the Immersive Reader SDK. A full working sample of this quickstart is available [here](https://github.com/microsoft/immersive-reader-sdk/tree/master/samples/quickstart-csharp).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* [Visual Studio 2017](https://visualstudio.microsoft.com/downloads)
* An Immersive Reader resource configured for Azure Active Directory (AAD) authentication. Follow [these instructions](./aadauth) to get set up. You will need some of the values created here when configuring the sample project properties. Save the output of your session into a text file for future reference.

## Create a web app project

Create a new project in Visual Studio, using the ASP.NET Core Web Application template with built-in Model-View-Controller.

![New Project](./media/vswebapp.png)

![New ASP.NET Core Web Application](./media/vsmvc.png)

## Acquire an AAD authentication token

You need some values from the AAD auth configuration prerequisite step above for this part. Refer back to the text file you saved of that session.

````text
TenantId     => Azure subscription TenantId
ClientId     => AAD ApplicationId
ClientSecret => AAD Application Service Principal password
Subdomain    => Immersive Reader resource subdomain (resource 'Name' if the resource was created in the Azure portal, or 'CustomSubDomain' option if the resource was created with Azure CLI Powershell. Check the Azure portal for the subdomain on the Endpoint in the resource Overview page, for example, 'https://[SUBDOMAIN].cognitiveservices.azure.com/')
````

Right-click on the project in the _Solution Explorer_ and choose **Manage User Secrets**. This will open a file called _secrets.json_. Replace the contents of that file with the following, supplying your custom property values from above.

```json
{
  "TenantId": YOUR_TENANT_ID,
  "ClientId": YOUR_CLIENT_ID,
  "ClientSecret": YOUR_CLIENT_SECRET,
  "Subdomain": YOUR_SUBDOMAIN
}
```

Open _Controllers\HomeController.cs_, and replace the `HomeController` class with the following code.

```csharp
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Clients.ActiveDirectory;

namespace QuickstartSampleWebApp.Controllers
{
    public class HomeController : Controller
    {
        private readonly string TenantId;     // Azure subscription TenantId
        private readonly string ClientId;     // AAD ApplicationId
        private readonly string ClientSecret; // AAD Application Service Principal password
        private readonly string Subdomain;    // Immersive Reader resource subdomain (resource 'Name' if the resource was created in the Azure portal, or 'CustomSubDomain' option if the resource was created with Azure CLI Powershell. Check the Azure portal for the subdomain on the Endpoint in the resource Overview page, for example, 'https://[SUBDOMAIN].cognitiveservices.azure.com/')

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

        public IActionResult Index()
        {
            ViewData["Subdomain"] = Subdomain;

            return View();
        }

        [Route("token")]
        public async Task<string> Token()
        {
            return await GetTokenAsync();
        }

        /// <summary>
        /// Get an AAD authentication token
        /// </summary>
        private async Task<string> GetTokenAsync()
        {
            string authority = $"https://login.windows.net/{TenantId}";
            const string resource = "https://cognitiveservices.azure.com/";

            AuthenticationContext authContext = new AuthenticationContext(authority);
            ClientCredential clientCredential = new ClientCredential(ClientId, ClientSecret);

            AuthenticationResult authResult = await authContext.AcquireTokenAsync(resource, clientCredential);

            return authResult.AccessToken;
        }
    }
}
```

## Add the Microsoft.IdentityModel.Clients.ActiveDirectory NuGet package

The HomeController.cs code above uses objects from the **Microsoft.IdentityModel.Clients.ActiveDirectory** NuGet package so you will need to add a reference to that package in your project.

Open the NuGet Package Manager Console from Tools -> NuGet Package Manager -> Package Manager Console and type in the following at the console prompt:

    >Install-Package Microsoft.IdentityModel.Clients.ActiveDirectory -Version 5.1.0

## Add sample content

Now, we'll add some sample content to this web app. Open _Views\Home\Index.cshtml_ and replace the automatically generated code with this sample:

```html
<html>
<head>
    <meta charset='utf-8'>
    <title>Immersive Reader Example: Document</title>
    <script type='text/javascript' src='https://contentstorage.onenote.office.net/onenoteltir/immersivereadersdk/immersive-reader-sdk.0.0.2.js'></script>
    <meta name='viewport' content='width=device-width, initial-scale=1'>

    <script type='text/javascript'>
        var Subdomain = '@Html.Raw(ViewData["Subdomain"])';
    </script>
</head>
<body>
    <h1 id='title'>Geography</h1>
    <span id='content'>
        <p>The study of Earth’s landforms is called physical geography. Landforms can be mountains and valleys. They can also be glaciers, lakes or rivers. Landforms are sometimes called physical features. It is important for students to know about the physical geography of Earth. The seasons, the atmosphere and all the natural processes of Earth affect where people are able to live. Geography is one of a combination of factors that people use to decide where they want to live.</p>
        <p>The physical features of a region are often rich in resources. Within a nation, mountain ranges become natural borders for settlement areas. In the U.S., major mountain ranges are the Sierra Nevada, the Rocky Mountains, and the Appalachians.</p>
        <p>Fresh water sources also influence where people settle. People need water to drink. They also need it for washing. Throughout history, people have settled near fresh water. Living near a water source helps ensure that people have the water they need. There was an added bonus, too. Water could be used as a travel route for people and goods. Many Americans live near popular water sources, such as the Mississippi River, the Colorado River and the Great Lakes.</p>
        <p>Mountains and deserts have been settled by fewer people than the plains areas. However, they have valuable resources of their own.</p>
    </span>

    <button onclick='handleLaunchImmersiveReader()'>
        Immersive Reader
    </button>

    <script type='text/javascript'>
        function getImmersiveReaderTokenAsync() {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: '/token',
                    type: 'GET',
                    success: token => {
                        resolve(token);
                    },
                    error: err => {
                        console.log('Error in getting token!', err);
                        reject(err);
                    }
                });
            });
        }

        async function handleLaunchImmersiveReader() {
            const data = {
                title: document.getElementById('title').innerText,
                chunks: [ {
                    content: document.getElementById('content').innerText,
                    lang: 'en'
                } ]
            };

            const options = {
                uiZIndex: 1000000
            }

            const token = await getImmersiveReaderTokenAsync();

            ImmersiveReader.launchAsync(token, Subdomain, data, options)
                .then(() => {
                    console.log('success');
                }, (error) => {
                    console.log('error! ' + error);
                });
        }
    </script>
</body>
</html>
```

## Build and run the app

From the menu bar, select **Debug > Start Debugging**, or press **F5** to start the application.

In your browser, you should see:

![Sample app](./media/quickstart-result.png)

When you click on the "Immersive Reader" button, you'll see the Immersive Reader launched with the content on the page.

![Immersive Reader](./media/quickstart-immersive-reader.png)

## Next steps

* View the [tutorial](./tutorial.md) to see what else you can do with the Immersive Reader SDK
* Explore the [Immersive Reader SDK](https://github.com/Microsoft/immersive-reader-sdk) and the [Immersive Reader SDK Reference](./reference.md)
