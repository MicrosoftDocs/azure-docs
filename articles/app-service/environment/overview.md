---
title: App Service Environment Overview
description: Learn about App Service Environment, which is a fully isolated and single-tenant deployment of Azure App Service. It provides high-scale, network-secured hosting for applications in a dedicated environment.
author: madsd
ms.topic: overview
ms.date: 06/18/2024
ms.author: madsd
ms.custom:
  - "UpdateFrequency3, references_regions"
  - build-2025
---

# App Service Environment overview

An App Service Environment is an Azure App Service feature that provides a fully isolated and dedicated environment for running App Service apps securely at high scale. Unlike the App Service public multitenant offering where supporting infrastructure is shared, with App Service Environment, compute is dedicated to a single customer. For more information, see [App Service Environment v3 and App Service public multitenant comparison](ase-multi-tenant-comparison.md).

An App Service Environment provides hosting capabilities for various workloads:

- Windows web apps

- Linux web apps

- Docker containers (Windows and Linux)

- Functions

- Logic apps (standard) in [supported regions](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=logic-apps&regions=all)

App Service Environments are designed to support application workloads that require specific performance and security features:

- High scale.

- Isolation and secure network access.

- High memory utilization.

- High requests per second (RPS). You can create multiple App Service Environments in a single Azure region or across multiple Azure regions. This flexibility makes an App Service Environment ideal for horizontally scaling stateless applications that have a high RPS requirement.

An App Service Environment hosts applications for a single customer on one of their virtual networks. Customers have fine-grained control over inbound and outbound application network traffic. Applications can establish high-speed secure connections over virtual private networks to on-premises corporate resources.

## Usage scenarios

App Service Environments have many use cases:

- Internal line-of-business applications

- Applications that need more than 30 App Service plan instances

- Single-tenant systems to satisfy internal compliance or security requirements

- Network-isolated application hosting

- Multiple-tier applications

There are many networking features that enable apps in a multitenant App Service to reach network-isolated resources or become network-isolated themselves. These features are enabled at the application level. With an App Service Environment, apps don't require extra configuration to be on a virtual network. The apps are deployed into a network-isolated environment that's already on a virtual network. If you need a complete isolation story, you can also deploy your App Service Environment on dedicated hardware.

## Dedicated environment

An App Service Environment is a single-tenant deployment of Azure App Service that runs on your virtual network.

Applications are hosted in App Service plans, which are created in an App Service Environment. An App Service plan serves as a provisioning profile for an application host. As you scale out your App Service plan, you add more application hosts, with all the apps in that App Service plan running on each host. A single App Service Environment v3 supports up to 200 total App Service plan instances across all the App Service plans combined. A single App Service Isolated v2 (Iv2) plan supports up to 100 instances on its own.

If you require physical isolation down to the hardware level, you can deploy your App Service Environment v3 on dedicated hosts. When you deploy on dedicated hosts, scaling across all App Service plans is limited to the number of available cores in this environment. An App Service Environment deployed on dedicated hosts has 132 vCores available. I1v2 uses two vCores, I2v2 uses four vCores, and I3v2 uses eight vCores for each instance. Only I1v2, I2v2, and I3v2 SKU sizes are available in an App Service Environment deployed on dedicated hosts. Extra charges apply for dedicated host deployments. Isolation down to the hardware level typically isn't a requirement for most customers, so consider the limitations of dedicated host deployments before you use this feature. To determine whether a dedicated host deployment is right for you, review your security and compliance requirements before deployment.

## Virtual network support

The App Service Environment feature is a deployment of Azure App Service into a single subnet within a virtual network. When you deploy an app into an App Service Environment, it's exposed on the inbound address that's assigned to the environment. If your App Service Environment is deployed with an internal virtual IP (VIP) address, the inbound address for all apps is an address within the App Service Environment subnet. If your App Service Environment is deployed with an external VIP address, the inbound address is an internet-accessible address, and your apps are listed in a public Domain Name System.

