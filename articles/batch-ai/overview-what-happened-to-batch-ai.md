---
title: What's happening to Azure Batch AI? | Microsoft Docs
description: Learn about what's happening to Azure Batch AI and the Azure Machine Learning service compute option.
services: batch-ai
author: garyericson

ms.service: batch-ai
ms.topic: overview
ms.date: 12/04/2018
ms.author: garye
---

# What's happening to the Azure Batch AI service?

Azure Batch AI is retiring in March because its capabilities are available in (Azure Machine Learning service)[What is Azure Machine Learning service?](../machine-learning/service/overview-what-is-azure-ml.md).  The Azure Machine Learning service became generally available on December 4, 2018. 

Along with many other machine learning capabilities, the Azure Machine Learning service includes a cloud-based managed compute target for training, deploying, and scoring ML models. This compute target is called the [Azure Machine Learning Compute](../machine-learning/service/how-to-set-up-training-targets.md). 

Azure Machine Learning service is exposed to users through Python SDKs, the Azure portal, and the CLI. 

## What do I need to do to prepare for this change?

Convert your scripts to use Azure Machine Learning Compute before June 28, 2019, to avoid disruptions to your applications and enjoy quality and feature updates. Azure Machine Learning service is exposed to users through a Python SDK, the portal, and the CLI. 

## Batch AI support timeline

| Date | Support details |
| ---- |-----------------|
| December 4, 2018 | Beginning this date, the ability to create a new Azure Batch AI subscription ended. You can continue to use your existing subscriptions as before. |
| Between Dec 4, 2018 and March 4, 2019 | No new investments to the Batch AI service. We will support existing customers during their migration to the more comprehensive [Azure Machine Learning service](https://aka.ms/aml-docs). If Azure Machine Learning service does not meet your need, and a supported functionality exists in Batch AI, then raise a support whitelist request against Batch AI service. |
| March 4, 2019 | Existing subscriptions will continue to run through this date, at which point we should have full feature parity between the two services. After this date, existing Batch AI subscriptions will no longer run. |

## Next steps

- Read the [Azure Machine Learning service overview](../machine-learning/service/overview-what-is-azure-ml.md).

- Learn how to [configure compute targets for model training](../machine-learning/service/how-to-set-up-training-targets.md) with Azure Machine Learning service.

- Review the [Azure roadmap](https://azure.microsoft.com/updates/) for other updates to Azure services.
