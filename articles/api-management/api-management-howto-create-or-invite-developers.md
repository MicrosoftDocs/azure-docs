<properties 
	pageTitle="How manage user accounts in Azure API Management | Microsoft Azure" 
	description="Learn how to create or invite users in Azure API Management" 
	services="api-management" 
	documentationCenter="" 
	authors="steved0x" 
	manager="erikre" 
	editor=""/>

<tags 
	ms.service="api-management" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/25/2016" 
	ms.author="sdanie"/>

# How to manage user accounts in Azure API Management

In API Management, developers are the users of the APIs that you expose using API Management. This guide shows to how to create and invite developers to use the APIs and products that you make available to them with your API Management instance. For information on managing user accounts programmatically, see the [User entity](https://msdn.microsoft.com/library/azure/dn776330.aspx) documentation in the [API Management REST](https://msdn.microsoft.com/library/azure/dn776326.aspx) reference.

## <a name="create-developer"> </a>Create a new developer

To create a new developer, click **Manage** in the Azure Classic Portal for your API Management service. This takes you to the API Management publisher portal. If you have not yet created an API Management service instance, see [Create an API Management service instance][] in the [Get started with Azure API Management][] tutorial.

![Publisher portal][api-management-management-console]

Click **Users** from the **API Management** menu on the left, and then click **add user**.

![Create developer][api-management-create-developer]

Enter the **Email**, **Password**, and **Name** for the new developer and click **Save**.

![Create developer][api-management-add-new-user]

By default, newly created developer accounts are **Active**, and associated with the **Developers** group.

![New developer][api-management-new-developer]

Developer accounts that are in an **active** state can be used to access all of the APIs for which they have subscriptions. To associate the newly created developer with additional groups, see [How to associate groups with developers][].

## <a name="invite-developer"> </a>Invite a developer

To invite a developer, click **Users** from the **API Management** menu on the left, and then click **Invite User**.

![Invite developer][api-management-invite-developer]

Enter the name and email address of the developer, and click **Invite**.

![Invite developer][api-management-invite-developer-window]

A confirmation message is displayed, but the newly invited developer does not appear in the list until after they accept the invitation. 

![Invite confirmation][api-management-invite-developer-confirmation]

When a developer is invited, an email is sent to the developer. This email is generated using a template and is customizable. For more information, see [Configure email templates][].

Once the invitation is accepted, the account becomes active.

## <a name="block-developer"> </a> Deactivate or reactivate a developer account

By default, newly created or invited developer accounts are **Active**. To deactivate a developer account, click **Block**. To reactivate a blocked developer account, click **Activate**. A blocked developer account can not access the developer portal or call any APIs. To delete a user account, click **Delete**.

![Block developer][api-management-new-developer]

## Reset a user password

To reset the password for a user account, click the name of the account.

![Reset password][api-management-view-developer]

Click **Reset password** to send a link to the user to reset their password.

![Reset password][api-management-reset-password]

To programmatically work with user accounts, see the [User entity](https://msdn.microsoft.com/library/azure/dn776330.aspx) documentation in the [API Management REST](https://msdn.microsoft.com/library/azure/dn776326.aspx) reference. To reset a user account password to a specific value, you can use the [Update a user](https://msdn.microsoft.com/library/azure/dn776330.aspx#UpdateUser) operation and specify the desired password.

## Pending verification

![Pending verification][api-management-pending-verification]

## <a name="next-steps"> </a>Next steps

Once a developer account is created, you can associate it with roles and subscribe it to products and APIs. For more information, see [How to create and use groups][].


[api-management-management-console]: ./media/api-management-howto-create-or-invite-developers/api-management-management-console.png
[api-management-add-new-user]: ./media/api-management-howto-create-or-invite-developers/api-management-add-new-user.png
[api-management-create-developer]: ./media/api-management-howto-create-or-invite-developers/api-management-create-developer.png
[api-management-invite-developer]: ./media/api-management-howto-create-or-invite-developers/api-management-invite-developer.png
[api-management-new-developer]: ./media/api-management-howto-create-or-invite-developers/api-management-new-developer.png
[api-management-invite-developer-window]: ./media/api-management-howto-create-or-invite-developers/api-management-invite-developer-window.png
[api-management-invite-developer-confirmation]: ./media/api-management-howto-create-or-invite-developers/api-management-invite-developer-confirmation.png
[api-management-pending-verification]: ./media/api-management-howto-create-or-invite-developers/api-management-pending-verification.png
[api-management-view-developer]: ./media/api-management-howto-create-or-invite-developers/api-management-view-developer.png
[api-management-reset-password]: ./media/api-management-howto-create-or-invite-developers/api-management-reset-password.png
[]: ./media/api-management-howto-create-or-invite-developers/.png



[Create a new developer]: #create-developer
[Invite a developer]: #invite-developer
[Deactivate or reactivate a developer account]: #block-developer
[Next steps]: #next-steps
[How to create and use groups]: api-management-howto-create-groups.md
[How to associate groups with developers]: api-management-howto-create-groups.md#associate-group-developer

[Get started with Azure API Management]: api-management-get-started.md
[Create an API Management service instance]: api-management-get-started.md#create-service-instance
[Configure email templates]: api-management-howto-configure-notifications.md#email-templates