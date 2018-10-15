---
title: "Quickstart: Go for QnA Maker API (V4)"
titleSuffix: Azure Cognitive Services 
description: Get information and code samples to help you quickly get started using the Microsoft Translator Text API in Microsoft Cognitive Services on Azure.
services: cognitive-services
author: diberry
manager: cgronlun

ms.service: cognitive-services
ms.component: qna-maker
ms.topic: quickstart
ms.date: 09/12/2018
ms.author: diberry

---
# Quickstart for Microsoft QnA Maker API with Go 
<a name="HOLTop"></a>

This article shows you how to use the [Microsoft QnA Maker API](../Overview/overview.md) with Go to do the following.

- [Create a new knowledge base.](#Create)
- [Update an existing knowledge base.](#Update)
- [Get the status of a request to create or update a knowledge base.](#Status)
- [Publish an existing knowledge base.](#Publish)
- [Replace the contents of an existing knowledge base.](#Replace)
- [Download the contents of a knowledge base.](#GetQnA)
- [Get answers to a question using a knowledge base.](#GetAnswers)
- [Get information about a knowledge base.](#GetKB)
- [Get information about all knowledge bases belonging to the specified user.](#GetKBsByUser)
- [Delete a knowledge base.](#Delete)
- [Get the current endpoint keys.](#GetKeys)
- [Re-generate the current endpoint keys.](#PutKeys)
- [Get the current set of word alterations.](#GetAlterations)
- [Replace the current set of word alterations.](#PutAlterations)

## Prerequisites

You will need [Go 1.10.1](https://golang.org/dl/) to run this code.

You must have a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with **Microsoft QnA Maker API**. You will need a paid subscription key from your [Azure dashboard](https://portal.azure.com/#create/Microsoft.CognitiveServices).

<a name="Create"></a>

## Create knowledge base

The following code creates a new knowledge base, using the [Create](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff) method.

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

var host string = "https://westus.api.cognitive.microsoft.com"
var service string = "/qnamaker/v4.0"
var method string = "/knowledgebases/create"

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
  "name": "QnA Maker FAQ",
  "qnaList": [
    {
      "id": 0,
      "answer": "You can use our REST APIs to manage your Knowledge Base. See here for details: https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da7600",
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

func create_kb(uri string, req string) (string, string) {
	fmt.Println("Calling " + uri + ".")
	result := post(uri, req)
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
	var uri = host + service + method
	operation, body := create_kb(uri, req)
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

**Create knowledge base response**

A successful response is returned in JSON, as shown in the following example: 

```json
{
  "operationState": "NotStarted",
  "createdTimestamp": "2018-04-13T01:52:30Z",
  "lastActionTimestamp": "2018-04-13T01:52:30Z",
  "userId": "2280ef5917bb4ebfa1aae41fb1cebb4a",
  "operationId": "e88b5b23-e9ab-47fe-87dd-3affc2fb10f3"
}
...
{
  "operationState": "Running",
  "createdTimestamp": "2018-04-13T01:52:30Z",
  "lastActionTimestamp": "2018-04-13T01:52:30Z",
  "userId": "2280ef5917bb4ebfa1aae41fb1cebb4a",
  "operationId": "e88b5b23-e9ab-47fe-87dd-3affc2fb10f3"
}
...
{
  "operationState": "Succeeded",
  "createdTimestamp": "2018-04-13T01:52:30Z",
  "lastActionTimestamp": "2018-04-13T01:52:46Z",
  "resourceLocation": "/knowledgebases/b0288f33-27b9-4258-a304-8b9f63427dad",
  "userId": "2280ef5917bb4ebfa1aae41fb1cebb4a",
  "operationId": "e88b5b23-e9ab-47fe-87dd-3affc2fb10f3"
}
```

[Back to top](#HOLTop)

<a name="Update"></a>

## Update knowledge base

The following code updates an existing knowledge base, using the [Update](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da7600) method.

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
      'https://docs.microsoft.com/en-us/azure/cognitive-services/Emotion/FAQ'
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

**Update knowledge base response**

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

[Back to top](#HOLTop)

<a name="Status"></a>

## Get request status

You can call the [Operation](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/operations_getoperationdetails) method to check the status of a request to create or update a knowledge base. To see how this method is used, please see the sample code for the [Create](#Create) or [Update](#Update) method.

[Back to top](#HOLTop)

<a name="Publish"></a>

## Publish knowledge base

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

**Publish knowledge base response**

A successful response is returned in JSON, as shown in the following example: 

```json
{
  "result": "Success."
}
```

[Back to top](#HOLTop)

<a name="Replace"></a>

## Replace knowledge base

The following code replaces the contents of the specified knowledge base, using the [Replace](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/knowledgebases_publish) method.

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

func put(uri string, content string) string {
	req, _ := http.NewRequest("PUT", uri, bytes.NewBuffer([]byte(content)))
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

var req string = `{
  'qnaList': [
    {
      'id': 0,
      'answer': 'You can use our REST APIs to manage your Knowledge Base. See here for details: https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da7600',
      'source': 'Custom Editorial',
      'questions': [
        'How do I programmatically update my Knowledge Base?'
      ],
      'metadata': [
        {
          'name': 'category',
          'value': 'api'
        }
      ]
    }
  ]
}`;

func replace_kb (uri string, req string) (string) {
	fmt.Println("Calling " + uri + ".")
	return put(uri, req)
}

func main() {
	var uri = host + service + method + kb
	body := replace_kb (uri, req)
	fmt.Printf(body + "\n")
}
```

**Replace knowledge base response**

A successful response is returned in JSON, as shown in the following example: 

```json
{
    "result": "Success."
}
```

[Back to top](#HOLTop)

<a name="GetQnA"></a>

## Download the contents of a knowledge base

The following code downloads the contents of the specified knowledge base, using the [Download knowledge base](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/knowledgebases_download) method.

1. Create a new Go project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```go
package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace this with a valid subscription key.
var subscriptionKey string = "ENTER KEY HERE"

// NOTE: Replace this with a valid knowledge base ID.
var kb string = "ENTER ID HERE";

// NOTE: Replace this with "test" or "prod".
var env string = "test";

var host string = "https://westus.api.cognitive.microsoft.com"
var service string = "/qnamaker/v4.0"
var method string = "/knowledgebases/%s/%s/qna"

func pretty_print(content string) string {
	var obj map[string]interface{}
    json.Unmarshal([]byte(content), &obj)
	result, _ := json.MarshalIndent(obj, "", "  ")
	return string(result)
}

func get(uri string) string {
	req, _ := http.NewRequest("GET", uri, nil)
	req.Header.Add("Ocp-Apim-Subscription-Key", subscriptionKey)
	client := &http.Client{}
	response, err := client.Do(req)
	if err != nil {
		panic(err)
	}

	defer response.Body.Close()
    body, _ := ioutil.ReadAll(response.Body)
	return string(body)
}

func getQnA(uri string) string {
	fmt.Println("Calling " + uri + ".")
	return get(uri)
}

func main() {
	var method_with_id = fmt.Sprintf(method, kb, env)
	var uri = host + service + method_with_id
	body := getQnA(uri)
	fmt.Printf(body + "\n")
}
```

**Download knowledge base response**

A successful response is returned in JSON, as shown in the following example: 

```json
{
  "qnaDocuments": [
    {
      "id": 1,
      "answer": "You can use our REST APIs to manage your Knowledge Base. See here for details: https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da7600",
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
    },
    {
      "id": 2,
      "answer": "QnA Maker provides an FAQ data source that you can query from your bot or application. Although developers will find this useful, content owners will especially benefit from this tool. QnA Maker is a completely no-code way of managing the content that powers your bot or application.",
      "source": "https://docs.microsoft.com/en-in/azure/cognitive-services/qnamaker/faqs",
      "questions": [
        "Who is the target audience for the QnA Maker tool?"
      ],
      "metadata": []
    },
...
  ]
}
```

[Back to top](#HOLTop)

<a name="GetAnswers"></a>

## Get answers to a question by using a knowledge base

The following code gets answers to a question using the specified knowledge base, using the **Generate answers** method.

1. Create a new Go project in your favorite IDE.
1. Add the code provided below.
1. Replace the `host` value with the Website name for your QnA Maker subscription. For more information see [Create a QnA Maker service](../How-To/set-up-qnamaker-service-azure.md).
1. Replace the `endpoint_key` value with a valid endpoint key for your subscription. Note this is not the same as your subscription key. You can get your endpoint keys using the [Get endpoint keys](#GetKeys) method.
1. Replace the `kb` value with the ID of the knowledge base you want to query for answers. Note this knowledge base must already have been published using the [Publish](#Publish) method.
1. Run the program.

```go
package main

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
)

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// NOTE: Replace this with a valid host name.
var host string = "ENTER HOST HERE";

// NOTE: Replace this with a valid endpoint key.
// This is not your subscription key.
// To get your endpoint keys, call the GET /endpointkeys method.
var endpoint_key string = "ENTER KEY HERE";

// NOTE: Replace this with a valid knowledge base ID.
// Make sure you have published the knowledge base with the
// POST /knowledgebases/{knowledge base ID} method.
var kb string = "ENTER KB ID HERE";

var method string = "/qnamaker/knowledgebases/" + kb + "/generateanswer"

func post(uri string, content string) string {
	req, _ := http.NewRequest("POST", uri, bytes.NewBuffer([]byte(content)))
	req.Header.Add("Authorization", "EndpointKey " + endpoint_key)
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Content-Length", strconv.Itoa(len(content)))
	client := &http.Client{}
	response, err := client.Do(req)
	if err != nil {
		panic(err)
	}

	defer response.Body.Close()
    body, _ := ioutil.ReadAll(response.Body)

	return string(body)
}

var req string = `{
    'question': 'Is the QnA Maker Service free?',
    'top': 3
}`;

func get_answers(uri string, req string) string {
	fmt.Println("Calling " + uri + ".")
	return post(uri, req)
}

func main() {
	var uri = host + method
	body := get_answers(uri, req)
	fmt.Printf(body + "\n")
}
```

**Get answers response**

A successful response is returned in JSON, as shown in the following example: 

```json
{
  "answers": [
    {
      "questions": [
        "Can I use BitLocker with the Volume Shadow Copy Service?"
      ],
      "answer": "Yes. However, shadow copies made prior to enabling BitLocker will be automatically deleted when BitLocker is enabled on software-encrypted drives. If you are using a hardware encrypted drive, the shadow copies are retained.",
      "score": 17.3,
      "id": 62,
      "source": "https://docs.microsoft.com/en-us/windows/security/information-protection/bitlocker/bitlocker-frequently-asked-questions",
      "metadata": []
    },
...
  ]
}
```

[Back to top](#HOLTop)

<a name="GetKB"></a>

## Get information about a knowledge base

The following code gets information about the specified knowledge base, using the [Get knowledge base details](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/knowledgebases_getknowledgebasedetails) method.

1. Create a new Go project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```go
package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
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

func get(uri string) string {
	req, _ := http.NewRequest("GET", uri, nil)
	req.Header.Add("Ocp-Apim-Subscription-Key", subscriptionKey)
	client := &http.Client{}
	response, err := client.Do(req)
	if err != nil {
		panic(err)
	}

	defer response.Body.Close()
    body, _ := ioutil.ReadAll(response.Body)
	return string(body)
}

func getKB(uri string) string {
	fmt.Println("Calling " + uri + ".")
	return get(uri)
}

func main() {
	var uri = host + service + method + kb
	body := getKB(uri)
	fmt.Printf(body + "\n")
}
```

**Get knowledge base details response**

A successful response is returned in JSON, as shown in the following example: 

```json
{
  "id": "140a46f3-b248-4f1b-9349-614bfd6e5563",
  "hostName": "https://qna-docs.azurewebsites.net",
  "lastAccessedTimestamp": "2018-04-12T22:58:01Z",
  "lastChangedTimestamp": "2018-04-12T22:58:01Z",
  "name": "QnA Maker FAQ",
  "userId": "2280ef5917bb4ebfa1aae41fb1cebb4a",
  "urls": [
    "https://docs.microsoft.com/en-in/azure/cognitive-services/qnamaker/faqs",
    "https://docs.microsoft.com/en-us/bot-framework/resources-bot-framework-faq"
  ],
  "sources": [
    "Custom Editorial"
  ]
}
```

[Back to top](#HOLTop)

<a name="GetKBsByUser"></a>

## Get all knowledge bases for a user

The following code gets information about all knowledge bases for a specified user, using the [Get knowledge bases for user](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/knowledgebases_getknowledgebasesforuser) method.

1. Create a new Go project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```go
package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace this with a valid subscription key.
var subscriptionKey string = "ENTER KEY HERE"

var host string = "https://westus.api.cognitive.microsoft.com"
var service string = "/qnamaker/v4.0"
var method string = "/knowledgebases/"

func pretty_print(content string) string {
	var obj map[string]interface{}
    json.Unmarshal([]byte(content), &obj)
	result, _ := json.MarshalIndent(obj, "", "  ")
	return string(result)
}

func get(uri string) string {
	req, _ := http.NewRequest("GET", uri, nil)
	req.Header.Add("Ocp-Apim-Subscription-Key", subscriptionKey)
	client := &http.Client{}
	response, err := client.Do(req)
	if err != nil {
		panic(err)
	}

	defer response.Body.Close()
    body, _ := ioutil.ReadAll(response.Body)
	return string(body)
}

func getKBs(uri string) string {
	fmt.Println("Calling " + uri + ".")
	return get(uri)
}

func main() {
	var uri = host + service + method
	body := getKBs(uri)
	fmt.Printf(body + "\n")
}
```

**Get knowledge bases for user response**

A successful response is returned in JSON, as shown in the following example: 

```json
{
  "knowledgebases": [
    {
      "id": "081c32a7-bd05-4982-9d74-07ac736df0ac",
      "hostName": "https://qna-docs.azurewebsites.net",
      "lastAccessedTimestamp": "2018-04-12T11:51:58Z",
      "lastChangedTimestamp": "2018-04-12T11:51:58Z",
      "name": "QnA Maker FAQ",
      "userId": "2280ef5917bb4ebfa1aae41fb1cebb4a",
      "urls": [],
      "sources": []
    },
    {
      "id": "140a46f3-b248-4f1b-9349-614bfd6e5563",
      "hostName": "https://qna-docs.azurewebsites.net",
      "lastAccessedTimestamp": "2018-04-12T22:58:01Z",
      "lastChangedTimestamp": "2018-04-12T22:58:01Z",
      "name": "QnA Maker FAQ",
      "userId": "2280ef5917bb4ebfa1aae41fb1cebb4a",
      "urls": [
        "https://docs.microsoft.com/en-in/azure/cognitive-services/qnamaker/faqs",
        "https://docs.microsoft.com/en-us/bot-framework/resources-bot-framework-faq"
      ],
      "sources": [
        "Custom Editorial"
      ]
    },
...
  ]
}
Press any key to continue.
```

[Back to top](#HOLTop)

<a name="Delete"></a>

## Delete a knowledge base

The following code deletes the specified knowledge base, using the [Delete knowledge base](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/knowledgebases_delete) method.

1. Create a new Go project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```go
package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
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

func delete(uri string) string {
	req, _ := http.NewRequest("DELETE", uri, nil)
	req.Header.Add("Ocp-Apim-Subscription-Key", subscriptionKey)
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

func deleteKB(uri string) string {
	fmt.Println("Calling " + uri + ".")
	return delete(uri)
}

func main() {
	var uri = host + service + method + kb
	body := deleteKB(uri)
	fmt.Printf(body + "\n")

}
```

**Delete knowledge base response**

A successful response is returned in JSON, as shown in the following example: 

```json
{
  "result": "Success."
}
```

[Back to top](#HOLTop)

<a name="GetKeys"></a>

## Get endpoint keys

The following code gets the current endpoint keys, using the [Get endpoint keys](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/endpointkeys_getendpointkeys) method.

1. Create a new Go project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```go
package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace this with a valid subscription key.
var subscriptionKey string = "ENTER KEY HERE"

var host string = "https://westus.api.cognitive.microsoft.com"
var service string = "/qnamaker/v4.0"
var method string = "/endpointkeys/"

func pretty_print(content string) string {
	var obj map[string]interface{}
    json.Unmarshal([]byte(content), &obj)
	result, _ := json.MarshalIndent(obj, "", "  ")
	return string(result)
}

func get(uri string) string {
	req, _ := http.NewRequest("GET", uri, nil)
	req.Header.Add("Ocp-Apim-Subscription-Key", subscriptionKey)
	client := &http.Client{}
	response, err := client.Do(req)
	if err != nil {
		panic(err)
	}

	defer response.Body.Close()
    body, _ := ioutil.ReadAll(response.Body)
	return string(body)
}

func getEndpointKeys(uri string) string {
	fmt.Println("Calling " + uri + ".")
	return get(uri)
}

func main() {
	var uri = host + service + method
	body := getEndpointKeys(uri)
	fmt.Printf(body + "\n")
}
```

**Get endpoint keys response**

A successful response is returned in JSON, as shown in the following example: 

```json
{
  "primaryEndpointKey": "ac110bdc-34b7-4b1c-b9cd-b05f9a6001f3",
  "secondaryEndpointKey": "1b4ed14e-614f-444a-9f3d-9347f45a9206"
}
```

[Back to top](#HOLTop)

<a name="PutKeys"></a>

## Refresh endpoint keys

The following code regenerates the current endpoint keys, using the [Refresh endpoint keys](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/endpointkeys_refreshendpointkeys) method.

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

// NOTE: Replace this with "PrimaryKey" or "SecondaryKey."
var key_type string = "PrimaryKey";

var host string = "https://westus.api.cognitive.microsoft.com"
var service string = "/qnamaker/v4.0"
var method string = "/endpointkeys/"

func pretty_print(content string) string {
	var obj map[string]interface{}
    json.Unmarshal([]byte(content), &obj)
	result, _ := json.MarshalIndent(obj, "", "  ")
	return string(result)
}

func patch(uri string, content string) string {
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

	return string(body)
}

func refresh (uri string, req string) string {
	fmt.Println("Calling " + uri + ".")
	return patch(uri, req)
}

func main() {
	var uri = host + service + method + key_type
	body := refresh (uri, "")
	fmt.Printf(body + "\n")
}
```

**Refresh endpoint keys response**

A successful response is returned in JSON, as shown in the following example: 

```json
{
  "primaryEndpointKey": "ac110bdc-34b7-4b1c-b9cd-b05f9a6001f3",
  "secondaryEndpointKey": "1b4ed14e-614f-444a-9f3d-9347f45a9206"
}
```

[Back to top](#HOLTop)

<a name="GetAlterations"></a>

## Get word alterations

The following code gets the current word alterations, using the [Download alterations](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75fc) method.

1. Create a new Go project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```go
package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace this with a valid subscription key.
var subscriptionKey string = "ENTER KEY HERE"

var host string = "https://westus.api.cognitive.microsoft.com"
var service string = "/qnamaker/v4.0"
var method string = "/alterations/"

func pretty_print(content string) string {
	var obj map[string]interface{}
    json.Unmarshal([]byte(content), &obj)
	result, _ := json.MarshalIndent(obj, "", "  ")
	return string(result)
}

func get(uri string) string {
	req, _ := http.NewRequest("GET", uri, nil)
	req.Header.Add("Ocp-Apim-Subscription-Key", subscriptionKey)
	client := &http.Client{}
	response, err := client.Do(req)
	if err != nil {
		panic(err)
	}

	defer response.Body.Close()
    body, _ := ioutil.ReadAll(response.Body)
	return string(body)
}

func getAlterations(uri string) string {
	fmt.Println("Calling " + uri + ".")
	return get(uri)
}

func main() {
	var uri = host + service + method
	body := getAlterations(uri)
	fmt.Printf(body + "\n")
}
```

**Get word alterations response**

A successful response is returned in JSON, as shown in the following example: 

```json
{
  "wordAlterations": [
    {
      "alterations": [
        "botframework",
        "bot frame work"
      ]
    }
  ]
}
```

[Back to top](#HOLTop)

<a name="PutAlterations"></a>

## Replace word alterations

The following code replaces the current word alterations, using the [Replace alterations](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75fd) method.

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

var host string = "https://westus.api.cognitive.microsoft.com"
var service string = "/qnamaker/v4.0"
var method string = "/alterations/"

func pretty_print(content string) string {
	var obj map[string]interface{}
    json.Unmarshal([]byte(content), &obj)
	result, _ := json.MarshalIndent(obj, "", "  ")
	return string(result)
}

func put(uri string, content string) string {
	req, _ := http.NewRequest("PUT", uri, bytes.NewBuffer([]byte(content)))
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

var req string = `{
  'wordAlterations': [
    {
      'alterations': [
        'botframework',
        'bot frame work'
      ]
    }
  ]
}`;

func putAlterations (uri string, req string) (string) {
	fmt.Println("Calling " + uri + ".")
	return put(uri, req)
}

func main() {
	var uri = host + service + method
	body := putAlterations (uri, req)
	fmt.Printf(body + "\n")
}
```

**Replace word alterations response**

A successful response is returned in JSON, as shown in the following example: 

```json
{
  "result": "Success."
}
```

[Back to top](#HOLTop)

## Next steps

> [!div class="nextstepaction"]
> [QnA Maker (V4) REST API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff)

## See also 

[QnA Maker overview](../Overview/overview.md)
