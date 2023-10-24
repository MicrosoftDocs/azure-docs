---
title: Deploy a custom summarization model
titleSuffix: Azure AI services
description: Learn about deploying a model for Custom summarization.
services: cognitive-services
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.topic: how-to
ms.date: 06/02/2023
ms.author: jboback
---

# Deploy a custom summarization model

Once you're satisfied with how your model performs, it's ready to be deployed and used to summarize text documents. Deploying a model makes it available for use through the [prediction API](https://aka.ms/ct-runtime-swagger).

<!--## Prerequisites

* A successfully [created project](create-project.md) with a configured Azure storage account.
* Text data that has [been uploaded](design-schema.md#data-preparation) to your storage account.
* [Labeled data](label-data.md) and a successfully [trained model](train-model.md).
* Reviewed the [model evaluation details](view-model-evaluation.md) to determine how your model is performing.

For more information, see [project development lifecycle](../overview.md#project-development-lifecycle).-->

## Deploy model

After you've reviewed your model's performance and decided it can be used in your environment, you need to assign it to a deployment. Assigning the model to a deployment makes it available for use through the [prediction API](https://aka.ms/ct-runtime-swagger). It is recommended to create a deployment named *production* to which you assign the best model you have built so far and use it in your system. You can create another deployment called *staging* to which you can assign the model you're currently working on to be able to test it. You can have a maximum of 10 deployments in your project. 

[!INCLUDE [Deploy a model using Language Studio](../../../includes/custom/language-studio/deployment.md)]
   
## Swap deployments

After you are done testing a model assigned to one deployment and you want to assign this model to another deployment you can swap these two deployments. Swapping deployments involves taking the model assigned to the first deployment, and assigning it to the second deployment. Then taking the model assigned to second deployment, and assigning it to the first deployment. You can use this process to swap your *production* and *staging* deployments when you want to take the model assigned to *staging* and assign it to *production*. 

[!INCLUDE [Swap deployments](../../../includes/custom/language-studio/swap-deployment.md)]

## Delete deployment

[!INCLUDE [Delete deployment](../../../includes/custom/language-studio/delete-deployment.md)]

## Assign deployment resources

You can [deploy your project to multiple regions](../../../concepts/custom-features/multi-region-deployment.md) by assigning different Language resources that exist in different regions.

[!INCLUDE [Assign resource](../../../includes/custom/language-studio/assign-resources.md)]

## Unassign deployment resources

When unassigning or removing a deployment resource from a project, you will also delete all the deployments that have been deployed to that resource's region.

[!INCLUDE [Unassign resource](../../../includes/custom/language-studio/unassign-resources.md)]

## Next steps

Check out the [summarization feature overview](../../overview.md).
