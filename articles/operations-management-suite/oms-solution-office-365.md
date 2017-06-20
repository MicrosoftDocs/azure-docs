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
The Office 365 solution doesn't data from any of the [OMS agents](../log-analytics/log-analytics/data-sources.md).  It retrieves data directly from Office 365.

### Collection frequency
For each managed Windows computer, a scan is performed twice per day. Every 15 minutes the Windows API is called to query for the last update time to determine if status has changed, and if so a compliance scan is initiated.  For each managed Linux computer, a scan is performed every 3 hours.

It can take anywhere from 30 minutes up to 6 hours for the dashboard to display updated data from managed computers.   

## Using the solution
When you add the Update Management solution to your OMS workspace, the **Update Management** tile will be added to your OMS dashboard. This tile displays a count and graphical representation of the number of computers in your environment and their update compliance.<br><br>
![Update Management Summary Tile](media/oms-solution-update-management/update-management-summary-tile.png)  



## Log Analytics records
The Update Management solution creates two types of records in the OMS repository.

### Update records
A record with a type of **Update** is created for each update that is either installed or needed on each computer. Update records have the properties in the following table.

| Property | Description |
| --- | --- |
| Type |*Update* |
| SourceSystem |The source that approved installation of the update.<br>Possible values are:<br>- Microsoft Update<br>- Windows Update<br>- SCCM<br>- Linux Servers (Fetched from Package Managers) |
| Approved |Specifies whether the update has been approved for installation.<br> For Linux servers this is currently optional as patching is not managed by OMS. |
| Classification for Windows |Classification of the update.<br>Possible values are:<br>-    Applications<br>- Critical Updates<br>- Definition Updates<br>- Feature Packs<br>- Security Updates<br>- Service Packs<br>- Update Rollups<br>- Updates |
| Classification for Linux |Cassification of the update.<br>Possible values are:<br>-Critical Updates<br>- Security Updates<br>- Other Updates |
| Computer |Name of the computer. |
| InstallTimeAvailable |Specifies whether the installation time is available from other agents that installed the same update. |
| InstallTimePredictionSeconds |Estimated installation time in seconds based on other agents that installed the same update. |
| KBID |ID of the KB article that describes the update. |
| ManagementGroupName |Name of the management group for SCOM agents.  For other agents, this is AOI-<workspace ID>. |
| MSRCBulletinID |ID of the Microsoft security bulletin describing the update. |
| MSRCSeverity |Severity of the Microsoft security bulletin.<br>Possible values are:<br>- Critical<br>- Important<br>- Moderate |
| Optional |Specifies whether the update is optional. |
| Product |Name of the product the update is for.  Click **View** to open the article in a browser. |
| PackageSeverity |The severity of the vulnerability fixed in this update, as reported by the  Linux distro vendors. |
| PublishDate |Date and time that the update was installed. |
| RebootBehavior |Specifies if the update forces a reboot.<br>Possible values are:<br>- canrequestreboot<br>- neverreboots |
| RevisionNumber |Revision number of the update. |
| SourceComputerId |GUID to uniquely identify the computer. |
| TimeGenerated |Date and time that the record was last updated. |
| Title |Title of the update. |
| UpdateID |GUID to uniquely identify the update. |
| UpdateState |Specifies whether the update is installed on this computer.<br>Possible values are:<br>- Installed - The update is installed on this computer.<br>- Needed - The update is not installed and is needed on this computer. |



| Property | Description |
| --- | --- |
| Type |*OfficeActivity* |
| 



## Sample log searches
The following table provides sample log searches for update records collected by this solution.

