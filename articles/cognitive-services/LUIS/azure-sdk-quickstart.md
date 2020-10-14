---
title: "Quickstart: Language Understanding (LUIS) SDK client libraries"
description: Create and query a LUIS app with the LUIS SDK client libraries with this quickstart using C#, Python, or JavaScript.
ms.topic: quickstart
ms.date: 09/14/2020
ms.service: cognitive-services
ms.subservice: language-understanding
keywords: Azure, artificial intelligence, ai, natural language processing, nlp, LUIS, azure luis, natural language understanding, ai chatbot, chatbot maker,  understanding natural language
ms.custom: "devx-track-python, devx-track-js, devx-track-csharp, cog-serv-seo-aug-2020"
zone_pivot_groups: programming-languages-set-diberry-3core
---
# Quickstart: Language Understanding (LUIS) SDK client libraries to create and query your LUIS app

Create and query an Azure LUIS artificial intelligence (AI) app with the LUIS SDK client libraries with this quickstart using C#, Python, or JavaScript.

Language Understanding (LUIS) enables you to apply natural language processing (NLP) to a user's conversational, natural language text to predict overall meaning, and pull out relevant, detailed information.

* The **authoring SDK** client library allows you to create, edit, train, and publish your LUIS app. * The **prediction runtime SDK** client library allows you to query the published app.

::: zone pivot="programming-language-csharp"
[!INCLUDE [LUIS development with C# SDK](./includes/sdk-csharp.md)]
::: zone-end

::: zone pivot="programming-language-javascript"
[!INCLUDE [LUIS development with Node.js SDK](./includes/sdk-nodejs.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [LUIS development with Python SDK](./includes/sdk-python.md)]
::: zone-end

## Clean up resources

You can delete the app from the [LUIS portal](https://www.luis.ai) and delete the Azure resources from the [Azure portal](https://portal.azure.com/).

## Troubleshooting

* Authenticating to the client library - authentication errors usually indicate that the wrong key & endpoint were used. This quickstart uses the authoring key and endpoint for the prediction runtime, as a convenience but will only work if you haven't already used the monthly quota. If you can't use the authoring key and endpoint, you need to use the prediction runtime key and endpoint when accessing the prediction runtime SDK client library.
* Creating entities - if you get an error creating the nested machine-learning entity used in this tutorial, make sure you copied the code and didn't alter the code to create a different entity.
* Creating example utterances - if you get an error creating the labeled example utterance used in this tutorial, make sure you copied the code and didn't alter the code to create a different labeled example.
* Training - if you get a training error, this usually indicates an empty app (no intents with example utterances), or an app with intents or entities that are malformed.
* Miscellaneous errors - because the code calls into the client libraries with text and JSON objects, make sure you haven't changed the code.

Other errors - if you get an error not covered in the preceding list, let us know by giving feedback at the bottom on this page. Include the programming language and version of the client libraries you installed.

## Next steps

* [What is the Language Understanding (LUIS) API?](what-is-luis.md)
* [What's new?](whats-new.md)
* [Intents](luis-concept-intent.md), [entities](luis-concept-entity-types.md), and [example utterances](luis-concept-utterance.md), and [prebuilt entities](luis-reference-prebuilt-entities.md)
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code).
* Understanding natural language: [natural language understanding (NLU) and natural language processing (NLP)](artificial-intelligence.md)
* Bots: [AI chatbots](luis-csharp-tutorial-bf-v4.md "chatbot maker tutorial")
