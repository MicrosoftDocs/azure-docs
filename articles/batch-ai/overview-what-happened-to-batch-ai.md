---
title: What's happening to Azure Batch AI? | Microsoft Docs
description: Learn about what's happening to Azure Batch AI, how it is being replaced with Azure Machine Learning, and what the timeline is.
services: batch-ai
author: garyericson

ms.service: batch-ai
ms.topic: overview
ms.date: 12/04/2018
ms.author: garye
---

# What's happening to Azure Batch AI?

We recently released **Azure Machine Learning Compute** which provides you with a cloud-based compute target for developing machine learning models. Because this service will fully replace the existing Azure Batch AI capabilities, Batch AI will be retired on June 28, 2019.

## How does this affect me?

Beginning December 4, 2018, we will no longer make updates to Batch AI. After this date, you will no longer be able to create new subscriptions. Existing subscriptions will continue to run through March 4, 2019.

By the end of March 2019, we expect to have full feature parity between Batch AI and Azure Machine Learning.

On June 28, 2019, the Azure Batch AI service will be retired and no longer be available. <!-- Existing subscriptions will... ***[what happens?]*** -->

## What do I need to do to prepare for this change?

Convert your scripts to use Azure Machine Learning Compute before June 28, 2019, to avoid disruptions to your applications and enjoy quality and feature updates.

<!-- For guidance in updating your code, see **"migration" article** *(link)*. -->

## Support timeline

| Date | Support details |
| ---- |-----------------|
| December 4, 2018 | After this date, you will no longer be able to create new subscriptions to Azure Batch AI. You can continue to use existing subscriptions. |
| March 4, 2019 | After this date, existing subscriptions to Azure Batch AI will no longer run. |
| End of March, 2019 | Azure Machine Learning will be at full parity with Azure Batch AI. |
| June 28, 2019 | Azure Batch AI will be retired and no longer available. Documentation will be removed from docs.microsoft.com. |

## For more information

- To learn how to configure various compute targets for your machine learning models, see [Set up compute targets for model training with Azure Machine Learning service](../machine-learning/service/how-to-set-up-training-targets.md).

- For more information about updates to Azure services, see the [Azure roadmap](https://azure.microsoft.com/updates/).