---
title: "Tutorial: Perform CSV parser ingestion"
titleSuffix: Microsoft Azure Data Manager for Energy
description: This tutorial shows you sample steps for performing CSV parser ingestion.
author: bharathim
ms.author: bselvaraj
ms.service: azure-data-manager-energy
ms.topic: tutorial
ms.date: 09/19/2022
ms.custom: template-tutorial

#Customer intent: As a customer, I want to learn how to use CSV parser ingestion so that I can load CSV data into the Azure Data Manager for Energy instance.
---

# Tutorial: Perform CSV parser ingestion

Comma-separated values (CSV) parser ingestion provides the capability to ingest CSV files into an Azure Data Manager for Energy instance.

In this tutorial, you learn how to:

> * Ingest a sample wellbore data CSV file into an Azure Data Manager for Energy instance by using `cURL`.
> * Search for storage metadata records created during CSV ingestion by using `cURL`.

## Prerequisites
* An Azure subscription
* An instance of [Azure Data Manager for Energy](quickstart-create-microsoft-energy-data-services-instance.md) created in your Azure subscription
* cURL command-line tool installed on your machine
* Generate the service principal access token to call the Seismic APIs. See [How to generate auth token](how-to-generate-auth-token.md).

### Get details for the Azure Data Manager for Energy instance

* For this tutorial, you need the following parameters:

| Parameter | Value to use | Example | Where to find this value |
|----|----|----|----|
| `DNS` | URI | `<instance>.energy.azure.com` | Find this value on the overview page of the Azure Data Manager for Energy instance. |
| `data-partition-id` | Data partitions | `<data-partition-id>` | Find this value on the Data Partitions section within the Azure Data Manager for Energy instance. |
| `access_token`       | Access token value       | `0.ATcA01-XWHdJ0ES-qDevC6r...........`| Follow [How to generate auth token](how-to-generate-auth-token.md) to create an access token and save it.|

Follow the [Manage users](how-to-manage-users.md) guide to add appropriate entitlements for the user who's running this tutorial.

### Set up your environment

Ensure you have `cURL` installed on your system. You will use it to make API calls.

## Ingest wellbore data by using `cURL`

To ingest a sample wellbore data CSV file into the Azure Data Manager for Energy instance, complete the following steps:
Replace the placeholders (`<DNS>`, `<access_token>`, etc.) with the appropriate values.

### 1. Create a Schema

Run the following `cURL` command to create a schema:

```bash
curl -X POST "https://<DNS>/api/schema-service/v1/schema" \
     -H "Authorization: Bearer <access_token>" \
     -H "Content-Type: application/json" \
     -H "data-partition-id: <data-partition-id>" \
     -d '{
           "schemaInfo": {
               "schemaIdentity": {
                   "authority": "<data-partition-id>",
                   "source": "shapeFiletest",
                   "entityType": "testEntity",
                   "schemaVersionPatch": 1,
                   "schemaVersionMinor": 0,
                   "schemaVersionMajor": 0
               },
               "status": "DEVELOPMENT"
           },
           "schema": {
               "$schema": "http://json-schema.org/draft-07/schema#",
               "title": "Wellbore",
               "type": "object",
               "properties": {
                   "UWI": {
                       "type": "string",
                       "description": "Unique Wellbore Identifier"
                   }
               }
           }
       }'
```

**Sample Response:**
```json
{
  "id": "schema-12345",
  "status": "DEVELOPMENT"
}
```
Save the `id` from the response for use in subsequent steps.

### 2. Create a Legal Tag

Run the following `cURL` command to create a legal tag:

```bash
curl -X POST "https://<DNS>/api/legal/v1/legaltags" \
     -H "Authorization: Bearer <access_token>" \
     -H "Content-Type: application/json" \
     -H "data-partition-id: <data-partition-id>" \
     -d '{
           "name": "LegalTagName",
           "description": "Legal Tag added for Well",
           "properties": {
               "contractId": "123456",
               "countryOfOrigin": ["US", "CA"],
               "dataType": "Third Party Data",
               "exportClassification": "EAR99",
               "originator": "Schlumberger",
               "personalData": "No Personal Data",
               "securityClassification": "Private",
               "expirationDate": "2025-12-25"
           }
       }'
```

