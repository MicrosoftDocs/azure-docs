---
title: Find your Microsoft Sentinel data connector | Microsoft Docs
description: Learn about specific configuration steps for Microsoft Sentinel data connectors.
author: cwatson-cat
ms.topic: reference
ms.date: 11/28/2022
ms.author: cwatson
---

# Find your Microsoft Sentinel data connector

This article lists all supported, out-of-the-box data connectors and links to each connector's deployment steps.

> [!IMPORTANT]
> Noted Microsoft Sentinel data connectors are currently in **Preview**. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Data connectors are available as part of the following offerings:

- Solutions: Many data connectors are deployed as part of [Microsoft Sentinel solution](sentinel-solutions.md) together with related content like analytics rules, workbooks and playbooks. For more information, see the [Microsoft Sentinel solutions catalog](sentinel-solutions-catalog.md).

- Community connectors: More data connectors are provided by the Microsoft Sentinel community and can be found in the [Azure Marketplace](https://azuremarketplace.microsoft.com/en-us/marketplace/apps?filters=solution-templates&page=1&search=sentinel). Documentation for community data connectors is the responsibility of the organization that created the connector.

- Custom connectors: If you have a data source that isn't listed or currently supported, you can also create your own, custom connector. For more information, see [Resources for creating Microsoft Sentinel custom connectors](create-custom-connector.md).

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

### Data connector prerequisites

[!INCLUDE [data-connector-prereq](includes/data-connector-prereq.md)]

[comment]: <> (DataConnector includes start)


## 42Crunch

- [42Crunch Microsoft Sentinel Connector](data-connectors/42crunch-microsoft-sentinel-connector.md)

## Abnormal Security Corporation

- [Abnormal Security Events](data-connectors/abnormal-security-events.md)

## AliCloud

- [Alibaba Cloud (Preview)](data-connectors/alibaba-cloud-preview.md)

## Amazon Web Services

<<<<<<< HEAD
- [Amazon Web Services (Preview)](data-connectors/amazon-web-services-preview.md)
=======
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

## Common Event Format (CEF) via AMA

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **[Azure monitor Agent-based connection](connect-cef-ama.md)** |
| **Log Analytics table(s)** | [CommonSecurityLog](/azure/azure-monitor/reference/tables/commonsecuritylog) |
| **DCR support** | Standard DCR |
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
>>>>>>> 4f03f390ff63f3ab8c8d192d843e9bf9d7a250ff

## Apache

- [Apache Tomcat](data-connectors/apache-tomcat.md)

## Apache Software Foundation

- [Apache Http Server](data-connectors/apache-http-server.md)

## archTIS

- [NC Protect Data Connector for Microsoft Sentinel](data-connectors/nc-protect-data-connector-for-microsoft-sentinel.md)

## ARGOS Cloud Security Pty Ltd

- [ARGOS Cloud Security for Microsoft Sentinel](data-connectors/argos-cloud-security-for-microsoft-sentinel.md)

## Arista Networks

- [Awake Security (Arista Networks) - Azure Sentinel](data-connectors/awake-security-arista-networks-azure-sentinel.md)

## Armorblox

- [Armorblox for Azure Sentinel](data-connectors/armorblox-for-azure-sentinel.md)

## Aruba

- [Aruba ClearPass](data-connectors/aruba-clearpass.md)

## Atlassian

- [Atlassian Jira Audit](data-connectors/atlassian-jira-audit.md)

## Auth0

- [Auth0](data-connectors/auth0.md)

## Bitglass

- [Bitglass Solution](data-connectors/bitglass-solution.md)

## Blackberry

- [Blackberry CylancePROTECT](data-connectors/blackberry-cylanceprotect.md)

## Bosch Global Software Technologies Pvt Ltd

- [AIShield - AI Security Monitoring for Microsoft Sentinel](data-connectors/aishield-ai-security-monitoring-for-microsoft-sentinel.md)

## Box

- [Box Solution](data-connectors/box-solution.md)

## Broadcom

- [Broadcom SymantecDLP](data-connectors/broadcom-symantecdlp.md)

## Cisco

- [Cisco ACI Solution](data-connectors/cisco-aci-solution.md)
- [Cisco SEG Solution](data-connectors/cisco-seg-solution.md)
- [Cisco Secure Endpoint Solution](data-connectors/cisco-secure-endpoint-solution.md)
- [Cisco UCS](data-connectors/cisco-ucs.md)
- [Cisco WSA](data-connectors/cisco-wsa.md)

## Cisco Systems, Inc.

- [Cisco Firepower eStreamer](data-connectors/cisco-firepower-estreamer.md)

## Citrix

- [Citrix ADC](data-connectors/citrix-adc.md)
- [Citrix Analytics Application for Microsoft Sentinel](data-connectors/citrix-analytics-application-for-microsoft-sentinel.md)

## Cloudflare

- [Cloudflare Solution](data-connectors/cloudflare-solution.md)

## Contrast Security

- [Contrast Protect for Microsoft Sentinel](data-connectors/contrast-protect-for-microsoft-sentinel.md)

## Corelight Inc.

- [Corelight for Microsoft Sentinel](data-connectors/corelight-for-microsoft-sentinel.md)

## Crowdstrike

- [CrowdStrike Falcon Endpoint Protection](data-connectors/crowdstrike-falcon-endpoint-protection.md)

## Cyber Defense Group B.V.

- [ESET PROTECT integration for Azure Sentinel](data-connectors/eset-protect-integration-for-azure-sentinel.md)

## CyberArk

- [CyberArk EPM/Sentinel Integration](data-connectors/cyberark-epm-sentinel-integration.md)

## Darktrace

- [AI Analyst Darktrace](data-connectors/ai-analyst-darktrace.md)
- [Darktrace for Microsoft Sentinel](data-connectors/darktrace-for-microsoft-sentinel.md)

## Delinea Inc.

- [Delinea Secret Server for Microsoft Sentinel](data-connectors/delinea-secret-server-for-microsoft-sentinel.md)

## Derdack

- [SIGNL4 – Mobile Alerting for Microsoft Sentinel](data-connectors/signl4-mobile-alerting-for-microsoft-sentinel.md)

## Digital Shadows

- [Digital Shadows SearchLight for Sentinel](data-connectors/digital-shadows-searchlight-for-sentinel.md)

## Elastic

- [Elastic Agent Solution (Preview)](data-connectors/elastic-agent-solution-preview.md)

## Exabeam

- [Exabeam Advanced Analytics](data-connectors/exabeam-advanced-analytics.md)

## ExtraHop Networks, Inc.

- [ExtraHop Reveal(x) for Microsoft Sentinel](data-connectors/extrahop-reveal-x-for-microsoft-sentinel.md)

## F5 Networks

- [F5 Advanced WAF Integration via Telemetry Streaming for Microsoft Sentinel](data-connectors/f5-advanced-waf-integration-via-telemetry-streaming-for-microsoft-sentinel.md)
- [F5 Advanced WAF Integration via Syslog/CEF for Microsoft Sentinel](data-connectors/f5-advanced-waf-integration-via-syslog-cef-for-microsoft-sentinel.md)

## Facebook

- [Workplace from Facebook](data-connectors/workplace-from-facebook.md)

## Flare Systems

- [Flare for Microsoft Sentinel](data-connectors/flare-for-microsoft-sentinel.md)

## Forescout

- [Forescout eyeExtend for Microsoft Sentinel](data-connectors/forescout-eyeextend-for-microsoft-sentinel.md)

## GitLab

- [Gitlab](data-connectors/gitlab.md)

## Google

- [Google Cloud Platform Cloud Monitoring Solution](data-connectors/google-cloud-platform-cloud-monitoring-solution.md)
- [Google Cloud Platform DNS Solution](data-connectors/google-cloud-platform-dns-solution.md)
- [Google Cloud Platform IAM](data-connectors/google-cloud-platform-iam.md)
- [Google Workspace Reports](data-connectors/google-workspace-reports.md)

## H.O.L.M. Security Sweden AB

- [Holm Security for Azure Sentinel](data-connectors/holm-security-for-azure-sentinel.md)

## Illumio

- [Illumio Core](data-connectors/illumio-core.md)

## Illusive Networks

- [Illusive Attack Surface Analysis and Incident Logs for Microsoft Sentinel](data-connectors/illusive-attack-surface-analysis-and-incident-logs-for-microsoft-sentinel.md)

## Infoblox Inc.

- [Infoblox Cloud for Microsoft Sentinel](data-connectors/infoblox-cloud-for-microsoft-sentinel.md)

## Infosec Global

- [AgileSec Analytics Connector](data-connectors/agilesec-analytics-connector.md)

## Insight VM / Rapid7

- [InsightVM CloudAPI Solution](data-connectors/insightvm-cloudapi-solution.md)

## Ivanti

- [Ivanti Unified Endpoint Management](data-connectors/ivanti-unified-endpoint-management.md)

## Juniper

- [Juniper IDP Solution](data-connectors/juniper-idp-solution.md)
- [Juniper SRX](data-connectors/juniper-srx.md)

## Linux

- [Microsoft Sysmon For Linux Solution](data-connectors/microsoft-sysmon-for-linux-solution.md)

## Lookout, Inc.

- [Lookout Mobile Threat Defense for Azure Sentinel](data-connectors/lookout-mobile-threat-defense-for-azure-sentinel.md)

## MarkLogic

- [MarkLogic Audit](data-connectors/marklogic-audit.md)

## McAfee

- [McAfee Network Security Platform Solution](data-connectors/mcafee-network-security-platform-solution.md)

## Microsoft

- [Akamai Security](data-connectors/akamai-security.md)
- [Atlassian Confluence Audit](data-connectors/atlassian-confluence-audit.md)
- [Automated Logic WebCTRL](data-connectors/automated-logic-webctrl.md)
- [Azure Active Directory solution for Sentinel](data-connectors/azure-active-directory-solution-for-sentinel.md)
- [Azure Active Directory Identity Protection](data-connectors/azure-active-directory-identity-protection.md)
- [Azure Cognitive Search solution for Sentinel (Preview)](data-connectors/azure-cognitive-search-solution-for-sentinel-preview.md)
- [Azure DDoS Protection solution for Sentinel](data-connectors/azure-ddos-protection-solution-for-sentinel.md)
- [Azure Event Hubs solution for Sentinel (Preview)](data-connectors/azure-event-hubs-solution-for-sentinel-preview.md)
- [Azure Information Protection solution for Sentinel](data-connectors/azure-information-protection-solution-for-sentinel.md)
- [Azure Key Vault solution for Sentinel](data-connectors/azure-key-vault-solution-for-sentinel.md)
- [Azure Logic Apps solution for Sentinel](data-connectors/azure-logic-apps-solution-for-sentinel.md)
- [Azure Service Bus solution for Sentinel (Preview)](data-connectors/azure-service-bus-solution-for-sentinel-preview.md)
- [Azure Storage solution for Sentinel](data-connectors/azure-storage-solution-for-sentinel.md)
- [Azure Stream Analytics solution for Sentinel (Preview)](data-connectors/azure-stream-analytics-solution-for-sentinel-preview.md)
- [Cisco Umbrella](data-connectors/cisco-umbrella.md)
- [Common Event Format solution for Sentinel](data-connectors/common-event-format-solution-for-sentinel.md)
- [Windows Server DNS solution for Sentinel](data-connectors/windows-server-dns-solution-for-sentinel.md)
- [Imperva WAF Cloud Solution](data-connectors/imperva-waf-cloud-solution.md)
- [McAfee ePolicy Orchestrator Solution](data-connectors/mcafee-epolicy-orchestrator-solution.md)
- [Microsoft 365 Defender solution for Sentinel](data-connectors/microsoft-365-defender-solution-for-sentinel.md)
- [Microsoft Defender for Cloud solution for Sentinel](data-connectors/microsoft-defender-for-cloud-solution-for-sentinel.md)
- [Microsoft Defender for Cloud Apps solution for Sentinel](data-connectors/microsoft-defender-for-cloud-apps-solution-for-sentinel.md)
- [Microsoft Defender for Endpoint](data-connectors/microsoft-defender-for-endpoint.md)
- [Microsoft Defender for Office 365 solution for Sentinel](data-connectors/microsoft-defender-for-office-365-solution-for-sentinel.md)
- [Microsoft PowerBI solution for Sentinel](data-connectors/microsoft-powerbi-solution-for-sentinel.md)
- [Microsoft Project solution for Sentinel](data-connectors/microsoft-project-solution-for-sentinel.md)
- [Azure Network Security Groups solution for Sentinel](data-connectors/azure-network-security-groups-solution-for-sentinel.md)
- [Nginx](data-connectors/nginx.md)
- [Oracle Cloud Infrastructure](data-connectors/oracle-cloud-infrastructure.md)
- [Windows Security Events](data-connectors/windows-security-events.md)
- [SentinelOne](data-connectors/sentinelone.md)
- [VMware ESXi](data-connectors/vmware-esxi.md)
- [Windows Firewall](data-connectors/windows-firewall.md)
- [Windows Forwarded Events](data-connectors/windows-forwarded-events.md)

## Microsoft Corporation

- [Azure Firewall Solution for Sentinel (Preview)](data-connectors/azure-firewall-solution-for-sentinel-preview.md)

## Microsoft Corporation - sentinel4github

- [Microsoft Sentinel - Continuous Threat Monitoring for GitHub (Preview)](data-connectors/microsoft-sentinel-continuous-threat-monitoring-for-github-preview.md)

## Microsoft Sentinel Community, Microsoft Corporation

- [Forcepoint CASB](data-connectors/forcepoint-casb.md)
- [Forcepoint CSG](data-connectors/forcepoint-csg.md)
- [Forcepoint DLP](data-connectors/forcepoint-dlp.md)
- [Forcepoint NGFW](data-connectors/forcepoint-ngfw.md)

## MongoDB

- [MongoDB Audit](data-connectors/mongodb-audit.md)

## MuleSoft

- [Mulesoft](data-connectors/mulesoft.md)

## Netwrix

- [Netwrix Auditor (Preview)](data-connectors/netwrix-auditor-preview.md)

## Nozomi Networks

- [Nozomi Networks](data-connectors/nozomi-networks.md)

## NXLog Ltd.

- [NXLog AIX Audit for Azure Sentinel](data-connectors/nxlog-aix-audit-for-azure-sentinel.md)
- [NXLog DNS Logs for Azure Sentinel](data-connectors/nxlog-dns-logs-for-azure-sentinel.md)
- [NXLog LinuxAudit for Microsoft Sentinel](data-connectors/nxlog-linuxaudit-for-microsoft-sentinel.md)

## Okta

- [Okta Single Sign-On Solution](data-connectors/okta-single-sign-on-solution.md)

## OneLogin

- [OneLogin IAM](data-connectors/onelogin-iam.md)

## OpenVPN

- [OpenVPN](data-connectors/openvpn.md)

## Oracle

- [Oracle Database Audit Solution](data-connectors/oracle-database-audit-solution.md)
- [Oracle WebLogic Server](data-connectors/oracle-weblogic-server.md)

## OSSEC

- [OSSEC](data-connectors/ossec.md)

## Palo Alto Networks

- [Palo Alto Networks Cortex Data Lake Solution](data-connectors/palo-alto-networks-cortex-data-lake-solution.md)
- [Palo Alto Prisma Solution](data-connectors/palo-alto-prisma-solution.md)

## Ping Identity

- [PingFederate](data-connectors/pingfederate.md)

## PostgreSQL

- [PostgreSQL](data-connectors/postgresql.md)

## Proofpoint

- [Proofpoint TAP Solution](data-connectors/proofpoint-tap-solution.md)

## Pulse Secure

- [Pulse Connect Secure](data-connectors/pulse-connect-secure.md)

## Qualys

- [Qualys VM Knowledgebase](data-connectors/qualys-vm-knowledgebase.md)
- [Qualys VM Solution](data-connectors/qualys-vm-solution.md)

## RedHat

- [Jboss](data-connectors/jboss.md)

## Rubrik, Inc.

- [Rubrik Integration with Sentinel for Ransomware Protection](data-connectors/rubrik-integration-with-sentinel-for-ransomware-protection.md)

## SailPoint

- [SailPoint Sentinel Integration](data-connectors/sailpoint-sentinel-integration.md)

## Salesforce

- [Salesforce Service Cloud](data-connectors/salesforce-service-cloud.md)

## SecurityBridge

- [SecurityBridge App for Microsoft Sentinel](data-connectors/securitybridge-app-for-microsoft-sentinel.md)

## Senserva, LLC

- [Senserva Offer for Microsoft Sentinel](data-connectors/senserva-offer-for-microsoft-sentinel.md)

## Slack

- [Slack Audit Solution](data-connectors/slack-audit-solution.md)

## Snowflake

- [Snowflake](data-connectors/snowflake.md)

## SonicWall Inc

- [SonicWall Network Security for Microsoft Sentinel](data-connectors/sonicwall-network-security-for-microsoft-sentinel.md)

## Sonrai Security

- [Sonrai Security for Microsoft Sentinel](data-connectors/sonrai-security-for-microsoft-sentinel.md)

## Sophos

- [Sophos Endpoint Protection Solution](data-connectors/sophos-endpoint-protection-solution.md)
- [Sophos XG Firewall Solution](data-connectors/sophos-xg-firewall-solution.md)

## Squid

- [SquidProxy](data-connectors/squidproxy.md)

## Symantec

- [Symantec Endpoint Protection Solution](data-connectors/symantec-endpoint-protection-solution.md)
- [Symantec Integrated Cyber Defense](data-connectors/symantec-integrated-cyber-defense.md)
- [Symantec ProxySG Solution](data-connectors/symantec-proxysg-solution.md)
- [Symantec VIP](data-connectors/symantec-vip.md)

## Tenable

- [Tenable App for Microsoft Sentinel](data-connectors/tenable-app-for-microsoft-sentinel.md)

## The Collective Consulting BV

- [Lastpass Enterprise Activity Monitoring](data-connectors/lastpass-enterprise-activity-monitoring.md)

## TheHive

- [TheHive Solution](data-connectors/thehive-solution.md)

## Trend Micro

- [Trend Micro TippingPoint for Microsoft Sentinel](data-connectors/trend-micro-tippingpoint-for-microsoft-sentinel.md)
- [Trend Micro Vision One for Microsoft Sentinel](data-connectors/trend-micro-vision-one-for-microsoft-sentinel.md)

## TrendMicro

- [Trend Micro Apex One Solution](data-connectors/trend-micro-apex-one-solution.md)

## Ubiquiti

- [Ubiquiti UniFi](data-connectors/ubiquiti-unifi.md)

## vArmour Networks

- [vArmour Application Controller and Azure Sentinel Solution](data-connectors/varmour-application-controller-and-azure-sentinel-solution.md)

## Vectra AI, Inc

- [Vectra AI Stream for Microsoft Sentinel](data-connectors/vectra-ai-stream-for-microsoft-sentinel.md)
- [Vectra Detect for Microsoft Sentinel](data-connectors/vectra-detect-for-microsoft-sentinel.md)

## VMRay GmbH

- [VMRay Email Threat Defender Connector for Azure Sentinel](data-connectors/vmray-email-threat-defender-connector-for-azure-sentinel.md)

## VMware

- [VMware vCenter](data-connectors/vmware-vcenter.md)

## VMWare

- [VMware Carbon Black Cloud](data-connectors/vmware-carbon-black-cloud.md)

## WatchGuard Technologies

- [Azure Sentinel for WatchGuard Firebox](data-connectors/azure-sentinel-for-watchguard-firebox.md)

## WireX Systems

- [WireX Network Forensics Platform for Microsoft Sentinel](data-connectors/wirex-network-forensics-platform-for-microsoft-sentinel.md)

## ZERO NETWORKS LTD

- [Zero Networks Segment for Microsoft Sentinel](data-connectors/zero-networks-segment-for-microsoft-sentinel.md)

## Zscaler

- [Zscaler Internet Access for Microsoft Sentinel](data-connectors/zscaler-internet-access-for-microsoft-sentinel.md)
- [Zscaler Private Access](data-connectors/zscaler-private-access.md)

[comment]: <> (DataConnector includes end)

## Next steps

For more information, see:

- [Microsoft Sentinel solutions catalog](sentinel-solutions-catalog.md)
- [Threat intelligence integration in Microsoft Sentinel](threat-intelligence-integration.md)
