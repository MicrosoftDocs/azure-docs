---
# Required metadata
# For more information, see https://review.learn.microsoft.com/en-us/help/platform/learn-editor-add-metadata?branch=main
# For valid values of ms.service, ms.prod, and ms.topic, see https://review.learn.microsoft.com/en-us/help/platform/metadata-taxonomies?branch=main

title: Generate vector embeddings in PostgreSQL with azure_local_ai extension.
description: Generate text embeddings in PostgreSQL for retrieval augmented generation (RAG) patterns with azure_local_ai extension and locally deployed LLM.
author:      jojohnso-msft # GitHub alias
ms.author: jojohnso
ms.service: postgresql
ms.topic: how-to
ms.date: 05/19/2024
ms.subservice: flexible-server
---

# Generate vector embeddings with azure_local_ai on Azure Database for PostgreSQL Flexible Server (Preview)

## Prerequisites

1)      An Azure Database for PostgreSQL Flexible Server instance running on a memory optimized VM SKU. Learn more about Azure memory optimized VMs here: [Azure VM sizes - Memory - Azure Virtual Machines | Microsoft Learn](/azure/virtual-machines/sizes-memory)

2)      Enable the following extensions,

           a.       __[vector](/azure/postgresql/flexible-server/how-to-use-pgvector)__

           b.       azure_local_ai

Information on enabling extensions in Azure Database for PostgreSQL – Flexible Server, [How to enable extensions in Azure Database for PostgreSQL.](/azure/postgresql/flexible-server/concepts-extensions)

