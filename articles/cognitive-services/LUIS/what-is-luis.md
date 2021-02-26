---
title: What is Language Understanding (LUIS)?
description: Language Understanding (LUIS) - a cloud-based API service using machine-learning to conversational, natural language to predict meaning and extract information.
keywords: Azure, artificial intelligence, ai, natural language processing, nlp, natural language understanding, nlu, LUIS, conversational AI, ai chatbot, nlp ai, azure luis
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: overview
ms.date: 11/23/2020
ms.custom: cog-serv-seo-aug-2020
---

# What is Language Understanding (LUIS)?

[!INCLUDE [TLS 1.2 enforcement](../../../includes/cognitive-services-tls-announcement.md)]

Language Understanding (LUIS) is a cloud-based conversational AI service that applies custom machine-learning intelligence to a user's conversational, natural language text to predict overall meaning, and pull out relevant, detailed information.

A client application for LUIS is any conversational application that communicates with a user in natural language to complete a task. Examples of client applications include social media apps, AI chatbots, and speech-enabled desktop applications.

![Conceptual image of 3 client applications working with Cognitive Services Language Understanding (LUIS)](./media/luis-overview/luis-entry-point.png "Conceptual image of 3 client applications working with Cognitive Services Language Understanding (LUIS)")

## Use LUIS in a chat bot

<a name="Accessing-LUIS"></a>

Once the Azure LUIS app is published, a client application sends utterances (text) to the LUIS natural language processing endpoint [API][endpoint-apis] and receives the results as JSON responses. A common client application for LUIS is a chat bot.


![Conceptual imagery of LUIS working with Chat bot to predict user text with natural language understanding (NLP)](./media/luis-overview/LUIS-chat-bot-request-response.svg "Conceptual imagery of LUIS working with Chat bot to predict user text with natural language understanding (NLP")

|Step|Action|
|:--|:--|
|1|The client application sends the user _utterance_ (text in their own words), "I want to call my HR rep." to the LUIS endpoint as an HTTP request.|
|2|LUIS enables you to craft your custom language models to add intelligence to your application. Machine learned language models take the user's unstructured input text and returns a JSON-formatted response, with a top intent, `HRContact`. The minimum JSON endpoint response contains the query utterance, and the top scoring intent. It can also extract data such as the _Contact Type_ entity.|
|3|The client application uses the JSON response to make decisions about how to fulfill the user's requests. These decisions can include decision tree in the bot framework code and calls to other services. |

The LUIS app provides intelligence so the client application can make smart choices. LUIS doesn't provide those choices.

<a name="Key-LUIS-concepts"></a>
<a name="what-is-a-luis-model"></a>

## Natural language understanding (NLU)

[LUIS provides artificial intelligence (AI)](artificial-intelligence.md "LUIS provides artificial intelligence (AI)") in the form of NLU, a subset of natural language processing AI.

Your LUIS app contains a domain-specific natural language model. You can start the LUIS app with a prebuilt domain model, build your own model, or blend pieces of a prebuilt domain with your own custom information.

* **Prebuilt model** LUIS has many prebuilt domain models including intents, utterances, and prebuilt entities. You can use the prebuilt entities without having to use the intents and utterances of the prebuilt model. [Prebuilt domain models](./howto-add-prebuilt-models.md "Prebuilt domain models") include the entire design for you and are a great way to start using LUIS quickly.

* **Custom model** LUIS gives you several ways to identify your own custom models including intents, and entities. Entities include machine-learning entities, specific or literal entities, and a combination of machine-learning and literal.

Learn more about [NLP AI](artificial-intelligence.md "NLP"), and the LUIS-specific area of NLU.

## Step 1: Design and build your model

