---
title: Microsoft Azure Data Manager for Energy - Steps to perform a manifest-based file ingestion
description: This tutorial shows you how to perform Manifest ingestion
author: bharathim
ms.author: bselvaraj
ms.service: energy-data-services
ms.topic: tutorial
ms.date: 08/18/2022
ms.custom: template-tutorial

#Customer intent: As a customer, I want to learn how to use manifest ingestion so that I can load manifest information into the Azure Data Manager for Energy instance.
---

# Tutorial: Sample steps to perform a manifest-based file ingestion

Manifest ingestion provides the capability to ingest manifests into Azure Data Manager for Energy instance

In this tutorial, you will learn how to:

> [!div class="checklist"]
> * Ingest sample manifests into the Azure Data Manager for Energy instance using Postman
> * Search for storage metadata records created during the manifest ingestion using Postman

## Prerequisites

Before beginning this tutorial, the following prerequisites must be completed:
### Get Azure Data Manager for Energy instance details

* Azure Data Manager for Energy instance is created already. If not, follow the steps outlined in [Quickstart: Create an Azure Data Manager for Energy instance](quickstart-create-microsoft-energy-data-services-instance.md)
* For this tutorial, you will need the following parameters:

  | Parameter          | Value to use             | Example                               | Where to find these values?           |
  | ------------------ | ------------------------ |-------------------------------------- |-------------------------------------- |
  | CLIENT_ID          | Application (client) ID  | 3dbbbcc2-f28f-44b6-a5ab-xxxxxxxxxxxx  | App ID or Client_ID used when registering the application with the Microsoft identity platform. See [Register an application](../active-directory/develop/quickstart-register-app.md#register-an-application) |
  | CLIENT_SECRET      | Client secrets           |  _fl******************                | Sometimes called an *application password*, a client secret is a string value your app can use in place of a certificate to identity itself. See [Add a client secret](../active-directory/develop/quickstart-register-app.md#add-a-client-secret)|
  | TENANT_ID          | Directory (tenant) ID    | 72f988bf-86f1-41af-91ab-xxxxxxxxxxxx  | Hover over your account name in the Azure portal to get the directory or tenant ID. Alternately, search and select *Microsoft Entra ID > Properties > Tenant ID* in the Azure portal. |
  | SCOPE              | Application (client) ID  | 3dbbbcc2-f28f-44b6-a5ab-xxxxxxxxxxxx  | Same as App ID or Client_ID mentioned above |
  | refresh_token      | Refresh Token value      | 0.ATcA01-XWHdJ0ES-qDevC6r...........  | Follow the [How to Generate a Refresh Token](how-to-generate-refresh-token.md) to create a refresh token and save it. This refresh token is required later to generate a user token. |
  | DNS                | URI                      | `<instance>`.energy.Azure.com         | Overview page of Azure Data Manager for Energy instance|
  | data-partition-id  | Data Partition(s)        | `<instance>`-`<data-partition-name>`  | Overview page of Azure Data Manager for Energy instance|

* Follow the [Manage users](how-to-manage-users.md) guide to add appropriate entitlements for the user running this tutorial


### Set up Postman and execute requests

* Download and install [Postman](https://www.postman.com/) desktop app
* Import the following files into Postman:
  * [Manifest ingestion postman collection](https://raw.githubusercontent.com/microsoft/meds-samples/main/postman/IngestionWorkflows.postman_collection.json)
  * [Manifest Ingestion postman environment](https://raw.githubusercontent.com/microsoft/meds-samples/main/postman/IngestionWorkflowEnvironment.postman_environment.json)
    > [!NOTE]
    >  To import the Postman collection and environment variables, follow the steps outlined in [Importing data into Postman](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-data-into-postman)

* Update the **CURRENT_VALUE** of the postman environment with the information obtained in Azure Data Manager for Energy instance details
* The Postman collection for manifest ingestion contains multiple requests, which will have to be executed in a sequential manner.
* Make sure to choose the **Ingestion Workflow Environment** before triggering the Postman collection.
  :::image type="content" source="media/tutorial-manifest-ingestion/tutorial-postman-choose-environment.png" alt-text="Screenshot of the Postman environment." lightbox="media/tutorial-manifest-ingestion/tutorial-postman-choose-environment.png":::
* Each request can be triggered by clicking the **Send** Button.
* On every request, Postman will validate the actual API response code against the expected response code; if there is any mismatch the test section will indicate failures.

#### Successful Postman request

:::image type="content" source="media/tutorial-manifest-ingestion/tutorial-postman-test-success.png" alt-text="Screenshot of a successful Postman call." lightbox="media/tutorial-manifest-ingestion/tutorial-postman-test-success.png":::

#### Failed Postman request

:::image type="content" source="media/tutorial-manifest-ingestion/tutorial-postman-test-failure.png" alt-text="Screenshot of a failure Postman call." lightbox="media/tutorial-manifest-ingestion/tutorial-postman-test-failure.png":::

## Ingest sample manifests into the Azure Data Manager for Energy instance using Postman

  1. **Get a user token** - Generate the User token, which will be used to authenticate further API calls.
  2. **Create a legal tag** - Create a legal tag that will be added to the Manifest data for data compliance purpose
  3. **Get a signed url for uploading a file** - Get the signed URL path to which the Manifest file will be uploaded
  4. **Upload a file** - Download the sample [Wellbore.csv](https://github.com/microsoft/meds-samples/blob/main/test-data/wellbore.csv) to your local machine (it could be any filetype - CSV, LAS, JSON, etc.), and select this file in Postman by clicking the **Select File** option as shown in the Screenshot below.
    :::image type="content" source="media/tutorial-manifest-ingestion/tutorial-select-manifest-file.png" alt-text="Screenshot of a select file option." lightbox="media/tutorial-manifest-ingestion/tutorial-select-manifest-file.png":::  
  5. **Upload file metadata** - Upload the file metadata information such as file location & other relevant fields
  6. **Get the file metadata** - Call to validate if the metadata got created successfully
  7. **Ingest Master, Reference and Work Product Component (WPC) data** - Ingest the Master, Reference and Work Product Component manifest metadata.
  8. **Get manifest ingestion workflow status** - The workflow will start and will be in the **running** state.  Keep querying until it changes state to **finished** (typically 20-30 seconds)
   
## Search for storage metadata records created during the manifest ingestion using Postman
 - **Search Work Products** - Call Search service to retrieve the Work Product metadata records
 - **Search Work Product Components** - Call Search service to retrieve the Work Product Component metadata records
 - **Search for Dataset** - Call Search service to retrieve the Dataset metadata records
 - **Search for Master data** - Call Search service to retrieve the Master metadata records
 - **Search for Reference data** - Call Search service to retrieve the Reference metadata records

## Next steps
- [Tutorial: Seismic store sdutil](tutorial-seismic-ddms-sdutil.md)
- [OSDU Operator Data Loading Quick Start Guide](https://community.opengroup.org/groups/osdu/platform/data-flow/data-loading/-/wikis/home#osdu-operator-data-loading-quick-start-guide)
