---
# Required metadata
# For more information, see https://review.learn.microsoft.com/en-us/help/platform/learn-editor-add-metadata?branch=main
# For valid values of ms.service, ms.prod, and ms.topic, see https://review.learn.microsoft.com/en-us/help/platform/metadata-taxonomies?branch=main

title: Generate vector embeddings in PostgreSQL with the azure_local_ai extension
description: Generate text embeddings in PostgreSQL for retrieval augmented generation (RAG) patterns with the azure_local_ai extension and locally deployed LLM.
author:      jojohnso-msft # GitHub alias
ms.author: jojohnso
ms.service: postgresql
ms.topic: how-to
ms.date: 05/20/2024
ms.subservice: flexible-server
ms.custom:
  - build-2024
---

# Generate vector embeddings with azure_local_ai on Azure Database for PostgreSQL Flexible Server (preview)

## Prerequisites

1. An Azure Database for PostgreSQL Flexible Server instance running on a memory optimized VM SKU. Learn more about Azure memory optimized VMs here: [Azure VM sizes - Memory - Azure Virtual Machines](/azure/virtual-machines/sizes-memory)

1. Enable the following extensions,

   1. __[vector](/azure/postgresql/flexible-server/how-to-use-pgvector)__ 
      
   1. azure_local_ai
      
      
For more information on enabling extensions in Azure Database for PostgreSQL – Flexible Server, see [How to enable extensions in Azure Database for PostgreSQL](/azure/postgresql/flexible-server/concepts-extensions).


> [!NOTE]  
> Enabling Azure Local AI preview will deploy the [multilingual-e5-small](https://huggingface.co/intfloat/multilingual-e5-small) model to your Azure Database for PostgreSQL Flexible Server instance. The linked documentation provides licensing terms from the e5 team.
> Additional third-party open-source models might become available for installation on an ongoing basis.

## Functions provided by the azure_local_ai extension

The **azure_local_ai extension** provides a set of functions. These functions allow you to create vector embeddings from text data, making it easier to develop generative AI applications. The extension offers functions for creating embeddings, getting settings, and more. By using these functions, you can simplify the development process and reduce latency by eliminating the need for additional remote API calls to AI embedding models hosted outside of the PostgreSQL boundary.

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


### Use azure_local_ai and the locally deployed multilingual-e5-small model to create embeddings and store them as vectors

Below are examples that can be used in your own environment to test embedding generation with the locally deployed multilingual-e5 model. 

```sql
--Create docs table
CREATE TABLE docs(doc_id int generated always as identity primary key, doc text not null, embedding float4[], last_update timestamptz default now());

--Insert data into the docs table
INSERT INTO docs(doc) VALUES ('Create in-database embeddings with azure_local_ai extension.'),
                             ('Enable RAG patterns with in-database embeddings and vectors on Azure Database for PostgreSQL - Flexible server.'),
                             ('Generate vector embeddings in PostgreSQL with azure_local_ai extension.'),
                             ('Generate text embeddings in PostgreSQL for retrieval augmented generation (RAG) patterns with azure_local_ai extension and locally deployed LLM.'),
                             ('Use vector indexes and Azure OpenAI embeddings in PostgreSQL for retrieval augmented generation.');


-- Add a vector column and generate vector embeddings from locally deployed model
ALTER TABLE docs
ADD COLUMN doc_vector vector(384) -- multilingual-e5 embeddings are 384 dimensions
GENERATED ALWAYS AS (azure_local_ai.create_embeddings('multilingual-e5-small:v1', doc)::vector) STORED; -- TEXT string sent to local model

--View floating point entries in the doc_vector column
select doc_vector from docs;

-- Add a single record to the docs table and the vector embedding using azure_local_ai and locally deployed model will be automatically generated
INSERT INTO docs(doc) VALUES ('Semantic Search with Azure Database for PostgreSQL - Flexible Server and Azure OpenAI');

--View all doc entries and their doc_vector column
select doc, doc_vector, last_update from docs;

-- Simple array embedding
SELECT azure_local_ai.create_embeddings('multilingual-e5-small:v1', array['Recommendation System with Azure Database for PostgreSQL - Flexible Server and Azure OpenAI.', 'Generative AI with Azure Database for PostgreSQL - Flexible Server.']);

```


### Update embeddings upon insertion

Below are examples that can be used in your own environment to test embedding generation with the locally deployed multilingual-e5 model.

```sql
-- Update embeddings upon insertion

-- create table
create table docs(doc_id int generated always as identity primary key, doc text not null, last_update timestamptz default now(), embedding float4[] 
	GENERATED ALWAYS AS (azure_local_ai.create_embeddings('multilingual-e5-small:v1', doc)) STORED);

--Insert data into the docs table
INSERT INTO docs(doc) VALUES ('Create in-database embeddings with azure_local_ai extension.'),
                             ('Enable RAG patterns with in-database embeddings and vectors on Azure Database for PostgreSQL - Flexible server.'),
                             ('Generate vector embeddings in PostgreSQL with azure_local_ai extension.'),
                             ('Generate text embeddings in PostgreSQL for retrieval augmented generation (RAG) patterns with azure_local_ai extension and locally deployed LLM.'),
                             ('Use vector indexes and Azure OpenAI embeddings in PostgreSQL for retrieval augmented generation.');


--Query embedding text, list results by descending similarity score
with all_docs as (
 select doc_id, doc, embedding
  from docs
), target_doc as (
 select azure_local_ai.create_embeddings('multilingual-e5-small:v1', 'Generate text embeddings in PostgreSQL.') embedding
)
select all_docs.doc_id, all_docs.doc , 1 - (all_docs.embedding::vector <=> target_doc.embedding::vector) as similarity
 from target_doc, all_docs
 order by similarity desc
 limit 2;
```

## ONNX Runtime configuration

###  `azure_local_ai.get_setting`
Used to obtain current values of configuration options.

```sql
SELECT azure_local_ai.get_setting(key TEXT)
```

The **azure_local_ai** extension supports reviewing the configuration parameters of ONNX Runtime thread-pool within the ONNX Runtime Service. Changes are not allowed at this time. [See ONNX Runtime performance tuning.](https://onnxruntime.ai/docs/performance/tune-performance/threading.html)


#### Arguments

##### Key

Valid values for the `key` are:

- `intra_op_parallelism`: Sets total number of threads used for parallelizing single operator by ONNX Runtime thread-pool. By default, we maximize the number of intra ops threads as much as possible as it improves the overall throughput much (all available cpus by default).
- `inter_op_parallelism`: Sets total number of threads used for computing multiple operators in parallel by ONNX Runtime thread-pool. By default, we set it to minimum possible thread, which is 1. Increasing it often hurts performance due to frequent context switches between threads.
- `spin_control`: Switches ONNX Runtime thread-pool's spinning for requests. When disabled, it uses less cpu and hence causes more latency. By default, it is set to true (enabled).

#### Return type
`TEXT` representing the current value of the selected setting.
