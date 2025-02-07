---
title: Microsoft Sentinel solution for SAP applications - function reference
description: Learn about the functions available from the Microsoft Sentinel solution for SAP applications.
author: batamig
ms.author: bagol
ms.topic: reference
ms.date: 09/15/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
#customer Intent: As a security analyst, I want to understand the functions available in the Microsoft Sentinel solution for SAP applications, so that I can use them in my Kusto queries.
---

# Microsoft Sentinel solution for SAP applications - functions reference

This article describes a selection of functions that are available in your workspace after you install a Microsoft Sentinel solution for SAP applications. Discover more functions by browsing in Microsoft Sentinel and loading the function code.

Find functions as follows:

- In the Azure portal, in the **General > Logs** page, on the **Functions** tab, and listed under **Workspace functions**.
- In the Defender portal, in the **Investigation & response > Advanced hunting** page, on the **Functions** tab, and listed under **Sentinel workspace functions**.

Content in this article is intended for your **security** teams.

## Use functions in your queries instead of underlying logs or tables

We *strongly recommend* that you use the functions listed in this article as the subjects of their analysis whenever possible, instead of the underlying [logs or tables](sap-solution-log-reference.md).

These functions are intended to serve as the principal user interface to the data. They form the basis for all the built-in analytics rules and workbooks available to you out of the box. Using functions allows for changes to be made to the data infrastructure beneath the functions, without breaking user-created content.

## SAPUsersAssignments

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

## SAPUsersGetPrivileged

The **SAPUsersGetPrivileged** function returns a list of privileged users per client and system ID.

Users are considered privileged when they match any of the following descriptions:

- They're listed in the *SAP - Privileged Users* watchlist
- They're assigned to a profile listed in *SAP - Sensitive Profiles* watchlist
- They're added to a role listed in *SAP - Sensitive Roles* watchlist

**Parameters:**

|Name  |Optional/Required  |Default  |Description  |
|---------|---------|---------|---------|
| TimeAgo | Optional | Seven days | Determines that the function seeks user master data from the time defined by the `TimeAgo` value until the time defined by the `now()` value.|

The **SAPUsersGetPrivileged** function returns the following data:

| Field    | Description |
| -------- | ----------- |
| User     | SAP user ID |
| Client   | Client ID   |
| SystemID | System ID   |

## SAPUsersAuthorizations

The **SAPUsersAuthorizations** function brings together data from several tables to produce a user-centric view of the current roles and authorizations assigned. Only users with active role and authorization assignments are returned.

**Parameters:**

|Name  |Optional/Required  |Default  |Description  |
|---------|---------|---------|---------|
| TimeAgo | Optional | Seven days | Determines that the function seeks user master data from the time defined by the `TimeAgo` value until the time defined by the `now()` value. |

The **SAPUsersAuthorizations** function returns the following data:

| Field    | Description | Notes |
| -------- | ----------- | ----- |
| User     | SAP user ID |       |
| Roles    | Set of roles (default max set size = 50) | `["Role 1", "Role 2",...,"Role 50"]` |
| AuthorizationsDetails | Set of authorizations (default max set size = 100) | `{{AuthorizationsDetails1}`,<br>`{AuthorizationsDetails2}`, <br>...,<br>`{AuthorizationsDetails100}}` |
| Client   | Client ID   |       |
| SystemID | System ID   |       |

## SAPConnectorHealth

The **SAPConnectorHealth** function reflects the status of the agent's and the underlying SAP system's connectivity. Based on the heartbeat log *SAP_HeartBeat_CL* and other health indicators, it returns the following data:

| Field           | Description |
| --------------- | ----------- |
| Agent           | Agent ID in agent's configuration (automatically generated) |
| SystemID        | SAP system ID |
| Status          | Overall connectivity status |
| Details         | Connectivity details |
| ExtendedDetails | Connectivity extended details |
| LastSeen        | Timestamp of latest activity |
| StatusCode      | Code reflecting the system's status |

## SAPConnectorOverview

The **SAPConnectorOverview** function shows row counts of each SAP table per System ID. It returns a list of data records per system ID, and their time generated.

**Parameters:**

|Name  |Optional/Required  |Default  |Description  |
|---------|---------|---------|---------|
|TimeAgo     |    Optional     |     Seven days    |  Determines that the function seeks user master data from the time defined by the `TimeAgo` value until the time defined by the `now()` value.       |

The **SAPConnectorOverview** function returns the following data:

