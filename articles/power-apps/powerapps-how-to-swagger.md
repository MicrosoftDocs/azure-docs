<properties
	pageTitle="How to customize your Swagger definition for PowerApps and Logic Flows| Microsoft Azure"
	description="View the schema extensions required by Swagger to work with PowerApps and Logic Flows"
	services=""
    suite="powerapps"
	documentationCenter="" 
	authors="sunaysv"
	manager="erikre"
	editor=""/>

<tags
   ms.service="powerapps"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na" 
   ms.date="07/12/2016"
   ms.author="mandia"/>


# Customize your Swagger definition for PowerApps and Logic Flows

>[AZURE.IMPORTANT] This topic has moved to powerapps.microsoft.com at [Customize your Swagger definition for PowerApps and Flows](https://powerapps.microsoft.com/tutorials/customapi-how-to-swagger/). Please go to PowerApps for the latest version. This Azure link is being archived.


## Author Swagger 2.0 API definition for your API

To learn how to add Swagger to your WebAPI, see [Swashbuckle][1].

## Schema extensions
In addition to the standard Swagger specifications, there are some additional swagger extensions available when creating a custom API for PowerApps and Logic Flows. This sections lists and describes these extensions. 

##### x-ms-summary
A string that describes the display names for entities that do not have the `summary` field defined in the Swagger spec. **Parameter names** is an example. 

##### x-ms-visibility
This value describes whether the entity is displayed in the Logic Flow designer. The following values are available: 

- “none” (default)
- “advanced”
- “internal” - Logic Flow designer does not show these operations

If an operation is marked as "important", the Logic Flow client is expected to highlight these operations.

##### x-ms-trigger
Defines whether this operation can be used as a trigger in the Logic Flow. Options include:
	
- none (default): The operation cannot be used as a trigger.
- single: This operation can also be used as a trigger.
- batched: This operation can be used as a trigger.  In addition, this operation responds with a JSON 'array' of objects, and the Logic Flow fires a trigger for each item in the array.


##### x-ms-dynamic-values
This is a hint to the Logic Flow designer that the API provides a list of dynamically allowed values for this parameter. The Logic Flow designer can invoke an operation as defined by the value of this field, and extract the possible values from the result.  The Logic Flow designer can then display these values as options to the end user.  

The value is an object that contains the following properties:
	
- `operationId`: A string that matches the operationId for the operation that is invoked
- `parameters`: An object whose properties define the parameters required for the operation
- `value-collection`: A path string that evaluates to an array of objects in the response payload
- `value-path`: A path string in the object inside "value-collection" that refers to the value for the parameter.
- `value-title`: A path string in the object inside "value-collection" that refers to a description for the value.


Example:

```javascript
"/api/tables/{table}/items": {
  "post": {
    "operationId": "TableData_CreateItem",
    "summary": "Create an object in {Salesforce}",
    "parameters": [
      {
        "name": "table",
        "x-ms-summary": "Object Type",
        "x-ms-dynamic-values": {
          "operationId": "TableMetadata_ListTables",      // operation that needs to be invoked
          "parameters": { },                              // parameters for the above operation, if any
          "value-collection": "values",                   // field that contains the collection
          "value-path": "Name",                           // field that contains the value
          "value-title": "DisplayName"                    // field that contains a display name for the value
      }
      // ...
    ]
    // ...
  }
  // ...
}
```

In this example, the swagger defines the `TableData_CreateItem` operation that creates a new object in Salesforce. 

Salesforce has a lot of built-in objects. `x-ms-dynamic-values` is used here to help the designer figure out the list of the built-in Salesforce objects. It obtains the list by calling `TableMetadata_ListTables`.

##### x-ms-dynamic-schema
This is a hint to the Logic Flow designer that the schema for this parameter (or response) is dynamic in nature.  It can invoke an operation as defined by the value of this field, and discover the schema dynamically.  It can then display an appropriate UI to take inputs from the user or display available fields.

Example:

```javascript
{
  "name": "item",
  "in": "body",
  "required": true,
  "x-ms-dynamic-schema": {
    "operationId": "Metadata_GetTableSchema",
    "parameters": {
      "tablename": "{table}"              // the value that the user has selected from the above parameter
    },
    "value-path": "Schema"                // the field that contains the JSON schema
  }
},
```

This is useful in scenarios where the inputs to an operation are dynamic. For example, consider the case of SQL. The schema of each table is different. So when a user selects a particular table, the Logic Flow designer needs to understand the structure of the table so that it can display the column names. In this context, if the swagger definition has `x-ms-dynamic-schema`, it calls the corresponding operation to fetch the schema.


<!--Reference links in article-->
[1]: https://github.com/domaindrivendev/Swashbuckle/blob/master/README.md
