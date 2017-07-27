---
title: Service Map solution self paced demo | Microsoft Docs
description: Service Map is a solution in Operations Management Suite (OMS) that automatically discovers application components on Windows and Linux systems and maps the communication between services.  This is a self paced demo that walks through using Service Map to identify and diagnose a simulated problem in a web application.
services: operations-management-suite
documentationcenter: ''
author: bwren
manager: carmonm
editor: tysonn

ms.assetid: 9dc437b9-e83c-45da-917c-cb4f4d8d6333
ms.service: operations-management-suite
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 04/12/2017
ms.author: bwren

---

# Operations Management Suite (OMS) self paced demo - Service Map
This is a self paced demo that walks through using the [Service Map solution](operations-management-suite-service-map.md) in Operations Management Suite (OMS) to identify and diagnose a simulated problem in a web application.  Service Map automatically discovers application components on Windows and Linux systems and maps the communication between services.  It also consolidates data collected by other OMS services to assist you in analyzing performance and identifying issues.  You'll also use [log searches in Log Analytics](../log-analytics/log-analytics-log-searches.md) to drill down on collected data in order to identify the root problem.


## Scenario description
You've just received a notification that the ACME Customer Portal application is having performance issues.  The only information that you have is that these issues started about 4:00 am PST today.  You aren't entirely sure of all the components that the portal is dependent on other than a set of web servers.  

## Components and features used
- [Service Map solution](operations-management-suite-service-map.md)
- [Log Analytics log searches](../log-analytics/log-analytics-log-searches.md)


## Walk through

### 1. Connect to the OMS Experience Center
This walk through uses the [Operations Management Suite Experience Center](https://experience.mms.microsoft.com/) which provides a complete OMS environment with sample data. Start by following this link, provide your information and then select the **Insight and Analytics** scenario.


### 2. Start Service Map
Start the Service Map solution by clicking on the **Service Map** tile.

![Service Map Tile](media/operations-management-suite-walkthrough-servicemap/tile.png)

The Service Map console is displayed.  In the left pane is a list of computers in your environment with the Service Map agent installed.  You'll select the computer that you want to view from this list.

![Computer list](media/operations-management-suite-walkthrough-servicemap/computer-list.png)


### 3. View computer
We know that the web servers are called AcmeWFE001 and AcmeWFE002, so this seems like a reasonable place to start.  Click on **AcmeWFE001**.  This displays the map for AcmeWFE001 and all of its dependencies.  You can see which processes are running on the selected computer and which external services they communicate with.

![Web server](media/operations-management-suite-walkthrough-servicemap/web-server.png)

We're concerned about the performance of our web application so click on the **AcmeAppPool (IIS App Pool)** process.  This displays the details for this process and highlights its dependencies.  

![App Pool](media/operations-management-suite-walkthrough-servicemap/app-pool.png)


### 4. Change time window

We heard that the problem started at 4:00 AM so let's have a look at what was happening at that time. Click on **Time Range** and change the time to 4:00 AM PST (keep the current date and adjust for your local time zone) with a duration of 20 minutes.

![Time Picker](./media/operations-management-suite-walkthrough-servicemap/time-picker.png)


### 5. View alert

We now see that the **acmetomcat** dependency has an alert displayed, so that's our potential problem.  Click on the alert icon in **acmetomcat** to show the details for the alert.  We can see that we have critical CPU utilization and can expand it for more detail.  This is probably what's causing our slow performance. 

![Alert](./media/operations-management-suite-walkthrough-servicemap/alert.png)


### 6. View performance

Let's have a closer look at **acmetomcat**.  Click in the top right of **acmetomcat** and select **Load Server Map** to show the detail and dependencies for this machine. We can then look a bit more into those performance counters to verify our suspicion.  Select the **Performance** tab to display the [performance counters collected by Log Analytics](../log-analytics/log-analytics-data-sources-performance-counters.md) over the time range.  We can see that we're getting periodic spikes in the processor and memory.

![Performance](./media/operations-management-suite-walkthrough-servicemap/performance.png)


### 7. View change tracking
Let's see if we can find out what might have caused this high utilization.  Click on the **Summary** tab.  This provides information that OMS has collected from the computer such as failed connections, critical alerts, and software changes.  Sections with interesting recent information should already be expanded, and you can expand other sections to inspect information that they contain.


If **Change Tracking** isn't already open, then expand it.  This shows information collected by the [Change Tracking solution](../log-analytics/log-analytics-change-tracking.md).  It looks like there was a software change made during this time window.  Click on **Software** to get details.  A backup process was added to the machine just after 4:00 AM, so this appears to be the culprit for the excessive resources being consumed.

![Change tracking](./media/operations-management-suite-walkthrough-servicemap/change-tracking.png)



### 8. View details in Log Search
We can further verify this by looking at the detailed performance information collected in the Log Analytics repository.  Click on the **Alerts** tab again and then on one of the **High CPU** alerts.  Click on  **Show in Log Search**.  This opens the Log Search window where you can perform [log searches](../log-analytics/log-analytics-log-searches.md) against any data stored in the repository.  Service Map already filled in a queriy for us to retrieve the alert we're interested in.  

![Log search](./media/operations-management-suite-walkthrough-servicemap/log-search.png)


### 9. Open saved search
Let's see if we can get some more detail on the performance collection that generated this alert and verify our suspicion that the problems are being caused by that backup process.  Change the time range to **6 hours**.  Then click on **Favorites** and scroll down to the saved searches for **Service Map**.  These are queries that we created specifically for this analysis.  Click on **Top 5 Processes by CPU for acmetomcat**.

![Saved search](./media/operations-management-suite-walkthrough-servicemap/saved-search.png)


This query returns a list of the top 5 processes consuming processor on **acmetomcat**.  You can inspect the query to get an introduction to the query language used for log searches.  If you were interested in the processes on other computers, you could modify the query to retrieve that information.

In this case, we can see that the backup process is consistently consuming about 60% of the app server’s CPU.  It's pretty obvious that this new process is responsible for our performance problem.  Our solution would obviously be to remove this new backup software off the application server.  We could actually leverage Desired State Configuration (DSC) managed by Azure Automation to define policies that ensure this process never runs on these critical systems.


## Summary points
- [Service Map](operations-management-suite-service-map.md) provides you with a view of your entire application even if you don't know all of its servers and dependencies.
- Service Map surfaces data collected by other OMS solutions to help you identify issues with your application and its underlying infrastructure.
- [Log searches](../log-analytics/log-analytics-log-searches.md) allow you to drill down into specific data collected in the Log Analytics repository.    

## Next steps
- Learn more about [Service Map](operations-management-suite-service-map.md).
- [Deploy and configure](operations-management-suite-service-map-configure.md) Service Map.
- Learn about [Log Analytics](../log-analytics/log-analytics-overview.md) which is required for Service Map and stores operational data stored by agents.