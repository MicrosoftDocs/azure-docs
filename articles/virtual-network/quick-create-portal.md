---
title: 'Quickstart: Create a virtual network - Azure portal'
titleSuffix: Azure Virtual Network
description: In this quickstart, learn how to create a virtual network using the Azure portal.
author: KumudD
ms.author: kumud
ms.date: 03/17/2021
ms.topic: quickstart
ms.service: virtual-network
ms.workload: infrastructure
ms.tgt_pltfrm: virtual-network
ms.devlang: na
tags:
  - azure-resource-manager
ms.custom:
  - mode-portal
---

# Quickstart: Create a virtual network using the Azure portal

In this quickstart, you learn how to create a virtual network using the Azure portal. You deploy two virtual machines (VMs). Next, you securely communicate between VMs and connect to VMs from the internet. A virtual network is the fundamental building block for your private network in Azure. It enables Azure resources, like VMs, to securely communicate with each other and with the internet.

## Prerequisites

* An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create a virtual network

1. Select **Create a resource** in the upper left-hand corner of the portal.

2. In the search box, enter **Virtual Network**. Select **Virtual Network** in the search results.

3. In the **Virtual Network** page, select **Create**.

4. In **Create virtual network**, enter or select this information in the **Basics** tab:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**.  </br> Enter **myResourceGroup**. </br> Select **OK**. |
    | **Instance details** |   |
    | Name | Enter **myVNet**. |
    | Region | Select **(US) East US**. |

    :::image type="content" source="./media/quick-create-portal/create-virtual-network.png" alt-text="Create virtual network Azure portal" border="true":::

5. Select the **IP Addresses** tab, or select the **Next: IP Addresses** button at the bottom of the page.

6. In **IPv4 address space**, select the existing address space and change it to **10.1.0.0/16**.

7. Select **+ Add subnet**, then enter **MySubnet** for **Subnet name** and **10.1.0.0/24** for **Subnet address range**.

8. Select **Add**.

9. Select the **Security** tab, or select the **Next: Security** button at the bottom of the page.

10. Under **BastionHost**, select **Enable**. Enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Bastion name | Enter **myBastionHost** |
    | AzureBastionSubnet address space | Enter **10.1.1.0/24** |
    | Public IP Address | Select **Create new**. </br> For **Name**, enter **myBastionIP**. </br> Select **OK**. |

11. Select the **Review + create** tab or select the **Review + create** button.

12. Select **Create**.

## Create virtual machines

Create two VMs in the virtual network:

### Create the first VM

1. On the upper-left side of the portal, select **Create a resource** > **Compute** > **Virtual machine**. 
   
2. In **Create a virtual machine**, type or select the values in the **Basics** tab:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription |
    | Resource Group | Select **myResourceGroup** |
    | **Instance details** |  |
    | Virtual machine name | Enter **myVM1** |
    | Region | Select **(US) East US** |
    | Availability Options | Select **No infrastructure redundancy required** |
    | Image | Select **Windows Server 2019 Datacenter** |
    | Azure Spot instance | Select **No** |
    | Size | Choose VM size or take default setting |
    | **Administrator account** |  |
    | Username | Enter a username |
    | Password | Enter a password |
    | Confirm password | Reenter password |
    | **Inbound port rules** |    |
    | Public inbound ports | Select **None**. |
    |

3. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.
  
4. In the Networking tab, select or enter:

    | Setting | Value |
    |-|-|
    | **Network interface** |  |
    | Virtual network | Select **myVNet**. |
    | Subnet | Select **mySubnet** |
    | Public IP | Select **None** |
    | NIC network security group | Select **Basic**|
    | Public inbound ports network | Select **None**. |
   
5. Select the **Review + create** tab, or select the blue **Review + create** button at the bottom of the page.
  
6. Review the settings, and then select **Create**.

### Create the second VM

1. On the upper-left side of the portal, select **Create a resource** > **Compute** > **Virtual machine**. 
   
