---
title: Azure Sentinel data connectors reference | Microsoft Docs
description: Learn about specific configuration steps for Azure Sentinel data connectors.
services: sentinel
documentationcenter: na
author: batamig
ms.service: azure-sentinel
ms.topic: reference
ms.date: 08/12/2021
ms.author: bagol

---

# Azure Sentinel data connectors reference

This article lists all built-in data connectors provided by Azure Sentinel, together with links to generic deployment procedures and any extra steps required for specific connectors.

Data connectors are deployed in Azure Sentinel using one of the following procedures:

- [Connect data sources](connect-data-sources.md)
- [Use Azure Functions to connect your data source to Azure Sentinel](connect-azure-functions-template.md)
- [Collect data from Linux-based sources using Syslog](connect-syslog.md)
- [Resources for creating Azure Sentinel custom connectors](create-custom-connector.md)


Check the sections below for additional guidance when deploying a specific connector.

> [!TIP]
> - Many data connectors can also be deployed as part of an [Azure Sentinel solution](sentinel-solutions.md), together with related analytics rules, workbooks and playbooks. For more information, see the [Azure Sentinel solutions catalog](sentinel-solutions-catalog.md).
>
> - Additional data connectors are provided by the Azure Sentinel community and can be found in the Azure Marketplace. Documentation for community data connectors is the responsibility of the organization that created the connector.
>

> [!IMPORTANT]
> Noted Azure Sentinel data connectors are currently in **Preview**. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Agari Phishing Defense and Brand Protection (Preview)

