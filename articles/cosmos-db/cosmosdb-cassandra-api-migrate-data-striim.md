---
title: Migrate data to Azure Cosmos DB Cassandra API account using Striim 
description: Learn how to use Striim to migrate data from an Oracle database to an Azure Cosmos DB Cassandra API account. 
author: SnehaGunda
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 07/22/2019
ms.author: sngun
ms.reviewer: sngun
---

# Migrate data to Azure Cosmos DB Cassandra API account using Striim

The Striim image in the Azure marketplace offers continuous real-time data movement from data warehouses and databases to Azure. While moving the data, you can perform in-line denormalization, data transformation, enable real-time analytics, and data reporting scenarios. It’s easy to get started with Striim to continuously move enterprise data to Azure Cosmos DB Cassandra API. Azure provides a marketplace offering that makes it easy to deploy Striim and migrate data to Azure Cosmos DB. 

This article shows how to use Striim to migrate data from an **Oracle database** to an **Azure Cosmos DB Cassandra API account**.

## Prerequisites

* If you don't have an [Azure subscription](/azure/guides/developer/azure-developer-guide#understanding-accounts-subscriptions-and-billing), create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

* An Oracle database running on-premises with some data in it.

## Deploy the Striim marketplace solution

1. Sign into the [Azure portal](https://portal.azure.com/).

1. Select **Create a resource** and search for **Striim** in the Azure marketplace. Select the first option and **Create**.

   ![Find Striim marketplace item](./media/cosmosdb-sql-api-migrate-data-striim/striim-azure-marketplace.png)

1. Next, enter the configuration properties of the Striim instance. The Striim environment is deployed in a virtual machine. From the **Basics** pane, enter the **VM user name**, **VM password** (this password is used to SSH into the VM). Select your **Subscription**, **Resource Group**, and **Location details** where you’d like to deploy Striim. Once complete, select **OK**.

   ![Configure basic settings for Striim](./media/cosmosdb-sql-api-migrate-data-striim/striim-configure-basic-settings.png)


1. In the **Striim Cluster settings** pane, choose the type of Striim deployment and the virtual machine size.

   |Setting	| Value | Description |
   | ---| ---| ---|
   |Striim deployment type |Standalone | Striim can run in a **Standalone** or **Cluster** deployment types. Standalone mode will deploy the Striim server on a single virtual machine and you can select the size of the VMs depending on your data volume. Cluster mode will deploy the Striim server on two or more VMs with the selected size. Cluster environments with more than 2 nodes offer automatic high availability and failover.</br></br> In this tutorial, you can select Standalone option. Use the default “Standard_F4s” size VM. | 
   | Name of the Striim cluster|	<Striim_cluster_Name>|	Name of the Striim cluster.|
   | Striim cluster password|	<Striim_cluster_password>|	Password for the cluster.|

   After you fill the form, select **OK** to continue.

1. In the **Striim access settings** pane, configure the **Public IP address** (choose the default values), **Domain name for Striim**, **Admin password** that you’d like to use to login to the Striim UI. Configure a VNET and Subnet (choose the default values). After filling in the details, select **OK** to continue.

   ![Striim access settings](./media/cosmosdb-sql-api-migrate-data-striim/striim-access-settings.png)

1. Azure will validate the deployment and make sure everything looks good; validation takes few minutes to complete. After the validation is completed, select **OK**.
  
1. Finally, review the terms of use and select **Create** to create your Striim instance. 

## Configure the source database

In this section, you configure the Oracle database as the source for data movement.  You’ll need the [Oracle JDBC driver](https://www.oracle.com/technetwork/database/features/jdbc/jdbc-ucp-122-3110062.html) to connect to Oracle. To read changes from your source Oracle database, you can either use the [LogMiner](https://www.oracle.com/technetwork/database/features/availability/logmineroverview-088844.html) or the [XStream APIs](https://docs.oracle.com/cd/E11882_01/server.112/e16545/xstrm_intro.htm#XSTRM72647). The Oracle JDBC driver must be present in Striim's Java classpath to read, write, or persist data from Oracle database.

Download the [ojdbc8.jar](https://www.oracle.com/technetwork/database/features/jdbc/jdbc-ucp-122-3110062.html) driver onto your local machine. You will install it in the Striim cluster later.

## Configure target database

In this section, you will configure the Azure Cosmos DB Cassandra API account as the target for data movement.

1. Create an [Azure Cosmos DB Cassandra API account](create-cassandra-dotnet.md#create-a-database-account) using the Azure portal.

1. Navigate to the **Data Explorer** pane in your Azure Cosmos account. Select **New Table** to create a new container. Assume that you are migrating *products* and *orders* data from Oracle database to Azure Cosmos DB. Create a new Keyspace named **StriimDemo** with an Orders container. Provision the container with **1000 RUs**(this example uses 1000 RUs, but you should use the throughput estimated for your workload), and **/ORDER_ID** as the primary key. These values will differ depending on your source data. 

   ![Create Cassandra API account](./media/cosmosdb-cassandra-api-migrate-data-striim/create-cassandra-api-account.png)

## Configure Oracle to Azure Cosmos DB data flow

1. Now, let’s get back to Striim. Before interacting with Striim, install the Oracle JDBC driver that you downloaded earlier.

1. Navigate to the Striim instance that you deployed in the Azure portal. Select the **Connect** button in the upper menu bar and from the **SSH** tab, copy the URL in **Login using VM local account** field.

   ![Get the SSH URL](./media/cosmosdb-sql-api-migrate-data-striim/get-ssh-url.png)

1. Open a new terminal window and run the SSH command you copied from the Azure portal. This article uses terminal in a MacOS, you can follow the similar instructions using PuTTY or a different SSH client on a Windows machine. When prompted, type **yes** to continue and enter the **password** you have set for the virtual machine in the previous step.

   ![Connect to Striim VM](./media/cosmosdb-sql-api-migrate-data-striim/striim-vm-connect.png)

1. Now, open a new terminal tab to copy the **ojdbc8.jar** file you downloaded previously. Use the following SCP command to copy the jar file from your local machine to the tmp folder of the Striim instance running in Azure:

   ```bash
   cd <Directory_path_where_the_Jar_file_exists> 
   scp ojdbc8.jar striimdemo@striimdemo.westus.cloudapp.azure.com:/tmp
   ```

   ![Copy the Jar file from location machine to Striim](./media/cosmosdb-sql-api-migrate-data-striim/copy-jar-file.png)

1. Next, navigate back to the window where you did SSH to the Striim instance and Login as sudo. Move the **ojdbc8.jar** file from the **/tmp** directory into the **lib** directory of your Striim instance with the following commands:

   ```bash
   sudo su
   cd /tmp
   mv ojdbc8.jar /opt/striim/lib
   chmod +x ojdbc8.jar
   ```

   ![Move the Jar file to lib folder](./media/cosmosdb-sql-api-migrate-data-striim/move-jar-file.png)


1. From the same terminal window, restart the Striim server by executing the following commands:

   ```bash
   Systemctl stop striim-node
   Systemctl stop striim-dbms
   Systemctl start striim-dbms
   Systemctl start striim-node
   ```
 
1. Striim will take a minute to start up. If you’d like to see the status, run the following command: 

   ```bash
   tail -f /opt/striim/logs/striim-node.log
   ```

1. Now, navigate back to Azure and copy the Public IP address of your Striim VM. 

   ![Copy Striim VM IP address](./media/cosmosdb-sql-api-migrate-data-striim/copy-public-ip-address.png)

1. To navigate to the Striim’s Web UI, open a new tab in a browser and copy the public IP followed by: 9080. Sign in by using the **admin** username, along with the admin password you specified in the Azure portal.

   ![Sign in to Striim](./media/cosmosdb-sql-api-migrate-data-striim/striim-login-ui.png)

1. Now you’ll arrive at Striim’s home page. There are three different panes – **Dashboards**, **Apps**, and **SourcePreview**. The Dashboards pane allows you to move data in real time and visualize it. The Apps pane contains your streaming data pipelines, or data flows. On the right hand of the page is SourcePreview where you can preview your data before moving it.

1. Select the **Apps** pane, we’ll focus on this pane for now. There are a variety of sample apps that you can use to learn about Striim, however in this article you will create our own. Select the **Add App** button in the top right-hand corner.

   ![Add the Striim app](./media/cosmosdb-sql-api-migrate-data-striim/add-striim-app.png)

1. There are a few different ways to create Striim applications. Select **Start from Scratch** for this scenario.

   ![Start the app from scratch](./media/cosmosdb-cassandra-api-migrate-data-striim/start-app-from-scratch.png)

1. Give a friendly name for your application, something like **oraToCosmosDB** and select **Save**.

   ![Create a new application](./media/cosmosdb-cassandra-api-migrate-data-striim/create-new-application.png)

1. You’ll arrive at the Flow Designer, where you can drag and drop out of the box connectors to create your streaming applications. Type **Oracle** in the search bar, drag and drop the **Oracle CDC** source onto the app canvas.  

   ![Oracle CDC source](./media/cosmosdb-cassandra-api-migrate-data-striim/oracle-cdc-source.png)

1. Enter the source configuration properties of your Oracle instance. The source name is just a naming convention for the Striim application, you can use a name such as  **src_onPremOracle**. Also enter other details like Adapter type, connection URL, username, password, table name. Select **Save** to continue.

   ![Configure source parameters](./media/cosmosdb-cassandra-api-migrate-data-striim/configure-source-parameters.png)

1. Now, click the wave icon of the stream to connect the target Azure Cosmos DB instance. 

   ![Connect to target](./media/cosmosdb-cassandra-api-migrate-data-striim/connect-to-target.png)

1. Before configuring the target, make sure you have added a [Baltimore root certificate to Striim's Java environment](/azure/developer/java/sdk/java-sdk-add-certificate-ca-store#to-add-a-root-certificate-to-the-cacerts-store).

1. Enter the configuration properties of your target Azure Cosmos DB instance and select **Save** to continue. Here are the key parameters to note:

   * **Adapter** - Use **DatabaseWriter**. When writing to Azure Cosmos DB Cassandra API, DatabaseWriter is required. The Cassandra driver 3.6.0 is bundled with Striim. If the DatabaseWriter exceeds the number of RUs provisioned on your Azure Cosmos container, the application will crash.

   * **Connection URL** - Specify your Azure Cosmos DB JDBC connection URL. The URL is in the format     `jdbc:cassandra://<contactpoint>:10350/<databaseName>?SSL=true`

   * **Username** - Specify your Azure Cosmos account name.
   
   * **Password** - Specify the primary key of your Azure Cosmos account.

   * **Tables** - Target tables must have primary keys and primary keys can not be updated.

   ![Configure target properties](./media/cosmosdb-cassandra-api-migrate-data-striim/configure-target-parameters1.png)

   ![Configure target properties](./media/cosmosdb-cassandra-api-migrate-data-striim/configure-target-parameters2.png)

1. Now, we’ll go ahead and run the Striim application. In the upper menu bar select **Created**, and then **Deploy App**. In the deployment window you can specify if you want to run certain parts of your application on specific parts of your deployment topology. Since we’re running in a simple deployment topology through Azure, we’ll use the default option.

   ![Deploy the app](./media/cosmosdb-cassandra-api-migrate-data-striim/deploy-the-app.png)


1. Now, we’ll go ahead and preview the stream to see data flowing through the Striim. Click the wave icon and click the eye icon next to it. After deploying, you can preview the stream to see data flowing through. Select the **wave** icon and the **eyeball** next to it. Select the **Deployed** button in the top menu bar, and select **Start App**.

   ![Start the app](./media/cosmosdb-cassandra-api-migrate-data-striim/start-the-app.png)

1. By using a **CDC(Change Data Capture)** reader, Striim will pick up only new changes on the database. If you have data flowing through your source tables, you’ll see it. However, since this is a sample table, the source that isn’t connected to any application. If you use a sample data generator, you can insert a chain of events into your Oracle database.

1. You’ll see data flowing through the Striim platform. Striim picks up all the metadata associated with your table as well, which is helpful to monitor the data and make sure that the data lands on the right target.

   ![Set up the CDC pipeline](./media/cosmosdb-cassandra-api-migrate-data-striim/setup-cdc-pipeline.png)

1. Finally, let’s sign into Azure and navigate to your Azure Cosmos account. Refresh the Data Explorer, and you can see that data has arrived. 

By using the Striim solution in Azure, you can continuously migrate data to Azure Cosmos DB from various sources such as Oracle, Cassandra, MongoDB, and various others to Azure Cosmos DB. To learn more please visit the [Striim website](https://www.striim.com/), [download a free 30-day trial of Striim](https://go2.striim.com/download-free-trial), and for any issues when setting up the migration path with Striim, file a [support request.](https://go2.striim.com/request-support-striim)

## Next steps

* If you are migrating data to Azure Cosmos DB SQL API, see [how to migrate data to Cassandra API account using Striim](cosmosdb-sql-api-migrate-data-striim.md)

* [Monitor and debug your data with Azure Cosmos DB metrics](use-metrics.md)
