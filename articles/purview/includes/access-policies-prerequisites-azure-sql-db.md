---
author: inward-eye
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: include
ms.date: 08/11/2022
ms.custom: 
---

- Create a new Azure SQL DB or use an existing one in one of the currently available regions for this preview feature. You can [follow this guide to create a new Azure SQL DB](/azure/azure-sql/database/single-database-create-quickstart).

**Enforcement of Microsoft Purview policies is available only in the following regions for Azure SQL Database**
- East US
- East US2
- West US3
- South Central US
- West Central US
- Canada Central
- North Europe
- West Europe
- France Central
- UK South
- Central India
- Australia East

### Azure SQL Database configuration
Each Azure SQL Database server needs a Managed Identity assigned to it. In Azure portal navigate to the Azure SQL Server that hosts the Azure SQL DB and then navigate to Identity on the side menu. Under System assigned managed identity check status to *On* and save. See screenshot:
![Screenshot shows how to assign system managed identity to Azure SQL Server.](../media/how-to-policies-data-owner-sql/assign-identity-azure-sql-db.png)

You'll also need to enable external policy based authorization on the server. You can do this in PowerShell:

```powershell
Connect-AzAccount -TenantId xxxx-xxxx-xxxx-xxxx-xxxx -SubscriptionId xxxx-xxxx-xxxx-xxxx

$server = Get-AzSqlServer -ResourceGroupName "RESOURCEGROUPNAME" -ServerName "SERVERNAME"

#Initiate the call to the REST API to set externalPolicyBasedAuthorization to true
Invoke-AzRestMethod -Method PUT -Path "$($server.ResourceId)/externalPolicyBasedAuthorizations/MicrosoftPurview?api-version=2021-11-01-preview" -Payload '{"properties":{"externalPolicyBasedAuthorization":true}}'

#Verify that the propery has been set
Invoke-AzRestMethod -Method GET -Path "$($server.ResourceId)/externalPolicyBasedAuthorizations/MicrosoftPurview?api-version=2021-11-01-preview"
```
