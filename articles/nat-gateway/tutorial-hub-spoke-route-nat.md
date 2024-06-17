---
title: 'Tutorial: Use a NAT gateway with a hub and spoke network'
titleSuffix: Azure NAT Gateway
description: Learn how to integrate a NAT gateway into a hub and spoke network with a network virtual appliance. 
author: asudbring
ms.author: allensu
ms.service: nat-gateway
ms.topic: tutorial 
ms.date: 07/13/2023
ms.custom: template-tutorial 
---

# Tutorial: Use a NAT gateway with a hub and spoke network

A hub and spoke network is one of the building blocks of a highly available multiple location network infrastructure. The most common deployment of a hub and spoke network is done with the intention of routing all inter-spoke and outbound internet traffic through the central hub. The purpose is to inspect all of the traffic traversing the network with a Network Virtual Appliance (NVA) for security scanning and packet inspection.

For outbound traffic to the internet, the network virtual appliance would typically have one network interface with an assigned public IP address. The NVA after inspecting the outbound traffic forwards the traffic out the public interface and to the internet. Azure NAT Gateway eliminates the need for the public IP address assigned to the NVA. Associating a NAT gateway with the public subnet of the NVA changes the routing for the public interface to route all outbound internet traffic through the NAT gateway. The elimination of the public IP address increases security and allows for the scaling of outbound source network address translation (SNAT) with multiple public IP addresses and or public IP prefixes.

> [!IMPORTANT]
> The NVA used in this article is for demonstration purposes only and is simulated with an Ubuntu virtual machine. The solution doesn't include a load balancer for high availability of the NVA deployment. Replace the Ubuntu virtual machine in this article with an NVA of your choice. Consult the vendor of the chosen NVA for routing and configuration instructions. A load balancer and availability zones is recommended for a highly available NVA infrastructure.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a NAT gateway.
> * Create a hub and spoke virtual network.
> * Create a simulated Network Virtual Appliance (NVA).
> * Force all traffic from the spokes through the hub.
> * Force all internet traffic in the hub and the spokes out the NAT gateway.
> * Test the NAT gateway and inter-spoke routing.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create a NAT gateway

All outbound internet traffic traverses the NAT gateway to the internet. Use the following example to create a NAT gateway for the hub and spoke network.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

1. Select **+ Create**.

1. In the **Basics** tab of **Create network address translation (NAT) gateway** enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter **test-rg** in **Name**. </br> Select **OK**. |
    | **Instance details** |  |
    | NAT gateway name | Enter **nat-gateway**. |
    | Region | Select **East US 2**. |
    | Availability zone | Select a **Zone** or **No zone**. |
    | TCP idle timeout (minutes) | Leave the default of **4**. |

1. Select **Next: Outbound IP**.

1. In **Outbound IP** in **Public IP addresses**, select **Create a new public IP address**.

1. Enter **public-ip-nat** in **Name**.

1. Select **OK**.

1. Select **Review + create**. 

1. Select **Create**.

## Create hub virtual network

The hub virtual network is the central network of the solution. The hub network contains the NVA appliance and a public and private subnet. The NAT gateway is assigned to the public subnet during the creation of the virtual network. An Azure Bastion host is configured as part of the following example. The bastion host is used to securely connect to the NVA virtual machine and the test virtual machines deployed in the spokes later in the article.

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

1. Select **+ Create**.

1. In the **Basics** tab of **Create virtual network**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |   |
    | Name | Enter **vnet-hub**. |
    | Region | Select **East US 2**. |

1. Select **Next** to proceed to the **Security** tab.

1. Select **Enable Bastion** in the **Azure Bastion** section of the **Security** tab.

    Azure Bastion uses your browser to connect to VMs in your virtual network over secure shell (SSH) or remote desktop protocol (RDP) by using their private IP addresses. The VMs don't need public IP addresses, client software, or special configuration. For more information about Azure Bastion, see [Azure Bastion](/azure/bastion/bastion-overview)

    >[!NOTE]
    >[!INCLUDE [Pricing](../../includes/bastion-pricing.md)]

