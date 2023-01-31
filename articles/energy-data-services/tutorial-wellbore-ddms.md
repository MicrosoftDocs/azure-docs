---
title: Tutorial - Work with well data records by using Wellbore DDMS APIs
description: Learn how to work with well data records in your Microsoft Energy Data Services Preview instance by using Wellbore Domain Data Management Services (Wellbore DDMS) APIs in Postman.
author: vkamani21
ms.author: vkamani
ms.service: energy-data-services
ms.topic: tutorial
ms.date: 09/07/2022
ms.custom: template-tutorial
---

# Tutorial: Work with well data records by using Wellbore DDMS APIs

Use Wellbore Domain Data Management Services (Wellbore DDMS) APIs in Postman to work with well data in your instance of Microsoft Energy Data Services Preview.

In this tutorial, you'll learn how to:
> [!div class="checklist"]
>
> - Set up Postman to use a Wellbore DDMS collection.
> - Set up Postman to use a Wellbore DDMS environment.
> - Send requests via Postman.
> - Generate an authorization token.
> - Use Wellbore DDMS APIs to work with well data records.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

For more information about DDMS, see [DDMS concepts](concepts-ddms.md).

## Prerequisites

- An Azure subscription
- An instance of [Microsoft Energy Data Services Preview](quickstart-create-microsoft-energy-data-services-instance.md) created in your Azure subscription.

## Get your Microsoft Energy Data Services instance details

