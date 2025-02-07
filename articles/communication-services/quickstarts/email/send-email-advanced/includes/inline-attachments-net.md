---
title: include file
description: Inline Attachments .NET SDK include file
author: natekimball-msft
manager: koagbakp
services: azure-communication-services
ms.author: natekimball
ms.date: 04/07/2023
ms.topic: include
ms.service: azure-communication-services
---

## Send an email message with inline attachments

We can add an inline attachment by defining one or more EmailAttachment objects, defining a unique `ContentId` for each, and adding them to our EmailMessage object. Read the attachment file and encode it using Base64.

```csharp
var jpgFilePath = "./inline-attachment.jpg";
byte[] jpgBytes = File.ReadAllBytes(jpgFilePath);
var jpgBinaryData = new BinaryData(jpgBytes);
var jpgInlineAttachment = new EmailAttachment(
    "inline-attachment.jpg",
    "image/jpeg",
    jpgBinaryData);
jpgInlineAttachment.ContentId = "my-inline-attachment-1";

var pngFilePath = "./inline-attachment.png";
byte[] pngBytes = File.ReadAllBytes(pngFilePath);
var pngBinaryData = new BinaryData(pngBytes);
var pngInlineAttachment = new EmailAttachment(
    "inline-attachment.png",
    "image/png",
    pngBinaryData);
pngInlineAttachment.ContentId = "my-inline-attachment-2";
```

Within the HTML body of the message, we can then embed an image by referencing its `ContentId` within the source of an `<img>` tag.

```csharp
var emailContent = new EmailContent("Welcome to Azure Communication Services Email")
{
    PlainText ="This email message is sent from Azure Communication Services Email using the .NET SDK.",
    Html = "<html><h1>HTML body inline images:</h1><img src=\"cid:my-inline-attachment-1\" /><img src=\"cid:my-inline-attachment-2\" /></html>"
};

var emailMessage = new EmailMessage(
    senderAddress: "donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net"
    recipientAddress: "emailalias@contoso.com"
    content: emailContent);

emailMessage.Attachments.Add(jpgInlineAttachment);
emailMessage.Attachments.Add(pngInlineAttachment);

try
{
    EmailSendOperation emailSendOperation = emailClient.Send(WaitUntil.Completed, emailMessage);
    Console.WriteLine($"Email Sent. Status = {emailSendOperation.Value.Status}");

    /// Get the OperationId so that it can be used for tracking the message for troubleshooting
    string operationId = emailSendOperation.Id;
    Console.WriteLine($"Email operation id = {operationId}");
}
catch (RequestFailedException ex)
{
    /// OperationID is contained in the exception message and can be used for troubleshooting purposes
    Console.WriteLine($"Email send operation failed with error code: {ex.ErrorCode}, message: {ex.Message}");
}

```

> [!NOTE]
> Regular attachments can be combined with inline attachments, as well. Defining a `ContentId` will treat an attachment as inline, while an attachment without a `ContentId` will be treated as a regular attachment.

### Allowed MIME types

Although most modern clients support inline attachments, the rendering behavior of an inline attachment is largely dependent on the recipient's email client. For this reason, it is suggested to use more common image formats inline whenever possible, such as .png, .jpg, or .gif. For more information on acceptable MIME types for email attachments, see the [allowed MIME types](../../../../concepts/email/email-attachment-allowed-mime-types.md) documentation.

### Sample code

You can download the sample app demonstrating this action from [GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/SendEmailAdvanced/SendEmailWithInlineAttachments)
