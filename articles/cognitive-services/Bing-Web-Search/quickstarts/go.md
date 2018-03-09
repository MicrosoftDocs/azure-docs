---
title: Call and response - Go Quickstart for Azure Cognitive Services, Bing Web Search API | Microsoft Docs
description: Get information and code samples to help you quickly get started using the Bing Web Search API in Microsoft Cognitive Services on Azure.
services: cognitive-services
author: Nhoya
ms.service: cognitive-services
ms.technology: bing-search
ms.topic: article
ms.date: 09/03/2018
ms.author: Nhoya
---

# Call and response: your first Bing Web Search query in Go

The Bing Web Search API provides an experience similar to Bing.com/Search by returning search results that Bing determines are relevant to the user's query. The results may include Web pages, images, videos, news, and entities, along with related search queries, spelling corrections, time zones, unit conversion, translations, and calculations. The kinds of results you get are based on their relevance and the tier of the Bing Search APIs to which you subscribe.

Refer to the [API reference](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-web-api-v7-reference) for technical details about the APIs.


## Prerequisites
You must have a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with **Bing Search APIs**. The [free trial](https://azure.microsoft.com/try/cognitive-services/?api=bing-web-search-api) is sufficient for this quickstart. You need the access key provided when you activate your free trial, or you may use a paid subscription key from your Azure dashboard.

For this tutorial we will only use **core** libraries, so no external dependencies are needed

## Core Libraries

We will use `http` to send the request to the endpoint, `ioutil` to read the answer and `fmt` to print the output

```
package main

import (
    "fmt"
    "net/http"
    "io/iutil"
)
```

## Define variables
We need to set the API endpoint and the search term

```
//This is the valid endpoint at the time of the writing
const endpoint = "https://api.cognitive.microsoft.com/bing/v7.0/search"
//API token
token := "123457890123456890"
searchTerm := "Microsoft Cognitive Services"
```

## Building and sending the request

```
//We declare a new GET request
req, err := http.NewRequest("GET", endpoint, nil)
if err != nil {
    panic(err)
}
//Adding the payload to the request
param := req.URL.Query()
param.Add("q", searchTerm)
//Encoding the payload
req.URL.RawQuery = param.Encode()

//Now we need to insert the API token in the request header
req.Header.Add("Ocp-Apim-Subscription-Key", token)

//create new client
client := new(http.Client)
//Send the request
resp, err := client.Do(req)
if err != nil {
    panic(err)
}
//Close the response body at the function exit
defer resp.Body.Close() 
```

## Printing the answer
Finally we have the search result inside the `resp` variable, what we need to do in the end is to print the answer body

```
body, err := ioutil.ReadAll(resp.Body)
if err != nil {
    panic(err)
}
//While printing the body we need to convert it from byte to string
fmt.Println(string(body))
```

## Put everything together

```
package main
import (
    "fmt"
    "net/http"
    "io/ioutil"
)

func main() {
    const endpoint = "https://api.cognitive.microsoft.com/bing/v7.0/search"
    token := "123457890123456890"
    searchTerm := "Microsoft Cognitive Services"
    
    req, err := http.NewRequest("GET", endpoint, nil)
    if err != nil {
        panic(err)
    }
    
    param := req.URL.Query()
    param.Add("q", searchTerm)
    req.URL.RawQuery = param.Encode()

    req.Header.Add("Ocp-Apim-Subscription-Key", token)
    
    client := new(http.Client)
    resp, err := client.Do(req)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close() 
    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        panic(err)
    }
}
```

## See also 

[Bing Web Search overview](../overview.md)  
[Try it](https://azure.microsoft.com/services/cognitive-services/bing-web-search-api/)  
[Get a free trial access key](https://azure.microsoft.com/try/cognitive-services/?api=bing-web-search-api)
[Bing Web Search API reference](https://docs.microsoft.com/rest/api/cognitiveservices/bing-web-api-v7-reference)

