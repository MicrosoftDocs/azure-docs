---
title: 'Tutorial: Route network traffic with a route table - Azure portal'
titlesuffix: Azure Virtual Network
description: In this tutorial, learn how to route network traffic with a route table using the Azure portal.
author: asudbring
ms.service: virtual-network
ms.date: 08/21/2023
ms.author: allensu
ms.topic: tutorial
ms.custom: template-tutorial
# Customer intent: I want to route traffic from one subnet, to a different subnet, through a network virtual appliance.
---

# Tutorial: Route network traffic with a route table using the Azure portal

Azure routes traffic between all subnets within a virtual network, by default. You can create your own routes to override Azure's default routing. Custom routes are helpful when, for example, you want to route traffic between subnets through a network virtual appliance (NVA).

:::image type="content" source="./media/tutorial-create-route-table-portal/resources-diagram.png" alt-text="Diagram of Azure resources created in tutorial.":::

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network and subnets
> * Create an NVA that routes traffic
> * Deploy virtual machines (VMs) into different subnets
> * Create a route table
> * Create a route
> * Associate a route table to a subnet
> * Route traffic from one subnet to another through an NVA

## Prerequisites

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

[!INCLUDE [virtual-network-create-with-bastion.md](../../includes/virtual-network-create-with-bastion.md)]

## Create subnets

A **DMZ** and **Private** subnet are needed for this tutorial. The **DMZ** subnet is where you deploy the NVA, and the **Private** subnet is where you deploy the virtual machines that you want to route traffic to. The **subnet-1** is the subnet created in the previous steps. Use **subnet-1** for the public virtual machine.

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

1. In **Virtual networks**, select **vnet-1**.

1. In **vnet-1**, select **Subnets** from the **Settings** section.

1. In the virtual network's subnet list, select **+ Subnet**.

1. In **Add subnet**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **subnet-private**. |
    | Subnet address range | Enter **10.0.2.0/24**. |

    :::image type="content" source="./media/tutorial-create-route-table-portal/create-private-subnet.png" alt-text="Screenshot of private subnet creation in virtual network.":::

1. Select **Save**.

1. Select **+ Subnet**.

1. In **Add subnet**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **subnet-dmz**. |
    | Subnet address range | Enter **10.0.3.0/24**. |

    :::image type="content" source="./media/tutorial-create-route-table-portal/create-dmz-subnet.png" alt-text="Screenshot of DMZ subnet creation in virtual network.":::

1. Select **Save**.

## Create an NVA virtual machine

Network virtual appliances (NVAs) are virtual machines that help with network functions, such as routing and firewall optimization. In this section, create an NVA using an **Ubuntu 22.04** virtual machine.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **+ Create** then **Azure virtual machine**.

1. In **Create a virtual machine** enter or select the following information in the **Basics** tab:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |   |
    | Virtual machine name | Enter **vm-nva**. |
    | Region | Select **(US) East US 2**. |
    | Availability options | Select **No infrastructure redundancy required**. |
    | Security type | Select **Standard**. |
    | Image | Select **Ubuntu Server 22.04 LTS - x64 Gen2**. |
    | VM architecture | Leave the default of **x64**. |
    | Size | Select a size. |
    | **Administrator account** |   |
    | Authentication type | Select **Password**. |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Reenter password. |
    | **Inbound port rules** |  |
    | Public inbound ports | Select **None**. |

1. Select **Next: Disks** then **Next: Networking**.

1. In the Networking tab, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Network interface** |   |
    | Virtual network | Select **vnet-1**. |
    | Subnet | Select **subnet-dmz (10.0.3.0/24)**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Advanced**. |
    | Configure network security group | Select **Create new**. </br> In **Name** enter **nsg-nva**. </br> Select **OK**. |

1. Leave the rest of the options at the defaults and select **Review + create**.

1. Select **Create**.

## Create public and private virtual machines

Create two virtual machines in the **vnet-1** virtual network. One virtual machine is in the **subnet-1** subnet, and the other virtual machine is in the **subnet-private** subnet. Use the same virtual machine image for both virtual machines.

### Create public virtual machine

The public virtual machine is used to simulate a machine in the public internet. The public and private virtual machine are used to test the routing of network traffic through the NVA virtual machine.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **+ Create** then **Azure virtual machine**.

