---
title: FHIR service best practices
description: Best practices for higher performance in FHIR service
services: healthcare-apis
author: expekesheth
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: conceptual
ms.date: 10/01/2024
ms.author: kesheth
---

# Best practices for better performance in FHIR service

This document provides guidance on best practices with the Azure Health Data Services FHIR&reg; service. You'll find practices you should **Do**, **Consider**, or **Avoid** to better the performance of your FHIR service.

> [!NOTE]
> This document is scoped for Azure Health Data Services FHIR service customers.

## Data ingestion

### Import operation

Azure FHIR service supports data ingestion through the import operation, which offers two modes: initial mode, and incremental mode. For detailed guidance, refer to the [Importing data into the FHIR service](import-data.md) documentation.

To achieve optimal performance with the import operation, consider the following best practices.

* **Do** use large files while ingesting data. The optimal NDJSON file size for import is 50 MB or larger (or 20,000 resources or more, with no upper limit). Combining smaller files into larger ones can enhance performance.
* **Consider** using the import operation over HTTP API requests to ingest the data into FHIR service. The import operation provides a high throughput and is a scalable method for loading data.
* **Consider** importing all FHIR resource files in a single import operation for optimal performance. Aim for a total file size of 100 GB or more (or 100 million resources, no upper limit) in one operation. Maximizing an import in this way helps reduce the overhead associated with managing multiple import jobs.
* **Consider** running multiple concurrent imports only if necessary, but limit parallel import jobs. A single large import is designed to consume all available system resources, and processing throughput doesn't increase with concurrent import jobs.

### Bundles

In Azure FHIR service, bundles act as containers for multiple resources. Batch and transaction bundles enable users to submit sets of actions in a single HTTP request or response. Consider the following to achieve higher throughput with bundle ingestion.

* **Do** tune the number of concurrent bundle requests to the FHIR server. A high number (>100) may lead to negative scaling and reduced processing throughput. The optimal concurrency is dependent on the complexity of the bundles and resources.
* **Do** generate load on Azure FHIR service in a linear manner and avoid burst operations to prevent performance degradation.
* **Consider** enabling parallel processing for batch and transaction bundles. By default, resources in bundles are processed sequentially. To enhance throughput, you can enable parallel resource processing by adding the HTTP header flag `x-bundle-processing-logic` and setting it to `parallel`. For more information, see the [batch bundle parallel processing documentation](rest-api-capabilities.md#bundle-parallel-processing).

> [!NOTE]
> Parallel bundle processing can enhance throughput when there isn't an implicit dependency on the order of resources within an HTTP operation.

* **Consider** splitting resource entries across multiple bundles to increase parallelism, which can enhance throughput. Optimizing the number of resource entries in a bundle can reduce network time.
* **Consider** using smaller bundle sizes for complex operations. Smaller transaction bundles can reduce errors and support data consistency. Use separate transaction bundles for FHIR resources that don't depend on each other, and can be updated separately.
* **Avoid** submitting parallel bundle requests that attempt to update the same resources concurrently, which can cause delays in processing.

### Search parameter index tuning

Azure FHIR service is provisioned with predefined search parameters per resource. Search parameters are indexed for ease of use and efficient searching. Indexes are updated for every write on the FHIR service. [Selectable search parameters](selectable-search-parameters.md) allow you to enable or disable built-in search parameter indexes. This functionality helps you optimize storage use and performance by only enabling necessary search parameters. Focusing on relevant search parameters helps minimize the volume of data retrieved during ingestion.

**Consider** disabling search indexes that your organization doesn't use to optimize performance.

## Query performance optimization

After data ingestion, optimizing query performance is crucial. To ensure optimal performance:

* **Do** generate load on Azure FHIR service in a linear manner and, avoid burst operations to prevent performance degradation.
* **Consider** using the most selective search parameters (for instance, `identifier`) over parameters with low cardinality to optimize index usage.
* **Consider** performing deterministic searches using logical identifiers. FHIR service provides two ways to identify a resource: logical identifiers and business identifiers.<br>
Logical Identifiers are considered "deterministic" because FHIR operations performed with them are predictable. Business Identifiers are considered "conditional" because their operations have different behavior depending on the state of the system. We recommend deterministic operations using logical identifiers.
* **Consider** using the `PUT` HTTP verb instead of POST where applicable. `PUT` requests can help maintain data integrity and optimize resource management. `POST` requests can lead to duplication of resources, poor data quality, and increase FHIR data size unnecessarily.
* **Avoid** the use of `_revinclude` in search queries, as they can result in unbounded result sets and higher latencies.
* **Avoid** using complex searches (for example: `_has`, or chained search parameters), as they impact query performance.

## Data extraction

For data extraction, use the bulk `$export` operation as specified in the [HL7 FHIR Build Data Access specification](https://www.hl7.org/fhir/uv/bulkdata/).
* **Do** use larger data blocks for system level exports when not using filters to maximize throughput. Azure FHIR service automatically splits them into parallel jobs.
* **Consider** splitting Patient, Group, and filtered system exports into small data blocks for export.

For more information on export operations, see [Export your FHIR data](export-data.md).

By applying these best practices you can enhance the performance and efficiency of data ingestion, bundle processing, query execution, and data extraction in Azure FHIR service.

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
