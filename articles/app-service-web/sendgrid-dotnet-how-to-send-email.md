---
title: How to use the SendGrid email service (.NET) | Microsoft Docs
description: Learn how send email with the SendGrid email service on Azure. Code samples written in C# and use the .NET API.
services: app-service\web
documentationcenter: .net
author: thinkingserious
manager: erikre
editor: ''

ms.assetid: 21bf4028-9046-476b-9799-3d3082a0f84c
ms.service: app-service-web
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: article
ms.date: 02/15/2017
ms.author: dx@sendgrid.com

---
# How to Send Email Using SendGrid with Azure
## Overview
This guide demonstrates how to perform common programming tasks with the
SendGrid email service on Azure. The samples are written in C\#
and supports .NET Standard 1.3. The scenarios covered include constructing
email, sending email, adding attachments, and enabling various mail and
tracking settings. For more information on SendGrid and sending email, see
the [Next steps][Next steps] section.

## What is the SendGrid Email Service?
SendGrid is a [cloud-based email service] that provides reliable
[transactional email delivery], scalability, and real-time analytics along with flexible APIs
that make custom integration easy. Common SendGrid use cases include:

* Automatically sending receipts or purchase confirmations to customers.
* Administering distribution lists for sending customers monthly fliers and promotions.
* Collecting real-time metrics for things like blocked email and customer engagement.
* Forwarding customer inquiries.
* Processing incoming emails.

