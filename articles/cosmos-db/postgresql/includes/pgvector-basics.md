---
title: include file
description: include file
author: AvijitkGupta
ms.author: avijitgupta
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: include
ms.date: 11/03/2023
ms.custom:
  - include file
  - build-2023
  - ignite-2023
---

## Concepts
### Vector similarity

Vector similarity is a method used to measure how similar two items are by representing them as vectors, which are series of numbers. Vectors are often used to represent data points, where each element of the vector represents a feature or attribute of the data point. 

Vector similarity is commonly calculated using distance metrics, such as `Euclidean distance` or `cosine` similarity. Euclidean distance measures the straight-line distance between two vectors in the n-dimensional space, while cosine similarity measures the cosine of the angle between two vectors. The values of similarity metrics typically range between `0` and `1`, with `higher` values indicating greater similarity between the vectors.

Vector similarity is widely used in various applications, such as recommendation systems, text classification, image recognition, and clustering. For example, in recommendation systems, vector similarity can be used to identify similar items based on the user's preferences. In text classification, vector similarity can be used to determine the similarity between two documents or sentences based on their vector representations.

### Embeddings

An embedding is a technique of evaluating "relatedness" of text, images, videos, or other types of information. The evaluation permits machine learning models to efficiently identify the relationships and similarities between data, allowing algorithms to identify patterns and make accurate predictions. For example, in a sentiment analysis task, words with similar embeddings might be expected to have similar sentiment scores.

## Getting started

Create a table `tblvector` with an `embedding` column of type `vector(3)` representing a three-dimensional vector.

```postgresql
CREATE TABLE tblvector(
    id bigserial PRIMARY KEY,
    embedding vector(3)
    );
```

Once you generated an embedding using a service like the OpenAI API, you can store the resulting vector in your database. Defining a vector as `vector(3)` designates `[x,y,z] coordinates` in three-dimension plane. The command inserts five new rows into the `tblvector` table with the provided embeddings.

```postgresql
INSERT INTO tblvector (id, embedding) VALUES (1, '[1,2,3]'), (2, '[4,5,6]'), (3, '[5,4,6]'), (4, '[3,5,7]'), (5, '[7,8,9]');
```

By using the `INSERT INTO ... ON CONFLICT` statement, you can specify an alternative action, such as updating records that match the criteria. It allows you to handle potential conflicts in a more efficient and effective manner.

```postgresql
INSERT INTO tblvector (id, embedding) VALUES (1, '[1,2,3]'), (2, '[4,5,6]')
ON CONFLICT (id) DO UPDATE SET embedding = EXCLUDED.embedding;
```

The `DELETE` command removes rows from a specified table based on the conditions specified in the WHERE clause. When the WHERE clause isn't present, all the rows in the table are deleted.

```postgresql
DELETE FROM tblvector WHERE id = 1;
```

To retrieve vectors and calculate similarity, use `SELECT` statements and the built-in vector operators. For instance, the query computes the Euclidean distance (L2 distance) between the given vector and the vectors stored in the `tblvector` table, sorts the results by the calculated distance, and returns the closest five most similar items.

```postgresql
SELECT * FROM tblvector 
ORDER BY embedding <-> '[3,1,2]' 
LIMIT 5;
```

The query uses the "<->" operator, which is the "distance operator" used to calculate the distance between two vectors in a multi-dimensional space. The query returns all rows with the distance of less than 6 from the vector [3,1,2].

```postgresql
SELECT * FROM tblvector WHERE embedding <-> '[3,1,2]' < 6;
```

The command retrieves the average value of the "embedding" column from the "tblvector" table. For example, if the "embedding" column contains word embeddings for a language model, then the average value of these embeddings could be used to represent the entire sentence or document.

```postgresql
SELECT AVG(embedding) FROM tblvector;
```

## Vector operators

`pgvector` introduces six new operators that can be used on vectors:

|   Operator   |   Description               |
|--------------|-----------------------------|
| +            | element-wise addition       |
| -            | element-wise subtraction    |
| *            | element-wise multiplication |
| <->          | Euclidean distance          |
| <#>          | negative inner product      |
| <=>          | cosine distance             |

## Vector functions

### `cosine_distance`

Calculates the cosine distance between two vectors.

```postgresql
cosine_distance(vector, vector)
```

#### Arguments

##### `vector`

First `vector`.

##### `vector`

Second `vector`.

#### Return type

`double precision` as distance between the two provided vectors.

### `inner_product`

Calculates the inner product of two vectors.

```postgresql
inner_product(vector, vector)
```

#### Arguments

##### `vector`

First `vector`.

##### `vector`

Second `vector`

#### Return type

`double precision` as inner product of the two vectors.

### `l2_distance`

Calculates the Euclidean distance (also known as L2) between two vectors.

```postgresql
l2_distance(vector, vector)
```

#### Arguments

##### `vector`

First `vector`.

##### `vector`

Second `vector`

#### Return type

`double precision` as the Euclidean distance between the two vectors.

### `l1_distance`

Calculates the taxicab distance (also known as L1) between two vectors.

```postgresql
l1_distance(vector, vector)
```

#### Arguments

##### `vector`

First `vector`.

##### `vector`

Second `vector`

#### Return type

`double precision` as the taxicab distance between the two vectors.

### `vector_dims(vector)`

Returns the dimensions of a given vector.

#### Arguments

##### `vector`

A `vector`.

#### Return type

`integer` representing the number of dimensions of the given vector.

### `vector_norms(vector)`

Calculates the Euclidean norm of a given vector.

#### Arguments

##### `vector`

A `vector`.

#### Return type

`double precision` representing the Euclidean norm of the given vector.

## Vector aggregates

### `AVG`

Calculates the average of the processed vectors.

#### Arguments

##### `vector`

A `vector`.

#### Return type

`vector` representing the average of processed vectors.

### `SUM`

#### Arguments

##### `vector`

A `vector`.

#### Return type

`vector` representing the sum of processed vectors.
