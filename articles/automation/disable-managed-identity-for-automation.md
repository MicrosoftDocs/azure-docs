---
title: Disable system-assigned managed identity for Azure Automation account
description: This article explains how to disable a system-assigned managed identity for an Azure Automation account.
services: automation
ms.subservice: process-automation
ms.date: 10/26/2021
ms.topic: conceptual
---

# Disable system-assigned managed identity for Azure Automation account

You can disable a system-assigned managed identity in Azure Automation by using the Azure portal, or using REST API.

## Disable using the Azure portal

You can disable the system-assigned managed identity from the Azure portal no matter how the system-assigned managed identity was originally set up.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to your Automation account and under **Account Settings**, select **Identity**.

1. From the **System assigned** tab, under the **Status** button, select **Off** and then select **Save**. When you're prompted to confirm, select **Yes**.

The system-assigned managed identity is disabled and no longer has access to the target resource.

## Disable using REST API

Syntax and example steps are provided below.

### Request body

The following request body disables the system-assigned managed identity and removes any user-assigned managed identities using the HTTP **PATCH** method.

```json
{ 
 "identity": { 
   "type": "None" 
  } 
}

```

If there are multiple user-assigned identities defined, to retain them and only remove the system-assigned identity, you need to specify each user-assigned identity using comma-delimited list. The example below uses the HTTP **PATCH** method.

```json
{ 
"identity" : {
    "type": "UserAssigned",
    "userAssignedIdentities": {
        "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/resourceGroupName/providers/Microsoft.ManagedIdentity/userAssignedIdentities/firstIdentity": {},
        "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/resourceGroupName/providers/Microsoft.ManagedIdentity/userAssignedIdentities/secondIdentity": {}
        }
    }
}
```

The following is the service's REST API request URI to send the PATCH request.

```http
PATCH https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/resource-group-name/providers/Microsoft.Automation/automationAccounts/automation-account-name?api-version=2020-01-13-preview
```

### Example

Perform the following steps.

1. Copy and paste the request body, depending on which operation you want to perform, into a file named `body_remove_sa.json`. Save the file on your local machine or in an Azure storage account.

1. Sign in to Azure interactively using the [Connect-AzAccount](/powershell/module/Az.Accounts/Connect-AzAccount) cmdlet and follow the instructions.

    ```powershell
    # Sign in to your Azure subscription
    $sub = Get-AzSubscription -ErrorAction SilentlyContinue
    if(-not($sub))
    {
        Connect-AzAccount
    }
    
    # If you have multiple subscriptions, set the one to use
    # Select-AzSubscription -SubscriptionId "<SUBSCRIPTIONID>"
    ```

1. Provide an appropriate value for the variables and then execute the script.

    ```powershell
    $subscriptionID = "subscriptionID"
    $resourceGroup = "resourceGroupName"
    $automationAccount = "automationAccountName"
    $file = "path\body_remove_sa.json"
    ```

1. This example uses the PowerShell cmdlet [Invoke-RestMethod](/powershell/module/microsoft.powershell.utility/invoke-restmethod) to send the PATCH request to your Automation account.

    ```powershell
    # build URI
    $URI = "https://management.azure.com/subscriptions/$subscriptionID/resourceGroups/$resourceGroup/providers/Microsoft.Automation/automationAccounts/$automationAccount`?api-version=2020-01-13-preview"
    
    # build body
    $body = Get-Content $file
    
    # obtain access token
    $azContext = Get-AzContext
    $azProfile = [Microsoft.Azure.Commands.Common.Authentication.Abstractions.AzureRmProfileProvider]::Instance.Profile
    $profileClient = New-Object -TypeName Microsoft.Azure.Commands.ResourceManager.Common.RMProfileClient -ArgumentList ($azProfile)
    $token = $profileClient.AcquireAccessToken($azContext.Subscription.TenantId)
    $authHeader = @{
        'Content-Type'='application/json'
        'Authorization'='Bearer ' + $token.AccessToken
    }
    
    # Invoke the REST API
    Invoke-RestMethod -Uri $URI -Method PATCH -Headers $authHeader -Body $body
    
    # Confirm removal
    (Get-AzAutomationAccount `
        -ResourceGroupName $resourceGroup `
        -Name $automationAccount).Identity.Type
    ```

    Depending on the syntax you used, the output will either be: `UserAssigned` or blank.

## Next steps

- For more information about enabling managed identities in Azure Automation, see [Enable and use managed identity for Automation](enable-managed-identity-for-automation.md).

- For an overview of Automation account security, see [Automation account authentication overview](automation-security-overview.md).