---
title: The Advanced Security Information Model (ASIM) Alert Events normalization schema reference (Public preview) | Microsoft Docs
description: This article displays the Microsoft Sentinel Alert Events normalization schema.
author: vakohl
ms.topic: reference
ms.date: 07/11/2024
ms.author: vakohl



#Customer intent: As a security analyst, I want to understand the ASIM Alert Events normalization schema so that I can accurately capture and categorize diverse alert types, enabling consistent and comprehensive monitoring across security platforms and improving threat detection and response efforts.

---

# The Advanced Security Information Model (ASIM) Alert Schema Reference

The Microsoft Sentinel Alert Schema is designed to normalize security-related alerts from various products into a standardized format within Microsoft Advanced Security Information Model (ASIM). This schema focuses exclusively on security events, ensuring consistent and efficient analysis across different data sources.

The Alert Schema represents various types of security alerts, such as threats, suspicious activities, user behavior anomalies and compliance violations. These alerts are reported by different security products and systems, including but not limited to EDRs, antivirus software, intrusion detection systems, data loss prevention tools etc.

For more information about normalization in Microsoft Sentinel, see [Normalization and the Advanced Security Information Model (ASIM)](normalization.md).

> [!IMPORTANT]
> The Alert normalization schema is currently in *preview*. This feature is provided without a service level agreement. We don't recommend it for production workloads.
>
> The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Parsers

For more information about ASIM parsers, see the [ASIM parsers overview](normalization-parsers-overview.md).

### Unifying Parsers

To use parsers that unify all ASIM out-of-the-box parsers and ensure that your analysis runs across all the configured sources, use the `_Im_AlertEvent` filtering parser or the `_ASim_AlertEvent` parameter-less parser. You can also use workspace-deployed `imAlertEvent` and `ASimAlertEvent` parsers by deploying them from the [Microsoft Sentinel GitHub repository](https://aka.ms/DeployASIM).

For more information, see [built-in ASIM parsers and workspace-deployed parsers](normalization-parsers-overview.md#built-in-asim-parsers-and-workspace-deployed-parsers).

### Out-of-the-box, Source-specific Parsers

For the list of the Alert parsers Microsoft Sentinel provides out-of-the-box, refer to the [ASIM parsers list](normalization-parsers-list.md#alert-event-parsers).

### Add Your Own Normalized Parsers

When [developing custom parsers](normalization-develop-parsers.md) for the Alert information model, name your KQL functions using the following syntax:
- `vimAlertEvent<vendor><Product>` for parameterized parsers
- `ASimAlertEvent<vendor><Product>` for regular parsers

Refer to the article [Managing ASIM parsers](normalization-manage-parsers.md) to learn how to add your custom parsers to the alert unifying parsers.

### Filtering Parser Parameters

The Alert parsers support various [filtering parameters](normalization-about-parsers.md#optimizing-parsing-using-parameters) to improve query performance. These parameters are optional but can enhance your query performance. The following filtering parameters are available:

| Name | Type | Description |
|------|------|-------------|
| **starttime** | datetime | Filter only alerts that started at or after this time. |
| **endtime** | datetime | Filter only alerts that started at or before this time. |
| **ipaddr_has_any_prefix** | dynamic | Filter only alerts for which the **'DvcIpAddr'** field is in one of the listed values. |
| **hostname_has_any** | dynamic | Filter only alerts for which the **'DvcHostname'** field is in one of the listed values. |
| **username_has_any** | dynamic | Filter only alerts for which the **'Username'** field is in one of the listed values. |
| **attacktactics_has_any** | dynamic | Filter only alerts for which the **'AttackTactics'** field is in one of the listed values. |
| **attacktechniques_has_any** | dynamic | Filter only alerts for which the **'AttackTechniques'** field is in one of the listed values. |
| **threatcategory_has_any** | dynamic | Filter only alerts for which the **'ThreatCategory'** field is in one of the listed values. |
| **alertverdict_has_any** | dynamic | Filter only alerts for which the **'AlertVerdict'** field is in one of the listed values. |
| **eventseverity_has_any** | dynamic | Filter only alerts for which the **'EventSeverity'** field is in one of the listed values. |


## Schema Overview

The Alert Schema serves several types of security events, which share the same fields. These events are identified by the EventType field:

- **Threat Info**: Alerts related to various types of malicious activities such as malware, phishing, ransomware, and other cyber threats.
- **Suspicious Activities**: Alerts for activities that are not necessarily confirmed threats but are suspicious and warrant further investigation, such as multiple failed login attempts or access to restricted files.
- **User Behavior Anomalies**: Alerts indicating unusual or unexpected user behavior that might suggest a security issue, such as abnormal login times or unusual data access patterns.
- **Compliance Violations**: Alerts related to non-compliance with regulatory or internal policies. For example, a VM exposed with open public ports vulnerable to attacks (Cloud Security Alert).

> [!IMPORTANT]
>To preserve the relevance and effectiveness of the Alert Schema, only security-related alerts should be mapped.
>

Alert schema refers the following entities to capture details about the alert:<br>

- **Dvc** fields are used to capture details about the host or Ip associated with the alert<br>
- **User** fields are used to capture details about the user associated with the alert.<br>
- Similarly **Process**, **File**, **Url**, **Registry** and **Email** fields are used to capture only key details about the process, file, Url, registry and email associated with the alert respectively.

> [!IMPORTANT]
> - When building a product-specific parser, use the ASIM Alert schema when the alert contains information about a security incident or potential threat, and the primary details can be mapped directly to available Alert schema fields. The Alert schema is ideal for capturing summary information without extensive entity-specific fields.
> - However, if you find yourself placing essential fields in 'AdditionalFields' due to a lack of direct field matches, consider a more specialized schema. For example, if an alert includes network-related details such as multiple IP addresses e.g. SrcIpAdr, DstIpAddr, PortNumber etc. then you may opt for the NetworkSession schema over the Alert schema. Specialized schemas also provide dedicated fields for capturing threat-related information, enhancing data quality and facilitating efficient analysis.
>

## Schema Details

### Common ASIM Fields

The following list mentions fields that have specific guidelines for Alert events:

| Field | Class | Type | Description |
|-------|-------|------|-------------|
| **EventType** | Mandatory | Enumerated | Type of the event.<br><br>Supported values are:<br>-`Alert` |
| **EventSubType** | Recommended | Enumerated | Specifies the subtype or category of the alert event, providing more granular detail within the broader event classification. This field helps distinguish the nature of the detected issue, improving incident prioritization and response strategies.<br><br>Supported values include:<br>- `Threat` (Represents a confirmed or highly likely malicious activity that could compromise the system or network)<br>- `Suspicious Activity` (Flags behavior or events that appear unusual or suspicious, though not yet confirmed as malicious)<br>- `Anomaly` (Identifies deviations from normal patterns that could indicate a potential security risk or operational issue)<br>- `Compliance Violation` (Highlights activities that breach regulatory, policy, or compliance standards) |
| **EventUid** | Mandatory | string | A machine-readable, alphanumeric string that uniquely identifies an alert within a system. <br> e.g. `A1bC2dE3fH4iJ5kL6mN7oP8qR9s` |
| **EventMessage** | Optional | string | Detailed information about the alert, including its context, cause, and potential impact. <br> e.g. `Potential use of the Rubeus tool for kerberoasting, a technique used to extract service account credentials from Kerberos tickets.` |
| **IpAddr** | Alias | | Alias or friendly name for `DvcIpAddr` field. |
| **Hostname** | Alias | | Alias or friendly name for `DvcHostname` field. |
| **EventSchema** | Mandatory | string | The schema used for the event. The schema documented here is `AlertEvent`. |
| **EventSchemaVersion** | Mandatory | string | The version of the schema. The version of the schema documented here is `0.1`. |

### All Common Fields

Fields that appear in the table below are common to all ASIM schemas. Any guideline specified above overrides the general guidelines for the field. For example, a field might be optional in general, but mandatory for a specific schema. For more information on each field, refer to the [ASIM Common Fields](normalization-common-fields.md) article.

| Class | Fields |
|-------|-------|
| Mandatory | - [EventCount](normalization-common-fields.md#eventcount)<br>- [EventStartTime](normalization-common-fields.md#eventstarttime)<br>- [EventEndTime](normalization-common-fields.md#eventendtime)<br>- [EventType](normalization-common-fields.md#eventtype)<br>- [EventUid](normalization-common-fields.md#eventuid)<br>- [EventProduct](normalization-common-fields.md#eventproduct)<br>- [EventVendor](normalization-common-fields.md#eventvendor)<br>- [EventSchema](normalization-common-fields.md#eventschema)<br>- [EventSchemaVersion](normalization-common-fields.md#eventschemaversion) |
| Recommended | - [EventSubType](normalization-common-fields.md#eventsubtype)<br>- [EventSeverity](normalization-common-fields.md#eventseverity)<br>-  [DvcIpAddr](normalization-common-fields.md#dvcipaddr)<br>- [DvcHostname](normalization-common-fields.md#dvchostname)<br>- [DvcDomain](normalization-common-fields.md#dvcdomain)<br>- [DvcDomainType](normalization-common-fields.md#dvcdomaintype)<br>- [DvcFQDN](normalization-common-fields.md#dvcfqdn)<br>- [DvcId](normalization-common-fields.md#dvcid)<br>- [DvcIdType](normalization-common-fields.md#dvcidtype) |
| Optional | - [EventMessage](normalization-common-fields.md#eventmessage)<br>- [EventOriginalType](normalization-common-fields.md#eventoriginaltype)<br>- [EventOriginalSubType](normalization-common-fields.md#eventoriginalsubtype)<br>- [EventOriginalSeverity](normalization-common-fields.md#eventoriginalseverity)<br>- [EventProductVersion](normalization-common-fields.md#eventproductversion)<br> - [EventOriginalUid](normalization-common-fields.md#eventoriginaluid)<br>- [EventReportUrl](normalization-common-fields.md#eventreporturl)<br>- [EventResult](normalization-common-fields.md#eventresult) <br>- [EventOwner](normalization-common-fields.md#eventowner)<br>- [DvcZone](normalization-common-fields.md#dvczone)<br>- [DvcMacAddr](normalization-common-fields.md#dvcmacaddr)<br>- [DvcOs](normalization-common-fields.md#dvcos)<br>- [DvcOsVersion](normalization-common-fields.md#dvchostname)<br>- [DvcAction](normalization-common-fields.md#dvcaction)<br>- [DvcOriginalAction](normalization-common-fields.md#dvcoriginalaction)<br>- [DvcInterface](normalization-common-fields.md#dvcinterface)<br>- [AdditionalFields](normalization-common-fields.md#additionalfields)<br>- [DvcDescription](normalization-common-fields.md#dvcdescription)<br>- [DvcScopeId](normalization-common-fields.md#dvcscopeid)<br>- [DvcScope](normalization-common-fields.md#dvcscope) |


### Inspection Fields

The following table covers fields that provide critical insights into the rules and threats associated with alerts. Together, they help enrich the context of the alert, making it easier for security analysts to understand its origin and significance.

| Field | Class | Type | Description |
|-------|-------|------|-------------|
| **AlertId** | Alias | string | Alias or friendly name for `EventUid` field. |
| **AlertName** | Recommended | string | Title or name of the alert.<br>e.g. `Possible use of the Rubeus kerberoasting tool` |
| **AlertDescription** | Alias | string | Alias or friendly name for `EventMessage` field.|
| **AlertVerdict** | Optional | Enumerated | The final determination or outcome of the alert, indicating whether the alert was confirmed as a threat, deemed suspicious, or resolved as a false positive.<br><br>Supported values are:<br>- `True Positive` (Confirmed as a legitimate threat)<br>- `False Positive` (Incorrectly identified as a threat)<br>- `Benign Positive` (when event is determined to be harmless)<br>- `Unknown` (Uncertain or undetermined status) |
| **AlertStatus** | Optional | Enumerated | Indicates the current state or progress of the alert.<br><br>Supported values are:<br>- `Active`<br>- `Closed` |
| **AlertOriginalStatus** | Optional | string | The status of the alert as reported by the originating system. |
| **DetectionMethod** | Optional | Enumerated | Provides detailed information about the specific detection method, technology, or data source that contributed to the generation of the alert. This field offers greater insight into how the alert was detected or triggered, aiding in the understanding of the detection context and reliability.<br><br>Supported values include:<br>- `EDR`: Endpoint Detection and Response systems that monitor and analyze endpoint activities to identify threats.<br>- `Behavioral Analytics`: Techniques that detect abnormal patterns in user, device, or system behavior.<br>- `Reputation`: Threat detection based on the reputation of IP addresses, domains, or files.<br>- `Threat Intelligence`: External or internal intelligence feeds providing data on known threats or adversary tactics.<br>- `Intrusion Detection`: Systems that monitor network traffic or activities for signs of intrusions or attacks.<br>- `Automated Investigation`: Automated systems that analyze and investigate alerts, reducing manual workload.<br>- `Antivirus`: Traditional antivirus engines that detect malware based on signatures and heuristics.<br>- `Data Loss Prevention`: Solutions focused on preventing unauthorized data transfers or leaks.<br>- `User Defined Blocked List`: Custom lists defined by users to block specific IPs, domains, or files.<br>- `Cloud Security Posture Management`: Tools that assess and manage security risks in cloud environments.<br>- `Cloud Application Security`: Solutions that secure cloud applications and data.<br>-`Scheduled Alerts`: Alerts generated based on predefined schedules or thresholds.<br>- `Other`: Any other detection method not covered by the above categories. |
| **Rule** | Alias | string | Either the value of RuleName or the value of RuleNumber. If the value of RuleNumber is used, the type should be converted to string. |
| **RuleNumber** | Optional | int | The number of the rule associated with the alert.<br><br>e.g. `123456` |
| **RuleName** | Optional | string | The name or ID of the rule associated with the alert.<br><br>e.g. `Server PSEXEC Execution via Remote Access` |
| **RuleDescription** | Optional | string | Description of the rule associated with the alert.<br><br>e.g. `This rule detects remote execution on a server using PSEXEC, which may indicate unauthorized administrative activity or lateral movement within the network` |
| **ThreatId** | Optional | string | The ID of the threat or malware identified in the alert.<br><br> e.g. `1234567891011121314` |
| **ThreatName** | Optional | string | The name of the threat or malware identified in the alert.<br><br> e.g. `Init.exe` |
| **ThreatFirstReportedTime** | Optional | datetime | Date and time when the threat was first reported.<br><br> e.g. `2024-09-19T10:12:10.0000000Z` |
| **ThreatLastReportedTime** | Optional | datetime | Date and time when the threat was last reported.<br><br> e.g. `2024-09-19T10:12:10.0000000Z` |
| **ThreatCategory** | Recommended | Enumerated | 	The category of the threat or malware identified in the alert.<br><br>Supported values are: `Malware`, `Ransomware`, `Trojan`, `Virus`, `Worm`, `Adware`, `Spyware`, `Rootkit`, `Cryptominor`, `Phishing`, `Spam`, `MaliciousUrl`, `Spoofing`, `Security Policy Violation`, `Unknown` |
| **ThreatOriginalCategory** | Optional | string | The category of the threat as reported by the originating system. |
| **ThreatIsActive** | Optional | bool | Indicates whether the threat is currently active.<br><br>Supported values are: `True`, `False` |
| **ThreatRiskLevel** | Optional | int | The risk level associated with the threat. The level should be a number between 0 and 100.<br><br>Note: The value might be provided in the source record by using a different scale, which should be normalized to this scale. The original value should be stored in ThreatRiskLevelOriginal. |
| **ThreatOriginalRiskLevel** | Optional | string | The risk level as reported by the originating system. |
| **ThreatConfidence** | Optional | int | The confidence level of the threat identified, normalized to a value between 0 and a 100. |
| **ThreatOriginalConfidence** | Optional | string | The confidence level as reported by the originating system. |
| **IndicatorType** | Recommended | Enumerated | The type or category of the indicator<br><br>Supported values are:<br>-`Ip`<br>-`User`<br>-`Process`<br>-`Registry`<br>-`Url`<br>-`Host`<br>-`Cloud Resource`<br>-`Application`<br>-`File`<br>-`Email`<br>-`Mailbox`<br>-`Logon Session`|
| **IndicatorAssociation** | Optional | Enumerated | Specifies whether the indicator is linked to or directly impacted by the threat.<br><br>Supported values are:<br>-`Associated`<br>-`Targeted` |
| **AttackTactics** | Recommended | string | The attack tactics (name, ID, or both) associated with the alert.<br> Preferred format:<br><br>e.g: `Persistence, Privilege Escalation` |
| **AttackTechniques** | Recommended | string | The attack techniques (name, ID, or both) associated with the alert. <br> Preferred format:<br><br>e.g: `Local Groups (T1069.001), Domain Groups (T1069.002)` |
| **AttackRemediationSteps** | Recommended | string | Recommended actions or steps to mitigate or remediate the identified attack or threat. <br> e.g.<br> `1. Make sure the machine is completely updated and all your software has the latest patch.`<br>`2. Contact your incident response team.` |

### User Fields

This section defines fields related to the identification and classification of users associated with an alert, providing clarity on the impacted user and the format of their identity. If the alert contains additional, multiple user-related fields that exceed what is mapped here, you may consider whether a specialized schema, such as the Authentication Event schema, may be more appropriate to fully represent the data.

| Field | Class | Type | Description |
|-------|-------|------|-------------|
| **UserId** | Optional | string | A machine-readable, alphanumeric, unique representation of the user associated with the alert.<br><br>e.g. `A1bC2dE3fH4iJ5kL6mN7o` |
| **UserIdType** | Conditional | Enumerated | The type of the user ID, such as `GUID`, `SID`, or `Email`.<br><br>Supported values are:<br>- `GUID`<br>- `SID`<br>- `Email`<br>- `Username`<br>- `Phone`<br>- `Other` |
| **Username** | Recommended | string | Name of the user associated with the alert, including domain information when available.<br><br>e.g. `Contoso\JSmith` or `john.smith@contoso.com` |
| **User** | Alias | string | Alias or friendly name for `Username` field. |
| **UsernameType** | Conditional | UsernameType | Specifies the type of the user name stored in the `Username` field. For more information, and list of allowed values, see [UsernameType](normalization-about-schemas.md#usernametype) in the [Schema Overview article](normalization-about-schemas.md).<br><br>e.g. `Windows` |
| **UserType** | Optional | UserType | The type of the Actor. For more information, and list of allowed values, see [UserType](normalization-about-schemas.md#usertype) in the [Schema Overview article](normalization-about-schemas.md).<br><br> e.g. `Guest`|
| **OriginalUserType** | Optional | string | The user type as reported by the reporting device. |
| **UserSessionId** | Optional | string | The unique ID of the user's session associated with the alert.<br><br>e.g. `a1bc2de3-fh4i-j5kl-6mn7-op8qr9st0u` |
| **UserScopeId** | Optional | string | The scope ID, such as Microsoft Entra Directory ID, in which UserId and Username are defined.<br><br>e.g. `a1bc2de3-fh4i-j5kl-6mn7-op8qrs` |
| **UserScope** | Optional | string | The scope, such as Microsoft Entra tenant, in which UserId and Username are defined. or more information and list of allowed values, see [UserScope](normalization-about-schemas.md#userscope) in the [Schema Overview article](normalization-about-schemas.md).<br><br>e.g. `Contoso Directory` |

### Process Fields

This section allows you to capture details related to a process entity involved in an alert using the specified fields. If the alert contains additional, detailed process-related fields that exceed what is mapped here, you may consider whether a specialized schema, such as the Process Event schema, may be more appropriate to fully represent the data.

| Field | Class | Type | Description |
|-------|-------|------|-------------|
| **ProcessId** | Optional | string | The process ID (PID) associated with the alert.<br><br>e.g. `12345678` |
| **ProcessCommandLine** | Optional | string | Command line used to start the process.<br><br>e.g. `"choco.exe" -v` |
| **ProcessName** | Optional | string | Name of the process.<br><br>e.g. `C:\Windows\explorer.exe` |
| **ProcessFileCompany** | Optional | string | Company that created the process image file.<br><br>e.g. `Microsoft` |

### File Fields

This section enables you to capture details related to a file entity involved in an alert. If the alert contains additional, detailed file-related fields that exceed what is mapped here, you may consider whether a specialized schema, such as the File Event schema, may be more appropriate to fully represent the data.

| Field | Class | Type | Description |
|-------|-------|------|-------------|
| **FileName** | Optional | string | Name of the file associated with the alert, without path or a location.<br><br>e.g. `Notepad.exe` |
| **FilePath** | Optional | string | he full, normalized path of the target file, including the folder or location, the file name, and the extension.<br><br>e.g. `C:\Windows\System32\notepad.exe` |
| **FileSHA1** | Optional | string | SHA1 hash of the file.<br><br>e.g. `j5kl6mn7op8qr9st0uv1` |
| **FileSHA256** | Optional | string | SHA256 hash of the file.<br><br>e.g. `a1bc2de3fh4ij5kl6mn7op8qrs2de3` |
| **FileMD5** | Optional | string | MD5 hash of the file.<br><br>e.g. `j5kl6mn7op8qr9st0uv1wx2yz3ab4c` |
| **FileSize** | Optional | long | Size of the file in bytes.<br><br>e.g. `123456` |

### Url Field

If your alert includes information about Url entity, the following fields can capture URL-related data.

| Field | Class | Type | Description |
|-------|-------|------|-------------|
| **Url** | Optional | string | The URL string captured in the alert.<br><br>e.g. `https://contoso.com/fo/?k=v&amp;q=u#f` |

### Registry Fields

If your alert includes details about registry entity, use the following fields to capture specific registry-related information.

| Field | Class | Type | Description |
|-------|-------|------|-------------|
| **RegistryKey** | Optional | string | The registry key associated with the alert, normalized to standard root key naming conventions.<br><br>e.g. `HKEY_LOCAL_MACHINE\SOFTWARE\MTG` |
| **RegistryValue** | Optional | string | Registry value.<br><br>e.g. `ImagePath` |
| **RegistryValueData** | Optional | string | Data of the registry value.<br><br>e.g. `C:\Windows\system32;C:\Windows;` |
| **RegistryValueType** | Optional | Enumerated | Type of the registry value.<br><br>e.g. `Reg_Expand_Sz` |

### Email Fields

If your alert includes information about email entity, use the following fields to capture specific email-related details.

| Field | Class | Type | Description |
|-------|-------|------|-------------|
| **EmailMessageId** | Optional | string | Unique identifier for the email message, associated with the alert.<br><br>e.g. `Request for Invoice Access` |
| **EmailSubject** | Optional | string | Subject of the email.<br><br>e.g. `j5kl6mn7-op8q-r9st-0uv1-wx2yz3ab4c` |



## Schema Updates

The following are the changes in various versions of the schema:

- **Version 0.1**: Initial release.