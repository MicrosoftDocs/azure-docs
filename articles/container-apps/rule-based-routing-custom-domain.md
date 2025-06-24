---
title: Use a custom domain with rule-based routing in Azure Container Apps (preview)
description: Learn how to configure a custom domain with rule-based routing in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom: devx-track-azurecli, devx-track-bicep
ms.topic: how-to
ms.date: 04/16/2025
ms.author: cshoe
---

# Use a custom domain with rule-based routing in Azure Container Apps (preview)

HTTP route configurations support custom domains, allowing you to route traffic from your own domain names to your container apps.

## Prerequisites

- An existing Azure Container Apps environment
- A custom domain that you own
- SSL certificate for your domain (unless using automatic certificates)
- Container apps deployed to your environment

## Custom domain configuration

Using the DNS provider hosting your domain, create the appropriate DNS records for your custom domain.
- If you are using the root domain (for example, `contoso.com`), create the following DNS records:
	| Record type | Host | Value |
	|--|--|--|
	| A | `@` | The IP address of your Container Apps environment. |
	| TXT | `asuid` | The domain verification code. |
	
- If you are using a subdomain (for example, `www.contoso.com`), create the following DNS records:
	| Record type | Host | Value |
	|--|--|--|
	| A | The subdomain (for example, `www`) | The IP address of your Container Apps environment. |
	| TXT | `asuid.{subdomain}` (for example, `asuid.www`) | The domain verification code. |
