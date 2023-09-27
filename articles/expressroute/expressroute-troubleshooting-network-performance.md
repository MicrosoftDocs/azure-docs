---
title: 'Troubleshoot network link performance: Azure ExpressRoute'
description: This page provides a standardized method of testing Azure network link performance.
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: troubleshooting
ms.date: 08/25/2022
ms.author: duau
ms.custom: seodec18
---
# Troubleshooting network performance

## Overview

Azure provides a stable and fast way to connect your on-premises network to Azure. Methods like Site-to-Site VPN and ExpressRoute are successfully used by customers large and small to run their businesses in Azure. But what happens when performance doesn't meet your expectation or previous experience? This article can help standardize the way you test and baseline your specific environment.

You'll learn how to easily and consistently test network latency and bandwidth between two hosts. You'll also be provided some advice on ways to look at the Azure network to help isolate problem points. The PowerShell script and tools discussed require two hosts on the network (at either end of the link being tested). One host must be a Windows Server or Desktop, the other can be either Windows or Linux. 

## Network components

Before digging into troubleshooting, let's discuss some common terms and components. This discussion ensures we're thinking about each component in the end-to-end chain that enables connectivity in Azure.

:::image type="content" source="./media/expressroute-troubleshooting-network-performance/network-components.png" alt-text="Diagram of a network routing domain between on-premises to Azure using ExpressRoute or VPN.":::

At the highest level, there are three major network routing domains:

- The Azure network (blue cloud)
- The Internet or WAN (green cloud)
- The Corporate Network (orange cloud)

Looking at the diagram from right to left, let's discuss briefly each component:

 - **Virtual Machine** - The server may have multiple NICs. Ensure any static routes, default routes, and Operating System settings are sending and receiving traffic the way you think it is. Also, each VM SKU has a bandwidth restriction. If you're using a smaller VM SKU, your traffic is limited by the bandwidth available to the NIC. We recommend using a DS5v2 for testing to ensure adequate bandwidth at the VM.
 
 - **NIC** - Ensure you know the private IP that is assigned to the NIC in question.
 
 - **NIC NSG** - There may be specific NSGs applied at the NIC level, ensure the NSG rule-set is appropriate for the traffic you're trying to pass. For example, ensure ports 5201 for iPerf, 3389 for RDP, or 22 for SSH are open to allow test traffic to pass.
 
 - **VNet Subnet** - The NIC is assigned to a specific subnet, ensure you know which one and the rules associated with that subnet.
 
 - **Subnet NSG** - Just like the NIC, NSGs can be applied at the subnet as well. Ensure the NSG rule-set is appropriate for the traffic you're trying to pass. For traffic inbound to the NIC the subnet NSG applies first, then the NIC NSG. When traffic is going outbound from the VM, the NIC NSG applies first then the Subnet NSG is applied.
 
 - **Subnet UDR** - User-Defined Routes can direct traffic to an intermediate hop (like a firewall or load-balancer). Ensure you know if there's a UDR in place for your traffic. If so, understand where it goes and what that next hop will do to your traffic. For example, a firewall could pass some traffic and deny other traffic between the same two hosts.
 
 - **Gateway subnet / NSG / UDR** - Just like the VM subnet, the gateway subnet can have NSGs and UDRs. Make sure you know if they're there and what effects they have on your traffic.
 
 - **VNet Gateway (ExpressRoute)** - Once peering (ExpressRoute) or VPN is enabled, there aren't many settings that can affect how or if traffic routes. If you have a VNet Gateway connected to multiple ExpressRoute circuits or VPN tunnels, you should be aware of the connection weight settings. The connection weight affects connection preference and determines the path your traffic takes.
 
 - **Route Filter** (Not shown) - A route filter is necessary when using Microsoft Peering through ExpressRoute. If you're not receiving any routes, check if the route filter is configured and applied correctly to the circuit.

At this point, you're on the WAN portion of the link. This routing domain can be your service provider, your corporate WAN, or the Internet. There are many hops, devices, and companies involved with these links, which could make it difficult to troubleshoot. You need to first rule out both Azure and your corporate networks before you can investigate the hops in between.

In the preceding diagram, on the far left is your corporate network. Depending on the size of your company, this routing domain can be a few network devices between you and the WAN or multiple layers of devices in a campus/enterprise network.

Given the complexity of these three different high-level network environments. It's often optimal to start at the edges and try to show where performance is good, and where it degrades. This approach can help identify the problem routing domain of the three. Then you can focus your troubleshooting on that specific environment.

## Tools

Most network issues can be analyzed and isolated using basic tools like ping and traceroute. It's rare you need to go as deep as a packet analysis using tools like Wireshark. 

