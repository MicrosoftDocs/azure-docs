---
title: App Service Environment overview
description: Overview on the App Service Environment
author: ccompy
ms.assetid: 3d37f007-d6f2-4e47-8e26-b844e47ee919
ms.topic: article
ms.date: 07/05/2021
ms.author: ccompy
ms.custom: references_regions
---
# App Service Environment overview 
> [!NOTE]
> This article is about the App Service Environment v3 which is used with Isolated v2 App Service plans
> 

The Azure App Service Environment is an Azure App Service feature that provides a fully isolated and dedicated environment for securely running App Service apps at high scale. This capability can host your:

- Windows web apps
- Linux web apps
- Docker containers
- Functions
- Logic Apps (Standard)

App Service environments (ASEs) are appropriate for application workloads that require:

- High scale.
- Isolation and secure network access.
- High memory utilization.
- High requests per second (RPS). You can make multiple ASEs in a single Azure region or across multiple Azure regions. This flexibility makes an ASE ideal for horizontally scaling stateless applications with a high RPS requirement.

ASE's host applications from only one customer and do so in one of their VNets. Customers have fine-grained control over inbound and outbound application network traffic. Applications can establish high-speed secure connections over VPNs to on-premises corporate resources.

## Usage scenarios

The App Service Environment has many use cases including:

- Internal line-of-business applications
- Applications that need more than 30 ASP instances
- Single tenant system to satisfy internal compliance or security requirements
- Network isolated application hosting
- Multi-tier applications

There are many networking features that enable apps in the multi-tenant App Service to reach network isolated resources or become network isolated themselves. These features are enabled at the application level.  With an ASE, there's no added configuration required for the apps to be in the VNet. The apps are deployed into a network isolated environment that is already in a VNet. On top of the ASE hosting network isolated apps, it's also a single-tenant system. There are no other customers using the ASE. If you really need a complete isolation story, you can also get your ASE deployed onto dedicated hardware. 

## Dedicated environment

The ASE is a single tenant deployment of the Azure App Service that runs in your virtual network. 

Applications are hosted in App Service plans, which are created in an App Service Environment. The App Service plan is essentially a provisioning profile for an application host. As you scale your App Service plan out, you create more application hosts with all of the apps in that App Service plan on each host. A single ASEv3 can have up to 200 total App Service plan instances across all of the App Service plans combined. A single Isolated v2 App Service plan can have up to 100 instances by itself. 

## Virtual network support

The ASE feature is a deployment of the Azure App Service into a single subnet in a customer's Azure Resource Manager virtual network (VNet). When you deploy an app into an ASE, the app will be exposed on the inbound address assigned to the ASE. If your ASE is deployed with an internal VIP, then the inbound address for all of the apps will be an address in the ASE subnet. If your ASE is deployed with an external VIP, then the inbound address will be an internet addressable address and your apps will be in public DNS. 

The number of addresses used by an ASEv3 in its subnet will vary based on how many instances you have along with how much traffic. There are infrastructure roles that are automatically scaled depending on the number of App Service plans and the load. The recommended size for your ASEv3 subnet is a /24 CIDR block with 256 addresses in it as that can host an ASEv3 scaled out to its limit.

The apps in an ASE do not need any features enabled to access resources in the same VNet that the ASE is in. If the ASE VNet is connected to another network, then the apps in the ASE can access resources in those extended networks. Traffic can be blocked by user configuration on the network. 

The multi-tenant version of Azure App Service contains numerous features to enable your apps to connect to your various networks. Those networking features enable your apps to act as if they were deployed in a VNet. The apps in an ASEv3 do not need any configuration to be in the VNet. A benefit of using an ASE over the multi-tenant service is that any network access controls to the ASE hosted apps is completely external to the application configuration. With the apps in the multi-tenant service, you must enable the features on an app by app basis and use RBAC or policy to prevent any configuration changes. 

## Feature differences

Compared to earlier versions of the ASE, there are some differences with ASEv3. With ASEv3:

- There are no networking dependencies in the customer VNet. You can secure all inbound and outbound as desired. Outbound traffic can be routed also as desired. 
- You can deploy it enabled for zone redundancy. Zone redundancy can only be set during ASEv3 creation and only in regions where all ASEv3 dependencies are zone redundant. 
- You can deploy it on a dedicated host group. Host group deployments are not zone redundant. 
- Scaling is much faster than with ASEv2. While scaling still is not immediate as in the multi-tenant service, it is a lot faster.
- Front end scaling adjustments are no longer required. The ASEv3 front ends automatically scale to meet needs and are deployed on better hosts. 
- Scaling no longer blocks other scale operations within the ASEv3 instance. Only one scale operation can be in effect for a combination of OS and size. For example, while your Windows small App Service plan was scaling, you could kick off a scale operation to run at the same time on a Windows medium or anything else other than Windows small. 
- Apps in an internal VIP ASEv3 can be reached across global peering. Access across global peering was not possible with ASEv2. 

There are a few features that are not available in ASEv3 that were available in earlier versions of the ASE. In ASEv3, you can't:

- send SMTP traffic. You can still have email triggered alerts but your app can't send outbound traffic on port 25
- deploy your apps with FTP
- use remote debug with your apps
- upgrade yet from ASEv2
- monitor your traffic with Network Watcher or NSG Flow
- configure a IP-based TLS/SSL binding with your apps

## Pricing 

With ASEv3, there is a different pricing model depending on the type of ASE deployment you have. The three pricing models are: 

- **ASEv3**: If ASE is empty, there is a charge as if you had one ASP with one instance of Windows I1v2. The one instance charge is not an additive charge but is only applied if the ASE is totally empty.
- **Availability Zone ASEv3**: There is a minimum 9 Windows I1v2 instance charge. There is no added charge for availability zone support if you have 9 or more App Service plan instances. 
- **Dedicated host ASEv3**: With a dedicated host deployment, you are charged for two dedicated hosts per our pricing at ASEv3 creation then a small percentage of the Isolated V2 rate per core charge as you scale.

Reserved Instance pricing for Isolated v2 will be available after GA.  

## Regions

The ASEv3 is available in the following regions.

|Normal and dedicated host ASEv3 regions|	AZ ASEv3 regions|
|---------------------------------------|------------------|
|Australia East|	Australia East|
|Australia Southeast|Brazil South|
|Brazil South	|Canada Central|
|Canada Central|Central US|
|Central India	|East US|
|Central US	|East US 2|
|East Asia	| France Central|
|East US	| Germany West Central|
|East US 2|	North Europe|
|France Central	| South Central US|
|Germany West Central	|	Southeast Asia|
|Korea Central	| UK South|
|North Europe	| West Europe|
|Norway East	| West US 2	|
|South Africa North| |	
|South Central US	| |
|Southeast Asia| |
|Switzerland North	| |	
|UK South| |	
|UK West| |
|West Central US	| |	
|West Europe	| |
|West US	| |	
|West US 2| |
