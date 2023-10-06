---
title: Tutorial - Work with well data records by using Wellbore DDMS APIs
description: Learn how to work with well data records in your Azure Data Manager for Energy instance by using Wellbore Domain Data Management Services (Wellbore DDMS) APIs in Postman.
author: vkamani21
ms.author: vkamani
ms.service: energy-data-services
ms.topic: tutorial
ms.date: 09/07/2022
ms.custom: template-tutorial
---

# Tutorial: Work with well data records by using Wellbore DDMS APIs

Use Wellbore Domain Data Management Services (Wellbore DDMS) APIs in Postman to work with well data in your instance of Azure Data Manager for Energy.

In this tutorial, you'll learn how to:
> [!div class="checklist"]
>
> - Set up Postman to use a Wellbore DDMS collection.
> - Set up Postman to use a Wellbore DDMS environment.
> - Send requests via Postman.
> - Generate an authorization token.
> - Use Wellbore DDMS APIs to work with well data records.

For more information about DDMS, see [DDMS concepts](concepts-ddms.md).

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

You'll use this information later in the tutorial.

## Set up Postman

Next, set up Postman:

1. Download and install the [Postman](https://www.postman.com/downloads/) desktop app.

1. Import the following files in Postman:

   - [Wellbore DDMS Postman collection](https://raw.githubusercontent.com/microsoft/meds-samples/main/postman/WellboreDDMS.postman_collection.json)
   - [Wellbore DDMS Postman environment](https://raw.githubusercontent.com/microsoft/meds-samples/main/postman/WellboreDDMSEnvironment.postman_environment.json)

   To import the files:

   1. Select **Import** in Postman.

      :::image type="content" source="media/tutorial-ddms/postman-import-button.png" alt-text="Screenshot that shows the import button in Postman."  lightbox="media/tutorial-ddms/postman-import-button.png":::

   1. Paste the URL of each file into the search box.

      :::image type="content" source="media/tutorial-ddms/postman-import-search.png" alt-text="Screenshot that shows importing collection and environment files in Postman via URL."  lightbox="media/tutorial-ddms/postman-import-search.png":::
  
1. In the Postman environment, update **CURRENT VALUE** with the information from your Azure Data Manager for Energy instance details

   1. In Postman, in the left menu, select **Environments**, and then select **Wellbore DDMS Environment**.

   1. In the **CURRENT VALUE** column, enter the information that's described in the table in 'Get your Azure Data Manager for Energy instance details'.


   :::image type="content" source="media/tutorial-wellbore-ddms/postman-environment-current-values.png" alt-text="Screenshot that shows where to enter current values in the Wellbore DDMS environment.":::

## Send an example Postman request

The Postman collection for Wellbore DDMS contains requests you can use to interact with data about wells, wellbores, well logs, and well trajectory data in your Azure Data Manager for Energy instance.

1. In Postman, in the left menu, select **Collections**, and then select **Wellbore DDMS**. Under **Setup**, select **Get an SPN Token**.

1. In the environment dropdown in the upper-right corner, select **Wellbore DDMS Environment**.

   :::image type="content" source="media/tutorial-wellbore-ddms/postman-get-spn-token.png" alt-text="Screenshot that shows the Get an SPN Token setup and selecting the environment." lightbox="media/tutorial-wellbore-ddms/postman-get-spn-token.png":::

1. To send the request, select **Send**.

    :::image type="content" source="media/tutorial-wellbore-ddms/postman-request-send.png" alt-text="Screenshot that shows the Send button for a request in Postman.":::

1. The request  validates the actual API response code against the expected response code. Select the **Test Results** tab to see whether the request succeeded or failed.

    **Example of a successful Postman call:**

   :::image type="content" source="media/tutorial-wellbore-ddms/postman-test-success.png" alt-text="Screenshot that shows success for a Postman call." lightbox="media/tutorial-wellbore-ddms/postman-test-success.png":::

   **Example of a failed Postman call:**

   :::image type="content" source="media/tutorial-wellbore-ddms/postman-test-failure.png" alt-text="Screenshot that shows failure for a Postman call." lightbox="media/tutorial-wellbore-ddms/postman-test-failure.png":::

## Use Wellbore DDMS APIs to work with well data records

Successfully completing the Postman requests that are described in the following Wellbore DDMS APIs indicates successful ingestion and retrieval of well records in your Azure Data Manager for Energy instance.

### Create a legal tag

Create a legal tag that's automatically added to your Wellbore DDMS environment for data compliance.

API: **Setup** > **Create Legal Tag for WDMS**

Method: POST

:::image type="content" source="media/tutorial-wellbore-ddms/postman-api-create-legal-tag.png" alt-text="Screenshot that shows the API that creates a legal tag." lightbox="media/tutorial-wellbore-ddms/postman-api-create-legal-tag.png":::

For more information, see [Manage legal tags](how-to-manage-legal-tags.md).

### Create a well

Create a well record in your Azure Data Manager for Energy instance.

API: **Well** > **Create Well**

Method: POST

:::image type="content" source="media/tutorial-wellbore-ddms/postman-api-create-well.png" alt-text="Screenshot that shows the API that creates a well." lightbox="media/tutorial-wellbore-ddms/postman-api-create-well.png":::

### Get a well record

Get the well record data for your Azure Data Manager for Energy instance.

API: **Well** > **Well by ID**

Method: GET

:::image type="content" source="media/tutorial-wellbore-ddms/postman-api-get-well.png" alt-text="Screenshot that shows the API that gets a well by ID." lightbox="media/tutorial-wellbore-ddms/postman-api-get-well.png":::

### Get well versions

Get the versions of each ingested well record in your Azure Data Manager for Energy instance.

API: **Well** > **Well Versions**

Method: GET

:::image type="content" source="media/tutorial-wellbore-ddms/postman-api-get-well-versions.png" alt-text="Screenshot that shows the API that gets all well versions." lightbox="media/tutorial-wellbore-ddms/postman-api-get-well-versions.png":::

### Get a specific well version

Get the details of a specific version for a specific well record in your Azure Data Manager for Energy instance.

API: **Well** > **Well Specific Version**

Method: GET

:::image type="content" source="media/tutorial-wellbore-ddms/postman-api-get-specific-well-version.png" alt-text="Screenshot that shows the API that gets a specific well version." lightbox="media/tutorial-wellbore-ddms/postman-api-get-specific-well-version.png":::

### Delete a well record

Delete a specific well record from your Azure Data Manager for Energy instance.

API: **Clean up** > **Well Record**

Method: DELETE

:::image type="content" source="media/tutorial-wellbore-ddms/postman-api-delete-well.png" alt-text="Screenshot that shows the API that deletes a well record." lightbox="media/tutorial-wellbore-ddms/postman-api-delete-well.png":::

## Next steps

Go to the Seismic Store DDMS sdutil tutorial to learn how to use sdutil to load seismic data into Seismic Store:

> [!div class="nextstepaction"]
> [Tutorial: Seismic Store DDMS sdutil](tutorial-seismic-ddms-sdutil.md)
