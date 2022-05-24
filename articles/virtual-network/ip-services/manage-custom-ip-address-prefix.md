---
title: Manage a custom IP address prefix
titleSuffix: Azure Virtual Network
description: Learn about custom IP address prefixes and how to manage and delete them.
services: virtual-network
author: asudbring
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: conceptual
ms.date: 03/31/2022
ms.author: allensu
---
# Manage a custom IP address prefix

A custom IP address prefix is a contiguous range of IP addresses owned by an external customer and provisioned into a subscription. The range is owned by the customer and Microsoft is permitted to advertise the range. For more information, see [Custom IP address prefix overview](custom-ip-address-prefix.md). 

This article explains how to:

* Create public IP prefixes from provisioned custom IP prefixes

* Migrate active IP prefixes from outside Microsoft

* View information about a custom IP prefix

* Decommission a custom IP prefix

* Deprovision/delete a custom IP prefix

For information on provisioning an IP address, see [Create a custom IP address prefix - Azure portal](create-custom-ip-address-prefix-portal.md), [Create a custom IP address prefix - Azure PowerShell](create-custom-ip-address-prefix-powershell.md), or [Create a custom IP address prefix - Azure CLI](create-custom-ip-address-prefix-cli.md).

## Create a public IP prefix from a custom IP prefix

When a custom IP prefix is in **Provisioned**, **Commissioning**, or **Commissioned** state, a linked public IP prefix can be created. Either as a subset of the custom IP prefix range or the entire range.

Use the following CLI and PowerShell commands to create public IP prefixes with the `--custom-ip-prefix-name` (CLI) and `-CustomIpPrefix` (PowerShell) parameters that point to an existing custom IP prefix.

