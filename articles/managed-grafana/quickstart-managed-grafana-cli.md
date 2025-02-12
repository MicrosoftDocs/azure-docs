---
title: Create an Azure Managed Grafana instance with the Azure CLI
description: Learn how to get started with Azure Managed Grafana and create an Azure Managed Grafana instance using the Azure CLI.
ms.service: azure-managed-grafana
ms.topic: quickstart
author: maud-lv
ms.author: malev
ms.date: 12/17/2024
ms.devlang: azurecli
ms.custom: engagement-fy23, devx-track-azurecli
# customer intent: As a developer or a data analyst, I want to create a new Azure Managed Grafana workspace using the Azure CLI.
--- 

# Quickstart: Create an Azure Managed Grafana instance using the Azure CLI

Get started using Azure Managed Grafana by creating an Azure Managed Grafana workspace using the Azure CLI.

>[!NOTE]
> Azure Managed Grafana has [two pricing plans](overview.md#service-tiers). This guides takes you through creating a new workspace in the Standard plan. To generate a workspace in the Essential (preview) plan, [use the Azure portal](quickstart-managed-grafana-portal.md).

## Prerequisites

- An Azure account for work or school with an active subscription. [Create an account for free](https://azure.microsoft.com/free).

- Minimum required role to create an instance: resource group Contributor.

- Minimum required role to access an instance: resource group Owner.
    >[!NOTE]
    > If you don't meet this requirement, once you've created a new Azure Managed Grafana instance, ask a User Access Administrator, subscription Owner or resource group Owner to grant you a Grafana Admin, Grafana Editor or Grafana Viewer role on the instance.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

## Sign in to Azure

Open your CLI and run the `az login` command:

```azurecli
az login
```

This command prompts your web browser to launch and load an Azure sign-in page.

The CLI experience for Azure Managed Grafana is part of the `amg` extension for the Azure CLI (version 2.30.0 or higher). The extension automatically installs the first time you run the `az grafana` command.

## Create a resource group

Run the following code to create a resource group to organize the Azure resources needed to complete this quickstart. Skip this step if you already have a resource group you want to use.

| Parameter    | Description                                      | Example |
|--------------|-----------------------------------------------------------------------------------------|----------|
| --name | Choose a unique name for your new resource group. | *grafana-rg*     |
| --location    | Choose an Azure region where Azure Managed Grafana is available. For more info, go to [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=managed-grafana).| *eastus*     |

```azurecli
az group create --location <location> --name <resource-group-name>
```

## Create an Azure Managed Grafana workspace

Run the following code to create an Azure Managed Grafana workspace.

| Parameter    | Description                                      | Example |
|--------------|-----------------------------------------------------------------------------------------|----------|
| --name       | Choose a unique name for your new Managed Grafana instance. | *grafana-test*     |
| --resource-group   | Choose a resource group for your Managed Grafana instance.   | *my-resource-group*     |

```azurecli
   az grafana create --name <managed-grafana-resource-name> --resource-group <resource-group-name>
```

Once the deployment is complete, you see a note in the output of the command line stating that the instance was successfully created, alongside with additional information about the deployment.

   > [!NOTE]
   > Azure Managed Grafana has a system-assigned managed identity enabled by default. You can use a user-assigned managed identity or a service principal instead. To learn more, go to [Set up Azure Managed Grafana authentication and permissions (preview)](how-to-authentication-permissions.md).

## Access your new Managed Grafana instance

Now let's check if you can access your new Managed Grafana instance.

1. Take note of the **endpoint** URL ending by `eus.grafana.azure.com`, listed in the CLI output.  

1. Open a browser and enter the endpoint URL. Single sign-on via Microsoft Entra ID is automatically configured. If prompted, log in with your Azure account. You should now see your Azure Managed Grafana instance. From there, you can finish setting up your Grafana installation.

   :::image type="content" source="media/quickstart-portal/grafana-ui.png" alt-text="Screenshot of a Managed Grafana instance.":::

## Clean up resources

In the preceding steps, you created an Azure Managed Grafana workspace in a new resource group. If you don't expect to need these resources again in the future, delete the resource group.

`az group delete -n <resource-group-name> --yes`

## Related content

You can now start interacting with the Grafana application to configure data sources, create dashboards, reports, and alerts. Suggested read: 

- [Monitor Azure services and applications using Grafana](/azure/azure-monitor/visualize/grafana-plugin).
- [Configure data sources for Azure Managed Grafana](./how-to-data-source-plugins-managed-identity.md)
