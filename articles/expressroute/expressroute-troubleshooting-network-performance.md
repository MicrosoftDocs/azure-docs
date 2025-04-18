---
title: 'Troubleshoot network link performance: Azure ExpressRoute'
description: This page provides a standardized method of testing Azure network link performance.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.topic: troubleshooting
ms.date: 01/31/2025
ms.author: duau
---
# Troubleshooting network performance

## Overview

Azure provides a stable and fast way to connect your on-premises network to Azure. Methods like Site-to-Site VPN and ExpressRoute are successfully used by customers of all sizes to run their businesses in Azure. But what happens when performance doesn't meet your expectations or previous experience? This article can help standardize the way you test and baseline your specific environment.

You will learn how to easily and consistently test network latency and bandwidth between two hosts. You will also receive advice on ways to look at the Azure network to help isolate problem points. The PowerShell script and tools discussed require two hosts on the network (at either end of the link being tested). One host must be a Windows Server or Desktop, and the other can be either Windows or Linux.

## Network components

Before digging into troubleshooting, let's discuss some common terms and components. This discussion ensures we're thinking about each component in the end-to-end chain that enables connectivity in Azure.

:::image type="content" source="./media/expressroute-troubleshooting-network-performance/network-components.png" alt-text="Diagram of a network routing domain between on-premises to Azure using ExpressRoute or VPN.":::

At the highest level, there are three major network routing domains:

- The Azure network (blue cloud)
- The Internet or WAN (green cloud)
- The Corporate Network (orange cloud)

Looking at the diagram from right to left, let's briefly discuss each component:

- **Virtual Machine** - The server might have multiple NICs. Ensure any static routes, default routes, and Operating System settings are sending and receiving traffic the way you think it is. Also, each VM SKU has a bandwidth restriction. If you're using a smaller VM SKU, your traffic is limited by the bandwidth available to the NIC. We recommend using a DS5v2 for testing to ensure adequate bandwidth at the VM.
 
- **NIC** - Ensure you know the private IP that is assigned to the NIC in question.
 
- **NIC NSG** - There might be specific NSGs applied at the NIC level. Ensure the NSG rule-set is appropriate for the traffic you're trying to pass. For example, ensure ports 5201 for iPerf, 3389 for RDP, or 22 for SSH are open to allow test traffic to pass.
 
- **VNet Subnet** - The NIC is assigned to a specific subnet. Ensure you know which one and the rules associated with that subnet.
 
- **Subnet NSG** - Just like the NIC, NSGs can be applied at the subnet level as well. Ensure the NSG rule-set is appropriate for the traffic you're trying to pass. For traffic inbound to the NIC, the subnet NSG applies first, then the NIC NSG. When traffic is going outbound from the VM, the NIC NSG applies first, then the Subnet NSG is applied.
 
- **Subnet UDR** - User-Defined Routes can direct traffic to an intermediate hop (like a firewall or load-balancer). Ensure you know if there's a UDR in place for your traffic. If so, understand where it goes and what that next hop will do to your traffic. For example, a firewall could pass some traffic and deny other traffic between the same two hosts.
 
- **Gateway subnet / NSG / UDR** - Just like the VM subnet, the gateway subnet can have NSGs and UDRs. Make sure you know if they're there and what effects they have on your traffic.
 
- **VNet Gateway (ExpressRoute)** - Once peering (ExpressRoute) or VPN is enabled, there aren't many settings that can affect how or if traffic routes. If you have a virtual network Gateway connected to multiple ExpressRoute circuits or VPN tunnels, you should be aware of the connection weight settings. The connection weight affects connection preference and determines the path your traffic takes.
 
- **Route Filter** (Not shown) - A route filter is necessary when using Microsoft Peering through ExpressRoute. If you're not receiving any routes, check if the route filter is configured and applied correctly to the circuit.

At this point, you're on the WAN portion of the link. This routing domain can be your service provider, your corporate WAN, or the Internet. There are many hops, devices, and companies involved with these links, which could make it difficult to troubleshoot. You need to first rule out both Azure and your corporate networks before you can investigate the hops in between.

In the preceding diagram, on the far left is your corporate network. Depending on the size of your company, this routing domain can be a few network devices between you and the WAN or multiple layers of devices in a campus/enterprise network.

