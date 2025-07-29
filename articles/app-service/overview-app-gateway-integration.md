---
title: What Is Application Gateway Integration?
description: Learn how Azure Application Gateway integrates with Azure App Service.
services: app-service
author: seligj95
ms.service: azure-app-service
ms.topic: overview
ms.date: 01/07/2025
ms.author: jordanselig
ms.custom: devx-track-azurecli, devx-track-arm-template
ms.devlang: azurecli
---

# What is Application Gateway integration with Azure App Service?

This article describes how to configure Azure Application Gateway with Azure App Service by using private endpoints to secure traffic. The article also discusses considerations for using service endpoints and integrating with internal and external App Service Environments. The article describes how to set access restrictions on a Source Control Manager (SCM) site.

## Integration with App Service

You can use private endpoints to secure traffic between Application Gateway and your App Service app. You need to ensure that Application Gateway can use Domain Name System (DNS) to resolve the private IP address of the App Service apps. Alternatively, you can use the private IP address in the back-end pool and override the host name in the HTTP settings.

:::image type="content" source="./media/overview-app-gateway-integration/private-endpoint-appgw.png" border="false" alt-text="Diagram that shows traffic flowing to an application gateway through a private endpoint to instances of apps in App Service.":::

Application Gateway caches the DNS lookup results. If you use fully qualified domain names (FQDNs) and rely on DNS lookup to get the private IP address, you might need to restart the application gateway if the DNS update or the link to an Azure private DNS zone happened after you configured the back-end pool.

To restart the application gateway, stop and start it by using the Azure CLI:

```azurecli-interactive
az network application-gateway stop --resource-group myRG --name myAppGw
az network application-gateway start --resource-group myRG --name myAppGw
```

Learn more about [configuring an App Service app with private endpoint](./overview-private-endpoint.md).

## Considerations for using service endpoints

As an alternative to using private endpoints, you can use service endpoints to secure the traffic from Application Gateway. By using [service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md), you can allow traffic from only a specific subnet within an Azure virtual network and block everything else. In the following scenario, you use this functionality to ensure that an App Service instance can receive traffic from only a specific application gateway.

:::image type="content" source="./media/overview-app-gateway-integration/service-endpoints-appgw.png" border="false" alt-text="Diagram that shows the internet flowing to an application gateway in an Azure virtual network and then flowing through a firewall icon to instances of apps in App Service.":::

This configuration has two parts, aside from creating the App Service app instance and the application gateway.

The first part is enabling service endpoints in the subnet of the virtual network where the application gateway is deployed. Service endpoints ensure that all network traffic leaving the subnet toward App Service is tagged with the specific subnet ID.

The second part is to set an access restriction on the specific web app to ensure that only traffic tagged with this specific subnet ID is allowed. You can configure the access restriction by using different tools, depending on your preference.

In the Azure portal, you follow four steps to create and configure the integration of App Service and Application Gateway. If you have existing resources, you can skip the first steps.

1. Create an App Service instance by using one of the quickstarts in the App Service documentation. One example is the [.NET Core quickstart](./quickstart-dotnetcore.md).
1. Create an application gateway by using the [portal quickstart](../application-gateway/quick-create-portal.md), but skip the section about adding back-end targets.
1. Configure [App Service as a back end in Application Gateway](../application-gateway/configure-web-app.md?tabs=defaultdomain), but skip the section about restricting access.
1. Create the [access restriction by using service endpoints](../app-service/app-service-ip-restrictions.md#set-a-service-endpoint-based-rule).

You can now access App Service through Application Gateway. If you try to access App Service directly, expect to see a 403 HTTP error that says the web app is blocking your access.

## Considerations for an internal App Service Environment

An internal App Service Environment isn't exposed to the internet. Traffic between the instance and an application gateway is already isolated to the virtual network. You can [configure an internal App Service Environment and integrate it with an application gateway](./environment/integrate-with-application-gateway.md) by using the Azure portal.

If you want to ensure that only traffic from the Application Gateway subnet is reaching the App Service Environment, you can configure a network security group that affects all web apps in the App Service Environment. For the network security group, you can specify the subnet IP range and optionally the ports (80/443).

To isolate traffic to an individual web app, you need to use IP-based access restrictions, because service endpoints don't work with an App Service Environment. The IP address should be the private IP of the application gateway.

## Considerations for an external App Service Environment

An external App Service Environment has a public-facing load balancer like multitenant App Service apps. Service endpoints don't work for an App Service Environment. In an App Service Environment, you can use IP-based access restrictions by using the public IP address of the application gateway. To create an external App Service Environment by using the Azure portal, you can use a [quickstart](./environment/creation.md).

You can also [add private endpoints to apps hosted on an external App Service Environment](./environment/configure-network-settings.md#allow-new-private-endpoint-connections).

## Considerations for a Kudu/SCM site

The SCM site, also known as Kudu, is an admin site that exists for every web app. It isn't possible to use reverse proxy for the SCM site. You most likely also want to lock it down to individual IP addresses or a specific subnet.

If you want to use the same access restrictions as the main site, you can inherit the settings by using the following command:

```azurecli-interactive
az webapp config access-restriction set --resource-group myRG --name myWebApp --use-same-restrictions-for-scm-site
```

If you want to add individual access restrictions for the SCM site, you can use the `--scm-site` flag:

```azurecli-interactive
az webapp config access-restriction add --resource-group myRG --name myWebApp --scm-site --rule-name KudoAccess --priority 200 --ip-address 208.130.0.0/16
```

## Considerations for using the default domain

Configuring Application Gateway to override the host name and use the default domain of App Service (typically `azurewebsites.net`) is the easiest way to configure the integration. It doesn't require configuring a custom domain and certificate in App Service.

[Host name preservation](/azure/architecture/best-practices/host-name-preservation) discusses the general considerations for overriding the original host name. In App Service, you need to pay attention with this configuration in two scenarios.

### Authentication

When you use [the authentication feature](./overview-authentication-authorization.md) in App Service (also called *Easy Auth*), your app typically redirects to the sign-in page. Because App Service doesn't know the original host name of the request, the redirect is done on the default domain name and usually results in an error.

To work around the default redirect, you can configure authentication to inspect a forwarded header and adapt the redirect domain to the original domain. Application Gateway uses a header called `X-Original-Host`. By using [file-based configuration](./configure-authentication-file-based.md) to configure authentication, you can configure App Service to adapt to the original host name.

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

In multiple-instance deployments, [session affinity](./configure-common.md?tabs=portal#configure-general-settings) ensures that client requests are routed to the same instance for the life of the session. Session affinity can be configured to adapt the cookie domain to the incoming header from reverse proxy. By setting [session affinity proxy](./configure-common.md?tabs=portal#configure-general-settings) to `true`, session affinity looks for `X-Original-Host` or `X-Forwarded-Host` and adapts the cookie domain to the domain found in this header. As a recommended practice when enabling session affinity proxy, you should configure your access restrictions on the site to ensure that traffic comes from your reverse proxy.

You can also configure `clientAffinityProxyEnabled` by using the following command:

```azurecli-interactive
az resource update --resource-group myRG --name myWebApp --resource-type "Microsoft.Web/sites" --set properties.clientAffinityProxyEnabled=true
```

## Related content

- Learn more about [App Service Environments](./environment/index.yml).
- Learn how to help secure your web app by using [Azure Web Application Firewall](../web-application-firewall/ag/ag-overview.md).
- Complete a [tutorial](https://azure.github.io/AppService/2021/03/26/Secure-resilient-site-with-custom-domain) to deploy a secure, resilient site with a custom domain on App Service by using either Azure Front Door or Application Gateway.
