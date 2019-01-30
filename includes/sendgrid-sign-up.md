---
author: erikre
ms.service: multiple
ms.topic: include
ms.date: 11/25/2018
ms.author: erikre
---
Azure customers can unlock 25,000 free emails each month. These 25,000 free monthly emails will give you access to advanced reporting and analytics and [all APIs][all APIs] (Web, SMTP, Event, Parse and more). For information about additional services provided by SendGrid, visit the [SendGrid Solutions][SendGrid Solutions] page.

### To sign up for a SendGrid account
1. Sign in to the [Azure portal][Azure portal].
2. In the menu on the left, click **Create a resource**.

    ![command-bar-new][command-bar-new]
3. Click **Add-ons** and then **SendGrid Email Delivery**.

    ![sendgrid-store][sendgrid-store]
4. Complete the signup form and select **Create**.

    ![sendgrid-create][sendgrid-create]
5. Enter a **Name** to identify your SendGrid service in your Azure settings. Names must be between 1 and 100 characters in length and contain only alphanumeric characters, dashes, dots, and underscores. The name must be unique in your list of subscribed Azure Store Items.
6. Enter and confirm your **Password**.
7. Choose your **Subscription**.
8. Create a new **Resource group** or use an existing one.
9. In the **Pricing tier** section select the SendGrid plan you want to sign up for.

    ![sendgrid-pricing][sendgrid-pricing]
10. Enter a **Promotion Code** if you have one.
11. Enter your **Contact Information**.
12. Review and accept the **Legal terms**.
13. After confirming your purchase you will see a **Deployment Succeeded** pop-up and you will see your account listed in the **All resources** section.

    ![all-resources][all-resources]

    After you have completed your purchase and clicked the **Manage** button to initiate the email verification process, you will receive an email from SendGrid asking you to verify your account. If you do not receive this email, or have problems verifying your account, please see this FAQ.

    ![manage][manage]

    **You can only send up to 100 emails/day until you have verified your account.**

    To modify your subscription plan or see the SendGrid contact settings, click the name of your SendGrid service to open the SendGrid Marketplace dashboard.

    ![settings][settings]

    To send an email using SendGrid, you must supply your API Key.

### To find your SendGrid API Key
1. Click **Manage**.

    ![manage][manage]
2. In your SendGrid dashboard, select **Settings** and then **API Keys** in the menu on the left.

    ![api-keys][api-keys]

3. Click the **Create API Key**.

    ![general-api-key][general-api-key]
4. At a minimum, provide the **Name of this key** and provide full access to **Mail Send** and select **Save**.

    ![access][access]
5. Your API will be displayed at this point one time. Please be sure to store it safely.

### To find your SendGrid credentials
1. Click the key icon to find your **Username**.

    ![key][key]
2. The password is the one you chose at setup. You can select **Change password** or **Reset password** to make any changes.

To manage your email deliverability settings, click the **Manage button**. This will redirect to your SendGrid dashboard.

![manage][manage]

For more information on sending email through SendGrid, visit the [Email API Overview][Email API Overview].

<!--images-->

[command-bar-new]: ./media/sendgrid-sign-up/new-addon.png
[sendgrid-store]: ./media/sendgrid-sign-up/sendgrid-store.png
[sendgrid-create]: ./media/sendgrid-sign-up/sendgrid-create.png
[sendgrid-pricing]: ./media/sendgrid-sign-up/sendgrid-pricing.png
[all-resources]: ./media/sendgrid-sign-up/all-resources.png
[manage]: ./media/sendgrid-sign-up/manage.png
[settings]: ./media/sendgrid-sign-up/settings.png
[api-keys]: ./media/sendgrid-sign-up/api-keys.png
[general-api-key]: ./media/sendgrid-sign-up/general-api-key.png
[access]: ./media/sendgrid-sign-up/access.png
[key]: ./media/sendgrid-sign-up/key.png

<!--Links-->

[SendGrid Solutions]: https://sendgrid.com/solutions
[Azure portal]: https://portal.azure.com
[SendGrid Getting Started]: http://sendgrid.com/docs
[SendGrid Provisioning Process]: https://support.sendgrid.com/hc/articles/200181628-Why-is-my-account-being-provisioned-
[all APIs]: https://sendgrid.com/docs/API_Reference/index.html
[Email API Overview]: https://sendgrid.com/docs/API_Reference/Web_API_v3/Mail/index.html
