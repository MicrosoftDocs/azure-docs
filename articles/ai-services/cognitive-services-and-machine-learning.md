---
title: Azure AI services and Machine Learning
titleSuffix: Azure AI services
description: Learn where Azure AI services fits in with other Azure offerings for machine learning.
services: cognitive-services
manager: nitinme
author: aahill
ms.author: aahi
ms.service: cognitive-services
ms.topic: conceptual
ms.date: 10/28/2021
---
# Azure AI services and machine learning

Azure AI services provides machine learning capabilities to solve general problems such as analyzing text for emotional sentiment or analyzing images to recognize objects or faces. You don't need special machine learning or data science knowledge to use these services.

[Azure AI services](./what-are-ai-services.md) is a group of services, each supporting different, generalized prediction capabilities. 

Use Azure AI services when you:

* Can use a generalized solution.
* Access solution from a programming REST API or SDK.

Use other machine-learning solutions when you:

* Need to choose the algorithm and need to train on very specific data.

## What is machine learning?

Machine learning is a concept where you bring together data and an algorithm to solve a specific need. Once the data and algorithm are trained, the output is a model that you can use again with different data. The trained model provides insights based on the new data. 

The process of building a machine learning system requires some knowledge of machine learning or data science.

Machine learning is provided using [Azure Machine Learning (AML) products and services](/azure/architecture/data-guide/technology-choices/data-science-and-machine-learning?context=azure%2fmachine-learning%2fstudio%2fcontext%2fml-context).

## What is an Azure AI service?

An Azure AI service provides part or all of the components in a machine learning solution: data, algorithm, and trained model. These services are meant to require general knowledge about your data without needing experience with machine learning or data science. These services provide both REST API(s) and language-based SDKs. As a result, you need to have programming language knowledge to use the services.

## How are Azure AI services and Azure Machine Learning (AML) similar?

Both have the end-goal of applying artificial intelligence (AI) to enhance business operations, though how each provides this in the respective offerings is different. 

Generally, the audiences are different:

* Azure AI services are for developers without machine-learning experience.
* Azure Machine Learning is tailored for data scientists.

## How are Azure AI services different from machine learning?

Azure AI services provide a trained model for you. This brings data and an algorithm together, available from a REST API(s) or SDK. You can implement this service within minutes, depending on your scenario. An Azure AI service provides answers to general problems such as key phrases in text or item identification in images. 

Machine learning is a process that generally requires a longer period of time to implement successfully. This time is spent on data collection, cleaning, transformation, algorithm selection, model training, and deployment to get to the same level of functionality provided by an Azure AI service. With machine learning, it is possible to provide answers to highly specialized and/or specific problems. Machine learning problems require familiarity with the specific subject matter and data of the problem under consideration, as well as expertise in data science.

## What kind of data do you have?

Azure AI services, as a group of services, can require none, some, or all custom data for the trained model. 

### No additional training data required

Services that provide a fully-trained model can be treated as a _opaque box_. You don't need to know how they work or what data was used to train them. You bring your data to a fully trained model to get a prediction. 

### Some or all training data required

Some services allow you to bring your own data, then train a model. This allows you to extend the model using the Service's data and algorithm with your own data. The output matches your needs. When you bring your own data, you may need to tag the data in a way specific to the service. For example, if you are training a model to identify flowers, you can provide a catalog of flower images along with the location of the flower in each image to train the model. 

A service may _allow_ you to provide data to enhance its own data. A service may _require_ you to provide data. 

### Real-time or near real-time data required

A service may need real-time or near-real time data to build an effective model. These services process significant amounts of model data. 

## Service requirements for the data model

The following data categorizes each service by which kind of data it allows or requires.

|Azure AI service|No training data required|You provide some or all training data|Real-time or near real-time data collection|
|--|--|--|--|
|[Anomaly Detector](./Anomaly-Detector/overview.md)|x|x|x|
|[Content Moderator](./Content-Moderator/overview.md)|x||x|
|[Custom Vision](./custom-vision-service/overview.md)||x||
|[Face](./computer-vision/overview-identity.md)|x|x||
|[Language Understanding (LUIS)](./LUIS/what-is-luis.md)||x||
|[Personalizer](./personalizer/what-is-personalizer.md)<sup>1</sup></sup>|x|x|x|
|[QnA Maker](./QnAMaker/Overview/overview.md)||x||
|[Speaker Recognizer](./speech-service/speaker-recognition-overview.md)||x||
|[Speech Text to speech (TTS)](speech-service/text-to-speech.md)|x|x||
|[Speech Speech to text (STT)](speech-service/speech-to-text.md)|x|x||
|[Speech Translation](speech-service/speech-translation.md)|x|||
|[Language](./language-service/overview.md)|x|||
|[Translator](./translator/translator-overview.md)|x|||
|[Translator - custom translator](./translator/custom-translator/overview.md)||x||
|[Vision](./computer-vision/overview.md)|x|||

<sup>1</sup> Personalizer only needs training data collected by the service (as it operates in real-time) to evaluate your policy and data. Personalizer does not need large historical datasets for up-front or batch training. 

## Where can you use Azure AI services?
 
The services are used in any application that can make REST API(s) or SDK calls. Examples of applications include web sites, bots, virtual or mixed reality, desktop and mobile applications. 

## How can you use Azure AI services?

Each service provides information about your data. You can combine services together to chain solutions such as converting speech (audio) to text, translating the text into many languages, then using the translated languages to get answers from a knowledge base. While Azure AI services can be used to create intelligent solutions on their own, they can also be combined with traditional machine learning projects to supplement models or accelerate the development process. 

Azure AI services that provide exported models for other machine learning tools:

|Azure AI service|Model information|
|--|--|
|[Custom Vision](./custom-vision-service/overview.md)|[Export](./custom-vision-service/export-model-python.md) for Tensorflow for Android, CoreML for iOS11, ONNX for Windows ML|

## Learn more

* [Architecture Guide - What are the machine learning products at Microsoft?](/azure/architecture/data-guide/technology-choices/data-science-and-machine-learning)
* [Machine learning - Introduction to deep learning vs. machine learning](../machine-learning/concept-deep-learning-vs-machine-learning.md)

## Next steps

* Create your Azure AI services resource in the [Azure portal](multi-service-resource.md?pivots=azportal) or with [Azure CLI](./multi-service-resource.md?pivots=azcli).
* Learn how to [authenticate](authentication.md) with your Azure AI service.
* Use [diagnostic logging](diagnostic-logging.md) for issue identification and debugging. 
* Deploy an Azure AI service in a Docker [container](cognitive-services-container-support.md).
* Keep up to date with [service updates](https://azure.microsoft.com/updates/?product=cognitive-services).
