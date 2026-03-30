---
title: What Is Application Gateway Integration?
description: Learn how Azure Application Gateway integrates with Azure App Service.
services: app-service
author: seligj95
ms.service: azure-app-service
ms.topic: overview
ms.date: 03/02/2026
ms.author: jordanselig
ms.custom: devx-track-azurecli, devx-track-arm-template
ms.devlang: azurecli
#customer intent: As an Azure App Service developer, I want to understand integration considerations for App Service and Application Gateway so I can implement the services.
---

# What is Azure Application Gateway integration with Azure App Service?

This article provides an overview for configuring Azure Application Gateway with Azure App Service by using private endpoints to secure traffic. Review considerations for using service endpoints and integrating with an internal or external App Service Environment. Set access restrictions on a Source Control Manager (SCM) site.

## Integration with App Service

You can use private endpoints to secure traffic between Application Gateway and your App Service app. You need to ensure that Application Gateway can use Domain Name System (DNS) to resolve the private IP address of the App Service apps. Alternatively, you can use the private IP address in the back-end pool and override the host name in the HTTP settings.

:::image type="content" source="./media/overview-app-gateway-integration/private-endpoint-application-gateway.png" border="false" alt-text="Diagram of traffic flowing to an application gateway through a private endpoint to App Service apps.":::

Application Gateway caches the DNS lookup results. If you use fully qualified domain names (FQDNs) and rely on DNS lookup to get the private IP address, you might need to restart the application gateway. A restart is required when the DNS update or the link to an Azure private DNS zone happens after you configure the back-end pool.

To restart the application gateway, stop and start it with the following Azure CLI commands. Replace the names of your local resources for any *\<placeholder>* values in the commands.

```azurecli-interactive
az network application-gateway stop --resource-group <your-resource-group> --name <your-application-gateway>
az network application-gateway start --resource-group <your-resource-group> --name <your-application-gateway>
```

Learn more about [configuring an App Service app with private endpoint](overview-private-endpoint.md).

## Considerations for using service endpoints

As an alternative to using private endpoints, you can use service endpoints to secure the traffic from Application Gateway. By using [service endpoints](/azure/virtual-network/virtual-network-service-endpoints-overview), you can allow traffic from only a specific subnet within an Azure virtual network and block everything else. In the following scenario, you use this functionality to ensure App Service apps can receive traffic from only a specific application gateway.

:::image type="content" source="./media/overview-app-gateway-integration/service-endpoints-application-gateway.png" border="false" alt-text="Diagram of the internet flowing to an application gateway in a virtual network, then through a service endpoint firewall to App Service apps.":::

This configuration has two parts, aside from creating the App Service app instance and the application gateway.

- The first part enables service endpoints in the subnet of the virtual network where the application gateway is deployed. Service endpoints ensure all network traffic leaving the subnet toward App Service is tagged with the specific subnet ID.

- The second part sets an access restriction on the specific web app to ensure that only traffic tagged with this specific subnet ID is allowed. You can configure the access restriction by using different tools, depending on your preference.

In the Azure portal, you follow four steps to create and configure the integration of App Service and Application Gateway. If you have existing resources, you can skip the first and second steps.

