---
title: Deploy ARM template with SAS token - Azure Resource Manager | Microsoft Docs
description: Learn how to use Azure CLI or Azure PowerShell to securely deploy a private ARM template with a SAS token. Protect and manage access to your templates.
ms.topic: conceptual
ms.date: 03/20/2024
ms.custom: devx-track-azurepowershell, devx-track-azurecli, seo-azure-cli, devx-track-arm-template
keywords: private template, sas token template, storage account, template security, azure arm template, azure resource manager template
---

# How to deploy private ARM template with SAS token

When your Azure Resource Manager template (ARM template) is located in a storage account, you can restrict access to the template to avoid exposing it publicly. You access a secured template by creating a shared access signature (SAS) token for the template, and providing that token during deployment. This article explains how to use Azure PowerShell or Azure CLI to securely deploy an ARM template with a SAS token.

You will find information on how to protect and manage access to your private ARM templates with directions on how to do the following:

* Create storage account with secured container
* Upload template to storage account
* Provide SAS token during deployment

> [!IMPORTANT]
> Instead of securing your private template with a SAS token, consider using [template specs](template-specs.md). With template specs, you can share your templates with other users in your organization and manage access to the templates through Azure RBAC.

## Create storage account with secured container

The following script creates a storage account and container with public access turned off for template security.

# [PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
New-AzResourceGroup `
  -Name ExampleGroup `
  -Location "Central US"
New-AzStorageAccount `
  -ResourceGroupName ExampleGroup `
  -Name {your-unique-name} `
  -Type Standard_LRS `
  -Location "Central US"
Set-AzCurrentStorageAccount `
  -ResourceGroupName ExampleGroup `
  -Name {your-unique-name}
New-AzStorageContainer `
  -Name templates `
  -Permission Off
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az group create \
  --name "ExampleGroup" \
  --location "Central US"
az storage account create \
    --resource-group ExampleGroup \
    --location "Central US" \
    --sku Standard_LRS \
    --kind Storage \
    --name {your-unique-name}
connection=$(az storage account show-connection-string \
    --resource-group ExampleGroup \
    --name {your-unique-name} \
    --query connectionString)
az storage container create \
    --name templates \
    --public-access Off \
    --connection-string $connection
```

---

## Upload private template to storage account

Now, you're ready to upload your template to the storage account. Provide the path to the template you want to use.

# [PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Set-AzStorageBlobContent `
  -Container templates `
  -File c:\Templates\azuredeploy.json
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az storage blob upload \
    --container-name templates \
    --file azuredeploy.json \
    --name azuredeploy.json \
    --connection-string $connection
```

---

## Provide SAS token during deployment

To deploy a private template in a storage account, generate a SAS token and include it in the URI for the template. Set the expiry time to allow enough time to complete the deployment.

> [!IMPORTANT]
> The blob containing the private template is accessible to only the account owner. However, when you create a SAS token for the blob, the blob is accessible to anyone with that URI. If another user intercepts the URI, that user is able to access the template. A SAS token is a good way of limiting access to your templates, but you should not include sensitive data like passwords directly in the template.
>

# [PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
# get the URI with the SAS token
$templateuri = New-AzStorageBlobSASToken `
  -Container templates `
  -Blob azuredeploy.json `
  -Permission r `
  -ExpiryTime (Get-Date).AddHours(2.0) -FullUri

# provide URI with SAS token during deployment
New-AzResourceGroupDeployment `
  -ResourceGroupName ExampleGroup `
  -TemplateUri $templateuri
```

# [Azure CLI](#tab/azure-cli)

The following example works with the Bash environment in Cloud Shell. Other environments might require different syntax to create the expiration time for the SAS token.

```azurecli-interactive
expiretime=$(date -u -d '30 minutes' +%Y-%m-%dT%H:%MZ)
connection=$(az storage account show-connection-string \
    --resource-group ExampleGroup \
    --name {your-unique-name} \
    --query connectionString)
token=$(az storage blob generate-sas \
    --container-name templates \
    --name azuredeploy.json \
    --expiry $expiretime \
    --permissions r \
    --output tsv \
    --connection-string $connection)
url=$(az storage blob url \
    --container-name templates \
    --name azuredeploy.json \
    --output tsv \
    --connection-string $connection)
az deployment group create \
  --resource-group ExampleGroup \
  --template-uri $url?$token
```

---

For an example of using a SAS token with linked templates, see [Using linked templates with Azure Resource Manager](linked-templates.md).


## Next steps
* For an introduction to deploying templates, see [Deploy resources with ARM templates and Azure PowerShell](deploy-powershell.md).
* To define parameters in template, see [Authoring templates](./syntax.md#parameters).
