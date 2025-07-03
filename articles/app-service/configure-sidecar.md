---
title: Configure sidecars
description: Step-by-step guide to configuring sidecars, including adding built-in extensions.
ms.topic: how-to
ms.date: 07/02/2025
ms.author: cephalin
author: cephalin
---

# Configure Sidecars in Azure App Service

This article provides practical steps for enabling and configuring sidecars in your App Service app.

## Create a sidecar in the Azure portal

1. Go to your App Service resource in the Azure Portal.
2. Select **Deployment Center** and go to the **Containers** tab.
3. Click **Add container** to add a sidecar.
4. Fill in the image name, registry authentication (if needed), and environment variables.
5. Save your changes. The sidecar will be deployed alongside your main app container.

## Enable sidecar support for Linux custom containers

For a custom container, you need to explicitly enable sidecar support. In the portal, you can make the selection in the [App Service create wizard](https://portal.azure.com/#view/WebsitesExtension/AppServiceWebAppCreateV3Blade). You can also enable it in the **Deployment Center** > **Containers** page of an existing application.

With the Azure CLI, set `LinuxFxVersion` to `sitecontainers`. For example:

```azurecli
az webapp config set --name <app-name> --resource-group <resource-group> --linux-fx-version sitecontainers
```

For more information, see [What are the differences for sidecar-enabled custom containers?](#what-are-the-differences-for-sidecar-enabled-custom-containers)

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

## Define a sidecar with an ARM template

Add the `Microsoft.Web/sites/sitecontainers` resource type to an app. To pull a sidecar image from ACR using a user-assigned managed identity, specify `authType` as `UserAssigned` and provide the `userManagedIdentityClientId`:

```json
{
  "type": "Microsoft.Web/sites/sitecontainers",
  "apiVersion": "2024-04-01",
  "name": "<app-name>/<sidecar-name>",
  "properties": {
    "image": "<acr-name>.azurecr.io/<image-name>:<version>",
    "isMain": false,
    "authType": "UserAssigned",
    "userManagedIdentityClientId": "<client-id>",
    "environmentVariables": [
      { "name": "MY_ENV_VAR", "value": "my-value" }
    ]
  }
}
```

> [!IMPORTANT]
> Only the main container (`"isMain": true`) receives external traffic. In a Linux custom container app with sidecar support enabled, your main container has `isMain` set to `true`. All sidecar containers should have `"isMain": false`.

For more information, see [Microsoft.Web sites/sitecontainers](/azure/templates/microsoft.web/sites/sitecontainers).

## Set environment variables

In a Linux app, all containers (main and sidecars) share environment variables. To override a specific variable for a sidecar, add it in the sidecar's configuration.

- In ARM templates, use the `environmentVariables` array in the sidecar's properties.
- In the Portal, add environment variables in the container configuration UI.
- Environment variables can reference app settings by name; the value will be resolved at runtime.

## Add the Redis sidecar extension

From the Azure portal, you can add a Redis sidecar extension to your app for caching. The Redis sidecar is for lightweight caching only, not a replacement for Azure Cache for Redis.

To use the Redis sidecar:

- In your application code, set the Redis connection string to `localhost:6379`.
- Configure Redis in your app’s startup code.
- Use caching patterns to store and retrieve data.
- Test by accessing your app and checking logs to confirm cache usage.

## Add the Datadog sidecar extension

From the Azure portal, you can add a Datadog sidecar extension to collect logs, metrics, and traces for observability without modifying app code. When you add the extension, you specify your Datadog account information so that the sidecar extension can ship telemetry directly to Datadog.

**For code-based apps:**

1. Create a `startup.sh` script to download and initialize the Datadog tracer. The following script is an example for a .NET app:

    ```bash
    #!/bin/bash
    
    # Create log directory. This should correspond to the "Datadog Trace Log Directory" extension setting
    mkdir -p /home/LogFiles/dotnet
    
    # Download the Datadog tracer tarball
    wget -O /datadog/tracer/datadog-dotnet-apm-2.49.0.tar.gz https://github.com/DataDog/dd-trace-dotnet/releases/download/v2.49.0/datadog-dotnet-apm-2.49.0.tar.gz
    
    # Navigate to the tracer directory, extract the tarball, and return to the original directory
    mkdir -p /datadog/tracer
    pushd /datadog/tracer
    tar -zxf datadog-dotnet-apm-2.49.0.tar.gz
    popd
    
    dotnet /home/site/wwwroot/<yourapp>.dll
    ```
    
2. Set the startup command in App Service to run this script.

3. Run the application and confirm the telemetry is shipped by signing into your Datadog dashboard.

**For container-based apps:**

Before you add the Datadog sidecar extension, add the Datadog tracer setup in your Dockerfile, similar to the script example for code-based apps.

## Add the Phi-3/Phi-4 sidecar extension

From the Azure portal, you can add a Phi-3 or Phi-4 sidecar extension to your app to provide a local inference model for AI workloads. Your app must be in a pricing tier that supports the inferencing needs. For unsupported tiers, you don't see the options for the Phi-3/Phi-4 sidecar extensions.

- The Phi-3/Phi-4 sidecar exposes a chat completion API at http://localhost:11434/v1/chat/completions.
- After the sidecar is added, initial startup may be slow due to model loading.
- To invoke the API, send POST requests to this endpoint, in the same style of the [OpenAPI chat completion API](https://platform.openai.com/docs/api-reference/chat/create).

For end-to-end walkthroughs, see:

- [Tutorial: Run chatbot in App Service with a Phi-4 sidecar extension (ASP.NET Core)](tutorial-ai-slm-dotnet.md)
- [Tutorial: Run chatbot in App Service with a Phi-4 sidecar extension (Spring Boot)](tutorial-ai-slm-spring-boot.md)
- [Tutorial: Run chatbot in App Service with a Phi-4 sidecar extension (FastAPI)](tutorial-ai-slm-fastapi.md)
- [Tutorial: Run chatbot in App Service with a Phi-4 sidecar extension (Express.js)](tutorial-ai-slm-expressjs.md)


## Access a sidecar from the main container or from another sidecar

Sidecar containers share the same network host as the main container. The main container and other sidecars can reach any port on a sidecar using `localhost:<port>`. For example, if a sidecar listens on port 4318, the main app can access it at `localhost:4318`.

The **Port** field in the Portal is metadata only and not used by App Service for routing.

## Add volume mounts

By default, the default `/home` volume is mounted to all containers unless disabled. You can configure additional volumn mounts for your sidecars. 

Volume mounts enable you to share non-persistent files and directories between containers within your Web App.

- **Volume sub path:** Logical directory path created by App Service. Containers with the same sub path share files.
- **Container mount path:** Directory path inside the container mapped to the volume sub path.

Example configuration:

| Sidecar name | Volume sub path | Container mount path | Read-only |
| ------------ | --------------- | -------------------- | --------- |
| Container1 | /directory1/directory2 | /container1Vol | False |
| Container2 | /directory1/directory2 | /container2Vol | True |
| Container3 | /directory1/directory2/directory3 | /container3Vol | False |
| Container4 | /directory4 | /container1Vol | False |

- If Container1 creates `/container1Vol/myfile.txt`, Container2 can read it via `/container2Vol/myfile.txt`.
- If Container1 creates `/container1Vol/directory3/myfile.txt`, Container2 can read it via `/container2Vol/directory3/myfile.txt`, and Container3 can read/write via `/container3Vol/myfile.txt`.
- Container4 does not share a volume with the others.

> [!Note]
> For code-based Linux apps, the built-in Linux container cannot use volume mounts.

## More resources

- [Sidecars overview](overview-sidecar.md)
- [Migrate Docker Compose apps to sidecars in Azure App Service](migrate-sidecar-multi-container-apps.md)
- [Microsoft Q&A for Azure App Service](/answers/tags/436/azure-app-service)