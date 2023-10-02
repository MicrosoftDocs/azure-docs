---
title: Red Hat workloads on Azure overview | Microsoft Docs
description: Learn about the Red Hat product offerings available on Azure.
author: mamccrea
ms.service: virtual-machines
ms.subservice: redhat
ms.custom: devx-track-linux
ms.collection: linux
ms.topic: overview
ms.date: 02/10/2020
ms.author: mamccrea
---

# Red Hat workloads on Azure

**Applies to:** :heavy_check_mark: Linux VMs 

Red Hat workloads are supported through a variety of offerings on Azure. Red Hat Enterprise Linux (RHEL) images are at the core of RHEL workloads, as is the Red Hat Update Infrastructure (RHUI).

## Red Hat Enterprise Linux images

Azure offers a wide offering of RHEL images on Azure. These images are made available through two different licensing models: pay-as-you-go and bring-your-own-subscription (BYOS). New RHEL images on Azure are published when new RHEL versions are released and updated throughout their lifecycles, as necessary.

### Pay-as-you-go images

Azure offers a variety of RHEL pay-as-you-go images. These images come properly entitled for RHEL and are attached to a source of updates (Red Hat Update Infrastructure). These images charge a premium fee for the RHEL entitlement and updates. RHEL pay-as-you-go image variants include:

* RHEL
* RHEL for SAP
* RHEL for SAP with High Availability (HA) and Update Services
* RHEL with High Availability (HA) and Update Services

You might want to use the pay-as-you-go images if you don't want to worry about paying separately for the appropriate number of subscriptions.

### Red Hat Gold Images

Azure also offers Red Hat Gold Images (`rhel-byos`). These images might be useful to customers who have existing Red Hat subscriptions and want to use them in Azure. You're required to enable your existing Red Hat subscriptions for Red Hat Cloud Access before you can use them in Azure. Access to these images is granted automatically when your Red Hat subscriptions are enabled for Cloud Access and meet the eligibility requirements. Using these images allows a customer to avoid double billing that might be incurred from using the pay-as-you-go images.
* Learn how to [enable your Red Hat subscriptions for Cloud Access with Azure](https://access.redhat.com/documentation/en-us/red_hat_subscription_management/1/html/red_hat_cloud_access_reference_guide/red-hat-cloud-access-program-overview_cloud-access#ref_ca-unit-conversion_cloud-access).
* Learn how to [locate Red Hat Gold Images in the Azure portal, the Azure CLI, or PowerShell cmdlet](./byos.md).

> [!NOTE]
> Double billing is incurred when a user pays twice for RHEL subscriptions. This scenario usually happens when a customer uses Red Hat Subscription-Manager to attach an entitlement on a RHEL pay-as-you-go VM. For example, a customer who uses Subscription-Manager to attach an entitlement for SAP packages on a RHEL pay-as-you-go image is indirectly double billed because they pay twice for RHEL. They pay once through the pay-as-you-go premium fee and once through their SAP subscription. This scenario doesn't happen to BYOS image users.

### Generation 2 images

Generation 2 virtual machines (VMs) provide some newer features compared to Generation 1 VMs. For more information, see the [Generation 2 documentation](../../generation-2.md). The key difference from a RHEL image perspective is that Generation 2 VMs use a UEFI instead of BIOS firmware interface. They also use a GUID Partition Table (GPT) instead of a master boot record (MBR) on boot time. Use of a GPT allows for, among other things, OS disk sizes larger than 2 TB. In addition, the [Mv2 series VMs](../../mv2-series.md) run only on Generation 2 images.

RHEL Generation 2 images are available in the Azure Marketplace. Look for "gen2" in the image SKU in the list of all images that appears when you use the Azure CLI. Go to the **Advanced** tab in the VM deploy process to deploy a Generation 2 VM.

## Red Hat Update Infrastructure

Azure provides Red Hat Update Infrastructure only for pay-as-you-go RHEL VMs. RHUI is effectively a mirror of the Red Hat CDNs but is only accessible to the Azure pay-as-you-go RHEL VMs. You have access to the appropriate packages depending on which RHEL image you've deployed. For example, a RHEL for SAP image has access to the SAP packages in addition to base RHEL packages.

### RHUI update behavior

RHEL images connected to RHUI update by default to the latest minor version of RHEL when a `yum update` is run. This behavior means that a RHEL 7.4 VM might get upgraded to RHEL 7.7 if a `yum update` operation is run on it. This behavior is by design for RHUI. To mitigate this upgrade behavior, switch from regular RHEL repositories to [Extended Update Support repositories](./redhat-rhui.md#rhel-eus-and-version-locking-rhel-vms).

## Red Hat Middleware

Microsoft and Azure have partnered to develop a variety of solutions for running Red Hat Middleware on Azure. Learn more about JBoss EAP on Azure Virtual Machines and Azure App service at [Red Hat JBoss EAP on Azure](/azure/developer/java/ee/jboss-on-azure).

## Next steps

* Learn more about [RHEL images on Azure](./redhat-images.md).
* Learn more about [Red Hat Update Infrastructure](./redhat-rhui.md).
* Learn more about the [Red Hat Gold Image (`rhel-byos`) offer](./byos.md).
