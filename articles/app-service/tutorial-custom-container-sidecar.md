---
title: 'Tutorial: Configure a sidecar for a custom container app'
description: Add sidecar containers to your custom container in Azure App Service. Add or update services to your application without changing your application container.
ms.topic: tutorial
ms.date: 04/07/2024
ms.author: cephalin
author: cephalin
keywords: azure app service, web app, linux, windows, docker, container, sidecar
---

# Tutorial: Configure a sidecar container for custom container in Azure App Service

In this tutorial, you add an OpenTelemetry collector as a sidecar container to a Linux custom container app in Azure App Service. For bring-your-own-code Linux apps, see [Tutorial: Configure a sidecar container for a Linux app in Azure App Service](tutorial-sidecar.md).

In Azure App Service, you can add up to nine sidecar containers for each sidecar-enabled custom container app. Sidecar containers let you deploy extra services and features to your container application without making them tightly coupled to your main application container. For example, you can add monitoring, logging, configuration, and networking services as sidecar containers. An OpenTelemetry collector sidecar is one such monitoring example. 

For more information about side container in App Service, see:

- [Introducing Sidecars for Azure App Service for Linux: Now Generally Available](https://azure.github.io/AppService/2024/11/08/Global-Availability-Sidecars.html)
- [Announcing the general availability of sidecar extensibility in Azure App Service](https://techcommunity.microsoft.com/blog/appsonazureblog/announcing-the-general-availability-of-sidecar-extensibility-in-azure-app-servic/4267985)

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

## 1. Set up the needed resources

First you create the resources that the tutorial uses. They're used for this particular scenario and aren't required for sidecar containers in general.

1. In the [Azure Cloud Shell](https://shell.azure.com), run the following commands:

    ```azurecli-interactive
    git clone https://github.com/Azure-Samples/app-service-sidecar-tutorial-prereqs
    cd app-service-sidecar-tutorial-prereqs
    azd env new my-sidecar-env
    azd provision
    ```

1. When prompted, supply the subscription and region you want. For example:

    - Subscription: Your subscription.
    - Region: *(Europe) West Europe*.

    When deployment completes, you should see the following output:

    <pre>
    APPLICATIONINSIGHTS_CONNECTION_STRING = <b>InstrumentationKey=...;IngestionEndpoint=...;LiveEndpoint=...</b>

    Open resource group in the portal: <b>https://portal.azure.com/#@/resource/subscriptions/.../resourceGroups/...</b>
    </pre>

1. Open the resource group link in a browser tab. You'll need to use the connection string later.

    > [!NOTE]
    > `azd provision` uses the included templates to create the following Azure resources:
    > 
    > - A resource group called *my-sidecar-env_group*.
    > - A [container registry](/azure/container-registry/container-registry-intro) with two images deployed:
    >     - An Nginx image with the OpenTelemetry module.
    >     - An OpenTelemetry collector image, configured to export to [Azure Monitor](/azure/azure-monitor/overview).
    > - A [log analytics workspace](/azure/azure-monitor/logs/log-analytics-overview)
    > - An [Application Insights](/azure/azure-monitor/app/app-insights-overview) component
    
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

1. Select **Apply**.

    :::image type="content" source="media/tutorial-custom-container-sidecar/add-sidecar-container.png" alt-text="Screenshot showing how to configure a sidecar container in a web app's deployment center.":::

    You should now see two containers in the deployment center. The main container is marked **Main**, and the sidecar container is marked **Sidecar**. Each app must have one main container but can have multiple sidecar containers.

## 4. Configure environment variables

For the sample scenario, the otel-collector sidecar is configured to export the OpenTelemetry data to Azure Monitor, but it needs the connection string as an environment variable (see the [OpenTelemetry configuration file for the otel-collector image](https://github.com/Azure-Samples/app-service-sidecar-tutorial-prereqs/blob/main/images/otel-collector/otel-collector-config.yaml)).

You configure environment variables for the containers like any App Service app, by configuring [app settings](configure-common.md#configure-app-settings). The app settings are accessible to all the containers in the app.

1. In the app's management page, from the left menu, select **Environment variables**.

1. Add an app setting by selecting **Add** and configure it as follows:
    - **Name**: *APPLICATIONINSIGHTS_CONNECTION_STRING*
    - **Value**: The connection string in the output of `azd provision`. If you lost the Cloud Shell session, you can also find it in the **Overview** page of the Application Insight resource, under **Connection String**.

1. Select **Apply**, then **Apply**, then **Confirm**.

    :::image type="content" source="media/tutorial-custom-container-sidecar/configure-app-settings.png" alt-text="Screenshot showing a web app's Configuration page with two app settings added.":::

> [!NOTE]
> Certain app settings don't apply to sidecar-enabled apps. For more information, see [Differences for sidecar-enabled apps](#differences-for-sidecar-enabled-apps)

## 5. Verify in Application Insights

The otel-collector sidecar should export data to Application Insights now.

1. Back in the browser tab for `https://<app-name>.azurewebsites.net`, refresh the page a few times to generate some web requests.
1. Go back to the resource group overview page, then select the Application Insights resource. You should now see some data in the default charts.

    :::image type="content" source="media/tutorial-custom-container-sidecar/app-insights-view.png" alt-text="Screenshot of the Application Insights page showing data in the default charts.":::

> [!NOTE]
> In this very common monitoring scenario, Application Insights is just one of the OpenTelemetry targets you can use, such as Jaeger, Prometheus, and Zipkin.

## Clean up resources

When you no longer need the environment, you can delete the resource group, App service, and all related resources. Just run this command in the Cloud Shell, in the cloned repository:

```azurecli-interactive
azd down
```

## How do sidecar containers handle internal communication?

Sidecar containers share the same network host as the main container, so the main container (and other sidecar containers) can reach any port on the sidecar with `localhost:<port>`. This is exactly how the Nginx container sends data to the sidecar (see the [OpenTelemetry module configuration for the sample Nginx image](https://github.com/Azure-Samples/app-service-sidecar-tutorial-prereqs/blob/main/images/nginx/opentelemetry_module.conf)).

In the **Edit container** dialog, the **Port** box isn't currently used by App Service. You can use it as part of the sidecar metadata, such as to indicate which port the sidecar is listening to.

## Differences for sidecar-enabled apps

You configure sidecar-enabled apps differently than apps that aren't sidecar-enabled. Specifically, you don't configure the main container and sidecars with app settings, but directly in the resource properties. These app settings don't apply for sidecar-enabled apps:

- Registry authentication settings: `DOCKER_REGISTRY_SERVER_URL`, `DOCKER_REGISTRY_SERVER_USERNAME` and `DOCKER_REGISTRY_SERVER_PASSWORD`.
- Container port: `WEBSITES_PORT`

## More resources

- [Configure custom container](configure-custom-container.md)
- [Deploy custom containers with GitHub Actions](deploy-container-github-action.md)
- [OpenTelemetry](https://opentelemetry.io/)
