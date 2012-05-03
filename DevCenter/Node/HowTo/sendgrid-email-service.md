  <properties linkid="dev-nodejs-how-to-sendgrid-email-service" urlDisplayName="SendGrid Email Service" headerExpose="" pageTitle="SendGrid Email Service - How To - Node.js - Develop" metaKeywords="" footerExpose="" metaDescription="" umbracoNaviHide="0" disqusComments="1" />
  <h1>How to Send Email Using SendGrid from Node.js</h1>
  <p>This guide demonstrates how to perform common programming tasks with the SendGrid email service on Windows Azure. The samples are written using the Node.js API. The scenarios covered include <strong>constructing email</strong>, <strong>sending email</strong>, <strong>adding attachments</strong>, <strong>using filters</strong>, and <strong>updating properties</strong>. For more information on SendGrid and sending email, see the <a href="http://www.windowsazure.com/en-us/develop/nodejs/how-to-guides/blob-storage/#next-steps">Next Steps</a> section.</p>
  <h2>Table of Contents</h2>
  <p>
    <a href="#whatis">What is the SendGrid Email Service?</a>
    <br />
    <a href="#createaccount">Create a SendGrid Account</a>
    <br />
    <a href="#reference">Reference the SendGrid Node.js Module</a>
    <br />
    <a href="#createemail">How to: Create an Email</a>
    <br />
    <a href="#sendemail">How to: Send an Email</a>
    <br />
    <a href="#addattachment">How to: Add an Attachment</a>
    <br />
    <a href="#usefilters">How to: Use Filters to Enable Footers, Tracking, and Analytics</a>
    <br />
    <a href="#updateproperties">How to: Update Email Properties</a>
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
  <p>To get started with SendGrid, evaluate pricing and sign up information at <a href="http://sendgrid.com/azure.html">http://sendgrid.com/azure.html</a>. Windows Azure customers receive a <a href="http://www.sendgrid.com/azure.html">special offer</a> of 25,000 free emails per month from SendGrid. To sign-up for this offer, or get more information, please visit <a href="http://www.sendgrid.com/azure.html">http://www.sendgrid.com/azure.html</a>.</p>
  <p>For more detailed information on the signup process, see the SendGrid documentation at <a href="http://docs.sendgrid.com/documentation/get-started/">http://docs.sendgrid.com/documentation/get-started/</a>. For information about additional services provided by SendGrid, see <a href="http://sendgrid.com/features">http://sendgrid.com/features</a>.</p>
  <h2>
    <a id="reference">
    </a>Reference the SendGrid Node.js Module</h2>
  <p>The SendGrid module for Node.js can be installed through the node package manager (npm) by using the following command:</p>
  <pre class="prettyprint">PS C:&gt; npm install sendgrid-nodejs
</pre>
  <p>After installation, you can require the module in your application by using the following code:</p>
  <pre class="prettyprint">var SendGrid = require('sendgrid-nodejs')
</pre>
  <p>The SendGrid module exports the <strong>SendGrid</strong> and <strong>Email</strong> functions. <strong>SendGrid</strong> is responsible for sending email through either SMTP or Web API, while <strong>Email</strong> encapsulates an email message.</p>
  <h2>
    <a id="createemail">
    </a>How to: Create an Email</h2>
  <p>Creating an email message using the SendGrid module involves first creating an email message using the Email function, and then sending it using the SendGrid function. The following is an example of creating a new message using the Email function:</p>
  <pre class="prettyprint">var mail = new SendGrid.Email({
    to: 'john@contoso.com',
    from: 'anna@contoso.com',
    subject: 'test mail',
    text: 'This is a sample email message.'
});
</pre>
  <p>You can also specify an HTML message for clients that support it by setting the html property. For example:</p>
  <pre class="prettyprint">html: This is a sample &lt;b&gt;HTML&lt;b&gt; email message.
</pre>
  <p>Setting both the text and html properties provides graceful fallback to text content for clients that cannot support HTML messages.</p>
  <p>For more information on all properties supported by the Email function, see <a href="https://github.com/sendgrid/sendgrid-nodejs">sendgrid-nodejs</a>.</p>
  <h2>
    <a id="sendemail">
    </a>How to: Send an Email</h2>
  <p>After creating an email message using the Email function, you can send it using either SMTP or the Web API provided by SendGrid. For details about the benefits and drawbacks of each API, see <a href="http://docs.sendgrid.com/documentation/get-started/integrate/examples/smtp-vs-rest/">SMTP vs. Web API</a> in the SendGrid documentation.</p>
  <p>Using either the SMTP API or Web API requires that you first initialize the SendGrid function using the user and key of your SendGrid account as follows:</p>
  <pre class="prettyprint">var sender = new SendGrid.SendGrid('user','key');
