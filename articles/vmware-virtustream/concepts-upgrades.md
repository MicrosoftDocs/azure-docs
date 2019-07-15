---
title: Concepts - Upgrades of Azure VMware Solution by Virtustream (VSAV) Private Clouds
description: Learn about the key upgrade processes and features in Azure VMware Solution by Virtustream Private Clouds.
services: avsv-service
author: v-jetome

ms.service: avsv-service
ms.topic: conceptual
ms.date: 7/8/2019
ms.author: v-jetome 
ms.custom: 

---

# Azure VMware Solution by Virtustream Upgrade Concepts

One of the key benefits of AVSV private clouds is that the platform is maintained for you with a current and validated hardware and software stack. To achieve this, automated upgrades to validated VMware software is required regularly. Some of the key details are provided here.

## AVSV private cloud software upgrades

AVSV private cloud platform includes vSphere, ESXi, vSAN, and NSX-T software. This bundle of VMware software includes specific versions that are validated to deliver private cloud capabilities and enable automated lifecycle management. The ESXi, vSAN, and NSX-T software components are upgraded automatically on a regular cadence, with no impact on the capacity, function or performance of your private clouds.

The benefits include regular and automated installation of the latest features and important updates to the private cloud software. Upgrades are performed on a regular cadence so that all private clouds are within one version of the latest release of the validated software bundle. You will be notified of planned upgrades to your private cloud, and you will have the option of defering the upgrade if your private cloud is within one version of the latest release. <How do we track this and how is the version status pushed to the customer or available for them to pull it?>

Critical patches or updates will be applied when they are validated and you will be notified in advance but will not be able to defer the upgrade. This policy ensures that your private cloud has critical patches and updates applied as soon as possible.

See the private cloud and clusters concept article <internal reference> or the FAQ <internal reference> for the latest VMware component versions used in the private cloud software stack. 

The two related topics of host maintenance and VMware software configuration backups are covered in the private cloud and clusters concept article <internal reference>.

## Next steps <this is always called Next steps and a short statement and the following div puts it into a blue box that is an active link that can be selected>

> [!div class="nextstepaction"]
> [link description][relative link]

<!-- LINKS - external-->

<!-- LINKS - internal -->
