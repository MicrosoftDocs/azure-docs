---
title: Visual Search mobile app tutorial
description: Open Source C# application implementing visual search using the Cognitive Services Computer Vision API, Bing Web Search API, and Xamarin.Forms cross-platform framework.
services: bing-web-search, computer-vision
author: Aristoddle 
manager: bking

ms.service: cognitive-services
ms.devlang: csharp
ms.topic: article
ms.date: 06/22/2017
ms.author: t-jolanz
---

# Visual Search mobile app tutorial

## Introduction  
This tutorial explores the [Computer Vision API](https://azure.microsoft.com/services/cognitive-services/computer-vision/) and [Bing Web Search API](https://azure.microsoft.com/services/cognitive-services/bing-web-search-api/) endpoints and shows how they can be used to build a basic visual search application with [Xamarin.Forms](https://developer.xamarin.com/guides/xamarin-forms/).  Overall, this tutorial covers the following topics: 

> [!div class="checklist"]
> * Setting up Visual Studio to develop Xamarin.Forms applications
> * Using the [Xamarin Media Plugin](https://github.com/jamesmontemagno/MediaPlugin) to capture and import image data
> * Parsing text from an image using the Computer Vision APIs
> * Sending search requests to the Bing Web Search API
> * Parsing JSON responses from both APIs with [Json.NET](https://github.com/JamesNK/Newtonsoft.Json) (with LINQ and model object deserialization)
> * Creating a cross-platform Xamarin.Forms user interface for visual search 

## Prerequisites

This example was developed using Xamarin.Forms with [Visual Studio 2017](https://www.visualstudio.com/downloads/). The Community Edition of Visual Studio 2017 may be used. For more information about using Xamarin with Visual Studio, see the [Xamarin documentation](https://developer.xamarin.com/guides/cross-platform/getting_started/).

This sample makes use of the following NuGet Packages:

> [!div class="checklist"]
> * [Xamarin Media Plugin](https://github.com/jamesmontemagno/MediaPlugin)
> * [Json.NET](https://github.com/JamesNK/Newtonsoft.Json)

The application uses the following Cognitive Services APIs:

> [!div class="checklist"]
> * [Bing Web Search API](https://azure.microsoft.com/services/cognitive-services/bing-web-search-api/) 
> * [Computer Vision API](https://azure.microsoft.com/services/cognitive-services/computer-vision/)

To obtain 30-day trial keys for these APIs, see [Try Cognitive Services](https://azure.microsoft.com/try/cognitive-services/). For more information about obtaining keys for commercial use, see [Pricing](https://azure.microsoft.com/pricing/calculator/).

## Setup for development  

### Installing Xamarin on Windows
With any edition of Visual Studio 2017 installed, open the Visual Studio Installer, select the hamburger menu associated with your Visual Studio installation, and choose **Modify**.  

![Visual Studio installer](./media/computer-vision-web-search-tutorial/visual-studio-installer.png) 

Scroll down to Mobile & Gaming and enable **Mobile Development with .NET**, if it isn't already enabled.

![Visual Studio installer with Xamarin.Forms selected](./media/computer-vision-web-search-tutorial/xamarin-forms-is-enabled.png)

Finally, click **Modify** in the bottom right corner of the window and wait for Xamarin to install.

### Installing Xamarin on macOS
Xamarin comes pre-packaged with Visual Studio for Mac. No installation should be needed.

## Building and running the app

A Visual Studio solution file *(.sln)* for the Visual Search application can be downloaded from [Visual Search App with Cognitive Services](https://azure.microsoft.com/resources/samples/cognitive-services-xamarin-forms-computer-vision-search/). You can download the ZIP archive using a Web browser, clone it to your workstation from GitHub, or download it using Visual Studio.

To start working with the sample, open `VisualSearchApp.sln` in Visual Studio.  Initializing the required components may take a moment.

The application requires two third-party libraries: **Json.NET** and the **Xamarin Media Plugin**. You can install these libraries right in Visual Studio with the NuGet Package Manager. Choose  **Tools > NuGet Package Manager > Manage NuGet Packages For Solution**, or right-click the solution in Solution Explorer and choose **Manage NuGet Packages** from the context menu.

In the NuGet window, search for and install **Xamarin Media plugin** (Xam.Plugin.Media) version 2.6.2 and **Json.NET** (Newtonsoft.Json) 10.0.3. Be sure to select all projects when installing.

To build the application for all available platforms, press **Ctrl + Shift + B**, or click **Build** on the ribbon menu and choose **Build Solution**.  To compile and test code for iOS from a Windows system, see [this guide](https://developer.xamarin.com/guides/ios/getting_started/installation/windows/) for help.

Before running the application, you must select a target Configuration, Platform, and Project.  Xamarin.Forms applications compile to native code for Windows, Android, and iOS. This tutorial includes screenshots of the Windows version of the sample, but all versions are functionally equivalent. The deployment settings used in this guide are shown here.  

![Visual Studio configured to compile for an Android phone](./media/computer-vision-web-search-tutorial/configuration-selection.png)

Once the build process has succeeded and you have selected a target platform, click the **Start** button in the toolbar or press **F5**. Visual Studio deploys your solution to your target platform and launches it.

The Add Keys page appears. (This page is defined in `AddKeysPage.xaml`.)  

![Image of the Add Keys Page](./media/computer-vision-web-search-tutorial/add-keys-page.png)  

Here, paste in your Computer Vision and Bing Web Search API keys. The Computer Vision API also requires you to choose the server where the endpoint is hosted.

> [!TIP]
> To skip this page, enter this information in the appropriate locations in `App.xaml.cs`. 

The application validates your keys by performing a test query, then takes you to the OCR Select page (defined in `OcrSelectPage.xaml`).
   
![Image of the OCR Select Page](./media/computer-vision-web-search-tutorial/ocr-select-page.png)  

At the top of this screen, you can choose whether the text you want to recognize is printed or handwritten.

> [!TIP]
> Hold the item from which you're trying to recognize text as level as possible and make sure it is evenly lit with no reflections. We've found that handwritten OCR sometimes works better for script fonts or other "fancy" text.

Next, click **Take Photo** or **Import Photo** to either take a photo using your device's camera, or choose a photo stored on your device.

After a photo is taken or chosen, the image is passed to the Computer Vision API. The Words Found page (defined in `OcrResultsPage.xaml`) displays any words recognized in the image.

![Image of the OCR Results Page](./media/computer-vision-web-search-tutorial/ocr-results-page.png)  

> [!NOTE]
> The image we used for these results is in the source repository as  `SamplePhotos\TestImage.jpg`.

When you click an item on the Words Found page, the Web Results page (`WebResultsPage.xaml`) appears, showing you the top Bing results for that search.

![Image of the Web Results Page](./media/computer-vision-web-search-tutorial/web-results-page.png)  
Finally, choose an item on the Web Results page to open the link in an embedded WebView. (Or navigate back to choose a different result.)

![Image of the Web View Page](./media/computer-vision-web-search-tutorial/web-view-page.png)  

You can interact with the page as you would in any Web browser, or navigate back to the Web Results page. 

## Review and Learn

Now that you've taken the Visual Search app for a spin, let's explore exactly how we're using the two Microsoft Cognitive Services APIs.  Whether you're using this sample as a starting point for your own application or simply as a how-to for the APIs, it's valuable to walk through the application screen-by-screen to examine exactly how it works.

### Add Keys Page
The Add Keys page UI is defined in `AddKeysPage.xaml`, and its primary logic is defined in `AddKeysPage.xaml.cs`. Since the keys are validated by making a test request, the time is ripe to establish how to use Cognitive Services endpoints in C#.  

The basic structure of this interaction is: 

1. Instantiate *HttpResponseMessage* and *HttpClient* objects from *System.Net.Http*
2. Attach any desired headers (defined in each endpoint's API reference) to the *HttpClient* object
3. Send a GET or POST request with your data, adding any necessary parameters to your endpoint URI
4. Verify that the response was successful
5. Pass the response on for further processing

The function that checks the validity of the Bing Search API key is `CheckBingSearchKey()`, shown here.

```csharp
async Task CheckBingSearchKey(object sender = null, EventArgs e = null)
{
    HttpResponseMessage response;
    HttpClient SearchApiClient = new HttpClient();

    SearchApiClient.DefaultRequestHeaders.Add(AppConstants.OcpApimSubscriptionKey, BingSearchKeyEntry.Text);

    try
    {
        response = await SearchApiClient.GetAsync(AppConstants.BingWebSearchApiUrl + "q=test");

        if (response.StatusCode != System.Net.HttpStatusCode.Unauthorized)
        {
            BingSearchKeyEntry.BackgroundColor = Color.Green;
            AppConstants.BingWebSearchApiKey = BingSearchKeyEntry.Text;
            bingSearchKeyWorks = true;
        }
        else
        {
            BingSearchKeyEntry.BackgroundColor = Color.Red;
            bingSearchKeyWorks = false;
        }
    }
    catch( Exception exception )
    {
        BingSearchKeyEntry.BackgroundColor = Color.Red;
        Console.WriteLine($"ERROR: {exception.Message}");
    }
}
```

A similar function, `CheckComputerVisionKey()`, is used to validate the Computer Vision key.

### OCR Select page

The OCR Select page (`OcrSelectPage.xaml`) has two important roles. First, it determines what kind of OCR is performed on the target photo. Second, it lets the user capture or open the image they wish to process.

The second task is traditionally cumbersome in a cross-platform application, because each platform requires different code. The Xamarin Media Plugin handles it with just a few lines of code.

The following function incorporates an example of using the Xamarin Media Plugin for photo capture.  In it, we:

1. Ensure that a camera is available on the current device
2. Instantiate a `StoreCameraMediaOptions` object to specify where to save the captured image
3. Capture an image and obtain a `MediaFile` object containing the image data
4. Unpack the `MediaFile` into a byte array
5. Return the byte array for further processing

Here's `TakePhoto()`, the function that uses the Xamarin Media Plugin for photo capture.  

```csharp
async Task<byte[]> TakePhoto()
{
    MediaFile photoMediaFile = null;
    byte[] photoByteArray = null;

    if (CrossMedia.Current.IsCameraAvailable)
    {
        var mediaOptions = new StoreCameraMediaOptions
        {
            PhotoSize = PhotoSize.Medium,
            AllowCropping = true,
            SaveToAlbum = true,
            Name = $"{DateTime.UtcNow}.jpg"
        };
        photoMediaFile = await CrossMedia.Current.TakePhotoAsync(mediaOptions);
        photoByteArray = MediaFileToByteArray(photoMediaFile);
    }
    else
    {
        await DisplayAlert("Error", "No camera found", "OK");
        Console.WriteLine($"ERROR: No camera found");
    }
    return photoByteArray;
}
```
The photo import utility works in a similar way. Both pieces of functionality can be found in `OcrSelectPage.xaml.cs`. 
 
> [!NOTE]
> The Handwritten OCR endpoint can only handle photos that are smaller than 4 MB. To avoid file size issues, we reduce the photo to 50% of its original size by setting the option `PhotoSize = PhotoSize.Medium` on the `StoreCameraMediaOptions` object.  If your device takes exceptionally high-quality photos and you are getting errors, you might try `PhotoSize = PhotoSize.Small` instead.

Here's the utility function used to convert a *MediaFile* into a byte array.

```csharp
byte[] MediaFileToByteArray(MediaFile photoMediaFile)
{
    using (var memStream = new MemoryStream())
    {
        photoMediaFile.GetStream().CopyTo(memStream);
        return memStream.ToArray();
    }
}
```

### OCR Results page

The OCR Results page displays text extracted from the image using the  **Json.NET** [SelectToken method](http://www.newtonsoft.com/json/help/html/SelectToken.htm).  The two OCR endpoints work a little differently, so it's valuable to discuss both.  

Because the Computer Vision API is only hosted in a few server locations, its endpoint must be constructed dynamically at runtime. The function `SetOcrLocation` (part of the static *AppConstants* class found in `AppConstants.cs`) sets the location of the URI endpoint. It corresponds to the user's selection on the Add Keys Page or uses the value set in `App.xaml.cs`. 

```csharp
public static void SetOcrLocation(string location)
{
    ComputerVisionApiOcrUrl = $"https://{location}.api.cognitive.microsoft.com/vision/v1.0/ocr?language=en&detectOrientation=true";
    ComputerVisionApiHandwritingUrl = $"https://{location}.api.cognitive.microsoft.com/vision/v1.0/recognizeText?handwriting=true";
}
```

Let's take a closer look at these API requests. The Computer Vision OCR API is capable of parsing text from an undetermined language, but we tell it to search for English text to improve results. We also let the API detect text orientation for us. Using a fixed orientation might improve our parsing results, but orientation detection can be useful in a mobile application.

You can learn more about the parameters available with this endpoint from the [Print Optical Character Recognition API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/56f91f2d778daf23d8ec6739/operations/56f91f2e778daf14a499e1fc).  

The Handwritten OCR API is still in preview, and currently only works with English text.  For this reason, its only parameter is currently a flag indicating whether or not to parse handwritten text at all. The handwritten OCR API can parse both machine printed and handwritten text, but `handwriting=false` yields better results on printed text. 

Since this application is in English, we could have used only Handwritten OCR for this sample, and set the `handwriting` flag according to what the user tells us to recognize.  We used both endpoints for illustrative purposes.  

You can learn more about the parameters available with this endpoint from the [Handwritten Optical Character Recognition API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/56f91f2d778daf23d8ec6739/operations/587f2c6a154055056008f200).

Now, let's look at the functions that call these APIs.

`FetchPrintedWordList()` uses the Print OCR endpoint to parse printed text from images. The HTTP request follows a structure similar to the call that used in the Add Keys page to validate the key, but we need to send a photo. A photo is too large to pass in a query string, so we must use an HTTP POST request instead of a GET request. We need to encode our photo (which exists in memory as a byte array) into a `ByteArrayContent` object and add a header to this object defining the type of data we're sending. 

You can read about the acceptable content types in the [Computer Vision API reference](https://westus.dev.cognitive.microsoft.com/docs/services/56f91f2d778daf23d8ec6739/operations/587f2c6a154055056008f200).  

```csharp
async Task<ObservableCollection<string>> FetchPrintedWordList()
{
    ObservableCollection<string> wordList = new ObservableCollection<string>();
    if (photo != null)
    {
        HttpResponseMessage response = null;
        using (var content = new ByteArrayContent(photo))
        {
            // The media type of the body sent to the API. 
            // "application/octet-stream" defines an image represented 
            // as a byte array
            content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
            response = await visionApiClient.PostAsync(AppConstants.ComputerVisionApiOcrUrl, content);
        }

        string ResponseString = await response.Content.ReadAsStringAsync();
        JObject json = JObject.Parse(ResponseString);

        // Here, we pull down each "line" of text and then join it to 
        // make a string representing the entirety of each line.  
        // In the Handwritten endpoint, you are able to extract the 
        // "line" without any further processing.  If you would like 
        // to simply get a list of all extracted words,* you can do 
        // this with:
        // json.SelectTokens("$.regions[*].lines[*].words[*].text) 
        IEnumerable<JToken> lines = json.SelectTokens("$.regions[*].lines[*]");
        if (lines != null)
        {
            foreach (JToken line in lines)
            {
                IEnumerable<JToken> words = line.SelectTokens("$.words[*].text");
                if (words != null)
                {
                    wordList.Add(string.Join(" ", words.Select(x => x.ToString())));
                }
            }
        }
    }
    return wordList;
}
```
> [!TIP]
> Note how we're using the **Json.NET** [SelectToken method](http://www.newtonsoft.com/json/help/html/SelectToken.htm) to extract text from the response object. `SelectToken` is ideal when we need only a specific part of the JSON response, which we can then pass on to the next function. In other parts of the code, we deserialize JSON responses into model objects defined in `ModelObjects.cs`.

The primary difference between the Print OCR and Handwritten OCR request is that the Print OCR service returns the recognized text as part of the HTTP response, while the Handwritten OCR service requires an additional request to get the information. The initial Handwritten OCR request returns an HTTP 202 status, which signals only that processing has begun. This response contains an endpoint that the client must check to obtain the completed response when it is available. See `FetchHandwrittenWordList()` to see how it all works.

```csharp
async Task<ObservableCollection<string>> FetchHandwrittenWordList()
{
    ObservableCollection<string> wordList = new ObservableCollection<string>();
    if (photo != null)
    {
        // Make the POST request to the handwriting recognition URL
        HttpResponseMessage response = null;
        using (var content = new ByteArrayContent(photo))
        {
            // The media type of the body sent to the API. 
            // "application/octet-stream" defines an image represented 
            // as a byte array
            content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
            response = await visionApiClient.PostAsync(AppConstants.ComputerVisionApiHandwritingUrl, content);
        }

        // Fetch results
        IEnumerable<string> operationLocationValues;
        string statusUri = string.Empty;
        if (response.Headers.TryGetValues("Operation-Location", out operationLocationValues))
        {
            statusUri = operationLocationValues.FirstOrDefault();

            // Ping status URL, wait for processing to finish 
            JObject obj = await FetchResultFromStatusUri(statusUri);
            IEnumerable<JToken> strings = obj.SelectTokens("$.recognitionResult.lines[*].text");
            foreach (string s in strings)
            {
                wordList.Add((string)s);
            }
        }
    }
    return wordList;
}
```

`FetchResultFromStatusUri()` is the second part of the Handwriting OCR process. It pings the URI extracted from the initial response's metadata either until a result is obtained or the function times out.  It's important that this function is called asynchronously on its own thread. Otherwise this method would lock up the user interface until processing was complete.

```csharp
// Takes in the url to check for handwritten text parsing results, and pings it per second until processing is finished
// Returns the JObject holding data for a successful parse
async Task<JObject> FetchResultFromStatusUri(string statusUri)
{
    JObject obj = null;
    int timeoutcounter = 0;
    HttpResponseMessage response = await visionApiClient.GetAsync(statusUri);
    string responseString = await response.Content.ReadAsStringAsync();
    obj = JObject.Parse(responseString);
    while ((!((string)obj.SelectToken("status")).Equals("Succeeded")) && (timeoutcounter++ < 60))
    {
        await Task.Delay(1000);
        response = await visionApiClient.GetAsync(statusUri);
        responseString = await response.Content.ReadAsStringAsync();
        obj = JObject.Parse(responseString);
    } 
    return obj;
}
```

### Web Results page
After the user selects a search term displayed on the OCR Results page, we move along to the Web Results page.  Here we construct a [Bing Web Search API](https://azure.microsoft.com/services/cognitive-services/bing-web-search-api/) request, send it to the service's endpoint, and deserialize the JSON response using the **Json.NET** [DeserializeObject](http://www.newtonsoft.com/json/help/html/DeserializeObject.htm) method.  

```csharp
async Task<WebResultsList> GetQueryResults()
{
    // URL-encode the query term
    var queryString = System.Net.WebUtility.UrlEncode(queryTerm);

    // Here we encode the URL that will be used for the GET request to 
    // find query results.  Its arguments are as follows:
    // 
    // - [count=20] This sets the number of webpage objects returned at 
    //   "$.webpages" in the JSON response.  Currently, the API asks for 
    //   20 webpages in the response
    //
    // - [mkt=en-US] This sets the market where the results come from.
    //   Currently, the API looks for english results based in the 
    //   United States.
    //
    // - [q=queryString] This sets the string queried using the Search 
    //   API.   
    //
    // - [responseFilter=Webpages] This filters the response to only 
    //   include Webpage results.  This tag can take a comma seperated 
    //   list of response types that you are looking for.  If left 
    //   blank, all responses (webPages, News, Videos, etc) are 
    //   returned.
    //
    // - [setLang=en] This sets the languge for user interface strings. 
    //   To learn more about UI strings, check the Web Search API 
    //   reference.
    //
    // - [API Reference] https://docs.microsoft.com/rest/api/cognitiveservices/bing-web-api-v7-reference
    string uri = AppConstants.BingWebSearchApiUrl + $"count=20&mkt=en-US&q={queryString}&responseFilter=Webpages&setLang=en";

    // Make the HTTP Request
    WebResultsList webResults = null;
    HttpResponseMessage httpResponseMessage = await searchApiClient.GetAsync(uri);
    var responseContentString = await httpResponseMessage.Content.ReadAsStringAsync();
    JObject json = JObject.Parse(responseContentString);
    JToken resultBlock = json.SelectToken("$.webPages");
    if (resultBlock != null)
    {
        webResults = JsonConvert.DeserializeObject<WebResultsList>(resultBlock.ToString());
    }
    return webResults;
}
```

The Bing Web Search API works best when you provide as much information as you can about what the user might want. In particular, you should almost always use the `mkt` and `setLang` paramaters (here set for US English) to identify your user's location and preferred language.

> [!NOTE]
> We kept our Bing Web Search query simple in order to make sure the source code was easy to understand.  In a real application, you should add the following headers to your HTTP request for improved results. 
> * User-Agent  
> * X-MSEdge-ClientID  
> * X-Search-ClientIP  
> * X-Search-Location  
>
> You can learn more about these header values in the [Bing Web Search API Reference](https://docs.microsoft.com/rest/api/cognitiveservices/bing-web-api-v7-reference#headers)

## Next Steps
Microsoft Cognitive Services provide many additional services that you could easily integrate into this application.  For example, you could:

* Add [Bing Entity Search](https://azure.microsoft.com/services/cognitive-services/bing-entity-search-api/) to augment your web search results
* Swap in [Bing Custom Search](https://azure.microsoft.com/services/cognitive-services/bing-custom-search/) in place of Bing Web Search
* Use the [Bing Image Search](https://azure.microsoft.com/services/cognitive-services/bing-image-search-api/) image insights capability to learn more about your captured image and find similar images on the web
* Employ [Bing Spell Check](https://azure.microsoft.com/services/cognitive-services/spell-check/) to further improve the quality of your parsed text
* Integrate the [Microsoft Translator](https://azure.microsoft.com/services/cognitive-services/translator-text-api/) to see your extracted text in different languages
* Mix and match the other services from the [Cognitive Services Portal](https://azure.microsoft.com/services/cognitive-services/); the sky's the limit!
