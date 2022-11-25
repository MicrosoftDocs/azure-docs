---
title: Connect a container app to App Configuration using Service Connector
description: Learn how to connect a containerized application to Azure App Configuration, using Service Connector.
services: azure-app-configuration
author: maud-lv
ms.service: azure-app-configuration
ms.topic: tutorial
ms.date: 11/17/2022
ms.author: malev

---

# Tutorial: Connect an ASP.NET Core 6 app to App Configuration using Service Connector

In this tutorial, you'll learn how to connect an container app to Azure App Configuration using Service Connector. This tutorial leverages the ASP.NET application created in [Quickstart: Create an ASP.NET Core app with App Configuration](./quickstart-aspnet-core-app.md). Complete this quickstart before you continue.

## Prerequisites

- An Azure subscription
- Docker CLI
- Complete the [Quickstart: Create an ASP.NET Core app with App Configuration](./quickstart-aspnet-core-app.md).

## Build a docker image and test it locally

### Clone the sample repository

Run the command below in your terminal to clone the sample Docker repository [Compose sample application: ASP.NET with MS SQL server database](https://docs.docker.com/samples/dotnet/#create-a-dockerfile-for-an-aspnet-core-application).

```bash
git clone https://github.com/docker/awesome-compose/
```

### Build and run the container

1. Navigate to the folder containing the Dockerfile used to build the container.

    ```bash
    cd awesome-compose/aspnet-mssql/app/aspnetapp
    ```

1. Build the container by running the command below

    ```bash
    docker build --tag aspnetapp .
    ```

1. Execute the container locally using the command below and replace `<connection-string>` with your own connection string.

    ```bash
    docker run –-detach –-publish 8080:80 --name myapp aspnetapp -env AZURE_APPCONFIGURATION_CONNECTIONSTRING="<connection-string>"
    ```

    | Name        | Description                                                                                                                                            |
    |-------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
    | `--detach`  | Runs the container in the background and prints the container ID.                                                                                      |
    | `--publish` | Publishes a container's port to the host. In this example, we expose port 8080 of the host machine and port 80 of the container.                       |
    | `--name`    | Assigns a name to the container. In this example we run an aspnetapp container named myapp.                                                            |
    | `--env`     | Sets environment variables in the container. In this example, we set an environment variable for the connection string of the App Configuration store. |

    The command returns a long ID back.

1. Check if the container is running by executing the command `docker ps`. An output similar to be one below is displayed:

    ```output
    CONTAINER ID   IMAGE       COMMAND                  CREATED          STATUS          PORTS                  NAMES
    fd7ad0ef680e   aspnetapp   "dotnet aspnetapp.dl…"   05 minutes ago   Up 02 minutes   0.0.0.0:8080->80/tcp   myapp
    ```

1. Open an internet browser and navigate to [localhost:8080](localhost:8080) to check if you can display your webpage.

    :::image type="content" border="true" source="media\connect-container-app\localhost-display.png" alt-text="Screenshot of an internet browser displaying the app running.":::

## Push the image to Azure Container Registry

In the next step, create an Azure Container Registry (ACR), where you'll push the Docker image. ACR enables you to build, store, and manage container images.

### Create a Container registry

#### [Portal](#tab/azure-portal)

1. Open the Azure portal and in the search bar, search for and select **Container Registries**.

    :::image type="content" border="true" source="media\connect-container-app\portal-container-registries.png" alt-text="Screenshot of the Azure portal showing how to find container registries.":::

1. Select **Create**
1. Fill out form in the **Basics** tab:

    | Setting        | Suggested value        | Description                                                                                                       |
    |----------------|------------------------|-------------------------------------------------------------------------------------------------------------------|
    | Subscription   | *MySubscription*         | Select your Azure subscription.                                                                                 |
    | Resource group | *AppConfigTestResources* | Select your resource group.                                                                                     |
    | Registry name  | *myregistry*             | Enter a registry name. The registry name must be unique within Azure, and contain 5-50 alphanumeric characters. |
    | Azure region   | *Central US*             | Select an Azure region.                                                                                         |
    | SKU            | *Basic*                  | The basic tier is a cost-optimized entry point appropriate for lower usage scenarios.                           |

    :::image type="content" border="true" source="media\connect-container-app\create-container-registry.png" alt-text="Screenshot of the Azure portal showing the first step to create a container registry.":::

1. Accept default values for the remaining setting, and select **Review + create**. After reviewing the settings, select **Create** to deploy the Azure Container Registry.
1. Once the deployment is complete, open your ACR instance and from the left menu, select **Settings > Access keys**.
1. Switch **Admin user** to *Enabled*. This option lets you connect the ACR to Azure Container Apps using admin user credentials.

    :::image type="content" border="true" source="media\connect-container-app\admin-user.png" alt-text="Screenshot of the Azure platform enabling admin user.":::

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
    | `--admin-enabled`  | `true`                   | Enter `true`to enable the option to connect to connect the container registry to Azure Container Apps using admin user credentials. |
    | `--sku`            | `Basic`                  | Enter `Basic`. The basic tier is a cost-optimized entry point appropriate for lower usage scenarios.                                               |

1. In the command output, take note of fully qualified registry name for your ACR listed for `loginServer`. You will use this information in a later step.

---

### Push the Docker image to Azure Container Registry

1. Run the [az acr login](/cli/azure/acr#az-acr-login) command to log in to the registry.

    ```azurecli-interactive
    az acr login --name myregistry
    ```

    The command returns `Login Succeeded` once login is successful.

1. Use [docker push](https://docs.docker.com/engine/reference/commandline/push/) to push the image to the container registry. This example creates the *aspnetapp* repository in ACR containing the `aspnetapp` image. In the example below, replace the placeholder `<registry-name>` by the ACR's fully qualified registry name.

    Method:

    ```bash
    docker push <registry-name>/<image-name>
    ```

    Example:

    ```bash
    docker push myregistry.azurecr.io/aspnetapp
    ```

## Create a Container App

In the next step, you will deploy the container image to [Azure Container Apps](../container-apps/overview.md). This Azure service enables you to run the containerized application created in this tutorial on a serverless platform.

#### [Portal](#tab/azure-portal)

1. In the Azure portal, search for **Container Apps** in the top search bar.

    :::image type="content" border="true" source="media\connect-container-app\portal-container-apps.png" alt-text="Screenshot of the Azure portal showing how to find Container Apps.":::

1. Select **Container Apps** in the search results and then **Create**.
1. In the **Basics** tab:

    | Setting                    | Suggested value          | Description                                                                                                     |
    |----------------------------|--------------------------|-----------------------------------------------------------------------------------------------------------------|
    | Subscription               | *MySubscription*         | Select your Azure subscription.                                                                                 |
    | Resource group             | *AppConfigTestResources* | Select your Resource group.                                                                                     |
    | Container app name         | *MyContainerApp*         | Enter a Registry name. The registry name must be unique within Azure, and contain 5-50 alphanumeric characters. |
    | Region                     | *Central US*             | Select an Azure region.                                                                                         |
    | Container Apps Environment | *MyEnvironment*          | Select a Container Apps Environment or create a new one.                                                        |

1. Select **Next: App settings** and fill out the form:

    | Setting               | Suggested value                         | Description                                                                                                                                                                       |
    |-----------------------|-----------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | Use quickstart image  | Uncheck the box                         | Deselect quickstart image to use an existing container.                                                                                                                           |
    | Name                  | *MyContainerApp*                        | The container app name you entered in the previous step is automatically filled in.                                                                                               |
    | Image source          | *Azure Container Registry*              | Select Azure Container Registry as your image source.                                                                                                                             |
    | Registry              | *myregistry.azurecr.io*                 | Select the Azure Container Registry you created earlier.                                                                                                                          |
    | Image                 | *aspnetapp*                             | Select your docker image from the list.                                                                                                                                           |
    | Image tag             | *latest*                                | Select your image tag from the list.                                                                                                                                              |
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

1. Select **Review + create**.
1. After reviewing the settings, select **Create** to deploy the container app.

#### [Azure CLI](#tab/azure-cli)

1. Install the Azure Container Apps CLI extension if you haven't used it before.

    ```azurecli-interactive
    az extension add --name containerapp --upgrade
    ```

1. Register the `Microsoft.App` namespace if you haven't used it before.

    ```azurecli-interactive
    az provider register --namespace Microsoft.App
    ```

1. Create a Container Apps environment using the [az containerapp env create](/cli/azure/containerapp#az-containerapp-env-create) command:

    ```azurecli
    az containerapp env create \
      --name MyContainerAppEnv \
      --resource-group AppConfigTestResources \
      --location centralus
    ```

1. Retrieve the ACR login information and take note of the username and password in the output for the next step:

   ```azurecli-interactive
    az acr credential show --name myregistry
    ```

1. Run the [az containerapp create](/cli/azure/containerapp#az-containerapp-create) command to create the Azure Container App:

    ```azurecli-interactive
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
    | `--image`             | `myregistry.azurecr.io/aspnetapp` | Enter the fully qualified registry name of your ACR followed by `/` and the name of your image.      |
    | `--name`              | `mycontainerapp`                  | Enter a name of your container app.                                                                  |
    | `--resource-group`    | `AppConfigTestResources`          | Enter the name of your resource group.                                                               |
    | `--environment`       | `MyContainerAppEnv`               | Enter the name of your Azure Container Apps Environment. |
    | `--registry-server`   | `myregistry.azurecr.io`           | Enter the fully qualified registry name of your ACR. |
    | `--registry-username` | `myregistry`                      | Enter the name of your ACR. |
    | `--registry-password` | `"<ACR-password>"`                | Enter one of the two passwords displayed in the output of the previous command. |

 ---

## Connect the app to Azure App Configuration

In the next step, connect the container app to Azure App Configuration using [Service Connector](../service-connector/overview.md). Service Connector helps you to connect several Azure services together in a few steps without having to manage the configuration of the network settings and connection information yourself.

#### [Portal](#tab/azure-portal)

1. Browse to your container app select **Service Connector (preview)** from the left table of contents.
1. Select **Create connection**.

    :::image type="content" border="true" source="media\connect-container-app\create-connection-service-connector.png" alt-text="Screenshot of the Azure portal, connecting cloud services with Service Connector.":::

1. Select or enter the following settings.

    | Setting               | Suggested value       | Description                                                                                                            |
    |-----------------------|-----------------------|------------------------------------------------------------------------------------------------------------------------|
    | **Container**         | *mycontainerapp*      | Select your Container Apps instance.                                                                                   |
    | **Service type**      | *App Configuration*   | Select *App Configuration* to connect to your App Configuration store to Azure Container Apps.                         |
    | **Subscription**      | MySubscription        | Select the subscription containing the App Configuration store. The default value is the subscription for your container app. |
    | **Connection name**   | Generated unique name | A connection name is automatically generated. This name identifies the connection between your container app and the App Configuration store. |
    | **App Configuration** | *MyAppConfiguration*  | Select the name of the App Configuration store to which you want to connect.                                                       |
    | **Client type**       | *.NET*                | Select the application stack that works with the target service you selected.                                                |

1. Select **Next: Authentication** and select **System assigned managed identity** to let Azure Directory manage the authentication.
1. Select **Next: Network** to select the network configuration. Then select **Configure firewall rules to enable access to target service**.
1. Select **Next: Review + Create**  to review the provided information. Running the final validation takes a few seconds. Then select **Create** to create the service connection. It might take a minute or so to complete the operation.

#### [Azure CLI](#tab/azure-cli)

1. Run the Azure CLI command `az containerapp connection connection create` to create a service connection from the container app, using a system-assigned managed identity.

    ```azurecli-interactive
    az containerapp connection create appconfig \
        --name mycontainerapp \ # the name of the container app
        --resource-group AppConfigTestResources \ # the resource group that contains the container app
        --container mycontainerapp \ #container where the connection information will be saved
        --target-resource-group AppConfigTestResources \ # the resource group that contains the App Configuration store
        --app-config MyAppConfiguration \  # the name of the App Configuration store
        --system-identity #the authentication method
    ```

    | Parameter                | Suggested value          | Description                                                                             |
    |--------------------------|--------------------------|-----------------------------------------------------------------------------------------|
    | `--name`                 | `mycontainerapp`         | Enter a name of the container app.                                                      |
    | `--resource-group`       | `AppConfigTestResources` | Enter the name of the resource group that contains the container app.                   |
    | `--container`            | `mycontainerapp`         | Enter the name of the container app.                                                    |
    | `--target-resource-group`| `AppConfigTestResources` | Enter the resource group that contains the App Configuration store.                     |
    | `--app-config`           | `MyAppConfiguration`     | Enter the name of the App Configuration store.                                          |
    | `--system-identity`      | Leave blank              | Enter ``--system-identity` to authenticate with with a system-assigned managed identity |

---

## Browse to the URL of the Azure Container App

In the Azure portal, browse to the container app you've created and in the **Overview** tab open the **Application URL**.

## Next steps

> [!div class="nextstepaction"]
> [Sync your GitHub repository to App Configuration](./concept-github-action.md)
