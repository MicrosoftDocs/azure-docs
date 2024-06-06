---
title: Create in-database embeddings with azure_local_ai extension
description: Enable RAG patterns with in-database embeddings and vectors on Azure Database for PostgreSQL - Flexible Server.
author: jojohnso-msft
ms.author: jojohnso
ms.reviewer: maghan
ms.date: 05/28/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: overview
ms.custom:
  - build-2024
# customer intent: As a user, I want to understand the overview and use cases of the azure_local_ai extension for Azure Database for PostgreSQL - Flexible Server.
---

# What is the azure_local_ai extension for Azure Database for PostgreSQL - Flexible Server (Preview)

The azure_local_ai extension for Azure Database for PostgreSQL flexible server allows you to use registered, pretrained, open-source models deployed locally to your Azure Database for PostgreSQL server. These models can be used to create text embeddings that can provide context to your Retrieval Augmented Generation (RAG) pattern as you build rich generative AI applications.  The azure_local_ai extension enables the database to call locally deployed models to create vector embeddings from text data, simplifying the development process and reducing latency by removing the need to make more remote API calls to AI embedding models hosted outside of the PostgreSQL boundary. In this release, the extension deploys a single model, [multilingual-e5-small](https://huggingface.co/intfloat/multilingual-e5-small), to your Azure Database for PostgreSQL Flexible Server instance. Other third-party open-source models might become available for installation on an ongoing basis.

Local embeddings help customers:

- Reduce latency of embedding creation.

- Use embedding models at a predictable cost.

- Keep data within their database eliminating the need to transmit data to a remote endpoint.

> [!IMPORTANT]
> The azure_local_ai extension is currently in preview. Microsoft's Open-source AI models for installation through the Azure Local AI extension are deemed Non-Microsoft Products under the Microsoft Product Terms. The customer's use of open-source AI models is governed by the separate license terms provided in product documentation associated with such models made available through the azure_local_ai extension. [Supplemental Terms of Use: Limited Access AI Services (Previews)](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)
## Enable the `azure_local_ai` extension (preview)

Before you can enable azure_local_ai on your Azure Database for PostgreSQL flexible server instance, you need to add it to your allowlist as described in [how to use PostgreSQL extensions](concepts-extensions.md) and check that it was correctly added by running the following SQL statement, `SHOW azure.extensions;`.

> [!IMPORTANT]
> Hosting language models in the database requires a large memory footprint. To support this requirement, azure_local_ai is only supported on **memory-optimized** Azure VM SKUs with a minimum of **4 vCores**. Today, if you are using a VM that does not meet the minimum requirements, the azure_local_ai extension will not appear in the list of available extensions in **Server parameters**.
Select **Server parameters** from the Settings section of the Resource Menu in the Azure Database for PostgreSQL Flexible Server Azure portal page.

:::image type="content" source="media/azure-local-ai/pgsql-server-parameters-2.png" alt-text="Screenshot of PostgreSQL server parameters page.":::

Search for "extensions" or "azure.extensions"

:::image type="content" source="media/azure-local-ai/extensions-allow-list-1.png" alt-text="Screenshot of Extensions available to allowlist for Azure Database for Postgresql - Flexible server." lightbox="media/azure-local-ai/extensions-allow-list-1.png":::

Select AZURE_LOCAL_AI from the extensions list.

:::image type="content" source="media/azure-local-ai/extensions-allow-list-2.png" alt-text="Screenshot of Extensions allowlist screenshot for Azure Local AI extension." lightbox="media/azure-local-ai/extensions-allow-list-2.png":::

Select **Save** to apply the changes and begin the allowlist deployment process.

:::image type="content" source="media/azure-local-ai/extensions-allow-list-3.png" alt-text="Screenshot of Extensions saved to allowlist for Azure Local AI extension." lightbox="media/azure-local-ai/extensions-allow-list-3.png":::

You can monitor this deployment via the bell icon at the top of the Azure portal.

:::image type="content" source="media/azure-local-ai/extensions-allow-list-4.png" alt-text="Screenshot of Extensions allowlist deployment status for Azure Local AI extension.":::

Once the allowlist deployment is completed, you can continue with the installation process.

> [!NOTE]  
> Enabling Azure Local AI preview will deploy the [multilingual-e5-small](https://huggingface.co/intfloat/multilingual-e5-small) model to your Azure Database for PostgreSQL Flexible Server instance. The linked documentation provides licensing terms from the e5 team.
> Additional third-party open-source models might become available for installation on an ongoing basis.

Now you can install the extension by connecting to your target database and running the [CREATE EXTENSION](https://www.postgresql.org/docs/current/sql-createextension.html) command. You need to repeat the command separately for every database in which you want the extension to be available.

List extensions are allowed on the database from the Azure portal - Server Parameters page.

```sql
SHOW azure.extensions;
```

Create the extension within the database.

```sql
CREATE EXTENSION azure_local_ai;
```

Installing the extension azure_local_ai creates the following schema:

-  azure_local_ai: principal schema in which the extension creates tables, functions, and any other SQL-related object it requires to implement and expose its functionality.

> [!IMPORTANT]  
> You want to enable the [vector extension](how-to-use-pgvector.md)__,__ as it is required to store text embeddings in your PostgreSQL database.

## Functions provided by the azure_local_ai extension

The azure_local_ai extension provides a set of functions. These functions allow you to create vector embeddings from text data, making it easier to develop generative AI applications. The extension offers functions for creating embeddings, getting settings, and more. By using these functions, you can simplify the development process and reduce latency by eliminating the need for additional remote API calls to AI embedding models hosted outside of the PostgreSQL boundary.

|  Schema  |  Name  |  Result data type  |  Argument data types  |  
|---|---|---|---|
| `azure_local_ai`  |  create_embeddings  |  TABLE(embedding real[])  |  model_uri text, inputs text[],   batch_size bigint DEFAULT 128, timeout_ms integer DEFAULT 3600000  |  
| `azure_local_ai`  |  create_embeddings  |  real[]  |  model_uri text, input text,   timeout_ms integer DEFAULT 3600000  |  
| `azure_local_ai`  |  get_setting  |  jsonb  |  keys text[] DEFAULT   ARRAY[]::text[], timeout_ms integer DEFAULT 3600000  |  
| `azure_local_ai`  |  get_setting  |  text  |  key text, timeout_ms integer   DEFAULT 3600000  |  
| `azure_local_ai`  |  model_metadata  |  jsonb  |  model_uri text  |  

These can be displayed via the PSQL command,

```psql
\df azure_local_ai.*
```

## `azure_local_ai.create_embeddings`

The azure_local_ai extension allows you to create and update embeddings both in scalar and batch format, invoking the locally deployed LLM.

```sql
azure_local_ai.create_embeddings(model_uri text, input text, batch_size bigint DEFAULT 128, timeout_ms integer DEFAULT 3600000);
```
```sql
azure_local_ai.create_embeddings(model_uri text, array[inputs [text]], batch_size bigint DEFAULT 128, timeout_ms integer DEFAULT 3600000);
```

### Arguments

#### `model_uri`

`text` name of the text embedding model invoked to create the embedding.

#### `input`

`text` or `text[]` single text or array of texts, depending on the overload of the function used, for which embeddings are created.

#### `batch_size`

`bigint DEFAULT 128` number of records to process at a time (only available for the overload of the function for which parameter `input` is of type `text[]`).

#### `timeout_ms`

`integer DEFAULT 3600000` timeout in milliseconds after which the operation is stopped.


Simple create embeddings examples: 

```sql
SELECT azure_local_ai.create_embeddings('model_uri TEXT', 'query: input TEXT');
```

```sql
SELECT azure_local_ai.create_embeddings('multilingual-e5-small:v1', 'query: Vector databases are awesome');
```

```sql
SELECT azure_local_ai.create_embeddings('model_uri TEXT', array['input TEXT', 'input TEXT']);
```

```sql
SELECT azure_local_ai.create_embeddings('multilingual-e5-small:v1', array['Hello', 'World']);
```

#### Check the azure_local_ai extension version

```sql
SELECT * FROM pg_available_extensions
WHERE NAME ='azure_local_ai';
```

## ONNX Runtime Configuration

###  `azure_local_ai.get_setting`
Used to obtain current values of configuration options.

```sql
SELECT azure_local_ai.get_setting(key TEXT)
```

azure_local_ai supports reviewing the configuration parameters of ONNX Runtime thread-pool within the ONNX Runtime Service. Changes are not allowed at this time. [See ONNX Runtime performance tuning.](https://onnxruntime.ai/docs/performance/tune-performance/threading.html)


#### Arguments

##### Key

Valid values for the `key` are:

- `intra_op_parallelism`: Sets total number of threads used for parallelizing single operator by ONNX Runtime thread-pool. By default, we maximize the number of intra ops threads as much as possible as it improves the overall throughput much (all available cpus by default).
- `inter_op_parallelism`: Sets total number of threads used for computing multiple operators in parallel by ONNX Runtime thread-pool. By default, we set it to minimum possible thread, which is 1. Increasing it often hurts performance due to frequent context switches between threads.
- `spin_control`: Switches ONNX Runtime thread-pool's spinning for requests. When disabled, it uses less cpu and hence causes more latency. By default, it is set to true (enabled).

#### Return type
`TEXT` representing the current value of the selected setting.



## Related content
- [Concepts: Generate vector embeddings with azure_local_ai on Azure Database for PostgreSQL Flexible Server (Preview)](generative-ai-azure-local-ai.md)
- [How to enable and use `pgvector` on Azure Database for PostgreSQL - Flexible Server](how-to-use-pgvector.md)