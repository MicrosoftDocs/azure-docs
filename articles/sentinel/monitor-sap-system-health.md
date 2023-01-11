---
title: Monitor the health of your Microsoft Sentinel SAP systems
description: Use the SAP connector page and a dedicated alert rule template to keep track of your SAP systems' connectivity and performance.
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.date: 11/09/2022
ms.service: microsoft-sentinel
---

# Monitor the health of your SAP systems

To ensure proper functioning and performance of your in your SAP systems, keep track of your data connectors' health, connectivity, and performance. 

This article describes how to use the following features, which allow you to perform this monitoring from within Microsoft Sentinel:

- Review the **System Health** area under the Microsoft Sentinel for SAP connector to get information on the health of your connected SAP systems.
- Use an alert rule template to get information about the health of the SAP agent's data collection.

## Use the SAP data connector

1. From the Microsoft Sentinel portal, select **Data connectors**.
1. In the search bar, type *Microsoft Sentinel for SAP*.
1. Select the **Microsoft Sentinel for SAP** connector and select **Open connector**.
1. In the **Configuration > System Health** area, you can view information on the health of your SAP systems.

[TBD - screenshot]

|Field  |Description  |Values  |Notes  |
|---------|---------|---------|---------|
|Agent name |Unique ID of the installed data collector agent |         |         |
|SID     |The name of the connected SAP system ID (SID).  |         |         |
|Health  |Indicates whether the SID is healthy. To troubleshoot health issues, review the logs of the Docker connector, and review the troubleshooting section. |         |         |
|System role     |Indicates whether the system is productive or not. The collector agent retrieves the value by reading the SAP T000 table. This value also impacts billing. To change the role, a SAP admin needs to change the configuration in the SAP system.   |     - **Production**. The system is defined by the SAP admin as a production system.
- **Unknown (Production)**. Microsoft Sentinel couldn't retrieve the system status. Microsoft regards this type of system as a production system for both security and billing purposes.
- **Non production**. Indicates roles like developing, testing, and customizing.  
- **Agent update available**. Displayed in addition to the health status to indicate that a newer SAP connector version exists. In this case, we recommended that you [update the connector](sap/update-sap-data-connector).  | If the system role is **Production (unknown)** status, check the Microsoft Sentinel role definitions and permissions on the SAP system, and validate that the system allows Microsoft Sentinel to read the content of the T000 table. Next, consider [updating the SAP connector](sap/update-sap-data-connector) to the latest version. |

## Use an alert rule template

The Microsoft Sentinel for SAP solution includes an alert rule template designed to give you insight into the health of your SAP agent's data collection. 

[TBD - SCREENSHOT]

To turn on the analytics rule:
1. From the Microsoft Sentinel portal, select **Analytics**. 
1. Under **Rule templates**, locate the *SAP - Data collection health check* alert rule. 

The analytics rule: 

- Evaluates signals sent from the agent
- Evaluates telemetry data 
- Evaluates alerts on log continuation and other system connectivity issues, if any are found. 
- Learns the log ingestion history, and therefore works better with time. 

The algorithm needs at least seven days of loading history to detect the different seasonality patterns. We recommend a value of 14 days for the alert rule **Look back** parameter to allow detection of weekly activity profiles. 

Once activated, the algorithm judges the recent telemetry and log volume observed on the workspace according to the history learned. The algorithm will then alert on potential issues, dynamically assigning severities according to the scope of the problem.  

 

