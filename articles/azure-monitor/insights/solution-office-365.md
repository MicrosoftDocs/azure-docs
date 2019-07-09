---
title: Office 365 management solution in Azure | Microsoft Docs
description: This article provides details on configuration and use of the Office 365 solution in Azure.  It includes detailed description of the Office 365 records created in Azure Monitor.
services: operations-management-suite
documentationcenter: ''
author: bwren
manager: carmonm
editor: ''
ms.service: azure-monitor
ms.workload: tbd
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 07/01/2019
ms.author: bwren
---
# Office 365 management solution in Azure (Preview)

![Office 365 logo](media/solution-office-365/icon.png)


> [!NOTE]
> The recommended method to install and configure the Office 365 solution is enabling the [Office 365 connector](../../sentinel/connect-office-365.md) in [Azure Sentinel](../../sentinel/overview.md) instead of using the steps in this article. This is an updated version of the Office 365 solution with an improved configuration experience. To connect Azure AD logs, you can use either the [Azure Sentinel Azure AD connector](../../sentinel/connect-azure-active-directory.md) or [configure Azure AD diagnostic settings](../../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md), which provides richer log data than the Office 365 management logs. 
>
> When you [onboard Azure Sentinel](../../sentinel/quickstart-onboard.md), specify the Log Analytics workspace  that you want the Office 365 solution installed in. Once you enable the connector, the solution will be available in the workspace and used exactly the same as any other monitoring solutions you have installed.
>
> Users of the Azure government cloud must install the Office 365 using the steps in this article since Azure Sentinel is not yet available in the government cloud.

The Office 365 management solution allows you to monitor your Office 365 environment in Azure Monitor.

- Monitor user activities on your Office 365 accounts to analyze usage patterns as well as identify behavioral trends. For example, you can extract specific usage scenarios, such as files that are shared outside your organization or the most popular SharePoint sites.
- Monitor administrator activities to track configuration changes or high privilege operations.
- Detect and investigate unwanted user behavior, which can be customized for your organizational needs.
- Demonstrate audit and compliance. For example, you can monitor file access operations on confidential files, which can help you with the audit and compliance process.
- Perform operational troubleshooting by using [log queries](../log-query/log-query-overview.md) on top of Office 365 activity data of your organization.


