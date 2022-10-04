---
title: Tutorial - Sample steps to interact with Wellbore DDMS  #Required; page title is displayed in search results. Include the brand.
description: This tutorial shows you how to interact with Wellbore DDMS in Microsoft Energy Data Services #Required; article description that is displayed in search results. 
author: vkamani21 #Required; your GitHub user alias, with correct capitalization.
ms.author: vkamani #Required; microsoft alias of author; optional team alias.
ms.service: energy-data-services #Required; service per approved list. slug assigned by ACOM.
ms.topic: tutorial #Required; leave this attribute/value as-is.
ms.date: 09/07/2022
ms.custom: template-tutorial #Required; leave this attribute/value as-is.
---

# Tutorial: Sample steps to interact with Wellbore DDMS

Wellbore DDMS provides the capability to operate on well data in the Microsoft Energy Data Services instance.

In this tutorial, you'll learn how to:
> [!div class="checklist"]
> * Utilize Wellbore DDMS APIs to store and retrieve Wellbore and well log data

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Prerequisites

### Microsoft Energy Data Services instance details

* Once the [Microsoft Energy Data Services Preview instance](quickstart-create-microsoft-energy-data-services-instance.md) is created, save the following details:

```Table
  | Parameter          | Value to use             | Example                               |
  | ------------------ | ------------------------ |-------------------------------------- |
  | CLIENT_ID          | Application (client) ID  | 3dbbbcc2-f28f-44b6-a5ab-xxxxxxxxxxxx  |
  | CLIENT_SECRET      | Client secrets           |  _fl******************                |
  | TENANT_ID          | Directory (tenant) ID    | 72f988bf-86f1-41af-91ab-xxxxxxxxxxxx  |
  | SCOPE              | Application (client) ID  | 3dbbbcc2-f28f-44b6-a5ab-xxxxxxxxxxxx  |
  | base_uri           | URI                      | <instance>.energy.azure.com           |
  | data-partition-id  | Data Partition(s)        | <instance>-<data-partition-name>      |
```

### Postman setup

1. Download and install [Postman](https://www.postman.com/) desktop app
1. Import the following files into Postman:
  1. [Wellbore ddms Postman collection](https://raw.githubusercontent.com/microsoft/meds-samples/main/postman/WellboreDDMS.postman_collection.json)
  1. [Wellbore ddms Postman Environment](https://raw.githubusercontent.com/microsoft/meds-samples/main/postman/WellboreDDMSEnvironment.postman_environment.json)
  
1. Update the **CURRENT_VALUE** of the Postman Environment with the information obtained in [Microsoft Energy Data Services instance details](#microsoft-energy-data-services-instance-details)

### Executing Postman Requests

1. The Postman collection for Wellbore ddms contains requests that allows interaction with wells, wellbore, well log and well trajectory data.
2. Make sure to choose the **Wellbore DDMS Environment** before triggering the Postman collection.
  :::image type="content" source="media/tutorial-wellbore-ddms/tutorial-postman-choose-wellbore-environment.png" alt-text="Choose environment." lightbox="media/tutorial-wellbore-ddms/tutorial-postman-choose-wellbore-environment.png":::
3. Each request can be triggered by clicking the **Send** Button.
4. On every request Postman will validate the actual API response code against the expected response code; if there's any mismatch the Test Section will indicate failures.

**Successful Postman Call**

:::image type="content" source="media/tutorial-wellbore-ddms/tutorial-postman-test-success.png" alt-text="Screenshot-of-Success." lightbox="media/tutorial-wellbore-ddms/tutorial-postman-test-success.png":::

**Failed Postman Call**

:::image type="content" source="media/tutorial-wellbore-ddms/tutorial-postman-test-failure.png" alt-text="Screenshot-of-Failure." lightbox="media/tutorial-wellbore-ddms/tutorial-postman-test-failure.png":::

### Generate a token

1. **Get a Token** - Import the CURL command in Postman to generate the bearer token. Update the bearerToken in wellbore ddms environment. Use Bearer Token as Authorization type in other API calls.
      ```bash
      curl --location --request POST 'https://login.microsoftonline.com/{{TENANT_ID}}/oauth2/v2.0/token' \
          --header 'Content-Type: application/x-www-form-urlencoded' \
          --data-urlencode 'grant_type=client_credentials' \
          --data-urlencode 'client_id={{CLIENT_ID}}' \
          --data-urlencode 'client_secret={{CLIENT_SECRET}}' \
          --data-urlencode 'scope={{SCOPE}}'  
      ```
  :::image type="content" source="media/tutorial-wellbore-ddms/tutorial-of-the-wellbore-generate-token.png" alt-text="Screenshot of the wellbore generate token." lightbox="media/tutorial-wellbore-ddms/tutorial-of-the-wellbore-generate-token.png":::

## Store and retrieve Wellbore and Well Log data with Wellbore ddms APIs

1. **Create a Legal Tag** - Create a legal tag that will be added automatically to the environment for data compliance purpose.
2. **Create Well** - Creates the wellbore record in Microsoft Energy Data Services instance.
   :::image type="content" source="media/tutorial-wellbore-ddms/tutorial-create-well.png" alt-text="Screenshot of creating a Well." lightbox="media/tutorial-wellbore-ddms/tutorial-create-well.png":::
3. **Get Wells** - Returns the well data created in the last step.
  :::image type="content" source="media/tutorial-wellbore-ddms/tutorial-get-wells.png" alt-text="Screenshot of getting all wells." lightbox="media/tutorial-wellbore-ddms/tutorial-get-wells.png":::
1. **Get Well Versions** - Returns the versions of each ingested well record.
  :::image type="content" source="media/tutorial-wellbore-ddms/tutorial-get-well-versions.png" alt-text="Screenshot of getting all Well versions." lightbox="media/tutorial-wellbore-ddms/tutorial-get-well-versions.png":::
1. **Get specific Well Version** - Returns the details of specified version of specified record.
  :::image type="content" source="media/tutorial-wellbore-ddms/tutorial-get-specific-well-version.png" alt-text="Screenshot of getting a specific well version." lightbox="media/tutorial-wellbore-ddms/tutorial-get-specific-well-version.png":::
1. **Delete well record** - Deletes the specified record.
  :::image type="content" source="media/tutorial-wellbore-ddms/tutorial-delete-well.png" alt-text="Screenshot of delete well record." lightbox="media/tutorial-wellbore-ddms/tutorial-delete-well.png":::

***Successful completion of above steps indicates success ingestion and retrieval of well records***

## Next steps
Advance to the next tutorial to learn about sdutil
> [!div class="nextstepaction"]
> [Tutorial: Seismic store sdutil](tutorial-seismic-ddms-sdutil.md)
