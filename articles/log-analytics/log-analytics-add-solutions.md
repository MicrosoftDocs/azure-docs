<properties
	pageTitle="Add Log Analytics solutions from the Solutions Gallery | Microsoft Azure"
	description="Log Analytics solutions are a collection of logic, visualization and data acquisition rules that provide metrics pivoted around a particular problem area."
	services="log-analytics"
	documentationCenter=""
	authors="bandersmsft"
	manager="jwhit"
	editor=""/>

<tags
	ms.service="log-analytics"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/28/2016"
	ms.author="banders"/>

# Add Log Analytics solutions from the Solutions Gallery

Log Analytics solutions are a collection of **logic**, **visualization** and **data acquisition rules** that provide metrics pivoted around a particular problem area. This article lists solutions supported Log Analytics and tells you how to add and remove them using the Solutions Gallery.

Solutions allow deeper insights to:
- help investigate and resolve operational issues faster
- collect and correlate various types of machine data
- help you be proactive with activities such as capacity planning, patch status reporting and security auditing.


>[AZURE.NOTE] OMS includes base Log Search functionality, so you don't need to install a solution to enable it. However, you can get additional functionality by adding solutions to it from the Solution Gallery page.

After you've added a solution, data is collected from the servers in your infrastructure and sent to the OMS service. Processing by the OMS service can take from a few minutes to several hours. After the service processes the data, you can view it in OMS.

You can easily remove a solution when it is no longer needed. When you remove a solution, its data is not sent to OMS, which can reduce the amount of data used by your daily quota, if you have one.


## Solutions supported by the Microsoft Monitoring Agent

At this time, servers that are connected to OMS using the Microsoft Monitoring Agent can use most of the solutions available, including:

- System Updates
- Antimalware
- Change Tracking
- SQL Assessment
- Active Directory Assessment
- Alert Management (without SCOM alerts)

However, the following solutions are *not* supported with the Microsoft Monitoring Agent and require System Center Operations Manager (SCOM) agent.

- Capacity Management
- Alert Management (including SCOM alerts)
- Configuration Assessment

Refer to [Connecting Operations Manager to Log Analytics](log-analytics-om-agents.md) for information about connecting the SCOM agent to Log Analytics.

### To add a solution using the Solutions Gallery

1. On the Overview page in OMS, click the **Solutions Gallery** tile.    
    ![solutions gallery](./media/log-analytics-add-solutions/sol-gallery.png)
2. On the OMS Solutions Gallery page, learn about each available solution. Click the name of the solution that you want to add to OMS.
3. On the page for the solution that you chose, detailed information about the solution is displayed. Click **Add**.
4. A new tile for the solution that you added appears on the Overview page in OMS and you can start using it after the OMS service processes your data.

## To configure solutions
1. You'll need to configure some solutions. For example, you'll need to configure Automation, Azure Site Recovery, and Backup before you can use them.
2. For any of those solutions, click its tile on the Overview page.  
    ![configure solution](./media/log-analytics-add-solutions/configure-additional.png)
3. Then, configure the solution with the necessary information and then click **Save**.  
    ![configure solution](./media/log-analytics-add-solutions/configure.png)

### To remove a solution using the Solutions Gallery

1. On the Overview page in OMS, click the **Settings** tile.
2. On the Settings page, under the Solutions tab, click **Remove** for the solution that you want to remove.
3. In the confirmation dialog, click **Yes** to remove the solution.

## Data collection details for OMS features and solutions

The following table shows data collection methods and other details about how data is collected for OMS features and solutions.

|data type| platform | Direct Agent | SCOM agent | Azure Storage | SCOM required? | SCOM agent data sent via management group | collection frequency |
|---|---|---|---|---|---|---|---|
|AD Assessment|Windows|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|	7 days|
|AD Replication Status|Windows|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|5 days|
|Alerts (Nagios)|Linux|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|on arrival|
|Alerts (Zabbix)|Linux|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|1 minute|
|Alerts (Operations Manager)|Windows|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|3 minutes|
|Antimalware|Windows|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)| hourly|
|Capacity Management|Windows|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)| hourly|
|Change Tracking|Windows|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)| hourly|
|Change Tracking|Linux|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|hourly|
|Configuration Assessment (legacy Advisor)|Windows|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)| twice per day|
|ETW|Windows|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|5 minutes|
|IIS Logs|Windows|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|5 minutes|
|Network Security Groups|Windows|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|10 minutes|
|Office 365|Windows|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|on notification|
|Performance Counters|Windows|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|as scheduled, minimum of 10 seconds|
|Performance Counters|Linux|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|as scheduled, minimum of 10 seconds|
|Service Fabric|Windows|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|5 minutes|
|SQL Assessment|Windows|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|	7 days|
|SurfaceHub|Windows|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|on arrival|
|Syslog|Linux|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|from Azure storage: 10 minutes; from agent: on arrival|
|System Updates|Windows|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)| at least 2 times per day and 15 minutes after installing an update|
|Windows security event logs|Windows|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)| for Azure storage: 10 min; for the agent: on arrival|
|Windows firewall logs|Windows|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)| on arrival|
|Windows event logs|Windows|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)| for Azure storage: 1 min; for the agent: on arrival|
|Wire Data|Windows (2012 R2 / 8.1 or later)|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)|![No](./media/log-analytics-add-solutions/oms-bullet-red.png)| every 1 minute|


## Next steps

- [Search logs](log-analytics-log-searches.md) to view detailed information gathered by solutions.
