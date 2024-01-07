---
title: Integrate Azure AI capabilities into Azure Database for PostgreSQL Flexible Server -Preview
description: Integrate Azure AI capabilities into Azure Database for PostgreSQL Flexible Server -Preview
author: denzilribeiro
ms.author: denzilr
ms.reviewer: maghan, carols
ms.date: 11/07/2023
ms.service: postgresql
ms.subservice: flexible-server
ms.custom:
  - ignite-2023
ms.topic: how-to
---

# Integrate Azure AI capabilities into Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

The `azure_ai` extension adds the ability to use [large language models](/training/modules/fundamentals-generative-ai/3-language%20models) (LLMs) and build [generative AI](/training/paths/introduction-generative-ai/) applications within an Azure Database for PostgreSQL Flexible Server database by integrating the power of [Azure AI services](/azure/ai-services/what-are-ai-services). Generative AI is a form of artificial intelligence in which LLMs are trained to generate original content based on natural language input. Using the `azure_ai` extension allows you to use generative AI's natural language query processing capabilities directly from the database.

This tutorial showcases adding rich AI capabilities to an Azure Database for PostgreSQL Flexible Server using the `azure_ai` extension. It covers integrating both [Azure OpenAI](/azure/ai-services/openai/overview) and the [Azure AI Language service](/azure/ai-services/language-service/) into your database using the extension.

