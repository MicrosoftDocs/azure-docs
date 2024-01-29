---
title: "Tutorial: Perform manifest-based file ingestion"
titleSuffix: Microsoft Azure Data Manager for Energy
description: This tutorial shows you sample steps for performing manifest ingestion.
author: bharathim
ms.author: bselvaraj
ms.service: energy-data-services
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
> * Ingest sample manifests into an Azure Data Manager for Energy instance by using Postman.
> * Search for storage metadata records created during manifest ingestion by using Postman.

## Prerequisites

Before you start this tutorial, complete the following prerequisites.

### Get details for the Azure Data Manager for Energy instance

* You need an Azure Data Manager for Energy instance. If you don't already have one, create one by following the steps in [Quickstart: Create an Azure Data Manager for Energy instance](quickstart-create-microsoft-energy-data-services-instance.md).
* For this tutorial, you need the following parameters:

  | Parameter          | Value to use             | Example                               | Where to find this value           |
  | ------------------ | ------------------------ |-------------------------------------- |-------------------------------------- |
  | `CLIENT_ID`          | Application (client) ID  | `3dbbbcc2-f28f-44b6-a5ab-xxxxxxxxxxxx`  | You use this app or client ID when registering the application with the Microsoft identity platform. See [Register an application](../active-directory/develop/quickstart-register-app.md#register-an-application). |
  | `CLIENT_SECRET`      | Client secrets           |  `_fl******************`                | Sometimes called an *application password*, a client secret is a string value that your app can use in place of a certificate to identity itself. See [Add a client secret](../active-directory/develop/quickstart-register-app.md#add-a-client-secret).|
  | `TENANT_ID`          | Directory (tenant) ID    | `72f988bf-86f1-41af-91ab-xxxxxxxxxxxx`  | Hover over your account name in the Azure portal to get the directory or tenant ID. Alternately, search for and select **Microsoft Entra ID** > **Properties** > **Tenant ID** in the Azure portal. |
  | `SCOPE`              | Application (client) ID  | `3dbbbcc2-f28f-44b6-a5ab-xxxxxxxxxxxx`  | This value is the same as the app or client ID mentioned earlier. |
  | `refresh_token`      | Refresh token value      | `0.ATcA01-XWHdJ0ES-qDevC6r...........`  | Follow [How to generate auth token](how-to-generate-auth-token.md) to create a refresh token and save it. You need this refresh token later to generate a user token. |
  | `DNS`                | URI                      | `<instance>.energy.Azure.com`         | Find this value on the overview page of the Azure Data Manager for Energy instance.|
  | `data-partition-id`  | Data partitions        | `<instance>-<data-partition-name>`  | Find this value on the overview page of the Azure Data Manager for Energy instance.|

Follow the [Manage users](how-to-manage-users.md) guide to add appropriate entitlements for the user who's running this tutorial.

### Set up Postman and execute requests

1. Download and install the [Postman](https://www.postman.com/) desktop app.

1. Import the following files into Postman:

   * [Manifest ingestion Postman collection](https://raw.githubusercontent.com/microsoft/meds-samples/main/postman/IngestionWorkflows.postman_collection.json)
   * [Manifest ingestion Postman environment](https://raw.githubusercontent.com/microsoft/meds-samples/main/postman/IngestionWorkflowEnvironment.postman_environment.json)

   To import the Postman collection and environment variables, follow the steps in [Importing data into Postman](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-data-into-postman).

1. Update **CURRENT VALUE** for the Postman environment with the information that you obtained in the details of the Azure Data Manager for Energy instance.

1. The Postman collection for manifest ingestion contains multiple requests that you must execute sequentially.

   Be sure to choose **Ingestion Workflow Environment** before you trigger the Postman collection.

   :::image type="content" source="media/tutorial-manifest-ingestion/tutorial-postman-choose-environment.png" alt-text="Screenshot of the Postman environment." lightbox="media/tutorial-manifest-ingestion/tutorial-postman-choose-environment.png":::

1. Trigger each request by selecting the **Send** button.

   On every request, Postman validates the actual API response code against the expected response code. If there's any mismatch, the test section indicates failures.

Here's an example of a successful Postman request:

:::image type="content" source="media/tutorial-manifest-ingestion/tutorial-postman-test-success.png" alt-text="Screenshot of a successful Postman call." lightbox="media/tutorial-manifest-ingestion/tutorial-postman-test-success.png":::

Here's an example of a failed Postman request:

:::image type="content" source="media/tutorial-manifest-ingestion/tutorial-postman-test-failure.png" alt-text="Screenshot of a failed Postman call." lightbox="media/tutorial-manifest-ingestion/tutorial-postman-test-failure.png":::

## Ingest sample manifests by using Postman

To ingest sample manifests into the Azure Data Manager for Energy instance by using the Postman collection, complete the following steps:

1. **Get a User Access Token**: Generate the user token, which will be used to authenticate further API calls.
1. **Create a Legal Tag**: Create a legal tag that will be added to the manifest data for data compliance purposes.
1. **Get a Signed URL for uploading a file**: Get the signed URL path to which the manifest file will be uploaded.
1. **Upload a file**: Download the [Wellbore.csv](https://github.com/microsoft/meds-samples/blob/main/test-data/wellbore.csv) sample to your local machine. It could be any file type, including CSV, LAS, or JSON. Select this file in Postman by clicking the **Select File** button.

   :::image type="content" source="media/tutorial-manifest-ingestion/tutorial-select-manifest-file.png" alt-text="Screenshot of uploading a manifest file." lightbox="media/tutorial-manifest-ingestion/tutorial-select-manifest-file.png":::  
1. **Upload File Metadata**: Upload the file metadata information, such as file location and other relevant fields.
1. **Get the File Metadata**: Call to validate if the metadata was created successfully.
1. **Ingest Master, Reference and Work Product Component (WPC) data**: Ingest the master, reference, and work product component (WPC) manifest metadata.
1. **Get Manifest Ingestion Workflow status**: The workflow starts and is in the **running** state. Keep querying until the state changes to **finished** (typically 20 to 30 seconds).

## Search for ingested data by using Postman

To search for storage metadata records created during the manifest ingestion by using the Postman collection, complete the following steps:

1. **Search Work Products**: Call the search service to retrieve the work product metadata records.
1. **Search Work Product Components**: Call the search service to retrieve the WPC metadata records.
1. **Search for Dataset**: Call the search service to retrieve the dataset metadata records.
1. **Search for Master data**: Call the search service to retrieve the master metadata records.
1. **Search for Reference Data**: Call the search service to retrieve the reference metadata records.

## Next step

Advance to the next tutorial:

> [!div class="nextstepaction"]
> [Tutorial: Use sdutil to load data into Seismic Store](tutorial-seismic-ddms-sdutil.md)

For more information about manifest ingestion, see the [OSDU Operator Data Loading Quick Start Guide](https://community.opengroup.org/groups/osdu/platform/data-flow/data-loading/-/wikis/home#osdu-operator-data-loading-quick-start-guide).
