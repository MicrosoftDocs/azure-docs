---
title: Test connectivity with Azure Network Watcher - Azure CLI 2.0 | Microsoft Docs
description: This page explains how to test connectivity with Network Watcher using Azure CLI 2.0
services: network-watcher
documentationcenter: na
author: georgewallace
manager: timlt
editor: 

ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 06/02/2017
ms.author: gwallace
---

# Test connectivity with Azure Network Watcher using Azure CLI 2.0

> [!div class="op_single_selector"]
> - [Portal](network-watcher-connectivity-portal.md)
> - [PowerShell](network-watcher-connectivity-powershell.md)
> - [CLI 2.0](network-watcher-connectivity-cli.md)
> - [Azure REST API](network-watcher-connectivity-rest.md)

Learn how to use connectivity to verify if a direct TCP connection from a virtual machine to a given endpoint can be established.

This article takes you through the different types of tests that can be ran with connectivity.

* [**Test virtual machine connectivity**](#test-virtual-machine-connectivity)
* [**Test routing issues**](#test-routing-issues)
* [**Test website latency**](#test-website-latency)
* [**Test storage connectivity**](#test-storage-connectivity)

## Before you begin

This article assumes you have the following resources:

* An instance of Network Watcher in the region you want to test connectivity.

* Virtual machines to test connectivity with.

[!INCLUDE [network-watcher-preview](../../includes/network-watcher-public-preview-notice.md)]

## Test virtual machine connectivity

This example tests connecting to a database server over port 80. Connectivity to a database server should be locked down to only ports that are required for SQL connectivity.

Navigate to **Connectivity check** under on the **Network Watcher blade**.  

Under **Source** fill out the appropriate information.When complete, click **Check**

### Source
|Field  |Value  |
|---------|---------|
|Subscription     | The subscription to use.        |
|Resource group     |  The resource group that contains the virtual machine to test.       |
|Virtual machine     | The virtual machine to test connectivity from.     |
|Port     | Source port to test from *Optional*        |


### Destination

Depending on the type of resource you are testing, the **Destination** section changes.

**Test a Virtual machine**

|Field  |Value  |
|---------|---------|
|Select a virtual machine / Specify Manually   | This radio box determines what destination is being tested. Select **Select a virtual machine**         |
|Resource group     | The resource group that contains the destination virtual machine.        |
|Virtual machine     | The virtual machine to test connectivity to.        |
|Port     | Destination port to test.        |

**Test a URI, FQDN, or IP address**

|Field  |Value  |
|---------|---------|
|Select a virtual machine / Specify Manually     | This radio box determines what destination is being tested. Select **Specify Manually**       |
|URI, FQDN, or IPv4    | Specify the url, FQDN or IPv4 IP address to test connectivity to.        |
|Port     | Destination port to test.        |

## Response

## Next steps

Learn how to automate packet captures with Virtual machine alerts by viewing [Create an alert triggered packet capture](network-watcher-alert-triggered-packet-capture.md)

Find if certain traffic is allowed in or out of your VM by visiting [Check IP flow verify](network-watcher-check-ip-flow-verify-portal.md)

<!-- Image references -->














