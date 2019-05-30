---
title: Cognitive services and machine learning
titlesuffix: Azure Cognitive Services
description: Learn where Azure Cognitive Services fit in the Microsoft Machine Learning offerings.
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.topic: conceptual
ms.date: 05/14/2019
ms.author: diberry
---
# Cognitive Services and Machine learning

Cognitive Services provides machine learning to solve general problems such as analyzing text for emotional sentiment or analyzing images to recognize objects or faces. You shouldn't need special machine learning or data science knowledge to use these services. 

## What is machine learning?

Machine learning is a platform where you bring together data and an algorithm to solve a specific need. Once the data and algorithm are trained, the output is a model that you can use again with different data. The trained model provides specific insights based on the new data. 

The process of building a machine learning system requires some knowledge of machine-learning or data-science.

## What is a Cognitive Service?

A Cognitive Service provides part or all of the machine learning: data, algorithm, or trained model. The list of services includes models which are: fully-trained with data, pretrained with data but customizable, or completely customizable models. Use the models with your own data. 

These services are meant to require general data knowledge without having experience with machine-learning or data-science. These services provide both REST and language-based SDKs. As a result, you need to provide programming language knowledge to use the services

## How is a Cognitive Service different from Azure Machine learning?

Cognitive Services provide a trained model for you. This brings data and an algorithm together, available from a REST API or SDK. You can implement this service within minutes or hours depending on your scenario. Cognitive Services provide answers to general problems such as key phrases in text or item identification in images. 

Machine learning is a process that generally requires a longer period of time to implement successfully. This time is spent on data collection, transformation, algorithm selection, model training, and deployment to get to the same level of functionality provided by a Cognitive Service. With machine learning, it is possible to provide answers to any kind of problem including highly specialized or specific problems. These machine-learning problems require one or more of the following: subject matter, machine learning, data science.

## Use a fully-trained model 

Services that provide a fully-trained model can be treated as a _black box_. You don't need to know how they work or what data was used to train them. You bring your data to a fully-trained model to get a prediction. The following table lists some examples of a fully-trained model-based services. 

|Fully-trained service|Your data sent to trained model|Service Output|
|--|--|--|
|Text Analytics - Sentiment analysis|Your own text.|Sentiment value of positive, negative, or neutral.|
|Computer vision|Your image.|Information about what is in the image.|

## Train with your own data 

Some services allow you to bring your own data, then train a model. This allows you to extend the model to train using the Service's data and algorithm with your own data. The output matches your needs. When you bring your own data, you may need to tag the data in a way specific to the service. For example, if you are training a model to identify flowers, you can provide a catalog of flower images along with the location of the flower in each image to train the model. 

The following table lists some examples of this type of service:

|Service|Training data|Your data sent to trained model|Service Output|
|--|--|--|--|
|Custom Vision|Catalog of images with optional tag locations inside each image|New image|Classification of new image.|
|Language Understanding|Catalog of example user utterances tagged with intents and entities|New utterance|Classification of new utterance.|

## Where can you use Cognitive Services?
 
The services are used in any application that can make REST or SDK calls. Examples of applications include web sites, bots, virtual or mixed reality, desktop and mobile applications. 

## How can you use Cognitive Services?

Each service provides information about your data. You can combine services together to chain solutions such as converting speech (audio) to text, translating the text into many languages, then using the translated languages to get answers from a knowledge base. Cognitive Services can also be combined into machine-learning projects. 
