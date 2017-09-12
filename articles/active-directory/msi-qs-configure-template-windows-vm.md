---
title: How to configure MSI on an Azure VM using a template
description: Step by step instructions for configuring a Managed Service Identity (MSI) on an Azure VM, using an Azure Resource Manager template.
services: active-directory
documentationcenter: ''
author: bryanla
manager: mbaldwin
editor: ''

ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/14/2017
ms.author: bryanla
---

# Configure an Azure VM Managed Service Identity (MSI) using a template

Managed Service Identity provides Azure services with an automatically managed identity in Azure Active Directory. You can use this identity to authenticate to any service that supports Azure AD authentication, without having credentials in your code. 

In this QuickStart, you will learn how to enable and remove MSI for an Azure Windows VM, using an Azure Resource Manager deployment template.

## Prerequisites

[!INCLUDE [msi-qs-configure-prereqs](../../includes/msi-qs-configure-prereqs.md)]

## Enable MSI during creation of an Azure VM, or on an existing VM

As with the Azure portal and scripting, Azure Resource Manager templates provide the ability to deploy new/modified resources defined by an Azure resource group. Several options are available for template editing and deployment, including both locally and portal/web based. A few of which include:

   - Using a [custom template from Azure marketplace](../azure-resource-manager/resource-group-template-deploy-portal.md#deploy-resources-from-custom-template), which allows you to create a template from scratch, or base it on an existing common or [QuickStart template](https://azure.microsoft.com/documentation/templates/).
   - Deriving from an existing resource group, by exporting a template from either [the original deployment](../azure-resource-manager/resource-manager-export-template.md#view-template-from-deployment-history), or from the [current state of the deployment](../azure-resource-manager/resource-manager-export-template.md#export-the-template-from-resource-group).
   - Using a local [JSON editor (such as VS Code)](../azure-resource-manager/resource-manager-create-first-template.md), then upload/deploy using PowerShell or CLI.
   - Using Visual Studio's [Azure Resource Group project](../azure-resource-manager/vs-azure-tools-resource-groups-deployment-projects-create-deploy.md) to both create and deploy template.  

Regardless of the path you take, template syntax is the same during initial deployment and redeployment, so enabling MSI on a new or existing VM is done in the same manner. Also, by default Azure Resource Manager does an [incremental update](../azure-resource-manager/resource-group-template-deploy.md#incremental-and-complete-deployments) to deployments:

1. After loading the template into an editor, locate the `Microsoft.Compute/virtualMachines` resource of interest within the `resources` section. Yours may look slightly different from this screen shot, depending on the editor you're using and whether you are editing a template for a new deployment or existing one:

   >[!NOTE] 
   > Step 2 also assumes the variables `vmName`, `storageAccountName`, and `nicName` are defined in your template.
   >

   ![Template before screen shot - locate VM](./media/msi-qs-configure-template-windows-vm/template-file-before.png) 

2. Add the `"identity"` property at the same level as the `"type": "Microsoft.Compute/virtualMachines"` property using the following syntax:

   ```JSON
   "identity": { 
       "type": "systemAssigned"
   },
   ```

3. Then add the VM MSI extension as a `resources` element using the following syntax:

   >[!NOTE] 
   > The following example assumes a Windows VM extension (`ManagedIdentityExtensionForWindows`) in being deployed. You may also configure for Linux using `ManagedIdentityExtensionForLinux` instead.
   >

   ```JSON
   { 
       "type": "Microsoft.Compute/virtualMachines/extensions",
       "name": "[concat(variables('vmName'),'/ManagedIdentityExtensionForWindows')]",
       "apiVersion": "2016-03-30",
       "location": "[resourceGroup().location]",
       "dependsOn": [
           "[concat('Microsoft.Compute/virtualMachines/', variables('vmName'))]"
       ],
       "properties": {
           "publisher": "Microsoft.ManagedIdentity",
           "type": "ManagedIdentityExtensionForWindows",
           "typeHandlerVersion": "1.0",
           "autoUpgradeMinorVersion": true,
           "settings": {
               "port": 50342
           },
           "protectedSettings": {}
       }
   }
   ```

4. When you're done, your template should look similar to the following example:

   ![Template after shot](./media/msi-qs-configure-template-windows-vm/template-file-after.png) 

## Remove MSI from an Azure VM

If you have a Virtual Machine that no longer needs an MSI, just remove the two elements added in the previous example: the VM's `"identity"` property and the `"Microsoft.Compute/virtualMachines/extensions"` resource.

## Related content

- [Managed Service Identity overview](msi-overview.md)

Use the following comments section to provide feedback and help us refine and shape our content.

