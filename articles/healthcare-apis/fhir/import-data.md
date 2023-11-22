---
title: Executing the import by invoking $import operation on FHIR service in Azure Health Data Services
description: This article describes how to import FHIR data using $import.
author: expekesheth  
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: how-to
ms.date: 06/06/2022
ms.author: kesheth
---


# Import Operation
Import operation enables loading Fast Healthcare Interoperability Resources (FHIR&#174;) data to the FHIR server at high throughput. Import supports both initial and incremental data load into FHIR server. 


There are two modes of $import supported today- 
* Initial mode
1. Initial mode is intended to load FHIR resources into an empty FHIR server.
1. Initial mode only supports CREATE operations and, when enabled, blocks API writes to the FHIR server.
* Incremental mode
1. Incremental mode is optimized to load data into FHIR server periodically and doesn't block writes via API.
1. Incremental mode allows you to load lastUpdated and versionId from resource Meta (if present in resource JSON).
   Incase
   * Import files do not have version and lastUpdated field values specified, there is no guarantee of importing resources in FHIR service.
   * Import files have resources with duplicate version with lastUpdate field values, then only one resource is ingested in FHIR service.
1. Incremental mode allows you to ingest soft deleted resources. This capability is beneficial in case you would like to migrate from Azure API for FHIR to Azure Health Data Services, FHIR service.


Note: 
* Import operation does not support conditional references in resources. 
* During import operation, If multiple resources share the same resource ID, then only one of those resources is imported at random. There is an error logged for the resources sharing the same resource ID.


## Using $import operation

> [!NOTE]
> You must have the **FHIR Data Importer** role on the FHIR server to use $import. 

To use $import, you need to configure the FHIR server using the instructions in the [Configure import settings](configure-import-data.md) article.
The FHIR data to be imported must be stored in resource specific files in FHIR NDJSON format on the Azure blob store. 

For import operation, ensure
* All the resources in a file must be of the same type. You may have multiple files per resource type.
* The data to be imported must be in the same Tenant as of the FHIR service.
* Maximum number of files to be imported per operation is 10,000.


### Calling $import

Make a ```POST``` call to ```<<FHIR service base URL>>/$import``` with the request header and body shown:

#### Request Header

```http
Prefer:respond-async
Content-Type:application/fhir+json
```

#### Body

| Parameter Name      | Description | Card. |  Accepted values |
| ----------- | ----------- | ----------- | ----------- |
| inputFormat      | String representing the name of the data source format. Currently only FHIR NDJSON files are supported. | 1..1 | ```application/fhir+ndjson``` |
| mode      | Import mode value | 1..1 | For initial import use ```InitialLoad``` mode value. For incremental import mode use ```IncrementalLoad``` mode value. If no mode value is provided, IncrementalLoad mode value is considered by default. |
| input   | Details of the input files. | 1..* | A JSON array with three parts described in the table below. |

| Input part name   | Description | Card. |  Accepted values |
| ----------- | ----------- | ----------- | ----------- |
| type   |  Resource type of input file   | 1..1 |  A valid [FHIR resource type](https://www.hl7.org/fhir/resourcelist.html) that matches the input file. |
|URL   |  Azure storage url of input file   | 1..1 | URL value of the input file that can't be modified. |
| etag   |  Etag of the input file on Azure storage used to verify the file content hasn't changed. | 0..1 |  Etag value of the input file that can't be modified. |

**Sample body for import:**

```json
{
    "resourceType": "Parameters",
    "parameter": [
        {
            "name": "inputFormat",
            "valueString": "application/fhir+ndjson"
        },
        {
            "name": "mode",
            "valueString": <Use "InitialLoad" for initial mode import / Use "IncrementalLoad" for incremental mode import>
        },
        {
            "name": "input",
            "part": [
                {
                    "name": "type",
                    "valueString": "Patient"
                },
                {
                    "name": "url",
                    "valueUri": "https://example.blob.core.windows.net/resources/Patient.ndjson"
                },
                {
                    "name": "etag",
                    "valueUri": "0x8D92A7342657F4F"
                }
            ]
        },
        {
            "name": "input",
            "part": [
                {
                    "name": "type",
                    "valueString": "CarePlan"
                },
                {
                    "name": "url",
                    "valueUri": "https://example.blob.core.windows.net/resources/CarePlan.ndjson"
                }
            ]
        }
    ]
}
```

### Checking import status

Once $import is initiated, an empty response body with a **callback** link is returned in the `Content-location` header of the response together with ```202-Accepted``` status code. Store  this callback link to check the import status.

To check import status, make the REST call with the ```GET``` method to the **callback** link returned in the previous step.
You can interpret the response using the following table:

| Response code      | Response body |Description |
| ----------- | -----------  |-----------  |
| 202 Accepted | |The operation is still running.|
| 200 OK |The response body doesn't contain any error.url entry|All resources were imported successfully.|
| 200 OK |The response body contains some error.url entry|Error occurred while importing some of the resources. See the files located at error.url for the details. Rest of the resources were imported successfully.|
| Other||A fatal error occurred and the operation has stopped. Successfully imported resources haven't been rolled back.|

Table below provides some of the important fields in the response body:

| Field | Description |
| ----------- | ----------- |
|transactionTime|Start time of the bulk-import operation.|
|output.count|Count of resources that were successfully imported|
|error.count|Count of resources that weren't imported due to some error|
|error.url|URL of the file containing details of the error. Each error.url is unique to an input URL. |

**Sample response:**

```json
{
    "transactionTime": "2021-07-16T06:46:52.3873388+00:00",
    "request": "https://importperf.azurewebsites.net/$Import",
    "output": [
        {
            "type": "Patient",
            "count": 10000,
            "inputUrl": "https://example.blob.core.windows.net/resources/Patient.ndjson"
        },
        {
            "type": "CarePlan",
            "count": 199949,
            "inputUrl": "https://example.blob.core.windows.net/resources/CarePlan.ndjson"
        }
    ],
    "error": [
        { 
        "type": "OperationOutcome",
        "count": 51,
        "inputUrl": "https://example.blob.core.windows.net/resources/CarePlan.ndjson",
        "url": "https://example.blob.core.windows.net/fhirlogs/CarePlan06b88c6933a34c7c83cb18b7dd6ae3d8.ndjson"
        }
    ]
}
```
### Ingestion of soft deleted resources
Incremental mode import supports ingestion of soft deleted resources. You need to use the extension to ingest soft deleted resources in FHIR service 

**Sample body for import with soft deleted resources:**

To validate soft deleted resources in FHIR service, you need to perform history search on the resource.
If the ID of the resource that was deleted is known, use the following URL pattern:

```json
<FHIR_URL>/<resource-type>/<resource-id>/_history
```

Incase the ID of the resource isn't known, do a history search on the entire resource type:
```json
<FHIR_URL>/<resource-type>/_history
```

## Troubleshooting

Lets walk-through solutions to some error codes you may encounter during the import operation.

### 200 OK, but there's an error with the URL in the response

**Behavior:** Import operation succeeds and returns ```200 OK```. However, `error.url` are present in the response body. Files present at the `error.url` location contain JSON fragments similar to below example:

```json
{
    "resourceType": "OperationOutcome",
    "issue": [
        {
            "severity": "error",
            "details": {
                "text": "Given conditional reference '{0}' does'nt resolve to a resource."
            },
            "diagnostics": "Failed to process resource at line: {0} with stream start offset: {1}"
        }
    ]
}
```

**Cause:** NDJSON files contain resources with conditional references, which are currently not supported by $import.

**Solution:** Replace the conditional references to normal references in the NDJSON files.

### 400 Bad Request

**Behavior:** Import operation failed and ```400 Bad Request``` is returned. Response body has the following content:

```json
{
    "resourceType": "OperationOutcome",
    "id": "13876ec9-3170-4525-87ec-9e165052d70d",
    "issue": [
        {
            "severity": "error",
            "code": "processing",
            "diagnostics": "import operation failed for reason: No such host is known. (example.blob.core.windows.net:443)"
        }
    ]
}
```

**Solution:** Verify the link to the Azure storage is correct. Check the network and firewall settings to make sure that the FHIR server is able to access the storage. If your service is in a VNet, ensure that the storage is in the same VNet or in a VNet that has peering with the FHIR service VNet.

### 403 Forbidden

**Behavior:** Import operation failed and ```403 Forbidden``` is returned. The response body has the following content:

```json
{
    "resourceType": "OperationOutcome",
    "id": "bd545acc-af5d-42d5-82c3-280459125033",
    "issue": [
        {
            "severity": "error",
            "code": "processing",
            "diagnostics": "import operation failed for reason: Server failed to authenticate the request. Make sure the value of Authorization header is formed correctly including the signature."
        }
    ]
}
```

**Cause:** We use managed identity for source storage auth. This error may be caused by a missing or wrong role assignment.

**Solution:** Assign _Storage Blob Data Contributor_ role to the FHIR server following [the RBAC guide.](../../role-based-access-control/role-assignments-portal.md?tabs=current)

### 500 Internal Server Error

**Behavior:** Import operation failed and ```500 Internal Server Error``` is returned. Response body has the following content:

```json
{
    "resourceType": "OperationOutcome",
    "id": "0d0f007d-9e8e-444e-89ed-7458377d7889",
    "issue": [
        {
            "severity": "error",
            "code": "processing",
            "diagnostics": "import operation failed for reason: The database '****' has reached its size quota. Partition or delete data, drop indexes, or consult the documentation for possible resolutions."
        }
    ]
}
```

**Cause:** You've reached the storage limit of the FHIR service.

**Solution:** Reduce the size of your data or consider Azure API for FHIR, which has a higher storage limit.

## Next steps

In this article, you've learned about how the import operation enables importing FHIR data to the FHIR server at high throughput. For more information about converting data to FHIR, exporting settings to set up a storage account, and moving data to Azure Synapse, see


>[!div class="nextstepaction"]
>[Converting your data to FHIR](convert-data.md)

>[!div class="nextstepaction"]
>[Configure export settings and set up a storage account](configure-export-data.md)

>[!div class="nextstepaction"]
>[Copy data from Azure API for FHIR to Azure Synapse Analytics](copy-to-synapse.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
