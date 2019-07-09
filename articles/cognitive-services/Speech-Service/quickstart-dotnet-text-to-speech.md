---
title: "Quickstart: Convert text-to-speech, .NET Core - Speech Services"
titleSuffix: Azure Cognitive Services
description: In this quickstart, you'll learn how to convert text-to-speech with the Text-to-Speech REST API. The sample text included in this guide is structured as Speech Synthesis Markup Language (SSML). This allows you to choose the voice and language of the speech response.
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 07/05/2019
ms.author: erhopf
---

# Quickstart: Convert text-to-speech using .NET Core

In this quickstart, you'll learn how to convert text-to-speech using .NET Core and the Text-to-Speech REST API. The sample text included in this guide is structured as [Speech Synthesis Markup Language (SSML)](speech-synthesis-markup.md), which allows you to choose the voice and language of the response.

This quickstart requires an [Azure Cognitive Services account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with a Speech Services resource. If you don't have an account, you can use the [free trial](https://azure.microsoft.com/try/cognitive-services/) to get a subscription key.

## Prerequisites

This quickstart requires:

* [.NET Core SDK](https://dotnet.microsoft.com/download)
* [Visual Studio](https://visualstudio.microsoft.com/downloads/), [Visual Studio Code](https://code.visualstudio.com/download), or your favorite text editor
* An Azure subscription key for the Speech Service

## Create a .NET Core project

Open a new command prompt (or terminal session) and run these commands:

```console
dotnet new console -o tts-sample
cd tts-sample
```

The first command does two things. It creates a new .NET console application, and creates a directory named `tts-sample`. The second command changes to the directory for your project.

## Select the C# language version

This quickstart requires C# 7.1 or later. There are a few ways to change the C# version for your project. In this guide, we'll show you how to adjust the `tts-sample.csproj` file. For all available options, such as changing the language in Visual Studio, see [Select the C# language version](https://docs.microsoft.com/dotnet/csharp/language-reference/configure-language-version).

Open your project, then open `tts-sample.csproj`. Make sure that `LangVersion` is set to 7.1 or later. If there isn't a property group for the language version, add these lines:

```xml
<PropertyGroup>
   <LangVersion>7.1</LangVersion>
</PropertyGroup>
```

Make sure to save your changes.

## Add required namespaces to your project

The `dotnet new console` command that you ran earlier created a project, including `Program.cs`. This file is where you'll put your application code. Open `Program.cs`, and replace the existing using statements. These statements ensure that you have access to all the types required to build and run the sample app.

```csharp
using System;
using System.Net.Http;
using System.Text;
using System.IO;
using System.Threading.Tasks;
```

## Create a class for token exchange

The text-to-speech REST API requires an access token for authentication. To get an access token, an exchange is required. This sample exchanges your Speech Services subscription key for an access token using the `issueToken` endpoint.

This sample assumes that your Speech Services subscription is in the West US region. If you're using a different region, update the value for `FetchTokenUri`. For a full list, see [Regions](https://docs.microsoft.com/azure/cognitive-services/speech-service/regions#rest-apis).

```csharp
public class Authentication
{
    private string subscriptionKey;
    private string tokenFetchUri;

    public Authentication(string tokenFetchUri, string subscriptionKey)
    {
        if (string.IsNullOrWhiteSpace(tokenFetchUri))
        {
            throw new ArgumentNullException(nameof(tokenFetchUri));
        }
        if (string.IsNullOrWhiteSpace(subscriptionKey))
        {
            throw new ArgumentNullException(nameof(subscriptionKey));
        }
        this.tokenFetchUri = tokenFetchUri;
        this.subscriptionKey = subscriptionKey;
    }

    public async Task<string> FetchTokenAsync()
    {
        using (var client = new HttpClient())
        {
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", this.subscriptionKey);
            UriBuilder uriBuilder = new UriBuilder(this.tokenFetchUri);

            var result = await client.PostAsync(uriBuilder.Uri.AbsoluteUri, null).ConfigureAwait(false);
            return await result.Content.ReadAsStringAsync().ConfigureAwait(false);
        }
    }
}
```

> [!NOTE]
> For more information on authentication, see [Authenticate with an access token](https://docs.microsoft.com/azure/cognitive-services/authentication#authenticate-with-an-authentication-token).

## Get an access token and set the host URL

Locate `static void Main(string[] args)` and replace it with `static async Task Main(string[] args)`.

Next, copy this code into the main method. It does a few things, but most importantly, it takes text as an input, and calls the `Authentication` function to exchange your subscription key for an access token. If something goes wrong, the error is printed to the console.

Make sure to add your subscription key before running the app.

```csharp
// Prompts the user to input text for TTS conversion
Console.Write("What would you like to convert to speech? ");
string text = Console.ReadLine();

// Gets an access token
string accessToken;
Console.WriteLine("Attempting token exchange. Please wait...\n");

// Add your subscription key here
// If your resource isn't in WEST US, change the endpoint
Authentication auth = new Authentication("https://westus.api.cognitive.microsoft.com/sts/v1.0/issueToken", "YOUR_SUBSCRIPTION_KEY");
try
{
    accessToken = await auth.FetchTokenAsync().ConfigureAwait(false);
    Console.WriteLine("Successfully obtained an access token. \n");
}
catch (Exception ex)
{
    Console.WriteLine("Failed to obtain an access token.");
    Console.WriteLine(ex.ToString());
    Console.WriteLine(ex.Message);
    return;
}
```

Then set the host and route for text-to-speech:

```csharp
string host = "https://westus.tts.speech.microsoft.com/cognitiveservices/v1";
```

## Build the SSML request

Text is sent as the body of a `POST` request. With SSML, you can specify the voice and language. In this quickstart, we'll use SSML with the language set to `en-US` and the voice set as `ZiraRUS`. Let's construct the SSML for your request:

```csharp
string body = @"<speak version='1.0' xmlns='https://www.w3.org/2001/10/synthesis' xml:lang='en-US'>
              <voice name='Microsoft Server Speech Text to Speech Voice (en-US, ZiraRUS)'>" +
              text + "</voice></speak>";
```

> [!NOTE]
> This sample uses the `ZiraRUS` voice font. For a complete list of Microsoft provided voices/languages, see [Language support](language-support.md). If you're interested in creating a unique, recognizable voice for your brand, see [Creating custom voice fonts](how-to-customize-voice-font.md).

## Instantiate the client, make a request, and save synthesized audio to a file

There's a lot going on in this code sample. Let's quickly review what's happening:

* The client and request are instantiated.
* The HTTP method is set as `POST`.
* Required headers are added to the request.
* The request is sent and the status code is checked.
* The response is read asynchronously, and written to a file named sample.wav.

Copy this code into your project. Make sure to replace the value of the `User-Agent` header with the name of your resource from the Azure portal.

```csharp
using (var client = new HttpClient())
{
    using (var request = new HttpRequestMessage())
    {
        // Set the HTTP method
        request.Method = HttpMethod.Post;
        // Construct the URI
        request.RequestUri = new Uri(host);
        // Set the content type header
        request.Content = new StringContent(body, Encoding.UTF8, "application/ssml+xml");
        // Set additional header, such as Authorization and User-Agent
        request.Headers.Add("Authorization", "Bearer " + accessToken);
        request.Headers.Add("Connection", "Keep-Alive");
        // Update your resource name
        request.Headers.Add("User-Agent", "YOUR_RESOURCE_NAME");
        request.Headers.Add("X-Microsoft-OutputFormat", "riff-24khz-16bit-mono-pcm");
        // Create a request
        Console.WriteLine("Calling the TTS service. Please wait... \n");
        using (var response = await client.SendAsync(request).ConfigureAwait(false))
        {
            response.EnsureSuccessStatusCode();
            // Asynchronously read the response
            using (var dataStream = await response.Content.ReadAsStreamAsync().ConfigureAwait(false))
            {
                Console.WriteLine("Your speech file is being written to file...");
                using (var fileStream = new FileStream(@"sample.wav", FileMode.Create, FileAccess.Write, FileShare.Write))
                {
                    await dataStream.CopyToAsync(fileStream).ConfigureAwait(false);
                    fileStream.Close();
                }
                Console.WriteLine("\nYour file is ready. Press any key to exit.");
                Console.ReadLine();
            }
        }
    }
}
```

## Run the sample app

That's it, you're ready to run your text-to-speech app. From the command line (or terminal session), navigate to your project directory and run:

```console
dotnet run
```

If successful, the speech file is saved in your project folder. Play it using your favorite media player.

## Clean up resources

If you've hardcoded your subscription key into your program, make sure to remove the subscription key when you're finished with this quickstart.

## Next steps

> [!div class="nextstepaction"]
> [Explore .NET samples on GitHub](https://github.com/Azure-Samples/Cognitive-Speech-TTS/tree/master/Samples-Http/NETCore)

## See also

* [Text-to-speech API reference](https://docs.microsoft.com/azure/cognitive-services/speech-service/rest-apis)
* [Creating custom voice fonts](how-to-customize-voice-font.md)
* [Record voice samples to create a custom voice](record-custom-voice-samples.md)
