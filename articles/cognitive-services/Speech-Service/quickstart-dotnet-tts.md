---
title: "Quickstart: Convert text-to-speech, .NET Core - Speech Service"
titleSuffix: Azure Cognitive Services
description: In this quickstart, you'll learn how to convert text-to-speech with the Text-to-Speech REST API. The sample text included in this guide is structured as Speech Synthesis Markup Language (SSML). This allows you to choose the voice and language of the speech response. The REST API also supports plain text (ASCII or UTF-8), however, if plain text is provided the response will be returned in the Speech Service's default voice and language.
services: cognitive-services
author: erhopf
manager: cgronlun
ms.service: cognitive-services
ms.component: speech-service
ms.topic: conceptual
ms.date: 11/16/2018
ms.author: erhopf
---

# Quickstart: Convert text-to-speech using .NET Core

In this quickstart, you'll learn how to convert text-to-speech using .NET Core and the Text-to-Speech REST API. The request body is structured as [Speech Synthesis Markup Language (SSML)](speech-synthesis-markup.md), which allows you to choose the voice and language of the response.

This quickstart requires an [Azure Cognitive Services account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with a Speech Service resource. If you don't have an account, you can use the [free trial](https://azure.microsoft.com/try/cognitive-services/) to get a subscription key.

## Prerequisites

This quickstart requires:

* [.NET SDK](https://www.microsoft.com/net/learn/dotnet/hello-world-tutorial)
* [Visual Studio](https://visualstudio.microsoft.com/downloads/), [Visual Studio Code](https://code.visualstudio.com/download), or your favorite text editor
* An Azure subscription key for the Speech Service

## Create a .NET Core project

Open a new command prompt (or terminal session) and run these commands:

```console
dotnet new console -o tts-sample
cd tts-sample
```

The first command does two things. It creates a new .NET console application, and creates a directory named `tts-sample`. The second command changes to the directory for your project.

## Add required namespaces to your project

The `dotnet new console` command that you ran earlier created a project, including `Program.cs`. This file is where you'll put your application code. Open `Program.cs`, and replace the existing using statements. These statements ensure that you have access to all the types required to build and run the sample app.

```csharp
using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
```

## Create a class for token exchange

The text-to-speech REST API requires an access token for authentication. To get an access token, an exchange is required. This sample exchanges your Speech Service subscription key for an access token using the `issueToken` endpoint.

This sample assumes that your Speech Service subscription is in the West US region. If you're using a different region, update the value for `FetchTokenUri`. For a full list, see [Regions](https://docs.microsoft.com/azure/cognitive-services/speech-service/regions#rest-apis).

```csharp
public class Authentication
{
  public static readonly string FetchTokenUri = "https://westus.api.cognitive.microsoft.com/sts/v1.0/issueToken";
  private string subscriptionKey;
  private string token;

  public Authentication(string subscriptionKey)
  {
      this.subscriptionKey = subscriptionKey;
      this.token = FetchTokenAsync(FetchTokenUri, subscriptionKey).Result;
  }

  public string GetAccessToken()
  {
      return this.token;
  }

  private async Task<string> FetchTokenAsync(string fetchUri, string subscriptionKey)
  {
      using (var client = new HttpClient())
      {
          client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);
          UriBuilder uriBuilder = new UriBuilder(fetchUri);

          var result = await client.PostAsync(uriBuilder.Uri.AbsoluteUri, null);
          return await result.Content.ReadAsStringAsync();
      }
  }
}
```

> [!NOTE]
> For more information on authentication, see [How to get an access token](https://docs.microsoft.com/azure/cognitive-services/speech-service/rest-apis#how-to-get-an-access-token).

## Get a token and set the host

Locate `static void Main(string[] args)` and replace it with `static async Task Main(string[] args)`. Next, copy this code into the main method. It does a few things, but most importantly, it takes text as an input, and calls the `Authentication` function to exchange your subscription key for an access token. If something goes wrong, the error is printed to the console.

Make sure to add your subscription key before running the app.

```csharp
// Prompts the user to input text for TTS conversion
Console.Write("What would you like to convert to speech? ");
string text = Console.ReadLine();

// Gets an access token
string accessToken;
Console.WriteLine("Attempting token exchange. Please wait...\n");
Authentication auth = new Authentication("YOUR_SUBSCRIPTION_KEY");
try
{
    accessToken = auth.GetAccessToken();
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

This sample assumes you're using the West US endpoint. If your resource is registered to a different region, make sure you update the `host`. For more information, see [Speech Service regions](https://docs.microsoft.com/azure/cognitive-services/speech-service/regions#text-to-speech).

```csharp
string host = "https://westus.tts.speech.microsoft.com/cognitiveservices/v1";
```

## Construct the SSML

Text is sent as the body of a `POST` request. Plain text (ASCII or UTF-8) or [Speech Synthesis Markup Language (SSML)](speech-synthesis-markup.md) are accepted. Plain text requests use the Speech Service's default voice and language. With SSML, you can specify the voice and language.

In this quickstart, we'll use SSML with the language set to `en-US` and the voice set as `Guy24kRUS`. Let's construct the SSML for your request:

```csharp
string body = @"<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'>
              <voice name='Microsoft Server Speech Text to Speech Voice (en-US, ZiraRUS)'>" +
              text + "</voice></speak>";
```

## Instantiate the client, make a request, and save the response

Here you're going to build the request and save the speech response. Make sure that you update `User-Agent` with the name of your resource (located in the Azure portal), and set `X-Microsoft-OutputFormat` to your preferred audio output. For a full list of output formats, see [Audio outputs](https://docs.microsoft.com/azure/cognitive-services/speech-service/rest-apis#audio-outputs).

> [!NOTE]
> This sample uses the `ZiraRUS` voice font. For a complete list of Microsoft provided voices/languages, see [Language support](https://review.docs.microsoft.com/azure/cognitive-services/speech-service/language-support). If you're interested in creating a unique, recognizable voice for your brand, see [Creating custom voice fonts](https://review.docs.microsoft.com/azure/cognitive-services/speech-service/how-to-customize-voice-font).

There's a lot going on in this code sample. Let's quickly review what's happening:

* The client and request are instantiated.
* The HTTP method is set as `POST`.
* Required headers are added to the request.
* The request is sent and the status code is checked.
* The response is read asynchronously, and written to a file named sample.wav.

Copy this code into your project:

```csharp
var webRequest = WebRequest.Create(host);
webRequest.Method = "POST";
webRequest.ContentType = "application/ssml+xml";
webRequest.Headers.Add("X-MICROSOFT-OutputFormat", "riff-16khz-16bit-mono-pcm");
webRequest.Headers["Authorization"] = "Bearer " + accessToken;
((HttpWebRequest)webRequest).UserAgent = "YOUR_RESOURCE_NAME";

// Encode the request body
byte[] encodedBody = Encoding.UTF8.GetBytes(body);
webRequest.ContentLength = encodedBody.Length;
webRequest.GetRequestStream().Write(encodedBody, 0, encodedBody.Length);
webRequest.Timeout = 6000;

// Make the request and write the response to file
using (var httpWebResponse = webRequest.GetResponse() as HttpWebResponse)
using (var dataStream = httpWebResponse.GetResponseStream())
{
    if (httpWebResponse.StatusCode == HttpStatusCode.OK)
    {
        Console.WriteLine("Your speech file is being written to file...");
        using (var fileStream = new FileStream(@"sample.wav", FileMode.Create, FileAccess.Write, FileShare.Write))
        {
            dataStream.CopyTo(fileStream);
            fileStream.Close();
        }
        Console.WriteLine("\nYour file is ready. Press any key to exit.");
        Console.ReadLine();
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
> [Text-to-speech API reference](https://docs.microsoft.com/azure/cognitive-services/speech-service/rest-apis#text-to-speech-api)

## See also

* [Creating custom voice fonts](https://review.docs.microsoft.com/azure/cognitive-services/speech-service/how-to-customize-voice-font)
* [Record voice samples to create a custom voice](https://review.docs.microsoft.com/azure/cognitive-services/speech-service/record-custom-voice-samples)
