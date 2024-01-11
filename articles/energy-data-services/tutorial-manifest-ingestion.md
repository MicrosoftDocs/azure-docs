---
title: Microsoft Azure Data Manager for Energy - Perform manifest-based file ingestion
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
> * Ingest sample manifests into an Azure Data Manager for Energy instance by using Postman.
> * Search for storage metadata records created during manifest ingestion by using Postman.

## Prerequisites

Before you start this tutorial, complete the following prerequisites.

### Get details for the Azure Data Manager for Energy instance

* You need an Azure Data Manager for Energy instance. If you don't already have one, create one by following the steps in [Quickstart: Create an Azure Data Manager for Energy instance](quickstart-create-microsoft-energy-data-services-instance.md).
* For this tutorial, you will need the following parameters:

  | Parameter          | Value to use             | Example                               | Where to find this value           |
  | ------------------ | ------------------------ |-------------------------------------- |-------------------------------------- |
  | `CLIENT_ID`          | Application (client) ID  | `3dbbbcc2-f28f-44b6-a5ab-xxxxxxxxxxxx`  | You use this app or client ID when registering the application with the Microsoft identity platform. See [Register an application](../active-directory/develop/quickstart-register-app.md#register-an-application). |
  | `CLIENT_SECRET`      | Client secrets           |  `_fl******************`                | Sometimes called an *application password*, a client secret is a string value that your app can use in place of a certificate to identity itself. See [Add a client secret](../active-directory/develop/quickstart-register-app.md#add-a-client-secret).|
  | `TENANT_ID`          | Directory (tenant) ID    | `72f988bf-86f1-41af-91ab-xxxxxxxxxxxx`  | Hover over your account name in the Azure portal to get the directory or tenant ID. Alternately, search for and select **Microsoft Entra ID** > **Properties** > **Tenant ID** in the Azure portal. |
  | `SCOPE`              | Application (client) ID  | `3dbbbcc2-f28f-44b6-a5ab-xxxxxxxxxxxx`  | This value is the same as the app or client ID mentioned earlier. |
  | `refresh_token`      | Refresh token value      | `0.ATcA01-XWHdJ0ES-qDevC6r...........`  | Follow [How to generate auth token](how-to-generate-auth-token.md) to create a refresh token and save it. You need this refresh token later to generate a user token. |
  | `DNS`                | URI                      | `<instance>.energy.Azure.com`         | Find this value on the overview page of the Azure Data Manager for Energy instance.|
  | `data-partition-id`  | Data partitions        | `<instance>-<data-partition-name>`  | Find this value on the overview page of the Azure Data Manager for Energy instance.|

Follow the [Manage users](how-to-manage-users.md) guide to add appropriate entitlements for the user running this tutorial.

### Set up Postman and execute requests

1. Download and install the [Postman](https://www.postman.com/) desktop app.

1. Import the following files into Postman:

   * [CSV workflow Postman collection](https://raw.githubusercontent.com/microsoft/meds-samples/main/postman/IngestionWorkflows.postman_collection.json)  
   * [CSV workflow Postman environment](https://raw.githubusercontent.com/microsoft/meds-samples/main/postman/IngestionWorkflowEnvironment.postman_environment.json)

   To import the Postman collection and environment variables, follow the steps outlined in [Importing data into Postman](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-data-into-postman).

1. Update `CURRENT_VALUE` for the Postman environment with the information that you obtained in the details of the Azure Data Manager for Energy instance.

1. The Postman collection for CSV parser ingestion contains a total of 10 requests, which have to be executed sequentially.

   Be sure to choose **Ingestion Workflow Environment** before you trigger the Postman collection.

   :::image type="content" source="media/tutorial-csv-ingestion/tutorial-postman-choose-environment.png" alt-text="Screenshot of the Postman environment." lightbox="media/tutorial-csv-ingestion/tutorial-postman-choose-environment.png":::

1. Trigger each request by selecting the **Send** button.

   On every request, Postman validates the actual API response code against the expected response code. If there's any mismatch, the test section indicates failures.

Here's an example of a successful Postman request:

:::image type="content" source="media/tutorial-manifest-ingestion/tutorial-postman-test-success.png" alt-text="Screenshot of a successful Postman call." lightbox="media/tutorial-manifest-ingestion/tutorial-postman-test-success.png":::

Here's an example of a failed Postman request:

:::image type="content" source="media/tutorial-manifest-ingestion/tutorial-postman-test-failure.png" alt-text="Screenshot of a failed Postman call." lightbox="media/tutorial-manifest-ingestion/tutorial-postman-test-failure.png":::

## Ingest sample manifests by using Postman

To ingest sample manifests into the Azure Data Manager for Energy instance by using the Postman collection:

1. **Get a User Access Token**: Generate the User token, which will be used to authenticate further API calls.
1. **Create a Legal Tag**: Create a legal tag that will be added to the Manifest data for data compliance purpose.
1. **Get a Signed URL for uploading a file**: Get the signed URL path to which the Manifest file will be uploaded.
1. **Upload a file**: Download the sample [Wellbore.csv](https://github.com/microsoft/meds-samples/blob/main/test-data/wellbore.csv) to your local machine (it could be any filetype - CSV, LAS, JSON, etc.), and select this file in Postman by clicking the **Select File** option as shown in the Screenshot below.

   :::image type="content" source="media/tutorial-manifest-ingestion/tutorial-select-manifest-file.png" alt-text="Screenshot of a select file option." lightbox="media/tutorial-manifest-ingestion/tutorial-select-manifest-file.png":::  
1. **Upload File Metadata**: Upload the file metadata information such as file location & other relevant fields.
1. **Get the File Metadata**: Call to validate if the metadata got created successfully.
1. **Ingest Master, Reference and Work Product Component (WPC) data**: Ingest the Master, Reference and Work Product Component manifest metadata.
1. **Get Manifest Ingestion Workflow status**: The workflow will start and will be in the **running** state.  Keep querying until it changes state to **finished** (typically 20-30 seconds).

## Search for storage metadata records created during the manifest ingestion using Postman

* **Search Work Products**: Call Search service to retrieve the Work Product metadata records
* **Search Work Product Components**: Call Search service to retrieve the Work Product Component metadata records
* **Search for Dataset**: Call Search service to retrieve the Dataset metadata records
* **Search for Master data**: Call Search service to retrieve the Master metadata records
* **Search for Reference data**: Call Search service to retrieve the Reference metadata records

## Next steps

* [Tutorial: Seismic store sdutil](tutorial-seismic-ddms-sdutil.md)
* [OSDU Operator Data Loading Quick Start Guide](https://community.opengroup.org/groups/osdu/platform/data-flow/data-loading/-/wikis/home#osdu-operator-data-loading-quick-start-guide)
