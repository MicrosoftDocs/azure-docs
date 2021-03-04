---
title: Executing the export by invoking $export command on Azure API for FHIR
description: This article describes how to export FHIR data using $export
author: caitlinv39
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 1/21/2021
ms.author: cavoeg
---
# How to export FHIR data


The Bulk Export feature allows data to be exported from the FHIR Server per the [FHIR specification](https://hl7.org/fhir/uv/bulkdata/export/index.html). 

Before using $export, you will want to make sure that the Azure API for FHIR is configured to use it. For configuring export settings and creating Azure storage account, refer to [the configure export data page](configure-export-data.md).

## Using $export command

After configuring the Azure API for FHIR for export, you can use the $export command to export the data out of the service. The data will be stored into the storage account you specified while configuring export. To learn how to invoke $export command in FHIR server, read documentation on the [HL7 FHIR $export specification](https://hl7.org/Fhir/uv/bulkdata/export/index.html). 

The Azure API For FHIR supports $export at the following levels:
* [System](https://hl7.org/Fhir/uv/bulkdata/export/index.html#endpoint---system-level-export): `GET https://<<FHIR service base URL>>/$export>>`
* [Patient](https://hl7.org/Fhir/uv/bulkdata/export/index.html#endpoint---all-patients): `GET https://<<FHIR service base URL>>/Patient/$export>>`
* [Group of patients*](https://hl7.org/Fhir/uv/bulkdata/export/index.html#endpoint---group-of-patients) - Azure API for FHIR exports all related resources but does not export the characteristics of the group: `GET https://<<FHIR service base URL>>/Group/[ID]/$export>>`

When data is exported, a separate file is created for each resource type. To ensure that the exported files don't become too large, we create a new file after the size of a single exported file becomes larger than 64 MB. The result is that you may get multiple files for each resource type, which will be enumerated (i.e. Patient-1.ndjson, Patient-2.ndjson). 


> [!Note] 
> `Patient/$export` and `Group/[ID]/$export` may export duplicate resources if the resource is in a compartment of more than one resource, or is in multiple groups.

In addition, checking the export status through the URL returned by the location header during the queuing is supported along with canceling the actual export job.



## Settings and parameters

### Headers
There are two required header parameters that must be set for $export jobs. The values are defined by the current [$export specification](https://hl7.org/Fhir/uv/bulkdata/export/index.html#headers).
* **Accept** - application/fhir+json
* **Prefer** - respond-async

### Query parameters
The Azure API for FHIR supports the following query parameters. All of these parameters are optional:

|Query parameter        | Defined by the FHIR Spec?    |  Description|
|------------------------|---|------------|
| \_outputFormat | Yes | Currently supports three values to align to the FHIR Spec: application/fhir+ndjson, application/ndjson, or just ndjson. All export jobs will return `ndjson` and the passed value has no effect on code behavior. |
| \_since | Yes | Allows you to only export resources that have been modified since the time provided |
| \_type | Yes | Allows you to specify which types of resources will be included. For example, \_type=Patient would return only patient resources|
| \_typefilter | Yes | To request finer-grained filtering, you can use \_typefilter along with the \_type parameter. The value of the _typeFilter parameter is a comma-separated list of FHIR queries that further restrict the results |
| \_container | No |  Specifies the container within the configured storage account where the data should be exported. If a container is specified, the data will be exported to that container in a new folder with the name. If the container is not specified, it will be exported to a new container using timestamp and job ID. |


## Next steps

In this article, you learned how to export FHIR resources using $export command. Next, learn how to export de-identified data:
 
>[!div class="nextstepaction"]
>[Export de-identified data](de-identified-export.md)
