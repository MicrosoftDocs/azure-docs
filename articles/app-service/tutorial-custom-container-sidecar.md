---
title: 'Tutorial: Configure a sidecar for a custom container app'
description: Add sidecar containers to your custom container in Azure App Service to add or update application services without changing your main container.
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
- You can run the commands in this tutorial by using Azure Cloud Shell, an interactive shell you use through your browser to work with Azure services. To use Cloud Shell:

  1. Select the following **Launch Cloud Shell** button or go to https://shell.azure.com to open Cloud Shell in your browser.

     :::image type="icon" source="~/reusable-content/ce-skilling/azure/media/cloud-shell/launch-cloud-shell-button.png" alt-text="Button to launch the Azure Cloud Shell." border="false" link="https://shell.azure.com":::

  1. Sign in to Azure if necessary, and make sure you're in the **Bash** environment of Cloud Shell.
  1. Select **Copy** in any code block, paste the code into Cloud Shell, and run it.

     The `azd` commands in this tutorial use the [Azure Developer CLI](/azure/developer/azure-developer-cli/overview), an open-source tool that accelerates provisioning and deploying app resources on Azure.

## 1. Set up the tutorial resources

To clone the sample repository and create the resources for this tutorial, run the following commands in Cloud Shell. When prompted, select the Azure subscription and Azure region you want to use.

   ```bash
   git clone https://github.com/Azure-Samples/app-service-sidecar-tutorial-prereqs
   cd app-service-sidecar-tutorial-prereqs
   azd env new my-sidecar-env
   azd provision
   ```

The `azd provision` command uses the included templates to create an Azure resource group called `my-sidecar-env_group` that contains the following Azure resources:

- A [container registry](/azure/container-registry/container-registry-intro) with two repositories that have the following images:
  - An `nginx` image that has the OpenTelemetry module.
  - An `otel-collector` OpenTelemetry collector image configured to export to [Azure Monitor](/azure/azure-monitor/overview).
- A [Log Analytics](/azure/azure-monitor/logs/log-analytics-overview) workspace.
- An [Application Insights](/azure/azure-monitor/app/app-insights-overview) component.
- A user-assigned [managed identity](/entra/identity/managed-identities-azure-resources/overview) called `id-my-sidecar-env_group`.

When deployment completes, you should see output similar to the following example:

```output
Success!

APPLICATIONINSIGHTS_CONNECTION_STRING = InstrumentationKey=aaaaaaaa-0b0b-1c1c-2d2d-333333333333;IngestionEndpoint=https://eastus2-3.in.applicationinsights.azure.com/;LiveEndpoint=https://eastus2.livediagnostics.monitor.azure.com/;ApplicationId=00001111-aaaa-2222-bbbb-3333cccc4444
Azure container registry name = acro2lc774l6vjgg
Managed identity resource ID = /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/my-sidecar-env_group/providers/Microsoft.ManagedIdentity/userAssignedIdentities/id-my-sidecar-env_group
Managed identity client ID = 00aa00aa-bb11-cc22-dd33-44ee44ee44ee

Open resource group in the portal: https://portal.azure.com/#@/resource/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/my-sidecar-env_group
```

Copy and save the value for `APPLICATIONINSIGHTS_CONNECTION_STRING` to use later in this tutorial.

Select the link for `Open resource group in the portal` to open the provisioned resource group in the Azure portal.

## 2. Create a sidecar-enabled app

In the resource group in the Azure portal, create a Linux custom container app with sidecar support, and configure the main container.

1. On the resource group's page in the Azure portal, select **Create**.
1. On the **Marketplace** page, search for *web app*, select the down arrow next to **Create** on the **Web App** tile, and select **Web App**.

   :::image type="content" source="media/tutorial-custom-container-sidecar/create-web-app.png" alt-text="Screenshot showing Azure Marketplace page with web app being searched and create web app button highlighted.":::

1. On the **Basics** tab of the **Create Web App** page, provide the following information:
   - **Name**: Enter a unique name for the web app.
   - **Publish**: Select **Container**.
   - **Operating System**: Select **Linux**.
   - **Region**: Select the same region you chose for `azd provision`.
   - **Linux Plan**: Select the provided **(New)** App Service plan.

    :::image type="content" source="media/tutorial-custom-container-sidecar/create-wizard-basics-panel.png" alt-text="Screenshot showing the Basic settings for the Linux custom container web app.":::

1. Leave the rest of the settings as they are, and select the **Container** tab at the top of the page.

