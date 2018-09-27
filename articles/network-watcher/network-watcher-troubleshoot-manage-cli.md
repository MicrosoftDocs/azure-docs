---
title: Troubleshoot Azure Virtual Network Gateway and Connections - Azure CLI | Microsoft Docs
description: This page explains how to use the Azure Network Watcher troubleshoot Azure CLI
services: network-watcher
documentationcenter: na
author: jimdial
manager: timlt
editor:

ms.assetid: 2838bc61-b182-4da8-8533-27db8fdbd177
ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 06/19/2017
ms.author: jdial

---

# Troubleshoot Virtual Network Gateway and Connections using Azure Network Watcher Azure CLI

> [!div class="op_single_selector"]
> - [Portal](diagnose-communication-problem-between-networks.md)
> - [PowerShell](network-watcher-troubleshoot-manage-powershell.md)
> - [Azure CLI](network-watcher-troubleshoot-manage-cli.md)
> - [REST API](network-watcher-troubleshoot-manage-rest.md)

Network Watcher provides many capabilities as it relates to understanding your network resources in Azure. One of these capabilities is resource troubleshooting. Resource troubleshooting can be called through the portal, PowerShell, CLI, or REST API. When called, Network Watcher inspects the health of a Virtual Network Gateway or a Connection and returns its findings.

To perform the steps in this article, you need to [install the Azure command-line interface for Mac, Linux, and Windows (CLI)](/cli/azure/install-azure-cli).

## Before you begin

This scenario assumes you have already followed the steps in [Create a Network Watcher](network-watcher-create.md) to create a Network Watcher.

For a list of supported gateway types visit, [Supported Gateway types](network-watcher-troubleshoot-overview.md#supported-gateway-types).

## Overview

Resource troubleshooting provides the ability troubleshoot issues that arise with Virtual Network Gateways and Connections. When a request is made to resource troubleshooting, logs are being queried and inspected. When inspection is complete, the results are returned. Resource troubleshooting requests are long running requests, which could take multiple minutes to return a result. The logs from troubleshooting are stored in a container on a storage account that is specified.

## Retrieve a Virtual Network Gateway Connection

In this example, resource troubleshooting is being ran on a Connection. You can also pass it a Virtual Network Gateway. The following cmdlet lists the vpn-connections in a resource group.

```azurecli
az network vpn-connection list --resource-group resourceGroupName
```

Once you have the name of the connection, you can run this command to get its resource Id:

```azurecli
az network vpn-connection show --resource-group resourceGroupName --ids vpnConnectionIds
```

## Create a storage account

Resource troubleshooting returns data about the health of the resource, it also saves logs to a storage account to be reviewed. In this step, we create a storage account, if an existing storage account exists you can use it.

1. Create the storage account

    ```azurecli
    az storage account create --name storageAccountName --location westcentralus --resource-group resourceGroupName --sku Standard_LRS
    ```

1. Get the storage account keys

    ```azurecli
    az storage account keys list --resource-group resourcegroupName --account-name storageAccountName
    ```

1. Create the container

    ```azurecli
    az storage container create --account-name storageAccountName --account-key {storageAccountKey} --name logs
    ```

## Run Network Watcher resource troubleshooting

You troubleshoot resources with the `az network watcher troubleshooting` cmdlet. We pass the cmdlet the resource group, the name of the Network Watcher, the Id of the connection, the Id of the storage account, and the path to the blob to store the troubleshoot results in.

```azurecli
az network watcher troubleshooting start --resource-group resourceGroupName --resource resourceName --resource-type {vnetGateway/vpnConnection} --storage-account storageAccountName  --storage-path https://{storageAccountName}.blob.core.windows.net/{containerName}
```

Once you run the cmdlet, Network Watcher reviews the resource to verify the health. It returns the results to the shell and stores logs of the results in the storage account specified.

## Understanding the results

The action text provides general guidance on how to resolve the issue. If an action can be taken for the issue, a link is provided with additional guidance. In the case where there is no additional guidance, the response provides the url to open a support case.  For more information about the properties of the response and what is included, visit [Network Watcher Troubleshoot overview](network-watcher-troubleshoot-overview.md)

For instructions on downloading files from azure storage accounts, refer to [Get started with Azure Blob storage using .NET](../storage/blobs/storage-dotnet-how-to-use-blobs.md). Another tool that can be used is Storage Explorer. More information about Storage Explorer can be found here at the following link: [Storage Explorer](http://storageexplorer.com/)

## Next steps

If settings have been changed that stop VPN connectivity, see [Manage Network Security Groups](../virtual-network/manage-network-security-group.md) to track down the network security group and security rules that may be in question.
