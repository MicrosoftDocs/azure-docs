---
title: 'App Service Environment v3 and App Service public multi-tenant comparison'
description: This article provides an overview of the difference between App Service Environment v3 and the public multi-tenant offering of App Service.
author: seligj95
ms.date: 6/11/2024
ms.author: jordanselig
ms.topic: article
---

# App Service Environment v3 and App Service public multi-tenant comparison

An App Service Environment is an Azure App Service feature that provides a fully isolated and dedicated environment for running App Service apps securely at high scale. Compared to the public multi-tenant offering, where the underlying compute is shared with other customers, App Service Environment provides enhanced security, isolation, and network access control. This article provides a comparison between the notable features of App Service Environment v3 and the public multi-tenant offering of App Service.

## Hosting

|Feature  |App Service Environment v3  |App Service public multi-tenant  |
|---------|---------|---------|
|Hosting environment|Fully isolated and dedicated compute|Shared environment. Workers running your apps are dedicated, but the underlying compute is shared with other customers. |
|Hardware|[Virtual Machine Scale Sets](../../virtual-machine-scale-sets/overview.md)|[Virtual Machine Scale Sets](../../virtual-machine-scale-sets/overview.md)|
|[Avalable SKUs](https://azure.microsoft.com/pricing/details/app-service/windows/) |Isolated v2        |Free, Basic, Standard, Premium v2, Premium v3        |
|Dedicated host group|[Available](creation.md#deployment-considerations) |No |
|Remote file storage|Fully dedicated to the App Service Environment |Remote file storage for the application is dedicated, but the storage is hosted on a shared file server |
|Internal Load Balancer (ILB) configuration|Yes, using ILB App Service Environment variation |Yes, via private endpoint |
|Planned maintenance|[Manual upgrade preference is available](maintenance.md). Maintenance is non-disruptive to your apps. |Maintenance is handled by the platform and is non-disruptive to your apps |

## Scaling

Both App Service Environment v3 and the public multi-tenant offering run on [Virtual Machine Scale Sets](../../virtual-machine-scale-sets/overview.md), which means that both offerings benefit from the capabilities that scale sets provide. However, App Service Environment v3 is a dedicated environment, which means that even though it can scale out to more instances than the public multi-tenant offering, scaling out to multiple instances can be slower than the public multi-tenant offering.

|Feature  |App Service Environment v3  |App Service public multi-tenant  |
|---------|---------|---------|
|Maximum instance count|100 instances per App Service plan. Maximum of 200 instances across all plans in a single App Service Environment v3.|30 instances per App Service plan. This is a hard limit that can't be raised.|
|Scaling speed|Slower scaling times due to the dedicated nature of the environment|Faster scaling times due to the shared nature of the environment|

## Certificates and domains

|Feature  |App Service Environment v3  |App Service public multi-tenant  |
|---------|---------|---------|
|Custom domains|A [custom domain suffix](how-to-custom-domain-suffix.md) can be added to the App Service Environment and all apps will inherit the domain suffix. Custom domains can also be added directly to the apps. |Custom domains can be added directly to the apps.|
|Custom domain on private DNS (no domain verification required)|Yes, on an Internal Load Balancer (ILB) App Service Environment|No, the custom domain needs to resolve via public DNS|
|Inbound TLS|Yes, you can manage SSL certificates directly within the environment, including the ability to upload and bind custom SSL certificates|Yes, you can bring your own certificate or use a certificate provided by Azure |
|Inbound TLS using certificates issues by private certificate authority (CA)|Supported|No|
|Outbound calls using client certificates issues by private CA|Supported, you can load your own root CA certificate into the trusted root store|Not supported for source-code based deployments. Supported if deploying using either Windows containers or Linux containers (you can install arbitrary dependencies including private CA issued client certificates inside of a custom container for both platform variants).|
|App Service Managed Certificates|No|Supported|
|Certificates shared across apps|Yes|No, you must upload the certificate to every app|
|Public certificate limit|1000 public certificates per App Service Plan|1000 public certificates per App Service Plan|


## Networking

|Feature  |App Service Environment v3  |App Service public multi-tenant  |
|---------|---------|---------|
|Virtual network integration|Yes, App Service Environment v3 is deployed into a subnet in your virtual network by default |Supported, [must be explicitly enabled](../../app-service/networking-features.md#virtual-network-integration)|
|Private endpoint support|Yes, [must be explicitly enabled on the App Service Environment](networking.md#private-endpoint) |Yes, [must be explicitly enabled](../../app-service/networking-features.md#private-endpoint) |
|IP access restrictions for inbound traffic|Yes, [must be explicitly enabled](networking.md#ip-access-restrictions) |Yes, [must be explicitly enabled](../../app-service/networking-features.md#ip-access-restrictions) |
|Network security group (NSG) integration|Supports inbound and outbound traffic control |Can use NSG for inbound traffic control using the subnet that sourced the IP of a private endpoint (Note: requires private endpoints). Supports outbound network restrictions with NSG on the virtual network integration subnet. |
|UDR integration|Supports outbound traffic routing, [must be explicitly enabled](networking.md#user-defined-routing) |Supports outbound traffic routing, [must be explicitly enabled](../../app-service/networking-features.md#user-defined-routing) |
|Route outbound traffic over virtual network|Yes, all apps are in the same subnet and all outbound traffic is routed through the virtual network by default |Supported |
|[Block inbound traffic to App Service functionality hosted on non-HTTP ports](../../app-service/networking-features.md#app-service-ports)|Supported, NSG can be used to block inbound traffic to non-HTTP ports |Not supported. In some cases (FTP and remote debugging), functionality can be explicitly disabled on a per-application basis. However, inbound network traffic cannot be blocked using NSGs since the listed ports are owned by the underlying App Service platform hosting infrastructure. |

## Pricing

App Service Environment v3 tends to be more expensive than the public multi-tenant offering due to the dedicated nature of the infrastructure. For both offerings, you only pay for the resources you use. Reserved instances and savings plans are available for both offerings to save money on long-term commitments.

|Feature  |App Service Environment v3  |App Service public multi-tenant  |
|---------|---------|---------|
|Pricing     |Pay per instance|Pay per instance|
|Reserved instances|Available|Available|
|Savings plans|Available|Available|
|Availability zone pricing|There's a minimum charge of 18 cores. There's no added charge for availability zone support if you have 18 or more cores across your App Service plan instances. If you have fewer than 18 cores across your App Service plans in the zone redundant App Service Environment, the difference between 18 cores and the sum of the cores from the running instance count is charged as additional Windows I1v2 instances.|3 instance minimum enforced per App Service plan|

## Frequently asked questions TODO:

- [What SKUs are available on App Service Environment v1, v2, and v3?](#what-skus-are-available-on-app-service-environment-v1-v2-and-v3)

#### What SKUs are available on App Service Environment v1, v2, and v3?

App 

## Next steps TODO:

> [!div class="nextstepaction"]
> [Manually migrate to App Service Environment v3](migration-alternatives.md)

> [!div class="nextstepaction"]
> [App Service Environment v3 Networking](networking.md)

> [!div class="nextstepaction"]
> [Using an App Service Environment v3](using.md)
