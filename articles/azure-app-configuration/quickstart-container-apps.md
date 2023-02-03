---
title: "Quickstart: Connect a container app to App Configuration"
description: Learn how to connect a containerized application to Azure App Configuration, using Service Connector.
services: azure-app-configuration
author: maud-lv
ms.service: azure-app-configuration
ms.topic: quickstart
ms.date: 02/02/2023
ms.author: malev

---

# Connect an ASP.NET Core app to App Configuration using Service Connector

In this quickstart, learn how to connect a container app to Azure App Configuration using Service Connector. This quickstart leverages the ASP.NET application created in [Quickstart: Create an ASP.NET Core app with App Configuration](./quickstart-aspnet-core-app.md). Complete this quickstart before you continue.

> [!TIP]
> While following this quickstart, preferably register all new resources within a single resource group, so that you can regroup them all in a single place and delete them faster later on if you don't need them anymore.

## Prerequisites

- This quickstart assumes that you've completed the quickstart [Create an ASP.NET Core app with App Configuration](./quickstart-aspnet-core-app.md).
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- The [Azure CLI](/cli/azure/install-azure-cli)

## Create a container app and a container registry

### Create an Azure Container Apps instance

Start by creating a basic [Azure Container Apps](../container-apps/overview.md) instance and a Container Apps environment, where you'll later host your app.

This Azure service is designed to run containerized applications.

#### [Portal](#tab/azure-portal)

To create the container app and container apps environment using the Azure portal, follow the [Azure Container Apps quickstart](/azure/container-apps/quickstart-portal).

#### [Azure CLI](#tab/azure-cli)

To create the container app and container apps environment using the Azure CLI, follow the [Azure Container Apps quickstart](/azure/container-apps/get-started). The created container app contains a default image.

---

### Create an Azure Container Registry instance

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

## Connect Azure Container Apps to Azure App Configuration

In the next step, connect the container app to Azure App Configuration using [Service Connector](../service-connector/overview.md). Service Connector helps you connect several Azure services together in a few steps without having to manage the configuration of the network settings and connection information yourself.

#### [Portal](#tab/azure-portal)

Connect the container app to Azure App Configuration following the [Service Connector quickstart for Azure Container Apps](../service-connector/quickstart-portal-container-apps.md). While following the steps of the quickstart, in **Next: Authentication**, select **Connection string**.

#### [Azure CLI](#tab/azure-cli)

Run the Azure CLI command `az containerapp connection connection create` to create a service connection from the container app, using a connection string.

 ```azurecli
 az containerapp connection create appconfig \
     --name mycontainerapp \ # the name of the container app
     --resource-group myresourcegroup \ # the resource group that contains the container app
     --container simple-hello-world-container \ #container where the connection information will be saved
     --target-resource-group AppConfigTestResources \ # the resource group that contains the App Configuration store
     --app-config MyAppConfiguration \  # the name of the App Configuration store
     --secret #the authentication method
 ```

 | Parameter                | Suggested value          | Description                                                                             |
 |--------------------------|--------------------------|-----------------------------------------------------------------------------------------|
 | `--name`                 | `mycontainerapp`         | Enter the name of the container app.                                                      |
 | `--resource-group`       | `myresourcegroup` | Enter the name of the resource group that contains the container app.                   |
 | `--container`            | `mycontainerapp`         | Enter the name of the container app.                                                    |
 | `--target-resource-group`| `AppConfigTestResources` | Enter the resource group that contains the App Configuration store.                     |
 | `--app-config`           | `MyAppConfiguration`     | Enter the name of the App Configuration store.                                          |
 | `--secret`               | Leave blank              | Enter `--secret` to authenticate with connection string                                 |

---

## Copy the variables shared by Service Connector

1. In your Azure Container Apps instance, in the Service Connector blade, select **>** to expand information about your new connection to Azure App Configuration.
1. Note down the environment variable name displayed under **App Configuration**.
1. Select **Hidden value. Click to show value** and note down the connection string displayed.

## Update the app with the environment variable name

1. Navigate to the project folder *TestAppConfig* created in the ASP.NET quickstart.

1. In *program.cs*, replace ...

    #### [.NET 6.x](#tab/core6x)

    ```dotnetcli
    string connectionString = builder.Configuration.GetConnectionString("AppConfig");
    ```

    #### [.NET Core 3.x](#tab/core3x)

    ```dotnetcli
    string connectionString = settings.GetConnectionString("AppConfig");
    ```

    ---

    ... by the following code. Don't forget to replace the placeholder `<environment-variable>` by the environment variable copied in the previous step.

    ```dotnetcli
        string connectionString = Environment.GetEnvironmentVariable("<environment-variable>");
    ```

## Build the container

1. Run the [dotnet publish](/dotnet/core/tools/dotnet-publish) command to build the app in release mode and create the assets in the *published* folder.

      ```dotnetcli
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

    ```bash
    docker build --tag aspnetapp .
    ```

## Push the image to Azure Container Registry

Push the Docker image to the ACR created earlier.

1. Run the [az acr login](/cli/azure/acr#az-acr-login) command to log in to the registry.

    ```azurecli
    az acr login --name myregistry
    ```

    The command returns `Login Succeeded` once login is successful.

1. 1. Use [docker tag](https://docs.docker.com/engine/reference/commandline/tag/) to tag the image with the ACR name

    ```azurecli
    docker tag aspnetapp myregistry.azurecr.io/aspnetapp:v1
    ```

    > [!TIP]
    > To review the list of your existing docker images and tags, run `docker image ls`.

1. Use [docker push](https://docs.docker.com/engine/reference/commandline/push/) to push the image to the container registry. This example creates the *aspnetapp* repository in ACR containing the `aspnetapp` image. In the example below, replace the placeholders `<login-server`, `<image-name>` and `<tag>` by the ACR's log-in server value, the image name and the image tag.

    Method:

    ```bash
    docker push <login-server>/<image-name>:<tag>
    ```

    Example:

    ```bash
    docker push myregistry.azurecr.io/aspnetapp:v1
    ```

## Add your container image to Azure Container Apps

Update the existing container app by importing the docker image you created and pushed to ACR earlier.

#### [Portal](#tab/azure-portal)

1. Open your Azure Container Apps instance.
1. In the left menu, under **Application**, select **Containers**.
1. Select **Edit and deploy**.
1. Under **Container image**, select the existing container image and select **Edit**.
1. Use the following configuration:

| Setting               | Suggested value                         | Description                                                                                                                                                                       |
|-----------------------|-----------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Name                  | *MyContainerImage*                        | The name of the existing container image is displayed. Optionally edit it.                                                                                               |
| Image source          | *Azure Container Registry*              | Select Azure Container Registry as your image source.                                                                                                                             |
| Registry              | *myregistry.azurecr.io*                 | Select the Azure Container Registry you created earlier.                                                                                                                          |
| Image                 | *aspnetapp*                             | Select the docker image you created and pushed to ACR earlier.                                                                                                                                           |
| Image tag             | *v1*                                    | Select your image tag from the list.                                                                                                                                              |
| OS type               | *Linux*                                 | Linux is automatically suggested.                                                                                                                                                 |
| Command override      | Leave empty                             | Optional. Leave this field empty.                                                                                                                                                 |
| CPU and memory        | 0.25 CPU cores, 0.5 Gi memory           | CPU and memory selected by default.                                                                                                                                               |
| Environment variables | Name: AZURE_APPCONFIGURATION_CONNECTIONSTRING; Source: Reference a secret; Value azure-appconfiguration-connectionstring-acbd                             | Enter the App Configuration environment variable copied earlier, select **Reference a secret** and select the secret from the drop-down menu.                                                                                                                                                                      |
| Ingress               | *Enabled*                               | Enable ingress and keep the automatically suggested settings: *Limited to Container Apps Environment*, *Ingress type* *HTTP*, *Transport*: Auto, *Insecure connections* disabled. |
| Ingress traffic       | *Limited to Container Apps Environment* | *Limited to Container Apps Environment* is selected by default. This is the type of inbound traffic that will be authorized.                                                      |
| Ingress type          | *HTTP*                                  | HTTP traffic is selected by default.                                                                                                                                              |
| Transport type        | *Auto*                                  | *Auto* is selected by default. Traffic load is automatically balanced.                                                                                                            |
| Insecure connections  | Leave unchecked                         | This box is unchecked by default. Insecure connections aren't allowed.                                                                                                            |
| Target port           | *80*                                    | Enter *80* as the value of the target port                                                                                                                                        |

1. Select **Create** to deploy the update to Azure Container App.

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

- Created basic Azure Container App and Azure Container Registry instances
- Connected the container app to Azure App Configuration
- Used Docker to build a container image from an ASP.NET Core app with App Configuration settings
- Pushed the image to the Azure Container Registry instance
- Updated the Azure Container Apps instance with the image
- Browsed to the URL of the Azure Container App updated with the settings you configured in your App Configuration store.

To learn how to configure your ASP.NET Core web app to dynamically refresh configuration settings, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Enable dynamic configuration](./enable-dynamic-configuration-aspnet-core.md)
