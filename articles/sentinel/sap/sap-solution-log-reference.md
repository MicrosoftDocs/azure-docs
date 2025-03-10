---
title: Log and table reference for the Microsoft Sentinel solution for SAP applications
description: Learn about the SAP logs, tables, and functions available from the Microsoft Sentinel solution for SAP applications.
author: batamig
ms.author: bagol
ms.topic: reference
ms.custom: mvc
ms.date: 01/15/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
#Customer intent: As a security analyst, I want to understand the functions, logs, and tables available in the Microsoft Sentinel solution for SAP applications so that I can effectively monitor and analyze SAP system security and performance.

---

# Log and table reference for the Microsoft Sentinel solution for SAP applications

This article describes the logs and tables available as part of the Microsoft Sentinel solution for SAP applications and its data connector.

Some logs, noted in this article, aren't sent to Microsoft Sentinel by default, but you can manually add them as needed. For more information, see [Define the SAP logs that are sent to Microsoft Sentinel](sap-solution-deploy-alternate.md#define-the-sap-logs-that-are-sent-to-microsoft-sentinel)

Content in this article is intended for your **SAP BASIS** teams.

> [!IMPORTANT]
> Some components of the Microsoft Sentinel Threat Monitoring for SAP solution are currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Use functions in your queries instead of underlying logs or tables

We *strongly recommend* that you use available functions as the subjects of their analysis whenever possible, instead of the underlying logs or tables.

[Functions](/azure/azure-monitor/logs/functions) provided with the Microsoft Sentinel solution for SAP applications are intended to serve as the principal user interface to the data. They form the basis for all the built-in analytics rules and workbooks available to you out of the box. Using functions allows for changes to be made to the data infrastructure beneath the functions, without breaking user-created content.

For more information, see [Microsoft Sentinel solution for SAP applications - functions reference](sap-solution-function-reference.md) and [Functions in Azure Monitor log queries](/azure/azure-monitor/logs/functions).

## Log coverage

The Microsoft Sentinel solution for SAP applications collects logs from the application, OS, and data layers, providing comprehensive protection for your SAP system:

- **Application layer**: Microsoft Sentinel monitors activities within the ABAP layer, which is the primary application layer in SAP systems, responsible for executing business logic and processing transactions. For example, Microsoft Sentinel collects logs that include user actions like sign-ins, password changes, and access to reports or files.

    In addition to security monitoring, logs collected at the application layer can also be used for compliance and auditing purposes.

- **OS layer**: Microsoft Sentinel gathers logs from the operating system to provide insights into OS-level activities, such as from the ABAP server and the virtual machines on which the SAP applications are running.

    Use the Microsoft Sentinel solution for SAP applications together with security content and data connectors for your other services for comprehensive and central monitoring, correlating information across all your systems and enhancing your overall security posture.

- **Database layer**: Ingest database logs into Microsoft Sentinel to monitor database activities, such as database administration activities and changes to table data. The Microsoft Sentinel solution for SAP applications is database-agnostic.

All logs collected by the data connector agent are stored first on the data collector agent machine, at `/opt/sapcon/<sid>/log` folder in the container instance. The logs are then forwarded to your Log Analytics workspace, where you can view, audit, and query them from Microsoft Sentinel.

Audit logs are collected and ingested every minute, while other logs might be ingested less frequently. Microsoft Sentinel also monitors the data connector agent heartbeat to ensure that logs are being collected and sent to the Log Analytics workspace.

## Log reference

The following sections describe the SAP logs available from the Microsoft Sentinel solution for SAP applications data connector, including the table names in Microsoft Sentinel, the log purposes, and detailed log schemas.

