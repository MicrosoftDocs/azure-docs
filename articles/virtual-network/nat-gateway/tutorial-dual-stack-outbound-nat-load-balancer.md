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
> * Create a NAT gateway with an IPv4 public address
> * Create a dual-stack virtual network
> * Create a public load balancer with an IPv6 public address
> * Create a dual-stack virtual machine
> * Validate outbound connectivity from your dual stack virtual machine

## Prerequisites

- An Azure account with an active subscription. [Create an account for free]
(https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

# [**PowerShell**](#tab/dual-stack-outbound-powershell)

- Azure PowerShell installed locally or Azure Cloud Shell

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

# [**CLI**](#tab/dual-stack-outbound--cli)

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- This tutorial requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

---

## Create NAT gateway

# [**Portal**](#tab/dual-stack-outbound-portal)

1. Sign-in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

# [**PowerShell**](#tab/dual-stack-outbound-powershell)

# [**CLI**](#tab/dual-stack-outbound--cli)

---

## Create dual-stack virtual network

# [**Portal**](#tab/dual-stack-outbound-portal)

# [**PowerShell**](#tab/dual-stack-outbound-powershell)

# [**CLI**](#tab/dual-stack-outbound--cli)

---

## Create public load balancer

# [**Portal**](#tab/dual-stack-outbound-portal)

# [**PowerShell**](#tab/dual-stack-outbound-powershell)

# [**CLI**](#tab/dual-stack-outbound--cli)

---

## Create dual-stack virtual machine

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
