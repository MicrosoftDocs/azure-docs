---
title: Microsoft Energy Data Services Preview manifest ingestion concepts #Required; page title is displayed in search results. Include the brand.
description: This article describes manifest ingestion concepts #Required; article description that is displayed in search results. 
author: bharathim #Required; your GitHub user alias, with correct capitalization.
ms.author: bselvaraj #Required; microsoft alias of author; optional team alias.
ms.service: energy-data-services #Required; service per approved list. slug assigned by ACOM.
ms.topic: conceptual #Required; leave this attribute/value as-is.
ms.date: 08/18/2022
ms.custom: template-concept #Required; leave this attribute/value as-is.
---

# Manifest-based ingestion concepts

Manifest-based file ingestion provides end-users and systems a robust mechanism for loading metadata in Microsoft Energy Data Services Preview instance. A manifest is a JSON document that has a pre-determined structure for capturing entities that conform to the [OSDU&trade;](https://osduforum.org/) Well-known Schema (WKS) definitions.

Manifest-based file ingestion doesn't understand the contents of the file or doesn't parse the file. It just creates a metadata record for the file and makes it searchable. It doesn't infer or does anything on top of the file.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Understanding the manifest

The manifest schema has containers for the following entities

* **ReferenceData** (*zero or more*) - A set of permissible values to be used by other (master or transaction) data fields. Examples include *Unit of Measure (feet)*, *Currency*, etc.
* **MasterData** (*zero or more*) - A single source of basic business data used across multiple systems, applications, and/or process. Examples include *Wells* and *Wellbores*
* **WorkProduct (WP)** (*one - must be present if loading WorkProductComponents*) - A session boundary or collection (project, study) encompasses a set of entities that need to be processed together. As an example, you can take the ingestion of one or more log collections.
* **WorkProductComponents (WPC)** (*zero or more - must be present if loading datasets*) - A typed, smallest, independently usable unit of business data content transferred as part of a Work Product (a collection of things ingested together). Each Work Product Component (WPC) typically uses reference data, belongs to some master data, and maintains a reference to datasets. Example: *Well Logs, Faults, Documents*
* **Datasets** (*zero or more - must be present if loading WorkProduct and WorkProductComponent records*) - Each Work Product Component (WPC) consists of one or more data containers known as datasets.

## Manifest-based file ingestion workflow steps

1. A manifest is submitted to the Workflow Service using the manifest ingestion workflow name (for example, "Osdu_ingest")
2. Once the request is validated and the user authorization is complete, the workflow service will load and initiate the manifest ingestion workflow.
3. The first step is to check the syntax of the manifest.  
    1. Retrieve the **kind** property of the manifest
    2. Retrieve the **schema definition** from the Schema service for the manifest kind
    3. Validate that the manifest is syntactically correct according to the manifest schema definitions.
    4. For each Reference data, Master data, Work Product, Work Product Component, and Dataset, do the following activities:
        1. Retrieve the **kind** property.
        2. Retrieve the **schema definition** from the Schema service for the kind
        3. Validate that the entity is syntactically correct according to the schema definition and submits the manifest to the Workflow Service
        4. Validate that mandatory attributes exist in the manifest
        5. Validate that all property values follow the patterns defined in the schemas
        6. Validate that no extra properties are present in the manifest
    5. Any entity that doesn't pass the syntax check is rejected
4. The content is checked for a series of validation rules
    1. Validation of referential integrity between Work Product Components and Datasets
       1. There are no orphan Datasets defined in the WP (each Dataset belongs to a WPC)
       2. Each Dataset defined in the WPC is described in the WP Dataset block
       3. Each WPC is linked to at least
    2. Validation that referenced parent data exists
    3. Validation that Dataset file paths aren't empty
5. Process the contents into storage
    1. Write each valid entity into the data platform via the Storage API
    2. Capture the ID generated to update surrogate-keys where surrogate-keys are used
6. Workflow exits

## Manifest ingestion components

* **Workflow Service** is a wrapper service on top of the Airflow workflow engine, which orchestrates the ingestion workflow. Airflow is the chosen workflow engine by the [OSDU&trade;](https://osduforum.org/) community to orchestrate and run ingestion workflows. Airflow isn't directly exposed to clients, instead its features are accessed through the workflow service.  
* **File Service** is used to upload files, file collections, and other types of source data to the data platform.
* **Storage Service** is used to save the manifest records into the data platform.
* **Airflow engine** is the workflow engine that executes DAGs (Directed Acyclic Graphs).
* **Schema Service** stores schemas used in the data platform. Schemas are being referenced during the Manifest-based file ingestion.
* **Entitlements Service** manages access groups. This service is used during the ingestion for verification of ingestion permissions. This service is also used during the metadata record retrieval for validation of "read" writes.  
* **Search Service** is used to perform referential integrity check during the manifest ingestion process.

## Manifest ingestion workflow sequence

:::image type="content" source="media/concepts-manifest-ingestion/concept-manifest-ingestion-sequence.png" alt-text="Screenshot of the manifest ingestion sequence.":::

OSDU&trade; is a trademark of The Open Group.

## Next steps
Advance to the manifest ingestion tutorial and learn how to perform a manifest-based file ingestion
> [!div class="nextstepaction"]
> [Tutorial: Sample steps to perform a manifest-based file ingestion](tutorial-manifest-ingestion.md)