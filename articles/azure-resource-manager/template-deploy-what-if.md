---
title: Template deployment what-if operation
description: Determine what changes will happen to your resources before deploying an Azure Resource Manager template.
author: mumian
ms.service: azure-resource-manager
ms.topic: conceptual
ms.date: 11/07/2019
ms.author: jgao

---
# Resource Manager template deployment what-if operation

Before deploying a template, you might want to preview the changes that will happen in your resource group or subscription. Azure Resource Manager provides the what-if operation to let you review the changes and notice any unexpected changes. The what-if operation doesn't make any changes to existing resources. Instead, it predicts the changes if the specified template is deployed.

A full resource payload output looks like:

![Resource Manager template deployment what-if operation fullresourcepayload and change types](./media/template-deploy-what-if/resource-manager-deployment-whatif-change-types.png)

The output lists the types of changes that apply to the operation. There are six types:

- **Create**: The resource doesn't currently exist but is defined in the template. The resource will be created when the deployment is executed.

- **Delete**: This change type only applies when using the [Complete mode](deployment-modes.md) for deployment. The resource exists, but isn't defined in the template. The resource will be deleted when the deployment is executed.

- **Ignore**: The resource exists, but isn't defined in the template. The resource won't be deployed or modified when the deployment is executed. (Proxy resources don't show up with this change type because we can't discover them. Tracked resources in Complete mode that are outside of the RG that matches the what-if request will fall into this bucket as well.)

- **Deploy**: The resource exists, and is defined in the template. It will be redeployed when the deployment is executed. The properties of the resource may or may not change. (This will only show up if ResultFormat is ResourceIdOnly because we don't have sufficient information to perform the proper diff.)

- **NoChange**: The resource exists, and is defined in the template. It will be redeployed when the deployment is executed. The properties of the resource will not change. (This change type is reported with default ResultFormat or when ResultFormat is set to FullResourcePayloads.)

- **Modify**: The resource exists, and is defined in the template. It will be redeployed when the deployment is executed. The properties of the resource will change. (This change type is reported with default ResultFormat or when ResultFormat is set to FullResourcePayloads.)

The what-if can be ran in either the subscription level or the resource group level. The switch for the parameter is called `-ScopeType`. The accepted values are `Subscription` and `Resource Group`. This article only demonstrates the resource group level deployment what-if operation. To learn more about the scopes, see [Deployment scopes](resource-group-template-deploy-rest.md#deployment-scope).

To learn more, see the [New-AzDeploymentWhatIf reference](/powershell/module/az.resources/new-azdeploymentwhatif).

## Run what-if operation

The template used in this article is from [Azure Quickstart templates](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-storage-account-create/azuredeploy.json). The template creates a storage account.  The default storage account type is `Standard_LRS`.

[!code-json[<Azure Resource Manager template create storage account>](~/quickstart-templates/101-storage-account-create/azuredeploy.json)]

To demonstrate the what-if operation, you start with deploying a storage account resource with the default **Standard_LRS** storage account type, and then run the what-if operation with a different storage account type called `Standard_GRS`.

Select **Try it** to open the Azure Cloud Shell, and then paste the script into the shell pane.

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
$location = Read-Host -Prompt "Enter the location (i.e. centralus)"

New-AzResourceGroup -Name $resourceGroupName -Location "$location"
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-storage-account-create/azuredeploy.json"

New-AzDeploymentWhatIf -ScopeType ResourceGroup -ResourceGroupName $resourceGroupName -TemplateUri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-storage-account-create/azuredeploy.json" -storageAccountType Standard_GRS

Write-Host "Press [ENTER] to continue ..."
```

The what-if output is similar to:

![Resource Manager template deployment what-if operation output](./media/template-deploy-what-if/resource-manager-deployment-whatif-output.png)

There is a legend at the top of the output indicating what will be deleted and what will be modified.

At the bottom of the output, it shows the sku name (storage account type) will be changed from **Standard_LRS** to **Standard_GRS**.

## Control the result formats

You can use the `-ResultFormat` to control the outputs. The accepted values are `ResourceIdOnly` and `FullResourcePayloads`.  The following screenshots show the two different output formats:

- Resource ID only

    ![Resource Manager template deployment what-if operation resourceidonly output](./media/template-deploy-what-if/resource-manager-deployment-whatif-output-resourceidonly.png)

- Full resource payloads

    ![Resource Manager template deployment what-if operation fullresourcepayloads output](./media/template-deploy-what-if/resource-manager-deployment-whatif-output-fullresourcepayload.png)

## Use deployment mode

When deploying your resources, you specify that the deployment is either an incremental update or a complete update. The primary difference between these two modes is how Resource Manager handles existing resources in the resource group that aren't in the template. The default mode is incremental. To learn more, see [Azure Resource Manager deployment modes](deployment-modes.md).

The what-if operation supports using deployment mode. The following demo shows using deployment mode with an empty template (with no resources defined):

[!code-json[](~/resourcemanager-templates/empty-template/azuredeploy.json)]

```azurepowershell-interactive
New-AzDeploymentWhatIf -ScopeType ResourceGroup -ResourceGroupName $resourceGroupName -TemplateUri "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/empty-template/azuredeploy.json" -Mode Complete
```

The output indicates that the storage account will be deleted if the empty template is deployed in the complete deployment mode.

![Resource Manager template deployment what-if operation output deployment mode complete](./media/template-deploy-what-if/resource-manager-deployment-whatif-output-mode-complete.png)

## Next steps

- To roll back to a successful deployment when you get an error, see [Rollback on error to successful deployment](rollback-on-error.md).
- To specify how to handle resources that exist in the resource group but aren't defined in the template, see [Azure Resource Manager deployment modes](deployment-modes.md).
- To understand how to define parameters in your template, see [Understand the structure and syntax of Azure Resource Manager templates](resource-group-authoring-templates.md).
- For information about deploying a template that requires a SAS token, see [Deploy private template with SAS token](resource-manager-powershell-sas-token.md).
