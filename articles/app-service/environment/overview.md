---
title: App Service Environment overview
description: Overview on the App Service Environment
author: madsd
ms.topic: overview
ms.date: 11/15/2021
ms.author: madsd
ms.custom: references_regions
---
# App Service Environment overview

The Azure App Service Environment is an Azure App Service feature that provides a fully isolated and dedicated environment for securely running App Service apps at high scale. This capability can host your:

- Windows web apps
- Linux web apps
- Docker containers (Windows and Linux)
- Functions
- Logic Apps (Standard)

> [!NOTE]
> This article is about the App Service Environment v3 which is used with Isolated v2 App Service plans
> 

App Service Environments are appropriate for application workloads that require:

- High scale.
- Isolation and secure network access.
- High memory utilization.
- High requests per second (RPS). You can make multiple App Service Environments in a single Azure region or across multiple Azure regions. This flexibility makes an App Service Environment ideal for horizontally scaling stateless applications with a high RPS requirement.

App Service Environment host applications from only one customer and do so in one of their virtual networks. Customers have fine-grained control over inbound and outbound application network traffic. Applications can establish high-speed secure connections over VPNs to on-premises corporate resources.

## Usage scenarios

The App Service Environment has many use cases including:

- Internal line-of-business applications
- Applications that need more than 30 App Service plan instances
- Single tenant system to satisfy internal compliance or security requirements
- Network isolated application hosting
- Multi-tier applications

There are many networking features that enable apps in the multi-tenant App Service to reach network isolated resources or become network isolated themselves. These features are enabled at the application level. With an App Service Environment, there's no added configuration required for the apps to be in the virtual network. The apps are deployed into a network isolated environment that is already in a virtual network. If you really need a complete isolation story, you can also get your App Service Environment deployed onto dedicated hardware.

## Dedicated environment

The App Service Environment is a single tenant deployment of the Azure App Service that runs in your virtual network. 

Applications are hosted in App Service plans, which are created in an App Service Environment. The App Service plan is essentially a provisioning profile for an application host. As you scale your App Service plan out, you create more application hosts with all of the apps in that App Service plan on each host. A single App Service Environment v3 can have up to 200 total App Service plan instances across all of the App Service plans combined. A single Isolated v2 App Service plan can have up to 100 instances by itself.

## Virtual network support

The App Service Environment feature is a deployment of the Azure App Service into a single subnet in a customer's virtual network. When you deploy an app into an App Service Environment, the app will be exposed on the inbound address assigned to the App Service Environment. If your App Service Environment is deployed with an internal virtual IP (VIP), then the inbound address for all of the apps will be an address in the App Service Environment subnet. If your App Service Environment is deployed with an external VIP, then the inbound address will be an internet addressable address and your apps will be in public DNS.

The number of addresses used by an App Service Environment v3 in its subnet will vary based on how many instances you have along with how much traffic. There are infrastructure roles that are automatically scaled depending on the number of App Service plans and the load. The recommended size for your App Service Environment v3 subnet is a `/24` CIDR block with 256 addresses in it as that can host an App Service Environment v3 scaled out to its limit.

The apps in an App Service Environment do not need any features enabled to access resources in the same virtual network that the App Service Environment is in. If the App Service Environment virtual network is connected to another network, then the apps in the App Service Environment can access resources in those extended networks. Traffic can be blocked by user configuration on the network.

The multi-tenant version of Azure App Service contains numerous features to enable your apps to connect to your various networks. Those networking features enable your apps to act as if they were deployed in a virtual network. The apps in an App Service Environment v3 do not need any configuration to be in the virtual network. A benefit of using an App Service Environment over the multi-tenant service is that any network access controls to the App Service Environment hosted apps is external to the application configuration. With the apps in the multi-tenant service, you must enable the features on an app by app basis and use RBAC or policy to prevent any configuration changes.

## Feature differences

