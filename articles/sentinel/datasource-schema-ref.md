---
title: DataSource schema reference
description: This article lists supported Azure and 3rd party DataSource schemas, with links to their reference documentation.
author: batamig
ms.author: bagol
manager: rkarlin
ms.assetid: 
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.topic: reference
ms.custom: 
ms.date: 12/22/2020
---

# DataSource schema reference

This article lists supported Azure and 3rd party DataSource schemas, with links to their reference documentation.

## Azure DataSources

| Type                             | DataSource             | logAnalytics Tablename | Schema Reference |
| -------------------------------- | ---------------------- | ---------------------- | ---------------- |
| **Azure**                            | Azure Active Directory | SigninEvents           | [Audit Log Schema](/graph/api/resources/signin?view=graph-rest-beta#properties) |
| **Azure**                            | Azure Active Directory | AuditLogs              | [Audit Log Schema](/azure/active-directory/reports-monitoring/reference-azure-monitor-audit-log-schema#field-and-property-descriptions) |
| **Azure**                            | Azure Active Directory | AzureActivity          | [Audit Log Schema](/azure/azure-monitor/platform/activity-log-schema#property-descriptions) |
| **Azure**                            | Office                 | OfficeActivity         | [Common Schema ](/office/office-365-management-api/office-365-management-activity-api-schema#common-schema)   <br> [ExchangeAdmin Schema ](/office/office-365-management-api/office-365-management-activity-api-schema#exchange-admin-schema) <br>[Exchange Mailbox Schema](/office/office-365-management-api/office-365-management-activity-api-schema#exchange-mailbox-schema)  <br> [SharePoint Base Schema](/office/office-365-management-api/office-365-management-activity-api-schema#sharepoint-base-schema)   <br> [SharePoint File Operation Schema](/office/office-365-management-api/office-365-management-activity-api-schema#sharepoint-file-operations) |
| **Azure**                            | Azure Keyvault         | AzureDiagnostics       | [Audit Log Schema](/azure/azure-monitor/insights/azure-key-vault#azure-monitor-log-records) |
| **Host**                             | Linux                  | Syslog                 | [Audit Log Schema](/azure/azure-monitor/platform/data-sources-syslog#syslog-record-properties) |
| **Network**                          | IIS Logs               | W3CIISLog              | [Audit Log Schema](/azure/azure-monitor/platform/data-sources-iis-logs#iis-log-record-properties) |
| **Network**                          | VMinsights             | VMConnection           | [Audit Log Schema](/azure/azure-monitor/insights/vminsights-log-search#common-fields-and-conventions) |
| **Network**                          | Wire Data Solution     | WireData               | [Audit Log Schema](/azure/azure-monitor/insights/wire-data#output-data) |
| **Network**                          | NSG Flow Logs          | AzureNetworkAnalytics  | [Audit Log Schema](/azure/network-watcher/traffic-analytics-schema) |
| | | | |

## 3rd-party vendor DataSources

The following table lists supported 3rd party vendors and their Syslog or CEF mapping documentation for various supported log types, which contain CEF field mappings and sample logs for each category type.

For more information, see our [blog on the grand connectors](https://techcommunity.microsoft.com/t5/azure-sentinel/azure-sentinel-syslog-cef-and-other-3rd-party-connectors-grand/ba-p/803891), including CEF, Syslog, Direct, Agent, Custom, and more.

| Type |	Vendor |	Product	| logAnalytics Tablename |	CEF Field Mapping Reference  |
| ----- | ----- | ----- | ----- |----- |
| **Network** |	Palo Alto	| PAN OS	| CommonSecurityLog |	[PAN-OS 9.0 Common Event Format Integration Guide](https://docs.paloaltonetworks.com/content/dam/techdocs/en_US/pdf/cef/pan-os-90-cef-configuration-guide.pdf) (search for *CEF- style Log Formats*) |
| **Network** |	Checkpoint	 |ALL	| CommonSecurityLog	| [Log Fields Description](https://supportcenter.checkpoint.com/supportcenter/portal?eventSubmit_doGoviewsolutiondetails=&solutionid=sk144192)       |
| **Network** |	Fortigate	| ALL	| CommonSecurityLog	| [Log Schema Structure](https://docs.fortinet.com/document/fortigate/6.2.3/fortios-log-message-reference/738142/log-schema-structure)         |
| **Network** |	Barracuda |	Web Application Firewall |	CommonSecurityLog	| [How to Configure Syslog and Other Logs](https://campus.barracuda.com/product/webapplicationfirewall/doc/4259935/how-to-configure-syslog-and-other-logs/)  |
| **Network** |	Cisco |	ASA	| CommonSecurityLog	| [Cisco ASA Series Syslog Messages](https://www.cisco.com/c/en/us/td/docs/security/asa/syslog/b_syslog/about.html)    |
| **Network** |	Cisco |	Firepower	| CommonSecurityLog	| [Cisco Firepower Threat Defense Syslog Messages](https://www.cisco.com/c/en/us/td/docs/security/firepower/Syslogs/b_fptd_syslog_guide.pdf)    |
| **Network** | Cisco	| Umbrella	| Custom Logs Table	 | [Log Formats and Versioning](https://docs.umbrella.com/deployment-umbrella/docs/log-formats-and-versioning)   |
| **Network**	| Cisco	| Meraki	| CommonSecurityLog |	[Syslog Event Types and Log Samples](https://documentation.meraki.com/zGeneral_Administration/Monitoring_and_Reporting/Syslog_Event_Types_and_Log_Samples)    |
| **Network**	| Zscaler |	Nano Streaming Service (NSS)|	CommonSecurityLog |	[Formatting NSS Feeds](https://help.zscaler.com/zia/documentation-knowledgebase/analytics/nss/nss-feeds/formatting-nss-feeds) (Web, Firewall, DNS, and Tunnel logs only) |
| **Network**	|F5	| BigIP LTM|	CommonSecurityLog|	[Event Messages and Attack Types](https://techdocs.f5.com/kb/en-us/products/big-ip_ltm/manuals/product/bigip-external-monitoring-implementations-13-0-0/15.html)  |
| **Network** |	F5	| BigIP ASM|	CommonSecurityLog|	[Logging Application Security Events](https://techdocs.f5.com/kb/en-us/products/big-ip_asm/manuals/product/asm-implementations-13-1-0/14.html)                                                           |
| **Network** |	Citrix	|Nescaler Application Firewall	| CommonSecurityLog|	[Common Event Format (CEF) Logging Support in the Application Firewall](https://support.citrix.com/article/CTX136146) <br>  [NetScaler 12.0 Syslog Message Reference](https://developer-docs.citrix.com/projects/netscaler-syslog-message-reference/en/12.0/)   |
|**Host** |Symantec | Symantec Endpoint Protection Manager (SEPM) | CommonSecurityLog|[External Logging settings and log event severity levels for Endpoint Protection Manager](https://support.symantec.com/us/en/article.tech171741.html)|
|**Host** |TrendMicro |All |CommonSecurityLog | [Syslog Content Mapping - CEF](https://docs.trendmicro.com/en-us/enterprise/control-manager-70/appendices/syslog-mapping-cef.aspx) |
| | | | | |
