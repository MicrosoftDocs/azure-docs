<properties 
   pageTitle="Traffic Manager endpoint monitoring and failover | Microsoft Azure"
   description="This article will help you understand how Traffic Manager uses endpoint monitoring and automatic endpoint failover to enable Azure customers to deploy high-availability applications"
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
   ms.date="06/04/2016"
   ms.author="jtuliani" />

# Traffic Manager endpoint monitoring and failover

Azure Traffic Manager includes built-in endpoint monitoring and automatic endpoint failover.  This enables you to deliver high availability applications that are resilient to endpoint failure, including Azure region failures.

It does this by making regular requests to each endpoint and verifying the response.  If an endpoint fails to provide a valid response, it is marked as ‘Degraded’ and is no longer included in DNS responses which instead return an alternative, available endpoint.  End user traffic is thus directed away from failing endpoints and towards those which are available.

Endpoint health checks continue for ‘Degraded’ endpoints so they can be brought back into rotation automatically once they return to health.

## Configuring endpoint monitoring

To configure endpoint monitoring, you must specify the following settings on your Traffic Manager profile:

- **Protocol** – Choose HTTP or HTTPS. It’s important to note that HTTPS monitoring does not verify whether your SSL certificate is valid, it only checks that certificate is present.
- **Port** – Choose the port used for the request. Standard HTTP and HTTPS ports are among the choices.
- **Path** – Give the relative path and the name of the web page or file that the monitoring health check will attempt to access. Note that a forward slash "/" is a valid entry for the relative path and implies that the file is in the root directory (default).

To check the health of each endpoint, Traffic Manager will make a GET request to the endpoint using the protocol, port and relative path given.

A common practice is to implement a custom page within your application, e.g. ‘/health.aspx’, and to configure this page as the Traffic Manager endpoint monitoring path.  Within that page, you can perform any necessary application-specific checks, such as checking the availability of a back-end database, before returning either HTTP 200 (if the service is healthy) or a different status code otherwise.

