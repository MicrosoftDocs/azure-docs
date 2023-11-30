---
title: Create an Azure virtual machine with a dual-stack network - Azure portal
titleSuffix: Azure Virtual Network
description: In this article, learn how to use the Azure portal to create a virtual machine with a dual-stack virtual network in Azure.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.date: 09/25/2023
ms.custom: template-how-to, devx-track-linux
---

# Create an Azure Virtual Machine with a dual-stack network using the Azure portal

In this article, you create a virtual machine in Azure with the Azure portal. The virtual machine is created along with the dual-stack network as part of the procedures.  When completed, the virtual machine supports IPv4 and IPv6 communication.  

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create a virtual network

In this section, you create a dual-stack virtual network for the virtual machine.

1. Sign-in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

3. Select **+ Create**.

4. In the **Basics** tab of **Create virtual network**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> In **Name**, enter **myResourceGroup**. </br> Select **OK**. |
    | **Instance details** |   |
    | Name | Enter **myVNet**. |
    | Region | Select **East US 2**. |

5. Select the **IP Addresses** tab, or **Next: IP Addresses**.

6. Leave the default IPv4 address space of **10.1.0.0/16**. If the default is absent or different, enter an IPv4 address space of **10.1.0.0/16**.

7. Select the **Add IPv6 address space** box.

8. In **IPv6 address space**, edit the default address space and change its value to **2404:f800:8000:122::/63**.

9. To add an IPv6 subnet, select **default** under **Subnet name**. If default is missing, select **+ Add subnet**.

10. In **Subnet name**, enter **myBackendSubnet**.

11. Leave the default IPv4 subnet of **10.1.0.0/24** in **Subnet address range**. Enter **10.1.0.0/24** if missing.

12. Select the box next to **Add IPv6 address space**.

13. In **IPv6 address range**, enter **2404:f800:8000:122::/64**.

14. Select **Save**. If creating a subnet, select **Add**.

15. Select the **Review + create**.

16. Select **Create**.

## Create public IP addresses

You create two public IP addresses in this section, IPv4 and IPv6. 

### Create IPv4 public IP address

1. In the search box at the top of the portal, enter **Public IP address**. Select **Public IP addresses** in the search results.

2. Select **+ Create**. 

3. Enter or select the following information in **Create public IP address**. 

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. |
    | Location | Select **East US 2**. |
    | Availability zone | Select **Zone redundant**. |
    | **Instance details** |   |
    | Name | Enter **myPublicIP-IPv4**. |
    | IP version | Select **IPv4**. |
    | SKU | Leave the default of **Standard**. |
    | Tier | Leave the default of **Regional**. |
    | **IP address assignment** |   |
    | Routing preference | Leave the default of **Microsoft network**. |
    | Idle timeout (minutes) | Leave the default of **4**. |
    | DNS name label | Enter **myPublicIP-IPv4**. |

4. Select **Review + create** then **Create**.

### Create IPv6 public IP address
1. In the search box at the top of the portal, enter **Public IP address**. Select **Public IP addresses** in the search results.

2. Select **+ Create**. 

3. Enter or select the following information in **Create public IP address**.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. |
    | Location | Select **East US 2**. |
    | Availability zone | Select **Zone redundant**. |
    | **Instance details** |   |
    | Name | Enter **myPublicIP-IPv6**. |
    | IP version | Select **IPv6**. |
    | SKU | Leave the default of **Standard**. |
    | Tier | Leave the default of **Regional**. |
    | **IP address assignment** |   |
    | DNS name label | Enter **myPublicIP-IPv6**. |

4. Select **Review + create** then **Create**.

## Create virtual machine

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. Select **+ Create** then **Azure virtual machine**.

3. In the **Basics** tab, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. |
    | **Instance details** |   |
    | Virtual machine name | Enter **myVM**. |
    | Region | Select **East US 2**. |
    | Availability options | Select **No infrastructure redundancy required**. |
    | Security type | Select **Standard**. |
    | Image | Select **Ubuntu Server 20.04 LTS - Gen2**. |
    | Size | Select the default size. |
    | **Administrator account** |   |
    | Authentication type | Select **SSH public key**. |
    | Username | Enter a username. |
    | SSH public key source | Select **Generate new key pair**. |
    | Key pair name | Enter **mySSHKey**. |
    | **Inbound port rules** |   |
    | Public inbound ports | Select **None**. |

4. Select the **Networking** tab, or **Next: Disks** then **Next: Networking**. 

5. Enter or select the following information in the **Networking** tab.

    | Setting | Value |
    | ------- | ----- |
    | **Network interface** |  |
    | Virtual network | Select **myVNet**. |
    | Subnet | Select **myBackendSubnet (10.1.0.0/24,2404:f800:8000:122:/64)**. |
    | Public IP | Select **myPublicIP-IPv4**. |
    | NIC network security group | Select **Advanced**. |
    | Configure network security group | Select **Create new**. </br> Enter **myNSG** in Name. </br> Select **OK**. |

6. Select **Review + create**.

7. Select **Create**. 

8. **Generate new key pair** appears. Select **Download private key and create resource**.

9. The private key downloads to your local computer. Copy the private key to a directory on your computer. In the following example, it's **~/.ssh**.

10. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

11. Select **myVM**.

12. Stop **myVM**.

## Network interface configuration

A network interface is automatically created and attached to the chosen virtual network during creation. In this section, you add the IPv6 configuration to the existing network interface.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. Select **myVM**.

3. Select **Stop**, to stop the virtual machine. Wait for the machine to shut down.

4. Select **Networking** in **Settings**.

5. The name of your default network interface will be **myvmxx**, with xx a random number. In this example, it's **myvm281**. Select **myvm281** next to **Network Interface:**.

6. In the properties of the network interface, select **IP configurations** in **Settings**.

7. In **IP configurations**, select **+ Add**.

8. In **Add IP configuration**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **Ipv6config**. |
    | IP version | Select **IPv6**. |
    | **Private IP address settings** |  |
    | Allocation | Leave the default of **Dynamic**. |
    | Public IP address | Select **Associate**. |
    | Public IP address | Select **myPublicIP-IPv6**. |

9. Select **OK**.

10. Return to the **Overview** of **myVM** and start the virtual machine.

## Test SSH connection

You connect to the virtual machine with SSH to test the IPv4 public IP address.

1. In the search box at the top of the portal, enter **Public IP address**. Select **Public IP addresses** in the search results.

2. Select **myPublicIP-IPv4**.

3. The public IPv4 address is in the **Overview** in **IP address**. In this example it's, **20.22.46.19**.

4. Open an SSH connection to the virtual machine by using the following command. Replace the IP address with the IP address of your virtual machine. Replace **`azureuser`** with the username you chose during virtual machine creation. The **`-i`** is the path to the private key that you downloaded earlier. In this example, it's **~/.ssh/mySSHKey.pem**.

    ```bash
    ssh -i ~/.ssh/mySSHkey.pem azureuser@20.22.46.19
    ```

## Clean up resources

When your finished with the resources created in this article, delete the resource group and all of the resources it contains:

1. In the search box at the top of the portal, enter **myResourceGroup**. Select **myResourceGroup** in the search results in **Resource groups**.

2. Select **Delete resource group**.

3. Enter **myResourceGroup** for **TYPE THE RESOURCE GROUP NAME** and select **Delete**.

## Next steps

In this article, you learned how to create an Azure Virtual machine with a dual-stack network.

For more information about IPv6 and IP addresses in Azure, see:

- [Overview of IPv6 for Azure Virtual Network.](ipv6-overview.md)

- [What is Azure Virtual Network IP Services?](ip-services-overview.md)
