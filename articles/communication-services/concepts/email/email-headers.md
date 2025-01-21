---
title: Custom headers for Azure Email Communication Service
titleSuffix: An Azure Communication Services concept document
description: Learn about sending custom headers.
author: anmolbohra
manager: koagbakp
services: azure-communication-services
ms.author: anmolbohra
ms.date: 01/09/2025
ms.topic: conceptual
ms.service: azure-communication-services
---
# Adding Reserved Custom headers

Custom headers can be sent along with an email request. These headers are defined as a dictionary. There are some predefined custom headers which can be used to handle some of the email sending scenarios.


| Custom Header Name |  Property |
| --- | --- |
| x-ms-acsemail-ignore-duplicate-content-id | When this header is explicitly set to true, we don't validate duplicate content ID and will let the author manage duplicates. The default value of this header (if not present) is false. In this case, we return a 'Bad Request' when we encounter duplicate ContentID. |
| x-ms-acsemail-suppress-invalid-attachment | By default, if the attachment is invalid, we return bad request. If this header is set to true and if an attachment is invalid, we continue with the request without the attachment. |
| x-ms-acsemail-validate-message-id |  When this header is explicitly set to true, we validate the internet message ID sent by the customer. The validations include checking for [RFC 2822](https://www.rfc-editor.org/rfc/rfc2822) Internet Message ID format and also if there's a duplicate already present. If it fails, we return bad request. If the header isn't set and the internet message ID validation fails, we remove the message ID and let the service create one. By default, we don't force this validation. <table><thead><tr><th>Internet Message ID</th><th>Validity</th></tr></thead><tbody><tr><td>&lt;guid@domain.com&gt;</td><td>Valid</td></tr><tr><td>&lt;202501131823.34067409c4494c2c8b2de03ceb26f173-NVZOA======@microsoft.com&gt;</td><td>Valid</td></tr><tr><td>guid@domain.com</a></td><td>Invalid</td></tr><tr><td>&lt;guid&gt;</td><td>Invalid</td></tr><tr><td>&lt;guid.domain&gt;</td><td>Invalid</td></tr></tbody></table> |

## Send an email message with custom headers

We can define custom headers by adding header details to emailMessage. 

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

// Add Custom headers
var customHeaders = new Dictionary<string, string>
{
  {"x-ms-acsemail-suppress-invalid-attachment", "true"}, // if the attachment is of invalid type, this request will still be processed without the attachment.
}

var emailAttachment = new EmailAttachment("attachment.pdf", MediaTypeNames.Application.Pdf, contentBinaryData);

EmailRecipients emailRecipients = new EmailRecipients(toRecipients);

// Create the EmailMessage
var emailMessage = new EmailMessage(
    senderAddress: "donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net" // The email address of the domain registered with the Communication Services resource
    emailRecipients,
    emailContent);

// Add custom headers to the emailMessage
emailMessage.Headers.Add(customHeaders);
// Add attachment to the emailMessage
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
