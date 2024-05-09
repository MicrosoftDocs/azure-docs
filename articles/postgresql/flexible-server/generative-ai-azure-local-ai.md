---
# Required metadata
# For more information, see https://review.learn.microsoft.com/en-us/help/platform/learn-editor-add-metadata?branch=main
# For valid values of ms.service, ms.prod, and ms.topic, see https://review.learn.microsoft.com/en-us/help/platform/metadata-taxonomies?branch=main

title:       # Add a title for the browser tab
description: # Add a meaningful description for search results
author:      jojohnso-msft # GitHub alias
ms.author:   johnsonje.arc # Microsoft alias
ms.service:  # Add the ms.service or ms.prod value
# ms.prod:   # To use ms.prod, uncomment it and delete ms.service
ms.topic:    # Add the ms.topic value
ms.date:     05/08/2024
---

# Generate vector embeddings with azure_local_ai on Azure Database for PostgreSQL Flexible Server (Preview)

## Prerequisites

1)      An Azure Database for PostgreSQL Flexible Server instance running on a memory optimized VM SKU. Learn more about Azure memory optimized VMs here: [Azure VM sizes - Memory - Azure Virtual Machines | Microsoft Learn](/azure/virtual-machines/sizes-memory)

2)      Enable the following extensions,

           a.       __[vector](/azure/postgresql/flexible-server/how-to-use-pgvector)__

           b.       azure_local_ai

Information on enabling extensions in Azure Database for PostgreSQL – Flexible Server, [How to enable extensions in Azure Database for PostgreSQL.](/azure/postgresql/flexible-server/concepts-extensions)

