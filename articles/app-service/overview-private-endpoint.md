---
title: Using private endpoints for App Service apps
description: Learn how to connect privately to Azure App Service apps using a private endpoint over Azure Private Link.
author: madsd
ms.assetid: 2dceac28-1ba6-4904-a15d-9e91d5ee162c
ms.topic: article
ms.date: 01/31/2025
ms.author: madsd
ms.custom: msangapu
#customer intent: As an app developer, I want to understand options to allow clients on our private networks to access apps in Azure App Service.
---

# Using private endpoints for App Service apps

[!INCLUDE [regionalization-note](./includes/regionalization-note.md)]

> [!IMPORTANT]
> Private endpoints are available for Windows and Linux apps, containerized or not, hosted on these App Service plans: **Basic**, **Standard**, **PremiumV2**, **PremiumV3**, **IsolatedV2**, **Functions Premium** (sometimes called the *Elastic Premium* plan).

You can use a private endpoint for your App Service apps. The private endpoint allows clients located in your private network to securely access the app over Azure Private Link. The private endpoint uses an IP address from your Azure virtual network address space. Network traffic between a client on your private network and the app traverses over the virtual network and a Private Link on the Microsoft backbone network. This configuration eliminates exposure from the public Internet.

Using a private endpoint for your app enables you to:

- Secure your app by configuring the private endpoint and disable public network access to eliminating public exposure.
- Securely connect to your app from on-premises networks that connect to the virtual network using a VPN or ExpressRoute private peering.
- Avoid any data exfiltration from your virtual network.

## Conceptual overview

A private endpoint is a special network interface (NIC) for your App Service app in a subnet in your virtual network.
When you create a private endpoint for your app, it provides secure connectivity between clients on your private network and your app. The private endpoint is assigned an IP Address from the IP address range of your virtual network.
The connection between the private endpoint and the app uses a secure [Private Link](../private-link/private-link-overview.md). Private endpoint is only used for incoming traffic to your app. Outgoing traffic doesn't use this private endpoint. You can inject outgoing traffic to your network in a different subnet through the [virtual network integration feature](./overview-vnet-integration.md).

Each slot of an app is configured separately. You can use up to 100 private endpoints per slot. You can't share a private endpoint between slots. The subresource name of a slot is `sites-<slot-name>`.

The subnet where you plug the private endpoint can have other resources in it. You don't need a dedicated empty subnet.
You can also deploy the private endpoint in a different region than your app.

> [!NOTE]
> The virtual network integration feature can't use the same subnet as private endpoint.

From a security perspective:

