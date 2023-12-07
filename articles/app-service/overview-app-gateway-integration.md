---
title: Application Gateway integration - Azure App Service | Microsoft Learn
description: Learn how Application Gateway integrates with Azure App Service.
services: app-service
documentationcenter: ''
author: madsd
editor: ''

ms.assetid: 073eb49c-efa1-4760-9f0c-1fecd5c251cc
ms.service: app-service
ms.workload: web
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 09/29/2023
ms.author: madsd
ms.custom: seodec18, devx-track-azurecli, devx-track-arm-template
ms.devlang: azurecli
---

# Application Gateway integration

Three variations of Azure App Service require slightly different configuration of the integration with Azure Application Gateway. The variations include regular App Service (also known as multitenant), an internal load balancer (ILB) App Service Environment, and an external App Service Environment.

This article walks through how to configure Application Gateway with App Service (multitenant) by using service endpoints to secure traffic. The article also discusses considerations around using private endpoints and integrating with ILB and external App Service Environments. Finally, the article describes how to set access restrictions on a Source Control Manager (SCM) site.

## Integration with App Service (multitenant)

App Service (multitenant) has a public internet-facing endpoint. By using [service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md), you can allow traffic from only a specific subnet within an Azure virtual network and block everything else. In the following scenario, you use this functionality to ensure that an App Service instance can receive traffic from only a specific application gateway.

:::image type="content" source="./media/overview-app-gateway-integration/service-endpoints-appgw.png" alt-text="Diagram that shows the internet flowing to an application gateway in an Azure virtual network and then flowing through a firewall icon to instances of apps in App Service.":::

There are two parts to this configuration, aside from creating the App Service instance and the application gateway. The first part is enabling service endpoints in the subnet of the virtual network where the application gateway is deployed. Service endpoints ensure that all network traffic leaving the subnet toward App Service is tagged with the specific subnet ID.

The second part is to set an access restriction on the specific web app to ensure that only traffic tagged with this specific subnet ID is allowed. You can configure the access restriction by using different tools, depending on your preference.

## Set up services by using the Azure portal

With the Azure portal, you follow four steps to create and configure the setup of App Service and Application Gateway. If you have existing resources, you can skip the first steps.

