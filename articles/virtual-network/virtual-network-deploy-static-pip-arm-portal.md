---
title: Create a VM with a static public IP address - Azure portal
description: Learn how to create a VM with a static public IP address using the Azure portal.
services: virtual-network
documentationcenter: na
author: asudbring
manager: KumudD
ms.service: virtual-network
ms.subservice: ip-services
ms.devlang:
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 11/12/2020
ms.author: allensu

---
# Create a virtual machine with a static public IP address using the Azure portal

You can create a virtual machine with a static public IP address. A public IP address enables you to communicate to a virtual machine from the internet. 

Assign a static public IP address, rather than a dynamic address, to ensure that the address never changes.   

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create a virtual machine

1. On the upper-left side of the portal, select **Create a resource** > **Compute** > **Virtual machine** or search for **Virtual machine** in the search box.
   
2. In **Create a virtual machine**, type or select the values in the **Basics** tab:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription |
    | Resource Group | Select **Create new**. </br> In **Name**, enter **myResourceGroup**. </br> Select **OK**. |
    | **Instance details** |  |
    | Virtual machine name | Enter **myVM** |
    | Region | Select **East US** |
    | Availability Options | Select **No infrastructure redundancy required** |
    | Image | Select **Windows Server 2019 Datacenter - Gen1** |
    | Azure Spot instance | Select **No** |
    | Size | Choose VM size or take default setting |
    | **Administrator account** |  |
    | Username | Enter a username |
    | Password | Enter a password |
    | Confirm password | Reenter password |

3. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.
  
4. In the Networking tab, select or enter:

    | Setting | Value |
    |-|-|
    | **Network interface** |  |
    | Virtual network | Accept the default network name. |
    | Subnet | Accept the default subnet configuration. |
    | Public IP | Select **Create new**. </br> In **Create public IP address**, for name enter **myPublicIP**. </br> In **SKU**, select **Standard**. </br> In **Assignment**, select **Static**. </br> Select **OK**.  |
    | NIC network security group | Select **Basic**|
    | Public inbound ports | Select **Allow selected ports**. |
    | Select inbound ports | Select **RDP (3389)** |

    > [!WARNING]
    > Opening port 3389 to the internet is not recommended to manage production workloads. </br> For secure access to Azure virtual machines, see **[What is Azure Bastion?](/azure/bastion/bastion-overview)**
   
5. Select **Review + create**. 
  
6. Review the settings, and then select **Create**.

## Clean up resources

When no longer needed, delete the resource group and all of the resources it contains:

1. Enter **myResourceGroup** in the **Search** box at the top of the portal. When you see **myResourceGroup** in the search results, select it.
2. Select **Delete resource group**.
3. Enter **myResourceGroup** for **TYPE THE RESOURCE GROUP NAME:** and select **Delete**.

## Next steps

Azure assigned a public IP address from addresses used in the region you created the virtual machine in. 

You can download the list of ranges (prefixes) for the Azure [Public](https://www.microsoft.com/download/details.aspx?id=56519), [US government](https://www.microsoft.com/download/details.aspx?id=57063), [China](https://www.microsoft.com/download/details.aspx?id=57062), and [Germany](https://www.microsoft.com/download/details.aspx?id=57064) clouds.

- Learn more about [static public IP addresses](virtual-network-ip-addresses-overview-arm.md#allocation-method).
- Learn more about [public IP addresses](virtual-network-ip-addresses-overview-arm.md#public-ip-addresses) in Azure.
- Learn more about all [public IP address settings](virtual-network-public-ip-address.md#create-a-public-ip-address).
- Learn more about [private IP addresses](virtual-network-ip-addresses-overview-arm.md#private-ip-addresses) and assigning a [static private IP address](virtual-network-network-interface-addresses.md#add-ip-addresses) to an Azure virtual machine.
