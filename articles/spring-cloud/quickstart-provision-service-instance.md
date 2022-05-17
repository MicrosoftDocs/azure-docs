---
title: "Quickstart - Provision an Azure Spring Apps service"
description: Describes creation of an Azure Spring Apps service instance for app deployment.
author: karlerickson
ms.author: karler
ms.service: spring-cloud
ms.topic: quickstart
ms.date: 10/12/2021
ms.custom: devx-track-java, devx-track-azurecli, mode-other
zone_pivot_groups: programming-languages-spring-cloud
---

# Quickstart: Provision an Azure Spring Apps service instance

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard tier ❌ Enterprise tier

::: zone pivot="programming-language-csharp"
In this quickstart, you use the Azure CLI to provision an instance of the Azure Spring Apps service.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [.NET Core 3.1 SDK](https://dotnet.microsoft.com/download/dotnet-core/3.1). The Azure Spring Apps service supports .NET Core 3.1 and later versions.
- [The Azure CLI version 2.0.67 or higher](/cli/azure/install-azure-cli).
- [Git](https://git-scm.com/).

## Install Azure CLI extension

Verify that your Azure CLI version is 2.0.67 or later:

```azurecli
az --version
```

Install the Azure Spring Apps extension for the Azure CLI using the following command:

```azurecli
az extension add --name spring
```

## Sign in to Azure

1. Sign in to the Azure CLI.

   ```azurecli
   az login
   ```

1. If you have more than one subscription, choose the one you want to use for this quickstart.

   ```azurecli
   az account list -o table
   ```

   ```azurecli
   az account set --subscription <Name or ID of a subscription from the last step>
   ```

## Provision an instance of Azure Spring Apps

1. Create a [resource group](../azure-resource-manager/management/overview.md) to contain your Azure Spring Apps service. The resource group name can include alphanumeric, underscore, parentheses, hyphen, period (except at end), and Unicode characters.

   ```azurecli
   az group create --location eastus --name <resource group name>
   ```

1. Provision an instance of Azure Spring Apps service. The service instance name must be unique, between 4 and 32 characters long, and can contain only lowercase letters, numbers, and hyphens. The first character of the service name must be a letter and the last character must be either a letter or a number.

   ```azurecli
   az spring create -n <service instance name> -g <resource group name>
   ```

   This command might take several minutes to complete.

1. Set your default resource group name and service instance name so you don't have to repeatedly specify these values in subsequent commands.

   ```azurecli
   az config set defaults.group=<resource group name>
   ```

   ```azurecli
   az config set defaults.spring-cloud=<service instance name>
   ```

::: zone-end

::: zone pivot="programming-language-java"
You can provision an instance of the Azure Spring Apps service using the Azure portal or the Azure CLI.  Both methods are explained in the following procedures.

## Prerequisites

- [Install JDK 8 or JDK 11](/azure/developer/java/fundamentals/java-jdk-install)
- [Sign up for an Azure subscription](https://azure.microsoft.com/free/)
- (Optional) [Install the Azure CLI version 2.0.67 or higher](/cli/azure/install-azure-cli) and install the Azure Spring Apps extension with the command: `az extension add --name spring`
- (Optional) [Install the Azure Toolkit for IntelliJ IDEA](https://plugins.jetbrains.com/plugin/8053-azure-toolkit-for-intellij/) and [sign-in](/azure/developer/java/toolkit-for-intellij/create-hello-world-web-app#installation-and-sign-in)

## Provision an instance of Azure Spring Apps

#### [Portal](#tab/Azure-portal)

The following procedure creates an instance of Azure Spring Apps using the Azure portal.

1. In a new tab, open the [Azure portal](https://portal.azure.com/).

2. From the top search box, search for **Azure Spring Apps**.

3. Select **Azure Spring Apps** from the results.

   :::image type="content" source="media/spring-cloud-quickstart-launch-app-portal/find-spring-cloud-start.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps service in search results.":::

4. On the Azure Spring Apps page, select **Create**.

   :::image type="content" source="media/spring-cloud-quickstart-launch-app-portal/spring-cloud-create.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps resource with Create button highlighted.":::

5. Fill out the form on the Azure Spring Apps **Create** page.  Consider the following guidelines:

   - **Subscription**: Select the subscription you want to be billed for this resource.
   - **Resource group**: Creating new resource groups for new resources is a best practice. You will use this value in later steps as **\<resource group name\>**.
   - **Service Details/Name**: Specify the **\<service instance name\>**.  The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens.  The first character of the service name must be a letter and the last character must be either a letter or a number.
   - **Location**: Select the location for your service instance.
   - Select **Standard** for the **Pricing tier** option.

   :::image type="content" source="media/spring-cloud-quickstart-launch-app-portal/portal-start.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps Create page.":::

6. Select **Review and create**.

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/javae2e?tutorial=asc-cli-quickstart&step=public-endpoint)

#### [CLI](#tab/Azure-CLI)

The following procedure uses the Azure CLI extension to provision an instance of Azure Spring Apps.

1. Update Azure CLI with Azure Spring Apps extension.

   ```azurecli
   az extension update --name spring
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
   az group create --name <resource group name>
   az spring create -n <service instance name> -g <resource group name>
   ```

   Learn more about [Azure Resource Groups](../azure-resource-manager/management/overview.md).

1. Set your default resource group name and Spring Cloud service name using the following command:

   ```azurecli
   az config set defaults.group=<resource group name> defaults.spring-cloud=<service name>
   ```

---
::: zone-end

## Clean up resources

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place. When no longer needed, delete the resource group, which deletes the resources in the resource group. To delete the resource group by using Azure CLI, use the following commands:

```azurecli
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Set up Azure Spring Apps Config Server](./quickstart-setup-config-server.md)