1. In **Create a virtual machine** enter or select the following information in the **Basics** tab:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |   |
    | Virtual machine name | Enter **vm-public**. |
    | Region | Select **(US) East US 2**. |
    | Availability options | Select **No infrastructure redundancy required**. |
    | Security type | Select **Standard**. |
    | Image | Select **Ubuntu Server 22.04 LTS - x64 Gen2**. |
    | VM architecture | Leave the default of **x64**. |
    | Size | Select a size. |
    | **Administrator account** |   |
    | Authentication type | Select **Password**. |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Reenter password. |
    | **Inbound port rules** |  |
    | Public inbound ports | Select **None**. |

1. Select **Next: Disks** then **Next: Networking**.

1. In the Networking tab, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Network interface** |   |
    | Virtual network | Select **vnet-1**. |
    | Subnet | Select **subnet-1 (10.0.0.0/24)**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **None**. |

1. Leave the rest of the options at the defaults and select **Review + create**.

1. Select **Create**.

### Create private virtual machine

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **+ Create** then **Azure virtual machine**.

1. In **Create a virtual machine** enter or select the following information in the **Basics** tab:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |   |
    | Virtual machine name | Enter **vm-private**. |
    | Region | Select **(US) East US 2**. |
    | Availability options | Select **No infrastructure redundancy required**. |
    | Security type | Select **Standard**. |
    | Image | Select **Ubuntu Server 22.04 LTS - x64 Gen2**. |
    | VM architecture | Leave the default of **x64**. |
    | Size | Select a size. |
    | **Administrator account** |   |
    | Authentication type | Select **Password**. |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Reenter password. |
    | **Inbound port rules** |  |
    | Public inbound ports | Select **None**. |

1. Select **Next: Disks** then **Next: Networking**.

1. In the Networking tab, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Network interface** |   |
    | Virtual network | Select **vnet-1**. |
    | Subnet | Select **subnet-private (10.0.2.0/24)**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **None**. |

1. Leave the rest of the options at the defaults and select **Review + create**.

1. Select **Create**.

## Enable IP forwarding

To route traffic through the NVA, turn on IP forwarding in Azure and in the operating system of **vm-nva**. When IP forwarding is enabled, any traffic received by **vm-nva** that's destined for a different IP address, isn't dropped and is forwarded to the correct destination.

### Enable IP forwarding in Azure

In this section, you turn on IP forwarding for the network interface of the **vm-nva** virtual machine.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. In **Virtual machines**, select **vm-nva**.

1. In **vm-nva**, select **Networking** from the **Settings** section.

1. Select the name of the interface next to **Network Interface:**. The name begins with **vm-nva** and has a random number assigned to the interface. The name of the interface in this example is **vm-nva124**.

    :::image type="content" source="./media/tutorial-create-route-table-portal/nva-network-interface.png" alt-text="Screenshot of network interface of NVA virtual machine.":::

1. In the network interface overview page, select **IP configurations** from the **Settings** section.

1. In **IP configurations**, select the box next to **Enable IP forwarding**.

    :::image type="content" source="./media/tutorial-create-route-table-portal/enable-ip-forwarding.png" alt-text="Screenshot of enablement of IP forwarding.":::

1. Select **Apply**.

### Enable IP forwarding in the operating system

In this section, turn on IP forwarding for the operating system of the **vm-nva** virtual machine to forward network traffic. Use the Azure Bastion service to connect to the **vm-nva** virtual machine.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. In **Virtual machines**, select **vm-nva**.

1. Select **Bastion** in the **Operations** section.

1. Enter the username and password you entered when the virtual machine was created.

1. Select **Connect**.

1. Enter the following information at the prompt of the virtual machine to enable IP forwarding:

    ```bash
    sudo vim /etc/sysctl.conf
    ``` 

1. In the Vim editor, remove the **`#`** from the line **`net.ipv4.ip_forward=1`**:

    Press the **Insert** key.

    ```bash
    # Uncomment the next line to enable packet forwarding for IPv4
    net.ipv4.ip_forward=1
    ```

    Press the **Esc** key.

    Enter **`:wq`** and press **Enter**.

1. Close the Bastion session.

1. Restart the virtual machine.

## Create a route table

In this section, create a route table to define the route of the traffic through the NVA virtual machine. The route table is associated to the **subnet-1** subnet where the **vm-public** virtual machine is deployed.

1. In the search box at the top of the portal, enter **Route table**. Select **Route tables** in the search results.

1. Select **+ Create**.

1. In **Create Route table** enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |   |
    | Region | Select **East US 2**. |
    | Name | Enter **route-table-public**. |
    | Propagate gateway routes | Leave the default of **Yes**. |

