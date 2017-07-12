---
title: Azure Network Performance Testing | Microsoft Docs
description: This page provides a standardized method of testing network link performance.
services: expressroute
documentationcenter: na
author: tracsman
manager: rossort
editor: ''

ms.assetid: 
ms.service: expressroute
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 7/07/2017
ms.author: jonor

---
# Network Performance Testing
## Overview
Azure provides stable and fast ways to connect from your on-premise network to Azure. Methods like Site-to-Site VPN and ExpressRoute are successfully used by customers large and small to run their businesses in Azure. But what happens when performance doesn't meet your expectation or previous experience? This document can help standardize the way you test and baseline your specific environment.

This document will show a way that you can easily and consistently test network latency and bandwidth between two hosts. This document will also provide some advice on ways to look at the Azure network and help to isolate problem points. The PowerShell script and tools discussed require two hosts on the network (at either end of the link being tested). One host must be a Windows Server or Desktop, the other can be either Windows or Linux.

>[!NOTE]
>The approach to troubleshooting, the tools, and methods used can be very personal. This document describes the approach and tools I often take. Yours will probably differ and there's nothing wrong with that. However, if you don't have an established approach this document can get you started on the path to building your own methods, tools, and approach to troubleshooting network issues.
>
>

## Network Components
Before we dig into troubleshooting, let's discuss some common terms and components to ensure we're thinking about each component in the chain that enables connectivity in Azure.
[![1]][1]

At the highest level, I describe three major network environments the Azure network (blue cloud on the right), the Internet/WAN (green cloud in the center), and the Corporate Network (peach cloud on the left)

Looking at the diagram from right to left, let's discuss briefly each component:
 - **Virtual Machine** - The server may have multiple NICs, ensure any static routes, default routes, and OS settings are sending/receiving traffic the way you think it is. Also, each VM SKU has a bandwidth restriction. If you're using a smaller VM SKU your traffic will be limited by the bandwidth available to the NIC. I usually use a DS5v2 for testing (and then delete once done with testing to save money) to ensure adequate bandwidth at the VM.
 - **NIC** - Ensure you know the private IP that is assigned to the NIC in question.
 - **NIC NSG** - There may be specific NSGs applied at the NIC level, ensure the NSG rule-set is appropriate for the traffic you're trying to pass.
 - **VNet Subnet** - The NIC is assigned to a specific subnet, ensure you know which one and the rules associated with that subnet.
 - **Subnet NSG** - Just like the NIC, NSGs can be applied at the subnet as well. Ensure the NSG rule-set is appropriate for the traffic you're trying to pass. (for traffic inbound to the NIC the subnet NSG will apply first, then the NIC NSG, conversely for traffic outbound from the VM the NIC NSG will apply first then the Subnet NSG comes into play).
 - **Subnet UDR** - User defined routes can direct traffic to an intermediate hop (like a firewall or load-balancer). Ensure you know if there is a UDR in place for your traffic and if so where it goes and what that next hop will do to your traffic. (e.g. a firewall could pass some traffic and deny other traffic between the same two hosts).
 - **Gateway subnet / NSG / UDR** - Just like the VM subnet, the gateway subnet can have NSGs and UDRs. Make sure you know if they are there and what affect they will have on your traffic.
 - **VNet Gateway (ExpressRoute)** - Once peering (ExpressRoute) or VPN is enabled, there aren't many settings that can affect how or if traffic routes. You should be aware of connection weight settings if you have multiple ExpressRoute circuits or VPN tunnels connected to the same VNet Gateway as this can affect connection preference.

At this point you're on the WAN portion of the link. This can be your service provider, your corporate WAN, or the Internet. Many hops, technologies, and companies involved with these links can make it somewhat difficult to troubleshoot. Often, you'll work to rule out both Azure and your Corporate Networks first before jumping into this collection of companies and hops.

On the far left is your corporate network. Depending on the size of your company this can be a few network devices between you and the WAN or multiple layers of devices in a campus/enterprise network.

Given the complexities of these three different high level network environments, it's often optimal to start at the edges and try to show where performance is good, and where it degrades. This can help identify the problem network of the three and then focus your troubleshooting on that environment.

## Tools
Most network issues can be analyzed and isolated using basic tools like ping and traceroute. It's rare that you'll need to go as deep as a packet analysis like Wireshark. To help with this the Azure Connectivity Toolkit (AzureCT) was developed to put some of these tools in an easy package. For performance testing, I like to use iPerf and PSPing. iPerf is a commonly used tool and runs on most OS, it's good for basic performances tests and is fairly easy to use. PSPing is a ping tool developed by SysInternals and is an easy way to perform ICMP and TCP pings in one also easy to use command. Both of these tools are light weight and are "installed" simply by coping the files to a directory on the local windows host.

I've wrapped all of this in a PowerShell module (AzureCT) that you can easily install and use.

### AzureCT - The Azure Connectivity Toolkit
The AzureCT PowerShell module has two components [Availability Testing][Availability Doc] and [Performance Testing][Performance Doc]. This document is only concerned with Performance testing, so we'll focus on those two commands in the PowerShell module.

