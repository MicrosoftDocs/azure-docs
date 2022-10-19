---
title: Managed online endpoints VM SKU list
titleSuffix: Azure Machine Learning
description: Lists the VM SKUs that can be used for managed online endpoints in Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
ms.reviewer: larryfr
ms.author: sehan
author: dem108
ms.custom: devplatv2, event-tier1-build-2022
ms.date: 06/02/2022
---

# Managed online endpoints SKU list

This table shows the VM SKUs that are supported for Azure Machine Learning managed online endpoints.

* The full SKU names listed in the table can be used for Azure CLI or Azure Resource Manager templates (ARM templates) requests to create and update deployments.

* For more information on configuration details such as CPU and RAM, see [Azure Machine Learning Pricing](https://azure.microsoft.com/pricing/details/machine-learning/) and [VM sizes](../virtual-machines/sizes.md).

| Relative Size | General Purpose | Compute Optimized | Memory Optimized | GPU |
| --- | --- | --- | --- | --- |
| V.Small | Standard_DS1_v2 <br/> Standard_DS2_v2 | Standard_F2s_v2 | Standard_E2s_v3 | Standard_NC4as_T4_v3 |
| Small | Standard_DS3_v2 | Standard_F4s_v2 |  Standard_E4s_v3 | Standard_NC6s_v2 <br/> Standard_NC6s_v3 <br/> Standard_NC8as_T4_v3 |
| Medium | Standard_DS4_v2 | Standard_F8s_v2 | Standard_E8s_v3 | Standard_NC12s_v2 <br/> Standard_NC12s_v3 <br/> Standard_NC16as_T4_v3 |
| Large | Standard_DS5_v2 | Standard_F16s_v2 | Standard_E16s_v3 | Standard_NC24s_v2 <br/> Standard_NC24s_v3 <br/> Standard_NC64as_T4_v3 |
| X-Large| - | Standard_F32s_v2 <br/> Standard_F48s_v2 <br/> Standard_F64s_v2 <br/> Standard_F72s_v2 <br/> Standard_FX24mds <br/> Standard_FX36mds <br/> Standard_FX48mds| Standard_E32s_v3 <br/> Standard_E48s_v3 <br/> Standard_E64s_v3 | Standard_ND40rs_v2 <br/> Standard_ND96asr_v4 <br/> Standard_ND96amsr_A100_v4 <br/>|

> [!CAUTION]
> `Standard_DS1_v2` and `Standard_DS2_v2` may be too small to compute resources used with managed online endpoints. If you want to reduce the cost of deploying multiple models, see [the example for multi models](how-to-deploy-managed-online-endpoints.md#use-more-than-one-model).