[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Prerequisites

The following is required prior to this solution being installed and configured.

- Organizational Office 365 subscription.
- Credentials for a user account that is a Global Administrator.
- To receive audit data, you must [configure auditing](https://support.office.com/article/Search-the-audit-log-in-the-Office-365-Security-Compliance-Center-0d4d0f35-390b-4518-800e-0c7ec95e946c?ui=en-US&rs=en-US&ad=US#PickTab=Before_you_begin) in your Office 365 subscription.  Note that [mailbox auditing](https://technet.microsoft.com/library/dn879651.aspx) is configured separately.  You can still install the solution and collect other data if auditing is not configured.
 

## Management packs

This solution does not install any management packs in [connected management groups](../platform/om-agents.md).
  

## Install and configure

Start by adding the [Office 365 solution to your subscription](solutions.md#install-a-monitoring-solution). Once it's added, you must perform the configuration steps in this section to give it access to your Office 365 subscription.

### Required information

Before you start this procedure, gather the following information.

From your Log Analytics workspace:

- Workspace name: The workspace where the Office 365 data will be collected.
- Resource group name: The resource group that contains the workspace.
- Azure subscription ID: The subscription that contains the workspace.

From your Office 365 subscription:

- Username: Email address of an administrative account.
- Tenant ID: Unique ID for Office 365 subscription.
- Client ID: 16-character string that represents Office 365 client.
- Client Secret: Encrypted string necessary for authentication.

### Create an Office 365 application in Azure Active Directory

The first step is to create an application in Azure Active Directory that the management solution will use to access your Office 365 solution.

1. Log in to the Azure portal at [https://portal.azure.com](https://portal.azure.com/).
1. Select **Azure Active Directory** and then **App registrations**.
1. Click **New application registration**.

    ![Add app registration](media/solution-office-365/add-app-registration.png)
1. Enter an application **Name** and **Sign-on URL**.  The name should be descriptive.  Use `http://localhost` for the URL, and keep _Web app / API_ for the **Application type**
    
    ![Create application](media/solution-office-365/create-application.png)
1. Click **Create** and validate the application information.

    ![Registered app](media/solution-office-365/registered-app.png)

### Configure application for Office 365

1. Click **Settings** to open the **Settings** menu.
1. Select **Properties**. Change **Multi-tenanted** to _Yes_.

    ![Settings multitenant](media/solution-office-365/settings-multitenant.png)

1. Select **Required permissions** in the **Settings** menu and then click **Add**.
1. Click **Select an API** and then **Office 365 Management APIs**. click **Office 365 Management APIs**. Click **Select**.

    ![Select API](media/solution-office-365/select-api.png)

1. Under **Select permissions** select the following options for both **Application permissions** and **Delegated permissions**:
   - Read service health information for your organization
   - Read activity data for your organization
   - Read activity reports for your organization

     ![Select API](media/solution-office-365/select-permissions.png)

1. Click **Select** and then **Done**.
1. Click **Grant permissions** and then click **Yes** when asked for verification.

    ![Grant permissions](media/solution-office-365/grant-permissions.png)

### Add a key for the application

1. Select **Keys** in the **Settings** menu.
1. Type in a **Description** and **Duration** for the new key.
1. Click **Save** and then copy the **Value** that's generated.

    ![Keys](media/solution-office-365/keys.png)

### Add admin consent

To enable the administrative account for the first time, you must provide administrative consent for the application. You can do this with a PowerShell script. 

1. Save the following script as *office365_consent.ps1*.

    ```powershell
    param (
        [Parameter(Mandatory=$True)][string]$WorkspaceName,     
        [Parameter(Mandatory=$True)][string]$ResourceGroupName,
        [Parameter(Mandatory=$True)][string]$SubscriptionId
    )
    
    $option = [System.StringSplitOptions]::RemoveEmptyEntries 
    
    IF ($Subscription -eq $null)
        {Login-AzAccount -ErrorAction Stop}
    $Subscription = (Select-AzSubscription -SubscriptionId $($SubscriptionId) -ErrorAction Stop)
    $Subscription
    $Workspace = (Set-AzOperationalInsightsWorkspace -Name $($WorkspaceName) -ResourceGroupName $($ResourceGroupName) -ErrorAction Stop)
    $WorkspaceLocation= $Workspace.Location
    $WorkspaceLocation
    
    Function AdminConsent{
    
    $domain='login.microsoftonline.com'
    switch ($WorkspaceLocation.Replace(" ","").ToLower()) {
           "eastus"   {$OfficeAppClientId="d7eb65b0-8167-4b5d-b371-719a2e5e30cc"; break}
           "westeurope"   {$OfficeAppClientId="c9005da2-023d-40f1-a17a-2b7d91af4ede"; break}
           "southeastasia"   {$OfficeAppClientId="09c5b521-648d-4e29-81ff-7f3a71b27270"; break}
           "australiasoutheast"  {$OfficeAppClientId="f553e464-612b-480f-adb9-14fd8b6cbff8"; break}   
           "westcentralus"  {$OfficeAppClientId="98a2a546-84b4-49c0-88b8-11b011dc8c4e"; break}
           "japaneast"   {$OfficeAppClientId="b07d97d3-731b-4247-93d1-755b5dae91cb"; break}
           "uksouth"   {$OfficeAppClientId="f232cf9b-e7a9-4ebb-a143-be00850cd22a"; break}
           "centralindia"   {$OfficeAppClientId="ffbd6cf4-cba8-4bea-8b08-4fb5ee2a60bd"; break}
           "canadacentral"  {$OfficeAppClientId="c2d686db-f759-43c9-ade5-9d7aeec19455"; break}
           "eastus2"  {$OfficeAppClientId="7eb65b0-8167-4b5d-b371-719a2e5e30cc"; break}
           "westus2"  {$OfficeAppClientId="98a2a546-84b4-49c0-88b8-11b011dc8c4e"; break} #Need to check
           "usgovvirginia" {$OfficeAppClientId="c8b41a87-f8c5-4d10-98a4-f8c11c3933fe"; 
                             $domain='login.microsoftonline.us'; break}
           default {$OfficeAppClientId="55b65fb5-b825-43b5-8972-c8b6875867c1";
                    $domain='login.windows-ppe.net'; break} #Int
        }
    
        $domain
        Start-Process -FilePath  "https://$($domain)/common/adminconsent?client_id=$($OfficeAppClientId)&state=12345"
    }
    
    AdminConsent -ErrorAction Stop
    ```

2. Run the script with the following command. You will be prompted twice for credentials. Provide the credentials for your Log Analytics workspace first and then the global admin credentials for your Office 365 tenant.

    ```
    .\office365_consent.ps1 -WorkspaceName <Workspace name> -ResourceGroupName <Resource group name> -SubscriptionId <Subscription ID>
    ```

    Example:

    ```
    .\office365_consent.ps1 -WorkspaceName MyWorkspace -ResourceGroupName MyResourceGroup -SubscriptionId '60b79d74-f4e4-4867-b631- yyyyyyyyyyyy'
    ```

1. You will be presented with a window similar to the one below. Click **Accept**.
    
    ![Admin consent](media/solution-office-365/admin-consent.png)

### Subscribe to Log Analytics workspace

The last step is to subscribe the application to your Log Analytics workspace. You also do this with a PowerShell script.

1. Save the following script as *office365_subscription.ps1*.

    ```powershell
    param (
        [Parameter(Mandatory=$True)][string]$WorkspaceName,
        [Parameter(Mandatory=$True)][string]$ResourceGroupName,
        [Parameter(Mandatory=$True)][string]$SubscriptionId,
        [Parameter(Mandatory=$True)][string]$OfficeUsername,
        [Parameter(Mandatory=$True)][string]$OfficeTennantId,
        [Parameter(Mandatory=$True)][string]$OfficeClientId,
        [Parameter(Mandatory=$True)][string]$OfficeClientSecret
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
    $OfficeClientSecret =[uri]::EscapeDataString($OfficeClientSecret)
    
    # Client ID for Azure PowerShell
    $clientId = "1950a258-227b-4e31-a9cf-717495945fc2"
    # Set redirect URI for Azure PowerShell
    $redirectUri = "urn:ietf:wg:oauth:2.0:oob"
    $domain='login.microsoftonline.com'
    $adTenant = $Subscription[0].Tenant.Id
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
    $global:authResultARM = $authContext.AcquireToken($resourceAppIdURIARM, $clientId, $redirectUri, "Auto")
    $authHeader = $global:authResultARM.CreateAuthorizationHeader()
    $authHeader
    }
    
    Function Failure {
    $line
    $formatstring = "{0} : {1}`n{2}`n" +
                    "    + CategoryInfo          : {3}`n" +
                    "    + FullyQualifiedErrorId : {4}`n"
    $fields = $_.InvocationInfo.MyCommand.Name,
              $_.ErrorDetails.Message,
              $_.InvocationInfo.PositionMessage,
              $_.CategoryInfo.ToString(),
              $_.FullyQualifiedErrorId
    
    $formatstring -f $fields
    $_.Exception.Response
    
    $line
    break
    }
    
    Function Connection-API
    {
    $authHeader = $global:authResultARM.CreateAuthorizationHeader()
    $ResourceName = "https://manage.office.com"
    $SubscriptionId   =  $Subscription[0].Subscription.Id
    
    $line
    $connectionAPIUrl = $ARMResource + 'subscriptions/' + $SubscriptionId + '/resourceGroups/' + $ResourceGroupName + '/providers/Microsoft.OperationalInsights/workspaces/' + $WorkspaceName + '/connections/office365connection_' + $SubscriptionId + $OfficeTennantId + '?api-version=2017-04-26-preview'
    $connectionAPIUrl
    $line
    
    $xms_client_tenant_Id ='1da8f770-27f4-4351-8cb3-43ee54f14759'
    
    $BodyString = "{
                    'properties': {
                                    'AuthProvider':'Office365',
                                    'clientId': '" + $OfficeClientId + "',
                                    'clientSecret': '" + $OfficeClientSecret + "',
                                    'Username': '" + $OfficeUsername   + "',
                                    'Url': 'https://$($domain)/" + $OfficeTennantId + "/oauth2/token',
                                  },
                    'etag': '*',
                    'kind': 'Connection',
                    'solution': 'Connection',
                   }"
    
    $params = @{
        ContentType = 'application/json'
        Headers = @{
        'Authorization'="$($authHeader)"
        'x-ms-client-tenant-id'=$xms_client_tenant_Id #Prod-'1da8f770-27f4-4351-8cb3-43ee54f14759'
        'Content-Type' = 'application/json'
        }
        Body = $BodyString
        Method = 'Put'
        URI = $connectionAPIUrl
    }
    $response = Invoke-WebRequest @params 
    $response
    $line
    
    }
    
    Function Office-Subscribe-Call{
    try{
    #----------------------------------------------------------------------------------------------------------------------------------------------
    $authHeader = $global:authResultARM.CreateAuthorizationHeader()
    $SubscriptionId   =  $Subscription[0].Subscription.Id
    $OfficeAPIUrl = $ARMResource + 'subscriptions/' + $SubscriptionId + '/resourceGroups/' + $ResourceGroupName + '/providers/Microsoft.OperationalInsights/workspaces/' + $WorkspaceName + '/datasources/office365datasources_' + $SubscriptionId + $OfficeTennantId + '?api-version=2015-11-01-preview'
    
    $OfficeBodyString = "{
                    'properties': {
                                    'AuthProvider':'Office365',
                                    'office365TenantID': '" + $OfficeTennantId + "',
                                    'connectionID': 'office365connection_" + $SubscriptionId + $OfficeTennantId + "',
                                    'office365AdminUsername': '" + $OfficeUsername + "',
                                    'contentTypes':'Audit.Exchange,Audit.AzureActiveDirectory,Audit.SharePoint'
                                  },
                    'etag': '*',
                    'kind': 'Office365',
                    'solution': 'Office365',
                   }"
    
    $Officeparams = @{
        ContentType = 'application/json'
        Headers = @{
        'Authorization'="$($authHeader)"
        'x-ms-client-tenant-id'=$xms_client_tenant_Id
        'Content-Type' = 'application/json'
        }
        Body = $OfficeBodyString
        Method = 'Put'
        URI = $OfficeAPIUrl
      }
    
    $officeresponse = Invoke-WebRequest @Officeparams 
    $officeresponse
    }
    catch{ Failure }
    }
    
    #GetDetails 
    RESTAPI-Auth -ErrorAction Stop
    Connection-API -ErrorAction Stop
    Office-Subscribe-Call -ErrorAction Stop
    ```

2. Run the script with the following command:

    ```
    .\office365_subscription.ps1 -WorkspaceName <Log Analytics workspace name> -ResourceGroupName <Resource Group name> -SubscriptionId <Subscription ID> -OfficeUsername <OfficeUsername> -OfficeTennantID <Tenant ID> -OfficeClientId <Client ID> -OfficeClientSecret <Client secret>
    ```

    Example:

    ```powershell
    .\office365_subscription.ps1 -WorkspaceName MyWorkspace -ResourceGroupName MyResourceGroup -SubscriptionId '60b79d74-f4e4-4867-b631-yyyyyyyyyyyy' -OfficeUsername 'admin@contoso.com' -OfficeTennantID 'ce4464f8-a172-4dcf-b675-xxxxxxxxxxxx' -OfficeClientId 'f8f14c50-5438-4c51-8956-zzzzzzzzzzzz' -OfficeClientSecret 'y5Lrwthu6n5QgLOWlqhvKqtVUZXX0exrA2KRHmtHgQb='
    ```

### Troubleshooting

You may see the following error if your application is already subscribed to this workspace or if this tenant is subscribed to another workspace.

```Output
Invoke-WebRequest : {"Message":"An error has occurred."}
At C:\Users\v-tanmah\Desktop\ps scripts\office365_subscription.ps1:161 char:19
+ $officeresponse = Invoke-WebRequest @Officeparams
+                   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : InvalidOperation: (System.Net.HttpWebRequest:HttpWebRequest) [Invoke-WebRequest], WebException
    + FullyQualifiedErrorId : WebCmdletWebResponseException,Microsoft.PowerShell.Commands.InvokeWebRequestCommand 
```

You may see the following error if invalid parameter values are provided.

```Output
Select-AzSubscription : Please provide a valid tenant or a valid subscription.
At line:12 char:18
+ ... cription = (Select-AzSubscription -SubscriptionId $($Subscriptio ...
+                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : CloseError: (:) [Set-AzContext], ArgumentException
    + FullyQualifiedErrorId : Microsoft.Azure.Commands.Profile.SetAzContextCommand

```

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
    $global:authResultARM = $authContext.AcquireToken($resourceAppIdURIARM, $clientId, $redirectUri, "Auto")
    $authHeader = $global:authResultARM.CreateAuthorizationHeader()
    $authHeader
    }
    
    Function Office-UnSubscribe-Call{
    
    #----------------------------------------------------------------------------------------------------------------------------------------------
    $authHeader = $global:authResultARM.CreateAuthorizationHeader()
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

## Data collection

### Supported agents

The Office 365 solution doesn't retrieve data from any of the [Log Analytics agents](../platform/agent-data-sources.md).  It retrieves data directly from Office 365.

### Collection frequency

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
| SharePoint | Shows the top activities that users perform on SharePoint documents. When you drill down from this tile, the search page shows the details of these activities, such as the target document and the location of this activity. For example, for a File Accessed event, you will be able to see the document that’s being accessed, its associated account name, and IP address. |
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
| OfficeWorkload | AzureActiveDirectory |
| RecordType     | AzureActiveDirectoryAccountLogon |
| Application | The application that triggers the account login event, such as Office 15. |
| Client | Details about the client device, device OS, and device browser that was used for the of the account login event. |
| LoginStatus | This property is from OrgIdLogon.LoginStatus directly. The mapping of various interesting logon failures could be done by alerting algorithms. |
| UserDomain | The Tenant Identity Information (TII). | 


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
| IntraSystemId | 	The GUID that's generated by Azure Active Directory to track the action. |
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
| ElevationRequestId | 	A unique identifier for the elevation request. |
| ElevationRole | The role the elevation was requested for. |
| ElevationTime | The start time of the elevation. |
| Start_Time | The start time of the cmdlet execution. |


### Exchange Admin

These records are created when changes are made to Exchange configuration.

| Property | Description |
|:--- |:--- |
| OfficeWorkload | Exchange |
| RecordType     | ExchangeAdmin |
| ExternalAccess | 	Specifies whether the cmdlet was run by a user in your organization, by Microsoft datacenter personnel or a datacenter service account, or by a delegated administrator. The value False indicates that the cmdlet was run by someone in your organization. The value True indicates that the cmdlet was run by datacenter personnel, a datacenter service account, or a delegated administrator. |
| ModifiedObjectResolvedName | 	This is the user friendly name of the object that was modified by the cmdlet. This is logged only if the cmdlet modifies the object. |
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
| LogonUserDisplayName | 	The user-friendly name of the user who performed the operation. |
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
| Folders | 	Information about the source folders involved in an operation; for example, if folders are selected and then deleted. |


### SharePoint Base

These properties are common to all SharePoint records.

| Property | Description |
|:--- |:--- |
| OfficeWorkload | SharePoint |
| OfficeWorkload | SharePoint |
| EventSource | Identifies that an event occurred in SharePoint. Possible values are SharePoint or ObjectModel. |
| ItemType | The type of object that was accessed or modified. See the ItemType table for details on the types of objects. |
| MachineDomainInfo | Information about device sync operations. This information is reported only if it's present in the request. |
| MachineId | 	Information about device sync operations. This information is reported only if it's present in the request. |
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
| Event_Data | 	Optional payload for custom events. |
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
| SourceFileName | 	The name of the file or folder accessed by the user. |
| SourceRelativeUrl | The URL of the folder that contains the file accessed by the user. The combination of the values for the SiteURL, SourceRelativeURL, and SourceFileName parameters is the same as the value for the ObjectID property, which is the full path name for the file accessed by the user. |
| UserSharedWith | 	The user that a resource was shared with. |




## Sample log searches

The following table provides sample log searches for update records collected by this solution.

| Query | Description |
| --- | --- |
|Count of all the operations on your Office 365 subscription |OfficeActivity &#124; summarize count() by Operation |
|Usage of SharePoint sites|OfficeActivity &#124; where OfficeWorkload =~ "sharepoint" &#124; summarize count() by SiteUrl \| sort by Count asc|
|File access operations by user type|search in (OfficeActivity) OfficeWorkload =~ "azureactivedirectory" and "MyTest"|
|Search with a specific keyword|Type=OfficeActivity OfficeWorkload=azureactivedirectory "MyTest"|
|Monitor external actions on Exchange|OfficeActivity &#124; where OfficeWorkload =~ "exchange" and ExternalAccess == true|



## Next steps

* Use [log queries in Azure Monitor](../log-query/log-query-overview.md) to view detailed update data.
* [Create your own dashboards](../learn/tutorial-logs-dashboards.md) to display your favorite Office 365 search queries.
* [Create alerts](../platform/alerts-overview.md) to be proactively notified of important Office 365 activities.  