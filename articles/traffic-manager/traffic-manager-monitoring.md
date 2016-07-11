<properties
   pageTitle="Traffic Manager endpoint monitoring and failover | Microsoft Azure"
   description="This article can help you understand how Traffic Manager uses endpoint monitoring and automatic endpoint failover to help Azure customers deploy high-availability applications"
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
   ms.date="07/01/2016"
   ms.author="jtuliani" />

# Traffic Manager endpoint monitoring and failover

Azure Traffic Manager includes built-in endpoint monitoring and automatic endpoint failover. This feature helps you deliver high-availability applications that are resilient to endpoint failure, including Azure region failures.

Traffic Manager works by making regular requests to each endpoint and then verifying the response. If an endpoint fails to provide a valid response, Traffic Manager shows its status as Degraded. It is no longer included in DNS responses, which instead will return an alternative, available endpoint. In this way, user traffic is directed away from failing endpoints and toward endpoints that are available.

Endpoint health checks for degraded endpoints continue so that they can be brought back into rotation automatically after they recover and become healthy.

## Configure endpoint monitoring

To configure endpoint monitoring, you must specify the following settings on your Traffic Manager profile:

- **Protocol**. Choose HTTP or HTTPS. It’s important to note that HTTPS monitoring does not verify whether your SSL certificate is valid--it only checks that the certificate is present.
- **Port**. Choose the port used for the request. Standard HTTP and HTTPS ports are among the choices.
- **Path**. Give the relative path and the name of the webpage or file that the monitoring health check will attempt to access. Note that a forward slash (/) is a valid entry for the relative path, and that it implies that the file is in the root directory (default).

To check the health of each endpoint, Traffic Manager makes a GET request to the endpoint using the protocol, port, and relative path given.

A common practice is to implement a custom page within your application, for example, /health.aspx. Configure this page to be the Traffic Manager endpoint monitoring path. Within that page, you can perform any necessary application-specific checks, such as checking the availability of a database, before returning either HTTP 200 (if the service is healthy) or a different status code if otherwise.

