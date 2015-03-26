<properties 
	pageTitle="How to use the SendGrid email service (.NET) - Azure" 
	description="Learn how send email with the SendGrid email service on Azure. Code samples written in C# and use the .NET API." 
	services="app-service\web" 
	documentationCenter=".net" 
	authors="thinkingserious" 
	manager="sendgrid" 
	editor="erikre"/>

<tags 
	ms.service="app-service-web" 
	ms.workload="na" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="02/24/2015" 
	ms.author="elmer.thomas@sendgrid.com; erika.berkland@sendgrid.com; vibhork"/>





# How to Send Email Using SendGrid with Azure

Last Update: Feburary 24, 2015

<h2><a name="overview"></a><span  class="short-header">Overview</span></h2>

This guide demonstrates how to perform common programming tasks with the
SendGrid email service on Azure. The samples are written in C\#
and use the .NET API. The scenarios covered include **constructing
email**, **sending email**, **adding attachments**, and **using
filters**. For more information on SendGrid and sending email, see the
[Next steps][] section.

<h2><a name="whatis"></a><span  class="short-header">What is the SendGrid email service?</span></h2>

SendGrid is a [cloud-based email service] that provides reliable
[transactional email delivery], scalability, and real-time analytics along with flexible APIs
that make custom integration easy. Common SendGrid usage scenarios
include:

-   Automatically sending receipts to customers.
-   Administering distribution lists for sending customers monthly
    e-fliers and special offers.
-   Collecting real-time metrics for things like blocked email, and
    customer responsiveness.
-   Generating reports to help identify trends.
-   Forwarding customer inquiries.
-   Processing incoming emails.

