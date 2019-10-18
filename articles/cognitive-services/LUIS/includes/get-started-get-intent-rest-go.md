---
title: Get intent with REST call in Go
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.topic: include 
ms.date: 10/17/2019
ms.author: diberry
---
## Prerequisites

* [Go](https://golang.org/) programming language  
* [Visual Studio Code](https://code.visualstudio.com/)
* Public app ID: df67dcdb-c37d-46af-88e1-8b97951ca1c2

## Get LUIS key

[!INCLUDE [Use authoring key for endpoint](../includes/get-key-for-quickstart.md)]

## Get intent programmatically

You can use Go to access the same results you saw in the browser window in the previous step. 

1. Create a new file named `predict.go`. Add the following code:
    
    ```go
    package main
    
    /* Do dependencies */
    import (
        "fmt"
        "flag"
        "net/http"
        "net/url"
        "io/ioutil"
        "log"
    )
    
    /* 
        Predict utterance
    
        appID = public app ID = be402ffc-57f4-4e1f-9c1d-f0d9fa520aa4
        Key = Azure Language Understanding key, or Authoring key if it still has quota
        endpoint = Azure Language Understanding prediction endpoint
        utterance = text to analyze
    
    */
    func endpointPrediction(appID string, endpointKey string, region string, utterance string) {
    
        var endpointUrl = fmt.Sprintf("https://%s/luis/prediction/v3.0/apps/%s/slots/production/predict?subscription-key=%s&verbose=true&show-all-intents=true&query=%s", region, appID, endpointKey, url.QueryEscape(utterance))
        
        response, err := http.Get(endpointUrl)
    
        if err!=nil {
            // handle error
            fmt.Println("error from Get")
            log.Fatal(err)
        }
        
        response2, err2 := ioutil.ReadAll(response.Body)
    
        if err2!=nil {
            // handle error
            fmt.Println("error from ReadAll")
            log.Fatal(err2)
        }
    
        fmt.Println("response")
        fmt.Println(string(response2))
    }
    
    func main() {
    	
    	// public app
        var appID = flag.String("appID", "df67dcdb-c37d-46af-88e1-8b97951ca1c2", "LUIS appID")
    	
    	// utterance for public app
    	var utterance = flag.String("utterance", "turn on all lights", "utterance to predict")
    	
    	// YOUR-KEY - your starter or prediction key
    	var endpointKey = flag.String("endpointKey", "", "LUIS endpoint key")
    	
    	// YOUR-ENDPOINT - example is westus2.api.cognitive.microsoft.com
        var endpoint = flag.String("endpoint", "", "LUIS app publish endpoint")
    
    
        flag.Parse()
        
        fmt.Println("appID has value", *appID)
        fmt.Println("endpointKey has value", *endpointKey)
        fmt.Println("endpoint has value", *endpoint)
        fmt.Println("utterance has value", *utterance)
    
        endpointPrediction(*appID, *endpointKey, *endpoint, *utterance)
    
    }
    ```

2. With a command prompt in the same directory as where you created the file, enter `go build endpoint.go` to compile the Go file. The command prompt does not return any information for a successful build.

3. Run the Go application from the command line by entering the following text in the command prompt: 

    ```CMD
    go run predict.go -appID df67dcdb-c37d-46af-88e1-8b97951ca1c2 -endpointKey YOUR-KEY -endpoint YOUR-ENDPOINT
    ```
    
    * Replace `YOUR-KEY` with the value of your starter key.  
    * Replace `YOUR-ENDPOINT` with the value of your endpoint. An example is `westus2.api.cognitive.microsoft.com`.
    
    The command prompt response is: 
    
    ```console
    appID has value df67dcdb-c37d-46af-88e1-8b97951ca1c2
    endpointKey has value a7b206911f714e71a1ddae36928a61cc
    endpoint has value westus2.api.cognitive.microsoft.com
    utterance has value turn on all lights
    response
    {"query":"turn on all lights","prediction":{"topIntent":"HomeAutomation.TurnOn","intents":{"HomeAutomation.TurnOn":{"score":0.5375382},"None":{"score":0.08687421},"HomeAutomation.TurnOff":{"score":0.0207554}},"entities":{"HomeAutomation.Operation":["on"],"$instance":{"HomeAutomation.Operation":[{"type":"HomeAutomation.Operation","text":"on","startIndex":5,"length":2,"score":0.724984169,"modelTypeId":-1,"modelType":"Unknown","recognitionSources":["model"]}]}}}}
    ```

    JSON formatted for readability:

    ```json
    {
        "query": "turn on all lights",
        "prediction": {
            "topIntent": "HomeAutomation.TurnOn",
            "intents": {
                "HomeAutomation.TurnOn": {
                    "score": 0.5375382
                },
                "None": {
                    "score": 0.08687421
                },
                "HomeAutomation.TurnOff": {
                    "score": 0.0207554
                }
            },
            "entities": {
                "HomeAutomation.Operation": [
                    "on"
                ],
                "$instance": {
                    "HomeAutomation.Operation": [
                        {
                            "type": "HomeAutomation.Operation",
                            "text": "on",
                            "startIndex": 5,
                            "length": 2,
                            "score": 0.724984169,
                            "modelTypeId": -1,
                            "modelType": "Unknown",
                            "recognitionSources": [
                                "model"
                            ]
                        }
                    ]
                }
            }
        }
    }
    ```


## LUIS keys

[!INCLUDE [Use authoring key for endpoint](../includes/starter-key-explanation.md)]

## Clean up resources

When you are finished with this quickstart, close the Visual Studio project and remove the project directory from the file system. 

## Next steps

> [!div class="nextstepaction"]
> [Add utterances and train with Go](../luis-get-started-go-add-utterance.md)