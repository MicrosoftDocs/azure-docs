---
title: Microsoft Azure Data Manager for Energy - Steps to perform a CSV parser ingestion
description: This tutorial shows you how to perform CSV parser ingestion
author: bharathim
ms.author: bselvaraj
ms.service: energy-data-services
ms.topic: tutorial
ms.date: 09/19/2022
ms.custom: template-tutorial

#Customer intent: As a customer, I want to learn how to use CSV parser ingestion so that I can load CSV data into the Azure Data Manager for Energy instance.
---

# Tutorial: Sample steps to perform a CSV parser ingestion

CSV Parser ingestion provides the capability to ingest CSV files into the Azure Data Manager for Energy instance.

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Ingest a sample wellbore data CSV file into the Azure Data Manager for Energy instance using Postman
> * Search for storage metadata records created during the CSV Ingestion using Postman

## Prerequisites

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

### Set up and execute Postman requests

* Download and install [Postman](https://www.postman.com/) desktop app
* Import the following files into Postman:
  * [CSV Workflow Postman collection](https://raw.githubusercontent.com/microsoft/meds-samples/main/postman/IngestionWorkflows.postman_collection.json)
  * [CSV Workflow Postman Environment](https://raw.githubusercontent.com/microsoft/meds-samples/main/postman/IngestionWorkflowEnvironment.postman_environment.json)

  > [!NOTE]
  >  To import the Postman collection and environment variables, follow the steps outlined in [Importing data into Postman](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-data-into-postman)
  
* Update the **CURRENT_VALUE** of the Postman environment with the information obtained in Azure Data Manager for Energy instance details
* The Postman collection for CSV parser ingestion contains a total of 10 requests, which have to be executed in a sequential manner.
* Make sure to choose the **Ingestion Workflow Environment** before triggering the Postman collection.
  :::image type="content" source="media/tutorial-csv-ingestion/tutorial-postman-choose-environment.png" alt-text="Screenshot of the postman environment." lightbox="media/tutorial-csv-ingestion/tutorial-postman-choose-environment.png":::
* Each request can be triggered by clicking the **Send** Button.
* On every request Postman will validate the actual API response code against the expected response code; if there's any mismatch the test section will indicate failures.

#### Successful Postman request

  :::image type="content" source="media/tutorial-csv-ingestion/tutorial-postman-test-success.png" alt-text="Screenshot of a successful postman call." lightbox="media/tutorial-csv-ingestion/tutorial-postman-test-success.png":::

#### Failed Postman request

  :::image type="content" source="media/tutorial-csv-ingestion/tutorial-postman-test-failure.png" alt-text="Screenshot of a failure postman call." lightbox="media/tutorial-csv-ingestion/tutorial-postman-test-failure.png":::

## Ingest a sample wellbore data CSV file into the Azure Data Manager for Energy instance using Postman
Using the given Postman collection, you could execute the following steps to ingest the wellbore data:
  1. **Get a user token** - Generate the User token, which will be used to authenticate further API calls.
  2. **Create a schema** - Generate a schema that adheres to the columns present in the CSV file
  3. **Get schema details** - Get the schema created in the previous step and validate it
  4. **Create a legal tag** - Create a legal tag that will be added to the CSV data for data compliance purpose
  5. **Get a signed url for uploading a CSV file** - Get the signed URL path to which the CSV file will be uploaded
  6. **Upload a CSV file** - Download the [Wellbore.csv](https://github.com/microsoft/meds-samples/blob/main/test-data/wellbore.csv) to your local machine, and select this file in Postman by clicking the **Select File** option as shown in the Screenshot below.
    :::image type="content" source="media/tutorial-csv-ingestion/tutorial-select-csv-file.png" alt-text="Screenshot of uploading a CSV file." lightbox="media/tutorial-csv-ingestion/tutorial-select-csv-file.png":::
  7. **Upload CSV file metadata** - Upload the file metadata information such as file location & other relevant fields
  8. **Trigger a CSV parser ingestion workflow** - Triggers the CSV Parser ingestion workflow DAG.
  9. **Get CSV parser ingestion workflow status** - Gets the status of CSV Parser Dag Run.

## Search for storage metadata records created during the CSV Ingestion using Postman
Using the given Postman collection, you could execute the following step to search for the ingested wellbore data:

**Search for ingested CSV records** - Search for the CSV records created earlier.
  :::image type="content" source="media/tutorial-csv-ingestion/tutorial-search-success.png" alt-text="Screenshot of searching ingested CSV records." lightbox="media/tutorial-csv-ingestion/tutorial-search-success.png":::

## Next steps
Advance to the next tutorial to learn how to do Manifest ingestion
> [!div class="nextstepaction"]
> [Tutorial: Sample steps to perform a manifest-based file ingestion](tutorial-manifest-ingestion.md)
