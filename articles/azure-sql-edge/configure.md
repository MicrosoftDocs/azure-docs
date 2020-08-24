---
title: Configure Azure SQL Edge (Preview)
description: Learn about configuring Azure SQL Edge (preview).
keywords: 
services: sql-edge
ms.service: sql-edge
ms.topic: conceptual
author: SQLSourabh
ms.author: sourabha
ms.reviewer: sstein
ms.date: 07/28/2020
---

# Configure Azure SQL Edge (Preview)

Azure SQL Edge supports configuration through one of the following two options:

- Environment variables
- An mssql.conf file placed in the /var/opt/mssql folder

> [!NOTE]
> Setting environment variables overrides the settings specified in the mssql.conf file.

## Configure by using environment variables

Azure SQL Edge exposes several different environment variables that can be used to configure the SQL Edge container. These environment variables are a subset of the ones available for SQL Server on Linux. For more information on SQL Server on Linux environment variables, see [Environment variables](/sql/linux/sql-server-linux-configure-environment-variables/).

The following SQL Server on Linux environment variable isn't supported for Azure SQL Edge. If defined, this environment variable will be ignored during container initialization.

| Environment variable | Description |
|-----|-----|
| **MSSQL_ENABLE_HADR** | Enable availability group. For example, **1** is enabled, and **0** is disabled. |

> [!IMPORTANT]
> The **MSSQL_PID** environment variable for SQL Edge only accepts **Premium** and **Developer** as the valid values. Azure SQL Edge doesn't support initialization using a product key.

> [!NOTE]
> Download the [Microsoft Software License Terms](https://go.microsoft.com/fwlink/?linkid=2128283) for Azure SQL Edge.

### Specify the environment variables

Specify environment variables for SQL Edge when you deploy the service through the [Azure portal](deploy-portal.md). You can add them either in the **Environment Variables** section of the module deployment or as part of the **Container Create Options**.

Add values in **Environment Variables**.

![Set by using environment variables list](media/configure/set-environment-variables.png)

Add values in **Container Create Options**.

![Set by using container create options](media/configure/set-environment-variables-using-create-options.png)

## Configure by using an mssql.conf file

Azure SQL Edge doesn't include the [mssql-conf configuration utility](/sql/linux/sql-server-linux-configure-mssql-conf/) like SQL Server on Linux does. You need to manually configure the mssql.conf file and place it in the persistent storage drive that is mapped to the /var/opt/mssql/ folder in the SQL Edge module. When you're deploying SQL Edge from Azure Marketplace, this mapping is specified as the **Mounts** option in the **Container Create Options**.

```json
    {
        "Mounts": [
          {
            "Type": "volume",
            "Source": "sqlvolume",
            "Target": "/var/opt/mssql"
          }
        ]
      }
    }
```

The following mssql.conf options aren't applicable to SQL Edge:

|Option|Description|
|:---|:---|
|**Customer feedback** | Choose if SQL Server sends feedback to Microsoft. |
|**Database mail profile** | Set the default database mail profile for SQL Server on Linux. |
|**High availability** | Enable Availability Groups. |
|**Microsoft Distributed Transaction Coordinator** | Configure and troubleshoot MSDTC on Linux. Additional distributed transaction-related configuration options aren't supported for SQL Edge. For more information on these additional configuration options, see [Configure MSDTC](https://docs.microsoft.com/sql/linux/sql-server-linux-configure-mssql-conf#msdtc). |
|**ML Services EULAs** | Accept R and Python EULAs for Azure Machine Learning packages. Applies to SQL Server 2019 only.|
|**outboundnetworkaccess** |Enable outbound network access for [Machine Learning Services](/sql/linux/sql-server-linux-setup-machine-learning/) R, Python, and Java extensions.|

The following sample mssql.conf file works for SQL Edge. For more information on the format for an mssql.conf file, see [mssql.conf format](https://docs.microsoft.com/sql/linux/sql-server-linux-configure-mssql-conf#mssql-conf-format).

```ini
[EULA]
accepteula = Y

[coredump]
captureminiandfull = true
coredumptype = full

[filelocation]
defaultbackupdir = /var/opt/mssql/backup/
defaultdatadir = /var/opt/mssql/data/
defaultdumpdir = /var/opt/mssql/data/
defaultlogdir = /var/opt/mssql/log/

[language]
lcid = 1033

[memory]
memorylimitmb = 6144

[sqlagent]
errorlogfile = /var/opt/mssql/log/sqlagentlog.log
errorlogginglevel = 7

[traceflag]
traceflag0 = 3604
traceflag1 = 3605
traceflag2 = 1204
```

## Run Azure SQL Edge as non-root user

Starting with Azure SQL Edge CTP2.2, SQL Edge containers can run with a non-root user/group. When deployed through the Azure Marketplace, unless a different user/group is specified, SQL Edge containers starts up as the mssql (non-root) user. To specify a different non-root user during deployment, add the `*"User": "<name|uid>[:<group|gid>]"*` key-value pair under container create options. In the example below SQL Edge is configured to start as the user `*IoTAdmin*`.

```json
{
    ..
    ..
    ..
    "User": "IoTAdmin",
    "Env": [
        "MSSQL_AGENT_ENABLED=TRUE",
        "ClientTransportType=AMQP_TCP_Only",
        "MSSQL_PID=Premium"
    ]
}
```

To allow the non-root user to access DB files that are on mounted volumes, ensure that the user/group you run the container under, has read & write permissions on the persistent file storage. In the example below we set the non-root user with user_id 10001 as the owner of the files. 

```bash
chown -R 10001:0 <database file dir>
```

### Upgrading from earlier CTP releases

Earlier CTP's of Azure SQL Edge were configured to run as the root users. The following options are available when upgrading from earlier CTP's

- Continue to use the root user - To continue using the root user, add the `*"User": "0:0"*` key-value pair under container create options.
- Use the default mssql user - To use the default mssql user, follow the steps below
  - Add a user named mssql on the docker host. In the example below, we add a user mssql with ID 10001. This user is also added to the root group.
    ```bash
    sudo useradd -M -s /bin/bash -u 10001 -g 0 mssql
    ```
  - Change the permission on the directory/mount volume where the database file reside 
    ```bash
    sudo chgrp -R 0 /var/lib/docker/volumes/kafka_sqldata/
    sudo chmod -R g=u /var/lib/docker/volumes/kafka_sqldata/
    ```
- Use a different non-root user account - To use a different non-root user account
  - Update the container create options to specify add `*"User": "user_name | user_id*` key-value pair under container create options. Please replace user_name or user_id with an actual user_name or user_id from your docker host. 
  - Change the permissions on the directory/mount volume.



## Next steps

- [Connect to Azure SQL Edge](connect.md)
- [Build an end-to-end IoT solution with SQL Edge](tutorial-deploy-azure-resources.md)
