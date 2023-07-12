---
title: Tutorial - Work with Petrel data records by using Petrel DDMS APIs in Azure Data Manager for Energy
description: Learn how to work with Petrel data records in your Azure Data Manager for Energy instance by using Petrel Domain Data Management Services (Petrel DDMS) APIs in Postman.
author: nikarsky
ms.author: nikarsky
ms.service: energy-data-services
ms.topic: tutorial
ms.date: 2/07/2023
ms.custom: template-tutorial
---

# Tutorial: Work with Petrel data records by using Petrel DDMS APIs

Use Petrel Domain Data Management Services (Petrel DDMS) APIs in Postman to work with Petrel data in your instance of Azure Data Manager for Energy.

In this tutorial, you'll learn how to:
> [!div class="checklist"]
>
> - Set up Postman to use a Petrel DDMS collection.
> - Set up Postman to use a Petrel DDMS environment.
> - Send requests via Postman.
> - Generate an authorization token.
> - Use Petrel DDMS APIs to work with Petrel data records/projects.

For more information about DDMS, see [DDMS concepts](concepts-ddms.md).

## Prerequisites

- An Azure subscription
- An instance of [Azure Data Manager for Energy](quickstart-create-microsoft-energy-data-services-instance.md) created in your Azure subscription.

## Get your Azure Data Manager for Energy instance details

