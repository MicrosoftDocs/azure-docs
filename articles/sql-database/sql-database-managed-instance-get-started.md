---
title: 'Azure portal: Create a managed instance'
description: Create a SQL Database managed instance, network environment, and client VM for access.
services: sql-database
ms.service: sql-database
ms.subservice: managed-instance
ms.custom: 
ms.devlang: 
ms.topic: quickstart
author: danimir
ms.author: danil
ms.reviewer: sstein, carlrab
ms.date: 09/26/2019
---
# Quickstart: Create an Azure SQL Database managed instance

This quickstart walks you through how to create an Azure SQL Database [managed instance](sql-database-managed-instance.md) in Azure portal.

> [!IMPORTANT]
> For limitations, see [Supported regions](sql-database-managed-instance-resource-limits.md#supported-regions) and [Supported subscription types](sql-database-managed-instance-resource-limits.md#supported-subscription-types).

## Sign in to Azure portal

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/).

Sign in to [Azure portal](https://portal.azure.com/).

## Create a managed instance

The following steps show you how to create a managed instance:

1. Select **Azure SQL** on the left menu of Azure portal. If **Azure SQL** is not in the list, select **All services**, and then enter **Azure SQL** in the search box.
2. Select **+Add** to open the **Select SQL deployment option** page. You can view additional information about an Azure SQL Database managed instance by selecting **Show details** on the **Managed instances** tile.
3. Select **Create**.

   ![Create a managed instance](./media/sql-database-managed-instance-get-started/create-managed-instance.png)

4. Use the tabs on the **Create Azure SQL Database Managed Instance** provisioning form to add required and optional information. The following sections describe these tabs.

### Basics

- Fill out mandatory information required on the **Basics** tab. This is a minimum set of information required to provision a managed instance.

   !["Basics" tab for creating a managed instance](./media/sql-database-managed-instance-get-started/tabs/mi-create-tab-basics.png)

   Use the table below as a reference for information required at this tab.

   | Setting| Suggested value | Description |
   | ------ | --------------- | ----------- |
   | **Subscription** | Your subscription. | A subscription that gives you permission to create new resources. |
   | **Resource group** | A new or existing resource group.|For valid resource group names, see [Naming rules and restrictions](/azure/architecture/best-practices/resource-naming).|
   | **Managed instance name** | Any valid name.|For valid names, see [Naming rules and restrictions](/azure/architecture/best-practices/resource-naming).|
   | **Region** |The region in which you want to create the managed instance.|For information about regions, see [Azure regions](https://azure.microsoft.com/regions/).|
   | **Managed instance admin login** | Any valid username. | For valid names, see [Naming rules and restrictions](/azure/architecture/best-practices/resource-naming). Don't use "serveradmin" because that's a reserved server-level role.|
   | **Password** | Any valid password.| The password must be at least 16 characters long and meet the [defined complexity requirements](../virtual-machines/windows/faq.md#what-are-the-password-requirements-when-creating-a-vm).|

- Select **Configure Managed Instance** to size compute and storage resources and to review the pricing tiers. Use the sliders or text boxes to specify the amount of storage and the number of virtual cores. When you're finished, select **Apply** to save your selection. 

   ![Managed instance form](./media/sql-database-managed-instance-get-started/tabs/mi-create-tab-configure-performance.png)

- To review your choices before you create a managed instance, you can select **Review + create**. Or, configure networking options by selecting **Next: Networking**.

### Networking

- Fill out optional information on the **Networking** tab. If you omit this information, the portal will apply default settings.

   !["Networking" tab for creating a managed instance](./media/sql-database-managed-instance-get-started/tabs/mi-create-tab-networking.png)

   Use the table below as a reference for information required at this tab.

   | Setting| Suggested value | Description |
   | ------ | --------------- | ----------- |
   | **Virtual network** | Select either **Create new virtual network** or a valid virtual network and subnet.| If a network or subnet is unavailable, it must be [modified to satisfy the network requirements](sql-database-managed-instance-configure-vnet-subnet.md) before you select it as a target for the new managed instance. For information about the requirements for configuring the network environment for a managed instance, see [Configure a virtual network for a managed instance](sql-database-managed-instance-connectivity-architecture.md). |
   | **Connection type** | Choose between a proxy and a redirect connection type.|For more information about connection types, see [Azure SQL Database connection policy](sql-database-connectivity-architecture.md#connection-policy).|
   | **Public endpoint**  | Select **Enable**. | For a managed instance to be accessible through the public data endpoint, you need to enable this option. | 
   | **Allow access from** (if **Public endpoint** is enabled) | Select one of the options.   |The portal experience enables configuring a security group with a public endpoint. </br> </br> Based on your scenario, select one of the following options: </br> <ul> <li>**Azure services**: We recommend this option when you're connecting from Power BI or another multitenant service. </li> <li> **Internet**: Use for test purposes when you want to quickly spin up a managed instance. We don't recommend it for production environments. </li> <li> **No access**: This option creates a **Deny** security rule. Modify this rule to make a managed instance accessible through a public endpoint. </li> </ul> </br> For more information on public endpoint security, see [Using an Azure SQL Database managed instance securely with a public endpoint](sql-database-managed-instance-public-endpoint-securely.md).|

- Select **Review + create** to review your choices before you create a managed instance. Or, configure more custom settings by selecting **Next: Additional settings**.

### Additional settings

- Fill out optional information on the **Additional settings** tab. If you omit this information, the portal will apply default settings.

   !["Additional settings" tab for creating a managed instance](./media/sql-database-managed-instance-get-started/tabs/mi-create-tab-additional-settings.png)

   Use the table below as a reference for information required at this tab.

   | Setting| Suggested value | Description |
   | ------ | --------------- | ----------- |
   | **Collation** | Choose the collation that you want to use for your managed instance. If you migrate databases from SQL Server, check the source collation by using `SELECT SERVERPROPERTY(N'Collation')` and use that value.| For information about collations, see [Set or change the server collation](https://docs.microsoft.com/sql/relational-databases/collations/set-or-change-the-server-collation).|   
   | **Time zone** | Select the time zone that your managed instance will observe.|For more information, see [Time zones](sql-database-managed-instance-timezone.md).|
   | **Use as failover secondary** | Select **Yes**. | Enable this option to use the managed instance as a failover group secondary.|
   | **Primary managed instance** (if **Use as failover secondary** is set to **Yes**) | Choose an existing primary managed instance that will be joined in the same DNS zone with the managed instance you're creating. | This step will enable post-creation configuration of the failover group. For more information, see [Tutorial: Add a SQL Database managed instance to a failover group](sql-database-managed-instance-failover-group-tutorial.md).|

### Review + create

5. Select **Review + create** tab to review your choices before you create the managed instance.

   ![Tab for reviewing and creating a managed instance](./media/sql-database-managed-instance-get-started/tabs/mi-create-tab-review-create.png)

6. Select **Create** to start provisioning the managed instance.

> [!IMPORTANT]
> Deploying a managed instance is a long-running operation. Deployment of the first instance in the subnet typically takes much longer than deploying into a subnet with existing managed instances. For average provisioning times, see [Managed instance management operations](sql-database-managed-instance.md#managed-instance-management-operations).

### Monitor deployment progress

7. Select the **Notifications** icon to view the status of the deployment.

   ![Deployment progress of a managed instance deployment](./media/sql-database-managed-instance-get-started/in-progress/mi-create-deployment-in-progress.png)

8. Select **Deployment in progress** in the notification to open the managed instance window and further monitor the deployment progress. 

> [!TIP]
> If you closed your web browser or moved away from the deployment progress screen, follow these steps to locate back the deployment progress screen:
> 1. In Azure portal, open the resource group (on the **Basics** tab) to which you're deploying a managed instance.
> 2. Select **Deployments**.
> 3. Select the managed instance deployment operation in progress.

> [!IMPORTANT]
> In order to be able to get the status of managed instance creation, you need to have **read permissions** over the resource group. If you don't have this permission or revoke it while managed instance is in creation process, this can cause managed instance not to be visible in list of resource group deployments.
>

## Post-deployment operations

To review resources created, fine-tune network settings, and retrieve host connection details (FQDN) follow steps described in this section.

### View resources created

Upon successful deployment of managed instance, to view resources created:

1. Open the resource group for your managed instance. View its resources that were created for you in the [Create a managed instance](#create-a-managed-instance) quickstart.

   ![Managed instance resources](./media/sql-database-managed-instance-get-started/resources.png)

### View and fine-tune network settings

To optionally fine-tune networking settings, inspect the following:

1. Select the route table to review the user-defined route (UDR) that was created for you.

   ![Route table](./media/sql-database-managed-instance-get-started/route-table.png)

2. In the route table, review the entries to route traffic from and within the managed instance's virtual network. If you create or configure your route table manually, ensure to create these entries in the managed instance route table.

   ![Entry for a managed instance subnet to local](./media/sql-database-managed-instance-get-started/udr.png)

3. Return to the resource group, and select the network security group.

   ![Network security group](./media/sql-database-managed-instance-get-started/network-security-group.png)

4. Review the inbound and outbound security rules. 

   ![Security rules](./media/sql-database-managed-instance-get-started/security-rules.png)

> [!IMPORTANT]
> If you have configured public endpoint for your managed instance, you need to open ports to allow network traffic allowing connections to managed instance from the public Internet, see [Configure a public endpoint for managed instance](sql-database-managed-instance-public-endpoint-configure.md#allow-public-endpoint-traffic-on-the-network-security-group) for more information.
>

### Retrieve connection details to managed instance

To connect to managed instance, follow these steps to retrieve host name and fully qualified domain name (FQDN):

1. Return to the resource group and select your managed instance.

   ![Managed instance in the resource group](./media/sql-database-managed-instance-get-started/managed-instance.png)

2. On the **Overview** tab, locate the **Host** property. Copy the host name for the managed instance for use in the next quickstart.

   ![Host name](./media/sql-database-managed-instance-get-started/host-name.png)

   The value copied represents a fully qualified domain name (FQDN) that can be used to connect to managed instance. It is similar to the following address example: *your_host_name.a1b2c3d4e5f6.database.windows.net*.

## Next steps

To learn about how to connect to a managed instance:
- For an overview of the connection options for applications, see [Connect your applications to a managed instance](sql-database-managed-instance-connect-app.md).
- For a quickstart that shows how to connect to a managed instance from an Azure virtual machine, see [Configure an Azure virtual machine connection](sql-database-managed-instance-configure-vm.md).
- For a quickstart that shows how to connect to a managed instance from an on-premises client computer by using a point-to-site connection, see [Configure a point-to-site connection](sql-database-managed-instance-configure-p2s.md).

To restore an existing SQL Server database from on-premises to a managed instance: 
- Use the [Azure Database Migration Service for migration](../dms/tutorial-sql-server-to-managed-instance.md) to restore from a database backup file. 
- Use the [T-SQL RESTORE command](sql-database-managed-instance-get-started-restore.md) to restore from a database backup file.

For advanced monitoring of managed instance database performance with built-in troubleshooting intelligence, see [Monitor Azure SQL Database by using Azure SQL Analytics](../azure-monitor/insights/azure-sql.md).
