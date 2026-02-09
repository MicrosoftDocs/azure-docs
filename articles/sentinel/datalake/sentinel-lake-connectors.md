---  
title: Set up connectors for the Microsoft Sentinel data lake
titleSuffix: Microsoft Security  
description: Set up and configuring connectors for Microsoft Sentinel data lake.
author: EdB-MSFT  
ms.service: microsoft-sentinel  
ms.topic: conceptual
ms.subservice: sentinel-graph
ms.date: 11/05/2025
ms.author: edbaynash  

ms.collection: ms-security  

# Customer intent: As a security admin, I want to set up connectors for Microsoft Sentinel data lake so that I can mirror and retain security data for long-term analysis.

---  

# Set up connectors for the Microsoft Sentinel data lake

The Microsoft Sentinel data lake mirrors data from Microsoft Sentinel workspaces. When you onboard to Microsoft Sentinel data lake, your existing Microsoft Sentinel data connectors are configured to send data to both the analytics tier - your Microsoft Sentinel workspaces, and mirror the data to the data lake tier for longer term storage. After onboarding, configure your connectors to retain data in each tier according to your requirements.   

This article explains how to set up connectors for the Microsoft Sentinel data lake and configure retention. For more information on onboarding, see [Onboarding to Microsoft Sentinel data lake](sentinel-lake-onboarding.md).

## Configure retention and data tiering

After onboarding, you can enable new connectors and configure retention for existing connectors. You can choose to send the data to the analytics tier and mirror the data to the data lake tier or send the data only to the data lake tier. You manage retention and tiering from the connector setup pages, or by using the **Table management** page in the Defender portal. For more information on table management and retention, see [Manage data tiers and retention in Microsoft Defender portal](../manage-data-overview.md).

:::image type="content" source="media/setting-up-sentinel-data-lake/data-tiers.png" lightbox="media/setting-up-sentinel-data-lake/data-tiers.png" alt-text="A diagram showing the analytics and data lake tiers.":::

When you enable a connector, by default the data is sent to the analytics tier and mirrored in the data lake tier. When you enable Microsoft Sentinel data lake, the mirroring is automatically enabled for all the tables from onboarding forward. Mirrored data in the data lake with the same retention as the analytics tier doesn't incur extra billing charges.
Preexisting data in the tables isn't mirrored. The retention of the data lake tier is set to the same value as the analytics tier. You can switch to ingest data to data lake tier only. When you configure to ingest only to the data lake tier, ingestion to the analytics tier stops and the existing data in the analytics tier is retained according to the retention settings.

The data retained in Archive is still available and can be restored by using Search and Restore functionality. 

To configure retention and tiering for the data connector see [Configure data connector](../configure-data-connector.md).

 ## Microsoft Sentinel XDR data

