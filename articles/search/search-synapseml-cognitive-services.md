---
title: Use search with Synapse ML
titleSuffix: Azure Cognitive Search
description: Add full text search to big data using Apache Spark, Cognitive Services for Big Data, and Synapse ML. Ingest data frames from Azure Databricks, transform it using Cognitive Services resources, then load it into a generated index using the AzureSearchWriter functions in Synapse ML.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 07/26/2022
---

# How to implement full text search over AI-enriched data from Apache Spark using Synapse ML and Azure Cognitive Services

This Azure Cognitive Search article explains how to add full text search to big data from Apache Spark using Synapse ML. This workflow includes machine learning translation and image analysis from Cognitive Services.

The article includes the following steps:

+ Start with data in Azure Databricks, Azure's Apache Spark solution
+ Apply machine learning using Azure Cognitive Services for big data
+ Load the results into a generated search index using AzureSearchWriter from Synapse ML
+ Query the search index that contains multi-lingual content

The search corpus is created and hosted in Azure Cognitive Search, and all queries execute locally over the search corpus. Synapse ML provides modules that wrap other Azure resources, including Azure Forms Recognizer and Azure Cognitive Search. 

You'll call these modules in this walkthrough:

+ synapse.ml.cognitive.AnalyzeInvoices
+ synapse.ml.cognitive.FormOntologyLearner
+ synpase.ml.cognitive.AzureSearchWriter

## Prerequisites

You'll need multiple Azure resources for this walkthrough, but you can put everything into one resource group for simple clean up later. The following links are for portal installs.

+ [Azure Databricks](../databricks/scenarios/quickstart-create-databricks-workspace-portal.md#create-an-azure-databricks-workspace)
+ [Azure Cognitive Services multiservice]() <sup>1</sup>
+ [Azure Cognitive Services Translator]() <sup>2</sup>
+ [Azure Cognitive Search](search-create-service-portal.md)

<sup>1</sup> The multi-service account gives access to most Cognitive Services resources. It's used in this walkthrough for access to for Big Data is a Cognitive Services resource that's integrated with Apache Spark. The only difference 

<sup>2</sup>Translator isn't supported in Cognitive Services for big data so this walkthrough uses a standalone resource to access the machine translation model.

All of these resources support security features in the Microsoft Identity platform, but for simplicity this walkthrough assumes key-based authentication, using keys copied from the portal pages of each service.

## Steps

### Create a Spark cluster and install the synapseml library

1. In Azure portal, find your Azure Databricks workspace and select **Launch workspace**.

1. On the left menu, select **Compute**.

1. Select **Create cluster**.

1. Give the cluster a name, accept the default configuration, and then create the cluster. It takes several minutes to create the cluster.

1. Install synapseml library:

   1. After the cluster is created, select **Library** from the tabs at the top of the cluster's page.
   1. Select **Install new**.
   1. Select **Maven**.
   1. In Coordinates, enter `com.microsoft.azure:synapseml_2.12:0.10.0`
   1. Select **Install**.

Test your configuration

1. On the left menu, select **Create** > **Notebook**.
1. Give the notebook a name, select **Python** as the default language, and select the cluster that has the synapseml library.
1. Paste in the shared code into 4 consecutive cells.

## Install

## Recommendations

You'll create multiple Azure resources, up to 5. If you create them all in the same resource group, it simplifies clean up later if you decide not to keep them. Deleting the resource group deletes all resources in that group.

## Limitations

## Clean up

## Next steps

## Internal notes

https://microsoft.github.io/SynapseML/docs/next/features/cognitive_services/CognitiveServices%20-%20Overview/

