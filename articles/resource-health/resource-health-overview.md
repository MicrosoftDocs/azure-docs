<properties
   pageTitle="Reducing troubleshooting time with Azure Resource health"
   description="Overview of Axure Resource health"
   services="Resource health"
   documentationCenter="dev-center-name"
   authors="BernardoAMunoz"
   manager="manager-alias"
   editor=""/>

<tags
   ms.service="Resource Health"
   ms.devlang="may be required"
   ms.topic="article"
   ms.tgt_pltfrm="may be required"
   ms.workload="Supportability"
   ms.date="06/01/2016"
   ms.author="bernardm@microsoft.com"/>

# Reducing troubleshooting time with Azure Resource health

Azure Resource health is a service that exposes the health of individual Azure resources and provides actionable guidance to troubleshoot problems. In a cloud environment where it isn’t possible to directly access servers or infrastructure elements, the goal for Resource health is to reduce the time customers spend on troubleshooting, in particular reducing the time spent determining if the root of the problem lays inside the application or if it is caused by an event inside the Azure platform.

## How is Resource health different from Service Health Dashboard?

The information provided by Resource health is more granular than what is provided by the Service. While the Health Dashboard (SHD) communicates events that impact the availability of a service in a region, Resource health provides information at the resource level (e.g. it will expose events that impact the availability of a specific virtual machine, a web app, or a SQL database. For example, if a node unexpectedly reboots, customers who had VMs running in that node will be able to obtain the reason why could not connect to their VMs during the time it took the VM to restart in a different node.  

## How to access Resource health
Today there are 3 ways to access Resource health.

### Resource blade
For the services available through Resource health, login into the Azure Portal and open the resource blade. On the Settings blade that opens next to the Resource blade, click on Resource Health to open the Resource health blade, which provides detailed information about the health of the resource as well recommended actions based on the current health. 

For healthy resources, there is a link to a general troubleshoot blade that will walk you through common solutions. For an unhealthy resource, this blade will show the states of any recovery efforts as well as providing possible actions based on the particular resource type and unavailable reason. If customers required additional help from Microsoft, this blade provides a link to open a support request.

![Resource health blade](./media/resource-health-overview/resourceBladeAndResourceHealth.png)

### Help and Support blade
Login into the Azure Portal and open the Help and Support blade by clicking on the question mark in the upper right corner then selecting Help + support. 

**From the top navigation bar**
![Help + support](./media/resource-health-overview/HelpAndSupport.png)

Clicking the tile opens the Resource health blade which will list all of the resources in your subscription. Beside each resource, there is an icon indicating its status. Clicking on each resource will open the Resource health blade.

**Resource health tile**
![Resource health tile](./media/resource-health-overview/resourceHealthTile.png)

### Resource health API
Along with the Azure portal experience, there is also an API that can be used to query Resource health. The API supports calls to obtain the health of all resources in a subscription, all resources in a resource group or the health of a specific resource. 

Before using the API to connect to Resource health, the subscription needs to be registered with the service by submitting a POST request to the following URL: 

        https://management.azure.com/subscriptions/<SubID>/providers/Microsoft.ResourceHealth/register?api-version=2015-01-01
        
Below are examples on how to call the Resource health API

        // GET health of all resources in a subscription:
        https://management.azure.com/subscriptions/<SubID>/providers/Microsoft.ResourceHealth/availabilityStatuses?api-version=2015-01-01
        
        //GET health of all resources in a resource group:
        https://management.azure.com/subscriptions/<SubID>/resourceGroups/<ResourceGroupName>/providers/Microsoft.ResourceHealth/availabilityStatuses?api-version=2015-01-01
        
        //GET the health of a single resource:
        https://management.azure.com/subscriptions/<SubID>/resourceGroups/<ResourceGroupName>/providers/<ResourceProvider>/<ResourceType>/<ResourceName>/providers/Microsoft.ResourceHealth/availabilityStatuses/current?api-version=2015-01-01


## What does my Resource health status mean?
There are 4 different health statuses that you might see for your resource.

### Available
The service has not detected any problems in the platform that could be impacting the availability of the resource. This is indicated by a green check mark icon. 
With the goal of reducing troubleshooting time, in the middle section of the blade, users will find links to recommended content and tools. In most cases the top recommendation will be to visit the Troubleshooting blade, where users will be able get troubleshooting steps to solve Azure most common problems. 

![Resource is available](./media/resource-health-overview/Available.png)

### Unavailable

In this case the service has detected an ongoing problem in the platform that is impacting the availability of this resource, for example, the node where the VM was running unexpectedly rebooted. This is indicated by a red warning icon. 
Additional information about the problem is provided in the middle section of the blade, including: 

1.	What actions Microsoft is taking to recover the resource 
2.	A detailed timeline of the problem, including the expected resolution time
3.	A list recommended actions for users 

![Resource is unavailable](./media/resource-health-overview/Unavailable.png)

### Unavailable – customer initiated
The resource is unavailable due to a customer request such as stopping a resource or requesting a restart. This is indicated by a blue informational icon. 

![Resource is unavailable due to user an initiated action](./media/resource-health-overview/userInitiated.png)

### Unknown
The service has not received information about this resource for more than 5 minutes. This is indicated by a grey question mark icon. 

It is important to note that this is not a definitive indication that there is something wrong with a resource, so customers should follow these recommendations:
•	If the resource is running as expected but its health is set to Unknown in Resource health, there are no problems and you can expect the status of the resource to update to healthy after a few minutes.
•	If there are problems accessing the resource and its health is set to Unknown in Resource health, this could be an early indication there could be an issue and additional investigations should be done until the health is updated to either healthy or unhealthy

![Resource health is unknown](./media/resource-health-overview/unknown.png)

## Service Impacting Events
If the resource may be impacted by an ongoing Service Impacting Event, a banner will be displayed at the top of the Resource health blade. Clicking on the banner will open the Audit Events blade, where more information about the outage can be obtained.

![Resource health may be impacted by a SIE](./media/resource-health-overview/serviceImpactingEvent.png)

## What else do I need to know about Resource health?

### Signal latency
The signals that feed Resource health, may be up to 15 min delayed, which can cause discrepancies between the current health status of the resource and its actual availability. It is important to keep this in mind as it will help eliminate unnecessary time spent investigating possible issues. 

### How Resource Health is determined
Resource health currently only accounts for the health of one specific resource type and does not consider other elements that may contribute to the overall health. For example, when reporting the status of a virtual machine, only the compute portion of the infrastructure is considered, i.e. issues in the network will not be shown in Resource health (unless there is a declared SIE, in which case, it will be surfaced through the banner at the top of the blade)

### Special case for SQL 
Resource health reports the status of the SQL database, not the SQL server. While going this route provides a more realistic health picture, it requires that multiple components and services be taken into consideration to determine the health of the database. The current signal relies on logins to the database, which means that for databases that receive regular logins (which includes among other things, receiving query execution requests) the health status will be regularly displayed. If the database has not been accessed for a period of 10 minutes or more, it will be moved to the unknown state. This does not mean that the database is unavailable, just that no signal has been emitted because no logins have been performed. Connecting to the database and running a query will emit the signals needed to determine and update the health status of the database.

## Feedback
We are always open to feedback and suggestions! Please send us your [suggestions](https://feedback.azure.com/forums/266794-support-feedback). Additionally, you can engage with us via [Twitter](https://twitter.com/azuresupport) or the [MSDN forums](https://social.msdn.microsoft.com/Forums/azure).
