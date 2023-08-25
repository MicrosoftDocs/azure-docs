---
title: "Quickstart: Get image insights using the REST API and Go - Bing Visual Search"
titleSuffix: Azure AI services
description: Learn how to upload an image using the Bing Visual Search API and Go, and then get insights about the image.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: bing-visual-search
ms.topic: quickstart
ms.date: 05/22/2020
ms.author: aahi
ms.devlang: golang
ms.custom: mode-api
---

# Quickstart: Get image insights using the Bing Visual Search REST API and Go

[!INCLUDE [Bing move notice](../../bing-web-search/includes/bing-move-notice.md)]

Use this quickstart to make your first call to the Bing Visual Search API using the Go programming language. A POST request uploads an image to the API endpoint. The results include URLs and descriptive information about images similar to the uploaded image.

## Prerequisites

* Install the [Go binaries](https://go.dev/dl/).
* Install the go-spew deep pretty printer, which is used to display results. To install go-spew, use the `$ go get -u https://github.com/davecgh/go-spew` command.

[!INCLUDE [cognitive-services-bing-visual-search-signup-requirements](../../../../includes/cognitive-services-bing-visual-search-signup-requirements.md)]

## Project and libraries

Create a Go project in your IDE or editor. Then, import `net/http` for requests, `ioutil` to read the response, and `encoding/json` to handle the JSON text of results. Use the `go-spew` library to parse JSON results.

```go
package main

import (
	"bytes"
	"io"
	"fmt"
	"io/ioutil"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"encoding/json"
    "github.com/davecgh/go-spew/spew"
)

```

## Struct to format results

The `BingAnswer` structure formats data returned in the JSON response, which is multilevel and complex. The following implementation covers some of the essentials:

```go
type BingAnswer struct {
	Type         string `json:"_type"`
	Instrumentation struct {
		Type string   `json:"_type"`
		PingUrlBase   string  `json:"_pingUrlBase"`
		PageLoadPingUrl  string `json:"_pageLoadPingUrl"`
	} `json:"instrumentation"`
	Tags []struct  {
	    DisplayName       string    `json:"displayName"`
		Actions                 []struct {
		    Type      string `json:"_type"`
			ActionType    string    `json:"actionType"`
			Data             struct {
			    Value     []struct {
				    WebSearchUrl          string `json:"webSearchUrl"`
				    Name        string  `json:"name"`
				}`json:"value"`
				ImageInsightsToken string `json:"imageInsightsToken"`
				InsightsMetadata struct {
				    PagesIncludingCount int `json:"pagesIncludingCount"`
					AvailableSizesCount  int  `json:"availableSizesCount"`
				}
				ImageId string  `json:"imageId"`
				AccentColor  string `json:"accentColor"`
		    } `json:"data"`
		} `json:"actions"`
	} `json:"tags"`
	Image struct {
	    WebSearchUrl   string  `json:"webSearchUrl"`
		WebSearchUrlPingSuffix  string `json:"webSearchUrlPingSuffix"`
		Name   string   `json:"name"`
		IsFamilyFriendly   bool  `json:"isFamilyFriendly"`
		ContentSize   string   `json:"contentSize"`
		EncodingFormat    string   `json:"encodingFormat"`
		HostPageDisplayUrl   string    `json:"hostPageDisplayUrl"`
		Width     int   `json:"width"`
		Height    int    `json:"height"`
		Thumbnail    struct  {
		    Width   int   `json:"width"`
			Height  int   `json:"height"`
		}
		InsightsMetadata  struct {
		    PagesIncludingCount   int   `json:"pagesIncludingCount"`
			AvailableSizesCount    int    `json:"availableSizesCount"`
		}
		AccentColor   string     `json:"accentColor"`
		VisualWords   string   `json:"visualWords"`
	} `json:"image"`
}

```

## Main function and variables  

The following code declares the main function and assigns the required variables: 

1. Confirm that the endpoint is correct and replace the `token` value with a valid subscription key from your Azure account. 
2. For `batchNumber`, assign a GUID, which is required for the leading and trailing boundaries of the POST data. 
3. For `fileName`, assign the image file to use for the POST. 
4. For `endpoint`, you can use the global endpoint in the following code, or use the [custom subdomain](../../../ai-services/cognitive-services-custom-subdomains.md) endpoint displayed in the Azure portal for your resource.

```go
func main() {
	// Verify the endpoint URI and replace the token string with a valid subscription key.se
	endpoint := "https://api.cognitive.microsoft.com/bing/v7.0/images/visualsearch"
	token := "YOUR-ACCESS-KEY"
	client := &http.Client{}
	batchNumber := "d7ecc447-912f-413e-961d-a83021f1775f"
	fileName := "ElectricBike.JPG"

	body, contentType := createRequestBody(fileName, batchNumber)
	
	req, err := http.NewRequest("POST", endpoint, body)
	req.Header.Add("Content-Type", contentType)
	req.Header.Set("Ocp-Apim-Subscription-Key", token)
	
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	
       defer resp.Body.Close()
	
	resbody, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		panic(err)
	}

	//fmt.Print(string(resbody))
	
	// Create a new answer.  
    ans := new(BingAnswer)
    err = json.Unmarshal(resbody, &ans)
    if err != nil {
        fmt.Println(err)
    }
	
	fmt.Print("Output of BingAnswer: \r\n\r\n")
	
	// Iterate over search results and print the result name and URL.
    for _, result := range ans.Tags {
	    spew.Dump(result)
    }
}

```

## Boundaries of POST body

A POST request to the Visual Search endpoint requires leading and trailing boundaries to enclose the POST data. These functions aren't included in the `main()` block.

The leading boundary includes a batch number, the content type identifier `Content-Disposition: form-data; name="image"; filename=`, and the filename of the image to POST. 

The trailing boundary includes the batch number only. 


```go
func BuildFormDataStart(batNum string, fileName string) string{

	startBoundary := "--batch_" + batNum + "\r\n"
	requestBoundary := startBoundary + "\r\n" + "Content-Disposition: form-data; name=\"image\"; filename=" + fileName + "\r\n\r\n"
	return requestBoundary
}

func BuildFormDataEnd(batNum string) string{

	return "\r\n" + "\r\n" + "--batch_" + batNum + "\r\n"

}

```
## Add image bytes to POST body

The following code creates the POST request that contains image data:

```go
func createRequestBody(fileName string, batchNumber string) (*bytes.Buffer, string) {
    file, err := os.Open(fileName)
	if err != nil {
		panic(err)
	}
	defer file.Close()

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	
	writer.SetBoundary(BuildFormDataStart(batchNumber, fileName))
	
	part, err := writer.CreateFormFile("image", filepath.Base(file.Name()))
	if err != nil {
		panic(err)
	}
	io.Copy(part, file)
	writer.WriteField("lastpart", BuildFormDataEnd(batchNumber))	
	writer.Close()
    return body, writer.FormDataContentType()
}

```

## Send the request

The following code sends the request and reads the results:

```go
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

The `Unmarshall` function extracts information from the JSON text returned by the Visual Search API. The `go-spew` pretty printer displays the results.

```go
	// Create a new answer.  
    ans := new(BingAnswer)
    err = json.Unmarshal(resbody, &ans)
    if err != nil {
        fmt.Println(err)
    }
	
	fmt.Print("Output of BingAnswer: \r\n\r\n")
	
	// Iterate over search results and print the result name and URL.
    for _, result := range ans.Tags {
	    spew.Dump(result)
    }

```
> [!NOTE]
> Francesco Giordano contributed code to this example.

## Results

The results identify images similar to the image contained in the POST body. The useful fields are `WebSearchUrl` and `Name`.

```go
    Value: ([]struct { WebSearchUrl string "json:\"webSearchUrl\""; Name string "json:\"name\"" }) (len=66 cap=94) {
     (struct { WebSearchUrl string "json:\"webSearchUrl\""; Name string "json:\"name\"" }) {
      WebSearchUrl: (string) (len=129) "https://www.bing.com/images/search?view=detailv2&FORM=OIIRPO&id=B9E6621161769D578A9E4DD9FD742128DE65225A&simid=608046863828453626",
      Name: (string) (len=87) "26\"Foldable Electric Mountain Bike Bicycle Ebike W/Lithium Battery 250W 36V MY8L | eBay"
     },
     (struct { WebSearchUrl string "json:\"webSearchUrl\""; Name string "json:\"name\"" }) {
      WebSearchUrl: (string) (len=129) "https://www.bing.com/images/search?view=detailv2&FORM=OIIRPO&id=5554757348A9E88E9EEAB74217E228689E716B61&simid=607988237543409883",
      Name: (string) (len=96) "Best 25+ Electric mountain bike ideas on Pinterest | Mountain bicycle, Mtb mountain bike and ..."
     },
     (struct { WebSearchUrl string "json:\"webSearchUrl\""; Name string "json:\"name\"" }) {
      WebSearchUrl: (string) (len=129) "https://www.bing.com/images/search?view=detailv2&FORM=OIIRPO&id=B56F626A4803D829FE326842E2B97CE5B87F17F2&simid=607991699288949513",
      Name: (string) (len=100) "Electric Fat Bike Mountain Bicycle Snow Bike Cruiser Ebike Motor Lithium Battery Dual Oil Brakes ..."
     },
     (struct { WebSearchUrl string "json:\"webSearchUrl\""; Name string "json:\"name\"" }) {
      WebSearchUrl: (string) (len=129) "https://www.bing.com/images/search?view=detailv2&FORM=OIIRPO&id=CCAE400EE510DCA6F5740ABAF08A5310B4EF0698&simid=608003854048890458",
      Name: (string) (len=81) "Best Mountain Bikes Under 1500 (Outstanding Performance) | Mountain Bicycle World"
     },
     (struct { WebSearchUrl string "json:\"webSearchUrl\""; Name string "json:\"name\"" }) {
      WebSearchUrl: (string) (len=129) "https://www.bing.com/images/search?view=detailv2&FORM=OIIRPO&id=1244730E2E3F2D5DFBED9A9CFE1DBE27B09F08BC&simid=608005181199745622",
      Name: (string) (len=98) "ANCHEER Folding Electric Mountain Bike with 26\" Super Lightweight Magnesium (36V 250W) - GearScoot"
     },
     (struct { WebSearchUrl string "json:\"webSearchUrl\""; Name string "json:\"name\"" }) {
      WebSearchUrl: (string) (len=129) "https://www.bing.com/images/search?view=detailv2&FORM=OIIRPO&id=38AAD876E57BB0D502FBDD5B1CB29EB7EB8DD9E2&simid=608041654062220328",
      Name: (string) (len=97) "29 best CB Bikes Gadgets & Accessories images on Pinterest | Bicycles, Bicycling and Bike gadgets"
     },
     (struct { WebSearchUrl string "json:\"webSearchUrl\""; Name string "json:\"name\"" }) {
      WebSearchUrl: (string) (len=129) "https://www.bing.com/images/search?view=detailv2&FORM=OIIRPO&id=6892C8FD22D0E42911C99AFD8FE1FD37BD82E02C&simid=608052803759703185",
      Name: (string) (len=98) "ANCHEER Folding Electric Mountain Bike with 26\" Super Lightweight Magnesium (36V 250W) - GearScoot"
     },

```

## Next steps

> [!div class="nextstepaction"]
> [What is the Bing Visual Search API?](../overview.md)
> [Bing Web Search quickstart in Go](../../bing-web-search/quickstarts/go.md)
