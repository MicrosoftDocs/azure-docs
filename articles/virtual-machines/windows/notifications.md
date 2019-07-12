---
title: Setup maintenance notifications for your Windows VMs in Azure | Microsoft Docs
description: Learn how to setup scheduled maintenance notifications for your Azure virtual machines.
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: gwallace

ms.service: virtual-machines-windows
ms.tgt_pltfrm: vm-windows
ms.date: 07/11/2019
ms.author: cynthn
ms.topic: conceptual
---

# Setup notifications about maintenance affecting your VM

Updates are applied to different parts of Azure every day,  to keep the fleet and the services running on them secure and up to date. In addition to these planned updates, unplanned events may also occur, for example, if any hardware degradation or fault is detected. Making sure that Azure Virtual machines are not impacted in the process is our top priority. Through Live Migration, Memory Preserving updates and in general keeping a strict bar on the impact of updates, in most cases these events are almost transparent to customers, and they have no impact or at most cause a few seconds of virtual machine freeze. However, for some particular applications, even a few seconds of virtual machine freeze could cause impact and hence knowing in advance about upcoming Azure maintenance is important, to ensure the best experience for those applications. Scheduled Events provides you a programmatic interface to be notified about upcoming maintenance and enables you to gracefully handle the maintenance. 

In this article, we will show how you can leverage scheduled events to be notified about maintenance events that could be affecting your VMs and build some basic automation that can help with monitoring and analysis.


## Routing scheduled events to Log Analytics

Scheduled Events is available as part of the Azure Instance Metadata Service which is available on every Azure virtual machine. Customers can write automation to query the endpoint in their virtual machines to discover scheduled Azure maintenance and perform automated mitigations, such as saving state and taking the virtual machine out of rotation. We see some customers build automation to ensure high availability and that is our recommendation for how to use Scheduled Events. Some others take a first step to record the Scheduled Events received, so they can have an auditing log of Azure maintenance events with non-zero impact, or customer-initiated actions that can affect their virtual machines. 
In this blog, we will walk you step by step on how to capture maintenance Scheduled Events to Log Analytics, and from there trigger some basic notification actions, basic automation like sending an email to your DevOps team , or easily get a historical view of all events that have affected your virtual machines. For the event aggregation and automation we are using Log Analytics, but you can use any monitoring solution to collect these logs and trigger automation.

![Diagram showing the event lifecycle](./media/events.png)

## Setup steps

1.	Windows Virtual Machine in Availability Set - Scheduled Events provides notification about changes that can affect any of the virtual machines in your availability set, Cloud Service, Virtual Machine Scale Set or standalone VMs. Our Azure Virtual machines were part of an Availability Set, so we will be running a service that polls for scheduled events on one Windows Virtual Machine and will get events regarding all virtual machines in the availability set. As a first step on your side to explore how you can record Scheduled events, either select one of your non-critical Windows Virtual Machines, or create a Windows Virtual Machine. We are going to connect this Virtual Machine to a Log Analytics workspace, and this requires a Windows Server image.   

1.	Log Analytics workspace – Next, for our event repository, we created a Log Analytics workspace and configured event log collection to capture the Windows application logs. Note: Please select the Information event type for Application.
 
1.	Connect the virtual machine to the workspace – To route the Scheduled Events to the Events Log, which will be saved as Application logs by our service, you will need to connect your virtual machine from step 1 to your Log Analytics workspace.  To connect the Virtual Machine to Log Analytics from the Azure portal, go to your Log Analytics workspace , find your Virtual Machine 