---
title: How to migrate App Service Environment v2 to App Service Environment v3
description: Learn how to migrate your App Service Environment v2 to App Service Environment v3
author: seligj95
ms.topic: article
ms.date: 12/20/2021
ms.author: jordanselig
---
# How to migrate App Service Environment v2 to App Service Environment v3

> [!IMPORTANT]
> This article describes a feature that is currently in preview. You should use this feature for dev environments first before migrating any production environments to ensure there are no unexpected issues. Please provide any feedback related to this article or the feature using the buttons at the bottom of the page.
>

An App Service Environment (ASE) v2 can be migrated to an [App Service Environment v3](overview.md). To learn more about the migration process and to see if your App Service Environment supports migration at this time, see [Migration to App Service Environment v3](migrate.md).

## Prerequisites

Ensure you understand how migrating to an ASEv3 will affect your applications. Review the [migration process](migrate.md#overview-of-the-migration-process) to understand the process timeline and where and when you'll need to get involved. Also review the [FAQs](migrate.md#frequently-asked-questions), which may answer some questions you currently have.

For the initial preview of the migration tool, you should follow the below steps in order and as written since you'll be making Azure REST API calls. The recommended way for making these calls is by using the [Azure CLI](https://docs.microsoft.com/cli/azure/). For information about other methods, see [Getting Started with Azure REST](https://docs.microsoft.com/rest/api/azure/).

For this guide, [install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) or use the [Azure Cloud Shell](https://shell.azure.com/).

## 1. Get your App Service Environment ID

Run these commands to get your ASE ID and store it as an environment variable. Replace the placeholders for name and resource group with your values for the ASE you want to migrate.

```azurecli
ASE_NAME=<Your-App-Service-Environment-name>
ASE_RG=<Your-Resource-Group>
ASE_ID=$(az appservice ase show --name $ASE_NAME --resource-group $ASE_RG --query id --output tsv)
```

## 2. Delegate your App Service Environment subnet

ASEv3 requires the subnet it's in to have a single delegation of `Microsoft.Web/hostingEnvironments`. Previous versions didn't require this delegation. You'll need to confirm your subnet is delegated properly and update the delegation if needed before migrating. You can update the delegation either by running the following command or by navigating to the subnet in the [Azure portal](https://portal.azure.com).

```azurecli
az network vnet subnet update -g $ASE_RG -n <subnet-name> --vnet-name <vnet-name> --delegations Microsoft.Web/hostingEnvironments
```

![subnet-delegation](./media/migration/subnet_delegation.jpg)

## 3. Validate migration is possible

The following command will check whether your ASE is supported for migration. If you receive an error, you can't migrate at this time. For an estimate of when you can migrate, see the [timeline](migrate.md#preview-limitations). If your environment [won't be supported for migration](migrate.md#migration-tool-limitations) or you want to migrate to ASEv3 manually, see [migration alternatives](migration-alternatives.md).

```azurecli
az rest --method post --uri "${ASE_ID}/migrate?api-version=2021-02-01&phase=validation"
```

If there are no errors, your migration is supported and you can continue to the next step.

## 4. Generate IP addresses for your new App Service Environment v3

Run the following command to create the new IPs. This step will take about 15 minutes to complete. Don't scale or make changes to your existing ASE during this time.

<!-- might have to add --verbose to get location, pending testing -->
```azurecli
az rest --method post --uri "${ASE_ID}/migrate?api-version=2021-02-01&phase=premigration"
```

Run the following command to check the status of this step.

```azurecli
az rest --method get --uri "${ASE_ID}?api-version=2018-11-01" --query properties.status
```

You can also check this status in the portal by heading over to your ASE overview page.

<!-- replace this image -->
![pre-migration-status](./media/migration/pre-migration-status-sample.png)

Once you get a status of "Succeeded", run the following command to get your new IPs.

```azurecli
az rest --method get --uri "${ASE_ID}/configurations/networking?api-version=2018-11-01"
```

## 5. Update dependent resources with new IPs

Don't move on to full migration immediately after completing the previous step. Using the new IPs, update any resources and networking components to ensure your new environment functions as intended once migration is complete. It's your responsibility to make any necessary updates.

## 6. Full migration

Only start this step once you've completed all pre-migration actions listed above and understand the [implications of full migration](migrate.md#full-migration) including what will happen during this time. There will be about one hour of downtime. Don't scale or make changes to your existing ASE during this step.

```azurecli
az rest --method post --uri "${ASE_ID}/migrate?api-version=2021-02-01&phase=fullmigration"
```

Run the following command to check the status of your migration.

```azurecli
az rest --method get --uri "${ASE_ID}?api-version=2018-11-01" --query properties.status
```

Once you get a status of "Succeeded", migration is done and you now have an ASEv3.

Get the details of your new environment by running the following command or by navigating to the [Azure portal](https://portal.azure.com).

```azurecli
az appservice ase show --name $ASE_NAME --resource group $ASE_RG
```

## Next steps

> [!div class="nextstepaction"]
> [Using an App Service Environment v3](using.md)

> [!div class="nextstepaction"]
> [App Service Environment v3 Networking](networking.md)
