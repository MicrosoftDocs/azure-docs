---
title: Create a virtual network - quickstart - Azure portal
titlesuffix: Azure Virtual Network
description: In this quickstart, you learn to create a virtual network using the Azure portal. A virtual network lets Azure resources, like virtual machines, securely communicate with each other and with the internet
services: virtual-network
documentationcenter: virtual-network
author: KumudD
tags: azure-resource-manager
Customer intent: I want to create a virtual network so that virtual machines can securely communicate with each other and with the internet.
ms.service: virtual-network
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: virtual-network
ms.workload: infrastructure
ms.date: 07/08/2019
ms.author: kumud

---

# Quickstart: Create a virtual network using the Azure portal

A virtual network is the fundamental building block for your private network in Azure. It enables Azure resources, like virtual machines (VMs), to securely communicate with each other and with the internet. In this Quickstart, you will learn how to create a virtual network using the Azure portal. Then, you can deploy two VMs into the virtual network, securely communicate between the two VMs, and connect to the VMs from the internet.


If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) now.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create a virtual network

1. On the upper-left side of the screen, select **Create a resource** > **Networking** > **Virtual network**.

1. In **Create virtual network**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter *myVirtualNetwork*. |
    | Address space | Enter *10.1.0.0/16*. |
    | Subscription | Select your subscription.|
    | Resource group | Select **Create new**, enter *myResourceGroup*, then select **OK**. |
    | Location | Select **East US**.|
    | Subnet - Name | Enter *myVirtualSubnet*. |
    | Subnet - Address range | Enter *10.1.0.0/24*. |

1. Leave the rest as default and select **Create**.

## Create virtual machines

Create two VMs in the virtual network:

### Create the first VM

1. On the upper-left side of the screen, select **Create a resource** > **Compute** > **Windows Server 2019 Datacenter**.