1. Enter or select the following information in **Azure Bastion**:

    | Setting | Value |
    |---|---|
    | Azure Bastion host name | Enter **bastion**. |
    | Azure Bastion public IP address | Select **Create a public IP address**. </br> Enter **public-ip** in Name. </br> Select **OK**. |

1. Select **Next** to proceed to the **IP Addresses** tab.

1. In the address space box in **Subnets**, select the **default** subnet.

1. In **Edit subnet**, enter or select the following information:

    | Setting | Value |
    |---|---|
    | **Subnet details** |  |
    | Subnet template | Leave the default **Default**. |
    | Name | Enter **subnet-private**. |
    | Starting address | Leave the default of **10.0.0.0**. |
    | Subnet size | Leave the default of **/24(256 addresses)**. |

1. Select **Save**.

1. Select **+ Add subnet**.

1. In **Add subnet**, enter or select the following information:

    | Setting | Value |
    |---|---|
    | **Subnet details** |  |
    | Subnet template | Leave the default **Default**. |
    | Name | Enter **subnet-public**. |
    | Starting address | Enter **10.0.253.0**. |
    | Subnet size | Select **/28(16 addresses)**. |
    | **Security** |   |
    | NAT gateway | Select **nat-gateway**. |

1. Select **Add**.

1. Select **Review + create**.

1. Select **Create**.

It takes a few minutes for the bastion host to deploy. When the virtual network is created as part of the deployment, you can proceed to the next steps.

## Create simulated NVA virtual machine

The simulated NVA acts as a virtual appliance to route all traffic between the spokes and hub and traffic outbound to the internet. An Ubuntu virtual machine is used for the simulated NVA. Use the following example to create the simulated NVA and configure the network interfaces.

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
    | Virtual network | Select **vnet-hub**. |
    | Subnet | Select **subnet-public (10.0.253.0/28)**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Advanced**. |
    | Configure network security group | Select **Create new**. </br> In **Name** enter **nsg-nva**. </br> Select **OK**. |

1. Leave the rest of the options at the defaults and select **Review + create**.

1. Select **Create**.

### Configure virtual machine network interfaces

The IP configuration of the primary network interface of the virtual machine is set to dynamic by default. Use the following example to change the primary network interface IP configuration to static and add a secondary network interface for the private interface of the NVA.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **vm-nva**.

1. In the **Overview** select **Stop** if the virtual machine is running.

1. Select **Networking** in **Settings**.

1. In **Networking** select the network interface name next to **Network Interface:**. The interface name is the virtual machine name and random numbers and letters. In this example, the interface name is **vm-nva271**. 

1. In the network interface properties, select **IP configurations** in **Settings**.

1. Select the box next to **Enable IP forwarding**.

1. Select **Apply**.

1. When the apply action completes, select **ipconfig1**.

1. In **Assignment** in **ipconfig1** select **Static**.

1. In **Private IP address** enter **10.0.253.10**.

1. Select **Save**.

1. When the save action completes, return to the networking configuration for **vm-nva**.

1. In **Networking** of **vm-nva** select **Attach network interface**.

1. Select **Create and attach network interface**.

1. In **Create network interface** enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Resource group | Select **test-rg**. |
    | **Network interface** |  |
    | Name | Enter **nic-private**. |
    | Subnet | Select **subnet-private (10.0.0.0/24)**. |
    | NIC network security group | Select **Advanced**. |
    | Configure network security group | Select **nsg-nva**. |
    | Private IP address assignment | Select **Static**. |
    | Private IP address | Enter **10.0.0.10**. |

1. Select **Create**.

### Configure virtual machine software

The routing for the simulated NVA uses IP tables and internal NAT in the Ubuntu virtual machine. Connect to the NVA virtual machine with Azure Bastion to configure IP tables and the routing configuration.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **vm-nva**.

