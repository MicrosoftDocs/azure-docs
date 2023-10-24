---
title: How to deploy a custom NER model
titleSuffix: Azure AI services
description: Learn how to deploy a model for custom NER.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: how-to
ms.date: 03/23/2023
ms.author: aahi
ms.custom: language-service-custom-ner, ignite-fall-2021, event-tier1-build-2022
---

# Deploy a model and extract entities from text using the runtime API

Once you are satisfied with how your model performs, it is ready to be deployed and used to recognize entities in text. Deploying a model makes it available for use through the [prediction API](https://aka.ms/ct-runtime-swagger).

## Prerequisites

* A successfully [created project](create-project.md) with a configured Azure storage account.
* Text data that has [been uploaded](design-schema.md#data-preparation) to your storage account.
* [Labeled data](tag-data.md) and successfully [trained model](train-model.md)
* Reviewed the [model evaluation details](view-model-evaluation.md) to determine how your model is performing.

See [project development lifecycle](../overview.md#project-development-lifecycle) for more information.

## Deploy model

After you've reviewed your model's performance and decided it can be used in your environment, you need to assign it to a deployment. Assigning the model to a deployment makes it available for use through the [prediction API](https://aka.ms/ct-runtime-swagger). It is recommended to create a deployment named *production* to which you assign the best model you have built so far and use it in your system. You can create another deployment called *staging* to which you can assign the model you're currently working on to be able to test it. You can have a maximum of 10 deployments in your project. 

# [Language Studio](#tab/language-studio)

[!INCLUDE [Deploy a model using Language Studio](../includes/language-studio/deploy-model.md)]
   
# [REST APIs](#tab/rest-api)

### Submit deployment job

[!INCLUDE [deploy model](../includes/rest-api/deploy-model.md)]

### Get deployment job status

[!INCLUDE [get deployment status](../includes/rest-api/get-deployment-status.md)]

---

## Swap deployments

After you are done testing a model assigned to one deployment and you want to assign this model to another deployment you can swap these two deployments. Swapping deployments involves taking the model assigned to the first deployment, and assigning it to the second deployment. Then taking the model assigned to second deployment, and assigning it to the first deployment. You can use this process to swap your *production* and *staging* deployments when you want to take the model assigned to *staging* and assign it to *production*. 

# [Language Studio](#tab/language-studio)

[!INCLUDE [Swap deployments](../includes/language-studio/swap-deployment.md)]

# [REST APIs](#tab/rest-api)

[!INCLUDE [Swap deployments](../includes/rest-api/swap-deployment.md)]

---


## Delete deployment

# [Language Studio](#tab/language-studio)

[!INCLUDE [Delete deployment](../includes/language-studio/delete-deployment.md)]

# [REST APIs](#tab/rest-api)

[!INCLUDE [Delete deployment](../includes/rest-api/delete-deployment.md)]

---

## Assign deployment resources

You can [deploy your project to multiple regions](../../concepts/custom-features/multi-region-deployment.md) by assigning different Language resources that exist in different regions.

# [Language Studio](#tab/language-studio)

[!INCLUDE [Assign resource](../../conversational-language-understanding/includes/language-studio/assign-resources.md)]

# [REST APIs](#tab/rest-api)

[!INCLUDE [Assign resource](../../custom-text-classification/includes/rest-api/assign-resources.md)]

---

## Unassign deployment resources

When unassigning or removing a deployment resource from a project, you will also delete all the deployments that have been deployed to that resource's region.

# [Language Studio](#tab/language-studio)

[!INCLUDE [Unassign resource](../../conversational-language-understanding/includes/language-studio/unassign-resources.md)]

# [REST APIs](#tab/rest-api)

[!INCLUDE [Unassign resource](../../custom-text-classification/includes/rest-api/unassign-resources.md)]

---

## Next steps

After you have a deployment, you can use it to [extract entities](call-api.md) from text.
