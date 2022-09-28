---
title: Migration steps for ACI/AKS webservices to managed online endpoints
titleSuffix: Azure Machine Learning
description: Migration steps for ACI/AKS webservices to managed online endpoints in Azure Machine Learning
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
author: shohei1029
ms.author: shnagata
ms.date: 09/28/2022
ms.reviewer: blackmist
ms.custom: migration
---

# Migration steps for ACI/AKS webservice to Managed online endpoint

[Managed online endpoints](concept-endpoints.md#what-are-online-endpoints) help to deploy your ML models in a turnkey manner. Managed online endpoints work with powerful CPU and GPU machines in Azure in a scalable, fully managed way. Managed online endpoints take care of serving, scaling, securing, and monitoring your models, freeing you from the overhead of setting up and managing the underlying infrastructure. Details can be found on [Deploy and score a machine learning model by using an online endpoint](how-to-deploy-managed-online-endpoints.md).

You can deploy directly to the new compute target with your previous models and environments, or leverage the [scripts](https://github.com/Azure/azureml-examples/blob/main/migration/inferencing-migration/migrate-service.sh) (preview) provided by us to export the current services then deploy to the new compute. For customers who regularly create and delete ACI services, we strongly recommend the prior solution. Notice that the **scoring URL will be changed after migration**. For example, the scoring url for ACI web service is like "http://aaaaaa-bbbbb-1111.westus.azurecontainer.io/score", the scoring url for AKS web service is like "http://1.2.3.4:80/api/v1/service/aks-service/score", while the new one is like "https://endpoint-name.westus.inference.ml.azure.com/score".

## Supported Scenarios and Differences

### Auth Mode
No auth is not supported for managed online endpoint. We'll convert it to key auth if you migrate with below migration scripts.
For key auth, the original keys will be used. Token-based auth is also supported.

### TLS
For ACI service secured with HTTPS, you don't need to provide your own certificates anymore, all the managed online endpoints are protected by TLS. Custom DNS name is not supported also.

### Resource Requirements
[ContainerResourceRequirements](/python/api/azureml-core/azureml.core.webservice.aci.containerresourcerequirements) is not supported, you can choose the proper [SKU](reference-managed-online-endpoints-vm-sku-list.md) for your inferencing.
With our migration tool, we'll map the CPU/Memory requirement to corresponding SKU. If you choose to redeploy manually through CLI/SDK V2, we also suggest the corresponding SKU for your new deployment.

| CPU request | Memory request in GB | Suggested SKU |
| :----| :---- | :---- |
| (0, 1] | (0, 1.2] | DS1 V2 |
| (1, 2] | (1.2, 1.7] | F2s V2 |
| (1, 2] | (1.7, 4.7] | DS2 V2 |
| (1, 2] | (4.7, 13.7] | E2s V3 |
| (2, 4] | (0, 5.7] | F4s V2 |
| (2, 4] | (5.7, 11.7] | DS3 V2 |
| (2, 4] | (11.7, 16] | E4s V3 |

### Network Isolation
For private workspace and VNET scenarios, check [Use network isolation with managed online endpoints (preview)](how-to-secure-online-endpoint.md?tabs=model). As there are many settings for your workspace and VNET, we strongly suggest that redeploy through our new CLI instead of the below script tool.

## Not supported
1. [EncryptionProperties](/python/api/azureml-core/azureml.core.webservice.aci.encryptionproperties) for ACI container is not supported.
2. ACI webservices deployed through deploy_from_model and deploy_from_image are not supported by the migration tool, redeploy manually through CLI/SDK V2.

## Migration Steps

### With our [CLI](how-to-deploy-managed-online-endpoints.md) or [SDK preview](how-to-deploy-managed-online-endpoint-sdk-v2.md)
Redeploy manually with your model files and environment definition.
You can find our examples on [azureml-examples](https://github.com/Azure/azureml-examples). Specifically, this is the [SDK example for managed online endpoint](https://github.com/Azure/azureml-examples/tree/main/sdk/endpoints/online/managed).

### With our [migration tool](https://github.com/Azure/azureml-examples/blob/main/migration/inferencing-migration/migrate-service.sh) (preview)
Here are the steps to use these scripts. Notice that the new endpoint will be created under the **same workspace**.

1. Linux/WSL to run the bash script.
2. Install [Python SDK V1](/python/api/overview/azure/ml/install) to run the python script.
3. Install [Azure CLI](/cli/azure/install-azure-cli).
4. Clone our repository to your local env, git clone https://github.com/Azure/azureml-examples.
5. Edit the subscription/resourcegroup/workspace/service name info in migrate-service.sh, also the expected new endpoint name and deployment name. We recommend that the new endpoint name is different from the previous one. Otherwise, the original service will not be displayed if you check your endpoints on the portal.
6. Execute the bash script, it will take about 5-10 minutes to finish the new deployment.
7. After the deployment is done successfully, you can verify the endpoint with [invoke command](cli/azure/ml/online-endpoint#az-ml-online-endpoint-invoke).

## Cost comparison
We have a rough cost comparison. That varies based on your region, currency and order type, just for your information.
ACI cost is calculated by $29.5650 * X + $3.2485 * Y. (X is the CPU core request rounded up to the nearest number, Y is the memory GB request rounded up to the nearest tenths place)
Both costs are calculated by month.

| CPU request | Memory request in GB | ACI costs range | Suggested SKU | SKU pay-as-you-go| SKU 1 year reserved| SKU 3 year reserved
| :----| :---- | :---- | :---- | :---- | :---- | :---- |
| (0, 1] | (0, 1.2] | ($29.565, $33.463] | DS1 V2 | $41.610 | $27.003 | $17.696 |
| (1, 2] | (1.2, 1.7] | ($63.028, $64.652] | F2s V2 | $61.758 | $36.500 | $22.638 |
| (1, 2] | (1.7, 4.7] | ($64.652, $74.398] | DS2 V2 | $83.220 | $54.086 | $35.391 |
| (1, 2] | (4.7, 13.7] | ($74.398, $103.634] | E2s V3 | $97.090 | $57.086 | $36.500 |
| (2, 3] | (0, 5.7] | ($88.695, $107.211] | F4s V2 | $123.37 | $73.000 | $45.275 |
| (3, 4] | (0, 5.7] | ($118.26, $136.776] | F4s V2 | $123.37 | $73.000 | $45.275 |
| (2, 3] | (5.7, 11.7] | ($107.211, $126.702] | DS3 V2 | $167.170 | $108.165 | $70.781 |
| (3, 4] | (5.7, 11.7] | ($136.776, $156.267] | DS3 V2 | $167.170 | $108.165 | $70.781 |
| (2, 3] | (11.7, 16] | ($126.702, $140.671] | E4s V3 | $194.180 | $114.165 | $73.000 |
| (3, 4] | (11.7, 16] | ($156.267, $170.236] | E4s V3 | $194.180 | $114.165 | $73.000 |

## Contact us
Reach out to us: moeonboard@microsoft.com if you have any questions or feedback.
