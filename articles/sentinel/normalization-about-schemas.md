---
title: Advanced SIEM Information Model (ASIM) schemas | Microsoft Docs
description: This article explains Advanced SIEM Information Model (ASIM) schemas, and how they help. ASIM normalizes data from many different sources to a uniform presentation.
author: oshezaf
ms.topic: conceptual
ms.date: 11/09/2021
ms.author: ofshezaf
ms.custom: ignite-fall-2021
--- 

# Advanced SIEM Information Model (ASIM) schemas (preview)

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

An Advanced SIEM Information Model ([ASIM](normalization.md)) schema is a set of fields that represent an activity. Using the fields from a normalized schema in a query ensures that the query will work with every normalized source.

To understand how schemas fit within the ASIM architecture, refer to the [ASIM architecture diagram](normalization.md#asim-components).

Schema references outline the fields that comprise each schema. ASIM currently defines the following schemas:

 - [Network Session](normalization-schema.md)
 - [DNS Activity](dns-normalization-schema.md)
 - [DHCP Activity](dhcp-normalization-schema.md)
 - [Process Event](process-events-normalization-schema.md)
 - [Authentication Event](authentication-normalization-schema.md)
 - [Registry Event](registry-event-normalization-schema.md)
 - [File Activity](file-event-normalization-schema.md)

> [!IMPORTANT]
> ASIM is currently in *preview*. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Schema concepts

The following concepts help to understand the schema reference documents and extend the schema in a normalized manner in case your data includes information that the schema doesn't cover.

|Concept  |Description  |
|---------|---------|
|**Field names**     |   At the core of each schema are its field names. Field names belong to the following groups: <br><br>- Fields common to all schemas. <br>- Fields specific to a schema. <br>-	Fields that represent entities, such as users, which take part in the schema. Fields that represent entities [are similar across schemas](#entities). <br><br>When sources have fields that aren't presented in the documented schema, they're normalized to maintain consistency. If the extra fields represent an entity, they'll be normalized based on the entity field guidelines. Otherwise, the schemas strive to keep consistency across all schemas.<br><br> For example, while DNS server activity logs don't provide user information, DNS activity logs from an endpoint might include user information, which can be normalized according to the user entity guidelines.      |
|**Field types**     |  Each schema field has a type. The Log Analytics workspace has a limited set of data types. For this reason, Microsoft Sentinel uses a logical type for many schema fields, which Log Analytics doesn't enforce but is required for schema compatibility. Logical field types ensure that both values and field names are consistent across sources.  <br><br>For more information, see [Logical types](#logical-types).     |
|**Field class**     |Fields might have several classes, which define when the fields should be implemented by a parser: <br><br>-	**Mandatory** fields must appear in every parser. If your source doesn't provide information for this value, or the data can't be otherwise added, it won't support most content items that reference the normalized schema.<br>-	**Recommended** fields should be normalized if available. However, they might not be available in every source. Any content item that references that normalized schema should take availability into account. <br>-	**Optional** fields, if available, can be normalized or left in their original form. Typically, a minimal parser wouldn't normalize them for performance reasons.    |
|**Entities**     | Events evolve around entities, such as users, hosts, processes, or files. Each entity might require several fields to describe it. For example, a host might have a name and an IP address. <br><br>A single record might include multiple entities of the same type, such as both a source and destination host. <br><br>ASIM defines how to describe entities consistently, and entities allow for extending the schemas. <br><br>For example, while the Network Session schema doesn't include process information, some event sources do provide process information that can be added. For more information, see [Entities](#entities). |
|**Aliases**     |  In some cases, different users expect a field to have different names. For example, in DNS terminology, you might expect a field named `query`, while more generally, it holds a domain name. Aliases solve this issue of ambiguity by allowing multiple names for a specified value. The alias class would be the same as the field that it aliases.<br><br>Log Analytics doesn't support aliasing. To implement aliases parsers, create a copy of the original value by using the `extend` operator.        |
| | |

## Logical types

Each schema field has a type. Some have built-in, Log Analytics types, such as `string`, `int`, `datetime`, or `dynamic`. Other fields have a Logical type, which represents how the field values should be normalized.

|Data type  |Physical type  |Format and value  |
|---------|---------|---------|
|**Boolean**     |   Bool      |    Use the built-in KQL `bool` data type rather than a numerical or string representation of Boolean values.     |
|**Enumerated**     |  String       |   A list of values as explicitly defined for the field. The schema definition lists the accepted values.      |
|**Date/Time**     |  Depending on the ingestion method capability, use any of the following physical representations in descending priority: <br><br>- Log Analytics built-in datetime type <br>- An integer field using Log Analytics datetime numerical representation. <br>- A string field using Log Analytics datetime numerical representation <br>- A string field storing a supported [Log Analytics date/time format](/azure/data-explorer/kusto/query/scalar-data-types/datetime).       |  [Log Analytics date and time representation](/azure/kusto/query/scalar-data-types/datetime) is similar but different than Unix time representation. For more information, see the [conversion guidelines](/azure/kusto/query/datetime-timespan-arithmetic). <br><br>**Note**: When applicable, the time should be time zone adjusted. |
|**MAC address**    |  String       | Colon-Hexadecimal notation.        |
|**IP address**     |String         |    Microsoft Sentinel schemas don't have separate IPv4 and IPv6 addresses. Any IP address field might include either an IPv4 address or an IPv6 address, as follows: <br><br>- **IPv4** in a dot-decimal notation.<br>- **IPv6** in 8-hextets notation, allowing for the short form.<br><br>For example:<br>- **IPv4**: `192.168.10.10` <br>- **IPv6**: `FEDC:BA98:7654:3210:FEDC:BA98:7654:3210`<br>- **IPv6 short form**: `1080::8:800:200C:417A`     |
|**FQDN**        |   String      |    A fully qualified domain name using a dot notation, for example, `docs.microsoft.com`. |
|**Country**     |   String      |    A string using [ISO 3166-1](https://www.iso.org/iso-3166-country-codes.html), according to the following priority: <br><br> - Alpha-2 codes, such as `US` for the United States. <br> - Alpha-3 codes, such as `USA` for the United States. <br>- Short name.<br><br>The list of codes can be found on the [International Standards Organization (ISO) website](https://www.iso.org/obp/ui/#search).|
|**Region**     | String        |   The country subdivision name, using ISO 3166-2.<br><br>The list of codes can be found on the [International Standards Organization (ISO) website](https://www.iso.org/obp/ui/#search).|
|**City**     |  String       |         |
|**Longitude**     | Double        |  ISO 6709 coordinate representation (signed decimal).       |
|**Latitude**     | Double        |    ISO 6709 coordinate representation (signed decimal).     |
|**MD5**     |    String     |  32-hex characters.       |
|**SHA1**     |   String      | 40-hex characters.        |
|**SHA256**     | String        |  64-hex characters.       |
|**SHA512**     |   String      |  128-hex characters.       |
| | | |

## <a name="common"></a>Common fields

Some fields are common to all ASIM schemas. Each schema might add guidelines for using some of the common fields in the context of the specific schema. For example, permitted values for the **EventType** field might vary per schema, as might the value of the **EventSchemaVersion** field.

The following fields are generated by Log Analytics for each record. They can be overridden when you [create a custom connector](create-custom-connector.md).

| Field         | Type     | Discussion      |
| ------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| <a name="timegenerated"></a>**TimeGenerated** | datetime | The time the event was generated by the reporting device.|
| **_ResourceId**   | guid     | The Azure Resource ID of the reporting device or service, or the log forwarder resource ID for events forwarded by using Syslog, CEF, or WEF. **_ResourceId** is not generated for sources for that do not have a resource concept, such as Microsoft Defender for Endpoint and will be empty for events from these sources.   |
| **Type** | String | The original table from which the record was fetched. This field is useful when the same event can be received through multiple channels to different tables, and have the same [EventVendor](#eventvendor) and [EventProduct](#eventproduct) values.<br><br>For example, a Sysmon event can be collected either to the `Event` table or to the `WindowsEvent` table. |
| | | |

> [!NOTE]
> Log Analytics also adds other fields that are less relevant to security use cases. For more information, see [Standard columns in Azure Monitor Logs](../azure-monitor/logs/log-standard-columns.md).
>

The following fields are defined by ASIM for all schemas:

| Field               | Class       | Type       |  Description        |
|---------------------|-------------|------------|--------------------|
| **EventMessage**        | Optional    | String     |     A general message or description, either included in or generated from the record.   |
| **EventCount**          | Mandatory   | Integer    |     The number of events described by the record. <br><br>This value is used when the source supports aggregation, and a single record might represent multiple events. <br><br>For other sources, set to `1`.   |
| **EventStartTime**      | Mandatory   | Date/time  |      If the source supports aggregation and the record represents multiple events, this field specifies the time that the first event was generated. <br><br>Otherwise, this field aliases the [TimeGenerated](#timegenerated) field. |
| **EventEndTime**        | Mandatory   | Alias      |      Alias to the [TimeGenerated](#timegenerated) field.    |
|  <a name="eventtype"></a>**EventType**           | Mandatory   | Enumerated |    Describes the operation reported by the record. Each schema documents the list of values valid for this field. |
| **EventSubType** | Optional | Enumerated | Describes a subdivision of the operation reported in the [EventType](#eventtype) field. Each schema documents the list of values valid for this field. |
| <a name="eventresult"></a>**EventResult** | Mandatory | Enumerated | One of the following values: **Success**, **Partial**, **Failure**, **NA** (Not Applicable).<br> <br>The value might be provided in the source record by using different terms, which should be normalized to these values. Alternatively, the source might provide only the [EventResultDetails](#eventresultdetails) field, which should be analyzed to derive the EventResult value.<br><br>Example: `Success`|
| <a name="eventresultdetails"></a>**EventResultDetails** | Mandatory | Enumerated | Reason or details for the result reported in the [EventResult](#eventresult) field. Each schema documents the list of values valid for this field.<br><br>Example: `NXDOMAIN`|
| **EventOriginalUid**    | Optional    | String     |   A unique ID of the original record, if provided by the source.<br><br>Example: `69f37748-ddcd-4331-bf0f-b137f1ea83b`|
| **EventOriginalType**   | Optional    | String     |   The original event type or ID, if provided by the source. For example, this field will be used to store the original Windows event ID.<br><br>Example: `4624`|
| <a name="eventoriginalresultdetails"></a>**EventOriginalResultDetails** | Optional | String | The original result details provided by the source. This value is used to derive [EventResultDetails](#eventresultdetails), which should have only one of the values documented for each schema. |
| <a name="eventseverity"></a>**EventSeverity** | Enumerated | String | The severity of the event. Valid values are: `Informational`, `Low`, `Medium`, or `High`. | 
| <a name="eventoriginalseverity"></a>**EventOriginalSeverity** | Optional | String | The original severity as provided by the source. This value is used to derive [EventSeverity](#eventseverity). | 
| <a name="eventproduct"></a>**EventProduct**        | Mandatory   | String     |             The product generating the event. <br><br>Example: `Sysmon`<br><br>**Note**: This field might not be available in the source record. In such cases, this field must be set by the parser.           |
| **EventProductVersion** | Optional    | String     | The version of the product generating the event. <br><br>Example: `12.1`      |
| <a name="eventvendor"></a>**EventVendor**         | Mandatory   | String     |           The vendor of the product generating the event. <br><br>Example: `Microsoft`  <br><br>**Note**: This field might not be available in the source record. In such cases, this field must be set by the parser.  |
| **EventSchema** | Mandatory | String | The schema the event is normalized to. Each schema documents its schema name. |
| **EventSchemaVersion**  | Mandatory   | String     | The version of the schema. Each schema documents its current version.         |
| **EventReportUrl**      | Optional    | String     | A URL provided in the event for a resource that provides more information about the event.|
| <a name="dvc"></a>**Dvc** | Mandatory       | String     | A unique identifier of the device on which the event occurred or which reported the event, depending on the schema. <br><br>This field might alias the [DvcFQDN](#dvcfqdn), [DvcId](#dvcid), [DvcHostname](#dvchostname), or [DvcIpAddr](#dvcipaddr) fields. For cloud sources, for which there is no apparent device, use the same value as the [Event Product](#eventproduct) field.            |
| <a name ="dvcipaddr"></a>**DvcIpAddr**           | Recommended | IP address | The IP address of the device on which the event occurred or which reported the event, depending on the schema. <br><br>Example: `45.21.42.12`    |
| <a name ="dvchostname"></a>**DvcHostname**         | Recommended | Hostname   | The hostname of the device on which the event occurred or which reported the event, depending on the schema. <br><br>Example: `ContosoDc.Contoso.Azure`               |
| <a name="dvcdomain"></a>**DvcDomain** | Recommended | String | The domain of the device on which the event occurred or which reported the event, depending on the schema.<br><br>Example: `Contoso` |
| <a name="dvcdomaintype"></a>**DvcDomainType** | Recommended | Enumerated | The type of  [DvcDomain](#dvcdomain), if known. Possible values include:<br>- `Windows`, such as for `contoso\mypc`<br>- `FQDN`, such as for `docs.microsoft.com`<br><br>**Note**: This field is required if the [DvcDomain](#dvcdomain) field is used. |
| <a name="dvcfqdn"></a>**DvcFQDN** | Optional | String | The hostname of the device on which the event occurred or which reported the event, depending on the schema. <br><br> Example: `Contoso\DESKTOP-1282V4D`<br><br>**Note**: This field supports both traditional FQDN format and Windows domain\hostname format. The  [DvcDomainType](#dvcdomaintype) field reflects the format used.  |
| <a name ="dvcid"></a>**DvcId**               | Optional    | String     | The unique ID of the device on which the event occurred or which reported the event, depending on the schema. <br><br>Example: `41502da5-21b7-48ec-81c9-baeea8d7d669`   |
| **DvcIdType** | Optional | Enumerated | The type of [DvcId](#dvcid), if known. Possible values include:<br> - `AzureResourceId`<br>- `MDEid`<br><br>If multiple IDs are available, use the first one from the list, and store the others by using the field names **DvcAzureResourceId** and **DvcMDEid**, respectively.<br><br>**Note**: This field is required if the [DvcId](#dvcid) field is used. |
| **DvcMacAddr**          | Optional    | MAC        |   The MAC address of the device on which the event occurred.  <br><br>Example: `00:1B:44:11:3A:B7`       |
| **DvcZone** | Optional | String | The network on which the event occurred or which reported the event, depending on the schema. The zone is defined by the reporting device.<br><br>Example: `Dmz` |
| **DvcOs**               | Optional    | String     |         The operating system running on the device on which the event occurred.    <br><br>Example: `Windows`    |
| **DvcOsVersion**        | Optional    | String     |   The version of the operating system on the device on which the event occurred. <br><br>Example: `10` |
| <a name="dvcaction"></a>**DvcAction** | Optional | String | For reporting security systems, the action taken by the system, if applicable. <br><br>Example: `Blocked` |
| <a name="dvcoriginalaction"></a>**DvcOriginalAction** | Optional | String | The original [DvcAction](#dvcaction) as provided by the reporting device. |
| <a name="additionalfields"></a>**AdditionalFields**    | Optional    | Dynamic    | If your source provides additional information worth preserving, either keep it with the original field names or create the dynamic **AdditionalFields** field, and add to it the extra information as key/value pairs.    |
| | | | |

> [!NOTE]
> Log Analytics also adds other fields that are less relevant to security use cases. For more information, see [Standard columns in Azure Monitor Logs](../azure-monitor/logs/log-standard-columns.md).
>

## Entities

Events evolve around entities, such as users, hosts, processes, or files. Entity representation allows several entities of the same type to be part of a single record, and support multiple attributes for the same entities.

To enable entity functionality, entity representation has the following guidelines:

|Guideline  |Description  |
|---------|---------|
|**Descriptors and aliasing**     | Since a single event often includes more than one entity of the same type, such as source and destination hosts, *descriptors* are used as a prefix to identify all of the fields that are associated with a specific entity. <br><br>To maintain normalization, ASIM uses a small set of standard descriptors, picking the most appropriate ones for the specific role of the entities. <br><br>If a single entity of a type is relevant for an event, there's no need to use a descriptor. Also, a set of fields without a descriptor aliases the most used entity for each type.  |
|**Identifiers and types**     | A normalized schema allows for several identifiers for each entity, which we expect to coexist in events. If the source event has other entity identifiers that can't be mapped to the normalized schema, keep them in the source form or use the **AdditionalFields** dynamic field. <br><br>To maintain the type information for the identifiers, store the type, when applicable, in a field with the same name and a suffix of **Type**. For example, **UserIdType**.         |
|**Attributes**     |   Entities often have other attributes that don't serve as an identifier and can also be qualified with a descriptor. For example, if the source user has domain information, the normalized field is **SrcUserDomain**.      |
| | |

Each schema explicitly defines the central entities and entity fields. The following guidelines enable you to understand the central schema fields, and how to extend schemas in a normalized manner by using other entities or entity fields that aren't explicitly defined in the schema.

### The User entity

The descriptors used for a user are Actor, Target User, and Updated User, as described in the following scenarios:

|Activity  |Full scenario  |Single entity scenario used for aliasing  |
|---------|---------|---------|
|**Create user**     |  An Actor created or modified a Target User.       |  The (Target) User was created.       |
|**Modify user**     |  An Actor renamed Target User to Updated User. The Updated User usually doesn't have all the information associated with a user and has some overlap with the Target User.      |         |
|**Network connection**     |    A process running as Actor on the source host, communicating with a process running as Target User on the destination host.     |         |
|**DNS request**     | An Actor initiated a DNS query.       |         |
|**Sign-in**     |    An Actor signed in to a system as a Target User.     |A (Target) User signed in.         |
|**Process creation**     |  An Actor (the user associated with the initiating process) has initiated process creation. The process created runs under the credentials of a Target User (the user related to the target process).      |  The process created runs under the credentials of a (Target) User.       |
|**Email**     |    An Actor sends an email to a Target User.    |         |
| | | |

The following table describes the supported identifiers for a user:

|Normalized field  |Type  |Format and supported types  |
|---------|---------|---------|
|**UserId**     |    String     |  A machine-readable, alphanumeric, unique representation of a user in a system. <br><br>Format and supported types include:<br>    -	**SID** (Windows): `S-1-5-21-1377283216-344919071-3415362939-500`<br>    -	**UID** (Linux): `4578`<br>    -	**AADID** (Azure Active Directory): `9267d02c-5f76-40a9-a9eb-b686f3ca47aa`<br>    -	**OktaId**: `00urjk4znu3BcncfY0h7`<br>    -	**AWSId**: `72643944673`<br><br>    Store the ID type in the **UserIdType** field. If other IDs are available, we recommend that you normalize the field names to **UserSid**, **UserUid**, **UserAADID**, **UserOktaId**, and **UserAwsId**, respectively.       |
|**Username**     |  String       |   A username, including domain information when available, in one of the following formats and in the following order of priority: <br> -	**Upn/Email**: `johndow@contoso.com` <br>  -	**Windows**: `Contoso\johndow` <br> -	**DN**: `CN=Jeff Smith,OU=Sales,DC=Fabrikam,DC=COM` <br>  -	**Simple**: `johndow`. Use this form only if domain information is not available. <br><br> Store the Username type in the **UsernameType** field.    |
| | | |

### The Process entity

The descriptors used for a user are Acting Process, Target Process, and Parent Process, as described in the following scenarios:

- **Network connection**: An Acting Process initiated a network connection to communicate with Target Process on a remote system.
- **DNS request**: An Acting Process initiated a DNS query.
- **Sign-in**: An Acting Process initiated a signing into a remote system that ran a Target Process on its behalf.
- **Process creation**: An Acting Process has initiated a Target Process creation. The Parent Process is the parent of the acting process.

The following table describes the supported identifiers for processes:

|Normalized field  |Type  |Format and supported types  |
|---------|---------|---------|
|**Id**     |    String     |   The OS-assigned process ID.      |
|**Guid**     |  String       |   The OS-assigned process GUID. The GUID is commonly unique across system restarts, while the ID is often reused.   |
|**Path**     |    String     |   The full pathname of the process, including directory and file name.       |
|**Name**     |  Alias       |  The process name is an alias to the path.   |
| | | |

For more information, see [Microsoft Sentinel Process Event normalization schema reference (preview)](process-events-normalization-schema.md).

### The Device entity

The normalization schemas attempt to follow user intuition as much as possible. They handle devices in different ways, depending on the scenario:

- When the event context implies a source and target device, the **Src** and **Target** descriptors are used. In such cases, the **Dvc** descriptor is used for the reporting device.
- For single device events, such as local OS events, the **Dvc** descriptor is used.
- If another gateway device is referenced in the event, and the value is different from the reporting device, the **Gateway** descriptor is used.

Device handling guidelines are further clarified as follows:

- **Network connection**: A connection was established from a Source Device (**Src**) to a Target Device (**Target**): The connection was reported by a (reporting) Device (**Dvc**).
- **Proxied network connection**: A connection was established from a Source Device (**Src**) to a Target Device (**Target**) through a Gateway Device (**Gateway**). A (reporting) Device reported the connection.
- **DNS request**: A DNS query was initiated from a Source Device (**Src**).
- **Sign-in**: A sign-in was initiated from a Source Device (**Src**) to a remote system on a Target Device (**Target**).
- **Process**: A process was initiated on a Device (**Dvc**).

The following table describes the supported identifiers for devices:

|Normalized field  |Type  |Format and supported types  |
|---------|---------|---------|
|**Hostname**     |    String     |        |
|**FQDN**     |  String       |   A fully qualified domain name.   |
|**IpAddr**     |    IP address     |   While devices might have multiple IP addresses, events usually have a single identifying IP address. The exception is a gateway device that might have two relevant IP addresses. For a gateway device, use `UpstreamIpAddr` and `DownstreamIpAddr`.      |
|**HostId**     |  String       |     |
| | | |


> [!NOTE]
> `Domain` is a typical attribute of a device, but it isn't a complete identifier.
>

For more information, see [Microsoft Sentinel Authentication normalization schema reference (preview)](authentication-normalization-schema.md).

### Sample entity mapping

This section uses [Windows event 4624](/windows/security/threat-protection/auditing/event-4624) as an example to describe how the event data is normalized for Microsoft Sentinel.

This event has the following entities:

|Microsoft terminology  |Original event field prefix |ASIM field prefix  |Description  |
|---------|---------|---------|---------|
|**Subject**     | `Subject`        |   `Actor`      |  The user that reported information about a successful sign-in.      |
|**New Logon**     |    `Target`     |  `TargetUser`       |  The user for which the sign-in was performed.       |
|**Process**     |    -     |     `ActingProcess`    |   The process that attempted the sign-in.      |
|**Network information**     |   -      |   `Src`      |     The machine from which a sign-in attempt was performed.    |
| | | | |

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
| | | | |

## Next steps

This article provides an overview of normalization in Microsoft Sentinel and ASIM.

For more information, see:
- Watch the [Deep Dive Webinar on Microsoft Sentinel Normalizing Parsers and Normalized Content](https://www.youtube.com/watch?v=zaqblyjQW6k) or review the [slides](https://1drv.ms/b/s!AnEPjr8tHcNmjGtoRPQ2XYe3wQDz?e=R3dWeM)
- [Advanced SIEM Information Model (ASIM) overview](normalization.md)
- [Advanced SIEM Information Model (ASIM) parsers](normalization-parsers-overview.md)
- [Advanced SIEM Information Model (ASIM) content](normalization-content.md)