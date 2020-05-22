---
title: "Azure portal: Dynamic data masking"
description: How to get started with Azure SQL Database dynamic data masking in the Azure portal
services: sql-database
ms.service: sql-database
ms.subservice: security
ms.custom: sqldbrb=1
ms.devlang:
ms.topic: conceptual
author: DavidTrigano
ms.author: datrigan
ms.reviewer: vanto
ms.date: 04/28/2020
---
# Get started with SQL Database dynamic data masking with the Azure portal
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

This article shows you how to implement [dynamic data masking](dynamic-data-masking-overview.md) with the Azure portal. You can also implement dynamic data masking using [Azure SQL Database cmdlets](https://docs.microsoft.com/powershell/module/az.sql/) or the [REST API](https://docs.microsoft.com/rest/api/sql/).

> [!NOTE]
> This feature cannot be set using portal for Azure Synapse (use PowerShell or REST API) or SQL Managed Instance. For more information, see [Dynamic Data Masking](/sql/relational-databases/security/dynamic-data-masking).

## Set up dynamic data masking for your database using the Azure portal

1. Launch the Azure portal at [https://portal.azure.com](https://portal.azure.com).
2. Navigate to the settings page of the database that includes the sensitive data you want to mask.
3. Click the **Dynamic Data Masking** blade under the **Security** section of your SQL database.

   ![Navigation pane](./media/dynamic-data-masking-configure-portal/4_ddm_settings_tile.png)

4. In the **Dynamic Data Masking** configuration page, you may see some database columns that the recommendations engine has flagged for masking. In order to accept the recommendations, just click **Add Mask** for one or more columns and a mask is created based on the default type for this column. You can change the masking function by clicking on the masking rule and editing the masking field format to a different format of your choice. Be sure to click **Save** to save your settings.

    ![Navigation pane](./media/dynamic-data-masking-configure-portal/5_ddm_recommendations.png)

5. To add a mask for any column in your database, at the top of the **Dynamic Data Masking** configuration page, click **Add Mask** to open the **Add Masking Rule** configuration page.

    ![Navigation pane](./media/dynamic-data-masking-configure-portal/6_ddm_add_mask.png)

6. Select the **Schema**, **Table** and **Column** to define the designated field for masking.
7. **Select how to mask** from the list of sensitive data masking categories.

    ![Navigation pane](./media/dynamic-data-masking-configure-portal/7_ddm_mask_field_format.png)

8. Click **Add** in the data masking rule page to update the set of masking rules in the dynamic data masking policy.
9. Type the SQL users or Azure Active Directory (Azure AD) identities that should be excluded from masking, and have access to the unmasked sensitive data. This should be a semicolon-separated list of users. Users with administrator privileges always have access to the original unmasked data.

    ![Navigation pane](./media/dynamic-data-masking-configure-portal/8_ddm_excluded_users.png)

    > [!TIP]
    > To make it so the application layer can display sensitive data for application privileged users, add the SQL user or Azure AD identity the application uses to query the database. It is highly recommended that this list contain a minimal number of privileged users to minimize exposure of the sensitive data.

10. Click **Save** in the data masking configuration page to save the new or updated masking policy.

## Next steps

- For an overview of dynamic data masking, see [dynamic data masking](dynamic-data-masking-overview.md).
- You can also implement dynamic data masking using [Azure SQL Database cmdlets](https://docs.microsoft.com/powershell/module/az.sql/) or the [REST API](https://docs.microsoft.com/rest/api/sql/).
