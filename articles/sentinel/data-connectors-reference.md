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
| **Supported by:** | [Agari](https://support.agari.com/hc/en-us/articles/360000645632-How-to-access-Agari-Support) |
|

### Extra steps for deployment of this connector

| Stage | Instruction |
| --- | --- |
| **Before deployment** | **(Optional) Enable the Security Graph API**<br><br>The Agari Function App allows you to share threat intelligence with Azure Sentinel via the Security Graph API. To use this feature, you'll need to enable the [Sentinel Threat Intelligence Platforms connector](connect-threat-intelligence.md) and also [register an application](/graph/auth-register-app-v2) in Azure Active Directory.<br>This process will give you three pieces of information for use when [deploying the Function App](connect-azure-functions-template.md): the **Graph tenant ID**, the **Graph client ID**, and the **Graph client secret** (see the *Application settings* in the table above). |
| **After deployment** | **Assign the necessary permissions to your Function App**<br><br>The Agari connector uses an environment variable to store log access timestamps. In order for the application to write to this variable, permissions must be assigned to the system assigned identity.<br><ol><li>In the Azure portal, navigate to **Function App**.<li>In the **Function App** blade, select your Function App from the list, then select **Identity** under **Settings** in the Function App's navigation menu.<li>In the **System assigned** tab, set the **Status** to **On**.<li>Select **Save**, and an **Azure role assignments** button will appear. Click it.<li>In the **Azure role assignments** screen, select **Add role assignment**. Set **Scope** to **Subscription**, select your subscription from the **Subscription** drop-down, and set **Role** to **App Configuration Data Owner**.<li> Select **Save**. |
|

## AI Analyst (AIA) by Darktrace (Preview)

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog. |
| --- | --- |
| **Log Analytics table:** | CommonSecurityLog |
| **Supported by:** | [Darktrace](https://customerportal.darktrace.com/) |
| **CEF configuration:** | Configure Darktrace to forward Syslog messages in CEF format to your Azure workspace via the Log Analytics agent.<br><ol><li>Within the Darktrace Threat Visualizer, navigate to the **System Config** page in the main menu under **Admin**.<li>From the left-hand menu, select **Modules** and choose **Azure Sentinel** from the available **Workflow Integrations**.<li>A configuration window will open. Locate **Azure Sentinel Syslog CEF** and click **New** to reveal the configuration settings, unless already exposed.<li>In the **Server configuration** field, enter the location of the log forwarder and optionally modify the communication port. Ensure that the port selected is set to 514 and is allowed by any intermediary firewalls.<li>Configure any alert thresholds, time offsets, or additional settings as required.<li>Review any additional configuration options you may wish to enable that alter the Syslog syntax.<li>Enable **Send Alerts** and save your changes.

## AI Vectra Detect (Preview)

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog. |
| --- | --- |
| **Log Analytics table:** | CommonSecurityLog |
| **Supported by:** | [Vectra](https://www.vectra.ai/support) |
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

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog, with a Kusto function parser. |
| --- | --- |
| **Log Analytics table:** | CommonSecurityLog |
| **Kusto function alias:** | AkamaiSIEMEvent |
| **Kusto function URL:** | https://aka.ms/sentinel-akamaisecurityevents-parser |
| **Links to instructions:** | [Configure SIEM integration](https://developer.akamai.com/tools/integrations/siem)<br>[Set up a CEF connector](https://developer.akamai.com/tools/integrations/siem/siem-cef-connector). |
| **Supported by:** | [Akamai](https://www.akamai.com/us/en/support/) |
|

## Alcide kAudit

| Data ingestion method: | [REST-API](connect-rest-api-template.md) |
| --- | --- |
| **Log Analytics table(s)** | alcide_kaudit_activity_1_CL<br>alcide_kaudit_detections_1_CL<br>alcide_kaudit_selections_count_1_CL<br>alcide_kaudit_selections_details_1_CL |
| **Vendor documentation/<br>installation instructions** | [Alcide kAudit installation guide](https://awesomeopensource.com/project/alcideio/kaudit?categoryPage=29#before-installing-alcide-kaudit) |
| **Supported by:** | |
|

## Alsid for Active Directory

| Data ingestion method: | [Log Analytics agent - custom logs](connect-custom-logs.md) |
| --- | --- |
| **Log Analytics table(s)** | AlsidForADLog_CL |
| **Kusto function alias:** | afad_parser |
| **Kusto function URL:** | https://aka.ms/sentinel-alsidforad-parser |
| **Vendor documentation/<br>installation instructions** | [Quickstart template](https://azure.microsoft.com/resources/templates/alsid-syslog-proxy/) |
| **Supported by:** | |
|
## Amazon Web Services - Cloudtrail

| Data ingestion method: | Built-in |
| --- | --- |
| **Log Analytics table(s)** | AWSCloudTrail |
| **Connector deployment instructions** | [Connect data sources](connect-data-sources.md) |
| **Supported by:** | Microsoft |
|

## Apache HTTP Server

| Data ingestion method: | [Log Analytics agent - custom logs](connect-custom-logs.md) |
| --- | --- |
| **Log Analytics table(s)** |  |
| **API credentials** ||
| **Vendor documentation/<br>installation instructions** |  |
| **Connector deployment instructions** | |
| **Application settings** |  |
| **Supported by:** | |
|

## Apache Tomcat

| Data ingestion method: | [Log Analytics agent - custom logs](connect-custom-logs.md) |
| --- | --- |
| **Log Analytics table(s)** |  |
| **API credentials** ||
| **Vendor documentation/<br>installation instructions** |  |
| **Connector deployment instructions** | |
| **Application settings** |  |
| **Supported by:** | |
|

## Atlassian Confluence Audit (Preview)

| Data ingestion method: | [Atlassian Confluence Audit](https://www.atlassian.com/software/confluence) |
| --- | --- |
| **Log Analytics table(s)** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** | https://aka.ms/sentinel-confluenceauditapi-functionapp |
| **API credentials** | <li>ConfluenceAccessToken<li>ConfluenceUsername<li>ConfluenceHomeSiteName |
| **Vendor documentation/<br>installation instructions** | <li>[API Documentation](https://developer.atlassian.com/cloud/confluence/rest/api-group-audit/)<li>[Requirements and instructions for obtaining credentials](https://developer.atlassian.com/cloud/confluence/rest/intro/#auth)<li>[View the audit log](https://support.atlassian.com/confluence-cloud/docs/view-the-audit-log/) |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPY) |
| **Kusto function alias** | ConfluenceAudit |
| **Kusto function URL/<br>Parser config instructions** | https://aka.ms/sentinel-confluenceauditapi-parser |
| **Application settings** | <li>ConfluenceUsername<li>ConfluenceAccessToken<li>ConfluenceHomeSiteName<li>WorkspaceID<li>WorkspaceKey<li>logAnalyticsUri (optional) |
| **Supported by:** | Microsoft |
|

## Atlassian Jira Audit (Preview)

| Data ingestion method: | Atlassian Jira Audit |
| --- | --- |
| **Log Analytics table(s)** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** | https://aka.ms/sentinel-jiraauditapi-functionapp |
| **API credentials** | <li>JiraAccessToken<li>JiraUsername<li>JiraHomeSiteName |
| **Vendor documentation/<br>installation instructions** | <li>[API Documentation - Audit records](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-audit-records/)<li>[Requirements and instructions for obtaining credentials](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/#authentication) |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPY) |
| **Kusto function alias** | JiraAudit |
| **Kusto function URL/<br>Parser config instructions** | https://aka.ms/sentinel-jiraauditapi-parser |
| **Application settings** | <li>JiraUsername<li>JiraAccessToken<li>JiraHomeSiteName<li>WorkspaceID<li>WorkspaceKey<li>logAnalyticsUri (optional) |
| **Supported by:** | Microsoft |
|

## Aruba ClearPass (Preview)

The Aruba ClearPass connector connects Aruba ClearPass Audit, Session, System, and Insight logs to Azure Sentinel. For more information on configuring the Aruba ClearPass solution to forward syslog, see [Adding a Syslog Export Filter](https://www.arubanetworks.com/techdocs/ClearPass/6.7/PolicyManager/Content/CPPM_UserGuide/Admin/syslogExportFilters_add_syslog_filter_general.htm) .

For more information about connecting to Azure Sentinel, see [Connect Aruba ClearPass to Azure Sentinel](connect-aruba-clearpass.md).

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog. |
| --- | --- |
| **Log Analytics table:** | CommonSecurityLog |
| **Kusto function alias:** | ArubaClearPass

**Kusto function URL:** https://aka.ms/sentinel-arubaclearpass-parser

**Links to instructions:** Follow Aruba's instructions to [configure ClearPass](https://www.arubanetworks.com/techdocs/ClearPass/6.7/PolicyManager/Content/CPPM_UserGuide/Admin/syslogExportFilters_add_syslog_filter_general.htm).

**Supported by:** Microsoft


## Azure Active Directory

| Data ingestion method: | Azure Active Directory|
| --- | --- |
| **Log Analytics table(s)** | Built-in |
| **Azure Function App code** | |
| **API credentials** |  |
| **Connector deployment instructions** | [Connect data sources](connect-data-sources.md) |
| **Application settings** | |
| **Supported by:** | Microsoft |
|

## Azure Active Directory Identity Protection

| Data ingestion method: | Azure Active Directory Identity Protection, including audit logs and sign-in logs|
| --- | --- |
| **Log Analytics table(s)** | Built-in |
| **Azure Function App code** | |
| **API credentials** |  |
| **Connector deployment instructions** | [Connect data sources](connect-data-sources.md) |
| **Application settings** | |
| **Supported by:** | Microsoft |
|

## Azure Activity

| Data ingestion method: | Azure Activity|
| --- | --- |
| **Log Analytics table(s)** | Built-in |
| **Azure Function App code** | |
| **API credentials** |  |
| **Connector deployment instructions** | [Connect data sources](connect-data-sources.md) |
| **Application settings** | |
| **Supported by:** | Microsoft |
|

## Azure DDoS Protection

| Data ingestion method: | Azure DDoS Protection|
| --- | --- |
| **Log Analytics table(s)** | Built-in |
| **Azure Function App code** | |
| **API credentials** |  |
| **Connector deployment instructions** | [Connect data sources](connect-data-sources.md) |
| **Application settings** | |
| **Supported by:** | Microsoft |
|

## Azure Defender

| Data ingestion method: |Azure Defender alerts from Azure Security Center|
| --- | --- |
| **Log Analytics table(s)** | Built-in |
| **Azure Function App code** | |
| **API credentials** |  |
| **Connector deployment instructions** | [Connect data sources](connect-data-sources.md) |
| **Application settings** | |
| **Supported by:** | Microsoft |
|

## Azure Defender for IoT

| Data ingestion method: | Azure Defender for IoT (formerly Azure Security Center for IoT)|
| --- | --- |
| **Log Analytics table(s)** | Built-in |
| **Azure Function App code** | |
| **API credentials** |  |
| **Connector deployment instructions** | [Connect data sources](connect-data-sources.md) |
| **Application settings** | |
| **Supported by:** | Microsoft |
|

## Azure Firewall

| Data ingestion method: | Azure Firewall|
| --- | --- |
| **Log Analytics table(s)** | Built-in |
| **Azure Function App code** | |
| **API credentials** |  |
| **Connector deployment instructions** | [Connect data sources](connect-data-sources.md) |
| **Application settings** | |
| **Supported by:** | Microsoft |
|

## Azure Information Protection

| Data ingestion method: | Amazon Web Services - Cloudtrail|
| --- | --- |
| **Log Analytics table(s)** | Built-in |
| **Azure Function App code** | |
| **API credentials** |  |
| **Connector deployment instructions** | [Connect data sources](connect-data-sources.md) |
| **Application settings** | |
| **Supported by:** | Microsoft |
|

For more information, see [How to modify the reports and create custom queries](/azure/information-protection/reports-aip#how-to-modify-the-reports-and-create-custom-queries).

## Azure Key Vault]

| Data ingestion method: |Azure Key Vault]|
| --- | --- |
| **Log Analytics table(s)** | Built-in |
| **Azure Function App code** | |
| **API credentials** |  |
| **Connector deployment instructions** | [Connect data sources](connect-data-sources.md) |
| **Application settings** | |
| **Supported by:** | Microsoft |
|

## Azure Kubernetes Service (AKS)

| Data ingestion method: | Azure Kubernetes Service (AKS)|
| --- | --- |
| **Log Analytics table(s)** | Built-in |
| **Azure Function App code** | |
| **API credentials** |  |
| **Connector deployment instructions** | [Connect data sources](connect-data-sources.md) |
| **Application settings** | |
| **Supported by:** | Microsoft |
|

## Azure Storage Account

| Data ingestion method: | Azure Storage Account|
| --- | --- |
| **Log Analytics table(s)** | Built-in |
| **Azure Function App code** | |
| **API credentials** |  |
| **Connector deployment instructions** | [Connect data sources](connect-data-sources.md) |
| **Application settings** | |
| **Supported by:** | Microsoft |
|

## Azure Web Application Firewall (WAF)

| Data ingestion method: | Azure Web Application Firewall (WAF), (formerly Microsoft WAF)|
| --- | --- |
| **Log Analytics table(s)** | Built-in |
| **Azure Function App code** | |
| **API credentials** |  |
| **Connector deployment instructions** | [Connect data sources](connect-data-sources.md) |
| **Application settings** | |
| **Supported by:** | Microsoft |
|

## Barracuda WAF

| Data ingestion method: |  |
| --- | --- |
| **Log Analytics table(s)** |  |
| **API credentials** ||
| **Vendor documentation/<br>installation instructions** |  |
| **Connector deployment instructions** | |
| **Application settings** |  |
| **Supported by:** | |
|

## Barracuda CloudGen Firewall

| Data ingestion method: | |
| --- | --- |
| **Log Analytics table(s)** |  |
| **API credentials** ||
| **Vendor documentation/<br>installation instructions** |  |
| **Connector deployment instructions** | |
| **Application settings** |  |
| **Supported by:** | |
|

## BETTER Mobile Threat Defense

| Data ingestion method: |  |
| --- | --- |
| **Log Analytics table(s)** |  |
| **API credentials** ||
| **Vendor documentation/<br>installation instructions** |  |
| **Connector deployment instructions** | |
| **Application settings** |  |
| **Supported by:** | |
|

## Beyond Security beSECURE


| Data ingestion method: |  |
| --- | --- |
| **Log Analytics table(s)** |  |
| **API credentials** ||
| **Vendor documentation/<br>installation instructions** |  |
| **Connector deployment instructions** | |
| **Application settings** |  |
| **Supported by:** | |
|


## BlackBerry CylancePROTECT (Preview)

The Blackberry CylancePROTECT connector connects CylancePROTECT audit, threat, application control, device, memory protection, and threat classification logs to Azure Sentinel. To configure CylancePROTECT to forward syslog, see the [Cylance Syslog Guide](https://docs.blackberry.com/content/dam/docs-blackberry-com/release-pdfs/en/cylance-products/syslog-guides/Cylance%20Syslog%20Guide%20v2.0%20rev12.pdf).

**Data ingestion method:** [Syslog](connect-syslog.md). The connector also uses a log parser based on a Kusto function.

**Supported by:** Microsoft

## Broadcom Symantec Data Loss Prevention (DLP) (Preview)

The Broadcom Symantec DLP connector connects Symantec DLP Policy/Response Rule Triggers to Azure Sentinel. With this connector, you can create custom dashboards and alerts to aid investigation. To configure Symantec DLP to forward syslog, see [Configuring the Log to a Syslog Server action](https://help.symantec.com/cs/DLP15.7/DLP/v27591174_v133697641/Configuring-the-Log-to-a-Syslog-Server-action?locale=EN_US).

For more information about connecting to Azure Sentinel, see [Connect Broadcom Symantec DLP to Azure Sentinel](connect-broadcom-symantec-dlp.md).

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog. |
| --- | --- |
| **Log Analytics table:** | CommonSecurityLog |
| **Kusto function alias:** |
| **Kusto function URL** | 
| **Supported by:** Microsoft

## Check Point

The Check Point firewalls connector connects your Check Point logs to Azure Sentinel. To configure your Check Point product to export logs, see [Log Exporter - Check Point Log Export](https://supportcenter.checkpoint.com/supportcenter/portal?eventSubmit_doGoviewsolutiondetails=&solutionid=sk122323).

For more information about connecting to Azure Sentinel, see [Connect Check Point to Azure Sentinel](connect-checkpoint.md).

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog. |
| --- | --- |
| **Log Analytics table:** | CommonSecurityLog |
| 

**Supported by:** [Check Point](https://nam06.safelinks.protection.outlook.com/?url=https%3A%2F%2Fwww.checkpoint.com%2Fsupport-services%2Fcontact-support%2F&data=04%7C01%7CNayef.Yassin%40microsoft.com%7C9965f53402ed44988a6c08d913fc51df%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C637562796697084967%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C1000&sdata=Av1vTkeYoEXzRKO%2FotZLtMMexIQI%2FIKjJGnPQsbhqmE%3D&reserved=0)

## Cisco ASA

The Cisco ASA firewall connector connects your Cisco ASA logs to Azure Sentinel. To set up the connection, follow the instructions in the [Cisco ASA Series CLI Configuration Guide](https://www.cisco.com/c/en/us/support/docs/security/pix-500-series-security-appliances/63884-config-asa-00.html).

For more information about connecting to Azure Sentinel, see [Connect Cisco ASA to Azure Sentinel](connect-cisco.md).

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog. |
| --- | --- |
| **Log Analytics table:** | CommonSecurityLog |
| 

**Supported by:** Microsoft

## Cisco Firepower eStreamer (Preview)

The Cisco Firepower eStreamer connector connects your eStreamer logs to Azure Sentinel. Cisco Firepower eStreamer is a client-server API designed for the Cisco Firepower NGFW solution. For more information, see the [eStreamer eNcore for Sentinel Operations Guide](https://www.cisco.com/c/en/us/td/docs/security/firepower/670/api/eStreamer_enCore/eStreamereNcoreSentinelOperationsGuide_409.html).

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog. |
| --- | --- |
| **Log Analytics table:** | CommonSecurityLog |
| 

**Supported by:** [Cisco](https://www.cisco.com/c/en/us/support/index.html)

## Cisco Meraki


| Data ingestion method: |  |
| --- | --- |
| **Log Analytics table(s)** |  |
| **API credentials** ||
| **Vendor documentation/<br>installation instructions** |  |
| **Connector deployment instructions** | |
| **Application settings** |  |
| **Supported by:** | |
|
## Cisco Umbrella (Preview)

| Data ingestion method: | Cisco Umbrella |
| --- | --- |
| **Log Analytics table(s)** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** | https://aka.ms/sentinel-CiscoUmbrellaConn-functionapp |
| **API credentials** | <li>AWS Access Key Id<li>AWS Secret Access Key<li>AWS S3 Bucket Name |
| **Vendor documentation/<br>installation instructions** | <li>[Logging to Amazon S3](https://docs.umbrella.com/deployment-umbrella/docs/log-management#section-logging-to-amazon-s-3) |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPY) |
| **Kusto function alias** | Cisco_Umbrella |
| **Kusto function URL/<br>Parser config instructions** | https://aka.ms/sentinel-ciscoumbrella-function |
| **Application settings** | <li>WorkspaceID<li>WorkspaceKey<li>S3Bucket<li>AWSAccessKeyId<li>AWSSecretAccessKey<li>logAnalyticsUri (optional) |
| **Supported by:** | Microsoft |
|

## Cisco Unified Computing System

| Data ingestion method: |  |
| --- | --- |
| **Log Analytics table(s)** |  |
| **API credentials** ||
| **Vendor documentation/<br>installation instructions** |  |
| **Connector deployment instructions** | |
| **Application settings** |  |
| **Supported by:** | |
|

## Citrix Analytics (Security)


| Data ingestion method: |  |
| --- | --- |
| **Log Analytics table(s)** |  |
| **API credentials** ||
| **Vendor documentation/<br>installation instructions** |  |
| **Connector deployment instructions** | |
| **Application settings** |  |
| **Supported by:** | |
|

## Cognni (Preview)

The Cognni data connector offers a quick and simple integration to Azure Sentinel. You can use Cognni to autonomously map previously unclassified important information and detect related incidents. Cognni helps you recognize risks to your important information, understand the severity of the incidents, and investigate the details you need to remediate, fast enough to make a difference.

**Data ingestion method:** [REST API](connect-data-sources.md#rest-api-integration-on-the-provider-side).

**Supported by:** [Cognni](https://cognni.ai/contact-support/)

## CyberArk Enterprise Password Vault (EPV) Events (Preview)

The CyberArk data connector ingests CyberArk EPV XML Syslog messages for actions taken against the vault. EPV converts the XML messages into CEF standard format through the *Sentinel.xsl* translator, and sends them to a Syslog staging server you choose (syslog-ng, rsyslog). The Log Analytics agent on the Syslog staging server imports the messages into Log Analytics. For more information, see [Security Information and Event Management (SIEM) Applications](https://docs.cyberark.com/Product-Doc/OnlineHelp/PAS/Latest/en/Content/PASIMP/DV-Integrating-with-SIEM-Applications.htm) in the CyberArk documentation.

For more information about connecting to Azure Sentinel, see [Connect CyberArk Enterprise Password Vault to Azure Sentinel](connect-cyberark.md).

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog. |
| --- | --- |
| **Log Analytics table:** | CommonSecurityLog |
| 

**Supported by:** [CyberArk](https://www.cyberark.com/customer-support/)

## Cyberpion Security Logs (Preview)

The Cyberpion Security Logs data connector ingests logs from the Cyberpion system directly into Azure Sentinel. For more information, see [Azure Sentinel](https://www.cyberpion.com/resource-center/integrations/azure-sentinel/) in the Cyberpion documentation.

**Data ingestion method:** [REST API](connect-data-sources.md#rest-api-integration-on-the-provider-side).

**Supported by:** Cyberpion

## Domain name server

| Data ingestion method: | Domain name server|
| --- | --- |
| **Log Analytics table(s)** | Built-in |
| **Azure Function App code** | |
| **API credentials** |  |
| **Connector deployment instructions** | [Connect data sources](connect-data-sources.md) |
| **Application settings** | |
| **Supported by:** | Microsoft |
|

## Dynamics 365

| Data ingestion method: | Dynamics 365|
| --- | --- |
| **Log Analytics table(s)** | Built-in |
| **Azure Function App code** | |
| **API credentials** |  |
| **Connector deployment instructions** | [Connect data sources](connect-data-sources.md) |
| **Application settings** | |
| **Supported by:** | Microsoft |
|

## ESET Enterprise Inspector (Preview)

| Data ingestion method: | ESET Enterprise Inspector |
| --- | --- |
| **Log Analytics table(s)** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** |  |
| **API credentials** | <li>EEI Username<li>EEI Password<li>Base URL |
| **Vendor documentation/<br>installation instructions** | <li>[ESET Enterprise Inspector REST API documentation](https://help.eset.com/eei/1.5/en-US/api.html) |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) |
| **Application settings** |  |
| **Supported by:** | [ESET](https://support.eset.com/en) |
|


## ESET Security Management Center (SMC) (Preview)

The ESET SMC data connector ingests ESET SMC threat events, audit logs, firewall events, and website filters into Azure Sentinel. For more information, see [Syslog server](https://help.eset.com/esmc_admin/70/en-US/admin_server_settings_syslog.html) in the ESET SMC documentation.

**Data ingestion method:** [Log Analytics Agent custom logs](connect-data-sources.md#custom-logs).

**Supported by:** [ESET](https://support.eset.com/en)

## Exabeam Advanced Analytics (Preview)

The Exabeam Advanced Analytics data connector ingests Exabeam Advanced Analytics events like System Health, Notable Sessions/Anomalies, Advanced Analytics, and Job Status into Azure Sentinel. To send logs from Exabeam Advanced Analytics via Syslog, follow the instructions at [Configure Advanced Analytics system activity notifications](https://docs.exabeam.com/en/advanced-analytics/i54/advanced-analytics-administration-guide/113254-configure-advanced-analytics.html#UUID-7ce5ff9d-56aa-93f0-65de-c5255b682a08).

**Data ingestion method:** [Syslog](connect-syslog.md). The connector also uses a log parser based on a Kusto function.

**Supported by:** Microsoft

## ExtraHop Reveal(x)

The ExtraHop Reveal(x) data connector connects your Reveal(x) system to Azure Sentinel. Azure Sentinel integration requires the ExtraHop Detection SIEM Connector. To install the SIEM Connector on your Reveal(x) system, follow the instructions at [ExtraHop Detection SIEM Connector](https://aka.ms/asi-syslog-extrahop-forwarding).

For more information about connecting to Azure Sentinel, see [Connect ExtraHop Reveal(x) to Azure Sentinel](connect-extrahop.md).

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog. |
| --- | --- |
| **Log Analytics table:** | CommonSecurityLog |
| 

**Supported by:** [ExtraHop](https://www.extrahop.com/support/)

## F5 BIG-IP


| Data ingestion method: |  |
| --- | --- |
| **Log Analytics table(s)** |  |
| **API credentials** ||
| **Vendor documentation/<br>installation instructions** |  |
| **Connector deployment instructions** | |
| **Application settings** |  |
| **Supported by:** | |
|
## F5 Networks

The F5 firewall connector connects your F5 Application Security Events to Azure Sentinel. To set up remote logging, see [Configuring Application Security Event Logging](https://aka.ms/asi-syslog-f5-forwarding).

For more information about connecting to Azure Sentinel, see [Connect F5 ASM to Azure Sentinel](connect-f5.md).

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog. |
| --- | --- |
| **Log Analytics table:** | CommonSecurityLog |
| 

**Supported by:** Microsoft

## Forcepoint Cloud Access Security Broker (CASB) (Preview)

The Forcepoint CASB data connector automatically exports CASB logs and events into Azure Sentinel in real time. For more information, see [Forcepoint CASB and Azure Sentinel](https://forcepoint.github.io/docs/casb_and_azure_sentinel/).

For more information about connecting to Azure Sentinel, see [Connect Forcepoint products to Azure Sentinel](connect-forcepoint-casb-ngfw.md).

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog. |
| --- | --- |
| **Log Analytics table:** | CommonSecurityLog |
| 

**Supported by:** [Forcepoint](https://support.forcepoint.com/)

## Forcepoint Cloud Security Gateway (CSG) (Preview)

The Forcepoint CSG data connector automatically exports CSG logs into Azure Sentinel. CSG is a converged cloud security service that provides visibility, control, and threat protection for users and data, wherever they are. For more information, see [Forcepoint Cloud Security Gateway and Azure Sentinel](https://forcepoint.github.io/docs/csg_and_sentinel/).

For more information about connecting to Azure Sentinel, see [Connect Forcepoint products to Azure Sentinel](connect-forcepoint-casb-ngfw.md).

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog. |
| --- | --- |
| **Log Analytics table:** | CommonSecurityLog |
| 

**Supported by:** [Forcepoint](https://support.forcepoint.com/)

## Forcepoint Data Loss Prevention (DLP) (Preview)

The Forcepoint DLP data connector automatically exports DLP incident data from Forcepoint DLP into Azure Sentinel in real time. For more information, see [Forcepoint Data Loss Prevention and Azure Sentinel](https://forcepoint.github.io/docs/dlp_and_azure_sentinel/).

For more information about connecting to Azure Sentinel, see [Connect Forcepoint DLP to Azure Sentinel](connect-forcepoint-dlp.md).

**Data ingestion method:** [REST API](connect-data-sources.md#rest-api-integration-on-the-provider-side).

**Supported by:** [Forcepoint](https://support.forcepoint.com/)

## Forcepoint Next Generation Firewall (NGFW) (Preview)

The Forcepoint NGFW data connector automatically exports user-defined Forcepoint NGFW logs into Azure Sentinel in real time. For more information, see [Forcepoint Next-Gen Firewall and Azure Sentinel](https://forcepoint.github.io/docs/ngfw_and_azure_sentinel/).

For more information about connecting to Azure Sentinel, see [Connect Forcepoint products to Azure Sentinel](connect-forcepoint-casb-ngfw.md).

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog. |
| --- | --- |
| **Log Analytics table:** | CommonSecurityLog |
| 

**Supported by:** [Forcepoint](https://support.forcepoint.com/)

## ForgeRock Common Audit (CAUD) for CEF (Preview)

The ForgeRock Identity Platform provides a single common auditing framework so you can track log data holistically. You can extract and aggregate log data across the entire platform with CAUD event handlers and unique IDs. The CAUD for CEF connector is open and extensible, and you can use its audit logging and reporting capabilities for integration with Azure Sentinel. For more information, see [ForgeRock Common Audit (CAUD) for Azure Sentinel](https://github.com/javaservlets/SentinelAuditEventHandler).

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog. |
| --- | --- |
| **Log Analytics table:** | CommonSecurityLog |
| 

**Supported by:** [ForgeRock](https://www.forgerock.com/support)

## Fortinet

The Fortinet firewall connector connects Fortinet logs to Azure Sentinel. For more information, go to the [Fortinet Document Library](https://aka.ms/asi-syslog-fortinet-fortinetdocumentlibrary), choose your version, and use the *Handbook* and *Log Message Reference* PDFs.

For more information about connecting to Azure Sentinel, see [Connect Fortinet to Azure Sentinel](connect-fortinet.md).

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog. |
| --- | --- |
| **Log Analytics table:** | CommonSecurityLog |
| 

**Supported by:** [Fortinet](https://support.fortinet.com/)


## Google Workspace (G-Suite) (Preview)

| Data ingestion method: | Google Workspace (G-Suite) |
| --- | --- |
| **Log Analytics table(s)** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** | https://aka.ms/sentinel-GWorkspaceReportsAPI-functionapp |
| **API credentials** | <li>GooglePickleString |
| **Vendor documentation/<br>installation instructions** | <li>[API Documentation](https://developers.google.com/admin-sdk/reports/v1/reference/activities)<li>Get credentials at [Perform Google Workspace Domain-Wide Delegation of Authority](https://developers.google.com/admin-sdk/reports/v1/guides/delegation)<li>[Convert token.pickle file to pickle string](https://aka.ms/sentinel-GWorkspaceReportsAPI-functioncode) |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPY) |
| **Kusto function alias** | GWorkspaceActivityReports |
| **Kusto function URL/<br>Parser config instructions** | https://aka.ms/sentinel-GWorkspaceReportsAPI-parser |
| **Application settings** | <li>GooglePickleString<li>WorkspaceID<li>workspaceKey<li>logAnalyticsUri (optional) |
| **Supported by:** | Microsoft |
|


## Illusive Attack Management System (AMS) (Preview)

The Illusive AMS connector shares Illusive attack surface analysis data and incident logs to Azure Sentinel. You can view this information in dedicated dashboards. The ASM Workbook offers insight into your organization's attack surface risk, and the ADS Workbook tracks unauthorized lateral movement in your organization's network. For more information, see the [Illusive Networks Admin Guide](https://support.illusivenetworks.com/hc/en-us/sections/360002292119-Documentation-by-Version).

For more information about connecting to Azure Sentinel, see [Connect Illusive Networks AMS to Azure Sentinel](connect-illusive-attack-management-system.md).

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog. |
| --- | --- |
| **Log Analytics table:** | CommonSecurityLog |
| 

**Supported by:** [Illusive Networks](https://www.illusivenetworks.com/technical-support/)

## Imperva WAF Gateway (Preview)

The Imperva connector connects your Imperva WAF Gateway alerts to Azure Sentinel. For more information, see [Steps for Enabling Imperva WAF Gateway Alert Logging to Azure Sentinel](https://community.imperva.com/blogs/craig-burlingame1/2020/11/13/steps-for-enabling-imperva-waf-gateway-alert).

For more information about connecting to Azure Sentinel, see [Connect Imperva WAF Gateway to Azure Sentinel](connect-imperva-waf-gateway.md).

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog. |
| --- | --- |
| **Log Analytics table:** | CommonSecurityLog |
| 

**Supported by:** [Imperva](https://www.imperva.com/support/technical-support/)

## Infoblox Network Identity Operating System (NIOS) (Preview)

The Infoblox NIOS connector connects your Infoblox NIOS logs to Azure Sentinel. To enable syslog forwarding of Infoblox NIOS logs, see the [NIOS SNMP and Syslog Deployment Guide](https://www.infoblox.com/wp-content/uploads/infoblox-deployment-guide-slog-and-snmp-configuration-for-nios.pdf).

For more information about connecting to Azure Sentinel, see [Connect Infoblox NIOS to Azure Sentinel](connect-infoblox.md).

**Data ingestion method:** [Syslog](connect-syslog.md). The connector also uses a log parser based on a Kusto function.

**Supported by:** Microsoft


## Juniper SRX (Preview)

The Juniper SRX connector connects Juniper SRX logs to Azure Sentinel. To forward traffic logs, see [Configure Traffic Logging (Security Policy Logs) for SRX Branch Devices](https://kb.juniper.net/InfoCenter/index?page=content&id=KB16509&actp=METADATA). To forward system logs, see [Configure System Logging](https://kb.juniper.net/InfoCenter/index?page=content&id=kb16502).

For more information about connecting to Azure Sentinel, see [Connect Juniper SRX to Azure Sentinel](connect-juniper-srx.md).

**Data ingestion method:** [Syslog](connect-syslog.md). The connector also uses a log parser based on a Kusto function.

**Supported by:** [Juniper Networks](https://support.juniper.net/support/)

## Microsoft 365 Defender

| Data ingestion method: | Microsoft 365 Defender, including Microsoft 365 Defender incidents and raw data from Microsoft 365 Defender for Endpoint|
| --- | --- |
| **Log Analytics table(s)** | Built-in |
| **Azure Function App code** | |
| **API credentials** |  |
| **Connector deployment instructions** | [Connect data sources](connect-data-sources.md) |
| **Application settings** | |
| **Supported by:** | Microsoft |
|

## Microsoft Cloud App Security (MCAS)

| Data ingestion method: | Microsoft Cloud App Security (MCAS)|
| --- | --- |
| **Log Analytics table(s)** | Built-in |
| **Azure Function App code** | |
| **API credentials** |  |
| **Connector deployment instructions** | [Connect data sources](connect-data-sources.md) |
| **Application settings** | |
| **Supported by:** | Microsoft |
|

## Microsoft Defender for Endpoint

| Data ingestion method: | Microsoft Defender for Endpoint (formerly Microsoft Defender Advanced Threat Protection)|
| --- | --- |
| **Log Analytics table(s)** | Built-in |
| **Azure Function App code** | |
| **API credentials** |  |
| **Connector deployment instructions** | [Connect data sources](connect-data-sources.md) |
| **Application settings** | |
| **Supported by:** | Microsoft |
|

## Microsoft Defender for Identity

| Data ingestion method: | Microsoft Defender for Identity (formerly Azure Advanced Threat Protection)|
| --- | --- |
| **Log Analytics table(s)** | Built-in |
| **Azure Function App code** | |
| **API credentials** |  |
| **Connector deployment instructions** | [Connect data sources](connect-data-sources.md) |
| **Application settings** | |
| **Supported by:** | Microsoft |
|

## Microsoft Defender for Office 365

| Data ingestion method: | Microsoft Defender for Office 365 (formerly Office 365 Advanced Threat Protection)|
| --- | --- |
| **Log Analytics table(s)** | Built-in |
| **Azure Function App code** | |
| **API credentials** |  |
| **Connector deployment instructions** | [Connect data sources](connect-data-sources.md) |
| **Application settings** | |
| **Supported by:** | Microsoft |
|


## Microsoft Office 365

| Data ingestion method: |Office 365, including Microsoft Teams|
| --- | --- |
| **Log Analytics table(s)** | Built-in |
| **Azure Function App code** | |
| **API credentials** |  |
| **Connector deployment instructions** | [Connect data sources](connect-data-sources.md) |
| **Application settings** | |
| **Supported by:** | Microsoft |
|

## Morphisec UTPP (Preview)

The Morphisec Data Connector for Azure Sentinel integrates vital insights from your security products. You can expand your analytical capabilities with search and correlation, threat intelligence, and customized alerts. The Morphisec data connector provides visibility into advanced threats like sophisticated fileless attacks, in-memory exploits, and zero days. With a single, cross-product view, you can make real-time, data-backed decisions to protect your most important assets.

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog. |
| --- | --- |
| **Log Analytics table:** | CommonSecurityLog |
| **Kusto function alias:** |
| **Kusto function URL** | 
| **Supported by:** Morphisec


## Netskope (Preview)

| Data ingestion method: | Netskope |
| --- | --- |
| **Log Analytics table(s)** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** | https://aka.ms/sentinel-netskope-functioncode |
| **API credentials** | <li>Netskope API Token |
| **Vendor documentation/<br>installation instructions** | <li>[Netskope Cloud Security Platform](https://www.netskope.com/platform)<li>[Netskope API Documentation](https://innovatechcloud.goskope.com/docs/Netskope_Help/en/rest-api-v1-overview.html)<li>[Obtain an API Token](https://innovatechcloud.goskope.com/docs/Netskope_Help/en/rest-api-v2-overview.html) |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPS) |
| **Kusto function alias** | Netskope |
| **Kusto function URL/<br>Parser config instructions** | https://aka.ms/sentinel-netskope-parser |
| **Application settings** | <li>apikey<li>workspaceID<li>workspaceKey<li>uri (depends on region, follows schema: `https://<Tenant Name>.goskope.com`) <li>timeInterval (set to 5)<li>logTypes<li>logAnalyticsUri (optional) |
| **Supported by:** | Microsoft |
|

## NGINX HTTP Server (Preview)

The NGINX HTTP Server data connector ingests NGINX HTTP Server events into Azure Sentinel. For more information, see [Module ngx_http_log_module](https://nginx.org/en/docs/http/ngx_http_log_module.html).

| Data ingestion method: | [Log Analytics agent - custom logs](connect-custom-logs.md) |
| --- | --- |
| **Log Analytics table(s)** | NGINX_CL |
| **Kusto function alias:** | NGINXHTTPServer |
| **Kusto function URL** | https://aka.ms/sentinel-NGINXHTTP-parser |
| **Vendor documentation/<br>installation instructions** |  |
| **Supported by:** | Microsoft |
|

## NXLog Basic Security Module (BSM) macOS (Preview)

The NXLog BSM macOS data connector uses the Sun BSM Auditing API to capture audit events directly from the kernel on the macOS platform. This data connector can efficiently export macOS audit events to Azure Sentinel in real time. For more information, see the [NXLog Azure Sentinel User Guide](https://nxlog.co/documentation/nxlog-user-guide/sentinel.html).

**Data ingestion method:** [REST API](connect-data-sources.md#rest-api-integration-on-the-provider-side).

**Supported by:** [NXLog](https://nxlog.co/community-forum)

## NXLog DNS Logs (Preview)

The NXLog DNS Logs data connector uses Event Tracing for Windows (ETW) to collect both audit and analytical DNS server events. For maximum efficiency, the NXLog im_etw module reads event tracing data directly, without having to capture the event trace into an *.etl* file. This REST API connector can forward DNS server events to Azure Sentinel in real time. For more information, see the [NXLog Azure Sentinel User Guide](https://nxlog.co/documentation/nxlog-user-guide/sentinel.html).

For more information about connecting to Azure Sentinel, see [Connect NXLog (Windows) DNS Logs to Azure Sentinel](connect-nxlog-dns.md).

**Data ingestion method:** [REST API](connect-data-sources.md#rest-api-integration-on-the-provider-side).

**Supported by:** [NXLog](https://nxlog.co/community-forum)

## NXLog LinuxAudit (Preview)

The NXLog LinuxAudit data connector supports custom audit rules and collects logs without using AuditD or other user software. The connector resolves IP addresses and group/user IDs to their respective names, making Linux audit logs more intelligible. This REST API connector can export Linux security events to Azure Sentinel in real time. For more information, see the [NXLog Azure Sentinel User Guide](https://nxlog.co/documentation/nxlog-user-guide/sentinel.html).

For more information about connecting to Azure Sentinel, see [Connect NXLog LinuxAudit to Azure Sentinel](connect-nxlog-linuxaudit.md).

**Data ingestion method:** [REST API](connect-data-sources.md#rest-api-integration-on-the-provider-side).

**Supported by:** [NXLog](https://nxlog.co/community-forum)

## Okta Single Sign-On (Preview)

| Data ingestion method: | Okta Single Sign-On |
| --- | --- |
| **Log Analytics table(s)** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** | https://aka.ms/sentineloktaazurefunctioncodev2 |
| **API credentials** | <li>API Token |
| **Vendor documentation/<br>installation instructions** | <li>[Okta System Log API Documentation](https://developer.okta.com/docs/reference/api/system-log/)<li>[Create an API token](https://developer.okta.com/docs/guides/create-an-api-token/create-the-token/)<li>[Connect Okta SSO to Azure Sentinel](connect-okta-single-sign-on.md) |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPS) |
| **Application settings** | <li>apiToken<li>workspaceID<li>workspaceKey<li>uri (follows schema `https://<OktaDomain>/api/v1/logs?since=`. [Identify your domain namespace](https://developer.okta.com/docs/reference/api-overview/#url-namespace).) <li>logAnalyticsUri (optional) |
| **Supported by:** | Microsoft |
|




## Onapsis Platform (Preview)

The Onapsis data connector exports the alarms triggered in the Onapsis Platform into Azure Sentinel in real time.

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog. |
| --- | --- |
| **Log Analytics table:** | CommonSecurityLog |
| 

**Supported by:** [Onapsis](https://onapsis.force.com/s/login/)

## One Identity Safeguard (Preview)

The One Identity Safeguard CEF Sentinel data connector enhances the standard CEF connector with Safeguard for Privileged Sessions-specific dashboards. This connector uses device events for visualization, alerts, investigations, and more. For more information, see the [One Identity Safeguard for Privileged Sessions Administration Guide](https://aka.ms/sentinel-cef-oneidentity-forwarding).

For more information about connecting to Azure Sentinel, see [Connect One Identity Safeguard to Azure Sentinel](connect-one-identity.md).

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog. |
| --- | --- |
| **Log Analytics table:** | CommonSecurityLog |
| 

**Supported by:** [One Identity](https://support.oneidentity.com/)

## Oracle WebLogic Server (Preview)

The OracleWebLogicServer data connector ingests OracleWebLogicServer events into Azure Sentinel. For more information, see the [Oracle WebLogic Server documentation](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/index.html).

| Data ingestion method: | [Log Analytics agent - custom logs](connect-custom-logs.md) |
| --- | --- |
| **Log Analytics table(s)** | OracleWebLogicServer_CL |
| **Kusto function alias:** | OracleWebLogicServerEvent |
| **Kusto function URL** | https://aka.ms/sentinel-OracleWebLogicServer-parser |
| **Vendor documentation/<br>installation instructions** |  |
| **Supported by:** | Microsoft |
|

## Orca Security (Preview)

The Orca Security Alerts connector automatically exports Alerts logs to Azure Sentinel. For more information, see [Azure Sentinel integration](https://orcasecurity.zendesk.com/hc/en-us/articles/360043941992-Azure-Sentinel-configuration).

For more information about connecting to Azure Sentinel, see [Connect Orca Security to Azure Sentinel](connect-orca-security-alerts.md).

**Data ingestion method:** [REST API](connect-data-sources.md#rest-api-integration-on-the-provider-side).

**Supported by:** [Orca Security](http://support.orca.security/)
## OSSEC (Preview)

The OSSEC data connector ingests OSSEC events into Azure Sentinel. For more information, see the [OSSEC documentation](https://www.ossec.net/docs/). To configure OSSEC sending alerts via Syslog, follow the instructions at [Sending alerts via syslog](https://www.ossec.net/docs/docs/manual/output/syslog-output.html).

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog. |
| --- | --- |
| **Log Analytics table:** | CommonSecurityLog |
| 

**Supported by:** Microsoft

## Palo Alto Networks

The Palo Alto Networks firewall data connector connects Palo Alto Networks logs to Azure Sentinel. For more information, see [Common Event Format (CEF) Configuration Guides](https://aka.ms/asi-syslog-paloalto-forwarding) and [Configure Syslog Monitoring](https://aka.ms/asi-syslog-paloalto-configure).

The Palo Alto Networks data connector ingests logs into Azure Sentinel [CEF](connect-common-event-format.md) over Syslog.

For more information about connecting to Azure Sentinel, see [Connect Palo Alto Networks to Azure Sentinel](connect-paloalto.md).

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog. |
| --- | --- |
| **Log Analytics table:** | CommonSecurityLog |
| 

**Supported by:** [Palo Alto Networks](https://www.paloaltonetworks.com/company/contact-support)

## Perimeter 81 Activity Logs (Preview)

The Perimeter 81 Activity Logs data connector connects Perimeter 81 activity logs to Azure Sentinel. For more information, see the Perimeter 81 [Azure Sentinel](https://support.perimeter81.com/docs/360012680780) documentation.

For more information about connecting to Azure Sentinel, see [Connect Perimeter 81 logs to Azure Sentinel](connect-perimeter-81-logs.md).

**Data ingestion method:** [REST API](connect-data-sources.md#rest-api-integration-on-the-provider-side).

**Supported by:** [Perimeter 81](https://support.perimeter81.com/)


## Proofpoint On Demand (POD) Email Security (Preview)

| Data ingestion method: | Proofpoint On Demand (POD) Email Security |
| --- | --- |
| **Log Analytics table(s)** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** | https://aka.ms/sentinel-proofpointpod-functionapp |
| **API credentials** | <li>ProofpointClusterID<li>ProofpointToken |
| **Vendor documentation/<br>installation instructions** | <li>[Sign in to the Proofpoint Community](https://proofpointcommunities.force.com/community/s/article/How-to-request-a-Community-account-and-gain-full-customer-access?utm_source=login&utm_medium=recommended&utm_campaign=public)<li>[Proofpoint API documentation and instructions](https://proofpointcommunities.force.com/community/s/article/Proofpoint-on-Demand-Pod-Log-API) |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPY) |
| **Kusto function alias** | ProofpointPOD |
| **Kusto function URL/<br>Parser config instructions** | https://aka.ms/sentinel-proofpointpod-parser |
| **Application settings** | <li>ProofpointClusterID<li>ProofpointToken<li>WorkspaceID<li>WorkspaceKey<li>logAnalyticsUri (optional) |
| **Supported by:** | Microsoft |
|

## Proofpoint Targeted Attack Protection (TAP) (Preview)

| Data ingestion method: | Proofpoint Targeted Attack Protection (TAP) |
| --- | --- |
| **Log Analytics table(s)** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** | https://aka.ms/sentinelproofpointtapazurefunctioncode |
| **API credentials** | <li>API Username<li>API Password |
| **Vendor documentation/<br>installation instructions** | <li>[Proofpoint SIEM API Documentation](https://help.proofpoint.com/Threat_Insight_Dashboard/API_Documentation/SIEM_API) |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPS) |
| **Application settings** | <li>apiUsername<li>apiUsername<li>uri (set to `https://tap-api-v2.proofpoint.com/v2/siem/all?format=json&sinceSeconds=300`)<li>WorkspaceID<li>WorkspaceKey<li>logAnalyticsUri (optional) |
| **Supported by:** | Microsoft |
|

## Pulse Connect Secure (Preview)

The Pulse Connect Secure connector connects your Pulse Connect Secure logs to Azure Sentinel. To enable syslog streaming of Pulse Connect Secure logs, follow the instructions at [Configuring Syslog](https://docs.pulsesecure.net/WebHelp/Content/PCS/PCS_AdminGuide_8.2/Configuring%20Syslog.htm).

For more information about connecting to Azure Sentinel, see [Connect Pulse Connect Secure to Azure Sentinel](connect-pulse-connect-secure.md).

**Data ingestion method:** [Syslog](connect-syslog.md). The connector also uses a log parser based on a Kusto function.

**Supported by:** Microsoft


## Qualys VM KnowledgeBase (KB) (Preview)

| Data ingestion method: | Qualys VM KnowledgeBase (KB) |
| --- | --- |
| **Log Analytics table(s)** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** | https://aka.ms/sentinel-qualyskb-functioncode |
| **API credentials** | <li>API Username<li>API Password |
| **Vendor documentation/<br>installation instructions** | <li>[QualysVM API User Guide](https://www.qualys.com/docs/qualys-api-vmpc-user-guide.pdf) |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPS) |
| **Kusto function alias** | QualysKB |
| **Kusto function URL/<br>Parser config instructions** | https://aka.ms/sentinel-qualyskb-parser |
| **Application settings** | <li>apiUsername<li>apiUsername<li>uri (by region; see [API Server list](https://www.qualys.com/docs/qualys-api-vmpc-user-guide.pdf#G4.735348). Follows schema `https://<API Server>/api/2.0`.<li>WorkspaceID<li>WorkspaceKey<li>filterParameters (add to end of URI, delimited by `&`. No spaces.)<li>logAnalyticsUri (optional) |
| **Supported by:** | Microsoft |
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

| Data ingestion method: | Qualys Vulnerability Management (VM) |
| --- | --- |
| **Log Analytics table(s)** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** | https://aka.ms/sentinelqualysvmazurefunctioncode |
| **API credentials** | <li>API Username<li>API Password |
| **Vendor documentation/<br>installation instructions** | <li>[QualysVM API User Guide](https://www.qualys.com/docs/qualys-api-vmpc-user-guide.pdf) |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPS) |
| **Application settings** | <li>apiUsername<li>apiUsername<li>uri (by region; see [API Server list](https://www.qualys.com/docs/qualys-api-vmpc-user-guide.pdf#G4.735348). Follows schema `https://<API Server>/api/2.0/fo/asset/host/vm/detection/?action=list&vm_processed_after=`.<li>WorkspaceID<li>WorkspaceKey<li>filterParameters (add to end of URI, delimited by `&`. No spaces.)<li>tineInterval (set to 5)<li>logAnalyticsUri (optional) |
| **Supported by:** | Microsoft |
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

## Salesforce Service Cloud (Preview)

| Data ingestion method: | Salesforce Service Cloud |
| --- | --- |
| **Log Analytics table(s)** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** | https://aka.ms/sentinel-SalesforceServiceCloud-functionapp |
| **API credentials** | <li>Salesforce API Username<li>Salesforce API Password<li>Salesforce Security Token<li>Salesforce Consumer Key<li>Salesforce Consumer Secret |
| **Vendor documentation/<br>installation instructions** | <li>[Salesforce REST API Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/quickstart.htm) |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPY) |
| **Kusto function alias** | SalesforceServiceCloud |
| **Kusto function URL/<br>Parser config instructions** | https://aka.ms/sentinel-SalesforceServiceCloud-parser |
| **Application settings** | <li>SalesforceUser<li>SalesforcePass<li>SalesforceSecurityToken<li>SalesforceConsumerKey<li>SalesforceConsumerSecret<li>WorkspaceID<li>WorkspaceKey<li>logAnalyticsUri (optional) |
| **Supported by:** | Microsoft |
|


## Security events (Windows)

| Data ingestion method: | Amazon Web Services - Cloudtrail|
| --- | --- |
| **Log Analytics table(s)** | Built-in |
| **Azure Function App code** | |
| **API credentials** |  |
| **Connector deployment instructions** | [Connect data sources](connect-data-sources.md) |
| **Application settings** | |
| **Supported by:** | Microsoft |
|

For more information, see [Insecure protocols workbook setup](./get-visibility.md#use-built-in-workbooks).

## SentinelOne (Preview)

| Data ingestion method: | SentinelOne |
| --- | --- |
| **Log Analytics table(s)** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** | https://aka.ms/sentinel-SentinelOneAPI-functionapp |
| **API credentials** | <li>SentinelOneAPIToken<li>SentinelOneUrl (`https://<SOneInstanceDomain>.sentinelone.net`) |
| **Vendor documentation/<br>installation instructions** | <li>https://`<SOneInstanceDomain>`.sentinelone.net/api-doc/overview<li>See instructions below |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPY) |
| **Kusto function alias** | SentinelOne |
| **Kusto function URL/<br>Parser config instructions** | https://aka.ms/sentinel-SentinelOneAPI-parser |
| **Application settings** | <li>SentinelOneAPIToken<li>SentinelOneUrl<li>WorkspaceID<li>WorkspaceKey<li>logAnalyticsUri (optional) |
| **Supported by:** | Microsoft |
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

The SonicWall Firewall data connector connects firewall logs to Azure Sentinel. For more information, see [Log > Syslog](http://help.sonicwall.com/help/sw/eng/7020/26/2/3/content/Log_Syslog.120.2.htm).

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog. |
| --- | --- |
| **Log Analytics table:** | CommonSecurityLog |
| 

**Supported by:** [SonicWall](https://www.sonicwall.com/support/)

## Sophos Cloud Optix (Preview)

The Sophos Cloud Optix data connector connects your Sophos Cloud Optix logs to Azure Sentinel. For more information, in your Cloud Optix settings, see the Azure Sentinel [integrations page](https://optix.sophos.com/#/integrations/sentinel).

For more information about connecting to Azure Sentinel, see [Connect Sophos Cloud Optix to Azure Sentinel](connect-sophos-cloud-optix.md).

**Data ingestion method:** [REST API](connect-data-sources.md#rest-api-integration-on-the-provider-side).

**Supported by:** [Sophos](https://secure2.sophos.com/en-us/support.aspx)

## Sophos XG Firewall (Preview)

The Sophos XG Firewall connects Sophos XG Firewall logs to Azure Sentinel. For more information, see [Add a syslog server](https://docs.sophos.com/nsg/sophos-firewall/18.0/Help/en-us/webhelp/onlinehelp/nsg/tasks/SyslogServerAdd.html).

For more information about connecting to Azure Sentinel, see [Connect Sophos XG to Azure Sentinel](connect-sophos-xg-firewall.md).

**Data ingestion method:** [Syslog](connect-syslog.md). The connector also uses a log parser based on a Kusto function.

**Supported by:** Microsoft

## Squadra Technologies secRMM

The Squadra Technologies secRMM data connector pushes USB removable storage security event data into Azure Sentinel. For more information, see the [secRMM Azure Sentinel Administrator Guide](https://www.squadratechnologies.com/StaticContent/ProductDownload/secRMM/9.9.0.0/secRMMAzureSentinelAdministratorGuide.pdf).

For more information about connecting to Azure Sentinel, see [Connect Squadra Technologies secRMM to Azure Sentinel](connect-squadra-secrmm.md).

**Data ingestion method:** [REST API](connect-data-sources.md#rest-api-integration-on-the-provider-side).

**Supported by:** [Squadra Technologies](https://www.squadratechnologies.com/Contact.aspx)

## Squid Proxy (Preview)

| Data ingestion method: | [Log Analytics agent - custom logs](connect-custom-logs.md) |
| --- | --- |
| **Log Analytics table(s)** | SquidProxy_CL |
| **Kusto function alias:** | SquidProxy |
| **Kusto function URL** | https://aka.ms/sentinel-squidproxy-parser |
| **Vendor documentation/<br>installation instructions** |  |
| **Supported by:** | Microsoft |
|

## Symantec Integrated Cyber Defense Exchange (ICDx)

The Symantec ICDx data connector connects Symantec security solutions logs to Azure Sentinel. For more information, see [Connect your Symantec ICDx appliance](connect-symantec.md).

For more information about connecting to Azure Sentinel, see [Connect Symantec ICDx to Azure Sentinel](connect-symantec.md).

**Data ingestion method:** [REST API](connect-data-sources.md#rest-api-integration-on-the-provider-side).

**Supported by:** [Broadcom Symantec](https://support.broadcom.com/security)

## Symantec ProxySG (Preview)

The Symantec ProxySG data connector connects Symantec ProxySG logs to Azure Sentinel. For more information, see [Sending Access Logs to a Syslog server](https://knowledge.broadcom.com/external/article/166529/sending-access-logs-to-a-syslog-server.html).

Symantec's ProxySG data connector ingests logs into Azure Sentinel over [Syslog](connect-syslog.md). The connector also uses a log parser based on a Kusto function.

For more information about connecting to Azure Sentinel, see [Connect Symantec Proxy SG to Azure Sentinel](connect-symantec-proxy-sg.md).

**Data ingestion method:** [Syslog](connect-syslog.md). The connector also uses a log parser based on a Kusto function.

**Supported by:** Microsoft

## Symantec VIP (Preview)

The Symantec VIP data connector connects Symantec VIP logs to Azure Sentinel. For more information, see [Configuring syslog](https://help.symantec.com/cs/VIP_EG_INSTALL_CONFIG/VIP/v134652108_v128483142/Configuring-syslog?locale=EN_US).

Symantec's VIP data connector ingests logs into Azure Sentinel over [Syslog](connect-syslog.md). The connector also uses a log parser based on a Kusto function.

For more information about connecting to Azure Sentinel, see [Connect Symantec VIP to Azure Sentinel](connect-symantec-vip.md).

**Data ingestion method:** [Syslog](connect-syslog.md). The connector also uses a log parser based on a Kusto function.

**Supported by:** Microsoft

## Thycotic Secret Server (Preview)

The Thycotic Secret Server data connector connects Secret Server logs to Azure Sentinel. For more information, see [Secure Syslog/CEF Logging](https://docs.thycotic.com/ss/10.9.0/events-and-alerts/secure-syslog-cef).

The Thycotic data connector ingests logs into Azure Sentinel [CEF](connect-common-event-format.md) over Syslog.

For more information about connecting to Azure Sentinel, see [Connect Thycotic Secret Server to Azure Sentinel](connect-thycotic-secret-server.md).

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog. |
| --- | --- |
| **Log Analytics table:** | CommonSecurityLog |
| **Supported by:** | [Thycotic](https://thycotic.force.com/support/s/) |
|

## Trend Micro Deep Security

The Trend Micro Deep Security data connector connects Deep Security logs to Azure Sentinel. For more information, see [Forward Deep Security events to a Syslog or SIEM server](https://help.deepsecurity.trendmicro.com/12_0/on-premise/siem-syslog-forwarding-secure.html?redirected=true&Highlight=Configure%20Syslog#Protection_modules_DSM).

The Trend Micro Deep Security data connector ingests logs into Azure Sentinel [CEF](connect-common-event-format.md) over Syslog. The connector also uses a log parser based on a Kusto function.

For more information about connecting to Azure Sentinel, see [Connect Trend Micro Deep Security to Azure Sentinel](connect-trend-micro.md).

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog. |
| --- | --- |
| **Log Analytics table:** | CommonSecurityLog |
| **Kusto function alias:** |  |
| **Kusto function URL** |  |
| **Supported by:** | [Trend Micro](https://success.trendmicro.com/technical-support) |
|

## Trend Micro TippingPoint (Preview)

The Trend Micro TippingPoint data connector connects TippingPoint SMS IPS events to Azure Sentinel.

For more information about connecting to Azure Sentinel, see [Connect Trend Micro TippingPoint to Azure Sentinel](connect-trend-micro-tippingpoint.md).

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog. |
| --- | --- |
| **Log Analytics table:** | CommonSecurityLog |
| **Kusto function alias:** |  |
| **Kusto function URL** |  |
| **Supported by:** | [Trend Micro](https://success.trendmicro.com/technical-support) |
|

## Trend Micro XDR (Preview)

| Data ingestion method: | Trend Micro XDR |
| --- | --- |
| **Log Analytics table(s)** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** |  |
| **API credentials** | <li>API Token |
| **Vendor documentation/<br>installation instructions** | <li>https://automation.trendmicro.com/xdr/home<li>[Obtaining API Keys for Third-Party Access](https://docs.trendmicro.com/en-us/enterprise/trend-micro-xdr-help/ObtainingAPIKeys) |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) |
| **Application settings** |  |
| **Supported by:** | [Trend Micro](https://success.trendmicro.com/technical-support) |
|

## VMWare Carbon Black Endpoint Standard (Preview)

| Data ingestion method: | VMware Carbon Black Endpoint Standard |
| --- | --- |
| **Log Analytics table(s)** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** | https://aka.ms/sentinelcarbonblackazurefunctioncode |
| **API credentials** | **API access level** (for *Audit* and *Event* logs):<li>API ID<li>API Key<br>**SIEM access level** (for *Notification* events):<li>SIEM API ID<li>SIEM API Key |
| **Vendor documentation/<br>installation instructions** | <li>[Carbon Black API Documentation](https://developer.carbonblack.com/reference/carbon-black-cloud/cb-defense/latest/rest-api/)<li>[Creating an API Key](https://developer.carbonblack.com/reference/carbon-black-cloud/authentication/#creating-an-api-key) |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPS) |
| **Application settings** | <li>apiId<li>apiKey<li>WorkspaceID<li>WorkspaceKey<li>uri (by region; [see list of options](https://community.carbonblack.com/t5/Knowledge-Base/PSC-What-URLs-are-used-to-access-the-APIs/ta-p/67346). Follows schema: `https://<API URL>.conferdeploy.net`.)<li>timeInterval (Set to 5)<li>SIEMapiId (if ingesting *Notification* events)<li>SIEMapiKey (if ingesting *Notification* events)<li>logAnalyticsUri (optional) |
| **Supported by:** | Microsoft |
|


## VMware ESXi (Preview)

The VMware ESXi data connector connects VMware ESXi logs to Azure Sentinel. To configure the VMware ESXi connector to forward syslog, see [Enabling syslog on ESXi 3.5 and 4.x](https://kb.vmware.com/s/article/1016621) and [Configure Syslog on ESXi Hosts](https://docs.vmware.com/en/VMware-vSphere/5.5/com.vmware.vsphere.monitoring.doc/GUID-9F67DB52-F469-451F-B6C8-DAE8D95976E7.html).

For more information about connecting to Azure Sentinel, see [Connect VMware ESXi to Azure Sentinel](connect-vmware-esxi.md).

**Data ingestion method:** [Syslog](connect-syslog.md). The connector also uses a log parser based on a Kusto function.

**Supported by:** Microsoft

## WatchGuard Firebox (Preview)

The WatchGuard Firebox data connector ingests firewall logs into Azure Sentinel. For more information, see [Microsoft Azure Sentinel Integration Guide](https://www.watchguard.com/help/docs/help-center/en-US/Content/Integration-Guides/General/Microsoft%20Azure%20Sentinel.html).

**Data ingestion method:** [Syslog](connect-syslog.md). The connector also uses a log parser based on a Kusto function.

**Supported by:** [WatchGuard Technologies](https://www.watchguard.com/wgrd-support/overview)

## WireX Network Forensics Platform (Preview)

The WireX Systems data connector enables security professionals to integrate with Azure Sentinel to enrich forensics investigations. The connector not only encompasses the contextual content offered by WireX but can analyze data from other sources. You can create custom dashboards and workflows to give the most complete picture during a forensic investigation. For more information and configuration support, contact [WireX support](https://wirexsystems.com/contact-us/).

For more information about connecting to Azure Sentinel, see [Connect WireX Network Forensics Platform to Azure Sentinel](connect-wirex-systems.md).

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog. |
| --- | --- |
| **Log Analytics table:** | CommonSecurityLog |
| 

**Supported by:** WireX

## Windows firewall

| Data ingestion method: | Amazon Web Services - Cloudtrail|
| --- | --- |
| **Log Analytics table(s)** | Built-in |
| **Azure Function App code** | |
| **API credentials** |  |
| **Connector deployment instructions** | [Connect data sources](connect-data-sources.md) |
| **Application settings** | |
| **Supported by:** | Microsoft |
|



## Workplace from Facebook (Preview)

| Data ingestion method: | Workplace from Facebook |
| --- | --- |
| **Log Analytics table(s)** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** | https://aka.ms/sentinel-WorkplaceFacebook-functionapp |
| **API credentials** | <li>WorkplaceAppSecret<li>WorkplaceVerifyToken |
| **Vendor documentation/<br>installation instructions** | <li>[Configure Webhooks](https://developers.facebook.com/docs/workplace/reference/webhooks)<li>[Configure permissions](https://developers.facebook.com/docs/workplace/reference/permissions) |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPY) |
| **Kusto function alias** | Workplace_Facebook |
| **Kusto function URL/<br>Parser config instructions** | https://aka.ms/sentinel-WorkplaceFacebook-parser |
| **Application settings** | <li>WorkplaceAppSecret<li>WorkplaceVerifyToken<li>WorkspaceID<li>WorkspaceKey<li>logAnalyticsUri (optional) |
| **Supported by:** | Microsoft |
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

Zimperium Mobile Threat Defense data connector connects the Zimperium threat log to Azure Sentinel to view dashboards, create custom alerts, and improve investigation. This connector gives you more insight into your organization's mobile threat landscape and enhances your security operation capabilities. For more instructions, see the [Zimperium customer support portal](https://support.zimperium.com/).

For more information about connecting to Azure Sentinel, see [Connect Zimperium to Azure Sentinel](connect-zimperium-mtd.md).

**Data ingestion method:** [REST API](connect-data-sources.md#rest-api-integration-on-the-provider-side).

**Supported by:** [Zimperium](https://www.zimperium.com/support)

## Zoom Reports (Preview)

| Data ingestion method: | Zoom Reports |
| --- | --- |
| **Log Analytics table(s)** | [Azure Functions and the REST API](connect-azure-functions-template.md) |
| **Azure Function App code** | https://aka.ms/sentinel-ZoomAPI-functionapp |
| **API credentials** | <li>ZoomApiKey<li>ZoomApiSecret |
| **Vendor documentation/<br>installation instructions** | <li>[Get credentials using JWT With Zoom](https://marketplace.zoom.us/docs/guides/auth/jwt) |
| **Connector deployment instructions** | [One-click](connect-azure-functions-template.md?tabs=ARM) \| [Manual](connect-azure-functions-template.md?tabs=MPY) |
| **Kusto function alias** | Zoom |
| **Kusto function URL/<br>Parser config instructions** | https://aka.ms/sentinel-ZoomAPI-parser |
| **Application settings** | <li>ZoomApiKey<li>ZoomApiSecret<li>WorkspaceID<li>WorkspaceKey<li>logAnalyticsUri (optional) |
| **Supported by:** | Microsoft |
|

## Zscaler 

The Zscaler data connector connects Zscaler Internet Access (ZIA) logs to Azure Sentinel. Using Zscaler on Azure Sentinel gives you insights into your organization's internet usage and enhances your security operations capabilities.​ For more information, see the [Zscaler and Microsoft Azure Sentinel Deployment Guide](https://aka.ms/ZscalerCEFInstructions).

For more information about connecting to Azure Sentinel, see [Connect Zscaler to Azure Sentinel](connect-zscaler.md).

| Data ingestion method: | [Common Event Format (CEF)](connect-common-event-format.md) over Syslog. |
| --- | --- |
| **Log Analytics table:** | CommonSecurityLog |
| 

**Supported by:** [Zscaler](https://help.zscaler.com/submit-ticket-links)

## Zscaler Private Access (ZPA) (Preview)

The ZPA data connector ingests Zscaler Private Access events into Azure Sentinel. For more information, see the .

| Data ingestion method: | [Log Analytics agent - custom logs](connect-custom-logs.md) |
| --- | --- |
| **Log Analytics table(s)** | ZPA_CL |
| **Kusto function alias:** | ZPAEvent |
| **Kusto function URL** | https://aka.ms/sentinel-zscalerprivateaccess-parser |
| **Vendor documentation/<br>installation instructions** | [Zscaler Private Access documentation](https://help.zscaler.com/zpa) |
| **Supported by:** | Microsoft |
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