To help with troubleshooting, the Azure Connectivity Toolkit (AzureCT) was developed to put some of these tools in an easy package. For performance testing, tools like iPerf and PSPing can provide you information about your network. iPerf is a commonly used tool for basic performances tests and is fairly easy to use. PSPing is a ping tool developed by SysInternals. PSPing can do both ICMP and TCP pings to reach a remote host. Both of these tools are lightweight and are "installed" simply by coping the files to a directory on the host.

These tools and methods are wrapped into a PowerShell module (AzureCT) that you can install and use.

### AzureCT - the Azure Connectivity Toolkit

The AzureCT PowerShell module has two components [Availability Testing][Availability Doc] and [Performance Testing][Performance Doc]. This document is only concerned with Performance testing, so lets focus on the two Link Performance commands in this PowerShell module.

There are three basic steps to use this toolkit for Performance testing.

1. Installing the PowerShell Module.

    ```powershell
    (new-object Net.WebClient).DownloadString("https://aka.ms/AzureCT") | Invoke-Expression
    
    ```

    This command downloads the PowerShell module and installs it locally.

2. Install the supporting applications.

    ```powershell
    Install-LinkPerformance
    ```
    This AzureCT command installs iPerf and PSPing in a new directory "C:\ACTTools", it also opens the Windows Firewall ports to allow ICMP and port 5201 (iPerf) traffic.

3. Run the performance test.

    First, on the remote host you must install and run iPerf in server mode. Also ensure the remote host is listening on either 3389 (RDP for Windows) or 22 (SSH for Linux) and allowing traffic on port 5201 for iPerf. If the remote host is Windows, install the AzureCT and run the Install-LinkPerformance command. The command will set up iPerf and the firewall rules needed to start iPerf in server mode successfully. 
    
    Once the remote machine is ready, open PowerShell on the local machine and start the test:
    ```powershell
    Get-LinkPerformance -RemoteHost 10.0.0.1 -TestSeconds 10
    ```

    This command runs a series of concurrent load and latency tests to help estimate the bandwidth capacity and latency of your network link.

4. Review the output of the tests.

    The PowerShell output format looks similar to:

    :::image type="content" source="./media/expressroute-troubleshooting-network-performance/powershell-output.png" alt-text="Screenshot of PowerShell output of the Link Performance test.":::

    The detailed results of all the iPerf and PSPing tests are in individual text files in the AzureCT tools directory at "C:\ACTTools."

## Troubleshooting

If the performance test isn't giving you expected results, figuring out why should be a progressive step-by-step process. Given the number of components in the path, a systematic approach will provide a faster path to resolution than jumping around. By troubleshooting systematically, you can prevent doing unnecessary testing multiple times.

>[!NOTE]
>The scenario here is a performance issue, not a connectivity issue. To isolate the connectivity problem to Azure network, follow [Verifying ExpressRotue connectivity](expressroute-troubleshooting-expressroute-overview.md) article.
>

First, challenge your assumptions. Is your expectation reasonable? For instance, if you have a 1-Gbps ExpressRoute circuit and 100 ms of latency. It's not reasonable to expect the full 1 Gbps of traffic given the performance characteristics of TCP over high latency links. See the [References section](#references) for more on performance assumptions.

Next, we recommend starting at the edges between routing domains and try to isolate the problem to a single major routing domain. You can start at the Corporate Network, the WAN, or the Azure Network. People often blame the "black box" in the path. While blaming the black box is easy to do, it may significantly delay resolution. Especially if the problem is in an area that you can make changes to fix the issue. Make sure you do your due diligence before handing off to your service provider or ISP.

Once you've identified the major routing domain that appears to contain the problem, you should create a diagram of the area in question. When you draw out a diagram, you can methodically work through and isolate the problem. You can plan testing points, and update the map as you clear areas or dig deeper as the testing progresses.

Now that you have a diagram, start to divide the network into segments and narrow the problem down. Find out where it works and where it doesn't. Keep moving your testing points to isolate down to the offending component.

Also, don't forget to look at other layers of the OSI model. It's easy to focus on the network and layers 1 - 3 (Physical, Data, and Network layers) but the problems can also be up at Layer 7 in the application layer. Keep an open mind and verify assumptions.

## Advanced ExpressRoute troubleshooting

If you're not sure where the edge of the cloud actually is, isolating the Azure components can be a challenge. When ExpressRoute is used, the edge is a network component called the Microsoft Enterprise Edge (MSEE). **When using ExpressRoute**, the MSEE is the first point of contact into Microsoft's network, and the last hop when leaving the Microsoft network. When you create a connection object between your VNet gateway and the ExpressRoute circuit, you're actually making a connection to the MSEE. Recognizing the MSEE as the first or last hop depending on which direction the traffic is crucial to isolating an Azure networking problem. Knowing which direction will prove if the issue is in Azure or further downstream in the WAN or the corporate network. 

