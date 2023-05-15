---
title: Traffic Manager Endpoint Types
description: Learn about the different types of endpoints that can be used with Azure Traffic Manager.
services: traffic-manager
author: greg-lindsay
ms.service: traffic-manager
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 04/27/2023
ms.author: greglin
ms.custom: template-concept, engagement-fy23
---

# Traffic Manager endpoints

Azure Traffic Manager allows you to control how network traffic is distributed to application deployments running in different datacenters. You configure each application deployment as an 'endpoint' in Traffic Manager. When Traffic Manager receives a DNS request, it chooses an available endpoint to return in the DNS response. Traffic manager bases the choice on the current endpoint status and the traffic-routing method. For more information, see [How Traffic Manager works](traffic-manager-how-it-works.md).

There are three types of endpoint supported by Traffic Manager:

* [**Azure endpoints**](#azure-endpoints) are used for services hosted in Azure.
* [**External endpoints**](#external-endpoints) are used for IPv4/IPv6 addresses, FQDNs, or for services hosted outside Azure. Theses services can either be on-premises or with a different hosting provider.
* [**Nested endpoints**](#nested-endpoints) are used to combine Traffic Manager profiles to create more flexible traffic-routing schemes to support the needs of larger, more complex deployments.

There's no restriction on how endpoints of different types are combined in a single Traffic Manager profile. Each profile can contain any mix of endpoint types.

The following sections describe each endpoint type in greater depth.

## Azure endpoints

Azure endpoints are used for Azure-based services in Traffic Manager. The following Azure resource types are supported:

* PaaS cloud services.
* Web Apps
* Web App Slots
* PublicIPAddress resources (which can be connected to VMs either directly or via an Azure Load Balancer). The publicIpAddress must have a DNS name assigned to be used in a Traffic Manager profile.

PublicIPAddress resources are Azure Resource Manager resources. They don't exist in the classic deployment model and are only supported in Traffic Manager's Azure Resource Manager experiences. The other endpoint types are supported via both Resource Manager and the classic deployment model.

When using Azure endpoints, Traffic Manager detects when a Web App is stopped and started. This status is reflected in the endpoint status. See [Traffic Manager endpoint monitoring](traffic-manager-monitoring.md#endpoint-and-profile-status) for details. When the underlying service is stopped, Traffic Manager doesn't do endpoint health checks or direct traffic to the endpoint. No Traffic Manager billing events occur for the stopped instance. When the service is restarted, billing resumes and the endpoint is eligible to receive traffic. This detection doesn't apply to PublicIpAddress endpoints.

## External endpoints

External endpoints are used for either IPv4/IPv6 addresses, FQDNs, or for services outside of Azure. Use of IPv4/IPv6 address endpoints allows Traffic Manager to check the health of endpoints without requiring a DNS name for them. As a result, Traffic Manager can respond to queries with A/AAAA records when returning that endpoint in a response. Services outside of Azure can include a service hosted on-premises or with a different provider. External endpoints can be used individually or combined with Azure Endpoints in the same Traffic Manager profile. The exception is for endpoints that are specified as IPv4 or IPv6 addresses, which can only be external endpoints. Combining Azure endpoints with External endpoints enables various scenarios:

* Provide increased redundancy for an existing on-premises application in either an active-active or active-passive failover model using Azure. 
* Route traffic to endpoints that don't have a DNS name associated with them. Also reduces the overall DNS lookup latency by removing the need to run a second DNS query to get an IP address of a DNS name returned.
* Reduce application latency for users around the world, extend an existing on-premises application to other geographic locations in Azure. For more information, see [Performance traffic routing](traffic-manager-routing-methods.md#performance).
* Provide more capacity for an existing on-premises application, either continuously or as a 'burst-to-cloud' solution to meet a spike in demand using Azure.

In some cases, it's useful to use External endpoints to reference Azure services. See the [FAQ](traffic-manager-faqs.md#traffic-manager-endpoints) for examples. Health checks are billed at the Azure endpoints rate, not the External endpoints rate. Unlike Azure endpoints, if you stop or delete the underlying service, the health check billing continues. The billing stops once you disable or delete the endpoint in Traffic Manager.

## Nested endpoints

Nested endpoints combine multiple Traffic Manager profiles to create flexible traffic-routing schemes to support the needs of larger and complex deployments. With Nested endpoints, a ***child*** profile is added as an endpoint to a ***parent*** profile. Both the child and parent profiles can contain other endpoints of any type, including other nested profiles. 

For more information, see [Nested Traffic Manager profiles](traffic-manager-nested-profiles.md).

## Web Apps as endpoints

Some more considerations apply when configuring Web Apps as endpoints in Traffic Manager:

1. Only Web Apps at the Standard SKU or higher are eligible for use with Traffic Manager. Attempts to add a Web App of a lower SKU fail. Downgrading the SKU of an existing Web App results in Traffic Manager no longer sending traffic to that Web App. For more information on supported plans, see the [App Service Plans](https://azure.microsoft.com/pricing/details/app-service/plans/).
2. When an endpoint receives an HTTP request, it uses the *host* header in the request to determine which Web App should service the request. The host header contains the DNS name used to start the request, for example `contosoapp.azurewebsites.net`. To use a different DNS name with your Web App, the DNS name must be registered as a custom domain name for the App. When adding a Web App endpoint as an Azure endpoint, the Traffic Manager profile DNS name is automatically registered for the App. This registration is automatically removed when the endpoint is deleted.
3. Each Traffic Manager profile can have at most one Web App endpoint from each Azure region. To work around for this constraint, you can configure a Web App as an External endpoint. For more information, see the [FAQ](traffic-manager-faqs.md#traffic-manager-endpoints).

## Enabling and disabling endpoints

Disabling an endpoint in Traffic Manager can be useful to temporarily remove traffic from an endpoint that is in maintenance mode or being redeployed. Once the endpoint is running again, it can be re-enabled.

You can enable or disable Traffic Manager endpoints using the Azure portal, PowerShell, CLI, or REST API.

> [!NOTE]
> Disabling an Azure endpoint has nothing to do with its deployment state in Azure. An Azure service (such as a VM or Web App) remains running and able to receive traffic even when disabled in Traffic Manager. Traffic can be addressed directly to the service instance rather than via the Traffic Manager profile DNS name. For more information, see [How Traffic Manager works](traffic-manager-how-it-works.md).

The current eligibility of each endpoint to receive traffic depends on the following factors:

* The profile status (enabled/disabled)
* The endpoint status (enabled/disabled)
* The results of the health checks for that endpoint

For details, see [Traffic Manager endpoint monitoring](traffic-manager-monitoring.md#endpoint-and-profile-status).

> [!NOTE]
> Since Traffic Manager works at the DNS level, it is unable to influence existing connections to any endpoint. When an endpoint is unavailable, Traffic Manager directs new connections to another available endpoint. However, the host behind the disabled or unhealthy endpoint may continue to receive traffic via existing connections until those sessions are terminated. Applications should limit the session duration to allow traffic to drain from existing connections.

If all endpoints in a profile get disabled, or if the profile itself get disabled, then Traffic Manager sends an `NXDOMAIN` response to a new DNS query.

## FAQ

* [Can I use Traffic Manager with endpoints from multiple subscriptions?](./traffic-manager-faqs.md#can-i-use-traffic-manager-with-endpoints-from-multiple-subscriptions)

* [Can I use Traffic Manager with Cloud Service 'Staging' slots?](./traffic-manager-faqs.md#can-i-use-traffic-manager-with-cloud-service-staging-slots)

* [Does Traffic Manager support IPv6 endpoints?](./traffic-manager-faqs.md#does-traffic-manager-support-ipv6-endpoints)

* [Can I use Traffic Manager with more than one Web App in the same region?](./traffic-manager-faqs.md#can-i-use-traffic-manager-with-more-than-one-web-app-in-the-same-region)

* [How do I move my Traffic Manager profile’s Azure endpoints to a different resource group?](./traffic-manager-faqs.md#how-do-i-move-my-traffic-manager-profiles-azure-endpoints-to-a-different-resource-group-or-subscription)

## Next steps

* Learn [how Traffic Manager works](traffic-manager-how-it-works.md).
* Learn about Traffic Manager [endpoint monitoring and automatic failover](traffic-manager-monitoring.md).
* Learn about Traffic Manager [traffic routing methods](traffic-manager-routing-methods.md).