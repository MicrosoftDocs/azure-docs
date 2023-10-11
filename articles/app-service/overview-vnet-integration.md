---
title: Integrate your app with an Azure virtual network
description: Integrate your app in Azure App Service with Azure virtual networks.
author: madsd
ms.topic: conceptual
ms.date: 07/21/2023
ms.author: madsd
ms.custom: UpdateFrequency3

---
# <a name="regional-virtual-network-integration"></a>Integrate your app with an Azure virtual network

This article describes the Azure App Service virtual network integration feature and how to set it up with apps in [App Service](./overview.md). With [Azure virtual networks](../virtual-network/virtual-networks-overview.md), you can place many of your Azure resources in a non-internet-routable network. The App Service virtual network integration feature enables your apps to access resources in or through a virtual network.

>[!NOTE]
> Information about Gateway-required virtual network integration has [moved to a new location](./configure-gateway-required-vnet-integration.md).

App Service has two variations:

* The dedicated compute pricing tiers, which include the Basic, Standard, Premium, Premium v2, and Premium v3.
* The App Service Environment, which deploys directly into your virtual network with dedicated supporting infrastructure and is using the Isolated and Isolated v2 pricing tiers.

The virtual network integration feature is used in Azure App Service dedicated compute pricing tiers. If your app is in an [App Service Environment](./environment/overview.md), it's already integrated with a virtual network and doesn't require you to configure virtual network integration feature to reach resources in the same virtual network. For more information on all the networking features, see [App Service networking features](./networking-features.md).

Virtual network integration gives your app access to resources in your virtual network, but it doesn't grant inbound private access to your app from the virtual network. Private site access refers to making an app accessible only from a private network, such as from within an Azure virtual network. Virtual network integration is used only to make outbound calls from your app into your virtual network. Refer to [private endpoint](./networking/private-endpoint.md) for inbound private access.

The virtual network integration feature:

