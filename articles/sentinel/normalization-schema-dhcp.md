---
title: The Advanced Security Information Model (ASIM) DHCP normalization schema reference (Public preview) | Microsoft Docs
description: This article describes the Microsoft Sentinel DHCP normalization schema.
author: limwainstein
ms.topic: reference
ms.date: 11/09/2021
ms.author: lwainstein
ms.custom: ignite-fall-2021
---

# The Advanced Security Information Model (ASIM) DHCP normalization schema reference (Public preview)

The DHCP information model is used to describe events reported by a DHCP server, and is used by Microsoft Sentinel to enable source-agnostic analytics.

For more information, see [Normalization and the Advanced Security Information Model (ASIM)](normalization.md).

> [!IMPORTANT]
> The DHCP normalization schema is currently in PREVIEW. This feature is provided without a service level agreement, and is not recommended for production workloads.
>
> The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Schema overview

The ASIM DHCP schema represents DHCP server activity, including serving requests for DHCP IP address leased from client systems and updating a DNS server with the leases granted.

The most important fields in a DHCP event are [SrcIpAddr](#srcipaddr) and [SrcHostname](#srchostname), which the DHCP server binds by granting the lease, and are aliased by [IpAddr](#ipaddr) and [Hostname](#hostname) fields respectively. The [SrcMacAddr](#srcmacaddr) field is also important as it represents the client machine used when an IP address is not leased.  

A DHCP server may reject a client, either due to the security concerns, or because of network saturation. It may also quarantine a client by leasing to it an IP address that would connect it to a limited network. The [EventResult](normalization-common-fields.md#eventresult), [EventResultDetails](normalization-common-fields.md#eventresultdetails) and [DvcAction](normalization-common-fields.md#dvcaction) fields provide information about the DHCP server response and action.

A lease's duration is stored in the [DhcpLeaseDuration](#dhcpleaseduration) field.

## Schema details

ASIM is aligned with the [Open Source Security Events Metadata (OSSEM)](https://github.com/OTRF/OSSEM) project.

OSSEM does not have a DHCP schema comparable to the ASIM DHCP schema.

### Common ASIM fields

> [!IMPORTANT]
> Fields common to all schemas are described in detail in the [ASIM Common Fields](normalization-common-fields.md) article.
>

#### Common Fields with specific guidelines

The following list mentions fields that have specific guidelines for DHCP events:

| **Field** | **Class** | **Type**  | **Description** |
| --- | --- | --- | --- |
| **EventType** | Mandatory | Enumerated | Indicate the operation reported by the record. <br><Br> Possible values are `Assign`, `Renew`, `Release` and `DNS Update`. <br><br>Example: `Assign`| 
| **EventSchemaVersion** | Mandatory | String | The version of the schema documented here is **0.1**. |
| **EventSchema** | Mandatory | String | The name of the schema documented here is **Dhcp**. |
| **Dvc** fields| -      | -    | For DHCP events, device fields refer to the system that reports the DHCP event. |


#### All common fields

Fields that appear in the table below are common to all ASIM schemas. Any guideline specified above overrides the general guidelines for the field. For example, a field might be optional in general, but mandatory for a specific schema. For further details on each field, refer to the [ASIM Common Fields](normalization-common-fields.md) article.


| **Class** | **Fields** |
| --------- | ---------- |
| Mandatory | - [EventCount](normalization-common-fields.md#eventcount)<br> - [EventStartTime](normalization-common-fields.md#eventstarttime)<br> - [EventEndTime](normalization-common-fields.md#eventendtime)<br> - [EventType](normalization-common-fields.md#eventtype)<br>- [EventResult](normalization-common-fields.md#eventresult)<br> - [EventProduct](normalization-common-fields.md#eventproduct)<br> - [EventVendor](normalization-common-fields.md#eventvendor)<br> - [EventSchema](normalization-common-fields.md#eventschema)<br> - [EventSchemaVersion](normalization-common-fields.md#eventschemaversion)<br> - [Dvc](normalization-common-fields.md#dvc)<br>|
| Recommended | - [EventResultDetails](normalization-common-fields.md#eventresultdetails)<br>- [EventSeverity](normalization-common-fields.md#eventseverity)<br>- [EventUid](normalization-common-fields.md#eventuid)<br> - [DvcIpAddr](normalization-common-fields.md#dvcipaddr)<br> - [DvcHostname](normalization-common-fields.md#dvchostname)<br> - [DvcDomain](normalization-common-fields.md#dvcdomain)<br>- [DvcDomainType](normalization-common-fields.md#dvcdomaintype)<br>- [DvcFQDN](normalization-common-fields.md#dvcfqdn)<br>- [DvcId](normalization-common-fields.md#dvcid)<br>- [DvcIdType](normalization-common-fields.md#dvcidtype)<br>- [DvcAction](normalization-common-fields.md#dvcaction)|
| Optional | - [EventMessage](normalization-common-fields.md#eventmessage)<br> - [EventSubType](normalization-common-fields.md#eventsubtype)<br>- [EventOriginalUid](normalization-common-fields.md#eventoriginaluid)<br>- [EventOriginalType](normalization-common-fields.md#eventoriginaltype)<br>- [EventOriginalSubType](normalization-common-fields.md#eventoriginalsubtype)<br>- [EventOriginalResultDetails](normalization-common-fields.md#eventoriginalresultdetails)<br> - [EventOriginalSeverity](normalization-common-fields.md#eventoriginalseverity) <br> - [EventProductVersion](normalization-common-fields.md#eventproductversion)<br> - [EventReportUrl](normalization-common-fields.md#eventreporturl)<br> - [EventOwner](normalization-common-fields.md#eventowner)<br>- [DvcZone](normalization-common-fields.md#dvczone)<br>- [DvcMacAddr](normalization-common-fields.md#dvcmacaddr)<br>- [DvcOs](normalization-common-fields.md#dvcos)<br>- [DvcOsVersion](normalization-common-fields.md#dvchostname)<br>- [DvcOriginalAction](normalization-common-fields.md#dvcoriginalaction)<br>- [DvcInterface](normalization-common-fields.md#dvcinterface)<br>- [AdditionalFields](normalization-common-fields.md#additionalfields)<br>- [DvcDescription](normalization-common-fields.md#dvcdescription)<br>- [DvcScopeId](normalization-common-fields.md#dvcscopeid)<br>- [DvcScope](normalization-common-fields.md#dvcscope)|


### DHCP-specific fields

The fields below are specific to DHCP events, but many are similar to fields in other schemas and follow the same naming convention.

| **Field** | **Class** | **Type** | **Notes** |
| --- | --- | --- | --- |
| <a name="srcipaddr"></a>**SrcIpAddr** | Mandatory | IP Address | The IP address assigned to the client by the DHCP server.<br><br>Example: `192.168.12.1` |
| <a name="ipaddr"></a>**IpAddr** | Alias | | Alias for [SrcIpAddr](#srcipaddr) |
| <a name="requestedipaddr"></a>**RequestedIpAddr** | Optional | IP Address | The IP address requested by the DHCP client, when available.<br><br>Example: `192.168.12.3` |
| <a name="srchostname"></a>**SrcHostname** | Mandatory | String | The hostname of the device requesting the DHCP lease. If no device name is available, store the relevant IP address in this field.<br><br>Example: `DESKTOP-1282V4D` |
| <a name="hostname"></a>**Hostname** | Alias | | Alias for [SrcHostname](#srchostname) |
| <a name="srcdomain"></a> **SrcDomain** | Recommended | String | The domain of the source device.<br><br>Example: `Contoso` |
| <a name="srcdomaintype"></a>**SrcDomainType** | Conditional | Enumerated | The type of  [SrcDomain](#srcdomain), if known. Possible values include:<br>- `Windows` (such as: `contoso`)<br>- `FQDN` (such as: `microsoft.com`)<br><br>Required if [SrcDomain](#srcdomain) is used. |
| **SrcFQDN** | Optional | String | The source device hostname, including domain information when available. <br><br>**Note**: This field supports both traditional FQDN format and Windows domain\hostname format. The [SrcDomainType](#srcdomaintype) field reflects the format used. <br><br>Example: `Contoso\DESKTOP-1282V4D` |
| <a name="srcdvcid"></a>**SrcDvcId** | Optional | String | The ID of the source device as reported in the record.<br><br>For example: `ac7e9755-8eae-4ffc-8a02-50ed7a2216c3` |
| <a name="srcdvcscopeid"></a>**SrcDvcScopeId** | Optional | String | The cloud platform scope ID the device belongs to. **SrcDvcScopeId** map to a subscription ID on Azure and to an account ID on AWS. | 
| <a name="srcdvcscope"></a>**SrcDvcScope** | Optional | String | The cloud platform scope the device belongs to. **SrcDvcScope** map to a subscription ID on Azure and to an account ID on AWS. | 
| **SrcDvcIdType** | Conditional | Enumerated | The type of [SrcDvcId](#srcdvcid), if known. Possible values include:<br> - `AzureResourceId`<br>- `MDEid`<br><br>If multiple IDs are available, use the first one from the list above, and store the others in the **SrcDvcAzureResourceId** and **SrcDvcMDEid**, respectively.<br><br>**Note**: This field is required if [SrcDvcId](#srcdvcid) is used. |
| **SrcDeviceType** | Optional | Enumerated | The type of the source device. Possible values include:<br>- `Computer`<br>- `Mobile Device`<br>- `IOT Device`<br>- `Other` |
| <a name="srcuserid"></a>**SrcUserId** | Optional | String | A machine-readable, alphanumeric, unique representation of the source user. Format and supported types include:<br>- **SID** (Windows): `S-1-5-21-1377283216-344919071-3415362939-500`<br>- **UID** (Linux): `4578`<br>- **AADID** (Microsoft Entra ID): `9267d02c-5f76-40a9-a9eb-b686f3ca47aa`<br>- **OktaId**: `00urjk4znu3BcncfY0h7`<br>- **AWSId**: `72643944673`<br><br>Store the ID type in the [SrcUserIdType](#srcuseridtype) field. If other IDs are available, we recommend that you normalize the field names to SrcUserSid, SrcUserUid, SrcUserAadId, SrcUserOktaId and UserAwsId, respectively.<br><br>Example: `S-1-12` |
| <a name="srcuseridtype"></a>**SrcUserIdType** | Conditional | Enumerated | The type of the ID stored in the [SrcUserId](#srcuserid) field. Supported values include: `SID`, `UIS`, `AADID`, `OktaId`, and `AWSId`. |
| <a name="srcusername"></a>**SrcUsername** | Optional | String | The Source username, including domain information when available. Use one of the following formats and in the following order of priority:<br>- **Upn/Email**: `johndow@contoso.com`<br>- **Windows**: `Contoso\johndow`<br>- **DN**: `CN=Jeff Smith,OU=Sales,DC=Fabrikam,DC=COM`<br>- **Simple**: `johndow`. Use the Simple form only if domain information is not available.<br><br>Store the Username type in the [SrcUsernameType](#srcusernametype) field. If other IDs are available, we recommend that you normalize the field names to **SrcUserUpn**, **SrcUserWindows** and **SrcUserDn**.<br><br>For more information, see [The User entity](normalization-about-schemas.md#the-user-entity).<br><br>Example: `AlbertE` |
| **Username** | Alias | | Alias for [SrcUsername](#srcusername) |
| <a name="srcusernametype"></a>**SrcUsernameType** | Conditional | Enumerated | Specifies the type of the username stored in the [SrcUsername](#srcusername) field. Supported values are: `UPN`, `Windows`, `DN`, and `Simple`. For more information, see [The User entity](normalization-about-schemas.md#the-user-entity).<br><br>Example: `Windows` |
| **SrcUserType** | Optional | Enumerated | The type of Actor. Allowed values are:<br>- `Regular`<br>- `Machine`<br>- `Admin`<br>- `System`<br>- `Application`<br>- `Service Principal`<br>- `Other`<br><br>**Note**: The value may be provided in the source record using different terms, which should be normalized to these values. Store the original value in the [EventOriginalUserType](#srcoriginalusertype) field. |
| <a name="srcoriginalusertype"></a>**SrcOriginalUserType** | | | The original source user type, if provided by the source. |
| <a name="srcmacaddr"></a>**SrcMacAddr** | Mandatory | Mac Address | The MAC address of the client requesting a DHCP lease. <br><br>**Note**: The Windows DHCP server logs MAC address in a non-standard way, omitting the colons, which should be inserted by the parser.<br><br>Example: `06:10:9f:eb:8f:14` |
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
| **DhcpUserClassId**  | Optional | String | The DHCP User Class Id, as defined by [RFC3004](https://datatracker.ietf.org/doc/html/rfc3004).|
| **DhcpUserClass** | Optional | String | The DHCP User Class, as defined by [RFC3004](https://datatracker.ietf.org/doc/html/rfc3004).|


## Next steps

For more information, see:

- Watch the [ASIM Webinar](https://www.youtube.com/watch?v=WoGD-JeC7ng) or review the [slides](https://1drv.ms/b/s!AnEPjr8tHcNmjDY1cro08Fk3KUj-?e=murYHG)
- [Advanced Security Information Model (ASIM) overview](normalization.md)
- [Advanced Security Information Model (ASIM) schemas](normalization-about-schemas.md)
- [Advanced Security Information Model (ASIM) parsers](normalization-parsers-overview.md)
- [Advanced Security Information Model (ASIM) content](normalization-content.md)
