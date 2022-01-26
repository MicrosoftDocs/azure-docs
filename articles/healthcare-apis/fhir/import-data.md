---
title: Executing the import by invoking $import command on FHIR service
description: This article describes how to import FHIR data using $import
author: ranvijaykumar
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 12/06/2021
ms.author: cavoeg
---
# How to import FHIR data


The Bulk import feature allows data to be imported from the FHIR Server per the [FHIR specification](https://hl7.org/fhir/uv/bulkdata/import/index.html). 

Before using $import, you'll want to make sure that the FHIR service is configured to use it. For configuring import settings and creating Azure storage account, refer to [the configure import data page](configure-import-data.md).

## Using $import command

After configuring the FHIR service for import, you can use the $import command to import the data into the service. The data will be stored into fhir service in the storage account you specified while configuring import. 


**Get import status**

As the import is a long running task, users always need to know the status of the import job, for checking its healthy or getting the progress, use can use Rest Api to get the latest status.  

The FHIR service supports $import with the following format:
 `POST https://<<FHIR service base URL>>/$import>>`

For each call, a **callback** will be returned in the location header, user can get this URL for checking status, below is the interpreted information from the response:

| Response code      | Reponse body |Description |
| ----------- | -----------  |-----------  |
| 202 Accepted | |The operation is still running.|
| 200 OK |The response body does not contain any error.url entry|All resources were imported successfully.|
| 200 OK |The response body contains some error.url entry|Error occurred while importing some of the resources. See the files located at error.url for the details. Rest of the resources were imported successfully.|
| Other||A fatal error occurred and the operation has stopped. Successfully imported resources have not been rolled back. For more information, see the [Troubleshooting](#troubleshooting) section.|

Below are some of the important fields in the response body:

| Field | Description |
| ----------- | ----------- |
|transactionTime|Start time of the bulk import operation.|
|output.count|Count of resources that were successfully imported|
|error.count|Count of resources that were not imported due to some error|
|error.url|URL of the file containing details of the error. Each error.url is unique to an input URL. |

To import data to storage accounts behind the firewalls, see [Configure settings for import](configure-import-data.md).

## Settings and parameters

### Headers
There are three required header parameters that must be set for $import jobs.
* **Content-Type** - application/fhir+json
* **Prefer** - respond-async

### Body
The body of $import jobs contains three parts.

| Body Parameter      | Description | Card. |  Accepted values |
| ----------- | ----------- | ----------- | ----------- |
| inputFormat      | String representing the name of the data source format. Currently only FHIR NDJSON files are supported. | 1..1 | ```application/fhir+ndjson``` |
| mode      | Import mode. Currently only initial load mode is supported. | 1..1 | ```InitialLoad``` |
| input   | Details of the input files. | 1..* | A JSON array with 3 parts described in the table below. |

And for each input part, it also has three child nodes.  
| Input part name   | Description | Card. |  Accepted values |
| ----------- | ----------- | ----------- | ----------- |
| type   |  Resource type of input file   | 1..1 |  A valid [FHIR resource type](https://www.hl7.org/fhir/resourcelist.html) that match the input file. |
| URL   |  Azure storage url of input file   | 1..1 | URL value of the input file that can't be modified. |
| etag   |  Etag of the input file on Azure storage used to verify the file content has not changed. | 0..1 |  Etag value of the input file that can't be modified. |

> [!Note]
> Only storage accounts in the same tenant as that for FHIR service are allowed to be registered as the destination for $import operations.
    
## Next steps

In this article, you've learned how to import FHIR resources using the $import command. 