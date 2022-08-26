---
title: Tutorial - Sample steps to interact with Wellbore DDMS  #Required; page title is displayed in search results. Include the brand.
description: This tutorial shows you how to interact with Wellbore DDMS in Project Oak #Required; article description that is displayed in search results. 
author: rishabh92 #Required; your GitHub user alias, with correct capitalization.
ms.author: rising #Required; microsoft alias of author; optional team alias.
ms.service: energy #Required; service per approved list. slug assigned by ACOM.
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
  | Parameter          | Value to use             | Example                               |
  | ------------------ | ------------------------ |-------------------------------------- |
  | CLIENT_ID          | Application (client) ID  | 3dbbbcc2-f28f-44b6-a5ab-a6a5cb7c7862  |
  | CLIENT_SECRET      | Client secrets           |  _fl******************                |
  | TENANT_ID          | Directory (tenant) ID    | 72f988bf-86f1-41af-91ab-2d7cd011db47  |
  | SCOPE              | Application (client) ID  | 3dbbbcc2-f28f-44b6-a5ab-a6a5cb7c7862  |
  | base_uri           | URI                      | bseloak.energy.azure.com              |
  | data-partition-id  | Data Partition(s)        | bseloak-bseldp1                       |

### Postman setup

* Download and install [Postman](https://www.postman.com/) desktop app
* Import the following files into Postman:
  > [!NOTE]
  > For the below Postman files, click the **Raw** file on GitHub and save to your local machine.
  >
  > To import the Postman collection and environment variables, follow the steps outlined in [Importing data into Postman](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-data-into-postman)
  * [Wellbore DDMS Postman collection](/postman/WellboreDDMS.postman_collection.json)
  * [Wellbore DDMS Postman Environment](/postman/WellboreDDMSEnvironment.postman_environment.json)
  
* Update the **CURRENT_VALUE** of the Postman Environment with the information obtained in [Project Oak Forest instance details](#project-oak-forest-instance-details)

### Executing Postman Requests

* The Postman collection for Wellbore DDMS contains requests which allows interaction with wells, wellbore, welllog and well tragectory data.
* Make sure to choose the **Wellbore DDMS Environment** before triggering the Postman collection.
  ![Choose environment](/media/tutorial-postman-choose-wellbore-environment.png)
* Each request can be triggered by clicking the **Send** Button.
* On every request Postman will validate the actual API response code against the expected response code; if there is any mismatch the Test Section will indicate failures.

#### Successful Postman Call

![Success](/media/tutorial-postman-test-success.png)

#### Failed Postman Call

![Failure](/media/tutorial-postman-test-failure.png)

### Steps to insert and get the Well data

1. **Get an SPN Token** - Generate the Service Principal Bearer token, which will be used to authenticate further API calls.
1. **Create a Legal Tag** - Create a legal tag that will be added to the automatically environment for data compliance purpose.
1. **Create Well** - Creates the wellbore record in Project Oak.
  ![Screenshot](/media/tutorial-create-well.png)
1. **Get Wells** - Returns the well data created in the last step.
  ![Screenshot](/media/tutorial-get-wells.png)
1. **Get Well Versions** - Returns the versions of each ingested well record.
  ![Screenshot](/media/tutorial-get-well-versions.png)
1. **Get specific Well Version** - Returns the details of specified version of specified record.
  ![Screenshot](/media/tutorial-get-specific-well-version.png)
1. **Delete well record** - Deletes the specified record.
  ![Screenshot](/media/tutorial-delete-well.png)

***Successful completion of above steps indicates success ingestion and retrieval of well records***