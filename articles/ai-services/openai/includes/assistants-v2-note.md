---
manager: nitinme
author: aahill
ms.author: aahi
ms.service: azure-ai-openai
ms.topic: include
ms.date: 04/22/2024
---

> [!NOTE]
> * [File search](../how-to/file-search.md) can ingest up to 10,000 files per assistant - 500 times more than before. It is fast, supports parallel queries through multi-threaded searches, and features enhanced reranking and query rewriting.
>     * Vector store is a new object in the API. Once a file is added to a vector store, it's automatically parsed, chunked, and embedded, made ready to be searched. Vector stores can be used across assistants and threads, simplifying file management and billing.
> * We've added support for the `tool_choice` parameter which can be used to force the use of a specific tool (like file search, code interpreter, or a function) in a particular run.