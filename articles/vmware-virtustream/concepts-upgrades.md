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

One of the key benefits of AVS by Virstustream private clouds is that the platform is maintained for you. Platform maintenance includes automated upgrades to a validated software bundle. The upgrades are performed regularly, ensuring that you always have the latest validated versions of the Azure VMware Solution (AVS) by Virtustream software.

## AVS by Virtustream private cloud software upgrades

The AVS by Virtustream private cloud platform includes vSphere, ESXi, vSAN, and NSX-T software. This bundle of VMware software includes specific versions that are validated to deliver private cloud capabilities and enable automated lifecycle management. Upgrades do not require downtime and the capacity, function, and performance of your private clouds is maintained throughout the upgrade process.

The regular and automated upgrades ensure that you have the latest features and updates of the private cloud software. The upgrade cadence is for all private clouds to be within one version of the latest release of the validated software bundle. You will be notified of planned upgrades to your private cloud, and you can defer the upgrade if your private cloud is within one version of the latest release.

Critical patches or updates will applied when they are validated. You will be notified in advance but will not be able to defer the upgrade. This policy ensures that your private cloud has critical patches and updates applied immediately.

See the [private clouds and clusters concept article][concepts-private-clouds-clusters] or the [FAQ][faq] for the latest VMware software versions used in the AVS by Virtustream private cloud software bundle.

## Next steps

The next step is to [create a private cloud][tutorials-create-private-cloud].

<!-- LINKS - external -->

<!-- LINKS - internal -->
[concepts-private-clouds-clusters]: ./concepts-private-clouds-clusters.md
[faq]: ./faq.md
[tutorials-create-private-cloud]: ./tutorials-create-private-cloud.md