1. Start **vm-nva**.

1. When the virtual machine is completed booting, continue with the next steps.

1. In **Operations**, select **Bastion**.

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

1. Enter the following information to enable internal NAT in the virtual machine:

    ```bash
    sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
    sudo apt-get update
    sudo apt install iptables-persistent
    ```

    Select **Yes** twice.

    ```bash
    sudo su
    iptables-save > /etc/iptables/rules.v4
    exit
    ```

1. Use Vim to edit the configuration with the following information:

    ```bash
    sudo vim /etc/rc.local
    ```

    Press the **Insert** key.

    Add the following line to the configuration file:
    
    ```bash
    /sbin/iptables-restore < /etc/iptables/rules.v4
    ```

    Press the **Esc** key.

    Enter **`:wq`** and press **Enter**.

1. Reboot the virtual machine:

    ```bash
    sudo reboot
    ```

## Create hub network route table

Route tables are used to overwrite Azure's default routing. Create a route table to force all traffic within the hub private subnet through the simulated NVA.

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
    | Name | Enter **route-table-nat-hub**. |
    | Propagate gateway routes | Leave the default of **Yes**. |

1. Select **Review + create**. 

1. Select **Create**.

1. In the search box at the top of the portal, enter **Route table**. Select **Route tables** in the search results.

1. Select **route-table-nat-hub**.

1. In **Settings** select **Routes**.

1. Select **+ Add** in **Routes**.

1. Enter or select the following information in **Add route**:

    | Setting | Value |
    | ------- | ----- |
    | Route name | Enter **default-via-nat-hub**. |
    | Destination type | Select **IP Addresses**. |
    | Destination IP addresses/CIDR ranges | Enter **0.0.0.0/0**. |
    | Next hop type | Select **Virtual appliance**. |
    | Next hop address | Enter **10.0.0.10**. </br> **_This is the IP address you added to the private interface of the NVA in the previous steps._**. |

1. Select **Add**.

1. Select **Subnets** in **Settings**.

1. Select **+ Associate**.

1. Enter or select the following information in **Associate subnet**:

    | Setting | Value |
    | ------- | ----- |
    | Virtual network | Select **vnet-hub (test-rg)**. |
    | Subnet | Select **subnet-private**. |

1. Select **OK**.

## Create spoke one virtual network

Create another virtual network in a different region for the first spoke of the hub and spoke network.

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

1. Select **+ Create**.

1. In the **Basics** tab of **Create virtual network**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |   |
    | Name | Enter **vnet-spoke-1**. |
    | Region | Select **(US) South Central US**. |

1. Select **Next** to proceed to the **Security** tab.

1. Select **Next** to proceed to the **IP addresses** tab.

1. In the **IP Addresses** tab in **IPv4 address space**, select the trash can to delete the address space that is auto populated.

1. In **IPv4 address space** enter **10.1.0.0**. Leave the default of **/16 (65,536 addresses)** in the mask selection.

1. Select **+ Add a subnet**.

1. In **Add a subnet** enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Subnet details** |  |
    | Subnet template | Leave the default **Default**. |
    | Name | Enter **subnet-private**. |
    | Starting address | Enter **10.1.0.0**. |
    | Subnet size | Leave the default of **/24(256 addresses)**. |

1. Select **Add**.

1. Select **Review + create**.

1. Select **Create**.

## Create peering between hub and spoke one

A virtual network peering is used to connect the hub to spoke one and spoke one to the hub. Use the following example to create a two-way network peering between the hub and spoke one.

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

1. Select **vnet-hub**.

1. Select **Peerings** in **Settings**.

1. Select **+ Add**.