:::image type="content" source="./media/expressroute-troubleshooting-network-performance/expressroute-troubleshooting.png" alt-text="Diagram of multiple virtual networks connected to an ExpressRoute circuit.":::

>[!NOTE]
> Notice that the MSEE isn't in the Azure cloud. ExpressRoute is actually at the edge of the Microsoft network not actually in Azure. Once you're connected with ExpressRoute to an MSEE, you're connected to Microsoft's network, from there you can then go to any of the cloud services, like Microsoft 365 (with Microsoft Peering) or Azure (with Private and/or Microsoft Peering).
>

If two VNets are connected to the **same** ExpressRoute circuit, you can do a series of tests to isolate the problem in Azure.
 
### Test plan

1. Run the Get-LinkPerformance test between VM1 and VM2. This test provides insight to if the problem is local or not. If this test produces acceptable latency and bandwidth results, you can mark the local VNet network as good.

1. Assuming the local VNet traffic is good, run the Get-LinkPerformance test between VM1 and VM3. This test exercises the connection through the Microsoft network down to the MSEE and back into Azure. If this test produces acceptable latency and bandwidth results, you can mark the Azure network as good.

1. If Azure is ruled out, you can do a similar sequence of tests on your corporate network. If that also tests well, it's time to work with your service provider or ISP to diagnose your WAN connection. Example: Run this test between two branch offices, or between your desk and a data center server. Depending on what you're testing, find endpoints such as servers and client PCs that can exercise that path.

> [!IMPORTANT]
> It's critical that for each test you mark the time of day you run the test and record the results in a common location. Each test run should have identical output so you can compare the resultant data across test runs and not have "holes" in the data. Consistency across multiple tests is the primary reason we use the AzureCT for troubleshooting. The magic isn't in the exact load scenarios we run, but instead the *magic* is the fact that we get a *consistent test and data output* from each and every test. Recording the time and having consistent data every single time is especially helpful if you later find that the issue is sporadic. Be diligent with your data collection up front and you'll avoid hours of retesting the same scenarios.
>

## The problem is isolated, now what?

The more you isolate the problem the faster the solution can be found. Sometime you reach a point where you can't go any further with your troubleshooting. For example, you see the link across your service provider taking hops through Europe, but you expect the path to remain all in Asia. At this point, you should engage someone for help. Who you ask is dependent on the routing domain you isolate the issue to. If you can narrow it down to a specific component that would be even better.

For corporate network issues, your internal IT department or service provider can help with device configuration or hardware repair.

For the WAN, sharing your testing results with your Service Provider or ISP will help get them started. Doing so will also avoid duplicating the same work that you've already done. Don't be offended if they want to verify your results themselves. "Trust but verify" is a good motto when troubleshooting based on other people's reported results.

With Azure, once you isolate the issue in as much detail as you're able, it's time to review the [Azure Network Documentation][Network Docs] and then if still needed [open a support ticket][Ticket Link].

## References

### Latency/bandwidth expectations

>[!TIP]
> Geographic latency (miles or kilometers) between the end points you're testing is by far the largest component of latency. While there is equipment latency (physical and virtual components, number of hops, etc.) involved, geography has proven to be the largest component of overall latency when dealing with WAN connections. It's also important to note that the distance is the distance of the fiber run not the straight-line or road map distance. This distance is incredibly hard to get with any accuracy. As a result, we generally use a city distance calculator on the internet and know that this method is a grossly inaccurate measure, but is enough to set a general expectation.
>

For example, we got an ExpressRoute setup in Seattle, Washington in the USA. The following table shows the latency and bandwidth we saw testing to various Azure locations. We estimated the geographic distance between each end of the test.

Test setup:
 - A physical server running Windows Server 2016 with a 10 Gbps NIC, connected to an ExpressRoute circuit.
 - A 10Gbps Premium ExpressRoute circuit in the location identified with Private Peering enabled.
 - An Azure VNet with an UltraPerformance gateway in the specified region.
 - A DS5v2 VM running Windows Server 2016 on the VNet. The VM was non-domain joined, built from the default Azure image (no optimization or customization) with AzureCT installed.
 - All tests use the AzureCT Get-LinkPerformance command with a 5-minute load test for each of the six test runs. For example:

    ```powershell
    Get-LinkPerformance -RemoteHost 10.0.0.1 -TestSeconds 300
    ```
 - The data flow for each test had the load flowing from the on-premises physical server (iPerf client in Seattle) up to the Azure VM (iPerf server in the listed Azure region).
 - The "Latency" column data is from the No Load test (a TCP latency test without iPerf running).
 - The "Max Bandwidth" column data is from the 16 TCP flow load test with a 1-Mb window size.

