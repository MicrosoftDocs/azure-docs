---
title: include file
description: include file
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-understanding
ms.date: 05/28/2020
ms.topic: include
ms.custom: include file
ms.author: diberry
---


Use the Language Understanding (LUIS) prediction client library for Python to:

* Get prediction by slot
* Get prediction by version

[Reference documentation](https://docs.microsoft.com/python/api/azure-cognitiveservices-language-luis/index?view=azure-python) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/cognitiveservices/azure-cognitiveservices-language-luis/azure/cognitiveservices/language/luis) | [Prediction runtime Package (PyPi)](https://pypi.org/project/azure-cognitiveservices-language-luis/) | [ Samples](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/python/LUIS)

## Prerequisites

* Language Understanding (LUIS) portal account - [Create one for free](https://www.luis.ai)
* [Python 3.x](https://www.python.org/)
* A LUIS app ID - use the public IoT app ID of `df67dcdb-c37d-46af-88e1-8b97951ca1c2`. The user query used in the quickstart code is specific to that app.

## Setting up

### Get your Language Understanding (LUIS) runtime key

Get your [runtime key](../luis-how-to-azure-subscription.md) by creating a LUIS runtime resource. Keep your key, and the endpoint of the key for the next step.

[!INCLUDE [Set up environment variables for prediction quickstart](sdk-prediction-environment-variables.md)]

### Create a new python file

Create a new python file in your preferred editor or IDE, named `prediction_quickstart.py`.

### Install the SDK

Within the application directory, install the Language Understanding (LUIS) prediction runtime client library for Python with the following command:

```python
python -m pip install azure-cognitiveservices-language-luis
```

## Object model

The Language Understanding (LUIS) prediction runtime client is a [LUISRuntimeClient](https://docs.microsoft.com/python/api/azure-cognitiveservices-language-luis/azure.cognitiveservices.language.luis.runtime.luisruntimeclient?view=azure-python) object that authenticates to Azure, which contains your resource key.

Once the client is created, use this client to access functionality including:

* Prediction by [staging or production slot](https://docs.microsoft.com/python/api/azure-cognitiveservices-language-luis/azure.cognitiveservices.language.luis.runtime.operations.predictionoperations?view=azure-python#get-slot-prediction-app-id--slot-name--prediction-request--verbose-none--show-all-intents-none--log-none--custom-headers-none--raw-false----operation-config-)
* Prediction by [version](https://docs.microsoft.com/python/api/azure-cognitiveservices-language-luis/azure.cognitiveservices.language.luis.runtime.operations.predictionoperations?view=azure-python#get-version-prediction-app-id--version-id--prediction-request--verbose-none--show-all-intents-none--log-none--custom-headers-none--raw-false----operation-config-)

## Code examples

These code snippets show you how to do the following with the Language Understanding (LUIS) prediction runtime client library for Python:

* [Prediction by slot](#get-prediction-from-runtime)

## Add the dependencies

From the project directory, open the `prediction_quickstart.py` file in your preferred editor or IDE. Add the following dependencies:

[!code-python[Dependency statements](~/cognitive-services-quickstart-code/python/LUIS/python-sdk-authoring-prediction/prediction_quickstart.py?name=Dependencies)]

## Authenticate the client

1. Create variables for your own required LUIS information:

    Add variables to manage your prediction key pulled from an environment variable named `LUIS_RUNTIME_KEY`. If you created the environment variable after the application is launched, the editor, IDE, or shell running it will need to be closed and reloaded to access the variable. The methods will be created later.

    Create a variable to hold your resource name `LUIS_RUNTIME_ENDPOINT`.

    [!code-python[Dependency statements](~/cognitive-services-quickstart-code/python/LUIS/python-sdk-authoring-prediction/prediction_quickstart.py?name=AuthorizationVariables)]

1. Create a variable for the app ID as an environment variable named `LUIS_APP_ID`. Set the environment variable to the public IoT app, **`df67dcdb-c37d-46af-88e1-8b97951ca1c2`** . Create a variable to set the `production` published slot.

    [!code-python[Dependency statements](~/cognitive-services-quickstart-code/python/LUIS/python-sdk-authoring-prediction/prediction_quickstart.py?name=OtherVariables)]


1. Create a credentials object with your key, and use it with your endpoint to create an [LUISRuntimeClientConfiguration]https://docs.microsoft.com/python/api/azure-cognitiveservices-language-luis/azure.cognitiveservices.language.luis.runtime.luisruntimeclientconfiguration?view=azure-python() object.

    [!code-python[Dependency statements](~/cognitive-services-quickstart-code/python/LUIS/python-sdk-authoring-prediction/prediction_quickstart.py?name=Client)]

## Get prediction from runtime

Add the following method to create the request to the prediction runtime.

The user utterance is part of the [prediction_request](https://docs.microsoft.com/python/api/azure-cognitiveservices-language-luis/azure.cognitiveservices.language.luis.runtime.models.predictionrequest?view=azure-python) object.

The **[get_slot_prediction](https://docs.microsoft.com/python/api/azure-cognitiveservices-language-luis/azure.cognitiveservices.language.luis.runtime.operations.predictionoperations?view=azure-python#get-slot-prediction-app-id--slot-name--prediction-request--verbose-none--show-all-intents-none--log-none--custom-headers-none--raw-false----operation-config-)** method needs several parameters such as the app ID, the slot name, and the prediction request object to fulfill the request. The other options such as verbose, show all intents, and log are optional. The request returns a [PredictionResponse](https://docs.microsoft.com/python/api/azure-cognitiveservices-language-luis/azure.cognitiveservices.language.luis.runtime.models.predictionresponse?view=azure-python) object.

[!code-python[Dependency statements](~/cognitive-services-quickstart-code/python/LUIS/python-sdk-authoring-prediction/prediction_quickstart.py?name=predict)]

## Main code for the prediction

Use the following main method to tie the variables and methods together to get the prediction.

```python
predict(luisAppID, luisSlotName)
```
## Run the application

Run the application with the `python prediction_quickstart.py` command from your application directory.

```console
python prediction_quickstart.py
```

The quickstart console displays the output:

```console
Top intent: HomeAutomation.TurnOn
Sentiment: None
Intents:
        "HomeAutomation.TurnOn"
Entities: {'HomeAutomation.Operation': ['on']}
```

## Clean up resources

When you are done with your predictions, clean up the work from this quickstart by deleting the file and its subdirectories.
