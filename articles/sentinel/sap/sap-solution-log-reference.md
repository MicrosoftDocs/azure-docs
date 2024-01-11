---
title: Microsoft Sentinel solution for SAP® applications - data reference
description: Learn about the SAP logs, tables, and functions available from the Microsoft Sentinel solution for SAP® applications.
author: yelevin
ms.author: yelevin
ms.topic: reference
ms.custom: mvc, ignite-fall-2021
ms.date: 05/24/2023
---

# Microsoft Sentinel solution for SAP® applications data reference

> [!IMPORTANT]
> Some components of the Microsoft Sentinel Threat Monitoring for SAP solution are currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>
> Some logs, noted below, are not sent to Microsoft Sentinel by default, but you can manually add them as needed. For more information, see [Define the SAP logs that are sent to Microsoft Sentinel](sap-solution-deploy-alternate.md#define-the-sap-logs-that-are-sent-to-microsoft-sentinel).

This article describes the functions, logs, and tables available as part of the Microsoft Sentinel solution for SAP® applications and its data connector. It is intended for advanced SAP users.

## Functions available from the SAP solution

This section describes the [functions](../../azure-monitor/logs/functions.md) that are available in your workspace after you've deployed the Microsoft Sentinel solution for SAP® applications. Find these functions in the Microsoft Sentinel **Logs** page to use in your KQL queries, listed under **Workspace functions**.

Users are *strongly encouraged* to use the functions as the subjects of their analysis whenever possible, instead of the underlying logs or tables. These functions are intended to serve as the principal user interface to the data. They form the basis for all the built-in analytics rules and workbooks available to you out of the box. This allows for changes to be made to the data infrastructure beneath the functions, without breaking user-created content.

- [SAPUsersAssignments](#sapusersassignments)
- [SAPUsersGetPrivileged](#sapusersgetprivileged)
- [SAPUsersAuthorizations](#sapusersauthorizations)
- [SAPConnectorHealth](#sapconnectorhealth)
- [SAPConnectorOverview](#sapconnectoroverview)
- [SAPUsersEmail](#sapusersemail)
- [SAPAuditLogConfiguration](#sapauditlogconfiguration)
- [SAPAuditLogAnomalies](#sapauditloganomalies)
- [SAPAuditLogConfigRecommend](#sapauditlogconfigrecommend)
- [SAPSystems](#sapsystems)
- [SAPUsersGetVIP](#sapusersgetvip)
- [SAPUsersHeader](#sapusersheader)


### SAPUsersAssignments

The **SAPUsersAssignments** function gathers data from multiple SAP data sources and creates a user-centric view of the current user master data, including the roles and profiles currently assigned.

This function summarizes the user assignments to roles and profiles, and returns the following data:


| Field         | Description    | Data Source/Notes |
| ------------- | -------------- | ----------------- |
| User          | SAP user ID    | SAL only          |
| Email         | SMTP address   | USR21 (SMTP_ADDR) |
| UserType      | User type      | USR02 (USTYP)     |
| Timezone      | Time zone      | USR02 (TZONE)     |
| LockedStatus  | Lock status    | USR02 (UFLAG)     |
| LastSeenDate  | Last seen date | USR02 (TRDAT)     |
| LastSeenTime  | Last seen time | USR02 (LTIME)     |
| UserGroupAuth | User group in user master maintenance | USR02 (CLASS) |
| Profiles      | Set of profiles (default maximum set size = 50) | `["Profile 1", "Profile 2",...,"profile 50"]` |
| DirectRoles   | Set of Directly assigned roles (default max set size = 50) | `["Role 1", "Role 2",...,"”"Role 50"]` |
| ChildRoles    | Set of indirectly assigned roles (default max set size = 50) | `["Role 1", "Role 2",...,"”"Role 50"]` |
| Client        | Client ID      |                   |
| SystemID      | System ID      | As defined in the connector |
||||

### SAPUsersGetPrivileged

The **SAPUsersGetPrivileged** function returns a list of privileged users per client and system ID.

Users are considered privileged when they are listed in the *SAP - Privileged Users* watchlist, have been assigned to a profile listed in *SAP - Sensitive Profiles* watchlist, or have been added to a role listed in *SAP - Sensitive Roles* watchlist.

**Parameters:**
- TimeAgo
    - Optional
    - Default value: Seven days
    - Determines that the function seeks User master data from the time defined by the `TimeAgo` value until the time defined by the `now()` value.

The **SAPUsersGetPrivileged** function returns the following data:

| Field    | Description |
| -------- | ----------- |
| User     | SAP user ID |
| Client   | Client ID   |
| SystemID | System ID   |
| | |

### SAPUsersAuthorizations

The **SAPUsersAuthorizations** function brings together data from several tables to produce a user-centric view of the current roles and authorizations assigned.  Only users with active role and authorization assignments are returned.

**Parameters:**
- TimeAgo
    - Optional
    - Default value: Seven days
    - Determines that the function seeks User master data from the time defined by the `TimeAgo` value until the time defined by the `now()` value.

The **SAPUsersAuthorizations** function returns the following data:

| Field    | Description | Notes |
| -------- | ----------- | ----- |
| User     | SAP user ID |       |
| Roles    | Set of roles (default max set size = 50) | `["Role 1", "Role 2",...,"Role 50"]` |
| AuthorizationsDetails | Set of authorizations (default max set size = 100) | `{{AuthorizationsDeatils1}`,<br>`{AuthorizationsDeatils2}`, <br>...,<br>`{AuthorizationsDeatils100}}` |
| Client   | Client ID   |       |
| SystemID | System ID   |       |


### SAPConnectorHealth

The **SAPConnectorHealth** function reflects the status of the agent's and the underlying SAP system's connectivity. Based on the heartbeat log *SAP_HeartBeat_CL* and other health indicators, it returns the following data:

| Field           | Description |
| --------------- | ----------- |
| Agent           | Agent ID in agent's configuration (automatically generated) |
| SystemID        | SAP System ID |
| Status          | Overall connectivity status |
| Details         | Connectivity details |
| ExtendedDetails | Connectivity extended details |
| LastSeen        | Timestamp of latest activity |
| StatusCode      | Code reflecting the system's status |

### SAPConnectorOverview

The **SAPConnectorOverview** function shows row counts of each SAP table per System ID. It returns a list of data records per system ID, and their time generated.

**Parameters:**

- TimeAgo
  - Optional
  - Default value: Seven days
  - Determines that the function seeks User master data from the time defined by the `TimeAgo` value until the time defined by the `now()` value.

| Field           | Description |
| --------------- | ----------- |
| TimeGenerated | A datetime value of the timestamp of the record's generation |
| SystemID_s | A string representing the SAP System ID |

Use the following Kusto query to perform a daily trend analysis:

```kusto
SAPConnectorOverview(7d)
| summarize count() by bin(TimeGenerated, 1d), SystemID_s
```

### SAPUsersEmail

The **SAPUsersEmail** function allows for a performance oriented lookup of an SAP user's email address per SAP system and client, normally used to associate it with an active directory account. 
Using data extracted from SAP tables USR21 (User Name/Address Key Assignment) and ADR6 (E-Mail Addresses), the SAPUsersEmail function looks for an Email address. In case one is not found, the user ID is returned instead of an Email address. This behavior ensures that SAP service accounts (such as DDIC), that often are not associated with an email addresses, will be logged as pseudo AD accounts, enabling some UEBA features, aiding in the investigation of incidents and hunting activities.

| Field           | Description |
| --------------- | ----------- |
| ClientID | The SAP Client ID |
| SystemID | The SAP System ID  |
| User | The SAP User ID |
| Email | The Email address of the SAP User | 

### SAPSystems

The **SAPSystems** function is used to centrally present the per-system configuration made using the 'SAP - Systems' watchlist.

**Parameters:**

- SelectedSystems
  - Optional
  - Default value: "All Systems"
  - Used to filter specific SAP systems
- SelectedSystemRoles
  - Optional
  - Default value: "All System Roles"
  - Determines the roles of the SAP Systems to be looked at (as defined in the "SAP - Systems" watchlist)

| Field | Description | Data Source/Notes  
| ------------- | ------------- | -------------  
| SearchKey | Search Key | Indexed field for SAP System ID  
| SystemRole | The SAP System's Role | Production, UAT  
| SystemUsage | The main usage of the SAP system | ERP, CRM  
| SystemID | The SAP System ID |


### SAPAuditLogConfiguration

The **SAPAuditLogConfiguration** function returns the local configuration of the SAP audit log alerting of the Sentinel workspace, to be used for the different SAP audit log related alerts.
It joins the data in the 'SAP Dynamic Audit Log Monitor Configuration' and 'SAP - Systems' watchlists to provide a per-system configuration at a per-system-role effort.

**Parameters:**

- SelectedSystems
  - Optional
  - Default value: "All Systems"
  - Used to filter specific SAP systems to look at.
- SelectedSystemRoles
  - Optional
  - Default value: "All System Roles"
  - Determines the roles of the SAP Systems to be looked at (as defined in the "SAP - Systems" watchlist).
- SelectedSeverities
  - Optional
  - Default value: ["High", "Medium"]
  - Used to determine events to be looked at in terms of their severities. Severities per SAP audit log message ID and system role are defined in the "SAP_Dynamic_Audit_Log_Monitor_Configuration" watchlist. 
- SelectedRuleTypes
  - Optional
  - Default value: "All RuleTypes"
  - Determines what events are relevant for detecting the anomalies on. Rule types per SAP audit log message ID and system role are defined in the "SAP_Dynamic_Audit_Log_Monitor_Configuration" watchlist.

| Field | Description | Data Source/Notes  
| ------------- | ------------- | -------------  
| CategoryName | SAP given event category | 'SAP Dynamic Audit Log Monitor Configuration' watchlist  
| DestinationEmail | Email address of the Assigned Team | 'SAP Dynamic Audit Log Monitor Configuration' watchlist  
| DetailedDescription | A markdown formatted text to be displayed on alerts | 'SAP Dynamic Audit Log Monitor Configuration' watchlist  
| MessageID | The SAP audit log message ID | 'SAP Dynamic Audit Log Monitor Configuration' watchlist  
| MessageText | A sample message text | 'SAP Dynamic Audit Log Monitor Configuration' watchlist  
| RolesTagsToExclude | an ABAP Role, Profile or free text tag | 'SAP Dynamic Audit Log Monitor Configuration' watchlist  
| RuleType | Anomaly or deterministic | 'SAP Dynamic Audit Log Monitor Configuration' watchlist  
| Tactics | The MITRE ATTA&CK tactic | 'SAP Dynamic Audit Log Monitor Configuration' watchlist  
| TeamsChannelID | Teams Channel | 'SAP Dynamic Audit Log Monitor Configuration' watchlist  
| SystemID | The SAP System ID | 'SAP - Systems' watchlist  
| SystemRole | The SAP System's Role | 'SAP - Systems' watchlist  
| SystemUsage | The main usage of the SAP system | 'SAP - Systems' watchlist  
| IsProd | Production system flag | 'SAP - Systems' watchlist  
| Severity | The derived severity | Severity per system usage  
| Threshold | The derived threshold | Event count per system Usage  
| BagOfDetails | Bag of Details | A dictionary detailing the event definition


### SAPAuditLogAnomalies

The **SAPAuditLogAnomalies** uses Sentinel's underlying Kusto database's built-in machine learning capabilities to help detect anomalous events observed on the SAP audit log.
Developed for the “SAP - (Experimental) Dynamic Anomaly based Audit Log Monitor Alerts” alert rule, this function was initially designed to alert on recent anomalies but it can also help to highlight historical anomalies (see examples below).

**Parameters:**

- LearningTime
  - Optional
  - Default Value: 14 days
  - Determines the timespan used for the model learning
- DetectingTime
  - Optional
  - Default value: One hour
  - Determines the timespan to be looked at for detecting anomalies. Calling this function with DetectingTime = 0h will highlight anomalies across the entire LearningTime timespan
- SelectedSystems
  - Optional
  - Default value: "All Systems"
  - Used to filter specific SAP systems to look at.
- SelectedSystemRoles
  - Optional
  - Default value: "All System Roles"
  - Determines the roles of the SAP Systems to be looked at (as defined in the "SAP - Systems" watchlist).
- SelectedSeverities
  - Optional
  - Default value: ["High", "Medium"]
  - Used to determine events to be looked at in terms of their severities. Severities per SAP audit log message ID and system role are defined in the "SAP_Dynamic_Audit_Log_Monitor_Configuration" watchlist. 
- SelectedPrefixMask
  - Optional
  - Default value: 24
  - Used to determine the subnet mask level used for learning and detecting.
- SelectedRuleTypes
  - Optional
  - Default value: "AnomaliesOnly"
  - Determines what events are relevant for detecting the anomalies on. Rule types per SAP audit log message ID and system role are defined in the "SAP_Dynamic_Audit_Log_Monitor_Configuration" watchlist.

#### Logic

The function learns the slice of the history defined by the different input parameters, at the user, network attributes, system, seasonality, and activity levels. It then judges events occurring within the last DetectingTime timespan according to what it has learned, applying thresholds and other configurable exclusion criteria obtained from the SAP audit log configuration watchlist. Once a sliding window of user activity was deemed anomalous, a second query returns the entire user activity as evidence supporting the decision.

#### Additional notes

As with any machine learning solution, this function performs better with time. Further adjustments can be made using local configuration.
It is advisable to restrict the size of the learned database to be under 100 million records using the many available input parameters.

Example: looking for anomalies for events of high severity that occurred within the past hour on production systems for event types which are marked as "AnomaliesOnly" in the "SAP_Dynamic_Audit_Log_Monitor_Configuration"

```kusto
SAPAuditLogAnomalies(LearningTime = 14d, DetectingTime=1h, SelectedSystemRoles= dynamic(["Production"]), 
SelectedSeverities= dynamic(["High"]), SelectedRuleTypes= dynamic(["AnomaliesOnly"]))
```

Example: Looking for all anomalies in the last 14 days in system "BIP"

```kusto
SAPAuditLogAnomalies(LearningTime = 14d, DetectingTime=0h, SelectedSystems= dynamic(["BIP"]))
```

| Field           | Description |
| --------------- | ----------- |
| **Multiple fields from SAPAuditLog** | Key fields from the SAP Audit log |
| **Multiple fields from SAPAuditLogConfiguration** | Key fields from the Sentinel for SAP audit log configuration |
| DiscoveredOn | The rounded hour on which the anomaly was observed on |
| EventCount | Number of events counted per row returned|
| AnomalCount | Number of events observed within relevant sliding window|
| MinTime | Time of first event observed |
| MaxTime | Time of last event observed|
| Score | the anomaly scores as produced by the anomaly model|

See [Built-in SAP analytics rules for monitoring the SAP audit log](sap-solution-security-content.md#monitoring-the-sap-audit-log) for more information.

### SAPAuditLogConfigRecommend
The **SAPAuditLogConfigRecommend** is a helper function designed to offer recommendations for the configuration of the [SAP - Dynamic Anomaly based Audit Log Monitor Alerts (PREVIEW)](sap-solution-security-content.md#sap---dynamic-anomaly-based-audit-log-monitor-alerts-preview) analytics rule. Learn how to [configure the rules](configure-audit-log-rules.md).

### SAPUsersGetVIP

The Sentinel for SAP solution uses a concept of central user tagging, designed to allow for lower false positive rate with minimal effort on the customer end:

- Users can be tagged using the "SAP User Config" watchlist (for example DDIC is assigned with “RunObsoleteProgOK”). Multiple users can have multiple tags.
- An alert rule sends the relevant tags to the **SAPUsersGetVIP** function asking for a list of users to be excluded. The alert rule “SAP - Execution of an Obsolete or an Insecure Program” can ask for users bearing the tag “RunObsoleteProgOK”. 

Here is a KQL query demonstrating the use case described below:

```kusto
// Execution of Obsolete/Insecure Program
let ObsoletePrograms = _GetWatchlist("SAP - Obsolete Programs");
// here you can exclude system users which are OK to run obsolete/ sensitive programs
// by adding those users in the SAP_User_Config watchlist with a tag of 'RunObsoleteProgOK'
let excludeUsersTags= dynamic(['RunObsoleteProgOK']);
let excludedUsers= SAPUsersGetVIP(SearchForTags= dynamic(["RunObsoleteProgOK"]))| summarize by User2Exclude=SAPUser;
// Query logic
SAPAuditLog 
| where MessageID == 'AUW'
| where ABAPProgramName in (ObsoletePrograms) // The program is obsolete
| join kind=leftantisemi excludedUsers on $left.User == $right.User2Exclude
```

This functionality is heavily used in the Deterministic and Anomalous Audit Log Monitor Alerts, 'where tags can be associated with SAP audit log message ID, and can also be easily extended to custom alert rules. 
**Parameters:**

- SearchForTags
  - Optional
  - Default value: dynamic('All Tags')
  - When SearchForTags equals 'All Tags', all users are returned along with their tags, else, only users bearing the tags specified in SearchForTags are returned. TagsIntersect will show which tags were found, and IntersectionSize will hold the count of those.
- SpecialFocusTags
  - Optional
  - Default value: "Do not return any in-focus users"
  - The function returns all users bearing the tags specified in SpecialFocusTags, and marked those with specialFocusTagged = true.

| Source | Field | Description | Notes  
| ------------- | ------------- | ------------- | -------------  
| The "SAP User Config" watchlist | SearchKey | Search Key |
| The "SAP User Config" watchlist | SAPUser | The SAP User | OSS, DDIC  
| The "SAP User Config" watchlist | Tags | string of tags assigned to user | RunObsoleteProgOK  
| The "SAP User Config" watchlist | User's Microsoft Entra Object ID | Microsoft Entra Object ID |   
| The "SAP User Config" watchlist | User Identifier | AD User Identifier |
| The "SAP User Config" watchlist | User on-premises Sid |  |
| The "SAP User Config" watchlist | User Principal Name |  |
| The "SAP User Config" watchlist | TagsList | A list of tags assigned to user | ChangeUserMasterDataOK;RunObsoleteProgOK  
| Logic | TagsIntersect | A set of tags that matched SearchForTags | ["ChangeUserMasterDataOK","RunObsoleteProgOK"]  
| Logic | SpecialFocusTagged | Special focus indication | True, False  
| Logic | IntersectionSize | The number of intersected Tags |

### SAPUsersHeader

The **SAPUsersHeader** function is designed to provide a high-level view of the SAP user. It uses data extracted from both the SAP user master data tables and recent activity on the SAP audit log to gather Email and IP addresses. It then returns last known email and IP addresses along with primary email and IP addresses.
**Parameters:**
SelectedSystemRoles:dynamic = dynamic(["All System Roles"]) SelectedSystems:dynamic = dynamic(["All Systems"]) SelectedUsers:dynamic = dynamic(["All Users"]) SelectedUser:string = "All Users"

- SelectedSystems
  - Optional
  - Default value: "All Systems"
  - Used to filter specific SAP systems to look at.
- SelectedSystemRoles
  - Optional
  - Default value: "All System Roles"
  - Determines the roles of the SAP Systems to be looked at (as defined in the "SAP - Systems" watchlist).
- SelectedUsers
  - Optional
  - Default value: "All Users"
  - Can input lists of users.
- SelectedUser
  - Optional
  - Default value: "All Users"
  - Accepts a single user only

#### Additional notes
For performance considerations, only a few days of audit activity are considered.
For a full history of user activity, run a custom KQL query against the SAPAuditLog function.

| Source | Field | Description | Notes  
| ------------- | ------------- | ------------- | -------------  
|  | User | The SAP user |
| SAP tables ADR6 and USR21 | Email | Taken from user's master data | OSS, DDIC  
| SAP table USR02 | UserType | string of tags assigned to user | RunObsoleteProgOK  
| SAP table USR02 | Timezone | Microsoft Entra Object ID |
| SAP table USR02 | LockedStatus | AD User Identifier |
| SAP audit log | LastSeen | A timestamp | last audit event observed for the user  
| SAP audit log | LastSeenDaysAgo | days passed since LastSeen |
| SAP audit log | PrimaryIP | Most frequently used IP address | ChangeUserMasterDataOK;RunObsoleteProgOK  
| SAP audit log | LastKnownIP | Most recently used IP address | ["ChangeUserMasterDataOK","RunObsoleteProgOK"]  
| SAP audit log | PrimaryEmail | Most frequently used Email address | True, False  
| SAP audit log | KnownIPs | List of known IP addresses | sorted by most frequent first  
| SAP audit log | KnownEmails | List of known Email addresses | sorted by most frequent first  
|  | Client | The SAP Client ID |
|  | SystemID | The SAP system ID |
|  | SystemRole | The SAP System's Role | Production, UAT
|  | SystemUsage | The main usage of the SAP system | ERP, CRM


## Logs produced by the data connector agent

This section describes the SAP logs available from the Microsoft Sentinel solution for SAP® applications data connector, including the table names in Microsoft Sentinel, the log purposes, and detailed log schemas. Schema field descriptions are based on the field descriptions in the relevant [SAP documentation](https://help.sap.com/).

For best results, use the Microsoft Sentinel functions listed below to visualize, access, and query the data.

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

To have this log sent to Microsoft Sentinel, you must [add it manually to the **systemconfig.ini** file](sap-solution-deploy-alternate.md#define-the-sap-logs-that-are-sent-to-microsoft-sentinel).

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

To have this log sent to Microsoft Sentinel, you must [add it manually to the **systemconfig.ini** file](sap-solution-deploy-alternate.md#define-the-sap-logs-that-are-sent-to-microsoft-sentinel).

- **Microsoft Sentinel function for querying this log**: SAPOS_GW

- **Related SAP documentation**: [SAP Help Portal](https://help.sap.com/viewer/62b4de4187cb43668d15dac48fc00732/7.5.7/en-US/48b2a710ca1c3079e10000000a42189b.html)

- **Log purpose**: Monitors Gateway activities. Available by the SAP Control Web Service. This log is generated with data across all clients.

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
To have this log sent to Microsoft Sentinel, you must [add it manually to the **systemconfig.ini** file](sap-solution-deploy-alternate.md#define-the-sap-logs-that-are-sent-to-microsoft-sentinel).

- **Microsoft Sentinel function for querying this log**: SAPOS_ICM

- **Related SAP documentation**: [SAP Help Portal](https://help.sap.com/viewer/683d6a1797a34730a6e005d1e8de6f22/7.52.4/en-US/a10ec40d01e740b58d0a5231736c434e.html)

- **Log purpose**: Records inbound and outbound requests and compiles statistics of the HTTP requests.

    Available by the SAP Control Web Service. This log is generated with data across all clients.

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
| SAPProcesType              | System Log: SAP process type, SAL only |
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

- **Log purpose**: Serves as the main log for SAP Printing with the history of spool requests. (SP01).

    Available by using RFC based on standard SAP table. This log is generated with data across all clients.

#### ABAPSpoolLog_CL log schema

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

To have this log sent to Microsoft Sentinel, you must [add it manually to the **systemconfig.ini** file](sap-solution-deploy-alternate.md#define-the-sap-logs-that-are-sent-to-microsoft-sentinel).

- **Microsoft Sentinel function for querying this log**: SAPOS_Syslog

- **Related SAP documentation**: [SAP Help Portal](https://help.sap.com/viewer/56bf1265a92e4b4d9a72448c579887af/7.5.7/en-US/c769bcbaf36611d3a6510000e835363f.html)

- **Log purpose**: Records all SAP NetWeaver Application Server (SAP NetWeaver AS) ABAP system errors, warnings, user locks because of failed sign-in attempts from known users, and process messages.

    Available by the SAP Control Web Service. This log is generated with data across all clients.

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

    For example, unmapped business processes may be simple release or approval procedures, or more complex business processes such as creating base material and then coordinating the associated departments.

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


### ABAP WorkProcess log

To have this log sent to Microsoft Sentinel, you must [add it manually to the **systemconfig.ini** file](sap-solution-deploy-alternate.md#define-the-sap-logs-that-are-sent-to-microsoft-sentinel).

- **Microsoft Sentinel function for querying this log**: SAPOS_WP

- **Related SAP documentation**: [SAP Help Portal](https://help.sap.com/viewer/d0739d980ecf42ae9f3b4c19e21a4b6e/7.3.15/en-US/46fb763b6d4c5515e10000000a1553f6.html)

- **Log purpose**: Combines all work process logs. (default: `dev_*`).

    Available by the SAP Control Web Service. This log is generated with data across all clients.

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

To have this log sent to Microsoft Sentinel, you must [deploy a Microsoft Management Agent](../connect-syslog.md) to gather Syslog data from the machine running HANA DB.


- **Microsoft Sentinel function for querying this log**: SAPSyslog

- **Related SAP documentation**: [General](https://help.sap.com/viewer/6b94445c94ae495c83a19646e7c3fd56/2.0.03/en-US/48fd6586304c4f859bf92d64d0cd8b08.html) |  [Audit Trail](https://help.sap.com/viewer/b3ee5778bc2e4a089d3299b82ec762a7/2.0.03/en-US/0a57444d217649bf94a19c0b68b470cc.html)

- **Log purpose**: Records user actions, or attempted actions in the SAP HANA database. For example, enables you to log and monitor read access to sensitive data.

    Available by the Sentinel Linux Agent for Syslog. This log is generated with data across all clients.

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

To have this log sent to Microsoft Sentinel, you must [add it manually to the **systemconfig.ini** file](sap-solution-deploy-alternate.md#define-the-sap-logs-that-are-sent-to-microsoft-sentinel).


- **Microsoft Sentinel function for querying this log**: SAPJAVAFilesLogs

- **Related SAP documentation**: [General](https://help.sap.com/viewer/2f8b1599655d4544a3d9c6d1a9b6546b/7.5.9/en-US/485059dfe31672d4e10000000a42189c.html) | [Java Security Audit Log](https://help.sap.com/viewer/1531c8a1792f45ab95a4c49ba16dc50b/7.5.9/en-US/4b6013583840584ae10000000a42189c.html)

- **Log purpose**: Combines all Java files-based logs, including the Security Audit Log, and System (cluster and server process), Performance, and Gateway logs. Also includes Developer Traces and Default Trace logs.

    Available by the SAP Control Web Service. This log is generated with data across all clients.

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
| system_id_s      | Netweaver ABAP System ID /<br>Netweaver SAPControl Host (preview) /<br>Java SAPControl host (preview)
| push_timestamp_d | Timestamp of the extraction, according to the agent's time zone |
| agent_timezone_s | Agent's time zone |

## Tables retrieved directly from SAP systems

This section lists the data tables that are retrieved directly from the SAP system and ingested into Microsoft Sentinel exactly as they are. 

To have the data from these tables ingested into Microsoft Sentinel, configure the relevant settings in the **systemconfig.ini** file. For more information, see [Configuring User Master data collection](sap-solution-deploy-alternate.md#configuring-user-master-data-collection).

The data retrieved from these tables provides a clear view of the authorization structure, group membership, and user profiles. It also allows you to track the process of authorization grants and revokes, and identify and govern the risks associated with those processes.

The tables listed below are required to enable functions that identify privileged users, map users to roles, groups, and authorizations.

For best results, refer to these tables using the name in the **Sentinel function name** column below:

| Table name | Table description                              | Sentinel function name |
| -----------| ---------------------------------------------- | ---------------------- |
| USR01      | User master record (runtime data)                     | SAP_USR01       |
| USR02      | Logon data (kernel-side use)                          | SAP_USR02       |
| UST04      | User masters<br>Maps users to profiles                | SAP_UST04       |
| AGR_USERS  | Assignment of roles to users                          | SAP_AGR_USERS   |
| AGR_1251   | Authorization data for the activity group             | SAP_AGR_1251    |
| USGRP_USER | Assignment of users to user groups                    | SAP_USGRP_USER  |
| USR21      | User name/Address key assignment                      | SAP_USR21       |
| ADR6       | Email addresses (business address services)           | SAP_ADR6        |
| USRSTAMP   | Time stamp for all changes to the user                | SAP_USRSTAMP    |
| ADCP       | Person/Address assignment (business address services) | SAP_ADCP        |
| USR05      | User master parameter ID                              | SAP_USR05       |
| AGR_PROF   | Profile name for role                                 | SAP_AGR_PROF    |
| AGR_FLAGS  | Role attributes                                       | SAP_AGR_FLAGS   |
| DEVACCESS  | Table for development user                            | SAP_DEVACCESS   |
| AGR_DEFINE | Role definition                                       | SAP_AGR_DEFINE  |
| AGR_AGRS   | Roles in composite roles                              | SAP_AGR_AGRS    |
| PAHI       | History of the system, database, and SAP parameters   | SAP_PAHI        |
| SNCSYSACL (PREVIEW)| SNC Access Control List (ACL): Systems        | SAP_SNCSYSACL   |
| USRACL (PREVIEW)| SNC Access Control List (ACL): User              | SAP_USRACL      |


## Next steps

For more information, see:

- [Deploy the Microsoft Sentinel solution for SAP® applications](deployment-overview.md)
- [Microsoft Sentinel solution for SAP® applications detailed SAP requirements](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)
- [Deploy the Microsoft Sentinel for SAP data connector with SNC](configure-snc.md)
- [Expert configuration options, on-premises deployment, and SAPControl log sources](sap-solution-deploy-alternate.md)
- [Microsoft Sentinel solution for SAP® applications: built-in security content](sap-solution-security-content.md)
- [Monitor the health of your SAP system](../monitor-sap-system-health.md)
- [Troubleshooting your Microsoft Sentinel solution for SAP® applications deployment](sap-deploy-troubleshoot.md)
