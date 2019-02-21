---
title: "Quickstart: Get news using Bing News Search REST API and Go"
titleSuffix: Azure Cognitive Services
description: Learn how to get news results from the Bing News Search API.
services: cognitive-services
author: mikedodaro
manager: rosh

ms.service: cognitive-services
ms.subservice: bing-visual-search
ms.topic: quickstart
ms.date: 2/21/2019
ms.author: rosh
---

# Quickstart: Get image insights using the Bing Visual Search REST API and Go

Use this quickstart to call to the Bing News Search API and view results. This Go application uses a Get request. Then it displays results including names of the news results and URLs.

## Prerequisites
* Install the [Go binaries](https://golang.org/dl/)
* The go-spew deep pretty printer is useful for display of results
    * Install this libarary: `$ go get -u https://github.com/davecgh/go-spew`

[!INCLUDE [bing-web-search-quickstart-signup](../../../includes/bing-web-search-quickstart-signup.md)]

## Create a project and import libraries

Create a new Go project in your IDE or editor. Then import `net/http` for requests, `ioutil` to read the response, and `encoding/json` to handle the JSON text of results.  

```
package main

import (
    "fmt"
    "net/http"
    "io/ioutil"
    "encoding/json"
	"github.com/davecgh/go-spew/spew"
)

```

## Create a struct to format the News search results

The `NewsAnswer` struct formats the data provided in the response. The response JSON is multilevel and quite complex.  The following implementation covers the essentials.

```
// This struct formats the answer provided by the Bing News Search API.
type NewsAnswer struct {
    ReadLink       string `json: "readLink"` 
    QueryContext   struct {
        OriginalQuery   string   `json: "originalQuery"`
		AdultIntent     bool        `json: "adultIntent"`
	} `json: "queryContext"`
	TotalEstimatedMatches   int  `json: totalEstimatedMatches"` 
	Sort  []struct {
	    Name    string  `json: "name"`
		ID       string    `json: "id"`
		IsSelected       bool  `json: "isSelected"`
		URL      string   `json: "url"`
	}  `json: "sort"` 
	Value   []struct   {
	    Name     string   `json: "name"`
		URL   string    `json: "url"`
		Image   struct   {
		    Thumbnail   struct  {
			    ContentUrl  string  `json: "thumbnail"`
				Width   int  `json: "width"`
				Height  int   `json: "height"`
			} `json: "thumbnail"` 
			Description  string  `json: "description"`
			Provider  []struct   {
			    Type   string    `json: "_type"`
				Name  string     `json: "name"`
			} `json: "provider"` 
			DatePublished   string   `json: "datePublished"`
 		} `json: "image"` 
	} `json: "value"` 
}

```

## Declare the main function and define variables  

The following code declares the main function and assigns required variables. Confirm that the endpoint is correct and replace the `token` value with a valid subscription key from your Azure account.

```
func main() {
    // Verify the endpoint URI and replace the token string with a valid subscription key.  
    const endpoint = "https://api.cognitive.microsoft.com/bing/v7.0/news/search"
    token := "cb13365d129c4adb94a27a7a1229ff57"
    searchTerm := "Microsoft Cognitive Services"

    // Declare a new GET request.
    req, err := http.NewRequest("GET", endpoint, nil)
    if err != nil {
        panic(err)
    }

    // The rest of the code in this example goes here in the main function.
}
```

## Query and header

Add the query string and access key header

```
// Add the query to the request.  
param := req.URL.Query()
param.Add("q", searchTerm)
req.URL.RawQuery = param.Encode()

// Insert the request header.  
req.Header.Add("Ocp-Apim-Subscription-Key", token)

```

## Get request

Create the client and send the Get request. 

```
// Instantiate a client.  
client := new(http.Client)

// Send the request to Bing.  
resp, err := client.Do(req)
if err != nil {
    panic(err)
}

```

## Send the request

Send the request and read results using `ioutil`.

```
resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	
    defer resp.Body.Close()
	
	resbody, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		panic(err)
	}

```

## Handle the response

The `Unmarshall` function extracts information from the JSON text returned by the News Search API.  Then you can display nodes from the results using the `go-spew` pretty printer.

```
	// Create a new answer.  
    ans := new(NewsAnswer)
    err = json.Unmarshal(body, &ans)
    if err != nil {
        fmt.Println(err)
    }
	
	fmt.Print("Output of BingAnswer: \r\n\r\n")
	
    // Iterate over search results and print the result name and URL.
    for _, result := range ans.Value{
    spew.Dump(result.Name, result.URL)
    }

```

## Results

The most useful results contain images similar to the image contained in the Post body.

```
(string) (len=91) "Cognitive Services Market: Global Industry Analysis and Opportunity Assessment, 2019 - 2025"
(string) (len=142) "https://www.marketwatch.com/press-release/cognitive-services-market-global-industry-analysis-and-opportunity-assessment-2019---2025-2019-02-21"
(string) (len=104) "Microsoft calls for greater collaboration to harness the power of AI to empower people with disabilities"
(string) (len=115) "http://indiaeducationdiary.in/microsoft-calls-greater-collaboration-harness-power-ai-empower-people-disabilities-2/"
(string) (len=70) "Microsoft 'Intelligent Cloud Hub' to build AI-ready workforce in India"
(string) (len=139) "https://cio.economictimes.indiatimes.com/news/cloud-computing/microsoft-intelligent-cloud-hub-to-build-ai-ready-workforce-in-india/67187807"
(string) (len=81) "Skills shortage is stopping many Asian companies from embracing A.I., study shows"
(string) (len=106) "https://www.cnbc.com/2019/02/20/microsoft-idc-study-skills-shortages-stopping-companies-from-using-ai.html"
(string) (len=143) "Cognitive Computing in Healthcare Market Emerging Top Key Vendors- Apixio, MedWhat, Healthcare X.0, Apple, Google, Microsoft, and IBM 2017-2025"
(string) (len=40) "http://www.digitaljournal.com/pr/4163064"
(string) (len=49) "Microsoft launches AI skills initiative in Brazil"
(string) (len=80) "https://www.zdnet.com/article/microsoft-launches-ai-skills-initiative-in-brazil/"
(string) (len=45) "Kuwait's CITRA and Microsoft host AI OpenHack"
(string) (len=70) "http://www.itp.net/618639-kuwaits-citra-and-microsoft-host-ai-openhack"
(string) (len=51) "CITRA and Microsoft collaborate to host AI workshop"
(string) (len=123) "https://www.zawya.com/mena/en/press-releases/story/CITRA_and_Microsoft_collaborate_to_host_AI_workshop-ZAWYA20190212105751/"

```

## Next steps

> [!div class="nextstepaction"]
> [What is Bing News Search](earch-the-web.md)
