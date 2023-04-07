---
title: include file
description: Attachments .NET SDK include file
author: natekimball-msft
manager: koagbakp
services: azure-communication-services
ms.author: natekimball
ms.date: 04/07/2023
ms.topic: include
ms.service: azure-communication-services
---

## Send an email message with attachments

We can add an attachment by defining an EmailAttachment object and adding it to our EmailMessage object. Read the attachment file and encode it using Base64.

```csharp

var filePath = "C:\Users\Documents\attachment.pdf";
byte[] bytes = File.ReadAllBytes(filePath);
var contentBinaryData = new BinaryData(bytes);
var emailAttachment = new EmailAttachment("attachment.pdf", MediaTypeNames.Application.Pdf, contentBinaryData);
emailMessage.Attachments.Add(emailAttachment);

```

For more information on acceptable MIME types for email attachments, see the [allowed MIME types](../../../../concepts/email/email-attachment-allowed-mime-types.md) documentation.

You can download the sample app demonstrating this action from [GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/SendEmailAdvanced/SendEmailWithAttachments)
