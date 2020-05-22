---
title: Roles and permissions for Azure Data Factory 
description: Describes the roles and permissions required to create Data Factories and to work with child resources.
ms.date: 11/5/2018
ms.topic: conceptual
ms.service: data-factory
services: data-factory
documentationcenter: ''
ms.workload: data-services
author: djpmsft
ms.author: daperlov
manager: anandsub
---

# Roles and permissions for Azure Data Factory

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]


This article describes the roles required to create and manage Azure Data Factory resources, and the permissions granted by those roles.

## Roles and requirements

To create Data Factory instances, the user account that you use to sign in to Azure must be a member of the *contributor* or *owner* role, or an *administrator* of the Azure subscription. To view the permissions that you have in the subscription, in the Azure portal, select your username in the upper-right corner, and then select **Permissions**. If you have access to multiple subscriptions, select the appropriate subscription. 

To create and manage child resources for Data Factory - including datasets, linked services, pipelines, triggers, and integration runtimes - the following requirements are applicable:
- To create and manage child resources in the Azure portal, you must belong to the **Data Factory Contributor** role at the resource group level or above.
- To create and manage child resources with PowerShell or the SDK, the **contributor** role at the resource level or above is sufficient.

For sample instructions about how to add a user to a role, see the [Add roles](../cost-management-billing/manage/add-change-subscription-administrator.md) article.

## Set up permissions

After you create a Data Factory, you may want to let other users work with the data factory. To give this access to other users, you have to add them to the built-in **Data Factory Contributor** role on the resource group that contains the data factory.

### Scope of the Data Factory Contributor role

Membership in the **Data Factory Contributor** role lets users do the following things:
- Create, edit, and delete data factories and child resources including datasets, linked services, pipelines, triggers, and integration runtimes.
- Deploy Resource Manager templates. Resource Manager deployment is the deployment method used by Data Factory in the Azure portal.
- Manage App Insights alerts for a data factory.
- Create support tickets.

For more info about this role, see [Data Factory Contributor role](../role-based-access-control/built-in-roles.md#data-factory-contributor).

### Resource Manager template deployment

The **Data Factory Contributor** role, at the resource group level or above, lets users deploy Resource Manager templates. As a result, members of the role can use Resource Manager templates to deploy both data factories and their child resources, including datasets, linked services, pipelines, triggers, and integration runtimes. Membership in this role does not let the user create other resources, however.

Permissions on Azure Repos and GitHub are independent of Data Factory permissions. As a result, a user with repo permissions who is only a member of the Reader role can edit Data Factory child resources and commit changes to the repo, but can't publish these changes.

> [!IMPORTANT]
> Resource Manager template deployment with the **Data Factory Contributor** role does not elevate your permissions. For example, if you deploy a template that creates an Azure virtual machine, and you don't have permission to create virtual machines, the deployment fails with an authorization error.

### Custom scenarios and custom roles

Sometimes you may need to grant different access levels for different data factory users. For example:
- You may need a group where users only have permissions on a specific data factory.
- Or you may need a group where users can only monitor a data factory (or factories) but can't modify it.

You can achieve these custom scenarios by creating custom roles and assigning users to those roles. For more info about custom roles, see [Custom roles in Azure](..//role-based-access-control/custom-roles.md).

Here are a few examples that demonstrate what you can achieve with custom roles:

- Let a user create, edit, or delete any data factory in a resource group from the Azure portal.

  Assign the built-in **Data Factory contributor** role at the resource group level for the user. If you want to allow  access to any data factory in a subscription, assign the role at the subscription level.

- Let a user view (read) and monitor a data factory, but not edit or change it.

  Assign the built-in **reader** role on the data factory resource for the user.

- Let a user edit a single data factory in the Azure portal.

  This scenario requires two role assignments.

  1. Assign the built-in **contributor** role at the data factory level.
  2. Create a custom role with the permission  **Microsoft.Resources/deployments/**. Assign this custom role to the user at resource group level.

- Let a user only be able to test connection in a linked service

    Create a custom role with permissions for the following actions: **Microsoft.DataFactory/factories/getFeatureValue/read** and **Microsoft.DataFactory/factories/getDataPlaneAccess/read**. Assign this custom role on the data factory resource for the user.

- Let a user update a data factory from PowerShell or the SDK, but not in the Azure portal.

  Assign the built-in **contributor** role on the data factory resource for the user. This role lets the user see the resources in the Azure portal, but the user can't access the  **Publish** and **Publish All** buttons.

## Next steps

- Learn more about roles in Azure - [Understand role definitions](../role-based-access-control/role-definitions.md)

- Learn more about the **Data Factory contributor** role - [Data Factory Contributor role](../role-based-access-control/built-in-roles.md#data-factory-contributor).
