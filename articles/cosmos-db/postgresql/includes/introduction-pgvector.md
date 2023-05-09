The `pgvector` extension adds an open-source vector similarity search to PostgreSQL.

This article introduces us to additional capabilities onboarded with pgvector. It covers the concepts of vector similarity and embeddings, explains how to enable the pgvector extension, and demonstrates how to create, store and query vectors. We will look at the new datatype of storing, indexing and querying the embeddings at scale.

## Enable extension

To install the extension, run the [CREATE EXTENSION](https://www.postgresql.org/docs/current/static/sql-createextension.html) command from the psql tool to load the packaged objects into your database.