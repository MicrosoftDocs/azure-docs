<?xml version="1.0" encoding="utf-8"?>
<body>
  <properties linkid="dev-php-how-to-sendgrid-email-service" urlDisplayName="SendGrid Email Service" headerExpose="" pageTitle="SendGrid Email Service - How To - PHP - Develop" metaKeywords="" footerExpose="" metaDescription="" umbracoNaviHide="0" disqusComments="1" />
  <h1>How to Use the SendGrid Email Service from PHP</h1>
  <p>This guide demonstrates how to perform common programming tasks with the SendGrid email service on Windows Azure. The samples are written in PHP. The scenarios covered include <strong>constructing email</strong>, <strong>sending email</strong>, and <strong>adding attachments</strong>. For more information on SendGrid and sending email, see the <a href="#bkmk_NextSteps">Next Steps</a> section.</p>
  <h2>Table of Contents</h2>
  <ul>
    <li>
      <a href="#bkmk_WhatIsSendGrid">What is the SendGrid Email Service</a>
    </li>
    <li>
      <a href="#bkmk_CreateSendGrid">Create a SendGrid Account</a>
    </li>
    <li class="auto-style1">
      <a href="#bkmk_UsingSendGridfromPHP">Using SendGrid from your PHP Application</a>
    </li>
    <li>
      <a href="#bkmk_HowToSendEmail">How To: Send an Email</a>
    </li>
    <li>
      <a href="#bkmk_HowToAddAttachment">How To: Add an Attachment</a>
    </li>
    <li>
      <a href="#bkmk_HowToUseFilters">How to: Use Filters to Enable Footers, Tracking, and Analytics</a>
    </li>
    <li>
      <a href="#bkmk_HowToUseAdditionalSvcs">How to: Use Additional SendGrid Services</a>
    </li>
    <li>
      <a href="#bkmk_NextSteps">Next Steps</a>
    </li>
  </ul>
  <h2>
    <a name="bkmk_WhatIsSendGrid">
    </a>What is the SendGrid Email Service?</h2>
  <p>SendGrid is a cloud-based email service that provides reliable email delivery, scalability, and real-time analytics along with flexible APIs that make custom integration easy. Common SendGrid usage scenarios include:</p>
  <ul>
    <li>Automatically sending receipts to customers.</li>
    <li>Administering distribution lists for sending customers monthly e-fliers and special offers.</li>
    <li>Collecting real-time metrics for things like blocked e-mail, and customer responsiveness.</li>
    <li>Generating reports to help identify trends.</li>
    <li>Forwarding customer inquiries.</li>
  </ul>
  <p>For more information, see <a href="http://sendgrid.com">http://sendgrid.com</a>.</p>
  <h2>
    <a name="bkmk_CreateSendGrid">
    </a>Create a SendGrid Account</h2>
  <p>To get started with SendGrid, evaluate pricing and sign up at <a href="http://sendgrid.com/pricing.html">http://sendgrid.com/pricing.html</a>. Windows Azure customers receive a <a href="http://www.sendgrid.com/azure.html">special offer</a> of 25,000 free emails per month from SendGrid. To sign-up for this offer, or get more information, please visit <a href="http://www.sendgrid.com/azure.html">http://www.sendgrid.com/azure.html</a>.</p>
  <p>For more detailed information, see the SendGrid documentation at <a href="http://docs.sendgrid.com/documentation/get-started/">http://docs.sendgrid.com/documentation/get-started/</a>. For information about additional services provided by SendGrid, see <a href="http://sendgrid.com/features">http://sendgrid.com/features</a>.</p>
  <h2>
    <a name="bkmk_UsingSendGridfromPHP">
    </a>Using SendGrid from your PHP Application</h2>
  <p>Using SendGrid in a Windows Azure PHP application requires no special configuration or coding. Because SendGrid is a service, it can be accessed in exactly the same way from a cloud application as it can from an on-premises application.</p>
  <p>After adding email support to your application, you can package and deploy your application by following the methods outlined here: <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh674499(v=VS.103).aspx">Packaging and Deploying PHP Applications for Windows Azure</a>.</p>
  <h2>
    <a name="bkmk_HowToSendEmail">
    </a>How to: Send an Email</h2>
  <p>You can send email using either SMTP or the Web API provided by SendGrid. For details about the benefits and drawbacks of each API, see <a href="http://docs.sendgrid.com/documentation/get-started/integrate/examples/smtp-vs-rest/">SMTP vs. Web API</a> in the SendGrid documentation.</p>
  <h3>SMTP API</h3>
  <p>To send email using the SendGrid SMTP API, use <em>Swift Mailer</em>, a component-based library for sending emails from PHP applications. You can download the <em>Swift Mailer</em> library from <a href="http://swiftmailer.org/download">http://swiftmailer.org/download</a>. Sending email with the library involves creating instances of the <span class="auto-style2">Swift_SmtpTransport</span>, <span class="auto-style2">Swift_Mailer</span>, and <span class="auto-style2">Swift_Message</span> classes, setting the appropriate properties, and calling the <span class="auto-style2">Swift_Mailer::send</span> method.</p>
  <pre class="prettyprint">&lt;?php
 include_once "lib/swift_required.php";
 /*
  * Create the body of the message (a plain-text and an HTML version).
  * $text is your plain-text email
  * $html is your html version of the email
  * If the reciever is able to view html emails then only the html
  * email will be displayed
  */ 
 $text = "Hi!\nHow are you?\n";
 $html = &lt;&lt;&lt;EOM
       &lt;html&gt;
       &lt;head&gt;&lt;/head&gt;
       &lt;body&gt;
           &lt;p&gt;Hi!&lt;br&gt;
               How are you?&lt;br&gt;
           &lt;/p&gt;
       &lt;/body&gt;
       &lt;/html&gt;
       EOM;
 // This is your From email address
 $from = array('someone@example.com' =&gt; 'Name To Appear');<br />
 // Email recipients
 $to = array(
       'john@contoso.com'=&gt;'Destination 1 Name',
       'anna@contoso.com'=&gt;'Destination 2 Name'
 );
 // Email subject
 $subject = 'Example PHP Email';

 // Login credentials
 $username = 'yoursendgridusername';
 $password = 'yourpassword';
 
 // Setup Swift mailer parameters
 $transport = Swift_SmtpTransport::newInstance('smtp.sendgrid.net', 587);
 $transport-&gt;setUsername($username);
 $transport-&gt;setPassword($password);
 $swift = Swift_Mailer::newInstance($transport);

 // Create a message (subject)
 $message = new Swift_Message($subject);

 // attach the body of the email
 $message-&gt;setFrom($from);
 $message-&gt;setBody($html, 'text/html');
 $message-&gt;setTo($to);
 $message-&gt;addPart($text, 'text/plain');
 
 // send message 
 if ($recipients = $swift-&gt;send($message, $failures))
 {
     // This will let us know how many users received this message
     echo 'Message sent out to '.$recipients.' users';
 }
 // something went wrong =(
 else
 {
     echo "Something went wrong - ";
     print_r($failures);
 }</pre>
  <p>
    <strong>Note: </strong>The example script above is taken from the SendGrid documentation here: <a href="http://docs.sendgrid.com/documentation/get-started/integrate/examples/php-email-example-using-smtp/"> http://docs.sendgrid.com/documentation/get-started/integrate/examples/php-email-example-using-smtp/</a>.</p>
  <p>For more information about the SMTP API and the X-SMTPAPI header, see the SMTP API Developer’s Guide in the SendGrid documentation here: <a href="http://docs.sendgrid.com/documentation/api/smtp-api/developers-guide/">http://docs.sendgrid.com/documentation/api/smtp-api/developers-guide/</a>. For more examples of using the SMTP API with PHP, see the SendGrid documentation here: <a href="http://docs.sendgrid.com/documentation/api/smtp-api/php-example/"> http://docs.sendgrid.com/documentation/api/smtp-api/php-example/</a>.</p>
  <h3>Web API</h3>
  <p>Use PHP’s <a href="http://php.net/curl">curl function</a> to send email using the SendGrid Web API.</p>
  <pre class="prettyprint">&lt;?php

 $url = 'http://sendgrid.com/';
 $user = 'USERNAME';
 $pass = 'PASSWORD'; 

 $params = array(
      'api_user' =&gt; $user,
      'api_key' =&gt; $pass,
      'to' =&gt; 'john@contoso.com',
      'subject' =&gt; 'testing from curl',
      'html' =&gt; 'testing body',
      'text' =&gt; 'testing body',
      'from' =&gt; 'anna@sendgrid.com',
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
</pre>
  <p>
    <strong>Note: </strong>The example script above is taken from the SendGrid documentation here: <a href="http://docs.sendgrid.com/documentation/get-started/integrate/examples/php-example-using-the-web-api/"> http://docs.sendgrid.com/documentation/get-started/integrate/examples/php-example-using-the-web-api/</a>.</p>
  <p>
    <strong>Note: </strong>SendGrid’s Web API is very similar to a REST API, though it is not truly a RESTful API since, in most calls, both GET and POST verbs can be used interchangeably.</p>
  <p>For an overview of the Web API, see the SendGrid documentation here: <a href="http://docs.sendgrid.com/documentation/api/web-api/"> http://docs.sendgrid.com/documentation/api/web-api/</a>.</p>
  <p>For a complete list of parameters and generic examples for the send mail API, see <a href="http://docs.sendgrid.com/documentation/api/web-api/mail/"> http://docs.sendgrid.com/documentation/api/web-api/mail/</a>.</p>
  <h2>
    <a name="bkmk_HowToAddAttachment">
    </a>How to: Add an Attachment</h2>
  <h3>SMTP API</h3>
  <p>Sending an attachment using the SMTP API involves one additional line of code to the example script for sending an email with Swift Mailer.</p>
  <pre class="prettyprint">&lt;?php
 include_once "lib/swift_required.php";
 /*
  * Create the body of the message (a plain-text and an HTML version).
  * $text is your plain-text email
  * $html is your html version of the email
  * If the reciever is able to view html emails then only the html
  * email will be displayed
  */
 $text = "Hi!\nHow are you?\n";
  $html = &lt;&lt;&lt;EOM
      &lt;html&gt;
      &lt;head&gt;&lt;/head&gt;
      &lt;body&gt;
         &lt;p&gt;Hi!&lt;br&gt;
            How are you?&lt;br&gt;
         &lt;/p&gt;
      &lt;/body&gt;
      &lt;/html&gt;
 EOM;

 // This is your From email address
 $from = array('someone@example.com' =&gt; 'Name To Appear');
 
 // Email recipients
 $to = array(
      'john@contoso.com'=&gt;'Destination 1 Name',
      'anna@contoso.com'=&gt;'Destination 2 Name'
 );
 // Email subject
 $subject = 'Example PHP Email';
 
 // Login credentials
 $username = 'yoursendgridusername';
 $password = 'yourpassword';
 
 // Setup Swift mailer parameters
 $transport = Swift_SmtpTransport::newInstance('smtp.sendgrid.net', 587);
 $transport-&gt;setUsername($username);
 $transport-&gt;setPassword($password);
 $swift = Swift_Mailer::newInstance($transport);
 
 // Create a message (subject)
 $message = new Swift_Message($subject);
 
 // attach the body of the email
 $message-&gt;setFrom($from);
 $message-&gt;setBody($html, 'text/html');
 $message-&gt;setTo($to);
 $message-&gt;addPart($text, 'text/plain');
 $message-&gt;attach(Swift_Attachment::fromPath("path\to\file")-&gt;setFileName(“file_name”));
 
 // send message 
 if ($recipients = $swift-&gt;send($message, $failures))
 {
      // This will let us know how many users received this message
      echo 'Message sent out to '.$recipients.' users';
 }
 // something went wrong =(
 else
 {
      echo "Something went wrong - "
      print_r($failures);
 }</pre>
  <p>
    <strong>Note: </strong>The example script above is taken from the SendGrid documentation here: <a href="http://docs.sendgrid.com/documentation/get-started/integrate/examples/php-email-example-using-smtp/"> http://docs.sendgrid.com/documentation/get-started/integrate/examples/php-email-example-using-smtp/</a>.</p>
  <p>The additional line of code is as follows:</p>
  <pre class="prettyprint"> $message-&gt;attach(Swift_Attachment::fromPath("path\to\file")-&gt;setFileName(“file_name”));</pre>
  <p>This line of code calls the attach method on the <span class="auto-style2">Swift_Message</span> object and uses static method <span class="auto-style2">fromPath</span> on the <span class="auto-style2">Swift_Attachment</span> class to get and attach a file to a message.</p>
  <h3>Web API</h3>
  <p>Sending an attachment using the Web API is very similar to sending an email using the Web API. However, note that in the example that follows, the parameter array must contain this element:</p>
  <pre class="prettyprint"> 'files['.$fileName.']' =&gt; '@'.$filePath.'/'.$fileName</pre>
  <pre class="prettyprint">&lt;?php

 $url = 'http://sendgrid.com/';
 $user = 'USERNAME';
 $pass = 'PASSWORD';
 
 $fileName = 'myfile';
 $filePath = dirname(__FILE__);

 $params = array(
     'api_user' =&gt; $user,
     'api_key' =&gt; $pass,
     'to' =&gt;'john@contoso.com',
     'subject' =&gt; 'test of file sends',
     'html' =&gt; '&lt;p&gt; the HTML &lt;/p&gt;',
     'text' =&gt; 'the plain text',
     'from' =&gt; 'anna@sendgrid.com',
     'files['.$fileName.']' =&gt; '@'.$filePath.'/'.$fileName
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
</pre>
  <p>
    <strong>Note: </strong>The example script above is taken from the SendGrid documentation here: <a href="http://docs.sendgrid.com/documentation/get-started/integrate/examples/php-example-using-the-web-api/"> http://docs.sendgrid.com/documentation/get-started/integrate/examples/php-example-using-the-web-api/</a>.</p>
  <h2>
    <a name="bkmk_HowToUseFilters">
    </a>How to: Use Filters to Enable Footers, Tracking, and Analytics</h2>
  <p>SendGrid provides additional email functionality through the use of ‘filters’. These are settings that can be added to an email message to enable specific functionality such as enabling click tracking, Google analytics, subscription tracking, and so on. For a full list of filters, see <a href="http://docs.sendgrid.com/documentation/api/smtp-api/filter-settings/">Filter Settings</a>.</p>
  <p>Filters can be applied to a message by using the filters property. Each filter is specified by a hash containing filter-specific settings. The following example enables the footer filter and specifies a text message that will be appended to the bottom of the email message:</p>
  <pre class="prettyprint">&lt;?php
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
 $hdr-&gt;addTo($toList);
 $hdr-&gt;addSubVal('-name-', $nameList);
 $hdr-&gt;addSubVal('-time-', $timeList);
 
 // Specify that this is an initial contact message
 $hdr-&gt;setCategory("initial");
 
 // You can optionally setup individual filters here, in this example, we have 
 enabled the footer filter
 $hdr-&gt;addFilterSetting('footer', 'enable', 1);
 $hdr-&gt;addFilterSetting('footer', "text/plain", "Thank you for your business");
 
 // The subject of your email
 $subject = 'Example SendGrid Email';
 
 // Where is this message coming from. For example, this message can be from support@yourcompany.com, info@yourcompany.com
 $from = array('someone@example.com' =&amp;gt; 'Name Of Your Company');
 
 // If you do not specify a sender list above, you can specifiy the user here. If 
 // a sender list IS specified above, this email address becomes irrelevant.
 $to = array('john@contoso.com'=&amp;gt;'Personal Name Of Recipient');
 
 # Create the body of the message (a plain-text and an HTML version). 
 # text is your plain-text email 
 # html is your html version of the email
 # if the receiver is able to view html emails then only the html
 # email will be displayed
 
 /*
 * Note the variable substitution here =)
 */
 $text = &lt;&lt;&lt;EOM 
 Hello -name-,
 Thank you for your interest in our products. We have set up an appointment to call you at -time- EST to discuss your needs in more detail.
 Regards,
 Fred
 EOM;
 
 $html = &lt;&lt;&lt;EOM
 &lt; html&gt; 
 &lt;head&gt;&lt;/head&gt;
 &lt;body&gt;
 &lt;p&gt;Hello -name-,&lt;br&gt;
 Thank you for your interest in our products. We have set up an appointment
 to call you at -time- EST to discuss your needs in more detail.
 
 Regards,
 
 Fred, How are you?&lt;br&gt;
 &lt;/p&gt;
 &lt;/body&gt;
 &lt; /html&gt;
 EOM;
 
 // Your SendGrid account credentials
 $username = 'sendgridusername@yourdomain.com';
 $password = 'example';
 
 // Create new swift connection and authenticate
 $transport = Swift_SmtpTransport::newInstance('smtp.sendgrid.net', 25);
 $transport -&gt;setUsername($username);
 $transport -&gt;setPassword($password);
 $swift = Swift_Mailer::newInstance($transport);
 
 // Create a message (subject)
 $message = new Swift_Message($subject);
 
 // add SMTPAPI header to the message
 // *****IMPORTANT NOTE*****
 // SendGrid's asJSON function escapes characters. If you are using Swift 
 Mailer's
 // PHP Mailer functions, the getTextHeader function will also escape characters.
 // This can cause the filter to be dropped.
 $headers = $message-&gt;getHeaders();
 $headers-&gt;addTextHeader('X-SMTPAPI', $hdr-&gt;asJSON());
 
 // attach the body of the email
 $message-&gt;setFrom($from);
 $message-&gt;setBody($html, 'text/html');
 $message-&gt;setTo($to);
 $message-&gt;addPart($text, 'text/plain');
 
 // send message
 if ($recipients = $swift-&gt;send($message, $failures))
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
 }</pre>
  <p>
    <strong>Note: </strong>The example script above is taken from the SendGrid documentation here: <a href="http://docs.sendgrid.com/documentation/api/smtp-api/php-example/"> http://docs.sendgrid.com/documentation/api/smtp-api/php-example/</a>.</p>
  <h2>
    <a name="bkmk_HowToUseAdditionalSvcs">
    </a>How to: Use Additional SendGrid Services</h2>
  <p>SendGrid offers web-based APIs that you can use to leverage additional SendGrid functionality from your Windows Azure application. For full details, see the <a href="http://docs.sendgrid.com/documentation/api/">SendGrid API documentation</a>.</p>
  <h2>
    <a name="bkmk_NextSteps">
    </a>Next Steps</h2>
  <p>Now that you’ve learned the basics of the SendGrid Email service, follow these links to learn more.</p>
  <ul>
    <li>SendGrid API documentation: <a href="http://docs.sendgrid.com/documentation/api/">http://docs.sendgrid.com/documentation/api/ </a></li>
    <li>SendGrid special offer for Windows Azure customers: <a href="http://sendgrid.com/azure.html">http://sendgrid.com/azure.html </a></li>
  </ul>
</body>