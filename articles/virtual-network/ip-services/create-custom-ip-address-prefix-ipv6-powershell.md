---
title: Create a custom IPv6 address prefix - Azure PowerShell
titleSuffix: Azure Virtual Network
description: Learn how to create a custom IPv6 address prefix using Azure PowerShell
author: mbender-ms
ms.author: mbender
ms.service: virtual-network
ms.subservice: ip-services
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 08/24/2023
---

# Create a custom IPv6 address prefix using Azure PowerShell

A custom IPv6 address prefix enables you to bring your own IPv6 ranges to Microsoft and associate it to your Azure subscription. You maintain ownership of the range while Microsoft would be permitted to advertise it to the Internet. A custom IP address prefix functions as a regional resource that represents a contiguous block of customer owned IP addresses.

The steps in this article detail the process to:

* Prepare a range to provision

* Provision the range for IP allocation

* Enable the range to be advertised by Microsoft

## Differences between using BYOIPv4 and BYOIPv6

> [!IMPORTANT]
> Onboarded custom IPv6 address prefixes have several unique attributes which make them different than custom IPv4 address prefixes.

* Custom IPv6 prefixes use a *parent*/*child* model. In this model, the Microsoft Wide Area Network (WAN) advertises the global (parent) range, and the respective Azure regions advertise the regional (child) ranges.  Global ranges must be /48 in size, while regional ranges must always be /64 size.  You can have multiple /64 ranges per region.

* Only the global range needs to be validated using the steps detailed in the [Create Custom IP Address Prefix](create-custom-ip-address-prefix-portal.md) articles.  The regional ranges are derived from the global range in a similar manner to the way public IP prefixes are derived from custom IP prefixes.

* Public IPv6 prefixes must be derived from the regional ranges.  Only the first 2048 IPv6 addresses of each regional /64 custom IP prefix can be utilized as valid IPv6 space.  Attempting to create public IPv6 prefixes beyond this space results in an error.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure PowerShell installed locally or Azure Cloud Shell.
- Sign in to Azure PowerShell and ensure you've selected the subscription with which you want to use this feature.  For more information, see [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps).
- Ensure your Az.Network module is 5.1.1 or later. To verify the installed module, use the command `Get-InstalledModule -Name "Az.Network"`. If the module requires an update, use the command `Update-Module -Name "Az.Network"` if necessary.
- A customer owned IPv6 range to provision in Azure. A sample customer range (2a05:f500:2::/48) is used for this example, but wouldn't be validated by Azure; you need to replace the example range with yours.

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

> [!NOTE]
> For problems encountered during the provisioning process, please see [Troubleshooting for custom IP prefix](manage-custom-ip-address-prefix.md#troubleshooting-and-faqs).

## Pre-provisioning steps

To utilize the Azure BYOIP feature, you must perform and number of steps prior to the provisioning of your IPv6 address range.  Refer to the [IPv4 instructions](create-custom-ip-address-prefix-powershell.md#pre-provisioning-steps) for details.  Note all these steps should be completed for the IPv6 global (parent) range.

## Provisioning for IPv6

The following steps display the modified steps for provisioning a sample global (parent) IPv6 range (2a05:f500:2::/48) and regional (child) IPv6 ranges.  Some of the steps have been abbreviated or condensed from the [IPv4 instructions](create-custom-ip-address-prefix-powershell.md) to focus on the differences between IPv4 and IPv6.

### Create a resource group and specify the prefix and authorization messages

Create a resource group in the desired location for provisioning the global range resource.

> [!IMPORTANT]
> Although the resource for the global range will be associated with a region, the prefix will be advertised by the Microsoft WAN globally.

```azurepowershell-interactive
$rg =@{
    Name = 'myResourceGroup'
    Location = 'WestUS2'
}
New-AzResourceGroup @rg
```

### Provision a global custom IPv6 address prefix

The following command creates a custom IP prefix in the specified region and resource group. Specify the exact prefix in CIDR notation as a string to ensure there's no syntax error. (The `-AuthorizationMessage` and `-SignedMessage` parameters are constructed in the same manner as they are for IPv4; for more information, see [Create a custom IP prefix - PowerShell](create-custom-ip-address-prefix-powershell.md).)  No zonal properties are provided because the global range isn't associated with any particular region (and therefore no regional availability zones).

```azurepowershell-interactive
$prefix =@{
    Name = 'myCustomIPv6GlobalPrefix'
    ResourceGroupName = 'myResourceGroup'
    Location = 'WestUS'
    CIDR = '2a05:f500:2::/48'
    AuthorizationMessage = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|2a05:f500:2::/48|yyyymmdd'
    SignedMessage = $byoipauthsigned
}
$myCustomIPv6GlobalPrefix = New-AzCustomIPPrefix @prefix
```

### Provision a regional custom IPv6 address prefix

After the global custom IP prefix is in a **Provisioned** state, regional custom IP prefixes can be created.  These ranges must always be of size /64 to be considered valid.  The ranges can be created in any region (it doesn't need to be the same as the global custom IP prefix), keeping in mind any geolocation restrictions associated with the original global range.  The "children" custom IP prefixes will be advertised locally from the region they're created in.  Because the validation is only done for global custom IP prefix provision, no Authorization or Signed message is required.  (Because these ranges will be advertised from a specific region, zones can be utilized.)

```azurepowershell-interactive
$prefix =@{
    Name = 'myCustomIPv6RegionalPrefix'
    ResourceGroupName = 'myResourceGroup'
    Location = 'EastUS2'
    CIDR = '2a05:f500:2:1::/64'
}
$myCustomIPv6RegionalPrefix = New-AzCustomIPPrefix @prefix -Zone 1,2,3
```

Similar to IPv4 custom IP prefixes, after the regional custom IP prefix is in a **Provisioned** state, public IP prefixes can be derived from the regional custom IP prefix.  These public IP prefixes and any public IP addresses derived from them can be attached to networking resources, though they aren't yet being advertised.

> [!IMPORTANT]
> Public IPv6 prefixes derived from regional custom IPv6 prefixes can only utilize the first 2048 IPs of the /64 range.

### Commission the custom IPv6 address prefixes

When commissioning custom IPv6 prefixes, the global and regional prefixes are treated separately.  In other words, commissioning a regional custom IPv6 prefix isn't connected to commissioning the global custom IPv6 prefix.

:::image type="content" source="./media/create-custom-ip-address-prefix-ipv6/any-region-prefix.png" alt-text="Diagram of custom IPv6 prefix showing parent prefix and child prefixes across multiple regions.":::

The safest strategy for range migrations is as follows:
1. Provision all required regional custom IPv6 prefixes in their respective regions.  Create public IPv6 prefixes and public IP addresses and attach to resources.
2. Commission each regional custom IPv6 prefix and test connectivity to the IPs within the region.  Repeat for each regional custom IPv6 prefix.
3. After all regional custom IPv6 prefixes (and derived prefixes/IPs) have been verified to work as expected, commission the global custom IPv6 prefix, which will advertise the larger range to the Internet.

Using the example ranges above, the command sequence would be:

```azurepowershell-interactive
Update-AzCustomIpPrefix -ResourceId $myCustomIPv6RegionalPrefix.Id -Commission
``` 
Followed by:

```azurepowershell-interactive
Update-AzCustomIpPrefix -ResourceId $myCustomIPv6GlobalPrefix.Id -Commission
```
> [!NOTE]
> The estimated time to fully complete the commissioning process for a custom IPv6 global prefix is 3-4 hours.  The estimated time to fully complete the commissioning process for a custom IPv6 regional prefix is 30 minutes.

It's possible to commission the global custom IPv6 prefix prior to the regional custom IPv6 prefixes. Doing this advertises the global range to the Internet before the regional prefixes are ready so it's not recommended for migrations of active ranges.  You can decommission a global custom IPv6 prefix while there are still active (commissioned) regional custom IPv6 prefixes. Also, you can decommission a regional custom IP prefix while the global prefix is still active (commissioned).

> [!IMPORTANT]
> As the global custom IPv6 prefix transitions to a **Commissioned** state, the range is being advertised with Microsoft from the local Azure region and globally to the Internet by Microsoft's wide area network under Autonomous System Number (ASN) 8075. Advertising this same range to the Internet from a location other than Microsoft at the same time could potentially create BGP routing instability or traffic loss. For example, a customer on-premises building. Plan any migration of an active range during a maintenance period to avoid impact.

## Next steps

- To learn about scenarios and benefits of using a custom IP prefix, see [Custom IP address prefix (BYOIP)](custom-ip-address-prefix.md).

- For more information on managing a custom IP prefix, see [Manage a custom IP address prefix (BYOIP)](manage-custom-ip-address-prefix.md).
