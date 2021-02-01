---
title: Distributed transactions across cloud databases (preview)
description: Overview of Elastic Database Transactions with Azure SQL Database and Azure SQL Managed Instance.
services: sql-database
ms.service: sql-database
ms.subservice: scale-out
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: conceptual
author: stevestein
ms.author: sstein
ms.reviewer:
ms.date: 03/12/2019
---
# Distributed transactions across cloud databases (preview)
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]

Elastic database transactions for Azure SQL Database and Azure SQL Managed Instance allow you to run transactions that span several databases. Elastic database transactions are available for .NET applications using ADO.NET and integrate with the familiar programming experience using the [System.Transaction](/dotnet/api/system.transactions) classes. To get the library, see [.NET Framework 4.6.1 (Web Installer)](https://www.microsoft.com/download/details.aspx?id=49981).
Additionally, for Managed Instance distributed transactions are available in [Transact-SQL](/sql/t-sql/language-elements/begin-distributed-transaction-transact-sql).

On premises, such a scenario usually requires running Microsoft Distributed Transaction Coordinator (MSDTC). Since MSDTC isn't available for Platform-as-a-Service application in Azure, the ability to coordinate distributed transactions has now been directly integrated into SQL Database or Managed Instance. Applications can connect to any database to launch distributed transactions, and one of the databases or servers will transparently coordinate the distributed transaction, as shown in the following figure.

In this document terms "distributed transactions" and "elastic database transactions" are considered synonyms and will be used interchangeably.

  ![Distributed transactions with Azure SQL Database using elastic database transactions ][1]

## Common scenarios

Elastic database transactions enable applications to make atomic changes to data stored in several different databases. The preview focuses on client-side development experiences in C# and .NET. A server-side experience (code written in stored procedures or server-side scripts) using [Transact-SQL](/sql/t-sql/language-elements/begin-distributed-transaction-transact-sql) is available for Managed Instance only.
> [!IMPORTANT]
> In preview, running elastic database transactions between Azure SQL Database and Azure SQL Managed Instance is not supported at the moment. Elastic database transaction can only span across set of SQL Databases or set of Managed Instances.

Elastic database transactions target the following scenarios:

* Multi-database applications in Azure: With this scenario, data is vertically partitioned across several databases in SQL Database or Managed Instance such that different kinds of data reside on different databases. Some operations require changes to data, which is kept in two or more databases. The application uses elastic database transactions to coordinate the changes across databases and ensure atomicity.
* Sharded database applications in Azure: With this scenario, the data tier uses the [Elastic Database client library](elastic-database-client-library.md) or self-sharding to horizontally partition the data across many databases in SQL Database or Managed Instance. One prominent use case is the need to perform atomic changes for a sharded multi-tenant application when changes span tenants. Think for instance of a transfer from one tenant to another, both residing on different databases. A second case is fine-grained sharding to accommodate capacity needs for a large tenant, which in turn typically implies that some atomic operations need to stretch across several databases used for the same tenant. A third case is atomic updates to reference data that are replicated across databases. Atomic, transacted, operations along these lines can now be coordinated across several databases using the preview.
  Elastic database transactions use two phase commit to ensure transaction atomicity across databases. It's a good fit for transactions that involve fewer than 100 databases at a time within a single transaction. These limits aren't enforced, but one should expect performance and success rates for elastic database transactions to suffer when exceeding these limits.

## Installation and migration

The capabilities for elastic database transactions are provided through updates to the .NET libraries System.Data.dll and System.Transactions.dll. The DLLs ensure that two-phase commit is used where necessary to ensure atomicity. To start developing applications using elastic database transactions, install [.NET Framework 4.6.1](https://www.microsoft.com/download/details.aspx?id=49981) or a later version. When running on an earlier version of the .NET framework, transactions will fail to promote to a distributed transaction and an exception will be raised.

After installation, you can use the distributed transaction APIs in System.Transactions with connections to SQL Database and Managed Instance. If you have existing MSDTC applications using these APIs, rebuild your existing applications for .NET 4.6 after installing the 4.6.1 Framework. If your projects target .NET 4.6, they'll automatically use the updated DLLs from the new Framework version and distributed transaction API calls in combination with connections to SQL Database or Managed Instance will now succeed.

Remember that elastic database transactions don't require installing MSDTC. Instead, elastic database transactions are directly managed by and within the service. This significantly simplifies cloud scenarios since a deployment of MSDTC isn't necessary to use distributed transactions with SQL Database or Managed Instance. Section 4 explains in more detail how to deploy elastic database transactions and the required .NET framework together with your cloud applications to Azure.

## .NET installation for Azure Cloud Services

Azure provides several offerings to host .NET applications. A comparison of the different offerings is available in [Azure App Service, Cloud Services, and Virtual Machines comparison](/azure/architecture/guide/technology-choices/compute-decision-tree). If the guest OS of the offering is smaller than .NET 4.6.1 required for elastic transactions, you need to upgrade the guest OS to 4.6.1.

For Azure App Service, upgrades to the guest OS are currently not supported. For Azure Virtual Machines, simply log into the VM and run the installer for the latest .NET framework. For Azure Cloud Services, you need to include the installation of a newer .NET version into the startup tasks of your deployment. The concepts and steps are documented in [Install .NET on a Cloud Service Role](../../cloud-services/cloud-services-dotnet-install-dotnet.md).  

Note that the installer for .NET 4.6.1 may require more temporary storage during the bootstrapping process on Azure cloud services than the installer for .NET 4.6. To ensure a successful installation, you need to increase temporary storage for your Azure cloud service in your ServiceDefinition.csdef file in the LocalResources section and the environment settings of your startup task, as shown in the following sample:

```xml
    <LocalResources>
    ...
        <LocalStorage name="TEMP" sizeInMB="5000" cleanOnRoleRecycle="false" />
        <LocalStorage name="TMP" sizeInMB="5000" cleanOnRoleRecycle="false" />
    </LocalResources>
    <Startup>
        <Task commandLine="install.cmd" executionContext="elevated" taskType="simple">
            <Environment>
        ...
                <Variable name="TEMP">
                    <RoleInstanceValue xpath="/RoleEnvironment/CurrentInstance/LocalResources/LocalResource[@name='TEMP']/@path" />
                </Variable>
                <Variable name="TMP">
                    <RoleInstanceValue xpath="/RoleEnvironment/CurrentInstance/LocalResources/LocalResource[@name='TMP']/@path" />
                </Variable>
            </Environment>
        </Task>
    </Startup>
```

## .NET development experience

### Multi-database applications

The following sample code uses the familiar programming experience with .NET System.Transactions. The TransactionScope class establishes an ambient transaction in .NET. (An “ambient transaction” is one that lives in the current thread.) All connections opened within the TransactionScope participate in the transaction. If different databases participate, the transaction is automatically elevated to a distributed transaction. The outcome of the transaction is controlled by setting the scope to complete to indicate a commit.

```csharp
    using (var scope = new TransactionScope())
    {
        using (var conn1 = new SqlConnection(connStrDb1))
        {
            conn1.Open();
            SqlCommand cmd1 = conn1.CreateCommand();
            cmd1.CommandText = string.Format("insert into T1 values(1)");
            cmd1.ExecuteNonQuery();
        }

        using (var conn2 = new SqlConnection(connStrDb2))
        {
            conn2.Open();
            var cmd2 = conn2.CreateCommand();
            cmd2.CommandText = string.Format("insert into T2 values(2)");
            cmd2.ExecuteNonQuery();
        }

        scope.Complete();
    }
```

### Sharded database applications

Elastic database transactions for SQL Database and Managed Instance also support coordinating distributed transactions where you use the OpenConnectionForKey method of the elastic database client library to open connections for a scaled out data tier. Consider cases where you need to guarantee transactional consistency for changes across several different sharding key values. Connections to the shards hosting the different sharding key values are brokered using OpenConnectionForKey. In the general case, the connections can be to different shards such that ensuring transactional guarantees requires a distributed transaction.
The following code sample illustrates this approach. It assumes that a variable called shardmap is used to represent a shard map from the elastic database client library:

```csharp
    using (var scope = new TransactionScope())
    {
        using (var conn1 = shardmap.OpenConnectionForKey(tenantId1, credentialsStr))
        {
            SqlCommand cmd1 = conn1.CreateCommand();
            cmd1.CommandText = string.Format("insert into T1 values(1)");
            cmd1.ExecuteNonQuery();
        }

        using (var conn2 = shardmap.OpenConnectionForKey(tenantId2, credentialsStr))
        {
            var cmd2 = conn2.CreateCommand();
            cmd2.CommandText = string.Format("insert into T1 values(2)");
            cmd2.ExecuteNonQuery();
        }

        scope.Complete();
    }
```

## Transact-SQL development experience

A server-side distributed transactions using Transact-SQL are available only for Azure SQL Managed Instance. Distributed transaction can be executed only between Managed Instances that belong to the same [Server trust group](../managed-instance/server-trust-group-overview.md). In this scenario, Managed Instances need to use [linked server](/sql/relational-databases/linked-servers/create-linked-servers-sql-server-database-engine#TsqlProcedure) to reference each other.

The following sample Transact-SQL code uses [BEGIN DISTRIBUTED TRANSACTION](/sql/t-sql/language-elements/begin-distributed-transaction-transact-sql) to start distributed transaction.

```Transact-SQL

    -- Configure the Linked Server
    -- Add one Azure SQL Managed Instance as Linked Server
    EXEC sp_addlinkedserver
        @server='RemoteServer', -- Linked server name
        @srvproduct='',
        @provider='sqlncli', -- SQL Server Native Client
        @datasrc='managed-instance-server.46e7afd5bc81.database.windows.net' -- Managed Instance endpoint

    -- Add credentials and options to this Linked Server
    EXEC sp_addlinkedsrvlogin
        @rmtsrvname = 'RemoteServer', -- Linked server name
        @useself = 'false',
        @rmtuser = '<login_name>',         -- login
        @rmtpassword = '<secure_password>' -- password

    USE AdventureWorks2012;
    GO
    SET XACT_ABORT ON;
    GO
    BEGIN DISTRIBUTED TRANSACTION;
    -- Delete candidate from local instance.
    DELETE AdventureWorks2012.HumanResources.JobCandidate
        WHERE JobCandidateID = 13;
    -- Delete candidate from remote instance.
    DELETE RemoteServer.AdventureWorks2012.HumanResources.JobCandidate
        WHERE JobCandidateID = 13;
    COMMIT TRANSACTION;
    GO
```

## Combining .NET and Transact-SQL development experience

.NET applications that use System.Transaction classes can combine TransactionScope class with Transact-SQL statement BEGIN DISTRIBUTED TRANSACTION. Within TransactionScope, inner transaction that executes BEGIN DITRIBUTED TRANSACTION will explicitly be promoted to distributed transaction. Also, when second SqlConnecton is opened within the TransactionScope it will be implicitly promoted to distributed transaction. Once distributed transaction is started, all subsequent transactions requests, whether they are coming from .NET or Transact-SQL, will join the parent distributed transaction. As consequence all nested transaction scopes initiated by BEGIN statement will end up in same transaction and COMMIT/ROLLBACK statements will have following effect on overall outcome:
 * COMMIT statement will not have any effect on transaction scope initiated by BEGIN statement, that is, no results will be committed before Complete() method is invoked on TransactionScope object. If TransactionScope object is destroyed before being completed, all changes done within the scope are rolled back.
 * ROLLBACK statement will cause entire TransactionScope to roll back. Any attempts to enlist new transactions within TransactionScope will fail afterwards, as well as attempt to invoke Complete() on TransactionScope object.

Here is an example where transaction is explicitly promoted to distributed transaction with Transact-SQL.

```csharp
	using (TransactionScope s = new TransactionScope())
	{
		using (SqlConnection conn = new SqlConnection(DB0_ConnectionString)
		{
			conn.Open();
		
			// Transaction is here promoted to distributed by BEGIN statement
			//
			Helper.ExecuteNonQueryOnOpenConnection(conn, "BEGIN DISTRIBUTED TRAN");
			// ...
		}
	 
		using (SqlConnection conn2 = new SqlConnection(DB1_ConnectionString)
		{
			conn2.Open();
			// ...
		}
		
		s.Complete();
	}
```

Following example shows a transaction that is implicitly promoted to distributed transaction once the second SqlConnecton was started within the TransactionScope.

```csharp
	using (TransactionScope s = new TransactionScope())
	{
		using (SqlConnection conn = new SqlConnection(DB0_ConnectionString)
		{
			conn.Open();
			// ...
		}
		
		using (SqlConnection conn = new SqlConnection(DB1_ConnectionString)
		{
			// Because this is second SqlConnection within TransactionScope transaction is here implicitly promoted distributed.
			//
			conn.Open(); 
			Helper.ExecuteNonQueryOnOpenConnection(conn, "BEGIN DISTRIBUTED TRAN");
			Helper.ExecuteNonQueryOnOpenConnection(conn, lsQuery);
			// ...
		}
		
		s.Complete();
	}
```

## Transactions across multiple servers for Azure SQL Database

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]
> [!IMPORTANT]
> The PowerShell Azure Resource Manager module is still supported by Azure SQL Database, but all future development is for the Az.Sql module. For these cmdlets, see [AzureRM.Sql](/powershell/module/AzureRM.Sql/). The arguments for the commands in the Az module and in the AzureRm modules are substantially identical.

Elastic database transactions are supported across different servers in Azure SQL Database. When transactions cross server boundaries, the participating servers first need to be entered into a mutual communication relationship. Once the communication relationship has been established, any database in any of the two servers can participate in elastic transactions with databases from the other server. With transactions spanning more than two servers, a communication relationship needs to be in place for any pair of servers.

Use the following PowerShell cmdlets to manage cross-server communication relationships for elastic database transactions:

* **New-AzSqlServerCommunicationLink**: Use this cmdlet to create a new communication relationship between two servers in Azure SQL Database. The relationship is symmetric, which means both servers can initiate transactions with the other server.
* **Get-AzSqlServerCommunicationLink**: Use this cmdlet to retrieve existing communication relationships and their properties.
* **Remove-AzSqlServerCommunicationLink**: Use this cmdlet to remove an existing communication relationship.

## Transactions across multiple servers for Azure SQL Managed Instance

Distributed transactions are supported across different servers in Azure SQL Managed Instance. When transactions cross Managed Instance boundaries, the participating instances first need to be entered into a mutual security and communication relationship. This is done by creating a [Server Trust Group](../managed-instance/server-trust-group-overview.md), which can be done on Azure portal. If Managed Instances are not on the same Virtual network then [Virtual network peering](../../virtual-network/virtual-network-peering-overview.md) needs to be set up and Network security group inbound and outbound rules need to allow ports 5024 and 11000-12000 on all participating Virtual networks.

  ![Server Trust Groups on Azure Portal][3]

Following diagram shows Server Trust Group with Managed Instances that can execute distributed transactions with .NET or Transact-SQL.

  ![Distributed transactions with Azure SQL Managed Instance using elastic transactions][2]

## Monitoring transaction status

Use Dynamic Management Views (DMVs) to monitor status and progress of your ongoing elastic database transactions. All DMVs related to transactions are relevant for distributed transactions in SQL Database and Managed Instance. You can find the corresponding list of DMVs here: [Transaction Related Dynamic Management Views and Functions (Transact-SQL)](/sql/relational-databases/system-dynamic-management-views/transaction-related-dynamic-management-views-and-functions-transact-sql).

These DMVs are particularly useful:

* **sys.dm\_tran\_active\_transactions**: Lists currently active transactions and their status. The UOW (Unit Of Work) column can identify the different child transactions that belong to the same distributed transaction. All transactions within the same distributed transaction carry the same UOW value. For more information, see the [DMV documentation](/sql/relational-databases/system-dynamic-management-views/sys-dm-tran-active-transactions-transact-sql).
* **sys.dm\_tran\_database\_transactions**: Provides additional information about transactions, such as placement of the transaction in the log. For more information, see the [DMV documentation](/sql/relational-databases/system-dynamic-management-views/sys-dm-tran-database-transactions-transact-sql).
* **sys.dm\_tran\_locks**: Provides information about the locks that are currently held by ongoing transactions. For more information, see the [DMV documentation](/sql/relational-databases/system-dynamic-management-views/sys-dm-tran-locks-transact-sql).

## Limitations

The following limitations currently apply to elastic database transactions in SQL Database:

* Only transactions across databases in SQL Database are supported. Other [X/Open XA](https://en.wikipedia.org/wiki/X/Open_XA) resource providers and databases outside of SQL Database can't participate in elastic database transactions. That means that elastic database transactions can't stretch across on premises SQL Server and Azure SQL Database. For distributed transactions on premises, continue to use MSDTC.
* Only client-coordinated transactions from a .NET application are supported. Server-side support for T-SQL such as BEGIN DISTRIBUTED TRANSACTION is planned, but not yet available.
* Transactions across WCF services aren't supported. For example, you have a WCF service method that executes a transaction. Enclosing the call within a transaction scope will fail as a [System.ServiceModel.ProtocolException](/dotnet/api/system.servicemodel.protocolexception).

The following limitations currently apply to distributed transactions in Managed Instance:

* Only transactions across databases in Managed Instance are supported. Other [X/Open XA](https://en.wikipedia.org/wiki/X/Open_XA) resource providers and databases outside of Azure SQL Managed Instance can't participate in distributed transactions. That means that distributed transactions can't stretch across on premises SQL Server and Azure SQL Managed Instance. For distributed transactions on premises, continue to use MSDTC.
* Transactions across WCF services aren't supported. For example, you have a WCF service method that executes a transaction. Enclosing the call within a transaction scope will fail as a [System.ServiceModel.ProtocolException](/dotnet/api/system.servicemodel.protocolexception).
* Azure SQL Managed Instance must be part of a [Server trust group](../managed-instance/server-trust-group-overview.md) in order to participate in distributed transaction.
* Limitations of [Server trust groups](../managed-instance/server-trust-group-overview.md) affect distributed transactions.
* Managed Instances that participate in distributed transactions need to have connectivity over private endpoints (using private IP address from the virtual network where they are deployed) and need to be mutually referenced using private FQDNs. Client applications can use distributed transactions on private endpoints. Additionally, in cases when Transact-SQL leverages linked servers referencing private endpoints, client applications can use distributed transactions on public endpoints as well. This limitation is explained on the following diagram.
  ![Private endpoint connectivity limitation][4]
## Next steps

* For questions, reach out to us on the [Microsoft Q&A question page for SQL Database](/answers/topics/azure-sql-database.html).
* For feature requests, add them to the [SQL Database feedback forum](https://feedback.azure.com/forums/217321-sql-database/) or [Managed Instance forum](https://feedback.azure.com/forums/915676-sql-managed-instance).



<!--Image references-->
[1]: ./media/elastic-transactions-overview/distributed-transactions.png
[2]: ./media/elastic-transactions-overview/sql-mi-distributed-transactions.png
[3]: ./media/elastic-transactions-overview/server-trust-groups-azure-portal.png
[4]: ./media/elastic-transactions-overview/managed-instance-distributed-transactions-private-endpoint-limitations.png
