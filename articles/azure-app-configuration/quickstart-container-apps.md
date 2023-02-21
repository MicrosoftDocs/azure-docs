---
title: "Quickstart: Use Azure App Configuration in Azure Container Apps"
description: Learn how to connect a containerized application to Azure App Configuration, using Service Connector.
services: azure-app-configuration
author: maud-lv
ms.service: azure-app-configuration
ms.topic: quickstart
ms.date: 02/02/2023
ms.author: malev

---

# Quickstart: Use Azure App Configuration in Azure Container Apps

In this quickstart, you will use Azure App Configuration in an ASP.NET Core app running in Azure Container Apps. This way, you can centralize the storage and management of your Container Apps configuration. This quickstart leverages the ASP.NET Core app created in [Quickstart: Create an ASP.NET Core app with App Configuration](./quickstart-aspnet-core-app.md). You will containerize the app and deploy it to Azure Container Apps. Complete the quickstart before you continue.

> [!TIP]
> While following this quickstart, preferably register all new resources within a single resource group, so that you can regroup them all in a single place and delete them faster later on if you don't need them anymore.

## Prerequisites

- The App Configuration store and the ASP.NET Core App that you created in the [Quickstart: Create an ASP.NET Core app with App Configuration](./quickstart-aspnet-core-app.md).
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- The [Azure CLI](/cli/azure/install-azure-cli)

## Create an Azure Container Apps instance

Start by creating a basic [Azure Container Apps](../container-apps/overview.md) instance and a Container Apps environment, where you'll later host your app.

This Azure service is designed to run containerized applications.

#### [Portal](#tab/azure-portal)

To create the container app and container apps environment using the Azure portal, follow the [Azure Container Apps quickstart](/azure/container-apps/quickstart-portal).

#### [Azure CLI](#tab/azure-cli)

To create the container app and container apps environment using the Azure CLI, follow the [Azure Container Apps quickstart](/azure/container-apps/get-started). The created container app contains a default image.

---

## Connect Azure Container Apps to Azure App Configuration

In the next step, you will add the connection string of your App Configuration store to the secret of your Container App and add an environment variable to your container to reference the secret. You use the [Service Connector](../service-connector/overview.md) to do this in a few steps without managing the connection information yourself.

In the Azure portal, connect the container app to Azure App Configuration following the [Service Connector quickstart for Azure Container Apps](../service-connector/quickstart-portal-container-apps.md). While following the steps of the quickstart:

- In the **Basics** tab:

  - select **App Configuration** for **Service type**
  - pick the App Configuration store created in the quickstart for "**App Configuration**"
  - select **.NET** for **Client Type**.

- In the **Authentication** tab:
  - pick **Connection string** authentication type and **Read-Only** for "**Permissions for the connection string**
  - expand the **Advanced** menu, edit the environment variable name "AZURE_APPCONFIGURATION_CONNECTIONSTRING" by changing it to "ConnectionStrings__AppConfig" and select **Done**
- Use default values for everything else.

Once done, an environment variable named **ConnectionStrings__AppConfig** will be added to the container of your Container App. Its value is a reference of the Container App secret, the connection string of your App Configuration store. The _ConnectionStrings__AppConfig_ is the environment variable your app built from the quickstart will look for.

## Build the container

1. Run the [dotnet publish](/dotnet/core/tools/dotnet-publish) command to build the app in release mode and create the assets in the *published* folder.

    ```dotnet
    dotnet publish -c Release -o published
    ```

1. Create a file named *Dockerfile* in the directory containing your .csproj file, open it in a text editor, and enter the content below. A Dockerfile is a text file that doesn't have an extension and that is used to create a container image.

    ```docker
    FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime
    WORKDIR /app
    COPY published/ ./
    ENTRYPOINT ["dotnet", "TestAppConfig.dll"]
    ```

1. Build the container by running the command below

    ```docker
    docker build --tag aspnetapp .
    ```

## Create an Azure Container Registry instance

Create an Azure Container Registry (ACR). ACR enables you to build, store, and manage container images.

#### [Portal](#tab/azure-portal)

1. To create the container registry, follow the [Azure Container Registry quickstart](/azure/container-registry/container-registry-get-started-portal).
1. Once the deployment is complete, open your ACR instance and from the left menu, select **Settings > Access keys**.
1. Take note of the **Login server** value listed on this page. You'll use this information in a later step.
1. Switch **Admin user** to *Enabled*. This option lets you connect the ACR to Azure Container Apps using admin user credentials.

