---
title: Using Azure Defender to respond to supply chain attacks and systemic identity compromise | Microsoft Docs
description: Learn how to use Azure Defender for Endpoint to respond to supply chain attacks and systemic identity compromises similar to the SolarWinds attack (Solorigate).
services: sentinel
documentationcenter: na
author: batamig
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/30/2020
ms.author: bagol

---

# Using Microsoft Defender to respond to supply chain attacks and systemic identity threats

Microsoft Defender solutions provide the following coverage and visibility to help protect against the Solorigate attack:


|Product  |Description  |
|---------|---------|
|**Microsoft Defender for Endpoint**     | Has comprehensive detection coverage across the Solorigate attack chain. These detections raise alerts that inform security operations teams about activities and artifacts related to the attack. <br><br>Since the attack compromised legitimate software that should not be interrupted, automatic remediation is not enabled. However, the detections provide visibility into the attack activity and can be used to investigate and hunt further.        |
|**Microsoft 365 Defender**     |  Provides visibility *beyond* endpoints, by consolidating threat data from across domains, including identities, data, cloud apps, as well as endpoints. Cross-domain visibility enables Microsoft 365 Defender to correlate signals and comprehensively resolve whole attack chains. <br><br>    Security operations teams can then hunt using rich threat data and gain insights for protecting networks from compromise.       |
|**Microsoft Defender Antivirus**     |  The default anti-malware solution on Windows 10, detects and blocks the malicious DLL and its behaviors. It quarantines malware, even if the process is running.  <br><br>For more information, see [Microsoft Defender Antivirus detections for Solorigate](#microsoft-defender-antivirus-detections-for-solarigate).     |
|     |         |

We recommend that Microsoft 365 Defender customers to start their investigations with the [threat analytics reports](#microsoft-defender-for-threat-analytics-reports) created by Microsoft specifically for Solorigate. 

Use these reports, and other alerts and queries to perform the following recommended steps:

- [Use Microsoft Defender to find devices with the compromised SolarWinds Orion application](#use-microsoft-defender-to-find-devices-with-the-compromised-solarwinds-orion-application)
- [Investigate related Microsoft Defender alerts and incidents](#investigate-related-microsoft-defender-alerts-and-incidents)
- [Use Microsoft Defender to hunt for related attacker activity](#use-microsoft-defender-to-hunt-for-related-attacker-activity)

For more information, see [Advanced Microsoft Defender query reference](#advanced-microsoft-defender-query-reference).

## Microsoft Defender for threat analytics reports

Microsoft published the following threat analytics reports specifically to help investigate after the Solorigate attack. 

- [Sophisticated actor attacks FireEye](https://security.microsoft.com/threatanalytics3/a43fc0c6-120a-40c5-a948-a9f41eef0bf9/overview) provides information about the FireEye breach and compromised red team tools
- [Solorigate supply chain attack](https://security.microsoft.com/threatanalytics3/2b74f636-146e-48dd-94f6-5cb5132467ca/overview) provides a detailed analysis of the SolarWinds supply chain compromise

These reports are available to all Microsoft Defender for Endpoint customers and Microsoft 365 Defender early adopters, and include a deep-dive analysis, MITRE techniques, detection details, recommended actions, updated lists of IOCs, and advanced hunting techniques to expand detection coverage. 

For example:

:::image type="content" source="media/solarwinds/Threat-analytics-solorigate.jpg" alt-text="Threat analytics report in the Microsoft Defender Security Center":::

For more information, see: 

- [Understand the analyst report in threat analytics](/windows/security/threat-protection/microsoft-defender-atp/threat-analytics-analyst-reports)
- [Threat analytics for Microsoft 365 security](https://security.microsoft.com/threatanalytics3/2b74f636-146e-48dd-94f6-5cb5132467ca/overview)
- [Threat overview - Microsoft Defender for Endpoint](https://securitycenter.microsoft.com/threatanalytics3/2b74f636-146e-48dd-94f6-5cb5132467ca/overview)

## Use Microsoft Defender to find devices with the compromised SolarWinds Orion application

The threat analytics reports use insights from [threat and vulnerability management](/windows/security/threat-protection/microsoft-defender-atp/next-gen-threat-and-vuln-mgt) to identify devices that have the compromised SolarWinds Orion platform binaries or are exposed to the attack due to misconfiguration.

From the **Vulnerability patching status** chart in threat analytics, view  mitigation details to see a list of devices with the vulnerability ID **TVM-2020-0002**. This vulnerability was added specifically to help with Solorigate investigations.

Threat and vulnerability management provides more info about the vulnerability ID **TVM-2020-0002**, and all relevant applications, via the Software inventory view. There are also multiple security recommendations to address this specific threat, including instructions to update the software versions installed on exposed devices.

**Related query**:

To search for Threat and Vulnerability Management data and find SolarWinds Orion software, [run the following query](https://securitycenter.windows.com/hunting?query=H4sIAAAAAAAEAI2QywrCMBBF71rwH7pTP8JdN27cKN1KH5EKfUATLYof78lAsYiChGQmd2ZOJpPK6aaLSuwRr9VBvc4KGpVrQN2pQ3ecgciguzJd1XB33HIVVDfswHbySrTUQk_sqNpyHP4nNTNiZcREW1aiFdU9rJgxQotxj_oPb49tLeJRoxbwRuurNnZ86cLZzYien7Ss3GIPq6-YRY8e_7tWOpvP9MaGrII5_O7ize-tkyl_zj59ZcecOMVSL39fnZCaAQAA&runQuery=true&timeRangeId=month): 

```kusto
DeviceTvmSoftwareInventoryVulnerabilities| where SoftwareVendor == ‘solarwinds’| where SoftwareName startswith ‘orion’| summarize dcount(DeviceName) by SoftwareName| sort by dcount_DeviceName desc
```

Data returned will be organized by product name and sorted by the number of devices the software is installed on.


## Investigate related Microsoft Defender alerts and incidents

Use the threat analytics report to locate devices with alerts related to the attack. The **Devices with alerts** chart identifies devices with malicious components or activities known to be directly related to Solorigate. Navigate through to get the list of alerts and investigate.

Alerts are collected into Microsoft 365 Defender incidents, which can help you see the relationship between detected activities.

Review incidents in the [Incidents](/microsoft-365/security/mtp/investigate-incidents) queue and look for any relevant alerts. 


- Some Solorigate activities may not be directly tied to this specific threat, but will trigger alerts due to suspicious or malicious behaviors. 

- Microsoft Threat Expert customers with [Experts on demand subscriptions](/windows/security/threat-protection/microsoft-defender-atp/microsoft-threat-experts#collaborate-with-experts-on-demand) can reach out directly to our on-demand hunters for more help in understanding the Solorigate threat and the scope of its impact in their environments.

> [!Caution]
> Some alerts are specially tagged with [Microsoft Threat Experts](https://aka.ms/threatexperts) to indicate malicious activities that Microsoft researchers found in customer environments during hunting, and sent [targeted attack notifications](/windows/security/threat-protection/microsoft-defender-atp/microsoft-threat-experts#targeted-attack-notification).   If you see an alert tagged with Microsoft Threat Experts, we strongly recommend that you give it immediate attention.
> 

For more information, see the [threat analytics](#microsoft-defender-for-threat-analytics-reports) report, and any of the following alerts:

- [Microsoft Defender alerts by attack stage](#microsoft-defender-alerts-by-attack-stage)
- [Microsoft Defender alerts by threat type](#microsoft-defender-alerts-by-threat-type)

Each alert provides a full description and recommended actions. For more information, see [Microsoft Defender Antivirus detections for Solorigate](#microsoft-defender-antivirus-detections-for-solarigate).

### Microsoft Defender alerts by attack stage

We recommend searching your Microsoft 365 Defender solutions for any of the following alerts, which indicate a specific stage in a Solorigate attack:

|Attack stage  |Microsoft 365 Defender detection or alert  |
|---------|---------|
|**Initial access**     |   	**Microsoft Defender for Endpoint**:<br>- ‘Solorigate’ high-severity malware was detected/blocked/prevented ([Trojan:MSIL/Solorigate.BR!dha](https://www.microsoft.com/en-us/wdsi/threats/malware-encyclopedia-description?Name=Trojan:MSIL/Solorigate.BR!dha)) <br>- SolarWinds Malicious binaries associated with a supply chain attack      |
|**Execution and persistence**     |  **Microsoft Defender for Endpoint**: <br>-‘Solorigate’ high-severity malware was detected/blocked/prevented ([Trojan:Win64/Cobaltstrike.RN!dha](https://www.microsoft.com/en-us/wdsi/threats/malware-encyclopedia-description?Name=Trojan:Win64/Cobaltstrike.RN!dha), [Trojan:PowerShell/Solorigate.H!dha](https://www.microsoft.com/en-us/wdsi/threats/malware-encyclopedia-description?Name=Trojan:PowerShell/Solorigate.H!dha&threatId=-2147196089)) <br>- Suspicious process launch by Rundll32.exe <br>- Use of living-off-the-land binary to run malicious code <br>- A WMI event filter was bound to a suspicious event consumer       |
|**Command and control**     |    **Microsoft Defender for Endpoint**: <br>- An active ‘Solorigate’ high-severity malware was detected/ blocked/prevented ([Trojan:Win64/Cobaltstrike.RN!dha](https://www.microsoft.com/en-us/wdsi/threats/malware-encyclopedia-description?Name=Trojan:Win64/Cobaltstrike.RN!dha))     |
|**Defense evasion**     |   **Microsoft Defender for Endpoint** <br>- Suspicious audit policy tampering      |
|**Reconnaissance**     |    **Microsoft Defender for Endpoint**: <br>- Masquerading Active Directory exploration tool<br>- Suspicious sequence of exploration activities <br>- Execution of suspicious known LDAP query fragments     |
|**Credential access**     |    **Microsoft Defender for Endpoint**: <br>- Suspicious access to LSASS (credential access) <br>-ADFS private key extraction attempt <br>-Possible attempt to access ADFS key material <br>-Suspicious ADFS adapter process created<br><br>**Microsoft Defender for Identity**: <br>-Unusual addition of permissions to an OAuth app <br>-Active Directory attributes Reconnaissance using LDAP <br><br>**Microsoft Cloud App Security**: <br>-Unusual addition of credentials to an OAuth app     |
|**Lateral movement**     |    **Microsoft Defender for Endpoint** <br>- Suspicious file creation initiated remotely (lateral movement) <br>- Suspicious Remote WMI Execution (lateral movement)     |
|**Exfiltration**     |  **Microsoft Defender for Endpoint** <br>- Suspicious mailbox export or access modification <br>-Suspicious archive creation       |
|     |         |

### Microsoft Defender alerts by threat type

We recommend searching  Microsoft Defender Security Center and the Microsoft 365 security center for any of the following alerts, which indicate a specific type of Solorigate-related threat:

|Threat |Alerts  |
|---------|---------|
|May indicate threat activity on your network    | **SolarWinds Malicious binaries associated with a supply chain attack** <br><br>**SolarWinds Compromised binaries associated with a supply chain attack** <br><br>**Network traffic to domains associated with a supply chain attack**  |
|May indicate that threat activity has occurred or may occur later.<br><br>These alerts may also be associated with other malicious threats.     |**ADFS private key extraction attempt** <br><br>**Masquerading Active Directory exploration tool**<br><br> **Suspicious mailbox export or access modification** <br><br>**Possible attempt to access ADFS key material** <br><br>**Suspicious ADFS adapter process created**         |
|    |         |

### Microsoft Defender Antivirus detections for Solorigate

Microsoft Defender Antivirus detects the following threats and quarantines malware when found:
    
|Alert  |Threat descriptions  |
|---------|---------|
|**Detection for backdoored SolarWinds.Orion.Core.BusinessLayer.dll files**     |   [Trojan:MSIL/Solorigate.BR!dha](https://www.microsoft.com/en-us/wdsi/threats/malware-encyclopedia-description?Name=Trojan:MSIL/Solorigate.BR!dha)      |
|**Detection for Cobalt Strike fragments in process memory and stops the process**     | [Trojan:Win32/Solorigate.A!dha](https://www.microsoft.com/en-us/wdsi/threats/malware-encyclopedia-description?Name=Trojan:Win32/Solorigate.A!dha&threatId=-2147196107) <br>[Behavior:Win32/Solorigate.A!dha](https://www.microsoft.com/en-us/wdsi/threats/malware-encyclopedia-description?Name=Behavior:Win32/Solorigate.A!dha&threatId=-2147196108)       |
|**Detection for the second-stage payload** <br>A cobalt strike beacon that might connect to `infinitysoftwares[.]com`|  [Trojan:Win64/Solorigate.SA!dha](https://www.microsoft.com/en-us/wdsi/threats/malware-encyclopedia-description?Name=Trojan:Win64/Solorigate.SA!dha)      |
|**Detection for the PowerShell payload** that grabs hashes and SolarWinds passwords from the database along with machine information     |     [Trojan:PowerShell/Solorigate.H!dha](https://www.microsoft.com/en-us/wdsi/threats/malware-encyclopedia-description?Name=Trojan:PowerShell/Solorigate.H!dha&threatId=-2147196089)    |
|     |         |

## Use Microsoft Defender to hunt for related attacker activity

Use Microsoft Defender for Endpoint, Microsoft 365 Defender, and Microsoft Defender for Identity to hunt for malicious activity on your tenant that may be related to the Solorigate attack:

1. [Find and block malware and malicious behavior on endpoints](#step-1-use-microsoft-defender-to-find-and-block-malware-and-malicious-behavior-on-endpoints)
1. [Find malicious activity in an on-premises environment](#step-2-use-microsoft-defender-to-find-malicious-activity-in-an-on-premises-environment)
1. [Find malicious activity in the cloud environment](#step-3-use-microsoft-defender-to-find-malicious-activity-in-the-cloud-environment)
1. [Find malicious DLLs loaded into memory](#step-4-use-microsoft-defender-to-find-malicious-dlls-loaded-into-memory)
1. [Find malicious DLLs created in the system or locally](#step-5-use-microsoft-defender-to-find-malicious-dlls-created-in-the-system-or-locally)
1. [Find SolarWinds processes launching PowerShell with Base64](#step-6-use-microsoft-defender-to-find-solarwinds-processes-launching-powershell-with-base64)
1. [Find SolarWinds processes launching CMD with echo](#step-7-use-microsoft-defender-to-find-solarwinds-processes-launching-cmd-with-echo)
1. [Find command and control communications](#step-8-use-microsoft-defender-to-find-command-and-control-communications)

For more information, see [Advanced query reference](#advanced-microsoft-defender-query-reference).

### Step 1: Use Microsoft Defender to find and block malware and malicious behavior on endpoints

To evade security software and analysis tools, the Solorigate malware attempts to disable processes, drivers, and registry keys on the target system, including the Microsoft Defender for Endpoint sensor.

While Microsoft Defender for Endpoint has built-in protections against these attempts, a successful attempt can prevent the system from reporting observed activities. 

Use the following advanced query to locate devices that should be reporting but aren't:

```Kusto
// Times to be modified as appropriate
let timeAgo=1d;
let silenceTime=8h;
// Get all silent devices and IPs from network events
let allNetwork=materialize(DeviceNetworkEvents
| where Timestamp > ago(timeAgo)
and isnotempty(LocalIP)
and isnotempty(RemoteIP)
and ActionType in (“ConnectionSuccess”, “InboundConnectionAccepted”)
and LocalIP !in (“127.0.0.1”, “::1”)
| project DeviceId, Timestamp, LocalIP, RemoteIP, ReportId);
let nonSilentDevices=allNetwork
| where Timestamp > ago(silenceTime)
| union (DeviceProcessEvents | where Timestamp > ago(silenceTime))
| summarize by DeviceId;
let nonSilentIPs=allNetwork
| where Timestamp > ago(silenceTime)
| summarize by LocalIP;
let silentDevices=allNetwork
| where DeviceId !in (nonSilentDevices)
and LocalIP !in (nonSilentIPs)
| project DeviceId, LocalIP, Timestamp, ReportId;
// Get all remote IPs that were recently active
let addressesDuringSilence=allNetwork
| where Timestamp > ago(silenceTime)
| summarize by RemoteIP;
// Potentially disconnected devices were connected but are silent
silentDevices
| where LocalIP in (addressesDuringSilence)
| summarize ReportId=arg_max(Timestamp, ReportId), Timestamp=max(Timestamp), LocalIP=arg_max(Timestamp, LocalIP) by DeviceId
| project DeviceId, ReportId=ReportId1, Timestamp, LocalIP=LocalIP1
```

> [!NOTE]
> Microsoft is continuously developing additional measures to both block and alert on these types of tampering activities.
> 

### Step 2: Use Microsoft Defender to find malicious activity in an on-premises environment

Attackers can gain access to an organization's cloud services through the Activity Directory Federation Services (ADFS) server, which enables federated identity and access management and stores the Security Assertion Markup Language (SAML) token-signing certificate.

To attack the ADFS server, attackers must first obtain domain permissions through on-premises activity. Use Microsoft Defender for Endpoint queries to find evidence of masked exploration tools used by an attacker to gain access to an on-premises system. For example:

:::image type="content" source="media/solarwinds/masqueradring-exploration-tools.png" alt-text="Microsoft Defender for Endpoint using queries to find usage of masked exploration tools":::


Microsoft Defender for Identity can also detect and block lateral moves between devices and credential theft. In addition to watching for related alerts, use Microsoft 365 Defender to hunt for signs of identity compromise. For example, use the following queries:

- [Find searches for high-value DC assets followed by sign-in attempts to validate stolen credentials](#find-searches-for-high-value-dc-assets-followed-by-sign-in-attempts-to-validate-stolen-credentials)
- [Find high numbers of LDAP queries in a short time that filter for non-DC devices](#find-high-numbers-of-ldap-queries-in-a-short-time-that-filter-for-non-dc-devices)

After attackers have access to an ADFS infrastructure, they often attempt to create valid SAML tokens to allow user impersonation in the cloud. Attackers may either steal the SAML signing certificate, or add or modify existing certificates as trusted entities. 

Both Microsoft Defender for Endpoint and Microsoft Defender for Identify detect actions used to steal encryption keys, used to decrypt the SAML signing certificate. For more information, see [Find malicious changes made in domain federation settings](#find-malicious-changes-made-in-domain-federation-settings).

> [!IMPORTANT]
> If any indications of malicious activity are found, take containment measures as needed to invalidate certificate rotation and prevent the attacker from further using and creating SAML tokens. Additionally, you may need to isolate and remediate affected ADFS servers to ensure that no attacker control or persistence remains.
>- Follow recommended actions in alerts to remove persistance and prevent an attacker's payload from loading again after rebooting. 
> - Use the Microsoft 365 security center to isolate the devices involved, and block any remote activity, as well as mark suspected users as compromised.  
> 

#### Find searches for high-value DC assets followed by sign-in attempts to validate stolen credentials

The following query finds searches for high-value DC assets, followed closely by sign-in attempts to validate stolen credentials:

```kusto
let MaxTime = 1d;
let MinNumberLogon = 5;
//devices attempting enumeration of high-value DC
IdentityQueryEvents
| where Timestamp > ago(30d)
| where Application == “Active Directory”
| where QueryTarget in (“Read-only Domain Controllers”)
//high-value RODC assets
| project Timestamp, Protocol, Query, DeviceName, AccountUpn
| join kind = innerunique (
//devices trying to logon {MaxTime} after enumeration
IdentityLogonEvents
| where Timestamp > ago(30d)
| where ActionType == “LogonSuccess”
| project LogonTime = Timestamp, DeviceName, DestinationDeviceName) on DeviceName
| where LogonTime between (Timestamp .. (Timestamp + MaxTime))
| summarize n=dcount(DestinationDeviceName), TargetedDC = makeset(DestinationDeviceName) by Timestamp, Protocol, DeviceName
| where n >= MinNumberLogon
```

#### Find high numbers of LDAP queries in a short time that filter for non-DC devices

Use the following query to find any instance of high-volume LDAP queries in a short time, that filter for non-DC devices:

```kusto
let Threshold = 12;
let BinTime = 1m;
//approximate list of DC
let listDC=IdentityDirectoryEvents
| where Application == “Active Directory”
| where ActionType == “Directory Services replication”
| summarize by DestinationDeviceName;
IdentityQueryEvents
| where Timestamp > ago(30d)
//filter out LDAP traffic across DC
| where DeviceName !in (listDC)
| where ActionType == “LDAP query”
| parse Query with * “Search Scope: ” SearchScope “, Base Object:” BaseObject “, Search Filter: ” SearchFilter
| summarize NumberOfDistinctLdapQueries = dcount(SearchFilter) by DeviceName, bin(Timestamp, BinTime)
| where NumberOfDistinctLdapQueries > Threshold
```

#### Find malicious changes made in domain federation settings

Use the following query to search Azure AD audit logs for changes in domain federation settings. 

For more information, see [ADFSDomainTrustMods](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/master/Defense%20evasion/ADFSDomainTrustMods%5BSolarigate%5D.md) on GitHub.

```kusto
let auditLookback = 1d; CloudAppEvents
| where Timestamp > ago(auditLookback)
| where ActionType =~ “Set federation settings on domain.”
| extend targetDetails = parse_json(ActivityObjects[1])
| extend targetDisplayName = targetDetails.Name
| extend resultStatus = extractjson(“$.ResultStatus”, tostring(RawEventData), typeof(string))
| project Timestamp, ActionType, InitiatingUserOrApp=AccountDisplayName, targetDisplayName, resultStatus, InitiatingIPAddress=IPAddress, UserAgent
```

> [!IMPORTANT]
> We recommend verifying that any instances found are indeed the result of illegitimate administrative activity.
> 

### Step 3: Use Microsoft Defender to find malicious activity in the cloud environment

If an attacker has created illicit SAML tokens, they can access sensitive data without being limited to a compromised or on-premises device. 

For example, they can attempt to blend into normal activity patterns, including apps or service principals with existing **Mail.Read** or **Mail.ReadWrite** permissions to read email content. Applications that don't already have read-permissions for emails can be modified to grant those permissions.

Microsoft Defender Cloud App Security (MCAS) alerts have been added to automatically detect unusual credential additions to OAuth apps, in order to warn about apps that have been compromised. For example:

:::image type="content" source="media/solarwinds/MCAS-OAutho-app.png" alt-text="MCAS alert for unusual credential additions to OAuth apps":::
 
If you see these alerts and confirm malicious activity, we recommend that you take immediate action to suspend the user and mark them as compromised, reset the user's password, and remove any credentials added. You might also consider disabling the application during your investigation and remediation.

For more information, see:

- [Find newly added credentials](#find-newly-added-credentials)
- [Find malicious access to mail items](#find-malicious-access-to-mail-items)
- [Find OAuth applications reading mail with changed behavior patterns](#find-oauth-applications-reading-mail-with-changed-behavior-patterns)

#### Find newly added credentials

Additionally, use the following Microsoft 365 Defender hunting query to examine Azure AD audit logs for newly credentials added to a service principal or application. 

For more information, see [NewAppOrServicePrincipalCredential](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/master/Persistence/NewAppOrServicePrincipalCredential%5BSolarigate%5D.md) on GitHub.

```kusto
let auditLookback = 1d; CloudAppEvents
| where Timestamp > ago(auditLookback)
| where ActionType in (“Add service principal.”, “Add service principal credentials.”, “Update application – Certificates and secrets management “)
| extend RawEventData = parse_json(RawEventData)
| where RawEventData.ResultStatus =~ “success”
| where AccountDisplayName has “@”
| extend targetDetails = parse_json(ActivityObjects[1])
| extend targetId = targetDetails.Id
| extend targetType = targetDetails.Type
| extend targetDisplayName = targetDetails.Name
| extend keyEvents = RawEventData.ModifiedProperties
| where keyEvents has “KeyIdentifier=” and keyEvents has “KeyUsage=Verify”
| mvexpand keyEvents
| where keyEvents.Name =~ “KeyDescription”
| parse keyEvents.NewValue with * “KeyIdentifier=” keyIdentifier:string “,KeyType=” keyType:string “,KeyUsage=” keyUsage:string “,DisplayName=” keyDisplayName:string “]” *
| parse keyEvents.OldValue with * “KeyIdentifier=” keyIdentifierOld:string “,KeyType” *
| where keyEvents.OldValue == “[]” or keyIdentifier != keyIdentifierOld
| where keyUsage == “Verify”
| project-away keyEvents
| project Timestamp, ActionType, InitiatingUserOrApp=AccountDisplayName, InitiatingIPAddress=IPAddress, UserAgent, targetDisplayName, targetId, targetType, keyDisplayName, keyType, keyUsage, keyIdentifier
```

> [!IMPORTANT]
> We recommend that you verify any unusual changes with respective owners to verify whether they are indeed the result of illegitimate administrative actions. 
> 

#### Find malicious access to mail items

To increase visibility on OAuth applications or service principals that can read email content from Exchange online, the **MailItemsAccessed** is now available via Microsoft Exchange mailbox advanced audit functionality. 

> [!NOTE]
> If you have customized the list of collected audit events, you may need to manually turn on this feature.
>

If more than **1,000** MailItemsAccessed audit records are generated in less than 24 hours, Exchange Online stops generating auditing records for MailItemsAccessed activity for 24 hours, and then resumes logging after this period. 

Use the following query to check for this throttling behavior and help discover potentially compromised mailboxes. 

For more information, see [MailItemsAccessedThrottling](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/master/Exfiltration/MailItemsAccessed%20Throttling%20%5BSolorigate%5D.md) on GitHub.

```kusto
let starttime = 2d;
let endtime = 1d;
CloudAppEvents
| where Timestamp between (startofday(ago(starttime))..startofday(ago(endtime)))
| where ActionType == “MailItemsAccessed”
| where isnotempty(RawEventData[‘ClientAppId’]) and RawEventData[‘OperationProperties’][1] has “True”
| project Timestamp, RawEventData[‘OrganizationId’],AccountObjectId,UserAgent
```

#### Find OAuth applications reading mail, with changed behavior patterns

Use the following query to hunt for OAuth applications that can read mail, and whose behavior has recently changed when compared with a baseline period.

For more information, see [OAuthGraphAPIAnomalies](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/master/Exfiltration/OAuth%20Apps%20reading%20mail%20via%20GraphAPI%20anomaly%20%5BSolorigate%5D.md) on GitHub.

```kusto
//Look for OAuth App reading mail via GraphAPI — that did not read mail via graph API in prior week
let appMailReadActivity = (timeframeStart:datetime, timeframeEnd:datetime) {
CloudAppEvents
| where Timestamp between (timeframeStart .. timeframeEnd)
| where ActionType == “MailItemsAccessed”
| where RawEventData has “00000003-0000-0000-c000-000000000000” // performance check
| extend rawData = parse_json(RawEventData)
| extend AppId = tostring(parse_json(rawData.AppId))
| extend OAuthAppId = tostring(parse_json(rawData.ClientAppId)) // extract OAuthAppId
| summarize by OAuthAppId
};
appMailReadActivity(ago(1d),now()) // detection period
| join kind = leftanti appMailReadActivity(ago(7d),ago(2d)) // baseline period
on OAuthAppId
```

### Step 4: Use Microsoft Defender to find malicious DLLs loaded into memory

To locate the presence or distribution of malicious DLLs loaded into memory, [run the following query](https://securitycenter.windows.com/hunting?query=H4sIAAAAAAAEAE2XzQ7sNAyFs0biHa7uCiQWadL8LZFAAokdT5A0DdwFXAkQbHh4nM_uMBp1pm0S2zk-Ps585273t_vkLvn90f3muvtF7n5yn-Vuuu9l7Ha_u7_cn-6D-9J94f6V33_cr_L2D7k-uJ_dD-5bd8jdJ5n3wX3lPrrisnxO512Sq7oh47e8LfLc5C7JWOX5EC_JRXvf5Zo8RVmzWHVLZB_dN3JNeY5ib8jdtrQ9JBkN8hvls8RmFRuXzIn422-bzFmypsvqInNvecpEqFYPViyZeVis6jcy58LmjnbbGLI-ifeL6E88L_neMXR8PbHezNz-olgJYjnLuyafJe87cev7yP1emey72Pz9W_FZzWqW1VM-Vd4NGb_Y1SXXkhU3Ngv7TzK-PW_MTuwn9r_tphfCajWw405ce1eHfKbMPNirZ6yTidPWVr53fvdok0tz4dmvWh3idWDzBLFBdF7ug_x2spJZvSOrhuNiN0PWDL5vcrvRfrKV8aORDVkd5NqIePi6x_f9AusIFgEfJ9Yned3IbozLi1mV2VXmbbQnVvauh0SgbNiYLJiQ5HnAt0Lu9sxGvgdxNbOq3JsyuvNwwrELT09MaqGCeYSbHdZOq5SBtb3TJnPU6gUnCnhV8PasU4buCE84kfE42fEie4NZlSwoE3bNPRx4omi2021ryQrNqY5FYps8L7BqoF3gVoTNmew-VjfuWWztGCtVcpOHm5Wbq5HsX3Kv-ZuwalEpHS5eeNw5f6xuTHVvg0g91g6qp1OJB_hsmxrjoLZ2rCf6k8hFgZX_V-zBngocGWhRA7ELD1rfjfg8czSXO-oA7nt-t4yo1cVoQks8fFpYUyVRP5VVk5wltHLBlQWyASVTBu5YvxaN_Sza-yhvQAnf1Tfy7oA_FYZ6ailg68TLZuSNJm2NO8nB3s9tvJz8emo1oCrT6uE0nG5wbNSrZzyDaHnxVBV_ksMMkwoYdfjbiaeT6_nS0cN8FKI4iPAmwkAlTusQuidPTJWIDlhVqaf5UvfHWzJlb4w2U0fldyKaTPyTPVciiLwf9JWG5YKtiO5War4aRoU4VZEXmK03hd21p95UETcnM4qU4G2BxQGGdbwm0GrYG3x7Lk_-TubvHqe1l0BLu4VnteJ7wcRpUXTT1mCcu19KoLM92b9h4IVuV1C-rP5VZya6n9HlgWZm8A62n0k2NIeP-h7caxTaMTx4dupi8HuA4-ITqMJCbRWsTdYcxBLY7WUafbH7br0rMl7I1wkfGpo4WB3fVNRj8cRHpCKi-Uvo3039LdOMhV19Hqigcvokf5oFz24atXTDMe3-nbXap1XhywuLhbdCLqZpWiZzlfyqtmU7vzQwT6hopCdoBx6vU08Gha26jT1pP0_UUcd2gh0JZB52aie9qZYIut7i1S6vyHX8NOvZt0UdiSoYDyaR3RbXQgW00gYVtq0qnzI-jxc7lX_RunuioiMRqcKcMGuASICFjy4-3WmBi0eXOoqR7fmmdhRfVZlJZJkaXm89O5DdEwxvbEyr1GrnNtWmQe-57MSZQLBbpzis4w5yFfHeYMhBfaseelipfT4Rc3yr1Aj_Bva0V2vffphwma3CvADWJ-jrqe0gxhPGLTsTVfI0resNY2_ihKh9W09hTxQNNKZV3UStD8vqwwbtlsn6xYntaZqovPOmbZ4a0j7wKGUwfydRLJis_WbX5oOFKrpHYTJYBXDQk0hnX82y6MnaoFsW6x16hjzYQTVF1ZP3MCs3kTbQ015esLY9PafZar3iYvfKm8KuFkhqB59wJ7OPBmqqTXpeV96drAh0Fu2xep9NfwYM0v8di7zkl2pd5DG8VLahcTu7l3WZC72YpuKnxR1hWqc7-df5--RzmTqexkhP1Rx2IlGVrFTLc6ZZ2J_sVpkc0Kli1RTAJ8PPZXOUsXrCjm-9JZteTztBXPZPrdjZVnei_7cqu91noP8A9D6a0LYOAAA&runQuery=true&timeRangeId=week):

```Kusto
DeviceImageLoadEvents | where SHA1 in (“d130bd75645c2433f88ac03e73395fba172ef676″,”1acf3108bf1e376c8848fbb25dc87424f2c2a39c”,”e257236206e99f5a5c62035c9c59c57206728b28″,”6fdd82b7ca1c1f0ec67c05b36d14c9517065353b”,”2f1a5a7411d015d01aaee4535835400191645023″,”bcb5a4dcbc60d26a5f619518f2cfc1b4bb4e4387″,”16505d0b929d80ad1680f993c02954cfd3772207″,”d8938528d68aabe1e31df485eb3f75c8a925b5d9″,”395da6d4f3c890295f7584132ea73d759bd9d094″,”c8b7f28230ea8fbf441c64fdd3feeba88607069e”,”2841391dfbffa02341333dd34f5298071730366a”,”2546b0e82aecfe987c318c7ad1d00f9fa11cd305″,”e2152737bed988c0939c900037890d1244d9a30e”) or SHA256 in (“ce77d116a074dab7a22a0fd4f2c1ab475f16eec42e1ded3c0b0aa8211fe858d6″,”dab758bf98d9b36fa057a66cd0284737abf89857b73ca89280267ee7caf62f3b”,”eb6fab5a2964c5817fb239a7a5079cabca0a00464fb3e07155f28b0a57a2c0ed”,”ac1b2b89e60707a20e9eb1ca480bc3410ead40643b386d624c5d21b47c02917c”,”019085a76ba7126fff22770d71bd901c325fc68ac55aa743327984e89f4b0134″,”c09040d35630d75dfef0f804f320f8b3d16a481071076918e9b236a321c1ea77″,”0f5d7e6dfdd62c83eb096ba193b5ae394001bac036745495674156ead6557589″,”e0b9eda35f01c1540134aba9195e7e6393286dde3e001fce36fb661cc346b91d”,”20e35055113dac104d2bb02d4e7e33413fae0e5a426e0eea0dfd2c1dce692fd9″,”2b3445e42d64c85a5475bdbc88a50ba8c013febb53ea97119a11604b7595e53d”,”a3efbc07068606ba1c19a7ef21f4de15d15b41ef680832d7bcba485143668f2d”,”92bd1c3d2a11fc4aba2735d9547bd0261560fb20f36a0e7ca2f2d451f1b62690″,”a58d02465e26bdd3a839fd90e4b317eece431d28cab203bbdde569e11247d9e2″,”cc082d21b9e880ceb6c96db1c48a0375aaf06a5f444cb0144b70e01dc69048e6″)
```

### Step 5: Use Microsoft Defender to find malicious DLLs created in the system or locally

To locate the presence or distribution of malicious DLLs created locally or elsewhere in the system, [run the following query](https://securitycenter.windows.com/hunting?query=H4sIAAAAAAAEAE2Xy87tNAyFO0biHX6dEUgM0twzRALEnCdImkYc6QgkQDDh4XE-u5utqru3xHaWl5ezfzju4-_j83HJ9Se5fpHrj_LmPn47_jr-PD6Or4-vjn_l-s_xq7z9Q86P45fj5-P745S7zzLu4_jm-HSUI8sRD3ckOesx5Pstb4s8N7lL8q3yfB5dnoK973JOnoLMWcy6JZ5Px3dyTnkOYm_I3ba0PST56uUa5Fhis4qNS8YE_O23TcYsmdNldpGxtzxlIlSrJzOWjDwtVvUbGHNhc0e7bQyZn8T7RfQRz0t-dwwdX0-sNyO3vyBWvFjO8q7JseR9J259H7jfM5P9Fhu_rxWf1axmmT3lqPJuyPeLVV1yLplxY7Ow_iTft-eNWcR-Yv3bbnohrFY9K-7EtVd1yjFl5MlaHd86mYg2t_K787u_Njk1F471qtUhXgc2I4gNonNy7-XayUpm9o6sGo6L1QyZM_i9ye1G-8lWxo9GNmS2l3Mj4sTm5Pu-X2AdwMLjI2J9kteN7Ma4vJhVGV1l3EZ7YmWvekgEyoaNyYIJSZ4HfCvkbo9s5HsQVzOryr0pX3ceIhy78PTEpBYqmAe42WHttEoZWNsrbTJGrV5wooBXBW_HPGXojjDCiYzHyYoX2RuMqmRBmbBr7uHAE0WzlW5bS2ZoTvVbILbJ8wKrBtoFbgXYnMnuY3XjnsXWjrFSJTd5uJm5uRrI_iX3mr8JqxaV0uHihced88fqxlTXNojUYe2kejqVeILPtqkxDmprxxrRn0QuCqz8v2JP1lTgyECLGohdeND6bsTnGKO53FF7cN_ju2VErS6-JrTEwaeFNVUS9VOZNclZQisXXFkg61EyZeCO9VvR2N9Fex_l9Sjhu_oG3p3wp8JQRy15bEW8bEbeaNLWuEgO9npu4-Xk6qhVj6pMq4doON3g2KhXx_cMouXFU1X8SQ4zTCpg1OFvJ55OrudLR0_zUYjiJMKbCD2VOK1D6JocMVUiOmFVpZ7mS90fb8mUvfG1mToqvxPRZOKfrLkSQeD9oK80LBdsBXS3UvPVMCrEqYq8wGy9KeyuPfWmirg5mVGkBG8LLPYwrOM1gVbD3uDXcTryFxm_e5zWXgIt7RaO2YrvBROnRdFNW71x7n4pgY52ZP-GgRe6XUH5svpXnZnofkaXB5qZwdvbeibZ0Bw-6ntyr1Fox3Dg2amLwfUEx8XhqcJCbRWsTeacxOJZ7WUafbH6br0r8L2QrwgfGpo4mB3eVNRhMeIjUBHB_CX076b-lmnGwq4-D1RQOR3Jn2bBsZpGLd1wTLt_Z672aVX48sJi4a2Qi2malslcJb-qbdn2Lw3MEyoa6Anagcdr15NBYatuY03azxN11LGdYEcCmYed2klvqiWArrN4tcsrch0_zXr2bVEHovLGg0lkt8W1UAGttEGFbavKp4zP88VO5V-w7p6o6EBEqjARZg0Q8bDw0cWnOy1wcehSRzGyPd_UjuKrKjOJLFPD661ne7IbwfDGxrRKrbZvU20a9J7LdpwJBLt1itM67iBXAe8NhpzUt-qhg5Xa5xMxh7dKDfBvYE97tfbthwmX2SqM82AdQV93bScxRhi3bE9UydO0rjeMvYkdovZt3YU9UTTQmFZ1E7U-LasPG7RbJusXEdvTNFF550zbHDWkfeBRSm_-IlEsmKz9Ztfmg4UqukNhMlh5cNCdSGddzbLoyNqgWxbrHbqHPFlBNUXVnfcwKzeRNtDTXl6wtj09u9lqveJi9cqbwqoWSGoHn3Ans44GaqpNul9X3kVmeDqL9li9z6Y_Awbp_45FXvJLtS7y6F8q29C4nd3LusyFXkxT8WhxB5jW6U7utf-OHJepYzRGOqrmtB2JqmSlWp49zcL-ZLXKZI9OFasmDz4Zfi4bo4zVHXZ46y3Z9HraDuKyf2rF9ra6Ev2_VVnt3gP9B3GMOb2sDgAA&runQuery=true&timeRangeId=week):

```Kusto
DeviceFileEvents | where SHA1 in (“d130bd75645c2433f88ac03e73395fba172ef676″,”1acf3108bf1e376c8848fbb25dc87424f2c2a39c”,”e257236206e99f5a5c62035c9c59c57206728b28″,”6fdd82b7ca1c1f0ec67c05b36d14c9517065353b”,”2f1a5a7411d015d01aaee4535835400191645023″,”bcb5a4dcbc60d26a5f619518f2cfc1b4bb4e4387″,”16505d0b929d80ad1680f993c02954cfd3772207″,”d8938528d68aabe1e31df485eb3f75c8a925b5d9″,”395da6d4f3c890295f7584132ea73d759bd9d094″,”c8b7f28230ea8fbf441c64fdd3feeba88607069e”,”2841391dfbffa02341333dd34f5298071730366a”,”2546b0e82aecfe987c318c7ad1d00f9fa11cd305″,”e2152737bed988c0939c900037890d1244d9a30e”) or SHA256 in (“ce77d116a074dab7a22a0fd4f2c1ab475f16eec42e1ded3c0b0aa8211fe858d6″,”dab758bf98d9b36fa057a66cd0284737abf89857b73ca89280267ee7caf62f3b”,”eb6fab5a2964c5817fb239a7a5079cabca0a00464fb3e07155f28b0a57a2c0ed”,”ac1b2b89e60707a20e9eb1ca480bc3410ead40643b386d624c5d21b47c02917c”,”019085a76ba7126fff22770d71bd901c325fc68ac55aa743327984e89f4b0134″,”c09040d35630d75dfef0f804f320f8b3d16a481071076918e9b236a321c1ea77″,”0f5d7e6dfdd62c83eb096ba193b5ae394001bac036745495674156ead6557589″,”e0b9eda35f01c1540134aba9195e7e6393286dde3e001fce36fb661cc346b91d”,”20e35055113dac104d2bb02d4e7e33413fae0e5a426e0eea0dfd2c1dce692fd9″,”2b3445e42d64c85a5475bdbc88a50ba8c013febb53ea97119a11604b7595e53d”,”a3efbc07068606ba1c19a7ef21f4de15d15b41ef680832d7bcba485143668f2d”,”92bd1c3d2a11fc4aba2735d9547bd0261560fb20f36a0e7ca2f2d451f1b62690″,”a58d02465e26bdd3a839fd90e4b317eece431d28cab203bbdde569e11247d9e2″,”cc082d21b9e880ceb6c96db1c48a0375aaf06a5f444cb0144b70e01dc69048e6″)
```

### Step 6: Use Microsoft Defender to find SolarWinds processes launching PowerShell with Base64

To locate SolarWinds processes that are spawning suspected Base64-encoded PowerShell commands, [run the following query](https://securitycenter.windows.com/hunting?query=H4sIAAAAAAAEAK1TXUsCQRQ9z0H_YfHF3VKzkqAHoW8KJIIegkpEdxeVdlV2TO3zt3fu3VHcsloohpm5d-ac-zlzghAT9OFzv0KCoUqG45TnIQYYU17HGl7hYIoezxJOBxe86_O2j7auA3Q_WTjjaUT5kohYOXW8cy3gmqiIpwlulBkQXcERHrmLnvIbRDypv3PiDb1UqM04Cysj-t7fiPyp4oziI46srS0OhznP6CUh3-fuoEPJELOHGjWphk9LAaWAulFsmnnJ3hvmkEYzITfibfDFTqTILtm9RR6heg61Fll8y97No0p91xec-bmLIucdDlHGLc_KeEaV6z42mVsTL9ihXsIbMXXVRdul7pEp8W_rmu3hMeWYo62RNWx3vD_FLTXqZKrn_sqUyKq6upaZVvF3pkeO9Lam0oaV8sQvfV7ut8QuvR3p25UKuThg7e4ZWVrBot2lXg-8b_2Y5bL9FnFD_RGJvvo8eXk2D3m7q_7DgBYFGzPicU6bju10nl7G-vN99WhsbbqKlErMX2KT8n9aTd-0WP0AdbkD_LwEAAA&runQuery=true&timeRangeId=month): 

```Kusto
DeviceProcessEvents| where InitiatingProcessFileName =~ “SolarWinds.BusinessLayerHost.exe”| where FileName =~ “powershell.exe”// Extract base64 encoded string, ensure valid base64 length| extend base64_extracted = extract(‘([A-Za-z0-9+/]{20,}[=]{0,3})’, 1, ProcessCommandLine)| extend base64_extracted = substring(base64_extracted, 0, (strlen(base64_extracted) / 4) * 4)| extend base64_decoded = replace(@’\0′, ”, make_string(base64_decode_toarray(base64_extracted)))//| where notempty(base64_extracted) and base64_extracted matches regex ‘[A-Z]’ and base64_extracted matches regex ‘[0-9]’
```

### Step 7: Use Microsoft Defender to find SolarWinds processes launching CMD with echo

To locate SolarWinds processes launching CMD with echo, [run the following query](https://securitycenter.windows.com/hunting?query=H4sIAAAAAAAEAG2OSwrCQBBEay14h2EOkBtk4w-FIIIL1yEZzEASIfEL4tl9M3EhITT9requXsnpLq-CfFCnS6x6bM3cqdWVeq6Z3jJ6qGLW4UY7MA_qlcfY6jy6sGFaU-9hNHEn1YdodYRVM-10ipsl7EQL3cihH_YzGK-ot4Xfo5LQPXE7-dGUXhr1Cvryb9vACKpm9PGSusEGNPv9YtDIQcMlB7eCZfUF5AwwqToBAAA&runQuery=true&timeRangeId=month):

```Kusto
DeviceProcessEvents| where InitiatingProcessFileName =~ “SolarWinds.BusinessLayerHost.exe”| where FileName == “cmd.exe” and ProcessCommandLine has “echo”
```

### Step 8: Use Microsoft Defender to find command and control communications

The compromised SolarWinds files create a backdoor that allows attackers to remotely control and operate an affected device. 

When the compromised SolarWinds binary files are loaded on a device, such as through regular updates, the backdoor verifies that it's running on an enterprise network, and then contacts a command and control server, allowing the attacker to remotely run commands on the device, and move to the next stage of the attack.

To locate DNS lookups to an attacker's domain, [run the following query](https://securitycenter.windows.com/hunting?query=H4sIAAAAAAAEAGWOSwrCQBQEay14hyEH0BO4EKJLwc8FghkwEI2YZCTg4S1noQtpHt00Bf1KIomGs74xRW4M9MyZ8SLw5GL38AJrqUG2kzkxcc_tSgUKStuePWPmJw56L9PlPkoElqpkx9H8I8Mf-1mvzHVerVXzXa5o2ZqjXksHP6yyFyxMyZy4-msrP8oUvAEb21tt5gAAAA&runQuery=true&timeRangeId=month):

```kusto
DeviceEvents| where ActionType == “DnsQueryResponse” //DNS Query Responseand AdditionalFields has “.avsvmcloud”
```

To find command and control communications that may indicate malicious behavior, [run the following query](https://securitycenter.windows.com/hunting?query=H4sIAAAAAAAEALWQPQ6CQBCFX23iHZDGjhvYqYmNMSYegCA_G4E1gEDh4f12KgtLCZmd3TfvZ5e9co1yyuhnatAkr04PHcBztSC9Iq210ps-qQLtqEhX1gb2QL-B1WAZ56BJ8WxNuWU_shvhZnC8XrorMWbD9JfzCa3DxaEdzKnUhZm3e_Z8R9Da7pziEjQb7VhjGJUxA5pQMxX_PaVhmvOOctEUZ85P-2vdokkFk-BSwJ4XzPG8JvikXxkfdzmn1oQCAAA&runQuery=true&timeRangeId=month):

```kusto
DeviceNetworkEvents| where RemoteUrl contains ‘avsvmcloud.com’| where InitiatingProcessFileName != “chrome.exe”| where InitiatingProcessFileName != “msedge.exe”| where InitiatingProcessFileName != “iexplore.exe”| where InitiatingProcessFileName != “firefox.exe”| where InitiatingProcessFileName != “opera.exe”
```

#### ADFS adapter process spawning

<!--why no description in source?-->
Use the following process to track ADFS adapter process spawning:

```kusto
DeviceProcessEvents| where InitiatingProcessFileName =~”Microsoft.IdentityServer.ServiceHost.exe”| where FileName in~(“werfault.exe”, “csc.exe”)| where ProcessCommandLine !contains (“nameId”)
```

## Advanced Microsoft Defender query reference

Run the following advanced queries, referenced from GitHub, to find tactics, threats, and procedures used in the Solorigate attack:

|Attack stage  |Query link  |
|---------|---------|
|**General**     |    **Microsoft Defender for Endpoint Threat and Vulnerability Management**: <br>- [SolarWinds Orion software in your org](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/3cb633cee8332b5eb968b4ae1947b9ddb7a5958f/Campaigns/possible-affected-software-orion%5BSolorigate%5D.md)     |
|**Initial access**     | **Microsoft Defender for Endpoint**: <br>- [Malicious DLLs loaded in memory](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/e4ff45064d58ebd352cff0bb6765ad87d54ab9a9/Campaigns/locate-dll-loaded-in-memory%5BSolorigate%5D.md) <br>- [Malicious DLLs created in the system or locally](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/3cb633cee8332b5eb968b4ae1947b9ddb7a5958f/Campaigns/locate-dll-created-locally%5BSolorigate%5D.md) <br>- [Compromised SolarWinds certificate](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/616f86b2767318577a0d9bccb379177d0dccdf2d/Campaigns/compromised-certificate%5BSolorigate%5D.md)        |
|**Execution**     | **Microsoft Defender for Endpoint**: <br>- [SolarWinds processes launching PowerShell with Base64](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/3cb633cee8332b5eb968b4ae1947b9ddb7a5958f/Campaigns/launching-base64-powershell%5BSolorigate%5D.md) <br>- [SolarWinds processes launching CMD with echo](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/3cb633cee8332b5eb968b4ae1947b9ddb7a5958f/Campaigns/launching-cmd-echo%5BSolorigate%5D.md)       |
|**Command and control**     |  **Microsoft Defender for Endpoint**: <br>- [Command and control communications](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/3cb633cee8332b5eb968b4ae1947b9ddb7a5958f/Campaigns/c2-lookup-response%5BSolorigate%5D.md) <br>- [Command and control lookup](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/3cb633cee8332b5eb968b4ae1947b9ddb7a5958f/Campaigns/c2-lookup-from-nonbrowser%5BSolorigate%5D..md)       |
|**Credential access**     |  **Azure Active Directory (Microsoft Cloud App Security)**: <br>- [Credentials added to AAD app after admin consent](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/master/Persistence/CredentialsAddAfterAdminConsentedToApp%5BSolorigate%5D.md) <br>- [New access credential added to application or service principal](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/master/Persistence/NewAppOrServicePrincipalCredential%5BSolarigate%5D.md) <br>- [Domain federation trust settings modified](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/master/Defense%20evasion/ADFSDomainTrustMods%5BSolarigate%5D.md) <br>- [Add uncommon credential type to application](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/master/Privilege%20escalation/Add%20uncommon%20credential%20type%20to%20application%20%5BSolorigate%5D.md) <br>- [Service Principal Added To Role](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/master/Privilege%20escalation/ServicePrincipalAddedToRole%20%5BSolorigate%5D.md)       |
|**Exfiltration**     |    **Exchange Online (Microsoft Cloud App Security)**: <br>- [Mail Items Accessed Throttling Analytic](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/master/Exfiltration/MailItemsAccessed%20Throttling%20%5BSolorigate%5D.md)<br>- [Mail Items Accessed Anomaly Analytic](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/master/Exfiltration/Anomaly%20of%20MailItemAccess%20by%20GraphAPI%20%5BSolorigate%5D.md) <br>- [OAuth Apps reading mail via GraphAPI anomaly](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/master/Exfiltration/OAuth%20Apps%20reading%20mail%20via%20GraphAPI%20anomaly%20%5BSolorigate%5D.md) <br>- [OAuth Apps reading mail both via GraphAPI and directly](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/master/Exfiltration/OAuth%20Apps%20reading%20mail%20both%20via%20GraphAPI%20and%20directly%20%5BSolorigate%5D.md)     |
|     |         |