Design your model with categories of user intentions called **[intents](luis-concept-intent.md "intents")**. Each intent needs examples of user **[utterances](luis-concept-utterance.md "utterances")**. Each utterance can provide data that needs to be extracted with [machine-learning entities](luis-concept-entity-types.md#effective-machine-learned-entities "machine-learning entities").

|Example user utterance|Intent|Extracted data|
|-----------|-----------|-----------|
|`Book a flight to Seattle?`|BookFlight|Seattle|
|`When does your store open?`|StoreHoursAndLocation|open|
|`Schedule a meeting at 1pm with Bob in Distribution`|ScheduleMeeting|1pm, Bob|

Build the model with the [authoring](https://go.microsoft.com/fwlink/?linkid=2092087 "authoring") APIs, or with the **[LUIS portal](https://www.luis.ai "LUIS portal")**, or both. Learn more how to build with the [portal](get-started-portal-build-app.md "portal") and the [SDK client libraries](./client-libraries-rest-api.md?pivots=rest-api "SDK client libraries").

## Step 2: Get the query prediction

After your app's model is trained and published to the endpoint, a client application (such as a chat bot) sends utterances to the prediction [endpoint](https://go.microsoft.com/fwlink/?linkid=2092356 "endpoint") API. The API applies the model to the utterance for analysis and responds with the prediction results in a JSON format.

The minimum JSON endpoint response contains the query utterance, and the top scoring intent. It can also extract data such as the following **Contact Type** entity and overall sentiment.

```JSON
{
    "query": "I want to call my HR rep",
    "prediction": {
        "topIntent": "HRContact",
        "intents": {
            "HRContact": {
                "score": 0.8582669
            }
        },
        "entities": {
            "Contact Type": [
                "call"
            ]
        },
        "sentiment": {
            "label": "neutral",
            "score": 0.5
        }
    }
}
```

## Step 3: Improve model prediction

After your LUIS app is published and receives real user utterances, LUIS provides [active learning](luis-concept-review-endpoint-utterances.md "active learning") of endpoint utterances to improve prediction accuracy. Review these suggestions as part of your regular maintenance work in your development lifecycle.

<a name="using-luis"></a>

## Development lifecycle and tools
LUIS provides tools, versioning, and collaboration with other LUIS authors to integrate into the full [development life cycle](luis-concept-app-iteration.md "development life cycle").

Language Understanding (LUIS), as a REST API, can be used with any product, service, or framework with an HTTP request. LUIS also provides client libraries (SDKs) for several top programming languages. Learn more about the [developer resources](developer-reference-resource.md "developer resources") provided.

Tools to quickly and easily use LUIS with a bot:
* [LUIS CLI](https://github.com/Microsoft/botbuilder-tools/tree/master/packages/LUIS "LUIS CLI") The NPM package provides authoring and prediction with as either a stand-alone command-line tool or as import.
* [LUISGen](https://github.com/Microsoft/botbuilder-tools/tree/master/packages/LUISGen "LUISGen") LUISGen is a tool for generating strongly typed C# and typescript source code from an exported LUIS model.
* [Dispatch](https://aka.ms/dispatch-tool "Dispatch") allows several LUIS and QnA Maker apps to be used from a parent app using dispatcher model.
* [LUDown](https://github.com/Microsoft/botbuilder-tools/tree/master/packages/Ludown "LUDown") LUDown is a command-line tool that helps manage language models for your bot.

## Integrate with a bot

Use the [Azure Bot service](/azure/bot-service/ "Azure Bot service") with the [Microsoft Bot Framework](https://dev.botframework.com/ "Microsoft Bot Framework") to build and deploy a chat bot. Design and develop with the graphical interface tool, [Composer](/composer/ "Composer"), or [working bot samples](https://github.com/microsoft/BotBuilder-Samples "working bot samples") designed for top bot scenarios.

## Integrate with other Cognitive Services

Other Cognitive Services used with LUIS:
* [QnA Maker](../QnAMaker/overview/overview.md "QnA Maker") allows several types of text to combine into a question and answer knowledge base.
* [Speech service](../Speech-Service/overview.md "Speech service") converts spoken language requests into text.

LUIS provides functionality from Text Analytics as part of your existing LUIS resources. This functionality includes [sentiment analysis](luis-how-to-publish-app.md#configuring-publish-settings "sentiment analysis") and [key phrase extraction](luis-reference-prebuilt-keyphrase.md "key phrase extraction") with the prebuilt keyPhrase entity.

## Learn with the Quickstarts

Learn about LUIS with hands-on quickstarts using the [portal](get-started-portal-build-app.md "portal") and the [SDK client libraries](./client-libraries-rest-api.md?pivots=rest-api "SDK client libraries").


## Deploy on premises using Docker containers

[Use LUIS containers](luis-container-howto.md) to deploy API features on-premises. These Docker containers enable you to bring the service closer to your data for compliance, security or other operational reasons.

## Next steps

* [What's new](whats-new.md "What's new") with the service and documentation
* [Plan your app](luis-how-plan-your-app.md "Plan your app") with [intents](luis-concept-intent.md "intents") and [entities](luis-concept-entity-types.md "entities").
* [Query the prediction endpoint](luis-get-started-get-intent-from-browser.md "Query the prediction endpoint").
* [Developer resources](developer-reference-resource.md "Developer resources") for LUIS.

[bot-framework]: /bot-framework/
[flow]: /connectors/luis/
[authoring-apis]: https://go.microsoft.com/fwlink/?linkid=2092087
[endpoint-apis]: https://go.microsoft.com/fwlink/?linkid=2092356
[qnamaker]: https://qnamaker.ai/