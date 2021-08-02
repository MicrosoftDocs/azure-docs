---
title: Azure Sentinel SAP solution - Available logs reference | Microsoft Docs
description: Learn about the SAP logs available from the Azure Sentinel SAP solution.
author: batamig
ms.author: bagold
ms.service: azure-sentinel
ms.topic: reference
ms.custom: mvc
ms.date: 07/21/2021
ms.subservice: azure-sentinel

---

# Azure Sentinel SAP solution logs reference (public preview)

This article describes the SAP logs available from the Azure Sentinel SAP data connector, including the table names in Azure Sentinel, the log purposes, and detailed log schemas. Schema field descriptions are based on the field descriptions in the relevant [SAP documentation](https://help.sap.com/).

This article is intended for advanced SAP users.

> [!NOTE]
> When using the XBP 3.0 interface, the Azure Sentinel SAP solution uses *Not Released* services. These services do not affect backend system or connector behavior.
>
> To "release" these services, implement the [SAP Note 2910263 - Unreleased XBP functions](https://launchpad.support.sap.com/#/notes/2910263).

> [!IMPORTANT]
> The Azure Sentinel SAP solution is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## ABAP Application log

- **Name in Azure Sentinel**: `ABAPAppLog_CL`

- **Related SAP documentation**: [SAP Help Portal](https://help.sap.com/viewer/56bf1265a92e4b4d9a72448c579887af/7.5.7/en-US/c769bcc9f36611d3a6510000e835363f.html)

- **Log purpose**: Records the progress of an application execution so that you can reconstruct it later as needed.

    Available by using RFC with a custom service based on standard services of XBP interface. This log is generated per client.


### ABAPAppLog_CL log schema

| Field                 | Description                    |
| --------------------- | ------------------------------ |
| AppLogDateTime        | Application log date time      |
| CallbackProgram       | Callback program               |
| CallbackRoutine       | Callback routine               |
| CallbackType          | Callback type                  |
| ClientID              | ABAP client ID (MANDT)         |
| ContextDDIC           | Context DDIC structure         |
| ExternalID            | External log ID                |
| Host                  | Host                           |
| Instance              | ABAP instance, in the following syntax:   `<HOST>_<SYSID>_<SYSNR>`              |
| InternalMessageSerial | Application log message serial |
| LevelofDetail         | Level of detail                |
| LogHandle             | Application log handle         |
| LogNumber             | Log number                     |
| MessageClass          | Message class                  |
| MessageNumber         | Message number                 |
| MessageText           | Message text                   |
| MessageType           | Message type                   |
| Object                | Application log object         |
| OperationMode         | Operation mode                 |
| ProblemClass          | Problem class                  |
| ProgramName           | Program name                   |
| SortCriterion         | Sort criterion                 |
| StandardText          | Standard text                  |
| SubObject             | Application log sub object     |
| SystemID              | System ID                      |
| SystemNumber          | System number                  |
| TransactionCode       | Transaction code               |
| User                  | User                           |
| UserChange            | User change                    |
| | |



## ABAP Change Documents log

- **Name in Azure Sentinel**: `ABAPChangeDocsLog_CL`

- **Related SAP documentation**: [SAP Help Portal](https://help.sap.com/viewer/6f51f5216c4b10149358d088a0b7029c/7.01.22/en-US/b8686150ed102f1ae10000000a44176f.html)

- **Log purpose**: Records:

    - SAP NetWeaver Application Server (AS) ABAP log changes to business data objects in change documents.

    - Other entities in the SAP system, such as user data, roles, addresses.

    Available by using RFC with a custom service based on standard services. This log is generated per client.

### ABAPChangeDocsLog_CL log schema


| Field                    | Description                 |
| ------------------------ | ---------------------------- |
| ActualChangeNum          | Actual change number         |
| ChangedTableKey          | Changed table key            |
| ChangeNumber             | Change number                |
| ClientID                 | ABAP client ID (MANDT)       |
| CreatedfromPlannedChange | Created from planned change, in the following syntax: `(‘X’ , ‘ ‘)`|
| CurrencyKeyNew           | Currency key: new value      |
| CurrencyKeyOld           | Currency key: old value      |
| FieldName                | Field name                   |
| FlagText                 | Flag text                    |
| Host                     | Host                         |
| Instance                 | ABAP instance, in the following syntax: `<HOST>_<SYSID>_<SYSNR>` |
| Language                 | Language                     |
| ObjectClass              | Object class, such as `BELEG`, `BPAR`, `PFCG`, `IDENTITY` |
| ObjectID                 | Object ID  |
| PlannedChangeNum         | Planned change number  |
| SystemID                 | System ID    |
| SystemNumber             | System number     |
| TableName                | Table name        |
| TransactionCode          | Transaction code   |
| TypeofChange_Header      | Header type of change, including: <br>`U` = Change; `I` = Insert; `E` = Delete Single Docu; `D` = Delete; `J` = Insert Single Docu |
| TypeofChange_Item        | Item type of change, including: <br>`U` = Change; `I` = Insert; `E` = Delete Single Docu; `D` = Delete; `J` = Insert Single Docu |
| UOMNew                   | Unit of measure: new value  |
| UOMOld                   | Unit of measure: old value |
| User                     | User  |
| ValueNew                 | Field content: new value |
| ValueOld                 | Field content: old value |
| Version                  | Version          |
| | |

## ABAP CR log

- **Name in Azure Sentinel**: `ABAPCRLog_CL`

- **Related SAP documentation**: [SAP Help Portal](https://help.sap.com/viewer/56bf1265a92e4b4d9a72448c579887af/7.5.7/en-US/c769bcd5f36611d3a6510000e835363f.html)

- **Log purpose**: Includes the Change & Transport System (CTS) logs, including the directory objects and customizations where changes were made.

    Available by using RFC with a custom service based on standard tables and standard services. This log is generated with data across all clients.

> [!NOTE]
> In addition to application logging, change documents, and table recording, all changes that you make to your production system using the Change & Transport System are documented in the CTS and TMS logs.
>


### ABAPCRLog_CL log schema

| Field        | Description                       |
| ------------ | --------------------------------- |
| Category     | Category (Workbench, Customizing) |
| ClientID     | ABAP client ID (MANDT)            |
| Description  | Description                       |
| Host         | Host                              |
| Instance     | ABAP instance, in the following syntax: `<HOST>_<SYSID>_<SYSNR>` |
| ObjectName   | Object name                       |
| ObjectType   | Object type                       |
| Owner        | Owner                             |
| Request      | Change request                    |
| Status       | Status                            |
| SystemID     | System ID                         |
| SystemNumber | System number                     |
| TableKey     | Table key                         |
| TableName    | Table name                        |
| ViewName     | View name                         |
| | |

## ABAP DB table data log

- **Name in Azure Sentinel**: `ABAPTableDataLog_CL`

- **Related SAP documentation**: [SAP Help Portal](https://help.sap.com/viewer/56bf1265a92e4b4d9a72448c579887af/7.5.7/en-US/c769bcd2f36611d3a6510000e835363f.html)

- **Log purpose**: Provides logging for those tables that are critical or susceptible to audits.

    Available by using RFC with a custom service. This log is generated with data across all clients.

### ABAPTableDataLog_CL log schema

| Field            | Description                           |
| ---------------- | ------------------------------------- |
| DBLogID          | DB log ID                             |
| Host             | Host                                  |
| Instance         | ABAP instance, in the following syntax: `<HOST>_<SYSID>_<SYSNR>` |
| Language         | Language                              |
| LogKey           | Log key                               |
| NewValue         | Field new value                       |
| OldValue         | Field old value                       |
| OperationTypeSQL | Operation type, `Insert`, `Update`, `Delete` |
| Program          | Program name                          |
| SystemID         | System ID                             |
| SystemNumber     | System number                         |
| TableField       | Table field                           |
| TableName        | Table name                            |
| TransactionCode  | Transaction code                      |
| UserName         | User                                  |
| VersionNumber    | Version number                        |
| | |

## ABAP Gateway log

- **Name in Azure Sentinel**: `ABAPOS_GW_CL`

- **Related SAP documentation**: [SAP Help Portal](https://help.sap.com/viewer/62b4de4187cb43668d15dac48fc00732/7.5.7/en-US/48b2a710ca1c3079e10000000a42189b.html)

- **Log purpose**: Monitors Gateway activities. Available by the SAP Control Web Service. This log is generated with data across all clients.

### ABAPOS_GW_CL log schema

| Field        | Description      |
| ------------ | ---------------- |
| Host         | Host             |
| Instance     | ABAP instance, in the following syntax: `<HOST>_<SYSID>_<SYSNR>`   |
| MessageText  | Message text     |
| Severity     | Message severity: `Debug`, `Info`, `Warning`, `Error`  |
| SystemID     | System ID        |
| SystemNumber | System number    |
| | |

## ABAP ICM log

- **Name in Azure Sentinel**: `ABAPOS_ICM_CL`

- **Related SAP documentation**: [SAP Help Portal](https://help.sap.com/viewer/683d6a1797a34730a6e005d1e8de6f22/7.52.4/en-US/a10ec40d01e740b58d0a5231736c434e.html)

- **Log purpose**: Records inbound and outbound requests and compiles statistics of the HTTP requests.

    Available by the SAP Control Web Service. This log is generated with data across all clients.

### ABAPOS_ICM_CL log schema

| Field        | Description      |
| ------------ | ---------------- |
| Host         | Host             |
| Instance     | ABAP instance, in the following syntax: `<HOST>_<SYSID>_<SYSNR>`   |
| MessageText  | Message text     |
| Severity     | Message severity, including: `Debug`, `Info`, `Warning`, `Error`   |
| SystemID     | System ID        |
| SystemNumber | System number    |
| | |

## ABAP Job log

- **Name in Azure Sentinel**: `ABAPJobLog_CL`

- **Related SAP documentation**: [SAP Help Portal](https://help.sap.com/viewer/b07e7195f03f438b8e7ed273099d74f3/7.31.19/en-US/4b2bc0974c594ba2e10000000a42189c.html)

- **Log purpose**: Combines all background processing job logs (SM37).

    Available by using RFC with a custom service based on standard services of XBP interfaces. This log is generated with data across all clients.

### ABAPJobLog_CL log schema


| Field               | Description                      |
| ------------------- | -------------------------------- |
| ABAPProgram         | ABAP program                     |
| BgdEventParameters  | Background event parameters      |
| BgdProcessingEvent  | Background processing event      |
| ClientID            | ABAP client ID (MANDT)           |
| DynproNumber        | Dynpro number                    |
| GUIStatus           | GUI status                       |
| Host                | Host                             |
| Instance            | ABAP instance (HOST_SYSID_SYSNR), in the following syntax: `<HOST>_<SYSID>_<SYSNR>` |
| JobClassification   | Job classification               |
| JobCount            | Job count                        |
| JobGroup            | Job group                        |
| JobName             | Job name                         |
| JobPriority         | Job priority                     |
| MessageClass        | Message class                    |
| MessageNumber       | Message number                   |
| MessageText         | Message text                     |
| MessageType         | Message type                     |
| ReleaseUser         | Job release user                 |
| SchedulingDateTime  | Scheduling date time             |
| StartDateTime       | Start date time                  |
| SystemID            | System ID                        |
| SystemNumber        | System number                    |
| TargetServer        | Target server                    |
| User                | User                             |
| UserReleaseInstance | ABAP instance - user release     |
| WorkProcessID       | Work process ID                  |
| WorkProcessNumber   | Work process Number              |
| | |

## ABAP Security Audit log

- **Name in Azure Sentinel**: `ABAPAuditLog_CL`

- **Related SAP documentation**: [SAP Help Portal](https://help.sap.com/viewer/280f016edb8049e998237fcbd80558e7/7.5.7/en-US/4d41bec4aa601c86e10000000a42189b.html)

- **Log purpose**: Records the following data:

    - Security-related changes to the SAP system environment, such as changes to main user records
    - Information that provides a higher level of data, such as successful and unsuccessful sign-in attempts
    - Information that enables the reconstruction of a series of events, such as successful or unsuccessful transaction starts

    Available by using RFC XAL/SAL interfaces. SAL is available starting from version Basis 7.50. This log is generated with data across all clients.

### ABAPAuditLog_CL log schema

| Field                      | Description                     |
| -------------------------- | ------------------------------- |
| ABAPProgramName            | Program name, SAL only                    |
| AlertSeverity              | Alert severity                  |
| AlertSeverityText          | Alert severity text, SAL only             |
| AlertValue                 | Alert value                     |
| AuditClassID               | Audit class ID, SAL only                 |
| ClientID                   | ABAP client ID (MANDT)          |
| Computer                   | User machine, SAL only                   |
| Email                      | User email                      |
| Host                       | Host                                                   |
| Instance                   | ABAP instance, in the following syntax: `<HOST>_<SYSID>_<SYSNR>`                  |
| MessageClass               | Message class                   |
| MessageContainerID         | Message container ID, XAL Only            |
| MessageID                  | Message ID, such as `‘AU1’,’AU2’…`                     |
| MessageText                | Message text                    |
| MonitoringObjectName       | MTE Monitor object name, XAL only        |
| MonitorShortName           | MTE Monitor short name, XAL only          |
| SAPProcesType              | System Log: SAP process type, SAL only    |
| B* - Background Processing |                                 |
| D* - Dialog Processing     |                                 |
| U* - Update Tasks         |                                 |
| SAPWPName                  | System Log: Work process number, SAL only |
| SystemID                   | System ID                       |
| SystemNumber               | System number                   |
| TerminalIPv6               | User machine IP, SAL only |
| TransactionCode            | Transaction code, SAL only |
| User                       | User                            |
| Variable1                  | Message variable 1              |
| Variable2                  | Message variable 2              |
| Variable3                  | Message variable 3              |
| Variable4                  | Message variable 4              |
| | |

## ABAP Spool log

- **Name in Azure Sentinel**: `ABAPSpoolLog_CL`

- **Related SAP documentation**: [SAP Help Portal](https://help.sap.com/viewer/290ce8983cbc4848a9d7b6f5e77491b9/7.52.1/en-US/4eae791c40f72045e10000000a421937.html)

- **Log purpose**: Serves as the main log for SAP Printing with the history of spool requests. (SP01).

    Available by using RFC with a custom service based on standard tables. This log is generated with data across all clients.

### ABAPSpoolLog_CL log schema

| Field                               | Description                                |
| ----------------------------------- | ------------------------------------------ |
| ArchiveStatus                       | Archive status                             |
| ArchiveType                         | Archive type                               |
| ArchivingDevice                     | Archiving device                           |
| AutoRereoute                        | Auto reroute                              |
| ClientID                            | ABAP client ID (MANDT)                     |
| CountryKey                          | Country key                                |
| DeleteSpoolRequestAuto              | Delete spool request auto                  |
| DelFlag                             | Deletion flag                              |
| Department                          | Department                                 |
| DocumentType                        | Document type                              |
| ExternalMode                        | External mode                              |
| FormatType                          | Format type                                |
| Host                                | Host                                       |
| Instance                            | ABAP instance, in the following syntax: `<HOST>_<SYSID>_<SYSNR>` |
| NumofCopies                         | Number of copies                           |
| OutputDevice                        | Output device                              |
| PrinterLongName                     | Printer long name                          |
| PrintImmediately                    | Print immediately                          |
| PrintOSCoverPage                    | Print OSCover page                         |
| PrintSAPCoverPage                   | Print SAPCover page                        |
| Priority                            | Priority                                   |
| RecipientofSpoolRequest             | Recipient of spool request                 |
| SpoolErrorStatus                    | Spool error status                         |
| SpoolRequestCompleted               | Spool request completed                    |
| SpoolRequestisALogForAnotherRequest | Spool request is a log for another request |
| SpoolRequestName                    | Spool request name                         |
| SpoolRequestNumber                  | Spool request number                       |
| SpoolRequestSuffix1                 | Spool request suffix1                      |
| SpoolRequestSuffix2                 | Spool request suffix2                      |
| SpoolRequestTitle                   | Spool request title                        |
| SystemID                            | System ID                                  |
| SystemNumber                        | System number                              |
| TelecommunicationsPartner           | Telecommunications partner                 |
| TelecommunicationsPartnerE          | Telecommunications partner E               |
| TemSeGeneralcounter                 | Temse counter                              |
| TemseNumAddProtectionRule           | Temse number add protection rule              |
| TemseNumChangeProtectionRule        | Temse number change protection rule           |
| TemseNumDeleteProtectionRule        | Temse number delete protection rule           |
| TemSeObjectName                     | Temse object name                          |
| TemSeObjectPart                     | TemSe object part                          |
| TemseReadProtectionRule             | Temse read protection rule                 |
| User                                | User                                       |
| ValueAuthCheck                      | Value auth check                           |
| | |

## APAB Spool Output log

- **Name in Azure Sentinel**: `ABAPSpoolOutputLog_CL`

- **Related SAP documentation**: [SAP Help Portal](https://help.sap.com/viewer/290ce8983cbc4848a9d7b6f5e77491b9/7.52.1/en-US/4eae779e40f72045e10000000a421937.html)

- **Log purpose**: Serves as the main log for SAP Printing with the history of spool output requests. (SP02).

    Available by using RFC with a custom service based on standard tables. This log is generated with data across all clients.

### ABAPSpoolOutputLog_CL log schema

| Field                              | Description                               |
| ---------------------------------- | ----------------------------------------- |
| AppServer                          | Application server                        |
| ClientID                           | ABAP client ID (MANDT)                    |
| Comment                            | Comment                                   |
| CopyCount                          | Copy count                                |
| CopyCounter                        | Copy counter                              |
| Department                         | Department                                |
| ErrorSpoolRequestNumber            | Error request number                      |
| FormatType                         | Format type                               |
| Host                               | Host                                      |
| HostName                           | Host name                                 |
| HostSpoolerID                      | Host spooler ID                          |
| Instance                           | ABAP instance                             |
| LastPage                           | Last page                                 |
| NumofCopies                        | Number of copies                              |
| OutputDevice                       | Output device                             |
| OutputRequestNumber                | Output request number                     |
| OutputRequestStatus                | Output request status                     |
| PhysicalFormatType                 | Physical format type                      |
| PrinterLongName                    | Printer long name                         |
| PrintRequestSize                   | Print request size                        |
| Priority                           | Priority                                  |
| ReasonforOutputRequest             | Reason for output request                 |
| RecipientofSpoolRequest            | Recipient of spool request                 |
| SpoolNumberofOutputReqProcessed    | Number of output requests - processed     |
| SpoolNumberofOutputReqWithErrors   | Number of output requests - with errors   |
| SpoolNumberofOutputReqWithProblems | Number of output requests - with problems |
| SpoolRequestNumber                 | Spool request number                      |
| StartPage                          | Start page                                |
| SystemID                           | System ID                                 |
| SystemNumber                       | System number                             |
| TelecommunicationsPartner          | Telecommunications partner                |
| TemSeGeneralcounter                | Temse counter                             |
| Title                              | Title                                     |
| User                               | User                                      |
| | |


## ABAP SysLog

- **Name in Azure Sentinel**: `ABAPOS_Syslog_CL`

- **Related SAP documentation**: [SAP Help Portal](https://help.sap.com/viewer/56bf1265a92e4b4d9a72448c579887af/7.5.7/en-US/c769bcbaf36611d3a6510000e835363f.html)

- **Log purpose**: Records all SAP NetWeaver Application Server (SAP NetWeaver AS) ABAP system errors, warnings, user locks because of failed sign-in attempts from known users, and process messages.

    Available by the SAP Control Web Service. This log is generated with data across all clients.

### ABAPOS_Syslog_CL log schema


| Field            | Description            |
| ---------------- | ---------------------- |
| ClientID         | ABAP client ID (MANDT) |
| Host             | Host                   |
| Instance         | ABAP instance, in the following syntax: `<HOST>_<SYSID>_<SYSNR> ` |
| MessageNumber    | Message number         |
| MessageText      | Message text           |
| Severity         | Message severity, one of the following values: `Debug`, `Info`, `Warning`, `Error`        |
| SystemID         | System ID              |
| SystemNumber     | System number          |
| TransacationCode | Transaction code       |
| Type             | SAP process type       |
| User             | User                   |
| | |


## ABAP Workflow log

- **Name in Azure Sentinel**: `ABAPWorkflowLog_CL`

- **Related SAP documentation**: [SAP Help Portal](https://help.sap.com/viewer/56bf1265a92e4b4d9a72448c579887af/7.5.7/en-US/c769bcccf36611d3a6510000e835363f.html)

- **Log purpose**: The SAP Business Workflow (WebFlow Engine) enables you to define business processes that aren't yet mapped in the SAP system.

    For example, unmapped business processes may be simple release or approval procedures, or more complex business processes such as creating base material and then coordinating the associated departments.

    Available by using RFC with a custom service based on standard tables and standard services. This log is generated per client.

### ABAPWorkflowLog_CL log schema


| Field               | Description                      |
| ------------------- | -------------------------------- |
| ActualAgent         | Actual agent                     |
| Address             | Address                          |
| ApplicationArea     | Application area                 |
| CallbackFunction    | Callback function                |
| ClientID            | ABAP client ID (MANDT)           |
| CreationDateTime    | Creation date time               |
| Creator             | Creator                          |
| CreatorAddress      | Creator address                  |
| ErrorType           | Error type                       |
| ExceptionforMethod  | Exception for method             |
| Host                | Host                             |
| Instance            | ABAP instance (HOST_SYSID_SYSNR), in the following syntax: `<HOST>_<SYSID>_<SYSNR>` |
| Language            | Language                         |
| LogCounter          | Log counter                      |
| MessageNumber       | Message number                   |
| MessageType         | Message type                     |
| MethodUser          | Method user                      |
| Priority            | Priority                         |
| SimpleContainer     | Simple container, packed as a list of Key-Value entities for the work item |
| Status              | Status                           |
| SuperWI             | Super WI                         |
| SystemID            | System ID                        |
| SystemNumber        | System number                    |
| TaskID              | Task ID                          |
| TasksClassification | Task classifications            |
| TaskText            | Task text                        |
| TopTaskID           | Top task ID                      |
| UserCreated         | User created                     |
| WIText              | Work item text                   |
| WIType              | Work item type                   |
| WorkflowAction      | Workflow action                  |
| WorkItemID          | Work item ID                     |
| | |





## ABAP WorkProcess log

- **Name in Azure Sentinel**: `ABAPOS_WP_CL`

- **Related SAP documentation**: [SAP Help Portal](https://help.sap.com/viewer/d0739d980ecf42ae9f3b4c19e21a4b6e/7.3.15/en-US/46fb763b6d4c5515e10000000a1553f6.html)

- **Log purpose**: Combines all work process logs. (default: `dev_*`).

    Available by the SAP Control Web Service. This log is generated with data across all clients.

### ABAPOS_WP_CL log schema


| Field        | Description         |
| ------------ | ------------------- |
| Host         | Host                |
| Instance     | ABAP instance, in the following syntax: `<HOST>_<SYSID>_<SYSNR>`   |
| MessageText  | Message text     |
| Severity     | Message severity: `Debug`, `Info`, `Warning`, `Error`  |
| SystemID     | System ID           |
| SystemNumber | System number       |
| WPNumber     | Work process number |
| | |


## HANA DB Audit Trail

- **Name in Azure Sentinel**: `Syslog`

- **Related SAP documentation**: [General](https://help.sap.com/viewer/6b94445c94ae495c83a19646e7c3fd56/2.0.03/en-US/48fd6586304c4f859bf92d64d0cd8b08.html) |  [Audit Trail](https://help.sap.com/viewer/b3ee5778bc2e4a089d3299b82ec762a7/2.0.03/en-US/0a57444d217649bf94a19c0b68b470cc.html)

- **Log purpose**: Records user actions, or attempted actions in the SAP HANA database. For example, enables you to log and monitor read access to sensitive data.

    Available by the Sentinel Linux Agent for Syslog. This log is generated with data across all clients.

### Syslog log schema

| Field         | Description  |
| ------------- | ------------ |
| Computer      | Host name    |
| HostIP        | Host IP      |
| HostName      | Host name    |
| ProcessID     | Process ID   |
| ProcessName   | Process name: `HDB*` |
| SeverityLevel | Alert        |
| SourceSystem  |   Source system OS, `Linux`           |
| SyslogMessage | Message, an unparsed audit trail message      |
| | |

## JAVA files

- **Name in Azure Sentinel**: `JavaFilesLogsCL`

- **Related SAP documentation**: [General](https://help.sap.com/viewer/2f8b1599655d4544a3d9c6d1a9b6546b/7.5.9/en-US/485059dfe31672d4e10000000a42189c.html) | [Java Security Audit Log](https://help.sap.com/viewer/1531c8a1792f45ab95a4c49ba16dc50b/7.5.9/en-US/4b6013583840584ae10000000a42189c.html)

- **Log purpose**: Combines all Java files-based logs, including the Security Audit Log, and System (cluster and server process), Performance, and Gateway logs. Also includes Developer Traces and Default Trace logs.

    Available by the SAP Control Web Service. This log is generated with data across all clients.

### JavaFilesLogsCL log schema


| Field            | Description          |
| ---------------- | -------------------- |
| Application      | Java application     |
| ClientID         | Client ID           |
| CSNComponent     | CSN component, such as `BC-XI-IBD` |
| DCComponent      | DC component, such as `com.sap.xi.util.misc` |
| DSRCounter       | DSR counter          |
| DSRRootContentID | DSR context GUID     |
| DSRTransaction   | DSR transaction GUID |
| Host             | Host                 |
| Instance         | Java instance, in the following syntax: `<HOST>_<SYSID>_<SYSNR>` |
| Location         | Java class           |
| LogName          | Java logName, such as: `Available`, `defaulttrace`, `dev*`, `security`, and so on
| MessageText      | Message text         |
| MNo              | Message number       |
| Pid              | Process ID           |
| Program          | Program name         |
| Session          | Session              |
| Severity         | Message severity, including: `Debug`,`Info`,`Warning`,`Error`     |
| Solution         | Solution             |
| SystemID         | System ID            |
| SystemNumber     | System number        |
| ThreadName       | Thread name          |
| Thrown           | Exception thrown     |
| TimeZone         | Timezone             |
| User             | User                 |
| | |

## Next steps

For more information, see:

- [Deploy the Azure Sentinel solution for SAP](sap-deploy-solution.md)
- [Azure Sentinel SAP solution detailed SAP requirements](sap-solution-detailed-requirements.md)
- [Expert configuration options, on-premises deployment and SAPControl log sources](sap-solution-deploy-alternate.md)
- [Azure Sentinel SAP solution: built-in security content](sap-solution-security-content.md)
- [Troubleshooting your Azure Sentinel SAP solution deployment](sap-deploy-troubleshoot.md)
