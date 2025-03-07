---
title: App Service Environment overview
description: This article discusses the Azure App Service Environment feature of Azure App Service.
author: madsd
ms.topic: overview
ms.date: 06/18/2024
ms.author: madsd
ms.custom: "UpdateFrequency3, references_regions"
---

# App Service Environment overview

An App Service Environment is an Azure App Service feature that provides a fully isolated and dedicated environment for running App Service apps securely at high scale. Unlike the App Service public multitenant offering where supporting infrastructure is shared, with App Service Environment, compute is dedicated to a single customer. For more information on the differences between App Service Environment and App Service public multitenant, see the [comparison of the offerings](ase-multi-tenant-comparison.md).

> [!NOTE]
> This article covers the features, benefits, and use cases of App Service Environment v3, which is used with App Service Isolated v2 plans.
>
An App Service Environment can host your:

- Windows web apps
- Linux web apps
- Docker containers (Windows and Linux)
- Functions
- Logic apps (Standard) - in [supported regions](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=logic-apps&regions=all)

App Service Environments are appropriate for application workloads that require:

- High scale.
- Isolation and secure network access.
- High memory utilization.
- High requests per second (RPS). You can create multiple App Service Environments in a single Azure region or across multiple Azure regions. This flexibility makes an App Service Environment ideal for horizontally scaling stateless applications with a high RPS requirement.

An App Service Environment can host applications from only one customer, and they do so on one of their virtual networks. Customers have fine-grained control over inbound and outbound application network traffic. Applications can establish high-speed secure connections over VPNs to on-premises corporate resources.

## Usage scenarios

App Service Environments have many use cases, including:

- Internal line-of-business applications.
- Applications that need more than 30 App Service plan instances.
- Single-tenant systems to satisfy internal compliance or security requirements.
- Network-isolated application hosting.
- Multi-tier applications.

There are many networking features that enable apps in a multitenant App Service to reach network-isolated resources or become network-isolated themselves. These features are enabled at the application level. With an App Service Environment, no added configuration is required for the apps to be on a virtual network. The apps are deployed into a network-isolated environment that's already on a virtual network. If you really need a complete isolation story, you can also deploy your App Service Environment onto dedicated hardware.

## Dedicated environment

An App Service Environment is a single-tenant deployment of Azure App Service that runs on your virtual network.

Applications are hosted in App Service plans, which are created in an App Service Environment. An App Service plan is essentially a provisioning profile for an application host. As you scale out your App Service plan, you create more application hosts with all the apps in that App Service plan on each host. A single App Service Environment v3 can have up to 200 total App Service plan instances across all the App Service plans combined. A single App Service Isolated v2 (Iv2) plan can have up to 100 instances by itself.

If you have a requirement that you must have physical isolation all the way down to the hardware level, you can deploy your App Service Environment v3 onto dedicated hardware (hosts). When you're deploying onto dedicated hosts, you're limited in scaling across all App Service plans to the number of cores in this type of environment. An App Service Environment that's deployed on dedicated hosts has 132 vCores available. I1v2 uses two vCores, I2v2 uses four vCores, and I3v2 uses eight vCores per instance. Only I1v2, I2v2, and I3v2 SKU sizes are available on App Service Environment deployed on dedicated hosts. There's extra charges associated with deployment on dedicated hosts. Isolation down to the hardware level is typically not a requirement for the majority of customers. The limitations with dedicated host deployments should be considered before using the feature. To ensure a dedicated host deployment is right for you, you should review your security and compliance requirements before deployment.

## Virtual network support

The App Service Environment feature is a deployment of Azure App Service into a single subnet on a virtual network. When you deploy an app into an App Service Environment, the app is exposed on the inbound address that's assigned to the App Service Environment. If your App Service Environment is deployed with an internal virtual IP (VIP) address, the inbound address for all the apps is an address in the App Service Environment subnet. If your App Service Environment is deployed with an external VIP address, the inbound address is an internet-addressable address, and your apps are in a public Domain Name System.

