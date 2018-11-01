---
title: Manage Network Security Group Flow logs with Azure Network Watcher - Azure CLI | Microsoft Docs
description: This page explains how to manage Network Security Group Flow logs in Azure Network Watcher with Azure CLI
services: network-watcher
documentationcenter: na
author: jimdial
manager: timlt
editor:

ms.assetid: 2dfc3112-8294-4357-b2f8-f81840da67d3
ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 02/22/2017
ms.author: jdial

---


# Configuring Network Security Group Flow logs with Azure CLI

> [!div class="op_single_selector"]
> - [Azure portal](network-watcher-nsg-flow-logging-portal.md)
> - [PowerShell](network-watcher-nsg-flow-logging-powershell.md)
> - [Azure CLI](network-watcher-nsg-flow-logging-cli.md)
> - [REST API](network-watcher-nsg-flow-logging-rest.md)

Network Security Group flow logs are a feature of Network Watcher that allows you to view information about ingress and egress IP traffic through a Network Security Group. These flow logs are written in json format and show outbound and inbound flows on a per rule basis, the NIC the flow applies to, 5-tuple information about the flow (Source/Destination IP, Source/Destination Port, Protocol), and if the traffic was allowed or denied.

To perform the steps in this article, you need to [install the Azure command-line interface for Mac, Linux, and Windows (CLI)](/cli/azure/install-azure-cli).

## Register Insights provider

In order for flow logging to work successfully, the **Microsoft.Insights** provider must be registered. If you are not sure if the **Microsoft.Insights** provider is registered, run the following script.

```azurecli
az provider register --namespace Microsoft.Insights
```

## Enable Network Security Group Flow logs

The command to enable flow logs is shown in the following example:

```azurecli
az network watcher flow-log configure --resource-group resourceGroupName --enabled true --nsg nsgName --storage-account storageAccountName
```

The storage account that you specify cannot have network rules configured for it that restrict network access to only Microsoft services or specific virtual networks. The storage account can be in the same, or a different Azure subscription, than the NSG that you enable the flow log for. If you use different subscriptions, they must both be associated to the same Azure Active Directory tenant. The account you use for each subscription must have the [necessary permissions](required-rbac-permissions.md). 

If the storage account is in a different resource group, or subscription, than the network security group, specify the full ID of the storage account, rather than its name. For example, if the storage account is in a resource group named *RG-Storage*, rather than specifying *storageAccountName* in the previous command, you'd specify */subscriptions/{SubscriptionID}/resourceGroups/RG-Storage/providers/Microsoft.Storage/storageAccounts/storageAccountName*.

## Disable Network Security Group Flow logs

Use the following example to disable flow logs:

```azurecli
az network watcher flow-log configure --resource-group resourceGroupName --enabled false --nsg nsgName
```

## Download a Flow log

The storage location of a flow log is defined at creation. A convenient tool to access these flow logs saved to a storage account is Microsoft Azure Storage Explorer, which can be downloaded here:  http://storageexplorer.com/

If a storage account is specified, packet capture files are saved to a storage account at the following location:

```
https://{storageAccountName}.blob.core.windows.net/insights-logs-networksecuritygroupflowevent/resourceId=/SUBSCRIPTIONS/{subscriptionID}/RESOURCEGROUPS/{resourceGroupName}/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/{nsgName}/y={year}/m={month}/d={day}/h={hour}/m=00/macAddress={macAddress}/PT1H.json
```

For information about the structure of the log visit [Network Security Group Flow log Overview](network-watcher-nsg-flow-logging-overview.md)

## Next Steps

Learn how to [Visualize your NSG flow logs with PowerBI](network-watcher-visualize-nsg-flow-logs-power-bi.md)

Learn how to [Visualize your NSG flow logs with open source tools](network-watcher-visualize-nsg-flow-logs-open-source-tools.md)
