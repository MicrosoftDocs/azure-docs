---
title: 'Assign Users IP Addresses from Defined Pools for P2S VPN Connections - PowerShell'
titleSuffix: Azure VPN Gateway
description: Learn how to configure user groups and assign IP addresses from specific address pools based on identity or authentication credentials for VPN Gateway point-to-site (P2S) connections.
author: cherylmc
ms.author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 04/28/2026
---

# Assign IP addresses from defined pools to P2S VPN users - Azure PowerShell

You can assign users connecting to your Point-to-site (P2S) VPN gateway IP addresses from specific address pools based on their identity or authentication credentials by creating Policy Groups (User Groups). This article helps you configure Policy Groups, Group Members, and prioritize groups using Azure PowerShell. For more information about working with Policy Groups and Group Members for P2S connections, including considerations and limitations, see [About User Groups](point-to-site-user-groups-about.md).

## Prerequisites

This article assumes you have a VPN Gateway P2S configuration. If you haven't already set up a P2S VPN gateway, see the following articles:

* Configure a P2S VPN gateway with **certificate authentication**:
  * For **Portal** see, [Configure server settings for P2S VPN Gateway certificate authentication](point-to-site-certificate-gateway.md)
  * For **PowerShell** see, [P2S VPN Gateway certificate authentication - PowerShell](vpn-gateway-howto-point-to-site-rm-ps.md)
