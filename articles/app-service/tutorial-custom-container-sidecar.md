---
title: 'Tutorial: Configure a sidecar container'
description: Add sidecar containers to your custom container in Azure App Service. Add or update services to your application without changing your application container.
ms.topic: tutorial
ms.date: 04/07/2024
ms.author: msangapu
author: msangapu-msft
keywords: azure app service, web app, linux, windows, docker, container, sidecar
---

# Tutorial: Configure a sidecar container for custom container in Azure App Service (preview)

In this tutorial, you add OpenTelemetry collector as a sidecar container to a Linux custom container app in Azure App Service. 

In Azure App Service, you can add up to 4 sidecar containers for each sidecar-enabled custom container app. Sidecar containers let you deploy extra services and features to your container application without making them tightly coupled to your main application container. For example, you can add monitoring, logging, configuration, and networking services as sidecar containers. An OpenTelemetry collector sidecar is one such monitoring example. 

For more information about sidecars, see [Sidecar pattern](/azure/architecture/patterns/sidecar).

> [!NOTE]
> For the preview period, sidecar support must be enabled at app creation. There's currently no way to enable sidecar support for an existing app.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## 1. Set up the needed resources

First you create the resources that the tutorial uses (for more information, see [Cloud Shell Overview](../cloud-shell/overview.md)). They're used for this particular scenario and aren't required for sidecar containers in general.