An App Service Environment v3 in its subnet uses a varying number of addresses, depending on the number of instances and the amount of traffic. Some infrastructure roles are automatically scaled, depending on the number of App Service plans and the load. A `/24` Classless Inter-Domain Routing block that has 256 addresses in it is the recommended size for your App Service Environment v3 subnet. That size can host an App Service Environment v3 that's scaled out to its limit.

The apps in an App Service Environment don't need any features enabled to access resources on the same virtual network that the App Service Environment is in. If the App Service Environment virtual network is connected to another network, the apps in the App Service Environment can access resources in those extended networks. User configuration on the network can block traffic.

The multitenant version of Azure App Service includes numerous features that let your apps connect to various networks. With these networking features, your apps function as if they're deployed on a virtual network. Apps in an App Service Environment v3 don't require added configuration to run on the virtual network.

A key benefit of using an App Service Environment instead of a multitenant service is that network access controls for the App Service Environment-hosted apps exist outside the application configuration. In a multitenant service, you must enable the features on each app individually and use role-based access control or a policy to prevent configuration changes.

## Feature differences

App Service Environment v3 differs from earlier versions in the following ways:

- There are no networking dependencies on the customer's virtual network. You can secure all inbound and outbound traffic and route outbound traffic as you want.

- You can deploy an App Service Environment v3 with zone redundancy enabled. You set zone redundancy only in regions where all App Service Environment v3 dependencies support zone redundancy. You can enable zone redundancy at creation or anytime after deployment. With a zone-redundant App Service Environment, each App Service plan must have at least two instances so that they can be spread across zones. Each App Service plan's zone redundancy status is independent, so you can have a mix of zone-redundant and non-zone-redundant plans. To make plans zone redundant, the App Service Environment must have zone redundancy enabled. Non-zone-redundant plans can be scaled down to a single instance. For more information, see [Reliability in Azure App Service](../../reliability/reliability-app-service.md?pivots=isolated).

- You can deploy an App Service Environment v3 on a dedicated host group. Host group deployments aren't zone redundant.

- Scaling is faster than with an App Service Environment v2. Scaling is much faster than in the multitenant service, but it isn't immediate.

- Front-end scaling adjustments are no longer required. App Service Environment v3 front ends automatically scale to meet your needs and are deployed on better hosts.

- Scaling no longer prevents other scale operations within App Service Environment v3. Only one scale operation runs at a time for a combination of OS and size. For example, while your Windows small App Service plan is scaling, you can start a scale operation for a Windows medium plan or any other plan except Windows small.

- You can reach apps in an internal-VIP App Service Environment v3 across global peering. This access wasn't possible in earlier versions.

A few features that were available in earlier versions of App Service Environment aren't available in App Service Environment v3. For example, you can no longer do the following actions:

- Perform a backup and restore operation on a storage account behind a firewall.

- Access the FTPS endpoint by using a custom domain suffix.

## Pricing

With App Service Environment v3, the pricing model varies depending on the type of App Service Environment deployment that you have. There are three pricing models:

- **App Service Environment v3:** If the App Service Environment is empty, there's a charge as though you have one instance of Windows I1v2. The one instance charge isn't an additive charge but is applied only if the App Service Environment is empty.

- **Zone redundant App Service Environment v3:** There's no added charge for availability zone support. The pricing model is the same as an App Service Environment that isn't zone redundant.

- **Dedicated host App Service Environment v3:** With a dedicated host deployment, you pay for two dedicated hosts at the time of App Service Environment v3 creation, based on our pricing. As you scale, you're charged a specialized Isolated v2 rate for each vCore. I1v2 uses two vCores, I2v2 uses four vCores, and I3v2 uses eight vCores for each instance.

Reserved Instance pricing for Isolated v2 is available and is described in [How reservation discounts apply to Azure App Service](../../cost-management-billing/reservations/reservation-discount-app-service.md). App Service and Reserved Instance pricing is available at [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/windows/) under the Isolated v2 plan.

## Regions

App Service Environment v3 is available in the following regions:

### Azure Public

