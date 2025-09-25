---
title: "Tutorial: Work with Petrel data records by using Petrel DDMS APIs"
titleSuffix: Microsoft Azure Data Manager for Energy
description: Learn how to work with Petrel data records in your Azure Data Manager for Energy instance by using Petrel Domain Data Management Services (DDMS) APIs.
author: Preetisingh
ms.author: preetisingh
ms.service: azure-data-manager-energy
ms.topic: tutorial
ms.date: 7/22/2025
ms.custom:
  - template-tutorial
  - sfi-image-blocked

#Customer intent: As a developer, I want to learn how to use the Petrel DDMS APIs so that I can store and retrieve similar kinds of data records.
---

# Tutorial: Work with Petrel data records by using Petrel DDMS APIs

Use Petrel Domain Data Management Services (DDMS) APIs to work with Petrel data in your instance of Azure Data Manager for Energy.

In this tutorial, you learn to :

> [!div class="checklist"]
> - Generate an authorization token.
> - Use Petrel DDMS APIs to work with Petrel data records and projects.

For more information about DDMS, see [DDMS concepts](concepts-ddms.md).

## Prerequisites

* An Azure subscription
* An instance of [Azure Data Manager for Energy](quickstart-create-microsoft-energy-data-services-instance.md) created in your Azure subscription
* cURL command-line tool installed on your machine
* Service principal access token to call the Petrel APIs. See [How to generate auth token](how-to-generate-auth-token.md).

### Get details for the Azure Data Manager for Energy instance

For this tutorial, you need the following parameters:

| Parameter | Value to use | Example | Where to find this value |
|----|----|----|----|
| `DNS` | URI | `<instance>.energy.azure.com` | Find this value on the overview page of the Azure Data Manager for Energy instance. |
| `data-partition-id` | Data partition | `<data-partition-id>` | Find this value on the Data Partition section within the Azure Data Manager for Energy instance. |
| `access_token`       | Access token value       | `0.ATcA01-XWHdJ0ES-qDevC6r...........`| Follow [How to generate auth token](how-to-generate-auth-token.md) to create an access token and save it.|

Follow the [Manage users](how-to-manage-users.md) guide to add appropriate entitlements for the user who's running this tutorial.

### Set up your environment

Ensure you have `cURL` installed on your system to make API calls.

## Use Petrel DDMS APIs to work with Petrel projects

