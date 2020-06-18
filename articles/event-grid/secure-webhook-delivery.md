---
title: Secure WebHook delivery with Azure AD in Azure Event Grid
description: Describes how to deliver events to HTTPS endpoints protected by Azure Active Directory using Azure Event Grid
services: event-grid
author: femila

ms.service: event-grid
ms.topic: conceptual
ms.date: 11/18/2019
ms.author: femila
---

# Publish events to Azure Active Directory protected endpoints

This article describes how to take advantage of Azure Active Directory to secure the connection between your Event Subscription and your webhook endpoint. For an overview of Azure AD Applications and service principals, see [Microsoft identity platform (v2.0) overview](https://docs.microsoft.com/azure/active-directory/develop/v2-overview).

This article uses the Azure portal for demonstration, however the feature can also be enabled using CLI, PowerShell, or the SDKs.

[!INCLUDE [event-grid-preview-feature-note.md](../../includes/event-grid-preview-feature-note.md)]

## Create an Azure AD Application

Begin by creating an Azure AD Application for your protected endpoint. See https://docs.microsoft.com/azure/active-directory/develop/scenario-protected-web-api-overview.
    - Configure your protected API to be called by a daemon app.
    
## Enable Event Grid to use your Azure AD Application

Use the PowerShell script below in order to create a role and service principle in your Azure AD Application. You will need the Tenant ID and Object ID from your Azure AD Application:

   > [!NOTE]
   > You must be a member of the [Azure AD Application Administrator role](https://docs.microsoft.com/azure/active-directory/users-groups-roles/directory-assign-admin-roles#available-roles) to execute this script.
    
1. Modify the PowerShell script's $myTenantId to use your Azure AD Tenant ID.
1. Modify the PowerShell script's $myAzureADApplicationObjectId to use the Object ID of your Azure AD Application
1. Run the modified script.

```PowerShell
# This is your Tenant Id. 
$myTenantId = "<the Tenant Id of your Azure AD Application>"

Connect-AzureAD -TenantId $myTenantId
    
# This is your Azure AD Application's ObjectId. 
$myAzureADApplicationObjectId = "<the Object Id of your Azure AD Application>"
    
# This is the "Azure Event Grid" Azure Active Directory AppId
$eventGridAppId = "4962773b-9cdb-44cf-a8bf-237846a00ab7"
    
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
$eventGridSP = Get-AzureADServicePrincipal -Filter ("appId eq '" + $eventGridAppId + "'")

Write-Host "App Roles before addition of new role.."
Write-Host $myAppRoles
    
# Create the role if it doesn't exist
if ($myAppRoles -match $eventGridRoleName)
{
    Write-Host "The Azure Event Grid role is already defined.`n"
}
else
{
    $myServicePrincipal = Get-AzureADServicePrincipal -Filter ("appId eq '" + $myApp.AppId + "'")
    
    # Add our new role to the Azure AD Application
    $newRole = CreateAppRole -Name $eventGridRoleName -Description "Azure Event Grid Role"
    $myAppRoles.Add($newRole)
    Set-AzureADApplication -ObjectId $myApp.ObjectId -AppRoles $myAppRoles
}
    
# Create the service principal if it doesn't exist
if ($eventGridSP -match "Microsoft.EventGrid")
{
    Write-Host "The Service principal is already defined.`n"
}
else
{
    # Create a service principal for the "Azure Event Grid" Azure AD Application and add it to the role
    $eventGridSP = New-AzureADServicePrincipal -AppId $eventGridAppId
}
    
New-AzureADServiceAppRoleAssignment -Id $myApp.AppRoles[0].Id -ResourceId $myServicePrincipal.ObjectId -ObjectId $eventGridSP.ObjectId -PrincipalId $eventGridSP.ObjectId
    
Write-Host "My Azure AD Tenant Id: $myTenantId"
Write-Host "My Azure AD Application Id: $($myApp.AppId)"
Write-Host "My Azure AD Application ObjectId: $($myApp.ObjectId)"
Write-Host "My Azure AD Application's Roles: "
Write-Host $myApp.AppRoles
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
