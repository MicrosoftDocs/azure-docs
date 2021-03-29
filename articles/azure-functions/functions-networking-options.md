---
title: Azure Functions networking options
description: An overview of all networking options available in Azure Functions.
author: cachai2
ms.topic: conceptual
ms.date: 1/21/2021
ms.author: cachai
---

# Azure Functions networking options

This article describes the networking features available across the hosting options for Azure Functions. All the following networking options give you some ability to access resources without using internet-routable addresses or to restrict internet access to a function app.

The hosting models have different levels of network isolation available. Choosing the correct one helps you meet your network isolation requirements.

You can host function apps in a couple of ways:

* You can choose from plan options that run on a multitenant infrastructure, with various levels of virtual network connectivity and scaling options:
    * The [Consumption plan](consumption-plan.md) scales dynamically in response to load and offers minimal network isolation options.
    * The [Premium plan](functions-premium-plan.md) also scales dynamically and offers more comprehensive network isolation.
    * The Azure [App Service plan](dedicated-plan.md) operates at a fixed scale and offers  network isolation similar to the Premium plan.
* You can run functions in an [App Service Environment](../app-service/environment/intro.md). This method deploys your function into your virtual network and offers full network control and isolation.

## Matrix of networking features

[!INCLUDE [functions-networking-features](../../includes/functions-networking-features.md)]

## Inbound access restrictions

