---
title: Using a system-assigned managed identity for an Azure Automation account (preview)
description: This article describes how to set up managed identity for Azure Automation accounts.
services: automation
ms.subservice: process-automation
ms.date: 07/24/2021
ms.topic: conceptual 
ms.custom: devx-track-azurepowershell
---

# Using a system-assigned managed identity for an Azure Automation account (preview)

This article shows you how to enable a system-assigned managed identity for an Azure Automation account and how to use it to access other resources. For more information on how managed identities work with Azure Automation, see [Managed identities](automation-security-overview.md#managed-identities-preview).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

- An Azure Automation account. For instructions, see [Create an Azure Automation account](automation-quickstart-create-account.md).

- The latest version of Azure Account modules. Currently this is 2.2.8. (See [Az.Accounts](https://www.powershellgallery.com/packages/Az.Accounts/) for details about this version.)

- An Azure resource that you want to access from your Automation runbook. This resource needs to have a role defined for the managed identity, which helps the Automation runbook authenticate access to the resource. To add roles, you need to be an owner for the resource in the corresponding Azure AD tenant.

- If you want to execute hybrid jobs using a managed identity, update the Hybrid Runbook Worker to the latest version. The minimum required versions are:

  - Windows Hybrid Runbook Worker: version 7.3.1125.0
  - Linux Hybrid Runbook Worker: version 1.7.4.0

## Enable a system-assigned managed identity for an Azure Automation account

Once enabled, the following properties will be assigned to the system-assigned managed identity.

|Property (JSON) | Value | Description|
|----------|-----------|------------|
| principalid | \<principal-ID\> | The Globally Unique Identifier (GUID) of the service principal object for the system-assigned managed identity that represents your Automation account in the Azure AD tenant. This GUID sometimes appears as an "object ID" or objectID. |
| tenantid | \<Azure-AD-tenant-ID\> | The Globally Unique Identifier (GUID) that represents the Azure AD tenant where the Automation account is now a member. Inside the Azure AD tenant, the service principal has the same name as the Automation account. |

You can enable a system-assigned managed identity for an Azure Automation account using the Azure portal, PowerShell, the Azure REST API, or ARM template. For the examples involving PowerShell, first sign in to Azure interactively using the [Connect-AzAccount](/powershell/module/Az.Accounts/Connect-AzAccount) cmdlet and follow the instructions.

```powershell
# Sign in to your Azure subscription
$sub = Get-AzSubscription -ErrorAction SilentlyContinue
if(-not($sub))
{
    Connect-AzAccount -Identity
}

# If you have multiple subscriptions, set the one to use
# Select-AzSubscription -SubscriptionId "<SUBSCRIPTIONID>"
```

Then initialize a set of variables that will be used throughout the examples. Revise the values below and then execute.

```powershell
$subscriptionID = "subscriptionID"
$resourceGroup = "resourceGroupName"
$automationAccount = "automationAccountName"
```

> [!IMPORTANT]
> The new Automation account-level identity will override any previous VM-level system-assigned identities which are described in [Use runbook authentication with managed identities](./automation-hrw-run-runbooks.md#runbook-auth-managed-identities). If you're running hybrid jobs on Azure VMs that use a VM's system-assigned identity to access runbook resources, then the Automation account identity will be used for the hybrid jobs. This means your existing job execution may be affected if you've been using the Customer Managed Keys (CMK) feature of your Automation account.<br/><br/>If you wish to continue using the VM's managed identity, you shouldn't enable the Automation account-level identity. If you've already enabled it, you can disable the Automation account system-assigned managed identity. See [Disable your Azure Automation account managed identity](./disable-managed-identity-for-automation.md).

### Enable using the Azure portal

Perform the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the Azure portal, navigate to your Automation account.

1. Under **Account Settings**, select **Identity**.

1. Set the **System assigned** option to **On** and press **Save**. When you're prompted to confirm, select **Yes**.

   :::image type="content" source="media/managed-identity/managed-identity-on.png" alt-text="Enabling system-assigned identity in Azure portal.":::

   Your Automation account can now use the system-assigned identity, which is registered with Azure Active Directory (Azure AD) and is represented by an object ID.

   :::image type="content" source="media/managed-identity/managed-identity-object-id.png" alt-text="Managed identity object ID.":::

### Enable using PowerShell

Use PowerShell cmdlet [Set-AzAutomationAccount](/powershell/module/az.automation/set-azautomationaccount) to enable the system-assigned managed identity.

```powershell
$output = Set-AzAutomationAccount `
    -ResourceGroupName $resourceGroup `
    -Name $automationAccount `
    -AssignSystemIdentity

$output
```

The output should look similar to the following:

:::image type="content" source="media/enable-managed-identity-for-automation/set-azautomationaccount-output.png" alt-text="Output from set-azautomationaccount command.":::

For additional output, execute: `$output.identity | ConvertTo-Json`.

### Enable using a REST API

Syntax and example steps are provided below.

#### Syntax

The body syntax below enables a system-assigned managed identity to an existing Automation account using the HTTP **PATCH** method. However, this syntax will remove any existing user-assigned managed identities associated with the Automation account.

```json
{ 
 "identity": { 
   "type": "SystemAssigned" 
  } 
}
```

If there are multiple user-assigned identities defined, to retain them and only remove the system-assigned identity, you need to specify each user-assigned identity using comma-delimited list. The example below uses the HTTP **PATCH** method.

```json
{ 
  "identity" : {
    "type": "SystemAssigned, UserAssigned",
    "userAssignedIdentities": {
        "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/resourceGroupName/providers/Microsoft.ManagedIdentity/userAssignedIdentities/cmkID": {},
        "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/resourceGroupName/providers/Microsoft.ManagedIdentity/userAssignedIdentities/cmkID2": {}
    }
  }
}

```

The syntax of the API is as follows:

```http
PATCH https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/resource-group-name/providers/Microsoft.Automation/automationAccounts/automation-account-name?api-version=2020-01-13-preview
```

#### Example

Perform the following steps.

1. Copy and paste the body syntax into a file named `body_sa.json`. Save the file on your local machine or in an Azure storage account.

1. Update the variable value below and then execute.

    ```powershell
    $file = "path\body_sa.json"
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
        "PrincipalId":  "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        "TenantId":  "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        "Type":  0,
        "UserAssignedIdentities":  null
    }
    ```

### Enable using an ARM template

Syntax and example steps are provided below.

#### Template syntax

The sample template syntax below enables a system-assigned managed identity to the existing Automation account. However, this syntax will remove any existing user-assigned managed identities associated with the Automation account.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "type": "Microsoft.Automation/automationAccounts",
      "apiVersion": "2020-01-13-preview",
      "name": "yourAutomationAccount",
      "location": "[resourceGroup().location]",
      "identity": {
        "type": "SystemAssigned"
        },
      "properties": {
        "sku": {
          "name": "Basic"
        }
      }
    }
  ]
}
```

#### Example

Perform the following steps.

1. Revise the syntax of the template above to use your Automation account and save it to a file named `template_sa.json`.

1. Update the variable value below and then execute.

    ```powershell
    $templateFile = "path\template_sa.json"
    ```

1. Use PowerShell cmdlet [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment) to deploy the template.

    ```powershell
    New-AzResourceGroupDeployment `
        -Name "SystemAssignedDeployment" `
        -ResourceGroupName $resourceGroup `
        -TemplateFile $templateFile
    ```

   The command won't produce an output; however, you can use the code below to verify:

    ```powershell
    (Get-AzAutomationAccount `
    -ResourceGroupName $resourceGroup `
    -Name $automationAccount).Identity | ConvertTo-Json
    ```

   The output will look similar to the output shown for the REST API example, above.

## Give access to Azure resources by obtaining a token

An Automation account can use its system-assigned managed identity to get tokens to access other resources protected by Azure AD, such as Azure Key Vault. These tokens don't represent any specific user of the application. Instead, they represent the application that's accessing the resource. In this case, for example, the token represents an Automation account.

Before you can use your system-assigned managed identity for authentication, set up access for that identity on the Azure resource where you plan to use the identity. To complete this task, assign the appropriate role to that identity on the target Azure resource.

This example uses Azure PowerShell to show how to assign the Contributor role in the subscription to the target Azure resource. The Contributor role is used as an example, and may or may not be required in your case.

```powershell
New-AzRoleAssignment `
    -ObjectId <automation-Identity-object-id> `
    -Scope "/subscriptions/<subscription-id>" `
    -RoleDefinitionName "Contributor"
```

## Authenticate access with system-assigned managed identity

After you enable the managed identity for your Automation account and give an identity access to the target resource, you can specify that identity in runbooks against resources that support managed identity. For identity support, use the Az cmdlet `Connect-AzAccount` cmdlet. See [Connect-AzAccount](/powershell/module/az.accounts/Connect-AzAccount) in the PowerShell reference. Replace `SubscriptionID` with your actual subscription ID and then execute the following command:

```powershell
Connect-AzAccount -Identity
$AzureContext = Set-AzContext -SubscriptionId "SubscriptionID"
```

> [!NOTE]
> If your organization is still using the deprecated AzureRM cmdlets, you can use `Connect-AzureRMAccount -Identity`.

## Generate an access token without using Azure cmdlets

For HTTP Endpoints make sure of the following.

- The metadata header must be present and should be set to "true".
- A resource must be passed along with the request, as a query parameter for a GET request and as form data for a POST request.
- The X-IDENTITY-HEADER should be set to the value of the environment variable IDENTITY_HEADER for Hybrid Runbook Workers.
- Content Type for the Post request must be 'application/x-www-form-urlencoded'.

### Get Access token for System Assigned Identity using HTTP Get

```powershell
$resource= "?resource=https://management.azure.com/" 
$url = $env:IDENTITY_ENDPOINT + $resource 
$Headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]" 
$Headers.Add("X-IDENTITY-HEADER", $env:IDENTITY_HEADER) 
$Headers.Add("Metadata", "True") 
$accessToken = Invoke-RestMethod -Uri $url -Method 'GET' -Headers $Headers
Write-Output $accessToken.access_token
```

### Get Access token for System Assigned Identity using HTTP Post

```powershell
$url = $env:IDENTITY_ENDPOINT  
$headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]" 
$headers.Add("X-IDENTITY-HEADER", $env:IDENTITY_HEADER) 
$headers.Add("Metadata", "True") 
$body = @{resource='https://management.azure.com/' } 
$accessToken = Invoke-RestMethod $url -Method 'POST' -Headers $headers -ContentType 'application/x-www-form-urlencoded' -Body $body 
Write-Output $accessToken.access_token
```

### Using system-assigned managed identity in Azure PowerShell

For more information, see [Get-AzKeyVaultSecret](/powershell/module/az.keyvault/get-azkeyvaultsecret).

```powershell
Write-Output "Connecting to azure via  Connect-AzAccount -Identity" 
Connect-AzAccount -Identity 
Write-Output "Successfully connected with Automation account's Managed Identity" 
Write-Output "Trying to fetch value from key vault using MI. Make sure you have given correct access to Managed Identity" 
$secret = Get-AzKeyVaultSecret -VaultName '<KVname>' -Name '<KeyName>' 

$ssPtr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secret.SecretValue) 
try { 
  $secretValueText = [System.Runtime.InteropServices.Marshal]::PtrToStringBSTR($ssPtr) 
    Write-Output $secretValueText 
} finally { 
    [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ssPtr) 
}
```

### Using system-assigned managed identity in Python Runbook

```python
#!/usr/bin/env python3 
import os 
import requests  
# printing environment variables 
endPoint = os.getenv('IDENTITY_ENDPOINT')+"?resource=https://management.azure.com/" 
identityHeader = os.getenv('IDENTITY_HEADER') 
payload={} 
headers = { 
  'X-IDENTITY-HEADER': identityHeader,
  'Metadata': 'True' 
} 
response = requests.request("GET", endPoint, headers=headers, data=payload) 
print(response.text) 
```

### Using system-assigned managed identity to Access SQL Database

For details on provisioning access to an Azure SQL database, see [Provision Azure AD admin (SQL Database)](../azure-sql/database/authentication-aad-configure.md#provision-azure-ad-admin-sql-database).

```powershell
$queryParameter = "?resource=https://database.windows.net/" 
$url = $env:IDENTITY_ENDPOINT + $queryParameter
$Headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]" 
$Headers.Add("X-IDENTITY-HEADER", $env:IDENTITY_HEADER) 
$Headers.Add("Metadata", "True") 
$content =[System.Text.Encoding]::Default.GetString((Invoke-WebRequest -UseBasicParsing -Uri $url -Method 'GET' -Headers $Headers).RawContentStream.ToArray()) | ConvertFrom-Json 
$Token = $content.access_token 
echo "The managed identities for Azure resources access token is $Token" 
$SQLServerName = "<ServerName>"    # Azure SQL logical server name  
$DatabaseName = "<DBname>"     # Azure SQL database name 
Write-Host "Create SQL connection string" 
$conn = New-Object System.Data.SqlClient.SQLConnection  
$conn.ConnectionString = "Data Source=$SQLServerName.database.windows.net;Initial Catalog=$DatabaseName;Connect Timeout=30" 
$conn.AccessToken = $Token 
Write-host "Connect to database and execute SQL script" 
$conn.Open()  
$ddlstmt = "CREATE TABLE Person( PersonId INT IDENTITY PRIMARY KEY, FirstName NVARCHAR(128) NOT NULL)" 
Write-host " " 
Write-host "SQL DDL command" 
$ddlstmt 
$command = New-Object -TypeName System.Data.SqlClient.SqlCommand($ddlstmt, $conn) 
Write-host "results" 
$command.ExecuteNonQuery() 
$conn.Close()
```

## Next steps

- If your runbooks aren't completing successfully, review [Troubleshoot Azure Automation managed identity issues (preview)](troubleshoot/managed-identity.md).

- If you need to disable a managed identity, see [Disable your Azure Automation account managed identity (preview)](disable-managed-identity-for-automation.md).

- For an overview of Azure Automation account security, see [Automation account authentication overview](automation-security-overview.md).
