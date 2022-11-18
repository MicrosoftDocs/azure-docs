---
title: Connect an ASP.NET Core 6 application to App Configuration using Service Connector
description: Learn how to connect an ASP.NET Core 6 application to + App Configuration using Service Connector
services: azure-app-configuration
author: maud-lv
ms.service: azure-app-configuration
ms.topic: tutorial
ms.date: 11/17/2022
ms.author: malev

---

# Tutorial: Connect an ASP.NET Core 6 app to App Configuration using Service Connector

In this tutorial, you'll learn how to connect an ASP.NET Core 6 app to App Configuration using Service Connector. This tutorial leverages the feature flags capability introduced in the quickstart [Add feature flags to an ASP.NET Core app](./quickstart-feature-flag-aspnet-core.md). Before you continue, finish this tutorial.

## Prerequisites

- An Azure subscription
- Docker CLI
- Complete the [Quickstart for adding feature flags to ASP.NET Core](./quickstart-feature-flag-aspnet-core).

## Build a docker image and test it locally

1. Create Dockerfile manually from [Dockerize an ASP.NET Core application](https://docs.docker.com/samples/dotnet/#create-a-dockerfile-for-an-aspnet-core-application)
1. Build the container
1. Run the container locally using the command below:

    ``` bash
    docker run -d -p 8080:80 --name myapp testfeatureflags -e AZURE_APPCONFIGURATION_CONNECTIONSTRING="real-connection-string"
    ```

## Push the image to Azure Container Registry

In the next step, create an Azure Container Registry (ACR), where you'll push the Docker image. ACR allows you to build, store, and manage container image.

1. Open  the Azure portal and in the search bar, search for and select **Container Registries**.
1. Select **Create**
1. Fill out form in the **Basics** tab:
   1. Select your **Resource group**
   1. Enter a **Registry name**. The registry name must be unique within Azure, and contain 5-50 alphanumeric characters.
   1. Select an Azure region
   1. For **SKU**, select **Basic**.
1. Accept default values for the remaining setting, and select **Review + create**. After reviewing the settings, select **Create** to deploy the Azure Container Registry.

## Create a Container App

1. In the Azure portal, search for **Container Apps** in the top search bar.
1. Select **Container Apps** in the search results and then **Create**.
1. In the **Basics** tab:
   1. Select your Azure subscription
   1. Select an existing resource group or create a new one.
   1. Enter a name for your Container App
   1. Select an Azure region
   1. Select a Container Apps Environment or create a new one

1. Select **Next: App settings** and fill out the form:
   1. Uncheck the box **Use quickstart image**
   1. Enter a name for your container
   1. Select **Azure Container Registry** as your image source and select the ACR created earlier
   1. Select your image and image tag
   1. Under **Application ingress settings**,  select **Enabled**
   1. For Ingress traffic, select Limited to Container Apps Environment
   1. Ingress type is set to HTTP and transport is set to automatic by default
   1. Enter *80* as the value of the target port
   1. Select **Review + create**.
1. After reviewing the settings, select **Create** to deploy the container app.

## Connect the app to Azure App Configuration

The next step lets you connect the container app to Azure App Configuration using [Service Connector](../service-connector/overview.md), which enables you to connect several Azure services together in a few steps without having to manage the configuration of the network settings and connection information yourself.

## [Portal](#tab/azure-portal)

1. Browse to your container app select **Service Connector** from the left table of contents.
1. Select **Create**:
1. Select or enter the following settings.

    | Setting | Suggested value | Description |
    | --- | --- | --- |
    | **Container** | Your container name | Select your Container Apps instance. |
    | **Service type** | App Configuration | This is the target service type. |
    | **Subscription** | One of your subscriptions | The subscription containing your target service. The default value is the subscription for your container app. |
    | **Connection name** | Generated unique name | The connection name that identifies the connection between your container app and target service.|
    | **App Configuration** | Your App Configuration store name | The target App Configuration store to which you want to connect. |
    | **Client type** | .NET | Your application stack that works with the target service you selected. |

1. Select **Next: Authentication** and select **System assigned managed identity** to let Azure Directory manage the authentication.
1. Select **Next: Network** to select the network configuration. Then select **Configure firewall rules to enable access to target service**.
1. Select**Next: Review + Create**  to review the provided information. Running the final validation takes a few seconds. Then select **Create** to create the service connection. It might take a minute or so to complete the operation.

### [Azure CLI](#tab/azure-cli)

1. Run the Azure CLI command `az containerapp connection connection create` to create a service connection from the container app, using a system-assigned managed identity.

    ```azurecli-interactive
    az containerapp connection create appconfig \
        --name ml-my-container-apps <container-app-name> \ # the name of the container app
        --resource-group <resource-group-name> \ # the resource group that contains the container app
        --container <container-app-name> \ #container where the connection information will be saved
        --target-resource-group <app-config-resource-group-name> \ # the resource group that contains the App Configuration store
        --app-config <app-config-store-name> \  # the name of the App Configuration store
        --system-identity #the authentication method
    ```

---

## Browse the URL of the Azure Container App

In the Azure portal, browse to the container app you've created and in the **Overview** tab, open the **Application URL**.

> [!NOTE]
> You may need to restart the app if you've disable Beta in the App Configuration feature flag management.

## Next steps
