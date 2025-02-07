---
title: 'Tutorial: Configure a sidecar container'
description: Add sidecar containers to your Linux app in Azure App Service. Add or update services to your application without changing your application code.
ms.topic: tutorial
ms.date: 11/19/2024
ms.author: cephalin
author: cephalin
keywords: azure app service, web app, linux, windows, docker, sidecar
---

# Tutorial: Configure a sidecar container for a Linux app in Azure App Service

In this tutorial, you add an OpenTelemetry collector as a sidecar container to a Linux (bring-your-own-code) app in Azure App Service. For custom containers, see [Tutorial: Configure a sidecar container for custom container in Azure App Service](tutorial-custom-container-sidecar.md).

In Azure App Service, you can add up to nine sidecar containers for each Linux app. Sidecar containers let you deploy extra services and features to your Linux apps without making them tightly coupled to the main (built-in) container. For example, you can add monitoring, logging, configuration, and networking services as sidecar containers. An OpenTelemetry collector sidecar is one such monitoring example. 

For more information about side container in App Service, see:

- [Introducing Sidecars for Azure App Service for Linux: Now Generally Available](https://azure.github.io/AppService/2024/11/08/Global-Availability-Sidecars.html)
- [Announcing the general availability of sidecar extensibility in Azure App Service](https://techcommunity.microsoft.com/blog/appsonazureblog/announcing-the-general-availability-of-sidecar-extensibility-in-azure-app-servic/4267985)

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

## 1. Set up the needed resources

First you create the resources that the tutorial uses. They're used for this particular scenario and aren't required for sidecar containers in general.

1. In the [Azure Cloud Shell](https://shell.azure.com), run the following commands. Be sure to supply the `<environment-name>`.

    ```azurecli-interactive
    git clone https://github.com/Azure-Samples/app-service-sidecar-tutorial-prereqs
    cd app-service-sidecar-tutorial-prereqs
    azd env new <environment-name>
    azd provision
    ```

1. When prompted, supply the subscription and region of your choice. For example:

    - Subscription: Your subscription.
    - Region: *(Europe) West Europe*.

    When deployment completes, you should see the following output:

    <pre>
    APPLICATIONINSIGHTS_CONNECTION_STRING = <b>InstrumentationKey=...;IngestionEndpoint=...;LiveEndpoint=...</b>
    Azure container registry name = <b>&lt;registry-name&gt;</b>
    Managed identity resource ID = <b>&lt;managed-identity-resource-id&gt;</b>
    Managed identity client ID = <b>&lt;managed-identity-client-id&gt;</b>
    
    Open resource group in the portal: <b>https://portal.azure.com/#@/resource/subscriptions/&lt;subscription-id&gt;/resourceGroups/&lt;group-name&gt;</b>
    </pre>

1. Copy these output values for later. You can also find them in the portal, in the management pages of the respective resources. 

    > [!NOTE]
    > `azd provision` uses the included templates to create the following Azure resources:
    > 
    > - A resource group based on the environment name.
    > - A [container registry](/azure/container-registry/container-registry-intro) with two images deployed:
    >     - An Nginx image with the OpenTelemetry module.
    >     - An OpenTelemetry collector image, configured to export to [Azure Monitor](/azure/azure-monitor/overview).
    > - A user-assigned managed identity with the `AcrPull` permission on the resource group (to pull images from the registry).
    > - A [log analytics workspace](/azure/azure-monitor/logs/log-analytics-overview).
    > - An [Application Insights](/azure/azure-monitor/app/app-insights-overview) component.
    
## 2. Create a web app

In this step, you deploy a template ASP.NET Core application. Back in the [Azure Cloud Shell](https://shell.azure.com), run the following commands. Replace `<app-name>` with a unique app name.

```dotnetcli
cd ~
dotnet new webapp -n MyFirstAzureWebApp --framework net8.0
cd MyFirstAzureWebApp
az webapp up --name <app-name> --os-type linux
```

After a few minutes, this .NET web application is deployed as MyFirstAzureWebApp.dll to a new App Service app.

## 3. Add a sidecar container

In this section, you add a sidecar container to your Linux app. The portal experience is still being rolled out. If it's not available to you yet, continue with the **Use ARM template** tab below.

### [Use portal UI](#tab/portal) 

1. In the [Azure portal](https://portal.azure.com), navigate to the app's management page
1. In the app's management page, from the left menu, select **Deployment Center**.
1. Select the banner **Interested in adding containers to run alongside your app? Click here to give it a try.**
    
    If you can't see the banner, then the portal UI isn't rolled out for your subscription yet. Select the **Use ARM template** tab here instead and continue.

1. When the page reloads, select the **Containers (new)** tab.
1. Select **Add** and configure the new container as follows:
    - **Name**: *otel-collector*
    - **Image source**: **Azure Container Registry**
    - **Authentication**: **Admin Credentials**
    - **Registry**: The registry created by `azd provision`
    - **Image**: **otel-collector**
    - **Tag**: **latest**

1. Select **Apply**.

    :::image type="content" source="media/tutorial-sidecar/add-sidecar-container.png" alt-text="Screenshot showing how to configure a sidecar container in a web app's deployment center.":::

### [Use ARM template](#tab/template) 

1. In the Cloud Shell, run the following command to add to the web app the user-assigned managed identity that `azd provision` created. Use the value of `<managed-identity-resource-id>` (a very long string) in the `azd provision` output.

    ```azurecli-interactive
    az webapp identity assign --identities <managed-identity-resource-id>
    ```

    If you run this command inside *~/MyFirstAzureWebApp*, you don't need to add any other parameters because `az webapp up` set defaults already for the resource group and the app name. 

1. Navigate to the [custom deployment](https://portal.azure.com/#create/Microsoft.Template) template in the portal.

1. Select **Build your own template in the editor**.

1. Replace the content in the textbox with the following JSON code and select **Save**. For `<registry-name>` and `<managed-identity-client-id>`, use the output values from `azd provision` earlier. For `<app-name>`, use the app name in `az webapp up earlier`. For `<sidecar-name>`, supply a name for the sidecar container.

    ```json
    {
        "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "resources": [
            {
                "type": "Microsoft.Web/sites/sitecontainers",
                "apiVersion": "2024-04-01",
                "name": "<app-name>/<sidecar-name>",
                "properties": {
                    "image": "<registry-name>.azurecr.io/otel-collector:latest",
                    "isMain": false,
                    "authType": "UserAssigned",
                    "userManagedIdentityClientId": "<managed-identity-client-id>",
                    "volumeMounts": [],
                    "environmentVariables": []
                }
            }
        ]
    }
    ```

    > [!TIP]
    > To use a container in a public registry, modify `properties` like the following example:
    >
    > ```json
    > "properties": {
    >     "image": "mcr.microsoft.com/appsvc/docs/sidecars/sample-experiment:otel-appinsights-1.0",
    >     "isMain": false,
    >     "authType": "Anonymous",
    >     "volumeMounts": [],
    >     "environmentVariables": []
    > }
    > ```

1. For the template input, select the resource group that has the web app. Select **Review + Create**, then select **Create**.

    Since the portal UI isn't available to you, you can't see this sidecar container as part of the app, but you should be able to see related start-up logs for the sidecar in the [App Service app's logs](troubleshoot-diagnostic-logs.md).

-----

## 4. Configure environment variables

For the sample scenario, the otel-collector sidecar is configured to export the OpenTelemetry data to Azure Monitor, but it needs the connection string as an environment variable (see the [OpenTelemetry configuration file for the otel-collector image](https://github.com/Azure-Samples/app-service-sidecar-tutorial-prereqs/blob/main/images/otel-collector/otel-collector-config.yaml)).

You configure environment variables for the containers like any App Service app, by configuring [app settings](configure-common.md#configure-app-settings). The app settings are accessible to all the containers in the app.

1. Navigate to the App Service app's management page.

1. From the left menu, select **Environment variables**.

1. Add an app setting by selecting **Add** and configure it as follows:
    - **Name**: *APPLICATIONINSIGHTS_CONNECTION_STRING*
    - **Value**: The connection string in the output of `azd provision`. If you lost the Cloud Shell session, you can also find it in the **Overview** page of the Application Insight resource, under **Connection String**.

1. Select **Apply**, then **Apply**, then **Confirm**.

    :::image type="content" source="media/tutorial-sidecar/configure-app-settings.png" alt-text="Screenshot showing a web app's Configuration page with two app settings added.":::

## 5. Configure instrumentation at startup

In this step, you create the instrumentation for your app according to the steps outlined in the [OpenTelemetry .NET zero-code instrumentation](https://opentelemetry.io/docs/zero-code/net/getting-started/#instrumentation).

1. Back in the Cloud Shell, create *startup.sh* with the following lines.

    ```azurecli-interactive
    cat > startup.sh << 'EOF'
    #!/bin/bash
     
    # Download the bash script
    curl -sSfL https://github.com/open-telemetry/opentelemetry-dotnet-instrumentation/releases/latest/download/otel-dotnet-auto-install.sh -O
     
    # Install core files
    sh ./otel-dotnet-auto-install.sh
     
    # Enable execution for the instrumentation script
    chmod +x $HOME/.otel-dotnet-auto/instrument.sh
     
    # Setup the instrumentation for the current shell session
    . $HOME/.otel-dotnet-auto/instrument.sh
     
    export OTEL_SERVICE_NAME="MyFirstAzureWebApp-Azure"
    export OTEL_EXPORTER_OTLP_ENDPOINT="http://localhost:4318"
    export OTEL_TRACES_EXPORTER="otlp"
    export OTEL_METRICS_EXPORTER="otlp"
    export OTEL_LOGS_EXPORTER="otlp"
     
    # Run your application with instrumentation
    OTEL_SERVICE_NAME=myapp OTEL_RESOURCE_ATTRIBUTES=deployment.environment=staging,service.version=1.0.0 dotnet /home/site/wwwroot/MyFirstAzureWebApp.dll
    EOF
    ```

1. Deploy this file to your app with the following Azure CLI command. If you're still in the *~/MyFirstAzureWebApp* directory, then no other parameters are necessary because `az webapp up` already set defaults for the resource group and the app name.

    ```azurecli-interactive
    az webapp deploy --src-path startup.sh --target-path /home/site/startup.sh --type static
    ```

    > [!TIP]
    > This approach deploys the *startup.sh* file separately from your application. That way, the instrumentation configuration is separate from your application code. However, you can use other deployment methods to deploy the script together with your application.

1. Back in the app's management page, from the left menu, select **Configuration**.

1. Set **Startup Command** to */home/site/startup.sh*. It's the same path that you deployed to in the previous step.

1. Select **Save**, then **Continue**.

    :::image type="content" source="media/tutorial-sidecar/configure-startup-file.png" alt-text="Screenshot that shows how to configure a custom startup file for an App Service app in the Azure portal.":::

## 5. Verify in Application Insights

The otel-collector sidecar should export data to Application Insights now.

1. Back in the browser tab for `https://<app-name>.azurewebsites.net`, refresh the page a few times to generate some web requests.
1. Go back to the resource group overview page, then select the Application Insights resource that `azd up` created. You should now see some data in the default charts.

    :::image type="content" source="media/tutorial-sidecar/app-insights-view.png" alt-text="Screenshot of the Application Insights page showing data in the default charts.":::

> [!NOTE]
> In this very common monitoring scenario, Application Insights is just one of the OpenTelemetry targets you can use, such as Jaeger, Prometheus, and Zipkin.

## 6. Clean up resources

When you no longer need the environment, you can delete the resource groups and all related resources. Just run these commands in the Cloud Shell:

```azurecli-interactive
cd ~/MyFirstAzureWebApp
az group delete --yes
cd ~/app-service-sidecar-tutorial-prereqs
azd down
```

## Frequently asked questions

- [How do sidecar containers handle internal communication?](#how-do-sidecar-containers-handle-internal-communication)
- [How do I instrument other language stacks?](#how-do-i-instrument-other-language-stacks)

#### How do sidecar containers handle internal communication?

Sidecar containers share the same network host as the main container, so the main container (and other sidecar containers) can reach any port on the sidecar with `localhost:<port>`. The example *startup.sh* uses `localhost:4318` to access port 4318 on the **otel-collector** sidecar.

In the **Edit container** dialog, the **Port** box isn't currently used by App Service. You can use it as part of the sidecar metadata, such as to indicate which port the sidecar is listening to.

#### How do I instrument other language stacks?

You can use a similar approach to instrument apps in other language stacks. For more information, see OpenTelemetry documentation:

- [.NET](https://opentelemetry.io/docs/zero-code/net/)
- [PHP](https://opentelemetry.io/docs/zero-code/php/)
- [Python](https://opentelemetry.io/docs/zero-code/python/)
- [Java](https://opentelemetry.io/docs/zero-code/java/)
- [Node.js](https://opentelemetry.io/docs/zero-code/js/)

## More resources

- [Deploy to App Service using GitHub Actions](deploy-github-actions.md)
- [OpenTelemetry](https://opentelemetry.io/)