**Sample Response:**
```json
{
  "name": "LegalTagName",
  "status": "Created"
}
```

### 3. Get a Signed URL for Uploading a CSV File

Run the following `cURL` command to get a signed URL:

```bash
curl -X GET "https://<DNS>/api/file/v2/files/uploadURL" \
     -H "Authorization: Bearer <access_token>" \
     -H "data-partition-id: <data-partition-id>"
```

**Sample Response:**
```json
{
  "SignedURL": "https://storageaccount.blob.core.windows.net/container/file.csv?sv=...",
  "FileSource": "file-source-12345"
}
```

Save the `SignedURL` and `FileSource` from the response for use in the next steps.

### 4. Upload a CSV File

Download the [Wellbore.csv](https://github.com/microsoft/meds-samples/blob/main/test-data/wellbore.csv) sample to your local machine. Then, run the following `cURL` command to upload the file:

```bash
curl -X PUT -T "Wellbore.csv" "<SignedURL>" -H "x-ms-blob-type: BlockBlob"     
```

**Sample Response:**
```json
{
  "status": "Success"
}
```

### 5. Upload CSV File Metadata

Run the following `cURL` command to upload metadata for the CSV file:

```bash
curl -X POST "https://<DNS>/api/file/v2/files/metadata" \
     -H "Authorization: Bearer <access_token>" \
     -H "Content-Type: application/json" \
     -H "data-partition-id: <data-partition-id>" \
     -d '{
           "kind": "osdu:wks:dataset--File.Generic:1.0.0",
           "acl": {
               "viewers": ["data.default.viewers@<data-partition-id>.dataservices.energy"],
               "owners": ["data.default.owners@<data-partition-id>.dataservices.energy"]
           },
           "legal": {
               "legaltags": ["<data-partition-id>-LegalTagName"],
               "otherRelevantDataCountries": ["US"],
               "status": "compliant"
           },
           "data": {
               "DatasetProperties": {
                   "FileSourceInfo": {
                       "FileSource": "<FileSource>"
                   }
               }
           }
       }'
```

**Sample Response:**
```json
{
  "id": "metadata-12345",
  "status": "Created"
}
```

Save the `id`, which is the uploaded file's id, from the response for use in the next step.


### 6. Trigger a CSV Parser Ingestion Workflow

Run the following `cURL` command to trigger the ingestion workflow:

```bash
curl -X POST "https://<DNS>/api/workflow/v1/workflow/csv-parser/workflowRun" \
     -H "Authorization: Bearer <access_token>" \
     -H "Content-Type: application/json" \
     -H "data-partition-id: <data-partition-id>" \
     -d '{
           "executionContext": {
               "id": "<uploadedFileId>",
               "dataPartitionId": "<data-partition-id>"
           }
       }'
```

**Sample Response:**
```json
{
  "runId": "workflow-12345",
  "status": "Running"
}
```

Save the `runId` from the response for use in the next step.

### 7. Check the status of the workflow and wait for its completion.

Run the following `cURL` command to check the status of the workflow run:

```bash
curl -X GET "https://<DNS>/api/workflow/v1/workflow/csv-parser/workflowRun/<runId>" \
     -H "Authorization: Bearer <access_token>" \
     -H "Content-Type: application/json" \
     -H "data-partition-id: <data-partition-id>"      
```

**Sample Response:**
```json
{
  "runId": "workflow-12345",
  "status": "Completed"
}
```

Keep checking every few seconds, until the response indicates a successful completion.

### 8. Search for Ingested CSV Records

Run the following `cURL` command to search for ingested records:

```bash
curl -X POST "https://<DNS>/api/search/v2/query" \
     -H "Authorization: Bearer <access_token>" \
     -H "Content-Type: application/json" \
     -H "data-partition-id: <data-partition-id>" \
     -d '{
           "kind": "osdu:wks:dataset--File.Generic:1.0.0"
       }'
```

**Sample Response:**
```json
{
  "results": [
    {
      "id": "dataset-12345",
      "kind": "osdu:wks:dataset--File.Generic:1.0.0",
      "status": "Available"
    }
  ]
}
```

You should be able to see the records in the search results.

## Next step

Advance to the next tutorial:

> [!div class="nextstepaction"]
> [Tutorial: Perform manifest-based file ingestion](tutorial-manifest-ingestion.md)
