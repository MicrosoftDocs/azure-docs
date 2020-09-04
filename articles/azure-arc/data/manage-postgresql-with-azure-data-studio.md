---
title: Use Azure Data Studio to manage your PostgreSQL instance
description: Use Azure Data Studio to manage your PostgreSQL instance
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: TheJY
ms.author: jeanyd
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: how-to
---

# Use Azure Data Studio to manage your PostgreSQL instance


This scenario will show you:
- how to manage your PostgreSQL instances with dashboard views like Overview, Connection Strings, Properties, Resource Health...

- how to work with your data and schema

## Get started with Azure Data Studio

To starting, you need to install Azure Data Studio as explained in [Install client tools](install-client-tools.md).

Once installed, start Azure Data Studio and reach its welcome page.

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

    Name of the user account you use to connect to the Controller. Use the name you typically use when you run `azdata login`. It is not the name of the PostgreSQL user you use to connect to the PostgreSQL database engine typically from psql.
- **Password:**
    The password of the user account you use to connect to the Controller


Azure data studio shows your Arc Data Controller. Expand it and it shows the list of PostgreSQL instances that it manages.

## Manage your PostgreSQL instances

Right-click on the PostgreSQL instance you want to manage and select [Manage]

The PostgreSQL Dashboard view:

That features several dashboards listed on the left side of that pane:

- **Overview:** 
    Displays summary information about your instance like name, Azure subscription ID, configuration, version of the database engine, endpoints for Grafana and Kibana...
    ![Screenshot of Azure Data Controllers\Postgres dashboard - Overview.](/assets/ADS_Jul2020_Controller_Postgres_Dashboard_Overview.jpg)
- **Connection Strings:** 
    Displays various connection strings you may need to connect to your PostgreSQL instance like psql, Node.js, PHP, Ruby...
    ![Screenshot of Azure Data Controllers\Postgres dashboard - Connection strings.](/assets/ADS_Jul2020_Controller_Postgres_Dashboard_ConnectionStrings.jpg)
- **Properties:**
    Displays various properties like PostgreSQL admin user name, associated resources group for the shadow resource...
    ![Screenshot of Azure Data Controllers\Postgres dashboard - Properties.](/assets/ADS_Jul2020_Controller_Postgres_Dashboard_Properties.jpg)
- **Resource health:** 
    Health of the pods hosting your instance: overview and details for various states like running, pending, failed...
    ![Screenshot of Azure Data Controllers\Postgres dashboard - Resource Health.](/assets/ADS_Jul2020_Controller_Postgres_Dashboard_ResourceHealth.jpg)
- **Diagnose and solve problems:** 
    Is the landing page where you will find various resources that will help you troubleshoot your instance as we expand the troubleshooting notebooks
- **New support request:** 
    Is the landing page from which you will be able to request assistance from our support services starting Public Preview announcement.

## Work with your data and schema

On the left side of the Azure Data Studio window, expand the node [Servers]:

And select [Add Connection] and fill in the connection details to your PostgreSQL instance:
- **Connection Type:** PostgreSQL
- **Server name:** enter the name of your PostgreSQL instance. For example: postgres01
- **Authentication type:** Password
- **User name:** for example, you can use the standard/default PostgreSQL admin user name. Note, this field is case-sensitive.
- **Password:** you'll find the password of the PostgreSQL username in the psql connection string in the output of the `azdata postgres server endpoint -n postgres01` command
- **Database name:** set the name of the database you want to connect to. You can let it set to __Default__
- **Server group:** you can let it set to __Default__
- **Name (optional):** you can let this blank
- **Advanced:**
    - **Host IP Address:** is the Public IP address of the Kubernetes cluster
    - **Port:** is the port on which your PostgreSQL instance is listening. You can find this port at the end of the psql connection string in the output of the `azdata postgres server endpoint -n postgres01` command. Not port 30080 on which Kubernetes is listening and that you entered when connecting to the Azure Data Controller in Azure Data Studio.
    - **Other parameters:** They should be self-explicit, you can live with the default/blank values they appear with.

Select **[OK] and [Connect]** to connect to your server.

Once connected, several experiences are available:
- **New query**
- **New Notebook**
- **Expand the display of your server and browse/work on the objects inside your database**
- **...**

Stay tune for more dashboards and richer experiences as we continuously and incrementally augment them.

## Next steps

[Migrate a PostgreSQL database into Arc](migrate-postgresql-db-into-arc.md)