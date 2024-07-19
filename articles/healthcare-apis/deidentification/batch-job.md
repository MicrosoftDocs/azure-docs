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

To deidentify large amounts of data stored across multiple files, you can create a batch job to process data in Azure Blob Storage. If you choose to surrogate the data, each batch is consistently surrogated, meaning that replacement identifiers and shifts match across all documents processed in the batch.

## Prerequisites

- A Deidentification service in your Azure subscription. If you don't have a Deidentification service yet, you can follow the steps in [Quickstart: Deploy the Deidentification service](quickstart.md).
- An Azure role assignment with a scope that includes the Deidentification service and with permissions to manage batch jobs, such as **DeID Batch Owner** and **DeID Data Owner**. To assign a role, you can follow [Use Azure role-based access control with the Deidentification service](manage-access-rbac.md).

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
