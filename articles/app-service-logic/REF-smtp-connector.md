<properties
	pageTitle="Add the SMTP connector API to your Logic Apps | Microsoft Azure"
	description="Create or configure a new SMTP connector"
	services=""
	documentationCenter="" 
	authors="MandiOhlinger"
	manager="dwrede"
	editor=""/>

<tags
   ms.service="powerapps"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na" 
   ms.date="01/28/2016"
   ms.author="mandia"/>

# Get started with the SMTP connector

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version. For the 2014-12-01-preview schema version of this connector, click [SMTP connector](..app-service-logic-connector-smtp.md).

Connect to an SMTP server to send email. 

>[AZURE.TIP] "Connector" and "API" are used interchangeably.

With the SMTP connector, you can:

- Add the SMTP connector to your logic app, and build your business flow that includes sending email using SMTP. 
- Use an action to send email. This action gets a response, and then makes the output available for other actions in the logic app to use. For example, when there is a new file on your FTP server, you can take that file and email it as an attachment using SMTP. 

This topic focuses on the SMTP triggers and actions available, creating a connection to SMTP, and also lists the REST API parameters. 

Need help creating a logic app? See [Create a logic app](..app-service-logic-create-a-logic-app.md).

## Triggers and actions
The SMTP connector can be used as an action; there are no triggers. All connectors support data in JSON and XML formats. The SMTP connector has the following action available:

|Triggers | Actions|
|--- | ---|
|None | Send email|

## Create a connection to SMTP
To use the SMTP connector, you first create a connection to the SMTP server. When you create the connection, enter the following SMTP server properties: 

|Property| Required|Description|
| ---|---|---|
| SMTP Server Name | Yes | Enter the fully qualified domain (FQDN) or IP address of the SMTP server.|
| User name |Yes |Enter the user name to connect to the SMTP Server. |
| Password | Yes|Enter the user name's password. |

After you create the connection, you enter the SMTP properties, like the To or CC values. For a description of these properties, see the **REST API reference** in this topic. 

>[AZURE.TIP] You can use this same SMTP server connection in other logic apps.

## Swagger REST API reference

### Send Email
Sends an email to one or more recipients.  
```POST: /SendEmail```

| Name|Data Type|Required|Located In|Description|
| ---|---|---|---|---|
|emailMessage| |Yes|body|Email message|

**Uses an Email object**: 

| Name | Type |  Required | Description |
|---|---|---|---|
|To|string|No |Email address of recipient(s). Separate multiple email addresses using semicolon (;). Example: recipient1@domain.com;recipient2@domain.com.|
|CC|string|No |Email address of recipient(s) for carbon copy. Separate multiple email addresses using semicolon (;). Example: recipient1@domain.com;recipient2@domain.com.|
|Subject|string|No |Email subject|
|Body|string|No |Email body|
|From|string|No |Email address of sender. Example: sender@domain.com|
|IsHtml|boolean|No |When this property is set to true, the content of the body will be sent as HTML content.|
|Bcc|string|No |Email address of recipient(s) for blind carbon copy. Separate multiple email addresses using semicolon(;).Example: recipient1@domain.com;recipient2@domain.com.|
|Importance|string|No |Importance of the email ("High", "Normal", "Low")|
|Attachments|array|No |Attachments to be sent along with the email.|

**Uses an Attachment object**: 

| Name | Type | Required | Description |
|---|---|---|---|
|FileName|string|No | File name of attachment
|ContentId|string|No | Content id
|ContentData|string|Yes | Content data (base64 encoded for streams and as-is for string)
|ContentType|string|Yes | Content type
|ContentTransferEncoding|string|Yes | Content Transfer Encoding (base64 or none)

#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|

