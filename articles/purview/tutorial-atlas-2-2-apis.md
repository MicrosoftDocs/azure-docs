---
title: "How to use new APIs available with Atlas 2.2"
description: This tutorial describes the new APIs available with Atlas 2.2 upgrade.
author: nayenama
ms.author: nayenama
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: tutorial
ms.date: 04/18/2021

# Customer intent: I can use the new APIs available with Atlas 2.2
---

# Tutorial: Atlas 2.2 new functionality

In this tutorial, you learn how to programmatically interact with new Atlas 2.2 APIs with Microsoft Purview's data map.

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

## Prerequisites

* To get started, you must have an existing Microsoft Purview account. If you don't have a catalog, see the [quickstart for creating a Microsoft Purview account](create-catalog-portal.md).

* To establish bearer token and to call any Data Plane APIs see [the documentation about how to call REST APIs for Purview Data planes](tutorial-using-rest-apis.md).

## Business Metadata APIs

Business Metadata is a template containing multiple custom attributes (key values) which can be created globally and then applied across multiple typedefs.

### Create a Business metadata with attributes

You can send POST request to the following endpoint

```
POST {{endpoint}}/api/atlas/v2/types/typedefs
```

Sample JSON

```json
   {
  "businessMetadataDefs": [
    {
      "category": "BUSINESS_METADATA",
      "createdBy": "admin",
      "updatedBy": "admin",
      "version": 1,
      "typeVersion": "1.1",
      "name": "<Name of Business Metadata>",
      "description": "",
      "attributeDefs": [
        {
          "name": "<Attribute Name>",
          "typeName": "string",
          "isOptional": true,
          "cardinality": "SINGLE",
          "isUnique": false,
          "isIndexable": true,
          "options": {
            "maxStrLength": "50",
            "applicableEntityTypes": "[\"Referenceable\"]"
          }          
        }
      ]
    }
  ]
}
```

### Add/Update an attribute to an existing business metadata 

You can send PUT request to the following endpoint:

```
PUT {{endpoint}}/api/atlas/v2/types/typedefs
```

Sample JSON

```json
   {
  "businessMetadataDefs": [
    {
      "category": "BUSINESS_METADATA",
      "createdBy": "admin",
      "updatedBy": "admin",
      "version": 1,
      "typeVersion": "1.1",
      "name": "<Name of Business Metadata>",
      "description": "",
      "attributeDefs": [
        {
          "name": "<Attribute Name>",
          "typeName": "string",
          "isOptional": true,
          "cardinality": "SINGLE",
          "isUnique": false,
          "isIndexable": true,
          "options": {
            "maxStrLength": "500",
            "applicableEntityTypes": "[\"Referenceable\"]"
          }          
        },
        {
          "name": "<Attribute Name 2>",
          "typeName": "int",
          "isOptional": true,
          "cardinality": "SINGLE",
          "isUnique": false,
          "isIndexable": true,
          "options": {
            "applicableEntityTypes": "[\"Referenceable\"]"
          }          
        }
      ]
    }
  ]
}
```

### Get Business metadata definition

You can send GET request to the following endpoint

```
GET {endpoint}}/api/atlas/v2/types/typedef/name/{{Business Metadata Name}}
```

### Set Business metadata attribute to an entity 

You can send POST request to the following endpoint

```
POST {{endpoint}}/api/atlas/v2/entity/guid/{{GUID}}/businessmetadata?isOverwrite=true
```

Sample JSON

```json
{
  "myBizMetaData1": {
        "bizAttr1": "I am myBizMetaData1.bizAttr1",
        "bizAttr2": 123,
  }
 }
```

### Delete Business metadata attribute from an entity 

You can send DELETE request to the following endpoint

```
DELETE {{endpoint}}/api/atlas/v2/entity/guid/{{GUID}}/businessmetadata?isOverwrite=true
```

Sample JSON

```json
{
  "myBizMetaData1": {
    "bizAttr1": ""    
  }
}
```

### Delete Business metadata type definition

You can send DELETE request to the following endpoint

```
DELETE {{endpoint}}/api/atlas/v2/types/typedef/name/{{Business Metadata Name}}
```

## Custom Attribute APIs

Custom Attributes are key value pairs which can be directly added to an atlas entity.

### Set Custom Attribute to an entity 

You can send POST request to the following endpoint

```
POST {{endpoint}}/api/atlas/v2/entity
```

Sample JSON

```json
{
    "entity": {
        "typeName": "azure_datalake_gen2_path",
        "attributes": {
           
            "qualifiedName": "<FQN of the asset>",
            "name": "data6.csv"
        },
        "guid": "3ffb28ff-138f-419e-84ba-348b0165e9e0",
        "customAttributes": {
            "custAttr1": "attr1",
            "custAttr2": "attr2"
        }
    }
}
```
## Label APIs

Labels are free text tags which can be applied to any atlas entity.

### Set labels to an entity

You can send POST request to the following endpoint

```
POST {{endpoint}}/api/atlas/v2/entity/guid/{{GUID}}/labels
```

Sample JSON

```json
[
  "label1",
  "label2"
]
```

### Delete labels to an entity

You can send DELETE request to the following endpoint:

```
DELETE {{endpoint}}/api/atlas/v2/entity/guid/{{GUID}}/labels
```

Sample JSON

```json
[
  "label2"
]
```

## Next steps

> [!div class="nextstepaction"]
> [Manage data sources](manage-data-sources.md)
> [Purview Data Plane REST APIs](/rest/api/purview/)
