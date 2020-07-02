---
title: "Quickstart: Create a managed instance of SQL Managed Instance (portal)"
description: Create a managed instance, network environment, and client VM for access using the Azure portal in this quickstart. 
services: sql-database
ms.service: sql-managed-instance
ms.subservice: operations
ms.custom: 
ms.devlang: 
ms.topic: quickstart
author: danimir
ms.author: danil
ms.reviewer: sstein, carlrab
ms.date: 09/26/2019
---
# Quickstart: Create a managed instance of SQL Managed Instance
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

This quickstart teaches you to create a managed instance of [Azure SQL Managed Instance](sql-managed-instance-paas-overview.md) in the Azure portal.

> [!IMPORTANT]
> For limitations, see [Supported regions](resource-limits.md#supported-regions) and [Supported subscription types](resource-limits.md#supported-subscription-types).

## Create a managed instance

To create a managed instance, follow these steps: 

### Sign in to the Azure portal

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/).

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Select **Azure SQL** on the left menu of the Azure portal. If **Azure SQL** is not in the list, select **All services**, and then enter **Azure SQL** in the search box.
1. Select **+Add** to open the **Select SQL deployment option** page. You can view additional information about Azure SQL Managed Instance by selecting **Show details** on the **SQL Managed instance** tile.
1. Select **Create**.

   ![Create a managed instance](./media/instance-create-quickstart/create-managed-instance.png)

4. Use the tabs on the **Create Azure SQL Managed Instance** provisioning form to add required and optional information. The following sections describe these tabs.

### Basics tab

