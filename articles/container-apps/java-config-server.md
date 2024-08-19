---
title: "Tutorial: Connect to a managed Config Server for Spring in Azure Container Apps (preview)"
description: Learn how to connect a Config Server for Spring to your container app.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom: devx-track-azurecli, devx-track-extended-java
ms.topic: tutorial
ms.date: 08/13/2024
ms.author: cshoe
---

# Tutorial: Connect to a managed Config Server for Spring in Azure Container Apps (preview)

Config Server for Spring provides a centralized location to make configuration data available to multiple applications. In this article, you learn to connect an app hosted in Azure Container Apps to a Java Config Server for Spring instance.

The Config Server for Spring Java component uses a GitHub repository as the source for configuration settings. Configuration values are made available to your container app via a binding between the component and your container app. As values change in the configuration server, they automatically flow to your application, all without requiring you to recompile or redeploy your application.

In this tutorial, you learn to:

> [!div class="checklist"]
> * Create a Config Server for Spring Java component
> * Bind the Config Server for Spring to your container app
> * Observe configuration values before and after connecting the config server to your application
> * Encrypt and decrypt configuration values with a symmetric key

> [!IMPORTANT]
> This tutorial uses services that can affect your Azure bill. If you decide to follow along step-by-step, make sure you delete the resources featured in this article to avoid unexpected billing.

## Prerequisites

To complete this project, you need the following items:

| Requirement  | Instructions |
|--|--|
| Azure account | An active subscription is required. If you don't have one, you [can create one for free](https://azure.microsoft.com/free/). |
| Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli).|

## Considerations

When running in Config Server for Spring in Azure Container Apps, be aware of the following details:

| Item | Explanation |
|---|---|
| **Scope** | The Config Server for Spring runs in the same environment as the connected container app. |
| **Scaling** | To maintain a single source of truth, the Config Server for Spring doesn't scale. The scaling properties `minReplicas` and `maxReplicas` are both set to `1`. |
| **Resources** | The container resource allocation for Config Server for Spring is fixed, the number of the CPU cores is 0.5, and the memory size is 1Gi. |
| **Pricing** | The Config Server for Spring billing falls under consumption-based pricing. Resources consumed by managed Java components are billed at the active/idle rates. You can delete components that are no longer in use to stop billing. |
| **Binding** | The container app connects to a Config Server for Spring via a binding. The binding injects configurations into container app environment variables. Once a binding is established, the container app can read configuration values from environment variables. |

## Setup

Before you begin to work with the Config Server for Spring, you first need to create the required resources.

### [Azure CLI](#tab/azure-cli)

Execute the following commands to create your resource group and Container Apps environment.

1. Create variables to support your application configuration. These values are provided for you for the purposes of this lesson.

    ```bash
    export LOCATION=eastus
    export RESOURCE_GROUP=my-services-resource-group
    export ENVIRONMENT=my-environment
    export JAVA_COMPONENT_NAME=configserver
    export APP_NAME=my-config-client
    export IMAGE="mcr.microsoft.com/javacomponents/samples/sample-service-config-client:latest"
    export URI="https://github.com/Azure-Samples/azure-spring-cloud-config-java-aca.git"
    ```

    | Variable | Description |
    |---|---|
    | `LOCATION` | The Azure region location where you create your container app and Java component. |
    | `ENVIRONMENT` | The Azure Container Apps environment name for your demo application. |
    | `RESOURCE_GROUP` | The Azure resource group name for your demo application. |
    | `JAVA_COMPONENT_NAME` | The name of the Java component created for your container app. In this case, you create a Config Server for Spring Java component.  |
    | `IMAGE` | The container image used in your container app. |
    | `URI` | You can replace the URI with your git repo url, if it's private, add the related authentication configurations such as `spring.cloud.config.server.git.username` and `spring.cloud.config.server.git.password`. |

1. Sign in to Azure with the Azure CLI.

    ```azurecli
    az login
    ```

1. Create a resource group.

    ```azurecli
    az group create --name $RESOURCE_GROUP --location $LOCATION
    ```

