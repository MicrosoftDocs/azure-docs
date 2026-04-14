---
title: Geo-Distributed Horizontal Scale
description: Learn how to horizontally scale apps by using geo-distribution with Traffic Manager and App Service Environments.
author: seligj95
ms.assetid: c1b05ca8-3703-4d87-a9ae-819d741787fb
ms.topic: concept-article
ms.date: 03/13/2026
ms.author: jordanselig
ms.service: azure-app-service
ms.custom:
  - references_regions
  - devx-track-azurepowershell
  - sfi-image-nochange
# customer intent: As a developer, I want to learn about horizontally scaling for apps with Traffic Manager and App Service Environment, so I can use geo-distribution scaling.
---

# Geo-distributed horizontal scale with App Service Environment

Application scenarios that require high scale can exceed the compute resource capacity available to a single deployment of an app. Voting applications, sporting events, and televised entertainment events are examples of scenarios that require high scale. You can support high scale requirements by horizontally scaling out apps. To handle extreme load requirements, many app deployments can be made within a single region and across regions.

This article provides an overview for creating a distributed topology with a sample app and multiple App Service Environments. The horizontal scaling is accomplished by using [Azure Traffic Manager](/azure/traffic-manager/traffic-manager-overview).

## Overview of horizontal scaling process

App Service Environments are an ideal platform for horizontal scale-out. After selecting an App Service Environment configuration that can support a known request rate, developers can deploy more App Service Environments in "cookie cutter" fashion to attain a desired peak load capacity.

Suppose an app running on an App Service Environment configuration is tested to handle 20-K requests per second (RPS). If the desired peak load capacity is 100 K RPS, five App Service Environments can be created and configured to ensure the application can handle the maximum projected load.

Because customers typically access apps by using a custom (or _vanity_) domain, developers need a way to distribute app requests across all of the App Service Environment instances. A great way to accomplish this goal is to resolve the custom domain by using a [Traffic Manager profile](/azure/traffic-manager/traffic-manager-manage-profiles). The profile can be configured to point to all of the individual App Service Environments. Traffic Manager automatically handles the distribution of customers across all of the App Service Environments, based on the load-balancing settings in the profile. This approach works regardless of whether all the App Service Environments are deployed in a single Azure region, or deployed worldwide across multiple Azure regions.

In this scenario, customers often access apps through the vanity domain. They're unaware of the number of App Service Environments running an app. Developers can quickly and easily add and remove App Service Environments based on observed traffic load.

The following diagram shows an app horizontally scaled across three App Service Environments within a single region:

:::image type="content" source="./media/app-service-app-service-environment-geo-distributed-scale/conceptual-architecture.png" border="false" alt-text="Diagram of an architecture for a geo-distributed app service with Azure Traffic Manager.":::

## Topology requirements

To build the distributed app, you need the following information:

- **Custom domain for the app**: Determine the custom or vanity domain name customers use to access your app. For the sample app in this article, the custom domain name is `www.asabuludemo.com`.

- **Traffic Manager domain**: Choose a domain name when you create the [Traffic Manager profile](/azure/traffic-manager/traffic-manager-manage-profiles). The name is combined with the `trafficmanager.net` suffix, which indicates Traffic Manager maintains registration and management for the domain entry. For the sample app, the domain name is `scalable-ase-demo`. The full domain name managed by Traffic Manager is `scalable-ase-demo.trafficmanager.net`.

- **Strategy for scaling the app footprint**: Determine how the app is distributed across the multiple App Service Environments: a single region, multiple regions, or a combination. Consider where customer traffic originates, and how well the rest of an app's supporting back-end infrastructure can scale.

   Consider a 100% stateless application that can be massively scaled. You can use a combination of many App Service Environments in each Azure region multiplied by App Service Environments deployed across many Azure regions. Microsoft Azure is available in a multitude of global regions, which supports a world-wide hyper-scale app footprint. The sample app uses three App Service Environments in a single Azure region (South Central US).

- **Naming convention for the App Service Environments**: Define the convention for naming your App Service Environments. Each App Service Environment requires a unique name. If you have more than just one or two App Service Environments, it's helpful to have a naming convention that can identify each App Service Environment. The sample app implements a simple naming convention. The names of the three App Service Environments are `fe1ase`, `fe2ase`, and `fe3ase`.

- **Naming convention for the apps**: Define the convention for naming your apps. Because multiple instances of the app are deployed, you need a name for each instance of the deployed app. App Service Environments allow you to use the same app name across multiple App Service Environments. Because each App Service Environment has a unique domain suffix, developers can reuse the same app name in each environment. For example, you might have multiple apps named  `myapp.env1.p.azurewebsites.net`, `myapp.env2.p.azurewebsites.net`, `myapp.env3.p.azurewebsites.net`, and so on. For the sample app, each app instance has a unique name: `webfrontend1`, `webfrontend2`, and `webfrontend3`.

## Traffic Manager profile

After you deploy multiple instances of an app across multiple App Service Environments, you can register the app instances with Traffic Manager. The sample app requires a Traffic Manager profile for the `scalable-ase-demo.trafficmanager.net` address. When customers access this location, the profile configuration routes them to the deployed app instances:

- `webfrontend1.fe1ase.p.azurewebsites.net`: Sample app instance deployed on first App Service Environment.
- `webfrontend2.fe2ase.p.azurewebsites.net`: Sample app instance deployed on second App Service Environment.
- `webfrontend3.fe3ase.p.azurewebsites.net`: Sample app instance deployed on third App Service Environment.

### Create the profile

The easiest way to register multiple App Service endpoints that run in the **same** Azure region is by using Azure PowerShell. The first step is to create the Traffic Manager profile. The following code creates a new profile named `scalableasedemo` for the sample app. 

