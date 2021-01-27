---
title: What's new in Azure Sentinel
description: This article describes new features in Azure Sentinel from the past few months.
services: sentinel
author: batamig
ms.author: bagol
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.topic: conceptual
ms.date: 01/27/2021
---

# What's new in Azure Sentinel

This article lists recent features added for Azure Sentinel. 

For information about earlier features delivered , see our [Tech Community blogs](https://techcommunity.microsoft.com/t5/azure-sentinel/bg-p/AzureSentinelBlog/label-name/What's%20New).

> [!TIP]
> Our threat hunting teams across Microsoft contribute queries, playbooks, workbooks, and notebooks to the [Azure Sentinel Community](https://github.com/Azure/Azure-Sentinel), including specific [hunting queries](https://github.com/Azure/Azure-Sentinel) that your teams can adapt and use. 
>
> You can also contribute! Join us in the [Azure Sentinel Threat Hunters GitHub community](https://github.com/Azure/Azure-Sentinel/wiki).
> 

## Dedicated clusters for Azure Sentinel

**Released**: Jan 18, 2021

Azure Sentinel now supports dedicated Log Analytics clusters as a deployment option. We recommend considering a dedicated cluster if you:

- **Ingest over 1Tb per day** into your Azure Sentinel workspace
- **Have multiple Azure Sentinel workspaces** in your Azure enrolment

> [!NOTE]
> Azure Sentinel uses Log Analytics as the underlying data store. Linked official documentation for dedicated clusters may also refer to Azure Monitor, as Log Analytics is part of the wider Azure Monitor platform. 
>

When you use a dedicated Log Analytics cluster for Azure Sentinel, you're provided with dedicated hardware in an Azure data center to run your Azure Sentinel instance. Your dedicated cluster enables the following features:

- **Customer-managed keys (CMK)**. Encrypt your cluster data using keys provided and controlled by you.

- **Lockbox**. Control the Microsoft support engineering access requests for data.

- **Double encryption**. Protect against a scenario where one of the encryption algorithms or keys may be compromised. In this case, the additional layer of encryption continues to protect your data.

- **Multiple Azure Sentinel workspaces**: 

    - Any cross-workspace queries will run faster when all the workspaces involved are on the same, dedicated cluster. We still recommend having as few workspaces as possible in your environment, and dedicated clusters still have a limit of 100 workspaces per cross-workspace query.
    
    - Save costs and efficiency, as any workspaces on the same dedicated cluster share the Log Analytics capacity reservation set for the cluster. 
    
        Dedicated clusters require a commitment of a minimum Log Analytics capacity reservation of 1Tb of ingestion per day.

The following image illustrates the differences between using separate, individual workspaces, and sharing multiple workspaces on the same cluster:

:::image type="content" source="media/whats-new/dedicated-cluster-compare.png" alt-text="Compare individual workspaces to multiple workspaces on a dedicated cluster":::

### Considering migrating to a dedicated cluster?
 
There are some considerations and limitations for using dedicated clusters:

- Maximum number of dedicated clusters per region and subscription: **2**

- All workspaces linked to a specific dedicated cluster must be in the same region.

- Moving your cluster to another resource group or subscription is not supported.

- Maximum number of linked workspaces to a specific dedicated cluster: **1000**

- You can link a workspaces to a cluster, and then unlink it.

    - Maximum number of workspace link operations for a specific workspace: **2 operations in a period of 30 days**

    - Linking a workspace to a cluster will fail if it is already linked to another cluster.

- Moving an existing workspace to a CMK cluster is not supported. In such cases, you must create the workspace in the cluster. 

For more information, see the [Azure Monitor documentation](/azure/azure-monitor/log-query/logs-dedicated-clusters).

## Managed Identity for the Azure Sentinel Logic Apps connector

**Released** Jan 17, 2021

Azure Sentinel now supports managed identities for the Azure Sentinel Logic Apps connector, enabling you to grant permissions to a directly to a specific playbook to operate on Azure Sentinel instead of creating additional identities.

- **Without a managed identity**, the Logic Apps connector requires a separate identity with an Azure Sentinel RBAC role in order to run on Azure Sentinel. The separate identity can be an Azure AD user or a Service Principal, such as an Azure AD registered application.

- **Turning on managed identity support in your Logic App** registers the Logic App with Azure AD and provides an object ID. Use the object ID in Azure Sentinel to assign the Logic App with an Azure RBAC role in your Azure Sentinel workspace. 

**To use your Logic App managed identity to authenticate to Azure Sentinel**:

1. In your Logic App, go to **Identity** > **System assigned**, and set the **Status** to **On**.

    The system confirms that your Logic App was registered with Azure Active Directory, and also displays an Object ID value.

1. In Azure Sentinel, go to **Settings** > **Workspace Settings** > **Access Control (IAM)**, and select  **Add** > **Add role assignement**. 

    In the **Add role assingment** area, select **Azure Sentinel Responder**, and then search for your Logic App playbook name. Select your playbook and then save your changes.

1. In your Logic App designer, in any of the Azure Sentinel connector steps, select **Connect with managed identity**. Enter a meaningful name to identify the connection, and then select **Create**. 

For more information, see:

- [Authenticating with Managed Identity in Azure Logic Apps](/azure/logic-apps/create-managed-service-identity)
- [Azure Sentinel Logic Apps connector documentation](/connectors/azuresentinel) 

## Improved rule tuning with the analytics rule preview graphs (public preview)

**Released** Jan 5, 2021

Azure Sentinel now helps you better tune your analytics rules, helping you to increase their accuracy and decrease noise.

After editing an analytics rule on the **Set rule logic** tab, find the **Results simulation** area on the right. 

Select **Test with current data** to have Azure Sentinel run a simulation of the the last 50 runs of your analytics rule. A graph is generated to show the average number of alerts that the rule would have generated, based on the raw event data evaluated. 

In this graph:

- The **Threshold** value specifies the number of query results required to trigger an alert
- The **Alerts per day** value indicates the average number of alerts generated across the time period shown
- **Hover** over a specific data point on the graph to see the number of events at that specific point in time. 
- **Click** on a point in the graph to jump to the Log Analytics query page, with a list of the actual events that occurred at that point.

For more information, see [Tutorial: Create custom analytics rules to detect threats](tutorial-detect-threats-custom.md).

## 80 new built-in hunting queries

**Released** Dec 7, 2020
 
Azure Sentinel's built-in hunting queries empower SOC analysts to reduce gaps in current detection coverage and ignite new hunting leads.

This update for Azure Sentinel includes new hunting queries that provide coverage across the MITRE ATT&CK framework matrix:

- **Collection**
- **Command and Control**
- **Credential Access**
- **Discovery**
- **Execution**
- **Exfiltration**
- **Impact**
- **Initial Access**
- **Persistence**
- **Privilege Escalation**

The added hunting queries are designed to help you find suspicious activity in your environment. While they may return legitimate activity as well as potentially malicious activity, they can be useful in guiding your hunting. 

If, after running these queries, you are confident with the results, you may want to convert them to analytics rules or add hunting results to existing or new incidents.

All of the added queries are available via the Azure Sentinel Hunting page. For more information, see [Hunt for threats with Azure Sentinel](hunting.md).

## Monitor your Logic Apps Playbooks in Azure Sentinel

**Released** Nov 10, 2020

Azure Sentinel now integrates with [Azure Log Apps](/azure/logic-apps/), a cloud service that helps you schedule, automate, and orchestrate tasks, business processes, and workflows.

Use an Azure Logic App in Azure Sentinel as a playbook, which can be automatically invoked when an incident is created, or when triaging and working with incidents. 

To provide insights into the health, performance, and usage of your playbooks, including any that you add with Azure Logic Apps, we've added an [Azure Workbook](/azure/azure-monitor/platform/workbooks-overview) named **Playbooks health monitoring**. 

Use the **Playbooks health monitoring** workbook to monitor the health of your playbooks, or look for anomalies in the amount of succeeded or failed runs. 

Spot out-of-the-ordinary playbooks that may run unexpectedly long, and monitor and manage changes made by users, especially for critical playbooks. View runtimes at a glace for specific logic apps, giving you a quick estimate for usage costs.

The **Playbooks health monitoring** workbook is now available in the Azure Sentinel Templates gallery:

:::image type="content" source="media/whats-new/playbook-monitoring-workbook.gif" alt-text="Sample Playbooks health monitoring workbook":::




### Playbooks health monitoring workbook insights

The **Playbooks health monitoring** workbook provides the following insights:

|Workbook tab  |Insights  |
|---------|---------|
|**Overview**     |  Displays the following insights: <br><br> - **Successes and failures over time**:  Shows success and failures for each Logic App run, as well as a line chart for data over time to help you spot anomolies. Select a time range to drill down to a more specific time range. <br><br>-  **Failure percentage per Logic App**: For each Logic App, view failure percentages and failures over time, the numbers of runs started and completed, as well as the run latency (the Logic App's duration runtime). <br><br>- **Logic Apps by status**: View the numbers and trends of successful and failed Logic Apps by status. Select **Failed** or **Succeeded** to update the grids, where you can select a specific Logic App to learn more.     |
|**Activity**     |Provides data from the Azure Activity table, with the following insights: <br><br>- **Logic App activities by user** <br><br>- **API connection activities** (by user) <br><br>- **Logic App activities by Logic App**, grouping Logic App activity by Logic App, but also displaying user data         |
|**Billable Info**     |   Shows the total billable executions per subscription. <br><br>Collapse the subscription to display details for each Logic App, which enables you to estimate your costs using the pricing calculator and become more cost effective.      |
|     |         |

> [!NOTE]
> When switching between tabs in the **Playbooks health monitoring** workbook, refresh each tab to show updated data.
>

### Playbooks health monitoring workbook configuration requirements

- **Logic Apps configuration**: For the **Playbooks health monitoring** workbook to display data, you must enable diagnostic settings for any Logic Apps you want to monitor. 

    Ensure that you've selected the **Send to Log Analytics** option in the diagnostics settings to send your data to the configured Log Analytics workspace. Your data is stored in the AzureDiagnostics table, and your configured workspace does not need to be your Sentinel workspace.

    For more information, see the [Logic Apps documentation](/azure/logic-apps/monitor-logic-apps-log-analytics#set-up-azure-monitor-logs).

- **Activity log configuration**: The **Activity** tab data is based on activity logs. Make sure that you have activity logs configured to send the data to your chosen Log Analytics workspace. 

    For more information, see the [Azure Monitor documentation](/azure/azure-monitor/platform/activity-log#send-to-log-analytics-workspace)
 

## Microsoft 365 Defender connector (Public preview)
 
**Released** Nov 9, 2020

The Microsoft 365 Defender connector for Azure Sentinel enables you to stream advanced hunting logs (a type of raw event data) from Microsoft 365 Defender into Azure Sentinel. 

With the integration of [Microsoft Defender for Endpoint (MDATP)](/windows/security/threat-protection/) into the [Microsoft 365 Defender](/microsoft-365/security/mtp/microsoft-threat-protection) security umbrella, you can now collect your Microsoft Defender for Endpoint advanced hunting events using the Microsoft 365 Defender connector, and stream them straight into new purpose-built tables in your Azure Sentinel workspace. 

The Azure Sentinel tables are built on the same schema that's used in the Microsoft 365 Defender portal, and provide you with complete access to the full set of advanced hunting logs. 

**Access to advanced hunting logs enables you to**:

- Copy your existing Microsoft Defender ATP advanced hunting queries directly into Azure Sentinel.

- Use the raw event logs to provide more insights for your alerts, hunting, and investigations, and correlate events with data from other data sources in Azure Sentinel.

- Store the logs with increased retention, beyond Microsoft Defender for Endpoint or Microsoft 365 Defender’s default retention of 30 days. 

    Configuring the retention for your workspace, or configure per-table retention in Log Analytics.

For more information, see [Connect data from Microsoft 365 Defender to Azure Sentinel](connect-microsoft-365-defender.md).

> [!NOTE]
> Microsoft 365 Defender was formerly known as Microsoft Threat Protection or MTP. Microsoft Defender for Endpoint was formerly known as Microsoft Defender Advanced Threat Protection or MDATP.
> 



## Next steps

> [!div class="nextstepaction"]
>[On-board Azure Sentinel](quickstart-onboard.md)

> [!div class="nextstepaction"]
>[Get visibility into alerts](quickstart-get-visibility.md)
