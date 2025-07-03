---
title: Migrate Docker Compose to sidecars
description: Guidance for migrating from Docker Compose or custom multi-container apps to the sidecar model in Azure App Service.
ms.topic: how-to
ms.date: 07/02/2025
ms.author: cephalin
author: cephalin
---

# Migrate Docker Compose apps to sidecars in Azure App Service

If you're running a Docker Compose app in Azure App Service, you should migrate it to sidecars. There are two main strategies for migrating a Docker Compose app to sidecars.

- Script-based migration - recommended for simple setups.
- Manual migration

## a. Prerequisites

- PowerShell
- Azure CLI
- Docker (for building and pushing images)
- Text editor (e.g., VS Code)

## Script-based migration

If your Docker Compose file is straightforward, you can use the official migration script to automate the process.

> [!IMPORTANT]
> Always back up your app from the Azure portal before running the migration script.

1. [Download the migration script from the Azure Samples GitHub repository.](https://github.com/Azure-Samples/sidecar-samples/blob/main/migration-script/update_sidecars.ps1)
2. Run the script in PowerShell, providing your subscription ID, web app name, resource group, registry URL, base64-encoded Docker Compose file, main service name, and target port.

    ```powershell
    ./update-webapp.ps1 `
      -subscriptionId "<subscriptionId>" `
      -webAppName "<webAppName>" `
      -resourceGroup "<resourceGroup>" `
      -registryUrl "<registryUrl>" `
      -base64DockerCompose "<base64DockerCompose>" `
      -mainServiceName "<mainServiceName>" `
      -targetPort "<targetPort>"
    ```

If your registry requires authentication, the script prompts you to provide `dockerRegistryServerUsername` and `dockerRegistryServerPassword` interactively.

## Manual migration

1. Sign in to Azure and set your subscription.

    ```azurecli
    az login
    az account set --subscription <your-subscription-id>
    ```

2. Gather required details.

    ```azurecli
    az account show --query id --output tsv
    az webapp list --query "[].{name:name}" --output tsv
    az group list --query "[].{name:name}" --output tsv
    az acr list --query "[].{name:name}" --output tsv
    ```

    These will help you identify your subscription ID, app name, resource group, and Azure container registry.

3. Create a deployment slot. You will validate the migrated sidecars before switching the slot into production.

    ```azurecli
    az webapp deployment slot create --name <webapp-name> --resource-group <resource-group> --slot <slot-name>
    ```

4. Decode the existing Docker Compose configuration from the production app.

    ```azurecli
    az webapp config show --name <webapp-name> --resource-group <resource-group> --query linuxFxVersion
    ```

    Copy the base64 part from the output and decode it in PowerShell:

    ```powershell
    [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("<base64value>"))
    ```

5. For each service in your Compose file, create a corresponding `container` resource in the deployment slot under the `sitecontainers` URL path:

    ```azurecli
    az rest --method PUT \
      --url https://management.azure.com/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Web/sites/<webapp-name>/slots/<slot-name>/sitecontainers/<container-name>?api-version=2023-12-01 \
      --body '{"name":"<container-name>", "properties":{"image":"<image-name>", "isMain": <true/false>, "targetPort": <port>}}'
    ```
    - Use [Mapping of Docker Compose Attributes and Sidecar Configuration](#mapping-of-docker-compose-attributes-and-sidecar-configuration) to help you with the mapping.
    - Use a container name you want in `<container-name>`.
    - Set `isMain` to `true` for the main app container, `false` for sidecars.
    - For `<image-name>`, use the full path for the image that includes the server name. For example:

        ```json
        "image":"myregistry.azurecr.io/myapp/backend:latest"
        ```
    - Repeat for all containers.

6. Switch the deployment slot to use sidecar mode.

    ```azurecli
    az webapp config set --name <webapp-name> --resource-group <resource-group> --slot <slot-name> --linux-fx-version "sitecontainers"
    ```

7. Restart the deployment slot, then validate the functionatity of the migrated app in the deployment slot.

    ```azurecli
    az webapp restart --name <webapp-name> --resource-group <resource-group> --slot <slot-name>
    ```

8. Once validated, swap the slot to production:
    ```azurecli
    az webapp deployment slot swap --name <webapp-name> --resource-group <resource-group> --slot <slot-name> --target-slot production
    ```

## Mapping of Docker Compose Attributes and Sidecar Configuration

The following Docker Compose fields are mapped to sidecar configuration:

| Docker Compose | Sidecar Configuration | Notes |
|---------------|----------------------|-------|
| `command`, `entrypoint` | `startUpCommand` | |
| `environment` | `environmentVariables` | |
| `image` | `image` | |
| `ports` | `targetPort` | Only ports 80 and 8080 are supported for external traffic |
| `volumes` | `volumeMounts` | Persistent Azure storage not supported |

The following Docker Compose fields are unsupported in sidecars:

| Docker Compose Field | Support | Notes |
|---------------------|---------|-------|
| `build` | Not allowed | Pre-build and push images to a registry |
| `depends_on` | Ignored | No container startup ordering guaranteed |
| `networks` | Ignored | Network handled internally |
| `secrets` | Ignored | Use App Settings or Key Vault |
| `volumes` using `{WEBAPP_STORAGE_HOME}` or `{WEBSITES_ENABLE_APP_SERVICE_STORAGE}` | Not supported | |

## Migration limitations and considerations

The following table shows the features currently supported in Docker Compose apps that are not supported or have limit support in sidecars.

| Feature | Docker Compose | Sidecar |
|---------|---------------|---------|
| Storage | Volumes shared between containers | Container-specific, persistent storage limited |
| Networking | Service names as hostnames | All containers share `localhost`; unique ports required |
| Logging & Monitoring | Custom drivers, external tools | Integrated with Azure Monitor and Log Analytics |
| App Service Environment (ASE) | Supported | Not yet supported |
| National Clouds | Supported | Not yet supported |

## More resources

- [Sidecar overview](overview-sidecar.md)
- [Configure sidecars](configure-sidecar.md)
- [Microsoft Q&A for Azure App Service](https://learn.microsoft.com/answers/tags/436/azure-app-service)