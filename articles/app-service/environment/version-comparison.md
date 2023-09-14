---
title: 'App Service Environment version comparison'
description: This article provides an overview of the App Service Environment versions and feature differences between them.
author: seligj95
ms.date: 7/24/2023
ms.author: jordanselig
ms.topic: article
---

# App Service Environment version comparison

App Service Environment has three versions. App Service Environment v3 is the latest version and provides advantages and feature differences over earlier versions.

> [!IMPORTANT]
> App Service Environment v1 and v2 [will be retired on 31 August 2024](https://azure.microsoft.com/updates/app-service-environment-version-1-and-version-2-will-be-retired-on-31-august-2024/). After that date, those versions will no longer be supported and any remaining App Service Environment v1 and v2s and the applications running on them will be deleted.

## Comparison between versions

### Deployment

|Feature  |[App Service Environment v1](app-service-app-service-environment-intro.md)  |[App Service Environment v2](intro.md)  |[App Service Environment v3](overview.md)  |
|---------|---------|---------|---------|
|Hardware     |[Cloud Services (classic)](../../cloud-services/cloud-services-choose-me.md)  |[Cloud Services (classic)](../../cloud-services/cloud-services-choose-me.md)  |[Virtual Machine Scale Sets](../../virtual-machine-scale-sets/overview.md)  |
|[Available SKUs](https://azure.microsoft.com/pricing/details/app-service/windows/)  |P1, P2, P3, P4         |I1, I2, I3         |I1v2, I2v2, I3v2, I4v2, I5v2, I6v2        |
|Maximum instance count     |55 hosts (default front-ends + workers)         |100 instances per App Service plan. Maximum of 200 instances across all plans.         |100 instances per App Service plan. Maximum of 200 instances across all plans.         |
|Zone redundancy     |No         |No - [zone pinning](zone-redundancy.md) to one zone is available         |[Yes](../../reliability/migrate-app-service-environment.md)         |
|Dedicated host group     |No         |No         |[Yes](creation.md#deployment-considerations) (not compatible with zone redundancy)         |
|Upgrade preference for planned maintenance    |No         |No         |[Yes](how-to-upgrade-preference.md)         |
|FTPS     |Yes         |Yes         |Yes, [must be explicitly enabled](configure-network-settings.md#ftp-access). Access to FTPS endpoint using custom domain suffix isn't supported.         |
|FTPS endpoint structure     |ftps://APP-NAME.ASE-NAME.appserviceenvironment.net        |ftps://APP-NAME.ASE-NAME.appserviceenvironment.net - Custom domain suffix is supported if you have one configured by replacing the App Service Environment name and the default domain suffix with your custom domain suffix.        |ftps://ASE-NAME.ftp.appserviceenvironment.net/site/wwwroot - Custom domain suffix isn't supported. Each app on the same App Service Environment v3 uses the same FTPS endpoint but has its own unique application scope credentials for authentication.        |
|Remote debugging     |Yes         |Yes         |Yes, [must be explicitly enabled](configure-network-settings.md#remote-debugging-access)         |
|[Azure virtual network (classic)](../../virtual-network/create-virtual-network-classic.md) support    |Yes         |No         |No         |


### Networking

|Feature  |[App Service Environment v1](app-service-app-service-environment-intro.md)  |[App Service Environment v2](intro.md)  |[App Service Environment v3](overview.md)  |
|---------|---------|---------|---------|
|Networking dependencies     |Must [manage all inbound and outbound traffic](app-service-app-service-environment-network-architecture-overview.md). Network security groups must allow management traffic.         |Must [manage all inbound and outbound traffic](network-info.md). Network security groups must allow management traffic. Ensure that [Azure Load Balancer is able to connect to the subnet on port 16001](network-info.md#inbound-dependencies).        |No [networking dependencies](networking.md) on the customer's virtual network. Ensure that [Azure Load Balancer is able to connect to the subnet on port 80](networking.md#ports-and-network-restrictions).         |
|Private endpoint support     |No         |No         |Yes, [must be explicitly enabled](networking.md#private-endpoint)         |
|Reach apps in an internal-VIP App Service Environment across global peering     |No         |No         |Yes         |
|SMTP traffic     |Yes         |Yes         |Yes         |
|Network watcher or NSG flow logs to monitor traffic    |Yes         |Yes         |Yes         |
|Subnet delegation   |Not required         |Not required         |[Must be delegated to `Microsoft.Web/hostingEnvironments`](networking.md#subnet-requirements)       |
|Subnet size|An App Service Environment v1 with no App Service plans uses 12 addresses before you create an app. If you use an ILB App Service Environment v1, then it uses 13 addresses before you create an app. As you scale out, infrastructure roles are added at every multiple of 15 and 20 of your App Service plan instances.  |An App Service Environment v2 with no App Service plans uses 12 addresses before you create an app. If you use an ILB App Service Environment v2, then it uses 13 addresses before you create an app. As you scale out, infrastructure roles are added at every multiple of 15 and 20 of your App Service plan instances.  |Any particular subnet has five addresses reserved for management purposes. In addition to the management addresses, App Service Environment v3 dynamically scales the supporting infrastructure, and uses between 4 and 27 addresses, depending on the configuration and load. You can use the remaining addresses for instances in the App Service plan. The minimal size of your subnet can be a /27 address space (32 addresses).  |
|DNS fallback |Azure DNS |Azure DNS |[Ensure that you have a forwarder to a public DNS or include Azure DNS in the list of custom DNS servers](migrate.md#migration-feature-limitations) |

### Scaling

App Service Environment v3 runs on the latest [Virtual Machine Scale Sets](../../virtual-machine-scale-sets/overview.md) infrastructure while App Service Environment v1 and v2 run on [Cloud Services (classic)](../../cloud-services/cloud-services-choose-me.md). Because of this, App Service Environment v3 has the best performing and fastest scaling times across all versions. 

|Feature  |[App Service Environment v1](app-service-app-service-environment-intro.md)  |[App Service Environment v2](intro.md)  |[App Service Environment v3](overview.md)  |
|---------|---------|---------|---------|
|Front-end scaling management     |[Manual](app-service-web-scale-a-web-app-in-an-app-service-environment.md)         |[Manual](using-an-ase.md#front-end-scaling)         |Managed by platform         |
|Scaling operations     |Blocks other scaling operations         |Blocks other scaling operations         |Doesn't block other scale operations         |

### Certificates and domains

|Feature  |[App Service Environment v1](app-service-app-service-environment-intro.md)  |[App Service Environment v2](intro.md)  |[App Service Environment v3](overview.md)  |
|---------|---------|---------|---------|
|IP-based Transport Layer Security (TLS) or Secure Sockets Layer (SSL) binding with your apps     |Yes         |Yes         |No         |
|Custom domain suffix    |Yes         |Yes (only supported with certain API versions)         |[Yes](how-to-custom-domain-suffix.md)         |
|Support for App Service Managed Certificates   |No         |No         |No        |

### Backup and restore

|Feature  |[App Service Environment v1](app-service-app-service-environment-intro.md)  |[App Service Environment v2](intro.md)  |[App Service Environment v3](overview.md)  |
|---------|---------|---------|---------|
|Perform a backup and restore operation on a storage account behind a firewall    |Yes         |Yes         |No         |

### Logging and monitoring

|Feature  |[App Service Environment v1](app-service-app-service-environment-intro.md)  |[App Service Environment v2](intro.md)  |[App Service Environment v3](overview.md)  |
|---------|---------|---------|---------|
|Application logging to storage account over virtual network    |Yes         |Yes         |No. The recommendation is to use [diagnostics logging](../overview-diagnostics.md) instead. If you need to use a firewall for the logging storage account, the storage account must be in a different region and use the outbound public addresses of the App Service Environment in the rules. For more information, see [networking considerations](../troubleshoot-diagnostic-logs.md#networking-considerations).       |
|Azure Policy integration|Yes |Yes |Yes |
|Azure Advisor integration|Yes |Yes |Yes |

### Pricing

App Service Environment v3 is often cheaper than previous versions due to the removal of the stamp fee and larger instance sizes. For information and example scenarios on how migrating to App Service Environment v3 can affect your costs, see the [migration pricing samples](migrate.md#pricing) and [Estimate your cost savings by migrating to App Service Environment v3](https://azure.github.io/AppService/2023/03/02/App-service-environment-v3-pricing.html).

|Feature  |[App Service Environment v1](app-service-app-service-environment-intro.md)  |[App Service Environment v2](intro.md)  |[App Service Environment v3](overview.md)  |
|---------|---------|---------|---------|
|Pricing     |Pay for each vCPU         |Stamp fee plus cost per Isolated instance, reservations are available for the stamp fee         |No stamp fee and the Isolated v2 rate has 1-3 year reserved instance pricing. Azure Savings Plans for Compute are also available.         |

## Frequently asked questions

- [What SKUs are available on App Service Environment v1, v2, and v3?](#what-skus-are-available-on-app-service-environment-v1-v2-and-v3)
- [What does "no networking dependencies on the customer's virtual network" mean?](#what-does-no-networking-dependencies-on-the-customers-virtual-network-mean)
- [Why is backup and restore to a storage account behind a firewall not supported on App Service Environment v3?](#why-is-backup-and-restore-to-a-storage-account-behind-a-firewall-not-supported-on-app-service-environment-v3)
- [What does custom domain suffix refer to?](#what-does-custom-domain-suffix-refer-to)
- [What regions are the different versions supported in?](#what-regions-are-the-different-versions-supported-in)

#### What SKUs are available on App Service Environment v1, v2, and v3?

App Service Environment v1 uses the Premium SKU and App Service Environment v2 use the Isolated SKU. App Service Environment v3 uses Isolated v2. The following tables list the available instances for each SKU with their respective core counts and RAM. The corresponding instances between Isolated v2 and Isolated have double the cores and RAM. This increase in capacity should be reviewed when migrating to App Service Environment v3 from Isolated or Premium to ensure you aren't over-provisioned.

**App Service Environment v3 (Isolated v2)**:

|Isolated v2|Cores    |RAM (GB) |
|:---------:|:-------:|:-------:|
|I1v2       |2        |8        |
|I2v2       |4        |16       |
|I3v2       |8        |32       |
|I4v2       |16       |64       |
|I5v2       |32       |128      |
|I6v2       |64       |256      |

**App Service Environment v2 (Isolated)**:

|Isolated |Cores    |RAM (GB) |
|:-------:|:-------:|:-------:|
|I1       |1        |3.5      |
|I2       |2        |7        |
|I3       |4        |14       |

**App Service Environment v1 (Premium)**:

|Premium  |Cores    |RAM (GB) |
|:-------:|:-------:|:-------:|
|P1       |1        |1.75     |
|P2       |2        |3.5      |
|P3       |4        |7        |
|P4       |8        |14       |

#### What does "no networking dependencies on the customer's virtual network" mean?

On App Service Environment v3, you don't need to set inbound and outbound rules for the management and dependency traffic. App Service Environment v3 was designed so that management and dependency traffic stays within the Azure backbone instead of your virtual network. The only traffic that traverses your virtual network is the application traffic to and from your apps.

The minimal requirement for App Service Environment v3 to be operational is:

|Source / Destination Port(s)|Direction|Source|Destination|Purpose|
|-|-|-|-|-|
|* / 80|Inbound|AzureLoadBalancer|App Service Environment subnet range|Allow internal health ping traffic|

For more information on App Service Environment v3 networking dependencies, see [ports and network restrictions](networking.md#ports-and-network-restrictions).

On App Service Environment v2, there are many inbound and outbound requirements that have to you have to manage. Modifying these rules can cause the environment to go into an unhealthy state.

- Inbound
    - TCP from the IP service tag AppServiceManagement on ports 454, 455
    - TCP from the load balancer on port 16001
    - From the App Service Environment subnet to the App Service Environment subnet on all ports
- Outbound
    - UDP to all IPs on port 53
    - UDP to all IPs on port 123
    - TCP to all IPs on port 80, 443
    - TCP to the IPs service tag Sql on ports 1433
    - TCP to all IPs on port 12000
    - To the App Service Environment subnet on all ports 

For more information on App Service Environment v2 networking dependencies, see [inbound and outbound dependencies](network-info.md#inbound-and-outbound-dependencies).

#### Why is backup and restore to a storage account behind a firewall not supported on App Service Environment v3?

This limitation is a result of the underlying infrastructure change that was implemented for App Service Environment v3. Since backup and restore are management operations, and all management traffic is isolated outside of the customer's virtual network, these operations need to take place through the Azure backbone network. Therefore the customer can't explicitly allow this traffic through the firewall on their storage account.

#### What does custom domain suffix refer to?

The custom domain suffix is for the App Service Environment. It's available on App Service Environment v1 and v3, but was removed from App Service Environment v2. 

It's different from a custom domain binding on App Service. The custom domain suffix defines a root domain that can be used by the App Service Environment. In the public variation of Azure App Service, the default root domain for all web apps is azurewebsites.net. For ILB App Service Environments, the default root domain is appserviceenvironment.net. However, since an ILB App Service Environment is internal to a customer's virtual network, customers can use a root domain in addition to the default one that makes sense for use within a company's internal virtual network. For example, a hypothetical Contoso Corporation might use a default root domain of internal-contoso.com for apps that are intended to only be resolvable and accessible within Contoso's virtual network. An app in this virtual network could be reached by accessing APP-NAME.internal-contoso.com.

For more information on custom domain suffix, see [Custom domain suffix for App Service Environments](how-to-custom-domain-suffix.md).

#### What regions are the different versions supported in?

Due to hardware changes between the versions, there are some regions where App Service Environment v1/v2 may be supported, but not App Service Environment v3. The [supported regions list](overview.md#regions) is continuously updated with the latest availabilities.

## Next steps

> [!div class="nextstepaction"]
> [Migrate your App Service Environment to App Service Environment v3](how-to-migrate.md)

> [!div class="nextstepaction"]
> [Manually migrate to App Service Environment v3](migration-alternatives.md)

> [!div class="nextstepaction"]
> [App Service Environment v3 Networking](networking.md)

> [!div class="nextstepaction"]
> [Using an App Service Environment v3](using.md)


