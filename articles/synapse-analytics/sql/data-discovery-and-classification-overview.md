---
title: Data Discovery & Classification
titleSuffix: Azure Synapse Analytics
description: Discover, classify, label, and report sensitive data in Azure Synapse Analytics dedicated SQL pools.
author: VanMSFT
ms.author: vanto
ms.reviewer: matripathy, shdasgupta
ms.date: 10/07/2026
ms.service: azure-synapse-analytics
ms.subservice: sql
ms.topic: concept-article
---

# Data Discovery & Classification in Azure Synapse Analytics

Data Discovery & Classification is built into Azure Synapse Analytics dedicated SQL pools. It provides capabilities for discovering, classifying, labeling, and reporting sensitive data in your databases.

Data Discovery & Classification isn't supported for serverless SQL pools.

Your most sensitive data might include business, financial, healthcare, or personal information. It can serve as infrastructure for:

- Meet data privacy standards and regulatory compliance requirements.
- Support security scenarios, such as monitoring (auditing) access to sensitive data.
- Control access to and harden the security of databases that contain highly sensitive data.

<a id="what-is-dc"></a>

## What is Data Discovery & Classification?

Data Discovery & Classification currently supports the following capabilities:

- **Discovery and recommendations:** The classification engine scans your database and identifies columns that contain potentially sensitive data. It then provides you with an easy way to review and apply recommended classification via the Azure portal.

- **Labeling:** You can apply sensitivity-classification labels persistently to columns by using metadata attributes in the database engine. This metadata can then be used for sensitivity-based auditing scenarios.

- **Query result-set sensitivity:** The sensitivity of a query result set is calculated in real time for auditing purposes.

- **Visibility:** You can view the database-classification state in a detailed dashboard in the Azure portal. Also, you can download a report in Excel format to use for compliance and auditing purposes and other needs.

<a id="discover-classify-columns"></a>

## Discover, classify, and label sensitive columns

This section describes the steps for:

- Discovering, classifying, and labeling columns that contain sensitive data in your database.
- Viewing the current classification state of your database and exporting reports.

The classification includes two metadata attributes:

- **Labels**: The main classification attributes, used to define the sensitivity level of the data stored in the column.
- **Information types**: Attributes that provide more granular information about the type of data stored in the column.

### Information Protection policy

Azure Synapse Analytics uses SQL Information Protection policy for data classification.

### SQL Information Protection policy

Data Discovery & Classification includes a built-in set of sensitivity labels and information types with discovery logic that works natively with the SQL logical server. Use the protection labels available in the default policy file, or customize this taxonomy. Define a set and ranking of classification constructs specifically for your environment.

### Define and customize your classification taxonomy

Define and customize your classification taxonomy in one central place for your entire Azure organization. Use [Microsoft Defender for Cloud](/azure/security-center/security-center-introduction), as part of your security policy. Only someone with administrative rights on the organization's root management group can complete this task.

As part of policy management, you can define custom labels, rank them, and associate them with a selected set of information types. You can also add your own custom information types and configure them with string patterns. The patterns are added to the discovery logic for identifying this type of data in your databases.

For more information, see [Customize the SQL information protection policy in Microsoft Defender for Cloud (Preview)](/azure/security-center/security-center-info-protection-policy).

After you define the organization-wide policy, continue classifying individual databases by using your customized policy.

### Classify database in SQL Information Protection policy mode
> [!NOTE]
> The following example uses Azure SQL Database, but you should select the appropriate product that you want to configure Data Discovery & Classification.

