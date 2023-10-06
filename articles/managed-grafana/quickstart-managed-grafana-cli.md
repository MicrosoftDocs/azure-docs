---
title: 'Quickstart: create an Azure Managed Grafana instance using the Azure CLI'
description: Learn how to create a Managed Grafana instance using the Azure CLI
ms.service: managed-grafana
ms.topic: quickstart
author: maud-lv
ms.author: malev
ms.date: 10/06/2023
ms.devlang: azurecli
ms.custom: engagement-fy23, devx-track-azurecli
--- 

# Quickstart: Create an Azure Managed Grafana instance using the Azure CLI

Get started by creating an Azure Managed Grafana workspace using the Azure CLI. Creating a workspace will generate an Azure Managed Grafana instance.

> [!NOTE]
> Azure Managed Grafana now has [two pricing plans](overview.md#service-tiers). This guides takes you through creating a new workspace in the Standard plan. To generate a workspace in the newly released Essential plan, [use the Azure portal](quickstart-managed-grafana-portal.md). We are working on enabling the creation of a workspace in the Essential plan using the Azure CLI.

## Prerequisites

- An Azure account for work or school and an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- The [Azure CLI](/cli/azure/install-azure-cli).
- Minimum required role to create an instance: resource group Contributor.
- Minimum required role to access an instance: resource group Owner.
    >[!NOTE]
    > If you don't meet this requirement, once you've created a new Azure Managed Grafana instance, ask a User Access Administrator, subscription Owner or resource group Owner to grant you a Grafana Admin, Grafana Editor or Grafana Viewer role on the instance.

## Sign in to Azure

Open your CLI and run the `az login` command:

```azurecli
az login
```

This command will prompt your web browser to launch and load an Azure sign-in page.

The CLI experience for Azure Managed Grafana is part of the `amg` extension for the Azure CLI (version 2.30.0 or higher). The extension will automatically install the first time you run the `az grafana` command.

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

1. Open a browser and enter the endpoint URL. Single sign-on via Azure Active Directory has been configured for you automatically. If prompted, enter your Azure account. You should now see your Azure Managed Grafana instance. From there, you can finish setting up your Grafana installation.

   :::image type="content" source="media/quickstart-portal/grafana-ui.png" alt-text="Screenshot of a Managed Grafana instance.":::

   > [!NOTE]
   > Azure Managed Grafana doesn't support connecting with personal Microsoft accounts currently.

You can now start interacting with the Grafana application to configure data sources, create dashboards, reports and alerts. Suggested read: [Monitor Azure services and applications using Grafana](../azure-monitor/visualize/grafana-plugin.md).

## Clean up resources

In the preceding steps, you created an Azure Managed Grafana workspace in a new resource group. If you don't expect to need these resources again in the future, delete the resource group.

`az group delete -n <resource-group-name> --yes`

## Next steps

> [!div class="nextstepaction"]
> [How to configure data sources for Azure Managed Grafana](./how-to-data-source-plugins-managed-identity.md)
