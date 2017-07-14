---
title: Analyze data usage in Log Analytics | Microsoft Docs
description: Use the Usage dashboard in Log Analytics to view how much data is being sent to the Log Analytics service and troubleshoot why large amounts of data are being sent.
services: log-analytics
documentationcenter: ''
author: MGoedtel
manager: carmonm
editor: ''
ms.assetid: 74d0adcb-4dc2-425e-8b62-c65537cef270
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 07/14/2017
ms.author: magoedte

---
# Analyze data usage in Log Analytics
Log Analytics includes information on the amount of data collected, which computers sent the data and the different types of data sent.  Use the **Log Analytics Usage** dashboard to see the amount of data sent to the Log Analytics service. The dashboard shows how much data is collected by each solution and how much data your computers are sending.

## Troubleshoot missing data
One of the most common reasons that your workspace is missing data is that data collection stopped.

Log Analytics creates an event of type *Operation* when data collection starts and stops. 

Run the following query in search to check if you are reaching the daily limit and missing data:
`Type=Operation OperationCategory="Data Collection Status"`

When data collection stops, the *OperationStatus* is **Warning**. When data collection starts, the *OperationStatus* is **Succeeded**. 

The following table describes reasons that data collection stops and a suggested action to resume data collection:

| Reason data collection stops                       | To resume data collection |
| -------------------------------------------------- | ----------------  |
| Daily limit of free data reached<sup>1</sup>       | Wait until the following day for collection to automatically restart, or<br> Change to a paid pricing tier |
| Azure subscription is in a suspended state due to: <br> Free trial ended <br> Azure pass expired <br> Monthly spending limit reached (for example on an MSDN or Visual Studio subscription)                          | Convert to a paid subscription <br> Convert to a paid subscription <br> Remove limit, or wait until limit resets |

<sup>1</sup> If your workspace is on the free pricing tier, you're limited to sending 500 MB of data per day to the service. 
When you reach the daily limit, data collection stops until the next day. Data sent while data collection is stopped is not indexed and is not available for searching. When data collection resumes, processing occurs only for new data sent. 

Log Analytics uses UTC time and each day starts at midnight UTC. If the workspace reaches the daily limit, processing resumes during the first hour of the next UTC day.

