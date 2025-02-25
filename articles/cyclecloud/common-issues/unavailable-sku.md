---
title: Common Issues - Unavailable SKU| Microsoft Docs
description: Azure CycleCloud common issue - Unavailable SKU
author: adriankjohnson
ms.date: 11/15/2019
ms.author: adjohnso
---
# Common Issues: Unavailable Virtual Machine SKU

## Possible Error Messages

- `Creating Virtual Machine (The requested VM size Standard_X is not available in the current region)`

## Resolution

There are two possible resolutions for this issue:
- Choose a region where the desired VM size is available
- Select a VM size that is available in the desired region

To check the VM sizes that are available, click Settings, show "Azure" types, and check the Azure VM Size records for the requested region. If the "Restricted" column's value is "true", this VM size is not available for the subscription.

## More Information

For more information, [this chart](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines) contains information on which VM sizes are available in which regions.