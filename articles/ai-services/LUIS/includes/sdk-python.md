---
title: include file
description: include file
#services: cognitive-services

manager: nitinme
ms.service: azure-ai-language
ms.subservice: azure-ai-luis
ms.date: 03/07/2022
ms.topic: include
ms.custom: include file, cog-serv-seo-aug-2020

---
Use the Language Understanding (LUIS) client libraries for Python to:

* Create an app
* Add an intent, a machine-learned entity, with an example utterance
* Train and publish app
* Query prediction runtime

[Reference documentation](/python/api/azure-cognitiveservices-language-luis/index) | [Authoring](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/cognitiveservices/azure-cognitiveservices-language-luis/azure/cognitiveservices/language/luis/authoring) and [Prediction](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/cognitiveservices/azure-cognitiveservices-language-luis/azure/cognitiveservices/language/luis/runtime)  Library source code | [Package (Pypi)](https://pypi.org/project/azure-cognitiveservices-language-luis/) | [Samples](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/LUIS/sdk-3x/authoring_and_predict.py)

## Prerequisites

* The current version of [Python 3.x](https://www.python.org/).
* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* Once you have your Azure subscription, [create a Language Understanding authoring resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesLUISAllInOne) in the Azure portal to get your key and endpoint. Wait for it to deploy and click the **Go to resource** button.
    * You will need the key and endpoint from the resource you [create](../luis-how-to-azure-subscription.md) to connect your application to Language Understanding authoring. You'll paste your key and endpoint into the code below later in the quickstart. You can use the free pricing tier (`F0`) to try the service.

## Setting up

### Create a new Python application

1. In a console window create a new directory for your application and move into that directory.

    ```console
    mkdir quickstart-sdk && cd quickstart-sdk
    ```

1. Create a file named `authoring_and_predict.py` for your Python code.

    ```console
    touch authoring_and_predict.py
    ```

### Install the client library with Pip

Within the application directory, install the Language Understanding (LUIS) client library for Python with the following command:

```console
pip install azure-cognitiveservices-language-luis
```

## Authoring Object model

The Language Understanding (LUIS) authoring client is a [LUISAuthoringClient](/python/api/azure-cognitiveservices-language-luis/azure.cognitiveservices.language.luis.authoring.luisauthoringclient) object that authenticates to Azure, which contains your authoring key.

## Code examples for authoring

Once the client is created, use this client to access functionality including:

* Apps - [create](/python/api/azure-cognitiveservices-language-luis/azure.cognitiveservices.language.luis.authoring.operations.appsoperations#add-application-create-object--custom-headers-none--raw-false----operation-config-), [delete](/python/api/azure-cognitiveservices-language-luis/azure.cognitiveservices.language.luis.authoring.operations.appsoperations#delete-app-id--force-false--custom-headers-none--raw-false----operation-config-), [publish](/python/api/azure-cognitiveservices-language-luis/azure.cognitiveservices.language.luis.authoring.operations.appsoperations#publish-app-id--version-id-none--is-staging-false--custom-headers-none--raw-false----operation-config-)
* Example utterances - [add by batch](/python/api/azure-cognitiveservices-language-luis/azure.cognitiveservices.language.luis.authoring.operations.examplesoperations#batch-app-id--version-id--example-label-object-array--custom-headers-none--raw-false----operation-config-), [delete by ID](/python/api/azure-cognitiveservices-language-luis/azure.cognitiveservices.language.luis.authoring.operations.examplesoperations#delete-app-id--version-id--example-id--custom-headers-none--raw-false----operation-config-)
* Features - manage [phrase lists](/python/api/azure-cognitiveservices-language-luis/azure.cognitiveservices.language.luis.authoring.operations.featuresoperations#add-phrase-list-app-id--version-id--phraselist-create-object--custom-headers-none--raw-false----operation-config-)
* Model - manage [intents](/python/api/azure-cognitiveservices-language-luis/azure.cognitiveservices.language.luis.authoring.operations.modeloperations#add-intent-app-id--version-id--name-none--custom-headers-none--raw-false----operation-config-) and entities
* Pattern - manage [patterns](/python/api/azure-cognitiveservices-language-luis/azure.cognitiveservices.language.luis.authoring.operations.patternoperations#add-pattern-app-id--version-id--pattern-none--intent-none--custom-headers-none--raw-false----operation-config-)
* Train - [train](/python/api/azure-cognitiveservices-language-luis/azure.cognitiveservices.language.luis.authoring.operations.trainoperations#train-version-app-id--version-id--custom-headers-none--raw-false----operation-config-) the app and poll for [training status](/python/api/azure-cognitiveservices-language-luis/azure.cognitiveservices.language.luis.authoring.operations.trainoperations#get-status-app-id--version-id--custom-headers-none--raw-false----operation-config-)
* [Versions](/python/api/azure-cognitiveservices-language-luis/azure.cognitiveservices.language.luis.authoring.operations.versionsoperations) - manage with clone, export, and delete


## Prediction Object model

The Language Understanding (LUIS) prediction runtime client is a [LUISRuntimeClient](/python/api/azure-cognitiveservices-language-luis/azure.cognitiveservices.language.luis.runtime.luisruntimeclient) object that authenticates to Azure, which contains your resource key.

## Code examples for prediction runtime

Once the client is created, use this client to access functionality including:

* Prediction by [staging or production slot](/python/api/azure-cognitiveservices-language-luis/azure.cognitiveservices.language.luis.runtime.operations.predictionoperations#get-slot-prediction-app-id--slot-name--prediction-request--verbose-none--show-all-intents-none--log-none--custom-headers-none--raw-false----operation-config-)
* Prediction by [version](/python/api/azure-cognitiveservices-language-luis/azure.cognitiveservices.language.luis.runtime.operations.predictionoperations#get-version-prediction-app-id--version-id--prediction-request--verbose-none--show-all-intents-none--log-none--custom-headers-none--raw-false----operation-config-)

[!INCLUDE [Bookmark links to same article](sdk-code-examples.md)]

## Add the dependencies

Add the client libraries to the Python file.

[!code-python[Add Python libraries to code file](~/cognitive-services-quickstart-code/python/LUIS/sdk-3x/authoring_and_predict.py?name=Dependencies)]


## Add boilerplate code

1. Add the `quickstart` method and its call. This method holds most of the remaining code. This method is called at the end of the file.

    ```python
    def quickstart():

        # add calls here, remember to indent properly

    quickstart()
    ```

1. Add the remaining code in the quickstart method unless otherwise specified.

## Create variables for the app

Create two sets of variables: the first set you change, the second set leave as they appear in the code sample. 

[!INCLUDE [Remember to remove credentials when you're done](app-secrets.md)]

1. Create variables to hold your authoring key and resource names.

    [!code-python[Variables you need to change](~/cognitive-services-quickstart-code/python/LUIS/sdk-3x/authoring_and_predict.py?name=VariablesYouChange)]

1. Create variables to hold your endpoints, app name, version, and intent name.
    
    [!code-python[Variables you don't need to change](~/cognitive-services-quickstart-code/python/LUIS/sdk-3x/authoring_and_predict.py?name=VariablesYouDontNeedToChangeChange)]

## Authenticate the client

Create an [CognitiveServicesCredentials](/python/api/msrest/msrest.authentication.cognitiveservicescredentials) object with your key, and use it with your endpoint to create an [LUISAuthoringClient](/python/api/azure-cognitiveservices-language-luis/azure.cognitiveservices.language.luis.authoring.luisauthoringclient) object.

[!code-python[Authenticate the client](~/cognitive-services-quickstart-code/python/LUIS/sdk-3x/authoring_and_predict.py?name=AuthoringCreateClient)]

## Create a LUIS app

A LUIS app contains the natural language processing (NLP) model including intents, entities, and example utterances.

Create a [AppsOperation](/python/api/azure-cognitiveservices-language-luis/azure.cognitiveservices.language.luis.authoring.operations.appsoperations) object's [add](/python/api/azure-cognitiveservices-language-luis/azure.cognitiveservices.language.luis.authoring.operations.appsoperations#add-application-create-object--custom-headers-none--raw-false----operation-config-) method to create the app. The name and language culture are required properties.

[!code-python[Create a LUIS app](~/cognitive-services-quickstart-code/python/LUIS/sdk-3x/authoring_and_predict.py?name=AuthoringCreateApplication)]


## Create intent for the app
The primary object in a LUIS app's model is the intent. The intent aligns's with a grouping of user utterance _intentions_. A user may ask a question, or make a statement looking for a particular _intended_ response from a bot (or other client application). Examples of intentions are booking a flight, asking about weather in a destination city, and asking about contact information for customer service.

Use the [model.add_intent](/python/api/azure-cognitiveservices-language-luis/azure.cognitiveservices.language.luis.authoring.operations.modeloperations#add-intent-app-id--version-id--name-none--custom-headers-none--raw-false----operation-config-) method with the name of the unique intent then pass the app ID, version ID, and new intent name.

The `intentName` value is hard-coded to `OrderPizzaIntent` as part of the variables in the [Create variables for the app](#create-variables-for-the-app) section.

[!code-python[Create intent for the app](~/cognitive-services-quickstart-code/python/LUIS/sdk-3x/authoring_and_predict.py?name=AddIntent)]

## Create entities for the app

While entities are not required, they are found in most apps. The entity extracts information from the user utterance, necessary to fullfil the user's intention. There are several types of [prebuilt](/python/api/azure-cognitiveservices-language-luis/azure.cognitiveservices.language.luis.authoring.operations.modeloperations#add-prebuilt-app-id--version-id--prebuilt-extractor-names--custom-headers-none--raw-false----operation-config-) and custom entities, each with their own data transformation object (DTO) models.  Common prebuilt entities to add to your app include [number](../luis-reference-prebuilt-number.md), [datetimeV2](../luis-reference-prebuilt-datetimev2.md), [geographyV2](../luis-reference-prebuilt-geographyv2.md), [ordinal](../luis-reference-prebuilt-ordinal.md).

It is important to know that entities are not marked with an intent. They can and usually do apply to many intents. Only example user utterances are marked for a specific, single intent.

Creation methods for entities are part of the [ModelOperations](/python/api/azure-cognitiveservices-language-luis/azure.cognitiveservices.language.luis.authoring.operations.modeloperations) class. Each entity type has its own data transformation object (DTO) model.

The entity creation code creates a machine-learning entity with subentities and features applied to the `Quantity` subentities.

:::image type="content" source="../media/quickstart-sdk/machine-learned-entity.png" alt-text="Partial screenshot from portal showing the entity created, a machine-learning entity with subentities and features applied to the `Quantity` subentities.":::

[!code-python[Create entities for the app](~/cognitive-services-quickstart-code/python/LUIS/sdk-3x/authoring_and_predict.py?name=AuthoringAddEntities)]

Put the following method above the `quickstart` method to find the Quantity subentity's ID, in order to assign the features to that subentity.

[!code-python[Find subentity id](~/cognitive-services-quickstart-code/python/LUIS/sdk-3x/authoring_and_predict.py?name=AuthoringSortModelObject)]

## Add example utterance to intent

In order to determine an utterance's intention and extract entities, the app needs examples of utterances. The examples need to target a specific, single intent and should mark all custom entities. Prebuilt entities do not need to be marked.

Add example utterances by creating a list of [ExampleLabelObject](/python/api/azure-cognitiveservices-language-luis/azure.cognitiveservices.language.luis.authoring.models.examplelabelobject) objects, one object for each example utterance. Each example should mark all entities with a dictionary of name/value pairs of entity name and entity value. The entity value should be exactly as it appears in the text of the example utterance.

:::image type="content" source="../media/quickstart-sdk/labeled-example-machine-learned-entity.png" alt-text="Partial screenshot showing the labeled example utterance in the portal. ":::

Call [examples.add](/python/api/azure-cognitiveservices-language-luis/azure.cognitiveservices.language.luis.authoring.operations.examplesoperations) with the app ID, version ID, and the example.

[!code-python[Add example utterance to intent](~/cognitive-services-quickstart-code/python/LUIS/sdk-3x/authoring_and_predict.py?name=AuthoringAddLabeledExamples)]

## Train the app

Once the model is created, the LUIS app needs to be trained for this version of the model. A trained model can be used in a [container](../luis-container-howto.md), or [published](../how-to/publish.md) to the staging or product slots.

The [train.train_version](/python/api/azure-cognitiveservices-language-luis/azure.cognitiveservices.language.luis.authoring.operations.trainoperations#train-version-app-id--version-id--custom-headers-none--raw-false----operation-config-) method needs the app ID and the version ID.

A very small model, such as this quickstart shows, will train very quickly. For production-level applications, training the app should include a polling call to the [get_status](/python/api/azure-cognitiveservices-language-luis/azure.cognitiveservices.language.luis.authoring.operations.trainoperations#get-status-app-id--version-id--custom-headers-none--raw-false----operation-config-) method to determine when or if the training succeeded. The response is a list of [ModelTrainingInfo](/python/api/azure-cognitiveservices-language-luis/azure.cognitiveservices.language.luis.authoring.models.modeltraininginfo) objects with a separate status for each object. All objects must be successful for the training to be considered complete.

[!code-python[Train the app](~/cognitive-services-quickstart-code/python/LUIS/sdk-3x/authoring_and_predict.py?name=TrainAppVersion)]

## Publish app to production slot

Publish the LUIS app using the [app.publish](/python/api/azure-cognitiveservices-language-luis/azure.cognitiveservices.language.luis.authoring.operations.appsoperations#publish-app-id--version-id-none--is-staging-false--custom-headers-none--raw-false----operation-config-) method. This publishes the current trained version to the specified slot at the endpoint. Your client application uses this endpoint to send user utterances for prediction of intent and entity extraction.

[!code-python[Publish app to production slot](~/cognitive-services-quickstart-code/python/LUIS/sdk-3x/authoring_and_predict.py?name=PublishVersion)]

## Authenticate the prediction runtime client

Use the credentials object with your key, and use it with your endpoint to create an [LUISRuntimeClientConfiguration](/python/api/azure-cognitiveservices-language-luis/azure.cognitiveservices.language.luis.runtime.luisruntimeclientconfiguration) object.

[!INCLUDE [Caution about using authoring key](caution-authoring-key.md)]

[!code-python[Authenticate the prediction runtime client](~/cognitive-services-quickstart-code/python/LUIS/sdk-3x/authoring_and_predict.py?name=PredictionCreateClient)]

## Get prediction from runtime

Add the following code to create the request to the prediction runtime.

The user utterance is part of the [prediction_request](/python/api/azure-cognitiveservices-language-luis/azure.cognitiveservices.language.luis.runtime.models.predictionrequest) object.

The **[get_slot_prediction](/python/api/azure-cognitiveservices-language-luis/azure.cognitiveservices.language.luis.runtime.operations.predictionoperations#get-slot-prediction-app-id--slot-name--prediction-request--verbose-none--show-all-intents-none--log-none--custom-headers-none--raw-false----operation-config-)** method needs several parameters such as the app ID, the slot name, and the prediction request object to fulfill the request. The other options such as verbose, show all intents, and log are optional. The request returns a [PredictionResponse](/python/api/azure-cognitiveservices-language-luis/azure.cognitiveservices.language.luis.runtime.models.predictionresponse) object.

[!code-python[Get prediction from runtime](~/cognitive-services-quickstart-code/python/LUIS/sdk-3x/authoring_and_predict.py?name=QueryPredictionEndpoint)]

[!INCLUDE [Prediction JSON response](sdk-json.md)]

## Run the application

Run the application with the `python` command on your quickstart file.

```console
python authoring_and_predict.py
```
