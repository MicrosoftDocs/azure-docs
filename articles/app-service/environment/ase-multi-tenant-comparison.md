---
title: 'App Service Environment v3 and App Service public multitenant comparison'
description: This article provides an overview of the difference between App Service Environment v3 and the public multitenant offering of App Service.
author: seligj95
ms.date: 7/8/2024
ms.author: jordanselig
ms.topic: article
---

# App Service Environment v3 and App Service public multitenant comparison

An App Service Environment is an Azure App Service feature that provides a fully isolated and dedicated environment for running App Service apps securely at high scale. Compared to the public multitenant offering, where the supporting infrastructure is shared with other customers, App Service Environment provides enhanced security, isolation, and network access control. This article provides a comparison between the differentiating features of App Service Environment v3 and the public multitenant offering of App Service.

### Hosting

|Feature  |App Service Environment v3  |App Service public multitenant  |
|---------|---------|---------|
|Hosting environment|[Fully isolated and dedicated compute](overview.md)|[Shared environment](../../app-service/overview.md). Workers running your apps are dedicated, but the supporting infrastructure is shared with other customers. |
|Hardware|[Virtual Machine Scale Sets](../../virtual-machine-scale-sets/overview.md)|[Virtual Machine Scale Sets](../../virtual-machine-scale-sets/overview.md)|
|[Available SKUs](https://azure.microsoft.com/pricing/details/app-service/windows/) |Isolated v2        |Free, Basic, Standard, Premium v2, Premium v3        |
|Dedicated host group|[Available](overview.md#dedicated-environment) |No |
|Remote file storage|Fully dedicated to the App Service Environment |Remote file storage for the application is dedicated, but the storage is hosted on a shared file server |
|Private inbound configuration|Yes, using ILB App Service Environment variation |Yes, via private endpoint |
|Planned maintenance|[Manual upgrade preference is available](how-to-upgrade-preference.md) |[The platform handles maintenance](../../app-service/routine-maintenance.md) |
|Aggregate remote file share storage limit|1 TB for all apps in an App Service Environment v3|250 GB for all apps in a single App Service plan. 500 GB for all apps across all App Service plans in a single resource group.|

### Scaling

Both App Service Environment v3 and the public multitenant offering run on [Virtual Machine Scale Sets](../../virtual-machine-scale-sets/overview.md), which means that both offerings benefit from the capabilities that scale sets provide. However, App Service Environment v3 is a dedicated environment, which means that even though it can scale out to more instances than the public multitenant offering, scaling out to multiple instances can be slower than the public multitenant offering.

|Feature  |App Service Environment v3  |App Service public multitenant  |
|---------|---------|---------|
|Maximum instance count|100 instances per App Service plan. Maximum of 200 instances across all plans in a single App Service Environment v3.|30 instances per App Service plan. This limit is a hard limit that can't be raised.|
|Scaling speed|Slower scaling times due to the dedicated nature of the environment|Faster scaling times due to the shared nature of the environment|

### Certificates and domains

|Feature  |App Service Environment v3  |App Service public multitenant  |
|---------|---------|---------|
|Custom domains|A [custom domain suffix](how-to-custom-domain-suffix.md) can be added to the App Service Environment and all apps inherit the domain suffix. Custom domains can also be added directly to the apps. |[Custom domains](../../app-service/tutorial-secure-domain-certificate.md) can be added directly to the apps.|
|Custom domain on private DNS (no domain verification required)|Yes, on an Internal Load Balancer (ILB) App Service Environment|No, the custom domain needs to resolve via public DNS|
|Inbound TLS|Yes, you can manage SSL certificates directly within the environment, including the ability to upload and bind custom SSL certificates|Yes, you can bring your own certificate or use a certificate provided by Azure |
|Inbound TLS using certificates issues by private certificate authority (CA)|Supported|No|
|Outbound calls using client certificates issues by private CA|[Supported only from custom code in Windows code-based apps](overview-certificates.md#private-client-certificate). You can load your own root CA certificate into the trusted root store.|Not supported for source-code based deployments. Supported if deploying using either Windows containers or Linux containers (you can install arbitrary dependencies including private CA issued client certificates inside of a custom container for both platform variants).|
|App Service Managed Certificates|[No](overview-certificates.md#limitations)|[Supported](../../app-service/configure-ssl-app-service-certificate.md)|
|Certificates shared across apps|Yes|No, you must upload the certificate to every app|
|Public certificate limit|1,000 public certificates per App Service Plan|1,000 public certificates per App Service Plan|
|End to end TLS encryption for inbound calls|Supported|Supported in preview for Linux, not supported on Windows|
|Change TLS cipher suite order|[Supported](app-service-app-service-environment-custom-settings.md#change-tls-cipher-suite-order)|[Supported with min TLS cipher suite feature](../../app-service/configure-ssl-bindings.md#enforce-tls-versions)|

### Networking

|Feature  |App Service Environment v3  |App Service public multitenant  |
|---------|---------|---------|
|Virtual network integration|Yes, App Service Environment v3 is deployed into a subnet in your virtual network by default |Supported, [must be explicitly enabled](../../app-service/networking-features.md)|
|Private endpoint support|Yes, [must be explicitly enabled on the App Service Environment](networking.md#private-endpoint) |Yes, [must be explicitly enabled](../../app-service/networking-features.md#private-endpoint) |
|IP access restrictions for inbound traffic|Yes, [must be explicitly enabled](../../app-service/networking-features.md#access-restrictions) |Yes, [must be explicitly enabled](../../app-service/networking-features.md#access-restrictions) |
|Network security group (NSG) integration|Supports inbound and outbound traffic control |Can use NSG for inbound traffic control using the subnet that sourced the IP of a private endpoint (Note: requires private endpoints). Supports outbound network restrictions with NSG on the virtual network integration subnet. |
|UDR integration|Supports outbound traffic routing, [must be explicitly enabled](networking.md#network-routing) |Supports outbound traffic routing, [must be explicitly enabled](../../app-service/networking-features.md#) |
|Route outbound traffic over virtual network|Yes, all apps are in the same subnet and all outbound traffic is routed through the virtual network by default |[Supported](../../app-service/overview-vnet-integration.md#routes) |
|[Block inbound traffic to App Service functionality hosted on non-HTTP ports](../../app-service/networking-features.md#app-service-ports)|Supported, NSG can be used to block inbound traffic to non-HTTP ports |Not supported. In some cases (FTP and remote debugging), functionality can be explicitly disabled on a per-application basis. However, inbound network traffic can't be blocked using NSGs since the underlying App Service platform hosting infrastructure owns the listed ports. |
|Pull Docker containers over virtual network|Supported, uses the App Service Environment's subnet|[Supported](../../app-service/overview-vnet-integration.md#container-image-pull)|
|Azure Functions storage account access over virtual network|Supported, uses the App Service Environment's subnet|[Supported](../../app-service/overview-vnet-integration.md#content-share)|
|Backup/restore over a virtual network|Supported, uses the App Service Environment's subnet|[Supported](../../app-service/overview-vnet-integration.md#backuprestore)|
|Maximum outbound TCP/IP connections per virtual machine instance|16,000|1,920 per P1V3 instance. 3,968 per P2V3 instance. 8,064 per P3V3 instance|
|Maximum SNAT ports per virtual machine instance|Dynamic: 256 - 1,024 depending on total instance count|128 per instance|

### Pricing

App Service Environment v3 tends to be more expensive than the public multitenant offering due to the dedicated nature of the infrastructure. For both offerings, you only pay for the resources you use. Reserved instances and savings plans are available for both offerings to save money on long-term commitments.

|Feature  |App Service Environment v3  |App Service public multitenant  |
|---------|---------|---------|
|Pricing     |[Pay per instance](overview.md#pricing)|[Pay per instance](../../app-service/overview-hosting-plans.md)|
|Reserved instances|[Available](overview.md#pricing)|[Available](../../app-service/overview-hosting-plans.md)|
|Savings plans|[Available](overview.md#pricing)|[Available](../../app-service/overview-hosting-plans.md)|
|Availability zone pricing|[There's a minimum charge of 18 cores.](overview.md#pricing) There's no added charge for availability zone support if you have 18 or more cores across your App Service plan instances. If you have fewer than 18 cores across your App Service plans in the zone redundant App Service Environment, the difference between 18 cores and the sum of the cores from the running instance count is charged as Windows I1v2 instances.|[Three instance minimum enforced per App Service plan](../../reliability/reliability-app-service.md#pricing).|

### Frequently asked questions

- [How do I know which offering is right for me?](#how-do-i-know-which-offering-is-right-for-me)
- [Can I use App Service Environment v3 and the public multitenant offering together?](#can-i-use-app-service-environment-v3-and-the-public-multitenant-offering-together)
- [Can I migrate from the public multitenant offering to App Service Environment v3?](#can-i-migrate-from-the-public-multitenant-offering-to-app-service-environment-v3)
- [Can I use App Service Environment v3 for my development and testing environments?](#can-i-use-app-service-environment-v3-for-my-development-and-testing-environments)
- [How do I get started with App Service Environment v3?](#how-do-i-get-started-with-app-service-environment-v3)
- [How do I get started with the App Service public multitenant offering?](#how-do-i-get-started-with-the-app-service-public-multitenant-offering)

#### How do I know which offering is right for me?

Deciding between App Service Environment v3 and the public multitenant offering depends on your specific requirements. There are a few key factors to consider when deciding between the two offerings. The following are some common scenarios to help you decide which offering is right for you.

If you need a fully isolated and dedicated environment for running your apps, then App Service Environment v3 is the right choice for you. If you don't need a fully isolated environment and you're okay with sharing the supporting infrastructure with other customers, then the public multitenant offering is the right choice for you. 

If you need nearly instantaneous scaling times, then the public multitenant offering is the right choice for you. If you need to scale out to more than 30 instances, then App Service Environment v3 is the right choice for you. 

If you need to use client certificates issued by a private CA, then App Service Environment v3 is the right choice for you. If you need to use client certificates issued by a private CA and you're deploying using either Windows containers or Linux containers, then the public multitenant offering is also a possibility.

If you want to simplify your networking configuration and have all your apps in the same subnet, then App Service Environment v3 is the right choice for you. If you want to use virtual network integration, private endpoints, or IP access restrictions, then both offerings are right for you, but you need to enable these features on a per-app basis for the public multitenant offering.

#### Can I use App Service Environment v3 and the public multitenant offering together?

Yes, you can use App Service Environment v3 and the public multitenant offering together. You can use App Service Environment v3 for your most critical apps that require a fully isolated and dedicated environment. You can use the public multitenant offering for your apps that don't require a fully isolated environment.

#### Can I migrate from the public multitenant offering to App Service Environment v3?

Yes, you can migrate from the public multitenant offering to App Service Environment v3 and vice versa. You can use the [backup and restore feature](../../app-service/manage-backup.md) to migrate your apps.

#### Can I use App Service Environment v3 for my development and testing environments?

Yes, you can use App Service Environment v3 for your development and testing environments. However, keep in mind that App Service Environment v3 is more expensive than the public multitenant offering, so you might want to use the public multitenant offering for your development and testing environments to save money.

#### How do I get started with App Service Environment v3?

To get started with App Service Environment v3, see [Azure App Service landing zone accelerator](/azure/cloud-adoption-framework/scenarios/app-platform/app-services/landing-zone-accelerator).

#### How do I get started with the App Service public multitenant offering?

To get started with the App Service public multitenant offering, see [Getting started with Azure App Service](../../app-service/getting-started.md).

## Next steps

> [!div class="nextstepaction"]
> [Getting started with Azure App Service](../../app-service/getting-started.md)

> [Getting started with App Service Environment v3](/azure/cloud-adoption-framework/scenarios/app-platform/app-services/landing-zone-accelerator)
