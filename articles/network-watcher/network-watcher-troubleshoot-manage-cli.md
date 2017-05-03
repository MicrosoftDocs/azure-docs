---
title: Troubleshoot Azure Virtual Network Gateway and Connections - Azure CLI | Microsoft Docs
description: This page explains how to use the Azure Network Watcher troubleshoot Azure CLI
services: network-watcher
documentationcenter: na
author: georgewallace
manager: timlt
editor:

ms.assetid: 2838bc61-b182-4da8-8533-27db8fdbd177
ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 02/22/2017
ms.author: gwallace

---

# Troubleshoot Virtual Network Gateway and Connections using Azure Network Watcher Azure CLI

> [!div class="op_single_selector"]
> - [PowerShell](network-watcher-troubleshoot-manage-powershell.md)
> - [CLI](network-watcher-troubleshoot-manage-cli.md)
> - [REST API](network-watcher-troubleshoot-manage-rest.md)

Network Watcher provides many capabilities as it relates to understanding your network resources in Azure. One of these capabilities is resource troubleshooting. Resource troubleshooting can be called by PowerShell, CLI, or REST API. When called, Network Watcher inspects the health of a Virtual Network Gateway or a Connection and returns its findings.

This article uses cross-platform Azure CLI 1.0, which is available for Windows, Mac and Linux. Network Watcher currently uses Azure CLI 1.0 for CLI support.

## Before you begin

This scenario assumes you have already followed the steps in [Create a Network Watcher](network-watcher-create.md) to create a Network Watcher.

## Overview

Resource troubleshooting provides the ability troubleshoot issues that arise with Virtual Network Gateways and Connections. When a request is made to resource troubleshooting, logs are being queried and inspected. When inspection is complete, the results are returned. Resource troubleshooting requests are long running requests, which could take multiple minutes to return a result. The logs from troubleshooting are stored in a container on a storage account that is specified.

## Retrieve a Virtual Network Gateway Connection

In this example, resource troubleshooting is being ran on a Connection. You can also pass it a Virtual Network Gateway. The following cmdlet lists the vpn-connections in a resource group.

```azurecli
azure network vpn-connection list -g resourceGroupName
```

You can also run the command to see the connections in a subscription.

```azurecli
azure network vpn-connection list -s subscription
```

Once you have the name of the connection, you can run this command to get its resource Id:

```azurecli
azure network vpn-connection show -g resourceGroupName -n connectionName
```

## Create a storage account

Resource troubleshooting returns data about the health of the resource, it also saves logs to a storage account to be reviewed. In this step, we create a storage account, if an existing storage account exists you can use it.

1. Create the storage account

    ```azurecli
    azure storage account create -n storageAccountName -l location -g resourceGroupName
    ```

1. Get the storage account keys

    ```azurecli
    azure storage account keys list storageAccountName -g resourcegroupName
    ```

1. Create the container

    ```azurecli
    azure storage container create --account-name storageAccountName -g resourcegroupName --acount-key {storageAccountKey} --container logs
    ```

## Run Network Watcher resource troubleshooting

You troubleshoot resources with the `network watcher troubleshoot` cmdlet. We pass the cmdlet the resource group, the name of the Network Watcher, the Id of the connection, the Id of the storage account, and the path to the blob to store the troubleshoot results in.

```azurecli
azure network watcher -g resourceGroupName -n networkWatcherName -t connectionId -i storageId -p storagePath
```

Once you run the cmdlet, Network Watcher reviews the resource to verify the health. It returns the results to the shell and stores logs of the results in the storage account specified.

## Understanding the results

The action text provides general guidance on how to resolve the issue. If an action can be taken for the issue, a link is provided with additional guidance. In the case where there is no additional guidance, the response provides the url to open a support case.  For more information about the properties of the response and what is included, visit [Network Watcher Troubleshoot overview](network-watcher-troubleshoot-overview.md)

For instructions on downloading files from azure storage accounts, refer to [Get started with Azure Blob storage using .NET](../storage/storage-dotnet-how-to-use-blobs.md). Another tool that can be used is Storage Explorer. More information about Storage Explorer can be found here at the following link: [Storage Explorer](http://storageexplorer.com/)

## Next steps

If settings have been changed that stop VPN connectivity, see [Manage Network Security Groups](../virtual-network/virtual-network-manage-nsg-arm-portal.md) to track down the network security group and security rules that may be in question.