1. Enter or select the following information in **Add peering**:

    | Setting | Value |
    | ------- | ----- |
    | **This virtual network** |   |
    | Peering link name | Enter **vnet-hub-to-vnet-spoke-1**. |
    | Allow 'vnet-hub' to access 'vnet-spoke-1' | Leave the default of **Selected**. |
    | Allow 'vnet-hub' to receive forwarded traffic from 'vnet-spoke-1' | **Select** the checkbox. |
    | Allow gateway in 'vnet-hub' to forward traffic to 'vnet-spoke-1' | Leave the default of **Unselected**. |
    | Enable 'vnet-hub' to use 'vnet-spoke-1's' remote gateway | Leave the default of **Unselected**. |
    | **Remote virtual network** |   |
    | Peering link name | Enter **vnet-spoke-1-to-vnet-hub**. |
    | Virtual network deployment model | Leave the default of **Resource manager**. |
    | Subscription | Select your subscription. |
    | Virtual network | Select **vnet-spoke-1**. |
    | Allow 'vnet-spoke-1' to access 'vnet-hub' | Leave the default of **Selected**. |
    | Allow 'vnet-spoke-1' to receive forwarded traffic from 'vnet-hub' | **Select** the checkbox. |
    | Allow gateway in 'vnet-spoke-1' to forward traffic to 'vnet-hub' | Leave the default of **Unselected**. |
    | Enable 'vnet-spoke-1' to use 'vnet-hub's' remote gateway | Leave the default of **Unselected**. |
    
1. Select **Add**.

1. Select **Refresh** and verify **Peering status** is **Connected**.

## Create spoke one network route table

Create a route table to force all inter-spoke and internet egress traffic through the simulated NVA in the hub virtual network.

1. In the search box at the top of the portal, enter **Route table**. Select **Route tables** in the search results.

1. Select **+ Create**.

1. In **Create Route table** enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |   |
    | Region | Select **South Central US**. |
    | Name | Enter **route-table-nat-spoke-1**. |
    | Propagate gateway routes | Leave the default of **Yes**. |

1. Select **Review + create**. 

1. Select **Create**.

1. In the search box at the top of the portal, enter **Route table**. Select **Route tables** in the search results.

1. Select **route-table-nat-spoke-1**.

1. In **Settings** select **Routes**.

1. Select **+ Add** in **Routes**.

1. Enter or select the following information in **Add route**:

    | Setting | Value |
    | ------- | ----- |
    | Route name | Enter **default-via-nat-spoke-1**. |
    | Destination type | Select **IP Addresses**. |
    | Destination IP addresses/CIDR ranges | Enter **0.0.0.0/0**. |
    | Next hop type | Select **Virtual appliance**. |
    | Next hop address | Enter **10.0.0.10**. </br> **_This is the IP address you added to the private interface of the NVA in the previous steps._**. |

1. Select **Add**.

1. Select **Subnets** in **Settings**.

1. Select **+ Associate**.

1. Enter or select the following information in **Associate subnet**:

    | Setting | Value |
    | ------- | ----- |
    | Virtual network | Select **vnet-spoke-1 (test-rg)**. |
    | Subnet | Select **subnet-private**. |

1. Select **OK**.

## Create spoke one test virtual machine

A Windows Server 2022 virtual machine is used to test the outbound internet traffic through the NAT gateway and inter-spoke traffic in the hub and spoke network. Use the following example to create a Windows Server 2022 virtual machine.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **+ Create** then **Azure virtual machine**.

1. In **Create a virtual machine** enter or select the following information in the **Basics** tab:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |   |
    | Virtual machine name | Enter **vm-spoke-1**. |
    | Region | Select **(US) South Central US**. |
    | Availability options | Select **No infrastructure redundancy required**. |
    | Security type | Select **Standard**. |
    | Image | Select **Windows Server 2022 Datacenter - x64 Gen2**. |
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
    | Virtual network | Select **vnet-spoke-1**. |
    | Subnet | Select **subnet-private (10.1.0.0/24)**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Advanced**. |
    | Configure network security group | Select **Create new**. </br> Enter **nsg-spoke-1**. |
    | Inbound rules | Select **+ Add an inbound rule**. </br> Select **HTTP** in **Service**. </br> Select **Add**. </br> Select **OK**. |

