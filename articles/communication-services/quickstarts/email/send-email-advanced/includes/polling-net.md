---
title: include file
description: Manual polling .NET SDK include file
author: natekimball-msft
manager: koagbakp
services: azure-communication-services
ms.author: natekimball
ms.date: 04/07/2023
ms.topic: include
ms.service: azure-communication-services
---

## Sending email async and polling for the email send status

When you call SendAsync with Azure.WaitUntil.Started, your method returns back after starting the operation. The method returns EmailSendOperation object. You can call UpdateStatusAsync method to refresh the email operation status. 

The returned EmailSendOperation object contains an EmailSendStatus object that contains: 
- Current status of the Email Send operation.
- An error object with failure details if the current status is in a failed state.

```csharp

//Replace with your domain and modify the content, recipient details as required
var subject = "Welcome to Azure Communication Service Email APIs.";
var htmlContent = "<html><body><h1>Quick send email test</h1><br/><h4>This email message is sent from Azure Communication Service Email.</h4><p>This mail was sent using .NET SDK!!</p></body></html>";
var sender = "donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net";
var recipient = "emailalias@contoso.com";

/// Send the email message with WaitUntil.Started
EmailSendOperation emailSendOperation = await emailClient.SendAsync(
    Azure.WaitUntil.Started,
    sender,
    recipient,
    subject,
    htmlContent);

/// Call UpdateStatus on the email send operation to poll for the status
/// manually.
try
{
    while (true)
    {
        await emailSendOperation.UpdateStatusAsync();
        if (emailSendOperation.HasCompleted)
        {
            break;
        }
        await Task.Delay(100);
    }

    if (emailSendOperation.HasValue)
    {
        Console.WriteLine($"Email queued for delivery. Status = {emailSendOperation.Value.Status}");
    }
}
catch (RequestFailedException ex)
{
    Console.WriteLine($"Email send failed with Code = {ex.ErrorCode} and Message = {ex.Message}");
}

/// Get the OperationId so that it can be used for tracking the message for troubleshooting
string operationId = emailSendOperation.Id;
Console.WriteLine($"Email operation id = {operationId}");
```

Run the application from your application directory with the `dotnet run` command.

```console
dotnet run
```

### Sample code

You can download the sample app from [GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/SendEmailAdvanced/SendEmailWithManualPollingForStatus)
