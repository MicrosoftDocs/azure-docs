---
title: 'Tutorial: Filter network traffic with a network security group (NSG) - Azure portal'
titlesuffix: Azure Virtual Network
description: In this tutorial, you learn how to filter network traffic to a subnet, with a network security group (NSG), using the Azure portal.
services: virtual-network
author: asudbring
ms.service: virtual-network
ms.topic: tutorial
ms.date: 07/24/2023
ms.author: allensu
ms.custom: template-tutorial
# Customer intent: I want to filter network traffic to virtual machines that perform similar functions, such as web servers.
---

# Tutorial: Filter network traffic with a network security group using the Azure portal

You can use a network security group to filter inbound and outbound network traffic to and from Azure resources in an Azure virtual network.

Network security groups contain security rules that filter network traffic by IP address, port, and protocol. When a network security group is associated with a subnet, security rules are applied to resources deployed in that subnet.

:::image type="content" source="./media/tutorial-filter-network-traffic/virtual-network-filter-resources.png" alt-text="Diagram of resources created during tutorial.":::

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a network security group and security rules
> * Create application security groups  
> * Create a virtual network and associate a network security group to a subnet
> * Deploy virtual machines and associate their network interfaces to the application security groups

## Prerequisites

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

[!INCLUDE [virtual-network-create.md](../../includes/virtual-network-create.md)]

## Create application security groups

An [application security group (ASGs)](application-security-groups.md) enables you to group together servers with similar functions, such as web servers.

1. In the search box at the top of the portal, enter **Application security group**. Select **Application security groups** in the search results.

1. Select **+ Create**.

1. On the **Basics** tab of **Create an application security group**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    |**Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |  |
    | Name | Enter **asg-web**. |
    | Region | Select **East US 2**. | 

1. Select **Review + create**.

1. Select **+ Create**.

1. Repeat the previous steps, specifying the following values:

    | Setting | Value |
    | ------- | ----- |
    |**Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |  |
    | Name | Enter **asg-mgmt**. |
    | Region | Select **East US 2**. |

1. Select **Review + create**.

1. Select **Create**.

## Create a network security group

A [network security group (NSG)](network-security-groups-overview.md) secures network traffic in your virtual network. 

1. In the search box at the top of the portal, enter **Network security group**. Select **Network security groups** in the search results.

    > [!NOTE]
    > In the search results for **Network security groups**, you may see **Network security groups (classic)**. Select **Network security groups**.

1. Select **+ Create**.

1. On the **Basics** tab of **Create network security group**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |   |
    | Name | Enter **nsg-1**. |
    | Location | Select **East US 2**. | 

1. Select **Review + create**.

1. Select **Create**.

## Associate network security group to subnet

In this section, you associate the network security group with the subnet of the virtual network you created earlier.

1. In the search box at the top of the portal, enter **Network security group**. Select **Network security groups** in the search results.

1. Select **nsg-1**.

1. Select **Subnets** from the **Settings** section of **nsg-1**.

1. In the **Subnets** page, select **+ Associate**:

    :::image type="content" source="./media/tutorial-filter-network-traffic/associate-nsg-subnet.png" alt-text="Screenshot of Associate a network security group to a subnet." border="true":::

1. Under **Associate subnet**, select **vnet-1 (test-rg)** for **Virtual network**. 

1. Select **subnet-1** for **Subnet**, and then select **OK**.

## Create security rules

1. Select **Inbound security rules** from the **Settings** section of **nsg-1**.

1. In **Inbound security rules** page, select **+ Add**.

1. Create a security rule that allows ports 80 and 443 to the **asg-web** application security group. In **Add inbound security rule** page, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Source | Leave the default of **Any**. |
    | Source port ranges | Leave the default of **(*)**. |
    | Destination | Select **Application security group**. |
    | Destination application security groups | Select **asg-web**. |
    | Service | Leave the default of **Custom**. |
    | Destination port ranges | Enter **80,443**. |
    | Protocol | Select **TCP**. |
    | Action | Leave the default of **Allow**. |
    | Priority | Leave the default of **100**. |
    | Name | Enter **allow-web-all**. |

1. Select **Add**.

1. Complete the previous steps with the following information:

    | Setting | Value |
    | ------- | ----- |
    | Source | Leave the default of **Any**. |
    | Source port ranges | Leave the default of **(*)**. |
    | Destination | Select **Application security group**. |
    | Destination application security group | Select **asg-mgmt**. |
    | Service | Select **RDP**. |
    | Action | Leave the default of **Allow**. |
    | Priority | Leave the default of **110**. |
    | Name | Enter *allow-rdp-all*. |

1. Select **Add**.

    > [!CAUTION]
    > In this article, RDP (port 3389) is exposed to the internet for the VM that is assigned to the **asg-mgmt** application security group. 
    >
    > For production environments, instead of exposing port 3389 to the internet, it's recommended that you connect to Azure resources that you want to manage using a VPN, private network connection, or Azure Bastion.
    >
    > For more information on Azure Bastion, see [What is Azure Bastion?](../bastion/bastion-overview.md).

## Create virtual machines

