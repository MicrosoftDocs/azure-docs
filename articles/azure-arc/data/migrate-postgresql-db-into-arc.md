---
title: Migrate a PostgreSQL database into Arc
description: Migrate a PostgreSQL database into Arc
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: TheJY
ms.author: jeanyd
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: how-to
---

# Migrate a PostgreSQL database into Arc

This document describes the steps to get your existing PostgreSQL databases into your Arc setup.

## Considerations for Azure Database for PostgreSQL single node enabled by Azure Arc

Azure Database for PostgreSQL single node enabled by Azure Arc is the community version of PostgreSQL. Azure Arc enabled data services provides the manageability experience around it but the engine is unchanged.
This means anything that works on PostgreSQL outside of Arc should work on PostgreSQL inside Arc.

As such, if you're using a community compatible version of PostgreSQL then you can:
1. Back up your PostgreSQL database from your instance hosted outside of Arc
2. Restore it in your PostgreSQL instance in Arc

The remaining steps are:
- reset the server parameters to the values you need for your application to work as it is working outside of Arc
- reset the security contexts: recreate users, roles, and reset permissions

To do this backup/restore operation, use any tool that can do a backup/restore for PostgreSQL. For example:
- `pg_dump`
- `pg_restore`
- `pgAdmin`
- Azure Data Studio
- ...

### Example

Let's illustrate those steps using the `pgAdmin` standard tool.
Consider the following setup:
- **Source:**  
    A PostgreSQL server running on a bare metal server and named JEANYDSRV. It is of version 12 and hosts a database named MyOnPremPostgresDB that has one table T1, which has one row
    ![Screenshot of source system on `pgAdmin`.](/assets/Migrate_PG_SingleNode_Source.jpg)
- **Destination:**  
    A PostgreSQL server running in an Azure Arc environment and named postgres01. It is of version 12. It doesn't have any database except the standard PostgreSQL database.  
    ![Screenshot of destination system on `pgAdmin`.](/assets/Migrate_PG_SingleNode_Destination.jpg)



#### Take a backup of the source database on-premises
![Screenshot of source backup action.](/assets/Migrate_PG_SingleNode_Source_Backup.jpg)

Configure it:
- Give it a file name: *MySourceBackup*
- Set the format to *Custom*

The backup completes successfully:  

#### Create an empty database on the destination system in your Arc setup

> [!NOTE]
> To register a PostgreSQL instance in the `pgAdmin` tool, you need to you use public IP of your instance in your Kubernetes cluster and set the port and security context appropriately. You will find these details on the `psql` endpoint line after running the following command:

```console
azdata postgres server endpoint -n postgres01

Description           Endpoint
--------------------  ----------------------------------------------------------------------------------------------------------------
Log Search Dashboard  https://10.0.0.4:30777/kibana/app/kibana#/discover?_a=(query:(language:kuery,query:'cluster_name:"postgres01"'))
Metrics Dashboard     https://10.0.0.4:30777/grafana/d/postgres-metrics?var-Namespace=default&var-Name=postgres01
PostgreSQL Instance   postgresql://postgres:9xxxXXXxXx4XXXX308,40@10.0.0.4:32639
```

Name the destination database **RESTORED_MyOnPremPostgresDB**  

#### Restore the database in your Arc setup

Configure the restore:
- point to the file that contains the backup to restore: *MySourceBackup*
- keep the format set  to *Custom or tar*

Select **Restore**.  

The restore is successful.  

#### Verify that the database was successfully restored in your Arc setup and the data is available

There are two methods available:

**From `pgAdmin`:**  
Expand the PostgreSQL instance hosted in your Arc setup. You'll see the table in the database that we restored. When you select the data, it shows the same row as that it has in the on-premises instance:
![Screenshot of detination DB restore verification.](/assets/Migrate_PG_SingleNode_Destination_DBRestoreVerif.jpg)


**From `psql` inside your Arc setup:**  
Within the Arc set-up use `psql` to connect to PostgreSQL instance, set the database context to RESTORED_MyOnPremPostgresDB and query the data:

List the end points to help create  your `psql` connection string:
```console
azdata postgres server endpoint -n postgres01

Description           Endpoint
--------------------  ----------------------------------------------------------------------------------------------------------------
Log Search Dashboard  https://10.0.0.4:30777/kibana/app/kibana#/discover?_a=(query:(language:kuery,query:'cluster_name:"postgres01"'))
Metrics Dashboard     https://10.0.0.4:30777/grafana/d/postgres-metrics?var-Namespace=default&var-Name=postgres01
PostgreSQL Instance   postgresql://postgres:9ampMLNBmYz4ZHOT308,40@10.0.0.4:32639
```

Form your `psql` connection string use the -d parameter to indicate the database name. With the below command you'll be prompted for the password:
```console
psql -d RESTORED_MyOnPremPostgresDB -U postgres -h 10.0.0.4 -p 32639
```
And you're connected:
```console
Password for user postgres:
psql (10.12 (Ubuntu 10.12-0ubuntu0.18.04.1), server 12.3 (Debian 12.3-1.pgdg100+1))
WARNING: psql major version 10, server major version 12.
         Some psql features might not work.
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
Type "help" for help.

RESTORED_MyOnPremPostgresDB=#   
```

Select the table and you'll see the data coming from the on-premises PostgreSQL instance:
```console
RESTORED_MyOnPremPostgresDB=# select * from t1;
 col1 |    col2
------+-------------
    1 | BobbyIsADog
(1 row)
```
