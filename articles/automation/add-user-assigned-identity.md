---
title: Using a user-assigned managed identity for an Azure Automation account (preview)
description: This article describes how to set up a user-assigned managed identity for Azure Automation accounts.
services: automation
ms.subservice: process-automation
ms.date: 07/09/2021
ms.topic: conceptual 
---

# Using a user-assigned managed identity for an Azure Automation account (preview)

This article shows you how to add a user-assigned managed identity for an Azure Automation account and how to use it to access other resources. For more information on how managed identities work with Azure Automation, see [Managed identities](automation-security-overview.md#managed-identities-preview).

> [!NOTE]
> User-assigned managed identities are supported for cloud jobs only.  

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

- An Azure Automation account. For instructions, see [Create an Azure Automation account](automation-quickstart-create-account.md).

- A system-assigned managed identity. For instructions, see [Using a system-assigned managed identity for an Azure Automation account (preview)](enable-managed-identity-for-automation.md).

- A user-assigned managed identity. For instructions, see [Create a user-assigned managed identity](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md#create-a-user-assigned-managed-identity).

- The user-assigned managed identity and the target Azure resources that your runbook manages using that identity must be in the same Azure subscription.

- The latest version of Azure Account modules. Currently this is 2.2.8. (See [Az.Accounts](https://www.powershellgallery.com/packages/Az.Accounts/) for details about this version.)

- An Azure resource that you want to access from your Automation runbook. This resource needs to have a role defined for the user-assigned managed identity, which helps the Automation runbook authenticate access to the resource. To add roles, you need to be an owner for the resource in the corresponding Azure AD tenant.

- If you want to execute hybrid jobs using a user-assigned managed identity, update the Hybrid Runbook Worker to the latest version. The minimum required versions are:

  - Windows Hybrid Runbook Worker: version 7.3.1125.0
  - Linux Hybrid Runbook Worker: version 1.7.4.0

## Add user-assigned managed identity for Azure Automation account

You can add a user-assigned managed identity for an Azure Automation account using the Azure portal, PowerShell, the Azure REST API, or ARM template. For the examples involving PowerShell, first sign in to Azure interactively using the [Connect-AzAccount](/powershell/module/Az.Accounts/Connect-AzAccount) cmdlet and follow the instructions.

```powershell
# Sign in to your Azure subscription
$sub = Get-AzSubscription -ErrorAction SilentlyContinue
if(-not($sub))
{
    Connect-AzAccount -Subscription
}

# If you have multiple subscriptions, set the one to use
# Select-AzSubscription -SubscriptionId "<SUBSCRIPTIONID>"
```

Then initialize a set of variables that will be used throughout the examples. Revise the values below and then execute"

```powershell
$subscriptionID = "subscriptionID"
$resourceGroup = "resourceGroupName"
$automationAccount = "automationAccountName"
$userAssignedOne = "userAssignedIdentityOne"
$userAssignedTwo = "userAssignedIdentityTwo"
```

### Add using the Azure portal

Perform the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the Azure portal, navigate to your Automation account.

1. Under **Account Settings**, select **Identity**.

1. Select the **User assigned** tab, and then select **Add**.

1. Select your existing user-assigned managed identity and then select **Add**. You'll then be returned to the **User assigned** tab.

   :::image type="content" source="media/add-user-assigned-identity/user-assigned-managed-identity.png" alt-text="Output from Portal.":::

### Add using PowerShell

Use PowerShell cmdlet [Set-AzAutomationAccount](/powershell/module/az.automation/set-azautomationaccount) to add the user-assigned managed identities. You must first consider whether there's an existing system-assigned managed identity. The example below adds two existing user-assigned managed identities to an existing Automation account, and will disable a system-assigned managed identity if one exists.

```powershell
$output = Set-AzAutomationAccount `
    -ResourceGroupName $resourceGroup `
    -Name $automationAccount `
    -AssignUserIdentity "/subscriptions/$subscriptionID/resourcegroups/$resourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/$userAssignedOne", `
        "/subscriptions/$subscriptionID/resourcegroups/$resourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/$userAssignedTwo"

$output
```

To keep an existing system-assigned managed identity, use the following:

```powershell
$output = Set-AzAutomationAccount `
    -ResourceGroupName $resourceGroup `
    -Name $automationAccount `
    -AssignUserIdentity "/subscriptions/$subscriptionID/resourcegroups/$resourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/$userAssignedOne", `
        "/subscriptions/$subscriptionID/resourcegroups/$resourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/$userAssignedTwo" `
    -AssignSystemIdentity

$output
```

The output should look similar to the following:

:::image type="content" source="media/add-user-assigned-identity/set-azautomationaccount-output.png" alt-text="Output from Set-AzAutomationAccount command.":::

For additional output, execute: `$output.identity | ConvertTo-Json`.

### Add using a REST API

Syntax and example steps are provided below.

#### Syntax

The sample body syntax below enables a system-assigned managed identity if not already enabled and assigns two existing user-assigned managed identities to the existing Automation account.

PATCH

```json
{
  "identity": {
    "type": "SystemAssigned, UserAssigned",
    "userAssignedIdentities": {
      "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/resource-group-name/providers/Microsoft.ManagedIdentity/userAssignedIdentities/firstIdentity": {},
      "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/resource-group-name/providers/Microsoft.ManagedIdentity/userAssignedIdentities/secondIdentity": {}
    }
  }
}
```

The syntax of the API is as follows:

```http
https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/resource-group-name/providers/Microsoft.Automation/automationAccounts/automation-account-name?api-version=2020-01-13-preview 
```

#### Example

Perform the following steps.

1. Revise the syntax of the body above into a file named `body_ua.json`. Save the file on your local machine or in an Azure storage account.

1. Revise the variable value below and then execute.

    ```powershell
    $file = "path\body_ua.json"
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
    $response = Invoke-RestMethod -Uri $URI -Method PATCH -Headers $authHeader -Body $body
    
    # Review output
    $response.identity | ConvertTo-Json
    ```

    The output should look similar to the following:

    ```json
    {
    "type": "SystemAssigned, UserAssigned",
    "principalId": "00000000-0000-0000-0000-000000000000",
    "tenantId": "00000000-0000-0000-0000-000000000000",
    "userAssignedIdentities":  {
        "/subscriptions/ContosoID/resourcegroups/ContosoLab/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ContosoUAMI1":  {
                "PrincipalId":  "00000000-0000-0000-0000-000000000000",
                "ClientId":  "00000000-0000-0000-0000-000000000000"
                    },
        "/subscriptions/ContosoID/resourcegroups/ContosoLab/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ContosoUAMI2":  {
                "PrincipalId":  "00000000-0000-0000-0000-000000000000",
                "ClientId":  "00000000-0000-0000-0000-000000000000"
                    }
        }
    }
    ```

### Add using an ARM template

Syntax and example steps are provided below.

#### Template syntax

The sample template syntax below enables a system-assigned managed identity if not already enabled and assigns two existing user-assigned managed identities to the existing Automation account.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "automationAccountName": {
     "defaultValue": "YourAutomationAccount",
      "type": "String",
      "metadata": {
        "description": "Automation account name"
      }
    },
    "userAssignedOne": {
     "defaultValue": "userAssignedOne",
      "type": "String",
      "metadata": {
        "description": "User-assigned managed identity"
      }
	  },
    "userAssignedTwo": {
     "defaultValue": "userAssignedTwo",
      "type": "String",
      "metadata": {
        "description": "User-assigned managed identity"
      }
	  }
   },
  "resources": [
    {
      "type": "Microsoft.Automation/automationAccounts",
      "apiVersion": "2020-01-13-preview",
      "name": "[parameters('automationAccountName')]",
      "location": "[resourceGroup().location]",
      "identity": {
        "type": "SystemAssigned, UserAssigned",
        "userAssignedIdentities": {
          "[resourceID('Microsoft.ManagedIdentity/userAssignedIdentities/',parameters('userAssignedOne'))]": {},
          "[resourceID('Microsoft.ManagedIdentity/userAssignedIdentities/',parameters('userAssignedTwo'))]": {}
        }
      },
      "properties": {
        "sku": {
          "name": "Basic"
        },
        "encryption": {
          "keySource": "Microsoft.Automation",
          "identity": {}
        }
      }
    }
  ]
}
```

#### Example

Perform the following steps.

1. Copy and paste the template into a file named `template_ua.json`. Save the file on your local machine or in an Azure storage account.

1. Revise the variable value below and then execute.

    ```powershell
    $templateFile = "path\template_ua.json"
    ```

1. Use PowerShell cmdlet [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment) to deploy the template.

    ```powershell
    New-AzResourceGroupDeployment `
        -Name "UserAssignedDeployment" `
        -ResourceGroupName $resourceGroup `
        -TemplateFile $templateFile `
        -automationAccountName $automationAccount `
        -userAssignedOne $userAssignedOne `
        -userAssignedTwo $userAssignedTwo
    ```

   The command won't produce an output; however, you can use the code below to verify:

    ```powershell
    (Get-AzAutomationAccount `
    -ResourceGroupName $resourceGroup `
    -Name $automationAccount).Identity | ConvertTo-Json
    ```

    The output will look similar to the output shown for the REST API example, above.

## Give identity access to Azure resources by obtaining a token

An Automation account can use its user-assigned managed identity to obtain tokens to access other resources protected by Azure AD, such as Azure Key Vault. These tokens don't represent any specific user of the application. Instead, they represent the application that is accessing the resource. In this case, for example, the token represents an Automation account.

Before you can use your user-assigned managed identity for authentication, set up access for that identity on the Azure resource where you plan to use the identity. To complete this task, assign the appropriate role to that identity on the target Azure resource.

This example uses Azure PowerShell to show how to assign the Contributor role in the subscription to the target Azure resource. The Contributor role is used as an example and may or may not be required in your case. Alternatively, you can use portal also to assign the role to the target Azure resource.

```powershell
New-AzRoleAssignment `
    -ObjectId <automation-Identity-object-id> `
    -Scope "/subscriptions/<subscription-id>" `
    -RoleDefinitionName "Contributor"
```

## Authenticate access with user-assigned managed identity

After you enable the user-assigned managed identity for your Automation account and give an identity access to the target resource, you can specify that identity in runbooks against resources that support managed identity. For identity support, use the Az cmdlet [Connect-AzAccount](/powershell/module/az.accounts/Connect-AzAccount).

```powershell
Connect-AzAccount -Identity `
    -AccountId <user-assigned-identity-ClientId> 
```

## Generate an access token without using Azure cmdlets

For HTTP Endpoints make sure of the following.
- The metadata header must be present and should be set to "true".
- A resource must be passed along with the request, as a query parameter for a GET request and as form data for a POST request.
- Content Type for the Post request must be `application/x-www-form-urlencoded`.

### Get Access token for user-assigned managed identity using Http Get  

```powershell
$resource= "?resource=https://management.azure.com/"
$client_id="&client_id=<ClientId of USI>"
$url = $env:IDENTITY_ENDPOINT + $resource + $client_id 
$Headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]"  
$Headers.Add("Metadata", "True")
$accessToken = Invoke-RestMethod -Uri $url -Method 'GET' -Headers $Headers
Write-Output $accessToken.access_token 
```

### Get Access token for user-assigned managed identity using Http Post

```powershell
$url = $env:IDENTITY_ENDPOINT
$headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]"
$headers.Add("Metadata", "True")
$body = @{'resource'='https://management.azure.com/' 
'client_id'='<ClientId of USI>'}
$accessToken = Invoke-RestMethod $url -Method 'POST' -Headers $headers -ContentType 'application/x-www-form-urlencoded' -Body $body
Write-Output $accessToken.access_token 
```

### Using user-assigned managed identity in Azure PowerShell

```powershell
Write-Output "Connecting to azure via  Connect-AzAccount -Identity -AccountId <ClientId of USI>"  
Connect-AzAccount -Identity -AccountId <ClientId of USI> 
Write-Output "Successfully connected with Automation account's Managed Identity"  
Write-Output "Trying to fetch value from key vault using User Assigned Managed identity. Make sure you have given correct access to Managed Identity"  
$secret = Get-AzKeyVaultSecret -VaultName '<KVname>' -Name '<KeyName>'  
$ssPtr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secret.SecretValue)  
try {  
  $secretValueText = [System.Runtime.InteropServices.Marshal]::PtrToStringBSTR($ssPtr)  
    Write-Output $secretValueText  
} finally {  
    [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ssPtr)  
} 
```

### Using user-assigned managed identity in Python Runbook

```python
#!/usr/bin/env python3  
import os  
import requests   

resource = "?resource=https://management.azure.com/" 
client_id = "&client_id=<ClientId of USI>" 
endPoint = os.getenv('IDENTITY_ENDPOINT')+ resource +client_id 
payload={}  
headers = {  
  'Metadata': 'True'  
}  
response = requests.request("GET", endPoint, headers=headers, data=payload)  
print(response.text) 
```

## Next steps

- If your runbooks aren't completing successfully, review [Troubleshoot Azure Automation managed identity issues (preview)](troubleshoot/managed-identity.md).

- If you need to disable a managed identity, see [Disable your Azure Automation account managed identity (preview)](disable-managed-identity-for-automation.md).

- For an overview of Azure Automation account security, see [Automation account authentication overview](automation-security-overview.md).
