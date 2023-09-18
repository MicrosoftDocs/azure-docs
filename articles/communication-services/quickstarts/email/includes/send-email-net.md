---
title: include file
description: Send email.net sdk include file
author: bashan-git
manager: sundraman
services: azure-communication-services
ms.author: bashan
ms.date: 03/31/2023
ms.topic: include
ms.service: azure-communication-services
---

Get started with Azure Communication Services by using the Communication Services C# Email client library to send Email messages.

> [!TIP]
> Jump-start your email sending experience with Azure Communication Services by skipping straight to the [Basic Email Sending](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/SendEmail) and [Advanced Email Sending](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/SendEmailAdvanced) sample code on GitHub.

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
| Failed | The email send operation wasn't successful and encountered an error. The email wasn't sent. The result contains an error object with more details on the reason for failure. |

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
dotnet add package Azure.Communication.Email
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

There are a few different options available for authenticating an email client:

#### [Connection String](#tab/connection-string)

 Open **Program.cs** in a text editor and replace the body of the `Main` method with code to initialize an `EmailClient` with your connection string. The following code retrieves the connection string for the resource from an environment variable named `COMMUNICATION_SERVICES_CONNECTION_STRING`. Learn how to [manage your resource's connection string](../../create-communication-resource.md#store-your-connection-string).

```csharp
// This code demonstrates how to fetch your connection string
// from an environment variable.
string connectionString = Environment.GetEnvironmentVariable("COMMUNICATION_SERVICES_CONNECTION_STRING");
EmailClient emailClient = new EmailClient(connectionString);
```

#### [Azure Active Directory](#tab/aad)

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

#### [AzureKeyCredential](#tab/azurekeycredential)

Email clients can also be authenticated using an [AzureKeyCredential](https://azuresdkdocs.blob.core.windows.net/$web/python/azure-core/latest/azure.core.html#azure.core.credentials.AzureKeyCredential). Both the `key` and the `endpoint` can be founded on the "Keys" pane under "Settings" in your Communication Services Resource.

```csharp
var key = new AzureKeyCredential("<your-key-credential>");
var endpoint = new Uri("<your-endpoint-uri>");

var emailClient = new EmailClient(endpoint, key);
```

---

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
var htmlContent = "<html><body><h1>Quick send email test</h1><br/><h4>This email message is sent from Azure Communication Service Email.</h4><p>This mail was sent using .NET SDK!!</p></body></html>";
var sender = "donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net";
var recipient = "emailalias@contoso.com";

```
### Send and get the email send status

To send an email message, you need to:
- Call SendAsync method that sends the email request as an asynchronous operation. Call with Azure.WaitUntil.Completed if your method should wait to return until the long-running operation has completed on the service. Call with Azure.WaitUntil.Started if your method should return after starting the operation. 
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

Access logs for [Email Communication Service](../../../concepts/analytics/logs/email-logs.md).

### Run the code

Run the application from your application directory with the `dotnet run` command.

```console
dotnet run
```

### Sample code

You can download the sample app from [GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/SendEmail)