| Data ingestion method: | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| --- | --- |
| **Log Analytics table(s)** | agari_bpalerts_log_CL<br>agari_apdtc_log_CL<br>agari_apdpolicy_log_CL |
| **Azure Function App code** | https://aka.ms/sentinel-agari-functionapp |
| **API credentials** | <li>Client ID<li>Client Secret<li>(Optional: Graph Tenant ID, Graph Client ID, Graph Client Secret) |
| **Vendor documentation/<br>installation instructions** | <li>[Quick Start](https://developers.agari.com/agari-platform/docs/quick-start)<li>[Agari Developers Site](https://developers.agari.com/agari-platform) |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPS) |
| **Application settings** | <li>clientID<li>clientSecret<li>workspaceID<li>workspaceKey<li>enableBrandProtectionAPI (true/false)<li>enablePhishingResponseAPI (true/false)<li>enablePhishingDefenseAPI (true/false)<li>resGroup (enter Resource group)<li>functionName<li>subId (enter Subscription ID)<li>enableSecurityGraphSharing (true/false; see below)<br>Required if enableSecurityGraphSharing is set to true (see below):<li>GraphTenantId<li>GraphClientId<li>GraphClientSecret<li>logAnalyticsUri (optional) |
| **Supported by** | [Agari](https://support.agari.com/hc/en-us/articles/360000645632-How-to-access-Agari-Support) |
|

### Extra steps for deployment of this connector

| Stage | Instruction |
| --- | --- |
| **Before deployment** | **(Optional) Enable the Security Graph API**<br><br>The Agari Function App allows you to share threat intelligence with Azure Sentinel via the Security Graph API. To use this feature, you'll need to enable the [Sentinel Threat Intelligence Platforms connector](connect-threat-intelligence.md) and also [register an application](/graph/auth-register-app-v2) in Azure Active Directory.<br>This process will give you three pieces of information for use when [deploying the Function App](connect-azure-functions-template.md): the **Graph tenant ID**, the **Graph client ID**, and the **Graph client secret** (see the *Application settings* in the table above). |
| **After deployment** | **Assign the necessary permissions to your Function App**<br><br>The Agari connector uses an environment variable to store log access timestamps. In order for the application to write to this variable, permissions must be assigned to the system assigned identity.<br><ol><li>In the Azure portal, navigate to **Function App**.<li>In the **Function App** blade, select your Function App from the list, then select **Identity** under **Settings** in the Function App's navigation menu.<li>In the **System assigned** tab, set the **Status** to **On**.<li>Select **Save**, and an **Azure role assignments** button will appear. Click it.<li>In the **Azure role assignments** screen, select **Add role assignment**. Set **Scope** to **Subscription**, select your subscription from the **Subscription** drop-down, and set **Role** to **App Configuration Data Owner**.<li> Select **Save**. |
|

## AI Analyst (AIA) by Darktrace (Preview)

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog |
| **Supported by** | [Darktrace](https://customerportal.darktrace.com/) |
| **CEF configuration:** | Configure Darktrace to forward Syslog messages in CEF format to your Azure workspace via the Log Analytics agent.<br><ol><li>Within the Darktrace Threat Visualizer, navigate to the **System Config** page in the main menu under **Admin**.<li>From the left-hand menu, select **Modules** and choose **Azure Sentinel** from the available **Workflow Integrations**.<li>A configuration window will open. Locate **Azure Sentinel Syslog CEF** and click **New** to reveal the configuration settings, unless already exposed.<li>In the **Server configuration** field, enter the location of the log forwarder and optionally modify the communication port. Ensure that the port selected is set to 514 and is allowed by any intermediary firewalls.<li>Configure any alert thresholds, time offsets, or additional settings as required.<li>Review any additional configuration options you may wish to enable that alter the Syslog syntax.<li>Enable **Send Alerts** and save your changes.

## AI Vectra Detect (Preview)

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog |
| **Supported by** | [Vectra AI](https://www.vectra.ai/support) |
|

### Configure CEF log forwarding

Configure Vectra (X Series) Agent to forward Syslog messages in CEF format to your Azure Sentinel workspace via the Log Analytics agent.

From the Vectra interface, navigate to Settings > Notifications and choose Edit Syslog configuration. Follow the instructions below to set up the connection:

- Add a new Destination (the hostname of the log forwarder)
- Set the Port as **514**
- Set the Protocol as **UDP**
- Set the format to **CEF**
- Set Log types (select all log types available)
- Click on **Save**

You can click the **Test** button to force the sending of some test events to the log forwarder.

For more information, refer to Cognito Detect Syslog Guide which can be downloaded from the resource page in Detect UI.

## Akamai Security Events (Preview)

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog, with a Kusto function parser |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog |
| **Kusto function alias:** | AkamaiSIEMEvent |
| **Kusto function URL:** | https://aka.ms/sentinel-akamaisecurityevents-parser |
| **Vendor documentation/<br>installation instructions** | [Configure SIEM integration](https://developer.akamai.com/tools/integrations/siem)<br>[Set up a CEF connector](https://developer.akamai.com/tools/integrations/siem/siem-cef-connector). |
| **Supported by** | [Akamai](https://www.akamai.com/us/en/support/) |
|

## Alcide kAudit

| Data ingestion method: | [REST-API](connect-rest-api-template.md) |
| --- | --- |
| **Log Analytics table(s)** | alcide_kaudit_activity_1_CL - Alcide kAudit activity logs<br>alcide_kaudit_detections_1_CL - Alcide kAudit detections<br>alcide_kaudit_selections_count_1_CL - Alcide kAudit activity counts<br>alcide_kaudit_selections_details_1_CL - Alcide kAudit activity details |
| **Vendor documentation/<br>installation instructions** | [Alcide kAudit installation guide](https://awesomeopensource.com/project/alcideio/kaudit?categoryPage=29#before-installing-alcide-kaudit) |
| **Supported by** | [Alcide](https://www.alcide.io/company/contact-us/) |
|

## Alsid for Active Directory

| Data ingestion method: | [Log Analytics agent - custom logs](connect-custom-logs.md) |
| --- | --- |
| **Log Analytics table(s)** | AlsidForADLog_CL |
| **Custom log sample file:** | https://github.com/Azure/azure-quickstart-templates/blob/master/alsid-syslog-proxy/logs/AlsidForAD.log |
| **Kusto function alias:** | afad_parser |
| **Kusto function URL:** | https://aka.ms/sentinel-alsidforad-parser |
| **Vendor documentation/<br>installation instructions** | See below |
| **Supported by** | [Alsid](https://www.alsid.com/contact-us/) |
|

### Configuration instructions

1. **Configure the Syslog server**

    You will first need a **linux Syslog** server that Alsid for AD will send logs to. Typically you can run **rsyslog** on **Ubuntu**. You can then configure this server as you wish, but it is recommended to be able to output AFAD logs in a separate file. Alternatively you can use this [Quickstart template](https://azure.microsoft.com/resources/templates/alsid-syslog-proxy/) which will deploy the Syslog server and the Microsoft agent for you. If you do use this template, you can skip the [agent installation instructions](connect-custom-logs.md#install-the-log-analytics-agent).

1. **Configure Alsid to send logs to your Syslog server**

    On your **Alsid for AD** portal, go to **System**, **Configuration** and then **Syslog**. From there you can create a new Syslog alert toward your Syslog server.

    Once this is done, check that the logs are correctly gathered on your server in a separate file (to do this, you can use the *Test the configuration* button in the Syslog alert configuration in AFAD). If you used the Quickstart template, the Syslog server will by default listen on port 514 in UDP and 1514 in TCP, without TLS.

## Amazon Web Services - Cloudtrail

| Data ingestion method: | Azure service |
| --- | --- |
| **Log Analytics table(s)** | AWSCloudTrail |
| **Vendor documentation/<br>installation instructions** | [Connect data sources](connect-data-sources.md) |
| **Supported by** | Microsoft |
|

## Apache HTTP Server

| Data ingestion method: | [Log Analytics agent - custom logs](connect-custom-logs.md) |
| --- | --- |
| **Log Analytics table(s)** | ApacheHTTPServer_CL |
| **Kusto function alias:** | ApacheHTTPServer |
| **Kusto function URL:** | https://aka.ms/sentinel-apachehttpserver-parser |
| **Custom log sample file:** | access.log or error.log |
| **Supported by** |  |
|

## Apache Tomcat

| Data ingestion method: | [Log Analytics agent - custom logs](connect-custom-logs.md) |
| --- | --- |
| **Log Analytics table(s)** | Tomcat_CL |
| **Kusto function alias:** | TomcatEvent |
| **Kusto function URL:** | https://aka.ms/sentinel-ApacheTomcat-parser |
| **Custom log sample file:** | access.log or error.log |
| **Supported by** | |
|

## Aruba ClearPass (Preview)

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog, with a Kusto function parser |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog |
| **Kusto function alias:** | ArubaClearPass |
| **Kusto function URL:** | https://aka.ms/sentinel-arubaclearpass-parser |
| **Vendor documentation/<br>installation instructions** | Follow Aruba's instructions to [configure ClearPass](https://www.arubanetworks.com/techdocs/ClearPass/6.7/PolicyManager/Content/CPPM_UserGuide/Admin/syslogExportFilters_add_syslog_filter_general.htm). |
| **Supported by** | Microsoft |
|

## Atlassian Confluence Audit (Preview)

| Data ingestion method: | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| --- | --- |
| **Log Analytics table(s)** | Confluence_Audit_CL |
| **Azure Function App code** | https://aka.ms/sentinel-confluenceauditapi-functionapp |
| **API credentials** | <li>ConfluenceAccessToken<li>ConfluenceUsername<li>ConfluenceHomeSiteName |
| **Vendor documentation/<br>installation instructions** | <li>[API Documentation](https://developer.atlassian.com/cloud/confluence/rest/api-group-audit/)<li>[Requirements and instructions for obtaining credentials](https://developer.atlassian.com/cloud/confluence/rest/intro/#auth)<li>[View the audit log](https://support.atlassian.com/confluence-cloud/docs/view-the-audit-log/) |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPY) |
| **Kusto function alias** | ConfluenceAudit |
| **Kusto function URL/<br>Parser config instructions** | https://aka.ms/sentinel-confluenceauditapi-parser |
| **Application settings** | <li>ConfluenceUsername<li>ConfluenceAccessToken<li>ConfluenceHomeSiteName<li>WorkspaceID<li>WorkspaceKey<li>logAnalyticsUri (optional) |
| **Supported by** | Microsoft |
|

## Atlassian Jira Audit (Preview)

| Data ingestion method: | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| --- | --- |
| **Log Analytics table(s)** | Jira_Audit_CL |
| **Azure Function App code** | https://aka.ms/sentinel-jiraauditapi-functionapp |
| **API credentials** | <li>JiraAccessToken<li>JiraUsername<li>JiraHomeSiteName |
| **Vendor documentation/<br>installation instructions** | <li>[API Documentation - Audit records](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-audit-records/)<li>[Requirements and instructions for obtaining credentials](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/#authentication) |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPY) |
| **Kusto function alias** | JiraAudit |
| **Kusto function URL/<br>Parser config instructions** | https://aka.ms/sentinel-jiraauditapi-parser |
| **Application settings** | <li>JiraUsername<li>JiraAccessToken<li>JiraHomeSiteName<li>WorkspaceID<li>WorkspaceKey<li>logAnalyticsUri (optional) |
| **Supported by** | Microsoft |
|

## Azure Active Directory

| Data ingestion method: | Azure service |
| --- | --- |
| **Log Analytics table(s)** | SigninLogs<br>AuditLogs<br>AADNonInteractiveUserSignInLogs<br>AADServicePrincipalSignInLogs<br>AADManagedIdentitySignInLogs<br>AADProvisioningLogs<br>ADFSSignInLogs |
| **Supported by** | Microsoft |
|

## Azure Active Directory Identity Protection

| Data ingestion method: | Azure service |
| --- | --- |
| **Log Analytics table(s)** | SecurityAlert |
| **Supported by** | Microsoft |
|

## Azure Activity

- **Configurable by Azure Policy**

| Data ingestion method: | Azure service |
| --- | --- |
| **Log Analytics table(s)** | AzureActivity |
| **Supported by** | Microsoft |
|

## Azure DDoS Protection

| Data ingestion method: | Azure service |
| --- | --- |
| **Log Analytics table(s)** | AzureDiagnostics |
| **Diagnostics** | DDoSProtectionNotifications<br>DDoSMitigationFlowLogs<br>DDoSMitigationReports |
| **Supported by** | Microsoft |
|

## Azure Defender

| Data ingestion method: | Azure service |
| --- | --- |
| **Log Analytics table(s)** | SecurityAlert |
| **Supported by** | Microsoft |
|

## Azure Defender for IoT

| Data ingestion method: | Azure service |
| --- | --- |
| **Log Analytics table(s)** | SecurityAlert |
| **Supported by** | Microsoft |
|

## Azure Firewall

| Data ingestion method: | Azure service |
| --- | --- |
| **Log Analytics table(s)** | AzureDiagnostics |
| **Diagnostics** | AzureFirewallApplicationRule<br>AzureFirewallNetworkRule |
| **Supported by** | Microsoft |
|

## Azure Information Protection

| Data ingestion method: | Azure service |
| --- | --- |
| **Log Analytics table(s)** | InformationProtectionLogs_CL |
| **Supported by** | Microsoft |
|

- For more information, see [How to modify the reports and create custom queries](/azure/information-protection/reports-aip#how-to-modify-the-reports-and-create-custom-queries).

## Azure Key Vault

- **Configurable by Azure Policy**

| Data ingestion method: | Azure service |
| --- | --- |
| **Log Analytics table(s)** | KeyVaultData |
| **Supported by** | Microsoft |
|

## Azure Kubernetes Service (AKS)

- **Configurable by Azure Policy**

| Data ingestion method: | Azure service |
| --- | --- |
| **Log Analytics table(s)** | kube-apiserver<br>kube-audit<br>kube-audit-admin<br>kube-controller-manager<br>kube-scheduler<br>cluster-autoscaler<br>guard |
| **Supported by** | Microsoft |
|

## Azure SQL Databases

- **Configurable by Azure Policy**

| Data ingestion method: | Azure service |
| --- | --- |
| **Log Analytics table(s)** | SQLSecurityAuditEvents<br>SQLInsights<br>AutomaticTuning<br>QueryStoreWaitStatistics<br>Errors<br>DatabaseWaitStatistics<br>Timeouts<br>Blocks<br>Deadlocks<br>Basic<br>InstanceAndAppAdvanced<br>WorkloadManagement<br>DevOpsOperationsAudit |
| **Supported by** | Microsoft |
|

## Azure Storage Account

- **Configurable by Azure Policy**

| Data ingestion method: | Azure service |
| --- | --- |
| **Log Analytics table(s)** | StorageBlobLogs<br>StorageQueueLogs<br>StorageTableLogs<br>StorageFileLogs |
| **Supported by** | Microsoft |
|

## Azure Web Application Firewall (WAF)

| Data ingestion method: | Azure service |
| --- | --- |
| **Log Analytics table(s)** | AzureDiagnostics |
| **Supported by** | Microsoft |
|


## Barracuda CloudGen Firewall

| Data ingestion method: | [Syslog](connect-syslog.md) |
| --- | --- |
| **Log Analytics table(s)** | Syslog |
| **Kusto function alias:** | CGFWFirewallActivity |
| **Kusto function URL:** | https://aka.ms/sentinel-barracudacloudfirewall-function |
| **Vendor documentation/<br>installation instructions** | https://aka.ms/sentinel-barracudacloudfirewall-connector |
| **Supported by** | [Barracuda](https://www.barracuda.com/support) |
|

## Barracuda WAF

| Data ingestion method: | [Log Analytics agent - custom logs](connect-custom-logs.md) |
| --- | --- |
| **Log Analytics table(s)** | Syslog |
| **Vendor documentation/<br>installation instructions** | https://aka.ms/asi-barracuda-connector |
| **Supported by** | [Barracuda](https://www.barracuda.com/support) |
|

## BETTER Mobile Threat Defense (MTD) (Preview)

| Data ingestion method: | [REST-API](connect-rest-api-template.md) |
| --- | --- |
| **Log Analytics table(s)** | BetterMTDDeviceLog_CL<br>BetterMTDIncidentLog_CL<br>BetterMTDAppLog_CL<br>BetterMTDNetflowLog_CL |
| **Vendor documentation/<br>installation instructions** | [BETTER MTD Documentation](https://mtd-docs.bmobi.net/integrations/azure-sentinel/setup-integration)<br><br>Threat Policy setup (Which incidents should be reported to Azure Sentinel):<br><ol><li>In **Better MTD Console**, click on **Policies** on the side bar.<li>Click on the **Edit** button of the Policy that you are using.<li>For each Incident type that you want to be logged, go to **Send to Integrations** field and select **Sentinel**. |
| **Supported by** | [Better Mobile](mailto:support@better.mobi) |
|


## Beyond Security beSECURE

| Data ingestion method: | [REST-API](connect-rest-api-template.md) |
| --- | --- |
| **Log Analytics table(s)** | beSECURE_ScanResults_CL<br>beSECURE_ScanEvents_CL<br>beSECURE_Audit_CL |
| **Vendor documentation/<br>installation instructions** | Access the **Integration** menu:<br><ol><li>Click on the **More** menu option.<li>Select **Server**<li>Select **Integration**<li>Enable Azure Sentinel<li>Paste the **Workspace ID** and **Primary Key** values in the beSECURE configuration.<li>Click Modify. |
| **Supported by** | [Beyond Security](https://beyondsecurity.freshdesk.com/support/home) |
|


## BlackBerry CylancePROTECT (Preview)

| Data ingestion method: | [Syslog](connect-syslog.md) |
| --- | --- |
| **Log Analytics table(s)** | Syslog |
| **Kusto function alias:** | CylancePROTECT |
| **Kusto function URL:** | https://aka.ms/sentinel-cylanceprotect-parser |
| **Vendor documentation/<br>installation instructions** | [Cylance Syslog Guide](https://docs.blackberry.com/content/dam/docs-blackberry-com/release-pdfs/en/cylance-products/syslog-guides/Cylance%20Syslog%20Guide%20v2.0%20rev12.pdf) |
| **Supported by** | Microsoft |
|

## Broadcom Symantec Data Loss Prevention (DLP) (Preview)

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog, with a Kusto function parser |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog |
| **Kusto function alias:** | SymantecDLP |
| **Kusto function URL:** | https://aka.ms/sentinel-symantecdlp-parser |
| **Vendor documentation/<br>installation instructions** | [Configuring the Log to a Syslog Server action](https://help.symantec.com/cs/DLP15.7/DLP/v27591174_v133697641/Configuring-the-Log-to-a-Syslog-Server-action?locale=EN_US) |
| **Supported by** | Microsoft |
|

## Check Point

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog |
| **Vendor documentation/<br>installation instructions** | [Log Exporter - Check Point Log Export](https://supportcenter.checkpoint.com/supportcenter/portal?eventSubmit_doGoviewsolutiondetails=&solutionid=sk122323) |
| **Supported by** | [Check Point](https://www.checkpoint.com/support-services/contact-support/) |
|

## Cisco ASA

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog |
| **Vendor documentation/<br>installation instructions** | [Cisco ASA Series CLI Configuration Guide](https://www.cisco.com/c/en/us/support/docs/security/pix-500-series-security-appliances/63884-config-asa-00.html) |
| **Supported by** | Microsoft |
|

## Cisco Firepower eStreamer (Preview)

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog |
| **Vendor documentation/<br>installation instructions** | [eStreamer eNcore for Sentinel Operations Guide](https://www.cisco.com/c/en/us/td/docs/security/firepower/670/api/eStreamer_enCore/eStreamereNcoreSentinelOperationsGuide_409.html) |
| **Supported by** | [Cisco](https://www.cisco.com/c/en/us/support/index.html)
| 

### Custom instructions for deploying this connector

1. **Install the Firepower eNcore client**  
Install and configure the Firepower eNcore eStreamer client, for more details see [full install guide](https://www.cisco.com/c/en/us/td/docs/security/firepower/670/api/eStreamer_enCore/eStreamereNcoreSentinelOperationsGuide_409.html).

1. **Download the Firepower Connector from GitHub**  
Download the latest version of the Firepower eNcore connector for Azure Sentinel [here](https://github.com/CiscoSecurity/fp-05-microsoft-sentinel-connector). If you plan on using python3 use the [python3 eStreamer connector](https://github.com/CiscoSecurity/fp-05-microsoft-sentinel-connector/tree/python3).

1. **Create a pkcs12 file using the Azure/VM IP Address**  
Create a pkcs12 certificate using the public IP of the VM instance in Firepower under **System > Integration > eStreamer**. For more information please see the [install guide](https://www.cisco.com/c/en/us/td/docs/security/firepower/670/api/eStreamer_enCore/eStreamereNcoreSentinelOperationsGuide_409.html#_Toc527049443).

1. **Test Connectivity between the Azure/VM Client and the FMC**  
Copy the pkcs12 file from the FMC to the Azure/VM instance and run the test utility (./encore.sh test) to ensure a connection can be established. For more details please see the [setup guide](https://www.cisco.com/c/en/us/td/docs/security/firepower/670/api/eStreamer_enCore/eStreamereNcoreSentinelOperationsGuide_409.html#_Toc527049430).

1. **Configure eNcore to stream data to the agent**  
Configure eNcore to stream data via TCP to the Log Analytics Agent. This should be enabled by default. However, additional ports and streaming protocols can be configured depending on your network security posture. It is also possible to save the data to the file system. For more information please see [Configure eNcore](https://www.cisco.com/c/en/us/td/docs/security/firepower/670/api/eStreamer_enCore/eStreamereNcoreSentinelOperationsGuide_409.html#_Toc527049433).

## Cisco Meraki (Preview)

| Data ingestion method: | [Syslog](connect-syslog.md) |
| --- | --- |
| **Log Analytics table(s)** | Syslog |
| **Kusto function alias:** | CiscoMeraki |
| **Kusto function URL:** | https://aka.ms/sentinel-ciscomeraki-parser |
| **Vendor documentation/<br>installation instructions** | [Meraki Device Reporting documentation](https://documentation.meraki.com/General_Administration/Monitoring_and_Reporting/Meraki_Device_Reporting_-_Syslog%2C_SNMP_and_API) |
| **Supported by** | Microsoft |
|

## Cisco Umbrella (Preview)

| Data ingestion method: | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| --- | --- |
| **Log Analytics table(s)** | Cisco_Umbrella_dns_CL<br>Cisco_Umbrella_proxy_CL<br>Cisco_Umbrella_ip_CL<br>Cisco_Umbrella_cloudfirewall_CL |
| **Azure Function App code** | https://aka.ms/sentinel-CiscoUmbrellaConn-functionapp |
| **API credentials** | <li>AWS Access Key Id<li>AWS Secret Access Key<li>AWS S3 Bucket Name |
| **Vendor documentation/<br>installation instructions** | <li>[Logging to Amazon S3](https://docs.umbrella.com/deployment-umbrella/docs/log-management#section-logging-to-amazon-s-3) |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPY) |
| **Kusto function alias** | Cisco_Umbrella |
| **Kusto function URL/<br>Parser config instructions** | https://aka.ms/sentinel-ciscoumbrella-function |
| **Application settings** | <li>WorkspaceID<li>WorkspaceKey<li>S3Bucket<li>AWSAccessKeyId<li>AWSSecretAccessKey<li>logAnalyticsUri (optional) |
| **Supported by** | Microsoft |
|

## Cisco Unified Computing System (UCS) (Preview)

| Data ingestion method: | [Syslog](connect-syslog.md) |
| --- | --- |
| **Log Analytics table(s)** | Syslog |
| **Kusto function alias:** | CiscoUCS |
| **Kusto function URL:** | https://aka.ms/sentinel-ciscoucs-function |
| **Vendor documentation/<br>installation instructions** | [Set up Syslog for Cisco UCS - Cisco](https://www.cisco.com/c/en/us/support/docs/servers-unified-computing/ucs-manager/110265-setup-syslog-for-ucs.html#configsremotesyslog) |
| **Supported by** | Microsoft |
|

## Citrix Analytics (Security)

| Data ingestion method: | [REST-API](connect-rest-api-template.md) |
| --- | --- |
| **Log Analytics table(s)** | CitrixAnalytics_SAlerts_CL​ |
| **Vendor documentation/<br>installation instructions** | [Connect Citrix to Azure Sentinel](https://aka.ms/Sentinel-Citrix-Connector) |
| **Supported by** | [Citrix Systems](https://www.citrix.com/support/) |
|

## Citrix Web App Firewall (WAF) (Preview)

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog |
| **Vendor documentation/<br>installation instructions** | To configure WAF, see [Support WIKI - WAF Configuration with NetScaler](https://support.citrix.com/article/CTX234174).<br>To configure CEF logs, see [CEF Logging Support in the Application Firewall](https://support.citrix.com/article/CTX136146).<br>To forward the logs to proxy, see [Configuring Citrix ADC appliance for audit logging](https://docs.citrix.com/en-us/citrix-adc/current-release/system/audit-logging/configuring-audit-logging.html). |
| **Supported by** | [Citrix Systems](https://www.citrix.com/support/) |

## Cognni (Preview)

| Data ingestion method: | [REST-API](connect-rest-api-template.md) |
| --- | --- |
| **Log Analytics table(s)** | CognniIncidents_CL |
| **Vendor documentation/<br>installation instructions** | **Connect to Cognni**<br><ol><li>Go to [Cognni integrations page](https://intelligence.cognni.ai/integrations).<li>Click **Connect** on the Azure Sentinel box.<li>Paste **workspaceId** and **sharedKey** (Primary Key) to the fields on Cognni's integrations screen.<li>Click the **Connect** botton to complete the configuration. |
| **Supported by** | [Cognni](https://cognni.ai/contact-support/)
|

## CyberArk Enterprise Password Vault (EPV) Events (Preview)

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog |
| **Vendor documentation/<br>installation instructions** | [Security Information and Event Management (SIEM) Applications](https://docs.cyberark.com/Product-Doc/OnlineHelp/PAS/Latest/en/Content/PASIMP/DV-Integrating-with-SIEM-Applications.htm) |
| **Supported by** | [CyberArk](https://www.cyberark.com/customer-support/) |
| 


## Cyberpion Security Logs (Preview)

| Data ingestion method: | [REST-API](connect-rest-api-template.md) |
| --- | --- |
| **Log Analytics table(s)** | CyberpionActionItems_CL |
| **Vendor documentation/<br>installation instructions** | [Get a Cyberpion subscription](https://azuremarketplace.microsoft.com/en/marketplace/apps/cyberpion1597832716616.cyberpion)<br>[Integrate Cyberpion security alerts into Azure Sentinel](https://www.cyberpion.com/resource-center/integrations/azure-sentinel/) |
| **Supported by** | [Cyberpion](https://www.cyberpion.com/) |
|

## Domain name server

| Data ingestion method: | Azure service |
| --- | --- |
| **Log Analytics table(s)** |  |
| **Supported by** | Microsoft |
|

## Dynamics 365

| Data ingestion method: | Azure service |
| --- | --- |
| **Log Analytics table(s)** |  |
| **Supported by** | Microsoft |
|

## ESET Enterprise Inspector (Preview)

| Data ingestion method: | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| --- | --- |
| **Log Analytics table(s)** | ESETEnterpriseInspector_CL​ |
| **Azure Function App code** |  |
| **API credentials** | <li>EEI Username<li>EEI Password<li>Base URL |
| **Vendor documentation/<br>installation instructions** | <li>[ESET Enterprise Inspector REST API documentation](https://help.eset.com/eei/1.5/en-US/api.html) |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) |
| **Application settings** |  |
| **Supported by** | [ESET](https://support.eset.com/en) |
|

### Create an API user

1. Log into the ESET Security Management Center / ESET PROTECT console with an administrator account, select the **More** tab and the **Users** subtab.
1. Click on the **ADD NEW** button and add a **native user**.
1. Create a new user for the API account. **Optional:** Select a **Home group** other than **All** to limit what detections are ingested.
1. Under the **Permission Sets** tab, assign the **Enterprise Inspector reviewer** permission set.
1. Log out of the administrator account and log into the console with the new API credentials for validation, then log out of the API account.

## ESET Security Management Center (SMC) (Preview)

**Data ingestion method:** [Log Analytics Agent custom logs](connect-data-sources.md#custom-logs).

| **Supported by** | [ESET](https://support.eset.com/en)

| Data ingestion method: | [Syslog](connect-syslog.md) |
| --- | --- |
| **Log Analytics table(s)** | eset_CL |
| **Vendor documentation/<br>installation instructions** | [ESET Syslog server documentation](https://help.eset.com/esmc_admin/70/en-US/admin_server_settings_syslog.html) |
| **Supported by** | [ESET](https://support.eset.com/en) |
|

### Configure the logs to be collected

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

In order to easily recognize Eset data, we will push it to a separate table and parse at agent so query in Azure Sentinel is easier and faster. To make it simple we will just modify `match oms.**` section to send data as API objects by changing type to `out_oms_api`. Modify file on /etc/opt/microsoft/omsagent/{REPLACEyourworkspaceid}/conf/omsagent.conf. Full `match oms.**` section looks like this:

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

Modify file /etc/opt/microsoft/omsagent/{REPLACEyourworkspaceid}/conf/omsagent.d/syslog.conf

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

- Go to Syslog server configuration as described in Eset documentation and configure Host (your connector), Format BSD, Transport TCP
- Go to Logging section as described in Eset documentation and enable JSON

## Exabeam Advanced Analytics (Preview)

| Data ingestion method: | [Syslog](connect-syslog.md) |
| --- | --- |
| **Log Analytics table(s)** | Syslog |
| **Kusto function alias:** | ExabeamEvent |
| **Kusto function URL:** | https://aka.ms/sentinel-Exabeam-parser |
| **Vendor documentation/<br>installation instructions** | [Configure Advanced Analytics system activity notifications](https://docs.exabeam.com/en/advanced-analytics/i54/advanced-analytics-administration-guide/113254-configure-advanced-analytics.html#UUID-7ce5ff9d-56aa-93f0-65de-c5255b682a08) |
| **Supported by** | Microsoft |
|


## ExtraHop Reveal(x)

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog |
| **Vendor documentation/<br>installation instructions** | [ExtraHop Detection SIEM Connector](https://aka.ms/asi-syslog-extrahop-forwarding) |
| **Supported by** | [ExtraHop](https://www.extrahop.com/support/) |
| 


## F5 BIG-IP

| Data ingestion method: | [REST-API](connect-rest-api-template.md) |
| --- | --- |
| **Log Analytics table(s)** | F5Telemetry_LTM_CL<br>F5Telemetry_system_CL<br>F5Telemetry_ASM_CL |
| **Vendor documentation/<br>installation instructions** | [Integrating the F5 BIG-IP with Azure Sentinel](https://aka.ms/F5BigIp-Integrate) |
| **Supported by** | [F5 Networks](https://support.f5.com/csp/home) |
|

## F5 Networks (ASM)

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog |
| **Vendor documentation/<br>installation instructions** | [Configuring Application Security Event Logging](https://aka.ms/asi-syslog-f5-forwarding) |
| **Supported by** | [F5 Networks](https://support.f5.com/csp/home) |
| 


## Forcepoint Cloud Access Security Broker (CASB) (Preview)

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog |
| **Vendor documentation/<br>installation instructions** | [Forcepoint CASB and Azure Sentinel](https://forcepoint.github.io/docs/casb_and_azure_sentinel/) |
| **Supported by** | [Forcepoint](https://support.forcepoint.com/) |
| 


## Forcepoint Cloud Security Gateway (CSG) (Preview)

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog |
| **Vendor documentation/<br>installation instructions** | [Forcepoint Cloud Security Gateway and Azure Sentinel](https://forcepoint.github.io/docs/csg_and_sentinel/) |
| **Supported by** | [Forcepoint](https://support.forcepoint.com/) |
| 


## Forcepoint Data Loss Prevention (DLP) (Preview)

| Data ingestion method: | [REST-API](connect-rest-api-template.md) |
| --- | --- |
| **Log Analytics table(s)** | ForcepointDLPEvents_CL |
| **Vendor documentation/<br>installation instructions** | [Forcepoint Data Loss Prevention and Azure Sentinel](https://forcepoint.github.io/docs/dlp_and_azure_sentinel/) |
| **Supported by** | [Forcepoint](https://support.forcepoint.com/) |
|

## Forcepoint Next Generation Firewall (NGFW) (Preview)

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog |
| **Vendor documentation/<br>installation instructions** | [Forcepoint Next-Gen Firewall and Azure Sentinel](https://forcepoint.github.io/docs/ngfw_and_azure_sentinel/) |
| **Supported by** | [Forcepoint](https://support.forcepoint.com/) |
| 


## ForgeRock Common Audit (CAUD) for CEF (Preview)

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog |
| **Vendor documentation/<br>installation instructions** | [Install this first! ForgeRock Common Audit (CAUD) for Azure Sentinel](https://github.com/javaservlets/SentinelAuditEventHandler) |
| **Supported by** | [ForgeRock](https://www.forgerock.com/support) |
| 


## Fortinet

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog |
| **Vendor documentation/<br>installation instructions** | [Fortinet Document Library](https://aka.ms/asi-syslog-fortinet-fortinetdocumentlibrary)<br>Choose your version and use the *Handbook* and *Log Message Reference* PDFs. |
| **Supported by** | [Fortinet](https://support.fortinet.com/) |
| 

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


## Google Workspace (G-Suite) (Preview)

| Data ingestion method: | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| --- | --- |
| **Log Analytics table(s)** | GWorkspace_ReportsAPI_admin_CL<br>GWorkspace_ReportsAPI_calendar_CL<br>GWorkspace_ReportsAPI_drive_CL<br>GWorkspace_ReportsAPI_login_CL<br>GWorkspace_ReportsAPI_mobile_CL<br>GWorkspace_ReportsAPI_token_CL<br>GWorkspace_ReportsAPI_user_accounts_CL<br> |
| **Azure Function App code** | https://aka.ms/sentinel-GWorkspaceReportsAPI-functionapp |
| **API credentials** | <li>GooglePickleString |
| **Vendor documentation/<br>installation instructions** | <li>[API Documentation](https://developers.google.com/admin-sdk/reports/v1/reference/activities)<li>Get credentials at [Perform Google Workspace Domain-Wide Delegation of Authority](https://developers.google.com/admin-sdk/reports/v1/guides/delegation)<li>[Convert token.pickle file to pickle string](https://aka.ms/sentinel-GWorkspaceReportsAPI-functioncode) |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPY) |
| **Kusto function alias** | GWorkspaceActivityReports |
| **Kusto function URL/<br>Parser config instructions** | https://aka.ms/sentinel-GWorkspaceReportsAPI-parser |
| **Application settings** | <li>GooglePickleString<li>WorkspaceID<li>workspaceKey<li>logAnalyticsUri (optional) |
| **Supported by** | Microsoft |
|

### Configuration steps for the Google Reports API

Add http://localhost:8081/ under **Authorised redirect URIs** while creating [Web application credentials](https://developers.google.com/workspace/guides/create-credentials#web).

1. [Follow the instructions](https://developers.google.com/admin-sdk/reports/v1/quickstart/python) to obtain the credentials.json.
1. To get the Google pickle string run [this python script](https://aka.ms/sentinel-GWorkspaceReportsAPI-functioncode) (in the same path as credentials.json).
1. Copy the pickle string output in single quotes and save. It will be needed for deploying the Function App.

## Illusive Attack Management System (AMS) (Preview)

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog |
| **Vendor documentation/<br>installation instructions** | [Illusive Networks Admin Guide](https://support.illusivenetworks.com/hc/en-us/sections/360002292119-Documentation-by-Version) |
| **Supported by** | [Illusive Networks](https://www.illusivenetworks.com/technical-support/) |
| 

## Imperva WAF Gateway (Preview)

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog |
| **Vendor documentation/<br>installation instructions** | [Steps for Enabling Imperva WAF Gateway Alert Logging to Azure Sentinel](https://community.imperva.com/blogs/craig-burlingame1/2020/11/13/steps-for-enabling-imperva-waf-gateway-alert) |
| **Supported by** | [Imperva](https://www.imperva.com/support/technical-support/) |
| 


## Infoblox Network Identity Operating System (NIOS) (Preview)

| Data ingestion method: | [Syslog](connect-syslog.md) |
| --- | --- |
| **Log Analytics table(s)** | Syslog |
| **Kusto function alias:** | InfobloxNIOS |
| **Kusto function URL:** | https://aka.ms/sentinelgithubparsersinfoblox |
| **Vendor documentation/<br>installation instructions** | [NIOS SNMP and Syslog Deployment Guide](https://www.infoblox.com/wp-content/uploads/infoblox-deployment-guide-slog-and-snmp-configuration-for-nios.pdf) |
| **Supported by** | Microsoft |
|

## Juniper SRX (Preview)

| Data ingestion method: | [Syslog](connect-syslog.md) |
| --- | --- |
| **Log Analytics table(s)** | Syslog |
| **Kusto function alias:** | JuniperSRX |
| **Kusto function URL:** | https://aka.ms/sentinel-junipersrx-parser |
| **Vendor documentation/<br>installation instructions** | [Configure Traffic Logging (Security Policy Logs) for SRX Branch Devices](https://kb.juniper.net/InfoCenter/index?page=content&id=KB16509&actp=METADATA)<br>[Configure System Logging](https://kb.juniper.net/InfoCenter/index?page=content&id=kb16502) |
| **Supported by** | [Juniper Networks](https://support.juniper.net/support/) |
|


## Microsoft 365 Defender

| Data ingestion method: | Azure service |
| --- | --- |
| **Log Analytics table(s)** | SecurityAlert<br>SecurityIncident<br>DeviceEvents<br>DeviceFileEvents<br>DeviceImageLoadEvents<br>DeviceInfo<br>DeviceLogonEvents<br>DeviceNetworkEvents<br>DeviceNetworkInfo<br>DeviceProcessEvents<br>DeviceRegistryEvents<br>DeviceFileCertificateInfo |
| **Supported by** | Microsoft |
|

## Microsoft Cloud App Security (MCAS)

| Data ingestion method: | Azure service |
| --- | --- |
| **Log Analytics table(s)** | SecurityAlert |
| **Supported by** | Microsoft |
|

## Microsoft Defender for Endpoint

| Data ingestion method: | Azure service |
| --- | --- |
| **Log Analytics table(s)** | SecurityAlert |
| **Supported by** | Microsoft |
|

## Microsoft Defender for Identity

| Data ingestion method: | Azure service |
| --- | --- |
| **Log Analytics table(s)** | SecurityAlert |
| **Supported by** | Microsoft |
|

## Microsoft Defender for Office 365

| Data ingestion method: | Azure service |
| --- | --- |
| **Log Analytics table(s)** | SecurityAlert |
| **Supported by** | Microsoft |
|

## Microsoft Office 365

| Data ingestion method: | Azure service |
| --- | --- |
| **Log Analytics table(s)** | OfficeActivity |
| **Supported by** | Microsoft |
|

## Morphisec UTPP (Preview)

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog, with a Kusto function parser |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog |
| **Kusto function alias:** | Morphisec |
| **Kusto function URL** | https://aka.ms/sentinel-Morphiescutpp-parser |
| **Vendor documentation/<br>installation instructions** |  |
| **Supported by** | [Morphisec](https://support.morphisec.com/support/home) |
|


## Netskope (Preview)

| Data ingestion method: | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| --- | --- |
| **Log Analytics table(s)** | Netskope_CL |
| **Azure Function App code** | https://aka.ms/sentinel-netskope-functioncode |
| **API credentials** | <li>Netskope API Token |
| **Vendor documentation/<br>installation instructions** | <li>[Netskope Cloud Security Platform](https://www.netskope.com/platform)<li>[Netskope API Documentation](https://innovatechcloud.goskope.com/docs/Netskope_Help/en/rest-api-v1-overview.html)<li>[Obtain an API Token](https://innovatechcloud.goskope.com/docs/Netskope_Help/en/rest-api-v2-overview.html) |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPS) |
| **Kusto function alias** | Netskope |
| **Kusto function URL/<br>Parser config instructions** | https://aka.ms/sentinel-netskope-parser |
| **Application settings** | <li>apikey<li>workspaceID<li>workspaceKey<li>uri (depends on region, follows schema: `https://<Tenant Name>.goskope.com`) <li>timeInterval (set to 5)<li>logTypes<li>logAnalyticsUri (optional) |
| **Supported by** | Microsoft |
|

## NGINX HTTP Server (Preview)

| Data ingestion method: | [Log Analytics agent - custom logs](connect-custom-logs.md) |
| --- | --- |
| **Log Analytics table(s)** | NGINX_CL |
| **Kusto function alias:** | NGINXHTTPServer |
| **Kusto function URL** | https://aka.ms/sentinel-NGINXHTTP-parser |
| **Vendor documentation/<br>installation instructions** | [Module ngx_http_log_module](https://nginx.org/en/docs/http/ngx_http_log_module.html) |
| **Custom log sample file:** | access.log or error.log |
| **Supported by** | Microsoft |
|

## NXLog Basic Security Module (BSM) macOS (Preview)

| Data ingestion method: | [REST-API](connect-rest-api-template.md) |
| --- | --- |
| **Log Analytics table(s)** | BSMmacOS_CL |
| **Vendor documentation/<br>installation instructions** | [NXLog Azure Sentinel User Guide](https://nxlog.co/documentation/nxlog-user-guide/sentinel.html) |
| **Supported by** | [NXLog](https://nxlog.co/community-forum) |
|


## NXLog DNS Logs (Preview)

| Data ingestion method: | [REST-API](connect-rest-api-template.md) |
| --- | --- |
| **Log Analytics table(s)** | DNS_Logs_CL |
| **Vendor documentation/<br>installation instructions** | [NXLog Azure Sentinel User Guide](https://nxlog.co/documentation/nxlog-user-guide/sentinel.html) |
| **Supported by** | [NXLog](https://nxlog.co/community-forum) |
|


## NXLog LinuxAudit (Preview)

| Data ingestion method: | [REST-API](connect-rest-api-template.md) |
| --- | --- |
| **Log Analytics table(s)** | LinuxAudit_CL |
| **Vendor documentation/<br>installation instructions** |  [NXLog Azure Sentinel User Guide](https://nxlog.co/documentation/nxlog-user-guide/sentinel.html) |
| **Supported by** | [NXLog](https://nxlog.co/community-forum) |
|


## Okta Single Sign-On (Preview)

| Data ingestion method: | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| --- | --- |
| **Log Analytics table(s)** | Okta_CL |
| **Azure Function App code** | https://aka.ms/sentineloktaazurefunctioncodev2 |
| **API credentials** | <li>API Token |
| **Vendor documentation/<br>installation instructions** | <li>[Okta System Log API Documentation](https://developer.okta.com/docs/reference/api/system-log/)<li>[Create an API token](https://developer.okta.com/docs/guides/create-an-api-token/create-the-token/)<li>[Connect Okta SSO to Azure Sentinel](connect-okta-single-sign-on.md) |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPS) |
| **Application settings** | <li>apiToken<li>workspaceID<li>workspaceKey<li>uri (follows schema `https://<OktaDomain>/api/v1/logs?since=`. [Identify your domain namespace](https://developer.okta.com/docs/reference/api-overview/#url-namespace).) <li>logAnalyticsUri (optional) |
| **Supported by** | Microsoft |
|


## Onapsis Platform (Preview)

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog, with a Kusto lookup and enrichment function |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog |
| **Kusto function alias:** | incident_lookup |
| **Kusto function URL** | https://aka.ms/sentinel-Onapsis-parser |
| **Vendor documentation/<br>installation instructions** |  |
| **Supported by** | [Onapsis](https://onapsis.force.com/s/login/) |
| 


## One Identity Safeguard (Preview)

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog |
| **Vendor documentation/<br>installation instructions** | [One Identity Safeguard for Privileged Sessions Administration Guide](https://aka.ms/sentinel-cef-oneidentity-forwarding) |
| **Supported by** | [One Identity](https://support.oneidentity.com/) |
| 


## Oracle WebLogic Server (Preview)

| Data ingestion method: | [Log Analytics agent - custom logs](connect-custom-logs.md) |
| --- | --- |
| **Log Analytics table(s)** | OracleWebLogicServer_CL |
| **Kusto function alias:** | OracleWebLogicServerEvent |
| **Kusto function URL:** | https://aka.ms/sentinel-OracleWebLogicServer-parser |
| **Vendor documentation/<br>installation instructions** | [Oracle WebLogic Server documentation](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/index.html) |
| **Custom log sample file:** | server.log |
| **Supported by** | Microsoft |
|

## Orca Security (Preview)

| Data ingestion method: | [REST-API](connect-rest-api-template.md) |
| --- | --- |
| **Log Analytics table(s)** | OrcaAlerts_CL |
| **Vendor documentation/<br>installation instructions** | [Azure Sentinel integration](https://orcasecurity.zendesk.com/hc/en-us/articles/360043941992-Azure-Sentinel-configuration) |
| **Supported by** | [Orca Security](http://support.orca.security/) |
|


## OSSEC (Preview)

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog, with a Kusto function parser |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog |
| **Kusto function alias:** | OSSECEvent |
| **Kusto function URL:** | https://aka.ms/sentinel-OSSEC-parser |
| **Vendor documentation/<br>installation instructions** | [OSSEC documentation](https://www.ossec.net/docs/)<br>[Sending alerts via syslog](https://www.ossec.net/docs/docs/manual/output/syslog-output.html) |
| **Supported by** | Microsoft |
| 


## Palo Alto Networks

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog |
| **Vendor documentation/<br>installation instructions** | [Common Event Format (CEF) Configuration Guides](https://aka.ms/asi-syslog-paloalto-forwarding)<br>[Configure Syslog Monitoring](https://aka.ms/asi-syslog-paloalto-configure) |
| **Supported by** | [Palo Alto Networks](https://www.paloaltonetworks.com/company/contact-support) |
| 


## Perimeter 81 Activity Logs (Preview)

| Data ingestion method: | [REST-API](connect-rest-api-template.md) |
| --- | --- |
| **Log Analytics table(s)** | Perimeter81_CL |
| **Vendor documentation/<br>installation instructions** | [Perimeter 81 documentation](https://support.perimeter81.com/docs/360012680780) |
| **Supported by** | [Perimeter 81](https://support.perimeter81.com/) |
|


## Proofpoint On Demand (POD) Email Security (Preview)

| Data ingestion method: | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| --- | --- |
| **Log Analytics table(s)** | ProofpointPOD_message_CL<br>ProofpointPOD_maillog_CL |
| **Azure Function App code** | https://aka.ms/sentinel-proofpointpod-functionapp |
| **API credentials** | <li>ProofpointClusterID<li>ProofpointToken |
| **Vendor documentation/<br>installation instructions** | <li>[Sign in to the Proofpoint Community](https://proofpointcommunities.force.com/community/s/article/How-to-request-a-Community-account-and-gain-full-customer-access?utm_source=login&utm_medium=recommended&utm_campaign=public)<li>[Proofpoint API documentation and instructions](https://proofpointcommunities.force.com/community/s/article/Proofpoint-on-Demand-Pod-Log-API) |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPY) |
| **Kusto function alias** | ProofpointPOD |
| **Kusto function URL/<br>Parser config instructions** | https://aka.ms/sentinel-proofpointpod-parser |
| **Application settings** | <li>ProofpointClusterID<li>ProofpointToken<li>WorkspaceID<li>WorkspaceKey<li>logAnalyticsUri (optional) |
| **Supported by** | Microsoft |
|

## Proofpoint Targeted Attack Protection (TAP) (Preview)

| Data ingestion method: | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| --- | --- |
| **Log Analytics table(s)** | ProofPointTAPClicksPermitted_CL<br>ProofPointTAPClicksBlocked_CL<br>ProofPointTAPMessagesDelivered_CL<br>ProofPointTAPMessagesBlocked_CL |
| **Azure Function App code** | https://aka.ms/sentinelproofpointtapazurefunctioncode |
| **API credentials** | <li>API Username<li>API Password |
| **Vendor documentation/<br>installation instructions** | <li>[Proofpoint SIEM API Documentation](https://help.proofpoint.com/Threat_Insight_Dashboard/API_Documentation/SIEM_API) |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPS) |
| **Application settings** | <li>apiUsername<li>apiUsername<li>uri (set to `https://tap-api-v2.proofpoint.com/v2/siem/all?format=json&sinceSeconds=300`)<li>WorkspaceID<li>WorkspaceKey<li>logAnalyticsUri (optional) |
| **Supported by** | Microsoft |
|

## Pulse Connect Secure (Preview)

| Data ingestion method: | [Syslog](connect-syslog.md) |
| --- | --- |
| **Log Analytics table(s)** | Syslog |
| **Kusto function alias:** | PulseConnectSecure |
| **Kusto function URL:** | https://aka.ms/sentinelgithubparserspulsesecurevpn |
| **Vendor documentation/<br>installation instructions** | [Configuring Syslog](https://docs.pulsesecure.net/WebHelp/Content/PCS/PCS_AdminGuide_8.2/Configuring%20Syslog.htm) |
| **Supported by** | Microsoft |
|


## Qualys VM KnowledgeBase (KB) (Preview)

| Data ingestion method: | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| --- | --- |
| **Log Analytics table(s)** | QualysKB_CL |
| **Azure Function App code** | https://aka.ms/sentinel-qualyskb-functioncode |
| **API credentials** | <li>API Username<li>API Password |
| **Vendor documentation/<br>installation instructions** | <li>[QualysVM API User Guide](https://www.qualys.com/docs/qualys-api-vmpc-user-guide.pdf) |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPS) |
| **Kusto function alias** | QualysKB |
| **Kusto function URL/<br>Parser config instructions** | https://aka.ms/sentinel-qualyskb-parser |
| **Application settings** | <li>apiUsername<li>apiUsername<li>uri (by region; see [API Server list](https://www.qualys.com/docs/qualys-api-vmpc-user-guide.pdf#G4.735348). Follows schema `https://<API Server>/api/2.0`.<li>WorkspaceID<li>WorkspaceKey<li>filterParameters (add to end of URI, delimited by `&`. No spaces.)<li>logAnalyticsUri (optional) |
| **Supported by** | Microsoft |
|

### Custom instructions to deploy this connector

#### Step 1 - Configuration steps for the Qualys API

1. Log into the Qualys Vulnerability Management console with an administrator account, select the **Users** tab and the **Users** subtab.
1. Click on the **New** drop-down menu and select **Users**.
1. Create a username and password for the API account.
1. In the **User Roles** tab, ensure the account role is set to **Manager** and access is allowed to **GUI** and **API**
1. Log out of the administrator account and log into the console with the new API credentials for validation, then log out of the API account.
1. Log back into the console using an administrator account and modify the API accounts User Roles, removing access to **GUI**.
1. Save all changes.

## Qualys Vulnerability Management (VM) (Preview)

| Data ingestion method: | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| --- | --- |
| **Log Analytics table(s)** | QualysHostDetection_CL |
| **Azure Function App code** | https://aka.ms/sentinelqualysvmazurefunctioncode |
| **API credentials** | <li>API Username<li>API Password |
| **Vendor documentation/<br>installation instructions** | <li>[QualysVM API User Guide](https://www.qualys.com/docs/qualys-api-vmpc-user-guide.pdf) |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPS) |
| **Application settings** | <li>apiUsername<li>apiUsername<li>uri (by region; see [API Server list](https://www.qualys.com/docs/qualys-api-vmpc-user-guide.pdf#G4.735348). Follows schema `https://<API Server>/api/2.0/fo/asset/host/vm/detection/?action=list&vm_processed_after=`.<li>WorkspaceID<li>WorkspaceKey<li>filterParameters (add to end of URI, delimited by `&`. No spaces.)<li>timeInterval (set to 5. If you modify, change Function App timer trigger accordingly.)<li>logAnalyticsUri (optional) |
| **Supported by** | Microsoft |
|

### Custom instructions to deploy this connector

#### Step 1 - Configuration steps for the Qualys API

1. Log into the Qualys Vulnerability Management console with an administrator account, select the **Users** tab and the **Users** subtab.
1. Click on the **New** drop-down menu and select **Users**.
1. Create a username and password for the API account.
1. In the **User Roles** tab, ensure the account role is set to **Manager** and access is allowed to **GUI** and **API**
1. Log out of the administrator account and log into the console with the new API credentials for validation, then log out of the API account.
1. Log back into the console using an administrator account and modify the API accounts User Roles, removing access to **GUI**.
1. Save all changes.

#### Manual deployment - after configuring the Function App

**Configure the host.json file**

Due to the potentially large amount of Qualys host detection data being ingested, it can cause the execution time to surpass the default Function App timeout of five (5) minutes. Increase the default timeout duration to the maximum of ten (10) minutes, under the Consumption Plan, to allow more time for the Function App to execute.

1. In the Function App, select the Function App Name and select the **App Service Editor** blade.
1. Click **Go** to open the editor, then select the **host.json** file under the **wwwroot** directory.
1. Add the line `"functionTimeout": "00:10:00",` above the `managedDependancy` line.
1. Ensure **SAVED** appears on the top right corner of the editor, then exit the editor.

If a longer timeout duration is required, consider upgrading to an [App Service Plan](../azure-functions/functions-scale.md).


## Salesforce Service Cloud (Preview)

| Data ingestion method: | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| --- | --- |
| **Log Analytics table(s)** | SalesforceServiceCloud_CL |
| **Azure Function App code** | https://aka.ms/sentinel-SalesforceServiceCloud-functionapp |
| **API credentials** | <li>Salesforce API Username<li>Salesforce API Password<li>Salesforce Security Token<li>Salesforce Consumer Key<li>Salesforce Consumer Secret |
| **Vendor documentation/<br>installation instructions** | [Salesforce REST API Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/quickstart.htm)<br>Under **Set up authorization**, use **Session ID** method instead of OAuth. |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPY) |
| **Kusto function alias** | SalesforceServiceCloud |
| **Kusto function URL/<br>Parser config instructions** | https://aka.ms/sentinel-SalesforceServiceCloud-parser |
| **Application settings** | <li>SalesforceUser<li>SalesforcePass<li>SalesforceSecurityToken<li>SalesforceConsumerKey<li>SalesforceConsumerSecret<li>WorkspaceID<li>WorkspaceKey<li>logAnalyticsUri (optional) |
| **Supported by** | Microsoft |
|


## Security events (Windows)

| Data ingestion method: | Azure service |
| --- | --- |
| **Log Analytics table(s)** |  |
| **Supported by** | Microsoft |
|

For more information, see [Insecure protocols workbook setup](./get-visibility.md#use-built-in-workbooks).

## SentinelOne (Preview)

| Data ingestion method: | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| --- | --- |
| **Log Analytics table(s)** | SentinelOne_CL |
| **Azure Function App code** | https://aka.ms/sentinel-SentinelOneAPI-functionapp |
| **API credentials** | <li>SentinelOneAPIToken<li>SentinelOneUrl (`https://<SOneInstanceDomain>.sentinelone.net`) |
| **Vendor documentation/<br>installation instructions** | <li>https://`<SOneInstanceDomain>`.sentinelone.net/api-doc/overview<li>See instructions below |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPY) |
| **Kusto function alias** | SentinelOne |
| **Kusto function URL/<br>Parser config instructions** | https://aka.ms/sentinel-SentinelOneAPI-parser |
| **Application settings** | <li>SentinelOneAPIToken<li>SentinelOneUrl<li>WorkspaceID<li>WorkspaceKey<li>logAnalyticsUri (optional) |
| **Supported by** | Microsoft |
|

### Custom instructions for deploying this connector

#### STEP 1 - Configuration steps for the SentinelOne API

Follow the instructions to obtain the credentials.

1. Log in to the SentinelOne Management Console with Admin user credentials.
1. In the Management Console, click **Settings**.
1. In the **SETTINGS** view, click **USERS**
1. Click **New User**.
1. Enter the information for the new console user.
1. In Role, select **Admin**.
1. Click **SAVE**
1. Save credentials of the new user for using in the data connector.

## SonicWall Firewall (Preview)

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog |
| **Vendor documentation/<br>installation instructions** | [Log > Syslog](http://help.sonicwall.com/help/sw/eng/7020/26/2/3/content/Log_Syslog.120.2.htm)<br>Select facility local4 and ArcSight as the Syslog format.  |
| **Supported by** | [SonicWall](https://www.sonicwall.com/support/) |
| 


## Sophos Cloud Optix (Preview)

| Data ingestion method: | [REST-API](connect-rest-api-template.md) |
| --- | --- |
| **Log Analytics table(s)** | SophosCloudOptix_CL |
| **Vendor documentation/<br>installation instructions** | [Integrate with Azure Sentinel](https://docs.sophos.com/pcg/optix/help/en-us/pcg/optix/tasks/IntegrateAzureSentinel.html) (SKIP STEP 1!)<br>[Sophos query samples](https://docs.sophos.com/pcg/optix/help/en-us/pcg/optix/concepts/ExampleAzureSentinelQueries.html) |
| **Supported by** | [Sophos](https://secure2.sophos.com/en-us/support.aspx) |
|


## Sophos XG Firewall (Preview)

| Data ingestion method: | [Syslog](connect-syslog.md) |
| --- | --- |
| **Log Analytics table(s)** | Syslog |
| **Kusto function alias:** | SophosXGFirewall |
| **Kusto function URL:** | https://aka.ms/sentinelgithubparserssophosfirewallxg |
| **Vendor documentation/<br>installation instructions** | [Add a syslog server](https://docs.sophos.com/nsg/sophos-firewall/18.5/Help/en-us/webhelp/onlinehelp/nsg/tasks/SyslogServerAdd.html) |
| **Supported by** | Microsoft |
|

## Squadra Technologies secRMM

| Data ingestion method: | [REST-API](connect-rest-api-template.md) |
| --- | --- |
| **Log Analytics table(s)** | secRMM_CL |
| **Vendor documentation/<br>installation instructions** | [secRMM Azure Sentinel Administrator Guide](https://www.squadratechnologies.com/StaticContent/ProductDownload/secRMM/9.9.0.0/secRMMAzureSentinelAdministratorGuide.pdf) |
| **Supported by** | [Squadra Technologies](https://www.squadratechnologies.com/Contact.aspx) |
|


## Squid Proxy (Preview)

| Data ingestion method: | [Log Analytics agent - custom logs](connect-custom-logs.md) |
| --- | --- |
| **Log Analytics table(s)** | SquidProxy_CL |
| **Kusto function alias:** | SquidProxy |
| **Kusto function URL** | https://aka.ms/sentinel-squidproxy-parser |
| **Custom log sample file:** | access.log or cache.log |
| **Vendor documentation/<br>installation instructions** |  |
| **Supported by** | Microsoft |
|

## Symantec Integrated Cyber Defense Exchange (ICDx)

| Data ingestion method: | [REST-API](connect-rest-api-template.md) |
| --- | --- |
| **Log Analytics table(s)** | SymantecICDx_CL |
| **Vendor documentation/<br>installation instructions** | [Configuring Microsoft Azure Sentinel (Log Analytics) Forwarders](https://techdocs.broadcom.com/us/en/symantec-security-software/integrated-cyber-defense/integrated-cyber-defense-exchange/1-4-3/Forwarders/configuring-forwarders-v131944722-d2707e17438.html) |
| **Supported by** | [Broadcom Symantec](https://support.broadcom.com/security) |
|


## Symantec ProxySG (Preview)

| Data ingestion method: | [Syslog](connect-syslog.md) |
| --- | --- |
| **Log Analytics table(s)** | Syslog |
| **Kusto function alias:** | SymantecProxySG |
| **Kusto function URL:** | https://aka.ms/sentinelgithubparserssymantecproxysg |
| **Vendor documentation/<br>installation instructions** | [Sending Access Logs to a Syslog server](https://knowledge.broadcom.com/external/article/166529/sending-access-logs-to-a-syslog-server.html) |
| **Supported by** | Microsoft |
|


## Symantec VIP (Preview)

| Data ingestion method: | [Syslog](connect-syslog.md) |
| --- | --- |
| **Log Analytics table(s)** | Syslog |
| **Kusto function alias:** | SymantecVIP |
| **Kusto function URL:** | https://aka.ms/sentinelgithubparserssymantecvip |
| **Vendor documentation/<br>installation instructions** | [Configuring syslog](https://help.symantec.com/cs/VIP_EG_INSTALL_CONFIG/VIP/v134652108_v128483142/Configuring-syslog?locale=EN_US) |
| **Supported by** | Microsoft |
|


## Thycotic Secret Server (Preview)

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog |
| **Vendor documentation/<br>installation instructions** | [Secure Syslog/CEF Logging](https://thy.center/ss/link/syslog) |
| **Supported by** | [Thycotic](https://thycotic.force.com/support/s/) |
|

## Trend Micro Deep Security

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog, with a Kusto function parser |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog |
| **Kusto function alias:** | TrendMicroDeepSecurity |
| **Kusto function URL** | https://aka.ms/TrendMicroDeepSecurityFunction |
| **Vendor documentation/<br>installation instructions** | [Forward Deep Security events to a Syslog or SIEM server](https://aka.ms/Sentinel-trendMicro-connectorInstructions) |
| **Supported by** | [Trend Micro](https://success.trendmicro.com/technical-support) |
|

## Trend Micro TippingPoint (Preview)

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog, with a Kusto function parser |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog |
| **Kusto function alias:** | TrendMicroTippingPoint |
| **Kusto function URL** | https://aka.ms/sentinel-trendmicrotippingpoint-function |
| **Vendor documentation/<br>installation instructions** | Send Syslog messages in ArcSight CEF Format v4.2 format. |
| **Supported by** | [Trend Micro](https://success.trendmicro.com/technical-support) |
|

## Trend Micro Vision One (XDR) (Preview)

| Data ingestion method: | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| --- | --- |
| **Log Analytics table(s)** | TrendMicro_XDR_CL |
| **Azure Function App code** |  |
| **API credentials** | <li>API Token |
| **Vendor documentation/<br>installation instructions** | <li>[Trend Micro Vision One API](https://automation.trendmicro.com/xdr/home)<li>[Obtaining API Keys for Third-Party Access](https://docs.trendmicro.com/en-us/enterprise/trend-micro-xdr-help/ObtainingAPIKeys) |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) |
| **Application settings** |  |
| **Supported by** | [Trend Micro](https://success.trendmicro.com/technical-support) |
|

## VMWare Carbon Black Endpoint Standard (Preview)

| Data ingestion method: | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| --- | --- |
| **Log Analytics table(s)** | CarbonBlackEvents_CL<br>CarbonBlackAuditLogs_CL<br>CarbonBlackNotifications_CL |
| **Azure Function App code** | https://aka.ms/sentinelcarbonblackazurefunctioncode |
| **API credentials** | **API access level** (for *Audit* and *Event* logs):<li>API ID<li>API Key<br>**SIEM access level** (for *Notification* events):<li>SIEM API ID<li>SIEM API Key |
| **Vendor documentation/<br>installation instructions** | <li>[Carbon Black API Documentation](https://developer.carbonblack.com/reference/carbon-black-cloud/cb-defense/latest/rest-api/)<li>[Creating an API Key](https://developer.carbonblack.com/reference/carbon-black-cloud/authentication/#creating-an-api-key) |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPS) |
| **Application settings** | <li>apiId<li>apiKey<li>WorkspaceID<li>WorkspaceKey<li>uri (by region; [see list of options](https://community.carbonblack.com/t5/Knowledge-Base/PSC-What-URLs-are-used-to-access-the-APIs/ta-p/67346). Follows schema: `https://<API URL>.conferdeploy.net`.)<li>timeInterval (Set to 5)<li>SIEMapiId (if ingesting *Notification* events)<li>SIEMapiKey (if ingesting *Notification* events)<li>logAnalyticsUri (optional) |
| **Supported by** | Microsoft |
|

## VMware ESXi (Preview)

| Data ingestion method: | [Syslog](connect-syslog.md) |
| --- | --- |
| **Log Analytics table(s)** | Syslog |
| **Kusto function alias:** | VMwareESXi |
| **Kusto function URL:** | https://aka.ms/sentinel-vmwareesxi-parser |
| **Vendor documentation/<br>installation instructions** | [Enabling syslog on ESXi 3.5 and 4.x](https://kb.vmware.com/s/article/1016621)<br>[Configure Syslog on ESXi Hosts](https://docs.vmware.com/en/VMware-vSphere/5.5/com.vmware.vsphere.monitoring.doc/GUID-9F67DB52-F469-451F-B6C8-DAE8D95976E7.html) |
| **Supported by** | Microsoft |
|

## WatchGuard Firebox (Preview)

| Data ingestion method: | [Syslog](connect-syslog.md) |
| --- | --- |
| **Log Analytics table(s)** | Syslog |
| **Kusto function alias:** | WatchGuardFirebox |
| **Kusto function URL:** | https://aka.ms/sentinel-watchguardfirebox-parser |
| **Vendor documentation/<br>installation instructions** | [Microsoft Azure Sentinel Integration Guide](https://www.watchguard.com/help/docs/help-center/en-US/Content/Integration-Guides/General/Microsoft%20Azure%20Sentinel.html) |
| **Supported by** | [WatchGuard Technologies](https://www.watchguard.com/wgrd-support/overview) |
|

## WireX Network Forensics Platform (Preview)

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog |
| **Vendor documentation/<br>installation instructions** | Contact [WireX support](https://wirexsystems.com/contact-us/) in order to configure your NFP solution to send Syslog messages in CEF format. |
| **Supported by** | [WireX Systems](mailto:support@wirexsystems.com) |
| 


## Windows firewall

| Data ingestion method: | Azure service |
| --- | --- |
| **Log Analytics table(s)** |  |
| **Supported by** | Microsoft |
|

## Windows security events

| Data ingestion method: | Azure service |
| --- | --- |
| **Log Analytics table(s)** |  |
| **Supported by** | Microsoft |
|

## Workplace from Facebook (Preview)

| Data ingestion method: | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| --- | --- |
| **Log Analytics table(s)** | Workplace_Facebook_CL |
| **Azure Function App code** | https://aka.ms/sentinel-WorkplaceFacebook-functionapp |
| **API credentials** | <li>WorkplaceAppSecret<li>WorkplaceVerifyToken |
| **Vendor documentation/<br>installation instructions** | <li>[Configure Webhooks](https://developers.facebook.com/docs/workplace/reference/webhooks)<li>[Configure permissions](https://developers.facebook.com/docs/workplace/reference/permissions) |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPY) |
| **Kusto function alias** | Workplace_Facebook |
| **Kusto function URL/<br>Parser config instructions** | https://aka.ms/sentinel-WorkplaceFacebook-parser |
| **Application settings** | <li>WorkplaceAppSecret<li>WorkplaceVerifyToken<li>WorkspaceID<li>WorkspaceKey<li>logAnalyticsUri (optional) |
| **Supported by** | Microsoft |
|

### Extra configuration steps for this connector

#### Before deployment

**Configure Webhooks:**

1. Log in to the Workplace with Admin user credentials.
1. In the Admin panel, click **Integrations**.
1. In the **All integrations** view, click **Create custom integration**.
1. Enter the name and description and click **Create**.
1. In the **Integration details** panel, show the **App secret** and copy it.
1. In the **Integration permissions** panel, set all read permissions. Refer to [permission page](https://developers.facebook.com/docs/workplace/reference/permissions) for details.

#### After deployment

**Add Callback URL to Webhook configuration:**

1. Open your Function App's page, go to the **Functions** list, click **Get Function URL** and copy it.
1. Go back to **Workplace from Facebook**. In the **Configure webhooks** panel, on each Tab set the **Callback URL** as the Function URL you copied in the last step, and the **Verify token** as the same value you received during automatic deployment, or entered during manual deployment.
1. Click Save.

## Zimperium Mobile Thread Defense (Preview)

Zimperium Mobile Threat Defense data connector connects the Zimperium threat log to Azure Sentinel to view dashboards, create custom alerts, and improve investigation. This connector gives you more insight into your organization's mobile threat landscape and enhances your security operation capabilities. For more instructions, see the .

For more information about connecting to Azure Sentinel, see [Connect Zimperium to Azure Sentinel](connect-zimperium-mtd.md).

| Data ingestion method: | [REST-API](connect-rest-api-template.md) |
| --- | --- |
| **Log Analytics table(s)** | ZimperiumThreatLog_CL<br>ZimperiumMitigationLog_CL |
| **Vendor documentation/<br>installation instructions** | [Zimperium customer support portal](https://support.zimperium.com/) (login required) |
| **Supported by** | [Zimperium](https://www.zimperium.com/support) |
|

### Configure and connect Zimperium MTD

1. In zConsole, click **Manage** on the navigation bar.
1. Click the **Integrations** tab.
1. Click the **Threat Reporting** button and then the **Add Integrations** button.
1. Create the Integration:
    1. From the available integrations, select **Microsoft Azure Sentinel**.
    1. Enter your *workspace ID* and *primary key*, click **Next**.
    1. Fill in a name for your Azure Sentinel integration.
    1. Select a **Filter Level** for the threat data you wish to push to Azure Sentinel.
    1. Click **Finish**.

## Zoom Reports (Preview)

| Data ingestion method: | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| --- | --- |
| **Log Analytics table(s)** | Zoom_CL |
| **Azure Function App code** | https://aka.ms/sentinel-ZoomAPI-functionapp |
| **API credentials** | <li>ZoomApiKey<li>ZoomApiSecret |
| **Vendor documentation/<br>installation instructions** | <li>[Get credentials using JWT With Zoom](https://marketplace.zoom.us/docs/guides/auth/jwt) |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPY) |
| **Kusto function alias** | Zoom |
| **Kusto function URL/<br>Parser config instructions** | https://aka.ms/sentinel-ZoomAPI-parser |
| **Application settings** | <li>ZoomApiKey<li>ZoomApiSecret<li>WorkspaceID<li>WorkspaceKey<li>logAnalyticsUri (optional) |
| **Supported by** | Microsoft |
|

## Zscaler 

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog |
| **Vendor documentation/<br>installation instructions** | [Zscaler and Microsoft Azure Sentinel Deployment Guide](https://aka.ms/ZscalerCEFInstructions) |
| **Supported by** | [Zscaler](https://help.zscaler.com/submit-ticket-links) |
| 


## Zscaler Private Access (ZPA) (Preview)

The ZPA data connector ingests Zscaler Private Access events into Azure Sentinel. For more information, see the .

| Data ingestion method: | [Log Analytics agent - custom logs](connect-custom-logs.md) |
| --- | --- |
| **Log Analytics table(s)** | ZPA_CL |
| **Kusto function alias:** | ZPAEvent |
| **Kusto function URL** | https://aka.ms/sentinel-zscalerprivateaccess-parser |
| **Vendor documentation/<br>installation instructions** | [Zscaler Private Access documentation](https://help.zscaler.com/zpa)<br>Also, see below |
| **Supported by** | Microsoft |
|

### Configure the logs to be collected

Follow the configuration steps below to get Zscaler Private Access logs into Azure Sentinel. Refer to the [Azure Monitor Documentation](../azure-monitor/agents/data-sources-json.md) for more details on these steps. Zscaler Private Access logs are delivered via Log Streaming Service (LSS). Refer to [LSS documentation](https://help.zscaler.com/zpa/about-log-streaming-service) for detailed information.

1. Configure [Log Receivers](https://help.zscaler.com/zpa/configuring-log-receiver). While configuring a Log Receiver, choose **JSON** as **Log Template**.
1. Download config file [zpa.conf](https://aka.ms/sentinel-zscalerprivateaccess-conf).

    ```bash
    wget -v https://aka.ms/sentinel-zscalerprivateaccess-conf -O zpa.conf
    ```

1. Login to the server where you have installed the Azure Log Analytics agent.
1. Copy zpa.conf to the /etc/opt/microsoft/omsagent/`workspace_id`/conf/omsagent.d/ folder.
1. Edit zpa.conf as follows:
    1. Specify the port which you have set your Zscaler Log Receivers to forward logs to (line 4)
    1. Replace `workspace_id` with real value of your Workspace ID (lines 14,15,16,19)
1. Save changes and restart the Azure Log Analytics agent for Linux service with the following command:

    ```bash
    sudo /opt/microsoft/omsagent/bin/service_control restart
    ```
You can find the value of your workspace ID on the ZScaler Private Access connector page or on your Log Analytics workspace's agents management page.

## Next steps

For more information, see:

- [Azure Sentinel solutions catalog](sentinel-solutions-catalog.md)
- [Threat intelligence integration in Azure Sentinel](threat-intelligence-integration.md)