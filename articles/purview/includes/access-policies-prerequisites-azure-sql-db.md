---
author: inward-eye
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: include
ms.date: 10/10/2022
ms.custom: 
---

- Create a new Azure SQL Database or use an existing one in one of the currently available regions for this preview feature. You can [follow this guide to create a new Azure SQL Database](/azure/azure-sql/database/single-database-create-quickstart).

**Enforcement of policies for this data source is currently available in the following regions for Microsoft Purview**
No restrictions, all Microsoft Purview regions are supported

**Enforcement of Microsoft Purview policies is available only in the following regions for Azure SQL Database**
- East US
- East US2
- South Central US
- West Central US
- Canada Central
- Brazil South
- West Europe
- North Europe
- France Central
- UK South
- Central India
- Japan East
- South East Asia
- Australia East

#### Configure the Azure SQL Database for policies from Microsoft Purview
You need to configure an Azure Active Directory Admin for the Azure SQL Server to honor policies from Microsoft Purview. In Azure portal, navigate to the Azure SQL Server that hosts the Azure SQL Database and then navigate to Azure Active Directory on the side menu. Set an Admin name and then select **Save**. See screenshot:
![Screenshot shows how to assign Active Directory Admin to Azure SQL Server.](../media/how-to-policies-data-owner-sql/assign-active-directory-admin-azure-sql-db.png)

Then navigate to Identity on the side menu. Under System assigned managed identity check status to *On* and then select **Save**. See screenshot:
![Screenshot shows how to assign system managed identity to Azure SQL Server.](../media/how-to-policies-data-owner-sql/assign-identity-azure-sql-db.png)

You'll also need to enable (and verify) external policy based authorization on the Azure SQL server. You can do this in PowerShell:

```powershell
Connect-AzAccount -UseDeviceAuthentication -TenantId xxxx-xxxx-xxxx-xxxx-xxxx -SubscriptionId xxxx-xxxx-xxxx-xxxx

$server = Get-AzSqlServer -ResourceGroupName "RESOURCEGROUPNAME" -ServerName "SERVERNAME"

#Initiate the call to the REST API to set externalPolicyBasedAuthorization to true
Invoke-AzRestMethod -Method PUT -Path "$($server.ResourceId)/externalPolicyBasedAuthorizations/MicrosoftPurview?api-version=2021-11-01-preview" -Payload '{"properties":{"externalPolicyBasedAuthorization":true}}'

# Now, verify that the property "externalPolicyBasedAuthorization" has been set to true
Invoke-AzRestMethod -Method GET -Path "$($server.ResourceId)/externalPolicyBasedAuthorizations/MicrosoftPurview?api-version=2021-11-01-preview"
```
After issuing the GET, you should see in the response, under Content, "properties":{"externalPolicyBasedAuthorization":true}
