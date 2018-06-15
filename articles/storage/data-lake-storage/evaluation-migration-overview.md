---
title: Data Lake Storage Overview
description: Overview of Azure Data Lake Storage
services: storage
keywords: 
author: roygara
ms.topic: article
ms.author: rogarana
manager: twooley
ms.date: 06/01/2018
ms.service: storage
ms.component: data-lake-storage-gen2
---

# Azure Data Lake Storage Gen2 Evaluation Overview

For the preview phase, we developed migration guidance and tooling to help Azure Data Lake Storage Gen1 customers evaluate Azure Data Lake Storage Gen2 and start planning a migration strategy as appropriate. The Azure CAT team will work closely with customers on developing this strategy. Existing Azure Data Lake Storage Gen1 customers will be fully supported indefinitely on the existing Azure Data Lake Storage Gen1 platform, allowing customers to plan their migration to ADLSv2 at their convenience.

>[!IMPORTANT]
> We must emphasize that while we recommend you begin evaluating and planning a migration now, we **do not** recommend actually migrating now. Azure Data Lake Storage Gen2 is still a preview service.

Topics we recommend keeping in mind when proceeding through these evaluation and migration documents include:

- Does the service meet your needs for storing data intended for analytics?
- Do the supported migration paths meet your needs?
  - Distcp
  - AzCopy
- What migration patterns are recommended?
- Does the data access method fit your current workflow?
- Are the key features that you require currently in place?
- Do the current methods of securing your data meet your needs?
  - Encrypting Data at rest using either Microsoft supplied keys or your own
  - ACLS
- Are your applications dependent on any Data Lake Storage Gen1 SDKs at the moment?
- Does your workflow use either PowerShell or CLI?
- What other ways do you interact with your analytics data beyond just the hadoop driver?

Azure Data Lake Storage Gen2 will be available as a limited public preview in June, with general availability in CY2018Q4. We invite you to participate in a private preview so you can begin evaluating Data Lake Storage Gen2 and provide feedback through the private yammer.

## Next steps

If you're interested, proceed to our [evaluation article](evaluation-comparison.md) to assess whether or not Data Lake Storage Gen2 is a good fit for you.