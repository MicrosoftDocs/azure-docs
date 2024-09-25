---
title: "Tutorial: Work with seismic data by using Seismic DDMS APIs"
titleSuffix: Microsoft Azure Data Manager for Energy
description: This tutorial shows sample steps for interacting with the Seismic DDMS APIs in Azure Data Manager for Energy.
author: elizabethhalper
ms.author: elhalper
ms.service: energy-data-services
ms.topic: tutorial
ms.date: 3/16/2022
ms.custom: template-tutorial

#Customer intent: As a developer, I want to learn how to use the Seismic DDMS APIs so that I can store and retrieve similar kinds of data.
---

# Tutorial: Work with seismic data by using Seismic DDMS APIs

Use Seismic Domain Data Management Services (DDMS) APIs in Postman to work with seismic data in an Azure Data Manager for Energy instance.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Register a data partition for seismic data.
> * Use Seismic DDMS APIs to store and retrieve seismic data.

For more information about DDMS, see [DDMS concepts](concepts-ddms.md).

## Prerequisites

* An Azure subscription
* An instance of [Azure Data Manager for Energy](quickstart-create-microsoft-energy-data-services-instance.md) created in your Azure subscription

## Get your Azure Data Manager for Energy instance details

The first step is to get the following information from your [Azure Data Manager for Energy instance](quickstart-create-microsoft-energy-data-services-instance.md) in the [Azure portal](https://portal.azure.com/?microsoft_azure_marketplace_ItemHideKey=Microsoft_Azure_OpenEnergyPlatformHidden):

| Parameter          | Value             | Example                               |
| ------------------ | ------------------------ |-------------------------------------- |
| `client_id`          | Application (client) ID  | `3dbbbcc2-f28f-44b6-a5ab-xxxxxxxxxxxx`  |
| `client_secret`      | Client secrets           |  `_fl******************`                |
| `tenant_id`          | Directory (tenant) ID    | `72f988bf-86f1-41af-91ab-xxxxxxxxxxxx`  |
| `base_url`           | URL                      | `https://<instance>.energy.azure.com` |
| `data-partition-id`  | Data partitions        | `<data-partition-name>`               |

## Set up Postman

1. Download and install the [Postman](https://www.postman.com/downloads/) desktop app.
2. Import the following files into Postman:

   * [Seismic DDMS Postman collection](https://raw.githubusercontent.com/microsoft/adme-samples/main/postman/SeismicDDMS.postman_collection.json)
   * [Seismic DDMS Postman environment](https://raw.githubusercontent.com/microsoft/adme-samples/main/postman/SeismicDDMSEnvironment.postman_environment.json)

   To import the files:

   1. Select **Import** in Postman.

      :::image type="content" source="media/tutorial-ddms/postman-import-button.png" alt-text="Screenshot that shows the Import button in Postman."  lightbox="media/tutorial-ddms/postman-import-button.png":::

   1. Paste the URL of each file into the search box.

      :::image type="content" source="media/tutorial-ddms/postman-import-search.png" alt-text="Screenshot that shows importing collection and environment files in Postman via URL."  lightbox="media/tutorial-ddms/postman-import-search.png":::

3. Update `CURRENT_VALUE` in the Postman environment with the information that you obtained in the Azure Data Manager for Energy instance details.

## Use Seismic DDMS APIs to store and retrieve seismic data

### Create a legal tag

Create a legal tag that's automatically added to your Seismic DDMS environment for data compliance.

API: **Setup** > **Create Legal Tag for SDMS**

Method: `POST`

:::image type="content" source="media/tutorial-seismic-ddms/postman-api-create-legal-tag.png" alt-text="Screenshot that shows the API that creates a legal tag." lightbox="media/tutorial-seismic-ddms/postman-api-create-legal-tag.png":::

For more information, see [Manage legal tags](how-to-manage-legal-tags.md).

### Verify the service

Run basic service connection and status tests in your Azure Data Manager for Energy instance.

API: **Service Verification** > **Check Status**

Method: `GET`

:::image type="content" source="media/tutorial-seismic-ddms/postman-api-check-service-status.png" alt-text="Screenshot that shows the API that checks the service's status." lightbox="media/tutorial-seismic-ddms/postman-api-check-service-status.png":::

### Tenant

Create a tenant in your Azure Data Manager for Energy instance.

> [!NOTE]
> You must register a data partition as a tenant before using it with the Seismic DDMS.

API: **Tenant** > **Register a seismic-dms tenant**

Method: `POST`

:::image type="content" source="media/tutorial-seismic-ddms/postman-api-register-tenant.png" alt-text="Screenshot that shows the API that registers a tenant." lightbox="media/tutorial-seismic-ddms/postman-api-register-tenant.png":::

### Create a subproject

Create a subproject in your Azure Data Manager for Energy instance.

API: **Subproject** > **Create a new subproject**

Method: `POST`

:::image type="content" source="media/tutorial-seismic-ddms/postman-api-create-subproject.png" alt-text="Screenshot that shows the API that creates a subproject." lightbox="media/tutorial-seismic-ddms/postman-api-create-subproject.png":::

### Register a dataset

Register a dataset in your Azure Data Manager for Energy instance.

API: **Dataset** > **Register a new dataset**

Method: `POST`

:::image type="content" source="media/tutorial-seismic-ddms/postman-api-create-dataset.png" alt-text="Screenshot that shows the API that creates a dataset." lightbox="media/tutorial-seismic-ddms/postman-api-create-dataset.png":::

### Register applications

Register applications in your Azure Data Manager for Energy instance.

API: **Applications** > **Register a new application**

Method: `POST`

:::image type="content" source="media/tutorial-seismic-ddms/postman-api-register-application.png" alt-text="Screenshot that shows the API that registers an application." lightbox="media/tutorial-seismic-ddms/postman-api-register-application.png":::

## Next step

As an alternative user experience to Postman, you can use the sdutil command-line Python tool to directly interact with Seismic Store. Use the following tutorial to get started:

> [!div class="nextstepaction"]
> [Use sdutil to load data into Seismic Store](./tutorial-seismic-ddms-sdutil.md)
