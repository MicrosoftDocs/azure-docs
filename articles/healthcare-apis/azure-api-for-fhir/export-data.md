---
title: Executing the export by invoking $export command on Azure API for FHIR
description: This article describes how to export FHIR data using $export for Azure API for FHIR
author: expekesheth
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: reference
ms.date: 9/27/2023
ms.author: kesheth
---

# Export FHIR data in Azure API for FHIR

[!INCLUDE[retirement banner](../includes/healthcare-apis-azure-api-fhir-retirement.md)]

The Bulk Export feature allows data to be exported from the FHIR&reg; Server per the [FHIR specification](https://www.hl7.org/fhir/uv/bulkdata/). 

Before using `$export`, make sure that the Azure API for FHIR is configured to use it. For configuring export settings and creating an Azure storage account, refer to the [configure export data page](configure-export-data.md).

> [!NOTE]
> Only storage accounts in the same subscription as that for Azure API for FHIR are allowed to be registered as the destination for $export operations.

## Using $export command

After configuring the Azure API for FHIR for export, you can use the `$export` command to export the data out of the service. The data is stored in the storage account you specified while configuring export. To learn how to invoke the `$export` command in FHIR server, read documentation in the [HL7 FHIR $export specification](https://www.hl7.org/fhir/uv/bulkdata/).


**Jobs stuck in a bad state**

In some situations, a job may get stuck in a bad state. This can occur if the storage account permissions haven’t been set up properly. One way to validate an export is to check your storage account to see if the corresponding container (that is, `ndjson`) files are present. If they aren’t present, and there are no other export jobs running, then it's possible the current job is stuck in a bad state. You should cancel the export job by sending a cancellation request and try requeuing the job again. Our default run time for an export in bad state is 10 minutes before it will stop and move to a new job or retry the export. 

The Azure API For FHIR supports `$export` at the following levels:
* [System](https://www.hl7.org/fhir/uv/bulkdata/): `GET https://<<FHIR service base URL>>/$export>>`
* [Patient](https://www.hl7.org/fhir/uv/bulkdata/): `GET https://<<FHIR service base URL>>/Patient/$export>>`
* [Group of patients*](https://www.hl7.org/fhir/uv/bulkdata/) - Azure API for FHIR exports all related resources but doesn't export the characteristics of the group: `GET https://<<FHIR service base URL>>/Group/[ID]/$export>>`

Data is exported in multiple files, each containing resources of only one type. The number of resources in an individual file will be limited. The maximum number of resources is based on system performance. It's currently set to 5,000, but can change. The result is that you might get multiple files for a resource type. The file names follow the format 'resourceName-number-number.ndjson'. The order of the files isn't guaranteed to correspond to any ordering of the resources in the database.

> [!NOTE] 
> `Patient/$export` and `Group/[ID]/$export` may export duplicate resources if the resource is in a compartment of more than one resource, or is in multiple groups.

In addition, checking the export status through the URL returned by the location header during the queuing is supported, along with canceling the actual export job.

### Exporting FHIR data to ADLS Gen2

Currently we support `$export` for ADLS Gen2 enabled storage accounts, with the following limitations:

- Users can’t take advantage of [hierarchical namespaces](../../storage/blobs/data-lake-storage-namespace.md) - there isn't a way to target an export to a specific subdirectory within a container. We only provide the ability to target a specific container (where a new folder is created for each export).
- Once an export is complete, nothing is ever exported to that folder again. Subsequent exports to the same container will be inside a newly created folder.


## Settings and parameters

### Headers
There are two required header parameters that must be set for `$export` jobs. The values are defined by the current [$export specification](https://www.hl7.org/fhir/uv/bulkdata/).
* **Accept** - application/fhir+json
* **Prefer** - respond-async

### Query parameters
The Azure API for FHIR supports the following query parameters. All of these parameters are optional.

|Query parameter        | Defined by the FHIR Spec?    |  Description|
|------------------------|---|------------|
| \_outputFormat | Yes | Currently supports three values to align to the FHIR Spec: application/fhir+ndjson, application/ndjson, or ndjson. All export jobs return `ndjson` and the passed value has no effect on code behavior. |
| \_since | Yes | Allows you to only export resources that have been modified since the time provided. |
| \_type | Yes | Allows you to specify which types of resources will be included. For example, \_type=Patient would return only patient resources.|
| \_typefilter | Yes | To request finer-grained filtering, you can use \_typefilter along with the \_type parameter. The value of the _typeFilter parameter is a comma-separated list of FHIR queries that further restrict the results. |
| \_container | No |  Specifies the container within the configured storage account where the data should be exported. If a container is specified, the data is exported into a folder in that container. If the container isn’t specified, the data is exported to a new container. |
| \_till | No |  Allows you to only export resources that have been modified up to the time provided. This parameter is only applicable to System-Level export. In this case, if historical versions haven't been disabled or purged, export guarantees a true snapshot view. In other words, enables time travel. |
|includeAssociatedData | No | Allows you to export history and soft deleted resources. This filter doesn't work with the '_typeFilter' query parameter. Include the value as '_history' to export history (non-latest versioned) resources. Include the value as '_deleted' to export soft deleted resources. |
|\_isparallel| No |The "_isparallel" query parameter can be added to the export operation to enhance its throughput. The value needs to be set to true to enable parallelization. Note: Using this parameter may result in an increase in request units consumption over the life of export. |

> [!NOTE]
> There is a known issue with the `$export` operation that could result in incomplete exports with status success. The issue occurs when the is_parallel flag was used. Export jobs executed with _isparallel query parameter starting February 13th, 2024 are impacted with this issue. 

## Secure Export to Azure Storage

Azure API for FHIR supports a secure export operation. Choose one of the following two options.

* Allowing Azure API for FHIR as a Microsoft Trusted Service to access the Azure storage account.
 
* Allowing specific IP addresses associated with Azure API for FHIR to access the Azure storage account. 
This option provides two different configurations depending on whether the storage account is in the same or different location as the Azure API for FHIR.

### Allowing Azure API for FHIR as a Microsoft Trusted Service

Select a storage account from the Azure portal, and then select the **Networking** blade. Select **Selected networks** under the **Firewalls and virtual networks** tab.

> [!IMPORTANT]
> Ensure that you’ve granted access permission to the storage account for Azure API for FHIR using its managed identity. For more information, see [Configure export setting and set up the storage account](../../healthcare-apis/fhir/configure-export-data.md).

:::image type="content" source="media/export-data/storage-networking.png" alt-text="Azure Storage Networking Settings." lightbox="media/export-data/storage-networking.png":::

Under the **Exceptions** section, select the box **Allow trusted Microsoft services to access this storage account** and save the setting. 

:::image type="content" source="media/export-data/exceptions.png" alt-text="Allow trusted Microsoft services to access this storage account.":::

You're now ready to export FHIR data to the storage account securely. Note: The storage account is on selected networks and isn’t publicly accessible. To access the files, you can either enable and use private endpoints for the storage account, or enable all networks for the storage account for a short period of time.

> [!IMPORTANT]
> The user interface will be updated later to allow you to select the Resource type for Azure API for FHIR and a specific service instance.

[!INCLUDE [Specific IP ranges for storage account](../includes/common-ip-address-storage-account.md)]
    
## Next steps

In this article, you learned how to export FHIR resources using `$export` command. Next, to learn how to export de-identified data, see
 
>[!div class="nextstepaction"]
>[Export de-identified data](de-identified-export.md)

[!INCLUDE[FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]