---
title: "Tutorial: Work with well data records by using Well Delivery DDMS APIs"
description: Learn how to work with well data records in your Azure Data Manager for Energy instance by using Well Delivery Domain Data Management Services (DDMS) APIs in Postman.
author: dprakash-sivakumar
ms.author: prasivakumar
ms.service: azure-data-manager-energy
ms.topic: tutorial
ms.date: 07/28/2022
ms.custom: template-tutorial

#Customer intent: As a developer, I want to learn how to use the Well Delivery DDMS APIs so that I can store and retrieve similar kinds of data records.
---

# Tutorial: Work with well data records by using Well Delivery DDMS APIs

Use Well Delivery Domain Data Management Services (DDMS) APIs in Postman to work with well data in your instance of Azure Data Manager for Energy.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Set up Postman to use a Well Delivery DDMS collection.
> - Set up Postman to use a Well Delivery DDMS environment.
> - Send requests via Postman.
> - Generate an authorization token.
> - Use Well Delivery DDMS APIs to work with well data records.

For more information about DDMS, see [DDMS concepts](concepts-ddms.md).

## Prerequisites

- An Azure subscription
- An instance of [Azure Data Manager for Energy](quickstart-create-microsoft-energy-data-services-instance.md) created in your Azure subscription

## Get your Azure Data Manager for Energy instance details

