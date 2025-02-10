---
title: Security content reference for Microsoft Power Platform and Microsoft Dynamics 365 Customer Engagement and Microsoft Dynamics 365 Customer Engagement
description: Learn about the built-in security content provided by the Microsoft Sentinel solution for Power Platform.
author: batamig
ms.author: bagol
ms.topic: conceptual
ms.date: 11/14/2024


#Customer intent: As a security analyst, I want to understand Microsoft Sentinel's built-in analytics rules and parsers for Microsoft Power Platform and Microsoft Dynamics 365 Customer Engagement so that I can detect and respond to potential security threats effectively.

---

# Security content reference for Microsoft Power Platform and Microsoft Dynamics 365 Customer Engagement

This article details the security content available for the Microsoft Sentinel solution for Power Platform. For more information about this solution, see [Microsoft Sentinel solution for Microsoft Power Platform and Microsoft Dynamics 365 Customer Engagement overview](power-platform-solution-overview.md).

> [!IMPORTANT]
>
> - The Microsoft Sentinel solution for Power Platform is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
> - The solution is a premium offering. Pricing information will be available before the solution becomes generally available.
> - Provide feedback for this solution by completing this survey: [https://aka.ms/SentinelPowerPlatformSolutionSurvey](https://aka.ms/SentinelPowerPlatformSolutionSurvey).

## Built-in analytics rules

The following analytic rules are included when you install the solution for Power Platform. The data sources listed include the data connector name and table in Log Analytics.

### Dataverse rules

|Rule name|Description|Source action|Tactics|
|---------|---------|---------|---------|
|Dataverse - Anomalous application user activity|Identifies anomalies in activity patterns of Dataverse application (non-interactive) users, based on activity that falls outside the normal pattern of use.|Unusual S2S user activity in Dynamics 365 / Dataverse.<br><br>**Data sources**:<br>- Dataverse<br>`DataverseActivity`|CredentialAccess, Execution, Persistence|
|Dataverse - Audit log data deletion|Identifies audit log data deletion activity in Dataverse.|Deletion of Dataverse audit logs.<br><br>**Data sources**:<br>- Dataverse<br>`DataverseActivity`|DefenseEvasion|
|Dataverse - Audit logging disabled|Identifies a change in the system audit configuration whereby audit logging is turned off.|Global or entity level auditing disabled.<br><br>**Data sources**:<br>- Dataverse<br>`DataverseActivity`|DefenseEvasion|
|Dataverse - Bulk record ownership re-assignment or sharing|Identifies changes in individual record ownership, including: <br>- Record sharing with other users/teams <br>- Ownership reassignments that exceed a predefined threshold.|Many record ownership and record sharing events generated within the detection window.<br><br>**Data sources**:<br>- Dataverse<br>`DataverseActivity`|PrivilegeEscalation|
|Dataverse - Executable uploaded to SharePoint document management site|Identifies executable files and scripts that are uploaded to SharePoint sites used for Dynamics document management, circumventing native file extension restrictions in Dataverse.|Upload of executable files in Dataverse document management.<br><br>**Data sources**:<br>- Office365<br>`OfficeActivity (SharePoint)`|Execution, Persistence|
|Dataverse - Export activity from terminated or notified employee|Identifies Dataverse export activity triggered by terminate employees, or employees about to leave the organization.| Data export events associated with users on the **TerminatedEmployees** watchlist template. <br><br> **Data sources**:<br>- Dataverse<br>`DataverseActivity`|Exfiltration|
|Dataverse - Guest user exfiltration following Power Platform defense impairment|Identifies a chain of events starting with disabling Power Platform's tenant isolation and removing an environment's access security group. <br><br>These events are correlated with Dataverse exfiltration alerts associated with the impacted environment and recently created Microsoft Entra guest users.<br><Br>Activate other Dataverse analytics rules with the **Exfiltration** MITRE tactic before enabling this rule.|As a recently created guest user, trigger Dataverse exfiltration alerts after the Power Platform security controls are disabled.<br><br>**Data sources:**<br>- PowerPlatformAdmin<br>`PowerPlatformAdminActivity`<br>- Dataverse<br>`DataverseActivity`<br>|Defense Evasion|
|Dataverse - Hierarchy security manipulation|Identifies suspicious behaviors in hierarchy security.|Changes to security properties including:<br> - Hierarchy security disabled.<br> - User assigns themselves as a manager.<br> - User assigns themselves to a monitored position (set in KQL).<br><br>**Data sources**:<br>- Dataverse<br>`DataverseActivity`|PrivilegeEscalation|
|Dataverse - Honeypot instance activity|Identifies activities in a predefined Honeypot Dataverse instance. <br><br>Alerts either when either a sign-in to the Honeypot is detected or when monitored Dataverse tables in the Honeypot are accessed.|Sign-in and access data in a designated Honeypot Dataverse instance in Power Platform with auditing enabled.<br><br>**Data sources**:<br>- Dataverse<br>`DataverseActivity`|Discovery, Exfiltration|
|Dataverse - Login by a sensitive privileged user|Identifies Dataverse and Dynamics 365 sign-ins by sensitive users.|Sign-in by users added on the **VIPUsers** watchlist based on tags set within KQL.<br><br>**Data sources**:<br>- Dataverse<br>`DataverseActivity`|InitialAccess, CredentialAccess, PrivilegeEscalation|
|Dataverse - Login from IP in the block list|Identifies Dataverse sign-in activity from IPv4 addresses that are on a predefined blocklist.|Sign-in by a user with an IP address that is part of a blocked network range. Blocked network ranges are maintained in the **NetworkAddresses** watchlist template.<br><br>**Data sources**:<br>- Dataverse<br>`DataverseActivity`|InitialAccess|
|Dataverse - Login from IP not in the allow list|Identifies sign-ins from IPv4 addresses that don't match IPv4 subnets maintained on an allowlist.|Sign-in by a user with an IP address that isn't part of an allowed network range. Blocked network ranges are maintained in the **NetworkAddresses** watchlist template.<br><br>**Data sources**:<br>- Dataverse<br>`DataverseActivity`|InitialAccess|
|Dataverse - Malware found in SharePoint document management site|Identifies malware uploaded via Dynamics 365 document management or directly in SharePoint, affecting Dataverse associated SharePoint sites.|Malicious file in SharePoint site linked to Dataverse.<br><br>**Data sources**:<br>- Dataverse<br>`DataverseActivity`<br>- Office365<br>`OfficeActivity (SharePoint)`|Execution|
|Dataverse - Mass deletion of records|Identifies large scale record deletion operations based on a predefined threshold. <br>Also detects scheduled bulk deletion jobs.|Deletion of records exceeding threshold defined in KQL.<br><br>**Data sources**:<br>- Dataverse<br>`DataverseActivity`|Impact|
|Dataverse - Mass download from SharePoint document management|Identifies mass download in the last hour of files from SharePoint sites configured for document management in Dynamics 365. |Mass download exceeding threshold defined in KQL. <br><br>This analytics rule uses the **MSBizApps-Configuration** watchlist to identify SharePoint sites used for Document Management.<br><br>**Data sources**:<br>- Office365<br>`OfficeActivity (SharePoint)`|Exfiltration|
|Dataverse - Mass export of records to Excel|Identifies users exporting a large number of records from Dynamics 365 to Excel, where the number of records exported is significantly more than any other recent activity by that user. <br><br>Large exports from users with no recent activity are identified using a predefined threshold.|Export many records from Dataverse to Excel.<br><br>**Data sources:**<br>- Dataverse<br>`DataverseActivity`<br>|Exfiltration|
|Dataverse - Mass record updates|Detects mass record update changes in Dataverse and Dynamics 365, exceeding a predefined threshold.|Mass update of records exceeds threshold defined in KQL.<br><br>**Data sources**:<br>- Dataverse<br>`DataverseActivity`|Impact|
|Dataverse - New Dataverse application user activity type|Identifies new or previously unseen activity types associated with a Dataverse application (non-interactive) user.|New S2S user activity types.<br><br>**Data sources**:<br>- Dataverse<br>`DataverseActivity`|CredentialAccess, Execution, PrivilegeEscalation|
|Dataverse - New non-interactive identity granted access|Identifies API level access grants, either via the delegated permissions of a Microsoft Entra application or by direct assignment within Dataverse as an application user.|Dataverse permissions added to non-interactive user. <br><br>**Data sources**:<br>- Dataverse<br>`DataverseActivity`,<br>- AzureActiveDirectory<br>`AuditLogs`|Persistence, LateralMovement, PrivilegeEscalation|
|Dataverse - New sign-in from an unauthorized domain|Identifies Dataverse sign-in activity originating from users with UPN suffixes that haven't been seen previously in the last 14 days, and aren't present on a predefined list of authorized domains. <br><br>Common internal Power Platform system users are excluded by default.|Sign-in by external user from an unauthorized domain suffix.<br><br>**Data sources**:<br>- Dataverse<br>`DataverseActivity`|InitialAccess|
|Dataverse - New user agent type that was not used before|Identifies users accessing Dataverse from a User Agent that hasn't been seen in any Dataverse instance in the last 14 days.|Activity in Dataverse from a new user-agent.<br><br>**Data sources**:<br>- Dataverse<br>`DataverseActivity`|InitialAccess, DefenseEvasion|
|Dataverse - New user agent type that was not used with Office 365|Identifies users accessing Dynamics with a User Agent that hasn't been seen in any Office 365 workloads in the last 14 days.|Activity in Dataverse from a new user-agent.<br><br>**Data sources**:<br>- Dataverse<br>`DataverseActivity`|InitialAccess|
|Dataverse - Organization settings modified|Identifies changes made at the organization level in the Dataverse environment.|Organization level property modified in Dataverse.<br><br>**Data sources**:<br>- Dataverse<br>`DataverseActivity`|Persistence|
|Dataverse - Removal of blocked file extensions|Identifies modifications to an environment's blocked file extensions and extracts the removed extension.|Removal of blocked file extensions in Dataverse properties.<br><br>**Data sources**:<br>- Dataverse<br>`DataverseActivity`|DefenseEvasion|
|Dataverse - SharePoint document management site added or updated|Identifies modifications of the SharePoint document management integration. <br><br>Document management allows storage of data located externally to Dataverse. Combine this analytics rule with the **Dataverse: Add SharePoint sites to watchlist** playbook to automatically update the **Dataverse-SharePointSites** watchlist. <br><br>This watchlist can be used to correlate events between Dataverse and SharePoint when using the Office 365 data connector.|SharePoint site mapping added in Document Management.<br><br>**Data sources**:<br>- Dataverse<br>`DataverseActivity`|Exfiltration|
|Dataverse - Suspicious security role modifications|Identifies an unusual pattern of events whereby a new role is created, followed by the creator adding members to the role and later removing the member or deleting the role after a short time period.|Changes in security roles and role assignments.<br><br>**Data sources**:<br>- Dataverse<br>`DataverseActivity`|PrivilegeEscalation|
|Dataverse - Suspicious use of TDS endpoint|Identifies Dataverse TDS (Tabular Data Stream) protocol-based queries, where the source user or IP address has recent security alerts and the TDS protocol hasn't been used previously in the target environment.|Sudden use of the TDS endpoint in correlation with security alerts.<br><br>**Data sources**:<br>- Dataverse<br>`DataverseActivity`<br>- AzureActiveDirectoryIdentityProtection<br>`SecurityAlert`|Exfiltration, InitialAccess|
|Dataverse - Suspicious use of Web API|Identifies sign-ins across multiple Dataverse environments that breach a predefined threshold and originate from a user with an IP address that was used to sign into a well-known Microsoft Entra app registration.|Sign-in using WebAPI across multiple environments using a well known public application ID.<br><br>**Data sources**:<br>- Dataverse<br>`DataverseActivity`<br>- AzureActiveDirectory<br>`SigninLogs`|Execution, Exfiltration, Reconnaissance, Discovery|
|Dataverse - TI map IP to DataverseActivity|Identifies a match in DataverseActivity from any IP IOC from Microsoft Sentinel Threat Intelligence.|Dataverse activity with IP matching IOC.<br><br>**Data sources**:<br>- Dataverse<br>`DataverseActivity`<br> ThreatIntelligence<br>`ThreatIntelligenceIndicator`|InitialAccess, LateralMovement, Discovery|
|Dataverse - TI map URL to DataverseActivity|Identifies a match in DataverseActivity from any URL IOC from Microsoft Sentinel Threat Intelligence.|Dataverse activity with URL matching IOC.<br><br>**Data sources**:<br>- Dataverse<br>`DataverseActivity`<br> ThreatIntelligence<br>`ThreatIntelligenceIndicator`|InitialAccess, Execution, Persistence|
|Dataverse - Terminated employee exfiltration over email|Identifies Dataverse exfiltration via email by terminated employees.|Emails sent to untrusted recipient domains following security alerts correlated with users on the **TerminatedEmployees** watchlist.<br><br>**Data sources**:<br>MicrosoftThreatProtection<br>`EmailEvents`<br>`IdentityInfo`<br>- AzureActiveDirectoryIdentityProtection, IdentityInfo<br> `SecurityAlert`|Exfiltration|
|Dataverse - Terminated employee exfiltration to USB drive|Identifies files downloaded from Dataverse by departing or terminated employees, and are copied to USB mounted drives.|Files originating from Dataverse copied to USB by a user on the **TerminatedEmployees** watchlist.<br><br>**Data sources**:<br>- Dataverse<br>`DataverseActivity`<br>- MicrosoftThreatProtection<br>`DeviceInfo`<br>`DeviceEvents`<br>`DeviceFileEvents`|Exfiltration|
|Dataverse - Unusual sign-in following disabled IP address-based cookie binding protection|Identifies previously unseen IP and user agents in a Dataverse instance following disabling of cookie binding protection. <br><br>For more information, see [Safeguarding Dataverse sessions with IP cookie binding](/power-platform/admin/block-cookie-replay-attack). |New sign-in activity.<br><br><br>**Data sources**:<br>- Dataverse<br>`DataverseActivity`|DefenseEvasion|
|Dataverse - User bulk retrieval outside normal activity|Identifies users retrieving significantly more records from Dataverse than they have in the past two weeks.|User retrieves many records from Dataverse and including KQL defined threshold.<br><br>**Data sources:**<br>- Dataverse<br>`DataverseActivity`|Exfiltration|

### Power Apps rules

|Rule name|Description|Source action|Tactics|
|---------|---------|---------|---------|
|Power Apps - App activity from unauthorized geo|Identifies Power Apps activity from geographic regions in a predefined list of unauthorized geographic regions.  <br><br> This detection gets the list of ISO 3166-1 alpha-2 country codes from [ISO Online Browsing Platform (OBP)](https://www.iso.org/obp/ui).<br><br>This detection uses logs ingested from Microsoft Entra ID and requires that you also enable the Microsoft Entra ID data connector.|Run an activity in a Power App from a geographic region that's on the unauthorized country code list.<br><br>**Data sources**: <br>- Microsoft Power Platform Admin Activity (Preview)<br>`PowerPlatformAdminActivity`<br>- Microsoft Entra ID<br>`SigninLogs`<br>|Initial access|
|Power Apps - Multiple apps deleted|Identifies mass delete activity where multiple Power Apps are deleted, matching a predefined threshold of total apps deleted or app deleted events across multiple Power Platform environments.|Delete many Power Apps from the Power Platform admin center. <br><br>**Data sources**:<br>- Microsoft Power Platform Admin Activity (Preview)<br>`PowerPlatformAdminActivity`|Impact|
|Power Apps - Data destruction following publishing of a new app|Identifies a chain of events when a new app is created or published and is followed within 1 hour by a mass update or delete event in Dataverse. |Delete many records in Power Apps within 1 hour of the Power App being created or published.<br><br>If the app publisher is on the list of users in the **TerminatedEmployees** watchlist template, the incident severity is raised.<br><br>**Data sources**:<br>- Microsoft Power Platform Admin Activity (Preview)<br>`PowerPlatformAdminActivity`<br>- Microsoft Dataverse (Preview)<br>`DataverseActivity`|Impact|
|Power Apps - Multiple users accessing a malicious link after launching new app|Identifies a chain of events when a new Power App is created and is followed by these events:<br>- Multiple users launch the app within the detection window.<br>- Multiple users open the same malicious URL.<br><br>This detection cross correlates Power Apps execution logs with malicious URL selection events from either of the following sources:<br>- The Microsoft 365 Defender data connector or <br>- Malicious URL indicators of compromise (IOC) in Microsoft Sentinel Threat Intelligence with the Advanced Security Information Model (ASIM) web session normalization parser.<br><br>This detection gets the distinct number of users who launch or select the malicious link by creating a query.|Multiple users launch a new PowerApp and open a known malicious URL from the app.<br><br>**Data sources**:<br>- Microsoft Power Platform Admin Activity (Preview)<br>`PowerPlatformAdminActivity`<br>- Threat Intelligence <br>`ThreatIntelligenceIndicator`<br>- Microsoft Defender XDR<br>`UrlClickEvents`<br>|Initial access|
|Power Apps - Bulk sharing of Power Apps to newly created guest users|Identifies unusual bulk sharing of Power Apps to newly created Microsoft Entra guest users. Unusual bulk sharing is based on a predefined threshold in the query.|Share an app with multiple external users.<br><br>**Data sources:**<br>- Microsoft Power Platform Admin Activity (Preview)<br>`PowerPlatformAdminActivity`- Microsoft Entra ID<br>`AuditLogs`|Resource Development,<br>Initial Access,<br>Lateral Movement|

### Power Automate rules

|Rule name|Description|Source action|Tactics|
|---------|---------|---------|---------|
|Power Automate - Departing employee flow activity|Identifies instances where an employee who has been notified or is already terminated, and is on the **Terminated Employees** watchlist, creates or modifies a Power Automate flow.|User defined in the **TerminatedEmployees** watchlist creates or updates a Power Automate flow.<br><br>**Data sources**:<br>Microsoft Power Automate (Preview)<br>`PowerAutomateActivity`<br>**TerminatedEmployees** watchlist|Exfiltration, impact|
|Power Automate - Unusual bulk deletion of flow resources|Identifies bulk deletion of Power Automate flows that exceed a predefined threshold defined in the query, and deviate from activity patterns observed in the last 14 days.|Bulk deletion of Power Automate flows.<br><br>**Data sources:**<br>- PowerAutomate<br>`PowerAutomateActivity`<br>|Impact, <br>Defense Evasion|

### Power Platform rules

|Rule name|Description|Source action|Tactics|
|---------|---------|---------|---------|
|Power Platform - Connector added to a sensitive environment|Identifies the creation of new API connectors within Power Platform, specifically targeting a predefined list of sensitive environments.|Add a new Power Platform connector in a sensitive Power Platform environment.<br><br>**Data sources**:<br>- Microsoft Power Platform Admin Activity (Preview)<br>`PowerPlatformAdminActivity`<br>|Execution, Exfiltration|
|Power Platform - DLP policy updated or removed|Identifies changes to the data loss prevention policy, specifically policies that are updated or removed.|Update or remove a Power Platform data loss prevention policy in Power Platform environment.<br><br>**Data sources**:<br>Microsoft Power Platform Admin Activity (Preview)<br>`PowerPlatformAdminActivity`|Defense Evasion|
|Power Platform - Possibly compromised user accesses Power Platform services|Identifies user accounts flagged at risk in Microsoft Entra ID Protection and correlates these users with sign-in activity in Power Platform, including Power Apps, Power Automate, and Power Platform Admin Center.|User with risk signals accesses Power Platform portals.<br><br>**Data sources:**<br>- Microsoft Entra ID<br>`SigninLogs`|Initial Access, Lateral Movement|
|Power Platform - Account added to privileged Microsoft Entra roles|Identifies changes to the following privileged directory roles that affect Power Platform:<br>- Dynamics 365 Admins- Power Platform Admins- Fabric Admins|**Data sources**:<br>AzureActiveDirectory<br>`AuditLogs`|PrivilegeEscalation|

## Hunting queries

The solution includes hunting queries that can be used by analysts to proactively hunt malicious or suspicious activity in the Dynamics 365 and Power Platform environments.

|Rule name|Description|Data Source|Tactics|
|---------|---------|---------|---------|
| Dataverse - Activity after Microsoft Entra alerts | This hunting query looks for users conducting Dataverse/Dynamics 365 activity shortly after a Microsoft Entra ID Protection alert for that user. <br><br>The query only looks for users not seen before or conducting Dynamics activity not previously seen. | <br>- Dataverse<br>`DataverseActivity`<br>- AzureActiveDirectoryIdentityProtection<br>`SecurityAlert`  | InitialAccess |
| Dataverse - Activity after failed logons | This hunting query looks for users conducting Dataverse/Dynamics 365 activity shortly after many failed sign-ins. <br><br>Use this query to hunt for potential post brute force activity. Adjust the threshold figure based on the false positive rate. | - Dataverse<br>`DataverseActivity`<br>- AzureActiveDirectory<br>`SigninLogs` | InitialAccess |
| Dataverse - Cross-environment data export activity | Searches for data export activity across a predetermined number of Dataverse instances. <br><br>Data export activity across multiple environments could indicate suspicious activity as users typically work on a few environments only. | - Dataverse<br>`DataverseActivity` | Exfiltration, Collection |
| Dataverse - Dataverse export copied to USB devices | Uses data from Microsoft Defender XDR to detect files downloaded from a Dataverse instance and copied to USB drive. | - Dataverse<br>`DataverseActivity`<br>- MicrosoftThreatProtection<br>`DeviceInfo`<br>`DeviceFileEvents`<br>`DeviceEvents` | Exfiltration |
| Dataverse - Generic client app used to access production environments | Detects the use of the built-in "Dynamics 365 Example Application" to access production environments. <br><br>This generic app can’t be restricted by Microsoft Entra ID authorization controls and can be abused to gain unauthorized access via Web API. | - Dataverse<br>`DataverseActivity`<br>- AzureActiveDirectory<br>`SigninLogs`  | Execution |
| Dataverse - Identity management activity outside of privileged directory role membership | Detects identity administration events in Dataverse/Dynamics 365 made by accounts whthatich aren't members of the following privileged directory roles: Dynamics 365 Admins, Power Platform Admins or Global Admins | - Dataverse<br>`DataverseActivity`<br>- UEBA<br>`IdentityInfo` | PrivilegeEscalation |
| Dataverse - Identity management changes without MFA | Used to show privileged identity administration operations in Dataverse made by accounts that signed in without using MFA. | - Dataverse<br>`DataverseActivity`<br>- AzureActiveDirectory<br>`SigninLogs, DataverseActivity` | InitialAccess |
| Power Apps - Anomalous bulk sharing of Power App to newly created guest users | The query detects anomalous attempts to perform bulk sharing of a Power App to newly created guest users. | **Data sources**:<br>PowerPlatformAdmin, AzureActiveDirectory<br>`AuditLogs, PowerPlatformAdminActivity` | InitialAccess, LateralMovement, ResourceDevelopment |

## Playbooks

This solution contains playbooks which can be used to automate security response to incidents and alerts in Microsoft Sentinel.

| Playbook name | Description |
| --- | --- |
| Security workflow: alert verification with workload owners | This playbook can reduce burden on the SOC by offloading alert verification to IT admins for specific analytics rules. It is triggered when a Microsoft Sentinel alert is generated, creates a message (and associated notification email) in the workload owner's Microsoft Teams channel containing details of the alert. If the workload owner responds that the activity is not authorized, the alert will be converted to an incident in Microsoft Sentinel for the SOC to handle. |
| Dataverse: Send notification to manager | This playbook can be triggered when a Microsoft Sentinel incident is raised and will automatically send an email notification to the manager of the affected user entities. The Playbook can be configured to send either to the Dynamics 365 manager, or using the manager in Office 365. |
| Dataverse: Add user to blocklist (incident trigger) | This playbook can be triggered when a Microsoft Sentinel incident is raised and will automatically add affected user entities to a pre-defined Microsoft Entra group, resulting in blocked access. The Microsoft Entra group is used with Conditional Access to block sign-in to the Dataverse. |
| Dataverse: Add user to blocklist using Outlook approval workflow | This playbook can be triggered when a Microsoft Sentinel incident is raised and will automatically add affected user entities to a pre-defined Microsoft Entra group, using an Outlook based approval workflow, resulting in blocked access. The Microsoft Entra group is used with Conditional Access to block sign-in to the Dataverse. |
| Dataverse: Add user to blocklist using Teams approval workflow | This playbook can be triggered when a Microsoft Sentinel incident is raised and will automatically add affected user entities to a pre-defined Microsoft Entra group, using a Teams adaptive card approval workflow, resulting in blocked access. The Microsoft Entra group is used with Conditional Access to block sign-in to the Dataverse. |
| Dataverse: Add user to blocklist (alert trigger) | This playbook can be triggered on-demand when a Microsoft Sentinel alert is raised, allowing the analyst to add affected user entities to a pre-defined Microsoft Entra group, resulting in blocked access. The Microsoft Entra group is used with Conditional Access to block sign-in to the Dataverse. |
| Dataverse: Remove user from blocklist | This playbook can be triggered on-demand when a Microsoft Sentinel alert is raised, allowing the analyst to remove affected user entities from a pre-defined Microsoft Entra group used to block access. The Microsoft Entra group is used with Conditional Access to block sign-in to the Dataverse. |
| Dataverse: Add SharePoint sites to watchlist | This playbook is used to add new or updated SharePoint document management sites into the configuration watchlist. When combined with a scheduled analytics rule monitoring the Dataverse activity log, this Playbook will trigger when a new SharePoint document management site mapping is added. The site will be added to a watchlist to extend monitoring coverage. |


## Workbooks

Microsoft Sentinel workbooks are customizable, interactive dashboards within Microsoft Sentinel that facilitate analysts' efficient visualization, analysis, and investigation of security data. This solution includes the **Dynamics 365 Activity** workbook, which presents a visual representation of activity in Microsoft Dynamics 365 Customer Engagement / Dataverse, including record retrieval statistics and an anomaly chart.

## Watchlists

This solution includes the **MSBizApps-Configuration** watchlist, and requires users to create additional watchlists based on the following watchlist templates:

- **VIPUsers**
- **NetworkAddresses**
- **TerminatedEmployees**

For more information, see [Watchlists in Microsoft Sentinel](../watchlists.md) and [Create watchlists](../watchlists-create.md#upload-watchlist-created-from-a-template-preview).

## Built-in parsers

The solution includes parsers that are used to access data from the raw data tables. Parsers ensure that the correct data is returned with a consistent schema. We recommend that you use the parsers instead of directly querying the watchlists.

   
|Parser  |Data returned |Table queried|
|--------|--------------|-------------|
|**MSBizAppsOrgSettings**|List of available organization wide settings available in Dynamics 365 Customer Engagement / Dataverse|n/a|
|**MSBizAppsVIPUsers**|Parser for the **VIPUsers** watchlist|`VIPUsers` from watchlist template|
|**MSBizAppsNetworkAddresses**|Parser for the **NetworkAddresses** watchlist|`NetworkAddresses` from watchlist template|
|**MSBizAppsTerminatedEmployees**|Parser for the **TerminatedEmployees** watchlist|`TerminatedEmployees` from watchlist template|
|**DataverseSharePointSites**|SharePoint sites used in Dataverse Document Management|`MSBizApps-Configuration` watchlist filtered by category 'SharePoint'|

For more information about analytic rules, see [Detect threats out-of-the-box](../detect-threats-built-in.md).