#### [Azure CLI](#tab/azure-cli)

1. Create an ACR instance following the [Azure Container Registry quickstart](/azure/container-registry/container-registry-get-started-azure-cli).
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

1. Use [docker tag](https://docs.docker.com/engine/reference/commandline/tag/) to tag the image with the ACR name

    ```docker
    docker tag aspnetapp myregistry.azurecr.io/aspnetapp:v1
    ```

    > [!TIP]
    > To review the list of your existing docker images and tags, run `docker image ls`.

1. Use [docker push](https://docs.docker.com/engine/reference/commandline/push/) to push the image to the container registry. This example creates the *aspnetapp* repository in ACR containing the `aspnetapp` image. In the example below, replace the placeholders `<login-server`, `<image-name>` and `<tag>` by the ACR's log-in server value, the image name and the image tag.

    Method:

    ```docker
    docker push <login-server>/<image-name>:<tag>
    ```

    Example:

    ```docker
    docker push myregistry.azurecr.io/aspnetapp:v1
    ```

## Add your container image to Azure Container Apps

Update the existing container app by importing the docker image you created and pushed to ACR earlier.

#### [Portal](#tab/azure-portal)

1. Open your Azure Container Apps instance.
1. In the left menu, under **Application**, select **Containers**.
1. Select **Edit and deploy**.
1. Under **Container image**, click on the name of the existing container image.
1. Update the following settings:

    | Setting               | Suggested value                                                                                         | Description                                                                                                                                                                       |
    |-----------------------|---------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | Image source          | *Azure Container Registry*                                                                              | Select Azure Container Registry as your image source.                                                                                                                             |
    | Authentication        | *Admin Credentials*                                                                                     | Connect with the admin user credentials enabled in the Azure Container Registry.                                                                                                                             |
    | Registry              | *myregistry.azurecr.io*                                                                                 | Select the Azure Container Registry you created earlier.                                                                                                                          |
    | Image                 | *aspnetapp*                                                                                             | Select the docker image you created and pushed to ACR earlier.                                                                                                                    |
    | Image tag             | *v1*                                                                                                    | Select your image tag from the list.                                                                                                                                              |

1. Select **Save** and then **Create** to deploy the update to Azure Container App.

#### [Azure CLI](#tab/azure-cli)

When running the [az containerapp update](/cli/azure/containerapp#az-containerapp-update) command, refer to the following example:

```azurecli
az containerapp update \
    --name mycontainerapp \   
    --image myregistry.azurecr.io/aspnetapp:v1 \
    --resource-group AppConfigTestResources \
    --container-name mycontainer
```

| Parameter          | Suggested value                      | Description                                                           |
|--------------------|--------------------------------------|-----------------------------------------------------------------------|
| `--name`           | `mycontainerapp`                     | Enter the name of the Azure Container Apps instance.                  |
| `--image`          | `myregistry.azurecr.io/aspnetapp:v1` | Point to the container image in the format publisher/image-name:tag.  |
| `--resource-group` | `myresourcegroup`             | Enter the name of the resource group that contains the container app. |
| `--container-name` | `mycontainer`                        | Enter the name of the container.                                      |

---

## Browse to the URL of the Azure Container App

In the Azure portal, in the Azure Container Apps instance, go to the **Overview** tab and open the **Application Url**.

The web page looks like this:

:::image type="content" border="true" source="media\connect-container-app\web-display.png" alt-text="Screenshot of an internet browser displaying the app running.":::

## Clean up resources

[!INCLUDE [Azure App Configuration cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this quickstart, you:

- Created a basic Azure Container Apps instance
- Connected Azure Container Apps to Azure App Configuration
- Used Docker to build a container image from an ASP.NET Core app with App Configuration settings
- Created an Azure Container Registry instance
- Pushed the image to the Azure Container Registry instance
- Updated the Azure Container Apps instance with the image
- Browsed to the URL of the Azure Container Apps instance updated with the settings you configured in your App Configuration store.

To learn how to configure your ASP.NET Core web app to dynamically refresh configuration settings, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Enable dynamic configuration](./enable-dynamic-configuration-aspnet-core.md)
