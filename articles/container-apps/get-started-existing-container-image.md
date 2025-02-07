---
title: 'Quickstart: Deploy an existing container image with the command line'
description: Deploy an existing container image to Azure Container Apps with the Azure CLI or PowerShell.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom: devx-track-azurecli, devx-track-azurepowershell
ms.topic: quickstart
ms.date: 02/03/2025
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
- Access to a public or private container registry, such as the [Azure Container Registry](/azure/container-registry/).

[!INCLUDE [container-apps-create-cli-steps.md](../../includes/container-apps-create-cli-steps.md)]

[!INCLUDE [container-apps-set-environment-variables.md](../../includes/container-apps-set-environment-variables.md)]

[!INCLUDE [container-apps-create-resource-group.md](../../includes/container-apps-create-resource-group.md)]

[!INCLUDE [container-apps-create-environment.md](../../includes/container-apps-create-environment.md)]

## Create a container app

Now that you have an environment created, you can deploy your first container app.

::: zone pivot="container-apps-private-registry"

1. Set the environment variables.

	Replace the `<PLACEHOLDERS>` with your values. Your user principal name will typically be in the format of an email address (for example, `username@domain.com`).

	# [Bash](#tab/bash)

	```bash
	CONTAINER_APP_NAME=my-container-app
	KEY_VAULT_NAME=my-key-vault
	USER_PRINCIPAL_NAME=<USER_PRINCIPAL_NAME>
	SECRET_NAME=my-secret-name
	CONTAINER_IMAGE_NAME=<CONTAINER_IMAGE_NAME>
	REGISTRY_SERVER=<REGISTRY_SERVER>
	REGISTRY_USERNAME=<REGISTRY_USERNAME>
	```

	# [PowerShell](#tab/powershell)

	```azurepowershell
	$ContainerAppName = "my-container-app"
	$KeyVaultName = "my-key-vault"
	$UserPrincipalName = "<USER_PRINCIPAL_NAME>"
	$SecretName = "my-secret-name"
	$ContainerImageName = "<CONTAINER_IMAGE_NAME>"
	$RegistryServer = "<REGISTRY_SERVER>"
	$RegistryUsername = "<REGISTRY_USERNAME>"
	```

	---

