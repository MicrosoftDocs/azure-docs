---
title: Import data into the FHIR service in Azure Health Data Services
description: Learn how to import data into the FHIR service for Azure Health Data Services.
author: expekesheth  
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: how-to
ms.date: 02/06/2024
ms.author: kesheth
---

# Import FHIR data

The `import` operation allows you to ingest FHIR&reg; data into the FHIR server with high throughput.

## Import operation modes

The `import` operation supports two modes: initial mode and incremental mode. Each mode has different features and use cases.

#### Initial mode

- Intended for loading FHIR resources into an empty FHIR server.

- Only supports `create` operations and when enabled, blocks API writes to the FHIR server.

#### Incremental mode

- Optimized for loading data into the FHIR server periodically and doesn't block writes through the API.

- Allows you to load `lastUpdated` and `versionId` from resource metadata if present in the resource JSON.
   
   * If import files don't have the `version` and `lastUpdated` field values specified, there's no guarantee of importing resources in FHIR service.

   * If import files have resources with duplicate `version` and `lastUpdated` field values, then only one resource is randomly ingested in the FHIR service.

- Allows you to ingest soft deleted resources. This capability is beneficial when you migrate from Azure API for FHIR to the FHIR service in Azure Health Data Services.

> [!IMPORTANT]
> The `import` operation doesn't support conditional references in resources. 
>
> Also, if multiple resources share the same resource ID, then only one of those resources is imported at random. An error is logged for the resources sharing the same resource ID.

This table shows the difference between import modes
|Areas|Initial mode  |Incremental mode  |
|:------------- |:-------------|:-----|
|Capability|Initial load of data into FHIR service|Continuous ingestion of data into FHIR service (Incremental or Near Real Time).|
|Concurrent API calls|Blocks concurrent write operations|Data can be ingested concurrently while executing API CRUD operations on the FHIR server.|
|Ingestion of versioned resources|Not supported|Enables ingestion of  multiple versions of FHIR resources in single batch while maintaining resource history.|
|Retain lastUpdated field value|Not supported|Retain the lastUpdated field value in FHIR resources during the ingestion process.|
|Billing| Does not incur any charge|Incurs charges based on successfully ingested resources. Charges are incurred per API pricing.|

## Performance considerations

To achieve the best performance with the `import` operation, consider these factors:

- **Use large files for import.** The file size of a single `import` operation should be more than 200 MB. Smaller files might result in slower import times.

- **Import FHIR resource files as a single batch.** For optimal performance, import all the FHIR resource files that you want to ingest in the FHIR server in one `import` operation. Importing all the files in one operation reduces the overhead of creating and managing multiple import jobs.

- **Limit the number of parallel import jobs.** You can run multiple `import` jobs at the same time, but running multiple jobs might affect the overall throughput of the import operation. The FHIR server can handle up to five parallel `import` jobs. If you exceed this limit, the FHIR server might throttle or reject your requests.

## Perform the import operation

### Prerequisites

- You need the **FHIR Data Importer** role on the FHIR server to use the `import` operation. 

- Configure the FHIR server. The FHIR data must be stored in resource-specific files in FHIR NDJSON format on the Azure blob store. For more information, see [Configure import settings](configure-import-data.md).

- All the resources in a file must be the same type. You can have multiple files per resource type.

- The data must be in the same tenant as the FHIR service.

- The maximum number of files allowed per `import` operation is 10,000.

### Call $import

Make a `POST` call to `<<FHIR service base URL>>/$import` with the request header and body shown.

#### Request header

```http
Prefer:respond-async
Content-Type:application/fhir+json
```

#### Body

