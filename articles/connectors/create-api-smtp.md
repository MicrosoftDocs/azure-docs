<properties
	pageTitle="Use the SMTP API in your Logic Apps | Microsoft Azure"
	description="Overview of the SMTP API with REST API parameters"
	services=""
	documentationCenter="" 
	authors="MandiOhlinger"
	manager="dwrede"
	editor=""/>

<tags
   ms.service=""
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na" 
   ms.date="02/04/2016"
   ms.author="mandia"/>

# Get started with the SMTP API
Connect to an SMTP server to send email. 

The SMTP API can be used from logic apps.

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version. For the 2014-12-01-preview schema version, click [SMTP connector](..app-service-logic-connector-smtp.md).

With SMTP, you can:

- Build your business flow that includes sending email using SMTP. 
- Use an action to send email. This action gets a response, and then makes the output available for other actions. For example, when there is a new file on your FTP server, you can take that file and email it as an attachment using SMTP. 

To add an operation in logic apps, see [Create a logic app](..app-service-logic-create-a-logic-app.md).

## Triggers and actions
The SMTP API has the following action available. There are no triggers.

|Triggers | Actions|
|--- | ---|
|None | Send email|

All APIs support data in JSON and XML formats. 

## Create a connection to SMTP
When you add this API to your logic apps, enter the following values:

|Property| Required|Description|
| ---|---|---|
| SMTP Server Name | Yes | Enter the fully qualified domain (FQDN) or IP address of the SMTP server.|
| User name |Yes |Enter the user name to connect to the SMTP Server. |
| Password | Yes|Enter the user name's password. |

After you create the connection, you enter the SMTP properties, like the To or CC values. The **REST API reference** in this topic describes these properties.

>[AZURE.TIP] You can use this same SMTP server connection in other logic apps.

## Swagger REST API reference

### Send Email
Sends an email to one or more recipients.  
```POST: /SendEmail```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|emailMessage| many|yes|body|none |Email message|

#### Email object

| Name |Data Type |  Required | Description |
|---|---|---|---|
|To|string|no |Email address of recipient(s). Separate multiple email addresses using semicolon (;). Example: recipient1@domain.com;recipient2@domain.com.|
|CC|string|no |Email address of recipient(s) for carbon copy. Separate multiple email addresses using semicolon (;). Example: recipient1@domain.com;recipient2@domain.com.|
|Subject|string|no |Email subject|
|Body|string|no |Email body|
|From|string|no |Email address of sender. Example: sender@domain.com|
|IsHtml|boolean|no |When this property is set to true, the content of the body will be sent as HTML content.|
|Bcc|string|no |Email address of recipient(s) for blind carbon copy. Separate multiple email addresses using semicolon(;).Example: recipient1@domain.com;recipient2@domain.com.|
|Importance|string|no |Importance of the email ("High", "Normal", "Low")|
|Attachments|array|no |Attachments to be sent along with the email.|

#### Attachment object 

| Name |Data Type | Required | Description |
|---|---|---|---|
|FileName|string|no | File name of attachment
|ContentId|string|no | Content id
|ContentData|string|yes | Content data (base64 encoded for streams and as-is for string)
|ContentType|string|yes | Content type
|ContentTransferEncoding|string|yes | Content Transfer Encoding (base64 or none)

#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|

## Next steps
[Create a logic app](..app-service-logic-create-a-logic-app.md).
