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

# Add tags to digital twins 

You can use the concept of tags to further identify and categorize your digital twins. In particular, users may want to replicate tags from existing systems, such as [Haystack Tags](https://project-haystack.org/doc/TagModel), within their Azure Digital Twins instances. 

This document describes patterns that can be used to implement tags on digital twins.

Tags are first added as properties within the [model](concepts-models.md) that describes a digital twin. That property is then set on the twin when it is created based on the model. After that, the tags can be used in [queries](concepts-query-language.md) to identify and filter your twins.

## Marker tags 

A **marker tag** is a simple string that is used to mark or categorize a digital twin, such as "blue" or "red". This string is the tag's name, and marker tags have no meaningful value—the tag is significant just by its presence (or absence). 

### Add marker tags to model 

Marker tags are modeled as a [DTDL](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md) Map from `string` to `boolean`. The boolean `mapValue` is ignored, as the presence of the tag is all that's important. 

Here is an excerpt from a twin model implementing a marker tag as a property:

:::code language="json" source="~/digital-twins-docs-samples/models/tags.json" range="2-16":::

### Add marker tags to digital twins

Once the `tags` property is part of a digital twin's model, you can set the marker tag in the digital twin by setting the value of this property. 

Here is an example that populates the marker `tags` for three twins:

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/twin_operations_other.cs" id="TagPropertiesMarker":::

Here is a code example on how to set the marker `tags` for a twin using the [.NET SDK](/dotnet/api/overview/azure/digitaltwins/client):

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/twin_operations_other.cs" id="TagPropertiesCsharp":::

### Query with marker tags

Once tags have been added to digital twins, the tags can be used to filter the twins in queries. 

Here is a query to get all twins that have been tagged as "red": 

:::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="QueryMarkerTags1":::

You can also combine tags for more complex queries. Here is a query to get all twins that are round, and not red: 

:::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="QueryMarkerTags2":::

## Value tags 

A **value tag** is a key-value pair that is used to give each tag a value, such as `"color": "blue"` or `"color": "red"`. Once a value tag is created, it can also be used as a marker tag by ignoring the tag's value. 

### Add value tags to model 

Value tags are modeled as a [DTDL](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md) Map from `string` to `string`. Both the `mapKey` and the `mapValue` are significant. 

Here is an excerpt from a twin model implementing a value tag as a property:

:::code language="json" source="~/digital-twins-docs-samples/models/tags.json" range="17-31":::

### Add value tags to digital twins

As with marker tags, you can set the value tag in a digital twin by setting the value of this `tags` property from the model. To use a value tag as a marker tag, you can set the `tagValue` field to the empty string value (`""`). 

Here is an example that populates the value `tags` for three twins:

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/twin_operations_other.cs" id="TagPropertiesValue":::

Note that `red` and `purple` are used as marker tags in this example.

### Query with value tags

As with marker tags, you can use value tags to filter the twins in queries. You can also use value tags and marker tags together.

From the example above, `red` is being used as a marker tag. Remember that this is a query to get all twins that have been tagged as "red": 

:::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="QueryMarkerTags1":::

Here is a query to get all entities that are small (value tag), and not red: 

:::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="QueryMarkerValueTags":::

## Next steps

Read more about designing and managing digital twin models:
* [*How-to: Manage DTDL models*](how-to-manage-model.md)

Read more about querying the twin graph:
* [*How-to: Query the twin graph*](how-to-query-graph.md)
