---
title: The Advanced Security Information Model (ASIM) Registry Event normalization schema reference (Public preview) | Microsoft Docs
description: This article describes the Microsoft Sentinel Registry Event normalization schema.
author: oshezaf
ms.topic: reference
ms.date: 11/09/2021
ms.author: ofshezaf
ms.custom: ignite-fall-2021
---

# The Advanced Security Information Model (ASIM) Registry Event normalization schema reference (Public preview)

The Registry Event schema is used to describe the Windows activity of creating, modifying, or deleting Windows Registry entities.

Registry events are specific to Windows systems, but are reported by different systems that monitor Windows, such as EDR (End Point Detection and Response) systems, Sysmon, or Windows itself.

For more information about normalization in Microsoft Sentinel, see [Normalization and the Advanced Security Information Model (ASIM)](normalization.md).

> [!IMPORTANT]
> The Registry Event normalization schema is currently in PREVIEW. This feature is provided without a service level agreement, and is not recommended for production workloads.
>
> The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Parsers

To use the unifying parser that unifies all of the built-in parsers, and ensure that your analysis runs across all the configured sources, use **imRegistry** as the table name in your query.

For the list of the Process Event parsers Microsoft Sentinel provides out-of-the-box refer to the [ASIM parsers list](normalization-parsers-list.md#registry-event-parsers) 

Deploy the [unifying and source-specific parsers](normalization-about-parsers.md) from the [Microsoft Sentinel GitHub repository](https://aka.ms/AzSentinelRegistry).

For more information, see [ASIM parsers](normalization-parsers-overview.md) and [Use ASIM parsers](normalization-about-parsers.md).

### Add your own normalized parsers

When implementing custom parsers for the Registry Event information model, name your KQL functions using the following syntax: `imRegistry<vendor><Product>`.

Add your KQL functions to the `imRegistry` unifying parsers to ensure that any content using the Registry Event model also uses your new parser.

## Normalized content

Microsoft Sentinel provides the [Persisting Via IFEO Registry Key](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/MultipleDataSources/PersistViaIFEORegistryKey.yaml) hunting query. This query works on any registry activity data normalized using the Advanced Security Information Model.

For more information, see [Hunt for threats with Microsoft Sentinel](hunting.md).

## Schema details

The Registry Event information model is aligned with the [OSSEM Registry entity schema](https://github.com/OTRF/OSSEM/blob/master/docs/cdm/entities/registry.md).


### Common ASIM fields

> [!IMPORTANT]
> Fields common to all schemas are described in detail in the [ASIM Common Fields](normalization-common-fields.md) article.
>

#### Common fields with specific guidelines

The following list mentions  fields that have specific guidelines for process activity events:

| Field               | Class       | Type       |  Description        |
|---------------------|-------------|------------|--------------------|
| **EventType**           | Mandatory   | Enumerated |    Describes the operation reported by the record. <br><br>For Registry records, supported values include: <br>- `RegistryKeyCreated` <br>- `RegistryKeyDeleted`<br>- `RegistryKeyRenamed` <br>- `RegistryValueDeleted` <br>- `RegistryValueSet`|
| **EventSchemaVersion**  | Mandatory   | String     |    The version of the schema. The version of the schema documented here is `0.1.2`         |
| **EventSchema** | Optional | String | The name of the schema documented here is `RegistryEvent`. |
| **Dvc** fields|        |      | For registry activity events, device fields refer to the system on which the registry activity occurred. |


> [!IMPORTANT]
> The `EventSchema` field is currently optional but will become Mandatory on September 1st 2022.
>

#### All common fields

Fields that appear in the table below are common to all ASIM schemas. Any guideline specified above overrides the general guidelines for the field. For example, a field might be optional in general, but mandatory for a specific schema. For further details on each field, refer to the [ASIM Common Fields](normalization-common-fields.md) article.

| **Class** | **Fields** |
| --------- | ---------- |
| Mandatory | - [EventCount](normalization-common-fields.md#eventcount)<br> - [EventStartTime](normalization-common-fields.md#eventstarttime)<br> - [EventEndTime](normalization-common-fields.md#eventendtime)<br> - [EventType](normalization-common-fields.md#eventtype)<br>- [EventResult](normalization-common-fields.md#eventresult)<br> - [EventProduct](normalization-common-fields.md#eventproduct)<br> - [EventVendor](normalization-common-fields.md#eventvendor)<br> - [EventSchema](normalization-common-fields.md#eventschema)<br> - [EventSchemaVersion](normalization-common-fields.md#eventschemaversion)<br> - [Dvc](normalization-common-fields.md#dvc)<br>|
| Recommended | - [EventResultDetails](normalization-common-fields.md#eventresultdetails)<br>- [EventSeverity](normalization-common-fields.md#eventseverity)<br>- [EventUid](normalization-common-fields.md#eventuid)<br> - [DvcIpAddr](normalization-common-fields.md#dvcipaddr)<br> - [DvcHostname](normalization-common-fields.md#dvchostname)<br> - [DvcDomain](normalization-common-fields.md#dvcdomain)<br>- [DvcDomainType](normalization-common-fields.md#dvcdomaintype)<br>- [DvcFQDN](normalization-common-fields.md#dvcfqdn)<br>- [DvcId](normalization-common-fields.md#dvcid)<br>- [DvcIdType](normalization-common-fields.md#dvcidtype)<br>- [DvcAction](normalization-common-fields.md#dvcaction)|
| Optional | - [EventMessage](normalization-common-fields.md#eventmessage)<br> - [EventSubType](normalization-common-fields.md#eventsubtype)<br>- [EventOriginalUid](normalization-common-fields.md#eventoriginaluid)<br>- [EventOriginalType](normalization-common-fields.md#eventoriginaltype)<br>- [EventOriginalSubType](normalization-common-fields.md#eventoriginalsubtype)<br>- [EventOriginalResultDetails](normalization-common-fields.md#eventoriginalresultdetails)<br> - [EventOriginalSeverity](normalization-common-fields.md#eventoriginalseverity) <br> - [EventProductVersion](normalization-common-fields.md#eventproductversion)<br> - [EventReportUrl](normalization-common-fields.md#eventreporturl)<br> - [EventOwner](normalization-common-fields.md#eventowner)<br>- [DvcZone](normalization-common-fields.md#dvczone)<br>- [DvcMacAddr](normalization-common-fields.md#dvcmacaddr)<br>- [DvcOs](normalization-common-fields.md#dvcos)<br>- [DvcOsVersion](normalization-common-fields.md#dvchostname)<br>- [DvcOriginalAction](normalization-common-fields.md#dvcoriginalaction)<br>- [DvcInterface](normalization-common-fields.md#dvcinterface)<br>- [AdditionalFields](normalization-common-fields.md#additionalfields)<br>- [DvcDescription](normalization-common-fields.md#dvcdescription)<br>- [DvcScopeId](normalization-common-fields.md#dvcscopeid)<br>- [DvcScope](normalization-common-fields.md#dvcscope)|




### Registry Event specific fields

The fields listed in the table below are specific to Registry events, but are similar to fields in other schemas and follow similar naming conventions.

For more information, see [Structure of the Registry](/windows/win32/sysinfo/structure-of-the-registry) in Windows documentation.

| Field          | Class        | Type       | Description   |
|---------------|--------------|------------|-----------------|
|<a name="registrykey"></a>**RegistryKey**     |     Mandatory    |   String      |The registry key associated with the operation, normalized to standard root key naming conventions. For more information, see [Root Keys](#root-keys).<br><br>Registry keys are similar to folders in file systems. <br><br>For example: `HKEY_LOCAL_MACHINE\SOFTWARE\MTG`        |
|**RegistryValue**     |    Recommended     |  String       |The registry value associated with the operation. Registry values are similar to files in file systems. <br><br>For example: `Path`        |
|<a name="registryvaluetype"></a>**RegistryValueType**     |    Recommended     |    String     | The type of registry value, normalized to standard form. For more information, see [Value Types](#value-types).<br><br>For example: `Reg_Expand_Sz`        |
|**RegistryValueData**     | Recommended       |      String   |  The data stored in the registry value. <br><br>Example: `C:\Windows\system32;C:\Windows;`       |
|<a name="registrypreviouskey"></a>**RegistryPreviousKey**     |  Recommended       |   String      |  For operations that modify the registry, the original registry key, normalized to standard root key naming. For more information, see [Root Keys](#root-keys). <br><br>**Note**: If the operation changed other fields, such as the value, but the key remains the same, the [RegistryPreviousKey](#registrypreviouskey) will have the same value as [RegistryKey](#registrykey).<br><br>Example: `HKEY_LOCAL_MACHINE\SOFTWARE\MTG`       |
|<a name="registrypreviousvalue"></a>**RegistryPreviousValue**     | Recommended        | String        | For operations that modify the registry, the original value type, normalized to the standard form. For more information, see [Value Types](#value-types). <br><br>If the type was not changed, this field has the same value as the [RegistryValueType](#registryvaluetype) field.  <br><br>Example: `Path`       |
|**RegistryPreviousValueType**     | Recommended        |   String      |For operations that modify the registry, the original value type. <br><br>If the type was not changed, this field will have the same value as the [RegistryValueType](#registryvaluetype) field, normalized to the standard form. For more information, see [Value types](#value-types).<br><br>Example: `Reg_Expand_Sz`         |
|**RegistryPreviousValueData**     | Recommended        |   String      |The original registry data, for operations that modify the registry. <br><br>Example:  `C:\Windows\system32;C:\Windows;`         |
|**User** | Alias | |Alias to the [ActorUsername](#actorusername) field. <br><br>Example: `CONTOSO\ dadmin` |
|**Process**     |  Alias       |         |  Alias to the [ActingProcessName](#actingprocessname) field.<br><br>Example: `C:\Windows\System32\rundll32.exe`       |
| <a name="actorusername"></a>**ActorUsername**  | Mandatory    | String     | The user name of the user who initiated the event. <br><br>Example: `CONTOSO\WIN-GG82ULGC9GO$`     |
| **ActorUsernameType**              | Conditional    | Enumerated |   Specifies the type of the user name stored in the [ActorUsername](#actorusername) field. For more information, see [The User entity](normalization-about-schemas.md#the-user-entity). <br><br>Example: `Windows`       |
| <a name="actoruserid"></a>**ActorUserId**    | Recommended  | String     |   A unique ID of the Actor. The specific ID depends on the system generating the event. For more information, see [The User entity](normalization-about-schemas.md#the-user-entity).  <br><br>Example: `S-1-5-18`    |
| **ActorScope** | Optional | String | The scope, such as Microsoft Entra tenant, in which [ActorUserId](#actoruserid) and [ActorUsername](#actorusername) are defined. or more information and list of allowed values, see [UserScope](normalization-about-schemas.md#userscope) in the [Schema Overview article](normalization-about-schemas.md).|
| **ActorUserIdType**| Recommended  | String     |  The type of the ID stored in the [ActorUserId](#actoruserid) field. For more information, see [The User entity](normalization-about-schemas.md#the-user-entity). <br><br>Example: `SID`         |
| **ActorSessionId** | Conditional     | String     |   The unique ID of the login session of the Actor.  <br><br>Example: `999`<br><br>**Note**: The type is defined as *string* to support varying systems, but on Windows this value must be numeric. If you are using a Windows machine and the source sends a different type, make sure to convert the value. For example, if source sends a hexadecimal value, convert it to a decimal value.   |
| <a name="actingprocessname"></a>**ActingProcessName**              | Optional     | String     |   The file name of the acting process image file. This name is typically considered to be the process name.  <br><br>Example: `C:\Windows\explorer.exe`  |
| **ActingProcessId**| Mandatory    | String        | The process ID (PID) of the acting process.<br><br>Example:  `48610176`           <br><br>**Note**: The type is defined as *string* to support varying systems, but on Windows and Linux this value must be numeric. <br><br>If you are using a Windows or Linux machine and used a different type, make sure to convert the values. For example, if you used a hexadecimal value, convert it to a decimal value.    |
| **ActingProcessGuid**              | Optional     | String     |  A generated unique identifier (GUID) of the acting process.   <br><br> Example: `EF3BD0BD-2B74-60C5-AF5C-010000001E00`            |
| **ParentProcessName**              | Optional     | String     |  The file name of the parent process image file. This value is typically considered to be the process name.    <br><br>Example: `C:\Windows\explorer.exe` |
| **ParentProcessId**| Mandatory    | String    | The process ID (PID) of the parent process.   <br><br>     Example:  `48610176`    |
| **ParentProcessGuid**              | Optional     | String     |  A generated unique identifier (GUID) of the parent process.     <br><br> Example: `EF3BD0BD-2B74-60C5-AF5C-010000001E00` |



### Root keys

Different sources represent registry key prefixes using different representations. For the [RegistryKey](#registrykey) and [RegistryPreviousKey](#registrypreviouskey) fields, use the following normalized prefixes:

|Normalized key prefix  |Other common representations  |
|---------|---------|
|**HKEY_LOCAL_MACHINE**     | `HKLM`, `\REGISTRY\MACHINE`        |
|**HKEY_USERS**     | `HKU`, `\REGISTRY\USER`        |


### Value types

Different sources represent registry value types using different representations. For the [RegistryValueType](#registryvaluetype) and [RegistryPreviousValueType](#registrypreviousvalue) fields, use the following normalized types:


|Normalized key prefix  |Other common representations  |
|---------|---------|
|  **Reg_None**   |    `None`, `%%1872`     |
|  **Reg_Sz**   |     `String`, `%%1873`    |
| **Reg_Expand_Sz**    | `ExpandString`, `%%1874`        |
|  **Reg_Binary**   |   `Binary`, `%%1875`      |
| **Reg_DWord**    |    `Dword`, `%%1876`     |
|  **Reg_Multi_Sz**   |  `MultiString`, `%%1879`       |
|  **Reg_QWord**   |    `Qword`, `%%1883`     |


## Schema updates

These are the changes in version 0.1.1 of the schema:
- Added the field `EventSchema`.

These are the changes in version 0.1.2 of the schema:
- Added the fields `ActorScope`, `DvcScopeId`, and `DvcScope`..


## Next steps

For more information, see:

- [Normalization in Microsoft Sentinel](normalization.md)
- [Microsoft Sentinel authentication normalization schema reference (Public preview)](normalization-schema-authentication.md)
- [Microsoft Sentinel DNS normalization schema reference](normalization-schema-dns.md)
- [Microsoft Sentinel file event normalization schema reference (Public preview)](normalization-schema-file-event.md)
- [Microsoft Sentinel network normalization schema reference](./normalization-schema-network.md)
