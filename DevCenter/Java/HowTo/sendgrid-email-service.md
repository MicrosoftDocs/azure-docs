<properties
linkid=dev-java-how-to-access-control
urlDisplayName=SendGrid Email Service
headerExpose=
pageTitle=SendGrid Email Service - How To - Java - Develop
metaKeywords=
footerExpose=
metaDescription=
umbracoNaviHide=0
disqusComments=1
/>
<h1>How to Send Email Using SendGrid from Java</h1>
<p>This guide demonstrates how to perform common programming tasks with the SendGrid email service on Windows Azure. The samples are written in Java. The scenarios covered include <strong>constructing email</strong>, <strong>sending email</strong>, <strong>adding attachments</strong>, <strong>using filters</strong>, and <strong>updating properties</strong>. For more information on SendGrid and sending email, see the <a href="#bkmk_NextSteps">Next Steps</a> section.</p>
<h2>Table of Contents</h2>
<ul>
<li><a href="#bkmk_WhatIsSendGrid">What is the SendGrid Email Service?</a></li>
<li><a href="#bkmk_CreateSendGridAcct">Create a SendGrid Account</a></li>
<li><a href="#bkmk_HowToUseJavax">How to: Use the javax.mail libraries</a></li>
<li><a href="#bkmk_HowToCreateEmail">How to: Create an Email</a></li>
<li><a href="#bkmk_HowToSendEmail">How to: Send an Email</a></li>
<li><a href="#bkmk_HowToAddAttachment">How to: Add an Attachment</a></li>
<li><a href="#bkmk_HowToUseFilters">How to: Use Filters to Enable Footers, Tracking, and Analytics</a></li>
<li><a href="#bkmk_HowToUpdateEmail">How to: Update Email Properties</a></li>
<li><a href="#bkmk_HowToUseAdditionalSvcs">How to: Use Additional SendGrid Services</a></li>
<li><a href="#bkmk_NextSteps">Next Steps</a></li>
</ul>
<h2><a name="bkmk_WhatIsSendGrid"></a>What is the SendGrid Email Service?</h2>
<p>SendGrid is a cloud-based email service that provides reliable email delivery, scalability, and real-time analytics along with flexible APIs that make custom integration easy. Common SendGrid usage scenarios include:</p>
<ul>
<li>Automatically sending receipts to customers.</li>
<li>Administering distribution lists for sending customers monthly e-fliers and special offers.</li>
<li>Collecting real-time metrics for things like blocked e-mail, and customer responsiveness.</li>
<li>Generating reports to help identify trends.</li>
<li>Forwarding customer inquiries.</li>
</ul>
<p>For more information, see <a href="http://sendgrid.com">http://sendgrid.com</a>.</p>
<h2><a name="bkmk_CreateSendGridAcct"></a>Create a SendGrid Account</h2>
<p>To get started with SendGrid, evaluate pricing and sign up here: <a href="http://sendgrid.com/pricing.html">http://sendgrid.com/pricing.html</a>. Windows Azure customers receive a special offer of 25,000 free emails per month from SendGrid. To sign-up for this offer, or get more information, please visit <a href="http://www.sendgrid.com/azure.html">http://www.sendgrid.com/azure.html</a>. For more detailed information on the signup process, see the SendGrid documentation at <a href="http://docs.sendgrid.com/documentation/get-started">http://docs.sendgrid.com/documentation/get-started</a>. For information about additional services provided by SendGrid, see <a href="http://sendgrid.com/features">http://sendgrid.com/features</a>.</p>
<h2><a name="bkmk_HowToUseJavax"></a>How to: Use the javax.mail libraries</h2>
<p>Obtain the javax.mail libraries, for example from <a href="http://www.oracle.com/technetwork/java/javamail/index.html">http://www.oracle.com/technetwork/java/javamail</a> and import them into your code. At a high-level, the process for using the javax.mail library to send email using SMTP is to do the following:</p>
<ol>
<li>
<p>Specify the SMTP values, including the SMTP server, which for SendGrid is smtp.sendgrid.net.</p>
<pre class="prettyprint">public class MyEmailer {

private static final String SMTP_HOST_NAME = "smtp.sendgrid.net";
private static final String SMTP_AUTH_USER = "your_sendgrid_username";
private static final String SMTP_AUTH_PWD = "your_sendgrid_password";<br />
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
   // …</pre>
</li>
<li>Extend the <span class="auto-style1">javax.mail.Authenticator</span> class, and in your implementation of the <span class="auto-style1">getPasswordAuthentication</span> method, return your SendGrid user name and password.<br />
<pre class="prettyprint">private class SMTPAuthenticator extends javax.mail.Authenticator {
public PasswordAuthentication getPasswordAuthentication() {
   String username = SMTP_AUTH_USER;
   String password = SMTP_AUTH_PWD;
   return new PasswordAuthentication(username, password);
}</pre>
</li>
<li>Create an authenticated email session through a <span class="auto-style1">javax.mail.Session</span> object.<br />
<pre class="prettyprint">Authenticator auth = new SMTPAuthenticator();
Session mailSession = Session.getDefaultInstance(properties, auth);</pre>
</li>
<li>Create your message and assign <strong>To</strong>, <strong>From</strong>, <strong>Subject</strong> and content values. This is shown in the <a href="#bkmk_HowToCreateEmail">How To: Create an Email</a> section.</li>
<li>Send the message through a <span class="auto-style1">javax.mail.Transport</span> object. This is shown in the <a href="#bkmk_HowToSendEmail">How To: Send an Email</a> section.</li>
</ol>
<h2><a name="bkmk_HowToCreateEmail"></a>How to: Create an Email</h2>
<p>The following shows how to specify values for an email.</p>
<pre class="prettyprint">MimeMessage message;
message = new MimeMessage(mailSession);
Multipart multipart;
multipart = new MimeMultipart("alternative");<br />
BodyPart part1, part2;
part1 = new MimeBodyPart();
part1.setText("Hello, Your Contoso order has shipped. Thank you, John");
part2 = new MimeBodyPart();
part2.setContent("&lt;p&gt;Hello,&lt;/p&gt;&lt;p&gt;Your Contoso order has 
&lt;b&gt;shipped&lt;/b&gt;.&lt;/p&gt;&lt;p&gt;Thank you,&lt;br&gt;John&lt;/br&gt;&lt;/p&gt;", "text/html");<br />
multipart.addBodyPart(part1);
multipart.addBodyPart(part2);<br />
message.setFrom(new InternetAddress("john@contoso.com"));
message.addRecipient(Message.RecipientType.TO,
   new InternetAddress("someone@example.com"));
message.setSubject("Your recent order");
message.setContent(multipart);</pre>
<h2><a name="bkmk_HowToSendEmail"></a>How to: Send an Email</h2>
<p>The following shows how to send an email.</p>
<pre class="prettyprint">Transport transport;
transport = mailSession.getTransport();
// Connect the transport object.
transport.connect();
// Send the message.
transport.sendMessage(message, message.getRecipients(Message.RecipientType.TO));
// Close the connection.
transport.close();</pre>
<h2><a name="bkmk_HowToAddAttachment"></a>How to: Add an Attachment</h2>
<p>The following code shows you how to add an attachment.</p>
<pre class="prettyprint">// Local file name and path.
String attachmentName = "myfile.zip";
String attachmentPath = "c:\\myfiles\\"; <br />
MimeBodyPart attachmentPart;
attachmentPart = new MimeBodyPart();<br />
// Specify the local file to attach.
DataSource source = new FileDataSource(attachmentPath + attachmentName);
attachmentPart.setDataHandler(new DataHandler(source));
// This example uses the local file name as the attachment name.
// They could be different if you prefer.
attachmentPart.setFileName(attachmentName);
multipart.addBodyPart(attachmentPart);</pre>
<h2><a name="bkmk_HowToUseFilters"></a>How to: Use Filters to Enable Footers, Tracking, and Analytics</h2>
<p>SendGrid provides additional email functionality through the use of <em>filters</em>. These are settings that can be added to an email message to enable specific functionality such as enabling click tracking, Google analytics, subscription tracking, and so on. For a full list of filters, see <a href="http://docs.sendgrid.com/documentation/api/smtp-api/filter-settings/">Filter Settings</a>.</p>
<ul>
<li>The following shows how to insert a footer filter that results in HTML text appearing at the bottom of the email being sent.
<pre class="prettyprint">message.addHeader("X-SMTPAPI", "{\"filters\": {\"footer\": {\"settings\": 
{\"enable\":1,\"text/html\": \"&lt;html&gt;&lt;b&gt;Thank you&lt;/b&gt; for your 
business.&lt;/html&gt;\"}}}}");</pre>
</li>
<li>Another example of a filter is click tracking. Let’s say that your email text contains a hyperlink, such as the following, and you want to track the click rate:
<pre class="prettyprint">messagePart.setContent("Hello,&lt;p&gt;This is the body of the message. Visit &lt;a 
href='http://www.contoso.com'&gt;http://www.contoso.com&lt;/a&gt;.&lt;/p&gt;Thank you.", 
"text/html");</pre>
</li>
<li>To enable the click tracking, use the following code:
<pre class="prettyprint">message.addHeader("X-SMTPAPI", "{\"filters\": {\"clicktrack\": {\"settings\": 
{\"enable\":1}}}}");</pre>
</li>
</ul>
<h2><a name="bkmk_HowToUpdateEmail"></a>How to: Update Email Properties</h2>
<p>Some email properties can be overwritten using <strong>set<em>Property</em></strong> or appended using <strong>add<em>Property</em></strong>.</p>
<p>For example, to specify <strong>ReplyTo</strong> addresses, use the following:</p>
<pre class="prettyprint">InternetAddress addresses[] = { new InternetAddress("john@contoso.com"),
     new InternetAddress("wendy@contoso.com") };
message.setReplyTo(addresses);</pre>
<p>To add a <strong>Cc</strong> recipient, use the following:</p>
<pre class="prettyprint">message.addRecipient(Message.RecipientType.CC, new 
InternetAddress("john@contoso.com"));</pre>
<h2><a name="bkmk_HowToUseAdditionalSvcs"></a>How to: Use Additional SendGrid Services</h2>
<p>SendGrid offers web-based APIs that you can use to leverage additional SendGrid functionality from your Windows Azure application. For full details, see the <a href="http://docs.sendgrid.com/documentation/api/">SendGrid API documentation</a>.</p>
<h2><a name="bkmk_NextSteps"></a>Next Steps</h2>
<p>Now that you’ve learned the basics of the SendGrid Email service, follow these links to learn more.</p>
<ul>
<li>SendGrid Java information: <a href="http://docs.sendgrid.com/documentation/get-started/integrate/examples/java-email-example-using-smtp/"> http://docs.sendgrid.com/documentation/get-started/integrate/examples/java-email-example-using-smtp/</a></li>
<li>SendGrid API documentation: <a href="http://docs.sendgrid.com/documentation/api/"> http://docs.sendgrid.com/documentation/api/</a></li>
<li>SendGrid special offer for Windows Azure customers: <a href="http://sendgrid.com/azure.html">http://sendgrid.com/azure.html</a></li>
</ul>