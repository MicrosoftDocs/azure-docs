---
title: Index videos stored on OneDrive - Azure AI Video Indexer
description: Learn how to index videos stored on OneDrive by using Azure AI Video Indexer.
ms.topic: article
ms.date: 12/17/2021
---

# Index your videos stored on OneDrive

This article shows how to index videos stored on OneDrive by using the Azure AI Video Indexer website.

## Supported file formats

For a list of file formats that you can use with Azure AI Video Indexer, see [Standard Encoder formats and codecs](/azure/media-services/latest/encode-media-encoder-standard-formats-reference).

## Index a video by using the website

1. Sign into the [Azure AI Video Indexer](https://www.videoindexer.ai/) website, and then select **Upload**.

   > [!div class="mx-imgBorder"]
   > :::image type="content" source="./media/video-indexer-get-started/video-indexer-upload.png" alt-text="Screenshot that shows the Upload button.":::

1. Click on **enter a file URL** button
   > [!div class="mx-imgBorder"]
   > :::image type="content" source="./media/video-indexer-get-started/avam-enter-file-url.png" alt-text="Screenshot that shows the enter file URL button.":::

1. Next, go to your video/audio file located on your OneDrive using a web browser. Select the file you want to index, at the top select **embed**
   > [!div class="mx-imgBorder"]
   > :::image type="content" source="./media/video-indexer-get-started/avam-odrv-embed.png" alt-text="Screenshot that shows the embed code button.":::

1. On the right click on **Generate** to generate an embed url.
   > [!div class="mx-imgBorder"]
   > :::image type="content" source="./media/video-indexer-get-started/avam-odrv-embed-generate.png" alt-text="Screenshot that shows the embed code generate button.":::

1. Copy the embed code and extract only the URL part including the key. For example:

   `https://onedrive.live.com/embed?cid=5BC591B7C713B04F&resid=5DC518B6B713C40F%2110126&authkey=HnsodidN_50oA3lLfk`

   Replace **embed** with **download**. You will now have a url that looks like this:

   `https://onedrive.live.com/download?cid=5BC591B7C713B04F&resid=5DC518B6B713C40F%2110126&authkey=HnsodidN_50oA3lLfk`

1. Now enter this URL in the Azure AI Video Indexer website in the URL field.

   > [!div class="mx-imgBorder"]
   > :::image type="content" source="./media/video-indexer-get-started/avam-odrv-url.png" alt-text="Screenshot that shows the onedrive url field.":::

After your video is downloaded from OneDrive, Azure AI Video Indexer starts indexing and analyzing the video.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/video-indexer-get-started/progress.png" alt-text="Screenshot that shows the progress of an upload.":::

Once Azure AI Video Indexer is done analyzing, you will receive an email with a link to your indexed video. The email also includes a short description of what was found in your video (for example: people, topics, optical character recognition).

## Upload and index a video by using the API

You can use the [Upload Video](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Upload-Video) API to upload and index your videos based on a URL. The code sample that follows includes the commented-out code that shows how to upload the byte array.

### Configurations and parameters

This section describes some of the optional parameters and when to set them. For the most up-to-date info about parameters, see the [Azure AI Video Indexer API developer portal](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Upload-Video).

#### externalID

Use this parameter to specify an ID that will be associated with the video. The ID can be applied to integration into an external video content management (VCM) system. The videos that are in the Azure AI Video Indexer website can be searched via the specified external ID.

#### callbackUrl

Use this parameter to specify a callback URL.

[!INCLUDE [callback url](./includes/callback-url.md)]

Azure AI Video Indexer returns any existing parameters provided in the original URL. The URL must be encoded.

#### indexingPreset

Use this parameter to define an AI bundle that you want to apply on your audio or video file. This parameter is used to configure the indexing process. You can specify the following values:

- `AudioOnly`: Index and extract insights by using audio only (ignoring video).
- `VideoOnly`: Index and extract insights by using video only (ignoring audio).
- `Default`: Index and extract insights by using both audio and video.
- `DefaultWithNoiseReduction`: Index and extract insights from both audio and video, while applying noise reduction algorithms on the audio stream.

    The `DefaultWithNoiseReduction` value is now mapped to a default preset (deprecated).
- `BasicAudio`: Index and extract insights by using audio only (ignoring video). Include only basic audio features (transcription, translation, formatting of output captions and subtitles).
- `AdvancedAudio`: Index and extract insights by using audio only (ignoring video). Include advanced audio features (such as audio event detection) in addition to the standard audio analysis.
- `AdvancedVideo`: Index and extract insights by using video only (ignoring audio). Include advanced video features (such as observed people tracing) in addition to the standard video analysis.
- `AdvancedVideoAndAudio`: Index and extract insights by using both advanced audio and advanced video analysis.

> [!NOTE]
> The preceding advanced presets include models that are in public preview. When these models reach general availability, there might be implications for the price.

Azure AI Video Indexer covers up to two tracks of audio. If the file has more audio tracks, they're treated as one track. If you want to index the tracks separately, you need to extract the relevant audio file and index it as `AudioOnly`.

Price depends on the selected indexing option. For more information, see [Media Services pricing](https://azure.microsoft.com/pricing/details/media-services/).

#### priority

Azure AI Video Indexer indexes videos according to their priority. Use the `priority` parameter to specify the index priority. The following values are valid: `Low`, `Normal` (default), and `High`.

This parameter is supported only for paid accounts.

#### streamingPreset

After your video is uploaded, Azure AI Video Indexer optionally encodes the video. It then proceeds to indexing and analyzing the video. When Azure AI Video Indexer is done analyzing, you get a notification with the video ID.

When you're using the [Upload Video](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Upload-Video) or [Re-Index Video](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Re-Index-Video) API, one of the optional parameters is `streamingPreset`. If you set `streamingPreset` to `Default`, `SingleBitrate`, or `AdaptiveBitrate`, the encoding process is triggered.

After the indexing and encoding jobs are done, the video is published so you can also stream your video. The streaming endpoint from which you want to stream the video must be in the **Running** state.

For `SingleBitrate`, the standard encoder cost will apply for the output. If the video height is greater than or equal to 720, Azure AI Video Indexer encodes it as 1280 x 720. Otherwise, it's encoded as 640 x 468.
The default setting is [content-aware encoding](/azure/media-services/latest/encode-content-aware-concept).

If you only want to index your video and not encode it, set `streamingPreset` to `NoStreaming`.

#### videoUrl

This parameter specifies the URL of the video or audio file to be indexed. If the `videoUrl` parameter is not specified, Azure AI Video Indexer expects you to pass the file as multipart/form body content.

### Code sample

> [!NOTE]
> The following sample is intended for Classic accounts only and isn't compatible with ARM accounts. For an updated sample for ARM, see [this ARM sample repo](https://github.com/Azure-Samples/media-services-video-indexer/blob/master/API-Samples/C%23/ArmBased/Program.cs).

The following C# code snippets demonstrate the usage of all the Azure AI Video Indexer APIs together.

### [Classic account](#tab/With-classic-account/)

After you copy the following code into your development platform, you'll need to provide two parameters:

* API key (`apiKey`): Your personal API management subscription key. It allows you to get an access token in order to perform operations on your Azure AI Video Indexer account.

  To get your API key:

  1. Go to the [Azure AI Video Indexer API developer portal](https://api-portal.videoindexer.ai/).
  1. Sign in.
  1. Go to **Products** > **Authorization** > **Authorization subscription**.
  1. Copy the **Primary key** value.

* Video URL (`videoUrl`): A URL of the video or audio file to be indexed. Here are the requirements:

  - The URL must point at a media file. (HTML pages are not supported.)
  - The file can be protected by an access token that's provided as part of the URI. The endpoint that serves the file must be secured with TLS 1.2 or later.
  - The URL must be encoded.

The result of successfully running the code sample includes an insight widget URL and a player widget URL. They allow you to examine the insights and the uploaded video, respectively.


```csharp
public async Task Sample()
{
    var apiUrl = "https://api.videoindexer.ai";
    var apiKey = "..."; // Replace with API key taken from https://aka.ms/viapi

    System.Net.ServicePointManager.SecurityProtocol =
        System.Net.ServicePointManager.SecurityProtocol | System.Net.SecurityProtocolType.Tls12;

    // Create the HTTP client
    var handler = new HttpClientHandler();
    handler.AllowAutoRedirect = false;
    var client = new HttpClient(handler);
    client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", apiKey);

    // Obtain account information and access token
    string queryParams = CreateQueryString(
        new Dictionary<string, string>()
        {
            {"generateAccessTokens", "true"},
            {"allowEdit", "true"},
        });
    HttpResponseMessage result = await client.GetAsync($"{apiUrl}/auth/trial/Accounts?{queryParams}");
    var json = await result.Content.ReadAsStringAsync();
    var accounts = JsonConvert.DeserializeObject<AccountContractSlim[]>(json);

    // Take the relevant account. Here we simply take the first.
    // You can also get the account via accounts.First(account => account.Id == <GUID>);
    var accountInfo = accounts.First();

    // We'll use the access token from here on, so there's no need for the APIM key
    client.DefaultRequestHeaders.Remove("Ocp-Apim-Subscription-Key");

    // Upload a video
    var content = new MultipartFormDataContent();
    Console.WriteLine("Uploading...");
    // Get the video from URL
    var videoUrl = "VIDEO_URL"; // Replace with the video URL from OneDrive

    // As an alternative to specifying video URL, you can upload a file.
    // Remove the videoUrl parameter from the query parameters below and add the following lines:
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

    // Get the video ID from the upload result
    string videoId = JsonConvert.DeserializeObject<dynamic>(uploadResult)["id"];
    Console.WriteLine("Uploaded");
    Console.WriteLine("Video ID:");
    Console.WriteLine(videoId);

    // Wait for the video index to finish
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

        // Job is finished
        if (processingState != "Uploaded" && processingState != "Processing")
        {
            Console.WriteLine("");
            Console.WriteLine("Full JSON:");
            Console.WriteLine(videoGetIndexResult);
            break;
        }
    }

    // Search for the video
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

    // Get insights widget URL
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

    // Get player widget URL
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

### [Azure Resource Manager account](#tab/with-arm-account-account/)

After you copy this C# project into your development platform, you need to take the following steps:

1. Go to Program.cs and populate:

   - ```SubscriptionId``` with your subscription ID.
   - ```ResourceGroup``` with your resource group.
   - ```AccountName``` with your account name.
   - ```VideoUrl``` with your video URL.
1. Make sure that .NET 6.0 is installed. If it isn't, [install it](https://dotnet.microsoft.com/download/dotnet/6.0).
1. Make sure that the Azure CLI is installed. If it isn't, [install it](/cli/azure/install-azure-cli).
1. Open your terminal and go to the *VideoIndexerArm* folder.
1. Log in to Azure: ```az login --use-device```.
1. Build the project: ```dotnet build```.
1. Run the project: ```dotnet run```.

```csharp
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net5.0</TargetFramework>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Azure.Identity" Version="1.4.1" />
    <PackageReference Include="Microsoft.Identity.Client" Version="4.36.2" />
  </ItemGroup>

</Project>
```

```csharp
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using System.Web;
using Azure.Core;
using Azure.Identity;


namespace VideoIndexerArm
{
    public class Program
    {
        private const string AzureResourceManager = "https://management.azure.com";
        private const string SubscriptionId = ""; // Your Azure subscription
        private const string ResourceGroup = ""; // Your resource group
        private const string AccountName = ""; // Your account name
        private const string VideoUrl = ""; // The video URL from OneDrive you want to index

        public static async Task Main(string[] args)
        {
            // Build Azure AI Video Indexer resource provider client that has access token through Azure Resource Manager
            var videoIndexerResourceProviderClient = await VideoIndexerResourceProviderClient.BuildVideoIndexerResourceProviderClient();

            // Get account details
            var account = await videoIndexerResourceProviderClient.GetAccount();
            var accountId = account.Properties.Id;
            var accountLocation = account.Location;
            Console.WriteLine($"account id: {accountId}");
            Console.WriteLine($"account location: {accountLocation}");

            // Get account-level access token for Azure AI Video Indexer
            var accessTokenRequest = new AccessTokenRequest
            {
                PermissionType = AccessTokenPermission.Contributor,
                Scope = ArmAccessTokenScope.Account
            };

            var accessToken = await videoIndexerResourceProviderClient.GetAccessToken(accessTokenRequest);
            var apiUrl = "https://api.videoindexer.ai";
            System.Net.ServicePointManager.SecurityProtocol = System.Net.ServicePointManager.SecurityProtocol | System.Net.SecurityProtocolType.Tls12;


            // Create the HTTP client
            var handler = new HttpClientHandler();
            handler.AllowAutoRedirect = false;
            var client = new HttpClient(handler);

            // Upload a video
            var content = new MultipartFormDataContent();
            Console.WriteLine("Uploading...");
            // Get the video from URL

            // As an alternative to specifying video URL, you can upload a file.
            // Remove the videoUrl parameter from the query parameters below and add the following lines:
            // FileStream video =File.OpenRead(Globals.VIDEOFILE_PATH);
            // byte[] buffer =new byte[video.Length];
            // video.Read(buffer, 0, buffer.Length);
            // content.Add(new ByteArrayContent(buffer));

            var queryParams = CreateQueryString(
                new Dictionary<string, string>()
                {
            {"accessToken", accessToken},
            {"name", "video sample"},
            {"description", "video_description"},
            {"privacy", "private"},
            {"partition", "partition"},
            {"videoUrl", VideoUrl},
                });
            var uploadRequestResult = await client.PostAsync($"{apiUrl}/{accountLocation}/Accounts/{accountId}/Videos?{queryParams}", content);
            var uploadResult = await uploadRequestResult.Content.ReadAsStringAsync();

            // Get the video ID from the upload result
            string videoId = JsonSerializer.Deserialize<Video>(uploadResult).Id;
            Console.WriteLine("Uploaded");
            Console.WriteLine("Video ID:");
            Console.WriteLine(videoId);

            // Wait for the video index to finish
            while (true)
            {
                await Task.Delay(10000);

                queryParams = CreateQueryString(
                    new Dictionary<string, string>()
                    {
                {"accessToken", accessToken},
                {"language", "English"},
                    });

                var videoGetIndexRequestResult = await client.GetAsync($"{apiUrl}/{accountLocation}/Accounts/{accountId}/Videos/{videoId}/Index?{queryParams}");
                var videoGetIndexResult = await videoGetIndexRequestResult.Content.ReadAsStringAsync();

                string processingState = JsonSerializer.Deserialize<Video>(videoGetIndexResult).State;

                Console.WriteLine("");
                Console.WriteLine("State:");
                Console.WriteLine(processingState);

                // Job is finished
                if (processingState != "Uploaded" && processingState != "Processing")
                {
                    Console.WriteLine("");
                    Console.WriteLine("Full JSON:");
                    Console.WriteLine(videoGetIndexResult);
                    break;
                }
            }

            // Search for the video
            queryParams = CreateQueryString(
                new Dictionary<string, string>()
                {
            {"accessToken", accessToken},
            {"id", videoId},
                });

            var searchRequestResult = await client.GetAsync($"{apiUrl}/{accountLocation}/Accounts/{accountId}/Videos/Search?{queryParams}");
            var searchResult = await searchRequestResult.Content.ReadAsStringAsync();
            Console.WriteLine("");
            Console.WriteLine("Search:");
            Console.WriteLine(searchResult);

            // Get insights widget URL
            queryParams = CreateQueryString(
                new Dictionary<string, string>()
                {
            {"accessToken", accessToken},
            {"widgetType", "Keywords"},
            {"allowEdit", "true"},
                });
            var insightsWidgetRequestResult = await client.GetAsync($"{apiUrl}/{accountLocation}/Accounts/{accountId}/Videos/{videoId}/InsightsWidget?{queryParams}");
            var insightsWidgetLink = insightsWidgetRequestResult.Headers.Location;
            Console.WriteLine("Insights Widget url:");
            Console.WriteLine(insightsWidgetLink);

            // Get player widget URL
            queryParams = CreateQueryString(
                new Dictionary<string, string>()
                {
            {"accessToken", accessToken},
                });
            var playerWidgetRequestResult = await client.GetAsync($"{apiUrl}/{accountLocation}/Accounts/{accountId}/Videos/{videoId}/PlayerWidget?{queryParams}");
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

        static string CreateQueryString(IDictionary<string, string> parameters)
        {
            var queryParameters = HttpUtility.ParseQueryString(string.Empty);
            foreach (var parameter in parameters)
            {
                queryParameters[parameter.Key] = parameter.Value;
            }

            return queryParameters.ToString();
        }

        public class VideoIndexerResourceProviderClient
        {
            private readonly string armAaccessToken;

            async public static Task<VideoIndexerResourceProviderClient> BuildVideoIndexerResourceProviderClient()
            {
                var tokenRequestContext = new TokenRequestContext(new[] { $"{AzureResourceManager}/.default" });
                var tokenRequestResult = await new DefaultAzureCredential().GetTokenAsync(tokenRequestContext);
                return new VideoIndexerResourceProviderClient(tokenRequestResult.Token);
            }
            public VideoIndexerResourceProviderClient(string armAaccessToken)
            {
                this.armAaccessToken = armAaccessToken;
            }

            public async Task<string> GetAccessToken(AccessTokenRequest accessTokenRequest)
            {
                Console.WriteLine($"Getting access token. {JsonSerializer.Serialize(accessTokenRequest)}");
                // Set the generateAccessToken (from video indexer) HTTP request content
                var jsonRequestBody = JsonSerializer.Serialize(accessTokenRequest);
                var httpContent = new StringContent(jsonRequestBody, System.Text.Encoding.UTF8, "application/json");

                // Set request URI
                var requestUri = $"{AzureResourceManager}/subscriptions/{SubscriptionId}/resourcegroups/{ResourceGroup}/providers/Microsoft.VideoIndexer/accounts/{AccountName}/generateAccessToken?api-version=2021-08-16-preview";

                // Generate access token from video indexer
                var client = new HttpClient(new HttpClientHandler());
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", armAaccessToken);
                var result = await client.PostAsync(requestUri, httpContent);
                var jsonResponseBody = await result.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<GenerateAccessTokenResponse>(jsonResponseBody).AccessToken;
            }

            public async Task<Account> GetAccount()
            {

                Console.WriteLine($"Getting account.");
                // Set request URI
                var requestUri = $"{AzureResourceManager}/subscriptions/{SubscriptionId}/resourcegroups/{ResourceGroup}/providers/Microsoft.VideoIndexer/accounts/{AccountName}/?api-version=2021-08-16-preview";

                // Get account
                var client = new HttpClient(new HttpClientHandler());
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", armAaccessToken);
                var result = await client.GetAsync(requestUri);
                var jsonResponseBody = await result.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<Account>(jsonResponseBody);
            }
        }

        public class AccessTokenRequest
        {
            [JsonPropertyName("permissionType")]
            public AccessTokenPermission PermissionType { get; set; }

            [JsonPropertyName("scope")]
            public ArmAccessTokenScope Scope { get; set; }

            [JsonPropertyName("projectId")]
            public string ProjectId { get; set; }

            [JsonPropertyName("videoId")]
            public string VideoId { get; set; }
        }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public enum AccessTokenPermission
        {
            Reader,
            Contributor,
            MyAccessAdministrator,
            Owner,
        }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public enum ArmAccessTokenScope
        {
            Account,
            Project,
            Video
        }

        public class GenerateAccessTokenResponse
        {
            [JsonPropertyName("accessToken")]
            public string AccessToken { get; set; }

        }
        public class AccountProperties
        {
            [JsonPropertyName("accountId")]
            public string Id { get; set; }
        }

        public class Account
        {
            [JsonPropertyName("properties")]
            public AccountProperties Properties { get; set; }

            [JsonPropertyName("location")]
            public string Location { get; set; }

        }

        public class Video
        {
            [JsonPropertyName("id")]
            public string Id { get; set; }

            [JsonPropertyName("state")]
            public string State { get; set; }
        }
    }
}

```

### Common errors

The upload operation might return the following status codes:

|Status code|ErrorType (in response body)|Description|
|---|---|---|
|409|VIDEO_INDEXING_IN_PROGRESS|The same video is already being processed in this account.|
|400|VIDEO_ALREADY_FAILED|The same video failed to process in this account less than 2 hours ago. API clients should wait at least 2 hours before reuploading a video.|
|429||Trial accounts are allowed 5 uploads per minute. Paid accounts are allowed 50 uploads per minute.|

## Uploading considerations and limitations

- The name of a video must be no more than 80 characters.
- When you're uploading a video based on the URL (preferred), the endpoint must be secured with TLS 1.2 or later.
- The upload size with the URL option is limited to 30 GB.
- The length of the request URL is limited to 6,144 characters. The length of the query string URL is limited to 4,096 characters.
- The upload size with the byte array option is limited to 2 GB.
- The byte array option times out after 30 minutes.
- The URL provided in the `videoURL` parameter must be encoded.
- Indexing Media Services assets has the same limitation as indexing from a URL.
- Azure AI Video Indexer has a duration limit of 4 hours for a single file.
- The URL must be accessible (for example, a public URL).

  If it's a private URL, the access token must be provided in the request.
- The URL must point to a valid media file and not to a webpage, such as a link to the `www.youtube.com` page.
- In a paid account, you can upload up to 50 movies per minute. In a trial account, you can upload up to 5 movies per minute.

> [!Tip]
> We recommend that you use .NET Framework version 4.6.2. or later, because older .NET Framework versions don't default to TLS 1.2.
>
> If you must use an older .NET Framework version, add one line to your code before making the REST API call:
>
> `System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;`

## Firewall

For information about a storage account that's behind a firewall, see the [FAQ](faq.yml#can-a-storage-account-connected-to-the-media-services-account-be-behind-a-firewall).

## Next steps

[Examine the Azure AI Video Indexer output produced by an API](video-indexer-output-json-v2.md)
