---
title: Disable VMMD blob creation for Confidential VMs
description: Instructions for opting out of the Virtual Machine Metablob Disk (VMMD).
author: linuxelf001
ms.topic: include
ms.service: azure-virtual-machines
ms.date: 03/11/2026
ms.author: raginjup
ms.reviewer: raginjup
ms.custom: include file
---

# Disable VMMD blob creation for Confidential VMs

This article outlines the background and the steps required to opt out of the newly introduced Virtual Machine Metadata (VMMD) blob feature in the Microsoft Azure Confidential VMs.

Microsoft Azure Confidential VMs (CVMs) recently adopted a **3blob** architecture comprising disk, VM Guest State (VMGS), and Virtual Machine Metadata (VMMD) blobs. This architecture update moves key information from the VMGS blob to a new VMMD blob to provide seamless support for various online key rotation scenarios.

Automation built for the previous architecture involving export, import, and upload scenarios may fail for certain workflows. If your workflows include a breaking scenario, you can deploy confidential VMs with legacy format by registering the `DisableConfidentialVMMetadataBlob` preview feature.

## Prerequisites

Before beginning, check to make sure that you have the following:

* An Azure account with an active subscription. [Create an account for free.](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn)
* A confidential VM with managed disks.

## Required Access

To list, register, or unregister preview features in your Azure subscription, you need access to the `Microsoft.Features/*` actions. This permission is granted through the [Contributor](../role-based-access-control/built-in-roles/privileged.md#contributor) and [Owner](../role-based-access-control/built-in-roles/privileged.md#owner) built-in roles. You can also specify the required access through a [custom role](../role-based-access-control/custom-roles.md).

> [!NOTE]
> The portal only shows a preview feature when the service that owns the feature explicitly opts in. The opt-out enablement would have to set on customer subscriptions and then the customers can continue to use **2blob** CVMs. <br><br> AFEC Name: Microsoft.Compute/DisableConfidentialVMMetadataBlob <br> Preview feature name: DisableConfidentialVMMetadataBlob <br><br> [Learn More…](../azure-resource-manager/management/preview-features.md)

## How to Opt Out of VMMD Blob creation

To opt out of the **3blob** architecture and disable the VMMD creation, follow these steps to register the `DisableConfidentialVMMetadataBlob` feature through the Azure portal:

1. Sign in to the Azure portal.

2. Search for `Subscriptions` in the top search bar and click on the link.
![Screenshot of Subscriptions in the search bar.](media/search-subscriptions.png)

3. On the `Subscriptions` page, select the name of the subscription you wish to configure.

4. In the left menu, under `Settings`, select `Preview features`.
![Screenshot of Preview features under settings.](media/access-preview-features.png)

5. In the filter box of the `Preview features` screen, enter `DisableConfidentialVMMetadataBlob` and select the feature from the list.
![Screenshot of DisableConfidentialVMMetadataBlob preview feature.](media/disable-confidential-vm-feature.png)

6. Select Register.
![Screenshot of registering preview feature.](media/register-confidential-vm-feature.png)

The status changes to `Registered` once the process completes.

## Features Disabled After Opting Out

Using the legacy **2blob** architecture prevents access to the following services and capabilities designed for the new **3blob** format used in the latest Confidential VMs.

* **Backup and Restore**<br>
The Azure Backup service doesn't support 2 blob confidential VMs configured with the opt-out feature. 

* **Key Rotation**<br>
Online key rotation depends on the VMMD blob and therefore is only available for **3blob** resources. Confidential VMs using the **2blob** format can't rotate keys while online. Automated key rotation may also fail if the resource is online.


## Next Steps

* [Deploy a confidential VM from Azure](/azure/confidential-computing/quick-create-confidential-vm-portal)
* [Azure confidential computing documentation](/azure/confidential-computing/)

## Related Articles

* [Azure managed disks overview](/azure/virtual-machines/managed-disks-overview)
* [Managed disk migration guide](/azure/virtual-machines/linux/convert-unmanaged-to-managed-disks) 
