---
title: Create, list, update, and delete Microsoft Purview DevOps policies
description: Use Microsoft Purview DevOps policies to provision access to database system metadata, so IT operations personnel can monitor performance, health, and audit security, while limiting the insider threat.
author: inward-eye
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: how-to
ms.date: 05/30/2023
ms.custom:
---
# Create, list, update, and delete Microsoft Purview DevOps policies

[DevOps policies](concept-policies-devops.md) are a type of Microsoft Purview access policies. They allow you to manage access to system metadata on data sources that have been registered for *data use management* in Microsoft Purview. These policies are configured directly from the Microsoft Purview governance portal. After they're saved, they're automatically published and then enforced by the data source. Microsoft Purview policies manage only access for Azure Active Directory (Azure AD) principals.

This guide covers the configuration steps in Microsoft Purview to provision access to database system metadata by using the DevOps policies actions SQL performance monitoring and SQL security auditing. It goes into detail on creating, listing, updating, and deleting DevOps policies.

## Prerequisites

[!INCLUDE [Access policies generic prerequisites](./includes/access-policies-prerequisites-generic.md)]

### Configuration

Before you author policies in the Microsoft Purview policy portal, you need to configure the data sources so that they can enforce those policies.

1. Follow any policy-specific prerequisites for your source. Check the [table of Microsoft Purview supported data sources](./microsoft-purview-connector-overview.md) and select the link in the **Access policy** column for sources where access policies are available. Follow any steps listed in the "Access policy" and "Prerequisites" sections.
1. Register the data source in Microsoft Purview. Follow the "Prerequisites" and "Register" sections of the [source pages](./microsoft-purview-connector-overview.md) for your resources.
1. [Turn on the toggle for data use management in the data source registration](how-to-enable-data-use-management.md). The linked article describes additional permissions for this step.

## Create a DevOps policy

To create a evOps policy, first ensure that you have the Microsoft Purview Policy Author role at the root collection level. Check the section on managing Microsoft Purview role assignments in [this guide](./how-to-create-and-manage-collections.md#add-roles-and-restrict-access-through-collections). Then, follow these steps:

1. Sign in to the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/).

1. On the left pane, select **Data policy**. Then select **DevOps policies**.

1. Select the **New Policy** button.

   ![Screenshot that shows the button for creating a new SQL DevOps policy.](./media/how-to-policies-devops-authoring-generic/enter-devops-policies-to-create.png)

   The policy detail panel opens.

