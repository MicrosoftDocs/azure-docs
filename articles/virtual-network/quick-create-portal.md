---
title: Create a virtual network in Azure - Portal | Microsoft Docs
description: Quickly learn to create a virtual network using the Azure portal. A virtual network enables many types of Azure resources to communicate privately with each other.
services: virtual-network
documentationcenter: virtual-network
author: jimdial
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-network
ms.devlang: na
ms.topic: 
ms.tgt_pltfrm: virtual-network
ms.workload: infrastructure
ms.date: 01/25/2018
ms.author: jdial
ms.custom: 
---

# Create a virtual network using the Azure portal

In this article, you learn how to create a virtual network. After creating a virtual network, you deploy two virtual machines into the virtual network to test private network communication between them.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Log in to Azure 

Log in to the Azure portal at http://portal.azure.com.

## Create a virtual network

1. Select **+ Create a resource** on the upper, left corner of the Azure portal.
2. Select **Networking**, and then select **Virtual network**.
3. As shown in the following picture, enter *myVirtualNetwork* for **Name**, *myResourceGroup* for **Resource group**, select a **Location** and your **Subscription**, accept the remaining defaults, and then select **Create**. 

    ![Enter basic information about your virtual network](./media/quick-create-portal/virtual-network.png)

    The **Address space** is specified in CIDR notation. The address space 10.0.0.0/16 encompasses 10.0.0.0-10.0.255.254. A virtual network contains zero or more subnets. The specified subnet **Address range** includes the IP addresses 10.0.0.0-10.0.0.255. Only 10.0.0.4-10.0.0.254 are available however, because Azure reserves the first four addresses (0-3) and the last address in each subnet. The available IP addresses are assigned to resources deployed within a virtual network.

## Test network communication

A virtual network enables several types of Azure resources to communicate privately with each other. One type of resource you can deploy into a virtual network is a virtual machine. Create two virtual machines in the virtual network so you can validate private communication between them in a later step.

### Create virtual machines

1. Select **+ Create a resource** found on the upper, left corner of the Azure portal.
2. Select **Compute**, and then select **Windows Server 2016 Datacenter**.
3. Enter virtual machine information shown in the picture that follows. The **User name** and **Password** you enter are used to log in to the virtual machine in a later step. The password must be at least 12 characters long and meet the [defined complexity requirements](../virtual-machines/windows/faq.md?toc=%2fazure%2fvirtual-network%2ftoc.json#what-are-the-password-requirements-when-creating-a-vm). Select your **Subscription**, choose to use the existing *myResourceGroup* resource group, and ensure that the **Location** selected is the same location you created the virtual network in. When complete, select **OK**.

    ![Enter basic information about a virtual machine](./media/quick-create-portal/virtual-machine-basics.png)
4. Select a size for the virtual machine and then select **Select**. To see more sizes, select **View all** or change the **Supported disk type** filter. The sizes that appear for you may be different than the following example: 

    ![Select a size for a virtual machine](./media/quick-create-portal/virtual-machine-size.png)
5. Under **Settings**, *myVirtualNetwork* should already be selected for **Virtual network**, but if it's not, select **Virtual network**, then select *myVirtualNetwork*. Leave *default* selected for **Subnet**, and then select **OK**.

    ![Select a virtual network](./media/quick-create-portal/virtual-machine-network-settings.png)
6. On the **Summary** page, select **Create** to start the virtual machine deployment. 
7. The virtual machine takes a few minutes to create. After creation, the virtual machine is pinned to the Azure portal dashboard and the virtual machine summary automatically opens. Select **Networking**.

    ![Virtual machine networking information](./media/quick-create-portal/virtual-machine-networking.png)

    You see that the **Private IP** address is *10.0.0.4*. In step 5, under **Settings**, you selected the *myVirtualNetwork* virtual network and accepted the subnet named *default* for **Subnet**. When you [created the virtual network](#create-a-virtual-network), you accepted the default value of 10.0.0.0/24 for the subnet **Address range**. Azure's DHCP server assigns the first available address for the subnet you select to the virtual machine. Since Azure reserves the first four addresses (0-3) of each subnet, 10.0.0.4 is the first available IP address available for the subnet.

    The **Public IP** address assigned is different than the address assigned to your virtual machine. Azure assigns a public, Internet routable IP address to each virtual machine, by default. The public IP address is assigned to the virtual machine from a [pool of addresses assigned to each Azure region](https://www.microsoft.com/download/details.aspx?id=41653). While Azure knows which public IP address is assigned to a virtual machine, the operating system running in a virtual machine has no awareness of any public IP address assigned to it.
8. Complete steps 1-7 again, but in step 3, name the virtual machine *myVm2*. 
9. After the virtual machine is created, select **Networking**, as you did in step 7. You see the **Private IP** address is *10.0.0.5*. Since Azure previously assigned the first usable address of *10.0.0.4* in the subnet to the *myVm1* virtual machine, it assigned *10.0.0.5* to the *myVm2* virtual machine, because it was the next available address in the subnet.

### Connect to a virtual machine

1. Remotely connect to the *myVm1* virtual machine. At the top of the Azure portal, enter *myVm1*. When **myVm1** appears in the search results, select it. Select the **Connect** button.

    ![Virtual machine overview](./media/quick-create-portal/virtual-machine-overview.png)
2. After selecting the **Connect** button, a Remote Desktop Protocol (.rdp) file is created and downloaded to your computer.  
3. Open the downloaded rdp file. If prompted, select **Connect**. Enter the user name and password you specified when creating the virtual machine, and then select **OK**. You may receive a certificate warning during the sign-in process. Select **Yes** or **Continue** to proceed with the connection.

### Validate communication

Attempting to ping a Windows virtual machine fails, because ping is not allowed through the Windows firewall, by default. To allow ping to *myVm1*, enter the following command from a command prompt:

```
netsh advfirewall firewall add rule name=Allow-ping protocol=icmpv4 dir=in action=allow
```

To validate communication with *myVm2*, enter the following command from a command prompt on the *myVm1* virtual machine. Provide the credentials you used when you created the virtual machine, and then complete the connection:

```
mstsc /v:myVm2
```

The remote desktop connection is successful because both virtual machines have private IP addresses assigned from the *default* subnet and because remote desktop is open through the Windows firewall, by default. You are able to connect to *myVm2* by hostname because Azure automatically provides DNS name resolution for all hosts within a virtual network. From a command prompt, ping *myVm1*, from *myVm2*.

```
ping myvm1
```

Ping is successful because you allowed it through the Windows firewall on the *myVm1* virtual machine in a previous step. To confirm outbound communication to the Internet, enter the following command:

```
ping bing.com
```

You receive four replies from bing.com. By default, any virtual machine in a virtual network can communicate outbound to the Internet. 

Exit the remote desktop session.

## Clean up resources

When no longer needed, delete the resource group and all resources it contains:

1. Enter *myResourceGroup* in the **Search** box at the top of the portal. When you see **myResourceGroup** in the search results, select it.
2. Select **Delete resource group**.
3. Enter *myResourceGroup* for **TYPE THE RESOURCE GROUP NAME:** and select **Delete**.

## Next steps

In this article, you deployed a default virtual network with one subnet. To learn how to create a custom virtual network with multiple subnets, continue to the tutorial for creating a custom virtual network.

> [!div class="nextstepaction"]
> [Create a custom virtual network](virtual-networks-create-vnet-arm-pportal.md)
