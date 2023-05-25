---
title: Remove user-assigned managed identity for Azure Automation account
description: This article explains how to remove a user-assigned managed identity for an Azure Automation account.
services: automation
ms.subservice: process-automation
ms.custom: devx-track-azurepowershell, devx-track-arm-template
ms.date: 10/26/2021
ms.topic: conceptual
---

# Remove user-assigned managed identity for Azure Automation account

You can remove a user-assigned managed identity in Azure Automation by using the Azure portal, PowerShell, the Azure REST API, or an Azure Resource Manager (ARM) template.

## Remove using the Azure portal

You can remove a user-assigned managed identity from the Azure portal no matter how the user-assigned managed identity was originally added.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to your Automation account and under **Account Settings**, select **Identity**.

1. Select the **User assigned** tab.

1. Select the user-assigned managed identity to be removed from the list.

1. Select **Remove**. When you're prompted to confirm, select **Yes**.

The user-assigned managed identity is removed and no longer has access to the target resource.

## Remove using PowerShell

Use PowerShell cmdlet [Set-AzAutomationAccount](/powershell/module/az.automation/set-azautomationaccount) to remove all user-assigned managed identities and retain an existing system-assigned managed identity.

1. Sign in to Azure interactively using the [Connect-AzAccount](/powershell/module/Az.Accounts/Connect-AzAccount) cmdlet and follow the instructions.

    ```powershell
    # Sign in to your Azure subscription
    $sub = Get-AzSubscription -ErrorAction SilentlyContinue
    if(-not($sub))
    {
        Connect-AzAccount
    }
    ```

1. Provide an appropriate value for the variables and then execute the script.

    ```powershell
    $resourceGroup = "resourceGroupName"
    $automationAccount = "automationAccountName"
    ```

1. Execute [Set-AzAutomationAccount](/powershell/module/az.automation/set-azautomationaccount).

    ```powershell
    # Removes all UAs, keeps SA
    $output = Set-AzAutomationAccount `
        -ResourceGroupName $resourceGroup `
        -Name $automationAccount `
        -AssignSystemIdentity 
    
    $output.identity.Type
    ```

    The output will be `SystemAssigned`.

## Remove using REST API

You can remove a user-assigned managed identity from the Automation account by using the following REST API call and example.

### Request body

Scenario: System-assigned managed identity is enabled or is to be enabled. One of many user-assigned managed identities is to be removed. This example removes a user-assigned managed identity named `firstIdentity` using the HTTP **PATCH** method.

```json
{
  "identity": {
    "type": "SystemAssigned, UserAssigned",
    "userAssignedIdentities": {
      "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/resource-group-name/providers/Microsoft.ManagedIdentity/userAssignedIdentities/firstIdentity": null
    }
  }
}
```

Scenario: System-assigned managed identity is enabled or is to be enabled. All user-assigned managed identities are to be removed using the HTTP **PUT** method.

```json
{
  "identity": {
    "type": "SystemAssigned"
  }
}
```

Scenario: System-assigned managed identity is disabled or is to be disabled. One of many user-assigned managed identities is to be removed. This example removes a user-assigned managed identity named `firstIdentity` using the HTTP **PATCH** method.

```json
{
  "identity": {
    "type": "UserAssigned",
    "userAssignedIdentities": {
      "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/resource-group-name/providers/Microsoft.ManagedIdentity/userAssignedIdentities/firstIdentity": null
    }
  }
}

```

Scenario: System-assigned managed identity is disabled or is to be disabled. All user-assigned managed identities are to be removed using the HTTP **PUT** method.

```json
{
  "identity": {
    "type": "None"
  }
}
```

The following is the service's REST API request URI to send the PATCH request.

```http
https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/resource-group-name/providers/Microsoft.Automation/automationAccounts/automation-account-name?api-version=2020-01-13-preview
```

### Example

Perform the following steps.

1. Copy and paste the request body, depending on which operation you want to perform, into a file named `body_remove_ua.json`. Make any required modifications, and then save the file on your local machine or in an Azure storage account.

1. Sign in to Azure interactively using the [Connect-AzAccount](/powershell/module/Az.Accounts/Connect-AzAccount) cmdlet and follow the instructions.

    ```powershell
    # Sign in to your Azure subscription
    $sub = Get-AzSubscription -ErrorAction SilentlyContinue
    if(-not($sub))
    {
        Connect-AzAccount -Subscription
    }
    ```

1. Provide an appropriate value for the variables and then execute the script.

    ```powershell
    $subscriptionID = "subscriptionID"
    $resourceGroup = "resourceGroupName"
    $automationAccount = "automationAccountName"
    $file = "path\body_remove_ua.json"
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

   Depending on the syntax you used, the output will either be: `SystemAssignedUserAssigned`, `SystemAssigned`, `UserAssigned`, or blank.

## Remove using Azure Resource Manager template

If you added the user-assigned managed identity for your Automation account using an Azure Resource Manager template, you can remove the user-assigned managed identity by modifying the template, and then re-running it.

Scenario: System-assigned managed identity is enabled or is to be enabled. One of two user-assigned managed identities is to be removed. This syntax snippet removes **all** user-assigned managed identities **except for** the one passed as a parameter to the template.

```json
...
"identity": {
    "type": "SystemAssigned, UserAssigned",
    "userAssignedIdentities": {
        "[resourceID('Microsoft.ManagedIdentity/userAssignedIdentities/',parameters('userAssignedOne'))]": {}
    }
},
...
```

Scenario: System-assigned managed identity is enabled or is to be enabled. All user-assigned managed identities are to be removed.

```json
...
"identity": {
    "type": "SystemAssigned"
},
...
```

Scenario: System-assigned managed identity is disabled or is to be disabled. One of two user-assigned managed identities is to be removed. This syntax snippet removes **all** user-assigned managed identities **except for** the one passed as a parameter to the template.

```json
...
"identity": {
    "type": "UserAssigned",
    "userAssignedIdentities": {
        "[resourceID('Microsoft.ManagedIdentity/userAssignedIdentities/',parameters('userAssignedOne'))]": {}
    }
},
...
```

Use the [Get-AzAutomationAccount](/powershell/module/az.automation/get-azautomationaccount) cmdlet to verify. Depending on the syntax you used, the output will either be: `SystemAssignedUserAssigned`, `SystemAssigned`, or `UserAssigned`.

```powershell
(Get-AzAutomationAccount `
    -ResourceGroupName $resourceGroup `
    -Name $automationAccount).Identity.Type
```

## Next steps

- For more information about enabling managed identities in Azure Automation, see [Enable and use managed identity for Automation](enable-managed-identity-for-automation.md).

- For an overview of Automation account security, see [Automation account authentication overview](automation-security-overview.md).
