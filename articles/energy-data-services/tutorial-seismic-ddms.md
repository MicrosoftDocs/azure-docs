---
title: "Tutorial: Work with seismic data by using Seismic DDMS APIs"
titleSuffix: Microsoft Azure Data Manager for Energy
description: This tutorial shows sample steps for interacting with the Seismic DDMS APIs in Azure Data Manager for Energy.
author: akshatjoshi
ms.author: akshatjoshi
ms.service: azure-data-manager-energy
ms.topic: tutorial
ms.date: 3/10/2025
ms.custom: template-tutorial

#Customer intent: As a developer, I want to learn how to use the Seismic DDMS APIs so that I can store and retrieve similar kinds of data.
---

# Tutorial: Work with seismic data by using Seismic DDMS APIs

This tutorial demonstrates how to utilize Seismic Domain Data Management Services (DDMS) APIs with cURL to manage seismic data within an Azure Data Manager for Energy instance.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Register a data partition for seismic data.
> * Utilize Seismic DDMS APIs to store and retrieve seismic data.

For more information about DDMS, see [DDMS concepts](concepts-ddms.md).

## Prerequisites
* An Azure subscription
* An instance of [Azure Data Manager for Energy](quickstart-create-microsoft-energy-data-services-instance.md) created in your Azure subscription
* cURL command-line tool installed on your machine
* Generate the service principal access token to call the Seismic APIs. See [How to generate auth token](how-to-generate-auth-token.md).

## Get your Azure Data Manager for Energy instance details

