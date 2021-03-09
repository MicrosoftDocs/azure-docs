---
title: Create & deploy template specs
description: Describes how to create template specs and share them with other users in your organization.
ms.topic: conceptual
ms.date: 03/02/2021
ms.author: tomfitz
author: tfitzmac
---
# Azure Resource Manager template specs (Preview)

A template spec is a resource type for storing an Azure Resource Manager template (ARM template) in Azure for later deployment. This resource type enables you to share ARM templates with other users in your organization. Just like any other Azure resource, you can use Azure role-based access control (Azure RBAC) to share the template spec.

**Microsoft.Resources/templateSpecs** is the resource type for template specs. It consists of a main template and any number of linked templates. Azure securely stores template specs in resource groups. Template Specs support [versioning](#versioning).

To deploy the template spec, you use standard Azure tools like PowerShell, Azure CLI, Azure portal, REST, and other supported SDKs and clients. You use the same commands as you would for the template.

> [!NOTE]
> Template Specs is currently in preview. To use it with Azure PowerShell, you must install [version 5.0.0 or later](/powershell/azure/install-az-ps). To use it with Azure CLI, use [version 2.14.2 or later](/cli/azure/install-azure-cli).

## Why use template specs?

If you currently have your templates in a GitHub repo or storage account, you run into several challenges when trying to share and use the templates. For a user to deploy it, the template must either be local or the URL for the template must be publicly accessible. To get around this limitation, you might share copies of the template with users who need to deploy it, or open access to the repo or storage account. When users own local copies of a template, these copies can eventually diverge from the original template. When you make a repo or storage account publicly accessible, you may allow unintended users to access the template.

The benefit of using template specs is that you can create canonical templates and share them with teams in your organization. The template specs are secure because they're available to Azure Resource Manager for deployment, but not accessible to users without Azure RBAC permission. Users only need read access to the template spec to deploy its template, so you can share the template without allowing others to modify it.

The templates you include in a template spec should be verified by administrators in your organization to follow the organization's requirements and guidance.

## Create template spec

The following example shows a simple template for creating a storage account in Azure.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageAccountType": {
      "type": "string",
      "defaultValue": "Standard_LRS",
      "allowedValues": [
        "Standard_LRS",
        "Standard_GRS",
        "Standard_ZRS",
        "Premium_LRS"
      ]
    }
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2019-06-01",
      "name": "[concat('store', uniquestring(resourceGroup().id))]",
      "location": "[resourceGroup().location]",
      "kind": "StorageV2",
      "sku": {
        "name": "[parameters('storageAccountType')]"
      }
    }
  ]
}
```

When you create the template spec, the PowerShell or CLI commands are passed the main template file. If the main template references linked templates, the commands will find and package them to create the template spec. To learn more, see [Create a template spec with linked templates](#create-a-template-spec-with-linked-templates).

Create a template spec by using:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzTemplateSpec -Name storageSpec -Version 1.0a -ResourceGroupName templateSpecsRg -Location westus2 -TemplateFile ./mainTemplate.json
```

# [CLI](#tab/azure-cli)

```azurecli
az ts create \
  --name storageSpec \
  --version "1.0a" \
  --resource-group templateSpecRG \
  --location "westus2" \
  --template-file "./mainTemplate.json"
```

---

You can view all template specs in your subscription by using:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Get-AzTemplateSpec
```

# [CLI](#tab/azure-cli)

```azurecli
az ts list
```

---

You can view details of a template spec, including its versions with:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Get-AzTemplateSpec -ResourceGroupName templateSpecsRG -Name storageSpec
```

# [CLI](#tab/azure-cli)

```azurecli
az ts show \
    --name storageSpec \
    --resource-group templateSpecRG \
    --version "1.0a"
```

---

## Deploy template spec

After you've created the template spec, users with **read** access to the template spec can deploy it. For information about granting access, see [Tutorial: Grant a group access to Azure resources using Azure PowerShell](../../role-based-access-control/tutorial-role-assignments-group-powershell.md).

Template specs can be deployed through the portal, PowerShell, Azure CLI, or as a linked template in a larger template deployment. Users in an organization can deploy a template spec to any scope in Azure (resource group, subscription, management group, or tenant).

