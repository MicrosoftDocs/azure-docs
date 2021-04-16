---
title: Enable a managed identity for your Azure Automation account (preview)
description: This article describes how to set up managed identity for Azure Automation accounts.
services: automation
ms.subservice: process-automation
ms.date: 04/14/2021
ms.topic: conceptual
---
# Enable a managed identity for your Azure Automation account (preview)

This topic shows you how to create a managed identity for an Azure Automation account and how to use it to access other resources. For more information on how managed identity works with Azure Automation, see [Managed identities](automation-security-overview.md#managed-identities-preview).

## Prerequisites

- An Azure account and subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin. Both the managed identity and the target Azure resources that your runbook manages using that identity must be in the same Azure subscription.

- The latest version of Azure Automation account modules. Currently this is 1.6.0. (See [Az.Automation 1.6.0](https://www.powershellgallery.com/packages/Az.Automation/1.6.0) for details about this version.)

- An Azure resource that you want to access from your Automation runbook. This resource needs to have a role defined for the managed identity, which helps the Automation runbook authenticate access to the resource. To add roles, you need to be an owner for the resource in the corresponding Azure AD tenant.

- If you want to execute hybrid jobs using a managed identity, update the Hybrid Runbook Worker to the latest version. The minimum required versions are:

   - Windows Hybrid Runbook Worker: version 7.3.1125.0
   - Linux Hybrid Runbook Worker: version 1.7.4.0

## Enable system-assigned identity

>[!IMPORTANT]
>The new Automation account-level identity will override any previous VM-level system-assigned identities (which are described in [Use runbook authentication with managed identities](/automation-hrw-run-runbooks#runbook-auth-managed-identities)). If you're running hybrid jobs on Azure VMs that use a VM's system-assigned identity to access runbook resources, then the Automation account identity will be used for the hybrid jobs. This means your existing job execution may be affected if you've been using the Customer Managed Keys (CMK) feature of your Automation account.<br/><br/>If you wish to continue using the VM's managed identity, you shouldn't enable the Automation account-level identity. If you've already enabled it, you can disable the Automation account managed identity. See [Disable your Azure Automation account managed identity](https://docs.microsoft.com/azure/automation/disable-managed-identity-for-automation).

Setting up system-assigned identities for Azure Automation can be done one of two ways. You can either use the Azure portal, or the Azure REST API.

>[!NOTE]
>User-assigned identities are not supported yet.

### Enable system-assigned identity in Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to your Automation account and select **Identity** under **Account Settings**.

1. Set the **System assigned** option to **On** and press **Save**. When you're prompted to confirm, select **Yes**.

:::image type="content" source="media/managed-identity/managed-identity-on.png" alt-text="Enabling system-assigned identity in Azure portal.":::

Your Automation account can now use the system-assigned identity, which is registered with Azure Active Directory (Azure AD) and is represented by an object ID.

:::image type="content" source="media/managed-identity/managed-identity-object-id.png" alt-text="Managed identity object ID.":::

### Enable system-assigned identity through the REST API

You can configure a system-assigned managed identity to the Automation account by using the following REST API call.

```http
PATCH https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/resource-group-name/providers/Microsoft.Automation/automationAccounts/automation-account-name?api-version=2020-01-13-preview
```

Request body
```json
{ 
 "identity": 
 { 
  "type": "SystemAssigned" 
  } 
}
```

```json
{
 "name": "automation-account-name",
 "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/resource-group-name/providers/Microsoft.Automation/automationAccounts/automation-account-name",
 .
 .
 "identity": {
    "type": "SystemAssigned",
    "principalId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    "tenantId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
 },
.
.
}
```

|Property (JSON) | Value | Description|
|----------|-----------|------------|
| principalid | \<principal-ID\> | The Globally Unique Identifier (GUID) of the service principal object for the managed identity that represents your Automation account in the Azure AD tenant. This GUID sometimes appears as an "object ID" or objectID. |
| tenantid | \<Azure-AD-tenant-ID\> | The Globally Unique Identifier (GUID) that represents the Azure AD tenant where the Automation account is now a member. Inside the Azure AD tenant, the service principal has the same name as the Automation account. |

## Give identity access to Azure resources by obtaining a token

An Automation account can use its managed identity to get tokens to access other resources protected by Azure AD, such as Azure Key Vault. These tokens do not represent any specific user of the application. Instead, they represent the application that’s accessing the resource. In this case, for example, the token represents an Automation account.

Before you can use your system-assigned managed identity for authentication, set up access for that identity on the Azure resource where you plan to use the identity. To complete this task, assign the appropriate role to that identity on the target Azure resource.

This example uses Azure PowerShell to show how to assign the Contributor role in the subscription to the target Azure resource. The Contributor role is used as an example, and may or may not be required in your case.

```powershell
New-AzRoleAssignment -ObjectId <automation-Identity-object-id> -Scope "/subscriptions/<subscription-id>" -RoleDefinitionName "Contributor"
```

## Authenticate access with managed identity

After you enable the managed identity for your Automation account and give an identity access to the target resource, you can specify that identity in runbooks against resources that support managed identity. For identity support, use the Az cmdlet `Connect-AzAccount` cmdlet. See [Connect-AzAccount](/powershell/module/az.accounts/Connect-AzAccount) in the PowerShell reference.

```powershell
Connect-AzAccount -Identity
```

>[!NOTE]
>If your organization is still using the deprecated AzureRM cmdlets, you can use `Connect-AzureRMAccount -Identity`.

## Generate an access token without using Azure cmdlets

For HTTP Endpoints make sure of the following.
- The metadata header must be present and should be set to “true”.
- A resource must be passed along with the request, as a query parameter for a GET request and as form data for a POST request.
- The X-IDENTITY-HEADER should be set to the value of the environment variable IDENTITY_HEADER for Hybrid Runbook Workers. 
- Content Type for the Post request must be 'application/x-www-form-urlencoded'. 

### Sample GET request

```powershell
$resource= "?resource=https://management.azure.com/" 
$url = $env:IDENTITY_ENDPOINT + $resource 
$Headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]" 
$Headers.Add("X-IDENTITY-HEADER", $env:IDENTITY_HEADER) 
$Headers.Add("Metadata", "True") 
$accessToken = Invoke-RestMethod -Uri $url -Method 'GET' -Headers $Headers
Write-Output $accessToken.access_token
```

### Sample POST request
```powershell
$url = $env:IDENTITY_ENDPOINT  
$headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]" 
$headers.Add("X-IDENTITY-HEADER", $env:IDENTITY_HEADER) 
$headers.Add("Metadata", "True") 
$body = @{resource='https://management.azure.com/' } 
$accessToken = Invoke-RestMethod $url -Method 'POST' -Headers $headers -ContentType 'application/x-www-form-urlencoded' -Body $body 
Write-Output $accessToken.access_token
```

## Sample runbooks using managed identity

### Sample runbook to access a SQL database without using Azure cmdlets

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

### Sample runbook to access a key vault using Azure cmdlets

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

### Sample Python runbook to get a token
 
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

## Next steps

- If you need to disable a managed identity, see [Disable your Azure Automation account managed identity (preview)](disable-managed-identity-for-automation.md).

- For an overview of Azure Automation account security, see [Automation account authentication overview](automation-security-overview.md).