1. Create your container apps environment.

    ```azurecli
    az containerapp env create \
      --name $ENVIRONMENT \
      --resource-group $RESOURCE_GROUP \
      --location $LOCATION
    ```

### [Azure portal](#tab/azure-portal)

Use the following steps to create each of the resources necessary to create a container app.

1. Search for **Container Apps** in the Azure portal and select **Create**.

1. Enter the following values to *Basics* tab.

    | Property | Value |
    |---|---|
    | **Subscription** | Select your Azure subscription. |
    | **Resource group** | Select **Create new** link to create a new resource group named **my-resource-group**. |
    | **Container app name** | Enter **my-config-client**.  |
    | **Deployment source** | Select **Container image**. |
    | **Region** | Select the region nearest you. |
    | **Container Apps environment** | Select the **Create new** link to create a new environment. |

1. In the *Create Container Apps environment* window, enter the following values.

    | Property | Value |
    |---|---|
    | **Environment name** | Enter **my-environment**. |
    | **Zone redundancy** | Select **Disabled**.  |

  Select the **Create** button, and then select the **Container** tab.

1. In *Container* tab, enter the following values.

    | Property | Value |
    |---|---|
    | **Name** | Enter **my-config-client**. |
    | **Image source** | Select **Docker Hub or other registries**. |
    | **Image type** | Select **Public**. |
    | **Registry login server** | Enter **mcr.microsoft.com**. |
    | **Image and tag** | Enter **javacomponents/samples/sample-service-config-client:latest**. |

  Select the **Ingress** tab.

1. In *Ingress* tab, enter the following and leave the rest of the form with their default values.

    | Property | Value |
    |---|---|
    | **Ingress** | Select **Enabled**. |
    | **Ingress traffic** | Select **Accept traffic from anywhere**. |
    | **Ingress type** | Select **HTTP**. |
    | **Target port** | Enter **8080**. |

  Select **Review + create**.

1. Once the validation checks pass, select **Create** to create your container app.

---

This environment is used to host both the Config Server for Spring java component and your container app.

## Create the Config Server for Spring Java component

Now that you have a Container Apps environment, you can create your container app and bind it to a Config Server for Spring java component. When you bind your container app, configuration values automatically synchronize from the Config Server component to your application.

### [Azure CLI](#tab/azure-cli)

1. Create the Config Server for Spring Java component.

    ```azurecli
    az containerapp env java-component config-server-for-spring create \
      --environment $ENVIRONMENT \
      --resource-group $RESOURCE_GROUP \
      --name $JAVA_COMPONENT_NAME \
      --configuration spring.cloud.config.server.git.uri=$URI
    ```

1. Update the Config Server for Spring Java component.

    ```azurecli
    az containerapp env java-component config-server-for-spring update \
      --environment $ENVIRONMENT \
      --resource-group $RESOURCE_GROUP \
      --name $JAVA_COMPONENT_NAME \
      --configuration spring.cloud.config.server.git.uri=$URI spring.cloud.config.server.git.refresh-rate=60
    ```

    Here, you're telling the component where to find the repository that holds your configuration information via the `uri` property. The `refresh-rate` property tells Container Apps how often to check for changes in your git repository.

### [Azure portal](#tab/azure-portal)

Now that you have an existing environment and config server client container app, you can create a Java component instance of Config Server for Spring.

1. Go to your container app's environment in the portal.

1. From the left menu, under *Services* category, select **Services**.

1. Select **+ Configure** drop down, and select **Java component**.

1. In the *Configure Java component* panel, enter the following values.

    | Property | Value |
    |---|---|
    | **Java component type** | Select **Config Server for Spring**. |
    | **Java component name** | Enter **configserver**. |

1. In the *Git repositories* section, select the **+ Add** button and enter the following values.

    | Property | Value |
    |---|---|
    | **Type** | Select **HTTP**. |
    | **URI** | Enter **https://github.com/Azure-Samples/azure-spring-cloud-config-java-aca.git**. |

  Leave the rest of the fields with the default values and select **Add**.

