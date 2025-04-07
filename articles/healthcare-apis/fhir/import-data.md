---
title: Import data into the FHIR service in Azure Health Data Services
description: Learn how to import data into the FHIR service for Azure Health Data Services.
author: expekesheth  
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: how-to
ms.date: 02/06/2024
ms.author: kesheth
---

# Import FHIR data

You can use the `import` operation to ingest FHIR&reg; data into the FHIR server with high throughput.

## Import operation modes

The `import` operation supports two modes: initial and incremental. Each mode has different features and use cases.

### Initial mode

- Intended for loading FHIR resources into an empty FHIR server.

- Blocks API writes to the FHIR server.

### Incremental mode

- Optimized for loading data into the FHIR server periodically and doesn't block writes through the API.

- Allows you to load `lastUpdated` and `versionId` values from resource metadata if they're present in the resource JSON.

- Allows you to load resources in a nonsequential order of versions.
  Note for non-sequential ingestion of resources
  - If import files don't have the `version` and `lastUpdated` field values specified, there's no guarantee of importing all resources in the FHIR service.
  - If import files have resources with duplicate `version` and `lastUpdated` field values, only one resource is randomly ingested in the FHIR service.
  - During parallel execution, if multiple resources share the same resource ID, only one of those resources is imported at random.

The following table shows the difference between import modes.

|Areas|Initial mode  |Incremental mode  |
|------------- |-------------|-----|
|Capability|Initial load of data into FHIR service|Continuous ingestion of data into FHIR service (Incremental or Near Real Time).|
|Concurrent API calls|Blocks concurrent write operations|Data can be ingested concurrently while executing API CRUD operations on the FHIR server.|
|Ingestion of versioned resources|Not supported|Enables ingestion of  multiple versions of FHIR resources in single batch while maintaining resource history.|
|Retain lastUpdated field value|Not supported|Retain the lastUpdated field value in FHIR resources during the ingestion process.|
|Billing| Doesn't incur any charge|Incurs charges based on successfully ingested resources. Charges are incurred per API pricing.|

## Performance considerations

To achieve the best performance with the `import` operation, consider the following factors.

- **Use large files for import**. The optimal NDJSON file size for import is >=50 MB (or >=20 K resources, no upper limit). Consider combining smaller files together.

- **Import FHIR resource files as a single batch**. For optimal performance, import all the FHIR resource files that you want to ingest in the FHIR server in one `import` operation. Importing all the files in one operation reduces the overhead of creating and managing multiple import jobs. Optimally, the total size of files in a single import should be large (>=100 GB or >=100M resources, no upper limit).

- **Limit the number of parallel import jobs**. You can run multiple `import` jobs at the same time, but might affect the overall throughput of the `import` operation. 

## Perform the import operation

### Prerequisites

- To use the `import` operation, you need the **FHIR Data Importer** role on the FHIR server.

- Configure the FHIR server. The FHIR data must be stored in resource-specific files in FHIR NDJSON format on the Azure blob store. For more information, see [Configure import settings](configure-import-data.md).

- The data must be in the same tenant as the FHIR service.

- To obtain an access token, see [Access Token](using-rest-client.md)


### Make a call

Make a `POST` call to `<<FHIR service base URL>>/$import` with the following request header and body.

#### Request header

```http
Prefer:respond-async
Content-Type:application/fhir+json
```

#### Body

The following tables describe the body parameters and inputs.

| Parameter name | Description | Cardinality |  Accepted values |
| ----------- | ----------- | ----------- | ----------- |
| `inputFormat`| String that represents the name of the data source format. Only FHIR NDJSON files are supported. | 1..1 | `application/fhir+ndjson` |
| `mode`| Import mode value. | 1..1 | For an initial-mode import,  use the `InitialLoad` mode value. For incremental-mode import, use the `IncrementalLoad` mode value. If you don't provide a mode value, the `IncrementalLoad` mode value is used by default. |
| `allowNegativeVersions`|	Allows FHIR server assigning negative versions for resource records with explicit lastUpdated value and no version specified when input doesn't fit in contiguous space of positive versions existing in the store. | 0..1 |	To enable this feature, pass true. By default it's false. |
| `input`| Details of the input files. | 1..* | A JSON array with the three parts described in the following table. |


| Input part name   | Description | Cardinality |  Accepted values |
| ----------- | ----------- | ----------- | ----------- |
| `type`|  Resource type of the input file. | 0..1 |  A valid [FHIR resource type](https://www.hl7.org/fhir/resourcelist.html) that matches the input file. This field is optional.|
|`url`|  Azure storage URL of the input file.   | 1..1 | URL value of the input file. The value can't be modified. |
| `etag`|  ETag of the input file in the Azure storage. Used to verify that the file content isn't changed after `import` registration. | 0..1 |  ETag value of the input file.|

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
            "valueString": "<Use "InitialLoad" for initial mode import / Use "IncrementalLoad" for incremental mode import>"
        }, 
        {
            "name": "allowNegativeVersions",
            "valueBoolean": true
        },
        {
            "name": "input",
            "part": [
                { 
                    "name": "url",
                    "valueUri": "https://example.blob.core.windows.net/resources/filename.ndjson"
                },
                {
                    "name": "etag",
                    "valueUri": "\"0x8D92A7342657F4F\""
                }
            ]
        }
    ]
}
```

### Check import status

After you start an `import` operation, an empty response body with a `callback` link is returned in the `Content-location` header of the response, together with an `202 Accepted` status code. Store the `callback` link to check the import status.

Registration of the `import` operation is implemented as an idempotent call. The same registration payload yields the same registration, which affects the ability to reprocess files with the same name. Refrain from updating files in place. Instead, we suggest that you use a different file name for updated data. Or, if an in-place update with same file name is unavoidable, add ETags in the registration payload.

To check the import status, make the REST call with the `GET` method to the `callback` link returned in the previous step.

Interpret the response by using this table.

| Response code      | Response body |Description |
| ----------- | -----------  |-----------  |
| `202 Accepted` | |The operation is still running.|
| `200 OK` |`The response body doesn't contain any error.url entry`|All resources were imported successfully.|
| `200 OK` |`The response body contains some error.url entry`|An error occurred during import of some of the resources. For details, see the files located at `error.url`. The remaining resources were imported successfully.|
| `Other`||A fatal error occurred and the operation stopped. Successfully imported resources aren't rolled back.|

