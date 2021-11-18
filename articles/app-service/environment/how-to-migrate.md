---
title: Migrate App Service Environment v2 to App Service Environment v3
description: Learn how to migrate your App Service Environment v2 to an App Service Environment v3
author: seligj95
ms.topic: article
ms.date: 11/19/2021
ms.author: jordanselig
---
# Migrate App Service Environment v2 to App Service Environment v3

> [!IMPORTANT]
> This article describes a feature that is currently in preview. You should use this feature for dev environments first before migrating any production environments to ensure there are no unexpected issues. Please provide any feedback related to this article or the feature using the buttons at the bottom of the page.
>

An App Service Environment v2 can be migrated to an [App Service Environment v3](overview.md). To learn more about the migration process and to see if your App Service Environment supports migration at this time, see [Migration to App Service Environment v3 Overview](migrate.md).

## How to migrate to App Service Environment v3

### Before you migrate

Ensure you understand how migrating to an App Service Environment v3 will affect your applications. Review the [migration process](migrate.md#overview-of-migration-process) to understand the process timeline and where and when you'll need to get involved.

### Prerequisites

For the initial preview of the migration tool, you should follow the below steps in order and as written since you'll be making Azure REST API calls. The recommended way for making these calls is by using the [Azure CLI](https://docs.microsoft.com/cli/azure/). For information about other methods, see [Getting Started with Azure REST](https://docs.microsoft.com/rest/api/azure/).

For this guide, [install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) or use the [Azure Cloud Shell](https://shell.azure.com/).

### Get your App Service Environment ID

Run these commands to get your App Service Environment ID and store it as an environment variable. Replace the placeholders for name and resource group with your values for the App Service Environment you want to migrate.

```azurecli
ASE_NAME=<Your-App-Service-Environment-name>
ASE_RG=<Your-Resource-Group>
ASE_ID=$(az appservice ase show --name $ASE_NAME --resource-group $ASE_RG --query id --output tsv)
```

### Validate migration is possible

The following command will check whether your App Service Environment is supported for migration. If you receive an error, you can't migrate at this time. For an estimate of when you can migrate, see the [timeline](migrate.md#preview-limitations). If your environment [won't be supported for migration](migrate.md#migration-tool-limitations) or you want to migrate to App Service Environment v3 manually, see [migration alternatives](migration-alternatives.md).

```azurecli
az rest --method post --uri ${ASE_ID}/migrate?api-version=2021-02-01&phase=validation
```

If there are no errors, your migration is supported and you can continue to the next step.

### Pre-migration

Pre-migration refers to [Step 1 of the migration process](migrate.md#overview-of-migration-process). Run the following command to create the new IPs. This step will take about 15 minutes to complete. Don't scale or make changes to your existing App Service Environment during this step.

```azurecli
az rest --method post --uri ${ASE_ID}/migrate?api-version=2021-02-01&phase=premigration
```

The response from this command will include a location that you can poll to check the status of this step.

```azurecli
......COMMAND TO POLL STATUS......
```

Once you get a status of "Succeeded", run the following command to get your new IPs.

```azurecli
az rest --method get --uri ${ASE_ID}/configurations/networking
```

> [!IMPORTANT]
> Do not move on to the next step immediately after pre-migration. Using the new IPs, update any resources and networking components to ensure your new environment functions as intended once migration is complete.
>

### Full migration

Full migration refers to [Step 2 of the migration process](migrate.md#overview-of-migration-process). Be sure to read the details of this step and understand what running the following command will do to your apps and your App Service Environment. Only start this step once you've completed all pre-migration actions and understand the implications of moving on. There will be about one hour of downtime during this step. Don't scale or make changes to your existing App Service Environment during this step.

```azurecli
az rest --method post --uri ${ASE_ID}/migrate?api-version=2021-02-01&phase=fullmigration
```

The response from this command will include a location that you can poll to check the status of this step.

```azurecli
......COMMAND TO POLL STATUS......
```

Once you get a status of "Succeeded", migration is done and you now have an App Service Environment v3.

Get the details of your new environment by running the following command or by navigating to the [Azure portal](https://portal.azure.com).

```azurecli
az appservice ase show --name $ASE_NAME --resource group $ASE_RG
```

## Troubleshooting

If you experience any issues during the migration process...

## Next steps

> [!div class="nextstepaction"]
> [Using an App Service Environment v3](using.md)

> [!div class="nextstepaction"]
> [App Service Environment v3 Networking](networking.md)