There are three basic steps to use this toolkit for Performance testing. 1) Install the PowerShell module, 2) Install the supporting applications iPerf and PSPing 3) Run the performance test.

1. Installing the PowerShell Module

	```powershell
	(new-object Net.WebClient).DownloadString("https://aka.ms/AzureCT") | Invoke-Expression
	
	```

	This will download the powershell module and install it localy.

2. Install the supporting applications
	```powershell
	Install-LinkPerformance
	```
	This command will run a command from the PowerShell module that will install iPerf and PSPing in a new directory "C:\ACTTools", it will also open the Windows Firewall ports to allow ICMP and port 5201 (iPerf) traffic.

3. Run the performance test
	First, on the remote host you must install and run iPerf in server mode. Also ensure the remote host is listening on either 3389 (RDP for Windows) or 22 (SSH for Linux) and allowing traffic on port 5201 for iPerf. If the remote host is windows, install the AzureCT and running the Install-LinkPerformance command will setup iPerf and the firewall rules needed to start iPerf in server mode successfully. 
	
	Once the remote machine is ready, open PowerShell on the local machine and start the test:
	```powershell
	Get-LinkPerformance -RemoteHost 10.0.0.1 -TestSeconds 10
	```

This will run a series of concurrent load and latency tests to help estimate the bandwidth capacity and latency of your network link.

## Troubleshooting
If the performance test is not giving you expected results, figuring out why should be a progressive step-by-step process. Given the number of components in the path, a systematic approach will generally provide a faster path to resolution than jumping around and potentially needlessly doing the same testing multiple times.

>[!NOTE]
>The scenario here is a performance issue, not a connectivity issue. The steps would be different if traffic wasn't passing at all.
>
>

First, challenge your assumptions. Is your expectation reasonable. For instance, if you have a 1Gps ExpressRoute circuit and 100ms of latency it's unreasonable to expect the full 1Gbps of traffic given the performance characteristics of TCP over high latency links. See the [References section](#references) for more on performance assumptions.

Next I recommend starting at the edges between routing domains and try to isolate the problem to a single major routing domain; the Corporate Network, the WAN, or the Azure Network. People will often blame the "black box" in the path, while this is easy to do, it may significantly delay resolution especially if the problem is actually in an area that you have the ability to make changes. Make sure you do your due diligence before handing of to your service provider or ISP.

Once you've identified the major routing domain that appears to contain the problem, I like to create a picture of the area in question. Either on a whiteboard, notepad, or Visio, a diagram will provide a concrete "battle map" to allow the methodical approach to further isolate the problem.

Now that you have a diagram, start to divide the network into segments and narrow the problem down. Find out where it works and where it doesn't. Keep moving your testing points to isolate down to the offending component.

Also, don't forget to look at other layers of the OSI model. It's easy to focus on the network and layers 1 - 3 (Physical, Data, and Network layers) but the problems can also be up at Layer 7 in the application layer. Keep an open mind and verify assumptions.

## Advanced ExpressRoute Troubleshooting
Isolating all Azure components can be a challenge if you're not sure where the edge of the cloud actually is. With ExpressRoute, it's a network component called the Microsoft Enterprise Edge. **For ExpressRoute**, this is the first point of contact into Microsoft's network, and the last hop leaving the Microsoft network. When you create a connection object between your VNet gateway and the ExpressRoute circuit, you're actually making a connection to the MSEE. Understanding this is crucial to isolating Azure Network problems to either prove the issue is in Azure or further downstream in the WAN or the Corporate Network. 

[![2]][2]

>[!NOTE]
> Notice that the MSEE isn't in the Azure cloud. ExpressRoute is actually at the edge of the Microsoft network not actually in Azure. From that MSEE as a connection point to Microsoft's network, you can then go to any of the cloud services, like Office 365 or Azure.
>
>

