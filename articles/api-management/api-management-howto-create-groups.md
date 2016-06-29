<properties 
	pageTitle="How to create and use groups to manage developer accounts in Azure API Management" 
	description="Learn how to manage developer accounts using groups in Azure API Management" 
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

# How to create and use groups to manage developer accounts in Azure API Management

In API Management, groups are used to manage the visibility of products to developers. Products are first made visible to groups, and then developers in those groups can view and subscribe to the products that are associated with the groups. 

API Management has the following immutable system groups.

-	**Administrators** - Azure subscription administrators are members of this group. Administrators manage API Management service instances, creating the APIs, operations, and products that are used by developers.
-	**Developers** - Authenticated developer portal users fall into this group. Developers are the customers that build applications using your APIs. Developers are granted access to the developer portal and build applications that call the operations of an API.
-	**Guests** - Unauthenticated developer portal users, such as prospective customers visiting the developer portal of an API Management instance fall into this group. They can be granted certain read-only access, such as the ability to view APIs but not call them.

In addition to these system groups, administrators can create custom groups or [leverage external groups in associated Azure Active Directory tenants][]. Custom and external groups can be used alongside system groups in giving developers visibility and access to API products. For example, you could create one custom group for developers affiliated with a specific partner organization and allow them access to the APIs from a product containing relevant APIs only. A user can be a member of more than one group.

This guide shows how administrators of an API Management instance can add new groups and associate them with products and developers.

>[AZURE.NOTE] In addition to creating and managing groups in the publisher portal, you can create and manage your groups using the API Management REST API [Group](https://msdn.microsoft.com/library/azure/dn776329.aspx) entity.

## <a name="create-group"> </a>Create a group

To create a new group, click **Manage** in the Azure Classic Portal for your API Management service. This takes you to the API Management publisher portal.

![Publisher portal][api-management-management-console]

>If you have not yet created an API Management service instance, see [Create an API Management service instance][] in the [Get started with Azure API Management][] tutorial.

Click **Groups** from the **API Management** menu on the left, and then click **Add Group**.

![Add new group][api-management-add-group]

Enter a unique name for the group and an optional description, and click **Save**.

![Add new group][api-management-add-group-window]

The new group is displayed in the groups tab. To edit the **Name** or **Description** of the group, click the name of the group in the list. To delete the group, click **Delete**.

![Group added][api-management-new-group]

Now that the group is created, it can be associated with products and developers.

## <a name="associate-group-product"> </a>Associate a group with a product

To associate a group with a product, click **Products** from the **API Management** menu on the left, and then click the name of the desired product.

![Set visibility][api-management-add-group-to-product]

Select the **Visibility** tab to add and remove groups, and to view the current groups for the product. To add or remove groups, check or uncheck the checkboxes for the desired groups and click **Save**.

![Set visibility][api-management-add-group-to-product-visibility]

>[AZURE.NOTE] To add Azure Active Directory groups, see [How to authorize developer accounts using Azure Active Directory in Azure API Management](api-management-howto-aad.md).
>
>To configure groups from the **Visibility** tab for a product, click **Manage Groups**.

Once a product is associated with a group, developers in that group can view and subscribe to the product.

## <a name="associate-group-developer"> </a>Associate groups with developers

To associate groups with developers, click **Users** from the **API Management** menu on the left, and then check the box beside the developers you wish to associate with a group.

![Add developer to group][api-management-add-group-to-developer]

Once the desired developers are checked, click the desired group in the **Add to Group** drop-down. Developers can be removed from groups by using the **Remove from Group** drop-down. 

![Developers][api-management-add-group-to-developer-saved]

Once the association is added between the developer and the group, you can view it in the **Users** tab.


## <a name="next-steps"> </a>Next steps

-	Once a developer is added to a group, they can view and subscribe to the products associated with that group. For more information, see [How create and publish a product in Azure API Management][],
-	In addition to creating and managing groups in the publisher portal, you can create and manage your groups using the API Management REST API [Group](https://msdn.microsoft.com/library/azure/dn776329.aspx) entity.


[api-management-management-console]: ./media/api-management-howto-create-groups/api-management-management-console.png
[api-management-add-group]: ./media/api-management-howto-create-groups/api-management-add-group.png
[api-management-add-group-window]: ./media/api-management-howto-create-groups/api-management-add-group-window.png
[api-management-new-group]: ./media/api-management-howto-create-groups/api-management-new-group.png
[api-management-add-group-to-product]: ./media/api-management-howto-create-groups/api-management-add-group-to-product.png
[api-management-add-group-to-product-visibility]: ./media/api-management-howto-create-groups/api-management-add-group-to-product-visibility.png
[api-management-add-group-to-developer]: ./media/api-management-howto-create-groups/api-management-add-group-to-developer.png
[api-management-add-group-to-developer-saved]: ./media/api-management-howto-create-groups/api-management-add-group-to-developer-saved.png

[api-management-]: ./media/api-management-howto-create-groups/api-management-.png

[Create a group]: #create-group
[Associate a group with a product]: #associate-group-product
[Associate groups with developers]: #associate-group-developer
[Next steps]: #next-steps

[How create and publish a product in Azure API Management]: api-management-howto-add-products.md

[Get started with Azure API Management]: api-management-get-started.md
[Create an API Management service instance]: api-management-get-started.md#create-service-instance
[leverage external groups in associated Azure Active Directory tenants]: api-management-howto-aad.md#how-to-add-an-external-azure-active-directory-group
