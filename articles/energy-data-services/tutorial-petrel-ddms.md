---
title: "Tutorial: Work with Petrel data records by using Petrel DDMS APIs"
titleSuffix: Microsoft Azure Data Manager for Energy
description: Learn how to work with Petrel data records in your Azure Data Manager for Energy instance by using Petrel Domain Data Management Services (DDMS) APIs in Postman.
author: nikarsky
ms.author: nikarsky
ms.service: energy-data-services
ms.topic: tutorial
ms.date: 2/07/2023
ms.custom: template-tutorial

#Customer intent: As a developer, I want to learn how to use the Petrel DDMS APIs so that I can store and retrieve similar kinds of data records.
---

# Tutorial: Work with Petrel data records by using Petrel DDMS APIs

Use Petrel Domain Data Management Services (DDMS) APIs in Postman to work with Petrel data in your instance of Azure Data Manager for Energy.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Set up Postman to use a Petrel DDMS collection.
> - Set up Postman to use a Petrel DDMS environment.
> - Send requests via Postman.
> - Generate an authorization token.
> - Use Petrel DDMS APIs to work with Petrel data records and projects.

For more information about DDMS, see [DDMS concepts](concepts-ddms.md).

## Prerequisites

- An Azure subscription
- An instance of [Azure Data Manager for Energy](quickstart-create-microsoft-energy-data-services-instance.md) created in your Azure subscription

## Get your Azure Data Manager for Energy instance details

