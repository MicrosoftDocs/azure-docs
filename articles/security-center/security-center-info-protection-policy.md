---
title: Customize SQL information protection - Azure Security Center
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
ms.date: 10/18/2020
ms.author: memildin

---
# SQL information protection policy in Azure Security Center
 
Data Discovery & Classification is built into Azure SQL Database, Azure SQL Managed Instance, and Azure Synapse Analytics. It provides advanced capabilities for discovering, classifying, labeling, and reporting the sensitive data in your databases.

The classification mechanism is based on two primary constructs that make up the classification taxonomy:
- **Labels** – The main classification attributes, used to define the sensitivity level of the data stored in the column. 
- **Information Types** – Provides additional granularity into the type of data stored in the column.

The information protection policy options within Security Center provide a predefined set of labels and information types which serve as the defaults for the classification engine. You can customize the policy, according to your organization's needs, as described below.

[Learn more about SQL Data Discovery & Classification](../azure-sql/database/data-discovery-and-classification-overview.md).

:::image type="content" source="./media/security-center-info-protection-policy/sql-information-protection-policy-page.png" alt-text="The page showing your SQL information protection policy":::
 
## How do I access the SQL information protection policy?

There are three ways to access the information protection policy:

- **(Recommended)** From the pricing and settings page of Security Center.
- From the security recommendation "Sensitive data in your SQL databases should be classified".
- From the Azure SQL DB data discovery page.

Each of these is shown in the relevant tab below.

### [**For a whole tenant**](#tab/sqlip-tenant)

### Customize the policy for your whole tenant <a name="sqlip-tenant"></a>

