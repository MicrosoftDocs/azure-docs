---
title: Automate adding a lab user in Azure DevTest Labs | Microsoft Docs
description: This article shows you how to automate adding a user to a lab in Azure DevTest Labs using Azure Resource Manager templates, PowerShell, and CLI. 
services: devtest-lab,lab-services
documentationcenter: na
author: spelluru
manager: femila

ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/23/2020
ms.author: spelluru

---

# Automate adding a lab user to a lab in Azure DevTest Labs
Azure DevTest Labs allows you to quickly create self-service dev-test environments by using the Azure portal. However, if you have several teams and several DevTest Labs instances, automating the creation process can save time. [Azure Resource Manager templates](https://github.com/Azure/azure-devtestlab/tree/master/Environments) allow you to create labs, lab VMs, custom images, formulas, and add users in an automated fashion. This article specifically focuses on adding users to a DevTest Labs instance.

To add a user to a lab, you add the user to the **DevTest Labs User** role for the lab. This article shows you how to automate adding a user to a lab using one of the following ways:

- Azure Resource Manager templates
- Azure PowerShell cmdlets 
- Azure CLI.

## Use Azure Resource Manager templates
The following sample Resource Manager template specifies a user to be added to the **DevTest Labs User** role of a lab. 

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "principalId": {
      "type": "string",
      "metadata": {
        "description": "The objectId of the user, group, or service principal for the role."
      }
    },
    "labName": {
      "type": "string",
      "metadata": {
        "description": "The name of the lab instance to be created."
      }
    },
    "roleAssignmentGuid": {
      "type": "string",
      "metadata": {
        "description": "Guid to use as the name for the role assignment."
      }
    }
  },
  "variables": {
    "devTestLabUserRoleId": "[concat('/subscriptions/', subscription().subscriptionId, '/providers/Microsoft.Authorization/roleDefinitions/111111111-0000-0000-11111111111111111')]",
    "fullDevTestLabUserRoleName": "[concat(parameters('labName'), '/Microsoft.Authorization/', parameters('roleAssignmentGuid'))]",
    "roleScope": "[concat('/subscriptions/', subscription().subscriptionId, '/resourceGroups/', resourceGroup().name, '/providers/Microsoft.DevTestLab/labs/', parameters('labName'))]"
  },
  "resources": [
    {
      "apiVersion": "2016-05-15",
      "type": "Microsoft.DevTestLab/labs",
      "name": "[parameters('labName')]",
      "location": "[resourceGroup().location]"
    },
    {
      "apiVersion": "2016-07-01",
      "type": "Microsoft.DevTestLab/labs/providers/roleAssignments",
      "name": "[variables('fullDevTestLabUserRoleName')]",
      "properties": {
        "roleDefinitionId": "[variables('devTestLabUserRoleId')]",
        "principalId": "[parameters('principalId')]",
        "scope": "[variables('roleScope')]"
      },
      "dependsOn": [
        "[resourceId('Microsoft.DevTestLab/labs', parameters('labName'))]"
      ]
    }
  ]
}

