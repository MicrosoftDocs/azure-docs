---
title: Executing the export by invoking $export command on Azure API for FHIR
description: This article describes how to export FHIR data using $export for Azure API for FHIR
author: expekesheth
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 06/03/2022
ms.author: kesheth
---

# Export FHIR data in Azure API for FHIR

The Bulk Export feature allows data to be exported from the FHIR Server per the [FHIR specification](https://hl7.org/fhir/uv/bulkdata/export/index.html). 

Before using $export, you'll want to make sure that the Azure API for FHIR is configured to use it. For configuring export settings and creating Azure storage account, refer to [the configure export data page](configure-export-data.md).

## Using $export command

After configuring the Azure API for FHIR for export, you can use the $export command to export the data out of the service. The data will be stored into the storage account you specified while configuring export. To learn how to invoke $export command in FHIR server, read documentation on the [HL7 FHIR $export specification](https://hl7.org/Fhir/uv/bulkdata/export/index.html).


**Jobs stuck in a bad state**

In some situations, there’s a potential for a job to be stuck in a bad state. This can occur especially if the storage account permissions haven’t been set up properly. One way to validate if your export is successful is to check your storage account to see if the corresponding container (that is, `ndjson`) files are present. If they aren’t present, and there are no other export jobs running, then there’s a possibility the current job is stuck in a bad state. You should cancel the export job by sending a cancellation request and try requeuing the job again. Our default run time for an export in bad state is 10 minutes before it will stop and move to a new job or retry the export. 

The Azure API For FHIR supports $export at the following levels:
* [System](https://hl7.org/Fhir/uv/bulkdata/export/index.html#endpoint---system-level-export): `GET https://<<FHIR service base URL>>/$export>>`
* [Patient](https://hl7.org/Fhir/uv/bulkdata/export/index.html#endpoint---all-patients): `GET https://<<FHIR service base URL>>/Patient/$export>>`
* [Group of patients*](https://hl7.org/Fhir/uv/bulkdata/export/index.html#endpoint---group-of-patients) - Azure API for FHIR exports all related resources but doesn't export the characteristics of the group: `GET https://<<FHIR service base URL>>/Group/[ID]/$export>>`

With export, data is exported in multiple files each containing resources of only one type. The number of resources in an individual file will be limited. The maximum number of resources is based on system performance. It is currently set to 50,000, but can change. The result is that you may get multiple files for a resource type, which will be enumerated (for example, `Patient-1.ndjson`, `Patient-2.ndjson`).

> [!NOTE] 
> `Patient/$export` and `Group/[ID]/$export` may export duplicate resources if the resource is in a compartment of more than one resource, or is in multiple groups.

In addition, checking the export status through the URL returned by the location header during the queuing is supported along with canceling the actual export job.

### Exporting FHIR data to ADLS Gen2

Currently we support $export for ADLS Gen2 enabled storage accounts, with the following limitation:

- User can’t take advantage of [hierarchical namespaces](../../storage/blobs/data-lake-storage-namespace.md), yet there isn't a way to target export to a specific subdirectory within the container. We only provide the ability to target a specific container (where we create a new folder for each export).
- Once an export is complete, we never export anything to that folder again, since subsequent exports to the same container will be inside a newly created folder.


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
| \_container | No |  Specifies the container within the configured storage account where the data should be exported. If a container is specified, the data will be exported into a folder into that container. If the container isn’t specified, the data will be exported to a new container. |
| \_till | No |  Allows you to only export resources that have been modified till the time provided. This parameter is applicable to only System-Level export. In this case, if historical versions have not been disabled or purged, export guarantees true snapshot view, or, in other words, enables time travel. |

> [!NOTE]
> Only storage accounts in the same subscription as that for Azure API for FHIR are allowed to be registered as the destination for $export operations.

## Secure Export to Azure Storage

Azure API for FHIR supports a secure export operation. Choose one of the two options below:

* Allowing Azure API for FHIR as a Microsoft Trusted Service to access the Azure storage account.
 
* Allowing specific IP addresses associated with Azure API for FHIR to access the Azure storage account. 
This option provides two different configurations depending on whether the storage account is in the same location as, or is in a different location from that of the Azure API for FHIR.

### Allowing Azure API for FHIR as a Microsoft Trusted Service

Select a storage account from the Azure portal, and then select the **Networking** blade. Select **Selected networks** under the **Firewalls and virtual networks** tab.

> [!IMPORTANT]
> Ensure that you’ve granted access permission to the storage account for Azure API for FHIR using its managed identity. For more information, see [Configure export setting and set up the storage account](../../healthcare-apis/fhir/configure-export-data.md).

:::image type="content" source="media/export-data/storage-networking.png" alt-text="Azure Storage Networking Settings." lightbox="media/export-data/storage-networking.png":::

Under the **Exceptions** section, select the box **Allow trusted Microsoft services to access this storage account** and save the setting. 

:::image type="content" source="media/export-data/exceptions.png" alt-text="Allow trusted Microsoft services to access this storage account.":::

You're now ready to export FHIR data to the storage account securely. Note that the storage account is on selected networks and isn’t publicly accessible. To access the files, you can either enable and use private endpoints for the storage account, or enable all networks for the storage account for a short period of time.

> [!IMPORTANT]
> The user interface will be updated later to allow you to select the Resource type for Azure API for FHIR and a specific service instance.

[!INCLUDE [Specific IP ranges for storage account](../includes/common-ip-address-storage-account.md)]
    
## Next steps

In this article, you've learned how to export FHIR resources using $export command. Next, to learn how to export de-identified data, see
 
>[!div class="nextstepaction"]
>[Export de-identified data](de-identified-export.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
