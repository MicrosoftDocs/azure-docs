---
title: Use Search with SynapseML
titleSuffix: Azure Cognitive Search
description: Add full text search to big data on Apache Spark that's been loaded and transformed through SynapseML. In this walkthrough, you'll load invoice files into data frames, apply machine learning through SynapseML, then send it into a generated search index..

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 08/06/2022
---

# Add search to AI-enriched data from Apache Spark using Azure Synapse Analytics

This Azure Cognitive Search article explains how to add full text search to big data from Apache Spark that's been transformed using the SynapseML feature of Azure Synapse Analytics. Transformers in SynapseML integrate with Cognitive Services and Cognitive Search. By stepping through this exercise, you'll learn how to transform data in a Spark cluster and then send it a search index so that you can query the output. 

Although Azure Cognitive Search has native [AI enrichment](cognitive-search-concept-intro.md) capabilities, this walkthrough uses SynapseML transformers instead of indexers and skillsets. A key takeaway is learning an end-to-end workflow that shows you how to tap AI capabilities outside of Cognitive Search.

The article starts with forms (invoices) in Azure Storage and includes the following steps:

+ Create an Azure Databricks workspace that connects to a Spark cluster containing your data.
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
+ [Azure Data Lake Storage Gen2](../storage/blobs/create-data-lake-storage-account.md), Standard or Premium
+ [Azure Synapse Analytics](../synapse-analytics/get-started-create-workspace.md) (any tier)
+ [Azure Databricks](/azure/databricks/scenarios/quickstart-create-databricks-workspace-portal?tabs=azure-portal) (any tier) <sup>1</sup>

<sup>1</sup> The Azure Databricks quickstart includes multiple steps. Follow just the instructions in the "Create an Azure Databricks workspace" section.

The following screenshot shows a resource group with the required resources.

:::image type="content" source="media/search-synapseml-cognitive-services/resource-group.png" alt-text="Screenshot of the resource group containing all resources." border="true":::

> [!NOTE]
> All of the above resources support security features in the Microsoft Identity platform.  For simplicity, this walkthrough assumes key-based authentication, using endpoints and keys copied from the portal pages of each service. If you implement this workflow in a production environment or share the solution with others, be sure to replace hard-coded keys with integrated security or encrypted keys.

## Prepare data

The sample data consists of 10 invoices of various composition. A small data set speeds up processing and meets the requirements of minimum tiers, but the approach described in this exercise will work for large volumes of data.

+ *HS: I need the invoices. Are the PDFs wrapping JPEG?*
+ *HS: I'll upload them to our sample data repo once I get the files.*
+ *HS: FYI I'm using the ADLS GEN2 that Synapse needs to store the sample data. Should be okay but I'm just mentioning it in case it matters.*

1. Download the sample data from the Azure Search Sample data repository.

1. Upload the files to a new container in your storage account.

1. Get the connection string and access keys for the account. You'll need it later.

## Create a Spark cluster and add SynapsemL

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

## Create a notebook

1. On the left menu, select **Create** > **Notebook**.

1. Give the notebook a name, select **Python** as the default language, and select the cluster that has the `synapseml` library.

1. Create seven consecutive cells. You'll paste code into each one.

## Set up dependencies

Paste the following code into the first cell. Replace the placeholders with endpoints and access keys for each resource.

This code loads packages and sets up the endpoints and keys for the Azure resources used in this workflow.

+ *HS: What is VISION used for?  Do the PDFs contain JPEG???*
+ *HS: Where is Forms Recognizer?*
+ *HS: what is Project Arcadia?*
+ *HS: Can I delete all instances of mmlspark-build-key and openAI?*
+ *HS: I need to add endpoints, not just keys -- where and how do I do that?*

```python
import os
from pyspark.sql.functions import udf, trim, split, explode, col, monotonically_increasing_id, lit
from pyspark.sql.types import StringType
from synapse.ml.core.spark import FluentAPI

if os.environ.get("AZURE_SERVICE", None) == "Microsoft.ProjectArcadia":
    from pyspark.sql import SparkSession

    spark = SparkSession.builder.getOrCreate()
    from notebookutils.mssparkutils.credentials import getSecret

    os.environ["VISION_API_KEY"] = getSecret("mmlspark-build-keys", "placeholder-cognitive-api-key")
    os.environ["AZURE_SEARCH_KEY"] = getSecret("mmlspark-build-keys", "placeholder-azure-search-key")
    os.environ["TRANSLATOR_KEY"] = getSecret("mmlspark-build-keys", "placeholder-translator-key")
    from notebookutils.visualization import display


key = os.environ["VISION_API_KEY"]
search_key = os.environ["AZURE_SEARCH_KEY"]
translator_key = os.environ["TRANSLATOR_KEY"]
openai_key = os.environ["OPENAI_API_KEY"]

search_service = "placeholder-search-service-name"
search_index = "placeholder-search-index-name"
```

## Load data into Spark

Paste the following code into the second cell. Replace the placeholders for the container and storage account with valid names.

This code creates references to external files in Azure Storage and reads them into data frames.

```python
def blob_to_url(blob):
    [prefix, postfix] = blob.split("@")
    container = prefix.split("/")[-1]
    split_postfix = postfix.split("/")
    account = split_postfix[0]
    filepath = "/".join(split_postfix[1:])
    return "https://{}/{}/{}".format(account, container, filepath)


df2 = (spark.read.format("binaryFile")
    .load("wasbs://placeholder-container=name@placeholder-storage-account-name.blob.core.windows.net/form_subset/*")
    .select("path")
    .limit(10)
    .select(udf(blob_to_url, StringType())("path").alias("url"))
    .cache())
    
display(df2)
```

## Apply form recognition

Paste the following code into the third cell. Replace the region in `setLocation` with the location of your Azure Forms Recognizer resource. No other modifications are required.

This code loads the AnalyzeInvoices transformer and the invoices.

+ *HS: SUBSCRIPTION KEY?? Should the key references be more specific. Subscription key is unfamiliar terminology.*
+ *HS: IMAGE URL?? still not sure how images factor into this demo.*
+ *HS: ORIGINAL SUBHEAD INCLUDES "DISTRIBUTED" - is this important?*
+ *HS: What's the best link for AnalyzeInvoices?*

```python
from synapse.ml.cognitive import AnalyzeInvoices

analyzed_df = (AnalyzeInvoices()
    .setSubscriptionKey(key)
    .setLocation("eastus")
    .setImageUrlCol("url")
    .setOutputCol("invoices")
    .setErrorCol("errors")
    .setConcurrency(5)
    .transform(df2)
    .cache())

display(analyzed_df)
```

## Apply form ontology

Paste the following code into the fourth cell. No modifications are required.

This code loads FormOntologyLearner, a transformer that analyzes the output of form recognition and infers a tabular data structure.

+ *HS: FormOntologyLearner isn't documented on github.io*

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

Paste the following code into the fifth cell. Replace the region in `setLocation` with the location of your Azure Translator service. No other modifications are required.

This code loads Translate, a transformer that calls the Azure Translator in Cognitive Services. The original text, which is in English, is machine-translated into various languages. All of the output is consolidated into "output.translations".

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

## Create and load an index

Paste the following code in the sixth cell. No modifications are required.

This code loads AzureSearchWriter. It consumes a tabular dataset and infers a search index schema that defines one field for each column. The generated index will have a document key and use the default values for fields created using the REST API.

+ *HS: Is there anyway to add language analyzers?  If not, should we skip the translation step or replace it with a different transformer?  It's possible that without the right language analyzers, the results are subpar and will discourage customers from adoption, but that's just a concern on my part, and not sure if it's valid.*

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

## Search the index

Paste the following code into the seventh cell. No modifications are required, except that you might want to vary the [query syntax](query-simple-syntax.md) to further explore your content.

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

+ Demo video
https://adb-2655922928099846.6.azuredatabricks.net/?o=2655922928099846#notebook/2112735246239104/command/2112735246239105
