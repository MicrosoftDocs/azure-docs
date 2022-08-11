---
title: 'Quickstart: create an Azure Managed Grafana Preview instance using the Azure CLI'
description: Learn how to create a Managed Grafana instance using the Azure CLI
ms.service: managed-grafana
ms.topic: quickstart
author: maud-lv
ms.author: malev
ms.date: 07/25/2022
ms.devlang: azurecli
--- 

# Quickstart: Create an Azure Managed Grafana Preview instance using the Azure CLI

Get started by creating an Azure Managed Grafana Preview workspace using the Azure CLI. Creating a workspace will generate a Managed Grafana instance.

> [!NOTE]
> The CLI experience for Azure Managed Grafana Preview is part of the amg extension for the Azure CLI (version 2.30.0 or higher). The extension will automatically install the first time you run an `az grafana` command.

> [!NOTE]
> Azure Managed Grafana doesn't support personal [Microsoft accounts](https://account.microsoft.com) currently.

## Prerequisite

An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet).

## Sign in to Azure

Open your CLI and run the `az login` command:

```azurecli
az login
```

This command will prompt your web browser to launch and load an Azure sign-in page. If the browser fails to open, use device code flow with `az login --use-device-code`. For more sign in options, go to [sign in with the Azure CLI](/cli/azure/authenticate-azure-cli).

## Create a resource group

Run the code below to create resource group to organize the Azure resources needed to complete this quickstart. Skip this step if you already have a resource group you want to use.

| Parameter    | Description                                      | Example |
|--------------|-----------------------------------------------------------------------------------------|----------|
| --name | Choose a unique name for your new resource group. | *grafana-rg*     |
| --location    | Choose an Azure region where Managed Grafana is available. For more info, go to [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=managed-grafana).| *eastus*     |

```azurecli
az group create --location <location> --name <resource-group-name>
```

## Create an Azure Managed Grafana workspace

Run the code below to create an Azure Managed Grafana workspace.

| Parameter    | Description                                      | Example |
|--------------|-----------------------------------------------------------------------------------------|----------|
| --name       | Choose a unique name for your new Managed Grafana instance. | *grafana-test*     |
| --resource-group   | Choose a resource group for your Managed Grafana instance.   | *my-resource-group*     |

```azurecli
   az grafana create --name <managed-grafana-resource-name> --resource-group <resource-group-name>
```

Once the deployment is complete, you'll see a note in the output of the command line stating that the instance was successfully created, alongside with additional information about the deployment.

## Access your new Managed Grafana instance

Now let's check if you can access your new Managed Grafana instance.

1. Take note of the **endpoint** URL ending by `eus.grafana.azure.com`, listed in the CLI output.  

1. Open a browser and enter the endpoint URL. You should now see your Azure Managed Grafana instance. From there, you can finish setting up your Grafana installation.

:::image type="content" source="media/managed-grafana-quickstart-portal-grafana-workspace.png" alt-text="Screenshot of the Azure Managed Grafana instance in the browser.":::

> [!NOTE]
> If creating a Grafana instance fails the first time, please try again. The failure might be due to a limitation in our backend, and we are actively working to fix.

## Clean up resources

If you're not going to continue to use this instance, delete the Azure resources you created.

`az group delete -n <resource-group-name> --yes`

## Next steps

> [!div class="nextstepaction"]
> [How to configure data sources for Azure Managed Grafana](./how-to-data-source-plugins-managed-identity.md)
