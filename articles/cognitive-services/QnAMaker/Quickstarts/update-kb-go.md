---
title: "Quickstart: Update knowledge base - REST, Go - QnA Maker"
titleSuffix: Azure Cognitive Services
description: This REST-based quickstart walks you through updating your sample QnA Maker knowledge base (KB), programmatically. The JSON definition you use to update a KB allows you to add, change or delete question and answer pairs. 
services: cognitive-services
author: diberry
manager: cgronlun

ms.service: cognitive-services
ms.component: qna-maker
ms.topic: quickstart
ms.date: 10/19/2018
ms.author: diberry
---

# Quickstart: Update a knowledge base in QnA Maker using Go

This quickstart walks you through programmatically updating an existing QnA Maker knowledge base (KB).  This JSON allows you to update a KB by adding new data sources, changing data sources, or deleting data sources.

This API is equivalent to editing, then using the **Save and train** button in the QnA Maker portal.

This quickstart calls QnA Maker APIs:
* [Update](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da7600) - The model for the knowledge base is defined in the JSON sent in the body of the API request. 
* [Get Operation Details](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/operations_getoperationdetails)

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
	"time"
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

type Response struct {
	Headers	map[string][]string
	Body	string
}

func pretty_print(content string) string {
	var obj map[string]interface{}
    json.Unmarshal([]byte(content), &obj)
	result, _ := json.MarshalIndent(obj, "", "  ")
	return string(result)
}

func patch(uri string, content string) Response {
	req, _ := http.NewRequest("PATCH", uri, bytes.NewBuffer([]byte(content)))
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

	return Response {response.Header, string(body)}
}

func get(uri string) Response {
	req, _ := http.NewRequest("GET", uri, nil)
	req.Header.Add("Ocp-Apim-Subscription-Key", subscriptionKey)
	client := &http.Client{}
	response, err := client.Do(req)
	if err != nil {
		panic(err)
	}

	defer response.Body.Close()
    body, _ := ioutil.ReadAll(response.Body)

	return Response {response.Header, string(body)}
}

var req string = `{
  'add': {
    'qnaList': [
      {
        'id': 1,
        'answer': 'You can change the default message if you use the QnAMakerDialog. See this for details: https://docs.botframework.com/en-us/azure-bot-service/templates/qnamaker/#navtitle',
        'source': 'Custom Editorial',
        'questions': [
          'How can I change the default message from QnA Maker?'
        ],
        'metadata': []
      }
    ],
    'urls': [
      'https://docs.microsoft.com/azure/cognitive-services/Emotion/FAQ'
    ]
  },
  'update' : {
    'name' : 'New KB Name'
  },
  'delete': {
    'ids': [
      0
    ]
  }
}`;

func update_kb (uri string, req string) (string, string) {
	fmt.Println("Calling " + uri + ".")
	result := patch(uri, req)
	return result.Headers["Location"][0], result.Body
}

func check_status(uri string) (string, string) {
	fmt.Println("Calling " + uri + ".")
	result := get(uri)
	if retry, success := result.Headers["Retry-After"]; success {
		return retry[0], result.Body
	} else {
// If the response headers did not include a Retry-After value, default to 30 seconds.
		return "30", result.Body
	}
}

func main() {
	var uri = host + service + method + kb
	operation, body := update_kb (uri, req)
	fmt.Printf(body + "\n")
	var done bool = false
	for done == false {
		uri := host + service + operation
		wait, status := check_status(uri)
		fmt.Println(status)
		var status_obj map[string]interface{}
		json.Unmarshal([]byte(status), &status_obj)
		state := status_obj["operationState"]
// If the operation isn't finished, wait and query again.
		if state == "Running" || state == "NotStarted" {
			fmt.Printf ("Waiting " + wait + " seconds...")
			sec, _ := strconv.Atoi(wait)
			time.Sleep (time.Duration(sec) * time.Second)
		} else {
			done = true
		}
	}
}
```

## The update knowledge base response

A successful response is returned in JSON, as shown in the following example: 

```json
{
  "operationState": "NotStarted",
  "createdTimestamp": "2018-04-13T01:49:48Z",
  "lastActionTimestamp": "2018-04-13T01:49:48Z",
  "userId": "2280ef5917bb4ebfa1aae41fb1cebb4a",
  "operationId": "5156f64e-e31d-4638-ad7c-a2bdd7f41658"
}
...
{
  "operationState": "Succeeded",
  "createdTimestamp": "2018-04-13T01:49:48Z",
  "lastActionTimestamp": "2018-04-13T01:49:50Z",
  "resourceLocation": "/knowledgebases/140a46f3-b248-4f1b-9349-614bfd6e5563",
  "userId": "2280ef5917bb4ebfa1aae41fb1cebb4a",
  "operationId": "5156f64e-e31d-4638-ad7c-a2bdd7f41658"
}
Press any key to continue.
```

## Get request status

You can call the [Operation](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/operations_getoperationdetails) method to check the status of a request to create or update a knowledge base. To see how this method is used, please see the sample code for the [Create](create-new-kb-go.md) quickstart.

## Next steps

> [!div class="nextstepaction"]
> [QnA Maker (V4) REST API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff)
