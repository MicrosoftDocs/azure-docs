---
title: Red Hat workloads on Azure overview | Microsoft Docs
description: Learn about the Red Hat product offerings available on Azure
services: virtual-machines-linux
author: asinn826
manager: borisb2015

ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.topic: overview
ms.date: 12/18/2019
ms.author: alsin
---

# Red Hat workloads on Azure
Red Hat workloads are supported through a variety of offerings on Azure. Red Hat Enterprise Linux (RHEL) images are at the core of RHEL workloads, as is to Red Hat Update Infrastructure.

## Red Hat Enterprise Linux (RHEL) Images
Azure offers a wide offering of RHEL images on Azure. These images are made available through 2 different licensing models: pay-as-you-go (PAYG), and bring-your-own-subscription (BYOS). New RHEL images on Azure are published when new RHEL versions are released and updated throughout their lifecycles as necessary.

### Pay-as-you-go images
You may choose from a variety of RHEL PAYG images. These images come properly entitled for RHEL and are attached to a source of updates (Red Hat Update Infrastructure), and will charge a premium fee for the RHEL entitlement and updates. RHEL image variants include standard RHEL, RHEL for SAP, and RHEL for SAP with High Availability and Update Services. You may want to use these images if you don't want to worry about paying separately for the appropriate number of subscriptions.

### Bring-your-own-subscription images
Azure also offers RHEL BYOS images. This may be useful to customers who have on-premise Red Hat subscriptions and want to use them in Azure. Using these images allows a customer to avoid double-billing that may be incurred from using the PAYG images. To use these images you must ensure that you have an appropriate amount of Red Hat Cloud Access subscriptions. Access to these images is granted only when Red Hat verifies that you have sufficient Cloud Access subscriptions. You may request access to the BYOS images [here](https://aka.ms/rhel-byos).

> [!NOTE]
> Note on double billing: Double billing is incurred when a user pays twice for RHEL subscriptions. This usually happens when a customer uses subscription-manager to attach an entitlement on a RHEL PAYG VM. For example, a customer that uses subscription-manager to attach an entitlement for SAP packages on a RHEL PAYG image will indirectly be double-billed because they will pay twice for RHEL - once through the PAYG premium fee and once through their SAP subscription. This will not happen to BYOS image users.

## Red Hat Update Infrastructure (RHUI)
Microsoft provides Red Hat Update Infrastructure only for PAYG RHEL virtual machines (VMs). RHUI is effectively a mirror of the Red Hat CDNs but is only accessible to the Azure PAYG RHEL VMs. You will have access to the appropriate packages depending on which RHEL image you have deployed. For example, a RHEL for SAP image will have access to the SAP packages in addition to base RHEL packages.

### RHUI Update Behavior
RHEL images connected to RHUI will, by default, update to the latest minor version of RHEL when a `yum update` is run. This will mean that a RHEL 7.4 VM may get upgraded to RHEL 7.7 if a `yum update` operation is run on it. This is by design of RHUI, but can be mitigated by switching from regular RHEL repositories to the Extended Update Support (EUS) repositories.

## Next Steps
* Learn more about [RHEL images on Azure](./redhat-images.md)
* Learn more about [Red Hat Update Infrastructure](./redhat-rhui.md)
* Learn more about the [RHEL BYOS offer](./redhat-byos.md)