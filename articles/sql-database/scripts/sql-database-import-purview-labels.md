---
title: Classify your Azure SQL data using Microsoft Purview labels
description: Import your classification from Microsoft Purview in your Azure SQL Database and Azure Synpase Analytics 
services: sql-database
ms.service: sql-database
ms.subservice: security
ms.custom: subject-rbac-steps
ms.devlang: azurepowershell
ms.topic: sample
author: davidtrigano
ms.author: datrigan
ms.reviewer: vanto, mathoma
ms.date: 02/17/2021
---

# Classify your Azure SQL data using Microsoft Purview labels

This document describes how to add Microsoft Purview labels in your Azure SQL Database and Azure Synapse Analytics (formerly SQL DW).

## Create an application

1. From the Azure portal, open your **Microsoft Entra ID**.
2. Under **Manage**, select **App registration**.
3. Create a new Microsoft Entra app by selecting **New Application**.
4. Enter a name for your application, and select **Register**.
5. After your application is created, open **Certificates & secrets** under **Manager**.
6. Create a new client secret by selecting on **New client secret** under **Client secrets**.
7. Add a description to your client secret, select an expiration period, and select **Add**.
8. Keep the **Value** for future use.

   > [!NOTE]
   > Once you close the page, the value will be masked. You won’t be able to retrieve the client secret’s Value if you go back to the page. You will have to generate a new client secret.

9. Go back to the Overview page of your newly created application, and copy the following values for future use:
    1. Application (client) ID
    1. Directory (tenant) ID

## Provide permissions to the application

1. In your Azure portal, search for **Microsoft Purview accounts**.

1. Select the Microsoft Purview account where your SQL databases and Synapse are classified.

1. Assign the Microsoft Purview Data Reader role to the application you previously created.

    For detailed steps, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md).

## Extract the classification from Microsoft Purview

1. Open your Microsoft Purview account, and in the Home page, search for your Azure SQL Database or Azure Synapse Analytics where you want to copy the labels.
2. Copy the qualifiedName under **Properties**, and keep it for future use.
3. Open your PowerShell shell.

4. Copy one of the below scripts according to your SQL asset type (Azure SQL Database or Azure Synapse).
5. Fill the parameters with the values you copied above:

   a. $TenantID: section 1, step 9
   
   b. $ClientID: section 1, step 9
   
   c. $SecretID: section 1, step 8
   
   d. $purviewAccountName: section 2, step 2
   
   e. $sqlDatabaseName: section 3, step 2

6. Copy the output of the script for future use.

### For Azure SQL Database

```powershell
# Replace the values below with the relevant values for your environment
$TenantID = 'your_tenant_id'
$ClientID = 'your_client_id'
$SecretID = 'your_secret_id'
$purviewAccountName='purview_account_name'
$sqlDatabaseName="mssql://sql_server_name.database.windows.net/db_name"

###############################################################################
# Get an access accessToken, and build REST Request Header.
###############################################################################
$cmdletParameters = @{
  Method  = "POST"
  URI     = "https://login.microsoftonline.com/$TenantID/oauth2/token"
  Headers = @{
    "Content-Type" = 'application/x-www-form-urlencoded'
  }
  Body    = "client_id=$ClientID&client_secret=$SecretID&resource=https://purview.azure.net&grant_type=client_credentials"
}

$invokeResult = Invoke-RestMethod @cmdletParameters;
$accessToken = $invokeResult.access_token; 

$restRequestHeader = @{
  "authorization" = "Bearer $accessToken"
};

###############################################################################
# Get database entity.
###############################################################################
$getDatabaseEntityEntryEndpoint = "https://" + $purviewAccountName + ".catalog.purview.azure.com/api/atlas/v2/entity/uniqueAttribute/type/azure_sql_db?attr:qualifiedName=" + $sqlDatabaseName;
$cmdletParameters = @{
  Method      = "Get"
  Uri         = $getDatabaseEntityEntryEndpoint
  Headers     = $restRequestHeader
  ContentType = "application/json"        
};

$invokeResult =  Invoke-RestMethod @cmdletParameters;
$referredEntities = $invokeResult.referredEntities;
if ($null -eq $referredEntities) {
  Write-Output "No referred entities found under database entity!";
  exit;
}

###############################################################################
# Iterate database referred entities, find classified columns, and build T-SQL.
###############################################################################
foreach ($referredEntity in $referredEntities.psobject.Properties.GetEnumerator()) {
  $typeName = $referredEntity.Value.typeName;
  if ($null -eq $typeName -or $typeName -ne 'azure_sql_column') {
    continue;
  }
  
  $classifications = $referredEntity.Value.classifications;
  if ($null -eq $classifications) {
    continue;
  }
  
  foreach ($classification in $classifications.GetEnumerator())
  {
    if ($classification.typeName -notmatch 'Microsoft\.Label\.(?<labelId>.+)') { 
        continue;
    }

      $labelId = $Matches.labelId -replace "_", "-";

      $attributes = $referredEntity.Value.attributes;
      if ($null -eq $attributes) {
        continue;
      }
    
      $qualifiedName = $attributes.qualifiedName;
      if ($qualifiedName -notmatch '.+\.database\.windows\.net\/.+\/(?<schemaName>.+)\/(?<tableName>.+)#(?<columnName>.+)') {
        continue;
      }

      $schemaName = $Matches.schemaName;
      $tableName = $Matches.tableName;
      $columnName = $Matches.columnName;
      
      Write-Output "ADD SENSITIVITY CLASSIFICATION TO ${schemaName}.${tableName}.${columnName} WITH (LABEL='Microsoft Purview Label', LABEL_ID='${labelId}');";
  }
}
```

