---
title: Tutorial - Delete an Azure VMware Solution private cloud
description: Learn how to delete an Azure VMware Solution private cloud that you no longer need.
ms.topic: tutorial
ms.date: 02/09/2021
---

# Tutorial: Delete an Azure VMware Solution private cloud

If you have an Azure VMware Solution private cloud that you no longer need, you can delete it. An Azure VMware Solution private cloud includes an isolated network domain, one or more provisioned vSphere clusters on dedicated server hosts, and several virtual machines. When a private cloud is deleted, all of the virtual machines, their data, and clusters are deleted. The dedicated bare-metal hosts are securely wiped and returned to the free pool. The network domain provisioned for the customer is deleted.  

> [!CAUTION]
> Deleting the private cloud is an irreversible operation. Once the private cloud is deleted, the data cannot be recovered, as it terminates all running workloads and components and destroys all private cloud data and configuration settings, including public IP addresses.

## Prerequisites

Once a private cloud is deleted, there's no way to recover the virtual machines and their data. If the virtual machine data will be required later, the admin must first back up all of the data before deleting the private cloud.

## Delete the private cloud

1. Access the Azure VMware Solutions console in the [Azure portal](https://portal.azure.com).

2. Select the private cloud to be deleted.
 
3. Enter the name of the private cloud and select **Yes**. 

>[!NOTE]
>The deletion process takes a few hours to complete.  