- Private endpoint and public access can coexist on an app. For more information, see [this overview of access restrictions](./overview-access-restrictions.md#how-it-works).
- To ensure isolation, when you enable private endpoints to your app, be sure that public network access is disabled.
- You can enable multiple private endpoints in others virtual networks and subnets, including virtual network in other regions.
- The access restrictions rules of your app aren't evaluated for traffic through the private endpoint.
- You can eliminate the data exfiltration risk from the virtual network by removing all Network Security Group (NSG) rules where destination is tag Internet or Azure services.

In the Web HTTP logs of your app, you find the client source IP. This feature is implemented using the TCP Proxy protocol, forwarding the client IP property up to the app. For more information, see [Getting connection Information using TCP Proxy v2](../private-link/private-link-service-overview.md#getting-connection-information-using-tcp-proxy-v2).

:::image type="content" source="./media/overview-private-endpoint/global-schema-web-app.png" alt-text="Diagram shows App Service app private endpoint global overview.":::

## DNS

When you use private endpoint for App Service apps, the requested URL must match the name of your app. By default, `<app-name>.azurewebsites.net`. When you use [unique default hostname](#dnl-note), your app name has the format `<app-name>-<random-hash>.<region>.azurewebsites.net`. In the following examples, *mywebapp* could also represent the full regionalized unique hostname.

By default, without a private endpoint, the public name of your web app is a canonical name to the cluster. For example, the name resolution is:

| Name | Type | Value |
|:-----|:-----|:------|
| mywebapp.azurewebsites.net | CNAME | clustername.azurewebsites.windows.net |
| clustername.azurewebsites.windows.net | CNAME | cloudservicename.cloudapp.net |
| cloudservicename.cloudapp.net | A | 192.0.2.13 |

When you deploy a private endpoint, the approach updates the DNS entry to point to the canonical name: `mywebapp.privatelink.azurewebsites.net`.
For example, the name resolution is:

| Name | Type | Value | Remark |
|:-----|:-----|:------|:-------|
| mywebapp.azurewebsites.net | CNAME | mywebapp.privatelink.azurewebsites.net | |
| mywebapp.privatelink.azurewebsites.net | CNAME | clustername.azurewebsites.windows.net | |
| clustername.azurewebsites.windows.net | CNAME | cloudservicename.cloudapp.net | |
| cloudservicename.cloudapp.net | A | 192.0.2.13 | <--This public IP isn't your private endpoint, you receive a 403 error |

You must set up a private DNS server or an Azure DNS private zone. For tests, you can modify the host entry of your test machine.
The DNS zone that you need to create is: `privatelink.azurewebsites.net`. Register the record for your app with a A record and the private endpoint IP.
For example, the name resolution is:

| Name | Type | Value | Remark |
|:----|:----|:-----|:------|
| mywebapp.azurewebsites.net | CNAME | mywebapp.privatelink.azurewebsites.net| <--Azure creates this CNAME entry in Azure Public DNS to point the app address to the private endpoint address |
| mywebapp.privatelink.azurewebsites.net | A | 10.10.10.8 | <--You manage this entry in your DNS system to point to your private endpoint IP address |

After this DNS configuration, you can reach your app privately with the default name mywebapp.azurewebsites.net. You must use this name, because the default certificate is issued for `*.azurewebsites.net`.

If you need to use a custom DNS name, add the custom name in your app and you must validate the custom name like any custom name, using public DNS resolution. For more information, see [custom DNS validation](./app-service-web-tutorial-custom-domain.md).

For the Kudu console, or Kudu REST API (deployment with Azure DevOps Services self-hosted agents, for example) you must create two records pointing to the private endpoint IP in your Azure DNS private zone or your custom DNS server. The first is for your app and the second is for the SCM of your app.

| Name | Type | Value |
|-----|-----|-----|
| mywebapp.privatelink.azurewebsites.net | A | PrivateEndpointIP |
| mywebapp.scm.privatelink.azurewebsites.net | A | PrivateEndpointIP |

## App Service Environment v3 special consideration

In order to enable private endpoint for apps hosted in an IsolatedV2 plan (App Service Environment v3), enable the private endpoint support at the App Service Environment level.
You can activate the feature by the Azure portal in the App Service Environment configuration pane, or through the following CLI:

```azurecli-interactive
az appservice ase update --name myasename --allow-new-private-endpoint-connections true
```

## Specific requirements

If the virtual network is in a different subscription than the app, ensure that the subscription with the virtual network is registered for the `Microsoft.Web` resource provider. To explicitly register the provider, see [Register resource provider](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider). You automatically register the provider when you create the first web app in a subscription.

## Pricing

For pricing details, see [Azure Private Link pricing](https://azure.microsoft.com/pricing/details/private-link/).

## Limitations

- When you use Azure Function in Elastic Premium plan with a private endpoint, to run the function in Azure portal, you must have direct network access. Otherwise, you receive an HTTP 403 error. Your browser must be able to reach the private endpoint to run the function from the Azure portal.
- You can connect up to 100 private endpoints to a particular app.
- Remote Debugging functionality isn't available through the private endpoint. We recommend that you deploy the code to a slot and remote debug it there.
- FTP access is provided through the inbound public IP address. A private endpoint doesn't support FTP access to the app.
- IP-Based TLS isn't supported with private endpoints.
- Apps that you configure with private endpoints can't receive public traffic that comes from subnets with `Microsoft.Web` service endpoint enabled and can't use [service endpoint-based access restriction rules](./overview-access-restrictions.md#access-restriction-rules-based-on-service-endpoints).
- Private endpoint naming must follow the rules defined for resources of type `Microsoft.Network/privateEndpoints`. For more information, see [Naming rules and restrictions](../azure-resource-manager/management/resource-name-rules.md#microsoftnetwork).

For up-to-date information about limitations, see [Limitations](../private-link/private-endpoint-overview.md#limitations).

## Related content

- To deploy private endpoint for your app through the portal, see [How to connect privately to an app with the Azure portal](../private-link/create-private-endpoint-portal.md).
- To deploy private endpoint for your app using Azure CLI, see [How to connect privately to an app with Azure CLI](../private-link/create-private-endpoint-cli.md).
- To deploy private endpoint for your app using PowerShell, see [How to connect privately to an app with PowerShell](../private-link/create-private-endpoint-powershell.md).
- To deploy private endpoint for your app using Azure template, see [How to connect privately to an app with Azure template](../private-link/create-private-endpoint-template.md).
- To see an end-to-end example of how to connect a frontend app to a secured backend app with virtual network integration and private endpoint with ARM template, see this [quickstart](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/webapp-privateendpoint-vnet-injection).
- To see an end-to-end example of how to connect a frontend app to a secured backend app with virtual network integration and private endpoint with terraform, see this [sample](./scripts/terraform-secure-backend-frontend.md).
