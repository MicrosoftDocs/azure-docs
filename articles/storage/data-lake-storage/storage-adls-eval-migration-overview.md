---
title: 
description: 
services: storage
keywords: 
author: roygara
ms.topic: article
ms.author: rogarana
manager: twooley
ms.date: 06/01/2018
ms.service: storage
---

# Azure Data Lake Storage Gen2 Evaluation Overview

Azure Data Lake Storage Gen2 is now directly integrated with the Azure Storage platform. Azure Data Lake Storage Gen2 combines the scale and security capabilities of Azure Data Lake Storage Gen1 (previously Azure Data Lake Store) with the capabilities and low cost of Azure Blob Storage.

Azure Data Lake Storage Gen2 includes rich support for the Hadoop Compatible File System along with a full hierarchical namespace optimized for analytics workloads. Azure Data Lake Storage Gen2 is currently available in two Azure regions (West US 2 and West Central US) and includes other capabilities of Azure’s Storage such as Blob API compatibility, data tiering, lifecycle management, durability options for HA as well as DR, eventgrid support, enhanced network security, and a rich ecosystem of Storage partners.

For the preview phase we have developed migration guidance and tooling to help Azure Data Lake Storage Gen1 customers evaluate Azure Data Lake Storage Gen2 and start planning a migration strategy as appropriate. The Azure CAT team will work closely with customers on developing this strategy. Existing Azure Data Lake Storage Gen1 customers will be fully supported indefinitely on the existing Azure Data Lake Storage Gen1 platform, allowing customers to plan their migration to ADLSv2 at their convenience. 

>[!IMPORTANT]
> We must emphasize that while we recommend you begin evaluating and planning a migration now, we **do not** recommend actually migrating now. Azure Data Lake Storage Gen2 is still a preview service.

Topics we recommend keeping in mind when proceeding through these evaluation and migration documents include:

- Does the service meet your needs for storing data intended for analytics?
- Do the supported migration paths meet your needs?
  - Distcp
  - AzCopy
- What migration patterns are recommended?
- Does the data access method fit your current workflow?
- Are the key features which you require currently in place?
- Do the current methods of securing your data meet your needs?
  - Encrypting Data at rest using either Microsoft supplied keys or your own
  - ACLS (Coming soon)
- Are your applications dependent on any Data Lake Storage Gen1 SDKs at the moment?
- Does your workflow use either PowerShell or CLI?
- What other ways do you interact with your analytics data beyond just the hadoop driver?

Azure Data Lake Storage Gen2 will be available as a limited public preview in June with general availability in CY2018Q4. As a key customer of Azure we are interested in having you participate in a private preview so you can start to evaluate Data Lake Storage Gen2 and provide feedback through the private yammer.

## Next steps

If you're interested, proceed to our evaluation article so you can assess whether or not Data Lake Storage Gen2 is a good fit for you.