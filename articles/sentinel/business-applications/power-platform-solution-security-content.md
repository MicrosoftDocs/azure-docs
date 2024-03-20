---
title: Microsoft Sentinel solution for Microsoft Power Platform - security content reference
description: Learn about the built-in security content provided by the Microsoft Sentinel solution for Power Platform.
author: batamig
ms.author: bagol
ms.topic: conceptual
ms.date: 02/28/2024
---

# Microsoft Sentinel solution for Microsoft Power Platform: security content reference

This article details the security content available for the Microsoft Sentinel solution for Power Platform. For more information about this solution, see [Microsoft Sentinel solution for Microsoft Power Platform overview](power-platform-solution-overview.md).
 
> [!IMPORTANT]
> - The Microsoft Sentinel solution for Power Platform is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
> - The solution is a premium offering. Pricing information will be available before the solution becomes generally available.
> - Provide feedback for this solution by completing this survey: [https://aka.ms/SentinelPowerPlatformSolutionSurvey](https://aka.ms/SentinelPowerPlatformSolutionSurvey).

## Built-in analytics rules

The following analytic rules are included when you install the solution for Power Platform. The data sources listed include the data connector name and table in Log Analytics. To avoid missing data in the inventory sources, we recommend that you don't change the default lookback period defined in the analytic rule templates.

| Rule name | Description | Source action | Tactics |
| --------- | --------- | --------- | --------- |
|PowerApps - App activity from unauthorized geo|Identifies Power Apps activity from countries in a predefined list of unauthorized countries.  <br><br> Get the list of ISO 3166-1 alpha-2 country codes from [ISO Online Browsing Platform (OBP)](https://www.iso.org/obp/ui).<br><br>This detection uses logs ingested from Microsoft Entra ID. So, we recommend that you enable the Microsoft Entra ID data connector. |Run an activity in Power App from a country that's on the unauthorized country code list.<br><br>**Data sources**: <br>- Power Platform Inventory (using Azure Functions) <br>`InventoryApps`<br>`InventoryEnvironments`<br>- Microsoft Power Apps (Preview)<br>`PowerAppsActivity`<br>- Microsoft Entra ID<br>`SigninLogs`<br>|Initial access|
|PowerApps - Multiple apps deleted|Identifies mass delete activity where multiple Power Apps are deleted, matching a predefined threshold of total apps deleted or app deleted events across multiple Power Platform environments.|Delete many Power Apps from the Power Platform admin center. <br><br>**Data sources**:<br>- Power Platform Inventory (using Azure Functions)<br>`InventoryApps`<br>`InventoryEnvironments`<br>- Microsoft Power Apps (Preview)<br>`PowerAppsActivity`|Impact|
|PowerApps - Data destruction following publishing of a new app|Identifies a chain of events when a new app is created or published and is followed within 1 hour by mass update or delete events in Dataverse. If the app publisher is on the list of users in the **TerminatedEmployees** watchlist template, the incident severity is raised.|Delete a number of records in Power Apps within 1 hour of the Power App being created or published.<br><br>**Data sources**:<br>- Power Platform Inventory (using Azure Functions)<br>`InventoryApps`<br>`InventoryEnvironments`<br>- Microsoft Power Apps (Preview)<br>`PowerAppsActivity`<br>- Microsoft Dataverse (Preview)<br>`DataverseActivity`|Impact|
|PowerApps - Multiple users accessing a malicious link after launching new app|Identifies a chain of events when a new Power App is created and is followed by these events:<br>- Multiple users launch the app within the detection window.<br>- Multiple users open the same malicious URL.<br><br>This detection cross correlates Power Apps execution logs with malicious URL click events from either of the following sources:<br>- The Microsoft 365 Defender data connector or <br>- Malicious URL indicators of compromise (IOC) in Microsoft Sentinel Threat Intelligence with the Advanced Security Information Model (ASIM) web session normalization parser.<br><br>Get the distinct number of users who launch or click the malicious link by creating a query.|Multiple users launch a new PowerApp and open a known malicious URL from the app.<br><br>**Data sources**:<br>- Power Platform Inventory (using Azure Functions)<br>`InventoryApps`<br>`InventoryEnvironments`<br>- Microsoft Power Apps (Preview)<br>`PowerAppsActivity`<br>- Threat Intelligence <br>`ThreatIntelligenceIndicator`<br>- Microsoft Defender XDR<br>`UrlClickEvents`<br>|Initial access|
|PowerAutomate - Departing employee flow activity|Identifies instances where an employee who has been notified or is already terminated, and is on the **Terminated Employees** watchlist, creates or modifies a Power Automate flow.|User defined in the **Terminated Employees** watchlist creates or updates a Power Automate flow.<br><br>**Data sources**:<br>Microsoft Power Automate (Preview)<br>`PowerAutomateActivity`<br>- Power Platform Inventory (using Azure Functions)<br>`InventoryFlows`<br>`InventoryEnvironments`<br>Terminated employees watchlist|Exfiltration, impact|
|PowerPlatform - Connector added to a sensitive environment|Identifies the creation of new API connectors within Power Platform, specifically targeting a predefined list of sensitive environments.|Add a new Power Platform connector in a sensitive Power Platform environment.<br><br>**Data sources**:<br>- Microsoft Power Platform Connectors (Preview)<br>`PowerPlatformConnectorActivity`<br>- Power Platform Inventory (using Azure Functions)<br>`InventoryApps`<br>`InventoryEnvironments`<br>`InventoryAppsConnections`<br>|Execution, Exfiltration|
|PowerPlatform - DLP policy updated or removed|Identifies changes to the data loss prevention policy, specifically policies that are updated or removed.|Update or remove a Power Platform data loss prevention policy in Power Platform environment.<br><br>**Data sources**:<br>Microsoft Power Platform DLP (Preview)<br>`PowerPlatformDlpActivity`|Defense Evasion|
|Dataverse - Guest user exfiltration following Power Platform defense impairment|(Identifies a chain of events starting with disablement of Power Platform tenant isolation and removal of an environment's access security group. These events are correlated with Dataverse exfiltration alerts associated with the impacted environment and recently created Microsoft Entra guest users.<br><Br>Activate other Dataverse analytics rules with the MITRE tactic 'Exfiltration' before enabling this rule.|As a new guest users, trigger exfiltration alerts after Power Platform security controls are disabled.<br><br>**Data sources:**<br>- PowerPlatformAdmin<br>`PowerPlatformAdminActivity`<br><br>- Dataverse<br>`DataverseActivity`<br>- Power Platform Inventory (using Azure Functions)<br>`InventoryEnvironments`<br>|Defense Evasion |
|Dataverse - Mass export of records to Excel|Identifies users exporting a large amount of records from Dynamics 365 to Excel. The amount of records exported is significantly more than any other recent activity by that user. Large exports from users with no recent activity are identified using a predefined threshold.|Export many records from Dataverse to Excel.<br><br>**Data sources:**<br>- Dataverse<br>`DataverseActivity`<br>- Power Platform Inventory (using Azure Functions)<br>`InventoryEnvironments`<br>|Exfiltration|
|Dataverse - User bulk retrieval outside normal activity|Identifies users retrieving significantly more records from Dataverse than they have in the past 2 weeks.|User retrieves many records from Dataverse<br><br>**Data sources:**<br>- Dataverse<br>`DataverseActivity`<br>- Power Platform Inventory (using Azure Functions)<br>`InventoryEnvironments`<br>|Exfiltration|
|Power Apps - Bulk sharing of Power Apps to newly created guest users|Identifies unusual bulk sharing of Power Apps to newly created Microsoft Entra guest users. Unusual bulk sharing is based on a predefined threshold in the query.|Share an app with multiple external users.<br><br>**Data sources:**<br>- Microsoft Power Apps (Preview)<br>`PowerAppsActivity`<br>- Power Platform Inventory (using Azure Functions)<br>`InventoryApps`<br>`InventoryEnvironments`<br>- Microsoft Entra ID<br>`AuditLogs`|Resource Development,<br>Initial Access,<br>Lateral Movement|
|Power Automate - Unusual bulk deletion of flow resources|Identifies bulk deletion of Power Automate flows that exceed a predefined threshold defined in the query and deviate from activity patterns observed in the last 14 days.|Bulk deletion of Power Automate flows.<br><br>**Data sources:**<br>- PowerAutomate<br>`PowerAutomateActivity`<br>|Impact, <br>Defense Evasion|
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


For more information about analytic rules, see [Detect threats out-of-the-box](../detect-threats-built-in.md).
