---
title: Advanced Security Information Model (ASIM) schemas | Microsoft Docs
description: This article explains Advanced Security Information Model (ASIM) schemas, and how they help. ASIM normalizes data from many different sources to a uniform presentation.
author: oshezaf
ms.topic: article
ms.date: 11/09/2021
ms.author: ofshezaf


#Customer intent: As a security analyst, I want to use ASIM schemas so that I can normalize and query security data consistently across different sources.

--- 

# Advanced Security Information Model (ASIM) schemas

An Advanced Security Information Model ([ASIM](normalization.md)) schema is a set of fields that represent an activity. Using the fields from a normalized schema in a query ensures that the query will work with every normalized source.

To understand how schemas fit within the ASIM architecture, refer to the [ASIM architecture diagram](normalization.md#asim-components).

Schema references outline the fields that comprise each schema. ASIM currently defines the following schemas:

| Schema | Version | Status |
| ------ | ------- | ------ |
| [Alert Event](normalization-schema-alert.md) | 0.1 | GA |
| [Audit Event](normalization-schema-audit.md) | 0.1.2 | GA |
| [Authentication Event](normalization-schema-authentication.md) | 0.1.4 | GA |
| [DNS Activity](normalization-schema-dns.md) | 0.1.7 | GA |
| [DHCP Activity](normalization-schema-dhcp.md) | 0.1.1 | GA |
| [File Activity](normalization-schema-file-event.md) | 0.2.2 | GA |
| [Network Session](normalization-schema.md) | 0.2.7 | GA |
| [Process Event](normalization-schema-process-event.md) | 0.1.4 | GA |
| [Registry Event](normalization-schema-registry-event.md) | 0.1.3 | GA |
| [User Management](normalization-schema-user-management.md) | 0.1.2 | GA |
| [Web Session](normalization-schema-web.md) | 0.2.7 | GA |

## Schema concepts

The following concepts help to understand the schema reference documents and extend the schema in a normalized manner in case your data includes information that the schema doesn't cover.


### Field naming

At the core of each schema are its field names. Field names belong to the following groups:

- Fields common to all schemas.
- Fields specific to a schema.
- Fields that represent entities, such as users, which take part in the schema. Fields that represent entities [are similar across schemas](#entities).

When sources have fields that aren't presented in the documented schema, they're normalized to maintain consistency. If the extra fields represent an entity, they'll be normalized based on the entity field guidelines. Otherwise, the schemas strive to keep consistency across all schemas.<br><br> For example, while DNS server activity logs don't provide user information, DNS activity logs from an endpoint might include user information, which can be normalized according to the user entity guidelines.      |

### Field logical types   

Each schema field has a type. The Log Analytics workspace has a limited set of data types. For this reason, Microsoft Sentinel uses a logical type for many schema fields, which Log Analytics doesn't enforce but is required for schema compatibility. Logical field types ensure that both values and field names are consistent across sources.  <br><br>For more information, see [Logical types](#logical-types).

### Field classes

Fields might have several classes, which define when the fields should be implemented by a parser: 

- **Mandatory** fields must appear in every parser. If your source doesn't provide information for this value, or the data can't be otherwise added, it won't support most content items that reference the normalized schema.
- **Recommended** fields should be normalized if available. However, they might not be available in every source. Any content item that references that normalized schema should take availability into account.
- **Optional** fields, if available, can be normalized or left in their original form. Typically, a minimal parser wouldn't normalize them for performance reasons.
- **Conditional** fields are mandatory if the field they follow is populated. Conditional fields are typically used to describe the value in another field. For example, the common field [DvcIdType](normalization-common-fields.md#dvcidtype) describes the value int the common field [DvcId](normalization-common-fields.md#dvcid) and is therefore mandatory if the latter is populated.
- **Alias** is a special type of a conditional field, and is mandatory if the aliased field is populated.

### Common fields

Some fields are common to all ASIM schemas. Each schema might add guidelines for using some of the common fields in the context of the specific schema. For example, permitted values for the **EventType** field might vary per schema, as might the value of the **EventSchemaVersion** field. 

### Entities

Events evolve around entities, such as users, hosts, processes, or files. Each entity might require several fields to describe it. For example, a host might have a name and an IP address.

A single record might include multiple entities of the same type, such as both a source and destination host. <br><br>ASIM defines how to describe entities consistently, and entities allow for extending the schemas. <br><br>For example, while the Network Session schema doesn't include process information, some event sources do provide process information that can be added. For more information, see [Entities](#entities). 

### Aliases

 Aliases allow multiple names for a specified value. In some cases, different users expect a field to have different names. For example, in DNS terminology, you might expect a field named [DnsQuery](normalization-schema-dns.md#query), while more generally, it holds a domain name. The alias [Domain](normalization-schema-dns.md#domain) helps the user by allowing the use of both names. 

 > [!NOTE]
> Aliases are intended to help an analyst with interactive queries. When using queries in reusable content such asn custom detections, analytic rules or workbooks, use the aliased field rather than the alias. Using the aliased field ensures better performance, less errors and better query readability.
>
 
 In some cases, an alias can have the value of one of several fields, depending on which values are available in the event. For example, the [Dvc](normalization-common-fields.md#dvc) alias, aliases either the [DvcFQDN](normalization-common-fields.md#dvcfqdn), [DvcId](normalization-common-fields.md#dvcid), [DvcHostname](normalization-common-fields.md#dvchostname), or [DvcIpAddr](normalization-common-fields.md#dvcipaddr) , or [Event Product](normalization-common-fields.md#eventproduct) fields. When an alias can have several values, its type has to be a string to accommodate all possible aliased values. As a result, when assigning a value to such an alias, make sure to convert the type to string using the KQL function [tostring](/kusto/query/tostring-function?view=microsoft-sentinel&preserve-view=true).<br><br>[Native normalized tables](normalization-ingest-time.md#ingest-time-parsing) do not include aliases, as those would imply duplicate data storage. Instead the [stub parsers](normalization-ingest-time.md#combining-ingest-time-and-query-time-normalization) add the aliases. To implement aliases in parsers, create a copy of the original value by using the `extend` operator.        |


## Logical types

Each schema field has a type. Some have built-in, Log Analytics types, such as `string`, `int`, `datetime`, or `dynamic`. Other fields have a Logical type, which represents how the field values should be normalized.

|Data type  |Physical type  |Format and value  |
|---------|---------|---------|
|**Boolean**     |   Bool      |    Use the built-in KQL `bool` data type rather than a numerical or string representation of Boolean values.     |
|**Enumerated**     |  String       |   A list of values as explicitly defined for the field. The schema definition lists the accepted values.      |
|**Date/Time**     |  Depending on the ingestion method capability, use any of the following physical representations in descending priority: <br><br>- Log Analytics built-in datetime type <br>- An integer field using Log Analytics datetime numerical representation. <br>- A string field using Log Analytics datetime numerical representation <br>- A string field storing a supported [Log Analytics date/time format](/kusto/query/scalar-data-types/datetime?view=microsoft-sentinel&preserve-view=true).       |  [Log Analytics date and time representation](/kusto/query/scalar-data-types/datetime?view=microsoft-sentinel&preserve-view=true) is similar but different than Unix time representation. For more information, see the [conversion guidelines](/kusto/query/datetime-timespan-arithmetic?view=microsoft-sentinel&preserve-view=true). <br><br>**Note**: When applicable, the time should be time zone adjusted. |
|**MAC address**    |  String       | Colon-Hexadecimal notation.        |
|**IP address**     |String         |    Microsoft Sentinel schemas don't have separate IPv4 and IPv6 addresses. Any IP address field might include either an IPv4 address or an IPv6 address, as follows: <br><br>- **IPv4** in a dot-decimal notation.<br>- **IPv6** in 8-hextets notation, allowing for the short form.<br><br>For example:<br>- **IPv4**: `192.168.10.10` <br>- **IPv6**: `FEDC:BA98:7654:3210:FEDC:BA98:7654:3210`<br>- **IPv6 short form**: `1080::8:800:200C:417A`     |
|**FQDN**        |   String      |    A fully qualified domain name using a dot notation, for example, `learn.microsoft.com`. For more information, see [The Device entity](normalization-entity-device.md). |
|<a name="hostname"></a>**Hostname** | String | A hostname which is not an FQDN, includes up to 63 characters including letters, numbers and hyphens. For more information, see [The Device entity](normalization-entity-device.md).|
|**Domain**        |   String      |    the domain part of an FQDN, without the hostname, for example, `learn.microsoft.com`. For more information, see [The Device entity](normalization-entity-device.md). |
| **DomainType** | Enumerated | The type of domain stored in domain and FQDN fields. For a list of values and more information, see [The Device entity](normalization-entity-device.md). |
| **DvcIdType** | Enumerated | The type of the device ID stored in DvcId fields. For a list of allowed values and further information refer to [DvcIdType](normalization-entity-device.md#dvcidtype). |
|<a name="devicetype"></a>**DeviceType** | Enumerated | The type of the device stored in DeviceType fields. Possible values include:<br>- `Computer`<br>- `Mobile Device`<br>- `IOT Device`<br>- `Other`. For more information, see [The Device entity](normalization-entity-device.md). |
|<a name="username"></a>**Username** | String | A valid username in one of the supported [types](#usernametype). For more information, see [The User entity](normalization-entity-user.md). |
|<a name="usernametype"></a>**UsernameType** | Enumerated | The type of username stored in username fields. For more information and list of supported values, see [The User entity](normalization-entity-user.md). |
|<a name="useridtype"></a>**UserIdType** | Enumerated | The type of the ID stored in user ID fields. <br><br>Supported values are `SID`, `UIS`, `AADID`, `OktaId`, `AWSId`, and `PUID`. For more information, see [The User entity](normalization-entity-user.md).  |
|<a name="usertype"></a>**UserType** | Enumerated | The type of a user. For more information and list of allowed values, see [The User entity](normalization-entity-user.md).  |
|<a name="apptype"></a>**AppType** | Enumerated | The type of an application. Supported values include: `Process`<br>, `Service`,  `Resource`, `URL`, `SaaS application`, `CSP`, and `Other`. |
|**Country**     |   String      |    A string using [ISO 3166-1](https://www.iso.org/iso-3166-country-codes.html), according to the following priority: <br><br> - Alpha-2 codes, such as `US` for the United States. <br> - Alpha-3 codes, such as `USA` for the United States. <br>- Short name.<br><br>The list of codes can be found on the [International Standards Organization (ISO) website](https://www.iso.org/obp/ui/#search).|
|**Region**     | String        |   The country/region subdivision name, using ISO 3166-2.<br><br>The list of codes can be found on the [International Standards Organization (ISO) website](https://www.iso.org/obp/ui/#search).|
|**City**     |  String       |         |
|**Longitude**     | Double        |  ISO 6709 coordinate representation (signed decimal).       |
|**Latitude**     | Double        |    ISO 6709 coordinate representation (signed decimal).     |
|**MD5**     |    String     |  32-hex characters.       |
|**SHA1**     |   String      | 40-hex characters.        |
|**SHA256**     | String        |  64-hex characters.       |
|**SHA512**     |   String      |  128-hex characters.       |
|**ConfidenceLevel**     |   Integer      |  A confidence level normalized to the range of 0 to a 100.       |
|**RiskLevel**     |   Integer      |  A risk level normalized to the range of 0 to a 100.       |
|**SchemaVersion** | String | An ASIM schema version in the format `<major>.<minor>.<sub-minor>` |
| **DnsQueryClassName** | String | The [DNS class name](https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml).|
| **Username** | String | A simple or domain qualified username | 


## Entities

Events evolve around entities, such as users, hosts, processes, or files. Entity representation allows several entities of the same type to be part of a single record, and support multiple attributes for the same entities.

To enable entity functionality, entity representation has the following guidelines:

|Guideline  |Description  |
|---------|---------|
|**Prefixes and aliasing**     | Since a single event often includes more than one entity of the same type, such as source and destination hosts, *prefixes* are used to identify the entity a field is associated. <br><br>To maintain normalization, ASIM uses a small set of standard prefixes, picking the most appropriate ones for the specific role of the entities. <br><br>If a single entity of a type is relevant for an event, there's no need to use a prefix. Also, a set of fields without a prefix aliases the most used entity for each type.  |
|**Identifiers and types**     | A normalized schema allows for several identifiers for each entity, which we expect to coexist in events. If the source event has other entity identifiers that can't be mapped to the normalized schema, keep them in the source form or use the **AdditionalFields** dynamic field. <br><br>To maintain the type information for the identifiers, store the type, when applicable, in a field with the same name and a suffix of **Type**. For example, **UserIdType**.         |
|**Attributes**     |   Entities often have other attributes that don't serve as an identifier and can also be qualified with a descriptor. For example, if the source user has domain information, the normalized field is **SrcUserDomain**.      |

For more information about specific entity types refer to:
- [User Entity](normalization-entity-user.md)
- [Device Entity](normalization-entity-device.md)

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
