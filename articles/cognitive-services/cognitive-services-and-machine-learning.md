---
title: Cognitive services and machine learning
titlesuffix: Azure Cognitive Services
description: Learn where Azure Cognitive Services fits in with other Azure offerings for machine learning.
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.topic: conceptual
ms.date: 07/09/2019
ms.author: diberry
---
# Cognitive Services and machine learning

Cognitive Services provides machine learning to solve general problems such as analyzing text for emotional sentiment or analyzing images to recognize objects or faces. You don't need special machine learning or data science knowledge to use these services. 

## What is machine learning?

Machine learning is a concept where you bring together data and an algorithm to solve a specific need. Once the data and algorithm are trained, the output is a model that you can use again with different data. The trained model provides insights based on the new data. 

The process of building a machine learning system requires some knowledge of machine learning or data science.

Machine learning is provided using [Azure Machine Learning (AML) products and services](https://docs.microsoft.com/azure/architecture/data-guide/technology-choices/data-science-and-machine-learning?context=azure/machine-learning/studio/context/ml-context).

## What is a Cognitive Service?

A Cognitive Service provides part or all of the components in a machine learning solution: data, algorithm, and trained model. The list of services includes: fully trained models, customizable models you can bring your own data to, or completely customizable models. Use the models with your own data. 

These services are meant to require general knowledge about your data without needing experience with machine learning or data science. These services provide both REST API(s) and language-based SDKs. As a result, you need to have programming language knowledge to use the services.

## How is a Cognitive Service different from machine learning?

Cognitive Services provides a trained model for you. This brings data and an algorithm together, available from a REST API(s) or SDK. You can implement this service within minutes, depending on your scenario. Cognitive Services provides answers to general problems such as key phrases in text or item identification in images. 

Machine learning is a process that generally requires a longer period of time to implement successfully. This time is spent on data collection, cleaning, transformation, algorithm selection, model training, and deployment to get to the same level of functionality provided by a Cognitive Service. With machine learning, it is possible to provide answers to any kind of problem including highly specialized or specific problems. These machine learning problems require familiarity with one or more of the following: subject matter, machine learning, data science.

## What kind of data do you have?

Cognitive Services can require no, some, or all custom data for the trained model. 

### No additional training data required

Services that provide a fully-trained model can be treated as a _black box_. You don't need to know how they work or what data was used to train them. You bring your data to a fully trained model to get a prediction. 

### Some or all training data required

Some services allow you to bring your own data, then train a model. This allows you to extend the model using the Service's data and algorithm with your own data. The output matches your needs. When you bring your own data, you may need to tag the data in a way specific to the service. For example, if you are training a model to identify flowers, you can provide a catalog of flower images along with the location of the flower in each image to train the model. 

A service may _allow_ you to provide data to enhance its own data. A service may _require_ you to provide data. 

### Real-time or near real-time data required

A service may need real-time or near-real time data to build an effective model. These services process significant amounts of model data. 

## Service requirements for the data model

The following data categorizes each service by which kind of data it allows or requires.

|Cognitive service|No training data required|You provide some or all training data|Real-time or near real-time data collection|
|--|--|--|--|
|[Anomaly detector](./Anomaly-Detector/overview.md)|x|x|x|
|Bing search services|x|||
|[Computer vision](./Computer-vision/Home.md)||||
|[Content moderator](./Content-Moderator/overview.md)||||
|[Custom vision](./Custom-Vision-Service/home.md)||||
|[Face](./Face/Overview.md)||||
|[Form recognizer](./form-recognizer/overview.md)||x||
|[Immersive reader](./immersive-reader/overview.md)|x|||
|[Ink recognizer](./Ink-recognizer/overview.md)|x|x||
|[Language understanding (LUIS)](./LUIS/what-is-luis.md)||x||
|[Personalizer](./personalizer/what-is-personalizer.md)||x|x|
|[QnA Maker](./QnAMaker/Overview/overview.md)||x||
|[Speaker recognizer](./speaker-recognition/home.md)||x||
|[Speech text-to-speech (TTS)](speech-service/text-to-speech.md)|x|x||
|[Speech speech-to-text (STT)](/speech-service/speech-to-text.md)|x|x||
|[Speech translation](speech-service/speech-translation.md)|x|||
|[Text analytics](./text-analytics/overview.md)|x|||
|[Translator text](./translator/translator-info-overview.md)|x|||
|[Translator text - custom translator]()||x||
|[Video indexer](./video-indexer/video-indexer-overview.md)||||

## Where can you use Cognitive Services?
 
The services are used in any application that can make REST API(s) or SDK calls. Examples of applications include web sites, bots, virtual or mixed reality, desktop and mobile applications. 

## How can you use Cognitive Services?

Each service provides information about your data. You can combine services together to chain solutions such as converting speech (audio) to text, translating the text into many languages, then using the translated languages to get answers from a knowledge base. While Cognitive Services can be used to create intelligent solutions on their own, they can also be combined with traditional machine learning projects to supplement models or accelerate the development process. 
