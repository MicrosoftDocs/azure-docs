---
title: include file
description: Send email.net sdk include file
author: bashan-git
manager: sundraman
services: azure-communication-services
ms.author: bashan
ms.date: 03/24/2023
ms.topic: include
ms.service: azure-communication-services
---

Get started with Azure Communication Services by using the Communication Services C# Email client library to send Email messages.

## Understanding the Email Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Email Client library for C#.


| Name                | Description                                                                                                                                          |
| --------------------| -----------------------------------------------------------------------------------------------------------------------------------------------------|
| EmailAddress        | This class contains an email address and an option for a display name.                                                                               |
| EmailAttachment     | This class creates an email attachment by accepting a unique ID, email attachment [MIME type](../../../concepts/email/email-attachment-allowed-mime-types.md) string, and binary data for content.                               |
| EmailClient         | This class is needed for all email functionality. You instantiate it with your connection string and use it to send email messages.                  |
| EmailClientOptions  | This class can be added to the EmailClient instantiation to target a specific API version.                                                           |
| EmailContent        | This class contains the subject and the body of the email message. You have to specify at least one of PlainText or Html content   |
| EmailCustomHeader   | This class allows for the addition of a name and value pair for a custom header. Email importance can also be specified through these headers using the header name 'x-priority' or 'x-msmail-priority'                                                                  |
| EmailMessage        | This class combines the sender, content, and recipients. Custom headers, attachments, and reply-to email addresses can optionally be added, as well. |
| EmailRecipients     | This class holds lists of EmailAddress objects for recipients of the email message, including optional lists for CC & BCC recipients.                |
| EmailSendOperation | This class represents the asynchronous email send operation and is returned from email send api call.                                             |
| EmailSendResult | This class holds the results of the email send operation. It has an operation ID, operation status and error object (when applicable).                                            |


EmailSendResult returns the following status on the email operation performed.


