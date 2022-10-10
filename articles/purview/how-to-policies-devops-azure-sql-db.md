---
title: Provision access to Azure SQL Database for DevOps actions (preview)
description: Step-by-step guide on provisioning access to Azure SQL Database through Microsoft Purview DevOps policies
author: inward-eye
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: how-to
ms.date: 10/10/2022
ms.custom: references_regions
---
# Provision access to Azure SQL Database for DevOps actions (preview)

> [!IMPORTANT]
> This feature is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This how-to guide shows how to provision access from Microsoft Purview to Azure SQL DB system metadata (DMVs and DMFs) via *SQL Performance Monitoring* or *SQL Security Auditing* actions. Microsoft Purview access policies apply to Azure AD Accounts only.

## Prerequisites
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Create a new, or use an existing Microsoft Purview account. You can [follow our quick-start guide to create one](./create-microsoft-purview-portal.md).
- Provide the subscription ID and name of the Microsoft Purview account to the Microsoft program manager driving this private preview so that it can be enabled for you to test
- Create a new, or use an existing resource group, and place new data sources under it. [Follow this guide to create a new resource group](../azure-resource-manager/management/manage-resource-groups-portal.md)
- Create a new Azure SQL Database or use an existing one in one of the currently available regions for this preview feature. You can [follow this guide to create a new Azure SQL DB](/azure/azure-sql/database/single-database-create-quickstart.md).

**Enforcement of policies for this data source is currently available in the following regions for Microsoft Purview**
No restrictions, all Microsoft Purview regions are supported

**Enforcement of Microsoft Purview policies is available only in the following regions for Azure SQL Database**
- East US
- East US2
- South Central US
- West US3
- Canada Central
- Brazil South
- West Europe
- North Europe
- UK South
- Central India
- Australia East

### Azure SQL Database configuration
Azure SQL Database needs an Azure Active Directory Admin to be configured to honor policies from Microsoft Purview. In Azure portal navigate to the Azure SQL Server that hosts the Azure SQL DB and then navigate to Azure Active Directory on the side menu. Set an Admin name and then select **Save**. See screenshot:
![Screenshot shows how to assign Active Directory Admin to Azure SQL Server.](./media/how-to-policies-data-owner-sql/assign-active-directory-admin-azure-sql-db.png)

Then navigate to Identity on the side menu. Under System assigned managed identity check status to *On* and then select **Save**. See screenshot:
![Screenshot shows how to assign system managed identity to Azure SQL Server.](./media/how-to-policies-data-owner-sql/assign-identity-azure-sql-db.png)

You'll also need to enable (and verify) external policy based authorization on the Azure SQL server. You can do this in PowerShell:

```powershell
Connect-AzAccount -UseDeviceAuthentication -TenantId xxxx-xxxx-xxxx-xxxx-xxxx -SubscriptionId xxxx-xxxx-xxxx-xxxx

$server = Get-AzSqlServer -ResourceGroupName "RESOURCEGROUPNAME" -ServerName "SERVERNAME"

# Initiate the call to the REST API to set externalPolicyBasedAuthorization to true
Invoke-AzRestMethod -Method PUT -Path "$($server.ResourceId)/externalPolicyBasedAuthorizations/MicrosoftPurview?api-version=2021-11-01-preview" -Payload '{"properties":{"externalPolicyBasedAuthorization":true}}'

# Now, verify that the property "externalPolicyBasedAuthorization" has been set to true
Invoke-AzRestMethod -Method GET -Path "$($server.ResourceId)/externalPolicyBasedAuthorizations/MicrosoftPurview?api-version=2021-11-01-preview"
```
After issuing the GET, you should see in the response, under Content, "properties":{"externalPolicyBasedAuthorization":true}

### Register the data sources in Microsoft Purview
The Azure SQL Database data source needs to be registered first with Microsoft Purview, before access policies can be created. You can follow these guides:

[Register and scan Azure SQL Database](./register-scan-azure-sql-database.md)

After you've registered your resources, you'll need to enable Data Use Management. Data Use Management needs certain permissions and can affect the security of your data, as it delegates to certain Microsoft Purview roles to manage access to the data sources. **Go through the secure practices related to Data Use Management in this guide**: [How to enable Data Use Management](./how-to-enable-data-use-management.md)

Once your data source has the **Data Use Management** toggle *Enabled*, it will look like this picture. This will enable the access policies to be used with the given data source
![Screenshot shows how to register a data source for policy.](./media/how-to-policies-data-owner-sql/register-data-source-for-policy-azure-sql-db.png)


