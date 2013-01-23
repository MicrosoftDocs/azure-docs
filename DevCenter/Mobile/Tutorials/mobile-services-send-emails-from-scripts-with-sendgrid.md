<properties linkid="develop-mobile-tutorials-send-email-with-sendgrid" urlDisplayName="Send Email Using SendGrid" pageTitle="Send email using SendGrid - Windows Azure Mobile Services" metaKeywords="Windows Azure SendGrid, SendGrid service, Azure emailing, mobile services email" metaDescription="Learn how to use the SendGrid service to send email from your Windows Azure Mobile Services app." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />



# Send email from Mobile Services with SendGrid

This topic shows you how can add email functionality to your Mobile Service. In this tutorial you add server side scripts to send email using SendGrid. When complete, your Mobile Service will send an email each time a record is inserted.

This tutorial walks you through these basic steps to enable email functionality:

1. [Sign up for a SendGrid account]
2. [Add a script to send email]
3. [Insert data to receive email]

This tutorial is based on the Mobile Services quickstart. Before you start this tutorial, you must first complete [Get started with Mobile Services]. 

## <a name="sign-up"></a>Sign up for a SendGrid account

To get started with SendGrid, evaluate pricing and sign up information at http://sendgrid.com. Windows Azure customers receive a special offer of 25,000 free emails per month from SendGrid. 

1. Navigate to the [sign up page] at sendgrid.com to take advantage of the special offer for Windows Azure customers. Click the **Sign Up Now** button and then follow the instructions to setup your account.

    <div class="dev-callout"><b>Note</b>
	<p>The provisioning process for a SendGrid account can take several hours.</p>
    </div> 

2. Once your SendGrid account has been successfully provisioned, navigate to the [Multiple User Credentials page] and click the **Add New Credential** button. This page lets you create a separate set of credentials that can only send emails.

3. Enter a name and password, check the **Mail** checkbox and then click **Create Credential**. 

    <div class="dev-callout"><b>Security Note</b>
	<p>The password entered for this step will be pasted into a script and should be unique - do not reuse an existing password. </p>
    </div> 

## <a name="add-script"></a>Add a script to send email

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
                var sendgrid = new SendGrid('**enter name here**', '**enter password here**');       
                
                sendgrid.send({
                    to: '**enter email address here**',
                    from: '**enter from address here**',
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
	- name and password: these are the credentials you created in step 3 of [Sign up for a SendGrid account].
	- email address: this is the address the email will be sent to. Enter your own email address here so you can tell if its working.
	- from address: this is the address that the email will originate from. If you have a registered domain this would be a good candidate, e.g. "notifications@yourdomain.com". If you do not have a registered domain, you can use the URL of your Mobile Service, e.g. "notifications@mymobileservice.azure-mobile.net".

6. Click the **Save** button. You have now configured a script to send an email each time a record is inserted into the **TodoItem** table.

##<a name="insert-data"></a>Insert data to receive email

1. Run the quickstart application.

2. In the app, type text in **Insert a TodoItem**, and then click **Save**.

   ![][3]

   You should receive an email. Congratulations, you have successfully configured your Mobile Service to send email via SendGrid.

   ![][4]

<!-- Anchors. -->
[Sign up for a SendGrid account]: #sign-up
[Add a script to send email]: #add-script
[Insert data to receive email]: #insert-data

<!-- Images. -->
[1]: ../Media/mobile-portal-data-tables.png
[2]: ../Media/mobile-insert-script-push2.png
[3]: ../Media/mobile-quickstart-push1.png
[4]: ../Media/mobile-receive-email.png

<!-- URLs. -->
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started/#create-new-service
[sign up page]: http://sendgrid.com/azure.html
[Multiple User Credentials page]: http://sendgrid.com/credentials
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/

