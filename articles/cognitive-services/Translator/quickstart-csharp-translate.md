---
title: "Quickstart: Translate text, C# - Translator Text"
titleSuffix: Azure Cognitive Services
description: In this quickstart, you translate text from one language to another using the Translator Text API with C#.
services: cognitive-services
author: swmachan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: quickstart
ms.date: 06/13/2019
ms.author: swmachan
---

# Quickstart: Use the Translator Text API to translate a string using C#

In this quickstart, you'll learn how to translate a text string from English to German, Italian, Japanese and Thai using .NET Core, C# 7.1 or later, and the Translator Text REST API.

This quickstart requires an [Azure Cognitive Services account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with a Translator Text resource. If you don't have an account, you can use the [free trial](https://azure.microsoft.com/try/cognitive-services/) to get a subscription key.

>[!TIP]
> If you'd like to see all the code at once, the source code for this sample is available on [GitHub](https://github.com/MicrosoftTranslator/Text-Translation-API-V3-C-Sharp).

## Prerequisites

* C# 7.1 or later
* [.NET SDK](https://www.microsoft.com/net/learn/dotnet/hello-world-tutorial)
* [Json.NET NuGet Package](https://www.nuget.org/packages/Newtonsoft.Json/)
* [Visual Studio](https://visualstudio.microsoft.com/downloads/), [Visual Studio Code](https://code.visualstudio.com/download), or your favorite text editor
* An Azure subscription key for Translator Text

## Create a .NET Core project

Open a new command prompt (or terminal session) and run these commands:

```console
dotnet new console -o translate-sample
cd translate-sample
```

The first command does two things. It creates a new .NET console application, and creates a directory named `translate-sample`. The second command changes to the directory for your project.

Next, you'll need to install Json.Net. From your project's directory, run:

```console
dotnet add package Newtonsoft.Json --version 11.0.2
```

## Select the C# language version

This quickstart requires C# 7.1 or later. There are a few ways to change the C# version for your project. In this guide, we'll show you how to adjust the `translate-sample.csproj` file. For all available options, such as changing the language in Visual Studio, see [Select the C# language version](https://docs.microsoft.com/dotnet/csharp/language-reference/configure-language-version).

Open your project, then open `translate-sample.csproj`. Make sure that `LangVersion` is set to 7.1 or later. If there isn't a property group for the language version, add these lines:

```xml
<PropertyGroup>
   <LangVersion>7.1</LangVersion>
</PropertyGroup>
```

## Add required namespaces to your project

The `dotnet new console` command that you ran earlier created a project, including `Program.cs`. This file is where you'll put your application code. Open `Program.cs`, and replace the existing using statements. These statements ensure that you have access to all the types required to build and run the sample app.

```csharp
using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
// Install Newtonsoft.Json with NuGet
using Newtonsoft.Json;
```

## Create classes for the JSON response

Next, we're going to create a set of classes that are used when deserializing the JSON response returned by the Translator Text API.

```csharp
/// <summary>
/// The C# classes that represents the JSON returned by the Translator Text API.
/// </summary>
public class TranslationResult
{
    public DetectedLanguage DetectedLanguage { get; set; }
    public TextResult SourceText { get; set; }
    public Translation[] Translations { get; set; }
}

public class DetectedLanguage
{
    public string Language { get; set; }
    public float Score { get; set; }
}

public class TextResult
{
    public string Text { get; set; }
    public string Script { get; set; }
}

public class Translation
{
    public string Text { get; set; }
    public TextResult Transliteration { get; set; }
    public string To { get; set; }
    public Alignment Alignment { get; set; }
    public SentenceLength SentLen { get; set; }
}

public class Alignment
{
    public string Proj { get; set; }
}

public class SentenceLength
{
    public int[] SrcSentLen { get; set; }
    public int[] TransSentLen { get; set; }
}
```

## Create a function to translate text

Within the `Program` class, create an asynchronous function called `TranslateTextRequest()`. This function takes four arguments: `subscriptionKey`, `host`, `route`, and `inputText`.

```csharp
// This sample requires C# 7.1 or later for async/await.
// Async call to the Translator Text API
static public async Task TranslateTextRequest(string subscriptionKey, string host, string route, string inputText)
{
  /*
   * The code for your call to the translation service will be added to this
   * function in the next few sections.
   */
}
```

## Serialize the translation request

Next, we need to create and serialize the JSON object that includes the text you want to translate. Keep in mind, you can pass more than one object in the `body`.

```csharp
object[] body = new object[] { new { Text = inputText } };
var requestBody = JsonConvert.SerializeObject(body);
```

## Instantiate the client and make a request

These lines instantiate the `HttpClient` and the `HttpRequestMessage`:

```csharp
using (var client = new HttpClient())
using (var request = new HttpRequestMessage())
{
  // In the next few sections you'll add code to construct the request.
}
```

## Construct the request and print the response

Inside the `HttpRequestMessage` you'll:

* Declare the HTTP method
* Construct the request URI
* Insert the request body (serialized JSON object)
* Add required headers
* Make an asynchronous request
* Print the response using the classes you created earlier

Add this code to the `HttpRequestMessage`:

```csharp
// Build the request.
// Set the method to Post.
request.Method = HttpMethod.Post;
// Construct the URI and add headers.
request.RequestUri = new Uri(host + route);
request.Content = new StringContent(requestBody, Encoding.UTF8, "application/json");
request.Headers.Add("Ocp-Apim-Subscription-Key", subscriptionKey);

// Send the request and get response.
HttpResponseMessage response = await client.SendAsync(request).ConfigureAwait(false);
// Read response as a string.
string result = await response.Content.ReadAsStringAsync();
// Deserialize the response using the classes created earlier.
TranslationResult[] deserializedOutput = JsonConvert.DeserializeObject<TranslationResult[]>(result);
// Iterate over the deserialized results.
foreach (TranslationResult o in deserializedOutput)
{
    // Print the detected input language and confidence score.
    Console.WriteLine("Detected input language: {0}\nConfidence score: {1}\n", o.DetectedLanguage.Language, o.DetectedLanguage.Score);
    // Iterate over the results and print each translation.
    foreach (Translation t in o.Translations)
    {
        Console.WriteLine("Translated to {0}: {1}", t.To, t.Text);
    }
}
```

If you are using a Cognitive Services multi-service subscription, you must also include the `Ocp-Apim-Subscription-Region` in your request parameters. [Learn more about authenticating with the multi-service subscription](https://docs.microsoft.com/azure/cognitive-services/translator/reference/v3-0-reference#authentication).

## Put it all together

The last step is to call `TranslateTextRequest()` in the `Main` function. In this sample, we're translating to German (`de`), Italian (`it`), Japanese (`ja`), and Thai (`th`). Locate `static void Main(string[] args)` and replace it with this code:

```csharp
static async Task Main(string[] args)
{
    // This is our main function.
    // Output languages are defined in the route.
    // For a complete list of options, see API reference.
    // https://docs.microsoft.com/azure/cognitive-services/translator/reference/v3-0-translate
    string host = "https://api.cognitive.microsofttranslator.com";
    string route = "/translate?api-version=3.0&to=de&to=it&to=ja&to=th";
    string subscriptionKey = "YOUR_TRANSLATOR_TEXT_KEY_GOES_HERE";
    // Prompts you for text to translate. If you'd prefer, you can
    // provide a string as textToTranslate.
    Console.Write("Type the phrase you'd like to translate? ");
    string textToTranslate = Console.ReadLine();
    await TranslateTextRequest(subscriptionKey, host, route, textToTranslate);
}
```

You'll notice that in `Main`, you're declaring `subscriptionKey`, `host`, and `route`. Additionally, you're prompting the user for input with `Console.Readline()` and assigning the value to `textToTranslate`.

## Run the sample app

That's it, you're ready to run your sample app. From the command line (or terminal session), navigate to your project directory and run:

```console
dotnet run
```

## Sample response

After you run the sample, you should see the following printed to terminal:

```bash
Detected input language: en
Confidence score: 1

Translated to de: Hallo Welt!
Translated to it: Salve, mondo!
Translated to ja: ハローワールド！
Translated to th: หวัดดีชาวโลก!
```

This message is built from the raw JSON, which will look like this:

```json
[
  {
    "detectedLanguage": {
      "language": "en",
      "score": 1.0
    },
    "translations": [
      {
        "text": "Hallo Welt!",
        "to": "de"
      },
      {
        "text": "Salve, mondo!",
        "to": "it"
      },
      {
        "text": "ハローワールド！",
        "to": "ja"
      },
      {
        "text": "หวัดดีชาวโลก!",
        "to": "th"
      }
    ]
  }
]
```

## Clean up resources

Make sure to remove any confidential information from your sample app's source code, like subscription keys.

## Next steps

Take a look at the API reference to understand everything you can do with the Translator Text API.

> [!div class="nextstepaction"]
> [API reference](https://docs.microsoft.com/azure/cognitive-services/translator/reference/v3-0-reference)

## See also

* [Transliterate text](quickstart-csharp-transliterate.md)
* [Identify the language by input](quickstart-csharp-detect.md)
* [Get alternate translations](quickstart-csharp-dictionary.md)
* [Get a list of supported languages](quickstart-csharp-languages.md)
* [Determine sentence lengths from an input](quickstart-csharp-sentences.md)