|Tool|Command|
|---|---|
|CLI|[az network public-ip prefix create](/cli/azure/network/public-ip/prefix#az_network_public_ip_prefix_create)|
|PowerShell|[New-AzPublicIpPrefix](/powershell/module/az.network/new-azpublicipprefix)|

> [!NOTE]
> A public IP prefix can be derived from a custom IP prefix in another subscription with the appropriate permissions using Azure PowerShell or Azure portal.

:::image type="content" source="./media/manage-custom-ip-address-prefix/custom-public-ip-prefix.png" alt-text="Diagram of custom IP prefix showing derived public IP prefixes across multiple subscriptions.":::

An example derivation of a public IP prefix from a custom IP prefix using PowerShell is shown below:

 ```azurepowershell-interactive
Set-AzContext -Subscription xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
$customprefix = Get-AzCustomIpPrefix -Name myBYOIPPrefix -ResourceGroupName myResourceGroup
Set-AzContext -Subscription yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy
New-AzPublicIpPrefix -Name myPublicIpPrefix -ResourceGroupName myResourceGroup2 -Location eastus -PrefixLength 30 -CustomIpPrefix $customprefix
```

Once created, the IPs in the child public IP prefix can be associated with resources like any other standard SKU static public IPs.  To learn more about using IPs from a public IP prefix, including selection of a specific IP from the range, see [Create a static public IP address from a prefix](manage-public-ip-address-prefix.md#create-a-static-public-ip-address-from-a-prefix).

## Migration of active prefixes from outside Microsoft

If the provisioned range is being advertised to the Internet by another network, it's important to plan the migration to Azure to avoid unplanned downtime. Regardless of the method used, make the transition during a maintenance window. 

**Method 1: Create public IP prefixes and public IP addresses from the prefixes when the custom IP prefix is in a "Provisioned" state**.
    
* The public IPs can be associated to networking resources but won't be advertised and won't be reachable. When the command to update the custom IP prefix to the **Commissioned** state is executed, the IPs will advertise from Microsoft's network. Any advertisement of this same range from a location other than Microsoft could potentially create BGP routing instability or traffic loss. For example, a customer on-premises building. The advertisement should be disabled once the Azure infrastructure has been verified as operational.

**Method 2: Create public IP prefixes and public IP addresses from the prefixes using Microsoft ranges. Deploy an infrastructure in your subscription and verify it's operational**.  

* Create a second set of mirrored public IP prefixes and public IP addresses from the prefixes when the custom IP prefix is in a **Provisioned** state. Add the provisioned IPs to the existing infrastructure. For example, add another network interface to a virtual machine or another frontend for a load balancer. Perform a change to the desired IPs before issuing the command to move the custom IP prefix to the **Commissioned** state.

* Alternatively, the ranges can be commissioned first and then changed. This process won't work for all resource types with public IPs. In those cases, a new resource with the provisioned public IP must be created.

## View a custom IP prefix

To view a custom IP prefix, the following commands can be used in Azure CLI and Azure PowerShell. All public IP prefixes created under the custom IP prefix will be displayed.

**Commands**

|Tool|Command|
|---|---|
|CLI|[az network custom-ip prefix list](/cli/azure/network/public-ip/prefix#az_network_custom_ip_prefix_list) to list custom IP prefixes<br>[az network custom-ip prefix show](/cli/azure/network/public-ip/prefix#az_network_custom_ip_prefix_show) to show settings and any derived public IP prefixes<br>
|PowerShell|[Get-AzCustomIpPrefix](/powershell/module/az.network/get-azcustomipprefix) to retrieve a custom IP prefix object and view its settings and any derived public IP prefixes|

## Decommission a custom IP prefix

A custom IP prefix must be decommissioned to turn off advertisements.

> [!NOTE]
> All public IP prefixes created from an provisioned custom IP prefix must be deleted before a custom IP prefix can be decommissioned.
> 
> The estimated time to fully complete the decommissioning process is 3-4 hours.

The following commands can be used in Azure CLI and Azure PowerShell to begin the process to stop advertising the range from Azure. The operation is asynchronous, use view commands to retrieve the status. The **CommissionedState** field will initially show the prefix as **Decommissioning**, followed by **Provisioned** as it transitions to the earlier state. Advertisement removal is a gradual process, and the range will be partially advertised while still in **Decommissioning**.

**Commands**

|Tool|Command|
|---|---|
|Azure portal|Use the **Decommission** option in the Overview section of a Custom IP Prefix |
|CLI|[az network custom-ip prefix update](/cli/azure/network/public-ip/prefix#az-network-custom-ip-prefix-update) with the flag to `-Decommission` |
|PowerShell|[Update-AzCustomIpPrefix](/powershell/module/az.network/update-azcustomipprefix) with the `--state` flag set to decommission |

Alternatively, a custom IP prefix can be decommissioned via the Azure portal using the **Decommission** button in the **Overview** section of the custom IP prefix.

## Deprovision/Delete a custom IP prefix

To fully remove a custom IP prefix, it must be deprovisioned and then deleted. 

> [!NOTE]
> If there is a requirement to migrate an provisioned range from one region to the other, the original custom IP prefix must be fully removed from the fist region before a new custom IP prefix with the same address range can be created in another region.
>
> The estimated time to complete the deprovisioning process can range from 30 minutes to 13 hours.

The following commands can be used in Azure CLI and Azure PowerShell to deprovision and remove the range from Microsoft. The deprovisioning operation is asynchronous. You can use the view commands to retrieve the status. The **CommissionedState** field will initially show the prefix as **Deprovisioning**, followed by **Deprovisioned** as it transitions to the earlier state. When the range is in the **Deprovisioned** state, it can be deleted by using the commands to remove.

**Commands**

|Tool|Command|
|---|---|
|Azure portal|Use the **Deprovision** option in the Overview section of a Custom IP Prefix |
|CLI|[az network custom-ip prefix update](/cli/azure/network/public-ip/prefix#az-network-custom-ip-prefix-update) with the flag to `-Deprovision` <br>[az network custom-ip prefix delete](/cli/azure/network/public-ip/prefix#az-network-custom-ip-prefix-delete) to remove|
|PowerShell|[Update-AzCustomIpPrefix](/powershell/module/az.network/update-azcustomipprefix) with the `--state` flag set to deprovision<br>[Remove-AzCustomIpPrefix](/powershell/module/az.network/update-azcustomipprefix) to remove|

Alternatively, a custom IP prefix can be decommissioned via the Azure portal using the **Deprovision** button in the **Overview** section of the custom IP prefix, and then deleted using the **Delete** button in the same section.

## Permissions

For permissions to manage public IP address prefixes, your account must be assigned to the [network contributor](../../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) role or to a [custom](../../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) role. 

| Action                                                            | Name                                                           |
| ---------                                                         | -------------                                                  |
| Microsoft.Network/customIPPrefixes/read                           | Read a custom IP address prefix                                |
| Microsoft.Network/customIPPrefixes/write                          | Create or update a custom IP address prefix                    |
| Microsoft.Network/customIPPrefixes/delete                         | Delete a custom IP address prefix                              |
| Microsoft.Network/customIPPrefixes/join/action                    | Create a public IP prefix from a custom IP address prefix      |

## Troubleshooting and FAQs

This section provides answers for common questions about custom IP prefix resources and the provisioning and removal processes.

### A "ValidationFailed" error is returned after a new custom IP prefix creation

A quick failure of provisioning is likely due to a prefix validation error. A prefix validation error indicates we're unable to verify your ownership of the range. A validation error can also indicate that we can't verify Microsoft permission to advertise the range, and or the association of the range with the given subscription. To view the specific error, you can use the **JSON view** of a custom IP prefix resource in the **Overview** section to see the **failedReason** field. The JSON view displays the Route Origin Authorization, the signed message on the prefix records, and other details of the submission. You should delete the custom IP prefix resource and create a new one with the correct information.

### After updating a custom IP prefix to advertise, it transitions to a "CommissioningFailed" status

If a custom IP prefix is unable to be fully advertised, it moves to a **CommissioningFailed** status. In these instances, it's recommended to execute the command to update the range to commissioned status again.

### I’m unable to decommission a custom IP prefix

Before you decommission a custom IP prefix, ensure it has no public IP prefixes or public IP addresses.

### How can I migrate a range from one region to another

To migrate a custom IP prefix, it must first be deprovisioned from one region. A new custom IP prefix with the same CIDR can then be created in another region.

## Next steps

- To learn about scenarios and benefits of using a custom IP prefix, see [Custom IP address prefix (BYOIP)](custom-ip-address-prefix.md).

- To create a custom IP address prefix using the Azure portal, see [Create custom IP address prefix using the Azure portal](create-custom-ip-address-prefix-portal.md).

- To create a custom IP address prefix using PowerShell, see [Create a custom IP address prefix using Azure PowerShell](create-custom-ip-address-prefix-powershell.md).