| Field           | Description |
| --------------- | ----------- |
| TimeGenerated | A datetime value of the timestamp of the record's generation |
| SystemID_s | A string representing the SAP system ID |

Use the following Kusto query to perform a daily trend analysis:

```kusto
SAPConnectorOverview(7d)
| summarize count() by bin(TimeGenerated, 1d), SystemID_s
```

## SAPUsersEmail

The **SAPUsersEmail** function allows for a performance oriented lookup of an SAP user's email address per SAP system and client, normally used to associate it with an active directory account.

The **SAPUsersEmail** function uses data extracted from SAP tables USR21 (User Name/Address Key Assignment) and ADR6 (E-Mail Addresses) to look for an email address. In case no email address is found, the user ID is returned instead.

This behavior ensures that SAP service accounts such as DDIC, which often aren't associated with an email addresses, are logged as pseudo AD accounts. This also opens up some UEBA features, aiding in the investigation of incidents and hunting activities.

The **SAPUsersEmail** function returns the following data:

| Field           | Description |
| --------------- | ----------- |
| ClientID | The SAP client ID |
| SystemID | The SAP system ID  |
| User | The SAP user ID |
| Email | The email address of the SAP user |

## SAPSystems

The **SAPSystems** function is used to centrally present the per-system configuration made using the *SAP - Systems* watchlist.

**Parameters:**

|Name  |Optional/Required  |Default  |Description  |
|---------|---------|---------|---------|
| SelectedSystems | Optional | `All Systems` | Used to filter specific SAP systems |
| SelectedSystemRoles | Optional | `All System Roles` | Determines the roles of the SAP Systems to be looked at, as defined in the *SAP - Systems* watchlist|

The **SAPSystems** function returns the following data:

| Field | Description | Data Source/Notes  |
| ------------- | ------------- | -------------|  
| SearchKey | Search key | Indexed field for SAP system ID  |
| SystemRole | The SAP system's role | Production, UAT  |
| SystemUsage | The main usage of the SAP system | ERP, CRM |  
| SystemID | The SAP system ID | |

## SAPAuditLogConfiguration

The **SAPAuditLogConfiguration** function returns the local configuration of the SAP audit log alerts to the Log Analytics workspace enabled for Microsoft Sentinel. This configuration is used for SAP audit log-related alerts.

The **SAPAuditLogConfiguration** function joins the data in the *SAP Dynamic Audit Log Monitor Configuration* and *SAP - Systems* watchlists to provide a per-system configuration at a per-system-role effort.

**Parameters:**

|Name  |Optional/Required  |Default  |Description  |
|---------|---------|---------|---------|
|SelectedSystems |Optional | `All Systems`| Used to filter specific SAP systems to look at.|
| SelectedSystemRoles| Optional|`All System Roles` |Determines the roles of the SAP Systems to be looked at (as defined in the *SAP - Systems* watchlist). |
| SelectedSeverities|Optional |[`High`, `Medium`] |Used to determine events to be looked at in terms of their severities. Severities per SAP audit log message ID and system role are defined in the *SAP_Dynamic_Audit_Log_Monitor_Configuration* watchlist.  |
| SelectedRuleTypes| Optional| `All RuleTypes`|Determines which events are relevant for detecting the anomalies on. Rule types per SAP audit log message ID and system role are defined in the *SAP_Dynamic_Audit_Log_Monitor_Configuration* watchlist. |

The **SAPAuditLogConfiguration** function returns the following data:

| Field | Description | Data Source/Notes  |
| ------------- | ------------- | -------------  |
| CategoryName | SAP given event category | *SAP Dynamic Audit Log Monitor Configuration* watchlist  |
| DestinationEmail | Email address of the Assigned Team | *SAP Dynamic Audit Log Monitor Configuration* watchlist  |
| DetailedDescription | A markdown formatted text to be displayed on alerts | *SAP Dynamic Audit Log Monitor Configuration* watchlist  |
| MessageID | The SAP audit log message ID | *SAP Dynamic Audit Log Monitor Configuration* watchlist  |
| MessageText | A sample message text | *SAP Dynamic Audit Log Monitor Configuration* watchlist  |
| RolesTagsToExclude | an ABAP Role, Profile, or free text tag | *SAP Dynamic Audit Log Monitor Configuration* watchlist  |
| RuleType | Anomaly or deterministic | *SAP Dynamic Audit Log Monitor Configuration* watchlist  |
| Tactics | The MITRE ATTA&CK tactic | *SAP Dynamic Audit Log Monitor Configuration* watchlist  |
| TeamsChannelID | Teams Channel | *SAP Dynamic Audit Log Monitor Configuration* watchlist  |
| SystemID | The SAP system ID | *SAP - Systems* watchlist  |
| SystemRole | The SAP System's Role | *SAP - Systems* watchlist  |
| SystemUsage | The main usage of the SAP system | *SAP - Systems* watchlist  |
| IsProd | Production system flag | *SAP - Systems* watchlist  |
| Severity | The derived severity | Severity per system usage  |
| Threshold | The derived threshold | Event count per system usage  |
| BagOfDetails | Bag of Details | A dictionary detailing the event definition |