Schema field descriptions are based on the field descriptions in the relevant [SAP documentation](https://help.sap.com/).

- [ABAP Application log](#abap-application-log)
- [ABAP Change Documents log](#abap-change-documents-log)
- [ABAP CR log](#abap-cr-log)
- [ABAP DB table data log](#abap-db-table-data-log-preview) (PREVIEW)
- [ABAP Gateway log](#abap-gateway-log-preview) (PREVIEW)
- [ABAP ICM log](#abap-icm-log-preview) (PREVIEW)
- [ABAP Job log](#abap-job-log)
- [ABAP Security Audit log](#abap-security-audit-log)
- [ABAP Spool log](#abap-spool-log)
- [APAB Spool Output log](#apab-spool-output-log)
- [ABAP SysLog](#abap-syslog)
- [ABAP Workflow log](#abap-workflow-log)
- [ABAP WorkProcess log](#abap-workprocess-log)
- [HANA DB Audit Trail](#hana-db-audit-trail)
- [JAVA files](#java-files)
- [SAP Heartbeat Log](#sap-heartbeat-log)

### ABAP Application log

- **Microsoft Sentinel function for querying this log**: SAPAppLog

- **Related SAP documentation**: [SAP Help Portal](https://help.sap.com/viewer/56bf1265a92e4b4d9a72448c579887af/7.5.7/en-US/c769bcc9f36611d3a6510000e835363f.html)

- **Log purpose**: Records the progress of an application execution so that you can reconstruct it later as needed.

    Available by using RFC based on standard SAP table and standard services of XBP interface. This log is generated per client.

#### ABAPAppLog_CL log schema

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
| Instance              | ABAP instance, in the following syntax: `<HOST>_<SYSID>_<SYSNR>` |
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

### ABAP Change Documents log

- **Microsoft Sentinel function for querying this log**: SAPChangeDocsLog

- **Related SAP documentation**: [SAP Help Portal](https://help.sap.com/viewer/6f51f5216c4b10149358d088a0b7029c/7.01.22/en-US/b8686150ed102f1ae10000000a44176f.html)

- **Log purpose**: Records:

    - SAP NetWeaver Application Server (AS) ABAP log changes to business data objects in change documents.

    - Other entities in the SAP system, such as user data, roles, addresses.

    Available by using RFC based on standard SAP tables. This log is generated per client.

#### ABAPChangeDocsLog_CL log schema

| Field                    | Description                  |
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

### ABAP CR log

- **Microsoft Sentinel function for querying this log**: SAPCRLog

- **Related SAP documentation**: [SAP Help Portal](https://help.sap.com/viewer/56bf1265a92e4b4d9a72448c579887af/7.5.7/en-US/c769bcd5f36611d3a6510000e835363f.html)

- **Log purpose**: Includes the Change & Transport System (CTS) logs, including the directory objects and customizations where changes were made.

    Available by using RFC based on standard tables and standard SAP services. This log is generated with data across all clients.

> [!NOTE]
> In addition to application logging, change documents, and table recording, all changes that you make to your production system using the Change & Transport System are documented in the CTS and TMS logs.
>

#### ABAPCRLog_CL log schema

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

### ABAP DB table data log (PREVIEW)

To have this log sent to Microsoft Sentinel, you must [add it manually to the **systemconfig.json** file](sap-solution-deploy-alternate.md#define-the-sap-logs-that-are-sent-to-microsoft-sentinel). This log isn't supported when using the recommended procedure to [install the data connector agent from the portal](deploy-data-connector-agent-container.md).

- **Microsoft Sentinel function for querying this log**: SAPTableDataLog

- **Related SAP documentation**: [SAP Help Portal](https://help.sap.com/viewer/56bf1265a92e4b4d9a72448c579887af/7.5.7/en-US/c769bcd2f36611d3a6510000e835363f.html)

- **Log purpose**: Provides logging for those tables that are critical or susceptible to audits.

    Available by using RFC with a custom service. This log is generated with data across all clients.

#### ABAPTableDataLog_CL log schema

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

### ABAP Gateway log (PREVIEW)

To have this log sent to Microsoft Sentinel, you must [add it manually to the **systemconfig.json** file](sap-solution-deploy-alternate.md#define-the-sap-logs-that-are-sent-to-microsoft-sentinel). This log isn't supported when using the recommended procedure to [install the data connector agent from the portal](deploy-data-connector-agent-container.md).

- **Microsoft Sentinel function for querying this log**: SAPOS_GW

- **Related SAP documentation**: [SAP Help Portal](https://help.sap.com/viewer/62b4de4187cb43668d15dac48fc00732/7.5.7/en-US/48b2a710ca1c3079e10000000a42189b.html)

- **Log purpose**: Monitors Gateway activities. Available by the SAP Control web service. This log is generated with data across all clients.

#### ABAPOS_GW_CL log schema

| Field        | Description      |
| ------------ | ---------------- |
| Host         | Host             |
| Instance     | ABAP instance, in the following syntax: `<HOST>_<SYSID>_<SYSNR>`   |
| MessageText  | Message text     |
| Severity     | Message severity: `Debug`, `Info`, `Warning`, `Error`  |
| SystemID     | System ID        |
| SystemNumber | System number    |

### ABAP ICM log (PREVIEW)

To have this log sent to Microsoft Sentinel, you must [add it manually to the **systemconfig.json** file](sap-solution-deploy-alternate.md#define-the-sap-logs-that-are-sent-to-microsoft-sentinel). This log isn't supported when using the recommended procedure to [install the data connector agent from the portal](deploy-data-connector-agent-container.md).

- **Microsoft Sentinel function for querying this log**: SAPOS_ICM

- **Related SAP documentation**: [SAP Help Portal](https://help.sap.com/viewer/683d6a1797a34730a6e005d1e8de6f22/7.52.4/en-US/a10ec40d01e740b58d0a5231736c434e.html)

- **Log purpose**: Records inbound and outbound requests and compiles statistics of the HTTP requests.

    Available by the SAP Control web service. This log is generated with data across all clients.

#### ABAPOS_ICM_CL log schema

| Field        | Description      |
| ------------ | ---------------- |
| Host         | Host             |
| Instance     | ABAP instance, in the following syntax: `<HOST>_<SYSID>_<SYSNR>`   |
| MessageText  | Message text     |
| Severity     | Message severity, including: `Debug`, `Info`, `Warning`, `Error`   |
| SystemID     | System ID        |
| SystemNumber | System number    |

### ABAP Job log

- **Microsoft Sentinel function for querying this log**: SAPJobLog

- **Related SAP documentation**: [SAP Help Portal](https://help.sap.com/viewer/b07e7195f03f438b8e7ed273099d74f3/7.31.19/en-US/4b2bc0974c594ba2e10000000a42189c.html)

- **Log purpose**: Combines all background processing job logs (SM37).

    Available by using RFC based on standard SAP table and standard services of XBP interfaces. This log is generated with data across all clients.

#### ABAPJobLog_CL log schema

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

### ABAP Security Audit log

- **Microsoft Sentinel function for querying this log**: SAPAuditLog

- **Related SAP documentation**: [SAP Help Portal](https://help.sap.com/viewer/280f016edb8049e998237fcbd80558e7/7.5.7/en-US/4d41bec4aa601c86e10000000a42189b.html)

- **Log purpose**: Records the following data:

    - Security-related changes to the SAP system environment, such as changes to main user records
    - Information that provides a higher level of data, such as successful and unsuccessful sign-in attempts
    - Information that enables the reconstruction of a series of events, such as successful or unsuccessful transaction starts

    Available by using RFC XAL/SAL interfaces. SAL is available starting from version Basis 7.50. This log is generated with data across all clients.

#### ABAPAuditLog_CL log schema

| Field                      | Description                      |
| -------------------------- | -------------------------------- |
| ABAPProgramName            | Program name, SAL only           |
| AlertSeverity              | Alert severity                   |
| AlertSeverityText          | Alert severity text, SAL only    |
| AlertValue                 | Alert value                      |
| AuditClassID               | Audit class ID, SAL only         |
| ClientID                   | ABAP client ID (MANDT)           |
| Computer                   | User machine, SAL only           |
| Email                      | User email                       |
| Host                       | Host                             |
| Instance                   | ABAP instance, in the following syntax: `<HOST>_<SYSID>_<SYSNR>` |
| MessageClass               | Message class                    |
| MessageContainerID         | Message container ID, XAL Only   |
| MessageID                  | Message ID, such as `‘AU1’,’AU2’…` |
| MessageText                | Message text                     |
| MonitoringObjectName       | MTE Monitor object name, XAL only |
| MonitorShortName           | MTE Monitor short name, XAL only |
| SAPProcessType             | System Log: SAP process type, SAL only |
| B* - Background Processing |                                  |
| D* - Dialog Processing     |                                  |
| U* - Update Tasks          |                                  |
| SAPWPName                  | System Log: Work process number, SAL only |
| SystemID                   | System ID                        |
| SystemNumber               | System number                    |
| TerminalIPv6               | User machine IP, SAL only        |
| TransactionCode            | Transaction code, SAL only       |
| User                       | User                             |
| Variable1                  | Message variable 1               |
| Variable2                  | Message variable 2               |
| Variable3                  | Message variable 3               |
| Variable4                  | Message variable 4               |

### ABAP Spool log

- **Microsoft Sentinel function for querying this log**: SAPSpoolLog

- **Related SAP documentation**: [SAP Help Portal](https://help.sap.com/viewer/290ce8983cbc4848a9d7b6f5e77491b9/7.52.1/en-US/4eae791c40f72045e10000000a421937.html)

- **Log purpose**: Serves as the main log for SAP printing with the history of spool requests. (SP01).

    Available by using RFC based on standard SAP table. This log is generated with data across all clients.

#### ABAPSpoolLog_CL log schema

| Field                               | Description                                |
| ----------------------------------- | ------------------------------------------ |
| ArchiveStatus                       | Archive status                             |
| ArchiveType                         | Archive type                               |
| ArchivingDevice                     | Archiving device                           |
| AutoRereoute                        | Auto reroute                              |
| ClientID                            | ABAP client ID (MANDT)                     |
| CountryKey                          | Country/region key                                |
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

### APAB Spool Output log

- **Microsoft Sentinel function for querying this log**: SAPSpoolOutputLog

- **Related SAP documentation**: [SAP Help Portal](https://help.sap.com/viewer/290ce8983cbc4848a9d7b6f5e77491b9/7.52.1/en-US/4eae779e40f72045e10000000a421937.html)

- **Log purpose**: Serves as the main log for SAP Printing with the history of spool output requests. (SP02).

    Available by using RFC with a custom service based on standard tables. This log is generated with data across all clients.

#### ABAPSpoolOutputLog_CL log schema

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

### ABAP Syslog

To have this log sent to Microsoft Sentinel, you must [add it manually to the **systemconfig.json** file](sap-solution-deploy-alternate.md#define-the-sap-logs-that-are-sent-to-microsoft-sentinel). This log isn't supported when using the recommended procedure to [install the data connector agent from the portal](deploy-data-connector-agent-container.md).

- **Microsoft Sentinel function for querying this log**: SAPOS_Syslog

- **Related SAP documentation**: [SAP Help Portal](https://help.sap.com/viewer/56bf1265a92e4b4d9a72448c579887af/7.5.7/en-US/c769bcbaf36611d3a6510000e835363f.html)

- **Log purpose**: Records all SAP NetWeaver Application Server (SAP NetWeaver AS) ABAP system errors, warnings, user locks because of failed sign-in attempts from known users, and process messages.

    Available by the SAP Control web service. This log is generated with data across all clients.

#### ABAPOS_Syslog_CL log schema

| Field            | Description            |
| ---------------- | ---------------------- |
| ClientID         | ABAP client ID (MANDT) |
| Host             | Host                   |
| Instance         | ABAP instance, in the following syntax: `<HOST>_<SYSID>_<SYSNR>` |
| MessageNumber    | Message number         |
| MessageText      | Message text           |
| Severity         | Message severity, one of the following values: `Debug`, `Info`, `Warning`, `Error` |
| SystemID         | System ID              |
| SystemNumber     | System number          |
| TransacationCode | Transaction code       |
| Type             | SAP process type       |
| User             | User                   |

### ABAP Workflow log

- **Microsoft Sentinel function for querying this log**: SAPWorkflowLog

- **Related SAP documentation**: [SAP Help Portal](https://help.sap.com/viewer/56bf1265a92e4b4d9a72448c579887af/7.5.7/en-US/c769bcccf36611d3a6510000e835363f.html)

- **Log purpose**: The SAP Business Workflow (WebFlow Engine) enables you to define business processes that aren't yet mapped in the SAP system.

    For example, unmapped business processes might be simple release or approval procedures, or more complex business processes such as creating base material and then coordinating the associated departments.

    Available by using RFC based on standard SAP tables. This log is generated per client.

#### ABAPWorkflowLog_CL log schema

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
| SimpleContainer     | Simple container, packed as a list of key-value entities for the work item |
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

### ABAP WorkProcess log

To have this log sent to Microsoft Sentinel, you must [add it manually to the **systemconfig.json** file](sap-solution-deploy-alternate.md#define-the-sap-logs-that-are-sent-to-microsoft-sentinel). This log isn't supported when using the recommended procedure to [install the data connector agent from the portal](deploy-data-connector-agent-container.md).

- **Microsoft Sentinel function for querying this log**: SAPOS_WP

- **Related SAP documentation**: [SAP Help Portal](https://help.sap.com/viewer/d0739d980ecf42ae9f3b4c19e21a4b6e/7.3.15/en-US/46fb763b6d4c5515e10000000a1553f6.html)

- **Log purpose**: Combines all work process logs. (default: `dev_*`).

    Available by the SAP Control web service. This log is generated with data across all clients.

#### ABAPOS_WP_CL log schema

| Field        | Description         |
| ------------ | ------------------- |
| Host         | Host                |
| Instance     | ABAP instance, in the following syntax: `<HOST>_<SYSID>_<SYSNR>`   |
| MessageText  | Message text     |
| Severity     | Message severity: `Debug`, `Info`, `Warning`, `Error`  |
| SystemID     | System ID           |
| SystemNumber | System number       |
| WPNumber     | Work process number |

### HANA DB Audit Trail

Collecting the HANA DB Audit Trail log is an example of how Microsoft Sentinel collects database layer activities. To have this log sent to Microsoft Sentinel, you must [deploy Azure Monitor Agent](../connect-cef-syslog-ama.md) to gather Syslog data from the machine running HANA DB.

- **Microsoft Sentinel function for querying this log**: SAPSyslog

- **Related SAP documentation**: [General](https://help.sap.com/viewer/6b94445c94ae495c83a19646e7c3fd56/2.0.03/en-US/48fd6586304c4f859bf92d64d0cd8b08.html) |  [Audit Trail](https://help.sap.com/viewer/b3ee5778bc2e4a089d3299b82ec762a7/2.0.03/en-US/0a57444d217649bf94a19c0b68b470cc.html)

- **Log purpose**: Records user actions, or attempted actions in the SAP HANA database. For example, enables you to log and monitor read access to sensitive data.

    Available by the Microsoft Sentinel Linux Agent for Syslog. This log is generated with data across all clients.

#### Syslog log schema

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

### JAVA files

To have this log sent to Microsoft Sentinel, you must [add it manually to the **systemconfig.json** file](sap-solution-deploy-alternate.md#define-the-sap-logs-that-are-sent-to-microsoft-sentinel). This log isn't supported when using the recommended procedure to [install the data connector agent from the portal](deploy-data-connector-agent-container.md).

- **Microsoft Sentinel function for querying this log**: SAPJAVAFilesLogs

- **Related SAP documentation**: [General](https://help.sap.com/viewer/2f8b1599655d4544a3d9c6d1a9b6546b/7.5.9/en-US/485059dfe31672d4e10000000a42189c.html) | [Java Security Audit Log](https://help.sap.com/viewer/1531c8a1792f45ab95a4c49ba16dc50b/7.5.9/en-US/4b6013583840584ae10000000a42189c.html)

- **Log purpose**: Combines all Java files-based logs, including the Security Audit Log, and System (cluster and server process), Performance, and Gateway logs. Also includes Developer Traces and Default Trace logs.

    Available by the SAP Control web service. This log is generated with data across all clients.

#### JavaFilesLogsCL log schema

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
| LogName          | Java logName, such as: `Available`, `defaulttrace`, `dev*`, `security`, and so on |
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

### SAP Heartbeat Log

- **Microsoft Sentinel function for querying this log**: SAPConnectorHealth

- **Log purpose**: Provides heartbeat and other health information on the connectivity between the agents and the different SAP systems.

    Automatically created for any agents of the Microsoft Sentinel for SAP data connector.

#### SAP_HeartBeat_CL log schema

| Field            | Description          |
| ---------------- | -------------------- |
| TimeGenerated    | Time of log posting event |
| agent_id_s       | Agent ID in agent's configuration (automatically generated) |
| agent_ver_s      | Agent version |
| host_s           | The agent's host name |
| system_id_s      | Netweaver ABAP System ID /<br>Netweaver SAPControl Host (preview) /<br>Java SAPControl host (preview) |
| push_timestamp_d | Timestamp of the extraction, according to the agent's time zone |
| agent_timezone_s | Agent's time zone |

## Reference of tables retrieved directly from SAP systems

This section lists the data tables that are retrieved directly from the SAP system and ingested into Microsoft Sentinel exactly as they are.

The data retrieved from these tables provides a clear view of the authorization structure, group membership, and user profiles. It also allows you to track the process of authorization grants and revokes, and identify and govern the risks associated with those processes.

The tables listed below are required to enable functions that identify privileged users, map users to roles, groups, and authorizations.

For best results, refer to these tables using the name in the **Microsoft Sentinel function name** column in the following table:

| Table name | Table description                              | Microsoft Sentinel function name |
| -----------| ---------------------------------------------- | ---------------------- |
| USR01      | User master record (runtime data)                     | SAP_USR01       |
| USR02      | Sign-in data (kernel-side use)                          | SAP_USR02       |
| UST04      | User masters<br>Maps users to profiles                | SAP_UST04       |
| AGR_USERS  | Assignment of roles to users                          | SAP_AGR_USERS   |
| AGR_1251   | Authorization data for the activity group             | SAP_AGR_1251    |
| USGRP_USER | Assignment of users to user groups                    | SAP_USGRP_USER  |
| USR21      | User name / Address key assignment                      | SAP_USR21       |
| ADR6       | Email addresses (business address services)           | SAP_ADR6        |
| USRSTAMP   | Time stamp for all changes to the user                | SAP_USRSTAMP    |
| ADCP       | Person / Address assignment (business address services) | SAP_ADCP        |
| USR05      | User master parameter ID                              | SAP_USR05       |
| AGR_PROF   | Profile name for role                                 | SAP_AGR_PROF    |
| AGR_FLAGS  | Role attributes                                       | SAP_AGR_FLAGS   |
| DEVACCESS  | Table for development user                            | SAP_DEVACCESS   |
| AGR_DEFINE | Role definition                                       | SAP_AGR_DEFINE  |
| AGR_AGRS   | Roles in composite roles                              | SAP_AGR_AGRS    |
| PAHI       | History of the system, database, and SAP parameters   | SAP_PAHI        |
| SNCSYSACL (PREVIEW)| SNC Access Control List (ACL): Systems        | SAP_SNCSYSACL   |
| USRACL (PREVIEW)| SNC Access Control List (ACL): User              | SAP_USRACL      |

## Related content

For more information, see:

- [Deploy the Microsoft Sentinel solution for SAP applications](deployment-overview.md)
- [Microsoft Sentinel solution for SAP applications: built-in security content](sap-solution-security-content.md)
- [Troubleshooting your Microsoft Sentinel solution for SAP applications deployment](sap-deploy-troubleshoot.md)
