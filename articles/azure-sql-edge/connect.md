---
title: Connect and query Azure SQL Edge (Preview)
description: Learn about connecting and querying Azure SQL Edge (Preview)
keywords: 
services: sql-edge
ms.service: sql-edge
ms.topic: conceptual
author: SQLSourabh
ms.author: sourabha
ms.reviewer: sstein
ms.date: 05/19/2020
---

# Connect and Query Azure SQL Edge (Preview)

After deploying Azure SQL Edge container, you can connect to the SQL database engine from any of the following locations.

- Inside the container
- From another docker container running on the same host.
- From the host machine
- From any other client machine on the network.

## Tools to connect to Azure SQL Edge

Connections to an Azure SQL Edge instance can be made from any of the common tools mentioned below.

* [sqlcmd](https://docs.microsoft.com/sql/linux/sql-server-linux-setup-tools) - sqlcmd client tools are already included in the Azure SQL Edge container image. If you attach to a running container with an interactive bash shell, you can run the tools locally.
* [SQL Server Management Studio](https://docs.microsoft.com/sql/ssms/sql-server-management-studio-ssms)
* [Azure Data Studio](https://docs.microsoft.com/sql/azure-data-studio/download-azure-data-studio)
* [Visual Studio Code](https://docs.microsoft.com/sql/visual-studio-code/sql-server-develop-use-vscode)

To connect to an Azure SQL Edge database engine from a network machine, you'll need the following

- *IP Address or network name of the host machine* - This is the host machine where Azure SQL Edge container is running.
- *Azure SQL Edge container host port mapping* - This is the port mapping for the docker container port to a port on the host. Within the container SQL Edge is always mapped to port 1433. This can be changed as part of the Azure SQL Edge deployment. To change the port number, update the "Container Create Options" for the SQL Edge module in Azure IoT Edge. In the example provided below, port 1433 on the container is mapped to port 1600 on the host.

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

- *SA password for the SQL Edge instance* - This is the value specified for the **SA_PASSWORD** environment variable during SQL Edge deployment.

## Connecting to the database engine from within the container

The [SQL Server command-line tools](https://docs.microsoft.com/sql/linux/sql-server-linux-setup-tools) are included in the Azure SQL Edge container image. If you attach to the container with an interactive command-prompt, you can run the tools locally.

1. Use the `docker exec -it` command to start an interactive bash shell inside your running container. In the following example `e69e056c702d` is the container ID.

    ```bash
    docker exec -it <Azure SQL Edge container id or name> /bin/bash
    ```

    > [!TIP]
    > You don't always have to specify the entire container id. You only have to specify enough characters to uniquely identify it. So in this example, it might be enough to use `e6` or `e69` rather than the full id.

2. Once inside the container, connect locally with sqlcmd. Sqlcmd is not in the path by default, so you have to specify the full path.

    ```bash
    /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P '<YourPassword>'
    ```

3. When finished with sqlcmd, type `exit`.

4. When finished with the interactive command-prompt, type `exit`. Your container continues to run after you exit the interactive bash shell.

## Connect to SQL Edge from another container on the same host

Since two containers running on the same host are on the same docker network, they can be easily accessed using the container name and the port address for the service. For example, if you are connecting to the SQL Edge instance from another python module (container) on the same host, you can use a connection string similar to the following. The example below assumes SQL Edge is configured to listen on the default port.

```python

import pyodbc
server = 'MySQLEdgeContainer' # Replace this with the actual name of your SQL Edge Docker container
username = 'sa' # SQL Server username
password = 'MyStrongestP@ssword' # Replace this with the actual SA password from your deployment
database = 'MyEdgeDatabase' # Replace this with the actual database name from your deployment. If you do not have a database created, you can use Master database.
db_connection_string = "Driver={ODBC Driver 17 for SQL Server};Server=" + server + ";Database=" + database + ";UID=" + username + ";PWD=" + password + ";"
conn = pyodbc.connect(db_connection_string, autocommit=True)

```

## Connect to SQL Edge from another network machine

To connect to the SQL Edge instance from another machine on the network, you'll need to use the IP address of the docker host and the host port to which the SQL Edge container is mapped to. For example, if the IP address of the docker host is *xxx.xxx.xxx.xxx" and SQL Edge container is mapped to host port *1600*, then the server address for SQL Edge instance would be **xxx.xxx.xxx.xxx,1600**. The updated python script would be

```python

import pyodbc
server = 'xxx.xxx.xxx.xxx,1600' # Replace this with the actual name of your SQL Edge Docker container
username = 'sa' # SQL Server username
password = 'MyStrongestP@ssword' # Replace this with the actual SA password from your deployment
database = 'MyEdgeDatabase' # Replace this with the actual database name from your deployment. If you do not have a database created, you can use Master database.
db_connection_string = "Driver={ODBC Driver 17 for SQL Server};Server=" + server + ";Database=" + database + ";UID=" + username + ";PWD=" + password + ";"
conn = pyodbc.connect(db_connection_string, autocommit=True)

```

To connect to an instance of SQL Edge using SQL Server Management Studio running on a Windows machine, refer [SQL Server Management Studio](https://docs.microsoft.com/sql/linux/sql-server-linux-manage-ssms).

To connect to an instance of SQL Edge using Visual Studio Code on a Windows, Mac or Linux machine refer [Visual Studio Code](https://docs.microsoft.com/sql/visual-studio-code/sql-server-develop-use-vscode).

To connect to an instance of SQL Edge using Azure Data Studio on Windows, Mac or Linux machine refer [Azure Data Studio](https://docs.microsoft.com/sql/azure-data-studio/quickstart-sql-server).

## See also

[Connect and Query](https://docs.microsoft.com/sql/linux/sql-server-linux-configure-docker#connect-and-query)

[Install SQL Server tools on Linux](https://docs.microsoft.com/sql/linux/sql-server-linux-setup-tools)