```azurepowershell-interactive
$profile = New-AzTrafficManagerProfile –Name scalableasedemo -ResourceGroupName demo-resource-group -TrafficRoutingMethod Weighted -RelativeDnsName scalable-ase-demo -Ttl 30 -MonitorProtocol HTTP -MonitorPort 80 -MonitorPath "/"
```

Notice how the `-RelativeDnsName` parameter is set to `scalable-ase-demo`. The command uses this parameter to create the domain name `scalable-ase-demo.trafficmanager.net` and associate it with a Traffic Manager profile.

The `-TrafficRoutingMethod` parameter defines the load-balancing policy Traffic Manager uses to determine how to distribute customer load across all available endpoints. The sample app uses the **Weighted** method. Customer requests distribute across all registered application endpoints based on the relative weights associated with each endpoint. 

### Add app instances to the profile

The next step is to add each app instance to the profile as a native Azure endpoint. The following code fetches a reference to each front-end web app. It then adds each app as a Traffic Manager endpoint through the `-TargetResourceId` parameter.

```azurepowershell-interactive
$webapp1 = Get-AzWebApp -Name webfrontend1
Add-AzTrafficManagerEndpointConfig –EndpointName webfrontend1 –TrafficManagerProfile $profile –Type AzureEndpoints -TargetResourceId $webapp1.Id –EndpointStatus Enabled –Weight 10

$webapp2 = Get-AzWebApp -Name webfrontend2
Add-AzTrafficManagerEndpointConfig –EndpointName webfrontend2 –TrafficManagerProfile $profile –Type AzureEndpoints -TargetResourceId $webapp2.Id –EndpointStatus Enabled –Weight 10

$webapp3 = Get-AzWebApp -Name webfrontend3
Add-AzTrafficManagerEndpointConfig –EndpointName webfrontend3 –TrafficManagerProfile $profile –Type AzureEndpoints -TargetResourceId $webapp3.Id –EndpointStatus Enabled –Weight 10

Set-AzTrafficManagerProfile –TrafficManagerProfile $profile
```

Notice the `Add-AzureTrafficManagerEndpointConfig` command for each individual app instance. The `-TargetResourceId` parameter in each command references one of the three deployed app instances. The Traffic Manager profile distributes the load across all three endpoints registered in the profile.

All three endpoints use the same value (10) for the `-Weight` parameter. Traffic Manager distributes the customer requests across all three app instances, as evenly as possible. 

For more information, see [Use PowerShell to manage Traffic Manager](/azure/traffic-manager/traffic-manager-powershell-arm). 

## Custom domain connection with Traffic Manager

After you configure the profile and add instances, you can point the custom domain of the app at the Traffic Manager domain. The sample app points the `www.asabuludemo.com` custom domain at the Traffic Manager domain, `scalable-ase-demo.trafficmanager.net`.

In your configuration, complete this task with the domain registrar that manages your custom domain. By using your registrar's domain management tools, create a `CNAME` record that points the custom domain at the Traffic Manager domain.

You can view your **DNS zone** configuration in the Azure portal under **DNS zone** > **DNS Management** > **Recordsets**. The following image shows an example of the `CNAME` configuration:

:::image type="content" source="./media/app-service-app-service-environment-geo-distributed-scale/cname-custom-domain.png" alt-text="Screenshot of the DNS zone configuration in the Azure portal showing the recordsets and the CNAME record highlighted."::: 

### Register all app instances

After the connection is made, you need to register the custom domain with each individual app instance. If a request reaches an app instance, and the instance has no custom domain registration, the request fails.

> [!NOTE]
> This article doesn't describe the app instance registration process. Be sure to complete the process for your configuration with the domain registrar that manages your custom domain.

In the sample app scenario, the custom domain is `www.asabuludemo.com`, and each app instance is associated with the custom domain. The following image shows this configuration:

:::image type="content" source="./media/app-service-app-service-environment-geo-distributed-scale/custom-domain.png" alt-text="Screenshot that shows the custom domain setting for the web app in the Azure portal.":::

For more information, see [Set up an existing custom domain in Azure App Service](../app-service-web-tutorial-custom-domain.md).

## Traffic distribution topology

When all web app instances can reach the Traffic Manager domain, requests for the `www.asabuludemo.com` site flow through the following sequence. The sequence uses the configuration names for resources in the sample application.

1. A browser or device makes a DNS lookup for the site, `www.asabuludemo.com`.

1. The CNAME entry at the domain registrar causes the DNS lookup to redirect to Traffic Manager.

1. A DNS lookup is made for the `scalable-ase-demo.trafficmanager.net` domain against one of the Traffic Manager DNS servers.

1. Based on the load-balancing policy specified in the `-TrafficRoutingMethod` parameter, Traffic Manager selects one of the configured endpoints. It then returns the FQDN of that endpoint to the browser or device.

1. Because the FQDN of the endpoint is the URL of an app instance that runs on an App Service Environment, the browser or device requests an Azure DNS server to resolve the FQDN to an IP address.

1. The browser or device sends the HTTP/S request to the IP address.

1. The request arrives at one of the app instances running on one of the App Service Environments.

The following image shows a DNS lookup for the sample app's custom domain. It successfully resolves to an app instance that runs on one of the three sample App Service Environments (in this case, the second of the three App Service Environments, `fe2ase`).

:::image type="content" source="./media/app-service-app-service-environment-geo-distributed-scale/dns-lookup.png" alt-text="Screenshot of a command prompt window with the DNS lookup result.":::

## Related content

- [Use PowerShell to manage Azure Traffic Manager](/azure/traffic-manager/traffic-manager-powershell-arm)
