# How to create and use roles in Azure API Management

In API Management, roles are used to manage the visibility of products to developers. Products are first made visible to roles, and then developers in those roles can view and subscribe to the products that are associated with the roles. This guide shows how administrators of an API Management instance can add new roles and associate them with products and developers.

## In this topic

-   [Create a role][]
-   [Associate a role with a product][]
-   [Associate roles with developers][]
-   [Next steps][]

## <a name="create-role"> </a>Create a role

To create a new role, click **Management Console** in the Azure Portal for your API Management service. This takes you to the API Management administrative portal.

![api-management-management-console][]

Click **Roles** from the **API Management** menu on the left, and then click **add role**.

![api-management-add-role][]

Enter a unique name for the role and an optional description, and click **Save**.

![api-management-add-role-window][]

The new role is displayed in the roles tab. To edit the **Name** or **Description** of the role, click the name of the role in the list. To delete the role, click **delete**.

![api-management-new-role][]

Now that the role is created, it can be associated with products and developers.

## <a name="associate-role-product"> </a>Associate a role with a product

To associate a role with a product, click **Products** from the **API Management** menu on the left, and then click either **configure** or the name of the desired product.

![api-management-add-role-to-product][]

Select the **visibility** tab to add and remove roles, and to view the current roles for the product. To add or remove roles, check or uncheck the checkboxes for the desired roles and click **Save**.

>To configure roles from the **visibility** tab for a product, click **manage roles**.

![api-management-add-role-to-product-visibility][]

Once a product is associated with a role, any developers in that role can view and subscribe to the product.

## <a name="associate-role-developer"> </a>Associate roles with developers

To associate roles with developers, click **Developers** from the **API Management** menu on the left, and then check the box beside the developers you wish to associate with a role.

![api-management-add-role-to-developer][]

Once the desired developers are checked, click the desired role in the **Add to role** dropdown. 

![api-management-add-role-to-developer-dropdown][]

If the developer is not associated with the role, an association is added. If the developer is already associated with the role, the association is removed.

![api-management-add-role-to-developer-saved][]

Once the association is added between the developer and the role, you can view it in the **Developers** tab.

## <a name="next-steps"> </a>Next steps

Next steps will be filled with links to related material once I finish the other topics. I will update this when I sweep the images.


[api-management-management-console]: ./Media/api-management-howto-create-roles/api-management-management-console.png
[api-management-add-role]: ./Media/api-management-howto-create-roles/api-management-add-role.png
[api-management-add-role-window]: ./Media/api-management-howto-create-roles/api-management-add-role-window.png
[api-management-new-role]: ./Media/api-management-howto-create-roles/api-management-new-role.png
[api-management-add-role-to-product]: ./Media/api-management-howto-create-roles/api-management-add-role-to-product.png
[api-management-add-role-to-product-visibility]: ./Media/api-management-howto-create-roles/api-management-add-role-to-product-visibility.png
[api-management-add-role-to-developer]: ./Media/api-management-howto-create-roles/api-management-add-role-to-developer.png
[api-management-add-role-to-developer-dropdown]: ./Media/api-management-howto-create-roles/api-management-add-role-to-developer-dropdown.png
[api-management-add-role-to-developer-saved]: ./Media/api-management-howto-create-roles/api-management-add-role-to-developer-saved.png

[api-management-]: ./Media/api-management-howto-create-roles/api-management-.png

[Create a role]: #create-role
[Associate a role with a product]: #associate-role-product
[Associate roles with developers]: #associate-role-developer
[Next steps]: #next-steps