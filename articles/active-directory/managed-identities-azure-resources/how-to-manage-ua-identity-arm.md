---
title: Create & delete a user-assigned managed identity using Azure Resource Manager
description: Step-by-step instructions on how to create and delete user-assigned managed identities using Azure Resource Manager.
services: active-directory
documentationcenter: 
author: MarkusVi
manager: daveba
editor: 

ms.service: active-directory
ms.subservice: msi
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 12/10/2019
ms.author: markvi
ms.collection: M365-identity-device-management
---

# Create, list and delete a user-assigned managed identity using Azure Resource Manager


Managed identities for Azure resources provide Azure services with a managed identity in Azure Active Directory. You can use this identity to authenticate to services that support Azure AD authentication, without needing credentials in your code. 

In this article, you create a user-assigned managed identity using an Azure Resource Manager.

It is not possible to list and delete a user-assigned managed identity using an Azure Resource Manager template.  See the following articles to create and list a user-assigned managed identity:

- [List user-assigned managed identity](how-to-manage-ua-identity-cli.md#list-user-assigned-managed-identities)
- [Delete user-assigned managed identity](how-to-manage-ua-identity-cli.md#delete-a-user-assigned-managed-identity)
  ## Prerequisites

- If you're unfamiliar with managed identities for Azure resources, check out the [overview section](overview.md). **Be sure to review the [difference between a system-assigned and user-assigned managed identity](overview.md#managed-identity-types)**.
- If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/) before continuing.

## Template creation and editing

As with the Azure portal and scripting, Azure Resource Manager templates provide the ability to deploy new or modified resources defined by an Azure resource group. Several options are available for template editing and deployment, both local and portal-based, including:

- Using a [custom template from the Azure Marketplace](../../azure-resource-manager/templates/deploy-portal.md#deploy-resources-from-custom-template), which allows you to create a template from scratch, or base it on an existing common or [quickstart template](https://azure.microsoft.com/documentation/templates/).
- Deriving from an existing resource group, by exporting a template from either [the original deployment](../../azure-resource-manager/management/manage-resource-groups-portal.md#export-resource-groups-to-templates), or from the [current state of the deployment](../../azure-resource-manager/management/manage-resource-groups-portal.md#export-resource-groups-to-templates).
- Using a local [JSON editor (such as VS Code)](../../azure-resource-manager/resource-manager-create-first-template.md), and then uploading and deploying by using PowerShell or CLI.
- Using the Visual Studio [Azure Resource Group project](../../azure-resource-manager/templates/create-visual-studio-deployment-project.md) to both create and deploy a template. 

## Create a user-assigned managed identity 

To create a user-assigned managed identity, your account needs the [Managed Identity Contributor](/azure/role-based-access-control/built-in-roles#managed-identity-contributor) role assignment.

To create a user-assigned managed identity, use the following template. Replace the `<USER ASSIGNED IDENTITY NAME>` value with your own values:

[!INCLUDE [ua-character-limit](~/includes/managed-identity-ua-character-limits.md)]

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "resourceName": {
          "type": "string",
          "metadata": {
            "description": "<USER ASSIGNED IDENTITY NAME>"
          }
        }
  },
  "resources": [
    {
      "type": "Microsoft.ManagedIdentity/userAssignedIdentities",
      "name": "[parameters('resourceName')]",
      "apiVersion": "2018-11-30",
      "location": "[resourceGroup().location]"
    }
  ],
  "outputs": {
      "identityName": {
          "type": "string",
          "value": "[parameters('resourceName')]"
      }
  }
}
```
## Next steps

For information on how to assign a user-assigned managed identity to an Azure VM using an Azure Resource Manager template see, [Configure managed identities for Azure resources on an Azure VM using a templates](qs-configure-template-windows-vm.md).


 
