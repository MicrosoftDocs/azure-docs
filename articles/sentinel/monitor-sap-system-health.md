---
title: Monitor the health of the connection between Microsoft Sentinel and your SAP system
description: Use the SAP connector page and a dedicated alert rule template to keep track of your SAP systems' connectivity and performance.
author: batamig
ms.author: bagol
ms.topic: how-to
ms.date: 12/10/2024
ms.service: microsoft-sentinel
zone_pivot_groups: sentinel-sap-connection
#customerIntent: As a security engineer, I want to learn how to monitor the health and connectivity of our SAP system connection to Microsoft Sentinel.

---

# Monitor the health and role of your SAP systems

After you [deploy the SAP solution](sap/deployment-overview.md), you want to ensure proper functioning and performance of your SAP systems, and keep track of your system health, connectivity, and performance. This article describes how you can check the connectivity health manually on the data connector page and use a dedicated alert rule template to monitor the health of your SAP systems.

:::zone pivot="connection-agent"
> [!IMPORTANT]
> Monitoring the health of your SAP systems is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

For a video demonstration of the procedures in this article, watch the following video:
<br><br>
> [!VIDEO https://www.youtube.com/embed/FasuyBSIaQM?si=apdesRR29Lvq6aQM]

:::zone-end

:::zone pivot="connection-agentless"

> [!IMPORTANT]
> Monitoring the health of your SAP systems is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>
> Microsoft Sentinel's **Agentless solution** is in limited preview as a prereleased product, which may be substantially modified before it’s commercially released. Microsoft makes no warranties expressed or implied, with respect to the information provided here. Access to the **Agentless solution** also [requires registration](https://aka.ms/SentinelSAPAgentlessSignUp) and is only available to approved customers and partners during the preview period. For more information, see [Microsoft Sentinel for SAP goes agentless ](https://community.sap.com/t5/enterprise-resource-planning-blogs-by-members/microsoft-sentinel-for-sap-goes-agentless/ba-p/13960238).

:::zone-end

## Prerequisites

- Before you can perform the procedures in this article, you need to have an SAP data connector connected to your SAP system. SAP logs aren't displayed in the Microsoft Sentinel **Logs** page until your SAP system is connected and data starts streaming into Microsoft Sentinel.

For more information, see [Connect your SAP system to Microsoft Sentinel](sap/deploy-data-connector-agent-container.md).

:::zone pivot="connection-agent"

## Check your data connector's health and connectivity

This procedure describes how to check your data connector's connection status from the **Microsoft Sentinel for SAP** data connector page.

1. In Microsoft Sentinel, select **Data connectors** and search for *Microsoft Sentinel for SAP*.

1. Select the **Microsoft Sentinel for SAP** connector and select **Open connector page**.

1. In the **Configuration > 2. Configure an SAP system and assign it to a collector agent** area, view details about the health of your SAP systems.

    For example:

    :::image type="content" source="media/monitor-sap-system-health/health-status.png" alt-text="Screenshot of the Microsoft Sentinel for SAP applications health status table." lightbox="media/monitor-sap-system-health/health-status.png":::

    The fields in the **Configure an SAP system and assign it to a collector agent** area are described as follows:

    - **System display name**. The SAP system ID (SID) and its client number. Together, this value qualifies the connection to the SAP system and defines for SAP BASIS which system you're connecting to.

    - **System role**. Indicates whether the system is production state or not, which also affects billing. For more information, see [Solution pricing](sap/solution-overview.md#solution-pricing). Values include:

        |Value  |Description  |
        |---------|---------|
        |**Production**     |  The system is defined by the SAP admin as a production system.       |
        |**Unknown (Production)**     | Microsoft Sentinel couldn't retrieve the system status. Microsoft Sentinel regards this type of system as a production system for both security and billing purposes.  <br><br>In such cases, we recommend that you check the Microsoft Sentinel role definitions and permissions on the SAP system, and validate that the system allows Microsoft Sentinel to read the content of the T000 table. Next, consider [updating the SAP connector](sap/update-sap-data-connector.md) to the latest version.       |
        |**Non production**     | Indicates roles like developing, testing, and customizing.        |

    - **Agent name**. Unique ID of the installed data connector agent.

    - **Health**. Indicates whether the SID is healthy. To troubleshoot health issues, [review the container execution logs](sap/sap-deploy-troubleshoot.md#view-all-container-execution-logs) and review other [troubleshooting steps](sap/sap-deploy-troubleshoot.md). Values include:

        |Value  |Description  |
        |---------|---------|
        | **System healthy** (green icon)| Indicates that Microsoft Sentinel identified both logs and a heartbeat from the system.|
        | **System Connected – unauthorized to collect role, production assumed** (yellow icon) | Microsoft Sentinel doesn't have sufficient permissions to define whether the system is a production system. In this case, Microsoft Sentinel defines the system as a production system. <br><br>In such cases, check the Microsoft Sentinel role definitions and permissions on the SAP system, and validate that the system allows Microsoft Sentinel to read the content of the T000 table. Next, consider [updating the SAP connector](sap/update-sap-data-connector.md) to the latest version.    |
        | **Connected with errors** (yellow icon) | Connection was successful but Microsoft Sentinel detected errors when fetching the system role and doesn't have the details of whether the system is or isn't a production system. |
        | **System not connected** | Microsoft Sentinel was unable to connect to the SAP system, and cannot fetch the system role. In this case, Microsoft Sentinel doesn't have the details of whether the system is or isn't a production system.        |
        | Other statuses that reflect more details about connectivity issues | For example, **System unreachable for over 1 day**. |

:::zone-end

## View SAP logs streaming into Microsoft Sentinel

In Microsoft Sentinel, select **General** > **Logs > Custom logs** to view the logs streaming in from the SAP system. For example:

:::image type="content" source="sap/media/deploy-sap-security-content/sap-logs-in-sentinel.png" alt-text="Screenshot that shows the SAP ABAP logs in the Custom Logs area in Microsoft Sentinel." lightbox="sap/media/deploy-sap-security-content/sap-logs-in-sentinel.png":::

For more information, see [Microsoft Sentinel solution for SAP applications solution logs reference](sap-solution-log-reference.md).

## Check the SentinelHealth table for health indicators

The **SentinelHealth** table in Microsoft Sentinel contains health indicators for the SAP data connector, among others. You can query this table to get a summary of the health of your SAP systems.

For more information, see:

- [Auditing and health monitoring in Microsoft Sentinel](health-audit.md)
- [Turn on auditing and health monitoring for Microsoft Sentinel (preview)](enable-monitoring.md)
- [Monitor the health of your data connectors](monitor-data-connector-health.md)
- [Microsoft Sentinel health tables reference](health-table-reference.md)

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

- Learn about the [Microsoft Sentinel Solution for SAP](sap/solution-overview.md)
- Learn how to [deploy the Microsoft Sentinel Solution for SAP](sap/deployment-overview.md)
- Learn about [auditing and health monitoring](health-audit.md) in other areas of Microsoft Sentinel
