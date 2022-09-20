---
title: Microsoft Energy Data Services Preview - Steps to interact with Well Delivery DDMS  #Required; page title is displayed in search results. Include the brand.
description: This tutorial shows you how to interact with Well Delivery DDMS #Required; article description that is displayed in search results. 
author: dprakash-sivakumar #Required; your GitHub user alias, with correct capitalization.
ms.author: disivakumar #Required; microsoft alias of author; optional team alias.
ms.service: energy-data-services #Required; service per approved list. slug assigned by ACOM.
ms.topic: tutorial #Required; leave this attribute/value as-is.
ms.date: 07/28/2022
ms.custom: template-tutorial #Required; leave this attribute/value as-is.
---

# Tutorial: Sample steps to interact with Well Delivery ddms

Well Delivery DDMS provides the capability to manage well related data in the Microsoft Energy Data Services Preview instance.

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Utilize Well Delivery DDMS API's to store and retrieve well data

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Prerequisites

### Get Microsoft Energy Data Services Preview instance details

* Once the [Microsoft Energy Data Services Preview instance](quickstart-create-microsoft-energy-data-services-instance.md) is created, note down the following details:

```Table
  | Parameter          | Value to use             | Example                               |
  | ------------------ | ------------------------ |-------------------------------------- |
  | CLIENT_ID          | Application (client) ID  | 3dbbbcc2-f28f-44b6-a5ab-xxxxxxxxxxxx  |
  | CLIENT_SECRET      | Client secrets           |  _fl******************                |
  | TENANT_ID          | Directory (tenant) ID    | 72f988bf-86f1-41af-91ab-xxxxxxxxxxxx  |
  | SCOPE              | Application (client) ID  | 3dbbbcc2-f28f-44b6-a5ab-xxxxxxxxxxxx  |
  | base_uri           | URI                      | <instance>.energy.azure.com              |
  | data-partition-id  | Data Partition(s)        | <instance>-<data-partition-name>                       |
```

### How to set up Postman

* Download and install [Postman](https://www.postman.com/) desktop app.
* Import the following files into Postman:
   * [Well Delivery DDMS Postman collection](https://raw.githubusercontent.com/microsoft/meds-samples/main/postman/WelldeliveryDDMS.postman_collection.json)
   * [Well Delivery DDMS Postman Environment](https://raw.githubusercontent.com/microsoft/meds-samples/main/postman/WelldeliveryDDMSEnviroment.postman_environment.json)
 
* Update the **CURRENT_VALUE** of the Postman Environment with the information obtained in [Microsoft Energy Data Services Preview instance details](#get-microsoft-energy-data-services-preview-instance-details).

### How to execute Postman requests

* The Postman collection for Well Delivery DDMS contains requests that allows interaction with wells, wellbore, well planning, wellbore planning, well activity program and well trajectory data.
* Make sure to choose the **Well Delivery DDMS Environment** before triggering the Postman collection.
* Each request can be triggered by clicking the **Send** Button.
* On every request Postman will validate the actual API response code against the expected response code; if there's any mismatch the Test Section will indicate failures.

### Generate a token

1. **Get a Token** - Import the CURL command in Postman to generate the bearer token. Update the bearerToken in well delivery ddms environment. Use Bearer Token as Authorization type in other API calls.
      ```bash
      curl --location --request POST 'https://login.microsoftonline.com/{{TENANT_ID}}/oauth2/v2.0/token' \
          --header 'Content-Type: application/x-www-form-urlencoded' \
          --data-urlencode 'grant_type=client_credentials' \
          --data-urlencode 'client_id={{CLIENT_ID}}' \
          --data-urlencode 'client_secret={{CLIENT_SECRET}}' \
          --data-urlencode 'scope={{SCOPE}}'  
      ```
  :::image type="content" source="media/tutorial-well-delivery/screenshot-of-the-well-delivery-generate-token.png" alt-text="Screenshot of the well delivery generate token." lightbox="media/tutorial-well-delivery/screenshot-of-the-well-delivery-generate-token.png":::


## Store and retrieve well data with Well Delivery ddms APIs

1. **Create a Legal Tag** - Create a legal tag that will be added automatically to the environment for data compliance purpose.
1. **Create Well** - Creates the well record.
  :::image type="content" source="media/tutorial-well-delivery/screenshot-of-the-well-delivery-create-well.png" alt-text="Screenshot of the well delivery - create well." lightbox="media/tutorial-well-delivery/screenshot-of-the-well-delivery-create-well.png":::
1. **Create Wellbore** - Creates the wellbore record.
  :::image type="content" source="media/tutorial-well-delivery/screenshot-of-the-well-delivery-create-well-bore.png" alt-text="Screenshot of the well delivery - create wellbore." lightbox="media/tutorial-well-delivery/screenshot-of-the-well-delivery-create-well-bore.png":::
1. **Get Well Version** - Returns the well record based on given WellId.
  :::image type="content" source="media/tutorial-well-delivery/screenshot-of-the-well-delivery-get-well.png" alt-text="Screenshot of the well delivery - get well." lightbox="media/tutorial-well-delivery/screenshot-of-the-well-delivery-get-well.png":::
1. **Get Wellbore Version** - Returns the wellbore record based on given WellboreId.
  :::image type="content" source="media/tutorial-well-delivery/screenshot-of-the-well-delivery-get-well-bore.png" alt-text="Screenshot of the well delivery - get wellbore." lightbox="media/tutorial-well-delivery/screenshot-of-the-well-delivery-get-well-bore.png":::
1. **Create ActivityPlan** - Create the ActivityPlan.
  :::image type="content" source="media/tutorial-well-delivery/screenshot-of-the-well-delivery-create-activity-plan.png" alt-text="Screenshot of the well delivery - create activity plan." lightbox="media/tutorial-well-delivery/screenshot-of-the-well-delivery-create-activity-plan.png":::
1. **Get ActivityPlan by Well Id** - Returns the Activity Plan object from a wellId generated in Step 1.
  :::image type="content" source="media/tutorial-well-delivery/screenshot-of-the-well-delivery-activity-plans-by-well.png" alt-text="Screenshot of the well delivery - get activity plan by well." lightbox="media/tutorial-well-delivery/screenshot-of-the-well-delivery-activity-plans-by-well.png":::
1. **Delete wellbore record** - Deletes the specified wellbore record.
  :::image type="content" source="media/tutorial-well-delivery/screenshot-of-the-well-delivery-delete-well-bore.png" alt-text="Screenshot of the well delivery - delete wellbore." lightbox="media/tutorial-well-delivery/screenshot-of-the-well-delivery-delete-well-bore.png":::
1. **Delete well record** - Deletes the specified well record.
  :::image type="content" source="media/tutorial-well-delivery/screenshot-of-the-well-delivery-delete-well.png" alt-text="Screenshot of the well delivery - delete well." lightbox="media/tutorial-well-delivery/screenshot-of-the-well-delivery-delete-well.png":::

Completion of the above steps indicates successful creation and retrieval of well and wellbore records. Similar steps could be followed for well planning, wellbore planning, well activity program and wellbore trajectory data.

## See also
Advance to the next tutorial to learn how to use sdutil to load seismic data into seismic store
> [!div class="nextstepaction"]
> [Tutorial: Sample steps to interact with Wellbore ddms](tutorial-wellbore-ddms.md)