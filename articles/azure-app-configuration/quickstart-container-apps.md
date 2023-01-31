---
title: "Quickstart: Connect a container app to App Configuration"
description: Learn how to connect a containerized application to Azure App Configuration, using Service Connector.
services: azure-app-configuration
author: maud-lv
ms.service: azure-app-configuration
ms.topic: quickstart
ms.date: 01/11/2023
ms.author: malev

---

# Connect an ASP.NET Core 6 app to App Configuration using Service Connector

In this quickstart, learn how to connect a container app to Azure App Configuration using Service Connector. This quickstart leverages the ASP.NET application created in [Quickstart: Create an ASP.NET Core app with App Configuration](./quickstart-aspnet-core-app.md). Complete this quickstart before you continue.

## Prerequisites

- This quickstart assumes that you've completed the quickstart [Create an ASP.NET Core app with App Configuration](./quickstart-aspnet-core-app.md).
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- The [Azure CLI](/cli/azure/install-azure-cli)

## Create a container and a container registry

### Create an Azure Container Apps instance

Start by creating an [Azure Container Apps](../container-apps/overview.md) instance, where you'll host your app. This Azure service is designed to run containerized applications.

#### [Portal](#tab/azure-portal)

Create a container app environment and a container app following the [Azure Container Apps quickstart](/azure/container-apps/quickstart-portal). The created container app contains a default image.

#### [Azure CLI](#tab/azure-cli)

Create a container app environment and a container app with your existing container image, following the [Azure Container Apps quickstart](/azure/container-apps/get-started-existing-container-image).

