---
title: Conversational language understanding best practices
titleSuffix: Azure AI services
description: Apply best practices when using conversational language understanding
services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: best-practice
ms.date: 09/22/2023
ms.author: aahi
ms.custom: language-service-clu
---

# Best practices for conversational language understanding

Use the following guidelines to create the best possible projects in conversational language understanding.     

## Choose a consistent schema

Schema is the definition of your intents and entities. There are different approaches you could take when defining what you should create as an intent versus an entity. There are some questions you need to ask yourself:

- What actions or queries am I trying to capture from my user?
- What pieces of information are relevant in each action?

You can typically think of actions and queries as _intents_, while the information required to fulfill those queries as _entities_. 

For example, assume you want your customers to cancel subscriptions for various products that you offer through your chatbot. You can create a _Cancel_ intent with various examples like _"Cancel the Contoso service,"_ or _"stop charging me for the Fabrikam subscription."_ The user's intent here is to _cancel,_ the _Contoso service_ or _Fabrikam subscription_ are the subscriptions they would like to cancel. Therefore, you can create an entity for _subscriptions_. You can then model your entire project to capture actions as intents and use entities to fill in those actions. This allows you to cancel anything you define as an entity, such as other products. You can then have intents for signing up, renewing, upgrading, etc. that all make use of the _subscriptions_ and other entities. 

The above schema design makes it easy for you to extend existing capabilities (canceling, upgrading, signing up) to new targets by creating a new entity. 

Another approach is to model the _information_ as intents and _actions_ as entities. Let's take the same example, allowing your customers to cancel subscriptions through your chatbot. You can create an intent for each subscription available, such as _Contoso_ with utterances like _"cancel Contoso,"_ _"stop charging me for contoso services,"_ _"Cancel the Contoso subscription."_ You would then create an entity to capture the action, _cancel._ You can define different entities for each action or consolidate actions as one entity with a list component to differentiate between actions with different keys.

This schema design makes it easy for you to extend new actions to existing targets by adding new action entities or entity components.

Make sure to avoid trying to funnel all the concepts into just intents, for example don't try to create a _Cancel Contoso_ intent that only has the purpose of that one specific action. Intents and entities should work together to capture all the required information from the customer. 

You also want to avoid mixing different schema designs. Do not build half of your application with actions as intents and the other half with information as intents. Ensure it is consistent to get the possible results.

[!INCLUDE [Balance training data](../includes/balance-training-data.md)]

[!INCLUDE [Label data](../includes/label-data-best-practices.md)]

## Use standard training before advanced training