</pre>
  <p>The message can now be sent using either SMTP or the Web API. The calls are virtually identical, passing the email message and an optional callback function; The callback is used to determine the success or failure of the operation. The following examples show how to send a message using both SMTP and the Web API.</p>
  <h3>SMTP</h3>
  <pre class="prettyprint">sender.smtp(mail, function(success, err){
    if(success) console.log('Email sent');
    else console.log(err);
)});
</pre>
  <h3>Web API</h3>
  <pre class="prettyprint">sender.send(mail, function(success, err){
    if(success) console.log('Email sent');
    else console.log(err);
)});
</pre>
  <p>
    <strong>Note</strong>: While the above examples show passing in an email object and callback function, you can also directly invoke the send and smtp functions by directly specifying email properties. For example:</p>
  <pre class="prettyprint">sender.send({
    to: 'john@contoso.com',
    from: 'anna@contoso.com',
    subject: 'test mail',
    text: 'This is a sample email message.'
});
</pre>
  <h2>
    <a id="addattachment">
    </a>How to: Add an Attachment</h2>
  <p>Attachments can be added to a message by specifying the file name(s) and path(s) in the <strong>files</strong> property. The following example demonstrates sending an attachment:</p>
  <pre class="prettyprint">sender.send({
    to: 'john@contoso.com',
    from: 'anna@contoso.com',
    subject: 'test mail',
    text: 'This is a sample email message.',
    files: {
        'file1.txt': __dirname + '/file1.txt',
        'image.jpg': __dirname + '/image.jpg'
    }
});
</pre>
  <p>
    <strong>Note</strong>: When using the <strong>files</strong> property, the file must be accessible through <a href="http://nodejs.org/docs/v0.6.7/api/fs.html#fs.readFile">fs.readFile</a>. If the file you wish to attach is hosted in Windows Azure Storage, such as in a Blob container, you must first copy the file to local storage or an Azure drive before it can be sent as an attachment using the <strong>files</strong> property.</p>
  <h2>
    <a id="usefilters">
    </a>How to: Use Filters to Enable Footers, Tracking, and Twitter</h2>
  <p>SendGrid provides additional email functionality through the use of filters. These are settings that can be added to an email message to enable specific functionality such as enabling click tracking, Google analytics, subscription tracking, and so on. For a full list of filters, see <a href="http://docs.sendgrid.com/documentation/api/smtp-api/filter-settings/">Filter Settings</a>.</p>
  <p>Filters can be applied to a message by using the <strong>filters</strong> property. Each filter is specified by a hash containing filter-specific settings. The following examples demonstrate the footer, click tracking, and Twitter filters:</p>
  <h3>Footer</h3>
  <pre class="prettyprint">sender.send({
    to: 'john@contoso.com',
    from: 'anna@contoso.com',
    subject: 'test mail',
    text: 'This is a sample email message.',
    filters: {
        'footer': {
            'settings': {
                'enable': 1,
                'text/plain': 'This is a text footer.'
            }
        }
    }
});
</pre>
  <h3>Click Tracking</h3>
  <pre class="prettyprint">sender.send({
    to: 'john@contoso.com',
    from: 'anna@contoso.com',
    subject: 'test mail',
    text: 'This is a sample email message.',
    filters: {
        'clicktrack': {
            'settings': {
                'enable': 1
            }
        }
    }
});
</pre>
  <h3>Twitter</h3>
  <pre class="prettyprint">sender.send({
    to: 'john@contoso.com',
    from: 'anna@contoso.com',
    subject: 'test mail',
    text: 'This is a sample email message.',
    filters: {
        'twitter': {
            'settings': {
                'enable': 1,
                'username': 'twitter_username',
                'password': 'twitter_password'
            }
        }
    }
});
</pre>
  <h2>
    <a id="updateproperties">
    </a>How to: Update Email Properties</h2>
  <p>Some email properties can be overwritten using <strong>set<em>Property</em></strong> or appended using <strong>add<em>Property</em></strong>. For example, you can add additional recipients by using</p>
  <pre class="prettyprint">email.addTo('jeff@contoso.com');</pre>
  <p>or set a filter by using</p>
  <pre class="prettyprint">email.setFilterSetting({
  'footer': {
    'setting': {
      'enable': 1,
      'text/plain': 'This is a footer.'
    }
  }
});</pre>
  <p>For more information, see <a href="https://github.com/sendgrid/sendgrid-nodejs">sendgrid-nodejs</a>.</p>
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
      <p>SendGrid Node.js module repository: <a href="https://github.com/sendgrid/sendgrid-nodejs">sendgrid-nodejs</a></p>
    </li>
    <li>
      <p>SendGrid API documentation: <a href="http://docs.sendgrid.com/documentation/api/">http://docs.sendgrid.com/documentation/api/</a></p>
    </li>
    <li>
      <p>SendGrid special offer for Windows Azure customers: <a href="http://sendgrid.com/azure.html">http://sendgrid.com/azure.html</a></p>
    </li>
  </ul>