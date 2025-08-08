---
title: Use Private Endpoints for Apps
description: Learn how to connect privately to Azure App Service apps using a private endpoint over Azure Private Link.
author: seligj95
ms.author: jordanselig
ms.topic: overview
ms.date: 04/23/2025
ms.custom: msangapu
ms.assetid: 2dceac28-1ba6-4904-a15d-9e91d5ee162c

#customer intent: As an app developer, I want to understand options that allow clients on our private networks to access apps in Azure App Service.

---

# Use private endpoints for Azure App Service apps

You can use a private endpoint for your Azure App Service apps. The private endpoint allows clients located in your private network to securely access an app over Azure Private Link. The private endpoint uses an IP address from your Azure virtual network address space. Network traffic between a client on your private network and the app goes over the virtual network and Private Link on the Microsoft backbone network. This configuration eliminates exposure from the public internet.

When you use a private endpoint for your app, you can:

- Secure your app when you configure the private endpoint and disable public network access, which eliminates public exposure.
- Securely connect to your app from on-premises networks that connect to the virtual network using a VPN or ExpressRoute private peering.
- Avoid any data exfiltration from your virtual network.

> [!IMPORTANT]
> Private endpoints are available for Windows and Linux apps, containerized or not, hosted on the following App Service plans: Basic, Standard, PremiumV2, PremiumV3, IsolatedV2, Functions Premium (sometimes called the Elastic Premium plan).

## Conceptual overview

A private endpoint is a network interface for your App Service app in a subnet in your virtual network.

When you create a private endpoint for your app, it provides secure connectivity between clients on your private network and your app. The private endpoint is assigned an IP Address from the IP address range of your virtual network.
The connection between the private endpoint and the app uses a secure [Private Link](../private-link/private-link-overview.md). The private endpoint is only used for incoming traffic to your app. Outgoing traffic doesn't use the private endpoint. You can inject outgoing traffic to your network in a different subnet through the [virtual network integration feature](./overview-vnet-integration.md).

Each slot of an app is configured separately. You can use up to 100 private endpoints per slot. You can't share a private endpoint between slots. The `subresource` name of a slot is `sites-<slot-name>`.

The subnet that you use to plug the private endpoint can have other resources in it. You don't need a dedicated empty subnet. 

You can also deploy the private endpoint in a different region than your app.

> [!NOTE]
> The virtual network integration feature can't use the same subnet as the private endpoint.

## Security considerations

