---
title: Provision access by data owner for Azure SQL Database (preview)
description: Step-by-step guide on how data owners can configure access for Azure SQL Database through Microsoft Purview access policies.
author: inward-eye
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: how-to
ms.date: 03/17/2023
ms.custom: references_regions, event-tier1-build-2022
---
# Provision access by data owner for Azure SQL Database (preview)

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

[Data owner policies](concept-policies-data-owner.md) are a type of Microsoft Purview access policies. They allow you to manage access to user data in sources that have been registered for *Data Use Management* in Microsoft Purview. These policies can be authored directly in the Microsoft Purview governance portal, and after publishing, they get enforced by the data source.

This guide covers how a data owner can delegate authoring policies in Microsoft Purview to enable access to Azure SQL Database. The following actions are currently enabled: *Read*. *Modify* is not supported at this point.

## Prerequisites
[!INCLUDE [Access policies generic pre-requisites](./includes/access-policies-prerequisites-generic.md)]
[!INCLUDE [Access policies Azure SQL Database pre-requisites](./includes/access-policies-prerequisites-azure-sql-db.md)]

## Microsoft Purview configuration
[!INCLUDE [Access policies generic configuration](./includes/access-policies-configuration-generic.md)]

### Register the data sources in Microsoft Purview
The Azure SQL Database data source needs to be registered first with Microsoft Purview before creating access policies. You can follow these guides:

[Register and scan Azure SQL Database](./register-scan-azure-sql-database.md)

After you've registered your resources, you'll need to enable Data Use Management. Data Use Management can affect the security of your data, as it delegates to certain Microsoft Purview roles to manage access to the data sources. **Go through the secure practices related to Data Use Management in this guide**:
[How to enable Data Use Management](./how-to-enable-data-use-management.md)

Once your data source has the **Data Use Management** toggle *Enabled*, it will look like this screenshot. This will enable the access policies to be used with the given Azure SQL server and all its contained databases.
![Screenshot shows how to register a data source for policy.](./media/how-to-policies-data-owner-sql/register-data-source-for-policy-azure-sql-db.png)

[!INCLUDE [Access policies Azure SQL Database pre-requisites](./includes/access-policies-configuration-azure-sql-db.md)]

## Create and publish a data owner policy

Execute the steps in the **Create a new policy** and **Publish a policy** sections of the [data-owner policy authoring tutorial](./how-to-policies-data-owner-authoring-generic.md#create-a-new-policy). The result will be a data owner policy similar to the example shown.

**Example: Read policy**. This policy assigns the Azure AD principal 'Robert Murphy' to the *SQL Data reader* action, in the scope of SQL server *relecloud-sql-srv2*. This policy has also been published to that server. Note that policies related to this action are supported below server level (e.g., database, table)

![Screenshot shows a sample data owner policy giving Data Reader access to an Azure SQL Database.](./media/how-to-policies-data-owner-sql/data-owner-policy-example-azure-sql-db-data-reader.png)


>[!Important]
> - Publish is a background operation. It can take up to **5 minutes** for the changes to be reflected in this data source.
> - Changing a policy does not require a new publish operation. The changes will be picked up with the next pull.


## Unpublish a data owner policy
Follow this link for the steps to [unpublish a data owner policy in Microsoft Purview](how-to-policies-data-owner-authoring-generic.md#unpublish-a-policy).

## Update or delete a data owner policy
Follow this link for the steps to [update or delete a data owner policy in Microsoft Purview](how-to-policies-data-owner-authoring-generic.md#update-or-delete-a-policy).

## Test the policy
After creating the policy, any of the Azure AD users in the Subject should now be able to connect to the data sources in the scope of the policy. To test, use SSMS or any SQL client and try to query. Attempt access to a SQL table you have provided read access to.

If you require additional troubleshooting, see the [Next steps](#next-steps) section in this guide.

## Role definition detail
This section contains a reference of how relevant Microsoft Purview data policy roles map to specific actions in SQL data sources.

| **Microsoft Purview policy role definition** | **Data source specific actions**     |
|-------------------------------------|--------------------------------------|
|||
| *Read* |Microsoft.Sql/sqlservers/Connect |
||Microsoft.Sql/sqlservers/databases/Connect |
||Microsoft.Sql/Sqlservers/Databases/Schemas/Tables/Rows|
||Microsoft.Sql/Sqlservers/Databases/Schemas/Views/Rows |
|||

## Next steps
Check blog, demo and related how-to guides
* [Concepts for Microsoft Purview data owner policies](./concept-policies-data-owner.md)
* [Enable Microsoft Purview data owner policies on all data sources in a subscription or a resource group](./how-to-policies-data-owner-resource-group.md)
* [Enable Microsoft Purview data owner policies on an Azure Arc-enabled SQL Server](./how-to-policies-data-owner-arc-sql-server.md)
* Doc: [Troubleshoot Microsoft Purview policies for SQL data sources](./troubleshoot-policy-sql.md)
