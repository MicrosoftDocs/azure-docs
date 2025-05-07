---
title: Deploy Azure SQL Edge using the Azure portal
description: Learn how to deploy Azure SQL Edge using the Azure portal
author: rwestMSFT
ms.author: randolphwest
ms.reviewer: kendalv
ms.date: 09/21/2024
ms.service: azure-sql-edge
ms.topic: conceptual
keywords: deploy SQL Edge
---
# Deploy Azure SQL Edge

[!INCLUDE [retirement-notice](includes/retirement-notice.md)]

> [!NOTE]  
> Azure SQL Edge no longer supports the ARM64 platform.

Azure SQL Edge is a relational database engine optimized for IoT and Azure IoT Edge deployments. It provides capabilities to create a high-performance data storage and processing layer for IoT applications and solutions. This quickstart shows you how to get started with creating an Azure SQL Edge module through Azure IoT Edge using the Azure portal.

## Before you begin

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/).
- Sign in to the [Azure portal](https://portal.azure.com/).
- Create an [Azure IoT Hub](../iot-hub/iot-hub-create-through-portal.md).
- Create an [Azure IoT Edge device](../iot-edge/how-to-provision-single-device-linux-symmetric.md).

> [!NOTE]  
> To deploy an Azure Linux VM as an IoT Edge device, see this [quickstart guide](../iot-edge/quickstart-linux.md).

## Deploy Azure SQL Edge Module using IoT Hub

Azure SQL Edge can be deployed using instructions from [Deploy modules from Azure portal](/azure/iot-edge/how-to-deploy-modules-portal). The image URI for Azure SQL Edge is `mcr.microsoft.com/azure-sql-edge:latest`.

1. On the **Add IoT Edge Module** page, specify the desired values for the *IoT Edge Module Name*, *Image URI*, *Restart Policy* and *Desired Status*.

   Use the following image URI depending on the edition you want to deploy:
   - *Developer edition* - `mcr.microsoft.com/azure-sql-edge/developer`
   - *Premium edition* - `mcr.microsoft.com/azure-sql-edge/premium`

1. On the *Environment Variables* section of the **Add IoT Edge Module** page, specify the desired values for the environment variables. For a complete list of Azure SQL Edge environment variables, see [Configure using environment variables](configure.md#configure-by-using-environment-variables).

   | Parameter | Description |
   | --- | --- |
   | ACCEPT_EULA | Set this value to `Y` to accept the [End-User Licensing Agreement](https://go.microsoft.com/fwlink/?linkid=2139274) |
   | MSSQL_SA_PASSWORD | Set the value to specify a strong password for the SQL Edge admin account. |
   | MSSQL_LCID | Set the value to set the desired language ID to use for SQL Edge. For example, 1036 is French. |
   | MSSQL_COLLATION | Set the value to set the default collation for SQL Edge. This setting overrides the default mapping of language ID (LCID) to collation. |

1. On the *Container Create Options* section of the **Add IoT Edge Module** page, set the options as per requirement.

   - **Host Port**

     Map the specified host port to port 1433 (default SQL port) in the container.

   - **Binds** and **Mounts**

     If you need to deploy more than one SQL Edge module, ensure that you update the mounts option to create a new source and target pair for the persistent volume. For more information on mounts and volume, see [Use volumes](https://docs.docker.com/storage/volumes/) on Docker documentation.

   ```json
   {
       "HostConfig": {
           "CapAdd": [
               "SYS_PTRACE"
           ],
           "Binds": [
               "sqlvolume:/sqlvolume"
           ],
           "PortBindings": {
               "1433/tcp": [
                   {
                       "HostPort": "1433"
                   }
               ]
           },
           "Mounts": [
               {
                   "Type": "volume",
                   "Source": "sqlvolume",
                   "Target": "/var/opt/mssql"
               }
           ]
       },
       "Env": [
           "MSSQL_AGENT_ENABLED=TRUE",
           "ClientTransportType=AMQP_TCP_Only",
           "PlanId=asde-developer-on-iot-edge"
       ]
   }
   ```

   > [!IMPORTANT]  
   > Set the `PlanId` environment variable based on the edition installed.
   > - *Developer edition* - `asde-developer-on-iot-edge`
   > - *Premium edition* - `asde-premium-on-iot-edge`
   >
   > If this value is set incorrectly, the Azure SQL Edge container fails to start.

   > [!WARNING]  
   > If you reinstall the module, remember to remove any existing bindings first, otherwise your environment variables will not be updated.

1. On the **Add IoT Edge Module** page, select **Add**.
1. On the **Set modules on device** page, select **Next: Routes >** if you need to define routes for your deployment. Otherwise select **Review + Create**. For more information on configuring routes, see [Deploy modules and establish routes in IoT Edge](../iot-edge/module-composition.md).
1. On the **Set modules on device** page, select **Create**.

## Connect to Azure SQL Edge

The following steps use the Azure SQL Edge command-line tool, **sqlcmd**, inside the container to connect to Azure SQL Edge.

> [!NOTE]  
> SQL Server command line tools, including **sqlcmd**, aren't available inside the ARM64 version of Azure SQL Edge containers.

1. Use the `docker exec -it` command to start an interactive bash shell inside your running container. In the following example, `AzureSQLEdge` is name specified by the `Name` parameter of your IoT Edge Module.

   ```bash
   sudo docker exec -it AzureSQLEdge "bash"
   ```

1. Once inside the container, connect locally with the **sqlcmd** tool. **sqlcmd** isn't in the path by default, so you have to specify the full path.

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

Next, create a new table called `Inventory`, and insert two new rows.

1. From the **sqlcmd** command prompt, switch context to the new `TestDB` database:

   ```sql
   USE TestDB;
   ```

1. Create new table named `Inventory`:

   ```sql
   CREATE TABLE Inventory (id INT, name NVARCHAR(50), quantity INT)
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

You can connect and run SQL queries against your Azure SQL Edge instance from any external Linux, Windows, or macOS tool that supports SQL connections. For more information on connecting to a SQL Edge container from outside, see [Connect and Query Azure SQL Edge](connect.md).

In this quickstart, you deployed a SQL Edge Module on an IoT Edge device.

## Related content

- [Machine Learning and Artificial Intelligence with ONNX in SQL Edge](onnx-overview.md)
- [Building an end to end IoT Solution with SQL Edge using IoT Edge](tutorial-deploy-azure-resources.md)
- [Data Streaming in Azure SQL Edge](stream-data.md)
- [Troubleshoot deployment errors](troubleshoot.md)
