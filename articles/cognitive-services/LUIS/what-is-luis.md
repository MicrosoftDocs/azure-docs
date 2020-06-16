---
title: What is Language Understanding (LUIS)?
description: Language Understanding (LUIS) is a cloud-based API service that applies custom machine-learning intelligence to a user's conversational, natural language text to predict overall meaning, and pull out relevant, detailed information.
ms.topic: overview
ms.date: 05/05/2020
---

# What is Language Understanding (LUIS)?

[!INCLUDE [TLS 1.2 enforcement](../../../includes/cognitive-services-tls-announcement.md)]

Language Understanding (LUIS) is a cloud-based API service that applies custom machine-learning intelligence to a user's conversational, natural language text to predict overall meaning, and pull out relevant, detailed information.

A client application for LUIS is any conversational application that communicates with a user in natural language to complete a task. Examples of client applications include social media apps, chat bots, and speech-enabled desktop applications.

![Conceptual image of 3 client applications working with Cognitive Services Language Understanding (LUIS)](./media/luis-overview/luis-entry-point.png "Conceptual image of 3 client applications working with Cognitive Services Language Understanding (LUIS)")

## Use LUIS in a chat bot

<a name="Accessing-LUIS"></a>

Once the LUIS app is published, a client application sends utterances (text) to the LUIS natural language processing endpoint [API][endpoint-apis] and receives the results as JSON responses. A common client application for LUIS is a chat bot.


![Conceptual imagery of LUIS working with Chat bot to predict user text with natural language understanding (NLP)](./media/luis-overview/LUIS-chat-bot-request-response.svg "Conceptual imagery of LUIS working with Chat bot to predict user text with natural language understanding (NLP")

|Step|Action|
|:--|:--|
|1|The client application sends the user _utterance_ (text in their own words), "I want to call my HR rep." to the LUIS endpoint as an HTTP request.|
|2|LUIS enables you to craft your custom language models to add intelligence to your application. Machine learned language models take the user's unstructured input text and returns a JSON-formatted response, with a top intent, `HRContact`. The minimum JSON endpoint response contains the query utterance, and the top scoring intent. It can also extract data such as the _Contact Type_ entity.|
|3|The client application uses the JSON response to make decisions about how to fulfill the user's requests. These decisions can include decision tree in the bot framework code and calls to other services. |

The LUIS app provides intelligence so the client application can make smart choices. LUIS doesn't provide those choices.

<a name="Key-LUIS-concepts"></a>
<a name="what-is-a-luis-model"></a>

## Natural language processing

Your LUIS app contains a domain-specific natural language model. You can start the LUIS app with a prebuilt domain model, build your own model, or blend pieces of a prebuilt domain with your own custom information.

* **Prebuilt model** LUIS has many prebuilt domain models including intents, utterances, and prebuilt entities. You can use the prebuilt entities without having to use the intents and utterances of the prebuilt model. [Prebuilt domain models](luis-how-to-use-prebuilt-domains.md) include the entire design for you and are a great way to start using LUIS quickly.

* **Custom model** LUIS gives you several ways to identify your own custom models including intents, and entities. Entities include machine-learning entities, specific or literal entities, and a combination of machine-learning and literal.

## Build the LUIS model
Build the model with the [authoring](https://go.microsoft.com/fwlink/?linkid=2092087) APIs or with the [LUIS portal](https://www.luis.ai).

The LUIS model begins with categories of user intentions called **[intents](luis-concept-intent.md)**. Each intent needs examples of user **[utterances](luis-concept-utterance.md)**. Each utterance can provide data that needs to be extracted.

|Example user utterance|Intent|Extracted data|
|-----------|-----------|-----------|
|`Book a flight to Seattle?`|BookFlight|Seattle|
|`When does your store open?`|StoreHoursAndLocation|open|
|`Schedule a meeting at 1pm with Bob in Distribution`|ScheduleMeeting|1pm, Bob|

## Query prediction endpoint

After your app is trained and published to the endpoint, the client application sends utterances to the prediction [endpoint](https://go.microsoft.com/fwlink/?linkid=2092356) API. The API applies the app to the utterance for analysis and responds with the prediction results in a JSON format.

The minimum JSON endpoint response contains the query utterance, and the top scoring intent. It can also extract data such as the following **Contact Type** entity and overall sentiment.

```JSON
{
    "query": "I want to call my HR rep",
    "prediction": {
        "normalizedQuery": "i want to call my hr rep",
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
            "label": "negative",
            "score": 0.103343368
        }
    }
}
```

## Improve model prediction

After your LUIS app is published and receives real user utterances, LUIS provides [active learning](luis-concept-review-endpoint-utterances.md) of endpoint utterances to improve prediction accuracy.

<a name="using-luis"></a>

## Development lifecycle
LUIS provides tools, versioning, and collaboration with other LUIS authors to integrate into the full [development life cycle](luis-concept-app-iteration.md).

## Implementing LUIS
Language Understanding (LUIS), as a REST API, can be used with any product, service, or framework with an HTTP request. The following list contains the top Microsoft products and services used with LUIS.

The top client application for LUIS is:
* [Web app bot](https://docs.microsoft.com/azure/bot-service/?view=azure-bot-service-4.0) quickly creates a LUIS-enabled chat bot to talk with a user via text input. Uses [Bot Framework][bot-framework] version [4.x](https://github.com/Microsoft/botbuilder-dotnet) for a complete bot experience.

Tools to quickly and easily use LUIS with a bot:
* [LUIS CLI](https://github.com/Microsoft/botbuilder-tools/tree/master/packages/LUIS) The NPM package provides authoring and prediction with as either a stand-alone command-line tool or as import.
* [LUISGen](https://github.com/Microsoft/botbuilder-tools/tree/master/packages/LUISGen) LUISGen is a tool for generating strongly typed C# and typescript source code from an exported LUIS model.
* [Dispatch](https://aka.ms/dispatch-tool) allows several LUIS and QnA Maker apps to be used from a parent app using dispatcher model.
* [LUDown](https://github.com/Microsoft/botbuilder-tools/tree/master/packages/Ludown) LUDown is a command-line tool that helps manage language models for your bot.
* [Bot framework - Composer](https://github.com/microsoft/BotFramework-Composer) - an integrated development tool for developers and multi-disciplinary teams to build bots and conversational experiences with the Microsoft Bot Framework

Other Cognitive Services used with LUIS:
* [QnA Maker][qnamaker] allows several types of text to combine into a question and answer knowledge base.
* [Speech service](../Speech-Service/overview.md) converts spoken language requests into text.
* [Conversation learner](https://docs.microsoft.com/azure/cognitive-services/labs/conversation-learner/overview) allows you to build bot conversations quicker with LUIS.

Samples using LUIS:
* [Conversational AI](https://github.com/Microsoft/AI) GitHub repository.
* [Bot framework - Bot samples](https://github.com/microsoft/BotBuilder-Samples)

## Next steps

* [What's new](whats-new.md)
* Author a new LUIS app with a [prebuilt](luis-get-started-create-app.md) or [custom](luis-quickstart-intents-only.md) domain.
* [Query the prediction endpoint](luis-get-started-get-intent-from-browser.md) of a public IoT app.
* [Developer resources](developer-reference-resource.md) for LUIS.

[bot-framework]: https://docs.microsoft.com/bot-framework/
[flow]: https://docs.microsoft.com/connectors/luis/
[authoring-apis]: https://go.microsoft.com/fwlink/?linkid=2092087
[endpoint-apis]: https://go.microsoft.com/fwlink/?linkid=2092356
[qnamaker]: https://qnamaker.ai/
