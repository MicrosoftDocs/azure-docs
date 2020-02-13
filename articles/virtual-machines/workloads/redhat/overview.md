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
Red Hat workloads are supported through a variety of offerings on Azure. Red Hat Enterprise Linux (RHEL) images are at the core of RHEL workloads, as is the Red Hat Update Infrastructure (RHUI).

## Red Hat Enterprise Linux (RHEL) images
Azure offers a wide offering of RHEL images on Azure. These images are made available through two different licensing models: pay-as-you-go (PAYG), and bring-your-own-subscription (BYOS). New RHEL images on Azure are published when new RHEL versions are released and updated throughout their lifecycles as necessary.

### Pay-as-you-go (PAYG) images
Azure offers a variety of RHEL PAYG images. These images come properly entitled for RHEL and are attached to a source of updates (Red Hat Update Infrastructure). These images will charge a premium fee for the RHEL entitlement and updates. RHEL PAYG image variants include:
* Standard RHEL
* RHEL for SAP
* RHEL for SAP with High Availability and Update Services.

You may want to use the PAYG images if you don't want to worry about paying separately for the appropriate number of subscriptions.

### Red Hat Gold Images (`rhel-byos`)
Azure also offers Red Hat Gold Images. These images may be useful to customers who have existing Red Hat subscriptions and want to use them in Azure. You are required to enable your existing Red Hat subscriptions for Red Hat Cloud Access before you can use them in Azure. Access to these images is granted automatically when your Red Hat subscriptions are enabled for Cloud Access and meet the eligibility requirements. Using these images allows a customer to avoid double-billing that may be incurred from using the PAYG images.
* [Learn how to enable your Red Hat subscriptions for Cloud Access with Azure](https://access.redhat.com/documentation/en-us/red_hat_subscription_management/1/html/red_hat_cloud_access_reference_guide/con-enable-subs)
* [Learn how to locate Red Hat Gold Images in the Azure portal, CLI, or PowerShell Cmdlet](./byos.md)

> [!NOTE]
> Note on double billing: Double billing is incurred when a user pays twice for RHEL subscriptions. This usually happens when a customer uses subscription-manager to attach an entitlement on a RHEL PAYG VM. For example, a customer that uses subscription-manager to attach an entitlement for SAP packages on a RHEL PAYG image will indirectly be double-billed because they will pay twice for RHEL - once through the PAYG premium fee and once through their SAP subscription. This will not happen to BYOS image users.

## Red Hat Update Infrastructure (RHUI)
Azure provides Red Hat Update Infrastructure only for PAYG RHEL virtual machines (VMs). RHUI is effectively a mirror of the Red Hat CDNs but is only accessible to the Azure PAYG RHEL VMs. You will have access to the appropriate packages depending on which RHEL image you have deployed. For example, a RHEL for SAP image will have access to the SAP packages in addition to base RHEL packages.

### RHUI update behavior
RHEL images connected to RHUI will, by default, update to the latest minor version of RHEL when a `yum update` is run. This behavior means that a RHEL 7.4 VM may get upgraded to RHEL 7.7 if a `yum update` operation is run on it. This is by design of RHUI. However, this upgrade behavior can be mitigated by switching from regular RHEL repositories to the [Extended Update Support (EUS) repositories](./redhat-rhui.md#rhel-eus-and-version-locking-rhel-vms).

## Next steps
* Learn more about [RHEL images on Azure](./redhat-images.md)
* Learn more about [Red Hat Update Infrastructure](./redhat-rhui.md)
* Learn more about the [Red Hat Gold Image (`rhel-byos`) offer](./byos.md)
