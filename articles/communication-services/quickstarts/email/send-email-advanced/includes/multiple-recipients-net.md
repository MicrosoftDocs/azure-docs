---
title: include file
description: Multiple recipients .NET SDK include file
author: natekimball-msft
manager: koagbakp
services: azure-communication-services
ms.author: natekimball
ms.date: 04/07/2023
ms.topic: include
ms.service: azure-communication-services
---

## Send an email message to multiple recipients

We can define multiple recipients by adding more EmailAddresses to the EmailRecipients object. These addresses can be added as `To`, `CC`, or `BCC` recipients. Optionally, we can also add a `ReplyTo` email address to receive any replies.

```csharp
// Create the email content
var emailContent = new EmailContent("Welcome to Azure Communication Service Email APIs.")
{
    PlainText = "This email message is sent from Azure Communication Service Email.",
    Html = "<html><body><h1>Quick send email test</h1><br/><h4>This email message is sent from Azure Communication Service Email.</h4><p>This mail was sent using .NET SDK!!</p></body></html>"
};

// Create the To list
var toRecipients = new List<EmailAddress>
{
  new EmailAddress("<emailalias1@emaildomain.com>"),
  new EmailAddress("<emailalias2@emaildomain.com>"),
};

// Create the CC list
var ccRecipients = new List<EmailAddress>
{
  new EmailAddress("<ccemailalias@emaildomain.com>"),
};

// Create the BCC list
var bccRecipients = new List<EmailAddress>
{
  new EmailAddress("<bccemailalias@emaildomain.com>"),
};

EmailRecipients emailRecipients = new EmailRecipients(toRecipients, ccRecipients, bccRecipients);

// Create the EmailMessage
var emailMessage = new EmailMessage(
    senderAddress: "donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net" // The email address of the domain registered with the Communication Services resource
    emailRecipients,
    emailContent);

// Add optional ReplyTo address which is where any replies to the email will go to.
emailMessage.ReplyTo.Add(new EmailAddress("<replytoemailalias@emaildomain.com>"));

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

### Sample code

You can download the sample app demonstrating this action from [GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/SendEmailAdvanced/SendEmailToMultipleRecipients)
