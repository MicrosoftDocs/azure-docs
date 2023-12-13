---
title: How to secure access to Azure Data Catalog
description: This article explains how to secure a data catalog and its data assets in Azure Data Catalog.
ms.service: data-catalog
ms.topic: how-to
ms.date: 12/16/2022
---
# How to secure access to data catalog and data assets

[!INCLUDE [Microsoft Purview redirect](includes/catalog-to-purview-migration-flag.md)]

> [!IMPORTANT]
> This feature is available only in the standard edition of Azure Data Catalog.

Azure Data Catalog allows you to specify who can access the data catalog and what operations (register, annotate, take ownership) they can perform on metadata in the catalog. 

## Catalog users and permissions

To give a user or a group the access to a data catalog and set permissions:

1. On the [home page of your data catalog](https://www.azuredatacatalog.com),  select **Settings** on the toolbar.

   :::image type="content" source="media/data-catalog-how-to-secure-catalog/data-catalog-settings.png" alt-text="Settings button in the toolbar highlighted.":::

2. In the settings page, expand the **Catalog Users** section.

   :::image type="content" source="media/data-catalog-how-to-secure-catalog/data-catalog-add-button.png" alt-text="Catalog Users section is expanded, and the Add button is selected.":::

3. Select **Add**.

4. Enter the fully qualified **user name** or name of the **security group** in the Microsoft Entra ID associated with the catalog. Use comma (`,’) as a separator if you're adding more than one user or group.

   :::image type="content" source="media/data-catalog-how-to-secure-catalog/data-catalog-users-groups.png" alt-text="Example user name and security groups added in the space, with a comma separating the two.":::

5. Press **ENTER** or **TAB** out of the text box. 

6. Confirm that all permissions (**Annotate**, **Register**, and **Take Ownership**) are assigned to these users or groups by default. That is, the user or group can [register data assets]( data-catalog-how-to-register.md), [annotate data assets]( data-catalog-how-to-annotate.md), and [take ownership of data assets]( data-catalog-how-to-manage.md). 

   :::image type="content" source="media/data-catalog-how-to-secure-catalog/data-catalog-default-permissions.png" alt-text="All permissions have been selected for each user.":::

7. To give a user or group only the read access to the catalog, clear the **annotate** option for that user or group. Now the user or group can’t annotate data assets in the catalog, but they can view them. 

8. To deny a user or group from registering data assets, clear the **register** option for that user or group.

9. To deny a user from taking ownership of a data asset, clear the **take ownership** option for that user or group. 

10. To delete a user/group from catalog users, select **x** for the user/group at the bottom of the list. 

   :::image type="content" source="media/data-catalog-how-to-secure-catalog/data-catalog-delete-user.png" alt-text="Users are shown at the bottom of the permissions list, and the x button beside one of the users has been highlighted.":::

   > [!IMPORTANT]
   > We recommend that you add security groups to catalog users rather than adding users directly and assign permissions. Then, add users to the security groups that match their roles and their required access to the catalog.

## Special considerations

- The permissions assigned to security groups are additive. For example: a user is in two groups. One group has annotate permissions and other group doesn't have annotate permissions. Then, the user has annotate permissions. 
- The permissions assigned explicitly to a user override the permissions assigned to groups to which the user belongs. For example: A user is in a group that has annotate permissions. If you explicitly add the user to catalog users and don't assign annotate permissions, then the user can’t annotate data assets. The explicit permission on the user overrides the group permissions.

## Next steps

- [Get started with Azure Data Catalog](data-catalog-get-started.md)
