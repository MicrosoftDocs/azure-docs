---
title: Monitor the health of the connection between Microsoft Sentinel and your SAP system
description: Use the SAP connector page and a dedicated alert rule template to keep track of your SAP systems' connectivity and performance.
author: batamig
ms.author: bagol
ms.topic: how-to
ms.date: 09/16/2024
ms.service: microsoft-sentinel
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
#Customer intent: As a security engineer, I want to monitor the health of my deploy and configure a monitoring solution for SAP applications so that I can detect and respond to security threats within my SAP environment.
---

# Monitor the health of the connection between Microsoft Sentinel and your SAP system

After you [deploy the SAP solution](sap/deployment-overview.md), you want to ensure proper functioning and performance of your SAP systems, and keep track of your system health, connectivity, and performance. This article describes how you can check the connectivity health manually on the data connector page and use a dedicated alert rule template to monitor the health of your SAP systems.

> [!IMPORTANT]
> Monitoring the health of your SAP systems is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

Before you can perform the procedures in this article, you need to have a SAP data connector agent deployed and connected to your SAP system. For more information, see [Deploy and configure the container hosting the SAP data connector agent](sap/deploy-data-connector-agent-container.md).

## Check health and connectivity

We recommend periodically checking on your data connector agent's health and connectivity.

For a video demonstration of this procedure, watch the following video:
<br>
> [!VIDEO https://www.youtube.com/embed/FasuyBSIaQM?si=apdesRR29Lvq6aQM]


1. To confirm your data connector agent's connection, go to the **Microsoft Sentinel for SAP** data connector page and check the connection status:

    1. In Microsoft Sentinel, select **Data connectors** and search for *Microsoft Sentinel for SAP*.
    1. Select the **Microsoft Sentinel for SAP** connector and select **Open connector page**.
    1. In the **Configuration > Configure an SAP system and assign it to a collector agent** area, view details about the health of your SAP systems

    For example:

    :::image type="content" source="media/monitor-sap-system-health/health-status.png" alt-text="Screenshot of the health status table." lightbox="media/monitor-sap-system-health/health-status.png":::

    The following table describes the different fields in the **Configure an SAP system and assign it to a collector agent** area.

    |Field  |Description  |Values  |Notes  |
    |---------|---------|---------|---------|
    |**SID**     |The name of the connected SAP system ID (SID).  |         |         |
    |**System role**     |Indicates whether the system is productive or not. The data connector agent retrieves the value by reading the SAP T000 table. This value also impacts billing. To change the role, an SAP admin needs to change the configuration in the SAP system.   |• **Production**. The system is defined by the SAP admin as a production system.<br>• **Unknown (Production)**. Microsoft Sentinel couldn't retrieve the system status. Microsoft Sentinel regards this type of system as a production system for both security and billing purposes.<br>• **Non production**. Indicates roles like developing, testing, and customizing.<br>• **Agent update available**. Displayed in addition to the health status to indicate that a newer SAP connector version exists. In this case, we recommended that you [update the connector](sap/update-sap-data-connector.md).  | If the system role is **Production (unknown)**, check the Microsoft Sentinel role definitions and permissions on the SAP system, and validate that the system allows Microsoft Sentinel to read the content of the T000 table. Next, consider [updating the SAP connector](sap/update-sap-data-connector.md) to the latest version. |
    |**Agent name** |Unique ID of the installed data connector agent. |         |         |
    |**Health**  |Indicates whether the SID is healthy. To troubleshoot health issues, [review the container execution logs](sap/sap-deploy-troubleshoot.md#view-all-container-execution-logs) and review other [troubleshooting steps](sap/sap-deploy-troubleshoot.md). |• **System healthy** (green icon): Indicates that Microsoft Sentinel identified both logs and a heartbeat from the system.<br>• **System Connected – unauthorized to collect role, production assumed** (yellow icon): Microsoft Sentinel doesn't have sufficient permissions to define whether the system is a production system. In this case, Microsoft Sentinel defines the system as a production system. To allow Microsoft Sentinel to receive the system status, review the Notes column.<br>• **Connected with errors** (yellow icon): Microsoft Sentinel detected errors when fetching the system role. In this case, Microsoft Sentinel received data regarding whether the system is or isn't a production system.<br>• **System not connected**: Microsoft Sentinel was unable to connect to the SAP system, and cannot fetch the system role. In this case, Microsoft Sentinel received data regarding whether the system is or isn't a production system.<br><br>Other statuses, like **System unreachable for over 1 day**, indicate the connectivity status.          |If the system health status is **System Connected – unauthorized to collect role, production assumed**, check the Microsoft Sentinel role definitions and permissions on the SAP system, and validate that the system allows Microsoft Sentinel to read the content of the T000 table. Next, consider [updating the SAP connector](sap/update-sap-data-connector.md) to the latest version.         |

1. Select **Logs > Custom logs** to view the logs streaming in from the SAP system. For example:

    :::image type="content" source="sap/media/deploy-sap-security-content/sap-logs-in-sentinel.png" alt-text="Screenshot that shows the SAP ABAP logs in the Custom Logs area in Microsoft Sentinel." lightbox="media/deploy-sap-security-content/sap-logs-in-sentinel.png":::

    SAP logs aren't displayed in the Microsoft Sentinel **Logs** page until your SAP system is connected and data starts streaming into Microsoft Sentinel.

    For more information, see [Microsoft Sentinel solution for SAP applications solution logs reference](sap-solution-log-reference.md).


## Use an alert rule template to monitor the health of your SAP systems

The Microsoft Sentinel for SAP solution includes an alert rule template designed to give you insight into the health of your SAP agent's data collection.

The rule needs at least seven days of loading history to detect the different seasonality patterns. We recommend a value of 14 days for the alert rule **Look back** parameter to allow detection of weekly activity profiles. 

Once activated, the rule judges the recent telemetry and log volume observed on the workspace according to the history learned. The rule then alerts on potential issues, dynamically assigning severities according to the scope of the problem. 

To turn on the analytics rule in Microsoft Sentinel, select **Analytics > Rule templates**, and locate the *SAP - Data collection health check* alert rule. 

The analytics rule does the following:

- Evaluates signals sent from the agent.
- Evaluates telemetry data. 
- Evaluates alerts on log continuation and other system connectivity issues, if any are found. 
- Learns the log ingestion history, and therefore works better with time. 

The following screenshot shows an example of an alert generated by the *SAP - Data collection health check* alert rule:

:::image type="content" source="media/monitor-sap-system-health/alert-rule-example.png" alt-text="Screenshot of an alert triggered by the SAP - Data collection health check alert rule.":::

## Related content

For more information, see:

- [Microsoft Sentinel solution for SAP applications](sap/solution-overview.md)
- [Deployment guide for Microsoft Sentinel](deploy-overview.md)
- [Auditing and health monitoring in Microsoft Sentinel](health-audit.md)