Endpoint monitoring settings are configured at the Traffic Manager profile level, not per endpoint. Therefore, the same settings are used to check the health of all endpoints. If you need to use different monitoring settings for different endpoints, you can do this by using [nested Traffic Manager profiles](traffic-manager-nested-profiles.md#example-5-per-endpoint-monitoring-settings).

## Endpoint and profile status

You can enable and disable Traffic Manager profiles and endpoints. However, a change in endpoint status also might occur as a result of Traffic Manager automated settings and processes. The following parameters describe how this works.

### Endpoint status

Endpoint status is a user-controlled setting, by which you can easily enable or disable a specific endpoint. This does not affect the status of the underlying service (which might still be running). Instead, it controls the availability of a specific endpoint from a Traffic Manager perspective. When an endpoint status is Disabled, Traffic Manager does not check its health and the endpoint is not included in a DNS response.

### Profile status

Profile status is a user-controlled setting. You can use it to easily enable or disable a profile. Although endpoint status affects a single endpoint, profile status affects the entire profile, including all endpoints. Endpoints in a profile with a Disabled status are not checked for health and no endpoints are included in a DNS response (an NXDOMAIN response is returned).

### Endpoint monitor status

Endpoint monitor status is a Traffic Manager-generated setting that shows the current status of the endpoint. You cannot change this setting manually. Endpoint monitor status reflects ongoing endpoint monitoring, in addition to other information, such as the endpoint status. The possible values of endpoint monitor status are shown in the following table. (For details about how endpoint monitor status is calculated for nested endpoints, see [nested Traffic Manager profiles](traffic-manager-nested-profiles.md).)

|Profile status|Endpoint status|Endpoint monitor status (API and Portal)|Notes|
|---|---|---|---|
|Disabled|Enabled|Inactive|The profile has been disabled by the user. Although the endpoint status still can be Enabled, the profile status (Disabled) takes precedence. Endpoints in disabled profiles are not monitored, and no endpoints are included in DNS responses (an NXDOMAIN response is returned).|
|&lt;any&gt;|Disabled|Disabled|The endpoint has been disabled by the user. An endpoint with a Disabled status is not monitored. It is not available to be included in DNS responses, and so it does not receive traffic.|
|Enabled|Enabled|Online|The endpoint is monitored and is healthy. It is available to be included in DNS responses, and so it can receive traffic.|
|Enabled|Enabled|Degraded|Endpoint monitoring health checks are failing. The endpoint is not available to be included in DNS responses, and so it does not receive traffic.|
|Enabled|Enabled|CheckingEndpoint|The endpoint is monitored, but the results of the first probe have not yet been received. This is a temporary state that usually occurs when you’ve just added a new endpoint to the profile, or you have just enabled an endpoint or profile. An endpoint in this state is available to be included in DNS responses, and so it can receive traffic.|
|Enabled|Enabled|Stopped|The cloud service or web app that the endpoint points to is not running. Check the cloud service or web app settings. An endpoint with a Stopped status is not monitored. It is not available to be included in DNS responses, and so it does not receive traffic.|

### Profile monitor status

Profile monitor status is a combination of the endpoint monitor status values for all endpoints in the profile, and your configured profile status. The possible values are described in the following table.

|Profile status (as configured)|Endpoint monitor status|Profile monitor status (API and Portal)|Notes|
|---|---|---|---|
|Disabled|&lt;any&gt; or a profile with no defined endpoints.|Disabled|The profile has been disabled by the user.|
|Enabled|The status of at least one endpoint is Degraded.|Degraded|This is a flag that customer action is required. Review the individual endpoint status values to determine which endpoints require further attention.|
|Enabled|The status of at least one endpoint is Online. No endpoints have a Degraded status.|Online|The service is accepting traffic and customer action is not required.|
|Enabled|The status of at least one endpoint is CheckingEndpoint. No endpoints are in Online or Degraded status.|CheckingEndpoints|Transition state. This typically occurs when a profile has just been created or enabled and the endpoint health is being checked for the first time.|
|Enabled|The statuses of all endpoints defined in the profile are either Disabled or Stopped, or the profile has no defined endpoints.|Inactive|No endpoints are active, but the profile is still Enabled.|

## Endpoint failover and failback

Consider a scenario in which a previously healthy endpoint fails. Traffic Manager detects the failure and the endpoint is taken out of rotation. Later, the endpoint recovers. Traffic Manager detects this recovery, and the endpoint is brought back into rotation.

>[AZURE.NOTE] Traffic Manager only considers an endpoint to be online if the return message is 200 OK. If any of the following occur, Traffic Manager considers this a failed endpoint health check:

>- A non-200 response is received (including a different 2xx code, or a 301/302 redirect)
>- Request for client authentication
>- Timeout (the timeout threshold is 10 seconds)
>- Unable to connect

>For more information about troubleshooting failed checks, see [Troubleshooting Degraded status on Azure Traffic Manager](traffic-manager-troubleshooting-degraded.md).

The following timeline describes in detail the sequence of steps that occur.

![Traffic Manager endpoint failover and failback sequence](./media/traffic-manager-monitoring/timeline.png)

1. **GET**. The Traffic Manager monitoring system performs a GET request on the path and file you specified in the monitoring settings. This is repeated for each endpoint.
2. **200 OK**. The monitoring system expects an HTTP 200 OK message to be returned within 10 seconds. When it receives this response, it recognizes that the service is available.
3. **30 seconds between checks**. The endpoint health check will be repeated every 30 seconds.
4. **Service unavailable**. The service becomes unavailable. Traffic Manager will not know until the next health check.
5. **Attempts to access monitoring file (four tries)**. The monitoring system performs a GET request, but does not receive a response within the timeout period of 10 seconds (alternatively, a non-200 response may be received). It then tries three more times, at 30 second intervals. If one of the tries is successful, then the number of tries is reset.
6. **Status set to Degraded**. After a fourth consecutive failure, the monitoring system  marks the unavailable endpoint status as Degraded.
7. **Traffic is diverted to other endpoints**. The Traffic Manager DNS name servers are updated and Traffic Manager no longer returns the endpoint in response to DNS queries. New connections are directed to other, available endpoints. However, previous DNS responses that include this endpoint might still be cached by recursive DNS servers and DNS clients. This would cause some clients to try to connect to this endpoint. As these caches expire, clients make new DNS queries and are directed to different endpoints. The cache duration is controlled by the TTL setting in the Traffic Manager profile, for example, 30 seconds.
8. **Health checks continue**. Traffic Manager continues to check the health of the endpoint while it has a Degraded status. This is so that it can detect when the endpoint returns to health.
9. **Service comes back online**. The service becomes available. The endpoint retains its Degraded status in Traffic Manager until the monitoring system performs its next health check.
10. **Traffic to service resumes**. Traffic Manager sends a GET request and receives a 200 OK status response. This indicates that the service has returned to a healthy state. The Traffic Manager name servers are updated, and they begin to hand out the service’s DNS name in DNS responses. Traffic returns to the endpoint as cached DNS responses that return other endpoints expire, and as existing connections to other endpoints are terminated.

>[AZURE.NOTE] Because Traffic Manager works at the DNS level, it cannot influence existing connections to any endpoint. When it directs traffic between endpoints (either by changed profile settings, or during failover or failback), Traffic Manager directs new connections to available endpoints. However, other endpoints might continue to receive traffic via existing connections until those sessions are terminated. To enable traffic to drain from existing connections, applications should limit the session duration used with each endpoint.

## Degraded endpoints

When an endpoint has a Degraded status, it is no longer returned in response to DNS queries (for an exception to this rule, see the note at the end of this section). Instead, an alternative endpoint is chosen and returned. The choice of alternative endpoint depends on the configured traffic-routing method:

- **Priority**. Endpoints form a prioritized list. The first available endpoint on the list is always returned. If an endpoint status is Degraded, then the next available endpoint is returned.
- **Weighted**. Any of the available endpoints may be returned, chosen at random based on their assigned weights and the weights of the other available endpoints. If an endpoint status is Degraded, an endpoint is chosen from the remaining pool of available endpoints.
- **Performance**. The endpoint closest to the end user is returned (excluding endpoints with a Disabled or Stopped status). If that endpoint is unavailable, the endpoint returned is chosen at random from all the other available endpoints. (This is to help avoid a cascading failure that could potentially occur if the next-closest endpoint becomes overloaded. You can configure alternative failover plans for performance traffic-routing by using [nested Traffic Manager profiles](traffic-manager-nested-profiles.md#example-4-controlling-performance-traffic-routing-between-multiple-endpoints-in-the-same-region).)

For more information, see [Traffic Manager traffic-routing methods](traffic-manager-routing-methods.md).

>[AZURE.NOTE] What happens if all Traffic Manager endpoints (excluding endpoints with a Disabled or Stopped status) are failing their health checks, and show a Degraded status?

>This most commonly is caused by an error in the configuration of the service (such as an access control list [ACL] blocking the Traffic Manager health checks), or an error in the configuration of the Traffic Manager profile (such as an incorrect monitoring path).

>In this case, Traffic Manager makes a "best effort" attempt and *responds as if all the Degraded status endpoints actually are in an online state*. This is preferable to the alternative, which would be to not return any endpoint in the DNS response.

>A consequence of this behavior is that if Traffic Manager health checks are not configured correctly, it might appear from the traffic routing as though Traffic Manager *is* working properly. However, in this case, endpoint failover will not happen if an endpoint fails, and this affects overall application availability. To ensure that this does not occur, it is important to check that the profile shows an Online status, and not a Degraded status. An Online status shows that the Traffic Manager health checks are working as expected.

For more details about troubleshooting failed health checks, see [Troubleshooting Degraded status on Azure Traffic Manager](traffic-manager-troubleshooting-degraded.md).

## FAQ

### Is Traffic Manager itself resilient to Azure region failures?

By providing built-in health checks and automatic failover between regions, Traffic Manager is a key component of the delivery of highly available applications in Azure, including applications that are resilient to a region-wide Azure outage.

Because of this, Traffic Manager itself must offer an exceptionally high level of availability, including resilience to regional failure.

Although some parts of Traffic Manager run in Azure, these components are distributed across regions and are designed to be resilient to a complete failure of any Azure region. This resilience applies to all Traffic Manager components: the DNS name servers, the API, the storage layer, and the endpoint monitoring service.

Therefore, even in the unlikely event of a total outage of an entire Azure region, Traffic Manager is expected to continue to function as normal, and customers with applications deployed in multiple Azure regions can rely on Traffic Manager to direct traffic to an available instance of their application.

### How does the choice of resource group location affect Traffic Manager?

Traffic Manager is a single, global service. It is not regional. The choice of resource group location makes no difference to Traffic Manager profiles deployed in that resource group.

Azure Resource Manager requires all resource groups to specify a location, which determines the default location for resources deployed in that resource group. You will be asked for this location if you create a new resource group when you create a Traffic Manager profile via the Azure portal.

All Traffic Manager profiles use **global** as their location. Because this is the only value accepted, this setting is not accessible in the Azure portal, PowerShell, or Azure CLI. This overrides the resource group default.

### How do I determine the current health of each endpoint?

The current monitoring status of each endpoint, in addition to the overall profile, is displayed in the Azure portal. This information also is available via the Traffic Monitor [REST API](https://msdn.microsoft.com/library/azure/mt163667.aspx), [PowerShell cmdlets](https://msdn.microsoft.com/library/mt125941.aspx), and [cross-platform Azure CLI](../xplat-cli-install.md).

It is not possible to view historical information about past endpoint health, nor is it possible to configure alerts about changes to endpoint health.

### Can I monitor HTTPS endpoints?

Yes. Traffic Manager supports probing over HTTPS. Simply configure **HTTPS** as the protocol in the monitoring configuration.
Note that:

- The server-side certificate is not validated
- SNI server-side certificates are not supported
- Client certificates are not supported

### What host header do endpoint health checks use?

The host header used in HTTP and HTTPS health checks is the DNS name associated with each endpoint. This is exposed as the endpoint target in the Azure portal, [PowerShell cmdlets](https://msdn.microsoft.com/library/mt125941.aspx), [cross-platform Azure CLI](../xplat-cli-install.md), and [REST API](https://msdn.microsoft.com/library/azure/mt163667.aspx).

This value is part of the endpoint configuration. The value used in the host header cannot be specified separately from the target property.


## Next steps

Learn [how Traffic Manager works](traffic-manager-how-traffic-manager-works.md)

Learn more about the [traffic-routing methods](traffic-manager-routing-methods.md) supported by Traffic Manager

Learn how to [create a Traffic Manager profile](traffic-manager-manage-profiles.md)

[Troubleshoot Degraded status](traffic-manager-troubleshooting-degraded.md) on a Traffic Manager endpoint
