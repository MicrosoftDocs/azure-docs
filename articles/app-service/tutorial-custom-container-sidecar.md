---
title: 'Tutorial: Configure a sidecar for a custom container app'
description: Add sidecar containers to your custom container in Azure App Service. Add or update services to your application without changing your application container.
ms.topic: tutorial
ms.date: 05/07/2025
ms.author: cephalin
author: cephalin
keywords: azure app service, web app, linux, windows, docker, container, sidecar
---

# Tutorial: Configure a sidecar container for custom container in Azure App Service

In this tutorial, you add an OpenTelemetry collector as a sidecar container to a Linux custom container app in Azure App Service. For bring-your-own-code Linux apps, see [Tutorial: Configure a sidecar container for a Linux app in Azure App Service](tutorial-sidecar.md).

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

[!INCLUDE [sidecar-overview](includes/tutorial-sidecar/sidecar-overview.md)]

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
    > These settings are configured differently in sidecar-enabled apps. For more information, see [What are the differences for sidecar-enabled custom containers?](#what-are-the-differences-for-sidecar-enabled-custom-containers).

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
> Certain app settings don't apply to sidecar-enabled apps. For more information, see [What are the differences for sidecar-enabled custom containers?](#what-are-the-differences-for-sidecar-enabled-custom-containers)
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

## Frequently asked questions

- [What are the differences for sidecar-enabled custom containers?](#what-are-the-differences-for-sidecar-enabled-custom-containers)
- [How do sidecar containers handle internal communication?](#how-do-sidecar-containers-handle-internal-communication)
- [Can a sidecar container receive internet requests?](#can-a-sidecar-container-receive-internet-requests)

### What are the differences for sidecar-enabled custom containers?

You configure sidecar-enabled apps differently than apps that aren't sidecar-enabled.

#### Not sidecar-enabled

- Container name and types are configured directly with `LinuxFxVersion=DOCKER|<image-details>` (see [az webapp config set --linux-fx-version](/cli/azure/webapp/config)).
- The main container is configured with app settings, such as:
    - `DOCKER_REGISTRY_SERVER_URL`
    - `DOCKER_REGISTRY_SERVER_USERNAME`
    - `DOCKER_REGISTRY_SERVER_PASSWORD`
    - `WEBSITES_PORT`

#### Sidecar-enabled

- A sidecar-enabled app is designated by `LinuxFxVersion=sitecontainers` (see [az webapp config set --linux-fx-version](/cli/azure/webapp/config)).
- The main container is configured with a [sitecontainers](/azure/templates/microsoft.web/sites/sitecontainers) resource. These settings don't apply for sidecar-enabled apps
    - `DOCKER_REGISTRY_SERVER_URL`
    - `DOCKER_REGISTRY_SERVER_USERNAME`
    - `DOCKER_REGISTRY_SERVER_PASSWORD`
    - `WEBSITES_PORT`

[!INCLUDE [common-faqs](includes/tutorial-sidecar/common-faqs.md)]

## More resources

- [Configure custom container](configure-custom-container.md)
- [REST API: Web Apps - Create Or Update Site Container](/rest/api/appservice/web-apps/create-or-update-site-container)
- [Infrastructure as Code: Microsoft.Web sites/sitecontainers](/azure/templates/microsoft.web/sites/sitecontainers)
- [Deploy custom containers with GitHub Actions](deploy-container-github-action.md)
