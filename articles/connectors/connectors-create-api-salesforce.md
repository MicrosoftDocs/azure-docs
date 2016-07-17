<properties
pageTitle="Salesforce Connector | Microsoft Azure"
description="Create Logic apps with Azure App service. The Salesforce Connector provides an API to work with Salesforce objects."
services="app-servicelogic"	
documentationCenter=".net,nodejs,java" 	
authors="msftman"	
manager="erikre"	
editor=""
tags="connectors" />

<tags
ms.service="app-service-logic"
ms.devlang="multiple"
ms.topic="article"
ms.tgt_pltfrm="na"
ms.workload="integration"
ms.date="07/15/2016"
ms.author="deonhe"/>

# Get started with the Salesforce Connector connector

The Salesforce Connector provides an API to work with Salesforce objects.

To use [any connector](./apis-list.md), you first need to create a Logic app. You can get started by [creating a Logic app now](../app-service-logic/app-service-logic-create-a-logic-app.md).

## Connect to Salesforce Connector

Before your Logic app can access any service, you first need to create a *connection* to the service. A [connection](./connectors-overview.md) provides connectivity between a Logic app and another service.  

### Create a connection to Salesforce Connector

>[AZURE.INCLUDE [Steps to create a connection to Salesforce Connector](../../includes/connectors-create-api-salesforce.md)]

## Use a Salesforce Connector trigger

A trigger is an event that can be used to start the workflow defined in a Logic app. [Learn more about triggers](../app-service-logic/app-service-logic-what-are-logic-apps.md#logic-app-concepts).

## Use a Salesforce Connector action

An action is an operation carried out by the workflow defined in a Logic app. [Learn more about actions](../app-service-logic/app-service-logic-what-are-logic-apps.md#logic-app-concepts).

## Technical Details

Here are the details about the triggers, actions and responses that this connection supports:

## Salesforce Connector triggers

Salesforce Connector has the following trigger(s):  

|Trigger | Description|
|--- | ---|
|[When an object is created](connectors-create-api-salesforceconnector.md#when-an-object-is-created)|This operation triggers a flow when an object is created.|
|[When an object is modified](connectors-create-api-salesforceconnector.md#when-an-object-is-modified)|This operation triggers a flow when an object is modified.|


## Salesforce Connector actions

Salesforce Connector has the following actions:


|Action|Description|
|--- | ---|
|[Get objects](connectors-create-api-salesforceconnector.md#get-objects)|Thie operation gets objects of a certain object type like 'Lead'.|
|[Create object](connectors-create-api-salesforceconnector.md#create-object)|This operation creates an object.|
|[Get object](connectors-create-api-salesforceconnector.md#get-object)|This operation gets an object.|
|[Delete object](connectors-create-api-salesforceconnector.md#delete-object)|This operation deletes an object.|
|[Update object](connectors-create-api-salesforceconnector.md#update-object)|This operation updates an object.|
|[Get object types](connectors-create-api-salesforceconnector.md#get-object-types)|This operation lists the available object types.|
### Action details

Here are the details for the actions and triggers for this connector, along with their responses:



### Get objects
Thie operation gets objects of a certain object type like 'Lead'. 


|Property Name| Display Name|Description|
| ---|---|---|
|table*|Object type|Salesforce object type like 'Lead'|
|$filter|Filter Query|An ODATA filter query to restrict the number of entries|
|$orderby|Order By|An ODATA orderBy query for specifying the order of entries|
|$skip|Skip Count|Number of entries to skip (default = 0)|
|$top|Maximum Get Count|Maximum number of entries to retrieve (default = 256)|

An * indicates that a property is required

#### Output Details

ItemsList: undefined


| Property Name | Data Type | Description |
|---|---|---|
|value|array|undefined|




### Create object
This operation creates an object. 


|Property Name| Display Name|Description|
| ---|---|---|
|table*|Object type|Object type like 'Lead'|
|item*|Object|Object to create|

An * indicates that a property is required

#### Output Details

Item: undefined


| Property Name | Data Type | Description |
|---|---|---|
|ItemInternalId|string|undefined|




### Get object
This operation gets an object. 


|Property Name| Display Name|Description|
| ---|---|---|
|table*|Object type|Salesforce object type like 'Lead'|
|id*|Object id|Identifier of object to get|

An * indicates that a property is required

#### Output Details

Item: undefined


| Property Name | Data Type | Description |
|---|---|---|
|ItemInternalId|string|undefined|




### Delete object
This operation deletes an object. 


|Property Name| Display Name|Description|
| ---|---|---|
|table*|Object type|Object type like 'Lead'|
|id*|Object id|Identifier of object to delete|

An * indicates that a property is required




### Update object
This operation updates an object. 


|Property Name| Display Name|Description|
| ---|---|---|
|table*|Object type|Object type like 'Lead'|
|id*|Object id|Identifier of object to update|
|item*|Object|Object with changed properties|

An * indicates that a property is required

#### Output Details

Item: undefined


| Property Name | Data Type | Description |
|---|---|---|
|ItemInternalId|string|undefined|




### When an object is created
This operation triggers a flow when an object is created. 


|Property Name| Display Name|Description|
| ---|---|---|
|table*|Object type|Object type like 'Lead'|
|$filter|Filter Query|An ODATA filter query to restrict the number of entries|
|$orderby|Order By|An ODATA orderBy query for specifying the order of entries|
|$skip|Skip Count|Number of entries to skip (default = 0)|
|$top|Maximum Get Count|Maximum number of entries to retrieve (default = 256)|

An * indicates that a property is required

#### Output Details

ItemsList: undefined


| Property Name | Data Type | Description |
|---|---|---|
|value|array|undefined|




### When an object is modified
This operation triggers a flow when an object is modified. 


|Property Name| Display Name|Description|
| ---|---|---|
|table*|Object type|Object type like 'Lead'|
|$filter|Filter Query|An ODATA filter query to restrict the number of entries|
|$orderby|Order By|An ODATA orderBy query for specifying the order of entries|
|$skip|Skip Count|Number of entries to skip (default = 0)|
|$top|Maximum Get Count|Maximum number of entries to retrieve (default = 256)|

An * indicates that a property is required

#### Output Details

ItemsList: undefined


| Property Name | Data Type | Description |
|---|---|---|
|value|array|undefined|




### Get object types
This operation lists the available object types. 


There are no parameters for this call

#### Output Details

TablesList: undefined


| Property Name | Data Type | Description |
|---|---|---|
|value|array|undefined|



## HTTP responses

The actions and triggers above can return one or more of the following HTTP status codes: 

|Name|Description|
|---|---|
|200|OK|
|202|Accepted|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Internal Server Error. Unknown error occurred|
|default|Operation Failed.|






## Next Steps
[Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md)