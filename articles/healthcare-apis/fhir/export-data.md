---
title: Executing the export by invoking $export command on FHIR service
description: This article describes how to export FHIR data using $export
author: ranvijaykumar
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 08/03/2022
ms.author: mikaelw
---
# How to export FHIR data

The bulk `$export` operation in the FHIR service allows data to be exported per the [HL7 FHIR Bulk Data Access specification](https://hl7.org/fhir/uv/bulkdata/export/index.html). 

Before using `$export`, make sure that your FHIR service is configured to connect with an ADLS Gen2 storage account. For configuring export settings and creating an ADLS Gen2 storage account, refer to the [Configure settings for export](./configure-export-data.md) page.

## Calling the `$export` endpoint

After setting up FHIR service to connect with an ADLS Gen2 storage account, you can call the `$export` endpoint and the FHIR data will be written in a container whose name you specify in the `$export` request. The request below exports all resources in a FHIR service database to a specified `{{containerName}}` in an ADLS Gen2 storage account.

```
GET {{fhirurl}}/$export?_container={{containerName}}
```

For general information about the `$export` API call spec in FHIR, please see the [HL7 FHIR Export Request Flow](https://hl7.org/fhir/uv/bulkdata/export/index.html#request-flow) documentation.


**Jobs stuck in a bad state**

In some situations, there's a potential for a job to be stuck in a bad state while attempting to `$export` data from the FHIR service. This can occur especially if the ADLS Gen2 storage account permissions haven't been set up correctly. One way to check the status of your `$export` operation is to look in your storage account's **Storage browser** and see if any `.ndjson` files are present in the designated container. If the files aren't present and there are no other `$export` jobs running, then there's a possibility the current job is stuck in a bad state. In this case, you can cancel the `$export` job by sending a `DELETE` request to the FHIR service. Later you can requeue the `$export` job and try again. Information about canceling an `$export` operation can be found in the [Bulk Data Delete Request](https://hl7.org/fhir/uv/bulkdata/export/index.html#bulk-data-delete-request) documentation from HL7. 

>Note: In the FHIR service, the default run time for an `$export` operation in a bad state is 10 minutes before the service will stop and move to a new job or retry the `$export`. 

The FHIR service supports `$export` at the following levels:
* [System](https://hl7.org/Fhir/uv/bulkdata/export/index.html#endpoint---system-level-export): `GET {{fhirurl}}/$export`
* [Patient](https://hl7.org/Fhir/uv/bulkdata/export/index.html#endpoint---all-patients): `GET {{fhirurl}}/Patient/$export`
* [Group of patients*](https://hl7.org/Fhir/uv/bulkdata/export/index.html#endpoint---group-of-patients) – The FHIR service exports all related resources but doesn't export the characteristics of the group: `GET {{fhirurl}}/Group/[ID]/$export`

When data is exported, a separate file is created for each resource type. To ensure that the exported files don't become too large, the FHIR service creates a new file once the size of a single exported file exceeds 64 MB. The result is that you may get multiple files for a resource type, which will be enumerated (e.g., Patient-1.ndjson, Patient-2.ndjson). 


> [!Note] 
> `Patient/$export` and `Group/[ID]/$export` may export duplicate resources if a resource is in multiple groups or in a compartment of more than one resource.

In addition, checking the `$export` operation status through the URL returned in the `Content-Location` header is supported. See the HL7 [Bulk Data Status Request](https://hl7.org/fhir/uv/bulkdata/export/index.html#bulk-data-status-request) documentation for more information.

### Exporting FHIR data to ADLS Gen2

Currently the FHIR service supports `$export` for ADLS Gen2 enabled storage accounts, with the following limitations:

- The user can take advantage of [hierarchical namespaces](../../storage/blobs/data-lake-storage-namespace.md) in ADLS Gen2, yet there isn't a way to target `$export` operations to a specific subdirectory within a container. The FHIR service only provides the ability to specify the container (where a new folder for each `$export` operation is created).
- Once an `$export` operation is complete and all data has been written inside a folder, the FHIR service doesn't export anything to that folder again since subsequent exports to the same container will be inside a newly created folder.

To export data to storage accounts behind a firewall, see [Configure settings for export](configure-export-data.md).

## Settings and parameters

### Headers
There are two required header parameters that must be set for `$export` jobs. The values are defined by the current [$export specification](https://hl7.org/Fhir/uv/bulkdata/export/index.html#headers).
* **Accept** - `application/fhir+json`
* **Prefer** - `respond-async`

### Query parameters
The FHIR service supports the following query parameters for filtering data in `$export` operations. All of these parameters are optional.

|Query parameter        | Defined by the FHIR Spec?    |  Description|
|------------------------|---|------------|
| `_outputFormat` | Yes | Currently supports three values to align to the FHIR Spec: `application/fhir+ndjson`, `application/ndjson`, or just `ndjson`. All export jobs will return `.ndjson` files and the passed value has no effect on code behavior. |
| `_since` | Yes | Allows you to only export resources that have been modified since the time provided. |
| `_type` | Yes | Allows you to specify which types of resources will be included. For example, `_type=Patient` would return only patient resources.|
| `_typeFilter` | Yes | To request finer-grained filtering, you can use `_typeFilter` along with the `_type` parameter. The value of the `_typeFilter` parameter is a comma-separated list of FHIR queries that further restrict the results. |
| `_container` | No |  Specifies the container within the configured storage account where the data should be exported. If a container is specified, the data will be exported into a folder in that container. If the container isn't specified, the data will be exported to a new container. |

> [!Note]
> Only storage accounts in the same subscription as that for the FHIR service are allowed to be registered as the destination for `$export` operations.
    
## Next steps

In this article, you've learned how to export FHIR resources using the `$export` command. For more information about how to set up and use de-identified export or how to export data from the FHIR service to Azure Synapse Analytics, see
 
>[!div class="nextstepaction"]
>[Export de-identified data](de-identified-export.md)

>[!div class="nextstepaction"]
>[Copy data from the FHIR service to Azure Synapse Analytics](copy-to-synapse.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