The first step is to get the following information from your [Microsoft Energy Data Services Preview instance](quickstart-create-microsoft-energy-data-services-instance.md) in the [Azure portal](https://portal.azure.com/?microsoft_azure_marketplace_ItemHideKey=Microsoft_Azure_OpenEnergyPlatformHidden):

| Parameter          | Value             | Example                               |
| ------------------ | ------------------------ |-------------------------------------- |
| CLIENT_ID          | Application (client) ID  | 3dbbbcc2-f28f-44b6-a5ab-xxxxxxxxxxxx  |
| CLIENT_SECRET      | Client secrets           |  _fl******************                |
| TENANT_ID          | Directory (tenant) ID    | 72f988bf-86f1-41af-91ab-xxxxxxxxxxxx  |
| SCOPE              | Application (client) ID  | 3dbbbcc2-f28f-44b6-a5ab-xxxxxxxxxxxx  |
| base_uri           | URI                      | `<instance>.energy.azure.com`           |
| data-partition-id  | Data Partition(s)        | `<instance>-<data-partition-name>`                    |

You'll use this information later in the tutorial.

## Set up Postman

Next, set up Postman:

1. Download and install the [Postman](https://www.postman.com/downloads/) desktop app.

1. Import the following files in Postman:

   - [Wellbore DDMS Postman collection](https://raw.githubusercontent.com/microsoft/meds-samples/main/postman/WellboreDDMS.postman_collection.json)
   - [Wellbore DDMS Postman environment](https://raw.githubusercontent.com/microsoft/meds-samples/main/postman/WellboreDDMSEnvironment.postman_environment.json)

   To import the files:

   1. Create two JSON files on your computer by copying the data that's in the collection and environment files.

   1. In Postman, select **Import** > **Files** > **Choose Files**, and then select the two JSON files on your computer.

   1. In **Import Entities** in Postman, select **Import**.

       :::image type="content" source="media/tutorial-wellbore-ddms/postman-import-files.png" alt-text="Screenshot that shows importing collection and environment files in Postman."  lightbox="media/tutorial-wellbore-ddms/postman-import-files.png":::
  
1. In the Postman environment, update **CURRENT VALUE** with the information from your [Microsoft Energy Data Services instance](#get-your-microsoft-energy-data-services-instance-details):

   1. In Postman, in the left menu, select **Environments**, and then select **Wellbore DDMS Environment**.

   1. In the **CURRENT VALUE** column, enter the information that's described in the table in [Get your Microsoft Energy Data Services instance details](#get-your-microsoft-energy-data-services-instance-details).

   :::image type="content" source="media/tutorial-wellbore-ddms/postman-environment-current-values.png" alt-text="Screenshot that shows where to enter current values in the Wellbore DDMS environment.":::

## Send an example Postman request

The Postman collection for Wellbore DDMS contains requests you can use to interact with data about wells, wellbores, well logs, and well trajectory data in your Microsoft Energy Data Services instance.

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

## Generate a token to use in APIs

To generate a token:

1. Import the following cURL command in Postman to generate a bearer token. Use the values from your Microsoft Energy Data Services instance.

      ```bash
      curl --location --request POST 'https://login.microsoftonline.com/{{TENANT_ID}}/oauth2/v2.0/token' \
          --header 'Content-Type: application/x-www-form-urlencoded' \
          --data-urlencode 'grant_type=client_credentials' \
          --data-urlencode 'client_id={{CLIENT_ID}}' \
          --data-urlencode 'client_secret={{CLIENT_SECRET}}' \
          --data-urlencode 'scope={{SCOPE}}'  
      ```

   :::image type="content" source="media/tutorial-wellbore-ddms/postman-generate-token.png" alt-text="Screenshot of the Wellbore DDMs generate token cURL code." lightbox="media/tutorial-wellbore-ddms/postman-generate-token.png":::

1. Use the token output to update `access_token` in your Wellbore DDMS environment. Then, you can use the bearer token as an authorization type in other API calls.

## Use Wellbore DDMS APIs to work with well data records

Successfully completing the Postman requests that are described in the following Wellbore DDMS APIs indicates successful ingestion and retrieval of well records in your Microsoft Energy Data Services instance.

### Create a legal tag

Create a legal tag that's automatically added to your Wellbore DDMS environment for data compliance.

API: **Setup** > **Create Legal Tag for WDMS**

Method: POST

:::image type="content" source="media/tutorial-wellbore-ddms/postman-api-create-legal-tag.png" alt-text="Screenshot that shows the API that creates a legal tag." lightbox="media/tutorial-wellbore-ddms/postman-api-create-legal-tag.png":::

For more information, see [Manage legal tags](how-to-manage-legal-tags.md).

### Create a well

Create a well record in your Microsoft Energy Data Services instance.

API: **Well** > **Create Well**.

Method: POST

:::image type="content" source="media/tutorial-wellbore-ddms/postman-api-create-well.png" alt-text="Screenshot that shows the API that creates a well." lightbox="media/tutorial-wellbore-ddms/postman-api-create-well.png":::

### Get a well record

Get the well record data for your Microsoft Energy Data Services instance.

API: **Well** > **Well**

Method: GET

:::image type="content" source="media/tutorial-wellbore-ddms/postman-api-get-wells.png" alt-text="Screenshot that shows the API that gets all wells." lightbox="media/tutorial-wellbore-ddms/postman-api-get-wells.png":::

### Get well versions

Get the versions of each ingested well record in your Microsoft Energy Data Services instance.

API: **Well** > **Well versions**

Method: GET

:::image type="content" source="media/tutorial-wellbore-ddms/postman-api-get-well-versions.png" alt-text="Screenshot that shows the API that gets all well versions." lightbox="media/tutorial-wellbore-ddms/postman-api-get-well-versions.png":::

### Get a specific well version

Get the details of a specific version for a specific well record in your Microsoft Energy Data Services instance.

API: **Well** > **Well Specific version**

Method: GET

:::image type="content" source="media/tutorial-wellbore-ddms/postman-api-get-specific-well-version.png" alt-text="Screenshot that shows the API that gets a specific well version." lightbox="media/tutorial-wellbore-ddms/postman-api-get-specific-well-version.png":::

### Delete a well record

Delete a specific well record from your Microsoft Energy Data Services instance.

API: **Clean up** > **Well Record**

Method: DELETE

:::image type="content" source="media/tutorial-wellbore-ddms/postman-api-delete-well.png" alt-text="Screenshot that shows the API that deletes a well record." lightbox="media/tutorial-wellbore-ddms/postman-api-delete-well.png":::

## Next steps

Go to the Seismic Store DDMS sdutil tutorial to learn how to use sdutil to load seismic data into Seismic Store:

> [!div class="nextstepaction"]
> [Tutorial: Seismic Store DDMS sdutil](tutorial-seismic-ddms-sdutil.md)
