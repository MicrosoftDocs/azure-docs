---
title: How to use the SendGrid email service (Java) | Microsoft Docs
description: Learn how send email with the SendGrid email service on Azure. Code samples written in Java.
services: ''
documentationcenter: java
author: thinkingserious
manager: sendgrid
editor: mollybos

ms.assetid: cc75c43e-ede9-492b-98c2-9147fcb92c21
ms.service: multiple
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: Java
ms.topic: article
ms.date: 10/30/2014
ms.author: erikre
ms.reviewer: elmer.thomas@sendgrid.com; erika.berkland@sendgrid.com; vibhork

---
# How to Send Email Using SendGrid from Java
This guide demonstrates how to perform common programming tasks with the
SendGrid email service on Azure. The samples are written in
Java. The scenarios covered include **constructing email**, **sending
email**, **adding attachments**, **using filters**, and **updating
properties**. For more information on SendGrid and sending email, see
the [Next steps](#next-steps) section.

## What is the SendGrid Email Service?
SendGrid is a [cloud-based email service] that provides reliable
[transactional email delivery], scalability, and real-time analytics along with flexible APIs
that make custom integration easy. Common SendGrid usage scenarios
include:

* Automatically sending receipts to customers
* Administering distribution lists for sending customers monthly
  e-fliers and special offers
* Collecting real-time metrics for things like blocked e-mail, and
  customer responsiveness
* Generating reports to help identify trends
* Forwarding customer inquiries
* Email notifications from your application

For more information, see <https://sendgrid.com>.

## Create a SendGrid account
[!INCLUDE [sendgrid-sign-up](../includes/sendgrid-sign-up.md)]

## How to: Use the javax.mail libraries
Obtain the javax.mail libraries, for example from
<https://www.oracle.com/technetwork/java/javamail> and import them into
your code. At a high-level, the process for using the javax.mail library
to send email using SMTP is to do the following:

1. Specify the SMTP values, including the SMTP server, which for
   SendGrid is smtp.sendgrid.net.

```
        import java.util.Properties;
        import javax.mail.*;
        import javax.mail.internet.*;

        public class MyEmailer {
           private static final String SMTP_HOST_NAME = "smtp.sendgrid.net";
           private static final String SMTP_AUTH_USER = "your_sendgrid_username";
           private static final String SMTP_AUTH_PWD = "your_sendgrid_password";

           public static void main(String[] args) throws Exception{
               new MyEmailer().SendMail();
           }

           public void SendMail() throws Exception
           {
              Properties properties = new Properties();
                 properties.put("mail.transport.protocol", "smtp");
                 properties.put("mail.smtp.host", SMTP_HOST_NAME);
                 properties.put("mail.smtp.port", 587);
                 properties.put("mail.smtp.auth", "true");
                 // …
```

1. Extend the *javax.mail.Authenticator*
   class, and in your implementation of the
   *getPasswordAuthentication* method,
   return your SendGrid user name and password.  

       private class SMTPAuthenticator extends javax.mail.Authenticator {
       public PasswordAuthentication getPasswordAuthentication() {
          String username = SMTP_AUTH_USER;
          String password = SMTP_AUTH_PWD;
          return new PasswordAuthentication(username, password);
       }
2. Create an authenticated email session through a
   *javax.mail.Session* object.  

       Authenticator auth = new SMTPAuthenticator();
       Session mailSession = Session.getDefaultInstance(properties, auth);
3. Create your message and assign **To**, **From**, **Subject** and
   content values. This is shown in the [How To: Create an Email](#how-to-create-an-email) section.
4. Send the message through a
   *javax.mail.Transport* object. This
   is shown in the [How To: Send an Email][#how-to-send-an-email]
   section.

## How to: Create an email
The following shows how to specify values for an email.

    MimeMessage message = new MimeMessage(mailSession);
    Multipart multipart = new MimeMultipart("alternative");
    BodyPart part1 = new MimeBodyPart();
    part1.setText("Hello, Your Contoso order has shipped. Thank you, John");
    BodyPart part2 = new MimeBodyPart();
    part2.setContent(
        "<p>Hello,</p>
        <p>Your Contoso order has <b>shipped</b>.</p>
        <p>Thank you,<br>John</br></p>",
        "text/html");
    multipart.addBodyPart(part1);
    multipart.addBodyPart(part2);
    message.setFrom(new InternetAddress("john@contoso.com"));
    message.addRecipient(Message.RecipientType.TO,
       new InternetAddress("someone@example.com"));
    message.setSubject("Your recent order");
    message.setContent(multipart);

## How to: Send an email
The following shows how to send an email.

    Transport transport = mailSession.getTransport();
    // Connect the transport object.
    transport.connect();
    // Send the message.
    transport.sendMessage(message, message.getAllRecipients());
    // Close the connection.
    transport.close();

## How to: Add an attachment
The following code shows you how to add an attachment.

    // Local file name and path.
    String attachmentName = "myfile.zip";
    String attachmentPath = "c:\\myfiles\\";
    MimeBodyPart attachmentPart = new MimeBodyPart();
    // Specify the local file to attach.
    DataSource source = new FileDataSource(attachmentPath + attachmentName);
    attachmentPart.setDataHandler(new DataHandler(source));
    // This example uses the local file name as the attachment name.
    // They could be different if you prefer.
    attachmentPart.setFileName(attachmentName);
    multipart.addBodyPart(attachmentPart);

## How to: Use filters to enable footers, tracking, and analytics
SendGrid provides additional email functionality through the use of
*filters*. These are settings that can be added to an email message to
enable specific functionality such as enabling click tracking, Google
analytics, subscription tracking, and so on. For a full list of filters,
see [Filter Settings][Filter Settings].

* The following shows how to insert a footer filter that results in
  HTML text appearing at the bottom of the email being sent.

      message.addHeader("X-SMTPAPI",
          "{\"filters\":
          {\"footer\":
          {\"settings\":
          {\"enable\":1,\"text/html\":
          \"<html><b>Thank you</b> for your business.</html>\"}}}}");
* Another example of a filter is click tracking. Let’s say that your
  email text contains a hyperlink, such as the following, and you want
  to track the click rate:

      messagePart.setContent(
          "Hello,
          <p>This is the body of the message. Visit
          <a href='http://www.contoso.com'>http://www.contoso.com</a>.</p>
          Thank you.",
          "text/html");
* To enable the click tracking, use the following code:

      message.addHeader("X-SMTPAPI",
          "{\"filters\":
          {\"clicktrack\":
          {\"settings\":
          {\"enable\":1}}}}");

## How to: Update email properties
Some email properties can be overwritten using **set Property** or appended using **add Property**.

For example, to specify **ReplyTo** addresses, use the following:

    InternetAddress addresses[] =
        { new InternetAddress("john@contoso.com"),
          new InternetAddress("wendy@contoso.com") };

    message.setReplyTo(addresses);

To add a **Cc** recipient, use the following:

    message.addRecipient(Message.RecipientType.CC, new
    InternetAddress("john@contoso.com"));

## How to: Use additional SendGrid services
SendGrid offers web-based APIs that you can use to leverage additional
SendGrid functionality from your Azure application. For full
details, see the [SendGrid API documentation][SendGrid API documentation].

## Next steps
Now that you’ve learned the basics of the SendGrid Email service, follow
these links to learn more.

* Sample that demonstrates using SendGrid in an Azure deployment: [How to send email using SendGrid from Java in an Azure deployment](store-sendgrid-java-how-to-send-email-example.md)
* SendGrid Java SDK: <https://sendgrid.com/docs/Code_Examples/java.html>
* SendGrid API documentation: <https://sendgrid.com/docs/API_Reference/index.html>
* SendGrid special offer for Azure customers: <https://sendgrid.com/windowsazure.html>

[https://sendgrid.com]: https://sendgrid.com
[https://sendgrid.com/pricing.html]: https://sendgrid.com/pricing.html
[http://www.sendgrid.com/azure.html]: https://www.sendgrid.com/windowsazure.html
[https://sendgrid.com/features]: https://sendgrid.com/features
[https://www.oracle.com/technetwork/java/javamail]: https://www.oracle.com/technetwork/java/javamail/index.html
[Filter Settings]: https://sendgrid.com/docs/API_Reference/Web_API/filter_settings.html
[SendGrid API documentation]: https://sendgrid.com/docs/API_Reference/index.html
[https://sendgrid.com/azure.html]: https://sendgrid.com/windowsazure.html
[cloud-based email service]: https://sendgrid.com/email-solutions
[transactional email delivery]: https://sendgrid.com/transactional-email
