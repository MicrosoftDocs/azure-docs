---
title: Tutorial - Deploy a linked template
description: Learn how to deploy a linked template
ms.date: 02/20/2020
ms.topic: tutorial
ms.author: jgao
---

# Tutorial: Deploy a linked template

Learn how to deploy a linked template. It takes about **12 minutes** to complete.

## Prerequisites

We recommend that you complete the [first deployment tutorial](deployment-tutorial-options.md), but it's not required.

## Review template

In the previous tutorial, you deploy a template that creates a storage account, App Service plan, and web app:

:::code language="json" source="~/resourcemanager-templates/get-started-with-templates/quickstart-template/azuredeploy.json":::

## Create a linked template

You can separate the storage account resource into a linked template:

:::code language="json" source="~/resourcemanager-templates/get-started-with-templates/tutorial-deployment/linkedStorageAccount.json":::

The following template is the main template.  The highlighted part shows how to call a linked template. The linked template can not be stored as a local file or a file that is only available on your local network. You can only provide a URI value that includes either http or https. Resource Manager must be able to access the template. One option is to place your linked template in a storage account, and use the URI for that item.

:::code language="json" source="~/resourcemanager-templates/get-started-with-templates/tutorial-deployment/azuredeploy.json" highlight="44-62":::

## Store the linked template

The following PowerShell script creates a storage account, creates a container, copies the linked template from a github repository to the container.

Select **Try-it** to open the cloud shell, select **Copy** to copy the PowerShell script, and right-click the shell pane to paste the script

```azurepowershell-interactive
$projectNamePrefix = Read-Host -Prompt "Enter a project name:"   # This name is used to generate names for Azure resources, such as storage account name.
$location = Read-Host -Prompt "Enter a location (i.e. centralus)"

$resourceGroupName = $projectNamePrefix + "rg"
$storageAccountName = $projectNamePrefix + "store"
$containerName = "linkedtemplates" # The name of the Blob container to be created.

$linkedTemplateURL = "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/tutorial-linked-templates/linkedStorageAccount.json" # A completed linked template used in this tutorial.
$fileName = "linkedStorageAccount.json" # A file name used for downloading and uploading the linked template.

# Download the tutorial linked template
Invoke-WebRequest -Uri $linkedTemplateURL -OutFile "$home/$fileName"

# Create a resource group
New-AzResourceGroup -Name $resourceGroupName -Location $location

# Create a storage account
$storageAccount = New-AzStorageAccount `
    -ResourceGroupName $resourceGroupName `
    -Name $storageAccountName `
    -Location $location `
    -SkuName "Standard_LRS"

$context = $storageAccount.Context

# Create a container
New-AzStorageContainer -Name $containerName -Context $context -Permission Container

# Upload the linked template
Set-AzStorageBlobContent `
    -Container $containerName `
    -File "$home/$fileName" `
    -Blob $fileName `
    -Context $context

Get-azStorageBlob -container $containerName -Context $context | Select Name

Write-Host "The blob Uri is https://${storageAccountName}.blob.core.windows.net/${containerName}/${fileName}".

Write-Host "Press [ENTER] to continue ..."
```

## Deploy template

Use either Azure CLI or Azure PowerShell to deploy a template.

If you haven't created the resource group, see [Create resource group](template-tutorial-create-first-template.md#create-resource-group). The example assumes you've set the **templateFile** variable to the path to the template file, as shown in the [first tutorial](template-tutorial-create-first-template.md#deploy-template).

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroupDeployment `
  -Name addwebapp `
  -ResourceGroupName myResourceGroup `
  -TemplateFile $templateFile `
  -storagePrefix "store" `
  -storageSKU Standard_LRS `
  -webAppName demoapp
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az group deployment create \
  --name addwebapp \
  --resource-group myResourceGroup \
  --template-file $templateFile \
  --parameters storagePrefix=store storageSKU=Standard_LRS webAppName=demoapp
```

---

## Clean up resources

If you're moving on to the next tutorial, you don't need to delete the resource group.

If you're stopping now, you might want to clean up the resources you deployed by deleting the resource group.

1. From the Azure portal, select **Resource group** from the left menu.
2. Enter the resource group name in the **Filter by name** field.
3. Select the resource group name.
4. Select **Delete resource group** from the top menu.

## Next steps

You learned how to deploy a linked template. In the next tutorial, you learn how to secure the linked template by using SAS token.

> [!div class="nextstepaction"]
> [Add tags](deploy-tutorial-secure-linked-template.md)
