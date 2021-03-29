---
title: Tutorial - Delete an Azure VMware Solution private cloud
description: Learn how to delete an Azure VMware Solution private cloud that you no longer need.
ms.topic: tutorial
ms.date: 03/13/2021
---

# Tutorial: Delete an Azure VMware Solution private cloud

If you have an Azure VMware Solution private cloud that you no longer need, you can delete it. The private cloud includes an isolated network domain, one or more provisioned vSphere clusters on dedicated server hosts, and several virtual machines (VMs). When you delete a private cloud, all of the VMs, their data, and clusters are deleted. The dedicated Azure VMware Solution hosts are securely wiped and returned to the free pool. The network address space provisioned is also deleted.  

> [!CAUTION]
> Deleting the private cloud is an irreversible operation. Once the private cloud is deleted, the data cannot be recovered, as it terminates all running workloads and components and destroys all private cloud data and configuration settings, including public IP addresses.

## Prerequisites

If you require the VMs and their data later, make sure to back up the data before you delete the private cloud.  There's no way to recover the VMs and their data.


## Delete the private cloud

1. Access the Azure VMware Solutions console in the [Azure portal](https://portal.azure.com).

2. Select the private cloud to be deleted.
 
3. Enter the name of the private cloud and select **Yes**. 

>[!NOTE]
>The deletion process takes a few hours to complete.  