- Fill out mandatory information required on the **Basics** tab. This is a minimum set of information required to provision a managed instance.

   !["Basics" tab for creating a managed instance](./media/instance-create-quickstart/mi-create-tab-basics.png)

   Use the table below as a reference for information required at this tab.

   | Setting| Suggested value | Description |
   | ------ | --------------- | ----------- |
   | **Subscription** | Your subscription. | A subscription that gives you permission to create new resources. |
   | **Resource group** | A new or existing resource group.|For valid resource group names, see [Naming rules and restrictions](/azure/architecture/best-practices/resource-naming).|
   | **Managed instance name** | Any valid name.|For valid names, see [Naming rules and restrictions](/azure/architecture/best-practices/resource-naming).|
   | **Region** |The region in which you want to create the managed instance.|For information about regions, see [Azure regions](https://azure.microsoft.com/regions/).|
   | **Managed instance admin login** | Any valid username. | For valid names, see [Naming rules and restrictions](/azure/architecture/best-practices/resource-naming). Don't use "serveradmin" because that's a reserved server-level role.|
   | **Password** | Any valid password.| The password must be at least 16 characters long and meet the [defined complexity requirements](../../virtual-machines/windows/faq.md#what-are-the-password-requirements-when-creating-a-vm).|

- Select **Configure Managed Instance** to size compute and storage resources and to review the pricing tiers. Use the sliders or text boxes to specify the amount of storage and the number of virtual cores. When you're finished, select **Apply** to save your selection. 

   ![Managed instance form](./media/instance-create-quickstart/mi-create-tab-configure-performance.png)

- To review your choices before you create a SQL Managed Instance, you can select **Review + create**. Or, configure networking options by selecting **Next: Networking**.

### Networking tab

- Fill out optional information on the **Networking** tab. If you omit this information, the portal will apply default settings.

   !["Networking" tab for creating a managed instance](./media/instance-create-quickstart/mi-create-tab-networking.png)

   Use the table below as a reference for information required at this tab.

   | Setting| Suggested value | Description |
   | ------ | --------------- | ----------- |
   | **Virtual network** | Select either **Create new virtual network** or a valid virtual network and subnet.| If a network or subnet is unavailable, it must be [modified to satisfy the network requirements](vnet-existing-add-subnet.md) before you select it as a target for the new managed instance. For information about the requirements for configuring the network environment for SQL Managed Instance, see [Configure a virtual network for SQL Managed Instance](connectivity-architecture-overview.md). |
   | **Connection type** | Choose between a proxy and a redirect connection type.|For more information about connection types, see [Azure SQL Managed Instance connection type](../database/connectivity-architecture.md#connection-policy).|
   | **Public endpoint**  | Select **Enable**. | For a managed instance to be accessible through the public data endpoint, you need to enable this option. | 
   | **Allow access from** (if **Public endpoint** is enabled) | Select one of the options.   |The portal experience enables configuring a security group with a public endpoint. </br> </br> Based on your scenario, select one of the following options: </br> <ul> <li>**Azure services**: We recommend this option when you're connecting from Power BI or another multitenant service. </li> <li> **Internet**: Use for test purposes when you want to quickly spin up a managed instance. We don't recommend it for production environments. </li> <li> **No access**: This option creates a **Deny** security rule. Modify this rule to make a managed instance accessible through a public endpoint. </li> </ul> </br> For more information on public endpoint security, see [Using Azure SQL Managed Instance securely with a public endpoint](public-endpoint-overview.md).|

- Select **Review + create** to review your choices before you create a managed instance. Or, configure more custom settings by selecting **Next: Additional settings**.

### Additional settings

- Fill out optional information on the **Additional settings** tab. If you omit this information, the portal will apply default settings.

   !["Additional settings" tab for creating a managed instance](./media/instance-create-quickstart/mi-create-tab-additional-settings.png)

   Use the table below as a reference for information required at this tab.

   | Setting| Suggested value | Description |
   | ------ | --------------- | ----------- |
   | **Collation** | Choose the collation that you want to use for your managed instance. If you migrate databases from SQL Server, check the source collation by using `SELECT SERVERPROPERTY(N'Collation')` and use that value.| For information about collations, see [Set or change the server collation](https://docs.microsoft.com/sql/relational-databases/collations/set-or-change-the-server-collation).|   
   | **Time zone** | Select the time zone that managed instance will observe.|For more information, see [Time zones](timezones-overview.md).|
   | **Use as failover secondary** | Select **Yes**. | Enable this option to use the managed instance as a failover group secondary.|
   | **Primary SQL Managed Instance** (if **Use as failover secondary** is set to **Yes**) | Choose an existing primary managed instance that will be joined in the same DNS zone with the managed instance you're creating. | This step will enable post-creation configuration of the failover group. For more information, see [Tutorial: Add a managed instance to a failover group](failover-group-add-instance-tutorial.md).|

## Review + create

1. Select **Review + create** tab to review your choices before you create a managed instance.

   ![Tab for reviewing and creating a managed instance](./media/instance-create-quickstart/mi-create-tab-review-create.png)

1. Select **Create** to start provisioning the managed instance.

> [!IMPORTANT]
> Deploying a managed instance is a long-running operation. Deployment of the first instance in the subnet typically takes much longer than deploying into a subnet with existing managed instances. For average provisioning times, see [SQL Managed Instance management operations](sql-managed-instance-paas-overview.md#management-operations).

## Monitor deployment progress

1. Select the **Notifications** icon to view the status of the deployment.

   ![Deployment progress of a SQL Managed Instance deployment](./media/instance-create-quickstart/mi-create-deployment-in-progress.png)

1. Select **Deployment in progress** in the notification to open the SQL Managed Instance window and further monitor the deployment progress. 

> [!TIP]
> If you closed your web browser or moved away from the deployment progress screen, follow these steps to locate the deployment progress screen:
> 1. In the Azure portal, open the resource group (on the **Basics** tab) to which you're deploying SQL Managed Instance.
> 2. Select **Deployments**.
> 3. Select the SQL Managed Instance deployment operation in progress.

> [!IMPORTANT]
> In order to be able to get the status of managed instance creation, you need to have **read permissions** over the resource group. If you don't have this permission or revoke it while the managed instance is in creation process, this can cause SQL Managed Instance not to be visible in the list of resource group deployments.
>

## View resources created

Upon successful deployment of a managed instance, to view resources created:

1. Open the resource group for your managed instance. 

   ![SQL Managed Instance resources](./media/instance-create-quickstart/resources.png)

## View and fine-tune network settings

To optionally fine-tune networking settings, inspect the following:

1. Select the route table to review the user-defined route (UDR) that was created for you.

   ![Route table](./media/instance-create-quickstart/route-table.png)

2. In the route table, review the entries to route traffic from and within the SQL Managed Instance virtual network. If you create or configure your route table manually, ensure to create these entries in the SQL Managed Instance route table.

   ![Entry for a SQL Managed Instance subnet to local](./media/instance-create-quickstart/udr.png)

3. Return to the resource group, and select the network security group.

   ![Network security group](./media/instance-create-quickstart/network-security-group.png)

4. Review the inbound and outbound security rules. 

   ![Security rules](./media/instance-create-quickstart/security-rules.png)

> [!IMPORTANT]
> If you have configured a public endpoint for SQL Managed Instance, you need to open ports to allow network traffic allowing connections to SQL Managed Instance from the public internet. See [Configure a public endpoint for SQL Managed Instance](public-endpoint-configure.md#allow-public-endpoint-traffic-on-the-network-security-group) for more information.
>

## Retrieve connection details to SQL Managed Instance

To connect to SQL Managed Instance, follow these steps to retrieve the host name and fully qualified domain name (FQDN):

1. Return to the resource group and select your managed instance.

   ![Managed instance in the resource group](./media/instance-create-quickstart/managed-instance.png)

2. On the **Overview** tab, locate the **Host** property. Copy the host name for the managed instance for use in the next quickstart.

   ![Host name](./media/instance-create-quickstart/host-name.png)

   The value copied represents a fully qualified domain name (FQDN) that can be used to connect to SQL Managed Instance. It is similar to the following address example: *your_host_name.a1b2c3d4e5f6.database.windows.net*.

## Next steps

To learn about how to connect to SQL Managed Instance:
- For an overview of the connection options for applications, see [Connect your applications to SQL Managed Instance](connect-application-instance.md).
- For a quickstart that shows how to connect to SQL Managed Instance from an Azure virtual machine, see [Configure an Azure virtual machine connection](connect-vm-instance-configure.md).
- For a quickstart that shows how to connect to SQL Managed Instance from an on-premises client computer by using a point-to-site connection, see [Configure a point-to-site connection](point-to-site-p2s-configure.md).

To restore an existing SQL Server database from on-premises to SQL Managed Instance: 
- Use the [Azure Database Migration Service for migration](../../dms/tutorial-sql-server-to-managed-instance.md) to restore from a database backup file. 
- Use the [T-SQL RESTORE command](restore-sample-database-quickstart.md) to restore from a database backup file.

For advanced monitoring of SQL Managed Instance database performance with built-in troubleshooting intelligence, see [Monitor Azure SQL Managed Instance by using Azure SQL Analytics](../../azure-monitor/insights/azure-sql.md).
