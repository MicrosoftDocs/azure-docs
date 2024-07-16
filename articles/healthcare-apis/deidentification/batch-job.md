---
title: Deidentify data in Azure Blob Storage with batch processing in Azure Health Data Services
description: Learn how to efficiently deidentify large datasets in Azure Blob Storage with batch processing in Azure Health Data Services.
author: jovinson-ms
ms.author: jovinson
ms.service: healthcare-apis
ms.subservice: workspace
ms.topic: how-to
ms.date: 7/16/2024
---

# Deidentify data in Azure Blob Storage with batch jobs

To de-identify large amounts of data that may be stored across multiple files, you can create a batch job to process data in Azure Blob Storage. If you choose to surrogate the data, each batch will be consistently surrogated, meaning that replacement identifiers and shifts will match across all documents processed in the batch.

## Prerequisites

- A de-identification service in your Azure subscription. If you don't have a de-identification service yet, you can follow the steps in [Quickstart: Deploy your first de-identification service](quickstart.md).
- An Azure role assignment with a scope that includes the de-identification service and with permissions to manage batch jobs, such as **DeID Batch Owner** and **DeID Data Owner**. To assign a role, you can follow [Use Azure role-based access control with the de-identification service](manage-access-rbac.md).

## Clean up resources



<!-- Optional: Steps to clean up resources - H2

Provide steps the user can take to clean up resources that
they might no longer need.

-->

## Next step -or- Related content



<!-- [Next sequential article title](link.md)

-or-

* [Related article title](link.md)
* [Related article title](link.md)
* [Related article title](link.md)

<!-- Optional: Next step or Related content - H2

Consider adding one of these H2 sections (not both):

A "Next step" section that uses 1 link in a blue box 
to point to a next, consecutive article in a sequence.

-or- 

A "Related content" section that lists links to 
1 to 3 articles the user might find helpful.

-->

<!--

Remove all comments except the customer intent
before you sign off or merge to the main branch.

-->