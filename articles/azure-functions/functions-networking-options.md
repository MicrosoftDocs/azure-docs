---
title: Azure Functions networking options
description: An overview of all networking options available in Azure Functions.
author: jeffhollan
ms.topic: conceptual
ms.date: 10/27/2020
ms.author: jehollan

---
# Azure Functions networking options

This article describes the networking features available across the hosting options for Azure Functions. All the following networking options give you some ability to access resources without using internet-routable addresses or to restrict internet access to a function app.

The hosting models have different levels of network isolation available. Choosing the correct one helps you meet your network isolation requirements.

You can host function apps in a couple of ways:

* You can choose from plan options that run on a multitenant infrastructure, with various levels of virtual network connectivity and scaling options:
    * The [Consumption plan](functions-scale.md#consumption-plan) scales dynamically in response to load and offers minimal network isolation options.
    * The [Premium plan](functions-scale.md#premium-plan) also scales dynamically and offers more comprehensive network isolation.
    * The Azure [App Service plan](functions-scale.md#app-service-plan) operates at a fixed scale and offers  network isolation similar to the Premium plan.
* You can run functions in an [App Service Environment](../app-service/environment/intro.md). This method deploys your function into your virtual network and offers full network control and isolation.

## Matrix of networking features

[!INCLUDE [functions-networking-features](../../includes/functions-networking-features.md)]

## Inbound IP restrictions

You can use IP restrictions to define a priority-ordered list of IP addresses that are allowed or denied access to your app. The list can include IPv4 and IPv6 addresses. When there are one or more entries, an implicit "deny all" exists at the end of the list. IP restrictions work with all function-hosting options.

> [!NOTE]
> With network restrictions in place, you can use the portal editor only from within your virtual network, or when you've put the IP address of the machine you're using to access the Azure portal on the Safe Recipients list. However, you can still access any features on the **Platform features** tab from any machine.

To learn more, see [Azure App Service static access restrictions](../app-service/app-service-ip-restrictions.md).

## Private site access

[!INCLUDE [functions-private-site-access](../../includes/functions-private-site-access.md)]

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

To provide a higher level of security, you can restrict a number of Azure services to a virtual network by using service endpoints. You must then integrate your function app with that virtual network to access the resource. This configuration is supported on all plans that support virtual network integration.

To learn more, see [Virtual network service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md).

## Restrict your storage account to a virtual network (preview)

When you create a function app, you must create or link to a general-purpose Azure Storage account that supports Blob, Queue, and Table storage.  You can replace this storage account with one that is secured with service endpoints or private endpoint.  This preview feature currently only works with Windows Premium plans in West Europe.  To setup a function with a storage account restricted to a private network:

> [!NOTE]
> Restricting the storage account only currently works for Premium functions using Windows in West Europe

1. Create a function with a storage account that does not have service endpoints enabled.
1. Configure the function to connect to your virtual network.
1. Create or configure a different storage account.  This will be the storage account we secure with service endpoints and connect our function.
1. [Create a file share](../storage/files/storage-how-to-create-file-share.md#create-file-share) in the secured storage account.
1. Enable service endpoints or private endpoint for the storage account.  
    * Be sure to enable the subnet dedicated to your function apps if using a service endpoint.
    * Be sure to create a DNS record and configure your app to [work with private endpoint endpoints](#azure-dns-private-zones) if using private endpoint.  The storage account will need a private endpoint for the `file` and `blob` sub-resources.  If using certain capabilities like Durable Functions you will also need `queue` and `table` accessible through a private endpoint connection.
1. (Optional) Copy the file and blob content from the function app storage account to the secured storage account and file share.
1. Copy the connection string for this storage account.
1. Update the **Application Settings** under **Configuration** for the function app to the following:
    - `AzureWebJobsStorage` to the connection string for the secured storage account.
    - `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING` to the connection string for the secured storage account.
    - `WEBSITE_CONTENTSHARE` to the name of the file share created in the secured storage account.
    - Create a new setting with the name `WEBSITE_CONTENTOVERVNET` and value of `1`.
1. Save the application settings.  

The function app will restart and will now be connected to a secured storage account.

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

## Automation
The following APIs let you programmatically manage regional virtual network integrations:

+ **Azure CLI**: Use the [`az functionapp vnet-integration`](/cli/azure/functionapp/vnet-integration) commands to add, list, or remove a regional virtual network integrations.  
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
