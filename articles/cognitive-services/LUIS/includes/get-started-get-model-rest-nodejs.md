---
title: Get model with REST call in C#
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
* [Node.js](https://nodejs.org/) programming language 
* [Visual Studio Code](https://code.visualstudio.com/)

## Example utterances JSON file

[!INCLUDE [Quickstart explanation of example utterance JSON file](get-started-get-model-json-example-utterances.md)]


## Get LUIS key

[!INCLUDE [Use authoring key for endpoint](../includes/get-key-quickstart.md)]

## Change model programmatically

Use Go to add a machine-learned entity [API](https://aka.ms/luis-apim-v3-authoring) to the application. 

1. Create a new file named `model.js`. Add the following code:

    ```javascript
    var request = require('request');
    var requestpromise = require('request-promise');
    
    const LUIS_authoringKey = "YOUR-KEY";
    const LUIS_endpoint = "YOUR-ENDPOINT";
    const LUIS_appId = "YOUR-APP-ID";
    const LUIS_versionId = "0.1";
    const addUtterancesURI = `https://${LUIS_endpoint}/luis/authoring/v3.0-preview/apps/${LUIS_appId}/versions/${LUIS_versionId}/examples`;
    const addTrainURI = `https://${LUIS_endpoint}/luis/authoring/v3.0-preview/apps/${LUIS_appId}/versions/${LUIS_versionId}/train`;
    
    const utterances = [
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
    	  ];
    
    const main = async() =>{
    
    
        await addUtterance();
        await train("POST");
        await trainStatus("GET");
    
    }
    const addUtterance = async () => {
    
        const options = {
            uri: addUtterancesURI,
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': LUIS_authoringKey
            },
            json: true,
            body: utterances
        };
    
        const response = await requestpromise(options)
        console.log(response.body);
    }
    const train = async (verb) => {
    
        const options = {
            uri: addTrainURI,
            method: verb, 
            headers: {
                'Ocp-Apim-Subscription-Key': LUIS_authoringKey
            },
            json: true,
            body: null // The body can be empty for a training request
        };
    
        const response = await requestpromise(options)
        console.log(response.body);
    }
    
    // MAIN
    main().then(() => console.log("done")).catch((err)=> console.log(err returned));
    ```
1. Replace the following values:

    * `YOUR-KEY` with your starter key
    * `YOUR-ENDPOINT` with your endpoint, for example, `westus2.api.cognitive.microsoft.com`
    * `YOUR-APP-ID` with your app's ID

1. With a command prompt in the same directory as where you created the file, enter the following command to run the file:

    ```console
    node model.js
    ```  

## LUIS keys

[!INCLUDE [Use authoring key for endpoint](../includes/starter-key-explanation.md)]

## Clean up resources

When you are finished with this quickstart, delete the file from the file system. 

## Next steps

> [!div class="nextstepaction"]
> [Best practices for an app](../luis-concept-best-practices.md)