Azure customers can unlock 25,000 free emails each month. These 25,000 free monthly emails will give you access to advanced reporting and analytics and [all APIs][] (Web, SMTP, Event, Parse and more). For information about additional services provided by SendGrid, see the [SendGrid Features][] page.

### To sign up for a SendGrid account

1. Log in to the [Azure Management Portal][].

2. In the lower pane of the management portal, click **New**.

	![command-bar-new][command-bar-new]

3. Click **Marketplace**.

	![sendgrid-store][sendgrid-store]

4. In the **Choose an Application and Service** dialog, select **SendGrid** and click the right arrow.

5. In the **Personalize Application and Service** dialog select the **SendGrid** plan you want to sign up for.

6. Enter a name to identify your **SendGrid** service in your Azure settings, or use the default value of **SendGridEmailDelivery.Simplified.SMTPWebAPI**. Names must be between 1 and 100 characters in length and contain only alphanumeric characters, dashes, dots, and underscores. The name must be unique in your list of subscribed Azure Store Items.

	![store-screen-2][store-screen-2]

7. Choose a value for the region; for example, West US.

8. Click the right arrow.

9. On the **Review Purchase** tab, review the plan and pricing information, and review the legal terms. If you agree to the terms, click the check mark. After you click the check mark, your SendGrid account will begin the [SendGrid provisioning process].

	![store-screen-3][store-screen-3]

10. After confirming your purchase you are redirected to the add-ons dashboard and you will see the message **Purchasing SendGrid**.

	![sendgrid-purchasing-message][sendgrid-purchasing-message]

	Your SendGrid account is provisioned immediately and you will see the message **Successfully purchased Add-On SendGrid**. Your account and credentials are now created. You are ready to send emails at this point. 

	To modify your subscription plan or see the SendGrid contact settings, click the name of your SendGrid service to open the SendGrid Marketplace dashboard. 

	![sendgrid-add-on-dashboard][sendgrid-add-on-dashboard]

	To send an email using SendGrid, you must supply your  account credentials (username and password).

### To find your SendGrid credentials ###

1. Click **Connection Info**.

	![sendgrid-connection-info-button][sendgrid-connection-info-button]

2. In the *Connection info* dialog, copy the **Password** and Username to use later in this tutorial.

	![sendgrid-connection-info][sendgrid-connection-info]

	To set your email deliverability settings, click the **Manage** button. This will open the Sendgrid.com web interface where you can login and open your SendGrid Control Panel. 

	![sendgrid-control-panel][sendgrid-control-panel]

	For more information on getting started with SendGrid, see [SendGrid Getting Started][].

<!--images-->

[command-bar-new]: ./media/sendgrid-sign-up/sendgrid_BAR_NEW.PNG
[sendgrid-store]: ./media/sendgrid-sign-up/sendgrid_offerings_store.png
[store-screen-2]: ./media/sendgrid-sign-up/sendgrid_store_scrn2.png
[store-screen-3]: ./media/sendgrid-sign-up/sendgrid_store_scrn3.png
[sendgrid-purchasing-message]: ./media/sendgrid-sign-up/sendgrid_purchasing_message.png
[sendgrid-add-on-dashboard]: ./media/sendgrid-sign-up/sendgrid_add-on_dashboard.png
[sendgrid-connection-info]: ./media/sendgrid-sign-up/sendgrid_connection_info.png
[sendgrid-connection-info-button]: ./media/sendgrid-sign-up/sendgrid_connection_info_button.png
[sendgrid-control-panel]: ./media/sendgrid-sign-up/sendgrid_control_panel.png

<!--Links-->

[SendGrid Features]: http://sendgrid.com/features
[Azure Management Portal]: https://manage.windowsazure.com
[SendGrid Getting Started]: http://sendgrid.com/docs
[SendGrid Provisioning Process]: https://support.sendgrid.com/hc/articles/200181628-Why-is-my-account-being-provisioned-
[all APIs]: https://sendgrid.com/docs/API_Reference/index.html

