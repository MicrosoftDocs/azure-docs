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

## Build the container

1. Navigate to the project folder *TestAppConfig* created in the ASP.NET quickstart.

1. Run the [dotnet publish](/dotnet/core/tools/dotnet-publish) command to build the app in release mode and create the assets in the *published* folder.

      ```dotnetcli
      dotnet publish -c Release -o published
      ```

1. Run the app.

    ```dotnetcli
    dotnet published/TestAppConfig.dll
    ```

1. Navigate to the URL displayed in the output to check that the deployment was successful. For example, `https://localhost:5001`

1. Create a file named *Dockerfile* in the directory containing your .csproj file, open it in a text editor and enter the content below. A Dockerfile is a text file that doesn't have an extension and that is used to create a container image.

    ```docker
    FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime
    WORKDIR /app
    COPY published/ ./
    ENTRYPOINT ["dotnet", "TestAppConfig.dll"]
    ```

### Run the container

1. Navigate to the folder containing the Dockerfile and build the container by running the command below

    ```bash
    docker build --tag aspnetapp .
    ```

1. Execute the container locally using the command below and replace `<connection-string>` with the connection string of your App Configuration store.

    ```bash
    docker run --detach --publish 8080:80 --name myapp aspnetapp --env AZURE_APPCONFIGURATION_CONNECTIONSTRING="<connection-string>"
    ```

    | Name        | Description                                                                                                                                            |
    |-------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
    | `--detach`  | Runs the container in the background and prints the container ID.                                                                                      |
    | `--name`    | Assigns a name to the container. In this example we run an aspnetapp container named myapp.                                                            |
    | `--env`     | Sets environment variables in the container. In this example, we set an environment variable for the connection string of the App Configuration store. |

    The command returns a long ID back.

1. Check if the container is running by executing the command `docker ps`. An output similar to the one below is displayed:

    ```output
    CONTAINER ID   IMAGE       COMMAND                  CREATED          STATUS          PORTS                  NAMES
    fd7ad0ef680e   aspnetapp   "dotnet aspnetapp.dl…"   05 minutes ago   Up 02 minutes   0.0.0.0:8080->80/tcp   myapp
    ```

1. Open an internet browser and navigate to `localhost:8080` to check if you can display your application.

    :::image type="content" border="true" source="media\connect-container-app\localhost-display.png" alt-text="Screenshot of an internet browser displaying the app running.":::

## Push the image to Azure Container Registry

In the next step, create an Azure Container Registry (ACR), where you'll push the Docker image. ACR enables you to build, store, and manage container images.

### Create a Container registry

#### [Portal](#tab/azure-portal)

1. Create a container registry following the [Azure Container Registry quickstart](/azure/container-registry/container-registry-get-started-portal).

1. Once the deployment is complete, open your ACR instance and from the left menu, select **Settings > Access keys**.
1. Take note of the **Login server** value listed on this page. You'll use this information in a later step.
1. Switch **Admin user** to *Enabled*. This option lets you connect the ACR to Azure Container Apps using admin user credentials.

#### [Azure CLI](#tab/azure-cli)

