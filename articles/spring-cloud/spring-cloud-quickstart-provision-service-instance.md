---
title:  "Quickstart - Provision Azure Spring Cloud service"
description: Describes creation of Azure Spring Cloud service instance for app deployment.
author:  MikeDodaro
ms.author: brendm
ms.service: spring-cloud
ms.topic: quickstart
ms.date: 09/08/2020
ms.custom: devx-track-java, devx-track-azurecli
zone_pivot_groups: programming-languages-spring-cloud
---

# Quickstart: Provision Azure Spring Cloud service

::: zone pivot="programming-language-csharp"
In this quickstart, you use the Azure CLI to provision an instance of the Azure Spring Cloud service.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* [.NET Core 3.1 SDK](https://dotnet.microsoft.com/download/dotnet-core/3.1). The Azure Spring Cloud service supports .NET Core 3.1 and later versions.
* [The Azure CLI version 2.0.67 or higher](/cli/azure/install-azure-cli?preserve-view=true&view=azure-cli-latest).
* [Git](https://git-scm.com/).

## Install Azure CLI extension

Verify that your Azure CLI version is 2.0.67 or later:

```azurecli
az --version
```

Install the Azure Spring Cloud extension for the Azure CLI using the following command:

```azurecli
az extension add --name spring-cloud
```

## Log in to Azure

1. Log in to the Azure CLI.

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

## Provision an instance of Azure Spring Cloud

1. Create a [resource group](../azure-resource-manager/management/overview.md) to contain your Azure Spring Cloud service. The resource group name can include alphanumeric, underscore, parentheses, hyphen, period (except at end), and Unicode characters.

   ```azurecli
   az group create --location eastus --name <resource group name>
   ```

1. Provision an instance of Azure Spring Cloud service. The service instance name must be unique, between 4 and 32 characters long, and can contain only lowercase letters, numbers, and hyphens. The first character of the service name must be a letter and the last character must be either a letter or a number.

    ```azurecli
    az spring-cloud create -n <service instance name> -g <resource group name>
    ```

    This command might take several minutes to complete.

1. Set your default resource group name and service instance name so you don't have to repeatedly specify these values in subsequent commands.

   ```azurecli
   az configure --defaults group=<resource group name>
   ```

   ```azurecli
   az configure --defaults spring-cloud=<service instance name>
   ```
::: zone-end

::: zone pivot="programming-language-java"
You can instantiate Azure Spring Cloud using the Azure portal or the Azure CLI.  Both methods are explained in the following procedures.
## Prerequisites

* [Install JDK 8](/java/azure/jdk/?preserve-view=true&view=azure-java-stable)
* [Sign up for an Azure subscription](https://azure.microsoft.com/free/)
* (Optional) [Install the Azure CLI version 2.0.67 or higher](/cli/azure/install-azure-cli?preserve-view=true&view=azure-cli-latest) and install the Azure Spring Cloud extension with command: `az extension add --name spring-cloud`
* (Optional) [Install the Azure Toolkit for IntelliJ](https://plugins.jetbrains.com/plugin/8053-azure-toolkit-for-intellij/) and [sign-in](/azure/developer/java/toolkit-for-intellij/create-hello-world-web-app#installation-and-sign-in)

## Provision an instance of Azure Spring Cloud

#### [Portal](#tab/Azure-portal)

The following procedure creates an instance of Azure Spring Cloud using the Azure portal.

1. In a new tab, open the [Azure portal](https://ms.portal.azure.com/). 

2. From the top search box, search for **Azure Spring Cloud**.

3. Select **Azure Spring Cloud** from the results.

    ![ASC icon start](media/spring-cloud-quickstart-launch-app-portal/find-spring-cloud-start.png)

4. On the Azure Spring Cloud page, click **+ Add**.

    ![ASC icon add](media/spring-cloud-quickstart-launch-app-portal/spring-cloud-add.png)

5. Fill out the form on the Azure Spring Cloud **Create** page.  Consider the following guidelines:
    - **Subscription**: Select the subscription you want to be billed for this resource.
    - **Resource group**: Creating new resource groups for new resources is a best practice. Note that this will be used in later steps as **\<resource group name\>**.
    - **Service Details/Name**: Specify the **\<service instance name\>**.  The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens.  The first character of the service name must be a letter and the last character must be either a letter or a number.
    - **Location**: Select the location for your service instance.

    ![ASC portal start](media/spring-cloud-quickstart-launch-app-portal/portal-start.png)

6. Click **Review and create**.

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/javae2e?tutorial=asc-cli-quickstart&step=public-endpoint)

#### [CLI](#tab/Azure-CLI)

The following procedure uses the Azure CLI extension to provision an instance of Azure Spring Cloud.

1. Log in to the Azure CLI and choose your active subscription.

    ```azurecli
    az login
    az account list -o table
    az account set --subscription <Name or ID of subscription, skip if you only have 1 subscription>
    ```

1. Prepare a name for your Azure Spring Cloud service.  The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens.  The first character of the service name must be a letter and the last character must be either a letter or a number.

1. Create a resource group to contain your Azure Spring Cloud service.

    ```azurecli
    az group create --location eastus --name <resource group name>
    ```

    Learn more about [Azure Resource Groups](../azure-resource-manager/management/overview.md).

1. Open an Azure CLI window and run the following commands to provision an instance of Azure Spring Cloud.

    ```azurecli
    az spring-cloud create -n <service instance name> -g <resource group name>
    ```

    The service instance will take around five minutes to deploy.
---
::: zone-end

## Next steps

In this quickstart, you created Azure resources that will continue to accrue charges if they remain in your subscription. If you don't intend to continue on to the next quickstart, see [Clean up resources](spring-cloud-quickstart-logs-metrics-tracing.md#clean-up-resources). Otherwise, advance to the next quickstart:

> [!div class="nextstepaction"]
> [Set up configuration server](spring-cloud-quickstart-setup-config-server.md)