When running the [az containerapp create](/cli/azure/containerapp#az-containerapp-create) command, refer to the following example:

Create a container app environment and a container app following the [Azure Container Apps quickstart](/azure/container-apps/get-started). The created container app contains a default image.

---

### Create an Azure Container Registry

Create an Azure Container Registry (ACR). ACR enables you to build, store, and manage container images.

#### [Portal](#tab/azure-portal)

1. Create a container registry following the [Azure Container Registry quickstart](/azure/container-registry/container-registry-get-started-portal).
1. Once the deployment is complete, open your ACR instance and from the left menu, select **Settings > Access keys**.
1. Take note of the **Login server** value listed on this page. You'll use this information in a later step.
1. Switch **Admin user** to *Enabled*. This option lets you connect the ACR to Azure Container Apps using admin user credentials.

#### [Azure CLI](#tab/azure-cli)

1. Create an ACR instance following the [Azure Container Registry quickstart](/azure/container-registry/container-registry-get-started-azure-cli).
1. In the command output, take note of the ACR login server value listed after `loginServer`.
1. Retrieve the ACR username and password by running `az acr credential show --name myregistry`. You'll need these values later.

---

## Connect the container app to Azure App Configuration

In the next step, connect the container app to Azure App Configuration using [Service Connector](../service-connector/overview.md). Service Connector helps you connect several Azure services together in a few steps without having to manage the configuration of the network settings and connection information yourself.

#### [Portal](#tab/azure-portal)

Connect the container app to Azure App Configuration following the [Service Connector quickstart for Azure Container Apps](../service-connector/quickstart-portal-container-apps.md). In **Next: Authentication**, select **Connection string**.

#### [Azure CLI](#tab/azure-cli)

Run the Azure CLI command `az containerapp connection connection create` to create a service connection from the container app, using a connection string.

 ```azurecli
 az containerapp connection create appconfig \
     --name mycontainerapp \ # the name of the container app
     --resource-group AppConfigTestResources \ # the resource group that contains the container app
     --container mycontainerapp \ #container where the connection information will be saved
     --target-resource-group AppConfigTestResources \ # the resource group that contains the App Configuration store
     --app-config MyAppConfiguration \  # the name of the App Configuration store
     --secret #the authentication method
 ```

 | Parameter                | Suggested value          | Description                                                                             |
 |--------------------------|--------------------------|-----------------------------------------------------------------------------------------|
 | `--name`                 | `mycontainerapp`         | Enter a name of the container app.                                                      |
 | `--resource-group`       | `AppConfigTestResources` | Enter the name of the resource group that contains the container app.                   |
 | `--container`            | `mycontainerapp`         | Enter the name of the container app.                                                    |
 | `--target-resource-group`| `AppConfigTestResources` | Enter the resource group that contains the App Configuration store.                     |
 | `--app-config`           | `MyAppConfiguration`     | Enter the name of the App Configuration store.                                          |
 | `--secret`               | Leave blank              | Enter `--secret` to authenticate with connection string                                 |

---

## Copy the variables shared by Service Connector

1. In your Azure Container Apps instance, in the Service Connector blade, select the **>** icon to expand information about your new connection to Azure App Configuration.
1. Note down the environment variable name displayed under **App Configuration**.
1. Select **Hidden value. Click to show value** and note down the connection string displayed.

## Update the app with the environment variable name

1. Navigate to the project folder *TestAppConfig* created in the ASP.NET quickstart.

1. In *program.cs*, replace

    #### [.NET 6.x](#tab/core6x)

    ```dotnetcli
    string connectionString = builder.Configuration.GetConnectionString("AppConfig");
    ```

    #### [.NET Core 3.x](#tab/core3x)

    ```dotnetcli
    string connectionString = settings.GetConnectionString("AppConfig");
    ```

    ---

by:

```dotnetcli
    string connectionString = Environment.GetEnvironmentVariable("<environment-variable>");
```

Don't forget to replace the placeholder `<environment-variable>`by the environment variable copied in the previous step.

## Build the container

1. Run the [dotnet publish](/dotnet/core/tools/dotnet-publish) command to build the app in release mode and create the assets in the *published* folder.

      ```dotnetcli
      dotnet publish -c Release -o published
      ```

1. Create a file named *Dockerfile* in the directory containing your .csproj file, open it in a text editor and enter the content below. A Dockerfile is a text file that doesn't have an extension and that is used to create a container image.

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

Push the Docker image to the ACR created in the quickstart.

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

#### [Portal](#tab/azure-portal)

1. Open your Azure Container Apps instance.
1. In the left menu, under **Application**, select **Containers**.
1. Select **Edit and deploy**.
1. Under **Container image**, select **Edit**.
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
| Environment variables | Leave empty                             | Leave empty.                                                                                                                                                                      |
| Ingress               | *Enabled*                               | Enable ingress and keep the automatically suggested settings: *Limited to Container Apps Environment*, *Ingress type* *HTTP*, *Transport*: Auto, *Insecure connections* disabled. |
| Ingress traffic       | *Limited to Container Apps Environment* | *Limited to Container Apps Environment* is selected by default. This is the type of inbound traffic that will be authorized.                                                      |
| Ingress type          | *HTTP*                                  | HTTP traffic is selected by default.                                                                                                                                              |
| Transport type        | *Auto*                                  | *Auto* is selected by default. Traffic load is automatically balanced.                                                                                                            |
| Insecure connections  | Leave unchecked                         | This box is unchecked by default. Insecure connections aren't allowed.                                                                                                            |
| Target port           | *80*                                    | Enter *80* as the value of the target port                                                                                                                                        |

1. Select **Create** to deploy the update to Azure Container App.

#### [Azure CLI](#tab/azure-cli)

Update the existing container app by adding the docker image you created and pushed to ACR earlier.

When running the [az containerapp up](/cli/azure/containerapp?view=azure-cli-latest#az-containerapp-up) command, refer to the following example:

```azurecli
az containerapp up \
    --name mycontainerapp \   
    --image myregistry.azurecr.io/aspnetapp:v1 \
    --registry-password abcd \
    --registry-server myregistry.azurecr.io \
    --registry-username myregistry
```

| Parameter             | Suggested value                   | Description                                                                                          |
|-----------------------|-----------------------------------|------------------------------------------------------------------------------------------------------|
| `--image`             | `myregistry.azurecr.io/aspnetapp:v1` | Point to the container image in the format publisher/image-name:tag.         |
| `--name`              | `mycontainerapp`                  | Enter the name of the container app.                                                                  |
| `--registry-server`   | `myregistry.azurecr.io`           | Enter the ACR's  login server value. |
| `--registry-username` | `myregistry`                      | Enter the name of your ACR. |
| `--registry-password` | `"<ACR-password>"`                | Enter one of the two passwords displayed in the output of the previous command. |

---

## Browse to the URL of the Azure Container App

In the Azure portal, browse to the container app you've created and in the **Overview** tab open the **Application URL**.

## Next steps

> [!div class="nextstepaction"]
> [Enable dynamic configuration](./enable-dynamic-configuration-aspnet-core.md)
