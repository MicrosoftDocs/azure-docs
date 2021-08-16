---
title: Normalization and the Azure Sentinel Information Model (ASIM) | Microsoft Docs
description: This article explains how Azure Sentinel normalizes data from many different sources using the Azure Sentinel Information Model (ASIM)
services: sentinel
cloud: na
documentationcenter: na
author: batamig
manager: rkarlin

ms.assetid:
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 06/15/2021
ms.author: bagol

---

# Normalization and the Azure Sentinel Information Model (ASIM)

Azure Sentinel ingests data from many sources. Working with various data types and tables together requires you to understand each of them, and write / use unique sets for analytics rules, workbooks, and hunting queries for each type or schema. Sometimes, you'll need separate rules, workbooks, and queries, even when data types share common elements, such as firewall devices. Correlating between different types of data during an investigation and hunting can also be challenging.

The Azure Sentinel Information Model (ASIM) provides a seamless experience for handling various sources in uniform, normalized views, by:

- Allowing for source-agnostic content and solutions.
- Simplifying analytic use of the data in Azure Sentinel workspaces.
- Using query-time parsing, while minimizing performance impact.


This article describes the Azure Sentinel Information model and how you can create normalizing parsers to transform non-normalized data to the Information Model normalized schema. You can also develop content to use the normalized schema and convert existing content to use the normalized schema.