```

If you're assigning the role in the same template that is creating the lab, remember to add a dependency between the role assignment resource and the lab. For more information, see [Defining dependencies in Azure Resource Manager Templates](../azure-resource-manager/templates/define-resource-dependency.md) article.

### Role Assignment Resource Information
The role assignment resource needs to specify the type and name.

The first thing to note is that the type for the resource isn't `Microsoft.Authorization/roleAssignments` as it would be for a resource group.  Instead, the resource type follows the pattern `{provider-namespace}/{resource-type}/providers/roleAssignments`. In this case, the resource type will be `Microsoft.DevTestLab/labs/providers/roleAssignments`.

The role assignment name itself needs to be globally unique.  The name of the assignment uses the pattern `{labName}/Microsoft.Authorization/{newGuid}`. The `newGuid` is a parameter value for the template. It ensures that the role assignment name is unique. As there are no template functions for creating GUIDs, you need to generate a GUID yourself by using any GUID generator tool.  

In the template, the name for the role assignment is defined by the `fullDevTestLabUserRoleName` variable. The exact line from the template is:

```json
"fullDevTestLabUserRoleName": "[concat(parameters('labName'), '/Microsoft.Authorization/', parameters('roleAssignmentGuid'))]"
```


### Role Assignment Resource Properties
A role assignment itself defines three properties. It needs the `roleDefinitionId`, `principalId`, and `scope`.

### Role Definition
The role definition ID is the string identifier for the existing role definition. The role ID is in the form `/subscriptions/{subscription-id}/providers/Microsoft.Authorization/roleDefinitions/{role-definition-id}`. 

The subscription ID is obtained by using `subscription().subscriptionId` template function.  

You need to get the role definition for the `DevTest Labs User` built-in role. To get the GUID for the [DevTest Labs User](../role-based-access-control/built-in-roles.md#devtest-labs-user) role, you can use the [Role Assignments REST API](/rest/api/authorization/roleassignments) or the [Get-AzRoleDefinition](/powershell/module/az.resources/get-azroledefinition?view=azps-1.8.0) cmdlet.

```powershell
$dtlUserRoleDefId = (Get-AzRoleDefinition -Name "DevTest Labs User").Id
```

The role ID is defined in the variables section and named `devTestLabUserRoleId`. In the template, the role ID is set to: 111111111-0000-0000-11111111111111111. 

```json
"devTestLabUserRoleId": "[concat('/subscriptions/', subscription().subscriptionId, '/providers/Microsoft.Authorization/roleDefinitions/111111111-0000-0000-11111111111111111')]",
```

### Principal ID
Principal ID is the object ID of the Active Directory user, group, or service principal that you want to add as a lab user to the lab. The template uses the `ObjectId` as a parameter.

You can get the ObjectId by using the [Get-AzureRMADUser](/powershell/module/azurerm.resources/get-azurermaduser?view=azurermps-6.13.0), [Get-AzureRMADGroup, or [Get-AzureRMADServicePrincipal](/powershell/module/azurerm.resources/get-azurermadserviceprincipal?view=azurermps-6.13.0) PowerShell cmdlets. These cmdlets return a single or lists of Active Directory objects that have an ID property, which is the object ID that you need. The following example shows you how to get the object ID of a single user at a company.

```powershell
$userObjectId = (Get-AzureRmADUser -UserPrincipalName ‘email@company.com').Id
```

You can also use the Azure Active Directory PowerShell cmdlets that include [Get-MsolUser](/powershell/module/msonline/get-msoluser?view=azureadps-1.0), [Get-MsolGroup](/powershell/module/msonline/get-msolgroup?view=azureadps-1.0), and [Get-MsolServicePrincipal](/powershell/module/msonline/get-msolserviceprincipal?view=azureadps-1.0).

### Scope
Scope specifies the resource or resource group for which the role assignment should apply. For resources, the scope is in the form: `/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/{provider-namespace}/{resource-type}/{resource-name}`. The template uses the `subscription().subscriptionId` function to fill in the `subscription-id` part and the `resourceGroup().name` template function to fill in the `resource-group-name` part. Using these functions means that the lab to which you're assigning a role must exist in the current subscription and the same resource group to which the template deployment is made. The last part, `resource-name`, is the name of the lab. This value is received via the template parameter in this example. 

The role scope in the template: 

```json
"roleScope": "[concat('/subscriptions/', subscription().subscriptionId, '/resourceGroups/', resourceGroup().name, '/providers/Microsoft.DevTestLab/labs/', parameters('labName'))]"
```

### Deploying the template
First, create a parameter file (for example: azuredeploy.parameters.json) that passes values for parameters in the Resource Manager template. 

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "principalId": {
      "value": "11111111-1111-1111-1111-111111111111"
    },
    "labName": {
      "value": "MyLab"
    },
    "roleAssignmentGuid": {
      "value": "22222222-2222-2222-2222-222222222222"
    }
  }
}
```

Then, use the [New-AzureRmResourceGroupDeployment](/powershell/module/azurerm.resources/new-azurermresourcegroupdeployment?view=azurermps-6.13.0) PowerShell cmdlet to deploy the Resource Manager template. The following example command assigns a person, group, or a service principal to the DevTest Labs User role for a lab.

```powershell
New-AzureRmResourceGroupDeployment -Name "MyLabResourceGroup-$(New-Guid)" -ResourceGroupName 'MyLabResourceGroup' -TemplateParameterFile .\azuredeploy.parameters.json -TemplateFile .\azuredeploy.json
```

It's important to note that the group deployment name and role assignment GUID need to be unique. If you try to deploy a resource assignment with a non-unique GUID, then you'll get a `RoleAssignmentUpdateNotPermitted` error.

If you plan to use the template several times to add several Active Directory objects to the DevTest Labs User role for your lab, consider using dynamic objects in your PowerShell command. The following example uses the [New-Guid](/powershell/module/Microsoft.PowerShell.Utility/New-Guid?view=powershell-5.0) cmdlet to specify the resource group deployment name and role assignment GUID dynamically.

```powershell
New-AzureRmResourceGroupDeployment -Name "MyLabResourceGroup-$(New-Guid)" -ResourceGroupName 'MyLabResourceGroup' -TemplateFile .\azuredeploy.json -roleAssignmentGuid "$(New-Guid)" -labName "MyLab" -principalId "11111111-1111-1111-1111-111111111111"
```

## Use Azure PowerShell
As discussed in the introduction, you create a new Azure role assignment to add a user to the **DevTest Labs User** role for the lab. In PowerShell, you do so by using the [New-AzureRMRoleAssignment](/powershell/module/azurerm.resources/new-azurermroleassignment?view=azurermps-6.13.0) cmdlet. This cmdlet has many optional parameters to allow for flexibility. The `ObjectId`, `SigninName`, or `ServicePrincipalName` can be specified as the object being granted permissions.  

Here is a sample Azure PowerShell command that adds a user to the DevTest Labs User role in the specified lab.

```powershell
New-AzureRmRoleAssignment -UserPrincipalName <email@company.com> -RoleDefinitionName 'DevTest Labs User' -ResourceName '<Lab Name>' -ResourceGroupName '<Resource Group Name>' -ResourceType 'Microsoft.DevTestLab/labs'
```

To specify the resource to which permissions are being granted can be specified by a combination of `ResourceName`, `ResourceType`, `ResourceGroup` or by the `scope` parameter. Whatever combination of parameters is used, provide enough information to the cmdlet to uniquely identify the Active Directory object (user, group, or service principal), scope (resource group or resource), and role definition.

## Use Azure Command Line Interface (CLI)
In Azure CLI, adding a labs user to a lab is done by using the `az role assignment create` command. For more information on Azure CLI cmdlets, see [Manage access to Azure resources using RBAC and Azure CLI](../role-based-access-control/role-assignments-cli.md).

The object that is being granted access can be specified by the `objectId`, `signInName`, `spn` parameters. The lab to which the object is being granted access can be identified by the `scope` url or a combination of the `resource-name`, `resource-type`, and `resource-group` parameters.

The following Azure CLI example shows you how to add a person to the DevTest Labs User role for the specified Lab.  

```azurecli
az role assignment create --roleName "DevTest Labs User" --signInName <email@company.com> -–resource-name "<Lab Name>" --resource-type “Microsoft.DevTestLab/labs" --resource-group "<Resource Group Name>"
```

## Next steps
See the following articles:

- [Create and manage virtual machines with DevTest Labs using the Azure CLI](devtest-lab-vmcli.md)
- [Create a virtual machine with DevTest Labs using Azure PowerShell](devtest-lab-vm-powershell.md)
- [Use command-line tools to start and stop Azure DevTest Labs virtual machines](use-command-line-start-stop-virtual-machines.md)