1. Create an ACR instance using the [az acr create](/cli/azure/acr#az-acr-create) command. The registry name must be unique within Azure, and contain 5-50 lowercase alphanumeric characters.

    ```azurecli
    az acr create --resource-group AppConfigTestResources \
      --name myregistry \
      --admin-enabled true \
      --sku Basic
    ```

    | Parameter          | Suggested value          | Description                                                                                                                         |
    |--------------------|--------------------------|-------------------------------------------------------------------------------------------------------------------------------------|
    | `--resource-group` | `AppConfigTestResources` | Enter the name of your resource group.                                                                                                         |
    | `--name`           | `myregistry`             | Enter a name of your container registry. The registry name must be unique within Azure, and contain 5-50 alphanumeric characters.   |
    | `--admin-enabled`  | `true`                   | Enter `true`to enable the option to connect the container registry to Azure Container Apps using admin user credentials. |
    | `--sku`            | `Basic`                  | Enter `Basic`. The basic tier is a cost-optimized entry point appropriate for lower usage scenarios.                                               |

1. In the command output, take note of the ACR login server value listed after `loginServer`.

1. Retrieve the ACR username and password by running `az acr credential show --name myregistry`. You'll need these values later.

---

### Push the Docker image to Azure Container Registry

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

## Create a Container App

In the next step, deploy the container image to [Azure Container Apps](../container-apps/overview.md). This Azure service enables you to run the containerized application created on a serverless platform.

#### [Portal](#tab/azure-portal)

Create a container app environment and a container app with your existing container image, following the [Azure Container Apps quickstart](/azure/container-apps/get-started-existing-container-image-portal). In the **App settings** tab, use the following configuration:

| Setting               | Suggested value                         | Description                                                                                                                                                                       |
|-----------------------|-----------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Use quickstart image  | Uncheck the box                         | Deselect quickstart image to use an existing container.                                                                                                                           |
| Name                  | *MyContainerApp*                        | The container app name you entered in the previous step is automatically filled in.                                                                                               |
| Image source          | *Azure Container Registry*              | Select Azure Container Registry as your image source.                                                                                                                             |
| Registry              | *myregistry.azurecr.io*                 | Select the Azure Container Registry you created earlier.                                                                                                                          |
| Image                 | *aspnetapp*                             | Select your docker image from the list.                                                                                                                                           |
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

#### [Azure CLI](#tab/azure-cli)

Create a container app environment and a container app with your existing container image, following the [Azure Container Apps quickstart](/azure/container-apps/get-started-existing-container-image).

When running the [az containerapp create](/cli/azure/containerapp#az-containerapp-create) command, refer to the following example:

```azurecli
az containerapp create \
    --image myregistry.azurecr.io/aspnetapp \
    --name mycontainerapp \
    --resource-group AppConfigTestResources \
    --environment MyContainerAppEnv \
    --registry-server myregistry.azurecr.io \
    --registry-username myregistry \
    --registry-password "<ACR-password>" \
```

| Parameter             | Suggested value                   | Description                                                                                          |
|-----------------------|-----------------------------------|------------------------------------------------------------------------------------------------------|
| `--image`             | `myregistry.azurecr.io/aspnetapp` | Enter the ACR's  log-in server value followed by `/` and the name of your image.      |
| `--name`              | `mycontainerapp`                  | Enter a name of your container app.                                                                  |
| `--resource-group`    | `AppConfigTestResources`          | Enter the name of your resource group.                                                               |
| `--environment`       | `MyContainerAppEnv`               | Enter the name of your Azure Container Apps Environment. |
| `--registry-server`   | `myregistry.azurecr.io`           | Enter the ACR's  login server value. |
| `--registry-username` | `myregistry`                      | Enter the name of your ACR. |
| `--registry-password` | `"<ACR-password>"`                | Enter one of the two passwords displayed in the output of the previous command. |

---

## Connect the container app to Azure App Configuration

In the next step, connect the container app to Azure App Configuration using [Service Connector](../service-connector/overview.md). Service Connector helps you to connect several Azure services together in a few steps without having to manage the configuration of the network settings and connection information yourself.

#### [Portal](#tab/azure-portal)

Connect the app to Azure App Configuration following the [Service Connector quickstart for Azure Container Apps](../service-connector/quickstart-portal-container-apps.md) and enter the following settings.

| Setting               | Suggested value       | Description                                                                                                            |
|-----------------------|-----------------------|------------------------------------------------------------------------------------------------------------------------|
| **Container**         | *mycontainerapp*      | Select your Container Apps instance.                                                                                   |
| **Service type**      | *App Configuration*   | Select *App Configuration* to connect to your App Configuration store to Azure Container Apps.                         |
| **Connection name**   | Generated unique name | A connection name is automatically generated. This name identifies the connection between your container app and the App Configuration store. |
| **Subscription**      | MySubscription        | Select the subscription containing the App Configuration store. The default value is the subscription for your container app. |
| **App Configuration** | *MyAppConfiguration*  | Select the name of the App Configuration store referenced in your app.                                                 |
| **Client type**       | *.NET*                | Select the application stack that works with the target service you selected.                                          |

1. Select **Next: Authentication** and select **Connection string**.
1. Select **Next: Network** to select the network configuration. Then select **Configure firewall rules to enable access to target service**.
1. Select **Next: Review + Create**  to review the provided information. Running the final validation takes a few seconds. Then select **Create** to create the service connection. It might take a minute or so to complete the operation.

#### [Azure CLI](#tab/azure-cli)

Run the Azure CLI command `az containerapp connection connection create` to create a service connection from the container app, using a system-assigned managed identity.

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

## Browse to the URL of the Azure Container App

In the Azure portal, browse to the container app you've created and in the **Overview** tab open the **Application URL**.

## Next steps

> [!div class="nextstepaction"]
> [Enable dynamic configuration](./enable-dynamic-configuration-aspnet-core.md)
