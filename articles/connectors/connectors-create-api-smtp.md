<properties
	pageTitle="Add the SMTP API in your Logic Apps | Microsoft Azure"
	description="Overview of the SMTP API with REST API parameters"
	services=""
	documentationCenter="" 
	authors="MandiOhlinger"
	manager="erikre"
	editor=""
	tags="connectors"/>

<tags
   ms.service="multiple"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na" 
   ms.date="05/16/2016"
   ms.author="mandia"/>

# Get started with the SMTP API
Connect to an SMTP server to send email. The SMTP API can be used from:

- Logic apps (discussed in this topic)
- PowerApps (see the [PowerApps connections list](https://powerapps.microsoft.com/tutorials/connections-list/) for the complete list)

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version.

With SMTP, you can:

- Build your business flow that includes sending email using SMTP. 
- Use an action to send email. This action gets a response, and then makes the output available for other actions. For example, when there is a new file on your FTP server, you can take that file and email it as an attachment using SMTP. 

To add an operation in logic apps, see [Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

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

>[AZURE.TIP] You can use this same SMTP connection in other logic apps.

## Swagger REST API reference
Applies to version: 1.0.

### Send Email
Sends an email to one or more recipients.  
```POST: /SendEmail```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|emailMessage| many|yes|body|none |Email message|

## Object definitions

#### Email: SMTP email

| Name | Data Type | Required|
|---|---|---|
|To|string|no|
|CC|string|no|
|Subject|string|no|
|Body|string|no|
|From|string|no|
|IsHtml|boolean|no|
|Bcc|string|no|
|Importance|string|no|
|Attachments|array|no|


#### Attachment: Email attachment

| Name | Data Type |Required|
|---|---|---|
|FileName|string|no|
|ContentId|string|no|
|ContentData|string|yes|
|ContentType|string|yes|
|ContentTransferEncoding|string|yes|


## Next steps
[Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).
