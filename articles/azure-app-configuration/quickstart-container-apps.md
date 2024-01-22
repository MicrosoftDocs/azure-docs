---
title: "Quickstart: Use Azure App Configuration in Azure Container Apps"
description: Learn how to connect a containerized application to Azure App Configuration, using Service Connector.
services: azure-app-configuration
author: maud-lv
ms.service: azure-app-configuration
ms.custom: service-connector
ms.topic: quickstart
ms.date: 03/02/2023
ms.author: malev

---

# Quickstart: Use Azure App Configuration in Azure Container Apps

In this quickstart, you will use Azure App Configuration in an app running in Azure Container Apps. This way, you can centralize the storage and management of the configuration of your apps in Container Apps. This quickstart leverages the ASP.NET Core app created in [Quickstart: Create an ASP.NET Core app with App Configuration](./quickstart-aspnet-core-app.md). You will containerize the app and deploy it to Azure Container Apps. Complete the quickstart before you continue.

> [!TIP]
> While following this quickstart, preferably register all new resources within a single resource group, so that you can regroup them all in a single place and delete them faster later on if you don't need them anymore.

## Prerequisites

- An application using an App Configuration store. If you don't have one, create an instance using the [Quickstart: Create an ASP.NET Core app with App Configuration](./quickstart-aspnet-core-app.md).
- An Azure Container Apps instance. If you don't have one, create an instance using the [Azure portal](../container-apps/quickstart-portal.md) or [the CLI](../container-apps/get-started.md).
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- The [Azure CLI](/cli/azure/install-azure-cli)
---

## Connect Azure App Configuration to the container app

In the Azure portal, navigate to your Container App instance. Follow the [Service Connector quickstart for Azure Container Apps](../service-connector/quickstart-portal-container-apps.md) to create a service connection with your App Configuration store using the settings below.

- In the **Basics** tab:
  - select **App Configuration** for **Service type**
  - pick your App Configuration store for "**App Configuration**"

    :::image type="content" border="true" source="media\connect-container-app\use-service-connector.png" alt-text="Screenshot the Azure platform showing a form in the Service Connector menu in a Container App." lightbox="media\connect-container-app\use-service-connector.png":::

- In the **Authentication** tab:
  - pick **Connection string** authentication type and **Read-Only** for "**Permissions for the connection string**
  - expand the **Advanced** menu. In the Configuration information, there should be an environment variable already created called "AZURE_APPCONFIGURATION_CONNECTIONSTRING". Edit the environment variable by selecting the icon on the right and change the name to *ConnectionStrings__AppConfig*. We need to make this change as *ConnectionStrings__AppConfig* is the name of the environment variable the application built in the [ASP.NET Core quickstart](./quickstart-aspnet-core-app.md) will look for. This is the environment variable which contains the connection string for App Configuration. If you have used another application to follow this quickstart, please use the corresponding environment variable name. Then select **Done**.
- Use default values for everything else.

Once done, an environment variable named **ConnectionStrings__AppConfig** will be added to the container of your Container App. Its value is a reference of the Container App secret, the connection string of your App Configuration store.

## Build a container

1. Run the [dotnet publish](/dotnet/core/tools/dotnet-publish) command to build the app in release mode and create the assets in the *published* folder.

    ```dotnet
    dotnet publish -c Release -o published
    ```

1. Create a file named *Dockerfile* in the directory containing your .csproj file, open it in a text editor, and enter the following content. A Dockerfile is a text file that doesn't have an extension and that is used to create a container image.

    ```docker
    FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime
    WORKDIR /app
    COPY published/ ./
    ENTRYPOINT ["dotnet", "TestAppConfig.dll"]
    ```

1. Build the container by running the following command.

    ```docker
    docker build --tag aspnetapp .
    ```

## Create an Azure Container Registry instance

Create an Azure Container Registry (ACR). ACR enables you to build, store, and manage container images.

#### [Portal](#tab/azure-portal)

1. To create the container registry, follow the [Azure Container Registry quickstart](../container-registry/container-registry-get-started-portal.md).
1. Once the deployment is complete, open your ACR instance and from the left menu, select **Settings > Access keys**.
1. Take note of the **Login server** value listed on this page. You'll use this information in a later step.
1. Switch **Admin user** to *Enabled*. This option lets you connect the ACR to Azure Container Apps using admin user credentials. Alternatively, you can leave it disabled and configure the container app to [pull images from the registry with a managed identity](../container-apps/managed-identity-image-pull.md).

#### [Azure CLI](#tab/azure-cli)

