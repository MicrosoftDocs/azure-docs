---
title: Use Bicep to deploy an Azure Managed Application definition
description: Describes how to use Bicep to deploy an Azure Managed Application definition from your service catalog.
ms.topic: quickstart
ms.custom: devx-track-azurepowershell, devx-track-bicep, devx-track-azurecli
ms.date: 05/12/2023
---

# Quickstart: Use Bicep to deploy an Azure Managed Application definition

This quickstart describes how to use Bicep to deploy an Azure Managed Application definition from your service catalog. The definition's in your service catalog are available to members of your organization.

To deploy a managed application definition from your service catalog, do the following tasks:

- Use Bicep to develop a template that deploys a managed application definition.
- Create a parameter file for the deployment.
- Deploy the managed application definition from your service catalog.

## Prerequisites

To complete the tasks in this article, you need the following items:

- Completed the quickstart to [use Bicep to create and publish](publish-bicep-definition.md) a managed application definition in your service catalog.
- An Azure account with an active subscription. If you don't have an account, [create a free account](https://azure.microsoft.com/free/) before you begin.
- [Visual Studio Code](https://code.visualstudio.com/) with the latest [Azure Resource Manager Tools extension](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools). For Bicep files, install the [Bicep extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep).
- Install the latest version of [Azure PowerShell](/powershell/azure/install-az-ps) or [Azure CLI](/cli/azure/install-azure-cli).

## Get managed application definition

# [PowerShell](#tab/azure-powershell)

To get the managed application's definition with Azure PowerShell, run the following commands.

In Visual Studio Code, open a new PowerShell terminal and sign in to your Azure subscription.

```azurepowershell
Connect-AzAccount
```

The command opens your default browser and prompts you to sign in to Azure. For more information, go to [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps).

From Azure PowerShell, get your managed application's definition. In this example, use the resource group name _bicepDefinitionRG_ that was created when you deployed the managed application definition.

```azurepowershell
Get-AzManagedApplicationDefinition -ResourceGroupName bicepDefinitionRG
```

`Get-AzManagedApplicationDefinition` lists all the available definitions in the specified resource group, like _sampleBicepManagedApplication_.

The following command parses the output to show only the definition name and resource group name. You use the names when you deploy the managed application.

```azurepowershell
Get-AzManagedApplicationDefinition -ResourceGroupName bicepDefinitionRG | Select-Object -Property Name, ResourceGroupName
```

# [Azure CLI](#tab/azure-cli)

To get the managed application's definition with Azure CLI, run the following commands.

In Visual Studio Code, open a new Bash terminal session and sign in to your Azure subscription. For example, if you have Git installed, select Git Bash.

```azurecli
az login
```

The command opens your default browser and prompts you to sign in to Azure. For more information, go to [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli).

From Azure CLI, get your managed application's definition. In this example, use the resource group name _bicepDefinitionRG_ that was created when you deployed the managed application definition.

```azurecli
az managedapp definition list --resource-group bicepDefinitionRG
```

The command lists all the available definitions in the specified resource group, like _sampleBicepManagedApplication_.

The following command parses the output to show only the definition name and resource group name. You use the names when you deploy the managed application.

```azurecli
az managedapp definition list --resource-group bicepDefinitionRG --query "[].{Name:name, ResourcGroup:resourceGroup}"
```

---

## Create the Bicep file

Open Visual Studio Code and create a file name _deployServiceCatalog.bicep_. Copy and paste the following code into the file and save it.

```bicep
@description('Region where the resources are deployed.')
param location string = resourceGroup().location

@description('Resource group name where the definition is stored.')
param definitionRG string

@description('Name of the service catalog definition.')
param definitionName string

// Parameters for the managed application's resource deployment
@description('Name of the managed application.')
param managedAppName string

@description('Name for the managed resource group.')
param mrgName string

@maxLength(40)
@description('Service plan name with maximum 40 alphanumeric characters and hyphens. Must be unique within a resource group in your subscription.')
param appServicePlanName string

@maxLength(47)
@description('Globally unique across Azure. Maximum of 47 alphanumeric characters or hyphens.')
param appServiceNamePrefix string

@maxLength(11)
@description('Use only lowercase letters and numbers and a maximum of 11 characters.')
param storageAccountNamePrefix string

@allowed([
  'Premium_LRS'
  'Standard_LRS'
  'Standard_GRS'
])
@description('The options are Premium_LRS, Standard_LRS, or Standard_GRS')
param storageAccountType string

@description('Resource ID for the managed application definition.')
var appResourceId = resourceId('${definitionRG}', 'Microsoft.Solutions/applicationdefinitions', '${definitionName}')

@description('Creates the path for the managed resource group. The resource group is created during deployment.')
var mrgId = '${subscription().id}/resourceGroups/${mrgName}'

resource bicepServiceCatalogApp 'Microsoft.Solutions/applications@2021-07-01' = {
  name: managedAppName
  kind: 'ServiceCatalog'
  location: location
  properties: {
    applicationDefinitionId: appResourceId
    managedResourceGroupId: mrgId
    parameters: {
      appServicePlanName: {
        value: appServicePlanName
      }
      appServiceNamePrefix: {
        value: appServiceNamePrefix
      }
      storageAccountNamePrefix: {
        value: storageAccountNamePrefix
      }
      storageAccountType: {
        value: storageAccountType
      }
    }
  }
}
```

For more information about the resource type, go to [Microsoft.Solutions/applications](/azure/templates/microsoft.solutions/applications).

## Create the parameter file

Open Visual Studio Code and create a parameter file named _deployServiceCatalog.parameters.json_. Copy and paste the following code into the file and save it.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "definitionName": {
      "value": "sampleBicepManagedApplication"
    },
    "definitionRG": {
      "value": "bicepDefinitionRG"
    },
    "managedAppName": {
      "value": "sampleBicepManagedApp"
    },
    "mrgName": {
      "value": "<placeholder for managed resource group name>"
    },
    "appServicePlanName": {
      "value": "demoAppServicePlan"
    },
    "appServiceNamePrefix": {
      "value": "demoApp"
    },
    "storageAccountNamePrefix": {
      "value": "demostg1234"
    },
    "storageAccountType": {
      "value": "Standard_LRS"
    }
  }
}
```

You need to provide several parameters to deploy the managed application:

| Parameter | Value |
| ---- | ---- |
| `definitionName` | Name of the service catalog definition. This example uses _sampleBicepManagedApplication_. |
| `definitionRG` | Resource group name where the definition is stored. This example uses _bicepDefinitionRG_.
| `managedAppName` | Name for the deployed managed application. This example uses _sampleBicepManagedApp_.
| `mrgName` | Unique name for the managed resource group that contains the application's deployed resources. The resource group is created when you deploy the managed application. To create a managed resource group name, you can run the commands that follow this parameter list. |
| `appServicePlanName` | Create a plan name. Maximum of 40 alphanumeric characters and hyphens. For example, _demoAppServicePlan_. App Service plan names must be unique within a resource group in your subscription. |
| `appServiceNamePrefix` | Create a prefix for the plan name. Maximum of 47 alphanumeric characters or hyphens. For example, _demoApp_. During deployment, the prefix is concatenated with a unique string to create a name that's globally unique across Azure. |
| `storageAccountNamePrefix` | Use only lowercase letters and numbers and a maximum of 11 characters. For example, _demostg1234_. During deployment, the prefix is concatenated with a unique string to create a name globally unique across Azure. |
| `storageAccountType` | The options are Premium_LRS, Standard_LRS, and Standard_GRS. |

You can run the following commands to create a name for the managed resource group.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
$mrgprefix = 'mrg-sampleBicepManagedApplication-'
$mrgtimestamp = Get-Date -UFormat "%Y%m%d%H%M%S"
$mrgname = $mrgprefix + $mrgtimestamp
$mrgname
```