1. In **Create a virtual machine - Basics**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | **PROJECT DETAILS** | |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. You created this in the previous section. |
    | **INSTANCE DETAILS** |  |
    | Virtual machine name | Enter *myVm1*. |
    | Region | Select **East US**. |
    | Availability options | Leave the default **No infrastructure redundancy required**. |
    | Image | Leave the default **Windows Server 2019 Datacenter**. |
    | Size | Leave the default **Standard DS1 v2**. |
    | **ADMINISTRATOR ACCOUNT** |  |
    | Username | Enter a username of your choosing. |
    | Password | Enter a password of your choosing. The password must be at least 12 characters long and meet the [defined complexity requirements](../virtual-machines/windows/faq.md?toc=%2fazure%2fvirtual-network%2ftoc.json#what-are-the-password-requirements-when-creating-a-vm).|
    | Confirm Password | Reenter password. |
    | **INBOUND PORT RULES** |  |
    | Public inbound ports | Leave the default **None**. |
    | **SAVE MONEY** |  |
    | Already have a Windows license? | Leave the default **No**. |

1. Select **Next : Disks**.

1. In **Create a virtual machine - Disks**, leave the defaults and select **Next : Networking**.

1. In **Create a virtual machine - Networking**, select this information:

    | Setting | Value |
    | ------- | ----- |
    | Virtual network | Leave the default **myVirtualNetwork**. |
    | Subnet | Leave the default **myVirtualSubnet (10.1.0.0/24)**. |
    | Public IP | Leave the default **(new) myVm-ip**. |
    | Public inbound ports | Select **Allow selected ports**. |
    | Select inbound ports | Select **HTTP** and **RDP**.

1. Select **Next : Management**.

1. In **Create a virtual machine - Management**, for **Diagnostics storage account**, select **Create New**.

1. In **Create storage account**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter *myvmstorageaccount*. If this name is taken, create a unique name.|
    | Account kind | Leave the default **Storage (general purpose v1)**. |
    | Performance | Leave the default **Standard**. |
    | Replication | Leave the default **Locally-redundant storage (LRS)**. |

1. Select **OK**

1. Select **Review + create**. You're taken to the **Review + create** page where Azure validates your configuration.

1. When you see the **Validation passed** message, select **Create**.

### Create the second VM

1. Complete steps 1 and 9 from above.

    > [!NOTE]
    > In step 2, for the **Virtual machine name**, enter *myVm2*.
    >
    > In step 7, for **Diagnosis storage account**, make sure you select **myvmstorageaccount**.

1. Select **Review + create**. You're taken to the **Review + create** page and Azure validates your configuration.

1. When you see the **Validation passed** message, select **Create**.

## Connect to a VM from the internet

After you've created *myVm1*, connect to the internet.

1. In the portal's search bar, enter *myVm1*.

1. Select the **Connect** button.

    ![Connect to a virtual machine](./media/quick-create-portal/connect-to-virtual-machine.png)

    After selecting the **Connect** button, **Connect to virtual machine** opens.

1. Select **Download RDP File**. Azure creates a Remote Desktop Protocol (*.rdp*) file and downloads it to your computer.

1. Open the downloaded *.rdp* file.

    1. If prompted, select **Connect**.

    1. Enter the username and password you specified when creating the VM.

        > [!NOTE]
        > You may need to select **More choices** > **Use a different account**, to specify the credentials you entered when you created the VM.

1. Select **OK**.

1. You may receive a certificate warning during the sign in process. If you receive a certificate warning, select **Yes** or **Continue**.

1. Once the VM desktop appears, minimize it to go back to your local desktop.

## Communicate between VMs

1. In the Remote Desktop of *myVm1*, open PowerShell.

1. Enter `ping myVm2`.

    You'll receive a message similar to this:

    ```powershell
    Pinging myVm2.0v0zze1s0uiedpvtxz5z0r0cxg.bx.internal.clouda
    Request timed out.
    Request timed out.
    Request timed out.
    Request timed out.

    Ping statistics for 10.1.0.5:
    Packets: Sent = 4, Received = 0, Lost = 4 (100% loss),
    ```

    The `ping` fails, because `ping` uses the Internet Control Message Protocol (ICMP). By default, ICMP isn't allowed through the Windows firewall.

1. To allow *myVm2* to ping *myVm1* in a later step, enter this command:

    ```powershell
    New-NetFirewallRule –DisplayName “Allow ICMPv4-In” –Protocol ICMPv4
    ```

    This command allows ICMP inbound through the Windows firewall:

1. Close the remote desktop connection to *myVm1*.

1. Complete the steps in [Connect to a VM from the internet](#connect-to-a-vm-from-the-internet) again, but connect to *myVm2*.

1. From a command prompt, enter `ping myvm1`.

    You'll get back something like this message:

    ```powershell
    Pinging myVm1.0v0zze1s0uiedpvtxz5z0r0cxg.bx.internal.cloudapp.net [10.1.0.4] with 32 bytes of data:
    Reply from 10.1.0.4: bytes=32 time=1ms TTL=128
    Reply from 10.1.0.4: bytes=32 time<1ms TTL=128
    Reply from 10.1.0.4: bytes=32 time<1ms TTL=128
    Reply from 10.1.0.4: bytes=32 time<1ms TTL=128

    Ping statistics for 10.1.0.4:
        Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
    Approximate round trip times in milli-seconds:
        Minimum = 0ms, Maximum = 1ms, Average = 0ms
    ```

    You receive replies from *myVm1*, because you allowed ICMP through the Windows firewall on the *myVm1* VM in step 3.

1. Close the remote desktop connection to *myVm2*.

## Clean up resources

When you're done using the virtual network and the VMs, delete the resource group and all of the resources it contains:

1. Enter *myResourceGroup* in the **Search** box at the top of the portal and select **myResourceGroup** from the search results.

1. Select **Delete resource group**.

1. Enter *myResourceGroup* for **TYPE THE RESOURCE GROUP NAME** and select **Delete**.

## Next steps

In this Quickstart, you created a default virtual network and two VMs. You connected to one VM from the internet and securely communicated between the two VMs. To learn more about virtual network settings, see [Manage a virtual network](manage-virtual-network.md).

By default, Azure allows unrestricted secure communication between VMs. Conversely, it only allows inbound remote desktop connections to Windows VMs from the internet. To learn more about configuring different types of VM network communications, go to the [Filter network traffic](tutorial-filter-network-traffic.md) tutorial.
