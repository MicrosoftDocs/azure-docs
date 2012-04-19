<?xml version="1.0" encoding="utf-8"?>
<body>
  <properties linkid="dev-net-how-to-sendgrid-email-service" urlDisplayName="SendGrid Email Service" headerExpose="" pageTitle="SendGrid Email Service - How To - .NET - Develop" metaKeywords="" footerExpose="" metaDescription="" umbracoNaviHide="0" disqusComments="1" />
  <h1>How to Send Email Using SendGrid</h1>
  <p>This guide demonstrates how to perform common programming tasks with the SendGrid email service on Windows Azure. The samples are written in C# and use the .NET API. The scenarios covered include <strong>constructing email</strong>, <strong>sending email</strong>, <strong>adding attachments</strong>, and <strong>using filters</strong>. For more information on SendGrid and sending email, see the <a href="#nextsteps">Next Steps</a> section.</p>
  <h2>Table of Contents</h2>
  <p>
    <a href="#whatis">What is the SendGrid Email Service?</a>
    <br />
    <a href="#createaccount">Create a SendGrid Account</a>
    <br />
    <a href="#reference">Reference the SendGrid .NET Class Library</a>
    <br />
    <a href="#createemail">How to: Create an Email</a>
    <br />
    <a href="#sendemail">How to: Send an Email</a>
    <br />
    <a href="#addattachment">How to: Add an Attachment</a>
    <br />
    <a href="#usefilters">How to: Use Filters to Enable Footers, Tracking, and Analytics</a>
    <br />
    <a href="#useservices">How to: Use Additional SendGrid Services</a>
    <br />
    <a href="#nextsteps">Next Steps</a>
  </p>
  <h2>
    <a id="whatis">
    </a>What is the SendGrid Email Service?</h2>
  <p>SendGrid is a cloud-based email service that provides reliable email delivery, scalability, and real-time analytics. along with flexible APIs that make custom integration easy. Common SendGrid usage scenarios include:</p>
  <ul>
    <li>Automatically sending receipts to customers.</li>
    <li>Administering distribution lists for sending customers monthly e-fliers and special offers.</li>
    <li>Collecting real-time metrics for things like blocked e-mail, and customer responsiveness.</li>
    <li>Generating reports to help identify trends.</li>
    <li>Forwarding customer inquiries.</li>
  </ul>
  <p>For more information, see <a href="http://sendgrid.com/">http://sendgrid.com</a>.</p>
  <h2>
    <a id="createaccount">
    </a>Create a SendGrid Account</h2>
  <p>To get started with SendGrid, evaluate pricing and sign up information at <a href="http://sendgrid.com">http://sendgrid.com</a>. Windows Azure customers receive a <a href="http://www.sendgrid.com/azure.html">special offer</a> of 25,000 free emails per month from SendGrid. To sign-up for this offer, or get more information, please visit <a href="http://www.sendgrid.com/azure.html">http://www.sendgrid.com/azure.html</a>.</p>
  <p>For more detailed information on the signup process, see the SendGrid documentation at <a href="http://docs.sendgrid.com/documentation/get-started/">http://docs.sendgrid.com/documentation/get-started/</a>. For information about additional services provided by SendGrid, see <a href="http://sendgrid.com/features">http://sendgrid.com/features</a>.</p>
  <h2>
    <a id="reference">
    </a>Reference the SendGrid .NET Class Library</h2>
  <p>The SendGrid NuGet package is the easiest way to get the SendGrid API and to configure your application with all dependencies. NuGet is a Visual Studio extension that makes it easy to install and update libraries and tools in Visual Studio and Visual Web Developer. To install NuGet, visit <a href="http://www.nuget.org">http://www.nuget.org</a>, and click the <strong>Install NuGet</strong> button.</p>
  <p>To install the NuGet package in your application, do the following:</p>
  <ol>
    <li>
      <p>In <strong>Solution Explorer</strong>, right-click <strong>References</strong>, then click <strong>Manage NuGet Packages</strong>.</p>
    </li>
    <li>
      <p>Search for <strong>SendGrid</strong> and select the <strong>SendGrid</strong> item in the results list.</p>
      <img src="../../../DevCenter/dotNet/media/sendgrid01.png" alt="SendGrid NuGet package" />
    </li>
    <li>
      <p>Click <strong>Install</strong> to complete the installation, then close this dialog.</p>
    </li>
  </ol>
  <p>SendGrid's .NET class library is called <strong>SendGridMail</strong>. It contains the following namespaces:</p>
  <ul>
    <li>
      <strong>SendGridMail</strong> for creating and working with email items.</li>
    <li>
      <strong>SendGridMail.Transport</strong> for sending email using either the <strong>SMTP</strong> protocol, or the HTTP 1.1 protocol with <strong>Web/REST</strong>.</li>
  </ul>
  <p>Add the following code namespace declarations to the top of any C# file in which you want to programmatically access the SendGrid email service. <strong>System.Net</strong> and <strong>System.Net.Mail</strong> are .NET Framework namespaces that are included because they include types you will commonly use with the SendGrid APIs.</p>
  <pre class="prettyprint">using System.Net;
