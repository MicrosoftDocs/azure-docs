---
title: Manage access to Azure SQL Database system health and performance using Microsoft Purview DevOps policies, a type of RBAC policies.
description: Use Microsoft Purview DevOps policies to provision access to Azure SQL Database system metadata, so IT operations personnel can monitor performance, health and audit security, while limiting the insider threat.
author: inward-eye
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: how-to
ms.date: 04/04/2023
ms.custom:
---
# Provision access to system metadata in Azure SQL Database

[DevOps policies](concept-policies-devops.md) are a type of Microsoft Purview access policies. They allow you to manage access to system metadata on data sources that have been registered for *Data use management* in Microsoft Purview. These policies are configured directly from the Microsoft Purview governance portal, and after they are saved, they get automatically published and then enforced by the data source. Microsoft Purview policies only manage access for Azure AD principals.

This how-to guide covers how to configure Azure SQL Database to enforce policies created in Microsoft Purview. It covers the configuration steps for Azure SQL Database and the ones in Microsoft Purview to provision access to Azure SQL Database system metadata (DMVs and DMFs) using the DevOps policies actions *SQL Performance Monitoring* or *SQL Security Auditing*.

## Prerequisites
[!INCLUDE [Access policies generic pre-requisites](./includes/access-policies-prerequisites-generic.md)]
[!INCLUDE [Access policies Azure SQL Database pre-requisites](./includes/access-policies-prerequisites-azure-sql-db.md)]

## Microsoft Purview Configuration
[!INCLUDE [Access policies generic configuration](./includes/access-policies-configuration-generic.md)]

### Register the data sources in Microsoft Purview
The Azure SQL Database data source needs to be registered first with Microsoft Purview, before access policies can be created. You can follow these guides:

[Register and scan Azure SQL Database](./register-scan-azure-sql-database.md)

After you've registered your resources, you'll need to enable Data Use Management. Data Use Management needs certain permissions and can affect the security of your data, as it delegates to certain Microsoft Purview roles to manage access to the data sources. **Go through the secure practices related to Data Use Management in this guide**: [How to enable Data Use Management](./how-to-enable-data-use-management.md)

Once your data source has the **Data Use Management** toggle *Enabled*, it will look like this screenshot. This will enable the access policies to be used with the given data source
![Screenshot shows how to register a data source for policy.](./media/how-to-policies-data-owner-sql/register-data-source-for-policy-azure-sql-db.png)

[!INCLUDE [Access policies Azure SQL Database pre-requisites](./includes/access-policies-configuration-azure-sql-db.md)]

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

## Test the DevOps policy
See how to [test the policy you created](./how-to-policies-devops-authoring-generic.md#test-the-devops-policy)

## Role definition detail
See the [mapping of DevOps role to data source actions](./how-to-policies-devops-authoring-generic.md#role-definition-detail)

## Next steps
See [related videos, blogs and documents](./how-to-policies-devops-authoring-generic.md#next-steps)


