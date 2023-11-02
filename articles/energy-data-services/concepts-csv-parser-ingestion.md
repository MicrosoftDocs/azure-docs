---
title: Microsoft Azure Data Manager for Energy csv parser ingestion workflow concept
description: Learn how to use CSV parser ingestion.
author: bharathim
ms.author: bselvaraj
ms.service: energy-data-services
ms.topic: conceptual
ms.date: 02/10/2023
ms.custom: template-concept
---

# CSV parser ingestion concepts
A CSV (comma-separated values) file is a comma delimited text file that is used to save data in a table structured format. 

A CSV Parser [DAG](https://airflow.apache.org/docs/apache-airflow/1.10.12/concepts.html#dags) allows a customer to load data into Microsoft Azure Data Manager for Energy instance based on a custom schema that is, a schema that doesn't match the [OSDU&trade;](https://osduforum.org) Well Known Schema (WKS). Customers must create and register the custom schema using the Schema service before loading the data. 

A CSV Parser DAG implements an ELT (Extract Load and Transform) approach to data loading, that is, data is first extracted from the source system in a CSV format, and it's loaded into the Azure Data Manager for Energy instance. It could then be transformed to the [OSDU&trade;](https://osduforum.org) Well Known Schema using a mapping service.


## What does CSV ingestion do?
A CSV Parser DAG allows the customers to load the CSV data into the Microsoft Azure Data Manager for Energy instance. It parses each row of a CSV file and creates a storage metadata record. It performs `schema validation` to ensure that the CSV data conforms to the registered custom schema. It automatically performs `type coercion` on the columns based on the schema data type definition. It generates `unique id` for each row of the CSV record by combining source, entity type and a Base64 encoded string formed by concatenating natural key(s) in the data. It performs `unit conversion` by converting declared frame of reference information into appropriate persistable reference using the Unit service. It performs `CRS conversion` for spatially aware columns based on the Frame of Reference (FoR) information present in the schema. It creates `relationships` metadata as declared in the source schema. Finally, it `persists` the metadata record using the Storage service.

## CSV parser ingestion components

The CSV Parser DAG workflow is made up of the following services:
* **File service** facilitates the management of files in the Azure Data Manager for Energy instance. It allows the user to securely upload, discovery and download files from the data platform.
* **Schema service** facilitates the management of schemas in the Azure Data Manager for Energy instance. It allows the user to create, fetch and search for schemas in the data platform.
* **Storage Service** facilitates the storage of metadata information for domain entities ingested into the data platform. It also raises storage record change events that allow downstream services to perform operations on ingested metadata records.
* **Unit Service** facilitates the management and conversion of units
* **Workflow service** facilitates the management of workflows in the Azure Data Manager for Energy instance. It's a wrapper service on top of the Airflow orchestration engine.

### CSV ingestion components diagram

:::image type="content" source="media/concepts-csv-parser-ingestion/csv-ingestion-components-diagram.png" alt-text="Screenshot of the CSV ingestion components diagram.":::

## CSV parser ingestion workflow

To execute the CSV Parser DAG workflow, the user must have a valid authorization token and appropriate access to the following services: Search, Storage, Schema, File Service, Entitlement, Legal, and Workflow. 

The below workflow diagram illustrates the CSV Parser DAG workflow:
    :::image type="content" source="media/concepts-csv-parser-ingestion/csv-ingestion-sequence-diagram.png" alt-text="Screenshot of the CSV ingestion sequence diagram." lightbox="media/concepts-csv-parser-ingestion/csv-ingestion-sequence-diagram-expanded.png":::

To execute the CSV Parser DAG workflow, the user must first create and register the schema using the workflow service. Once the schema is created, the user then uses the File service to upload the CSV file to the Microsoft Azure Data Manager for Energy instances, and also creates the storage record of file generic kind. The file service then provides a file ID to the user, which is used while triggering the CSV Parser workflow using the Workflow service. The Workflow service provides a run ID, which the user could use to track the status of the CSV Parser workflow run.

OSDU&trade; is a trademark of The Open Group.

## Next steps
Advance to the CSV parser tutorial and learn how to perform a CSV parser ingestion
> [!div class="nextstepaction"]
> [Tutorial: Sample steps to perform a CSV parser ingestion](tutorial-csv-ingestion.md)
