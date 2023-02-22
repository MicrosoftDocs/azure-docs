---
title: Manage access to SQL Server 2022 system health and performance using Microsoft Purview DevOps policies, a type of RBAC policies.
description: Use Microsoft Purview DevOps policies to provision access to SQL Server 2022 system metadata, so IT operations personnel can monitor performance, health and audit security, while limiting the insider threat.
author: inward-eye
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: how-to
ms.date: 02/10/2023
ms.custom:
---
# Provision access to system metadata in Azure Arc-enabled SQL Server 2022

[DevOps policies](concept-policies-devops.md) are a type of Microsoft Purview access policies. They allow you to manage access to system metadata on data sources that have been registered for *Data use management* in Microsoft Purview. These policies are configured directly from the Microsoft Purview governance portal, and after they are saved, they get automatically published and then enforced by the data source. Microsoft Purview policies only manage access for Azure AD principals.

This how-to guide covers how to configure SQL Server 2022 to enforce policies created in Microsoft Purview. It covers onboarding with Azure Arc, enabling Azure AD on the SQL Server, and provisioning access to its system metadata (DMVs and DMFs) using the DevOps policies actions *SQL Performance Monitoring* or *SQL Security Auditing*.

## Prerequisites
[!INCLUDE [Access policies generic pre-requisites](./includes/access-policies-prerequisites-generic.md)]
[!INCLUDE [Access policies Arc enabled SQL Server pre-requisites](./includes/access-policies-prerequisites-arc-sql-server.md)]

## Microsoft Purview configuration
[!INCLUDE [Access policies generic configuration](./includes/access-policies-configuration-generic.md)]

### Register data sources in Microsoft Purview
The Azure Arc-enabled SQL Server data source needs to be registered first with Microsoft Purview, before policies can be created.

1. Sign in to Microsoft Purview Studio.

1. Navigate to the **Data map** feature on the left pane, select **Sources**, then select **Register**. Type "Azure Arc" in the search box and select **SQL Server on Azure Arc**. Then select **Continue**
![Screenshot shows how to select a source for registration.](./media/how-to-policies-data-owner-sql/select-arc-sql-server-for-registration.png)

1. Enter a **Name** for this registration. It is best practice to make the name of the registration the same as the server name in the next step.

1. select an **Azure subscription**, **Server name** and **Server endpoint**.

1. **Select a collection** to put this registration in. 

1. Enable Data Use Management. Data Use Management needs certain permissions and can affect the security of your data, as it delegates to certain Microsoft Purview roles to manage access to the data sources. **Go through the secure practices related to Data Use Management in this guide**: [How to enable Data Use Management](./how-to-enable-data-use-management.md)

1. Upon enabling Data Use Management, Microsoft Purview will automatically capture the **Application ID** of the App Registration related to this Azure Arc-enabled SQL Server if one has been configured. Come back to this screen and hit the refresh button on the side of it to refresh, in case the association between the Azure Arc-enabled SQL Server and the App Registration changes in the future.

1. Select **Register** or **Apply** at the bottom

Once your data source has the **Data Use Management** toggle *Enabled*, it will look like this picture.
![Screenshot shows how to register a data source for policy.](./media/how-to-policies-data-owner-sql/register-data-source-for-policy-arc-sql.png)

## Enable policies in Azure Arc-enabled SQL Server
[!INCLUDE [Access policies Arc enabled SQL Server configuration](./includes/access-policies-configuration-arc-sql-server.md)]

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

## Test the policy

The Azure AD Accounts referenced in the access policies should now be able to connect to any database in the server to which the policies are published.

### Force policy download
It is possible to force an immediate download of the latest published policies to the current SQL database by running the following command. The minimal permission required to run it is membership in ##MS_ServerStateManager##-server role.

```sql
-- Force immediate download of latest published policies
exec sp_external_policy_refresh reload
```  

### Analyze downloaded policy state from SQL
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

This section contains a reference of how actions in Microsoft Purview data policies map to specific actions in Azure Arc-enabled SQL Server.

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
Check the blogs, videos and related docs
* Blog: [Microsoft Purview DevOps policies enter General Availability](https://techcommunity.microsoft.com/t5/security-compliance-and-identity/microsoft-purview-devops-policies-enter-ga-simplify-access/ba-p/3674057)
* Blog: [Microsoft Purview DevOps policies enable at scale access provisioning for IT operations](https://techcommunity.microsoft.com/t5/microsoft-purview-blog/microsoft-purview-devops-policies-enable-at-scale-access/ba-p/3604725)
* Video: [DevOps policies quick overview](https://aka.ms/Microsoft-Purview-DevOps-Policies-Video)
* Video: [DevOps policies deep dive](https://youtu.be/UvClpdIb-6g)
* Video: [Pre-requisite for policies: The "Data use management" option](https://youtu.be/v_lOzevLW-Q)
* Doc: [Microsoft Purview DevOps policies on Azure SQL DB](./how-to-policies-devops-azure-sql-db.md)
* Doc: [Microsoft Purview DevOps policies on resource groups and subscriptions](./how-to-policies-devops-resource-group.md)
