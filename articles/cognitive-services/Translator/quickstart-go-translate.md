---
title: "Quickstart: Translate text, Go - Translator Text API"
titleSuffix: Azure Cognitive Services
description: In this quickstart, you'll translate text from one language to another using the Translator Text API with Go in less than 10 minutes.
services: cognitive-services
author: erhopf
manager: cgronlun
ms.service: cognitive-services
ms.component: translator-text
ms.topic: quickstart
ms.date: 12/5/2018
ms.author: erhopf
---

# Quickstart: Use the Translator Text API to translate a string using Go

In this quickstart, you'll learn how to translate a text string from English to Italian and German using Go and the Translator Text REST API.

This quickstart requires an [Azure Cognitive Services account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with a Translator Text resource. If you don't have an account, you can use the [free trial](https://azure.microsoft.com/try/cognitive-services/) to get a subscription key.

## Prerequisites

This quickstart requires:

* [Go](https://golang.org/doc/install)
* An Azure subscription key for Translator Text

## Create a project and import required modules

Create a new Go project using your favorite IDE or editor. Then copy this code snippet into your project in a file named `translate-text.go`.

```go
package main

import (
    "encoding/json"
    "fmt"
    "io/ioutil"
    "net/http"
    "strconv"
    "strings"
    "time"
    "os"
)

func main() {
    /*  
     * In the next few sections, we'll add code to this
     * function to make a request and handle the response
     * from the Translator Text API.
     */
}
```

## Set the subscription key, base url, and path

This sample will try to read your Translator Text subscription key from the environment variable `TRANSLATOR_TEXT_KEY`. If you're not familiar with environment variables, you can set `subscriptionKey` as a string and comment out the conditional statement.

Copy this code into your `main` function:

```go
/*
 * Read your subscription key from an env variable.
 * Please note: You can replace this code block with
 * var subscriptionKey = "YOUR_SUBSCRIPTION_KEY" if you don't
 * want to use env variables.
 */
var subscriptionKey = os.Getenv("TRANSLATOR_TEXT_KEY")
if len(subscriptionKey) <= 0 {
    fmt.Println("\nWARNING: Subscription key is not set. Please check your environment variables.\n")
    os.Exit(0)
}
```

Currently, one endpoint is available for Translator Text, and it's set as the `base_url`. `path` sets the `translate` route and identifies that we want to hit version 3 of the API.

The `params` are used to set the output languages. In this sample we're translating from English to Italian and German: `it` and `de`.

>[!NOTE]
> For more information about endpoints, routes, and request parameters, see [Translator Text API 3.0: Translate](https://docs.microsoft.com/azure/cognitive-services/translator/reference/v3-0-translate).

```go
const uriBase = "https://api.cognitive.microsofttranslator.com"
const uriPath = "/translate?api-version=3.0"
const params = "&to=de&to=it"
// Construct the URL
const uri = uriBase + uriPath + params
```

## Create a string reader

Next, you'll add the text you want to translate and create a string reader for the JSON request.

```go
// Add text to translate
const text = "Hello, world!"
// Create a string reader for the JSON body of your request
requestBody := strings.NewReader("[{\"Text\" : \"" + text + "\"}]")
```

## Create a client and build a request

Before you do anything else, you need to instantiate the HTTP client.

```go
// Create a client
client := &http.Client{
    Timeout: time.Second * 2,
}
```

After the client is instantiated, you can build the POST request.

```go
// Create a POST request
req, err := http.NewRequest("POST", uri, requestBody)
if err != nil {
    fmt.Printf("Error creating request: %v\n", err)
    return
}
// Add request headers
req.Header.Add("Content-Type", "application/json")
req.Header.Add("Content-Length", strconv.FormatInt(req.ContentLength, 10))
req.Header.Add("Ocp-Apim-Subscription-Key", subscriptionKey)
```

Now you can call the Translator Text API.

```go
// Make a request
resp, err := client.Do(req)
if err != nil {
    fmt.Printf("Error on request: %v\n", err)
    return
}
defer resp.Body.Close()

// Read the response
body, err := ioutil.ReadAll(resp.Body)
if err != nil {
    fmt.Printf("Error reading response body: %v\n", err)
    return
}
```

## Handle and print the response

```go
// Store the JSON response
var jsonResponse interface{}
json.Unmarshal(body, &jsonResponse)

// Format the JSON response
jsonFormatted, err := json.MarshalIndent(jsonResponse, "", "  ")
if err != nil {
    fmt.Printf("Error producing JSON: %v\n", err)
    return
}

//Print the response to terminal
fmt.Println(string(jsonFormatted))
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

Explore Go packages for Cognitive Services APIs from the [Azure SDK for Go](https://github.com/Azure/azure-sdk-for-go) on GitHub.

> [!div class="nextstepaction"]
> [Explore Go packages on GitHub](https://github.com/Azure/azure-sdk-for-go/tree/master/services/cognitiveservices)

## See also

In addition to text translation, learn how to use the Translator Text API to:

* [Transliterate text](quickstart-go-transliterate.md)
* [Identify the language by input](quickstart-go-detect.md)
* [Get alternate translations](quickstart-go-dictionary.md)
* [Get a list of supported languages](quickstart-go-languages.md)
* [Determine sentence lengths from an input](quickstart-go-sentences.md)