1. Select **Review + create**. 

1. Select **Create**.

## Create a route

In this section, create a route in the route table that you created in the previous steps.

1. In the search box at the top of the portal, enter **Route table**. Select **Route tables** in the search results.

1. Select **route-table-public**.

1. In **Settings** select **Routes**.

1. Select **+ Add** in **Routes**.

1. Enter or select the following information in **Add route**:

    | Setting | Value |
    | ------- | ----- |
    | Route name | Enter **to-private-subnet**. |
    | Destination type | Select **IP Addresses**. |
    | Destination IP addresses/CIDR ranges | Enter **10.0.2.0/24**. |
    | Next hop type | Select **Virtual appliance**. |
    | Next hop address | Enter **10.0.3.4**. </br> **_This is the IP address you of vm-nva you created in the earlier steps._**. |

    :::image type="content" source="./media/tutorial-create-route-table-portal/add-route.png" alt-text="Screenshot of route creation in route table.":::

1. Select **Add**.

1. Select **Subnets** in **Settings**.

1. Select **+ Associate**.

1. Enter or select the following information in **Associate subnet**:

    | Setting | Value |
    | ------- | ----- |
    | Virtual network | Select **vnet-1 (test-rg)**. |
    | Subnet | Select **subnet-1**. |

1. Select **OK**.

## Test the routing of network traffic

Test routing of network traffic from **vm-public** to **vm-private**. Test routing of network traffic from **vm-private** to **vm-public**.

### Test network traffic from vm-public to vm-private

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. In **Virtual machines**, select **vm-public**.

1. Select **Bastion** in the **Operations** section.

1. Enter the username and password you entered when the virtual machine was created.

1. Select **Connect**.

1. In the prompt, enter the following command to trace the routing of network traffic from **vm-public** to **vm-private**:

    ```bash
    tracepath vm-private
    ```

    The response is similar to the following example:

    ```output
    azureuser@vm-public:~$ tracepath vm-private
     1?: [LOCALHOST]                      pmtu 1500
     1:  vm-nva.internal.cloudapp.net                          1.766ms 
     1:  vm-nva.internal.cloudapp.net                          1.259ms 
     2:  vm-private.internal.cloudapp.net                      2.202ms reached
     Resume: pmtu 1500 hops 2 back 1 
    ```
    
    You can see that there are two hops in the above response for **`tracepath`** ICMP traffic from **vm-public** to **vm-private**. The first hop is **vm-nva**. The second hop is the destination **vm-private**.

    Azure sent the traffic from **subnet-1** through the NVA and not directly to **subnet-private** because you previously added the **to-private-subnet** route to **route-table-public** and associated it to **subnet-1**.

1. Close the Bastion session.

### Test network traffic from vm-private to vm-public

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. In **Virtual machines**, select **vm-private**.

1. Select **Bastion** in the **Operations** section.

1. Enter the username and password you entered when the virtual machine was created.

1. Select **Connect**.

1. In the prompt, enter the following command to trace the routing of network traffic from **vm-private** to **vm-public**:

    ```bash
    tracepath vm-public
    ```

    The response is similar to the following example:

    ```output
    azureuser@vm-private:~$ tracepath vm-public
     1?: [LOCALHOST]                      pmtu 1500
     1:  vm-public.internal.cloudapp.net                       2.584ms reached
     1:  vm-public.internal.cloudapp.net                       2.147ms reached
     Resume: pmtu 1500 hops 1 back 2 
    ```

    You can see that there's one hop in the above response, which is the destination **vm-public**.

    Azure sent the traffic directly from **subnet-private** to **subnet-1**. By default, Azure routes traffic directly between subnets.

1. Close the Bastion session.

[!INCLUDE [portal-clean-up.md](../../includes/portal-clean-up.md)]

## Next steps

In this tutorial, you:

* Created a route table and associated it to a subnet.

* Created a simple NVA that routed traffic from a public subnet to a private subnet. 

You can deploy different preconfigured NVAs from the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/category/networking), which provide many useful network functions. 

To learn more about routing, see [Routing overview](virtual-networks-udr-overview.md) and [Manage a route table](manage-route-table.md).

To learn how to restrict network access to PaaS resources with virtual network service endpoints, advance to the next tutorial.

> [!div class="nextstepaction"]
> [Restrict network access using service endpoints](tutorial-restrict-network-access-to-resources.md)