# [Azure CLI](#tab/azure-cli)

```azurecli
mrgprefix='mrg-sampleBicepManagedApplication-'
mrgtimestamp=$(date +%Y%m%d%H%M%S)
mrgname="${mrgprefix}${mrgtimestamp}"
echo $mrgname
```

---

The `$mrgprefix` and `$mrgtimestamp` variables are concatenated and stored in the `$mrgname` variable. The variable's value is in the format _mrg-sampleBicepManagedApplication-20230512103059_. You use the `$mrgname` variable's value when you deploy the managed application.

## Deploy the managed application

Use Azure PowerShell or Azure CLI to create a resource group and deploy the managed application.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroup -Name bicepAppRG -Location westus3

New-AzResourceGroupDeployment `
  -ResourceGroupName bicepAppRG `
  -TemplateFile deployServiceCatalog.bicep `
  -TemplateParameterFile deployServiceCatalog.parameters.json
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az group create --name bicepAppRG --location westus3

az deployment group create \
  --resource-group bicepAppRG \
  --template-file deployServiceCatalog.bicep \
  --parameters @deployServiceCatalog.parameters.json
```

---

Your deployment might display a [Bicep linter](../bicep/linter-rule-use-resource-id-functions.md) warning that the `managedResourceGroupId` property expects a resource ID. Because the managed resource group is created during the deployment, there isn't a resource ID available for the property.

