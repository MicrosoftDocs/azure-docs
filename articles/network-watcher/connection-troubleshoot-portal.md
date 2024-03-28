---
title: Troubleshoot outbound connections - Azure portal
titleSuffix: Azure Network Watcher
description: Learn how to use the connection troubleshoot feature of Azure Network Watcher to troubleshoot outbound connections using the Azure portal.
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.date: 03/20/2024

#CustomerIntent: As an Azure administrator, I want to learn how to use Connection Troubleshoot to diagnose outbound connectivity issues in Azure using the Azure portal.
---

# Troubleshoot outbound connections using the Azure portal

In this article, you learn how to use the connection troubleshoot feature of Azure Network Watcher to diagnose and troubleshoot connectivity issues. For more information about connection troubleshoot, see [Connection troubleshoot overview](connection-troubleshoot-overview.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Network Watcher enabled in the region of the virtual machine (VM) you want to troubleshoot. By default, Azure enables Network Watcher in a region when you create a virtual network in it. For more information, see [Enable or disable Azure Network Watcher](network-watcher-create.md).

- A virtual machine with Network Watcher agent VM extension installed on it and has the following outbound TCP connectivity:
    - to 169.254.169.254 over port 80
    - to 168.63.129.16 over port 8037

- A second virtual machine with inbound TCP connectivity from 168.63.129.16 over the port being tested (for Port scanner diagnostic test).

> [!NOTE]
> When you use connection troubleshoot, Azure portal automatically installs the Network Watcher agent VM extension on the source virtual machine if it's not already installed.
> - To install the extension on a Windows virtual machine, see [Network Watcher agent VM extension for Windows](../virtual-machines/extensions/network-watcher-windows.md?toc=/azure/network-watcher/toc.json&bc=/azure/network-watcher/breadcrumb/toc.json).
> - To install the extension on a Linux virtual machine, see [Network Watcher agent VM extension for Linux](../virtual-machines/extensions/network-watcher-linux.md?toc=/azure/network-watcher/toc.json&bc=/azure/network-watcher/breadcrumb/toc.json).
> - To update an already installed extension, see [Update Network Watcher agent VM extension to the latest version](../virtual-machines/extensions/network-watcher-update.md?toc=/azure/network-watcher/toc.json&bc=/azure/network-watcher/breadcrumb/toc.json).

## Test connectivity to a virtual machine

In this section, you test the remote desktop port (RDP) connectivity from one virtual machine to another virtual machine in the same virtual network.

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
    | Destination port | Enter **3389**. Port 3389 is the default port for RDP. |
    | Source port | Leave blank or enter a source port number that you want to test. |
    | **Connection Diagnostic** |  |
    | Diagnostics tests | Select **Connectivity**, **NSG diagnostic**, **Next hop**, and **Port scanner**. |

    :::image type="content" source="./media/connection-troubleshoot-portal/test-connectivity-vm.png" alt-text="Screenshot that shows Network Watcher connection troubleshoot in Azure portal to test the connection between two virtual machines." lightbox="./media/connection-troubleshoot-portal/test-connectivity-vm.png":::

1. Select **Run diagnostic tests**.

    - If the two virtual machines are communicating with no issues, you see the following results: 

        :::image type="content" source="./media/connection-troubleshoot-portal/connectivity-allowed.png" alt-text="Screenshot that shows connection troubleshoot results after testing the connection between two virtual machines that are communicating with no issues.":::

        - 66 probes were successfully sent to the destination virtual machine. Select **See details** to see the next hop details.
        - Outbound connectivity from the source virtual machine is allowed. Select **See details** to see the security rules that are allowing the outbound communication from the source virtual machine.
        - Inbound connectivity to the destination virtual machine is allowed. Select **See details** to see the security rules that are allowing the inbound communication to the destination virtual machine.
        - Azure default system route is used to route traffic between the two virtual machines (Route table ID: System route).
        - Port 3389 is reachable on the destination virtual machine.

    - If the destination virtual machine has a network security group that's denying incoming RDP connections, you see the following results: 

        :::image type="content" source="./media/connection-troubleshoot-portal/connectivity-denied-destination.png" alt-text="Screenshot that shows connection troubleshoot results after testing the connection to a virtual machine that has a denying inbound security rule.":::

        - 30 probes were sent and failed to reach the destination virtual machine. Select **See details** to see the next hop details.
        - Outbound connectivity from the source virtual machine is allowed. Select **See details** to see the security rules that are allowing the outbound communication from the source virtual machine.
        - Inbound connectivity to the destination virtual machine is denied. Select **See details** to see the security rule that is denying the inbound communication to the destination virtual machine.
        - Azure default system route is used to route traffic between the two virtual machines (Route table ID: System route).
        - Port 3389 is unreachable on the destination virtual machine because of the security rule that is denying inbound communication to the destination port.
        
        **Solution**: Update the network security group on the destination virtual machine to allow inbound RDP traffic.

    - If the source virtual machine has a network security group that's denying RDP connections to the destination, you see the following results: 

        :::image type="content" source="./media/connection-troubleshoot-portal/connectivity-denied-source.png" alt-text="Screenshot that shows connection troubleshoot results after testing the connection from a virtual machine that has a denying outbound security rule.":::

        - 30 probes were sent and failed to reach the destination virtual machine. Select **See details** to see the next hop details.
        - Outbound connectivity from the source virtual machine is denied. Select **See details** to see security rule that is denying the outbound communication from the source virtual machine.
        - Inbound connectivity to the destination virtual machine is allowed. Select **See details** to see the security rules that are allowing the inbound communication to the destination virtual machine.
        - Azure default system route is used to route traffic between the two virtual machines (Route table ID: System route).
        - Port 3389 is reachable on the destination virtual machine.
        
        **Solution**: Update the network security group on the source virtual machine to allow outbound RDP traffic.

    - If the operating system on the destination virtual machine doesn't accept incoming connections on port 3389, you see the following results: 

        :::image type="content" source="./media/connection-troubleshoot-portal/connectivity-denied-destination-port.png" alt-text="Screenshot that shows connection troubleshoot results after testing the connection to a virtual machine that isn't listening on the tested port.":::

        - 30 probes were sent and failed to reach the destination virtual machine. Select **See details** to see the next hop details.
        - Outbound connectivity from the source virtual machine is allowed. Select **See details** to see the security rules that are allowing the outbound communication from the source virtual machine.
        - Inbound connectivity to the destination virtual machine is allowed. Select **See details** to see the security rules that are allowing the inbound communication to the destination virtual machine.
        - Azure default system route is used to route traffic between the two virtual machines (Route table ID: System route).
        - Port 3389 isn't reachable on the destination virtual machine (port 3389 on the operating system isn't accepting incoming RDP connections).
        
        **Solution**: Configure the operating system on the destination virtual machine to accept inbound RDP traffic.

