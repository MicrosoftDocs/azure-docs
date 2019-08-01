---
title: Configure notifications and email templates in Azure API Management | Microsoft Docs
description: Learn how to configure notifications and email templates in Azure API Management.
services: api-management
documentationcenter: ''
author: vladvino
manager: cfowler
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/02/2018
ms.author: apimpm
---
# How to configure notifications and email templates in Azure API Management
API Management provides the ability to configure notifications for specific events, and to configure the email templates that are used to communicate with the administrators and developers of an API Management instance. This article shows how to configure notifications for the available events, and provides an overview of configuring the email templates used for these events.

## Prerequisites

If you do not have an API Management service instance, complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md).

[!INCLUDE [premium-dev-standard-basic.md](../../includes/api-management-availability-premium-dev-standard-basic.md)]

## <a name="publisher-notifications"> </a>Configure notifications

1. Select your **API MANAGEMENT** instance.
2. Click **Notifications** to view the available notifications.

    ![Publisher notifications][api-management-publisher-notifications]

    The following list of events can be configured for notifications.

   * **Subscription requests (requiring approval)** - The specified email recipients and users will receive email notifications about subscription requests for API products requiring approval.
   * **New subscriptions** - The specified email recipients and users will receive email notifications about new API product subscriptions.
   * **Application gallery requests** - The specified email recipients and users will receive email notifications when new applications are submitted to the application gallery.
   * **BCC** - The specified email recipients and users will receive email blind carbon copies of all emails sent to developers.
   * **New issue or comment** - The specified email recipients and users will receive email notifications when a new issue or comment is submitted on the developer portal.
   * **Close account message** - The specified email recipients and users will receive email notifications when an account is closed.
   * **Approaching subscription quota limit** - The following email recipients and users will receive email notifications when subscription usage gets close to usage quota.

     For each event, you can specify email recipients using the email address text box or you can select users from a list.

3. To specify the email addresses to be notified, enter them in the email address text box. If you have multiple email addresses, separate them using commas.

    ![Notification recipients][api-management-email-addresses]
4. Press **Add**.

## <a name="email-templates"> </a>Configure notification templates
API Management provides notification templates for the email messages that are sent in the course of administering and using the service. The following email templates are provided.

* Application gallery submission approved
* Developer farewell letter
* Developer quota limit approaching notification
* Invite user
* New comment added to an issue
* New issue received
* New subscription activated
* Subscription renewed confirmation
* Subscription request declines
* Subscription request received

These templates can be modified as desired.

To view and configure the email templates for your API Management instance, click **Notifications templates**.

![Email templates][api-management-email-templates]

Each email template has a subject in plain text, and a body definition in HTML format. Each item can be customized as desired.

![Email template editor][api-management-email-template]

The **Parameters** list contains a list of parameters, which when inserted into the subject or body, will be replaced the designated value when the email is sent. To insert a parameter, place the cursor where you wish the parameter to go, and click the arrow to the left of the parameter name.

> [!NOTE] 
> The parameters are not replaced with actual values when previewing or sending a test.

To save the changes to the email template, click **Save**, or to cancel the changes click **Discard**.
 

[api-management-management-console]: ./media/api-management-howto-configure-notifications/api-management-management-console.png
[api-management-publisher-notifications]: ./media/api-management-howto-configure-notifications/api-management-publisher-notifications.png
[api-management-email-addresses]: ./media/api-management-howto-configure-notifications/api-management-email-addresses.png


[api-management-email-templates]: ./media/api-management-howto-configure-notifications/api-management-email-templates.png
[api-management-email-templates-list]: ./media/api-management-howto-configure-notifications/api-management-email-templates-list.png
[api-management-email-template]: ./media/api-management-howto-configure-notifications/api-management-email-template.png


[Configure publisher notifications]: #publisher-notifications
[Configure email templates]: #email-templates

[How to create and use groups]: api-management-howto-create-groups.md
[How to associate groups with developers]: api-management-howto-create-groups.md#associate-group-developer

[Get started with Azure API Management]: get-started-create-service-instance.md
[Create an API Management service instance]: get-started-create-service-instance.md
