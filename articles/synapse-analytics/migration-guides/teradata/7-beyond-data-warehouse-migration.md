---
title: "Beyond Teradata migration, implementing a modern data warehouse in Microsoft Azure"
description: Learn how a Teradata migration to Azure Synapse lets you integrate your data warehouse with the Microsoft Azure analytical ecosystem.
ms.service: synapse-analytics
ms.subservice:
ms.custom:
ms.devlang:
ms.topic: conceptual
author: ajagadish-24
ms.author: ajagadish
ms.reviewer: wiassaf
ms.date: 05/24/2022
---

# Beyond Teradata migration, implementing a modern data warehouse in Microsoft Azure

## Beyond data warehouse migration to Azure

One of the key reasons to migrate your existing data warehouse to Azure Synapse is to utilize a globally secure, scalable, low-cost, cloud-native, pay-as-you-use analytical database. Azure Synapse also lets you integrate your migrated data warehouse with the complete Microsoft Azure analytical ecosystem to take advantage of, and integrate with, other Microsoft technologies that help you modernize your migrated data warehouse. This includes integrating with technologies like:

- Azure Data Lake Storage&mdash;for cost effective data ingestion, staging, cleansing and transformation to free up DW capacity occupied by fast growing staging tables

- Azure Data Factory&mdash;for collaborative IT and self-service data integration [with connectors](/azure/data-factory/connector-overview) to cloud and on-premises data sources and streaming data

- [The Open Data Model Common Data Initiative](/common-data-model/)&mdash;to share consistent trusted data across multiple technologies including:
  - Azure Synapse
  - Azure Synapse Spark
  - Azure HDInsight
  - Power BI
  - SAP
  - Adobe Customer Experience Platform
  - Azure IoT
  - Microsoft ISV Partners

- [Microsoft's data science technologies](/azure/architecture/data-science-process/platforms-and-tools) including:
  - Azure ML studio
  - Azure Machine Learning Service
  - Azure Synapse Spark (Spark as a service)
  - Jupyter Notebooks
  - RStudio
  - ML.NET
  - Visual Studio .NET for Apache Spark to enable data scientists to use Azure Synapse data to train machine learning models at scale.
  
- [Azure HDInsight](/azure/hdinsight/)&mdash;to leverage big data analytical processing and join big data with Azure Synapse data by creating a Logical Data Warehouse using PolyBase

- [Azure Event Hubs](/azure/event-hubs/event-hubs-about), [Azure Stream Analytics](/azure/stream-analytics/stream-analytics-introduction) and [Apache Kafka](/azure/databricks/spark/latest/structured-streaming/kafka)&mdash;to integrate with live streaming data from within Azure Synapse

There's often acute demand to integrate with [Machine Learning](/azure/synapse-analytics/machine-learning/what-is-machine-learning) to enable custom built, trained machine learning models for use in Azure Synapse. This would enable in-database analytics to run at scale in-batch, on an event-driven basis and on-demand. The ability to exploit in-database analytics in Azure Synapse from multiple BI tools and applications also guarantees that all get the same predictions and recommendations.

In addition, there's an opportunity to integrate Azure Synapse with Microsoft partner tools on Azure to shorten time to value.

Let's look at these in more detail to understand how you can take advantage of the technologies in Microsoft's analytical ecosystem to modernize your data warehouse once you've migrated to Azure Synapse.

## Offloading data staging and ETL processing to Azure Data Lake and Azure Data Factory

Enterprises today have a key problem resulting from digital transformation. So much new data is being generated and captured for analysis, and much of this data is finding its way into data warehouses. A good example is transaction data created by opening online transaction processing (OLTP) systems to self-service access from mobile devices. These OLTP systems are the main sources of data to a data warehouse, and with customers now driving the transaction rate rather than employees, data in data warehouse staging tables has been growing rapidly in volume.

This, along with other new data&mdash;like Internet of Things (IoT) data, coming into the enterprise, means that companies need to find a way to deal with unprecedented data growth and scale data integration ETL processing beyond current levels. One way to do this is to offload ingestion, data cleansing, transformation and integration to a data lake and process it at scale there, as part of a data warehouse modernization program.

> [!TIP]
> Offload ELT processing to Azure Data Lake and still run at scale as your data volumes grow.

Once you've migrated your data warehouse to Azure Synapse, Microsoft provides the ability to modernize your ETL processing by ingesting data into, and staging data in, Azure Data Lake Storage. You can then clean, transform and integrate your data at scale using Data Factory before loading it into Azure Synapse in parallel using PolyBase.

### Microsoft Azure Data Factory

> [!TIP]
> Data Factory allows you to build scalable data integration pipelines code free.

[Microsoft Azure Data Factory](https://azure.microsoft.com/services/data-factory/)] is a pay-as-you-use, hybrid data integration service for highly scalable ETL and ELT processing. Data Factory provides a simple web-based user interface to build data integration pipelines, in a code-free manner that can:

- Data Factory allows you to build scalable data integration pipelines code free. Easily acquire data at scale. Pay only for what you use and connect to on premises, cloud, and SaaS based data sources.

- Ingest, move, clean, transform, integrate, and analyze cloud and on-premises data at scale and take automatic action such a recommendation, an alert, and more.

- Seamlessly author, monitor and manage pipelines that span data stores both on-premises and in the cloud.

- Enable pay as you go scale out in alignment with customer growth.

> [!TIP]
> Data Factory can connect to on-premises, cloud, and SaaS data.

All of this can be done without writing any code. However, adding custom code to Data Factory pipelines is also supported. The next screenshot shows an example Data Factory pipeline.

:::image type="content" source="../media/7-beyond-data-warehouse-migration/azure-data-factory-pipeline.png" border="true" alt-text="Screenshot showing an example of an Azure Data Factory pipeline.":::

> [!TIP]
> Pipelines called data factories control the integration and analysis of data. Data Factory is enterprise class data integration software aimed at IT professionals with a data wrangling facility for business users.

Implement Data Factory pipeline development from any of several places including:

- Microsoft Azure portal

- Microsoft Azure PowerShell

- Programmatically from .NET and Python using a multi-language SDK

- Azure Resource Manager (ARM) Templates

- REST APIs

Developers and data scientists who prefer to write code can easily author Data Factory pipelines in Java, Python, and .NET using the software development kits (SDKs) available for those programming languages. Data Factory pipelines can also be hybrid as they can connect, ingest, clean, transform and analyze data in on-premises data centers, Microsoft Azure, other clouds, and SaaS offerings.

Once you develop Data Factory pipelines to integrate and analyze data, deploy those pipelines globally and schedule them to run in batch, invoke them on demand as a service, or run them in real time on an event-driven basis. A Data Factory pipeline can also run on one or more execution engines and monitor pipeline execution to ensure performance and track errors.

#### Use cases

> [!TIP]
> Build data warehouses on Microsoft Azure.

> [!TIP]
> Build training data sets in data science to develop machine learning models.

Data Factory can support multiple use cases, including:

- Preparing, integrating, and enriching data from cloud and on-premises data sources to populate your migrated data warehouse and data marts on Microsoft Azure Synapse.

- Preparing, integrating, and enriching data from cloud and on-premises data sources to produce training data for use in machine learning model development and in retraining analytical models.

- Orchestrating data preparation and analytics to create predictive and prescriptive analytical pipelines for processing and analyzing data in batch, such as sentiment analytics, and either acting on the results of the analysis or populating your data warehouse with the results.

- Preparing, integrating, and enriching data for data-driven business applications running on the Azure cloud on top of operational data stores like Azure Cosmos DB.

#### Data sources

Data Factory lets you connect with [connectors](/azure/data-factory/connector-overview) from both cloud and on-premises data sources. Agent software, known as a Self-Hosted Integration Runtime, securely accesses on-premises data sources and supports secure, scalable data transfer.

#### Transforming data using Data Factory

> [!TIP]
> Professional ETL developers can use Data Factory mapping data flows to clean, transform and integrate data without the need to write code.

Within a Data Factory pipeline, ingest, clean, transform, integrate, and, if necessary, analyze any type of data from these sources. This includes structured, semi-structured&mdash;such as JSON or Avro&mdash;and unstructured data.

Professional ETL developers can use Data Factory mapping data flows to filter, split, join (many types), lookup, pivot, unpivot, sort, union, and aggregate data without writing any code. In addition, Data Factory supports surrogate keys, multiple write processing options such as insert, upsert, update, table recreation, and table truncation, and several types of target data stores&mdash;also known as sinks. ETL developers can also create aggregations, including time series aggregations that require a window to be placed on data columns.

> [!TIP]
> Data Factory supports the ability to automatically detect and manage schema changes in inbound data, such as in streaming data.

Run mapping data flows that transform data as activities in a Data Factory pipeline. Include multiple mapping data flows in a single pipeline, if necessary. Break up challenging data transformation and integration tasks into smaller mapping dataflows that can be combined to handle the complexity and custom code added if necessary. In addition to this functionality, Data Factory mapping data flows include these abilities:

- Define expressions to clean and transform data, compute aggregations, and enrich data. For example, these expressions can perform feature engineering on a date field to break it into multiple fields to create training data during machine learning model development. Construct expressions from a rich set of functions that include mathematical, temporal, split, merge, string concatenation, conditions, pattern match, replace, and many other functions.

- Automatically handle schema drift so that data transformation pipelines can avoid being impacted by schema changes in data sources. This is especially important for streaming IoT data, where schema changes can happen without notice when devices are upgraded or when readings are missed by gateway devices collecting IoT data.

- Partition data to enable transformations to run in parallel at scale.

- Inspect data to view the metadata of a stream you're transforming.

> [!TIP]
> Data Factory can also partition data to enable ETL processing to run at scale.

The next screenshot shows an example Data Factory mapping data flow.

:::image type="content" source="../media/6-microsoft-3rd-party-migration-tools/azure-data-factory-mapping-dataflows.png" border="true" alt-text="Screenshot showing an example of an Azure Data Factory mapping dataflow.":::

Data engineers can profile data quality and view the results of individual data transforms by switching on a debug capability during development.

> [!TIP]
> Data Factory pipelines are also extensible since Data Factory allows you to write your own code and run it as part of a pipeline.

Extend Data Factory transformational and analytical functionality by adding a linked service containing your own code into a pipeline. For example, an Azure Synapse Spark Pool notebook containing Python code could use a trained model to score the data integrated by a mapping data flow.

Store integrated data and any results from analytics included in a Data Factory pipeline in one or more data stores such as Azure Data Lake storage, Azure Synapse, or Azure HDInsight (Hive Tables). Invoke other activities to act on insights produced by a Data Factory analytical pipeline.

#### Utilizing Spark to scale data integration

Under the covers, Data Factory utilizes Azure Synapse Spark Pools&mdash;Microsoft's Spark-as-a-service offering&mdash;at run time to clean and integrate data on the Microsoft Azure cloud. This enables it to clean, integrate, and analyze high-volume and very high-velocity data (such as click stream data) at scale. Microsoft intends to execute Data Factory pipelines on other Spark distributions. In addition to executing ETL jobs on Spark, Data Factory can also invoke Pig scripts and Hive queries to access and transform data stored in Azure HDInsight.

#### Linking self-service data prep and Data Factory ETL processing using wrangling data flows

> [!TIP]
> Data Factory support for wrangling data flows in addition to mapping data flows means that business and IT can work together on a common platform to integrate data.

Another new capability in Data Factory is wrangling data flows. This lets business users (also known as citizen data integrators and data engineers) make use of the platform to visually discover, explore and prepare data at scale without writing code. This easy-to-use Data Factory capability is similar to Microsoft Excel Power Query or Microsoft Power BI Dataflows, where self-service data preparation business users use a spreadsheet-style UI with drop-down transforms to prepare and integrate data. The following screenshot shows an example Data Factory wrangling data flow.

:::image type="content" source="../media/6-microsoft-3rd-party-migration-tools/azure-data-factory-wrangling-dataflows.png" border="true" alt-text="Screenshot showing an example of Azure Data Factory wrangling dataflows.":::

This differs from Excel and Power BI, as Data Factory wrangling data flows uses Power Query Online to generate M code and translate it into a massively parallel in-memory Spark job for cloud scale execution. The combination of mapping data flows and wrangling data flows in Data Factory lets IT professional ETL developers and business users collaborate to prepare, integrate, and analyze data for a common business purpose. The preceding Data Factory mapping data flow diagram shows how both Data Factory and Azure Synapse Spark Pool Notebooks can be combined in the same Data Factory pipeline. This allows IT and business to be aware of what each has created. Mapping data flows and wrangling data flows can then be available for reuse to maximize productivity and consistency and minimize reinvention.

#### Linking Data and Analytics in Analytical Pipelines

In addition to cleaning and transforming data, Data Factory can combine data integration and analytics in the same pipeline. Use Data Factory to create both data integration and analytical pipelines&mdash;the latter being an extension of the former. Drop an analytical model into a pipeline so that clean, integrated data can be stored to provide predictions or recommendations. Act on this information immediately or store it in your data warehouse to provide you with new insights and recommendations that can be viewed in BI tools.

Models developed code-free with Azure ML Studio or with the Azure Machine Learning Service SDK using Synapse Spark Pool Notebooks or using R in RStudio can be invoked as a service from within a Data Factory pipeline to batch score your data. Analysis happens at scale by executing Spark machine learning pipelines on Synapse Spark Pool Notebooks.

Store integrated data and any results from analytics included in a Data Factory pipeline in one or more data stores, such as Azure Data Lake storage, Azure Synapse, or Azure HDInsight (Hive Tables). Invoke other activities to act on insights produced by a Data Factory analytical pipeline.

## A lake database to share consistent trusted data

> [!TIP]
> Microsoft has created a lake database to describe core data entities to be shared across the enterprise.

A key objective in any data integration set-up is the ability to integrate data once and reuse it everywhere, not just in a data warehouse&mdash;for example, in data science. Reuse avoids reinvention and ensures consistent, commonly understood data that everyone can trust.

> [!TIP]
> Azure Data Lake is shared storage that underpins Microsoft Azure Synapse, Azure ML, Azure Synapse Spark, and Azure HDInsight.

To achieve this goal, establish a set of common data names and definitions describing logical data entities that need to be shared across the enterprise&mdash;such as customer, account, product, supplier, orders, payments, returns, and so forth. Once this is done, IT and business professionals can use data integration software to create these common data assets and store them to maximize their reuse to drive consistency everywhere.

> [!TIP]
> Integrating data to create lake database logical entities in shared storage enables maximum reuse of common data assets.

Microsoft has done this by creating a [lake database](/azure/synapse-analytics/database-designer/concepts-lake-database). The lake database is a common language for business entities that represents commonly used concepts and activities across a business. Azure Synapse Analytics provides industry specific database templates to help standardize data in the lake. [Lake database templates](/azure/synapse-analytics/database-designer/concepts-database-templates) provide schemas for predefined business areas, enabling data to the loaded into a lake database in a structured way. The power comes when data integration software is used to create lake database common data assets. This results in self-describing trusted data that can be consumed by applications and analytical systems. Create a lake database in Azure Data Lake storage using Azure Data Factory, and consume it with Power BI, Azure Synapse Spark, Azure Synapse and Azure ML. The following diagram shows a lake database used in Azure Synapse Analytics.

:::image type="content" source="../media/7-beyond-data-warehouse-migration/azure-synapse-analytics-lake-database.png" border="true" alt-text="Screenshot showing how a lake database can be used in Azure Synapse Analytics.":::

## Integration with Microsoft data science technologies on Azure

Another key requirement in modernizing your migrated data warehouse is to integrate it with Microsoft and third-party data science technologies on Azure to produce insights for competitive advantage. Let's look at what Microsoft offers in terms of machine learning and data science technologies and see how these can be used with Azure Synapse in a modern data warehouse environment.

### Microsoft technologies for data science on Azure

> [!TIP]
> Develop machine learning models using a no/low code approach or from a range of programming languages like Python, R and .NET.

Microsoft offers a range of technologies to build predictive analytical models using machine learning, analyze unstructured data using deep learning, and perform other kinds of advanced analytics. This includes:

- Azure ML Studio

- Azure Machine Learning Service

- Azure Synapse Spark Pool Notebooks

- ML.NET (API, CLI or .NET Model Builder for Visual Studio)

- Visual Studio .NET for Apache Spark

Data scientists can use RStudio (R) and Jupyter Notebooks (Python) to develop analytical models, or they can use other frameworks such as Keras or TensorFlow.

#### Azure ML Studio

Azure ML Studio is a fully managed cloud service that lets you easily build, deploy, and share predictive analytics via a drag-and-drop web-based user interface. The next screenshot shows an Azure Machine Learning studio user interface.

:::image type="content" source="../media/7-beyond-data-warehouse-migration/azure-ml-studio-ui.png" border="true" alt-text="Screenshot showing predictive analysis in the Azure Machine Learning studio user interface.":::

#### Azure Machine Learning Service

> [!TIP]
> Azure Machine Learning Service provides an SDK for developing machine learning models using several open-source frameworks.

Azure Machine Learning Service provides a software development kit (SDK) and services for Python to quickly prepare data, as well as train and deploy machine learning models. Use Azure Machine Learning Service from Azure notebooks (a Jupyter notebook service) and utilize open-source frameworks, such as PyTorch, TensorFlow, Spark MLlib (Azure Synapse Spark Pool Notebooks), or scikit-learn. Azure Machine Learning Service provides an AutoML capability that automatically identifies the most accurate algorithms to expedite model development. You can also use it to build machine learning pipelines that manage end-to-end workflow, programmatically scale on the cloud, and deploy models both to the cloud and the edge. Azure Machine Learning Service uses logical containers called workspaces, which can be either created manually from the Azure portal or created programmatically. These workspaces keep compute targets, experiments, data stores, trained machine learning models, docker images, and deployed services all in one place to enable teams to work together. Use Azure Machine Learning Service from Visual Studio with a Visual Studio for AI extension.

> [!TIP]
> Organize and manage related data stores, experiments, trained models, docker images and deployed services in workspaces.

#### Azure Synapse Spark Pool Notebooks

> [!TIP]
> Azure Synapse Spark is Microsoft's dynamically scalable Spark-as-a-service offering scalable execution of data preparation, model development and deployed model execution.

[Azure Synapse Spark Pool Notebooks](/azure/synapse-analytics/spark/apache-spark-development-using-notebooks?msclkid=cbe4b8ebcff511eca068920ea4bf16b9) is an Apache Spark service optimized to run on Azure which:

- Allows data engineers to build and execute scalable data preparation jobs using Azure Data Factory

- Allows data scientists to build and execute machine learning models at scale using notebooks written in languages such as Scala, R, Python, Java, and SQL; and to visualize results

> [!TIP]
> Azure Synapse Spark can access data in a range of Microsoft analytical ecosystem data stores on Azure.

Jobs running in Azure Synapse Spark Pool Notebook can retrieve, process, and analyze data at scale from Azure Blob Storage, Azure Data Lake Storage, Azure Synapse, Azure HDInsight, and streaming data services such as Kafka.

Autoscaling and auto-termination are also supported to reduce total cost of ownership (TCO). Data scientists can use the ML flow open-source framework to manage the machine learning lifecycle.

#### ML.NET

> [!TIP]
> Microsoft has extended its machine learning capability to .NET developers.

ML.NET is an open-source and cross-platform machine learning framework (Windows, Linux, macOS), created by Microsoft for .NET developers so that they can use existing tools&mdash;like .NET Model Builder for Visual Studio&mdash;to develop custom machine learning models and integrate them into .NET applications.

#### Visual Studio .NET for Apache Spark

Visual Studio .NET for Apache® Spark™ aims to make Spark accessible to .NET developers across all Spark APIs. It takes Spark support beyond R, Scala, Python, and Java to .NET. While initially only available on Apache Spark on HDInsight, Microsoft intends to make this available on Azure Synapse Spark Pool Notebook.

### Utilizing Azure Analytics with your data warehouse

> [!TIP]
> Train, test, evaluate, and execute machine learning models at scale on Azure Synapse Spark Pool Notebook using data in your Azure Synapse.

Combine machine learning models built using the tools with Azure Synapse by.

- Using machine learning models in batch mode or in real time to produce new insights, and add them to what you already know in Azure Synapse.

- Using the data in Azure Synapse to develop and train new predictive models for deployment elsewhere, such as in other applications.

- Deploying machine learning models&mdash;including those trained elsewhere&mdash;in Azure Synapse to analyze data in the data warehouse and drive new business value.

> [!TIP]
> Produce new insights using machine learning on Azure in batch or in real-time and add to what you know in your data warehouse.

In terms of machine learning model development, data scientists can use RStudio, Jupyter notebooks, and Synapse Spark Pool notebooks together with Microsoft Azure Machine Learning Service to develop machine learning models that run at scale on Azure Synapse Spark Pool Notebooks using data in Azure Synapse. For example, they could create an unsupervised model to segment customers for use in driving different marketing campaigns. Use supervised machine learning to train a model to predict a specific outcome, such as predicting a customer's propensity to churn, or recommending the next best offer for a customer to try to increase their value. The next diagram shows how Azure Synapse Analytics can be leveraged for Machine Learning.

:::image type="content" source="../media/7-beyond-data-warehouse-migration/azure-synapse-train-predict.png" border="true" alt-text="Screenshot of an Azure Synapse Analytics train and predict model.":::

In addition, you can ingest big data&mdash;such as social network data or review website data&mdash;into Azure Data Lake, then prepare and analyze it at scale on Azure Synapse Spark Pool Notebook, using natural language processing to score sentiment about your products or your brand. Add these scores to your data warehouse to understand the impact of&mdash;for example&mdash;negative sentiment on product sales, and to leverage big data analytics to add to what you already know in your data warehouse.

## Integrating live streaming data into Azure Synapse Analytics

When analyzing data in a modern data warehouse, you must be able to analyze streaming data in real time and join it with historical data in your data warehouse. An example of this would be combining IoT data with product or asset data.

> [!TIP]
> Integrate your data warehouse with streaming data from IoT devices or clickstream.

Once you've successfully migrated your data warehouse to Azure Synapse, you can introduce this capability as part of a data warehouse modernization exercise. Do this by taking advantage of additional functionality in Azure Synapse.

> [!TIP]
> Ingest streaming data into Azure Data Lake Storage from Microsoft Event Hub or Kafka, and access it from Azure Synapse using PolyBase external tables.

To do this, ingest streaming data via Microsoft Event Hubs or other technologies, such as Kafka, using Azure Data Factory (or using an existing ETL tool if it supports the streaming data sources) and land it in Azure Data Lake Storage (ADLS). Next, create an external table in Azure Synapse using PolyBase and point it at the data being streamed into Azure Data Lake. Your migrated data warehouse will now contain new tables that provide access to real-time streaming data. Query this external table as if the data was in the data warehouse via standard TSQL from any BI tool that has access to Azure Synapse. You can also join this data to other tables containing historical data and create views that join live streaming data to historical data to make it easier for business users to access. In the following diagram, a real-time data warehouse on Azure Synapse analytics is integrated with streaming data in Azure Data Lake.

:::image type="content" source="../media/7-beyond-data-warehouse-migration/azure-datalake-streaming-data.png" border="true" alt-text="Screenshot of Azure Synapse Analytics with streaming data in an Azure Data Lake.":::

## Creating a logical data warehouse using PolyBase

> [!TIP]
> PolyBase simplifies access to multiple underlying analytical data stores on Azure to simplify access for business users.

PolyBase offers the capability to create a logical data warehouse to simplify user access to multiple analytical data stores.

This is attractive because many companies have adopted 'workload optimized' analytical data stores over the last several years in addition to their data warehouses. Examples of these platforms on Azure include:

- Azure Data Lake Storage with Azure Synapse Spark Pool Notebook (Spark-as-a-service), for big data analytics

- Azure HDInsight (Hadoop as-a-service), also for big data analytics

- NoSQL Graph databases for graph analysis, which could be done in Azure Cosmos DB

- Azure Event Hubs and Azure Stream Analytics, for real-time analysis of data in motion

You may have non-Microsoft equivalents of some of these. You may also have a master data management (MDM) system that needs to be accessed for consistent trusted data on customers, suppliers, products, assets, and more.

These additional analytical platforms have emerged because of the explosion of new data sources&mdash;both inside and outside the enterprises&mdash;that business users want to capture and analyze. Examples include:

- Machine generated data, such as IoT sensor data and clickstream data.

- Human generated data, such as social network data, review web site data, customer in-bound email, image, and video.

- Other external data, such as open government data and weather data.

This data is over and above the structured transaction data and master data sources that typically feed data warehouses. These new data sources include semi-structured data (like JSON, XLM, or Avro) or unstructured data (like text, voice, image, or video) which is more complex to process and analyze. This data could be very high volume, high velocity, or both.

As a result, the need for new kinds of more complex analysis has emerged, such as natural language processing, graph analysis, deep learning, streaming analytics, or complex analysis of large volumes of structured data. All of this is typically not happening in a data warehouse, so it's not surprising to see different analytical platforms for different types of analytical workloads, as shown in this diagram.

:::image type="content" source="../media/7-beyond-data-warehouse-migration/analytical-workload-platforms.png" border="true" alt-text="Screenshot of different analytical platforms for different types of analytical workloads in Azure Synapse Analytics.":::

Since these platforms are producing new insights, it's normal to see a requirement to combine these insights with what you already know in Azure Synapse. That's what PolyBase makes possible.

> [!TIP]
> The ability to make data in multiple analytical data stores look like it's all in one system and join it to Azure Synapse is known as a logical data warehouse architecture.

By leveraging PolyBase data virtualization inside Azure Synapse, you can implement a logical data warehouse. Join data in Azure Synapse to data in other Azure and on-premises analytical data stores&mdash;like Azure HDInsight or Cosmos DB&mdash;or to streaming data flowing into Azure Data Lake storage from Azure Stream Analytics and Event Hubs. Users access external tables in Azure Synapse, unaware that the data they're accessing is stored in multiple underlying analytical systems. The next diagram shows the complex data warehouse structure accessed through comparatively simpler but still powerful user interface methods.

:::image type="content" source="../media/7-beyond-data-warehouse-migration/complex-data-warehouse-structure.png" alt-text="Screenshot showing an example of a complex data warehouse structure accessed through user interface methods.":::

The previous diagram shows how other technologies of the Microsoft analytical ecosystem can be combined with the capability of Azure Synapse logical data warehouse architecture. For example, data can be ingested into Azure Data Lake Storage (ADLS) and curated using Azure Data Factory to create trusted data products that represent Microsoft [lake database](/azure/synapse-analytics/database-designer/concepts-lake-database) logical data entities. This trusted, commonly understood data can then be consumed and reused in different analytical environments such as Azure Synapse, Azure Synapse Spark Pool Notebooks, or Azure Cosmos DB. All insights produced in these environments are accessible via a logical data warehouse data virtualization layer made possible by PolyBase.

> [!TIP]
> A logical data warehouse architecture simplifies business user access to data and adds new value to what you already know in your data warehouse.

## Conclusions

> [!TIP]
> Migrating your data warehouse to Azure Synapse lets you make use of a rich Microsoft analytical ecosystem running on Azure.

Once you migrate your data warehouse to Azure Synapse, you can leverage other technologies in the Microsoft analytical ecosystem. You can't only modernize your data warehouse, but combine insights produced in other Azure analytical data stores into an integrated analytical architecture.

Broaden your ETL processing to ingest data of any type into Azure Data Lake Storage. Prepare and integrate it at scale using Azure Data Factory to produce trusted, commonly understood data assets that can be consumed by your data warehouse and accessed by data scientists and other applications. Build real-time and batch-oriented analytical pipelines and create machine learning models to run in batch, in-real-time on streaming data and on-demand as a service.

Leverage PolyBase and `COPY INTO` to go beyond your data warehouse. Simplify access to insights from multiple underlying analytical platforms on Azure by creating holistic integrated views in a logical data warehouse. Easily access streaming, big data, and traditional data warehouse insights from BI tools and applications to drive new value in your business.
