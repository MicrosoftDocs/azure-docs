<properties
pageTitle="Wunderlist | Microsoft Azure"
description="Create Logic apps with Azure App service. Wunderlist provide a todo list and task manager to help people get their stuff done.  Whether you’re sharing a grocery list with a loved one, working on a project, or planning a vacation, Wunderlist makes it easy to capture, share, and complete your to¬dos. Wunderlist instantly syncs between your phone, tablet and computer, so you can access all your tasks from anywhere."
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
ms.date="05/17/2016"
ms.author="deonhe"/>

# Get started with the Wunderlist connector



The Wunderlist connector can be used from:  

- [Logic apps](../app-service-logic/app-service-logic-what-are-logic-apps.md)  
- [PowerApps](http://powerapps.microsoft.com)  
- [Flow](http://flows.microsoft.com)  

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version. 

You can get started by creating a Logic app now, see [Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

## Triggers and actions

The Wunderlist connector can be used as an action; it has trigger(s). All connectors support data in JSON and XML formats. 

 The Wunderlist connector has the following action(s) and/or trigger(s) available:

### Wunderlist actions
You can take these action(s):

|Action|Description|
|--- | ---|
|[RetrieveLists](connectors-create-api-wunderlist.md#retrievelists)|Retrieve the lists associated with your account.|
|[CreateList](connectors-create-api-wunderlist.md#createlist)|Create a list.|
|[ListTasks](connectors-create-api-wunderlist.md#listtasks)|Retrieve tasks from a specific list.|
|[CreateTask](connectors-create-api-wunderlist.md#createtask)|Create a task|
|[ListSubTasks](connectors-create-api-wunderlist.md#listsubtasks)|Retrieve subtasks from a specific list or from a specific task.|
|[CreateSubTask](connectors-create-api-wunderlist.md#createsubtask)|Create a subtask within a specific task|
|[ListNotes](connectors-create-api-wunderlist.md#listnotes)|Retrieve notes for a specific list or a specific task.|
|[CreateNote](connectors-create-api-wunderlist.md#createnote)|Add a note to a specific task|
|[ListComments](connectors-create-api-wunderlist.md#listcomments)|Retrieve task comments for a specific list or a specific task.|
|[CreateComment](connectors-create-api-wunderlist.md#createcomment)|Add a comment to a specific task|
|[RetrieveReminders](connectors-create-api-wunderlist.md#retrievereminders)|Retrieve reminders for a specific list or a specific task.|
|[CreateReminder](connectors-create-api-wunderlist.md#createreminder)|Set a reminder.|
|[RetrieveFiles](connectors-create-api-wunderlist.md#retrievefiles)|Retrieve files for a specific list or a specific task.|
|[GetList](connectors-create-api-wunderlist.md#getlist)|Retrieves a specific list|
|[DeleteList](connectors-create-api-wunderlist.md#deletelist)|Deletes a list|
|[UpdateList](connectors-create-api-wunderlist.md#updatelist)|Update a specific list|
|[GetTask](connectors-create-api-wunderlist.md#gettask)|Retrieves a specific task|
|[UpdateTask](connectors-create-api-wunderlist.md#updatetask)|Updates a specific task|
|[DeleteTask](connectors-create-api-wunderlist.md#deletetask)|Deletes a specific task|
|[GetSubTask](connectors-create-api-wunderlist.md#getsubtask)|Retrieves a specific subtask|
|[UpdateSubTask](connectors-create-api-wunderlist.md#updatesubtask)|Updates a specific subtask|
|[DeleteSubTask](connectors-create-api-wunderlist.md#deletesubtask)|Deletes a specific subtask|
|[GetNote](connectors-create-api-wunderlist.md#getnote)|Retrieve a specific note|
|[UpdateNote](connectors-create-api-wunderlist.md#updatenote)|Update a specific note|
|[DeleteNote](connectors-create-api-wunderlist.md#deletenote)|Delete a specific note|
|[GetComment](connectors-create-api-wunderlist.md#getcomment)|Retrieve a specific task comment|
|[UpdateReminder](connectors-create-api-wunderlist.md#updatereminder)|Update a specific reminder|
|[DeleteReminder](connectors-create-api-wunderlist.md#deletereminder)|Delete a specific reminder|
### Wunderlist triggers
You can listen for these event(s):

|Trigger | Description|
|--- | ---|
|When a task is due|Triggers a new flow when a task in the list is due|
|When a new task is created|Triggers a new flow when a new task is created in the list|
|When a reminder occurs|Triggers a new flow when a reminder occurs|


## Create a connection to Wunderlist
To create Logic apps with Wunderlist, you must first create a **connection** then provide the details for the following properties: 

|Property| Required|Description|
| ---|---|---|
|Token|Yes|Provide Wunderlist Credentials|
After you create the connection, you can use it to execute the actions and listen for the triggers described in this article. 


>[AZURE.INCLUDE [Steps to create a connection to Wunderlist](../../includes/connectors-create-api-wunderlist.md)] 


>[AZURE.TIP] You can use this connection in other logic apps.

## Reference for Wunderlist
Applies to version: 1.0

## TriggerTaskDue
When a task is due: Triggers a new flow when a task in the list is due 

```GET: /trigger/tasksdue``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|list_id|integer|yes|query|none|List ID|

#### Response

|Name|Description|
|---|---|
|200|Operation successful|


## TriggerTaskNew
When a new task is created: Triggers a new flow when a new task is created in the list 

```GET: /trigger/tasksnew``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|list_id|integer|yes|query|none|List ID|

#### Response

|Name|Description|
|---|---|
|200|Operation successful|


## TriggerReminder
When a reminder occurs: Triggers a new flow when a reminder occurs 

```GET: /trigger/reminders``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|list_id|integer|yes|query|none|List ID|
|task_id|integer|no|query|none|Task ID|

#### Response

|Name|Description|
|---|---|
|200|Operation successful|


## RetrieveLists
Get lists: Retrieve the lists associated with your account. 

```GET: /lists``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|

#### Response

|Name|Description|
|---|---|
|200|Operation successful|
|400|Bad Request|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed.|


## CreateList
Create a list: Create a list. 

```POST: /lists``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|post| |yes|body|none|New list to be created|

#### Response

|Name|Description|
|---|---|
|200|Operation successful|
|default|Operation Failed.|


## ListTasks
Get tasks: Retrieve tasks from a specific list. 

```GET: /tasks``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|list_id|integer|yes|query|none|List ID|
|completed|boolean|no|query|none|Completed|

#### Response

|Name|Description|
|---|---|
|200|Operation successful|
|400|Bad Request|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed.|


## CreateTask
Create a task: Create a task 

```POST: /tasks``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|post| |yes|body|none|New task to be created|

#### Response

|Name|Description|
|---|---|
|201|Created|


## ListSubTasks
Get subtasks: Retrieve subtasks from a specific list or from a specific task. 

```GET: /subtasks``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|list_id|integer|yes|query|none|List ID|
|task_id|integer|no|query|none|Task ID|
|completed|boolean|no|query|none|Completed|

#### Response

|Name|Description|
|---|---|
|200|Operation successful|
|400|Bad Request|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed.|


## CreateSubTask
Create a subtask: Create a subtask within a specific task 

```POST: /subtasks``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|post| |yes|body|none|New subtask to be created|

#### Response

|Name|Description|
|---|---|
|201|Created|


## ListNotes
Get notes: Retrieve notes for a specific list or a specific task. 

```GET: /notes``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|list_id|integer|yes|query|none|List ID|
|task_id|integer|no|query|none|Task ID|

#### Response

|Name|Description|
|---|---|
|200|Operation successful|
|400|Bad Request|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed.|


## CreateNote
Create a note: Add a note to a specific task 

```POST: /notes``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|post| |yes|body|none|New note to be created|

#### Response

|Name|Description|
|---|---|
|201|Created|


## ListComments
Get task comments: Retrieve task comments for a specific list or a specific task. 

```GET: /task_comments``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|list_id|integer|yes|query|none|List ID|
|task_id|integer|no|query|none|Task ID|

#### Response

|Name|Description|
|---|---|
|200|Operation successful|
|400|Bad Request|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed.|


## CreateComment
Add a comment to a task: Add a comment to a specific task 

```POST: /task_comments``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|post| |yes|body|none|New task comment to be created|

#### Response

|Name|Description|
|---|---|
|201|Created|


## RetrieveReminders
Get reminders: Retrieve reminders for a specific list or a specific task. 

```GET: /reminders``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|list_id|integer|yes|query|none|List ID|
|task_id|integer|no|query|none|Task ID|

#### Response

|Name|Description|
|---|---|
|200|Operation successful|
|400|Bad Request|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed.|


## CreateReminder
Set a reminder: Set a reminder. 

```POST: /reminders``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|post| |yes|body|none|New reminder to be created|

#### Response

|Name|Description|
|---|---|
|200|Operation successful|
|default|Operation Failed.|


## RetrieveFiles
Get files: Retrieve files for a specific list or a specific task. 

```GET: /files``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|list_id|integer|yes|query|none|List ID|
|task_id|integer|no|query|none|Task ID|

#### Response

|Name|Description|
|---|---|
|200|Operation successful|
|400|Bad Request|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed.|


## GetList
Get list: Retrieves a specific list 

```GET: /lists/{id}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|string|yes|path|none|List ID|

#### Response

|Name|Description|
|---|---|
|200|OK|


## DeleteList
Delete list: Deletes a list 

```DELETE: /lists/{id}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|integer|yes|path|none|List ID|
|revision|integer|yes|query|none|Revision|

#### Response

|Name|Description|
|---|---|
|204|No Content|


## UpdateList
Update a list: Update a specific list 

```PATCH: /lists/{id}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|integer|yes|path|none|List ID|
|post| |yes|body|none|List details|

#### Response

|Name|Description|
|---|---|
|200|OK|


## GetTask
Get task: Retrieves a specific task 

```GET: /tasks/{id}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|list_id|integer|yes|query|none|List ID|
|id|integer|yes|path|none|Task ID|

#### Response

|Name|Description|
|---|---|
|200|OK|


## UpdateTask
Update a task: Updates a specific task 

```PATCH: /tasks/{id}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|list_id|integer|yes|query|none|List ID|
|id|integer|yes|path|none|Task ID|
|post| |yes|body|none|Task details|

#### Response

|Name|Description|
|---|---|
|200|OK|


## DeleteTask
Delete task: Deletes a specific task 

```DELETE: /tasks/{id}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|list_id|integer|yes|query|none|List ID|
|id|integer|yes|path|none|Task ID|
|revision|integer|yes|query|none|Revision|

#### Response

|Name|Description|
|---|---|
|204|No Content|


## GetSubTask
Get subtask: Retrieves a specific subtask 

```GET: /subtasks/{id}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|string|yes|path|none|Subtask ID|

#### Response

|Name|Description|
|---|---|
|200|OK|


## UpdateSubTask
Update a subtask: Updates a specific subtask 

```PATCH: /subtasks/{id}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|integer|yes|path|none|Subtask ID|
|post| |yes|body|none|Subtask details|

#### Response

|Name|Description|
|---|---|
|200|OK|


## DeleteSubTask
Delete a subtask: Deletes a specific subtask 

```DELETE: /subtasks/{id}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|integer|yes|path|none|Subtask ID|
|revision|integer|yes|query|none|Revision|

#### Response

|Name|Description|
|---|---|
|204|No Content|


## GetNote
Get a note: Retrieve a specific note 

```GET: /notes/{id}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|string|yes|path|none|Note ID|

#### Response

|Name|Description|
|---|---|
|200|OK|


## UpdateNote
Update a note: Update a specific note 

```PATCH: /notes/{id}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|integer|yes|path|none|Note ID|
|post| |yes|body|none|Note details|

#### Response

|Name|Description|
|---|---|
|200|OK|


## DeleteNote
Delete a note: Delete a specific note 

```DELETE: /notes/{id}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|integer|yes|path|none|Note ID|
|revision|integer|yes|query|none|Revision|

#### Response

|Name|Description|
|---|---|
|204|No Content|


## GetComment
Get task comment: Retrieve a specific task comment 

```GET: /task_comments/{id}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|string|yes|path|none|Comment ID|

#### Response

|Name|Description|
|---|---|
|200|OK|


## UpdateReminder
Update a reminder: Update a specific reminder 

```PATCH: /reminders/{id}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|integer|yes|path|none|Reminder ID|
|post| |yes|body|none|Reminder details|

#### Response

|Name|Description|
|---|---|
|200|OK|


## DeleteReminder
Delete a reminder: Delete a specific reminder 

```DELETE: /reminders/{id}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|integer|yes|path|none|ID of the reminder.|
|revision|integer|yes|query|none|Revision|

#### Response

|Name|Description|
|---|---|
|204|No Content|


## Object definitions 

### List


| Property Name | Data Type | Required |
|---|---|---|
|id|integer|No |
|created_at|string|No |
|title|string|No |
|list_type|string|No |
|type|string|No |
|revision|integer|No |



### CreatedList


| Property Name | Data Type | Required |
|---|---|---|
|id|integer|No |
|created_at|string|No |
|title|string|No |
|revision|integer|No |
|type|string|No |



### Task


| Property Name | Data Type | Required |
|---|---|---|
|id|integer|No |
|assignee_id|integer|No |
|assigner_id|integer|No |
|created_at|string|No |
|created_by_id|integer|No |
|due_date|string|No |
|list_id|integer|No |
|revision|integer|No |
|starred|boolean|No |
|title|string|No |



### Subtask


| Property Name | Data Type | Required |
|---|---|---|
|id|integer|No |
|task_id|integer|No |
|created_at|string|No |
|created_by_id|integer|No |
|revision|string|No |
|title|string|No |



### Note


| Property Name | Data Type | Required |
|---|---|---|
|id|integer|No |
|task_id|integer|No |
|content|string|No |
|created_at|string|No |
|updated_at|string|No |
|revision|integer|No |



### Comment


| Property Name | Data Type | Required |
|---|---|---|
|id|integer|No |
|task_id|integer|No |
|revision|integer|No |
|text|string|No |
|type|string|No |
|created_at|string|No |



### Reminder


| Property Name | Data Type | Required |
|---|---|---|
|id|integer|No |
|date|string|No |
|task_id|integer|No |
|revision|integer|No |
|type|string|No |
|created_at|string|No |
|updated_at|string|No |



### CreatedReminder


| Property Name | Data Type | Required |
|---|---|---|
|id|integer|No |
|date|string|No |
|task_id|integer|No |
|revision|integer|No |
|created_at|string|No |
|updated_at|string|No |



### File


| Property Name | Data Type | Required |
|---|---|---|
|id|integer|No |
|url|string|No |
|task_id|integer|No |
|list_id|integer|No |
|user_id|integer|No |
|file_name|string|No |
|content_type|string|No |
|file_size|integer|No |
|local_created_at|string|No |
|created_at|string|No |
|updated_at|string|No |
|type|string|No |
|revision|integer|No |



### NewTask


| Property Name | Data Type | Required |
|---|---|---|
|list_id|integer|Yes |
|title|string|Yes |
|assignee_id|integer|No |
|completed|boolean|No |
|recurrence_type|string|No |
|recurrence_count|integer|No |
|due_date|string|No |
|starred|boolean|No |



### NewList


| Property Name | Data Type | Required |
|---|---|---|
|title|string|Yes |



### NewSubtask


| Property Name | Data Type | Required |
|---|---|---|
|list_id|integer|Yes |
|task_id|integer|Yes |
|title|string|Yes |
|completed|boolean|No |



### NewNote


| Property Name | Data Type | Required |
|---|---|---|
|list_id|integer|Yes |
|task_id|integer|Yes |
|content|string|Yes |



### NewComment


| Property Name | Data Type | Required |
|---|---|---|
|list_id|integer|Yes |
|task_id|integer|Yes |
|text|string|Yes |



### NewReminder


| Property Name | Data Type | Required |
|---|---|---|
|list_id|integer|Yes |
|task_id|integer|Yes |
|date|string|Yes |



### UpdateTask


| Property Name | Data Type | Required |
|---|---|---|
|revision|integer|No |
|title|string|No |
|assignee_id|integer|No |
|completed|boolean|No |
|recurrence_type|string|No |
|recurrence_count|integer|No |
|due_date|string|No |
|starred|boolean|No |



### UpdateList


| Property Name | Data Type | Required |
|---|---|---|
|revision|integer|No |
|title|string|No |



### UpdateSubtask


| Property Name | Data Type | Required |
|---|---|---|
|revision|integer|No |
|title|string|No |
|completed|boolean|No |



### UpdateNote


| Property Name | Data Type | Required |
|---|---|---|
|revision|integer|No |
|content|string|No |



### UpdateReminder


| Property Name | Data Type | Required |
|---|---|---|
|date|string|No |
|revision|integer|No |


## Next Steps
[Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md)