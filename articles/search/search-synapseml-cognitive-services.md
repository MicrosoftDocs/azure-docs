---
title: Use search with Synapse ML
titleSuffix: Azure Cognitive Search
description: Add full text search to big data using Apache Spark, Cognitive Services for Big Data, and Synapse ML. Ingest data frames from Azure Databricks, transform it using Cognitive Services resources, then load it into a generated index using the AzureSearchWriter functions in Synapse ML.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 08/06/2022
---

# Create a search solution using AI-enriched data from Apache Spark and Azure Synapse Analytics

This Azure Cognitive Search article explains how to add full text search to big data from Apache Spark using the SynapseML feature of Azure Synapse Analytics. Transformers in SynapseML automate calls to both Cognitive Services and Cognitive Search. By stepping through this exercise, you'll learn how to transform big data in a Spark cluster and then send it a search index so that you can query the output.

The article starts with forms (invoices) in Azure Storage and includes the following steps:

+ Create a Synapse workspace that connects to a Spark cluster using Azure Databricks.
+ Create a notebook that loads and transforms data using SynapseML and other resources. Transformations include forms recognition, form analysis and restructuring, and text translation.
+ Infer, build, and load a search index using AzureSearchWriter from SynapseML.
+ Query the search index that contains transformed and multi-lingual content.

The search corpus is created and hosted in Azure Cognitive Search, and all queries execute locally over the search corpus. SynapseML provides transformers that wrap other Azure resources, including Azure Forms Recognizer, Azure Translator, and Azure Cognitive Search.

You'll call these SynapseML transformers in this walkthrough:

+ [synapse.ml.cognitive.AnalyzeInvoices](https://microsoft.github.io/SynapseML/docs/documentation/transformers/transformers_cognitive/#analyzeinvoices)
+ [synapse.ml.cognitive.FormOntologyLearner](https://mmlspark.blob.core.windows.net/docs/0.10.0/pyspark/synapse.ml.cognitive.html#module-synapse.ml.cognitive.FormOntologyTransformer)
+ [synpase.ml.cognitive.AzureSearchWriter](https://microsoft.github.io/SynapseML/docs/documentation/transformers/transformers_cognitive/#azuresearch)

## Prerequisites

You'll need multiple Azure resources for this walkthrough. You should use the same subscription and region, and put everything into one resource group for simple clean up later. The following links are for portal installs.

+ [Azure Cognitive Search](search-create-service-portal.md) (any tier)
+ [Azure Forms Recognizer](../applied-ai-services/form-recognizer/create-a-form-recognizer-resource.md) (any tier)
+ [Azure Cognitive Services Translator](../cognitive-services/translator/how-to-create-translator-resource.md), Single service (any tier)
+ TBD - [Azure Storage](../storage/common/storage-account-create.md?tabs=azure-portal), Standard (general purpose v2)
+ [Azure Data Lake Storage Gen2](../storage/blobs/create-data-lake-storage-account.md), Standard (general-purpose v2), as required by Azure Synapse Analytics.
+ [Azure Synapse Analytics](../synapse-analytics/get-started-create-workspace.md) (any tier)
+ [Azure Databricks](../databricks/scenarios/quickstart-create-databricks-workspace-portal.md?tabs=azure-portal#create-an-azure-databricks-workspace) (any tier) <sup>1</sup>

<sup>1</sup> This quickstart includes multiple steps. Follow just the instructions in the "Create an Azure Databricks workspace" section.

All of these resources support security features in the Microsoft Identity platform, but for simplicity this walkthrough assumes key-based authentication, using endpoints and keys copied from the portal pages of each service.

## Prepare data

The sample data consists of 10 invoices of various composition. A small data set speeds up processing and meets the requirements of minimum tiers, but the approach described in this exercise will work for large volumes of data.

1. Download the sample data from the Azure Search Sample data repository.

1. Upload the files to a new container in your storage account.

1. Get the connection string and access keys for the account.

## Create a Spark cluster and install the `synapseml` library

1. In Azure portal, find your Azure Databricks workspace and select **Launch workspace**.

1. On the left menu, select **Compute**.

1. Select **Create cluster**.

1. Give the cluster a name, accept the default configuration, and then create the cluster. It takes several minutes to create the cluster.

1. Install the `synapseml` library:

   1. After the cluster is created, select **Library** from the tabs at the top of the cluster's page.
   1. Select **Install new**.
   1. Select **Maven**.
   1. In Coordinates, enter `com.microsoft.azure:synapseml_2.12:0.10.0`
   1. Select **Install**.

Test your configuration

1. On the left menu, select **Create** > **Notebook**.

1. Give the notebook a name, select **Python** as the default language, and select the cluster that has the `synapseml` library.

1. Paste in the shared code into four consecutive cells.

## Limitations

## Clean up

## Next steps

## Internal notes

https://microsoft.github.io/SynapseML/docs/next/features/cognitive_services/CognitiveServices%20-%20Overview/