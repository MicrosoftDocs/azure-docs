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

After configuring the Azure API for FHIR for export, you can use the $export command to export the data out of the service. The data will be stored into the storage account you specified while configuring export. To learn how to invoke $export command in FHIR server, read documentation on the [$export specification](https://hl7.org/Fhir/uv/bulkdata/export/index.html). 

The $export command in Azure API for FHIR takes an optional _\_container_ parameter that specifies the container within the configured storage account where the data should be exported. If a container is specified, the data will be exported to that container in a new folder with the name. If the container is not specified, it will be exported to a new container with a randomly generated name. 

`https://<<FHIR service base URL>>/$export?_container=<<container_name>>`

## Supported scenarios

Azure API for FHIR supports $export at the system, patient, and group level. For group export, we export all related resources but do not export the characteristics of the group.

> [!Note] 
> $export will export duplicate resources if the resource is in a compartment of more than one resource, or is in multiple groups.

In addition, checking the export status through the URL returned by the location header during the queuing is supported along with canceling the actual export job is supported.

## Next steps

In this article, you learned how to export FHIR resources using $export command. Next, you can review our supported features:
 
>[!div class="nextstepaction"]
>[Supported features](fhir-features-supported.md)