The first step is to get the following information from your [Azure Data Manager for Energy instance](quickstart-create-microsoft-energy-data-services-instance.md) in the [Azure portal](https://portal.azure.com/?microsoft_azure_marketplace_ItemHideKey=Microsoft_Azure_OpenEnergyPlatformHidden):

| Parameter          | Value             | Example                               |
| ------------------ | ------------------------ |-------------------------------------- |
| `CLIENT_ID`          | Application (client) ID  | `00001111-aaaa-2222-bbbb-3333cccc4444`  |
| `CLIENT_SECRET`      | Client secrets           |  `_fl******************`                |
| `TENANT_ID`          | Directory (tenant) ID    | `72f988bf-86f1-41af-91ab-xxxxxxxxxxxx`  |
| `SCOPE`              | Application (client) ID  | `00001111-aaaa-2222-bbbb-3333cccc4444`  |
| `base_uri`           | URI                      | `<instance>.energy.azure.com`           |
| `data-partition-id`  | Data partitions        | `<instance>-<data-partition-name>`                    |

You'll use this information later in the tutorial.

## Set up Postman

1. Download and install the [Postman](https://www.postman.com/downloads/) desktop app.

1. Import the following files in Postman:

   - [Well Delivery DDMS Postman collection](https://raw.githubusercontent.com/microsoft/meds-samples/main/postman/WelldeliveryDDMS.postman_collection.json)
   - [Well Delivery DDMS Postman environment](https://raw.githubusercontent.com/microsoft/meds-samples/main/postman/WelldeliveryDDMSEnviroment.postman_environment.json)

   To import the files:

   1. Create two JSON files on your computer by copying the data that's in the collection and environment files.

   1. In Postman, select **Import** > **Files** > **Choose Files**, and then select the two JSON files on your computer.

   1. In **Import Entities** in Postman, select **Import**.

      :::image type="content" source="media/tutorial-well-delivery/import-files.png" alt-text="Screenshot that shows importing collection and environment files."  lightbox="media/tutorial-well-delivery/import-files.png":::
  
1. In the Postman environment, update **CURRENT VALUE** with the information from your Azure Data Manager for Energy instance:

   1. In Postman, on the left menu, select **Environments**, and then select **WellDelivery Environment**.

   1. In the **CURRENT VALUE** column, enter the information from the table in the [Get your Azure Data Manager for Energy instance details](#get-your-azure-data-manager-for-energy-instance-details) section of this tutorial.

   :::image type="content" source="media/tutorial-well-delivery/postman-environment-current-values.png" alt-text="Screenshot that shows where to enter current values in the Well Delivery DDMS environment.":::

## Send a Postman request

The Postman collection for Well Delivery DDMS contains requests that you can use to interact with data about wells, wellbores, well logs, and well trajectory in your Azure Data Manager for Energy instance.

For an example of how to send a Postman request, see the [Wellbore DDMS tutorial](tutorial-wellbore-ddms.md#send-an-example-postman-request).

## Generate a token for APIs

Generate a token that you can use to work with Well Delivery DDMS APIs:

1. Import the following cURL command in Postman to generate a bearer token. Use the values from your Azure Data Manager for Energy instance.

     ```bash
      curl --location --request POST 'https://login.microsoftonline.com/{{TENANT_ID}}/oauth2/v2.0/token' \
          --header 'Content-Type: application/x-www-form-urlencoded' \
          --data-urlencode 'grant_type=client_credentials' \
          --data-urlencode 'client_id={{CLIENT_ID}}' \
          --data-urlencode 'client_secret={{CLIENT_SECRET}}' \
          --data-urlencode 'scope={{SCOPE}}'  
      ```

   :::image type="content" source="media/tutorial-well-delivery/postman-generate-token.png" alt-text="Screenshot of cURL code in a Well Delivery DDMS token." lightbox="media/tutorial-well-delivery/postman-generate-token.png":::

1. Use the token output to update `access_token` in your Well Delivery DDMS environment. Then, you can use the bearer token as an authorization type in other API calls.

## Use Well Delivery DDMS APIs to work with well data records

Successfully completing the Postman requests that are described in the following Well Delivery DDMS APIs indicates successful ingestion and retrieval of well records in your Azure Data Manager for Energy instance.

### Create a well record

Create a well record in your Azure Data Manager for Energy instance.

API: **UC1** > **entity_create well**

Method: `PUT`

:::image type="content" source="media/tutorial-well-delivery/postman-api-create-well.png" alt-text="Screenshot that shows the API that creates a well record." lightbox="media/tutorial-well-delivery/postman-api-create-well.png":::

### Create a wellbore record

Create a wellbore record in your Azure Data Manager for Energy instance.

API: **UC1** > **entity_create wellbore**

Method: `PUT`

:::image type="content" source="media/tutorial-well-delivery/postman-api-create-well-bore.png" alt-text="Screenshot that shows the API that creates a wellbore record." lightbox="media/tutorial-well-delivery/postman-api-create-well-bore.png":::

### Get a well version

Get a well record based on a specific well ID.

API: **UC1** > **entity_create well Copy**

Method: `GET`

:::image type="content" source="media/tutorial-well-delivery/postman-api-get-well.png" alt-text="Screenshot that shows the API that gets a well record based on a specific well ID." lightbox="media/tutorial-well-delivery/postman-api-get-well.png":::

### Create an activity plan

Create an activity plan.

API: **UC1** > **entity_create activityplan**

Method: `PUT`

:::image type="content" source="media/tutorial-well-delivery/postman-api-create-activity-plan.png" alt-text="Screenshot that shows the API that creates an activity plan." lightbox="media/tutorial-well-delivery/postman-api-create-activity-plan.png":::

### Get an activity plan by well ID

Get the activity plan object for a specific well ID.

API: **UC2** > **activity_plans_by_well**

Method: `GET`

:::image type="content" source="media/tutorial-well-delivery/postman-api-activity-plans-by-well.png" alt-text="Screenshot of the API that gets an activity plan by well ID." lightbox="media/tutorial-well-delivery/postman-api-activity-plans-by-well.png":::

### Delete a wellbore record

You can delete a wellbore record in your Azure Data Manager for Energy instance by using Well Delivery DDMS APIs. The following screenshot shows an example.

:::image type="content" source="media/tutorial-well-delivery/postman-api-delete-well-bore.png" alt-text="Screenshot that shows how to use an API to delete a wellbore record.":::

### Delete a well record

You can delete a well record in your Azure Data Manager for Energy instance by using Well Delivery DDMS APIs. The following screenshot shows an example.

:::image type="content" source="media/tutorial-well-delivery/postman-api-delete-well.png" alt-text="Screenshot that shows how to use an API to delete a well record.":::

## Next steps

Go to the next tutorial to learn how to work with well data by using Wellbore DDMS APIs:

> [!div class="nextstepaction"]
> [Tutorial: Work with well data records by using Wellbore DDMS APIs](tutorial-wellbore-ddms.md)
