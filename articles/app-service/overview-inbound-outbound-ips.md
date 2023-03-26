---
title: Inbound/Outbound IP addresses
description: Learn how inbound and outbound IP addresses are used in Azure App Service, when they change, and how to find the addresses for your app.
ms.author: msangapu
ms.topic: article
ms.date: 08/25/2020
ms.custom: "UpdateFrequency3, devx-track-azurepowershell"

---

# Inbound and outbound IP addresses in Azure App Service

[Azure App Service](overview.md) is a multi-tenant service, except for [App Service Environments](environment/intro.md). Apps that are not in an App Service environment (not in the [Isolated tier](https://azure.microsoft.com/pricing/details/app-service/)) share network infrastructure with other apps. As a result, the inbound and outbound IP addresses of an app can be different, and can even change in certain situations.

[App Service Environments](environment/intro.md) use dedicated network infrastructures, so apps running in an App Service environment get static, dedicated IP addresses both for inbound and outbound connections.

## How IP addresses work in App Service

An App Service app runs in an App Service plan, and App Service plans are deployed into one of the deployment units in the Azure infrastructure (internally called a webspace). Each deployment unit is assigned a set of virtual IP addresses, which includes one public inbound IP address and a set of [outbound IP addresses](#find-outbound-ips). All App Service plans in the same deployment unit, and app instances that run in them, share the same set of virtual IP addresses. For an App Service Environment (an App Service plan in [Isolated tier](https://azure.microsoft.com/pricing/details/app-service/)), the App Service plan is the deployment unit itself, so the virtual IP addresses are dedicated to it as a result.

Because you're not allowed to move an App Service plan between deployment units, the virtual IP addresses assigned to your app usually remain the same, but there are exceptions.

## When inbound IP changes

Regardless of the number of scaled-out instances, each app has a single inbound IP address. The inbound IP address may change when you perform one of the following actions:

- Delete an app and recreate it in a different resource group (deployment unit may change).
- Delete the last app in a resource group _and_ region combination and recreate it (deployment unit may change).
- Delete an existing IP-based TLS/SSL binding, such as during certificate renewal (see [Renew certificate](configure-ssl-certificate.md#renew-an-expiring-certificate)).

## Find the inbound IP

Just run the following command in a local terminal:

```bash
nslookup <app-name>.azurewebsites.net
```

## Get a static inbound IP

Sometimes you might want a dedicated, static IP address for your app. To get a static inbound IP address, you need to [secure a custom DNS name with an IP-based certificate binding](configure-ssl-bindings.md). If you don't actually need TLS functionality to secure your app, you can even upload a self-signed certificate for this binding. In an IP-based TLS binding, the certificate is bound to the IP address itself, so App Service provisions a static IP address to make it happen. 

## When outbound IPs change

Regardless of the number of scaled-out instances, each app has a set number of outbound IP addresses at any given time. Any outbound connection from the App Service app, such as to a back-end database, uses one of the outbound IP addresses as the origin IP address. The IP address to use is selected randomly at runtime, so your back-end service must open its firewall to all the outbound IP addresses for your app.

The set of outbound IP addresses for your app changes when you perform one of the following actions:

- Delete an app and recreate it in a different resource group (deployment unit may change).
- Delete the last app in a resource group _and_ region combination and recreate it (deployment unit may change).
- Scale your app between the lower tiers (**Basic**, **Standard**, and **Premium**), the **PremiumV2**, and the **PremiumV3** tier (IP addresses may be added to or subtracted from the set).

You can find the set of all possible outbound IP addresses your app can use, regardless of pricing tiers, by looking for the `possibleOutboundIpAddresses` property or in the **Additional Outbound IP Addresses** field in the **Properties** blade in the Azure portal. See [Find outbound IPs](#find-outbound-ips).

## Find outbound IPs

To find the outbound IP addresses currently used by your app in the Azure portal, click **Properties** in your app's left-hand navigation. They are listed in the **Outbound IP Addresses** field.

You can find the same information by running the following command in the [Cloud Shell](../cloud-shell/quickstart.md).

```azurecli-interactive
az webapp show --resource-group <group_name> --name <app_name> --query outboundIpAddresses --output tsv
```

```azurepowershell
(Get-AzWebApp -ResourceGroup <group_name> -name <app_name>).OutboundIpAddresses
```

To find _all_ possible outbound IP addresses for your app, regardless of pricing tiers, click **Properties** in your app's left-hand navigation. They are listed in the **Additional Outbound IP Addresses** field.

You can find the same information by running the following command in the [Cloud Shell](../cloud-shell/quickstart.md).

```azurecli-interactive
az webapp show --resource-group <group_name> --name <app_name> --query possibleOutboundIpAddresses --output tsv
```

```azurepowershell
(Get-AzWebApp -ResourceGroup <group_name> -name <app_name>).PossibleOutboundIpAddresses
```

## Get a static outbound IP
You can control the IP address of outbound traffic from your app by using regional VNet integration together with a virtual network NAT gateway to direct traffic through a static public IP address. [Regional VNet integration](./overview-vnet-integration.md) is available on **Basic**, **Standard**, **Premium**, **PremiumV2** and **PremiumV3** App Service plans. To learn more about this setup, see [NAT gateway integration](./networking/nat-gateway-integration.md).

## Next steps

Learn how to restrict inbound traffic by source IP addresses.

> [!div class="nextstepaction"]
> [Static IP restrictions](app-service-ip-restrictions.md)
