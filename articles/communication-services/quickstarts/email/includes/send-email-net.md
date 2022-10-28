---
title: include file
description: Send email.net sdk include file
author: bashan-git
manager: sphenry
services: azure-communication-services
ms.author: bashan
ms.date: 04/15/2022
ms.topic: include
ms.service: azure-communication-services
ms.custom: private_preview, event-tier1-build-2022
---

Get started with Azure Communication Services by using the Communication Services C# Email client library to send Email messages.

Completing this quick start incurs a small cost of a few USD cents or less in your Azure account.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- The latest version [.NET Core client library](https://dotnet.microsoft.com/download/dotnet-core) for your operating system.
- An Azure Email Communication Services Resource created and ready with a provisioned domain [Get started with Creating Email Communication Resource](../create-email-communication-resource.md)
- An active Communication Services resource connected with Email Domain and a Connection String. [Get started by Connecting Email Resource with a Communication Resource](../connect-email-communication-resource.md)

### Prerequisite check

- In a terminal or command window, run the `dotnet` command to check that the .NET client library is installed.
- To view the subdomains associated with your Email Communication Services resource, sign in to the [Azure portal](https://portal.azure.com/), locate your Email Communication Services resource and open the **Provision domains** tab from the left navigation pane.

## Setting up

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

Open **Program.cs** and replace the existing code with the following
to add `using` directives for including the `Azure.Communication` namespace and a starting point for execution for your program.

  ```csharp

using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

using Azure;
using Azure.Communication.Email;
using Azure.Communication.Email.Models;

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

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Email Client library for C#.

| Name                | Description                                                                                                                                          |
| --------------------| -----------------------------------------------------------------------------------------------------------------------------------------------------|
| EmailAddress        | This class contains an email address and an option for a display name.                                                                               |
| EmailAttachment     | This class creates an email attachment by accepting a unique ID, email attachment type, and a string of content bytes.                               |
| EmailClient         | This class is needed for all email functionality. You instantiate it with your connection string and use it to send email messages.                  |
| EmailClientOptions  | This class can be added to the EmailClient instantiation to target a specific API version.                                                           |
| EmailContent        | This class contains the subject and the body of the email message. The importance can also be set within the EmailContent class.                     |
| EmailCustomHeader   | This class allows for the addition of a name and value pair for a custom header.                                                                     |
| EmailMessage        | This class combines the sender, content, and recipients. Custom headers, attachments, and reply-to email addresses can optionally be added, as well. |
| EmailRecipients     | This class holds lists of EmailAddress objects for recipients of the email message, including optional lists for CC & BCC recipients.                |
| SendStatusResult | This class holds lists of status of the email message delivery.                                             |

## Authenticate the client

#### Option 1: Authenticate using a connection string

 Open **Program.cs** in a text editor and replace the body of the `Main` method with code to initialize an `EmailClient` with your connection string. The code below retrieves the connection string for the resource from an environment variable named `COMMUNICATION_SERVICES_CONNECTION_STRING`. Learn how to [manage your resource's connection string](../../create-communication-resource.md#store-your-connection-string).

```csharp
// This code demonstrates how to fetch your connection string
// from an environment variable.
string connectionString = Environment.GetEnvironmentVariable("COMMUNICATION_SERVICES_CONNECTION_STRING");
EmailClient emailClient = new EmailClient(connectionString);
```

#### Option 2: Authenticate using Azure Active Directory

To authenticate using Azure Active Directory, install the Azure.Identity library package for .NET by using the `dotnet add package` command.

```console
dotnet add package Azure.Identity
```

 Open **Program.cs** in a text editor and replace the body of the `Main` method with code to initialize an `EmailClient` using `DefaultAzureCredential`. The Azure Identity SDK reads values from three environment variables at runtime to authenticate the application. Learn how to [create an Azure Active Directory Registered Application and set the environment variables](../../identity/service-principal-from-cli.md).

```csharp
// This code demonstrates how to authenticate to your Communication Service resource using
// DefaultAzureCredential and the environment variables AZURE_CLIENT_ID, AZURE_TENANT_ID,
// and AZURE_CLIENT_SECRET.
string resourceEndpoint = "<ACS_RESOURCE_ENDPOINT>";
EmailClient emailClient = new EmailClient(new Uri(resourceEndpoint), new DefaultAzureCredential());
```

## Send an email message

To send an Email message, you need to
- Construct the email content and body using EmailContent 
- Add Recipients 
- Construct your email message with your Sender information you get your MailFrom address from your verified domain.
- Include your Email Content and Recipients and include attachments if any 
- Calling the Send method. Add this code to the end of `Main` method in **Program.cs**:

Replace with your domain details and modify the content, recipient details as required
```csharp

//Replace with your domain and modify the content, recipient details as required

EmailContent emailContent = new EmailContent("Welcome to Azure Communication Service Email APIs.");
emailContent.PlainText = "This email message is sent from Azure Communication Service Email using .NET SDK.";
List<EmailAddress> emailAddresses = new List<EmailAddress> { new EmailAddress("emailalias@contoso.com") { DisplayName = "Friendly Display Name" }};
EmailRecipients emailRecipients = new EmailRecipients(emailAddresses);
EmailMessage emailMessage = new EmailMessage("donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net", emailContent, emailRecipients);
SendEmailResult emailResult = emailClient.Send(emailMessage,CancellationToken.None);

```
## Getting MessageId to track email delivery

To track the status of email delivery, you need to get the MessageId back from response and track the status. If there's no MessageId retry the request.

```csharp
 Console.WriteLine($"MessageId = {emailResult.MessageId}");
```
## Getting status on email delivery
To get the delivery status of email call GetMessageStatus API with MessageId
```csharp
Response<SendStatusResult> messageStatus = null;
messageStatus = emailClient.GetSendStatus(emailResult.MessageId);
Console.WriteLine($"MessageStatus = {messageStatus.Value.Status}");
TimeSpan duration = TimeSpan.FromMinutes(3);
long start = DateTime.Now.Ticks;
do
{
    messageStatus = emailClient.GetSendStatus(emailResult.MessageId);
    if (messageStatus.Value.Status != SendStatus.Queued)
    {
        Console.WriteLine($"MessageStatus = {messageStatus.Value.Status}");
        break;
    }
    Thread.Sleep(10000);
    Console.WriteLine($"...");

} while (DateTime.Now.Ticks - start < duration.Ticks);
```

[!INCLUDE [Email Message Status](./email-message-status.md)]

## Run the code

Run the application from your application directory with the `dotnet run` command.

```console
dotnet run
```
## Sample code


You can download the sample app from [GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/SendEmail)

## Advanced

### Send an email message to multiple recipients

We can define multiple recipients by adding additional EmailAddresses to the EmailRecipients object. These addresses can be added as `To`, `CC`, or `BCC` recipients.

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

EmailRecipient emailRecipients = new EmailRecipients(toRecipients, ccRecipients, bccRecipients);
```

You can download the sample app demonstrating this from [GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/SendEmailAdvanced/SendEmailToMultipleRecipients)


### Send an email message with attachments

We can add an attachment by defining an EmailAttachment object and adding it to our EmailMessage object. Read the attachment file and encode it using Base64.

```csharp
byte[] bytes = File.ReadAllBytes(filePath);
string attachmentFileInBytes = Convert.ToBase64String(bytes);

var emailAttachment = new EmailAttachment(
    "<your-attachment-name>",
    "<your-attachment-name>",
    attachmentFileInBytes
);

emailMessage.Add(emailAttachment);
```

You can download the sample app demonstrating this from [GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/SendEmailAdvanced/SendEmailWithAttachments)
