---
title: IP Groups in Azure Firewall Policy
description: IP groups allow you to group and manage IP addresses for Azure Firewall policy rules.
services: firewall-manager
author: duau
ms.service: azure-firewall-manager
ms.custom: devx-track-azurepowershell
ms.topic: concept-article
ms.date: 12/03/2024
ms.author: duau
---

# IP Groups in Azure Firewall policy

IP Groups allow you to group and manage IP addresses for Azure Firewall policy in the following ways:

- As a source type in DNAT rules
- As a source or destination type in network rules
- As a source type in application rules


An IP Group can have a single IP address, multiple IP addresses, or one or more IP address ranges.

IP Groups can be reused in Azure Firewall DNAT, network, and application rules for multiple firewalls across regions and subscriptions in Azure. Group names must be unique. You can configure an IP Group in the Azure portal, Azure CLI, or REST API. A sample template is provided to help you get started.

## Sample format

The following IPv4 address format examples are valid to use in IP Groups:

- Single address: 10.0.0.0
- CIDR notation: 10.1.0.0/32
- Address range: 10.2.0.0-10.2.0.31

## Create an IP Group

An IP Group can be created using the Azure portal, Azure CLI, or REST API. For more information, see [Create an IP Group](../firewall/create-ip-group.md).

## Browse IP Groups
1. In the Azure portal search bar, type **IP Groups** and select it. You can see the list of the IP Groups, or you can select **Add** to create a new IP Group.
2. Select an IP Group to open the overview page. You can edit, add, or delete IP addresses or IP Groups.

## Manage an IP Group

You can see all the IP addresses in the IP Group and the rules or resources that are associated with it. To delete an IP Group, you must first dissociate the IP Group from the resource that is using it.

1. To view or edit the IP addresses, select **IP Addresses** under **Settings** on the left pane.
2. To add a single or multiple IP address(es), select **Add IP Addresses**. This opens the **Drag or Browse** page for an upload, or you can enter the address manually.
3.    Selecting the ellipses (**…**) to the right to edit or delete IP addresses. To edit or delete multiple IP addresses, select the boxes and select **Edit** or **Delete** at the top.
4. Finally, can export the file in the CSV file format.

> [!NOTE]
> If you delete all the IP addresses in an IP Group while it is still in use in a rule, that rule is skipped.


## Use an IP Group

You can now select **IP Group** as a **Source type** or **Destination type** for the IP address(es) when you create a policy with DNAT, application, or network rules.

## IP address limits

For IP Group limits, see [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-firewall-limits)

## Related Azure PowerShell cmdlets

The following Azure PowerShell cmdlets can be used to create and manage IP Groups:

- [New-AzIpGroup](/powershell/module/az.network/new-azipgroup)
- [Remove-AzIPGroup](/powershell/module/az.network/remove-azipgroup)
- [Get-AzIpGroup](/powershell/module/az.network/get-azipgroup)
- [Set-AzIpGroup](/powershell/module/az.network/set-azipgroup)
- [New-AzFirewallPolicyNetworkRule](/powershell/module/az.network/new-azfirewallpolicynetworkrule)
- [New-AzFirewallPolicyApplicationRule](/powershell/module/az.network/new-azfirewallpolicyapplicationrule)
- [New-AzFirewallPolicyNatRule](/powershell/module/az.network/new-azfirewallpolicynatrule)

## Next steps

- [Tutorial: Secure your virtual WAN using Azure Firewall Manager](secure-cloud-network.md)
