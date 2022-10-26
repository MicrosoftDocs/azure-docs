---
title: Find your Microsoft Sentinel data connector | Microsoft Docs
description: Learn about specific configuration steps for Microsoft Sentinel data connectors.
author: cwatson-cat
ms.topic: reference
ms.date: 01/04/2022
ms.author: cwatson
ms.custom: ignite-fall-2021
---

# Find your Microsoft Sentinel data connector

This article describes how to deploy data connectors in Microsoft Sentinel, listing all supported, out-of-the-box data connectors, together with links to generic deployment procedures, and extra steps required for specific connectors.

Some data connectors are deployed only via solutions. For more information, see the [Discover and deploy Microsoft Sentinel out-of-the-box content and solutions](sentinel-solutions-deploy.md). You can also find other, community-built data connectors in the [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/DataConnectors).

## How to use this guide

1. First, locate and select the connector for your product, service, or device in the headings menu to the right.

    The first piece of information you'll see for each connector is its **data ingestion method**. The method that appears there will be a link to one of the following generic deployment procedures, which contain most of the information you'll need to connect your data sources to Microsoft Sentinel:

    | Data ingestion method | Linked article with instructions |
    | --- | --- |
    | **Azure service-to-service integration** | [Connect to Azure, Windows, Microsoft, and Amazon services](connect-azure-windows-microsoft-services.md) |
    | **Common Event Format (CEF) over Syslog** | [Get CEF-formatted logs from your device or appliance into Microsoft Sentinel](connect-common-event-format.md) |
    | **Microsoft Sentinel Data Collector API** | [Connect your data source to the Microsoft Sentinel Data Collector API to ingest data](connect-rest-api-template.md) |
    | **Azure Functions and the REST API** | [Use Azure Functions to connect Microsoft Sentinel to your data source](connect-azure-functions-template.md) |
    | **Syslog** | [Collect data from Linux-based sources using Syslog](connect-syslog.md) |
    | **Custom logs** | [Collect data in custom log formats to Microsoft Sentinel with the Log Analytics agent](connect-custom-logs.md) |

    > [!NOTE]
    > The **Azure service-to-service integration** data ingestion method links to three different sections of its article, depending on the connector type. Each connector's section below specifies the section within that article that it links to.

1. When deploying a specific connector, choose the appropriate article linked to its **data ingestion method**, and use the information and extra guidance in the relevant section below to supplement the information in that article.

> [!TIP]
>
> - Many data connectors can also be deployed as part of a [Microsoft Sentinel solution](sentinel-solutions.md), together with related analytics rules, workbooks and playbooks. For more information, see the [Microsoft Sentinel solutions catalog](sentinel-solutions-catalog.md).
>
> - More data connectors are provided by the Microsoft Sentinel community and can be found in the Azure Marketplace. Documentation for community data connectors is the responsibility of the organization that created the connector.
>
> - If you have a data source that isn't listed or currently supported, you can also create your own, custom connector. For more information, see [Resources for creating Microsoft Sentinel custom connectors](create-custom-connector.md).

> [!IMPORTANT]
> Noted Microsoft Sentinel data connectors are currently in **Preview**. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

### Data connector prerequisites

[!INCLUDE [data-connector-prereq](includes/data-connector-prereq.md)]

## Agari Phishing Defense and Brand Protection (Preview)