Endpoint monitoring settings are configured at the Traffic Manager profile level, not per endpoint.  Therefore, the same settings are used to check the health of all endpoints.  If you need to use different monitoring settings for different endpoints, this can be achieved using [nested Traffic Manager profiles](traffic-manager-nested-profiles.md#example-5-per-endpoint-monitoring-settings).

## Endpoint and profile status

Traffic Manager profiles and endpoints can be enabled and disabled by the user.  Changes to status can also happen as a result of  endpoint health checks.  The following parameters describe the behavior in detail.

### Endpoint status

Endpoint Status is a user-controlled setting, allowing an individual endpoint to be easily enabled or disabled.  This does not affect the status of the underlying service (which may still be running), rather, it controls the availability of this endpoint from a Traffic Manager perspective.  When an endpoint is disabled, it is not checked for health and will not be returned in a DNS response.

### Profile status

Profile Status is a user-controlled setting, allowing the profile to be easily enabled or disabled.  Whilst the Endpoint Status affects a single endpoint, the Profile Status affects the entire profile, including all endpoints. When disabled, endpoints are not checked for health and no endpoints are returned in DNS response (DNS queries receive 'NXDOMAIN' responses instead).

### Endpoint monitor status

Endpoint Monitor Status is a Traffic Manager-generated setting, it cannot be set by the user.  It shows the current status of endpoint, reflecting the ongoing endpoint monitoring and also other information such as the Endpoint Status.  The possible values of the Endpoint Monitor Status are shown in the following table.  (For details of how the Endpoint Monitor Status is calculated for nested endpoints, see [nested Traffic Manager profiles](traffic-manager-nested-profiles.md).)

|Profile status|Endpoint status|Endpoint Monitor status (API and Portal)|Notes|
|---|---|---|---|
|Disabled|Enabled|Inactive|The profile has been disabled by the user.  Whilst the Endpoint Status can still be 'Enabled', the Profile Status takes precedence.  Endpoints in Disabled profiles are not monitored. No endpoint is returned in DNS responses (an 'NXDOMAIN' response is given instead).|
|&lt;any&gt;|Disabled|Disabled|The endpoint has been disabled by the user.  Disabled endpoints are not monitored. They are not available for inclusion in DNS responses, and hence do not receive traffic.|
|Enabled|Enabled|Online|Endpoint is monitored and is healthy.  It is available for inclusion in DNS responses and hence can receive traffic.|
|Enabled|Enabled|Degraded|Endpoint monitoring health checks are failing.  The endpoint is not available for inclusion in DNS responses, and hence does not receive traffic.|
|Enabled|Enabled|CheckingEndpoint|Endpoint is monitored but the results of the first probe have not yet been received. This is a temporary state when you’ve just added a new endpoint to the profile, or have just enabled an endpoint or profile.  Endpoints in this state are available for inclusion in DNS responses, and hence can receive traffic.|
|Enabled|Enabled|Stopped|The Cloud Service or Web App which the endpoint points to is not running.  Check the Cloud Service or Web App settings. Stopped endpoints are not monitored. They are not available for inclusion in DNS responses, and hence do not receive traffic.|

### Profile Monitor Status

Profile Monitor Status is a combination of the endpoint monitor status for all endpoints in the profile, and your configured profile status.  The possible values are described in the following table:

|Profile status (as configured)|Endpoint Monitor status|Profile Monitor status (API and Portal)|Notes|
|---|---|---|---|
|Disabled|&lt;any&gt; or a profile with no defined endpoints.|Disabled|The profile has been disabled by the user.|
|Enabled|The status of at least one endpoint is “Degraded”.|Degraded|This is a flag that customer action is required.  Review the individual endpoint status values to determine which endpoints require further attention.|
|Enabled|The status of at least one endpoint is “Online”. No endpoints are “Degraded”.|Online|The service is accepting traffic and customer action is not required.|
|Enabled|The status of at least one endpoint is “CheckingEndpoint”. No endpoints are “Online” or “Degraded”.|CheckingEndpoints|Transition state. This typically occurs when a profile has just been created or enabled and the endpoint health is being checked for the first time.|
|Enabled|The status of all endpoints defined in the profile is either “Disabled” or “Stopped”, or the profile has no defined endpoints.|Inactive|No endpoints are active, but the profile is still enabled.|

## Endpoint failover and fail-back

Consider the scenario in which a Traffic Manager endpoint that was previously healthy fails, this failure is detected by Traffic Manager and the endpoint taken out of rotation.  Later, the endpoint recovers, this is also detected by Traffic Manager and the endpoint brought back into rotation.

>[AZURE.NOTE] Traffic Manager only considers an endpoint to be Online if the return message is a 200 OK. If any of the following occur, it will count this as a failed check:

>- A non-200 response is received (including a different 2xx code, or a 301/302 redirect)
>- Request for client authentication
>- Timeout (the timeout threshold is 10 seconds)
>- Unable to connect

>More details about troubleshooting failed checks see [Troubleshooting degraded status on Azure Traffic Manager](traffic-manager-troubleshooting-degraded.md).

The following timeline describes in detail the sequence of steps that occurs.

![Traffic Manager endpoint failover and failback sequence](./media/traffic-manager-monitoring/timeline.png)

1. **GET** – The Traffic Manager monitoring system performs a GET on the path and file you specified in the monitoring settings.  This is repeated for each endpoint.
2. **200 OK** – The monitoring system expects an HTTP 200 OK message to be returned within 10 seconds. When it receives this response, it understands that the service is available.
3. **30 seconds between checks** – The endpoint health check will be repeated every 30 seconds.
4. **Service unavailable** – The service becomes unavailable. Traffic Manager will not know until the next health check.
5. **Attempts to access monitoring file (4 tries)** – The monitoring system performs a GET, but does not receive a response within the timeout period of 10 seconds (alternatively, a non-200 response may be received). It then performs three more tries at 30 second intervals. If one of the tries is successful, then the number of tries is reset.
6. **Marked degraded** – After the fourth failure in a row, the monitoring system will mark the unavailable endpoint as Degraded. 
7. **Traffic is diverted to other endpoints** – The Traffic Manager DNS name servers are updated and the endpoint will no longer be returned by Traffic Manager in response to DNS queries.  New connections will therefore be directed to other, available endpoints.  However, previous DNS responses that include this endpoint may still be cached by recursive DNS servers and DNS clients, causing some clients to try to connect to this endpoint. As these caches expire, clients will make new DNS queries and be directed to different endpoints. The cache duration is controlled by the TTL setting in the Traffic Manager profile, for example 30 seconds. 
8. **Health checks continue** - Traffic Manager continues to check the health of the endpoint whilst it is in the Degraded state.  This is so that it can detect when the endpoint returns to health.
9. **Service comes back online** – The service becomes available.  The endpoint remains Degraded in Traffic Manager until the monitoring system performs its next health check.
10. **Traffic to service resumes** - Traffic Manager sends a GET and receives a 200 OK, indicating that the service has returned to a healthy state.  The Traffic Manager name servers are updated once again, and begin to hand out the service’s DNS name in DNS responses. Traffic will return to the endpoint once again as cached DNS responses returning other endpoints expire, and as existing connections to other endpoints are terminated.

>[AZURE.NOTE] Since Traffic Manager works at the DNS level, it is unable to influence existing connections to any endpoint.  When directing traffic between endpoints (either by changing profile settings, or during failover or failback), Traffic Manager will direct new connections to available endpoints.  However, other endpoints may continue to receive traffic via existing connections until those sessions are terminated.  To enable traffic to drain from existing connections, applications should limit the session duration used with each endpoint.

## Degraded endpoints

When an endpoint is degraded, it is no longer returned in response to DNS queries (for an exception to this rule, see the Note below).  Instead an alternative endpoint is chosen and returned.  The choice of alternative endpoint depends on the configured traffic-routing method:

- **Priority** – Endpoints form a prioritized list.  The first available endpoint on the list is always returned.  If it becomes Degraded, then the next available endpoint is returned.
- **Weighted** – Any of the available endpoints may be returned, chosen at random based on their assigned weights and the weights of the other available endpoints.  If an endpoint becomes degraded, an endpoint is chosen from the remaining pool of available endpoints.
- **Performance** – The endpoint ‘closest’ to the end user is returned (excluding disabled/stopped endpoints).  If that endpoint is unavailable, the endpoint returned is chosen at random from all the other available endpoints.  (This is to help avoid a cascading failure that could potentially occur if the next-closest endpoint becomes overloaded.  Alternative failover plans for Performance traffic-routing can be configured using [nested Traffic Manager profiles](traffic-manager-nested-profiles.md#example-4-controlling-performance-traffic-routing-between-multiple-endpoints-in-the-same-region).)

For more information see [Traffic Manager traffic-routing methods](traffic-manager-routing-methods.md).

>[AZURE.NOTE] What happens if all Traffic Manager endpoints (excluding ‘Disabled’ or ‘Stopped’ endpoints) are failing their health checks, and marked as ‘Degraded’?

>This most commonly occurs due to an error in the configuration of the service (such as an ACL blocking the Traffic Manager health checks), or an error in configuration of the Traffic Manager profile (such as an incorrect monitoring path).

>In this case, Traffic Manager makes a ‘best effort’ and *responds as if all the degraded endpoints are actually ‘Online’*.  This is preferable to the alternative, which would be not to return any endpoint in the DNS response.

>A consequence of this behavior is that when the Traffic Manager health checks are not configured correctly, it may seem from the traffic routing as though Traffic Manager is working properly.  However, endpoint failover will not happen if an endpoint fails, impacting overall application availability.  To ensure this does not occur, it is important to ensure that the profile shows an 'Online' rather than 'Degraded' state.  An 'Online' state shows that the Traffic Manager health checks are working as expected.

For more details about troubleshooting failed health checks see [Troubleshooting degraded status on Azure Traffic Manager](traffic-manager-troubleshooting-degraded.md)
 
## FAQ

### Is Traffic Manager itself resilient to Azure region failures?

By providing built-in health checks and automatic failover between regions, Azure Traffic Manager is a key component for delivering highly available applications in Azure, including applications which are resilient to a region-wide Azure outage.

As such, we recognise that Traffic Manager itself must offer an exceptionally high level of availability, including resilience to regional failure.

Whilst some parts of Traffic Manager run in Azure, these are distributed across regions and have been designed to be resilient to a complete failure of any Azure region.  This resilience applies to all Traffic Manager components: the DNS name servers, the API, the storage layer, and the endpoint monitoring service.

Therefore, even in the unlikely event of a total outage of an entire Azure region, Traffic Manager should continue to function as normal and customers with applications deployed in multiple Azure regions can rely on Traffic Manager to direct traffic to an available instance of their application.

### How does the choice of Resource Group location affect Traffic Manager?

Traffic Manager is a single global service.  It is not regional.  The choice of resource group location makes no difference to Traffic Manager profiles deployed in that resource group.

Azure Resource Manager requires that all resource groups specify a ‘location’, which determines the default location for resources deployed in that resource group.  You will be asked for this location if you create a new resource group when creating a Traffic Manager profile via the Azure Portal.

All Traffic Manager profiles use “global” as their location.  Since this is the only value accepted, it is not exposed in the Azure Portal, PowerShell or CLI experiences.  This overrides the resource group default.

### How do I determine the current health of each endpoint?

The current monitoring status of each endpoint, and the overall profile, is displayed in the Azure management portal.  This information is also available via the Traffic Manager [REST API](https://msdn.microsoft.com/library/azure/mt163667.aspx), [PowerShell cmdlets](https://msdn.microsoft.com/library/mt125941.aspx), and [cross-platform Azure CLI](../xplat-cli-install.md).

At present, it is not possible to view historical information about past endpoint health, nor is it possible to configure alerts on changes to endpoint health.

### Can I monitor HTTPS endpoints?

Yes.  Traffic Manager supports probing over HTTPS.  Simply configure ‘HTTPS’ as the protocol in the monitoring configuration.
Note that:

- The server-side certificate is not validated
- SNI server-side certificates are not supported
- Client certificates are not supported

### What ‘Host’ header is used for endpoint health checks?

The ‘host’ header used in HTTP/S health checks is the DNS name associated with each endpoint. This is exposed as the endpoint ‘target’ in the Azure Portal, [PowerShell cmdlets](https://msdn.microsoft.com/library/mt125941.aspx), [cross-platform Azure CLI](../xplat-cli-install.md), and [REST API](https://msdn.microsoft.com/library/azure/mt163667.aspx).

This value is part of the endpoint configuration.  The value used in the Host header cannot be specified separately from the ‘target’ property.


## Next steps

Learn [how Traffic Manager works](traffic-manager-how-traffic-manager-works.md).

Learn more about the [traffic-routing methods](traffic-manager-routing-methods.md) supported by Traffic Manager.

Learn how to [create a Traffic Manager profile](traffic-manager-manage-profiles.md).

[Troubleshoot 'Degraded' status](traffic-manager-troubleshooting-degraded.md) on a Traffic Manager endpoint.
 
