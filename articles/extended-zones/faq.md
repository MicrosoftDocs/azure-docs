---
title: Azure Extended Zones FAQ
description: This article provides answers to some of the frequently asked questions asked about Azure Extended Zones. 
author: halkazwini
ms.author: halkazwini
ms.service: azure-extended-zones
ms.topic: concept-article
ms.date: 11/19/2024
---

# Azure Extended Zones frequently asked questions (FAQ)

This article provides answers to some of the frequently asked questions about Azure Extended Zones.

## Where is customer data stored and processed when deploying to an Azure Extended Zone?

An Azure Extended Zone might be associated with a parent region in the same or a different country/region. Customer Data will be stored and processed in the Extended Zone location, which may be outside of the associated geography and parent region. For Extended Zones with parent regions in the same country/region, customer Data will remain within the associated geography.

## Are all Azure services offered at the Azure Extended Zone?

No, given the size, hardware, and targeted use cases for the Azure Extended Zone, only a [subset of the Azure services](overview.md#service-offerings-for-azure-extended-zones) are offered at the Azure Extended Zone. Access to the complete set of Azure services is available in the parent region.

## What are the available Azure Extended Zones?

Currently, Los Angeles is the only available Azure Extended Zone.

## How will I be charged for resources I create in an Azure Extended Zone?

The pricing and billing process of Los Angeles Azure Extended Zone is consistent with the West US Region. Resources created in the Los Angeles Extended Zone follow the same billing pricing as those created in the West US Region.

## Can I use the parent region network security groups (NSGs) or user defined routes (UDRs)?

Yes. In Azure Extended Zone, you can use network security groups and user defined routes that you created in the parent region.

## Related content

- [What is Azure Extended Zones?](overview.md)
- [Deploy a virtual machine in an Extended Zone](deploy-vm-portal.md)
- [Back up a virtual machine](backup-virtual-machine.md)
