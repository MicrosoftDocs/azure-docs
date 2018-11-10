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
      "source": "https://docs.microsoft.com/windows/security/information-protection/bitlocker/bitlocker-frequently-asked-questions",
      "metadata": []
    },
...
  ]
}
```