Private endpoints and public access can coexist on an app. For more information, see [this overview of access restrictions](./overview-access-restrictions.md#how-it-works).

To ensure isolation, when you enable private endpoints to your app, be sure to disable public network access. You can enable multiple private endpoints in other virtual networks and subnets, including virtual networks in other regions.

The access restriction rules of your app aren't evaluated for traffic through the private endpoint. You can eliminate the data exfiltration risk from the virtual network. Remove all network security group (NSG) rules where the destination is tag internet or Azure services.

You can find the client source IP in the web HTTP logs of your app. This feature is implemented by using the transmission control protocol (TCP) proxy, which forwards the client IP property up to the app. For more information, see [Getting connection information by using TCP Proxy v2](../private-link/private-link-service-overview.md#getting-connection-information-using-tcp-proxy-v2).

:::image type="content" source="./media/overview-private-endpoint/global-schema-web-app.png" alt-text="Diagram that shows a global overview of App Service private endpoints.":::

## DNS

When you use private endpoint for App Service apps, the requested URL must match the address of your app. By default, without a private endpoint, the public name of your web app is a canonical name to the cluster. For example, the name resolution is:

| Name | Type | Value |
|:-----|:-----|:------|
| `mywebapp.azurewebsites.net` | `CNAME` | `clustername.azurewebsites.windows.net` |
| `clustername.azurewebsites.windows.net` | `CNAME` | `cloudservicename.cloudapp.net` |
| `cloudservicename.cloudapp.net` | `A` | `192.0.2.13` |

When you deploy a private endpoint, the approach updates the domain name system (DNS) entry to point to the canonical name: `mywebapp.privatelink.azurewebsites.net`.
For example, the name resolution is:

| Name | Type | Value | Remark |
|:-----|:-----|:------|:-------|
| `mywebapp.azurewebsites.net` | `CNAME` | `mywebapp.privatelink.azurewebsites.net` | |
| `mywebapp.privatelink.azurewebsites.net` | `CNAME` | `clustername.azurewebsites.windows.net` | |
| `clustername.azurewebsites.windows.net` | `CNAME` | `cloudservicename.cloudapp.net` | |
| `cloudservicename.cloudapp.net` | `A` | `192.0.2.13` | <--This public IP isn't your private endpoint. You receive a 403 error. |

You must set up a private DNS server or an Azure DNS private zone. For tests, you can modify the host entry of your test machine. The DNS zone that you need to create is: `privatelink.azurewebsites.net`. Register the record for your app with an `A` record and the private endpoint IP. With [Azure Private DNS Zone Groups](../private-link/private-endpoint-dns-integration.md#private-dns-zone-group), the DNS records are automatically added to the Private DNS zone.

For example, the name resolution is:

| Name | Type | Value | Remark |
|:----|:----|:-----|:------|
| `mywebapp.azurewebsites.net` | `CNAME` | `mywebapp.privatelink.azurewebsites.net`| <--Azure creates this `CNAME` entry in Azure Public DNS to point the app address to the private endpoint address. |
| `mywebapp.privatelink.azurewebsites.net` | `A` | `10.10.10.8` | <--You manage this entry in your DNS system to point to your private endpoint IP address. |

When you set up this DNS configuration, you can reach your app privately with the default name `mywebapp.azurewebsites.net`. You must use this name, because the default certificate is issued for `*.azurewebsites.net`.

### Custom domain name

If you need to use a custom domain name, add the custom name in your app. You must validate the custom name like any custom name, by using public DNS resolution. For more information, see [custom DNS validation](./app-service-web-tutorial-custom-domain.md).

In your custom DNS zone, you need to update the DNS record to point to the private endpoint. If your app is already configured with DNS resolution for the default host name, the preferred way is to add a `CNAME` record for the custom domain pointing to `mywebapp.azurewebsites.net`. If you only want the custom domain name to resolve to the private endpoint, you can add an `A` record with the private endpoint IP directly.

### Kudu/scm endpoint

For the Kudu console, or Kudu REST API (for deployment with Azure DevOps Services self-hosted agents, for example) you must create a second record pointing to the private endpoint IP in your Azure DNS private zone or your custom DNS server. The first is for your app and the second is for the SCM (source control management) of your app. With Azure Private DNS Zone groups, the scm endpoint is automatically added.

| Name | Type | Value |
|-----|-----|-----|
| `mywebapp.privatelink.azurewebsites.net` | `A` | `PrivateEndpointIP` |
| `mywebapp.scm.privatelink.azurewebsites.net` | `A` | `PrivateEndpointIP` |

## App Service Environment v3 special consideration

In order to enable private endpoint for apps hosted in an IsolatedV2 plan (App Service Environment v3), enable the private endpoint support at the App Service Environment level. You can activate the feature by using the Azure portal in the App Service Environment configuration pane, or through the following CLI:

```azurecli-interactive
az appservice ase update --name myasename --allow-new-private-endpoint-connections true
```

## Specific requirements

If the virtual network is in a different subscription than the app, ensure that the subscription with the virtual network is registered for the `Microsoft.Web` resource provider. To explicitly register the provider, see [Register resource provider](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider). You automatically register the provider when you create the first web app in a subscription.

## Pricing

For pricing details, see [Azure Private Link pricing](https://azure.microsoft.com/pricing/details/private-link/).

## Limitations

- When you use an Azure function in the Elastic Premium plan with a private endpoint, you must have direct network access to run the function in the Azure portal. Otherwise, you receive an HTTP 403 error. Your browser must be able to reach the private endpoint to run the function from the Azure portal.
- You can connect up to 100 private endpoints to a particular app.
- Remote debugging functionality isn't available through the private endpoint. We recommend that you deploy the code to a slot and debug it remotely there.
- FTP access is provided through the inbound public IP address. A private endpoint doesn't support FTP access to the app.
- IP-based TLS isn't supported with private endpoints.
- Apps that you configure with private endpoints can't receive public traffic that comes from subnets with a `Microsoft.Web` service endpoint enabled and can't use [service endpoint-based access restriction rules](./overview-access-restrictions.md#access-restriction-rules-based-on-service-endpoints).
- Private endpoint naming must follow the rules defined for resources of the `Microsoft.Network/privateEndpoints` type. For more information, see [Naming rules and restrictions](../azure-resource-manager/management/resource-name-rules.md#microsoftnetwork).

For up-to-date information about limitations, see [this documentation](../private-link/private-endpoint-overview.md#limitations).

## Related content

- [Quickstart: Create a private endpoint by using the Azure portal](../private-link/create-private-endpoint-portal.md)
- [Quickstart: Create a private endpoint by using the Azure CLI](../private-link/create-private-endpoint-cli.md)
- [Quickstart: Create a private endpoint by using Azure PowerShell](../private-link/create-private-endpoint-powershell.md)
- [Quickstart: Create a private endpoint by using an ARM template](../private-link/create-private-endpoint-template.md)
- [Quickstart: Template for connecting a front-end app to a secured back-end app with virtual network integration and a private endpoint](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/webapp-privateendpoint-vnet-injection)
- [Script: Create two web apps connected securely with a private endpoint and virtual network integration (Terraform)](./scripts/terraform-secure-backend-frontend.md)