1. Select **Export to CSV** to download the test results in csv format.

## Test connectivity to a web address

In this section, you test the connectivity between a virtual machine and a web address.

1. On the **Connection troubleshoot** page. Enter or select the following information:

    | Setting | Value  |
    | ------- | ------ |
    | **Source** |  |
    | Source type | Select **Virtual machine**. |
    | Virtual machine | Select the virtual machine that you want to troubleshoot the connection from. |
    | **Destination** |  |
    | Destination type | Select **Specify manually**. |
    | URI, FQDN, or IP address | Enter the web address that you want to test the connectivity to. In this example, `www.bing.com` is used. |
    | **Probe Settings** |  |
    | Preferred IP version | Select **Both**. The other available options are: **IPv4** and **IPv6**. |
    | Protocol | Select **TCP**. The other available option is: **ICMP**. |
    | Destination port | Enter **443**. Port 443 for HTTPS. |
    | Source port | Leave blank or enter a source port number that you want to test. |
    | **Connection Diagnostic** |  |
    | Diagnostics tests | Select **Connectivity**. |

    :::image type="content" source="./media/connection-troubleshoot-portal/test-connectivity-bing.png" alt-text="Screenshot that shows connection troubleshoot in the Azure portal to test the connection between a virtual machine and Microsoft Bing website." lightbox="./media/connection-troubleshoot-portal/test-connectivity-bing.png":::

