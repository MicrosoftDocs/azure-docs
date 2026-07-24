---
title: Azure Extended Zones FAQ
description: This article provides answers to some of the frequently asked questions about Azure Extended Zones. 
author: svaldesgzz
ms.author: svaldes
ms.service: azure-extended-zones
ms.topic: concept-article
ms.date: 02/25/2026
---

# Azure Extended Zones FAQ

This article provides answers to some of the frequently asked questions about Azure Extended Zones.

## How can I access extended zones?

To learn how to request access to an extended zone, see [Request access to an Azure extended zone](request-access.md).

## What are the available Azure extended zones?

To learn how to request access to extended zones, see [Request access to an Azure extended zone](request-access.md). A comprehensive list of extended zones appears in the process.

## Where is customer data stored and processed when it's deployed to an Azure extended zone?

An Azure extended zone might be associated with a parent region in the same or different country or region. Customer data is stored and processed in the extended zone location, which might be outside of the associated geography and parent region. For extended zones with parent regions in the same country or region, customer data remains within the associated geography.

## Are all Azure services offered at the Azure extended zone?

No. Based on the size, hardware, and targeted use cases for Azure extended zones, only a [subset of the Azure services](overview.md#service-offerings-for-azure-extended-zones) is offered at the Azure extended zones. Access to the complete set of Azure services is available in the parent region.

## Can I use the parent region network security groups (NSGs) or user-defined routes (UDRs)?

Yes. With Azure Extended Zones, you can use network security groups and user-defined routes that you created in the parent region.

## Are the public IP addresses geolocated/tagged to the extended zone?

The public IP addresses use the same space as the parent Azure region but they're tagged as the extended zone if allocated to a resource inside it.

## How am I charged for resources that I create in Azure extended zones?

The billing experience of Azure Extended Zones is consistent with the rest of Azure. Reach out to your sales representative to get more detailed information on protocols and pricing.

## Are discount programs supported in Azure Extended Zones?

Discounts for Enterprise Agreements, Azure Credit Offers, and Azure Consumption Discounts apply. They're agnostic to a region and specific to customer use across Azure.

## Are reserved instances and savings plans supported in Azure Extended Zones?

Yes. To learn more about how to purchase these solutions, see [Purchase reservations and savings plans - Azure portal](purchase-reservations-savings-plans.md).

## Is there a program for partners so that they can find out about launches and get ready for them?

There's no specific program, but partners can reach out to the team for early access and testing.

## Does the extended zone share the same marketplace for using non-Microsoft products?

Yes, the extended zone shares the same marketplace for using non-Microsoft products.

## Related content

- [What is Azure Extended Zones?](overview.md)
- [Deploy a virtual machine in an extended zone](deploy-vm-portal.md)
- [Back up a virtual machine](backup-virtual-machine.md)