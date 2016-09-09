<properties 
   pageTitle="Traffic Manager Endpoint Types | Microsoft Azure"
   description="This article explains different types of endpoints that can be used with Azure Traffic Manager"
   services="traffic-manager"
   documentationCenter=""
   authors="jtuliani"
   manager="carmonm"
   editor="tysonn" />
<tags 
   ms.service="traffic-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="06/08/2016"
   ms.author="jtuliani" />

# Traffic Manager endpoints

Microsoft Azure Traffic Manager allows you to control how user traffic is  distributed to your application deployments running in different datacenters or other locations around the world.

Each application deployment needs to be configured as an ‘endpoint’ in Traffic Manager.  When Traffic Manager receives a DNS request, it will choose one of these endpoints to return in the DNS response, based on the current endpoint availability and the chosen traffic-routing method.  For more information, see [How Traffic Manager Works](traffic-manager-how-traffic-manager-works.md).

This page describes how Traffic Manager supports endpoints of different types.

## Types of Traffic Manager endpoint

There are three types of endpoint supported by Traffic Manager:

- **Azure endpoints** are used for services hosted in Azure.  
- **External endpoints** are used for services hosted outside Azure, either on-premises or with a different hosting provider.
- **Nested endpoints** are used to combine Traffic Manager profiles to create more flexible traffic-routing schemes to support the needs of larger, more complex deployments.

There is no restriction on how endpoints of different types are combined in a single Traffic Manager profile.  Each profile can contain any mix of endpoint types.

The following sections describe each endpoint type in greater depth.

### Azure endpoints

Azure endpoints are used to configure Azure-based services in Traffic Manager.  Azure endpoints currently support the following Azure resource types:

- ‘Classic’ IaaS VMs and PaaS cloud services.
- Web Apps
- PublicIPAddress resources (which can be connected to VMs either directly or via an Azure Load Balancer)

PublicIPAddress resources are Azure Resource Manager resources, they do not exist in the Azure Service Management APIs.  Thus they are only supported in Traffic Manager’s Azure Resource Manager experiences.  The other endpoint types are supported via both Resource Manager and Service Management experiences in Traffic Manager.