1. In the [Azure Cloud Shell](https://shell.azure.com), run the following commands:

    ```azurecli-interactive
    git clone https://github.com/Azure-Samples/app-service-sidecar-tutorial-prereqs
    cd app-service-sidecar-tutorial-prereqs
    azd provision
    ```

1. When prompted, supply the environment name, subscription, and region you want. For example:

    - Environment name: *my-sidecar-env*
    - Subscription: your subscription
    - Region: *(Europe) West Europe*

    When deployment completes, you should see the following output:

    <pre>
    APPLICATIONINSIGHTS_CONNECTION_STRING = <b>InstrumentationKey=...;IngestionEndpoint=...;LiveEndpoint=...</b>

    Open resource group in the portal: <b>https://portal.azure.com/#@/resource/subscriptions/.../resourceGroups/...</b>
    </pre>

1. Open the resource group link in a browser tab. You'll need to use the connection string later.

    > [!NOTE]
    > `azd provision` uses the included templates to create the following Azure resources:
    > 
    > - A resource group
    > - A [container registry](../container-registry/container-registry-intro.md) with two images deployed:
    >     - An Nginx image with the OpenTelemetry module.
    >     - An OpenTelemetry collector image, configured to export to [Azure Monitor](../azure-monitor/overview.md).
    > - A [log analytics workspace](../azure-monitor/logs/log-analytics-overview.md)
    > - An [Application Insights](../azure-monitor/app/app-insights-overview.md) component
    
## 2. Create a sidecar-enabled app

1. In the resource group's management page, select **Create**.
1. Search for *web app*, then select the down arrow on **Create** and select **Web App**.

    :::image type="content" source="media/tutorial-custom-container-sidecar/create-web-app.png" alt-text="Screenshot showing the Azure Marketplace page with the web app being searched and create web app buttons being clicked.":::

1. Configure the **Basics** panel as follows:
    - **Name**: A unique name
    - **Publish**: **Container**
    - **Operating System**: **Linux**
    - **Region**: Same region as the one you chose with `azd provision`
    - **Linux Plan**: A new App Service plan

    :::image type="content" source="media/tutorial-custom-container-sidecar/create-wizard-basics-panel.png" alt-text="Screenshot showing the web app create wizard and settings for a Linux custom container app highlighted.":::

1. Select **Container**. Configure the **Container** panel as follows:
    - **Sidecar support**: **Enabled**
    - **Image Source**: **Azure Container Registry**
    - **Registry**: The registry created by `azd provision`
    - **Image**: **nginx**
    - **Tag**: **latest**
    - **Port**: **80**

    :::image type="content" source="media/tutorial-custom-container-sidecar/create-wizard-container-panel.png" alt-text="Screenshot showing the web app create wizard and settings for the container image and the sidecar support highlighted.":::

    > [!NOTE]
    > These settings are configured differently in sidecar-enabled apps. For more information, see [Differences for sidecar-enabled apps](#differences-for-sidecar-enabled-apps).

1. Select **Review + create**, then select **Create**.

1. Once the deployment completes, select **Go to resource**.

1. In a new browser tab, navigate to `https://<app-name>.azurewebsites.net` and see the default Nginx page.

## 3. Add a sidecar container

In this section, you add a sidecar container to your custom container app.

1. In the app's management page, from the left menu, select **Deployment Center**.

    The deployment center shows you all the containers in the app. Right now, it only has the main container.

1. Select **Add** and configure the new container as follows:
    - **Name**: *otel-collector*
    - **Image source**: **Azure Container Registry**
    - **Registry**: The registry created by `azd provision`
    - **Image**: **otel-collector**
    - **Tag**: **latest**
    - **Port**: **4317**

    Port 4317 is the default port used by the sample container to receive OpenTelemetry data. It's accessible from any other container in the app at `localhost:4317`. This is exactly how the Nginx container sends data to the sidecar (see the [OpenTelemetry module configuration for the sample Nginx image](https://github.com/Azure-Samples/app-service-sidecar-tutorial-prereqs/blob/main/images/nginx/opentelemetry_module.conf)).

1. Select **Apply**.

    :::image type="content" source="media/tutorial-custom-container-sidecar/add-sidecar-container.png" alt-text="Screenshot showing how to configure a sidecar container in a web app's deployment center.":::

    You should now see two containers in the deployment center. The main container is marked **Main**, and the sidecar container is marked **Sidecar**. Each app must have one main container but can have multiple sidecar containers.

## 4. Configure environment variables

For the sample scenario, the otel-collector sidecar is configured to export the OpenTelemetry data to Azure Monitor, but it needs the connection string as an environment variable (see the [OpenTelemetry configuration file for the otel-collector image](https://github.com/Azure-Samples/app-service-sidecar-tutorial-prereqs/blob/main/images/otel-collector/otel-collector-config.yaml)).

You configure environment variables for the containers like any App Service app, by configuring [app settings](configure-common.md#configure-app-settings). The app settings are accessible to all the containers in the app.

1. In the app's management page, from the left menu, select **Configuration**.

1. Add an app setting by selecting **New application setting** and configure it as follows:
    - **Name**: *APPLICATIONINSIGHTS_CONNECTION_STRING*
    - **Value**: The connection string in the output of `azd provision`

1. Select **Save**, then select **Continue**.

    :::image type="content" source="media/tutorial-custom-container-sidecar/configure-app-settings.png" alt-text="Screenshot showing a web app's Configuration page with two app settings added.":::

> [!NOTE]
> Certain app settings don't apply to sidecar-enabled apps. For more information, see [Differences for sidecar-enabled apps](#differences-for-sidecar-enabled-apps)

## 5. Verify in Application Insights

The otel-collector sidecar should export data to Application Insights now.

1. Back in the browser tab for `https://<app-name>.azurewebsites.net`, refresh the page a few times to generate some web requests.
1. Go back to the resource group overview page, select the Application Insights resource. You should now see some data in the default charts.

    :::image type="content" source="media/tutorial-custom-container-sidecar/app-insights-view.png" alt-text="Screenshot of the Application Insights page showing data in the default charts.":::

> [!NOTE]
> In this very common monitoring scenario, Application Insights is just one of the OpenTelemetry targets you can use, such as Jaeger, Prometheus, and Zipkin.

## Clean up resources

When you no longer need the environment, you can delete the resource group, App service, and all related resources. Just run this command in the Cloud Shell, in the cloned repository:

```azurecli-interactive
azd down
```

## Differences for sidecar-enabled apps

You configure sidecar-enabled apps differently than apps that aren't sidecar-enabled. Specifically, you don't configure the main container and sidecars with app settings, but directly in the resource properties. These app settings don't apply for sidecar-enabled apps:

- Registry authentication settings: `DOCKER_REGISTRY_SERVER_URL`, `DOCKER_REGISTRY_SERVER_USERNAME` and `DOCKER_REGISTRY_SERVER_PASSWORD`.
- Container port: `WEBSITES_PORT`

## More resources

- [Configure custom container](configure-custom-container.md)
- [Deploy custom containers with GitHub Actions](deploy-container-github-action.md)
- [OpenTelemetry](https://opentelemetry.io/)
