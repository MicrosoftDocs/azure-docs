---
title: Troubleshoot connections - Azure portal
titleSuffix: Azure Network Watcher
description: Learn how to use the connection troubleshoot capability of Azure Network Watcher using the Azure portal.
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.date: 09/13/2023
#CustomerIntent: As an Azure administrator, I want to learn how to use Connection Troubleshoot to diagnose connectivity problems in Azure.
---

# Troubleshoot connections with Azure Network Watcher using the Azure portal

In this article, you learn how to use Azure Network Watcher connection troubleshoot to diagnose and troubleshoot connectivity issues. For more information about connection troubleshoot, see [Connection troubleshoot overview](network-watcher-connectivity-overview.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A virtual machine with inbound TCP connectivity from 168.63.129.16 over the port being tested (for Port scanner diagnostic test).

> [!IMPORTANT]
> Connection troubleshoot requires that the virtual machine you troubleshoot from has the `AzureNetworkWatcherExtension` extension installed. The extension is not required on the destination virtual machine.
> - To install the extension on a Windows VM, see [Azure Network Watcher Agent virtual machine extension for Windows](../virtual-machines/extensions/network-watcher-windows.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json).
> - To install the extension on a Linux VM, see [Azure Network Watcher Agent virtual machine extension for Linux](../virtual-machines/extensions/network-watcher-linux.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json).

## Test connectivity between two connected virtual machines

In this section, you test connectivity between two connected virtual machines.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** in the search results.

1. Under **Network diagnostic tools**, select **Connection troubleshoot**. Enter or select the following information:

    | Setting | Value  |
    | ------- | ------ |
    | **Source** |  |
    | Subscription | Select your Azure subscription. |
    | Resource group | Select **myResourceGroup**. |
    | Source type | Select **Virtual machine**. |
    | Virtual machine | Select **VM1**. |
    | **Destination** |  |
    | Destination type | Select **Select a virtual machine**. |
    | Resource group | Select **myResourceGroup**. |
    | Virtual machine | Select **VM2**. |
    | **Probe Settings** |  |
    | Preferred IP version | Select **IPv4**. |
    | Protocol | Select **TCP**. |
    | Destination port | Enter **80**. |
    | **Connection Diagnostics** |  |
    | Diagnostics tests | Select **Select all**. |

    :::image type="content" source="./media/network-watcher-connectivity-portal/test-virtual-machines-connected.png" alt-text="Screenshot of Network Watcher connection troubleshoot in Azure portal to test the connection between two connected virtual machines." lightbox="./media/network-watcher-connectivity-portal/test-virtual-machines-connected.png":::

1. Select **Run diagnostic tests**.

    The test results show that the two virtual machines are communicating with no issues:

    - Network security group rules allow traffic between the two virtual machines.
    - The two virtual machines are directly connected (VM2 is the next hop of VM1).
    - Azure default system route is used to route traffic between the two virtual machines (Route table ID: System route).
    - 66 probes were successfully sent with average latency of 2 ms.

    :::image type="content" source="./media/network-watcher-connectivity-portal/virtual-machine-connected-test-result.png" alt-text="Screenshot of connection troubleshoot results after testing the connection between two connected virtual machines.":::

## Troubleshoot connectivity issue between two virtual machines

In this section, you test connectivity between two virtual machines that have connectivity issue.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** in the search results.

1. Under **Network diagnostic tools**, select **Connection troubleshoot**. Enter or select the following information:

    | Setting | Value  |
    | ------- | ------ |
    | **Source** |  |
    | Subscription | Select your Azure subscription. |
    | Resource group | Select **myResourceGroup**. |
    | Source type | Select **Virtual machine**. |
    | Virtual machine | Select **VM1**. |
    | **Destination** |  |
    | Destination type | Select **Select a virtual machine**. |
    | Resource group | Select **myResourceGroup**. |
    | Virtual machine | Select **VM3**. |
    | **Probe Settings** |  |
    | Preferred IP version | Select **IPv4**. |
    | Protocol | Select **TCP**. |
    | Destination port | Enter *80*. |
    | **Connection Diagnostics** |  |
    | Diagnostics tests | Select **Select all**. |

    :::image type="content" source="./media/network-watcher-connectivity-portal/test-two-virtual-machines.png" alt-text="Screenshot of Network Watcher connection troubleshoot in Azure portal to test the connection between two virtual machines." lightbox="./media/network-watcher-connectivity-portal/test-two-virtual-machines.png":::

1. Select **Run diagnostic tests**.

    The test results show that the two virtual machines aren't communicating:

    - The two virtual machines aren't connected (no probes were sent from VM1 to VM3).
    - There's no route between the two virtual machines (Next hop type: None).
    - Azure default system route is the route table used (Route table ID: System route).
    - Network security group rules allow traffic between the two virtual machines.

    :::image type="content" source="./media/network-watcher-connectivity-portal/virtual-machines-test-result.png" alt-text="Screenshot of connection troubleshoot results after testing the connection between two virtual machines that aren't communicating.":::

## Test connectivity with `www.bing.com`

In this section, you test connectivity between a virtual machines and `www.bing.com`.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** in the search results.

1. Under **Network diagnostic tools**, select **Connection troubleshoot**. Enter or select the following information:

    | Setting | Value  |
    | ------- | ------ |
    | **Source** |  |
    | Subscription | Select your Azure subscription. |
    | Resource group | Select **myResourceGroup**. |
    | Source type | Select **Virtual machine**. |
    | Virtual machine | Select **VM1**. |
    | **Destination** |  |
    | Destination type | Select **Specify manually**. |
    | URI, FQDN or IP address  | Enter *www\.bing.com*. |
    | **Probe Settings** |  |
    | Preferred IP version | Select **IPv4**. |
    | Protocol | Select **TCP**. |
    | Destination port | Enter *443*. |
    | **Connection Diagnostics** |  |
    | Diagnostics tests | Select **Connectivity**. |

    :::image type="content" source="./media/network-watcher-connectivity-portal/test-bing.png" alt-text="Screenshot of Network Watcher connection troubleshoot in Azure portal to test the connection between a virtual machines and Microsoft Bing search engine." lightbox="./media/network-watcher-connectivity-portal/test-bing.png":::

1. Select **Run diagnostic tests**.

    The test results show that `www.bing.com` is reachable from **VM1** virtual machine:

    - Connectivity test is successful with 66 probes sent with an average latency of 3 ms.

    :::image type="content" source="./media/network-watcher-connectivity-portal/bing-test-result.png" alt-text="Screenshot of connection troubleshoot results after testing the connection with Microsoft Bing search engine.":::

## Next steps

Learn how to [automate virtual machines packet captures](network-watcher-alert-triggered-packet-capture.md)