1. Go to the [Azure portal](https://portal.azure.com).

1. Go to **Data Discovery & Classification** under the **Security** heading in your Azure SQL Database pane. The **Overview** tab includes a summary of the current classification state of the database. The summary includes a detailed list of all classified columns, which you can filter to show only specific schema parts, information types, and labels. If you didn't classify any columns yet, [skip to step 4](#step-4).

1. To download a report in Excel format, select **Export** in the top menu of the pane.

1. <a id="step-4"></a>To begin classifying your data, select the **Classification** tab on the **Data Discovery & Classification** page.

   The classification engine scans your database for columns containing potentially sensitive data and provides a list of recommended column classifications.

1. View and apply classification recommendations:

   - To view the list of recommended column classifications, select the recommendations panel at the bottom of the pane.

   - To accept a recommendation for a specific column, select the check box in the left column of the relevant row. To mark all recommendations as accepted, select the leftmost check box in the recommendations table header.

   - To apply the selected recommendations, select **Accept selected recommendations**.

   > [!NOTE]
   > The recommendation engine, which does automatic data discovery and provides sensitive column recommendations, is disabled when Microsoft Purview Information Protection policy mode is used.

1. You can also classify columns manually, as an alternative or in addition to the recommendation-based classification:

   1. Select **Add classification** in the top menu of the pane.

   1. In the context window that opens, select the schema, table, and column that you want to classify, and the information type and sensitivity label.

   1. Select **Add classification** at the bottom of the context window.

1. To complete your classification and persistently label (tag) the database columns with the new classification metadata, select **Save** in the **Classification** page.

### Microsoft Purview Information Protection policy

> [!NOTE]
> Microsoft Information Protection (MIP) is now Microsoft Purview Information Protection. Both "MIP" and "Microsoft Purview Information Protection" refer to the same concept.

Microsoft Purview Information Protection labels provide a simple and uniform way for users to classify sensitive data across different Microsoft applications. Create and manage MIP sensitivity labels in the [Microsoft Purview compliance portal](https://compliance.microsoft.com/). To learn how to create and publish MIP sensitive labels in Microsoft Purview compliance portal, see [Create and publish sensitivity labels](/microsoft-365/compliance/create-sensitivity-labels).

#### Prerequisites to switch to Microsoft Purview Information Protection policy

- Setting or changing the information protection policy sets the information protection policy for all databases under the tenant. You must have tenant-wide **Security Admin** permission to change the information protection policy from SQL Information Protection policy to MIP policy, or vice versa.
- A user or persona with tenant-wide **Security Admin** permission can apply the policy at the tenant root management group level. For more information, see [Grant tenant-wide permissions to yourself](/azure/defender-for-cloud/tenant-wide-permissions-management#grant-tenant-wide-permissions-to-yourself).


- Your tenant has an active Microsoft 365 subscription and you have labels published for the current user. For more information, see [Create and configure sensitivity labels and their policies](/microsoft-365/compliance/create-sensitivity-labels).

### Classify database in Microsoft Purview Information Protection policy mode

1. Go to the [Azure portal](https://portal.azure.com).
1. Navigate to your database in Azure.
1. Go to **Data Discovery & Classification** under the **Security** heading in your database pane.
1. To select **Microsoft Information Protection policy**, select the **Overview** tab, and select **Configure**.
1. Select **Microsoft Information Protection policy** in the **Information Protection policy** options, and select **Save**.
1. If you go to the **Classification** tab, or select **Add classification**, you see Microsoft 365 sensitivity labels appear in the **Sensitivity label** dropdown list.


- Information type is `[n/a]` while you are in MIP policy mode and automatic data discovery & recommendations remain disabled.
- A warning icon might appear against an already classified column if the column was classified by using a different Information Protection policy than the currently active policy. For example, if the column was classified by using a label with SQL Information Protection policy earlier and you're now in Microsoft Information Protection policy mode, you see a warning icon against that specific column. The warning icon is informational and doesn't indicate a problem.


### Microsoft Purview Information Protection policies for Azure SQL Database

> [!IMPORTANT]
> Microsoft Purview Information Protection policies for Azure SQL Database are retired. You can no longer configure or enforce access control on sensitive columns through Microsoft Purview Information Protection (MIP) access policies, and existing access policies configured through this capability are no longer enforced.

Previously, Azure SQL Database supported enforcing access control on columns labeled with Microsoft Purview Information Protection sensitivity labels by using Purview access policies.

Microsoft Purview protection policies that control access through sensitivity labels are still available in Microsoft Fabric. For more information, see [Protection policies in Microsoft Fabric](/fabric/governance/protection-policies-overview).

<a id="audit-sensitive-data"></a>

## Audit access to sensitive data

An important aspect of classification is the ability to monitor access to sensitive data. [Azure Synapse Analytics auditing](auditing-overview.md) includes a field in the audit log called `data_sensitivity_information`. This field logs the sensitivity classifications (labels) of the data that a query returns.

These T-SQL activities are auditable with sensitivity information:

- `ALTER TABLE ... DROP COLUMN`
- `BULK INSERT`
- `SELECT`
- `DELETE`
- `INSERT`
- `MERGE`
- `UPDATE`
- `UPDATETEXT`
- `WRITETEXT`
- `DROP TABLE`
- `BACKUP`
- `DBCC CloneDatabase`
- `SELECT INTO`
- `INSERT INTO EXEC`
- `TRUNCATE TABLE`
- `DBCC SHOW_STATISTICS`
- `sys.dm_db_stats_histogram`

Use [sys.fn_get_audit_file](/sql/relational-databases/system-functions/sys-fn-get-audit-file-transact-sql) to return information from an audit file stored in an Azure Storage account.

## Permissions

These built-in roles can read the data classification of a database:

- Owner
- Reader
- Contributor
- SQL Security Manager
- User Access Administrator

To read the data classification of a database, you need these actions:

- `Microsoft.Sql/servers/databases/currentSensitivityLabels/*`
- `Microsoft.Sql/servers/databases/recommendedSensitivityLabels/*`
- `Microsoft.Sql/servers/databases/schemas/tables/columns/sensitivityLabels/*`

These built-in roles can modify the data classification of a database:

- Owner
- Contributor
- SQL Security Manager

To modify the data classification of a database, you need this action:

- `Microsoft.Sql/servers/databases/schemas/tables/columns/sensitivityLabels/*`

Learn more about role-based permissions in [Azure RBAC](/azure/role-based-access-control/overview).

> [!NOTE]
> The Azure SQL built-in roles in this section apply to a dedicated SQL pool (formerly SQL DW) but aren't available for dedicated SQL pools and other SQL resources within Azure Synapse workspaces. For SQL resources in Azure Synapse workspaces, use the available actions for data classification to create custom Azure roles as needed for labeling. For more information on the `Microsoft.Synapse/workspaces/sqlPools` provider operations, see [Microsoft.Synapse](/azure/role-based-access-control/resource-provider-operations#microsoftsynapse).

## Manage classifications

You can use T-SQL, a REST API, or PowerShell to manage classifications.

### Use T-SQL

You can use T-SQL to add or remove column classifications, and to retrieve all classifications for the entire database.

> [!NOTE]
> When you use T-SQL to manage labels, there's no validation that labels you add to a column exist in the organization's information-protection policy (the set of labels that appear in the portal recommendations). You need to validate.

For information about using T-SQL for classifications, see the following references:

- To add or update the classification of one or more columns: [ADD SENSITIVITY CLASSIFICATION](/sql/t-sql/statements/add-sensitivity-classification-transact-sql)
- To remove the classification from one or more columns: [DROP SENSITIVITY CLASSIFICATION](/sql/t-sql/statements/drop-sensitivity-classification-transact-sql)
- To view all classifications on the database: [sys.sensitivity_classifications](/sql/relational-databases/system-catalog-views/sys-sensitivity-classifications-transact-sql)

### Use PowerShell cmdlets

Manage classifications and recommendations for Azure SQL Database and Azure SQL Managed Instance by using PowerShell.

#### PowerShell cmdlets for Azure SQL Database

- [Get-AzSqlDatabaseSensitivityClassification](/powershell/module/az.sql/get-azsqldatabasesensitivityclassification)
- [Set-AzSqlDatabaseSensitivityClassification](/powershell/module/az.sql/set-azsqldatabasesensitivityclassification)
- [Remove-AzSqlDatabaseSensitivityClassification](/powershell/module/az.sql/remove-azsqldatabasesensitivityclassification)
- [Get-AzSqlDatabaseSensitivityRecommendation](/powershell/module/az.sql/get-azsqldatabasesensitivityrecommendation)
- [Enable-AzSqlDatabaseSensitivityRecommendation](/powershell/module/az.sql/enable-azsqldatabasesensitivityrecommendation)
- [Disable-AzSqlDatabaseSensitivityRecommendation](/powershell/module/az.sql/disable-azsqldatabasesensitivityrecommendation)

### Use the REST API

You can use the REST API to programmatically manage classifications and recommendations. The published REST API supports the following operations:

- [Create Or Update](/rest/api/sql/sensitivity-labels/create-or-update): Creates or updates the sensitivity label of the specified column.
- [Delete](/rest/api/sql/sensitivity-labels/delete): Deletes the sensitivity label of the specified column.
- [Disable Recommendation](/rest/api/sql/sensitivity-labels/disable-recommendation): Disables sensitivity recommendations on the specified column.
- [Enable Recommendation](/rest/api/sql/sensitivity-labels/enable-recommendation): Enables sensitivity recommendations on the specified column. (Recommendations are enabled by default on all columns.)
- [Get](/rest/api/sql/sensitivity-labels/get): Gets the sensitivity label of the specified column.
- [List Current By Database](/rest/api/sql/sensitivity-labels/list-current-by-database): Gets the current sensitivity labels of the specified database.
- [List Recommended By Database](/rest/api/sql/sensitivity-labels/list-recommended-by-database): Gets the recommended sensitivity labels of the specified database.

## Retrieve classifications metadata using SQL drivers

You can use the following SQL drivers to retrieve classification metadata:

- [Microsoft.Data.SqlClient](/sql/connect/ado-net/sql/data-classification)
- [ODBC Driver](/sql/connect/odbc/data-classification)
- [OLE DB Driver](/sql/connect/oledb/features/using-data-classification)
- [JDBC Driver](/sql/connect/jdbc/data-discovery-classification-sample)
- [Microsoft Drivers for PHP for SQL Server](/sql/connect/php/release-notes-php-sql-driver)

## FAQ - Advanced classification capabilities

**Question**: Will [Microsoft Purview](/azure/purview/overview) replace SQL Data Discovery & Classification or will SQL Data Discovery & Classification retire soon?
**Answer**: We continue to support SQL Data Discovery & Classification and encourage you to adopt [Microsoft Purview](/azure/purview/overview) which has richer capabilities to drive advanced classification capabilities and data governance. If we decide to retire any service, feature, API, or SKU, you receive advance notice including a migration or transition path. For more information, see the [Microsoft Lifecycle policies](/lifecycle/index).

## Related content

- Consider configuring [Azure Synapse Analytics auditing](auditing-overview.md) to monitor and audit access to classified sensitive data.
- For a presentation that includes data Discovery & Classification, see [Discovering, classifying, labeling & protecting SQL data | Data Exposed](https://www.youtube.com/watch?v=itVi9bkJUNc).
