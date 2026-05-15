---
title: FHIR service best practices for performance
description: Improve Azure Health Data Services FHIR service performance with proven best practices for import, bundles, search, and export operations.
services: healthcare-apis
author: expekesheth
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: best-practice
ms.date: 05/15/2026
ms.author: kesheth
---

# FHIR service best practices for better performance

This article provides guidance on best practices for the Azure Health Data Services FHIR&reg; service. To improve the performance of your FHIR service, follow the practices you should **Do**, **Consider**, or **Avoid**.

> [!NOTE]
> This article is scoped for Azure Health Data Services FHIR service customers.

## Data ingestion

### Import operation

Azure FHIR service supports data ingestion through the import operation, which offers two modes: initial mode, and incremental mode. For detailed guidance, see [Importing data into the FHIR service](import-data.md).

To achieve optimal performance with the import operation, consider the following best practices.

* **Do** use large files when ingesting data. The optimal NDJSON file size for import is 50 MB or larger (or 20,000 resources or more, with no upper limit). Combining smaller files into larger ones can enhance performance.
* **Consider** using the import operation over HTTP API requests to ingest data into FHIR service. The import operation provides high throughput and is a scalable method for loading data.
* **Consider** importing all FHIR resource files in a single import operation for optimal performance. Aim for a total file size of 100 GB or more (or 100 million resources, no upper limit) in one operation. Maximizing an import in this way helps reduce the overhead associated with managing multiple import jobs.
* **Consider** performing import job with the resources mapping to the same resource type for better throughput.
* **Consider** running multiple concurrent imports only if necessary, but limit parallel import jobs. A single large import is designed to consume all available system resources, and processing throughput doesn't increase with concurrent import jobs.

### Bundles

In Azure FHIR service, bundles act as containers for multiple resources. Batch and transaction bundles enable you to submit sets of actions in a single HTTP request or response. To achieve higher throughput with bundle ingestion, consider the following recommendations:

* **Do** generate load on Azure FHIR service in a linear manner and avoid burst operations to prevent performance degradation.
* **Do** tune the number of concurrent bundle requests to the FHIR server. A high number (more than 100) can lead to negative scaling and reduced processing throughput.
* **Do** use separate transaction bundles for FHIR resources that don't depend on each other and can be updated separately.
* **Consider** using smaller bundle sizes for complex operations such as conditional creates or updates.
* **Consider** enabling parallel processing for batch and transaction bundles. By default, the service processes resources in bundles sequentially. To enhance throughput, you can enable parallel resource processing by adding the HTTP header flag `x-bundle-processing-logic` and setting it to `parallel`. For more information, see the [batch bundle parallel processing documentation](rest-api-capabilities.md#bundle-parallel-processing).
* **Avoid** submitting parallel bundle requests that attempt to update the same resources concurrently, which can cause delays in processing.
* **Avoid** submitting a large number of bundles with a single PUT or POST request can lead to transaction bottlenecks.

> [!NOTE]
> Parallel bundle processing by using the `x-bundle-processing-logic` flags can enhance throughput when there isn't an implicit dependency on the order of resources within an HTTP operation.

### Search parameter index tuning

Azure FHIR service is provisioned with predefined search parameters per resource. The service indexes search parameters for ease of use and efficient searching. The service updates indexes for every write. [Selectable search parameters](selectable-search-parameters.md) allow you to enable or disable built-in search parameter indexes. This functionality helps you optimize storage use and performance by only enabling necessary search parameters. Focusing on relevant search parameters helps minimize the volume of data retrieved during ingestion.

**Consider** disabling search indexes that your organization doesn't use to optimize performance.

## Query performance optimization

After ingesting data, it's crucial to optimize query performance. To ensure optimal performance:

* **Do** generate load on Azure FHIR service in a linear manner and avoid burst operations to prevent performance degradation.
* **Consider** using the most selective search parameters (for example, `identifier`) over parameters with low cardinality to optimize index usage.
* **Consider** performing deterministic searches by using logical identifiers. FHIR service provides two ways to identify a resource: logical identifiers and business identifiers.<br>
Logical identifiers are deterministic because FHIR operations that use them are predictable. Business identifiers are conditional because their operations have different behavior depending on the state of the system. Use deterministic operations by using logical identifiers.
* **Consider** using the `PUT` HTTP verb instead of `POST` where applicable. `PUT` requests can help maintain data integrity and optimize resource management. `POST` requests can lead to duplication of resources, poor data quality, and increase FHIR data size unnecessarily.
* **Avoid** the use of `_revinclude` in search queries, as it can result in unbounded result sets and higher latencies.
* **Avoid** using complex searches (for example: `_has`, or chained search parameters), as they impact query performance.

> [!NOTE]
> Transient conditions, maintenance, or network variability can impact rare outliers or 1% of queries. Implement retry logic to ensure reliability without degrading your application and user experience.

## Data extraction

For data extraction, use the bulk `$export` operation as specified in the [HL7 FHIR Build Data Access specification](https://www.hl7.org/fhir/uv/bulkdata/).
* **Do** use larger data blocks for system level exports when not using filters to maximize throughput. Azure FHIR service automatically splits them into parallel jobs.
* **Consider** splitting Patient, Group, and filtered system exports into small data blocks for export.

For more information on export operations, see [Export your FHIR data](export-data.md).

## Storing binary data in FHIR resources
* **Do** store small payloads (up to 2 MB) as base64-encoded strings within the FHIR resource.
* **Consider** using external storage solutions for larger binary data. Store binary data in a blob storage and reference it in the FHIR resource by using a URL to avoid inefficiencies.
* **Consider** breaking up large binary files into smaller chunks (less than 2 MB) and store them as separate binary resources. Link these resources together by using a FHIR resource.
* **Avoid** storing large binary data directly within the FHIR resource. This practice can lead to limitations and inefficiencies in FHIR service capabilities such as import, export, and search.


By applying these best practices, you can enhance the performance and efficiency of data ingestion, bundle processing, query execution, and data extraction in Azure FHIR service.

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