Instead of passing in a path or URI for a template, you deploy a template spec by providing its resource ID. The resource ID has the following format:

**/subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.Resources/templateSpecs/{template-spec-name}/versions/{template-spec-version}**

Notice that the resource ID includes a version name for the template spec.

For example, you deploy a template spec with the following command.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
$id = "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/templateSpecsRG/providers/Microsoft.Resources/templateSpecs/storageSpec/versions/1.0a"

New-AzResourceGroupDeployment `
  -TemplateSpecId $id `
  -ResourceGroupName demoRG
```

# [CLI](#tab/azure-cli)

```azurecli
id = "/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/templateSpecsRG/providers/Microsoft.Resources/templateSpecs/storageSpec/versions/1.0a"

az deployment group create \
  --resource-group demoRG \
  --template-spec $id
```

---

In practice, you'll typically run `Get-AzTemplateSpec` or `az ts show` to get the ID of the template spec you want to deploy.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
$id = (Get-AzTemplateSpec -Name storageSpec -ResourceGroupName templateSpecsRg -Version 1.0a).Versions.Id

New-AzResourceGroupDeployment `
  -ResourceGroupName demoRG `
  -TemplateSpecId $id
```

# [CLI](#tab/azure-cli)

```azurecli
id = $(az ts show --name storageSpec --resource-group templateSpecRG --version "1.0a" --query "id")

az deployment group create \
  --resource-group demoRG \
  --template-spec $id
```

---

You can also open a URL in the following format to deploy a template spec:

```url
https://portal.azure.com/#create/Microsoft.Template/templateSpecVersionId/%2fsubscriptions%2f{subscription-id}%2fresourceGroups%2f{resource-group-name}%2fproviders%2fMicrosoft.Resources%2ftemplateSpecs%2f{template-spec-name}%2fversions%2f{template-spec-version}
```

## Parameters

Passing in parameters to template spec is exactly like passing parameters to an ARM template. Add the parameter values either inline or in a parameter file.

To pass a parameter inline, use:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroupDeployment `
  -TemplateSpecId $id `
  -ResourceGroupName demoRG `
  -StorageAccountType Standard_GRS
```

# [CLI](#tab/azure-cli)

```azurecli
az deployment group create \
  --resource-group demoRG \
  --template-spec $id \
  --parameters storageAccountType='Standard_GRS'
```

---

To create a local parameter file, use:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "StorageAccountType": {
      "value": "Standard_GRS"
    }
  }
}
```

And, pass that parameter file with:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroupDeployment `
  -TemplateSpecId $id `
  -ResourceGroupName demoRG `
  -TemplateParameterFile ./mainTemplate.parameters.json
```

# [CLI](#tab/azure-cli)

```azurecli
az deployment group create \
  --resource-group demoRG \
  --template-spec $id \
  --parameters "./mainTemplate.parameters.json"
```

---

## Versioning

When you create a template spec, you provide a version name for it. As you iterate on the template code, you can either update an existing version (for hotfixes) or publish a new version. The version is a text string. You can choose to follow any versioning system, including semantic versioning. Users of the template spec can provide the version name they want to use when deploying it.

## Use tags

[Tags](../management/tag-resources.md) help you logically organize your resources. You can add tags to template specs by using Azure PowerShell and Azure CLI:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzTemplateSpec `
  -Name storageSpec `
  -Version 1.0a `
  -ResourceGroupName templateSpecsRg `
  -Location westus2 `
  -TemplateFile ./mainTemplate.json `
  -Tag @{Dept="Finance";Environment="Production"}
```

# [CLI](#tab/azure-cli)

```azurecli
az ts create \
  --name storageSpec \
  --version "1.0a" \
  --resource-group templateSpecRG \
  --location "westus2" \
  --template-file "./mainTemplate.json" \
  --tags Dept=Finance Environment=Production
```

---

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Set-AzTemplateSpec `
  -Name storageSpec `
  -Version 1.0a `
  -ResourceGroupName templateSpecsRg `
  -Location westus2 `
  -TemplateFile ./mainTemplate.json `
  -Tag @{Dept="Finance";Environment="Production"}
