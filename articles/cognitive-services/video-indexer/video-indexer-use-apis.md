---
title: Use Azure Video Indexer API | Microsoft Docs
description: This article shows how to get started using the Video Indexer API.
services: cognitive services
documentationcenter: ''
author: juliako
manager: erikre

ms.service: video-indexer
ms.topic: article
ms.date: 05/02/2017
ms.author: juliako;

---
# Use Azure Video Indexer API

Video Indexer consolidates various audio and video artificial intelligence (AI) technologies offered by Microsoft in one integrated service, making development simpler. The APIs are designed to enable developers to focus on consuming Media AI technologies without worrying about scale, global reach, availability, and reliability of cloud platform. You can use the API to upload your files, get detailed video insights, get URLs of insight and player widgets in order to embed them into your application, and other tasks.

This article shows how the developers can take advantage of the Video Indexer API. To read a more detailed overview of the Video Indexer service, see the [overview](video-indexer-overview.md) article.

## Subscribe to the API

1. Sign in.

	To start developing with Video Indexer, you must first Sign In to the [Video Indexer](http://vi.microsoft.com) portal. 
	
	![Sign up](./media/video-indexer-use-apis/video-indexer-api01.png)

	If signing in with an AAD account (for example, alice@contoso.onmicrosoft.com) you must go through two preliminary steps: 
	
	1. 	Contact us to register your AAD organization’s domain (contoso.onmicrosoft.com).
	2. 	Your AAD organization’s admin must first sign in to grant the portal permissions to your org. 
	
2. Subscribe.

	In the [Products](https://videobreakdown.portal.azure-api.net/products) page, select Production and subscribe. 
	
	![Sign up](./media/video-indexer-use-apis/video-indexer-api02.png)
	
	This sends the Video Indexer team a subscription request, which will be approved shortly.
	Once approved, you will be able to see your subscription and your primary and secondary keys. Notice: these keys should be protected. The keys should only be used by your server code. They should not be available on the client side (.js, .html, etc.).

	![Sign up](./media/video-indexer-use-apis/video-indexer-api03.png)

3.  Start developing.
 
	You are ready to start integrating with the API. Find the detailed description of each Video Indexer REST API [here](https://videobreakdown.portal.azure-api.net/docs/services/582074fb0dc56116504aed75/operations/5857caeb0dc5610f9ce979e4).

## Recommendations

This section lists some recommendations when using Video Indexer API.

- If you are planning to upload a video, it is recommended to place the file in some public network location (for example, OneDrive). Get the link to the video and provide the URL as the upload file param. 
- When you call the API that gets video breakdowns for the specified video, you get a detailed JSON output as the response content. For details about the returned JSON, see [this](video-indexer-output-json.md) topic.

## Code sample

The following C# code snippet demonstrates the usage of all the Video Indexer APIs together. 

    var apiUrl = "https://videobreakdown.azure-api.net/Breakdowns/Api/Partner/Breakdowns";
    var client = new HttpClient();
    client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", "...");

    var content = new MultipartFormDataContent();

    Console.WriteLine("Uploading...");
    var videoUrl = "https:/...";
    var result = client.PostAsync(apiUrl + "?name=some_name&description=some_description&privacy=private&partition=some_partition&videoUrl=" + videoUrl, content).Result;
    var json = result.Content.ReadAsStringAsync().Result;

    Console.WriteLine();
    Console.WriteLine("Uploaded:");
    Console.WriteLine(json);

    var id = JsonConvert.DeserializeObject<string>(json);

    while (true)
    {
        Thread.Sleep(10000);

        result = client.GetAsync(string.Format(apiUrl + "/{0}/State", id)).Result;
        json = result.Content.ReadAsStringAsync().Result;

        Console.WriteLine();
        Console.WriteLine("State:");
        Console.WriteLine(json);

        dynamic state = JsonConvert.DeserializeObject(json);
        if (state.state != "Uploaded" && state.state != "Processing")
        {
            break;
        }
    }

    result = client.GetAsync(string.Format(apiUrl + "/{0}", id)).Result;
    json = result.Content.ReadAsStringAsync().Result;
    Console.WriteLine();
    Console.WriteLine("Full JSON:");
    Console.WriteLine(json);

    result = client.GetAsync(string.Format(apiUrl + "/Search?id={0}", id)).Result;
    json = result.Content.ReadAsStringAsync().Result;
    Console.WriteLine();
    Console.WriteLine("Search:");
    Console.WriteLine(json);

    result = client.GetAsync(string.Format(apiUrl + "/{0}/InsightsWidgetUrl", id)).Result;
    json = result.Content.ReadAsStringAsync().Result;
    Console.WriteLine();
    Console.WriteLine("Insights Widget url:");
    Console.WriteLine(json);

    result = client.GetAsync(string.Format(apiUrl + "/{0}/PlayerWidgetUrl", id)).Result;
    json = result.Content.ReadAsStringAsync().Result;
    Console.WriteLine();
    Console.WriteLine("Player token:");
    Console.WriteLine(json);

## Next steps

Examine details of the output JSON, see [this](video-indexer-output-json.md) topic.

## See also

[Video Indexer overview](video-indexer-overview.md)
