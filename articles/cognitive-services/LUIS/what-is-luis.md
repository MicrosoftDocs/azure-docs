---
title: Language Understanding (LUIS) Overview
description: Language Understanding (LUIS) - a cloud-based API service using machine-learning to conversational, natural language to predict meaning and extract information.
keywords: Azure, artificial intelligence, ai, natural language processing, nlp, natural language understanding, nlu, LUIS, conversational AI, ai chatbot, nlp ai, azure luis
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: overview
ms.date: 04/16/2021
ms.custom: cog-serv-seo-aug-2020
---

# What is Language Understanding (LUIS)?

[!INCLUDE [TLS 1.2 enforcement](../../../includes/cognitive-services-tls-announcement.md)]

Language Understanding (LUIS) is a cloud-based conversational AI service that applies custom machine-learning intelligence to a user's conversational, natural language text to predict overall meaning, and pull out relevant, detailed information. LUIS provides access through its [custom portal](https://www.luis.ai), [APIs][endpoint-apis] and [SDK client libraries](client-libraries-rest-api.md).

For first time users, follow these steps to [sign in to LUIS portal](sign-in-luis-portal.md "sign in to LUIS portal")
To get started, you can try a LUIS [prebuilt domain app](luis-get-started-create-app.md).

This documentation contains the following article types:  

* [**Quickstarts**](luis-get-started-create-app.md) are getting-started instructions to guide you through making requests to the service.  
* [**How-to guides**](luis-how-to-start-new-app.md) contain instructions for using the service in more specific or customized ways.  
* [**Concepts**](artificial-intelligence.md) provide in-depth explanations of the service functionality and features.  
* [**Tutorials**](tutorial-intents-only.md) are longer guides that show you how to use the service as a component in broader business solutions.  

## What does LUIS Offer 

* **Simplicity**: LUIS offloads you from the need of in-house AI expertise or any prior machine learning knowledge. With only a few clicks you can build your own conversational AI application. You can build your custom application by following one of our [quickstarts](luis-get-started-create-app.md), or you can use one of our [prebuilt domain](luis-get-started-create-app.md) apps.
* **Security, Privacy and Compliance**: Backed by Azure infrastructure, LUIS offers enterprise-grade security, privacy, and compliance. Your data remains yours; you can delete your data at any time. Your data is encrypted while it’s in storage. Learn more about this [here](https://azure.microsoft.com/support/legal/cognitive-services-compliance-and-privacy).
* **Integration**: easily integrate your LUIS app with other Microsoft services like [Microsoft Bot framework](https://docs.microsoft.com/composer/tutorial/tutorial-luis), [QnA Maker](../QnAMaker/choose-natural-language-processing-service.md), and [Speech service](../Speech-Service/quickstarts/intent-recognition.md).


## LUIS Scenarios
* [Build an enterprise-grade conversational bot](https://docs.microsoft.com/azure/architecture/reference-architectures/ai/conversational-bot): This reference architecture describes how to build an enterprise-grade conversational bot (chatbot) using the Azure Bot Framework.
* [Commerce Chatbot](https://docs.microsoft.com/azure/architecture/solution-ideas/articles/commerce-chatbot): Together, the Azure Bot Service and Language Understanding service enable developers to create conversational interfaces for various scenarios like banking, travel, and entertainment.
* [Controlling IoT devices using a Voice Assistant](https://docs.microsoft.com/azure/architecture/solution-ideas/articles/iot-controlling-devices-with-voice-assistant): Create seamless conversational interfaces with all of your internet-accessible devices-from your connected television or fridge to devices in a connected power plant.


## Application Development life cycle

![LUIS app development life cycle](./media/luis-overview/luis-dev-lifecycle.png "LUIS Application Develooment Lifecycle")

-	**Plan**: Identify the scenarios that users might use your application for. Define the actions and relevant information that needs to be recognized.
-	**Build**: Use your authoring resource to develop your app. Start by defining [intents](luis-concept-intent.md) and [entities](luis-concept-entity-types.md). Then, add training [utterances](luis-concept-utterance.md) for each intent. 
-	**Test and Improve**: Start testing your model with other utterances to get a sense of how the app behaves, and you can decide if any improvement is needed. You can improve your application by following these [best practices](luis-concept-best-practices.md). 
-	**Publish**: Deploy your app for prediction and query the endpoint using your prediction resource. Learn more about authoring and prediction resources [here](luis-how-to-azure-subscription.md#luis-resources). 
-	**Connect**: Connect to other services such as [Microsoft Bot framework](https://docs.microsoft.com/composer/tutorial/tutorial-luis), [QnA Maker](../QnAMaker/choose-natural-language-processing-service.md), and [Speech service](../Speech-Service/quickstarts/intent-recognition.md). 
-	**Refine**: [Review endpoint utterances](luis-concept-review-endpoint-utterances.md) to improve your application with real life examples

Learn more about planning and building your application [here](luis-how-plan-your-app.md).

## Next steps

* [What's new](whats-new.md "What's new") with the service and documentation
* [Build a LUIS app](tutorial-intents-only.md)
* [API reference][endpoint-apis]
* [Best practices](luis-concept-best-practices.md)
* [Developer resources](developer-reference-resource.md "Developer resources") for LUIS.
* [Plan your app](luis-how-plan-your-app.md "Plan your app") with [intents](luis-concept-intent.md "intents") and [entities](luis-concept-entity-types.md "entities").

[bot-framework]: /bot-framework/
[flow]: /connectors/luis/
[authoring-apis]: https://go.microsoft.com/fwlink/?linkid=2092087
[endpoint-apis]: https://go.microsoft.com/fwlink/?linkid=2092356
[qnamaker]: https://qnamaker.ai/