You can use access restrictions to define a priority-ordered list of IP addresses that are allowed or denied access to your app. The list can include IPv4 and IPv6 addresses, or specific virtual network subnets using [service endpoints](#use-service-endpoints). When there are one or more entries, an implicit "deny all" exists at the end of the list. IP restrictions work with all function-hosting options.

Access restrictions are available in the [Premium](functions-premium-plan.md), [Consumption](consumption-plan.md), and [App Service](dedicated-plan.md).

> [!NOTE]
> With network restrictions in place, you can deploy only from within your virtual network, or when you've put the IP address of the machine you're using to access the Azure portal on the Safe Recipients list. However, you can still manage the function using the portal.

To learn more, see [Azure App Service static access restrictions](../app-service/app-service-ip-restrictions.md).

### Use service endpoints

By using service endpoints, you can restrict access to selected Azure virtual network subnets. To restrict access to a specific subnet, create a restriction rule with a **Virtual Network** type. You can then select the subscription, virtual network, and subnet that you want to allow or deny access to. 

If service endpoints aren't already enabled with Microsoft.Web for the subnet that you selected, they'll be automatically enabled unless you select the **Ignore missing Microsoft.Web service endpoints** check box. The scenario where you might want to enable service endpoints on the app but not the subnet depends mainly on whether you have the permissions to enable them on the subnet. 

If you need someone else to enable service endpoints on the subnet, select the **Ignore missing Microsoft.Web service endpoints** check box. Your app will be configured for service endpoints in anticipation of having them enabled later on the subnet. 

![Screenshot of the "Add IP Restriction" pane with the Virtual Network type selected.](../app-service/media/app-service-ip-restrictions/access-restrictions-vnet-add.png)

You can't use service endpoints to restrict access to apps that run in an App Service Environment. When your app is in an App Service Environment, you can control access to it by applying IP access rules. 

To learn how to set up service endpoints, see [Establish Azure Functions private site access](functions-create-private-site-access.md).

## Private endpoint connections

[!INCLUDE [functions-private-site-access](../../includes/functions-private-site-access.md)]

To call other services that have a private endpoint connection, such as storage or service bus, be sure to configure your app to make [outbound calls to private endpoints](#private-endpoints).

## Virtual network integration

Virtual network integration allows your function app to access resources inside a virtual network.
Azure Functions supports two kinds of virtual network integration:

[!INCLUDE [app-service-web-vnet-types](../../includes/app-service-web-vnet-types.md)]

Virtual network integration in Azure Functions uses shared infrastructure with App Service web apps. To learn more about the two types of virtual network integration, see:

* [Regional virtual network Integration](../app-service/web-sites-integrate-with-vnet.md#regional-vnet-integration)
* [Gateway-required virtual network Integration](../app-service/web-sites-integrate-with-vnet.md#gateway-required-vnet-integration)

To learn how to set up virtual network integration, see [Integrate a function app with an Azure virtual network](functions-create-vnet.md).

## Regional virtual network integration

[!INCLUDE [app-service-web-vnet-types](../../includes/app-service-web-vnet-regional.md)]

## Connect to service endpoint secured resources

To provide a higher level of security, you can restrict a number of Azure services to a virtual network by using service endpoints. You must then integrate your function app with that virtual network to access the resource. This configuration is supported on all [plans](functions-scale.md#networking-features) that support virtual network integration.

To learn more, see [Virtual network service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md).

## Restrict your storage account to a virtual network 

When you create a function app, you must create or link to a general-purpose Azure Storage account that supports Blob, Queue, and Table storage. You can replace this storage account with one that is secured with service endpoints or private endpoint. 

This feature currently works for all Windows virtual network-supported SKUs in the Dedicated (App Service) plan and for the Premium plan. The Consumption plan isn't supported. To learn how to set up a function with a storage account restricted to a private network, see [Restrict your storage account to a virtual network](configure-networking-how-to.md#restrict-your-storage-account-to-a-virtual-network).

## Use Key Vault references

You can use Azure Key Vault references to use secrets from Azure Key Vault in your Azure Functions application without requiring any code changes. Azure Key Vault is a service that provides centralized secrets management, with full control over access policies and audit history.

Currently, [Key Vault references](../app-service/app-service-key-vault-references.md) won't work if your key vault is secured with service endpoints. To connect to a key vault by using virtual network integration, you need to call Key Vault in your application code.

## Virtual network triggers (non-HTTP)

Currently, you can use non-HTTP trigger functions from within a virtual network in one of two ways:

+ Run your function app in a Premium plan and enable virtual network trigger support.
+ Run your function app in an App Service plan or App Service Environment.

### Premium plan with virtual network triggers

When you run a Premium plan, you can connect non-HTTP trigger functions to services that run inside a virtual network. To do this, you must enable virtual network trigger support for your function app. The **Runtime Scale Monitoring** setting is found in the [Azure portal](https://portal.azure.com) under **Configuration** > **Function runtime settings**.

:::image type="content" source="media/functions-networking-options/virtual-network-trigger-toggle.png" alt-text="VNETToggle":::

You can also enable virtual network triggers by using the following Azure CLI command:

```azurecli-interactive
az resource update -g <resource_group> -n <function_app_name>/config/web --set properties.functionsRuntimeScaleMonitoringEnabled=1 --resource-type Microsoft.Web/sites
```

> [!TIP]
> Enabling virtual network triggers may have an impact on the performance of your application since your App Service plan instances will need to monitor your triggers to determine when to scale. This impact is likely to be very small.

Virtual network triggers are supported in version 2.x and above of the Functions runtime. The following non-HTTP trigger types are supported.

| Extension | Minimum version |
|-----------|---------| 
|[Microsoft.Azure.WebJobs.Extensions.Storage](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Storage/) | 3.0.10 or above |
|[Microsoft.Azure.WebJobs.Extensions.EventHubs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.EventHubs)| 4.1.0 or above|
|[Microsoft.Azure.WebJobs.Extensions.ServiceBus](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.ServiceBus)| 3.2.0 or above|
|[Microsoft.Azure.WebJobs.Extensions.CosmosDB](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.CosmosDB)| 3.0.5 or above|
|[Microsoft.Azure.WebJobs.Extensions.DurableTask](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.DurableTask)| 2.0.0 or above|

> [!IMPORTANT]
> When you enable virtual network trigger support, only the trigger types shown in the previous table scale dynamically with your application. You can still use triggers that aren't in the table, but they're not scaled beyond their pre-warmed instance count. For the complete list of triggers, see [Triggers and bindings](./functions-triggers-bindings.md#supported-bindings).

### App Service plan and App Service Environment with virtual network triggers

When your function app runs in either an App Service plan or an App Service Environment, you can use non-HTTP trigger functions. For your functions to get triggered correctly, you must be connected to a virtual network with access to the resource defined in the trigger connection.

For example, assume you want to configure Azure Cosmos DB to accept traffic only from a virtual network. In this case, you must deploy your function app in an App Service plan that provides virtual network integration with that virtual network. Integration enables a function to be triggered by that Azure Cosmos DB resource.

## Hybrid Connections

[Hybrid Connections](../azure-relay/relay-hybrid-connections-protocol.md) is a feature of Azure Relay that you can use to access application resources in other networks. It provides access from your app to an application endpoint. You can't use it to access your application. Hybrid Connections is available to functions that run on Windows in all but the Consumption plan.

As used in Azure Functions, each hybrid connection correlates to a single TCP host and port combination. This means that the hybrid connection's endpoint can be on any operating system and any application as long as you're accessing a TCP listening port. The Hybrid Connections feature doesn't know or care what the application protocol is or what you're accessing. It just provides network access.

To learn more, see the [App Service documentation for Hybrid Connections](../app-service/app-service-hybrid-connections.md). These same configuration steps support Azure Functions.

>[!IMPORTANT]
> Hybrid Connections is only supported on Windows plans. Linux isn't supported.

## Outbound IP restrictions

Outbound IP restrictions are available in a Premium plan, App Service plan, or App Service Environment. You can configure outbound restrictions for the virtual network where your App Service Environment is deployed.

When you integrate a function app in a Premium plan or an App Service plan with a virtual network, the app can still make outbound calls to the internet by default. By adding the application setting `WEBSITE_VNET_ROUTE_ALL=1`, you force all outbound traffic to be sent into your virtual network, where network security group rules can be used to restrict traffic.

To learn how to control the outbound IP using a virtual network, see [Tutorial: Control Azure Functions outbound IP with an Azure virtual network NAT gateway](functions-how-to-use-nat-gateway.md). 

## Automation
The following APIs let you programmatically manage regional virtual network integrations:

+ **Azure CLI**: Use the [`az functionapp vnet-integration`](/cli/azure/functionapp/vnet-integration) commands to add, list, or remove a regional virtual network integration.  
+ **ARM templates**: Regional virtual network integration can be enabled by using an Azure Resource Manager template. For a full example, see [this Functions quickstart template](https://azure.microsoft.com/resources/templates/101-function-premium-vnet-integration/).

## Troubleshooting

[!INCLUDE [app-service-web-vnet-troubleshooting](../../includes/app-service-web-vnet-troubleshooting.md)]

## Next steps

To learn more about networking and Azure Functions:

* [Follow the tutorial about getting started with virtual network integration](./functions-create-vnet.md)
* [Read the Functions networking FAQ](./functions-networking-faq.md)
* [Learn more about virtual network integration with App Service/Functions](../app-service/web-sites-integrate-with-vnet.md)
* [Learn more about virtual networks in Azure](../virtual-network/virtual-networks-overview.md)
* [Enable more networking features and control with App Service Environments](../app-service/environment/intro.md)
* [Connect to individual on-premises resources without firewall changes by using Hybrid Connections](../app-service/app-service-hybrid-connections.md)
