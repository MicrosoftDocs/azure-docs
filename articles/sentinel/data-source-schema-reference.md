---
title: Microsoft Sentinel data source schema reference
description: This article lists Azure and third-party data source schemas supported by Microsoft Sentinel, with links to their reference documentation.
author: limwainstein
ms.author: lwainstein
ms.topic: reference
ms.custom: ignite-fall-2021
ms.date: 11/09/2021
---

# Data source schema reference

This article lists supported Azure and third-party data source schemas, with links to their reference documentation.

## Azure data sources

| Type                             | Data source             | Log Analytics tablename | Schema reference |
| -------------------------------- | ---------------------- | ---------------------- | ---------------- |
| **Azure**                            | Microsoft Entra ID | SigninEvents           | [Microsoft Entra activity reports sign-in properties](/graph/api/resources/signin#properties) |
| **Azure**                            | Microsoft Entra ID | AuditLogs              | [Azure Monitor AuditLogs reference](/azure/azure-monitor/reference/tables/auditlogs) |
| **Azure**                            | Microsoft Entra ID | AzureActivity          | [Azure Monitor AzureActivity reference](/azure/azure-monitor/reference/tables/azureactivity) |
| **Azure**                            | Office                 | OfficeActivity         | Office 365 Management Activity API schemas: <br>- [Common schema](/office/office-365-management-api/office-365-management-activity-api-schema#common-schema)   <br>- [Exchange Admin schema](/office/office-365-management-api/office-365-management-activity-api-schema#exchange-admin-schema) <br>- [Exchange Mailbox schema](/office/office-365-management-api/office-365-management-activity-api-schema#exchange-mailbox-schema)  <br>- [SharePoint Base schema](/office/office-365-management-api/office-365-management-activity-api-schema#sharepoint-base-schema)   <br>- [SharePoint file operations](/office/office-365-management-api/office-365-management-activity-api-schema#sharepoint-file-operations) |
| **Azure**                            | Azure Key Vault         | AzureDiagnostics       | [Azure Monitor AzureDiagnostics reference](/azure/azure-monitor/reference/tables/azurediagnostics) |
| **Host**                             | Linux                  | Syslog                 | [Azure Monitor Syslog reference](/azure/azure-monitor/reference/tables/syslog) |
| **Network**                          | IIS Logs               | W3CIISLog              | [Azure Monitor W3CIISLog reference](/azure/azure-monitor/reference/tables/w3ciislog) |
| **Network**                          | VMinsights             | VMConnection           | [Azure Monitor VMConnection reference](/azure/azure-monitor/reference/tables/vmconnection) |
| **Network**                          | Wire Data Solution     | WireData               | [Azure Monitor WireData reference](/azure/azure-monitor/reference/tables/wiredata) |
| **Network**                          | NSG Flow Logs          | AzureNetworkAnalytics  | [Schema and data aggregation in Traffic Analytics](../network-watcher/traffic-analytics-schema.md) |


> [!NOTE]
> For more information, see the entire [Azure Monitor data reference](/azure/azure-monitor/reference/).
>
## 3rd-party vendor data sources

The following table lists supported third-party vendors and their Syslog or Common Event Format (CEF)-mapping documentation for various supported log types, which contain CEF field mappings and sample logs for each category type.

| Type |	Vendor |	Product	| Log Analytics tablename |	CEF field-mapping reference  |
| ----- | ----- | ----- | ----- |----- |
| **Network** |	Palo Alto	| PAN OS	| CommonSecurityLog |	[PAN-OS 9.0 Common Event Format Integration Guide](https://docs.paloaltonetworks.com/content/dam/techdocs/en_US/pdf/cef/pan-os-90-cef-configuration-guide.pdf) (search for *CEF- style Log Formats*) |
| **Network** |	Check Point	 |ALL	| CommonSecurityLog	| [Log Fields Description](https://supportcenter.checkpoint.com/supportcenter/portal?eventSubmit_doGoviewsolutiondetails=&solutionid=sk109795)       |
| **Network** |	Fortigate	| ALL	| CommonSecurityLog	| [Log Schema Structure](https://docs.fortinet.com/document/fortigate/6.2.3/fortios-log-message-reference/738142/log-schema-structure)         |
| **Network** |	Barracuda |	Web Application Firewall |	CommonSecurityLog	| [How to Configure Syslog and Other Logs](https://campus.barracuda.com/product/webapplicationfirewall/doc/4259935/how-to-configure-syslog-and-other-logs/)  |
| **Network** |	Cisco |	ASA	| CommonSecurityLog	| [Cisco ASA Series Syslog Messages](https://www.cisco.com/c/en/us/td/docs/security/asa/syslog/b_syslog/about.html)    |
| **Network** |	Cisco |	Firepower	| CommonSecurityLog	| [Cisco Firepower Threat Defense Syslog Messages](https://www.cisco.com/c/en/us/td/docs/security/firepower/Syslogs/b_fptd_syslog_guide.html)    |
| **Network** | Cisco	| Umbrella	| Custom Logs Table	 | [Log Formats and Versioning](https://docs.umbrella.com/deployment-umbrella/docs/log-formats-and-versioning)   |
| **Network**	| Cisco	| Meraki	| CommonSecurityLog |	[Syslog Event Types and Log Samples](https://documentation.meraki.com/zGeneral_Administration/Monitoring_and_Reporting/Syslog_Event_Types_and_Log_Samples)    |
| **Network**	| Zscaler |	Nano Streaming Service (NSS)|	CommonSecurityLog |	[Formatting NSS Feeds](https://help.zscaler.com/zia/documentation-knowledgebase/analytics/nss/nss-feeds/formatting-nss-feeds) (Web, Firewall, DNS, and Tunnel logs only) |
| **Network**	|F5	| BigIP LTM|	CommonSecurityLog|	[Event Messages and Attack Types](https://techdocs.f5.com/kb/en-us/products/big-ip_ltm/manuals/product/bigip-external-monitoring-implementations-13-0-0/15.html)  |
| **Network** |	F5	| BigIP ASM|	CommonSecurityLog|	[Logging Application Security Events](https://techdocs.f5.com/kb/en-us/products/big-ip_asm/manuals/product/asm-implementations-13-1-0/14.html)                                                           |
| **Network** |	Citrix	|Web App Firewall	| CommonSecurityLog|	[Common Event Format (CEF) Logging Support in the Application Firewall](https://support.citrix.com/article/CTX136146)  |
|**Host** |Symantec | Symantec Endpoint Protection Manager (SEPM) | CommonSecurityLog|[External Logging settings and log event severity levels for Endpoint Protection Manager](https://support.symantec.com/us/en/article.tech171741.html)|
|**Host** |Trend Micro |All |CommonSecurityLog | [Syslog Content Mapping - CEF](https://docs.trendmicro.com/en-us/enterprise/trend-micro-apex-central-2019-online-help/appendices/syslog-mapping-cef.aspx) |


> [!NOTE]
> For more information, see also [CEF and CommonSecurityLog field mapping](cef-name-mapping.md).
> 
## Next steps

Learn more supported Microsoft Sentinel connectors, such as CEF, Syslog, direct, agent, and custom connectors:

- [Connect data sources](connect-data-sources.md)

- [Microsoft Sentinel Syslog, CEF, and other 3rd-party connectors](https://techcommunity.microsoft.com/t5/azure-sentinel/azure-sentinel-syslog-cef-and-other-3rd-party-connectors-grand/ba-p/803891)
