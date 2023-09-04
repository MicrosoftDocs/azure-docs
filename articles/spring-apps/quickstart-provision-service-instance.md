---
title: "Quickstart - Provision an Azure Spring Apps service"
description: Describes creation of an Azure Spring Apps service instance for app deployment.
author: KarlErickson
ms.author: karler
ms.service: spring-apps
ms.topic: quickstart
ms.date: 7/28/2022
ms.custom: devx-track-java, devx-track-azurecli, mode-other, event-tier1-build-2022
zone_pivot_groups: programming-languages-spring-apps
---

# Quickstart: Provision an Azure Spring Apps service instance

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Standard consumption and dedicated (Preview) ✔️ Basic/Standard ❌ Enterprise

This quickstart shows you how to provision a Basic or Standard plan Azure Spring Apps service instance.

Azure Spring Apps supports multiple plans. For more information, see [Quotas and service plans for Azure Spring Apps](./quotas.md). To learn how to create service instances for other plans, see the following articles:

- [Quickstart: Provision an Azure Spring Apps Standard consumption and dedicated plan service instance](./quickstart-provision-standard-consumption-service-instance.md)
- [Migrate an Azure Spring Apps Basic or Standard plan instance to the Enterprise plan](./how-to-migrate-standard-tier-to-enterprise-tier.md)

## Prerequisites

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- (Optional) [Azure CLI version 2.45.0 or higher](/cli/azure/install-azure-cli).

## Provision an instance of Azure Spring Apps

Use the following steps to create an instance of Azure Spring Apps:

#### [Azure portal](#tab/Azure-portal)

1. In a new browser tab, open the [Azure portal](https://portal.azure.com/).

1. Using the search box, search for *Azure Spring Apps*.

1. Select **Azure Spring Apps** from the search results.

   :::image type="content" source="media/quickstart-provision-service-instance/spring-apps-start.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps service in search results." lightbox="media/quickstart-provision-service-instance/spring-apps-start.png":::

1. On the Azure Spring Apps page, select **Create**.

   :::image type="content" source="media/quickstart-provision-service-instance/spring-apps-create.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps resource with Create button highlighted.":::

1. Fill out the form on the Azure Spring Apps **Create** page. Consider the following guidelines:

   - **Subscription**: Select the subscription you want to be billed for this resource.
   - **Resource group**: Creating new resource groups for new resources is a best practice. You use this value in later steps as `<resource-group-name>`.
   - **Service Details/Name**: Specify the `<service-instance-name>`. The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens. The first character of the service name must be a letter and the last character must be either a letter or a number.
   - **Location**: Select the location for your service instance.
   - **Zone Redundant**: Select to create your service instance with an availability zone.
   - Select **Standard** for the **Pricing tier** option.

   :::image type="content" source="media/quickstart-provision-service-instance/portal-start.png" alt-text="Screenshot of Azure portal showing the Azure Spring Apps Create page." lightbox="media/quickstart-provision-service-instance/portal-start.png":::

1. Select **Review and create**.

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/javae2e?tutorial=asc-cli-quickstart&step=public-endpoint)

#### [Azure CLI](#tab/Azure-CLI)

1. Use the following command to add or update the Azure Spring Apps extension for the Azure CLI:

   ```azurecli
   az extension add --upgrade --name spring
   ```

1. Use the following commands to sign in to the Azure CLI and choose your active subscription. If you have access to only one subscription, you can skip the `az account set` command.

   ```azurecli
   az login
   az account list --output table
   az account set --subscription <subscription-name-or-ID>
   ```

1. Prepare a name for your Azure Spring Apps service. The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens. The first character of the service name must be a letter and the last character must be either a letter or a number.

1. use the following commands to create a resource group to contain your Azure Spring Apps service instance, and to create the service instance:

   ```azurecli
   az group create \
       --name <resource-group-name> \
       --location <resource-group-region>
   az spring create \
       --resource-group <resource-group-name> \
       --name <service-instance-name>
   ```

   For more information, see [What is Azure Resource Manager?](../azure-resource-manager/management/overview.md)

---

## Clean up resources

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place. When no longer needed, delete the resource group, which deletes the resources in the resource group. To delete the resource group by using Azure CLI, use the following commands:

```azurecli
az group delete --name <resource-group-name>
```

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Set up Azure Spring Apps Config Server](./quickstart-setup-config-server.md)
