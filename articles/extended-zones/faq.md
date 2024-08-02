---
title: Azure Extended Zones FAQ
description: This article provides answers to some of the frequently asked questions asked about Azure Extended Zones. 
author: halkazwini
ms.author: halkazwini
ms.service: azure-extended-zones
ms.topic: concept-article
ms.date: 08/02/2024
---

# Azure Extended Zones frequently asked questions (FAQ)

This article provides answers to some of the frequently asked questions asked about Azure Extended Zones.

## Where is customer data stored and processed when deploying to an Azure Extended Zone?

An Azure Extended Zone might be associated with a parent region in the same or a different country. Customer Data will be stored and processed in the Extended Zone location, which may be outside of the associated geography and parent region. For Extended Zones with parent regions in the same country, customer Data will remain within the associated geography.

## Are all Azure services offered at the Azure Extended Zone?

No, given the size, hardware, and targeted use cases for the Azure Extended Zone, only a small subset of the Azure services can be offered at the Azure Extended Zone. Access to the complete set of Azure services is available in the parent region.

## Will there be SKUs specific to the Azure Extended Zones?

No, SKUs are consistent across the corresponding Azure Region, so VMs offered in the Azure Extended Zones don't have specific SKUs.

## Can I use the parent region network security groups (NSGs) or user defined routes (UDRs)?

Yes. In Azure Extended Zone, you can use network security groups and user defined routes that you created in the parent region.

## Related content

- [What is Azure Extended Zones?](overview.md)
- [Deploy a virtual machine in an Extended Zone](deploy-vm-portal.md)
- [Back up a virtual machine](backup-virtual-machine.md)
