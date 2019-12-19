---
title: Get model with REST call in Go
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.topic: include 
ms.date: 10/18/2019
ms.author: diberry
---

## Prerequisites

* Starter key.
* Import the [TravelAgent](https://github.com/Azure-Samples/cognitive-services-language-understanding/blob/master/documentation-samples/quickstarts/change-model/TravelAgent.json) app from the cognitive-services-language-understanding GitHub repository.
* The LUIS application ID for the imported TravelAgent app. The application ID is shown in the application dashboard.
* The version ID within the application that receives the utterances. The default ID is "0.1".
* [Go](https://golang.org/) programming language  
* [Visual Studio Code](https://code.visualstudio.com/)

## Example utterances JSON file

[!INCLUDE [Quickstart explanation of example utterance JSON file](get-started-get-model-json-example-utterances.md)]

## Get LUIS key

[!INCLUDE [Use authoring key for endpoint](../includes/get-key-quickstart.md)]

## Change model programmatically

Use Go to add a machine-learned entity [API](https://aka.ms/luis-apim-v3-authoring) to the application. 

1. Create a new file named `predict.go`. Add the following code:
    
    ```go
    // dependencies
    package main
    import (
    	"fmt"
    	"net/http"
    	"io/ioutil"
    	"log"
    	"strings"
    )
    
    // main function
    func main() {
    
    	// NOTE: change to your app ID
    	var appID = "YOUR-APP-ID"
    
    	// NOTE: change to your starter key
    	var authoringKey = "YOUR-KEY"
    
    	// NOTE: change to your starter key's endpoint, for example, westus.api.cognitive.microsoft.com
    	var endpoint = "YOUR-ENDPOINT"	
    
    	var version = "0.1"
    
    	var exampleUtterances = `
    	[
    		{
    		  'text': 'go to Seattle today',
    		  'intentName': 'BookFlight',
    		  'entityLabels': [
    			{
    			  'entityName': 'Location::LocationTo',
    			  'startCharIndex': 6,
    			  'endCharIndex': 12
    			}
    		  ]
    		},
    		{
    			'text': 'a barking dog is annoying',
    			'intentName': 'None',
    			'entityLabels': []
    		}
    	  ]
    	`
    
    	fmt.Println("add example utterances requested")
    	addUtterance(authoringKey, appID, version, exampleUtterances, endpoint)
    
    	fmt.Println("training selected")
    	requestTraining(authoringKey, appID, version, endpoint)
    
    	fmt.Println("training status selected")
    	getTrainingStatus(authoringKey, appID, version, endpoint)
    }
    
    // get utterances from file and add to model
    func addUtterance(authoringKey string, appID string,  version string, labeledExampleUtterances string, endpoint string){
    
    	var authoringUrl = fmt.Sprintf("https://%s/luis/authoring/v3.0-preview/apps/%s/versions/%s/examples", endpoint, appID, version)
    
    	httpRequest("POST", authoringUrl, authoringKey, labeledExampleUtterances)
    }
    func requestTraining(authoringKey string, appID string,  version string, endpoint string){
    
    	trainApp("POST", authoringKey, appID, version, endpoint)
    }
    func trainApp(httpVerb string, authoringKey string, appID string,  version string, endpoint string){
    
    	var authoringUrl = fmt.Sprintf("https://%s/luis/authoring/v3.0-preview/apps/%s/versions/%s/train", endpoint, appID, version)
    
    	httpRequest(httpVerb,authoringUrl, authoringKey, "")
    }
    func getTrainingStatus(authoringKey string, appID string, version string, endpoint string){
    
    	trainApp("GET", authoringKey, appID, version, endpoint)
    }
    // generic HTTP request
    // includes setting header with authoring key
    func httpRequest(httpVerb string, url string, authoringKey string, body string){
    
    	client := &http.Client{}
    
    	request, err := http.NewRequest(httpVerb, url, strings.NewReader(body))
    	request.Header.Add("Ocp-Apim-Subscription-Key", authoringKey)
    
    	fmt.Println("body")
    	fmt.Println(body)
    
    	response, err := client.Do(request)
    	if err != nil {
    		log.Fatal(err)
    	} else {
    		defer response.Body.Close()
    		contents, err := ioutil.ReadAll(response.Body)
    		if err != nil {
    			log.Fatal(err)
    		}
    		fmt.Println("   ", response.StatusCode)
    		fmt.Println(string(contents))
    	}
    }    
    ```

1. Replace the following values:

    * `YOUR-KEY` with your starter key
    * `YOUR-ENDPOINT` with your endpoint, for example, `westus2.api.cognitive.microsoft.com`
    * `YOUR-APP-ID` with your app's ID

1. With a command prompt in the same directory as where you created the file, enter the following command to compile the Go file:

    ```console
    go build model.go
    ```  

1. Run the Go application from the command line by entering the following text in the command prompt: 

    ```console
    go run model.go
    ```

## LUIS keys

[!INCLUDE [Use authoring key for endpoint](../includes/starter-key-explanation.md)]

## Clean up resources

When you are finished with this quickstart, delete the file from the file system. 

## Next steps

> [!div class="nextstepaction"]
> [Best practices for an app](../luis-concept-best-practices.md)