When using Azure endpoints, Traffic Manager will detect when a ‘Classic’ IaaS VM or PaaS cloud service or a Web App is stopped and started.  This is reflected in the endpoint status (see [Traffic Manager endpoint monitoring](traffic-manager-monitoring.md#endpoint-and-profile-status) for details.)  When the underlying service is stopped, Traffic Manager will no longer bill for endpoint health checks and will not direct traffic to the endpoint; billing resumes and the endpoint becomes eligible to receive traffic when the service is restarted.  This does not apply to PublicIpAddress endpoints.

### External endpoints

External endpoints are used to configure Traffic Manager to direct traffic to services outside Azure, for example a service hosted on-premises or a service hosted with a different provider.

External endpoints can be used on their own, or combined with Azure Endpoints in the same Traffic Manager profile.  Combining Azure endpoints with External endpoints enables a variety of scenarios:

- Using Azure to provide increased redundancy for an existing on-premises application, in either an active-active or active-passive failover model.
- Using Azure to extend an existing on-premises application to additional geographic locations, together with [Traffic Manager ‘Performance’ traffic routing](traffic-manager-routing-methods.md#performance-traffic-routing-method), to reduce application latency and improve performance for end users.
- Using Azure to provide additional capacity for an existing on-premises application, either continuously or as a ‘burst-to-cloud’ to handle a spike in demand.

In certain cases, it can be useful to use External endpoints to reference Azure services (for examples, see the [FAQ](#faq)).  In this case, billing for health checks is at the Azure endpoints rate, not the External endpoints rate.  However, unlike Azure endpoints, if you stop or delete the underlying service you will continue to be billed for the corresponding health checks until you disable or delete the endpoint in Traffic Manager explicitly.

### Nested endpoints

Nested endpoints are used to combine Traffic Manager profiles to create more flexible traffic-routing schemes to support the needs of larger, more complex deployments.

With Nested endpoints, a ‘child’ profile is added as an endpoint to a ‘parent’ profile, to create a hierarchy.  The both child and parent profiles can contain other endpoints of any type, including other nested profiles.

For further details, see [nested Traffic Manager profiles](traffic-manager-nested-profiles.md).

## Web Apps as endpoints

Some additional considerations apply when configuring Web Apps as endpoints in Traffic Manager:

1. Only Web Apps at the ‘Standard’ SKU or above are eligible for use with Traffic Manager.  Calls to Traffic Manager to add a Web App of a lower SKU will fail.  Downgrading the SKU of an existing Web App will result in Traffic Manager no longer sending traffic to that Web App, and the endpoint may be removed from Traffic Manager.

2. When an HTTP request is received by the Web Apps service, it uses the ‘host’ header in the request to determine which Web App should service the request.  The host header contains the DNS name used to initiate the request, for example ‘contosoapp.azurewebsites.net’.  To use a different DNS name with your Web App, the DNS name must be registered as a custom domain for the App.  When adding a Web App endpoint to a Traffic Manager profile as an Azure endpoint, the Traffic Manager profile DNS name is automatically registered as a custom domain for the App.  This registration is automatically removed when the endpoint is deleted.

3. Typically, a Web App will be configured as an Azure endpoint.  However there are circumstances where it is useful to configure a Web App using an External endpoint (for an example, see the next item).   Web Apps can only be configured as an External endpoint in Traffic Manager when using the Resource Manager Traffic Manager experiences, this is not supported via the Service Management experiences.

4. Each Traffic Manager profile can have at most one Web App endpoint from each Azure region.  A workaround for this constraint is given in the [FAQ](#faq).

## Enabling and disabling endpoints

Disabling an endpoint in Traffic Manager is very useful for temporarily removing traffic from an endpoint that is in maintenance mode or being redeployed. Once the endpoint is up and running again, it can be re-enabled.

Endpoints can be enabled and disabled via the Traffic Manager portal, PowerShell, CLI or REST API, all of which are supported in both Resource Manager and Service Management experiences.

>[AZURE.NOTE] Disabling an Azure endpoint has nothing to do with its deployment state in Azure. An Azure service (such as a VM or Web App) will remain running and able to receive traffic even when disabled in Traffic Manager, if traffic is addressed directly to that service rather than via the Traffic Manager profile DNS name.  For more information, see [how Traffic Manager works](traffic-manager-how-traffic-manager-works.md).

When an endpoint is disabled, it is no longer returned in DNS responses and hence no traffic is directed to the endpoint.  In addition, health checks to the endpoint are stopped and are no longer billed. Disabling an endpoint is equivalent to deleting an endpoint, except that it is easier to re-enable again.

The current eligibility of each endpoint to receive traffic depends on the profile status (enabled/disabled), the endpoint status (enabled/disabled), and the results of the health checks for that endpoint. For details, see [Traffic Manager endpoint monitoring](traffic-manager-monitoring.md#endpoint-and-profile-status).

>[AZURE.NOTE] Since Traffic Manager works at the DNS level, it is unable to influence existing connections to any endpoint. When directing traffic between endpoints (either by changing profile settings, or during failover or failback), Traffic Manager will direct new connections to available endpoints. However, other endpoints may continue to receive traffic via existing connections until those sessions are terminated. To enable traffic to drain from existing connections, applications should limit the session duration used with each endpoint.

If all endpoints in a profile are disabled, or if the profile itself is disabled, then DNS queries are met with an ‘NXDOMAIN’ response.  This is the same as if the profile had been deleted.

## FAQ

### Can I use Traffic Manager with endpoints from multiple subscriptions?
For Azure Web Apps, this is not possible.  This is because Web Apps require that any custom domain name used with Web Apps is only used within a single subscriptions.   It is not possible to use Web Apps from multiple subscriptions with the same domain name, and hence they cannot be used with Traffic Manager.

For other endpoint types, it is possible to use Traffic Manager with endpoints from more than one subscription.  How you do this depends on whether you are using the Service Management APIs or the Resource Manager APIs for Traffic Manager.  The [Azure portal](https://portal.azure.com) uses Resource Manager, the ['classic' portal](https://manage.windowsazure.com) uses Service Management.

In Resource Manager, endpoints from any subscription can be added to Traffic Manager, so long as the person configuring the Traffic Manager profile has read access to the endpoint.  These permissions can be granted using [Azure Resource Manager role-based access control (RBAC)](../active-directory/role-based-access-control-configure.md).

In Service Management, the Traffic Manager requires that any Cloud Service or Web App configured as an Azure endpoint resides in the same subscription as the Traffic Manager profile.  Cloud Service endpoints in other subscriptions can be added to Traffic Manager as ‘external’ endpoints (they will still be billed at the ‘Internal’ endpoint rate).

### Can I use Traffic Manager with Cloud Service ‘Staging’ slots?
Yes.  Cloud Service ‘staging’ slots can be configured in Traffic Manager as External endpoints.

Because the service referenced by the endpoint resides in Azure, health checks will still be charged at the rate used for Azure Endpoints.

Because the External endpoint type is in use, changes to the underlying service are not picked up automatically.  Therefore, if the Cloud Service is stopped or deleted the Traffic Manager endpoint will continue to be billed for health checks until the endpoint is disabled or deleted within Traffic Manager.

### Does Traffic Manager support IPv6 endpoints?

Yes.  Whilst Traffic Manager does not currently provide IPv6-addressible name servers, it can still be used by IPv6 clients connecting to IPv6 endpoints.

An IPv6-only client can still use Traffic Manager, since the client does not make DNS requests directly to Traffic Manager, rather it uses a recursive DNS service.  It can make requests to this service via IPv6, and the recursive service should then be able to contact the Traffic Manager name servers using IPv4.

Once it receives a DNS query, Traffic Manager will respond with the DNS name of the endpoint which the client should connect to.  An IPv6 endpoint can be supported by simply configuring a DNS AAAA record pointing the endpoint DNS name to the IPv6 address.

Note that for the Traffic Manager health checks to function correctly, the service will also need to expose an IPv4 endpoint.  This needs to be mapped from the same endpoint DNS name, using a DNS A record.

### Can I use Traffic Manager with more than one Web App in the same region?

Typically, Traffic Manager is used to direct traffic to applications deployed in different regions.  However, it can also be used where an application has more than one deployment in the same region.

In the case of Web Apps, the Traffic Manager Azure endpoints do not permit more than one Web App endpoint from the same Azure region to be added to the same Traffic Manager profile.  The following steps provide a workaround to this constraint:

1.	Check that your Web Apps within the same region are in different web app 'scale units', i.e. different instances of the Web App service.  To do this, check the DNS path for the <...>.azurewebsites.net DNS entry, the scale unit will look something like ‘waws-prod-xyz-123.vip.azurewebsites.net’.  A given domain name must map to a single site in a given scale unit, and for this reason two Web Apps in the same scale unit cannot share a Traffic Manager profile. 
2.	Assuming each Web App is in a different scale unit, add your vanity domain name as a custom hostname to each Web App.  This requires all Web Apps to belong to the same subscription.
3.	Add one (and only one) Web App endpoint as you normally would to your Traffic Manager profile, as an Azure endpoint.
4.	Add each additional Web App endpoint to your Traffic Manager profile as an External endpoint.  This requires you to use the Resource Manager experience for Traffic Manager, not the Service Management experience.
5.	Create a DNS CNAME record from your vanity domain (as used in step 2 above) to your Traffic Manager profile DNS name (<…>.trafficmanager.net).
6.	Access your site via the vanity domain name, not the Traffic Manager profile DNS name.

## Next steps

- Learn [how Traffic Manager works](traffic-manager-how-traffic-manager-works.md).

- Learn about Traffic Manager [endpoint monitoring and automatic failover](traffic-manager-monitoring.md).

- Learn about Traffic Manager [traffic routing methods](traffic-manager-routing-methods.md).