1. Select **OK**.

1. Leave the rest of the options at the defaults and select **Review + create**.

1. Select **Create**.

## Install IIS on spoke one test virtual machine

IIS is installed on the Windows Server 2022 virtual machine to test outbound internet traffic through the NAT gateway and inter-spoke traffic in the hub and spoke network.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **vm-spoke-1**.

1. In **Operations**, select **Run command**.

1. Select **RunPowerShellScript**.

1. Enter the following script in **Run Command Script**:

    ```powershell
    # Install IIS server role
    Install-WindowsFeature -name Web-Server -IncludeManagementTools
    
    # Remove default htm file
    Remove-Item  C:\inetpub\wwwroot\iisstart.htm
    
    # Add a new htm file that displays server name
    Add-Content -Path "C:\inetpub\wwwroot\iisstart.htm" -Value $("Hello World from " + $env:computername)
    ```

1. Select **Run**.

1. Wait for the script to complete before continuing to the next step. It can take a few minutes for the script to complete.

1. When the script completes, the **Output*** displays the following:

    ```output
    Success Restart Needed Exit Code      Feature Result                               
    ------- -------------- ---------      --------------                               
    True    No             Success        {Common HTTP Features, Default Document, D...
    ```
   
## Create the second spoke virtual network

Create the second virtual network for the second spoke of the hub and spoke network. 

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

1. Select **+ Create**.

1. In the **Basics** tab of **Create virtual network**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |   |
    | Name | Enter **vnet-spoke-2**. |
    | Region | Select **(US) West US 2**. |

1. Select **Next** to proceed to the **Security** tab.

1. Select **Next** to proceed to the **IP addresses** tab.

1. In the **IP Addresses** tab in **IPv4 address space**, select the trash can to delete the address space that is auto populated.

1. In **IPv4 address space** enter **10.2.0.0**. Leave the default of **/16 (65,536 addresses)** in the mask selection.

1. Select **+ Add a subnet**.

1. In **Add a subnet** enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Subnet details** |  |
    | Subnet template | Leave the default **Default**. |
    | Name | Enter **subnet-private**. |
    | Starting address | Enter **10.2.0.0**. |
    | Subnet size | Leave the default of **/24(256 addresses)**. |

1. Select **Add**.

1. Select **Review + create**.

1. Select **Create**.

## Create peering between hub and spoke two

Create a two-way virtual network peer between the hub and spoke two.

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

1. Select **vnet-hub**.

1. Select **Peerings** in **Settings**.

1. Select **+ Add**.

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

1. Select **vnet-hub**.

1. Select **Peerings** in **Settings**.

1. Select **+ Add**.

1. Enter or select the following information in **Add peering**:

    | Setting | Value |
    | ------- | ----- |
    | **This virtual network** |   |
    | Peering link name | Enter **vnet-hub-to-vnet-spoke-2**. |
    | Allow 'vnet-hub' to access 'vnet-spoke-2' | Leave the default of **Selected**. |
    | Allow 'vnet-hub' to receive forwarded traffic from 'vnet-spoke-2' | **Select** the checkbox. |
    | Allow gateway in 'vnet-hub' to forward traffic to 'vnet-spoke-2' | Leave the default of **Unselected**. |
    | Enable 'vnet-hub' to use 'vnet-spoke-2's' remote gateway | Leave the default of **Unselected**. |
    | **Remote virtual network** |   |
    | Peering link name | Enter **vnet-spoke-2-to-vnet-hub**. |
    | Virtual network deployment model | Leave the default of **Resource manager**. |
    | Subscription | Select your subscription. |
    | Virtual network | Select **vnet-spoke-2**. |
    | Allow 'vnet-spoke-1' to access 'vnet-hub' | Leave the default of **Selected**. |
    | Allow 'vnet-spoke-1' to receive forwarded traffic from 'vnet-hub' | **Select** the checkbox. |
    | Allow gateway in 'vnet-spoke-1' to forward traffic to 'vnet-hub' | Leave the default of **Unselected**. |
    | Enable 'vnet-spoke-1' to use 'vnet-hub's' remote gateway | Leave the default of **Unselected**. |
    
1. Select **Add**.

1. Select **Refresh** and verify **Peering status** is **Connected**.

## Create spoke two network route table

Create a route table to force all outbound internet and inter-spoke traffic through the simulated NVA in the hub virtual network.

1. In the search box at the top of the portal, enter **Route table**. Select **Route tables** in the search results.

1. Select **+ Create**.

1. In **Create Route table** enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |   |
    | Region | Select **West US 2**. |
    | Name | Enter **route-table-nat-spoke-2**. |
    | Propagate gateway routes | Leave the default of **Yes**. |

1. Select **Review + create**. 

1. Select **Create**.

1. In the search box at the top of the portal, enter **Route table**. Select **Route tables** in the search results.

1. Select **route-table-nat-spoke-2**.

1. In **Settings** select **Routes**.

1. Select **+ Add** in **Routes**.

1. Enter or select the following information in **Add route**:

    | Setting | Value |
    | ------- | ----- |
    | Route name | Enter **default-via-nat-spoke-2**. |
    | Destination type | Select **IP Addresses**. |
    | Destination IP addresses/CIDR ranges | Enter **0.0.0.0/0**. |
    | Next hop type | Select **Virtual appliance**. |
    | Next hop address | Enter **10.0.0.10**. </br> **_This is the IP address you added to the private interface of the NVA in the previous steps._**. |

1. Select **Add**.

1. Select **Subnets** in **Settings**.

1. Select **+ Associate**.

1. Enter or select the following information in **Associate subnet**:

    | Setting | Value |
    | ------- | ----- |
    | Virtual network | Select **vnet-spoke-2 (test-rg)**. |
    | Subnet | Select **subnet-private**. |

1. Select **OK**.

## Create spoke two test virtual machine

Create a Windows Server 2022 virtual machine for the test virtual machine in spoke two.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **+ Create** then **Azure virtual machine**.

1. In **Create a virtual machine** enter or select the following information in the **Basics** tab:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |   |
    | Virtual machine name | Enter **vm-spoke-2**. |
    | Region | Select **(US) West US 2**. |
    | Availability options | Select **No infrastructure redundancy required**. |
    | Security type | Select **Standard**. |
    | Image | Select **Windows Server 2022 Datacenter - x64 Gen2**. |
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
    | Virtual network | Select **vnet-spoke-2**. |
    | Subnet | Select **subnet-private (10.2.0.0/24)**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Advanced**. |
    | Configure network security group | Select **Create new**. </br> Enter **nsg-spoke-2**. |
    | Inbound rules | Select **+ Add an inbound rule**. </br> Select **HTTP** in **Service**. </br> Select **Add**. </br> Select **OK**. |

1. Leave the rest of the options at the defaults and select **Review + create**.

1. Select **Create**.

## Install IIS on spoke two test virtual machine

IIS is installed on the Windows Server 2022 virtual machine to test outbound internet traffic through the NAT gateway and inter-spoke traffic in the hub and spoke network.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **vm-spoke-2**.

1. In **Operations**, select **Run command**.

1. Select **RunPowerShellScript**.

1. Enter the following script in **Run Command Script**:

    ```powershell
    # Install IIS server role
    Install-WindowsFeature -name Web-Server -IncludeManagementTools
    
    # Remove default htm file
    Remove-Item  C:\inetpub\wwwroot\iisstart.htm
    
    # Add a new htm file that displays server name
    Add-Content -Path "C:\inetpub\wwwroot\iisstart.htm" -Value $("Hello World from " + $env:computername)
    ```

1. Select **Run**.

1. Wait for the script to complete before continuing to the next step. It can take a few minutes for the script to complete.

1. When the script completes, the **Output*** displays the following:

    ```output
    Success Restart Needed Exit Code      Feature Result                               
    ------- -------------- ---------      --------------                               
    True    No             Success        {Common HTTP Features, Default Document, D...
    ```

## Test NAT gateway

Connect to the Windows Server 2022 virtual machines you created in the previous steps to verify that the outbound internet traffic is leaving the NAT gateway.

### Obtain NAT gateway public IP address

Obtain the NAT gateway public IP address for verification of the steps later in the article.

1. In the search box at the top of the portal, enter **Public IP**. Select **Public IP addresses** in the search results.

1. Select **public-ip-nat**.

1. Make note of value in **IP address**. The example used in this article is **52.153.224.79**.

### Test NAT gateway from spoke one

Use Microsoft Edge on the Windows Server 2022 virtual machine to connect to https://whatsmyip.com to verify the functionality of the NAT gateway.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **vm-spoke-1**.

1. In **Operations**, select **Bastion**.

1. Enter the username and password you entered when the virtual machine was created.

1. Select **Connect**.

1. Open **Microsoft Edge** when the desktop finishes loading.

1. In the address bar, enter **https://whatsmyip.com**.

1. Verify the outbound IP address displayed is the same as the IP of the NAT gateway you obtained previously.

    :::image type="content" source="./media/tutorial-hub-spoke-route-nat/outbound-ip-address.png" alt-text="Screenshot of outbound IP address.":::

1. Leave the bastion connection open to **vm-spoke-1**.

### Test NAT gateway from spoke two

Use Microsoft Edge on the Windows Server 2022 virtual machine to connect to https://whatsmyip.com to verify the functionality of the NAT gateway.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **vm-spoke-2**.

1. In **Operations**, select **Bastion**.

1. Enter the username and password you entered when the virtual machine was created.

1. Select **Connect**.

1. Open **Microsoft Edge** when the desktop finishes loading.

1. In the address bar, enter **https://whatsmyip.com**.

1. Verify the outbound IP address displayed is the same as the IP of the NAT gateway you obtained previously.

    :::image type="content" source="./media/tutorial-hub-spoke-route-nat/outbound-ip-address.png" alt-text="Screenshot of outbound IP address.":::

1. Leave the bastion connection open to **vm-spoke-2**.

## Test routing between the spokes

Traffic from spoke one to spoke two and spoke two to spoke one route through the simulated NVA in the hub virtual network. Use the following examples to verify the routing between spokes of the hub and spoke network.

### Test routing from spoke one to spoke two

Use Microsoft Edge to connect to the web server on **vm-spoke-2** you installed in the previous steps.

1. Return to the open bastion connection to **vm-spoke-1**.

1. Open **Microsoft Edge** if it's not open.

1. In the address bar, enter **10.2.0.4**.

1. Verify the IIS page is displayed from **vm-spoke-2**.

    :::image type="content" source="./media/tutorial-hub-spoke-route-nat/iis-myvm-spoke-1.png" alt-text="Screenshot of default IIS page on vm-spoke-1.":::

1. Close the bastion connection to **vm-spoke-1**.

### Test routing from spoke two to spoke one

Use Microsoft Edge to connect to the web server on **vm-spoke-1** you installed in the previous steps.

1. Return to the open bastion connection to **vm-spoke-2**.

1. Open **Microsoft Edge** if it's not open.

1. In the address bar, enter **10.1.0.4**.

1. Verify the IIS page is displayed from **vm-spoke-1**.

    :::image type="content" source="./media/tutorial-hub-spoke-route-nat/iis-myvm-spoke-2.png" alt-text="Screenshot of default IIS page on vm-spoke-2.":::

1. Close the bastion connection to **vm-spoke-1**.

[!INCLUDE [portal-clean-up.md](../../includes/portal-clean-up.md)]

## Next steps

Advance to the next article to learn how to use an Azure Gateway Load Balancer for highly available network virtual appliances:
> [!div class="nextstepaction"]
> [Gateway Load Balancer](../load-balancer/gateway-overview.md)
