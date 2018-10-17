---
title: "Quickstart: Convert text script - Translator Text, Go"
titleSuffix: Azure Cognitive Services
description: In this quickstart, you convert text in one language from one script to another using the Translator Text API with Go.
services: cognitive-services
author: noellelacharite
manager: cgronlun

ms.service: cognitive-services
ms.component: translator-text
ms.topic: quickstart
ms.date: 06/29/2018
ms.author: nolachar
---
# Quickstart: Transliterate text with Go

In this quickstart, you convert text in one language from one script to another using the Translator Text API.

## Prerequisites

You'll need to install the [Go distribution](https://golang.org/doc/install) in order to run this code. The sample code uses only **core** libraries, so there are no external dependencies.

To use the Translator Text API, you also need a subscription key; see [How to sign up for the Translator Text API](translator-text-how-to-signup.md).

## Transliterate request

The following converts text in one language from one script to another script using the [Transliterate](./reference/v3-0-transliterate.md) method.

1. Create a new Go project in your favorite code editor.
2. Add the code provided below.
3. Replace the `subscriptionKey` value with an access key valid for your subscription.
4. Save the file with a '.go' extension.
5. Open a command prompt on a computer with Go installed.
6. Build the file, for example: 'go build quickstart-transliterate.go'.
7. Run the file, for example: 'quickstart-transliterate'.

```golang
package main

import (
    "encoding/json"
    "fmt"
    "io/ioutil"
    "net/http"
    "strconv"
    "strings"
    "time"
)

func main() {
    // Replace the subscriptionKey string value with your valid subscription key
    const subscriptionKey = "<Subscription Key>"

    const uriBase = "https://api.cognitive.microsofttranslator.com"
    const uriPath = "/transliterate?api-version=3.0"

    // Transliterate text in Japanese from Japanese script (i.e. Hiragana/Katakana/Kanji) to Latin script
    const params = "&language=ja&fromScript=jpan&toScript=latn"

    const uri = uriBase + uriPath + params

    // Transliterate "good afternoon".
    const text = "こんにちは"

    r := strings.NewReader("[{\"Text\" : \"" + text + "\"}]")

    client := &http.Client{
        Timeout: time.Second * 2,
    }

    req, err := http.NewRequest("POST", uri, r)
    if err != nil {
        fmt.Printf("Error creating request: %v\n", err)
        return
    }

    req.Header.Add("Content-Type", "application/json")
    req.Header.Add("Content-Length", strconv.FormatInt(req.ContentLength, 10))
    req.Header.Add("Ocp-Apim-Subscription-Key", subscriptionKey)

    resp, err := client.Do(req)
    if err != nil {
        fmt.Printf("Error on request: %v\n", err)
        return
    }
    defer resp.Body.Close()

    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        fmt.Printf("Error reading response body: %v\n", err)
        return
    }

    var f interface{}
    json.Unmarshal(body, &f)

    jsonFormatted, err := json.MarshalIndent(f, "", "  ")
    if err != nil {
        fmt.Printf("Error producing JSON: %v\n", err)
        return
    }
    fmt.Println(string(jsonFormatted))
}
```

## Transliterate response

A successful response is returned in JSON as shown in the following example:

```json
[
  {
    "script": "latn",
    "text": "konnnichiha"
  }
]
```

## Next steps

Explore Go packages for Cognitive Services APIs from the [Azure SDK for Go](https://github.com/Azure/azure-sdk-for-go) on GitHub.

> [!div class="nextstepaction"]
> [Explore Go packages on GitHub](https://github.com/Azure/azure-sdk-for-go/tree/master/services/cognitiveservices)
