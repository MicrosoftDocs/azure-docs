---
title: "Quickstart: Get image insights using Bing Visual Search REST API and Go"
titleSuffix: Azure Cognitive Services
description: Learn how to upload an image to the Bing Visual Search API and get insights about it.
services: cognitive-services
author: mikedodaro
manager: rosh

ms.service: cognitive-services
ms.subservice: bing-visual-search
ms.topic: quickstart
ms.date: 2/20/2019
ms.author: rosh
---

# Quickstart: Get image insights using the Bing Visual Search REST API and Go

Use this quickstart to call to the Bing Visual Search API and view results. This Go application uses a Post request to upload an image to the API. Then it displays results including URLs to similar images and descriptive information about the images.

## Prerequisites
* Install the [Go binaries](https://golang.org/dl/)
* The go-spew deep pretty printer is useful for display of results
    * Install this libarary: `$ go get -u https://github.com/davecgh/go-spew`

[!INCLUDE [bing-web-search-quickstart-signup](../../../../includes/bing-web-search-quickstart-signup.md)]

## Create a project and import libraries

Create a new Go project in your IDE or editor. Then import `net/http` for requests, `ioutil` to read the response, and `encoding/json` to handle the JSON text of results.  

```
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
)
import "github.com/davecgh/go-spew/spew"

```

## Create a struct to format the search results

The `BingAnswer` struct formats the data provided in the response. The response JSON is multilevel and quite complex.  The following implementation covers some of the essentials.

```
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

## Declare the main function and define variables  

The following code declares the main function and assigns required variables. Confirm that the endpoint is correct and replace the `token` value with a valid subscription key from your Azure account.

```
func main() {
	// Verify the endpoint URI and replace the token string with a valid subscription key.se
	endpoint := "https://api.cognitive.microsoft.com/bing/v7.0/images/visualsearch"
	token := "YOUR-ACCESS-KEY"

    // Initialize the http client.
    client := &http.Client{}

    // Open the file to upload to Visual Search.
	file, err := os.Open("ElectricBike.jpg")
	if err != nil {
		panic(err)
	}
	defer file.Close()

    // Add the remaining code of this example here.
}

```

## Create buffer to hold image bytes and add to form data

Get the image from path and filename.  Read the bytes into a buffer. Copy the bytes to the request form.

```
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	part, err := writer.CreateFormFile("image", filepath.Base(file.Name()))
	if err != nil {
		panic(err)
	}
	io.Copy(part, file)
	writer.Close()

```

## Create Post request and add image bytes to Post body

Create the Post request that contains image data in the Post body.  Set the headers.

```
	req, err := http.NewRequest("POST", endpoint, body)
	req.Header.Add("Content-Type", writer.FormDataContentType())
	req.Header.Set("X-BingApis-SDK", "true")
	req.Header.Set("Ocp-Apim-Subscription-Key", token)

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

The `Unmarshall` function extracts information from the JSON text returned by the Visual Search API.  Then you can display nodes from the results using the `go-spew` pretty printer.

```
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

## Results

The most useful results contain images similar to the image contained in the Post body.

```
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
> [What is Bing Visual Search](../overview.md)
> [Bing Web Search quickstart in Go](../../Bing-Web-Search/quickstarts/go.md)
