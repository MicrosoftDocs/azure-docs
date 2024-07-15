---
title: "Batch de-identify data in Azure Blob Storage"
description: "Learn how to de-identify data in Azure Blob Storage using batch jobs."
author: jovinson-ms
ms.author: jovinson
ms.service: azure-health-data-services
ms.subservice: deidentification-service
ms.topic: how-to
ms.date: [07/12/2024]

#customer intent: As a software engineer or researcher, I want to de-identify a large amount of data in Azure Blob Storage.

---

# Batch de-identify data in Azure Blob Storage

To de-identify large amounts of data that may be stored across multiple files, you can create a batch job to process data in Azure Blob Storage. If you choose to surrogate the data,
each batch will be consistently surrogated, meaning that replacement identifiers and shifts will match across all documents processed in the batch.

## Prerequisites
- A de-identification service in your Azure subscription. If you don't have a de-identification service yet, you can follow the steps in [Quickstart: Deploy your first de-identification service](quickstart.md).
- An Azure role assignment with a scope that includes the de-identification service and with permissions to manage batch jobs, such as **DeID Batch Owner** and **DeID Data Owner**. To assign a role, you can follow [Use Azure role-based access control with the de-identification service](how-to-rbac.md).

## "[verb] * [noun]"

[Introduce the procedure.]

1. Procedure step
1. Procedure step
1. Procedure step

<!-- Required: Steps to complete the task - H2

In one or more H2 sections, organize procedures. A section
contains a major grouping of steps that help the user complete
a task.

Begin each section with a brief explanation for context, and
provide an ordered list of steps to complete the procedure.

If it applies, provide sections that describe alternative tasks or
procedures.

-->

## Clean up resources

<!-- Optional: Steps to clean up resources - H2

Provide steps the user can take to clean up resources that
they might no longer need.

-->

## Next step -or- Related content

> [!div class="nextstepaction"]
> [Next sequential article title](link.md)

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