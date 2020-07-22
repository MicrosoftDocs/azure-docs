---
# Mandatory fields.
title: Add tags to digital twins
titleSuffix: Azure Digital Twins
description: See how to implement tags on digital twins
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 7/22/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Digital Twins Pattern – tags 

This document describes patterns that can be used to implement tags on digital twin entities in Azure Digital Twins. Some customers want to replicate tags from existing systems, like [Haystack Tags](https://project-haystack.org/doc/TagModel), in Azure Digital Twins. 

## Marker tags 

A marker tag is a simple string that is used to categorize or mark a digital twin entity, such as "blue" or "red". A marker tag has no meaningful value—the presence (or absence) of the tag is used. 

### Model 

Marker tags are modeled as a DTDL Map from string to boolean (the value is ignored, the presence of the tag is all that's important). 

```json
{
  "@type": "Property",
  "name": "tags",
  "schema": {
    "@type": "Map",
    "mapKey": {
      "name": "tagName",
      "schema": "string"
    },
    "mapValue": {
      "name": "tagValue",
      "schema": "boolean"
    }
  }
}
```

### Instances 

Marker tags are set in digital twin entities by setting the value of the "tags" property. 

```csharp
entity-01: "tags": { "red": true, "round": true } 
entity-02: "tags": { "blue": true, "round": true } 
entity-03: "tags": { "red": true, "large": true } 
```

### Queries 

Tags can be used to filter digital twin entities in queries. 

Get all red entities: 

```sql
select * from digitaltwins where is_defined(tags.red) 
```

Get all entities that are round but not red: 

```sql
select * from digitaltwins where not is_defined(tags.red) and is_defined(tags.round) 
```

## Value tags 

A value tag is a key-value pair that is used to give each tag a value, such as "color": "blue" or "color": "red". Additionally, marker tags can be combined with value tags by ignoring the tag's value. 

### Model 

Value tags are modeled as a DTDL Map from string to string. 

```json
{
  "@type": "Property",
  "name": "tags",
  "schema": {
    "@type": "Map",
    "mapKey": {
      "name": "tagName",
      "schema": "string"
    },
    "mapValue": {
      "name": "tagValue",
      "schema": "string"
    }
  }
} 
```

### Instances 

Value tags are set in digital twin entities by setting the value of the "tags" property. The empty string value ("") is used to indicate a marker tag. 

```csharp
entity-01: "tags": { "red": "", "size": "large" } 
entity-02: "tags": { "purple": "", "size": "small" } 
entity-03: "tags": { "red": "", "size": "small" } 
```

### Queries 

Get all red entities (red is a marker tag): 

```sql
select * from digitaltwins where is_defined(tags.red) 
```

Get all entities that are small but not red: 

```sql
select * from digitaltwins where not is_defined(tags.red) and tags.size = 'small' 
```