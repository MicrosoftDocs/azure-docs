---
title: Connect and query Azure SQL Edge
description: Learn how to connect to and query Azure SQL Edge.
author: rwestMSFT
ms.author: randolphwest
ms.date: 09/14/2023
ms.service: sql-edge
ms.topic: conceptual
---
# Connect and query Azure SQL Edge

> [!IMPORTANT]  
> Azure SQL Edge no longer supports the ARM64 platform.

In Azure SQL Edge, after you deploy a container, you can connect to the Database Engine from any of the following locations:

- Inside the container
- From another Docker container running on the same host
- From the host machine
- From any other client machine on the network

## Tools to connect to Azure SQL Edge

You can connect to an instance of Azure SQL Edge instance from any of these common tools:

- [sqlcmd](/sql/linux/sql-server-linux-setup-tools): **sqlcmd** client tools are already included in the container image of Azure SQL Edge. If you attach to a running container with an interactive bash shell, you can run the tools locally. SQL client tools *aren't* available on the ARM64 platform.
- [SQL Server Management Studio](/sql/ssms/sql-server-management-studio-ssms)
- [Azure Data Studio](/azure-data-studio/download-azure-data-studio)
- [Visual Studio Code](/sql/visual-studio-code/sql-server-develop-use-vscode)

To connect to an Azure SQL Edge Database Engine from a network machine, you need the following:

- **IP Address or network name of the host machine**: This is the host machine where the Azure SQL Edge container is running.

- **Azure SQL Edge container host port mapping**: This is the mapping for the Docker container port to a port on the host. Within the container, Azure SQL Edge is always mapped to port 1433. You can change this if you want to. To change the port number, update the **Container Create Options** for the Azure SQL Edge module in Azure IoT Edge. In the following example, port 1433 on the container is mapped to port 1600 on the host.

    ```JSON
    {
        "PortBindings": {
          "1433/tcp": [
            {
              "HostPort": "1600"
            }
          ]
        }
    }
    ```

- **SA password for the Azure SQL Edge instance**: This is the value specified for the `SA_PASSWORD` environment variable during deployment of Azure SQL Edge.

## Connect to the Database Engine from within the container

The [SQL Server command-line tools](/sql/linux/sql-server-linux-setup-tools) are included in the container image of Azure SQL Edge. If you attach to the container with an interactive command prompt, you can run the tools locally. SQL client tools aren't available on the ARM64 platform.

1. Use the `docker exec -it` command to start an interactive bash shell inside your running container. In the following example, `e69e056c702d` is the container ID.

   ```bash
   docker exec -it e69e056c702d /bin/bash
   ```

   > [!TIP]  
   > You don't always have to specify the entire container ID. You only have to specify enough characters to uniquely identify it. So in this example, it might be enough to use `e6` or `e69`, rather than the full ID.

1. When you're inside the container, connect locally with **sqlcmd**. **sqlcmd** isn't in the path by default, so you have to specify the full path.

   ```bash
   /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P '<YourPassword>'
   ```

1. When you're finished with **sqlcmd**, type `exit`.

1. When you're finished with the interactive command prompt, type `exit`. Your container continues to run after you exit the interactive bash shell.

## Connect to Azure SQL Edge from another container on the same host

Because two containers that are running on the same host are on the same Docker network, you can easily access them by using the container name and the port address for the service. For example, if you're connecting to the instance of Azure SQL Edge from another Python module (container) on the same host, you can use a connection string similar to the following. (This example assumes that Azure SQL Edge is configured to listen on the default port.)

```python
import pyodbc
server = 'MySQLEdgeContainer' # Replace this with the actual name of your SQL Edge Docker container
username = 'sa' # SQL Server username
password = 'MyStrongestP@ssword' # Replace this with the actual SA password from your deployment
database = 'MyEdgeDatabase' # Replace this with the actual database name from your deployment. If you do not have a database created, you can use Master database.
db_connection_string = "Driver={ODBC Driver 17 for SQL Server};Server=" + server + ";Database=" + database + ";UID=" + username + ";PWD=" + password + ";"
conn = pyodbc.connect(db_connection_string, autocommit=True)
```

## Connect to Azure SQL Edge from another network machine

You might want to connect to the instance of Azure SQL Edge from another machine on the network. To do so, use the IP address of the Docker host and the host port to which the Azure SQL Edge container is mapped. For example, if the IP address of the Docker host is `192.168.2.121`, and the Azure SQL Edge container is mapped to host port *1600*, then the server address for the instance of Azure SQL Edge would be `192.168.2.121,1600`. The updated Python script is:

```python
import pyodbc
server = '192.168.2.121,1600' # Replace this with the actual name or IP address of your SQL Edge Docker container
username = 'sa' # SQL Server username
password = 'MyStrongestP@ssword' # Replace this with the actual SA password from your deployment
database = 'MyEdgeDatabase' # Replace this with the actual database name from your deployment. If you do not have a database created, you can use Master database.
db_connection_string = "Driver={ODBC Driver 17 for SQL Server};Server=" + server + ";Database=" + database + ";UID=" + username + ";PWD=" + password + ";"
conn = pyodbc.connect(db_connection_string, autocommit=True)
```

To connect to an instance of Azure SQL Edge by using SQL Server Management Studio running on a Windows machine, see [SQL Server Management Studio](/sql/linux/sql-server-linux-manage-ssms).

To connect to an instance of Azure SQL Edge by using Visual Studio Code on a Windows, macOS or Linux machine, see [Visual Studio Code](/sql/visual-studio-code/sql-server-develop-use-vscode).

To connect to an instance of Azure SQL Edge by using Azure Data Studio on a Windows, macOS or Linux machine, see [Azure Data Studio](/azure-data-studio/quickstart-sql-server).

## Next steps

- [Connect and query](/sql/linux/sql-server-linux-configure-docker#connect-and-query)
- [Install SQL Server tools on Linux](/sql/linux/sql-server-linux-setup-tools)