```

# [CLI](#tab/azure-cli)

```azurecli
az ts update \
  --name storageSpec \
  --version "1.0a" \
  --resource-group templateSpecRG \
  --location "westus2" \
  --template-file "./mainTemplate.json" \
  --tags Dept=Finance Environment=Production
```

---

When creating or modifying a template spec with the version parameter specified, but without the tag/tags parameter:

- If the template spec exists and has tags, but the version doesn't exist, the new version inherits the same tags as the existing template spec.

When creating or modifying a template spec with both the tag/tags parameter and the version parameter specified:

- If both the template spec and the version don't exist, the tags are added to both the new template spec and the new version.
- If the template spec exists, but the version doesn't exist, the tags are only added to the new version.
- If both the template spec and the version exist, the tags only apply to the version.

When modifying a template with the tag/tags parameter specified but without the version parameter specified, the tags is only added to the template spec.

## Create a template spec with linked templates

If the main template for your template spec references linked templates, the PowerShell and CLI commands can automatically find and package the linked templates from your local drive. You don't need to manually configure storage accounts or repositories to host the template specs - everything is self-contained in the template spec resource.

The following example consists of a main template with two linked templates. The example is only an excerpt of the template. Notice that it uses a property named `relativePath` to link to the other templates. You must use `apiVersion` of `2020-06-01` or later for the deployments resource.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  ...
  "resources": [
    {
      "type": "Microsoft.Resources/deployments",
      "apiVersion": "2020-06-01",
      ...
      "properties": {
        "mode": "Incremental",
        "templateLink": {
          "relativePath": "artifacts/webapp.json"
        }
      }
    },
    {
      "type": "Microsoft.Resources/deployments",
      "apiVersion": "2020-06-01",
      ...
      "properties": {
        "mode": "Incremental",
        "templateLink": {
          "relativePath": "artifacts/database.json"
        }
      }
    }
  ],
  "outputs": {}
}
```

When the PowerShell or CLI command to create the template spec is executed for the preceding example, the command finds three files - the main template, the web app template (`webapp.json`), and the database template (`database.json`) - and packages them into the template spec.

For more information, see [Tutorial: Create a template spec with linked templates](template-specs-create-linked.md).

## Deploy template spec as a linked template

Once you've created a template spec, it's easy to reuse it from an ARM template or another template spec. You link to a template spec by adding its resource ID to your template. The linked template spec is automatically deployed when you deploy the main template. This behavior lets you develop modular template specs, and reuse them as needed.

For example, you can create a template spec that deploys networking resources, and another template spec that deploys storage resources. In ARM templates, you link to these two template specs anytime you need to configure networking or storage resources.

The following example is similar to the earlier example, but you use the `id` property to link to a template spec rather than the `relativePath` property to link to a local template. Use `2020-06-01` for API version for the deployments resource. In the example, the template specs are in a resource group named **templateSpecsRG**.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  ...
  "resources": [
    {
      "type": "Microsoft.Resources/deployments",
      "apiVersion": "2020-06-01",
      "name": "networkingDeployment",
      ...
      "properties": {
        "mode": "Incremental",
        "templateLink": {
          "id": "[resourceId('templateSpecsRG', 'Microsoft.Resources/templateSpecs/versions', 'networkingSpec', '1.0a')]"
        }
      }
    },
    {
      "type": "Microsoft.Resources/deployments",
      "apiVersion": "2020-06-01",
      "name": "storageDeployment",
      ...
      "properties": {
        "mode": "Incremental",
        "templateLink": {
          "id": "[resourceId('templateSpecsRG', 'Microsoft.Resources/templateSpecs/versions', 'storageSpec', '1.0a')]"
        }
      }
    }
  ],
  "outputs": {}
}
```

For more information about linking template specs, see [Tutorial: Deploy a template spec as a linked template](template-specs-deploy-linked-template.md).

## Next steps

* To create and deploy a template spec, see [Quickstart: Create and deploy template spec](quickstart-create-template-specs.md).

* For more information about linking templates in template specs, see [Tutorial: Create a template spec with linked templates](template-specs-create-linked.md).

* For more information about deploying a template spec as a linked template, see [Tutorial: Deploy a template spec as a linked template](template-specs-deploy-linked-template.md).