Successfully completing the API calls  that are present in [swagger](https://microsoft.github.io/adme-samples/rest-apis/index.html?page=/adme-samples/rest-apis/M23/petrel_ddms_openapi.yaml) indicates successful interaction with your saved Petrel projects. Although the API provides a way to upload data, we recommend uploading your projects via DELFI Petrel Project Explorer. All of the following API calls assume that you have a project uploaded to Petrel Project Explorer.

### Create a legal tag

Create a legal tag that you can use for data compliance.

Run the following `cURL` command to create a legal tag:

```bash
curl -X POST "https://<DNS>/api/legal/v1/legaltags" \
     -H "Authorization: Bearer <access_token>" \
     -H "Content-Type: application/json" \
     -H "data-partition-id: <data-partition-id>" \
     -d '{
           "name": "LegalTagName",
           "description": "Legal Tag added for Well",
           "properties": {
               "contractId": "123456",
               "countryOfOrigin": ["US", "CA"],
               "dataType": "Third Party Data",
               "exportClassification": "EAR99",
               "originator": "xyz",
               "personalData": "No Personal Data",
               "securityClassification": "Private",
               "expirationDate": "2025-12-25"
           }
       }'
```

**Sample Response:**
```json
{
  "name": "LegalTagName",
  "status": "Created"
}
```

For more information, see [Manage legal tags](how-to-manage-legal-tags.md).

### Add users to an entitlement group

For users to have the proper permissions to make Petrel DDMS API calls, they must be part of the `users.datalake.admins@{data-partition-id}.dataservices.energy` entitlement group. This call adds a user to the proper group.

The user in this case is the client ID or OID in the token that's used for authentication. For example, if you generate a token by using a client ID of `8cdxxxxxxxxxxxx`, you must add `8cdxxxxxxxxxxxx` to the `users.datalake.admins` group.
Follow the [Manage users](how-to-manage-users.md) guide to add appropriate entitlements for the user .

### Get a project

Use a project ID to return the corresponding Petrel project record in your Azure Data Manager for Energy instance.

[API](https://microsoft.github.io/adme-samples/rest-apis/index.html?page=/adme-samples/rest-apis/M23/petrel_ddms_openapi.yaml#/Projects/get_api_petreldms_v1_projects__projectId_)


### Delete a project

Use a project ID to delete a project and the associated Petrel project record data in your Azure Data Manager for Energy instance.

[API](https://microsoft.github.io/adme-samples/rest-apis/index.html?page=/adme-samples/rest-apis/M23/petrel_ddms_openapi.yaml#/Projects/post_api_petreldms_v1_projects__projectId_)

### Get a project version

Use a project ID and a version ID to get the Petrel version record that's associated with the project and version in your Azure Data Manager for Energy instance.

[API](https://microsoft.github.io/adme-samples/rest-apis/index.html?page=/adme-samples/rest-apis/M23/petrel_ddms_openapi.yaml#/Projects/get_api_petreldms_v1_projects__projectId__versions__versionId_)

### Get a project download URL

Use a project ID to get a shared access signature (SAS) URL so you can download the data of the corresponding project from your Azure Data Manager for Energy instance.

[API](https://microsoft.github.io/adme-samples/rest-apis/index.html?page=/adme-samples/rest-apis/M23/petrel_ddms_openapi.yaml#/Projects/get_api_petreldms_v1_projects__projectId__download)

### Get a project upload URL

Use a project ID to get two SAS URLs. One URL uploads data to the corresponding project in your Azure Data Manager for Energy instance. The other URL downloads data from the corresponding project in your Azure Data Manager for Energy instance.

[API](https://microsoft.github.io/adme-samples/rest-apis/index.html?page=/adme-samples/rest-apis/M23/petrel_ddms_openapi.yaml#/Projects/post_api_petreldms_v1_projects__projectId__upload)

Your SAS upload URL should look something like this example:

`https://{storage-account}.z15.blob.storage.azure.net/projects/{data-partition-id}/{projectID}.staging/{versionID}?{SAS-token-info}`

You can modify this URL to contain the file name of data that you want to upload:

`https://{storage-account}.z15.blob.storage.azure.net/projects/{data-partition-id}/{projectID}.staging/{versionID}/{FILENAME}?{SAS-token-info}`

Making a `PUT` call to this URL uploads the contents of `body` to the blob storage under the provided `FILENAME` value.

### Update a project

Use a project ID and a SAS upload URL to update a Petrel project record in Azure Data Manager for Energy with the new values. You can also upload data to a project if you want.

[API](https://microsoft.github.io/adme-samples/rest-apis/index.html?page=/adme-samples/rest-apis/M23/petrel_ddms_openapi.yaml#/Projects/put_api_petreldms_v1_projects__projectId__update)

### Search through projects

You can search through Petrel projects by using many fields. The call returns all matching project IDs. The Search API supports:

- Full-text search on string fields.
- Range queries based on date, numeric, or string fields.
- Geospatial search.

[API](https://microsoft.github.io/adme-samples/rest-apis/index.html?page=/adme-samples/rest-apis/M23/search_openapi.yaml#/search-api/queryRecords)

## Related content

Use the following DELFI links to read other tutorials that involve Petrel Project Explorer and Petrel workflows:

- [Get started with Project Explorer (slb.com)](https://guru.delfi.slb.com/content/1015/help/1/en-US/299EC605-5CC6-4CD9-9B07-482B16426769)\
- [Open a project saved in Project Explorer (slb.com)](https://guru.delfi.slb.com/content/1015/help/1/en-US/20AACC1C-E501-4436-9FC9-03427C21B12E)\
- [Upload ZGY data from Petrel to the DELFI Data Ecosystem (slb.com)](https://guru.delfi.slb.com/content/1015/help/1/en-US/9F76FDB2-7817-491A-995F-A18D558A191C)\
- [Import ZGY data from the DELFI Data Ecosystem to Petrel (slb.com)](https://guru.delfi.slb.com/content/1015/help/1/en-US/B0B8DA1A-74B6-4109-B80D-25FF4A75C57D)\
- [Save a Petrel project in Project Explorer (slb.com)](https://guru.delfi.slb.com/content/1015/help/1/en-US/C86C74BE-6FF9-4962-AEBF-887897B95D4B)