The following table describes the important fields in the response body:

| Field | Description |
| ----------- | ----------- |
|`transactionTime`|Start time of the bulk `import` operation.|
|`output.count`|Count of resources that were successfully imported.|
|`error.count`|Count of resources that weren't imported because of an error.|
|`error.url`|URL of the file that contains details of the error. Each `error.url` instance is unique to an input URL.|

```json
{
    "transactionTime": "2021-07-16T06:46:52.3873388+00:00",
    "request": "https://importperf.azurewebsites.net/$Import",
    "output": [
        {
            "type": <null in case type parameter in not populated in request. If provided, resource name will be added>,
            "count": 10000,
            "inputUrl": "https://example.blob.core.windows.net/resources/filename.ndjson"
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

### Ingest soft-deleted resources

Incremental-mode import supports ingestion of soft-deleted resources. You need to use the extension to ingest soft-deleted resources in the FHIR service.

Add the extension to the resource to inform the FHIR service that the resource was soft-deleted.

```ndjson
{"resourceType": "Patient", "id": "example10", "meta": { "lastUpdated": "2023-10-27T04:00:00.000Z", "versionId": 4, "extension": [ { "url": "http://azurehealthcareapis.com/data-extensions/deleted-state", "valueString": "soft-deleted" } ] } }
```

After the `import` operation finishes successfully, perform a history search on the resource to validate soft-deleted resources. If you know the ID of the deleted resource, use the URL pattern in the following example.

```json
<FHIR_URL>/<resource-type>/<resource-id>/_history
```

If you don't know the ID of the resource, do a history search on the resource type.

```json
<FHIR_URL>/<resource-type>/_history
```

## Troubleshoot the import operation

Here are the error messages that occur if the `import` operation fails, along with recommended actions to resolve the problems.

### 200 OK, but there's an error with the URL in the response

The `import` operation succeeds and returns `200 OK`. However, `error.url` is present in the response body. Files present at the `error.url` location contain JSON fragments similar to the following example.

```json
{
    "resourceType": "OperationOutcome",
    "issue": [
        {
            "severity": "error",
            "details": {
                "text": "Given conditional reference '{0}' doesn't resolve to a resource."
            },
            "diagnostics": "Failed to process resource at line: {0} with stream start offset: {1}"
        }
    ]
}
```

Cause: NDJSON files contain resources with conditional references that `import` doesn't support.

Solution: Replace the conditional references to normal references in the NDJSON files.

### 400 Bad Request

The `import` operation fails and returns `400 Bad Request`. The response body contains diagnostic content

**import operation failed for reason: No such host is known. (example.blob.core.windows.net:443)**
Solution: Verify that the link to the Azure storage is correct. Check the network and firewall settings to make sure that the FHIR server can access the storage. If your service is in a virtual network, ensure that the storage is in the same virtual network or in a virtual network peered with the FHIR service's virtual network.

**SearchParameter resources cannot be processed by import**
Solution: The import operation returns an HTTP 400 error when a search parameter resource is ingested via the import process. This change is intended to prevent search parameters from being placed in an invalid state when ingested with an import operation.

### 403 Forbidden

The `import` operation fails and returns `403 Forbidden`. The response body contains diagnostic content.

**import operation failed for reason: Server failed to authenticate the request. Make sure the value of Authorization header is formed correctly including the signature.**
Cause: The FHIR service uses a managed identity for source storage authentication. This error indicates a missing or incorrect role assignment.
Solution: Assign the **Storage Blob Data Contributor** role to the FHIR server. For more information, see [Assign Azure roles](../../role-based-access-control/role-assignments-portal.yml?tabs=current).

### 500 Internal Server Error

The `import` operation fails and returns `500 Internal Server Error`. The response body contains diagnostic content

**import operation failed for reason: The database '****' has reached its size quota. Partition or delete data, drop indexes, or consult the documentation for possible resolutions.**

Cause: You reached the storage limit of the FHIR service.

Solution: Reduce the size of your data or consider Azure API for FHIR, which has a higher storage limit.


### 423 Locked

**Behavior:** The `import` operation fails and returns `423 Locked`. The response body includes this content:

```json
{
    "resourceType": "OperationOutcome",
    "id": "13876ec9-3170-4525-87ec-9e165052d70d",
    "issue": [
        {
            "severity": "error",
            "code": "processing",
            "diagnostics": "import operation failed for reason: Service is locked for initial import mode."
        }
    ]
}
```
**Cause:** The FHIR Service is configured with Initial import mode which blocked other operations.

**Solution:** Switch off the FHIR service's Initial import mode, or select Incremental mode.

## Limitations
- The maximum number of files allowed for each `import` operation is 10,000.
- The number of files ingested in the FHIR server with same lastUpdated field value upto milliseconds can't exceed 10,000.
- Import operation isn't supported for SearchParameter resource type.
- The import operation doesn't support conditional references in resources.

## Next steps

[Convert your data to FHIR](convert-data-overview.md)

[Configure export settings and set up a storage account](configure-export-data.md)

[Copy data to Azure Synapse Analytics](copy-to-synapse.md)

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