1. On the **Container** tab, provide the following information:
   - **Sidecar support**: Set to **Enhanced configuration with sidecar support on**.
   - **Image Source**: Select **Azure Container Registry**.
   - **Name**: Make sure **main** appears.
   - **Registry**: Select the registry created by `azd provision`.
   - **Authentication**: Select **Managed identity**.
   - **Identity**: Select the managed identity created by `azd provision`.
   - **Image**: Enter *nginx*.
   - **Tag**: Enter *latest*.
   - **Port**: Enter *80* if not already set.

    :::image type="content" source="media/tutorial-custom-container-sidecar/create-wizard-container-panel.png" alt-text="Screenshot showing the Container settings for the Linux custom container web app.":::

    > [!NOTE]
    > These settings are configured differently in sidecar-enabled apps than in apps not enabled for sidecars. For more information, see [What are the differences for sidecar-enabled custom containers](#what-are-the-differences-for-sidecar-enabled-custom-containers).

1. Select **Review + create**, and when validation passes, select **Create**.

1. Once the deployment completes, select **Go to resource**.

1. On your app's page, open the URL next to **Default domain**, `https://<app-name>.azurewebsites.net`, in a new browser tab to see the default **nginx** page.

## 3. Add a sidecar container to the app

Add a sidecar container to your Linux custom container app.

1. On the app's page in the Azure portal, select **Deployment Center** under **Deployment** in the left navigation menu. The **Deployment Center** page shows all the containers in the app, currently only the main container.

1. Select **Add** > **Custom container**.

1. On the **Add container** pane, complete the following information:
   - **Name**: Enter *otel-collector*.
   - **Image source**: Select **Azure Container Registry**.
   - **Registry**: Select the registry created by `azd provision`.
   - **Authentication**: Select **Managed Identity**.
   - **Identity**: Under **User assigned**, select the managed identity created by `azd provision`.
   - **Image**: Enter *otel-collector*.
   - **Image tag**: Enter *latest*.
   - **Port**: Enter *4317*.

1. Select **Apply**.

    :::image type="content" source="media/tutorial-custom-container-sidecar/add-sidecar-container.png" alt-text="Screenshot showing how to configure a sidecar container in a web app's deployment center.":::

There are now two containers in the deployment center labeled **Main** and **Sidecar**. An app must have one main container and can have multiple sidecar containers.

## 4. Configure environment variables

In the sample scenario, the `otel-collector` sidecar is configured to export the OpenTelemetry data to Azure Monitor using the connection string as an environment variable. For more information, see the [OpenTelemetry configuration file for the otel-collector image](https://github.com/Azure-Samples/app-service-sidecar-tutorial-prereqs/blob/main/images/otel-collector/otel-collector-config.yaml).

Configure the environment variable for the container by configuring [app settings](configure-common.md#configure-app-settings) for the app. App settings are accessible to all the containers in the app.

1. On the app's page in the Azure portal, select **Environment variables** under **Settings** in the left navigation menu.
1. On the **App settings** tab of the **Environment variables** page, select **Add**.
1. On the **Add/Edit application setting** pane, enter the following values:
   - **Name**: *APPLICATIONINSIGHTS_CONNECTION_STRING*
   - **Value**: The value of `APPLICATIONINSIGHTS_CONNECTION_STRING` from the output of `azd provision`. You can also find this value as **Connection String** on the **Overview** page of the resource group's Application Insight resource.
1. Select **Apply**, then select **Apply** again, and then select **Confirm**. The **APPLICATIONINSIGHTS_CONNECTION_STRING** app setting now appears on the **App settings** tab.

   :::image type="content" source="media/tutorial-custom-container-sidecar/configure-app-settings.png" alt-text="Screenshot showing a web app's Configuration page with two app settings added.":::

> [!NOTE]
> Some app settings don't apply to sidecar-enabled apps. For more information, see [What are the differences for sidecar-enabled custom containers](#what-are-the-differences-for-sidecar-enabled-custom-containers).

## 5. Verify in Application Insights

The `otel-collector` sidecar should now export data to Application Insights.

1. Go to your app in a new browser tab and refresh the page a few times to generate some web requests.
1. On the resource group page in the Azure portal, select the **Application Insights** resource. You should now see some data in the default charts on the Application Insights **Overview** page.

   :::image type="content" source="media/tutorial-custom-container-sidecar/app-insights-view.png" alt-text="Screenshot of the Application Insights page showing data in the default charts.":::

> [!NOTE]
> In this common monitoring scenario, Application Insights is just one of the OpenTelemetry targets you can use, such as Jaeger, Prometheus, and Zipkin.

## 6. Clean up resources

When you no longer need the environment you created for this tutorial, you can delete the resource group, which removes the app service and all related resources. Run the following command in the cloned repository in Cloud Shell.

```azurecli
azd down
```

## Frequently asked questions

- [What are the differences for sidecar-enabled custom containers?](#what-are-the-differences-for-sidecar-enabled-custom-containers)
- [How do sidecar containers handle internal communication?](#how-do-sidecar-containers-handle-internal-communication)
- [Can a sidecar container receive internet requests?](#can-a-sidecar-container-receive-internet-requests)
- [How do I use volume mounts?](#how-do-i-use-volume-mounts)

### What are the differences for sidecar-enabled custom containers?

Sidecar-enabled apps are configured differently than apps that aren't sidecar-enabled.

- Sidecar-enabled apps are designated by `LinuxFxVersion=sitecontainers` and configured with [`sitecontainers`](/azure/templates/microsoft.web/sites/sitecontainers) resources.
- Apps that aren't sidecar enabled configure the container name and type directly with `LinuxFxVersion=DOCKER|<image-details>`.

For more information, see [az webapp config set --linux-fx-version](/cli/azure/webapp/config).

Apps that aren't sidecar-enabled configure the main container with app settings such as:

- `DOCKER_REGISTRY_SERVER_URL`
- `DOCKER_REGISTRY_SERVER_USERNAME`
- `DOCKER_REGISTRY_SERVER_PASSWORD`
- `WEBSITES_PORT`

These settings don't apply for sidecar-enabled apps.

[!INCLUDE [common-faqs](includes/tutorial-sidecar/common-faqs.md)]

## Related resources

- [Configure custom container](configure-custom-container.md)
- [REST API: Web Apps - Create Or Update Site Container](/rest/api/appservice/web-apps/create-or-update-site-container)
- [Infrastructure as Code: Microsoft.Web sites/`sitecontainers`](/azure/templates/microsoft.web/sites/sitecontainers)
- [Deploy custom containers with GitHub Actions](deploy-container-github-action.md)
