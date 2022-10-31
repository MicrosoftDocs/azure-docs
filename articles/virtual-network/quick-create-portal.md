---
title: 'Quickstart: Create a virtual network - Azure portal'
titleSuffix: Azure Virtual Network
description: In this quickstart, learn how to create a virtual network using the Azure portal.
author: asudbring
ms.author: allensu
ms.date: 06/20/2022
ms.topic: quickstart
ms.service: virtual-network
ms.workload: infrastructure
ms.tgt_pltfrm: virtual-network
tags: azure-resource-manager
ms.custom: mode-ui
---

# Quickstart: Create a virtual network using the Azure portal

In this quickstart, you learn how to create a virtual network using the Azure portal. You deploy two virtual machines (VMs). Next, you securely communicate between VMs and connect to VMs from the internet. A virtual network is the fundamental building block for your private network in Azure. It enables Azure resources, like VMs, to securely communicate with each other and with the internet.

## Prerequisites

* An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create a virtual network

1. Select **Create a resource** in the upper left-hand corner of the portal.


1. In the search box, enter **Virtual Network**. Select **Virtual Network** in the search results.

1. In the **Virtual Network** page, select **Create**.

1. In **Create virtual network**, enter or select this information in the **Basics** tab:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**.  </br> Enter **myResourceGroup**. </br> Select **OK**. |
    | **Instance details** |   |
    | Name | Enter **myVNet**. |
    | Region | Select **(US) East US**. |


    :::image type="content" source="./media/quick-create-portal/example-basics-tab.png" alt-text="Screenshot of creating a virtual network in Azure portal." border="true":::




1. Select the **IP Addresses** tab, or select the **Next: IP Addresses** button at the bottom of the page and enter in the following information then select **Add**:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | IPv4 address space | Enter **10.1.0.0/16**.     |
    | **Add subnet**                                  |
    | Subnet name        | Enter **MySubnet**.        |
    | Subnet address range | Enter **10.1.0.0/24**.   |
    | Select **Add**.    |                            |
   

     :::image type="content" source="./media/quick-create-portal/example-ip-address-tab.png" alt-text="Screenshot of editing ip address tab for virtual network." border="true":::

1. Select the **Security** tab, or select the **Next: Security** button at the bottom of the page.

1. Under **BastionHost**, select **Enable**. Enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Bastion name | Enter **myBastionHost** |
    | AzureBastionSubnet address space | Enter **10.1.1.0/24** |
    | Public IP Address | Select **Create new**. </br> For **Name**, enter **myBastionIP**. </br> Select **OK**. |


    :::image type="content" source="./media/quick-create-portal/example-security-tab.png" alt-text="Screenshot of editing security tab for virtual network." border="true":::



1. Select the **Review + create** tab or select the **Review + create** button.

1. Select **Create**.



## Create virtual machines

Create two VMs in the virtual network:

### Create the first VM

1. On the upper-left side of the portal, select **Create a resource** > **Compute** > **Virtual machine**. 
   
1. In **Create a virtual machine**, type or select the values in the **Basics** tab:

    | Setting               | Value                            |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription |
    | Resource Group | Select **myResourceGroup** |
    | **Instance details** |  |
    | Virtual machine name | Enter **myVM1** |
    | Region | Select **(US) East US** |
    | Availability Options | Select **No infrastructure redundancy required** |
    | Image | Select **Windows Server 2019 Datacenter - Gen2** |
    | Azure Spot instance | Select **No** |
    | Size | Choose VM size or take default setting |
    | **Administrator account** |  |
    | Username | Enter a username |
    | Password | Enter a password |
    | Confirm password | Reenter password |
    | **Inbound port rules** |    |
    | Public inbound ports | Select **None**. |
    
    
    :::image type="content" source="./media/quick-create-portal/azure-virtual-machine-basic-settings.png" alt-text="screenshot of creating basic settings for virtual machine." border="true":::


1. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.
  
1. In the Networking tab, select or enter:

    | Setting | Value |
    |-|-|
    | **Network interface** |  |
    | Virtual network | Select **myVNet**. |
    | Subnet | Select **mySubnet** |
    | Public IP | Select **None** |
    | NIC network security group | Select **Basic**|
    | Public inbound ports network | Select **None**. |
   
