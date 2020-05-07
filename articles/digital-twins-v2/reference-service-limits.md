---
# Mandatory fields.
title: Public preview service limits
titleSuffix: Azure Digital Twins
description: Chart showing the limits of the Azure Digital Twins service during public preview.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 05/05/2020
ms.topic: article
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Service limits in public preview

The table below lists the functional limits of Azure Digital Twins in the current preview.

| Area | Capability | Limit |
| --- | --- | --- |
| Azure resource | Number of Azure Digital Twins instances in a region, per subscription | 10 |
| Digital twins | Number of twins in an Azure Digital Twins instance | 200,000 |
| Routing | Number of endpoints for a single Azure Digital Twins instance | 6 |
| Routing | Number of routes for a single Azure Digital Twins instance | 6 |
| Models | Number of models within a single Azure Digital Twins instance | 10,000 |
| Models | Number of items returned in a single page | 100 |
| Query | Number of items returned in a single page | 100 |
| Query | Number of `AND` / `OR` expressions in a query | 50 |
| Query | Number of array items in an `IN` / `NOT IN` clause | 50 |
| Query | Number of characters in a query | 8,000 |
| Query | Number of `JOINS` in a query | 1 |

> [!NOTE]
> If your business requires more than the limit of 10 Azure Digital Twins instances in a region per subscription, you can  request additional resources by [opening a support ticket](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Next steps

Learn more about the current preview release of Azure Digital Twins in the service overview:
* [Overview: What is Azure Digital Twins?](overview.md)