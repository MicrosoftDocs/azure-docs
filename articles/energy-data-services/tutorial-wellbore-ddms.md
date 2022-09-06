---
title: Tutorial - Sample steps to interact with Wellbore DDMS  #Required; page title is displayed in search results. Include the brand.
description: This tutorial shows you how to interact with Wellbore DDMS in Project Oak #Required; article description that is displayed in search results. 
author: vkamani21 #Required; your GitHub user alias, with correct capitalization.
ms.author: vkamani #Required; microsoft alias of author; optional team alias.
ms.service: azure #Required; service per approved list. slug assigned by ACOM.
ms.topic: tutorial #Required; leave this attribute/value as-is.
ms.date: 12/08/2021
ms.custom: template-tutorial #Required; leave this attribute/value as-is.
---

# Tutorial: Sample steps to interact with Wellbore DDMS

Wellbore DDMS provides the capability to operate on well data in the Project Oak Forest instance.

In this tutorial, you will learn how to:


> * Utilize Wellbore DDMS Api's to store and retrieve well data

## Prerequisites

### Project Oak Forest instance details

* Once the [Project Oak Forest instance](/how-to/how-to-create-project-oak-forest-instance.md) is created, note down the following details:

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

* Download and install [Postman](https://www.postman.com/) desktop app
* Import the following files into Postman:
  > [!NOTE]
  > For the below Postman files, click the **Raw** file on GitHub and save to your local machine.
  >
  > To import the Postman collection and environment variables, follow the steps outlined in [Importing data into Postman](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-data-into-postman)
  * [Wellbore DDMS Postman collection](https://raw.githubusercontent.com/MicrosoftDocs/Project-Oak-Forest/main/postman/WellboreDDMS.postman_collection.json?token=GHSAT0AAAAAABYK75SGN22O6Y33VK4AWRQSYYX3GMA)
  * [Wellbore DDMS Postman Environment](https://raw.githubusercontent.com/MicrosoftDocs/Project-Oak-Forest/main/postman/WellboreDDMSEnvironment.postman_environment.json?token=GHSAT0AAAAAABYK75SGVI5F2KGSVBDXDRF4YYX3G2Q)
  
* Update the **CURRENT_VALUE** of the Postman Environment with the information obtained in [Project Oak Forest instance details](#project-oak-forest-instance-details)

### Executing Postman Requests

* The Postman collection for Wellbore DDMS contains requests which allows interaction with wells, wellbore, welllog and well trajectory data.
* Make sure to choose the **Wellbore DDMS Environment** before triggering the Postman collection.
  :::image type="content" source="media/tutorial-wellbore-ddms/tutorial-postman-choose-wellbore-environment.png" alt-text="Choose environment":::
* Each request can be triggered by clicking the **Send** Button.
* On every request Postman will validate the actual API response code against the expected response code; if there is any mismatch the Test Section will indicate failures.

**Successful Postman Call**

:::image type="content" source="media/tutorial-wellbore-ddms/tutorial-postman-test-success.png" alt-text="Success":::

**Failed Postman Call**

:::image type="content" source="media/tutorial-wellbore-ddms/tutorial-postman-test-failure.png" alt-text="Failure":::

### Steps to insert and get the Well data

1. **Get an SPN Token** - Generate the Service Principal Bearer token, which will be used to authenticate further API calls.
1. **Create a Legal Tag** - Create a legal tag that will be added to the automatically environment for data compliance purpose.
1. **Create Well** - Creates the wellbore record in Project Oak.
   :::image type="content" source="media/tutorial-wellbore-ddms/tutorial-create-well.png" alt-text="Screenshot-of-tutorial-create-well":::
1. **Get Wells** - Returns the well data created in the last step.
  :::image type="content" source="media/tutorial-wellbore-ddms/tutorial-get-wells.png" alt-text="Screenshot-of-tutorial-get-wells":::
1. **Get Well Versions** - Returns the versions of each ingested well record.
  :::image type="content" source="media/tutorial-wellbore-ddms/tutorial-get-well-versions.png" alt-text="Screenshot-of-tutorial-get-well-versions":::
1. **Get specific Well Version** - Returns the details of specified version of specified record.
  :::image type="content" source="media/tutorial-wellbore-ddms/tutorial-get-specific-well-version.png" alt-text="Screenshot-of-tutorial-get-specific-well-version":::
1. **Delete well record** - Deletes the specified record.
  :::image type="content" source="media/tutorial-wellbore-ddms/tutorial-delete-well.png" alt-text="Screenshot-of-tutorial-delete-well":::

***Successful completion of above steps indicates success ingestion and retrieval of well records***

## Next steps

- ***Similar steps could be followed for wellbore, welllog and well trajectory data***
- [Seismic DMS SDUTIL Tutorial](/articles/energy-data-services/tutorial-seismic-ddms-sdutil.md)