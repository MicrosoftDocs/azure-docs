---
title: Common Issues - Updating Scalesets
description: Azure CycleCloud common issue - Updating Scalesets
author: adriankjohnson
ms.date: 06/30/2025
ms.author: adjohnso
---
# Common issues: Updating scale sets

## Possible error messages

- `Updating Scaleset (OperationNotAllowed)`

## Resolution

This error usually happens when you exceed your quota for the scale set's VM type. To check if you have enough quota in your subscription for the specific VM type, select the **gear** icon at the bottom of the Cluster page, show **Azure** types, and select **Azure Usage**. In the search box, type the family name of the VM size to filter the records. If the **Limit** column for the VM size family is too low, you need to request more quota.

Alternatively, you can use the Azure portal to view subscription usage and quotas from the **Usage + quotas** section on the Subscriptions blade.