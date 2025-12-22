---
title: "Tutorial: Perform manifest-based file ingestion"
titleSuffix: Microsoft Azure Data Manager for Energy
description: This tutorial shows you sample steps for performing manifest ingestion.
author: bharathim
ms.author: bselvaraj
ms.service: azure-data-manager-energy
ms.topic: tutorial
ms.date: 08/18/2022
ms.custom: template-tutorial

#Customer intent: As a customer, I want to learn how to use manifest ingestion so that I can load manifest information into the Azure Data Manager for Energy instance.
---

# Tutorial: Perform manifest-based file ingestion

Manifest ingestion provides the capability to ingest manifests into an Azure Data Manager for Energy instance.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Ingest sample manifests into an Azure Data Manager for Energy instance by using cURL.
> * Search for storage metadata records created during manifest ingestion by using cURL.

## Prerequisites

* An Azure subscription
* An instance of [Azure Data Manager for Energy](quickstart-create-microsoft-energy-data-services-instance.md) created in your Azure subscription
* cURL command-line tool installed on your machine
* Service principal access token to call the Ingestion APIs. See [How to generate auth token](how-to-generate-auth-token.md).

### Get details for the Azure Data Manager for Energy instance

For this tutorial, you need the following parameters:

| Parameter | Value to use | Example | Where to find this value |
|----|----|----|----|
| `DNS` | URI | `<instance>.energy.azure.com` | Find this value on the overview page of the Azure Data Manager for Energy instance. |
| `data-partition-id` | Data partition | `<data-partition-id>` | Find this value on the Data Partition section within the Azure Data Manager for Energy instance. |
| `access_token`       | Access token value       | `0.ATcA01-XWHdJ0ES-qDevC6r...........`| Follow [How to generate auth token](how-to-generate-auth-token.md) to create an access token and save it.|

Follow the [Manage users](how-to-manage-users.md) guide to add appropriate entitlements for the user who's running this tutorial.

### Set up your environment

Ensure you have `cURL` installed on your system to make API calls.

## Ingest sample manifests by using `cURL`

To ingest sample manifests into the Azure Data Manager for Energy instance, complete the following steps:

1. **Create a Legal Tag**: Use the following `cURL` command to create a legal tag for data compliance purposes:

    ```bash
    curl -X POST "https://<DNS>/api/legal/v1/legaltags" \
    -H "Authorization: Bearer <access_token>" \
    -H "Content-Type: application/json" \
    -H "data-partition-id: <data-partition-id>" \
    -d '{
        "name": "<tagName>",
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
        "name": "abcd",
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
    }
    ```

2. **Ingest Master, Reference, and Work Product Component (WPC) data**: Use the following `cURL` command to ingest the master, reference, and work product component (WPC) manifest metadata:

    ```bash
    curl -X POST "https://<DNS>/api/workflow/v1/workflow/Osdu_ingest/workflowRun" \
    -H "Authorization: Bearer <access_token>" \
    -H "data-partition-id: <data-partition-id>" \
    -H "Content-Type: application/json" \
    -d '{
        "executionContext": {
            "Payload": {
                "AppKey": "test-app",
                "data-partition-id": "<data-partition-id>"
            },
            "manifest": {
                "kind": "osdu:wks:Manifest:1.0.0",
                "ReferenceData": [
                    {
                        "id": "osdu:wks:reference-data--FacilityType:1.0.0",
                        "name": "FacilityType",
                        "description": "Reference data for facility types"
                    }
                ],
                "MasterData": [
                    {
                        "id": "osdu:wks:master-data--Well:1.0.0",
                        "name": "Well",
                        "description": "Master data for wells"
                    }
                ],
                "Data": {
                    "kind": "osdu:wks:dataset--File.Generic:1.0.0",
                    "name": "Sample Dataset",
                    "description": "Dataset for testing purposes"
                }
            }
        }
    }'
    ```

    **Sample Response:**
    ```json
    {
        "workflowId": "Osdu_ingest",
        "runId":"5d6c4e37-ab53-4c5e-9c27-49dd77895377",
        "status": "In Progress",
        "message": "Workflow started successfully."
    }
    ```
    Save the `runId` from the response for use as run_id in the next steps.

3. **Get Manifest Ingestion Workflow status**: Use the following `cURL` command to check the workflow status (replace `<run_id>` with the workflow run ID):

    ```bash
    curl -X GET "https://<DNS>/api/workflow/v1/workflow/Osdu_ingest/workflowRun/<run_id>" \
    -H "Authorization: Bearer <access_token>" \
    -H "data-partition-id: <data-partition-id>" \
    ```

    **Sample Response:**
    ```json
    {
        "workflowId": "Osdu_ingest",
        "runId":"5d6c4e37-ab53-4c5e-9c27-49dd77895377",
        "status": "finished"
    }
    ```

## Search for ingested data by using `cURL`

To search for storage metadata records created during the manifest ingestion, complete the following steps:

