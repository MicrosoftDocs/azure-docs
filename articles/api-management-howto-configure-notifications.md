# How to configure notifications in Azure API Management

The Notifications tab for API Management is used to configure notifications for specific events, and to configure the email templates that are used to communicate with the administrators and developers of an API management instance. This topic shows how to configure notifications for the available events, and provides an overview of configuring the email templates used for these events.

## In this topic

-   [Configure publisher notifications][]
-   [Configure email templates][]

## <a name="publisher-notifications"> </a>Configure publisher notifications

To configure notifications, click **Management Console** in the Azure Portal for your API Management service. This takes you to the API Management administrative portal.

![api-management-management-console][]

Click **Notifications** from the **API Management** menu on the left to view the available notifications.

![api-management-publisher-notifications][]

The following list of events can be configured for notifications.

-	**Subscription requests (requiring approval)** - The specified email recipients and users will receive email notifications about subscription requests for API products requiring approval.
-	**New subscriptions** - The specified email recipients and users will receive email notifications about new API product subscriptions.
-	**Application gallery requests** - The specified email recipients and users will receive email notifications when new applications are submitted to the application gallery.
-	**BCC** - The specified email recipients and users will receive email blind carbon copies of all emails sent to developers.
-	**Expired subscription reminder** - The specified email recipients and users will receive email notifications about expiration subscriptions.
-	**New issue or comment** - The specified email recipients and users will receive email notifications when a new issue or comment is submitted on the developer portal.
-	**Close account message** - The specified email recipients and users will receive email notifications when an account is closed.

For each event, you can specify email recipients using the email address text box or you can select users from a list.

To specify the email addresses to be notified, enter them in the email address text box. If you have multiple email addresses, separate them using commas.

![api-management-email-addresses][]

To specify the users to be notified, click **add recipient**.

![api-management-add-recipient][]

Check the box beside the users to be notified and click **OK**.

![api-management-recipient-list][]

>Note that only administrators are displayed in the list.

After configuring the desired recipients, click **Save** to apply the updated notification recipients.

![api-management-publisher-notifications-save][]

>If you navigate away from the **publisher notifications** tab the API Management portal alerts you if there are unsaved changes.

## <a name="email-templates"> </a>Configure email templates

API Management provides email templates for the email messages that are sent in the course of administering and using the service. The following email templates are provided.

-	Application gallery submission approved
-	Invite user
-	New comment added to an issue
-	New issue received
-	New subscription activated
-	Subscription expired
-	Subscription expires soon
-	Subscription renewed confirmation
-	Subscription request declines
-	Subscription request received

These templates can be modified as desired.

To view and configure the email templates for your API Management instance, click **Notifications** from the **API Management** menu on the left, and select the **email templates** tab.

![api-management-email-templates][]

To view or modify a specific template, select it from the **Templates** drop-down list.

![api-management-email-templates-list][]

Each email template has a subject in plain text, and a body definition in HTML format. Each item can be customized as desired.

![api-management-subscription-expires-soon][]

The **Parameters** list contains a list of parameters, which when inserted into the subject or body, will be replaced the designated value when the email is sent. To insert a parameter, place the cursor where you wish the parameter to go, and click the arrow to the left of the parameter name.

Click **Preview** or **Send a test** to see how the email will look or send a test email.

>Note that the parameters are not replaced with actual values when previewing or sending a test.
>
>To save the changes to the email template, click **Save**, or to cancel the changes click **Cancel**.



[api-management-management-console]: ./Media/api-management-howto-configure-notifications/api-management-management-console.png
[api-management-publisher-notifications]: ./Media/api-management-howto-configure-notifications/api-management-publisher-notifications.png
[api-management-email-addresses]: ./Media/api-management-howto-configure-notifications/api-management-email-addresses.png
[api-management-add-recipient]: ./Media/api-management-howto-configure-notifications/api-management-add-recipient.png
[api-management-recipient-list]: ./Media/api-management-howto-configure-notifications/api-management-recipient-list.png
[api-management-email-templates]: ./Media/api-management-howto-configure-notifications/api-management-email-templates.png
[api-management-email-templates-list]: ./Media/api-management-howto-configure-notifications/api-management-email-templates-list.png
[api-management-subscription-expires-soon]: ./Media/api-management-howto-configure-notifications/api-management-subscription-expires-soon.png
[api-management-publisher-notifications-save]: ./Media/api-management-howto-configure-notifications/api-management-publisher-notifications-save.png

[Configure publisher notifications]: #publisher-notifications
[Configure email templates]: #email-templates

[How to create and use roles]: ./api-management-hotwo-create-roles
[How to associate roles with developers]: ./api-management-hotwo-create-roles/#associate-role-developer