To proceed, gather the following details from your [Azure Data Manager for Energy instance](quickstart-create-microsoft-energy-data-services-instance.md) via the [Azure portal](https://portal.azure.com/?microsoft_azure_marketplace_ItemHideKey=Microsoft_Azure_OpenEnergyPlatformHidden):

| Parameter          | Description                | Example                               | Where to find this value              |
| ------------------ | -------------------------- |-------------------------------------- |-------------------------------------- |
| `client_id`        | Application (client) ID    | `00001111-aaaa-2222-bbbb-3333cccc4444`| You use this app or client ID when registering the application with the Microsoft identity platform. See [Register an application](../active-directory/develop/quickstart-register-app.md#register-an-application)|
| `client_secret`    | Client secret              | `_fl******************`               |Sometimes called an *application password*, a client secret is a string value that your app can use in place of a certificate to identity itself. See [Add a client secret](../active-directory/develop/quickstart-register-app.md#add-a-client-secret).|
| `tenant_id`        | Directory (tenant) ID      | `72f988bf-86f1-41af-91ab-xxxxxxxxxxxx`| Hover over your account name in the Azure portal to get the directory or tenant ID. Alternatively, search for and select **Microsoft Entra ID** > **Properties** > **Tenant ID** in the Azure portal. |
| `base_url`         | Instance URL               | `https://<instance>.energy.azure.com` | Find this value on the overview page of the Azure Data Manager for Energy instance.|
| `data_partition_id`| Data partition name        | `opendes`                             | Find this value on the overview page of the Azure Data Manager for Energy instance.|
| `access_token`       | Access token value       | `0.ATcA01-XWHdJ0ES-qDevC6r...........`| Follow [How to generate auth token](how-to-generate-auth-token.md) to create an access token and save it.|

## Use Seismic DDMS APIs to store and retrieve seismic data

### Create a legal tag

Create a legal tag that is automatically added to the Seismic DDMS environment for data compliance.

API: **Setup** > **Create Legal Tag for SDMS**

```bash
curl --request POST \
  --url https://{base_url}/api/legal/v1/legaltags \
  --header 'Authorization: Bearer {access_token}' \
  --header 'Content-Type: application/json' \
  --header 'Data-Partition-Id:  {data_partition_id}' \
  --data '{
    "name": "{tag_name}",
    "description": "Legal Tag added for Seismic",
    "properties": {
        "countryOfOrigin": [
            "US"
        ],
        "contractId": "No Contract Related",
        "expirationDate": "2099-01-01",
        "dataType": "Public Domain Data",
        "originator": "OSDU",
        "securityClassification": "Public",
        "exportClassification": "EAR99",
        "personalData": "No Personal Data"
    }
}'
```
**Sample Response:** 
```json
{
	"name": "opendes-Seismic-Legal-Tag-Test999588567444",
	"description": "Legal Tag added for Seismic",
	"properties": {
		"countryOfOrigin": [
			"US"
		],
		"contractId": "No Contract Related",
		"expirationDate": "2099-01-01",
		"originator": "OSDU",
		"dataType": "Public Domain Data",
		"securityClassification": "Public",
		"personalData": "No Personal Data",
		"exportClassification": "EAR99"
	}
}
```




For more information, see [Manage legal tags](how-to-manage-legal-tags.md).

### Verify the service

Run basic service connection and status tests in your Azure Data Manager for Energy instance.

API: **Service Verification** > **Check Status**

```bash
curl --request GET \
  --url http://{base_url}/seistore-svc/api/v3/svcstatus \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer {access_token}' \
  --header 'data-partition-id: {data_partition_id}'
```

 **Sample Response:** 
```bash
service OK
```

  

### Tenant

Create a tenant in your Azure Data Manager for Energy instance.

> [!NOTE]
> You must register a data partition as a tenant before using it with the Seismic DDMS.

API: **Tenant** > **Register a seismic-dms tenant**


```bash
curl --request POST \
  --url https://{base_url}/seistore-svc/api/v3/tenant/{data_partition_id} \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer {access_token}' \
  --header 'Content-Type: application/json' \
  --data '{
    "gcpid": "{data_partition_id}",
    "esd": "{data_partition_id}.dataservices.energy",
    "default_acl": "users.datalake.admins@opendes.dataservices.energy"
}'
```
 **Sample Response:** 
```json
{
	"name": "opendes",
	"esd": "opendes.dataservices.energy",
	"gcpid": "opendes",
	"default_acls": "users.datalake.admins@opendes.dataservices.energy,users.datalake.ops@opendes.dataservices.energy",
	"Symbol(id)": {
		"partitionKey": "tn-opendes",
		"name": "opendes"
	}
}
```

### Create a subproject

Create a subproject in your Azure Data Manager for Energy instance.

API: **Subproject** > **Create a new subproject**

```bash
curl --request POST \
  --url https://{base_url}/seistore-svc/api/v3/subproject/tenant/{data_partition_id}/subproject/{sesimic_subproject} \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer {access_token}' \
  --header 'Content-Type: application/json' \
  --header 'ltag: opendes-Seismic-Legal-Tag-Test999943387766' \
  --data '{
    "admin": "client_id",
    "access_policy": "dataset"
}'
```

**Sample Response:** 
```json
{
	"name": "test999384006",
	"tenant": "opendes",
	"ltag": "",
	"acls": {
		"admins": [
			"data.sdms.opendes.test999384006.3a114f91-d79f-489e-b9f0-3a4ac6643924.admin@opendes.dataservices.energy"
		],
		"viewers": [
			"data.sdms.opendes.test999384006.3bbce754-bdfa-4fad-9672-cc9a49231058.viewer@opendes.dataservices.energy"
		]
	},
	"access_policy": "dataset",
	"enforce_key": true,
	"gcs_bucket": "ss-cloud-lr8faf2xnup9yxd",
	"Symbol(id)": {
		"partitionKey": "sp-test999384006",
		"name": "test999384006"
	}
}
```
### Register a dataset

Register a dataset in your Azure Data Manager for Energy instance.

API: **Dataset** > **Register a new dataset**

```bash
curl --request POST \
  --url https://{base_url}/seistore-svc/api/v3/dataset/tenant/{data_partition_id}/subproject/{seismic_subproject}/dataset/{dataset_name} \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer {access_token}' \
  --header 'Content-Type: application/json' \
  --header 'ltag: {legal_tag}' \
  --data '{
  "admin": "client_id",
  "storage_class": "MULTI_REGIONAL",
  "storage_location": "US",
  "access_policy": "dataset",
  "acls": {
    "admins": [
      "data.default.owners@opendes.dataservices.energy"
    ],
    "viewers": [
      "data.default.viewers@opendes.dataservices.energy"
    ]
  }
}'
```


**Sample Response:** 
```json
{
	"name": "test.sgy",
	"tenant": "opendes",
	"subproject": "test999384006",
	"path": "/",
	"ltag": "opendes-Seismic-Legal-Tag-Test999943387766",
	"created_by": "faK96PJHh5W-AzMK_dERdxkBBssUYVuqDjzYJcw9Al0",
	"last_modified_date": "Mon Mar 17 2025 12:43:38 GMT+0000 (Coordinated Universal Time)",
	"created_date": "Mon Mar 17 2025 12:43:38 GMT+0000 (Coordinated Universal Time)",
	"acls": {
		"admins": [
			"data.default.owners@opendes.dataservices.energy"
		],
		"viewers": [
			"data.default.viewers@opendes.dataservices.energy"
		]
	},
	"gcsurl": "ss-cloud-sfibby9ril9i755-915f80ed-4804-448a-bfa5-2e70934a97a2",
	"ctag": "TQsxLjyufohTOFvfopendes;opendes",
	"Symbol(id)": {
		"partitionKey": "ds-opendes-test999384006-3fdd95ea0c79eb59dcb2acc48ed1d1eb057a5f94debacffac4d8e88410c5cb2804d9ba68473ea20d2d91d143b64b755e4627ad87e89530ade1cd9614a8a53545",
		"name": "test.sgy"
	},
	"access_policy": "dataset",
	"sbit": "WSUmTxkL20jQSlKW",
	"sbit_count": 1
}
```


### Register applications

Register applications in your Azure Data Manager for Energy instance.

API: **Applications** > **Register a new application**

```bash
curl --request POST \
  --url 'https://{base_url}/seistore-svc/api/v3/app?email={email}&sdpath={sdpath}' \
  --header 'Authorization: Bearer {access_token}'
```
**Sample Response:** 
```bash
Status Code: 200
```

## Next step

As an alternative user experience to Postman, you can use the sdutil command-line Python tool to directly interact with Seismic Store. Use the following tutorial to get started:

> [!div class="nextstepaction"]
> [Use sdutil to load data into Seismic Store](./tutorial-seismic-ddms-sdutil.md)
>

For more information on the Seismic REST APIs in Azure Data Manager for Energy, see the OpenAPI specifications available in the [adme-samples](https://microsoft.github.io/adme-samples/) GitHub repository.