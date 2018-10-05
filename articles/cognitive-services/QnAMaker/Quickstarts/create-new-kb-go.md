---
title: "Quickstart: Create knowledge base - REST, Go - QnA Maker"
titlesuffix: Azure Cognitive Services 
description: This quickstart walks you through programmatically creating a sample QnA Maker knowledge base. QnA Maker automatically extracts questions and answers from semi-structured content, like FAQs, from data sources.
services: cognitive-services
author: diberry
manager: cgronlun

ms.service: cognitive-services
ms.technology: qna-maker
ms.topic: quickstart
ms.date: 10/05/2018
ms.author: diberry
---

# Quickstart: Create a QnA Maker knowledge base in Go

This quickstart walks you through programmatically creating a sample QnA Maker knowledge base. QnA Maker automatically extracts questions and answers from semi-structured content, like FAQs, from [data sources](../Concepts/data-sources-supported.md). The model for the knowledge base is defined in the JSON sent in the body of the API request. 

This quickstart calls QnA Maker APIs:
* [Create KB](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff)
* [Get Operation Details](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/operations_getoperationdetails)

## Prerequisites

* [Go 1.10.1](https://golang.org/dl/)
* You must have a [QnA Maker service](../How-To/set-up-qnamaker-service-azure.md). To retrieve your key, select **Keys** under **Resource Management** in your dashboard. 

## Create a knowledge base Go file

Create a file named `create-new-knowledge-base.go`.

## Add the required dependencies

At the top of `create-new-knowledge-base.go`, add the following lines to add necessary dependencies to the project:

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
```

## Add the required constants
After the preceding required dependencies, add the required constants to access QnA Maker. Replace the value of the `subscriptionKey`variable with your own QnA Maker key.

```go
var host string = "https://westus.api.cognitive.microsoft.com"
var service string = "/qnamaker/v4.0"
var method string = "/knowledgebases/create"

var uri = host + service + method

// Replace this with a valid subscription key.
var subscriptionKey string = "<your-qna-maker-subscription-key>"
```

## Add the KB model definition
After the constants, add the following KB model definition. The model is converting into a string after the definition.

```go
var kb string = `{
  "name": "QnA Maker FAQ",
  "qnaList": [
    {
      "id": 0,
      "answer": "You can use our REST APIs to manage your Knowledge Base. See here for details: https://westus.dev.cognitive.microsoft.com/docs/services/58994a073d9e04097c7ba6fe/operations/58994a073d9e041ad42d9baa",
      "source": "Custom Editorial",
      "questions": [
        "How do I programmatically update my Knowledge Base?"
      ],
      "metadata": [
        {
          "name": "category",
          "value": "api"
        }
      ]
    }
  ],
  "urls": [
    "https://docs.microsoft.com/en-in/azure/cognitive-services/qnamaker/faqs",
    "https://docs.microsoft.com/en-us/bot-framework/resources-bot-framework-faq"
  ],
  "files": []
}`;
```

## Add supporting structures and functions

Next, add the following supporting functions.

1. Add the structure for an HTTP request:

    ```go
    type Response struct {
    	Headers	map[string][]string
    	Body	string
    }
    ```

2. Add the following function to print out JSON in a readable format:

    ```go
    func pretty_print(content string) string {
    	var obj map[string]interface{}
        json.Unmarshal([]byte(content), &obj)
    	result, _ := json.MarshalIndent(obj, "", "  ")
    	return string(result)
    }
    ```
3. Add the following method to handle a POST to the QnA Maker APIs. For this quickstart, the POST is used to send the KB definition to QnA Maker.

    ```go
    func post(uri string, content string) Response {
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
    
    	return Response {response.Header, string(body)}
    }
    ```

4. Add the following method to handle a GET to the QnA Maker APIs. For this quickstart, the GET is used to check the status of the creation operation. 

    ```go
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
    ```

## Add function to create KB

Add the following functions to make an HTTP POST request to create the knowledge base. The _create_ **Operation ID** is returned in the POST response header field **Location**, then used as part of the route in the GET request. The `Ocp-Apim-Subscription-Key` is the QnA Maker service key, used for authentication. 

```go
func create_kb(uri string, req string) (string, string) {
	fmt.Println("Calling " + uri + ".")
	result := post(uri, req)

	operationIds, exists := result.Headers["Location"]

	if(exists){
		return operationIds[0], result.Body
	} else {
		// error message is in result.Body
		return "", result.Body
	}
}
```

This API call returns a JSON response that includes the operation ID in the header field **Location**. Use the operation ID to determine if the KB is successfully created. 

```JSON
{
  "operationState": "NotStarted",
  "createdTimestamp": "2018-09-26T05:19:01Z",
  "lastActionTimestamp": "2018-09-26T05:19:01Z",
  "userId": "XXX9549466094e1cb4fd063b646e1ad6",
  "operationId": "8dfb6a82-ae58-4bcb-95b7-d1239ae25681"
}
```

## Add function to determine creation status

Add the following function to make an HTTP GET request to check the operation status. The `Ocp-Apim-Subscription-Key` is the QnA Maker service key, used for authentication. 

```go
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
```

Repeat the call until success or failure: 

```JSON
{
  "operationState": "Succeeded",
  "createdTimestamp": "2018-09-26T05:22:53Z",
  "lastActionTimestamp": "2018-09-26T05:23:08Z",
  "resourceLocation": "/knowledgebases/XXX7892b-10cf-47e2-a3ae-e40683adb714",
  "userId": "XXX9549466094e1cb4fd063b646e1ad6",
  "operationId": "177e12ff-5d04-4b73-b594-8575f9787963"
}
```
## Add create-kb function

The following function is the main function and creates the KB and repeats checks on the status. Because the KB creation may take some time, you need to repeat calls to check the status until the status is either successful or fails.

```go
func main() {
	
	operation, body := create_kb(uri, kb)
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

# Compile the program
Enter the following command to compile the file. The command prompt does not return any information for a successful build.

```bash
go build create-new-knowledge-base.go
```

## Run the program

Enter the following command at a command-line to run the program. It will send the request to the QnA Maker API to create the KB, then it will poll for the results every 30 seconds. Each response is printed to the console window.

```bash
go run create-new-knowledge-base.go
```

Once your knowledge base is created, you can view it in your QnA Maker Portal, [My knowledge bases](https://www.qnamaker.ai/Home/MyServices) page. 

## Run the program

## Next steps

> [!div class="nextstepaction"]
> [QnA Maker (V4) REST API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff)