---
title: Tutorial - Deploy a linked template
description: Learn how to deploy a linked template
ms.date: 02/26/2020
ms.topic: tutorial
ms.author: jgao
---

# Tutorial: Deploy a linked template

In the previous two tutorials, [Deploy a local template](./deployment-tutorial-local-template.md) and [Deploy a remote template](./deployment-tutorial-remote-template.md), you learned how to deploy a template that is stored in your local computer and in an Azure storage account. To deploy complex solutions, you can break a template into many templates, and deploy these templates through a main template. In this tutorial, you learn how to deploy a main template and a linked template.  It takes about **12 minutes** to complete.

## Prerequisites

We recommend that you complete the first two deployment tutorials, but it's not required.

## Review template

In the previous tutorials, you deploy a template that creates a storage account, App Service plan, and web app. The template used was:

:::code language="json" source="~/resourcemanager-templates/get-started-deployment/local-template/azuredeploy.json":::

## Create a linked template

You can separate the storage account resource into a linked template:

:::code language="json" source="~/resourcemanager-templates/get-started-deployment/linked-template/linkedStorageAccount.json":::

The following template is the main template.  The highlighted **Microsoft.Resources/deployments** object shows how to call a linked template. The linked template cannot be stored as a local file or a file that is only available on your local network. You can only provide a URI value that includes either *http* or *https*. Resource Manager must be able to access the template. One option is to place your linked template in a storage account, and use the URI for that item. The URI is passed to template using a parameter. See the highlighted parameter definition.

:::code language="json" source="~/resourcemanager-templates/get-started-deployment/linked-template/azuredeploy.json" highlight="27-32,40-58":::

Save a copy of the main template to your local computer.

## Store the linked template

The following PowerShell script creates a storage account, creates a container, copies the linked template from a github repository to the container. At the end of the execution, the script returns the URI of the linked template. You will pass the value as a parameter when you deploy the main template.

Select **Try-it** to open the Cloud shell, select **Copy** to copy the PowerShell script, and right-click the shell pane to paste the script:

```azurepowershell-interactive
$projectNamePrefix = Read-Host -Prompt "Enter a project name:"   # This name is used to generate names for Azure resources, such as storage account name.
$location = Read-Host -Prompt "Enter a location (i.e. centralus)"

$resourceGroupName = $projectNamePrefix + "rg"
$storageAccountName = $projectNamePrefix + "store"
$containerName = "linkedtemplates" # The name of the Blob container to be created.

$linkedTemplateURL = "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/get-started-deployment/linked-template/linkedStorageAccount.json" # A completed linked template used in this tutorial.
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

Write-Host "The linked template URI is https://${storageAccountName}.blob.core.windows.net/${containerName}/${fileName}".

Write-Host "Press [ENTER] to continue ..."
```

Make a note of the linked template URI.

## Deploy template

Use either Azure CLI or Azure PowerShell to deploy the template.

If you haven't created the resource group, see [Create resource group](template-tutorial-create-first-template.md#create-resource-group). The example assumes you've set the **templateFile** variable to the path to the template file, as shown in the [first tutorial](./deployment-tutorial-local-template.md#deploy-template).

# [PowerShell](#tab/azure-powershell)

```azurepowershell

$projectName = Read-Host -Prompt "Enter a project name that is used to generate resource names"
$templateFile = Read-Host -Prompt "Enter the main template file"
$linkedTemplateUri = Read-Host -Prompt "Enter the linked template URI"

New-AzResourceGroupDeployment `
  -Name DeployLinkedTemplate `
  -ResourceGroupName myResourceGroup `
  -TemplateUri $templateUri `
  -projectName $projectName `
  -linkedTemplateUri $linkedTemplateUri `
  -verbose
```

# [Azure CLI](#tab/azure-cli)

```azurecli

echo "Enter a project name that is used to generate resource names:"
read projectName
echo "Enter the main template file:"
read templateFile
echo "Enter the linked template URI:"
read linkedTemplateUri

az group deployment create \
  --name DeployLinkedTemplate \
  --resource-group myResourceGroup \
  --template-uri $templateFile \
  --parameters projectName=$projectName linkedTemplateUri=$linkedTemplateUri \
  --verbose
```

---

## Clean up resources

If you're moving on to the next tutorial, you don't need to delete the resource groups.

If you're stopping now, you might want to clean up the resources you deployed by deleting the resource groups.

1. From the Azure portal, select **Resource group** from the left menu.
2. Enter the resource group name in the **Filter by name** field.
3. Select the resource group name.
4. Select **Delete resource group** from the top menu.

## Next steps

You learned how to deploy a linked template. In the next tutorial, you learn how to secure the linked template by using SAS token.

> [!div class="nextstepaction"]
> [Secure a linked template](./deployment-tutorial-secured-linked-template.md)