1. Select **Run diagnostic tests**.

    - If `www.bing.com` is reachable from the source virtual machine, you see the following results: 

        :::image type="content" source="./media/connection-troubleshoot-portal/test-connectivity-bing-reachable.png" alt-text="Screenshot that shows connection troubleshoot results after testing the connection with Microsoft Bing website.":::

        66 probes were successfully sent to `www.bing.com`. Select **See details** to see the next hop details.

    - If `www.bing.com` is unreachable from the source virtual machine due to a security rule, you see the following results: 

        :::image type="content" source="./media/connection-troubleshoot-portal/test-connectivity-bing-unreachable.png" alt-text="Screenshot that shows connection troubleshoot results after unsuccessfully testing the connection with Microsoft Bing website.":::

        30 probes were sent and failed to reach `www.bing.com`. Select **See details** to see the next hop details and the cause of the error.

        **Solution**: Update the network security group on the source virtual machine to allow outbound traffic to `www.bing.com`.

1. Select **Export to CSV** to download the test results in csv format.

## Test connectivity to an IP address

In this section, you test the connectivity between a virtual machine and an IP address of another virtual machine.

1. On the **Connection troubleshoot** page. Enter or select the following information:

    | Setting | Value  |
    | ------- | ------ |
    | **Source** |  |
    | Source type | Select **Virtual machine**. |
    | Virtual machine | Select the virtual machine that you want to troubleshoot the connection from. |
    | **Destination** |  |
    | Destination type | Select **Specify manually**. |
    | URI, FQDN, or IP address | Enter the IP address that you want to test the connectivity to. In this example, `10.10.10.10` is used. |
    | **Probe Settings** |  |
    | Preferred IP version | Select **IPv4**. The other available options are: **Both** and **IPv6**. |
    | Protocol | Select **TCP**. The other available option is: **ICMP**. |
    | Destination port | Enter **3389**. |
    | Source port | Leave blank or enter a source port number that you want to test. |
    | **Connection Diagnostic** |  |
    | Diagnostics tests | Select **Connectivity**, **NSG diagnostic**, and **Next hop**. |

    :::image type="content" source="./media/connection-troubleshoot-portal/test-connectivity-ip.png" alt-text="Screenshot that shows connection troubleshoot in the Azure portal to test the connection between a virtual machine and an IP address." lightbox="./media/connection-troubleshoot-portal/test-connectivity-ip.png":::

1. Select **Run diagnostic tests**.

    - If the IP address is reachable, you see the following results: 

        :::image type="content" source="./media/connection-troubleshoot-portal/ip-reachable.png" alt-text="Screenshot that shows connection troubleshoot results after testing the connection to a reachable IP address.":::

        - 66 probes were successfully sent with average latency of 4 ms. Select **See details** to see the next hop details.
        - Outbound connectivity from the source virtual machine is allowed. Select **See details** to see the security rules that are allowing the outbound communication from the source virtual machine.
        - Azure default system route is used to route traffic to the IP address, which is in the same virtual network or a peered virtual network. (Route table ID: System route and Next hop type: Virtual Network).

    - If the IP address is unreachable because the destination virtual machine isn't running, you see the following results: 

        :::image type="content" source="./media/connection-troubleshoot-portal/ip-unreachable-vm-stopped.png" alt-text="Screenshot that shows connection troubleshoot results after testing the connection to an IP address of a stopped virtual machine.":::

        - 30 probes were sent and failed to reach the destination virtual machine. Select **See details** to see the next hop details.
        - Outbound connectivity from the source virtual machine is allowed. Select **See details** to see the security rules that are allowing the outbound communication from the source virtual machine.
        - Azure default system route is used to route traffic to the IP address, which is in the same virtual network or a peered virtual network. (Route table ID: System route and Next hop type: Virtual Network).
        
        **Solution**: Start the destination virtual machine.

    - If there's no route to the IP address in the routing table of the source virtual machine (for example, the IP address isn't in the address space of the VM's virtual network or its peered virtual networks), you see the following results: 

        :::image type="content" source="./media/connection-troubleshoot-portal/ip-unreachable-route-table.png" alt-text="Screenshot that shows connection troubleshoot results after testing the connection to unreachable IP address with no route in the routing table.":::

        - 30 probes were sent and failed to reach the destination virtual machine. Select **See details** to see the next hop details.
        - Outbound connectivity from the source virtual machine is denied. Select **See details** to see security rule that is denying the outbound communication from the source virtual machine.
        - Next hop type is *None* because there isn't a route to the IP address.
        
        **Solution**: Associate a route table with a correct route to the subnet of the source virtual machine.

1. Select **Export to CSV** to download the test results in csv format.

## Next step

> [!div class="nextstepaction"]
> [Manage packet captures](packet-capture-vm-portal.md)