## View results

After the service catalog managed application is deployed, you have two new resource groups. One resource group contains the managed application. The other resource group contains the managed resources that were deployed. In this example, an App Service, App Service plan, and storage account.

### Managed application

After the deployment is finished, you can check your managed application's status.

# [PowerShell](#tab/azure-powershell)

Run the following command to check the managed application's status.

```azurepowershell
Get-AzManagedApplication -Name sampleBicepManagedApp -ResourceGroupName bicepAppRG
```

Expand the properties to make it easier to read the `Properties` information.

```azurepowershell
Get-AzManagedApplication -Name sampleBicepManagedApp -ResourceGroupName bicepAppRG | Select-Object -ExpandProperty Properties
```

# [Azure CLI](#tab/azure-cli)

Run the following command to check the managed application's status.

```azurecli
az managedapp show --name sampleBicepManagedApp  --resource-group bicepAppRG
```

The following command parses the data about the managed application to show only the application's name and provisioning state.

```azurecli
az managedapp show --name sampleBicepManagedApp --resource-group bicepAppRG --query "{Name:name, provisioningState:provisioningState}"
```

---

### Managed resources

You can view the resources deployed to the managed resource group.

# [PowerShell](#tab/azure-powershell)

To display the managed resource group's resources, run the following command. You created the `$mrgname` variable when you created the parameters.

```azurepowershell
Get-AzResource -ResourceGroupName $mrgname
```

To display all the role assignments for the managed resource group.

```azurepowershell
Get-AzRoleAssignment -ResourceGroupName $mrgname
```

The managed application definition you created in the quickstart articles used a group with the Owner role assignment. You can view the group with the following command.

```azurepowershell
Get-AzRoleAssignment -ResourceGroupName $mrgname -RoleDefinitionName Owner
```

You can also list the deny assignments for the managed resource group.

```azurepowershell
Get-AzDenyAssignment -ResourceGroupName $mrgname
```

# [Azure CLI](#tab/azure-cli)

To display the managed resource group's resources, run the following command. You created the `$mrgname` variable when you created the parameters.

```azurecli
az resource list --resource-group $mrgname
```

Run the following command to list only the name, type, and provisioning state for the managed resources.

```azurecli
az resource list --resource-group $mrgname --query "[].{Name:name, Type:type, provisioningState:provisioningState}"
```

Run the following command to list the role assignment for the group that was used in the managed application's definition.

```azurecli
az role assignment list --resource-group $mrgname
```

The following command parses the data for the group's role assignment.

```azurecli
az role assignment list --resource-group $mrgname --role Owner --query "[].{ResourceGroup:resourceGroup, GroupName:principalName, RoleDefinition:roleDefinitionId, Role:roleDefinitionName}"
```

To review the managed resource group's deny assignments, use the Azure portal or Azure PowerShell commands.

---

## Clean up resources

When you're finished with the managed application, you can delete the resource groups and that removes all the resources you created. For example, you created the resource groups _bicepAppRG_ and a managed resource group with the prefix _mrg-bicepManagedApplication_.

When you delete the _bicepAppRG_ resource group, the managed application, managed resource group, and all the Azure resources are deleted.

# [PowerShell](#tab/azure-powershell)

The command prompts you to confirm that you want to remove the resource group.

```azurepowershell
Remove-AzResourceGroup -Name bicepAppRG
```

# [Azure CLI](#tab/azure-cli)

The command prompts for confirmation, and then returns you to command prompt while resources are being deleted.

```azurecli
az group delete --resource-group bicepAppRG --no-wait
```

---

If you want to delete the managed application definition, delete the resource groups you created named _packageStorageRG_ and _bicepDefinitionRG_.

## Next steps

- To learn how to create and publish the definition files for a managed application using Azure PowerShell, Azure CLI, or portal, go to [Quickstart: Create and publish an Azure Managed Application definition](publish-service-catalog-app.md).
- To use your own storage to create and publish the definition files for a managed application, go to [Quickstart: Bring your own storage to create and publish an Azure Managed Application definition](publish-service-catalog-bring-your-own-storage.md).