### Create an alert when data collection stops
Use the steps described in [create an alert rule](log-analytics-alerts-creating.md#create-an-alert-rule) to be notified when data collection stops.

Use the following search query for the alert rule: 
`Type=Operation OperationCategory="Data Collection Status" OperationStatus=Warning`

## Understand the Usage dashboard
The **Log Analytics usage** dashboard displays the following information:

- Data volume
    - Data volume over time (based on your current time scope)
    - Data volume by solution
    - Data not associated with a computer
- Computers
    - Computers sending data
    - Computers with no data in last 24 hours
- Offerings
    - Insight and Analytics nodes
    - Automation and Control nodes
    - Security nodes
- Performance
    - Time taken to collect and index data
- List of queries

![usage dashboard](./media/log-analytics-usage/usage-dashboard01.png)

### To work with usage data
1. If you haven't already done so, sign in to the [Azure portal](https://portal.azure.com) using your Azure subscription.
2. On the **Hub** menu, click **More services** and in the list of resources, type **Log Analytics**. As you begin typing, the list filters based on your input. Click **Log Analytics**.  
    ![Azure hub](./media/log-analytics-usage/hub.png)
3. The **Log Analytics** dashboard shows a list of your workspaces. Select a workspace.
4. In the *workspace* dashboard, click **Log Analytics usage**.
5. On the **Log Analytics Usage** dashboard, click **Time: Last 24 hours** to change the time interval.  
    ![time interval](./media/log-analytics-usage/time.png)
6. View the usage category blades that show areas you’re interested in. Choose a blade and then click an item in it to view more details in [Log Search](log-analytics-log-searches.md).  
    ![example data usage blade](./media/log-analytics-usage/blade.png)
7. On the Log Search dashboard, review the results that are returned from the search.  
    ![example usage log search](./media/log-analytics-usage/usage-log-search.png)

## Create an alert when data collection is higher than expected
This section describes how to create an alert if:
- Data volume exceeds a specified amount.
- Data volume is predicted to exceed a specified amount.

Log Analytics [alerts](log-analytics-alerts-creating.md) use search queries. 
The following query has a result when there is more than 100 GB of data collected in the last 24 hours:

`Type=Usage QuantityUnit=MBytes IsBillable=true | measure sum(div(Quantity,1024)) as DataGB by Type | where DataGB > 100`

The following query uses a simple formula to predict when more than 100 GB of data will be sent in a day: 

`Type=Usage QuantityUnit=MBytes IsBillable=true | measure sum(div(mul(Quantity,8),1024)) as EstimatedGB by Type | where EstimatedGB > 100`

To alert on a different data volume, change the 100 in the queries to the number of GB you want to alert on.

Use the steps described in [create an alert rule](log-analytics-alerts-creating.md#create-an-alert-rule) to be notified when data collection is higher than expected.

When creating the alert for the first query -- when there is more than 100 GB of data in 24 hours, set the:
- **Name** to *Data volume greater than 100 GB in 24 hours*
- **Severity** to *Warning*
- **Search query** to `Type=Usage QuantityUnit=MBytes IsBillable=true | measure sum(div(Quantity,1024)) as DataGB by Type | where DataGB > 100`
- **Time window** to *24 Hours*.
- **Alert frequency** to be one hour since the usage data only updates once per hour.
- **Generate alert based on** to be *number of results*
- **Number of results** to be *Greater than 0*

Use the steps described in [add actions to alert rules](log-analytics-alerts-actions.md) configure an e-mail, webhook, or runbook action for the alert rule.

When creating the alert for the second query -- when it is predicted that there will be more than 100 GB of data in 24 hours, set the:
- **Name** to *Data volume expected to greater than 100 GB in 24 hours*
- **Severity** to *Warning*
- **Search query** to `Type=Usage QuantityUnit=MBytes IsBillable=true | measure sum(div(mul(Quantity,8),1024)) as EstimatedGB by Type | where EstimatedGB > 100`
- **Time window** to *3 Hours*.
- **Alert frequency** to be one hour since the usage data only updates once per hour.
- **Generate alert based on** to be *number of results*
- **Number of results** to be *Greater than 0*

When you receive an alert, use the steps in the following section to troubleshoot why usage is higher than expected.

## Troubleshooting why usage is higher than expected
The usage dashboard helps you to identify why usage (and therefore cost) is higher than you are expecting.

Higher usage is caused by one, or both of:
- More data than expected being sent to Log Analytics
- More nodes than expected sending data to Log Analytics

### Check if there is more data than expected 
There are two key sections of the usage page that help identify what is causing the most data to be collected.

![data volume charts](./media/log-analytics-usage/log-analytics-usage-data-volume.png)

The *Data volume over time* chart shows the total volume of data sent and the computers sending the most data. The chart at the top allows you to see if your overall data usage is growing, remaining steady or decreasing. The list of computers shows the 10 computers sending the most data.

The *Data volume by solution* chart shows the volume of data that is sent by each solution and the solutions sending the most data. The chart at the top shows the total volume of data that is sent by each solution over time. This information allows you to identify whether a solution is sending more data, about the same amount of data, or less data over time. The list of solutions shows the 10 solutions sending the most data. 

Look at the *Data volume over time* chart. To see the solutions and data types that are sending the most data for a specific computer, click on the name of the computer. Click on the name of the first computer in the list.

In the following screenshot, the *Log Management - Perf* data type is sending the most data for the computer. 
![data volume for a computer](./media/log-analytics-usage/log-analytics-usage-data-volume-computer.png)


Next, go back to the *Usage* dashboard and look at the*Data volume by solution* chart. To see the computers sending the most data for a solution, click on the name of the solution in the list. Click on the name of the first solution in the list. 

In the following screenshot, it confirms that the *acmetomcat* computer is sending the most data for the Log Management solution.

![data volume for a solution](./media/log-analytics-usage/log-analytics-usage-data-volume-solution.png)


Use the following steps to reduce the volume of logs collected:

| Source of high data volume | How to reduce data volume |
| -------------------------- | ------------------------- |
| Security events            | Select [common or minimal security events](https://blogs.technet.microsoft.com/msoms/2016/11/08/filter-the-security-events-the-oms-security-collects/) <br> Change the security audit policy. For example, turn off [audit filtering platform](https://technet.microsoft.com/en-us/library/dd772749(WS.10).aspx) events. |
| Performance counters       | Change [performance counter configuration(log-analytics-data-sources-performance-counters.md) to: <br> - Reduce the frequency of collection <br> - Reduce number of performance counters |
| Event logs                 | Change [event log configuration](log-analytics-data-sources-windows-events.md) to: <br> - Reduce the number of event logs collected <br> - Collect only required event levels. For example, do not collect *Information* level events |
| Syslog                     | Change [syslog configuration](log-analytics-data-sources-syslog.md) to: <br> - Reduce the number of facilities collected <br> - Collect only required event levels. For example, do not collect *Info* and *Debug* level events |
| Data from | Use [solution targeting](../operations-management-suite/operations-management-suite-solution-targeting.md) to collect data from only required groups of computers.

### Check if there are more nodes than expected
If you are on the *per node (OMS)* pricing tier, then you are charged based on the number of nodes and solutions you use. You can see how many nodes of each offer are being used in the *offerings* section of the usage dashboard.

![usage dashboard](./media/log-analytics-usage/log-analytics-usage-offerings.png)

Click on **See all...** to view the full list of computers sending data for the selected offer.

Use [solution targeting](../operations-management-suite/operations-management-suite-solution-targeting.md) to collect data from only required groups of computers.


## Next steps
* See [Log searches in Log Analytics](log-analytics-log-searches.md) to learn how to use the search language. You can use search queries to perform additional analysis on the usage data.
* Use the steps described in [create an alert rule](log-analytics-alerts-creating.md#create-an-alert-rule) to be notified when a search criteria is met