The first step is to get the following information from your [Azure Data Manager for Energy instance](quickstart-create-microsoft-energy-data-services-instance.md) in the [Azure portal](https://portal.azure.com/?microsoft_azure_marketplace_ItemHideKey=Microsoft_Azure_OpenEnergyPlatformHidden):

| Parameter          | Value             | Example                               |
| ------------------ | ------------------------ |-------------------------------------- |
| `CLIENT_ID`          | Application (client) ID  | `3dfxxxxxxxxxxxxxxxxxxxxxx`  |
| `CLIENT_SECRET`      | Client secrets           |  `_fl******************`                |
| `TENANT_ID`          | Directory (tenant) ID    | `72fxxxxxxxxxxxx`  |
| `SCOPE`              | Application (client) ID  | `3dfxxxxxxxxxxxxxxxxxxxxxxx`  |
| `HOSTNAME`           | URI                      | `<instance>.energy.azure.com`           |
| `DATA_PARTITION_ID`  | Data partitions        | `<instance>-<data-partition-name>`                    |

You'll use this information later in the tutorial.

## Set up Postman

1. Download and install the [Postman](https://www.postman.com/downloads/) desktop app.

1. Import the following file in Postman: [Petrel DDMS Postman collection](https://raw.githubusercontent.com/microsoft/meds-samples/main/postman/PetrelDSv2.postman_collection.json).

1. Create a Postman environment by using the values that you obtained earlier. The environment should look something like this example:

    :::image type="content" source="media/tutorial-petrel-ddms/pdsv2-env-postman.png" alt-text="Screenshot that shows an example Postman environment."  lightbox="media/tutorial-petrel-ddms/pdsv2-env-postman.png":::

## Generate a token to use in APIs

The Postman collection for Petrel DDMS contains requests that you can use to interact with your Petrel projects. It also contains a request to query current Petrel projects and records in your Azure Data Manager for Energy instance.

1. In Postman, on the left menu, select **Collections**, and then select **Petrel DDMS**. Under **Setup**, select **Get Token**.

1. In the environment dropdown list in the upper-right corner, select **Petrel DDMS Environment**.

1. To send the request, select **Send**.

This request generates an access token and assigns it as the authorization method for future requests.

You can also generate a token by using the cURL command in Postman or a terminal to generate a bearer token. Use the values from your Azure Data Manager for Energy instance.

```bash
      curl --location --request POST 'https://login.microsoftonline.com/{{TENANT_ID}}/oauth2/v2.0/token' \
          --header 'Content-Type: application/x-www-form-urlencoded' \
          --data-urlencode 'grant_type=client_credentials' \
          --data-urlencode 'client_id={{CLIENT_ID}}' \
          --data-urlencode 'client_secret={{CLIENT_SECRET}}' \
          --data-urlencode 'scope={{SCOPE}}'  
```

To use this cURL-generated token, you must update `access_token` in your `Collection` variables with the value after `Bearer` in the response.

## Use Petrel DDMS APIs to work with Petrel projects

Successfully completing the Postman requests that are described in the following Petrel DDMS APIs indicates successful interaction with your saved Petrel projects. Although the API provides a way to upload data, we recommend that you upload your projects via DELFI Petrel Project Explorer. All of the following API calls assume that you have a project uploaded to Petrel Project Explorer.

### Create a legal tag

Create a legal tag that's automatically added to your Petrel DDMS environment for data compliance.

API: **Setup** > **Create Legal Tag for PDS**

Method: `POST`

:::image type="content" source="media/tutorial-petrel-ddms/create-legal-tag-pdsv2.png" alt-text="Screenshot that shows the API that creates a legal tag." lightbox="media/tutorial-petrel-ddms/create-legal-tag-pdsv2.png":::

For more information, see [Manage legal tags](how-to-manage-legal-tags.md).

### Add users to an entitlement group

For users to have the proper permissions to make Petrel DDMS API calls, they must be part of the `users.datalake.admins@{data-partition-id}.dataservices.energy` entitlement group. This call adds a user to the proper group.

The user in this case is the client ID or OID in the token that's used for authentication. For example, if you generate a token by using a client ID of `8cdxxxxxxxxxxxx`, you must add `8cdxxxxxxxxxxxx` to the `users.datalake.admins` group.

API: **Setup** > **Add User to DATALAKE Admins**

Method: `POST`

:::image type="content" source="media/tutorial-petrel-ddms/add-user-to-entitlements-pdsv2.png" alt-text="Screenshot that shows the API that adds user to entitlements." lightbox="media/tutorial-petrel-ddms/add-user-to-entitlements-pdsv2.png":::

### Get a project

Use a project ID to return the corresponding Petrel project record in your Azure Data Manager for Energy instance.

API: *Project* > **Get Project**

Method: `GET`

:::image type="content" source="media/tutorial-petrel-ddms/get-projects-pdsv2.png" alt-text="Screenshot that shows the API that gets a project." lightbox="media/tutorial-petrel-ddms/get-projects-pdsv2.png":::

### Delete a project

Use a project ID to delete a project and the associated Petrel project record data in your Azure Data Manager for Energy instance.

API: *Project* > **Delete Project**

Method: `DELETE`

:::image type="content" source="media/tutorial-petrel-ddms/delete-project-pdsv2.png" alt-text="Screenshot that shows the API that deletes a project." lightbox="media/tutorial-petrel-ddms/delete-project-pdsv2.png":::

### Get a project version

Use a project ID and a version ID to get the Petrel version record that's associated with the project and version in your Azure Data Manager for Energy instance.

API: *Project* > **Get Project Version**

Method: `GET`

:::image type="content" source="media/tutorial-petrel-ddms/get-project-version-pdsv2.png" alt-text="Screenshot that shows the API that gets a project version." lightbox="media/tutorial-petrel-ddms/get-project-version-pdsv2.png":::

### Get a project download URL

Use a project ID to get a shared access signature (SAS) URL so you can download the data of the corresponding project from your Azure Data Manager for Energy instance.

API: *Project* > **Get Project Download**

Method: `GET`

:::image type="content" source="media/tutorial-petrel-ddms/get-download-url-pdsv2.png" alt-text="Screenshot that shows the API that gets a project download URL." lightbox="media/tutorial-petrel-ddms/get-download-url-pdsv2.png":::

### Get a project upload URL

Use a project ID to get two SAS URLs. One URL uploads data to the corresponding project in your Azure Data Manager for Energy instance. The other URL downloads data from the corresponding project in your Azure Data Manager for Energy instance.

API: *Project* > **Get Signed Upload URL**

Method: `POST`

:::image type="content" source="media/tutorial-petrel-ddms/get-upload-url-pdsv2.png" alt-text="Screenshot that shows the API that gets a project upload URL." lightbox="media/tutorial-petrel-ddms/get-upload-url-pdsv2.png":::

Your SAS upload URL should look something like this example:

`https://{storage-account}.z15.blob.storage.azure.net/projects/{data-partition-id}/{projectID}.staging/{versionID}?{SAS-token-info}`

You can modify this URL to contain the file name of data that you want to upload:

`https://{storage-account}.z15.blob.storage.azure.net/projects/{data-partition-id}/{projectID}.staging/{versionID}/{FILENAME}?{SAS-token-info}`

Making a `PUT` call to this URL uploads the contents of `body` to the blob storage under the provided `FILENAME` value.

### Update a project

Use a project ID and a SAS upload URL to update a Petrel project record in Azure Data Manager for Energy with the new values. You can also upload data to a project if you want.

API: *Project* > **Update Project**

Method: `PUT`

:::image type="content" source="media/tutorial-petrel-ddms/update-project-pdsv2.png" alt-text="Screenshot that shows the API that updates a project." lightbox="media/tutorial-petrel-ddms/update-project-pdsv2.png":::

### Search through projects

You can search through Petrel projects by using many fields. The call returns all matching project IDs. The API supports:

- Full-text search on string fields.
- Range queries based on date, numeric, or string fields.
- Geospatial search.

API: *Project* > **Search Projects**

Method: `POST`

:::image type="content" source="media/tutorial-petrel-ddms/search-projects-pdsv2.png" alt-text="Screenshot that shows the API that deletes a well record." lightbox="media/tutorial-petrel-ddms/search-projects-pdsv2.png":::

## Related content

Use the following DELFI links to read other tutorials that involve Petrel Project Explorer and Petrel workflows:

- [Get started with Project Explorer (slb.com)](https://guru.delfi.slb.com/content/1015/help/1/en-US/299EC605-5CC6-4CD9-9B07-482B16426769)\
- [Open a project saved in Project Explorer (slb.com)](https://guru.delfi.slb.com/content/1015/help/1/en-US/20AACC1C-E501-4436-9FC9-03427C21B12E)\
- [Upload ZGY data from Petrel to the DELFI Data Ecosystem (slb.com)](https://guru.delfi.slb.com/content/1015/help/1/en-US/9F76FDB2-7817-491A-995F-A18D558A191C)\
- [Import ZGY data from the DELFI Data Ecosystem to Petrel (slb.com)](https://guru.delfi.slb.com/content/1015/help/1/en-US/B0B8DA1A-74B6-4109-B80D-25FF4A75C57D)\
- [Save a Petrel project in Project Explorer (slb.com)](https://guru.delfi.slb.com/content/1015/help/1/en-US/C86C74BE-6FF9-4962-AEBF-887897B95D4B)