1. Create an ACR instance using the following command. It creates a basic tier registry named *myregistry* with admin user enabled that allows the container app to connect to the registry using admin user credentials. For more information, see [Azure Container Registry quickstart](../container-registry/container-registry-get-started-azure-cli.md).

    ```azurecli
   az acr create 
    --resource-group AppConfigTestResources \
    --name myregistry \
    --admin-enabled true \
    --sku Basic
   ```
1. In the command output, take note of the ACR login server value listed after `loginServer`.
1. Retrieve the ACR username and password by running `az acr credential show --name myregistry`. You'll need these values later.

---

## Push the image to Azure Container Registry

Push the Docker image to the ACR created earlier.

1. Run the [az acr login](/cli/azure/acr#az-acr-login) command to log in to the registry.

    ```azurecli
    az acr login --name myregistry
    ```

    The command returns `Login Succeeded` once login is successful.

1. Use [docker tag](https://docs.docker.com/engine/reference/commandline/tag/) to tag the image appropriate details.

    ```docker
    docker tag aspnetapp myregistry.azurecr.io/aspnetapp:v1
    ```

    > [!TIP]
    > To review the list of your existing docker images and tags, run `docker image ls`. In this scenario, you should see at least two images: `aspnetapp` and `myregistry.azurecr.io/aspnetapp`.

1. Use [docker push](https://docs.docker.com/engine/reference/commandline/push/) to push the image to the container registry. This example creates the *aspnetapp* repository in ACR containing the `aspnetapp` image. In the example below, replace the placeholders `<login-server`, `<image-name>` and `<tag>` by the ACR's log-in server value, the image name and the image tag.

    Method:

    ```docker
    docker push <login-server>/<image-name>:<tag>
    ```

    Example:

    ```docker
    docker push myregistry.azurecr.io/aspnetapp:v1
    ```

1. Open your Azure Container Registry in the Azure portal and confirm that under **Repositories**, you can see your new repository.

    :::image type="content" border="true" source="media\connect-container-app\container-registry-repository.png" alt-text="Screenshot of the Azure platform showing a repository in Azure Container Registries.":::

## Add your container image to Azure Container Apps

Update your Container App to load the container image from your ACR.

1. In the Azure portal, open your Azure Container Apps instance.
1. In the left menu, under **Application**, select **Containers**.
1. Select **Edit and deploy**.
1. Under **Container image**, click on the name of the existing container image.
1. Update the following settings:

    | Setting        | Suggested value            | Description                                                                      |
    |----------------|----------------------------|----------------------------------------------------------------------------------|
    | Image source   | *Azure Container Registry* | Select Azure Container Registry as your image source.                            |
    | Authentication | *Admin Credentials*        | Use the admin user credential option that was enabled earlier in the container registry. If you didn't enable the admin user but configured to [use a managed identity](../container-apps/managed-identity-image-pull.md?tabs=azure-cli&pivots=azure-portal), you would need to manually enter the image and tag in the form. |
    | Registry       | *myregistry.azurecr.io*    | Select the Azure Container Registry you created earlier.                         |
    | Image          | *aspnetapp*                | Select the docker image you created and pushed to ACR earlier.                   |
    | Image tag      | *v1*                       | Select your image tag from the list.                                             |

1. Select **Save** and then **Create** to deploy the update to Azure Container App.

## Browse to the URL of the Azure Container App

In the Azure portal, in the Azure Container Apps instance, go to the **Overview** tab and open the **Application Url**.

The web page looks like this:

:::image type="content" border="true" source="media\connect-container-app\web-display.png" alt-text="Screenshot of an internet browser displaying the app running.":::

## Clean up resources

[!INCLUDE [Azure App Configuration cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this quickstart, you:

- Connected Azure App Configuration to Azure Container Apps 
- Used Docker to build a container image from an ASP.NET Core app with App Configuration settings
- Created an Azure Container Registry instance
- Pushed the image to the Azure Container Registry instance
- Added the container image to Azure Container Apps
- Browsed to the URL of the Azure Container Apps instance updated with the settings you configured in your App Configuration store.

The managed identity enables one Azure resource to access another without you maintaining secrets. You can streamline access from Container Apps to other Azure resources. For more information, see how to [access App Configuration using the managed identity](howto-integrate-azure-managed-service-identity.md) and how to [[access Container Registry using the managed identity](../container-registry/container-registry-authentication-managed-identity.md)].

To learn how to configure your ASP.NET Core web app to dynamically refresh configuration settings, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Enable dynamic configuration](./enable-dynamic-configuration-aspnet-core.md)