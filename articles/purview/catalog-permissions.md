---
title: Catalog Permissions
description: This article gives an overview of how to configure Role-Based Access Control (RBAC) in the Azure Purview
author: yarong
ms.author: yarong
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: conceptual
ms.date: 10/20/2020
---
# Role-Based Access Control in the Catalog

This article describes how Role-Based Access Control (RBAC) is implemented in Azure Purview.

## Azure Purview's pre-defined Data Plane roles

Azure Purview defines a set of pre-defined Data Plane roles that can be used to control who can access what, in
Azure Purview. These roles are:

* **Azure Purview Data Reader Role** - Can read all content in Azure Purview except for scan bindings
* **Azure Purview Data Curator Role** - Can read all content in Azure Purview except for scan bindings, can edit information about assets, can edit classification definitions and glossary terms, and can apply classifications and glossary terms to assets.
* **Azure Purview Data Source Administrator Role** - Can manage all aspects of scanning data into Azure Purview but does not have read or write access to the data.

In order to do anything in Azure Purview someone has to be in at least one of these roles. It's possible to be in multiple of these roles, this will be especially common with Data Source Administrator.

When an Azure Purview Account is created, the creator will be treated as if they are in both the Azure Purview Data Curator and Data Source Administrator Roles. But the account creator is not assigned to these roles in the role store. Azure Purview recognizes that the principal is the creator of the account and extends these capabilities to them based on their identity.

All other users can only use the Azure Purview Account if they are placed in at least one of these roles. This means that when an Azure Purview Account is created, no one but the creator can access the account or use its APIs until they are put in one or more of the previous defined roles.

So the first order of business after creating an Azure Purview account is to assign people into these roles.

The role assignment is managed via [Azure's RBAC](../role-based-access-control/overview.md).

Only two built-in roles in Azure can assign users roles, those are either Owners or User Access Administrators. So to put people into these roles for Azure Purview one must either find someone who is an Owner or User Access Administrator or become one yourself.

## An example of assigning someone to a role

1. Go to https://portal.azure.com and navigate to your Azure Purview Account
1. On the left-hand side click on "Access control (IAM)"
1. Then follow the general instructions given [here](../role-based-access-control/quickstart-assign-role-user-portal.md#create-a-resource-group)

## Role definitions and actions

A role is defined as a collection of actions. See [here](../role-based-access-control/role-definitions.md) for more information on how roles are defined. And see [here](../role-based-access-control/built-in-roles.md) for the Role Definitions for Azure Purview's roles.

## Getting added to a Data Plane Role in an Azure Purview Account

If you want to be given access to an Azure Purview Account so you can use its studio or call its APIs you need to be added into an Azure Purview Data Plane Role. The only people who can do this are those who are Owners or User Access Administrators on the Azure Purview Data Plane Role. For most users the next step is to find a local administrator who can help you find the right people who can give you access.

For users who have access to their company's [Azure portal](https://portal.azure.com) they can look up the particular Azure Purview Account they want to join, click on its "Access control (IAM)" tab and see who the Owners or User Access Administrators (UAAs) are. But note that in some cases Azure Active Directory groups or Service Principals might be used as Owners or UAAs, in which case it might not be possible to contact them directly. Instead one has to find an administrator to help.

## Who should be assigned to what role?

|User Scenario|Appropriate Role|
|-------------|-----------------|
|I just need to find assets, I don't want to edit anything|Azure Purview Data Reader Role|
|I need to edit information about assets, put classifications on them, associate them with glossary entries, etc.|Azure Purview Data Curator Role|
|I need to edit the glossary or set up new classification definitions|Azure Purview Data Curator Role|
|My application's Service Principal needs to push data to Azure Purview|Azure Purview Data Curator Role|
|I need to set up data scans managed by Azure Purview, either in the cloud or on-premises|Azure Purview Data Source Administrator Role|
|I need to put users into roles in Azure Purview | Owner or User Access Administrator |

Advance to the next article to learn how to add a security principal to a role.

## Next steps

* [Add a security principal](add-security-principal.md)
