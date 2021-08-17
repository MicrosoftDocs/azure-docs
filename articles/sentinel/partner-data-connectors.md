---
title: Partner data connectors for Azure Sentinel | Microsoft Docs
description: Learn about all the partner data connectors for Azure Sentinel.
services: sentinel
documentationcenter: na
author: batamig
ms.service: azure-sentinel
ms.topic: conceptual
ms.date: 06/17/2021
ms.author: bagol

---

# Azure Sentinel partner data connectors

This article lists the data connectors Azure Sentinel supports for non-Microsoft, Partner organizations, in alphabetical order. If you know the connector you're looking for, scroll to or search for its name on this page, or use the links at the right or top of the article.

- To enable and configure the listed connectors, see [Connect data sources](connect-data-sources.md), and the links in the individual listings.
- For information about Microsoft-authored and service-to-service data connectors, see [Service to service integration](connect-data-sources.md#service-to-service-integration).
- For information about Azure Sentinel support models and the **Supported by** field, see [Data connector support](connect-data-sources.md#data-connector-support).

> [!IMPORTANT]
> Many of the following Azure Sentinel Partner data connectors are currently in **Preview**. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Agari Phishing Defense and Brand Protection (Preview)

The Agari Phishing Defense and Brand Protection connector connects Brand Protection and Phishing Defense solution logs to Azure Sentinel.

For more information, see the [Agari Developers Site](https://developers.agari.com/agari-platform) and [Connect Agari Phishing Defense and Brand Protection to Azure Sentinel](connect-agari-phishing-defense.md).

**Data ingestion method:** [Azure Functions and the REST API](connect-data-sources.md#rest-api-integration-using-azure-functions).

**Supported by:** [Agari](https://support.agari.com/hc/en-us/articles/360000645632-How-to-access-Agari-Support)

## AI Analyst (AIA) by Darktrace (Preview)

The Darktrace connector sends model breaches and AIA incidents to Azure Sentinel. Explore the data interactively through visualizations in the Darktrace AIA workbook, which includes overview graphs with time-brushing. You can view detailed drilldowns into specific breaches and incidents, then view the incidents in the Darktrace UI for further exploration.

AIA sends breach data to the Azure Sentinel CommonSecurityLog table in Azure Log Analytics. The CommonSecurityLog table supports easy query collation and aggregation across different partner connectors.

**Data ingestion method:** [Common Event Format (CEF)](connect-common-event-format.md) over Syslog.

**Supported by:** [Darktrace](https://customerportal.darktrace.com/)

## AI Vectra Detect (Preview)

The AI Vectra Detect data connector brings your AI Vectra Detect data into Azure Sentinel. With the AI Vectra workbook, you can start investigating network attacks directly from Sentinel. You can view critical hosts, accounts, campaigns, and detections, and monitor Vectra's system health and audit logs.

For more information about connecting to Azure Sentinel, see [Connect AI Vectra Detect to Azure Sentinel](connect-ai-vectra-detect.md).

**Data ingestion method:** [CEF](connect-common-event-format.md) over Syslog.

**Supported by:** [Vectra](https://www.vectra.ai/support)

## Akamai Security Events (Preview)

The Akamai Security Events data connector ingests [Akamai Security Events](https://www.akamai.com/us/en/products/security/) into Azure Sentinel. For more information, see [Akamai SIEM Integration for Splunk and CEF Syslog](https://developer.akamai.com/tools/integrations/siem).

For more information about connecting to Azure Sentinel, see [Connect Akamai Security Events to Azure Sentinel](connect-akamai-security-events.md).

**Data ingestion method:** [CEF](connect-common-event-format.md) over Syslog. The connector also uses a log parser based on a Kusto function.

**Supported by:** [Akamai](https://www.akamai.com/us/en/support/)

## Alcide kAudit (Preview)

Alcide kAudit connector automatically exports your Kubernetes cluster audit logs into Azure Sentinel in real time. The kAudit connector provides enhanced visibility and observability into your Kubernetes audit logs. Alcide kAudit gives you robust security and monitoring capabilities for forensics purposes.

For more information about connecting to Azure Sentinel, see [Connect Alcide kAudit to Azure Sentinel](connect-alcide-kaudit.md).

**Data ingestion method:** [Azure Functions and the REST API](connect-data-sources.md#rest-api-integration-using-azure-functions).

**Supported by:** [Alcide](https://www.alcide.io/company/contact-us/)

## Alsid for Active Directory (Preview)

The Alsid for Active Directory connector exports Alsid Indicators of Exposures, trail flow, and Indicators of Attacks logs to Azure Sentinel in real time. The connector also provides a data parser to help manipulate the logs. Workbooks provide Active Directory monitoring and data visualizations. Analytical templates help automate responses to events, exposures, and attacks.

For more information about connecting to Azure Sentinel, see [Connect Alsid for Active Directory to Azure Sentinel](connect-alsid-active-directory.md).

**Data ingestion method:** [Log Analytics Agent custom logs](connect-data-sources.md#custom-logs). The connector also uses a log parser based on a Kusto function.

**Supported by:** [Alsid](https://www.alsid.com/contact-us/)

## Amazon Web Services

The AWS data connector imports AWS CloudTrail management events into Azure Sentinel. To enable this connector, see [Connect Azure Sentinel to AWS CloudTrail](connect-aws.md).

**Data ingestion method:** [REST API](connect-data-sources.md#rest-api-integration-on-the-provider-side).

**Supported by:** Microsoft

## Apache HTTP Server (Preview)

The Apache HTTP Server data connector ingests Apache HTTP Server events into Azure Sentinel. For more information, see the [Apache Logs documentation](https://httpd.apache.org/docs/2.4/logs.html).

**Data ingestion method:** [Log Analytics Agent custom logs](connect-data-sources.md#custom-logs). The connector also uses a log parser based on a Kusto function.

**Supported by:** Microsoft

## Apache Tomcat (Preview)

The Apache Tomcat data connector ingests [Apache Tomcat](http://tomcat.apache.org/) events into Azure Sentinel. For more information, see the [Apache Tomcat documentation](http://tomcat.apache.org/tomcat-10.0-doc/logging.html).

**Data ingestion method:** [Log Analytics Agent custom logs](connect-data-sources.md#custom-logs). The connector also uses a log parser based on a Kusto function.

**Supported by:** Microsoft

## Aruba ClearPass (Preview)

The Aruba ClearPass connector connects Aruba ClearPass Audit, Session, System, and Insight logs to Azure Sentinel. For more information on configuring the Aruba ClearPass solution to forward syslog, see [Adding a Syslog Export Filter](https://www.arubanetworks.com/techdocs/ClearPass/6.7/PolicyManager/Content/CPPM_UserGuide/Admin/syslogExportFilters_add_syslog_filter_general.htm) .

For more information about connecting to Azure Sentinel, see [Connect Aruba ClearPass to Azure Sentinel](connect-aruba-clearpass.md).

**Data ingestion method:** [CEF](connect-common-event-format.md) over Syslog. The connector also uses a log parser based on a Kusto function.

**Supported by:** Microsoft

## Atlassian Confluence Audit (Preview)

The [Atlassian Confluence](https://www.atlassian.com/software/confluence) Audit data connector ingests Confluence Audit Records. The connector can get events to examine potential security risks, analyze your team's collaboration, diagnose configuration problems, and more. For more information, see [View the audit log](https://support.atlassian.com/confluence-cloud/docs/view-the-audit-log/).

**Data ingestion method:** [Azure Functions and the REST API](connect-data-sources.md#rest-api-integration-using-azure-functions).

**Supported by:** Microsoft

## Atlassian Jira Audit (Preview)

The Atlassian Jira Audit data connector ingests Jira Audit Records events into Azure Sentinel. The connector can get events to examine potential security risks, analyze your team's collaboration, diagnose configuration problems, and more. For more information, see [Audit records](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-audit-records/).

**Data ingestion method:** [Azure Functions and the REST API](connect-data-sources.md#rest-api-integration-using-azure-functions).

**Supported by:** Microsoft

## Barracuda CloudGen Firewall (CGFW)

The Barracuda CGFW connector connects your Barracuda CGFW logs to Azure Sentinel. To configure syslog streaming for Barracuda CGFW, see [How to Configure Syslog Streaming](https://aka.ms/sentinel-barracudacloudfirewall-connector).

For more information about connecting to Azure Sentinel, see [Connect Barracuda CloudGen Firewall to Azure Sentinel](connect-barracuda-cloudgen-firewall.md).

**Data ingestion method:** [Syslog](connect-syslog.md). The connector also uses a log parser based on a Kusto function.

**Supported by:** [Barracuda](https://www.barracuda.com/support)

## Barracuda Web Application Firewall (WAF)

The Barracuda WAF connector connects your Barracuda WAF logs to Azure Sentinel. For more information, see [Configure the Barracuda Web Application Firewall](https://aka.ms/asi-barracuda-connector).

For more information about connecting to Azure Sentinel, see [Connect Barracuda WAF to Azure Sentinel](connect-barracuda.md).

**Data ingestion method:** [Log Analytics Agent custom logs](connect-data-sources.md#custom-logs).

**Supported by:** [Barracuda](https://www.barracuda.com/support)

## BETTER Mobile Threat Defense (MTD) (Preview)

The BETTER MTD Connector enables enterprises to connect their Better MTD instances to Azure Sentinel. This connector provides insight into an organization's mobile devices and current mobile security posture, improving overall SecOps capabilities. For more information, see the BETTER Mobile [Azure Sentinel setup documentation](https://mtd-docs.bmobi.net/integrations/how-to-setup-azure-sentinel-integration#mtd-integration-configuration).

For more information about connecting to Azure Sentinel, see [Connect BETTER Mobile Threat Defense to Azure Sentinel](connect-better-mtd.md).

**Data ingestion method:** [REST API](connect-data-sources.md#rest-api-integration-on-the-provider-side).

**Supported by:** BETTER Mobile

## Beyond Security beSECURE (Preview)

The Beyond Security beSECURE connector connects your Beyond Security beSECURE scan events, scan results, and audit trail to Azure Sentinel. For more information, see the beSECURE [Overview](https://beyondsecurity.com/solutions/besecure.html) page.

For more information about connecting to Azure Sentinel, see [Connect Beyond Security beSECURE to Azure Sentinel](connect-besecure.md).

**Data ingestion method:** [REST API](connect-data-sources.md#rest-api-integration-on-the-provider-side).

**Supported by:** [Beyond Security](https://beyondsecurity.freshdesk.com/support/home)

## BlackBerry CylancePROTECT (Preview)

The Blackberry CylancePROTECT connector connects CylancePROTECT audit, threat, application control, device, memory protection, and threat classification logs to Azure Sentinel. To configure CylancePROTECT to forward syslog, see the [Cylance Syslog Guide](https://docs.blackberry.com/content/dam/docs-blackberry-com/release-pdfs/en/cylance-products/syslog-guides/Cylance%20Syslog%20Guide%20v2.0%20rev12.pdf).

**Data ingestion method:** [Syslog](connect-syslog.md). The connector also uses a log parser based on a Kusto function.

**Supported by:** Microsoft

## Broadcom Symantec Data Loss Prevention (DLP) (Preview)

The Broadcom Symantec DLP connector connects Symantec DLP Policy/Response Rule Triggers to Azure Sentinel. With this connector, you can create custom dashboards and alerts to aid investigation. To configure Symantec DLP to forward syslog, see [Configuring the Log to a Syslog Server action](https://help.symantec.com/cs/DLP15.7/DLP/v27591174_v133697641/Configuring-the-Log-to-a-Syslog-Server-action?locale=EN_US).

For more information about connecting to Azure Sentinel, see [Connect Broadcom Symantec DLP to Azure Sentinel](connect-broadcom-symantec-dlp.md).

**Data ingestion method:** [CEF](connect-common-event-format.md) over Syslog. The connector also uses a log parser based on a Kusto function.

**Supported by:** Microsoft

## Check Point

The Check Point firewalls connector connects your Check Point logs to Azure Sentinel. To configure your Check Point product to export logs, see [Log Exporter - Check Point Log Export](https://supportcenter.checkpoint.com/supportcenter/portal?eventSubmit_doGoviewsolutiondetails=&solutionid=sk122323).

For more information about connecting to Azure Sentinel, see [Connect Check Point to Azure Sentinel](connect-checkpoint.md).

**Data ingestion method:** [CEF](connect-common-event-format.md) over Syslog.

**Supported by:** [Check Point](https://nam06.safelinks.protection.outlook.com/?url=https%3A%2F%2Fwww.checkpoint.com%2Fsupport-services%2Fcontact-support%2F&data=04%7C01%7CNayef.Yassin%40microsoft.com%7C9965f53402ed44988a6c08d913fc51df%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C637562796697084967%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C1000&sdata=Av1vTkeYoEXzRKO%2FotZLtMMexIQI%2FIKjJGnPQsbhqmE%3D&reserved=0)

## Cisco ASA

The Cisco ASA firewall connector connects your Cisco ASA logs to Azure Sentinel. To set up the connection, follow the instructions in the [Cisco ASA Series CLI Configuration Guide](https://www.cisco.com/c/en/us/support/docs/security/pix-500-series-security-appliances/63884-config-asa-00.html).

For more information about connecting to Azure Sentinel, see [Connect Cisco ASA to Azure Sentinel](connect-cisco.md).

**Data ingestion method:** [CEF](connect-common-event-format.md) over Syslog.

**Supported by:** Microsoft

## Cisco Firepower eStreamer (Preview)

The Cisco Firepower eStreamer connector connects your eStreamer logs to Azure Sentinel. Cisco Firepower eStreamer is a client-server API designed for the Cisco Firepower NGFW solution. For more information, see the [eStreamer eNcore for Sentinel Operations Guide](https://www.cisco.com/c/en/us/td/docs/security/firepower/670/api/eStreamer_enCore/eStreamereNcoreSentinelOperationsGuide_409.html).

**Data ingestion method:** [CEF](connect-common-event-format.md) over Syslog.

**Supported by:** [Cisco](https://www.cisco.com/c/en/us/support/index.html)

## Cisco Meraki (Preview)

The Cisco Meraki connector connects Cisco Meraki (MX/MR/MS) event logs, URLs, Flows, IDS_Alerts, Security Events, and Airmarshal Events to Azure Sentinel. To configure Meraki devices to forward syslog, follow the instructions at [Meraki Device Reporting - Syslog, SNMP, and API](https://documentation.meraki.com/General_Administration/Monitoring_and_Reporting/Meraki_Device_Reporting_-_Syslog%2C_SNMP_and_API).

For more information about connecting to Azure Sentinel, see [Connect Cisco Meraki to Azure Sentinel](connect-cisco-meraki.md).

**Data ingestion method:** [Syslog](connect-syslog.md). The connector also uses a log parser based on a Kusto function.

**Supported by:** Microsoft

## Cisco Unified Computing System (UCS) (Preview)

The Cisco UCS connector connects Cisco UCS audit, event, and fault logs to Azure Sentinel. To configure the Cisco UCS to forward syslog, follow the instructions at [Steps to Configure Syslog to a Remote Syslog Server](https://www.cisco.com/c/en/us/support/docs/servers-unified-computing/ucs-manager/110265-setup-syslog-for-ucs.html#configsremotesyslog).

For more information about connecting to Azure Sentinel, see [Connect Cisco Unified Computing System (UCS) to Azure Sentinel](connect-cisco-ucs.md).

**Data ingestion method:** [Syslog](connect-syslog.md). The connector also uses a log parser based on a Kusto function.

**Supported by:** Microsoft

## Cisco Umbrella (Preview)

The Cisco Umbrella data connector ingests Cisco Umbrella events stored in Amazon S3, like DNS, proxy, and IP logs, into Azure Sentinel. The Cisco Umbrella data connector uses the Amazon S3 REST API. To set up logging and get credentials, see [Logging to Amazon S3](https://docs.umbrella.com/deployment-umbrella/docs/log-management#section-logging-to-amazon-s-3).

For more information about connecting to Azure Sentinel, see [Connect Cisco Umbrella to Azure Sentinel](connect-cisco-umbrella.md).

**Data ingestion method:** [Azure Functions and the REST API](connect-data-sources.md#rest-api-integration-using-azure-functions).

**Supported by:** Microsoft

## Citrix Analytics (Security)

The Citrix Analytics (Security) data connector exports risky event data from Citrix Analytics (Security) into Azure Sentinel. You can create custom dashboards, analyze data from other sources along with Citrix Analytics (Security) data, and create custom Logic Apps workflows to monitor and mitigate security events. For more information, see [Microsoft Azure Sentinel integration](https://docs.citrix.com/en-us/security-analytics/getting-started-security/azure-sentinel-integration.html).

For more information about connecting to Azure Sentinel, see [Connect Citrix Analytics (Security) to Azure Sentinel](connect-citrix-analytics.md).

**Data ingestion method:** [REST API](connect-data-sources.md#rest-api-integration-on-the-provider-side).

**Supported by:** [Citrix](https://www.citrix.com/support/)

## Citrix Web App Firewall (WAF) (Preview)

The Citrix WAF data connector connects your Citrix WAF logs to Azure Sentinel. Citrix WAF mitigates threats against your public-facing assets, including websites, apps, and APIs.
- To configure WAF, see [Support WIKI - WAF Configuration with NetScaler](https://support.citrix.com/article/CTX234174).
- To configure CEF logs, see [CEF Logging Support in the Application Firewall](https://support.citrix.com/article/CTX136146).
- To forward the logs to proxy, see [Configuring Citrix ADC appliance for audit logging](https://docs.citrix.com/en-us/citrix-adc/13/system/audit-logging/configuring-audit-logging.html).

For more information about connecting to Azure Sentinel, see [Connect Citrix WAF to Azure Sentinel](connect-citrix-waf.md).

**Data ingestion method:** [CEF](connect-common-event-format.md) over Syslog.

**Supported by:** [Citrix](https://www.citrix.com/support/)

## Cognni (Preview)

The Cognni data connector offers a quick and simple integration to Azure Sentinel. You can use Cognni to autonomously map previously unclassified important information and detect related incidents. Cognni helps you recognize risks to your important information, understand the severity of the incidents, and investigate the details you need to remediate, fast enough to make a difference.

**Data ingestion method:** [REST API](connect-data-sources.md#rest-api-integration-on-the-provider-side).

**Supported by:** [Cognni](https://cognni.ai/contact-support/)

## CyberArk Enterprise Password Vault (EPV) Events (Preview)

The CyberArk data connector ingests CyberArk EPV XML Syslog messages for actions taken against the vault. EPV converts the XML messages into CEF standard format through the *Sentinel.xsl* translator, and sends them to a Syslog staging server you choose (syslog-ng, rsyslog). The Log Analytics agent on the Syslog staging server imports the messages into Log Analytics. For more information, see [Security Information and Event Management (SIEM) Applications](https://docs.cyberark.com/Product-Doc/OnlineHelp/PAS/Latest/en/Content/PASIMP/DV-Integrating-with-SIEM-Applications.htm) in the CyberArk documentation.

For more information about connecting to Azure Sentinel, see [Connect CyberArk Enterprise Password Vault to Azure Sentinel](connect-cyberark.md).

**Data ingestion method:** [CEF](connect-common-event-format.md) over Syslog.

**Supported by:** [CyberArk](https://www.cyberark.com/customer-support/)

## Cyberpion Security Logs (Preview)

The Cyberpion Security Logs data connector ingests logs from the Cyberpion system directly into Azure Sentinel. For more information, see [Azure Sentinel](https://www.cyberpion.com/resource-center/integrations/azure-sentinel/) in the Cyberpion documentation.

**Data ingestion method:** [REST API](connect-data-sources.md#rest-api-integration-on-the-provider-side).

**Supported by:** Cyberpion

## ESET Enterprise Inspector (Preview)

The ESET Enterprise Inspector data connector ingests detections from ESET Enterprise Inspector using the REST API provided in ESET Enterprise Inspector version 1.4 and later. For more information, see [REST API](https://help.eset.com/eei/1.5/en-US/api.html) in the ESET Enterprise Inspector documentation.

**Data ingestion method:** [Azure Functions and the REST API](connect-data-sources.md#rest-api-integration-using-azure-functions).

**Supported by:** [ESET](https://support.eset.com/en)

## ESET Security Management Center (SMC) (Preview)

The ESET SMC data connector ingests ESET SMC threat events, audit logs, firewall events, and website filters into Azure Sentinel. For more information, see [Syslog server](https://help.eset.com/esmc_admin/70/en-US/admin_server_settings_syslog.html) in the ESET SMC documentation.

**Data ingestion method:** [Log Analytics Agent custom logs](connect-data-sources.md#custom-logs).

**Supported by:** [ESET](https://support.eset.com/en)

## Exabeam Advanced Analytics (Preview)

The Exabeam Advanced Analytics data connector ingests Exabeam Advanced Analytics events like System Health, Notable Sessions/Anomalies, Advanced Analytics, and Job Status into Azure Sentinel. To send logs from Exabeam Advanced Analytics via Syslog, follow the instructions at [Configure Advanced Analytics system activity notifications](https://docs.exabeam.com/en/advanced-analytics/i54/advanced-analytics-administration-guide/113254-configure-advanced-analytics.html#UUID-7ce5ff9d-56aa-93f0-65de-c5255b682a08).

**Data ingestion method:** [Syslog](connect-syslog.md). The connector also uses a log parser based on a Kusto function.

**Supported by:** Microsoft

## ExtraHop Reveal(x)

The ExtraHop Reveal(x) data connector connects your Reveal(x) system to Azure Sentinel. Azure Sentinel integration requires the ExtraHop Detection SIEM Connector. To install the SIEM Connector on your Reveal(x) system, follow the instructions at [ExtraHop Detection SIEM Connector](https://aka.ms/asi-syslog-extrahop-forwarding).

For more information about connecting to Azure Sentinel, see [Connect ExtraHop Reveal(x) to Azure Sentinel](connect-extrahop.md).

**Data ingestion method:** [CEF](connect-common-event-format.md) over Syslog.

**Supported by:** [ExtraHop](https://www.extrahop.com/support/)

## F5 BIG-IP 

The F5 BIG-IP connector connects your F5 LTM, system, and ASM logs to Azure Sentinel. For more information, see [Integrating the F5 BIGIP with Azure Sentinel](https://devcentral.f5.com/s/articles/Integrating-the-F5-BIGIP-with-Azure-Sentinel).

For more information about connecting to Azure Sentinel, see [Connect F5 BIG-IP to Azure Sentinel](connect-f5-big-ip.md).

**Data ingestion method:** [REST API](connect-data-sources.md#rest-api-integration-on-the-provider-side).

**Supported by:** Microsoft

## F5 Networks

The F5 firewall connector connects your F5 Application Security Events to Azure Sentinel. To set up remote logging, see [Configuring Application Security Event Logging](https://aka.ms/asi-syslog-f5-forwarding).

For more information about connecting to Azure Sentinel, see [Connect F5 ASM to Azure Sentinel](connect-f5.md).

**Data ingestion method:** [CEF](connect-common-event-format.md) over Syslog.

**Supported by:** Microsoft

## Forcepoint Cloud Access Security Broker (CASB) (Preview)

The Forcepoint CASB data connector automatically exports CASB logs and events into Azure Sentinel in real time. For more information, see [Forcepoint CASB and Azure Sentinel](https://forcepoint.github.io/docs/casb_and_azure_sentinel/).

For more information about connecting to Azure Sentinel, see [Connect Forcepoint products to Azure Sentinel](connect-forcepoint-casb-ngfw.md).

**Data ingestion method:** [CEF](connect-common-event-format.md) over Syslog.

**Supported by:** [Forcepoint](https://support.forcepoint.com/)

## Forcepoint Cloud Security Gateway (CSG) (Preview)

The Forcepoint CSG data connector automatically exports CSG logs into Azure Sentinel. CSG is a converged cloud security service that provides visibility, control, and threat protection for users and data, wherever they are. For more information, see [Forcepoint Cloud Security Gateway and Azure Sentinel](https://forcepoint.github.io/docs/csg_and_sentinel/).

For more information about connecting to Azure Sentinel, see [Connect Forcepoint products to Azure Sentinel](connect-forcepoint-casb-ngfw.md).

**Data ingestion method:** [CEF](connect-common-event-format.md) over Syslog.

**Supported by:** [Forcepoint](https://support.forcepoint.com/)

## Forcepoint Data Loss Prevention (DLP) (Preview)

The Forcepoint DLP data connector automatically exports DLP incident data from Forcepoint DLP into Azure Sentinel in real time. For more information, see [Forcepoint Data Loss Prevention and Azure Sentinel](https://forcepoint.github.io/docs/dlp_and_azure_sentinel/).

For more information about connecting to Azure Sentinel, see [Connect Forcepoint DLP to Azure Sentinel](connect-forcepoint-dlp.md).

**Data ingestion method:** [REST API](connect-data-sources.md#rest-api-integration-on-the-provider-side).

**Supported by:** [Forcepoint](https://support.forcepoint.com/)

## Forcepoint Next Generation Firewall (NGFW) (Preview)

The Forcepoint NGFW data connector automatically exports user-defined Forcepoint NGFW logs into Azure Sentinel in real time. For more information, see [Forcepoint Next-Gen Firewall and Azure Sentinel](https://forcepoint.github.io/docs/ngfw_and_azure_sentinel/).

For more information about connecting to Azure Sentinel, see [Connect Forcepoint products to Azure Sentinel](connect-forcepoint-casb-ngfw.md).

**Data ingestion method:** [CEF](connect-common-event-format.md) over Syslog.

**Supported by:** [Forcepoint](https://support.forcepoint.com/)

## ForgeRock Common Audit (CAUD) for CEF (Preview)

The ForgeRock Identity Platform provides a single common auditing framework so you can track log data holistically. You can extract and aggregate log data across the entire platform with CAUD event handlers and unique IDs. The CAUD for CEF connector is open and extensible, and you can use its audit logging and reporting capabilities for integration with Azure Sentinel. For more information, see [ForgeRock Common Audit (CAUD) for Azure Sentinel](https://github.com/javaservlets/SentinelAuditEventHandler).

**Data ingestion method:** [CEF](connect-common-event-format.md) over Syslog.

**Supported by:** [ForgeRock](https://www.forgerock.com/support)

## Fortinet 

The Fortinet firewall connector connects Fortinet logs to Azure Sentinel. For more information, go to the [Fortinet Document Library](https://aka.ms/asi-syslog-fortinet-fortinetdocumentlibrary), choose your version, and use the *Handbook* and *Log Message Reference* PDFs.

For more information about connecting to Azure Sentinel, see [Connect Fortinet to Azure Sentinel](connect-fortinet.md).

**Data ingestion method:** [CEF](connect-common-event-format.md) over Syslog.

**Supported by:** [Fortinet](https://support.fortinet.com/)

## Google Workspace (G-Suite) (Preview)

The Google Workspace data connector ingests Google Workspace Activity events into Azure Sentinel through the REST API. The ability to ingest events helps you:
- Examine potential security risks.
- Analyze your team's collaboration.
- Diagnose configuration problems.
- Track who signs in and when.
- Analyze administrator activity.
- Understand how users create and share content.
- Review organizational events.

To get credentials, follow the instructions at [Perform Google Workspace Domain-Wide Delegation of Authority](https://developers.google.com/admin-sdk/reports/v1/guides/delegation).

For more information about connecting to Azure Sentinel, see [Connect Google Workspace (formerly G Suite) to Azure Sentinel](connect-google-workspace.md).

**Data ingestion method:** [Azure Functions and the REST API](connect-data-sources.md#rest-api-integration-using-azure-functions).

**Supported by:** Microsoft

## Illusive Attack Management System (AMS) (Preview)

The Illusive AMS connector shares Illusive attack surface analysis data and incident logs to Azure Sentinel. You can view this information in dedicated dashboards. The ASM Workbook offers insight into your organization's attack surface risk, and the ADS Workbook tracks unauthorized lateral movement in your organization's network. For more information, see the [Illusive Networks Admin Guide](https://support.illusivenetworks.com/hc/en-us/sections/360002292119-Documentation-by-Version).

For more information about connecting to Azure Sentinel, see [Connect Illusive Networks AMS to Azure Sentinel](connect-illusive-attack-management-system.md).

**Data ingestion method:** [CEF](connect-common-event-format.md) over Syslog.

**Supported by:** [Illusive Networks](https://www.illusivenetworks.com/technical-support/)

## Imperva WAF Gateway (Preview)

The Imperva connector connects your Imperva WAF Gateway alerts to Azure Sentinel. For more information, see [Steps for Enabling Imperva WAF Gateway Alert Logging to Azure Sentinel](https://community.imperva.com/blogs/craig-burlingame1/2020/11/13/steps-for-enabling-imperva-waf-gateway-alert).

For more information about connecting to Azure Sentinel, see [Connect Imperva WAF Gateway to Azure Sentinel](connect-imperva-waf-gateway.md).

**Data ingestion method:** [CEF](connect-common-event-format.md) over Syslog.

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

## Morphisec UTPP (Preview)

The Morphisec Data Connector for Azure Sentinel integrates vital insights from your security products. You can expand your analytical capabilities with search and correlation, threat intelligence, and customized alerts. The Morphisec data connector provides visibility into advanced threats like sophisticated fileless attacks, in-memory exploits, and zero days. With a single, cross-product view, you can make real-time, data-backed decisions to protect your most important assets.

**Data ingestion method:** [CEF](connect-common-event-format.md) over Syslog. The connector also uses a log parser based on a Kusto function.

**Supported by:** Morphisec

## Netskope (Preview)

The Netskope Cloud Security Platform connector ingests Netskope logs and events into Azure Sentinel. For more information, see [The Netskope Cloud Security Platform](https://www.netskope.com/platform).

**Data ingestion method:** [Azure Functions and the REST API](connect-data-sources.md#rest-api-integration-using-azure-functions).

**Supported by:** Microsoft

## NGINX HTTP Server (Preview)

The NGINX HTTP Server data connector ingests NGINX HTTP Server events into Azure Sentinel. For more information, see [Module ngx_http_log_module](https://nginx.org/en/docs/http/ngx_http_log_module.html).

**Data ingestion method:** [Log Analytics Agent custom logs](connect-data-sources.md#custom-logs). The connector also uses a log parser based on a Kusto function.

**Supported by:** Microsoft

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

The Okta Single Sign-On (SSO) data connector ingests audit and event logs from the Okta API into Azure Sentinel. To create an API token, follow the instructions at [Create the token](https://developer.okta.com/docs/guides/create-an-api-token/create-the-token/).

For more information about connecting to Azure Sentinel, see [Connect Okta SSO to Azure Sentinel](connect-okta-single-sign-on.md).

**Data ingestion method:** [Azure Functions and the REST API](connect-data-sources.md#rest-api-integration-using-azure-functions).

**Supported by:** Microsoft

## Onapsis Platform (Preview)

The Onapsis data connector exports the alarms triggered in the Onapsis Platform into Azure Sentinel in real time.

**Data ingestion method:** [CEF](connect-common-event-format.md) over Syslog.

**Supported by:** [Onapsis](https://onapsis.force.com/s/login/)

## One Identity Safeguard (Preview)

The One Identity Safeguard CEF Sentinel data connector enhances the standard CEF connector with Safeguard for Privileged Sessions-specific dashboards. This connector uses device events for visualization, alerts, investigations, and more. For more information, see the [One Identity Safeguard for Privileged Sessions Administration Guide](https://aka.ms/sentinel-cef-oneidentity-forwarding).

For more information about connecting to Azure Sentinel, see [Connect One Identity Safeguard to Azure Sentinel](connect-one-identity.md).

**Data ingestion method:** [CEF](connect-common-event-format.md) over Syslog.

**Supported by:** [One Identity](https://support.oneidentity.com/)

## Oracle WebLogic Server (Preview)

The OracleWebLogicServer data connector ingests OracleWebLogicServer events into Azure Sentinel. For more information, see the [Oracle WebLogic Server documentation](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/index.html).

**Data ingestion method:** [Log Analytics Agent custom logs](connect-data-sources.md#custom-logs). The connector also uses a log parser based on a Kusto function.

**Supported by:** Microsoft

## Orca Security Alert (Preview)

The Orca Security Alerts connector automatically exports Alerts logs to Azure Sentinel. For more information, see [Azure Sentinel integration](https://orcasecurity.zendesk.com/hc/en-us/articles/360043941992-Azure-Sentinel-configuration).

For more information about connecting to Azure Sentinel, see [Connect Orca Security to Azure Sentinel](connect-orca-security-alerts.md).

**Data ingestion method:** [REST API](connect-data-sources.md#rest-api-integration-on-the-provider-side).

**Supported by:** [Orca Security](http://support.orca.security/)

## OSSEC (Preview)

The OSSEC data connector ingests OSSEC events into Azure Sentinel. For more information, see the [OSSEC documentation](https://www.ossec.net/docs/). To configure OSSEC sending alerts via Syslog, follow the instructions at [Sending alerts via syslog](https://www.ossec.net/docs/docs/manual/output/syslog-output.html).

**Data ingestion method:** [CEF](connect-common-event-format.md) over Syslog.

**Supported by:** Microsoft

## Palo Alto Networks

The Palo Alto Networks firewall data connector connects Palo Alto Networks logs to Azure Sentinel. For more information, see [Common Event Format (CEF) Configuration Guides](https://aka.ms/asi-syslog-paloalto-forwarding) and [Configure Syslog Monitoring](https://aka.ms/asi-syslog-paloalto-configure).

The Palo Alto Networks data connector ingests logs into Azure Sentinel [CEF](connect-common-event-format.md) over Syslog.

For more information about connecting to Azure Sentinel, see [Connect Palo Alto Networks to Azure Sentinel](connect-paloalto.md).

**Data ingestion method:** [CEF](connect-common-event-format.md) over Syslog.

**Supported by:** [Palo Alto Networks](https://www.paloaltonetworks.com/company/contact-support)

## Perimeter 81 Activity Logs (Preview)

The Perimeter 81 Activity Logs data connector connects Perimeter 81 activity logs to Azure Sentinel. For more information, see the Perimeter 81 [Azure Sentinel](https://support.perimeter81.com/docs/360012680780) documentation.

For more information about connecting to Azure Sentinel, see [Connect Perimeter 81 logs to Azure Sentinel](connect-perimeter-81-logs.md).

**Data ingestion method:** [REST API](connect-data-sources.md#rest-api-integration-on-the-provider-side).

**Supported by:** [Perimeter 81](https://support.perimeter81.com/)

## Proofpoint On Demand (POD) Email Security (Preview)

The POD Email Security data connector gets POD Email Protection data. With this connector, you can check message traceability, and monitor email activity, threats, and data exfiltration by attackers and malicious insiders. You can review organizational events on an accelerated basis, and get event logs in hourly increments for recent activity. For information about how to enable and check the POD Log API, [sign in to the Proofpoint Community](https://proofpointcommunities.force.com/community/s/article/How-to-request-a-Community-account-and-gain-full-customer-access?utm_source=login&utm_medium=recommended&utm_campaign=public) and see [Proofpoint-on-Demand-Pod-Log-API](https://proofpointcommunities.force.com/community/s/article/Proofpoint-on-Demand-Pod-Log-API).

For more information about connecting to Azure Sentinel, see [Connect Proofpoint On Demand (POD) Email Security to Azure Sentinel](connect-proofpoint-pod.md).

**Data ingestion method:** [Azure Functions and the REST API](connect-data-sources.md#rest-api-integration-using-azure-functions).

**Supported by:** Microsoft

## Proofpoint Targeted Attack Protection (TAP) (Preview)

The Proofpoint TAP connector ingests Proofpoint TAP logs and events into Azure Sentinel. The connector provides visibility into Message and Click events in Azure Sentinel.

For more information about connecting to Azure Sentinel, see [Connect Proofpoint TAP to Azure Sentinel](connect-proofpoint-tap.md).

**Data ingestion method:** [Azure Functions and the REST API](connect-data-sources.md#rest-api-integration-using-azure-functions).

**Supported by:** Microsoft

## Pulse Connect Secure (Preview)

The Pulse Connect Secure connector connects your Pulse Connect Secure logs to Azure Sentinel. To enable syslog streaming of Pulse Connect Secure logs, follow the instructions at [Configuring Syslog](https://docs.pulsesecure.net/WebHelp/Content/PCS/PCS_AdminGuide_8.2/Configuring%20Syslog.htm).

For more information about connecting to Azure Sentinel, see [Connect Pulse Connect Secure to Azure Sentinel](connect-pulse-connect-secure.md).

**Data ingestion method:** [Syslog](connect-syslog.md). The connector also uses a log parser based on a Kusto function.

**Supported by:** Microsoft

## Qualys Vulnerability Management (VM) KnowledgeBase (KB) (Preview)

The Qualys VM KB data connector ingests the latest vulnerability data from the Qualys KB into Azure Sentinel. You can use this data to correlate and enrich vulnerability detections by the Qualys VM data connector.

**Data ingestion method:** [Syslog](connect-syslog.md). The connector also uses a log parser based on a Kusto function.

**Supported by:** Microsoft

## Qualys VM (Preview)

The Qualys VM data connector ingests vulnerability host detection data into Azure Sentinel through the Qualys API. The connector provides visibility into host detection data from vulnerability scans.

For more information about connecting to Azure Sentinel, see [Connect Qualys VM to Azure Sentinel](connect-qualys-vm.md).

**Data ingestion method:** [Azure Functions and the REST API](connect-data-sources.md#rest-api-integration-using-azure-functions).

**Supported by:** Microsoft

## Salesforce Service Cloud (Preview)

The Salesforce Service Cloud data connector ingests information about Salesforce operational events into Azure Sentinel through the REST API. With this connector, you can review organizational events on an accelerated basis, and get event logs in hourly increments for recent activity. For more information and credentials, see the Salesforce [REST API Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/quickstart.htm).

For more information about connecting to Azure Sentinel, see [Connect Salesforce Service Cloud to Azure Sentinel](connect-salesforce-service-cloud.md).

**Data ingestion method:** [Syslog](connect-syslog.md). The connector also uses a log parser based on a Kusto function.

**Supported by:** Microsoft

## SentinelOne (Preview)

The SentinelOne data connector ingests SentinelOne events into Azure Sentinel. Events include server objects like Threats, Agents, Applications, Activities, Policies, Groups, and more. The connector can get events to examine potential security risks, analyze your team's collaboration, diagnose configuration problems, and more.

**Data ingestion method:** [Azure Functions and the REST API](connect-data-sources.md#rest-api-integration-using-azure-functions).

**Supported by:** Microsoft

## SonicWall Firewall (Preview)

The SonicWall Firewall data connector connects firewall logs to Azure Sentinel. For more information, see [Log > Syslog](http://help.sonicwall.com/help/sw/eng/7020/26/2/3/content/Log_Syslog.120.2.htm).

**Data ingestion method:** [CEF](connect-common-event-format.md) over Syslog.

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

The [Squid Proxy](http://www.squid-cache.org/) data connector connects Squid Proxy logs to Azure Sentinel.

For more information about connecting to Azure Sentinel, see [Connect Squid Proxy to Azure Sentinel](connect-squid-proxy.md).

**Data ingestion method:** [Log Analytics Agent custom logs](connect-data-sources.md#custom-logs). The connector also uses a log parser based on a Kusto function.

**Supported by:** Microsoft

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

**Data ingestion method:** [CEF](connect-common-event-format.md) over Syslog.

**Supported by:** [Thycotic](https://thycotic.force.com/support/s/)

## Trend Micro Deep Security

The Trend Micro Deep Security data connector connects Deep Security logs to Azure Sentinel. For more information, see [Forward Deep Security events to a Syslog or SIEM server](https://help.deepsecurity.trendmicro.com/12_0/on-premise/siem-syslog-forwarding-secure.html?redirected=true&Highlight=Configure%20Syslog#Protection_modules_DSM).

The Trend Micro Deep Security data connector ingests logs into Azure Sentinel [CEF](connect-common-event-format.md) over Syslog. The connector also uses a log parser based on a Kusto function.

For more information about connecting to Azure Sentinel, see [Connect Trend Micro Deep Security to Azure Sentinel](connect-trend-micro.md).

**Data ingestion method:** [CEF](connect-common-event-format.md) over Syslog. The connector also uses a log parser based on a Kusto function.

**Supported by:** [Trend Micro](https://success.trendmicro.com/technical-support)

## Trend Micro TippingPoint (Preview)

The Trend Micro TippingPoint data connector connects TippingPoint SMS IPS events to Azure Sentinel.

For more information about connecting to Azure Sentinel, see [Connect Trend Micro TippingPoint to Azure Sentinel](connect-trend-micro-tippingpoint.md).

**Data ingestion method:** [CEF](connect-common-event-format.md) over Syslog. The connector also uses a log parser based on a Kusto function.

**Supported by:** [Trend Micro](https://success.trendmicro.com/technical-support)

## Trend Micro XDR (Preview)

The Trend Micro XDR data connector ingests workbench alerts from the Trend Micro XDR API into Azure Sentinel. To create an account and an API authentication token, follow the instructions at [Obtaining API Keys for Third-Party Access](https://docs.trendmicro.com/en-us/enterprise/trend-micro-xdr-help/ObtainingAPIKeys).

**Data ingestion method:** [Azure Functions and the REST API](connect-data-sources.md#rest-api-integration-using-azure-functions).

**Supported by:** [Trend Micro](https://success.trendmicro.com/technical-support)

## VMware Carbon Black Endpoint Standard (Preview)

The VMware Carbon Black Endpoint Standard data connector ingests Carbon Black Endpoint Standard data into Azure Sentinel. To create an API key, follow the instructions at [Creating an API Key](https://developer.carbonblack.com/reference/carbon-black-cloud/authentication/#creating-an-api-key).

For more information about connecting to Azure Sentinel, see [Connect VMware Carbon Black Cloud Endpoint Standard to Azure Sentinel](connect-vmware-carbon-black.md).

**Data ingestion method:** [Azure Functions and the REST API](connect-data-sources.md#rest-api-integration-using-azure-functions).

**Supported by:** Microsoft

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

**Data ingestion method:** [CEF](connect-common-event-format.md) over Syslog.

**Supported by:** WireX

## Workplace from Facebook (Preview)

The Workplace data connector ingests common Workplace events into Azure Sentinel through Webhooks. Webhooks enable custom integration apps to subscribe to events in Workplace and receive updates in real time. When a change occurs, Workplace sends an HTTPS POST request with event information to a callback data connector URL. For more information, see the Webhooks documentation. The connector can get events to examine potential security risks, analyze your team's collaboration, diagnose configuration problems, and more.

**Data ingestion method:** [Azure Functions and the REST API](connect-data-sources.md#rest-api-integration-using-azure-functions).

**Supported by**: Microsoft

## Zimperium Mobile Thread Defense (Preview)

Zimperium Mobile Threat Defense data connector connects the Zimperium threat log to Azure Sentinel to view dashboards, create custom alerts, and improve investigation. This connector gives you more insight into your organization's mobile threat landscape and enhances your security operation capabilities. For more instructions, see the [Zimperium customer support portal](https://support.zimperium.com/).

For more information about connecting to Azure Sentinel, see [Connect Zimperium to Azure Sentinel](connect-zimperium-mtd.md).

**Data ingestion method:** [REST API](connect-data-sources.md#rest-api-integration-on-the-provider-side).

**Supported by:** [Zimperium](https://www.zimperium.com/support)

## Zoom Reports (Preview)

The Zoom Reports data connector ingests Zoom Reports events into Azure Sentinel. The connector can get events to examine potential security risks, analyze your team's collaboration, diagnose configuration problems, and more. To get credentials, follow the instructions at [JWT With Zoom](https://marketplace.zoom.us/docs/guides/auth/jwt).

**Data ingestion method:** [REST API](connect-data-sources.md#rest-api-integration-on-the-provider-side).

**Supported by:** Microsoft

## Zscaler 

The Zscaler data connector connects Zscaler Internet Access (ZIA) logs to Azure Sentinel. Using Zscaler on Azure Sentinel gives you insights into your organization's internet usage and enhances your security operations capabilities.​ For more information, see the [Zscaler and Microsoft Azure Sentinel Deployment Guide](https://aka.ms/ZscalerCEFInstructions).

For more information about connecting to Azure Sentinel, see [Connect Zscaler to Azure Sentinel](connect-zscaler.md).

**Data ingestion method:** [CEF](connect-common-event-format.md) over Syslog.

**Supported by:** [Zscaler](https://help.zscaler.com/submit-ticket-links)

## Zscaler Private Access (ZPA) (Preview)

The ZPA data connector ingests Zscaler Private Access events into Azure Sentinel. For more information, see the [Zscaler Private Access documentation](https://help.zscaler.com/zpa).

**Data ingestion method:** [Log Analytics Agent custom logs](connect-data-sources.md#custom-logs). The connector also uses a log parser based on a Kusto function.

**Supported by:** Microsoft
