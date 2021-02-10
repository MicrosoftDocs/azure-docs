---
title: What's new in Azure Sentinel
description: This article describes new features in Azure Sentinel from the past few months.
services: sentinel
author: batamig
ms.author: bagol
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.topic: conceptual
ms.date: 02/04/2021
---

# What's new in Azure Sentinel

This article lists recent features added for Azure Sentinel, and new features in related services that provide an enhanced user experience in Azure Sentinel.

For information about earlier features delivered, see our [Tech Community blogs](https://techcommunity.microsoft.com/t5/azure-sentinel/bg-p/AzureSentinelBlog/label-name/What's%20New).

Noted features are currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.


> [!TIP]
> Our threat hunting teams across Microsoft contribute queries, playbooks, workbooks, and notebooks to the [Azure Sentinel Community](https://github.com/Azure/Azure-Sentinel), including specific [hunting queries](https://github.com/Azure/Azure-Sentinel) that your teams can adapt and use. 
>
> You can also contribute! Join us in the [Azure Sentinel Threat Hunters GitHub community](https://github.com/Azure/Azure-Sentinel/wiki).
> 

## January 2021

- [Analytics rule wizard: Improved query editing experience (public preview)](#analytics-rule-wizard-improved-query-editing-experience-public-preview)
- [Az.SecurityInsights PowerShell module (Public preview)](#azsecurityinsights-powershell-module-public-preview)
- [SQL database connector](#sql-database-connector)
- [Improved incident comments](#improved-incident-comments)
- [Dedicated Log Analytics clusters](#dedicated-log-analytics-clusters)
- [Logic apps managed identities](#logic-apps-managed-identities)
- [Improved rule tuning with the analytics rule preview graphs](#improved-rule-tuning-with-the-analytics-rule-preview-graphs-public-preview)


### Analytics rule wizard: Improved query editing experience (public preview)

The Azure Sentinel Scheduled analytics rule wizard now provides the following enhancements for writing and editing queries:

-	An expandable editing window, providing you with more screen space to view your query.
-	Key word highlighting in your query code.
-	Expanded auto-complete support.
-	Real-time query validations. Errors in your query now show as a red block in the scroll bar, and as a red dot in the **Set rule logic** tab name. Additionally, a query with errors cannot be saved.

For more information, see [Tutorial: Detect threats out-of-the-box](tutorial-detect-threats-built-in.md).
### Az.SecurityInsights PowerShell module (Public preview)

Azure Sentinel now supports the new [Az.SecurityInsights](https://www.powershellgallery.com/packages/Az.SecurityInsights/) PowerShell module.

The **Az.SecurityInsights** module supports common Azure Sentinel use cases, like interacting with incidents to change statues, severity, owner, and so on, adding comments and labels to incidents, and creating bookmarks.

Although we recommend using [Azure Resource Manager (ARM)](/azure/azure-resource-manager/templates/) templates for your CI/CD pipeline, the **Az.SecurityInsights** module is useful for post-deployment tasks, and is targeted for SOC automation.  For example, your SOC automation might include steps to configure data connectors, create analytics rules, or add automation actions to analytics rules.

For more information, including a full list and description of the available cmdlets, parameter descriptions, and examples, see the [Az.SecurityInsights PowerShell documentation](/powershell/module/az.securityinsights/).

### SQL database connector

Azure Sentinel now provides an Azure SQL database connector, which you to stream your databases' auditing and diagnostic logs into Azure Sentinel and continuously monitor activity in all your instances.

Azure SQL is a fully managed, Platform-as-a-Service (PaaS) database engine that handles most database management functions, such as upgrading, patching, backups, and monitoring, without user involvement.

For more information, see [Connect Azure SQL database diagnostics and auditing logs](connect-azure-sql-logs.md).

### Improved incident comments

Analysts use incident comments to collaborate on incidents, documenting processes and steps manually or as part of a playbook. 

Our improved incident commenting experience enables you to format your comments and edit or delete existing comments.

For more information, see [Automatically create incidents from Microsoft security alerts](create-incidents-from-alerts.md).
### Dedicated Log Analytics clusters

Azure Sentinel now supports dedicated Log Analytics clusters as a deployment option. We recommend considering a dedicated cluster if you:

- **Ingest over 1 Tb per day** into your Azure Sentinel workspace
- **Have multiple Azure Sentinel workspaces** in your Azure enrollment

Dedicated clusters enable you to use features like customer-managed keys, lockbox, double encryption, and faster cross-workspace queries when you have multiple workspaces on the same cluster.

For more information, see [Azure Monitor logs dedicated clusters](https://docs.microsoft.com/azure/azure-monitor/log-query/logs-dedicated-clusters).

### Logic apps managed identities

Azure Sentinel now supports managed identities for the Azure Sentinel Logic Apps connector, enabling you to grant permissions directly to a specific playbook to operate on Azure Sentinel instead of creating extra identities.

- **Without a managed identity**, the Logic Apps connector requires a separate identity with an Azure Sentinel RBAC role in order to run on Azure Sentinel. The separate identity can be an Azure AD user or a Service Principal, such as an Azure AD registered application.

- **Turning on managed identity support in your Logic App** registers the Logic App with Azure AD and provides an object ID. Use the object ID in Azure Sentinel to assign the Logic App with an Azure RBAC role in your Azure Sentinel workspace. 

For more information, see:

- [Authenticating with Managed Identity in Azure Logic Apps](/azure/logic-apps/create-managed-service-identity)
- [Azure Sentinel Logic Apps connector documentation](/connectors/azuresentinel) 

### Improved rule tuning with the analytics rule preview graphs (Public preview)

Azure Sentinel now helps you better tune your analytics rules, helping you to increase their accuracy and decrease noise.

After editing an analytics rule on the **Set rule logic** tab, find the **Results simulation** area on the right. 

Select **Test with current data** to have Azure Sentinel run a simulation of the last 50 runs of your analytics rule. A graph is generated to show the average number of alerts that the rule would have generated, based on the raw event data evaluated. 

For more information, see [Define the rule query logic and configure settings](tutorial-detect-threats-custom.md#define-the-rule-query-logic-and-configure-settings).

## December 2020

- [80 new built-in hunting queries](#80-new-built-in-hunting-queries)
- [Log Analytics agent improvements](#log-analytics-agent-improvements)

### 80 new built-in hunting queries
 
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

The added hunting queries are designed to help you find suspicious activity in your environment. While they may return legitimate activity and potentially malicious activity, they can be useful in guiding your hunting. 

If after running these queries, you are confident with the results, you may want to convert them to analytics rules or add hunting results to existing or new incidents.

All of the added queries are available via the Azure Sentinel Hunting page. For more information, see [Hunt for threats with Azure Sentinel](hunting.md).

### Log Analytics agent improvements

Azure Sentinel users benefit from the following Log Analytics agent improvements:

- **Support for more operating systems**, including CentOS 8, RedHat 8, and SUSE Linux 15.
- **Support for Python 3** in addition to Python 2

Azure Sentinel uses the Log Analytics agent to sent events to your workspace, including Windows Security events, Syslog events, CEF logs, and more.

> [!NOTE]
> The Log Analytics agent is sometimes referred to as the OMS Agent or the Microsoft Monitoring Agent (MMA). 
> 

For more information, see the [Log Analytics documentation](/azure/azure-monitor/platform/log-analytics-agent) and the [Log Analytics agent release notes](https://github.com/microsoft/OMS-Agent-for-Linux/releases).
## November 2020

- [Monitor your Logic Apps Playbooks in Azure Sentinel](#monitor-your-logic-apps-playbooks-in-azure-sentinel)
- [Microsoft 365 Defender connector (Public preview)](#microsoft-365-defender-connector-public-preview)
### Monitor your Logic Apps Playbooks in Azure Sentinel

Azure Sentinel now integrates with [Azure Log Apps](/azure/logic-apps/), a cloud service that helps you schedule, automate, and orchestrate tasks, business processes, and workflows.

Use an Azure Logic App in Azure Sentinel as a playbook, which can be automatically invoked when an incident is created, or when triaging and working with incidents. 

To provide insights into the health, performance, and usage of your playbooks, including any that you add with Azure Logic Apps, we've added an [Azure Workbook](/azure/azure-monitor/platform/workbooks-overview) named **Playbooks health monitoring**. 

Use the **Playbooks health monitoring** workbook to monitor the health of your playbooks, or look for anomalies in the amount of succeeded or failed runs. 

The **Playbooks health monitoring** workbook is now available in the Azure Sentinel Templates gallery:

:::image type="content" source="media/whats-new/playbook-monitoring-workbook.gif" alt-text="Sample Playbooks health monitoring workbook":::

For more information, see:

- [Logic Apps documentation](/azure/logic-apps/monitor-logic-apps-log-analytics#set-up-azure-monitor-logs)

- [Azure Monitor documentation](/azure/azure-monitor/platform/activity-log#send-to-log-analytics-workspace)

### Microsoft 365 Defender connector (Public preview)
 
The Microsoft 365 Defender connector for Azure Sentinel enables you to stream advanced hunting logs (a type of raw event data) from Microsoft 365 Defender into Azure Sentinel. 

With the integration of [Microsoft Defender for Endpoint (MDATP)](/windows/security/threat-protection/) into the [Microsoft 365 Defender](/microsoft-365/security/mtp/microsoft-threat-protection) security umbrella, you can now collect your Microsoft Defender for Endpoint advanced hunting events using the Microsoft 365 Defender connector, and stream them straight into new purpose-built tables in your Azure Sentinel workspace. 

The Azure Sentinel tables are built on the same schema that's used in the Microsoft 365 Defender portal, and provide you with complete access to the full set of advanced hunting logs. 

For more information, see [Connect data from Microsoft 365 Defender to Azure Sentinel](connect-microsoft-365-defender.md).

> [!NOTE]
> Microsoft 365 Defender was formerly known as Microsoft Threat Protection or MTP. Microsoft Defender for Endpoint was formerly known as Microsoft Defender Advanced Threat Protection or MDATP.
> 

## Next steps

> [!div class="nextstepaction"]
>[On-board Azure Sentinel](quickstart-onboard.md)

> [!div class="nextstepaction"]
>[Get visibility into alerts](quickstart-get-visibility.md)
