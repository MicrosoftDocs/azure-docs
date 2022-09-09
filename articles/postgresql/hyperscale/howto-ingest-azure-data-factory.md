---
title: Azure Data Factory
description: Step-by-step guide for using Azure Data Factory for ingestion on Hyperscale Citus
ms.author: suvishod
author: suvishodcitus
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: how-to
ms.date: 06/27/2022
---

# How to ingest data using Azure Data Factory

[Azure Data Factory](../../data-factory/introduction.md) (ADF) is a cloud-based
ETL and data integration service. It allows you to create data-driven workflows
to move and transform data at scale.

Using Azure Data Factory, you can create and schedule data-driven workflows
(called pipelines) that ingest data from disparate data stores. Pipelines can
run on-premises, in Azure, or on other cloud providers for analytics and
reporting.

ADF has a data sink for Hyperscale (Citus). The data sink allows you to bring
your data (relational, NoSQL, data lake files) into Hyperscale (Citus) tables
for storage, processing, and reporting.

![Dataflow diagram for Azure Data Factory.](../media/howto-hyperscale-ingestion/azure-data-factory-architecture.png)

## ADF for real-time ingestion to Hyperscale (Citus)

Here are key reasons to choose Azure Data Factory for ingesting data into
Hyperscale (Citus):

* **Easy-to-use** - Offers a code-free visual environment for orchestrating and automating data movement.
* **Powerful** - Uses the full capacity of underlying network bandwidth, up to 5 GiB/s throughput.
* **Built-in Connectors** - Integrates all your data sources, with more than 90 built-in connectors.
* **Cost Effective** - Supports a pay-as-you-go, fully managed serverless cloud service that scales on demand.

## Steps to use ADF with Hyperscale (Citus)

In this article, we'll create a data pipeline by using the Azure Data Factory
user interface (UI). The pipeline in this data factory copies data from Azure
Blob storage to a database in Hyperscale (Citus). For a list of data stores
supported as sources and sinks, see the [supported data
stores](../../data-factory/copy-activity-overview.md#supported-data-stores-and-formats)
table.

In Azure Data Factory, you can use the **Copy** activity to copy data among
data stores located on-premises and in the cloud to Hyperscale Citus. If you're
new to Azure Data Factory, here's a quick guide on how to get started:

1. Once ADF is provisioned, go to your data factory. You'll see the Data
   Factory home page as shown in the following image:

   :::image type="content" source="../media/howto-hyperscale-ingestion/azure-data-factory-home.png" alt-text="Landing page of Azure Data Factory." border="true":::

2. On the home page, select **Orchestrate**.

   :::image type="content" source="../media/howto-hyperscale-ingestion/azure-data-factory-orchestrate.png" alt-text="Orchestrate page of Azure Data Factory." border="true":::

3. In the General panel under **Properties**, specify the desired pipeline name.

4. In the **Activities** toolbox, expand the **Move and Transform** category,
   and drag and drop the **Copy Data** activity to the pipeline designer
   surface. Specify the activity name.

   :::image type="content" source="../media/howto-hyperscale-ingestion/azure-data-factory-pipeline-copy.png" alt-text="Pipeline in Azure Data Factory." border="true":::

5. Configure **Source**

   :::image type="content" source="../media/howto-hyperscale-ingestion/azure-data-factory-configure-source.png" alt-text="Configuring Source in of Azure Data Factory." border="true":::

   1. Go to the Source tab. Select** + New **to create a source dataset.
   2. In the **New Dataset** dialog box, select **Azure Blob Storage**, and then select **Continue**. 
   3. Choose the format type of your data, and then select **Continue**.
   4. Under the **Linked service** text box, select **+ New**.
   5. Specify Linked Service name and select your storage account from the **Storage account name** list. Test connection
   6. Next to **File path**, select **Browse** and select the desired file from BLOB storage.
   7. Select **Ok** to save the configuration.

6. Configure **Sink**

   :::image type="content" source="../media/howto-hyperscale-ingestion/azure-data-factory-configure-sink.png" alt-text="Configuring Sink in of Azure Data Factory." border="true":::

   1. Go to the Sink tab. Select **+ New** to create a source dataset.
   2. In the **New Dataset** dialog box, select **Azure Database for PostgreSQL**, and then select **Continue**.
   3. Under the **Linked service** text box, select **+ New**. 
   4. Specify Linked Service name and select your server group from the list for Hyperscale (Citus) server groups. Add connection details and test the connection

      > [!NOTE]
      >
      > If your server group is not present in the drop down, use the **Enter
      > manually** option to add server details.

   5. Select the table name where you want to ingest the data.
   6. Specify **Write method** as COPY command.
   7. Select **Ok** to save the configuration.

7. From the toolbar above the canvas, select **Validate** to validate pipeline
   settings. Fix errors (if any), revalidate and ensure that the pipeline has
   been successfully validated.

8. Select Debug from the toolbar execute the pipeline.

   :::image type="content" source="../media/howto-hyperscale-ingestion/azure-data-factory-execute.png" alt-text="Debug and Execute in of Azure Data Factory." border="true":::

9. Once the pipeline can run successfully, in the top toolbar, select **Publish
   all**. This action publishes entities (datasets, and pipelines) you created
   to Data Factory.

## Calling a Stored Procedure in ADF

In some specific scenarios, you might want to call a stored procedure/function
to push aggregated data from staging table to summary table. As of today, ADF
doesn't offer Stored Procedure activity for Azure Database for Postgres, but as
a workaround we can use Lookup Activity with query to call a stored procedure
as shown below:

:::image type="content" source="../media/howto-hyperscale-ingestion/azure-data-factory-call-procedure.png" alt-text="Calling a procedure in Azure Data Factory." border="true":::

## Next steps

Learn how to create a [real-time
dashboard](tutorial-design-database-realtime.md) with Hyperscale (Citus).