| Connector attribute | Description|
| --- | --- |
| **Data ingestion method** | [**Azure Functions and the REST API**](connect-azure-functions-template.md) <br><br>**Before deployment**: [Enable the Security Graph API (Optional)](#enable-the-security-graph-api-optional). <br>**After deployment**: [Assign necessary permissions to your Function App](#assign-necessary-permissions-to-your-function-app)|
| **Log Analytics table(s)** | agari_bpalerts_log_CL<br>agari_apdtc_log_CL<br>agari_apdpolicy_log_CL |
| **DCR support** | Not currently supported |
| **Azure Function App code** | https://aka.ms/Sentinel-agari-functionapp |
| **API credentials** | <li>Client ID<li>Client Secret<li>(Optional: Graph Tenant ID, Graph Client ID, Graph Client Secret) |
| **Vendor documentation/<br>installation instructions** | <li>[Quick Start](https://developers.agari.com/agari-platform/docs/quick-start)<li>[Agari Developers Site](https://developers.agari.com/agari-platform) |
| **Connector deployment instructions** | <li>[Single-click deployment](connect-azure-functions-template.md?tabs=ARM) via Azure Resource Manager (ARM) template<li>[Manual deployment](connect-azure-functions-template.md?tabs=MPS) |
| **Application settings** | <li>clientID<li>clientSecret<li>workspaceID<li>workspaceKey<li>enableBrandProtectionAPI (true/false)<li>enablePhishingResponseAPI (true/false)<li>enablePhishingDefenseAPI (true/false)<li>resGroup (enter Resource group)<li>functionName<li>subId (enter Subscription ID)<li>enableSecurityGraphSharing (true/false; see below)<br>Required if enableSecurityGraphSharing is set to true (see below):<li>GraphTenantId<li>GraphClientId<li>GraphClientSecret<li>logAnalyticsUri (optional) |
| **Supported by** | [Agari](https://support.agari.com/hc/en-us/articles/360000645632-How-to-access-Agari-Support) |


### Enable the Security Graph API (Optional)

> [!IMPORTANT]
> If you perform this step, do this before you deploy your data connector.
>
The Agari Function App allows you to share threat intelligence with Microsoft Sentinel via the Security Graph API. To use this feature, you'll need to enable the [Sentinel Threat Intelligence Platforms connector](./connect-threat-intelligence-tip.md) and also [register an application](/graph/auth-register-app-v2) in Azure Active Directory.

This process will give you three pieces of information for use when [deploying the Function App](connect-azure-functions-template.md): the **Graph tenant ID**, the **Graph client ID**, and the **Graph client secret** (see the *Application settings* in the table above).

### Assign necessary permissions to your Function App

The Agari connector uses an environment variable to store log access timestamps. In order for the application to write to this variable, permissions must be assigned to the system assigned identity.

1. In the Azure portal, navigate to **Function App**.
1. In the **Function App** page, select your Function App from the list, then select **Identity** under **Settings** in the Function App's navigation menu.
1. In the **System assigned** tab, set the **Status** to **On**.
1. Select **Save**, and an **Azure role assignments** button will appear. Select it.
1. In the **Azure role assignments** screen, select **Add role assignment**. Set **Scope** to **Subscription**, select your subscription from the **Subscription** drop-down, and set **Role** to **App Configuration Data Owner**.
1. Select **Save**.


## AI Analyst (AIA) by Darktrace (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **[Common Event Format (CEF)](connect-common-event-format.md) over Syslog** <br><br>[Configure CEF log forwarding for AI Analyst](#configure-cef-log-forwarding-for-ai-analyst) |
| **Log Analytics table(s)** | [CommonSecurityLog](/azure/azure-monitor/reference/tables/commonsecuritylog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Supported by** | [Darktrace](https://customerportal.darktrace.com/) |


### Configure CEF log forwarding for AI Analyst

Configure Darktrace to forward Syslog messages in CEF format to your Azure workspace via the Log Analytics agent.

1. Within the Darktrace Threat Visualizer, navigate to the **System Config** page in the main menu under **Admin**.
1. From the left-hand menu, select **Modules** and choose **Microsoft Sentinel** from the available **Workflow Integrations**.
1. A configuration window will open. Locate **Microsoft Sentinel Syslog CEF** and select **New** to reveal the configuration settings, unless already exposed.
1. In the **Server configuration** field, enter the location of the log forwarder and optionally modify the communication port. Ensure that the port selected is set to 514 and is allowed by any intermediary firewalls.
1. Configure any alert thresholds, time offsets, or extra settings as required.
1. Review any extra configuration options you may wish to enable that alter the Syslog syntax.
1. Enable **Send Alerts** and save your changes.

## AI Vectra Detect (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **[Common Event Format (CEF)](connect-common-event-format.md) over Syslog** <br><br>[Configure CEF log forwarding for AI Vectra Detect](#configure-cef-log-forwarding-for-ai-vectra-detect)|
| **Log Analytics table(s)** | [CommonSecurityLog](/azure/azure-monitor/reference/tables/commonsecuritylog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Supported by** | [Vectra AI](https://www.vectra.ai/support) |


### Configure CEF log forwarding for AI Vectra Detect

Configure Vectra (X Series) Agent to forward Syslog messages in CEF format to your Microsoft Sentinel workspace via the Log Analytics agent.

From the Vectra interface, navigate to Settings > Notifications and choose Edit Syslog configuration. Follow the instructions below to set up the connection:

- Add a new Destination (the hostname of the log forwarder)
- Set the Port as **514**
- Set the Protocol as **UDP**
- Set the format to **CEF**
- Set Log types (select all log types available)
- Select **Save**

You can select the **Test** button to force the sending of some test events to the log forwarder.

For more information, see the Cognito Detect Syslog Guide, which can be downloaded from the resource page in Detect UI.

## Akamai Security Events (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **[Common Event Format (CEF)](connect-common-event-format.md) over Syslog**, with a Kusto function parser |
| **Log Analytics table(s)** | [CommonSecurityLog](/azure/azure-monitor/reference/tables/commonsecuritylog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Kusto function alias:** | AkamaiSIEMEvent |
| **Kusto function URL:** | https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/Akamai%20Security%20Events/Parsers/AkamaiSIEMEvent.txt |
| **Vendor documentation/<br>installation instructions** | [Configure Security Information and Event Management (SIEM) integration](https://developer.akamai.com/tools/integrations/siem)<br>[Set up a CEF connector](https://developer.akamai.com/tools/integrations/siem/siem-cef-connector). |
| **Supported by** | [Akamai](https://www.akamai.com/us/en/support/) |


## Alcide kAudit

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Microsoft Sentinel Data Collector API**](connect-rest-api-template.md) |
| **Log Analytics table(s)** | alcide_kaudit_activity_1_CL - Alcide kAudit activity logs<br>alcide_kaudit_detections_1_CL - Alcide kAudit detections<br>alcide_kaudit_selections_count_1_CL - Alcide kAudit activity counts<br>alcide_kaudit_selections_details_1_CL - Alcide kAudit activity details |
| **DCR support** | Not currently supported |
| **Vendor documentation/<br>installation instructions** | [Alcide kAudit installation guide](https://awesomeopensource.com/project/alcideio/kaudit?categoryPage=29#before-installing-alcide-kaudit) |
| **Supported by** | [Alcide](https://www.alcide.io/company/contact-us/) |


## Alsid for Active Directory

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Log Analytics agent - custom logs**](connect-custom-logs.md) <br><br>[Extra configuration for Alsid](#extra-configuration-for-alsid)|
| **Log Analytics table(s)** | AlsidForADLog_CL |
| **DCR support** | Not currently supported |
| **Kusto function alias:** | afad_parser |
| **Kusto function URL:** | https://aka.ms/Sentinel-alsidforad-parser |
| **Supported by** | [Alsid](https://www.alsid.com/contact-us/) |


### Extra configuration for Alsid

1. **Configure the Syslog server**

    You will first need a **linux Syslog** server that Alsid for AD will send logs to. Typically you can run **rsyslog** on **Ubuntu**. 

    You can then configure this server as you wish, but we recommend that to be able to output AFAD logs in a separate file. Alternatively you can use a [Quickstart template](https://azure.microsoft.com/resources/templates/alsid-syslog-proxy/) to deploy the Syslog server and the Microsoft agent for you. If you do use the template, you can skip the [agent installation instructions](connect-custom-logs.md#install-the-log-analytics-agent).

1. **Configure Alsid to send logs to your Syslog server**

    On your **Alsid for AD** portal, go to **System**, **Configuration**, and then **Syslog**. From there, you can create a new Syslog alert toward your Syslog server.

    Once you've created a new Syslog alert, check that the logs are correctly gathered on your server in a separate file. For example, to check your logs, you can use the *Test the configuration* button in the Syslog alert configuration in AFAD. If you used the Quickstart template, the Syslog server will by default listen on port 514 in UDP and 1514 in TCP, without TLS.

## Amazon Web Services

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **Azure service-to-service integration: <br>[Connect Microsoft Sentinel to Amazon Web Services to ingest AWS service log data](connect-aws.md?tabs=ct)** (Top connector article) |
| **Log Analytics table(s)** | AWSCloudTrail |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Supported by** | Microsoft |


## Amazon Web Services S3 (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **Azure service-to-service integration: <br>[Connect Microsoft Sentinel to Amazon Web Services to ingest AWS service log data](connect-aws.md?tabs=s3)** (Top connector article) |
| **Log Analytics table(s)** | AWSCloudTrail<br>AWSGuardDuty<br>AWSVPCFlow |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Supported by** | Microsoft |


## Apache HTTP Server

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Log Analytics agent - custom logs**](connect-custom-logs.md) |
| **Log Analytics table(s)** | ApacheHTTPServer_CL |
| **DCR support** | Not currently supported |
| **Kusto function alias:** | ApacheHTTPServer |
| **Kusto function URL:** | https://aka.ms/Sentinel-apachehttpserver-parser |
| **Custom log sample file:** | access.log or error.log |


## Apache Tomcat

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Log Analytics agent - custom logs**](connect-custom-logs.md) |
| **Log Analytics table(s)** | Tomcat_CL |
| **DCR support** | Not currently supported |
| **Kusto function alias:** | TomcatEvent |
| **Kusto function URL:** | https://aka.ms/Sentinel-ApacheTomcat-parser |
| **Custom log sample file:** | access.log or error.log |


## Aruba ClearPass (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **[Common Event Format (CEF)](connect-common-event-format.md) over Syslog**, with a Kusto function parser |
| **Log Analytics table(s)** | [CommonSecurityLog](/azure/azure-monitor/reference/tables/commonsecuritylog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Kusto function alias:** | ArubaClearPass |
| **Kusto function URL:** | https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/Aruba%20ClearPass/Parsers/ArubaClearPass.txt |
| **Vendor documentation/<br>installation instructions** | Follow Aruba's instructions to [configure ClearPass](https://www.arubanetworks.com/techdocs/ClearPass/6.7/PolicyManager/Content/CPPM_UserGuide/Admin/syslogExportFilters_add_syslog_filter_general.htm). |
| **Supported by** | Microsoft |


## Atlassian Confluence Audit (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Azure Functions and the REST API**](connect-azure-functions-template.md) |
| **Log Analytics table(s)** | Confluence_Audit_CL |
| **DCR support** | Not currently supported |
| **Azure Function App code** | https://aka.ms/Sentinel-confluenceauditapi-functionapp |
| **API credentials** | <li>ConfluenceAccessToken<li>ConfluenceUsername<li>ConfluenceHomeSiteName |
| **Vendor documentation/<br>installation instructions** | <li>[API Documentation](https://developer.atlassian.com/cloud/confluence/rest/api-group-audit/)<li>[Requirements and instructions for obtaining credentials](https://developer.atlassian.com/cloud/confluence/rest/intro/#auth)<li>[View the audit log](https://support.atlassian.com/confluence-cloud/docs/view-the-audit-log/) |
| **Connector deployment instructions** | <li>[Single-click deployment](connect-azure-functions-template.md?tabs=ARM) via Azure Resource Manager (ARM) template<li>[Manual deployment](connect-azure-functions-template.md?tabs=MPY) |
| **Kusto function alias** | ConfluenceAudit |
| **Kusto function URL/<br>Parser config instructions** | https://aka.ms/Sentinel-confluenceauditapi-parser |
| **Application settings** | <li>ConfluenceUsername<li>ConfluenceAccessToken<li>ConfluenceHomeSiteName<li>WorkspaceID<li>WorkspaceKey<li>logAnalyticsUri (optional) |
| **Supported by** | Microsoft |


## Atlassian Jira Audit (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Azure Functions and the REST API**](connect-azure-functions-template.md) |
| **Log Analytics table(s)** | Jira_Audit_CL |
| **DCR support** | Not currently supported |
| **Azure Function App code** | https://aka.ms/Sentinel-jiraauditapi-functionapp |
| **API credentials** | <li>JiraAccessToken<li>JiraUsername<li>JiraHomeSiteName |
| **Vendor documentation/<br>installation instructions** | <li>[API Documentation - Audit records](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-audit-records/)<li>[Requirements and instructions for obtaining credentials](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/#authentication) |
| **Connector deployment instructions** | <li>[Single-click deployment](connect-azure-functions-template.md?tabs=ARM) via Azure Resource Manager (ARM) template<li>[Manual deployment](connect-azure-functions-template.md?tabs=MPY) |
| **Kusto function alias** | JiraAudit |
| **Kusto function URL/<br>Parser config instructions** | https://aka.ms/Sentinel-jiraauditapi-parser |
| **Application settings** | <li>JiraUsername<li>JiraAccessToken<li>JiraHomeSiteName<li>WorkspaceID<li>WorkspaceKey<li>logAnalyticsUri (optional) |
| **Supported by** | Microsoft |


## Azure Active Directory

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **Azure service-to-service integration: <br>[Connect Azure Active Directory data to Microsoft Sentinel](connect-azure-active-directory.md)** (Top connector article) |
| **License prerequisites/<br>Cost information** | <li>Azure Active Directory P1 or P2 license for sign-in logs<li>Any Azure AD license (Free/O365/P1/P2) for other log types<br>Other charges may apply |
| **Log Analytics table(s)** | SigninLogs<br>AuditLogs<br>AADNonInteractiveUserSignInLogs<br>AADServicePrincipalSignInLogs<br>AADManagedIdentitySignInLogs<br>AADProvisioningLogs<br>ADFSSignInLogs |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Supported by** | Microsoft |


## Azure Active Directory Identity Protection

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **Azure service-to-service integration: <br>[API-based connections](connect-azure-windows-microsoft-services.md#api-based-connections)** |
| **License prerequisites/<br>Cost information** | [Azure AD Premium P2 subscription](https://azure.microsoft.com/pricing/details/active-directory/)<br>Other charges may apply |
| **Log Analytics table(s)** | SecurityAlert |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Supported by** | Microsoft |

> [!NOTE]
> This connector was designed to import only those alerts whose status is "open." Alerts that have been closed in Azure AD Identity Protection will not be imported to Microsoft Sentinel.

## Azure Activity

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **Azure service-to-service integration: <br>[Diagnostic settings-based connections, managed by Azure Policy](connect-azure-windows-microsoft-services.md?tabs=AP#diagnostic-settings-based-connections)**<br><br>[Upgrade to the new Azure Activity connector](#upgrade-to-the-new-azure-activity-connector) |
| **Log Analytics table(s)** | AzureActivity |
| **DCR support** | Not currently supported |
| **Supported by** | Microsoft |


### Upgrade to the new Azure Activity connector

#### Data structure changes

This connector recently changed its back-end mechanism for collecting Activity log events. It is now using the **diagnostic settings** pipeline. If you're still using the legacy method for this connector, you are *strongly encouraged to upgrade* to the new version, which provides better functionality and greater consistency with resource logs. See the instructions below.

The **diagnostic settings** method sends the same data that the legacy method sent from the Activity log service, although there have been some [changes to the structure](../azure-monitor/essentials/activity-log.md#data-structure-changes) of the **AzureActivity** table.

Here are some of the key improvements resulting from the move to the diagnostic settings pipeline:
- Improved ingestion latency (event ingestion within 2-3 minutes of occurrence instead of 15-20 minutes).
- Improved reliability.
- Improved performance.
- Support for all categories of events logged by the Activity log service (the legacy mechanism supports only a subset - for example, no support for Service Health events).
- Management at scale with Azure Policy.

See the [Azure Monitor documentation](../azure-monitor/logs/data-platform-logs.md) for more in-depth treatment of [Azure Activity log](../azure-monitor/essentials/activity-log.md) and the [diagnostic settings pipeline](../azure-monitor/essentials/diagnostic-settings.md).

#### Disconnect from old pipeline

Before setting up the new Azure Activity log connector, you must disconnect the existing subscriptions from the legacy method.

1. From the Microsoft Sentinel navigation menu, select **Data connectors**. From the list of connectors, select **Azure Activity**, and then select the **Open connector page** button on the lower right.

1. Under the **Instructions** tab, in the **Configuration** section, in step 1, review the list of your existing subscriptions that are connected to the legacy method (so you know which ones to add to the new), and disconnect them all at once by clicking the **Disconnect All** button below.

1. Continue setting up the new connector with the [instructions linked in the table above](connect-azure-windows-microsoft-services.md#diagnostic-settings-based-connections).

## Azure DDoS Protection

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **Azure service-to-service integration: <br>[Diagnostic settings-based connections](connect-azure-windows-microsoft-services.md?tabs=SA#diagnostic-settings-based-connections)** |
| **License prerequisites/<br>Cost information** | <li>You must have a configured [Azure DDoS Standard protection plan](../ddos-protection/manage-ddos-protection.md#create-a-ddos-protection-plan).<li>You must have a configured [virtual network with Azure DDoS Standard enabled](../ddos-protection/manage-ddos-protection.md#enable-ddos-protection-for-a-new-virtual-network)<br>Other charges may apply |
| **Log Analytics table(s)** | AzureDiagnostics |
| **DCR support** | Not currently supported |
| **Recommended diagnostics** | DDoSProtectionNotifications<br>DDoSMitigationFlowLogs<br>DDoSMitigationReports |
| **Supported by** | Microsoft |

> [!NOTE]
> The **Status** for Azure DDoS Protection Data Connector changes to **Connected** only when the protected resources are under a DDoS attack.

## Azure Defender

See [Microsoft Defender for Cloud](#microsoft-defender-for-cloud).

## Azure Firewall

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **Azure service-to-service integration: <br>[Diagnostic settings-based connections](connect-azure-windows-microsoft-services.md?tabs=SA#diagnostic-settings-based-connections)** |
| **Log Analytics table(s)** | AzureDiagnostics |
| **DCR support** | Not currently supported |
| **Recommended diagnostics** | AzureFirewallApplicationRule<br>AzureFirewallNetworkRule<br>AzureFirewallDnsProxy |
| **Supported by** | Microsoft |


## Azure Information Protection (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Azure service-to-service integration**](connect-azure-windows-microsoft-services.md) |
| **Log Analytics table(s)** | InformationProtectionLogs_CL |
| **DCR support** | Not currently supported |
| **Supported by** | Microsoft |


> [!NOTE]
> The Azure Information Protection (AIP) data connector uses the AIP audit logs (public preview) feature. As of **March 18, 2022**, we are sunsetting the AIP analytics and audit logs public preview, and moving forward will be using the [Microsoft 365 auditing solution](/microsoft-365/compliance/auditing-solutions-overview). Full retirement is scheduled for **September 30, 2022**.
>
> For more information, see [Removed and retired services](/azure/information-protection/removed-sunset-services#azure-information-protection-analytics).
>

## Azure Key Vault

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **Azure service-to-service integration: <br>[Diagnostic settings-based connections, managed by Azure Policy](connect-azure-windows-microsoft-services.md?tabs=AP#diagnostic-settings-based-connections)** |
| **Log Analytics table(s)** | KeyVaultData |
| **DCR support** | Not currently supported |
| **Supported by** | Microsoft |


## Azure Kubernetes Service (AKS)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **Azure service-to-service integration: <br>[Diagnostic settings-based connections, managed by Azure Policy](connect-azure-windows-microsoft-services.md?tabs=AP#diagnostic-settings-based-connections)** |
| **Log Analytics table(s)** | kube-apiserver<br>kube-audit<br>kube-audit-admin<br>kube-controller-manager<br>kube-scheduler<br>cluster-autoscaler<br>guard |
| **DCR support** | Not currently supported |
| **Supported by** | Microsoft |


## Microsoft Purview

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **Azure service-to-service integration: <br>[Diagnostic settings-based connections](connect-azure-windows-microsoft-services.md?tabs=AP#diagnostic-settings-based-connections)**<br><br>For more information, see [Tutorial: Integrate Microsoft Sentinel and Microsoft Purview](purview-solution.md). |
| **Log Analytics table(s)** | PurviewDataSensitivityLogs |
| **DCR support** | Not currently supported |
| **Supported by** | Microsoft |



## Azure SQL Databases

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **Azure service-to-service integration: <br>[Diagnostic settings-based connections, managed by Azure Policy](connect-azure-windows-microsoft-services.md?tabs=AP#diagnostic-settings-based-connections)** <br><br>Also available in the Azure SQL and Microsoft Sentinel for SQL PaaS solutions|
| **Log Analytics table(s)** | SQLSecurityAuditEvents<br>SQLInsights<br>AutomaticTuning<br>QueryStoreWaitStatistics<br>Errors<br>DatabaseWaitStatistics<br>Timeouts<br>Blocks<br>Deadlocks<br>Basic<br>InstanceAndAppAdvanced<br>WorkloadManagement<br>DevOpsOperationsAudit |
| **DCR support** | Not currently supported |
| **Supported by** | Microsoft |


## Azure Storage Account

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **Azure service-to-service integration: <br>[Diagnostic settings-based connections](connect-azure-windows-microsoft-services.md?tabs=SA#diagnostic-settings-based-connections)**<br><br>[Notes about storage account diagnostic settings configuration](#notes-about-storage-account-diagnostic-settings-configuration) |
| **Log Analytics table(s)** | StorageBlobLogs<br>StorageQueueLogs<br>StorageTableLogs<br>StorageFileLogs |
| **Recommended diagnostics** | **Account resource**<li>Transaction<br>**Blob/Queue/Table/File resources**<br><li>StorageRead<li>StorageWrite<li>StorageDelete<li>Transaction |
| **DCR support** | Not currently supported |
| **Supported by** | Microsoft |


### Notes about storage account diagnostic settings configuration

The storage account (parent) resource has within it other (child) resources for each type of storage: files, tables, queues, and blobs.

When configuring diagnostics for a storage account, you must select and configure, in turn:
- The parent account resource, exporting the **Transaction** metric.
- Each of the child storage-type resources, exporting all the logs and metrics (see the table above).

You will only see the storage types that you actually have defined resources for.

## Azure Web Application Firewall (WAF)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **Azure service-to-service integration: <br>[Diagnostic settings-based connections](connect-azure-windows-microsoft-services.md?tabs=SA#diagnostic-settings-based-connections)** |
| **Log Analytics table(s)** | AzureDiagnostics |
| **DCR support** | Not currently supported |
| **Recommended diagnostics** | **Application Gateway**<br><li>ApplicationGatewayAccessLog<li>ApplicationGatewayFirewallLog<br>**Front Door**<li>FrontdoorAccessLog<li>FrontdoorWebApplicationFirewallLog<br>**CDN WAF policy**<li>WebApplicationFirewallLogs |
| **Supported by** | Microsoft |



## Barracuda CloudGen Firewall

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Syslog**](connect-syslog.md) |
| **Log Analytics table(s)** | [Syslog](/azure/azure-monitor/reference/tables/syslog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Kusto function alias:** | CGFWFirewallActivity |
| **Kusto function URL:** | https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/Barracuda%20CloudGen%20Firewall/Parsers/CGFWFirewallActivity |
| **Vendor documentation/<br>installation instructions** | https://aka.ms/Sentinel-barracudacloudfirewall-connector |
| **Supported by** | [Barracuda](https://www.barracuda.com/support) |


## Barracuda WAF

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Syslog**](connect-syslog.md) |
| **Log Analytics table(s)** | CommonSecurityLog (Barracuda)<br>Barracuda_CL |
| **Vendor documentation/<br>installation instructions** | https://aka.ms/asi-barracuda-connector |
| **Supported by** | [Barracuda](https://www.barracuda.com/support) |


See Barracuda instructions - note the assigned facilities for the different types of logs and be sure to add them to the default Syslog configuration.

## BETTER Mobile Threat Defense (MTD) (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Microsoft Sentinel Data Collector API**](connect-rest-api-template.md) |
| **Log Analytics table(s)** | BetterMTDDeviceLog_CL<br>BetterMTDIncidentLog_CL<br>BetterMTDAppLog_CL<br>BetterMTDNetflowLog_CL |
| **DCR support** | Not currently supported |
| **Vendor documentation/<br>installation instructions** | [BETTER MTD Documentation](https://mtd-docs.bmobi.net/integrations/azure-sentinel/setup-integration)<br><br>Threat Policy setup, which defines the incidents that are reported to Microsoft Sentinel:<br><ol><li>In **Better MTD Console**, select  **Policies** on the side bar.<li>Select the **Edit** button of the Policy that you are using.<li>For each Incident type that you want to be logged, go to **Send to Integrations** field and select **Sentinel**. |
| **Supported by** | [Better Mobile](mailto:support@better.mobi) |


## Beyond Security beSECURE

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Microsoft Sentinel Data Collector API**](connect-rest-api-template.md) |
| **Log Analytics table(s)** | beSECURE_ScanResults_CL<br>beSECURE_ScanEvents_CL<br>beSECURE_Audit_CL |
| **DCR support** | Not currently supported |
| **Vendor documentation/<br>installation instructions** | Access the **Integration** menu:<br><ol><li>Select the **More** menu option.<li>Select **Server**<li>Select **Integration**<li>Enable Microsoft Sentinel<li>Paste the **Workspace ID** and **Primary Key** values in the beSECURE configuration.<li>Select **Modify**. |
| **Supported by** | [Beyond Security](https://beyondsecurity.freshdesk.com/support/home) |



## BlackBerry CylancePROTECT (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Syslog**](connect-syslog.md) |
| **Log Analytics table(s)** | [Syslog](/azure/azure-monitor/reference/tables/syslog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Kusto function alias:** | CylancePROTECT |
| **Kusto function URL:** | https://aka.ms/Sentinel-cylanceprotect-parser |
| **Vendor documentation/<br>installation instructions** | [Cylance Syslog Guide](https://docs.blackberry.com/content/dam/docs-blackberry-com/release-pdfs/en/cylance-products/syslog-guides/Cylance%20Syslog%20Guide%20v2.0%20rev12.pdf) |
| **Supported by** | Microsoft |


## Broadcom Symantec Data Loss Prevention (DLP) (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **[Common Event Format (CEF)](connect-common-event-format.md) over Syslog**, with a Kusto function parser |
| **Log Analytics table(s)** | [CommonSecurityLog](/azure/azure-monitor/reference/tables/commonsecuritylog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Kusto function alias:** | SymantecDLP |
| **Kusto function URL:** | https://aka.ms/Sentinel-symantecdlp-parser |
| **Vendor documentation/<br>installation instructions** | [Configuring the Log to a Syslog Server action](https://help.symantec.com/cs/DLP15.7/DLP/v27591174_v133697641/Configuring-the-Log-to-a-Syslog-Server-action?locale=EN_US) |
| **Supported by** | Microsoft |


## Check Point

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **[Common Event Format (CEF)](connect-common-event-format.md) over Syslog** <br><br>Available from the Check Point solution|
| **Log Analytics table(s)** | [CommonSecurityLog](/azure/azure-monitor/reference/tables/commonsecuritylog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Vendor documentation/<br>installation instructions** | [Log Exporter - Check Point Log Export](https://supportcenter.checkpoint.com/supportcenter/portal?eventSubmit_doGoviewsolutiondetails=&solutionid=sk122323) |
| **Supported by** | [Check Point](https://www.checkpoint.com/support-services/contact-support/) |



## Cisco ASA

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **[Common Event Format (CEF)](connect-common-event-format.md) over Syslog** <br><br>Available in the Cisco ASA solution|
| **Log Analytics table(s)** | [CommonSecurityLog](/azure/azure-monitor/reference/tables/commonsecuritylog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Vendor documentation/<br>installation instructions** | [Cisco ASA Series CLI Configuration Guide](https://www.cisco.com/c/en/us/support/docs/security/pix-500-series-security-appliances/63884-config-asa-00.html) |
| **Supported by** | Microsoft |



## Cisco Firepower eStreamer (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **[Common Event Format (CEF)](connect-common-event-format.md) over Syslog** <br><br>[Extra configuration for Cisco Firepower eStreamer](#extra-configuration-for-cisco-firepower-estreamer)|
| **Log Analytics table(s)** | [CommonSecurityLog](/azure/azure-monitor/reference/tables/commonsecuritylog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Vendor documentation/<br>installation instructions** | [eStreamer eNcore for Sentinel Operations Guide](https://www.cisco.com/c/en/us/td/docs/security/firepower/670/api/eStreamer_enCore/eStreamereNcoreSentinelOperationsGuide_409.html) |
| **Supported by** | [Cisco](https://www.cisco.com/c/en/us/support/index.html)


### Extra configuration for Cisco Firepower eStreamer

1. **Install the Firepower eNcore client**  
Install and configure the Firepower eNcore eStreamer client. For more information, see the [full Cisco install guide](https://www.cisco.com/c/en/us/td/docs/security/firepower/670/api/eStreamer_enCore/eStreamereNcoreSentinelOperationsGuide_409.html).

1. **Download the Firepower Connector from GitHub**  
Download the latest version of the Firepower eNcore connector for Microsoft Sentinel from the [Cisco GitHub repository](https://github.com/CiscoSecurity/fp-05-microsoft-sentinel-connector). If you plan on using python3, use the [python3 eStreamer connector](https://github.com/CiscoSecurity/fp-05-microsoft-sentinel-connector/tree/python3).

1. **Create a pkcs12 file using the Azure/VM IP Address**  
Create a pkcs12 certificate using the public IP of the VM instance in Firepower under **System > Integration > eStreamer**. For more information, see the [install guide](https://www.cisco.com/c/en/us/td/docs/security/firepower/670/api/eStreamer_enCore/eStreamereNcoreSentinelOperationsGuide_409.html#_Toc527049443).

1. **Test Connectivity between the Azure/VM Client and the FMC**  
Copy the pkcs12 file from the FMC to the Azure/VM instance and run the test utility (./encore.sh test) to ensure a connection can be established. For more information, see the [setup guide](https://www.cisco.com/c/en/us/td/docs/security/firepower/670/api/eStreamer_enCore/eStreamereNcoreSentinelOperationsGuide_409.html#_Toc527049430).

1. **Configure eNcore to stream data to the agent**  
Configure eNcore to stream data via TCP to the Log Analytics Agent. This configuration should be enabled by default, but extra ports and streaming protocols can be configured depending on your network security posture. It is also possible to save the data to the file system. For more information, see [Configure eNcore](https://www.cisco.com/c/en/us/td/docs/security/firepower/670/api/eStreamer_enCore/eStreamereNcoreSentinelOperationsGuide_409.html#_Toc527049433).


## Cisco Meraki (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Syslog**](connect-syslog.md)<br><br> Available in the Cisco ISE solution|
| **Log Analytics table(s)** | [Syslog](/azure/azure-monitor/reference/tables/syslog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Kusto function alias:** | CiscoMeraki |
| **Kusto function URL:** | https://aka.ms/Sentinel-ciscomeraki-parser |
| **Vendor documentation/<br>installation instructions** | [Meraki Device Reporting documentation](https://documentation.meraki.com/General_Administration/Monitoring_and_Reporting/Meraki_Device_Reporting_-_Syslog%2C_SNMP_and_API) |
| **Supported by** | Microsoft |



## Cisco Umbrella (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Azure Functions and the REST API**](connect-azure-functions-template.md) <br><br> Available in the Cisco Umbrella solution|
| **Log Analytics table(s)** | Cisco_Umbrella_dns_CL<br>Cisco_Umbrella_proxy_CL<br>Cisco_Umbrella_ip_CL<br>Cisco_Umbrella_cloudfirewall_CL |
| **DCR support** | Not currently supported |
| **Azure Function App code** | https://aka.ms/Sentinel-CiscoUmbrellaConn-functionapp |
| **API credentials** | <li>AWS Access Key ID<li>AWS Secret Access Key<li>AWS S3 Bucket Name |
| **Vendor documentation/<br>installation instructions** | <li>[Logging to Amazon S3](https://docs.umbrella.com/deployment-umbrella/docs/log-management#section-logging-to-amazon-s-3) |
| **Connector deployment instructions** | <li>[Single-click deployment](connect-azure-functions-template.md?tabs=ARM) via Azure Resource Manager (ARM) template<li>[Manual deployment](connect-azure-functions-template.md?tabs=MPY) |
| **Kusto function alias** | Cisco_Umbrella |
| **Kusto function URL/<br>Parser config instructions** | https://aka.ms/Sentinel-ciscoumbrella-function |
| **Application settings** | <li>WorkspaceID<li>WorkspaceKey<li>S3Bucket<li>AWSAccessKeyId<li>AWSSecretAccessKey<li>logAnalyticsUri (optional) |
| **Supported by** | Microsoft |


## Cisco Unified Computing System (UCS) (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Syslog**](connect-syslog.md) |
| **Log Analytics table(s)** | [Syslog](/azure/azure-monitor/reference/tables/syslog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Kusto function alias:** | CiscoUCS |
| **Kusto function URL:** | https://aka.ms/Sentinel-ciscoucs-function |
| **Vendor documentation/<br>installation instructions** | [Set up Syslog for Cisco UCS - Cisco](https://www.cisco.com/c/en/us/support/docs/servers-unified-computing/ucs-manager/110265-setup-syslog-for-ucs.html#configsremotesyslog) |
| **Supported by** | Microsoft |



## Citrix Analytics (Security)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Microsoft Sentinel Data Collector API**](connect-rest-api-template.md) |
| **Log Analytics table(s)** | CitrixAnalytics_SAlerts_CL​ |
| **DCR support** | Not currently supported |
| **Vendor documentation/<br>installation instructions** | [Connect Citrix to Microsoft Sentinel](https://docs.citrix.com/en-us/security-analytics/getting-started-security/siem-integration/azure-sentinel-integration.html) |
| **Supported by** | [Citrix Systems](https://www.citrix.com/support/) |


## Citrix Web App Firewall (WAF) (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **[Common Event Format (CEF)](connect-common-event-format.md) over Syslog** |
| **Log Analytics table(s)** | [CommonSecurityLog](/azure/azure-monitor/reference/tables/commonsecuritylog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Vendor documentation/<br>installation instructions** | To configure WAF, see [Support WIKI - WAF Configuration with NetScaler](https://support.citrix.com/article/CTX234174).<br><br>To configure CEF logs, see [CEF Logging Support in the Application Firewall](https://support.citrix.com/article/CTX136146).<br><br>To forward the logs to proxy, see [Configuring Citrix ADC appliance for audit logging](https://docs.citrix.com/en-us/citrix-adc/current-release/system/audit-logging/configuring-audit-logging.html). |
| **Supported by** | [Citrix Systems](https://www.citrix.com/support/) |



## Cognni (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Microsoft Sentinel Data Collector API**](connect-rest-api-template.md) |
| **Log Analytics table(s)** | CognniIncidents_CL |
| **DCR support** | Not currently supported |
| **Vendor documentation/<br>installation instructions** | **Connect to Cognni**<br><ol><li>Go to [Cognni integrations page](https://intelligence.cognni.ai/integrations).<li>Select **Connect** on the Microsoft Sentinel box.<li>Paste **workspaceId** and **sharedKey** (Primary Key) to the fields on Cognni's integrations screen.<li>Select the **Connect** button to complete the configuration. |
| **Supported by** | [Cognni](https://cognni.ai/contact-support/)


## Continuous Threat Monitoring for SAP (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | Only available after installing the Continuous Threat Monitoring for SAP solution|
| **Log Analytics table(s)** | See [Microsoft Sentinel SAP solution data reference](sap/sap-solution-log-reference.md) |
| **Vendor documentation/<br>installation instructions** | [Deploy SAP continuous threat monitoring](sap/deployment-overview.md) |
| **Supported by** | Microsoft |



## CyberArk Enterprise Password Vault (EPV) Events (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **[Common Event Format (CEF)](connect-common-event-format.md) over Syslog** |
| **Log Analytics table(s)** | [CommonSecurityLog](/azure/azure-monitor/reference/tables/commonsecuritylog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Vendor documentation/<br>installation instructions** | [Security Information and Event Management (SIEM) Applications](https://docs.cyberark.com/Product-Doc/OnlineHelp/PAS/Latest/en/Content/PASIMP/DV-Integrating-with-SIEM-Applications.htm) |
| **Supported by** | [CyberArk](https://www.cyberark.com/customer-support/) |



## Cyberpion Security Logs (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Microsoft Sentinel Data Collector API**](connect-rest-api-template.md) |
| **Log Analytics table(s)** | CyberpionActionItems_CL |
| **DCR support** | Not currently supported |
| **Vendor documentation/<br>installation instructions** | [Get a Cyberpion subscription](https://azuremarketplace.microsoft.com/en/marketplace/apps/cyberpion1597832716616.cyberpion)<br>[Integrate Cyberpion security alerts into Microsoft Sentinel](https://www.cyberpion.com/resource-center/integrations/azure-sentinel/) |
| **Supported by** | [Cyberpion](https://www.cyberpion.com/) |




## DNS (Preview)

**See [Windows DNS Events via AMA (Preview)](#windows-dns-events-via-ama-preview) or [Windows DNS Server (Preview)](#windows-dns-server-preview).**

## Dynamics 365

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **Azure service-to-service integration: <br>[API-based connections](connect-azure-windows-microsoft-services.md#api-based-connections)** <br><br> Also available as part of the Microsoft Sentinel 4 Dynamics 365 solution|
| **License prerequisites/<br>Cost information** | <li>[Microsoft Dynamics 365 production license](/office365/servicedescriptions/microsoft-dynamics-365-online-service-description). Not available for sandbox environments.<li>At least one user assigned a Microsoft/Office 365 [E1 or greater](/power-platform/admin/enable-use-comprehensive-auditing#requirements) license.<br>Other charges may apply |
| **Log Analytics table(s)** | Dynamics365Activity |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Supported by** | Microsoft |


## ESET Enterprise Inspector (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Azure Functions and the REST API**](connect-azure-functions-template.md)<br><br>[Create an API user](#create-an-api-user) |
| **Log Analytics table(s)** | ESETEnterpriseInspector_CL​ |
| **DCR support** | Not currently supported |
| **API credentials** | <li>EEI Username<li>EEI Password<li>Base URL |
| **Vendor documentation/<br>installation instructions** | <li>[ESET Enterprise Inspector REST API documentation](https://help.eset.com/eei/1.6/en-US/api.html) |
| **Connector deployment instructions** | [Single-click deployment](connect-azure-functions-template.md?tabs=ARM) via Azure Resource Manager (ARM) template |
| **Supported by** | [ESET](https://support.eset.com/en) |

### Create an API user

1. Log into the ESET Security Management Center / ESET PROTECT console with an administrator account, select the **More** tab and the **Users** subtab.
1. Select the **ADD NEW** button and add a **native user**.
1. Create a new user for the API account. **Optional:** Select a **Home group** other than **All** to limit what detections are ingested.
1. Under the **Permission Sets** tab, assign the **Enterprise Inspector reviewer** permission set.
1. Sign out of the administrator account and log into the console with the new API credentials for validation, then sign out of the API account.

## ESET Security Management Center (SMC) (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Syslog**](connect-syslog.md)<br><br>[Configure the ESET SMC logs to be collected](#configure-the-eset-smc-logs-to-be-collected) <br>[Configure OMS agent to pass Eset SMC data in API format](#configure-oms-agent-to-pass-eset-smc-data-in-api-format)<br>[Change OMS agent configuration to catch tag oms.api.eset and parse structured data](#change-oms-agent-configuration-to-catch-tag-omsapieset-and-parse-structured-data)<br>[Disable automatic configuration and restart agent](#disable-automatic-configuration-and-restart-agent)|
| **Log Analytics table(s)** | eset_CL |
| **DCR support** | Not currently supported |
| **Vendor documentation/<br>installation instructions** | [ESET Syslog server documentation](https://help.eset.com/esmc_admin/70/en-US/admin_server_settings_syslog.html) |
| **Supported by** | [ESET](https://support.eset.com/en) |


### Configure the ESET SMC logs to be collected

Configure rsyslog to accept logs from your Eset SMC IP address.

```bash
    sudo -i
    # Set ESET SMC source IP address
    export ESETIP={Enter your IP address}

    # Create rsyslog configuration file
    cat > /etc/rsyslog.d/80-remote.conf << EOF
    \$ModLoad imudp
    \$UDPServerRun 514
    \$ModLoad imtcp
    \$InputTCPServerRun 514
    \$AllowedSender TCP, 127.0.0.1, $ESETIP
    \$AllowedSender UDP, 127.0.0.1, $ESETIP user.=alert;user.=crit;user.=debug;user.=emerg;user.=err;user.=info;user.=notice;user.=warning  @127.0.0.1:25224
    EOF

    # Restart rsyslog
    systemctl restart rsyslog
```

### Configure OMS agent to pass Eset SMC data in API format

In order to easily recognize Eset data, push it to a separate table and parse at agent to simplify and speed up your Microsoft Sentinel query. 

In the **/etc/opt/microsoft/omsagent/{REPLACEyourworkspaceid}/conf/omsagent.conf** file, modify the `match oms.**` section to send data as API objects, by changing the type to `out_oms_api`.
    
The following  code is an example of the full `match oms.**` section:

```bash
    <match oms.** docker.**>
      type out_oms_api
      log_level info
      num_threads 5
      run_in_background false

      omsadmin_conf_path /etc/opt/microsoft/omsagent/{REPLACEyourworkspaceid}/conf/omsadmin.conf
      cert_path /etc/opt/microsoft/omsagent/{REPLACEyourworkspaceid}/certs/oms.crt
      key_path /etc/opt/microsoft/omsagent/{REPLACEyourworkspaceid}/certs/oms.key

      buffer_chunk_limit 15m
      buffer_type file
      buffer_path /var/opt/microsoft/omsagent/{REPLACEyourworkspaceid}/state/out_oms_common*.buffer

      buffer_queue_limit 10
      buffer_queue_full_action drop_oldest_chunk
      flush_interval 20s
      retry_limit 10
      retry_wait 30s
      max_retry_wait 9m
    </match>
```

### Change OMS agent configuration to catch tag oms.api.eset and parse structured data

Modify the **/etc/opt/microsoft/omsagent/{REPLACEyourworkspaceid}/conf/omsagent.d/syslog.conf** file. 

For example:

```bash
    <source>
      type syslog
      port 25224
      bind 127.0.0.1
      protocol_type udp
      tag oms.api.eset
    </source>

    <filter oms.api.**>
      @type parser
      key_name message
      format /(?<message>.*?{.*})/
    </filter>

    <filter oms.api.**>
      @type parser
      key_name message
      format json
    </filter>
```
### Disable automatic configuration and restart agent

For example: 

```bash
    # Disable changes to configuration files from Portal
    sudo su omsagent -c 'python /opt/microsoft/omsconfig/Scripts/OMS_MetaConfigHelper.py --disable'

    # Restart agent
    sudo /opt/microsoft/omsagent/bin/service_control restart

    # Check agent logs
    tail -f /var/opt/microsoft/omsagent/log/omsagent.log
```

### Configure Eset SMC to send logs to connector

Configure Eset Logs using BSD style and JSON format.

- Go to the Syslog server configuration configure the Host (your connector), Format BSD, and Transport TCP
- Go to the Logging section and enable JSON

For more information, see the Eset documentation.

## Exabeam Advanced Analytics (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Syslog**](connect-syslog.md) |
| **Log Analytics table(s)** | [Syslog](/azure/azure-monitor/reference/tables/syslog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Kusto function alias:** | ExabeamEvent |
| **Kusto function URL:** | https://aka.ms/Sentinel-Exabeam-parser |
| **Vendor documentation/<br>installation instructions** | [Configure Advanced Analytics system activity notifications](https://docs.exabeam.com/en/advanced-analytics/i56/advanced-analytics-administration-guide/125371-configure-advanced-analytics.html#UUID-6d28da8d-6d3e-5aa7-7c12-e67dc804f894) |
| **Supported by** | Microsoft |


## ExtraHop Reveal(x)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **[Common Event Format (CEF)](connect-common-event-format.md) over Syslog** |
| **Log Analytics table(s)** | [CommonSecurityLog](/azure/azure-monitor/reference/tables/commonsecuritylog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Vendor documentation/<br>installation instructions** | [ExtraHop Detection SIEM Connector](https://aka.ms/asi-syslog-extrahop-forwarding) |
| **Supported by** | [ExtraHop](https://www.extrahop.com/support/) |


## F5 BIG-IP

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Microsoft Sentinel Data Collector API**](connect-rest-api-template.md) |
| **Log Analytics table(s)** | F5Telemetry_LTM_CL<br>F5Telemetry_system_CL<br>F5Telemetry_ASM_CL |
| **DCR support** | Not currently supported |
| **Vendor documentation/<br>installation instructions** | [Integrating the F5 BIG-IP with Microsoft Sentinel](https://aka.ms/F5BigIp-Integrate) |
| **Supported by** | [F5 Networks](https://support.f5.com/csp/home) |


## F5 Networks (ASM)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **[Common Event Format (CEF)](connect-common-event-format.md) over Syslog** |
| **Log Analytics table(s)** | [CommonSecurityLog](/azure/azure-monitor/reference/tables/commonsecuritylog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Vendor documentation/<br>installation instructions** | [Configuring Application Security Event Logging](https://aka.ms/asi-syslog-f5-forwarding) |
| **Supported by** | [F5 Networks](https://support.f5.com/csp/home) |




## Forcepoint Cloud Access Security Broker (CASB) (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **[Common Event Format (CEF)](connect-common-event-format.md) over Syslog** |
| **Log Analytics table(s)** | [CommonSecurityLog](/azure/azure-monitor/reference/tables/commonsecuritylog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Vendor documentation/<br>installation instructions** | [Forcepoint CASB and Microsoft Sentinel](https://forcepoint.github.io/docs/casb_and_azure_sentinel/) |
| **Supported by** | [Forcepoint](https://support.forcepoint.com/) |


## Forcepoint Cloud Security Gateway (CSG) (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **[Common Event Format (CEF)](connect-common-event-format.md) over Syslog** |
| **Log Analytics table(s)** | [CommonSecurityLog](/azure/azure-monitor/reference/tables/commonsecuritylog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Vendor documentation/<br>installation instructions** | [Forcepoint Cloud Security Gateway and Microsoft Sentinel](https://forcepoint.github.io/docs/csg_and_sentinel/) |
| **Supported by** | [Forcepoint](https://support.forcepoint.com/) |


## Forcepoint Data Loss Prevention (DLP) (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Microsoft Sentinel Data Collector API**](connect-rest-api-template.md) |
| **Log Analytics table(s)** | ForcepointDLPEvents_CL |
| **DCR support** | Not currently supported |
| **Vendor documentation/<br>installation instructions** | [Forcepoint Data Loss Prevention and Microsoft Sentinel](https://forcepoint.github.io/docs/dlp_and_azure_sentinel/) |
| **Supported by** | [Forcepoint](https://support.forcepoint.com/) |


## Forcepoint Next Generation Firewall (NGFW) (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **[Common Event Format (CEF)](connect-common-event-format.md) over Syslog** |
| **Log Analytics table(s)** | [CommonSecurityLog](/azure/azure-monitor/reference/tables/commonsecuritylog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Vendor documentation/<br>installation instructions** | [Forcepoint Next-Gen Firewall and Microsoft Sentinel](https://forcepoint.github.io/docs/ngfw_and_azure_sentinel/) |
| **Supported by** | [Forcepoint](https://support.forcepoint.com/) |




## ForgeRock Common Audit (CAUD) for CEF (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **[Common Event Format (CEF)](connect-common-event-format.md) over Syslog** |
| **Log Analytics table(s)** | [CommonSecurityLog](/azure/azure-monitor/reference/tables/commonsecuritylog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Vendor documentation/<br>installation instructions** | [Install this first! ForgeRock Common Audit (CAUD) for Microsoft Sentinel](https://github.com/javaservlets/SentinelAuditEventHandler) |
| **Supported by** | [ForgeRock](https://www.forgerock.com/support) |


## Fortinet

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **[Common Event Format (CEF)](connect-common-event-format.md) over Syslog** <br><br>[Send Fortinet logs to the log forwarder](#send-fortinet-logs-to-the-log-forwarder) <br><br>Available in the Fortinet Fortigate solution)|
| **Log Analytics table(s)** | [CommonSecurityLog](/azure/azure-monitor/reference/tables/commonsecuritylog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Vendor documentation/<br>installation instructions** | [Fortinet Document Library](https://aka.ms/asi-syslog-fortinet-fortinetdocumentlibrary)<br>Choose your version and use the *Handbook* and *Log Message Reference* PDFs. |
| **Supported by** | [Fortinet](https://support.fortinet.com/) |


### Send Fortinet logs to the log forwarder

Open the CLI on your Fortinet appliance and run the following commands:

```Console
config log syslogd setting
set status enable
set format cef
set port 514
set server <ip_address_of_Forwarder>
end
```

- Replace the server **ip address** with the IP address of the log forwarder.
- Set the **syslog port** to **514** or the port set on the Syslog daemon on the forwarder.
- To enable CEF format in early FortiOS versions, you might need to run the command set **csv disable**.


## GitHub (Preview)


| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** |[**Microsoft Sentinel Data Collector API**](connect-rest-api-template.md)<br><br>Only available after installing the Continuous Threat Monitoring for GitHub solution. |
| **Log Analytics table(s)** | GitHubAuditLogPolling_CL |
| **DCR support** | Not currently supported |
| **API credentials** | GitHub access token |
| **Connector deployment instructions** | [Extra configuration for the GitHub connector](#extra-configuration-for-the-github-connector) |
| **Supported by** | Microsoft |


### Extra configuration for the GitHub connector

**Prerequisite**: You must have a GitHub enterprise account and an accessible organization in order to connect to GitHub from Microsoft Sentinel.

1. Install the **Continuous Threat Monitoring for GitHub** solution in your Microsoft Sentinel workspace. For more information, see [Centrally discover and deploy Microsoft Sentinel out-of-the-box content and solutions (Public preview)](sentinel-solutions-deploy.md).

1. Create a GitHub personal access token for use in the Microsoft Sentinel connector. For more information, see the relevant [GitHub documentation](https://docs.github.com/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).

1. In the Microsoft Sentinel **Data connectors** area, search for and locate the GitHub connector. On the right, select **Open connector page**.

1. On the **Instructions** tab, in the **Configuration** area, enter the following details:

    - **Organization Name**: Enter the name of the organization who's logs you want to connect to.
    - **API Key**: Enter the GitHub personal access token you'd created earlier in this procedure.

1. Select **Connect** to start ingesting your GitHub logs to Microsoft Sentinel.


## Google Workspace (G-Suite) (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Azure Functions and the REST API**](connect-azure-functions-template.md)<br><br>[Extra configuration for the Google Reports API](#extra-configuration-for-the-google-reports-api) |
| **Log Analytics table(s)** | GWorkspace_ReportsAPI_admin_CL<br>GWorkspace_ReportsAPI_calendar_CL<br>GWorkspace_ReportsAPI_drive_CL<br>GWorkspace_ReportsAPI_login_CL<br>GWorkspace_ReportsAPI_mobile_CL<br>GWorkspace_ReportsAPI_token_CL<br>GWorkspace_ReportsAPI_user_accounts_CL<br> |
| **DCR support** | Not currently supported |
| **Azure Function App code** | https://aka.ms/Sentinel-GWorkspaceReportsAPI-functionapp |
| **API credentials** | <li>GooglePickleString |
| **Vendor documentation/<br>installation instructions** | <li>[API Documentation](https://developers.google.com/admin-sdk/reports/v1/reference/activities)<li>Get credentials at [Perform Google Workspace Domain-Wide Delegation of Authority](https://developers.google.com/admin-sdk/reports/v1/guides/delegation)<li>[Convert token.pickle file to pickle string](https://aka.ms/sentinel-GWorkspaceReportsAPI-functioncode) |
| **Connector deployment instructions** | <li>[Single-click deployment](connect-azure-functions-template.md?tabs=ARM) via Azure Resource Manager (ARM) template<li>[Manual deployment](connect-azure-functions-template.md?tabs=MPY) |
| **Kusto function alias** | GWorkspaceActivityReports |
| **Kusto function URL/<br>Parser config instructions** | https://aka.ms/Sentinel-GWorkspaceReportsAPI-parser |
| **Application settings** | <li>GooglePickleString<li>WorkspaceID<li>workspaceKey<li>logAnalyticsUri (optional) |
| **Supported by** | Microsoft |


### Extra configuration for the Google Reports API

Add http://localhost:8081/ under **Authorized redirect URIs** while creating [Web application credentials](https://developers.google.com/workspace/guides/create-credentials#web).

1. [Follow the instructions](https://developers.google.com/admin-sdk/reports/v1/quickstart/python) to obtain the credentials.json.
1. To get the Google pickle string, run [this Python script](https://aka.ms/sentinel-GWorkspaceReportsAPI-functioncode) (in the same path as credentials.json).
1. Copy the pickle string output in single quotes and save. It will be needed for deploying the Function App.


## Illusive Attack Management System (AMS) (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **[Common Event Format (CEF)](connect-common-event-format.md) over Syslog** |
| **Log Analytics table(s)** | [CommonSecurityLog](/azure/azure-monitor/reference/tables/commonsecuritylog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Vendor documentation/<br>installation instructions** | [Illusive Networks Admin Guide](https://support.illusivenetworks.com/hc/en-us/sections/360002292119-Documentation-by-Version) |
| **Supported by** | [Illusive Networks](https://illusive.com/support/) |


## Imperva WAF Gateway (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **[Common Event Format (CEF)](connect-common-event-format.md) over Syslog** <br><br>Available in the Imperva Cloud WAF solution|
| **Log Analytics table(s)** | [CommonSecurityLog](/azure/azure-monitor/reference/tables/commonsecuritylog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Vendor documentation/<br>installation instructions** | [Steps for Enabling Imperva WAF Gateway Alert Logging to Microsoft Sentinel](https://community.imperva.com/blogs/craig-burlingame1/2020/11/13/steps-for-enabling-imperva-waf-gateway-alert) |
| **Supported by** | [Imperva](https://www.imperva.com/support/technical-support/) |



## Infoblox Network Identity Operating System (NIOS) (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Syslog**](connect-syslog.md)<br><br> available in the InfoBlox Threat Defense solution |
| **Log Analytics table(s)** | [Syslog](/azure/azure-monitor/reference/tables/syslog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Kusto function alias:** | InfobloxNIOS |
| **Kusto function URL:** | https://aka.ms/sentinelgithubparsersinfoblox |
| **Vendor documentation/<br>installation instructions** | [NIOS SNMP and Syslog Deployment Guide](https://www.infoblox.com/wp-content/uploads/infoblox-deployment-guide-slog-and-snmp-configuration-for-nios.pdf) |
| **Supported by** | Microsoft |





## Juniper SRX (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Syslog**](connect-syslog.md) |
| **Log Analytics table(s)** | [Syslog](/azure/azure-monitor/reference/tables/syslog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Kusto function alias:** | JuniperSRX |
| **Kusto function URL:** | https://aka.ms/Sentinel-junipersrx-parser |
| **Vendor documentation/<br>installation instructions** | [Configure Traffic Logging (Security Policy Logs) for SRX Branch Devices](https://kb.juniper.net/InfoCenter/index?page=content&id=KB16509&actp=METADATA)<br>[Configure System Logging](https://kb.juniper.net/InfoCenter/index?page=content&id=kb16502) |
| **Supported by** | [Juniper Networks](https://support.juniper.net/support/) |


## Lookout Mobile Threat Defense (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Azure Functions and the REST API**](connect-azure-functions-template.md) <br><br>Only available after installing the Lookout Mobile Threat Defense for Microsoft Sentinel solution |
| **Log Analytics table(s)** | Lookout_CL |
| **DCR support** | Not currently supported |
| **API credentials** | <li>Lookout Application Key |
| **Vendor documentation/<br>installation instructions** | <li>[Installation Guide](https://esupport.lookout.com/s/article/Lookout-with-Azure-Sentinel) (sign-in required)<li>[API Documentation](https://esupport.lookout.com/s/article/Mobile-Risk-API-Guide) (sign-in required)<li>[Lookout Mobile Endpoint Security](https://www.lookout.com/products/mobile-endpoint-security) |
| **Supported by** | [Lookout](https://www.lookout.com/support) |




## Microsoft 365 Defender

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **Azure service-to-service integration:<br>[Connect data from Microsoft 365 Defender to Microsoft Sentinel](connect-microsoft-365-defender.md)** (Top connector article) |
| **License prerequisites/<br>Cost information** | [Valid license for Microsoft 365 Defender](/microsoft-365/security/mtp/prerequisites)
| **Log Analytics table(s)** | **Alerts:**<br>SecurityAlert<br>SecurityIncident<br>**Defender for Endpoint events:**<br>DeviceEvents<br>DeviceFileEvents<br>DeviceImageLoadEvents<br>DeviceInfo<br>DeviceLogonEvents<br>DeviceNetworkEvents<br>DeviceNetworkInfo<br>DeviceProcessEvents<br>DeviceRegistryEvents<br>DeviceFileCertificateInfo<br>**Defender for Office 365 events:**<br>EmailAttachmentInfo<br>EmailUrlInfo<br>EmailEvents<br>EmailPostDeliveryEvents<br>**Defender for Identity events:**<br>IdentityDirectoryEvents<br>IdentityInfo<br>IdentityLogonEvents<br>IdentityQueryEvents<br>**Defender for Cloud Apps events:**<br>CloudAppEvents<br>**Defender alerts as events:**<br>AlertInfo<br>AlertEvidence |
| **DCR support** | Not currently supported |
| **Supported by** | Microsoft |


## Microsoft Purview Insider Risk Management (IRM) (Preview)
<a id="microsoft-365-insider-risk-management-irm-preview"></a>
        
| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **Azure service-to-service integration: <br>[API-based connections](connect-azure-windows-microsoft-services.md#api-based-connections)**<br><br>Also available in the [Microsoft Purview Insider Risk Management solution](sentinel-solutions-catalog.md#domain-solutions) |
| **License and other prerequisites** | <ul><li>Valid subscription for Microsoft 365 E5/A5/G5, or their accompanying Compliance or IRM add-ons.<li>[Microsoft Purview Insider Risk Management](/microsoft-365/compliance/insider-risk-management) fully onboarded, and [IRM policies](/microsoft-365/compliance/insider-risk-management-policies) defined and producing alerts.<li>[Microsoft 365 IRM configured](/microsoft-365/compliance/insider-risk-management-settings#export-alerts-preview) to enable the export of IRM alerts to the Office 365 Management Activity API in order to receive the alerts through the Microsoft Sentinel connector.)
| **Log Analytics table(s)** | SecurityAlert |
| **Data query filter** | `SecurityAlert`<br>`| where ProductName == "Microsoft Purview Insider Risk Management"` |
| **Supported by** | Microsoft |


            
## Microsoft Defender for Cloud

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **Azure service-to-service integration:<br>[Connect security alerts from Microsoft Defender for Cloud](connect-defender-for-cloud.md)** (Top connector article) |
| **Log Analytics table(s)** | SecurityAlert |
| **Supported by** | Microsoft |


<a name="microsoft-cloud-app-security-mcas"></a>

## Microsoft Defender for Cloud Apps

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **Azure service-to-service integration: <br>[API-based connections](connect-azure-windows-microsoft-services.md#api-based-connections)**<br><br>For Cloud Discovery logs, [enable Microsoft Sentinel as your SIEM in Microsoft Defender for Cloud Apps](/cloud-app-security/siem-sentinel) |
| **Log Analytics table(s)** | SecurityAlert - for alerts<br>McasShadowItReporting​ - for Cloud Discovery logs |
| **Supported by** | Microsoft |


## Microsoft Defender for Endpoint

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **Azure service-to-service integration: <br>[API-based connections](connect-azure-windows-microsoft-services.md#api-based-connections)** |
| **License prerequisites/<br>Cost information** | [Valid license for Microsoft Defender for Endpoint deployment](/microsoft-365/security/defender-endpoint/production-deployment)
| **Log Analytics table(s)** | SecurityAlert |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Supported by** | Microsoft |


## Microsoft Defender for Identity

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **Azure service-to-service integration: <br>[API-based connections](connect-azure-windows-microsoft-services.md#api-based-connections)** |
| **Log Analytics table(s)** | SecurityAlert |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Supported by** | Microsoft |


<a name="azure-defender-for-iot"></a>

## Microsoft Defender for IoT

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **Azure service-to-service integration: <br>[API-based connections](connect-azure-windows-microsoft-services.md#api-based-connections)** |
| **Log Analytics table(s)** | SecurityAlert |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Supported by** | Microsoft |


## Microsoft Defender for Office 365

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **Azure service-to-service integration: <br>[API-based connections](connect-azure-windows-microsoft-services.md#api-based-connections)** |
| **License prerequisites/<br>Cost information** | You must have a valid license for [Office 365 ATP Plan 2](/microsoft-365/security/office-365-security/office-365-atp#office-365-atp-plan-1-and-plan-2)
| **Log Analytics table(s)** | SecurityAlert |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Supported by** | Microsoft |


## Microsoft Office 365

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **Azure service-to-service integration: <br>[API-based connections](connect-azure-windows-microsoft-services.md#api-based-connections)** |
| **License prerequisites/<br>Cost information** | Your Office 365 deployment must be on the same tenant as your Microsoft Sentinel workspace.<br>Other charges may apply. |
| **Log Analytics table(s)** | OfficeActivity |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Supported by** | Microsoft |

     
## Microsoft Power BI (Preview)
| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **Azure service-to-service integration: <br>[API-based connections](connect-azure-windows-microsoft-services.md#api-based-connections)** |
| **License prerequisites/<br>Cost information** | Your Office 365 deployment must be on the same tenant as your Microsoft Sentinel workspace.<br>Other charges may apply. |
| **Log Analytics table(s)** | PowerBIActivity |
| **Supported by** | Microsoft |

        
## Microsoft Project (Preview)
| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **Azure service-to-service integration: <br>[API-based connections](connect-azure-windows-microsoft-services.md#api-based-connections)** |
| **License prerequisites/<br>Cost information** | Your Office 365 deployment must be on the same tenant as your Microsoft Sentinel workspace.<br>Other charges may apply. |
| **Log Analytics table(s)** | ProjectActivity |
| **Supported by** | Microsoft |


## Microsoft Sysmon for Linux (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Syslog**](connect-syslog.md), with, [ASIM parsers](normalization-about-parsers.md) based on Kusto functions |
| **Log Analytics table(s)** | [Syslog](/azure/azure-monitor/reference/tables/syslog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Supported by** | Microsoft |



## Morphisec UTPP (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **[Common Event Format (CEF)](connect-common-event-format.md) over Syslog**, with a Kusto function parser |
| **Log Analytics table(s)** | [CommonSecurityLog](/azure/azure-monitor/reference/tables/commonsecuritylog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Kusto function alias:** | Morphisec |
| **Kusto function URL** | https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Morphisec/Parsers/Morphisec/ |
| **Supported by** | [Morphisec](https://www.morphisec.com) |



## Netskope (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Azure Functions and the REST API**](connect-azure-functions-template.md) |
| **Log Analytics table(s)** | Netskope_CL |
| **DCR support** | Not currently supported |
| **Azure Function App code** | https://aka.ms/Sentinel-netskope-functioncode |
| **API credentials** | <li>Netskope API Token |
| **Vendor documentation/<br>installation instructions** | <li>[Netskope Cloud Security Platform](https://www.netskope.com/platform)<li>[Netskope API Documentation](https://docs.netskope.com/en/rest-api-v1-overview.html)<li>[Obtain an API Token](https://docs.netskope.com/en/rest-api-v2-overview.html) |
| **Connector deployment instructions** | <li>[Single-click deployment](connect-azure-functions-template.md?tabs=ARM) via Azure Resource Manager (ARM) template<li>[Manual deployment](connect-azure-functions-template.md?tabs=MPS) |
| **Kusto function alias** | Netskope |
| **Kusto function URL/<br>Parser config instructions** | https://aka.ms/Sentinel-netskope-parser |
| **Application settings** | <li>apikey<li>workspaceID<li>workspaceKey<li>uri (depends on region, follows schema: `https://<Tenant Name>.goskope.com`) <li>timeInterval (set to 5)<li>logTypes<li>logAnalyticsUri (optional) |
| **Supported by** | Microsoft |


## NGINX HTTP Server (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Log Analytics agent - custom logs**](connect-custom-logs.md) |
| **Log Analytics table(s)** | NGINX_CL |
| **DCR support** | Not currently supported |
| **Kusto function alias:** | NGINXHTTPServer |
| **Kusto function URL** | https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/NGINX%20HTTP%20Server/Parsers/NGINXHTTPServer.txt |
| **Vendor documentation/<br>installation instructions** | [Module ngx_http_log_module](https://nginx.org/en/docs/http/ngx_http_log_module.html) |
| **Custom log sample file:** | access.log or error.log |
| **Supported by** | Microsoft |


## NXLog Basic Security Module (BSM) macOS (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Microsoft Sentinel Data Collector API**](connect-rest-api-template.md) |
| **Log Analytics table(s)** | BSMmacOS_CL |
| **DCR support** | Not currently supported |
| **Vendor documentation/<br>installation instructions** | [NXLog Microsoft Sentinel User Guide](https://nxlog.co/documentation/nxlog-user-guide/sentinel.html) |
| **Supported by** | [NXLog](https://nxlog.co/community-forum) |



## NXLog DNS Logs (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Microsoft Sentinel Data Collector API**](connect-rest-api-template.md) |
| **Log Analytics table(s)** | DNS_Logs_CL |
| **DCR support** | Not currently supported |
| **Vendor documentation/<br>installation instructions** | [NXLog Microsoft Sentinel User Guide](https://nxlog.co/documentation/nxlog-user-guide/sentinel.html) |
| **Supported by** | [NXLog](https://nxlog.co/community-forum) |



## NXLog LinuxAudit (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Microsoft Sentinel Data Collector API**](connect-rest-api-template.md) |
| **Log Analytics table(s)** | LinuxAudit_CL |
| **DCR support** | Not currently supported |
| **Vendor documentation/<br>installation instructions** |  [NXLog Microsoft Sentinel User Guide](https://nxlog.co/documentation/nxlog-user-guide/sentinel.html) |
| **Supported by** | [NXLog](https://nxlog.co/community-forum) |



## Okta Single Sign-On (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Azure Functions and the REST API**](connect-azure-functions-template.md) |
| **Log Analytics table(s)** | Okta_CL |
| **DCR support** | Not currently supported |
| **Azure Function App code** | https://aka.ms/sentineloktaazurefunctioncodev2 |
| **API credentials** | <li>API Token |
| **Vendor documentation/<br>installation instructions** | <li>[Okta System Log API Documentation](https://developer.okta.com/docs/reference/api/system-log/)<li>[Create an API token](https://developer.okta.com/docs/guides/create-an-api-token/create-the-token/)<li>[Connect Okta SSO to Microsoft Sentinel](#okta-single-sign-on-preview) |
| **Connector deployment instructions** | <li>[Single-click deployment](connect-azure-functions-template.md?tabs=ARM) via Azure Resource Manager (ARM) template<li>[Manual deployment](connect-azure-functions-template.md?tabs=MPS) |
| **Application settings** | <li>apiToken<li>workspaceID<li>workspaceKey<li>uri (follows schema `https://<OktaDomain>/api/v1/logs?since=`. [Identify your domain namespace](https://developer.okta.com/docs/reference/api-overview/#url-namespace).) <li>logAnalyticsUri (optional) |
| **Supported by** | Microsoft |



## Onapsis Platform (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **[Common Event Format (CEF)](connect-common-event-format.md) over Syslog**, with a Kusto lookup and enrichment function<br><br>[Configure Onapsis to send CEF logs to the log forwarder](#configure-onapsis-to-send-cef-logs-to-the-log-forwarder) |
| **Log Analytics table(s)** | [CommonSecurityLog](/azure/azure-monitor/reference/tables/commonsecuritylog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Kusto function alias:** | incident_lookup |
| **Kusto function URL** | https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/Onapsis%20Platform/Parsers/OnapsisLookup.txt |
| **Supported by** | [Onapsis](https://onapsis.force.com/s/login/) |


### Configure Onapsis to send CEF logs to the log forwarder

Refer to the Onapsis in-product help to set up log forwarding to the Log Analytics agent.

1. Go to **Setup > Third-party integrations > Defend Alarms** and follow the instructions for Microsoft Sentinel.
1. Make sure your Onapsis Console can reach the log forwarder machine where the agent is installed. Logs should be sent to port 514 using TCP.

## One Identity Safeguard (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **[Common Event Format (CEF)](connect-common-event-format.md) over Syslog** |
| **Log Analytics table(s)** | [CommonSecurityLog](/azure/azure-monitor/reference/tables/commonsecuritylog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Vendor documentation/<br>installation instructions** | [One Identity Safeguard for Privileged Sessions Administration Guide](https://aka.ms/sentinel-cef-oneidentity-forwarding) |
| **Supported by** | [One Identity](https://support.oneidentity.com/) |




## Oracle WebLogic Server (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Log Analytics agent - custom logs**](connect-custom-logs.md) |
| **Log Analytics table(s)** | OracleWebLogicServer_CL |
| **DCR support** | Not currently supported |
| **Kusto function alias:** | OracleWebLogicServerEvent |
| **Kusto function URL:** | https://aka.ms/Sentinel-OracleWebLogicServer-parser |
| **Vendor documentation/<br>installation instructions** | [Oracle WebLogic Server documentation](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/index.html) |
| **Custom log sample file:** | server.log |
| **Supported by** | Microsoft |


## Orca Security (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Microsoft Sentinel Data Collector API**](connect-rest-api-template.md) |
| **Log Analytics table(s)** | OrcaAlerts_CL |
| **DCR support** | Not currently supported |
| **Vendor documentation/<br>installation instructions** | [Microsoft Sentinel integration](https://orcasecurity.zendesk.com/hc/en-us/articles/360043941992-Azure-Sentinel-configuration) |
| **Supported by** | [Orca Security](http://support.orca.security/) |



## OSSEC (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **[Common Event Format (CEF)](connect-common-event-format.md) over Syslog**, with a Kusto function parser |
| **Log Analytics table(s)** | [CommonSecurityLog](/azure/azure-monitor/reference/tables/commonsecuritylog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Kusto function alias:** | OSSECEvent |
| **Kusto function URL:** | https://aka.ms/Sentinel-OSSEC-parser |
| **Vendor documentation/<br>installation instructions** | [OSSEC documentation](https://www.ossec.net/docs/)<br>[Sending alerts via syslog](https://www.ossec.net/docs/docs/manual/output/syslog-output.html) |
| **Supported by** | Microsoft |



## Palo Alto Networks

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **[Common Event Format (CEF)](connect-common-event-format.md) over Syslog** <br><br>Also available in the Palo Alto PAN-OS and Prisma solutions|
| **Log Analytics table(s)** | [CommonSecurityLog](/azure/azure-monitor/reference/tables/commonsecuritylog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Vendor documentation/<br>installation instructions** | [Common Event Format (CEF) Configuration Guides](https://aka.ms/asi-syslog-paloalto-forwarding)<br>[Configure Syslog Monitoring](https://aka.ms/asi-syslog-paloalto-configure) |
| **Supported by** | [Palo Alto Networks](https://www.paloaltonetworks.com/company/contact-support) |



## Perimeter 81 Activity Logs (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Microsoft Sentinel Data Collector API**](connect-rest-api-template.md) |
| **Log Analytics table(s)** | Perimeter81_CL |
| **DCR support** | Not currently supported |
| **Vendor documentation/<br>installation instructions** | [Perimeter 81 documentation](https://support.perimeter81.com/docs/360012680780) |
| **Supported by** | [Perimeter 81](https://support.perimeter81.com/) |




## Proofpoint On Demand (POD) Email Security (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Azure Functions and the REST API**](connect-azure-functions-template.md) <br><br>Also available in the Proofpoint POD solution |
| **Log Analytics table(s)** | ProofpointPOD_message_CL<br>ProofpointPOD_maillog_CL |
| **DCR support** | Not currently supported |
| **Azure Function App code** | https://aka.ms/Sentinel-proofpointpod-functionapp |
| **API credentials** | <li>ProofpointClusterID<li>ProofpointToken |
| **Vendor documentation/<br>installation instructions** | <li>[Sign in to the Proofpoint Community](https://proofpointcommunities.force.com/community/s/article/How-to-request-a-Community-account-and-gain-full-customer-access?utm_source=login&utm_medium=recommended&utm_campaign=public)<li>[Proofpoint API documentation and instructions](https://proofpointcommunities.force.com/community/s/article/Proofpoint-on-Demand-Pod-Log-API) |
| **Connector deployment instructions** | <li>[Single-click deployment](connect-azure-functions-template.md?tabs=ARM) via Azure Resource Manager (ARM) template<li>[Manual deployment](connect-azure-functions-template.md?tabs=MPY) |
| **Kusto function alias** | ProofpointPOD |
| **Kusto function URL/<br>Parser config instructions** | https://aka.ms/Sentinel-proofpointpod-parser |
| **Application settings** | <li>ProofpointClusterID<li>ProofpointToken<li>WorkspaceID<li>WorkspaceKey<li>logAnalyticsUri (optional) |
| **Supported by** | Microsoft |


## Proofpoint Targeted Attack Protection (TAP) (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Azure Functions and the REST API**](connect-azure-functions-template.md) <br><br>Also available in the Proofpoint TAP solution |
| **Log Analytics table(s)** | ProofPointTAPClicksPermitted_CL<br>ProofPointTAPClicksBlocked_CL<br>ProofPointTAPMessagesDelivered_CL<br>ProofPointTAPMessagesBlocked_CL |
| **DCR support** | Not currently supported |
| **Azure Function App code** | https://aka.ms/sentinelproofpointtapazurefunctioncode |
| **API credentials** | <li>API Username<li>API Password |
| **Vendor documentation/<br>installation instructions** | <li>[Proofpoint SIEM API Documentation](https://help.proofpoint.com/Threat_Insight_Dashboard/API_Documentation/SIEM_API) |
| **Connector deployment instructions** | <li>[Single-click deployment](connect-azure-functions-template.md?tabs=ARM) via Azure Resource Manager (ARM) template<li>[Manual deployment](connect-azure-functions-template.md?tabs=MPS) |
| **Application settings** | <li>apiUsername<li>apiUsername<li>uri (set to `https://tap-api-v2.proofpoint.com/v2/siem/all?format=json&sinceSeconds=300`)<li>WorkspaceID<li>WorkspaceKey<li>logAnalyticsUri (optional) |
| **Supported by** | Microsoft |


## Pulse Connect Secure (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Syslog**](connect-syslog.md) |
| **Log Analytics table(s)** | [Syslog](/azure/azure-monitor/reference/tables/syslog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Kusto function alias:** | PulseConnectSecure |
| **Kusto function URL:** | https://aka.ms/sentinelgithubparserspulsesecurevpn |
| **Vendor documentation/<br>installation instructions** | [Configuring Syslog](https://docs.pulsesecure.net/WebHelp/Content/PCS/PCS_AdminGuide_8.2/Configuring%20Syslog.htm) |
| **Supported by** | Microsoft |



## Qualys VM KnowledgeBase (KB) (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Azure Functions and the REST API**](connect-azure-functions-template.md)<br><br>[Extra configuration for the Qualys VM KB](#extra-configuration-for-the-qualys-vm-kb) <br><br>Also available in the Qualys VM solution|
| **Log Analytics table(s)** | QualysKB_CL |
| **DCR support** | Not currently supported |
| **Azure Function App code** | https://aka.ms/Sentinel-qualyskb-functioncode |
| **API credentials** | <li>API Username<li>API Password |
| **Vendor documentation/<br>installation instructions** | <li>[QualysVM API User Guide](https://www.qualys.com/docs/qualys-api-vmpc-user-guide.pdf) |
| **Connector deployment instructions** | <li>[Single-click deployment](connect-azure-functions-template.md?tabs=ARM) via Azure Resource Manager (ARM) template<li>[Manual deployment](connect-azure-functions-template.md?tabs=MPS) |
| **Kusto function alias** | QualysKB |
| **Kusto function URL/<br>Parser config instructions** | https://aka.ms/Sentinel-qualyskb-parser |
| **Application settings** | <li>apiUsername<li>apiUsername<li>uri (by region; see [API Server list](https://www.qualys.com/docs/qualys-api-vmpc-user-guide.pdf#G4.735348). Follows schema `https://<API Server>/api/2.0`.<li>WorkspaceID<li>WorkspaceKey<li>filterParameters (add to end of URI, delimited by `&`. No spaces.)<li>logAnalyticsUri (optional) |
| **Supported by** | Microsoft |


### Extra configuration for the Qualys VM KB

1. Log into the Qualys Vulnerability Management console with an administrator account, select the **Users** tab and the **Users** subtab.
1. Select the **New** drop-down menu and select **Users**.
1. Create a username and password for the API account.
1. In the **User Roles** tab, ensure the account role is set to **Manager** and access is allowed to **GUI** and **API**
1. Sign out of the administrator account and sign into the console with the new API credentials for validation, then sign out of the API account.
1. Log back into the console using an administrator account and modify the API accounts User Roles, removing access to **GUI**.
1. Save all changes.

## Qualys Vulnerability Management (VM) (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Azure Functions and the REST API**](connect-azure-functions-template.md)<br><br>[Extra configuration for the Qualys VM](#extra-configuration-for-the-qualys-vm) <br>[Manual deployment - after configuring the Function App](#manual-deployment---after-configuring-the-function-app)|
| **Log Analytics table(s)** | QualysHostDetection_CL |
| **DCR support** | Not currently supported |
| **Azure Function App code** | https://aka.ms/sentinelqualysvmazurefunctioncode |
| **API credentials** | <li>API Username<li>API Password |
| **Vendor documentation/<br>installation instructions** | <li>[QualysVM API User Guide](https://www.qualys.com/docs/qualys-api-vmpc-user-guide.pdf) |
| **Connector deployment instructions** | <li>[Single-click deployment](connect-azure-functions-template.md?tabs=ARM) via Azure Resource Manager (ARM) template<li>[Manual deployment](connect-azure-functions-template.md?tabs=MPS) |
| **Application settings** | <li>apiUsername<li>apiUsername<li>uri (by region; see [API Server list](https://www.qualys.com/docs/qualys-api-vmpc-user-guide.pdf#G4.735348). Follows schema `https://<API Server>/api/2.0/fo/asset/host/vm/detection/?action=list&vm_processed_after=`.<li>WorkspaceID<li>WorkspaceKey<li>filterParameters (add to end of URI, delimited by `&`. No spaces.)<li>timeInterval (set to 5. If you modify, change Function App timer trigger accordingly.)<li>logAnalyticsUri (optional) |
| **Supported by** | Microsoft |


### Extra configuration for the Qualys VM

1. Log into the Qualys Vulnerability Management console with an administrator account, select the **Users** tab and the **Users** subtab.
1. Select the **New** drop-down menu and select **Users**.
1. Create a username and password for the API account.
1. In the **User Roles** tab, ensure the account role is set to **Manager** and access is allowed to **GUI** and **API**
1. Sign out of the administrator account and log into the console with the new API credentials for validation, then sign out of the API account.
1. Log back into the console using an administrator account and modify the API accounts User Roles, removing access to **GUI**.
1. Save all changes.

### Manual deployment - after configuring the Function App

**Configure the host.json file**

Due to the potentially large amount of Qualys host detection data being ingested, it can cause the execution time to surpass the default Function App timeout of five minutes. Increase the default timeout duration to the maximum of 10 minutes, under the Consumption Plan, to allow more time for the Function App to execute.

1. In the Function App, select the Function App Name and select the **App Service Editor** page.
1. Select **Go** to open the editor, then select the **host.json** file under the **wwwroot** directory.
1. Add the line `"functionTimeout": "00:10:00",` above the `managedDependancy` line.
1. Ensure **SAVED** appears on the top-right corner of the editor, then exit the editor.

If a longer timeout duration is required, consider upgrading to an [App Service Plan](../azure-functions/functions-scale.md).



## Salesforce Service Cloud (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Azure Functions and the REST API**](connect-azure-functions-template.md) |
| **Log Analytics table(s)** | SalesforceServiceCloud_CL |
| **DCR support** | Not currently supported |
| **Azure Function App code** | https://aka.ms/Sentinel-SalesforceServiceCloud-functionapp |
| **API credentials** | <li>Salesforce API Username<li>Salesforce API Password<li>Salesforce Security Token<li>Salesforce Consumer Key<li>Salesforce Consumer Secret |
| **Vendor documentation/<br>installation instructions** | [Salesforce REST API Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/quickstart.htm)<br>Under **Set up authorization**, use **Session ID** method instead of OAuth. |
| **Connector deployment instructions** | <li>[Single-click deployment](connect-azure-functions-template.md?tabs=ARM) via Azure Resource Manager (ARM) template<li>[Manual deployment](connect-azure-functions-template.md?tabs=MPY) |
| **Kusto function alias** | SalesforceServiceCloud |
| **Kusto function URL/<br>Parser config instructions** | https://aka.ms/Sentinel-SalesforceServiceCloud-parser |
| **Application settings** | <li>SalesforceUser<li>SalesforcePass<li>SalesforceSecurityToken<li>SalesforceConsumerKey<li>SalesforceConsumerSecret<li>WorkspaceID<li>WorkspaceKey<li>logAnalyticsUri (optional) |
| **Supported by** | Microsoft |



## Security events via Legacy Agent (Windows)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **Azure service-to-service integration: <br>[Log Analytics agent-based connections](connect-azure-windows-microsoft-services.md?tabs=LAA#windows-agent-based-connections) (Legacy)** |
| **Log Analytics table(s)** | SecurityEvents |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Supported by** | Microsoft |


For more information, see:

- [Windows security event sets that can be sent to Microsoft Sentinel](windows-security-event-id-reference.md)
- [Insecure protocols workbook setup](./get-visibility.md#use-built-in-workbooks)
- [**Windows Security Events via AMA**](#windows-security-events-via-ama) connector based on Azure Monitor Agent (AMA)
- [Configure the **Security events / Windows Security Events connector** for **anomalous RDP login detection**](#configure-the-security-events--windows-security-events-connector-for-anomalous-rdp-login-detection).

## SentinelOne (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Azure Functions and the REST API**](connect-azure-functions-template.md) <br><br>[Extra configuration for SentinelOne](#extra-configuration-for-sentinelone)|
| **Log Analytics table(s)** | SentinelOne_CL |
| **DCR support** | Not currently supported |
| **Azure Function App code** | https://aka.ms/Sentinel-SentinelOneAPI-functionapp |
| **API credentials** | <li>SentinelOneAPIToken<li>SentinelOneUrl (`https://<SOneInstanceDomain>.sentinelone.net`) |
| **Vendor documentation/<br>installation instructions** | <li>https://`<SOneInstanceDomain>`.sentinelone.net/api-doc/overview<li>See instructions below |
| **Connector deployment instructions** | <li>[Single-click deployment](connect-azure-functions-template.md?tabs=ARM) via Azure Resource Manager (ARM) template<li>[Manual deployment](connect-azure-functions-template.md?tabs=MPY) |
| **Kusto function alias** | SentinelOne |
| **Kusto function URL/<br>Parser config instructions** | https://aka.ms/Sentinel-SentinelOneAPI-parser |
| **Application settings** | <li>SentinelOneAPIToken<li>SentinelOneUrl<li>WorkspaceID<li>WorkspaceKey<li>logAnalyticsUri (optional) |
| **Supported by** | Microsoft |


### Extra configuration for SentinelOne

Follow the instructions to obtain the credentials.

1. Sign-in to the SentinelOne Management Console with Admin user credentials.
1. In the Management Console, select **Settings**.
1. In the **SETTINGS** view, select **USERS**
1. Select **New User**.
1. Enter the information for the new console user.
1. In Role, select **Admin**.
1. Select **SAVE**
1. Save credentials of the new user for using in the data connector.



## SonicWall Firewall (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **[Common Event Format (CEF)](connect-common-event-format.md) over Syslog** |
| **Log Analytics table(s)** | [CommonSecurityLog](/azure/azure-monitor/reference/tables/commonsecuritylog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Vendor documentation/<br>installation instructions** | [Log > Syslog](http://help.sonicwall.com/help/sw/eng/7020/26/2/3/content/Log_Syslog.120.2.htm)<br>Select facility local4 and ArcSight as the Syslog format.  |
| **Supported by** | [SonicWall](https://www.sonicwall.com/support/) |



## Sophos Cloud Optix (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Microsoft Sentinel Data Collector API**](connect-rest-api-template.md) |
| **Log Analytics table(s)** | SophosCloudOptix_CL |
| **DCR support** | Not currently supported |
| **Vendor documentation/<br>installation instructions** | [Integrate with Microsoft Sentinel](https://docs.sophos.com/pcg/optix/help/en-us/pcg/optix/tasks/IntegrateAzureSentinel.html), skipping the first step.<br>[Sophos query samples](https://docs.sophos.com/pcg/optix/help/en-us/pcg/optix/concepts/ExampleAzureSentinelQueries.html) |
| **Supported by** | [Sophos](https://secure2.sophos.com/en-us/support.aspx) |





## Sophos XG Firewall (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Syslog**](connect-syslog.md) |
| **Log Analytics table(s)** | [Syslog](/azure/azure-monitor/reference/tables/syslog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Kusto function alias:** | SophosXGFirewall |
| **Kusto function URL:** | https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Sophos%20XG%20Firewall/Parsers/SophosXGFirewall.txt |
| **Vendor documentation/<br>installation instructions** | [Add a syslog server](https://docs.sophos.com/nsg/sophos-firewall/18.5/Help/en-us/webhelp/onlinehelp/nsg/tasks/SyslogServerAdd.html) |
| **Supported by** | Microsoft |


## Squadra Technologies secRMM

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Microsoft Sentinel Data Collector API**](connect-rest-api-template.md) |
| **Log Analytics table(s)** | secRMM_CL |
| **DCR support** | Not currently supported |
| **Vendor documentation/<br>installation instructions** | [secRMM Microsoft Sentinel Administrator Guide](https://www.squadratechnologies.com/StaticContent/ProductDownload/secRMM/9.9.0.0/secRMMAzureSentinelAdministratorGuide.pdf) |
| **Supported by** | [Squadra Technologies](https://www.squadratechnologies.com/Contact.aspx) |



## Squid Proxy (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Log Analytics agent - custom logs**](connect-custom-logs.md) |
| **Log Analytics table(s)** | SquidProxy_CL |
| **DCR support** | Not currently supported |
| **Kusto function alias:** | SquidProxy |
| **Kusto function URL** | https://aka.ms/Sentinel-squidproxy-parser |
| **Custom log sample file:** | access.log or cache.log |
| **Supported by** | Microsoft |


## Symantec Integrated Cyber Defense Exchange (ICDx)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Microsoft Sentinel Data Collector API**](connect-rest-api-template.md) |
| **Log Analytics table(s)** | SymantecICDx_CL |
| **DCR support** | Not currently supported |
| **Vendor documentation/<br>installation instructions** | [Configuring Microsoft Sentinel (Log Analytics) Forwarders](https://techdocs.broadcom.com/us/en/symantec-security-software/integrated-cyber-defense/integrated-cyber-defense-exchange/1-4-3/Forwarders/configuring-forwarders-v131944722-d2707e17438.html) |
| **Supported by** | [Broadcom Symantec](https://support.broadcom.com/security) |



## Symantec ProxySG (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Syslog**](connect-syslog.md) |
| **Log Analytics table(s)** | [Syslog](/azure/azure-monitor/reference/tables/syslog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Kusto function alias:** | SymantecProxySG |
| **Kusto function URL:** | https://aka.ms/sentinelgithubparserssymantecproxysg |
| **Vendor documentation/<br>installation instructions** | [Sending Access Logs to a Syslog server](https://knowledge.broadcom.com/external/article/166529/sending-access-logs-to-a-syslog-server.html) |
| **Supported by** | Microsoft |



## Symantec VIP (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Syslog**](connect-syslog.md) |
| **Log Analytics table(s)** | [Syslog](/azure/azure-monitor/reference/tables/syslog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Kusto function alias:** | SymantecVIP |
| **Kusto function URL:** | https://aka.ms/sentinelgithubparserssymantecvip |
| **Vendor documentation/<br>installation instructions** | [Configuring syslog](https://help.symantec.com/cs/VIP_EG_INSTALL_CONFIG/VIP/v134652108_v128483142/Configuring-syslog?locale=EN_US) |
| **Supported by** | Microsoft |




## Thycotic Secret Server (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **[Common Event Format (CEF)](connect-common-event-format.md) over Syslog** |
| **Log Analytics table(s)** | [CommonSecurityLog](/azure/azure-monitor/reference/tables/commonsecuritylog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Vendor documentation/<br>installation instructions** | [Secure Syslog/CEF Logging](https://thy.center/ss/link/syslog) |
| **Supported by** | [Thycotic](https://thycotic.force.com/support/s/) |



## Trend Micro Deep Security

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **[Common Event Format (CEF)](connect-common-event-format.md) over Syslog**, with a Kusto function parser |
| **Log Analytics table(s)** | [CommonSecurityLog](/azure/azure-monitor/reference/tables/commonsecuritylog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Kusto function alias:** | TrendMicroDeepSecurity |
| **Kusto function URL** | https://aka.ms/TrendMicroDeepSecurityFunction |
| **Vendor documentation/<br>installation instructions** | [Forward Deep Security events to a Syslog or SIEM server](https://aka.ms/Sentinel-trendMicro-connectorInstructions) |
| **Supported by** | [Trend Micro](https://success.trendmicro.com/technical-support) |


## Trend Micro TippingPoint (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **[Common Event Format (CEF)](connect-common-event-format.md) over Syslog**, with a Kusto function parser |
| **Log Analytics table(s)** | [CommonSecurityLog](/azure/azure-monitor/reference/tables/commonsecuritylog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Kusto function alias:** | TrendMicroTippingPoint |
| **Kusto function URL** | https://aka.ms/Sentinel-trendmicrotippingpoint-function |
| **Vendor documentation/<br>installation instructions** | Send Syslog messages in ArcSight CEF Format v4.2 format. |
| **Supported by** | [Trend Micro](https://success.trendmicro.com/technical-support) |


## Trend Micro Vision One (XDR) (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Azure Functions and the REST API**](connect-azure-functions-template.md) |
| **Log Analytics table(s)** | TrendMicro_XDR_CL |
| **DCR support** | Not currently supported |
| **API credentials** | <li>API Token |
| **Vendor documentation/<br>installation instructions** | <li>[Trend Micro Vision One API](https://automation.trendmicro.com/xdr/home)<li>[Obtaining API Keys for Third-Party Access](https://docs.trendmicro.com/en-us/enterprise/trend-micro-xdr-help/ObtainingAPIKeys) |
| **Connector deployment instructions** | [Single-click deployment](connect-azure-functions-template.md?tabs=ARM) via Azure Resource Manager (ARM) template |
| **Supported by** | [Trend Micro](https://success.trendmicro.com/technical-support) |




## VMware Carbon Black Endpoint Standard (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Azure Functions and the REST API**](connect-azure-functions-template.md) |
| **Log Analytics table(s)** | CarbonBlackEvents_CL<br>CarbonBlackAuditLogs_CL<br>CarbonBlackNotifications_CL |
| **DCR support** | Not currently supported |
| **Azure Function App code** | https://aka.ms/sentinelcarbonblackazurefunctioncode |
| **API credentials** | **API access level** (for *Audit* and *Event* logs):<li>API ID<li>API Key<br><br>**SIEM access level** (for *Notification* events):<li>SIEM API ID<li>SIEM API Key |
| **Vendor documentation/<br>installation instructions** | <li>[Carbon Black API Documentation](https://developer.carbonblack.com/reference/carbon-black-cloud/cb-defense/latest/rest-api/)<li>[Creating an API Key](https://developer.carbonblack.com/reference/carbon-black-cloud/authentication/#creating-an-api-key) |
| **Connector deployment instructions** | <li>[Single-click deployment](connect-azure-functions-template.md?tabs=ARM) via Azure Resource Manager (ARM) template<li>[Manual deployment](connect-azure-functions-template.md?tabs=MPS) |
| **Application settings** | <li>apiId<li>apiKey<li>WorkspaceID<li>WorkspaceKey<li>uri (by region; [see list of options](https://community.carbonblack.com/t5/Knowledge-Base/PSC-What-URLs-are-used-to-access-the-APIs/ta-p/67346). Follows schema: `https://<API URL>.conferdeploy.net`.)<li>timeInterval (Set to 5)<li>SIEMapiId (if ingesting *Notification* events)<li>SIEMapiKey (if ingesting *Notification* events)<li>logAnalyticsUri (optional) |
| **Supported by** | Microsoft |


## VMware ESXi (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Syslog**](connect-syslog.md) |
| **Log Analytics table(s)** | [Syslog](/azure/azure-monitor/reference/tables/syslog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Kusto function alias:** | VMwareESXi |
| **Kusto function URL:** | https://aka.ms/Sentinel-vmwareesxi-parser |
| **Vendor documentation/<br>installation instructions** | [Enabling syslog on ESXi 3.5 and 4.x](https://kb.vmware.com/s/article/1016621)<br>[Configure Syslog on ESXi Hosts](https://docs.vmware.com/en/VMware-vSphere/5.5/com.vmware.vsphere.monitoring.doc/GUID-9F67DB52-F469-451F-B6C8-DAE8D95976E7.html) |
| **Supported by** | Microsoft |


## WatchGuard Firebox (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Syslog**](connect-syslog.md) |
| **Log Analytics table(s)** | [Syslog](/azure/azure-monitor/reference/tables/syslog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Kusto function alias:** | WatchGuardFirebox |
| **Kusto function URL:** | https://aka.ms/Sentinel-watchguardfirebox-parser |
| **Vendor documentation/<br>installation instructions** | [Microsoft Sentinel Integration Guide](https://www.watchguard.com/help/docs/help-center/en-US/Content/Integration-Guides/General/Microsoft%20Azure%20Sentinel.html) |
| **Supported by** | [WatchGuard Technologies](https://www.watchguard.com/wgrd-support/overview) |


## WireX Network Forensics Platform (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **[Common Event Format (CEF)](connect-common-event-format.md) over Syslog** |
| **Log Analytics table(s)** | [CommonSecurityLog](/azure/azure-monitor/reference/tables/commonsecuritylog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Vendor documentation/<br>installation instructions** | Contact [WireX support](https://wirexsystems.com/contact-us/) in order to configure your NFP solution to send Syslog messages in CEF format. |
| **Supported by** | [WireX Systems](mailto:support@wirexsystems.com) |

## Windows DNS Events via AMA (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **Azure service-to-service integration: <br>[Azure monitor Agent-based connection](connect-dns-ama.md)** |
| **Log Analytics table(s)** | DnsEvents<br>DnsInventory |
| **DCR support** | Standard DCR |
| **Supported by** | Microsoft |

## Windows DNS Server (Preview)

This connector uses the legacy agent. We recommend that you use the DNS over AMA connector above.

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **Azure service-to-service integration: <br>[Log Analytics agent-based connections](connect-azure-windows-microsoft-services.md?tabs=LAA#windows-agent-based-connections) (Legacy)** |
| **Log Analytics table(s)** | DnsEvents<br>DnsInventory |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Supported by** | Microsoft |


### Troubleshooting your Windows DNS Server data connector

If your DNS events don't show up in Microsoft Sentinel:

1. Make sure that DNS analytics logs on your servers are [enabled](/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/dn800669(v=ws.11)#to-enable-dns-diagnostic-logging).
1. Go to Azure DNS Analytics.
1. In the **Configuration** area, change any of the settings and save your changes. Change your settings back if you need to, and then save your changes again.
1. Check your Azure DNS Analytics to make sure that your events and queries display properly.

For more information, see [Gather insights about your DNS infrastructure with the DNS Analytics Preview solution](../azure-monitor/insights/dns-analytics.md).

## Windows Forwarded Events (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **Azure service-to-service integration: <br>[Azure Monitor Agent-based connections](connect-azure-windows-microsoft-services.md?tabs=AMA#windows-agent-based-connections)**<br><br>[Additional instructions for deploying the Windows Forwarded Events connector](#additional-instructions-for-deploying-the-windows-forwarded-events-connector) |
| **Prerequisites** | You must have Windows Event Collection (WEC) enabled and running.<br>Install the Azure Monitor Agent on the WEC machine. |
| **xPath queries prefix** | "ForwardedEvents!*" |
| **Log Analytics table(s)** | WindowsEvents |
| **DCR support** | Standard DCR |
| **Supported by** | Microsoft |


### Additional instructions for deploying the Windows Forwarded Events connector

We recommend installing the [Advanced Security Information Model (ASIM)](normalization.md) parsers to ensure full support for data normalization. You can deploy these parsers from the [`Azure-Sentinel` GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Parsers/ASim%20WindowsEvent) using the **Deploy to Azure** button there.

## Windows Firewall

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **Azure service-to-service integration: <br>[Log Analytics agent-based connections](connect-azure-windows-microsoft-services.md?tabs=LAA#windows-agent-based-connections) (Legacy)** |
| **Log Analytics table(s)** | WindowsFirewall |
| **Supported by** | Microsoft |


## Windows Security Events via AMA

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **Azure service-to-service integration: <br>[Azure Monitor Agent-based connections](connect-azure-windows-microsoft-services.md?tabs=AMA#windows-agent-based-connections)** |
| **xPath queries prefix** | "Security!*" |
| **Log Analytics table(s)** | SecurityEvents |
| **DCR support** | Standard DCR |
| **Supported by** | Microsoft |

See also: 
- [Windows DNS Events via AMA connector (Preview)](connect-dns-ama.md): Uses the Azure Monitor Agent to stream and filter events from Windows Domain Name System (DNS) server logs.
- [**Security events via legacy agent**](#security-events-via-legacy-agent-windows) connector.

### Configure the Security events / Windows Security Events connector for anomalous RDP login detection

> [!IMPORTANT]
> Anomalous RDP login detection is currently in public preview.
> This feature is provided without a service level agreement, and it's not recommended for production workloads.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Microsoft Sentinel can apply machine learning (ML) to Security events data to identify anomalous Remote Desktop Protocol (RDP) login activity. Scenarios include:

- **Unusual IP** - the IP address has rarely or never been observed in the last 30 days

- **Unusual geo-location** - the IP address, city, country, and ASN have rarely or never been observed in the last 30 days

- **New user** - a new user logs in from an IP address and geo-location, both or either of which were not expected to be seen based on data from the 30 days prior.

**Configuration instructions**

1. You must be collecting RDP login data (Event ID 4624) through the **Security events** or **Windows Security Events** data connectors. Make sure you have selected an [event set](windows-security-event-id-reference.md) besides "None", or created a data collection rule that includes this event ID, to stream into Microsoft Sentinel.

1. From the Microsoft Sentinel portal, select **Analytics**, and then select the **Rule templates** tab. Choose the **(Preview) Anomalous RDP Login Detection** rule, and move the **Status** slider to **Enabled**.

    > [!NOTE]
    > As the machine learning algorithm requires 30 days' worth of data to build a baseline profile of user behavior, you must allow 30 days of Windows Security events data to be collected before any incidents can be detected.

## Workplace from Facebook (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Azure Functions and the REST API**](connect-azure-functions-template.md)<br><br>[Configure Webhooks](#configure-webhooks) <br>[Add Callback URL to Webhook configuration](#add-callback-url-to-webhook-configuration)|
| **Log Analytics table(s)** | Workplace_Facebook_CL |
| **DCR support** | Not currently supported |
| **Azure Function App code** | https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Workplace%20from%20Facebook/Data%20Connectors/WorkplaceFacebook/WorkplaceFacebookWebhooksSentinelConn.zip |
| **API credentials** | <li>WorkplaceAppSecret<li>WorkplaceVerifyToken |
| **Vendor documentation/<br>installation instructions** | <li>[Configure Webhooks](https://developers.facebook.com/docs/workplace/reference/webhooks)<li>[Configure permissions](https://developers.facebook.com/docs/workplace/reference/permissions) |
| **Connector deployment instructions** | <li>[Single-click deployment](connect-azure-functions-template.md?tabs=ARM) via Azure Resource Manager (ARM) template<li>[Manual deployment](connect-azure-functions-template.md?tabs=MPY) |
| **Kusto function alias** | Workplace_Facebook |
| **Kusto function URL/<br>Parser config instructions** | https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/Workplace%20from%20Facebook/Parsers/Workplace_Facebook.txt |
| **Application settings** | <li>WorkplaceAppSecret<li>WorkplaceVerifyToken<li>WorkspaceID<li>WorkspaceKey<li>logAnalyticsUri (optional) |
| **Supported by** | Microsoft |


### Configure Webhooks

1. Sign in to the Workplace with Admin user credentials.
1. In the Admin panel, select **Integrations**.
1. In the **All integrations** view, select **Create custom integration**.
1. Enter the name and description and select **Create**.
1. In the **Integration details** panel, show the **App secret** and copy it.
1. In the **Integration permissions** panel, set all read permissions. Refer to [permission page](https://developers.facebook.com/docs/workplace/reference/permissions) for details.

### Add Callback URL to Webhook configuration

1. Open your Function App's page, go to the **Functions** list, select **Get Function URL**, and copy it.
1. Go back to **Workplace from Facebook**. In the **Configure webhooks** panel, on each Tab set the **Callback URL** as the Function URL you copied in the last step, and the **Verify token** as the same value you received during automatic deployment, or entered during manual deployment.
1. Select **Save**.



## Zimperium Mobile Thread Defense (Preview)

Zimperium Mobile Threat Defense data connector connects the Zimperium threat log to Microsoft Sentinel to view dashboards, create custom alerts, and improve investigation. This connector gives you more insight into your organization's mobile threat landscape and enhances your security operation capabilities.

For more information, see [Connect Zimperium to Microsoft Sentinel](#zimperium-mobile-thread-defense-preview).

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Microsoft Sentinel Data Collector API**](connect-rest-api-template.md)<br><br>[Configure and connect Zimperium MTD](#configure-and-connect-zimperium-mtd) |
| **Log Analytics table(s)** | ZimperiumThreatLog_CL<br>ZimperiumMitigationLog_CL |
| **DCR support** | Not currently supported |
| **Vendor documentation/<br>installation instructions** | [Zimperium customer support portal](https://support.zimperium.com/) (sign-in required) |
| **Supported by** | [Zimperium](https://www.zimperium.com/support) |


### Configure and connect Zimperium MTD

1. In zConsole, select **Manage** on the navigation bar.
1. Select the **Integrations** tab.
1. Select the **Threat Reporting** button and then the **Add Integrations** button.
1. Create the Integration:
    1. From the available integrations, select **Microsoft Sentinel**.
    1. Enter your *workspace ID* and *primary key*, select **Next**.
    1. Fill in a name for your Microsoft Sentinel integration.
    1. Select a **Filter Level** for the threat data you wish to push to Microsoft Sentinel.
    1. Select **Finish**.

## Zoom Reports (Preview)

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Azure Functions and the REST API**](connect-azure-functions-template.md) |
| **Log Analytics table(s)** | Zoom_CL |
| **DCR support** | Not currently supported |
| **Azure Function App code** | https://aka.ms/Sentinel-ZoomAPI-functionapp |
| **API credentials** | <li>ZoomApiKey<li>ZoomApiSecret |
| **Vendor documentation/<br>installation instructions** | <li>[Get credentials using JWT With Zoom](https://marketplace.zoom.us/docs/guides/auth/jwt) |
| **Connector deployment instructions** | <li>[Single-click deployment](connect-azure-functions-template.md?tabs=ARM) via Azure Resource Manager (ARM) template<li>[Manual deployment](connect-azure-functions-template.md?tabs=MPY) |
| **Kusto function alias** | Zoom |
| **Kusto function URL/<br>Parser config instructions** | https://aka.ms/Sentinel-ZoomAPI-parser |
| **Application settings** | <li>ZoomApiKey<li>ZoomApiSecret<li>WorkspaceID<li>WorkspaceKey<li>logAnalyticsUri (optional) |
| **Supported by** | Microsoft |


## Zscaler

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **[Common Event Format (CEF)](connect-common-event-format.md) over Syslog** |
| **Log Analytics table(s)** | [CommonSecurityLog](/azure/azure-monitor/reference/tables/commonsecuritylog) |
| **DCR support** | [Workspace transformation DCR](../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Vendor documentation/<br>installation instructions** | [Zscaler and Microsoft Sentinel Deployment Guide](https://aka.ms/ZscalerCEFInstructions) |
| **Supported by** | [Zscaler](https://help.zscaler.com/submit-ticket-links) |



## Zscaler Private Access (ZPA) (Preview)


| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | [**Log Analytics agent - custom logs**](connect-custom-logs.md)<br><br>[Extra configuration for Zscaler Private Access](#extra-configuration-for-zscaler-private-access) |
| **Log Analytics table(s)** | ZPA_CL |
| **DCR support** | Not currently supported |
| **Kusto function alias:** | ZPAEvent |
| **Kusto function URL** | https://aka.ms/Sentinel-zscalerprivateaccess-parser |
| **Vendor documentation/<br>installation instructions** | [Zscaler Private Access documentation](https://help.zscaler.com/zpa)<br>Also, see below |
| **Supported by** | Microsoft |


### Extra configuration for Zscaler Private Access

Follow the configuration steps below to get Zscaler Private Access logs into Microsoft Sentinel. For more information, see the [Azure Monitor Documentation](../azure-monitor/agents/data-sources-json.md). Zscaler Private Access logs are delivered via Log Streaming Service (LSS). Refer to [LSS documentation](https://help.zscaler.com/zpa/about-log-streaming-service) for detailed information.

1. Configure [Log Receivers](https://help.zscaler.com/zpa/configuring-log-receiver). While configuring a Log Receiver, choose **JSON** as **Log Template**.
1. Download config file [zpa.conf](https://aka.ms/sentinel-zscalerprivateaccess-conf).

    ```bash
    wget -v https://aka.ms/sentinel-zscalerprivateaccess-conf -O zpa.conf
    ```

1. Sign in to the server where you have installed the Azure Log Analytics agent.
1. Copy zpa.conf to the /etc/opt/microsoft/omsagent/`workspace_id`/conf/omsagent.d/ folder.
1. Edit zpa.conf as follows:
    1. Specify the port that you have set your Zscaler Log Receivers to forward logs to (line 4)
    1. Replace `workspace_id` with real value of your Workspace ID (lines 14,15,16,19)
1. Save changes and restart the Azure Log Analytics agent for Linux service with the following command:

    ```bash
    sudo /opt/microsoft/omsagent/bin/service_control restart
    ```
You can find the value of your workspace ID on the ZScaler Private Access connector page or on your Log Analytics workspace's agents management page.

## Next steps

For more information, see:

- Solutions catalog for Microsoft Sentinel in the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps?filters=solution-templates&page=1&search=sentinel)
- [Microsoft Sentinel solution catalog](sentinel-solutions-catalog.md)
- [Threat intelligence integration in Microsoft Sentinel](threat-intelligence-integration.md)