* Requires a [supported Basic or Standard](./overview-vnet-integration.md#limitations), Premium, Premium v2, Premium v3, or Elastic Premium App Service pricing tier.
* Supports TCP and UDP.
* Works with App Service apps, function apps and Logic apps.

There are some things that virtual network integration doesn't support, like:

* Mounting a drive.
* Windows Server Active Directory domain join.
* NetBIOS.

Virtual network integration supports connecting to a virtual network in the same region. Using virtual network integration enables your app to access:

* Resources in the virtual network you're integrated with.
* Resources in virtual networks peered to the virtual network your app is integrated with including global peering connections.
* Resources across Azure ExpressRoute connections.
* Service endpoint-secured services.
* Private endpoint-enabled services.

When you use virtual network integration, you can use the following Azure networking features:

* **Network security groups (NSGs)**: You can block outbound traffic with an NSG that's placed on your integration subnet. The inbound rules don't apply because you can't use virtual network integration to provide inbound access to your app.
* **Route tables (UDRs)**: You can place a route table on the integration subnet to send outbound traffic where you want.
* **NAT gateway**: You can use [NAT gateway](./networking/nat-gateway-integration.md) to get a dedicated outbound IP and mitigate SNAT port exhaustion.

Learn [how to enable virtual network integration](./configure-vnet-integration-enable.md).

## <a name="how-regional-virtual-network-integration-works"></a> How virtual network integration works

Apps in App Service are hosted on worker roles. Virtual network integration works by mounting virtual interfaces to the worker roles with addresses in the delegated subnet. The virtual interfaces used aren't resources customers have direct access to. Because the from address is in your virtual network, it can access most things in or through your virtual network like a VM in your virtual network would.

:::image type="content" source="./media/overview-vnet-integration/vnetint-how-regional-works.png" alt-text="Diagram that shows how virtual network integration works.":::

When virtual network integration is enabled, your app makes outbound calls through your virtual network. The outbound addresses that are listed in the app properties portal are the addresses still used by your app. However, if your outbound call is to a virtual machine or private endpoint in the integration virtual network or peered virtual network, the outbound address is an address from the integration subnet. The private IP assigned to an instance is exposed via the environment variable, WEBSITE_PRIVATE_IP.

When all traffic routing is enabled, all outbound traffic is sent into your virtual network. If all traffic routing isn't enabled, only private traffic (RFC1918) and service endpoints configured on the integration subnet is sent into the virtual network. Outbound traffic to the internet is routed directly from the app.

For Windows App Service plans, the virtual network integration feature supports two virtual interfaces per worker. Two virtual interfaces per worker mean two virtual network integrations per App Service plan. In other words, a Windows App Service plan can have virtual network integrations with up to two subnets/virtual networks. The apps in the same App Service plan can only use one of the virtual network integrations to a specific subnet, meaning an app can only have a single virtual network integration at a given time. Linux App Service plans support only one virtual network integration per plan.

## Subnet requirements

Virtual network integration depends on a dedicated subnet. When you create a subnet, the Azure subnet consumes five IPs from the start. One address is used from the integration subnet for each App Service plan instance. If you scale your app to four instances, then four addresses are used.

When you scale up/down in size or in/out in number of instances, the required address space is doubled for a short period of time. The scale operation adds the same number of new instances and then deletes the existing instances. The scale operation affects the real, available supported instances for a given subnet size. Platform upgrades need free IP addresses to ensure upgrades can happen without interruptions to outbound traffic. Finally, after scale up, down, or in operations complete, there might be a short period of time before IP addresses are released. 

Because subnet size can't be changed after assignment, use a subnet that's large enough to accommodate whatever scale your app might reach. You should also reserve IP addresses for platform upgrades. To avoid any issues with subnet capacity, use a `/26` with 64 addresses. When you're creating subnets in Azure portal as part of integrating with the virtual network, a minimum size of /27 is required. If the subnet already exists before integrating through the portal, you can use a /28 subnet.

>[!NOTE]
> Windows Containers uses an additional IP address per app for each App Service plan instance, and you need to size the subnet accordingly. If you have for example 10 Windows Container App Service plan instances with 4 apps running, you will need 50 IP addresses and additional addresses to support horizontal (in/out) scale.
>
> Sample calculation:
>
> For each App Service plan instance, you need:  
> 4 Windows Container apps = 4 IP addresses  
> 1 IP address per App Service plan instance  
> 4 + 1 = 5 IP addresses
>
> For 10 instances:  
> 5 x 10 = 50 IP addresses per App Service plan
>
> Since you have 1 App Service plan, 1 x 50 = 50 IP addresses.

When you want your apps in your plan to reach a virtual network that's already connected to by apps in another plan, select a different subnet than the one being used by the pre-existing virtual network integration.

## Permissions

You must have at least the following Role-based access control permissions on the subnet or at a higher level to configure virtual network integration through Azure portal, CLI or when setting the `virtualNetworkSubnetId` site property directly:

| Action | Description |
|-|-|
| Microsoft.Network/virtualNetworks/read | Read the virtual network definition |
| Microsoft.Network/virtualNetworks/subnets/read | Read a virtual network subnet definition |
| Microsoft.Network/virtualNetworks/subnets/join/action | Joins a virtual network |

If the virtual network is in a different subscription than the app, you must ensure that the subscription with the virtual network is registered for the `Microsoft.Web` resource provider. You can explicitly register the provider [by following this documentation](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider), but it's automatically registered when creating the first web app in a subscription.

## Routes

You can control what traffic goes through the virtual network integration. There are three types of routing to consider when you configure virtual network integration. [Application routing](#application-routing) defines what traffic is routed from your app and into the virtual network. [Configuration routing](#configuration-routing) affects operations that happen before or during startup of your app. Examples are container image pull and [app settings with Key Vault reference](./app-service-key-vault-references.md). [Network routing](#network-routing) is the ability to handle how both app and configuration traffic are routed from your virtual network and out.

Through application routing or configuration routing options, you can configure what traffic is sent through the virtual network integration. Traffic is only subject to [network routing](#network-routing) if it's sent through the virtual network integration.

### Application routing

Application routing applies to traffic that is sent from your app after it has been started. See [configuration routing](#configuration-routing) for traffic during startup. When you configure application routing, you can either route all traffic or only private traffic (also known as [RFC1918](https://datatracker.ietf.org/doc/html/rfc1918#section-3) traffic) into your virtual network. You configure this behavior through the outbound internet traffic setting. If outbound internet traffic routing is disabled, your app only routes private traffic into your virtual network. If you want to route all your outbound app traffic into your virtual network, make sure that outbound internet traffic is enabled.

* Only traffic configured in application or configuration routing is subject to the NSGs and UDRs that are applied to your integration subnet.
* When outbound internet traffic routing is enabled, the source address for your outbound traffic from your app is still one of the IP addresses that are listed in your app properties. If you route your traffic through a firewall or a NAT gateway, the source IP address originates from this service.

Learn [how to configure application routing](./configure-vnet-integration-routing.md#configure-application-routing).

> [!NOTE]
> Outbound SMTP connectivity (port 25) is supported for App Service when the SMTP traffic is routed through the virtual network integration. The supportability is determined by a setting on the subscription where the virtual network is deployed. For virtual networks/subnets created before 1. August 2022 you need to initiate a temporary configuration change to the virtual network/subnet for the setting to be synchronized from the subscription. An example could be to add a temporary subnet, associate/dissociate an NSG temporarily or configure a service endpoint temporarily. For more information, see [Troubleshoot outbound SMTP connectivity problems in Azure](../virtual-network/troubleshoot-outbound-smtp-connectivity.md).

### Configuration routing

When you're using virtual network integration, you can configure how parts of the configuration traffic are managed. By default, configuration traffic goes directly over the public route, but for the mentioned individual components, you can actively configure it to be routed through the virtual network integration.

#### Content share

Bringing your own storage for content in often used in Functions where [content share](./../azure-functions/configure-networking-how-to.md#restrict-your-storage-account-to-a-virtual-network) is configured as part of the Functions app.

To route content share traffic through the virtual network integration, you must ensure that the routing setting is configured. Learn [how to configure content share routing](./configure-vnet-integration-routing.md#content-share). 

In addition to configuring the routing, you must also ensure that any firewall or Network Security Group configured on traffic from the subnet allow traffic to port 443 and 445.

#### Container image pull

When using custom containers, you can pull the container over the virtual network integration. To route the container pull traffic through the virtual network integration, you must ensure that the routing setting is configured. Learn [how to configure image pull routing](./configure-vnet-integration-routing.md#container-image-pull).

#### Backup/restore

App Service has built-in backup/restore, but if you want to back up to your own storage account, you can use the custom backup/restore feature. If you want to route the traffic to the storage account through the virtual network integration, you must configure the route setting. Database backup isn't supported over the virtual network integration.

#### App settings using Key Vault references

App settings using Key Vault references attempt to get secrets over the public route. If the Key Vault is blocking public traffic and the app is using virtual network integration, an attempt is made to get the secrets through the virtual network integration.

> [!NOTE]
> * Configure SSL/TLS certificates from private Key Vaults is currently not supported.
> * App Service Logs to private storage accounts is currently not supported. We recommend using Diagnostics Logging and allowing Trusted Services for the storage account.

### Network routing

You can use route tables to route outbound traffic from your app without restriction. Common destinations can include firewall devices or gateways. You can also use a [network security group](../virtual-network/network-security-groups-overview.md) (NSG) to block outbound traffic to resources in your virtual network or the internet. An NSG that's applied to your integration subnet is in effect regardless of any route tables applied to your integration subnet.

Route tables and network security groups only apply to traffic routed through the virtual network integration. See [application routing](#application-routing) and [configuration routing](#configuration-routing) for details. Routes don't apply to replies from inbound app requests and inbound rules in an NSG don't apply to your app. Virtual network integration affects only outbound traffic from your app. To control inbound traffic to your app, use the [access restrictions](./overview-access-restrictions.md) feature or [private endpoints](./networking/private-endpoint.md).

When configuring network security groups or route tables that applies to outbound traffic, you must make sure you consider your application dependencies. Application dependencies include endpoints that your app needs during runtime. Besides APIs and services the app is calling, these endpoints could also be derived endpoints like certificate revocation list (CRL) check endpoints and identity/authentication endpoint, for example Microsoft Entra ID. If you're using [continuous deployment in App Service](./deploy-continuous-deployment.md), you might also need to allow endpoints depending on type and language. Specifically for [Linux continuous deployment](https://github.com/microsoft/Oryx/blob/main/doc/hosts/appservice.md#network-dependencies), you need to allow `oryx-cdn.microsoft.io:443`. For Python you additionally need to allow `files.pythonhosted.org`, `pypi.org`.

When you want to route outbound traffic on-premises, you can use a route table to send outbound traffic to your Azure ExpressRoute gateway. If you do route traffic to a gateway, set routes in the external network to send any replies back. Border Gateway Protocol (BGP) routes also affect your app traffic. If you have BGP routes from something like an ExpressRoute gateway, your app outbound traffic is affected. Similar to user-defined routes, BGP routes affect traffic according to your routing scope setting.

## Service endpoints

Virtual network integration enables you to reach Azure services that are secured with service endpoints. To access a service endpoint-secured service, follow these steps:

1. Configure virtual network integration with your web app to connect to a specific subnet for integration.
1. Go to the destination service and configure service endpoints against the integration subnet.

## Private endpoints

If you want to make calls to [private endpoints](./networking/private-endpoint.md), make sure that your DNS lookups resolve to the private endpoint. You can enforce this behavior in one of the following ways:

* Integrate with Azure DNS private zones. When your virtual network doesn't have a custom DNS server, the integration is done automatically when the zones are linked to the virtual network.
* Manage the private endpoint in the DNS server used by your app. To manage the configuration, you must know the private endpoint IP address. Then point the endpoint you're trying to reach to that address by using an A record.
* Configure your own DNS server to forward to Azure DNS private zones.

## Azure DNS private zones

After your app integrates with your virtual network, it uses the same DNS server that your virtual network is configured with. If no custom DNS is specified, it uses Azure default DNS and any private zones linked to the virtual network.

## Limitations

There are some limitations with using virtual network integration:

* The feature is available from all App Service deployments in Premium v2 and Premium v3. It's also available in Basic and Standard tier but only from newer App Service deployments. If you're on an older deployment, you can only use the feature from a Premium v2 App Service plan. If you want to make sure you can use the feature in a Basic or Standard App Service plan, create your app in a Premium v3 App Service plan. Those plans are only supported on our newest deployments. You can scale down if you want after the plan is created.
* The feature isn't available for Isolated plan apps in an App Service Environment.
* You can't reach resources across peering connections with classic virtual networks.
* The feature requires an unused subnet that's an IPv4 `/28` block or larger in an Azure Resource Manager virtual network.
* The app and the virtual network must be in the same region.
* The integration virtual network can't have IPv6 address spaces defined.
* The integration subnet can't have [service endpoint policies](../virtual-network/virtual-network-service-endpoint-policies-overview.md) enabled.
* The integration subnet can be used by only one App Service plan.
* You can't delete a virtual network with an integrated app. Remove the integration before you delete the virtual network.
* You can't have more than two virtual network integrations per Windows App Service plan. You can't have more than one virtual network integration per Linux App Service plan. Multiple apps in the same App Service plan can use the same virtual network integration.
* You can't change the subscription of an app or a plan while there's an app that's using virtual network integration.

## Access on-premises resources

No extra configuration is required for the virtual network integration feature to reach through your virtual network to on-premises resources. You simply need to connect your virtual network to on-premises resources by using ExpressRoute or a site-to-site VPN.

## Peering

If you use peering with virtual network integration, you don't need to do any more configuration.

## Manage virtual network integration

Connecting and disconnecting with a virtual network is at an app level. Operations that can affect virtual network integration across multiple apps are at the App Service plan level. From the app > **Networking** > **VNet integration** portal, you can get details on your virtual network. You can see similar information at the App Service plan level in the **App Service plan** > **Networking** > **VNet integration** portal.

In the app view of your virtual network integration instance, you can disconnect your app from the virtual network and you can configure application routing. To disconnect your app from a virtual network, select **Disconnect**. Your app is restarted when you disconnect from a virtual network. Disconnecting doesn't change your virtual network. The subnet isn't removed. If you then want to delete your virtual network, first disconnect your app from the virtual network.

The private IP assigned to the instance is exposed via the environment variable WEBSITE_PRIVATE_IP. Kudu console UI also shows the list of environment variables available to the web app. This IP is assigned from the address range of the integrated subnet. This IP is used by the web app to connect to the resources through the Azure virtual network.

> [!NOTE]
> The value of WEBSITE_PRIVATE_IP is bound to change. However, it will be an IP within the address range of the integration subnet, so you'll need to allow access from the entire address range.
>

## Pricing details

The virtual network integration feature has no extra charge for use beyond the App Service plan pricing tier charges.

## Troubleshooting

The feature is easy to set up, but that doesn't mean your experience is problem free. If you encounter problems accessing your desired endpoint, there are various steps you can take depending on what you are observing. For more information, see [virtual network integration troubleshooting guide](/troubleshoot/azure/app-service/troubleshoot-vnet-integration-apps).

> [!NOTE]
> * Virtual network integration isn't supported for Docker Compose scenarios in App Service.
> * Access restrictions does not apply to traffic coming through a private endpoint.

### Deleting the App Service plan or app before disconnecting the network integration

If you deleted the app or the App Service plan without disconnecting the virtual network integration first, you aren't able to do any update/delete operations on the virtual network or subnet that was used for the integration with the deleted resource. A subnet delegation 'Microsoft.Web/serverFarms' remains assigned to your subnet and prevents the update/delete operations. 

In order to do update/delete the subnet or virtual network again, you need to re-create the virtual network integration, and then disconnect it:
1. Re-create the App Service plan and app (it's mandatory to use the exact same web app name as before).
1. Navigate to **Networking** on the app in Azure portal and configure the virtual network integration. 
1. After the virtual network integration is configured, select the 'Disconnect' button.
1. Delete the App Service plan or app. 
1. Update/Delete the subnet or virtual network.

If you still encounter issues with the virtual network integration after following these steps, contact Microsoft Support.
