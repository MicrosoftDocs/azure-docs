---
title: Shared billing meter regions
titleSuffix: Microsoft Cost Management
description: Learn about shared billing meter regions in Azure, how they affect cost calculations, and the difference between billing meter regions and resource locations.
author: vikramdesai01
ms.reviewer: kyleikeda
ms.service: cost-management-billing
ms.subservice: common
ms.topic: concept-article
ms.date: 05/27/2025
ms.author: kyleikeda
---

# Shared billing meter regions

An Azure billing meter is a collection of information in the Azure billing system that helps define the cost of using a specific service or resource in Azure. It helps determine the amount you're charged based on the quantity of the resource consumed. The billing meter varies depending on the type of service or resource that you use.

Some billing meters might apply to only one Azure region or location. Other billing meters are *shared* across multiple or all Azure regions. This difference means that a billing meter can have *a different Azure region* from the geographical location where you deploy a resource. This situation occurs when a billing meter is shared across physical locations.

Most Azure billing experiences, including the Azure portal, Cost Management + Billing, APIs, your invoice, and cost and usage files generally show a billing meter region. The meter region shown in these experiences is to identify the cost any quantity of the consumed service or resource. *The billing meter region shown doesn't identify the physical location of the resource.*

## Shared billing meter region example

Consider a situation where you deploy an Azure service in the US West region. The billing meter shown in billing experiences for the deployed resources is in the US East region. In this example, the billing meter has a shared billing meter region.

## Resource location might differ

The Azure region where you deploy a resource determines its physical location. The billing meter's location doesn't affect the actual resource location. So, the meter region location can differ from the resource location, causing the variation.

To avoid any confusion, keep the distinction between a billing meter region and an Azure resource region in mind.

## Related content

- For more information about updates to billing meter IDs, see [Azure billing meter ID updates](billing-meter-id-updates.md).


