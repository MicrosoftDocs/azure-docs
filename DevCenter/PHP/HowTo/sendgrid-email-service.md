<properties linkid="dev-php-how-to-sendgrid-email-service" urldisplayname="SendGrid Email Service" headerexpose="" pagetitle="SendGrid Email Service - How To - PHP - Develop" metakeywords="" footerexpose="" metadescription="" umbraconavihide="0" disquscomments="1"></properties>

# How to Use the SendGrid Email Service from PHP

This guide demonstrates how to perform common programming tasks with the
SendGrid email service on Windows Azure. The samples are written in PHP.
The scenarios covered include **constructing email**, **sending email**,
and **adding attachments**. For more information on SendGrid and sending
email, see the [Next Steps][] section.

## Table of Contents

-   [What is the SendGrid Email Service][]
-   [Create a SendGrid Account][]
-   [Using SendGrid from your PHP Application][]
-   [How To: Send an Email][]
-   [How To: Add an Attachment][]
-   [How to: Use Filters to Enable Footers, Tracking, and Analytics][]
-   [How to: Use Additional SendGrid Services][]
-   [Next Steps][]

## <a name="bkmk_WhatIsSendGrid"> </a>What is the SendGrid Email Service?

SendGrid is a cloud-based email service that provides reliable email
delivery, scalability, and real-time analytics along with flexible APIs
that make custom integration easy. Common SendGrid usage scenarios
include:

-   Automatically sending receipts to customers.
-   Administering distribution lists for sending customers monthly
    e-fliers and special offers.
-   Collecting real-time metrics for things like blocked e-mail, and
    customer responsiveness.
-   Generating reports to help identify trends.
-   Forwarding customer inquiries.