1. Select **Next**.

1. On the *Review* tab, select **Configure**.

---

## Bind your container app to the Config Server for Spring Java component

### [Azure CLI](#tab/azure-cli)

1. Create the container app that consumes configuration data.

    ```azurecli
    az containerapp create \
      --name $APP_NAME \
      --resource-group $RESOURCE_GROUP \
      --environment $ENVIRONMENT \
      --image $IMAGE \
      --min-replicas 1 \
      --max-replicas 1 \
      --ingress external \
      --target-port 8080 \
      --query properties.configuration.ingress.fqdn
    ```

    This command returns the URL of your container app that consumes configuration data. Copy the URL to a text editor so you can use it in a coming step.

    If you visit your app in a browser, the `connectTimeout` value returned is the default value of `0`.

2. Bind to the Config Server for Spring.

    Now that the container app and Config Server are created, you bind them together with the `update` command to your container app.

    ```azurecli
    az containerapp update \
      --name $APP_NAME \
      --resource-group $RESOURCE_GROUP \
      --bind $JAVA_COMPONENT_NAME
    ```

    The `--bind $JAVA_COMPONENT_NAME` parameter creates the link between your container app and the configuration component.

### [Azure portal](#tab/azure-portal)

1. Go to your container app environment in the portal.

1. From the left menu, under *Services* category, select **Services**.

1. From the list, select **configserver**.

1. Under *bindings, select the *App name* drop-down and select  **my-config-client**.

1. Select the **Review** tab.

1. Select the **Configure** button.

1. Return to your container app in the portal and copy the URL of your app to a text editor so you can use it in a coming step.

---

Once the container app and the Config Server component are bound together, configuration changes are automatically synchronized to the container app.

When you visit the app's URL again, the value of `connectTimeout` is now `10000`. This value comes from the git repo set in the `$URI` variable originally set as the source of the configuration component. Specifically, this value is drawn from the `connectionTimeout` property in the repo's *application.yml* file.

The bind request injects configuration setting into the application as environment variables. These values are now available to the application code to use when fetching configuration settings from the config server.

In this case, the following environment variables are available to the application:

```bash
SPRING_CLOUD_CONFIG_URI=http://[JAVA_COMPONENT_INTERNAL_FQDN]:80
SPRING_CLOUD_CONFIG_COMPONENT_URI=http://[JAVA_COMPONENT_INTERNAL_FQDN]:80
SPRING_CONFIG_IMPORT=optional:configserver:$SPRING_CLOUD_CONFIG_URI
```

If you want to customize your own `SPRING_CONFIG_IMPORT`, you can refer to the environment variable `SPRING_CLOUD_CONFIG_COMPONENT_URI`, for example, you can override by command line arguments, like `Java -Dspring.config.import=optional:configserver:${SPRING_CLOUD_CONFIG_COMPONENT_URI}?fail-fast=true`.

You can also remove a binding from your application.

## Unbind your container app from the Config Server for Spring Java component

### [Azure CLI](#tab/azure-cli)
  To remove a binding from a container app, use the `--unbind` option.

  ``` azurecli
  az containerapp update \
    --name $APP_NAME \
    --unbind $JAVA_COMPONENT_NAME \
    --resource-group $RESOURCE_GROUP
  ```

### [Azure portal](#tab/azure-portal)

1. Go to your container app environment in the portal.

1. From the left menu, under *Services* category, select **Services**.

1. From the list, select **configserver**.

1. Under *Bindings*, find the line for *my-config-client* select and select **Delete**.

1. Select **Next**.

1. Select the **Review** tab.

1. Select the **Configure** button.

---

When you visit the app's URL again, the value of `connectTimeout` changes to back to `0`.

## Clean up resources

The resources created in this tutorial have an effect on your Azure bill. If you aren't going to use these services long-term, run the following command to remove everything created in this tutorial.

```azurecli
az group delete \
  --resource-group $RESOURCE_GROUP
```

## Next steps

> [!div class="nextstepaction"]
> [Customize Config Server for Spring settings](java-config-server-usage.md)
