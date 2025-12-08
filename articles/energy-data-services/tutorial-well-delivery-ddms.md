---
title: "Tutorial: Work with well data records by using Well Delivery DDMS APIs"
description: Learn how to work with well data records in your Azure Data Manager for Energy instance by using Well Delivery Domain Data Management Services (DDMS) APIs in Postman.
author: prakashsivakumar-ps
ms.author: prasivakumar
ms.service: azure-data-manager-energy
ms.topic: tutorial
ms.date: 07/28/2022
ms.custom:
  - template-tutorial
  - sfi-image-nochange

#Customer intent: As a developer, I want to learn how to use the Well Delivery DDMS APIs so that I can store and retrieve similar kinds of data records.
---

# Tutorial: Work with well data records by using Well Delivery DDMS APIs

This tutorial demonstrates how to utilize Well Delivery Domain Data Management Services (DDMS) APIs with cURL to manage well record within an Azure Data Manager for Energy instance.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Use Well Delivery DDMS APIs to work with well data records.

For more information about DDMS, see [DDMS concepts](concepts-ddms.md).

## Prerequisites
* An Azure subscription
* An instance of [Azure Data Manager for Energy](quickstart-create-microsoft-energy-data-services-instance.md) created in your Azure subscription
* cURL command-line tool installed on your machine
* Generate the service principal access token to call the Well Delivery APIs. See [How to generate auth token](how-to-generate-auth-token.md).

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


## Use Well Delivery DDMS APIs to work with well data records

### Create a legal tag

Create a legal tag for data compliance.

Run the following `cURL` command to create a legal tag:

```bash
curl -X POST "https://{base_url}/api/legal/v1/legaltags" \
     -H "Authorization: Bearer <access_token>" \
     -H "Content-Type: application/json" \
     -H "data-partition-id: <data_partition_id>" \
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

For users to have the proper permissions to make Well Delivery DDMS API calls, they must be part of the `data.default.viewers@{data-partition-id}.dataservices.energy` and `data.default.owners@<data_partition_id>.dataservices.energy` entitlement groups. This call adds a user to the proper group.

Follow the [Manage users](how-to-manage-users.md) guide to add appropriate entitlements for the user .

### Create a well record

Create a well record in your Azure Data Manager for Energy instance.

```bash
curl --request PUT \
  --url https://{base_url}/api/well-delivery/storage/v1/well \
  --header 'Authorization: Bearer <access_token>' \
  --header 'Content-Type: application/json' \
  --header 'data-partition-id: <data_partition_id>' \
  --data '{
    "id":"<data_partition_id>:master-data--Well:well-1753861267 434",
    "kind": "osdu:wks:master-data--Well:1.0.0",
    "acl": {
        "viewers": [
            "data.default.viewers@<data_partition_id>.dataservices.energy"
        ],
        "owners": [
            "data.default.owners@<data_partition_id>.dataservices.energy"
        ]
    },
    "legal": {
        "legaltags": [
            "LegalTagName"
        ],
        "otherRelevantDataCountries": [
            "US"
        ]
    },
    "data": {
        "ExistenceKind": "namespace:reference-data--ExistenceKind:planned:",
        "FacilityName": "Well-Test"
    }
}'
```

**Sample Response:**
```json
{
"created entity": "well-1753861267434:1753861269454"
}
```

### Create a wellbore record

Create a wellbore record in your Azure Data Manager for Energy instance.

```bash
curl --request PUT \
  --url https://{base_url}/api/well-delivery/storage/v1/  wellbore \
  --header 'Authorization: Bearer <access_token>' \
  --header 'Content-Type: application/json' \
  --header 'data-partition-id: <data_partition_id>' \
  --data '{
    "id": "dp1:master-data--Wellbore:wellbore-1753861298505",
    "kind": "osdu:wks:master-data--Wellbore:1.0.0",
    "acl": {
        "viewers": [
            "data.default.viewers@<data_partition_id>.dataservices.energy"
        ],
        "owners": [
            "data.default.owners@<data_partition_id>.dataservices.energy"
        ]
    },
    "legal": {
        "legaltags": [
            "LegalTagName"
        ],
        "otherRelevantDataCountries": [
            "US"
        ]
    },
    "data": {
        "ExistenceKind": "namespace:reference-data--ExistenceKind:planned:",
        "WellID": "<data_partition_id>:master-data--Well:well-1753861298505:1753861300000",
        "Name": "Demo wellbore name"
    }
}'
```

**Sample Response:**
```json
{
"created entity": "wellbore-1753861298505:1753861301020"
}
```


### Create an activity plan

Create an activity plan.

```bash

curl --request PUT \
  --url https://{base_url}/api/well-delivery/storage/v1/activityplan \
  --header 'Authorization: Bearer <access_token>' \
  --header 'Content-Type: application/json' \
  --header 'data-partition-id: <data_partition_id>' \
  --data '{
    "id": "dp1:master-data--ActivityPlan:activityplan-1753861290577",
    "kind": "osdu:wks:master-data--ActivityPlan:1.0.0",
    "acl": {
        "viewers": [
            "data.default.viewers@<data_partition_id>.dataservices.energy"
        ],
        "owners": [
            "data.default.owners@<data_partition_id>.dataservices.energy"
        ]
    },
    "legal": {
        "legaltags": [
            "LegalTagName"
        ],
        "otherRelevantDataCountries": [
            "US"
        ]
    },
    "data": {
        "ExistenceKind": "namespace:reference-data--ExistenceKind:planned:",
        "WellboreID": "<data_partition_id>:master-data--Wellbore:wellbore-1753861290577:1753861293139"
    }
}'

```
**Sample Response:**
```json
{
"created entity" : "activityplan-1753861290577:1753861294109"
}
```

## Next steps

Go to the next tutorial to learn how to work with well data by using Wellbore DDMS APIs:

> [!div class="nextstepaction"]
> [Tutorial: Work with well data records by using Wellbore DDMS APIs](tutorial-wellbore-ddms.md)

For more information on the  Well Delivery DDMS REST APIs in Azure Data Manager for Energy, see the OpenAPI specifications available in the [adme-samples](https://microsoft.github.io/adme-samples/) GitHub repository.