Given the complexity of these three different high-level network environments, it's often optimal to start at the edges and try to show where performance is good and where it degrades. This approach can help identify the problem routing domain of the three. Then you can focus your troubleshooting on that specific environment.

## Tools

Most network issues can be analyzed and isolated using basic tools like ping and traceroute. It's rare you need to go as deep as a packet analysis using tools like Wireshark.

To help with troubleshooting, the Azure Connectivity Toolkit (AzureCT) was developed to put some of these tools in an easy package. For performance testing, tools like iPerf and PSPing can provide you with information about your network. iPerf is a commonly used tool for basic performance tests and is fairly easy to use. PSPing is a ping tool developed by SysInternals. PSPing can do both ICMP and TCP pings to reach a remote host. Both of these tools are lightweight and are "installed" simply by copying the files to a directory on the host.

These tools and methods are wrapped into a PowerShell module (AzureCT) that you can install and use.

### AzureCT - the Azure Connectivity Toolkit

The AzureCT PowerShell module includes two components: [Availability Testing][Availability Doc] and [Performance Testing][Performance Doc]. This document focuses on Performance Testing, specifically the two Link Performance commands in this PowerShell module.

Here are the three basic steps to use this toolkit for Performance Testing:

1. **Install the PowerShell Module**

    ```powershell
    (new-object Net.WebClient).DownloadString("https://aka.ms/AzureCT") | Invoke-Expression
    ```

    This command downloads and installs the PowerShell module locally.

2. **Install the Supporting Applications**

    ```powershell
    Install-LinkPerformance
    ```

    This AzureCT command installs iPerf and PSPing in a new directory `C:\ACTTools` and opens the Windows Firewall ports to allow ICMP and port 5201 (iPerf) traffic.

3. **Run the Performance Test**

    First, on the remote host, install and run iPerf in server mode. Ensure the remote host is listening on either 3389 (RDP for Windows) or 22 (SSH for Linux) and allowing traffic on port 5201 for iPerf. If the remote host is Windows, install AzureCT and run the Install-LinkPerformance command to set up iPerf and the necessary firewall rules.

    Once the remote machine is ready, open PowerShell on the local machine and start the test:

    ```powershell
    Get-LinkPerformance -RemoteHost 10.0.0.1 -TestSeconds 10
    ```

    This command runs a series of concurrent load and latency tests to estimate the bandwidth capacity and latency of your network link.

4. **Review the Test Output**

    The PowerShell output format looks similar to:

    :::image type="content" source="./media/expressroute-troubleshooting-network-performance/powershell-output.png" alt-text="Screenshot of PowerShell output of the Link Performance test.":::

    Detailed results of all the iPerf and PSPing tests are saved in individual text files in the AzureCT tools directory at `C:\ACTTools`.

## Troubleshooting

If the performance test results are not as expected, follow a systematic approach to identify the issue. Given the number of components in the path, a step-by-step process is more effective than random testing.

>[!NOTE]
>The scenario here is a performance issue, not a connectivity issue. To isolate connectivity problems to the Azure network, follow the [Verifying ExpressRoute connectivity](expressroute-troubleshooting-expressroute-overview.md) article.
>

