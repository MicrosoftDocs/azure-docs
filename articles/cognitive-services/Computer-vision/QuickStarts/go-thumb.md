---
title: "Quickstart: Generate a thumbnail - REST, Go"
titleSuffix: "Azure Cognitive Services"
description: In this quickstart, you generate a thumbnail from an image using the Computer Vision API with Go.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: quickstart
ms.date: 04/14/2020
ms.author: pafarley
ms.custom: seodec18
---
# Quickstart: Generate a thumbnail using the Computer Vision REST API with Go

In this quickstart, you'll generate a thumbnail from an image using the Computer Vision REST API. You specify the height and width, which can differ in aspect ratio from the input image. Computer Vision uses smart cropping to intelligently identify the area of interest and generate cropping coordinates based on that region.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/ai/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=cognitive-services) before you begin.

## Prerequisites

- You must have [Go](https://golang.org/dl/) installed.
- You must have a subscription key for Computer Vision. You can get a free trial key from [Try Cognitive Services](https://azure.microsoft.com/try/cognitive-services/?api=computer-vision). Or, follow the instructions in [Create a Cognitive Services account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) to subscribe to Computer Vision and get your key. Then, [create environment variables](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for the key and service endpoint string, named `COMPUTER_VISION_SUBSCRIPTION_KEY` and `COMPUTER_VISION_ENDPOINT`, respectively.

## Create and run the sample

To create and run the sample, do the following steps:

1. Copy the following code into a text editor.
1. Optionally, replace the value of `imageUrl` with the URL of a different image from which you want to generate a thumbnail.
1. Save the code as a file with a `.go` extension. For example, `get-thumbnail.go`.
1. Open a command prompt window.
1. At the prompt, run the `go build` command to compile the package from the file. For example, `go build get-thumbnail.go`.
1. At the prompt, run the compiled package. For example, `get-thumbnail`.

```go
package main

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"time"
)

func main() {
	// Add your Computer Vision subscription key and endpoint to your environment variables.
	subscriptionKey := os.Getenv("COMPUTER_VISION_SUBSCRIPTION_KEY")
	endpoint := os.Getenv("COMPUTER_VISION_ENDPOINT")

	uriBase := endpoint + "vision/v3.0/generateThumbnail"
	const imageUrl = "https://upload.wikimedia.org/wikipedia/commons/9/94/Bloodhound_Puppy.jpg"

	const params = "?width=100&height=100&smartCropping=true"
	uri := uriBase + params
	const imageUrlEnc = "{\"url\":\"" + imageUrl + "\"}"

	reader := strings.NewReader(imageUrlEnc)

	// Create the HTTP client
	client := &http.Client{
		Timeout: time.Second * 2,
	}

	// Create the POST request, passing the image URL in the request body
	req, err := http.NewRequest("POST", uri, reader)
	if err != nil {
		panic(err)
	}

	// Add headers
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Ocp-Apim-Subscription-Key", subscriptionKey)

	// Send the request and retrieve the response
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}

	defer resp.Body.Close()

	// Read the response body.
	// Note, data is a byte array
	data, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		panic(err)
	}
	
	// Convert byte[] to io.Reader type
	readerThumb := bytes.NewReader(data)

	// Write the image binary to file
	file, err := os.Create("thumb_local.png")
	if err != nil { log.Fatal(err) }
	defer file.Close()
	_, err = io.Copy(file, readerThumb)
	if err != nil { log.Fatal(err) }

	fmt.Println("The thunbnail from local has been saved to file.")
	fmt.Println()
}
```

## Examine the response

A successful response contains the thumbnail image binary data. If the request fails, the response contains an error code and a message to help determine what went wrong.

## Next steps

Explore the Computer Vision API to analyze an image, detect celebrities and landmarks, create a thumbnail, and extract printed and handwritten text. To rapidly experiment with the Computer Vision API, try the [Open API testing console](https://westcentralus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/56f91f2e778daf14a499e1fa/console).

> [!div class="nextstepaction"]
> [Explore the Computer Vision API](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44)