[Standard training](../how-to/train-model.md#training-modes) is free and faster than Advanced training, making it useful to quickly understand the effect of changing your training set or schema while building the model. Once you are satisfied with the schema, consider using advanced training to get the best AIQ out of your model. 

## Use the evaluation feature
 
When you build an app, it's often helpful to catch errors early. It’s usually a good practice to add a test set when building the app, as training and evaluation results are very useful in identifying errors or issues in your schema.

## Machine-learning components and composition

See [Component types](./entity-components.md#component-types).

## Using the "none" score Threshold

If you see too many false positives, such as out-of-context utterances being marked as valid intents, See [confidence threshold](./none-intent.md) for information on how it affects inference.

* Non machine-learned entity components like lists and regex are by definition not contextual. If you see list or regex entities in unintended places, try labeling the list synonyms as the machine-learned component.

* For entities, you can use learned component as the ‘Required’ component, to restrict when a composed entity should fire.

For example, suppose you have an entity called "*ticket quantity*" that attempts to extract the number of tickets you want to reserve for booking flights, for utterances such as "*Book two tickets tomorrow to Cairo.*"


Typically, you would add a prebuilt component for `Quantity.Number` that already extracts all numbers in utterances. However if your entity was only defined with the prebuilt component, it would also extract other numbers as part of the *ticket quantity* entity, such as "*Book two tickets tomorrow to Cairo at 3 PM.*"

To resolve this, you would label a learned component in your training data for all the numbers that are meant to be a *ticket quantity*. The entity now has two components:
* The prebuilt component that can interpret all numbers, and 
* The learned component that predicts where the *ticket quantity* is in a sentence. 

If you require the learned component, make sure that *ticket quantity* is only returned when the learned component predicts it in the right context. If you also require the prebuilt component, you can then guarantee that the returned *ticket quantity* entity is both a number and in the correct position.


## Addressing casing inconsistencies

If you have poor AI quality and determine the casing used in your training data is dissimilar to the testing data, you can use the `normalizeCasing` project setting. This normalizes the casing of utterances when training and testing the model. If you've migrated from LUIS, you might recognize that LUIS did this by default.

```json
{
  "projectFileVersion": "2022-10-01-preview",
    ...
    "settings": {
      "confidenceThreshold": 0.5,
      "normalizeCasing": true
    }
...
```

## Addressing model overconfidence

Customers can use the LoraNorm  recipe version in case the model is being incorrectly overconfident. An example of this can be like the below (note that the model predicts the incorrect intent with 100% confidence). This makes the confidence threshold project setting unusable.

| Text |	Predicted intent |	Confidence score |
|----|----|----|
| "*Who built the Eiffel Tower?*" |	 `Sports` | 1.00 |
| "*Do I look good to you today?*" | `QueryWeather` |	1.00 |
| "*I hope you have a good evening.*" | `Alarm` | 1.00 |

To address this, use the `2023-04-15` configuration version that normalizes confidence scores. The confidence threshold project setting can then be adjusted to achieve the desired result.

```console
curl --location 'https://<your-resource>.cognitiveservices.azure.com/language/authoring/analyze-conversations/projects/<your-project>/:train?api-version=2022-10-01-preview' \
--header 'Ocp-Apim-Subscription-Key: <your subscription key>' \
--header 'Content-Type: application/json' \
--data '{
      "modelLabel": "<modelLabel>",
      "trainingMode": "advanced",
      "trainingConfigVersion": "2023-04-15",
      "evaluationOptions": {
            "kind": "percentage",
            "testingSplitPercentage": 0,
            "trainingSplitPercentage": 100
      }
}
```

Once the request is sent, you can track the progress of the training job in Language Studio as usual.

> [!NOTE]
> You have to retrain your model after updating the `confidenceThreshold` project setting. Afterwards, you'll need to republish the app for the new threshold to take effect.

### Normalization in model version 2023-04-15

Model version 2023-04-15, conversational language understanding provides normalization in the inference layer that doesn't affect training. 

The normalization layer normalizes the classification confidence scores to a confined range. The range selected currently is from [-a,a] where a is the square root of the number of intents.  As a result, the normalization depends on the number of intents in the app. If there is a very low number of intents, the normalization layer has a very small range to work with, vice versa with a fairly large number of intents, the normalization is more effective.

If the LoraNorm recipe doesn’t seem to help the Out of Scope scenario to the extent that the confidenceThreshold can be used to filter out Out of Scope utterances, it might be related to the number of intents in the app. Consider adding on to the app with more intents or if you are using an orchestrated architecture consider merging apps that belong to the same domain together. 

## Debugging composed entities

Entities are functions that emit spans in your input with an associated type. The function is defined by one or more components. You can mark components as needed, and you can decide whether to enable the *combine components* setting. When you combine components, all spans that overlap will be merged into a single span. If the setting isn't used, each individual component span will be emitted.
 
To better understand how individual components are performing, you can disable the setting and set each component to "not required". This lets you inspect the individual spans that are emitted, and experiment with removing components so that only problematic components are generated.

## Evaluate a model using multiple test sets

Data in a conversational language understanding project can have two data sets. A "testing" set, and a "training" set. If you want to use multiple test sets to evaluate your model, you can:

* Give your test sets different names (for example, "test1" and "test2").
* Export your project to get a JSON file with its parameters and configuration.
* Use the JSON to import a new project, and rename your second desired test set to "test".
* Train the model to run the evaluation using your second test set.  

## Custom parameters for target apps and child apps

If you are using [orchestrated apps](./app-architecture.md), you may want to send custom parameter overrides for various child apps. The `targetProjectParameters` field allows users to send a dictionary representing the parameters for each target project. For example, consider an orchestrator app named `Orchestrator` orchestrating between a conversational language understanding app named `CLU1` and a custom question answering app named `CQA1`. If you want to send a parameter named "top" to the question answering app, you can use the above parameter.

```console
curl --request POST \
   --url 'https://<your-language-resource>.cognitiveservices.azure.com/language/:analyze-conversations?api-version=2022-10-01-preview' \
   --header 'ocp-apim-subscription-key: <your subscription key>' \
   --data '{
     "kind": "Conversation",
     "analysisInput": {
         "conversationItem": {
             "id": "1",
             "text": "Turn down the volume",
             "modality": "text",
             "language": "en-us",
             "participantId": "1"
         }
     },
     "parameters": {
         "projectName": "Orchestrator",
         "verbose": true,
         "deploymentName": "std",
         "stringIndexType": "TextElement_V8",
"targetProjectParameters": {
            "CQA1": {
                "targetProjectKind": "QuestionAnswering",
                "callingOptions": {
                    "top": 1
                }
             }
         }
     }
 }'
```

## Copy projects across language resources

Often you can copy conversational language understanding projects from one resource to another using the **copy** button in Azure Language Studio. However in some cases, it might be easier to copy projects using the API.

First, identify the:  
 * source project name 
 * target project name 
 * source language resource 
 * target language resource, which is where you want to copy it to.

Call the API to authorize the copy action, and get the `accessTokens` for the actual copy operation later. 

```console
curl --request POST \ 
  --url 'https://<target-language-resource>.cognitiveservices.azure.com//language/authoring/analyze-conversations/projects/<source-project-name>/:authorize-copy?api-version=2023-04-15-preview' \ 
  --header 'Content-Type: application/json' \ 
  --header 'Ocp-Apim-Subscription-Key: <Your-Subscription-Key>' \ 
  --data '{"projectKind":"Conversation","allowOverwrite":false}' 
```

Call the API to complete the copy operation. Use the response you got earlier as the payload. 

```console
curl --request POST \ 
  --url 'https://<source-language-resource>.cognitiveservices.azure.com/language/authoring/analyze-conversations/projects/<source-project-name>/:copy?api-version=2023-04-15-preview' \ 
  --header 'Content-Type: application/json' \ 
  --header 'Ocp-Apim-Subscription-Key: <Your-Subscription-Key>\ 
  --data '{ 
"projectKind": "Conversation", 
"targetProjectName": "<target-project-name>", 
"accessToken": "<access-token>", 
"expiresAt": "<expiry-date>", 
"targetResourceId": "<target-resource-id>", 
"targetResourceRegion": "<target-region>" 
}'
```