1. Select the **Review + create** tab, or select the blue **Review + create** button at the bottom of the page.
  
1. Review the settings, and then select **Create**.

### Create the second VM

1. On the upper-left side of the portal, select **Create a resource** > **Compute** > **Virtual machine**. 
   
1. In **Create a virtual machine**, type or select the values in the **Basics** tab:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription |
    | Resource Group | Select **myResourceGroup** |
    | **Instance details** |  |
    | Virtual machine name | Enter **myVM2** |
    | Region | Select **(US) East US** |
    | Availability Options | Select **No infrastructure redundancy required** |
    | Image | Select **Windows Server 2019 Datacenter - Gen2** |
    | Azure Spot instance | Select **No** |
    | Size | Choose VM size or take default setting |
    | **Administrator account** |  |
    | Username | Enter a username |
    | Password | Enter a password |
    | Confirm password | Reenter password |
    | **Inbound port rules** |    |
    | Public inbound ports | Select **None**. |
    

1. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.
  
1. In the Networking tab, select or enter:

    | Setting | Value |
    |-|-|
    | **Network interface** |  |
    | Virtual network | Select **myVNet**. |
    | Subnet | Select **mySubnet** |
    | Public IP | Select **None** |
    | NIC network security group | Select **Basic**|
    | Public inbound ports network | Select **None**. |
   
1. Select the **Review + create** tab, or select the blue **Review + create** button at the bottom of the page.
  
1. Review the settings, and then select **Create**.

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

## Connect to myVM1

1. Go to the [Azure portal](https://portal.azure.com) to manage your private VM. Search for and select **Virtual machines**.

1. Pick the name of your private virtual machine **myVM1**.

1. In the VM menu bar, select **Connect**, then select **Bastion**.

    :::image type="content" source="./media/quick-create-portal/connect-to-virtual-machine.png" alt-text="Screenshot of connecting to myVM1 with Azure Bastion." border="true":::

1. In the **Connect** page, select the blue **Use Bastion** button.

1. In the **Bastion** page, enter the username and password you created for the virtual machine previously.

1. Select **Connect**.

For more information about Azure Bastion, see [Azure Bastion](~/articles/bastion/bastion-overview.md).

## Communicate between VMs

1. In the Bastion connection of **myVM1**, open PowerShell.

1. Enter `ping myVM2`.

    You'll get a reply message like this:

    ```powershell
    PS C:\Users\myVM1> ping myVM2

    Pinging myVM2.ovvzzdcazhbu5iczfvonhg2zrb.bx.internal.cloudapp.net
    Request timed out.
    Request timed out.
    Request timed out.
    Request timed out.

    Ping statistics for 10.0.0.5:
        Packets: Sent = 4, Received = 0, Lost = 4 (100% loss),
    ```

    The ping fails, because it uses the Internet Control Message Protocol (ICMP). By default, ICMP isn't allowed through your Windows firewall.

1. To allow **myVM2** to ping **myVM1** in a later step, enter this command:

    ```powershell
    New-NetFirewallRule –DisplayName "Allow ICMPv4-In" –Protocol ICMPv4
    ```

    That command lets ICMP inbound through the Windows firewall.

1. Close the bastion connection to **myVM1**.

1. Complete the steps in [Connect to myVM1](#connect-to-myvm1), but connect to **myVM2**.

1. Open PowerShell on **myVM2**, enter `ping myVM1`.

    You'll receive a successful reply message like this:

    ```powershell
    Pinging myVM1.cs4wv3rxdjgedggsfghkjrxuqf.bx.internal.cloudapp.net [10.1.0.4] with 32 bytes of data:
    Reply from 10.1.0.4: bytes=32 time=1ms TTL=128
    Reply from 10.1.0.4: bytes=32 time=1ms TTL=128
    Reply from 10.1.0.4: bytes=32 time=1ms TTL=128
    Reply from 10.1.0.4: bytes=32 time=1ms TTL=128

    Ping statistics for 10.1.0.4:
        Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
    Approximate round trip times in milli-seconds:
        Minimum = 1ms, Maximum = 1ms, Average = 1ms
    ```

1. Close the bastion connection to **myVM2**.

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



