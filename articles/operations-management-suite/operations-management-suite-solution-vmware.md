<properties
   pageTitle="VMWare Log Monitoring for Operations Management Suite (OMS) | Microsoft Azure"
   description="The VMWare solution in Operations Management Suite (OMS) provides a centralized solution for analysis of VMWare logs.  This article provides details for deploying and using the solution in your OMS workspace."
   services="operations-management-suite"
   documentationCenter=""
   authors="keikhara"
   manager="jwhit"
   editor="tysonn" />
<tags
   ms.service="operations-management-suite"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="09/20/2016"
   ms.author="bwren" />

# VMWare Log Monitoring solution for Operations Management Suite (OMS)
 
 VMWare logs can be massive in scale and difficult to capture and manage. In order to do troubleshooting and alerting using deep log analysis and trends, a centralized approach for logging and monitoring is required.  

### What can you do with the VMWare Log Monitoring Solution?  
 - See information about all VMWare ESXi Hosts in a single location 
 - Know what the top event counts, status, and trends of VM and ESXi Hosts provided thru the ESXi Host logs 
 - Troubleshoot by viewing and searching centralized logs of ESXi Hosts.  
 - Provide alerting based on the log search queries  
  
#### Supported VMWare ESXi Host:  
  vSphere ESXi Host 5.5, 6.0 
   
#### How do I set up the VMWare Solution?  
   First, you will need to create a Linux OS VM to receive all syslog from the ESXi Hosts. The OMS Linux Agent will be the collecting point for all ESXi Host syslog. You can have multiple ESXi Hosts forwarding logs to a single linux server as you see in the diagram below.  

   ![Diagram](media/operations-management-suite-solution-vmware/diagram.png)

This is a Private Preview product. If you would like to participate in Private Preview program, please contact OMSVMWare@microsoft.com. We will enable you. Please try out some scenarios we have and give us any feedback. We love to hear from you.

### Here are the steps to set up the syslog collection for ESXi Host and OMS Linux Agent installation:

1. Setup syslog forwarding for VSphere. For detailed steps that set up syslog forwarding on ESXi Host, see [Configuring syslog on ESXi 5.x and 6.0 (2003322)](https://kb.vmware.com/selfservice/microsites/search.do?language=en_US&cmd=displayKC&externalId=2003322).

    Go to **ESXi Host Configuration -> Software/Advanced Settings -> Syslog**

![vsphereconfig](media/operations-management-suite-solution-vmware/vsphere1.png)

In the *Syslog.global.logHost* field, add your linux server and the port number *1514*. 

```example) tcp://hostname:1514 		or 	tcp://123.456.789.101:1514```

2.	Make sure to open the ESXi Host firewall for syslog. 
  Go to **ESXi Host Configuration -> Software/Security Profile-> Firewall** and open properties. 

![vspherefw](media/operations-management-suite-solution-vmware/vsphere2.png)

![vspherefwproperties](media/operations-management-suite-solution-vmware/vsphere3.png)

Check the vSphere Console to see whether the syslog is properly set up. Confirm from the ESXI Host that it shows that port **1514** is configured. 

3.	Test the connectivity between the linux server and ESXi Host using the “nc” command on the ESXi Host. 

```
example) 
[root@ESXiHost:~] nc -z 123.456.789.101 1514
Connection to 123.456.789.101 1514 port [tcp/*] succeeded!
```


4.	Download and Install OMS Agent for Linux on the linux server. 
[Documentation for OMS Agent for Linux](https://github.com/Microsoft/OMS-Agent-for-Linux)


5.	Go to OMS Log Analysis and see whether you can find any search results.  Once OMS collects the syslog data, it retains the syslog format. On OMS, you will see that specific fields are already captured such as Hostname and ProcessName. 
 
`Type=VMware_CL`


![type](media/operations-management-suite-solution-vmware/type.png)

If you can see this, you are all set for the OMS VMWare Solution Dashboard.  


## VMWare Solution on OMS 
Once you’ve enabled VMWare Solution and have set up the OMS Agent for Linux, you are ready for the VMWare Solution. 

### VMWare Solution Overview
When you open the OMS web portal, you will see an overview tile called VMWare. It will provide you a quick high level view of the failures stated on OMS. Once you click on this overview tile, you go into a dashboard view. 

![tile](media/operations-management-suite-solution-vmware/tile.png)

#### Navigating the Dashboard view
Once you’ve clicked on the VMWare Solution tile, you will see the views organized by: 
- Failure Status Count
- Top Host by Event Counts
- Top Event Counts
- Virtual Machine Activities
- ESXi Host Disk Events


![solution1](media/operations-management-suite-solution-vmware/solution-view1-1.png)

![solution2](media/operations-management-suite-solution-vmware/solution-view1-2.png)

Click on any tile and this will take you to the Log Analytics Search pane. This will provide you more detailed information. 

From here you can edit the search query to modify it to something specific. For a tutorial on the basics of OMS search, check out the [OMS log search tutorial.](../log-analytics//log-analytics-log-searches.md)

#### Finding ESXi Host’s Top Events and ESXi Host with high event counts
A single ESXi Host will generate multiple logs based on their processes. The OMS VMWare Solution centralizes this and summarizes the event counts. This way, you can understand which ESXi Host has a high volume of events and what events are toping in the environment. 

![event](media/operations-management-suite-solution-vmware/events.png)

You can drill down further by either clicking in the ESXi Host or Event Type. 

If you selected the ESXi Host name, you will view information from that ESXi Host. If you would like to narrow further with the Event Type, you can add **“ProcessName_s=EVENT TYPE”** in your search query. Of course, you can select the ProcessName from the search filter on the left-hand side.  This will narrow the information for you. 


![drill](media/operations-management-suite-solution-vmware/event-host-drilldown.png)

#### Finding ESXi Host with high VM creation or deletion activities
A Virtual Machine (VM) can be created and deleted on any ESXi Host. For an administrator to understand which ESXi Host has how many VMs creates, this will be helpful to understand performance and capacity planning. Keeping track of the VM activity events is crucial when managing the environment. 

![drill](media/operations-management-suite-solution-vmware/vm-activities.png)

If you want to see additional ESXi Host VM creation information, click on the ESXi Host name and you will see more information. 

![drill](media/operations-management-suite-solution-vmware/create-vm.png)

#### Other queries 
We’ve provided some queries which can be used such as disk space full, storage latency, path failure, and more. 

![queries](media/operations-management-suite-solution-vmware/queries.png)


#### Alerting using queries
Once you’ve created your queries, you may want to use the queries to alert you on events. For more information on how to set up alerting, please refer to documentation on [Alerts in Log Analytics](../log-analytics/log-analytics-alerts.md). 

Also, I’ve also posted a blog with some examples of the alerting queries and other query examples. Please refer to Monitor VMWare using OMS Log Analytics blog. 

If you have any questions or suggestions, please contact [OMSVMWare@microsoft.com](OMSVMWare@microsoft.com). 

## Next steps

- [Search logs](../log-analytics/log-analytics-log-searches.md) to view detailed VMWare data.