---
title: List of Microsoft Sentinel Advanced Security Information Model (ASIM) parsers | Microsoft Docs
description: This article lists Advanced Security Information Model (ASIM) parsers.
author: oshezaf
ms.topic: reference
ms.date: 12/31/2024
ms.author: ofshezaf


#Customer intent: As a security analyst, I want to deploy and use ASIM parsers so that I can normalize and analyze security event data from various sources effectively.

--- 

# List of Microsoft Sentinel Advanced Security Information Model (ASIM) parsers

This document provides a list of Advanced Security Information Model (ASIM) parsers. For an overview of ASIM parsers refer to the [parsers overview](normalization-parsers-overview.md). To understand how parsers fit within the ASIM architecture, refer to the [ASIM architecture diagram](normalization.md#asim-components).

## Alert Event parsers

| **Source** | **Notes** | **Parser** |
| --- | --------------------------- | ---------- |
| **Microsoft Defender XDR** | Microsoft Defender XDR alert events (in the `AlertEvidence` table). | `_Im_AlertEvent_MicrosoftDefenderXDRVxx` |
| **SentinelOne Singularity** | SentinelOne Singularity threat events (in the `SentinelOne_CL` table). | `_Im_AlertEvent_SentinelOneSingularityVxx` |

## Audit Event parsers

| **Source** | **Notes** | **Parser** |
| --- | --------------------------- | ---------- |
| **Normalized Audit Event Logs** | Any event normalized at ingestion to the `ASimAuditEventLogs` table. | `_Im_AuditEvent_Native` |
| **Azure Activity** | Azure Activity events (in the `AzureActivity` table) in the category `Administrative`. | `_Im_AuditEvent_AzureActivityVxx` |
| **Barracuda CEF** | Barracuda events collected using CEF. | `_Im_AuditEvent_BarracudaCEFVxx` |
| **Barracuda WAF** | Barracuda WAF events. | `_Im_AuditEvent_BarracudaWAFVxx` |
| **Cisco ISE** | Cisco ISE events. | `_Im_AuditEvent_CiscoISEVxx` |
| **Cisco Meraki** | Cisco Meraki events collected using the API connector or Syslog. | `_Im_AuditEvent_CiscoMerakiVxx` |
| **CrowdStrike Falcon** | CrowdStrike Falcon Host events. | `_Im_AuditEvent_CrowdStrikeFalconVxx` |
| **Illumio SaaS Core** | Illumio SaaS Core events. | `_Im_AuditEvent_IllumioSaaSCoreVxx` |
| **Infoblox BloxOne** | Infoblox BloxOne events. | `_Im_AuditEvent_InfobloxBloxOneVxx` |
| **Microsoft Exchange 365** | Exchange Administrative events collected using the Office 365 connector (in the `OfficeActivity` table). | `_Im_AuditEvent_MicrosoftExchangeAdmin365Vxx` |
| **Microsoft Windows Events** | Windows Event 1102 collected using Azure Monitor Agent (using the `SecurityEvent` or `WindowsEvent` tables). | `_Im_AuditEvent_MicrosoftWindowsEventsVxx` |
| **SentinelOne** | SentinelOne events. | `_Im_AuditEvent_SentinelOneVxx` |
| **Vectra XDR** | Vectra XDR audit events. | `_Im_AuditEvent_VectraXDRAuditVxx` |
| **VMware Carbon Black Cloud** | VMware Carbon Black Cloud events. | `_Im_AuditEvent_VMwareCarbonBlackCloudVxx` |

## Authentication parsers

| **Source** | **Notes** | **Parser** |
| --- | --------------------------- | ---------- |
| **Normalized Authentication Logs** | Any event normalized at ingestion to the `ASimAuthenticationEventLogs` table. | `_Im_Authentication_Native` |
| **AWS CloudTrail** | AWS sign-ins, collected using the AWS CloudTrail connector. | `_Im_Authentication_AWSCloudTrailVxx` |
| **Barracuda WAF** | Barracuda WAF events. | `_Im_Authentication_BarracudaWAFVxx` |
| **Cisco ASA** | Cisco ASA events collected using CEF. | `_Im_Authentication_CiscoASAVxx` |
| **Cisco ISE** | Cisco ISE events. | `_Im_Authentication_CiscoISEVxx` |
| **Cisco Meraki** | Cisco Meraki events collected using the API connector or Syslog. | `_Im_Authentication_CiscoMerakiVxx` |
| **CrowdStrike Falcon** | CrowdStrike Falcon Host events. | `_Im_Authentication_CrowdStrikeFalconVxx` |
| **Google Workspace** | Google Workspace sign-ins. | `_Im_Authentication_GoogleWorkspaceVxx` |
| **Illumio SaaS Core** | Illumio SaaS Core events. | `_Im_Authentication_IllumioSaaSCoreVxx` |
| **Microsoft Defender XDR** | Microsoft Defender XDR for Endpoint sign-ins for Windows and Linux. | `_Im_Authentication_M365DefenderVxx` |
| **Microsoft Entra ID** | Microsoft Entra ID sign-ins, collected using the Microsoft Entra connector. Separate parsers for regular, Non-Interactive, Managed Identities, and Service Principal sign-ins. | `_Im_Authentication_AADSigninLogsVxx`<br>`_Im_Authentication_AADNonInteractiveVxx`<br>`_Im_Authentication_AADManagedIdentityVxx`<br>`_Im_Authentication_AADServicePrincipalSignInLogsVxx` |
| **Microsoft Windows Events** | Windows sign-ins (Events 4624, 4625, 4634, 4647) collected using Azure Monitor Agent or the Log Analytics Agent to the `SecurityEvent` or `WindowsEvent` tables. | `_Im_Authentication_MicrosoftWindowsEventVxx` |
| **Okta** | Okta authentication, collected using the Okta connector (V1 OSS and V2). | `_Im_Authentication_OktaOSSVxx`<br>`_Im_Authentication_OktaV2Vxx` |
| **Palo Alto Cortex Data Lake** | Palo Alto Cortex Data Lake events. | `_Im_Authentication_PaloAltoCortexDataLakeVxx` |
| **PostgreSQL** | PostgreSQL sign-in logs. | `_Im_Authentication_PostgreSQLVxx` |
| **Salesforce Service Cloud** | Salesforce Service Cloud events. | `_Im_Authentication_SalesforceSCVxx` |
| **SentinelOne** | SentinelOne events. | `_Im_Authentication_SentinelOneVxx` |
| **Linux Sshd** | Linux sshd activity reported using Syslog. | `_Im_Authentication_SshdVxx` |
| **Linux Su** | Linux su activity reported using Syslog. | `_Im_Authentication_SuVxx` |
| **Linux Sudo** | Linux sudo activity reported using Syslog. | `_Im_Authentication_SudoVxx` |
| **Vectra XDR** | Vectra XDR audit events. | `_Im_Authentication_VectraXDRAuditVxx` |
| **VMware Carbon Black Cloud** | VMware Carbon Black Cloud events. | `_Im_Authentication_VMwareCarbonBlackCloudVxx` |

## DHCP Event parsers

| **Source** | **Notes** | **Parser** |
| --- | --------------------------- | ---------- |
| **Normalized DHCP Event Logs** | Any event normalized at ingestion to the `ASimDhcpEventLogs` table. | `_Im_DhcpEvent_Native` |
| **Infoblox BloxOne** | Infoblox BloxOne DHCP events. | `_Im_DhcpEvent_InfobloxBloxOneVxx` |

## DNS parsers

| **Source** | **Notes** | **Parser** |
| --- | --------------------------- | ---------- |
| **Normalized DNS Logs** | Any event normalized at ingestion to the `ASimDnsActivityLogs` table. The DNS connector for the Azure Monitor Agent uses the `ASimDnsActivityLogs` table. | `_Im_Dns_Native` |
| **Azure Firewall** | Azure Firewall DNS logs. | `_Im_Dns_AzureFirewallVxx` |
| **Cisco Umbrella** | Cisco Umbrella DNS logs. | `_Im_Dns_CiscoUmbrellaVxx` |
| **Corelight Zeek** | Corelight Zeek DNS logs. | `_Im_Dns_CorelightZeekVxx` |
| **Fortinet FortiGate** | Fortinet FortiGate DNS logs. | `_Im_Dns_FortinetFortigateVxx` |
| **GCP DNS** | Google Cloud Platform DNS logs. | `_Im_Dns_GcpVxx` |
| **Infoblox BloxOne** | Infoblox BloxOne DNS events. | `_Im_Dns_InfobloxBloxOneVxx` |
| **Infoblox NIOS** | Infoblox NIOS, BIND, and BlueCat DNS servers. The same parser supports multiple sources. | `_Im_Dns_InfobloxNIOSVxx` |
| **Microsoft DNS Server** | Collected using the DNS connector for the Log Analytics Agent (legacy). | `_Im_Dns_MicrosoftOMSVxx` |
| **Microsoft DNS Server (NXlog)** | Microsoft DNS Server collected using NXlog. | `_Im_Dns_MicrosoftNXlogVxx` |
| **Microsoft Sysmon for Windows** | Sysmon DNS events (Event 22) collected using Azure Monitor Agent or the Log Analytics Agent (legacy) to the `Event` or `WindowsEvent` tables. | `_Im_Dns_MicrosoftSysmonVxx` |
| **SentinelOne** | SentinelOne DNS events. | `_Im_Dns_SentinelOneVxx` |
| **Vectra AI** | Vectra AI DNS events. | `_Im_Dns_VectraAIVxx` |
| **Zscaler ZIA** | Zscaler ZIA DNS logs. | `_Im_Dns_ZscalerZIAVxx` |

## File Activity parsers

| **Source** | **Notes** | **Parser** |
| --- | --------------------------- | ---------- |
| **Normalized File Event Logs** | Any event normalized at ingestion to the `ASimFileEventLogs` table. | `_Im_FileEvent_Native` |
| **Azure Blob Storage** | Azure Blob Storage file events. | `_Im_FileEvent_AzureBlobStorageVxx` |
| **Azure File Storage** | Azure File Storage events. | `_Im_FileEvent_AzureFileStorageVxx` |
| **Azure Queue Storage** | Azure Queue Storage events. | `_Im_FileEvent_AzureQueueStorageVxx` |
| **Azure Table Storage** | Azure Table Storage events. | `_Im_FileEvent_AzureTableStorageVxx` |
| **Google Workspace** | Google Workspace file events. | `_Im_FileEvent_GoogleWorkspaceVxx` |
| **Linux Sysmon** | Sysmon for Linux file created and deleted events (Events 11, 23). | `_Im_FileEvent_LinuxSysmonFileCreatedVxx`<br>`_Im_FileEvent_LinuxSysmonFileDeletedVxx` |
| **Microsoft Defender XDR** | Microsoft Defender XDR for Endpoint file events. | `_Im_FileEvent_Microsoft365DVxx` |
| **Microsoft Security Events** | Windows file events (Event 4663) collected using the Security Events connector. | `_Im_FileEvent_MicrosoftSecurityEventsVxx` |
| **Microsoft SharePoint** | Microsoft Office 365 SharePoint and OneDrive events, collected using the Office Activity connector. | `_Im_FileEvent_MicrosoftSharePointVxx` |
| **Microsoft Sysmon for Windows** | Sysmon for Windows file events (Events 11, 23, 26) collected to the `Event` or `WindowsEvent` tables. | `_Im_FileEvent_MicrosoftSysmonVxx` |
| **Microsoft Windows Events** | Windows file events (Event 4663) collected to the `WindowsEvent` table. | `_Im_FileEvent_MicrosoftWindowsEventsVxx` |
| **SentinelOne** | SentinelOne file events. | `_Im_FileEvent_SentinelOneVxx` |
| **VMware Carbon Black Cloud** | VMware Carbon Black Cloud file events. | `_Im_FileEvent_VMwareCarbonBlackCloudVxx` |

## Network Session parsers

| **Source** | **Notes** | **Parser** |
| --- | --------------------------- | ---------- |
| **Normalized Network Session Logs** | Any event normalized at ingestion to the `ASimNetworkSessionLogs` table. The Firewall connector for the Azure Monitor Agent uses this table. | `_Im_NetworkSession_Native` |
| **AppGate SDP** | IP connection logs collected using Syslog. | `_Im_NetworkSession_AppGateSDPVxx` |
| **AWS VPC logs** | Collected using the AWS S3 connector. | `_Im_NetworkSession_AWSVPCVxx` |
| **Azure Firewall** | Azure Firewall network logs. | `_Im_NetworkSession_AzureFirewallVxx` |
| **Azure NSG** | Azure Network Security Groups flow logs. | `_Im_NetworkSession_AzureNSGVxx` |
| **Azure Monitor VMConnection** | Collected as part of the Azure Monitor VM Insights solution. | `_Im_NetworkSession_VMConnectionVxx` |
| **Barracuda CEF** | Barracuda events collected using CEF. | `_Im_NetworkSession_BarracudaCEFVxx` |
| **Barracuda WAF** | Barracuda WAF events. | `_Im_NetworkSession_BarracudaWAFVxx` |
| **Checkpoint Firewall** | Checkpoint Firewall events collected using CEF. | `_Im_NetworkSession_CheckPointFirewallVxx` |
| **Cisco ASA** | Cisco ASA events collected using CEF. | `_Im_NetworkSession_CiscoASAVxx` |
| **Cisco Firepower** | Cisco Firepower events. | `_Im_NetworkSession_CiscoFirepowerVxx` |
| **Cisco ISE** | Cisco ISE events. | `_Im_NetworkSession_CiscoISEVxx` |
| **Cisco Meraki** | Cisco Meraki events collected using the API connector or Syslog. | `_Im_NetworkSession_CiscoMerakiVxx` |
| **Corelight Zeek** | Corelight Zeek network events. | `_Im_NetworkSession_CorelightZeekVxx` |
| **CrowdStrike Falcon** | CrowdStrike Falcon Host events. | `_Im_NetworkSession_CrowdStrikeFalconVxx` |
| **ForcePoint Firewall** | ForcePoint Firewall events. | `_Im_NetworkSession_ForcePointFirewallVxx` |
| **Fortinet FortiGate** | Fortinet FortiGate firewall events collected using Syslog. | `_Im_NetworkSession_FortinetFortiGateVxx` |
| **Illumio SaaS Core** | Illumio SaaS Core events. | `_Im_NetworkSession_IllumioSaaSCoreVxx` |
| **Microsoft Defender for IoT** | Microsoft Defender for IoT micro agent and sensor events. | `_Im_NetworkSession_MD4IoTAgentVxx`<br>`_Im_NetworkSession_MD4IoTSensorVxx` |
| **Microsoft Defender XDR** | Microsoft Defender XDR for Endpoint network events. | `_Im_NetworkSession_Microsoft365DefenderVxx` |
| **Microsoft Sysmon for Linux** | Sysmon for Linux network events (Event 3). | `_Im_NetworkSession_MicrosoftLinuxSysmonVxx` |
| **Microsoft Sysmon for Windows** | Sysmon for Windows network events (Event 3) collected to the `Event` or `WindowsEvent` tables. | `_Im_NetworkSession_MicrosoftSysmonVxx` |
| **Microsoft Windows Firewall** | Windows Firewall events (Events 5150-5159) collected using Azure Monitor Agent or the Log Analytics Agent. | `_Im_NetworkSession_MicrosoftWindowsEventFirewallVxx` |
| **Microsoft Windows Security Events Firewall** | Windows Firewall events collected via Security Events connector. | `_Im_NetworkSession_MicrosoftSecurityEventFirewallVxx` |
| **NTA NetAnalytics** | Network Traffic Analytics events. | `_Im_NetworkSession_NTANetAnalyticsVxx` |
| **Palo Alto PanOS** | Palo Alto PanOS traffic logs collected using CEF. | `_Im_NetworkSession_PaloAltoCEFVxx` |
| **Palo Alto Cortex Data Lake** | Palo Alto Cortex Data Lake events. | `_Im_NetworkSession_PaloAltoCortexDataLakeVxx` |
| **SentinelOne** | SentinelOne network events. | `_Im_NetworkSession_SentinelOneVxx` |
| **SonicWall Firewall** | SonicWall Firewall events. | `_Im_NetworkSession_SonicWallFirewallVxx` |
| **Vectra AI** | Vectra AI network events. Supports the pack parameter. | `_Im_NetworkSession_VectraAIVxx` |
| **VMware Carbon Black Cloud** | VMware Carbon Black Cloud network events. | `_Im_NetworkSession_VMwareCarbonBlackCloudVxx` |
| **WatchGuard Fireware OS** | WatchGuard Fireware OS events collected using Syslog. | `_Im_NetworkSession_WatchGuardFirewareOSVxx` |
| **Zscaler ZIA** | Zscaler ZIA firewall logs collected using CEF. | `_Im_NetworkSession_ZscalerZIAVxx` |

## Process Event parsers

| **Source** | **Notes** | **Parser** |
| --- | --------------------------- | ---------- |
| **Normalized Process Event Logs** | Any event normalized at ingestion to the `ASimProcessEventLogs` table. | `_Im_ProcessEvent_Native` |
| **Linux Sysmon** | Sysmon for Linux process creation events (Event 1). | `_Im_ProcessCreate_LinuxSysmonVxx` |
| **Microsoft Defender for IoT** | Microsoft Defender for IoT process events. | `_Im_ProcessEvent_MD4IoTVxx` |
| **Microsoft Defender XDR** | Microsoft Defender XDR for Endpoint process events. | `_Im_ProcessEvent_Microsoft365DVxx` |
| **Microsoft Security Events** | Windows Security Events process creation and termination (Events 4688, 4689). | `_Im_ProcessCreate_MicrosoftSecurityEventsVxx`<br>`_Im_ProcessTerminate_MicrosoftSecurityEventsVxx` |
| **Microsoft Sysmon for Windows** | Sysmon for Windows process events (Events 1, 5) collected to the `Event` or `WindowsEvent` tables. | `_Im_ProcessCreate_MicrosoftSysmonVxx`<br>`_Im_ProcessTerminate_MicrosoftSysmonVxx` |
| **Microsoft Windows Events** | Windows process events collected to the `WindowsEvent` table. | `_Im_ProcessCreate_MicrosoftWindowsEventsVxx`<br>`_Im_ProcessTerminate_MicrosoftWindowsEventsVxx` |
| **SentinelOne** | SentinelOne process events. | `_Im_ProcessCreate_SentinelOneVxx` |
| **Trend Micro Vision One** | Trend Micro Vision One process events. | `_Im_ProcessCreate_TrendMicroVisionOneVxx` |
| **VMware Carbon Black Cloud** | VMware Carbon Black Cloud process events. | `_Im_ProcessCreate_VMwareCarbonBlackCloudVxx`<br>`_Im_ProcessTerminate_VMwareCarbonBlackCloudVxx` |

## Registry Event parsers

| **Source** | **Notes** | **Parser** |
| --- | --------------------------- | ---------- |
| **Normalized Registry Event Logs** | Any event normalized at ingestion to the `ASimRegistryEventLogs` table. | `_Im_RegistryEvent_Native` |
| **Microsoft Defender XDR** | Microsoft Defender XDR for Endpoint registry events. | `_Im_RegistryEvent_Microsoft365DVxx` |
| **Microsoft Security Events** | Windows Security Events registry events (Events 4657, 4663). | `_Im_RegistryEvent_MicrosoftSecurityEventVxx` |
| **Microsoft Sysmon for Windows** | Sysmon for Windows registry events (Events 12, 13, 14) collected to the `Event` or `WindowsEvent` tables. | `_Im_RegistryEvent_MicrosoftSysmonVxx` |
| **Microsoft Windows Events** | Windows registry events collected to the `WindowsEvent` table. | `_Im_RegistryEvent_MicrosoftWindowsEventVxx` |
| **SentinelOne** | SentinelOne registry events. | `_Im_RegistryEvent_SentinelOneVxx` |
| **Trend Micro Vision One** | Trend Micro Vision One registry events. | `_Im_RegistryEvent_TrendMicroVisionOneVxx` |
| **VMware Carbon Black Cloud** | VMware Carbon Black Cloud registry events. | `_Im_RegistryEvent_VMwareCarbonBlackCloudVxx` |

## User Management parsers

| **Source** | **Notes** | **Parser** |
| --- | --------------------------- | ---------- |
| **Normalized User Management Logs** | Any event normalized at ingestion to the `ASimUserManagementLogs` table. | `_Im_UserManagement_Native` |
| **Cisco ISE** | Cisco ISE user management events. | `_Im_UserManagement_CiscoISEVxx` |
| **Linux Authpriv** | Linux authpriv user management events. | `_Im_UserManagement_LinuxAuthprivVxx` |
| **Microsoft Security Events** | Windows Security Events user management events. | `_Im_UserManagement_MicrosoftSecurityEventVxx` |
| **Microsoft Windows Events** | Windows user management events collected to the `WindowsEvent` table. | `_Im_UserManagement_MicrosoftWindowsEventVxx` |
| **SentinelOne** | SentinelOne user management events. | `_Im_UserManagement_SentinelOneVxx` |

## Web Session parsers

| **Source** | **Notes** | **Parser** |
| --- | --------------------------- | ---------- |
| **Normalized Web Session Logs** | Any event normalized at ingestion to the `ASimWebSessionLogs` table. | `_Im_WebSession_Native` |
| **Apache HTTP Server** | Apache HTTP Server logs. | `_Im_WebSession_ApacheHTTPServerVxx` |
| **Azure Firewall** | Azure Firewall web session logs. | `_Im_WebSession_AzureFirewallVxx` |
| **Barracuda CEF** | Barracuda events collected using CEF. | `_Im_WebSession_BarracudaCEFVxx` |
| **Barracuda WAF** | Barracuda WAF events. | `_Im_WebSession_BarracudaWAFVxx` |
| **Cisco Firepower** | Cisco Firepower web events. | `_Im_WebSession_CiscoFirepowerVxx` |
| **Cisco Meraki** | Cisco Meraki web events. | `_Im_WebSession_CiscoMerakiVxx` |
| **Citrix NetScaler** | Citrix NetScaler web events. | `_Im_WebSession_CitrixNetScalerVxx` |
| **F5 ASM** | F5 ASM web events. | `_Im_WebSession_F5ASMVxx` |
| **Fortinet FortiGate** | Fortinet FortiGate web session logs. | `_Im_WebSession_FortinetFortiGateVxx` |
| **Internet Information Services (IIS)** | IIS logs collected using Azure Monitor Agent or Log Analytics Agent. | `_Im_WebSession_IISVxx` |
| **Palo Alto PanOS** | Palo Alto PanOS threat logs collected using CEF. | `_Im_WebSession_PaloAltoCEFVxx` |
| **Palo Alto Cortex Data Lake** | Palo Alto Cortex Data Lake events. | `_Im_WebSession_PaloAltoCortexDataLakeVxx` |
| **SonicWall Firewall** | SonicWall Firewall web events. | `_Im_WebSession_SonicWallFirewallVxx` |
| **Squid Proxy** | Squid Proxy web logs. | `_Im_WebSession_SquidProxyVxx` |
| **Vectra AI** | Vectra AI web events. Supports the pack parameter. | `_Im_WebSession_VectraAIVxx` |
| **Zscaler ZIA** | Zscaler ZIA web logs collected using CEF. | `_Im_WebSession_ZscalerZIAVxx` |

## <a name="next-steps"></a>Next steps

Learn more about ASIM parsers:

- [Use ASIM parsers](normalization-about-parsers.md)
- [Develop custom ASIM parsers](normalization-develop-parsers.md)
- [Manage ASIM parsers](normalization-manage-parsers.md)

Learn more about ASIM: 

- Watch the [Deep Dive Webinar on Microsoft Sentinel Normalizing Parsers and Normalized Content](https://www.youtube.com/watch?v=zaqblyjQW6k) or review the [slides](https://1drv.ms/b/s!AnEPjr8tHcNmjGtoRPQ2XYe3wQDz?e=R3dWeM)
- [Advanced Security Information Model (ASIM) overview](normalization.md)
- [Advanced Security Information Model (ASIM) schemas](normalization-about-schemas.md)
- [Advanced Security Information Model (ASIM) content](normalization-content.md)