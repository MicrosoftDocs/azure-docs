---
title: Create, list, update, and delete Microsoft Purview DevOps policies
description: Use Microsoft Purview DevOps policies to provision access to database system metadata, so IT operations personnel can monitor performance, health, and audit security, while limiting insider threats.
author: inward-eye
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: how-to
ms.date: 05/30/2023
ms.custom:
---
# Create, list, update, and delete Microsoft Purview DevOps policies

[DevOps policies](concept-policies-devops.md) are a type of Microsoft Purview access policies. You can use them to manage access to system metadata on data sources that have been registered for **Data use management** in Microsoft Purview.

You can configure DevOps policies directly from the Microsoft Purview governance portal. After they're saved, they're automatically published and then enforced by the data source. Microsoft Purview policies manage only access for Azure Active Directory (Azure AD) principals.

This guide covers the configuration steps in Microsoft Purview to provision access to database system metadata by using the DevOps policy actions for the SQL Performance Monitor and SQL Security Auditor roles. It shows how to create, list, update, and delete DevOps policies.

## Prerequisites

[!INCLUDE [Access policies generic prerequisites](./includes/access-policies-prerequisites-generic.md)]

### Configuration

Before you author policies in the Microsoft Purview policy portal, you need to configure the data sources so that they can enforce those policies:

1. Follow any policy-specific prerequisites for your source. Check the [table of Microsoft Purview supported data sources](./microsoft-purview-connector-overview.md) and select the link in the **Access policy** column for sources where access policies are available. Follow any steps listed in the "Access policy" and "Prerequisites" sections.
1. Register the data source in Microsoft Purview. Follow the "Prerequisites" and "Register" sections of the [source pages](./microsoft-purview-connector-overview.md) for your resources.
1. Turn on the **Data use management** toggle in the data source registration. For more information, including additional permissions that you need for this step, see [Enable Data use management on your Microsoft Purview sources](how-to-enable-data-use-management.md).

## Create a new DevOps policy

To create a DevOps policy, first ensure that you have the Microsoft Purview Policy Author role at the root collection level. Check the section on managing Microsoft Purview role assignments in [this guide](./how-to-create-and-manage-collections.md#add-roles-and-restrict-access-through-collections). Then, follow these steps:

1. Sign in to the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/).

1. On the left pane, select **Data policy**. Then select **DevOps policies**.

1. Select the **New policy** button.

   ![Screenshot that shows the button for creating a new SQL DevOps policy.](./media/how-to-policies-devops-authoring-generic/enter-devops-policies-to-create.png)

   The policy detail panel opens.