> [!NOTE]
> The IP address of your Container Apps environment and the domain verification code can be found in the [Custom DNS suffix settings](./environment-custom-dns-suffix.md#add-a-custom-dns-suffix-and-certificate) of your Container Apps environment.
>
> Don't bind the custom domain to your Container Apps environment or to a container app.  Domains are only bound to one app, route, or environment.

## Route configuration

Update your Container Apps YAML file to include a `customDomains` section. Include a `bindingType` and `certificateId`, based on the following criteria:
| bindingType value | Description | 
|--|--|
| Disabled | No certificate is provided. The domain is only available over HTTP, and HTTPS is not available. |
| Auto | A certificate is optional. If a managed certificate is already created for this domain, it is added to the route automatically. Otherwise, the domain is initially only available over HTTP. To create a managed certificate for this domain, create a new managed certificate after the route is created. After the certificate is created, it is automatically added to the route. |
| SniEnabled | A certificate is required. |
| Certificate type | certificateId format |
| -- | -- |
| None | Leave blank |
| Managed | `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.App/managedEnvironments/{ContainerAppEnvironmentName}/managedCertificates/{CertificateFriendlyName}` |
| Unmanaged | `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.App/managedEnvironments/{ContainerAppEnvironmentName}/certificates/{CertificateFriendlyName}` |

> [!NOTE]
> To add a certificate to your environment, use one of the following methods:
> - To add a Container Apps managed certificate, use the [az containerapp env certificate create](/cli/azure/containerapp/env/certificate#az-containerapp-env-certificate-create) CLI command.
> - To bring your own existing certificate, use the [az containerapp env certificate upload](/cli/azure/containerapp/env/certificate#az-containerapp-env-certificate-upload) CLI command.
>
> Don't bind the certificate to a container app.


The following example demonstrates how to set up the route configuration.

```yml
customDomains:
  - name: "<CUSTOM_DOMAIN_ENDPOINT>" 
    certificateId: "<CERTIFICATE_ID>"
    bindingType: "SniEnabled" # Can also be "Disabled", "Auto"
rules:
  - description: "Routing to App1"
    routes:
      - match:
          prefix: "/1"
        action:
          prefixRewrite: "/"
    targets:
      - containerApp: "<APP1_CONTAINER_APP_NAME>"
  - description: "Routing to App2"
    routes:
      - match:
          prefix: "/2"
        action:
          prefixRewrite: "/"
      - match:
          prefix: "/"
    targets:
      - containerApp: "<APP2_CONTAINER_APP_NAME>"
```

This configuration defines two routing rules for HTTP traffic.

| Property | Description |
|---|---|
| `customDomains.name` | The domain name you want to use (example: "app.contoso.com") |
| `customDomains.certificateId` | Resource ID of your certificate (not needed with `bindingType: "Auto"`) |
| `customDomains.bindingType` | How SSL is handled: "SniEnabled" (Server Name Indication), "Disabled" (HTTP only), or "Auto" (automatic certificate) |
| `description` | Human-readable label for the rule |
| `routes.match.prefix` | URL path prefix to match. For example, `/api`. |
| `routes.action.prefixRewrite` | What to replace the matched prefix with before forwarding. |
| `targets.containerApp` | The name of the container app where matching route request are sent. |

These rules allow different paths on your custom domain to route to different container apps while also modifying the request path before it reaches the destination app.

Other properties not listed that may affect your routes include the following.

| Property | Description |
|---|---|
| `route.match.path` | Exact match path definition. |
| `route.match.pathSeparatedPrefix` | Matches routes on '/' boundaries rather than any text. For example, if you set the value to `/product`, then it will match on `/product/1`, but not `/product1`. |
| `route.match.caseSensitive` | Controls whether or not route patterns match with case sensitivity. |
| `target.label` | Route to a specific labeled revision within a container app. |
| `target.revision` | Route to a specific revision within a container app. |

## Work with your route configuration

Use the following commands to manage your route configuration.

Before running the following commands, make sure to replace placeholders surrounded by `<>` with your own values.

### Create a new route configuration

Use `az containerapp env http-route-config create` to create a new route configuration.

```azurecli
az containerapp env http-route-config create \
    --resource-group <RESOURCE_GROUP_NAME> \
    --name <ENVIRONMENT_NAME> \
    --http-route-config-name <CONFIGURATION_NAME> \
    --yaml <CONTAINER_APPS_CONFIG_FILE>
```

### List route configurations

Use `az containerapp env http-route-config list` to list all the defined route configurations.

```azurecli
az containerapp env http-route-config list \
    --resource-group <RESOURCE_GROUP_NAME> \
    --name <ENVIRONMENT_NAME>
```

### Update a route configuration

Use `az containerapp env http-route-config update` to update an existing route configuration.

```azurecli
az containerapp env http-route-config update \
  --resource-group <RESOURCE_GROUP_NAME> \
  --name <ENVIRONMENT_NAME> \
  --http-route-config-name <CONFIGURATION_NAME> \
  --yaml <CONTAINER_APPS_CONFIG_FILE>
```

### Show a specific route configuration

Use `az containerapp env http-route-config show` to view details of a route configuration.

```azurecli
az containerapp env http-route-config show \
    --resource-group <RESOURCE_GROUP_NAME> \
    --name <ENVIRONMENT_NAME> \
    --http-route-config-name <CONFIGURATION_NAME>
```

### Delete a route configuration

Use `az containerapp env http-route-config delete` to remove a route configuration.

```azurecli
az containerapp env http-route-config delete \
    --resource-group <RESOURCE_GROUP_NAME> \
    --name <ENVIRONMENT_NAME> \
    --http-route-config-name <CONFIGURATION_NAME>
```

## Verify HTTP routing

After configuring your custom domain with rule-based routing:

1. Navigate to your custom domain in a browser. For example, `https://app.contoso.com/1`.

1. Verify that the request is routed to the first container app.

1. Change the path to `/2`. For example, `https://app.contoso.com/2`.

1. Verify that the request is now routed to the second container app.

## Related content

- [Rule-based routing in Azure Container Apps](./rule-based-routing.md)
- [Custom domain names and free managed certificates](./custom-domains-managed-certificates.md)
- [Azure CLI reference for HTTP route configuration](/cli/azure/containerapp/env/http-route-config)

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).
