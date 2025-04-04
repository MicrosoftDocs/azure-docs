---
title: Common Issues - Updating Scalesets
description: Azure CycleCloud common issue - Updating Scalesets
author: adriankjohnson
ms.date: 11/15/2019
ms.author: adjohnso
---
# Common Issues: Updating Scalesets

## Possible Error Messages

- `Updating Scaleset (OperationNotAllowed)`

## Resolution

Typically, this error arises from exceeding your quota for the scale set's VM type. To determine if you have enough quota in your subscription for the specific VM type, click the "gear" icon at the bottom of the Cluster page, show "Azure" types, and select "Azure Usage." In the search box, type the family name of the VM size to filter the records. If the "Limit" column for the VM size family is too low, you will need to request more quota.

Alternatively, you may use the Azure portal to view subscription usage and quotas from the "Usage + quotas" section on the Subscriptions blade.