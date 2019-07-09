---
title: Inbound/Outbound IP addresses - Azure App Service | Microsoft Docs
description: Describes how inbound and outbound IP addresses are used in App Service and how to find information on them for your app.
services: app-service
documentationcenter: ''
author: cephalin
manager: cfowler
editor: ''

ms.service: app-service
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/06/2019
ms.author: cephalin
ms.custom: seodec18

---

# Inbound and outbound IP addresses in Azure App Service

[Azure App Service](overview.md) is a multi-tenant service, except for [App Service Environments](environment/intro.md). Apps that are not in an App Service environment (not in the [Isolated tier](https://azure.microsoft.com/pricing/details/app-service/)) share network infrastructure with other apps. As a result, the inbound and outbound IP addresses of an app can be different, and can even change in certain situations. 

[App Service Environments](environment/intro.md) use dedicated network infrastructures, so apps running in an App Service environment get static, dedicated IP addresses both for inbound and outbound connections.

## When inbound IP changes

Regardless of the number of scaled-out instances, each app has a single inbound IP address. The inbound IP address may change when you perform one of the following actions:

- Delete an app and recreate it in a different resource group.
- Delete the last app in a resource group _and_ region combination and recreate it.
- Delete an existing SSL binding, such as during certificate renewal (see [Renew certificates](app-service-web-tutorial-custom-ssl.md#renew-certificates)).

## Find the inbound IP

Just run the following command in a local terminal:

```bash
nslookup <app-name>.azurewebsites.net
```

## Get a static inbound IP

Sometimes you might want a dedicated, static IP address for your app. To get a static inbound IP address, you need to configure an [IP-based SSL binding](app-service-web-tutorial-custom-ssl.md#secure-a-custom-domain). If you don't actually need SSL functionality to secure your app, you can even upload a self-signed certificate for this binding. In an IP-based SSL binding, the certificate is bound to the IP address itself, so App Service provisions a static IP address to make it happen. 

## When outbound IPs change

Regardless of the number of scaled-out instances, each app has a set number of outbound IP addresses at any given time. Any outbound connection from the App Service app, such as to a back-end database, uses one of the outbound IP addresses as the origin IP address. You can't know beforehand which IP address a given app instance will use to make the outbound connection, so your back-end service must open its firewall to all the outbound IP addresses of your app.

The set of outbound IP addresses for your app changes when you scale your app between the lower tiers (**Basic**, **Standard**, and **Premium**) and the **Premium V2** tier.

You can find the set of all possible outbound IP addresses your app can use, regardless of pricing tiers, by looking for the `possibleOutboundIPAddresses` property or in the **Additional Outbound IP Addresses** field in the **Properties** blade in the Azure portal. See [Find outbound IPs](#find-outbound-ips).

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

## Next steps

Learn how to restrict inbound traffic by source IP addresses.

> [!div class="nextstepaction"]
> [Static IP restrictions](app-service-ip-restrictions.md)
