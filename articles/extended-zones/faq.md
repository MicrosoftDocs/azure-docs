---
title: Extended Zones FAQ
description: This article provides answers to some of the frequently asked questions asked about Azure Extended Zones. 
author: halkazwini
ms.author: halkazwini
ms.service: azure
ms.topic: concept-article #Required; leave this attribute/value as-is.
ms.date: 05/08/2024

---

# Azure Extended Zones frequently asked questions (FAQ)

This article provides answers to some of the frequently asked questions asked about Azure Extended Zones.

## Is there a charge for using Private Preview?

No, private preview is free. Pricing will be available at GA.

## What Azure Extended Zones will be available in Private Preview for customer usage?

The Los Angeles site will be the only location customers test and use during Private Preview.

## Will the data be 100% inside the geography to which the Azure Extended Zone belongs? (i.e. can we fulfill data residency requirements from our region?

For the Los Angeles Azure Extended Zone, the data will remain in California. For questions about compliance with data residency policies, customers should confirm with their legal team that Microsoft’s offerings works for their requirements. For future sites, the control plane and certain telemetry run in the closest region, which may or may not be inside the stated geography.

## Are all Azure services offered at the Azure Extended Zone?

No, given the size, hardware, and targeted use cases for the Azure Extended Zone, only a small subset of the Azure services can be offered at the Azure Extended Zone. Access to the complete set of Azure services is available in the parent region. Azure Extended Zones plans to have Arc based PaaS and Kubernetes for portability across all Arc enabled Infra, while there is ARM based IaaS for portability across Azure.

## Related content

- [What is Azure Extended Zones?](overview.md)
- [Deploy a virtual machine in an Extended Zone](deploy-vm-portal.md)
- [Back up a virtual machine](backup-virtual-machine.md)
