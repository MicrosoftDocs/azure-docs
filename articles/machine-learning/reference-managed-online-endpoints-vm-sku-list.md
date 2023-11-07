---
title: Managed online endpoints VM SKU list
titleSuffix: Azure Machine Learning
description: Lists the VM SKUs that can be used for managed online endpoints in Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
author: dem108
ms.author: sehan
ms.reviewer: mopeakande
ms.custom: devplatv2, event-tier1-build-2022
ms.date: 10/18/2023
---

# Managed online endpoints SKU list

This table shows the VM SKUs that are supported for Azure Machine Learning managed online endpoints.

* The full SKU names listed in the table can be used for Azure CLI or Azure Resource Manager templates (ARM templates) requests to create and update deployments.

* For more information on configuration details such as CPU and RAM, see [Azure Machine Learning Pricing](https://azure.microsoft.com/pricing/details/machine-learning/) and [VM sizes](../virtual-machines/sizes.md).

| Relative Size | General Purpose | Compute Optimized | Memory Optimized | GPU |
| ---           | ---             | ---               | ---              | --- |
| X-Small       | Standard_DS1_v2 <br/> Standard_DS2_v2 <br/> Standard_D2a_v4 <br/> Standard_D2as_v4 | Standard_F2s_v2 | Standard_E2s_v3  | Standard_NC4as_T4_v3 |
| Small         | Standard_DS3_v2 <br/> Standard_D4a_v4 <br/> Standard_D4as_v4                       | Standard_F4s_v2 <br/> Standard_FX4mds  | Standard_E4s_v3  | Standard_NC6s_v2 <br/> Standard_NC6s_v3 <br/> Standard_NC8as_T4_v3 |
| Medium        | Standard_DS4_v2 </br> Standard_D8a_v4 </br> Standard_D8as_v4 | Standard_F8s_v2 </br> Standard_FX12mds | Standard_E8s_v3 | Standard_NC12s_v2 <br/> Standard_NC12s_v3 <br/> Standard_NC16as_T4_v3 |
| Large         | Standard_DS5_v2 </br> Standard_D16a_v4 </br> Standard_D16as_v4 | Standard_F16s_v2 | Standard_E16s_v3 | Standard_NC24s_v2 <br/> Standard_NC24s_v3 <br/> Standard_NC64as_T4_v3 </br> Standard_NC24ads_A100_v4 |
| X-Large       | Standard_D32a_v4 </br> Standard_D32as_v4 </br> Standard_D48a_v4 </br> Standard_D48as_v4 </br> Standard_D64a_v4 </br> Standard_D64as_v4 </br> Standard_D96a_v4 </br> Standard_D96as_v4 | Standard_F32s_v2 <br/> Standard_F48s_v2 <br/> Standard_F64s_v2 <br/> Standard_F72s_v2 <br/> Standard_FX24mds <br/> Standard_FX36mds <br/> Standard_FX48mds | Standard_E32s_v3 <br/> Standard_E48s_v3 <br/> Standard_E64s_v3 | Standard_NC48ads_A100_v4 </br> Standard_NC96ads_A100_v4 </br> Standard_ND96asr_v4 </br> Standard_ND96amsr_A100_v4 </br> Standard_ND40rs_v2 |

> [!CAUTION]
> `Standard_DS1_v2` and `Standard_F2s_v2` may be too small for bigger models and may lead to container termination due to insufficient memory, not enough space on the disk, or probe failure as it takes too long to initiate the container. If you face [OutOfQuota errors](how-to-troubleshoot-online-endpoints.md?tabs=cli#error-outofquota) or [ReourceNotReady errors](how-to-troubleshoot-online-endpoints.md?tabs=cli#error-resourcenotready), try bigger VM SKUs. If you want to reduce the cost of deploying multiple models with managed online endpoint, see [the example for multi models](how-to-deploy-online-endpoints.md#use-more-than-one-model-in-a-deployment).

> [!NOTE]
> We recommend having more than 3 instances for deployments in production scenarios. In addition, Azure Machine Learning reserves 20% of your compute resources for performing upgrades on some VM SKUs as described in [Virtual machine quota allocation for deployment](how-to-deploy-online-endpoints.md#virtual-machine-quota-allocation-for-deployment). VM SKUs that are exempted from this extra quota reservation are listed below:
> - Standard_NC24ads_A100_v4
> - Standard_NC48ads_A100_v4
> - Standard_NC96ads_A100_v4
> - Standard_ND96asr_v4
> - Standard_ND96amsr_A100_v4
> - Standard_ND40rs_v2
