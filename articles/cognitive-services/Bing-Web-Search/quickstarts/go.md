---
title: Quickstart: Use Go to call the Bing Web Search API
description: Quickly get started using Go language to query the Bing Web Search API in Microsoft Cognitive Services on Azure.
services: cognitive-services
author: Nhoya
ms.service: cognitive-services
ms.component: bing-web-search
ms.topic: article
ms.date: 03/09/2018
ms.author: rosh
ms.reviewer: nhoyadx@gmail.com, v-gedod, erhopf
---

# Quickstart: Use Go to call the Bing Web Search API  

Use this quickstart to make your first call to the Bing Web Search API and receive a JSON response in less than 10 minutes.  

[!INCLUDE [cognitive-services-bing-web-search-quickstart-signup](../../includes/cognitive-services-bing-web-search-quickstart-signup.md)]  

## Prerequisites

* [Go binaries](https://golang.org/dl/)

This quickstart only requires **core** libraries, there are no external dependencies.  

## Make a call to the Bing Web Search API  

To run this application, follow these steps.

1. Create a new Go project in your favorite IDE or editor.
2. Copy this sample code into your project:  
    ```
    package main
    import (
        "fmt"
        "net/http"
        "io/ioutil"
        "time"
        "encoding/json"
    )

    // The is the struct for the answer returned
    // by Bing.
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

    // Verify the endpoint URI.  
    // Replace the token string with your access key.  
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

        // Iterate over search results and print
        // result name and URL.   
        for _, result := range ans.WebPages.Value {
             fmt.Println(result.Name, "||", result.URL)
        }

    }
    ```
3. Replace `accessKey` with an access key for your subscription.
4. Run the program. For example: `go run your_program.go`.

## Sample response  

Responses from the Bing Web Search API are returned as JSON. This sample response has been formatted using the `BingAnswer` struct and shows the `result.Name` and `result.URL`.

```
Microsoft Cognitive Services || https://www.microsoft.com/cognitive-services
Cognitive Services | Microsoft Azure || https://azure.microsoft.com/services/cognitive-services/
Cognitive Service Try experience | Microsoft Azure || https://azure.microsoft.com/en-us/try/cognitive-services/
What is Microsoft Cognitive Services? | Microsoft Docs || https://docs.microsoft.com/en-us/azure/cognitive-services/Welcome
Microsoft Cognitive Toolkit || https://www.microsoft.com/en-us/cognitive-toolkit/
Microsoft Customers || https://customers.microsoft.com/en-us/search?sq=%22Microsoft%20Cognitive%20Services%22&ff=&p=0&so=story_publish_date%20desc
Microsoft Enterprise Services - Microsoft Enterprise || https://enterprise.microsoft.com/en-us/services/
Microsoft Cognitive Services || https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236
Cognitive Services - msdn.microsoft.com || https://msdn.microsoft.com/en-us/magazine/mt742868.aspx  
```

## Next steps

> [!div class="nextstepaction"]
> [Bing Web search single-page app tutorial](../tutorial-bing-web-search-single-page-app.md)

[!INCLUDE [cognitive-services-bing-web-search-quickstart-see-also](../cognitive-services-bing-web-search-quickstart-see-also.md)]  
