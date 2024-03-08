---
title: Advanced Security Information Model (ASIM) security content | Microsoft Docs
description: This article outlines the Microsoft Sentinel security content that uses the Advanced Security Information Model (ASIM).
author: oshezaf
ms.topic: reference
ms.date: 11/09/2021
ms.author: ofshezaf
---

# Advanced Security Information Model (ASIM) security content  (Public preview)

Normalized security content in Microsoft Sentinel includes analytics rules, hunting queries, and workbooks that work with unifying normalization parsers.

<a name="builtin"></a>You can find normalized, built-in content in Microsoft Sentinel galleries and [solutions](sentinel-solutions-catalog.md), create your own normalized content, or modify existing content to use normalized data.

This article lists built-in Microsoft Sentinel content that has been configured to support the Advanced Security Information Model (ASIM).  While links to the Microsoft Sentinel GitHub repository are provided below as a reference, you can also find these rules in the [Microsoft Sentinel Analytics rule gallery](detect-threats-built-in.md). Use the linked GitHub pages to copy any relevant hunting queries.

To understand how normalized content fits within the ASIM architecture, refer to the [ASIM architecture diagram](normalization.md#asim-components).

> [!TIP]
> Also watch the [Deep Dive Webinar on Microsoft Sentinel Normalizing Parsers and Normalized Content](https://www.youtube.com/watch?v=zaqblyjQW6k) or review the [slides](https://1drv.ms/b/s!AnEPjr8tHcNmjGtoRPQ2XYe3wQDz?e=R3dWeM). For more information, see [Next steps](#next-steps).
>

> [!IMPORTANT]
> ASIM is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Authentication security content

The following built-in authentication content is supported for ASIM normalization.

### Analytics rules

 - [Potential Password Spray Attack (Uses Authentication Normalization)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimAuthentication/imAuthPasswordSpray.yaml)
 - [Brute force attack against user credentials (Uses Authentication Normalization)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimAuthentication/imAuthBruteForce.yaml)
 - [User login from different countries within 3 hours (Uses Authentication Normalization)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimAuthentication/imAuthSigninsMultipleCountries.yaml)
 - [Sign-ins from IPs that attempt sign-ins to disabled accounts (Uses Authentication Normalization)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimAuthentication/imSigninAttemptsByIPviaDisabledAccounts.yaml)


## DNS query security content

The following built-in DNS query content is supported for ASIM normalization.

### Solutions

- [DNS Essentials](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-dns-domain?tab=Overview)
- [Log4j Vulnerability Detection](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-apachelog4jvulnerability?tab=Overview)
- [Legacy IOC Based Threat Detection](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-ioclegacy?tab=Overview)

### Analytics rules

 - [(Preview) TI map Domain entity to DNS Events (ASIM DNS Schema)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimDNS/imDns_DomainEntity_DnsEvents.yaml)
 - [(Preview) TI map IP entity to DNS Events (ASIM DNS Schema)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimDNS/imDns_IPEntity_DnsEvents.yaml)
 - [Potential DGA detected (ASimDNS)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimDNS/imDns_HighNXDomainCount_detection.yaml)
  - [Excessive NXDOMAIN DNS Queries (ASIM DNS Schema)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimDNS/imDns_ExcessiveNXDOMAINDNSQueries.yaml)
 - [DNS events related to mining pools (ASIM DNS Schema)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimDNS/imDNS_Miners.yaml)
 - [DNS events related to ToR proxies (ASIM DNS Schema)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimDNS/imDNS_TorProxies.yaml)
 - [Known Barium domains](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/BariumDomainIOC112020.yaml)
 - [Known Barium IP addresses](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/BariumIPIOC112020.yaml) 
 - [Exchange Server Vulnerabilities Disclosed March 2021 IoC Match](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/ExchangeServerVulnerabilitiesMarch2021IoCs.yaml)
 - [Known Granite Typhoon domains and hashes](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/GraniteTyphoonIOCs.yaml)
 - [Known Seashell Blizzard IP](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/SeashellBlizzardIOCs.yaml)
 - [Midnight Blizzard - Domain and IP IOCs - March 2021](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/MidnightBlizzard_DomainIOCsMarch2021.yaml)
 - [Known Phosphorus group domains/IP](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/PHOSPHORUSMarch2019IOCs.yaml)
 - [Known Forest Blizzard group domains - July 2019](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/ForestBlizzardJuly2019IOCs.yaml)
 - [Solorigate Network Beacon](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/Solorigate-Network-Beacon.yaml)
 - [Emerald Sleet domains included in DCU takedown](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/EmeraldSleetIOCs.yaml)
 - [Known Diamond Sleet Comebacker and Klackring malware hashes](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/DiamondSleetJan272021IOCs.yaml)
 - [Known Ruby Sleet domains and hashes](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/RubySleetOct292020IOCs.yaml)
 - [Known NICKEL domains and hashes](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/NylonTyphoonIOCsNov2021.yaml)
 - [Midnight Blizzard - Domain, Hash and IP IOCs - May 2021](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/MidnightBlizzard_IOCsMay2021.yaml)
 - [Solorigate Network Beacon](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/Solorigate-Network-Beacon.yaml)

## File Activity security content

The following built-in file activity content is supported for ASIM normalization.

- [Legacy IOC Based Threat Detection](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-ioclegacy?tab=Overview)

### Analytics Rules

- [SUNBURST and SUPERNOVA backdoor hashes (Normalized File Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimFileEvent/imFileESolarWindsSunburstSupernova.yaml)
- [Exchange Server Vulnerabilities Disclosed March 2021 IoC Match](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/ExchangeServerVulnerabilitiesMarch2021IoCs.yaml)
- [Silk Typhoon UM Service writing suspicious file](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/SilkTyphoonUmServiceSuspiciousFile.yaml)
- [Midnight Blizzard - Domain, Hash and IP IOCs - May 2021](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/MidnightBlizzard_IOCsMay2021.yaml)
- [SUNSPOT log file creation ](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/SUNSPOTLogFile.yaml)
- [Known Diamond Sleet Comebacker and Klackring malware hashes](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/DiamondSleetJan272021IOCs.yaml)
- [Cadet Blizzard Actor IOC - January 2022](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/CadetBlizzard_Jan2022_IOC.yaml)
- [Midnight Blizzard IOCs related to FoggyWeb backdoor](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/MidnightBlizzard_FoggyWeb.yaml)

## Network session security content

The following built-in network session related content is supported for ASIM normalization.

### Solutions

- [Network Session Essentials](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-networksession?tab=Overview)
- [Log4j Vulnerability Detection](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-apachelog4jvulnerability?tab=Overview)
- [Legacy IOC Based Threat Detection](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-ioclegacy?tab=Overview)

### Analytics rules

- [Log4j vulnerability exploit aka Log4Shell IP IOC](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Apache%20Log4j%20Vulnerability%20Detection/Analytic%20Rules/Log4J_IPIOC_Dec112021.yaml)
- [Excessive number of failed connections from a single source (ASIM Network Session schema)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimNetworkSession/ExcessiveHTTPFailuresFromSource.yaml)
- [Potential beaconing activity (ASIM Network Session schema)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimNetworkSession/PossibleBeaconingActivity.yaml)
- [(Preview) TI map IP entity to Network Session Events (ASIM Network Session schema)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimNetworkSession/IPEntity_imNetworkSession.yaml)
- [Port scan detected  (ASIM Network Session schema)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimNetworkSession/PortScan.yaml)
- [Known Barium IP addresses](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/BariumIPIOC112020.yaml) 
- [Exchange Server Vulnerabilities Disclosed March 2021 IoC Match](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/ExchangeServerVulnerabilitiesMarch2021IoCs.yaml)
- [Known Seashell Blizzard IP(https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/SeashellBlizzardIOCs.yaml)
- [Midnight Blizzard - Domain, Hash and IP IOCs - May 2021](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/MidnightBlizzard_IOCsMay2021.yaml)
- [Known Forest Blizzard group domains - July 2019](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/ForestBlizzardJuly2019IOCs.yaml)


### Hunting queries

- [Connection from external IP to OMI related Ports](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/MultipleDataSources/NetworkConnectiontoOMIPorts.yaml)

## Process activity security content

The following built-in process activity content is supported for ASIM normalization.

### Solutions

- [Endpoint Threat Protection Essentials](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-endpointthreat?tab=Overview)
- [Legacy IOC Based Threat Detection](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-ioclegacy?tab=Overview)

### Analytics rules

 - [Probable AdFind Recon Tool Usage (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimProcess/imProcess_AdFind_Usage.yaml)
 - [Base64 encoded Windows process command-lines (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimProcess/imProcess_base64_encoded_pefile.yaml)
 - [Malware in the recycle bin (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimProcess/imProcess_malware_in_recyclebin.yaml)
 - [Midnight Blizzard - suspicious rundll32.exe execution of vbscript (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimProcess/imProcess_MidnightBlizzard_SuspiciousRundll32Exec.yaml)
 - [SUNBURST suspicious SolarWinds child processes (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimProcess/imProcess_SolarWinds_SUNBURST_Process-IOCs.yaml)

### Hunting queries

 - [Cscript script daily summary breakdown (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_cscript_summary.yaml)
 - [Enumeration of users and groups (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_enumeration_user_and_group.yaml)
 - [Exchange PowerShell Snapin Added (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_ExchangePowerShellSnapin.yaml)
 - [Host Exporting Mailbox and Removing Export (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_HostExportingMailboxAndRemovingExport.yaml)
 - [Invoke-PowerShellTcpOneLine Usage (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_Invoke-PowerShellTcpOneLine.yaml)
 - [Nishang Reverse TCP Shell in Base64 (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_NishangReverseTCPShellBase64.yaml)
 - [Summary of users created using uncommon/undocumented commandline switches (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_persistence_create_account.yaml)
 - [Powercat Download (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_PowerCatDownload.yaml)
 - [PowerShell downloads (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_powershell_downloads.yaml)
 - [Entropy for Processes for a given Host (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_ProcessEntropy.yaml)
 - [SolarWinds Inventory (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_SolarWindsInventory.yaml)
 - [Suspicious enumeration using Adfind tool (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_Suspicious_enumeration_using_adfind.yaml)
 - [Windows System Shutdown/Reboot (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_Windows%20System%20Shutdown-Reboot(T1529).yaml)
 - [Certutil (LOLBins and LOLScripts, Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_Certutil-LOLBins.yaml)
 - [Rundll32 (LOLBins and LOLScripts, Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/inProcess_SignedBinaryProxyExecutionRundll32.yaml)
 - [Uncommon processes - bottom 5% (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_uncommon_processes.yaml)
 - [Unicode Obfuscation in Command Line](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/MultipleDataSources/UnicodeObfuscationInCommandLine.yaml)

## Registry activity security content

The following built-in registry activity content is supported for ASIM normalization.

### Analytics rules

- [Potential Fodhelper UAC Bypass (ASIM Version)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/PotentialFodhelperUACBypass(ASIMVersion).yaml)

### Hunting queries

- [Persisting Via IFEO Registry Key](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/MultipleDataSources/PersistViaIFEORegistryKey.yaml)

## Web session security content

The following built-in web session related content is supported for ASIM normalization.

### Solutions

- [Log4j Vulnerability Detection](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-apachelog4jvulnerability?tab=Overview)
- [Threat Intelligence](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-threatintelligence-taxii?tab=Overview)

### Analytics rules

- [(Preview) TI map Domain entity to Web Session Events (ASIM Web Session schema)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ThreatIntelligenceIndicator/DomainEntity_imWebSession.yaml)
- [(Preview) TI map IP entity to Web Session Events (ASIM Web Session schema)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ThreatIntelligenceIndicator/IPEntity_imWebSession.yaml)
- [Potential communication with a Domain Generation Algorithm (DGA) based hostname (ASIM Network Session schema)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimWebSession/PossibleDGAContacts.yaml)
- [A client made a web request to a potentially harmful file (ASIM Web Session schema)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimWebSession/PotentiallyHarmfulFileTypes.yaml)
- [A host is potentially running a crypto miner (ASIM Web Session schema)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimWebSession/UnusualUACryptoMiners.yaml)
- [A host is potentially running a hacking tool (ASIM Web Session schema)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimWebSession/UnusualUAHackTool.yaml)
- [A host is potentially running PowerShell to send HTTP(S) requests (ASIM Web Session schema)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimWebSession/UnusualUAPowershell.yaml)
- [Discord CDN Risky File Download  (ASIM Web Session Schema)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimWebSession/DiscordCDNRiskyFileDownload_ASim.yaml)
- [Excessive number of HTTP authentication failures from a source (ASIM Web Session schema)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimWebSession/ExcessiveNetworkFailuresFromSource.yaml)
- [Known Barium domains](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/BariumDomainIOC112020.yaml)
- [Known Barium IP addresses](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/BariumIPIOC112020.yaml) 
- [Known Ruby Sleet domains and hashes](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/RubySleetOct292020IOCs.yaml)
- [Known Seashell Blizzard IP](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/SeashellBlizzardIOCs.yaml)
- [Known NICKEL domains and hashes](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/NylonTyphoonIOCsNov2021.yaml)
- [Midnight Blizzard - Domain and IP IOCs - March 2021](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/MidnightBlizzard_DomainIOCsMarch2021.yaml)
- [Midnight Blizzard - Domain, Hash and IP IOCs - May 2021](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/MidnightBlizzard_IOCsMay2021.yaml)
- [Known Phosphorus group domains/IP](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/PHOSPHORUSMarch2019IOCs.yaml)
- [User agent search for log4j exploitation attempt](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Apache%20Log4j%20Vulnerability%20Detection/Analytic%20Rules/UserAgentSearch_log4j.yaml)

## <a name="next-steps"></a>Next steps

This article discusses the Advanced Security Information Model (ASIM) content.

For more information, see:

- Watch the [Deep Dive Webinar on Microsoft Sentinel Normalizing Parsers and Normalized Content](https://www.youtube.com/watch?v=zaqblyjQW6k) or review the [slides](https://1drv.ms/b/s!AnEPjr8tHcNmjGtoRPQ2XYe3wQDz?e=R3dWeM)
- [Advanced Security Information Model (ASIM) overview](normalization.md)
- [Advanced Security Information Model (ASIM) schemas](normalization-about-schemas.md)
- [Advanced Security Information Model (ASIM) parsers](normalization-about-parsers.md)
- [Using the Advanced Security Information Model (ASIM)](normalization-about-parsers.md)
- [Modifying Microsoft Sentinel content to use the Advanced Security Information Model (ASIM) parsers](normalization-modify-content.md)
