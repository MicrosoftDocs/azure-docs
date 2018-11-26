---
title: Create a virtual network - quickstart - Azure portal | Microsoft Docs
description: In this quickstart, you learn to create a virtual network using the Azure portal. A virtual network enables Azure resources, such as virtual machines, to communicate privately with each other, and with the internet.
services: virtual-network
documentationcenter: virtual-network
author: jimdial
manager: jeconnoc
editor: ''
tags: azure-resource-manager
Customer intent: I want to create a virtual network so that virtual machines can communicate with privately with each other and with the internet.

ms.assetid: 
ms.service: virtual-network
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: virtual-network
ms.workload: infrastructure
ms.date: 03/09/2018
ms.author: jdial
ms.custom: mvc
---

# Quickstart: Create a virtual network using the Azure portal

A virtual network enables Azure resources, like virtual machines (VM), to communicate privately with each other, and with the internet. In this quickstart, you learn how to create a virtual network. After creating a virtual network, you deploy two VMs into the virtual network. You then connect to one VM from the internet, and communicate privately between the two VMs.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) now.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create a virtual network

1. On the upper-left side of the screen, select **Create a resource** > **Networking** > **Virtual network**.
2. In **Create virtual network**, enter, or select this information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter *myVirtualNetwork*. |
    | Address space | Enter *10.1.0.0/16*. |
    | Subscription | Select your subscription.|
    | Resource group | Select **Create new** > Enter *myResourceGroup* > Select **OK** |
    | Location | Select **East US**.|
    | Subnet - Name | Enter *myVirtualSubnet*. |
    | Subnet - Address range | Enter *10.1.0.0/24*. |
    <!-- ![Enter basic information about your virtual network](./media/quick-create-portal/create-virtual-network.png) -->
3. Accept the defaults for the remaining settings and select **Create**.

## Create virtual machines

Create two VMs in the virtual network:

### Create the first VM

1. On the upper-left side of the screen, select **Create a resource** > **Compute** > **Windows Server 2016 Datacenter**.
2. In **Create a virtual machine - Basics**, enter, or select this information:

    | Setting | Value |
    | ------- | ----- |
    | **PROJECT DETAILS** | |
    | Subscription | Select your subscription. |
    | Resource group | Select **MyResourceGroup**. You created it in the last section. |
    | **INSTANCE DETAILS** |  |
    | Virtual machine name | Enter *myVm1* |
    | Region | Select **East US**. |
    | Availability options | Leave the default **No infrastructure redundancy required** |
    | Image | Leave the default **Windows Server 2016 Datacenter** |
    | Size | Leave the default **Standard DS1 v2** |
    | **ADMINISTRATOR ACCOUNT** |  |
    | Username | Enter a user name of your choosing. |
    | Password | Enter a password of your choosing. The password must be at least 12 characters long and meet the [defined complexity requirements](../virtual-machines/windows/faq.md?toc=%2fazure%2fvirtual-network%2ftoc.json#what-are-the-password-requirements-when-creating-a-vm).|
    | Confirm Password | Re-enter password. |
    | **INBOUND PORT RULES** |  |
    | Public inbound ports | Leave the default **None**. |
    | **Save MONEY** |  |
    | Already have a Windows license? | Leave the default **No**. |


    <!-- ![Virtual machine basics](./media/quick-create-portal/virtual-machine-basics.png) -->

3. Scroll back to the top of the page.
4. Under **Create a virtual machine** click **Management**
5. For **Diagnostics storage account**, select **Create New**.
6. In **Create storage account** enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter *myvmstorageaccount*. |
    | Account kind | Leave the default **Storage (general purpose v1)**. |
    | Performance | Leave the default **Standard**. |
    | Replication | Leave the default **Locally-redundant storage (LRS)**. |

7. Select **OK**
8. Select **Review + create**. You're taken to the **Review + create** page and your configuration is validated.
9. When you see that **Validation passed**, select **Create**.

    <!-- ![Virtual machine settings](./media/quick-create-portal/virtual-machine-settings.png) -->

### Create the second VM

1. Complete steps 1 and 2 from above.

    > [!NOTE]
    > In step 2, enter *myVm2* for the **Virtual machine name**.

2. Select **Review + create**. You're taken to the **Review + create** page and your configuration is validated.
3. When you see that **Validation passed**, select **Create**.

## Connect to vm1 from the internet

After *myVm1* is created, you can connect to it over the internet.

1. In the portal's search bar, enter *myVm1* and select it when it appears in the search results, select it
2. Select the **Connect** button.

    ![Connect to a virtual machine](./media/quick-create-portal/connect-to-virtual-machine.png)

    After selecting the **Connect** button, **Connect to virtual machine** opens.

3. Select **Download RDP File**. A Remote Desktop Protocol (.rdp) file is created and downloaded to your computer.

3. Open the downloaded .rdp file. If prompted, select **Connect**. Enter the user name and password you specified when creating the VM. You may need to select **More choices**, then **Use a different account**, to specify the credentials you entered when you created the VM.
4. Select **OK**.
5. You may receive a certificate warning during the sign-in process. If you receive the warning, select **Yes** or **Continue**, to proceed with the connection.

## Communicate between VMs

1. From PowerShell, enter `ping myvm2`. Ping fails, because ping uses the Internet Control Message Protocol (ICMP), and ICMP is not allowed through the Windows firewall, by default.
2. To allow *myVm2* to ping *myVm1* in a later step, enter the following command from PowerShell, which allows ICMP inbound through the Windows firewall:

    ```powershell
    New-NetFirewallRule –DisplayName “Allow ICMPv4-In” –Protocol ICMPv4
    ```

3. Close the remote desktop connection to *myVm1*.

4. Complete the steps in [Connect to a VM from the internet](#connect-to-a-vm-from-the-internet) again, but connect to *myVm2*. From a command prompt, enter `ping myvm1`.

    You receive replies from *myVm1*, because you allowed ICMP through the Windows firewall on the *myVm1* VM in a previous step.

5. Close the remote desktop connection to *myVm2*.

## Clean up resources

When no longer needed, delete the resource group and all of the resources it contains:

1. Enter *myResourceGroup* in the **Search** box at the top of the portal. When you see **myResourceGroup** in the search results, select it.
2. Select **Delete resource group**.
3. Enter *myResourceGroup* for **TYPE THE RESOURCE GROUP NAME:** and select **Delete**.

## Next steps

In this quickstart, you created a default virtual network and two VMs. You connected to one VM from the internet and communicated privately between the VM and another VM. To learn more about virtual network settings, see [Manage a virtual network](manage-virtual-network.md).

By default, Azure allows unrestricted private communication between virtual machines, but only allows inbound remote desktop connections to Windows VMs from the internet. To learn how to allow or restrict different types of network communication to and from VMs, advance to the [Filter network traffic](tutorial-filter-network-traffic.md) tutorial.