The number of addresses that are used by an App Service Environment v3 in its subnet varies, depending on the number of instances and the amount of traffic. Some infrastructure roles are automatically scaled, depending on the number of App Service plans and the load. The recommended size for your App Service Environment v3 subnet is a `/24` Classless Inter-Domain Routing (CIDR) block with 256 addresses in it, because that size can host an App Service Environment v3 that's scaled out to its limit.

The apps in an App Service Environment don't need any features enabled to access resources on the same virtual network that the App Service Environment is in. If the App Service Environment virtual network is connected to another network, the apps in the App Service Environment can access resources in those extended networks. Traffic can be blocked by user configuration on the network.

The multitenant version of Azure App Service contains numerous features to enable your apps to connect to your various networks. With those networking features, your apps can act as though they're deployed on a virtual network. The apps in an App Service Environment v3 don't need any added configuration to be on the virtual network.

A benefit of using an App Service Environment instead of a multitenant service is that any network access controls for the App Service Environment-hosted apps are external to the application configuration. With the apps in the multitenant service, you must enable the features on an app-by-app basis and use role-based access control or a policy to prevent any configuration changes.

## Feature differences

App Service Environment v3 differs from earlier versions in the following ways:

- There are no networking dependencies on the customer's virtual network. You can secure all inbound and outbound traffic and route outbound traffic as you want.
- You can deploy an App Service Environment v3 that's enabled for zone redundancy. You set zone redundancy only during creation and only in regions where all App Service Environment v3 dependencies are zone redundant. Zone redundancy is a deployment time only decision. Changing zone redundancy isn't possible after it has been deployed. With zone redundant App Service Environment, each App Service Plan on the App Service Environment needs to have a minimum of three instances so that they can be spread across zones. For more information, see [Migrate App Service Environment to availability zone support](../../reliability/migrate-app-service-environment.md).
- You can deploy an App Service Environment v3 on a dedicated host group. Host group deployments aren't zone redundant.
- Scaling is faster than with an App Service Environment v2. Although scaling still isn't immediate, as in the multitenant service, it's a lot faster.
- Front-end scaling adjustments are no longer required. App Service Environment v3 front ends automatically scale to meet your needs and are deployed on better hosts.
- Scaling no longer blocks other scale operations within the App Service Environment v3. Only one scale operation can be in effect for a combination of OS and size. For example, while your Windows small App Service plan is scaling, you could kick off a scale operation to run at the same time on a Windows medium or anything else other than Windows small.
- You can reach apps in an internal-VIP App Service Environment v3 across global peering. Such access wasn't possible in earlier versions.

A few features that were available in earlier versions of App Service Environment aren't available in App Service Environment v3. For example, you can no longer do these actions:

- Perform a backup and restore operation on a storage account behind a firewall.
- Access the FTPS endpoint using a custom domain suffix.

## Pricing

With App Service Environment v3, the pricing model varies depending on the type of App Service Environment deployment you have. The three pricing models are:

- **App Service Environment v3**: If the App Service Environment is empty, there's a charge as though you have one instance of Windows I1v2. The one instance charge isn't an additive charge but is applied only if the App Service Environment is empty.
- **Zone redundant App Service Environment v3**: There's a minimum charge of 18 cores. There's no added charge for availability zone support if you have 18 or more cores across your App Service plan instances. If you have fewer than 18 cores across your App Service plans in the zone redundant App Service Environment, the difference between 18 cores and the sum of the cores from the running instance count is charged as additional Windows I1v2 instances.
- **Dedicated host App Service Environment v3**: With a dedicated host deployment, you're charged for two dedicated hosts per our pricing when you create the App Service Environment v3 and then, as you scale, you're charged a specialized Isolated v2 rate per vCore. I1v2 uses two vCores, I2v2 uses four vCores, and I3v2 uses eight vCores per instance.

