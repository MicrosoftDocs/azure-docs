---
title: SQL Hosting Servers on Azure Stack | Microsoft Docs
description: How to add SQL instances for provisioning through the SQL Adapter Resource Provider
services: azure-stack
documentationCenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/18/2018
ms.author: jeffgilb

---
# Add hosting servers for the SQL resource provider
You can use SQL instances on VMs inside of your [Azure Stack](azure-stack-poc.md), or an instance outside of your Azure Stack environment, provided the resource provider can connect to it. The general requirements are:

* The SQL instance must be dedicated for use by the RP and user workloads. You cannot use a SQL instance that is being used by any other consumer, including App Services.
* The SQL resource provider VM is not domain joined and can only connect using SQL authentication.
* You must configure an account with appropriate privileges for use by the resource provider.
* The resource provider and users, such as Web Apps, use the user network, so connectivity to the SQL instance on this network is required. This requirement typically means the IP for your SQL instances must be on a public network.
* Management of the SQL instances and their hosts is up to you; the resource provider does not perform patching, backup, credential rotation, etc.
* SKUs can be used to create different classes of SQL abilities, such as performance, Always On, etc.

A number of SQL IaaS virtual machine images are available through the Marketplace Management feature. Make sure you always download the latest version of the **SQL IaaS Extension** before you deploy a VM using a Marketplace item. The SQL images are the same as the SQL VMs that are available in Azure. For SQL VMs created from these images, the IaaS extension and corresponding portal enhancements provide features such as automatic patching and backup capabilities.

There are other options for deploying SQL VMs, including templates in the [Azure Stack Quickstart Gallery](https://github.com/Azure/AzureStack-QuickStart-Templates).

> [!NOTE]
> Any hosting servers installed on a multi-node Azure Stack must be created from a user subscription. They can't be created from the Default Provider Subscription. They must be created from the user portal or from a PowerShell session with an appropriate login. All hosting servers are chargeable VMs and must have appropriate SQL licenses. The service administrator _can_ be the owner of that subscription.


### Required Privileges

You can create a new administrative user with less than full sysadmin privileges. The specific operations that need to be allowed are:

- Database: Create, Alter, With Containment (Always On only), Drop, Backup
- Availability Group: Alter, Join, Add/Remove Database
- Login: Create, Select, Alter, Drop, Revoke
- Select Operations: \[master\].\[sys\].\[availability_group_listeners\] (AlwaysOn), sys.availability_replicas (AlwaysOn), sys.databases, \[master\].\[sys\].\[dm_os_sys_memory\], SERVERPROPERTY, \[master\].\[sys\].\[availability_groups\] (AlwaysOn), sys.master_files



## Provide capacity by connecting to a standalone hosting SQL server
You can use standalone (non-HA) SQL servers using any edition of SQL Server 2014 or SQL Server 2016. Make sure you have the credentials for an account with system admin privileges.

To add a standalone hosting server that is already provisioned, follow these steps:

1. Sign in to the Azure Stack admin portal as a service administrator

2. Click **Browse** &gt; **ADMINISTRATIVE RESOURCES** &gt; **SQL Hosting Servers**.

  ![](./media/azure-stack-sql-rp-deploy/sqlhostingservers.png)

  The **SQL Hosting Servers** blade is where you can connect the SQL Server Resource Provider to actual instances of SQL Server that serve as the resource provider’s backend.

  ![Hosting Servers](./media/azure-stack-sql-rp-deploy/sqladapterdashboard.png)

3. Fill the form with the connection details of your SQL Server instance.

  ![New Hosting Server](./media/azure-stack-sql-rp-deploy/sqlrp-newhostingserver.png)

    You can optionally include an instance name, and a port number can be provided if the instance is not assigned to the default port of 1433.

  > [!NOTE]
  > As long as the SQL instance can be accessed by the user and admin Azure Resource Manager, it can be placed under control of the resource provider. The SQL instance __must__ be allocated exclusively to the RP.

4. As you add servers, you must assign them to a new or existing SKU to differentiate service offerings. For example, you can have a SQL Enterprise instance providing:
  - database capacity
  - automatic backup
  - reserve high-performance servers for individual departments
  - and so on.

  The SKU name should reflect the properties so that users can place their databases appropriately. All hosting servers in a SKU should have the same capabilities.

> [!IMPORTANT]
> Special characters, including spaces and periods, are not supported in the **Family** or **Tier** names when you create a SKU for the SQL and MySQL resource providers.

An example:

![SKUs](./media/azure-stack-sql-rp-deploy/sqlrp-newsku.png)

>[!NOTE]
> SKUs can take up to an hour to be visible in the portal. Users cannot create a database until the SKU is fully created.

## Provide capacity using SQL Always On Availability Groups
Configuring SQL Always On instances requires additional steps and involves at least three VMs (or physical machines).

> [!NOTE]
> The SQL adapter RP _only_ supports SQL 2016 SP1 Enterprise or later instances for Always On, as it requires new SQL features such as automatic seeding. In addition to the preceding common list of requirements:

Specifically, you must enable [Automatic Seeding](https://docs.microsoft.com/sql/database-engine/availability-groups/windows/automatically-initialize-always-on-availability-group) on each availability group for each instance of SQL Server:

  ```
  ALTER AVAILABILITY GROUP [<availability_group_name>]
      MODIFY REPLICA ON 'InstanceName'
      WITH (SEEDING_MODE = AUTOMATIC)
  GO
  ```

On secondary instances use these SQL commands:

  ```
  ALTER AVAILABILITY GROUP [<availability_group_name>] GRANT CREATE ANY DATABASE
  GO
  ```

To add SQL Always On hosting servers, follow these steps:

1. Sign in to the Azure Stack admin portal as a service admin

2. Click **Browse** &gt; **ADMINISTRATIVE RESOURCES** &gt; **SQL Hosting Servers** &gt; **+Add**.

	The **SQL Hosting Servers** blade is where you can connect the SQL Server Resource Provider to actual instances of SQL Server that serve as the resource provider’s backend.

3. Fill the form with the connection details of your SQL Server instance, being sure to use the FQDN address of the Always On Listener (and optional port number). Provide the account information for the account you configured with system admin privileges.

4. Check this box to enable support for SQL Always On Availability Group instances.

	![Hosting Servers](./media/azure-stack-sql-rp-deploy/AlwaysOn.PNG)

5. Add the SQL Always On instance to a SKU. 

> [!IMPORTANT]
> You cannot mix standalone servers with Always On instances in the same SKU. Attempting to mix types after adding the first hosting server results in an error.


## Making SQL databases available to users

Create plans and offers to make SQL databases available for users. Add the Microsoft.SqlAdapter service to the plan, and add either an existing Quota, or create a new one. If you create a quota, you specify the capacity to allow the user.

![Create plans and offers to include databases](./media/azure-stack-sql-rp-deploy/sqlrp-newplan.png)


## Next steps

[Add databases](azure-stack-sql-resource-provider-databases.md)
