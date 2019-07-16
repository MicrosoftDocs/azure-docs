---
title: Setup maintenance notifications for your Windows VMs in Azure | Microsoft Docs
description: Learn how to setup scheduled maintenance notifications for your Azure virtual machines.
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: gwallace

ms.service: virtual-machines-windows
ms.tgt_pltfrm: vm-windows
ms.date: 07/16/2019
ms.author: cynthn
ms.topic: conceptual
---

# Setup notifications about maintenance affecting your VM

Updates are applied to different parts of Azure every day,  to keep the fleet and the services running on them secure and up to date. In addition to these planned updates, unplanned events may also occur, for example, if any hardware degradation or fault is detected. Making sure that Azure Virtual machines are not impacted in the process is our top priority. Through Live Migration, Memory Preserving updates and in general keeping a strict bar on the impact of updates, in most cases these events are almost transparent to customers, and they have no impact or at most cause a few seconds of virtual machine freeze. However, for some particular applications, even a few seconds of virtual machine freeze could cause impact and hence knowing in advance about upcoming Azure maintenance is important, to ensure the best experience for those applications. Scheduled Events provides you a programmatic interface to be notified about upcoming maintenance and enables you to gracefully handle the maintenance. 

In this article, we will show how you can leverage scheduled events to be notified about maintenance events that could be affecting your VMs and build some basic automation that can help with monitoring and analysis.


## Routing scheduled events to Log Analytics

[Scheduled Events](scheduled-events.md) is available as part of the Azure Instance Metadata Service which is available on every Azure virtual machine. Customers can write automation to query the endpoint in their virtual machines to discover scheduled Azure maintenance and perform automated mitigations, such as saving state and taking the virtual machine out of rotation. We see some customers build automation to ensure high availability and that is our recommendation for how to use Scheduled Events. Some others take a first step to record the Scheduled Events received, so they can have an auditing log of Azure maintenance events with non-zero impact, or customer-initiated actions that can affect their virtual machines. 
In this blog, we will walk you step by step on how to capture maintenance Scheduled Events to Log Analytics, and from there trigger some basic notification actions, basic automation like sending an email to your DevOps team , or easily get a historical view of all events that have affected your virtual machines. For the event aggregation and automation we are using Log Analytics, but you can use any monitoring solution to collect these logs and trigger automation.

![Diagram showing the event lifecycle](./media/notifications/events.png)

## Setup steps

1.	Create a [Windows Virtual Machine in Availability Set](tutorial-availability-sets.md). Scheduled Events provides notification about changes that can affect any of the virtual machines in your availability set, Cloud Service, Virtual Machine Scale Set or standalone VMs. Our Azure Virtual machines were part of an Availability Set, so we will be running a service that polls for scheduled events on one Windows Virtual Machine and will get events regarding all virtual machines in the availability set. As a first step on your side to explore how you can record Scheduled events, either select one of your non-critical Windows Virtual Machines, or create a Windows Virtual Machine. We are going to connect this Virtual Machine to a Log Analytics workspace, and this requires a Windows Server image.   
1.	Create a Log Analytics workspace. For our event repository, we created a Log Analytics workspace and configured event log collection to capture the Windows application logs. Note: Please select the **Information event** type for **Application**.
1.	Connect the virtual machine to the workspace – To route the Scheduled Events to the Events Log, which will be saved as Application logs by our service, you will need to connect your virtual machine from step 1 to your Log Analytics workspace.  To connect the Virtual Machine to Log Analytics from the Azure portal, go to your Log Analytics workspace , find your virtual machine and click on “Connect”. This will install the Microsoft Monitoring agent in your virtual machine, which will import all the Windows events to Log Analytics. 



>![NOTE] 
>In our setup, our virtual machines were in an availability set, which enabled us to designate a single virtual machine as the leader to listen and route scheduled events to our log analytics works space. If you had standalone virtual machines, you could run the service on every single virtual machine and then connect them individually to your log analytics workspace.
>
>For our setup, we chose Windows, but you can design a similar solution on Linux as schedule events is also supported on Linux


## Capturing and exporting Scheduled Events

In our setup, we are running a service on our Windows virtual machine that polls the instance metadata service endpoint for scheduled event and logs the events to Windows Application logs. You can download the powershell based script from https://github.com/microsoft/AzureScheduledEventsService and copy the script to the Windows Azure Virtual machine that’s going to run Schedule Event service. 

In your Virtual Machine, open a PowerShell prompt and run the following command to setup the Service.

```powershell
.\SchService.ps1 -Setup
```

Start the service.

```powershell
.\SchService.ps1 -Start
```

The service will now start polling every 10 seconds for any scheduled events and approve the events to expedite the maintenance.  Freeze, Reboot, Redeploy and Preempt are the events captured by Schedule events.   Note that you can extend the script to trigger some mitigations prior to approving the event.

Validate the service status and make sure it is running.

```powershell
.\SchService.ps1 -status  
```

Once the service is setup and started, it will log events in the Windows Application logs.   To verify this works, restart one of the virtual machines and you should see an event being logged in your Azure Windows virtual machine application logs. 

When any of the above events are captured by Schedule Event service, it will get logged in the Application Event Log as below with Event Status, Event Type, Resources (Virtual machine names) and NotBefore (minimum notice period). You can locate the events with ID 1234 in the Application Event Log.

![Screenshot of event viewer.](./media/notifications/event-viewer.png)

The Microsoft Monitoring Agent running on this Virtual Machine will import these events to your Log Analytics workspace. 


!{NOTE}
>There will be some latency with Log Analytics, and it may take up to 10 minutes before the log is available. You can use any monitoring solution to collect these events and fire an alert to trigger automation.  

At any point you can stop/remove the Scheduled Event Service by using the switches `–stop` and `–remove`.

## Creating an alert rule with Azure Monitor 

Once the events are pushed to Log Aanalytics, you can run the following query to look for the schedule Events.

```
Event
| where EventLog == "Application" and Source contains "AzureScheduledEvents" and RenderedDescription contains "Scheduled" and RenderedDescription contains "EventStatus" 
| project TimeGenerated, RenderedDescription
| extend ReqJson= parse_json(RenderedDescription)
| extend EventId = ReqJson["EventId"]
,EventStatus = ReqJson["EventStatus"]
,EventType = ReqJson["EventType"]
,NotBefore = ReqJson["NotBefore"]
,ResourceType = ReqJson["ResourceType"]
,Resources = ReqJson["Resources"]
| project-away RenderedDescription,ReqJson
```

The query will display a table similar to this:

![](./media/notifications/query-output.png)


 
You can use the same query to create an alert rule. To create an alert rule, you need an action group. An action group is used to define an action for an alert. You can use this to sent an Email or SMS message to your team, or wire up other automation using Webhooks or a Logic App.
     
## Next steps

