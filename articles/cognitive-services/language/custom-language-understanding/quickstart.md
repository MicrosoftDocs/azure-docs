---
title: Quickstart - create a Custom Language Understanding project using Language Studio
titleSuffix: Azure Cognitive Services
description: Use this article to quickly get started with Custom Language Understanding.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: quickstart
ms.date: 08/19/2021
ms.author: aahi
---

# Quickstart: Create a Custom Language Understanding conversation project

In this article, we use the Language studio to demonstrate key concepts of Custom Language Understanding.

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)

### Create new resource from Azure portal

Go to the [Azure portal](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics) to create a new resource from Azure. If you're asked to select additional features, select **Skip this step**. When you create your resource, ensure it has the following values to call Custom Language Understanding.  

|Requirement  |Required value  |
|---------|---------|
|Location | "West US 2" or "West Europe"         |
|Pricing tier     | Standard (**S**) pricing tier        |

## Create a Custom Language Understanding project

You can create two types of projects in Custom Language Understanding: Conversation projects and Orchestration projects. 

* Conversation projects let you to create custom language models for intent classification and entity extraction.
* Orchestration Workflow projects let you to connect several other services (for example conversation projects, Question Answering knowledge bases) to one project.

In this quickstart, you will be creating a conversation project. 

1. Login through the [Language Studio portal](https://language.azure.com). A window will appear to let you select your subscription and Language Services resource. Select the resource you created in the above step. 

2. Scroll down until you see **Custom Language Understanding** from the available services, and select it.

3. Select **Create new project** from the top menu in your projects page. Creating a project will let you add data, train, evaluate, improve, and deploy your models. 

4. In the **Choose project type** screen, select **Conversation project**.

5. Enter the project information, including a name, description and the language of the files in your project. You will not be able to change the name of your project later. For this quickstart project, don't enable multiple languages.

## Build project a schema 

When you build a project schema, you define the intents and entities that the AI model will interpret and understand. 

TBD

## Tag utterances

TBD

## Train your model

After you have completed tagging your utterances, you can train your model. Training is the act of using the training data that you've tagged to create a machine-learning model that can be used for predictions. Every time you train, you have to name your training instance.

1. Click **Train model** in the left menu.
2. Enter a new model name, and set **Run evaluation with training** to on. After the quickstart, you can see how the model was evaluated and scored.  
3. Click the **Train** button and wait for training to complete. You will see the training status of your model as a Notification.

## Deploy your model

Deploying a model makes it available to test the model from Language Studio, and available to call using the API.

1. Select **Deploy model** from the left menu.
2. A small window will appear to confirm deployment. Select **Deploy**.

## Test your model

Once your model is deployed, you can test it out. Testing allows you to query the model with example text, and get predictions for it.

1. Click **Test model** from the left menu.

2. Entering some text you want to query the model with, and click on **Run the test** to observe the results. 

You can see the top intent in the first card under **Intents**, along with the entities under **Entities** You can also see the original text with the predicted entities under **Original text**. You can also see the JSON response by clicking on the JSON tab.

## Next steps

Read about [creating a schema](how-to/build-schema.md) for your Custom Language Understanding projects.  
<!--After you have trained, deployed, and tested your model, you can view its [evaluation details and scoring](how-to/view-evaluation.md)--> 