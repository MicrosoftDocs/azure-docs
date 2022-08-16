---
title: Create an Azure virtual machine with a dual-stack network - Azure portal
titleSuffix: Azure Virtual Network
description: In this article, learn how to use the Azure portal to create a virtual machine with a dual-stack virtual network in Azure.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.date: 08/17/2022
ms.custom: template-how-to
---

# Create an Azure Virtual Machine with a dual-stack network using the Azure portal

In this article, you'll create a virtual machine in Azure with the Azure portal. The virtual machine is created along with the dual-stack network as part of the procedures.  When completed, the virtual machine supports IPv4 and IPv6 communication.  

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create a virtual network

In this section, you'll create a dual-stack virtual network for the virtual machine.

1. Sign-in to the [Azure portal](https://https://portal.azure.com).

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

You'll create two public IP addresses in this section, IPv4 and IPv6. 

1. In the search box at the top of the portal, enter **Public IP address**. Select **Public IP addresses** in the search results.

2. Select **+ Create**. 

3. Enter or select the following information in **Create public IP address**. 

    | Setting | Value |
    | ------- | ----- |
    | IP version | Select **Both**. |
    | SKU | Leave the default of **Standard**. |
    | **Ipv4 IP Address Configuration** |   |
    | Name | Enter **myPublicIP-IPv4**. |
    | Routing preference | Leave the default of **Microsoft network**. |
    | Idle timeout (minutes) | Leave the default of **4**. |
    | **IPv6 IP Address Configuration** |   |
    | Name | Enter **myPublicIP-IPv6**. |
    | Idle timeout (minutes) | Leave the default of **4**. |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. |
    | Location | Select **East US 2**. |
    | Availability zone | Select **Zone redundant**. |

4. Select **Create**. 

## Create network security group

You'll create a network security group to allow SSH connections to the virtual machine.

1. In the search box at the top of the portal, enter **Network security group**. Select **Network security groups** in the search results.

2. Select **+Create**. 

3. Enter or select the following information in the **Basics** tab.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. |
    | **Instance details** |   |
    | Name | Enter **myNSG**. |
    | Region | Select **East US 2**. |

4. Select **Review + create**. 

5. Select **Create**. 

### Create network security group rules

In this section, you'll create the inbound rule.

1. In the search box at the top of the portal, enter **Network security group**. Select **Network security groups** in the search results.

2. In **Network security groups**, select **myNSG**.

3. In **Settings**, select **Inbound security rules**.

4. Select **+ Add**.

5. In **Add inbound security rule**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | Source | Leave the default of **Any**. |
    | Source port ranges | Leave the default of *. |
    | Destination | Leave the default of **Any**. |
    | Service | Select **SSH**. |
    | Action | Leave the default of **Allow**. |
    | Priority | Enter **200**. |
    | Name | Enter **myNSGRuleSSH**. |
    
6. Select **Add**. 

## Create virtual machine

In this section, you'll create the virtual machine and its supporting resources.

### Create network interface

You'll create a network interface and attach the public IP addresses you created previously.

1. In the search box at the top of the portal, enter **Network interface**. Select **Network interfaces** in the search results.

2. Select **+ Create**. 

3. In the **Basics** tab of **Create network interface, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. |
    | **Instance details** |  |
    | Name | Enter **myNIC1**. |
    | Region | Select **East US 2**. |
    | Virtual network | Select **myVNet**. |
    | Subnet | Select **myBackendSubnet (10.1.0.0/24,2404:f800:8000:122:/64)**. |
    | Network security group | Select **myNSG**. |
    | Private IP address (IPv6) | Select the box. |
    | IPv6 name | Enter **Ipv6config**. |

4. Select **Review + create**.

5. Select **Create**.

### Associate public IP addresses

You'll associate the IPv4 and IPv6 addresses you created previously to the network interface.

1. In the search box at the top of the portal, enter **Network interface**. Select **Network interfaces** in the search results.

2. Select **myNIC1**.

3. Select **IP configurations** in **Settings**.

4. In **IP configurations**, select **Ipv4config**.

5. In **Ipv4config**, select **Associate** in **Public IP address**.

6. Select **myPublicIP-IPv4** in **Public IP address**.

7. Select **Save**.

8. Close **Ipv4config**.

9. In **IP configurations**, select **ipconfig-ipv6**.

10. In **Ipv6config**, select **Associate** in **Public IP address**.

11. Select **myPublicIP-IPv6** in **Public IP address**.

12. Select **Save**.

### Create virtual machine

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
    | Public IP | Select **None**. |
    | NIC network security group | Select **None**. |

6. Select **Review + create**.

7. Select **Create**. 

8. **Generate new key pair** will appear. Select **Download private key and create resource**.

9. The private key will download to your local computer. Copy the private key to a directory on your computer. In the following example, it's **~/.ssh**.

10. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

11. Select **myVM**.

12. Stop **myVM**.

### Network interface configuration

A network interface is automatically created and attached to the chosen virtual network during creation. In this section, you'll remove this default network interface and attach the network interface you created previously.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. Select **myVM**.

3. Select **Networking** in **Settings**.

4. Select **Attach network interface**.

5. Select **myNIC1** that you created previously.

6. Select **OK**.

7. Select **Detach network interface**.

8. The name of your default network interface will be **myvmxx**, with xx a random number. In this example, it's **myvm281**. Select **myvm281** in **Detach network interface**.

9. Select **OK**.

10. Return to the **Overview** of **myVM** and start the virtual machine.

11. The default network interface can be safely deleted.

## Test SSH connection

You'll connect to the virtual machine with SSH to test the IPv4 public IP address.

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