If two VNets (VNets A and B in the diagram) are connected to the **same** ExpressRoute circuit, you can perform a series of tests to isolate the problem in Azure (or prove it's not in Azure)
 
### Test Plan
1. Run the Get-LinkPerformance test between VM1 and VM2. This will provide insight to if the problem is local or not. If this test produces acceptable latency and bandwidth results you can mark the local network as good.
2. Assuming the local VNet traffic is good, run the Get-LinkPerformance test between VM1 and VM3. This will exercise the connection through the Microsoft network down to the MSEE and back into Azure. If this test produces acceptable latency and bandwidth results you can mark the Azure network as good.
3. If Azure is ruled out, you can perform a similar sequence of tests on your Corporate Network. If that also tests well, it's time to work with your service provider or ISP to diagnose your WAN connection.

>[!IMPORTANT]
> It's critical that for each test you mark the time of day you run the test and record the results in a common location (I like OneNote or Excel). Each test run should have identical output so you can compare the resultant data across test runs and not have "holes" in the data. This is the primary reason I use the AzureCT for troubleshooting. The magic isn't in the exact load scenarios I run, but instead the *magic* is the fact that I get a consistent test and data output from each and every test. Recording the time and having consistent data every single time is especially helpful if you later find that the issue is sporadic. Be diligent with your data collection up front and you'll avoid hours of re-testing the same scenarios (I learned this hard way many years ago).
>
>

## The Problem is isolated, now what?
The more you can isolate the problem the easier it will be to fix, however quite often you'll reach the point where you can't go deeper or further with your troubleshooting. This is where you can reach out for help. Who you ask will be dependent on the routing domain you've isolated the issue too, and even better if you've been able to narrow it down to a specific component.

For corporate network issues, your internal IT department or service provider supporting your network (which may be the hardware manufacturer) may be able to help with device configuration or hardware repair.

For the WAN, sharing your testing results with your Service Provider or ISP may help get them started and avoid covering some of the same ground you've tested already (although they may also want to verify your results themselves, don't be offended, "trust but verify" is a good motto when troubleshooting based on other people's reported results).

With Azure, once you isolated the issue in a much detailed as you're able, it's time to review the [Azure Network Documentation][Network Docs] and then if still needed [open a support ticket][Ticket Link].

## References
### Latency/Bandwidth Expectations
>[!TIP]
> Geographic latency (miles or kilometers) between the end points you're testing is by far the largest component of latency. While there is equipment latency (physical and virtual components, number of hops, etc) involved, geography has proven to be the largest component of overall latency when dealing with WAN connections. It's also important to note that the distance is the distance of the fiber run, not the straight line or road map distance. This is incredibly hard to get with any accuracy. As a result, I use a city distance calculator on the internet and know that this is a grossly inaccurate measure, but is enough to set a general expectation.
>
>

I've got an ExpressRoute setup in Seattle, Washington and Washington, D.C., both in the USA. The below table shows the latency and bandwidth I saw testing to various Azure locations. I've estimated the geographic distance between each end of the test.

Test setup:
 - A physical server running Windows Server 2016 with a 10Gb NIC, connected to an ExpressRoute circuit.
 - A 10Gbps Premium ExpressRoute circuit to the location identified with Private Peering enabled.
 - An Azure VNet with an UltraPerformance gateway in the specified region.
 - A DS5v2 VM running Windows Server 2016 on the VNet.
 - All testing was using the AzureCT Get-LinkPerformance command with a 1 minute load test for each of the 6 test runs e.g.
	```powershell
	Get-LinkPerformance -RemoteHost 10.0.0.1 -TestSeconds 60
	```
 - The data recorded below is from the 16 TCP flow load test with the load flowing from the on-premises physical server (local, iPerf client) up to the Azure VM (remote, iPerf server).

### Latency/Bandwidth Results
| | | | | |
|-|-|-|-|-|
|ExpressRoute<br/>Location|Azure<br/>Region|Estimated<br/>Distance (km)|Latency|Bandwidth|
|Seattle                  |East US         |                      |       |         |
|Seattle                  |East US 2       |                      |       |         |
|Seattle                  |Central US      |                      |       |         |
|Seattle                  |North Central US|                      |       |         |
|Seattle                  |South Central US|                      |       |         |
|Seattle                  |West US         |                      |       |         |
|Seattle                  |West US 2       |                      |       |         |
|Seattle                  |Brazil South    |                      |       |         |
|Seattle                  |West Europe     |                      |       |         |
|Seattle                  |UK South        |                      |       |         |
|Seattle                  |Southeast Asia  |                      |       |         |
|Seattle                  |Australia East  |                      |       |         |
|Seattle                  |South India     |                      |       |         |
|Seattle                  |Japan East      |                      |       |         |
|Washington, D.C.         |East US         |                      |       |         |
|Washington, D.C.         |East US 2       |                      |       |         |
|Washington, D.C.         |Central US      |                      |       |         |
|Washington, D.C.         |North Central US|                      |       |         |
|Washington, D.C.         |South Central US|                      |       |         |
|Washington, D.C.         |West US         |                      |       |         |
|Washington, D.C.         |West US 2       |                      |       |         |
|Washington, D.C.         |Brazil South    |                      |       |         |
|Washington, D.C.         |West Europe     |                      |       |         |
|Washington, D.C.         |UK South        |                      |       |         |
|Washington, D.C.         |Southeast Asia  |                      |       |         |
|Washington, D.C.         |Australia East  |                      |       |         |
|Washington, D.C.         |South India     |                      |       |         |
|Washington, D.C.         |Japan East      |                      |       |         |


## Next Steps

<!--Image References-->
[1]: ./media/expressroute-troubleshooting-network-performance/network-components.png "Azure Network Components"
[2]: ./media/expressroute-troubleshooting-network-performance/expressroute-troubleshooting.png "ExpressRoute Troubleshooting"

<!--Link References-->
[Performance Doc]: https://github.com/Azure/NetworkMonitoring/blob/master/AzureCT/PerformanceTesting.md
[Availability Doc]: https://github.com/Azure/NetworkMonitoring/blob/master/AzureCT/AvailabilityTesting.md
[Network Docs]: https://docs.microsoft.com/azure/index#pivot=services&panel=network
[Ticket Link]: https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview

