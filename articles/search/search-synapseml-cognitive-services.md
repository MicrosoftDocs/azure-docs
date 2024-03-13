---
title: 'Tutorial: Index at scale (Spark)'
titleSuffix: Azure AI Search
description: Search big data from Apache Spark that's been transformed by SynapseML. You'll load invoices into data frames, apply machine learning, and then send output to a generated search index.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: tutorial
ms.date: 02/01/2023
---

# Tutorial: Index large data from Apache Spark using SynapseML and Azure AI Search

In this Azure AI Search tutorial, learn how to index and query large data loaded from a Spark cluster. You'll set up a Jupyter Notebook that performs the following actions:

> [!div class="checklist"]
> + Load various forms (invoices) into a data frame in an Apache Spark session
> + Analyze them to determine their features
> + Assemble the resulting output into a tabular data structure
> + Write the output to a search index hosted in Azure AI Search
> + Explore and query over the content you created

This tutorial takes a dependency on [SynapseML](https://www.microsoft.com/research/blog/synapseml-a-simple-multilingual-and-massively-parallel-machine-learning-library/), an open source library that supports massively parallel machine learning over big data. In SynapseML, search indexing and machine learning are exposed through *transformers* that perform specialized tasks. Transformers tap into a wide range of AI capabilities. In this exercise, you'll use the **AzureSearchWriter** APIs for analysis and AI enrichment.

Although Azure AI Search has native [AI enrichment](cognitive-search-concept-intro.md), this tutorial shows you how to access AI capabilities outside of Azure AI Search. By using SynapseML instead of indexers or skills, you're not subject to data limits or other constraints associated with those objects.

> [!TIP]
> Watch a short video of this demo at [https://www.youtube.com/watch?v=iXnBLwp7f88](https://www.youtube.com/watch?v=iXnBLwp7f88). The video expands on this tutorial with more steps and visuals.

## Prerequisites

You'll need the `synapseml` library and several Azure resources. If possible, use the same subscription and region for your Azure resources and put everything into one resource group for simple cleanup later. The following links are for portal installs. The sample data is imported from a public site.

+ [SynapseML package](https://microsoft.github.io/SynapseML/docs/Get%20Started/Install%20SynapseML/#python) <sup>1</sup> 
+ [Azure AI Search](search-create-service-portal.md) (any tier) <sup>2</sup> 
+ [Azure AI services](../ai-services/multi-service-resource.md?pivots=azportal) (any tier) <sup>3</sup> 
+ [Azure Databricks](/azure/databricks/scenarios/quickstart-create-databricks-workspace-portal?tabs=azure-portal) (any tier) <sup>4</sup>

<sup>1</sup> This link resolves to a tutorial for loading the package.

<sup>2</sup> You can use the free search tier to index the sample data, but [choose a higher tier](search-sku-tier.md) if your data volumes are large. For non-free tiers, you'll need to provide the [search API key](search-security-api-keys.md#find-existing-keys) in the [Set up dependencies](#2---set-up-dependencies) step further on.

<sup>3</sup> This tutorial uses Azure AI Document Intelligence and Azure AI Translator. In the instructions that follow, you'll provide a [multi-service key](../ai-services/multi-service-resource.md?pivots=azportal#get-the-keys-for-your-resource) and the region, and it will work for both services.

<sup>4</sup> In this tutorial, Azure Databricks provides the Spark computing platform and the instructions in the link will tell you how to set up the workspace. For this tutorial, we used the portal steps in "Create a workspace".

> [!NOTE]
> All of the above Azure resources support security features in the Microsoft Identity platform. For simplicity, this tutorial assumes key-based authentication, using endpoints and keys copied from the portal pages of each service. If you implement this workflow in a production environment, or share the solution with others, remember to replace hard-coded keys with integrated security or encrypted keys.

## 1 - Create a Spark cluster and notebook

In this section, you'll create a cluster, install the `synapseml` library, and create a notebook to run the code.

1. In Azure portal, find your Azure Databricks workspace and select **Launch workspace**.

1. On the left menu, select **Compute**.

1. Select **Create cluster**.

1. Give the cluster a name, accept the default configuration, and then create the cluster. It takes several minutes to create the cluster.

1. Install the `synapseml` library after the cluster is created:

   1. Select **Library** from the tabs at the top of the cluster's page.

   1. Select **Install new**.

      :::image type="content" source="media/search-synapseml-cognitive-services/install-library.png" alt-text="Screenshot of the Install New command." border="true":::

   1. Select **Maven**.

   1. In Coordinates, enter `com.microsoft.azure:synapseml_2.12:0.10.0`

   1. Select **Install**.

      :::image type="content" source="media/search-synapseml-cognitive-services/install-library-from-maven.png" alt-text="Screenshot of Maven package specification." border="true":::

1. On the left menu, select **Create** > **Notebook**.

   :::image type="content" source="media/search-synapseml-cognitive-services/create-notebook.png" alt-text="Screenshot of the Create Notebook command." border="true":::

1. Give the notebook a name, select **Python** as the default language, and select the cluster that has the `synapseml` library.

1. Create seven consecutive cells. You'll paste code into each one.

   :::image type="content" source="media/search-synapseml-cognitive-services/create-seven-cells.png" alt-text="Screenshot of the notebook with placeholder cells." border="true":::

## 2 - Set up dependencies

Paste the following code into the first cell of your notebook. Replace the placeholders with endpoints and access keys for each resource. No other modifications are required, so run the code when you're ready.

This code imports multiple packages and sets up access to the Azure resources used in this workflow.

```python
import os
from pyspark.sql.functions import udf, trim, split, explode, col, monotonically_increasing_id, lit
from pyspark.sql.types import StringType
from synapse.ml.core.spark import FluentAPI

cognitive_services_key = "placeholder-cognitive-services-multi-service-key"
cognitive_services_region = "placeholder-cognitive-services-region"

search_service = "placeholder-search-service-name"
search_key = "placeholder-search-service-api-key"
search_index = "placeholder-search-index-name"
```

## 3 - Load data into Spark

Paste the following code into the second cell. No modifications are required, so run the code when you're ready.

This code loads a few external files from an Azure storage account that's used for demo purposes. The files are various invoices, and they're read into a data frame.

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

## 4 - Add document intelligence

Paste the following code into the third cell. No modifications are required, so run the code when you're ready.

This code loads the [AnalyzeInvoices transformer](https://mmlspark.blob.core.windows.net/docs/0.11.2/pyspark/synapse.ml.cognitive.form.html#module-synapse.ml.cognitive.form.AnalyzeInvoices) and passes a reference to the data frame containing the invoices. It calls the pre-built [invoice model](../ai-services/document-intelligence/concept-invoice.md) of Azure AI Document Intelligence to extract information from the invoices.

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

The output from this step should look similar to the next screenshot. Notice how the forms analysis is packed into a densely structured column, which is difficult to work with. The next transformation resolves this issue by parsing the column into rows and columns.

:::image type="content" source="media/search-synapseml-cognitive-services/analyze-forms-output.png" alt-text="Screenshot of the AnalyzeInvoices output." border="true":::

## 5 - Restructure document intelligence output

Paste the following code into the fourth cell and run it. No modifications are required.

This code loads [FormOntologyLearner](https://mmlspark.blob.core.windows.net/docs/0.10.0/pyspark/synapse.ml.cognitive.html#module-synapse.ml.cognitive.FormOntologyTransformer), a transformer that analyzes the output of Document Intelligence transformers and infers a tabular data structure. The output of AnalyzeInvoices is dynamic and varies based on the features detected in your content. Furthermore, the transformer consolidates output into a single column. Because the output is dynamic and consolidated, it's difficult to use in downstream transformations that require more structure.

FormOntologyLearner extends the utility of the AnalyzeInvoices transformer by looking for patterns that can be used to create a tabular data structure. Organizing the output into multiple columns and rows makes the content consumable in other transformers, like AzureSearchWriter.

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

Notice how this transformation recasts the nested fields into a table, which enables the next two transformations. This screenshot is trimmed for brevity. If you're following along in your own notebook, you'll have 19 columns and 26 rows.

:::image type="content" source="media/search-synapseml-cognitive-services/form-ontology-learner-output.png" alt-text="Screenshot of the FormOntologyLearner output." border="true":::

## 6 - Add translations

Paste the following code into the fifth cell. No modifications are required, so run the code when you're ready.

This code loads [Translate](https://microsoft.github.io/SynapseML/docs/Explore%20Algorithms/AI%20Services/Overview/#translator-sample), a transformer that calls the Azure AI Translator service in Azure AI services. The original text, which is in English in the "Description" column, is machine-translated into various languages. All of the output is consolidated into "output.translations" array.

```python
from synapse.ml.cognitive import Translate

translated_df = (Translate()
    .setSubscriptionKey(cognitive_services_key)
    .setLocation(cognitive_services_region)
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

> [!TIP]
> To check for translated strings, scroll to the end of the rows.
> 
> :::image type="content" source="media/search-synapseml-cognitive-services/translated-strings.png" alt-text="Screenshot of table output, showing the Translations column." border="true":::

## 7 - Add a search index with AzureSearchWriter

Paste the following code in the sixth cell and then run it. No modifications are required.

This code loads [AzureSearchWriter](https://microsoft.github.io/SynapseML/docs/Explore%20Algorithms/AI%20Services/Overview/#azure-cognitive-search-sample). It consumes a tabular dataset and infers a search index schema that defines one field for each column. The translations structure is an array, so it's articulated in the index as a complex collection with subfields for each language translation. The generated index will have a document key and use the default values for fields created using the [Create Index REST API](/rest/api/searchservice/create-index).

```python
from synapse.ml.cognitive import *

(translated_df.withColumn("DocID", monotonically_increasing_id().cast("string"))
    .withColumn("SearchAction", lit("upload"))
    .writeToAzureSearch(
        subscriptionKey=search_key,
        actionCol="SearchAction",
        serviceName=search_service,
        indexName=search_index,
        keyCol="DocID",
    ))
```

You can check the search service pages in Azure portal to explore the index definition created by AzureSearchWriter.

> [!NOTE]
> If you can't use default search index, you can provide an external custom definition in JSON, passing its URI as a string in the "indexJson" property. Generate the default index first so that you know which fields to specify, and then follow with customized properties if you need specific analyzers, for example.

## 8 - Query the index

Paste the following code into the seventh cell and then run it. No modifications are required, except that you might want to vary the syntax or try more examples to further explore your content:

+ [Query syntax](query-simple-syntax.md)
+ [Query examples](search-query-simple-examples.md)

There's no transformer or module that issues queries. This cell is a simple call to the [Search Documents REST API](/rest/api/searchservice/search-documents). 

This particular example is searching for the word "door" (`"search": "door"`). It also returns a "count" of the number of matching documents, and selects just the contents of the "Description' and "Translations" fields for the results. If you want to see the full list of fields, remove the "select" parameter.

```python
import requests

url = "https://{}.search.windows.net/indexes/{}/docs/search?api-version=2020-06-30".format(search_service, search_index)
requests.post(url, json={"search": "door", "count": "true", "select": "Description, Translations"}, headers={"api-key": search_key}).json()
```

The following screenshot shows the cell output for sample script.

:::image type="content" source="media/search-synapseml-cognitive-services/query-results.png" alt-text="Screenshot of query results showing the count, search string, and return fields." border="true":::

## Clean up resources

When you're working in your own subscription, at the end of a project, it's a good idea to remove the resources that you no longer need. Resources left running can cost you money. You can delete resources individually or delete the resource group to delete the entire set of resources.

You can find and manage resources in the portal, using the **All resources** or **Resource groups** link in the left-navigation pane.

## Next steps

In this tutorial, you learned about the [AzureSearchWriter](https://microsoft.github.io/SynapseML/docs/Explore%20Algorithms/AI%20Services/Overview/#azure-cognitive-search-sample) transformer in SynapseML, which is a new way of creating and loading search indexes in Azure AI Search. The transformer takes structured JSON as an input. The FormOntologyLearner can provide the necessary structure for output produced by the Document Intelligence transformers in SynapseML.

As a next step, review the other SynapseML tutorials that produce transformed content you might want to explore through Azure AI Search:

> [!div class="nextstepaction"]
> [Tutorial: Text Analytics with Azure AI services](../synapse-analytics/machine-learning/tutorial-text-analytics-use-mmlspark.md)
