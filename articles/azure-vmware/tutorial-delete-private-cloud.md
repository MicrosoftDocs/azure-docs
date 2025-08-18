---
title: Tutorial - Delete an Azure VMware Solution private cloud
description: Learn how to delete an Azure VMware Solution private cloud that you no longer need.
ms.topic: tutorial
ms.service: azure-vmware
ms.date: 12/19/2023
ms.custom: engagement-fy23
# Customer intent: "As a cloud administrator, I want to delete an Azure VMware Solution private cloud, so that I can manage resources effectively and remove unnecessary infrastructure that is no longer needed."
---

# Tutorial: Delete an Azure VMware Solution private cloud

If you have an Azure VMware Solution private cloud that you no longer need, you can delete it. The private cloud includes:

* An isolated network domain

* One or more provisioned vSphere clusters on dedicated server hosts

* Several virtual machines (VMs)

When you delete a private cloud, all VMs, their data, clusters, and network address space provisioned get deleted. The dedicated Azure VMware Solution hosts are securely wiped and returned to the free pool.

> [!CAUTION]
> Deleting the private cloud terminates all running workloads and components and is an irreversible operation. Once you delete the private cloud, you cannot recover the data.

## Prerequisites

If you require the VMs and their data later, make sure to back up the data before you delete the private cloud.  Unfortunately, there's no way to recover the VMs and their data.

## Delete the private cloud

1. Access the Azure VMware Solutions console in the [Azure portal](https://portal.azure.com).  
   
   >[!NOTE]
   >If you need access to the Azure US Gov portal, go to https://portal.azure.us/

2. Select the private cloud you want to delete.

3. Enter the name of the private cloud and select **Yes**.

> [!NOTE]
> The deletion process takes a few hours to complete.  The Delete icon is at the top of the Azure VMware Solution private cloud and Overview section in the portal. Selecting Delete requires you to add the private cloud name and reason to delete.
