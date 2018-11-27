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

We recently released Azure Machine Learning for general availability. The service offers **Azure Machine Learning Compute**, which provides you with a cloud-based compute target for developing, training, and batch inferencing machine learning models. Because this service will fully replace the existing Azure Batch AI capabilities, Batch AI will be retired on March 4, 2019.

## How does this affect me?

Beginning December 4, 2018, we will no longer accept new subscriptions to the Batch AI service. Existing customers of the service can continue to use the service as they do today with no foreseeable difference. We will not make any new product investments to the service, but will instead support our existing customers as we work with them to successfully migrate to the larger Azure Machine Learning product. Existing subscriptions will continue to run through March 4, 2019, at which point we should have full feature parity between the two services.

## What do I need to do to prepare for this change?

Convert your scripts to use Azure Machine Learning Compute before June 28, 2019, to avoid disruptions to your applications and enjoy quality and feature updates. Azure Machine Learning service is exposed to users through a Python SDK, the portal, and the CLI. 

## Support timeline

| Date | Support details |
| ---- |-----------------|
| December 4, 2018 | After this date, you will no longer be able to create new subscriptions to Azure Batch AI. You can continue to use existing subscriptions. |
| Between Dec 4, 2018 and March 4, 2019 | If Azure Machine Learning service does not meet your need, and a supported functionality exists in the BatchAI service, you can raise a support request against the BatchAI service and request that your subscription be whitelisted to use the service. |
| March 4, 2019 | After this date, existing subscriptions to Azure Batch AI will no longer run. We expect to have migrated all our customers to Azure Machine Learning by then. |


## For more information

- To learn how to configure various compute targets for your machine learning models, see [Set up compute targets for model training with Azure Machine Learning service](../machine-learning/service/how-to-set-up-training-targets.md).

- For more information about updates to Azure services, see the [Azure roadmap](https://azure.microsoft.com/updates/).