---
title: Common Issues - Unavailable SKU| Microsoft Docs
description: Azure CycleCloud common issue - Unavailable SKU
author: adriankjohnson
ms.date: 06/30/2025
ms.author: adjohnso
---
# Common issues: Unavailable virtual machine SKU

## Possible error messages

- `Creating Virtual Machine (The requested VM size Standard_X is not available in the current region)`

## Resolution

There are two possible resolutions for this issue:
- Choose a region where the desired VM size is available
- Select a VM size that is available in the desired region

To check the available VM sizes, select **Settings**, view the **Azure** types, and check the Azure VM Size records for the requested region. If the **Restricted** column shows **true**, this VM size isn't available for your subscription.

## More information

For more information, [this chart](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines) shows which VM sizes are available in which regions.