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
> * [Template](virtual-network-deploy-static-pip-arm-template.md)
> * [PowerShell (Classic)](virtual-networks-reserved-public-ip.md)

[!INCLUDE [virtual-network-deploy-static-pip-intro-include.md](../../includes/virtual-network-deploy-static-pip-intro-include.md)]

> [!NOTE]
> Azure has two different deployment models for creating and working with resources:  [Resource Manager and classic](../resource-manager-deployment-model.md). This article covers using the Resource Manager deployment model, which Microsoft recommends for most new deployments instead of the classic deployment model.

[!INCLUDE [virtual-network-deploy-static-pip-scenario-include.md](../../includes/virtual-network-deploy-static-pip-scenario-include.md)]

## Create a VM with a static public IP

To create a VM with a static public IP address in the Azure portal, complete the following steps:

1. From a browser, navigate to the [Azure portal](https://portal.azure.com) and, if necessary, sign in with your Azure account.
2. On the top left hand corner of the portal, click **New**>>**Compute**>**Windows Server 2012 R2 Datacenter**.
3. In the **Select a deployment model** list, select **Resource Manager** and click **Create**.
4. In the **Basics** blade, enter the VM information as shown below, and then click **OK**.
   
    ![Azure portal - Basics](./media/virtual-network-deploy-static-pip-arm-portal/figure1.png)
5. In the **Choose a size** blade, click **A1 Standard** as shown below, and then click **Select**.
   
    ![Azure portal - Choose a size](./media/virtual-network-deploy-static-pip-arm-portal/figure2.png)
6. In the **Settings** blade, click **Public IP address**, then in the **Create public IP address** blade, under **Assignment**, click **Static** as shown below. And then click **OK**.
   
    ![Azure portal - Create public IP address](./media/virtual-network-deploy-static-pip-arm-portal/figure3.png)
7. In the **Settings** blade, click **OK**.
8. Review the **Summary** blade, as shown below, and then click **OK**.
   
    ![Azure portal - Create public IP address](./media/virtual-network-deploy-static-pip-arm-portal/figure4.png)
9. Notice the new tile in your dashboard.
   
    ![Azure portal - Create public IP address](./media/virtual-network-deploy-static-pip-arm-portal/figure5.png)
10. Once the VM is created, the **Settings** blade will be displayed as shown below
    
    ![Azure portal - Create public IP address](./media/virtual-network-deploy-static-pip-arm-portal/figure6.png)

## Steps to assign static Public IP to existing VM with no public IP 
Steps to assign static Public IP to existing VM with no public IP
1.	Create new Dynamic IP on VM
      a.	Click on VM, then Network Interface and select the assigned NIC.
      b.	Under the NIC, choose IP configurations, click the name of the IP config to change.
               i.	Enable Public IP, click on IP Address
                      1.	Create New
                               a.	Name the IP and choose Dynamic. Make note of the name to use in 2.b below.
                               b.	If you choose Static, you will get an error indicating that you cannot do this for a NIC already assigned to a VM. 
               ii.	Optional - assign a static internal IP as well
2.	Modify the Public IP to be static
      a.	Click on the icon for All Resources
      b.	Click the name of the public IP created previously.
      c.	Click on Configuration, then choose Static under Assignment and click Save on top of the blade.
3.	Verify the VM now has a Public IP
      a.	Go back to the VM and on the Overview blade, you should now see a public IP.