Compared to earlier versions of the App Service Environment, there are some differences with App Service Environment v3. With App Service Environment v3:

- There are no networking dependencies in the customer virtual network. You can secure all inbound and outbound as desired. Outbound traffic can be routed also as desired. 
- You can deploy it enabled for zone redundancy. Zone redundancy can only be set during creation and only in regions where all App Service Environment v3 dependencies are zone redundant. 
- You can deploy it on a dedicated host group. Host group deployments are not zone redundant. 
- Scaling is much faster than with App Service Environment v2. While scaling still is not immediate as in the multi-tenant service, it is a lot faster.
- Front end scaling adjustments are no longer required. The App Service Environment v3 front ends automatically scale to meet needs and are deployed on better hosts.
- Scaling no longer blocks other scale operations within the App Service Environment v3 instance. Only one scale operation can be in effect for a combination of OS and size. For example, while your Windows small App Service plan was scaling, you could kick off a scale operation to run at the same time on a Windows medium or anything else other than Windows small. 
- Apps in an internal VIP App Service Environment v3 can be reached across global peering. Access across global peering was not possible with previous versions.

There are a few features that are not available in App Service Environment v3 that were available in earlier versions of the App Service Environment. In App Service Environment v3, you can't:

- send SMTP traffic. You can still have email triggered alerts but your app can't send outbound traffic on port 25
- deploy your apps with FTP
- use remote debug with your apps
- monitor your traffic with Network Watcher or NSG Flow
- configure a IP-based TLS/SSL binding with your apps
- configure custom domain suffix
- backup/restore operation on a storage account behind a firewall

## Pricing

With App Service Environment v3, there is a different pricing model depending on the type of App Service Environment deployment you have. The three pricing models are:

- **App Service Environment v3**: If App Service Environment is empty, there is a charge as if you had one instance of Windows I1v2. The one instance charge is not an additive charge but is only applied if the App Service Environment is empty.
- **Zone redundant App Service Environment v3**: There is a minimum charge of nine instances. There is no added charge for availability zone support if you have nine or more App Service plan instances. If you have less than nine instances (of any size) across App Service plans in the zone redundant App Service Environment, the difference between nine and the running instance count is charged as additional Windows I1v2 instances.
- **Dedicated host App Service Environment v3**: With a dedicated host deployment, you are charged for two dedicated hosts per our pricing at App Service Environment v3 creation then a small percentage of the Isolated v2 rate per core charge as you scale.

Reserved Instance pricing for Isolated v2 is available and is described in [How reservation discounts apply to Azure App Service](../../cost-management-billing/reservations/reservation-discount-app-service.md). The pricing, along with reserved instance pricing, is available at [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/windows/) under **Isolated v2 plan**.

## Regions

The App Service Environment v3 is available in the following regions.

|Normal and dedicated host regions|Availability zone regions|
|---------------------------------------|------------------|
|Australia East|Australia East|
|Australia Southeast|Brazil South|
|Brazil South|Canada Central|
|Canada Central|Central US|
|Central India|East US|
|Central US|East US 2|
|East Asia|France Central|
|East US|Germany West Central|
|East US 2|Japan East|
|France Central|North Europe|
|Germany West Central|South Africa North|
|Japan East|South Central US|
|Korea Central|Southeast Asia|
|North Central US|UK South|
|North Europe|West Europe|
|Norway East|West US 2|
|South Africa North| |
|South Central US| |
|Southeast Asia| |
|Switzerland North| |
|UAE North| |
|UK South| |
|UK West| |
|West Central US| |
|West Europe| |
|West US| |
|West US 2| |
|West US 3| |
|US Gov Texas| |
|US Gov Arizona| |
|US Gov Virginia| |

## App Service Environment v2

App Service Environment has three versions: App Service Environment v1, App Service Environment v2, and App Service Environment v3. The preceding information was based on App Service Environment v3. To learn more about App Service Environment v2, see [App Service Environment v2 introduction](./intro.md).
