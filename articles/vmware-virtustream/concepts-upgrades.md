---
title: Concepts - Upgrades of Azure VMware Solution by Virtustream (VSAV) private clouds
description: Learn about the key upgrade processes and features in Azure VMware Solution by Virtustream.
services: 
author: v-jetome

ms.service: vmware-virtustream
ms.topic: conceptual
ms.date: 7/8/2019
ms.author: v-jetome 
ms.custom: 

---

# Azure VMware Solution by Virtustream Upgrade Concepts

One of the key benefits of AVS by Virstustream private clouds is that the platform is maintained for you with a current and validated hardware and software stack. Automated upgrades to validated VMware software is done regularly, ensuring you always have the latest validated versions of the combined software.

## AVS by Virtustream private cloud software upgrades

The AVS by Virtustream private cloud platform includes vSphere, ESXi, vSAN, and NSX-T software. This bundle of VMware software includes specific versions that are validated to deliver private cloud capabilities and enable automated lifecycle management. The ESXi, vSAN, and NSX-T software components are upgraded automatically on a regular cadence, with no impact on the capacity, function or performance of your private clouds.

The benefits include regular and automated installation of the latest features and important updates to the private cloud software. Upgrades are performed on a regular cadence so that all private clouds are within one version of the latest release of the validated software bundle. You will be notified of planned upgrades to your private cloud, and you will have the option of deferring the upgrade if your private cloud is within one version of the latest release.

Critical patches or updates will be applied when they are validated and you will be notified in advance but will not be able to defer the upgrade. This policy ensures that your private cloud has critical patches and updates applied as soon as possible.

See the [private clouds and clusters concept article][concepts-private-clouds-clusters] or the [FAQ][faq] for the latest VMware component versions used in the AVS by Virtustream private cloud software stack. 

## Next steps

The next step is to [create a private cloud][tutorials-create-private-cloud].

<!-- LINKS - external -->

<!-- LINKS - internal -->
[concepts-private-clouds-clusters]: ./concepts-private-clouds-clusters.md
[faq]: ./faq.md
[tutorials-create-private-cloud]: ./tutorials-create-private-cloud.md
