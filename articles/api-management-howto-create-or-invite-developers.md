<properties 
	pageTitle="How manage developer accounts in Azure API Management" 
	description="Learn how to create or invite developers in Azure API Management" 
	services="api-management" 
	documentationCenter="" 
	authors="steved0x" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="api-management" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/10/2015" 
	ms.author="sdanie"/>

# How to manage developer accounts in Azure API Management

In API Management, developers are the users of the APIs that you expose using API Management. This guide shows to how to create and invite developers to use the APIs and products that you make available to them with your API Management instance.

## <a name="create-developer"> </a>Create a new developer

To create a new developer, click **Manage** in the Azure Portal for your API Management service. This takes you to the API Management publisher portal.

>If you have not yet created an API Management service instance, see [Create an API Management service instance][] in the [Get started with Azure API Management][] tutorial.

![Publisher portal][api-management-management-console]

Click **Developers** from the **API Management** menu on the left, and then click **add user**.

![Create developer][api-management-create-developer]

Enter the **Email**, **Password**, and **Name** for the new developer and click **Save**.

![Create developer][api-management-add-new-user]

By default, newly created developer accounts are **Active**, and associated with the **Developers** group.

![New developer][api-management-new-developer]

Developer accounts that are in an **active** state can be used to access all of the APIs for which they have subscriptions. To associate the newly created developer with additional groups, see [How to associate groups with developers][].

## <a name="invite-developer"> </a>Invite a developer

To invite a developer, click **Developers** from the **API Management** menu on the left, and then click **Invite User**.

![Invite developer][api-management-invite-developer]

Enter the name and email address of the developer, and click **Invite**.

![Invite developer][api-management-invite-developer-window]

A confirmation message is displayed, but the newly invited developer does not appear in the list until after the accept the invitation. 

![Invite confirmation][api-management-invite-developer-confirmation]

>When a developer is invited, an email is sent to the developer. This email is generated using a template and is customizable. For more information, see [Configure email templates][].

Once the invitation is accepted, the account becomes active.

## <a name="block-developer"> </a> Deactivate or reactivate a developer account

By default, newly created or invited developer accounts are **Active**. To deactivate a developer account, click **Block**. To reactivate a blocked developer account, click **Activate**. A blocked developer account can not access the developer portal or call any APIs.

![Block developer][api-management-new-developer]

## <a name="next-steps"> </a>Next steps

Once a developer account is created, you can associate it with roles and subscribe it to products and APIs. For more information, see [How to create and use groups][].


[api-management-management-console]: ./media/api-management-howto-create-or-invite-developers/api-management-management-console.png
[api-management-add-new-user]: ./media/api-management-howto-create-or-invite-developers/api-management-add-new-user.png
[api-management-create-developer]: ./media/api-management-howto-create-or-invite-developers/api-management-create-developer.png
[api-management-invite-developer]: ./media/api-management-howto-create-or-invite-developers/api-management-invite-developer.png
[api-management-new-developer]: ./media/api-management-howto-create-or-invite-developers/api-management-new-developer.png
[api-management-invite-developer-window]: ./media/api-management-howto-create-or-invite-developers/api-management-invite-developer-window.png
[api-management-invite-developer-confirmation]: ./media/api-management-howto-create-or-invite-developers/api-management-invite-developer-confirmation.png
[api-management-]: ./media/api-management-howto-create-or-invite-developers/api-management-.png



[Create a new developer]: #create-developer
[Invite a developer]: #invite-developer
[Deactivate or reactivate a developer account]: #block-developer
[Next steps]: #next-steps
[How to create and use groups]: api-management-howto-create-groups.md
[How to associate groups with developers]: api-management-howto-create-groups.md#associate-group-developer

[Get started with Azure API Management]: api-management-get-started.md
[Create an API Management service instance]: api-management-get-started.md#create-service-instance
[Configure email templates]: api-management-howto-configure-notifications.md#email-templates