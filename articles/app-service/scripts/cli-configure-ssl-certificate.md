---
title: 'CLI: Upload and bind TLS/SSL cert to an app'
description: Learn how to use the Azure CLI to automate deployment and management of your App Service app. This sample shows how to bind a custom TLS/SSL certificate to an app.
tags: azure-service-management

ms.assetid: eb95d350-81ea-4145-a1e2-6eea3b7469b2
ms.devlang: azurecli
ms.topic: sample
ms.date: 04/21/2022
ms.custom: mvc, seodec18, devx-track-azurecli
---

# Bind a custom TLS/SSL certificate to an App Service app using CLI

This sample script creates an app in App Service with its related resources, then binds the TLS/SSL certificate of a custom domain name to it. For this sample, you need:

* Access to your domain registrar's DNS configuration page.
* A valid .PFX file and its password for the TLS/SSL certificate you want to upload and bind.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### To create the web app

:::code language="azurecli" source="~/azure_cli_scripts/app-service/configure-ssl-certificate/configure-ssl-certificate-webapp-only.sh" id="FullScript":::

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

### Upload and bind the SSL certificate

1. Create the following variable containing your pfx path and password.

   ```azurecli
   pfxPath=<replace-with-path-to-your-.PFX-file>
   pfxPassword=<replace-with-your=.PFX-password>
   ```

1. Upload the SSL certificate and get the thumbprint.

   ```azurecli
   thumbprint=$(az webapp config ssl upload --certificate-file $pfxPath --certificate-password $pfxPassword --name $webapp --resource-group $resourceGroup --query thumbprint --output tsv)
   ```

1. Bind the uploaded SSL certificate to the web app.

   ```azurecli
   az webapp config ssl bind --certificate-thumbprint $thumbprint --ssl-type SNI --name $webapp --resource-group $resourceGroup
   
   echo "You can now browse to https://$fqdn"
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
| [`az webapp config hostname add`](/cli/azure/webapp/config/hostname#az-webapp-config-hostname-add) | Maps a custom domain to an App Service app. |
| [`az webapp config ssl upload`](/cli/azure/webapp/config/ssl#az-webapp-config-ssl-upload) | Uploads a TLS/SSL certificate to an App Service app. |
| [`az webapp config ssl bind`](/cli/azure/webapp/config/ssl#az-webapp-config-ssl-bind) | Binds an uploaded TLS/SSL certificate to an App Service app. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional App Service CLI script samples can be found in the [Azure App Service documentation](../samples-cli.md).
