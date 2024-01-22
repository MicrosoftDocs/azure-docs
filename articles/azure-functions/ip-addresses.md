---
title: IP addresses in Azure Functions
description: Learn how to find inbound and outbound IP addresses for function apps, and what causes them to change.

ms.topic: conceptual
ms.date: 06/08/2023
---

# IP addresses in Azure Functions

This article explains the following concepts related to IP addresses of function apps:

* Locating the IP addresses currently in use by a function app.
* Conditions that cause function app IP addresses to change.
* Restricting the IP addresses that can access a function app.
* Defining dedicated IP addresses for a function app.

IP addresses are associated with function apps, not with individual functions. Incoming HTTP requests can't use the inbound IP address to call individual functions; they must use the default domain name (functionappname.azurewebsites.net) or a custom domain name.

## Function app inbound IP address

Each function app starts out by using a single inbound IP address. When running in a Consumption or Premium plan, additional inbound IP addresses may be added as event-driven scale-out occurs. To find the inbound IP address or addresses being used by your app, use the `nslookup` utility from your local computer, as in the following example:

```command
nslookup <APP_NAME>.azurewebsites.net
```

In this example, replace `<APP_NAME>` with your function app name. If your app uses a [custom domain name](../app-service/app-service-web-tutorial-custom-domain.md), use `nslookup` for that custom domain name instead.

## <a name="find-outbound-ip-addresses"></a>Function app outbound IP addresses

Each function app has a set of available outbound IP addresses. Any outbound connection from a function, such as to a back-end database, uses one of the available outbound IP addresses as the origin IP address. You can't know beforehand which IP address a given connection will use. For this reason, your back-end service must open its firewall to all of the function app's outbound IP addresses.

> [!TIP]
> For some platform-level features such as [Key Vault references](../app-service/app-service-key-vault-references.md), the origin IP might not be one of the outbound IPs, and you should not configure the target resource to rely on these specific addresses. It is recommended that the app instead use a virtual network integration, as the platform will route traffic to the target resource through that network.

To find the outbound IP addresses available to a function app:

# [Azure portal](#tab/portal)

