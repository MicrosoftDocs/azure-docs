---
title: Configure Azure SQL Edge
description: Learn about configuring Azure SQL Edge.
author: rwestMSFT
ms.author: randolphwest
ms.date: 09/14/2023
ms.service: sql-edge
ms.topic: conceptual
ms.custom: devx-track-linux
---
# Configure Azure SQL Edge

> [!IMPORTANT]  
> Azure SQL Edge no longer supports the ARM64 platform.

Azure SQL Edge supports configuration through one of the following two options:

- Environment variables
- An mssql.conf file placed in the /var/opt/mssql folder

> [!NOTE]  
> Setting environment variables overrides the settings specified in the mssql.conf file.

## Configure by using environment variables

Azure SQL Edge exposes several different environment variables that can be used to configure the SQL Edge container. These environment variables are a subset of the ones available for SQL Server on Linux. For more information on SQL Server on Linux environment variables, see [Environment variables](/sql/linux/sql-server-linux-configure-environment-variables/).

The following new environment variables were added to Azure SQL Edge.

| Environment variable | Description | Values |
| --- | --- | --- |
| **PlanId** | Specifies the Azure SQL Edge SKU to be used during initialization. This environment variable is only required when deploying Azure SQL Edge using Azure IoT Edge. | **asde-developer-on-iot-edge** or **asde-premium-on-iot-edge** |
| **MSSQL_TELEMETRY_ENABLED** | Enable or disable usage and diagnostics data collection. | TRUE or FALSE |
| **MSSQL_TELEMETRY_DIR** | Sets the target directory for the usage and diagnostics data collection audit files. | Folder location within SQL Edge container. This folder can be mapped to a host volume using either mount points or data volumes. |
| **MSSQL_PACKAGE** | Specifies the location of the dacpac or bacpac package to be deployed. | Folder, file, or SAS URL containing the dacpac or bacpac packages. For more information, see [Deploy SQL Database DACPAC and BACPAC packages in SQL Edge](deploy-dacpac.md). |

The following SQL Server on Linux environment variable isn't supported for Azure SQL Edge. If defined, this environment variable is ignored during container initialization.

| Environment variable | Description |
| --- | --- |
| **MSSQL_ENABLE_HADR** | Enable availability group. For example, `1` is enabled, and `0` is disabled. |

> [!IMPORTANT]  
> The **MSSQL_PID** environment variable for SQL Edge only accepts **Premium** and **Developer** as the valid values. Azure SQL Edge doesn't support initialization using a product key.

### Specify the environment variables

Specify environment variables for SQL Edge when you deploy the service through the [Azure portal](deploy-portal.md). You can add them either in the **Environment Variables** section of the module deployment or as part of the **Container Create Options**.

Add values in **Environment Variables**.

:::image type="content" source="media/configure/set-environment-variables.png" alt-text="Screenshot of set by using environment variables list.":::

Add values in **Container Create Options**.

:::image type="content" source="media/configure/set-environment-variables-using-create-options.png" alt-text="Screenshot of set by using container create options.":::

> [!NOTE]  
> In the disconnected deployment mode, environment variables can be specified using the `-e` or `--env` or the `--env-file` option of the `docker run` command.

## Configure by using an `mssql.conf` file

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
```

The following new mssql.conf options were added for Azure SQL Edge.

| Option | Description |
| :--- | :--- |
| **customerfeedback** | Choose if SQL Server sends feedback to Microsoft. For more information, see [Disable usage and diagnostic data collection](usage-and-diagnostics-data-configuration.md#disable-usage-and-diagnostic-data-collection) |
| **userrequestedlocalauditdirectory** | Sets the target directory for the usage and diagnostics data collection audit files. For more information, see [Local audit of usage and diagnostic data collection](usage-and-diagnostics-data-configuration.md#local-audit-of-usage-and-diagnostic-data-collection) |

The following mssql.conf options aren't applicable to SQL Edge:

| Option | Description |
| :--- | :--- |
| **Customer feedback** | Choose if SQL Server sends feedback to Microsoft. |
| **Database mail profile** | Set the default database mail profile for SQL Server on Linux. |
| **High availability** | Enable Availability Groups. |
| **Microsoft Distributed Transaction Coordinator** | Configure and troubleshoot MSDTC on Linux. Additional distributed transaction-related configuration options aren't supported for SQL Edge. For more information on these additional configuration options, see [Configure MSDTC](/sql/linux/sql-server-linux-configure-mssql-conf#msdtc). |
| **ML Services EULAs** | Accept R and Python EULAs for Azure Machine Learning packages. Applies to SQL Server 2019 only. |
| **outboundnetworkaccess** | Enable outbound network access for [Machine Learning Services](/sql/linux/sql-server-linux-setup-machine-learning/) R, Python, and Java extensions. |

The following sample mssql.conf file works for SQL Edge. For more information on the format for an `mssql.conf` file, see [mssql.conf format](/sql/linux/sql-server-linux-configure-mssql-conf#mssql-conf-format).

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

By default, the Azure SQL Edge containers run with a non-root user/group. When deployed through the Azure Marketplace (or using `docker run`), unless a different user/group is specified, SQL Edge containers starts up as the mssql (non-root) user. To specify a different non-root user during deployment, add the `*"User": "<name|uid>[:<group|gid>]"*` key-value pair under container create options. In the following example, SQL Edge is configured to start as the user `*IoTAdmin*`.

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

To allow the non-root user to access DB files that are on mounted volumes, ensure that the user/group you run the container under, has read & write permissions on the persistent file storage. In the following example, we set the non-root user with `user_id` of `10001` as the owner of the files.

```bash
chown -R 10001:0 <database file dir>
```

### Upgrade from earlier CTP releases

Earlier CTPs of Azure SQL Edge were configured to run as the root users. The following options are available when upgrading from earlier CTPs.

- Continue to use the root user - To continue using the root user, add the `*"User": "0:0"*` key-value pair under container create options.
- Use the default mssql user - To use the default mssql user, follow these steps:
  - Add a user named `mssql` on the Docker host. In the example below, we add a user mssql with ID 10001. This user is also added to the root group.

    ```bash
    sudo useradd -M -s /bin/bash -u 10001 -g 0 mssql
    ```

  - Change the permission on the directory/mount volume where the database file resides

    ```bash
    sudo chgrp -R 0 /var/lib/docker/volumes/kafka_sqldata/
    sudo chmod -R g=u /var/lib/docker/volumes/kafka_sqldata/
    ```

- Use a different non-root user account - To use a different non-root user account
  - Update the container create options to specify add `*"User": "user_name | user_id*` key-value pair under container create options. Replace user_name or user_id with an actual user_name or user_id from your Docker host.
  - Change the permissions on the directory/mount volume.

