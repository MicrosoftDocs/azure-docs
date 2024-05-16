---
title: Azure Extended Zones FAQ
description: This article provides answers to some of the frequently asked questions asked about Azure Extended Zones. 
author: halkazwini
ms.author: halkazwini
ms.service: azure
ms.topic: concept-article #Required; leave this attribute/value as-is.
ms.date: 05/16/2024

---

# Azure Extended Zones frequently asked questions (FAQ)

This article provides answers to some of the frequently asked questions asked about Azure Extended Zones.

## Will data be 100% inside the geography to which the Azure Extended Zone belongs?

For the Los Angeles Azure Extended Zone, the data remains in California. For questions about compliance with data residency policies, confirm with your legal team that Microsoft’s offerings work for your requirements. For future sites, the control plane and certain telemetry run in the closest region, which might or might not be inside the stated geography.

## Are all Azure services offered at the Azure Extended Zone?

No, given the size, hardware, and targeted use cases for the Azure Extended Zone, only a small subset of the Azure services can be offered at the Azure Extended Zone. Access to the complete set of Azure services is available in the parent region.

## Will there be SKUs specific to the Azure Extended Zones?

No, SKUs are consistent across the corresponding Azure Region, so VMs offered in the Azure Extended Zones won't have specific SKUs.

## Can I use the parent region network security groups (NSGs) or user defined routes (UDRs)?

Yes. In Azure Extended Zone, you can use network security groups and user defined routes that you created in the parent region.



## Related content

- [What is Azure Extended Zones?](overview.md)
- [Deploy a virtual machine in an Extended Zone](deploy-vm-portal.md)
- [Back up a virtual machine](backup-virtual-machine.md)
