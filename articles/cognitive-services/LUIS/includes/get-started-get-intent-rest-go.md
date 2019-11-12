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

[!INCLUDE [Use authoring key for endpoint](../includes/get-key-quickstart.md)]

## Get intent programmatically

Use Go to query the prediction endpoint GET [API](https://aka.ms/luis-apim-v3-prediction) to get the prediction result.

1. Create a new file named `predict.go`. Add the following code:
    
    ```go
    package main
    
    /* Do dependencies */
    import (
        "fmt"
        "net/http"
        "net/url"
        "io/ioutil"
        "log"
    )
    func main() {
    	
    	// public app
        var appID = "df67dcdb-c37d-46af-88e1-8b97951ca1c2"
    	
    	// utterance for public app
    	var utterance = "turn on all lights"
    	
    	// YOUR-KEY - your starter or prediction key
    	var endpointKey = "YOUR-KEY"
    	
    	// YOUR-ENDPOINT - example is westus2.api.cognitive.microsoft.com
        var endpoint = "YOUR-ENDPOINT"
    
    	endpointPrediction(appID, endpointKey, endpoint, utterance)
    }
    func endpointPrediction(appID string, endpointKey string, endpoint string, utterance string) {
    
        var endpointUrl = fmt.Sprintf("https://%s/luis/prediction/v3.0/apps/%s/slots/production/predict?subscription-key=%s&verbose=true&show-all-intents=true&query=%s", endpoint, appID, endpointKey, url.QueryEscape(utterance))
        
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
    ```

1. Replace the following values:

    * `YOUR-KEY` with your starter key
    * `YOUR-ENDPOINT` with your endpoint, for example, `westus2.api.cognitive.microsoft.com`

1. With a command prompt in the same directory as where you created the file, enter the following command to compile the Go file:

    ```console
    go build predict.go
    ```  

1. Run the Go application from the command line by entering the following text in the command prompt: 

    ```console
    go run predict.go
    ```
    
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

When you are finished with this quickstart, delete the file from the file system. 

## Next steps

> [!div class="nextstepaction"]
> [Add utterances and train](../luis-get-started-go-add-utterance.md)