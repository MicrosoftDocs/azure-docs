---
title: How to manage legal tags in Microsoft Energy Data Services Preview #Required; page title is displayed in search results. Include the brand.
description: This article describes how to manage legal tags in Microsoft Energy Data Services Preview #Required; article description that is displayed in search results. 
author: Lakshmisha-KS #Required; your GitHub user alias, with correct capitalization.
ms.author: lakshmishaks #Required; microsoft alias of author; optional team alias.
ms.service: energy-data-services #Required; service per approved list. slug assigned by ACOM.
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 08/19/2022
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# How to manage legal tags
In this article, you'll know how to manage legal tags in your Microsoft Energy Data Services Preview instance. A Legal tag is the entity that represents the legal status of data in the Microsoft Energy Data Services Preview instance. Legal tag is a collection of properties that governs how data can be ingested and consumed. A legal tag is required for data to be [ingested](concepts-csv-parser-ingestion.md) into your Microsoft Energy Data Services Preview instance. It's also required for the [consumption](concepts-index-and-search.md) of the data from your Microsoft Energy Data Services Preview instance. Legal tags are defined at a data partition level individually.

While in Microsoft Energy Data Services Preview instance, [entitlement service](concepts-entitlements.md) defines access to data for a given user(s), legal tag defines the overall access to the data across users. A user may have access to manage the data within a data partition however, they may not be able to do so-until certain legal requirements are fulfilled.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Create a legal tag
Run the below curl command in Azure Cloud Bash to create a legal tag for a given data partition of your Microsoft Energy Data Services Preview instance.

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

```bash
    curl --location --request POST 'https://<instance>.energy.azure.com/api/legal/v1/legaltags' \
    --header 'data-partition-id: <instance>-<data-partition-name>' \
    --header 'Authorization: Bearer  <access_token>' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "name": "<instance>-<data-partition-name>-legal-tag",
        "description": "Microsoft Energy Data Services Preview Legal Tag",
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
        "name": "<instance>-<data-partition-name>-legal-tag",
        "description": "Microsoft Energy Data Services Preview Legal Tag",
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
    curl --location --request POST 'https://<instance>.energy.azure.com/api/legal/v1/legaltags' \
    --header 'data-partition-id: <instance>-<data-partition-name>' \
    --header 'Authorization: Bearer  <access_token>' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "name": "legal-tag",
        "description": "Microsoft Energy Data Services Preview Legal Tag",
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
        "name": "<instance>-<data-partition-name>-legal-tag",
        "description": "Microsoft Energy Data Services Preview Legal Tag",
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
Run the below curl command in Azure Cloud Bash to get the legal tag associated with a data partition of your Microsoft Energy Data Services Preview instance.
    
```bash
    curl --location --request GET 'https://<URI>/api/legal/v1/legaltags/<legal-tag-name>' \
    --header 'data-partition-id: <data-partition-id>' \
    --header 'Authorization: Bearer <access_token>'
```

### Sample request

```bash
    curl --location --request GET 'https://<instance>.energy.azure.com/api/legal/v1/legaltags/<instance>-<data-partition-name>-legal-tag' \
    --header 'data-partition-id: <instance>-<data-partition-name>' \
    --header 'Authorization: Bearer <access_token>'
```

### Sample response

```JSON
    {
    "name": "<instance>-<data-partition-name>-legal-tag",
    "description": "Microsoft Energy Data Services Preview Legal Tag",
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

