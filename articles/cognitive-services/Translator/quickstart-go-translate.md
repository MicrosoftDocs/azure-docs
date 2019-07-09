---
title: "Quickstart: Translate text, Go - Translator Text API"
titleSuffix: Azure Cognitive Services
description: In this quickstart, you'll translate text from one language to another using the Translator Text API with Go in less than 10 minutes.
services: cognitive-services
author: swmachan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: quickstart
ms.date: 06/04/2019
ms.author: swmachan
---

# Quickstart: Use the Translator Text API to translate a string using Go

In this quickstart, you'll learn how to translate a text string from English to Italian and German using Go and the Translator Text REST API.

This quickstart requires an [Azure Cognitive Services account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with a Translator Text resource. If you don't have an account, you can use the [free trial](https://azure.microsoft.com/try/cognitive-services/) to get a subscription key.

>[!TIP]
> If you'd like to see all the code at once, the source code for this sample is available on [GitHub](https://github.com/MicrosoftTranslator/Text-Translation-API-V3-Go).

## Prerequisites

This quickstart requires:

* [Go](https://golang.org/doc/install)
* An Azure subscription key for Translator Text

## Create a project and import required modules

Create a new Go project using your favorite IDE or editor. Then copy this code snippet into your project in a file named `translate-text.go`.

```go
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "net/url"
    "os"
)
```

## Create the main function

This sample will try to read your Translator Text subscription key from the environment variable `TRANSLATOR_TEXT_KEY`. If you're not familiar with environment variables, you can set `subscriptionKey` as a string and comment out the conditional statement.

Copy this code into your project:

```go
func main() {
    /*
     * Read your subscription key from an env variable.
     * Please note: You can replace this code block with
     * var subscriptionKey = "YOUR_SUBSCRIPTION_KEY" if you don't
     * want to use env variables. If so, be sure to delete the "os" import.
     */
    subscriptionKey := os.Getenv("TRANSLATOR_TEXT_KEY")
    if subscriptionKey == "" {
       log.Fatal("Environment variable TRANSLATOR_TEXT_KEY is not set.")
    }
    /*
     * This calls our translate function, which we'll
     * create in the next section. It takes a single argument,
     * the subscription key.
     */
    translate(subscriptionKey)
}
```

## Create a function to translate text

Let's create a function to translate text. This function will take a single argument, your Translator Text subscription key.

```go
func translate(subscriptionKey string) {
    /*  
     * In the next few sections, we'll add code to this
     * function to make a request and handle the response.
     */
}
```

Next, let's construct the URL. The URL is built using the `Parse()` and `Query()` methods. You'll notice that parameters are added with the `Add()` method. In this sample, you're translating from English to German and Italian: `de` and `it`.

Copy this code into the `translate` function.

```go
// Build the request URL. See: https://golang.org/pkg/net/url/#example_URL_Parse
u, _ := url.Parse("https://api.cognitive.microsofttranslator.com/translate?api-version=3.0")
q := u.Query()
q.Add("to", "de")
q.Add("to", "it")
u.RawQuery = q.Encode()
```

>[!NOTE]
> For more information about endpoints, routes, and request parameters, see [Translator Text API 3.0: Translate](https://docs.microsoft.com/azure/cognitive-services/translator/reference/v3-0-translate).

## Create a struct for your request body

Next, create an anonymous structure for the request body and encode it as JSON with `json.Marshal()`. Add this code to the `translate` function.

```go
// Create an anonymous struct for your request body and encode it to JSON
body := []struct {
	Text string
}{
	{Text: "Hello, world!"},
}
b, _ := json.Marshal(body)
```

## Build the request

Now that you've encoded the request body as JSON, you can build your POST request, and call the Translator Text API.

```go
// Build the HTTP POST request
req, err := http.NewRequest("POST", u.String(), bytes.NewBuffer(b))
if err != nil {
    log.Fatal(err)
}
// Add required headers to the request
req.Header.Add("Ocp-Apim-Subscription-Key", subscriptionKey)
req.Header.Add("Content-Type", "application/json")

// Call the Translator Text API
res, err := http.DefaultClient.Do(req)
if err != nil {
    log.Fatal(err)
}
```

If you are using a Cognitive Services multi-service subscription, you must also include the `Ocp-Apim-Subscription-Region` in your request parameters. [Learn more about authenticating with the multi-service subscription](https://docs.microsoft.com/azure/cognitive-services/translator/reference/v3-0-reference#authentication).

## Handle and print the response

Add this code to the `translate` function to decode the JSON response, and then format and print the result.

```go
// Decode the JSON response
var result interface{}
if err := json.NewDecoder(res.Body).Decode(&result); err != nil {
	log.Fatal(err)
}
// Format and print the response to terminal
prettyJSON, _ := json.MarshalIndent(result, "", "  ")
fmt.Printf("%s\n", prettyJSON)
```

## Put it all together

That's it, you've put together a simple program that will call the Translator Text API and return a JSON response. Now it's time to run your program:

```console
go run translate-text.go
```

If you'd like to compare your code against ours, the complete sample is available on [GitHub](https://github.com/MicrosoftTranslator/Text-Translation-API-V3-Go).

## Sample response

A successful response is returned in JSON as shown in the following example:

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
      }
    ]
  }
]
```

## Next steps

Take a look at the API reference to understand everything you can do with the Translator Text API.

> [!div class="nextstepaction"]
> [API reference](https://docs.microsoft.com/azure/cognitive-services/translator/reference/v3-0-reference)

## See also

Learn how to use the Translator Text API to:

* [Transliterate text](quickstart-go-transliterate.md)
* [Identify the language by input](quickstart-go-detect.md)
* [Get alternate translations](quickstart-go-dictionary.md)
* [Get a list of supported languages](quickstart-go-languages.md)
* [Determine sentence lengths from an input](quickstart-go-sentences.md)