The first step is to get the following information from your [Azure Data Manager for Energy instance](quickstart-create-microsoft-energy-data-services-instance.md) in the [Azure portal](https://portal.azure.com/?microsoft_azure_marketplace_ItemHideKey=Microsoft_Azure_OpenEnergyPlatformHidden):

| Parameter          | Value             | Example                               |
| ------------------ | ------------------------ |-------------------------------------- |
| CLIENT_ID          | Application (client) ID  | 3dfxxxxxxxxxxxxxxxxxxxxxx  |
| CLIENT_SECRET      | Client secrets           |  _fl******************                |
| TENANT_ID          | Directory (tenant) ID    | 72fxxxxxxxxxxxx  |
| SCOPE              | Application (client) ID  | 3dfxxxxxxxxxxxxxxxxxxxxxxx  |
| HOSTNAME           | URI                      | `<instance>.energy.azure.com`           |
| DATA_PARTITION_ID  | Data Partition(s)        | `<instance>-<data-partition-name>`                    |

You'll use this information later in the tutorial.

## Set up Postman

Next, set up Postman:

1. Download and install the [Postman](https://www.postman.com/downloads/) desktop app.

1. Import the following files in Postman:

   - [Petrel DDMS Postman collection](https://raw.githubusercontent.com/microsoft/meds-samples/main/postman/PetrelDSv2.postman_collection.json)


1. Create a Postman environment using the values you obtained above. The environment should look something like this: 
    
    :::image type="content" source="media/tutorial-petrel-ddms/pdsv2-env-postman.png" alt-text="Screenshot that shows pdsv2 env."  lightbox="media/tutorial-petrel-ddms/pdsv2-env-postman.png":::


## Generate a token to use in APIs

The Postman collection for Petrel DDMS contains requests you can use to interact with your Petrel Projects. It also contains a request to query current Petrel projects and records in your Azure Data Manager for Energy instance.

1. In Postman, in the left menu, select **Collections**, and then select **Petrel DDMS**. Under **Setup**, select **Get Token**.

1. In the environment dropdown in the upper-right corner, select **Petrel DDMS Environment** you created.

1. To send the request, select **Send**.

This request will generate an access token and assign it as the authorization method for future requests.

You can also generate a token by using the cURL command in Postman or a terminal to generate a bearer token. Use the values from your Azure Data Manager for Energy instance.

```bash
      curl --location --request POST 'https://login.microsoftonline.com/{{TENANT_ID}}/oauth2/v2.0/token' \
          --header 'Content-Type: application/x-www-form-urlencoded' \
          --data-urlencode 'grant_type=client_credentials' \
          --data-urlencode 'client_id={{CLIENT_ID}}' \
          --data-urlencode 'client_secret={{CLIENT_SECRET}}' \
          --data-urlencode 'scope={{SCOPE}}'  
```

In order to use this cURL generated token, you must update `access_token` in your **Collection** variables with the value after `Bearer` in the response.

## Use Petrel DDMS APIs to work with Petrel Projects

Successfully completing the Postman requests described in the following Petrel DDMS API allows you to interact with your save Petrel projects. While the API does provide a means of uploading data, we recommended that you upload your projects via the DELFI Petrel Explorer. All of the following API calls assume you have a project uploaded to Petrel Explorer.

### Create a legal tag

Create a legal tag that's automatically added to your Petrel DDMS environment for data compliance.

API: **Setup** > **Create Legal Tag for PDS**

Method: POST

:::image type="content" source="media/tutorial-petrel-ddms/create-legal-tag-pdsv2.png" alt-text="Screenshot that shows the API that creates a legal tag." lightbox="media/tutorial-petrel-ddms/create-legal-tag-pdsv2.png":::

For more information, see [Manage legal tags](how-to-manage-legal-tags.md).

### Add User to Entitlement Groups

In order to ensure the user has the proper permissions to make the Petrel DDMS API calls, the user must be apart of the `users.datalake.admins@{data-partition-id}.dataservices.energy` entitlements group. This call adds the user to the proper groups. 

The **USER** in this case is the Client ID/OID contained in the token used for authentication. For example, if you generate a token using a client ID of `8cdxxxxxxxxxxxx`, you must add `8cdxxxxxxxxxxxx` to the **users.datalake.admins** group.

API: **Setup** > **Add User to DATALAKE Admins**

Method: POST

:::image type="content" source="media/tutorial-petrel-ddms/add-user-to-entitlements-pdsv2.png" alt-text="Screenshot that shows the API that adds user to entitlements." lightbox="media/tutorial-petrel-ddms/add-user-to-entitlements-pdsv2.png":::

### Get Project

Given a Project ID, returns the corresponding Petrel Project record in your Azure Data Manager for Energy instance.

API: **Project** > **Get Project**.

Method: GET

:::image type="content" source="media/tutorial-petrel-ddms/get-projects-pdsv2.png" alt-text="Screenshot that shows the API that gets a project." lightbox="media/tutorial-petrel-ddms/get-projects-pdsv2.png":::

### Delete Project

Given a Project ID, deletes the project and the associated Petrel Project record data in your Azure Data Manager for Energy instance.

API: **Project** > **Delete Project**

Method: DELETE

:::image type="content" source="media/tutorial-petrel-ddms/delete-project-pdsv2.png" alt-text="Screenshot that shows the API that deletes a project." lightbox="media/tutorial-petrel-ddms/delete-project-pdsv2.png":::

### Get Project Version

Given a `Project ID` and a `Version ID`, gets the Petrel Version record associated with that project/version ID in your Azure Data Manager for Energy instance.

API: **Project** > **Project Version**

Method: GET

:::image type="content" source="media/tutorial-petrel-ddms/get-project-version-pdsv2.png" alt-text="Screenshot that shows the API that gets project version." lightbox="media/tutorial-petrel-ddms/get-project-version-pdsv2.png":::

### Get a Project Download URL

Given a Project ID, returns a SAS URL to download the data of the corresponding project from your Azure Data Manager for Energy instance.

API: **Project** > **Download URL**

Method: GET

:::image type="content" source="media/tutorial-petrel-ddms/get-download-url-pdsv2.png" alt-text="Screenshot that shows the API that gets download SAS URL." lightbox="media/tutorial-petrel-ddms/get-download-url-pdsv2.png":::

### Get a Project Upload URL

Given a Project ID, returns two SAS URLs. One to upload data to and one to download data from the corresponding project in your Azure Data Manager for Energy instance.

API: **Project** > **Upload URL**

Method: POST

:::image type="content" source="media/tutorial-petrel-ddms/get-upload-url-pdsv2.png" alt-text="Screenshot that shows the API that gets upload SAS URL." lightbox="media/tutorial-petrel-ddms/get-upload-url-pdsv2.png":::

#### 	Using the Upload URL 
Once you have your SAS upload url, it should look something like this: 

`https://{storage-account}.z15.blob.storage.azure.net/projects/{data-partition-id}/{projectID}.staging/{versionID}?{SAS-token-info}`

Next you can modify this URL to contain the filename of data you want to upload:

`https://{storage-account}.z15.blob.storage.azure.net/projects/{data-partition-id}/{projectID}.staging/{versionID}/{FILENAME}?{SAS-token-info}`

Making a PUT call to this URL uploads the contents of the `body` to the blob storage under the **FILENAME** provided.

### Update Project

Given a Project ID, SAS upload URL, and a Petrel Project record, updates the Petrel Project record in your Azure Data Manager for Energy with the new values provided. Can also upload data to a given project but doesn't have to.

API: **Project** > **Update Project**

Method: PUT

:::image type="content" source="media/tutorial-petrel-ddms/update-project-pdsv2.png" alt-text="Screenshot that shows the API that updates project." lightbox="media/tutorial-petrel-ddms/update-project-pdsv2.png":::

### Search Projects

Allows the user to search through Petrel Projects given many fields. The call returns all match Project IDs. The API supports full text search on string fields, range queries on date, numeric or string fields, along with geo-spatial search. 

API: **Project** > **Search Projects**

Method: POST

:::image type="content" source="media/tutorial-petrel-ddms/search-projects-pdsv2.png" alt-text="Screenshot that shows the API that deletes a well record." lightbox="media/tutorial-petrel-ddms/search-projects-pdsv2.png":::

## Next Steps
> [!div class="nextstepaction"]
> Visit the following DELFI links for further tutorials involving Petrel Explorer and Petrel Workflows:\
> [Get started with Project Explorer (slb.com)](https://guru.delfi.slb.com/content/1015/help/1/en-US/299EC605-5CC6-4CD9-9B07-482B16426769)\
> [Open a project saved in Project Explorer (slb.com)](https://guru.delfi.slb.com/content/1015/help/1/en-US/20AACC1C-E501-4436-9FC9-03427C21B12E)\
> [Upload ZGY data from Petrel to the DELFI Data Ecosystem (slb.com)](https://guru.delfi.slb.com/content/1015/help/1/en-US/9F76FDB2-7817-491A-995F-A18D558A191C)\
> [Import ZGY data from the DELFI Data Ecosystem to Petrel (slb.com)](https://guru.delfi.slb.com/content/1015/help/1/en-US/B0B8DA1A-74B6-4109-B80D-25FF4A75C57D)\
> [Save a Petrel project in Project Explorer (slb.com)](https://guru.delfi.slb.com/content/1015/help/1/en-US/C86C74BE-6FF9-4962-AEBF-887897B95D4B)