## Persist your data

Your Azure SQL Edge configuration changes and database files are persisted in the container even if you restart the container with `docker stop` and `docker start`. However, if you remove the container with `docker rm`, everything in the container is deleted, including Azure SQL Edge and your databases. The following section explains how to use **data volumes** to persist your database files even if the associated containers are deleted.

> [!IMPORTANT]  
> For Azure SQL Edge, it's critical that you understand data persistence in Docker. In addition to the discussion in this section, see Docker's documentation on [how to manage data in Docker containers](https://docs.docker.com/engine/tutorials/dockervolumes/).

### Mount a host directory as data volume

The first option is to mount a directory on your host as a data volume in your container. To do that, use the `docker run` command with the `-v <host directory>:/var/opt/mssql` flag. This allows the data to be restored between container executions.

```bash
docker run -e 'ACCEPT_EULA=Y' -e 'MSSQL_SA_PASSWORD=<YourStrong!Passw0rd>' -p 1433:1433 -v <host directory>/data:/var/opt/mssql/data -v <host directory>/log:/var/opt/mssql/log -v <host directory>/secrets:/var/opt/mssql/secrets -d mcr.microsoft.com/azure-sql-edge
```

```PowerShell
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=<YourStrong!Passw0rd>" -p 1433:1433 -v <host directory>/data:/var/opt/mssql/data -v <host directory>/log:/var/opt/mssql/log -v <host directory>/secrets:/var/opt/mssql/secrets -d mcr.microsoft.com/azure-sql-edge
```

This technique also enables you to share and view the files on the host outside of Docker.

> [!IMPORTANT]  
> Host volume mapping for **Docker on Windows** doesn't currently support mapping the complete `/var/opt/mssql` directory. However, you can map a subdirectory, such as `/var/opt/mssql/data` to your host machine.

> [!IMPORTANT]  
> Host volume mapping for **Docker on macOS** with the Azure SQL Edge image isn't supported at this time. Use data volume containers instead. This restriction is specific to the `/var/opt/mssql` directory. Reading from a mounted directory works fine. For example, you can mount a host directory using `-v` on macOS and restore a backup from a `.bak` file that resides on the host.

### Use data volume containers

The second option is to use a data volume container. You can create a data volume container by specifying a volume name instead of a host directory with the `-v` parameter. The following example creates a shared data volume named **sqlvolume**.

```bash
docker run -e 'ACCEPT_EULA=Y' -e 'MSSQL_SA_PASSWORD=<YourStrong!Passw0rd>' -p 1433:1433 -v sqlvolume:/var/opt/mssql -d mcr.microsoft.com/azure-sql-edge
```

```PowerShell
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=<YourStrong!Passw0rd>" -p 1433:1433 -v sqlvolume:/var/opt/mssql -d mcr.microsoft.com/azure-sql-edge
```

> [!NOTE]  
> This technique for implicitly creating a data volume in the run command doesn't work with older versions of Docker. In that case, use the explicit steps outlined in the Docker documentation, [Creating and mounting a data volume container](https://docs.docker.com/engine/tutorials/dockervolumes/#creating-and-mounting-a-data-volume-container).

Even if you stop and remove this container, the data volume persists. You can view it with the `docker volume ls` command.

```bash
docker volume ls
```

If you then create another container with the same volume name, the new container uses the same Azure SQL Edge data contained in the volume.

To remove a data volume container, use the `docker volume rm` command.

> [!WARNING]  
> If you delete the data volume container, any Azure SQL Edge data in the container is *permanently* deleted.

## Next steps

- [Connect to Azure SQL Edge](connect.md)
- [Build an end-to-end IoT solution with SQL Edge](tutorial-deploy-azure-resources.md)
