---
title: Azure PowerShell - Secure WebHook delivery with Microsoft Entra user in Azure Event Grid
description: Describes how to deliver events to HTTPS endpoints protected by Microsoft Entra user using Azure Event Grid
ms.devlang: powershell
ms.custom: has-azure-ad-ps-ref, azure-ad-ref-level-one-done, devx-track-azurepowershell
ms.topic: sample
ms.date: 02/02/2024
---

# Secure WebHook delivery with Microsoft Entra user in Azure Event Grid

This script provides the configuration to deliver events to HTTPS endpoints protected by Microsoft Entra user using Azure Event Grid.

Here are the high level steps from the script:

1. Create a service principal for **Microsoft.EventGrid** if it doesn't already exist.
1. Create a role named **AzureEventGridSecureWebhookSubscriber** in the **Microsoft Entra app for your Webhook**.
1. Add service principal of user who is creating the subscription to the AzureEventGridSecureWebhookSubscriber role.
1. Add service principal of Microsoft.EventGrid to the AzureEventGridSecureWebhookSubscriber.

## Sample script

```azurepowershell
# NOTE: Before run this script ensure you are logged in Azure by using "az login" command.

$webhookAppObjectId = "[REPLACE_WITH_YOUR_ID]"
$eventSubscriptionWriterUserPrincipalName = "[REPLACE_WITH_USER_PRINCIPAL_NAME_OF_THE_USER_WHO_WILL_CREATE_THE_SUBSCRIPTION]"

# Start execution
try {

    # Creates an application role of given name and description

    Function CreateAppRole([string] $Name, [string] $Description)
    {
        $appRole = New-Object Microsoft.Graph.PowerShell.Models.MicrosoftGraphAppRole
        $appRole.AllowedMemberTypes = New-Object System.Collections.Generic.List[string]
        $appRole.AllowedMemberTypes += "Application";
        $appRole.AllowedMemberTypes += "User";
        $appRole.DisplayName = $Name
        $appRole.Id = New-Guid
        $appRole.IsEnabled = $true
        $appRole.Description = $Description
        $appRole.Value = $Name;

        return $appRole
    }

    # Creates Azure Event Grid Microsoft Entra Application if not exists
    # You don't need to modify this id
    # But Azure Event Grid Microsoft Entra Application Id is different for different clouds
   
    $eventGridAppId = "4962773b-9cdb-44cf-a8bf-237846a00ab7" # Azure Public Cloud
    # $eventGridAppId = "54316b56-3481-47f9-8f30-0300f5542a7b" # Azure Government Cloud
    $eventGridSP = Get-MgServicePrincipal -Filter ("appId eq '" + $eventGridAppId + "'")
    if ($eventGridSP.DisplayName -match "Microsoft.EventGrid")
    {
        Write-Host "The Event Grid Microsoft Entra Application is already defined.`n"
    } else {
        Write-Host "Creating the Azure Event Grid Microsoft Entra Application"
        $eventGridSP = New-MgServicePrincipal -AppId $eventGridAppId
    }

    # Creates the Azure app role for the webhook Microsoft Entra application
    $eventGridRoleName = "AzureEventGridSecureWebhookSubscriber" # You don't need to modify this role name

    $app = Get-MgApplication -ApplicationId $webhookAppObjectId 
    $appRoles = $app.AppRoles

    Write-Host "Microsoft Entra App roles before addition of the new role..."
    Write-Host $appRoles.DisplayName
    
    if ($appRoles.DisplayName -match $eventGridRoleName)
    {
        Write-Host "The Azure Event Grid role is already defined.`n"
    } else {      
        Write-Host "Creating the Azure Event Grid role in Microsoft Entra Application: " $webhookAppObjectId
        $newRole = CreateAppRole -Name $eventGridRoleName -Description "Azure Event Grid Role"
        $appRoles += $newRole
        Update-MgApplication -ApplicationId $webhookAppObjectId -AppRoles $appRoles
    }

    Write-Host "Microsoft Entra App roles after addition of the new role..."
    Write-Host $appRoles.DisplayName

    # Creates the user role assignment for the user who will create event subscription

    $servicePrincipal = Get-MgServicePrincipal -Filter ("appId eq '" + $app.AppId + "'")

    try
    {
        Write-Host "Creating the Microsoft Entra App Role assignment for user: " $eventSubscriptionWriterUserPrincipalName
        $eventSubscriptionWriterUser = Get-MgUser -UserId $eventSubscriptionWriterUserPrincipalName
        $eventGridAppRole = $app.AppRoles | Where-Object -Property "DisplayName" -eq -Value $eventGridRoleName
        New-MgUserAppRoleAssignment -UserId $eventSubscriptionWriterUser.Id -PrincipalId $eventSubscriptionWriterUser.Id -ResourceId $servicePrincipal.Id  -AppRoleId $eventGridAppRole.Id 
    }
    catch
    {
        if( $_.Exception.Message -like '*Permission being assigned already exists on the object*')
        {
            Write-Host "The Microsoft Entra User Application role is already defined.`n"
        }
        else
        {
            Write-Error $_.Exception.Message
        }
        Break
    }

    # Creates the service app role assignment for Event Grid Microsoft Entra Application

    $eventGridAppRole = $app.AppRoles | Where-Object -Property "DisplayName" -eq -Value $eventGridRoleName
    New-MgServicePrincipalAppRoleAssignment -ServicePrincipalId $eventGridSP.Id -PrincipalId $eventGridSP.Id  -ResourceId $servicePrincipal.Id -AppRoleId $eventGridAppRole.Id
    
    # Print output references for backup

    Write-Host ">> Webhook's Microsoft Entra Application Id: $($app.AppId)"
    Write-Host ">> Webhook's Microsoft Entra Application Object Id: $($app.Id)"
}
catch {
  Write-Host ">> Exception:"
  Write-Host $_
  Write-Host ">> StackTrace:"  
  Write-Host $_.ScriptStackTrace
}
```

## Script explanation

For more information, see [Secure WebHook delivery with Microsoft Entra ID in Azure Event Grid](../secure-webhook-delivery.md).