1. **Search Work Products**: Use the following `cURL` command to retrieve the work product metadata records:

    ```bash
    curl -X POST "https://<DNS>/api/search/v2/query" \
    -H "Authorization: Bearer <access_token>" \
    -H "data-partition-id: <data-partition-id>" \
    -H "Content-Type: application/json" \
    -d '{
        "kind": "osdu:wks:work-product--WorkProduct:1.0.0",
        "query": "id:\"<data-partition-id>:work-product--WorkProduct:feb22:1<randomIdWP>\""
    }'
    ```

    **Sample Response:**
    ```json
    {
        "results": [
            {
                "id": "<data-partition-id>:work-product--WorkProduct:feb22:1<randomIdWP>",
                "kind": "osdu:wks:work-product--WorkProduct:1.0.0",
                "data": {
                    "name": "Sample Work Product",
                    "description": "Description of the work product."
                }
            }
        ]
    }
    ```

2. **Search Work Product Components**: Use the following `cURL` command to retrieve the WPC metadata records:

    ```bash
    curl -X POST "https://<DNS>/api/search/v2/query" \
    -H "Authorization: Bearer <access_token>" \
    -H "data-partition-id: <data-partition-id>" \
    -H "Content-Type: application/json" \
    -d '{
        "kind": "osdu:wks:work-product-component--WellboreMarkerSet:1.0.0",
        "query": "id:\"<data-partition-id>:work-product-component--WellboreMarkerSet:feb22:1<randomIdWPC>\""
    }'
    ```

    **Sample Response:**
    ```json
    {
        "results": [
            {
                "id": "<data-partition-id>:work-product-component--WellboreMarkerSet:feb22:1<randomIdWPC>",
                "kind": "osdu:wks:work-product-component--WellboreMarkerSet:1.0.0",
                "data": {
                    "name": "Sample WPC",
                    "description": "Description of the work product component."
                }
            }
        ]
    }
    ```

3. **Search for Dataset**: Use the following `cURL` command to retrieve the dataset metadata records:

    ```bash
    curl -X POST "https://<DNS>/api/search/v2/query" \
    -H "Authorization: Bearer <access_token>" \
    -H "data-partition-id: <data-partition-id>" \
    -H "Content-Type: application/json" \
    -d '{
        "kind": "osdu:wks:dataset--File.Generic:1.0.0",
        "query": "id:\"<data-partition-id>:dataset--File.Generic:feb22:1<randomIdDataset>\""
    }'
    ```

    **Sample Response:**
    ```json
    {
        "results": [
            {
                "id": "<data-partition-id>:dataset--File.Generic:feb22:1<randomIdDataset>",
                "kind": "osdu:wks:dataset--File.Generic:1.0.0",
                "data": {
                    "name": "Sample Dataset",
                    "description": "Description of the dataset."
                }
            }
        ]
    }
    ```

4. **Search for Master data**: Use the following `cURL` command to retrieve the master metadata records:

    ```bash
    curl -X POST "https://<DNS>/api/search/v2/query" \
    -H "Authorization: Bearer <access_token>" \
    -H "data-partition-id: <data-partition-id>" \
    -H "Content-Type: application/json" \
    -d '{
        "kind": "osdu:wks:master-data--Well:1.0.0",
        "query": "id:\"<data-partition-id>:master-data--Well:1112-<randomIdMasterData>\""
    }'
    ```

    **Sample Response:**
    ```json
    {
        "results": [
            {
                "id": "<data-partition-id>:master-data--Well:1112-<randomIdMasterData>",
                "kind": "osdu:wks:master-data--Well:1.0.0",
                "data": {
                    "name": "Sample Well",
                    "description": "Description of the well."
                }
            }
        ]
    }
    ```

5. **Search for Reference Data**: Use the following `cURL` command to retrieve the reference metadata records:

    ```bash
    curl -X POST "https://<DNS>/api/search/v2/query" \
    -H "Authorization: Bearer <access_token>" \
    -H "data-partition-id: <data-partition-id>" \
    -H "Content-Type: application/json" \
    -d '{
        "kind": "osdu:wks:reference-data--FacilityType:1.0.0",
        "query": "id:\"<data-partition-id>:reference-data--FacilityType:Well-<randomIdReferenceData>\""
    }'
    ```

    **Sample Response:**
    ```json
    {
        "results": [
            {
                "id": "<data-partition-id>:reference-data--FacilityType:Well-<randomIdReferenceData>",
                "kind": "osdu:wks:reference-data--FacilityType:1.0.0",
                "data": {
                    "name": "Sample Facility Type",
                    "description": "Description of the facility type."
                }
            }
        ]
    }
    ```

## Next step

Advance to the next tutorial:

> [!div class="nextstepaction"]
> [Tutorial: Use sdutil to load data into Seismic Store](tutorial-seismic-ddms-sdutil.md)

For more information about manifest ingestion, see the [OSDU Operator Data Loading Quick Start Guide](https://community.opengroup.org/groups/osdu/platform/data-flow/data-loading/-/wikis/home#osdu-operator-data-loading-quick-start-guide).
