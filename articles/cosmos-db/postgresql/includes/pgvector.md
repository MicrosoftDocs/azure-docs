The `pgvector` extension adds an open-source vector similarity search to PostgreSQL.

This article introduces us to additional capabilities onboarded with pgvector. It covers the concepts of vector similarity and embeddings, explains how to enable the pgvector extension, and demonstrates how to create, store and query vectors. We will look at the new datatype of storing, indexing and querying the embeddings at scale.

## Enable extension

To install the extension, run the [CREATE EXTENSION](https://www.postgresql.org/docs/current/static/sql-createextension.html) command from the psql tool to load the packaged objects into your database.

```postgresql
 SELECT create_extension('pgvector');
```

## Concepts
### Vector similarity

Vector similarity is a method used to measure how similar two items are by representing them as vectors, which are series of numbers. This approach can be applied to various types of data, such as words, images, or other elements. By using a mathematical model, each item is converted into a vector, and then these vectors are compared to determine their similarity. The closer the vectors are in terms of distance, the more alike the items.

### Embeddings

An embedding is a technique that transforms data, such as words, into vectors, enabling machine learning algorithms to efficiently process and analyze them. This transformation captures the relationships and similarities between data, allowing algorithms to identify patterns and make accurate predictions.

## Getting started

Create a table with vector column across 3 dimensions

```postgresql
CREATE TABLE tblvector 
    (
    id bigserial PRIMARY KEY
    , embedding vector(3)
    );
```

Insert vectors

```postgresql
INSERT INTO tblvector (embedding) VALUES ('[1,2,3]'), ('[4,5,6]');
```

Upsert vectors

```postgresql
INSERT INTO tblvector (id, embedding) VALUES (1, '[1,2,3]'), (2, '[4,5,6]')
ON CONFLICT (id) DO UPDATE SET embedding = EXCLUDED.embedding;

```

Delete vectors

```postgresql
DELETE FROM tblvector WHERE id = 1;
```

Get the nearest neighbors to a vector.

```postgresql
SELECT * FROM tblvector 
ORDER BY embedding <-> '[3,1,2]' 
LIMIT 5;
```

Get the nearest neighbors to a row

```postgresql
SELECT * FROM tblvector 
WHERE id != 1 
ORDER BY embedding <-> (SELECT embedding FROM tblvector WHERE id = 1) 
LIMIT 5;
```

Get rows within a certain distance

```postgresql
SELECT * FROM tblvector WHERE embedding <-> '[3,1,2]' < 5;
```

Average vectors

```postgresql
SELECT AVG(embedding) FROM tblvector;
```

> [!NOTE]
> `pgvector` introduces 3 new operators that can be used to calculate similarity:
> | **Operator** | **Description**            |
> |--------------|----------------------------|
> | <->          | Euclidean distance         |
> | <#>          | negative inner product     |
> | <=>          | cosine distance            |
>
> `<#>` returns the negative inner product since Postgres only supports ASC order index scans on operators.