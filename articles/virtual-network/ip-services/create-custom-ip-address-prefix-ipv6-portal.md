---
title: Create a custom IPv6 address prefix - Azure portal
titleSuffix: Azure Virtual Network
description: Learn how to onboard a custom IPv6 address prefix using the Azure portal
author: mbender-ms
ms.author: mbender
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.date: 08/24/2023
---

# Create a custom IPv6 address prefix using the Azure portal

A custom IPv6 address prefix enables you to bring your own IPv6 ranges to Microsoft and associate it to your Azure subscription. The range would continue to be owned by you, though Microsoft would be permitted to advertise it to the Internet. A custom IP address prefix functions as a regional resource that represents a contiguous block of customer owned IP addresses. 

The steps in this article detail the process to:

* Prepare a range to provision

* Provision the range for IP allocation

* Enable the range to be advertised by Microsoft

## Differences between using BYOIPv4 and BYOIPv6

> [!IMPORTANT]
> Onboarded custom IPv6 address prefixes have several unique attributes which make them different than custom IPv4 address prefixes.

* Custom IPv6 prefixes use a *parent*/*child* model. In this model, the Microsoft Wide Area Network (WAN) advertises the global (parent) range, and the respective Azure regions advertise the regional (child) ranges.  Global ranges must be /48 in size, while regional ranges must always be /64 size.  You can have multiple /64 ranges per region.

* Only the global range needs to be validated using the steps detailed in the [Create Custom IP Address Prefix](create-custom-ip-address-prefix-portal.md) articles.  The regional ranges are derived from the global range in a similar manner to the way public IP prefixes are derived from custom IP prefixes.

* Public IPv6 prefixes must be derived from the regional ranges.  Only the first 2048 IPv6 addresses of each regional /64 custom IP prefix can be utilized as valid IPv6 space.  Attempting to create public IPv6 prefixes that span beyond this will result in an error.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A customer owned IPv6 range to provision in Azure. A sample customer range (2a05:f500:2::/48) is used for this example, but wouldn't be validated by Azure; you need to replace the example range with yours.

> [!NOTE]
> For problems encountered during the provisioning process, please see [Troubleshooting for custom IP prefix](manage-custom-ip-address-prefix.md#troubleshooting-and-faqs).

## Pre-provisioning steps

To utilize the Azure BYOIP feature, you must perform and number of steps prior to the provisioning of your IPv6 address range.  Refer to the [IPv4 instructions](create-custom-ip-address-prefix-portal.md#pre-provisioning-steps) for details.  All these steps should be completed for the IPv6 global (parent) range.

## Provisioning for IPv6

The following steps display the modified steps for provisioning a sample global (parent) IPv6 range (2a05:f500:2::/48) and regional (child) IPv6 ranges.  Some of the steps have been abbreviated or condensed from the [IPv4 instructions](create-custom-ip-address-prefix-portal.md) to focus on the differences between IPv4 and IPv6.

> [!NOTE]
> Clean up or delete steps aren't shown on this page given the nature of the resource. For information on removing a provisioned custom IP prefix, see [Manage custom IP prefix](manage-custom-ip-address-prefix.md).

### Provision a global custom IPv6 address prefix

The following flow creates a custom IP prefix in the specified region and resource group.  No zonal properties are provided because the global range isn't associated with any particular region (and therefore no regional availability zones).

### Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

### Create and provision a custom IP address prefix

1. In the search box at the top of the portal, enter **Custom IP**.

2. In the search results, select **Custom IP Prefixes**.

3. Select **+ Create**.

4. In **Create a custom IP prefix**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription |
    | Resource group | Select **Create new**. </br> Enter **myResourceGroup**. </br> Select **OK**. |
    | **Instance details** |   |
    | Name | Enter **myCustomIPv6GlobalPrefix**. |
    | Region | Select **West US 2**. |
    | IP Version | Select IPv6. |
    | IP prefix range | Select Global. |
    | Global IPv6 Prefix (CIDR) | Enter **2a05:f500:2::/48**. |
    | ROA expiration date | Enter your ROA expiration date in the **yyyymmdd** format. |
    | Signed message | Paste in the output of **$byoipauthsigned** from the pre-provisioning section. |
    | Availability Zones | Select **Zone-redundant**. |

    :::image type="content" source="./media/create-custom-ip-address-prefix-ipv6/create-custom-ipv6-prefix.png" alt-text="Screenshot of create custom IP prefix page in Azure portal.":::

5. Select the **Review + create** tab or the blue **Review + create** button at the bottom of the page.

6. Select **Create**.

The range is pushed to the Azure IP Deployment Pipeline. The deployment process is asynchronous. You can check the status by reviewing the **Commissioned state** field for the custom IP prefix.

### Provision a regional custom IPv6 address prefix

After the global custom IP prefix is in a **Provisioned** state, regional custom IP prefixes can be created.  These ranges must always be of size /64 to be considered valid.  The ranges can be created in any region (it doesn't need to be the same as the global custom IP prefix), keeping in mind any geolocation restrictions associated with the original global range.  The "children" custom IP prefixes will be advertised locally from the region they're created in.  Because the validation is only done for global custom IP prefix provision, no Authorization or Signed message is required.  (Because these ranges will be advertised from a specific region, zones can be utilized.)

In the same **Create a custom IP prefix** page as before, enter or select the following information:

| Setting | Value |
| ------- | ----- |
| **Project details** |   |
| Subscription | Select your subscription |
| Resource group | Select **Create new**. </br> Enter **myResourceGroup**. </br> Select **OK**. |
| **Instance details** |   |
| Name | Enter **myCustomIPv6RegionalPrefix**. |
| Region | Select **West US 2**. |
| IP Version | Select IPv6. | 
| IP prefix range | Select Regional. |
| Custom IP prefix parent | Select myCustomIPv6GlobalPrefix (2a05:f500:2::/48) from the drop down menu. |
| Regional IPv6 Prefix (CIDR) | Enter **2a05:f500:2:1::/64**. |
| ROA expiration date | Enter your ROA expiration date in the **yyyymmdd** format. |
| Signed message | Paste in the output of **$byoipauthsigned** from the pre-provisioning section. |
| Availability Zones | Select **Zone-redundant**. |

Similar to IPv4 custom IP prefixes, after the regional custom IP prefix is in a **Provisioned** state, public IP prefixes can be derived from the regional custom IP prefix.  These public IP prefixes and any public IP addresses derived from them can be attached to networking resources, though they aren't yet being advertised.

> [!IMPORTANT]
> Public IPv6 prefixes derived from regional custom IPv6 prefixes can only utilize the first 2048 IPs of the /64 range.

### Commission the custom IPv6 address prefixes

When you commission custom IPv6 prefixes, the global and regional prefixes are treated separately.  In other words, commissioning a regional custom IPv6 prefix isn't connected to commissioning the global custom IPv6 prefix.

:::image type="content" source="./media/create-custom-ip-address-prefix-ipv6/any-region-prefix.png" alt-text="Diagram of custom IPv6 prefix showing parent prefix and child prefixes across multiple regions.":::

The safest strategy for range migrations is as follows:
1. Provision all required regional custom IPv6 prefixes in their respective regions.  Create public IPv6 prefixes and public IP addresses and attach to resources.
2. Commission each regional custom IPv6 prefix and test connectivity to the IPs within the region.  Repeat for each regional custom IPv6 prefix.
3. After all regional custom IPv6 prefixes (and derived prefixes/IPs) have been verified to work as expected, commission the global custom IPv6 prefix, which will advertise the larger range to the Internet.

To commission a custom IPv6 prefix (regional or global) using the portal:

1. In the search box at the top of the portal, enter **Custom IP** and select **Custom IP Prefixes**.

2. Verify the custom IPv6 prefix is in a **Provisioned** state.

3. In **Custom IP Prefixes**, select the desired custom IPv6 prefix.

4. In **Overview** page of the custom IPv6 prefix, select the **Commission** button near the top of the screen.  If the range is global, it begins advertising from the Microsoft WAN.  If the range is regional, it advertises only from the specific region.

Using the example ranges above, the sequence would be to first commission myCustomIPv6RegionalPrefix, followed by a commission of myCustomIPv6GlobalPrefix.

> [!NOTE]
> The estimated time to fully complete the commissioning process for a custom IPv6 global prefix is 3-4 hours.  The estimated time to fully complete the commissioning process for a custom IPv6 regional prefix is 30 minutes.

It's possible to commission the global custom IPv6 prefix prior to the regional custom IPv6 prefixes. Doing this advertises the global range to the Internet before the regional prefixes are ready so it's not recommended for migrations of active ranges.  You can decommission a global custom IPv6 prefix while there are still active (commissioned) regional custom IPv6 prefixes. Also, you can decommission a regional custom IP prefix while the global prefix is still active (commissioned).

> [!IMPORTANT]
> As the global custom IPv6 prefix transitions to a **Commissioned** state, the range is being advertised with Microsoft from the local Azure region and globally to the Internet by Microsoft's wide area network under Autonomous System Number (ASN) 8075. Advertising this same range to the Internet from a location other than Microsoft at the same time could potentially create BGP routing instability or traffic loss. For example, a customer on-premises building. Plan any migration of an active range during a maintenance period to avoid impact.

## Next steps

- To learn about scenarios and benefits of using a custom IP prefix, see [Custom IP address prefix (BYOIP)](custom-ip-address-prefix.md).

- For more information on managing a custom IP prefix, see [Manage a custom IP address prefix (BYOIP)](manage-custom-ip-address-prefix.md).

- To create a custom IP address prefix using the Azure CLI, see [Create custom IP address prefix using the Azure CLI](create-custom-ip-address-prefix-cli.md).

- To create a custom IP address prefix using PowerShell, see [Create a custom IP address prefix using Azure PowerShell](create-custom-ip-address-prefix-powershell.md).