| Region               | Single-zone support          | Availability zone support   |
| -------------------- | :--------------------------: | :-------------------------: |
| Australia Central    | ✅                           |                             |
| Australia Central 2  | ✅*                          |                             |
| Australia East       | ✅                           | ✅                          |
| Australia Southeast  | ✅                           |                             |
| Brazil South         | ✅                           | ✅                          |
| Brazil Southeast     | ✅                           |                             |
| Canada Central       | ✅                           | ✅                          |
| Canada East          | ✅                           |                             |
| Central India        | ✅                           | ✅                          |
| Central US           | ✅                           | ✅                          |
| East Asia            | ✅                           | ✅                          |
| East US              | ✅                           | ✅                          |
| East US 2            | ✅                           | ✅                          |
| France Central       | ✅                           | ✅                          |
| France South         | ✅                           |                             |
| Germany North        | ✅                           |                             |
| Germany West Central | ✅                           | ✅                          |
| Israel Central       | ✅                           | ✅                          |
| Italy North          | ✅                           | ✅**                        |
| Japan East           | ✅                           | ✅                          |
| Japan West           | ✅                           |                             |
| Jio India Central    | ✅**                         |                             |
| Jio India West       | ✅**                         |                             |
| Korea Central        | ✅                           | ✅                          |
| Korea South          | ✅                           |                             |
| Mexico Central       | ✅                           | ✅**                        |
| New Zealand North    | ✅                           | ✅                          |
| North Central US     | ✅                           |                             |
| North Europe         | ✅                           | ✅                          |
| Norway East          | ✅                           | ✅                          |
| Norway West          | ✅                           |                             |
| Poland Central       | ✅                           | ✅                          |
| Qatar Central        | ✅**                         | ✅**                        |
| South Africa North   | ✅                           | ✅                          |
| South Africa West    | ✅                           |                             |
| South Central US     | ✅                           | ✅                          |
| South India          | ✅                           |                             |
| Southeast Asia       | ✅                           | ✅                          |
| Spain Central        | ✅                           | ✅**                        |
| Sweden Central       | ✅                           | ✅                          |
| Sweden South         | ✅                           |                             |
| Switzerland North    | ✅                           | ✅                          |
| Switzerland West     | ✅                           |                             |
| UAE Central          | ✅                           |                             |
| UAE North            | ✅                           | ✅                         |
| UK South             | ✅                           | ✅                          |
| UK West              | ✅                           |                             |
| West Central US      | ✅                           |                             |
| West Europe          | ✅                           | ✅                          |
| West India           | ✅*                          |                             |
| West US              | ✅                           |                             |
| West US 2            | ✅                           | ✅                          |
| West US 3            | ✅                           | ✅                          |

\* Limited availability and no support for dedicated host deployments.  
\** To learn more about availability zones and available services support in these regions, contact your Microsoft sales or customer representative.

### Azure Government

| Region               | Single-zone support          | Availability zone support   |
| -------------------- | :--------------------------: | :-------------------------: |
| US DoD Central       | ✅                           |                             |
| US DoD East          | ✅                           |                             |
| US Gov Arizona       | ✅                           |                             |
| US Gov Texas         | ✅                           |                             |
| US Gov Virginia      | ✅                           |✅                          |

### Microsoft Azure operated by 21Vianet

| Region               | Single-zone support          | Availability zone support   |
| -------------------- | :--------------------------: | :-------------------------: |
|                      | App Service Environment v3   | App Service Environment v3  |
| China East 3         | ✅                          |                              |
| China North 3        | ✅                          | ✅                          |

### In-region data residency

An App Service Environment stores customer data, including app content, settings, and secrets, only within the region where it's deployed. All data remains in the region, which ensures compliance with regional [data residency requirements](https://azure.microsoft.com/explore/global-infrastructure/data-residency/#overview).

## Pricing tiers

The following sections list the regional pricing tiers, or SKUs, availability for App Service Environment v3.

> [!NOTE]
> Windows Container plans don't support memory-intensive SKUs.
 
### Azure Public

