---
title: Microsoft Energy Data Services - Steps to interact with Well Delivery DDMS  #Required; page title is displayed in search results. Include the brand.
description: This tutorial shows you how to interact with Well Delivery DDMS #Required; article description that is displayed in search results. 
author: dprakash-sivakumar #Required; your GitHub user alias, with correct capitalization.
ms.author: disivakumar #Required; microsoft alias of author; optional team alias.
ms.service: energy-data-services #Required; service per approved list. slug assigned by ACOM.
ms.topic: tutorial #Required; leave this attribute/value as-is.
ms.date: 07/28/2022
ms.custom: template-tutorial #Required; leave this attribute/value as-is.
---

# Tutorial: Steps to interact with Well Delivery DDMS

Well Delivery DDMS provides the capability to manage well related data in the Microsoft Energy Data Services instance.

In this tutorial, you will learn how to:


> * Utilize Well Delivery DDMS Api's to store and retrieve well data

## Prerequisites

### Get Microsoft Energy Data Services instance details

* Once the [Microsoft Energy Data Services instance](quickstart-create-project-oak-forest-instance.md) is created, note down the following details:

```Table
  | Parameter          | Value to use             | Example                               |
  | ------------------ | ------------------------ |-------------------------------------- |
  | CLIENT_ID          | Application (client) ID  | 3dbbbcc2-f28f-44b6-a5ab-a6a5cb7c7862  |
  | CLIENT_SECRET      | Client secrets           |  _fl******************                |
  | TENANT_ID          | Directory (tenant) ID    | 72f988bf-86f1-41af-91ab-2d7cd011db47  |
  | SCOPE              | Application (client) ID  | 3dbbbcc2-f28f-44b6-a5ab-a6a5cb7c7862  |
  | base_uri           | URI                      | bseloak.energy.azure.com              |
  | data-partition-id  | Data Partition(s)        | bseloak-bseldp1                       |
```

### Postman setup

* Download and install [Postman](https://www.postman.com/) desktop app.
* Import the following files into Postman:
  > [!NOTE]
  > For the below Postman files, click the **Raw** file on GitHub and save to your local machine.
  >
  > To import the Postman collection and environment variables, follow the steps outlined in [Importing data into Postman](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-data-into-postman)
   * [Well Delivery DDMS Postman collection](https://raw.githubusercontent.com/microsoft/meds-samples/main/postman/WelldeliveryDDMS.postman_collection.json)
   * [Well Delivery DDMS Postman Environment](https://raw.githubusercontent.com/microsoft/meds-samples/main/postman/WelldeliveryDDMSEnviroment.postman_environment.json)
 
* Update the **CURRENT_VALUE** of the Postman Environment with the information obtained in [Microsoft Energy Data Services instance details](#get-microsoft-energy-data-services-instance-details).

### Executing postman requests

* The Postman collection for Well Delivery DDMS contains requests that allows interaction with wells, wellbore, well planning, wellbore planning, wellactivityprogram and well trajectory data.
* Make sure to choose the **Well Delivery DDMS Environment** before triggering the Postman collection.
* Each request can be triggered by clicking the **Send** Button.
* On every request Postman will validate the actual API response code against the expected response code; if there is any mismatch the Test Section will indicate failures.

## Generate token

1. **Get a Token** - Import the CURL command in postman to generate the bearer token. Update the bearerToken in well delivery ddms environment. Use Bearer Token as Authorization type in other API calls.
      ```bash
      curl --location --request POST 'https://login.microsoftonline.com/{{TENANT_ID}}/oauth2/v2.0/token' \
          --header 'Content-Type: application/x-www-form-urlencoded' \
          --data-urlencode 'grant_type=client_credentials' \
          --data-urlencode 'client_id={{CLIENT_ID}}' \
          --data-urlencode 'client_secret={{CLIENT_SECRET}}' \
          --data-urlencode 'scope={{SCOPE}}'  
      ```
:::image type="content" source="media/tutorial-well-delivery/screenshot-of-the-well-delivery-generate-token.png" alt-text="Screenshot of the well delivery generate token.":::


## Steps to insert and get the Well data

1. **Create Well** - Creates the well record.
:::image type="content" source="media/tutorial-well-delivery/screenshot-of-the-well-delivery-create-well.png" alt-text="Screenshot of the well delivery - create well.":::
1. **Create Wellbore** - Creates the wellbore record.
:::image type="content" source="media/tutorial-well-delivery/screenshot-of-the-well-delivery-create-well-bore.png" alt-text="Screenshot of the well delivery - create wellbore.":::
1. **Get Well Version** - Returns the well record based on given WellId.
:::image type="content" source="media/tutorial-well-delivery/screenshot-of-the-well-delivery-get-well.png" alt-text="Screenshot of the well delivery - get well.":::
1. **Get Wellbore Version** - Returns the wellbore record based on given WellboreId.
:::image type="content" source="media/tutorial-well-delivery/screenshot-of-the-well-delivery-get-well-bore.png" alt-text="Screenshot of the well delivery - get wellbore.":::
1. **Create ActivityPlan** - Create the ActivityPlan.
:::image type="content" source="media/tutorial-well-delivery/screenshot-of-the-well-delivery-create-activity-plan.png" alt-text="Screenshot of the well delivery - create activityplan.":::
1. **Get ActivityPlan by Well Id** - Returns the Activity Plan object from a wellId generated in Step 1.
:::image type="content" source="media/tutorial-well-delivery/screenshot-of-the-well-delivery-activity-plans-by-well.png" alt-text="Screenshot of the well delivery - get activityplan by well.":::
1. **Delete wellbore record** - Deletes the specified wellbore record.
:::image type="content" source="media/tutorial-well-delivery/screenshot-of-the-well-delivery-delete-well-bore.png" alt-text="Screenshot of the well delivery - delete wellbore.":::
1. **Delete well record** - Deletes the specified well record.
:::image type="content" source="media/tutorial-well-delivery/screenshot-of-the-well-delivery-delete-well.png" alt-text="Screenshot of the well delivery - delete well.":::

Completion of above steps indicates successful creation and retrieval of well and wellbore records. Similar steps could be followed for wellplanning, wellboreplanning, wellactivityprogram and wellbore trajectory data.

## See also

- [Seismic DMS SDUTIL Tutorial](/articles/energy-data-services/tutorial-seismic-ddms-sdutil.md)