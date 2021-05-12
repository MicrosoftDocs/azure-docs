---
title: Azure Sentinel SAP solution - security content reference | Microsoft Docs
description: Learn about the built-in security content provided by the Azure Sentinel SAP solution.
author: batamig
ms.author: bagold
ms.service: azure-sentinel
ms.topic: reference
ms.custom: mvc
ms.date: 05/12/2021
ms.subservice: azure-sentinel

---

# Azure Sentinel SAP solution: security content reference (public preview)

This article details the security content available for the [Azure Sentinel SAP solution](sap-deploy-solution.md#deploy-sap-security-content).

Available security content includes a built-in workbook and built-in analytics rules. You can also add SAP-related [watchlists](watchlists.md) to use in your search, detection rules, threat hunting, and response playbooks.

> [!IMPORTANT]
> The Azure Sentinel SAP solution is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>


## SAP - System Applications and Products workbook

Use the [SAP - System Applications and Products](sap-deploy-solution.md#deploy-sap-security-content) workbook to visualize and monitor the data ingested via the SAP data connector.

For example:

:::image type="content" source="media/sap/sap-workbook.png" alt-text="SAP - System Applications and Products workbook.":::

For more information, see [Tutorial: Visualize and monitor your data](tutorial-monitor-your-data.md).

## Built-in analytics rules

The following tables list the built-in [analytics rules](sap-deploy-solution.md#deploy-sap-security-content) that are included in the Azure Sentinel SAP solution, deployed from the Azure Sentinel Solutions marketplace.

### High-level, built-in SAP solution analytics rules

|Rule name  |Description  |Source action  |Tactics  |
|---------|---------|---------|---------|
|**SAP - High - Change in Sensitive privileged user**     |  Identifies changes of sensitive privileged users.    <br> <br>Maintain privileged users in the [SAP - Privileged Users](#users) watchlist. |   Change user details / authorizations using `SU01`. <br><br>**Data sources**: SAPcon - Audit Log     |  Privilege Escalation, Credential Access       |
|**SAP - High - Client Configuration Change**     |     Identifies changes for client configuration such as the client role or the change recording mode.    |  Perform client configuration changes using the `SCC4` transaction code. <br><br>**Data sources**: SAPcon - Audit Log  |    Defense Evasion, Exfiltration, Persistence     |
|**SAP - High - Data has Changed during Debugging Activity**     | Identifies changes for runtime data during a debugging activity.         | 1. Activate Debug ("/h"). <br>2.  Select a field for change and update its value.<br><br>**Data sources**: SAPcon - Audit Log        |  Execution, Lateral Movement       |
|**SAP - High - Deactivation of Security Audit Log**     | Identifies deactivation of the Security Audit Log,        |  Disable security Audit Log using `SM19/RSAU_CONFIG`. <br><br>**Data sources**: SAPcon - Audit Log |   Exfiltration, Defense Evasion, Persistence      |
|**SAP - High - Execution of a Sensitive ABAP Program**     |Identifies the direct execution of a sensitive ABAP program. <br><br>Maintain ABAP Programs in the [SAP - Sensitive ABAP Programs](#programs) watchlist.        | Run a program directly using `SE38`/`SA38`/`SE80`. <br> <br>**Data sources**: SAPcon - Audit Log      |     Exfiltration, Lateral Movement, Execution    |
|**SAP - High - Execution of a Sensitive Transaction Code**     | Identifies the execution of a sensitive Transaction Code. <br><br>Maintain transaction codes in the [SAP - Sensitive Transaction Codes](#transactions) watchlist.       |  Run a sensitive transaction code. <br><br>**Data sources**: SAPcon - Audit Log      |    Discovery, Execution     |
|**SAP - High - Function Module tested**     |  Identifies the testing of a function module.       |   Test a function module using `SE37` / `SE80`.  <br><br>**Data sources**: SAPcon - Audit Log    |   Collection, Defense Evasion, Lateral Movement      |
|**SAP - High - HANA DB - Assign Admin Authorizations**     |   Identifies admin privilege or role assignment.      |  Assign a user with any admin role or privileges.  <br><br>**Data sources**: Linux Agent - Syslog     | Privilege Escalation        |
|**SAP - High - HANA DB - Audit Trail Policy Changes**     |  Identifies changes for HANA DB audit trail policies.       |     Create or update the existing audit policy in security definitions. <br> <br>**Data sources**: Linux Agent - Syslog    |  Lateral Movement, Defense Evasion, Persistence       |
|**SAP - High - HANA DB - Deactivation of Audit Trail**     |    Identifies the deactivation of the HANA DB audit log.     |    Deactivate the audit log in the HANA DB security definition. <br><br>**Data sources**: Linux Agent - Syslog     |  Persistence, Lateral Movement, Defense Evasion       |
|  **SAP - High - HANA DB - User Admin actions**   | Identifies user administration actions.        |  Create, update, or delete a database user. <br><br>**Data Sources**: Linux Agent - Syslog*       |Privilege Escalation         |
|**SAP - High - Login from unexpected network**     |   Identifies a sign-in from an unexpected network. <br><br>Maintain networks in the [SAP - Networks](#networks) watchlist.    |    Sign in to the backend system from an IP address that is not assigned to one of the networks. <br><br>**Data sources**: SAPcon - Audit Log    |   Initial Access      |
|**SAP - High - RFC Execution of a Sensitive Function Module**     | Sensitive function models to be used in relevant detections.    <br><br>Maintain function modules in the [SAP - Sensitive Function Modules](#module) watchlist.   |      Run a function module using RFC.  <br><br>**Data sources**: SAPcon - Audit Log |  Execution, Lateral Movement, Discovery       |
|**SAP - High - Sensitive privileged user logged in**     |    Identifies the Dialog sign-in of a sensitive privileged user. <br><br>Maintain privileged users in the [SAP - Privileged Users](#users) watchlist.    |  Sign in to the backend system using `SAP*` or another privileged user.  <br><br>**Data sources**: SAPcon - Audit Log     |   Initial Access, Credential Access      |
|  **SAP - High - Sensitive privileged user makes a change in other user**   |   Identifies changes of sensitive, privileged users in other users. 	     | Change user details / authorizations using SU01.  <br><br>**Data Sources**: SAPcon -  Audit Log     |   Privilege Escalation, Credential Access       |
|**SAP - High - System Configuration Change**     | Identifies changes for system configuration.        |   Adapt system change options or software component modification using the `SE06` transaction code.<br><br>**Data sources**: SAPcon - Audit Log |Exfiltration, Defense Evasion, Persistence   |
|     |         |         |         |

### Medium-level, built-in SAP solution analytics rules

|Rule name  |Description  |Source action  |Tactics  |
|---------|---------|---------|---------|
|**SAP - Medium - Assignment of a sensitive profile**     |  Identifies new assignments of a sensitive profile to a user. <br><br>Maintain sensitive profiles in the [SAP - Sensitive Profiles](#profiles) watchlist.      |    Assign a profile to a user using `SU01`. <br><br>**Data sources**: SAPcon - Change Documents Log    |  Privilege Escalation       |
|**SAP - Medium - Assignment of a sensitive role**     |    Identifies new assignments for a sensitive role to a user.     <br><br>Maintain sensitive roles in the [SAP - Sensitive Roles](#roles) watchlist.|  Assign a role to a user using `SU01` / `PFCG`. <br><br>**Data sources**: SAPcon - Change Documents Log, Audit Log     |   Privilege Escalation      |
|**SAP - Medium - Brute force attacks**     |     Identifies brute force attacks on the SAP system, according to failed sign-in attempts for the backend system.    |   Attempt to sign in from the same IP address to several systems/clients within the scheduled time interval. <br><br>**Data sources**: SAPcon - Audit Log      | Credential Access        |
|**SAP - Medium - Critical authorizations assignment - New Authorization Value**     | Identifies the assignment of a critical authorization object value to a new user.  <br><br>Maintain critical authorization objects in the [SAP - Critical Authorization Objects](#objects) watchlist.      |  Assign a new authorization object or update an existing one in a role, using `PFCG`. <br><br>**Data sources**: SAPcon - Change Documents Log      |     Privilege Escalation    |
|**SAP - Medium - Critical authorizations assignment - New User Assignment**     |  Identifies the assignment of a critical authorization object value to a new user. <br><br>Maintain critical authorization objects in the [SAP - Critical Authorization Objects](#objects) watchlist.    |    Assign a new user to a role that holds critical authorization values, using `SU01`/`PFCG`. <br><br>**Data sources**: SAPcon - Change Documents Log    |  Privilege Escalation       |
|**SAP - Medium - Debugging Activities**     |  Identifies all debugging related activities.       |Activate Debug ("/h") in the system, debug an active process, add breakpoint to source code, and so on. <br><br>**Data sources**: SAPcon - Audit Log |   Discovery      |
|**SAP - Medium - Multiple Logons by IP**     |  Identifies the sign-in of several users from same IP address within a scheduled time interval.       |    Sign in using several users through the same IP address. <br><br>**Data sources**: SAPcon - Audit Log | Initial Access        |
|**SAP - Medium - Multiple Logons by User**     | Identifies sign-ins of the same user from several terminals within scheduled time interval.  <br><br>Available only via the Audit SAL method, for SAP versions 7.5 and higher.      |   Sign in using the same user, using different IP addresses.   <br><br>**Data sources**: SAPcon - Audit Log   |  PreAttack, Credential Access, Initial Access, Collection       |
|**SAP - Medium - Security Audit Log Configuration Change**     |  Identifies changes in the configuration of the Security Audit Log       |   Change any Security Audit Log Configuration using `SM19`/`RSAU_CONFIG`, such as the filters, status, recording mode, and so on. <br><br>**Data sources**: SAPcon - Audit Log      |    Persistence, Exfiltration, Defense Evasion     |
|**SAP - Medium - Transaction is unlocked**     |Identifies unlocking of a transaction.         |     Unlock a transaction code using `SM01`/`SM01_DEV`/`SM01_CUS`. <br><br>**Data sources**: SAPcon - Audit Log   |  Persistence, Execution       |
|     |         |         |         |

### Low-level, built-in SAP solution analytics rules

|Rule name  |Description  |Source action  |Tactics  |
|---------|---------|---------|---------|
|**SAP - Low - Multiple Password Changes by User**     |   Identifies multiple password changes by user.      |   Change user password <br><br>**Data sources**: SAPcon - Audit Log      |    Credential Access     |
|**SAP - Low - Sensitive Tables Direct Access By Dialog Logon**     |   Identifies generic table access via dialog sign-in.      |  Open table contents using `SE11`/`SE16`/`SE16N`. <br><br>**Data sources**: SAPcon - Audit Log      |    Discovery     |
|     |         |         |         |

## Available watchlists

The following table lists the [watchlists](sap-deploy-solution.md#deploy-sap-security-content) available for the Azure Sentinel SAP solution, and the fields in each watchlist.

These watchlists provide the configuration for the Azure Sentinel SAP Continuous Threat Monitoring solution, and are accessible in the Azure Sentinel GitHub repository at https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/SAP/Analytics/Watchlists.


|Watchlist name  |Description and fields  |
|---------|---------|
|<a name="objects"></a>**SAP - Critical Authorization Objects**     |  Critical Authorizations object, where assignments should be governed.     <br><br>- **AuthorizationObject**:  An SAP authorization object, such as `S_DEVELOP`, `S_TCODE`, or `Table TOBJ` <br>- **AuthorizationField**:      An SAP authorization field, such as `OBJTYP` or `TCD`    <br>- **AuthorizationValue**:  An SAP authorization field value, such as `DEBUG`       <br>- **ActivityField**     : SAP activity field. For most cases, this value will be `ACTVT`. For Authorizations objects without an **Activity**, or with only an **Activity** field, filled with `NOT_IN_USE`.        <br>- **Activity**: SAP activity, according to the authorization object, such as: `01`: Create; `02`: Change; `03`: Display, and so on.      <br>- **Description**: A meaningful Critical Authorization Object description. |
|**SAP - Excluded Networks** | For internal maintenance of excluded networks, such as to ignore web dispatchers, terminal servers, and so on. <br><br>-**Network**: A network IP address or range, such as `111.68.128.0/17`. <br>-**Description**: A meaningful network description.|
|**SAP Excluded Users** |System users who are signed in to the system and must be ignored. For example, alerts for multiple sign-ins by the same user. <br><br>- **User**: SAP User <br>-**Description**: A meaningful user description. |
|<a name="networks"></a>**SAP - Networks**     |  Internal and maintenance networks for identification of unauthorized logins.      <br><br>- **Network**:     Network IP address or range, such as `111.68.128.0/17`     <br>- **Description**:  A meaningful network description.|
|<a name="users"></a>**SAP - Privileged Users**     |   Privileged users that are under extra restrictions.  <br><br>- **User**: the ABAP user, such as `DDIC` or `SAP` <br>- **Description**: A meaningful user description. |
|<a name= "programs"></a>**SAP - Sensitive ABAP Programs**     |      Sensitive ABAP programs (reports), where  execution should be governed.   <br><br>- **ABAPProgram**:   ABAP program or report, such as `RSPFLDOC`     <br>- **Description**:  A meaningful program description.|
|<a name="module"></a>**SAP - Sensitive Function Module**     |   Internal and maintenance networks for identification of unauthorized logins.      <br><br>- **FunctionModule**:  An ABAP function module, such as `RSAU_CLEAR_AUDIT_LOG`       <br>- **Description**: A meaningful module description.     |
|<a name="profiles"></a>**SAP - Sensitive Profiles**     |  Sensitive profiles, where assignments should be governed.     <br><br>- **Profile**:   SAP authorization profile, such as `SAP_ALL` or `SAP_NEW`      <br>- **Description**:  A meaningful profile description.|
|<a name="tables"></a>**SAP - Sensitive Tables**     |  Sensitive tables, where access should be governed.  <br><br>- **Table**: ABAP Dictionary Table, such as `USR02` or `PA008` <br>- **Description**: A meaningful table description. |
|<a name="roles"></a>**SAP - Sensitive Roles**     |  Sensitive roles, where assignment should be governed.    <br><br>- **Role**: SAP authorization role, such as `SAP_BC_BASIS_ADMIN`  <br>- **Description**: A meaningful role description. |
|<a name="transactions"></a>**SAP - Sensitive Transactions**     |     Sensitive transactions where execution should be governed.  <br><br>- **TransactionCode**: SAP transaction code, such as `RZ11` <br>- **Description**: A meaningful code description. |
|<a name="systems"></a>**SAP - Systems**     |    Describes the landscape of SAP systems according to role and usage.<br><br>- **SystemID**: the SAP system ID (SYSID) <br>- **SystemRole**: the SAP system role, one of the following values: `Sandbox`, `Development`, `Quality Assurance`, `Training`, `Production` <br>- **SystemUsage**: The SAP system usage, one of the following values: `ERP`, `BW`, `Solman`, `Gateway`, `Enterprise Portal`        |
| | |


## Next steps

For more information, see:

- [Tutorial: Deploy the Azure Sentinel solution for SAP](sap-deploy-solution.md)
- [Azure Sentinel SAP solution logs reference](sap-solution-log-reference.md)
- [Deploy the Azure Sentinel SAP data connector on-premises](sap-solution-deploy-alternate.md)
- [Azure Sentinel SAP solution detailed SAP requirements](sap-solution-detailed-requirements.md)