* Steps to configure a P2S VPN Gateway with **Microsoft Entra ID authentication** see, [P2S VPN Gateway for Microsoft Entra ID authentication](point-to-site-entra-gateway.md)
* To configure an Azure VPN client, see the [VPN Client Configuration Table](point-to-site-about.md#client).

## Workflow

This article uses the following workflow to help you set up user groups and IP address pools for your P2S VPN Gateway connection.

1. Consider configuration requirements.
2. Choose an authentication mechanism.
3. Create a User Group.
4. Configure gateway settings

## Consider configuration requirements

This section lists configuration requirements and limitations for user groups and IP address pools.

[!INCLUDE [User groups configuration considerations](../../includes/virtual-wan-user-groups-considerations.md)]

* Address pools can't overlap with address pools used in other connection configurations (same or different gateways).
* Address pools also can't overlap with virtual network address spaces, virtual hub address spaces, or on-premises addresses.
* Address pools can't be smaller than /24. For example, you can't assign a range of /25 or /26.

## Choose authentication mechanism

The following sections list available authentication mechanisms that can be used while creating user groups.

### Microsoft Entra groups

To create and manage Microsoft Entra groups, see [Manage Microsoft Entra groups and group membership](../active-directory/fundamentals/how-to-manage-groups.md).

* The Microsoft Entra user group **object ID** (and not the group name) needs to be specified as part of the point-to-site configuration.

  * For this specific case, we'll use:

    * Engineering group as **{ObjectId1}**
    * Finance group as **{ObjectId2}**

    :::image type="content" source="./media/point-to-site-user-groups-create/groups.png" alt-text="Diagram of Microsoft Entra ID groups and Object IDs" lightbox="./media/point-to-site-user-groups-create/groups.png":::

* Microsoft Entra users can be assigned to be part of multiple Active Directory groups, and VPN Gateway considers users to be part of the VPN user/policy. If a user belongs to multiple groups, the group that has the lowest numerical priority is selected in the point-to-site connection.

### RADIUS - NPS vendor-specific attributes

For Network Policy Server (NPS) vendor-specific attributes configuration information, see [RADIUS - configure NPS for vendor-specific attributes](point-to-site-user-groups-radius.md).

### Certificates

To generate self-signed certificates, see [Generate and export certificates for point-to-site using PowerShell](vpn-gateway-certificates-point-to-site.md). To generate a certificate with a specific Common Name, change the **Subject** parameter to the appropriate value (example, xx@domain.com) when running the `New-SelfSignedCertificate` PowerShell command. For example, you can generate certificates with the following **Subject**:

|Digital certificate field|Value|Description  |
|---|---|--|
| **Subject**| CN= cert@marketing.contoso.com| digital certificate for Marketing department|
| **Subject**| CN= cert@sale.contoso.com| digital certificate for Sale department|

The multiple address pool feature with digital certificate authentication applies to a specific user group based on the **Subject** field. The selection criteria don't work with Subject Alternative Name (SAN) certificates.

If you want to specify a SAN in their certificates, it must be the same as the Subject for the multipool feature to function correctly. Discrepancy between the Subject and SAN will result in issues.

## Create user groups

### 1. Declare your variables

```azurepowershell-interactive
$rg           = "TestRG2"
$location     = "EastUS"
$VNetName     = "TestVNet"
$AppSubName   = "AppSubnet"
$GWSubName    = "GatewaySubnet"
$VNetPrefix   = "10.0.0.0/24"
$AppSubPrefix = "10.0.0.0/26"
$GWSubPrefix  = "10.0.0.192/26"
$GWName       = "gw"
$GWIPName     = "gwIP1"
$GWIPconf     = "gwipconf1"
```

### 2. Create the virtual network and VPN gateway

Open your PowerShell console and connect to your account. For more information, see [Using Windows PowerShell with Resource Manager](../azure-resource-manager/management/manage-resources-powershell.md). Use the following sample to help you connect:

```azurepowershell-interactive
Connect-AzAccount
Select-AzSubscription -SubscriptionName <YourSubscriptionName>
```

```azurepowershell-interactive
New-AzResourceGroup -Name $rg -Location $location

$appsub = New-AzVirtualNetworkSubnetConfig -Name $AppSubName -AddressPrefix $AppSubPrefix
$gwsub = New-AzVirtualNetworkSubnetConfig -Name $GWSubName -AddressPrefix $GWSubPrefix

New-AzVirtualNetwork -Name $VNetName -ResourceGroupName $RG -Location $Location -AddressPrefix $VNetPrefix -Subnet $appsub,$gwsub

$gwpip    = New-AzPublicIpAddress -Name $GW2IPName1 -ResourceGroupName $RG -Location $Location -AllocationMethod Static `
               -Sku Standard -Tier Regional -Zone 1, 2, 3
$vnet     = Get-AzVirtualNetwork -Name $VNetName -ResourceGroupName $RG
$subnet   = Get-AzVirtualNetworkSubnetConfig -Name "GatewaySubnet" -VirtualNetwork $vnet
$gwipconf = New-AzVirtualNetworkGatewayIpConfig -Name $GWIPconf1 -Subnet $subnet -PublicIpAddress $gwpip

New-AzVirtualNetworkGateway -Name $GWName -ResourceGroupName $RG -Location $Location `
        -IpConfigurations $gwipconf `
        -GatewayType Vpn `
        -VpnType RouteBased `            
        -VpnGatewayGeneration Generation2 `
        -GatewaySku VpnGw2AZ
```

It can take about 45 minutes or more to create the VPN gateway.

### 3. Verify that you have the correct VPN gateway

```azurepowershell-interactive
$gw = Get-AzVirtualNetworkGateway -Name $GWName -ResourceGroupName $RG
```

### 4. Create user groups

In this scenario, we consider a case of four user groups; two user groups with digital certificates authentication and two user groups with Microsoft Entra ID authentication:

* Two groups of client certificates with Common Names.

  * ```yourServiceName@marketing.contoso.com```
  * ```yourServiceName@sale.contoso.com```

* Two groups created in Microsoft Entra ID (Replace `ObjectId1/ObjectId2` with your Object ID value).

  * Engineering group {ObjectId1}
  * Finance {ObjectId2}

### 5. Add P2S configuration to VPN gateway

The following cmdlet configuration sets up the VPN gateway to use client address pool **VpnClientAddressPool** and authentication options of:

* Certificate-based authentication: **Certificate**
* Microsoft Entra ID: **AAD**

For more information about P2S Microsoft Entra ID authentication values, see [Configure P2S VPN Gateway for Microsoft Entra ID authentication](point-to-site-entra-gateway.md).

Export the public data of your root certificate in .cer format, collect the data and assign the public data of root certificate in the variable $rootCert:

```azurepowershell-interactive
$rootCert = 'MIIC5zCCAc+gAwIBAgIQH0n3xp1vV7FBfqhwRvJOljA...............'
```

> [!NOTE]
> When you collect the public data of the root certificate (.cer file), don't include the header and trailer in the value assigned to the variable $rootCer

Next, set the virtual network gateway. In the following command, replace the following values:

* **{TenantID}** with the corresponding Microsoft Entra Tenant ID (*without curly brackets*).
* **AadAudienceID** with the corresponding value for the Microsoft-registered Azure VPN Client App ID. You can also use [custom audience](point-to-site-entra-register-custom-app.md) in this field.
* **x.x.0.0/24** with the address pool to connect VPN clients not belonging to the multiple address pool configuration.

```azurepowershell-interactive
$gw = Set-AzVirtualNetworkGateway -VirtualNetworkGateway $gw1 `
-VpnAuthenticationType Certificate, AAD -VpnClientAddressPool x.x.0.0/24 `
-VpnClientRootCertificates $rootCert -VpnClientProtocol IkeV2, OpenVPN `
-AadTenantUri 'https://login.microsoftonline.com/{TenantID}' `
-AadIssuerUri 'https://sts.windows.net/{TenantID}/' `
-AadAudienceId 'c632b3df-fb67-4d84-bdcf-b95ad541b5c8'
```

### 6. Create policy group members

Configure four members, one for each group:

* member1 and member2 are based on digital certificate authentication (authentication type: **CertificateGroupID**).

* member3 and member4 are based on Microsoft Entra ID authentication (authentication type:**AADGroupID**)

  * {ObjectId1} and {ObjectId2} are the values representing the two different groups ID in your Microsoft Entra ID tenant.

|Member Name| Authentication Type| Attribute Value     |
|------------|-------------------|---------------------|
|member1     |CertificateGroupId |marketing.contoso.com|
|member2     |CertificateGroupId |sale.contoso.com     |
|member3     |AADGroupID         |{ObjectId1}          |
|member4     |AADGroupID         |{ObjectId2}          |

```azurepowershell-interactive
$member1 = New-AzVirtualNetworkGatewayPolicyGroupMember -Name "member1" `
-AttributeType "CertificateGroupId" -AttributeValue "marketing.contoso.com"

$member2 = New-AzVirtualNetworkGatewayPolicyGroupMember -Name "member2" `
-AttributeType "CertificateGroupId" -AttributeValue "sale.contoso.com"

$member3 = New-AzVirtualNetworkGatewayPolicyGroupMember -Name "member3" `
-AttributeType "AADGroupId" -AttributeValue "{ObjectId1}"

$member4 = New-AzVirtualNetworkGatewayPolicyGroupMember -Name "member4" `
-AttributeType "AADGroupId" -AttributeValue "{ObjectId2}"
```
> [!NOTE]
> We use curly brackets {} to indicate placeholders, for example {ObjectId1}. Replace {ObjectId1} with the actual value, and do not include the curly brackets in the final value.

### 7. Create virtual network gateway policy groups

The configuration creates three gateway policy groups that are responsible for authorizing connections using digital certificates that specify the following in the Common Name (CN) field and Microsoft Entra ID groups that specify the group ObjectIDs:

* policyGroup1: marketing.contoso.com, $member1
* policyGroup2: sale.contoso.com, $member2
* policyGroup3: {ObjectId1}, also known as $member3
* policyGroup4: {ObjectId2}, also known as $member4

Three gateway policy groups are created as described in the table:

|Policy group name|Default policy|Priority|Policy member object |
|-----------------|--------------|--------|---------------------|
|policyGroup1     |true          |0       |member1              |
|policyGroup2     |false         |10      |member2              |
|policyGroup3     |false         |20      |member3              |
|policyGroup4     |false         |30      |member4              |

```azurepowershell-interactive
$policyGroup1 = New-AzVirtualNetworkGatewayPolicyGroup -Name "policyGroup1" `
     -Priority 0 -DefaultPolicyGroup -PolicyMember $member1 

$policyGroup2 = New-AzVirtualNetworkGatewayPolicyGroup -Name "policyGroup2" `
     -Priority 10 -PolicyMember $member2 

$policyGroup3 = New-AzVirtualNetworkGatewayPolicyGroup -Name "policyGroup3" `
    -Priority 20 -PolicyMember $member3 

$policyGroup4 = New-AzVirtualNetworkGatewayPolicyGroup -Name "policyGroup4" `
    -Priority 30 -PolicyMember $member4 
```

### 8. Create VPN Client Connection Configurations

The VPN Configuration defines four distinct address pools, each linked to a specific policyGroup.

|VPN Configuration Name|Address Pool| PolicyGroup|
|---|---|---|
|config1| x.x.1.0/24| policyGroup 1: marketing.contoso.com|
|config2| x.x.2.0/24| PolicyGroup 2: sale.contoso.com
|config3| x.x.3.0/24| PolicyGroup 3: Engineering {ObjectId1}
|config4| x.x.4.0/24| PolicyGroup4: Finance {ObjectId2}

```azurepowershell-interactive
$vngconnectionConfig1 = New-AzVpnClientConnectionConfiguration -Name "config1" `
-VirtualNetworkGatewayPolicyGroup $policyGroup1 `
-VpnClientAddressPool "x.x.1.0/24" 

$vngconnectionConfig2 = New-AzVpnClientConnectionConfiguration -Name "config2" `
-VirtualNetworkGatewayPolicyGroup $policyGroup2 `
-VpnClientAddressPool "x.x.2.0/24" 

$vngconnectionConfig3 = New-AzVpnClientConnectionConfiguration -Name "config3" `
-VirtualNetworkGatewayPolicyGroup $policyGroup3 `
-VpnClientAddressPool "x.x.3.0/24"

$vngconnectionConfig4 = New-AzVpnClientConnectionConfiguration -Name "config4" `
-VirtualNetworkGatewayPolicyGroup $policyGroup4 `
-VpnClientAddressPool "x.x.4.0/24" 

```

### 9. Apply configurations to VPN gateway

```azurepowershell-interactive
$gw = Set-AzVirtualNetworkGateway -VirtualNetworkGateway $gw `
      -VirtualNetworkGatewayPolicyGroup `
$policyGroup1, $policyGroup2, $policyGroup3, $policyGroup4 `
     -ClientConnectionConfiguration $vngconnectionConfig1, $vngconnectionConfig2, `
      $vngconnectionConfig3, $vngconnectionConfig4 
```

At the end of the multiple address pool setting, the configuration can be represented by the following logical structure:

|Policy group name|Default policy|Priority|Policy member |Authentication type| Group configuration value| VPN Client address pool|
|-----------------|--------------|--------|--------------|-------------------|--------------------------| ----------------------|
|policyGroup1     |true          |0       |member1       |CertificateGroupId |marketing.contoso.com     | x.x.1.0/24            |
|policyGroup2     |false         |10      |member2       |CertificateGroupId |sale.contoso.com          | x.x.2.0/24            |
|policyGroup3     |false         |20      |member3       |AADGroupID         |{ObjectId1}               | x.x.3.0/24            |
|policyGroup4     |false         |30      |member4       |AADGroupID         |{ObjectId2}               | x.x.4.0/24            |

## If things go wrong

[!INCLUDE [Troubleshooting policy groups and IP address pools for P2S connections](../networking/includes/vpn-gateway/policy-groups-ts.md)]

## Next step

> [!div class="nextstepaction"]
> [About user groups and IP address pools for point-to-site](point-to-site-user-groups-about.md)