1. Create an App Service app by using one of the quickstarts in the App Service documentation. One example is the [.NET Core quickstart](quickstart-dotnetcore.md).
1. Create an application gateway by using the [portal quickstart](/azure/application-gateway/quick-create-portal), but skip the section about adding back-end targets.
1. Configure [App Service as a backend in Application Gateway](/azure/application-gateway/configure-web-app?tabs=defaultdomain), but skip the section about restricting access.
1. Create the [access restriction by using service endpoints](/azure/app-service/app-service-ip-restrictions#set-a-service-endpoint-based-rule).

You can now access App Service through Application Gateway. If you try to access App Service directly, expect to see a 403 HTTP error that says the web app is blocking your access.

## Considerations for an internal App Service Environment

An internal App Service Environment isn't exposed to the internet. Traffic between the environment and an application gateway is already isolated to the virtual network. You can [configure an internal environment and integrate it with an application gateway](./environment/integrate-with-application-gateway.md) by using the Azure portal.

If you want to ensure that only traffic from the Application Gateway subnet reaches the App Service Environment, you can configure a network security group that affects all web apps in the environment. For the network security group, you can specify the subnet IP range and optionally the ports (80/443).

To isolate traffic to an individual web app, you need to use IP-based access restrictions, because service endpoints don't work with an App Service Environment. The IP address should be the private IP of the application gateway.

## Considerations for an external App Service Environment

An external App Service Environment has a public-facing load balancer like multitenant App Service apps. Service endpoints don't work for an external App Service Environment. In an App Service Environment, you can apply IP-based access restrictions by using the public IP address of the application gateway. To create an external App Service Environment in the Azure portal, you can use a [quickstart](./environment/creation.md).

You can also [add private endpoints to apps hosted on an external App Service Environment](./environment/configure-network-settings.md#allow-new-private-endpoint-connections).

## Considerations for a Kudu/SCM site

The SCM site, also known as Kudu, is an admin site that exists for every web app. It isn't possible to use reverse proxy for the SCM site. You most likely also want to lock it down to individual IP addresses or a specific subnet.

If you want to use the same access restrictions as the main site, you can inherit the settings with the following Azure CLI command:

```azurecli-interactive
az webapp config access-restriction set --resource-group <your-resource-group> --name <your-web-app> --use-same-restrictions-for-scm-site
```

If you want to add individual access restrictions for the SCM site, you can use the `--scm-site` flag with the command:

```azurecli-interactive
az webapp config access-restriction add --resource-group <your-resource-group> --name <your-web-app> --scm-site --rule-name KudoAccess --priority 200 --ip-address 208.130.0.0/16
```

## Considerations for using the default domain

You can configure Application Gateway to override the host name with the default domain of App Service (typically `azurewebsites.net`). This approach is the easiest way to accomplish integration because it doesn't require configuring a custom domain and certificate in App Service.

The [host name preservation](/azure/architecture/best-practices/host-name-preservation) process describes the general considerations for overriding the original host name. In App Service, keep in mind the following considerations regarding authentication and session affinity.

### Authentication (Easy Auth)

When you use [the authentication feature](overview-authentication-authorization.md) in App Service (also called *Easy Auth*), your app typically redirects to the sign-in page. Because App Service doesn't know the original host name of the request, the redirect is done on the default domain name and usually results in an error.

To work around the default redirect, you can configure authentication to inspect a forwarded header and adapt the redirect domain to the original domain. Application Gateway uses a header named `X-Original-Host`. By using [file-based configuration](configure-authentication-file-based.md) to specify authentication, you can configure App Service to adapt to the original host name.

Add this configuration to your configuration file:

```json
{
    ...
    "httpSettings": {
        "forwardProxy": {
            "convention": "Custom",
            "customHostHeaderName": "X-Original-Host"
        }
    }
    ...
}
```

### Session affinity

When you specify the **Session affinity** [setting](/azure/app-service/configure-common?tabs=portal#configure-general-settings) in multiple-instance deployments, you can ensure client requests route to the same instance for the life of the session. You can configure session affinity to adapt the cookie domain to the incoming header from reverse proxy.

When you set the **Session affinity proxy** [setting](/azure/app-service/configure-common?tabs=portal#configure-general-settings) to `true`, session affinity looks for the `X-Original-Host` or `X-Forwarded-Host` header. It adapts the cookie domain to the domain found in the header. As a recommended practice when enabling session affinity proxy, configure your access restrictions on the site to ensure traffic comes from your reverse proxy.

You can also configure the `clientAffinityProxyEnabled` setting with the following Azure CLI command:

```azurecli-interactive
az resource update --resource-group <your-resource-group> --name <your-web-app> --resource-type "Microsoft.Web/sites" --set properties.clientAffinityProxyEnabled=true
```

## Related content

- [Review App Service Environment documentation](/azure/app-service/environment/)
- [Secure web app with Azure Web Application Firewall](/azure/web-application-firewall/ag/ag-overview)
- [Deploy secure site with custom domain on Azure Front Door or Application Gateway (Tutorial)](https://azure.github.io/AppService/2021/03/26/Secure-resilient-site-with-custom-domain)
