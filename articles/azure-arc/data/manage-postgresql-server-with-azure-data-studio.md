---
title: Use Azure Data Studio to manage your PostgreSQL instance
description: Use Azure Data Studio to manage your PostgreSQL instance
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-postgresql
author: dhanmm
ms.author: dhmahaja
ms.reviewer: mikeray
ms.date: 07/30/2021
ms.topic: how-to
---

# Use Azure Data Studio to manage your Azure Arc-enabled PostgreSQL server


This article describes how to:
- manage your PostgreSQL instances with dashboard views like Overview, Connection Strings, Properties, Resource Health...
- work with your data and schema

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Prerequisites

- [Install azdata, Azure Data Studio, and Azure CLI](install-client-tools.md)
- Install in Azure Data Studio the **[!INCLUDE [azure-data-cli-azdata](../../../includes/azure-data-cli-azdata.md)]** and **Azure Arc** and **PostgreSQL** extensions

   [!INCLUDE [use-insider-azure-data-studio](includes/use-insider-azure-data-studio.md)]

- Create the [Azure Arc Data Controller](./create-data-controller-indirect-cli.md)
- Launch Azure Data Studio

## Connect to the Azure Arc Data Controller

In Azure Data Studio, expand the node **Azure Arc Controllers** and select the **Connect Controller** button:

Enter the connection information to your Azure Data Controller:

- **Controller URL:**

    The URL to connect to your controller in Kubernetes. Entered in the form of `https://<IP_address_of_the_controller>:<Kubernetes_port.`
    For example:

    ```console
    https://12.345.67.890:30080
    ```
- **Username:**

    Name of the user account you use to connect to the Controller. Use the name you typically use when you run `az login`. It is not the name of the PostgreSQL user you use to connect to the PostgreSQL database engine typically from psql.
- **Password:**
    The password of the user account you use to connect to the Controller


Azure data studio shows your Arc Data Controller. Expand it and it shows the list of PostgreSQL instances that it manages.

## Manage your Azure Arc-enabled PostgreSQL servers

Right-click on the PostgreSQL instance you want to manage and select [Manage]

The PostgreSQL Dashboard view:

That features several dashboards listed on the left side of that pane:

- **Overview:** 
    Displays summary information about your instance like name, PostgreSQL admin user name, Azure subscription ID, configuration, version of the database engine, endpoints for Grafana and Kibana...
- **Connection Strings:** 
    Displays various connection strings you may need to connect to your PostgreSQL instance like psql, Node.js, PHP, Ruby...
- **Diagnose and solve problems:** 
    Displays various resources that will help you troubleshoot your instance as we expand the troubleshooting notebooks
- **New support request:** 
    Request assistance from our support services starting preview announcement.

## Work with your data and schema

On the left side of the Azure Data Studio window, expand the node **Servers**:

And select [Add Connection] and fill in the connection details to your PostgreSQL instance:
- **Connection Type:** PostgreSQL
- **Server name:** enter the name of your PostgreSQL instance. For example: postgres01
- **Authentication type:** Password
- **User name:** for example, you can use the standard/default PostgreSQL admin user name. Note, this field is case-sensitive.
- **Password:** you'll find the password of the PostgreSQL username in the psql connection string in the output of the `az postgres server-arc endpoint -n postgres01` command
- **Database name:** set the name of the database you want to connect to. You can let it set to __Default__
- **Server group:** you can let it set to __Default__
- **Name (optional):** you can let this blank
- **Advanced:**
    - **Host IP Address:** is the Public IP address of the Kubernetes cluster
    - **Port:** is the port on which your PostgreSQL instance is listening. You can find this port at the end of the psql connection string in the output of the `az postgres server-arc endpoint -n postgres01` command. Not port 30080 on which Kubernetes is listening and that you entered when connecting to the Azure Data Controller in Azure Data Studio.
    - **Other parameters:** They should be self-explicit, you can live with the default/blank values they appear with.

Select **[OK] and [Connect]** to connect to your server.

Once connected, several experiences are available:
- **New query**
- **New Notebook**
- **Expand the display of your server and browse/work on the objects inside your database**
- **...**

## Next step
[Monitor your server group](monitor-grafana-kibana.md)