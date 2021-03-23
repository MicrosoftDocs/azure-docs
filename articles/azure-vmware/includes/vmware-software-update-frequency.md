---
title: VMware software update frequency
description: Supported VMware software update frequency for Azure VMware Solution.
ms.topic: include
ms.date: 03/22/2021
---

<!-- Used in faq.md and concepts-private-clouds-clusters.md -->

Microsoft is responsible for the lifecycle management of VMware software (ESXi, vCenter, PSC, and NXS) in the Azure VMware Solution private cloud.

The private cloud software is upgraded on a schedule that tracks the software bundle's release from VMware. Your private cloud doesn't require downtime for upgrades.

The private cloud software bundle upgrades keep the software within one version of the most recent software bundle release from VMware. The private cloud software versions may differ from the most recent versions of the individual software components (ESXi, NSX-T, vCenter, vSAN).

Software updates include:

- **Patches** - Security patches or bug fixes released by VMware
- **Updates** - Minor version change of a VMware stack component
- **Upgrades** - Major version change of a VMware stack component

Microsoft tests a critical security patch as soon as it becomes available from VMware.

Documented VMware workarounds are implemented in lieu of installing a corresponding patch until the next scheduled updates are deployed. 
