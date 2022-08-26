---
title: How to manage legal tags in Microsoft Energy Data Services #Required; page title is displayed in search results. Include the brand.
description: This article describes how to manage legal tags in Microsoft Energy Data Services #Required; article description that is displayed in search results. 
author: Lakshmisha-KS #Required; your GitHub user alias, with correct capitalization.
ms.author: lakshmishaks #Required; microsoft alias of author; optional team alias.
ms.service: azure #Required; service per approved list. slug assigned by ACOM.
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 08/19/2022
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# How to manage legal tags?
A Legal tag is the entity that represents the legal status of data in the Microsoft Energy Data Services instance. Legal tag is a collection of properties that governs how the data can be ingested and consumed. A user may have access to manage the data within a data partition however, they may not be able to do so, until certain legal requirements are fulfilled. Data won't be able to be passed into or out of Azure Energy Data services unless the partition has an associated legal tag.

## Create a legal tag

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
    curl --location --request POST 'https://bseloak.energy.azure.com/api/legal/v1/legaltags' \
    --header 'data-partition-id: bseloak-bseldp1' \
    --header 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1yNS1BVWliZkJpaTdOZDFqQmV...' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "name": "bseloak-bseldp1-legal-tag",
        "description": "Microsoft Energy Data Services Legal Tag",
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
        "name": "bseloak-bseldp1-legal-tag",
        "description": "Microsoft Energy Data Services Legal Tag",
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

> [!NOTE]
> Create Legal Tag api, internally appends data-partition-id to legal tag name if it isn't already present. For instance, if request has name as: ```legal-tag```, then the create legal tag name would be ```<instancename>-<data-partition-id>-legal-tag``` 

```bash
    curl --location --request POST 'https://bseloak.energy.azure.com/api/legal/v1/legaltags' \
    --header 'data-partition-id: bseloak-bseldp1' \
    --header 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1yNS1BVWliZkJpaTdOZDFqQmV...' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "name": "legal-tag",
        "description": "Microsoft Energy Data Services Legal Tag",
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
        "name": "bseloak-bseldp1-legal-tag",
        "description": "Microsoft Energy Data Services Legal Tag",
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

```bash
    curl --location --request GET 'https://<URI>/api/legal/v1/legaltags/<legal-tag-name>' \
    --header 'data-partition-id: <data-partition-id' \
    --header 'Authorization: Bearer <access_token>'
```

### Sample request

```bash
    curl --location --request GET 'https://bseloak.energy.azure.com/api/legal/v1/legaltags/bseloak-bseldp1-legal-tag' \
    --header 'data-partition-id: bseloak-bseldp1' \
    --header 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1yNS1BVWliZkJpaTdOZDFqQmViYXh...'
```

### Sample response

```JSON
    {
    "name": "bseloak-bseldp1-legal-tag",
    "description": "Microsoft Energy Data Services Legal Tag",
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
> [How to load datasets](how-to-load-datasets.md)

