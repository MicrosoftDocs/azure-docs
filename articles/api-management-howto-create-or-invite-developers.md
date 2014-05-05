# How to create or invite developers in Azure API Management

In API Management, developers are the users of the APIs that you expose using API Management. This guide shows to how to create and invite developers to use the APIs and products that you make available to them with your API management instance.

## In this topic

-   [Create a new developer][]
-   [Invite a developer][]
-   [Deactivate or reactivate a developer account][]
-   [Next steps][]

## <a name="create-developer"> </a>Create a new developer

To create a new developer, click **Management Console** in the Azure Portal for your API Management service. This takes you to the API Management administrative portal.

![api-management-management-console][]

Click **Developers** from the **API Management** menu on the left, and then click **add user**.

![api-management-create-developer][]

Enter the email, password, and name for the new developer and click **Save**.

![api-management-add-new-user][]

By default, newly created developer accounts are **active**, and associated with the **Developer** role.

![api-management-new-developer][]

Developer accounts that are in an **active** state can be used to access all of the APIs for which they have subscriptions. To associate the newly created account with additional roles, see [How to associate roles with developers][].

## <a name="invite-developer"> </a>Invite a developer

To invite a developer, click **Developers** from the **API Management** menu on the left, and then click **invite user**.

![api-management-invite-developer][]

Enter the name and email address of the developer, and click **Invite**.

![api-management-invite-developer-window][]

A confirmation message is displayed, but the newly invited developer does not appear in the list until after the accept the invitation. Once the invitation is accepted, the account becomes active.

![api-management-invite-developer-confirmation][]


## <a name="block-developer"> </a> Deactivate or reactivate a developer account

By default, newly created or invited developer accounts are **active**. To deactivate a developer account, click **block**. To reactivate a blocked developer account, click **activate**. A blocked developer account can not access the developer portal or call any APIs.

![api-management-new-developer][]

## <a name="next-steps"> </a>Next steps

Once a developer account is created, you can associate it with roles and subscribe it to products and APIs. For more information, see [How to create and use roles][].


[api-management-management-console]: ./Media/api-management-howto-create-or-invite-developers/api-management-management-console.png
[api-management-add-new-user]: ./Media/api-management-howto-create-or-invite-developers/api-management-add-new-user.png
[api-management-create-developer]: ./Media/api-management-howto-create-or-invite-developers/api-management-create-developer.png
[api-management-invite-developer]: ./Media/api-management-howto-create-or-invite-developers/api-management-invite-developer.png
[api-management-new-developer]: ./Media/api-management-howto-create-or-invite-developers/api-management-new-developer.png
[api-management-invite-developer-window]: ./Media/api-management-howto-create-or-invite-developers/api-management-invite-developer-window.png
[api-management-invite-developer-confirmation]: ./Media/api-management-howto-create-or-invite-developers/api-management-invite-developer-confirmation.png
[api-management-]: ./Media/api-management-howto-create-or-invite-developers/api-management-.png



[Create a new developer]: #create-developer
[Invite a developer]: #invite-developer
[Deactivate or reactivate a developer account]: #block-developer
[Next steps]: #next-steps
[How to create and use roles]: ./api-management-hotwo-create-roles
[How to associate roles with developers]: ./api-management-hotwo-create-roles/#associate-role-developer