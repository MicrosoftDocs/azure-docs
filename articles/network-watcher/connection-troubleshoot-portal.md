---
title: Troubleshoot connections - Azure portal
titleSuffix: Azure Network Watcher
description: Learn how to use the connection troubleshoot feature of Azure Network Watcher to troubleshoot outbound connections using the Azure portal.
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.date: 03/14/2024

#CustomerIntent: As an Azure administrator, I want to learn how to use Connection Troubleshoot to diagnose connectivity problems in Azure.
---

# Troubleshoot connections using the Azure portal

In this article, you learn how to use the connection troubleshoot feature of Azure Network Watcher to diagnose and troubleshoot connectivity issues. For more information about connection troubleshoot, see [Connection troubleshoot overview](connection-troubleshoot-overview.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A virtual machine with inbound TCP connectivity from 168.63.129.16 over the port being tested (for Port scanner diagnostic test).
- Network Watcher enabled in the region of the virtual machine you want to troubleshoot. For more information, see [Enable or disable Azure Network Watcher](network-watcher-create.md).
- Network Watcher agent VM extension installed on the virtual machine you want to troubleshoot from. To manually install the agent, see [Network Watcher Agent virtual machine extension for Windows](../virtual-machines/extensions/network-watcher-windows.md?toc=/azure/network-watcher/toc.json&bc=/azure/network-watcher/breadcrumb/toc.json) or [Network Watcher Agent virtual machine extension for Linux](../virtual-machines/extensions/network-watcher-linux.md?toc=/azure/network-watcher/toc.json&bc=/azure/network-watcher/breadcrumb/toc.json). To update an already installed agent, see [Update Azure Network Watcher extension to the latest version](../virtual-machines/extensions/network-watcher-update.md?toc=/azure/network-watcher/toc.json&bc=/azure/network-watcher/breadcrumb/toc.json).

> [!NOTE]
> - By default, Network Watcher is automatically enabled.
> - When you use connection troubleshoot, Azure automatically installs the Network Watcher agent VM extension if it's not already installed. 

## Test connectivity with reachable virtual machine

In this section, you test the connectivity over RDP from one virtual machine to another.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** in the search results.

    :::image type="content" source="./media/connection-troubleshoot-portal/portal-search.png" alt-text="Screenshot that shows how to search for Network Watcher in the Azure portal." lightbox="./media/connection-troubleshoot-portal/portal-search.png":::

1. Under **Network diagnostic tools**, select **Connection troubleshoot**. Enter or select the following values:

    | Setting | Value  |
    | ------- | ------ |
    | **Source** |  |
    | Source type | Select **Virtual machine**. |
    | Virtual machine | Select the virtual machine that you want to troubleshoot the connection from. |
    | **Destination** |  |
    | Destination type | Select **Select a virtual machine**. |
    | Virtual machine | Select the destination virtual machine. |
    | **Probe Settings** |  |
    | Preferred IP version | Select **IPv4**. The other available options are: **Both** and **IPv6**. |
    | Protocol | Select **TCP**. The other available option is: **ICMP**. |
    | Destination port | Enter **3389**. 3389 is the default port used by RDP. |
    | Source port | Leave blank or enter a source port number that you want to test. |
    | **Connection Diagnostic** |  |
    | Diagnostics tests | Select **Connectivity**, **NSG diagnostic**, **Next hop**, and **Port scanner**. |

    :::image type="content" source="./media/connection-troubleshoot-portal/test-connectivity-vm.png" alt-text="Screenshot that shows Network Watcher connection troubleshoot in Azure portal to test the connection between two virtual machines." lightbox="./media/connection-troubleshoot-portal/test-connectivity-vm.png":::

1. Select **Run diagnostic tests**.

    The test results show that the two virtual machines are communicating with no issues. 

    - 66 probes were successfully sent with average latency of 2 ms. Select **See details** to see the next hop details.
    - Outbound connectivity from the source virtual machine is allowed. Select **See details** to see the security rule(s) allowing the communication.
    - Inbound connectivity to the destination virtual machine is allowed. Select **See details** to see the security rule(s) allowing the communication.
    - Azure default system route is used to route traffic between the two virtual machines (Route table ID: System route).
    - Port 3389 is open on the destination virtual machine.

    :::image type="content" source="./media/connection-troubleshoot-portal/test-connectivity-vm-results.png" alt-text="Screenshot that shows connection troubleshoot results after testing the connection between two virtual machines.":::

1. Select **Export to CSV** to download the test results.

## Test connectivity with unreachable virtual machine

In this section, you test connectivity between two virtual machines that have a connectivity issue.

1. On the **Connection troubleshoot** page. Enter or select the following values:

    | Setting | Value  |
    | ------- | ------ |
    | **Source** |  |
    | Source type | Select **Virtual machine**. |
    | Virtual machine | Select the virtual machine that you want to troubleshoot the connection from. |
    | **Destination** |  |
    | Destination type | Select **Select a virtual machine**. |
    | Virtual machine | Select the destination virtual machine. |
    | **Probe Settings** |  |
    | Preferred IP version | Select **IPv4**. The other available options are: **Both** and **IPv6**. |
    | Protocol | Select **TCP**. The other available option is: **ICMP**. |
    | Destination port | Enter **22**. 22 is the default port used For SSH. |
    | Source port | Leave blank or enter a source port number that you want to test. |
    | **Connection Diagnostic** |  |
    | Diagnostics tests | Select **Connectivity**, **NSG diagnostic**, **Next hop**, and **Port scanner**. |

1. Select **Run diagnostic tests**.

    The test results show that the destination virtual machine isn't reachable (the two virtual machines aren't communicating):

    - 30 probes failed.
    - Outbound connectivity from the source virtual machine is allowed. Select **See details** to see the security rule(s) allowing the communication.
    - Inbound connectivity to the destination virtual machine is allowed. Select **See details** to see the security rule(s) allowing the communication.
    - Azure default system route is used to route traffic between the two virtual machines (Route table ID: System route).
    - Port 22 on the destination virtual machine isn't accessible.

    :::image type="content" source="./media/connection-troubleshoot-portal/test-connectivity-unaccessible-port-results.png" alt-text="Screenshot that shows connection troubleshoot results after testing the connection with unreachable virtual machine.":::

