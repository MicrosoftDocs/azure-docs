<properties
pageTitle="ProjectOnline | Microsoft Azure"
description="Create Logic apps with Azure App service. Project Online is a flexible online solution for project portfolio management (PPM) and everyday work from Microsoft. Delivered through Office 365, Project Online enables organizations to get started quickly with powerful project management capabilities to plan, prioritize, and manage projects and project portfolio investments—from almost anywhere on almost any device."
services="logic-apps"	
documentationCenter=".net,nodejs,java" 	
authors="msftman"	
manager="erikre"	
editor=""
tags="connectors" />

<tags
ms.service="logic-apps"
ms.devlang="multiple"
ms.topic="article"
ms.tgt_pltfrm="na"
ms.workload="integration"
ms.date="05/16/2016"
ms.author="deonhe"/>

# Get started with the ProjectOnline connector

Project Online is a flexible online solution for project portfolio management (PPM) and everyday work from Microsoft. Delivered through Office 365, Project Online enables organizations to get started quickly with powerful project management capabilities to plan, prioritize, and manage projects and project portfolio investments—from almost anywhere on almost any device.

The ProjectOnline connector can be used from:  

- [Logic apps](../app-service-logic/app-service-logic-what-are-logic-apps.md)  
- [PowerApps](http://powerapps.microsoft.com)  
- [Flow](http://flow.microsoft.com)  

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version. 

You can get started by creating a Logic app now, see [Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

## Triggers and actions

The ProjectOnline connector can be used as an action; it has trigger(s). All connectors support data in JSON and XML formats. 

 The ProjectOnline connector has the following action(s) and/or trigger(s) available:

### ProjectOnline actions
You can take these action(s):

|Action|Description|
|--- | ---|
|[ListProjects](connectors-create-api-projectonline.md#listprojects)|Lists the projects in your project online site|
|[CreateProject](connectors-create-api-projectonline.md#createproject)|Creates a new project in your project online site|
|[CreateTask](connectors-create-api-projectonline.md#createtask)|Creates a new task in you project|
|[CreateResource](connectors-create-api-projectonline.md#createresource)|Creates an Enterprise Resources in your project online site|
|[ListTasks](connectors-create-api-projectonline.md#listtasks)|Lists the published tasks in a project|
|[CheckoutProject](connectors-create-api-projectonline.md#checkoutproject)|Checks out a project in your site|
|[PublishProject](connectors-create-api-projectonline.md#publishproject)|Check in and publish and existing project in your site|
### ProjectOnline triggers
You can listen for these event(s):

|Trigger | Description|
|--- | ---|
|When a new project is created|Triggers a flow whenever a new project is created|
|When a new resource is created|Triggers a new flow when a new resource is created|
|When a new task is created|Triggers a flow when a new task is created|


## Create a connection to ProjectOnline
To create Logic apps with ProjectOnline, you must first create a **connection** then provide the details for the following properties: 

|Property| Required|Description|
| ---|---|---|
|Token|Yes|Provide ProjectOnline Credentials|

>[AZURE.INCLUDE [Steps to create a connection to ProjectOnline](../../includes/connectors-create-api-projectonline.md)]

>[AZURE.TIP] You can use this connection in other logic apps.

## Reference for ProjectOnline
Applies to version: 1.0

## OnNewProject
When a new project is created: Triggers a flow whenever a new project is created 

```GET: /trigger/_api/ProjectData/Projects``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|siteUrl|string|yes|query|none|Root site url of your project site (Example: https://sampletenant.sharepoint.com/teams/sampleteam )|

#### Response

|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed.|


## OnNewResource
When a new resource is created: Triggers a new flow when a new resource is created 

```GET: /trigger/_api/ProjectData/Resources``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|siteUrl|string|yes|query|none|Root site url of your project site (Example: https://sampletenant.sharepoint.com/teams/sampleteam )|

#### Response

|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed.|


## OnNewTask
When a new task is created: Triggers a flow when a new task is created 

```GET: /trigger/_api/ProjectData/Tasks``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|siteUrl|string|yes|query|none|Root site url of your project site (Example: https://sampletenant.sharepoint.com/teams/sampleteam )|

#### Response

|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed.|


## ListProjects
List projects: Lists the projects in your project online site 

```GET: /_api/ProjectServer/Projects``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|siteUrl|string|yes|query|none|Root site url of your project site (Example: https://sampletenant.sharepoint.com/teams/sampleteam )|

#### Response

|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed.|


## CreateProject
Creates new project: Creates a new project in your project online site 

```POST: /_api/ProjectServer/Projects``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|siteUrl|string|yes|query|none|Root site url of your project site (Example: https://sampletenant.sharepoint.com/teams/sampleteam )|
|proj| |yes|body|none|New project to create|

#### Response

|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|401|Unauthorized|
|403|ForbIDden|
|404|Not Found|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed.|


## CreateTask
Creates new task: Creates a new task in you project 

```POST: /_api/ProjectServer/Projects('{project_id}')/Draft/Tasks/Add``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|siteUrl|string|yes|query|none|Root site url of your project site (Example: https://sampletenant.sharepoint.com/teams/sampleteam )|
|project_id|string|yes|path|none|Unique ID of the project to add the task to|
|task| |yes|body|none|New task to add to the project|

#### Response

|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed.|


## CreateResource
Create new resource: Creates an Enterprise Resources in your project online site 

```POST: /_api/ProjectServer/EnterpriseResources``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|siteUrl|string|yes|query|none|Root site url of your project site (Example: https://sampletenant.sharepoint.com/teams/sampleteam )|
|resource| |yes|body|none|New enterprise resource to add to the project|

#### Response

|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed.|


## ListTasks
Lists tasks: Lists the published tasks in a project 

```GET: /_api/ProjectServer/Projects('{project_id}')/Tasks``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|siteUrl|string|yes|query|none|Root site url of your project site (Example: https://sampletenant.sharepoint.com/teams/sampleteam )|
|project_id|string|yes|path|none|Unique ID of the project to fetch tasks|

#### Response

|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed.|


## CheckoutProject
Checkout a project: Checks out a project in your site 

```POST: /_api/ProjectServer/Projects('{project_id}')/checkOut``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|siteUrl|string|yes|query|none|Root site url of your project site (Example: https://sampletenant.sharepoint.com/teams/sampleteam )|
|project_id|string|yes|path|none|Unique ID of the project to add the task to|

#### Response

|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed.|


## PublishProject
Checkin and publish project: Check in and publish and existing project in your site 

```POST: /_api/ProjectServer/Projects('{project_id}')/Draft/Publish(true)``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|siteUrl|string|yes|query|none|Root site url of your project site (Example: https://sampletenant.sharepoint.com/teams/sampleteam )|
|project_id|string|yes|path|none|Unique ID of the project to checkin|

#### Response

|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed.|


## Object definitions 

### TriggerProjectsWrapper


| Property Name | Data Type | Required |
|---|---|---|
|value|array|No |



### TriggerProject


| Property Name | Data Type | Required |
|---|---|---|
|ProjectStartDate|string|No |
|ProjectFinishDate|string|No |
|ProjectCreatedDate|string|No |
|ProjectId|string|No |
|ProjectModifiedDate|string|No |
|ProjectType|integer|No |
|ProjectName|string|No |



### TriggerResourcesWrapper


| Property Name | Data Type | Required |
|---|---|---|
|value|array|No |



### TriggerResource


| Property Name | Data Type | Required |
|---|---|---|
|ResourceId|string|No |
|ResourceBaseCalendar|string|No |
|ResourceBookingType|integer|No |
|ResourceCanLevel|boolean|No |
|ResourceCostPerUse|number|No |
|ResourceCreatedDate|string|No |
|ResourceEarliestAvailableFrom|string|No |
|ResourceEmail|string|No |
|ResourceInitials|string|No |
|ResourceIsActive|boolean|No |
|ResourceIsGeneric|boolean|No |
|ResourceLatestAvailableTo|string|No |
|ResourceModifiedDate|string|No |
|ResourceName|string|No |
|ResourceStatsuName|string|No |
|ResourceType|integer|No |
|TypeDescription|string|No |
|TypeName|string|No |



### TriggerTasksWrapper


| Property Name | Data Type | Required |
|---|---|---|
|value|array|No |



### TriggerTask


| Property Name | Data Type | Required |
|---|---|---|
|ProjectId|string|No |
|TaskId|string|No |
|ProjectName|string|No |
|TaskName|string|No |
|TaskCreatedDate|string|No |
|TaskModifieddate|string|No |
|TaskStartDate|string|No |
|TaskFinishDate|string|No |
|TaskPriority|integer|No |
|TaskIsActive|boolean|No |



### NewProject


| Property Name | Data Type | Required |
|---|---|---|
|Name|string|Yes |
|Description|string|No |
|Start|string|No |



### NewReource


| Property Name | Data Type | Required |
|---|---|---|
|Name|string|Yes |
|IsBudget|boolean|No |
|IsGeneric|boolean|No |
|IsInactive|boolean|No |



### Project


| Property Name | Data Type | Required |
|---|---|---|
|ApprovedStart|string|No |
|ApprovedEnd|string|No |
|CheckedOutDate|string|No |
|CheckOutDescription|string|No |
|CheckOutId|string|No |
|CreatedDate|string|No |
|Id|string|No |
|IsCheckedOut|boolean|No |
|LastPublishedDate|string|No |
|LastSavedDate|string|No |
|OptimizerDecision|integer|No |
|PlannerDecision|integer|No |
|ProjectType|integer|No |
|Name|string|No |
|WinprojVersion|string|No |



### ProjectsWrapper


| Property Name | Data Type | Required |
|---|---|---|
|value|array|No |



### NewTask


| Property Name | Data Type | Required |
|---|---|---|
|parameters|not defined|Yes |



### TaskParameters


| Property Name | Data Type | Required |
|---|---|---|
|Name|string|Yes |
|Notes|string|No |
|Start|string|No |
|Duration|string|No |



### EnterpriseResource


| Property Name | Data Type | Required |
|---|---|---|
|CanLevel|boolean|No |
|Code|string|No |
|CostAccrual|integer|No |
|CostCenter|string|No |
|Created|string|No |
|DefaultBookingType|integer|No |
|Email|string|No |
|ExternalId|string|No |
|Group|string|No |
|HireDate|string|No |
|Id|string|No |
|Initials|string|No |
|IsActive|boolean|No |
|IsBudget|boolean|No |
|IsCheckedOut|boolean|No |
|IsGeneric|boolean|No |
|IsTeam|boolean|No |
|MaterialLabel|string|No |
|Modified|string|No |
|Name|string|No |
|Phonetics|string|No |
|ResourceType|integer|No |
|TerminationDate|string|No |



### TasksWrapper


| Property Name | Data Type | Required |
|---|---|---|
|value|array|No |



### Task


| Property Name | Data Type | Required |
|---|---|---|
|Created|string|No |
|Modified|string|No |
|Start|string|No |
|Finish|string|No |
|Name|string|No |
|Id|string|No |
|Priority|integer|No |
|PercentComplete|integer|No |
|Notes|string|No |
|Contact|string|No |


## Next Steps
[Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md)