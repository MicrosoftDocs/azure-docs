---
title: 'Quickstart: Deploy an existing container image with the command line'
description: Deploy an existing container image to Azure Container Apps with the Azure CLI or PowerShell.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom: devx-track-azurecli, devx-track-azurepowershell
ms.topic: quickstart
ms.date: 08/31/2022
ms.author: cshoe
zone_pivot_groups: container-apps-registry-types
---

# Quickstart: Deploy an existing container image with the command line

The Azure Container Apps service enables you to run microservices and containerized applications on a serverless platform. With Container Apps, you enjoy the benefits of running containers while you leave behind the concerns of manual cloud infrastructure configuration and complex container orchestrators.

This article demonstrates how to deploy an existing container to Azure Container Apps.

> [!NOTE]
> Private registry authorization is supported via registry username and password.

## Prerequisites

- An Azure account with an active subscription.
  - If you don't have one, you [can create one for free](https://azure.microsoft.com/free/).
- Install the [Azure CLI](/cli/azure/install-azure-cli).
- Access to a public or private container registry, such as the [Azure Container Registry](../container-registry/index.yml).

[!INCLUDE [container-apps-create-cli-steps.md](../../includes/container-apps-create-cli-steps.md)]

[!INCLUDE [container-apps-set-environment-variables.md](../../includes/container-apps-set-environment-variables.md)]

[!INCLUDE [container-apps-create-resource-group.md](../../includes/container-apps-create-resource-group.md)]

[!INCLUDE [container-apps-create-environment.md](../../includes/container-apps-create-environment.md)]

## Create a container app

Now that you have an environment created, you can deploy your first container app.

::: zone pivot="container-apps-private-registry"

1. Set environment variables

	Replace the \<PLACEHOLDERS\> with your values. Your user principal name will typically be in the format of an email address (for example, `username@domain.com`).

	# [Bash](#tab/bash)

	```bash
	KEY_VAULT_NAME=<KEY_VAULT_NAME>
	USER_PRINCIPAL_NAME=<USER_PRINCIPAL_NAME>
	SECRET_NAME=<SECRET_NAME>
	CONTAINER_IMAGE_NAME=<CONTAINER_IMAGE_NAME>
	REGISTRY_SERVER=<REGISTRY_SERVER>
	REGISTRY_USERNAME=<REGISTRY_USERNAME>
	```

	# [Azure PowerShell](#tab/azure-powershell)

	```azurepowershell-interactive
	$KeyVaultName = "<KEY_VAULT_NAME>"
	$UserPrincipalName = "<USER_PRINCIPAL_NAME>"
	$SecretName = "<SECRET_NAME>"
	$ContainerImageName = "<CONTAINER_IMAGE_NAME>"
	$RegistryServer = "<REGISTRY_SERVER>"
	$RegistryUsername = "<REGISTRY_USERNAME>"
	```

	---

