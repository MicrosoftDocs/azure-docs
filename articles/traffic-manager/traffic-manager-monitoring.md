---
title: Azure Traffic Manager endpoint monitoring | Microsoft Docs
description: This article can help you understand how Traffic Manager uses endpoint monitoring and automatic endpoint failover to help Azure customers deploy high-availability applications
services: traffic-manager
documentationcenter: ''
author: kumudd
manager: timlt
editor: ''

ms.assetid: fff25ac3-d13a-4af9-8916-7c72e3d64bc7
ms.service: traffic-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/16/2017
ms.author: kumud
---

# Traffic Manager endpoint monitoring

Azure Traffic Manager includes built-in endpoint monitoring and automatic endpoint failover. This feature helps you deliver high-availability applications that are resilient to endpoint failure, including Azure region failures.

## Configure endpoint monitoring

To configure endpoint monitoring, you must specify the following settings on your Traffic Manager profile:

* **Protocol**. Choose HTTP or HTTPS. It's important to note that HTTPS monitoring does not verify whether your SSL certificate is valid--it only checks that the certificate is present.
* **Port**. Choose the port used for the request.
* **Path**. Give the relative path and the name of the webpage or file that the monitoring accesses. A forward slash (/) is a valid entry for the relative path. This value implies that the file is in the root directory (default).

To check the health of each endpoint, Traffic Manager makes a GET request to the endpoint using the protocol, port, and relative path given.

A common practice is to implement a custom page within your application, for example, /health.aspx. Using this path for monitoring, you can perform application-specific checks, such as checking performance counters or verifying database availability. Based on these custom checks, the page returns an appropriate HTTP status code.