using System.Net.Mail;
using SendGridMail;
using SendGridMail.Transport;
</pre>
  <h2>
    <a id="createemail">
    </a>How to: Create an Email</h2>
  <p>Use the static <strong>SendGrid.GenerateInstance</strong> method to create an email message that is of type <strong>SendGrid</strong>. Once the message is created, you can use <strong>SendGrid</strong> properties and methods to set values including the email sender, the email recipient, and the subject and body of the email.</p>
  <p>The following example demonstrates how to create a fully populated email object:</p>
  <pre class="prettyprint">// Setup the email properties.
var from = new MailAddress("john@contoso.com");
var to   = new MailAddress[] { new MailAddress("jeff@contoso.com") };
var cc   = new MailAddress[] { new MailAddress("anna@contoso.com") };
var bcc  = new MailAddress[] { new MailAddress("peter@contoso.com") };
var subject = "Testing the SendGrid Library";
var html    = "&lt;p&gt;Hello World!&lt;/p&gt;";
var text = "Hello World plain text!";
var transport = SendGridMail.TransportType.SMTP;

// Create an email, passing in the the eight properties as arguments.
SendGrid myMessage = SendGrid.GenerateInstance(from, to, cc, bcc, subject, html, text, transport);
</pre>
  <p>The following example demonstrates how to create an empty email object:</p>
  <pre class="prettyprint">// Create the email object first, then add the properties.
SendGrid myMessage = SendGrid.GenerateInstance();
 
// Add the message properties.
MailAddress sender = new MailAddress(@"John Smith &lt;john@contoso.com&gt;");
myMessage.From = sender;
 
// Add multiple addresses to the To field.
List&lt;String&gt; recipients = new List&lt;String&gt;
{
    @"Jeff Smith &lt;jeff@contoso.com&gt;",
    @"Anna Lidman &lt;anna@contoso.com&gt;",
    @"Peter Saddow &lt;peter@contoso.com&gt;"
};
 
foreach (string recipient in recipients)
{
    myMessage.AddTo(recipient);
}
 
// Add a message body in HTML format.
myMessage.Html = "&lt;p&gt;Hello World!&lt;/p&gt;";

// Add the subject.
myMessage.Subject = "Testing the SendGrid Library";
</pre>
  <p>For more information on all properties and methods supported by the SendGrid type, see <a href="https://github.com/sendgrid/sendgrid-csharp">sendgrid-csharp</a> on GitHub.</p>
  <h2>
    <a id="sendemail">
    </a>How to: Send an Email</h2>
  <p>After creating an email message, you can send it using either SMTP or the Web API provided by SendGrid. For details about the benefits and drawbacks of each API, see <a href="http://docs.sendgrid.com/documentation/get-started/integrate/examples/smtp-vs-rest/">SMTP vs. Web API</a> in the SendGrid documentation.</p>
  <p>Sending email with either protocol requires that you supply your SendGrid account credentials (username and password). The following code demonstrates how to wrap your credentials in a <strong>NetworkCredential</strong> object:</p>
  <pre class="prettyprint">// Create network credentials to access your SendGrid account.
var username = "your_sendgrid_username";
var pswd = "your_sendgrid_password";

var credentials = new NetworkCredential(username, pswd);
</pre>
  <p>To send an email message, use the <strong>Deliver</strong> method on either the <strong>SMTP</strong> class, which uses the SMTP protocol, or the <strong>REST</strong> transport class, which calls the SendGrid Web API. The following examples show how to send a message using both SMTP and the Web API.</p>
  <h3>SMTP</h3>
  <pre class="prettyprint">// Create the email object first, then add the properties.
SendGrid myMessage = SendGrid.GenerateInstance();
myMessage.AddTo("anna@contoso.com");
myMessage.From = new MailAddress("john@contoso.com", "John Smith");
myMessage.Subject = "Testing the SendGrid Library";
myMessage.Text = "Hello World!";

// Create credentials, specifying your user name and password.
var credentials = new NetworkCredential("username", "password");

// Create an SMTP transport for sending email.
var transportSMTP = SMTP.GenerateInstance(credentials);