For more information, see [Available watchlists](sap-solution-security-content.md#available-watchlists).

## SAPAuditLogAnomalies

The **SAPAuditLogAnomalies** function uses Microsoft Sentinel's underlying Kusto database's built-in machine learning capabilities to help detect anomalous events observed on the SAP audit log.

The **SAPAuditLogAnomalies** function was developed for the *SAP - (Experimental) Dynamic Anomaly based Audit Log Monitor Alerts* analytics rule. While its original design is to alert on recent anomalies, it can also help to highlight historical anomalies. For more information, see [Sample uses](#sample).

The **SAPAuditLogAnomalies** function learns the slice of the history defined by the different input parameters, at the following levels:

- User
- Network attributes
- System
- Seasonality
- Activity levels

The **SAPAuditLogAnomalies** function then judges events occurring within the last `DetectingTime` timespan according to what it learned, applying thresholds and other configurable exclusion criteria obtained from the SAP audit log configuration watchlist.

Once a sliding window of user activity is deemed anomalous, a second query returns the entire user activity as evidence supporting the decision.

**Parameters:**

| Name | Optional/Required | Default | Description |
| ---- | ----------------- | ------- | ----------- |
| LearningTime | Optional | 14 days | Determines the timespan used for the model learning. |
| DetectingTime | Optional | One hour | Determines the timespan to be looked at for detecting anomalies. Calling this function with `DetectingTime = 0h` highlights anomalies across the entire `LearningTime` timespan. |
| SelectedSystems | Optional | `All Systems` | Used to filter specific SAP systems to look at. |
| SelectedSystemRoles | Optional | `All System Roles` | Determines the roles of the SAP Systems to be looked at, as defined in the *SAP - Systems* watchlist |
| SelectedSeverities | Optional | [`High`, `Medium`] | Used to determine events to be looked at in terms of their severities. Severities per SAP audit log message ID and system role are defined in the *SAP_Dynamic_Audit_Log_Monitor_Configuration* watchlist. |
| SelectedPrefixMask | Optional | 24 | Used to determine the subnet mask level used for learning and detecting. |
| SelectedRuleTypes | Optional | `AnomaliesOnly` | Determines what events are relevant for detecting the anomalies on. Rule types per SAP audit log message ID and system role are defined in the *SAP_Dynamic_Audit_Log_Monitor_Configuration* watchlist. |

The **SAPAuditLogAnomalies** function returns the following data:

| Field           | Description |
| --------------- | ----------- |
| **Multiple fields from SAPAuditLog** | Key fields from the SAP Audit log |
| **Multiple fields from SAPAuditLogConfiguration** | Key fields from the Microsoft Sentinel for SAP audit log configuration |
| DiscoveredOn | The rounded hour on which the anomaly was observed on |
| EventCount | Number of events counted per row returned|
| AnomalCount | Number of events observed within relevant sliding window|
| MinTime | Time of first event observed |
| MaxTime | Time of last event observed|
| Score | the anomaly scores as produced by the anomaly model|

**Recommendations**:

As with any machine learning solution, the **SAPAuditLogAnomalies** function performs better with time, and can be adjusted as needed as time goes on.

We recommend restricting the size of the learned database to be under 100 million records using the many available input parameters.

<a name="sample"></a>**Sample uses include**:

- To search for anomalies for events of high severity that occurred within the past hour on production systems for event types that are marked as *AnomaliesOnly* in the *SAP_Dynamic_Audit_Log_Monitor_Configuration* watchlist, run:

    ```kusto
    SAPAuditLogAnomalies(LearningTime = 14d, DetectingTime=1h, SelectedSystemRoles= dynamic(["Production"]), 
    SelectedSeverities= dynamic(["High"]), SelectedRuleTypes= dynamic(["AnomaliesOnly"]))
    ```

- To search for all anomalies in the last 14 days in the *BIP* system, run:

    ```kusto
    SAPAuditLogAnomalies(LearningTime = 14d, DetectingTime=0h, SelectedSystems= dynamic(["BIP"]))
    ```

For more information, see [Built-in SAP analytics rules for monitoring the SAP audit log](sap-solution-security-content.md#monitor-the-sap-audit-log) and [Anomaly detection on the SAP audit log using the Microsoft Sentinel for SAP solution](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/anomaly-detection-on-the-sap-audit-log-using-the-microsoft/ba-p/3418709) (blog).

## SAPAuditLogConfigRecommend

The **SAPAuditLogConfigRecommend** is a helper function designed to offer recommendations for the configuration of the [SAP - Dynamic Anomaly based Audit Log Monitor Alerts (PREVIEW)](sap-solution-security-content.md#monitor-the-sap-audit-log) analytics rule.


For more information, see [Monitor the SAP audit log](sap-solution-security-content.md#monitor-the-sap-audit-log).

## SAPUsersGetVIP

The [Microsoft Sentinel solution for SAP applications](solution-overview.md) uses a concept of central user tagging and explicit exclusions, designed to help you lower false positives with minimal effort.

Use the **SAPUsersGetVIP** function to exclude users from triggering alerts by specifying SAP user roles, SAP user functions, or tags that represent those users. For more information, see [Handle false positives in Microsoft Sentinel](../false-positives.md#example-manage-exceptions-for-the-microsoft-sentinel-solution-for-sap-applications).

Tags specified as input for the **SAPUsersGetVIP** function exclude all users with a tag listed in the *SAP_User_Config* watchlist. The same functionality is extended to work with wildcards, allowing you to assign a single tag to a group of users with the same naming syntax.

1. Tag users in the *SAP_User_Config* watchlist as follows:

    - Add multiple tags to each user in the *SAP_User_Config* watchlist, as needed to cover various scenarios. Each alert rule has its own relevant tags, if any, and you can add custom tags as needed.

    - Use an asterisk (*) as a wildcard to include users with a specific naming syntax template.

1. Add the **SAPUsersGetVIP** function in your analytics rules to request the lists of users you've defined to be excluded from alerts. In the function call, add an array with the tags, SAP roles, and SAP profiles that you'd like to exclude.

For example, use the following KQL query in your analytics rule to exclude any users configured with the *RunObsoleteProgOK* tag in the *SAP_User_Config* watchlist, or any users with the sample *SAP_BASIS_ADMIN_ROLE* role or the sample *SAP_ADMIN_PROFILE* profile.

When copying this sample function call, replace *SAP_BASIS_ADMIN_ROLE* role and *SAP_ADMIN_PROFILE* profile with your own SAP roles or profiles as needed.

For example:

```kusto
// Execution of Obsolete/Insecure Program
let ObsoletePrograms = _GetWatchlist("SAP - Obsolete Programs");
// here you can exclude system users which are OK to run obsolete/ sensitive programs
// by adding those users in the SAP_User_Config watchlist with a tag of 'RunObsoleteProgOK'
// can also specify SAP roles or SAP profiles that group the users you would like to exclude
let excludeUsersTagsRolesProfiles= dynamic(["RunObsoleteProgOK","SAP_BASIS_ADMIN_ROLE", "SAP_ADMIN_PROFILE"]);
let excludedUsers= SAPUsersGetVIP(SearchForTags= excludeUsersTagsRolesProfiles)| summarize by User2Exclude=SAPUser;
// Query logic
SAPAuditLog
| where MessageID == 'AUW'
| where ABAPProgramName in (ObsoletePrograms) // The program is obsolete
| join kind=leftantisemi excludedUsers on $left.User == $right.User2Exclude
```

The **SAPUsersGetVIP** function is commonly used in *Deterministic and Anomalous Audit Log Monitor* alerts. Associate a tag with an SAP audit log message ID, or extend the rule template to a custom rule that matches your organization's needs.

> [!TIP]
> We recommend that contacting your SAP system admin to understand which SAP users, roles, and profiles to include in your *SAP_User_Config* watchlist.
>

**Parameters:**

|Name  |Optional/Required  |Default  |Description  |
|---------|---------|---------|---------|
|**SearchForTags**     |  Optional       |   `dynamic('All Tags')`      |   When `SearchForTags` equals `All Tags`, all users are returned along with their tags. <br><br>Otherwise, only users bearing the tags, SAP roles, or SAP profiles specified in `SearchForTags` are returned. `TagsIntersect` shows the tags that are found, and `IntersectionSize` holds the number of tags that are found.      |
|**SpecialFocusTags**     |    Optional     |     `Do not return any in-focus users`    |   Returns all users bearing the tags specified in `SpecialFocusTags`, and marked those with `specialFocusTagged = true`.      |

The **SAPUsersGetVIP** function returns the following output:

| Source | Field | Description | Notes  |
| ------------- | ------------- | ------------- | -------------  |
| The *SAP_User_Config* watchlist | `SearchKey` | Search key | |
| The *SAP_User_Config* watchlist | `SAPUser` | The SAP user | OSS, DDIC  |
| The *SAP_User_Config* watchlist | `Tags` | String of tags assigned to user | `RunObsoleteProgOK` |  
| The *SAP_User_Config* watchlist | User's Microsoft Entra object ID | Microsoft Entra object ID | |
| The *SAP_User_Config* watchlist | User identifier | Azure Directory user identifier | |
| The *SAP_User_Config* watchlist | User on-premises SID |  | |
| The *SAP_User_Config* watchlist | User principal name |  | |
| The *SAP_User_Config* watchlist | `TagsList` | A list of tags assigned to user | `ChangeUserMasterDataOK`;`RunObsoleteProgOK` |
| Logic | TagsIntersect | A set of tags that matched `SearchForTags` | ["ChangeUserMasterDataOK","RunObsoleteProgOK"]  |
| Logic | SpecialFocusTagged | Special focus indication | `True`, `False`  |
| Logic | IntersectionSize | The number of intersected tags | |

## SAPUsersHeader

The **SAPUsersHeader** function is designed to provide a high-level view of the SAP user. It uses data extracted from both the SAP user master data tables and recent activity on the SAP audit log to gather email and IP addresses. It then returns last known email and IP addresses along with primary email and IP addresses.

**Parameters:**

| Name | Optional/Required | Default | Description |
| ---- | ----------------- | ------- | ----------- |
| SelectedSystems | Optional | `All Systems` | Used to filter specific SAP systems to look at |
| SelectedSystemRoles | Optional | `All System Roles` | Determines the roles of the SAP Systems to be looked at, as defined in the *SAP - Systems* watchlist. |
| SelectedUsers | Optional | `All Users` | Can input lists of users. |
| SelectedUser | Optional | `All Users` | Accepts a single user only. |

For example:

```kusto
SelectedSystemRoles:dynamic = dynamic(["All System Roles"]) SelectedSystems:dynamic = dynamic(["All Systems"]) SelectedUsers:dynamic = dynamic(["All Users"]) SelectedUser:string = "All Users"
```

> [!TIP]
> For performance considerations, only a few days of audit activity are considered.
> For a full history of user activity, run a custom KQL query against the *SAPAuditLog* function.
>

The **SAPUsersHeader** function returns the following output:

| Source | Field | Description | Notes  |
| ------------- | ------------- | ------------- | -------------  |
|  | User | The SAP user | |
| SAP tables ADR6 and USR21 | Email | Taken from user's master data | OSS, DDIC  |
| SAP table USR02 | UserType | String of tags assigned to user | `RunObsoleteProgOK`  |
| SAP table USR02 | Timezone | Microsoft Entra object ID | |
| SAP table USR02 | LockedStatus | Azure Directory user identifier | |
| SAP audit log | LastSeen | A timestamp | Last audit event observed for the user  |
| SAP audit log | LastSeenDaysAgo | Days passed since `LastSeen` | |
| SAP audit log | PrimaryIP | Most frequently used IP address | `ChangeUserMasterDataOK`;`RunObsoleteProgOK`  |
| SAP audit log | LastKnownIP | Most recently used IP address | ["ChangeUserMasterDataOK","RunObsoleteProgOK"]  |
| SAP audit log | PrimaryEmail | Most frequently used email address | `True`, `False`  |
| SAP audit log | KnownIPs | List of known IP addresses | Sorted by most frequent first  |
| SAP audit log | KnownEmails | List of known email addresses | Sorted by most frequent first  |
|  | Client | The SAP client ID | |
|  | SystemID | The SAP system ID | |
|  | SystemRole | The SAP system's role | Production, UAT |
|  | SystemUsage | The main usage of the SAP system | ERP, CRM |

## Related content

For more information, see:

- [Functions in Azure Monitor log queries](/azure/azure-monitor/logs/functions)
- [Log and table reference for the Microsoft Sentinel solution for SAP applications](sap-solution-log-reference.md)
