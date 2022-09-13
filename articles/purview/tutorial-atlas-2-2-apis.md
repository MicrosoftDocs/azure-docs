---
title: "Use new APIs available with Atlas 2.2."
description: This tutorial describes the new APIs available with the Atlas 2.2 upgrade.
author: nayenama
ms.author: nayenama
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: tutorial
ms.date: 04/18/2022

# Customer intent: As a developer, I want to use the new APIs available with Atlas 2.2 to interact programmatically with the data map in Microsoft Purview.
---

# Tutorial: Atlas 2.2 new functionality

In this tutorial, learn to programmatically interact with new Atlas 2.2 APIs with the data map in Microsoft Purview.

## Prerequisites

* If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

* You must have an existing Microsoft Purview account. If you don't have a catalog, see the [quickstart for creating a Microsoft Purview account](create-catalog-portal.md).

* To establish a bearer token and to call any data plane APIs, see [the documentation about how to call REST APIs for Microsoft Purview data planes](tutorial-using-rest-apis.md).

## Business metadata APIs

Business metadata is a template that contains custom attributes (key values). You can create these attributes globally and then apply them across multiple typedefs.

### Atlas endpoint

For all the requests, you'll need the Atlas endpoint for your Microsoft Purview account.

1. Find your Microsoft Purview account in the [Azure portal](https://portal.azure.com)
1. Select the **Properties** page on the left side menu
1. Copy the **Atlas endpoint** value

:::image type="content" source="media/tutorial-atlas-2-2-apis/endpoint.png" alt-text="Screenshot of the properties page for Microsoft Purview with the Atlas endpoint box highlighted." border="true":::

### Create business metadata with attributes

You can send a `POST` request to the following endpoint:

```
POST {{endpoint}}/api/atlas/v2/types/typedefs
```

>[!TIP]
> The **applicableEntityTypes** property tells which data types the metadata will be applied to.

Sample JSON:

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

### Add or update an attribute to existing business metadata

You can send a `PUT` request to the following endpoint:

```
PUT {{endpoint}}/api/atlas/v2/types/typedefs
```

Sample JSON:

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

### Get a business metadata definition

You can send a `GET` request to the following endpoint:

```
GET {endpoint}}/api/atlas/v2/types/typedef/name/{{Business Metadata Name}}
```

### Set a business metadata attribute to an entity

You can send a `POST` request to the following endpoint:

```
POST {{endpoint}}/api/atlas/v2/entity/guid/{{GUID}}/businessmetadata?isOverwrite=true
```

Sample JSON:

```json
{
  "myBizMetaData1": {
        "bizAttr1": "I am myBizMetaData1.bizAttr1",
        "bizAttr2": 123,
  }
 }
```

### Delete a business metadata attribute from an entity

You can send a `DELETE` request to the following endpoint:

```
'DELETE' {{endpoint}}/api/atlas/v2/entity/guid/{{GUID}}/businessmetadata?isOverwrite=true
```

Sample JSON:

```json
{
  "myBizMetaData1": {
    "bizAttr1": ""    
  }
}
```

### Delete a business metadata type definition

You can send a `DELETE` request to the following endpoint:

```
DELETE {{endpoint}}/api/atlas/v2/types/typedef/name/{{Business Metadata Name}}
```

## Custom attribute APIs

Custom attributes are key/value pairs that can be directly added to an Atlas entity.

### Set a custom attribute to an entity

You can send a `POST` request to the following endpoint:

```
POST {{endpoint}}/api/atlas/v2/entity
```

Sample JSON:

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

Labels are free text tags that can be applied to any Atlas entity.

### Set labels to an entity

You can send a `POST` request to the following endpoint:

```
POST {{endpoint}}/api/atlas/v2/entity/guid/{{GUID}}/labels
```

Sample JSON:

```json
[
  "label1",
  "label2"
]
```

### Delete labels to an entity

You can send a `DELETE` request to the following endpoint:

```
DELETE {{endpoint}}/api/atlas/v2/entity/guid/{{GUID}}/labels
```

Sample JSON:

```json
[
  "label2"
]
```

## Next steps

> [!div class="nextstepaction"]
> [Manage data sources](manage-data-sources.md)
> [Microsoft Purview data plane REST APIs](/rest/api/purview/)
