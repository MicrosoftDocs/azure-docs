---
title: Office 365 management solution in Azure | Microsoft Docs
description: This article provides details on configuration and use of the Office 365 solution in Azure.  It includes detailed description of the Office 365 records created in Azure Monitor.
ms.subservice: 
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 03/30/2020

---

# Office 365 management solution in Azure (Preview)

![Office 365 logo](media/solution-office-365/icon.png)

> [!IMPORTANT]
> ## Solution update
> This solution has been replaced by the [Office 365](../../sentinel/connect-office-365.md) General Availability solution in [Azure Sentinel](../../sentinel/overview.md) and the [Azure AD reporting and monitoring solution](../../active-directory/reports-monitoring/plan-monitoring-and-reporting.md). Together they provide an updated version of the previous Azure Monitor Office 365 solution with an improved configuration experience. You can continue to use the existing solution until July 30, 2020.
> 
> Azure Sentinel is a cloud native Security Information and Event Management solution that ingests logs and provides additional SIEM functionality including detections, investigations, hunting and machine learning driven insights. Using Azure Sentinel will now provide you with ingestion of Office 365 SharePoint activity and Exchange management logs.
> 
> Azure AD reporting provides a more comprehensive view of logs from Azure AD activity in your environment, including sign in events, audit events, and changes to your directory. To connect Azure AD logs, you can use either the [Azure Sentinel Azure AD connector](../../sentinel/connect-azure-active-directory.md) or configure [Azure AD logs integration with Azure Monitor](../../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md). 
>
> The collection of Azure AD log is subjected to Azure Monitor pricing.  See [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/) for more information.
>
> To use the Azure Sentinel Office 365 solution:
> 1. Using Office 365 connector in Azure Sentinel affects the pricing for your workspace. For more information, see [Azure Sentinel pricing](https://azure.microsoft.com/pricing/details/azure-sentinel/).
> 2. If you are already using the Azure Monitor Office 365 solution, you must first uninstall it using the script in the [Uninstall section below](#uninstall).
> 3. [Enable the Azure Sentinel solution](../../sentinel/quickstart-onboard.md) on your workspace.
> 4. Go to the **Data connectors** page in Azure Sentinel and enable the **Office 365** connector.
>
> ## Frequently asked questions
> 
> ### Q: Is it possible to on-board the Office 365 Azure Monitor solution between now and July 30th?
> No, the Azure Monitor Office 365 solution onboarding scripts are no longer available. The solution will be removed on July 30th.
> 
> ### Q: Will the tables and schemas be changed?
> The **OfficeActivity** table name and schema will remain the same as in the current solution. You can continue using the same queries in the new solution excluding queries that reference Azure AD data.
> 
> The new [Azure AD reporting and monitoring solution](../../active-directory/reports-monitoring/plan-monitoring-and-reporting.md) logs will be ingested into the [SigninLogs](../../active-directory/reports-monitoring/concept-sign-ins.md) and [AuditLogs](../../active-directory/reports-monitoring/concept-audit-logs.md) tables instead of **OfficeActivity**. For more information, see [how to analyze Azure AD logs](../../active-directory/reports-monitoring/howto-analyze-activity-logs-log-analytics.md), which is also relevant for Azure Sentinel and Azure Monitor users.
> 
> Following are samples for converting queries from **OfficeActivity** to **SigninLogs**:
> 
> **Query failed sign-ins, by user:**
> 
> ```Kusto
> OfficeActivity
> | where TimeGenerated >= ago(1d) 
> | where OfficeWorkload == "AzureActiveDirectory"                      
> | where Operation == 'UserLoginFailed'
> | summarize count() by UserId    
> ```
> 
> ```Kusto
> SigninLogs
> | where ConditionalAccessStatus == "failure" or ConditionalAccessStatus == "notApplied"
> | summarize count() by UserDisplayName
> ```
> 
> **View Azure AD operations:**
> 
> ```Kusto
> OfficeActivity
> | where OfficeWorkload =~ "AzureActiveDirectory"
> | sort by TimeGenerated desc
> | summarize AggregatedValue = count() by Operation
> ```
> 
> ```Kusto
> AuditLogs
> | summarize count() by OperationName
> ```
> 
> ### Q: How can I on-board Azure Sentinel?
> Azure Sentinel is a solution that you can enable on new or existing Log Analytics workspace. To learn more, see [Azure Sentinel on-boarding documentation](../../sentinel/quickstart-onboard.md).
>
> ### Q: Do I need Azure Sentinel to connect the Azure AD logs?
> You can configure [Azure AD logs integration with Azure Monitor](../../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md), which is not related to the Azure Sentinel solution. Azure Sentinel provides a native connector and out-of-the box content for Azure AD logs. For more information, see the question below on out-of-the-box security-oriented content.
>
> ###    Q: What are the differences when connecting Azure AD logs from Azure Sentinel and Azure Monitor?
> Azure Sentinel and Azure Monitor connect to Azure AD logs based on the same [Azure AD reporting and monitoring solution](../../active-directory/reports-monitoring/plan-monitoring-and-reporting.md). Azure Sentinel provides a one-click, native connector that connects the same data and provides monitoring information.
>
> ###    Q: What do I need to change when moving to the new Azure AD reporting and monitoring tables?
> All queries using Azure AD data, including queries in alerts, dashboards, and any content that you created using Office 365 Azure AD data, must be recreated using the new tables.
>
> Azure Sentinel and Azure AD provide built-in content that you can use when moving to the Azure AD reporting and monitoring solution. For more information, see the next question on out-of-the-box security-oriented content and [How to use Azure Monitor workbooks for Azure Active Directory reports](../../active-directory/reports-monitoring/howto-use-azure-monitor-workbooks.md). 
>
> ### Q: How I can use the Azure Sentinel out-of-the-box security-oriented content?
> Azure Sentinel provides out-of-the-box security-oriented dashboards, custom alert queries, hunting queries, investigation, and automated response capabilities based on the Office 365 and Azure AD logs. Explore the Azure Sentinel GitHub and tutorials to learn more:
>
> - [Detect threats out-of-the-box](../../sentinel/tutorial-detect-threats-built-in.md)
> - [Create custom analytic rules to detect suspicious threats](../../sentinel/tutorial-detect-threats-custom.md)
> - [Monitor your data](../../sentinel/tutorial-monitor-your-data.md)
> - [Investigate incidents with Azure Sentinel](../../sentinel/tutorial-investigate-cases.md)
> - [Set up automated threat responses in Azure Sentinel](../../sentinel/tutorial-respond-threats-playbook.md)
> - [Azure Sentinel GitHub community](https://github.com/Azure/Azure-Sentinel/tree/master/Playbooks)
> 
> ### Q: Does Azure Sentinel provide additional connectors as part of the solution?
> Yes, see [Azure Sentinel connect data sources](../../sentinel/connect-data-sources.md).
> 
> ###    Q: What will happen on July 30? Do I need to offboard beforehand?
> 
> - You won't be able to receive data from the **Office365** solution. The solution will no longer be available in the Marketplace
> - For Azure Sentinel customers, the Log Analytics workspace solution **Office365** will be included in the Azure Sentinel **SecurityInsights** solution.
> - If you don't offboard your solution manually, your data will be disconnected automatically on July 30.
> 
> ### Q: Will my data transfer to the new solution?
> Yes. When you remove the **Office 365** solution from your workspace, its data will become temporarily unavailable because the schema is removed. When you enable the new **Office 365** connector in Sentinel, the schema is restored to the workspace and any data already collected will become available. 
 

The Office 365 management solution allows you to monitor your Office 365 environment in Azure Monitor.

- Monitor user activities on your Office 365 accounts to analyze usage patterns as well as identify behavioral trends. For example, you can extract specific usage scenarios, such as files that are shared outside your organization or the most popular SharePoint sites.
- Monitor administrator activities to track configuration changes or high privilege operations.
- Detect and investigate unwanted user behavior, which can be customized for your organizational needs.
- Demonstrate audit and compliance. For example, you can monitor file access operations on confidential files, which can help you with the audit and compliance process.
- Perform operational troubleshooting by using [log queries](../log-query/log-query-overview.md) on top of Office 365 activity data of your organization.


## Uninstall

You can remove the Office 365 management solution using the process in [Remove a management solution](solutions.md#remove-a-monitoring-solution). This will not stop data being collected from Office 365 into Azure Monitor though. Follow the procedure below to unsubscribe from Office 365 and stop collecting data.

1. Save the following script as *office365_unsubscribe.ps1*.

    ```powershell
    param (
        [Parameter(Mandatory=$True)][string]$WorkspaceName,
        [Parameter(Mandatory=$True)][string]$ResourceGroupName,
        [Parameter(Mandatory=$True)][string]$SubscriptionId,
        [Parameter(Mandatory=$True)][string]$OfficeTennantId
    )
    $line='#-------------------------------------------------------------------------------------------------------------------------------------------------------------------------'
    
    $line
    IF ($Subscription -eq $null)
        {Login-AzAccount -ErrorAction Stop}
    $Subscription = (Select-AzSubscription -SubscriptionId $($SubscriptionId) -ErrorAction Stop)
    $Subscription
    $option = [System.StringSplitOptions]::RemoveEmptyEntries 
    $Workspace = (Set-AzOperationalInsightsWorkspace -Name $($WorkspaceName) -ResourceGroupName $($ResourceGroupName) -ErrorAction Stop)
    $Workspace
    $WorkspaceLocation= $Workspace.Location
    
    # Client ID for Azure PowerShell
    $clientId = "1950a258-227b-4e31-a9cf-717495945fc2"
    # Set redirect URI for Azure PowerShell
    $redirectUri = "urn:ietf:wg:oauth:2.0:oob"
    $domain='login.microsoftonline.com'
    $adTenant =  $Subscription[0].Tenant.Id
    $authority = "https://login.windows.net/$adTenant";
    $ARMResource ="https://management.azure.com/";
    $xms_client_tenant_Id ='55b65fb5-b825-43b5-8972-c8b6875867c1'
    
    switch ($WorkspaceLocation) {
           "USGov Virginia" { 
                             $domain='login.microsoftonline.us';
                              $authority = "https://login.microsoftonline.us/$adTenant";
                              $ARMResource ="https://management.usgovcloudapi.net/"; break} # US Gov Virginia
           default {
                    $domain='login.microsoftonline.com'; 
                    $authority = "https://login.windows.net/$adTenant";
                    $ARMResource ="https://management.azure.com/";break} 
                    }
    
    Function RESTAPI-Auth { 
    
    $global:SubscriptionID = $Subscription.SubscriptionId
    # Set Resource URI to Azure Service Management API
    $resourceAppIdURIARM=$ARMResource;
    # Authenticate and Acquire Token 
    # Create Authentication Context tied to Azure AD Tenant
    $authContext = New-Object "Microsoft.IdentityModel.Clients.ActiveDirectory.AuthenticationContext" -ArgumentList $authority
    # Acquire token
    $platformParameters = New-Object "Microsoft.IdentityModel.Clients.ActiveDirectory.PlatformParameters" -ArgumentList "Auto"
    $global:authResultARM = $authContext.AcquireTokenAsync($resourceAppIdURIARM, $clientId, $redirectUri, $platformParameters)
    $global:authResultARM.Wait()
    $authHeader = $global:authResultARM.Result.CreateAuthorizationHeader()
    $authHeader
    }
    
    Function Office-UnSubscribe-Call{
    
    #----------------------------------------------------------------------------------------------------------------------------------------------
    $authHeader = $global:authResultARM.Result.CreateAuthorizationHeader()
    $ResourceName = "https://manage.office.com"
    $SubscriptionId   = $Subscription[0].Subscription.Id
    $OfficeAPIUrl = $ARMResource + 'subscriptions/' + $SubscriptionId + '/resourceGroups/' + $ResourceGroupName + '/providers/Microsoft.OperationalInsights/workspaces/' + $WorkspaceName + '/datasources/office365datasources_'  + $SubscriptionId + $OfficeTennantId + '?api-version=2015-11-01-preview'
    
    $Officeparams = @{
        ContentType = 'application/json'
        Headers = @{
        'Authorization'="$($authHeader)"
        'x-ms-client-tenant-id'=$xms_client_tenant_Id
        'Content-Type' = 'application/json'
        }
        Method = 'Delete'
        URI = $OfficeAPIUrl
      }
    
    $officeresponse = Invoke-WebRequest @Officeparams 
    $officeresponse
    
    }
    
    #GetDetails 
    RESTAPI-Auth -ErrorAction Stop
    Office-UnSubscribe-Call -ErrorAction Stop
    ```

2. Run the script with the following command:

    ```
    .\office365_unsubscribe.ps1 -WorkspaceName <Log Analytics workspace name> -ResourceGroupName <Resource Group name> -SubscriptionId <Subscription ID> -OfficeTennantID <Tenant ID> 
    ```

    Example:

    ```powershell
    .\office365_unsubscribe.ps1 -WorkspaceName MyWorkspace -ResourceGroupName MyResourceGroup -SubscriptionId '60b79d74-f4e4-4867-b631-yyyyyyyyyyyy' -OfficeTennantID 'ce4464f8-a172-4dcf-b675-xxxxxxxxxxxx'
    ```

You will be prompted for credentials. Provide the credentials for your Log Analytics workspace.

## Data collection

It may take a few hours for data to initially be collected. Once it starts collecting, Office 365 sends a [webhook notification](https://msdn.microsoft.com/office-365/office-365-management-activity-api-reference#receiving-notifications) with detailed data to Azure Monitor each time a record is created. This record is available in Azure Monitor within a few minutes after being received.

## Using the solution

[!INCLUDE [azure-monitor-solutions-overview-page](../../../includes/azure-monitor-solutions-overview-page.md)]

When you add the Office 365 solution to your Log Analytics workspace, the **Office 365** tile will be added to your dashboard. This tile displays a count and graphical representation of the number of computers in your environment and their update compliance.<br><br>
![Office 365 Summary Tile](media/solution-office-365/tile.png)  

Click on the **Office 365** tile to open the **Office 365** dashboard.

![Office 365 Dashboard](media/solution-office-365/dashboard.png)  

The dashboard includes the columns in the following table. Each column lists the top ten alerts by count matching that column's criteria for the specified scope and time range. You can run a log search that provides the entire list by clicking See all at the bottom of the column or by clicking the column header.

| Column | Description |
|:--|:--|
| Operations | Provides information about the active users from your all monitored Office 365 subscriptions. You will also be able to see the number of activities that happen over time.
| Exchange | Shows the breakdown of Exchange Server activities such as Add-Mailbox Permission, or Set-Mailbox. |
| SharePoint | Shows the top activities that users perform on SharePoint documents. When you drill down from this tile, the search page shows the details of these activities, such as the target document and the location of this activity. For example, for a File Accessed event, you will be able to see the document that's being accessed, its associated account name, and IP address. |
| Azure Active Directory | Includes top user activities, such as Reset User Password and Login Attempts. When you drill down, you will be able to see the details of these activities like the Result Status. This is mostly helpful if you want to monitor suspicious activities on your Azure Active Directory. |




## Azure Monitor log records

All records created in the Log Analytics workspace in Azure Monitor by the Office 365 solution have a **Type** of **OfficeActivity**.  The **OfficeWorkload** property determines which Office 365 service the record refers to - Exchange, AzureActiveDirectory, SharePoint, or OneDrive.  The **RecordType** property specifies the type of operation.  The properties will vary for each operation type and are shown in the tables below.

### Common properties

The following properties are common to all Office 365 records.

| Property | Description |
|:--- |:--- |
| Type | *OfficeActivity* |
| ClientIP | The IP address of the device that was used when the activity was logged. The IP address is displayed in either an IPv4 or IPv6 address format. |
| OfficeWorkload | Office 365 service that the record refers to.<br><br>AzureActiveDirectory<br>Exchange<br>SharePoint|
| Operation | The name of the user or admin activity.  |
| OrganizationId | The GUID for your organization's Office 365 tenant. This value will always be the same for your organization, regardless of the Office 365 service in which it occurs. |
| RecordType | Type of operation performed. |
| ResultStatus | Indicates whether the action (specified in the Operation property) was successful or not. Possible values are Succeeded, PartiallySucceeded, or Failed. For Exchange admin activity, the value is either True or False. |
| UserId | The UPN (User Principal Name) of the user who performed the action that resulted in the record being logged; for example, my_name@my_domain_name. Note that records for activity performed by system accounts (such as SHAREPOINT\system or NTAUTHORITY\SYSTEM) are also included. | 
| UserKey | An alternative ID for the user identified in the UserId property.  For example, this property is populated with the passport unique ID (PUID) for events performed by users in SharePoint, OneDrive for Business, and Exchange. This property may also specify the same value as the UserID property for events occurring in other services and events performed by system accounts|
| UserType | The type of user that performed the operation.<br><br>Admin<br>Application<br>DcAdmin<br>Regular<br>Reserved<br>ServicePrincipal<br>System |


### Azure Active Directory base

The following properties are common to all Azure Active Directory records.

| Property | Description |
|:--- |:--- |
| OfficeWorkload | AzureActiveDirectory |
| RecordType     | AzureActiveDirectory |
| AzureActiveDirectory_EventType | The type of Azure AD event. |
| ExtendedProperties | The extended properties of the Azure AD event. |


### Azure Active Directory Account logon

These records are created when an Active Directory user attempts to log on.

| Property | Description |
|:--- |:--- |
| `OfficeWorkload` | AzureActiveDirectory |
| `RecordType`     | AzureActiveDirectoryAccountLogon |
| `Application` | The application that triggers the account login event, such as Office 15. |
| `Client` | Details about the client device, device OS, and device browser that was used for the of the account login event. |
| `LoginStatus` | This property is from OrgIdLogon.LoginStatus directly. The mapping of various interesting logon failures could be done by alerting algorithms. |
| `UserDomain` | The Tenant Identity Information (TII). | 


### Azure Active Directory

These records are created when change or additions are made to Azure Active Directory objects.

| Property | Description |
|:--- |:--- |
| OfficeWorkload | AzureActiveDirectory |
| RecordType     | AzureActiveDirectory |
| AADTarget | The user that the action (identified by the Operation property) was performed on. |
| Actor | The user or service principal that performed the action. |
| ActorContextId | The GUID of the organization that the actor belongs to. |
| ActorIpAddress | The actor's IP address in IPV4 or IPV6 address format. |
| InterSystemsId | The GUID that track the actions across components within the Office 365 service. |
| IntraSystemId |     The GUID that's generated by Azure Active Directory to track the action. |
| SupportTicketId | The customer support ticket ID for the action in "act-on-behalf-of" situations. |
| TargetContextId | The GUID of the organization that the targeted user belongs to. |


### Data Center Security

These records are created from Data Center Security audit data.  

| Property | Description |
|:--- |:--- |
| EffectiveOrganization | The name of the tenant that the elevation/cmdlet was targeted at. |
| ElevationApprovedTime | The timestamp for when the elevation was approved. |
| ElevationApprover | The name of a Microsoft manager. |
| ElevationDuration | The duration for which the elevation was active. |
| ElevationRequestId |     A unique identifier for the elevation request. |
| ElevationRole | The role the elevation was requested for. |
| ElevationTime | The start time of the elevation. |
| Start_Time | The start time of the cmdlet execution. |


### Exchange Admin

These records are created when changes are made to Exchange configuration.

| Property | Description |
|:--- |:--- |
| OfficeWorkload | Exchange |
| RecordType     | ExchangeAdmin |
| ExternalAccess |     Specifies whether the cmdlet was run by a user in your organization, by Microsoft datacenter personnel or a datacenter service account, or by a delegated administrator. The value False indicates that the cmdlet was run by someone in your organization. The value True indicates that the cmdlet was run by datacenter personnel, a datacenter service account, or a delegated administrator. |
| ModifiedObjectResolvedName |     This is the user friendly name of the object that was modified by the cmdlet. This is logged only if the cmdlet modifies the object. |
| OrganizationName | The name of the tenant. |
| OriginatingServer | The name of the server from which the cmdlet was executed. |
| Parameters | The name and value for all parameters that were used with the cmdlet that is identified in the Operations property. |


### Exchange Mailbox

These records are created when changes or additions are made to Exchange mailboxes.

| Property | Description |
|:--- |:--- |
| OfficeWorkload | Exchange |
| RecordType     | ExchangeItem |
| ClientInfoString | Information about the email client that was used to perform the operation, such as a browser version, Outlook version, and mobile device information. |
| Client_IPAddress | The IP address of the device that was used when the operation was logged. The IP address is displayed in either an IPv4 or IPv6 address format. |
| ClientMachineName | The machine name that hosts the Outlook client. |
| ClientProcessName | The email client that was used to access the mailbox. |
| ClientVersion | The version of the email client . |
| InternalLogonType | Reserved for internal use. |
| Logon_Type | Indicates the type of user who accessed the mailbox and performed the operation that was logged. |
| LogonUserDisplayName |     The user-friendly name of the user who performed the operation. |
| LogonUserSid | The SID of the user who performed the operation. |
| MailboxGuid | The Exchange GUID of the mailbox that was accessed. |
| MailboxOwnerMasterAccountSid | Mailbox owner account's master account SID. |
| MailboxOwnerSid | The SID of the mailbox owner. |
| MailboxOwnerUPN | The email address of the person who owns the mailbox that was accessed. |


### Exchange Mailbox Audit

These records are created when a mailbox audit entry is created.

| Property | Description |
|:--- |:--- |
| OfficeWorkload | Exchange |
| RecordType     | ExchangeItem |
| Item | Represents the item upon which the operation was performed | 
| SendAsUserMailboxGuid | The Exchange GUID of the mailbox that was accessed to send email as. |
| SendAsUserSmtp | SMTP address of the user who is being impersonated. |
| SendonBehalfOfUserMailboxGuid | The Exchange GUID of the mailbox that was accessed to send mail on behalf of. |
| SendOnBehalfOfUserSmtp | SMTP address of the user on whose behalf the email is sent. |


### Exchange Mailbox Audit Group

These records are created when changes or additions are made to Exchange groups.

| Property | Description |
|:--- |:--- |
| OfficeWorkload | Exchange |
| OfficeWorkload | ExchangeItemGroup |
| AffectedItems | Information about each item in the group. |
| CrossMailboxOperations | Indicates if the operation involved more than one mailbox. |
| DestMailboxId | Set only if the CrossMailboxOperations parameter is True. Specifies the target mailbox GUID. |
| DestMailboxOwnerMasterAccountSid | Set only if the CrossMailboxOperations parameter is True. Specifies the SID for the master account SID of the target mailbox owner. |
| DestMailboxOwnerSid | Set only if the CrossMailboxOperations parameter is True. Specifies the SID of the target mailbox. |
| DestMailboxOwnerUPN | Set only if the CrossMailboxOperations parameter is True. Specifies the UPN of the owner of the target mailbox. |
| DestFolder | The destination folder, for operations such as Move. |
| Folder | The folder where a group of items is located. |
| Folders |     Information about the source folders involved in an operation; for example, if folders are selected and then deleted. |


### SharePoint Base

These properties are common to all SharePoint records.

| Property | Description |
|:--- |:--- |
| OfficeWorkload | SharePoint |
| OfficeWorkload | SharePoint |
| EventSource | Identifies that an event occurred in SharePoint. Possible values are SharePoint or ObjectModel. |
| ItemType | The type of object that was accessed or modified. See the ItemType table for details on the types of objects. |
| MachineDomainInfo | Information about device sync operations. This information is reported only if it's present in the request. |
| MachineId |     Information about device sync operations. This information is reported only if it's present in the request. |
| Site_ | The GUID of the site where the file or folder accessed by the user is located. |
| Source_Name | The entity that triggered the audited operation. Possible values are SharePoint or ObjectModel. |
| UserAgent | Information about the user's client or browser. This information is provided by the client or browser. |


### SharePoint Schema

These records are created when configuration changes are made to SharePoint.

| Property | Description |
|:--- |:--- |
| OfficeWorkload | SharePoint |
| OfficeWorkload | SharePoint |
| CustomEvent | Optional string for custom events. |
| Event_Data |     Optional payload for custom events. |
| ModifiedProperties | The property is included for admin events, such as adding a user as a member of a site or a site collection admin group. The property includes the name of the property that was modified (for example, the Site Admin group), the new value of the modified property (such the user who was added as a site admin), and the previous value of the modified object. |


### SharePoint File Operations

These records are created in response to file operations in SharePoint.

| Property | Description |
|:--- |:--- |
| OfficeWorkload | SharePoint |
| OfficeWorkload | SharePointFileOperation |
| DestinationFileExtension | The file extension of a file that is copied or moved. This property is displayed only for FileCopied and FileMoved events. |
| DestinationFileName | The name of the file that is copied or moved. This property is displayed only for FileCopied and FileMoved events. |
| DestinationRelativeUrl | The URL of the destination folder where a file is copied or moved. The combination of the values for SiteURL, DestinationRelativeURL, and DestinationFileName parameters is the same as the value for the ObjectID property, which is the full path name for the file that was copied. This property is displayed only for FileCopied and FileMoved events. |
| SharingType | The type of sharing permissions that were assigned to the user that the resource was shared with. This user is identified by the UserSharedWith parameter. |
| Site_Url | The URL of the site where the file or folder accessed by the user is located. |
| SourceFileExtension | The file extension of the file that was accessed by the user. This property is blank if the object that was accessed is a folder. |
| SourceFileName |     The name of the file or folder accessed by the user. |
| SourceRelativeUrl | The URL of the folder that contains the file accessed by the user. The combination of the values for the SiteURL, SourceRelativeURL, and SourceFileName parameters is the same as the value for the ObjectID property, which is the full path name for the file accessed by the user. |
| UserSharedWith |     The user that a resource was shared with. |




## Sample log queries

The following table provides sample log queries for update records collected by this solution.

| Query | Description |
| --- | --- |
|Count of all the operations on your Office 365 subscription |OfficeActivity &#124; summarize count() by Operation |
|Usage of SharePoint sites|OfficeActivity &#124; where OfficeWorkload =~ "sharepoint" &#124; summarize count() by SiteUrl \| sort by Count asc|
|File access operations by user type | OfficeActivity &#124; summarize count() by UserType |
|Monitor external actions on Exchange|OfficeActivity &#124; where OfficeWorkload =~ "exchange" and ExternalAccess == true|



## Next steps

* Use [log queries in Azure Monitor](../log-query/log-query-overview.md) to view detailed update data.
* [Create your own dashboards](../learn/tutorial-logs-dashboards.md) to display your favorite Office 365 search queries.
* [Create alerts](../platform/alerts-overview.md) to be proactively notified of important Office 365 activities.  
