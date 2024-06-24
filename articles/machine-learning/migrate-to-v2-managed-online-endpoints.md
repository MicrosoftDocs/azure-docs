---
title: Upgrade steps for Azure Container Instances web services to managed online endpoints
titleSuffix: Azure Machine Learning
description: Upgrade steps for Azure Container Instances web services to managed online endpoints in Azure Machine Learning
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
author: dem108
ms.author: sehan
ms.date: 09/28/2022
ms.reviewer: mopeakande
ms.custom: upgrade
monikerRange: 'azureml-api-1 || azureml-api-2'
---

# Upgrade steps for Azure Container Instances web services to managed online endpoints

[Managed online endpoints](concept-endpoints-online.md) help to deploy your ML models in a turnkey manner. Managed online endpoints work with powerful CPU and GPU machines in Azure in a scalable, fully managed way. Managed online endpoints take care of serving, scaling, securing, and monitoring your models, freeing you from the overhead of setting up and managing the underlying infrastructure. Details can be found on [Deploy and score a machine learning model by using an online endpoint](how-to-deploy-online-endpoints.md).

You can deploy directly to the new compute target with your previous models and environments, or use the [scripts](https://aka.ms/moeonboard) provided by us to export the current services and then deploy to the new compute without affecting your existing services. If you regularly create and delete Azure Container Instances (ACI) web services, we strongly recommend the deploying directly and not using the scripts. 

> [!IMPORTANT]
> **The scoring URL will be changed after upgrade**. For example, the scoring url for ACI web service is like `http://aaaaaa-bbbbb-1111.westus.azurecontainer.io/score`. The scoring URI for a managed online endpoint is like `https://endpoint-name.westus.inference.ml.azure.com/score`.

## Supported scenarios and differences

### Auth mode
No auth isn't supported for managed online endpoint. If you use the upgrade scripts, it will convert it to key auth.
For key auth, the original keys will be used. Token-based auth is also supported.

### TLS
For ACI service secured with HTTPS, you don't need to provide your own certificates anymore, all the managed online endpoints are protected by TLS.

Custom DNS name **isn't** supported.

### Resource requirements
[ContainerResourceRequirements](/python/api/azureml-core/azureml.core.webservice.aci.containerresourcerequirements) isn't supported, you can choose the proper [SKU](reference-managed-online-endpoints-vm-sku-list.md) for your inferencing.
The upgrade tool will map the CPU/Memory requirement to corresponding SKU. If you choose to redeploy manually through CLI/SDK V2, we also suggest the corresponding SKU for your new deployment.

| CPU request | Memory request in GB | Suggested SKU |
| :----| :---- | :---- |
| (0, 1] | (0, 1.2] | DS1 V2 |
| (1, 2] | (1.2, 1.7] | F2s V2 |
| (1, 2] | (1.7, 4.7] | DS2 V2 |
| (1, 2] | (4.7, 13.7] | E2s V3 |
| (2, 4] | (0, 5.7] | F4s V2 |
| (2, 4] | (5.7, 11.7] | DS3 V2 |
| (2, 4] | (11.7, 16] | E4s V3 |

"(" means greater than and "]" means less than or equal to. For example, “(0, 1]” means “greater than 0 and less than or equal to 1”.

> [!IMPORTANT]
> When upgrading from ACI, there will be some changes in how you'll be charged. See [our blog](https://aka.ms/acimoemigration) for a rough cost comparison to help you choose the right VM SKUs for your workload.

### Network isolation
For private workspace and VNet scenarios, see [Use network isolation with managed online endpoints](how-to-secure-online-endpoint.md?tabs=model).

> [!IMPORTANT]
> As there are many settings for your workspace and VNet, we strongly suggest that redeploy through the Azure CLI extension v2 for machine learning.

## Not supported
+ [EncryptionProperties](/python/api/azureml-core/azureml.core.webservice.aci.encryptionproperties) for ACI container isn't supported.

## Upgrade steps

### With our [CLI](how-to-deploy-online-endpoints.md) or [SDK](how-to-deploy-managed-online-endpoint-sdk-v2.md)
Redeploy manually with your model files and environment definition.
You can find our examples on [azureml-examples](https://github.com/Azure/azureml-examples). Specifically, this is the [SDK example for managed online endpoint](https://github.com/Azure/azureml-examples/tree/main/sdk/python/endpoints/online/managed).

## Next steps

* [What are Azure Machine Learning endpoints?](concept-endpoints.md)
* [Deploy and score a model with an online endpoint](how-to-deploy-online-endpoints.md)