For more information, see [https://sendgrid.com](https://sendgrid.com).

<h2><a name="createaccount"></a>Create a SendGrid account</h2>

[AZURE.INCLUDE [sendgrid-sign-up](../includes/sendgrid-sign-up.md)]

<h2><a name="reference"></a>Reference the SendGrid .NET class library</h2>

The [SendGrid NuGet package](https://www.nuget.org/packages/Sendgrid) is the easiest way to get the SendGrid API
and to configure your application with all dependencies. NuGet is a
Visual Studio extension included with Microsoft Visual Studio 2012 that makes it easy to install and update
libraries and tools. 

> [AZURE.NOTE] To install NuGet if you are running a version of Visual Studio earlier than Visual Studio 2012, visit [http://www.nuget.org](http://www.nuget.org), and click the **Install NuGet** button.

To install the SendGrid NuGet package in your application, do the following:

1.  In **Solution Explorer**, right-click **References**, then click
    **Manage NuGet Packages**.

2.  In the left-hand pane of the **Manage NuGet Packages** dialog, click **Online**.

3.  Search for **SendGrid** and select the **SendGrid** item in the
    results list (the current version is 5.0.0).

    ![SendGrid NuGet package][SendGrid-NuGet-package]

4.  Click **Install** to complete the installation, and then close this
    dialog.

SendGrid's .NET class library is called **SendGridMail**. It contains
the following namespaces:

-   **SendGridMail** for creating and working with email items.
-   **SendGridMail.Transport** for sending email using either the
    **SMTP** protocol, or the HTTP 1.1 protocol with **Web/REST**.

Add the following code namespace declarations to the top of any C\# file
in which you want to programmatically access the SendGrid email service.
**System.Net** and **System.Net.Mail** are .NET Framework namespaces
that are included because they include types you will commonly use with
the SendGrid APIs.

    using System;
    using System.Net;
    using System.Net.Mail;
    using SendGrid;

<h2><a name="createemail"></a>How to: Create an email</h2>

Use the **SendGridMessage** object to create an email
message. Once the message object is created, you
can set properties and methods, including the
email sender, the email recipient, and the subject and body of the
email.

The following example demonstrates how to create a fully populated email
object:

    // Create the email object first, then add the properties.
    var myMessage = new SendGridMessage();

    // Add the message properties.
    myMessage.From = new MailAddress("john@example.com");

    // Add multiple addresses to the To field.
    List<String> recipients = new List<String>
    {
        @"Jeff Smith <jeff@example.com>",
        @"Anna Lidman <anna@example.com>",
        @"Peter Saddow <peter@example.com>"
    };

    myMessage.AddTo(recipients);

    myMessage.Subject = "Testing the SendGrid Library";

    //Add the HTML and Text bodies
    myMessage.Html = "<p>Hello World!</p>";
    myMessage.Text = "Hello World plain text!";

For more information on all properties and methods supported by the
**SendGrid** type, see [sendgrid-csharp][] on GitHub.

<h2><a name="sendemail"></a>How to: Send an email</h2>

After creating an email message, you can send it using
the Web API provided by SendGrid. Alternatively, you may [use .NET's built in library](https://sendgrid.com/docs/Code_Examples/csharp.html).

Sending email requires that you supply your
SendGrid account credentials (username and password). The following code
demonstrates how to wrap your credentials in a **NetworkCredential**
object:
    
    // Create network credentials to access your SendGrid account
    var username = "your_sendgrid_username";
    var pswd = "your_sendgrid_password";

    /* Alternatively, you may store these credentials via your Azure portal
       by clicking CONFIGURE and adding the key/value pairs under "app settings".
       Then, you may access them as follows: 
       var username = System.Environment.GetEnvironmentVariable("SENDGRID_USER"); 
       var pswd = System.Environment.GetEnvironmentVariable("SENDGRID_PASS");
       assuming you named your keys SENDGRID_USER and SENDGRID_PASS */

    var credentials = new NetworkCredential(username, pswd);

The following examples show how to send a message using the Web API.

    // Create the email object first, then add the properties.
    SendGridMessage myMessage = new SendGridMessage();
    myMessage.AddTo("anna@example.com");
    myMessage.From = new MailAddress("john@example.com", "John Smith");
    myMessage.Subject = "Testing the SendGrid Library";
    myMessage.Text = "Hello World!";

    // Create credentials, specifying your user name and password.
    var credentials = new NetworkCredential("username", "password");

    // Create an Web transport for sending email.
    var transportWeb = new Web(credentials);

    // Send the email.
    // You can also use the **DeliverAsync** method, which returns an awaitable task.
    transportWeb.Deliver(myMessage);

<h2><a name="addattachment"></a>How to: Add an attachment</h2>

Attachments can be added to a message by calling the **AddAttachment**
method and specifying the name and path of the file you want to attach.
You can include multiple attachments by calling this method once for
each file you wish to attach. The following example demonstrates adding
an attachment to a message:

    SendGridMessage myMessage = new SendGridMessage();
    myMessage.AddTo("anna@example.com");
    myMessage.From = new MailAddress("john@example.com", "John Smith");
    myMessage.Subject = "Testing the SendGrid Library";
    myMessage.Text = "Hello World!";

    myMessage.AddAttachment(@"C:\file1.txt");
    
You can also add attachments from the data's **Stream**. It can be done by calling the same method as above, **AddAttachment**, but by passing in the Stream of the data, and the filename you want it to show as in the message. In this case you will need to add the System.IO library.

    SendGridMessage myMessage = new SendGridMessage();
    myMessage.AddTo("anna@example.com");
    myMessage.From = new MailAddress("john@example.com", "John Smith");
    myMessage.Subject = "Testing the SendGrid Library";
    myMessage.Text = "Hello World!";

    using (var attachmentFileStream = new FileStream(@"C:\file.txt", FileMode.Open))
    {
        myMessage.AddAttachment(attachmentFileStream, "My Cool File.txt");
    }


<h2><a name="usefilters"></a><span  class="short-header">How to: Use apps to enable footers, tracking, and analytics</span></h2>

SendGrid provides additional email functionality through the use of
apps. These are settings that can be added to an email message to
enable specific functionality such as click tracking, Google analytics,
subscription tracking, and so on. For a full list of apps, see
[App Settings][].

Apps can be applied to **SendGrid** email messages using methods
implemented as part of the **SendGrid** class.

The following examples demonstrate the footer and click tracking
filters:

### Footer

    // Create the email object first, then add the properties.
    SendGridMessage myMessage = new SendGridMessage();
    myMessage.AddTo("anna@example.com");
    myMessage.From = new MailAddress("john@example.com", "John Smith");
    myMessage.Subject = "Testing the SendGrid Library";
    myMessage.Text = "Hello World!";

    // Add a footer to the message.
    myMessage.EnableFooter("PLAIN TEXT FOOTER", "<p><em>HTML FOOTER</em></p>");

### Click tracking

    // Create the email object first, then add the properties.
    SendGridMessage myMessage = new SendGridMessage();
    myMessage.AddTo("anna@example.com");
    myMessage.From = new MailAddress("john@example.com", "John Smith");
    myMessage.Subject = "Testing the SendGrid Library";
    myMessage.Html = "<p><a href=\"http://www.example.com\">Hello World Link!</a></p>";
    myMessage.Text = "Hello World!";
    
    // true indicates that links in plain text portions of the email 
    // should also be overwritten for link tracking purposes. 
    myMessage.EnableClickTracking(true);

<h2><a name="useservices"></a>How to: Use additional SendGrid services</h2>

SendGrid offers web-based APIs and webhooks that you can use to leverage additional
SendGrid functionality from your Azure application. For full
details, see the [SendGrid API documentation][].

<h2><a name="nextsteps"></a>Next steps</h2>

Now that you've learned the basics of the SendGrid Email service, follow
these links to learn more.

* SendGrid C\# library repo: [sendgrid-csharp][]
*   SendGrid API documentation: <https://sendgrid.com/docs>
*   SendGrid special offer for Azure customers: [https://sendgrid.com](https://sendgrid.com)

  [Next steps]: #nextsteps
  [What is the SendGrid Email Service?]: #whatis
  [Create a SendGrid Account]: #createaccount
  [Reference the SendGrid .NET Class Library]: #reference
  [How to: Create an Email]: #createemail
  [How to: Send an Email]: #sendemail
  [How to: Add an Attachment]: #addattachment
  [How to: Use Filters to Enable Footers, Tracking, and Analytics]: #usefilters
  [How to: Use Additional SendGrid Services]: #useservices
  
  
  [special offer]: https://www.sendgrid.com/windowsazure.html
  
  
  
  [SendGrid-NuGet-package]: ./media/sendgrid-dotnet-how-to-send-email/sendgrid01.png
  [sendgrid-csharp]: https://github.com/sendgrid/sendgrid-csharp
  [SMTP vs. Web API]: https://sendgrid.com/docs/Integrate/index.html
  [App Settings]: https://sendgrid.com/docs/API_Reference/SMTP_API/apps.html
  [SendGrid API documentation]: https://sendgrid.com/docs
  
  [cloud-based email service]: https://sendgrid.com/email-solutions
  [transactional email delivery]: https://sendgrid.com/transactional-email
