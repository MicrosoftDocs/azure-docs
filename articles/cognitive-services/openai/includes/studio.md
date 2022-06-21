---
title: 'Quickstart: Use the OpenAI Service via the Azure OpenAI Studio'
titleSuffix: Azure OpenAI
description: Walkthrough on how to get started with Azure OpenAI and make your first completions and search calls with Azure OpenAI Studio. 
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.topic: include
ms.date: 06/24/2022
keywords: 
---

## Prerequisites

- An Azure subscription
- Access granted to service in the desired azure subscription. This service is currently invite only. You can fill out a new use case request here: <https://aka.ms/oai/access>.
- An Azure OpenAI Service resource deployed

## Go to the Azure OpenAI Studio

Navigate to the Azure OpenAI Studio: <https://oai.azure.com/> and log in with credentials that have acces to the OpenAI resource you have created. During the login workflow, select the appropirate Directory, Azure Subscription and OpenAI resource. 

## Landing page

You will first land on our main page for the Azure OpenAI Studio and from here you can navigate to several different features highlighted in the picture below.

![Screenshot of the landing page of the Azure OpenAI Studio with sections highlighted](../images/StudioLandingpage.jpg)

1. Resources with out a deployment will be prompted to create one. This is required to be able to inference with your models
1. Get started with a few simple exmaples that demonstrate teh capabilities of the service
1. Navigate to diffrent parts of the Studio including the **Playground** for experiementation and our fine-tuning workflow
1. Find quick links to other helpful resources like documentation and community forums

From here, click on 'create new deployment' button in the banner at the top. If you don't see this, you alraedy have a deployment and can proceed to the 'playground' step

## Deployments
Before you can generate text or inference you need to deploy a model. This is done by clicking the 'create new deployment' on the deployments page. From here you can select from one of our many available models. For getting started we recommend `text-davinci-002` for users in South Central and `text-davinci-001` for users in West Europe (text-davinci-002 is not available in this region). 

Once this is complete, click on the 'Playground' button on the left nav to start experimenting. 

## Playground

The best way to start exploring completions is through our Playground. It's simply a text box where you can submit a prompt to generate a completion. From this page you can easily iterate and experiment with the capabilties. The following is an overview of the features available to you on this page:

![Screenshot of the playground page of the Azure OpenAI Studio with sections highlighted](../images/StudioPlayground.jpg)

1. Choose from a few pre-loaded examples to get started
1. Select a deployment to use
1. Enter the text you want to send to the completions API here. Generations will also be appended to this text. 
1. Clicking the Generate button will send the entered text to the completions API and stream the results back to the text box.
1. Click the 'undo' button to undo the prior generation call
1. Click the 'regenerate' button to do an undo & generation call together. 
1. View the code you could use to make the same call with our python SDK, curl or other REST API client
1. Configure the paratmers of the completions call to imporove the performance of your task. You can read more about each parameter in our [REST API](../Reference/RESTAPI.md). 

Now that you have familiarized yourself with the playground, get started generating text by loading the INSERT sample. Then click `Generate`. 

## Clean up resources
If you want to clean up and remove an OpenAI resource, you can delete the resource or resource group. Deleteing the resource group also deletees any other resources assocaited with it. 

- [Portal](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#clean-up-resources)
- [Azure CLI](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account-cli#clean-up-resources)

## Next steps
Learn more about how to generate the best completsion in our [How-to guide on completions](../How-to/Completions.md).