:::image type="content" source="./media/expressroute-troubleshooting-network-performance/test-diagram.png" alt-text="Diagram of testing environment in which AzureCT is installed.":::

### Latency/bandwidth results

>[!IMPORTANT]
> These numbers are for general reference only. Many factors affect latency, and while these values are generally consistent over time, conditions within Azure or the Service Providers network can send traffic via different paths at any time, thus latency and bandwidth can be affected. Generally, the effects of these changes don't result in significant differences.
>

| ExpressRoute<br/>Location|Azure<br/>Region | Estimated<br/>Distance (km) | Latency|1 Session<br/>Bandwidth | Maximum<br/>Bandwidth |
| ------------------------------------------ | --------------------------- |  - | - | - | - |
| Seattle | West US 2        |    191 km |   5 ms | 262.0 Mbits/sec |  3.74 Gbits/sec |
| Seattle | West US          |  1,094 km |  18 ms |  82.3 Mbits/sec |  3.70 Gbits/sec |
| Seattle | Central US       |  2,357 km |  40 ms |  38.8 Mbits/sec |  2.55 Gbits/sec |
| Seattle | South Central US |  2,877 km |  51 ms |  30.6 Mbits/sec |  2.49 Gbits/sec |
| Seattle | North Central US |  2,792 km |  55 ms |  27.7 Mbits/sec |  2.19 Gbits/sec |
| Seattle | East US 2        |  3,769 km |  73 ms |  21.3 Mbits/sec |  1.79 Gbits/sec |
| Seattle | East US          |  3,699 km |  74 ms |  21.1 Mbits/sec |  1.78 Gbits/sec |
| Seattle | Japan East       |  7,705 km | 106 ms |  14.6 Mbits/sec |  1.22 Gbits/sec |
| Seattle | UK South         |  7,708 km | 146 ms |  10.6 Mbits/sec |   896 Mbits/sec |
| Seattle | West Europe      |  7,834 km | 153 ms |  10.2 Mbits/sec |   761 Mbits/sec |
| Seattle | Australia East   | 12,484 km | 165 ms |   9.4 Mbits/sec |   794 Mbits/sec |
| Seattle | Southeast Asia   | 12,989 km | 170 ms |   9.2 Mbits/sec |   756 Mbits/sec |
| Seattle | Brazil South *   | 10,930 km | 189 ms |   8.2 Mbits/sec |   699 Mbits/sec |
| Seattle | South India      | 12,918 km | 202 ms |   7.7 Mbits/sec |   634 Mbits/sec |

\* The latency to Brazil is a good example where the straight-line distance significantly differs from the fiber run distance. The expected latency would be in the neighborhood of 160 ms, but is actually 189 ms. The difference in latency would seem to indicate a network issue somewhere. But the reality is the fiber line doesn't go to Brazil in a straight line. So you should expect an extra 1,000 km or so of travel to get to Brazil from Seattle.

>[!NOTE]
>While these numbers should be taken into consideration, they were tested using AzureCT which is based in IPERF in Windows via PowerShell. In this scenario, IPERF does not honor default Windows TCP options for Scaling Factor and uses a much lower Shift Count for the TCP Window size. The numbers represented here were performed using default IPERF values and are for general reference only. By tuning IPERF commands with `-w` switch and a big TCP Window size, better throughput can be obtained over long distances, showing significantly better throughput figures. Also, to ensure an ExpressRoute is using the full bandwidth, it's ideal to run the IPERF in multi-threaded option from multiple machines simultaneously to ensure computing capacity is able to reach maximum link performance and is not limited by processing capacity of a single VM. To get the best Iperf results on Windows, use "Set-NetTCPSetting -AutoTuningLevelLocal Experimental". Please check your organizational policies before making any changes. 

## Next steps

- Download the [Azure Connectivity Toolkit](https://aka.ms/AzCT)
- Follow the instructions for [link performance testing](https://github.com/Azure/NetworkMonitoring/blob/master/AzureCT/PerformanceTesting.md)

<!--Link References-->
[Performance Doc]: https://github.com/Azure/NetworkMonitoring/blob/master/AzureCT/PerformanceTesting.md
[Availability Doc]: https://github.com/Azure/NetworkMonitoring/blob/master/AzureCT/AvailabilityTesting.md
[Network Docs]: ../index.yml
[Ticket Link]: https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview
