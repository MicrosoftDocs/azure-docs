---
title: Azure Data Factory
description: See a step-by-step guide for using Azure Data Factory for ingestion on Azure Cosmos DB for PostgreSQL.
ms.author: suvishod
author: suvishodcitus
ms.service: cosmos-db
ms.subservice: postgresql
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 01/30/2023
---

# How to ingest data by using Azure Data Factory in Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

[Azure Data Factory](../../data-factory/introduction.md) is a cloud-based
ETL and data integration service. It allows you to create data-driven workflows
to move and transform data at scale.

Using Data Factory, you can create and schedule data-driven workflows
(called pipelines) that ingest data from disparate data stores. Pipelines can
run on-premises, in Azure, or on other cloud providers for analytics and
reporting.

Data Factory has a data sink for Azure Cosmos DB for PostgreSQL. The data sink allows you to bring
your data (relational, NoSQL, data lake files) into Azure Cosmos DB for PostgreSQL tables
for storage, processing, and reporting.

:::image type="content" source="media/howto-ingestion/azure-data-factory-architecture.png" alt-text="Dataflow diagram for Azure Data Factory." border="false":::

## Data Factory for real-time ingestion

Here are key reasons to choose Azure Data Factory for ingesting data into
Azure Cosmos DB for PostgreSQL:

* **Easy-to-use** - Offers a code-free visual environment for orchestrating and automating data movement.
* **Powerful** - Uses the full capacity of underlying network bandwidth, up to 5 GiB/s throughput.
* **Built-in connectors** - Integrates all your data sources, with more than 90 built-in connectors.
* **Cost effective** - Supports a pay-as-you-go, fully managed serverless cloud service that scales on demand.

## Steps to use Data Factory

In this article, you create a data pipeline by using the Data Factory
user interface (UI). The pipeline in this data factory copies data from Azure
Blob storage to a database. For a list of data stores
supported as sources and sinks, see the [supported data
stores](../../data-factory/copy-activity-overview.md#supported-data-stores-and-formats)
table.

In Data Factory, you can use the **Copy** activity to copy data among
data stores located on-premises and in the cloud to Azure Cosmos DB for PostgreSQL. If you're
new to Data Factory, here's a quick guide on how to get started:

1. Once Data Factory is provisioned, go to your data factory. You see the Data
   Factory home page as shown in the following image:

   :::image type="content" source="media/howto-ingestion/azure-data-factory-home.png" alt-text="Screenshot showing the landing page of Azure Data Factory.":::

2. On the home page, select **Orchestrate**.

   :::image type="content" source="media/howto-ingestion/azure-data-factory-orchestrate.png" alt-text="Screenshot showing the Orchestrate page of Azure Data Factory.":::

3. Under **Properties**, enter a name for the pipeline.

4. In the **Activities** toolbox, expand the **Move & transform** category,
   and drag and drop the **Copy data** activity to the pipeline designer
   surface. At the bottom of the designer pane, on the **General** tab, enter a name for the copy activity.

   :::image type="content" source="media/howto-ingestion/azure-data-factory-pipeline-copy.png" alt-text="Screenshot showing a pipeline in Azure Data Factory.":::

5. Configure **Source**.

   1. On the **Activities** page, select the **Source** tab. Select **New** to create a source dataset.
   2. In the **New Dataset** dialog box, select **Azure Blob Storage**, and then select **Continue**. 
   3. Choose the format type of your data, and then select **Continue**.
   4. On the **Set properties** page, under **Linked service**, select **New**.
   5. On the **New linked service** page, enter a name for the linked service, and select your storage account from the **Storage account name** list.

      :::image type="content" source="media/howto-ingestion/azure-data-factory-configure-source.png" alt-text="Screenshot that shows configuring Source in Azure Data Factory.":::

   6. Under **Test connection**, select **To file path**, enter the container and directory to connect to, and then select **Test connection**.
   7. Select **Create** to save the configuration.
   8. On the **Set properties** screen, select **OK**.

6. Configure **Sink**.

   1. On the **Activities** page, select the **Sink** tab. Select **New** to create a sink dataset.
   2. In the **New Dataset** dialog box, select **Azure Database for PostgreSQL**, and then select **Continue**.
   3. On the **Set properties** page, under **Linked service**, select **New**.
   4. On the **New linked service** page, enter a name for the linked service, and select your cluster from the **Server name** list. Add connection details and test the connection.

      > [!NOTE]
      >
      > If your cluster isn't present in the drop down, use the **Enter manually** option to add server details.

      :::image type="content" source="media/howto-ingestion/azure-data-factory-configure-sink.png" alt-text="Screenshot that shows configuring Sink in Azure Data Factory.":::

   5. Select **Create** to save the configuration.
   6. On the **Set properties** screen, select **OK**.
   5. In the **Sink** tab on the **Activities** page, select the table name where you want to ingest the data.
   6. Under **Write method**, select **Copy command**.

      :::image type="content" source="media/howto-ingestion/azure-data-factory-copy-command.png" alt-text="Screenshot that shows selecting the table and Copy command.":::

7. From the toolbar above the canvas, select **Validate** to validate pipeline
   settings. Fix any errors, revalidate, and ensure that the pipeline has
   been successfully validated.

8. Select **Debug** from the toolbar to execute the pipeline.

   :::image type="content" source="media/howto-ingestion/azure-data-factory-execute.png" alt-text="Screenshot that shows Debug and Execute in Azure Data Factory.":::

9. Once the pipeline can run successfully, in the top toolbar, select **Publish all**. This action publishes entities (datasets and pipelines) you created
   to Data Factory.

## Call a stored procedure in Data Factory

In some specific scenarios, you might want to call a stored procedure/function
to push aggregated data from the staging table to the summary table. Data Factory doesn't offer a stored procedure activity for Azure Cosmos DB for PostgreSQL, but as
a workaround you can use the Lookup activity with a query to call a stored procedure
as shown below:

:::image type="content" source="media/howto-ingestion/azure-data-factory-call-procedure.png" alt-text="Screenshot that shows calling a procedure in Azure Data Factory.":::

## Next steps

Learn how to create a [real-time
dashboard](tutorial-design-database-realtime.md) with Azure Cosmos DB for PostgreSQL.