2. In **Create a virtual machine**, type or select the values in the **Basics** tab:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription |
    | Resource Group | Select **myResourceGroup** |
    | **Instance details** |  |
    | Virtual machine name | Enter **myVM2** |
    | Region | Select **(US) East US** |
    | Availability Options | Select **No infrastructure redundancy required** |
    | Image | Select **Windows Server 2019 Datacenter** |
    | Azure Spot instance | Select **No** |
    | Size | Choose VM size or take default setting |
    | **Administrator account** |  |
    | Username | Enter a username |
    | Password | Enter a password |
    | Confirm password | Reenter password |
    | **Inbound port rules** |    |
    | Public inbound ports | Select **None**. |
    |

3. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.
  
4. In the Networking tab, select or enter:

    | Setting | Value |
    |-|-|
    | **Network interface** |  |
    | Virtual network | Select **myVNet**. |
    | Subnet | Select **mySubnet** |
    | Public IP | Select **None** |
    | NIC network security group | Select **Basic**|
    | Public inbound ports network | Select **None**. |
   
5. Select the **Review + create** tab, or select the blue **Review + create** button at the bottom of the page.
  
6. Review the settings, and then select **Create**.

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

## Connect to myVM1

1. Go to the [Azure portal](https://portal.azure.com) to manage your private VM. Search for and select **Virtual machines**.

2. Pick the name of your private virtual machine **myVM1**.

3. In the VM menu bar, select **Connect**, then select **Bastion**.

    :::image type="content" source="./media/quick-create-portal/connect-to-virtual-machine.png" alt-text="Connect to myVM1 with Azure Bastion" border="true":::

4. In the **Connect** page, select the blue **Use Bastion** button.

5. In the **Bastion** page, enter the username and password you created for the virtual machine previously.

6. Select **Connect**.

## Communicate between VMs

1. In the bastion connection of **myVM1**, open PowerShell.

2. Enter `ping myvm2`.

    You'll receive a message similar to this output:

    ```powershell
    Pinging myvm2.cs4wv3rxdjgedggsfghkjrxuqf.bx.internal.cloudapp.net [10.1.0.5] with 32 bytes of data:
    Reply from 10.1.0.5: bytes=32 time=3ms TTL=128
    Reply from 10.1.0.5: bytes=32 time=1ms TTL=128
    Reply from 10.1.0.5: bytes=32 time=1ms TTL=128
    Reply from 10.1.0.5: bytes=32 time=1ms TTL=128

    Ping statistics for 10.1.0.5:
        Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
    Approximate round trip times in milli-seconds:
        Minimum = 1ms, Maximum = 3ms, Average = 1ms
    ```

3. Close the bastion connection to **myVM1**.

4. Complete the steps in [Connect to myVM1](#connect-to-myvm1), but connect to **myVM2**.

5. Open PowerShell on **myVM2**, enter `ping myvm1`.

    You'll receive something like this message:

    ```powershell
    Pinging myvm1.cs4wv3rxdjgedggsfghkjrxuqf.bx.internal.cloudapp.net [10.1.0.4] with 32 bytes of data:
    Reply from 10.1.0.4: bytes=32 time=1ms TTL=128
    Reply from 10.1.0.4: bytes=32 time=1ms TTL=128
    Reply from 10.1.0.4: bytes=32 time=1ms TTL=128
    Reply from 10.1.0.4: bytes=32 time=1ms TTL=128

    Ping statistics for 10.1.0.4:
        Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
    Approximate round trip times in milli-seconds:
        Minimum = 1ms, Maximum = 1ms, Average = 1ms
    ```

7. Close the bastion connection to **myVM2**.

## Clean up resources

In this quickstart, you created a default virtual network and two VMs. 

You connected to one VM from the internet and securely communicated between the two VMs.

When you're done using the virtual network and the VMs, delete the resource group and all of the resources it contains:

1. Search for and select **myResourceGroup**.

1. Select **Delete resource group**.

1. Enter **myResourceGroup** for **TYPE THE RESOURCE GROUP NAME** and select **Delete**.

## Next steps

To learn more about virtual network settings, see [Create, change, or delete a virtual network](manage-virtual-network.md).

To learn more about types of VM network communications, see [Filter network traffic](tutorial-filter-network-traffic.md).
