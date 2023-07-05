---
title: Configure notifications and email templates
titleSuffix: Azure API Management
description: Learn how to configure notifications and email templates for events in Azure API Management.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: how-to
ms.date: 06/02/2023
ms.author: danlep
ms.custom: engagement-fy23
---

# How to configure notifications and notification templates in Azure API Management

API Management provides the ability to configure email notifications for specific events, and to configure the email templates that are used to communicate with the administrators and developers of an API Management instance. This article shows how to configure notifications for the available events, and provides an overview of configuring the email templates used for these events.

## Prerequisites

If you don't have an API Management service instance, complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md).

[!INCLUDE [premium-dev-standard-basic.md](../../includes/api-management-availability-premium-dev-standard-basic.md)]

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]

## <a name="publisher-notifications"> </a>Configure notifications in the portal

1. In the left navigation of your API Management instance, select **Notifications** to view the available notifications.

    The following list of events can be configured for notifications.

    -   **Subscription requests (requiring approval)** - The specified email recipients and users will receive email notifications about subscription requests for products requiring approval.
    -   **New subscriptions** - The specified email recipients and users will receive email notifications about new product subscriptions.
    -   **Application gallery requests** (deprecated) - The specified email recipients and users will receive email notifications when new applications are submitted to the application gallery on the legacy developer portal.
    -   **BCC** - The specified email recipients and users will receive email blind carbon copies of all emails sent to developers.
    -   **New issue or comment** (deprecated) - The specified email recipients and users will receive email notifications when a new issue or comment is submitted on the legacy developer portal.
    -   **Close account message** - The specified email recipients and users will receive email notifications when an account is closed.
    -   **Approaching subscription quota limit** - The specified email recipients and users will receive email notifications when subscription usage gets close to usage quota.

        > [!NOTE]
        > Notifications are triggered by the [quota by subscription](quota-policy.md) policy only. The [quota by key](quota-by-key-policy.md) policy doesn't generate notifications.

1. Select a notification, and specify one or more email addresses to be notified:
    * To add the administrator email address, select **+ Add admin**.
    * To add another email address, select **+ Add email**, enter an email address, and select **Add**. 
    * Continue adding email addresses as needed.

    :::image type="content" source="media/api-management-howto-configure-notifications/api-management-email-addresses.png" alt-text="Screenshot showing how to add notification recipients in the portal":::

## <a name="email-templates"> </a>Configure notification templates

API Management provides notification templates for the administrative email messages that are sent automatically to developers when they access and use the service. The following notification templates are provided:

-   Application gallery submission approved (deprecated) 
-   Developer farewell letter
-   Developer quota limit approaching notification
-   Developer welcome letter
-   Email change notification
-   Invite user
-   New comment added to an issue (deprecated) 
-   New developer account confirmation
-   New issue received (deprecated) 
-   New subscription activated
-   Password change confirmation
-   Subscription request declined
-   Subscription request received

Each email template has a subject in plain text, and a body definition in HTML format. Each item can be customized as desired.

> [!NOTE]
> HTML content in a template must be well-formed and adhere to the [XML specification](https://www.w3.org/XML/). The `&nbsp;` character isn't allowed.

To view and configure a notification template in the portal:

1. In the left menu, select **Notification templates**.
    :::image type="content" source="media/api-management-howto-configure-notifications/api-management-email-templates.png" alt-text="Screenshot of notification templates in the portal":::

1. Select a notification template, and configure the template using the editor.

    :::image type="content" source="media/api-management-howto-configure-notifications/api-management-email-template.png" alt-text="Screenshot of notification template editor in the portal":::

    * The **Parameters** list contains a list of parameters, which when inserted into the subject or body, will be replaced by the designated value when the email is sent.
    * To insert a parameter, place the cursor where you wish the parameter to go, and select the parameter name.

1. To save the changes to the email template, select **Save**, or to cancel the changes select **Discard**.

## Configure email settings

You can modify general email settings for notifications that are sent from your API Management instance. You can change the administrator email address, the name of the organization sending notifications, and the originating email address. 

> [!IMPORTANT]
> Changing the originating email address may affect recipients' ability to receive email. See the [considerations](#considerations-for-changing-the-originating-email-address) in the following section.
> 
To modify email settings:

1. In the left menu, select **Notification templates**.
1. Select **E-mail settings**.
1. On the **General email settings** page, enter values for:
    * **Administrator email** - the email address to receive all system notifications and other configured notifications
    * **Organization name** - the name of your organization for use in the developer portal and notifications 
    * **Originating email address** - The value of the `From` header for notifications from the API Management instance. API Management sends notifications on behalf of this originating address.
    
    
      :::image type="content" source="media/api-management-howto-configure-notifications/configure-email-settings.png" alt-text="Screenshot of API Management email settings in the portal":::
1. Select **Save**.

### Considerations for changing the originating email address

Recipients of email notifications from API Management could be affected when you change the originating email address.

* **Change to From address** - When you change the originating email address (for example, to `no-reply@contoso.com`), the `From` address header will be `noreply@contoso.com apimgmt-noreply@mail.windowsazure.com`. This is because the email is being sent by API Management, and not the email server of the originating email address.

* **Email set to Junk or Spam folder** - Some recipients may not receive the email notifications from API Management or emails may get sent to the Junk or Spam folder. This can happen depending on the organization's SPF or DKIM email authentication settings:

    * **SPF authentication** - Email might no longer pass SPF authentication after you change the originating email address domain. To ensure successful SPF authentication and delivery of email, create the following TXT record in the DNS database of the domain specified in the email address. For instance, if the email address is `noreply@contoso.com`, contact the administrator of contoso.com to add the following TXT record: **"v=spf1 include:spf.protection.outlook.com include:_spf-ssg-a.microsoft.com -all"**

    * **DKIM authentication** - To generate a valid signature for DKIM for email authentication, API Management requires the private key associated with the domain of the originating email address. However, it is currently not possible to upload this private key in API Management. Therefore, to assign a valid signature, API Management uses the private key associated with the `mail.windowsazure.com` domain.

## Next steps

* [Overview of the developer portal](api-management-howto-developer-portal.md).
* [How to create and use groups to manage developer accounts](api-management-howto-create-groups.md)