To customize the information protection policy for your Azure tenant, you need to have [administrative privileges on the tenant's root management group](security-center-management-groups.md). 

From Security Center's **pricing and settings** page, select **SQL information protection**.

:::image type="content" source="./media/security-center-info-protection-policy/pricing-settings-link-to-information-protection.png" alt-text="Accessing the SQL Information Protection policy from the pricing and settings page of Azure Security Center":::



### [**For one database from Security Center**](#tab/sqlip-db)

### Customize the policy for a single database from Security Center <a name="sqlip-asc"></a>

Use Security Center's recommendation, "Sensitive data in your SQL databases should be classified", to view the data discovery and classification page for your database. There, you'll also see the columns discovered to contain information that we recommend you classify.

1. From Security Center's **Recommendations** page, search for the recommendation **Sensitive data in your SQL databases should be classified**.

    :::image type="content" source="./media/security-center-info-protection-policy/sql-sensitive-data-recommendation.png" alt-text="Finding the recommendation that provides access to the SQL information protection policies":::

1. From the recommendation details page, select the relevant database from the **healthy** or **unhealthy** tabs.

1. The **Data Discovery & Classification** page opens. Select **Configure**. 

    :::image type="content" source="./media/security-center-info-protection-policy/access-policy-from-security-center-recommendation.png" alt-text="Opening the SQL information protection policy from the relevant recommendation in Azure Security Center's":::



### [**For one database from Azure SQL**](#tab/sqlip-azuresql)

### Customize the policy for a single database from Azure SQL <a name="sqlip-azuresql"></a>

1. From the Azure portal, open Azure SQL.

    :::image type="content" source="./media/security-center-info-protection-policy/open-azure-sql.png" alt-text="Opening Azure SQL from the Azure portal":::

1. Select the relevant database.

1. Open the **Data Discovery & Classification** page (1) and select **Configure** (2).

    :::image type="content" source="./media/security-center-info-protection-policy/access-policy-from-azure-sql.png" alt-text="Opening the SQL information protection policy from Azure SQL":::


---






1. From Security Center's **pricing and settings** page, select the **SQL Sensitive data in your SQL databases should be classified**.

    :::image type="content" source="./media/security-center-info-protection-policy/pricing-settings-link-to-information-protection.png" alt-text="Accessing the SQL Information Protection policy from the pricing and settings page of Azure Security Center":::




1. Select a database. The **Data Discovery & Classification** page opens listing any defined classifications. In addition, the banner on the page shows columns that have been identified as candidates for classification. 

    :::image type="content" source="./media/security-center-info-protection-policy/sql-sensitive-columns-recommended.png" alt-text="Prompt to classify newly identified columns ":::

1. 


### [**For one database from Azure SQL**](#tab/sqlip-azuresql)

### Customize the policy for a single database from Azure SQL <a name="sqlip-azuresql"></a>





1. 
1. 
1.  to view and modify the policy for this database. If Azure has recommendations for columns to classify, you can select the message (2) to review them.

    :::image type="content" source="./media/security-center-info-protection-policy/sql-db-data-discovery-page.png" alt-text="Opening the policy for a single database from Azure SQL":::
--- 











 

1. In the Security Center main menu, under **RESOURCE SECURITY HYGIENE** go to **Data & storage** and click on the **SQL Information Protection** button.

   ![Configure Information protection policy](./media/security-center-info-protection-policy/security-policy.png) 
 
2. In the **SQL Information Protection** page, you can view your current set of labels. These are the main classification attributes that are used to categorize the sensitivity level of your data. From here, you can configure the **Information protection labels** and **Information types** for the tenant. 
 


### Customize labels

1. You can edit or delete any existing label, or add a new label:
    - To edit an existing label, select that label and then click **Configure**, either at the top or from the context menu on the right. 
    - To add a new label, click **Create label** in the top menu bar or at the bottom of the labels table.
1. From the **Create and manage sensitivity labels** list, you can:
    - Use **Create label** to add a new label to the list.
    - Select an existing label and use **Delete** to remove a label from the list.
    - Select an existing label and use **Configure** to edit the label's name, description, or status (active or disabled), and modify the information types associated with the label. Any data discovered that matches that information type will automatically include the associated sensitivity label in the classification recommendations.

        In this example, the information type "Other" is associated with the label "Confidential":
        :::image type="content" source="./media/security-center-info-protection-policy/associate-data-type-with-label.gif" alt-text="Demonstration of associating an information type with a label":::    

1. Labels are listed in order of ascending sensitivity. To change the ranking between labels, drag the labels to reorder them in the table, or use the **Move up** and **Move down** buttons to change the order. 

    :::image type="content" source="./media/security-center-info-protection-policy/move-up.png" alt-text="Modifying the order of the labels"::: 

1. After making any changes, select **Save**.
 
 
## Add and customize information types

To manage and customize information types:

1. Select **Manage information types**.

    :::image type="content" source="./media/security-center-info-protection-policy/manage-types.png" alt-text="Manage information types for your information protection policy":::

1. To add a new **Information type**, select **Create information type** in the top menu. You can configure a name, description, and search pattern strings for the **Information type**. Search pattern strings can optionally use keywords with wildcard characters (using the character '%'), which the automated discovery engine uses to identify sensitive data in your databases, based on the columns' metadata.
 
    :::image type="content" source="./media/security-center-info-protection-policy/configure-new-type.png" alt-text="Configure a new information type for your information protection policy":::

1. You can also configure the built-in **Information types** by adding additional search pattern strings, disabling some of the existing strings, or by changing the description. You cannot delete built-in **Information types** or edit their names. 
1. **Information types** are listed in order of ascending discovery ranking, meaning that the types higher in the list will attempt to match first. To change the ranking between information types, drag the types to the right spot in the table, or use the **Move up** and **Move down** buttons to change the order. 
1. Select **OK** when you are done.
1. After you completed managing your information types, be sure to associate the relevant types with the relevant labels, by clicking **Configure** for a particular label, and adding or deleting information types as appropriate.
1. To apply your changes, select **Save** in the main **Labels** page.
 

## Manage SQL information protection using Azure PowerShell

- [Get-AzSqlInformationProtectionPolicy](https://docs.microsoft.com/powershell/module/az.security/get-azsqlinformationprotectionpolicy): Retrieves the effective tenant SQL information protection policy.
- [Set-AzSqlInformationProtectionPolicy](https://docs.microsoft.com/powershell/module/az.security/set-azsqlinformationprotectionpolicy): Sets the effective tenant SQL information protection policy.
 
## Next steps
 
In this article, you learned about defining a SQL Information Protection policy in Azure Security Center. To learn more about using SQL Information Protection to classify and protect sensitive data in your SQL databases, see [Azure SQL Database Data Discovery and Classification](../azure-sql/database/data-discovery-and-classification-overview.md). 

For more information on security policies and data security in Azure Security Center, see the following articles:
 
- [Setting security policies in Azure Security Center](tutorial-security-policy.md): Learn how to configure security policies for your Azure subscriptions and resource groups
- [Azure Security Center data security](security-center-data-security.md): Learn how Security Center manages and safeguards data
