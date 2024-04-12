---
title: Deploy Azure SQL Edge with Docker - Azure SQL Edge
description: Learn about deploying Azure SQL Edge with Docker
author: rwestMSFT
ms.author: randolphwest
ms.date: 09/14/2023
ms.service: sql-edge
ms.topic: quickstart
ms.custom: mode-other
keywords:
  - SQL Edge
  - container
  - Docker
---
# Deploy Azure SQL Edge with Docker

> [!IMPORTANT]  
> Azure SQL Edge no longer supports the ARM64 platform.

In this quickstart, you use Docker to pull and run the Azure SQL Edge container image. Then connect with **sqlcmd** to create your first database and run queries.

This image consists of SQL Edge based on Ubuntu 18.04. It can be used with the Docker Engine 1.8+ on Linux.

Azure SQL Edge containers aren't supported on the following platforms for production workloads:

- Windows
- macOS
- Azure IoT Edge for Linux on Windows (EFLOW)

## Prerequisites

- Docker Engine 1.8+ on any supported Linux distribution. For more information, see [Install Docker](https://docs.docker.com/engine/installation/). Since the SQL Edge images are based on Ubuntu 18.04, we recommended that you use an Ubuntu 18.04 Docker host.
- Docker **overlay2** storage driver. This is the default for most users. If you find that you aren't using this storage provider and need to change, see the instructions and warnings in the [Docker documentation for configuring overlay2](https://docs.docker.com/storage/storagedriver/overlayfs-driver/#configure-docker-with-the-overlay-or-overlay2-storage-driver).
- Minimum of 10 GB of disk space.
- Minimum of 1 GB of RAM.
- [Hardware requirements for Azure SQL Edge](./features.md#hardware-support).

> [!NOTE]  
> For the bash commands in this article `sudo` is used. If you don't want to use `sudo` to run Docker, you can configure a Docker group and add users to that group. For more information, see [Post-installation steps for Linux](https://docs.docker.com/engine/install/linux-postinstall/).

## Pull and run the container image

1. Pull the Azure SQL Edge container image from Microsoft Container Registry.

   ```bash
   sudo docker pull mcr.microsoft.com/azure-sql-edge:latest
   ```

   The previous command pulls the latest SQL Edge container image. To see all available images, see the [azure-sql-edge Docker hub page](https://hub.docker.com/_/microsoft-azure-sql-edge).

1. To run the container image with Docker, use the following command from a bash shell:

   - Start an Azure SQL Edge instance running as the Developer edition:

     ```bash
     sudo docker run --cap-add SYS_PTRACE -e 'ACCEPT_EULA=1' -e 'MSSQL_SA_PASSWORD=yourStrong(!)Password' -p 1433:1433 --name azuresqledge -d mcr.microsoft.com/azure-sql-edge
     ```

   - Start an Azure SQL Edge instance running as the Premium edition:

     ```bash
     sudo docker run --cap-add SYS_PTRACE -e 'ACCEPT_EULA=1' -e 'MSSQL_SA_PASSWORD=yourStrong(!)Password' -e 'MSSQL_PID=Premium' -p 1433:1433 --name azuresqledge -d mcr.microsoft.com/azure-sql-edge
     ```

   > [!IMPORTANT]  
   > The password should follow the Microsoft SQL Database Engine default password policy, otherwise the container can't set up the SQL Database Engine and will stop working. By default, the password must be at least 8 characters long and contain characters from three of the following four sets: uppercase letters, lowercase letters, base-10 digits, and symbols. You can examine the error log by executing the [docker logs](https://docs.docker.com/engine/reference/commandline/logs/) command.

   The following table provides a description of the parameters in the previous `docker run` examples:

   | Parameter | Description |
   | --- | --- |
   | **-e "ACCEPT_EULA=Y"** | Set the **ACCEPT_EULA** variable to any value to confirm your acceptance of the [End-User Licensing Agreement](https://go.microsoft.com/fwlink/?linkid=2139274). Required setting for the SQL Edge image. |
   | **-e "MSSQL_SA_PASSWORD=yourStrong(!)Password"** | Specify your own strong password that is at least eight characters and meets the [Azure SQL Edge password requirements](/sql/relational-databases/security/password-policy). Required setting for the SQL Edge image. |
   | **-p 1433:1433** | Map a TCP port on the host environment (first value) with a TCP port in the container (second value). In this example, SQL Edge is listening on TCP 1433 in the container and this is exposed to the port, 1433, on the host. |
   | **--name azuresqledge** | Specify a custom name for the container rather than a randomly generated one. If you run more than one container, you can't reuse this same name. |
   | **-d** | Run the container in the background (daemon) |

   For a complete list of all Azure SQL Edge environment variable, see [Configure Azure SQL Edge with Environment Variables](configure.md#configure-by-using-environment-variables).You can also use a [mssql.conf file](configure.md#configure-by-using-an-mssqlconf-file) to configure SQL Edge containers.

1. To view your Docker containers, use the `docker ps` command.

   ```bash
   sudo docker ps -a
   ```

1. If the **STATUS** column shows a status of **Up**, then SQL Edge is running in the container and listening on the port specified in the **PORTS** column. If the **STATUS** column for your SQL Edge container shows **Exited**, see the Troubleshooting section of Azure SQL Edge documentation.

   The `-h` (host name) parameter is also useful, but it isn't used in this tutorial for simplicity. This changes the internal name of the container to a custom value. This is the name that is returned in the following Transact-SQL query:

   ```sql
   SELECT @@SERVERNAME,
       SERVERPROPERTY('ComputerNamePhysicalNetBIOS'),
       SERVERPROPERTY('MachineName'),
       SERVERPROPERTY('ServerName');
   ```

   Setting `-h` and `--name` to the same value is a good way to easily identify the target container.

1. As a final step, change your SA password because the `MSSQL_SA_PASSWORD` is visible in `ps -eax` output and stored in the environment variable of the same name. See the following steps.

## Change the SA password

The **SA** account is a system administrator on the Azure SQL Edge instance that gets created during setup. After you create your SQL Edge container, the `MSSQL_SA_PASSWORD` environment variable you specified is discoverable by running `echo $MSSQL_SA_PASSWORD` in the container. For security purposes, change your SA password.

1. Choose a strong password to use for the SA user.

1. Use `docker exec` to run **sqlcmd** to change the password using Transact-SQL. In the following example, replace the old password, `<YourStrong!Passw0rd>`, and the new password, `<YourNewStrong!Passw0rd>`, with your own password values.

   ```bash
   sudo docker exec -it azuresqledge /opt/mssql-tools/bin/sqlcmd \
      -S localhost -U SA -P "<YourStrong@Passw0rd>" \
      -Q 'ALTER LOGIN SA WITH PASSWORD="<YourNewStrong@Passw0rd>"'
   ```

## Connect to Azure SQL Edge

The following steps use the Azure SQL Edge command-line tool, **sqlcmd**, inside the container to connect to SQL Edge.

1. Use the `docker exec -it` command to start an interactive bash shell inside your running container. In the following example, `azuresqledge` is the name specified by the `--name` parameter when you created the container.

   ```bash
   sudo docker exec -it azuresqledge "bash"
   ```

1. Once inside the container, connect locally with **sqlcmd**. **sqlcmd** isn't in the path by default, so you have to specify the full path.

   ```bash
   /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "<YourNewStrong@Passw0rd>"
   ```

   > [!TIP]  
   > You can omit the password on the command-line to be prompted to enter it.

1. If successful, you should get to a **sqlcmd** command prompt: `1>`.

## Create and query data

The following sections walk you through using **sqlcmd** and Transact-SQL to create a new database, add data, and run a query.

### Create a new database

The following steps create a new database named `TestDB`.

1. From the **sqlcmd** command prompt, paste the following Transact-SQL command to create a test database:

   ```sql
   CREATE DATABASE TestDB;
   GO
   ```

1. On the next line, write a query to return the name of all of the databases on your server:

   ```sql
   SELECT name from sys.databases;
   GO
   ```

### Insert data

Next create a new table, `Inventory`, and insert two new rows.

1. From the **sqlcmd** command prompt, switch context to the new `TestDB` database:

   ```sql
   USE TestDB;
   ```

1. Create new table named `Inventory`:

   ```sql
   CREATE TABLE Inventory (
       id INT,
       name NVARCHAR(50),
       quantity INT
   );
   ```

1. Insert data into the new table:

   ```sql
   INSERT INTO Inventory
   VALUES (1, 'banana', 150);

   INSERT INTO Inventory
   VALUES (2, 'orange', 154);
   ```

1. Type `GO` to execute the previous commands:

   ```sql
   GO
   ```

### Select data

Now, run a query to return data from the `Inventory` table.

1. From the **sqlcmd** command prompt, enter a query that returns rows from the `Inventory` table where the quantity is greater than 152:

   ```sql
   SELECT * FROM Inventory WHERE quantity > 152;
   ```

1. Execute the command:

   ```sql
   GO
   ```

### Exit the sqlcmd command prompt

1. To end your **sqlcmd** session, type `QUIT`:

   ```sql
   QUIT
   ```

1. To exit the interactive command-prompt in your container, type `exit`. Your container continues to run after you exit the interactive bash shell.

## Connect from outside the container

You can also connect to the SQL Edge instance on your Docker machine from any external Linux, Windows, or macOS tool that supports SQL connections. For more information on connecting to a SQL Edge container from outside, see [Connect and Query Azure SQL Edge](connect.md).

## Remove your container

If you want to remove the SQL Edge container used in this tutorial, run the following commands:

```bash
sudo docker stop azuresqledge
sudo docker rm azuresqledge
```

> [!WARNING]  
> Stopping and removing a container permanently deletes any SQL Edge data in the container. If you need to preserve your data, [create and copy a backup file out of the container](backup-restore.md) or use a [container data persistence technique](configure.md#persist-your-data).

## Next steps

- [Machine Learning and Artificial Intelligence with ONNX in SQL Edge](onnx-overview.md).
- [Building an end to end IoT Solution with SQL Edge using IoT Edge](tutorial-deploy-azure-resources.md).
- [Data Streaming in Azure SQL Edge](stream-data.md)