1. **Challenge your assumptions**

    Ensure your expectations are reasonable. For example, with a 1-Gbps ExpressRoute circuit and 100 ms of latency, expecting the full 1 Gbps of traffic is unrealistic due to the performance characteristics of TCP over high latency links. Refer to the [References section](#references) for more on performance assumptions.

2. **Start at the edge of the network**

    Begin at the edges between routing domains and try to isolate the problem to a single major routing domain. Avoid blaming the "black box" in the path without thorough investigation, as this can delay resolution.

3. **Create a diagram**

    Draw a diagram of the area in question to methodically work through and isolate the problem. Plan testing points and update the map as you clear areas or dig deeper.

4. **Divide and conquer**

    Segment the network and narrow down the problem. Identify where it works and where it doesn't, and keep moving your testing points to isolate the offending component.

5. **Consider all OSI layers**

    While focusing on the network and layers 1-3 (Physical, Data, and Network layers) is common, remember that problems can also occur at Layer 7 (Application layer). Keep an open mind and verify all assumptions.

## Advanced ExpressRoute troubleshooting

Isolating Azure components can be challenging if you're unsure where the edge of the cloud is. With ExpressRoute, the edge is a network component called the Microsoft Enterprise Edge (MSEE). The MSEE is the first point of contact into Microsoft's network and the last hop when leaving it. When you create a connection between your virtual network gateway and the ExpressRoute circuit, you're connecting to the MSEE. Recognizing the MSEE as the first or last hop is crucial for isolating an Azure networking problem. Knowing the traffic direction helps determine if the issue is in Azure or further downstream in the WAN or corporate network.

:::image type="content" source="./media/expressroute-troubleshooting-network-performance/expressroute-troubleshooting.png" alt-text="Diagram of multiple virtual networks connected to an ExpressRoute circuit.":::

>[!NOTE]
> The MSEE isn't in the Azure cloud. ExpressRoute is at the edge of the Microsoft network, not actually in Azure. Once connected with ExpressRoute to an MSEE, you're connected to Microsoft's network, allowing access to cloud services like Microsoft 365 (with Microsoft Peering) or Azure (with Private and/or Microsoft Peering).

If two VNets are connected to the **same** ExpressRoute circuit, you can perform tests to isolate the problem in Azure.

### Test plan

1. Run the Get-LinkPerformance test between VM1 and VM2. This test provides insight into whether the problem is local. If the test produces acceptable latency and bandwidth results, you can mark the local virtual network as good.

2. Assuming the local virtual network traffic is good, run the Get-LinkPerformance test between VM1 and VM3. This test exercises the connection through the Microsoft network down to the MSEE and back into Azure. If the test produces acceptable latency and bandwidth results, you can mark the Azure network as good.

3. If Azure is ruled out, perform similar tests on your corporate network. If those tests are also good, work with your service provider or ISP to diagnose your WAN connection. For example, run tests between two branch offices or between your desk and a data center server. Find endpoints such as servers and client PCs that can exercise the path you're testing.

> [!IMPORTANT]
> For each test, mark the time of day and record the results in a common location. Each test run should have identical output for consistent data comparison. Consistency across multiple tests is the primary reason for using AzureCT for troubleshooting. The key is getting consistent test and data output every time. Recording the time and having consistent data is especially helpful if the issue is sporadic. Be diligent with data collection upfront to avoid hours of retesting the same scenarios.

## The problem is isolated, now what?

The more you isolate the problem, the faster the solution can be found. Sometimes you reach a point where you can't go further with troubleshooting. For example, you might see the link across your service provider taking hops through Europe when you expect it to remain in Asia. At this point, engage someone for help based on the routing domain you isolated the issue to. Narrowing it down to a specific component is even better.

For corporate network issues, your internal IT department or service provider can help with device configuration or hardware repair.

For WAN issues, share your testing results with your Service Provider or ISP to help them with their work and avoid redundant tasks. They may want to verify your results based on the principle of *trust but verify*.

For Azure issues, once you isolate the issue in as much detail as possible, review the [Azure Network Documentation][Network Docs] and, if needed, [open a support ticket][Ticket Link].

## References

### Latency/bandwidth expectations

>[!TIP]
> Geographic distance between endpoints is the largest factor in latency. While equipment latency (physical and virtual components, number of hops, etc.) also plays a role, the distance of the fiber run, not the straight-line distance, is the primary contributor. This distance is difficult to measure accurately, so we often use a city distance calculator for a rough estimate.

For example, we set up an ExpressRoute in Seattle, Washington, USA. The table below shows the latency and bandwidth observed when testing to various Azure locations, along with estimated distances.

Test setup:
- A physical server running Windows Server 2016 with a 10 Gbps NIC, connected to an ExpressRoute circuit.
- A 10 Gbps Premium ExpressRoute circuit with Private Peering enabled.
- An Azure virtual network with an UltraPerformance gateway in the specified region.
- A DS5v2 VM running Windows Server 2016 on the virtual network, using the default Azure image with AzureCT installed.
- All tests used the AzureCT Get-LinkPerformance command with a 5-minute load test for each of the six test runs. For example:

    ```powershell
    Get-LinkPerformance -RemoteHost 10.0.0.1 -TestSeconds 300
    ```
- The data flow for each test was from the on-premises server (iPerf client in Seattle) to the Azure VM (iPerf server in the listed Azure region).
- The "Latency" column shows data from the No Load test (a TCP latency test without iPerf running).
- The "Max Bandwidth" column shows data from the 16 TCP flow load test with a 1-Mb window size.

:::image type="content" source="./media/expressroute-troubleshooting-network-performance/test-diagram.png" alt-text="Diagram of testing environment in which AzureCT is installed.":::

### Latency/bandwidth results

>[!IMPORTANT]
> These numbers are for general reference only. Many factors affect latency, and while these values are generally consistent over time, conditions within Azure or the Service Provider's network can change, affecting latency and bandwidth. Generally, these changes don't result in significant differences.

| ExpressRoute Location | Azure Region     | Estimated Distance (km) | Latency | 1 Session Bandwidth | Maximum Bandwidth |
|-----------------------|------------------|-------------------------|---------|---------------------|-------------------|
| Seattle               | West US 2        | 191 km                  | 5 ms    | 262.0 Mbits/sec     | 3.74 Gbits/sec    |
| Seattle               | West US          | 1,094 km                | 18 ms   | 82.3 Mbits/sec      | 3.70 Gbits/sec    |
| Seattle               | Central US       | 2,357 km                | 40 ms   | 38.8 Mbits/sec      | 2.55 Gbits/sec    |
| Seattle               | South Central US | 2,877 km                | 51 ms   | 30.6 Mbits/sec      | 2.49 Gbits/sec    |
| Seattle               | North Central US | 2,792 km                | 55 ms   | 27.7 Mbits/sec      | 2.19 Gbits/sec    |
| Seattle               | East US 2        | 3,769 km                | 73 ms   | 21.3 Mbits/sec      | 1.79 Gbits/sec    |
| Seattle               | East US          | 3,699 km                | 74 ms   | 21.1 Mbits/sec      | 1.78 Gbits/sec    |
| Seattle               | Japan East       | 7,705 km                | 106 ms  | 14.6 Mbits/sec      | 1.22 Gbits/sec    |
| Seattle               | UK South         | 7,708 km                | 146 ms  | 10.6 Mbits/sec      | 896 Mbits/sec     |
| Seattle               | West Europe      | 7,834 km                | 153 ms  | 10.2 Mbits/sec      | 761 Mbits/sec     |
| Seattle               | Australia East   | 12,484 km               | 165 ms  | 9.4 Mbits/sec       | 794 Mbits/sec     |
| Seattle               | Southeast Asia   | 12,989 km               | 170 ms  | 9.2 Mbits/sec       | 756 Mbits/sec     |
| Seattle               | Brazil South *   | 10,930 km               | 189 ms  | 8.2 Mbits/sec       | 699 Mbits/sec     |
| Seattle               | South India      | 12,918 km               | 202 ms  | 7.7 Mbits/sec       | 634 Mbits/sec     |

\* The latency to Brazil is an example where the fiber run distance significantly differs from the straight-line distance. The expected latency would be around 160 ms, but it is actually 189 ms due to the longer fiber route.

>[!NOTE]
> These numbers were tested using AzureCT based on iPerf in Windows via PowerShell. iPerf does not honor default Windows TCP options for Scaling Factor and uses a lower Shift Count for the TCP Window size. By tuning iPerf commands with the `-w` switch and a larger TCP Window size, better throughput can be achieved. Running iPerf in multi-threaded mode from multiple machines can also help reach maximum link performance. To get the best iPerf results on Windows, use "Set-NetTCPSetting -AutoTuningLevelLocal Experimental". Check your organizational policies before making any changes.

## Next steps

- Download the [Azure Connectivity Toolkit](https://aka.ms/AzCT)
- Follow the instructions for [link performance testing](https://github.com/Azure/NetworkMonitoring/blob/master/AzureCT/PerformanceTesting.md)

<!--Link References-->
[Performance Doc]: https://github.com/Azure/NetworkMonitoring/blob/master/AzureCT/PerformanceTesting.md
[Availability Doc]: https://github.com/Azure/NetworkMonitoring/blob/master/AzureCT/AvailabilityTesting.md
[Network Docs]: ../index.yml
[Ticket Link]: https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview
