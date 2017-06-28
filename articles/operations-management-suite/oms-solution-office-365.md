---
title: Update Management solution in OMS | Microsoft Docs
description: This article is intended to help you understand how to use this solution to manage updates for your Windows and Linux computers.
services: operations-management-suite
documentationcenter: ''
author: MGoedtel
manager: carmonm
editor: ''

ms.assetid: e33ce6f9-d9b0-4a03-b94e-8ddedcc595d2
ms.service: operations-management-suite
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 06/05/2017
ms.author: magoedte

---
# Office 365 solution in Operations Management Suite (OMS)

![Office 365 logo](media/oms-solution-office-365/icon.png)

The Office 365 solution for Operations Management Suite (OMS) allows you to monitor you Office 365 environment in Log Analytics.  

- Monitor user activities on your Office 365 accounts to analyze usage patterns as well as identify behavioral trends. For example, you can extract specific usage scenarios, such as files that are shared outside your organization or the most popular SharePoint sites.
- Monitor administrator activities to track configuration changes or high privilege operations.
- Detect and investigate unwanted user behavior, which can be customized for your organizational needs.
- Demonstrate audit and compliance. For example, you can monitor file access operations on confidential files, which can help you with the audit and compliance process.
- Perform operational troubleshooting by using OMS Search on top of Office 365 activity data of your organization.

## Prerequisites
The following is required prior to this solution being installed and configured.

- Office 365 subscription and  credentials for a user account that is a Global Administrator. 


## Management packs
This solution does not install any management packs in connected management groups.
  

## Configuration
Once you [add the Office 365 solution to your subscription](/log-analytics/log-analytics-add-solutions.md), you have to connect it to your Office 365 subscription.

1. Add the Alert Management solution to your OMS workspace using the process described in [Add solutions](log-analytics-add-solutions.md).
2. Go to **Settings** in the OMS portal.
3. Under **Connected Sources**, select **Office 365**.
4. Click on **Connect Office 365**.<br>![Connnect Office 365](media/oms-solution-office-365/configure.png)
5. Sign in to Office 365 with an account that is a Global Administrator for your subscription. 
6. The subscription will be listed with the workloads that the solution will monitor.<br>![Connnect Office 365](media/oms-solution-office-365/connected.png) 


## Data collection
### Supported agents
The Office 365 solution doesn't retrieve data from any of the [OMS agents](../log-analytics/log-analytics/data-sources.md).  It retrieves data directly from Office 365.

### Collection frequency
To be completed.   

## Using the solution
When you add the Office 365 solution to your OMS workspace, the **Office 365** tile will be added to your OMS dashboard. This tile displays a count and graphical representation of the number of computers in your environment and their update compliance.<br><br>
![Office 365 Summary Tile](media/oms-solution-office-365/tile.png)  

Click on the **Office 365** tile to open the **Office 365** dashboard which includes the columns in the following table.

The dashboard includes the columns in the following table. Each column lists the top ten alerts by count matching that column's criteria for the specified scope and time range. You can run a log search that provides the entire list by clicking See all at the bottom of the column or by clicking the column header.

| Column | Description |
|:--|:--|
| Operations | Provides information about the active users from your all monitored Office 365 subscriptions. You will also be able to see the number of activities that happen over time.
| Exchange | Shows the breakdown of Exchange Server activities such as Add-Mailbox Permission, or Set-Mailbox. |
| SharePoint | Shows the top activities that users perform on SharePoint documents. When you drill down from this tile, the search page shows the details of these activities, such as the target document and the location of this activity. For example, for a File Accessed event, you will be able to see the document that’s being accessed, its associated account name, and IP address. |
| Azure Active Directory | Includes top user activities, such as Reset User Password and Login Attempts. When you drill down, you will be able to see the details of these activities like the Result Status. This is mostly helpful if you want to monitor suspicious activities on your Azure Active Directory. |

![Office 365 Dashboard](media/oms-solution-office-365/dashboard.png)  


## Log Analytics records
The Office 365 solution creates records in the OMS repository with the properties in the following table. 

