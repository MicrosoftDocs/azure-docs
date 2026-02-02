---
author: EdB-MSFT
ms.author: edbaynash
ms.topic: include
ms.date: 02/02/2026

# This file is auto-generated . Do not edit manually. Changes will be overwritten.
---

## Deprecated Sentinel data connectors


> [!NOTE]
> The following table lists the deprecated and legacy data connectors. Deprecated connectors are no longer supported.



<a name="deprecated-github-enterprise-audit-log"></a><details><summary>**[Deprecated] GitHub Enterprise Audit Log**</summary>

**Supported by:** [Microsoft Corporation](https://azure.microsoft.com/support/options/)

The GitHub audit log connector provides the capability to ingest GitHub logs into Microsoft Sentinel. By connecting GitHub audit logs into Microsoft Sentinel, you can view this data in workbooks, use it to create custom alerts, and improve your investigation process. 

 **Note:** If you intended to ingest GitHub subscribed events into Microsoft Sentinel, please refer to GitHub (using Webhooks) Connector from "**Data Connectors**" gallery.

<p>NOTE: This data connector has been deprecated, consider moving to the CCF data connector available in the solution which replaces ingestion via the <a href='/azure/azure-monitor/logs/custom-logs-migrate' >deprecated HTTP Data Collector API</a>.</p>

**Log Analytics table(s):**  

|Table|DCR support|Lake-only ingestion|
|---|---|---|
|`GitHubAuditLogPolling_CL`|Yes|Yes|

**Data collection rule support:** [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal)

**Prerequisites:**

- **GitHub API personal access token**: You need a GitHub personal access token to enable polling for the organization audit log. You may use either a classic token with 'read:org' scope OR a fine-grained token with 'Administration: Read-only' scope.
- **GitHub Enterprise type**: This connector will only function with GitHub Enterprise Cloud; it will not support GitHub Enterprise Server. <br><br>
</details> 

 ---
   
<a name="deprecated-infoblox-soc-insight-data-connector-via-legacy-agent"></a><details><summary>**[Deprecated] Infoblox SOC Insight Data Connector via Legacy Agent**</summary>

**Supported by:** [Infoblox](https://support.infoblox.com/)

The Infoblox SOC Insight Data Connector allows you to easily connect your Infoblox BloxOne SOC Insight data with Microsoft Sentinel. By connecting your logs to Microsoft Sentinel, you can take advantage of search & correlation, alerting, and threat intelligence enrichment for each log. 

This data connector ingests Infoblox SOC Insight CDC logs into your Log Analytics Workspace using the legacy Log Analytics agent.

**Microsoft recommends installation of Infoblox SOC Insight Data Connector via AMA Connector.** The legacy connector uses the Log Analytics agent which is about to be deprecated by **Aug 31, 2024,** and should only be installed where AMA is not supported.

 Using MMA and AMA on the same machine can cause log duplication and extra ingestion cost. [More details](/azure/sentinel/ama-migrate).

**Log Analytics table(s):**  

|Table|DCR support|Lake-only ingestion|
|---|---|---|
|[`CommonSecurityLog`](/azure/azure-monitor/reference/tables/CommonSecurityLog)|Yes|Yes|

**Data collection rule support:** [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal)<br><br>
</details> 

 ---
   
<a name="deprecated-lookout"></a><details><summary>**[Deprecated] Lookout**</summary>

**Supported by:** [Lookout](https://www.lookout.com/support)

The [Lookout](https://lookout.com) data connector provides the capability to ingest [Lookout](https://esupport.lookout.com/s/article/Mobile-Risk-API-V2-Guide#commoneventfields) events into Microsoft Sentinel through the Mobile Risk API. Refer to [API documentation](https://esupport.lookout.com/s/article/Mobile-Risk-API-V2-Guide) for more information. The [Lookout](https://lookout.com) data connector provides ability to get events which helps to examine potential security risks and more.

<p>NOTE: This data connector has been deprecated, consider moving to the CCF data connector available in the solution which replaces ingestion via the <a href='/azure/azure-monitor/logs/custom-logs-migrate' >deprecated HTTP Data Collector API</a>.</p>

**Log Analytics table(s):**  

|Table|DCR support|Lake-only ingestion|
|---|---|---|
|`Lookout_CL`|No|No|

**Data collection rule support:** Not currently supported

**Prerequisites:**

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. For more information, see [Azure Functions](/azure/azure-functions/).
- **Mobile Risk API Credentials/permissions**: **EnterpriseName** & **ApiKey** are required for Mobile Risk API. For more information, see [API](https://esupport.lookout.com/s/article/Mobile-Risk-API-V2-Guide). Check all [requirements and follow  the instructions](https://esupport.lookout.com/s/article/Mobile-Risk-API-V2-Guide#authenticatingwiththemobileriskapi) for obtaining credentials.<br><br>
</details> 

 ---
   
<a name="deprecated-microsoft-exchange-logs-and-events"></a><details><summary>**[Deprecated] Microsoft Exchange Logs and Events**</summary>

**Supported by:** [Community](https://github.com/Azure/Azure-Sentinel/issues)

Deprecated, use the 'ESI-Opt' dataconnectors. You can stream all Exchange Audit events, IIS Logs, HTTP Proxy logs and Security Event logs from the Windows machines connected to your Microsoft Sentinel workspace using the Windows agent. This connection enables you to view dashboards, create custom alerts, and improve investigation. This is used by Microsoft Exchange Security Workbooks to provide security insights of your On-Premises Exchange environment

**Log Analytics table(s):**  

|Table|DCR support|Lake-only ingestion|
|---|---|---|
|[`Event`](/azure/azure-monitor/reference/tables/Event)|Yes|No|
|[`SecurityEvent`](/azure/azure-monitor/reference/tables/SecurityEvent)|Yes|Yes|
|[`W3CIISLog`](/azure/azure-monitor/reference/tables/W3CIISLog)|Yes|No|
|`MessageTrackingLog_CL`|Yes|Yes|
|`ExchangeHttpProxy_CL`|Yes|Yes|

**Data collection rule support:** [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal)

**Prerequisites:**

- Azure Log Analytics will be deprecated, to collect data from non-Azure VMs, Azure Arc is recommended. [Learn more](/azure/azure-monitor/agents/azure-monitor-agent-install?tabs=ARMAgentPowerShell,PowerShellWindows,PowerShellWindowsArc,CLIWindows,CLIWindowsArc)
- **Detailled documentation**: >**NOTE:** Detailled documentation on Installation procedure and usage can be found [here](https://aka.ms/MicrosoftExchangeSecurityGithub)<br><br>
</details> 

 ---
   
<a name="security-events-via-legacy-agent"></a><details><summary>**Security Events via Legacy Agent**</summary>

**Supported by:** [Microsoft Corporation](https://support.microsoft.com/)

You can stream all security events from the Windows machines connected to your Microsoft Sentinel workspace using the Windows agent. This connection enables you to view dashboards, create custom alerts, and improve investigation. This gives you more insight into your organization’s network and improves your security operation capabilities. For more information, see the [Microsoft Sentinel documentation](https://go.microsoft.com/fwlink/p/?linkid=2220093&wt.mc_id=sentinel_dataconnectordocs_content_cnl_csasci).

**Log Analytics table(s):**  

|Table|DCR support|Lake-only ingestion|
|---|---|---|
|[`SecurityEvent`](/azure/azure-monitor/reference/tables/SecurityEvent)|Yes|Yes|

**Data collection rule support:** [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal)<br><br>
</details> 

 ---
   
<a name="subscription-based-microsoft-defender-for-cloud-legacy"></a><details><summary>**Subscription-based Microsoft Defender for Cloud (Legacy)**</summary>

**Supported by:** [Microsoft Corporation](https://support.microsoft.com/)

Microsoft Defender for Cloud is a security management tool that allows you to detect and quickly respond to threats across Azure, hybrid, and multi-cloud workloads. This connector allows you to stream your security alerts from Microsoft Defender for Cloud into Microsoft Sentinel, so you can view Defender data in workbooks, query it to produce alerts, and investigate and respond to incidents.

[For more information>](https://aka.ms/ASC-Connector)

**Log Analytics table(s):**  

|Table|DCR support|Lake-only ingestion|
|---|---|---|
|[`SecurityAlert`](/azure/azure-monitor/reference/tables/SecurityAlert)|Yes|Yes|

**Data collection rule support:** [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal)<br><br>
</details> 

 ---
   
<a name="syslog-via-legacy-agent"></a><details><summary>**Syslog via Legacy Agent**</summary>

**Supported by:** [Microsoft Corporation](https://support.microsoft.com/)

Syslog is an event logging protocol that is common to Linux. Applications will send messages that may be stored on the local machine or delivered to a Syslog collector. When the Agent for Linux is installed, it configures the local Syslog daemon to forward messages to the agent. The agent then sends the message to the workspace.

[Learn more >](https://aka.ms/sysLogInfo)

**Log Analytics table(s):**  

|Table|DCR support|Lake-only ingestion|
|---|---|---|
|[`Syslog`](/azure/azure-monitor/reference/tables/Syslog)|Yes|Yes|

**Data collection rule support:** [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal)<br><br>
</details> 

 ---
   