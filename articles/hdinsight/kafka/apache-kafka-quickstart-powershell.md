---
title: Start with Apache Kafka - Azure HDInsight Quickstart | Microsoft Docs
description: 'In this quickstart, you learn how to create an Apache Kafka cluster on Azure HDInsight using Azure PowerShell. You also learn about Kafka topics, subscribers, and consumers.'
services: hdinsight
documentationcenter: ''
author: Blackmist
manager: jhubbard
editor: cgronlun
ms.service: hdinsight
ms.custom: mvc,hdinsightactive
ms.devlang: ''
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 03/29/2018
ms.author: larryfr
#Customer intent: I need to create a Kafka cluster so that I can use it to process messages
---
# Quickstart: Create a Kafka on HDInsight cluster

Kafka is an open-source, distributed streaming platform. It's often used as a message broker, as it provides functionality similar to a publish-subscribe message queue. 

In this quickstart, you learn how to create an [Apache Kafka](https://kafka.apache.org) cluster using Azure PowerShell. You also learn how to use included utilities to send and receive messages using Kafka.

[!INCLUDE [delete-cluster-warning](../../../includes/hdinsight-delete-cluster-warning.md)]

## Prerequisites

* An Azure subscription. If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* Azure PowerShell. For more information, see the [Install and Configure Azure PowerShell](https://docs.microsoft.com/powershell/azure/install-azurerm-ps) document.

* An SSH client. The steps in this document use SSH to connect to the cluster and work with Kafka from the cluster head nodes.

    The `ssh` command is provided by default on Linux, Unix, and macOS systems. On Windows 10, use one of the following methods to install the `ssh` command:

    * Use the [Azure Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/quickstart). The cloud shell provides the `ssh` command, and can be configured to use either Bash or PowerShell as the shell environment.

    * [Install the Windows Subsystem for Linux](https://docs.microsoft.com/windows/wsl/install-win10). The Linux distributions available through the Microsoft Store provide the `ssh` command.

    > [!IMPORTANT]
    > The steps in this document assume that you are using one of the SSH clients mentioned above. If you are using a different SSH client and encounter problems, please consult the documentation for your SSH client.
    >
    > For more information, see the [Use SSH with HDInsight](../hdinsight-hadoop-linux-use-ssh-unix.md) document.

## Log in to Azure

Log in to your Azure subscription with the `Login-AzureRmAccount` cmdlet and follow the on-screen directions.

```powershell
Login-AzureRmAccount
```

## Create resource group

Create an Azure resource group with [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup). A resource group is a logical container into which Azure resources are deployed and managed. The following example prompts you for the name and location, and then creates a new resource group:

```powershell
$resourceGroup = Read-Input -Prompt "Enter the resource group name"
$location = Read-Input -Prompt "Enter the Azure region to use"

New-AzureRmResourceGroup -Name $resourceGroup -Location $location
```

## Create a virtual network

Create a virtual network with [New-AzureRmVirtualNetwork](/powershell/module/azurerm.network/new-azurermvirtualnetwork). The following example prompts you for the network name, and then creates it in the resource group:

```powershell
$networkName = Read-Input -Prompt "Enter the virtual network name"

$virtualNetwork = New-AzureRmVirtualNetwork `
  -ResourceGroupName $resourceGroup `
  -Location $location `
  -Name $networkName `
  -AddressPrefix 10.0.0.0/16
```

Azure resources are deployed to a subnet within a virtual network, so you need to create a subnet. Create a subnet configuration with [New-AzureRmVirtualNetworkSubnetConfig](/powershell/module/azurerm.network/new-azurermvirtualnetworksubnetconfig). 

```powershell
$subnetConfig = Add-AzureRmVirtualNetworkSubnetConfig `
  -Name default `
  -AddressPrefix 10.0.0.0/24 `
  -VirtualNetwork $virtualNetwork
```

Write the subnet configuration to the virtual network with [Set-AzureRmVirtualNetwork](/powershell/module/azurerm.network/Set-AzureRmVirtualNetwork). This creates the subnet within the virtual network:

```powerShell
$virtualNetwork | Set-AzureRmVirtualNetwork
```

## Create a Kafka cluster

Create a Kafka on HDinsight cluster with the 