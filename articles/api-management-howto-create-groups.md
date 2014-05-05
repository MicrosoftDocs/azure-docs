# How to create and use groups in Azure API Management

In API Management, groups are used to manage the visibility of products to developers. Products are first made visible to groups, and then developers in those groups can view and subscribe to the products that are associated with the groups. This guide shows how administrators of an API Management instance can add new groups and associate them with products and developers.

## In this topic

-   [Create a group][]
-   [Associate a group with a product][]
-   [Associate groups with developers][]
-   [Next steps][]

## <a name="create-group"> </a>Create a group

To create a new group, click **Management Console** in the Azure Portal for your API Management service. This takes you to the API Management administrative portal.

![api-management-management-console][]

Click **groups** from the **API Management** menu on the left, and then click **add group**.

![api-management-add-group][]

Enter a unique name for the group and an optional description, and click **Save**.

![api-management-add-group-window][]

The new group is displayed in the groups tab. To edit the **Name** or **Description** of the group, click the name of the group in the list. To delete the group, click **delete**.

![api-management-new-group][]

Now that the group is created, it can be associated with products and developers.

## <a name="associate-group-product"> </a>Associate a group with a product

To associate a group with a product, click **Products** from the **API Management** menu on the left, and then click either **configure** or the name of the desired product.

![api-management-add-group-to-product][]

Select the **visibility** tab to add and remove groups, and to view the current groups for the product. To add or remove groups, check or uncheck the checkboxes for the desired groups and click **Save**.

>To configure groups from the **visibility** tab for a product, click **manage groups**.

![api-management-add-group-to-product-visibility][]

Once a product is associated with a group, any developers in that group can view and subscribe to the product.

## <a name="associate-group-developer"> </a>Associate groups with developers

To associate groups with developers, click **Developers** from the **API Management** menu on the left, and then check the box beside the developers you wish to associate with a group.

![api-management-add-group-to-developer][]

Once the desired developers are checked, click the desired group in the **Add to group** dropdown. 

![api-management-add-group-to-developer-dropdown][]

If the developer is not associated with the group, an association is added. If the developer is already associated with the group, the association is removed.

![api-management-add-group-to-developer-saved][]

Once the association is added between the developer and the group, you can view it in the **Developers** tab.

## <a name="next-steps"> </a>Next steps

Next steps will be filled with links to related material once I finish the other topics. I will update this when I sweep the images.


[api-management-management-console]: ./Media/api-management-howto-create-groups/api-management-management-console.png
[api-management-add-group]: ./Media/api-management-howto-create-groups/api-management-add-group.png
[api-management-add-group-window]: ./Media/api-management-howto-create-groups/api-management-add-group-window.png
[api-management-new-group]: ./Media/api-management-howto-create-groups/api-management-new-group.png
[api-management-add-group-to-product]: ./Media/api-management-howto-create-groups/api-management-add-group-to-product.png
[api-management-add-group-to-product-visibility]: ./Media/api-management-howto-create-groups/api-management-add-group-to-product-visibility.png
[api-management-add-group-to-developer]: ./Media/api-management-howto-create-groups/api-management-add-group-to-developer.png
[api-management-add-group-to-developer-dropdown]: ./Media/api-management-howto-create-groups/api-management-add-group-to-developer-dropdown.png
[api-management-add-group-to-developer-saved]: ./Media/api-management-howto-create-groups/api-management-add-group-to-developer-saved.png

[api-management-]: ./Media/api-management-howto-create-groups/api-management-.png

[Create a group]: #create-group
[Associate a group with a product]: #associate-group-product
[Associate groups with developers]: #associate-group-developer
[Next steps]: #next-steps