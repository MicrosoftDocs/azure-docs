---
title: include file
description: Email object model .NET SDK include file
author: natekimball-msft
manager: koagbakp
services: azure-communication-services
ms.author: natekimball
ms.date: 04/07/2023
ms.topic: include
ms.service: azure-communication-services
---

### Send an email message using the object model to construct the email payload

- Construct the email subject and body using EmailContent. 
- Add Recipients. 
- Set email importance through custom headers.
- Construct your email message using your sender email address, defined in the MailFrom list of the domain linked in your Communication Services Resource.
- Include your EmailContent and EmailRecipients, optionally adding attachments.

```csharp
var subject = "Welcome to Azure Communication Service Email APIs.";
var emailContent = new EmailContent(subject)
{
    PlainText = "This email message is sent from Azure Communication Service Email using .NET SDK.",
    Html = "<html><body><h1>Quick send email test</h1><br/><h4>This email message is sent from Azure Communication Service Email using .NET SDK.</h4></body></html>"
};
 
List<EmailAddress> emailAddresses = new List<EmailAddress> 
{ 
    new EmailAddress("emailalias@contoso.com", "Friendly Display Name")
};

EmailRecipients emailRecipients = new EmailRecipients(emailAddresses);

var emailMessage = new EmailMessage(sender, emailRecipients, emailContent)
{
    // Header name is "x-priority" or "x-msmail-priority"
    // Header value is a number from 1 to 5. 1 or 2 = High, 3 = Normal, 4 or 5 = Low
    // Not all email clients recognize this header directly (outlook client does recognize)
    Headers =
    {
        // Set Email Importance to High
        { "x-priority", "1" },
        { "", "" }
    }
};

try
{
    Console.WriteLine("Sending email to multiple recipients...");
    EmailSendOperation emailSendOperation = emailClient.Send(
        WaitUntil.Completed,
        emailMessage);

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
