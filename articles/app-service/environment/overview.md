---
title: App Service Environment Overview
description: Learn about App Service Environments, which are fully isolated and single-tenant App Service deployments that provide high-scale, network-secured hosting.
author: seligj95
ms.topic: overview
ms.date: 11/11/2025
ms.update-cycle: 1095-days
ms.author: jordanselig
ms.custom:
  - "UpdateFrequency3, references_regions"
  - build-2025
ms.service: azure-app-service
---

# App Service Environment overview

App Service Environment is an Azure App Service feature that provides a fully isolated and dedicated environment to run App Service apps securely at high scale. Unlike the App Service public multitenant offering that shares supporting infrastructure, an App Service Environment provides dedicated compute for a single customer. For more information, see [App Service Environment v3 and App Service public multitenant comparison](ase-multi-tenant-comparison.md).

An App Service Environment provides hosting capabilities for various workloads:

- Windows web apps
- Linux web apps
- Windows and Linux Docker containers
- Functions
- Standard logic apps in [supported regions](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=logic-apps&regions=all)

App Service Environments are designed to support application workloads that require specific performance and security features:

- Support for high scale
- Isolation and secure network access
- Support for high memory usage
- Ability to handle high requests per second (RPS)

You can create multiple App Service Environments in a single Azure region or across multiple Azure regions. This flexibility makes an App Service Environment ideal for horizontally scaling stateless applications that have a high RPS requirement.

An App Service Environment hosts applications for a single customer on one of their virtual networks. Customers have fine-grained control over inbound and outbound application network traffic. Applications can establish high-speed secure connections over virtual private networks to on-premises corporate resources.

## Usage scenarios

App Service Environments have many use cases:

- Internal line-of-business applications
- Applications that need more than 30 App Service plan instances
- Single-tenant systems to satisfy internal compliance or security requirements
- Network-isolated application hosting
- Multiple-tier applications

Multitenant App Service apps can use several networking features to reach network-isolated resources or become network-isolated themselves. These features are enabled at the application level. For an App Service Environment, apps don't require extra configuration to join a virtual network. You deploy the apps into a network-isolated environment that already resides in a virtual network. If you need complete isolation, deploy your App Service Environment on dedicated hardware.

## Dedicated environment

An App Service Environment is a single-tenant deployment of App Service that runs on your virtual network.

Applications are hosted in App Service plans, which you create in an App Service Environment. An App Service plan serves as a provisioning profile for an application host. As you scale out your App Service plan, you add more application hosts. All apps in that plan run on each host. A single App Service Environment v3 supports up to 200 total instances across all App Service plans. A single App Service Isolated v2 (Iv2) plan supports up to 100 instances.

If you require physical isolation down to the hardware level, you can deploy your App Service Environment v3 on dedicated hosts.

- Dedicated host deployments limit scaling across all App Service plans to the number of available cores in that environment.

- Each environment has 132 vCores.
- Instances sizes use the following vCore allocations:
  - I1v2 uses two vCores.
  - I2v2 uses four vCores.
  - I3v2 uses eight vCores.
  
Only I1v2, I2v2, and I3v2 SKU sizes are available in an App Service Environment deployed on dedicated hosts. Extra charges apply for dedicated host deployments.

> [!NOTE]
> Dedicated host deployments are available only in limited regions, and expansion to additional regions isn't planned.

Most customers don't require isolation down to the hardware level, so consider the limitations of dedicated host deployments before you use this feature. To determine whether a dedicated host deployment is right for you, review your security and compliance requirements before deployment.

## Virtual network support

An App Service Environment is a deployment of App Service that runs in a single subnet within a virtual network. When you deploy an app into an App Service Environment, it uses the inbound address assigned to the environment. If your App Service Environment is deployed with an internal virtual IP (VIP) address, the inbound address for all apps is an address within the App Service Environment subnet. If your App Service Environment is deployed with an external VIP address, the inbound address is a public-facing address, and your apps are listed in the public Domain Name System (DNS).

An App Service Environment v3 in its subnet uses a variable number of addresses, depending on the number of instances and the amount of traffic. Some infrastructure roles scale automatically, depending on the number of App Service plans and the load. Use a `/24` Classless Inter-Domain Routing (CIDR) block that has 256 addresses for your App Service Environment v3 subnet. This size can host an App Service Environment v3 at full scale-out capacity.

The apps in an App Service Environment can access resources on the same virtual network as App Service Environment without extra configuration. If the App Service Environment virtual network connects to another network, the apps in the App Service Environment can access resources in those extended networks. But user configuration on the network can block traffic.

The multitenant version of App Service includes numerous features that let your apps connect to various networks. These networking features enable your apps to  function as if they're deployed on a virtual network. Apps in an App Service Environment v3 don't require added configuration to run on the virtual network.

A key benefit of using an App Service Environment instead of a multitenant service is that network access controls for the hosted apps exist outside the application configuration. In a multitenant service, you must enable the features on each app individually and use role-based access control (RBAC) or a policy to prevent configuration changes.

## Feature differences

App Service Environment v3 differs from earlier versions in the following ways:

- It has no networking dependencies on the customer's virtual network. You can secure all inbound and outbound traffic and route outbound traffic as needed.

- You can deploy an App Service Environment v3 with zone redundancy enabled. This option is available only in regions where all dependencies support zone redundancy. You can enable zone redundancy at creation or anytime after deployment.

  Consider the following factors for an environment that has zone redundancy:
 
  - Each App Service plan must have at least two instances to distribute them across zones.
  - Each App Service plan's zone redundancy status is independent, so you can use a mix of zone-redundant and non-zone-redundant plans.
  - To make plans zone redundant, the App Service Environment must have zone redundancy enabled.
  - You can scale non-zone-redundant plans down to a single instance.
  
  For more information, see [Reliability in App Service Environment](/azure/reliability/reliability-app-service-environment).

