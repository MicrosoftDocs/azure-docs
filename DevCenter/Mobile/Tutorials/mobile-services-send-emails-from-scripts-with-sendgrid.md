<properties linkid="develop-mobile-tutorials-send-email-with-sendgrid" urlDisplayName="Send Email Using SendGrid" pageTitle="Send email using SendGrid - Windows Azure Mobile Services" metaKeywords="Windows Azure SendGrid, SendGrid service, Azure emailing, mobile services email" metaDescription="Learn how to use the SendGrid service to send email from your Windows Azure Mobile Services app." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

<div title="This is rendered content from macro" class="umbMacroHolder" onresizestart="return false;" umbpageid="15161" umbversionid="f1a70b05-645d-4fcd-bb15-74674509c46a" ismacro="true" umb_chunkpath="devcenter/Menu" umb_modaltrigger="" umb_chunkurl="" umb_hide="0" umb_chunkname="MobileArticleLeft" umb_modalpopup="0" umb_macroalias="AzureChunkDisplayer"><!-- startUmbMacro --><span><strong>Azure Chunk Displayer</strong><br />No macro content available for WYSIWYG editing</span><!-- endUmbMacro --></div>

# Send email from Mobile Services with SendGrid

This topic shows you how can add email functionality to your mobile service. In this tutorial you add server side scripts to send email using SendGrid. When complete, your mobile service will send an email each time a record is inserted.

SendGrid is a cloud-based email service that provides reliable email delivery, scalability, and real-time analytics, along with flexible APIs that make custom integration easy. For more information, see [http://sendgrid.com][].

This tutorial walks you through these basic steps to enable email functionality:

1. [Create a SendGrid account]
2. [Add a script to send email]
3. [Insert data to receive email]

This tutorial is based on the Mobile Services quickstart. Before you start this tutorial, you must first complete [Get started with Mobile Services]. 

<a name="sign-up"></a><h2><span class="short-header">Create a new account</span>Create a new SendGrid account</h2>

<div chunk="../../Shared/Chunks/sendgrid-sign-up.md" />

<a name="add-script"></a><h2><span class="short-header">Register a script</span>Register a new script that sends emails</h2>

1. Log on to the [Windows Azure Management Portal], click **Mobile Services**, and then click your app.

2. In the Management Portal, click the **Data** tab and then click the **TodoItem** table. 

   ![][1]

3. In **todoitem**, click the **Script** tab and select **Insert**.
   
   ![][2]

   This displays the function that is invoked when an insert occurs in the **TodoItem** table.

4. Replace the insert function with the following code:

        var SendGrid = require('sendgrid').SendGrid;
        
        function insert(item, user, request) {    
            request.execute({
                success: function() {
                    // After the record has been inserted, send the response immediately to the client
                    request.respond();
                    // Send the email in the background
                    sendEmail(item);
                }
            });

            function sendEmail(item) {
                var sendgrid = new SendGrid('**username**', '**password**');       
                
                sendgrid.send({
                    to: '**email-address**',
                    from: '**from-address**',
                    subject: 'New to-do item',
                    text: 'A new to-do was added: ' + item.text
                }, function(success, message) {
                    // If the email failed to send, log it as an error so we can investigate
                    if (!success) {
                        console.error(message);
                    }
                });
            }
        }

5. Replace the placeholders in the above script with the correct values:

	- **_username_ and _password_**: the SendGrid credentials you identified in [Create a SendGrid account].

	- **_email-address_**: the address that the email is sent to. In a real-world app, you can use tables to store and retrieve email addresses. When testing your app, just use your own email address.

	- **_from-address_**: the address from which the email originates. Consider using a registered domain address that belongs to your organization. 

     <div class="dev-callout"><b>Note</b>
     <p>If you do not have a registered domain, you can instead use the domain of your Mobile Service, in the format <strong>notifications@<i>your-mobile-service</i>.azure-mobile.net</strong>. However, messages sent to your mobile service domain are ignored.</p>
    </div> 

6. Click the **Save** button. You have now configured a script to send an email each time a record is inserted into the **TodoItem** table.

##<a name="insert-data"></a><h2><span class="short-header">Insert test data</span>Insert test data to receive email</h2>

1. In the client app project, run the quickstart application. 

   This topic shows the Windows Store version of the quickstart,

2. In the app, type text in **Insert a TodoItem**, and then click **Save**.

   ![][3]

3. Notice that you receive an email, such as one shown in the notification below. 

   ![][4]

Congratulations, you have successfully configured your mobile service to send email by using SendGrid.

## <a name="nextsteps"> </a>Next Steps

Now that you’ve seen how easy it is to use the SendGrid email service with Mobile Services, follow
these links to learn more about SendGrid.

-   SendGrid API documentation:
    <http://docs.sendgrid.com/documentation/api/>
-   SendGrid special offer for Windows Azure customers:
    [http://sendgrid.com/azure.html]

<!-- Anchors. -->
[Create a SendGrid account]: #sign-up
[Add a script to send email]: #add-script
[Insert data to receive email]: #insert-data

<!-- Images. -->
[1]: ../Media/mobile-portal-data-tables.png
[2]: ../Media/mobile-insert-script-push2.png
[3]: ../Media/mobile-quickstart-push1.png
[4]: ../Media/mobile-receive-email.png

<!-- URLs. -->
[Get started with Mobile Services]: ./mobile-services-get-started.md
[sign up page]: http://sendgrid.com/azure.html
[Multiple User Credentials page]: http://sendgrid.com/credentials
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/
[http://sendgrid.com]: http://sendgrid.com/
[http://sendgrid.com/azure.html]: http://sendgrid.com/azure.html
