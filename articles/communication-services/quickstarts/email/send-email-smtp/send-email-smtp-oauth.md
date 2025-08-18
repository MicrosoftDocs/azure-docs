---
title: Send email with SMTP and XOAuth2 using .NET
titleSuffix: An Azure Communication Services article
description: This article describes how to use SMTP and OAuth to send emails to Email Communication Services.
author: ddouglas-msft
services: azure-communication-services
ms.author: ddouglas
ms.date: 10/18/2023
ms.topic: quickstart
ms.service: azure-communication-services
ms.custom: devx-track-dotnet
---
# Send email with SMTP and XOAuth2 using .NET

This article describes how to use XOAuth2 for authentication when sending emails using the Simple Mail Transfer Protocol (SMTP) and Azure Communication Services.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- The latest version [.NET Core client library](https://dotnet.microsoft.com/download/dotnet-core) for your operating system.
- An Azure Communication Email Resource created and ready with a provisioned domain [Get started with Creating Email Communication Resource](../create-email-communication-resource.md).
- An active Azure Communication Services Resource connected with Email Domain and a Connection String. [Get started by Connecting Email Resource with a Communication Resource](../connect-email-communication-resource.md).
- SMTP credentials created using a Microsoft Entra ID application with access to the Azure Communication Services Resource. [How to create authentication credentials for sending emails using SMTP](smtp-authentication.md).

Completing this example incurs a small cost of a few USD cents or less in your Azure account.

> [!NOTE]
> You can also send an email from your own verified domain. See [Add custom verified domains to Email Communication Service](../add-azure-managed-domains.md).

This article describes how to send email with Azure Communication Services using SMTP.

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

Add the MailKit package.

```console
dotnet add package MailKit
```

### Retrieve an Entra token for SMTP OAuth authentication

Complete the following steps to retrieve a Microsoft Entra ID token. Replace the Microsoft Entra ID application details with the values from the Entra application used to create the SMTP Username.

```csharp
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Identity.Client;
using MimeKit;
using System.Net;

// Microsoft Entra ID (Azure AD) credentials
string smtpUsername = "<SMTP Username of the ACS Resource>";
string entraAppId = "<Entra Application ID>";
string entraAppClientSecret = "<Entra Application Client Secret>";
string tenantId = "<Entra Tenant ID>";
string entraAuthority = "https://login.microsoftonline.com/common/";

// Build the MSAL confidential client application
IConfidentialClientApplication app = ConfidentialClientApplicationBuilder
    .Create(entraAppId)
    .WithClientSecret(entraAppClientSecret)
    .WithAuthority(new Uri(entraAuthority))
    .WithTenantId(tenantId)
    .Build();

// Define the resource scope
string[] scopes = new string[] { "https://communication.azure.com/.default" };

// Acquire token for the client
AuthenticationResult result = await app.AcquireTokenForClient(scopes)
    .ExecuteAsync();

string token = result.AccessToken;
```

### Construct your email message
To construct an email message, you need to:
- Define the Email Subject and Body.
- Define your Sender Address. You get your MailFrom Address from your Verified Domain.
- Define the Recipient Address.

Replace with your domain details and modify the content, recipient details as required

```csharp
string smtpHostUrl = "smtp.azurecomm.net";
string senderAddress = "<Mailfrom Address>";
string recipientAddress = "<Recipient Email Address>";

string subject = "Welcome to Azure Communication Service Email SMTP";
string body = "This email message is sent from Azure Communication Service Email using SMTP.";
```


### Send an email using MailKit.

```csharp
var message = new MimeMessage();
message.From.Add(new MailboxAddress("Sender Name", senderAddress));
message.To.Add(new MailboxAddress("Recipient Name", recipientAddress));
message.Subject = subject;
message.Body = new TextPart("plain")
{
    Text = body
};

using (var client = new SmtpClient())
{
    client.Connect(smtpHostUrl, 587, SecureSocketOptions.StartTls);

    // Use the access token to authenticate
    var oauth2 = new SaslMechanismOAuth2(smtpUsername, token);
    client.Authenticate(oauth2);

    client.Send(message);
    client.Disconnect(true);
}
```