> [!NOTE]
> The Azure Sentinel Information model aligns with the [Open Source Security Events Metadata (OSSEM)](https://ossemproject.com/intro.html) common information model, allowing for predictable entities correlation across normalized tables. OSSEM is a community-led project that focuses primarily on the documentation and standardization of security event logs from diverse data sources and operating systems. The project also provides a Common Information Model (CIM) that can be used for data engineers during data normalization procedures to allow security analysts to query and analyze data across diverse data sources.
>
> For more information, see the [OSSEM reference documentation](https://ossemproject.com/cdm/guidelines/entity_structure.html).
>
## Azure Sentinel Information Model components

The Azure Sentinel Information Model includes the following components:

|Component  |Description  |
|---------|---------|
|**Normalized schemas**     |   Cover standard sets of predictable event types that you can use when building unified capabilities. <br><br>Each schema defines the fields that represent an event, a normalized column naming convention, and a standard format for the field values. <br><br> ASIM currently defines the following schemas:<br> - [Network Session](normalization-schema.md)<br> - [DNS Activity](dns-normalization-schema.md)<br> - [Process Event](process-events-normalization-schema.md)<br> - [Authentication Event](authentication-normalization-schema.md)<br> - [Registry Event](registry-event-normalization-schema.md)<br> - [File Activity](file-event-normalization-schema.md) |
|**Parsers**     |  Map existing data to the normalized schemas using [KQL functions](/azure/data-explorer/kusto/query/functions/user-defined-functions). <br><br>Deploy the Microsoft-developed normalizing parsers from the [Azure Sentinel GitHub Parsers folder](https://github.com/Azure/Azure-Sentinel/tree/master/Parsers). Normalized parsers are located in subfolders starting with **ASim**.       |
|**Content for each normalized schema**     |    Includes analytics rules, workbooks, hunting queries, and more. Content for each normalized schema works on any normalized data without the need to create source-specific content.     |

<br>

The following image shows how non-normalized data can be translated into normalized content and used in Azure Sentinel. For example, you can start with a custom, product-specific, non-normalized table, and use a parser and a normalization schema to convert that table to normalized data. Use your normalized data in both Microsoft and custom analytics, rules, workbooks, queries, and more.

 :::image type="content" source="media/normalization/sentinel-information-model-components.png" alt-text="Non-normalized to normalized data conversion flow and usage in Azure Sentinel":::

### Azure Sentinel Information Model terminology

The Azure Sentinel Information Model uses the following terms:

|Term  |Description  |
|---------|---------|
|**Reporting device**     |   The system that sends the records to Azure Sentinel. This system may not be the subject system for the record that's being sent.      |
|**Record**     |A unit of data sent from the reporting device. A record is often referred to as `log`, `event`, or `alert`, but can also be other types of data.         |
|**Content**, or **Content Item**     |The different, customizable, or user-created artifacts than can be used with Azure Sentinel. Those artifacts include, for example, Analytics rules, Hunting queries and workbooks. A content item is one such artifact.|

<br>

## Normalized schemas

### Schema concepts

A schema is a set of fields that represent an activity. Using the fields from a normalized schema in a query ensures that the query will work with every normalized source.

Schema references outline the fields that comprise each schema. The following concepts help to understand the schema reference documents and extend the schema in a normalized manner if the source includes information that the schema does not cover.


|Concept  |Description  |
|---------|---------|
|**Field names**     |   At the core of each schema is its field names. Field names belong to the following groups: <br><br>- Fields common to all schemas <br>- Fields specific to a schema <br>-	Fields that represent entities, such as users, which take part in the schema. Fields that represent entities [are similar across schemas](#entities). <br><br>When sources have fields that are not presented in the documented schema, they are normalized to maintain consistency. If the extra fields represent an entity, they'll be normalized based on the entity field guidelines. Otherwise, the schemas strive to keep consistency across all schemas.<br><br> For example, while DNS server activity logs do not provide user information, DNS activity logs from an endpoint may include user information, which can be normalized according to the user entity guidelines.      |
|**Field types**     |  Each schema field has a type. The Log Analytics workspace has a limited set of data types. Therefore, Azure Sentinel uses a logical type for many schema fields, which Log Analytics does not enforce but is required for schema compatibility. Logical field types ensure that both values and field names are consistent across sources.  <br><br>For more information, see [Logical Types](#logical-types).     |
|**Field class**     |Fields may have several classes, which define when the fields should be implemented by a parser: <br><br>-	**Mandatory** fields must appear in every parser. If your source does not provide information for this value, or the data cannot be otherwise added, it will not support most content items that reference the normalized schema.<br>-	**Recommended** fields should be normalized if available. However, they may not be available in every source, and any content item that references that normalized schema should take availability into account. <br>-	**Optional** fields, if available, can be normalized or left in their original form. Typically, a minimal parser would not normalize them for performance reasons.    |
|**Entities**     | Events evolve around entities, such as users, hosts, processes, or files, and each entity may require several fields to describe it. For example, a host may have a name and an IP address. <br><br>A single record may include multiple entities of the same type, such as both a source and destination host. <br><br>The Azure Sentinel Information Model defines how to describe entities consistently, and entities allow for extending the schemas. <br><br>For example, while the network session schema does not include process information, some event sources do provide process information that can be added. For more information, see [Entities](#entities). |
|**Aliases**     |  In some cases, different users expect a field to have different names. For example, in DNS terminology, one would expect a field named `query`, while more generally, it holds a domain name. Aliases solve this issue of ambiguity by allowing multiple names for a specified value. The alias class would be the same as the field that it aliases.       |

<br>

### Logical types

Each schema field has a type. Some have built-in, Azure Log Analytics types such as `string`, `int`, `datetime`, or `dynamic`. Other fields have a Logical Type., which represents how the field values should be normalized.

|Data type  |Physical type  |Format and value  |
|---------|---------|---------|
|**Boolean**     |   Bool      |    Use the native KQL bool data type rather than a numerical or string representation of Boolean values.     |
|**Enumerated**     |  String       |   A list of values as explicitly defined for the field. The schema definition lists the accepted values.      |
|**Date/Time**     |  Depending on the ingestion method capability, use any of the following physical representations in descending priority: <br><br>- Log Analytics built-in datetime type <br>- An integer field using Log Analytics datetime numerical representation. <br>- A string field using Log Analytics datetime numerical representation <br>- A string field storing a supported [Log Analytics date/time format](/azure/data-explorer/kusto/query/scalar-data-types/datetime).       |  [Log Analytics date and time representation](/azure/kusto/query/scalar-data-types/datetime) is similar but different than Unix time representation. For more information, see the [conversion guidelines](/azure/kusto/query/datetime-timespan-arithmetic). <br><br>**Note**: When applicable, the time should be time zone adjusted. |
|**MAC Address**     |  String       | Colon-Hexadecimal notation        |
|**IP Address**     |String         |    Azure Sentinel schemas do not have separate IPv4 and IPv6 addresses. Any IP address field may include either an IPv4 address or IPv6 address, as follows: <br><br>- **IPv4** in a dot-decimal notation, for example  <br>- **IPv6** in 8 hextets notation, allowing for the short form<br><br>For example:<br>`192.168.10.10` (IPv4)<br>`FEDC:BA98:7654:3210:FEDC:BA98:7654:3210` (IPv6)<br>`1080::8:800:200C:417A` (IPv6 short form)     |
|**FQDN**        |   string      |    A fully qualified domain name using a dot notation, for example `docs.microsoft.com` |
|**Country**     |   String      |    A string using [ISO 3166-1](https://www.iso.org/iso-3166-country-codes.html), according to the following priority: <br><br> - Alpha-2 codes, such as `US` for the United States <br> - Alpha-3 codes, such as `USA` for the United States) <br>- Short name<br><br>The list of code can be found on the [International Standards Organization (ISO) Web Site](https://www.iso.org/obp/ui/#search)|
|**Region**     | String        |   The country subdivision name, using ISO 3166-2<br><br>The list of code can be found on the [International Standards Organization (ISO) Web Site](https://www.iso.org/obp/ui/#search)|
|**City**     |  String       |         |
|**Longitude**     | Double        |  ISO 6709 coordinate representation (signed decimal)       |
|**Latitude**     | Double        |    ISO 6709 coordinate representation (signed decimal)     |
|**MD5**     |    String     |  32-hex characters       |
|**SHA1**     |   String      | 40-hex characters        |
|**SHA256**     | String        |  64-hex characters       |
|**SHA512**     |   String      |  128-hex characters       |

<br>

### Common fields

The following fields are common to all ASIM schemas. Common fields are listed both here, and for each schema, to support situations where details differ per schema. For example, values for the **EventType** field may vary per schema, as may the value of the **EventSchemaVersion** field. 

| Field               | Class       | Type       |  Description        |
|---------------------|-------------|------------|--------------------|
| <a name="timegenerated"></a>**TimeGenerated** | Built-in | datetime | The time the event was generated by the reporting device.|
| **_ResourceId**   | Built-in |  guid     | The Azure Resource ID of the reporting device or service, or the log forwarder resource ID for events forwarded using Syslog, CEF, or WEF. |
| **EventMessage**        | Optional    | String     |     A general message or description, either included in or generated from the record.   |
| **EventCount**          | Mandatory   | Integer    |     The number of events described by the record. <br><br>This value is used when the source supports aggregation, and a single record may represent multiple events. <br><br>For other sources, set to `1`.   |
| **EventStartTime**      | Mandatory   | Date/time  |      If the source supports aggregation and the record represents multiple events, this field specifies the time that the first event was generated. <br><br>Otherwise, this field aliases the [TimeGenerated](#timegenerated) field. |
| **EventEndTime**        | Mandatory   | Alias      |      Alias to the [TimeGenerated](#timegenerated) field.    |
|  <a name=eventtype></a>**EventType**           | Mandatory   | Enumerated |    Describes the operation reported by the record. Each schema documents the list of values valid for this field. |
| **EventSubType** | Optional | Enumerated | Describes a subdivision of the operation reported in the [EventType](#eventtype) field. Each schema documents the list of values valid for this field. |
| <a name="eventresult"></a>**EventResult** | Mandatory | Enumerated | One of the following values: **Success**, **Partial**, **Failure**, **NA** (Not Applicable).<br> <br>The value may be provided in the source record using different terms, which should be normalized to these values. Alternatively, the source may provide only the [EventResultDetails](#eventresultdetails) field, which should be analyzed to derive the EventResult value.<br><br>Example: `Success`|
| <a name=eventresultdetails></a>**EventResultDetails** | Mandatory | Alias | Reason or details for the result reported in the [**EventResult**](#eventresult) field. Each schema documents the list of values valid for this field.<br><br>Example: `NXDOMAIN`|
| **EventOriginalUid**    | Optional    | String     |   A unique ID of the original record, if provided by the source.<br><br>Example: `69f37748-ddcd-4331-bf0f-b137f1ea83b`|
| **EventOriginalType**   | Optional    | String     |   The original event type or ID, if provided by the source. For example, this field will be used to store the original Windows event ID.<br><br>Example: `4624`|
| <a name ="eventproduct"></a>**EventProduct**        | Mandatory   | String     |             The product generating the event. <br><br>Example: `Sysmon`<br><br>**Note**: This field may not be available in the source record. In such cases, this field must be set by the parser.           |
| **EventProductVersion** | Optional    | String     | The version of the product generating the event. <br><br>Example: `12.1`      |
| **EventVendor**         | Mandatory   | String     |           The vendor of the product generating the event. <br><br>Example: `Microsoft`  <br><br>**Note**: This field may not be available in the source record. In such cases, this field must be set by the parser.  |
| **EventSchemaVersion**  | Mandatory   | String     |    The version of the schema. Each schema documents its current version.         |
| **EventReportUrl**      | Optional    | String     | A URL provided in the event for a resource that provides additional information about the event.|
| **Dvc** | Mandatory       | String     |               A unique identifier of the device on which the event occurred. <br><br>This field may alias the [DvcId](#dvcid), [DvcHostname](#dvchostname), or [DvcIpAddr](#dvcipaddr) fields. For cloud sources, for which there is no apparent device, use the same value as the [Event Product](#eventproduct) field.           |
| <a name ="dvcipaddr"></a>**DvcIpAddr**           | Recommended | IP Address |         The IP Address of the device on which the event occurred.  <br><br>Example: `45.21.42.12`    |
| <a name ="dvchostname"></a>**DvcHostname**         | Recommended | Hostname   |               The hostname of the device on which the event occurred. <br><br>Example: `ContosoDc.Contoso.Azure`               |
| <a name ="dvcid"></a>**DvcId**               | Optional    | String     |  The unique ID of the device on which the event occurred. <br><br>Example: `41502da5-21b7-48ec-81c9-baeea8d7d669`   |
| **DvcMacAddr**          | Optional    | MAC        |   The MAC address of the device on which the event occurred.  <br><br>Example: `00:1B:44:11:3A:B7`       |
| **DvcOs**               | Optional    | String     |         The operating system running on the device on which the event occurred.    <br><br>Example: `Windows`    |
| **DvcOsVersion**        | Optional    | String     |   The version of the operating system on the device on which the event occurred. <br><br>Example: `10` |
| **AdditionalFields**    | Optional    | Dynamic    | If your source provides additional information worth preserving, either keep it with the original field names or create the dynamic **AdditionalFields** field, and add to it the extra information as key/value pairs.    |

> [!NOTE]
> Log Analytics also adds other fields that are less relevant to security use cases. For more information, see [Standard columns in Azure Monitor Logs](/azure/azure-monitor/logs/log-standard-columns).
>


### Entities

Events evolve around entities, such as users, hosts, processes, or files. Entity representation allows several entities of the same type to be part of a single record, and support multiple attributes for the same entities. 

To enable entity functionality, entity representation has the following guidelines:

|Guideline  |Description  |
|---------|---------|
|**Descriptors and aliasing**     | Since a single event often includes more than one entity of the same type, such as source and destination hosts, *descriptors* are used as a prefix to identify all of the fields that are associated with a specific entity. <br><br>To maintain normalization, the Azure Sentinel Information Model uses a small set of standard descriptors, picking the most appropriate ones for the specific role of the entities.  <br><br>If a single entity of a type is relevant for an event, there is no need to use a descriptor. Also, a set of fields without a descriptor aliases the most used entity for each type.  |
|**Identifiers and types**     | A normalized schema allows for several identifiers for each entity, which we expect to coexist in events. If the source event has other entity identifiers that cannot be mapped to the normalized schema, keep them in the source form or use the `AdditionalFields` dynamic field. <br><br>To maintain the type information for the identifiers, store the type, when applicable, in a field with the same name and a suffix of `Type`. For example, `UserIdType`.         |
|**Attributes**     |   Entities often have other attributes that do not serve as an identifier, and can also be qualified with a descriptor. For example, if the source user has domain information, the normalized field is `SrcUserDomain`.      |

<br>

Each schema explicitly defines the central entities and entity fields. The following guidelines enable you to:

- Understand the central schema fields
- Understand how to extend schemas in a normalized manner, using other entities or entity fields that are not explicitly defined in the schema

#### The User entity

The descriptors used for a user are **Actor**, **Target User**, and **Updated User**, as described in the following scenarios:

|Activity  |Full scenario  |Single entity scenario used for aliasing  |
|---------|---------|---------|
|**Create User**     |  An **Actor** created or modified a **Target User**       |  The (Target) **User** was created.       |
|**Modify user**     |   An **Actor** renamed **Target User** to **Updated User**. The **Updated User** usually does not have all the information associated with a user and has some overlap with the **Target User**.      |         |
|**Network connection**     |    A process running as **Actor** on the source host, communicating with a process running as **Target User** on the destination host     |         |
|**DNS request**     | An **Actor** initiated a DNS query        |         |
|**Sign-in**     |    An **Actor** signed in to a system as a **Target User**.     |A (Target) User signed in         |
|**Process creation**     |   An **Actor** (the user associated with the initiating process) has initiated process creation. The process created runs under the credentials of a **Target User** (the user related to the target process).      |  The process created runs under the credentials of a (Target) **User**.       |
|**Email**     |     An **Actor** sends an email to a **Target User**    |         |

<br>

The following table describes the supported identifiers for a user:

|Normalized field  |Type  |Format and supported types  |
|---------|---------|---------|
|**UserId**     |    String     |   A machine-readable, alphanumeric, unique representation of a user in a system. <br><br>Format and supported types include:<br>    -	**SID** (Windows): `S-1-5-21-1377283216-344919071-3415362939-500`<br>    -	**UID** (Linux): `4578`<br>    -	**AADID** (Azure Active Directory): `9267d02c-5f76-40a9-a9eb-b686f3ca47aa`<br>    -	**OktaId**: `00urjk4znu3BcncfY0h7`<br>    -	**AWSId**: `72643944673`<br><br>    Store the ID type in the `UserIdType` field. If other IDs are available, we recommend that you normalize the field names to `UserSid`, `UserUid`, `UserAADID`, `UserOktaId` and `UserAwsId`, respectively.       |
|**Username**     |  String       |   A username, including domain information when available, in one of the following formats and in the following order of priority: <br> -	**Upn/Email**: `johndow@contoso.com` <br>  -	**Windows**: `Contoso\johndow` <br> -	**DN**: `CN=Jeff Smith,OU=Sales,DC=Fabrikam,DC=COM` <br>  -	**Simple**: `johndow`. Use this form only if domain information is not available. <br><br> Store the Username type in the `UsernameType` field.    |

<br>

#### The Process entity

The descriptors used for a user are `Acting Process`, `Target Process`, and `Parent Process`, as described in the following scenarios:

- **Network connection**. An **Acting Process** initiated a network connection to communicate with **Target Process** on a remote system.
- **DNS request**.	An **Acting Process** initiated a DNS query
- **Sign-in**.	An **Acting Process** initiated a signing into a remote system that ran a **Target Process** on its behalf.
- **Process creation**.	An **Acting Process** has initiated a **Target Process** creation. The **Parent Process** is the parent of the acting process.

The following table describes the supported identifiers for processes:

|Normalized field  |Type  |Format and supported types  |
|---------|---------|---------|
|**Id**     |    String     |   The OS-assigned process ID.      |
|**Guid**     |  String       |   The OS-assigned process GUID. The GUID is commonly unique across system restarts, while the ID is often reused.   |
|**Path**     |    String     |   The full pathname of the process, including directory and file name.       |
|**Name**     |  Alias       |  The process name is an alias to the path.   |

<br>

For more information, see [Azure Sentinel Process Event normalization schema reference (Public preview)](process-events-normalization-schema.md).

#### The Device entity

The normalization schemas attempt to follow user intuition as much as possible, and therefore handle devices in various ways, depending on the scenario:

- When the event context implies a source and target device, the `Src` and `Target` descriptors are used. In such cases, the `Dvc` descriptor is used for the reporting device.

- For single device events, such as local OS events, the `Dvc` descriptor is used.

- If another gateway device is referenced in the event, and the value is different from the reporting device, the `Gateway` descriptor is used.

Device handling guidelines are further clarified as follows:

- **Network connection**. A connection was established from a **Source Device** (`Src`) to a **Target Device** (`Target`). The connection was reported by a (reporting) **Device** (`Dvc`).
- **Proxied network connection**. A connection was established from a **Source Device** (`Src`) to a **Target Device** (`Target`) through a **Gateway Device** (`Gateway`). A (reporting) **Device** reported the connection.
- **DNS request**.	A DNS query was initiated from a **Source Device** (`Src`).
- **Sign-in**	A signing was initiated from a **Source Device** (`Src`) to a remote system on a **Target Device** (`Target`).
- **Process**	A process was initiated on a **Device** (`Dvc`).

The following table describes the supported identifiers for devices:

|Normalized field  |Type  |Format and supported types  |
|---------|---------|---------|
|**Hostname**     |    String     |        |
|**FQDN**     |  String       |   A fully qualified domain name   |
|**IpAddr**     |    IP Address     |   While devices may have multiple IP addresses, events usually have a single identifying IP address. The exception is a gateway device that may have two relevant IP addresses. For a gateway device, use `UpstreamIpAddr` and `DownstreamIpAddr`.      |
|**HostId**     |  String       |     |

<br>

> [!NOTE]
> `Domain` is a typical attribute of a device, but is not a complete identifier.
>

For more information, see [Azure Sentinel Authentication normalization schema reference (Public preview)](authentication-normalization-schema.md).

#### Entity mapping example

This section uses [Windows event 4624](/windows/security/threat-protection/auditing/event-4624) as an example to describe how the event data is normalized for Azure Sentinel.

This event has the following entities:

|Microsoft terminology  |Original Event Field Prefix |ASIM Field Prefix  |Description  |
|---------|---------|---------|---------|
|**Subject**     | `Subject`        |   `Actor`      |  The user that reported information about a successful sign-in.      |
|**New Logon**     |    `Target`     |  `TargetUser`       |  The user for which the sign-in was performed.       |
|**Process**     |    -     |     `ActingProcess`    |   The process that attempted the sign-in.      |
|**Network information**     |   -      |   `Src`      |     The machine from which a sign-in attempt was performed.    |

<br>

Based on these entities, [Windows event 4624](/windows/security/threat-protection/auditing/event-4624) is normalized as follows (some fields are optional):

|Normalized Field  |Original Field  |Value in example  |Notes  |
|---------|---------|---------|---------|
|**ActorUserId**     |  SubjectUserSid       |  S-1-5-18        |        |
|**ActorUserIdType**     |  -       | SID        |         |
|**ActorUserName**     |   SubjectDomainName\ SubjectUserName      |  WORKGROUP\WIN-GG82ULGC9GO$       |  Built by concatenating the two fields       |
|**ActorUserNameType**     |   -      |   Windows      |         |
|**ActorSessionId**     | SubjectLogonId        |  0x3e7       |         |
|**TargetUserId**     |   TargetUserSid      |    S-1-5-21-1377283216-344919071-3415362939-500     |         |
|**UserId**     |    TargetUserSid     |   alias      |         |
|**TargetUserIdType**     |   -      |    SID     |         |
|**TargetUserName**     | TargetDomainName\ TargerUserName        |   Administrator\WIN-GG82ULGC9GO$      |   Built by concatenating the two fields      |
|**Username**     |  TargetDomainName\ TargerUserName       |  alias       |         |
|**TargetUserNameType**     | -        |  Windows       |         |
|**TargetSessionId**     |   TargetLogonId      |  0x8dcdc       |         |
|**ActingProcessName**     |  ProcessName       |  C:\\Windows\\System32\\svchost.exe       |         |
|**ActingProcessId**     |    ProcessId     |     0x44c    |         |
|**SrcHostname**     |    WorkstationName     | Windows        |         |
|**SrcIpAddr**     |  IpAddress       |     127.0.0.1    |         |
|**SrcPortNumber**     |  IpPort       |  0       |         |
|**TargetHostname**     |   Computer      |  WIN-GG82ULGC9GO	       |         |
|**Hostname**     |     Computer    |     Alias    |         |

<br>

## Parsers

In Azure Sentinel, parsing happens at query time. Parsers are built as [KQL user-defined functions](/azure/data-explorer/kusto/query/functions/user-defined-functions) that transform data in existing tables, such as **CommonSecurityLog**, custom logs tables, or Syslog, into the normalized schema. Once the parser is saved as a workspace function, it can be used like any other Azure Sentinel table.

There are two levels of parsers: **source-agnostic** and **source-specific** parsers, as shown in the [Azure Sentinel Information Model components](#azure-sentinel-information-model-components) image above.

- A **source-agnostic parser** combines all the sources normalized to the same schema and can be used to query all of them using normalized fields. The source agnostic parser name is `im<schema>`, where `<schema>` stands for the specific schema it serves.

    For example, the following query uses the source-agnostic DNS parser to query DNS events using the `ResponseCodeName`, `SrcIpAddr`, and `TimeGenerated` normalized fields:

    ```kusto
    imDns
      | where isnotempty(ResponseCodeName)
      | where ResponseCodeName =~ "NXDOMAIN"
      | summarize count() by SrcIpAddr, bin(TimeGenerated,15m)
    ```

    A source-agnostic parser can combine several source-specific normalized parsers using the `union` KQL operator. The name of a source-specific normalized parser is `vim<schema><vendor><product>`. Therefore, the `imDns` parser looks as follows:

    ```kusto
    union isfuzzy=true
    vimDnsEmpty,
    vimDnsCiscoUmbrella,
    vimDnsInfobloxNIOS,
    vimDnsMicrosoftOMS
    ```

- Adding **source-specific** normalized parsers to the source-agnostic parser enables you to include custom sources in built-in queries that use the source agnostic parsers.

    Source-specific parsers enable you to get immediate value from built-in content, such as analytics, workbooks, insights for your custom data.

    The source-specific parsers can also be used independently. For example, in an Infoblox-specific workbook, use the `vimDnsInfobloxNIOS` parser.
### Writing parsers

A parser is a KQL query saved as a workspace function. Once saved, it can be used like built-in tables. The parser query includes the following parts:

**Filter** > **Parse** > **Prepare fields**

#### Filtering

In many cases, a table includes multiple types of events. For example:
* The Syslog table has data from multiple sources.
* Custom tables may include information from a single source that provides more than one event type and can fit various schemas.

Therefore, a parser should first filter only the records that are relevant to the target schema.

Filtering in KQL is done using the `where` operator. For example, **Sysmon event 1** reports process creation and should be normalized to the **ProcessEvent** schema. The **Sysmon event 1** event is part of the `Event` table, and the following filter should be used:

```kusto
Event | where Source == "Microsoft-Windows-Sysmon" and EventID == 1
```

To ensure the performance of the parser, note the following filtering recommendations:

-	Always filter on built-in rather than parsed fields. While it's sometimes easier to filter using parsed fields, it has a dramatic impact on performance.
-	Use operators that provide optimized performance. In particular, `==`, `has`, and `startswith`. Using operators such as `contains` or `matches regex` also dramatically impacts performance.

Filtering recommendations for performance may not always be trivial to follow. For example, using `has` is less accurate than `contains`. In other cases, matching the built-in field, such as `SyslogMessage`, is less accurate than comparing an extracted field, such as `DvcAction`. In such cases, we recommend that you still pre-filter using a performance-optimizing operator over a built-in field, and repeat the filter using more accurate conditions after parsing.

For an example, see to the following [Infoblox DNS](https://github.com/Azure/Azure-Sentinel/tree/master/Parsers/ASimDns/ARM/Infoblox) parser snippet. The parser first checks that the SyslogMessage field `has` the word `client`. However, the term might be used in a different place in the message. Therefore, after parsing the `Log_Type` field, the parser checks again that the word `client` was indeed the field's value.

```kusto
Syslog | where ProcessName == "named" and SyslogMessage has "client"
…
      | extend Log_Type = tostring(Parser[1]),
      | where Log_Type == "client"
```

> [!NOTE]
> Parsers should not filter by time, as the query that's using the parser filters for time.
> 

#### Parsing

Once the query selects the relevant records, it may need to parse them. Typically, parsing is needed if much of the event information is conveyed in a single text field.

The KQL operators that perform parsing are listed below, ordered by their performance optimization. The first provides the most optimized performance, while the last provides the least optimized performance.

|Operator  |Description  |
|---------|---------|
|[split](/azure/data-explorer/kusto/query/splitfunction)     |    Parse a string of values delimited by a delimiter     |
|[parse_csv](/azure/data-explorer/kusto/query/parsecsvfunction)     |     Parse a string of values formatted as a CSV (comma-separated values) line.    |
|[parse](/azure/data-explorer/kusto/query/parseoperator)     |    Parse multiple values from an arbitrary string using a pattern, which can be a simplified pattern with better performance, or a regular expression.     |
|[extract_all](/azure/data-explorer/kusto/query/extractallfunction)     | Parse single values from an arbitrary string using a regular expression. `extract_all` has a similar performance to `parse` if the latter uses a regular expression.        |
|[extract](/azure/data-explorer/kusto/query/extractfunction)     |    Extract a single value from an arbitrary string using a regular expression. <br><br>Using `extract` provides better performance than `parse` or `extract_all` if a single value is needed. However, using multiple activations of `extract` over the same source string is significantly less efficient than a single `parse` or `extract_all` and should be avoided.      |
|[parse_json](/azure/data-explorer/kusto/query/parsejsonfunction)  | Parse the values in a string formatted as JSON. If only a few values are needed from the JSON, using `parse`, `extract`, or `extract_all` provides better performance.        |
|[parse_xml](/azure/data-explorer/kusto/query/parse-xmlfunction)     |    Parse the values in a string formatted as XML. If only a few values are needed from the XML, using `parse`, `extract`, or `extract_all` provides better performance.     |

<br>

In addition to parsing string, the parsing phase may require more processing of the original values, including:

- **Formatting and type conversion**. The source field, once extracted, may need to be formatted to fit the target schema field. For example, you may need to convert a string representing date and time to a datetime field.     Functions such as `todatetime` and `tohex` are helpful in these cases.

- **Value lookup**. The value of the source field, once extracted, may need to be mapped to the set of values specified for the target schema field. For example, some sources report numeric DNS response codes, while the schema mandates the more common text response codes. For mapping a small number of values, the functions `iff` and `case` can be useful.

    For example, the Microsoft DNS parser assigns the `EventResult` field based on the Event ID and Response Code using an `iff` statement, as follows:

    ```kusto
    extend EventResult = iff(EventId==257 and ResponseCode==0 ,'Success','Failure')
    ```

    For several values, use `datatable` and `lookup`, as demonstrated in the same DNS parser:

    ```kusto
    let RCodeTable = datatable(ResponseCode:int,ResponseCodeName:string) [ 0, 'NOERROR', 1, 'FORMERR'....];
    ...
     | lookup RCodeTable on ResponseCode
     | extend EventResultDetails = case (
         isnotempty(ResponseCodeName), ResponseCodeName, 
         ResponseCode between (3841 .. 4095), 'Reserved for Private Use', 
         'Unassigned')
    ```

> [!NOTE]
> The transformation does not allow using only `lookup`, as multiple values are mapped to `Reserved for Private Use`, `Unassigned` and therefore the query uses both lookup and case. 
> Even so, the query is still much more efficient than using `case` for all values.
>

#### Prepare fields in the result set

The parser has to prepare the fields in the result set to ensure that the normalized fields are used. As a guideline, original fields that are not normalized should not be removed from the result set unless there is a compelling reason to do so, such as if they create confusion.

The following KQL operators are used to prepare fields:

|Operator  | Description  | When to use in a parser  |
|---------|---------|---------|
|**extend**     | Creates calculated fields and adds them to the record        |  `Extend` is used if the normalized fields are parsed or transformed from the original data. For more information, see the example in the [Parsing](#parsing) section above.     |
|**project-rename**     | Renames fields        |     If a field exists in the original event and only needs to be renamed, use `project-rename`. <br><br>The renamed field still behaves like a built-in field, and operations on the field have much better performance.   |
|**project-away**     |      Removes fields.   |Use `project-away` for specific fields that you want to remove from the result set.         |
|**project**     |  Selects fields that were either existing before, or were created as part of the statement. Removes all other fields.       | Not recommended for use in a parser, as the parser should not remove any other fields that are not normalized. <br><br>If you need to remove specific fields, such as temporary values used during parsing, use `project-away` to remove them from the results.      |

<br>

### Handle parsing variants

In many cases, events in an event stream include variants that require different parsing logic. 

It's often tempting to build a parser from different subparsers, each handling another variant of the events that needs different parsing logic. Those subparsers, each a query by itself, are then unified using the `union` operator. This approach, while convenient, is *not* recommended as it significantly impacts the performance of the parser.

When handling variants, use the following guidelines:

|Scenario  |Handling  |
|---------|---------|
|The different variants represent *different* event types, commonly mapped to different schemas     |  Use separate parsers       |
|The different variants represent the *same* event type, but are structured differently.     |   If the variants are known, such as when there is a method to differentiate between the events before parsing, use the `case` operator to select the correct `extract_all` to run and field mapping, as demonstrated in the [Infoblox DNS parser](https://github.com/Azure/Azure-Sentinel/tree/master/Parsers/ASimDns/ARM/Infoblox).      |
|If `union` is unavoidable     |  When using `union` is unavoidable, make sure to use the following guidelines:<br><br>-	Pre-filter using built-in fields in each one of the subqueries. <br>-	Ensure that the filters are mutually exclusive. <br>-	Consider not parsing less critical information, reducing the number of subqueries.       |

<br>

### Deploy parsers

Deploy parsers manually by copying them to the Azure Monitor **Log** page and saving your change. This method is useful for testing. For more information, see [Create a function](../azure-monitor/logs/functions.md).

However, to deploy a large number of parsers, we recommend that you use an ARM template. For example, you may want to use an ARM template when deploying a complete normalization solution that includes a source-agnostic parser and several source-specific parsers, or when deploying multiple parsers for different schemas for a source.

For more information, see the [generic parser ARM template](https://github.com/Azure/Azure-Sentinel/tree/master/Tools/ARM-Templates/ParserQuery). Use this template as a starting point and deploy your parser by pasting it in at the relevant point during the template deployment process. For example, see the [DNS parsers ARM template](https://github.com/Azure/Azure-Sentinel/tree/master/Parsers/ASimDns/ARM).

> [!TIP]
> ARM templates can include different resources, so your parsers can be deployed alongside connectors, analytic rules, or watchlists, to name a few useful options. For example, your parser can reference a watchlist that will be deployed alongside it.
>

### Use parsers in normalized content

Azure Sentinel content includes analytic rules, hunting queries, and workbooks that work with source-agnostic normalization parsers.

- Find normalized, built-in content in Azure Sentinel galleries and [solutions](sentinel-solutions-catalog.md).

- Create normalized content yourself, or modify existing content to use normalized data.

####  Identify built-in normalized content

The documentation for each schema includes a list of content items that work with each normalized schema. Schema content is updated regularly, and uses the following guidelines:

-	**Content items that focus on a normalized schema** include the schema as part of the name. For example, the names of analytic rules that focus on the [Normalized DNS schema](dns-normalization-schema.md) have a suffix of `(Normalized DNS)`.

-	**Content items that consider the normalized schema among other data types** are not marked by any suffix. In such cases, search for the normalized schema parser name on GitHub to identify them all.

#### Modifying your content to use normalized data

To enable your custom content to use normalization:

- Modify your queries to use the source-agnostic parsers relevant to the query.
- Modify field names in your query to use the normalized schema field names.
- When applicable, change conditions to use the normalized values of the fields in your query.

For example, consider the **Rare client observed with high reverse DNS lookup count** DNS analytic rule, which works on DNS events send by Infoblox DNS servers:

```kusto
let threshold = 200;
InfobloxNIOS
| where ProcessName =~ "named" and Log_Type =~ "client"
| where isnotempty(ResponseCode)
| where ResponseCode =~ "NXDOMAIN"
| summarize count() by Client_IP, bin(TimeGenerated,15m)
| where count_ > threshold
| join kind=inner (InfobloxNIOS
    | where ProcessName =~ "named" and Log_Type =~ "client"
    | where isnotempty(ResponseCode)
    | where ResponseCode =~ "NXDOMAIN"
    ) on Client_IP
| extend timestamp = TimeGenerated, IPCustomEntity = Client_IP
```

The following version is the source-agnostic version, which uses normalization to provide the same detection for any source providing DNS query events:

```kusto
let threshold = 200;
imDns
| where isnotempty(ResponseCodeName)
| where ResponseCodeName =~ "NXDOMAIN"
| summarize count() by SrcIpAddr, bin(TimeGenerated,15m)
| where count_ > threshold
| join kind=inner (imDns
    | where isnotempty(ResponseCodeName)
    | where ResponseCodeName =~ "NXDOMAIN"
    ) on SrcIpAddr
| extend timestamp = TimeGenerated, IPCustomEntity = SrcIpAddr
```

The normalized, source-agnostic version has the following differences:

- The `imDns`normalized parser is used instead of the Infoblox Parser.

- `imDns` fetches only DNS query events, so there is no need for checking the event type, as performed by the `where ProcessName =~ "named" and Log_Type =~ "client"` in the Infoblox version.

- The `ResponseCodeName` and `SrcIpAddr` fields are used instead of `ResponseCode`, and `Client_IP`, respectively.

#### Enable normalized content to use your custom data

Normalization allows you to use your own content and built-in content with your custom data.

For example, if you have a custom connector that receives DNS query activity log, you can ensure that the DNS query activity logs take advantage of any normalized DNS content by:

-	[Creating a normalized parser](#parsers) for your custom connector. If the parser is for product `Xxx` by vendor `Yyy`, the parser should be named `vimDnsYyyXxx`.

-	Modifying the `imDns` source-agnostic parser to also include your parser by adding it to the list of parsers in the `union` statement. For example:

    ```kusto
    union isfuzzy=true 
    vimDnsEmpty, 
    vimDnsCiscoUmbrella, 
    vimDnsInfobloxNIOS, 
    vimDnsMicrosoftOMS,
    vimDnsYyyXxx
    ```

## Next steps

This article describes normalization in Azure Sentinel and the Azure Sentinel Information Model.

For more information, see:

- [Azure Sentinel Network normalization schema reference](normalization-schema.md)
- [Azure Sentinel DNS normalization schema reference](dns-normalization-schema.md)
- [Azure Sentinel File Event normalization schema reference (Public preview)](file-event-normalization-schema.md)
- [Azure Sentinel Process Event normalization schema reference](process-events-normalization-schema.md)
- [Azure Sentinel Authentication normalization schema reference (Public preview)](authentication-normalization-schema.md)