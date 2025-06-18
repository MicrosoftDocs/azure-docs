---
title: 'Tutorial: Configure a sidecar for a custom container app'
description: Add sidecar containers to your custom container in Azure App Service. Add or update services to your application without changing your application container.
ms.topic: tutorial
ms.date: 06/18/2025
ms.author: cephalin
author: cephalin
keywords: azure app service, web app, linux, windows, docker, container, sidecar
---

# Tutorial: Configure a sidecar container for a custom container app

This tutorial shows you how to add an OpenTelemetry collector as a sidecar container to a Linux custom container app in Azure App Service.

[!INCLUDE [sidecar-overview](includes/tutorial-sidecar/sidecar-overview.md)]

For bring-your-own-code Linux apps, see [Tutorial: Configure a sidecar container for a Linux app in Azure App Service](tutorial-sidecar.md).

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]
- Run the commands in this tutorial by using Azure Cloud Shell, an interactive shell that you can use through your browser to work with Azure services. To use Cloud Shell:

  1. Select the following **Launch Cloud Shell** button or go to https://shell.azure.com to open Cloud Shell in your browser.

     :::image type="icon" source="~/reusable-content/ce-skilling/azure/media/cloud-shell/launch-cloud-shell-button.png" alt-text="Button to launch the Azure Cloud Shell." border="false" link="https://shell.azure.com":::

  1. Sign in to Azure if necessary, and make sure you're in the **Bash** environment of Cloud Shell.
  1. Select **Copy** in a code block, paste the code into Cloud Shell, and run it.

## 1. Set up the tutorial resources

To create the resources that this tutorial uses, run the following commands in Cloud Shell. When prompted, provide the Azure subscription and Azure region you want to use.

   ```bash
   git clone https://github.com/Azure-Samples/app-service-sidecar-tutorial-prereqs
   cd app-service-sidecar-tutorial-prereqs
   azd env new my-sidecar-env
   azd provision
    ```

The `azd provision` command uses the included templates to create the following Azure resources:

- A resource group called *my-sidecar-env_group*.
- A [container registry](/azure/container-registry/container-registry-intro) with two images deployed:
  - An Nginx image with the `OpenTelemetry` module.
  - An `OpenTelemetry` collector image, configured to export to [Azure Monitor](/azure/azure-monitor/overview).
- A [Log Analytics workspace](/azure/azure-monitor/logs/log-analytics-overview).
- An [Application Insights](/azure/azure-monitor/app/app-insights-overview) component.

When deployment completes, you should see the following output:

```bash
    APPLICATIONINSIGHTS_CONNECTION_STRING = InstrumentationKey=...;IngestionEndpoint=...;LiveEndpoint=...
    Open resource group in the portal: https://portal.azure.com/#@/resource/subscriptions/<your-subscription>/resourceGroups/my-sidecar-env_group
```

Open the resource group link in a browser tab. Take note of the connection string to use later.

## 2. Create a sidecar-enabled app

1. In the resource group's page in the Azure portal, select **Create**.
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

## 3. Add a sidecar container to the app

1. On the app's page in the Azure portal, select **Deployment Center** from the left navigation menu. The **Deployment Center** page shows the main app container.

1. Select **Add** and configure the new container as follows:
    - **Name**: *otel-collector*
    - **Image source**: **Azure Container Registry**
    - **Registry**: The registry created by `azd provision`
    - **Image**: **otel-collector**
    - **Tag**: **latest**

1. Select **Apply**.

    :::image type="content" source="media/tutorial-custom-container-sidecar/add-sidecar-container.png" alt-text="Screenshot showing how to configure a sidecar container in a web app's deployment center.":::

You should now see two containers in the deployment center labeled **Main** and **Sidecar**. An app must have one main container and can have multiple sidecar containers.

## 4. Configure environment variables

