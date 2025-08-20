---
title: include file
description: Hydrating messageId using EmailClient for .NET SDK
author: fanruisun
manager: koagbakp
services: azure-communication-services
ms.author: fanruisun
ms.date: 08/04/2025
ms.topic: include
ms.service: azure-communication-services
---

## Hydrating messageId using EmailClient

You can hydrate a messageId (operationId) using the EmailClient to track and manage email operations more effectively. This process is called "rehydration" and allows you to continue monitoring the status of an email when you don't have the original EmailSendOperation object.

### Create the email client

```csharp
// Create the EmailClient
var connectionString = "<ACS_CONNECTION_STRING>";
var emailClient = new EmailClient(connectionString);
```

### Configure email details

```csharp
var sender = "<SENDER_EMAIL>";
var recipient = "<RECIPIENT_EMAIL>";
var subject = "Send email with manual status polling using operationID";
```

### Create email content

```csharp
var emailContent = new EmailContent(subject)
{
    PlainText = "This is plain text mail send test body \n Best Wishes!!",
    Html = "<html><body><h1>Quick send email test</h1><br/><h4>Communication email as a service mail send app working properly</h4><p>Happy Learning!!</p></body></html>"
};

var emailMessage = new EmailMessage(sender, recipient, emailContent);
```

### Send email and capture operation ID

```csharp
var emailSendOperation = await emailClient.SendAsync(
    wait: WaitUntil.Started,
    message: emailMessage);

// Get the OperationId so that it can be used for rehydrating an EmailSendOperation object
// and use that object to poll for the status of the email send operation.
var operationId = emailSendOperation.Id;
Console.WriteLine($"Email operation id = {operationId}");
```

The `operationId` is the key identifier that allows you to rehydrate the operation later. In real applications, you would typically store this ID for future reference.

### Rehydrate operation ID and poll for completion

```csharp
// Poll for the status of the email send operation using the previous operationId
await PollForEmailSendOperationStatusWithExistingOperationId(emailClient, operationId);

private static async Task PollForEmailSendOperationStatusWithExistingOperationId(EmailClient emailClient, string operationId)
{
    // Rehydrate a new EmailSendOperation object using the given operationId
    // Rehydration refers to the process of creating a new EmailSendOperation object using the operation ID from a previous EmailSendOperation.
    // This is necessary in case you want to continue monitoring the status of the email manually, when you don't have 
    // the original EmailSendOperation object from the initial request.
    EmailSendOperation rehydratedEmailSendOperation = new EmailSendOperation(operationId, emailClient);

    // Call UpdateStatus on the rehydrated email send operation to poll for the status manually.
    try
    {
        while (true)
        {
            await rehydratedEmailSendOperation.UpdateStatusAsync();
            if (rehydratedEmailSendOperation.HasCompleted)
            {
                break;
            }
            await Task.Delay(100);
        }

        if (rehydratedEmailSendOperation.HasValue)
        {
            Console.WriteLine($"Email queued for delivery. Status = {rehydratedEmailSendOperation.Value.Status}");
        }
    }
    catch (RequestFailedException ex)
    {
        Console.WriteLine($"Email send failed with Code = {ex.ErrorCode} and Message = {ex.Message}");
    }
}
```

### Sample code

You can download the sample app demonstrating this action from GitHub Azure Samples [Send Email With Manual Polling Using Operation Id](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/SendEmailAdvanced/SendEmailWithManualPollingUsingOperationId).