- You can deploy an App Service Environment v3 on a dedicated host group. Host group deployments aren't zone redundant.

- It scales faster than an App Service Environment v2.

- It no longer requires front-end scaling adjustments. App Service Environment v3 front ends automatically scale to meet your needs and are deployed on improved hosts.

- It allows scale operations to proceed while another operation is in progress, as long as they have different OS and size combinations. For example, while your Windows small App Service plan scales, you can start a scale operation for a Windows medium plan or any other plan except Windows small.

- It supports access to apps in an internal-VIP App Service Environment v3 across global peering. Earlier versions don't support this access.

Some features available in earlier versions of App Service Environment aren't available in App Service Environment v3. For example, you can no longer do the following actions:

- Perform a backup and restore operation on a storage account behind a firewall.

- Access the File Transfer Protocol Secure (FTPS) endpoint by using a custom domain suffix.

## Pricing

The App Service Environment v3 pricing model varies depending on the deployment type:

- **App Service Environment v3:** If the environment is empty, you're charged as if you have one instance of Windows I1v2. This charge applies only when no instances are deployed.

- **Zone redundant App Service Environment v3:** There's no added charge for availability zone support. The pricing model is the same as an environment that isn't zone redundant.

- **Dedicated host App Service Environment v3:** You pay for two dedicated hosts at the time of environment creation, based on current pricing. As you scale, you're charged for a specialized Iv2 rate for each vCore. For each instance, I1v2 uses two vCores, I2v2 uses four vCores, and I3v2 uses eight vCores.

You can also use [reserved instance pricing for Iv2](../../cost-management-billing/reservations/reservation-discount-app-service.md). For more information, see [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/windows/).

## Regions

App Service Environment v3 is available in the following regions.

### Azure public regions

| Region               | Regional deployment support  | Availability zone support   |
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
| East US              | ✅                           | ✅**                        |
| East US 2            | ✅                           | ✅                          |
| France Central       | ✅                           | ✅                          |
| France South         | ✅                           |                             |
| Germany North        | ✅                           |                             |
| Germany West Central | ✅                           | ✅                          |
| Israel Central       | ✅                           | ✅                          |
| Italy North          | ✅                           | ✅**                        |
| Japan East           | ✅                           | ✅                          |
| Japan West           | ✅                           | ✅                          |
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
| Taiwan North         | ✅                           |                             |
| Taiwan Northwest     | ✅                           |                             |
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

\* App Service Environment v3 has limited availability and no support for dedicated host deployments.  
\** To learn more about availability zones and available services support in these regions, contact your Microsoft sales or customer representative.

### Azure Government regions

| Region               | Regional deployment support  | Availability zone support   |
| -------------------- | :--------------------------: | :-------------------------: |
| US DoD Central       | ✅                           |                             |
| US DoD East          | ✅                           |                             |
| US Gov Arizona       | ✅                           |                             |
| US Gov Texas         | ✅                           |                             |
| US Gov Virginia      | ✅                           |✅                          |

### Azure operated by 21Vianet

| Region               | Regional deployment support | Availability zone support   |
| -------------------- | :--------------------------: | :-------------------------: |
| China East 3         | ✅                          |                              |
| China North 3        | ✅                          | ✅                          |

### In-region data residency

An App Service Environment stores customer data, including app content, settings, and secrets, only within the region where it's deployed. All data remains in the region, which ensures compliance with regional [data residency requirements](https://azure.microsoft.com/explore/global-infrastructure/data-residency/#overview).

## Pricing tiers

The following sections list the regional pricing tiers, or SKUs, availability for App Service Environment v3.

> [!NOTE]
> Windows container plans don't support memory-intensive SKUs.
 
### Azure public regions

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
| Central US           | ✅          | ✅*         | ✅**             | 
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
| Taiwan North         | ✅          |             |                   |
| Taiwan Northwest     | ✅          |             |                   |
| UAE Central          | ✅          | ✅          |                   | 
| UAE North            | ✅          | ✅          | ✅               | 
| UK South             | ✅          | ✅          | ✅               | 
| UK West              | ✅          | ✅          | ✅               | 
| West Central US      | ✅          | ✅*         |                   | 
| West Europe          | ✅          | ✅*         |                   | 
| West India           | ✅          | ✅          |                   | 
| West US              | ✅          | ✅          | ✅               | 
| West US 2            | ✅          | ✅          | ✅               | 
| West US 3            | ✅          | ✅          | ✅               | 

\* Windows containers don't support large SKUs in this region.  
\** Limited availability. Create a support ticket if you run into issues deploying this SKU.

### Azure Government regions

| Region               | Standard     | Large       | Memory intensive  |
| -------------------- | :----------: | :---------: | :---------------: |
|                      | I1v2-I3v2    | I4v2-I6v2   | I1mv2-I5mv2       |
| US DoD Central       | ✅          |✅ *         |                   |
| US DoD East          | ✅          |✅ *         |                   |
| US Gov Arizona       | ✅          |✅ *         |                   |
| US Gov Texas         | ✅          |✅ *         |                   |
| US Gov Virginia      | ✅          |✅ *         |                   |

\* Windows containers don't support large SKUs in this region.

### Azure operated by 21Vianet

| Region               | Standard     | Large       | Memory intensive  |
| -------------------- | :----------: | :---------: | :---------------: |
|                      | I1v2-I3v2    | I4v2-I6v2   | I1mv2-I5mv2       |
| China East 3         | ✅          | ✅ *        |                   |
| China North 3        | ✅          | ✅ *        |                   |

\* Windows containers don't support large SKUs in this region.
