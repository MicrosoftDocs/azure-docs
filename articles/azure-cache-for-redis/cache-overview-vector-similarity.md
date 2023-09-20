---
title: About Vector Embeddings and Vector Search in Azure Cache for Redis
description: Learn about Azure Cache for Redis to store vector embeddings and provide similarity search.
author: flang-msft
ms.author: franlanglois
ms.service: cache
ms.topic: overview
ms.date: 09/18/2023
---

# About Vector Embeddings and Vector Search in Azure Cache for Redis

Vector similarity search (VSS) has become a very popular use-case for AI-driven applications. Azure Cache for Redis can be used to store vector embeddings and compare them through vector similarity search. This article is a high-level introduction to the concept of vector embeddings, vector comparison, and how Redis can be used as a seamless part of a vector similarity workflow. 

For a tutorial on how to use Azure Cache for Redis and Azure OpenAI to perform vector similarity search, see [Tutorial: Conduct  vector similarity search on Azure OpenAI embeddings using Azure Cache for Redis](cache-tutorial-vector-similarity.md)

## Scope of Availability

|Tier      | Basic, Standard  | Premium  |Enterprise | Enterprise Flash  |
|--------- |:------------------:|:----------:|:---------:|:---------:|
|Available | No          | No       |  Yes  | Yes (preview) |

Vector search capabilities in Redis require [Redis Stack](https://redis.io/docs/about/about-stack/), specifically the [RediSearch](https://redis.io/docs/interact/search-and-query/) module. This capability is only available in the [Enterprise tiers of Azure Cache for Redis](cache-redis-modules.md).

```markdown
Azure Cache for Redis can be used to store the embeddings vectors and to perform the vector similarity search. Redis is extremely fast because it runs in-memory. This can be very useful when processing large datasets!
Because Redis is so popular, it is often already used in applications for caching or session store applications. Redis can often be an economical choice because it can pull double-duty by handling typical caching roles while simultaneously handling vector search applications.

Redis has access to a wide range of search capabilities through the [RediSearch module](cache-redis-modules#redisearch), which is available in the Enterprise tier of Azure Cache for Redis. Vector search capabilities include:
- Support for `Euclidean`, `Cosine`, and `Internal Product` search distance metrics
- `FLAT` and `Hierarchical Navigable Small World (HNSW)`  indexing methods
- Hybrid filtering with [powerful query features](https://redis.io/docs/interact/search-and-query/)
```
## What are embeddings?

## What is a vector database?

It might be nice to level set here. This would contextualize this article for those
who may not be familiar with LLMs, embeddings, vectors, nearest neighbor / cosine
similarity searches, etc. You don't have to go deep.

Alternatively, you could create the section "Who is this for?" but that seems a bit
more uncouth.

## When should I use it?

You could rename this to "key scenarios". When does it make sense to use Redis
in this capacity -- as a vector database?

### How does it work?

This is where you could talk about requirements and some light discussion of the
components in Redis that are employed that provide this functionality. Discuss
the "under the hood" architecture to help provide insights and understanding, 
including a discussion of limitations and why a given limitation exists.


### Why choose Azure Cashe for Redis for storing and searching for vectors?

What are some of the benefits of using Redis for vectors? You named off a few
the other day ...

- First to provide this feature
- Fast / in-memory
- Inexpensive, esp. if you already have Redis as a component of your application architecture
- Etc.


### What are my other options for storing and searching for vectors?

I personally believe that one of the most difficult things about Azure (and Microsoft
all up) is the *paradox of choice*. With so many technology options at your disposal
that can perform a similar role in a system architecture, which stack of technologies 
should I use? In the previous section, you told the reader why Redis makes the most
sense. But to be even handed, its not always the right decision. So, if you can
help the reader find other solutions, you've done them a great service.

### Troubleshooting

You may want to just point out the top one or two scenarios you've come across
in testing that trip up users. Point them to most extensive documentation on Redis'
site.