1. Sign in to the [Azure Resource Explorer](https://resources.azure.com).
2. Select **subscriptions > {your subscription} > providers > Microsoft.Web > sites**.
3. In the JSON panel, find the site with an `id` property that ends in the name of your function app.
4. See `outboundIpAddresses` and `possibleOutboundIpAddresses`. 

# [Azure CLI](#tab/azurecli)

```azurecli-interactive
az functionapp show --resource-group <GROUP_NAME> --name <APP_NAME> --query outboundIpAddresses --output tsv
az functionapp show --resource-group <GROUP_NAME> --name <APP_NAME> --query possibleOutboundIpAddresses --output tsv
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
$functionApp = Get-AzFunctionApp -ResourceGroupName <GROUP_NAME> -Name <APP_NAME>
$functionApp.OutboundIPAddress
$functionApp.PossibleOutboundIPAddress
```

---

The set of `outboundIpAddresses` is currently available to the function app. The set of `possibleOutboundIpAddresses` includes IP addresses that will be available only if the function app [scales to other pricing tiers](#outbound-ip-address-changes).

> [!NOTE]
> When a function app that runs on the [Consumption plan](consumption-plan.md) or the [Premium plan](functions-premium-plan.md) is scaled, a new range of outbound IP addresses may be assigned. When running on either of these plans, you can't rely on the reported outbound IP addresses to create a definitive allowlist. To be able to include all potential outbound addresses used during dynamic scaling, you'll need to add the entire data center to your allowlist.

## Data center outbound IP addresses

If you need to add the outbound IP addresses used by your function apps to an allowlist, another option is to add the function apps' data center (Azure region) to an allowlist. You can [download a JSON file that lists IP addresses for all Azure data centers](https://www.microsoft.com/en-us/download/details.aspx?id=56519). Then find the JSON fragment that applies to the region that your function app runs in.

For example, the following JSON fragment is what the allowlist for Western Europe might look like:

```json
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

## <a name="inbound-ip-address-changes"></a>Inbound IP address changes

The inbound IP address **might** change when you:

- Delete a function app and recreate it in a different resource group.
- Delete the last function app in a resource group and region combination, and re-create it.
- Delete a TLS binding, such as during [certificate renewal](../app-service/configure-ssl-certificate.md#renew-an-expiring-certificate).

When your function app runs in a [Consumption plan](consumption-plan.md) or in a [Premium plan](functions-premium-plan.md), the inbound IP address might also change even when you haven't taken any actions such as the ones [listed above](#inbound-ip-address-changes).

## Outbound IP address changes

The relative stability of the outbound IP address depends on the hosting plan.  

### Consumption and Premium plans

Because of autoscaling behaviors, the outbound IP can change at any time when running on a [Consumption plan](consumption-plan.md) or in a [Premium plan](functions-premium-plan.md). 

If you need to control the outbound IP address of your function app, such as when you need to add it to an allow list, consider implementing a [virtual network NAT gateway](#virtual-network-nat-gateway-for-outbound-static-ip) while running in a Premium hosting plan. You can also do this by running in a Dedicated (App Service) plan.

### Dedicated plans

When running on Dedicated (App Service) plans, the set of available outbound IP addresses for a function app might change when you:

* Take any action that can change the inbound IP address.
* Change your Dedicated (App Service) plan pricing tier. The list of all possible outbound IP addresses your app can use, for all pricing tiers, is in the `possibleOutboundIPAddresses` property. See [Find outbound IPs](#find-outbound-ip-addresses).

#### Forcing an outbound IP address change

Use the following procedure to deliberately force an outbound IP address change in a Dedicated (App Service) plan:

1. Scale your App Service plan up or down between Standard and Premium v2 pricing tiers.

2. Wait 10 minutes.

3. Scale back to where you started.

## IP address restrictions

You can configure a list of IP addresses that you want to allow or deny access to a function app. For more information, see [Azure App Service Static IP Restrictions](../app-service/app-service-ip-restrictions.md).

## Dedicated IP addresses

There are several strategies to explore when your function app requires static, dedicated IP addresses. 

### Virtual network NAT gateway for outbound static IP

You can control the IP address of outbound traffic from your functions by using a virtual network NAT gateway to direct traffic through a static public IP address. You can use this topology when running in a [Premium plan](functions-premium-plan.md) or in a [Dedicated (App Service) plan](dedicated-plan.md). To learn more, see [Tutorial: Control Azure Functions outbound IP with an Azure virtual network NAT gateway](functions-how-to-use-nat-gateway.md).

### App Service Environments

For full control over the IP addresses, both inbound and outbound, we recommend [App Service Environments](../app-service/environment/intro.md) (the [Isolated tier](https://azure.microsoft.com/pricing/details/app-service/) of App Service plans). For more information, see [App Service Environment IP addresses](../app-service/environment/network-info.md#ip-addresses) and [How to control inbound traffic to an App Service Environment](../app-service/environment/app-service-app-service-environment-control-inbound-traffic.md).

To find out if your function app runs in an App Service Environment:

# [Azure portal](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Navigate to the function app.
3. Select the **Overview** tab.
4. The App Service plan tier appears under **App Service plan/pricing tier**. The App Service Environment pricing tier is **Isolated**.

# [Azure CLI](#tab/azurecli)

```azurecli-interactive
az resource show --resource-group <GROUP_NAME> --name <APP_NAME> --resource-type Microsoft.Web/sites --query properties.sku --output tsv
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
$functionApp = Get-AzResource -ResourceGroupName <GROUP_NAME> -ResourceName <APP_NAME> -ResourceType Microsoft.Web/sites 
$functionApp.Properties.sku
```

---

The App Service Environment `sku` is `Isolated`.

## Next steps

A common cause of IP changes is function app scale changes. [Learn more about function app scaling](functions-scale.md).