| Parameter Name      | Description | Card. |  Accepted values |
| ----------- | ----------- | ----------- | ----------- |
| inputFormat      | String representing the name of the data source format. Only FHIR NDJSON files are supported. | 1..1 | ```application/fhir+ndjson``` |
| mode      | Import mode value | 1..1 | For an initial mode `import`,  use the `InitialLoad` mode value. For incremental mode `import`, use the `IncrementalLoad` mode value. If no mode value is provided, the `IncrementalLoad`` mode value is used by default. |
| input   | Details of the input files. | 1..* | A JSON array with the three parts described in the table. |

| Input part name   | Description | Card. |  Accepted values |
| ----------- | ----------- | ----------- | ----------- |
| type   |  Resource type of input file   | 1..1 |  A valid [FHIR resource type](https://www.hl7.org/fhir/resourcelist.html) that matches the input file. |
|URL   |  Azure storage URL of the input file   | 1..1 | URL value of the input file. The value can't be modified. |
| etag   |  Etag of the input file on Azure storage; used to verify the file content isn't changed after `import` registration. | 0..1 |  Etag value of the input file. |

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
            "valueString": "<Use "InitialLoad" for initial mode import / Use "IncrementalLoad" for incremental mode import>",
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

### Check $import status

After an $import is initiated, an empty response body with a `callback` link is returned in the `Content-location` header of the response, together with an `202-Accepted` status code. Store the callback link to check the import status.

The import operation registration is implemented as an idempotent call. The same registration payload yields the same registration, which affects ability to reprocess files with the same name. Refrain from updating files in-place, instead we suggest you use different file name for updated data, or, if update in-place with same file name is unavoidable, add e-tags in the registration payload.

To check import status, make the REST call with the `GET` method to the `callback` link returned in the previous step.

Interpret the response by using the table:

| Response code      | Response body |Description |
| ----------- | -----------  |-----------  |
| 202 Accepted | |The operation is still running.|
| 200 OK |The response body doesn't contain any error.url entry|All resources were imported successfully.|
| 200 OK |The response body contains some error.url entry|Error occurred while importing some of the resources. See the files located at error.url for the details. The remaining resources were imported successfully.|
| Other||A fatal error occurred and the operation stopped. Successfully imported resources aren't rolled back.|

Table describes the important fields in the response body:

| Field | Description |
| ----------- | ----------- |
|transactionTime|Start time of the bulk-import operation.|
|output.count|Count of resources that were successfully imported.|
|error.count|Count of resources that weren't imported due to an error.|
|error.url|URL of the file containing details of the error. Each error.url is unique to an input URL.|

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
### Ingest soft deleted resources
Incremental mode `import` supports ingestion of soft deleted resources. You need to use the extension to ingest soft deleted resources in the FHIR service.

Add the extension to the resource to inform the FHIR service that the resource was soft deleted. 

```ndjson
{"resourceType": "Patient", "id": "example10", "meta": { "lastUpdated": "2023-10-27T04:00:00.000Z", "versionId": 4, "extension": [ { "url": "http://azurehealthcareapis.com/data-extensions/deleted-state", "valueString": "soft-deleted" } ] } }
```

After the `import` operation completes successfully, perform history search on the resource to validate soft deleted resources. If you know the ID of the deleted resource, use the URL pattern in the example.

```json
<FHIR_URL>/<resource-type>/<resource-id>/_history
```

If you don't know the ID of the resource, do a history search on the resource type.
```json
<FHIR_URL>/<resource-type>/_history
```

## Troubleshoot the import operation

Here are the error messages that occur if the `import` operation fails, and recommended actions to take to resolve the issue.

#### 200 OK, but there's an error with the URL in the response

**Behavior:**  The `import` operation succeeds and returns `200 OK`. However, `error.url` is present in the response body. Files present at the `error.url` location contain JSON fragments similar to the example:

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

**Cause:** NDJSON files contain resources with conditional references not supported by $import.

**Solution:** Replace the conditional references to normal references in the NDJSON files.

#### 400 Bad Request

**Behavior:** The import operation failed and `400 Bad Request` is returned. The response body includes this content:

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

**Solution:** Verify the link to the Azure storage is correct. Check the network and firewall settings to make sure that the FHIR server is able to access the storage. If your service is in a virtual network, ensure that the storage is in the same virtual network or in a virtual network peered with the FHIR service virtual network.

#### 403 Forbidden

**Behavior:** The import operation failed and `403 Forbidden` is returned. The response body contains this content:

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

**Cause:** The FHIR service uses managed identity for source storage authentication. This error indicates a missing or incorrect role assignment.

**Solution:** Assign the **Storage Blob Data Contributor** role to the FHIR server. For more information, see [Assign Azure roles](../../role-based-access-control/role-assignments-portal.md?tabs=current).

#### 500 Internal Server Error

**Behavior:** The import operation failed and `500 Internal Server Error` is returned. The response body contains this content:

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

**Cause:** You reached the storage limit of the FHIR service.

**Solution:** Reduce the size of your data or consider Azure API for FHIR, which has a higher storage limit.

## Next steps

[Convert your data to FHIR](convert-data.md)

[Configure export settings and set up a storage account](configure-export-data.md)

[Copy data to Azure Synapse Analytics](copy-to-synapse.md)

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