> [!NOTE]
> Sample calculations for zone redundant App Service Environment v3 pricing:
>
> 1. Your zone redundant App Service Environment v3 has 3 Linux I1v2 instances in a single App Service plan.  
>
> - An I1v2 instance has 2 cores.  
> - In total, across your instances, you have 6 cores.  
> - 18 cores - 6 cores = 12 cores  
> - 12 cores is equivalent to 6 I1v2 instances.  
> - You'll be charged for your 3 Linux I1v2 instances plus 6 additional Windows I1v2 instances.  
>
> 2. Your zone redundant App Service Environment v3 has 3 Linux I2v2 instances in a single App Service plan.  
>
> - An I2v2 instance has 4 cores.  
> - In total, across your instances, you have 12 cores.  
> - 18 cores - 12 cores = 6 cores  
> - 6 cores is equivalent to 3 I1v2 instances.  
> - You'll be charged for your 3 Linux I2v2 instances plus 3 additional Windows I1v2 instances.  
>
> 3. Your zone redundant App Service Environment v3 has 4 Linux I3v2 instances in a single App Service plan.  
>
> - An I3v2 instance has 8 cores.  
> - In total, across your instances, you have 32 cores.  
> - 32 cores is greater than 18 cores  
> - You won't be charged for any additional cores.  
>

Reserved Instance pricing for Isolated v2 is available and is described in [How reservation discounts apply to Azure App Service](../../cost-management-billing/reservations/reservation-discount-app-service.md). The pricing, along with Reserved Instance pricing, is available at [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/windows/) under the Isolated v2 plan.

## Regions

App Service Environment v3 is available in the following regions:

### Azure Public

| Region               | Single zone support          | Availability zone support   |
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

| Region               | Single zone support          | Availability zone support   |
| -------------------- | :--------------------------: | :-------------------------: |
| US DoD Central       | ✅                           |                             |
| US DoD East          | ✅                           |                             |
| US Gov Arizona       | ✅                           |                             |
| US Gov Texas         | ✅                           |                             |
| US Gov Virginia      | ✅                           |✅                          |

### Microsoft Azure operated by 21Vianet

| Region               | Single zone support          | Availability zone support   |
| -------------------- | :--------------------------: | :-------------------------: |
|                      | App Service Environment v3   | App Service Environment v3  |
| China East 3         | ✅                          |                              |
| China North 3        | ✅                          | ✅                          |

### In-region data residency

An App Service Environment only stores customer data including app content, settings, and secrets within the region where it's deployed. All data is guaranteed to remain in the region. For more information, see [Data residency in Azure](https://azure.microsoft.com/explore/global-infrastructure/data-residency/#overview).

## Pricing tiers

The following sections list the regional pricing tiers (SKUs) availability for App Service Environment v3.

> [!NOTE]
> Windows Container plans currently do not support memory intensive SKUs.
>
 
### Azure Public:

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

\* Windows Container doesn't support Large skus in this region.

### Azure Government:

| Region               | Standard     | Large       | Memory intensive  |
| -------------------- | :----------: | :---------: | :---------------: |
|                      | I1v2-I3v2    | I4v2-I6v2   | I1mv2-I5mv2       |
| US DoD Central       | ✅          |✅ *         |                   |
| US DoD East          | ✅          |✅ *         |                   |
| US Gov Arizona       | ✅          |✅ *         |                   |
| US Gov Texas         | ✅          |✅ *         |                   |
| US Gov Virginia      | ✅          |✅ *         |                   |

### Microsoft Azure operated by 21Vianet:

| Region               | Standard     | Large       | Memory intensive  |
| -------------------- | :----------: | :---------: | :---------------: |
|                      | I1v2-I3v2    | I4v2-I6v2   | I1mv2-I5mv2       |
| China East 3         | ✅          | ✅ *        |                   |
| China North 3        | ✅          | ✅ *        |                   |

## Next steps

> [!div class="nextstepaction"]
> [Whitepaper on Using App Service Environment v3 in Compliance-Oriented Industries](https://gigaom.com/report/using-app-service-environment-v3-in-compliance-oriented-industries/)
