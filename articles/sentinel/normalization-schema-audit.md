---
title: The Advanced Security Information Model (ASIM) Audit Events normalization schema reference (Public preview) | Microsoft Docs
description: This article displays the Microsoft Sentinel Audit Events normalization schema.
author: oshezaf
ms.topic: reference
ms.date: 12/12/2022
ms.author: ofshezaf

---

# The Advanced Security Information Model (ASIM) Audit Events normalization schema reference (Public preview)

The Microsoft Sentinel Audit events normalization schema represents events associated with the audit trail of information systems. The audit trail logs system configuration activities and policy changes. Such changes are often performed by system administrators, but can also be performed by users when configuring the settings of their own applications.

Every system logs audit events alongside its core activity logs. For example, a Firewall will log events about the network sessions is processes, and audit events about configuration changes applied to the Firewall itself.

For more information about normalization in Microsoft Sentinel, see [Normalization and the Advanced Security Information Model (ASIM)](normalization.md).

> [!IMPORTANT]
> The Audit Event normalization schema is currently in *preview*. This feature is provided without a service level agreement. We don't recommend it for production workloads.
>
> The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Schema overview

The main fields of an audit event are:
- The object, which may be, for example, a managed resource or policy rule, that the event focuses on, represented by the field [Object](#object). The field [ObjectType](#objecttype) specifies the type of the object.
- The application context of the object, represented by the field [TargetAppName](#targetappname), which is aliased by [Application](#application).
- The operation performed on the object, represented by the fields [EventType](#eventtype) and [Operation](#operation). While [Operation](#operation) is the value the source reported, [EventType](#eventtype) is a normalized version that is more consistent across sources.
- The old and new values for the object, if applicable, represented by [OldValue](#oldvalue) and [NewValue](#newvalue) respectively.

Audit events also reference the following entities, which are involved in the configuration operation:

- **Actor** - The user performing the configuration operation.
- **TargetApp** - The application or system for which the configuration operation applies.
- **Target** - The system on which **TaregtApp*** is running.
- **ActingApp** - The application used by the **Actor** to perform the configuration operation.
- **Src** - The system used by the **Actor** to initiate the configuration operation, if different than **Target**.

The descriptor `Dvc` is used for the reporting device, which is the local system for sessions reported by an endpoint, and the intermediary or security device in other cases. 


## Parsers

### Deploying and using audit events parsers

Deploy the ASIM audit events parsers from the [Microsoft Sentinel GitHub repository](https://aka.ms/DeployASIM). To query across all audit event sources, use the unifying parser `imAuditEvent` as the table name in your query. 

For more information about using ASIM parsers, see the [ASIM parsers overview](normalization-parsers-overview.md).
For the list of the audit event parsers Microsoft Sentinel provides out-of-the-box refer to the [ASIM parsers list](normalization-parsers-list.md#audit-event-parsers) 

### Add your own normalized parsers

When implementing custom parsers for the File Event information model, name your KQL functions using the following syntax: `imAuditEvent<vendor><Product>`. Refer to the article [Managing ASIM parsers](normalization-manage-parsers.md) to learn how to add your custom parsers to the audit event unifying parser.

### Filtering parser parameters

The audit events parsers support [filtering parameters](normalization-about-parsers.md#optimizing-parsing-using-parameters). While these parameters are optional, they can improve your query performance.

The following filtering parameters are available:

| Name     | Type      | Description |
|----------|-----------|-------------|
| **starttime** | datetime | Filter only events that ran at or after this time. This parameter uses the `TimeGenerated` field as the time designator of the event. |
| **endtime** | datetime | Filter only events queries that finished running at or before this time. This parameter uses the `TimeGenerated` field as the time designator of the event. |
| **srcipaddr_has_any_prefix** | dynamic | Filter only events from this source IP address, as represented in the [SrcIpAddr](#srcipaddr) field. |
| **eventtype_in**| string | Filter only events in which the event type, as represented in the [EventType](#eventtype) field is any of the terms provided. |
| **eventresult**| string | Filter only events in which the event result, as represented in the [EventResult](normalization-common-fields.md#eventresult) field is equal to the parameter value. |
| **actorusername_has_any** | dynamic/string | Filter only events in which the [ActorUsername](#actorusername) includes any of the terms provided. | 
| **operation_has_any** | dynamic/string | Filter only events in which [Operation](#operation) field includes any of the terms provided. | 
| **object_has_any** | dynamic/string | Filter only events in which [Object](#object) field includes any of the terms provided. | 
| **newvalue_has_any** | dynamic/string | Filter only events in which [NewValue](#object) field includes any of the terms provided. | 

Some parameter can accept both list of values of type `dynamic` or a single string value. To pass a literal list to parameters that expect a dynamic value, explicitly use a [dynamic literal](/azure/data-explorer/kusto/query/scalar-data-types/dynamic#dynamic-literals.md). For example: `dynamic(['192.168.','10.'])`

For example, to filter only audit events with the terms `install` or `update` in their [Operation](#operation) field, from the last day , use:

```kql
imAuditEvent (operation_has_any=dynamic(['install','update']), starttime = ago(1d), endtime=now())
```

## Schema details

### Common ASIM fields

> [!IMPORTANT]
> Fields common to all schemas are described in detail in the [ASIM Common Fields](normalization-common-fields.md) article.
>

#### Common fields with specific guidelines

The following list mentions fields that have specific guidelines for Audit Events:


| Field               | Class       | Type       |  Description        |
|---------------------|-------------|------------|--------------------|
| <a name="eventtype"></a> **EventType** | Mandatory | Enumerated | Describes the operation audited by the event using a normalized value. Use [EventSubType](#eventsubtype) to provide further details, which the normalized value does not convey, and [Operation](#operation). to store the operation as reported by the reporting device.<br><br> For Audit Event records, the allowed values are:<br> - `Set`<br>- `Read`<br>- `Create`<br>- `Delete`<br>- `Execute`<br>- `Install`<br>- `Clear`<br>- `Enable`<br>- `Disable`<br>- `Other` <br><br>Audit events represent a large variety of operations, and the `Other` value enables mapping operations that have no corresponding `EventType`. However, the use of `Other` limits the usability of the event and should be avoided if possible.   |
| <a name="eventsubtype"></a> **EventSubType** | Optional | String | Provides further details, which the normalized value in [EventType](#eventtype) does not convey. |
| **EventSchema** | Mandatory | String | The name of the schema documented here is `AuditEvent`. |
| **EventSchemaVersion**  | Mandatory   | String     | The version of the schema. The version of the schema documented here is `0.1`.  |


#### All common fields

Fields that appear in the table are common to all ASIM schemas. Any of guidelines specified in this document overrides the general guidelines for the field. For example, a field might be optional in general, but mandatory for a specific schema. For more information on each field, see the [ASIM Common Fields](normalization-common-fields.md) article.

| **Class** | **Fields** |
| --------- | ---------- |
| Mandatory | - [EventCount](normalization-common-fields.md#eventcount)<br> - [EventStartTime](normalization-common-fields.md#eventstarttime)<br> - [EventEndTime](normalization-common-fields.md#eventendtime)<br> - [EventType](normalization-common-fields.md#eventtype)<br>- [EventResult](normalization-common-fields.md#eventresult)<br> - [EventProduct](normalization-common-fields.md#eventproduct)<br> - [EventVendor](normalization-common-fields.md#eventvendor)<br> - [EventSchema](normalization-common-fields.md#eventschema)<br> - [EventSchemaVersion](normalization-common-fields.md#eventschemaversion)<br> - [Dvc](normalization-common-fields.md#dvc)<br>|
| Recommended | - [EventResultDetails](normalization-common-fields.md#eventresultdetails)<br>- [EventSeverity](normalization-common-fields.md#eventseverity)<br>- [EventUid](normalization-common-fields.md#eventuid)<br> - [DvcIpAddr](normalization-common-fields.md#dvcipaddr)<br> - [DvcHostname](normalization-common-fields.md#dvchostname)<br> - [DvcDomain](normalization-common-fields.md#dvcdomain)<br>- [DvcDomainType](normalization-common-fields.md#dvcdomaintype)<br>- [DvcFQDN](normalization-common-fields.md#dvcfqdn)<br>- [DvcId](normalization-common-fields.md#dvcid)<br>- [DvcIdType](normalization-common-fields.md#dvcidtype)<br>- [DvcAction](normalization-common-fields.md#dvcaction)|
| Optional | - [EventMessage](normalization-common-fields.md#eventmessage)<br> - [EventSubType](normalization-common-fields.md#eventsubtype)<br>- [EventOriginalUid](normalization-common-fields.md#eventoriginaluid)<br>- [EventOriginalType](normalization-common-fields.md#eventoriginaltype)<br>- [EventOriginalSubType](normalization-common-fields.md#eventoriginalsubtype)<br>- [EventOriginalResultDetails](normalization-common-fields.md#eventoriginalresultdetails)<br> - [EventOriginalSeverity](normalization-common-fields.md#eventoriginalseverity) <br> - [EventProductVersion](normalization-common-fields.md#eventproductversion)<br> - [EventReportUrl](normalization-common-fields.md#eventreporturl)<br> - [EventOwner](normalization-common-fields.md#eventowner)<br>- [DvcZone](normalization-common-fields.md#dvczone)<br>- [DvcMacAddr](normalization-common-fields.md#dvcmacaddr)<br>- [DvcOs](normalization-common-fields.md#dvcos)<br>- [DvcOsVersion](normalization-common-fields.md#dvchostname)<br>- [DvcOriginalAction](normalization-common-fields.md#dvcoriginalaction)<br>- [DvcInterface](normalization-common-fields.md#dvcinterface)<br>- [AdditionalFields](normalization-common-fields.md#additionalfields)<br>- [DvcDescription](normalization-common-fields.md#dvcdescription)<br>- [DvcScopeId](normalization-common-fields.md#dvcscopeid)<br>- [DvcScope](normalization-common-fields.md#dvcscope)|



### Audit fields

| Field               | Class       | Type       |  Description        |
|---------------------|-------------|------------|--------------------|
| <a name='operation'></a>**Operation** | Mandatory | String | The operation audited as reported by the reporting device. |
| <a name='object'></a>**Object** | Mandatory | String | The name of the object on which the operation identified by [EventType](#eventtype) is performed. |
| <a name='objecttype'></a>**ObjectType** | Mandatory | Enumerated | The type of [Object](#object). Allowed values are:<br>- `Cloud Resource`<br>- `Configuration Atom`<br>- `Policy Rule`<br> - Other |
| <a name="oldvalue"></a> **OldValue** | Optional | String |  The old value of [Object](#object) prior to the operation, if applicable. |
| <a name="newvalue"></a>**NewValue** | Optional | String | The new value of [Object](#object) after the operation was performed, if applicable. |
| <a name="value"></a>**Value** | Alias |  | Alias to [NewValue](#newvalue) |
| **ValueType** | Conditional | Enumerated | The type of the old and new values. Allowed values are<br>- Other |

### Actor fields

| Field          | Class        | Type       | Description   |
|---------------|--------------|------------|-----------------|
| <a name="actoruserid"></a>**ActorUserId**    | Optional  | String     |   A machine-readable, alphanumeric, unique representation of the Actor. For more information, and for alternative fields for other IDs, see [The User entity](normalization-about-schemas.md#the-user-entity).  <br><br>Example: `S-1-12-1-4141952679-1282074057-627758481-2916039507`    |
| **ActorScope** | Optional | String | The scope, such as Microsoft Entra Domain Name, in which [ActorUserId](#actoruserid) and [ActorUsername](#actorusername) are defined. or more information and list of allowed values, see [UserScope](normalization-about-schemas.md#userscope) in the [Schema Overview article](normalization-about-schemas.md).|
| **ActorScopeId** | Optional | String | The scope ID, such as Microsoft Entra Directory ID, in which [ActorUserId](#actoruserid) and [ActorUsername](#actorusername) are defined. for more information and list of allowed values, see [UserScopeId](normalization-about-schemas.md#userscopeid) in the [Schema Overview article](normalization-about-schemas.md).|
| **ActorUserIdType**| Conditional  | UserIdType |  The type of the ID stored in the [ActorUserId](#actoruserid) field. For more information and list of allowed values, see [UserIdType](normalization-about-schemas.md#useridtype) in the [Schema Overview article](normalization-about-schemas.md).|
| <a name="actorusername"></a>**ActorUsername**  | Recommended    | Username     | The Actor’s username, including domain information when available. For more information, see [The User entity](normalization-about-schemas.md#the-user-entity).<br><br>Example: `AlbertE`     |
| **User** | Alias | | Alias to [ActorUsername](#actorusername) | 
| **ActorUsernameType**              | Conditional    | UsernameType |   Specifies the type of the user name stored in the [ActorUsername](#actorusername) field. For more information, and list of allowed values, see [UsernameType](normalization-about-schemas.md#usernametype) in the [Schema Overview article](normalization-about-schemas.md). <br><br>Example: `Windows`       |
| **ActorUserType** | Optional | UserType | The type of the Actor. For more information, and  list of allowed values, see [UserType](normalization-about-schemas.md#usertype) in the [Schema Overview article](normalization-about-schemas.md).<br><br>For example: `Guest` |
| **ActorOriginalUserType** | Optional | UserType | The user type as reported by the reporting device. |
| **ActorSessionId** | Optional     | String     |   The unique ID of the sign-in session of the Actor.  <br><br>Example: `102pTUgC3p8RIqHvzxLCHnFlg`  |


### Target application fields

| Field          | Class        | Type       | Description   |
|---------------|--------------|------------|-----------------|
| <a name="targetappid"></a>**TargetAppId** |Optional | String| The ID of the application to which the event applies, including a process, browser, or service. <br><br>Example: `89162` |
|<a name="targetappname"></a>**TargetAppName** |Optional |String |The name of the application to which event applies, including a service, a URL, or a SaaS application. <br><br>Example: `Exchange 365` |
|<a name="application"></a>**Application** | Alias || Alias to [TargetAppName](#targetappname) |
| **TargetAppType**|Optional |AppType |The type of the application authorizing on behalf of the Actor. For more information, and allowed list of values, see [AppType](normalization-about-schemas.md#apptype) in the [Schema Overview article](normalization-about-schemas.md).|
| <a name="targeturl"></a>**TargetUrl** |Optional |URL |The URL associated with the target application. <br><br>Example: `https://console.aws.amazon.com/console/home?fromtb=true&hashArgs=%23&isauthcode=true&nc2=h_ct&src=header-signin&state=hashArgsFromTB_us-east-1_7596bc16c83d260b` |


### Target system fields

| Field          | Class        | Type       | Description   |
|---------------|--------------|------------|-----------------|
| <a name="dst"></a>**Dst** | Alias       | String     |    A unique identifier of the authentication target. <br><br>This field may alias the [TargerDvcId](#targetdvcid), [TargetHostname](#targethostname), [TargetIpAddr](#targetipaddr), [TargetAppId](#targetappid), or [TargetAppName](#targetappname) fields. <br><br>Example: `192.168.12.1` |
| <a name="targethostname"></a>**TargetHostname** | Recommended | Hostname | The target device hostname, excluding domain information.<br><br>Example: `DESKTOP-1282V4D` |
| <a name="targetdomain"></a>**TargetDomain** | Recommended | String | The domain of the target device.<br><br>Example: `Contoso` |
| <a name="targetdomaintype"></a>**TargetDomainType** | Conditional | Enumerated | The type of [TargetDomain](#targetdomain). For a list of allowed values and further information, refer to [DomainType](normalization-about-schemas.md#domaintype) in the [Schema Overview article](normalization-about-schemas.md).<br><br>Required if [TargetDomain](#targetdomain) is used. |
| **TargetFQDN** | Optional | String | The target device hostname, including domain information when available. <br><br>Example: `Contoso\DESKTOP-1282V4D` <br><br>**Note**: This field supports both traditional FQDN format and Windows domain\hostname format. The [TargetDomainType](#targetdomaintype) reflects the format used.   |
| <a name = "targetdescription"></a>**TargetDescription** | Optional | String | A descriptive text associated with the device. For example: `Primary Domain Controller`. |
| <a name="targetdvcid"></a>**TargetDvcId** | Optional | String | The ID of the target device. If multiple IDs are available, use the most important one, and store the others in the fields `TargetDvc<DvcIdType>`. <br><br>Example: `ac7e9755-8eae-4ffc-8a02-50ed7a2216c3` |
| <a name="targetdvcscopeid"></a>**TargetDvcScopeId** | Optional | String | The cloud platform scope ID the device belongs to. **TargetDvcScopeId** map to a subscription ID on Azure and to an account ID on AWS. | 
| <a name="targetdvcscope"></a>**TargetDvcScope** | Optional | String | The cloud platform scope the device belongs to. **TargetDvcScope** map to a subscription ID on Azure and to an account ID on AWS. | 
| **TargetDvcIdType** | Conditional | Enumerated | The type of [TargetDvcId](#targetdvcid). For a list of allowed values and further information, refer to [DvcIdType](normalization-about-schemas.md#dvcidtype) in the [Schema Overview article](normalization-about-schemas.md). <br><br>Required if **TargetDeviceId** is used.|
| **TargetDeviceType** | Optional | Enumerated | The type of the target device.  For a list of allowed values and further information, refer to [DeviceType](normalization-about-schemas.md#devicetype) in the [Schema Overview article](normalization-about-schemas.md). |
|<a name="targetipaddr"></a>**TargetIpAddr** |Optional | IP Address|The IP address of the target device. <br><br>Example: `2.2.2.2` |
| **TargetDvcOs**| Optional| String| The OS of the target device. <br><br>Example: `Windows 10`|
| **TargetPortNumber** |Optional |Integer |The port of the target device.|


### Acting Application fields

| Field          | Class        | Type       | Description   |
|---------------|--------------|------------|-----------------|
| **ActingAppId** | Optional | String | The ID of the application that initiated the activity reported, including a process, browser, or service. <br><br>For example: `0x12ae8` |
| **ActiveAppName** | Optional | String | The name of the application that initiated the activity reported, including a service, a URL, or a SaaS application. <br><br>For example: `C:\Windows\System32\svchost.exe` |
| **ActingAppType** | Optional | AppType | The type of acting application. For more information, and allowed list of values, see [AppType](normalization-about-schemas.md#apptype) in the [Schema Overview article](normalization-about-schemas.md). |
| **HttpUserAgent** |	Optional	| String |	When authentication is performed over HTTP or HTTPS, this field's value is the user_agent HTTP header provided by the acting application when performing the authentication.<br><br>For example: `Mozilla/5.0 (iPhone; CPU iPhone OS 12_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1` |


### Source system fields

| Field | Class | Type | Description |
|-------|-------|------|-------------|
| <a name="src"></a>**Src** | Alias       | String     |    A unique identifier of the source device. <br><br>This field might alias the [SrcDvcId](#srcdvcid), [SrcHostname](#srchostname), or [SrcIpAddr](#srcipaddr) fields. <br><br>Example: `192.168.12.1`       |
| <a name="srcipaddr"></a>**SrcIpAddr** | Recommended | IP address | The IP address from which the connection or session originated. <br><br>Example: `77.138.103.108` |
| **IpAddr** | Alias || Alias to [SrcIpAddr](#srcipaddr), or to [TargetIpAddr](#targetipaddr) if [SrcIpAddr](#srcipaddr) is not provided. |
| **SrcPortNumber** | Optional | Integer | The IP port from which the connection originated. Might not be relevant for a session comprising multiple connections.<br><br>Example: `2335` |
| <a name="srchostname"></a> **SrcHostname** | Recommended | Hostname | The source device hostname, excluding domain information. If no device name is available, store the relevant IP address in this field.<br><br>Example: `DESKTOP-1282V4D` |
|<a name="srcdomain"></a> **SrcDomain** | Recommended | String | The domain of the source device.<br><br>Example: `Contoso` |
| <a name="srcdomaintype"></a>**SrcDomainType** | Conditional | DomainType | The type of [SrcDomain](#srcdomain). For a list of allowed values and further information, refer to [DomainType](normalization-about-schemas.md#domaintype) in the [Schema Overview article](normalization-about-schemas.md).<br><br>Required if [SrcDomain](#srcdomain) is used. |
| **SrcFQDN** | Optional | String | The source device hostname, including domain information when available. <br><br>**Note**: This field supports both traditional FQDN format and Windows domain\hostname format. The [SrcDomainType](#srcdomaintype) field reflects the format used. <br><br>Example: `Contoso\DESKTOP-1282V4D` |
| <a name = "srcdescription"></a>**SrcDescription** | Optional | String | A descriptive text associated with the device. For example: `Primary Domain Controller`. |
| <a name="srcdvcid"></a>**SrcDvcId** | Optional | String |  The ID of the source device. If multiple IDs are available, use the most important one, and store the others in the fields `SrcDvc<DvcIdType>`.<br><br>Example: `ac7e9755-8eae-4ffc-8a02-50ed7a2216c3` |
| <a name="srcdvcscopeid"></a>**SrcDvcScopeId** | Optional | String | The cloud platform scope ID the device belongs to. **SrcDvcScopeId** map to a subscription ID on Azure and to an account ID on AWS. | 
| <a name="srcdvcscope"></a>**SrcDvcScope** | Optional | String | The cloud platform scope the device belongs to. **SrcDvcScope** map to a subscription ID on Azure and to an account ID on AWS. | 
| **SrcDvcIdType** | Conditional | DvcIdType | The type of [SrcDvcId](#srcdvcid). For a list of allowed values and further information, refer to [DvcIdType](normalization-about-schemas.md#dvcidtype) in the [Schema Overview article](normalization-about-schemas.md). <br><br>**Note**: This field is required if [SrcDvcId](#srcdvcid) is used. |
| **SrcDeviceType** | Optional | DeviceType | The type of the source device. For a list of allowed values and further information, refer to [DeviceType](normalization-about-schemas.md#devicetype) in the [Schema Overview article](normalization-about-schemas.md). |
| <a name="srcsubscriptionid"></a>**SrcSubscriptionId** | Optional | String | The cloud platform subscription ID the source device belongs to. **SrcSubscriptionId** map to a subscription ID on Azure and to an account ID on AWS. | 
| **SrcGeoCountry** | Optional | Country | The country associated with the source IP address.<br><br>Example: `USA` |
| **SrcGeoRegion** | Optional | Region | The region within a country associated with the source IP address.<br><br>Example: `Vermont` |
| **SrcGeoCity** | Optional | City | The city associated with the source IP address.<br><br>Example: `Burlington` |
| **SrcGeoLatitude** | Optional | Latitude | The latitude of the geographical coordinate associated with the source IP address.<br><br>Example: `44.475833` |
| **SrcGeoLongitude** | Optional | Longitude | The longitude of the geographical coordinate associated with the source IP address.<br><br>Example: `73.211944` |


### <a name="inspection-fields"></a>Inspection fields

The following fields are used to represent that inspection performed by a security system.

| Field | Class | Type | Description |
| --- | --- | --- | --- |
| <a name="rulename"></a>**RuleName** | Optional | String | The name or ID of the rule by associated with the inspection results. |
| <a name="rulenumber"></a>**RuleNumber** | Optional | Integer | The number of the rule associated with the inspection results. |
| **Rule** | Alias | String | Either the value of [RuleName](#rulename) or the value of [RuleNumber](#rulenumber). If the value of [RuleNumber](#rulenumber) is used, the type should be converted to string. |
| **ThreatId** | Optional | String | The ID of the threat or malware identified in the audit activity. |
| **ThreatName** | Optional | String | The name of the threat or malware identified in the audit activity. |
| **ThreatCategory** | Optional | String | The category of the threat or malware identified in audit file activity. |
| **ThreatRiskLevel** | Optional | Integer | The risk level associated with the identified threat. The level should be a number between **0** and **100**.<br><br>**Note**: The value might be provided in the source record by using a different scale, which should be normalized to this scale. The original value should be stored in [ThreatRiskLevelOriginal](#threatoriginalriskleveloriginal). |
| <a name="threatoriginalriskleveloriginal"></a>**ThreatOriginalRiskLevel** | Optional | String | The risk level as reported by the reporting device. |
| **ThreatConfidence** | Optional | Integer | The confidence level of the threat identified, normalized to a value between 0 and a 100.| 
| **ThreatOriginalConfidence** | Optional | String |  The original confidence level of the threat identified, as reported by the reporting device.| 
| **ThreatIsActive** | Optional | Boolean | True if the threat identified is considered an active threat. | 
| **ThreatFirstReportedTime** | Optional | datetime | The first time the IP address or domain were identified as a threat.  | 
| **ThreatLastReportedTime** | Optional | datetime | The last time the IP address or domain were identified as a threat.| 
| **ThreatIpAddr** | Optional | IP Address | An IP address for which a threat was identified. The field [ThreatField](#threatfield) contains the name of the field **ThreatIpAddr** represents. |
| <a name="threatfield"></a>**ThreatField** | Optional | Enumerated | The field for which a threat was identified. The value is either `SrcIpAddr` or `TargetIpAddr`. |


## Next steps

For more information, see:

- Watch the [ASIM Webinar](https://www.youtube.com/watch?v=WoGD-JeC7ng) or review the [slides](https://1drv.ms/b/s!AnEPjr8tHcNmjDY1cro08Fk3KUj-?e=murYHG)
- [Advanced Security Information Model (ASIM) overview](normalization.md)
- [Advanced Security Information Model (ASIM) schemas](normalization-about-schemas.md)
- [Advanced Security Information Model (ASIM) parsers](normalization-parsers-overview.md)
- [Advanced Security Information Model (ASIM) content](normalization-content.md)