| Status          | Description                       |
| ---------------------| --------------------------------------------------------------------------------------------------------------------------------------------|
| NotStarted | We're not sending this status from our service at this time. |
| Running | The email send operation is currently in progress and being processed. |
| Succeeded | The email send operation has completed without error and the email is out for delivery. Any detailed status about the email delivery beyond this stage can be obtained either through Azure Monitor or through Azure Event Grid. [Learn how to subscribe to email events](../handle-email-events.md) |
| Failed | The email send operation wasn't successful and encountered an error. The email wasn't sent. The result contains an error object with more details on the reason for failure or cancellation. |
| Canceled | The email send operation was canceled before it could complete. The email wasn't sent. The result contains an error object with more details on the reason for failure or cancellation.|

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- The latest version [.NET Core client library](https://dotnet.microsoft.com/download/dotnet-core) for your operating system.
- An Azure Email Communication Services Resource created and ready with a provisioned domain [Get started with Creating Email Communication Resource](../create-email-communication-resource.md)
- An active Communication Services resource connected with Email Domain and a Connection String. [Get started by Connecting Email Resource with a Communication Resource](../connect-email-communication-resource.md)

Completing this quick start incurs a small cost of a few USD cents or less in your Azure account.

> [!NOTE]
> We can also send an email from our own verified domain. [Add custom verified domains to Email Communication Service](../add-azure-managed-domains.md).

### Prerequisite check

- In a terminal or command window, run the `dotnet` command to check that the .NET client library is installed.
- To view the subdomains associated with your Email Communication Services resource, sign in to the [Azure portal](https://portal.azure.com/), locate your Email Communication Services resource and open the **Provision domains** tab from the left navigation pane.

### Create a new C# application
In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `EmailQuickstart`. This command creates a simple "Hello World" C# project with a single source file: **Program.cs**.

```console
dotnet new console -o EmailQuickstart
```

Change your directory to the newly created app folder and use the `dotnet build` command to compile your application.

```console
cd EmailQuickstart
dotnet build
```

### Install the package
While still in the application directory, install the Azure Communication Services Email client library for .NET package by using the `dotnet add package` command.

```console
dotnet add package Azure.Communication.Email --prerelease
```

## Creating the email client with authentication

Open **Program.cs** and replace the existing code with the following
to add `using` directives for including the `Azure.Communication.Email` namespace and a starting point for execution for your program.


  ```csharp

using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

using Azure;
using Azure.Communication.Email;

namespace SendEmail
{
  internal class Program
  {
    static async Task Main(string[] args)
    {

    }
  }
}

```

### Option 1: Authenticate using a connection string

 Open **Program.cs** in a text editor and replace the body of the `Main` method with code to initialize an `EmailClient` with your connection string. The following code retrieves the connection string for the resource from an environment variable named `COMMUNICATION_SERVICES_CONNECTION_STRING`. Learn how to [manage your resource's connection string](../../create-communication-resource.md#store-your-connection-string).



```csharp
// This code demonstrates how to fetch your connection string
// from an environment variable.
string connectionString = Environment.GetEnvironmentVariable("COMMUNICATION_SERVICES_CONNECTION_STRING");
EmailClient emailClient = new EmailClient(connectionString);
```

### Option 2: Authenticate using Azure Active Directory

To authenticate using [Azure Active Directory](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/identity/Azure.Identity), install the `Azure.Identity` library package for .NET by using the `dotnet add package` command.

```console
dotnet add package Azure.Identity
```
Open **Program.cs** in a text editor and replace the body of the `Main` method with code to initialize an `EmailClient` using [DefaultAzureCredential](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/identity/Azure.Identity#defaultazurecredential). The Azure Identity SDK reads values from three environment variables at runtime to authenticate the application. Learn how to [create an Azure Active Directory Registered Application and set the environment variables](../../identity/service-principal.md?pivots=platform-azcli).

```csharp
// This code demonstrates how to authenticate to your Communication Service resource using
// DefaultAzureCredential and the environment variables AZURE_CLIENT_ID, AZURE_TENANT_ID,
// and AZURE_CLIENT_SECRET.
string resourceEndpoint = "<ACS_RESOURCE_ENDPOINT>";
EmailClient emailClient = new EmailClient(new Uri(resourceEndpoint), new DefaultAzureCredential());
```

### Option 3: Authenticate using AzureKeyCredential

Email clients can also be authenticated using an [AzureKeyCredential](https://azuresdkdocs.blob.core.windows.net/$web/python/azure-core/latest/azure.core.html#azure.core.credentials.AzureKeyCredential). Both the `key` and the `endpoint` can be founded on the "Keys" pane under "Settings" in your Communication Services Resource.

```csharp
var key = new AzureKeyCredential("<your-key-credential>");
var endpoint = new Uri("<your-endpoint-uri>");

var emailClient = new EmailClient(endpoint, key);
```

## Basic email sending 

### Construct your email message

To send an email message, you need to:
- Define the email subject and body.
- Define your Sender Address. Construct your email message with your Sender information you get your MailFrom address from your verified domain. 
- Define the Recipient Address.
- Call the SendAsync method. Add this code to the end of `Main` method in **Program.cs**:

Replace with your domain details and modify the content, recipient details as required
```csharp

//Replace with your domain and modify the content, recipient details as required

var subject = "Welcome to Azure Communication Service Email APIs.";
var htmlContent = "<html><body><h1>Quick send email test</h1><br/><h4>This email message is sent from Azure Communication Service Email.</h4><p>This mail was send using .NET SDK!!</p></body></html>";
var sender = "donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net";
var recipient = "emailalias@contoso.com";

```
### Send and get the email send status

To send an email message, you need to:
- Call SendSync method that sends the email request as an asynchronous operation. Call with Azure.WaitUntil.Completed if your method should wait to return until the long-running operation has completed on the service. Call with Azure.WaitUntil.Started if your method should return after starting the operation. 
- SendAsync method returns EmailSendOperation that returns "Succeeded" EmailSendStatus if email is out for delivery and throws an exception otherwise. Add this code to the end of `Main` method in **Program.cs**:

```csharp
try
{
    Console.WriteLine("Sending email...");
    EmailSendOperation emailSendOperation = await emailClient.SendAsync(
        Azure.WaitUntil.Completed,
        sender,
        recipient,
        subject,
        htmlContent);
    EmailSendResult statusMonitor = emailSendOperation.Value;
    
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

### Getting email delivery status

EmailSendOperation only returns email operation status. To get the actual email delivery status, you can subscribe to "EmailDeliveryReportReceived" event that is generated when the email delivery is completed. The event returns the following delivery state:

- Delivered. 
- Failed. 
- Quarantined.

See [Handle Email Events](../handle-email-events.md) for details.

You can also now subscribe to Email Operational logs that provide information related to delivery metrics for messages sent from the Email service.

- Email Send Mail operational logs - provides detailed information related to the Email service send mail requests.
- Email Status Update operational logs - provides message and recipient level delivery status updates related to the Email service send mail requests.

See how to [Get started with log analytics in Azure Communication Service](../../../concepts/logging-and-diagnostics.md)

### Run the code

Run the application from your application directory with the `dotnet run` command.

```console
dotnet run
```

If you see that your application is hanging it could be due to email sending being throttled. You can [handle this through logging or by implementing a custom policy](#throw-an-exception-when-email-sending-tier-limit-is-reached).

### Sample code

You can download the sample app from [GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/SendEmail)

## Advanced Sending

### Sending email async and polling for the email send status

When you call SendAsync with Azure.WaitUntil.Started, your method returns back after starting the operation. The method returns EmailSendOperation object. You can call UpdateStatusAsync method to refresh the email operation status. 

The returned EmailSendOperation object contains an EmailSendStatus object that contains: 
- Current status of the Email Send operation.
- An error object with failure details if the current status is in a failed state.

```csharp
Console.WriteLine("Sending email with Async no Wait...");
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

You can download the sample app from [GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/SendEmailAdvanced/ManualPolling)

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

### Send an email message to multiple recipients

We can define multiple recipients by adding more EmailAddresses to the EmailRecipients object. These addresses can be added as `To`, `CC`, or `BCC` recipients.

```csharp
var toRecipients = new List<EmailAddress>
{
  new EmailAddress("<emailalias1@emaildomain.com>"),
  new EmailAddress("<emailalias2@emaildomain.com>"),
};

var ccRecipients = new List<EmailAddress>
{
  new EmailAddress("<ccemailalias@emaildomain.com>"),
};

var bccRecipients = new List<EmailAddress>
{
  new EmailAddress("<bccemailalias@emaildomain.com>"),
};

EmailRecipients emailRecipients = new EmailRecipients(toRecipients, ccRecipients, bccRecipients);
```

You can download the sample app demonstrating this action from [GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/SendEmailAdvanced/SendEmailToMultipleRecipients)


### Send an email message with attachments

We can add an attachment by defining an EmailAttachment object and adding it to our EmailMessage object. Read the attachment file and encode it using Base64.

```csharp

var filePath = "C:\Users\Documents\attachment.pdf";
byte[] bytes = File.ReadAllBytes(filePath);
var contentBinaryData = new BinaryData(bytes);
var emailAttachment = new EmailAttachment("attachment.pdf", MediaTypeNames.Application.Pdf, contentBinaryData);
emailMessage.Attachments.Add(emailAttachment);

```

For more information on acceptable MIME types for email attachments, see the [allowed MIME types](../../../concepts/email/email-attachment-allowed-mime-types.md) documentation.

You can download the sample app demonstrating this action from [GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/SendEmailAdvanced/SendEmailWithAttachments)

### Throw an exception when email sending tier limit is reached

The Email API has throttling with limitations on the number of email messages that you can send. Email sending has limits applied per minute and per hour as mentioned in [API Throttling and Timeouts](https://learn.microsoft.com/azure/communication-services/concepts/service-limits). When you have reached these limits, additional email sends with `SendAsync` calls will receive an error response of “429: Too Many Requests”. By default, the SDK is configured to retry these requests after waiting a certain period of time. We recommend you [set up logging with the Azure SDK](https://learn.microsoft.com/dotnet/azure/sdk/logging) to capture these response codes.

Alternatively, you can manually define a custom policy as shown below.

```csharp
using Azure.Core.Pipeline;

public class Catch429Policy : HttpPipelineSynchronousPolicy
{
    public override void OnReceivedResponse(HttpMessage message)
    {
        if (message.Response.Status == 429)
        {
            throw new Exception(message.Response);
        }
        else
        {
            base.OnReceivedResponse(message);
        }
    }
}
```

Add this policy to your email client. This will ensure that 429 response codes throw an exception rather than being retried.

```csharp
EmailClientOptions emailClientOptions = new EmailClientOptions();
emailClientOptions.AddPolicy(new Catch429Policy(), HttpPipelinePosition.PerRetry);

EmailClient emailClient = new EmailClient(connectionString, emailClientOptions);
```

