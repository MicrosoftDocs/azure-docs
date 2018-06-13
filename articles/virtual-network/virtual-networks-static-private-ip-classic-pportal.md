---
title: Configure private IP addresses for VMs (Classic) - Azure portal | Microsoft Docs
description: Learn how to configure private IP addresses for virtual machines (Classic) using the Azure portal.
services: virtual-network
documentationcenter: na
author: genlin
manager: cshepard
editor: tysonn
tags: azure-service-management

ms.assetid: b8ef8367-58b2-42df-9f26-3269980950b8
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/04/2016
ms.author: genli
ms.custom: H1Hack27Feb2017

---
# Configure private IP addresses for a virtual machine (Classic) using the Azure portal

[!INCLUDE [virtual-networks-static-private-ip-selectors-classic-include](../../includes/virtual-networks-static-private-ip-selectors-classic-include.md)]

[!INCLUDE [virtual-networks-static-private-ip-intro-include](../../includes/virtual-networks-static-private-ip-intro-include.md)]

[!INCLUDE [azure-arm-classic-important-include](../../includes/azure-arm-classic-important-include.md)]

This article covers the classic deployment model. You can also [manage a static private IP address in the Resource Manager deployment model](virtual-networks-static-private-ip-arm-pportal.md).

[!INCLUDE [virtual-networks-static-ip-scenario-include](../../includes/virtual-networks-static-ip-scenario-include.md)]

The sample steps that follow expect a simple environment already created. If you want to run the steps as they are displayed in this document, first build the test environment described in [create a vnet](virtual-networks-create-vnet-classic-pportal.md).

## How to specify a static private IP address when creating a VM
To create a VM named *DNS01* in the *FrontEnd* subnet of a VNet named *TestVNet* with a static private IP of *192.168.1.101*, complete the following steps:

1. From a browser, navigate to https://portal.azure.com and, if necessary, sign in with your Azure account.
2. Select **NEW** > **Compute** > **Windows Server 2012 R2 Datacenter**, notice that the **Select a deployment model** list already shows **Classic**, and then select **Create**.
   
    ![Create VM in Azure portal](./media/virtual-networks-static-ip-classic-pportal/figure01.png)
3. Under **Create VM**, enter the name of the VM to be created (*DNS01* in the scenario), the local administrator account, and password.
   
    ![Create VM in Azure portal](./media/virtual-networks-static-ip-classic-pportal/figure02.png)
4. Select **Optional Configuration** > **Network** > **Virtual Network**, and then select **TestVNet**. If **TestVNet** is not available, make sure you are using the *Central US* location and have created the test environment described at the beginning of this article.
   
    ![Create VM in Azure portal](./media/virtual-networks-static-ip-classic-pportal/figure03.png)
5. Under **Network**, make sure the subnet currently selected is *FrontEnd*, then select **IP addresses**, under **IP address assignment** select **Static**, and then enter *192.168.1.101* for **IP Address** as seen below.
   
    ![Create VM in Azure portal](./media/virtual-networks-static-ip-classic-pportal/figure04.png)    
6. Select **OK** under **IP addresses**, select **OK** under **Network**, and then select **OK** under **Optional config**.
7. Under **Create VM**, select **Create**. Notice the tile below displayed in your dashboard:
   
    ![Create VM in Azure portal](./media/virtual-networks-static-ip-classic-pportal/figure05.png)

## How to retrieve static private IP address information for a VM
To view the static private IP address information for the VM created with the steps above, execute the steps below.

1. From the Azure portal, select **BROWSE ALL** > **Virtual machines (classic)** > **DNS01** > **All settings** > **IP addresses** and notice the IP address assignment and IP address as seen below.
   
    ![Create VM in Azure portal](./media/virtual-networks-static-ip-classic-pportal/figure06.png)

## How to remove a static private IP address from a VM

Under **IP addresses**, select **Dynamic** to the right of **IP address assignment**, select **Save**, and then select **Yes**, as shown in the following picture:
   
    ![Create VM in Azure portal](./media/virtual-networks-static-ip-classic-pportal/figure07.png)

## How to add a static private IP address to an existing VM

1. Under **IP addresses**, shown previously, select **Static** to the right of **IP address assignment**.
2. Type *192.168.1.101* for **IP address**, select **Save**, and then select **Yes**.

## Set IP addresses within the operating system

It’s recommended that you do not statically assign the private IP assigned to the Azure virtual machine within the operating system of a VM, unless necessary. If you do manually set the private IP address within the operating system, ensure that it is the same address as the private IP address assigned to the Azure VM, or you can lose connectivity to the virtual machine. You should never manually assign the public IP address assigned to an Azure virtual machine within the virtual machine's operating system.

## Next steps
* Learn about [reserved public IP](virtual-networks-reserved-public-ip.md) addresses.
* Learn about [instance-level public IP (ILPIP)](virtual-networks-instance-level-public-ip.md) addresses.
* Consult the [Reserved IP REST APIs](https://msdn.microsoft.com/library/azure/dn722420.aspx).

