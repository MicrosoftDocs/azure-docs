---
title: Frequently Asked Questions
titleSuffix: Azure Cognitive Services
description: Use this article to quickly get the answers to FAQ about conversational language understanding
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: quickstart
ms.date: 11/02/2021
ms.author: aahi
---

# Frequently Asked Questions

### How do I create a project?
Follow the [quickstart](./quickstart.md) or follow the [guide](./how-to/create-project.md). 

### How do I connect other service applications in orchestration workflow projects?
Follow the [guide](./how-to/build-schema.md#build-project-schema-for-orchestration-workflow-projects) on how to connect another project as an intent.

### Which LUIS applications can I connect to in orchestration workflow projects?
LUIS applications that use the Language resource as their authoring resource will be available for connection. You can only connect to LUIS applications that are owned by the same resource. This option will only be available for resources in West Europe as it's the only common region between LUIS and CLU. You must publish the  Learn more about region limits [here](./service-limits.md#region-limits). 

### Training is taking a long time, is this expected?
For conversation projects, long training times are expected. Based on the number of examples you have your training times may vary from 5 minutes to 1 hour. 

### Can I add entities in orchestration workflow projects?
No. Orchestration projects are only enabled for intents that can be connected to other projects for routing. 

### How do I use entity components?
Read about entity components [here](./concepts/entity-components.md).

### Which languages are supported in this feature?
Read about our language support [here](./language-support.md).

### How do I get more accurate results for my project?
Follow the recommended guidelines [here](./how-to/build-schema.md#guidelines-and-recommendations).

### How do I get predictions in different languages?
Yes. When you train and deploy a conversation project in any language, you can immediately try querying it with different languages. You may get varied results for different languages. To improve the accuracy of any language, simply add utterances to your project in that language to introduce the trained model to more syntax of that language. Learn more about predicting in multiple languages [here](./concepts/multiple-languages.md)

### How many intents, entities, utterances can I add to a project?
Learn more about service limits [here](./service-limits.md). 

### Can I label the same word as 2 different entities?
Unlike LUIS, you cannot label the same text as 2 different entities. Learned components across different entities are mutually exclusive, and only one learned span is predicted for each set of characters.

### Can I import a LUIS JSON file in conversational language understanding?
Yes, you can import any LUIS application JSON of the latest version in the service. Learn more about this [here](./concepts/backwards-compatibility.md).

### Can I import a LUIS .LU file in conversational language understanding?
No, the service only supports JSON format. You can go to LUIS, import the .LU file and export it as a JSON. 

### Is there any SDK support?
Yes, for predictions. Find the samples [here](https://aka.ms/cluSampleCode). There is currently no authoring support for the SDK.

### Are there APIs for this feature?
Yes, all the APIs are available [here](./https://www.microsoft.com/en-us/).

