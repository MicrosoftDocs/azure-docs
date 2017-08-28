---
title: OpenAPI extensions for custom connectors - Azure Logic Apps | Microsoft Docs
description: Extend OpenAPI with advanced functionality for custom connectors
author: ecfan
manager: anneta
editor: 
services: logic-apps
documentationcenter: 

ms.assetid: 
ms.service: logic-apps
ms.workload: logic-apps
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/1/2017
ms.author: LADocs; estfan
---

# Extend OpenAPI with advanced functionality for custom connectors

To create custom connectors for Azure Logic Apps, Microsoft Flow, 
or Microsoft PowerApps, you must provide an OpenAPI definition file, 
which is a language-agnostic machine-readable document that describes 
your API's operations and parameters. 
Along with OpenAPI's out-of-the-box functionality, you can also 
include these OpenAPI extensions when you create custom connectors: 

* `summary`
* `x-ms-summary`
* `description`
* `x-ms-visibility`
* `x-ms-dynamic-values`
* `x-ms-dynamic-schema`

## summary

Specifies the title for the operation. 
Recommended: Use *sentence case* for `summary`.

Example: "When a task is created" or "Create new lead".

Applies to: Operations

![Summary-annotation](./media/customapi-how-to-swagger/figure_1.png)

## x-ms-summary

Specifies the title for an entity. 
Recommended: Use *title case* for `x-ms-summary`.

Example: "Task Name", "Due Date", and so on

Applies to: Parameters, Response Schema

![x-ms-summary-annotation](./media/customapi-how-to-swagger/figure_2.png)

## description

Specifies a verbose explanation about the operation's 
functionality or an entity's format and function. 
Recommended: Use *sentence case* for `description`.

Example: "This operation triggers when a task is added to your project."

Applies to: Operations, Parameters, Response Schema

![description-annotation](./media/customapi-how-to-swagger/figure_3.jpg)

## x-ms-visibility

Specifies the user-facing visibility for an entity. 
Possible values: `important`, `advanced`, and `internal`

* `important` operations and parameters are always shown to the user first.
* `advanced` operations and parameters are hidden under the **See more** menu.
* `internal` operations and parameters are completely hidden from the user.

> [!NOTE] 
> For parameters that are `internal` and `required`, 
> you **must** provide default values for these parameters.

Applies to: Operations, Parameters, Schemas

![visibility-annotation](./media/customapi-how-to-swagger/figure_4.jpg)

## x-ms-dynamic-values

Shows a populated drop-down list for the user 
to select input parameters for an operation.

Applies to: Parameters

![dynamic-values](./media/customapi-how-to-swagger/figure_5.png)

### How to use x-ms-dynamic-values

Annotate a parameter with the `x-ms-dynamic-values` 
object in the parameter definition.

> [!TIP] 
> For an example, see this [OpenAPI sample](https://procsi.blob.core.windows.net/blog-images/sampleDynamicSwagger.json). 

### Properties for x-ms-dynamic-values

|Name|Required or optional|Description| 
|:---|:-------------------|:----------| 
|**operationID**|Required|The operation to call for populating the drop-down list| 
|**value-path**|Required|A path string in the object inside `value-collection` that refers to the parameter value. If `value-collection` isn't specified, the response is evaluated as an array.| 
|**value-title**|Optional|A path string in the object inside `value-collection` that refers to the value's description. If `value-collection` isn't specified, the response is evaluated as an array.| 
|**value-collection**|Optional|A path string that evaluates to an array of objects in the response payload| 
|**parameters**|Optional|An object whose properties specify the input parameters required to invoke a dynamic-values operation| 
|||| 

Here's an example for `x-ms-dynamic-values`:

``` json
"x-ms-dynamic-values": {
  "operationId": "PopulateDropdown",
  "value-path": "name",
  "value-title": "properties/displayName",
  "value-collection": "value",
  "parameters": {
     "staticParameter": "{value}",
     "dynamicParameter": {
        "parameter": "{value-to-pass-to-dynamicParameter}"
     }
  }
}
```

### Example with all the OpenAPI extensions up to this point

``` json
"/api/lists/{listID-dynamic}": {
    "get": {
        "description": "Get items from a single list - uses dynamic values and outputs dynamic schema",
        "summary": "Gets items from the selected list",
        "operationID": "GetListItems",
        "parameters": [
           {
             "name": "listID-dynamic",
             "type": "string",
             "in": "path",
             "description": "Select the list from where you want outputs",
             "required": true,
             "x-ms-summary": "Select List",
             "x-ms-dynamic-values": {
                "operationID": "GetLists",
                "value-path": "id",
                "value-title": "name"
             }
           }
        ]
    }
}
```

## x-ms-dynamic-schema

This object indicates that the schema for the current parameter or response is dynamic. 
This extension can invoke an operation that's defined by the value of this field, 
and dynamically discover the schema. The extension then shows the appropriate UI 
to receive inputs from the user or display available fields.

Applies to: Parameters, Response

Here's an example that shows how the input form changes, 
based on the item that the user selects from drop-down list:

![dynamic-schema-request](./media/customapi-how-to-swagger/figure_6.png)

Here's an example that shows how the outputs change, 
based on the item that a user selects from the drop-down list:

![dynamic-schema-response](./media/customapi-how-to-swagger/figure_7.png)

### How to use

Annotate a request parameter or a response body definition 
with the `x-ms-dynamic-schema` object.

> [!TIP] 
> For an example, see this [OpenAPI sample](https://procsi.blob.core.windows.net/blog-images/sampleDynamicSwagger.json).

### Properties for x-ms-dynamic-schema

|Name|Required or optional|Description| 
|:---|:-------------------|:----------| 
|**operationID**|Required|The operation to call for fetching the schema| 
|**parameters**|Required|An object whose properties specify the input parameters required to invoke a dynamic-schema operation| 
|**value-path**|Optional|A path string that refers to the property that has the schema. If not specified, the response is assumed to contain the schema in the root object's properties.| 
|||| 

Here's an example for dynamic parameters:

``` json
{
  "name": "dynamicListSchema",
  "in": "body",
  "description": "Dynamic schema for items in the selected list",
  "schema": {
    "type": "object",
    "x-ms-dynamic-schema": {
        "operationID": "GetListSchema",
        "parameters": {
          "listID": {
            "parameter": "listID-dynamic"
          }
        },
        "value-path": "items"
    }
  }
}
```

Here's an example for dynamic response:

``` json
"DynamicResponseGetListSchema": {
   "type": "object",
   "x-ms-dynamic-schema": {
      "operationID": "GetListSchema",
      "parameters": {
         "listID": {
            "parameter": "listID-dynamic"
         }
      },
      "value-path": "items"
    }
}
```

## Next steps

* [Secure your connector](../logic-apps/custom-connector-security-authentication-overview.md)
* [Set up authentication with Azure Active Directory](../logic-apps/custom-connector-api-azure-active-directory-authentication.md)
