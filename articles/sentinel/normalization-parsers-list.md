---
title: List of Microsoft Sentinel Advanced Security Information Model (ASIM) parsers | Microsoft Docs
description: This article lists Advanced Security Information Model (ASIM) parsers.
author: oshezaf
ms.topic: reference
ms.date: 05/02/2022
ms.author: ofshezaf
--- 

# List of Microsoft Sentinel Advanced Security Information Model (ASIM) parsers (Public preview)

This document provides a list of Advanced Security Information Model (ASIM) parsers. For an overview of ASIM parsers refer to the [parsers overview](normalization-parsers-overview.md). To understand how parsers fit within the ASIM architecture, refer to the [ASIM architecture diagram](normalization.md#asim-components).

> [!IMPORTANT]
> ASIM is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>
## Audit event parsers

To use ASIM audit event parsers, deploy the parsers from the [Microsoft Sentinel GitHub repository](https://aka.ms/ASimAuditEvent). Microsoft Sentinel provides the following parsers in the packages deployed from GitHub:


| **Source** | **Notes** | **Parser**
| --- | --------------------------- | ---------- |
| **Azure Activity administrative events** | Azure Activity events (in the `AzureActivity` table) in the category `Administrative`. | `ASimAuditEventAzureActivity` |
| **Exchange 365 administrative events** | Exchange Administrative events collected using the Office 365 connector (in the `OfficeActivity` table). | `ASimAuditEventMicrosoftOffice365` |
| **Windows Log clear event** | Windows Event 1102 collected using the Log Analytics agent Security Events connector or the Azure monitor agent Security Events and WEF connectors (using the `SecurityEvent`, `WindowsEvent`, or `Event` tables). | `ASimAuditEventMicrosoftWindowsEvents` |
 
## Authentication parsers

To use ASIM authentication parsers, deploy the parsers from the [Microsoft Sentinel GitHub repository](https://aka.ms/ASimAuthentication). Microsoft Sentinel provides the following parsers in the packages deployed from GitHub:

- **Windows sign-ins**
    - Collected using the Log Analytics Agent or Azure Monitor Agent.
    - Collected using either the Security Events connectors to the SecurityEvent table or using the WEF connector to the WindowsEvent table.
    - Reported as Security Events (4624, 4625, 4634, and 4647).
    - reported by Microsoft 365 Defender for Endpoint, collected using the Microsoft 365 Defender connector.
- **Linux sign-ins** 
    - reported by Microsoft 365 Defender for Endpoint, collected using the Microsoft 365 Defender connector.
    - `su`, `sudu`, and `sshd` activity reported using Syslog.
    - reported by Microsoft Defender to IoT Endpoint.
- **Azure Active Directory sign-ins**, collected using the Azure Active Directory connector. Separate parsers are provided for regular, Non-Interactive, Managed Identities and Service Principles Sign-ins.
- **AWS sign-ins**, collected using the AWS CloudTrail connector.
- **Okta authentication**, collected using the Okta connector.
- **PostgreSQL** sign-in logs.


## DNS parsers

ASIM DNS parsers are available in every workspace. Microsoft Sentinel provides the following out-of-the-box parsers:

| **Source** | **Notes** | **Parser**
| --- | --------------------------- | ---------- |
| **Normalized DNS Logs** | Any event normalized at ingestion to the `ASimDnsActivityLogs` table. The DNS connector for the Azure Monitor Agent uses the `ASimDnsActivityLogs` table and is supported by the `_Im_Dns_Native` parser. | `_Im_Dns_Native` |
| **Azure Firewall** | | `_Im_Dns_AzureFirewallVxx` |
| **Cisco Umbrella**  | | `_Im_Dns_CiscoUmbrellaVxx` |
| **Corelight Zeek** | | `_Im_Dns_CorelightZeekVxx` |
| **GCP DNS** | | `_Im_Dns_GcpVxx` |
| - **Infoblox NIOS**<br> - **BIND**<br> - **BlucCat** | The same parsers support multiple sources. | `_Im_Dns_InfobloxNIOSVxx` |
| **Microsoft DNS Server** | Collected using:<br>- DNS connector for the Log Analytics Agent<br>- DNS connector for the Azure Monitor Agent<br>- NXlog | <br>`_Im_Dns_MicrosoftOMSVxx`<br>See Normalized DNS logs.<br>`_Im_Dns_MicrosoftNXlogVxx` | 
| **Sysmon for Windows**  (event 22) | Collected using:<br>- the Log Analytics Agent<br>- the Azure Monitor Agent<br><br>For both agents, both collecting to the<br> `Event` and `WindowsEvent` tables are supported. | `_Im_Dns_MicrosoftSysmonVxx` |
| **Vectra AI** | |`_Im_Dns_VectraIAVxx`  |
| **Zscaler ZIA** | | `_Im_Dns_ZscalerZIAVxx` |
||||

Deploy the workspace deployed parsers version from the [Microsoft Sentinel GitHub repository](https://aka.ms/AsimDNS).

## File Activity parsers

To use ASIM File Activity parsers, deploy the parsers from the [Microsoft Sentinel GitHub repository](https://aka.ms/ASimFileEvent). Microsoft Sentinel provides the following parsers in the packages deployed from GitHub:


- **Windows file activity**
    - Reported by **Windows (event 4663)**:
        - Collected using the Log Analytics Agent based Security Events connector to the SecurityEvent table.
        - Collected using the Azure Monitor Agent based Security Events connector to the SecurityEvent table.
        - Collected using the Azure Monitor Agent based WEF (Windows Event Forwarding) connector to the WindowsEvent table.
    - Reported using **Sysmon file activity events** (Events 11, 23, and 26):
        - Collected using the Log Analytics Agent to the Event table.
        - Collected using the Azure Monitor Agent based WEF (Windows Event Forwarding) connector to the WindowsEvent table.
    - Reported by **Microsoft 365 Defender for Endpoint**, collected using the Microsoft 365 Defender connector.
- **Microsoft Office 365 SharePoint and OneDrive events**, collected using the Office Activity connector.
- **Azure Storage**, including Blob, File, Queue, and Table Storage.

## Network Session parsers

ASIM Network Session parsers are available in every workspace. Microsoft Sentinel provides the following out-of-the-box parsers:


| **Source** | **Notes** | **Parser** | 
| --- | --------------------------- | ------------------------------ | 
| **Normalized Network Session Logs** | Any event normalized at ingestion to the `ASimNetworkSessionLogs` table. The Firewall connector for the Azure Monitor Agent uses the `ASimNetworkSessionLogs` table and is supported by the `_Im_NetworkSession_Native` parser. | `_Im_NetworkSession_Native` |
| **AppGate SDP** | IP connection logs collected using Syslog. | `_Im_NetworkSession_AppGateSDPVxx` |
| **AWS VPC logs** | Collected using the AWS S3 connector. | `_Im_NetworkSession_AWSVPCVxx` |
| **Azure Firewall logs** | |`_Im_NetworkSession_AzureFirewallVxx`|
| **Azure Monitor VMConnection** | Collected as part of the Azure Monitor [VM Insights solution](../azure-monitor/vm/vminsights-overview.md). | `_Im_NetworkSession_VMConnectionVxx`  |
| **Azure Network Security Groups (NSG) logs** | Collected as part of the Azure Monitor [VM Insights solution](../azure-monitor/vm/vminsights-overview.md). | `_Im_NetworkSession_AzureNSGVxx` |
| **Checkpoint Firewall-1** | Collected using CEF. | `_Im_NetworkSession_CheckPointFirewallVxx` |
| **Cisco ASA** | Collected using the CEF connector. | `_Im_NetworkSession_CiscoASAVxx` |
| **Cisco Meraki** | Collected using the Cisco Meraki API connector. | `_Im_NetworkSession_CiscoMerakiVxx` |
| **Corelight Zeek** | Collected using the Corelight Zeek connector. | `_im_NetworkSession_CorelightZeekVxx` |
| **Fortigate FortiOS** | IP connection logs collected using Syslog. | `_Im_NetworkSession_FortinetFortiGateVxx` |
| **ForcePoint Firewall** | | `_Im_NetworkSession_ForcePointFirewallVxx` |    
| **Microsoft 365 Defender for Endpoint** | | `_Im_NetworkSession_Microsoft365DefenderVxx`|
| **Microsoft Defender for IoT micro agent** | | `_Im_NetworkSession_MD4IoTAgentVxx` |
| **Microsoft Defender for IoT sensor** | | `_Im_NetworkSession_MD4IoTSensorVxx` |
| **Palo Alto PanOS traffic logs** | Collected using CEF. | `_Im_NetworkSession_PaloAltoCEFVxx` |
| **Sysmon for Linux**  (event 3) | Collected using the Log Analytics Agent<br> or the Azure Monitor Agent. |`_Im_NetworkSession_LinuxSysmonVxx`  |
| **Vectra AI** | Supports the [pack](normalization-about-parsers.md#the-pack-parameter) parameter. | `_Im_NetworkSession_VectraIAVxx`  |
| **Windows Firewall logs** | Collected as Windows events using the Log Analytics Agent (Event table) or Azure Monitor Agent (WindowsEvent table). Supports Windows events 5150 to 5159. | `_Im_NetworkSession_MicrosoftWindowsEventFirewallVxx`|
| **Watchguard FirewareOW** | Collected using Syslog. | `_Im_NetworkSession_WatchGuardFirewareOSVxx` |
| **Zscaler ZIA firewall logs** | Collected using CEF. | `_Im_NetworkSessionZscalerZIAVxx` |

Deploy the workspace deployed parsers version from the [Microsoft Sentinel GitHub repository](https://aka.ms/AsimNetworkSession).

## Process Event parsers

To use ASIM Process Event parsers, deploy the parsers from the [Microsoft Sentinel GitHub repository](https://aka.ms/AsimProcessEvent). Microsoft Sentinel provides the following parsers in the packages deployed from GitHub:

- **Security Events process creation (Event 4688)**, collected using the Log Analytics Agent or Azure Monitor Agent
- **Security Events process termination (Event 4689)**, collected using the Log Analytics Agent or Azure Monitor Agent
- **Sysmon process creation (Event 1)**, collected using the Log Analytics Agent or Azure Monitor Agent
- **Sysmon process termination (Event 5)**, collected using the Log Analytics Agent or Azure Monitor Agent
- **Microsoft 365 Defender for Endpoint process creation**

## Registry Event parsers

To use ASIM Registry Event parsers, deploy the parsers from the [Microsoft Sentinel GitHub repository](https://aka.ms/AsimRegistryEvent). Microsoft Sentinel provides the following parsers in the packages deployed from GitHub:

- **Security Events registry update (Events 4657 and 4663)**, collected using the Log Analytics Agent or Azure Monitor Agent
- **Sysmon registry monitoring events (Events 12, 13, and 14)**, collected using the Log Analytics Agent or Azure Monitor Agent
- **Microsoft 365 Defender for Endpoint registry events**

## Web Session parsers

ASIM Web Session parsers are available in every workspace. Microsoft Sentinel provides the following out-of-the-box parsers:


| **Source** | **Notes** | **Parser** | 
| --- | --------------------------- | ------------------------------ | 
| **Normalized Web Session Logs** | Any event normalized at ingestion to the `ASimWebSessionLogs` table. | `_Im_WebSession_NativeVxx` |
| **Internet Information Services (IIS) Logs** | Collected using the AMA or Log Analytics Agent based IIS connectors. | `_Im_WebSession_IISVxx` |
| **Palo Alto PanOS threat logs** | Collected using CEF. | `_Im_WebSession_PaloAltoCEFVxx` |
| **Squid Proxy** | | `_Im_WebSession_SquidProxyVxx` |
| **Vectra AI Streams** | Supports the [pack](normalization-about-parsers.md#the-pack-parameter) parameter. | `_Im_WebSession_VectraAIVxx`  |
| **Zscaler ZIA** | Collected using CEF. | `_Im_WebSessionZscalerZIAVxx` |

Deploy the workspace deployed parsers version from the [Microsoft Sentinel GitHub repository](https://aka.ms/DeployASIM).

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