| Query | Description |
| --- | --- |
|Windows-based server computers that need updates |`Type:Update OSType!=Linux UpdateState=Needed Optional=false Approved!=false | measure count() by Computer` |
|Linux servers that need updates | `Type:Update OSType=Linux UpdateState!="Not needed" | measure count() by Computer` |
| All computers with missing updates |`Type=Update UpdateState=Needed Optional=false | select Computer,Title,KBID,Classification,UpdateSeverity,PublishedDate` |
| Missing updates for a specific computer (replace value with your own computer name) |`Type=Update UpdateState=Needed Optional=false Computer="COMPUTER01.contoso.com" | select Computer,Title,KBID,Product,UpdateSeverity,PublishedDate` |
| All computers with missing critical or security updates |`Type=Update UpdateState=Needed Optional=false (Classification="Security Updates" OR Classification="Critical Updates"`) |
| Critical or security updates needed by machines where updates are manually applied |`Type=Update UpdateState=Needed Optional=false (Classification="Security Updates" OR Classification="Critical Updates") Computer IN {Type=UpdateSummary WindowsUpdateSetting=Manual | Distinct Computer} | Distinct KBID` |
| Error events for machines that have missing critical or security required updates |`Type=Event EventLevelName=error Computer IN {Type=Update (Classification="Security Updates" OR Classification="Critical Updates") UpdateState=Needed Optional=false | Distinct Computer}` |
| All computers with missing update rollups |`Type=Update Optional=false Classification="Update Rollups" UpdateState=Needed| select Computer,Title,KBID,Classification,UpdateSeverity,PublishedDate` |
| Distinct missing updates across all computers |`Type=Update UpdateState=Needed Optional=false | Distinct Title` |
| Windows-based server computer with updates that failed in an update run | `Type:UpdateRunProgress InstallationStatus=failed | measure count() by Computer, Title, UpdateRunName` |
| Linux server with updates that failed an update run |`Type:UpdateRunProgress InstallationStatus=failed | measure count() by Computer, Product, UpdateRunName` |
| WSUS computer membership |`Type=UpdateSummary | measure count() by WSUSServer` |
| Automatic update configuration |`Type=UpdateSummary | measure count() by WindowsUpdateSetting` |
| Computers with automatic update disabled |`Type=UpdateSummary WindowsUpdateSetting=Manual` |
| List of all the Linux machines which have a package update available |`Type=Update and OSType=Linux and UpdateState!="Not needed" | measure count() by Computer` |
| List of all the Linux machines which have a package update available which addresses Critical or Security vulnerability |`Type=Update and OSType=Linux and UpdateState!="Not needed" and (Classification="Critical Updates" OR Classification="Security Updates") | measure count() by Computer` |
| List of all packages that have an update available |Type=Update and OSType=Linux and UpdateState!="Not needed" |
| List of all packages that have an update available which addresses Critical or Security vulnerability |`Type=Update  and OSType=Linux and UpdateState!="Not needed" and (Classification="Critical Updates" OR Classification="Security Updates")` |
| List what update deployments have modified computers |`Type:UpdateRunProgress | measure Count() by UpdateRunName` |
|Computers that were updated in this update run (replace value with your Update Deployment name |`Type:UpdateRunProgress UpdateRunName="DeploymentName" | measure Count() by Computer` |
| List of all the “Ubuntu” machines with any update available |`Type=Update and OSType=Linux and OSName = Ubuntu &| measure count() by Computer` |

## Troubleshooting

This section provides information to help troubleshoot issues with the Update Management solution.  

### How do I troubleshoot update deployments?
You can view the results of the runbook responsible for deploying the updates included in the scheduled update deployment from the Jobs blade of your Automation account that is linked with the OMS workspace supporting this solution.  The runbook **Patch-MicrosoftOMSComputer** is a child runbook that targets a specific managed computer, and reviewing the verbose Stream will present detailed information for that deployment.  The output will display which required updates are applicable, download status, installation status, and additional details.<br><br> ![Update Deployment job status](media/oms-solution-update-management/update-la-patchrunbook-outputstream.png)<br>

For further information, see [Automation runbook output and messages](../automation/automation-runbook-output-and-messages.md).   

## Next steps
* Use Log Searches in [Log Analytics](../log-analytics/log-analytics-log-searches.md) to view detailed update data.
* [Create your own dashboards](../log-analytics/log-analytics-dashboards.md) showing update compliance for your managed computers.
* [Create alerts](../log-analytics/log-analytics-alerts.md) when critical updates are detected as missing from computers or a computer has automatic updates disabled.  



https://blogs.technet.microsoft.com/msoms/2016/05/13/oms-office-365-management-solution-now-in-public-preview/


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