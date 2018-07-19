---
title: Create a VM with a static public IP address - Azure portal | Microsoft Docs
description: Learn how to create a VM with a static public IP address using the Azure portal.
services: virtual-network
documentationcenter: na
author: jimdial
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: e9546bcc-f300-428f-b94a-056c5bd29035
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/04/2016
ms.author: jdial
ms.custom: H1Hack27Feb2017

---
# Create a VM with a static public IP address using the Azure portal

> [!div class="op_single_selector"]
> * [Azure portal](virtual-network-deploy-static-pip-arm-portal.md)
> * [PowerShell](virtual-network-deploy-static-pip-arm-ps.md)
> * [Azure CLI](virtual-network-deploy-static-pip-arm-cli.md)
> * [PowerShell (Classic)](virtual-networks-reserved-public-ip.md)

[!INCLUDE [virtual-network-deploy-static-pip-intro-include.md](../../includes/virtual-network-deploy-static-pip-intro-include.md)]

> [!NOTE]
> Azure has two different deployment models for creating and working with resources:  [Resource Manager and classic](../resource-manager-deployment-model.md). This article covers using the Resource Manager deployment model, which Microsoft recommends for most new deployments instead of the classic deployment model.

[!INCLUDE [virtual-network-deploy-static-pip-scenario-include.md](../../includes/virtual-network-deploy-static-pip-scenario-include.md)]

## Create a VM with a static public IP

To create a VM with a static public IP address in the Azure portal, complete the following steps:

1. From a browser, navigate to the [Azure portal](https://portal.azure.com) and, if necessary, sign in with your Azure account.
2. On the top left-hand corner of the portal, click **Create a resource**>>**Compute**>**Windows Server 2012 R2 Datacenter**.
3. In the **Select a deployment model** list, select **Resource Manager** and click **Create**.
4. In the **Basics** pane, enter the VM information as follows, and then click **OK**.
   
    ![Azure portal - Basics](./media/virtual-network-deploy-static-pip-arm-portal/figure1.png)
5. In the **Choose a size** pane, click **A1 Standard** as follows, and then click **Select**.
   
    ![Azure portal - Choose a size](./media/virtual-network-deploy-static-pip-arm-portal/figure2.png)
6. In the **Settings** pane, click **Public IP address**, then in the **Create public IP address** pane, under **Assignment**, click **Static** as follows. And, then click **OK**.
   
    ![Azure portal - Create public IP address](./media/virtual-network-deploy-static-pip-arm-portal/figure3.png)
7. In the **Settings** pane, click **OK**.
8. Review the **Summary** pane, as follows, and then click **OK**.
   
    ![Azure portal - Create public IP address](./media/virtual-network-deploy-static-pip-arm-portal/figure4.png)
9. Notice the new tile in your dashboard.
   
    ![Azure portal - Create public IP address](./media/virtual-network-deploy-static-pip-arm-portal/figure5.png)
10. Once the VM is created, the **Settings** pane displays as follows:
    
    ![Azure portal - Create public IP address](./media/virtual-network-deploy-static-pip-arm-portal/figure6.png)

## Set IP addresses within the operating system

You should never manually assign the public IP address assigned to an Azure virtual machine within the virtual machine's operating system. It’s recommended that you do not statically assign the private IP assigned to the Azure virtual machine within the operating system of a VM, unless necessary, such as when [assigning multiple IP addresses to a Windows VM](virtual-network-multiple-ip-addresses-portal.md). If you do manually set the private IP address within the operating system, ensure that it is the same address as the private IP address assigned to the Azure [network interface](virtual-network-network-interface-addresses.md#change-ip-address-settings), or you can lose connectivity to the virtual machine. Learn more about [private IP address](virtual-network-network-interface-addresses.md#private) settings.

## Next steps

Any network traffic can flow to and from the VM created in this article. You can define inbound and outbound security rules within a network security group that limit the traffic that can flow to and from the network interface, the subnet, or both. To learn more about network security groups, see [Network security group overview](security-overview.md).