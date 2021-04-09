---
title: Enable and use managed identity for Automation
description: This article describes how to set up managed identity for Azure Automation accounts.
services: automation
ms.subservice: process-automation
ms.date: 04/06/2021
ms.topic: conceptual
---
# Enable and use managed identity for Automation

This topic shows you how to create a managed identity for an Automation Account and how to use it to access other resources. For more details on how managed identity works with Azure automation, see [Managed identities](automation-security-overview.md#managed-identities).

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, sign up for a [free Azure account](https://azure.microsoft.com/free/). Both the managed identity and the target Azure resource where you need access must use the same Azure subscription.

- The latest version of Automation account modules.

- To give a managed identity access to an Azure resource, you need to add a role to the target resource for that identity. To add roles, you need to be an owner for the target resource in the corresponding Azure AD tenant.

- A target Azure resource that you want to access. On this resource, you'll add a role for the managed identity, which helps the Automation runbook authenticate access to the target resource.

- If you want to execute hybrid jobs using identity, update the Windows and Linux Hybrid workers to the latest version.

## Enable system-assigned identity

>[!NOTE]
>Azure currently supports only system-assigned identities for both Cloud and Hybrid jobs. User-assigned identities are not supported yet.

Setting up system-assigned identities for Automation can be done one of two ways. You can either use the Azure portal, or the Azure REST API.

### Enable system-assigned identity in Azure portal

1. In the Azure portal, go to the Automation account you'll be using.

1. On the Automation Account menu, under **Account Settings**, select **Identity**. Set the **System assigned** switch to **On** and press **Save**. When you're prompted to confirm, select **Yes**.

:::image type="content" source="media/managed-identity/managed-identity-on.png" alt-text="Enabling system-assigned identity in Azure portal.":::

Your Automation account can now use the system-assigned identity, which is registered with Azure Active Directory (Azure AD) and is represented by an object ID.

:::image type="content" source="media/managed-identity/managed-identity-object-id.png" alt-text="Managed identity object ID.":::

### Enable system-assigned identity through REST API

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
 ..
 "identity": {
    "type": "SystemAssigned",
    "principalId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    "tenantId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
 },
..
}
```

|Property (JSON) | Value | Description|
|----------|-----------|------------|
| principalid | \<principal-ID\> | The Globally Unique Identifier (GUID) of the service principal object for the managed identity that represents your automation account in the Azure AD tenant. This GUID sometimes appears as an "object ID" or objectID. |
| tenantid | \<Azure-AD-tenant-ID\> | The Globally Unique Identifier (GUID) that represents the Azure AD tenant where the automation account is now a member. Inside the Azure AD tenant, the service principal has the same name as the automation account. |

## Give identity access to Azure resources by obtaining a token

An Automation Account can use its managed identity to get tokens to access other resources protected by Azure AD, such as Azure Key Vault. These tokens do not represent any specific user of the application. Instead, they represent the application that’s accessing the resource. For example, in this case, the token represents an Automation Account.
Before you can use your system managed identity for authentication, set up access for that identity on the Azure resource where you plan to use the identity . To complete this task, assign the appropriate role to that identity on the target Azure resource.
As an example, Azure Automation identity would require get, recover, wrapKey, UnwrapKey permissions on the Key vault.

### You can do it via cmdlets

```powershell
Set-AzKeyVaultAccessPolicy -VaultName <Key-Vault-name> -ResourceGroupName <resource-group-name> -ObjectId <automation-object-ID> -PermissionsToSecrets <permissions>
```

## Authenticate access with managed identity for a cloud job

After you enable managed identity for your automation account and give an identity access to the target resource or entity, you can use that identity in runbooks against resources that support managed identity. For identity support using, use the Az cmdlet `Connect-AzAccount -Identity` cmdlet. See [Set-AzKeyVaultAccessPolicy](/powershell/module/az.keyvault/set-azkeyvaultaccesspolicy) in the PowerShell reference.

>[!NOTE]
>If your organization is still using the deprecated AzureRM cmdlets, you can use `Connect-AzureRMAccount -Identity`.

If you're running a Hybrid job, the Sandbox communicates directly with the job runtime data service (JRDS). A JRDS endpoint is used by the hybrid worker to start/stop runbooks, download the runbooks to the worker, and to send the job log stream back to the Automation service. There is no difference in using cmdlets between Hybrid jobs and Cloud Jobs. However, in the case of a Hybrid job , when trying to fetch an MSI token from REST Endpoint at MSI_ENDPOINT an additional header secret must be set with the value of $MSI_SECRET.

## Generate an access token without using Azure cmdlets

For HTTP Endpoints make sure of the following.
- Metadata header must be present and should be equal to “true”.
- The X-Forwarded-For header should not be present. 
- Resource must be passed along with the request (as a query parameter for a GET request and as form data for a POST request.
- The secret header should be set to MSISecret for Hybrid Workers. 
- Content Type for the Post request must be 'application/x-www-form-urlencoded'. 

### Sample GET request

```powershell
$resource= "?resource=https://management.azure.com/" 
$url = $env:MSI_ENDPOINT + $ resource 
Invoke-RestMethod -Uri $url -Method 'GET' -Headers @{"Metadata"="true"} 
```

### Sample POST request
```powershell
$url = $env:MSI_ENDPOINT  
$headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]" 
$headers.Add("secret", $env:MSI_SECRET) 
$headers.Add("Metadata", "True") 
$body = @{resource='https://management.azure.com/' } 
Invoke-RestMethod $url -Method 'POST' -Headers $headers -ContentType 'application/x-www-form-urlencoded' -Body $body 
```

### Sample Runbook to access SQL Database without using Azure cmdlets

```powershell
$queryParameter = "?resource=https://database.windows.net/" 
$url = $env:MSI_ENDPOINT + $queryParameter 
$content =[System.Text.Encoding]::Default.GetString((Invoke-WebRequest -UseBasicParsing -Uri $url -Method 'GET' -Headers @{"Metadata"="true"}).RawContentStream.ToArray()) | ConvertFrom-Json 
$Token = $content.access_token 
echo "The managed identities for Azure resources access token is $Token" 
$SQLServerName = "msiserver"    # Azure SQL logical server name  
$DatabaseName = "MSIDemo"     # Azure SQL database name 
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

### Sample Runbook to access Key vault using Azure cmdlets

```powershell
Write-Output "Connecting to azure via  Connect-AzureRMAccount -Identity" 
Connect-AzureRMAccount -Identity 
Write-Output "Sucessfully Connected with Autamtion account's Managed Identity" 
Write-Output "Trying to fetch value form Key valut using MI, Make sure you have given correct access to Managed Identity" 
$secret = Get-AzureKeyVaultSecret -VaultName 'MSITestKeyVault' -Name 'KeyName' 

$ssPtr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secret.SecretValue) 
try { 
  $secretValueText = [System.Runtime.InteropServices.Marshal]::PtrToStringBSTR($ssPtr) 
    Write-Output $secretValueText 
} finally { 
    [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ssPtr) 
}
```

### Sample Python runbook on a Hybrid worker to get a token
 
```python
 #!/usr/bin/env python3 
import os 
import requests  
# printing environment variables 
endPoint = os.getenv('MSI_ENDPOINT')+"?resource=https://management.azure.com/" 
secret = os.getenv('MSI_SECRET') 
print(endPoint) 
print(secret) 
payload={} 
headers = { 
  'secret': secret, 
  'Metadata': 'True' 
} 
response = requests.request("GET", endPoint, headers=headers, data=payload) 
print(response.text) 
```