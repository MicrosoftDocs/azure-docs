---
title: The Advanced Security Information Model (ASIM) DHCP normalization schema reference | Microsoft Docs
description: This article describes the Microsoft Sentinel DHCP normalization schema.
author: guywi-ms
ms.author: guywild
ms.topic: reference
ms.date: 11/09/2021

#Customer intent: As a security analyst, I want to understand the ASIM DHCP normalization schema so that I can effectively analyze DHCP server events and enhance network security.

---

# The Advanced Security Information Model (ASIM) DHCP normalization schema reference

The DHCP information model is used to describe events reported by a DHCP server, and is used by Microsoft Sentinel to enable source-agnostic analytics.

For more information, see [Normalization and the Advanced Security Information Model (ASIM)](normalization.md).

## Schema overview

The ASIM DHCP schema represents DHCP server activity, including serving requests for DHCP IP address leased from client systems and updating a DNS server with the leases granted.

The most important fields in a DHCP event are [SrcIpAddr](#srcipaddr) and [SrcHostname](#srchostname), which the DHCP server binds by granting the lease, and are aliased by [IpAddr](#ipaddr) and [Hostname](#hostname) fields respectively. The [SrcMacAddr](#srcmacaddr) field is also important as it represents the client machine used when an IP address isn't leased.  

A DHCP server may reject a client, either due to the security concerns, or because of network saturation. It may also quarantine a client by leasing to it an IP address that would connect it to a limited network. The [EventResult](normalization-common-fields.md#eventresult), [EventResultDetails](normalization-common-fields.md#eventresultdetails) and [DvcAction](normalization-common-fields.md#dvcaction) fields provide information about the DHCP server response and action.

A lease's duration is stored in the [DhcpLeaseDuration](#dhcpleaseduration) field.

## Schema details

ASIM is aligned with the [Open Source Security Events Metadata (OSSEM)](https://github.com/OTRF/OSSEM) project.

OSSEM doesn't have a DHCP schema comparable to the ASIM DHCP schema.

### Common ASIM fields

> [!IMPORTANT]
> Fields common to all schemas are described in detail in the [ASIM Common Fields](normalization-common-fields.md) article.
>

#### Common Fields with specific guidelines

The following list mentions fields that have specific guidelines for DHCP events:

| **Field** | **Class** | **Type**  | **Description** |
| --- | --- | --- | --- |
| **EventType** | Mandatory | Enumerated | Indicate the operation reported by the record. <br><Br> Possible values are `Assign`, `Renew`, `Release`, and `DNS Update`. <br><br>Example: `Assign`| 
| **EventSchemaVersion** | Mandatory | SchemaVersion (String) | The version of the schema documented here's **0.1.1**. |
| **EventSchema** | Mandatory | String | The name of the schema documented here's **DhcpEvent**. |
| **Dvc** fields| -      | -    | For DHCP events, device fields refer to the system that reports the DHCP event. |


#### All common fields

Fields that appear in the table are common to all ASIM schemas. Any guideline specified above overrides the general guidelines for the field. For example, a field might be optional in general, but mandatory for a specific schema. For more information on each field, see the [ASIM Common Fields](normalization-common-fields.md) article.


| **Class** | **Fields** |
| --------- | ---------- |
| Mandatory | - [EventCount](normalization-common-fields.md#eventcount)<br> - [EventStartTime](normalization-common-fields.md#eventstarttime)<br> - [EventEndTime](normalization-common-fields.md#eventendtime)<br> - [EventType](normalization-common-fields.md#eventtype)<br>- [EventResult](normalization-common-fields.md#eventresult)<br> - [EventProduct](normalization-common-fields.md#eventproduct)<br> - [EventVendor](normalization-common-fields.md#eventvendor)<br> - [EventSchema](normalization-common-fields.md#eventschema)<br> - [EventSchemaVersion](normalization-common-fields.md#eventschemaversion)<br> - [Dvc](normalization-common-fields.md#dvc)<br>|
| Recommended | - [EventResultDetails](normalization-common-fields.md#eventresultdetails)<br>- [EventSeverity](normalization-common-fields.md#eventseverity)<br>- [EventUid](normalization-common-fields.md#eventuid)<br> - [DvcIpAddr](normalization-common-fields.md#dvcipaddr)<br> - [DvcHostname](normalization-common-fields.md#dvchostname)<br> - [DvcDomain](normalization-common-fields.md#dvcdomain)<br>- [DvcDomainType](normalization-common-fields.md#dvcdomaintype)<br>- [DvcFQDN](normalization-common-fields.md#dvcfqdn)<br>- [DvcId](normalization-common-fields.md#dvcid)<br>- [DvcIdType](normalization-common-fields.md#dvcidtype)<br>- [DvcAction](normalization-common-fields.md#dvcaction)|
| Optional | - [EventMessage](normalization-common-fields.md#eventmessage)<br> - [EventSubType](normalization-common-fields.md#eventsubtype)<br>- [EventOriginalUid](normalization-common-fields.md#eventoriginaluid)<br>- [EventOriginalType](normalization-common-fields.md#eventoriginaltype)<br>- [EventOriginalSubType](normalization-common-fields.md#eventoriginalsubtype)<br>- [EventOriginalResultDetails](normalization-common-fields.md#eventoriginalresultdetails)<br> - [EventOriginalSeverity](normalization-common-fields.md#eventoriginalseverity) <br> - [EventProductVersion](normalization-common-fields.md#eventproductversion)<br> - [EventReportUrl](normalization-common-fields.md#eventreporturl)<br> - [EventOwner](normalization-common-fields.md#eventowner)<br>- [DvcZone](normalization-common-fields.md#dvczone)<br>- [DvcMacAddr](normalization-common-fields.md#dvcmacaddr)<br>- [DvcOs](normalization-common-fields.md#dvcos)<br>- [DvcOsVersion](normalization-common-fields.md#dvchostname)<br>- [DvcOriginalAction](normalization-common-fields.md#dvcoriginalaction)<br>- [DvcInterface](normalization-common-fields.md#dvcinterface)<br>- [AdditionalFields](normalization-common-fields.md#additionalfields)<br>- [DvcDescription](normalization-common-fields.md#dvcdescription)<br>- [DvcScopeId](normalization-common-fields.md#dvcscopeid)<br>- [DvcScope](normalization-common-fields.md#dvcscope)|


### DHCP-specific fields

| **Field** | **Class** | **Type** | **Notes** |
| --- | --- | --- | --- |
| <a name="dhcpleaseduration"></a>**DhcpLeaseDuration** | Optional | Integer | The length of the lease granted to a client, in seconds. |  
|<a name="dhcpsessionid"></a>**DhcpSessionId** | Optional | string | The session identifier as reported by the reporting device. For the Windows DHCP server, set this to the TransactionID field. <br><br>Example: `2099570186` |
| **SessionId** | Alias | String | Alias to [DhcpSessionId](#dhcpsessionid) |
| <a name="dhcpsessionduration"></a>**DhcpSessionDuration** | Optional | Integer | The amount of time, in milliseconds, for the completion of the DHCP session.<br><br>Example: `1500` |
| **Duration** | Alias | | Alias to [DhcpSessionDuration](#dhcpsessionduration) |
| **DhcpSrcDHCId** | Optional | String | The DHCP client ID, as defined by [RFC4701](https://datatracker.ietf.org/doc/html/rfc4701) |
| **DhcpCircuitId** | Optional | String | The DHCP circuit ID, as defined by [RFC3046](https://datatracker.ietf.org/doc/html/rfc3046) |
| **DhcpSubscriberId** | Optional | String | The DHCP subscriber ID, as defined by [RFC3993](https://datatracker.ietf.org/doc/html/rfc3993) |
| **DhcpVendorClassId**  | Optional | String | The DHCP Vendor Class Id, as defined by [RFC3925](https://datatracker.ietf.org/doc/html/rfc3925). |
| **DhcpVendorClass**  | Optional | String | The DHCP Vendor Class, as defined by [RFC3925](https://datatracker.ietf.org/doc/html/rfc3925).|
| **DhcpUserClassId**  | Optional | String | The DHCP User Class ID, as defined by [RFC3004](https://datatracker.ietf.org/doc/html/rfc3004).|
| **DhcpUserClass** | Optional | String | The DHCP User Class, as defined by [RFC3004](https://datatracker.ietf.org/doc/html/rfc3004).|
| <a name="requestedipaddr"></a>**RequestedIpAddr** | Optional | IP Address | The IP address requested by the DHCP client, when available.<br><br>Example: `192.168.12.3` |


### Source system fields

The source system is the system that requests a DHCP lease

| **Field** | **Class** | **Type** | **Notes** |
| --- | --- | --- | --- |
| <a name="src"></a>**Src** | Alias       | String     |    A unique identifier of the source device. <br><br>This field might alias the [SrcDvcId](#srcdvcid), [SrcHostname](#srchostname), or [SrcIpAddr](#srcipaddr) fields. <br><br>Example: `192.168.12.1`       |
| <a name="srcipaddr"></a>**SrcIpAddr** | Mandatory | IP Address | The IP address assigned to the client by the DHCP server.<br><br>Example: `192.168.12.1` |
| <a name="ipaddr"></a>**IpAddr** | Alias | | Alias for [SrcIpAddr](#srcipaddr) |
| <a name="srchostname"></a>**SrcHostname** | Mandatory | Hostname (String) | The hostname of the device requesting the DHCP lease. If no device name is available, store the relevant IP address in this field.<br><br>Example: `DESKTOP-1282V4D` |
| <a name="hostname"></a>**Hostname** | Alias | | Alias for [SrcHostname](#srchostname) |
| <a name="srcdomain"></a> **SrcDomain** | Recommended | Domain (String) | The domain of the source device.<br><br>Example: `Contoso` |
| <a name="srcdomaintype"></a>**SrcDomainType** | Conditional | Enumerated | The type of  [SrcDomain](#srcdomain), if known. Possible values include:<br>- `Windows` (such as: `contoso`)<br>- `FQDN` (such as: `microsoft.com`)<br><br>Required if [SrcDomain](#srcdomain) is used. |
| **SrcFQDN** | Optional | FQDN (String) | The source device hostname, including domain information when available. <br><br>**Note**: This field supports both traditional FQDN format and Windows domain\hostname format. The [SrcDomainType](#srcdomaintype) field reflects the format used. <br><br>Example: `Contoso\DESKTOP-1282V4D` |
| <a name="srcdvcid"></a>**SrcDvcId** | Optional | String | The ID of the source device as reported in the record.<br><br>For example: `ac7e9755-8eae-4ffc-8a02-50ed7a2216c3` |
| <a name="srcdvcscopeid"></a>**SrcDvcScopeId** | Optional | String | The cloud platform scope ID the device belongs to. **SrcDvcScopeId** map to a subscription ID on Azure and to an account ID on AWS. | 
| <a name="srcdvcscope"></a>**SrcDvcScope** | Optional | String | The cloud platform scope the device belongs to. **SrcDvcScope** map to a subscription ID on Azure and to an account ID on AWS. | 
| **SrcDvcIdType** | Conditional | Enumerated | The type of [SrcDvcId](#srcdvcid), if known. Possible values include:<br> - `AzureResourceId`<br>- `MDEid`<br><br>If multiple IDs are available, use the first one from the list above, and store the others in the **SrcDvcAzureResourceId** and **SrcDvcMDEid**, respectively.<br><br>**Note**: This field is required if [SrcDvcId](#srcdvcid) is used. |
| **SrcDeviceType** | Optional | Enumerated | The type of the source device. Possible values include:<br>- `Computer`<br>- `Mobile Device`<br>- `IOT Device`<br>- `Other` |
| <a name = "srcdescription"></a>**SrcDescription** | Optional | String | A descriptive text associated with the device. For example: `Primary Domain Controller`. |
| **SrcGeoCountry** | Optional | Country | The country/region associated with the source IP address.<br><br>Example: `USA` |
| **SrcGeoRegion** | Optional | Region | The region associated with the source IP address.<br><br>Example: `Vermont` |
| **SrcGeoCity** | Optional | City | The city associated with the source IP address.<br><br>Example: `Burlington` |
| **SrcGeoLatitude** | Optional | Latitude | The latitude of the geographical coordinate associated with the source IP address.<br><br>Example: `44.475833` |
| **SrcGeoLongitude** | Optional | Longitude | The longitude of the geographical coordinate associated with the source IP address.<br><br>Example: `73.211944` |
| **SrcRiskLevel** | Optional | Integer | The risk level associated with the source. The value should be adjusted to a range of `0` to `100`, with `0` for benign and `100` for a high risk.<br><br>Example: `90` |
| **SrcOriginalRiskLevel** | Optional | String | The risk level associated with the source, as reported by the reporting device. <br><br>Example: `Suspicious` |
| **SrcPortNumber** | Optional | Integer | The IP port from which the connection originated. Might not be relevant for a session comprising multiple connections.<br><br>Example: `2335` |

### Source user fields

| **Field** | **Class** | **Type** | **Notes** |
| --- | --- | --- | --- |
| <a name="srcuserid"></a>**SrcUserId**   | Optional  | String     |   A machine-readable, alphanumeric, unique representation of the source user. For more information, and for alternative fields for additional IDs, see [The User entity](normalization-entity-user.md).  <br><br>Example: `S-1-12-1-4141952679-1282074057-627758481-2916039507`    |
| <a name="srcuseridtype"></a>**SrcUserIdType** | Conditional  | UserIdType |  The type of the ID stored in the [SrcUserId](#srcuserid) field. For more information and list of allowed values, see [UserIdType](normalization-entity-user.md#useridtype) in the [Schema Overview article](normalization-about-schemas.md).|
| <a name="srcusername"></a>**SrcUsername** | Optional    | Username (String)     | The source username, including domain information when available. For more information, see [The User entity](normalization-entity-user.md).<br><br>Example: `AlbertE`     |
| **User** | Alias | | Alias for [SrcUsername](#srcusername) |
| <a name="srcusernametype"></a>**SrcUsernameType**  | Conditional    | UsernameType |   Specifies the type of the user name stored in the [SrcUsername](#srcusername) field. For more information, and list of allowed values, see [UsernameType](normalization-entity-user.md#usernametype) in the [Schema Overview article](normalization-about-schemas.md). <br><br>Example: `Windows`       |
| **SrcUserType**  | Optional | UserType | The type of the source user. For more information, and  list of allowed values, see [UserType](normalization-entity-user.md#usertype) in the [Schema Overview article](normalization-about-schemas.md).<br><br>For example: `Guest` |
| <a name="srcoriginalusertype"></a>**SrcOriginalUserType** | Optional | String | The original source user type, if provided by the source. |
| <a name="srcmacaddr"></a>**SrcMacAddr** | Mandatory | Mac Address | The MAC address of the client requesting a DHCP lease. <br><br>**Note**: The Windows DHCP server logs MAC address in a nonstandard way, omitting the colons, which should be inserted by the parser.<br><br>Example: `06:10:9f:eb:8f:14` |
| **SrcUserScope** | Optional | String | The scope, such as Microsoft Entra tenant, in which [SrcUserId](#srcuserid) and [SrcUsername](#srcusername) are defined. or more information and list of allowed values, see [UserScope](normalization-entity-user.md#userscope) in the [Schema Overview article](normalization-about-schemas.md).|
| **SrcUserScopeId** | Optional | String | The scope ID, such as Microsoft Entra Directory ID, in which [SrcUserId](#srcuserid) and [SrcUsername](#srcusername) are defined. for more information and list of allowed values, see [UserScopeId](normalization-entity-user.md#userscopeid) in the [Schema Overview article](normalization-about-schemas.md).|
| **SrcUserSessionId** | Optional     | String     |   The unique ID of the sign-in session of the Actor.  <br><br>Example: `102pTUgC3p8RIqHvzxLCHnFlg`  |


### Inspection fields

| **Field** | **Class** | **Type** | **Notes** |
| --- | --- | --- | --- |
| **Rule** | Alias | string | Either the value of RuleName or the value of RuleNumber. If the value of RuleNumber is used, the type should be converted to string. |
| **RuleNumber** | Optional | int | The number of the rule associated with the alert.<br><br>e.g. `123456` |
| **RuleName** | Optional | string | The name or ID of the rule associated with the alert.<br><br>e.g. `Server PSEXEC Execution via Remote Access` |
| **ThreatId** | Optional | string | The ID of the threat or malware identified in the alert.<br><br> e.g. `1234567891011121314` |
| **ThreatName** | Optional | string | The name of the threat or malware identified in the alert.<br><br> e.g. `Init.exe` |
| **ThreatFirstReportedTime** | Optional | Date/Time | Date and time when the threat was first reported.<br><br> e.g. `2024-09-19T10:12:10.0000000Z` |
| **ThreatLastReportedTime** | Optional | Date/Time | Date and time when the threat was last reported.<br><br> e.g. `2024-09-19T10:12:10.0000000Z` |
| **ThreatCategory** | Optional | String | 	The category of the threat or malware identified in the alert.<br><br>Supported values are: `Malware`, `Ransomware`, `Trojan`, `Virus`, `Worm`, `Adware`, `Spyware`, `Rootkit`, `Cryptominor`, `Phishing`, `Spam`, `MaliciousUrl`, `Spoofing`, `Security Policy Violation`, `Unknown` |
| **ThreatIsActive** | Optional | bool | Indicates whether the threat is currently active.<br><br>Supported values are: `True`, `False` |
| **ThreatRiskLevel** | Optional | RiskLevel (Integer) | The risk level associated with the threat. The level should be a number between 0 and 100.<br><br>Note: The value might be provided in the source record by using a different scale, which should be normalized to this scale. The original value should be stored in ThreatRiskLevelOriginal. |
| **ThreatOriginalRiskLevel** | Optional | string | The risk level as reported by the originating system. |
| **ThreatConfidence** | Optional | ConfidenceLevel (Integer) | The confidence level of the threat identified, normalized to a value between 0 and a 100. |
| **ThreatOriginalConfidence** | Optional | string | The confidence level as reported by the originating system. |


### Schema updates

The following are the changes in version 0.1.1 of the schema:

- Added inspection fields.
- Added the source geo-location fields.
- Added the source fields: `SrcDescription`, `SrcOriginalRiskLevel`, `SrcOriginalUserType`,`SrcPortNumber`, `SrcRiskLevel`, `SrcUserScope`, `SrcUserScopeId`, `SrcUserSessionId``SrcUserUid`
- Added the aliases `Src` and `User`
- The fields `SrcUserUid` and `ThreatField` are available in the `ASimDhcpEventLogs` table but are not part of the schema.


## Next steps

For more information, see:

- Watch the [ASIM Webinar](https://www.youtube.com/watch?v=WoGD-JeC7ng) or review the [slides](https://1drv.ms/b/s!AnEPjr8tHcNmjDY1cro08Fk3KUj-?e=murYHG)
- [Advanced Security Information Model (ASIM) overview](normalization.md)
- [Advanced Security Information Model (ASIM) schemas](normalization-about-schemas.md)
- [Advanced Security Information Model (ASIM) parsers](normalization-parsers-overview.md)
- [Advanced Security Information Model (ASIM) content](normalization-content.md)