## Create a new DevOps policy
Follow this link for the steps to [create a new DevOps policy in Microsoft Purview](how-to-policies-devops-authoring-generic.md#create-a-new-devops-policy).

## List DevOps policies
Follow this link for the steps to [list DevOps policies in Microsoft Purview](how-to-policies-devops-authoring-generic.md#list-devops-policies).

## Update a DevOps policy
Follow this link for the steps to [update a DevOps policies in Microsoft Purview](how-to-policies-devops-authoring-generic.md#update-a-devops-policy).

## Delete a DevOps policy
Follow this link for the steps to [delete a DevOps policies in Microsoft Purview](how-to-policies-devops-authoring-generic.md#delete-a-devops-policy).

>[!Important]
> DevOps policies are auto-published and changes can take up to **5 minutes** to be enforced by the data source.


### Test the policy
The Azure AD Accounts referenced in the access policies should now be able to connect to any database in the server to which the policies are published.

#### Force policy download
It is possible to force an immediate download of the latest published policies to the current SQL database by running the following command. The minimal permission required to run it is membership in ##MS_ServerStateManager##-server role.

```sql
-- Force immediate download of latest published policies
exec sp_external_policy_refresh reload
```  

#### Analyze downloaded policy state from SQL
The following DMVs can be used to analyze which policies have been downloaded and are currently assigned to Azure AD accounts. The minimal permission required to run them is VIEW DATABASE SECURITY STATE - or assigned Action Group *SQL Security Auditor*.

```sql

-- Lists generally supported actions
SELECT * FROM sys.dm_server_external_policy_actions

-- Lists the roles that are part of a policy published to this server
SELECT * FROM sys.dm_server_external_policy_roles

-- Lists the links between the roles and actions, could be used to join the two
SELECT * FROM sys.dm_server_external_policy_role_actions

-- Lists all Azure AD principals that were given connect permissions  
SELECT * FROM sys.dm_server_external_policy_principals

-- Lists Azure AD principals assigned to a given role on a given resource scope
SELECT * FROM sys.dm_server_external_policy_role_members

-- Lists Azure AD principals, joined with roles, joined with their data actions
SELECT * FROM sys.dm_server_external_policy_principal_assigned_actions
```

## Additional information

### Policy action mapping

This section contains a reference of how actions in Microsoft Purview data policies map to specific actions in Azure SQL DB.

| **Microsoft Purview policy action** | **Data source specific actions**     |
|-------------------------------------|--------------------------------------|
|                                     |                                      |
| *SQL Performance Monitor* |Microsoft.Sql/sqlservers/Connect |
||Microsoft.Sql/sqlservers/databases/Connect |
||Microsoft.Sql/sqlservers/databases/SystemViewsAndFunctions/DatabasePerformanceState/rows/select |
||Microsoft.Sql/sqlservers/databases/SystemViewsAndFunctions/ServerPerformanceState/rows/select |
|||               
| *SQL Security Auditor* |Microsoft.Sql/sqlservers/Connect |
||Microsoft.Sql/sqlservers/databases/Connect |
||Microsoft.Sql/sqlservers/SystemViewsAndFunctions/ServerSecurityState/rows/select |
||Microsoft.Sql/sqlservers/databases/SystemViewsAndFunctions/DatabaseSecurityState/rows/select |
||Microsoft.Sql/sqlservers/SystemViewsAndFunctions/ServerSecurityMetadata/rows/select |
||Microsoft.Sql/sqlservers/databases/SystemViewsAndFunctions/DatabaseSecurityMetadata/rows/select |
|||

## Next steps
Check the blog and related docs
* Blog: [Microsoft Purview DevOps policies enable at scale access provisioning for IT operations](https://techcommunity.microsoft.com/t5/microsoft-purview-blog/microsoft-purview-devops-policies-enable-at-scale-access/ba-p/3604725)
* Video: [Pre-requisite for policies: The "Data use management" option](https://youtu.be/v_lOzevLW-Q)
* Video: [Microsoft Purview DevOps policies on data sources and resource groups](https://youtu.be/YCDJagrgEAI)
* Video: [Reduce the effort with Microsoft Purview DevOps policies on resource groups](https://youtu.be/yMMXCeIFCZ8)
* Doc: [Microsoft Purview DevOps policies on Arc-enabled SQL Server](./how-to-policies-devops-arc-sql-server.md)
* Blog: [Deep dive on SQL Performance Monitor and SQL Security Auditor permissions](https://techcommunity.microsoft.com/t5/sql-server-blog/new-granular-permissions-for-sql-server-2022-and-azure-sql-to/ba-p/3607507)
