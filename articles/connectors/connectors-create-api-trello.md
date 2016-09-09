<properties
pageTitle="Trello | Microsoft Azure"
description="Create Logic apps with Azure App service. Trello gives you perspective over all your projects, at work and at home.  It is an easy, free, flexible, and visual way to manage your projects and organize anything.  Connect to Trello to manage your boards, lists and cards"
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
ms.date="05/18/2016"
ms.author="deonhe"/>

# Get started with the Trello connector



The Trello connector can be used from:  

- [Logic apps](../app-service-logic/app-service-logic-what-are-logic-apps.md)  
- [PowerApps](http://powerapps.microsoft.com)  
- [Flow](http://flows.microsoft.com)  

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version. 

You can get started by creating a Logic app now, see [Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

## Triggers and actions

The Trello connector can be used as an action; it has trigger(s). All connectors support data in JSON and XML formats. 

 The Trello connector has the following action(s) and/or trigger(s) available:

### Trello actions
You can take these action(s):

|Action|Description|
|--- | ---|
|[ListCards](connectors-create-api-trello.md#listcards)|List cards in board|
|[GetCard](connectors-create-api-trello.md#getcard)|Get card by id|
|[UpdateCard](connectors-create-api-trello.md#updatecard)|Update card|
|[DeleteCard](connectors-create-api-trello.md#deletecard)|Delete card|
|[CreateCard](connectors-create-api-trello.md#createcard)|Creates a new card in your trello account|
|[ListBoards](connectors-create-api-trello.md#listboards)|List boards|
|[GetBoard](connectors-create-api-trello.md#getboard)|Gets board by Id|
|[ListLists](connectors-create-api-trello.md#listlists)|List card lists in board|
|[GetList](connectors-create-api-trello.md#getlist)|Gets list by Id|
### Trello triggers
You can listen for these event(s):

|Trigger | Description|
|--- | ---|
|When a new card is added to a board|Triggers a flow when a new card is added to a board|
|When a new card is added to a list|Triggers a flow when a new card is added to a list|


## Create a connection to Trello
To create Logic apps with Trello, you must first create a **connection** then provide the details for the following properties: 

|Property| Required|Description|
| ---|---|---|
|Token|Yes|Provide Trello Credentials|
After you create the connection, you can use it to execute the actions and listen for the triggers described in this article. 

>[AZURE.INCLUDE [Steps to create a connection to Trello](../../includes/connectors-create-api-trello.md)]

>[AZURE.TIP] You can use this connection in other logic apps.

## Reference for Trello
Applies to version: 1.0

## OnNewCardInBoard
When a new card is added to a board: Triggers a flow when a new card is added to a board 

```GET: /trigger/boards/{board_id}/cards``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|board_id|string|yes|path|none|Unique id of the board to fetch cards in|

#### Response

|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed|


## OnNewCardInList
When a new card is added to a list: Triggers a flow when a new card is added to a list 

```GET: /trigger/lists/{list_id}/cards``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|board_id|string|yes|query|none|Unique id of the board to fetch cards in|
|list_id|string|yes|path|none|Unique id of the list to fetch cards in|

#### Response

|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed|


## ListCards
List cards in board: List cards in board 

```GET: /boards/{board_id}/cards``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|board_id|string|yes|path|none|Id of the board to fetch all the cards|
|actions|string|no|query|none|List the actions to return. Specify 'all' or a comma seperated list of valid values|
|attachments|boolean|no|query|none|Show attachments|
|attachment_fields|string|no|query|none|List the attachment fields to return. Specify 'all' or a comma seperated list of valid values|
|stickers|boolean|no|query|none|Show stickers|
|members|boolean|no|query|none|Show members|
|memeber_fields|string|no|query|none|List the member fields to return. Specify 'all' or a comma seperated list of valid values|
|CheckItemStates|boolean|no|query|none|Return the card states|
|Checklists|string|no|query|none|Show checklists|
|limit|integer|no|query|none|The max number of results to return, between 1 and 1000|
|since|string|no|query|none|Fetch all cards after this date|
|before|string|no|query|none|Fetch all cards before this date|
|filter|string|no|query|none|Filter the response|
|fields|string|no|query|none|List the card fields to return. Specify 'all' or a comma seperated list of valid values|

#### Response

|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed|


## GetCard
Get card by id: Get card by id 

```GET: /cards/{card_id}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|board_id|string|yes|query|none|Id of the board to fetch cards in|
|card_id|string|yes|path|none|Id of the card to fetch|
|actions|string|no|query|none|List the actions to return. Specify 'all' or a comma seperated list of valid values|
|actions_entities|boolean|no|query|none|Return action entities|
|actions_display|boolean|no|query|none|Return action displays|
|actions_limit|integer|no|query|none|Max number of actions to return|
|action_fields|string|no|query|none|List of action fields to return for each action. Specify 'all' or a comma seperated list of valid values|
|action_memberCreator_fields|string|no|query|none|List of action member creator fields to return. Specify 'all' or a comma seperated list of valid values|
|attachments|boolean|no|query|none|Return attachments|
|attachement_fields|string|no|query|none|List of attachment fields to return for each attachment. Specify 'all' or a comma seperated list of valid values|
|members|boolean|no|query|none|Return members|
|member_fields|string|no|query|none|List of member fields to return for each member. Specify 'all' or a comma seperated list of valid values|
|membersVoted|boolean|no|query|none|Return voted members|
|memberVoted_fields|string|no|query|none|List of voted member fields to return for each voted member. Specify 'all' or a comma seperated list of valid values|
|checkItemStates|boolean|no|query|none|Return card states|
|checkItemState_fields|string|no|query|none|List of state fields to return for each of the card item state. Specify 'all' or a comma seperated list of valid values|
|checklists|string|no|query|none|Return checklists|
|checklist_fields|string|no|query|none|List of checklist fields to return for each checklist. Specify 'all' or a comma seperated list of valid values|
|board|boolean|no|query|none|Return the board which the card belongs to|
|board_fields|string|no|query|none|List the board fields to return. Specify 'all' or a comma seperated list of valid values|
|list|boolean|no|query|none|Return the list which the card belongs to|
|list_fields|string|no|query|none|List the list fields to return. Specify 'all' or a comma seperated list of valid values|
|stickers|boolean|no|query|none|Return stickers|
|sticker_fields|string|no|query|none|List the sticker fields to return for each sticker. Specify 'all' or a comma seperated list of valid values|
|fields|string|no|query|none|List the card fields to return. Specify 'all' or a comma seperated list of valid values|

#### Response

|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed|


## UpdateCard
Update card: Update card 

```PUT: /cards/{card_id}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|board_id|string|yes|query|none|Id of the board to fetch cards from|
|card_id|string|yes|path|none|Id of the card to update|
|updateCard| |yes|body|none|Updated card values|

#### Response

|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed|


## DeleteCard
Delete card: Delete card 

```DELETE: /cards/{card_id}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|board_id|string|yes|query|none|Id of the board to fetch cards from|
|card_id|string|yes|path|none|Id of the card to delete|

#### Response

|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed|


## CreateCard
Create card: Creates a new card in your trello account 

```POST: /cards``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|board_id|string|yes|query|none|Unique id of the board to create cards in|
|newCard| |yes|body|none|New card to add to the trello board|

#### Response

|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed|


## ListBoards
List boards: List boards 

```GET: /member/me/boards``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|filter|string|no|query|none|List filters to apply to board results. Specify 'all' or a comma seperated list of valid values|
|fields|string|no|query|none|List the board fields to return. Specify 'all' or a comma seperated list of valid values|
|actions|string|no|query|none|List the action fields to return. Specify 'all' or a comma seperated list of valid values|
|actions_entities|boolean|no|query|none|Return action entities|
|actions_limit|integer|no|query|none|Max number of actions to return|
|actions_format|string|no|query|none|Specify the format of the actions to return|
|actions_since|string|no|query|none|Return actions after the specified date|
|action_fields|string|no|query|none|List the fields of the action to return. Specify 'all' or a comma seperated list of valid values|
|memberships|string|no|query|none|Specify membership information to return. Specify 'all' or a comma seperated list of valid values|
|organization|boolean|no|query|none|Specify to return organization information|
|organization_fields|string|no|query|none|List the organization fields to return. Specify 'all' or a comma seperated list of valid values|
|lists|string|no|query|none|Specify whether to return lists which belong to the board|

#### Response

|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed|


## GetBoard
Gets board by Id: Gets board by Id 

```GET: /boards/{board_id}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|board_id|string|yes|path|none|Unique id of the board to get|
|actions|string|no|query|none|List the actions to return. Specify 'all' or a comma seperated list of valid values|
|action_entities|boolean|no|query|none|Specify whether to return action entities|
|actions_display|boolean|no|query|none|Specify whether to return actions display|
|actions_format|string|no|query|none|Specify the format of the actions to return|
|actions_since|string|no|query|none|Only return the actions after this date|
|actions_limit|integer|no|query|none|Max number of actions to return|
|action_fields|string|no|query|none|List the fields to return with each field. Specify 'all' or a comma seperated list of valid values|
|action_memeber|boolean|no|query|none|Specify whether to return action members|
|action_member_fields|string|no|query|none|List the member fields to return with each action member. Specify 'all' or a comma seperated list of valid values|
|action_memberCreator|boolean|no|query|none|Specify whether to return action member creator|
|action_memberCreator_fields|string|no|query|none|List the action member creator fields to return. Specify 'all' or a comma seperated list of valid values|
|cards|string|no|query|none|Specify the cards to return|
|card_fields|string|no|query|none|List the fields to return for each card. Specify 'all' or a comma seperated list of valid values|
|card_attachments|boolean|yes|query|none|Specify whether to return attachments on cards|
|card_attachment_fields|string|no|query|none|List the attachment fields to return for each attachment. Specify 'all' or a comma seperated list of valid values|
|card_checklists|string|no|query|none|Specify the checklists to return for each card|
|card_stickers|boolean|no|query|none|Specify whether to return card stickers|
|boardStarts|string|no|query|none|Specify the board stars to return|
|labels|string|no|query|none|Specify the labels to return|
|label_fields|string|no|query|none|List the label fields to return for each label. Specify 'all' or a comma seperated list of valid values|
|labels_limits|integer|no|query|none|Max number of labels to return|
|lists|string|no|query|none|Specify the lists to return|
|list_fields|string|no|query|none|List the list fields to return for each list. Specify 'all' or a comma seperated list of valid values|
|memberships|string|no|query|none|List the memberships to return. Specify 'all' or a comma seperated list of valid values|
|memberships_member|boolean|no|query|none|Specify whether to return membership members|
|memberships_member_fields|string|no|query|none|List the member fields to return for each membership member. Specify 'all' or a comma seperated list of valid values|
|members|string|no|query|none|List the members to return|
|member_fields|string|no|query|none|List the member fields to return for each member. Specify 'all' or a comma seperated list of valid values|
|membersInvited|string|no|query|none|Specify the invited members to return|
|membersInvited_fields|string|no|query|none|List the fields to return for each. Specify 'all' or a comma seperated list of valid values|
|checklists|string|no|query|none|Specify the checklists to return|
|checklist_fields|string|no|query|none|List the checklist fields to return for each checklist. Specify 'all' or a comma seperated list of valid values|
|organization|boolean|no|query|none|Specify whether to return the organization information|
|organization_fields|string|no|query|none|List the organization fields to return for each organization. Specify 'all' or a comma seperated list of valid values|
|organization_memberships|string|no|query|none|List the organization memberships to return. Specify 'all' or a comma seperated list of valid values|
|myPerfs|boolean|no|query|none|Specify whether to return my perfs|
|fields|string|no|query|none|List the fields to return. Specify 'all' or a comma seperated list of valid values|

#### Response

|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed|


## ListLists
List card lists in board: List card lists in board 

```GET: /boards/{board_id}/lists``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|board_id|string|yes|path|none|Unique id of the board to fetch lists|
|cards|string|no|query|none|Specify the cards to return|
|card_fields|string|no|query|none|List the card fields to return from. Specify 'all' or a comma seperated list of valid values|
|filter|string|no|query|none|Specify the filter property for lists|
|fields|string|no|query|none|List the fields to return. Specify 'all' or a comma seperated list of valid values|

#### Response

|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed|


## GetList
Gets list by Id: Gets list by Id 

```GET: /lists/{list_id}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|board_id|string|yes|query|none|Unique id of the board to fetch the lists from|
|list_id|string|yes|path|none|Unique id of the list to fetch|
|cards|string|no|query|none|Specify the cards to return|
|card_fields|string|no|query|none|List the card fields to return for each card. Specify 'all' or a comma seperated list of valid values|
|board|boolean|no|query|none|Specify whether to return board information|
|board_fields|string|no|query|none|List the board fields to return. Specify 'all' or a comma seperated list of valid values|
|fields|string|no|query|none|List the list fields to return. Specify 'all' or a comma seperated list of valid values|

#### Response

|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed|


## Object definitions 

### Card


| Property Name | Data Type | Required |
|---|---|---|
|id|string|No |
|checkItemStates|array|No |
|closed|boolean|No |
|dateLastActivity|string|No |
|desc|string|No |
|idBoard|string|No |
|idList|string|No |
|idMembersVoted|array|No |
|idShort|integer|No |
|idAttachmentCover|string|No |
|manualCoverAttachment|boolean|No |
|idLabels|array|No |
|name|string|No |
|pos|integer|No |
|shortLink|string|No |
|badges|not defined|No |
|due|string|No |
|email|string|No |
|shortUrl|string|No |
|subscribed|boolean|No |
|url|string|No |



### Badges


| Property Name | Data Type | Required |
|---|---|---|
|Votes|integer|No |
|ViewingMemberVoted|boolean|No |
|Subscribed|boolean|No |
|Fogbugz|string|No |
|CheckItems|integer|No |
|CheckItemsChecked|integer|No |
|Comments|integer|No |
|Attachments|integer|No |
|Description|boolean|No |
|Due|string|No |



### Object


| Property Name | Data Type | Required |
|---|---|---|



### CreateCard


| Property Name | Data Type | Required |
|---|---|---|
|idList|string|Yes |
|name|string|Yes |
|desc|string|No |
|pos|string|No |
|idMembers|string|No |
|idLabels|string|No |
|urlSource|string|No |
|fileSource|string|No |
|idCardSource|string|No |
|keepFromSource|string|No |



### UpdateCard


| Property Name | Data Type | Required |
|---|---|---|
|name|string|No |
|desc|string|No |
|closed|boolean|No |
|idMembers|string|No |
|idAttachmentCover|string|No |
|idList|string|No |
|idBoard|string|No |
|pos|string|No |
|due|string|No |
|subscribed|boolean|No |



### Board


| Property Name | Data Type | Required |
|---|---|---|
|id|string|No |
|closed|boolean|No |
|dateLastActivity|string|No |
|dateLastView|string|No |
|desc|string|No |
|idOrganization|string|No |
|invitations|array|No |
|invited|boolean|No |
|labelNames|not defined|No |
|memberships|array|No |
|name|string|No |
|pinned|boolean|No |
|powerUps|array|No |
|perfs|not defined|No |
|shortLink|string|No |
|shortUrl|string|No |
|starred|string|No |
|subscribed|string|No |
|url|string|No |



### Label


| Property Name | Data Type | Required |
|---|---|---|
|green|string|No |
|yellow|string|No |
|orange|string|No |
|red|string|No |
|purple|string|No |
|blue|string|No |
|sky|string|No |
|lime|string|No |
|pink|string|No |
|black|string|No |



### Membership


| Property Name | Data Type | Required |
|---|---|---|
|id|string|No |
|idMember|string|No |
|memberType|string|No |
|unconfirmed|boolean|No |



### Perfs


| Property Name | Data Type | Required |
|---|---|---|
|permissionLevel|string|No |
|voting|string|No |
|comments|string|No |
|invitations|string|No |
|selfJoin|boolean|No |
|cardCovers|boolean|No |
|calendarFeedEnabled|boolean|No |
|background|string|No |
|backgroundColor|string|No |
|backgroundImage|string|No |
|backgroundImageScaled|string|No |
|backgroundTile|boolean|No |
|backgroundBrightness|string|No |
|canBePublic|boolean|No |
|canBeOrg|boolean|No |
|canBePrivate|boolean|No |
|canInvite|boolean|No |



### List


| Property Name | Data Type | Required |
|---|---|---|
|id|string|No |
|name|string|No |
|closed|boolean|No |
|idBoard|string|No |
|pos|number|No |
|subscribed|boolean|No |
|cards|array|No |
|board|not defined|No |


## Next Steps
[Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md)