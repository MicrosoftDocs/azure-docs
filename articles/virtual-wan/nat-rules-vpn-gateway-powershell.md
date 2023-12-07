---
title: 'Configure VPN NAT rules for your gateway using PowerShell'
titleSuffix: Azure Virtual WAN
description: Learn how to configure NAT rules for your VWAN VPN gateway using PowerShell.
services: virtual-wan
author: cherylmc
ms.service: virtual-wan
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 08/24/2023
ms.author: cherylmc
---

# Configure NAT Rules for your Virtual WAN VPN gateway using PowerShell

You can configure your Virtual WAN VPN gateway with static one-to-one NAT rules. A NAT rule provides a mechanism to set up one-to-one translation of IP addresses. NAT can be used to interconnect two IP networks that have incompatible or overlapping IP addresses. A typical scenario is branches with overlapping IPs that want to access Azure VNet resources.

This configuration uses a flow table to route traffic from an external (host) IP Address to an internal IP address associated with an endpoint inside a virtual network (virtual machine, computer, container, etc.). In order to use NAT, VPN devices need to use any-to-any (wildcard) traffic selectors. Policy Based (narrow) traffic selectors aren't supported in conjunction with NAT configuration.

## Prerequisites

* Verify that you have an Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial).
* This tutorial creates a NAT rule on a VPN gateway that will be associated with a VPN site connection. The steps assume that you have an existing Virtual WAN VPN gateway connection to two branches with overlapping address spaces.

### Azure PowerShell

[!INCLUDE [PowerShell](../../includes/vpn-gateway-cloud-shell-powershell-about.md)]

## <a name="signin"></a>Sign in

[!INCLUDE [sign in](../../includes/vpn-gateway-cloud-shell-ps-login.md)]

## <a name="rules"></a>Configure NAT rules

You can configure and view NAT rules on your VPN gateway settings at any time using Azure PowerShell.

   :::image type="content" source="./media/nat-rules-vpn-gateway/edit-rules.png" alt-text="Screenshot showing how to edit rules."lightbox="./media/nat-rules-vpn-gateway/edit-rules.png":::

1. Declare the variables for the existing resources.

   ```azurepowershell-interactive
   $resourceGroup = Get-AzResourceGroup -ResourceGroupName "testRG" 
   $virtualWan = Get-AzVirtualWan -ResourceGroupName "testRG" -Name "myVirtualWAN"
   $virtualHub = Get-AzVirtualHub -ResourceGroupName "testRG" -Name "westushub"
   $vpnGateway = Get-AzVpnGateway -ResourceGroupName "testRG" -Name "testvpngw"
   ```

1. Create the new NAT rule to ensure the site-to-site VPN gateway is able to distinguish between the two branches with overlapping address spaces.

    You can set the parameters for the following values:

   * **Name:** A unique name for your NAT rule.
   * **Type:** Static or Dynamic. Static one-to-one NAT establishes a one-to-one relationship between an internal address and an external address. The subnet size for both internal and external mapping must be the same for static.
   * **Mode:** IngressSnat or EgressSnat.  
      * IngressSnat mode (also known as Ingress Source NAT) is applicable to traffic entering the Azure hub’s site-to-site VPN gateway.
      * EgressSnat mode (also known as Egress Source NAT) is applicable to traffic leaving the Azure hub’s site-to-site VPN gateway.
   * **Internal Mapping:** An address prefix range of source IPs on the inside network that will be mapped to a set of external IPs. In other words, your pre-NAT address prefix range.
   * **External Mapping:** An address prefix range of destination IPs on the outside network that source IPs will be mapped to. In other words, your post-NAT address prefix range.
   * **Link Connection:** Connection resource that virtually connects a VPN site to the Azure Virtual WAN hub's site-to-site VPN gateway.

   **Syntax**

   ```
   New-AzVpnGatewayNatRule 
   -ResourceGroupName <String> 
   -ParentResourceName <String> 
   -Name <String>
   [-Type <String>] 
   [-Mode <String>] 
   -InternalMapping <String[]> 
   -ExternalMapping <String[]>
   [-InternalPortRange <String[]>] 
   [-ExternalPortRange <String[]>] 
   [-IpConfigurationId <String>] 
   [-AsJob]
   [-DefaultProfile <IAzureContextContainer>] 
   [-WhatIf] 
   [-Confirm] [<CommonParameters>]
   ```

   ```azurepowershell-interactive
   $natrule = New-AzVpnGatewayNatRule -ResourceGroupName "testRG" -ParentResourceName "testvpngw" -Name "testNatRule" -InternalMapping "10.0.0.0/24" -ExternalMapping "1.2.3.4/32" -IpConfigurationId "Instance0" -Type Dynamic -Mode EgressSnat 
   ```

1. Declare the variable to create a new object for the new NAT rule.

   ```azurepowershell-interactive
   $newruleobject = New-Object Microsoft.Azure.Commands.Network.Models.PSResourceId
   $newruleobject.Id = $natrule.Id
   ```

1. Declare the variable to get the existing VPN connection.

   ```azurepowershell-interactive
   $conn = Get-AzVpnConnection -Name "Connection-VPNsite1" -ResourceGroupName "testRG" -ParentResourceName "testvpngw"
   ```

1. Set the appropriate index for the NAT rule in the VPN connection.

   ```azurepowershell-interactive
   $conn.VpnLinkConnections
   $conn.VpnLinkConnections[0].EgressNatRules = $newruleobject
   ```

1. Update the existing VPN connection with the new NAT rule.

   ```azurepowershell-interactive
   Update-AzVpnConnection -Name "Connection-VPNsite1" -ResourceGroupName "testRG" -ParentResourceName "testvpngw" -VpnSiteLinkConnection $conn.VpnLinkConnections
   ```

## Next steps

For more information about site-to-site configurations, see [Configure a Virtual WAN site-to-site connection](virtual-wan-site-to-site-portal.md).
