---
title: Use Search with SynapseML
titleSuffix: Azure Cognitive Search
description: Add full text search to big data on Apache Spark that's been loaded and transformed through SynapseML. In this walkthrough, you'll load invoice files into data frames, apply machine learning through SynapseML, then send it into a generated search index.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 08/08/2022
---

# Add search to AI-enriched data from Apache Spark using Azure Synapse Analytics

This is an Azure Cognitive Search article that explains how to add data exploration and full text search to a SynapseML solution.

[SynapseML](/research/blog/synapseml-a-simple-multilingual-and-massively-parallel-machine-learning-library/) is an open source library that supports massively parallel machine learning over big data. One of the ways in which machine learning is exposed is through *transformers*, or modules that perform specialized tasks. Transformers tap into a wide range of AI capabilities, but in this article, we'll focus on just those that call Cognitive Services and Cognitive Search.

In this walkthrough, you'll set up a workbook that does the following:

> [!div class="checklist"]
> + Load various forms (invoices) into a data frame in an Apache Spark session
> + Analyze them to determine their features
> + Assemble the output into a tabular data structure
> + Write the output to a search index in Azure Cognitive Search
> + Explore and search over the content you created

Although Azure Cognitive Search has native [AI enrichment](cognitive-search-concept-intro.md), a key point of this walkthrough is demonstrating access to AI capabilities outside of Cognitive Search. By using SynapseML instead of indexers or skills, you're not bound to specific data limits, data sources, or skill interfaces.

> [!TIP]
> Watch a demo of this walkthrough at [https://www.youtube.com/watch?v=iXnBLwp7f88](https://www.youtube.com/watch?v=iXnBLwp7f88) for more steps and visuals.

## Prerequisites

You'll need the `synapseml` library and several Azure resources. If possible, use the same subscription and region for your Azure resources and put everything into one resource group for simple cleanup later. The following links are for portal installs. The sample data is imported from a public site.

+ [Azure Cognitive Search](search-create-service-portal.md) (any tier)
+ [Azure Forms Recognizer](../applied-ai-services/form-recognizer/create-a-form-recognizer-resource.md) (any tier)
+ [Azure Databricks](/azure/databricks/scenarios/quickstart-create-databricks-workspace-portal?tabs=azure-portal) (any tier) <sup>1</sup>

<sup>1</sup> In this walkthrough, Azure Databricks provides the computing platform. You could also use Azure Synapse Analytics or something else. The above article includes multiple steps. For the purposes of this walkthrough, follow only the instructions in "Create a workspace".

> [!NOTE]
> All of the above resources support security features in the Microsoft Identity platform. For simplicity, this walkthrough assumes key-based authentication, using endpoints and keys copied from the portal pages of each service. If you implement this workflow in a production environment, or share the solution with others, remember to replace hard-coded keys with integrated security or encrypted keys.

## Create a Spark cluster and notebook

In this section, you'll create a cluster, install the `synapseml` library, and create a notebook to run the code.

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

1. On the left menu, select **Create** > **Notebook**.

1. Give the notebook a name, select **Python** as the default language, and select the cluster that has the `synapseml` library.

1. Create seven consecutive cells. You'll paste code into each one.

## Set up dependencies

Paste the following code into the first cell of your notebook. Replace the placeholders with endpoints and access keys for each resource. No other modifications are required, so run the code when you're ready.

This code loads packages and sets up the endpoints and keys for the Azure resources used in this workflow.

```python
import os
from pyspark.sql.functions import udf, trim, split, explode, col, monotonically_increasing_id, lit
from pyspark.sql.types import StringType
from synapse.ml.core.spark import FluentAPI

cognitive_services_key = "placeholder-cognitive-services-multi-service-key"
cognitive_services_region = "placeholder-cognitive-services-region"

translator_key = "placeholder-translator-key"

search_service = "placeholder-search-service-name"
search_key = "placeholder-search-service-api-key"
search_index = "placeholder-search-index-name"
```

## Load data into Spark

Paste the following code into the second cell. No modifications are required, so run the code when you're ready.

This code loads about several external files from an Azure storage account that's used for demo purposes. The files are various invoices, and they're read into a data frames 

```python
def blob_to_url(blob):
    [prefix, postfix] = blob.split("@")
    container = prefix.split("/")[-1]
    split_postfix = postfix.split("/")
    account = split_postfix[0]
    filepath = "/".join(split_postfix[1:])
    return "https://{}/{}/{}".format(account, container, filepath)


df2 = (spark.read.format("binaryFile")
    .load("wasbs://ignite2021@mmlsparkdemo.blob.core.windows.net/form_subset/*")
    .select("path")
    .limit(10)
    .select(udf(blob_to_url, StringType())("path").alias("url"))
    .cache())
    
display(df2)
```

## Apply form recognition

Paste the following code into the third cell. No modifications are required, so run the code when you're ready.

This code loads the [AnalyzeInvoices transformer](https://microsoft.github.io/SynapseML/docs/documentation/transformers/transformers_cognitive/#analyzeinvoices) and passes a reference to the data frame containing the invoices.

```python
from synapse.ml.cognitive import AnalyzeInvoices

analyzed_df = (AnalyzeInvoices()
    .setSubscriptionKey(cognitive_services_key)
    .setLocation(cognitive_services_region)
    .setImageUrlCol("url")
    .setOutputCol("invoices")
    .setErrorCol("errors")
    .setConcurrency(5)
    .transform(df2)
    .cache())

display(analyzed_df)
```

## Apply data restructuring

Paste the following code into the fourth cell and run it. No modifications are required.

This code loads FormOntologyLearner, a transformer that analyzes the output of form recognition and infers a tabular data structure. The output of forms recognition is dynamic and varies based on the features that form recognizer detects. The output is also consolidated into a single output column. FormOntologyLearner iterates over the output and looks for patterns that can be used to create tabular data.

```python
from synapse.ml.cognitive import FormOntologyLearner

itemized_df = (FormOntologyLearner()
    .setInputCol("invoices")
    .setOutputCol("extracted")
    .fit(analyzed_df)
    .transform(analyzed_df)
    .select("url", "extracted.*").select("*", explode(col("Items")).alias("Item"))
    .drop("Items").select("Item.*", "*").drop("Item"))

display(itemized_df)
```

## Apply translations

Paste the following code into the fifth cell. Replace the region in `setLocation` with the location of your Azure Translator service. No other modifications are required, so run the code when you're ready.

This code loads [Translate](https://microsoft.github.io/SynapseML/docs/documentation/transformers/transformers_cognitive/#translate), a transformer that calls the Azure Translator service in Cognitive Services. The original text, which is in English, is machine-translated into various languages. All of the output is consolidated into "output.translations" array.

```python
from synapse.ml.cognitive import Translate

translated_df = (Translate()
    .setSubscriptionKey(translator_key)
    .setLocation("eastus")
    .setTextCol("Description")
    .setErrorCol("TranslationError")
    .setOutputCol("output")
    .setToLanguage(["zh-Hans", "fr", "ru", "cy"])
    .setConcurrency(5)
    .transform(itemized_df)
    .withColumn("Translations", col("output.translations")[0])
    .drop("output", "TranslationError")
    .cache())

display(translated_df)
```

## Apply search indexing

Paste the following code in the sixth cell and then run it. No modifications are required.

This code loads AzureSearchWriter. It consumes a tabular dataset and infers a search index schema that defines one field for each column. The generated index will have a document key and use the default values for fields created using the [Create Index REST API](/rest/api/searchservice/create-index).

Because output translations is an array, it's articulated in the index as a complex collection with subfields for each translated language.

```python
from synapse.ml.cognitive import *

(completed_df.withColumn("DocID", monotonically_increasing_id().cast("string"))
    .withColumn("SearchAction", lit("upload"))
    .writeToAzureSearch(
        subscriptionKey=search_key,
        actionCol="SearchAction",
        serviceName=search_service,
        indexName=search_index,
        keyCol="DocID",
    ))
```

## Query the index

Paste the following code into the seventh cell and then run it. No modifications are required, except that you might want to vary the [query syntax](query-simple-syntax.md) to further explore your content.

This code calls the [Search Documents REST API](/rest/api/searchservice/search-documents) that queries an index. This particular example is searching for the word "door". Once you know what the field names are in the inferred index, you can add parameters like "select" and "searchFields" to scope the query request and response.

```python
import requests

url = "https://{}.search.windows.net/indexes/{}/docs/search?api-version=2020-06-30".format(search_service, search_index)
requests.post(url, json={"search": "door"}, headers={"api-key": search_key}).json()
```

## Clean up resources

When you're working in your own subscription, at the end of a project, it's a good idea to remove the resources that you no longer need. Resources left running can cost you money. You can delete resources individually or delete the resource group to delete the entire set of resources.

You can find and manage resources in the portal, using the **All resources** or **Resource groups** link in the left-navigation pane.

## Next steps

In this walkthrough, you learned about the [AzureSearchWriter](https://microsoft.github.io/SynapseML/docs/documentation/transformers/transformers_cognitive/#azuresearch) transformer in SynapseML, which is a new way of creating and loading search indexes in Azure Cognitive Search. The transformer takes tabular data as an input. The FormOntologyLearner can provide the necessary structure for output produced by Azure Forms Recognizer.

As a next step, review the other tutorials that produce transformed content you might want to explore through Azure Cognitive Search:

> [!div class="nextstepaction"]
> [Tutorial: Text Analytics with Cognitive Service](/azure/synapse-analytics/machine-learning/tutorial-text-analytics-use-mmlspark)

## Internal notes

+ Overview doc on github.io
https://microsoft.github.io/SynapseML/docs/next/features/cognitive_services/CognitiveServices%20-%20Overview/

+ Demo script
https://adb-2655922928099846.6.azuredatabricks.net/?o=2655922928099846#notebook/2161010915051452/command/2161010915051455

+ Internal script that loads environment variables
https://adb-2655922928099846.6.azuredatabricks.net/?o=2655922928099846#notebook/2112735246239104/command/2112735246239105