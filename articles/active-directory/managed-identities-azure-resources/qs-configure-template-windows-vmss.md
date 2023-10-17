---
title: Configure template to use managed identities on virtual machine scale sets
description: Step-by-step instructions for configuring managed identities for Azure resources on a virtual machine scale set, using an Azure Resource Manager template.
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

# Configure managed identities for Azure resources on an Azure virtual machine scale using a template

[!INCLUDE [preview-notice](../../../includes/active-directory-msi-preview-notice.md)]

Managed identities for Azure resources provide Azure services with an automatically managed identity in Microsoft Entra ID. You can use this identity to authenticate to any service that supports Microsoft Entra authentication, without having credentials in your code.

In this article, you learn how to perform the following managed identities for Azure resources operations on an Azure virtual machine scale set, using Azure Resource Manager deployment template:

- Enable and disable the system-assigned managed identity on an Azure virtual machine scale set
- Add and remove a user-assigned managed identity on an Azure virtual machine scale set

## Prerequisites

- If you're unfamiliar with managed identities for Azure resources, check out the [overview section](overview.md). **Be sure to review the [difference between a system-assigned and user-assigned managed identity](overview.md#managed-identity-types)**.
- If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/) before continuing.
- To perform the management operations in this article, your account needs the following Azure role-based access control assignments:

    > [!NOTE]
    > No additional Microsoft Entra directory role assignments required.

    - [Virtual Machine Contributor](/azure/role-based-access-control/built-in-roles#virtual-machine-contributor) to create a virtual machine scale set and enable and remove system and/or user-assigned managed identity from a virtual machine scale set.
    - [Managed Identity Contributor](/azure/role-based-access-control/built-in-roles#managed-identity-contributor) role to create a user-assigned managed identity.
    - [Managed Identity Operator](/azure/role-based-access-control/built-in-roles#managed-identity-operator) role to assign and remove a user-assigned managed identity from and to a virtual machine scale set.

## Azure Resource Manager templates

As with the Azure portal and scripting, [Azure Resource Manager](/azure/azure-resource-manager/management/overview) templates provide the ability to deploy new or modified resources defined by an Azure resource group. Several options are available for template editing and deployment, both local and portal-based, including:

   - Using a [custom template from the Azure Marketplace](/azure/azure-resource-manager/templates/deploy-portal#deploy-resources-from-custom-template), which allows you to create a template from scratch, or base it on an existing common or [quickstart template](https://azure.microsoft.com/resources/templates/).
   - Deriving from an existing resource group, by exporting a template from either [the original deployment](/azure/azure-resource-manager/templates/export-template-portal), or from the [current state of the deployment](/azure/azure-resource-manager/templates/export-template-portal).
   - Using a local [JSON editor (such as VS Code)](/azure/azure-resource-manager/templates/quickstart-create-templates-use-the-portal), and then uploading and deploying by using PowerShell or CLI.
   - Using the Visual Studio [Azure Resource Group project](/azure/azure-resource-manager/templates/create-visual-studio-deployment-project) to both create and deploy a template.  

Regardless of the option you choose, template syntax is the same during initial deployment and redeployment. Enabling managed identities for Azure resources on a new or existing VM is done in the same manner. Also, by default, Azure Resource Manager does an [incremental update](/azure/azure-resource-manager/templates/deployment-modes) to deployments.

## System-assigned managed identity

In this section, you will enable and disable the system-assigned managed identity using an Azure Resource Manager template.

### Enable system-assigned managed identity during the creation of a virtual machines scale set or an existing virtual machine scale set

1. Whether you sign in to Azure locally or via the Azure portal, use an account that is associated with the Azure subscription that contains the virtual machine scale set.
2. To enable the system-assigned managed identity, load the template into an editor, locate the `Microsoft.Compute/virtualMachinesScaleSets` resource of interest within the resources section and add the `identity` property at the same level as the `"type": "Microsoft.Compute/virtualMachinesScaleSets"` property. Use the following syntax:

   ```JSON
   "identity": {
       "type": "SystemAssigned"
   }
   ```

4. When you're done, the following sections should added to the resource section of your template  and should resemble the example shown below:

   ```json
    "resources": [
        {
            //other resource provider properties...
            "apiVersion": "2018-06-01",
            "type": "Microsoft.Compute/virtualMachineScaleSets",
            "name": "[variables('vmssName')]",
            "location": "[resourceGroup().location]",
            "identity": {
                "type": "SystemAssigned",
            },
           "properties": {
                //other resource provider properties...
                "virtualMachineProfile": {
                    //other virtual machine profile properties...
        
                }
            }
        }
    ]
   ```

### Disable a system-assigned managed identity from an Azure virtual machine scale set

If you have a virtual machine scale set that no longer needs a system-assigned managed identity:

1. Whether you sign in to Azure locally or via the Azure portal, use an account that is associated with the Azure subscription that contains the virtual machine scale set.

2. Load the template into an [editor](#azure-resource-manager-templates) and locate the `Microsoft.Compute/virtualMachineScaleSets` resource of interest within the `resources` section. If you have a VM that only has system-assigned managed identity, you can disable it by changing the identity type to `None`.

   **Microsoft.Compute/virtualMachineScaleSets API version 2018-06-01**

   If your apiVersion is `2018-06-01` and your VM has both system and user-assigned managed identities, remove `SystemAssigned` from the identity type and keep `UserAssigned` along with the userAssignedIdentities dictionary values.

   **Microsoft.Compute/virtualMachineScaleSets API version 2018-06-01**

   If your apiVersion is `2017-12-01` and your virtual machine scale set has both system and user-assigned managed identities, remove `SystemAssigned` from the identity type and keep `UserAssigned` along with the `identityIds` array of the user-assigned managed identities.



   The following example shows you how to remove a system-assigned managed identity from a virtual machine scale set with no user-assigned managed identities:

   ```json
   {
       "name": "[variables('vmssName')]",
       "apiVersion": "2018-06-01",
       "location": "[parameters(Location')]",
       "identity": {
           "type": "None"
        }

   }
   ```

## User-assigned managed identity

In this section, you assign a user-assigned managed identity to a virtual machine scale set using Azure Resource Manager template.

> [!Note]
> To create a user-assigned managed identity using an Azure Resource Manager Template, see [Create a user-assigned managed identity](./how-manage-user-assigned-managed-identities.md?pivots=identity-mi-methods-arm#create-a-user-assigned-managed-identity).

### Assign a user-assigned managed identity to a virtual machine scale set

1. Under the `resources` element, add the following entry to assign a user-assigned managed identity to your virtual machine scale set.  Be sure to replace `<USERASSIGNEDIDENTITY>` with the name of the user-assigned managed identity you created.

   **Microsoft.Compute/virtualMachineScaleSets API version 2018-06-01**

   If your apiVersion is `2018-06-01`, your user-assigned managed identities are stored in the `userAssignedIdentities` dictionary format and the `<USERASSIGNEDIDENTITYNAME>` value must be stored in a variable defined in the `variables` section of your template.

   ```json
   {
       "name": "[variables('vmssName')]",
       "apiVersion": "2018-06-01",
       "location": "[parameters(Location')]",
       "identity": {
           "type": "userAssigned",
           "userAssignedIdentities": {
               "[resourceID('Microsoft.ManagedIdentity/userAssignedIdentities/',variables('<USERASSIGNEDIDENTITYNAME>'))]": {}
           }
       }

   }
   ```

   **Microsoft.Compute/virtualMachineScaleSets API version 2017-12-01**

   If your `apiVersion` is `2017-12-01` or earlier, your user-assigned managed identities are stored in the `identityIds` array and the `<USERASSIGNEDIDENTITYNAME>` value must be stored in a variable defined in the variables section of your template.

   ```json
   {
       "name": "[variables('vmssName')]",
       "apiVersion": "2017-03-30",
       "location": "[parameters(Location')]",
       "identity": {
           "type": "userAssigned",
           "identityIds": [
               "[resourceID('Microsoft.ManagedIdentity/userAssignedIdentities/',variables('<USERASSIGNEDIDENTITY>'))]"
           ]
       }
   }
   ```

3. When you are done, your template should look similar to the following:

   **Microsoft.Compute/virtualMachineScaleSets API version 2018-06-01**

   ```json
   "resources": [
        {
            //other resource provider properties...
            "apiVersion": "2018-06-01",
            "type": "Microsoft.Compute/virtualMachineScaleSets",
            "name": "[variables('vmssName')]",
            "location": "[resourceGroup().location]",
            "identity": {
                "type": "UserAssigned",
                "userAssignedIdentities": {
                    "[resourceID('Microsoft.ManagedIdentity/userAssignedIdentities/',variables('<USERASSIGNEDIDENTITYNAME>'))]": {}
                }
            },
           "properties": {
                //other virtual machine properties...
                "virtualMachineProfile": {
                    //other virtual machine profile properties...
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
            "type": "Microsoft.Compute/virtualMachineScaleSets",
            "name": "[variables('vmssName')]",
            "location": "[resourceGroup().location]",
            "identity": {
                "type": "UserAssigned",
                "identityIds": [
                    "[resourceID('Microsoft.ManagedIdentity/userAssignedIdentities/',variables('<USERASSIGNEDIDENTITYNAME>'))]"
                ]
            },
           "properties": {
                //other virtual machine properties...
                "virtualMachineProfile": {
                    //other virtual machine profile properties...
                }
            }
        }
    ]
   ```

### Remove user-assigned managed identity from an Azure virtual machine scale set

If you have a virtual machine scale set that no longer needs a user-assigned managed identity:

1. Whether you sign in to Azure locally or via the Azure portal, use an account that is associated with the Azure subscription that contains the virtual machine scale set.

2. Load the template into an [editor](#azure-resource-manager-templates) and locate the `Microsoft.Compute/virtualMachineScaleSets` resource of interest within the `resources` section. If you have a virtual machine scale set that only has user-assigned managed identity, you can disable it by changing the identity type to `None`.

   The following example shows you how to remove all user-assigned managed identities from a VM with no system-assigned managed identities:

   ```json
   {
       "name": "[variables('vmssName')]",
       "apiVersion": "2018-06-01",
       "location": "[parameters(Location')]",
       "identity": {
           "type": "None"
        }
   }
   ```

   **Microsoft.Compute/virtualMachineScaleSets API version 2018-06-01**

   To remove a single user-assigned managed identity from a virtual machine scale set, remove it from the `userAssignedIdentities` dictionary.

   If you have a system-assigned identity, keep it in the `type` value under the `identity` value.

   **Microsoft.Compute/virtualMachineScaleSets API version 2017-12-01**

   To remove a single user-assigned managed identity from a virtual machine scale set, remove it from the `identityIds` array.

   If you have a system-assigned managed identity, keep it in the `type` value under the `identity` value.

## Next steps

- [Managed identities for Azure resources overview](overview.md).