For more information, see [http://sendgrid.com][].

## <a name="bkmk_CreateSendGrid"> </a>Create a SendGrid Account

To get started with SendGrid, evaluate pricing and sign up at
[http://sendgrid.com/pricing.html][]. Windows Azure customers receive a
[special offer][] of 25,000 free emails per month from SendGrid. To
sign-up for this offer, or get more information, please visit
[http://www.sendgrid.com/azure.html][special offer].

For more detailed information, see the SendGrid documentation at
[http://docs.sendgrid.com/documentation/get-started/][]. For information
about additional services provided by SendGrid, see
[http://sendgrid.com/features][].

## <a name="bkmk_UsingSendGridfromPHP"> </a>Using SendGrid from your PHP Application

Using SendGrid in a Windows Azure PHP application requires no special
configuration or coding. Because SendGrid is a service, it can be
accessed in exactly the same way from a cloud application as it can from
an on-premises application.

After adding email support to your application, you can package and
deploy your application by following the methods outlined here:
[Packaging and Deploying PHP Applications for Windows Azure][].

## <a name="bkmk_HowToSendEmail"> </a>How to: Send an Email

You can send email using either SMTP or the Web API provided by
SendGrid. For details about the benefits and drawbacks of each API, see
[SMTP vs. Web API][] in the SendGrid documentation.

### SMTP API

To send email using the SendGrid SMTP API, use *Swift Mailer*, a
component-based library for sending emails from PHP applications. You
can download the *Swift Mailer* library from
[http://swiftmailer.org/download][]. Sending email with the library
involves creating instances of the
<span class="auto-style2">Swift\_SmtpTransport</span>,
<span class="auto-style2">Swift\_Mailer</span>, and
<span class="auto-style2">Swift\_Message</span> classes, setting the
appropriate properties, and calling the
<span class="auto-style2">Swift\_Mailer::send</span> method.

    <?php
     include_once "lib/swift_required.php";
     /*
      * Create the body of the message (a plain-text and an HTML version).
      * $text is your plain-text email
      * $html is your html version of the email
      * If the reciever is able to view html emails then only the html
      * email will be displayed
      */ 
     $text = "Hi!\nHow are you?\n";
     $html = <<<EOM
           <html>
           <head></head>
           <body>
               <p>Hi!<br>
                   How are you?<br>
               </p>
           </body>
           </html>
           EOM;
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

**Note:**The example script above is taken from the SendGrid
documentation here:
[http://docs.sendgrid.com/documentation/get-started/integrate/examples/php-email-example-using-smtp/][].

For more information about the SMTP API and the X-SMTPAPI header, see
the SMTP API Developer’s Guide in the SendGrid documentation here:
[http://docs.sendgrid.com/documentation/api/smtp-api/developers-guide/][].
For more examples of using the SMTP API with PHP, see the SendGrid
documentation here:
[http://docs.sendgrid.com/documentation/api/smtp-api/php-example/][].

### Web API

Use PHP’s [curl function][] to send email using the SendGrid Web API.

    <?php

     $url = 'http://sendgrid.com/';
     $user = 'USERNAME';
     $pass = 'PASSWORD'; 

     $params = array(
          'api_user' => $user,
          'api_key' => $pass,
          'to' => 'john@contoso.com',
          'subject' => 'testing from curl',
          'html' => 'testing body',
          'text' => 'testing body',
          'from' => 'anna@sendgrid.com',
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

**Note:**The example script above is taken from the SendGrid
documentation here:
[http://docs.sendgrid.com/documentation/get-started/integrate/examples/php-example-using-the-web-api/][].

**Note:**SendGrid’s Web API is very similar to a REST API, though it is
not truly a RESTful API since, in most calls, both GET and POST verbs
can be used interchangeably.

For an overview of the Web API, see the SendGrid documentation here:
[http://docs.sendgrid.com/documentation/api/web-api/][].

For a complete list of parameters and generic examples for the send mail
API, see [http://docs.sendgrid.com/documentation/api/web-api/mail/][].

## <a name="bkmk_HowToAddAttachment"> </a>How to: Add an Attachment

### SMTP API

Sending an attachment using the SMTP API involves one additional line of
code to the example script for sending an email with Swift Mailer.

    <?php
     include_once "lib/swift_required.php";
     /*
      * Create the body of the message (a plain-text and an HTML version).
      * $text is your plain-text email
      * $html is your html version of the email
      * If the reciever is able to view html emails then only the html
      * email will be displayed
      */
     $text = "Hi!\nHow are you?\n";
      $html = <<<EOM
          <html>
          <head></head>
          <body>
             <p>Hi!<br>
                How are you?<br>
             </p>
          </body>
          </html>
     EOM;

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
     $message->attach(Swift_Attachment::fromPath("path\to\file")->setFileName(“file_name”));
     
     // send message 
     if ($recipients = $swift->send($message, $failures))
     {
          // This will let us know how many users received this message
          echo 'Message sent out to '.$recipients.' users';
     }
     // something went wrong =(
     else
     {
          echo "Something went wrong - "
          print_r($failures);
     }

**Note:**The example script above is taken from the SendGrid
documentation here:
[http://docs.sendgrid.com/documentation/get-started/integrate/examples/php-email-example-using-smtp/][].

The additional line of code is as follows:

     $message->attach(Swift_Attachment::fromPath("path\to\file")->setFileName(“file_name”));

This line of code calls the attach method on the
<span class="auto-style2">Swift\_Message</span> object and uses static
method <span class="auto-style2">fromPath</span> on the
<span class="auto-style2">Swift\_Attachment</span> class to get and
attach a file to a message.

### Web API

Sending an attachment using the Web API is very similar to sending an
email using the Web API. However, note that in the example that follows,
the parameter array must contain this element:

     'files['.$fileName.']' => '@'.$filePath.'/'.$fileName

    <?php

     $url = 'http://sendgrid.com/';
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
         'from' => 'anna@sendgrid.com',
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

**Note:**The example script above is taken from the SendGrid
documentation here:
[http://docs.sendgrid.com/documentation/get-started/integrate/examples/php-example-using-the-web-api/][].

## <a name="bkmk_HowToUseFilters"> </a>How to: Use Filters to Enable Footers, Tracking, and Analytics

SendGrid provides additional email functionality through the use of
‘filters’. These are settings that can be added to an email message to
enable specific functionality such as enabling click tracking, Google
analytics, subscription tracking, and so on. For a full list of filters,
see [Filter Settings][].

Filters can be applied to a message by using the filters property. Each
filter is specified by a hash containing filter-specific settings. The
following example enables the footer filter and specifies a text message
that will be appended to the bottom of the email message:

    <?php
     /*
      * This example is used for Swift Mailer V4
      */
     include "./lib/swift_required.php";
     include 'SmtpApiHeader.php';
     
     $hdr = new SmtpApiHeader();
     // The list of addresses this message will be sent to
     // [This list is used for sending multiple emails using just ONE request to 
     SendGrid]
     $toList = array('john@contoso.com', 'anna@contoso.com');
     
     // Specify the names of the recipients
     $nameList = array('Name 1', 'Name 2');
     
     // Used as an example of variable substitution
     $timeList = array('4 PM', '5 PM');
     
     // Set all of the above variables
     $hdr->addTo($toList);
     $hdr->addSubVal('-name-', $nameList);
     $hdr->addSubVal('-time-', $timeList);
     
     // Specify that this is an initial contact message
     $hdr->setCategory("initial");
     
     // You can optionally setup individual filters here, in this example, we have 
     enabled the footer filter
     $hdr->addFilterSetting('footer', 'enable', 1);
     $hdr->addFilterSetting('footer', "text/plain", "Thank you for your business");
     
     // The subject of your email
     $subject = 'Example SendGrid Email';
     
     // Where is this message coming from. For example, this message can be from support@yourcompany.com, info@yourcompany.com
     $from = array('someone@example.com' =&gt; 'Name Of Your Company');
     
     // If you do not specify a sender list above, you can specifiy the user here. If 
     // a sender list IS specified above, this email address becomes irrelevant.
     $to = array('john@contoso.com'=&gt;'Personal Name Of Recipient');
     
     # Create the body of the message (a plain-text and an HTML version). 
     # text is your plain-text email 
     # html is your html version of the email
     # if the receiver is able to view html emails then only the html
     # email will be displayed
     
     /*
     * Note the variable substitution here =)
     */
     $text = <<<EOM 
     Hello -name-,
     Thank you for your interest in our products. We have set up an appointment to call you at -time- EST to discuss your needs in more detail.
     Regards,
     Fred
     EOM;
     
     $html = <<<EOM
     < html> 
     <head></head>
     <body>
     <p>Hello -name-,<br>
     Thank you for your interest in our products. We have set up an appointment
     to call you at -time- EST to discuss your needs in more detail.
     
     Regards,
     
     Fred, How are you?<br>
     </p>
     </body>
     < /html>
     EOM;
     
     // Your SendGrid account credentials
     $username = 'sendgridusername@yourdomain.com';
     $password = 'example';
     
     // Create new swift connection and authenticate
     $transport = Swift_SmtpTransport::newInstance('smtp.sendgrid.net', 25);
     $transport ->setUsername($username);
     $transport ->setPassword($password);
     $swift = Swift_Mailer::newInstance($transport);
     
     // Create a message (subject)
     $message = new Swift_Message($subject);
     
     // add SMTPAPI header to the message
     // *****IMPORTANT NOTE*****
     // SendGrid's asJSON function escapes characters. If you are using Swift 
     Mailer's
     // PHP Mailer functions, the getTextHeader function will also escape characters.
     // This can cause the filter to be dropped.
     $headers = $message->getHeaders();
     $headers->addTextHeader('X-SMTPAPI', $hdr->asJSON());
     
     // attach the body of the email
     $message->setFrom($from);
     $message->setBody($html, 'text/html');
     $message->setTo($to);
     $message->addPart($text, 'text/plain');
     
     // send message
     if ($recipients = $swift->send($message, $failures))
     {
     // This will let us know how many users received this message
     // If we specify the names in the X-SMTPAPI header, then this will always be 1.
     echo 'Message sent out to '.$recipients.' users';
     }

     // something went wrong =(
     else
     {
     echo "Something went wrong - ";
     print_r($failures);
     }

**Note:**The example script above is taken from the SendGrid
documentation here:
[http://docs.sendgrid.com/documentation/api/smtp-api/php-example/][].

## <a name="bkmk_HowToUseAdditionalSvcs"> </a>How to: Use Additional SendGrid Services

SendGrid offers web-based APIs that you can use to leverage additional
SendGrid functionality from your Windows Azure application. For full
details, see the [SendGrid API documentation][].

## <a name="bkmk_NextSteps"> </a>Next Steps

Now that you’ve learned the basics of the SendGrid Email service, follow
these links to learn more.

-   SendGrid API documentation:
    [http://docs.sendgrid.com/documentation/api/][SendGrid API
    documentation]
-   SendGrid special offer for Windows Azure customers:
    [http://sendgrid.com/azure.html][]

  [Next Steps]: #bkmk_NextSteps
  [What is the SendGrid Email Service]: #bkmk_WhatIsSendGrid
  [Create a SendGrid Account]: #bkmk_CreateSendGrid
  [Using SendGrid from your PHP Application]: #bkmk_UsingSendGridfromPHP
  [How To: Send an Email]: #bkmk_HowToSendEmail
  [How To: Add an Attachment]: #bkmk_HowToAddAttachment
  [How to: Use Filters to Enable Footers, Tracking, and Analytics]: #bkmk_HowToUseFilters
  [How to: Use Additional SendGrid Services]: #bkmk_HowToUseAdditionalSvcs
  [http://sendgrid.com]: http://sendgrid.com
  [http://sendgrid.com/pricing.html]: http://sendgrid.com/pricing.html
  [special offer]: http://www.sendgrid.com/azure.html
  [http://docs.sendgrid.com/documentation/get-started/]: http://docs.sendgrid.com/documentation/get-started/
  [http://sendgrid.com/features]: http://sendgrid.com/features
  [Packaging and Deploying PHP Applications for Windows Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/hh674499(v=VS.103).aspx
  [SMTP vs. Web API]: http://docs.sendgrid.com/documentation/get-started/integrate/examples/smtp-vs-rest/
  [http://swiftmailer.org/download]: http://swiftmailer.org/download
  [http://docs.sendgrid.com/documentation/get-started/integrate/examples/php-email-example-using-smtp/]:
    http://docs.sendgrid.com/documentation/get-started/integrate/examples/php-email-example-using-smtp/
  [http://docs.sendgrid.com/documentation/api/smtp-api/developers-guide/]:
    http://docs.sendgrid.com/documentation/api/smtp-api/developers-guide/
  [http://docs.sendgrid.com/documentation/api/smtp-api/php-example/]: http://docs.sendgrid.com/documentation/api/smtp-api/php-example/
  [curl function]: http://php.net/curl
  [http://docs.sendgrid.com/documentation/get-started/integrate/examples/php-example-using-the-web-api/]:
    http://docs.sendgrid.com/documentation/get-started/integrate/examples/php-example-using-the-web-api/
  [http://docs.sendgrid.com/documentation/api/web-api/]: http://docs.sendgrid.com/documentation/api/web-api/
  [http://docs.sendgrid.com/documentation/api/web-api/mail/]: http://docs.sendgrid.com/documentation/api/web-api/mail/
  [Filter Settings]: http://docs.sendgrid.com/documentation/api/smtp-api/filter-settings/
  [SendGrid API documentation]: http://docs.sendgrid.com/documentation/api/
  [http://sendgrid.com/azure.html]: http://sendgrid.com/azure.html
