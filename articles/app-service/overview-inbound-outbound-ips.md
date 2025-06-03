---
title: Inbound/Outbound IP addresses
description: Learn how inbound and outbound IP addresses are used in Azure App Service, when they change, and how to find the addresses for your app.
author: msangapu-msft
ms.author: msangapu
ms.topic: article
ms.date: 03/10/2025
ms.custom:
  - UpdateFrequency3
  - build-2025
---

# Inbound and outbound IP addresses in Azure App Service

[Azure App Service](overview.md) is a multitenant service, except for [App Service Environments](environment/intro.md). Apps that aren't in an App Service environment (not in the [Isolated tier](https://azure.microsoft.com/pricing/details/app-service/)) share network infrastructure with other apps. As a result, the inbound and outbound IP addresses of an app can be different, and can even change in certain situations.

[App Service Environments](environment/intro.md) use dedicated network infrastructures, so apps running in an App Service environment get static, dedicated IP addresses both for inbound and outbound connections.

## How IP addresses work in App Service

An App Service app runs in an App Service plan, and App Service plans are deployed into one of the deployment units in the Azure infrastructure (internally called a webspace). Each deployment unit is assigned a set of virtual IP addresses, which includes one public inbound IP address and a set of [outbound IP addresses](#find-outbound-ips). All App Service plans in the same deployment unit, and app instances that run in them, share the same set of virtual IP addresses. For an App Service Environment (an App Service plan in [Isolated tier](https://azure.microsoft.com/pricing/details/app-service/)), the App Service plan is the deployment unit itself, so the virtual IP addresses are dedicated to it as a result.

Because you're not allowed to move an App Service plan between deployment units, the virtual IP addresses assigned to your app usually remain the same, but there are exceptions.

> [!NOTE]
> The Premium V4 tier does not provide a stable set of outbound IP addresses.  This behavior is intentional.  Although applications running on the Premium V4 tier can make outbound calls to internet-facing endpoints, the App Service platform does not provide a stable set of outbound IP addresses for the Premium V4 tier.  This is a change in behavior from previous App Service pricing tiers.  The portal will show "Dynamic" for outbound IP addresses and additional outbound IP addresses information for applications using Premium V4.  ARM and CLI calls will return empty strings for the values of *outboundIpAddresses* and *possibleOutboundIpAddresses*.  If applications running on Premium V4 require a stable outbound IP address(es), developers will need to use a solution like [Azure NAT Gateway](overview-nat-gateway-integration.md) to get a predictable IP address for outbound internet-facing traffic.

## When inbound IP changes

Regardless of the number of scaled-out instances, each app has a single inbound IP address. The inbound IP address may change when you perform one of the following actions:

- Delete an app and recreate it in a different resource group (deployment unit may change).
- Delete the last app in a resource group _and_ region combination and recreate it (deployment unit may change).
- Delete an existing IP-based TLS binding, such as during certificate renewal (see [Renew certificate](configure-ssl-certificate.md#renew-an-expiring-certificate)).

## Find the inbound IP

Just run the following command in a local terminal:

```bash
nslookup <app-name>.azurewebsites.net
```

## Get a static inbound IP

Sometimes you might want a dedicated, static IP address for your app. To get a static inbound IP address, you need to [secure a custom DNS name with an IP-based certificate binding](./configure-ssl-bindings.md). If you don't actually need TLS functionality to secure your app, you can even upload a self-signed certificate for this binding. In an IP-based TLS binding, the certificate is bound to the IP address itself, so App Service creates a static IP address to make it happen. 

## When outbound IPs change

Regardless of the number of scaled-out instances, each app has a set number of outbound IP addresses at any given time. Any outbound connection from the App Service app, such as to a back-end database, uses one of the outbound IP addresses as the origin IP address. The IP address to use is selected randomly at runtime, so your back-end service must open its firewall to all the outbound IP addresses for your app.

The set of outbound IP addresses for your app changes when you perform one of the following actions:

- Delete an app and recreate it in a different resource group (deployment unit may change).
- Delete the last app in a resource group _and_ region combination and recreate it (deployment unit may change).
- Scale your app between the lower tiers (**Basic**, **Standard**, and **Premium**), the **PremiumV2** tier, the **PremiumV3** tier, and the **Pmv3** options within the **PremiumV3** tier (IP addresses may be added to or subtracted from the set).

You can find the set of all possible outbound IP addresses your app can use, regardless of pricing tiers, by looking for the `possibleOutboundIpAddresses` property or in the **Additional Outbound IP Addresses** field in the **Properties** page in the Azure portal. See [Find outbound IPs](#find-outbound-ips).

The set of all possible outbound IP addresses can increase over time if App Service adds new pricing tiers or options to existing App Service deployments. For example, if App Service adds the **PremiumV3** tier to an existing App Service deployment, then the set of all possible outbound IP addresses increases. Similarly, if App Service adds new **Pmv3** options to a deployment that already supports the **PremiumV3** tier, then the set of all possible outbound IP addresses increases. Adding IP addresses to a deployment has no immediate effect since the outbound IP addresses for running applications don't change when a new pricing tier or option is added to an App Service deployment. However, if applications switch to a new pricing tier or option that wasn't previously available, then new outbound addresses are used and customers need to update downstream firewall rules and IP address restrictions.

## Find outbound IPs

To find the outbound IP addresses currently used by your app in the Azure portal, select **Properties** in your app's left-hand navigation. They're listed in the **Outbound IP Addresses** field.

You can find the same information by running the following command in the [Cloud Shell](../cloud-shell/quickstart.md).

```azurecli-interactive
az webapp show --resource-group <group_name> --name <app_name> --query outboundIpAddresses --output tsv
```

```azurepowershell
(Get-AzWebApp -ResourceGroup <group_name> -name <app_name>).OutboundIpAddresses
```

To find _all_ possible outbound IP addresses for your app, regardless of pricing tiers, select **Properties** in your app's left-hand navigation. They're listed in the **Additional Outbound IP Addresses** field.

You can find the same information by running the following command in the [Cloud Shell](../cloud-shell/quickstart.md).

```azurecli-interactive
az webapp show --resource-group <group_name> --name <app_name> --query possibleOutboundIpAddresses --output tsv
```

```azurepowershell
(Get-AzWebApp -ResourceGroup <group_name> -name <app_name>).PossibleOutboundIpAddresses
```

For function apps, see [Function app outbound IP addresses](/azure/azure-functions/ip-addresses?tabs=azure-powershell#find-outbound-ip-addresses).

## Get a static outbound IP

You can control the IP address of outbound traffic from your app by using virtual network integration together with a virtual network NAT gateway to direct traffic through a static public IP address. [Virtual network integration](./overview-vnet-integration.md) is available on **Basic**, **Standard**, **Premium**, **PremiumV2**, and **PremiumV3** App Service plans. To learn more about this setup, see [NAT gateway integration](./networking/nat-gateway-integration.md).

## IP Address properties in Azure portal

IP Addresses appear in multiple places in Azure portal. The properties page will show you the raw output from `inboundIpAddress`, `possibleInboundIpAddresses`, `outboundIpAddresses`, and `possibleOutboundIpAddresses`. The overview page will also show the same values, but not include the **Possible Inbound IP Addresses**.

Networking overview shows the combination of **Inbound IP Address** and any private endpoint IP addresses in the **Inbound addresses** field. If public network access is disabled, the public IP address won't be shown. The **Outbound addresses** field has a combined list of **(Possible) Outbound IP Addresses**, and if the app is virtual network integrated and is routing all traffic, and the subnet has a NAT gateway attached, the field will also include the IP addresses from the NAT gateway.

:::image type="content" source="./media/overview-inbound-outbound-ips/networking-overview.png" alt-text="Screenshot that shows how IP addresses are shown in the networking overview page.":::

## Service tag

By using the `AppService` service tag, you can define network access for the Azure App Service service without specifying individual IP addresses. The service tag is a group of IP address prefixes that you use to minimize the complexity of creating security rules. When you use service tags, Azure automatically updates the IP addresses as they change for the service. However, the service tag isn't a security control mechanism. The service tag is merely a list of IP addresses.

The `AppService` service tag includes only the inbound IP addresses of multitenant apps. Inbound IP addresses from apps deployed in isolated (App Service Environment) and apps using [IP-based TLS bindings](./configure-ssl-bindings.md) aren't included. Further all outbound IP addresses used in both multitenant and isolated aren't included in the tag.

The tag can be used to allow outbound traffic in a Network security group (NSG) to apps. If the app is using IP-based TLS or the app is deployed in isolated mode, you must use the dedicated IP address instead. As the tag only includes inbound IP addresses, the tag can't be used in access restrictions to limit access to an app from other apps in App Service.

> [!NOTE]
> Service tag helps you define network access, but it shouldn't be considered as a replacement for proper network security measures as it doesn't provide granular control over individual IP addresses.

## Next steps

* Learn how to [restrict inbound traffic](./app-service-ip-restrictions.md) by source IP addresses.
* Learn more about [service tags](../virtual-network/service-tags-overview.md).
