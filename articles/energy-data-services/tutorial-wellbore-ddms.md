---
title: "Tutorial: Work with well data records by using Wellbore DDMS APIs"
titleSuffix: Microsoft Azure Data Manager for Energy
description: Learn how to work with well data records in your Azure Data Manager for Energy instance by using Wellbore Domain Data Management Services (DDMS) APIs using cURL.
author: Preetisingh
ms.author: preetisingh
ms.service: azure-data-manager-energy
ms.topic: tutorial
ms.date: 7/22/2025
ms.custom:
  - template-tutorial
  - sfi-image-blocked

#Customer intent: As a developer, I want to learn how to use the Wellbore DDMS APIs so that I can store and retrieve similar kinds of data records.
---

# Tutorial: Work with well data records by using Wellbore DDMS APIs

Use Wellbore Domain Data Management Services (DDMS) APIs  to work with well data in your instance of Azure Data Manager for Energy.

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Use Wellbore DDMS APIs to work with well data records.

For more information about DDMS, see [DDMS concepts](concepts-ddms.md).

## Prerequisites

* An Azure subscription
* An instance of [Azure Data Manager for Energy](quickstart-create-microsoft-energy-data-services-instance.md) created in your Azure subscription
* cURL command-line tool installed on your machine
* Service principal access token to call the Wellbore APIs. See [How to generate auth token](how-to-generate-auth-token.md).

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

## Use Wellbore DDMS APIs to work with well data records

Successfully completing the cURL requests that are described in the following Wellbore DDMS APIs indicates successful ingestion and retrieval of well records in your Azure Data Manager for Energy instance.
If you are interested in checking out all the APIs, you can check our [Swagger](https://microsoft.github.io/adme-samples/rest-apis/index.html?page=/adme-samples/rest-apis/M23/wellbore_ddms_openapi.yaml) 

### Create a legal tag

Create a legal tag for data compliance.

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

### Create a well record

Create a well record in your Azure Data Manager for Energy instance.

Method: `POST`

```bash
curl -X POST "https://<DNS>/api/os-wellbore-ddms/ddms/v3/wells/<well_id>" \
   -H "Authorization: Bearer <access_token>" \
   -H "data-partition-id: <data-partition-id>" \
   -H "Content-Type: application/json" \
   -d '[
         {
            "acl": {
               "owners": [
               "data.default.owners@{{entitlement_domain}}"
               ],
               "viewers": [
               "data.default.viewers@{{entitlement_domain}}"
               ]
            },
            "data": {
               "ExtensionProperties": {},
               "FacilityName": "{{wellbore_well_name}}",
               "FacilityNameAliases": [
               {
                  "AliasName": "20-000-00000-00",
                  "AliasNameTypeID": "{{DATA_PARTITION_ID}}:reference-data--AliasNameType:UniqueIdentifier:"
               }
               ]
            },
            "id": "{{DATA_PARTITION_ID}}:master-data--Well:{{wellbore_well_id}}",
            "kind": "osdu:wks:master-data--Well:1.1.0",
            "legal": {
               "legaltags": [
               "{{legal_dafault_tag}}"
               ],
               "otherRelevantDataCountries": [
               "FR",
               "US"
               ],
               "status": "compliant"
            }
         }
   ]'

```

**Sample Response:**
```json
{
  "recordCount": 1,
  "recordIdVersions": [
    "opendes:master-data--Well:122:1753292228903506"
  ],
  "recordIds": [
    "opendes:master-data--Well:122"
  ],
  "skippedRecordIds": []
}
```

### Get a well record

Get the well record data for your Azure Data Manager for Energy instance.

Method: `GET`

```bash
curl -X GET "https://<DNS>/api/os-wellbore-ddms/ddms/v3/wells/<well_id>" \
   -H "Authorization: Bearer <access_token>" \
   -H "data-partition-id: <data-partition-id>" \
   -H 'accept: application/json'
```
**Sample Response:**
```json
{
  "id": "opendes:master-data--Well:122",
  "version": 1753292228903506,
  "kind": "osdu:wks:master-data--Well:1.1.0",
  "acl": {
    "viewers": [
      "data.default.viewers@opendes.dataservices.energy"
    ],
    "owners": [
      "data.default.owners@opendes.dataservices.energy"
    ]
  },
  "legal": {
    "legaltags": [
      "opendes-welltesttag"
    ],
    "otherRelevantDataCountries": [
      "FR",
      "US"
    ]
  },
  "meta": null,
  "data": {
    "ExtensionProperties": {},
    "FacilityName": "opendes:master-data--Well:123",
    "FacilityNameAliases": [
      {
        "AliasName": "20-000-00000-00",
        "AliasNameTypeID": "opendes:reference-data--AliasNameType:UniqueIdentifier:"
      }
    ]
  },
  "createTime": "2025-07-23T17:37:09.290000+00:00",
  "createUser": "3046ab2b-b04c-4933-8afd-***********"
}
```

### Get well versions

Get the versions of each ingested well record in your Azure Data Manager for Energy instance.


Method: `GET`

```bash
curl -X GET "https://<DNS>/api/os-wellbore-ddms/ddms/v3/wells/<well_id>/versions" \
   -H "Authorization: Bearer <access_token>" \
   -H "data-partition-id: <data-partition-id>" \
   -H 'accept: application/json' \
```
**Sample Response:**
```json
{
  "recordId": "opendes:master-data--Well:122",
  "versions": [
    1753292228903506
  ]
}
```

### Get a specific well version

Get the details of a specific version for a specific well record in your Azure Data Manager for Energy instance.


Method: `GET`

```bash
curl -X GET "https://<DNS>/api/os-wellbore-ddms/ddms/v3/wells/<well_id>/versions/<version>" \
   -H "Authorization: Bearer <access_token>" \
   -H "data-partition-id: <data-partition-id>" \
   -H 'accept: application/json' \
```
**Sample Response:**
```json
{
  "id": "opendes:master-data--Well:122",
  "version": 1753292228903506,
  "kind": "osdu:wks:master-data--Well:1.1.0",
  "acl": {
    "viewers": [
      "data.default.viewers@opendes.dataservices.energy"
    ],
    "owners": [
      "data.default.owners@opendes.dataservices.energy"
    ]
  },
  "legal": {
    "legaltags": [
      "opendes-welltesttag"
    ],
    "otherRelevantDataCountries": [
      "FR",
      "US"
    ]
  },
  "meta": null,
  "data": {
    "ExtensionProperties": {},
    "FacilityName": "opendes:master-data--Well:123",
    "FacilityNameAliases": [
      {
        "AliasName": "20-000-00000-00",
        "AliasNameTypeID": "opendes:reference-data--AliasNameType:UniqueIdentifier:"
      }
    ]
  },
  "createTime": "2025-07-23T17:37:09.290000+00:00",
  "createUser": "3046ab2b-b04c-4933-8afd-***********"
}
```

### Delete a well record

Delete a specific well record from your Azure Data Manager for Energy instance.

Method: `DELETE`

```bash
curl -X DELETE "https://<DNS>/api/os-wellbore-ddms/ddms/v3/wells/<well_id>" \
   -H "Authorization: Bearer <access_token>" \
   -H "data-partition-id: <data-partition-id>"
```
**Response code: 204 No content**

## Next step

Read the following tutorial to learn how to use the sdutil command-line tool to load seismic data into Seismic Store:

> [!div class="nextstepaction"]
> [Tutorial: Use sdutil to load data into Seismic Store](tutorial-seismic-ddms-sdutil.md)
