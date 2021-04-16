---
title: Secure WebHook delivery with Azure AD in Azure Event Grid
description: Describes how to deliver events to HTTPS endpoints protected by Azure Active Directory using Azure Event Grid
ms.topic: how-to
ms.date: 04/13/2021
---

# Publish events to Azure Active Directory protected endpoints
This article describes how to use Azure Active Directory (Azure AD) to secure the connection between your **event subscription** and your **webhook endpoint**. For an overview of Azure AD applications and service principals, see [Microsoft identity platform (v2.0) overview](../active-directory/develop/v2-overview.md).

This article uses the Azure portal for demonstration, however the feature can also be enabled using CLI, PowerShell, or the SDKs.

> [!IMPORTANT]
> Additional access check has been introduced as part of create or update of event subscription on March 30, 2021 to address a security vulnerability. The subscriber client's service principal needs to be either an owner or have a role assigned on the destination application service principal. Please reconfigure your AAD Application following the new instructions below.


## Create an Azure AD Application
Register your Webhook with Azure AD by creating an Azure AD application for your protected endpoint. See [Scenario: Protected web API](https://docs.microsoft.com/azure/active-directory/develop/scenario-protected-web-api-overview). Configure your protected API to be called by a daemon app.
    
## Enable Event Grid to use your Azure AD Application
This section shows you how to enable Event Grid to use your Azure AD application. 

> [!NOTE]
> You must be a member of the [Azure AD Application Administrator role](../active-directory/roles/permissions-reference.md#all-roles) to execute this script.

### Connect to your Azure tenant
First, connect to your Azure tenant using the `Connect-AzureAD` command. 

```PowerShell
$myWebhookAadTenantId = "<Your Webhook's Azure AD tenant id>"

Connect-AzureAD -TenantId $myWebhookAadTenantId
```

### Create Microsoft.EventGrid service principal
Run the following script to create the service principal for **Microsoft.EventGrid** if it doesn't already exist. 

```PowerShell
# This is the "Azure Event Grid" Azure Active Directory (AAD) AppId
$eventGridAppId = "4962773b-9cdb-44cf-a8bf-237846a00ab7"

# Create the "Azure Event Grid" AAD Application service principal if it doesn't exist
$eventGridSP = Get-AzureADServicePrincipal -Filter ("appId eq '" + $eventGridAppId + "'")
if ($eventGridSP -match "Microsoft.EventGrid")
{
    Write-Host "The Service principal is already defined.`n"
} else {
    # Create a service principal for the "Azure Event Grid" AAD Application and add it to the role
    Write-Host "Creating the Azure Event Grid service principal"
    $eventGridSP = New-AzureADServicePrincipal -AppId $eventGridAppId
}
```

### Create a role for your application   
Run the following script to create a role for your Azure AD application. In this example, the role name is: **AzureEventGridSecureWebhookSubscriber**. Modify the PowerShell script's `$myTenantId` to use your Azure AD Tenant ID, and `$myAzureADApplicationObjectId` with the Object ID of your Azure AD Application

```PowerShell
# This is your Webhook's Azure AD Application's ObjectId. 
$myWebhookAadApplicationObjectId = "<Your webhook's aad application object id>"

# This is the name of the new role we will add to your Azure AD Application
$eventGridRoleName = "AzureEventGridSecureWebhookSubscriber"
       
# Create an application role of given name and description
Function CreateAppRole([string] $Name, [string] $Description)
{
    $appRole = New-Object Microsoft.Open.AzureAD.Model.AppRole
    $appRole.AllowedMemberTypes = New-Object System.Collections.Generic.List[string]
    $appRole.AllowedMemberTypes.Add("Application");
    $appRole.AllowedMemberTypes.Add("User");
    $appRole.DisplayName = $Name
    $appRole.Id = New-Guid
    $appRole.IsEnabled = $true
    $appRole.Description = $Description
    $appRole.Value = $Name;
    return $appRole
}
       
# Get my Azure AD Application, it's roles and service principal
$myApp = Get-AzureADApplication -ObjectId $myWebhookAadApplicationObjectId
$myAppRoles = $myApp.AppRoles

Write-Host "App Roles before addition of new role.."
Write-Host $myAppRoles
       
# Create the role if it doesn't exist
if ($myAppRoles -match $eventGridRoleName)
{
    Write-Host "The Azure Event Grid role is already defined.`n"
} else {      
    # Add our new role to the Azure AD Application
    Write-Host "Creating the Azure Event Grid role in Azure Ad Application: " $myWebhookAadApplicationObjectId
    $newRole = CreateAppRole -Name $eventGridRoleName -Description "Azure Event Grid Role"
    $myAppRoles.Add($newRole)
    Set-AzureADApplication -ObjectId $myApp.ObjectId -AppRoles $myAppRoles
}

# print application's roles
Write-Host "My Azure AD Application's Roles: "
Write-Host $myAppRoles

```

### Create role assignment for the client creating event subscription
The role assignment should be created in the Webhook Azure AD App for the AAD app or AAD user creating the event subscription. Use one of the scripts below depending on whether an AAD app or AAD user is creating the event subscription.

> [!IMPORTANT]
> Additional access check has been introduced as part of create or update of event subscription on March 30, 2021 to address a security vulnerability. The subscriber client's service principal needs to be either an owner or have a role assigned on the destination application service principal. Please reconfigure your AAD Application following the new instructions below.

#### Create role assignment for an event subscription AAD app 

```powershell
# This is the app id of the application which will create event subscription. Set to $null if you are not assigning the role to app.
$eventSubscriptionWriterAppId = "<the app id of the application which will create event subscription>"

$myServicePrincipal = Get-AzureADServicePrincipal -Filter ("appId eq '" + $myApp.AppId + "'")

$eventSubscriptionWriterSP = Get-AzureADServicePrincipal -Filter ("appId eq '" + $eventSubscriptionWriterAppId + "'")
if ($eventSubscriptionWriterSP -eq $null)
{
        $eventSubscriptionWriterSP = New-AzureADServicePrincipal -AppId $eventSubscriptionWriterAppId
}

Write-Host "Creating the Azure Ad App Role assignment for application: " $eventSubscriptionWriterAppId
$eventGridAppRole = $myApp.AppRoles | Where-Object -Property "DisplayName" -eq -Value $eventGridRoleName
New-AzureADServiceAppRoleAssignment -Id $eventGridAppRole.Id -ResourceId $myServicePrincipal.ObjectId -ObjectId $eventSubscriptionWriterSP.ObjectId -PrincipalId $eventSubscriptionWriterSP.ObjectId
```

#### Create role assignment for an event subscription AAD user 

```powershell
# This is the user principal name of the user who will create event subscription. Set to $null if you are not assigning the role to user.
$eventSubscriptionWriterUserPrincipalName = "<the user principal name of the user who will create event subscription>"

$myServicePrincipal = Get-AzureADServicePrincipal -Filter ("appId eq '" + $myApp.AppId + "'")
    
Write-Host "Creating the Azure Ad App Role assignment for user: " $eventSubscriptionWriterUserPrincipalName
$eventSubscriptionWriterUser = Get-AzureAdUser -ObjectId $eventSubscriptionWriterUserPrincipalName
$eventGridAppRole = $myApp.AppRoles | Where-Object -Property "DisplayName" -eq -Value $eventGridRoleName
New-AzureADUserAppRoleAssignment -Id $eventGridAppRole.Id -ResourceId $myServicePrincipal.ObjectId -ObjectId $eventSubscriptionWriterUser.ObjectId -PrincipalId $eventSubscriptionWriterUser.ObjectId
```

### Create role assignment for Event Grid Service principal
Run the New-AzureADServiceAppRoleAssignment command to assign Event Grid service principal to the role you created in the previous step.

```powershell
$eventGridAppRole = $myApp.AppRoles | Where-Object -Property "DisplayName" -eq -Value $eventGridRoleName
New-AzureADServiceAppRoleAssignment -Id $eventGridAppRole.Id -ResourceId $myServicePrincipal.ObjectId -ObjectId $eventGridSP.ObjectId -PrincipalId $eventGridSP.ObjectId
```

Run the following commands to output information that you'll use later.

```powershell
Write-Host "My Webhook's Azure AD Tenant Id:  $myWebhookAadTenantId"
Write-Host "My Webhook's Azure AD Application Id: $($myApp.AppId)"
Write-Host "My Webhook's Azure AD Application ObjectId Id$($myApp.ObjectId)"
```

    
## Configure the event subscription
When creating an  event subscription, follow these steps:

1. Select the endpoint type as **Web Hook**. 
1. Specify the endpoint **URI**.

    ![Select endpoint type webhook](./media/secure-webhook-delivery/select-webhook.png)
1. Select the **Additional features** tab at the top of the **Create Event Subscriptions** page.
1. On the **Additional features** tab, do these steps:
    1. Select **Use AAD authentication**, and configure the tenant ID and application ID:
    1. Copy the Azure AD tenant ID from the output of the script and enter it in the **AAD Tenant ID** field.
    1. Copy the Azure AD application ID from the output of the script and enter it in the **AAD Application ID** field. Alternatively, you can use the AAD Application ID URI. For more information about application ID URI, see [this article](../app-service/configure-authentication-provider-aad.md).

        ![Secure Webhook action](./media/secure-webhook-delivery/aad-configuration.png)



## Next steps

* For information about monitoring event deliveries, see [Monitor Event Grid message delivery](monitor-event-delivery.md).
* For more information about the authentication key, see [Event Grid security and authentication](security-authentication.md).
* For more information about creating an Azure Event Grid subscription, see [Event Grid subscription schema](subscription-creation-schema.md).
