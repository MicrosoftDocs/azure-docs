---
title: 'Azure portal: Create a SQL managed instance | Microsoft Docs'
description: Create a SQL managed instance, network environment, and client VM for access.
services: sql-database
ms.service: sql-database
ms.subservice: managed-instance
ms.custom: 
ms.devlang: 
ms.topic: quickstart
author: jovanpop-msft
ms.author: jovanpop
ms.reviewer: sstein, carlrab
manager: craigg
ms.date: 04/10/2019
---
# Quickstart: Create an Azure SQL Database managed instance

This quickstart walks through how to create an Azure SQL Database [managed instance](sql-database-managed-instance.md) in the Azure portal.

> [!IMPORTANT]
> For limitations, see [supported regions](sql-database-managed-instance-resource-limits.md#supported-regions) and [supported subscription types](sql-database-managed-instance-resource-limits.md#supported-subscription-types).

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

## Create a managed instance

The following steps show you how to create a managed instance.

1. Choose **Create a resource** in the upper left-hand corner of the Azure portal.
2. Locate **managed instance** and then select **Azure SQL Managed Instance**.
3. Select **Create**.

   ![Create managed instance](./media/sql-database-managed-instance-get-started/managed-instance-create.png)

4. Fill out the **SQL managed instance** form with the requested information, using the information in the following table:

   | Setting| Suggested value | Description |
   | ------ | --------------- | ----------- |
   | **Subscription** | Your subscription | A subscription in which you have permission to create new resources |
   |**Managed instance name**|Any valid name|For valid names, see [naming rules and restrictions](https://docs.microsoft.com/azure/architecture/best-practices/naming-conventions).|
   |**Managed instance admin login**|Any valid user name|For valid names, see [naming rules and restrictions](https://docs.microsoft.com/azure/architecture/best-practices/naming-conventions). Don't use "serveradmin" as that is a reserved server-level role.|
   |**Password**|Any valid password|The password must be at least 16 characters long and meet the [defined complexity requirements](../virtual-machines/windows/faq.md#what-are-the-password-requirements-when-creating-a-vm).|
   |**Time zone**|The time zone to be observed by your managed instance|For more information, see [time zones](sql-database-managed-instance-timezone.md)|
   |**Collation**|The collation that you want to use for your managed instance|If you are migrating databases from SQL Server, check the source collation using `SELECT SERVERPROPERTY(N'Collation')` and use that value. For information about collations, see [server-level collations](https://docs.microsoft.com/sql/relational-databases/collations/set-or-change-the-server-collation).|
   |**Location**|The location in which you want to create the managed instance|For information about regions, see [Azure regions](https://azure.microsoft.com/regions/).|
   |**Virtual network**|Select either **Create new virtual network** or a valid virtual network and subnet.| If a network/subnet is unavailable it is must be [modified to satisfy the network requirements](sql-database-managed-instance-configure-vnet-subnet.md) before you select it as a target for the new managed instance. For information regarding the requirements for configuring the network environment for a managed instance, see [configure a VNet for a managed instance](sql-database-managed-instance-connectivity-architecture.md). |
   |**Connection type**|Choose between Proxy and Redirect connection type|For more information regarding connection types, see [Azure SQL connection policy](sql-database-connectivity-architecture.md#connection-policy).|
   |**Resource group**|A new or existing resource group|For valid resource group names, see [Naming rules and restrictions](https://docs.microsoft.com/azure/architecture/best-practices/naming-conventions).|

   ![managed instance form](./media/sql-database-managed-instance-get-started/managed-instance-create-form.png)

5. To use the managed instance as an instance failover group secondary, select the checkout and specify the DnsAzurePartner managed instance. This feature is in preview and not shown in the accompanying screenshot.
6. Select **Pricing tier** to size compute and storage resources as well as review the pricing tier options. The General Purpose pricing tier with 32 GB of memory and 16 vCores is the default value.
7. Use the sliders or text boxes to specify the amount of storage and the number of virtual cores.
8. When complete, choose **Apply** to save your selection.  
9. Select **Create** to deploy the managed instance.
10. Select the **Notifications** icon to view the status of deployment.

    ![managed instance deployment progress](./media/sql-database-managed-instance-get-started/deployment-progress.png)

11. Select **Deployment in progress** to open the managed instance window to further monitor the deployment progress.

> [!IMPORTANT]
> For the first instance in a subnet, deployment time is typically much longer than in subsequent instances. Don't cancel the deployment operation because it lasts longer than you expected. Creating the second managed instance in the subnet only takes a couple of minutes.

## Review resources and retrieve your fully qualified server name

After the deployment completes successfully, review the resources created and retrieve the fully qualified server name for use in later quickstarts.

1. Open the resource group for your managed instance and view its resources that were created for you in the [create a managed instance](#create-a-managed-instance) quickstart.

   ![Managed instance resources](./media/sql-database-managed-instance-get-started/resources.png)

2. Select the route table to review the user-defined route UDR) table that was created for you.

   ![Route table](./media/sql-database-managed-instance-get-started/route-table.png)

3. In the route table, review the entries to route traffic from and within the managed instance virtual network. If you are creating or configuring your route table manually, you must be sure to create these entries in the route table.

   ![Entry for MI subnet to local](./media/sql-database-managed-instance-get-started/udr.png)

4. Return to the resource group and select the network security group to review the security rules.

   ![Network-security-group](./media/sql-database-managed-instance-get-started/network-security-group.png)

5. Review the inbound and outbound security rules.

   ![Security rules](./media/sql-database-managed-instance-get-started/security-rules.png)

6. Return to the resource group and select your managed instance.

   ![Managed instance](./media/sql-database-managed-instance-get-started/managed-instance.png)

7. On the **Overview** tab, locate the **Host** property and copy the fully qualified host address for the managed instance for use in the next quickstart.

   ![Host name](./media/sql-database-managed-instance-get-started/host-name.png)

   The name is similar to **your_machine_name.a1b2c3d4e5f6.database.windows.net**.

## Next steps

- To learn about connecting to a managed instance, see:
  - For an overview of the connection options for applications, see [connect your applications to a managed instance](sql-database-managed-instance-connect-app.md).
  - For a quickstart showing how to connect to a managed instance from an Azure virtual machine, see [Configure an Azure virtual machine connection](sql-database-managed-instance-configure-vm.md).
  - For a quickstart showing how to connect to a managed instance from an on-premises client computer using a point-to-site connection, see [Configure a point-to-site connection](sql-database-managed-instance-configure-p2s.md).
- To restore an existing SQL Server database from on-premises to a Managed instance, you can use the [Azure Database Migration Service (DMS) for migration](../dms/tutorial-sql-server-to-managed-instance.md) to restore from a database backup file or the [T-SQL RESTORE command](sql-database-managed-instance-get-started-restore.md) to restore from a database backup file.
- For advanced monitoring of managed instance database performance with built-in troubleshooting intelligence, see [Monitor Azure SQL Database using Azure SQL Analytics](../azure-monitor/insights/azure-sql.md)
