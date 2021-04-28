---
title: VMware software update frequency
description: Supported VMware software update frequency for Azure VMware Solution.
ms.topic: include
ms.date: 04/23/2021
---

<!-- Used in faq.md and concepts-private-clouds-clusters.md -->

Host maintenance and lifecycle management have no impact on the private cloud clusters' capacity or performance.  The private cloud software is upgraded on a schedule that tracks the software bundle's release from VMware. Your private cloud doesn't require downtime for upgrades.

The private cloud software bundle upgrades keep the software within one version of the most recent software bundle release from VMware. The private cloud software versions may differ from the most recent versions of the individual software components (ESXi, NSX-T, vCenter, vSAN). Updates also include drivers, software on the network switches, and firmware on the bare-metal nodes.

You'll be notified before and after patches are applied to your private clouds. We'll also work with you to schedule a maintenance window before applying updates or upgrades to your private cloud. 

Software updates include:

- **Patches** - Security patches or bug fixes released by VMware
- **Updates** - Minor version change of a VMware stack component
- **Upgrades** - Major version change of a VMware stack component

>[!NOTE]
>Microsoft tests a critical security patch as soon as it becomes available from VMware.

Documented VMware workarounds are implemented in lieu of installing a corresponding patch until the next scheduled updates are deployed.
