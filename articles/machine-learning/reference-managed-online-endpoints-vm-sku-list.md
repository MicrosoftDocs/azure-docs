---
title: Managed online endpoints VM SKU list (preview)
titleSuffix: Azure Machine Learning
description: Lists the VM SKUs that can be used for managed online endpoints (preview) in Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
ms.reviewer: laobri
ms.author: seramasu
author: rsethur
ms.custom: devplatv2
ms.date: 05/10/2021
---

# Managed online endpoints SKU list (preview)

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

This table shows the VM SKUs that are supported for Azure Machine Learning managed online endpoints (preview).

* The `instance_type` attribute used for deployment must be specified in the form "Standard_F4s_v2". The table below lists instance names, for example, F2s v2. These names should be put in the specified form (`Standard_{name}`) for Azure CLI or Azure Resource Manager templates (ARM templates) requests to create and update deployments. 

* For more information on configuration details such as CPU and RAM, see [Azure Machine Learning Pricing](https://azure.microsoft.com/pricing/details/machine-learning/).

| Size | General Purpose | Compute Optimized | Memory Optimized | GPU |
| --- | --- | --- | --- | --- | 
| V.Small | DS2 v2 | F2s v2 | E2 v3 | NC4as_T4_v3 |
| Small | DS3 v2 | F4s v2 | E4 v3 | NC6s v2 <br/> NC6s v3 <br/> NC8as_T4_v3 |
| Medium | DS4 v2 | F8s v2 | E8 v3 | NC12s v2 <br/> NC12s v3 <br/> NC16as_T4_v3 |
| Large | DS5 v2 | F16s v2 |E16 v3 | NC24s v2 <br/> NC24s v3 <br/> NC64as_T4_v3 |
| X-Large| - | F32s v2 <br/> F48s v2 <br/> F64s v2 <br/> F72s v2 | - | - |


