---
title: Self-service policies for Azure SQL Database (preview)
description: Step-by-step guide on how self-service policy is created for Azure SQL Database through Microsoft Purview access policies.
author: bjspeaks
ms.author: blessonj
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: how-to
ms.date: 11/11/2022
ms.custom: references_regions, event-tier1-build-2022
---
# Self-service policies for Azure SQL Database (preview)

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

[Self-service policies](concept-self-service-data-access-policy.md) allow you to manage access from Microsoft Purview to data sources that have been registered for **Data Use Management**.

This how-to guide describes how self-service policies get created in Microsoft Purview to enable access to Azure SQL Database. The following actions are currently enabled: *Read Tables*, and *Read Views*. 

> [!CAUTION]
> *Ownership chaining* must exist for *select* to work on Azure SQL Database *views*. 

## Prerequisites
[!INCLUDE [Access policies generic pre-requisites](./includes/access-policies-prerequisites-generic.md)]
[!INCLUDE [Access policies Azure SQL DB pre-requisites](./includes/access-policies-prerequisites-azure-sql-db.md)]

## Microsoft Purview Configuration
[!INCLUDE [Access policies generic configuration](./includes/access-policies-configuration-generic.md)]

### Register the data sources in Microsoft Purview
The Azure SQL Database resources need to be registered first with Microsoft Purview to later define access policies. You can follow these guides:

[Register and scan Azure SQL DB](./register-scan-azure-sql-database.md)

After you've registered your resources, you'll need to enable data use management. Data use management can affect the security of your data, as it delegates to certain Microsoft Purview roles to manage access to the data sources. **Go through the secure practices related to data use management in this guide**:

[How to enable data use management](./how-to-enable-data-use-management.md)

Once your data source has the **Data use management** toggle *Enabled*, it will look like this picture. This will enable the access policies to be used with the given SQL server and all its contained databases.
![Screenshot shows how to register a data source for policy.](./media/how-to-policies-data-owner-sql/register-data-source-for-policy-azure-sql-db.png)


## Create a self-service data access request

[!INCLUDE [request access to datasets](includes/how-to-self-service-request-access.md)]


>[!Important]
> - Publish is a background operation. It can take up to **5 minutes** for the changes to be reflected in this data source.
> - Changing a policy does not require a new publish operation. The changes will be picked up with the next pull.


## View a self-service Policy

To view the policies you've created, follow the article to [view the self-service policies](how-to-view-self-service-data-access-policy.md).


### Test the policy

The Azure Active Directory Account, group, MSI, or SPN for which the self-service policies were created, should now be able to connect to the database on the server and execute a select query against the requested table or view.

#### Force policy download
It's possible to force an immediate download of the latest published policies to the current SQL database by running the following command. The minimal permission required to run it's membership in ##MS_ServerStateManager##-server role.

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

This section contains a reference of how actions in Microsoft Purview data policies map to specific actions in Azure SQL Database.

| **Microsoft Purview policy action** | **Data source specific actions**     |
|-------------------------------------|--------------------------------------|
|||
| *Read* |Microsoft.Sql/sqlservers/Connect |
||Microsoft.Sql/sqlservers/databases/Connect |
||Microsoft.Sql/Sqlservers/Databases/Schemas/Tables/Rows|
||Microsoft.Sql/Sqlservers/Databases/Schemas/Views/Rows |
|||

## Next steps
Check blog, demo and related how-to guides
- [self-service policies](concept-self-service-data-access-policy.md) 
- [What are Microsoft Purview workflows](concept-workflow.md)
- [Self-service data access workflow for hybrid data estates](how-to-workflow-self-service-data-access-hybrid.md)
