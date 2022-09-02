---
title: Steps to perform a manifest-based file ingestion #Required; page title is displayed in search results. Include the brand.
description: This tutorial shows you how to perform Manifest ingestion #Required; article description that is displayed in search results. 
author: bharathim #Required; your GitHub user alias, with correct capitalization.
ms.author: bselvaraj #Required; microsoft alias of author; optional team alias.
ms.service: azure #Required; service per approved list. slug assigned by ACOM.
ms.topic: tutorial #Required; leave this attribute/value as-is.
ms.date: 08/18/2022
ms.custom: template-tutorial #Required; leave this attribute/value as-is.
---

# Tutorial: Sample steps to perform a manifest-based file ingestion

Manifest ingestion provides the capability to ingest manifests into Microsoft Energy Data Services instance

In this tutorial, you will learn how to:

> * Ingest sample manifests into the Microsoft Energy Data Services instance
> * Search for storage metadata records created during the manifest ingestion

## Prerequisites

### Get Microsoft Energy Data Services instance details

* Once the [Quickstart: Create a Microsoft energy data services instance](quickstart-create-project-oak-forest-instance.md) is created, note down the following details:
  
  | Parameter          | Value to use             | Example                               |
  | ------------------ | ------------------------ |-------------------------------------- |
  | CLIENT_ID          | Application (client) ID  | 3dbbbcc2-f28f-44b6-a5ab-a6a5cb7c7862  |
  | CLIENT_SECRET      | Client secrets           |  _fl******************                |
  | TENANT_ID          | Directory (tenant) ID    | 72f988bf-86f1-41af-91ab-2d7cd011db47  |
  | SCOPE              | Application (client) ID  | 3dbbbcc2-f28f-44b6-a5ab-a6a5cb7c7862  |
  | refresh_token      | Refresh Token value      | 0.ATcA01-XWHdJ0ES-qDevC6r...........  |
  | DNS                | URI                      | bseloak.energy.azure.com              |
  | data-partition-id  | Data Partition(s)        | bseloak-bseldp1                       |

* To generate a refresh token follow the steps mentioned in [OAuth 2.0 authorization](how-to-generate-refresh-token.md).

### How to set up Postman

* Download and install [Postman](https://www.postman.com/) desktop app
* Import the following files into Postman:
  * [Manifest ingestion postman collection](https://raw.githubusercontent.com/microsoft/meds-samples/main/postman/IngestionWorkflows.postman_collection.json?token=GHSAT0AAAAAABRNZHEUZZSERHU4MWS6MBDGYYRSUTQ)
  * [Manifest Ingestion postman environment](https://raw.githubusercontent.com/microsoft/meds-samples/main/postman/IngestionWorkflowEnvironment.postman_environment.json?token=GHSAT0AAAAAABRNZHEUCYUV6PO4RETLJEX4YYRST4Q)
    > [!NOTE]
    >  To import the Postman collection and environment variables, follow the steps outlined in [Importing data into Postman](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-data-into-postman)
* Update the **CURRENT_VALUE** of the postman environment with the information obtained in [Get Microsoft Energy Data Services instance details](#get-microsoft-energy-data-services-instance-details)

### How to execute Postman requests

* The Postman collection for manifest ingestion contains multiple requests, which will have to be executed in a sequential manner.
* Make sure to choose the **Ingestion Workflow Environment** before triggering the Postman collection.
  :::image type="content" source="media/tutorial-manifest-ingestion/tutorial-postman-choose-environment.png" alt-text="Screenshot of the postman environment." lightbox="media/tutorial-manifest-ingestion/tutorial-postman-choose-environment.png":::
* Each request can be triggered by clicking the **Send** Button.
* On every request, Postman will validate the actual API response code against the expected response code; if there is any mismatch the test section will indicate failures.

**Successful Postman request**

:::image type="content" source="media/tutorial-manifest-ingestion/tutorial-postman-test-success.png" alt-text="Screenshot of a successful postman call." lightbox="media/tutorial-manifest-ingestion/tutorial-postman-test-success.png":::

**Failed Postman request**

:::image type="content" source="media/tutorial-manifest-ingestion/tutorial-postman-test-failure.png" alt-text="Screenshot of a failure postman call." lightbox="media/tutorial-manifest-ingestion/tutorial-postman-test-failure.png":::

## Ingest sample manifests into the Microsoft Energy Data Services instance

  1. **Get a user token** - Generate the User token, which will be used to authenticate further API calls.
  2. **Create a legal tag** - Create a legal tag that will be added to the Manifest data for data compliance purpose
  3. **Get a signed url for uploading a file** - Get the signed URL path to which the Manifest file will be uploaded
  4. **Upload a file** - Download the sample [Wellbore.csv](https://github.com/microsoft/meds-samples/blob/main/test-data/wellbore.csv) to your local machine (it could be any filetype - CSV, LAS, JSON, etc.), and select this file in Postman by clicking the **Select File** option as shown in the Screenshot below.
    :::image type="content" source="media/tutorial-manifest-ingestion/tutorial-select-manifest-file.png" alt-text="Screenshot of a select file option." lightbox="media/tutorial-manifest-ingestion/tutorial-select-manifest-file.png":::  
  5. **Upload file metadata** - Upload the file metadata information such as file location & other relevant fields
  6. **Get the file metadata** - Call to validate if the metadata got created successfully
  7. **Ingest Master, Reference and Work Product Component(WPC) data** - Ingest the Master, Reference and Work Product Component manifest metadata.
  8. **Get manifest ingestion workflow status** - The workflow will start and will be in the **running** state.  Keep querying until it changes state to **finished** (typically 20-30 seconds)
   
## Search for storage metadata records created during the manifest ingestion
  1. **Search Work Products** - Call Search service to retrieve the Work Product metadata records
  2. **Search Work Product Components** - Call Search service to retrieve the Work Product Component metadata records
  3. **Search for Dataset** - Call Search service to retrieve the Dataset metadata records
  4. **Search for Master data** - Call Search service to retrieve the Master metadata records
  5. **Search for Reference data** - Call Search service to retrieve the Reference metadata records

## Next steps
Advance to the next tutorial to learn about sdutil
> [!div class="nextstepaction"]
> [Tutorial: Seismic store sdutil](tutorial-seismic-ddms-sdutil.md)