1. Create the key vault.

	Storing your container registry password using a service such as [Azure Key Vault](/azure/key-vault/general/basic-concepts) keeps the values secure at all times. The steps in this section show how to create a key vault, store your container registry password the Key Vault, and then retrieve the password for use in your code.

	# [Bash](#tab/bash)

	```bash
	az keyvault create --name $KEY_VAULT_NAME --resource-group $RESOURCE_GROUP
	```

	# [PowerShell](#tab/powershell)

	Install the [Key Vault](https://www.powershellgallery.com/packages/Az.KeyVault) module.

	```azurepowershell
	Install-Module Az.KeyVault -Repository PSGallery -Force
	```

	```azurepowershell
	New-AzKeyVault -Name "$KeyVaultName" -ResourceGroupName "$ResourceGroupName" -Location "$Location"
	```

	---

1. Give your user account permissions to manage secrets in the key vault.

	# [Bash](#tab/bash)

	```bash
	KEY_VAULT_ID=$(az keyvault show --name $KEY_VAULT_NAME --query id --output tsv)
	az role assignment create --role "Key Vault Secrets Officer" --assignee "$USER_PRINCIPAL_NAME" --scope "$KEY_VAULT_ID"
	```

	# [PowerShell](#tab/powershell)

	```azurepowershell
	$KeyVault=Get-AzKeyVault -VaultName $KeyVaultName
	New-AzRoleAssignment -SignInName "$UserPrincipalName" -RoleDefinitionName "Key Vault Secrets Officer" -Scope $KeyVault.ResourceID
	```

	---

1. Store your container registry password in the key vault.

	Replace `<REGISTRY_PASSWORD>` with your value.

	# [Bash](#tab/bash)

	```bash
	az keyvault secret set --vault-name $KEY_VAULT_NAME --name $SECRET_NAME --value "<REGISTRY_PASSWORD>"
	```

	# [PowerShell](#tab/powershell)

	```azurepowershell
	$Secret = ConvertTo-SecureString -String "<REGISTRY_PASSWORD>" -AsPlainText -Force
	Set-AzKeyVaultSecret -VaultName "$KeyVaultName" -Name "$SecretName" -SecretValue "$Secret"
	```

	---

1. Retrieve your container registry password from the key vault.

	# [Bash](#tab/bash)

	```bash
	REGISTRY_PASSWORD=$(az keyvault secret show --name $SECRET_NAME --vault-name $KEY_VAULT_NAME --query value --output tsv)
	```

	# [PowerShell](#tab/powershell)

	```azurepowershell
	$RegistryPassword = Get-AzKeyVaultSecret -VaultName "$KeyVaultName" -Name "$SecretName" -AsPlainText
	```

	---

1. Deploy a container image to Azure Container Apps.

	# [Bash](#tab/bash)

	```azurecli
	az containerapp create \
	  --name $CONTAINER_APP_NAME \
	  --location $LOCATION \
	  --resource-group $RESOURCE_GROUP \
	  --image $CONTAINER_IMAGE_NAME \
	  --environment $CONTAINERAPPS_ENVIRONMENT \
	  --registry-server $REGISTRY_SERVER \
	  --registry-username $REGISTRY_USERNAME \
	  --registry-password $REGISTRY_PASSWORD
	```

	If you have enabled ingress on your container app, you can add `--query properties.configuration.ingress.fqdn` to the `create` command to return the public URL for the application.

	# [PowerShell](#tab/powershell)

	```azurepowershell
	$EnvId = (Get-AzContainerAppManagedEnv -ResourceGroupName $ResourceGroupName -EnvName $ContainerAppsEnvironment).Id
	```

	```azurepowershell
	$TemplateObj = New-AzContainerAppTemplateObject -Name $ContainerAppName -Image $ContainerImageName
	```

	```azurepowershell
	$RegistrySecretObj = New-AzContainerAppSecretObject -Name $SecretName -Value $RegistryPassword
	```

	```azurepowershell
	$RegistryArgs = @{
		PasswordSecretRef = $SecretName
		Server = $RegistryServer
		Username = $RegistryUsername
	}
	```

	```azurepowershell
	$RegistryObj = New-AzContainerAppRegistryCredentialObject @RegistryArgs
	```

	```azurepowershell
	$ContainerAppArgs = @{
		Name = $ContainerAppName
		Location = $Location
		ResourceGroupName = $ResourceGroupName
		ManagedEnvironmentId = $EnvId
		TemplateContainer = $TemplateObj
		ConfigurationRegistry = $RegistryObj
		ConfigurationSecret = $RegistrySecretObj
	}
	```

	```azurepowershell
	New-AzContainerApp @ContainerAppArgs
	```

	---

::: zone-end

::: zone pivot="container-apps-public-registry"

1. Set the environment variables.

	# [Bash](#tab/bash)

	```bash
	CONTAINER_APP_NAME=my-container-app
	CONTAINER_IMAGE_NAME=mcr.microsoft.com/k8se/quickstart:latest
	```

	# [PowerShell](#tab/powershell)

	```azurepowershell
	$ContainerAppName = "my-container-app"
	$ContainerImageName = "mcr.microsoft.com/k8se/quickstart:latest"
	```

1. Deploy a container image to Azure Container Apps.

	# [Bash](#tab/bash)

	```azurecli
	az containerapp create \
	  --image $CONTAINER_IMAGE_NAME \
	  --name $CONTAINER_APP_NAME \
	  --resource-group $RESOURCE_GROUP \
	  --environment $CONTAINERAPPS_ENVIRONMENT
	```

	If you have enabled ingress on your container app, you can add `--query properties.configuration.ingress.fqdn` to the `create` command to return the public URL for the application.

	# [PowerShell](#tab/powershell)

	```azurepowershell
	$TemplateObj = New-AzContainerAppTemplateObject -Name $ContainerAppName  -Image $ContainerImageName
	```

	```azurepowershell
	$EnvId = (Get-AzContainerAppManagedEnv -ResourceGroupName $ResourceGroupName -EnvName $ContainerAppsEnvironment).Id
	```

	```azurepowershell
	$ContainerAppArgs = @{
		Name = $ContainerAppName
		Location = $Location
		ResourceGroupName = $ResourceGroupName
		ManagedEnvironmentId = $EnvId
		TemplateContainer = $TemplateObj
	}
	```

	```azurepowershell
	New-AzContainerApp @ContainerAppArgs
	```

---

::: zone-end

## Verify deployment

To verify a successful deployment, you can query the Log Analytics workspace. You might have to wait a few minutes after deployment for the analytics to arrive for the first time before you're able to query the logs.  This depends on the console logging implemented in your container app.

Use the following commands to view console log messages.

# [Bash](#tab/bash)

```azurecli
LOG_ANALYTICS_WORKSPACE_CLIENT_ID=`az containerapp env show --name $CONTAINERAPPS_ENVIRONMENT --resource-group $RESOURCE_GROUP --query properties.appLogsConfiguration.logAnalyticsConfiguration.customerId --out tsv`

az monitor log-analytics query \
  --workspace $LOG_ANALYTICS_WORKSPACE_CLIENT_ID \
  --analytics-query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == $CONTAINER_APP_NAME | project ContainerAppName_s, Log_s, TimeGenerated" \
  --out table
```

# [PowerShell](#tab/powershell)

```azurepowershell
$queryResults = Invoke-AzOperationalInsightsQuery -WorkspaceId $WorkspaceId -Query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == $ContainerAppName | project ContainerAppName_s, Log_s, TimeGenerated"
$queryResults.Results
```

---

## Clean up resources

If you're not going to continue to use this application, run the following command to delete the resource group along with all the resources created in this quickstart.

>[!CAUTION]
> The following command deletes the specified resource group and all resources contained within it. If resources outside the scope of this quickstart exist in the specified resource group, they will also be deleted.

# [Bash](#tab/bash)

```azurecli
az group delete --name $RESOURCE_GROUP
```

# [PowerShell](#tab/powershell)

```azurepowershell
Remove-AzResourceGroup -Name $ResourceGroupName -Force
```

---

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next steps

> [!div class="nextstepaction"]
> [Communication between microservices](communicate-between-microservices.md)