Create two virtual machines (VMs) in the virtual network.

1. In the portal, search for and select **Virtual machines**.

1. In **Virtual machines**, select **+ Create**, then **Azure virtual machine**.

1. In **Create a virtual machine**, enter or select this information in the **Basics** tab:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |   |
    | Virtual machine name | Enter **vm-1**. |
    | Region | Select **(US) East US 2**. |
    | Availability options | Leave the default of **No infrastructure redundancy required**. |
    | Security type | Select **Standard**. |
    | Image | Select **Windows Server 2022 Datacenter - x64 Gen2**. |
    | Azure Spot instance | Leave the default of unchecked. |
    | Size | Select a size. |
    | **Administrator account** |   |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Reenter password. |
    | **Inbound port rules** |   |
    | Select inbound ports | Select **None**. |

1. Select **Next: Disks** then **Next: Networking**.

1. In the **Networking** tab, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Network interface** |   |
    | Virtual network | Select **vnet-1**. |
    | Subnet | Select **subnet-1 (10.0.0.0/24)**. |
    | Public IP | Leave the default of a new public IP. |
    | NIC network security group | Select **None**. | 

1. Select the **Review + create** tab, or select the blue **Review + create** button at the bottom of the page.

1. Select **Create**. The VM may take a few minutes to deploy.

1. Repeat the previous steps to create a second virtual machine named **vm-2**.

## Associate network interfaces to an ASG

When you created the VMs, Azure created a network interface for each VM, and attached it to the VM. 

Add the network interface of each VM to one of the application security groups you created previously:

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **vm-1**.

1. Select **Networking** from the **Settings** section of **vm-1**.

1. Select the **Application security groups** tab, then select **Configure the application security groups**.

    :::image type="content" source="./media/tutorial-filter-network-traffic/configure-app-sec-groups.png" alt-text="Screenshot of Configure application security groups." border="true":::

1. In **Configure the application security groups**, select **asg-web** in the **Application security groups** pull-down menu, then select **Save**.

1. Repeat the previous steps for **vm-2**, selecting **asg-mgmt** in the **Application security groups** pull-down menu.

## Test traffic filters

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **vm-2**.

1. On the **Overview** page, select the **Connect** button and then select **Native RDP**.

1. Select **Download RDP file**.

1. Open the downloaded rdp file and select **Connect**. Enter the username and password you specified when creating the VM.

4. Select **OK**.

5. You may receive a certificate warning during the connection process. If you receive the warning, select **Yes** or **Continue**, to continue with the connection.

    The connection succeeds, because inbound traffic from the internet to the **asg-mgmt** application security group is allowed through port 3389. 
    
    The network interface for **vm-2** is associated with the **asg-mgmt** application security group and allows the connection.

6. Open a PowerShell session on **vm-2**. Connect to **vm-1** using the following: 

    ```powershell
    mstsc /v:vm-1
    ```

    The RDP connection from **vm-2** to **vm-1** succeeds because virtual machines in the same network can communicate with each other over any port by default.
    
    You can't create an RDP connection to the **vm-1** virtual machine from the internet. The security rule for the **asg-web** prevents connections to port 3389 inbound from the internet. Inbound traffic from the Internet is denied to all resources by default.

7. To install Microsoft IIS on the **vm-1** virtual machine, enter the following command from a PowerShell session on the **vm-1** virtual machine:

    ```powershell
    Install-WindowsFeature -name Web-Server -IncludeManagementTools
    ```

8. After the IIS installation is complete, disconnect from the **vm-1** virtual machine, which leaves you in the **vm-2** virtual machine remote desktop connection.

9. Disconnect from the **vm-2** VM.

10. Search for **vm-1** in the portal search box.

11. On the **Overview** page of **vm-1**, note the **Public IP address** for your VM. The address shown in the following example is 20.230.55.178, your address is different:

    :::image type="content" source="./media/tutorial-filter-network-traffic/public-ip-address.png" alt-text="Screenshot of Public IP address of a virtual machine in the Overview page." border="true":::
    
11. To confirm that you can access the **vm-1** web server from the internet, open an internet browser on your computer and browse to `http://<public-ip-address-from-previous-step>`. 

You see the IIS default page, because inbound traffic from the internet to the **asg-web** application security group is allowed through port 80. 

The network interface attached for **vm-1** is associated with the **asg-web** application security group and allows the connection. 

[!INCLUDE [portal-clean-up.md](../../includes/portal-clean-up.md)]

## Next steps

In this tutorial, you:

* Created a network security group and associated it to a virtual network subnet. 
* Created application security groups for web and management.
* Created two virtual machines and associated their network interfaces with the application security groups.
* Tested the application security group network filtering.

To learn more about network security groups, see [Network security group overview](./network-security-groups-overview.md) and [Manage a network security group](manage-network-security-group.md).

Azure routes traffic between subnets by default. You may instead, choose to route traffic between subnets through a VM, serving as a firewall, for example. 

To learn how to create a route table, advance to the next tutorial.
> [!div class="nextstepaction"]
> [Create a route table](./tutorial-create-route-table-portal.md)
