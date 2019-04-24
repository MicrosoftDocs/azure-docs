---
title: "Quickstart: Create a web app that launches the Immersive Reader (C#)"
titlesuffix: Azure Cognitive Services
description: In this quickstart, you build a web app from scratch and add the Immersive Reader functionality.
services: cognitive-services
author: metanMSFT

ms.service: cognitive-services
ms.subservice: immersive-reader
ms.topic: quickstart
ms.date: 07/01/2019
ms.author: metan
#Customer intent: As a developer, I want to quickly integrate the Immersive Reader into my web application so that I can see the Immersive Reader in action and understand the value it provides.
---

# Quickstart: Create a web app that launches the Immersive Reader (C#)

The [Immersive Reader](https://www.onenote.com/learningtools) is an inclusively designed tool that implements proven techniques to improve reading comprehension.

In this quickstart, you build a web app from scratch and integrate the Immersive Reader by using the Immersive Reader SDK. A full working sample of this quickstart is available [here](https://github.com/Microsoft/immersive-reader-sdk/samples/quickstart-csharp).

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* [Visual Studio 2017](https://visualstudio.microsoft.com/downloads)
* A subscription key for Immersive Reader. Get one by following [these instructions](https://docs.microsoft.com/en-us/azure/cognitive-services/cognitive-services-apis-create-account).

## Create a web app project

Create a new project in Visual Studio, using the ASP.NET Core Web Application template with built-in Model-View-Controller.

![New Project](./media/vswebapp.png)

![New ASP.NET Core Web Application](./media/vsmvc.png)

## Acquire an access token

You need your subscription key and endpoint for this next step. You can find that information at https://azure.microsoft.com/try/cognitive-services/my-apis/.

Open _Controllers\HomeController.cs_, and replace the `HomeController` class with the following code, supplying your subscription key and endpoint where appropriate.

```csharp
public class HomeController : Controller
{
    // Insert your Azure subscription key here
    private const string SubscriptionKey = "";

    // Insert your endpoint here
    private const string Endpoint = "";

    public async Task<IActionResult> Index()
    {
        ViewBag.AccessToken = await GetTokenAsync(Endpoint, SubscriptionKey);
        return View();
    }

    /// <summary>
    /// Exchange your Azure subscription key for an access token
    /// </summary>
    private async Task<string> GetTokenAsync(string endpoint, string subscriptionKey)
    {
        if (string.IsNullOrEmpty(endpoint) || string.IsNullOrEmpty(subscriptionKey))
        {
            throw new ArgumentNullException("Endpoint or subscriptionKey is null!");
        }

        using (var client = new System.Net.Http.HttpClient())
        {
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);
            using (var response = await client.PostAsync($"https://{endpoint}/issueToken", null))
            {
                return await response.Content.ReadAsStringAsync();
            }
        }
    }
}
```

## Add sample content

Now, we'll add some sample content to this web app. Open _Views\Home\Index.cshtml_ and replace the automatically generated code with this sample:

```html
<h1 id='title'>Geography</h1>
<span id='content'>
    <p>The study of Earth's landforms is called physical geography. Landforms can be mountains and valleys. They can also be glaciers, lakes or rivers. Landforms are sometimes called physical features. It is important for students to know about the physical geography of Earth. The seasons, the atmosphere and all the natural processes of Earth affect where people are able to live. Geography is one of a combination of factors that people use to decide where they want to live.</p>
</span>

<button onclick='launchImmersiveReader()'>Immersive Reader</button>

@section scripts {
<script type='text/javascript' src='https://contentstorage.onenote.office.net/onenoteltir/immersivereadersdk/immersive-reader-0.0.1.js'></script>
<script type='text/javascript'>
    function launchImmersiveReader() {
        const content = {
            title: document.getElementById('title').innerText,
            chunks: [ {
                content: document.getElementById('content').innerText,
                lang: 'en'
            } ]
        };

        ImmersiveReader.launchAsync('@ViewBag.AccessToken', content, { uiZIndex: 1000000 });
    }
</script>
}
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