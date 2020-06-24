---
title: "Quickstart: Perform a web search with Go - Bing Web Search REST API"
titleSuffix: Azure Cognitive Services
description: Use this quickstart to send requests to the Bing Web Search REST API using Go, and receive a JSON response
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: bing-web-search
ms.topic: quickstart
ms.date: 05/22/2020
ms.author: aahi
ms.reviewer: nhoyadx@gmail.com, v-gedod, erhopf
ms.custom: seodec2018
#Customer intent: As a new developer, I want to make my first call to the Bing Web Search API and receive a response using Go.
---

# Quickstart: Search the web using the Bing Web Search REST API and Go

Use this quickstart to make your first call to the Bing Web Search API. This Go application sends a search request to the API, and shows the JSON response. Although this application is written in Go, the API is a RESTful Web service compatible with most programming languages.

 The code examples in this quickstart require only core libraries; there are no external dependencies.  

## Prerequisites
Here are a few things that you'll need before running this quickstart:

* [Go binaries](https://golang.org/dl/)
* A subscription key

[!INCLUDE [bing-web-search-quickstart-signup](../../../../includes/bing-web-search-quickstart-signup.md)]  

## Create a project and import core libraries

Create a new Go project in your favorite IDE or editor. Then, import `net/http` for requests, `ioutil` to read the response, `time` and `encoding/json` to handle the JSON, and `fmt` to print the output.

```go
package main
import (
    "fmt"
    "net/http"
    "io/ioutil"
    "time"
    "encoding/json"
)
```

## Create a struct to format the search results

The `BingAnswer` struct formats the data provided in the response.

```go
// This struct formats the answers provided by the Bing Web Search API.
type BingAnswer struct {
        Type         string `json:"_type"`
        QueryContext struct {
                OriginalQuery string `json:"originalQuery"`
        } `json:"queryContext"`
        WebPages struct {
                WebSearchURL          string `json:"webSearchUrl"`
                TotalEstimatedMatches int    `json:"totalEstimatedMatches"`
                Value                 []struct {
                        ID               string    `json:"id"`
                        Name             string    `json:"name"`
                        URL              string    `json:"url"`
                        IsFamilyFriendly bool      `json:"isFamilyFriendly"`
                        DisplayURL       string    `json:"displayUrl"`
                        Snippet          string    `json:"snippet"`
                        DateLastCrawled  time.Time `json:"dateLastCrawled"`
                        SearchTags       []struct {
                                Name    string `json:"name"`
                                Content string `json:"content"`
                        } `json:"searchTags,omitempty"`
                        About []struct {
                                Name string `json:"name"`
                        } `json:"about,omitempty"`
                } `json:"value"`
        } `json:"webPages"`
        RelatedSearches struct {
                ID    string `json:"id"`
                Value []struct {
                        Text         string `json:"text"`
                        DisplayText  string `json:"displayText"`
                        WebSearchURL string `json:"webSearchUrl"`
                } `json:"value"`
        } `json:"relatedSearches"`
        RankingResponse struct {
                Mainline struct {
                        Items []struct {
                                AnswerType  string `json:"answerType"`
                                ResultIndex int    `json:"resultIndex"`
                                Value       struct {
                                        ID string `json:"id"`
                                } `json:"value"`
                        } `json:"items"`
                } `json:"mainline"`
                Sidebar struct {
                        Items []struct {
                                AnswerType string `json:"answerType"`
                                Value      struct {
                                        ID string `json:"id"`
                                } `json:"value"`
                        } `json:"items"`
                } `json:"sidebar"`
        } `json:"rankingResponse"`
}
```

## Declare the main function and define variables  

This code declares the main function and sets the required variables: 

1. For the `endpoint` value, you can use the global endpoint in the following code, or use the [custom subdomain](../../../cognitive-services/cognitive-services-custom-subdomains.md) endpoint displayed in the Azure portal for your resource. 

2. Confirm that the endpoint is correct and replace the `token` value with a valid subscription key from your Azure account. 
 
3. Optionally, customize the search query by replacing the value for `searchTerm`.

```go
// Declare the main function. This is required for all Go programs.
func main() {
// Verify the endpoint URI and replace the token string with a valid subscription key.  
    const endpoint = "https://api.cognitive.microsoft.com/bing/v7.0/search"
    token := "YOUR-ACCESS-KEY"
    searchTerm := "Microsoft Cognitive Services"

// The remaining code in this quickstart goes in the main function.

}
```

## Construct a request

This code declares the HTTP request, inserts the header and payload, and instantiates the client.

```go
// Declare a new GET request.
req, err := http.NewRequest("GET", endpoint, nil)
if err != nil {
    panic(err)
}

// Add the payload to the request.  
param := req.URL.Query()
param.Add("q", searchTerm)
req.URL.RawQuery = param.Encode()

// Insert the request header.  
req.Header.Add("Ocp-Apim-Subscription-Key", token)

// Instantiate a client.  
client := new(http.Client)
```

## Make a request

Use this code to call the Bing Web Search API and close the connection after a response is returned.

```go
// Send the request to Bing.  
resp, err := client.Do(req)
if err != nil {
    panic(err)
}

// Close the connection.
defer resp.Body.Close()
body, err := ioutil.ReadAll(resp.Body)
if err != nil {
    panic(err)
}
```

## Handle the response

Use the struct we created previously to format the response and print the search results.

```go
// Create a new answer.  
ans := new(BingAnswer)
err = json.Unmarshal(body, &ans)
if err != nil {
    fmt.Println(err)
}
// Iterate over search results and print the result name and URL.
for _, result := range ans.WebPages.Value {
    fmt.Println(result.Name, "||", result.URL)
}
```

## Put it all together

The last step is to validate your code and run it. If you'd like to compare your code with ours, here's the complete program:

```go
package main
import (
    "fmt"
    "net/http"
    "io/ioutil"
    "time"
    "encoding/json"
)

// The is the struct for the data returned by Bing.
type BingAnswer struct {
        Type         string `json:"_type"`
        QueryContext struct {
                OriginalQuery string `json:"originalQuery"`
        } `json:"queryContext"`
        WebPages struct {
                WebSearchURL          string `json:"webSearchUrl"`
                TotalEstimatedMatches int    `json:"totalEstimatedMatches"`
                Value                 []struct {
                        ID               string    `json:"id"`
                        Name             string    `json:"name"`
                        URL              string    `json:"url"`
                        IsFamilyFriendly bool      `json:"isFamilyFriendly"`
                        DisplayURL       string    `json:"displayUrl"`
                        Snippet          string    `json:"snippet"`
                        DateLastCrawled  time.Time `json:"dateLastCrawled"`
                        SearchTags       []struct {
                                Name    string `json:"name"`
                                Content string `json:"content"`
                        } `json:"searchTags,omitempty"`
                        About []struct {
                                Name string `json:"name"`
                        } `json:"about,omitempty"`
                } `json:"value"`
        } `json:"webPages"`
        RelatedSearches struct {
                ID    string `json:"id"`
                Value []struct {
                        Text         string `json:"text"`
                        DisplayText  string `json:"displayText"`
                        WebSearchURL string `json:"webSearchUrl"`
                } `json:"value"`
        } `json:"relatedSearches"`
        RankingResponse struct {
                Mainline struct {
                        Items []struct {
                                AnswerType  string `json:"answerType"`
                                ResultIndex int    `json:"resultIndex"`
                                Value       struct {
                                        ID string `json:"id"`
                                } `json:"value"`
                        } `json:"items"`
                } `json:"mainline"`
                Sidebar struct {
                        Items []struct {
                                AnswerType string `json:"answerType"`
                                Value      struct {
                                        ID string `json:"id"`
                                } `json:"value"`
                        } `json:"items"`
                } `json:"sidebar"`
        } `json:"rankingResponse"`
}

// Verify the endpoint URI and replace the token string with a valid subscription key.  
func main() {
    const endpoint = "https://api.cognitive.microsoft.com/bing/v7.0/search"
    token := "YOUR-ACCESS-KEY"
    searchTerm := "Microsoft Cognitive Services"

    // Declare a new GET request.
    req, err := http.NewRequest("GET", endpoint, nil)
    if err != nil {
        panic(err)
    }

    // Add the payload to the request.  
    param := req.URL.Query()
    param.Add("q", searchTerm)
    req.URL.RawQuery = param.Encode()

    // Insert the request header.  
    req.Header.Add("Ocp-Apim-Subscription-Key", token)

    // Create a new client.  
    client := new(http.Client)

    // Send the request to Bing.  
    resp, err := client.Do(req)
    if err != nil {
        panic(err)
    }

    // Close the response.
    defer resp.Body.Close()
    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        panic(err)
    }

    // Create a new answer.  
    ans := new(BingAnswer)
    err = json.Unmarshal(body, &ans)
    if err != nil {
         fmt.Println(err)
    }

    // Iterate over search results and print the result name and URL.
    for _, result := range ans.WebPages.Value {
         fmt.Println(result.Name, "||", result.URL)
    }

}
```

## Example JSON response

Responses from the Bing Web Search API are returned as JSON. This sample response has been formatted by using the `BingAnswer` struct and shows the `result.Name` and `result.URL`.

```go
Microsoft Cognitive Services || https://www.microsoft.com/cognitive-services
Cognitive Services | Microsoft Azure || https://azure.microsoft.com/services/cognitive-services/
What is Microsoft Cognitive Services? | Microsoft Docs || https://docs.microsoft.com/azure/cognitive-services/Welcome
Microsoft Cognitive Toolkit || https://www.microsoft.com/en-us/cognitive-toolkit/
Microsoft Customers || https://customers.microsoft.com/en-us/search?sq=%22Microsoft%20Cognitive%20Services%22&ff=&p=0&so=story_publish_date%20desc
Microsoft Enterprise Services - Microsoft Enterprise || https://enterprise.microsoft.com/en-us/services/
Microsoft Cognitive Services || https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236
Cognitive Services - msdn.microsoft.com || https://msdn.microsoft.com/magazine/mt742868.aspx  
```

## Next steps

> [!div class="nextstepaction"]
> [Bing Web Search API single-page app tutorial](../tutorial-bing-web-search-single-page-app.md)

[!INCLUDE [bing-web-search-quickstart-see-also](../../../../includes/bing-web-search-quickstart-see-also.md)]
