---
title: Create a zoned Linux VM with the Azure Portal | Microsoft Docs
description: Create a Linux VM in an availability zone with the Azure CLI
services: virtual-machines-linux
documentationcenter: virtual-machines
author: dlepow
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: 
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 09/08/2017
ms.author: danlep
ms.custom: mvc
---

# Create a Linux virtual machine in an availability zone with the Azure portal

Azure virtual machines can be created through the Azure portal. This method provides a browser-based user interface for creating and configuring virtual machines and all related resources. This article steps through creating a virtual machine in an availability zone (preview). An [availability zone](../availability-zones/az-overview.md) is a physically separate zone in an Azure region. You learn how to:

> [!div class="checklist"]
> * Create a VM in an availability zone
> * 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create SSH key pair

You need an SSH key pair to complete this quick start. If you have an existing SSH key pair, this step can be skipped.

From a Bash shell, run this command and follow the on-screen directions. The command output includes the file name of the public key file. Copy the contents of the public key file to the clipboard.

```bash
ssh-keygen -t rsa -b 2048
```

## Log in to Azure 

Log in to the Azure portal at https://portal.azure.com.

## Create virtual machine

1. Click the **New** button found on the upper left-hand corner of the Azure portal.

2. Select **Compute**, and then select **Ubuntu Server 16.04 LTS**. 

3. Enter the virtual machine information. For **Authentication type**, select **SSH public key**. When pasting in your SSH public key, take care to remove any leading or trailing white space. When complete, click **OK**.

    ![Enter basic information about your VM in the portal blade](./media/create-portal-availability-zone/create-vm-portal-basic-blade.png)

4. Select a size for the VM. To see more sizes, select **View all** or change the **Supported disk type** filter. Take care to select one of the sizes supported in the availability zones preview, such as *DS1_v2 Standard*. 

    ![Screenshot that shows VM sizes](./media/create-portal-availability-zone/create-linux-vm-portal-sizes.png)  

5. Under **Settings** > **High availability**, select one of the numbered zones from the **Availability zone** dropdown, keep the remaining defaults, and click **OK**.

    ![Select an availability zone](./media/create-portal-availability-zone/create-linux-vm-portal-availability-zone.png)

6. On the summary page, click **Purchase** to start the virtual machine deployment.

7. The VM will be pinned to the Azure portal dashboard. Once the deployment has completed, the VM summary automatically opens.




## Next steps

In this article, you learned about VMs in an availability zone such as how to:

> [!div class="checklist"]
> * Create a VM in availability zone

