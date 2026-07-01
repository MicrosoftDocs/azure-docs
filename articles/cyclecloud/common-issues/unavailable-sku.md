---
title: Common Issues - Unavailable SKU| Microsoft Docs
description: Troubleshoot 'requested VM size not available' (unavailable SKU) errors in Azure CycleCloud.
author: adriankjohnson
ms.date: 06/19/2026
ms.topic: troubleshooting-problem-resolution
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