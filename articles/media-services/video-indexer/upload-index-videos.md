---
title: Upload and index videos with Video Indexer
titleSuffix: Azure Media Services
description: This topic demonstrates how to use APIs to upload and index your videos with Video Indexer.
services: media-services
author: Juliako
manager: femila

ms.service: media-services
ms.subservice: video-indexer
ms.topic: article
ms.date: 03/04/2021
ms.author: juliako
ms.custom: devx-track-csharp
---

# Upload and index your videos  

Once your video has been uploaded, Video Indexer (optionally) encodes the video (discussed in the article). When creating a Video Indexer account, you can choose a free trial account (where you get a certain number of free indexing minutes) or a paid option (where you are not limited by the quota). With free trial, Video Indexer provides up to 600 minutes of free indexing to website users and up to 2400 minutes of free indexing to API users. With paid option, you create a Video Indexer account that is [connected to your Azure subscription and an Azure Media Services account](connect-to-azure.md). You pay for minutes indexed, for more information, see [Media Services pricing](https://azure.microsoft.com/pricing/details/media-services/).

When uploading videos with Video Indexer API, you have the following upload options: 

* upload your video from a URL (preferred),
* send the video file as a byte array in the request body,
* Use existing Azure Media Services asset by providing the [asset ID](../latest/assets-concept.md) (supported in paid accounts only).

The article shows how to upload and index your videos with these options:

* [The Video Indexer website](#upload-and-index-a-video-using-the-video-indexer-website) 
* [The Video Indexer APIs](#upload-and-index-with-api)

## Supported file formats for Video Indexer

See the [input container/file formats](../latest/encode-media-encoder-standard-formats-reference.md) article for a list of file formats that you can use with Video Indexer.

## Video files storage

- With a paid Video Indexer account, you create a Video Indexer account that's connected to your Azure subscription and an Azure Media Services account. For more information, see [Create a Video Indexer account connected to Azure](connect-to-azure.md).
- Video files are stored in Azure storage by Azure Media Services. There is no time limitation.
- You can always delete your video and audio files as well as any metadata and insights extracted from them by Video Indexer. Once you delete a file from Video Indexer, the file and its metadata and insights are permanently removed from Video Indexer. However, if you have implemented your own backup solution in Azure storage, the file remains in your Azure storage.
- The persistency of a video is identical, regardless if the upload is done form the Video Indexer website or using the Upload API.
   
## Upload and index a video using the Video Indexer website

> [!NOTE]
> A name of the video must be no greater than 80 characters.

1. Sign in on the [Video Indexer](https://www.videoindexer.ai/) website.
1. To upload a video, press the **Upload** button or link.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/video-indexer-get-started/video-indexer-upload.png" alt-text="Upload":::
1. Once your video has been uploaded, Video Indexer starts indexing and analyzing the video.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/video-indexer-get-started/progress.png" alt-text="Progress of the upload":::
1. Once Video Indexer is done analyzing, you will get an email with a link to your video and a short description of what was found in your video. For example: people, topics, OCRs.

## Upload and index with API

Use the [Upload video](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Upload-Video) API to upload and index your videos based on a URL. The code sample that follows includes the commented out code that shows how to upload the byte array. 

### Configurations and params

This section describes some of the optional parameters and when you would want to set them. For the most up to date params info, see the [Upload video](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Upload-Video) API.

#### externalID 

This parameter enables you to specify an ID that will be associated with the video. The ID can be applied to external "Video Content Management" (VCM) system integration. The videos that are located in the Video Indexer portal can be searched using the specified external ID.

#### callbackUrl

[!INCLUDE [callback url](./includes/callback-url.md)]

##### Other considerations

- Video Indexer returns any existing parameters provided in the original URL.
- The provided URL must be encoded.

#### indexingPreset

Use this parameter to define the AI bundle you would like to apply on your audio or video file . This parameter is used to configure the indexing process. You can specify the following values:

- `AudioOnly` – Index and extract insights using audio only (ignoring video).
- `VideoOnly` - Index and extract insights using video only (ignoring audio).
- `Default` – Index and extract insights using both audio and video.
- `DefaultWithNoiseReduction` – Index and extract insights from both audio and video, while applying noise reduction algorithms on audio stream.

    The `DefaultWithNoiseReduction` value is now mapped to default preset (deprecated).
- `BasicAudio` - Index and extract insights using audio only (ignoring video), including only basic audio features (transcription, translation, format output captions and subtitles).
 - `AdvancedAudio` - Index and extract insights using audio only (ignoring video), including advanced audio features (audio event detection) in addition to the standard audio analysis.

> [!NOTE]
> Video Indexer covers up to two tracks of audio. If there are more audio tracks in the file, they will be treated as one track.<br/>
If you want to index the tracks separately, you will need to extract the relevant audio file and index it as `AudioOnly`.

Price depends on the selected indexing option. For more information refer to [Media Services pricing](https://azure.microsoft.com/pricing/details/media-services/).

#### priority

Videos are indexed by Video Indexer according to their priority. Use the **priority** parameter to specify the index priority. The following values are valid: **Low**, **Normal** (default), and **High**.

**Priority** parameter is only supported for paid accounts.

#### streamingPreset

Once your video has been uploaded, Video Indexer, optionally encodes the video. Then, proceeds to indexing, and analyzing the video. When Video Indexer is done analyzing, you will get a notification with the video ID.  

When using the [Upload video](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Upload-Video) or [Re-Index Video](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Re-Index-Video) API, one of the optional parameters is `streamingPreset`. If you set `streamingPreset` to `Default`, `SingleBitrate`, or `AdaptiveBitrate`, the encoding process is triggered. Once the indexing and encoding jobs are done, the video is published so you can also stream your video. The Streaming Endpoint from which you want to stream the video must be in the **Running** state.

For SingleBitrate, standard encoder cost will apply per the output. If the video height is greater or equal to 720, Video Indexer encodes it as 1280x720. Otherwise, as 640x468.
The Default setting is [content aware encoding](../latest/encode-content-aware-concept.md).

In order to run the indexing and encoding jobs, the [Azure Media Services account connected to your Video Indexer account](connect-to-azure.md), requires Reserved Units. For more information, see [Scaling Media Processing](../previous/media-services-scale-media-processing-overview.md). Since these are compute intensive jobs, S3 unit type is highly recommended. The number of RUs defines the max number of jobs that can run in parallel. The baseline recommendation is 10 S3 RUs. 

If you only want to index your video but not encode it, set `streamingPreset`to `NoStreaming`.

#### videoUrl

A URL of the video/audio file to be indexed. The URL must point at a media file (HTML pages are not supported). The file can be protected by an access token provided as part of the URI and the endpoint serving the file must be secured with TLS 1.2 or higher. The URL needs to be encoded. 

If the `videoUrl` is not specified, the Video Indexer expects you to pass the file as a multipart/form body content.

### Code sample

The following C# code snippet demonstrates the usage of all the Video Indexer APIs together.

**Instructions for running the following code sample**

After copying this code into your development platform you will need to provide two parameters: API Management authentication key and video URL.

* API key – API key is your personal API management subscription key, that will allow you to get an access token in order to perform operations on your Video Indexer account. 

    To get your API key, go through this flow:

    * Navigate to https://api-portal.videoindexer.ai/
    * Login
    * Go to **Products** -> **Authorization** -> **Authorization subscription**
    * Copy the **Primary key**
* Video URL – A URL of the video/audio file to be indexed. The URL must point at a media file (HTML pages are not supported). The file can be protected by an access token provided as part of the URI and the endpoint serving the file must be secured with TLS 1.2 or higher. The URL needs to be encoded.

The result of successfully running the code sample will include an insight widget URL and a player widget URL that will allow you to examine the insights and video uploaded respectively. 


```csharp
public async Task Sample()
{
    var apiUrl = "https://api.videoindexer.ai";
    var apiKey = "..."; // replace with API key taken from https://aka.ms/viapi

    System.Net.ServicePointManager.SecurityProtocol =
        System.Net.ServicePointManager.SecurityProtocol | System.Net.SecurityProtocolType.Tls12;

    // create the http client
    var handler = new HttpClientHandler();
    handler.AllowAutoRedirect = false;
    var client = new HttpClient(handler);
    client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", apiKey);

    // obtain account information and access token
    string queryParams = CreateQueryString(
        new Dictionary<string, string>()
        {
            {"generateAccessTokens", "true"},
            {"allowEdit", "true"},
        });
    HttpResponseMessage result = await client.GetAsync($"{apiUrl}/auth/trial/Accounts?{queryParams}");
    var json = await result.Content.ReadAsStringAsync();
    var accounts = JsonConvert.DeserializeObject<AccountContractSlim[]>(json);
    
    // take the relevant account, here we simply take the first, 
    // you can also get the account via accounts.First(account => account.Id == <GUID>);
    var accountInfo = accounts.First();

    // we will use the access token from here on, no need for the apim key
    client.DefaultRequestHeaders.Remove("Ocp-Apim-Subscription-Key");

    // upload a video
    var content = new MultipartFormDataContent();
    Console.WriteLine("Uploading...");
    // get the video from URL
    var videoUrl = "VIDEO_URL"; // replace with the video URL

    // as an alternative to specifying video URL, you can upload a file.
    // remove the videoUrl parameter from the query params below and add the following lines:
    //FileStream video =File.OpenRead(Globals.VIDEOFILE_PATH);
    //byte[] buffer =new byte[video.Length];
    //video.Read(buffer, 0, buffer.Length);
    //content.Add(new ByteArrayContent(buffer));

    queryParams = CreateQueryString(
        new Dictionary<string, string>()
        {
            {"accessToken", accountInfo.AccessToken},
            {"name", "video_name"},
            {"description", "video_description"},
            {"privacy", "private"},
            {"partition", "partition"},
            {"videoUrl", videoUrl},
        });
    var uploadRequestResult = await client.PostAsync($"{apiUrl}/{accountInfo.Location}/Accounts/{accountInfo.Id}/Videos?{queryParams}", content);
    var uploadResult = await uploadRequestResult.Content.ReadAsStringAsync();

    // get the video ID from the upload result
    string videoId = JsonConvert.DeserializeObject<dynamic>(uploadResult)["id"];
    Console.WriteLine("Uploaded");
    Console.WriteLine("Video ID:");
    Console.WriteLine(videoId);

    // wait for the video index to finish
    while (true)
    {
        await Task.Delay(10000);

        queryParams = CreateQueryString(
            new Dictionary<string, string>()
            {
                {"accessToken", accountInfo.AccessToken},
                {"language", "English"},
            });

        var videoGetIndexRequestResult = await client.GetAsync($"{apiUrl}/{accountInfo.Location}/Accounts/{accountInfo.Id}/Videos/{videoId}/Index?{queryParams}");
        var videoGetIndexResult = await videoGetIndexRequestResult.Content.ReadAsStringAsync();

        string processingState = JsonConvert.DeserializeObject<dynamic>(videoGetIndexResult)["state"];

        Console.WriteLine("");
        Console.WriteLine("State:");
        Console.WriteLine(processingState);

        // job is finished
        if (processingState != "Uploaded" && processingState != "Processing")
        {
            Console.WriteLine("");
            Console.WriteLine("Full JSON:");
            Console.WriteLine(videoGetIndexResult);
            break;
        }
    }

    // search for the video
    queryParams = CreateQueryString(
        new Dictionary<string, string>()
        {
            {"accessToken", accountInfo.AccessToken},
            {"id", videoId},
        });

    var searchRequestResult = await client.GetAsync($"{apiUrl}/{accountInfo.Location}/Accounts/{accountInfo.Id}/Videos/Search?{queryParams}");
    var searchResult = await searchRequestResult.Content.ReadAsStringAsync();
    Console.WriteLine("");
    Console.WriteLine("Search:");
    Console.WriteLine(searchResult);

    // Generate video access token (used for get widget calls)
    client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", apiKey);
    var videoTokenRequestResult = await client.GetAsync($"{apiUrl}/auth/{accountInfo.Location}/Accounts/{accountInfo.Id}/Videos/{videoId}/AccessToken?allowEdit=true");
    var videoAccessToken = (await videoTokenRequestResult.Content.ReadAsStringAsync()).Replace("\"", "");
    client.DefaultRequestHeaders.Remove("Ocp-Apim-Subscription-Key");

    // get insights widget url
    queryParams = CreateQueryString(
        new Dictionary<string, string>()
        {
            {"accessToken", videoAccessToken},
            {"widgetType", "Keywords"},
            {"allowEdit", "true"},
        });
    var insightsWidgetRequestResult = await client.GetAsync($"{apiUrl}/{accountInfo.Location}/Accounts/{accountInfo.Id}/Videos/{videoId}/InsightsWidget?{queryParams}");
    var insightsWidgetLink = insightsWidgetRequestResult.Headers.Location;
    Console.WriteLine("Insights Widget url:");
    Console.WriteLine(insightsWidgetLink);

    // get player widget url
    queryParams = CreateQueryString(
        new Dictionary<string, string>()
        {
            {"accessToken", videoAccessToken},
        });
    var playerWidgetRequestResult = await client.GetAsync($"{apiUrl}/{accountInfo.Location}/Accounts/{accountInfo.Id}/Videos/{videoId}/PlayerWidget?{queryParams}");
    var playerWidgetLink = playerWidgetRequestResult.Headers.Location;
     Console.WriteLine("");
     Console.WriteLine("Player Widget url:");
     Console.WriteLine(playerWidgetLink);
     Console.WriteLine("\nPress Enter to exit...");
     String line = Console.ReadLine();
     if (line == "enter")
     {
         System.Environment.Exit(0);
     }

}

private string CreateQueryString(IDictionary<string, string> parameters)
{
    var queryParameters = HttpUtility.ParseQueryString(string.Empty);
    foreach (var parameter in parameters)
    {
        queryParameters[parameter.Key] = parameter.Value;
    }

    return queryParameters.ToString();
}

public class AccountContractSlim
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Location { get; set; }
    public string AccountType { get; set; }
    public string Url { get; set; }
    public string AccessToken { get; set; }
}
```

### Common errors

The status codes listed in the following table may be returned by the Upload operation.

|Status code|ErrorType (in response body)|Description|
|---|---|---|
|409|VIDEO_INDEXING_IN_PROGRESS|Same video is already in progress of being processed in the given account.|
|400|VIDEO_ALREADY_FAILED|Same video failed to process in the given account less than 2 hours ago. API clients should wait at least 2 hours before re-uploading a video.|
|429||Trial accounts are allowed 5 uploads per minute. Paid accounts are allowed 50 uploads per minute.|

## Uploading considerations and limitations
 
- A name of the video must be no greater than 80 characters.
- When uploading your video based on the URL (preferred) the endpoint must be secured with TLS 1.2 (or higher).
- The upload size with the URL option is limited to 30GB.
- The request URL length is limited to 6144 characters where the query string URL length is limited to 4096 characters .
- The upload size with the byte array option is limited to 2GB.
- The byte array option times out after 30 min.
- The URL provided in the `videoURL` param needs to be encoded.
- Indexing Media Services assets has the same limitation as indexing from URL.
- Video Indexer has a max duration limit of 4 hours for a single file.
- The URL needs to be accessible (for example a public URL). 

    If it is a private URL, the access token need to be provided in the request.
- The URL has to point to a valid media file and not to a webpage, such as a link to the `www.youtube.com` page.
- In a paid account you can upload up to 50 movies per minute, and in a trial account up to 5 movies per minute.

> [!Tip]
> It is recommended to use .NET framework version 4.6.2. or higher because older .NET frameworks do not default to TLS 1.2.
>
> If you must use older .NET frameworks, add one line into your code before making the REST API call:  <br/> System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;

## Next steps

[Examine the Azure Video Indexer output produced by API](video-indexer-output-json-v2.md)
