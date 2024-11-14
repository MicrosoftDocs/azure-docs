---
title: Security content reference for Microsoft Power Platform
description: Learn about the built-in security content provided by the Microsoft Sentinel solution for Power Platform.
author: batamig
ms.author: bagol
ms.topic: conceptual
ms.date: 11/14/2024


#Customer intent: As a security analyst, I want to understand Microsoft Sentinel's built-in analytics rules and parsers for Microsoft Power Platform so that I can detect and respond to potential security threats effectively.

---

# Security content reference for Microsoft Power Platform

This article details the security content available for the Microsoft Sentinel solution for Power Platform. For more information about this solution, see [Microsoft Sentinel solution for Microsoft Power Platform overview](power-platform-solution-overview.md).
 
> [!IMPORTANT]
> - The Microsoft Sentinel solution for Power Platform is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
> - The solution is a premium offering. Pricing information will be available before the solution becomes generally available.
> - Provide feedback for this solution by completing this survey: [https://aka.ms/SentinelPowerPlatformSolutionSurvey](https://aka.ms/SentinelPowerPlatformSolutionSurvey).

## Built-in analytics rules

The following analytic rules are included when you install the solution for Power Platform. The data sources listed include the data connector name and table in Log Analytics. To avoid missing data in the inventory sources, we recommend that you don't change the default lookback period defined in the analytic rule templates.

### Dataverse rules

| Rule name | Description | Source action | Tactics |
| --------- | --------- | --------- | --------- |
|Dataverse - Guest user exfiltration following Power Platform defense impairment|Identifies a chain of events starting with disablement of Power Platform tenant isolation and removal of an environment's access security group. These events are correlated with Dataverse exfiltration alerts associated with the impacted environment and recently created Microsoft Entra guest users.<br><Br>Activate other Dataverse analytics rules with the MITRE tactic 'Exfiltration' before enabling this rule.|As a recently created guest user, trigger Dataverse exfiltration alerts after the Power Platform security controls are disabled.<br><br>**Data sources:**<br>- PowerPlatformAdmin<br>`PowerPlatformAdminActivity`<br><br>- Dataverse<br>`DataverseActivity`<br>- Power Platform Inventory (using Azure Functions)<br>`InventoryEnvironments`<br>|Defense Evasion |
|Dataverse - Mass export of records to Excel|Identifies users exporting a large amount of records from Dynamics 365 to Excel. The amount of records exported is significantly more than any other recent activity by that user. Large exports from users with no recent activity are identified using a predefined threshold.|Export many records from Dataverse to Excel.<br><br>**Data sources:**<br>- Dataverse<br>`DataverseActivity`<br>- Power Platform Inventory (using Azure Functions)<br>`InventoryEnvironments`<br>|Exfiltration|
|Dataverse - User bulk retrieval outside normal activity|Identifies users retrieving significantly more records from Dataverse than they have in the past 2 weeks.|User retrieves many records from Dataverse<br><br>**Data sources:**<br>- Dataverse<br>`DataverseActivity`<br>- Power Platform Inventory (using Azure Functions)<br>`InventoryEnvironments`<br>|Exfiltration|
| Dataverse - Account added to Power Platform privileged roles | Identifies changes to privileged directory roles impacting Power Platform: Dynamics 365 Admins, Power Platform Admins, Power BI Admins |    |    |
| Dataverse - Malware found in SharePoint document management site | This query identifies malware uploaded via Dynamics 365 document management or directly in SharePoint. |    |    |
| Dataverse - TI map IP to Dynamics365Activity | Identifies a match in Dynamics365Activity from any IP IOC from Sentinel Threat Intelligence. |    |    |
| Dataverse - TI map URL to Dynamics365Activity | Identifies a match in Dynamics365Activity from any URL IOC from Sentinel Threat Intelligence. |    |    |
| Dataverse - Terminated employee exfiltration to USB drive | Identifies files downloaded from Dataverse by departing or terminated employees which are copied to USB mounted drives. |    |    |
| Dataverse - Export activity from terminated employee | This query identifies D365 export events triggered by terminated employees. |    |    |
| Dataverse - Anomalous application user activity | Identifies anomalies in activity patterns of Dataverse application (non-interactive) users, based on activity falling outside the normal pattern of use. |    |    |
| Dataverse - Hierarchy security manipulation | Identifies disablement of hierarchy security and suspicious events including: User assigns themselves as a manager, User assigns themselves to a monitored position |    |    |
| Dataverse - Permissions granted to an application identity | Identifies API level permission grants, either via the delegated permissions of an Azure AD application or direct assignment within Dynamics 365 as an application user. |    |    |
| Dataverse - SharePoint document management site added or updated | Identifies modifications of SharePoint document management integration. Document management allows storage of data located externally to Dataverse. Combine this analytics rule with the MSBizApps-Add-SharePointSite-To-Watchlist Playbook to automatically update the Dataverse-SharePointSites watchlist. This watchlist can be used to correlate events between Dataverse and SharePoint when using the Office 365 data connector. |    |    |
| Dataverse - Unusual sign-in following disabled IP address-based cookie binding protection | Identifies previously unseen IP and user agents in a Dataverse instance following disabling of cookie binding protection. For more information, see [Safeguarding Dataverse sessions with IP cookie binding
](/power-platform/admin/block-cookie-replay-attack). |    |    |
| Dataverse - Mass download from SharePoint document management | Identifies mass download (in the last hour) of files from SharePoint sites configured for document management in Dynamics 365. This analytics rule utilizes the Dataverse-SharePointSites watchlist to identify SharePoint sites used for Document Management. |    |    |
| Dataverse - Departing employee exfiltration over email | This query identifies D365 data exfiltration via email by departing employees. |    |    |
| Dataverse - Bulk record ownership re-assignment or sharing | Identifies individual record ownership changes including sharing of records with other users/teams or re-assignment of ownership exceeding a pre-defined threshold. |    |    |
| Dataverse - Mass deletion of records | Identifies large scale record delete operations. |    |    |
| Dataverse - New Dataverse application user activity type | Identifies new or previously unseen activity types associated with Dataverse application (non-interactive) user. |    |    |
| Dataverse - Removal of blocked file extensions | Identifies modifications to an environment's blocked file extensions and extracts the removed extension. |    |    |
| Dataverse - Audit logging disabled | Identifies a change in system audit configuration whereby audit logging is turned off. |    |    |
| Dataverse - Honeypot instance activity | Identifies activities in a predefined Honeypot Dataverse instance. Alerts when either sign-in to the Honeypot is detected or when monitored Dataverse tables in the Honeypot are accessed. Note: Requires a dedicated Honeypot Dataverse instance in Power Platform with auditing enabled. |    |    |
| Dataverse - Executable uploaded via SharePoint document management | Identifies executable files and scripts uploaded to SharePoint sites used for Dynamics document management, circumventing native file extension restrictions in Dataverse. |    |    |
| Dataverse - Suspicious use of TDS endpoint | Identifies Dataverse TDS (Tabular Data Stream) protocol based queries where the source user or IP address has recent security alerts and the TDS protocol has not been used previously in the target environment. |    |    |
| Dataverse - Mass record updates | This query detects mass record update changes in Dynamics 365, exceeding a pre-defined threshold. |    |    |
| Dataverse - Sign-in from an unauthorized domain | Identifies user authentication events originating from a user domain that is not found on an allow list. Common internal Dynamics 365 system names are excluded. |    |    |
| Dataverse - New user agent type that was not used with Office 365 | Identifies users accessing Dynamics with a User Agent that has not been seen in any Office 365 workloads in the last 14 days. |    |    |
| Dataverse - New user agent type that was not used with Dynamics 365 | Identifies users accessing Dynamics from a User Agent that has not been seen in any Dynamics 365 environment in the last 14 days. |    |    |
| Dataverse - Suspicious use of Web API | Identifies unauthorized Dataverse access using an Azure AD registered application. |    |    |
| Dataverse - Organization settings modified | Identifies changes made at organization level in the Dataverse environment. |    |    |

### PowerApps rules

| Rule name | Description | Source action | Tactics |
| --------- | --------- | --------- | --------- |
|PowerApps - App activity from unauthorized geo|Identifies Power Apps activity from countries in a predefined list of unauthorized countries.  <br><br> Get the list of ISO 3166-1 alpha-2 country codes from [ISO Online Browsing Platform (OBP)](https://www.iso.org/obp/ui).<br><br>This detection uses logs ingested from Microsoft Entra ID and requires that you also enable the Microsoft Entra ID data connector. |Run an activity in Power App from a country that's on the unauthorized country code list.<br><br>**Data sources**: <br>- Power Platform Inventory (using Azure Functions) <br>`InventoryApps`<br>`InventoryEnvironments`<br>- Microsoft Power Platform Admin Activity (Preview)<br>`PowerPlatformAdminActivity`<br>- Microsoft Entra ID<br>`SigninLogs`<br>|Initial access|
|PowerApps - Multiple apps deleted|Identifies mass delete activity where multiple Power Apps are deleted, matching a predefined threshold of total apps deleted or app deleted events across multiple Power Platform environments.|Delete many Power Apps from the Power Platform admin center. <br><br>**Data sources**:<br>- Power Platform Inventory (using Azure Functions)<br>`InventoryApps`<br>`InventoryEnvironments`<br>- Microsoft Power Platform Admin Activity (Preview)<br>`PowerPlatformAdminActivity`|Impact|
|PowerApps - Data destruction following publishing of a new app|Identifies a chain of events when a new app is created or published and is followed within 1 hour by mass update or delete events in Dataverse. If the app publisher is on the list of users in the **TerminatedEmployees** watchlist template, the incident severity is raised.|Delete a number of records in Power Apps within 1 hour of the Power App being created or published.<br><br>**Data sources**:<br>- Power Platform Inventory (using Azure Functions)<br>`InventoryApps`<br>`InventoryEnvironments`<br>- Microsoft Power Platform Admin Activity (Preview)<br>`PowerPlatformAdminActivity`<br>- Microsoft Dataverse (Preview)<br>`DataverseActivity`|Impact|
|PowerApps - Multiple users accessing a malicious link after launching new app|Identifies a chain of events when a new Power App is created and is followed by these events:<br>- Multiple users launch the app within the detection window.<br>- Multiple users open the same malicious URL.<br><br>This detection cross correlates Power Apps execution logs with malicious URL click events from either of the following sources:<br>- The Microsoft 365 Defender data connector or <br>- Malicious URL indicators of compromise (IOC) in Microsoft Sentinel Threat Intelligence with the Advanced Security Information Model (ASIM) web session normalization parser.<br><br>Get the distinct number of users who launch or click the malicious link by creating a query.|Multiple users launch a new PowerApp and open a known malicious URL from the app.<br><br>**Data sources**:<br>- Power Platform Inventory (using Azure Functions)<br>`InventoryApps`<br>`InventoryEnvironments`<br>- Microsoft Power Platform Admin Activity (Preview)<br>`PowerPlatformAdminActivity`<br>- Threat Intelligence <br>`ThreatIntelligenceIndicator`<br>- Microsoft Defender XDR<br>`UrlClickEvents`<br>|Initial access|
|Power Apps - Bulk sharing of Power Apps to newly created guest users|Identifies unusual bulk sharing of Power Apps to newly created Microsoft Entra guest users. Unusual bulk sharing is based on a predefined threshold in the query.|Share an app with multiple external users.<br><br>**Data sources:**<br>- Microsoft Power Platform Admin Activity (Preview)<br>`PowerPlatformAdminActivity`<br>- Power Platform Inventory (using Azure Functions)<br>`InventoryApps`<br>`InventoryEnvironments`<br>- Microsoft Entra ID<br>`AuditLogs`|Resource Development,<br>Initial Access,<br>Lateral Movement|

### PowerAutomate rules

| Rule name | Description | Source action | Tactics |
| --------- | --------- | --------- | --------- |
|PowerAutomate - Departing employee flow activity|Identifies instances where an employee who has been notified or is already terminated, and is on the **Terminated Employees** watchlist, creates or modifies a Power Automate flow.|User defined in the **Terminated Employees** watchlist creates or updates a Power Automate flow.<br><br>**Data sources**:<br>Microsoft Power Automate (Preview)<br>`PowerAutomateActivity`<br>- Power Platform Inventory (using Azure Functions)<br>`InventoryFlows`<br>`InventoryEnvironments`<br>Terminated employees watchlist|Exfiltration, impact|
|Power Automate - Unusual bulk deletion of flow resources|Identifies bulk deletion of Power Automate flows that exceed a predefined threshold defined in the query and deviate from activity patterns observed in the last 14 days.|Bulk deletion of Power Automate flows.<br><br>**Data sources:**<br>- PowerAutomate<br>`PowerAutomateActivity`<br>|Impact, <br>Defense Evasion|


### PowerPlatform rules

| Rule name | Description | Source action | Tactics |
| --------- | --------- | --------- | --------- |
|PowerPlatform - Connector added to a sensitive environment|Identifies the creation of new API connectors within Power Platform, specifically targeting a predefined list of sensitive environments.|Add a new Power Platform connector in a sensitive Power Platform environment.<br><br>**Data sources**:<br>- Microsoft Power Platform Admin Activity (Preview)<br>`PowerPlatformAdminActivity`<br>- Power Platform Inventory (using Azure Functions)<br>`InventoryApps`<br>`InventoryEnvironments`<br>`InventoryAppsConnections`<br>|Execution, Exfiltration|
|PowerPlatform - DLP policy updated or removed|Identifies changes to the data loss prevention policy, specifically policies that are updated or removed.|Update or remove a Power Platform data loss prevention policy in Power Platform environment.<br><br>**Data sources**:<br>Microsoft Power Platform Admin Activity (Preview)<br>`PowerPlatformAdminActivity`|Defense Evasion|
|Power Platform - Possibly compromised user accesses Power Platform services|Identifies user accounts flagged at risk in Microsoft Entra Identity Protection and correlates these users with sign-in activity in Power Platform, including Power Apps, Power Automate, and Power Platform Admin Center.|User with risk signals accesses Power Platform portals.<br><br>**Data sources:**<br>- Microsoft Entra ID<br>`SigninLogs`|Initial Access, Lateral Movement|

## Built-in parsers

The solution includes parsers that are used to access data from the raw data tables. Parsers ensure that the correct data is returned with a consistent schema. We recommend that you use the parsers instead of directly querying the inventory tables and watchlists. The Power Platform inventory related parsers return data from the last 7 days.

|Parser  |Data returned  |Table queried |
|---------|---------|---------|
|`InventoryApps` | Power Apps Inventory | `PowerApps_CL`  |
|`InventoryAppsConnections` |  Power Apps connections Inventoryconnections       |  `PowerAppsConnections_CL`      |
|`InventoryEnvironments`   |Power Platform environments Inventory         |  `PowerPlatrformEnvironments_CL`       |
|`InventoryFlows`   |  Power Automate flows Inventory       |  `PowerAutomateFlows_CL`       |
|`MSBizAppsTerminatedEmployees`    | Terminated employees watchlist (from watchlist template)        |  `TerminatedEmployees`      |
|`GetPowerAppsEventDetails`| Returns parsed event details for Power Apps / Connections| `PowerPlatformAdminActivity` |


For more information about analytic rules, see [Detect threats out-of-the-box](../detect-threats-built-in.md).
