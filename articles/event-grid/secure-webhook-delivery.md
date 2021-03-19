---
title: Secure WebHook delivery with Azure AD in Azure Event Grid
description: Describes how to deliver events to HTTPS endpoints protected by Azure Active Directory using Azure Event Grid
ms.topic: how-to
ms.date: 02/03/2021
---

# Publish events to Azure Active Directory protected endpoints

This article describes how to take advantage of Azure Active Directory to secure the connection between your Event Subscription and your webhook endpoint. For an overview of Azure AD Applications and service principals, see [Microsoft identity platform (v2.0) overview](../active-directory/develop/v2-overview.md).

This article uses the Azure portal for demonstration, however the feature can also be enabled using CLI, PowerShell, or the SDKs.


## Create an Azure AD Application

Begin by creating an Azure AD Application for your protected endpoint. See https://docs.microsoft.com/azure/active-directory/develop/scenario-protected-web-api-overview.
    - Configure your protected API to be called by a daemon app.
    
## Enable Event Grid to use your Azure AD Application
This section shows you how to enable Event Grid to use your Azure AD application. 

> [!NOTE]
> You must be a member of the [Azure AD Application Administrator role](../active-directory/roles/permissions-reference.md#all-roles) to execute this script.

### Connect to your Azure tenant
First, connect to your Azure tenant using the `Connect-AzureAD` command. 

```PowerShell
# This is your Tenant Id. 
$myTenantId = "<the Tenant Id of your Azure AD Application>"
Connect-AzureAD -TenantId $myTenantId
```

### Create Microsoft.EventGrid service principal
Run the following script to create the service principal for **Microsoft.EventGrid** if it doesn't already exist. 

```PowerShell
# This is the "Azure Event Grid" Azure Active Directory AppId
$eventGridAppId = "4962773b-9cdb-44cf-a8bf-237846a00ab7"
    
$eventGridSP = Get-AzureADServicePrincipal -Filter ("appId eq '" + $eventGridAppId + "'")

# Create the service principal if it doesn't exist
if ($eventGridSP -match "Microsoft.EventGrid")
{
    Write-Host "The Service principal is already defined.`n"
} else
{
    # Create a service principal for the "Azure Event Grid" Azure AD Application and add it to the role
    $eventGridSP = New-AzureADServicePrincipal -AppId $eventGridAppId
}
```

### Create a role for your application   
Run the following script to create a role for your Azure AD application. In this example, the role name is: **AzureEventGridSecureWebhook**. Modify the PowerShell script's `$myTenantId` to use your Azure AD Tenant ID, and `$myAzureADApplicationObjectId` with the Object ID of your Azure AD Application

```PowerShell
# This is your Azure AD Application's ObjectId. 
$myAzureADApplicationObjectId = "<the Object Id of your Azure AD Application>"
    
# This is the name of the new role we will add to your Azure AD Application
$eventGridRoleName = "AzureEventGridSecureWebhook"
    
# Create an application role of given name and description
Function CreateAppRole([string] $Name, [string] $Description)
{
    $appRole = New-Object Microsoft.Open.AzureAD.Model.AppRole
    $appRole.AllowedMemberTypes = New-Object System.Collections.Generic.List[string]
    $appRole.AllowedMemberTypes.Add("Application");
    $appRole.DisplayName = $Name
    $appRole.Id = New-Guid
    $appRole.IsEnabled = $true
    $appRole.Description = $Description
    $appRole.Value = $Name;
    return $appRole
}

# Get my Azure AD Application, it's roles and service principal
$myApp = Get-AzureADApplication -ObjectId $myAzureADApplicationObjectId
$myAppRoles = $myApp.AppRoles

Write-Host "App Roles before addition of new role.."
Write-Host $myAppRoles
    
# Create the role if it doesn't exist
if ($myAppRoles -match $eventGridRoleName)
{
    Write-Host "The Azure Event Grid role is already defined.`n"
    $myServicePrincipal = Get-AzureADServicePrincipal -Filter ("appId eq '" + $myApp.AppId + "'")
} else
{
    $myServicePrincipal = Get-AzureADServicePrincipal -Filter ("appId eq '" + $myApp.AppId + "'")
    
    # Add our new role to the Azure AD Application
    $newRole = CreateAppRole -Name $eventGridRoleName -Description "Azure Event Grid Role"
    $myAppRoles.Add($newRole)
    Set-AzureADApplication -ObjectId $myApp.ObjectId -AppRoles $myAppRoles
}

# print application's roles
Write-Host "My Azure AD Application's Roles: "
Write-Host $myAppRoles
```

### Add Event Grid service principal to the role    
Now, run the `New-AzureADServiceAppRoleAssignment` command to assign Event Grid service principal to the role you created in the previous step. 

```powershell
New-AzureADServiceAppRoleAssignment -Id $myApp.AppRoles[0].Id -ResourceId $myServicePrincipal.ObjectId -ObjectId $eventGridSP.ObjectId -PrincipalId $eventGridSP.ObjectId
```

Run the following commands to output information that you will use the next steps. 

```powershell    
Write-Host "My Azure AD Tenant Id: $myTenantId"
Write-Host "My Azure AD Application Id: $($myApp.AppId)"
Write-Host "My Azure AD Application ObjectId: $($myApp.ObjectId)"
```
    
## Configure the event subscription

In the creation flow for your event subscription, select endpoint type 'Web Hook'. Once you've given your endpoint URI, click on the additional features tab at the top of the create event subscriptions blade.

![Select endpoint type webhook](./media/secure-webhook-delivery/select-webhook.png)

In the additional features tab, check the box for 'Use AAD authentication' and configure the Tenant ID and Application ID:

* Copy the Azure AD Tenant ID from the output of the script and enter it in the AAD Tenant ID field.
* Copy the Azure AD Application ID from the output of the script and enter it in the AAD Application ID field.

    ![Secure Webhook action](./media/secure-webhook-delivery/aad-configuration.png)

## Next steps

* For information about monitoring event deliveries, see [Monitor Event Grid message delivery](monitor-event-delivery.md).
* For more information about the authentication key, see [Event Grid security and authentication](security-authentication.md).
* For more information about creating an Azure Event Grid subscription, see [Event Grid subscription schema](subscription-creation-schema.md).
