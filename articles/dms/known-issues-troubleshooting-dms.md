---
title: Article about known troubleshooting common issues/errors associated with using Azure Database Migration Service | Microsoft Docs
description: Learn about how to troubleshoot common known issues/errors associated with using Azure Database Migration Service.
services: database-migration
author: HJToland3
ms.author: jtoland
manager: craigg
ms.reviewer: craigg
ms.service: dms
ms.workload: data-services
ms.custom: mvc
ms.topic: article
ms.date: 06/18/2019
---

# Troubleshoot common Azure Database Migration Service issues and errors

This article describes some common issues and errors that Azure Database Migration Service users can come across. The article also includes information about how to resolve these issues and errors.

## Migration activity in queued state

When you create new activities in an Azure Database Migration Service project, the activities remain in a queued state.

| Cause         | Resolution |
| ------------- | ------------- |
| This issue happens when the Azure Database Migration Service instance has reached maximum capacity for ongoing tasks that concurrently run. Any new activity is queued until the capacity becomes available. | Validate the Data Migration Service instance has running activities across projects. You can continue to create new activities that automatically get added to the queue for execution. As soon as any of the existing running activities complete, the next queued activity starts running and the status changes to running state automatically. You don't need to take any additional action to start migration of queued activity.<br><br> |

## Max number of databases selected for migration

The following error occurs when creating an activity for a database migration project for moving to Azure SQL Database or an Azure SQL Database managed instance:

* **Error**: Migration settings validation error", "errorDetail":"More than max number '4' objects of 'Databases' has been selected for migration."

| Cause         | Resolution |
| ------------- | ------------- |
| This error displays when you've selected more than four databases for a single migration activity. At present, each migration activity is limited to four databases. | Select four or fewer databases per migration activity. If you need to migrate more than four databases in parallel, provision another instance of Azure Database Migration Service. Currently, each subscription supports up to two Azure Database Migration Service instances.<br><br> |

## Errors for MySQL migration to Azure MySQL with recovery failures

When you migrate from MySQL to Azure Database for MySQL using Azure Database Migration Service, the migration activity fails with the following error:

* **Error**: Database migration error - Task 'TaskID' was suspended due to [n] successive recovery failures.

