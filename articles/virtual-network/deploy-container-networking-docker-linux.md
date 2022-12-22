---
title: Deploy container networking for a stand-alone Linux Docker host
titleSuffix: Azure Virtual Network
description: Learn how to deploy the Azure CNI plug-in to enable container virtual network connectivity for a standalone Linux Docker host.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.topic: how-to
ms.date: 12/22/2022
ms.custom: template-how-to
---

# Deploy container networking for a stand-alone Linux Docker host

The Azure CNI plugin enables per container/pod networking for stand-alone docker hosts and Kubernetes clusters. In this article, you'll learn how to install and configure the CNI plugin for a standalone Linux Docker host.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create virtual network

A virtual network contains the virtual machine used in this article. In this section, you'll create a virtual network and subnet. You'll enable Azure Bastion during the virtual network deployment. The Azure Bastion host is used to securely connect to the virtual machine to complete the steps in this article.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

3. Select **+ Create**.

4. Enter or select the following information in the **Basics** tab of **Create virtual network**:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter **myResourceGroup** in **Name**. </br> Select **OK**. |
    | **Instance details** |   |
    | Name | Enter **myVNet**. |
    | Region | Select a region. |

5. Select **Next: IP Addresses**. 

6. In **IPv4 address space**, enter **10.1.0.0/16**.

7. Select **+ Add subnet**.

8. Enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Subnet name | Enter **mySubnet**. |
    | Subnet address range | Enter **10.1.0.0/24**. |

9. Select **Add**.

10. Select **Next: Security**.

11. Select **Enable** in **BastionHost**.

12. Enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Bastion name | Enter **myBastion**. |
    | AzureBastionSubnet address space | Enter **10.1.1.0/26**. |
    | Public IP address | Select **Create new**. </br> Enter **myBastionIP** in **Name**. </br> Select **OK**. |

13. Select **Review + create**.

14. Select **Create**.

It can take a few minutes for the Bastion host to deploy. You can continue with the steps while the Bastion host is deploying.

## Create virtual machine

In this section, you'll create a Ubuntu virtual machine for the stand-alone Docker host. Ubuntu is used for the example in this article. The CNI plug-in supports Windows and other Linux distributions.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. Select **+ Create** > **Azure virtual machine**.

3. Enter or select the following information in the **Basics** tab of **Create a virtual machine**:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. |
    | **Instance details** |    |
    | Virtual machine name | Enter **myVM**. |
    | Region | Select a region. |
    | Availability options | Select **No infrastructure required**. |
    | Security type | Select **Standard**. |
    | Image | Select **Ubuntu Server 20.04 LTS -x64 Gen2**. |
    | VM architecture | Leave the default of **x64**. |
    | Run with Azure Spot discount | Leave the default of unchecked. |
    | Size | Select a size. |
    | **Administrator account** |   |
    | Authentication type | Select **Password**. |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Re-enter password. |
    | **Inbound port rules** |   |
    | Public inbound ports | Select **None**. |

4. Select **Next: Disks**, then **Next: Networking**.

5. Enter or select the following information in the **Networking** tab:

    | Setting | Value |
    | ------- | ----- |
    | **Network interface** |   |
    | Virtual network | Select **myVNet**. |
    | Subnet | Select **mySubnet (10.1.0.0/24)**. |
    | Public IP | Select **None**. |

6. Select **Review + create**.

7. Select **Create**

## Add IP configuration

The Azure CNI plugin allocates IP addresses to containers based on a pool of IP addresses you create on the virtual network interface of the virtual machine. For every container on the host, a IP configuration must exist on the virtual network interface. If the number of containers on the server outnumber the IP configurations on the virtual network interface, the container will start but won't have an IP address. 

In this section you'll add an IP configuration to the virtual network interface of the virtual machine you created previously.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.




## Install Docker

## Install CNI plugin

## Create test container

## Clean up resources

If you're not going to continue to use this application, delete the virtual network, DDoS protection plan, and Route Server with the following steps:

1. In the search box at the top of the portal, enter **Resource group**. Select **Resource groups** in the search results.

2. Select **myResourceGroup**.

3. In the **Overview** of **myResourceGroup**, select **Delete resource group**.

4. In **TYPE THE RESOURCE GROUP NAME:**, enter **myResourceGroup**.

5. Select **Delete**.


## Next steps
<!-- Add a context sentence for the following links -->
- [Write how-to guides](contribute-how-to-write-howto.md)
- [Links](links-how-to.md)

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->
