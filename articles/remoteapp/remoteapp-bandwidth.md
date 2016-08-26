
<properties 
    pageTitle="Estimate Azure RemoteApp network bandwidth usage | Microsoft Azure"
	description="Learn about the network bandwidth requirements for your Azure RemoteApp collections and apps."
	services="remoteapp"
	documentationCenter="" 
	authors="lizap" 
	manager="mbaldwin" />

<tags 
    ms.service="remoteapp" 
    ms.workload="compute" 
    ms.tgt_pltfrm="na" 
    ms.devlang="na" 
    ms.topic="article" 
    ms.date="06/27/2016" 
    ms.author="elizapo" />

# Estimate Azure RemoteApp network bandwidth usage 

Azure RemoteApp uses the Remote Desktop Protocol (RDP) to communicate between applications running in the Azure cloud and your users. This article provides some basic guidelines you can use to estimate that network usage and potentially evaluate network bandwidth usage per Azure RemoteApp user.

Estimating bandwidth usage per user is very complex and requires running multiple applications simultaneously in multitasking scenarios where applications might impact each other's performance based on their demand for network bandwidth. Even the type of Remote Desktop client (such as Mac client versus HTML5 client) can lead to different bandwidth results. To help you work through these complications, we'll break the usage scenarios into several of the common categories to replicate real-world scenarios. (Where the real-world scenario is, of course, a mix of categories and differs by user.)

Before we go further - note that we assume RDP provides a good to excellent experience for most usage scenarios on networks with latency below 120 ms and bandwidth over 5 MBs - this is based on RDP's ability to dynamically adjust by using the available network bandwidth and the estimated application bandwidth needs. This article goes beyond those "most usage scenarios" to look at the edge, where scenarios begin to unwind and user experience begins to degrade.

Now check out the following articles for the details, including factors to consider, baseline recommendations, and what we did not include in our estimates.

- [How do network bandwidth and quality of experience work together?](remoteapp-bandwidthexperience.md)
- [Testing your network bandwidth usage with some common scenarios](remoteapp-bandwidthtests.md)
- [Quick guidelines if you don't have the time or ability to test](remoteapp-bandwidthguidelines.md)


## What are we not including?

When you review the proposed tests and our overall (and admittedly generic) recommendations, be aware that there are several factors that we did not consider. For example, the user experience complications provided by the asymmetric nature of upload vs. download bandwidth. The asymmetric nature of most Wi-Fi networks will additionally impact the performance and the user experience perception. For interactive scenarios the downstream traffic may be prioritized lower than the upstream, which may increase the number of lost video or audio frames and therefore impact the user perception of the streaming experience. You can run your own experiments to see what is good for your specific use case and network.

Although we discuss device redirection, we did not take into consideration the bandwidth impact of the network traffic caused by attached devices, like storage, printers, scanners, web cameras, and other USB devices. The effect of those devices usually spikes the bandwidth needs temporarily and goes away when the task is complete. But if done frequently, that bandwidth demand could be quite noticeable.

We also do not discuss how one user can impact other users within the same network. For example, one user consuming 4K video on a 100 MB/s network might significantly impact other users on that same network trying to do the same task. Unfortunately it gets progressively harder to determine the impact of concurrent usage to give a common or all-encompassing recommendation about how the system performs at aggregate. All we can say is that the underlying protocol technology will make the best use of the available network bandwidth, but it does have its limitations.