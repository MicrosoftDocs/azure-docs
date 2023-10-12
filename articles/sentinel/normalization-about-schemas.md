---
title: Advanced Security Information Model (ASIM) schemas | Microsoft Docs
description: This article explains Advanced Security Information Model (ASIM) schemas, and how they help. ASIM normalizes data from many different sources to a uniform presentation.
author: oshezaf
ms.topic: conceptual
ms.date: 11/09/2021
ms.author: ofshezaf
--- 

# Advanced Security Information Model (ASIM) schemas

An Advanced Security Information Model ([ASIM](normalization.md)) schema is a set of fields that represent an activity. Using the fields from a normalized schema in a query ensures that the query will work with every normalized source.

To understand how schemas fit within the ASIM architecture, refer to the [ASIM architecture diagram](normalization.md#asim-components).

Schema references outline the fields that comprise each schema. ASIM currently defines the following schemas:

| Schema | Version | Status |
| ------ | ------- | ------ |
| [Audit Event](normalization-schema-audit.md) | 0.1 | Preview |
| [Authentication Event](normalization-schema-authentication.md) | 0.1.3 | Preview |
| [DNS Activity](normalization-schema-dns.md) | 0.1.7 | Preview |
| [DHCP Activity](normalization-schema-dhcp.md) | 0.1 | Preview |
| [File Activity](normalization-schema-file-event.md) | 0.2.1 | Preview |
| [Network Session](normalization-schema.md) | 0.2.6 | Preview |
| [Process Event](normalization-schema-process-event.md) | 0.1.4 | Preview |
| [Registry Event](normalization-schema-registry-event.md) | 0.1.2 | Preview |
| [User Management](normalization-schema-user-management.md) | 0.1 | Preview |
| [Web Session](normalization-schema-web.md) | 0.2.6 | Preview |


> [!IMPORTANT]
> ASIM schemas and parsers are currently in *preview*. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Schema concepts

The following concepts help to understand the schema reference documents and extend the schema in a normalized manner in case your data includes information that the schema doesn't cover.

|Concept  |Description  |
|---------|---------|
|**Field names**     |   At the core of each schema are its field names. Field names belong to the following groups: <br><br>- Fields common to all schemas. <br>- Fields specific to a schema. <br>-	Fields that represent entities, such as users, which take part in the schema. Fields that represent entities [are similar across schemas](#entities). <br><br>When sources have fields that aren't presented in the documented schema, they're normalized to maintain consistency. If the extra fields represent an entity, they'll be normalized based on the entity field guidelines. Otherwise, the schemas strive to keep consistency across all schemas.<br><br> For example, while DNS server activity logs don't provide user information, DNS activity logs from an endpoint might include user information, which can be normalized according to the user entity guidelines.      |
|[**Field types**](#logical-types)     |  Each schema field has a type. The Log Analytics workspace has a limited set of data types. For this reason, Microsoft Sentinel uses a logical type for many schema fields, which Log Analytics doesn't enforce but is required for schema compatibility. Logical field types ensure that both values and field names are consistent across sources.  <br><br>For more information, see [Logical types](#logical-types).     |
|**Field class**     | Fields might have several classes, which define when the fields should be implemented by a parser: <br><br> - **Mandatory** fields must appear in every parser. If your source doesn't provide information for this value, or the data can't be otherwise added, it won't support most content items that reference the normalized schema.<br> -	**Recommended** fields should be normalized if available. However, they might not be available in every source. Any content item that references that normalized schema should take availability into account.<br> - **Optional** fields, if available, can be normalized or left in their original form. Typically, a minimal parser wouldn't normalize them for performance reasons.<br> - **Conditional** fields are mandatory if the field they follow is populated. Conditional fields are typically used to describe the value in another field. For example, the common field [DvcIdType](normalization-common-fields.md#dvcidtype) describes the value int the common field [DvcId](normalization-common-fields.md#dvcid) and is therefore mandatory if the latter is populated.<br>- **Alias** is a special type of a conditional field, and is mandatory if the aliased field is populated.   |
|[**Common fields**](normalization-common-fields.md) | Some fields are common to all ASIM schemas. Each schema might add guidelines for using some of the common fields in the context of the specific schema. For example, permitted values for the **EventType** field might vary per schema, as might the value of the **EventSchemaVersion** field. |
|**Entities**| Events evolve around entities, such as users, hosts, processes, or files. Each entity might require several fields to describe it. For example, a host might have a name and an IP address. <br><br>A single record might include multiple entities of the same type, such as both a source and destination host. <br><br>ASIM defines how to describe entities consistently, and entities allow for extending the schemas. <br><br>For example, while the Network Session schema doesn't include process information, some event sources do provide process information that can be added. For more information, see [Entities](#entities). |
|**Aliases**| Aliases allow multiple names for a specified value. In some cases, different users expect a field to have different names. For example, in DNS terminology, you might expect a field named [DnsQuery](normalization-schema-dns.md#query), while more generally, it holds a domain name. The alias [Domain](normalization-schema-dns.md#domain) helps the user by allowing the use of both names. <br><br>In some cases, an alias can have the value of one of several fields, depending on which values are available in the event. For example, the [Dvc](normalization-common-fields.md#dvc) alias, aliases either the [DvcFQDN](normalization-common-fields.md#dvcfqdn), [DvcId](normalization-common-fields.md#dvcid), [DvcHostname](normalization-common-fields.md#dvchostname), or [DvcIpAddr](normalization-common-fields.md#dvcipaddr) , or [Event Product](normalization-common-fields.md#eventproduct) fields. When an alias can have several values, its type has to be a string to accommodate all possible aliased values. As a result, when assigning a value to such an alias, make sure to convert the type to string using the KQL function [tostring](/azure/data-explorer/kusto/query/tostringfunction).<br><br>[Native normalized tables](normalization-ingest-time.md#ingest-time-parsing) do not include aliases, as those would imply duplicate data storage. Instead the [stub parsers](normalization-ingest-time.md#combining-ingest-time-and-query-time-normalization) add the aliases. To implement aliases in parsers, create a copy of the original value by using the `extend` operator.        |


## Logical types

Each schema field has a type. Some have built-in, Log Analytics types, such as `string`, `int`, `datetime`, or `dynamic`. Other fields have a Logical type, which represents how the field values should be normalized.

|Data type  |Physical type  |Format and value  |
|---------|---------|---------|
|**Boolean**     |   Bool      |    Use the built-in KQL `bool` data type rather than a numerical or string representation of Boolean values.     |
|**Enumerated**     |  String       |   A list of values as explicitly defined for the field. The schema definition lists the accepted values.      |
|**Date/Time**     |  Depending on the ingestion method capability, use any of the following physical representations in descending priority: <br><br>- Log Analytics built-in datetime type <br>- An integer field using Log Analytics datetime numerical representation. <br>- A string field using Log Analytics datetime numerical representation <br>- A string field storing a supported [Log Analytics date/time format](/azure/data-explorer/kusto/query/scalar-data-types/datetime).       |  [Log Analytics date and time representation](/azure/kusto/query/scalar-data-types/datetime) is similar but different than Unix time representation. For more information, see the [conversion guidelines](/azure/kusto/query/datetime-timespan-arithmetic). <br><br>**Note**: When applicable, the time should be time zone adjusted. |
|**MAC address**    |  String       | Colon-Hexadecimal notation.        |
|**IP address**     |String         |    Microsoft Sentinel schemas don't have separate IPv4 and IPv6 addresses. Any IP address field might include either an IPv4 address or an IPv6 address, as follows: <br><br>- **IPv4** in a dot-decimal notation.<br>- **IPv6** in 8-hextets notation, allowing for the short form.<br><br>For example:<br>- **IPv4**: `192.168.10.10` <br>- **IPv6**: `FEDC:BA98:7654:3210:FEDC:BA98:7654:3210`<br>- **IPv6 short form**: `1080::8:800:200C:417A`     |
|**FQDN**        |   String      |    A fully qualified domain name using a dot notation, for example, `learn.microsoft.com`. For more information, see [The Device entity](#the-device-entity). |
|<a name="hostname"></a>**Hostname** | String | A hostname which is not an FQDN, includes up to 63 characters including letters, numbers and hyphens. For more information, see [The Device entity](#the-device-entity).|
| **DomainType** | Enumerated | The type of domain stored in domain and FQDN fields. For a list of values and more information, see [The Device entity](#the-device-entity). |
| **DvcIdType** | Enumerated | The type of the device ID stored in DvcId fields. For a list of allowed values and further information refer to [DvcIdType](#dvcidtype). |
|<a name="devicetype"></a>**DeviceType** | Enumerated | The type of the device stored in DeviceType fields. Possible values include:<br>- `Computer`<br>- `Mobile Device`<br>- `IOT Device`<br>- `Other`. For more information, see [The Device entity](#the-device-entity). |
|<a name="username"></a>**Username** | String | A valid username in one of the supported [types](#usernametype). For more information, see [The User entity](#the-user-entity). |
|<a name="usernametype"></a>**UsernameType** | Enumerated | The type of username stored in username fields. For more information and list of supported values, see [The User entity](#the-user-entity). |
|<a name="useridtype"></a>**UserIdType** | Enumerated | The type of the ID stored in user ID fields. <br><br>Supported values are `SID`, `UIS`, `AADID`, `OktaId`, `AWSId`, and `PUID`. For more information, see [The User entity](#the-user-entity).  |
|<a name="usertype"></a>**UserType** | Enumerated | The type of a user. For more information and list of allowed values, see [The User entity](#the-user-entity).  |
|<a name="apptype"></a>**AppType** | Enumerated | The type of an application. Supported values include: `Process`<br>, `Service`,  `Resource`, `URL`, `SaaS application`, `CSP`, and `Other`. |
|**Country**     |   String      |    A string using [ISO 3166-1](https://www.iso.org/iso-3166-country-codes.html), according to the following priority: <br><br> - Alpha-2 codes, such as `US` for the United States. <br> - Alpha-3 codes, such as `USA` for the United States. <br>- Short name.<br><br>The list of codes can be found on the [International Standards Organization (ISO) website](https://www.iso.org/obp/ui/#search).|
|**Region**     | String        |   The country subdivision name, using ISO 3166-2.<br><br>The list of codes can be found on the [International Standards Organization (ISO) website](https://www.iso.org/obp/ui/#search).|
|**City**     |  String       |         |
|**Longitude**     | Double        |  ISO 6709 coordinate representation (signed decimal).       |
|**Latitude**     | Double        |    ISO 6709 coordinate representation (signed decimal).     |
|**MD5**     |    String     |  32-hex characters.       |
|**SHA1**     |   String      | 40-hex characters.        |
|**SHA256**     | String        |  64-hex characters.       |
|**SHA512**     |   String      |  128-hex characters.       |


## Entities

Events evolve around entities, such as users, hosts, processes, or files. Entity representation allows several entities of the same type to be part of a single record, and support multiple attributes for the same entities.

To enable entity functionality, entity representation has the following guidelines:

|Guideline  |Description  |
|---------|---------|
|**Descriptors and aliasing**     | Since a single event often includes more than one entity of the same type, such as source and destination hosts, *descriptors* are used as a prefix to identify all of the fields that are associated with a specific entity. <br><br>To maintain normalization, ASIM uses a small set of standard descriptors, picking the most appropriate ones for the specific role of the entities. <br><br>If a single entity of a type is relevant for an event, there's no need to use a descriptor. Also, a set of fields without a descriptor aliases the most used entity for each type.  |
|**Identifiers and types**     | A normalized schema allows for several identifiers for each entity, which we expect to coexist in events. If the source event has other entity identifiers that can't be mapped to the normalized schema, keep them in the source form or use the **AdditionalFields** dynamic field. <br><br>To maintain the type information for the identifiers, store the type, when applicable, in a field with the same name and a suffix of **Type**. For example, **UserIdType**.         |
|**Attributes**     |   Entities often have other attributes that don't serve as an identifier and can also be qualified with a descriptor. For example, if the source user has domain information, the normalized field is **SrcUserDomain**.      |


Each schema explicitly defines the central entities and entity fields. The following guidelines enable you to understand the central schema fields, and how to extend schemas in a normalized manner by using other entities or entity fields that aren't explicitly defined in the schema.

### The User entity

Users are central to activities reported by events. The fields listed in this section are used to describe the users involved in the action. Prefixes are used to designate the role of the user in the activity. The prefixes `Src` and `Dst` are used to designate the user role in network related events, in which a source system and a destination system communicate. The prefixes 'Actor' and 'Target' are used for system oriented events such as process events.

#### The user ID and scope

| Field | Class | Type | Description |
|-------|-------|------|-------------|
| <a name="userid"></a>**UserId** | Optional | String | A machine-readable, alphanumeric, unique representation of the  user.  |
| <a name="userscope"></a>**UserScope** | Optional | string | The scope in which [UserId](#userid) and [Username](#username) are defined. For example, a Microsoft Entra tenant domain name. The [UserIdType](#useridtype) field represents also the type of the associated with this field. |
| <a name="userscopeid"></a>**UserScopeId** | Optional | string | The ID of the scope in which [UserId](#userid) and [Username](#username) are defined. For example, a Microsoft Entra tenant directory ID. The [UserIdType](#useridtype) field represents also the type of the associated with this field. |
| <a name="useridtype"></a>**UserIdType** | Optional | UserIdType | The type of the ID stored in the [UserId](#userid) field. |
| **UserSid**, **UserUid**, **UserAadId**, **UserOktaId**, **UserAWSId**, **UserPuid** | Optional | String | Fields used to store specific user IDs. Select the ID most associated with the event as the primary ID stored in [UserId](#userid). Populate the relevant specific ID field, in addition to [UserId](#userid), even if the event has only one ID. |
| **UserAADTenant**, **UserAWSAccount** | Optional | String | Fields used to store specific scopes. Use the [UserScope](#userscope) field for the scope associated with the ID stored in the [UserId](#userid) field.  Populate the relevant specific scope field, in addition to [UserScope](#userscope), even if the event has only one ID. | 

The allowed values for a user ID type are:

| Type | Description | Example |
| ---- | ------- | ------------- |
| **SID** | A Windows user ID. | `S-1-5-21-1377283216-344919071-3415362939-500` |
| **UID** | A Linux user ID. | `4578` |
| **AADID**| A Microsoft Entra user ID.| `9267d02c-5f76-40a9-a9eb-b686f3ca47aa` |
| **OktaId** | An Okta user ID. |  `00urjk4znu3BcncfY0h7` |
| **AWSId** | An AWS user ID. | `72643944673` |
| **PUID** | A Microsoft 365 user ID. | `10032001582F435C` |
| **SalesforceId** | A Salesforce user ID. | `00530000009M943` |

#### The user name

| Field | Class | Type | Description |
|-------|-------|------|-------------|
| <a name="username"></a>**Username** | Optional | String | The source username, including domain information when available. Use the simple form only if domain information isn't available. Store the Username type in the [UsernameType](#usernametype) field. |
| <a name="usernametype"></a>**UsernameType** | Optional | UsernameType | Specifies the type of the username stored in the [Username](#username) field.  |
| **UserUPN**, **WindowsUsername**, **DNUsername**, **SimpleUsername** |  Optional | String | Fields used to store additional usernames, if the original event includes multiple usernames. Select the username most associated with the event as the primary username stored in [Username](#username). |

The allowed values for a username type are:

| Type | Description | Example |
| ---- | ------- | ------------- |
| **UPN** | A UPN or Email address username designator. | `johndow@contoso.com`  |
| **Windows** | A Windows username including a domain. | `Contoso\johndow` |
| **DN**| An LDAP distinguished name designator.| `CN=Jeff Smith,OU=Sales,DC=Fabrikam,DC=COM` |
| **Simple** | A simple user name without a domain designator. |  `johndow` |
| **AWSId** | An AWS user ID. | `72643944673` |


#### Additional user fields

| Field | Class | Type | Description |
|-------|-------|------|-------------|
| <a name="usertype"></a>**UserType** | Optional | UserType | The type of source user. Supported values include:<br> - `Regular`<br> - `Machine`<br> - `Admin`<br> - `System`<br> - `Application`<br> - `Service Principal`<br> - `Service`<br> - `Anonymous`<br> - `Other`.<br><br> The value might be provided in the source record by using different terms, which should be normalized to these values. Store the original value in the [OriginalUserType](#originalusertype) field. |
| <a name="originalusertype"></a>**OriginalUserType** | Optional | String | The original destination user type, if provided by the reporting device. |


### The device entity

Devices, or hosts, are the common terms used for the systems that take part in the event. The `Dvc` prefix is used to designate the primary device on which the event occurs. Some events, such as network sessions, have source and destination devices, designated by the prefix `Src` and `Dst`. In such a case, the `Dvc` prefix is used for the device reporting the event, which might be the source, destination, or a monitoring device.

### The device aliases

| Field               | Class       | Type       |  Description        |
|---------------------|-------------|------------|--------------------|
| <a name="dvc"></a>**Dvc**, <a name="src"></a>**Src**, <a name="dst"></a>**Dst** | Mandatory  | String  | The `Dvc`, 'Src', or 'Dst' fields are used as a unique identifier of the device. It is set to the best available identified for the device. These fields can alias the [FQDN](#fqdn), [DvcId](#dvcid), [Hostname](#hostname), or [IpAddr](#ipaddr) fields. For cloud sources, for which there is no apparent device, use the same value as the [Event Product](normalization-common-fields.md#eventproduct) field.            |


#### The device name

Reported device names may include a hostname only, or a fully qualified domain name (FQDN), which includes a hostname and a domain name. The FQDN might be expressed using several formats. The following fields enable supporting the different variants in which the device name might be provided.

| Field               | Class       | Type       |  Description        |
|---------------------|-------------|------------|--------------------|
| <a name ="hostname"></a>**Hostname**  | Recommended | Hostname | The short hostname of the device.  |
| <a name="domain"></a>**Domain** | Recommended | String | The domain of the device on which the event occurred, without the hostname. |
| <a name="domaintype"></a>**DomainType** | Recommended | Enumerated | The type of [Domain](#domain). Supported values include `FQDN` and `Windows`. This field is required if the [Domain](#domain) field is used. |
| <a name="fqdn"></a>**FQDN** | Optional | String | The FQDN of the device including both [Hostname](#hostname) and [Domain](#domain) . This field supports both traditional FQDN format and Windows domain\hostname format. The  [DomainType](#domaintype) field reflects the format used. |

For example:

| Field | Value for input `appserver.contoso.com` | value for input `appserver` |
| ----- | --------------------------------------- | --------------------------- | 
| **Hostname** | `appserver` | `appserver` |
| **Domain** | `contoso.con` | \<empty\> |
| **DomainType** | `FQDN` | \<empty\> |
| **FQDN** | `appserver.contoso.com` | \<empty\> | 


When the value provided by the source is an FQDN, or when the value may be either and FQDN or a short hostname, the parser should calculate the 4 values. Use the ASIM helper functions `_ASIM_ResolveFQDN`, `_ASIM_ResolveSrcFQDN`, `_ASIM_ResolveDstFQDN`, and `_ASIM_ResolveDvcFQDN` to easily set all four fields based on a single input value. For more information, see [ASIM helper functions](normalization-functions.md).


#### The device ID and Scope


| Field               | Class       | Type       |  Description        |
|---------------------|-------------|------------|--------------------|
| <a name ="dvcid"></a>**DvcId**               | Optional    | String     | The unique ID of the device . For example: `41502da5-21b7-48ec-81c9-baeea8d7d669`   |
| <a name="scopeid"></a>**ScopeId** | Optional | String | The cloud platform scope ID the device belongs to. **Scope** map to a subscription ID on Azure and to an account ID on AWS. | 
| <a name="scope"></a>**Scope** | Optional | String | The cloud platform scope the device belongs to. **Scope** map to a subscription on Azure and to an account on AWS. | 
| <a name="dvcidtype"></a>**DvcIdType** | Optional | Enumerated | The type of [DvcId](#dvcid). Typically this field will also identify the type of [Scope](#scope) and [ScopeId](#scopeid). This field is required if the [DvcId](#dvcid) field is used. |
| **DvcAzureResourceId**, **DvcMDEid**, **DvcMD4IoTid**, **DvcVMConnectionId**, **DvcVectraId**, **DvcAwsVpcId** |  Optional | String | Fields used to store additional device IDs, if the original event includes multiple device IDs. Select the device ID most associated with the event as the primary ID stored in [DvcId](#dvcid). |

Note that fields named should prepend a role prefix such as `Src` or `Dst`, but should not prepend a second `Dvc` prefix if used in that role.

The allowed values for a device ID type are:

| Type | Description | 
| ---- | ------- |
| **MDEid** | The system ID assigned by Microsoft Defender for Endpoint. | 
| **AzureResourceId** | The Azure resource ID. | 
| **MD4IoTid**| The Microsoft Defender for IoT resource ID.|
| **VMConnectionId** | The Azure Monitor VM Insights solution resource ID. |
| **AwsVpcId** | An AWS VPC ID. | 
| **VectraId** | A Vectra AI assigned resource ID.|
| **Other** | An ID type not listed above.| 

For example, the Azure Monitor [VM Insights solution](../azure-monitor/vm/vminsights-log-query.md) provides network sessions information in the `VMConnection`. The table provides an Azure Resource ID in the `_ResourceId` field and a VM insights specific device ID in the `Machine` field. Use the following mapping to represent those IDs:

| Field | Map to  |
| ----- | ----- | 
| **DvcId** | The `Machine` field in the `VMConnection` table. |
| **DvcIdType** | The value `VMConnectionId` |
| **DvcAzureResourceId** | The `_ResourceId` field in the `VMConnection` table. |


#### Additional device fields


| Field               | Class       | Type       |  Description        |
|---------------------|-------------|------------|--------------------|
| <a name ="ipaddr"></a>**IpAddr**           | Recommended | IP address | The IP address of the device. <br><br>Example: `45.21.42.12`    |
| <a name = "dvcdescription"></a>**DvcDescription** | Optional | String | A descriptive text associated with the device. For example: `Primary Domain Controller`. |
| <a name="macaddr"></a>**MacAddr**          | Optional    | MAC        |   The MAC address of the device on which the event occurred or which reported the event.  <br><br>Example: `00:1B:44:11:3A:B7`       |
| <a name="zone"></a>**Zone** | Optional | String | The network on which the event occurred or which reported the event, depending on the schema. The zone is defined by the reporting device.<br><br>Example: `Dmz` |
| <a name="dvcos"></a>**DvcOs**               | Optional    | String     |         The operating system running on the device on which the event occurred or which reported the event.    <br><br>Example: `Windows`    |
| <a name="dvcosversion"></a>**DvcOsVersion**        | Optional    | String     |   The version of the operating system on the device on which the event occurred or which reported the event. <br><br>Example: `10` |
| <a name="dvcaction"></a>**DvcAction** | Optional | String | For reporting security systems, the action taken by the system, if applicable. <br><br>Example: `Blocked` |
| <a name="dvcoriginalaction"></a>**DvcOriginalAction** | Optional | String | The original [DvcAction](#dvcaction) as provided by the reporting device. |
| <a name="interface"></a>**Interface** | Optional | String | The network interface on which data was captured. This field is  typically relevant to network related activity which is captured by an intermediate or tap device. | 


Note that fields named in the list with the Dvc prefix should prepend a role prefix such as `Src` or `Dst`, but should not prepend a second `Dvc` prefix if used in that role. 


### Sample entity mapping

This section uses [Windows event 4624](/windows/security/threat-protection/auditing/event-4624) as an example to describe how the event data is normalized for Microsoft Sentinel.

This event has the following entities:

|Microsoft terminology  |Original event field prefix |ASIM field prefix  |Description  |
|---------|---------|---------|---------|
|**Subject**     | `Subject`        |   `Actor`      |  The user that reported information about a successful sign-in.      |
|**New Logon**     |    `Target`     |  `TargetUser`       |  The user for which the sign-in was performed.       |
|**Process**     |    -     |     `ActingProcess`    |   The process that attempted the sign-in.      |
|**Network information**     |   -      |   `Src`      |     The machine from which a sign-in attempt was performed.    |


Based on these entities, [Windows event 4624](/windows/security/threat-protection/auditing/event-4624) is normalized as follows (some fields are optional):

|Normalized field  |Original field  |Value in example  |Notes  |
|---------|---------|---------|---------|
|**ActorUserId**     |  SubjectUserSid       |  S-1-5-18        |        |
|**ActorUserIdType**     |  -       | SID        |         |
|**ActorUserName**     |   SubjectDomainName\ SubjectUserName      |  WORKGROUP\WIN-GG82ULGC9GO$       |  Built by concatenating the two fields       |
|**ActorUserNameType**     |   -      |   Windows      |         |
|**ActorSessionId**     | SubjectLogonId        |  0x3e7       |         |
|**TargetUserId**     |   TargetUserSid      |    S-1-5-21-1377283216-344919071-3415362939-500     |         |
|**UserId**     |    TargetUserSid     |   Alias      |         |
|**TargetUserIdType**     |   -      |    SID     |         |
|**TargetUserName**     | TargetDomainName\ TargetUserName        |   Administrator\WIN-GG82ULGC9GO$      |   Built by concatenating the two fields      |
|**Username**     |  TargetDomainName\ TargetUserName       |  Alias       |         |
|**TargetUserNameType**     | -        |  Windows       |         |
|**TargetSessionId**     |   TargetLogonId      |  0x8dcdc       |         |
|**ActingProcessName**     |  ProcessName       |  C:\\Windows\\System32\\svchost.exe       |         |
|**ActingProcessId**     |    ProcessId     |     0x44c    |         |
|**SrcHostname**     |    WorkstationName     | Windows        |         |
|**SrcIpAddr**     |  IpAddress       |     127.0.0.1    |         |
|**SrcPortNumber**     |  IpPort       |  0       |         |
|**TargetHostname**     |   Computer      |  WIN-GG82ULGC9GO	       |         |
|**Hostname**     |     Computer    |     Alias    |         |


## Next steps

This article provides an overview of normalization in Microsoft Sentinel and ASIM.

For more information, see:
- Watch the [Deep Dive Webinar on Microsoft Sentinel Normalizing Parsers and Normalized Content](https://www.youtube.com/watch?v=zaqblyjQW6k) or review the [slides](https://1drv.ms/b/s!AnEPjr8tHcNmjGtoRPQ2XYe3wQDz?e=R3dWeM)
- [Advanced Security Information Model (ASIM) overview](normalization.md)
- [Advanced Security Information Model (ASIM) parsers](normalization-parsers-overview.md)
- [Advanced Security Information Model (ASIM) content](normalization-content.md)
