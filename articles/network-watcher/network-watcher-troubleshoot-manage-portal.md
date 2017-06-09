---
title: Troubleshoot Azure Virtual Network Gateway and Connections - PowerShell | Microsoft Docs
description: This page explains how to use the Azure Network Watcher troubleshoot PowerShell cmdlet
services: network-watcher
documentationcenter: na
author: georgewallace
manager: timlt
editor: 

ms.assetid: f6f0a813-38b6-4a1f-8cfc-1dfdf979f595
ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 02/22/2017
ms.author: gwallace

---

# Troubleshoot Virtual Network Gateway and Connections using Azure Network Watcher PowerShell

> [!div class="op_single_selector"]
> - [Portal](network-watcher-troubleshoot-manage-portal.md)
> - [PowerShell](network-watcher-troubleshoot-manage-powershell.md)
> - [CLI 1.0](network-watcher-troubleshoot-manage-cli-nodejs.md)
> - [CLI 2.0](network-watcher-troubleshoot-manage-cli.md)
> - [REST API](network-watcher-troubleshoot-manage-rest.md)

Network Watcher provides many capabilities as it relates to understanding your network resources in Azure. One of these capabilities is resource troubleshooting. Resource troubleshooting can be called by PowerShell, CLI, or REST API. When called, Network Watcher inspects the health of a Virtual Network Gateway or a Connection and returns its findings.

## Before you begin

This scenario assumes you have already followed the steps in [Create a Network Watcher](network-watcher-create.md) to create a Network Watcher.

For a list of supported gateway types visit, [Supported Gateway types](/network-watcher-troubleshoot-overview.md#supported-gateway-types).

## Overview

Resource troubleshooting provides the ability troubleshoot issues that arise with Virtual Network Gateways and Connections. When a request is made to resource troubleshooting, logs are being queried and inspected. When inspection is complete, the results are returned. Resource troubleshooting requests are long running requests, which could take multiple minutes to return a result. The logs from troubleshooting are stored in a container on a storage account that is specified.

## Troubleshoot a gateway or connection

1. Navigate to the [Azure portal](https://portal.azure.com) and click **Networking** > **Network Watcher** > **VPN Diagnostics**
2. Select a **Subscription**, **Resource Group**, and **Location**.
3. Resource troubleshooting returns data about the health of the resource, it also saves logs to a storage account to be reviewed. Click **Storage Account** to select a storage account.
4. On the **Storage accounts** blade, select an existing storage account or click **+ Storage account** to create a new one.
5. On the **Containers** blade, choose an existing container or click **+ Container** to create a new container. When complete click **Select**
6. Select the Gateway and Connection resources to troubleshoot and click **Start Troubleshooting**

If multiple resources are selected, troubleshooting is ran on one resource at a time. VPN gateways are checked first and then connections. While VPN Diagnostics is running on a resource the **TROUBLESHOOTING STATUS** column will show a status of **Running**

When complete, the status column changes to **Healthy** or **Unhealthy**.

![troubleshoot complete][2]

## Understanding the results

In the **Details** section of the window, the **Status** tab shows the status of the last troubleshooting run on the selected resource. Results of the latest diagnostic are shown xx minutes after the last run.

|Property  |Description  |
|---------|---------|
|Resource     | A link to the resource.        |
|Storage path     | Storage path to the logs (if any were produced during the run)        |
|Summary     | Summary of the resource health.        |
|Detail     | Detailed information on the resource health.        |
|Last run     | The time the last time troubleshooting was ran.        |


The **Action** tab provides general guidance on how to resolve the issue. If an action can be taken for the issue, a link is provided with additional guidance. In the case where there is no additional guidance, the response provides the url to open a support case.  For more information about the properties of the response and what is included, visit [Network Watcher Troubleshoot overview](network-watcher-troubleshoot-overview.md)


## Next steps

If settings have been changed that stop VPN connectivity, see [Manage Network Security Groups](../virtual-network/virtual-network-manage-nsg-arm-portal.md) to track down the network security group and security rules that may be in question.


[1]: ./media/network-watcher-troubleshoot-manage-portal/portal.png
[2]: ./media/network-watcher-troubleshoot-manage-portal/2.png
