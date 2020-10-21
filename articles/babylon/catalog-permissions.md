---
title: Catalog Permissions
description: This article gives an overview of how to configure Role Based Access Control (RBAC) in the Catalog
author: yarong
ms.author: yarong
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: conceptual
ms.date: 10/20/2020
---
# Role Based Access Control in the Catalog

Babylon defines a set of pre-defined roles that can be used to control who can access what, in Babylon. These roles are:

* **Project Babylon Data Reader Role** - Can read all content in Babylon except for scan bindings
* **Project Babylon Data Contributor Role** - Can read all content in Babylon except for scan bindings and can edit information about assets
* **Project Babylon Data Curator Role** - Can do everything a contributor can do and can apply classifications and glossary terms to assets
* **Project Babylon Data Source Administrator Role** - Can manage all aspects of scanning data into Babylon

In order to do anything in Babylon someone has to be in at least one of these roles. Note that it's perfectly possible to be in multiple of these roles, this will be especially common with Data Source Administrator.

When a new instance of Babylon is created no one will be in any of these roles, not even the person who created the Babylon account. So the first order of business after creating a Babylon account is to assign people into these roles.

The role assignment is managed via [Azure's RBAC](../role-based-access-control/overview.md).

Please note that only two built in roles in Azure can assign users roles, those are either Owners or User Access Administrators. Please make sure to have someone who is in one of those roles in Azure on the Babylon Account assign users to roles.

## An example of assigning someone to a role

1. Go to https://portal.azure.com and navigate to your Babylon Account
1. On the left hand side click on "Access control (IAM)"
1. Then follow the general instructions given [here](../role-based-access-control/quickstart-assign-role-user-portal.md#create-a-resource-group)

## Role Definitions and Actions

A role is defined as a collection of actions. See [here](../role-based-access-control/role-definitions.md) for more information on how roles are defined. And see [here](../role-based-access-control/built-in-roles.md) for the Role Definitions for Babylon's roles.

## Who should be assigned to what role?

Below we walk through some common user scenarios and what role that user needs to be in to achieve their goals.

"I just need to find assets" - This can be handled by the Project Babylon Data Reader Role.

"I help to maintain data 