For more information, visit [https://sendgrid.com](https://sendgrid.com) or
SendGrid's [C# library][sendgrid-csharp] GitHub repo.

## Create a SendGrid Account
[!INCLUDE [sendgrid-sign-up](../../includes/sendgrid-sign-up.md)]

## Reference the SendGrid .NET Class Library
The [SendGrid NuGet package](https://www.nuget.org/packages/Sendgrid) is the easiest way to get the SendGrid API and to configure your application with all dependencies. NuGet is a Visual Studio extension included with Microsoft Visual Studio 2015 and above that makes it easy to install and update libraries and tools.

> [!NOTE]
> To install NuGet if you are running a version of Visual Studio earlier than Visual Studio 2015, visit [http://www.nuget.org](http://www.nuget.org), and click the **Install NuGet** button.
>
>

To install the SendGrid NuGet package in your application, do the following:

1. Click on **New Project** and select a **Template**.

   ![Create a new project][create-new-project]
2. In **Solution Explorer**, right-click **References**, then click
   **Manage NuGet Packages**.

   ![SendGrid NuGet package][SendGrid-NuGet-package]
3. Search for **SendGrid** and select the **SendGrid** item in the
   results list.
4. Select the latest stable version of the Nuget package from the version dropdown to be able to work with the object model and APIs demonstrated in this article.

   ![SendGrid package][sendgrid-package]
5. Click **Install** to complete the installation, and then close this
   dialog.

SendGrid's .NET class library is called **SendGrid**. It contains the following namespaces:

* **SendGrid** for communicating with SendGrid’s API.
* **SendGrid.Helpers.Mail** for helper methods to easily create SendGridMessage objects that specify how to send emails.

Add the following code namespace declarations to the top of any C# file in which you want to programmatically access the SendGrid email service.

    using SendGrid;
    using SendGrid.Helpers.Mail;

## How to: Create an Email
Use the **SendGridMessage** object to create an email message. Once the message object is created, you can set properties and methods, including the email sender, the email recipient, and the subject and body of the email.

The following example demonstrates how to create a fully populated email object:

    var msg = new SendGridMessage();

    msg.SetFrom(new EmailAddress("dx@example.com", "SendGrid DX Team"));

    var recipients = new List<EmailAddress>
    {
        new EmailAddress("jeff@example.com", "Jeff Smith"),
        new EmailAddress("anna@example.com", "Anna Lidman"),
        new EmailAddress("peter@example.com", "Peter Saddow")
    };
    msg.AddTos(recipients);

    msg.SetSubject("Testing the SendGrid C# Library");

    msg.AddContent(MimeType.Text, "Hello World plain text!");
    msg.AddContent(MimeType.Html, "<p>Hello World!</p>");

For more information on all properties and methods supported by the
**SendGrid** type, see [sendgrid-csharp][sendgrid-csharp] on GitHub.

## How to: Send an Email
After creating an email message, you can send it using SendGrid's API. Alternatively, you may use [.NET's built in library][NET-library].

Sending email requires that you supply your SendGrid API Key. If you need details about how to configure API Keys, please visit SendGrid's API Keys [documentation][documentation].

You may store these credentials via your Azure Portal by clicking Application settings and adding the key/value pairs under App settings.

 ![Azure app settings][azure_app_settings]

 Then, you may access them as follows:

    var apiKey = System.Environment.GetEnvironmentVariable("SENDGRID_APIKEY");
    var client = new SendGridClient(apiKey);

The following examples show how to send a message using the Web API.

    using System;
    using System.Threading.Tasks;
    using SendGrid;
    using SendGrid.Helpers.Mail;

    namespace Example
    {
        internal class Example
        {
            private static void Main()
            {
                Execute().Wait();
            }

            static async Task Execute()
            {
                var apiKey = System.Environment.GetEnvironmentVariable("SENDGRID_APIKEY");
                var client = new SendGridClient(apiKey);
                var msg = new SendGridMessage()
                {
                    From = new EmailAddress("test@example.com", "DX Team"),
                    Subject = "Hello World from the SendGrid CSharp SDK!",
                    PlainTextContent = "Hello, Email!",
                    HtmlContent = "<strong>Hello, Email!</strong>"
                };
                msg.AddTo(new EmailAddress("test@example.com", "Test User"));
                var response = await client.SendEmailAsync(msg);
            }
        }
    }

## How to: Add an attachment
Attachments can be added to a message by calling the **AddAttachment** method and minimally specifying the file name and Base64 encoded content you want to attach. You can include multiple attachments by calling this method once for each file you wish to attach or by using the **AddAttachments** method. The following example demonstrates adding an attachment to a message:

    var banner2 = new Attachment()
    {
        Content = Convert.ToBase64String(raw_content),
        Type = "image/png",
        Filename = "banner2.png",
        Disposition = "inline",
        ContentId = "Banner 2"
    };
    msg.AddAttachment(banner2);

## How to: Use mail settings to enable footers, tracking, and analytics
SendGrid provides additional email functionality through the use of mail settings and tracking settings. These settings can be added to an email message to enable specific functionality such as click tracking, Google analytics, subscription tracking, and so on. For a full list of apps, see the [Settings Documentation][settings-documentation].

Apps can be applied to **SendGrid** email messages using methods implemented as part of the **SendGridMessage** class. The following examples demonstrate the footer and click tracking filters:

The following examples demonstrate the footer and click tracking
filters:

### Footer settings
    msg.SetFooterSetting(
                         true,
                         "Some Footer HTML",
                         "<strong>Some Footer Text</strong>");

### Click tracking
    msg.SetClickTracking(true);

## How to: Use Additional SendGrid Services
SendGrid offers several APIs and webhooks that you can use to leverage additional functionality within your Azure application. For more details, see the [SendGrid API Reference][SendGrid API documentation].

## Next steps
Now that you've learned the basics of the SendGrid Email service, follow
these links to learn more.

* SendGrid C\# library repo: [sendgrid-csharp][sendgrid-csharp]
* SendGrid API documentation: <https://sendgrid.com/docs>

[Next steps]: #next-steps
[What is the SendGrid Email Service?]: #whatis
[Create a SendGrid Account]: #createaccount
[Reference the SendGrid .NET Class Library]: #reference
[How to: Create an Email]: #createemail
[How to: Send an Email]: #sendemail
[How to: Add an Attachment]: #addattachment
[How to: Use Filters to Enable Footers, Tracking, and Analytics]: #usefilters
[How to: Use Additional SendGrid Services]: #useservices

[create-new-project]: ./media/sendgrid-dotnet-how-to-send-email/new-project.png
[SendGrid-NuGet-package]: ./media/sendgrid-dotnet-how-to-send-email/reference.png
[sendgrid-package]: ./media/sendgrid-dotnet-how-to-send-email/sendgrid-package.png
[azure_app_settings]: ./media/sendgrid-dotnet-how-to-send-email/azure-app-settings.png
[sendgrid-csharp]: https://github.com/sendgrid/sendgrid-csharp
[SMTP vs. Web API]: https://sendgrid.com/docs/Integrate/index.html
[App Settings]: https://sendgrid.com/docs/API_Reference/SMTP_API/apps.html
[SendGrid API documentation]: https://sendgrid.com/docs/API_Reference/api_v3.html
[NET-library]: https://sendgrid.com/docs/Integrate/Code_Examples/v2_Mail/csharp.html#-Using-NETs-Builtin-SMTP-Library
[documentation]: https://sendgrid.com/docs/Classroom/Send/api_keys.html
[settings-documentation]: https://sendgrid.com/docs/API_Reference/SMTP_API/apps.html

[cloud-based email service]: https://sendgrid.com/solutions
[transactional email delivery]: https://sendgrid.com/use-cases/transactional-email

