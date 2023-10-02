---
title: Configure managed identities on Azure VM using template
description: Step-by-step instructions for configuring managed identities for Azure resources on an Azure VM, using an Azure Resource Manager template.
services: active-directory
documentationcenter: ''
author: barclayn
manager: amycolannino
editor: ''
ms.service: active-directory
ms.subservice: msi
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 01/11/2022
ms.author: barclayn
ms.collection: M365-identity-device-management
ms.custom: mode-other, devx-track-arm-template
---

# Configure managed identities for Azure resources on an Azure VM using templates

[!INCLUDE [preview-notice](../../../includes/active-directory-msi-preview-notice.md)]

Managed identities for Azure resources provide Azure services with an automatically managed identity in Microsoft Entra ID. You can use this identity to authenticate to any service that supports Microsoft Entra authentication, without having credentials in your code.

In this article, using the Azure Resource Manager deployment template, you learn how to perform the following managed identities for Azure resources operations on an Azure VM:

## Prerequisites

- If you're unfamiliar with using Azure Resource Manager deployment template, check out the [overview section](overview.md). **Be sure to review the [difference between a system-assigned and user-assigned managed identity](overview.md#managed-identity-types)**.
- If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/) before continuing.

## Azure Resource Manager templates

As with the Azure portal and scripting, [Azure Resource Manager](../../azure-resource-manager/management/overview.md) templates allow you to deploy new or modified resources defined by an Azure resource group. Several options are available for template editing and deployment, both local and portal-based, including:

   - Using a [custom template from the Azure Marketplace](../../azure-resource-manager/templates/deploy-portal.md#deploy-resources-from-custom-template), which allows you to create a template from scratch, or base it on an existing common or [quickstart template](https://azure.microsoft.com/resources/templates/).
   - Deriving from an existing resource group, by exporting a template from either [the original deployment](../../azure-resource-manager/templates/export-template-portal.md), or from the [current state of the deployment](../../azure-resource-manager/templates/export-template-portal.md).
   - Using a local [JSON editor (such as VS Code)](../../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md), and then uploading and deploying by using PowerShell or CLI.
   - Using the Visual Studio [Azure Resource Group project](../../azure-resource-manager/templates/create-visual-studio-deployment-project.md) to both create and deploy a template.

Regardless of the option you choose, template syntax is the same during initial deployment and redeployment. Enabling a system or user-assigned managed identity on a new or existing VM is done in the same manner. Also, by default, Azure Resource Manager does an [incremental update](../../azure-resource-manager/templates/deployment-modes.md) to deployments.

## System-assigned managed identity

In this section, you will enable and disable a system-assigned managed identity using an Azure Resource Manager template.

### Enable system-assigned managed identity during creation of an Azure VM or on an existing VM

To enable system-assigned managed identity on a VM, your account needs the [Virtual Machine Contributor](../../role-based-access-control/built-in-roles.md#virtual-machine-contributor) role assignment.  No other Microsoft Entra directory role assignments are required.

1. Whether you sign in to Azure locally or via the Azure portal, use an account that is associated with the Azure subscription that contains the VM.

2. To enable system-assigned managed identity, load the template into an editor, locate the `Microsoft.Compute/virtualMachines` resource of interest within the `resources` section and add the `"identity"` property at the same level as the `"type": "Microsoft.Compute/virtualMachines"` property. Use the following syntax:

   ```json
   "identity": {
       "type": "SystemAssigned"
   },
   ```

3. When you're done, the following sections should be added to the `resource` section of your template and it should resemble the following:

   ```json
    "resources": [
        {
            //other resource provider properties...
            "apiVersion": "2018-06-01",
            "type": "Microsoft.Compute/virtualMachines",
            "name": "[variables('vmName')]",
            "location": "[resourceGroup().location]",
            "identity": {
                "type": "SystemAssigned",
                }                        
        }
    ]
   ```

### Assign a role the VM's system-assigned managed identity

After you enable a system-assigned managed identity on your VM, you may want to grant it a role such as **Reader** access to the resource group in which it was created. You can find detailed information to help you with this step in the [Assign Azure roles using Azure Resource Manager templates](../../role-based-access-control/role-assignments-template.md) article.


### Disable a system-assigned managed identity from an Azure VM

To remove system-assigned managed identity from a VM, your account needs the [Virtual Machine Contributor](../../role-based-access-control/built-in-roles.md#virtual-machine-contributor) role assignment.  No other Microsoft Entra directory role assignments are required.

1. Whether you sign in to Azure locally or via the Azure portal, use an account that is associated with the Azure subscription that contains the VM.

2. Load the template into an [editor](#azure-resource-manager-templates) and locate the `Microsoft.Compute/virtualMachines` resource of interest within the `resources` section. If you have a VM that only has system-assigned managed identity, you can disable it by changing the identity type to `None`.

   **Microsoft.Compute/virtualMachines API version 2018-06-01**

   If your VM has both system and user-assigned managed identities, remove `SystemAssigned` from the identity type and keep `UserAssigned` along with the `userAssignedIdentities` dictionary values.

   **Microsoft.Compute/virtualMachines API version 2018-06-01**

   If your `apiVersion` is `2017-12-01` and your VM has both system and user-assigned managed identities, remove `SystemAssigned` from the identity type and keep `UserAssigned` along with the `identityIds` array of the user-assigned managed identities.

The following example shows you how to remove a system-assigned managed identity from a VM with no user-assigned managed identities:

```json
{
    "apiVersion": "2018-06-01",
    "type": "Microsoft.Compute/virtualMachines",
    "name": "[parameters('vmName')]",
    "location": "[resourceGroup().location]",
    "identity": {
        "type": "None"
    }
}
```

## User-assigned managed identity

In this section, you assign a user-assigned managed identity to an Azure VM using Azure Resource Manager template.

> [!NOTE]
> To create a user-assigned managed identity using an Azure Resource Manager Template, see [Create a user-assigned managed identity](how-to-manage-ua-identity-arm.md#create-a-user-assigned-managed-identity).

### Assign a user-assigned managed identity to an Azure VM

To assign a user-assigned identity to a VM, your account needs the [Managed Identity Operator](../../role-based-access-control/built-in-roles.md#managed-identity-operator) role assignment. No other Microsoft Entra directory role assignments are required.

1. Under the `resources` element, add the following entry to assign a user-assigned managed identity to your VM.  Be sure to replace `<USERASSIGNEDIDENTITY>` with the name of the user-assigned managed identity you created.

   **Microsoft.Compute/virtualMachines API version 2018-06-01**

   If your `apiVersion` is `2018-06-01`, your user-assigned managed identities are stored in the `userAssignedIdentities` dictionary format and the `<USERASSIGNEDIDENTITYNAME>` value must be stored in a variable defined in the `variables` section of your template.

   ```json
    {
        "apiVersion": "2018-06-01",
        "type": "Microsoft.Compute/virtualMachines",
        "name": "[variables('vmName')]",
        "location": "[resourceGroup().location]",
        "identity": {
            "type": "userAssigned",
            "userAssignedIdentities": {
                "[resourceID('Microsoft.ManagedIdentity/userAssignedIdentities/',variables('<USERASSIGNEDIDENTITYNAME>'))]": {}
            }
        }
    }
   ```

   **Microsoft.Compute/virtualMachines API version 2017-12-01**

   If your `apiVersion` is `2017-12-01`, your user-assigned managed identities are stored in the `identityIds` array and the `<USERASSIGNEDIDENTITYNAME>` value must be stored in a variable defined in the `variables` section of your template.

   ```json
   {
       "apiVersion": "2017-12-01",
       "type": "Microsoft.Compute/virtualMachines",
       "name": "[variables('vmName')]",
       "location": "[resourceGroup().location]",
       "identity": {
           "type": "userAssigned",
           "identityIds": [
               "[resourceID('Microsoft.ManagedIdentity/userAssignedIdentities/',variables('<USERASSIGNEDIDENTITYNAME>'))]"
           ]
       }
   }
   ```

3. When you're done, the following sections should be added to the `resource` section of your template and it should resemble the following:

   **Microsoft.Compute/virtualMachines API version 2018-06-01**

   ```json
     "resources": [
        {
            //other resource provider properties...
            "apiVersion": "2018-06-01",
            "type": "Microsoft.Compute/virtualMachines",
            "name": "[variables('vmName')]",
            "location": "[resourceGroup().location]",
            "identity": {
                "type": "userAssigned",
                "userAssignedIdentities": {
                   "[resourceID('Microsoft.ManagedIdentity/userAssignedIdentities/',variables('<USERASSIGNEDIDENTITYNAME>'))]": {}
                }
            }
        }
    ] 
   ```

   **Microsoft.Compute/virtualMachines API version 2017-12-01**

   ```json
   "resources": [
        {
            //other resource provider properties...
            "apiVersion": "2017-12-01",
            "type": "Microsoft.Compute/virtualMachines",
            "name": "[variables('vmName')]",
            "location": "[resourceGroup().location]",
            "identity": {
                "type": "userAssigned",
                "identityIds": [
                   "[resourceID('Microsoft.ManagedIdentity/userAssignedIdentities/',variables('<USERASSIGNEDIDENTITYNAME>'))]"
                ]
            }
        }
   ]
   ```

### Remove a user-assigned managed identity from an Azure VM

To remove a user-assigned identity from a VM, your account needs the [Virtual Machine Contributor](../../role-based-access-control/built-in-roles.md#virtual-machine-contributor) role assignment. No other Microsoft Entra directory role assignments are required.

1. Whether you sign in to Azure locally or via the Azure portal, use an account that is associated with the Azure subscription that contains the VM.

2. Load the template into an [editor](#azure-resource-manager-templates) and locate the `Microsoft.Compute/virtualMachines` resource of interest within the `resources` section. If you have a VM that only has user-assigned managed identity, you can disable it by changing the identity type to `None`.

   The following example shows you how to remove all user-assigned managed identities from a VM with no system-assigned managed identities:

   ```json
    {
      "apiVersion": "2018-06-01",
      "type": "Microsoft.Compute/virtualMachines",
      "name": "[parameters('vmName')]",
      "location": "[resourceGroup().location]",
      "identity": {
          "type": "None"
          },
    }
   ```

   **Microsoft.Compute/virtualMachines API version 2018-06-01**

   To remove a single user-assigned managed identity from a VM, remove it from the `useraAssignedIdentities` dictionary.

   If you have a system-assigned managed identity, keep it in the `type` value under the `identity` value.

   **Microsoft.Compute/virtualMachines API version 2017-12-01**

   To remove a single user-assigned managed identity from a VM, remove it from the `identityIds` array.

   If you have a system-assigned managed identity, keep it in the `type` value under the `identity` value.

## Next steps

- [Managed identities for Azure resources overview](overview.md).
