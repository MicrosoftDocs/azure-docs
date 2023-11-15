---
title: Recommendation system with Azure Database for PostgreSQL Flexible Server and Azure OpenAI
description: Recommendation System with Azure Database for PostgreSQL Flexible Server and Azure OpenAI
author: mulander
ms.author: adamwolk
ms.date: 11/07/2023
ms.service: postgresql
ms.subservice: flexible-server
ms.custom:
  - ignite-2023
ms.topic: tutorial
---

# Recommendation System with Azure Database for PostgreSQL Flexible Server and Azure OpenAI

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

This hands-on tutorial shows you how to build a recommender application using Azure Database for PostgreSQL Flexible Server and Azure OpenAI service. Recommendations have applications in different domains – service providers frequently tend to provide recommendations for products and services they offer based on prior history and contextual information collected from the customer and environment. 

There are different ways to model recommendation systems. This article explores the simplest form – recommendation based one product corresponding to, say, a prior purchase. This tutorial uses the recipe dataset used in the [Semantic Search](./generative-ai-semantic-search.md) article and the recommendation is for recipes based on a recipe a customer liked or searched for before. 

## Prerequisites

1. Create an Open AI account and [request access to Azure OpenAI Service](https://aka.ms/oai/access).
1. Grant Access to Azure OpenAI in the desired subscription  
1. Grant permissions to [create Azure OpenAI resources and to deploy models](../../ai-services/openai/how-to/role-based-access-control.md). 

[Create and deploy an Azure OpenAI service resource and a model](../../ai-services/openai/how-to/create-resource.md), deploy the embeddings model [text-embedding-ada-002](../../ai-services/openai/concepts/models.md#embeddings-models). Copy the deployment name as it is needed to create embeddings. 

## Enable the `azure_ai` and `pgvector` extensions

Before you can enable `azure_ai` and `pgvector` on your Flexible Server, you need to add them to your allowlist as described in [how to use PostgreSQL extensions](./concepts-extensions.md#how-to-use-postgresql-extensions) and check if correctly added by running `SHOW azure.extensions;`.

Then you can install the extension, by connecting to your target database and running the [CREATE EXTENSION](https://www.postgresql.org/docs/current/static/sql-createextension.html) command. You need to repeat the command separately for every database you want the extension to be available in.

```postgresql
CREATE EXTENSION azure_ai;
CREATE EXTENSION pgvector;
```

## Configure OpenAI endpoint and key

In the Azure AI services under **Resource Management** > **Keys and Endpoints** you can find the **Endpoint and Keys** for your Azure AI resource. Use the endpoint and key to enable `azure_ai` extension to invoke the model deployment.

```postgresql
select azure_ai.set_setting('azure_openai.endpoint','https://<endpoint>.openai.azure.com'); 
select azure_ai.set_setting('azure_openai.subscription_key', '<API Key>'); 
```

## Download & Import the Data

1. Download the data from [Kaggle](https://www.kaggle.com/datasets/thedevastator/better-recipes-for-a-better-life).
1. Connect to your server and create a `test` database and schema to store the data.
1. Import the data
1. Add an embedding column

### Create the schema

```postgresql
CREATE TABLE public.recipes( 
    rid integer NOT NULL, 
    recipe_name text, 
    prep_time text, 
    cook_time text, 
    total_time text, 
    servings integer, 
    yield text, 
    ingredients text, 
    directions text, 
    rating real, 
    url text, 
    cuisine_path text, 
    nutrition text, 
    timing text, 
    img_src text,
    PRIMARY KEY (rid) 
);
```

### Importing the data

Set the following environment variable on the client window, to set encoding to utf-8. This step is necessary because this particular dataset uses the WIN1252 encoding. 

```cmd
Rem on Windows
Set PGCLIENTENCODING=utf-8;
```

```shell
# on Unix based operating systems
export PGCLIENTENCODING=utf-8
```

Import the data into the table created; note that this dataset contains a header row: 

```shell
psql -d <database> -h <host> -U <user> -c "\copy recipes FROM <local recipe data file> DELIMITER ',' CSV HEADER"
```

### Add an embedding column

```postgresql
ALTER TABLE recipes ADD COLUMN embedding vector(1536); 
```


## Recommendation system

Generate embeddings for your data using the azure_ai extension. In the following, we vectorize a few different fields, concatenated:

```postgresql
WITH ro AS (
    SELECT ro.rid
    FROM
        recipes ro
    WHERE
        ro.embedding is null
        LIMIT 500
)
UPDATE
    recipes r
SET
    embedding = azure_openai.create_embeddings('text-embedding-ada-002', r.recipe_name||' '||r.cuisine_path||' '||r.ingredients||' '||r.nutrition||' '||r.directions)
FROM
    ro
WHERE
    r.rid = ro.rid;

```

Repeat the command, until there are no more rows to process.

> [!TIP]
> Play around with the `LIMIT`. With a high value, the statement might fail halfway through due to throttling by Azure OpenAI. If it fails, wait one minute and rerun the command.

Create a search function in your database for convenience:

```postgresql
create function
    recommend_recipe(sampleRecipeId int, numResults int) 
returns table(
            out_recipeName text,
            out_nutrition text,
            out_similarityScore real)
as $$  
declare
    queryEmbedding vector(1536); 
    sampleRecipeText text; 
begin 
    sampleRecipeText := (select 
                            recipe_name||' '||cuisine_path||' '||ingredients||' '||nutrition||' '||directions
                        from
                            recipes where rid = sampleRecipeId); 

    queryEmbedding := (azure_openai.create_embeddings('text-embedding-ada-002',sampleRecipeText));

    return query  
    select
        distinct r.recipe_name,
        r.nutrition,
        (r.embedding <=> queryEmbedding)::real as score  
    from
        recipes r  
    order by score asc limit numResults; -- cosine distance  
end $$
language plpgsql; 
```

Now just search for recommendations: 

```postgresql
select out_recipename, out_similarityscore from recommend_recipe(1, 20); -- search for 20 recipe recommendations that closest to recipeId 1
```

and explore the results:


```
            out_recipename             | out_similarityscore
---------------------------------------+---------------------
 Apple Pie by Grandma Ople             |                   0
 Easy Apple Pie                        |          0.05137232
 Grandma's Iron Skillet Apple Pie      |         0.054287136
 Old Fashioned Apple Pie               |         0.058492836
 Apple Hand Pies                       |          0.06449003
 Apple Crumb Pie                       |          0.07290977
 Old-Fashioned Apple Dumplings         |         0.078374185
 Fried Apple Pies                      |          0.07918481
 Apple Pie Filling                     |         0.084320426
 Apple Turnovers                       |          0.08576391
 Dutch Apple Pie with Oatmeal Streusel |          0.08779895
 Apple Crisp - Perfect and Easy        |          0.09170883
 Delicious Cinnamon Baked Apples       |          0.09384012
 Easy Apple Crisp with Pie Filling     |          0.09477234
 Jump Rope Pie                         |          0.09503954
 Easy Apple Strudel                    |         0.095167875
 Apricot Pie                           |          0.09634114
 Easy Apple Crisp with Oat Topping     |          0.09708358
 Baked Apples                          |          0.09826993
 Pear Pie                              |         0.099974394
(20 rows)
```

## Next steps

You learned how to perform semantic search with Azure Database for PostgreSQL Flexible Server and Azure OpenAI.

> [!div class="nextstepaction"]
> [Generate vector embeddings with Azure OpenAI](./generative-ai-azure-openai.md)

> [!div class="nextstepaction"]
> [Integrate Azure Database for PostgreSQL Flexible Server with Azure Cognitive Services](./generative-ai-azure-cognitive.md)

> [!div class="nextstepaction"]
> [Learn more about vector similarity search using `pgvector`](./how-to-use-pgvector.md)
