---
title: IP addresses in Azure Functions
description: Learn how to find inbound and outbound IP addresses for function apps, and what causes them to change.
services: functions
documentationcenter: 
author: ggailey777
manager: jeconnoc

ms.service: azure-functions
ms.topic: conceptual
ms.date: 07/18/2018
ms.author: glenga
---

# IP addresses in Azure Functions

This article explains the following topics related to IP addresses of function apps:

* How to find the IP addresses currently in use by a function app.
* What causes a function app's IP addresses to be changed.
* How to restrict the IP addresses that can access a function app.
* How to get dedicated IP addresses for a function app.

IP addresses are associated with function apps, not with individual functions. Incoming HTTP requests can't use the inbound IP address to call individual functions; they must use the default domain name (functionappname.azurewebsites.net) or a custom domain name.

## Function app inbound IP address

Each function app has a single inbound IP address. To find that IP address:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Navigate to the function app.
3. Select **Platform features**.
4. Select **Properties**, and the inbound IP address appears under **Virtual IP address**.

## <a name="find-outbound-ip-addresses"></a>Function app outbound IP addresses

Each function app has a set of available outbound IP addresses. Any outbound connection from a function, such as to a back-end database, uses one of the available outbound IP addresses as the origin IP address. You can't know beforehand which IP address a given connection will use. For this reason, your back-end service must open its firewall to all of the function app's outbound IP addresses.

To find the outbound IP addresses available to a function app:

1. Sign in to the [Azure Resource Explorer](https://resources.azure.com).
2. Select **subscriptions > {your subscription} > providers > Microsoft.Web > sites**.
3. In the JSON panel, find the site with an `id` property that ends in the name of your function app.
4. See `outboundIpAddresses` and `possibleOutboundIpAddresses`. 

The set of `outboundIpAddresses` is currently available to the function app. The set of `possibleOutboundIpAddresses` includes IP addresses that will be available only if the function app [scales to other pricing tiers](#outbound-ip-address-changes).

An alternative way to find the available outbound IP addresses is by using the [Cloud Shell](../cloud-shell/quickstart.md):

```azurecli-interactive
az webapp show --resource-group <group_name> --name <app_name> --query outboundIpAddresses --output tsv
az webapp show --resource-group <group_name> --name <app_name> --query possibleOutboundIpAddresses --output tsv
```

## Data center outbound IP addresses

If you need to whitelist the outbound IP addresses used by your function apps, another option is to whitelist the function apps' data center (Azure region). You can [download a JSON file that lists IP addresses for all Azure data centers](https://www.microsoft.com/en-us/download/details.aspx?id=56519). Then find the JSON fragment that applies to the region that your function app runs in.

For example, this is what the Western Europe JSON fragment might look like:

```
{
  "name": "AzureCloud.westeurope",
  "id": "AzureCloud.westeurope",
  "properties": {
    "changeNumber": 9,
    "region": "westeurope",
    "platform": "Azure",
    "systemService": "",
    "addressPrefixes": [
      "13.69.0.0/17",
      "13.73.128.0/18",
      ... Some IP addresses not shown here
     "213.199.180.192/27",
     "213.199.183.0/24"
    ]
  }
}
```

 For information about when this file is updated and when the IP addresses change, expand the **Details** section of the [Download Center page](https://www.microsoft.com/en-us/download/details.aspx?id=56519).

## Inbound IP address changes

 The inbound IP address **might** change when you:

- Delete a function app and recreate it in a different resource group.
- Delete the last function app in a resource group and region combination, and re-create it.
- Delete an SSL binding, such as during [certificate renewal](../app-service/app-service-web-tutorial-custom-ssl.md#renew-certificates)).

The inbound IP address might also change when you haven't taken any actions such as the ones listed.

## Outbound IP address changes

The set of available outbound IP addresses for a function app might change when you:

* Take any action that can change the inbound IP address.
* Change your App Service plan pricing tier. The list of all possible outbound IP addresses your app can use, for all pricing tiers, is in the `possibleOutboundIPAddresses` property. See [Find outbound IPs](#find-outbound-ip-addresses).

The inbound IP address might also change when you haven't taken any actions such as the ones listed.

To deliberately force an outbound IP address change:

1. Scale your App Service plan up or down between Standard and Premium v2 pricing tiers.
2. Wait 10 minutes.
3. Scale back to where you started.

## IP address restrictions

You can configure a list of IP addresses that you want to allow or deny access to a function app. For more information, see [Azure App Service Static IP Restrictions](../app-service/app-service-ip-restrictions.md).

## Dedicated IP addresses

If you need static, dedicated IP addresses, we recommend [App Service Environments](../app-service/environment/intro.md) (the [Isolated tier](https://azure.microsoft.com/pricing/details/app-service/) of App Service plans). For more information, see [App Service Environment IP addresses](../app-service/environment/network-info.md#ase-ip-addresses) and [How to control inbound traffic to an App Service Environment](../app-service/environment/app-service-app-service-environment-control-inbound-traffic.md).

To find out if your function app runs in an App Service Environment:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Navigate to the function app.
3. Select the **Overview** tab.
4. The App Service plan tier appears under **App Service plan/pricing tier**. The App Service Environment pricing tier is **Isolated**.
 
As an alternative, you can use the [Cloud Shell](../cloud-shell/quickstart.md):

```azurecli-interactive
az webapp show --resource-group <group_name> --name <app_name> --query sku --output tsv
```

The App Service Environment `sku` is `Isolated`.

## Next steps

A common cause of IP changes is function app scale changes. [Learn more about function app scaling](functions-scale.md).
