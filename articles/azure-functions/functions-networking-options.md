---
title: Azure Functions networking options
description: An overview of all networking options available in Azure Functions.
author: ggailey777
ms.topic: conceptual
ms.custom:
  - build-2024
ms.date: 11/07/2024
ms.author: cachai
---

# Azure Functions networking options

This article describes the networking features available across the hosting options for Azure Functions. The following networking options can be categorized as inbound and outbound networking features. Inbound features allow you to restrict access to your app, whereas outbound features allow you to connect your app to resources secured by a virtual network and control how outbound traffic is routed. 

The [hosting models](functions-scale.md) have different levels of network isolation available. Choosing the correct one helps you meet your network isolation requirements.

[!INCLUDE [functions-networking-features](../../includes/functions-networking-features.md)]

## Quickstart resources

Use the following resources to quickly get started with Azure Functions networking scenarios. These resources are referenced throughout the article.

*  ARM templates, Bicep files, and Terraform templates:
    * [Private HTTP triggered function app](https://github.com/Azure-Samples/function-app-with-private-http-endpoint)
    * [Private Event Hubs triggered function app](https://github.com/Azure-Samples/function-app-with-private-eventhub)
* ARM templates only:
    * [Function app with Azure Storage private endpoints](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/function-app-storage-private-endpoints).
    * [Azure function app with Virtual Network Integration](https://github.com/Azure-Samples/function-app-arm-templates/tree/main/function-app-vnet-integration).
* Tutorials:
    * [Integrate Azure Functions with an Azure virtual network by using private endpoints](functions-create-vnet.md)
    * [Restrict your storage account to a virtual network](configure-networking-how-to.md#restrict-your-storage-account-to-a-virtual-network).
    * [Control Azure Functions outbound IP with an Azure virtual network NAT gateway](functions-how-to-use-nat-gateway.md). 

## Inbound networking features

The following features let you filter inbound requests to your function app.

### Inbound access restrictions

You can use access restrictions to define a priority-ordered list of IP addresses that are allowed or denied access to your app. The list can include IPv4 and IPv6 addresses, or specific virtual network subnets using [service endpoints](#use-service-endpoints). When there are one or more entries, an implicit "deny all" exists at the end of the list. IP restrictions work with all function-hosting options.

Access restrictions are available in the [Flex Consumption plan](flex-consumption-plan.md), [Elastic Premium](functions-premium-plan.md), [Consumption](consumption-plan.md), and [App Service](dedicated-plan.md).

> [!NOTE]
> With network restrictions in place, you can deploy only from within your virtual network, or when you've put the IP address of the machine you're using to access the Azure portal on the Safe Recipients list. However, you can still manage the function using the portal.

To learn more, see [Azure App Service static access restrictions](../app-service/app-service-ip-restrictions.md).

### Private endpoints

[!INCLUDE [functions-private-site-access](../../includes/functions-private-site-access.md)]

To call other services that have a private endpoint connection, such as storage or service bus, be sure to configure your app to make [outbound calls to private endpoints](#private-endpoints). For more details on using private endpoints with the storage account for your function app, visit [restrict your storage account to a virtual network](#restrict-your-storage-account-to-a-virtual-network).

### Service endpoints

Using service endpoints, you can restrict many Azure services to selected virtual network subnets to provide a higher level of security. Regional virtual network integration enables your function app to reach Azure services that are secured with service endpoints. This configuration is supported on all [plans](functions-scale.md#networking-features) that support virtual network integration. Follow these steps to access a secured service endpoint:

1. Configure regional virtual network integration with your function app to connect to a specific subnet.
1. Go to the destination service and configure service endpoints against the integration subnet.

To learn more, see [Virtual network service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md).

#### Use Service Endpoints

To restrict access to a specific subnet, create a restriction rule with a **Virtual Network** type. You can then select the subscription, virtual network, and subnet that you want to allow or deny access to. 

If service endpoints aren't already enabled with `Microsoft.Web` for the subnet that you selected, they're automatically enabled unless you select the **Ignore missing Microsoft.Web service endpoints** check box. The scenario where you might want to enable service endpoints on the app but not the subnet depends mainly on whether you have the permissions to enable them on the subnet.

If you need someone else to enable service endpoints on the subnet, select the **Ignore missing Microsoft.Web service endpoints** check box. Your app is configured for service endpoints, which you enable later on the subnet. 

![Screenshot of the "Add IP Restriction" pane with the Virtual Network type selected.](../app-service/media/app-service-ip-restrictions/access-restrictions-vnet-add.png)

You can't use service endpoints to restrict access to apps that run in an App Service Environment. When your app is in an App Service Environment, you can control access to it by applying IP access rules. 

To learn how to set up service endpoints, see [Establish Azure Functions private site access](functions-create-private-site-access.md).

## Outbound networking features

You can use the features in this section to manage outbound connections made by your app.

### Virtual network integration

This section details the features that Functions supports to control data outbound from your app.

Virtual network integration gives your function app access to resources in your virtual network. Once integrated, your app routes outbound traffic through the virtual network. This allows your app to access private endpoints or resources with rules allowing traffic from only select subnets. When the destination is an IP address outside of the virtual network, the source IP will still be sent from the one of the addresses listed in your app's properties, unless you've configured a NAT Gateway.

Azure Functions supports two kinds of virtual network integration:

* [Regional virtual network integration](#regional-virtual-network-integration) for apps running on the [Flex Consumption](./flex-consumption-plan.md), [Elastic Premium](./functions-premium-plan.md), [Dedicated (App Service)](./dedicated-plan.md), and [Container Apps](./functions-container-apps-hosting.md) hosting plans (recommended)
* [Gateway-required virtual network integration](../app-service/configure-gateway-required-vnet-integration.md) for apps running on the [Dedicated (App Service)](./dedicated-plan.md) hosting plan

To learn how to set up virtual network integration, see [Enable virtual network integration](#enable-virtual-network-integration).

### Regional virtual network integration

Using regional virtual network integration enables your app to access:

* Resources in the same virtual network as your app.
* Resources in virtual networks peered to the virtual network your app is integrated with.
* Service endpoint secured services.
* Resources across Azure ExpressRoute connections.
* Resources across peered connections, which include Azure ExpressRoute connections.
* Private endpoints 

When you use regional virtual network integration, you can use the following Azure networking features:

* **[Network security groups (NSGs)](#network-security-groups)**: You can block outbound traffic with an NSG that's placed on your integration subnet. The inbound rules don't apply because you can't use virtual network integration to provide inbound access to your app.
* **[Route tables (UDRs)](#routes)**: You can place a route table on the integration subnet to send outbound traffic where you want.

> [!NOTE]
> When you route all of your outbound traffic into your virtual network, it's subject to the NSGs and UDRs that are applied to your integration subnet. When virtual network integrated, your function app's outbound traffic to public IP addresses is still sent from the addresses that are listed in your app properties, unless you provide routes that direct the traffic elsewhere.
> 
> Regional virtual network integration isn't able to use port 25.

Considerations for the [Flex Consumption](./flex-consumption-plan.md) plan:
* Ensure that the `Microsoft.App` Azure resource provider is enabled for your subscription by [following these instructions](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider). This is needed for subnet delegation.
* The subnet delegation required when running in a Flex Consumption plan is `Microsoft.App/environments`. This differs from the Elastic Premium and Dedicated (App Service) plans, which have a different delegation requirement.
* You can plan for 40 IP addresses to be used at the most for one function app, even if the app scales beyond 40. For example, if you have 15 Flex Consumption function apps that are integrated in the same subnet, you must plan for 15x40 = 600 IP addresses used at the most. This limit is subject to change, and is not enforced.
* The subnet can't already be in use for other purposes (like private or service endpoints, or [delegated](../virtual-network/subnet-delegation-overview.md) to any other hosting plan or service). While you can share the same subnet with multiple Flex Consumption apps, the networking resources are shared across these function apps, which can lead to one app impacting the performance of others on the same subnet.

Considerations for the [Elastic Premium](./functions-premium-plan.md), [Dedicated (App Service)](./dedicated-plan.md), and [Container Apps](./functions-container-apps-hosting.md) plans:

* The feature is available for Elastic Premium and App Service Premium V2 and Premium V3. It's also available in Standard but only from newer App Service deployments. If you are on an older deployment, you can only use the feature from a Premium V2 App Service plan. If you want to make sure you can use the feature in a Standard App Service plan, create your app in a Premium V3 App Service plan. Those plans are only supported on our newest deployments. You can scale down if you desire after that.
* The feature can't be used by Isolated plan apps that are in an App Service Environment.
* The app and the virtual network must be in the same region.
* The feature requires an unused subnet that's a /28 or larger in an Azure Resource Manager virtual network.
* The integration subnet can be used by only one App Service plan.
* You can have up to two regional virtual network integrations per App Service plan. Multiple apps in the same App Service plan can use the same integration subnet.
* You can't delete a virtual network with an integrated app. Remove the integration before you delete the virtual network.
* You can't change the subscription of an app or a plan while there's an app that's using regional virtual network integration.

### Enable virtual network integration

1. In your function app in the [Azure portal](https://portal.azure.com), select **Networking**, then under **VNet Integration** select **Click here to configure**.

1. Select **Add VNet**.

    :::image type="content" source="./media/functions-networking-options/vnet-int-function-app.png" alt-text="Screenshot of the VNet Integration page where you can enable virtual network integration in your app." :::

1. The drop-down list contains all of the Azure Resource Manager virtual networks in your subscription in the same region. Select the virtual network you want to integrate with.

    :::image type="content" source="./media/functions-networking-options/vnet-int-add-vnet-function-app.png" alt-text="Select the VNet":::

    * The Flex Consumption and Elastic Premium hosting plans only support regional virtual network integration. If the virtual network is in the same region, either create a new subnet or select an empty, preexisting subnet.

    * To select a virtual network in another region, you must have a virtual network gateway provisioned with point to site enabled. Virtual network integration across regions is only supported for Dedicated plans, but global peerings work with regional virtual network integration.

During the integration, your app is restarted. When integration is finished, you see details on the virtual network you're integrated with. By default, Route All is enabled, and all traffic is routed into your virtual network.

If you prefer to only have your private traffic ([RFC1918](https://datatracker.ietf.org/doc/html/rfc1918#section-3) traffic) routed, follow the steps in this [App Service article](../app-service/overview-vnet-integration.md#application-routing).

### Subnets

Virtual network integration depends on a dedicated subnet. When you provision a subnet, the Azure subnet loses five IPs from the start. For the Elastic Premium and App Service plans, one address is used from the integration subnet for each plan instance. When you scale your app to four instances, then four addresses are used. For Flex Consumption this doesn't apply and instances share IP addresses.

In the Elastic Premium and Dedicated (App Service) plans, the required address space is doubled for a short period of time when you scale up or down in instance size. This affects the real, available supported instances for a given subnet size. The following table shows both the maximum available addresses per CIDR block and the effect this has on horizontal scale:

| CIDR block size | Max available addresses | Max horizontal scale (instances)<sup>*</sup> |
|-----------------|-------------------------|---------------------------------|
| /28             | 11                      | 5                               |
| /27             | 27                      | 13                              |
| /26             | 59                      | 29                              |

<sup>*</sup>Assumes that you need to scale up or down in either size or SKU at some point. 

Since subnet size can't be changed after assignment, use a subnet that's large enough to accommodate whatever scale your app might reach. To avoid any issues with subnet capacity for Functions Elastic Premium plans, you should use a /24 with 256 addresses for Windows and a /26 with 64 addresses for Linux. When creating subnets in Azure portal as part of integrating with the virtual network, a minimum size of /24 and /26 is required for Windows and Linux respectively.

The Flex Consumption plan allows for multiple apps running in the Flex Consumption plan to integrate with the same subnet. This isn't the case for the Elastic Premium and Dedicated (App Service) hosting plans. These plans only allow two virtual networks to be connected with each App Service plan. Multiple apps from a single App Service plan can join the same subnet, but apps from a different plan can't use that same subnet.

The feature is fully supported for both Windows and Linux apps, including [custom containers](../app-service/configure-custom-container.md). All of the behaviors act the same between Windows apps and Linux apps.

### Network security groups

You can use [network security groups][VNETnsg] to control traffic between resources in your virtual network. For example, you can create a security rule that blocks your app's outbound traffic from reaching a resource in your virtual network or from leaving the network. These security rules apply to apps that have configured virtual network integration. To block traffic to public addresses, you must have virtual network integration and Route All enabled. The inbound rules in an NSG don't apply to your app because virtual network integration affects only outbound traffic from your app.

To control inbound traffic to your app, use the Access Restrictions feature. An NSG that's applied to your integration subnet is in effect regardless of any routes applied to your integration subnet. If your function app is virtual network integrated with [Route All](../app-service/configure-vnet-integration-routing.md#configure-application-routing) enabled, and you don't have any routes that affect public address traffic on your integration subnet, all of your outbound traffic is still subject to NSGs assigned to your integration subnet. When Route All isn't enabled, NSGs are only applied to RFC1918 traffic.

### Routes

You can use route tables to route outbound traffic from your app to wherever you want. By default, route tables only affect your RFC1918 destination traffic. When [Route All](../app-service/overview-vnet-integration.md#application-routing) is enabled, all of your outbound calls are affected. When Route All is disabled, only private traffic (RFC1918) is affected by your route tables. Routes that are set on your integration subnet won't affect replies to inbound app requests. Common destinations can include firewall devices or gateways.

If you want to route all outbound traffic on-premises, you can use a route table to send all outbound traffic to your ExpressRoute gateway. If you do route traffic to a gateway, be sure to set routes in the external network to send any replies back.

Border Gateway Protocol (BGP) routes also affect your app traffic. If you have BGP routes from something like an ExpressRoute gateway, your app outbound traffic is affected. By default, BGP routes affect only your RFC1918 destination traffic. When your function app is virtual network integrated with Route All enabled, all outbound traffic can be affected by your BGP routes.

### Outbound IP restrictions

Outbound IP restrictions are available in a Flex Consumption plan, Elastic Premium plan, App Service plan, or App Service Environment. You can configure outbound restrictions for the virtual network where your App Service Environment is deployed.

When you integrate a function app in an Elastic Premium plan or an App Service plan with a virtual network, the app can still make outbound calls to the internet by default. By integrating your function app with a virtual network with Route All enabled, you force all outbound traffic to be sent into your virtual network, where network security group rules can be used to restrict traffic. For Flex Consumption all traffic is already routed through the virtual network and Route All isn't needed.

To learn how to control the outbound IP using a virtual network, see [Tutorial: Control Azure Functions outbound IP with an Azure virtual network NAT gateway](functions-how-to-use-nat-gateway.md). 

### Azure DNS private zones 

After your app integrates with your virtual network, it uses the same DNS server that your virtual network is configured with and will work with the Azure DNS private zones linked to the virtual network.

### Automation
The following APIs let you programmatically manage regional virtual network integrations:

+ **Azure CLI**: Use the [`az functionapp vnet-integration`](/cli/azure/functionapp/vnet-integration) commands to add, list, or remove a regional virtual network integration.  
+ **ARM templates**: Regional virtual network integration can be enabled by using an Azure Resource Manager template. For a full example, see [this Functions quickstart template](https://azure.microsoft.com/resources/templates/function-premium-vnet-integration/).

## Hybrid Connections

[Hybrid Connections](../azure-relay/relay-hybrid-connections-protocol.md) is a feature of Azure Relay that you can use to access application resources in other networks. It provides access from your app to an application endpoint. You can't use it to access your application. Hybrid Connections is available to functions that run on Windows in all but the Consumption plan.

As used in Azure Functions, each hybrid connection correlates to a single TCP host and port combination. This means that the hybrid connection's endpoint can be on any operating system and any application as long as you're accessing a TCP listening port. The Hybrid Connections feature doesn't know or care what the application protocol is or what you're accessing. It just provides network access.

To learn more, see the [App Service documentation for Hybrid Connections](../app-service/app-service-hybrid-connections.md). These same configuration steps support Azure Functions.

>[!IMPORTANT]
> Hybrid Connections is only supported when your function app runs on Windows. Linux apps aren't supported.

## Connecting to Azure Services through a virtual network

Virtual network integration enables your function app to access resources in a virtual network. This section overviews things you should consider when attempting to connect your app to certain services.

### Restrict your storage account to a virtual network 

> [!NOTE]
> To quickly deploy a function app with private endpoints enabled on the storage account, please refer to the following template: [Function app with Azure Storage private endpoints](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/function-app-storage-private-endpoints).

When you create a function app, you must create or link to a general-purpose Azure Storage account that supports Blob, Queue, and Table storage. You can replace this storage account with one that is secured with service endpoints or private endpoints. 

You can use a network restricted storage account with function apps on the Flex Consumption, Elastic Premium, and Dedicated (App Service) plans; the Consumption plan isn't supported. For Elastic Premium and Dedicated plans, you have to ensure that private [content share routing](../app-service/configure-vnet-integration-routing.md#content-share) is configured. To learn how to configure your function app with a storage account secured with a virtual network, see [Restrict your storage account to a virtual network](configure-networking-how-to.md#restrict-your-storage-account-to-a-virtual-network).

### Use Key Vault references

You can use Azure Key Vault references to use secrets from Azure Key Vault in your Azure Functions application without requiring any code changes. Azure Key Vault is a service that provides centralized secrets management, with full control over access policies and audit history.

If virtual network integration is configured for the app, [Key Vault references](../app-service/app-service-key-vault-references.md) may be used to retrieve secrets from a network-restricted vault.

### Virtual network triggers (non-HTTP)

Your workload may require your app to be triggered from an event source protected by a virtual network. There's two options if you want your app to dynamically scale based on the number of events received from non-HTTP trigger sources:

+ Run your function app in a [Flex Consumption](./flex-consumption-plan.md).
+ Run your function app in an [Elastic Premium plan](./functions-premium-plan.md) and enable virtual network trigger support.

Function apps running on the [Dedicated (App Service)](./dedicated-plan.md) plans don't dynamically scale based on events. Rather, scale out is dictated by [autoscale](./dedicated-plan.md#scaling) rules you define.

#### Elastic Premium plan with virtual network triggers

The [Elastic Premium plan](functions-premium-plan.md) lets you create functions that are triggered by services secured by a virtual network. These non-HTTP triggers are known as _virtual network triggers_.   

By default, virtual network triggers don't cause your function app to scale beyond their prewarmed instance count. However, certain extensions support virtual network triggers that cause your function app to scale dynamically. You can enable this _dynamic scale monitoring_ in your function app for supported extensions in one of these ways:

#### [Azure portal](#tab/azure-portal)

1. In the [Azure portal](https://portal.azure.com), navigate to your function app. 

1. Under **Settings** select **Configuration**, then in the **Function runtime settings** tab set **Runtime Scale Monitoring** to **On**.

1. Select **Save** to update the function app configuration and restart the app.

:::image type="content" source="media/functions-networking-options/virtual-network-trigger-toggle.png" alt-text="VNETToggle":::

#### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az resource update -g <resource_group> -n <function_app_name>/config/web --set properties.functionsRuntimeScaleMonitoringEnabled=1 --resource-type Microsoft.Web/sites
```

#### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
$Resource = Get-AzResource -ResourceGroupName <resource_group> -ResourceName <function_app_name>/config/web -ResourceType Microsoft.Web/sites
$Resource.Properties.functionsRuntimeScaleMonitoringEnabled = $true
$Resource | Set-AzResource -Force
```

---

> [!TIP]
> Enabling the monitoring of virtual network triggers may have an impact on the performance of your application, though this impact is likely to be very small.

Support for dynamic scale monitoring of virtual network triggers isn't available in version 1.x of the Functions runtime. 

The extensions in this table support dynamic scale monitoring of virtual network triggers. To get the best scaling performance, you should upgrade to versions that also support [target-based scaling](functions-target-based-scaling.md#premium-plan-with-runtime-scale-monitoring-enabled).

| Extension (minimum version) | Runtime scale monitoring only | With [target-based scaling](functions-target-based-scaling.md#premium-plan-with-runtime-scale-monitoring-enabled) |
|-----------|---------|--- |
|[Microsoft.Azure.WebJobs.Extensions.CosmosDB](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.CosmosDB)| > 3.0.5 | > 4.1.0 |
|[Microsoft.Azure.WebJobs.Extensions.DurableTask](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.DurableTask)| > 2.0.0 | n/a |
|[Microsoft.Azure.WebJobs.Extensions.EventHubs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.EventHubs)| > 4.1.0 | > 5.2.0 |
|[Microsoft.Azure.WebJobs.Extensions.ServiceBus](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.ServiceBus)| > 3.2.0 | > 5.9.0 |
|[Microsoft.Azure.WebJobs.Extensions.Storage](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Storage/) | > 3.0.10 | > 5.1.0<sup>*</sup>  |

<sup>*</sup> Queue storage only.

> [!IMPORTANT]
> When you enable virtual network trigger monitoring, only triggers for these extensions can cause your app to scale dynamically. You can still use triggers from extensions that aren't in this table, but they won't cause scaling beyond their pre-warmed instance count. For a complete list of all trigger and binding extensions, see [Triggers and bindings](./functions-triggers-bindings.md#supported-bindings).

#### App Service plan and App Service Environment with virtual network triggers

When your function app runs in either an App Service plan or an App Service Environment, you can write functions that are triggered by resources secured by a virtual network. For your functions to get triggered correctly, your app must be connected to a virtual network with access to the resource defined in the trigger connection.

For example, assume you want to configure Azure Cosmos DB to accept traffic only from a virtual network. In this case, you must deploy your function app in an App Service plan that provides virtual network integration with that virtual network. Integration enables a function to be triggered by that Azure Cosmos DB resource.

## Testing considerations

When testing functions in a function app with private endpoints, you must do your testing from within the same virtual network, such as on a virtual machine (VM) in that network. To use the **Code + Test** option in the portal from that VM, you need to add following [CORS origins](./functions-how-to-use-azure-function-app-settings.md?tabs=portal#cors) to your function app:

* `https://functions-next.azure.com`
* `https://functions-staging.azure.com`
* `https://functions.azure.com`
* `https://portal.azure.com`

If you've restricted access to your function app with private endpoints or any other access restriction, you also must add the service tag `AzureCloud` to the allowed list. To update the allowed list:

1. Navigate to your function app and select **Settings** > **Networking** and then select **Inbound access configuration** > **Public network access**. 

1. Make sure that **Public network access** is set to **Enabled from select virtual networks and IP addresses**. 

1. **Add a rule** under Site access and rules: 

    1. Select `Service Tag` as the Source settings **Type** and `AzureCloud` as the **Service Tag**. 
    
    1. Make sure the action is **Allow**, and set your desired name and priority.

## Troubleshooting

[!INCLUDE [app-service-web-vnet-troubleshooting](../../includes/app-service-web-vnet-troubleshooting.md)]

### Network troubleshooter

You can also use the Network troubleshooter to resolve connection issues. To open the network troubleshooter, go to the app in the Azure portal. Select **Diagnostic and solve problem**, and then search for **Network troubleshooter**.

**Connection issues** - It checks the status of the virtual network integration, including checking if the Private IP has been assigned to all instances of the plan and the DNS settings. If a custom DNS isn't configured, default Azure DNS is applied. The troubleshooter also checks for common Function app dependencies including connectivity for Azure Storage and other binding dependencies.

:::image type="content" source="./media/functions-networking-options/network-troubleshooter-function-app.png" alt-text="Screenshot that shows running troubleshooter for connection issues.":::

**Configuration issues** - This troubleshooter checks if your subnet is valid for virtual network Integration.

:::image type="content" source="./media/functions-networking-options/network-troubleshooter-configuration-function-app.png" alt-text="Screenshot that shows running troubleshooter for configuration issues.":::

**Subnet/VNet deletion issue** - This troubleshooter checks if your subnet has any locks and if it has any unused Service Association Links that might be blocking the deletion of the VNet/subnet.

## Next steps

To learn more about networking and Azure Functions:

* [Follow the tutorial about getting started with virtual network integration](./functions-create-vnet.md)
* [Read the Functions networking FAQ](./functions-networking-faq.yml)
* [Learn more about virtual network integration with App Service/Functions](../app-service/overview-vnet-integration.md)
* [Learn more about virtual networks in Azure](../virtual-network/virtual-networks-overview.md)
* [Enable more networking features and control with App Service Environments](../app-service/environment/intro.md)
* [Connect to individual on-premises resources without firewall changes by using Hybrid Connections](../app-service/app-service-hybrid-connections.md)


<!--Links-->
[VNETnsg]: ../virtual-network/network-security-groups-overview.md
[privateendpoints]: ../app-service/networking/private-endpoint.md