1. Create an App Service instance by using one of the quickstarts in the App Service documentation. One example is the [.NET Core quickstart](./quickstart-dotnetcore.md).
2. Create an application gateway by using the [portal quickstart](../application-gateway/quick-create-portal.md), but skip the section about adding back-end targets.
3. Configure [App Service as a back end in Application Gateway](../application-gateway/configure-web-app.md), but skip the section about restricting access.
4. Create the [access restriction by using service endpoints](../app-service/app-service-ip-restrictions.md#set-a-service-endpoint-based-rule).

You can now access App Service through Application Gateway. If you try to access App Service directly, you should receive a 403 HTTP error that says the web app has blocked your access.

:::image type="content" source="./media/overview-app-gateway-integration/website-403-forbidden.png" alt-text="Screenshot shows the text of Error 403 - Forbidden.":::

## Set up services by using an Azure Resource Manager template

The [Azure Resource Manager deployment template][template-app-gateway-app-service-complete] creates a complete scenario. The scenario consists of an App Service instance that's locked down with service endpoints and an access restriction to receive traffic only from Application Gateway. The template includes many smart defaults and unique postfixes added to the resource names to keep it simple. To override them, you have to clone the repo or download the template and edit it.

To apply the template, you can use the **Deploy to Azure** button in the description of the template. Or you can use appropriate PowerShell or Azure CLI code.

## Set up services by using the Azure CLI

The [Azure CLI sample](../app-service/scripts/cli-integrate-app-service-with-application-gateway.md) creates an App Service instance that's locked down with service endpoints and an access restriction to receive traffic only from Application Gateway. If you only need to isolate traffic to an existing App Service instance from an existing application gateway, use the following command:

```azurecli-interactive
az webapp config access-restriction add --resource-group myRG --name myWebApp --rule-name AppGwSubnet --priority 200 --subnet mySubNetName --vnet-name myVnetName
```

In the default configuration, the command ensures setup of the service endpoint configuration in the subnet and the access restriction in App Service.

## Considerations for using private endpoints

As an alternative to service endpoints, you can use private endpoints to secure traffic between Application Gateway and App Service (multitenant). You need to ensure that Application Gateway can use DNS to resolve the private IP address of the App Service apps. Alternatively, you can use the private IP address in the back-end pool and override the host name in the HTTP settings.

:::image type="content" source="./media/overview-app-gateway-integration/private-endpoint-appgw.png" alt-text="Diagram that shows traffic flowing to an application gateway in an Azure virtual network and then flowing through a private endpoint to instances of apps in App Service.":::

Application Gateway caches the DNS lookup results. If you use fully qualified domain names (FQDNs) and rely on DNS lookup to get the private IP address, you might need to restart the application gateway if the DNS update or the link to an Azure private DNS zone happened after you configured the back-end pool.

To restart the application gateway, stop and start it by using the Azure CLI:

```azurecli-interactive
az network application-gateway stop --resource-group myRG --name myAppGw
az network application-gateway start --resource-group myRG --name myAppGw
```

## Considerations for an ILB App Service Environment

An ILB App Service Environment isn't exposed to the internet. Traffic between the instance and an application gateway is already isolated to the virtual network. To configure an ILB App Service Environment and integrate it with an application gateway by using the Azure portal, see the [how-to guide](./environment/integrate-with-application-gateway.md).

If you want to ensure that only traffic from the Application Gateway subnet is reaching the App Service Environment, you can configure a network security group (NSG) that affects all web apps in the App Service Environment. For the NSG, you can specify the subnet IP range and optionally the ports (80/443). For the App Service Environment to function correctly, make sure you don't override the [required NSG rules](./environment/network-info.md#network-security-groups).

To isolate traffic to an individual web app, you need to use IP-based access restrictions, because service endpoints don't work with an App Service Environment. The IP address should be the private IP of the application gateway.

## Considerations for an external App Service Environment

An external App Service Environment has a public-facing load balancer like multitenant App Service. Service endpoints don't work for an App Service Environment. That's why you have to use IP-based access restrictions by using the public IP address of the application gateway. To create an external App Service Environment by using the Azure portal, you can follow [this quickstart](./environment/create-external-ase.md).

[template-app-gateway-app-service-complete]: https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/web-app-with-app-gateway-v2/ "Azure Resource Manager template for a complete scenario"

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

[This article](/azure/architecture/best-practices/host-name-preservation) discusses the general considerations for overriding the original host name. In App Service, there are two scenarios where you need to pay attention with this configuration.

### Authentication

When you use [the authentication feature](./overview-authentication-authorization.md) in App Service (also known as Easy Auth), your app typically redirects to the sign-in page. Because App Service doesn't know the original host name of the request, the redirect is done on the default domain name and usually results in an error.

To work around the default redirect, you can configure authentication to inspect a forwarded header and adapt the redirect domain to the original domain. Application Gateway uses a header called `X-Original-Host`. By using [file-based configuration](./configure-authentication-file-based.md) to configure authentication, you can configure App Service to adapt to the original host name. Add this configuration to your configuration file:

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

### ARR affinity

In multiple-instance deployments, [ARR affinity](./configure-common.md?tabs=portal#configure-general-settings) ensures that client requests are routed to the same instance for the life of the session. ARR affinity doesn't work with host name overrides. For session affinity to work, you have to configure an identical custom domain and certificate in App Service and in Application Gateway and not override the host name.

## Next steps

For more information on App Service Environments, see the [App Service Environment documentation](./environment/index.yml).

To further secure your web app, you can find information about Azure Web Application Firewall on Application Gateway in the [Azure Web Application Firewall documentation](../web-application-firewall/ag/ag-overview.md).

To deploy a secure, resilient site with a custom domain on App Service by using either Azure Front Door or Application Gateway, see [this tutorial](https://azure.github.io/AppService/2021/03/26/Secure-resilient-site-with-custom-domain).
