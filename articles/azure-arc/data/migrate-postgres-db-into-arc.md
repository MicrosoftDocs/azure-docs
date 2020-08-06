---
title: Migrate a Postgres database into Arc
description: Migrate a Postgres database into Arc
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: how-to
---

# Scenario: Migrate a Postgres database into Arc

This document describes the steps to get your existing Postgres databases into your Arc setup.

## Considerations for Azure Database for Postgres single node enabled by Azure Arc

Azure Database for Postgres single node enabled by Azure Arc is the community version of Postgres. Microsoft provides the manageability experience around it but the engine is unchanged.
From that standpoint, it means that anything that works on Postgres outside of Arc should work on Postgres inside Arc.

As such, if you are using a community compatible version of Postgres then you should be able to:
1. Backup your Postgres database from your instance hosted outside of Arc
2. Restore it in your Postgres instance inside of Arc

What will be left for you to do is:
- reset the server parameters to the values you need for your application to work as it is working outside of Arc
- reset the security contexts: recreate users, roles and reset permissions

To do this backup/restore operation, you can use any tool that is capable of doing backup/restore for Postgres. For example:
- pg_dump
- pg_restore
- pgAdmin
- Azure Data Studio
- ...

### Example
Let's illustrate those steps using the pgAdmin standard tool.
Consider the following setup:
- **Source:**  
    A Postgres server running on a bare metal server and named JEANYDSRV. It is of version 12 and hosts a database named MyOnPremPostgresDB that has one table T1 which has 1 row
    ![Screenshot of source system on pgAdmin.](/assets/Migrate_PG_SingleNode_Source.jpg)
- **Destination:**  
    A Postgres server running in an Azure Arc environment and named postgres01. It is of version 12. It does not have any database except the standard Postgres database.  
    ![Screenshot of destination system on pgAdmin.](/assets/Migrate_PG_SingleNode_Destination.jpg)



#### Step 1: take a backup of the source database on prem
![Screenshot of source backup action.](/assets/Migrate_PG_SingleNode_Source_Backup.jpg)

Configure it:
- give it a file name: **MySourceBackup**
- let the format set to **Custom**
![Screenshot of source backup action.](/assets/Migrate_PG_SingleNode_Source_Backup2.jpg)

The backup completes successfully:  
![Screenshot of source backup action.](/assets/Migrate_PG_SingleNode_Source_Backup3.jpg)



#### Step 2: create an empty database on the destination system in your Arc setup

>**Note:** to register a Postgres instance in the pgAdmin tool, you need to you use public IP of your instance in your Kubernetes cluster and set the port and security context appropriately. You will find these details on the psql endpoint line after running the following command:
```terminal
azdata postgres server endpoint -n postgres01
Command group 'postgres server' is in preview. It may be changed/removed in a future release.
Description           Endpoint
--------------------  ----------------------------------------------------------------------------------------------------------------
Log Search Dashboard  https://10.0.0.4:30777/kibana/app/kibana#/discover?_a=(query:(language:kuery,query:'cluster_name:"postgres01"'))
Metrics Dashboard     https://10.0.0.4:30777/grafana/d/postgres-metrics?var-Namespace=default&var-Name=postgres01
PostgreSQL Instance   postgresql://postgres:9ampMLNBmYz4ZHOT308,40@10.0.0.4:32639
```

Let's name the destination database **RESTORED_MyOnPremPostgresDB**  
![Screenshot of detination DB create.](/assets/Migrate_PG_SingleNode_Destination_DBCreate.jpg)



#### Step 3: Restore the database in your Arc setup
![Screenshot of detination DB restore.](/assets/Migrate_PG_SingleNode_Destination_DBRestore.jpg)

Configure the restore:
- point to the file that contains the backup to restore: **MySourceBackup**
- keep the format set  to **Custom or tar**
![Screenshot of detination DB restore configure.](/assets/Migrate_PG_SingleNode_Destination_DBRestore2.jpg)

Click the **[Restore]** button.  
The restore is successful.  
![Screenshot of detination DB restore succesful.](/assets/Migrate_PG_SingleNode_Destination_DBRestore3.jpg)



#### Step 4: verify that the database was successfully restored in your Arc setup and the data is available

You could use two ways to do this:

**From pgAdmin:**  
Expand the Postgres instance hosted in your Arc setup. You will see the table in the database that we have just restored and when you select the data it shows the same row as that it has in the on prem instance:
![Screenshot of detination DB restore verification.](/assets/Migrate_PG_SingleNode_Destination_DBRestoreVerif.jpg)


**From psql inside your Arc setup:**  
Within your Arc setup you can use psql to connect to you Postgres instance, set the database context to RESTORED_MyOnPremPostgresDB and query the data:

List the end points to help form your psql connection string:
```terminal
azdata postgres server endpoint -n postgres01
Command group 'postgres server' is in preview. It may be changed/removed in a future release.
Description           Endpoint
--------------------  ----------------------------------------------------------------------------------------------------------------
Log Search Dashboard  https://10.0.0.4:30777/kibana/app/kibana#/discover?_a=(query:(language:kuery,query:'cluster_name:"postgres01"'))
Metrics Dashboard     https://10.0.0.4:30777/grafana/d/postgres-metrics?var-Namespace=default&var-Name=postgres01
PostgreSQL Instance   postgresql://postgres:9ampMLNBmYz4ZHOT308,40@10.0.0.4:32639
```

Form your psql connection string use the -d parameter to indicate the database name. With the below command you will be prompted for the password:
```terminal
psql -d RESTORED_MyOnPremPostgresDB -U postgres -h 10.0.0.4 -p 32639
```
And you are connected:
```terminal
Password for user postgres:
psql (10.12 (Ubuntu 10.12-0ubuntu0.18.04.1), server 12.3 (Debian 12.3-1.pgdg100+1))
WARNING: psql major version 10, server major version 12.
         Some psql features might not work.
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
Type "help" for help.

RESTORED_MyOnPremPostgresDB=#   
```

Select the table and you'll see the data coming from the on prem Postgres instance:
```terminal
RESTORED_MyOnPremPostgresDB=# select * from t1;
 col1 |    col2
------+-------------
    1 | BobbyIsADog
(1 row)
```

## Notes
It is not possible today to "onboard into Azure Arc" an existing Postgres setup that would running on prem or in any other cloud. In other words it is not possible to install some sort of "Azure Arc agent" on your existing Postgres setup to make it a Postgres setup enabled by Azure Arc. Instead, you need to deploy a new Postgres instance and transfer data into it. You may use the technique shown above to do this or you may use any ETL tool of your choice.