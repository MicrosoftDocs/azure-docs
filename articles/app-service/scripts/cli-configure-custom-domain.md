---
title: 'CLI: Map a custom domain to an app'
description: Learn how to use the Azure CLI to automate deployment and management of your App Service app. This sample shows how to map a custom domain to an app.
tags: azure-service-management

ms.assetid: 5ac4a680-cc73-4578-bcd6-8668c08802c2
ms.devlang: azurecli
ms.topic: sample
ms.date: 04/21/2022
ms.custom: mvc, seodec18, devx-track-azurecli
---

# Map a custom domain to an App Service app using CLI

This sample script creates an app in App Service with its related resources, and then maps `www.<yourdomain>` to it.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### To create the web app

:::code language="azurecli" source="~/azure_cli_scripts/app-service/configure-custom-domain/configure-custom-domain-webapp-only.sh" id="FullScript":::

### Map your prepared custom domain name to the web app

1. Create the following variable containing your fully qualified domain name.

   ```azurecli
   fqdn=<Replace with www.{yourdomain}>
   ```

1. Configure a CNAME record that maps your fully qualified domain name to your web app's default domain name ($webappname.azurewebsites.net).

1. Map your domain name to the web app.

   ```azurecli
   az webapp config hostname add --webapp-name $webappname --resource-group myResourceGroup --hostname $fqdn
   
   echo "You can now browse to http://$fqdn"
   ```

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [`az group create`](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [`az appservice plan create`](/cli/azure/appservice/plan#az-appservice-plan-create) | Creates an App Service plan. |
| [`az webapp create`](/cli/azure/webapp#az-webapp-create) | Creates an App Service app. |
| [`az webapp config hostname add`](/cli/azure/webapp/config/hostname#az-webapp-config-hostnam-eadd) | Maps a custom domain to an App Service app. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional App Service CLI script samples can be found in the [Azure App Service documentation](../samples-cli.md).
