---
title: include file
description: Sending with SMTP with .NET SmtpClient include file
author: ddouglas-msft
manager: koagbakp
services: azure-communication-services
ms.author: ddouglas
ms.date: 11/01/2023
ms.topic: include
ms.service: azure-communication-services
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- The latest version [.NET Core client library](https://dotnet.microsoft.com/download/dotnet-core) for your operating system.
- An Azure Communication Email Resource created and ready with a provisioned domain [Get started with Creating Email Communication Resource](../../create-email-communication-resource.md)
- An active Azure Communication Services Resource connected with Email Domain and a Connection String. [Get started by Connecting Email Resource with a Communication Resource](../../connect-email-communication-resource.md)
- Smtp credentials created using an Entra application with access to the Azure Communication Services Resource. [How to create authentication credentials for sending emails using Smtp](../smtp-authentication.md)

Completing this quick start incurs a small cost of a few USD cents or less in your Azure account.

> [!NOTE]
> We can also send an email from our own verified domain. [Add custom verified domains to Email Communication Service](../../add-azure-managed-domains.md).

In this quick start, you'll learn about how to send email with Azure Communication Services using SMTP.

### Prerequisite check

- In a terminal or command window, run the `dotnet` command to check that the .NET client library is installed.
- To view the subdomains associated with your Azure Communication Email Resource, sign in to the [Azure portal](https://portal.azure.com/), locate your Azure Communication Email Resource and open the **Provision domains** tab from the left navigation pane.

### Create a new C# application
In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `EmailQuickstart`. This command creates a simple "Hello World" C# project with a single source file: **Program.cs**.

```console
dotnet new console -o EmailSmtpQuickstart
```

Change your directory to the newly created app folder and use the `dotnet build` command to compile your application.

```console
cd EmailSmtpQuickstart
dotnet build
```

### Construct your email message

To construct an email message, you need to:

- Define the Smtp Authentication credentials using an Entra application.
- Define the Email Subject and Body.
- Define your Sender Address. You get your MailFrom Address from your Verified Domain.
- Define the Recipient Address.

Replace with your domain details and modify the content, recipient details as required

```csharp
//Replace with your domain and modify the content, recipient details as required

string smtpAuthUsername = "<Azure Communication Services Resource name>|<Entra Application Id>|<Entra Application Tenant Id>";
string smtpAuthPassword = "<Entra Application Client Secret>";
string sender = "donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net";
string recipient = "emailalias@contoso.com";
string subject = "Welcome to Azure Communication Service Email SMTP";
string body = "This email message is sent from Azure Communication Service Email using SMTP.";
```

### Send an email using System.Net.Mail.SmtpClient

To send an email message, you need to:

1. Create an SmtpClient using the Azure Communication Services host Url and the Smtp Authentication credentials.
1. Create a MailMessage.
1. Send using the SmtpClient's Send method.

```csharp
using System.Net;
using System.Net.Mail;

string smtpAuthUsername = "<Azure Communication Services Resource name>|<Entra Application Id>|<Entra Application Tenant Id>";
string smtpAuthPassword = "<Entra Application Client Secret>";
string sender = "donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net";
string recipient = "emailalias@contoso.com";
string subject = "Welcome to Azure Communication Service Email SMTP";
string body = "This email message is sent from Azure Communication Service Email using SMTP.";

string smtpHostUrl = "smtp.azurecomm.net";
var client = new SmtpClient(smtpHostUrl)
{
    Port = 587,
    Credentials = new NetworkCredential(smtpAuthUsername, smtpAuthPassword),
    EnableSsl = true
};

var message = new MailMessage(sender, recipient, subject, body);

try
{
    client.Send(message);
    Console.WriteLine("The email was successfully sent using Smtp.");
}
catch (Exception ex)
{
    Console.WriteLine($"Smtp failed the the exception: {ex.Message}.");
}
```
