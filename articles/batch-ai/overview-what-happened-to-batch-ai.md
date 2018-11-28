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



## What do I need to do to prepare for this change?

Convert your scripts to use Azure Machine Learning Compute before June 28, 2019, to avoid disruptions to your applications and enjoy quality and feature updates. Azure Machine Learning service is exposed to users through a Python SDK, the portal, and the CLI. 

## Support timeline

| Date | Support details |
| ---- |-----------------|
| December 4, 2018 | After this date, you will no longer be able to create new subscriptions to Azure Batch AI. You can continue to use existing subscriptions. |
| Between Dec 4, 2018 and March 4, 2019 | If Azure Machine Learning service does not meet your need, and a supported functionality exists in the BatchAI service, you can raise a support request against the BatchAI service and request that your subscription be whitelisted to use the service. |
| March 4, 2019 | After this date, existing subscriptions to Azure Batch AI will no longer run. We expect to have migrated all our customers to Azure Machine Learning by then. |


## For more information

- To learn more about Azure Machine Learning service, see [What is Azure Machine Learning service?](../machine-learning/service/overview-what-is-azure-ml.md).

- To learn how to configure various compute targets for your machine learning models, see [Set up compute targets for model training with Azure Machine Learning service](../machine-learning/service/how-to-set-up-training-targets.md).

- For more information about updates to Azure services, see the [Azure roadmap](https://azure.microsoft.com/updates/).
