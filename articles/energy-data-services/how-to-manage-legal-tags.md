---
title: How to manage legal tags in Microsoft Azure Data Manager for Energy
description: This article describes how to manage legal tags in Azure Data Manager for Energy
author: Lakshmisha-KS
ms.author: lakshmishaks
ms.service: energy-data-services
ms.topic: how-to
ms.date: 02/20/2023
ms.custom: template-how-to
---

# How to manage legal tags
In this article, you'll know how to manage legal tags in your Azure Data Manager for Energy instance. A Legal tag is the entity that represents the legal status of data in the Azure Data Manager for Energy instance. Legal tag is a collection of properties that governs how data can be ingested and consumed. A legal tag is required for data to be [ingested](concepts-csv-parser-ingestion.md) into your Azure Data Manager for Energy instance. It's also required for the [consumption](concepts-index-and-search.md) of the data from your Azure Data Manager for Energy instance. Legal tags are defined at a data partition level individually.

While in Azure Data Manager for Energy instance, [entitlement service](concepts-entitlements.md) defines access to data for a given user(s), legal tag defines the overall access to the data across users. A user may have access to manage the data within a data partition however, they may not be able to do so-until certain legal requirements are fulfilled.

## Create a legal tag
Run the below curl command in Azure Cloud Bash to create a legal tag for a given data partition of your Azure Data Manager for Energy instance.

```bash
    curl --location --request POST 'https://<URI>/api/legal/v1/legaltags' \
    --header 'data-partition-id: <data-partition-id>' \
    --header 'Authorization: Bearer <access_token>' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "name": "<legal-tag-name>",
        "description": "<legal-tag-description>",
        "properties": {
            "contractId": "<contract-id>",
            "countryOfOrigin": ["<country-of-origin>"],
            "dataType": "<data-type>",
            "expirationDate": "<expiration-ID>",
            "exportClassification": "<export-classification>",
            "originator": "<originator>",
            "personalData": "<personal-data>",
            "securityClassification": "Public"
        }
    }'

```

### Sample request
Consider an Azure Data Manager for Energy instance named "medstest" with a data partition named "dp1"

```bash
    curl --location --request POST 'https://medstest.energy.azure.com/api/legal/v1/legaltags' \
    --header 'data-partition-id: medstest-dp1' \
    --header 'Authorization: Bearer  eyxxxxxxx.........................' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "name": "medstest-dp1-legal-tag",
        "description": "Azure Data Manager for Energy Legal Tag",
        "properties": {
            "contractId": "A1234",
            "countryOfOrigin": ["US"],
            "dataType": "Public Domain Data",
            "expirationDate": "2099-01-25",
            "exportClassification": "EAR99",
            "originator": "MyCompany",
            "personalData": "No Personal Data",
            "securityClassification": "Public"
        }
    }'

```

### Sample response

```JSON
    {
        "name": "medsStest-dp1-legal-tag",
        "description": "Azure Data Manager for Energy Legal Tag",
        "properties": {
        "countryOfOrigin": [
            "US"
        ],
        "contractId": "A1234",
        "expirationDate": "2099-01-25",
        "originator": "MyCompany",
        "dataType": "Public Domain Data",
        "securityClassification": "Public",
        "personalData": "No Personal Data",
        "exportClassification": "EAR99"
    }
}
```

The country of origin should follow [ISO Alpha2 format](https://www.nationsonline.org/oneworld/country_code_list.htm).

The Create Legal Tag api, internally appends data-partition-id to legal tag name if it isn't already present. For instance, if request has name as: ```legal-tag```, then the create legal tag name would be ```<instancename>-<data-partition-id>-legal-tag``` 

```bash
    curl --location --request POST 'https://medstest.energy.azure.com/api/legal/v1/legaltags' \
    --header 'data-partition-id: medstest-dp1' \
    --header 'Authorization: Bearer  eyxxxxxxx.........................' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "name": "legal-tag",
        "description": "Azure Data Manager for Energy Legal Tag",
        "properties": {
            "contractId": "A1234",
            "countryOfOrigin": ["US"],
            "dataType": "Public Domain Data",
            "expirationDate": "2099-01-25",
            "exportClassification": "EAR99",
            "originator": "MyCompany",
            "personalData": "No Personal Data",
            "securityClassification": "Public"
        }
    }'

```
The sample response will have data-partition-id appended to the legal tag name and sample response will be:


```JSON
    {
        "name": "medstest-dp1-legal-tag",
        "description": "Azure Data Manager for Energy Legal Tag",
        "properties": {
        "countryOfOrigin": [
            "US"
        ],
        "contractId": "A1234",
        "expirationDate": "2099-01-25",
        "originator": "MyCompany",
        "dataType": "Public Domain Data",
        "securityClassification": "Public",
        "personalData": "No Personal Data",
        "exportClassification": "EAR99"
    }
}
```

## Get a legal tag
Run the below curl command in Azure Cloud Bash to get the legal tag associated with a data partition of your Azure Data Manager for Energy instance.
    
```bash
    curl --location --request GET 'https://<URI>/api/legal/v1/legaltags/<legal-tag-name>' \
    --header 'data-partition-id: <data-partition-id>' \
    --header 'Authorization: Bearer <access_token>'
```

### Sample request
Consider an Azure Data Manager for Energy instance named "medstest" with a data partition named "dp1"

```bash
    curl --location --request GET 'https://medstest.energy.azure.com/api/legal/v1/legaltags/medstest-dp1-legal-tag' \
    --header 'data-partition-id: medstest-dp1' \
    --header 'Authorization: Bearer eyxxxxxxx.........................'
```

### Sample response

```JSON
    {
    "name": "medstest-dp1-legal-tag",
    "description": "Azure Data Manager for Energy Legal Tag",
    "properties": {
        "countryOfOrigin": [
        "US"
        ],
        "contractId": "A1234",
        "expirationDate": "2099-01-25",
        "originator": "MyCompany",
        "dataType": "Public Domain Data",
        "securityClassification": "Public",
        "personalData": "No Personal Data",
        "exportClassification": "EAR99"
    }
    }
```

## Next steps
<!-- Add a context sentence for the following links -->
> [!div class="nextstepaction"]
> [How to add more data partitions](how-to-add-more-data-partitions.md)

