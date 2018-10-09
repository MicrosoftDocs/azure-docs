---
title: "Quickstart: Go Publish Knowledge Base - QnA Maker"
titleSuffix: Azure Cognitive Services 
description: How to publish a knowledge base in Go for QnA Maker.
services: cognitive-services
author: diberry
manager: cgronlun

ms.service: cognitive-services
ms.component: qna-maker
ms.topic: quickstart
ms.date: 09/12/2018
ms.author: diberry
---

# Quickstart: Publish a knowledge base in Go

The following code publishes an existing knowledge base, using the [Publish](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75fe) method.

1. Create a new Go project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```go
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
)

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace this with a valid subscription key.
var subscriptionKey string = "ENTER KEY HERE"

// NOTE: Replace this with a valid knowledge base ID.
var kb string = "ENTER ID HERE";

var host string = "https://westus.api.cognitive.microsoft.com"
var service string = "/qnamaker/v4.0"
var method string = "/knowledgebases/"

func pretty_print(content string) string {
	var obj map[string]interface{}
    json.Unmarshal([]byte(content), &obj)
	result, _ := json.MarshalIndent(obj, "", "  ")
	return string(result)
}

func post(uri string, content string) string {
	req, _ := http.NewRequest("POST", uri, bytes.NewBuffer([]byte(content)))
	req.Header.Add("Ocp-Apim-Subscription-Key", subscriptionKey)
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Content-Length", strconv.Itoa(len(content)))
	client := &http.Client{}
	response, err := client.Do(req)
	if err != nil {
		panic(err)
	}

	defer response.Body.Close()
    body, _ := ioutil.ReadAll(response.Body)

	if(response.StatusCode == 204) {
		return "{'result' : 'Success.'}"
	} else {
		return string(body)
	}
}

func publish(uri string, req string) string {
	fmt.Println("Calling " + uri + ".")
	return post(uri, req)
}

func main() {
	var uri = host + service + method + kb
	body := publish(uri, "")
	fmt.Printf(body + "\n")

}
```

## The publish a knowledge base response

A successful response is returned in JSON, as shown in the following example: 

```json
{
  "result": "Success."
}
```

## Next steps

> [!div class="nextstepaction"]
> [QnA Maker (V4) REST API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff)