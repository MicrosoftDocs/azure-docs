---
title: Deploy a DHCP server in Azure on a virtual machine
titleSuffix: Azure Virtual Network
description: Learn about how to deploy a Dynamic Host Configuration Protocol (DHCP) server in Azure on a virtual machine as a target for an on-premises DHCP relay agent.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.topic: how-to
ms.date: 02/28/2024

#customer intent: As a Network Administrator, I want to deploy a highly available DHCP server in Azure so that I can provide DHCP services to my on-premises network.

---

# Deploy a DHCP server in Azure on a virtual machine

Learn how to deploy a highly available DHCP server in Azure on a virtual machine. This server is used as a target for an on-premises DHCP relay agent to provide dynamic IP address allocation to on-premises clients. Broadcast packets directly from clients to a DHCP Server don't work in an Azure Virtual Network by design.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

[!INCLUDE [virtual-network-create-with-bastion.md](../../includes/virtual-network-create-with-bastion.md)]

## Create internal load balancer

In this section, you create an internal load balancer that load balances virtual machines. An internal load balancer is used to load balance traffic inside a virtual network with a private IP address.

During the creation of the load balancer, you configure:

* Frontend IP address
* Backend pool
* Inbound load-balancing rules

1. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

1. In the **Load balancer** page, select **Create**.

1. In the **Basics** tab of the **Create load balancer** page, enter, or select the following information: 

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | **Project details** |   |
    | Subscription               | Select your subscription.    |    
    | Resource group         | Select **test-rg**. |
    | **Instance details** |   |
    | Name                   | Enter **load-balancer**                                   |
    | Region         | Select **(US) East US 2**.                                        |
    | SKU           | Leave the default **Standard**. |
    | Type          | Select **Internal**.                                        |
    | Tier          | Leave the default **Regional**. |

1. Select **Next: Frontend IP configuration** at the bottom of the page.

1. In **Frontend IP configuration**, select **+ Add a frontend IP configuration**.

1. Enter **frontend-1** in **Name**.

1. Select **subnet-1 (10.0.0.0/24)** in **Subnet**.

1. In **Assignment**, select **Static**.

1. In **IP address**, enter **10.0.0.100**.

1. Select **Add**.

1. Select **Next: Backend pools** at the bottom of the page.

1. In the **Backend pools** tab, select **+ Add a backend pool**.

1. Enter **backend-pool** for **Name** in **Add backend pool**.

1. Select **NIC** or **IP Address** for **Backend Pool Configuration**.

1. Select **Save**.

1. Select the blue **Review + create** button at the bottom of the page.

1. Select **Create**.

## Configure second load balancer frontend

A second frontend is required for the load balancer to provide high availability for the DHCP server. Use the following steps to add a second frontend to the load balancer.

1. In the Azure portal, search for and select **Load balancers**.

1. Select **load-balancer**.

1. In **Settings**, select **Frontend IP configuration**.

1. Select **+ Add**.

1. Enter or select the following information in **Add frontend IP configuration**:

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | **Name** | Enter **frontend-2**. |
    | **Subnet** | Select **subnet-1 (10.0.0.0/24)**. |
    | **Assignment** | Select **Static**. |
    | **IP address** | Enter **10.0.0.200**. |
    | **Availability zone** | Select **Zone-redundant**. |

1. Select **Add**.

1. Verify that in **Frontend IP configuration**, you have **frontend-1** and **frontend-2**.

## Create load balancer rules

The load balancer rules are used to distribute traffic to the virtual machines. Use the following steps to create the load balancer rules.

1. In the Azure portal, search for and select **Load balancers**.

1. Select **load-balancer**.

1. In **Settings**, select **Load balancing rules**.

1. Select **+ Add**.

1. Enter or select the following information in **Add load balancing rule**:

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | **Name** | Enter **lb-rule-1**. |
    | **IP version** | Select **IPv4**. |
    | **Frontend IP address** | Select **frontend-1**. |
    | **Backend pool** | Select **backend-pool**. |
    | **Protocol** | Select **UDP**. |
    | **Port** | Enter **67**. |
    | **Backend port** | Enter **67**. |
    | **Health probe** | Select **Create new**. </br> Enter **dhcp-health-probe** for **Name**. </br> Select **TCP** for **Protocol**. </br> Enter **3389** for **Port**. </br> Enter **67** for **Interval**. </br> Enter **5** for **Unhealthy threshold**. </br> Select **Save**. |
    | **Enable Floating IP** | Select the box. |

1. Select **Save**.

1. Repeat the previous steps to create the second load balancing rule. Replace the following values with the values for the second frontend:

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | **Name** | Enter **lb-rule-2**. |
    | **Frontend IP address** | Select **frontend-2**. |
    | **Health probe** | Select **dhcp-health-probe**. |

[!INCLUDE [create-two-virtual-machines-windows-load-balancer.md](../../includes/create-two-virtual-machines-windows-load-balancer.md)]

## Configure DHCP server network adapters

You'll sign-in to the virtual machines with Azure Bastion and configure the network adapter settings and DHCP server role for each virtual machine.

1. In the Azure portal, search for and select **Virtual machines**.

1. Select **vm-1**.

1. In the **vm-1** page, select **Connect** then **Connect via Bastion**.

1. Enter the username and password you created when you created the virtual machine.

1. Open **PowerShell** as an administrator.

1. Run the following command to install the DHCP server role:

    ```powershell
    Install-WindowsFeature -Name DHCP -IncludeManagementTools
    ```

### Install Microsoft Loopback Adapter

Use the following steps to install the Microsoft Loopback Adapter by using the Hardware Wizard:

1. Open **Device Manager** on the virtual machine. 

1. Select the computer name **vm-1** in **Device Manager**.

1. In the menu bar, select **Action** then **Add legacy hardware**.

1. In the **Add Hardware Wizard**, select **Next**.

1. Select **Install the hardware that I manually select from a list (Advanced)**, and then select **Next**  

1. In the **Common hardware types** list, select **Network adapters**, and then select **Next**.

1. In the **Manufacturers** list box, select **Microsoft**.

1. In the **Network Adapter** list box, select **Microsoft Loopback Adapter**, and then select **Next**.

1. select **Next** to start installing the drivers for your hardware.

1. select **Finish**.

1. In **Device Manager**, expand **Network adapters**. Verify that **Microsoft Loopback Adapter** is listed.

1. Close **Device Manager**.

### Set static IP address for Microsoft Loopback Adapter

Use the following steps to set a static IP address for the Microsoft Loopback Adapter:

1. Open **Network and Internet settings** on the virtual machine.

1. Select **Change adapter options**.

1. Right-click **Microsoft Loopback Adapter** and select **Properties**.

1. Select **Internet Protocol Version 4 (TCP/IPv4)** and select **Properties**.

1. Select **Use the following IP address**.

1. Enter the following information:

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | **IP address** | Enter **10.0.0.100**. |
    | **Subnet mask** | Enter **255.255.255.0**. |

1. Select **OK**.

1. Select **Close**.

### Enable routing between the loopback interface and the network adapter

Use the following steps to enable routing between the loopback interface and the network adapter:

1. Open **CMD** as an administrator.

1. Run the following command to list the network interfaces:

    ```cmd
    netsh int ipv4 show int
    ```

    ```output
    C:\Users\azureuser>netsh int ipv4 show int

    Idx     Met         MTU          State                Name
    ---  ----------  ----------  ------------  ---------------------------
      1          75  4294967295  connected     Loopback Pseudo-Interface 1
      6           5        1500  connected     Ethernet
     11          25        1500  connected     Ethernet 3
    ```

    In this example, the network interface connected to the Azure Virtual network is **Ethernet**. The loopback interface that you installed in the previous section is **Ethernet 3**.

    **Make note of the `Idx` number for the primary network adapter and the loopback adapter. In this example the primary network adapter is `6` and the loopback adapter is `11`. You'll need these values for the next steps.**

    > [!CAUTION]
    > Don't confuse the **Loopback Loopback Pseudo-Interface 1** with the **Microsoft Loopback Adapter**. The **Loopback Pseudo-Interface 1** isn't used in this scenario.

1. Run the following command to enable **weakhostreceive** and **weakhostsend** on the primary network adapter:

    ```cmd
    netsh int ipv4 set int 6 weakhostreceive=enabled weakhostsend=enabled
    ```

1. Run the following command to enable **weakhostreceive** and **weakhostsend** on the loopback adapter:

    ```cmd    
    netsh int ipv4 set int 11 weakhostreceive=enabled weakhostsend=enabled
    ```

1. Close the bastion connection to **vm-1**.

1. Repeat the previous steps to configure **vm-2**. Replace the IP address of **10.0.0.100** with **10.0.0.200** in the static IP address configuration of the loopback adapter.

## Next step

In this article, you learned how to deploy a highly available DHCP server in Azure on a virtual machine. You also learned how to configure the network adapters and installed the DHCP role on the virtual machines. Further configuration of the DHCP server is required to provide DHCP services to on-premises clients from the Azure Virtual Machines. The DHCP relay agent on the on-premises network must be configured to forward DHCP requests to the DHCP servers in Azure. Consult the manufacturer's documentation for the DHCP relay agent for configuration steps.