By default, Microsoft Defender XDR retains threat hunting data in the Analytics tier for 30 days. This data is always available. Some XDR tables can be ingested into the analytics and data lake tiers by increasing the retention time to more than 30 days. You can also ingest XDR data directly into the data lake tier without the analytics tier. For more information, see [Manage XDR data in Microsoft Sentinel](../manage-data-overview.md#manage-xdr-data-in-microsoft-sentinel). 


## Custom log tables

Microsoft Monitoring Agent(MMA) and Log analytics Agent (CLV1) custom tables aren't mirrored to the data lake.
  
Tables created by using the Logs Ingestion API or Azure Monitor Agent (AMA) and DCR-based custom tables are mirrored. For more information, see [Logs Ingestion API in Azure Monitor](/azure/azure-monitor/logs/logs-ingestion-api-overview).

## Auxiliary log tables 

When you onboard to both Microsoft Defender and Microsoft Sentinel and then onboard to the data lake, you no longer see auxiliary log tables in Microsoft Defender’s Advanced hunting or in the Microsoft Sentinel Azure portal. The auxiliary table data is available in the data lake and you can query it by using KQL queries or Jupyter notebooks. Find KQL queries under **Microsoft Sentinel** > **Data lake exploration** in the Defender portal.
 
## Direct ingestion to the data lake tier

Depending on your organization's security needs, you might choose to ingest some log sources directly into the data 
lake. Directly ingesting logs to the data lake allows you to better manage costs by optimizing data retention and storage based on the value of the data for real-time detection versus long-term analysis.

Ingest high-volume logs that are less critical for real-time detection but valuable for deep analysis and forensics directly to the lake, and ingest only high-value logs to the analytics tier. Note that logs ingested to the analytics tier are also mirrored to the data lake.

Use the following table to prioritize which sources you should ingest directly to the data lake versus the analytics tier.

| Log source type                                    | Typical log volume | Value for real-time threat detection and alerting | Value for threat hunting | Value for incident investigation and forensics | Ingest to data lake |
|-------------------------------------------------|--------------------|-------------------------------------|----------------|-----------------------------------|-----------------------|
| AAA (TACACS/Radius)                             | Medium             | High                                | High           | High                              | Yes                   |
| Active Directory (on-premises)                      | High               | High                                | High           | High                              | No                    |
| Application Logs                                | High               | Medium                              | Medium         | High                              | Yes                   |
| AV Logs (Windows Events 5000s & 3rd party)      | Medium             | High                                | High           | High                              | No                    |
| Azure Activity                                  | Medium             | High                                | High           | High                              | No                    |
| Biometric Access System Logs                    | Low                | Medium                              | Low            | High                              | Yes                   |
| Building Security System Logs                   | Low                | Low                                 | Low            | Medium                            | Yes                   |
| Call Center/VoIP Logs                           | Medium             | Low                                 | Low            | Medium                            | Yes                   |
| CASB                                            | High               | High                                | High           | High                              | Yes                   |
| Citrix/Horizon/ALBs                             | Medium             | Medium                              | Medium         | High                              | Yes                   |
| Cloud IAM                                       | Medium             | High                                | High           | High                              | No                    |
| Cloud PaaS                                      | High               | High                                | High           | High                              | Yes                   |
| Cloud Security Controls                         | Medium             | High                                | Medium         | High                              | No                    |
| Cloud Storage (S3, Blob, etc.) Logs             | High               | High                                | High           | High                              | No                    |
| CRM Audit Logs                                  | Low-Medium         | Low                                 | Low            | Medium                            | Yes                   |
| Database Audit Tools                            | Medium             | High                                | High           | High                              | Yes                   |
| DHCP Logs                                       | Medium             | Medium                              | Medium         | High                              | Yes                   |
| DLP Alerts                                      | Low                | High                                | High           | High                              | Yes                   |
| DNS Logs                                        | High               | High                                | High           | High                              | Yes                   |
| Endpoint Detection and Response (EDR) (Alerts)  | Medium             | High                                | High           | High                              | No                    |
| Endpoint Detection and Response (EDR) (Raw)     | High               | High                                | High           | High                              | Yes                   |
| Email Security (3rd party alerts)               | Medium             | High                                | Medium         | High                              | No                    |
| ERP Audit Logs                                  | Low-Medium         | Low                                 | Low            | Medium                            | Yes                   |
| File Integrity                                  | Low                | Medium                              | Medium         | High                              | Yes                   |
| Firewall Threat/Malware/IPS/IDS                 | High               | High                                | High           | High                              | No                    |
| Firewall Traffic Logs                           | High               | High                                | High           | High                              | Yes                   |
| GitHub/GitLab/Code Repo Logs                    | Low-Medium         | Medium                              | Medium         | High                              | Yes                   |
| Google Workspace Logs                           | Medium             | Medium                              | Medium         | High                              | Yes                   |
| Identity (Entra ID, Okta, LDAP)                 | Medium             | High                                | High           | High                              | No                    |
| IIS/Apache Logs                                 | Medium             | High                                | High           | High                              | Yes                   |
| IoT Device Logs                                 | High               | Medium                              | Medium         | Medium                            | Yes                   |
| Kubernetes/Container Logs (alerts, critical)    | High               | High                                | High           | High                              | No                    |
| Kubernetes/Container Logs (raw logs)            | High               | High                                | High           | High                              | Yes                   |
| LAN/WAN Router Switch                           | High               | Medium                              | Medium         | Medium                            | Yes                   |
| Linux Server AuditD                             | Medium             | High                                | High           | High                              | No                    |
| Mobile Device Management (Intune)               | Medium             | Medium                              | Medium         | Medium                            | Yes                   |
| Microsoft Office Logs (Teams, Office, SharePoint)| Medium            | Medium                              | Medium         | High                              | No                    |
| Microsoft XDR Alerts (Defender: Office, Identity, Endpoint, CloudApp) | Medium | High | High | High | No |
| Multifactor authentication (MFA)               | Medium             | High                                | Medium         | High                              | No                    |
| Netflow                                         | High               | Medium                              | High           | Medium                            | Yes                   |
| Network Detection (Corelight, Vectra, Darktrace)| High               | High                                | High           | High                              | No                    |
| OT/ICS System Logs                              | Medium             | High                                | High           | High                              | Yes                   |
| PAM (Privileged Access Management)              | Low                | High                                | High           | High                              | No                    |
| PIM (Privileged Identity Management)            | Low                | High                                | High           | High                              | No                    |
| POS System Logs                                 | High               | High                                | High           | High                              | Yes                   |
| Proxy Logging (URL filtering)                   | High               | High                                | High           | High                              | Yes                   |
| Salesforce Audit Logs                           | Medium             | Medium                              | Medium         | High                              | Yes                   |
| SD-WAN                                          | Medium             | Medium                              | Medium         | Medium                            | Yes                   |
| ServiceNow Audit Logs                           | Low                | Low                                 | Low            | Medium                            | Yes                   |
| SIEM/SOAR Platform Logs                         | Medium             | High                                | High           | High                              | No                    |
| Slack/Teams Collaboration Logs                  | Medium             | Low                                 | Medium         | Medium                            | Yes                   |
| Sysmon (Endpoint, for EDR complement)           | Medium             | High                                | High           | High                              | Yes                   |
| Threat Intelligence Indicators                  | Low                | High                                | High           | High                              | No                    |
| VDI Logs                                        | Medium             | Medium                              | Medium         | High                              | Yes                   |
| VPN                                             | Medium             | High                                | High           | High                              | No                    |
| Vulnerability Scanning                          | Low                | Medium                              | Medium         | Medium                            | Yes                   |
| Web Application Firewall (WAF) Logs             | Medium             | High                                | High           | High                              | Yes                   |
| Windows Server Events                           | High               | High                                | High           | High                              | No                    |
| XDR Source Logs (Defender: Office, Identity, Endpoint, CloudApp) | Medium | High | High | High | No |
| Zoom Meeting Logs                               | Low-Medium         | Low                                 | Low            | Medium                            | Yes                   |




## Related articles

- [Onboarding to Microsoft Sentinel data lake](sentinel-lake-onboarding.md)
- [Manage data tiers and retention in Microsoft Defender Portal](../manage-data-overview.md)
- [KQL and the Microsoft Sentinel data lake](kql-overview.md)
- [Jupyter notebooks and the Microsoft Sentinel data lake](notebooks-overview.md)
