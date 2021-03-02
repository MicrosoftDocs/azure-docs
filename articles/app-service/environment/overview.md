---
title: App Service Environment overview
description: Overview on the App Service Environment
author: ccompy
ms.assetid: 3d37f007-d6f2-4e47-8e26-b844e47ee919
ms.topic: article
ms.date: 03/02/2021
ms.author: ccompy
ms.custom: seodec18
---

# App Service Environment overview 

> [!NOTE]
> This article is about the App Service Environment v3 (preview)
> 

The Azure App Service Environment is an Azure App Service feature that provides a fully isolated and dedicated environment for securely running App Service apps at high scale. This capability can host your:

- Windows web apps
- Linux web apps
- Docker containers
- Functions

App Service environments (ASEs) are appropriate for application workloads that require:

- High scale.
- Isolation and secure network access.
- High memory utilization.
- High requests per second (RPS). You can make multiple ASEs in a single Azure region or across multiple Azure regions. This flexibility makes ASEs ideal for horizontally scaling stateless applications with a high RPS requirement.

ASE's host applications from only one customer and do so in one of their VNets. Customers have fine-grained control over inbound and outbound application network traffic. Applications can establish high-speed secure connections over VPNs to on-premises corporate resources.

ASEv3 comes with its own pricing tier, Isolated V2.
App Service Environments v3 provide a surrounding to safeguard your apps in a subnet of your network and provides your own private deployment of Azure App Service.
Multiple ASEs can be used to scale horizontally. 
Apps running on ASEs can have their access gated by upstream devices, such as web application firewalls (WAFs). For more information, see Web application firewall (WAF).

## Usage scenarios

The App Service Environment has many use cases including:

- Internal line-of-business applications
- Applications that need more than 30 ASP instances
- Single tenant system to satisfy internal compliance or security requirements
- Network isolated application hosting
- Multi-tier applications

There are a number of networking features that enable apps in the multi-tenant App Service to reach network isolated resources or become network isolated themselves. These features are enabled at the application level.  With an ASE, there's no additional configuration on the apps for them to be in the VNet. The apps are deployed into a network isolated environment that is already in a VNet. On top of the ASE hosting network isolated apps, it's also a single-tenant system. There are no other customers using the ASE. If you really need a complete isolation story, you can also get your ASE deployed onto dedicated hardware. Between network isolated application hosting, single tenancy, and the ability 

## Dedicated environment
An ASE is dedicated exclusively to a single subscription and can host 200 total App Service Plan instances across multiple App Service plans. The word "instance" refers to App Service plan horizontal scaling. Each instances is the equivalent to a worker role. While an ASE can have 200 total instances, a single Isolated v2 App Service plan can hold 100 instances. The ASE can hold two App Service plans with 100 instances in each, 200 single-instance App Service plans, or everything in between.

An ASE is composed of front ends and workers. Front ends are responsible for HTTP/HTTPS termination and automatic load balancing of app requests within an ASE. Front ends are automatically added as the App Service plans in the ASE are scaled out.

Workers are roles that host customer apps. Workers are available in three fixed sizes:

- Two vCPU/8 GB RAM
- Four vCPU/16 GB RAM
- Eight vCPU/32 GB RAM

Customers don't need to manage front ends and workers. All infrastructure is automatically. As App Service plans are created or scaled in an ASE, the required infrastructure is added or removed as appropriate.

There's a charge for Isolated V2 App Service plan instances. If you have no App Service plans at all in your ASE, you are charged as though you had one App Service plan with one instance of the two core workers.

## Virtual network support
The ASE feature is a deployment of the Azure App Service directly into a customer's Azure Resource Manager virtual network. An ASE always exists in a subnet of a virtual network. You can use the security features of virtual networks to control inbound and outbound network communications for your apps.

Network Security Groups restrict inbound network communications to the subnet where an ASE resides. You can use NSGs to run apps behind upstream devices and services such as WAFs and network SaaS providers.

Apps also frequently need to access corporate resources such as internal databases and web services. If you deploy the ASE in a virtual network that has a VPN connection to the on-premises network, the apps in the ASE can access the on-premises resources. This capability is true regardless of whether the VPN is a site-to-site or Azure ExpressRoute VPN.

## Preview
The App Service Environment v3 is in public preview.  Some features are being added during the preview progression. The current limitations of ASEv3 include:

- Inability to scale an App Service plan beyond 50 instances
- Inability to get a container from a private registry
- Inability for currently unsupported App Service features to go through customer VNet
- No external deployment model with an internet accessible endpoint
- No command line support (AZ CLI and PowerShell)
- No upgrade capability from ASEv2 to ASEv3
- No FTP support
- No support for some App Service features going through the customer VNet. Backup/restore, Key Vault references in app settings, using a private container registry, and Diagnostic logging to storage won't function with service endpoints or private endpoints
	
### ASEv3 preview architecture
In ASEv3 preview, the ASE will use private endpoints to support inbound traffic. The private endpoint will be replaced with load balancers by GA. While in preview, the ASE won't have built in support for an internet accessible endpoint. You could add an Application Gateway for such a purpose. The ASE needs resources in two subnets.  Inbound traffic will flow through a private endpoint. The private endpoint can be placed in any subnet so long as it has an available address that can be used by private endpoints.  The outbound subnet must be empty and delegated to Microsoft.Web/hostingEnvironments. While used by the ASE, the outbound subnet can't be used for anything else.

With ASEv3, there are no inbound or outbound networking requirements on the ASE subnet. You can control the traffic with Network Security Groups and Route Tables and it only will affect your application traffic. Don't delete the private endpoint associated with your ASE as that action can't be undone. The private endpoint used for the ASE is used for all of the apps in the ASE. 