### For Azure Synapse Analytics

```powershell
# Replace the values below with the relevant values for your environment
$TenantID = 'your_tenant_id'
$ClientID = 'your_client_id'
$SecretID = 'your_secret_id'
$purviewAccountName='purview_account_name'
$dwDatabaseName="mssql://dw_server_name.database.windows.net/dw_name"

###############################################################################
# Get an access accessToken, and build REST Request Header.
###############################################################################
$cmdletParameters = @{
  Method  = "POST"
  URI     = "https://login.microsoftonline.com/$TenantID/oauth2/token"
  Headers = @{
    "Content-Type" = 'application/x-www-form-urlencoded'
  }
  Body    = "client_id=$ClientID&client_secret=$SecretID&resource=https://purview.azure.net&grant_type=client_credentials"
}

$invokeResult = Invoke-RestMethod @cmdletParameters;
$accessToken = $invokeResult.access_token; 

$restRequestHeader = @{
  "authorization" = "Bearer $accessToken"
};

###############################################################################
# Get database entity.
###############################################################################
$getDatabaseEntityEntryEndpoint = "https://" + $purviewAccountName + ".catalog.purview.azure.com/api/atlas/v2/entity/uniqueAttribute/type/azure_sql_dw?attr:qualifiedName=" + $dwDatabaseName;
$cmdletParameters = @{
  Method      = "Get"
  Uri         = $getDatabaseEntityEntryEndpoint
  Headers     = $restRequestHeader
  ContentType = "application/json"        
};

$invokeResult =  Invoke-RestMethod @cmdletParameters;
$referredEntities = $invokeResult.referredEntities;
if ($null -eq $referredEntities) {
  Write-Output "No referred entities found under database entity!";
  exit;
}

###############################################################################
# Iterate database referred entities, find classified columns, and build T-SQL.
###############################################################################
foreach ($referredEntity in $referredEntities.psobject.Properties.GetEnumerator()) {
  $typeName = $referredEntity.Value.typeName;
  if ($null -eq $typeName -or $typeName -ne 'azure_sql_dw_column') {
    continue;
  }
  
  $classifications = $referredEntity.Value.classifications;
  if ($null -eq $classifications) {
    continue;
  }
  
  foreach ($classification in $classifications.GetEnumerator())
  {
    if ($classification.typeName -notmatch 'Microsoft\.Label\.(?<labelId>.+)') { 
        continue;
    }

      $labelId = $Matches.labelId -replace "_", "-";

      $attributes = $referredEntity.Value.attributes;
      if ($null -eq $attributes) {
        continue;
      }
    
      $qualifiedName = $attributes.qualifiedName;
      if ($qualifiedName -notmatch '.+\.database\.windows\.net\/.+\/(?<schemaName>.+)\/(?<tableName>.+)#(?<columnName>.+)') {
        continue;
      }

      $schemaName = $Matches.schemaName;
      $tableName = $Matches.tableName;
      $columnName = $Matches.columnName;
      
      Write-Output "ADD SENSITIVITY CLASSIFICATION TO ${schemaName}.${tableName}.${columnName} WITH (LABEL='Microsoft Purview Label', LABEL_ID='${labelId}');";
  }
}
```

## Run the T-SQL command on your SQL asset

1. Connect to your Azure SQL Database or your Azure Synapse using your tool of choice.
2. Run the T-SQL command you copied from the previous section.

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](/powershell/).

For more information on Microsoft Purview, see [Microsoft Purview documentation](../../purview/index.yml).
