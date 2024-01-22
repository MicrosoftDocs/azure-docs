---
title: Save and recover orchestration workflow models
titleSuffix: Azure AI services
description: Learn how to save and recover your orchestration workflow models.
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: conceptual
ms.date: 12/19/2023
ms.author: aahi
ms.custom:  language-service-orchestration
---

# Back up and recover your orchestration workflow models

When you create a Language resource in the Azure portal, you specify a region for it to be created in. From then on, your resource and all of the operations related to it take place in the specified Azure server region. It's rare, but not impossible, to encounter a network issue that hits an entire region. If your solution needs to always be available, then you should design it to either fail-over into another region. This requires two Azure AI Language resources in different regions and the ability to sync your orchestration workflow models across regions. 

If your app or business depends on the use of an orchestration workflow model, we recommend that you create a replica of your project into another supported region. So that if a regional outage occurs, you can then access your model in the other fail-over region where you replicated your project.

Replicating a project means that you export your project metadata and assets and import them into a new project. This only makes a copy of your project settings, intents and utterances. You still need to [train](../how-to/train-model.md) and [deploy](../how-to/deploy-model.md) the models before you can [query them](../how-to/call-api.md) with the [runtime APIs](https://aka.ms/clu-apis).


In this article, you will learn to how to use the export and import APIs to replicate your project from one resource to another existing in different supported geographical regions, guidance on keeping your projects in sync and changes needed to your runtime consumption.

##  Prerequisites

* Two Azure AI Language resources in different Azure regions, each of them in a different region.

## Get your resource keys endpoint

Use the following steps to get the keys and endpoint of your primary and secondary resources. These will be used in the following steps.

[!INCLUDE [Get keys and endpoint Azure Portal](../includes/get-keys-endpoint-azure.md)]

> [!TIP]
> Keep a note of keys and endpoints for both primary and secondary resources. Use these values to replace the following placeholders:
`{PRIMARY-ENDPOINT}`, `{PRIMARY-RESOURCE-KEY}`, `{SECONDARY-ENDPOINT}` and `{SECONDARY-RESOURCE-KEY}`.
> Also take note of your project name, your model name and your deployment name. Use these values to replace the following placeholders:  `{PROJECT-NAME}`, `{MODEL-NAME}` and `{DEPLOYMENT-NAME}`.

## Export your primary project assets

Start by exporting the project assets from the project in your primary resource.

### Submit export job

Replace the placeholders in the following request with your `{PRIMARY-ENDPOINT}` and `{PRIMARY-RESOURCE-KEY}` that you obtained in the first step.

[!INCLUDE [Export project assets using the REST API](../includes/rest-api/export-project.md)]

### Get export job status

Replace the placeholders in the following request with your `{PRIMARY-ENDPOINT}` and `{PRIMARY-RESOURCE-KEY}` that you obtained in the first step.

[!INCLUDE [Export project assets using the REST API](../includes/rest-api/get-export-status.md)]

Copy the response body as you will use it as the body for the next import job.

## Import to a new project 

Now go ahead and import the exported project assets in your new project in the secondary region so you can replicate it.

### Submit import job

Replace the placeholders in the following request with your `{SECONDARY-ENDPOINT}` and `{SECONDARY-RESOURCE-KEY}` that you obtained in the first step.

[!INCLUDE [Import project using the REST API](../includes/rest-api/import-project.md)]

### Get import job status

Replace the placeholders in the following request with your `{SECONDARY-ENDPOINT}` and `{SECONDARY-RESOURCE-KEY}` that you obtained in the first step.

[!INCLUDE [Import project using the REST API](../includes/rest-api/get-import-status.md)]


## Train your model

After importing your project, you only have copied the project's assets and metadata and assets. You still need to train your model, which will incur usage on your account. 

### Submit training job

Replace the placeholders in the following request with your `{SECONDARY-ENDPOINT}` and `{SECONDARY-RESOURCE-KEY}` that you obtained in the first step.

[!INCLUDE [train model](../includes/rest-api/train-model.md)]


### Get Training Status

Replace the placeholders in the following request with your `{SECONDARY-ENDPOINT}` and `{SECONDARY-RESOURCE-KEY}` that you obtained in the first step.

[!INCLUDE [get training model status](../includes/rest-api/get-training-status.md)]

## Deploy your model

This is the step where you make your trained model available form consumption via the [runtime prediction API](https://aka.ms/ct-runtime-swagger). 

> [!TIP]
> Use the same deployment name as your primary project for easier maintenance and minimal changes to your system to handle redirecting your traffic.

### Submit deployment job 

Replace the placeholders in the following request with your `{SECONDARY-ENDPOINT}` and `{SECONDARY-RESOURCE-KEY}` that you obtained in the first step.

[!INCLUDE [deploy model](../includes/rest-api/deploy-model.md)]

### Get the deployment status

Replace the placeholders in the following request with your `{SECONDARY-ENDPOINT}` and `{SECONDARY-RESOURCE-KEY}` that you obtained in the first step.

[!INCLUDE [get deploy status](../includes/rest-api/get-deployment-status.md)]

## Changes in calling the runtime

Within your system, at the step where you call [runtime API](https://aka.ms/clu-apis) check for the response code returned from the submit task API. If you observe a **consistent** failure in submitting the request, this could indicate an outage in your primary region. Failure once doesn't mean an outage, it may be transient issue. Retry submitting the job through the secondary resource you have created. For the second request use your `{YOUR-SECONDARY-ENDPOINT}` and secondary key, if you have followed the steps above, `{PROJECT-NAME}` and `{DEPLOYMENT-NAME}` would be the same so no changes are required to the request body. 

In case you revert to using your secondary resource you will observe slight increase in latency because of the difference in regions where your model is deployed. 

## Check if your projects are out of sync

Maintaining the freshness of both projects is an important part of process. You need to frequently check if any updates were made to your primary project so that you move them over to your secondary project. This way if your primary region fail and you move into the secondary region you should expect similar model performance since it already contains the latest updates. Setting the frequency of checking if your projects are in sync is an important choice, we recommend that you do this check daily in order to guarantee the freshness of data in your secondary model.

### Get project details

Use the following url to get your project details, one of the keys returned in the body indicates the last modified date of the project. 
Repeat the following step twice, one for your primary project and another for your secondary project and compare the timestamp returned for both of them to check if they are out of sync.

[!INCLUDE [get project details](../includes/rest-api/get-project-details.md)] 

Repeat the same steps for your replicated project using `{SECONDARY-ENDPOINT}` and `{SECONDARY-RESOURCE-KEY}`. Compare the returned `lastModifiedDateTime` from both projects. If your primary project was modified sooner than your secondary one, you need to repeat the steps of [exporting](#export-your-primary-project-assets), [importing](#import-to-a-new-project), [training](#train-your-model) and [deploying](#deploy-your-model) your model.

## Next steps

In this article, you have learned how to use the export and import APIs to replicate your project to a secondary Language resource in other region. Next, explore the API reference docs to see what else you can do with authoring APIs.

* [Authoring REST API reference](https://aka.ms/clu-authoring-apis)

* [Runtime prediction REST API reference](https://aka.ms/clu-apis)