## Prerequisites

   - An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services?azure-portal=true).

   - Access granted to Azure OpenAI in the desired Azure subscription. Currently, access to this service is granted by the application. You can apply for access to Azure OpenAI by completing the form at <https://aka.ms/oai/access>.

   - An Azure OpenAI resource with the `text-embedding-ada-002` (Version 2) model deployed. This model is currently only available in [certain regions](/azure/ai-services/openai/concepts/models#model-summary-table-and-region-availability). If you don't have a resource, the process for creating one is documented in the [Azure OpenAI resource deployment guide](/azure/ai-services/openai/how-to/create-resource).

   - An [Azure AI Language](/azure/ai-services/language-service/overview) service. If you don't have a resource, you can [create a Language resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics) in the Azure portal by following the instructions provided in the [quickstart for summarization](/azure/ai-services/language-service/summarization/custom/quickstart#create-a-new-resource-from-the-azure-portal) document. You can use the free pricing tier (`Free F0`) to try the service and upgrade later to a paid tier for production.

   - An Azure Database for PostgreSQL Flexible Server instance in your Azure subscription. If you don't have a resource, use either the [Azure portal](/azure/postgresql/flexible-server/quickstart-create-server-portal) or the [Azure CLI](/azure/postgresql/flexible-server/quickstart-create-server-cli) guide for creating one.

## Connect to the database using `psql` in the Azure Cloud Shell

Open the [Azure Cloud Shell](https://shell.azure.com/) in a web browser. Select **Bash** as the environment and, if prompted, select the subscription you used for your Azure Database for PostgreSQL Flexible Server database, then select **Create storage**.

To retrieve the database connection details:

1. Navigate to your Azure Database for PostgreSQL Flexible Server resource in the [Azure portal](https://portal.azure.com/).

1. From the left-hand navigation menu, select **Connect** under **Settings** and copy the **Connection details** block.

1. Paste the copied environment variable declaration lines into the Azure Cloud Shell terminal you opened above, replacing the `{your-password}` token with the password you set when creating the database.

    ```bash
    export PGHOST={your-server-name}.postgresql.database.azure.com
    export PGUSER={your-user-name}
    export PGPORT=5432
    export PGDATABASE={your-database-name}
    export PGPASSWORD="{your-password}"
    ```
    
    Add one extra environment variable to require an SSL connection to the database.
    
    ```bash
    export PGSSLMODE=require
    ```
    
    Connect to your database using the [psql command-line utility](https://www.postgresguide.com/utilities/psql/) by entering the following at the prompt.
    
    ```bash
    psql
    ```

## Install the `azure_ai` extension

[Azure AI extension and Open AI](generative-ai-azure-openai.md)

The `azure_ai` extension allows you to integrate Azure OpenAI and Azure Cognitive Services into your database. To enable the extension in your database, follow the steps below:

1. Add the extension to your allowlist as described in [how to use PostgreSQL extensions](/azure/postgresql/flexible-server/concepts-extensions#how-to-use-postgresql-extensions).

1. Verify that the extension was successfully added to the allowlist by running the following from the `psql` command prompt:

    ```sql
    SHOW azure.extensions;
    ```

1. Install the `azure_ai` extension using the [CREATE EXTENSION](https://www.postgresql.org/docs/current/sql-createextension.html) command.

    ```sql
    CREATE EXTENSION azure_ai;
    ```

## Inspect the objects contained within the `azure_ai` extension

Reviewing the objects contained within the `azure_ai` extension can provide a better understanding of the capabilities it offers. You can use the [`\dx` meta-command](https://www.postgresql.org/docs/current/app-psql.html#APP-PSQL-META-COMMAND-DX-LC) from the `psql` command prompt to list the objects contained within the extension.

```psql
\dx+ azure_ai
```

The meta-command output shows that the `azure_ai` extension creates three schemas, multiple user-defined functions (UDFs), and several composite types in the database. The table below lists the schemas added by the extension and describes each.

| Schema | Description |
| --- | --- |
| `azure_ai` | The principal schema where the configuration table and UDFs for interacting with it reside. |
| `azure_openai` | Contains the UDFs that enable calling an Azure OpenAI endpoint. |
| `azure_cognitive` | Provides UDFs and composite types related to integrating the database with Azure Cognitive Services. |

The functions and types are all associated with one of the schemas. To review the functions defined in the `azure_ai` schema, use the `\df` meta-command, specifying the schema whose functions should be displayed. The `\x` commands before and after the `\df` command toggle the expanded display on and off to make the output from the command easier to view in the Azure Cloud Shell.

```sql
\x
\df+ azure_ai.*
\x
```

The `azure_ai.set_setting()` function lets you set the endpoint and critical values for Azure AI services. It accepts a **key** and the **value** to assign it. The `azure_ai.get_setting()` function provides a way to retrieve the values you set with the `set_setting()` function. It accepts the **key** of the setting you want to view. For both methods, the key must be one of the following:

| Key | Description |
| --- | --- |
| `azure_openai.endpoint` | A supported OpenAI endpoint (for example, `https://example.openai.azure.com`). |
| `azure_openai.subscription_key` | A subscription key for an OpenAI resource. |
| `azure_cognitive.endpoint` | A supported Cognitive Services endpoint (for example, `https://example.cognitiveservices.azure.com`). |
| `azure_cognitive.subscription_key` | A subscription key for a Cognitive Services resource. |

> [!IMPORTANT]
>  
> Because the connection information for Azure AI services, including API keys, is stored in a configuration table in the database, the `azure_ai` extension defines a role called `azure_ai_settings_manager` to ensure this information is protected and accessible only to users assigned that role. This role enables reading and writing of settings related to the extension. Only superusers and members of the `azure_ai_settings_manager` role can invoke the `azure_ai.get_setting()` and `azure_ai.set_setting()` functions. In the Azure Database for PostgreSQL Flexible Server, all admin users are assigned the `azure_ai_settings_manager` role.

## Generate vector embeddings with Azure OpenAI

The `azure_ai` extension's `azure_openai` schema enables the use of Azure OpenAI for creating vector embeddings for text values. Using this schema, you can [generate embeddings with Azure OpenAI](/azure/ai-services/openai/how-to/embeddings) directly from the database to create vector representations of input text, which can then be used in vector similarity searches, and consumed by machine learning models.

Embeddings are a technique of using machine learning models to evaluate how closely related information is. This technique allows for efficient identification of relationships and similarities between data, allowing algorithms to identify patterns and make accurate predictions.

### Set the Azure OpenAI endpoint and key

Before using the `azure_openai` functions:

1. Configure the extension with your Azure OpenAI service endpoint and key.

1. Navigate to your Azure OpenAI resource in the Azure portal and select the **Keys and Endpoint** item under **Resource Management** from the left-hand menu.

1. Copy your endpoint and access key. You can use either `KEY1` or `KEY2`. Always having two keys allows you to securely rotate and regenerate keys without causing service disruption.

In the command below, replace the `{endpoint}` and `{api-key}` tokens with values you retrieved from the Azure portal, then run the commands from the `psql` command prompt to add your values to the configuration table.

```sql
SELECT azure_ai.set_setting('azure_openai.endpoint','{endpoint}');
SELECT azure_ai.set_setting('azure_openai.subscription_key', '{api-key}');
```

Verify the settings written in the configuration table:

```sql
SELECT azure_ai.get_setting('azure_openai.endpoint');
SELECT azure_ai.get_setting('azure_openai.subscription_key');
```

The `azure_ai` extension is now connected to your Azure OpenAI account and ready to generate vector embeddings.

### Populate the database with sample data

This tutorial uses a small subset of the [BillSum dataset](https://github.com/FiscalNote/BillSum), which provides a list of United States Congressional and California state bills, to provide sample text data for generating vectors. The `bill_sum_data.csv` file containing these data can be downloaded from the [Azure Samples GitHub repo](https://github.com/Azure-Samples/Azure-OpenAI-Docs-Samples/blob/main/Samples/Tutorials/Embeddings/data/bill_sum_data.csv).

To host the sample data in the database, create a table named `bill_summaries`.

```sql
CREATE TABLE bill_summaries
(
    id bigint PRIMARY KEY,
    bill_id text,
    bill_text text,
    summary text,
    title text,
    text_len bigint,
    sum_len bigint
);
```

Using the PostgreSQL [COPY command](https://www.postgresql.org/docs/current/sql-copy.html) from the `psql` command prompt, load the sample data from the CSV into the `bill_summaries` table, specifying that the first row of the CSV file is a header row.

```sql
\COPY bill_summaries (id, bill_id, bill_text, summary, title, text_len, sum_len) FROM PROGRAM 'curl "https://raw.githubusercontent.com/Azure-Samples/Azure-OpenAI-Docs-Samples/main/Samples/Tutorials/Embeddings/data/bill_sum_data.csv"' WITH CSV HEADER ENCODING 'UTF8'
```

### Enable vector support

The `azure_ai` extension allows you to generate embeddings for input text. To enable the generated vectors to be stored alongside the rest of your data in the database, you must install the `pg_vector` extension by following the guidance in the [enable vector support in your database](/azure/postgresql/flexible-server/how-to-use-pgvector#enable-extension) documentation.

With vector supported added to your database, add a new column to the `bill_summaries` table using the `vector` data type to store embeddings within the table. The `text-embedding-ada-002` model produces vectors with 1536 dimensions, so you must specify `1536` as the vector size.

```sql
ALTER TABLE bill_summaries
ADD COLUMN bill_vector vector(1536);
```

### Generate and store vectors

The `bill_summaries` table is now ready to store embeddings. Using the `azure_openai.create_embeddings()` function, you create vectors for the `bill_text` field and insert them into the newly created `bill_vector` column in the `bill_summaries` table.

Before using the `create_embeddings()` function, run the following command to inspect it and review the required arguments:

```sql
\x
\df+ azure_openai.*
\x
```

The `Argument data types` property in the output of the `\df+ azure_openai.*` command reveals the list of arguments the function expects.

| Argument | Type | Default | Description |
| --- | --- | --- | --- |
| deployment_name | `text` | | Name of the deployment in Azure OpenAI studio that contains the `text-embeddings-ada-002` model. |
| input | `text` | | Input text used to create embeddings. |
| timeout_ms | `integer` | 3600000 | Timeout in milliseconds after which the operation is stopped. |
| throw_on_error | `boolean` | true | Flag indicating whether the function should, on error, throw an exception resulting in a rollback of the wrapping transactions. |

The first argument is the `deployment_name`, assigned when your embedding model was deployed in your Azure OpenAI account. To retrieve this value, go to your Azure OpenAI resource in the Azure portal. From there, select the **Model deployments** item under **Resource Management** in the left-hand navigation menu, then select **Manage Deployments** to open Azure OpenAI Studio. On the **Deployments** tab in Azure OpenAI Studio, copy the **Deployment name** value associated with the `text-embedding-ada-002` model deployment.

:::image type="content" source="media/how-to-integrate-azure-ai/azure-open-ai-studio-deployments-embeddings.png" alt-text="Screenshot of embedding deployments for integrating AI.":::

Using this information, run a query to update each record in the `bill_summaries` table, inserting the generated vector embeddings for the `bill_text` field into the `bill_vector` column using the `azure_openai.create_embeddings()` function. Replace `{your-deployment-name}` with the **Deployment name** value you copied from the Azure OpenAI Studio **Deployments** page, and then run the following command:

```sql
UPDATE bill_summaries b
SET bill_vector = azure_openai.create_embeddings('{your-deployment-name}', b.bill_text);
```

Execute the following query to view the embedding generated for the first record in the table. You can run `\x` first if the output is difficult to read.

```sql
SELECT bill_vector FROM bill_summaries LIMIT 1;
```

Each embedding is a vector of floating point numbers, such that the distance between two embeddings in the vector space is correlated with semantic similarity between two inputs in the original format.

### Perform a vector similarity search

Vector similarity is a method used to measure how similar two items are by representing them as vectors, which are series of numbers. Vectors are often used to perform searches using LLMs. Vector similarity is commonly calculated using distance metrics, such as Euclidean distance or cosine similarity. Euclidean distance measures the straight-line distance between two vectors in the n-dimensional space, while cosine similarity measures the cosine of the angle between two vectors.

To enable more efficient searching over the `vector` field by creating an index on `bill_summaries` using cosine distance and [HNSW](https://github.com/pgvector/pgvector#hnsw), which is short for Hierarchical Navigable Small World. HNSW allows `pg_vector` to use the latest graph-based algorithms to approximate nearest-neighbor queries.

```sql
CREATE INDEX ON bill_summaries USING hnsw (bill_vector vector_cosine_ops);
```

With everything now in place, you're now ready to execute a [cosine similarity](/azure/ai-services/openai/concepts/understand-embeddings#cosine-similarity) search query against the database.

In the query below, the embeddings are generated for an input question and then cast to a vector array (`::vector`), which allows it to be compared against the vectors stored in the `bill_summaries` table.

```sql
SELECT bill_id, title FROM bill_summaries
ORDER BY bill_vector <=> azure_openai.create_embeddings('embeddings', 'Show me bills relating to veterans entrepreneurship.')::vector
LIMIT 3;
```

The query uses the `<=>` [vector operator](https://github.com/pgvector/pgvector#vector-operators), which represents the "cosine distance" operator used to calculate the distance between two vectors in a multi-dimensional space.

## Integrate Azure Cognitive Services

The Azure AI services integrations included in the `azure_cognitive` schema of the `azure_ai` extension provide a rich set of AI Language features accessible directly from the database. The functionalities include sentiment analysis, language detection, key phrase extraction, entity recognition, and text summarization. Access to these capabilities is enabled through the [Azure AI Language service](/azure/ai-services/language-service/overview).

To review the complete Azure AI capabilities accessible through the extension, view the [Integrate Azure Database for PostgreSQL Flexible Server with Azure Cognitive Services](generative-ai-azure-cognitive.md).

### Set the Azure AI Language service endpoint and key

As with the `azure_openai` functions, to successfully make calls against Azure AI services using the `azure_ai` extension, you must provide the endpoint and a key for your Azure AI Language service. Retrieve those values by navigating to your Language service resource in the Azure portal and selecting the **Keys and Endpoint** item under **Resource Management** from the left-hand menu. Copy your endpoint and access key. You can use either `KEY1` or `KEY2`.

In the command below, replace the `{endpoint}` and `{api-key}` tokens with values you retrieved from the Azure portal, then run the commands from the `psql` command prompt to add your values to the configuration table.

```sql
SELECT azure_ai.set_setting('azure_cognitive.endpoint','{endpoint}');
SELECT azure_ai.set_setting('azure_cognitive.subscription_key', '{api-key}');
```

### Summarize bills

To demonstrate some of the capabilities of the `azure_cognitive` functions of the `azure_ai` extension, you generate a summary of each bill. The `azure_cognitive` schema provides two functions for summarizing text, `summarize_abstractive` and `summarize_extractive`. Abstractive summarization produces a summary that captures the main concepts from input text but might not use identical words. Extractive summarization assembles a summary by extracting critical sentences from the input text.

To use the Azure AI Language service's ability to generate new, original content, you use the `summarize_abstractive` function to create a summary of text input. Use the `\df` meta-command from `psql` again, this time to look specifically at the `azure_cognitive.summarize_abstractive` function.

```sql
\x
\df azure_cognitive.summarize_abstractive
\x
```

The `Argument data types` property in the output of the `\df azure_cognitive.summarize_abstractive` command reveals the list of arguments the function expects.

| Argument | Type | Default | Description |
| --- | --- | --- | --- |
| text | `text` | | The input text to summarize. |
| language | `text` | | A two-letter ISO 639-1 representation of the language in which the input text is written. Check [language support](../../ai-services/language-service/concepts/language-support.md) for allowed values. |
| timeout_ms | `integer` | 3600000 | Timeout in milliseconds after which the operation is stopped. |
| throw_on_error | `boolean` | true | Flag indicating whether the function should, on error, throw an exception resulting in a rollback of the wrapping transactions. |
| sentence_count | `integer` | 3 | The maximum number of sentences to include in the generated summary. |
| disable_service_logs | `boolean` | false | The Language service logs your input text for 48 hours solely to allow for troubleshooting issues. Setting this property to `true` disables input logging and might limit our ability to investigate issues that occur. For more information, see Cognitive Services Compliance and Privacy notes at <https://aka.ms/cs-compliance> and Microsoft Responsible AI principles at <https://www.microsoft.com/ai/responsible-ai>. |

The `summarize_abstractive` function, including its required arguments, looks like the following:

```sql
azure_cognitive.summarize_abstractive(text TEXT, language TEXT)
```

The following query against the `bill_summaries` table uses the `summarize_abstractive` function to generate a new one-sentence summary for the text of a bill, allowing you to incorporate the power of generative AI directly into your queries.

```sql
SELECT
    bill_id,
    azure_cognitive.summarize_abstractive(bill_text, 'en', sentence_count => 1) one_sentence_summary
FROM bill_summaries
WHERE bill_id = '112_hr2873';
```

The function can also be used to write data into your database tables. Modify the `bill_summaries` table to add a new column for storing the one-sentence summaries in the database.

```sql
ALTER TABLE bill_summaries
ADD COLUMN one_sentence_summary text;
```

Next, update the table with the summaries. The `summarize_abstractive` function returns an array of text (`text[]`). The `array_to_string` function converts the return value to its string representation. In the query below, the `throw_on_error` argument has been set to `false`. This setting allows the summarization process to continue if an error occurs.

```sql
UPDATE bill_summaries b
SET one_sentence_summary = array_to_string(azure_cognitive.summarize_abstractive(b.bill_text, 'en', throw_on_error => false, sentence_count => 1), ' ', '')
where one_sentence_summary is NULL;
```

In the output, you might notice a warning about an invalid document for which an appropriate summarization couldn't be generated. This warning results from setting `throw_on_error` to `false` in the above query. If that flag were left to the default of `true`, the query fails, and no summaries would have been written to the database. To view the record that threw the warning, execute the following:

```sql
SELECT bill_id, one_sentence_summary FROM bill_summaries WHERE one_sentence_summary is NULL;

You can then query the `bill_summaries` table to view the new, one-sentence summaries generated by the `azure_ai` extension for the other records in the table.

```sql
SELECT bill_id, one_sentence_summary FROM bill_summaries LIMIT 5;
```

## Conclusion

Congratulations, you just learned how to use the `azure_ai` extension to integrate large language models and generative AI capabilities into your database.

## Related content

- [How to use PostgreSQL extensions in Azure Database for PostgreSQL Flexible Server](/azure/postgresql/flexible-server/concepts-extensions)
- [Learn how to generate embeddings with Azure OpenAI](/azure/ai-services/openai/how-to/embeddings)
- [Azure OpenAI Service embeddings models](/azure/ai-services/openai/concepts/models#embeddings-models-1)
- [Understand embeddings in Azure OpenAI Service](/azure/ai-services/openai/concepts/understand-embeddings)
- [What is Azure AI Language?](/azure/ai-services/language-service/overview)
- [What is Azure OpenAI Service?](/azure/ai-services/openai/overview)
