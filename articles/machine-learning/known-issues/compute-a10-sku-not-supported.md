---
title: Known issue - A10 SKU not supported
titleSuffix: Azure Machine Learning
description: While trying to create a compute instance with A10 SKU, users encounter a provisioning error.
author: s-polly
ms.author: scottpolly
ms.topic: troubleshooting  
ms.service: machine-learning
ms.subservice: core
ms.date: 08/14/2023
ms.custom: known-issue
---

# Known issue  - Provisioning error when creating a compute instance with A10 SKU

[!INCLUDE [dev v2](../includes/machine-learning-dev-v2.md)]

While trying to create a compute instance with A10 SKU, you'll encounter a provisioning error.

:::image type="content" source="media/compute-a10-sku-not-supported/ci-a10.png" alt-text="A screenshot showing the provisioning error message.":::


**Status:** Open

**Problem area:** Compute Instance

## Solutions and workarounds

A10 AKUs aren't supported for compute instances. Consult this list of supported SKUs: [Supported VM series and sizes](../concept-compute-target.md?view=azureml-api-2&preserve-view=true#supported-vm-series-and-sizes)

## Next steps

- [About known issues](azure-machine-learning-known-issues.md)
