---
title: Collect data from models in production
titleSuffix: Azure Machine Learning
description: Collect inference data from your models deployed on AzureML to monitor their performance in production.
services: machine-learning
author: ahughes-msft
ms.author: alehughes
ms.service: machine-learning
ms.subservice: mlops
ms.reviewer: mopeakande
ms.topic: concept-article 
ms.date: 4/24/2023
ms.custom: template-concept 
---

# Collect inference data from models in production

For models deployed to AzureML Managed Online Endpoints or Kubernetes Online Endpoints, you can use the **Data collector** feature to log the model input and output data to Azure Blob Storage in real-time as your endpoint is utilized in production. The collected inference data can be seamlessly consumed for model monitoring, debugging, or auditing purposes and gives you observability into the performance of your deployed models.

**Data collector** provides the following capabilities:
- Log inference data to a central location (Azure Blob Storage)
- Support for Managed Online Endpoints and Kubernetes Online Endpoints
- Defined at the deployment level, and is mutable for maximum configurability
- Support for both payload and custom logging

**Data collector** provides two logging modes: payload logging and custom logging. With payload logging, you can collect the HTTP request and response payload data from your deployed models. With custom logging, you are provided with a Python SDK which can be used to log pandas DataFrames directly from your scoring script (```score.py```). With the custom logging Python SDK, you can log model input and output data, in addition to data before, during, and after any data transformations/pre-processing.

> [!IMPORTANT]
> This feature is currently in preview. This preview version is provided without a service-level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Data collector configurability

**Data collector** is configurable at the deployment level and the configuration is specified at deployment time. You can configure the Azure Blob Storage destination to determine where the collected data will flow to. You can also configure the sampling rate (0-100%) of the data to collect.

## Data collector limitations
There are a couple limitations to be aware of when using this feature:
- At this time, **Data collector** only supports logging for real-time AzureML endpoints (Managed or Kubernetes). 
- At this time, the **Data collector** Python SDK only supports logging tabular data via. ```pandas DataFrames```. 

## Next steps

Now that you understand what the **Data collector** feature is and how it can be used, use the links below to learn how to use the feature and how to monitor your models in production.

- [How to collect data from models in production](how-to-collect-production-data.md)
- [Monitor your models](link-tbd.md)
