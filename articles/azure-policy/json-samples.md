---
title: Policy template samples | Microsoft Docs
description: JSON samples for Azure Policy
services: azure-policy
documentationcenter:
author: bandersmsft
manager: carmonm
editor:
tags:

ms.assetid:
ms.service: azure-policy
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm:
ms.workload:
ms.date: 11/13/2017
ms.author: banders
ms.custom: mvc

---
# Templates for Azure Policy

The following table includes links to json templates for Azure Policy. These samples are found in the [Azure Policy samples repository](https://github.com/Azure/azure-policy).

| | |
|---|---|
|**Compute**||
| [Approved VM images](scripts/allowed-custom-images.md) | Requires that only approved custom images are deployed in your environment. You specify an array of approved image IDs. |
| [Audit when VM does not use Managed Disk](scripts/create-vm-managed-disk.md) | Audits when a virtual machine is created that does not use managed disks.|
| [Audit if extension does not exist](scripts/audit-ext-not-exist.md) | Audits if an extension is not deployed with a virtual machine. You specify the extension publisher and type to check whether it was deployed. |
| [Allow custom VM image from a Resource Group](scripts/allow-custom-vm-image.md) |  Requires that custom images come from an approved resource group. You specify the name of the approved resource group. |
| [Deny hybrid use benefit](scripts/deny-hybrid-use.md) | Prohibits use of Azure Hybrid Use Benefit (AHUB). Use when you do not want to permit use of on-premise licenses. |
| [Not allowed VM Extensions](scripts/not-allowed-vm-ext.md) | Prohibits the use of specified extensions. You specify an array containing the prohibited extension types. |
| [Only allow a certain VM platform image](scripts/allow-certain-vm-image.md) | Requires that virtual machines use a specific version of UbuntuServer. |
| [Create VM using Managed Disk](scripts/use-managed-disk-vm.md) | Requires that virtual machines use managed disks.|
|**Monitoring**||
| [Audit diagnostic setting](scripts/audit-diag-setting.md) | Audits if diagnostic settings not enabled for specified resource types. You specify an array of resource types to check whether diagnostic settings are enabled. |
|**Name and text conventions**||
| [Allow multiple name patterns](scripts/allow-multiple-name-patterns.md) | Allow one of many name patterns to be used for resources. |
| [Require like pattern](scripts/enforce-like-pattern.md) | Ensure resource names meet the like condition for a pattern. |
| [Require match pattern](scripts/enforce-match-pattern.md) | Ensure resource names match the naming pattern. |
| [Require tag match pattern](scripts/enforce-tag-match-pattern.md) | Ensure that a tag value matches a text pattern. |
|**Network**||
| [Allowed Application Gateway SKUs](scripts/allowed-app-gate-sku.md) | Requires that application gateways use an approved SKU. You specify an array of approved SKUs. |
| [Audit if Network Watcher is not enabled for region](scripts/net-watch-not-enabled.md) | Audits if network watcher is not enabled for a specified region. You specify the name of the region to check whether network watcher is enabled. |
| [NSG X on every NIC](scripts/nsg-on-nic.md) | Requires that a specific network security group is used with every virtual network interface. You specify the ID of the network security group to use. |
| [NSG X on every subnet](scripts/nsg-on-subnet.md) | Requires that a specific network security group is used with every virtual subnet. You specify the ID of the network security group to use. |
| [Allowed Express Route bandwidth](scripts/allowed-er-band.md) | Requires that express routes use a specified set of bandwidths. You specify an array of SKUs that can be specified for Express Route. |
| [Allowed Peering Location for Express Route](scripts/allowed-peering-er.md) | Requires that Express Routes use specified peering locations. You specify an array of allowed peering locations. |
| [Allowed Express Route SKUs](scripts/allowed-er-skus.md) | Requires that Express Routes use an approved SKU. You specify an array of allowed SKUs. |
| [Allowed Load Balancer SKUs](scripts/allowed-lb-skus.md) | Requires that load balancers use an approved SKU. You specify an array of allowed SKUs. |
| [No network peering to ER network](scripts/no-peering-er-net.md) | Prohibits a network peering from being associated to a network in a specified resource group. Use to prevent connection with central managed network infrastructure. You specify the name of the resource group to prevent association. |
| [No User Defined Route Table](scripts/no-user-def-route-table.md)  |Prohibits virtual networks from being deployed with a user-defined route table. |
| [Allowed Virtual Network Gateway SKUs](scripts/no-user-def-route-table.md) | Requires that virtual network gateways use an approved SKU and gateway type. You specify an array of approved SKUs and an array of approved gateway types. |
| [Use approved subnet for VM network interfaces](scripts/use-approved-subnet-vm-nics.md) | Requires that network interfaces use an approved subnet. You specify the ID of the approved subnet. |
| [Use approved vNet for VM network interfaces](scripts/use-approved-vnet-vm-nics.md) | Requires that network interfaces use an approved virtual network. You specify the ID of the approved virtual network. |
|**Tags**||
| [Billing Tags Policy Initiative](scripts/billing-tags-policy-init.md) | Requires specified tag values for cost center and product name. Uses built-in policies to apply and enforce required tags. You specify the required values for the tags.  |
| [Enforce tag and its value on resource groups](scripts/enforce-tag-rg.md) | Requires a tag and value on a resource group. You specify the required tag name and value.  |
|**SQL**||
| [Audit SQL DB Level Audit Setting](scripts/audit-sql-db-audit-setting.md) | Audits SQL database audit settings if those settings do not match a specified setting. You specify a value that indicates whether audit settings should be enabled or disabled.  |
| [Audit transparent data encryption status](scripts/audit-trans-data-enc-status.md) | Audits SQL database transparent data encryption if it is not enabled.  |
| [Audit DB level threat detection setting](scripts/audit-db-threat-det-setting.md) | Audits SQL database security alert policies if those policies are not set to specified state. You specify a value that indicates whether threat detection is enabled or disabled.  |
| [Audit SQL Server Level Audit Setting](scripts/audit-sql-ser-leve-audit-setting.md) | Audits SQL server audit settings if those settings do not match a specified setting. You specify a value that indicates whether audit settings should be enabled or disabled. |
| [Audit Server level threat detection setting](scripts/audit-sql-ser-threat-det-setting.md) | Audits SQL database security alert policies if those policies are not set to specified state. You specify a value that indicates whether threat detection is enabled or disabled.  |
| [Allowed SQL DB SKUs](scripts/allowed-sql-db-skus.md) | Requires SQL databases use an approved SKU. You specify an array of allowed SKU IDs or an array of allowed SKU names. |
|**Storage**||
| [Allowed SKUs for Storage Accounts and Virtual Machines](scripts/allowed-skus-storage.md) | Requires that storage accounts and virtual machines use approved SKUs. Uses built-in policies to ensure approved SKUs. You specify an array of approved virtual machines SKUs, and an array of approved storage account SKUs. |
| [Ensure https traffic only for storage account](scripts/ensure-https-stor-acct.md) | Requires storage accounts to use HTTPS traffic.  |
| [Deny cool access tiering for storage accounts](scripts/deny-cool-access-tiering.md) | Prohibits the use of cool access tiering for blob storage accounts.  |
| [Ensure storage file encryption](scripts/ensure-store-file-enc.md) | Requires that file encryption is enabled for storage accounts.  |
|**Built-in policy**||
| [Allowed locations](scripts/allowed-locs.md) | Requires that all resources are deployed to the approved locations. You specify an array of approved locations.  |
| [Allowed resource types](scripts/allowed-res-types.md) | Ensures only approved resource types are deployed. You specify an array of resource types that are permitted.  |
| [Allowed storage account SKUs](scripts/allowed-stor-acct-skus.md) | Requires that storage accounts use an approved SKU. You specify an array of approved SKUs. |
| [Apply tag and its default value](scripts/apply-tag-def-val.md) | Appends a specified tag name and value, if that tag is not provided. You specify the tag name and value to apply.  |
| [Enforce tag and its value](scripts/enforce-tag-val.md) | Requires a specified tag name and value. You specify the tag name and value to enforce.  |
| [Not allowed resource types](scripts/not-allowed-res-type.md) | Prohibits the deployment of specified resource types. You specify an array of the resource types to block.  |
| [Require SQL Server version 12.0](scripts/req-sql-12.md) | Requires SQL servers to use version 12.0.  |
| [Require storage account encryption](scripts/req-store-acct-enc.md) | Requires the storage account use blob encryption.  |