All endpoints in a Traffic Manager profile share monitoring settings. If you need to use different monitoring settings for different endpoints, you can create [nested Traffic Manager profiles](traffic-manager-nested-profiles.md#example-5-per-endpoint-monitoring-settings).

## Endpoint and profile status

You can enable and disable Traffic Manager profiles and endpoints. However, a change in endpoint status also might occur as a result of Traffic Manager automated settings and processes.

### Endpoint status

You can enable or disable a specific endpoint. The underlying service, which might still be healthy, is unaffected. Changing the endpoint status controls the availability of the endpoint in the Traffic Manager profile. When an endpoint status is disabled, Traffic Manager does not check its health and the endpoint is not included in a DNS response.

### Profile status

Using the profile status setting, you can enable or disable a specific profile. While endpoint status affects a single endpoint, profile status affects the entire profile, including all endpoints. When you disable a profile, the endpoints are not checked for health and no endpoints are included in a DNS response. An [NXDOMAIN](https://tools.ietf.org/html/rfc2308) response code is returned for the DNS query.

### Endpoint monitor status

Endpoint monitor status is a Traffic Manager-generated value that shows the status of the endpoint. You cannot change this setting manually. The endpoint monitor status is a combination of the results of endpoint monitoring and the configured endpoint status. The possible values of endpoint monitor status are shown in the following table:

| Profile status | Endpoint status | Endpoint monitor status | Notes |
| --- | --- | --- | --- |
| Disabled |Enabled |Inactive |The profile has been disabled. Although the endpoint status is Enabled, the profile status (Disabled) takes precedence. Endpoints in disabled profiles are not monitored. An NXDOMAIN response code is returned for the DNS query. |
| &lt;any&gt; |Disabled |Disabled |The endpoint has been disabled. Disabled endpoints are not monitored. The endpoint is not included in DNS responses, therefore, it does not receive traffic. |
| Enabled |Enabled |Online |The endpoint is monitored and is healthy. It is included in DNS responses and can receive traffic. |
| Enabled |Enabled |Degraded |Endpoint monitoring health checks are failing. The endpoint is not included in DNS responses and does not receive traffic. |
| Enabled |Enabled |CheckingEndpoint |The endpoint is monitored, but the results of the first probe have not been received yet. CheckingEndpoint is a temporary state that usually occurs immediately after adding or enabling an endpoint in the profile. An endpoint in this state is included in DNS responses and can receive traffic. |
| Enabled |Enabled |Stopped |The cloud service or web app that the endpoint points to is not running. Check the cloud service or web app settings. An endpoint with a Stopped status is not monitored. It is not included in DNS responses and does not receive traffic. |

For details about how endpoint monitor status is calculated for nested endpoints, see [nested Traffic Manager profiles](traffic-manager-nested-profiles.md).

### Profile monitor status

The profile monitor status is a combination of the configured profile status and the endpoint monitor status values for all endpoints. The possible values are described in the following table:

| Profile status (as configured) | Endpoint monitor status | Profile monitor status | Notes |
| --- | --- | --- | --- |
| Disabled |&lt;any&gt; or a profile with no defined endpoints. |Disabled |The profile has been disabled. |
| Enabled |The status of at least one endpoint is Degraded. |Degraded |Review the individual endpoint status values to determine which endpoints require further attention. |
| Enabled |The status of at least one endpoint is Online. No endpoints have a Degraded status. |Online |The service is accepting traffic. No further action is required. |
| Enabled |The status of at least one endpoint is CheckingEndpoint. No endpoints are in Online or Degraded status. |CheckingEndpoints |This transition state occurs when a profile if created or enabled. The endpoint health is being checked for the first time. |
| Enabled |The statuses of all endpoints in the profile are either Disabled or Stopped, or the profile has no defined endpoints. |Inactive |No endpoints are active, but the profile is still Enabled. |

## Endpoint failover and recovery

Traffic Manager periodically checks the health of every endpoint, including unhealthy endpoints. Traffic Manager detects when an endpoint becomes healthy and brings it back into rotation.

> [!NOTE]
> Traffic Manager only considers an endpoint to be online if the return message is 200 OK. An endpoint is unhealthy when any of the following events occur:
>
> * A non-200 response is received (including a different 2xx code, or a 301/302 redirect)
> * Request for client authentication
> * Timeout (the timeout threshold is 10 seconds)
> * Unable to connect
>
> For more information about troubleshooting failed checks, see [Troubleshooting Degraded status on Azure Traffic Manager](traffic-manager-troubleshooting-degraded.md).

The following timeline is a detailed description of the monitoring process.

![Traffic Manager endpoint failover and failback sequence](./media/traffic-manager-monitoring/timeline.png)

1. **GET**. For each endpoint, the Traffic Manager monitoring system performs a GET request on the path and file specified in the monitoring settings.
2. **200 OK**. The monitoring system expects an HTTP 200 OK message to be returned within 10 seconds. When it receives this response, it recognizes that the service is available.
3. **30 seconds between checks**. The endpoint health check is repeated every 30 seconds.
4. **Service unavailable**. The service becomes unavailable. Traffic Manager will not know until the next health check.
5. **Attempts to access monitoring file (four tries)**. The monitoring system performs a GET request, but does not receive a response within the timeout period of 10 seconds (alternatively, a non-200 response may be received). It then tries three more times, at 30-second intervals. If one of the tries is successful, then the number of tries is reset.
6. **Status set to Degraded**. After a fourth consecutive failure, the monitoring system marks the unavailable endpoint status as Degraded.
7. **Traffic is diverted to other endpoints**. The Traffic Manager DNS name servers are updated and Traffic Manager no longer returns the endpoint in response to DNS queries. New connections are directed to other, available endpoints. However, previous DNS responses that include this endpoint may still be cached by recursive DNS servers and DNS clients. Clients continue to use the endpoint until the DNS cache expires. As the DNS cache expires, clients make new DNS queries and are directed to different endpoints. The cache duration is controlled by the TTL setting in the Traffic Manager profile, for example, 30 seconds.
8. **Health checks continue**. Traffic Manager continues to check the health of the endpoint while it has a Degraded status. Traffic Manager detects when the endpoint returns to health.
9. **Service comes back online**. The service becomes available. The endpoint retains its Degraded status in Traffic Manager until the monitoring system performs its next health check.
10. **Traffic to service resumes**. Traffic Manager sends a GET request and receives a 200 OK status response. The service has returned to a healthy state. The Traffic Manager name servers are updated, and they begin to hand out the service's DNS name in DNS responses. Traffic returns to the endpoint as cached DNS responses that return other endpoints expire, and as existing connections to other endpoints are terminated.

> [!NOTE]
> Because Traffic Manager works at the DNS level, it cannot influence existing connections to any endpoint. When it directs traffic between endpoints (either by changed profile settings, or during failover or failback), Traffic Manager directs new connections to available endpoints. However, other endpoints might continue to receive traffic via existing connections until those sessions are terminated. To enable traffic to drain from existing connections, applications should limit the session duration used with each endpoint.

## Traffic-routing methods

When an endpoint has a Degraded status, it is no longer returned in response to DNS queries. Instead, an alternative endpoint is chosen and returned. The traffic-routing method configured in the profile determines how the alternative endpoint is chosen.

* **Priority**. Endpoints form a prioritized list. The first available endpoint on the list is always returned. If an endpoint status is Degraded, then the next available endpoint is returned.
* **Weighted**. Any available endpoint is chosen at random based on their assigned weights and the weights of the other available endpoints.
* **Performance**. The endpoint closest to the end user is returned. If that endpoint is unavailable, an endpoint is randomly chosen from all the other available endpoints. Choosing a random endpoint avoids a cascading failure that can occur when the next-closest endpoint becomes overloaded. You can configure alternative failover plans for performance traffic-routing by using [nested Traffic Manager profiles](traffic-manager-nested-profiles.md#example-4-controlling-performance-traffic-routing-between-multiple-endpoints-in-the-same-region).

For more information, see [Traffic Manager traffic-routing methods](traffic-manager-routing-methods.md).

> [!NOTE]
> One exception to normal traffic-routing behavior occurs when all eligible endpoints have a degraded status. Traffic Manager makes a "best effort" attempt and *responds as if all the Degraded status endpoints actually are in an online state*. This behavior is preferable to the alternative, which would be to not return any endpoint in the DNS response. Disabled or Stopped endpoints are not monitored, therefore, they are not considered eligible for traffic.
>
> This condition is commonly caused by improper configuration of the service, such as:
>
> * An access control list [ACL] blocking the Traffic Manager health checks
> * An improper configuration of the monitoring path in the Traffic manager profile
>
> The consequence of this behavior is that if Traffic Manager health checks are not configured correctly, it might appear from the traffic routing as though Traffic Manager *is* working properly. However, in this case, endpoint failover cannot happen which affects overall application availability. It is important to check that the profile shows an Online status, not a Degraded status. An Online status indicates that the Traffic Manager health checks are working as expected.

For more information about troubleshooting failed health checks, see [Troubleshooting Degraded status on Azure Traffic Manager](traffic-manager-troubleshooting-degraded.md).



## Next steps

Learn [how Traffic Manager works](traffic-manager-how-traffic-manager-works.md)

Learn more about the [traffic-routing methods](traffic-manager-routing-methods.md) supported by Traffic Manager

Learn how to [create a Traffic Manager profile](traffic-manager-manage-profiles.md)

[Troubleshoot Degraded status](traffic-manager-troubleshooting-degraded.md) on a Traffic Manager endpoint