1. Select **Export to CSV** to download the test results.

## Test connectivity with `www.bing.com`

In this section, you test connectivity between a virtual machines and a web address.

1. On the **Connection troubleshoot** page. Enter or select the following information:

    | Setting | Value  |
    | ------- | ------ |
    | **Source** |  |
    | Source type | Select **Virtual machine**. |
    | Virtual machine | Select the virtual machine that you want to troubleshoot the connection from. |
    | **Destination** |  |
    | Destination type | Select **Specify manually**. |
    | URI, FQDN, or IP address | Enter `www.bing.com`. |
    | **Probe Settings** |  |
    | Preferred IP version | Select **Both**. The other available options are: **IPv4** and **IPv6**. |
    | Protocol | Select **TCP**. The other available option is: **ICMP**. |
    | Destination port | Enter **443**. Port 443 for HTTPS. |
    | Source port | Leave blank or enter a source port number that you want to test. |
    | **Connection Diagnostic** |  |
    | Diagnostics tests | Select **Connectivity**. |

    :::image type="content" source="./media/connection-troubleshoot-portal/test-connectivity-bing.png" alt-text="Screenshot that shows connection troubleshoot in the Azure portal to test the connection between a virtual machine and Microsoft Bing website." lightbox="./media/connection-troubleshoot-portal/test-connectivity-bing.png":::

1. Select **Run diagnostic tests**.

    The test results show that `www.bing.com` is reachable from **VM1** virtual machine:

    - Connectivity test is successful with 66 probes sent with an average latency of 3 ms.

    :::image type="content" source="./media/connection-troubleshoot-portal/test-connectivity-bing-results.png" alt-text="Screenshot that shows connection troubleshoot results after testing the connection with Microsoft Bing search engine website.":::

1. Select **Export to CSV** to download the test results.

## Next step

> [!div class="nextstepaction"]
> [Manage packet captures](packet-capture-vm-portal.md)
