---
title: Generate vector embeddings with Azure OpenAI on Azure Database for PostgreSQL Flexible Server
description: Generate vector embeddings with Azure OpenAI on Azure Database for PostgreSQL Flexible Server
author: mulander
ms.author: adamwolk
ms.date: 11/02/2023
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
---

# Generate vector embeddings with Azure OpenAI on Azure Database for PostgreSQL Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Invoke [Azure OpenAI embeddings](../../ai-services/openai/reference.md#embeddings) easily to get a vector representation of the input, which can be used then in [vector similarity](./how-to-use-pgvector.md) searches and consumed by machine learning models.

## Prerequisites

1. Create an Open AI account and [request access to Azure OpenAI Service](https://aka.ms/oai/access).
1. Grant Access to Azure OpenAI in the desired subscription  
1. Grant permissions to [create Azure OpenAI resources and to deploy models](../../ai-services/openai/how-to/role-based-access-control.md). 

[Create and deploy an Azure OpenAI service resource and a model](../../ai-services/openai/how-to/create-resource.md), for example deploy the embeddings model [text-embedding-ada-002](../../ai-services/openai/concepts/models.md#embeddings-models). Copy the deployment name as it is needed to create embeddings. 


## Configure OpenAI endpoint and key

In the Azure AI services under **Resource Management** > **Keys and Endpoints** you can find the **Endpoint and Keys** for your Azure AI resource. Use the endpoint and key to enable `azure_ai` extension to invoke the model deployment.

```postgresql
select azure_ai.set_setting('azure_openai.endpoint','https://<endpoint>.openai.azure.com'); 
select azure_ai.set_setting('azure_openai.subscription_key', '<API Key>'); 
```

## `azure_openai.create_embeddings`

Invokes the Azure Open AI API to create embeddings using the provided deployment over the given input.

```postgresql
azure_openai.create_embeddings(deployment_name text, input text, timeout_ms integer DEFAULT 3600000, throw_on_error boolean DEFAULT true)
```

### Arguments

#### `deployment_name`

`text` name of the deployment in Azure OpenAI studio that contains the model.

#### `input`

`text` input used to create embeddings.

#### `timeout_ms`

`integer DEFAULT 3600000` timeout in milliseconds after which the operation is stopped.

#### `throw_on_error`

`boolean DEFAULT true` on error should the function throw an exception resulting in a rollback of wrapping transactions.

### Return type

`real[]` a vector representation of the input text when processed by the selected deployment.

## Use OpenAI to create embeddings and store them in a vector data type

```postgresql
-- Create tables and populate data 
CREATE TABLE ConferenceSessions 
( SessionId serial not null primary key, 
  Title text, 
  SessionAbstract text, 
  DurationMinutes integer, 
  PublishDate timestamp
); 

-- Create a table to store embeddings with a vector column. 
CREATE TABLE ConferenceSessions_embeddings 
( SessionId integer NOT NULL REFERENCES ConferenceSessions(SessionId), 
  Session_embedding vector(1536) 
); 

-- Insert a row into the sessions table 
INSERT INTO ConferenceSessions
    (Title,SessionAbstract,DurationMinutes,PublishDate)  
VALUES
    ('Gen AI with Azure Database for PostgreSQL' 
    ,'Learn about building intelligent applications with azure_ai extension and pg_vector'  
    , 60, current_timestamp); 
 
-- Get an embedding for the Session Abstract 
SELECT
     pg_typeof(azure_openai.create_embeddings('text-embedding-ada-002', c.SessionAbstract)) as EmbeddingDataType 
    ,azure_openai.create_embeddings('text-embedding-ada-002', c.SessionAbstract) 
  FROM
    ConferenceSessions c limit 10; 

-- Insert embeddings  
INSERT INTO ConferenceSessions_embeddings
    (SessionId, Session_embedding) 
SELECT
    C.SessionId, (azure_openai.create_embeddings('text-embedding-ada-002', C.SessionAbstract)) 
FROM
    ConferenceSessions as C   
LEFT OUTER JOIN
    ConferenceSessions_embeddings E ON C.SessionId = E.SessionId 
WHERE
    E.SessionId IS NULL; 

-- Create a HNSW index 
CREATE INDEX ON ConferenceSessions_embeddings USING hnsw (Session_embedding vector_cosine_ops); 

-- Retrieve rows that match cosine similarity search 
SELECT
    C.*
FROM
    ConferenceSessions_embeddings E 
INNER JOIN
    ConferenceSessions C ON C.SessionId = E.SessionId 
ORDER BY
    E.Session_embedding <=> azure_openai.create_embeddings('text-embedding-ada-002', 'intelligent apps')::vector 
LIMIT 5; 
```

## Next steps

> [!div class="nextstepaction"]
> [Learn more about vector similarity search using `pgvector`](./how-to-use-pgvector.md)