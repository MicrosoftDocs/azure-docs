---
title: How to use the SendGrid email service (PHP) | Microsoft Docs
description: Learn how send email with the SendGrid email service on Azure. Code samples written in PHP.
documentationcenter: php
services: ''
manager: sendgrid
editor: mollybos
author: thinkingserious

ms.assetid: 51a9928a-4c9e-4b0a-aca8-9a408aeb6f47
ms.service: multiple
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: PHP
ms.topic: article
ms.date: 10/30/2014
ms.author: elmer.thomas@sendgrid.com; erika.berkland@sendgrid.com; vibhork; matt.bernier@sendgrid.com

---
# How to Use the SendGrid Email Service from PHP

This guide demonstrates how to perform common programming tasks with the SendGrid email service on Azure. The samples are written in PHP.
The scenarios covered include **constructing email**, **sending email**, and **adding attachments**. For more information on SendGrid and sending email, see the [Next Steps](#next-steps) section.

## What is the SendGrid Email Service?
SendGrid is a [cloud-based email service] that provides reliable
[transactional email delivery], scalability, and real-time analytics along with flexible APIs
that make custom integration easy. Common SendGrid usage scenarios
include:

* Automatically sending receipts to customers
* Administering distribution lists for sending customers monthly e-fliers and special offers
* Collecting real-time metrics for things like blocked e-mail, and customer responsiveness
* Generating reports to help identify trends
* Forwarding customer inquiries
* Email notifications from your application

For more information, see [https://sendgrid.com][https://sendgrid.com].

## Create a SendGrid Account

[!INCLUDE [sendgrid-sign-up](../includes/sendgrid-sign-up.md)]

## Using SendGrid from your PHP Application

Using SendGrid in an Azure PHP application requires no special
configuration or coding. Because SendGrid is a service, it can be
accessed in exactly the same way from a cloud application as it can from
an on-premises application.

## How to: Send an Email

You can send email using either SMTP or the Web API provided by
SendGrid.

### SMTP API

To send email using the SendGrid SMTP API, use *Swift Mailer*, a
component-based library for sending emails from PHP applications. You
can download the [Swift Mailer library](https://swiftmailer.symfony.com/) v5.3.0 (use [Composer] to install Swift Mailer). Sending email with the library
involves creating instances of the `Swift\_SmtpTransport`, `Swift\_Mailer`, and `Swift\_Message` classes, setting the appropriate properties, and calling the `Swift\_Mailer::send` method.

```php
<?php
 include_once "vendor/autoload.php";
 /*
  * Create the body of the message (a plain-text and an HTML version).
  * $text is your plain-text email
  * $html is your html version of the email
  * If the receiver is able to view html emails then only the html
  * email will be displayed
  */
 $text = "Hi!\nHow are you?\n";
 $html = "<html>
       <head></head>
       <body>
           <p>Hi!<br>
               How are you?<br>
           </p>
       </body>
       </html>";
 // This is your From email address
 $from = array('someone@example.com' => 'Name To Appear');
 // Email recipients
 $to = array(
       'john@contoso.com'=>'Destination 1 Name',
       'anna@contoso.com'=>'Destination 2 Name'
 );
 // Email subject
 $subject = 'Example PHP Email';

 // Login credentials
 $username = 'yoursendgridusername';
 $password = 'yourpassword';

 // Setup Swift mailer parameters
 $transport = Swift_SmtpTransport::newInstance('smtp.sendgrid.net', 587);
 $transport->setUsername($username);
 $transport->setPassword($password);
 $swift = Swift_Mailer::newInstance($transport);

 // Create a message (subject)
 $message = new Swift_Message($subject);

 // attach the body of the email
 $message->setFrom($from);
 $message->setBody($html, 'text/html');
 $message->setTo($to);
 $message->addPart($text, 'text/plain');

 // send message
 if ($recipients = $swift->send($message, $failures))
 {
     // This will let us know how many users received this message
     echo 'Message sent out to '.$recipients.' users';
 }
 // something went wrong =(
 else
 {
     echo "Something went wrong - ";
     print_r($failures);
 }
```

### Web API
Use PHP's [curl function][curl function] to send email using the SendGrid Web API.

```php
<?php

 $url = 'https://api.sendgrid.com/';
 $user = 'USERNAME';
 $pass = 'PASSWORD';

 $params = array(
      'api_user' => $user,
      'api_key' => $pass,
      'to' => 'john@contoso.com',
      'subject' => 'testing from curl',
      'html' => 'testing body',
      'text' => 'testing body',
      'from' => 'anna@contoso.com',
   );

 $request = $url.'api/mail.send.json';

 // Generate curl request
 $session = curl_init($request);

 // Tell curl to use HTTP POST
 curl_setopt ($session, CURLOPT_POST, true);

 // Tell curl that this is the body of the POST
 curl_setopt ($session, CURLOPT_POSTFIELDS, $params);

 // Tell curl not to return headers, but do return the response
 curl_setopt($session, CURLOPT_HEADER, false);
 curl_setopt($session, CURLOPT_RETURNTRANSFER, true);

 // obtain response
 $response = curl_exec($session);
 curl_close($session);

 // print everything out
 print_r($response);
```

SendGrid's Web API is very similar to a REST API, though it is
not truly a RESTful API since, in most calls, both GET and POST verbs
can be used interchangeably.

## How to: Add an Attachment

### SMTP API

Sending an attachment using the SMTP API involves one additional line of
code to the example script for sending an email with Swift Mailer.

```php
<?php
 include_once "vendor/autoload.php";
 /*
  * Create the body of the message (a plain-text and an HTML version).
  * $text is your plain-text email
  * $html is your html version of the email
  * If the reciever is able to view html emails then only the html
  * email will be displayed
  */
 $text = "Hi!\nHow are you?\n";
  $html = "<html>
      <head></head>
      <body>
         <p>Hi!<br>
            How are you?<br>
         </p>
      </body>
      </html>";

 // This is your From email address
 $from = array('someone@example.com' => 'Name To Appear');

 // Email recipients
 $to = array(
      'john@contoso.com'=>'Destination 1 Name',
      'anna@contoso.com'=>'Destination 2 Name'
 );
 // Email subject
 $subject = 'Example PHP Email';

 // Login credentials
 $username = 'yoursendgridusername';
 $password = 'yourpassword';

 // Setup Swift mailer parameters
 $transport = Swift_SmtpTransport::newInstance('smtp.sendgrid.net', 587);
 $transport->setUsername($username);
 $transport->setPassword($password);
 $swift = Swift_Mailer::newInstance($transport);

 // Create a message (subject)
 $message = new Swift_Message($subject);

 // attach the body of the email
 $message->setFrom($from);
 $message->setBody($html, 'text/html');
 $message->setTo($to);
 $message->addPart($text, 'text/plain');
 $message->attach(Swift_Attachment::fromPath("path\to\file")->setFileName("file_name"));

 // send message
 if ($recipients = $swift->send($message, $failures))
 {
      // This will let us know how many users received this message
      echo 'Message sent out to '.$recipients.' users';
 }
 // something went wrong =(
 else
 {
      echo "Something went wrong - ";
      print_r($failures);
 }
```

The additional line of code is as follows:

```php
 $message->attach(Swift_Attachment::fromPath("path\to\file")->setFileName('file_name'));
```

This line of code calls the attach method on the `Swift\_Message` object and uses static method `fromPath` on the `Swift\_Attachment` class to get and attach a file to a message.

### Web API

Sending an attachment using the Web API is very similar to sending an email using the Web API. However, note that in the example that follows, the parameter array must contain this element:

```php
    'files['.$fileName.']' => '@'.$filePath.'/'.$fileName
```

#### Example

```php
<?php

 $url = 'https://api.sendgrid.com/';
 $user = 'USERNAME';
 $pass = 'PASSWORD';

 $fileName = 'myfile';
 $filePath = dirname(__FILE__);

 $params = array(
     'api_user' => $user,
     'api_key' => $pass,
     'to' =>'john@contoso.com',
     'subject' => 'test of file sends',
     'html' => '<p> the HTML </p>',
     'text' => 'the plain text',
     'from' => 'anna@contoso.com',
     'files['.$fileName.']' => '@'.$filePath.'/'.$fileName
 );

 print_r($params);

 $request = $url.'api/mail.send.json';

 // Generate curl request
 $session = curl_init($request);

 // Tell curl to use HTTP POST
 curl_setopt ($session, CURLOPT_POST, true);

 // Tell curl that this is the body of the POST
 curl_setopt ($session, CURLOPT_POSTFIELDS, $params);

 // Tell curl not to return headers, but do return the response
 curl_setopt($session, CURLOPT_HEADER, false);
 curl_setopt($session, CURLOPT_RETURNTRANSFER, true);

 // obtain response
 $response = curl_exec($session);
 curl_close($session);

 // print everything out
 print_r($response);
```

## How to: Use Filters to Enable Footers, Tracking, and Analytics

SendGrid provides additional email functionality through the use of *filters*. These are settings that can be added to an email message to enable specific functionality such as enabling click tracking, Google analytics, subscription tracking, and so on.

Filters can be applied to a message by using the filters property. Each filter is specified by a hash containing filter-specific settings. The following example enables the footer filter and specifies a text message that will be appended to the bottom of the email message. For this example we will use [sendgrid-php library].

Use [Composer] to install library:

```bash
php composer.phar require sendgrid/sendgrid 2.1.1
```

### Example  

```php
<?php
 /*
  * This example is used for sendgrid-php V2.1.1 (https://github.com/sendgrid/sendgrid-php/tree/v2.1.1)
  */
 include "vendor/autoload.php";

 $email = new SendGrid\Email();
 // The list of addresses this message will be sent to
 // [This list is used for sending multiple emails using just ONE request to SendGrid]
 $toList = array('john@contoso.com', 'anna@contoso.com');

 // Specify the names of the recipients
 $nameList = array('Name 1', 'Name 2');

 // Used as an example of variable substitution
 $timeList = array('4 PM', '5 PM');

 // Set all of the above variables
 $email->setTos($toList);
 $email->addSubstitution('-name-', $nameList);
 $email->addSubstitution('-time-', $timeList);

 // Specify that this is an initial contact message
 $email->addCategory("initial");

 // You can optionally setup individual filters here, in this example, we have
 // enabled the footer filter
 $email->addFilter('footer', 'enable', 1);
 $email->addFilter('footer', "text/plain", "Thank you for your business");
 $email->addFilter('footer', "text/html", "Thank you for your business");

 // The subject of your email
 $subject = 'Example SendGrid Email';

 // Where is this message coming from. For example, this message can be from
 // support@yourcompany.com, info@yourcompany.com
 $from = 'someone@example.com';

 // If you do not specify a sender list above, you can specifiy the user here. If
 // a sender list IS specified above, this email address becomes irrelevant.
 $to = 'john@contoso.com';

 # Create the body of the message (a plain-text and an HTML version).
 # text is your plain-text email
 # html is your html version of the email
 # if the receiver is able to view html emails then only the html
 # email will be displayed

 /*
  * Note the variable substitution here =)
  */
 $text = "
 Hello -name-,
 Thank you for your interest in our products. We have set up an appointment to call you at -time- EST to discuss your needs in more detail.
 Regards,
 Fred";

 $html = "
 <html>
 <head></head>
 <body>
 <p>Hello -name-,<br>
 Thank you for your interest in our products. We have set up an appointment
 to call you at -time- EST to discuss your needs in more detail.

 Regards,

 Fred<br>
 </p>
 </body>
 </html>";

 // set subject
 $email->setSubject($subject);

 // attach the body of the email
 $email->setFrom($from);
 $email->setHtml($html);
 $email->addTo($to);
 $email->setText($text);

 // Your SendGrid account credentials
 $username = 'sendgridusername@yourdomain.com';
 $password = 'example';

 // Create SendGrid object
 $sendgrid = new SendGrid($username, $password);

 // send message
 $response = $sendgrid->send($email);

 print_r($response);
 ```

## Next Steps

Now that you've learned the basics of the SendGrid Email service, follow
these links to learn more.

* SendGrid documentation: <https://sendgrid.com/docs>
* SendGrid PHP library: <https://github.com/sendgrid/sendgrid-php>
* SendGrid special offer for Azure customers: <https://sendgrid.com/windowsazure.html>

For more information, see also the [PHP Developer Center](https://azure.microsoft.com/develop/php/).

[https://sendgrid.com]: https://sendgrid.com
[https://sendgrid.com/transactional-email/pricing]: https://sendgrid.com/transactional-email/pricing
[special offer]: https://www.sendgrid.com/windowsazure.html
[Packaging and Deploying PHP Applications for Azure]: http://msdn.microsoft.com/library/windowsazure/hh674499(v=VS.103).aspx
[http://swiftmailer.org/download]: http://swiftmailer.org/download
[curl function]: http://php.net/curl
[cloud-based email service]: https://sendgrid.com/email-solutions
[transactional email delivery]: https://sendgrid.com/transactional-email
[sendgrid-php library]: https://github.com/sendgrid/sendgrid-php/tree/v2.1.1
[Composer]: https://getcomposer.org/download/