1. For **Data source type**, select a data source. Under **Data source name**, select one of the listed data sources. Then click **Select** to return to the **New Policy** pane.

   ![Screenshot that shows the panel for selecting a policy's data source.](./media/how-to-policies-devops-authoring-generic/select-a-data-source.png)

1. Select one of two roles, **Performance monitoring** or **Security auditing**. Then select **Add/remove subjects** to open the **Subject** panel.

   In the **Select subjects** box, enter the name of an Azure AD principal (user, group, or service principal). Microsoft 365 groups are supported, but updates to group membership take up to one hour to be reflected in Azure AD. Keep adding or removing subjects until you're satisfied, and then select **Save**.

   ![Screenshot that shows the selection of roles and subjects for a policy.](./media/how-to-policies-devops-authoring-generic/select-role-and-subjects.png)

1. Select **Save** to save the policy. The policy is published automatically. Enforcement starts at the data source within five minutes.

## List DevOps policies

To list DevOps policies, first ensure that you have one of the following Microsoft Purview roles at the root collection level: Policy Author, Data Source Admin, Data Curator, or Data Reader. Check the section on managing Microsoft Purview role assignments in [this guide](./how-to-create-and-manage-collections.md#add-roles-and-restrict-access-through-collections). Then, follow these steps:

1. Sign in to the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/).

1. On the left pane, select **Data policy**. Then select **DevOps policies**.

   The **DevOps Policies** pane lists any policies that have been created.

   ![Screenshot that shows selections for opening a list of SQL DevOps policies.](./media/how-to-policies-devops-authoring-generic/enter-devops-policies-to-list.png)

## Update a DevOps policy

To update a DevOps policy, first ensure that you have the Microsoft Purview Policy Author role at the root collection level. Check the section on managing Microsoft Purview role assignments in [this guide](./how-to-create-and-manage-collections.md#add-roles-and-restrict-access-through-collections). Then, follow these steps:

1. Sign in to the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/).

1. On the left pane, select **Data policy**. Then select **DevOps policies**.

1. On the **DevOps Policies** pane, open the policy details for one of the policies by selecting it from its data resource path.

   ![Screenshot that shows selections to open SQL DevOps policies.](./media/how-to-policies-devops-authoring-generic/enter-devops-policies-to-update.png)

1. On the pane for policy details, select **Edit**.

1. Make your changes, and then select **Save**.

## Delete a DevOps policy

To delete a DevOps policy, first ensure that you have the Microsoft Purview Policy Author role at the root collection level. Check the section on managing Microsoft Purview role assignments in [this guide](./how-to-create-and-manage-collections.md#add-roles-and-restrict-access-through-collections). Then, follow these steps:

1. Sign in to the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/).

1. On the left pane, select **Data policy**. Then select **DevOps policies**.

1. Select the checkbox for one of the policies, and then select **Delete**.

   ![Screenshot that shows selections for deleting a SQL DevOps policy.](./media/how-to-policies-devops-authoring-generic/enter-devops-policies-to-delete.png)

## Test the DevOps policy

After you create a policy, any of the Azure AD users that you selected as subjects can now connect to the data sources in the scope of the policy. To test, use SQL Server Management Studio (SSMS) or any SQL client and try to query some dynamic management views (DMVs) and dynamic management functions (DMFs). The following sections list a few examples. For more examples, consult the mapping of popular DMVs and DMFs in [What can I accomplish with Microsoft Purview DevOps policies?](./concept-policies-devops.md#mapping-of-popular-dmvs-and-dmfs).

If you require more troubleshooting, see the [Next steps](#next-steps) section in this guide.

### Test SQL Performance Monitor access

If you provided the subjects of the policy for the SQL Performance Monitor role, you can issue the following commands:

```sql
-- Returns I/O statistics for data and log files
SELECT * FROM sys.dm_io_virtual_file_stats(DB_ID(N'testdb'), 2)
-- Waits encountered by threads that executed. Used to diagnose performance issues
SELECT wait_type, wait_time_ms FROM sys.dm_os_wait_stats
```

![Screenshot that shows a test for SQL Performance Monitor.](./media/how-to-policies-devops-authoring-generic/test-access-sql-performance-monitor.png)

### Test SQL Security Auditor access

If you provided the subjects of the policy for the SQL Security Auditor role, you can issue the following commands from SSMS or any SQL client:

```sql
-- Returns the current state of the audit
SELECT * FROM sys.dm_server_audit_status
-- Returns information about the encryption state of a database and its associated database encryption keys
SELECT * FROM sys.dm_database_encryption_keys
```

### Ensure no access to user data

Try to access a table in one of the databases by using the following command:

```sql
-- Test access to user data
SELECT * FROM [databaseName].schemaName.tableName
```

The Azure AD principal that you're testing with should be denied, which means the data is protected from insider threats.

![Screenshot that shows a test to access user data.](./media/how-to-policies-devops-authoring-generic/test-access-user-data.png)

## Role definition detail

The following table maps Microsoft Purview data policy roles to specific actions in SQL data sources.

| Microsoft Purview policy role | Actions in data sources     |
|-------------------------------------|--------------------------------------|
|                                     |                                      |
| SQL Performance Monitor |Microsoft.Sql/Sqlservers/Connect |
||Microsoft.Sql/Sqlservers/Databases/Connect |
||Microsoft.Sql/Sqlservers/Databases/SystemViewsAndFunctions/DatabasePerformanceState/Rows/Select |
||Microsoft.Sql/Sqlservers/SystemViewsAndFunctions/ServerPerformanceState/Rows/Select |
||Microsoft.Sql/Sqlservers/Databases/SystemViewsAndFunctions/DatabaseGeneralMetadata/Rows/Select |
||Microsoft.Sql/Sqlservers/SystemViewsAndFunctions/ServerGeneralMetadata/Rows/Select |
||Microsoft.Sql/Sqlservers/Databases/DBCCs/ViewDatabasePerformanceState/Execute |
||Microsoft.Sql/Sqlservers/DBCCs/ViewServerPerformanceState/Execute |
||Microsoft.Sql/Sqlservers/Databases/ExtendedEventSessions/Create |
||Microsoft.Sql/Sqlservers/Databases/ExtendedEventSessions/Options/Alter |
||Microsoft.Sql/Sqlservers/Databases/ExtendedEventSessions/Events/Add |
||Microsoft.Sql/Sqlservers/Databases/ExtendedEventSessions/Events/Drop |
||Microsoft.Sql/Sqlservers/Databases/ExtendedEventSessions/State/Enable |
||Microsoft.Sql/Sqlservers/Databases/ExtendedEventSessions/State/Disable |
||Microsoft.Sql/Sqlservers/Databases/ExtendedEventSessions/Drop
||Microsoft.Sql/Sqlservers/Databases/ExtendedEventSessions/Target/Add |
||Microsoft.Sql/Sqlservers/Databases/ExtendedEventSessions/Target/Drop |
||Microsoft.Sql/Sqlservers/ExtendedEventSessions/Create |
||Microsoft.Sql/Sqlservers/ExtendedEventSessions/Options/Alter |
||Microsoft.Sql/Sqlservers/ExtendedEventSessions/Events/Add |
||Microsoft.Sql/Sqlservers/ExtendedEventSessions/Events/Drop |
||Microsoft.Sql/Sqlservers/ExtendedEventSessions/State/Enable |
||Microsoft.Sql/Sqlservers/ExtendedEventSessions/State/Disable |
||Microsoft.Sql/Sqlservers/ExtendedEventSessions/Drop |
||Microsoft.Sql/Sqlservers/ExtendedEventSessions/Target/Add |
||Microsoft.Sql/Sqlservers/ExtendedEventSessions/Target/Drop |
|||
| SQL Security Auditor |Microsoft.Sql/Sqlservers/Connect |
||Microsoft.Sql/Sqlservers/Databases/Connect |
||Microsoft.Sql/sqlservers/SystemViewsAndFunctions/ServerSecurityState/rows/select |
||Microsoft.Sql/Sqlservers/Databases/SystemViewsAndFunctions/DatabaseSecurityState/rows/select |
||Microsoft.Sql/sqlservers/SystemViewsAndFunctions/ServerSecurityMetadata/rows/select |
||Microsoft.Sql/Sqlservers/Databases/SystemViewsAndFunctions/DatabaseSecurityMetadata/rows/select |
|||

## Next steps

Check the following blogs, videos, and related articles:

* Blog: [Microsoft Purview DevOps policies for Azure SQL Database is now generally available](https://techcommunity.microsoft.com/t5/security-compliance-and-identity/microsoft-purview-devops-policies-for-azure-sql-database-is-now/ba-p/3775885)
* Blog: [Inexpensive solution for managing access to SQL health, performance, and security information](https://techcommunity.microsoft.com/t5/security-compliance-and-identity/inexpensive-solution-for-managing-access-to-sql-health/ba-p/3750512)
* Blog: [Microsoft Purview DevOps policies enable at-scale access provisioning for IT operations](https://techcommunity.microsoft.com/t5/microsoft-purview-blog/microsoft-purview-devops-policies-enable-at-scale-access/ba-p/3604725)
* Blog: [Microsoft Purview DevOps policies API is now public](https://techcommunity.microsoft.com/t5/security-compliance-and-identity/microsoft-purview-devops-policies-api-is-now-public/ba-p/3818931)
* Video: [Prerequisite for policies: The "Data use management" option](https://youtu.be/v_lOzevLW-Q)
* Video: [Quick overview of DevOps policies](https://aka.ms/Microsoft-Purview-DevOps-Policies-Video)
* Video: [Deep dive for DevOps policies](https://youtu.be/UvClpdIb-6g)
* Article: [Microsoft Purview DevOps policies concept guide](./concept-policies-devops.md)
* Article: [Microsoft Purview DevOps policies on Azure Arc-enabled SQL Server](./how-to-policies-devops-arc-sql-server.md)
* Article: [Microsoft Purview DevOps policies on Azure SQL Database](./how-to-policies-devops-azure-sql-db.md)
* Article: [Microsoft Purview DevOps policies on entire resource groups or subscriptions](./how-to-policies-devops-resource-group.md)
* Article: [Troubleshoot Microsoft Purview policies for SQL data sources](./troubleshoot-policy-sql.md)
