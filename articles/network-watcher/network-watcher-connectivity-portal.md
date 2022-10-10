---
title: Troubleshoot connections - Azure portal
titleSuffix: Azure Network Watcher
description: Learn how to use the connection troubleshoot capability of Azure Network Watcher using the Azure portal.
services: network-watcher
author: shijaiswal
ms.service: network-watcher
ms.topic: troubleshooting
ms.workload:  infrastructure-services
ms.custom: ignite-2022
ms.date: 10/12/2022
ms.author: shijaiswal
---

# Troubleshoot connections with Azure Network Watcher using the Azure portal

This article describes the procedure to use Connection troubleshoot to verify whether a direct connection from a virtual machine to a destination can be established. 

## Prerequisites

Ensure that you have the following:

* An instance of Network Watcher in the region you want to troubleshoot a connection.
* Virtual machines to troubleshoot connections with.

> [!IMPORTANT]
> 
> Ensure that the `AzureNetworkWatcherExtension` VM extension is installed on the VM that you troubleshoot from.
> - To install the extension on a Windows VM, see [Azure Network Watcher Agent virtual machine extension for Windows](../virtual-machines/extensions/network-watcher-windows.md)     
> - To install the extension on a Linux VM, see [Azure Network Watcher Agent virtual machine extension for Linux](../virtual-machines/extensions/network-watcher-linux.md). 
> 
> The extension isn't required on the destination endpoint.

## Check connectivity to a virtual machine

To check the connectivity to a destination virtual machine over port 80 follow these steps:

1. In Network Watcher, select **Connection troubleshoot**. 
2. In the **Source** section, enter the details of the virtual machine that you want to check connectivity from:
   1. Select the **Subscription** to which the VM belongs.
   2. Select the **Resource group** within the subscription.
   3. Select the type of the source machine from the **Source type** drop-down. The source can be a Virtual machine, Application Gateway, or a Bastion host.
3. In the **Destination** section,
   1. Select the **Destination type** as **Virtual machine**.
   2. Select the **Resource group** to which the destination machine belongs. 
   3. The **Virtual machine** drop-down lists the virtual machines belonging to the same resource group as the source VM. Select the destination virtual machine from the drop-down list.
4. Provide the Probe information in the **Probe Settings** section.
   1. Select the **Preferred IP version** to be used. You can choose IPv4, IPv6, or both.
   2. Select the probing **Protocol**. 
      1. If you chose **TCP**, enter the value of the **Destination port**. 
      2. Enter the value of the **Source port**. This is an optional field.
      3. Select **Test connection**.
      4. If you chose **ICMP**, select **Test connection**.

Connection troubleshoot checks the connectivity between the virtual machines on the specified port.
The results of the connectivity test are available in the [**Connection troubleshoot Result**](#connection-troubleshoot-result) section.

:::image type="content" source="./media/network-watcher-connectivity-portal/network-watcher-tcp-selection.png" alt-text="Screenshot of Connection troubleshoot screen with values selected.":::

## Check remote endpoint connectivity

To check the connectivity and latency to a remote endpoint, follow these steps:

1. In Network Watcher, select **Connection troubleshoot**. 
2. In the **Source** section, enter the details of the virtual machine that you want to check connectivity from:
   1. Select the **Subscription** to which the VM belongs.
   2. Select the **Resource group** within the subscription.
   3. Select the type of the source machine from the **Source type** drop-down. The source can be a Virtual machine, Application Gateway, or a Bastion host.. 
3. Choose **Specify manually** in the **Destination type** section.
4.  Enter the URI, FQDN, or IP address and select **Test connection**.  

This method of checking connectivity is used for remote endpoints like websites and storage endpoints. The results of the connectivity test are available in the [**Connection troubleshoot Result**](#connection-troubleshoot-result) section.

## Connection troubleshoot result

This section provides actionable insights with a step-by-step guide to resolve issues. It also shows the status of the connection and provides details such as latency, hops, details of tests performed, their status, and the steps to mitigate the issues.

For each test with a *Failed* or *Warning* status, the **Connection troubleshoot Result** table provides links to specific articles in the documentation to assist the users in resolving issues.  

:::image type="content" source="./media/network-watcher-connectivity-portal/network-watcher-unsuccessful.png" alt-text="Screenshot of Results table for unsuccessful connection.":::

## Next steps

- Automate packet captures with Virtual machine alerts using [Create an alert triggered packet capture](network-watcher-alert-triggered-packet-capture.md).
- Check the type of traffic that is allowed in or out of your VM using [Check IP flow verify](diagnose-vm-network-traffic-filtering-problem.md).
