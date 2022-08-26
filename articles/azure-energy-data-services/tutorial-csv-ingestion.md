---
title: Microsoft Energy Data Service - Steps to perform a CSV parser ingestion #Required; page title is displayed in search results. Include the brand.
description: This tutorial shows you how to perform CSV ingestion #Required; article description that is displayed in search results. 
author: bharathim #Required; your GitHub user alias, with correct capitalization.
ms.author: bselvaraj #Required; microsoft alias of author; optional team alias.
ms.service: azure #Required; service per approved list. slug assigned by ACOM.
ms.topic: tutorial #Required; leave this attribute/value as-is.
ms.date: 08/18/2022
ms.custom: template-tutorial #Required; leave this attribute/value as-is.

#Customer intent: As a customer, I want to learn how to use CSV parser ingestion so that I can load CSV data into the Microsoft Energy Data Services instance.
---

# Tutorial: Sample steps to perform a CSV parser ingestion

CSV Parser ingestion provides the capability to ingest CSV files into the Microsoft Energy Data Services instance.

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Ingest a sample Wellbore data CSV file into the Microsoft Energy Data Services instance
> * Search for Storage metadata records created during the CSV Ingestion

## Prerequisites

### Microsoft Energy Data Services instance details

* Once the [Microsoft Energy Data Services instance](quickstart-create-project-oak-forest-instance.md) is created, note down the following details:
  | Parameter          | Value to use             | Example                               |
  | ------------------ | ------------------------ |-------------------------------------- |
  | CLIENT_ID          | Application (client) ID  | 3dbbbcc2-f28f-44b6-a5ab-a6a5cb7c7862  |
  | CLIENT_SECRET      | Client secrets           |  _fl******************                |
  | TENANT_ID          | Directory (tenant) ID    | 72f988bf-86f1-41af-91ab-2d7cd011db47  |
  | SCOPE              | Application (client) ID  | 3dbbbcc2-f28f-44b6-a5ab-a6a5cb7c7862  |
  | refresh_token      | Refresh Token value      | 0.ATcA01-XWHdJ0ES-qDevC6r...........  |
  | DNS                | URI                      | bseloak.energy.azure.com              |
  | data-partition-id  | Data Partition(s)        | bseloak-bseldp1                       |

* Follow the [How to Generate a Refresh Token](how-to-generate-refresh-token.md) to create a user token and note it down for future use.
* Follow the [Manage users](how-to-manage-users.md) guide to add appropriate entitlements for the user running this tutorial

### Setup Postman

* Download and install [Postman](https://www.postman.com/) desktop app
* Import the following files into Postman:
  > [!NOTE]
  > For the below Postman files, click the **Raw** file on GitHub and save to your local machine.
  >
  > To import the Postman collection and environment variables, follow the steps outlined in [Importing data into Postman](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-data-into-postman)
  * [CSV Workflow Postman collection](postman/tutorial-csv-ingestion/ingestion-workflows-postman-collection.json)
  * [CSV Workflow Postman Environment](postman/tutorial-csv-ingestion/ingestion-workflow-environment-postman-environment.json)
  
* Update the **CURRENT_VALUE** of the Postman Environment with the information obtained in [Microsoft Energy Data Services instance details](#project-oak-forest-instance-details)

### Executing Postman Requests

* The Postman collection for CSV parser ingestion contains a total of 10 requests, which have to be executed in a sequential manner.
* Make sure to choose the **Ingestion Workflow Environment** before triggering the Postman collection.
  ![Choose environment](media/tutorial-csv-ingestion/tutorial-postman-choose-environment.png)
* Each request can be triggered by clicking the **Send** Button.
* On every request Postman will validate the actual API response code against the expected response code; if there's any mismatch the Test Section will indicate failures.

#### Successful Postman Call

![Success](media/tutorial-csv-ingestion/tutorial-postman-test-success.png)

#### Failed Postman Call

![Failure](media/tutorial-csv-ingestion/tutorial-postman-test-failure.png)

## Ingest a sample Wellbore data CSV file into the Microsoft Energy Data Services instance

1. **01 - Get an User Token** - Generate the User token, which will be used to authenticate further API calls.
1. **02 - Create a Schema** - Generate a schema that adheres to the columns present in the CSV file
1. **03 - Get Schema details** - Get the schema created in the previous step and validate it
1. **04 - Create a Legal Tag** - Create a legal tag that will be added to the CSV data for data compliance purpose
1. **05 - Get a signed URL for uploading a CSV file** - Get the signed URL path to which the CSV file will be uploaded
1. **06 - Upload a CSV file** - Download the [Wellbore.csv](/test-data/wellbore.csv) to your local machine, and select this file in Postman by clicking the **Select File** option as shown in the Screenshot below.
  ![Screenshot of uploading a CSV file](media/tutorial-csv-ingestion/tutorial-select-csv-file.png)
1. **07 - Upload CSV file metadata** - Upload the file metadata information such as file location & other relevant fields
1. **08 - Trigger a CSV Parser Ingestion workflow** - Triggers the CSV Parser ingestion workflow DAG.
1. **09 - Get CSV Parser Ingestion Workflow Status** - Gets the status of CSV Parser Dag Run.

## Search for Storage metadata records created during the CSV Ingestion

1. **10 - Search for ingested CSV records** - Search for the CSV records created in earlier step.
  ![Screenshot of searching ingested CSV records](media/tutorial-csv-ingestion/tutorial-search-success.png)

## Next steps
Advance to the next tutorial to learn how to do Manifest ingestion
> [!div class="nextstepaction"]
> [Manifest Ingestion Tutorial](tutorial-manifest-ingestion.md)