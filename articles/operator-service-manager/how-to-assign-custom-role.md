---
title: How to assign custom role in Azure Operator Service Manager
description: Learn how to assign a custom role in Azure Operator Service Manager.
author: sherrygonz
ms.author: sherryg
ms.date: 10/19/2023
ms.topic: how-to
ms.service: azure-operator-service-manager
---

# Assign a custom role

In this how-to guide, you learn how to assign a custom role for Service Operators to Azure Operator Service Manager Publisher resources. The permissions in this role are required for deploying a Site Network Service.

## Prerequisites

- You must have created a custom role via [Create a custom role](how-to-create-custom-role.md).  This article assumes that you named the custom role 'Custom Role - AOSM Service Operator access to Publisher.'

- To perform the tasks in this article, you need either the 'Owner' or 'User Access Administrator' role in your chosen scope.

- You must have identified the users who you want to perform the Service Operator role and deploy Site Network Services.

## Choose scope(s) for assigning custom role

The publisher resources that you need to assign the custom role to are:

- The Network Function Definition Versions (NFDVs).

- The Network Service Design Versions (NSDVs).

- The Configuration Group Schemas (CGSs) for the Network Service Design (NSD).

You must decide if you want to assign the custom role individually to each resource, or to a parent resource such as the publisher resource group. 

Applying to a parent resource grants access over all child resources. For example, applying to the whole publisher resource group gives the operator access to:

- All the Network Function Definition Groups and Versions.

- All the Network Service Design Groups and Versions.

- All the Configuration Group Schemas.

The custom role permissions limit access to the list of the permissions shown here:

- Microsoft.HybridNetwork/Publishers/NetworkFunctionDefinitionGroups/NetworkFunctionDefinitionVersions/**use**/**action**

- Microsoft.HybridNetwork/Publishers/NetworkFunctionDefinitionGroups/NetworkFunctionDefinitionVersions/**read**

- Microsoft.HybridNetwork/Publishers/NetworkServiceDesignGroups/NetworkServiceDesignVersions/**use**/**action**

- Microsoft.HybridNetwork/Publishers/NetworkServiceDesignGroups/NetworkServiceDesignVersions/**read**

- Microsoft.HybridNetwork/Publishers/ConfigurationGroupSchemas/**read**

> [!NOTE]
> Do not provide write or delete access to any of these publisher resources.


## Assign the custom role

1. Access the Azure portal and open your chosen scope (Publisher Resource Group or individual resources).

2. In the side menu of this item, select **Access Control (IAM)**.

3. Choose **Add Role Assignment**.

    :::image type="content" source="media/how-to-assign-custom-role-resource-group.png" alt-text="Screenshot showing the publisher resource group access control page.":::


4. Under **Job function roles** find your Custom Role in the list then proceed with *Next*. 

    :::image type="content" source="media/how-to-assign-custom-role-add-assignment.png" alt-text="Screenshot showing the add role assignment screen.":::


5. Select **User, group, or service principal**, then Choose **+ Select Members** then find and choose the users you want to have access. Choose **Select**.

    :::image type="content" source="media/how-to-assign-custom-role-add-members.png" alt-text="Screenshot showing the select members screen.":::

7. Select **Review and assign**

## Repeat the role assignment

Repeat the tasks in this article for all your chosen scopes.
