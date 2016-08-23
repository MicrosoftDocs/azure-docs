<properties
pageTitle="MailChimp | Microsoft Azure"
description="Create Logic apps with Azure App service. MailChimp is a SaaS service that allows businesses to manage and automate email marketing activities, including sending marketing emails, automated messages and targeted campaigns."
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

# Get started with the MailChimp connector



The MailChimp connector can be used from:  

- [Logic apps](../app-service-logic/app-service-logic-what-are-logic-apps.md)  
- [PowerApps](http://powerapps.microsoft.com)  
- [Flow](http://flows.microsoft.com)  

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version. 

You can get started by creating a Logic app now, see [Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

## Triggers and actions

The MailChimp connector can be used as an action; it has trigger(s). All connectors support data in JSON and XML formats. 

 The MailChimp connector has the following action(s) and/or trigger(s) available:

### MailChimp actions
You can take these action(s):

|Action|Description|
|--- | ---|
|[newcampaign](connectors-create-api-mailchimp.md#newcampaign)|Create a new campaign based on a Campaign Type, Recipients list and Campaign Settings (subject line, title, from_name and reply_to)|
|[newlist](connectors-create-api-mailchimp.md#newlist)|Create a new list in your MailChimp account|
|[addmember](connectors-create-api-mailchimp.md#addmember)|Add or update a list member|
|[removemember](connectors-create-api-mailchimp.md#removemember)|Delete a member from a list.|
|[updatemember](connectors-create-api-mailchimp.md#updatemember)|Update information for a specific list member|
### MailChimp triggers
You can listen for these event(s):

|Trigger | Description|
|--- | ---|
|When a Member has been added to a list|Triggers a workflow when a new member has been added to a list|
|When a new list is created|Triggers a workflow when a new list is created|


## Create a connection to MailChimp
To create Logic apps with MailChimp, you must first create a **connection** then provide the details for the following properties: 

|Property| Required|Description|
| ---|---|---|
|Token|Yes|Provide MailChimp Credentials|

>[AZURE.INCLUDE [Steps to create a connection to MailChimp](../../includes/connectors-create-api-mailchimp.md)]

>[AZURE.TIP] You can use this connection in other logic apps.

## Reference for MailChimp
Applies to version: 1.0

## newcampaign
New Campaign: Create a new campaign based on a Campaign Type, Recipients list and Campaign Settings (subject line, title, from_name and reply_to) 

```POST: /campaigns``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|newCampaignRequest| |yes|body|none|Json object to send in the body with the new campaign request parameters|

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


## newlist
New List: Create a new list in your MailChimp account 

```POST: /lists``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|newListRequest| |yes|body|none|Json object to send in the body with the new campaign request parameters|

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


## addmember
Add member to list: Add or update a list member 

```POST: /lists/{list_id}/members``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|list_id|string|yes|path|none|The unique id for the list|
|newMemberInList| |yes|body|none|Json object to send in the body with the new member information|

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


## removemember
Remove Member from list: Delete a member from a list. 

```DELETE: /lists/replacemailwithhash/{list_id}/members/{member_email}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|list_id|string|yes|path|none|The unique id for the list|
|member_email|string|yes|path|none|The email address of the member to delete|

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


## updatemember
Update member information: Update information for a specific list member 

```PATCH: /lists/replacemailwithhash/{list_id}/members/{member_email}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|list_id|string|yes|path|none|The unique id for the list|
|member_email|string|yes|path|none|The unique email address of the member to update|
|updateMemberInListRequest| |yes|body|none|Json object to send in the body with the updated member information|

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


## OnMemberSubscribed
When a Member has been added to a list: Triggers a workflow when a new member has been added to a list 

```GET: /trigger/lists/{list_id}/members``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|list_id|string|yes|path|none|The unique id for the list|

#### Response

|Name|Description|
|---|---|
|200|OK|
|202|Accepted|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed.|


## OnCreateList
When a new list is created: Triggers a workflow when a new list is created 

```GET: /trigger/lists``` 

There are no parameters for this call
#### Response

|Name|Description|
|---|---|
|200|OK|
|202|Accepted|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed.|


## Object definitions 

### NewCampaignRequest


| Property Name | Data Type | Required |
|---|---|---|
|type|string|Yes |
|recipients|not defined|Yes |
|settings|not defined|Yes |
|variate_settings|not defined|No |
|tracking|not defined|No |
|rss_opts|not defined|No |
|social_card|not defined|No |



### Recipient


| Property Name | Data Type | Required |
|---|---|---|
|list_id|string|Yes |
|segment_opts|not defined|No |



### Settings


| Property Name | Data Type | Required |
|---|---|---|
|subject_line|string|Yes |
|title|string|No |
|from_name|string|Yes |
|reply_to|string|Yes |
|use_conversation|boolean|No |
|to_name|string|No |
|folder_id|integer|No |
|authenticate|boolean|No |
|auto_footer|boolean|No |
|inline_css|boolean|No |
|auto_tweet|boolean|No |
|auto_fb_post|array|No |
|fb_comments|boolean|No |



### Variate_Settings


| Property Name | Data Type | Required |
|---|---|---|
|winner_criteria|string|No |
|wait_time|integer|No |
|test_size|integer|No |
|subject_lines|array|No |
|send_times|array|No |
|from_names|array|No |
|reply_to_addresses|array|No |



### Tracking


| Property Name | Data Type | Required |
|---|---|---|
|opens|boolean|No |
|html_clicks|boolean|No |
|text_clicks|boolean|No |
|goal_tracking|boolean|No |
|ecomm360|boolean|No |
|google_analytics|string|No |
|clicktale|string|No |
|salesforce|not defined|No |
|highrise|not defined|No |
|capsule|not defined|No |



### RSS_Opts


| Property Name | Data Type | Required |
|---|---|---|
|feed_url|string|No |
|frequency|string|No |
|constrain_rss_img|string|No |
|schedule|not defined|No |



### Social_Card


| Property Name | Data Type | Required |
|---|---|---|
|image_url|string|No |
|description|string|No |
|title|string|No |



### Segment_Opts


| Property Name | Data Type | Required |
|---|---|---|
|saved_segment_id|integer|No |
|match|string|No |



### Salesforce


| Property Name | Data Type | Required |
|---|---|---|
|campaign|boolean|No |
|notes|boolean|No |



### Highrise


| Property Name | Data Type | Required |
|---|---|---|
|campaign|boolean|No |
|notes|boolean|No |



### Capsule


| Property Name | Data Type | Required |
|---|---|---|
|notes|boolean|No |



### Schedule


| Property Name | Data Type | Required |
|---|---|---|
|hour|integer|No |
|daily_send|not defined|No |
|weekly_send_day|string|No |
|monthly_send_date|number|No |



### Daily_Send


| Property Name | Data Type | Required |
|---|---|---|
|sunday|boolean|No |
|monday|boolean|No |
|tuesday|boolean|No |
|wednesday|boolean|No |
|thursday|boolean|No |
|friday|boolean|No |
|saturday|boolean|No |



### CampaignResponseModel


| Property Name | Data Type | Required |
|---|---|---|
|id|string|No |
|type|string|No |
|create_time|string|No |
|archive_url|string|No |
|status|string|No |
|emails_sent|integer|No |
|send_time|string|No |
|content_type|string|No |
|recipient|array|No |
|settings|not defined|No |
|variate_settings|not defined|No |
|tracking|not defined|No |
|rss_opts|not defined|No |
|ab_split_opts|not defined|No |
|social_card|not defined|No |
|report_summary|not defined|No |
|delivery_status|not defined|No |
|_links|array|No |



### AB_Split_Opts


| Property Name | Data Type | Required |
|---|---|---|
|split_test|string|No |
|pick_winner|string|No |
|wait_units|string|No |
|wait_time|integer|No |
|split_size|integer|No |
|from_name_a|string|No |
|from_name_b|string|No |
|reply_email_a|string|No |
|reply_email_b|string|No |
|subject_a|string|No |
|subject_b|string|No |
|send_time_a|string|No |
|send_time_b|string|No |
|send_time_winner|string|No |



### Report_Summary


| Property Name | Data Type | Required |
|---|---|---|
|opens|integer|No |
|unique_opens|integer|No |
|open_rate|number|No |
|clicks|integer|No |
|subscriber_clicks|number|No |
|click_rate|number|No |



### Delivery_Status


| Property Name | Data Type | Required |
|---|---|---|
|enabled|boolean|No |
|can_cancel|boolean|No |
|status|string|No |
|emails_sent|integer|No |
|emails_canceled|integer|No |



### Link


| Property Name | Data Type | Required |
|---|---|---|
|rel|string|No |
|href|string|No |
|method|string|No |
|targetSchema|string|No |
|schema|string|No |



### NewListRequest


| Property Name | Data Type | Required |
|---|---|---|
|name|string|Yes |
|contact|not defined|Yes |
|permission_reminder|string|Yes |
|use_archive_bar|boolean|No |
|campaign_defaults|not defined|Yes |
|notify_on_subscribe|string|No |
|notify_on_unsubscribe|string|No |
|email_type_option|boolean|Yes |
|visibility|string|No |



### Contact


| Property Name | Data Type | Required |
|---|---|---|
|company|string|Yes |
|address1|string|Yes |
|address2|string|No |
|city|string|Yes |
|state|string|Yes |
|zip|string|Yes |
|country|string|Yes |
|phone|string|Yes |



### Campaign_Defaults


| Property Name | Data Type | Required |
|---|---|---|
|from_name|string|Yes |
|from_email|string|Yes |
|subject|string|No |
|language|string|Yes |



### CreateNewListResponseModel


| Property Name | Data Type | Required |
|---|---|---|
|id|string|Yes |
|name|string|Yes |
|contact|not defined|Yes |
|permission_reminder|string|Yes |
|use_archive_bar|boolean|No |
|campaign_defaults|not defined|Yes |
|notify_on_subscribe|string|No |
|notify_on_unsubscribe|string|No |
|date_created|string|No |
|list_rating|integer|No |
|email_type_option|boolean|Yes |
|subscribe_url_short|string|No |
|subscribe_url_long|string|No |
|beamer_address|string|No |
|visibility|string|No |
|modules|array|No |
|stats|not defined|No |
|_links|array|No |



### Stats


| Property Name | Data Type | Required |
|---|---|---|
|member_count|integer|No |
|unsubscribe_count|integer|No |
|cleaned_count|integer|No |
|member_count_since_send|integer|No |
|unsubscribe_count_since_send|integer|No |
|cleaned_count_since_send|integer|No |
|campaign_count|integer|No |
|campaign_last_sent|integer|No |
|merge_field_count|integer|No |
|avg_sub_rate|number|No |
|avg_unsub_rate|number|No |
|target_sub_rate|number|No |
|open_rate|number|No |
|click_rate|number|No |
|last_sub_date|string|No |
|last_unsub_date|string|No |



### GetListsResponseModel


| Property Name | Data Type | Required |
|---|---|---|
|lists|array|No |
|total_items|integer|No |



### NewMemberInListRequest


| Property Name | Data Type | Required |
|---|---|---|
|email_type|string|No |
|status|string|Yes |
|merge_fields|not defined|No |
|interests|string|No |
|language|string|No |
|vip|boolean|No |
|location|not defined|No |
|email_address|string|Yes |



### FirstAndLastName


| Property Name | Data Type | Required |
|---|---|---|
|FNAME|string|No |
|LNAME|string|No |



### Location


| Property Name | Data Type | Required |
|---|---|---|
|latitude|number|No |
|longitude|number|No |



### MemberResponseModel


| Property Name | Data Type | Required |
|---|---|---|
|id|string|No |
|email_address|string|No |
|unique_email_id|string|No |
|email_type|string|No |
|status|string|No |
|merge_fields|not defined|No |
|interests|string|No |
|stats|not defined|No |
|ip_signup|string|No |
|timestamp_signup|string|No |
|ip_opt|string|No |
|timestamp_opt|string|No |
|member_rating|integer|No |
|last_changed|string|No |
|language|string|No |
|vip|boolean|No |
|email_client|string|No |
|location|not defined|No |
|last_note|not defined|No |
|list_id|string|No |
|_links|array|No |



### Last_Note


| Property Name | Data Type | Required |
|---|---|---|
|note_id|integer|No |
|created_at|string|No |
|created_by|string|No |
|note|string|No |



### GetAllMembersResponseModel


| Property Name | Data Type | Required |
|---|---|---|
|members|array|No |
|list_id|string|No |
|total_items|integer|No |



### Object


| Property Name | Data Type | Required |
|---|---|---|



### UpdateMemberInListRequest


| Property Name | Data Type | Required |
|---|---|---|
|email_address|string|No |
|email_type|string|No |
|status|string|Yes |
|merge_fields|not defined|No |
|interests|string|No |
|language|string|No |
|vip|boolean|No |
|location|not defined|No |



### GetMembersResponseModel


| Property Name | Data Type | Required |
|---|---|---|
|members|array|No |
|list_id|string|No |
|total_items|integer|No |



### AddUserResponseModel


| Property Name | Data Type | Required |
|---|---|---|
|id|string|Yes |
|email_address|string|Yes |
|unique_email_id|string|No |
|email_type|string|No |
|status|string|No |
|merge_fields|not defined|Yes |
|interests|string|No |
|stats|not defined|No |
|ip_signup|string|No |
|timestamp_signup|string|No |
|ip_opt|string|No |
|timestamp_opt|string|No |
|member_rating|integer|No |
|last_changed|string|No |
|language|string|No |
|vip|boolean|No |
|email_client|string|No |
|location|not defined|No |
|last_note|not defined|No |
|list_id|string|No |
|_links|array|No |


## Next Steps
[Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md)