| Cause         | Resolution |
| ------------- | ------------- |
| This error may occur when the user doing the  migration is missing ReplicationAdmin role and/or privileges of REPLICATION CLIENT, REPLICATION REPLICA, and SUPER (versions earlier than MySQL 5.6.6).<br><br><br><br><br><br><br><br><br><br><br><br><br> | Make sure the [pre-requisite privileges](https://docs.microsoft.com/azure/dms/tutorial-mysql-azure-mysql-online#prerequisites) for the user account are configured accurately on the Azure Database for MySQL instance. For example, the following steps can be followed to create a user named 'migrateuser' with required privileges:<br>1. CREATE USER migrateuser@'%' IDENTIFIED BY 'secret'; <br>2. Grant all privileges on db_name.* to 'migrateuser'@'%' identified by 'secret'; // repeat this step to grant access on more databases <br>3. Grant replication slave on *.* to 'migrateuser'@'%' identified by 'secret';<br>4. Grant replication client on *.* to 'migrateuser'@'%' identified by 'secret';<br>5. Flush privileges; |

## Error when attempting to stop Azure Database Migration Service

You receive following error when stopping the Azure Database Migration Service instance:

* **Error**: Service failed to Stop. Error: {'error':{'code':'InvalidRequest','message':'One or more activities are currently running. To stop the service,  wait until the activities have completed or stop those activities manually and try again.'}}

| Cause         | Resolution |
| ------------- | ------------- |
| This error displays when the service instance you're attempting to stop includes activities that are still running or present in migration projects. <br><br><br><br><br><br> | Ensure that there are no activities running in the instance of Azure Database Migration Service you're trying to stop. You may also delete the activities or projects before attempting to stop the service. The following steps illustrate how to remove projects to clean up the migration service instance by deleting all running tasks:<br>1. Install-Module -Name AzureRM.DataMigration <br>2. Login-AzureRmAccount <br>3. Select-AzureRmSubscription -SubscriptionName "<subName>" <br> 4. Remove-AzureRmDataMigrationProject -Name <projectName> -ResourceGroupName <rgName> -ServiceName <serviceName> -DeleteRunningTask |

## Error when attempting to start Azure Database Migration Service

You receive following error when starting the Azure Database Migration Service instance:

* **Error**: Service fails to Start. Error: {'errorDetail':'The service failed to start, please contact Microsoft support'}

| Cause         | Resolution |
| ------------- | ------------- |
| This error displays when the previous instance failed internally. This error occurs rarely, and the engineering team is aware of it. <br> | Delete the instance of the service that you cannot start, and then provision new one to replace it. |

## Error restoring database while migrating SQL to Azure SQL DB managed instance

When you perform an online migration from SQL Server to an Azure SQL Database managed instance, the cutover fails with following error:

* **Error**: Restore Operation failed for operation Id 'operationId'. Code 'AuthorizationFailed', Message 'The client 'clientId' with object id 'objectId' does not have authorization to perform action 'Microsoft.Sql/locations/managedDatabaseRestoreAzureAsyncOperation/read' over scope '/subscriptions/subscriptionId'.'.

| Cause         | Resolution    |
| ------------- | ------------- |
| This error indicates the application principal being used for online migration from SQL Server to an Azure SQL Database managed instance doesn't have contribute permission on the subscription. Certain API calls with Managed Instance at present require this permission on subscription for the restore operation. <br><br><br><br><br><br><br><br><br><br><br><br><br><br> | Use the `Get-AzureADServicePrincipal` PowerShell cmdlet with `-ObjectId` available from the error message to list the display name of the application ID being used.<br><br> Validate the permissions to this application and ensure it has the [contributor role](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#contributor) at the subscription level. <br><br> The Azure Database Migration Service Engineering Team is working to restrict the required access from current contribute role on subscription. If you have a business requirement that doesn't allow use of contribute role, contact Azure support for additional help. |

## Error when deleting NIC associated with Azure Database Migration Service

When you try to delete a Network Interface Card associated with Azure Database Migration Service, the deletion attempt fails with this error:

* **Error**: Cannot delete the NIC associated to Azure Database Migration Service due to the DMS service utilizing the NIC

| Cause         | Resolution    |
| ------------- | ------------- |
| This issue happens when the Azure Database Migration Service instance may still be present and consuming the NIC. <br><br><br><br><br><br><br><br> | To delete this NIC, delete the DMS service instance that automatically deletes the NIC used by the service.<br><br> **Important**: Make sure the Azure Database Migration Service instance being deleted has no running activities.<br><br> After all the projects and activities associated to the Azure Database Migration Service instance are deleted, you can delete the service instance. The NIC used by the service instance is automatically cleaned as part of service deletion. |

## Connection error when using ExpressRoute

When you try to connect to source in the Azure Database Migration service project wizard, the connection fails after prolonged timeout if source is using ExpressRoute for connectivity.

| Cause         | Resolution    |
| ------------- | ------------- |
| When using [ExpressRoute](https://azure.microsoft.com/services/expressroute/), Azure Database Migration Service [requires](https://docs.microsoft.com/azure/dms/tutorial-sql-server-azure-sql-online) provisioning three service endpoints on the Virtual Network subnet associated with the service:<br> -- Service Bus endpoint<br> -- Storage endpoint<br> -- Target database endpoint (e.g. SQL endpoint, Cosmos DB endpoint)<br><br><br><br><br> | [Enable](https://docs.microsoft.com/azure/dms/tutorial-sql-server-azure-sql-online) the required service endpoints for ExpressRoute connectivity between source and Azure Database Migration Service. <br><br><br><br><br><br><br><br> |

## Timeout error when migrating a MySQL database to Azure MySQL

When you migrate a MySQL database to an Azure Database for MySQL instance via Azure Database Migration Service, the migration fails with following timeout error:

* **Error**: Database migration error - Failed to load file - Failed to start load process for file 'n' RetCode: SQL_ERROR SqlState: HY000 NativeError: 1205 Message: [MySQL][ODBC Driver][mysqld] Lock wait timeout exceeded; try restarting transaction

| Cause         | Resolution    |
| ------------- | ------------- |
| This error occurs when migration fails because of  the lock wait timeout during migration. | Consider increasing the value of server parameter **'innodb_lock_wait_timeout'**. The highest allowed value is 1073741824. |

## Error connecting to source SQL Server when using dynamic port or named instance

When you try to connect Azure Database Migration Service to SQL Server source that runs on either named instance or a dynamic port, the connection fails with this error:

* **Error**: -1 - SQL connection failed. A network-related or instance-specific error occurred while establishing a connection to SQL Server. The server was not found or was not accessible. Verify that the instance name is correct and that SQL Server is configured to allow remote connections. (provider: SQL Network Interfaces, error: 26 - Error Locating Server/Instance Specified)

| Cause         | Resolution    |
| ------------- | ------------- |
| This issue happens when the source SQL Server instance that Azure Database Migration Service tries to connect to either has a dynamic port or is using a named instance. The SQL Server Browser service listens to UDP port 1434 for incoming connections to a named instance or when using a dynamic port. The dynamic port may change each time SQL Server service restarts. You can check the dynamic port assigned to an instance via network configuration in SQL Server Configuration Manager.<br><br><br> |Verify that Azure Database Migration Service can connect to the source SQL Server Browser service on UDP port 1434 and the SQL Server instance through the dynamically assigned TCP port as applicable. |

## Additional known issues

* [Known issues/migration limitations with online migrations to Azure SQL Database](https://docs.microsoft.com/azure/dms/known-issues-azure-sql-online)
* [Known issues/migration limitations with online migrations to Azure Database for MySQL](https://docs.microsoft.com/azure/dms/known-issues-azure-mysql-online)
* [Known issues/migration limitations with online migrations to Azure Database for PostgreSQL](https://docs.microsoft.com/azure/dms/known-issues-azure-postgresql-online)

## Next steps

* View the article [Azure Database Migration Service PowerShell](https://docs.microsoft.com/powershell/module/azurerm.datamigration/?view=azurermps-6.13.0#data_migration).
* View the article [How to configure server parameters in Azure Database for MySQL by using the Azure portal](https://docs.microsoft.com/azure/mysql/howto-server-parameters).
* View the article [Overview of prerequisites for using Azure Database Migration Service](https://docs.microsoft.com/azure/dms/pre-reqs).
* See the [FAQ about using Azure Database Migration Service](https://docs.microsoft.com/azure/dms/faq).
