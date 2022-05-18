---
title: Executing the export by invoking $export command on FHIR service
description: This article describes how to export FHIR data using $export
author: ranvijaykumar
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 02/15/2022
ms.author: mikaelw
---
# How to export FHIR data


The Bulk Export feature allows data to be exported from the FHIR Server per the [FHIR specification](https://hl7.org/fhir/uv/bulkdata/export/index.html). 

Before using $export, you'll want to make sure that the FHIR service is configured to use it. For configuring export settings and creating Azure storage account, refer to [the configure export data page](configure-export-data.md).

## Using $export command

After configuring the FHIR service for export, you can use the $export command to export the data out of the service. The data will be stored into the storage account you specified while configuring export. To learn how to invoke $export command in FHIR server, read documentation on the [HL7 FHIR $export specification](https://hl7.org/Fhir/uv/bulkdata/export/index.html).


**Jobs stuck in a bad state**

In some situations, there's a potential for a job to be stuck in a bad state. This can occur especially if the storage account permissions haven't been set up properly. One way to validate if your export is successful is to check your storage account to see if the corresponding container (that is, ndjson) files are present. If they aren't present, and there are no other export jobs running, then there's a possibility the current job is stuck in a bad state. You should cancel the export job by sending a cancellation request and try requeuing the job again. Our default run time for an export in bad state is 10 minutes before it will stop and move to a new job or retry the export. 

The FHIR service supports $export at the following levels:
* [System](https://hl7.org/Fhir/uv/bulkdata/export/index.html#endpoint---system-level-export): `GET https://<<FHIR service base URL>>/$export>>`
* [Patient](https://hl7.org/Fhir/uv/bulkdata/export/index.html#endpoint---all-patients): `GET https://<<FHIR service base URL>>/Patient/$export>>`
* [Group of patients*](https://hl7.org/Fhir/uv/bulkdata/export/index.html#endpoint---group-of-patients) - FHIR service exports all related resources but doesn't export the characteristics of the group: `GET https://<<FHIR service base URL>>/Group/[ID]/$export>>`

When data is exported, a separate file is created for each resource type. To ensure that the exported files don't become too large. We create a new file after the size of a single exported file becomes larger than 64 MB. The result is that you may get multiple files for each resource type, which will be enumerated (that is, Patient-1.ndjson, Patient-2.ndjson). 


> [!Note] 
> `Patient/$export` and `Group/[ID]/$export` may export duplicate resources if the resource is in a compartment of more than one resource, or is in multiple groups.

In addition, checking the export status through the URL returned by the location header during the queuing is supported along with canceling the actual export job.

### Exporting FHIR data to ADLS Gen2

Currently we support $export for ADLS Gen2 enabled storage accounts, with the following limitation:

- User can’t take advantage of [hierarchical namespaces](../../storage/blobs/data-lake-storage-namespace.md), yet there isn't a way to target export to a specific subdirectory within the container. We only provide the ability to target a specific container (where we create a new folder for each export).
- Once an export is complete, we never export anything to that folder again, since subsequent exports to the same container will be inside a newly created folder.

To export data to storage accounts behind the firewalls, see [Configure settings for export](configure-export-data.md).

## Settings and parameters

### Headers
There are two required header parameters that must be set for $export jobs. The values are defined by the current [$export specification](https://hl7.org/Fhir/uv/bulkdata/export/index.html#headers).
* **Accept** - application/fhir+json
* **Prefer** - respond-async

### Query parameters
The FHIR service supports the following query parameters. All of these parameters are optional:

|Query parameter        | Defined by the FHIR Spec?    |  Description|
|------------------------|---|------------|
| \_outputFormat | Yes | Currently supports three values to align to the FHIR Spec: application/fhir+ndjson, application/ndjson, or just ndjson. All export jobs will return `ndjson` and the passed value has no effect on code behavior. |
| \_since | Yes | Allows you to only export resources that have been modified since the time provided |
| \_type | Yes | Allows you to specify which types of resources will be included. For example, \_type=Patient would return only patient resources|
| \_typeFilter | Yes | To request finer-grained filtering, you can use \_typeFilter along with the \_type parameter. The value of the _typeFilter parameter is a comma-separated list of FHIR queries that further restrict the results |
| \_container | No |  Specifies the container within the configured storage account where the data should be exported. If a container is specified, the data will be exported into a folder into that container. If the container isn't specified, the data will be exported to a new container. |

> [!Note]
> Only storage accounts in the same subscription as that for FHIR service are allowed to be registered as the destination for $export operations.
    
## Next steps

In this article, you've learned how to export FHIR resources using the $export command. For more information about how to set up and use de-identified export or how to export data from Azure API for FHIR to Azure Synapse Analytics, see
 
>[!div class="nextstepaction"]
>[Export de-identified data](de-identified-export.md)

>[!div class="nextstepaction"]
>[Copy data from the FHIR service to Azure Synapse Analytics](copy-to-synapse.md)