1. For **Data source type**, select a data source. Under **Data source name**, select one of the listed data sources. Then click **Select** to return to the **New Policy** pane.

   ![Screenshot that shows the panel for selecting a policy's data source.](./media/how-to-policies-devops-authoring-generic/select-a-data-source.png)

1. Select one of two roles, **Performance monitoring** or **Security auditing**. Then select **Add/remove subjects** to open the **Subject** panel.

   In the **Select subjects** box, enter the name of an Azure AD principal (user, group, or service principal). Microsoft 365 groups are supported, but updates to group membership take up to one hour to be reflected in Azure AD. Keep adding or removing subjects until you're satisfied. Select **Save**.

   ![Screenshot that shows the selection of roles and subjects for a policy.](./media/how-to-policies-devops-authoring-generic/select-role-and-subjects.png)

1. Select **Save** to save the policy. The policy is published automatically. Enforcement starts at the data source within five minutes.

## List DevOps policies

To update a DevOps policy, first ensure that you have one of the following Microsoft Purview roles at the root collection level: policy author, data source admin, data curator, or data reader. Check the section on managing Microsoft Purview role assignments in [this guide](./how-to-create-and-manage-collections.md#add-roles-and-restrict-access-through-collections). Then, follow these steps:

1. Sign in to the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/).

1. On the left pane, select **Data policy**. Then select **DevOps policies**.

   The **DevOps Policies** pane lists any policies that have been created.

   ![Screenshot that shows selections for opening a list of SQL DevOps policies.](./media/how-to-policies-devops-authoring-generic/enter-devops-policies-to-list.png)

## Update a DevOps policy

To update a DevOps policy, first ensure that you have the Microsoft Purview Policy Author role at the root collection level. Check the section on managing Microsoft Purview role assignments in [this guide](./how-to-create-and-manage-collections.md#add-roles-and-restrict-access-through-collections). Then, follow these steps:

1. Sign in to the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/).

1. On the left pane, select **Data policy**. Then select **DevOps policies**.

1. Enter the policy detail for one of the policies by selecting it from its Data resource path as shown in the following screenshot

   ![Screenshot that shows to enter SQL DevOps policies to update.](./media/how-to-policies-devops-authoring-generic/enter-devops-policies-to-update.png)

1. In the policy detail page, select **Edit**.

1. Continue same as with step 5 and 6 of the policy create.

## Delete a DevOps policy

To delete a DevOps policy, ensure first that you have the Microsoft Purview Policy author role at **root collection level**. Check the section on managing Microsoft Purview role assignments in this [guide](./how-to-create-and-manage-collections.md#add-roles-and-restrict-access-through-collections).

1. Sign in to the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/).

1. Navigate to the **Data policy** feature using the left side panel. Then select **DevOps policies**.

1. Check one of the policies and then select **Delete**.

   ![Screenshot that shows to enter SQL DevOps policies to delete.](./media/how-to-policies-devops-authoring-generic/enter-devops-policies-to-delete.png)

## Test the DevOps policy

After creating the policy, any of the Azure AD users in the Subject should now be able to connect to the data sources in the scope of the policy. To test, use SSMS or any SQL client and try to query some DMVs/DMFs. We list here a few examples. For more, you can consult the mapping of popular DMVs/DMFs in the [Microsoft Purview DevOps policies concept guide](./concept-policies-devops.md#mapping-of-popular-dmvs-and-dmfs)

If you require additional troubleshooting, see the [Next steps](#next-steps) section in this guide.

### Test SQL Performance Monitor access

If you provided the Subject(s) of the policy SQL Performance Monitor role, you can issue the following commands

```sql
-- Returns I/O statistics for data and log files
SELECT * FROM sys.dm_io_virtual_file_stats(DB_ID(N'testdb'), 2)
-- Waits encountered by threads that executed. Used to diagnose performance issues
SELECT wait_type, wait_time_ms FROM sys.dm_os_wait_stats
```

![Screenshot that shows test for SQL Performance Monitor.](./media/how-to-policies-devops-authoring-generic/test-access-sql-performance-monitor.png)

### Test SQL Security Auditor access

If you provided the Subject(s) of the policy SQL Security Auditor role, you can issue the following commands from SSMS or any SQL client:

```sql
-- Returns the current state of the audit
SELECT * FROM sys.dm_server_audit_status
-- Returns information about the encryption state of a database and its associated database encryption keys
SELECT * FROM sys.dm_database_encryption_keys
```

### Ensure no access to user data

Next, try accessing a table in one of the databases. The Azure AD principal you are testing with should be denied, which means the data is protected from insider threat

```sql
-- Test access to user data
SELECT * FROM [databaseName].schemaName.tableName
```

![Screenshot that shows test to access user data.](./media/how-to-policies-devops-authoring-generic/test-access-user-data.png)

## Role definitions

This section contains a reference of how relevant Microsoft Purview data policy roles map to specific actions in SQL data sources.

>[!NOTE]
> The role definitions below may be expanded in the future to include additional actions that become available as long as they are consistent with the spirit of the role.

| **Microsoft Purview policy role definition** | **Data source specific actions**     |
|-------------------------------------|--------------------------------------|
|                                     |                                      |
| *SQL Performance Monitor* |Microsoft.Sql/Sqlservers/Connect |
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
| *SQL Security Auditor* |Microsoft.Sql/Sqlservers/Connect |
||Microsoft.Sql/Sqlservers/Databases/Connect |
||Microsoft.Sql/sqlservers/SystemViewsAndFunctions/ServerSecurityState/rows/select |
||Microsoft.Sql/Sqlservers/Databases/SystemViewsAndFunctions/DatabaseSecurityState/rows/select |
||Microsoft.Sql/sqlservers/SystemViewsAndFunctions/ServerSecurityMetadata/rows/select |
||Microsoft.Sql/Sqlservers/Databases/SystemViewsAndFunctions/DatabaseSecurityMetadata/rows/select |
|||

## Next steps

Check the following blogs, videos, and related articles:

* Blog: [Microsoft Purview DevOps policies for Azure SQL Database is now generally available](https://techcommunity.microsoft.com/t5/security-compliance-and-identity/microsoft-purview-devops-policies-for-azure-sql-database-is-now/ba-p/3775885)
* Blog: [Inexpensive solution for managing access to SQL health, performance and security information](https://techcommunity.microsoft.com/t5/security-compliance-and-identity/inexpensive-solution-for-managing-access-to-sql-health/ba-p/3750512)
* Blog: [Microsoft Purview DevOps policies enable at scale access provisioning for IT operations](https://techcommunity.microsoft.com/t5/microsoft-purview-blog/microsoft-purview-devops-policies-enable-at-scale-access/ba-p/3604725)
* Blog: [Microsoft Purview DevOps policies API is now public](https://techcommunity.microsoft.com/t5/security-compliance-and-identity/microsoft-purview-devops-policies-api-is-now-public/ba-p/3818931)
* Video: [Pre-requisite for policies: The "Data use management" option](https://youtu.be/v_lOzevLW-Q)
* Video: [DevOps policies quick overview](https://aka.ms/Microsoft-Purview-DevOps-Policies-Video)
* Video: [DevOps policies deep dive](https://youtu.be/UvClpdIb-6g)
* Article: [Microsoft Purview DevOps policies concept guide](./concept-policies-devops.md)
* Article: [Microsoft Purview DevOps policies on Azure Arc-enabled SQL Server](./how-to-policies-devops-arc-sql-server.md)
* Article: [Microsoft Purview DevOps policies on Azure SQL Database](./how-to-policies-devops-azure-sql-db.md)
* Article: [Microsoft Purview DevOps policies on entire resource groups or subscriptions](./how-to-policies-devops-resource-group.md)
* Article: [Troubleshoot Microsoft Purview policies for SQL data sources](./troubleshoot-policy-sql.md)
