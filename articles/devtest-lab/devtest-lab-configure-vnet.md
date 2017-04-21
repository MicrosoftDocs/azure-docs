---
title: Configure a virtual network in Azure DevTest Labs  | Microsoft Docs
description: Learn how to configure an existing virtual network and subnet, and use them in a VM with Azure DevTest Labs
services: devtest-lab,virtual-machines
documentationcenter: na
author: tomarcher
manager: douge
editor: ''

ms.assetid: 6cda99c2-b87e-4047-90a0-5df10d8e9e14
ms.service: devtest-lab
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/16/2017
ms.author: tarcher

---
# Configure a virtual network in Azure DevTest Labs
As explained in the article, [Add a VM with artifacts to a lab](devtest-lab-add-vm-with-artifacts.md), when you create a VM in a lab, you can specify a configured virtual network. 
One scenario for doing this is if you need to access your corpnet resources from your VMs using the virtual network that was configured with ExpressRoute or site-to-site VPN. 
The following sections illustrate how to add your existing virtual network into a lab's Virtual Network settings so that it is available to choose when creating VMs.

## Configure a virtual network for a lab using the Azure portal
The following steps walk you through adding an existing virtual network (and subnet) to a lab so that it can be used when creating a VM in the same lab. 

1. Sign in to the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040).
2. Select **More Services**, and then select **DevTest Labs** from the list.
3. From the list of labs, select the desired lab. 
4. On the lab's blade, select **Configuration**.
5. On the lab's **Configuration** blade, select **Virtual networks**.
6. On the **Virtual networks** blade, you see a list of virtual networks configured for the current lab as well
   as the default virtual network that is created for your lab. 
7. Select **+ Add**.
   
    ![Add an existing virtual network to your lab](./media/devtest-lab-configure-vnet/lab-settings-vnet-add.png)
8. On the **Virtual network** blade, select **[Select virtual network]**.
   
    ![Select an existing virtual network](./media/devtest-lab-configure-vnet/lab-settings-vnets-vnet1.png)
9. On the **Choose virtual network** blade, select the desired virtual network. The blade shows all the virtual networks that are under the same region in the subscription as the lab.  
10. After selecting a virtual network, you are returned to the **Virtual network** Click the subnet in the list at the bottom of the blade.

    ![Subnet list](./media/devtest-lab-configure-vnet/lab-settings-vnets-vnet2.png)
    
    The Lab Subnet blade is displayed.

    ![Lab subnet blade](./media/devtest-lab-configure-vnet/lab-subnet.png)

11. Specify a **Lab subnet name**.
12. To allow a subnet to be used in lab VM creation, select **Use in virtual machine creation**.
13. To enable a [shared public IP address](devtest-lab-shared-ip.md), select **Enable shared public IP**.
14. To allow public IP addresses in a subnet, select **Allow public IP creation**.
15. In the **Maximum virtual machines per user** field, specify the maximum VMs per user for each subnet. If you want an unrestricted number of VMs, leave this field blank.
16. Select **OK** to close the Lab Subnet blade.
17. Select **Save** to close the Virtual network blade.
18. Now that the virtual network is configured, it can be selected when creating a VM. 
    To see how to create a VM and specify a virtual network, refer to the article, [Add a VM with artifacts to a lab](devtest-lab-add-vm-with-artifacts.md). 

[!INCLUDE [devtest-lab-try-it-out](../../includes/devtest-lab-try-it-out.md)]

## Next steps
Once you have added the desired virtual network to your lab, the next step is to [add a VM to your lab](devtest-lab-add-vm-with-artifacts.md).