1. Create key vault

	It is recommended to store your container registry password using a service such as [Azure Key Vault](/azure/key-vault/general/basic-concepts). The steps in this section explain how to create a key vault, store your container registry password as a secret in the key vault, and then retrieve the password for use in your code.

	# [Bash](#tab/bash)

	```bash
	az keyvault create --name $KEY_VAULT_NAME --resource-group $RESOURCE_GROUP
	```

	# [Azure PowerShell](#tab/azure-powershell)

	First make sure you have installed the [KeyVault](https://www.powershellgallery.com/packages/Az.KeyVault) module.

	```azurepowershell-interactive
	Install-Module Az.KeyVault -Repository PSGallery -Force
	```

	```azurepowershell-interactive
	New-AzKeyVault -Name "$KeyVaultName" -ResourceGroupName "$ResourceGroupName" -Location "$Location"
	```

	---

1. Give your user account permissions to manage secrets in the key vault

	# [Bash](#tab/bash)

	```bash
	KEY_VAULT_ID=$(az keyvault show --name $KEY_VAULT_NAME --query id --output tsv)
	az role assignment create --role "Key Vault Secrets Officer" --assignee "$USER_PRINCIPAL_NAME" --scope "$KEY_VAULT_ID"
	```

	# [Azure PowerShell](#tab/azure-powershell)

	```azurepowershell-interactive
	$KeyVault=Get-AzKeyVault -VaultName $KeyVaultName
	New-AzRoleAssignment -SignInName "$UserPrincipalName" -RoleDefinitionName "Key Vault Secrets Officer" -Scope $KeyVault.ResourceID
	```

	---

1. Store container registry password

	Replace the \<PLACEHOLDERS\> with your values.

	TODO1 I'm deliberately not using an env var to store the registry password here. You can delete this line with a suggestion.

	# [Bash](#tab/bash)

	TODO1 Per Copilot there does not seem to be an Azure CLI equivalent for ConvertTo-SecureString (except using Key Vault itself). You can delete this line with a suggestion.

	```bash
	az keyvault secret set --vault-name $KEY_VAULT_NAME --name $SECRET_NAME --value "<REGISTRY_PASSWORD>"
	```

	# [Azure PowerShell](#tab/azure-powershell)

	```azurepowershell-interactive
	$Secret = ConvertTo-SecureString -String "<REGISTRY_PASSWORD>" -AsPlainText -Force
	Set-AzKeyVaultSecret -VaultName "$KeyVaultName" -Name "$SecretName" -SecretValue "$Secret"
	```

	---

1. Retrieve container registry password

	# [Bash](#tab/bash)

	```bash
	REGISTRY_PASSWORD=$(az keyvault secret show --name $SECRET_NAME --vault-name $KEY_VAULT_NAME --query value --output tsv)
	```

	For more information, see
	- [Quickstart: Set and retrieve a secret from Azure Key Vault using Azure CLI](/azure/key-vault/secrets/quick-create-cli)
	- [Manage Key Vault using the Azure CLI](/azure/key-vault/general/manage-with-cli2.md)

	# [Azure PowerShell](#tab/azure-powershell)

	```azurepowershell-interactive
	$RegistryPassword = Get-AzKeyVaultSecret -VaultName "$KeyVaultName" -Name "$SecretName" -AsPlainText
	```

	For more information, see
	- [Quickstart: Set and retrieve a secret from Azure Key Vault using PowerShell](/azure/key-vault/secrets/quick-create-powershell)
	- [Use Azure Key Vault in automation](../../powershell/utility-modules/secretmanagement/how-to/using-azure-keyvault?view=ps-modules)

	---

1. Create container app

	With the `containerapp create` command, deploy a container image to Azure Container Apps.

	The example shown in this article demonstrates how to use a custom container image with common commands. Your container image might need more parameters for the following items:

	- Set the revision mode
	- Define secrets
	- Define environment variables
	- Set container CPU or memory requirements
	- Enable and configure Dapr
	- Enable external or internal ingress
	- Provide minimum and maximum replica values or scale rules

	# [Bash](#tab/bash)

	For details on how to provide values for any of these parameters to the `create` command, run `az containerapp create --help` or [visit the online reference](/cli/azure/containerapp#az-containerapp-create). To generate credentials for an Azure Container Registry, use [az acr credential show](/cli/azure/acr/credential#az-acr-credential-show).

	```azurecli-interactive
	az containerapp create \
	  --name my-container-app \
	  --resource-group $RESOURCE_GROUP \
	  --image $CONTAINER_IMAGE_NAME \
	  --environment $CONTAINERAPPS_ENVIRONMENT \
	  --registry-server $REGISTRY_SERVER \
	  --registry-username $REGISTRY_USERNAME \
	  --registry-password $REGISTRY_PASSWORD
	```

	# [Azure PowerShell](#tab/azure-powershell)

	```azurepowershell-interactive
	$EnvId = (Get-AzContainerAppManagedEnv -ResourceGroupName $ResourceGroupName -EnvName $ContainerAppsEnvironment).Id

	$TemplateObj = New-AzContainerAppTemplateObject -Name my-container-app -Image $ContainerImageName

	$RegistrySecretObj = New-AzContainerAppSecretObject -Name registry-secret -Value $RegistryPassword

	$RegistryArgs = @{
		PasswordSecretRef = 'registry-secret'
		Server = $RegistryServer
		Username = $RegistryUsername
	}

	$RegistryObj = New-AzContainerAppRegistryCredentialObject @RegistryArgs

	$ContainerAppArgs = @{
		Name = 'my-container-app'
		Location = $Location
		ResourceGroupName = $ResourceGroupName
		ManagedEnvironmentId = $EnvId
		TemplateContainer = $TemplateObj
		ConfigurationRegistry = $RegistryObj
		ConfigurationSecret = $RegistrySecretObj
	}

	New-AzContainerApp @ContainerAppArgs
	```

	---

::: zone-end

::: zone pivot="container-apps-public-registry"

# [Bash](#tab/bash)

```azurecli-interactive
az containerapp create \
  --image <REGISTRY_CONTAINER_NAME> \
  --name my-container-app \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINERAPPS_ENVIRONMENT

If you have enabled ingress on your container app, you can add `--query properties.configuration.ingress.fqdn` to the `create` command to return the public URL for the application.

```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
$TemplateObj = New-AzContainerAppTemplateObject -Name my-container-app  -Image "<REGISTRY_CONTAINER_NAME>"
```

(Replace the \<REGISTRY_CONTAINER_NAME\> with your value.)

```azurepowershell-interactive
$EnvId = (Get-AzContainerAppManagedEnv -ResourceGroupName $ResourceGroupName -EnvName $ContainerAppsEnvironment).Id

$ContainerAppArgs = @{
    Name = "my-container-app"
    Location = $Location
    ResourceGroupName = $ResourceGroupName
    ManagedEnvironmentId = $EnvId
    TemplateContainer = $TemplateObj
}
New-AzContainerApp @ContainerAppArgs
```

---

Before you run this command, replace `<REGISTRY_CONTAINER_NAME>` with the full name the public container registry location, including the registry path and tag. For example, a valid container name is `mcr.microsoft.com/k8se/quickstart:latest`.

::: zone-end

## Verify deployment

To verify a successful deployment, you can query the Log Analytics workspace. You might have to wait a few minutes after deployment for the analytics to arrive for the first time before you're able to query the logs.  This depends on the console logging implemented in your container app.

Use the following commands to view console log messages.

# [Bash](#tab/bash)

```azurecli-interactive
LOG_ANALYTICS_WORKSPACE_CLIENT_ID=`az containerapp env show --name $CONTAINERAPPS_ENVIRONMENT --resource-group $RESOURCE_GROUP --query properties.appLogsConfiguration.logAnalyticsConfiguration.customerId --out tsv`

az monitor log-analytics query \
  --workspace $LOG_ANALYTICS_WORKSPACE_CLIENT_ID \
  --analytics-query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == 'my-container-app' | project ContainerAppName_s, Log_s, TimeGenerated" \
  --out table
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
$queryResults = Invoke-AzOperationalInsightsQuery -WorkspaceId $WorkspaceId -Query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == 'my-container-app' | project ContainerAppName_s, Log_s, TimeGenerated"
$queryResults.Results
```

---

## Clean up resources

If you're not going to continue to use this application, run the following command to delete the resource group along with all the resources created in this quickstart.

>[!CAUTION]
> The following command deletes the specified resource group and all resources contained within it. If resources outside the scope of this quickstart exist in the specified resource group, they will also be deleted.

# [Bash](#tab/bash)

```azurecli-interactive
az group delete --name $RESOURCE_GROUP
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name $ResourceGroupName -Force
```

---

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next steps

> [!div class="nextstepaction"]
> [Communication between microservices](communicate-between-microservices.md)
