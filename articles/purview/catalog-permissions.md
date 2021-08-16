---
title: Catalog Permissions (preview)
description: This article gives an overview of how to configure Role-Based Access Control (RBAC) in the Azure Purview
author: yarong
ms.author: yarong
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: conceptual
ms.date: 08/18/2020
---

# Access control in Azure Purview

Azure Purview uses **Collections** to organize and manage access across its sources, assets, and other objects in Purview. This article describes collections and access management in your Azure Purview instance.

> [!NOTE]
> At this time, this information only applies for Purview instances created **on or after August 18th**. Instances created before August 18th are able to create collections, but do not manage permissions through those collections. For information on access control for a Purview instance created before August 18th, see our [**legacy collection guide**](#legacy-collection-guide) at the bottom of the page.

## Collections

A collection is a tool Azure Purview uses to group assets, sources, and other objects into a hierarchy for discoverability and to manage access control. All accesses to Purview's resources are managed from collections in the Purview instance itself.

## Roles

Azure Purview uses a set of predefined roles to control who can access what in Azure Purview. These roles are currently:

- **Collection admins** - can edit Purview collections, their details, and add subcollections. They can also add users into other Purview roles on collections where they're admins.
- **Data source admins** - can manage data sources and data scans.
- **Data curators** - can create, read, modify, and delete catalog data objects and establish relationships between objects.
- **Data readers** - can access but not modify catalog data objects.

## Who should be assigned to what role?

|User Scenario|Appropriate Role(s)|
|-------------|-----------------|
|I just need to find assets, I don't want to edit anything|Data Reader|
|I need to edit information about assets, assign classifications, associate them with glossary entries, and so on.|Data Curator|
|I need to edit the glossary or set up new classification definitions|Data Curator|
|My application's Service Principal needs to push data to Azure Purview|Data Curator|
|I need to set up scans via the Purview Studio|Data Source Admin, plus at least Data Reader **or** Data Curator on the collection where the source is registered.|
|I need to enable a Service Principal or group to set up and monitor scans in Azure Purview without allowing them to access the catalog's information |Data Source Admin|
|I need to put users into roles in Azure Purview | Collection Admin |

## Understanding how to use Azure Purview's roles and collections

All access control is managed in Purview's collections. Purview's collections can be found in the [Purview Studio](use-purview-studio.md) by opening your Purview account in the Azure portal and selecting the Purview Studio tile on the Overview page. From there, navigate to the management center on the left menu, and then select the 'Collections' tab.

When an Azure Purview instance is created, it starts with a root collection that has the same name as the Purview account itself. The creator of the Purview account is automatically added as the Collection Admin of this root collection, and can edit and manage this collection.

Sources, assets, and objects can be added directly to this root collection, but so can other collections. Adding collections will give you more control over who has access to data across your Purview instance.

All other users can only access information within the Azure Purview instance if they, or a group they are in, are given one of the above roles. This means, when an Azure Purview instance is created, no one but the creator can access or use its APIs until they are [added to one or more of above roles in a collection](how-to-create-and-manage-collections.md#add-role-assignments).

Users can only be added to a collection by a collection admin, or through permissions inheritance. The permissions of a parent collection are automatically inherited by subcollections. However, you can choose to [restrict permission inheritance](how-to-create-and-manage-collections.md#restrict-inheritance) on any collection. If you do this, the subcollections will no longer inherit permissions from the parent, though collection admins that are automatically inherited from a parent collection can't be removed.

## Assigning permissions to your users

After creating an Azure Purview instance, the first thing to do is create collections and assign users to roles within those collections.

### Creating collections

Collections can be customized for structure of the sources in your Purview instance, and can act like organized storage bins for these resources.
Large collections can flow into subcollections to manage smaller and smaller aspects of your data map. When you're thinking about the collections you might need, consider how your users will access or discover information. Are your sources broken up by departments? Are there specialized groups within those departments that will only need to discover some assets? Are there some sources that should be discoverable by all your users?

This will inform the collections and subcollections you may need to most effectively organize your data map.

New collections can be added directly to the data map, where you can choose their parent collection from a drop-down, or they can be added from the parent as a sub collection. In the data map view you can see all your sources and assets ordered by the collections, and in the list, the source's collection is listed.

For more instructions and information, you can follow our [guide for creating and managing collections](how-to-create-and-manage-collections.md).

#### A collections example

Now that we have a base understanding of collections, permissions, and how they work, let's look at an example.

:::image type="content" source="./media/catalog-permissions/collection-example.png" alt-text="Chart showing a sample collections hierarchy broken up by region and department." border="true":::

This is one way an organization might structure their data: Starting with their root collection (Contoso, in this example) collections are organized into regions, and then into departments and subdepartments. Data sources and assets can be added to any one these collections to organize data resources by these regions and department, and manage access control along those lines. There is one subdepartment, revenue, that has strict access guidelines, so permissions will need to be tightly managed.

So for our example above, the [data reader role](#roles) can access information within the catalog, but not manage or edit it. Adding the Data Reader permission to a group on the root collection and allowing inheritance will give all users in that group reader permissions on Purview sources and assets. [Restricting inheritance](how-to-create-and-manage-collections.md#restrict-inheritance) on the Revenue group will control access to those assets. Users who need access to revenue information can be added separately to the revenue collection.
Similarly with the Data Curator and Data Source Admin roles, permissions for those groups will start at the collection where they are assigned, and trickle down to subcollections that have not restricted inheritance. Below we have assigned permissions for several groups at collections levels in the Americas sub collection.

:::image type="content" source="./media/catalog-permissions/collection-permissions-example.png" alt-text="Chart showing a sample collections hierarchy broken up by region and department." border="true":::

### Adding users to roles

Role assignment is managed through the collections. Only a user with the [collection admin role](#roles) can grant permissions to other users on that collection. When new permissions need to be added, a collection admin will access the Purview Studio, navigate to management, then the collections tab, and select the collection where a user needs to be added. From the Role Assignments tab they will be able to add and manage users who need permissions.

For full instructions, see our [how-to guide for adding role assignments](how-to-create-and-manage-collections.md#add-role-assignments).

## Legacy collection guide

> [!NOTE]
> This legacy collection guide is only for Purview instances created before August 18th. Instances created after that time should follow the guide above.

This article describes how Role-Based Access Control (RBAC) is implemented in Azure Purview's [Data Plane](../azure-resource-manager/management/control-plane-and-data-plane.md#data-plane) for Purview resources created before August 18th.

> [!IMPORTANT]
> The principal who created a Purview account is automatically given all data plane permissions regardless of what data plane roles they may or may not be in. For any other user to do anything in Azure Purview they have to be in at least one of the pre-defined Data Plane roles.

### Azure Purview's pre-defined legacy Data Plane roles

Azure Purview defines a set of pre-defined Data Plane roles that can be used to control who can access what in Azure Purview. These roles are:

* **Purview Data Reader Role** - Has access to the Purview portal and can read all content in Azure Purview except for scan bindings
* **Purview Data Curator Role** - Has access to the Purview portal and can read all content in Azure Purview except for scan bindings, can edit information about assets, can edit classification definitions and glossary terms, and can apply classifications and glossary terms to assets.
* **Purview Data Source Administrator Role** - Does not have access to the Purview Portal (the user needs to also be in the Data Reader or Data Curator roles) and can manage all aspects of scanning data into Azure Purview but does not have read or write access to content in Azure Purview beyond those related to scanning.

### Understanding how to use Azure Purview's legacy Data Plane roles

When an Azure Purview Account is created, the creator will be treated as if they are in both the Purview Data Curator and Purview Data Source Administrator Roles. But the account creator is not assigned to these roles in the role store. Azure Purview recognizes that the principal is the creator of the account and extends these capabilities to them based on their identity.

All other users can only use the Azure Purview Account if they are placed in at least one of these roles. This means that when an Azure Purview Account is created, no one but the creator can access the account or use its APIs until they are put in one or more of the previous defined roles.

Please note that the Purview Data Source Administrator role has two supported scenarios. The first scenario is for users who are already Purview Data Readers or Purview Data Curators that also need to be able to create scans. Those users need to be in two roles, at least one of Purview Data Reader or Purview Data Curator as well as being placed in the Purview Data Source Administrator Role.

The other scenario for Purview Data Source Administrator is for programmatic processes, such as service principals, that need to be able to set up and monitor scans but should not have access to any of the catalog's data.

This scenario can be implemented by putting the service principal in the Purview Data Source Administrator Role without being placed in any of the other two roles. The principal won't have access to the Purview Portal but that is o.k. because it's a programmatic principal and only communicates via APIs.

### Putting users into legacy roles

So the first order of business after creating an Azure Purview account is to assign people into these roles.

The role assignment is managed via [Azure's RBAC](../role-based-access-control/overview.md).

Only two built-in control plane roles in Azure can assign users roles, those are either Owners or User Access Administrators. So to put people into these roles for Azure Purview one must either find someone who is an Owner or User Access Administrator or become one oneself.

#### An example of assigning someone to a legacy role

1. Go to https://portal.azure.com and navigate to your Azure Purview Account
1. On the left-hand side click on "Access control (IAM)"
1. Then follow the general instructions given [here](../role-based-access-control/quickstart-assign-role-user-portal.md#create-a-resource-group)

### Legacy role definitions and actions

A role is defined as a collection of actions. See [here](../role-based-access-control/role-definitions.md) for more information on how roles are defined. And see [here](../role-based-access-control/built-in-roles.md) for the Role Definitions for Azure Purview's roles.

### Getting added to a legacy Data Plane Role in an Azure Purview instance

If you want to be given access to an Azure Purview Account so you can use its studio or call its APIs you need to be added into an Azure Purview Data Plane Role. The only people who can do this are those who are Owners or User Access Administrators on the Azure Purview Account. For most users the next step is to find a local administrator who can help you find the right people who can give you access.

For users who have access to their company's [Azure portal](https://portal.azure.com) they can look up the particular Azure Purview Account they want to join, click on its "Access control (IAM)" tab and see who the Owners or User Access Administrators (UAAs) are. But note that in some cases Azure Active Directory groups or Service Principals might be used as Owners or UAAs, in which case it might not be possible to contact them directly. Instead one has to find an administrator to help.

### Legacy - who should be assigned to what role?

|User Scenario|Appropriate Role(s)|
|-------------|-----------------|
|I just need to find assets, I don't want to edit anything|Purview Data Reader Role|
|I need to edit information about assets, put classifications on them, associate them with glossary entries, etc.|Purview Data Curator Role|
|I need to edit the glossary or set up new classification definitions|Purview Data Curator Role|
|My application's Service Principal needs to push data to Azure Purview|Purview Data Curator Role|
|I need to set up scans via the Purview Studio|Purview Data Source Administrator Role plus at least one of Purview Data Reader Role or Purview Data Curator Role|
|I need to enable a Service Principal or other programmatic identity to set up and monitor scans in Azure Purview without allowing the programmatic identity to access the catalog's information |Purview Data Source Administrator Role|
|I need to put users into roles in Azure Purview | Owner or User Access Administrator |

## Next steps

Now that you have a base understanding of collections, and access control, follow the guides below to create and manage those collections, or get started with registering sources into your Purview Resource.

- [How to create and manage collections](how-to-create-and-manage-collections.md)
- [Purview supported data sources](purview-connector-overview.md)
