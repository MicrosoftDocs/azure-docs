---
title: Executing the export by invoking $export command on Azure API for FHIR
description: This article describes how to set up and use de-identified export
author: matjazl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 8/26/2020
ms.author: matjazl
---
# How to export FHIR data

Before using $export, you will want to make sure that the Azure API for FHIR is configured to use it. For configuring export settings and creating Azure storage account, refer to [the configure export data page](configure-export-data.md).

## Using $export command

After configuring the Azure API for FHIR for export, you can use the $export command to export the data out of the service. The data will be stored into the storage account you specified while configuring export. To learn how to invoke $export command in FHIR server, read documentation on the [$export specification](https://hl7.org/Fhir/uv/bulkdata/export/index.html). 

The $export command in Azure API for FHIR takes an optional _\_container_ parameter that specifies the container within the configured storage account where the data should be exported.

`https://<<FHIR service base URL>>/$export?_container=<<container_name>>`

## Supported scenarios

Azure API for FHIR supports $export at the system, patient, and group level. For group export, we export all related resources but do not export the characteristics of the group.

> [!Note] 
> $export will export duplicate resources if the resource is in a compartment of more than one resource, or is in multiple groups.

## Next steps

In this article, you learned how to export FHIR resources using $export command. Next, you can review our supported features:
 
>[!div class="nextstepaction"]
>[Supported features](fhir-features-supported.md)