| Region               | Standard     | Large       | Memory intensive  |
| -------------------- | :----------: | :---------: | :---------------: |
|                      | I1v2-I3v2    | I4v2-I6v2   | I1mv2-I5mv2       |
| Australia Central    | ✅          | ✅          | ✅               | 
| Australia Central 2  | ✅          | ✅          | ✅               | 
| Australia East       | ✅          | ✅          | ✅               | 
| Australia Southeast  | ✅          | ✅          | ✅               | 
| Brazil South         | ✅          | ✅          |                   | 
| Brazil Southeast     | ✅          | ✅          | ✅               |
| Canada Central       | ✅          | ✅          | ✅               |
| Canada East          | ✅          | ✅          | ✅               | 
| Central India        | ✅          | ✅          | ✅               | 
| Central US           | ✅          | ✅ *        |                   | 
| East Asia            | ✅          | ✅          | ✅               |
| East US              | ✅          | ✅          |                   | 
| East US 2            | ✅          | ✅          | ✅               |
| France Central       | ✅          | ✅          | ✅               | 
| France South         | ✅          | ✅          | ✅               | 
| Germany North        | ✅          | ✅          | ✅               | 
| Germany West Central | ✅          | ✅          | ✅               | 
| Israel Central       | ✅          | ✅          |                   | 
| Italy North          | ✅          | ✅          |                   | 
| Japan East           | ✅          | ✅          | ✅               | 
| Japan West           | ✅          | ✅          | ✅               | 
| Jio India Central    | ✅          | ✅          |                   | 
| Jio India West       | ✅          | ✅          |                   | 
| Korea Central        | ✅          | ✅          |                   | 
| Korea South          | ✅          | ✅          | ✅               |
| Mexico Central       | ✅          | ✅          |                   | 
| New Zealand North    | ✅          | ✅          |                   | 
| North Central US     | ✅          | ✅          | ✅               | 
| North Europe         | ✅          | ✅          | ✅               |
| Norway East          | ✅          | ✅          | ✅               | 
| Norway West          | ✅          | ✅          | ✅               |
| Poland Central       | ✅          | ✅          |                   |
| Qatar Central        | ✅          | ✅          |                   |
| South Africa North   | ✅          | ✅          | ✅               |
| South Africa West    | ✅          | ✅          | ✅               | 
| South Central US     | ✅          | ✅          | ✅               |
| South India          | ✅          | ✅          |                   | 
| Southeast Asia       | ✅          | ✅          | ✅               |
| Spain Central        | ✅          | ✅          |                   | 
| Sweden Central       | ✅          | ✅          | ✅               |
| Sweden South         | ✅          | ✅          | ✅               |
| Switzerland North    | ✅          | ✅          | ✅               |
| Switzerland West     | ✅          | ✅          | ✅               | 
| UAE Central          | ✅          | ✅          |                   | 
| UAE North            | ✅          | ✅          | ✅               | 
| UK South             | ✅          | ✅          | ✅               | 
| UK West              | ✅          | ✅          | ✅               | 
| West Central US      | ✅          | ✅ *        |                   | 
| West Europe          | ✅          | ✅ *        |                   | 
| West India           | ✅          | ✅          |                   | 
| West US              | ✅          | ✅          | ✅               | 
| West US 2            | ✅          | ✅          | ✅               | 
| West US 3            | ✅          | ✅          | ✅               | 

\* Windows Container doesn't support Large SKUs in this region.

### Azure Government

| Region               | Standard     | Large       | Memory intensive  |
| -------------------- | :----------: | :---------: | :---------------: |
|                      | I1v2-I3v2    | I4v2-I6v2   | I1mv2-I5mv2       |
| US DoD Central       | ✅          |✅ *         |                   |
| US DoD East          | ✅          |✅ *         |                   |
| US Gov Arizona       | ✅          |✅ *         |                   |
| US Gov Texas         | ✅          |✅ *         |                   |
| US Gov Virginia      | ✅          |✅ *         |                   |

### Microsoft Azure operated by 21Vianet

| Region               | Standard     | Large       | Memory intensive  |
| -------------------- | :----------: | :---------: | :---------------: |
|                      | I1v2-I3v2    | I4v2-I6v2   | I1mv2-I5mv2       |
| China East 3         | ✅          | ✅ *        |                   |
| China North 3        | ✅          | ✅ *        |                   |