// Send the email.
transportSMTP.Deliver(myMessage);
</pre>
  <h3>Web API</h3>
  <pre class="prettyprint">// Create the email object first, then add the properties.
SendGrid myMessage = SendGrid.GenerateInstance();
myMessage.AddTo("anna@contoso.com");
myMessage.From = new MailAddress("john@contoso.com", "John Smith");
myMessage.Subject = "Testing the SendGrid Library";
myMessage.Text = "Hello World!";

// Create credentials, specifying your user name and password.
var credentials = new NetworkCredential("username", "password");

// Create an REST transport for sending email.
var transportREST = REST.GetInstance(credentials);

// Send the email.
transportREST.Deliver(myMessage);
</pre>
  <h2>
    <a id="addattachment">
    </a>How to: Add an Attachment</h2>
  <p>Attachments can be added to a message by calling the <strong>AddAttachment</strong> method and specifying the name and path of the file you want to attach. You can include multiple attachments by calling this method once for each file you wish to attach. The following example demonstrates adding an attachment to a message:</p>
  <pre class="prettyprint">SendGrid myMessage = SendGrid.GenerateInstance();
myMessage.AddTo("anna@contoso.com");
myMessage.From = new MailAddress("john@contoso.com", "John Smith");
myMessage.Subject = "Testing the SendGrid Library";
myMessage.Text = "Hello World!";

myMessage.AddAttachment(@"C:\file1.txt");
</pre>
  <h2>
    <a id="usefilters">
    </a>How to: Use Filters to Enable Footers, Tracking, and Analytics</h2>
  <p>SendGrid provides additional email functionality through the use of filters. These are settings that can be added to an email message to enable specific functionality such as click tracking, Google analytics, subscription tracking, and so on. For a full list of filters, see <a href="http://docs.sendgrid.com/documentation/api/smtp-api/filter-settings/">Filter Settings</a>.</p>
  <p>Filters can be applied to <strong>SendGrid</strong> email messages using methods implemented as part of the <strong>SendGrid</strong> class. Before you can enable filters on an email message, you must first initialize the list of available filters by calling the <strong>InitalizeFilters</strong> method.</p>
  <p>The following examples demonstrate the footer and click tracking filters:</p>
  <h3>Footer</h3>
  <pre class="prettyprint">// Create the email object first, then add the properties.
SendGrid myMessage = SendGrid.GenerateInstance();
myMessage.AddTo("anna@contoso.com");
myMessage.From = new MailAddress("john@contoso.com", "John Smith");
myMessage.Subject = "Testing the SendGrid Library";
myMessage.Text = "Hello World!";

myMessage.InitializeFilters();
// Add a footer to the message.
myMessage.EnableFooter("PLAIN TEXT FOOTER", "&lt;p&gt;&lt;em&gt;HTML FOOTER&lt;/em&gt;&lt;/p&gt;");
</pre>
  <h3>Click Tracking</h3>
  <pre class="prettyprint">// Create the email object first, then add the properties.
SendGrid myMessage = SendGrid.GenerateInstance();
myMessage.AddTo("anna@contoso.com");
myMessage.From = new MailAddress("john@contoso.com", "John Smith");
myMessage.Subject = "Testing the SendGrid Library";
myMessage.Html = "&lt;p&gt;&lt;a href=\"http://www.windowsazure.com\"&gt;Hello World Link!&lt;/a&gt;&lt;/p&gt;";
myMessage.Text = "Hello World!";

myMessage.InitializeFilters();
// true indicates that links in plain text portions of the email 
// should also be overwritten for link tracking purposes. 
myMessage.EnableClickTracking(true);
</pre>
  <h2>
    <a id="useservices">
    </a>How to: Use Additional SendGrid Services</h2>
  <p>SendGrid offers web-based APIs that you can use to leverage additional SendGrid functionality from your Windows Azure application. For full details, see the <a href="http://docs.sendgrid.com/documentation/api/">SendGrid API documentation</a>.</p>
  <h2>
    <a id="nextsteps">
    </a>Next Steps</h2>
  <p>Now that you’ve learned the basics of the SendGrid Email service, follow these links to learn more.</p>
  <ul>
    <li>
      <p>SendGrid C# library repo: <a href="https://github.com/sendgrid/sendgrid-csharp">sendgrid-csharp</a></p>
    </li>
    <li>
      <p>SendGrid API documentation: <a href="http://docs.sendgrid.com/documentation/api/">http://docs.sendgrid.com/documentation/api/</a></p>
    </li>
    <li>
      <p>SendGrid special offer for Windows Azure customers: <a href="http://sendgrid.com/azure.html">http://sendgrid.com/azure.html</a></p>
    </li>
  </ul>
</body>