---
title: Executing the export by invoking $export command on Azure API for FHIR
description: This article describes how to export FHIR data using $export
author: matjazl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 8/26/2020
ms.author: matjazl
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



> [!Note] 
> $export will export duplicate resources if the resource is in a compartment of more than one resource, or is in multiple groups.

In addition, checking the export status through the URL returned by the location header during the queuing is supported along with canceling the actual export job is supported.

## Settings and parameters

### Headers
There are two required header parameters that must be set for $export jobs. The values are defined by the current [$export specification](https://hl7.org/Fhir/uv/bulkdata/export/index.html#headers).
* **Accept** - application/fhir+json
* **Prefer** - respond-async

### Query parameters
The Azure API for FHIR supports the following query parameters. All of these are optional:
|Query parameter        | Defined by the FHIR Spec?    |  Description|
|------------------------|---|------------|
| \_outputFormat | Yes | The format for the requested bulk data files to be generated as per [FHIR Asynchronous Request Pattern](http://hl7.org/fhir/async.html). Defaults to application/fhir+ndjson. |
| \_since | Yes | Allows you to only export resources that have been modified since the time provided |
| \_type | Yes | Allows you to specify which types of resources will included. For example, \_type=Patient would return only patient resources|
| \_typefilter | Yes | To request finer-grained filtering, you can use \_typefilter along with the \_type parameter. The value of the _typeFilter parameter is a comma-separated list of FHIR queries that further restrict the results |
| \_format | No | Allows a user to select a format for the file structure that the export job creates. Different formats can be defined in the appSettings by combining constants, folder level breaks ('/') and known tags. The tags will be replaced with data when the job is run. The three supported tags are **resourcename** (replaces with the resource type being exported), **timestamp** (replaces with a timestamp of the job's queried time), and **id** (replaces with the GUID of the export job)|
| \_container | No |  Specifies the container within the configured storage account where the data should be exported. If a container is specified, the data will be exported to that container in a new folder with the name. If the container is not specified, it will be exported to a new container with a randomly generated name. |






## Next steps

In this article, you learned how to export FHIR resources using $export command. Next, learn how to export de-identified data:
 
>[!div class="nextstepaction"]
>[Export de-identified data](de-identified-export.md)
