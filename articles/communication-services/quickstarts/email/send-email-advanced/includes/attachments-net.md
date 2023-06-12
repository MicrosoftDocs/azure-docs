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

// Create the email content
var emailContent = new EmailContent("Welcome to Azure Communication Service Email APIs.")
{
    PlainText = "This email message is sent from Azure Communication Service Email.",
    Html = "<html><body><h1>Quick send email test</h1><br/><h4>This email message is sent from Azure Communication Service Email.</h4><p>This mail was sent using .NET SDK!!</p></body></html>"
};

// Create the EmailMessage
var emailMessage = new EmailMessage(
    senderAddress: "donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net" // The email address of the domain registered with the Communication Services resource
    recipientAddress: "emailalias@contoso.com"
    content: emailContent);

// Create the EmailAttachment
var filePath = "C:\Users\Documents\attachment.pdf";
byte[] bytes = File.ReadAllBytes(filePath);
var contentBinaryData = new BinaryData(bytes);
var emailAttachment = new EmailAttachment("attachment.pdf", MediaTypeNames.Application.Pdf, contentBinaryData);

emailMessage.Attachments.Add(emailAttachment);

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

Run the application from your application directory with the `dotnet run` command.

```console
dotnet run
```

### Allowed MIME types

For more information on acceptable MIME types for email attachments, see the [allowed MIME types](../../../../concepts/email/email-attachment-allowed-mime-types.md) documentation.

### Sample code

You can download the sample app demonstrating this action from [GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/SendEmailAdvanced/SendEmailWithAttachments)
