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

In this quickstart, you'll learn how to convert text-to-speech using .NET Core and the Text-to-Speech REST API. The sample text included in this guide is structured as [Speech Synthesis Markup Language (SSML)](speech-synthesis-markup.md), which allows you to choose the voice and language of the response. Plain text (ASCII or UTF-8) is supported, however, the response uses the Speech Service's default voice and language.

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

## Select the C# language version

This quickstart requires C# 7.1 or later. There are a few ways to change the C# version for your project. In this guide, we'll show you how to adjust the `tts-sample.csproj` file. For all available options, such as changing the language in Visual Studio, see [Select the C# language version](https://docs.microsoft.com/dotnet/csharp/language-reference/configure-language-version).

Open your project in Visual Studio, Visual Studio Code, or your favorite text editor. Open `tts-sample.csproj` and locate `LangVersion`.

```csharp
<PropertyGroup>
   <LangVersion>7.1</LangVersion>
</PropertyGroup>
```

Make sure that the version is set to 7.1 or later. Then save your changes.

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

## Set the access token, host, and route

Locate `static async Task Main(string[] args)` and copy this code into the main method. It does a few things, but most importantly, it calls the `Authentication` function to exchange your subscription key for an access token. If something goes wrong, the error is printed to the console.

Make sure that you enter your subscription key.

```csharp
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

Then set the host and route for text-to-speech:

```csharp
string host = "https://westus.tts.speech.microsoft.com";
string route = "/cognitiveservices/v1";
```

## Build the SSML request

Text is sent as the body of a `POST` request. Plain text (ASCII or UTF-8) or [Speech Synthesis Markup Language (SSML)](speech-synthesis-markup.md) are accepted. Plain text requests use the Speech Service's default voice and language. With SSML, you can specify the voice and language.

In this quickstart, we'll use SSML with the language set to `en-US` and the voice set as `Guy24kRUS`. Let's construct the SSML for your request (feel free to get creative):

```csharp
string body = @"<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'>
              <voice name='Microsoft Server Speech Text to Speech Voice (en-US, Guy24kRUS)'>
              We hope you enjoy using Text-to-Speech, a Microsoft Speech Services feature.
              </voice>
              </speak>";
```

## Instantiate the client, make a request, and save the speech to file

There's a lot going on in this code sample. Let's quickly review what's happening:

* The client and request are instantiated.
* The HTTP method is set as `POST`.
* Required headers are added to the request.
* The request is sent and the status code is checked.
* The response is read asynchronously, and written to a file named sample.wav.
* A check is performed to make sure that sample.wav has bytes (isn't empty).

Copy this code into your project. Make sure to replace the value of the `User-Agent` header with the name of your resource from the Azure portal.

```csharp
// Instantiate the client
using (var client = new HttpClient())
{
    // Instantiate the request
    using (var request = new HttpRequestMessage())
    {
        // Set the HTTP method
        request.Method = HttpMethod.Post;

        // Construct the URI
        request.RequestUri = new Uri(host + route);

        // Set the Content-type
        request.Content = new StringContent(body, Encoding.UTF8, "application/ssml+xml");

        // Set additional headers, such as Authorization, and User-Agent
        request.Headers.Add("Authorization", "Bearer " + accessToken);
        request.Headers.Add("Connection", "Keep-Alive");
        request.Headers.Add("User-Agent", "YOUR_RESOURCE_NAME");
        request.Headers.Add("X-Microsoft-OutputFormat", "riff-24khz-16bit-mono-pcm");
        request.Headers.Add("Connection", "Keep-Alive");

        // Create a request
        Console.WriteLine("Calling the TTS service. Please wait... \n");
        using (var response = await client.SendAsync(request))
        {
            // Make sure the request returns a success code
            response.EnsureSuccessStatusCode();
            // Asynchronously read the response
            using (var dataStream = await response.Content.ReadAsStreamAsync())
            {
                /* Write the response to a file. In this sample,
                 * it's an audio file. Then close the stream. */
                using (var fileStream = new FileStream(@"sample.wav", FileMode.Create, FileAccess.Write, FileShare.Write))
                {
                    await dataStream.CopyToAsync(fileStream);
                    fileStream.Close();
                }
            }
        }
    }
    // Check to make sure that the sample.wav has bytes
    if (new FileInfo("sample.wav").Length == 0)
    {
      Console.WriteLine("The response is empty. Please check your request. Press any key to exit.");
      Console.ReadLine();
    }
    else
    {
      Console.WriteLine("Your speech file is ready for playback. Press any key to exit.");
      Console.ReadLine();
    }
}
```

## Run the sample app

That's it, you're ready to run your text-to-speech app. From the command line (or terminal session), navigate to your project directory and run:

```console
dotnet run
```

If successful, the speech file is located in your project folder. Play it using your favorite media player.

## Clean up resources

If you've hardcoded your subscription key into your program, make sure to remove the subscription key when you're finished with this quickstart.

## Next steps

> [!div class="nextstepaction"]
> [Text-to-speech API reference](https://docs.microsoft.com/azure/cognitive-services/speech-service/rest-apis#text-to-speech-api)

## See also

* [Tutorial: Recognize Speech Intents](how-to-recognize-intents-from-speech-csharp.md)
