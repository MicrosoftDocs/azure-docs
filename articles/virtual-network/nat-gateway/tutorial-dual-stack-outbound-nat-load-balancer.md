---
title: 'Tutorial: Configure dual-stack outbound connectivity with a NAT gateway and a public load balancer'
description: Learn how to configure outbound connectivity for a dual stack network with a NAT gateway and a public load balancer.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.subservice: nat
ms.topic: tutorial
ms.date: 02/05/2023
ms.custom: template-tutorial
---

# Tutorial: Configure dual stack outbound connectivity with a NAT gateway and a public load balancer

In this tutorial you will learn how to configure NAT gateway and a public load balancer to a dual stack subnet in order to allow for outbound connectivity for v4 workloads using NAT gateway and v6 workloads using Public Load balancer.

NAT gateway supports the use of IPv4 public IP addresses for outbound connectivity whereas Load balancer supports both IPv4 and IPv6 public IP addresses. When NAT gateway with an IPv4 public IP is present with a Load balancer using an IPv4 public IP address, NAT gateway takes precedence over load balancer for providing outbound connectivity. However, when NAT gateway is placed on a dual stack subnet where a Load balancer with an IPv6 public IP address is configured, NAT gateway will be used for sending all IPv4 traffic and Load balancer will be used to send all IPv6 traffic outbound.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network
> * Create a NAT gateway with an IPv4 public address
> * Add IPv6 to the virtual network
> * Create a public load balancer with an IPv6 public address
> * Create a dual-stack virtual machine
> * Validate outbound connectivity from your dual stack virtual machine

## Prerequisites

# [**Portal**](#tab/dual-stack-outbound-portal)

- An Azure account with an active subscription. [Create an account for free]
(https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

# [**PowerShell**](#tab/dual-stack-outbound-powershell)

- An Azure account with an active subscription. [Create an account for free]
(https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Azure PowerShell installed locally or Azure Cloud Shell

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

# [**CLI**](#tab/dual-stack-outbound--cli)

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- An Azure account with an active subscription. [Create an account for free]
(https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- This tutorial requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

---

## Create virtual network

In this section, you'll create a virtual network for the virtual machine and load balancer.

# [**Portal**](#tab/dual-stack-outbound-portal)

1. Sign-in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

1. Select **+ Create**.

1. In the **Basics** tab of **Create virtual network**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter **TutorialIPv6NATLB-rg**. </br> Select **OK**. |
    | **Instance details** |   |
    | Name | Enter **myVNet**. |
    | Region | Select **West US 2**. |

1. Select the **IP Addresses** tab, or **Next: IP Addresses**.

1. Leave the default IPv4 address space of **10.1.0.0/16**. If the default is absent or different, enter an IPv4 address space of **10.1.0.0/16**.

1. Select **default** under **Subnet name**. If default is missing, select **+ Add subnet**.

1. In **Subnet name**, enter **myBackendSubnet**.

1. Leave the default IPv4 subnet of **10.1.0.0/24**.

1. Select **Save**. If creating a subnet, select **Add**.

1. Select the **Security** tab or select **Next: Security**.

1. In **BastionHost**, select **Enable**.

1. Enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Bastion name | **myBastion** |
    | AzureBastionSubnet address space | Enter **10.1.1.0/26**. |
    | Public IP address | Select **Create new**. </br> Enter **myPublicIP-Bastion** in **Name**. </br> Select **OK**. |

1. Select the **Review + create**.

1. Select **Create**.

It will take a few minutes for the bastion host to deploy. You can proceed to the next steps when the virtual network is deployed.

# [**PowerShell**](#tab/dual-stack-outbound-powershell)

# [**CLI**](#tab/dual-stack-outbound--cli)

---
## Create NAT gateway

The NAT gateway provides the outbound connectivity for the IPv4 portion of the virtual network. Use the following example to create a NAT gateway.

# [**Portal**](#tab/dual-stack-outbound-portal)

1. In the search box at the top of the portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

1. Select **+ Create**.

1. In the **Basics** tab of **Create network address translation (NAT) gateway**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group |  Select **TutorialIPv6NATLB-rg**. |
    | **Instance details** |   |
    | NAT gateway name | Enter **myNATgateway**. |
    | Region | Select **West US 2**. |
    | Availability zone | Select a zone or **No Zone**. |
    | TCP idle timeout (minutes) | Leave the default of **4**. |

1. Select **Next: Outbound IP**.

1. In **Public IP addresses**, select **Create a new public IP address**.

1. Enter **myPublicIP-NAT** in **Name**. Select **OK**.

1. Select **Next: Subnet**.

1. In **Virtual network**, select **myVNet**.

1. In the list of subnets, select the box for **myBackendSubnet**.

1. Select **Review + create**.

1. Select **Create**.

# [**PowerShell**](#tab/dual-stack-outbound-powershell)

# [**CLI**](#tab/dual-stack-outbound--cli)

---

## Add IPv6 to virtual network

The addition of IPv6 to the virtual network must be done after the NAT gateway is associated with **myBackendSubnet**. Use the following example to add and IPv6 address space and subnet to the virtual network you created in the previous steps.

# [**Portal**](#tab/dual-stack-outbound-portal)

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

1. Select **myVNet**.

1. In **Settings**, select **Address space**.

1. In the box that displays **Add additional address range**, enter **2404:f800:8000:122::/63**.

1. Select **Save**.

1. Select **Subnets** in **Settings**.

1. Select **myBackendSubnet** in the list of subnets.

1. Select the box next to **Add IPv6 address space**.

1. Enter **2404:f800:8000:122::/64** in **IPv6 address space**.

1. Select **Save**.

# [**PowerShell**](#tab/dual-stack-outbound-powershell)

# [**CLI**](#tab/dual-stack-outbound--cli)

---

## Create dual-stack virtual machine

The network configuration of the virtual machine has IPv4 and IPv6 configurations. You'll create the virtual machine with an internal IPv4 address. You'll then add the IPv6 configuration to the network interface of the virtual machine.

# [**Portal**](#tab/dual-stack-outbound-portal)



# [**PowerShell**](#tab/dual-stack-outbound-powershell)

# [**CLI**](#tab/dual-stack-outbound--cli)

---


## Create public load balancer

The public load balancer has a front-end IPv6 address and outbound rule for the backend pool of the load balancer. The outbound rule controls the behavior of the external IPv6 connections for virtual machines in the backend pool. Use the following example to create an IPv6 public load balancer.

# [**Portal**](#tab/dual-stack-outbound-portal)

# [**PowerShell**](#tab/dual-stack-outbound-powershell)

# [**CLI**](#tab/dual-stack-outbound--cli)

---

## Validate outbound connectivity

# [**Portal**](#tab/dual-stack-outbound-portal)

# [**PowerShell**](#tab/dual-stack-outbound-powershell)

# [**CLI**](#tab/dual-stack-outbound--cli)

---

## Clean up resources

# [**Portal**](#tab/dual-stack-outbound-portal)

If you're not going to continue to use this application, delete
<resources> with the following steps:

1. From the left-hand menu...
1. ...click Delete, type...and then click Delete

# [**PowerShell**](#tab/dual-stack-outbound-powershell)

# [**CLI**](#tab/dual-stack-outbound--cli)

---

## Next steps

Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Next steps button](contribute-how-to-mvc-tutorial.md)
