---
title: "Quickstart - Provision an Azure Spring Apps service"
description: Describes creation of an Azure Spring Apps service instance for app deployment.
author: karlerickson
ms.author: karler
ms.service: spring-apps
ms.topic: quickstart
ms.date: 7/28/2022
ms.custom: devx-track-java, devx-track-azurecli, mode-other, event-tier1-build-2022
---

# Quickstart: Provision an Azure Spring Apps service instance

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Standard consumption and dedicated (Preview) ✔️ Basic/Standard  ❌ Enterprise 

There are multiple plans supported by Azure Spring Apps, see [Quotas and service plans for Azure Spring Apps](./quotas.md#azure-spring-apps-service-plans-and-limits). In this quickstart, it shows how to provision a Basic or Standard plan Azure Spring Apps service instance. About how to create instances for other plans, check below documents.
- Create an Enterprise plan instance, see [provision Enterprise plan instance](./how-to-migrate-standard-tier-to-enterprise-tier.md#provision-a-service-instance)
- Create a Standard consumption plan service instance, see [provision Standard consumption plan instance](./quickstart-provision-standard-consumption-service-instance.md)

You can provision an instance of the Azure Spring Apps service using the Azure portal or the Azure CLI.  Both methods are explained below.

## Prerequisites
- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- [Azure CLI version 2.45.0 or higher](/cli/azure/install-azure-cli) if Azure CLI is used.

## Provision an instance of Azure Spring Apps

#### [Portal](#tab/Azure-portal)

The following procedure creates an instance of Azure Spring Apps using the Azure portal.

1. In a new tab, open the [Azure portal](https://portal.azure.com/).

1. From the top search box, search for **Azure Spring Apps**.

1. Select **Azure Spring Apps** from the results.

   :::image type="content" source="media/quickstart-provision-service-instance/spring-apps-start.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps service in search results." lightbox="media/quickstart-provision-service-instance/spring-apps-start.png":::

1. On the Azure Spring Apps page, select **Create**.

   :::image type="content" source="media/quickstart-provision-service-instance/spring-apps-create.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps resource with Create button highlighted.":::

1. Fill out the form on the Azure Spring Apps **Create** page.  Consider the following guidelines:

   - **Subscription**: Select the subscription you want to be billed for this resource.
   - **Resource group**: Creating new resource groups for new resources is a best practice. You'll use this value in later steps as **\<resource group name\>**.
   - **Service Details/Name**: Specify the **\<service instance name\>**.  The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens.  The first character of the service name must be a letter and the last character must be either a letter or a number.
   - **Location**: Select the location for your service instance.
   - Select **Standard** for the **Pricing tier** option.

   :::image type="content" source="media/quickstart-provision-service-instance/portal-start.png" alt-text="Screenshot of Azure portal showing the Azure Spring Apps Create page." lightbox="media/quickstart-provision-service-instance/portal-start.png":::

1. Select **Review and create**.

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/javae2e?tutorial=asc-cli-quickstart&step=public-endpoint)

#### [CLI](#tab/Azure-CLI)

The following procedure uses the Azure CLI extension to provision an instance of Azure Spring Apps.

1. Add or update the Azure Spring Apps extension.

   ```azurecli
   az extension add --upgrade --name spring
   ```

1. Sign in to the Azure CLI and choose your active subscription.

   ```azurecli
   az login
   az account list -o table
   az account set --subscription <Name or ID of subscription, skip if you only have 1 subscription>
   ```

1. Prepare a name for your Azure Spring Apps service.  The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens.  The first character of the service name must be a letter and the last character must be either a letter or a number.

1. Create a resource group to contain your Azure Spring Apps service.  Create in instance of the Azure Spring Apps service.

   ```azurecli
   az group create --name <resource group name> --location <resource group region>
   az spring create -n <service instance name> -g <resource group name>
   ```

   Learn more about [Azure Resource Groups](../azure-resource-manager/management/overview.md).

1. Set your default resource group name and Spring Cloud service name using the following command:

   ```azurecli
   az config set defaults.group=<resource group name> defaults.spring=<service name>
   ```

---

## Clean up resources

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place. When no longer needed, delete the resource group, which deletes the resources in the resource group. To delete the resource group by using Azure CLI, use the following commands:

```azurecli
az group delete --name <resource group name>
```

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Set up Azure Spring Apps Config Server](./quickstart-setup-config-server.md)
