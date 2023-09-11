---
title: Tutorial - Sample steps to interact with Seismic DDMS in Microsoft Azure Data Manager for Energy
description: This tutorial shows you how to interact with Seismic DDMS Azure Data Manager for Energy
author: elizabethhalper
ms.author: elhalper
ms.service: energy-data-services
ms.topic: tutorial
ms.date: 3/16/2022
ms.custom: template-tutorial
---

# Tutorial: Sample steps to interact with Seismic DDMS

Seismic DDMS provides the capability to operate on seismic data in the Azure Data Manager for Energy instance.

In this tutorial, you will learn how to:

> [!div class="checklist"]
> * Register a data partition for seismic data
> * Utilize Seismic DDMS APIs to store and retrieve seismic data

## Prerequisites

- An Azure subscription
- An instance of [Azure Data Manager for Energy](quickstart-create-microsoft-energy-data-services-instance.md) created in your Azure subscription.

## Get your Azure Data Manager for Energy instance details

The first step is to get the following information from your [Azure Data Manager for Energy instance](quickstart-create-microsoft-energy-data-services-instance.md) in the [Azure portal](https://portal.azure.com/?microsoft_azure_marketplace_ItemHideKey=Microsoft_Azure_OpenEnergyPlatformHidden):

| Parameter          | Value             | Example                               |
| ------------------ | ------------------------ |-------------------------------------- |
| client_id          | Application (client) ID  | 3dbbbcc2-f28f-44b6-a5ab-xxxxxxxxxxxx  |
| client_secret      | Client secrets           |  _fl******************                |
| tenant_id          | Directory (tenant) ID    | 72f988bf-86f1-41af-91ab-xxxxxxxxxxxx  |
| base_url           | URL                      | `https://<instance>.energy.azure.com` |
| data-partition-id  | Data Partition(s)        | `<data-partition-name>`               |

## Set up Postman

1. Download and install the [Postman](https://www.postman.com/downloads/) desktop app.
2. Import the following files into Postman:

   * [Seismic DDMS Postman collection](https://raw.githubusercontent.com/microsoft/adme-samples/main/postman/SeismicDDMS.postman_collection.json)
   * [Seismic DDMS Postman environment](https://raw.githubusercontent.com/microsoft/adme-samples/main/postman/SeismicDDMSEnvironment.postman_environment.json)

   To import the files:

   1. Select **Import** in Postman.

      :::image type="content" source="media/tutorial-ddms/postman-import-button.png" alt-text="Screenshot that shows the import button in Postman."  lightbox="media/tutorial-ddms/postman-import-button.png":::

   1. Paste the URL of each file into the search box.

      :::image type="content" source="media/tutorial-ddms/postman-import-search.png" alt-text="Screenshot that shows importing collection and environment files in Postman via URL."  lightbox="media/tutorial-ddms/postman-import-search.png":::

3. Update the **CURRENT_VALUE** of the Postman environment with the information obtained in Azure Data Manager for Energy instance details

## Utilize Seismic DDMS APIs to store and retrieve seismic data

### Create a legal tag

Create a legal tag that's automatically added to your Seismic DDMS environment for data compliance.

API: **Setup** > **Create Legal Tag for SDDMS**

Method: POST

:::image type="content" source="media/tutorial-seismic-ddms/postman-api-create-legal-tag.png" alt-text="Screenshot that shows the API that creates a legal tag." lightbox="media/tutorial-seismic-ddms/postman-api-create-legal-tag.png":::

For more information, see [Manage legal tags](how-to-manage-legal-tags.md).

### Service Verification

Run basic service connection and status tests in your Azure Data Manager for Energy instance.

API: **Service Verification** > **Check Access**

Method: GET

:::image type="content" source="media/tutorial-seismic-ddms/postman-api-check-service-status.png" alt-text="Screenshot that shows the API that checks the service's status." lightbox="media/tutorial-seismic-ddms/postman-api-check-service-status.png":::

### Tenant

Create a tenant in your Azure Data Manager for Energy instance.

**Note:** You must register a data partition as a tenant before using it with Seismic DDMS.

API: **Tenant** > **Register a Tenant**

Method: POST

:::image type="content" source="media/tutorial-seismic-ddms/postman-api-register-tenant.png" alt-text="Screenshot that shows the API that registers a tenant." lightbox="media/tutorial-seismic-ddms/postman-api-register-tenant.png":::

### Subproject

Create a subproject in your Azure Data Manager for Energy instance.

API: **Subproject** > **Create Subproject**

Method: POST

:::image type="content" source="media/tutorial-seismic-ddms/postman-api-create-subproject.png" alt-text="Screenshot that shows the API that creates a subproject." lightbox="media/tutorial-seismic-ddms/postman-api-create-subproject.png":::

### Dataset

Register a dataset in your Azure Data Manager for Energy instance.

API: **Dataset** > **Register a Dataset**

Method: POST

:::image type="content" source="media/tutorial-seismic-ddms/postman-api-create-dataset.png" alt-text="Screenshot that shows the API that creates a dataset." lightbox="media/tutorial-seismic-ddms/postman-api-create-dataset.png":::

### Applications

Register applications in your Azure Data Manager for Energy instance.

API: **Application** > **Register a New Application**

Method: POST

:::image type="content" source="media/tutorial-seismic-ddms/postman-api-register-application.png" alt-text="Screenshot that shows the API that registers an application." lightbox="media/tutorial-seismic-ddms/postman-api-register-application.png":::

## Next steps

As an alternative user experience to Postman, you can use SDUTIL to directly interact with the seismic store via the command line Python utility tool. Please follow this tutorial to get started.

<!-- Add a context sentence for the following links -->
> [!div class="nextstepaction"]
> [Seismic DDMS SDUTIL tutorial](./tutorial-seismic-ddms-sdutil.md)