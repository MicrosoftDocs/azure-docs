---
title: Executing the export by invoking $export command on Azure API for FHIR
description: This article describes how to export FHIR data using $export
author: caitlinv39
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 2/19/2021
ms.author: cavoeg
---
# How to export FHIR data


The Bulk Export feature allows data to be exported from the FHIR Server per the [FHIR specification](https://hl7.org/fhir/uv/bulkdata/export/index.html). 

Before using $export, you will want to make sure that the Azure API for FHIR is configured to use it. For configuring export settings and creating Azure storage account, refer to [the configure export data page](configure-export-data.md).

## Using $export command

After configuring the Azure API for FHIR for export, you can use the $export command to export the data out of the service. The data will be stored into the storage account you specified while configuring export. To learn how to invoke $export command in FHIR server, read documentation on the [HL7 FHIR $export specification](https://hl7.org/Fhir/uv/bulkdata/export/index.html).


**Jobs stuck in a bad state**

In some situations, there is a potential for a job to be stuck in a bad state. This can occur especially if the storage account permissions have not been setup properly. One way to validate if your export is successful is to check your storage account to see if the corresponding container (that is, ndjson) files are present. If they are not present, and there are no other export jobs running, then there is a possibility the current job is stuck in a bad state. You should cancel the export job by sending a cancellation request and try re-queuing the job again. Our default run time for an export in bad state is 10 minutes before it will stop and move to a new job or retry the export. 

The Azure API For FHIR supports $export at the following levels:
* [System](https://hl7.org/Fhir/uv/bulkdata/export/index.html#endpoint---system-level-export): `GET https://<<FHIR service base URL>>/$export>>`
* [Patient](https://hl7.org/Fhir/uv/bulkdata/export/index.html#endpoint---all-patients): `GET https://<<FHIR service base URL>>/Patient/$export>>`
* [Group of patients*](https://hl7.org/Fhir/uv/bulkdata/export/index.html#endpoint---group-of-patients) - Azure API for FHIR exports all related resources but does not export the characteristics of the group: `GET https://<<FHIR service base URL>>/Group/[ID]/$export>>`

When data is exported, a separate file is created for each resource type. To ensure that the exported files don't become too large, we create a new file after the size of a single exported file becomes larger than 64 MB. The result is that you may get multiple files for each resource type, which will be enumerated (i.e. Patient-1.ndjson, Patient-2.ndjson). 


> [!Note] 
> `Patient/$export` and `Group/[ID]/$export` may export duplicate resources if the resource is in a compartment of more than one resource, or is in multiple groups.

In addition, checking the export status through the URL returned by the location header during the queuing is supported along with canceling the actual export job.

### Exporting FHIR data to ADLS Gen2

Currently we support $export for ADLS Gen2 enabled storage accounts, with the following limitation:

- User cannot take advantage of [hierarchical namespaces](https://docs.microsoft.com/azure/storage/blobs/data-lake-storage-namespace) yet; there isn't a way to target export to a specific sub-directory within the container. We only provide the ability to target a specific container (where we create a new folder for each export).

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
| \_container | No |  Specifies the container within the configured storage account where the data should be exported. If a container is specified, the data will be exported to that container in a new folder with the name. If the container is not specified, it will be exported to a new container using timestamp and job ID. |

## Secure Export to Azure Storage

Azure API for FHIR supports a secure export operation. One option to run
a secure export is to permit specific IP addresses associated with Azure API for FHIR to access the Azure storage account. Depending on whether the storage account is in the same or a different location from that of the
Azure API for FHIR, the configurations are different.

### When the Azure storage account is in a different region

Select the networking blade of the Azure storage account from the
portal. 

   :::image type="content" source="media/export-data/storage-networking.png" alt-text="Azure Storage Networking Settings." lightbox="media/export-data/storage-networking.png":::
   
Select "Selected networks" and specify the IP address in the
**Address range** box under the section of Firewall \| Add IP ranges to
allow access from the internet or your on-premises networks. You can
find the IP address from the table below for the Azure region where the
Azure API for FHIR service is provisioned.

|**Azure Region**         |**Public IP Address** |
|:----------------------|:-------------------|
| Australia East       | 20.53.44.80       |
| Canada Central       | 20.48.192.84      |
| Central US           | 52.182.208.31     |
| East US              | 20.62.128.148     |
| East US 2            | 20.49.102.228     |
| East US 2 EUAP       | 20.39.26.254      |
| Germany North        | 51.116.51.33      |
| Germany West Central | 51.116.146.216    |
| Japan East           | 20.191.160.26     |
| Korea Central        | 20.41.69.51       |
| North Central US     | 20.49.114.188     |
| North Europe         | 52.146.131.52     |
| South Africa North   | 102.133.220.197   |
| South Central US     | 13.73.254.220     |
| Southeast Asia       | 23.98.108.42      |
| Switzerland North    | 51.107.60.95      |
| UK South             | 51.104.30.170     |
| UK West              | 51.137.164.94     |
| West Central US      | 52.150.156.44     |
| West Europe          | 20.61.98.66       |
| West US 2            | 40.64.135.77      |

### When the Azure storage account is in the same region

The configuration process is the same as above except a specific IP
address range in CIDR format is used instead, 100.64.0.0/10. The reason why the IP address range, which includes 100.64.0.0 – 100.127.255.255, must be specified is because the actual IP address used by the service varies, but will be within the range, for each $export request.

> [!Note] 
> It is possible that a private IP address within the range of 10.0.2.0/24 may be used instead. In that case the $export operation will not succeed. You can retry the $export request but there is no guarantee that an IP address within the range of 100.64.0.0/10 will be used next time. That's the known networking behavior by design. The alternative is to configure the storage account in a different region.
    
## Next steps

In this article, you learned how to export FHIR resources using $export command. Next, learn how to export de-identified data:
 
>[!div class="nextstepaction"]
>[Export de-identified data](de-identified-export.md)
