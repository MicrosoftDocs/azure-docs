---
title: What's happening to Azure Batch AI? | Microsoft Docs
description: Learn about what's happening to Azure Batch AI and the Azure Machine Learning service compute option.
services: batch-ai
author: garyericson

ms.service: batch-ai
ms.topic: overview
ms.date: 12/14/2018
ms.author: garye
---

# What's happening to Azure Batch AI?

The Azure Batch AI service is retiring in March. Batch AI's capabilities are now available in [Azure Machine Learning service](../machine-learning/service/overview-what-is-azure-ml.md).  The Azure Machine Learning service became generally available on December 4, 2018. 

Along with many other machine learning capabilities, the Azure Machine Learning service includes a cloud-based managed compute target for training, deploying, and scoring ML models. This compute target is called the [Azure Machine Learning Compute](../machine-learning/service/how-to-set-up-training-targets.md). 

You can interact with the Azure Machine Learning service through Python SDKs, the Azure portal, and the CLI. 

## Batch AI support timeline

| Date | Support details |
| ---- |-----------------|
| December&nbsp;14&nbsp;2018 | You can continue to use your existing subscriptions as before. However, the ability to create new Azure Batch AI subscriptions is no longer possible and no new investments will be made to the Batch AI service.  <br><br>Support is available to existing customers wanting to migrate to the more comprehensive [Azure Machine Learning service](https://aka.ms/aml-docs). If Azure Machine Learning service does not meet your need, and supported functionality exists in Batch AI, please raise a whitelist request with support against Batch AI service. |
| March 4 2019 | Existing subscriptions continue to run through this date. After this date, existing Batch AI subscriptions will no longer run. |

## How do I migrate?

To avoid disruptions to your applications and to benefit from the latest features, do the following before March 4, 2019:

1. Create an Azure Machine Learning service workspace and get started:
    + [Python based quickstart](../machine-learning/service/quickstart-create-workspace-with-python.md)
    + [Azure portal based quickstart](../machine-learning/service/quickstart-get-started.md)

1. Set up an [Azure Machine Learning Compute](../machine-learning/service/how-to-set-up-training-targets.md) for model training.

1. Update your scripts to use Azure Machine Learning Compute.


## Next steps

- Read the [Azure Machine Learning service overview](../machine-learning/service/overview-what-is-azure-ml.md).

- [Configure a compute target for model training](../machine-learning/service/how-to-set-up-training-targets.md) with Azure Machine Learning service.

Review the [Azure roadmap](https://azure.microsoft.com/updates/) to learn of other  Azure service updates.
