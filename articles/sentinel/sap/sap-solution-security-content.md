---
title: Microsoft Sentinel solution for SAP® applications - security content reference
description: Learn about the built-in security content provided by the Microsoft Sentinel solution for SAP® applications.
author: limwainstein
ms.author: lwainstein
ms.topic: reference
ms.date: 03/26/2023
---

# Microsoft Sentinel solution for SAP® applications: security content reference

This article details the security content available for the Microsoft Sentinel Solution for SAP.

> [!IMPORTANT]
> While the Microsoft Sentinel solution for SAP® applications is in GA, some specific components remain in PREVIEW. This article indicates the components that are in preview in the relevant sections below. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

Available security content includes built-in workbooks and analytics rules. You can also add SAP-related [watchlists](../watchlists.md) to use in your search, detection rules, threat hunting, and response playbooks.

## Built-in workbooks

Use the following built-in workbooks to visualize and monitor data ingested via the SAP data connector. After you deploy the SAP solution, you can find SAP workbooks in the **My workbooks** tab.

| Workbook name | Description | Logs |
| --------- | --------- | --------- |
| <a name="sap---system-applications-and-products-workbook"></a>**SAP - Audit Log Browser** | Displays data such as: <br><br>General system health, including user sign-ins over time, events ingested by the system, message classes and IDs, and ABAP programs run <br><br>Severities of events occurring in your system <br><br>Authentication and authorization events occurring in your system |Uses data from the following log: <br><br>[ABAPAuditLog_CL](sap-solution-log-reference.md#abap-security-audit-log) |



For more information, see [Tutorial: Visualize and monitor your data](../monitor-your-data.md) and [Deploy Microsoft Sentinel solution for SAP® applications](deployment-overview.md).

## Built-in analytics rules

### Monitoring the configuration of static SAP security parameters (Preview)

To secure the SAP system, SAP has identified security-related parameters that need to be monitored for changes. With the "SAP - (Preview) Sensitive Static Parameter has Changed" rule, the Microsoft Sentinel solution for SAP® applications tracks [over 52 static security-related parameters](sap-suspicious-configuration-security-parameters.md) in the SAP system, which are built into Microsoft Sentinel.

> [!NOTE]
> For the Microsoft Sentinel solution for SAP® applications to successfully monitor the SAP security parameters, the solution needs to successfully monitor the SAP PAHI table at regular intervals. [Verify that the solution can successfully monitor the PAHI table](preparing-sap.md#verify-that-the-pahi-table-history-of-system-database-and-sap-parameters-is-updated-at-regular-intervals).

To understand parameter changes in the system, the Microsoft Sentinel solution for SAP® applications uses the parameter history table, which records changes made to system parameters every hour.  

The parameters are also reflected in the [SAPSystemParameters watchlist](#systemparameters). This watchlist allows users to add new parameters, disable existing parameters, and modify the values and severities per parameter and system role in production or non-production environments.

When a change is made to one of these parameters, Microsoft Sentinel checks to see if the change is security-related and if the value is set according to the recommended values. If the change is suspected as outside the safe zone, Microsoft Sentinel creates an incident detailing the change, and identifies who made the change.  

Review the [list of parameters](sap-suspicious-configuration-security-parameters.md) that this rule monitors. 

### Monitoring the SAP audit log

The SAP Audit log data is used across many of the analytics rules of the Microsoft Sentinel solution for SAP® applications. Some analytics rules look for specific events on the log, while others correlate indications from several logs to produce high fidelity alerts and incidents.

In addition, there are two analytics rules which are designed to accommodate the entire set of standard SAP audit log events (183 different events), and any other custom events you may choose to log using the SAP audit log.

Both SAP audit log monitoring analytics rules share the same data sources and the same configuration but differ in one critical aspect. While the "SAP - Dynamic Deterministic Audit Log Monitor" rule requires deterministic alert thresholds and user exclusion rules, the "SAP - Dynamic Anomaly-based Audit Log Monitor Alerts (PREVIEW)" rule applies additional machine learning algorithms to filter out background noise in an unsupervised manner. For this reason, by default, most event types (or SAP message IDs) of the SAP audit log are being sent to the "Anomaly based" analytics rule, while the easier to define event types are sent to the deterministic analytics rule. This setting, along with other related settings, can be further configured to suit any system conditions. 

#### SAP - Dynamic Deterministic Audit Log Monitor

A dynamic analytics rule that is intended for covering the entire set of SAP audit log event types which have a deterministic definition in terms of user population, event thresholds.

- [Configure the rule with the SAP_Dynamic_Audit_Log_Monitor_Configuration watchlist](#available-watchlists) 
- Learn more about how to [configure the rule](configure-audit-log-rules.md#set-up-the-sap---dynamic-anomaly-based-audit-log-monitor-alerts-preview-rule-for-anomaly-detection) (full procedure)

#### SAP - Dynamic Anomaly based Audit Log Monitor Alerts (PREVIEW)

A dynamic analytics rule designed to learn normal system behavior, and alert on activities observed on the SAP audit log that are considered anomalous. Apply this rule on the SAP audit log event types which are harder to define in terms of user population, network attributes and thresholds.

Learn more:

- [Configure the rule with the SAP_Dynamic_Audit_Log_Monitor_Configuration and SAP_User_Config watchlists](#available-watchlists) 
- Learn more about how to [configure the rule](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/microsoft-sentinel-for-sap-news-dynamic-sap-security-audit-log/ba-p/3326842#feedback-success) (full procedure)

The following tables list the built-in [analytics rules](deploy-sap-security-content.md) that are included in the Microsoft Sentinel solution for SAP® applications, deployed from the Microsoft Sentinel Solutions marketplace.

### Initial access

| Rule name | Description | Source action | Tactics |
| --------- | --------- | --------- | --------- |
| **SAP - Login from unexpected network** | Identifies a sign-in from an unexpected network. <br><br>Maintain networks in the [SAP - Networks](#networks) watchlist. | Sign in to the backend system from an IP address that is not assigned to one of the networks. <br><br>**Data sources**: SAPcon - Audit Log | Initial Access |
| **SAP - SPNego Attack** | Identifies SPNego Replay Attack. | **Data sources**: SAPcon -  Audit Log | Impact, Lateral Movement |
| **SAP - Dialog logon attempt from a privileged user** | Identifies dialog sign-in attempts, with the **AUM** type, by privileged users in an SAP system. For more information, see the [SAPUsersGetPrivileged](sap-solution-log-reference.md#sapusersgetprivileged). | Attempt to sign in from the same IP to several systems or clients within the scheduled time interval<br><br>**Data sources**: SAPcon -  Audit Log | Impact, Lateral Movement |
| **SAP - Brute force attacks** | Identifies brute force attacks on the SAP system using RFC logons | Attempt to log in from the same IP to several systems/clients within the scheduled time interval using RFC<br><br>**Data sources**: SAPcon - Audit Log | Credential Access |
| **SAP - Multiple Logons from the same IP** | Identifies the sign-in of several users from same IP address within a scheduled time interval.   <br><br>**Sub-use case**: [Persistency](#persistency) | Sign in using several users through the same IP address. <br><br>**Data sources**: SAPcon - Audit Log | Initial Access |
| **SAP - Multiple Logons by User** | Identifies sign-ins of the same user from several terminals within scheduled time interval.  <br><br>Available only via the Audit SAL method, for SAP versions 7.5 and higher. | Sign in using the same user, using different IP addresses.   <br><br>**Data sources**: SAPcon - Audit Log | PreAttack, Credential Access, Initial Access, Collection <br><br>**Sub-use case**: [Persistency](#persistency) |
| **SAP - Informational - Lifecycle - SAP Notes were implemented in system** | Identifies SAP Note implementation in the system. | Implement an SAP Note using SNOTE/TCI. <br><br>**Data sources**: SAPcon -  Change Requests | - |


### Data exfiltration

| Rule name | Description | Source action | Tactics |
| --------- | --------- | --------- | --------- |
| **SAP - FTP for non authorized servers** |Identifies an FTP connection for a non-authorized server. | Create a new FTP connection, such as by using the FTP_CONNECT Function Module. <br><br>**Data sources**: SAPcon -  Audit Log | Discovery, Initial Access, Command and Control |
| **SAP - Insecure FTP servers configuration** |Identifies insecure FTP server configurations, such as when an FTP allowlist is empty or contains placeholders. | Do not maintain or maintain values that contain placeholders in the `SAPFTP_SERVERS` table, using the `SAPFTP_SERVERS_V` maintenance view. (SM30) <br><br>**Data sources**: SAPcon -  Audit Log | Initial Access, Command and Control |
| **SAP - Multiple Files Download** |Identifies multiple file downloads for a user within a specific time-range. | Download multiple files using the SAPGui for Excel, lists, and so on. <br><br>**Data sources**: SAPcon - Audit Log | Collection, Exfiltration, Credential Access |
| **SAP - Multiple Spool Executions** |Identifies multiple spools for a user within a specific time-range. | Create and run multiple spool jobs of any type by a user. (SP01) <br><br>**Data sources**: SAPcon - Spool Log, SAPcon - Audit Log | Collection, Exfiltration, Credential Access |
| **SAP - Multiple Spool Output Executions** |Identifies multiple spools for a user within a specific time-range. | Create and run multiple spool jobs of any type by a user. (SP01) <br><br>**Data sources**: SAPcon - Spool Output Log, SAPcon - Audit Log | Collection, Exfiltration, Credential Access |
| **SAP - Sensitive Tables Direct Access By RFC Logon** |Identifies a generic table access by RFC sign in. <br><br> Maintain tables in the [SAP - Sensitive Tables](#tables) watchlist.<br><br> **Note**: Relevant for production systems only. | Open the table contents using SE11/SE16/SE16N.<br><br>**Data sources**: SAPcon -  Audit Log | Collection, Exfiltration, Credential Access |
| **SAP - Spool Takeover** |Identifies a user printing a spool request that was created by someone else. | Create a spool request using one user, and then output it in using a different user. <br><br>**Data sources**: SAPcon -  Spool Log, SAPcon -  Spool Output Log, SAPcon - Audit Log | Collection, Exfiltration, Command and Control |
| **SAP - Dynamic RFC Destination** | Identifies the execution of RFC using dynamic destinations. <br><br>**Sub-use case**: [Attempts to bypass SAP security mechanisms](#attempts-to-bypass-sap-security-mechanisms)| Execute an ABAP report that uses dynamic destinations (cl_dynamic_destination). For example, DEMO_RFC_DYNAMIC_DEST.   <br><br>**Data sources**: SAPcon - Audit Log | Collection, Exfiltration |
| **SAP - Sensitive Tables Direct Access By Dialog Logon** | Identifies generic table access via dialog sign-in. | Open table contents using `SE11`/`SE16`/`SE16N`. <br><br>**Data sources**: SAPcon - Audit Log | Discovery |
| **SAP - (Preview) File Downloaded From a Malicious IP Address** | Identifies download of a file from an SAP system using an IP address known to be malicious. Malicious IP addresses are obtained from [threat intelligence services](../understand-threat-intelligence.md). | Download a file from a malicious IP. <br><br>**Data sources**: SAP security Audit log, Threat Intelligence | Exfiltration |
| **SAP - (Preview) Data Exported from a Production System using a Transport** | Identifies data export from a production system using a transport. Transports are used in development systems and are similar to pull requests. This alert rule triggers incidents with medium severity when a transport that includes data from any table is released from a production system. The rule creates a high severity incident when the export includes data from a sensitive table. | Release a transport from a production system. <br><br>**Data sources**: SAP CR log, [SAP - Sensitive Tables](#tables) | Exfiltration |
| **SAP - (Preview) Sensitive Data Saved into a USB Drive** | Identifies export of SAP data via files. The rule checks for data saved into a recently mounted USB drive in proximity to an execution of a sensitive transaction, a sensitive program, or direct access to a sensitive table. | Export SAP data via files and save into a USB drive. <br><br>**Data sources**: SAP Security Audit Log, DeviceFileEvents (Microsoft Defender for Endpoint), [SAP - Sensitive Tables](#tables), [SAP - Sensitive Transactions](#transactions), [SAP - Sensitive Programs](#programs) | Exfiltration |
| **SAP - (Preview) Printing of Potentially Sensitive data** | Identifies a request or actual printing of potentially sensitive data. Data is considered sensitive if the user obtains the data as part of a sensitive transaction, execution of a sensitive program, or direct access to a sensitive table.  | Print or request to print sensitive data. <br><br>**Data sources**:  SAP Security Audit Log, SAP Spool logs, [SAP - Sensitive Tables](#tables), [SAP - Sensitive Programs](#programs) | Exfiltration |
| **SAP - (Preview) High Volume of Potentially Sensitive Data Exported** | Identifies export of a high volume of data via files in proximity to an execution of a sensitive transaction, a sensitive program, or direct access to sensitive table. | Export high volume of data via files. <br><br>**Data sources**:  SAP Security Audit Log, [SAP - Sensitive Tables](#tables), [SAP - Sensitive Transactions](#transactions), [SAP - Sensitive Programs](#programs) | Exfiltration |


### Persistency

| Rule name | Description | Source action | Tactics |
| --------- | --------- | --------- | --------- |
| **SAP - Activation or Deactivation of ICF Service** | Identifies activation or deactivation of ICF Services. | Activate a service using SICF.<br><br>**Data sources**: SAPcon - Table Data Log | Command and Control, Lateral Movement, Persistence |
| **SAP - Function Module tested** | Identifies the testing of a function module. | Test a function module using `SE37` / `SE80`.  <br><br>**Data sources**: SAPcon - Audit Log | Collection, Defense Evasion, Lateral Movement |
| **SAP - (PREVIEW) HANA DB -User Admin actions** | Identifies user administration actions. | Create, update, or delete a database user. <br><br>**Data Sources**: Linux Agent - Syslog* |Privilege Escalation |
| **SAP - New ICF Service Handlers** | Identifies creation of ICF Handlers. | Assign a new handler to a service using SICF.<br><br>**Data sources**: SAPcon -  Audit Log | Command and Control, Lateral Movement, Persistence |
| **SAP - New ICF Services** | Identifies creation of ICF Services. | Create a service using SICF.<br><br>**Data sources**: SAPcon - Table Data Log | Command and Control, Lateral Movement, Persistence |
| **SAP - Execution of Obsolete or Insecure Function Module** |Identifies the execution of an obsolete or insecure ABAP function module. <br><br>Maintain obsolete functions in the [SAP - Obsolete Function Modules](#modules) watchlist. Make sure to activate table logging changes for the `EUFUNC` table in the backend. (SE13)<br><br> **Note**: Relevant for production systems only. | Run an obsolete or insecure function module directly using SE37. <br><br>**Data sources**: SAPcon -  Table Data Log | Discovery, Command and Control |
| **SAP - Execution of Obsolete/Insecure Program** |Identifies the execution of an obsolete or insecure ABAP program. <br><br> Maintain obsolete programs in the [SAP - Obsolete Programs](#programs) watchlist.<br><br> **Note**: Relevant for production systems only. | Run a program directly using SE38/SA38/SE80, or by using a background job.  <br><br>**Data sources**: SAPcon -  Audit Log | Discovery, Command and Control |
| **SAP - Multiple Password Changes by User** | Identifies multiple password changes by user. | Change user password <br><br>**Data sources**: SAPcon - Audit Log | Credential Access |

### Attempts to bypass SAP security mechanisms

| Rule name | Description | Source action | Tactics |
| --------- | --------- | --------- | --------- |
| **SAP - Client Configuration Change** | Identifies changes for client configuration such as the client role or the change recording mode. | Perform client configuration changes using the `SCC4` transaction code. <br><br>**Data sources**: SAPcon - Audit Log | Defense Evasion, Exfiltration, Persistence |
| **SAP - Data has Changed during Debugging Activity** | Identifies changes for runtime data during a debugging activity.  <br><br>**Sub-use case**: [Persistency](#persistency) | 1. Activate Debug ("/h"). <br>2.  Select a field for change and update its value.<br><br>**Data sources**: SAPcon - Audit Log | Execution, Lateral Movement |
| **SAP - Deactivation of Security Audit Log** | Identifies deactivation of the Security Audit Log, | Disable security Audit Log using `SM19/RSAU_CONFIG`. <br><br>**Data sources**: SAPcon - Audit Log | Exfiltration, Defense Evasion, Persistence |
| **SAP - Execution of a Sensitive ABAP Program** |Identifies the direct execution of a sensitive ABAP program. <br><br>Maintain ABAP Programs in the [SAP - Sensitive ABAP Programs](#programs) watchlist. | Run a program directly using `SE38`/`SA38`/`SE80`. <br> <br>**Data sources**: SAPcon - Audit Log | Exfiltration, Lateral Movement, Execution |
| **SAP - Execution of a Sensitive Transaction Code** | Identifies the execution of a sensitive Transaction Code. <br><br>Maintain transaction codes in the [SAP - Sensitive Transaction Codes](#transactions) watchlist. | Run a sensitive transaction code. <br><br>**Data sources**: SAPcon - Audit Log | Discovery, Execution |
| **SAP - Execution of Sensitive Function Module** | Identifies the execution of a sensitive ABAP function module. <br><br>**Sub-use case**: [Persistency](#persistency)<br><br>**Note**: Relevant for production systems only. <br><br>Maintain sensitive functions in the [SAP - Sensitive Function Modules](#modules) watchlist, and make sure to activate table logging changes in the backend for the EUFUNC table. (SE13) | Run a sensitive function module directly using SE37. <br><br>**Data sources**: SAPcon -  Table Data Log | Discovery, Command and Control 
| **SAP - (PREVIEW) HANA DB -Audit Trail Policy Changes** | Identifies changes for HANA DB audit trail policies. | Create or update the existing audit policy in security definitions. <br> <br>**Data sources**: Linux Agent - Syslog | Lateral Movement, Defense Evasion, Persistence |
| **SAP - (PREVIEW) HANA DB -Deactivation of Audit Trail** | Identifies the deactivation of the HANA DB audit log. | Deactivate the audit log in the HANA DB security definition. <br><br>**Data sources**: Linux Agent - Syslog | Persistence, Lateral Movement, Defense Evasion |
| **SAP - Unauthorized Remote Execution of a Sensitive Function Module** | Detects unauthorized executions of sensitive FMs by comparing the activity with the user's authorization profile while disregarding recently changed authorizations. <br><br>Maintain function modules in the [SAP - Sensitive Function Modules](#module) watchlist. | Run a function module using RFC.  <br><br>**Data sources**: SAPcon - Audit Log | Execution, Lateral Movement, Discovery |
| **SAP - System Configuration Change** | Identifies changes for system configuration. | Adapt system change options or software component modification using the `SE06` transaction code.<br><br>**Data sources**: SAPcon - Audit Log |Exfiltration, Defense Evasion, Persistence |
| **SAP - Debugging Activities** | Identifies all debugging related activities. <br><br>**Sub-use case**: [Persistency](#persistency) |Activate Debug ("/h") in the system, debug an active process, add breakpoint to source code, and so on. <br><br>**Data sources**: SAPcon - Audit Log | Discovery |
| **SAP - Security Audit Log Configuration Change** | Identifies changes in the configuration of the Security Audit Log | Change any Security Audit Log Configuration using `SM19`/`RSAU_CONFIG`, such as the filters, status, recording mode, and so on. <br><br>**Data sources**: SAPcon - Audit Log | Persistence, Exfiltration, Defense Evasion |
| **SAP - Transaction is unlocked** |Identifies unlocking of a transaction. | Unlock a transaction code using `SM01`/`SM01_DEV`/`SM01_CUS`. <br><br>**Data sources**: SAPcon - Audit Log | Persistence, Execution |
| **SAP - Dynamic ABAP Program** | Identifies the execution of dynamic ABAP programming. For example, when ABAP code was dynamically created, changed, or deleted. <br><br> Maintain excluded transaction codes in the [SAP - Transactions for ABAP Generations](#transactions) watchlist. | Create an ABAP Report that uses ABAP program generation commands, such as INSERT REPORT, and then run the report.  <br><br>**Data sources**: SAPcon - Audit Log | Discovery, Command and Control, Impact |


### Suspicious privileges operations

| Rule name | Description | Source action | Tactics |
| --------- | --------- | --------- | --------- |
| **SAP - Change in Sensitive privileged user** | Identifies changes of sensitive privileged users.    <br> <br>Maintain privileged users in the [SAP - Privileged Users](#users) watchlist. | Change user details / authorizations using `SU01`. <br><br>**Data sources**: SAPcon - Audit Log | Privilege Escalation, Credential Access |
| **SAP - (PREVIEW) HANA DB -Assign Admin Authorizations** | Identifies admin privilege or role assignment. | Assign a user with any admin role or privileges.  <br><br>**Data sources**: Linux Agent - Syslog | Privilege Escalation |
| **SAP - Sensitive privileged user logged in** | Identifies the Dialog sign-in of a sensitive privileged user. <br><br>Maintain privileged users in the [SAP - Privileged Users](#users) watchlist. | Sign in to the backend system using `SAP*` or another privileged user.  <br><br>**Data sources**: SAPcon - Audit Log | Initial Access, Credential Access |
| **SAP - Sensitive privileged user makes a change in other user** | Identifies changes of sensitive, privileged users in other users. | Change user details / authorizations using SU01.  <br><br>**Data Sources**: SAPcon -  Audit Log | Privilege Escalation, Credential Access |
| **SAP - Sensitive Users Password Change and Login** | Identifies password changes for privileged users. | Change the password for a privileged user and sign into the system. <br>Maintain privileged users in the [SAP - Privileged Users](#users) watchlist.<br><br>**Data sources**: SAPcon -  Audit Log | Impact, Command and Control, Privilege Escalation |
| **SAP - User Creates and uses new user** | Identifies a user creating and using other users.  <br><br>**Sub-use case**: [Persistency](#persistency) | Create a user using SU01, and then sign in, using the newly created user and the same IP address.<br><br>**Data sources**: SAPcon - Audit Log | Discovery, PreAttack, Initial Access |
| **SAP - User Unlocks and uses other users** | Identifies a user being unlocked and used by other users.   <br><br>**Sub-use case**: [Persistency](#persistency) | Unlock a user using SU01, and then sign in using the unlocked user and the same IP address.<br><br>**Data sources**: SAPcon -  Audit Log, SAPcon -  Change Documents Log | Discovery, PreAttack, Initial Access, Lateral Movement |
| **SAP - Assignment of a sensitive profile** | Identifies new assignments of a sensitive profile to a user. <br><br>Maintain sensitive profiles in the [SAP - Sensitive Profiles](#profiles) watchlist. | Assign a profile to a user using `SU01`. <br><br>**Data sources**: SAPcon - Change Documents Log | Privilege Escalation |
| **SAP - Assignment of a sensitive role** | Identifies new assignments for a sensitive role to a user.     <br><br>Maintain sensitive roles in the [SAP - Sensitive Roles](#roles) watchlist.| Assign a role to a user using `SU01` / `PFCG`. <br><br>**Data sources**: SAPcon - Change Documents Log, Audit Log | Privilege Escalation |
| **SAP - (PREVIEW) Critical authorizations assignment - New Authorization Value** | Identifies the assignment of a critical authorization object value to a new user.  <br><br>Maintain critical authorization objects in the [SAP - Critical Authorization Objects](#objects) watchlist. | Assign a new authorization object or update an existing one in a role, using `PFCG`. <br><br>**Data sources**: SAPcon - Change Documents Log | Privilege Escalation |
| **SAP - Critical authorizations assignment - New User Assignment** | Identifies the assignment of a critical authorization object value to a new user. <br><br>Maintain critical authorization objects in the [SAP - Critical Authorization Objects](#objects) watchlist. | Assign a new user to a role that holds critical authorization values, using `SU01`/`PFCG`. <br><br>**Data sources**: SAPcon - Change Documents Log | Privilege Escalation |
| **SAP - Sensitive Roles Changes** |Identifies changes in sensitive roles. <br><br> Maintain sensitive roles in the [SAP - Sensitive Roles](#roles) watchlist. | Change a role using PFCG. <br><br>**Data sources**: SAPcon - Change Documents Log, SAPcon – Audit Log | Impact, Privilege Escalation, Persistence |


## Available watchlists

The following table lists the [watchlists](deploy-sap-security-content.md) available for the Microsoft Sentinel solution for SAP® applications, and the fields in each watchlist.

These watchlists provide the configuration for the Microsoft Sentinel solution for SAP® applications. The [SAP watchlists](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/SAP/Analytics/Watchlists) are available in the Microsoft Sentinel GitHub repository.

| Watchlist name | Description and fields |
| --------- | --------- |
| <a name="objects"></a>**SAP - Critical Authorization Objects** | Critical Authorizations object, where assignments should be governed.     <br><br>- **AuthorizationObject**:  An SAP authorization object, such as `S_DEVELOP`, `S_TCODE`, or `Table TOBJ` <br>- **AuthorizationField**:      An SAP authorization field, such as `OBJTYP` or `TCD`    <br>- **AuthorizationValue**:  An SAP authorization field value, such as `DEBUG`       <br>- **ActivityField**     : SAP activity field. For most cases, this value will be `ACTVT`. For Authorizations objects without an **Activity**, or with only an **Activity** field, filled with `NOT_IN_USE`.        <br>- **Activity**: SAP activity, according to the authorization object, such as: `01`: Create; `02`: Change; `03`: Display, and so on.      <br>- **Description**: A meaningful Critical Authorization Object description. |
| **SAP - Excluded Networks** | For internal maintenance of excluded networks, such as to ignore web dispatchers, terminal servers, and so on. <br><br>-**Network**: A network IP address or range, such as `111.68.128.0/17`. <br>-**Description**: A meaningful network description.|
| **SAP Excluded Users** |System users who are signed in to the system and must be ignored. For example, alerts for multiple sign-ins by the same user. <br><br>- **User**: SAP User <br>-**Description**: A meaningful user description. |
| <a name="networks"></a>**SAP - Networks** | Internal and maintenance networks for identification of unauthorized logins.      <br><br>- **Network**:     Network IP address or range, such as `111.68.128.0/17`     <br>- **Description**:  A meaningful network description.|
| <a name="users"></a>**SAP - Privileged Users** | Privileged users that are under extra restrictions.  <br><br>- **User**: the ABAP user, such as `DDIC` or `SAP` <br>- **Description**: A meaningful user description. |
| <a name= "programs"></a>**SAP - Sensitive ABAP Programs** | Sensitive ABAP programs (reports), where  execution should be governed.   <br><br>- **ABAPProgram**:   ABAP program or report, such as `RSPFLDOC`     <br>- **Description**:  A meaningful program description.|
| <a name="module"></a>**SAP - Sensitive Function Module** | Internal and maintenance networks for identification of unauthorized logins.      <br><br>- **FunctionModule**:  An ABAP function module, such as `RSAU_CLEAR_AUDIT_LOG`       <br>- **Description**: A meaningful module description. |
| <a name="profiles"></a>**SAP - Sensitive Profiles** | Sensitive profiles, where assignments should be governed.     <br><br>- **Profile**:   SAP authorization profile, such as `SAP_ALL` or `SAP_NEW`      <br>- **Description**:  A meaningful profile description.|
| <a name="tables"></a>**SAP - Sensitive Tables** | Sensitive tables, where access should be governed.  <br><br>- **Table**: ABAP Dictionary Table, such as `USR02` or `PA008` <br>- **Description**: A meaningful table description. |
| <a name="roles"></a>**SAP - Sensitive Roles** | Sensitive roles, where assignment should be governed.    <br><br>- **Role**: SAP authorization role, such as `SAP_BC_BASIS_ADMIN`  <br>- **Description**: A meaningful role description. |
| <a name="transactions"></a>**SAP - Sensitive Transactions** | Sensitive transactions where execution should be governed.  <br><br>- **TransactionCode**: SAP transaction code, such as `RZ11` <br>- **Description**: A meaningful code description. |
| <a name="systems"></a>**SAP - Systems** | Describes the landscape of SAP systems according to role, usage, and configuration.<br><br>- **SystemID**: the SAP system ID (SYSID) <br>- **SystemRole**: the SAP system role, one of the following values: `Sandbox`, `Development`, `Quality Assurance`, `Training`, `Production` <br>- **SystemUsage**: The SAP system usage, one of the following values: `ERP`, `BW`, `Solman`, `Gateway`, `Enterprise Portal` <br>- **InterfaceAttributes**: an optional dynamic parameter [for use in playbooks](sap-incident-response-playbooks.md). |
| <a name="systemparameters"></a>**SAPSystemParameters** | Parameters to watch for [suspicious configuration changes](#monitoring-the-configuration-of-static-sap-security-parameters-preview). This watchlist is prefilled with recommended values (according to SAP best practice), and you can extend the watchlist to include more parameters. If you don't want to receive alerts for a parameter, set `EnableAlerts` to `false`.<br><br>- **ParameterName**: The name of the parameter.<br>- **Comment**: The SAP standard parameter description.<br>- **EnableAlerts**: Defines whether to enable alerts for this parameter. Values are `true` and `false`.<br>- **Option**: Defines in which case to trigger an alert: If the parameter value is greater or equal (`GE`), less or equal (`LE`), or equal (`EQ`).<br> For example, if the `login/fails_to_user_lock` SAP parameter is set to `LE` (less or equal), and a value of `5`, once Microsoft Sentinel detects a change to this specific parameter, it compares the newly reported value and the expected value. If the new value is `4`, Microsoft Sentinel doesn't trigger an alert. If the new value is `6`, Microsoft Sentinel triggers an alert.<br>- **ProductionSeverity**: The incident severity for production systems.<br>- **ProductionValues**: Permitted values for production systems.<br>- **NonProdSeverity**: The incident severity for non-production systems.<br>- **NonProdValues**: Permitted values for non-production systems.   |
| <a name="users"></a>**SAP - Excluded Users** | System users that are logged in and need to be ignored, such as for the Multiple logons by user alert. <br><br>- **User**: SAP User  <br>- **Description**: A meaningful user description |
| <a name="networks"></a>**SAP - Excluded Networks** | Maintain internal, excluded networks for ignoring web dispatchers, terminal servers, and so on.  <br><br>- **Network**: Network IP address or range, such as `111.68.128.0/17`  <br>- **Description**: A meaningful network description |
| <a name="modules"></a>**SAP - Obsolete Function Modules** | Obsolete function modules, whose execution should be governed.    <br><br>- **FunctionModule**: ABAP Function Module, such as TH_SAPREL  <br>- **Description**: A meaningful function module description |
| <a name="programs"></a>**SAP - Obsolete Programs** | Obsolete ABAP programs (reports), whose execution should be governed.  <br><br>- **ABAPProgram**:ABAP Program, such as TH_ RSPFLDOC  <br>- **Description**: A meaningful ABAP program description |
| <a name="transactions"></a>**SAP - Transactions for ABAP Generations** | Transactions for ABAP generations whose execution should be governed. <br><br>- **TransactionCode**:Transaction Code, such as SE11.  <br>- **Description**: A meaningful Transaction Code description |
| <a name="servers"></a>**SAP - FTP Servers** | FTP Servers for identification of unauthorized connections.    <br><br>- **Client**:such as 100.  <br>- **FTP_Server_Name**: FTP server name, such as `http://contoso.com/` <br>-**FTP_Server_Port**:FTP server port, such as 22. <br>- **Description**A meaningful FTP Server description |
| <a name="objects"></a>**SAP_Dynamic_Audit_Log_Monitor_Configuration** | Configure the SAP audit log alerts by assigning each message ID a severity level as required by you, per system role (production, non-production).  This watchlist details all available SAP standard audit log message IDs. The watchlist can be extended to contain additional message IDs you might create on your own using ABAP enhancements on their SAP NetWeaver systems. This watchlist also allows for configuring a designated team to handle each of the event types, and excluding users by SAP roles, SAP profiles or by tags from the **SAP_User_Config** watchlist. This watchlist is one of the core components used for [configuring](configure-audit-log-rules.md) the [built-in SAP analytics rules for monitoring the SAP audit log](#monitoring-the-sap-audit-log).     <br><br>- **MessageID**:  The SAP Message ID, or event type, such as `AUD` (User master record changes), or `AUB` (authorization changes).  <br>- **DetailedDescription**: A markdown enabled description to be shown on the incident pane.  <br>- **ProductionSeverity**:  The desired severity for the incident to be created with for production systems `High`, `Medium`. Can be set as `Disabled`. <br>- **NonProdSeverity**:  The desired severity for the incident to be created with for non-production systems `High`, `Medium`. Can be set as `Disabled`.  <br>- **ProductionThreshold**     The "Per hour" count of events to be considered as suspicious for production systems `60`. <br>- **NonProdThreshold**     The "Per hour" count of events to be considered as suspicious for non-production systems `10`. <br>- **RolesTagsToExclude**: This field accepts SAP role name, SAP profile names or tags from the SAP_User_Config watchlist. These are then used to exclude the associated users from specific event types. See options for role tags at the end of this list. <br>- **RuleType**: Use `Deterministic` for the event type to be sent off to the [SAP - Dynamic Deterministic Audit Log Monitor](#sap---dynamic-deterministic-audit-log-monitor), or `AnomaliesOnly` to have this event covered by the [SAP - Dynamic Anomaly based Audit Log Monitor Alerts (PREVIEW)](#sap---dynamic-anomaly-based-audit-log-monitor-alerts-preview).<br>- **TeamsChannelID**: an optional dynamic parameter [for use in playbooks](sap-incident-response-playbooks.md).<br>- **DestinationEmail**: an optional dynamic parameter [for use in playbooks](sap-incident-response-playbooks.md).<br><br>For the **RolesTagsToExclude** field:<br>- If you list SAP roles or [SAP profiles](sap-solution-deploy-alternate.md#configuring-user-master-data-collection), this excludes any user with the listed roles or profiles from these event types for the same SAP system. For example, if you define the `BASIC_BO_USERS` ABAP role for the RFC related event types, Business Objects users won't trigger incidents when making massive RFC calls.<br>- Tagging an event type is similar to specifying SAP roles or profiles, but tags can be created in the workspace, so SOC teams can exclude users by activity without depending on the SAP team. For example, the audit message IDs AUB (authorization changes) and AUD (user master record changes) are assigned the `MassiveAuthChanges` tag. Users assigned this tag are excluded from the checks for these activities. Running the workspace `SAPAuditLogConfigRecommend` function produces a list of recommended tags to be assigned to users, such as `Add the tags ["GenericTablebyRFCOK"] to user SENTINEL_SRV using the SAP_User_Config watchlist`. 
| <a name="objects"></a>**SAP_User_Config** | Allows for fine tuning alerts by excluding /including users in specific contexts and is also used for [configuring](configure-audit-log-rules.md) the [built-in SAP analytics rules for monitoring the SAP audit log](#monitoring-the-sap-audit-log). <br><br> - **SAPUser**: The SAP user <br> - **Tags**: Tags are used to identify users against certain activity. For example Adding the tags ["GenericTablebyRFCOK"] to user SENTINEL_SRV will prevent RFC related incidents to be created for this specific user <br>**Other active directory user identifiers** <br>-  AD User Identifier <br>- User On-Premises Sid <br>- User Principal Name |

## Available playbooks

| Playbook name | Parameters | Connections |
| ------------- | ---------- | ----------- |
| **SAP Incident Response - Lock user from Teams - Basic** | - SAP-SOAP-User-Password<br>- SAP-SOAP-Username<br>- SOAPApiBasePath<br>- DefaultEmail<br>- TeamsChannel | - Microsoft Sentinel<br>- Microsoft Teams |
| **SAP Incident Response - Lock user from Teams - Advanced** | - SAP-SOAP-KeyVault-Credential-Name<br>- DefaultAdminEmail<br>- TeamsChannel | - Microsoft Sentinel<br>- Azure Monitor Logs<br>- Office 365 Outlook<br>- Microsoft Entra ID<br>- Azure Key Vault<br>- Microsoft Teams |
| **SAP Incident Response - Reenable audit logging once deactivated** | - SAP-SOAP-KeyVault-Credential-Name<br>- DefaultAdminEmail<br>- TeamsChannel | - Microsoft Sentinel<br>- Azure Key Vault<br>- Azure Monitor Logs<br>- Microsoft Teams |


## Next steps

For more information, see:

- [Deploying Microsoft Sentinel solution for SAP® applications](deployment-overview.md)
- [Microsoft Sentinel solution for SAP® applications logs reference](sap-solution-log-reference.md)
- [Monitor the health of your SAP system](../monitor-sap-system-health.md)
- [Deploy the Microsoft Sentinel solution for SAP® applications data connector with SNC](configure-snc.md)
- [Configuration file reference](configuration-file-reference.md)
- [Prerequisites for deploying the Microsoft Sentinel solution for SAP® applications](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)
- [Troubleshooting your Microsoft Sentinel solution for SAP® applications deployment](sap-deploy-troubleshoot.md)