| Property | Description |
|:--- |:--- |
| Type |*OfficeActivity* |
| AADTarget | |
| Actor | |
| ActorContextId | |
| ActorIpAddress | |
| AffectedItems | |
| Application | |
| AzureActiveDirectory_EventType | |
| Client | |
| ClientInfoString | |
| ClientIP | IP address of the client that performed the operation. |
| ClientMachineName | |
| ClientProcessName | |
| ClientVersion | |
| Client_IPAddress | |
| CrossMailboxOperations | |
| CustomEvent | |
| DataCenterSecurityEventType | |
| DestFolder | |
| DestinationFileExtension | |
| DestinationFileName | |
| DestinationRelativeUrl | |
| DestMailboxId | |
| DestMailboxOwnerMasterAccountSid | |
| DestMailboxOwnerSid | |
| DestMailboxOwnerUPN | |
| EffectiveOrganization | |
| evationApprovedTime | |
| ElevationApprover | |
| ElevationDuration | |
| ElevationRequestId | |
| ElevationRole | |
| ElevationTime | |
| EventSource | |
| Event_Data | |
| ExtendedProperties | |
| ExternalAccess | |
| Folder | |
| Folders | |
| GenericInfo | |
| InternalLogonType | |
| InterSystemsId | |
| IntraSystemId | |
| Item | |
| ItemType | |
| LoginStatus | |
| LogonUserDisplayName | |
| LogonUserSid | |
| Logon_Type | |
| MachineDomainInfo | |
| MachineId | |
| MailboxGuid | |
| MailboxOwnerMasterAccountSid | |
| MailboxOwnerSid | |
| MailboxOwnerUPN | |
| ModifiedObjectResolvedName | |
| ModifiedProperties | |
| OfficeId | Guid for the record in Office 365 |
| OfficeObjectId | |
| OfficeTenantId | |
| OfficeWorkload | |
| Operation | Description of the operation that was performed. |
| OrganizationId | ID of the Office 365 organization. |
| OrganizationName | |
| OriginatingServer | |
| Parameters | |
| RecordType | Type of the record for Office 365.<br><br>AzureActiveDirectory<br>SharePoint<br>SharePointFileOperation |
| ResultStatus | |
| SendAsUserMailboxGuid | |
| SendAsUserSmtp | |
| SendonBehalfOfUserMailboxGuid | |
| SendOnBehalfOfUserSmtp | |
| SharingType | |
| Site_ | |
| Site_Url | |
| SourceFileExtension | |
| SourceFileName | |
| SourceRelativeUrl | |
| SourceSystem | |
| Source_Name | |
| Start_Time | |
| SupportTicketId | |
| TargetContextId | |
| TimeGenerated | Date and time the record was created. |
| Type | |
| UserAgent | |
| UserDomain | |
| UserId | |
| UserKey | |
| UserSharedWith | |
| UserType | Type of the user  |



## Sample log searches
The following table provides sample log searches for update records collected by this solution.

| Query | Description |
| --- | --- |
|Count of all the operations on your Office 365 subscription |`Type = OfficeActivity | measure count() by Operation` |
|Usage of SharePoint sites|`Type=OfficeActivity OfficeWorkload=sharepoint | measure count() as Count by SiteUrl | sort Count asc`|
|File access operations by user type|`Type=OfficeActivity OfficeWorkload=sharepoint Operation=FileAccessed | measure count() by UserType`|
|Search with a specific keyword|`Type=OfficeActivity OfficeWorkload=azureactivedirectory "MyTest"`|
|Monitor external actions on Exchange|`Type=OfficeActivity OfficeWorkload=exchange ExternalAccess = true`|



## Troubleshooting

This section provides information to help troubleshoot issues with the Update Management solution.  

To be completed.

## Next steps
* Use Log Searches in [Log Analytics](../log-analytics/log-analytics-log-searches.md) to view detailed update data.
* [Create your own dashboards](../log-analytics/log-analytics-dashboards.md) to display your favorite Office 365 search queries.
* [Create alerts](../log-analytics/log-analytics-alerts.md) to be proactively notified of important Office 365 activities.  
