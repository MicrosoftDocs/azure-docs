---
title: SQL information protection policy in Azure Security Center
description: Learn how to customize information protection policies in Azure Security Center.
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.assetid: 2ebf2bc7-232a-45c4-a06a-b3d32aaf2500
ms.service: security-center
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/04/2020
ms.author: memildin

---
# SQL information protection policy in Azure Security Center
 
SQL information protection's [data discovery and classification mechanism](../azure-sql/database/data-discovery-and-classification-overview.md) provides advanced capabilities for discovering, classifying, labeling, and reporting the sensitive data in your databases. It's built into [Azure SQL Database](../azure-sql/database/sql-database-paas-overview.md), [Azure SQL Managed Instance](../azure-sql/managed-instance/sql-managed-instance-paas-overview.md), and [Azure Synapse Analytics](../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md).

The classification mechanism is based on the following two elements:

- **Labels** – The main classification attributes, used to define the *sensitivity level of the data* stored in the column. 
- **Information Types** – Provides additional granularity into the *type of data* stored in the column.

The information protection policy options within Security Center provide a predefined set of labels and information types which serve as the defaults for the classification engine. You can customize the policy, according to your organization's needs, as described below.

> [!IMPORTANT]
> To customize the information protection policy for your Azure tenant, you'll need administrative privileges on the tenant's root management group. Learn more in [Gain tenant-wide visibility for Azure Security Center](security-center-management-groups.md).

:::image type="content" source="./media/security-center-info-protection-policy/sql-information-protection-policy-page.png" alt-text="The page showing your SQL information protection policy":::
 



## How do I access the SQL information protection policy?

There are three ways to access the information protection policy:

- **(Recommended)** From the pricing and settings page of Security Center
- From the security recommendation "Sensitive data in your SQL databases should be classified"
- From the Azure SQL DB data discovery page

Each of these is shown in the relevant tab below.



### [**From Security Center's settings**](#tab/sqlip-tenant)

### Access the policy from Security Center's pricing and settings page <a name="sqlip-tenant"></a>

From Security Center's **pricing and settings** page, select **SQL information protection**.

> [!NOTE]
> This option only appears for users with tenant-level permissions. 

:::image type="content" source="./media/security-center-info-protection-policy/pricing-settings-link-to-information-protection.png" alt-text="Accessing the SQL Information Protection policy from the pricing and settings page of Azure Security Center":::



### [**From Security Center's recommendation**](#tab/sqlip-db)

### Access the policy from the Security Center recommendation <a name="sqlip-db"></a>

Use Security Center's recommendation, "Sensitive data in your SQL databases should be classified", to view the data discovery and classification page for your database. There, you'll also see the columns discovered to contain information that we recommend you classify.

1. From Security Center's **Recommendations** page, search for the recommendation **Sensitive data in your SQL databases should be classified**.

    :::image type="content" source="./media/security-center-info-protection-policy/sql-sensitive-data-recommendation.png" alt-text="Finding the recommendation that provides access to the SQL information protection policies":::

1. From the recommendation details page, select a database from the **healthy** or **unhealthy** tabs.

1. The **Data Discovery & Classification** page opens. Select **Configure**.

    :::image type="content" source="./media/security-center-info-protection-policy/access-policy-from-security-center-recommendation.png" alt-text="Opening the SQL information protection policy from the relevant recommendation in Azure Security Center's":::



### [**From Azure SQL**](#tab/sqlip-azuresql)

### Access the policy from Azure SQL <a name="sqlip-azuresql"></a>

1. From the Azure portal, open Azure SQL.

    :::image type="content" source="./media/security-center-info-protection-policy/open-azure-sql.png" alt-text="Opening Azure SQL from the Azure portal":::

1. Select any database.

1. From the **Security** area of the menu, open the **Data Discovery & Classification** page (1) and select **Configure** (2).

    :::image type="content" source="./media/security-center-info-protection-policy/access-policy-from-azure-sql.png" alt-text="Opening the SQL information protection policy from Azure SQL":::

--- 


## Customize your information types

To manage and customize information types:

1. Select **Manage information types**.

    :::image type="content" source="./media/security-center-info-protection-policy/manage-types.png" alt-text="Manage information types for your information protection policy":::

1. To add a new type, select **Create information type**. You can configure a name, description, and search pattern strings for the information type. Search pattern strings can optionally use keywords with wildcard characters (using the character '%'), which the automated discovery engine uses to identify sensitive data in your databases, based on the columns' metadata.
 
    :::image type="content" source="./media/security-center-info-protection-policy/configure-new-type.png" alt-text="Configure a new information type for your information protection policy":::

1. You can also modify the built-in types by adding additional search pattern strings, disabling some of the existing strings, or by changing the description. 

    > [!TIP]
    > You can't delete built-in types or change their names. 

1. **Information types** are listed in order of ascending discovery ranking, meaning that the types higher in the list will attempt to match first. To change the ranking between information types, drag the types to the right spot in the table, or use the **Move up** and **Move down** buttons to change the order. 

1. Select **OK** when you are done.

1. After you completed managing your information types, be sure to associate the relevant types with the relevant labels, by clicking **Configure** for a particular label, and adding or deleting information types as appropriate.

1. To apply your changes, select **Save** in the main **Labels** page.
 

## Exporting and importing a policy

You can download a JSON file with your defined labels and information types, edit the file in the editor of your choice, and then import the updated file. 

:::image type="content" source="./media/security-center-info-protection-policy/export-import.png" alt-text="Exporting and importing your information protection policy":::

> [!NOTE]
> You'll need tenant level permissions to import a policy file. 


## Manage SQL information protection using Azure PowerShell

- [Get-AzSqlInformationProtectionPolicy](/powershell/module/az.security/get-azsqlinformationprotectionpolicy): Retrieves the effective tenant SQL information protection policy.
- [Set-AzSqlInformationProtectionPolicy](/powershell/module/az.security/set-azsqlinformationprotectionpolicy): Sets the effective tenant SQL information protection policy.
 

## Next steps
 
In this article, you learned about defining an information protection policy in Azure Security Center. To learn more about using SQL Information Protection to classify and protect sensitive data in your SQL databases, see [Azure SQL Database Data Discovery and Classification](../azure-sql/database/data-discovery-and-classification-overview.md).

For more information on security policies and data security in Security Center, see the following articles:
 
- [Setting security policies in Azure Security Center](tutorial-security-policy.md): Learn how to configure security policies for your Azure subscriptions and resource groups
- [Azure Security Center data security](security-center-data-security.md): Learn how Security Center manages and safeguards data
