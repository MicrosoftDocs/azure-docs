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
- Complete the [Quickstart for adding feature flags to ASP.NET Core](./quickstart-feature-flag-aspnet-core.md).

## Build a docker image and test it locally

### Create a Dockerfile

1. Select [Compose sample application: ASP.NET with MS SQL server database](https://docs.docker.com/samples/dotnet/#create-a-dockerfile-for-an-aspnet-core-application)
1. Run the following commands in your terminal to clone the sample repo and set up the sample app environment.

    ```bash
    git clone https://github.com/docker/awesome-compose/
    cd awesome-compose
    ```

### Build and run the container

1. Build the container

1. Run the container locally using the command below and replace `<connection-string>` with your own connection string:

    ``` bash
    docker run -d -p 8080:80 --name myapp testfeatureflags -e AZURE_APPCONFIGURATION_CONNECTIONSTRING="<connection-string>"
    ```

## Push the image to Azure Container Registry

In the next step, create an Azure Container Registry (ACR), where you'll push the Docker image. ACR allows you to build, store, and manage container image.

1. Open  the Azure portal and in the search bar, search for and select **Container Registries**.
1. Select **Create**
1. Fill out form in the **Basics** tab:

    | Setting        | Suggested value        | Description                                                                                                     |
    |----------------|------------------------|-----------------------------------------------------------------------------------------------------------------|
    | Resource group | AppConfigTestResources | Select your resource group.                                                                                     |
    | Registry name  | MyRegistry   | Enter a registry name. The registry name must be unique within Azure, and contain 5-50 alphanumeric characters. |
    | Azure region   | Central US             | Select an Azure region.                                                                                         |
    | SKU            | Basic                  | The basic tier is a cost-optimized entry point appropriate for lower usage scenarios.                           |

1. Accept default values for the remaining setting, and select **Review + create**. After reviewing the settings, select **Create** to deploy the Azure Container Registry.

## Create a Container App

1. In the Azure portal, search for **Container Apps** in the top search bar.
1. Select **Container Apps** in the search results and then **Create**.
1. In the **Basics** tab:

    | Setting                    | Suggested value         | Description                                                                                                         |
    |----------------------------|-------------------------|---------------------------------------------------------------------------------------------------------------------|
    | Subscription               | Your Azure subscription | Select your Azure subscription.                                                                                     |
    | Resource group             | AppConfigTestResources  | Select your **Resource group**.                                                                                     |
    | Container app name         | MyContainerApp    | Enter a **Registry name**. The registry name must be unique within Azure, and contain 5-50 alphanumeric characters. |
    | Region                     | Central US              | Select an Azure region.                                                                                             |
    | Container Apps Environment | MyEnvironment           | Select a Container Apps Environment or create a new one.                                                            |

1. Select **Next: App settings** and fill out the form:

    | Setting               | Suggested value          | Description                                                                                                                                                                                                                   |
    |-----------------------|--------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | Use quickstart image  | Uncheck the box          | Deselect quickstart image to use an existing container.                                                                                                                                                                       |
    | Name                  | MyContainerApp           | The container app name you entered in the previous step is automatically filled in.                                                                                                                                           |
    | Image source          | Azure Container Registry | Select Azure Container Registry as your image source.                                                                                                                                                                         |
    | Registry              | MyRegistry               | Select the Azure Container Registry you created earlier.                                                                                                                                                                      |
    | Image                 | MyImage                  | Select your docker image from the list.                                                                                                                                                                                       |
    | Image tag             | MyImageTag               | Select your image tag from the list.                                                                                                                                                                                          |
    | OS type               | Linux                    | Linux is automatically suggested.                                                                                                                                                                                             |
    | Command override      | Leave empty.             | Optional. Leave this field empty.                                                                                                                                                                                             |
    | Environment variables | Leave empty.             | Leave empty.                                                                                                                                                                                                                  |
    | Ingress               | Select *Enabled*.        | Enable ingress, enter *80* as the value of the target port and keep the automatically suggested settings: *Limited to Container Apps Environment*, *Ingress type* *HTTP*, *Transport*: Auto, *Insecure connections* disabled. |

1. Select **Review + create**.
1. After reviewing the settings, select **Create** to deploy the container app.

## Connect the app to Azure App Configuration

In the next step, connect the container app to Azure App Configuration using [Service Connector](../service-connector/overview.md). Service Connector helps you to connect several Azure services together in a few steps without having to manage the configuration of the network settings and connection information yourself.

## [Portal](#tab/azure-portal)

1. Browse to your container app select **Service Connector** from the left table of contents.
1. Select **Create**:
1. Select or enter the following settings.

| Setting               | Suggested value         | Description                                                                                                            |
|-----------------------|-------------------------|------------------------------------------------------------------------------------------------------------------------|
| **Container**         | MyContainerApp          | Select your Container Apps instance.                                                                                   |
| **Service type**      | App Configuration       | Select *App Configuration* to connect to your App Configuration store to Azure Container Apps.                         |
| **Subscription**      | Your Azure subscription | Select the subscription containing the App Configuration store. The default value is the subscription for your container app. |
| **Connection name**   | Generated unique name   | A connection name is automatically generated. This name identifies the connection between your container app and the App Configuration store.                      |
| **App Configuration** | MyAppConfiguration      | Select the name of the App Configuration store to which you want to connect.                                                       |
| **Client type**       | .NET                    | Select the application stack that works with the target service you selected.                                                |

1. Select **Next: Authentication** and select **System assigned managed identity** to let Azure Directory manage the authentication.
1. Select **Next: Network** to select the network configuration. Then select **Configure firewall rules to enable access to target service**.
1. Select **Next: Review + Create**  to review the provided information. Running the final validation takes a few seconds. Then select **Create** to create the service connection. It might take a minute or so to complete the operation.

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

## Browse to the URL of the Azure Container App

In the Azure portal, browse to the container app you've created and in the **Overview** tab, open the **Application URL**.

> [!NOTE]
> You may need to restart the app if you've disable the feature flag *Beta* in the App Configuration feature flag management.

## Next steps

> [!div class="nextstepaction"]
> [Manage feature flags](./manage-feature-flags.md)