For the sample scenario, the otel-collector sidecar is configured to export the OpenTelemetry data to Azure Monitor using the connection string as an environment variable. For more information, see the [OpenTelemetry configuration file for the otel-collector image](https://github.com/Azure-Samples/app-service-sidecar-tutorial-prereqs/blob/main/images/otel-collector/otel-collector-config.yaml).

You configure environment variables for the containers like for any App Service app by configuring [app settings](configure-common.md#configure-app-settings). The app settings are accessible to all the containers in the app.
1. On the app's page in the Azure portal, select **Environment variables** from the left navigation menu.
1. On the **Environment variables** page, select **Add** to add an app setting.
1. Configure it as follows:
    - **Name**: *APPLICATIONINSIGHTS_CONNECTION_STRING*
    - **Value**: The connection string in the output of `azd provision`. If you lost the Cloud Shell session, you can also find it in the **Overview** page of the Application Insight resource, under **Connection String**.
1. Select **Apply**, then **Apply**, then **Confirm**.

   :::image type="content" source="media/tutorial-custom-container-sidecar/configure-app-settings.png" alt-text="Screenshot showing a web app's Configuration page with two app settings added.":::

> [!NOTE]
> Some app settings don't apply to sidecar-enabled apps. For more information, see [What are the differences for sidecar-enabled custom containers?](#what-are-the-differences-for-sidecar-enabled-custom-containers)

## 5. Verify in Application Insights

The `otel-collector` sidecar should export data to Application Insights now.

1. Go to the browser tab for `https://<app-name>.azurewebsites.net` and refresh the page a few times to generate some web requests.
1. On the resource group page in the Azure portal, select the **Application Insights** resource. You should now see some data in the default charts.

   :::image type="content" source="media/tutorial-custom-container-sidecar/app-insights-view.png" alt-text="Screenshot of the Application Insights page showing data in the default charts.":::

> [!NOTE]
> In this common monitoring scenario, Application Insights is just one of the OpenTelemetry targets you can use, such as Jaeger, Prometheus, and Zipkin.

## 6. Clean up resources

When you no longer need the environment, you can delete the resource group, app service, and all related resources. Run the following command in the cloned repository in Cloud Shell.

```azurecli
azd down
```

## Frequently asked questions

- [What are the differences for sidecar-enabled custom containers?](#what-are-the-differences-for-sidecar-enabled-custom-containers)
- [How do sidecar containers handle internal communication?](#how-do-sidecar-containers-handle-internal-communication)
- [Can a sidecar container receive internet requests?](#can-a-sidecar-container-receive-internet-requests)

### What are the differences for sidecar-enabled custom containers?

Sidecar-enabled apps are configured differently than apps that aren't sidecar-enabled.

- A sidecar-enabled app is designated by `LinuxFxVersion=sitecontainers` and configured with a [sitecontainers](/azure/templates/microsoft.web/sites/sitecontainers) resource. For more information, see [az webapp config set --linux-fx-version](/cli/azure/webapp/config).
- For non-sidecar enabled apps, container name and types are configured directly with `LinuxFxVersion=DOCKER|<image-details>`. For more information, see [az webapp config set --linux-fx-version](/cli/azure/webapp/config).

For non-sidecar enabled apps, the main container is configured with app settings such as:

- `DOCKER_REGISTRY_SERVER_URL`
- `DOCKER_REGISTRY_SERVER_USERNAME`
- `DOCKER_REGISTRY_SERVER_PASSWORD`
- `WEBSITES_PORT`

These settings don't apply for sidecar-enabled apps.

[!INCLUDE [common-faqs](includes/tutorial-sidecar/common-faqs.md)]

## Related resources

- [Configure custom container](configure-custom-container.md)
- [REST API: Web Apps - Create Or Update Site Container](/rest/api/appservice/web-apps/create-or-update-site-container)
- [Infrastructure as Code: Microsoft.Web sites/sitecontainers](/azure/templates/microsoft.web/sites/sitecontainers)
- [Deploy custom containers with GitHub Actions](deploy-container-github-action.md)
