---
title: Health monitoring overview for Azure Application Gateway
description: Learn about the monitoring capabilities in Azure Application Gateway
services: application-gateway
author: vhorne
manager: jpconnock

ms.service: application-gateway
ms.topic: article
ms.date: 8/6/2018
ms.author: victorh
---

# Application Gateway health monitoring overview

Azure Application Gateway by default monitors the health of all resources in its back-end pool and automatically removes any resource considered unhealthy from the pool. Application Gateway continues to monitor the unhealthy instances and adds them back to the healthy back-end pool once they become available and respond to health probes. Application gateway sends the health probes with the same port that is defined in the back-end HTTP settings. This configuration ensures that the probe is testing the same port that customers would be using to connect to the backend.

![application gateway probe example][1]

In addition to using default health probe monitoring, you can also customize the health probe to suit your application's requirements. In this article, both default and custom health probes are covered.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Default health probe

An application gateway automatically configures a default health probe when you don't set up any custom probe configuration. The monitoring behavior works by making an HTTP request to the IP addresses configured for the back-end pool. For default probes if the backend http settings are configured for HTTPS, the probe uses HTTPS as well to test health of the backends.

For example: You configure your application gateway to use back-end servers A, B, and C to receive HTTP network traffic on port 80. The default health monitoring tests the three servers every 30 seconds for a healthy HTTP response. A healthy HTTP response has a [status code](https://msdn.microsoft.com/library/aa287675.aspx) between 200 and 399.

If the default probe check fails for server A, the application gateway removes it from its back-end pool, and network traffic stops flowing to this server. The default probe still continues to check for server A every 30 seconds. When server A responds successfully to one request from a default health probe, it is added back as healthy to the back-end pool, and traffic starts flowing to the server again.

### Probe Matching

By default, an HTTP(S) response with status code between 200 and 399 is considered healthy. Custom health probes additionally support two matching criteria. Matching criteria can be used to optionally modify the default interpretation of what constitutes a healthy response.

The following are matching criteria: 

- **HTTP response status code match** - Probe matching criterion for accepting user specified http response code or response code ranges. Individual comma-separated response status codes or a range of status code is supported.
- **HTTP response body match** - Probe matching criterion that looks at HTTP response body and matches with a user specified string. The match only looks for presence of user specified string in response body and is not a full regular expression match.

Match criteria can be specified using the `New-AzApplicationGatewayProbeHealthResponseMatch` cmdlet.

For example:

```azurepowershell
$match = New-AzApplicationGatewayProbeHealthResponseMatch -StatusCode 200-399
$match = New-AzApplicationGatewayProbeHealthResponseMatch -Body "Healthy"
```
Once the match criteria is specified, it can be attached to probe configuration using a `-Match` parameter in PowerShell.

### Default health probe settings

| Probe property | Value | Description |
| --- | --- | --- |
| Probe URL |http://127.0.0.1:\<port\>/ |URL path |
| Interval |30 |The amount of time in seconds to wait before the next health probe is sent.|
| Time-out |30 |The amount of time in seconds the application gateway waits for a probe response before marking the probe as unhealthy. If a probe returns as healthy, the corresponding backend is immediately marked as healthy.|
| Unhealthy threshold |3 |Governs how many probes to send in case there is a failure of the regular health probe. These additional health probes are sent in quick succession to determine the health of the backend quickly and do not wait for the probe interval. The back-end server is marked down after the consecutive probe failure count reaches the unhealthy threshold. |

> [!NOTE]
> The port is the same port as the back-end HTTP settings.

The default probe looks only at http:\//127.0.0.1:\<port\> to determine health status. If you need to configure the health probe to go to a custom URL or modify any other settings, you must use custom probes.

### Probe intervals

All instances of Application Gateway probe the backend independent of each other. The same probe configuration applies to each Application Gateway instance. For example, if the probe configuration is to send health probes every 30 seconds and the application gateway has two instances, then both instances send the health probe every 30 seconds.

Also if there are multiple listeners, then each listener probes the backend independent of each other. For example, if there are two listeners pointing to the same backend pool on two different ports (configured by two backend http settings) then each listener probes the same backend independently. In this case, there are two probes from each application gateway instance for the two listeners. If there are two instances of the application gateway in this scenario, the backend virtual machine would see four probes per the configured probe interval.

## Custom health probe

Custom probes allow you to have a more granular control over the health monitoring. When using custom probes, you can configure the probe interval, the URL and path to test, and how many failed responses to accept before marking the back-end pool instance as unhealthy.

### Custom health probe settings

The following table provides definitions for the properties of a custom health probe.

| Probe property | Description |
| --- | --- |
| Name |Name of the probe. This name is used to refer to the probe in back-end HTTP settings. |
| Protocol |Protocol used to send the probe. The probe uses the protocol defined in the back-end HTTP settings |
| Host |Host name to send the probe. Applicable only when multi-site is configured on Application Gateway, otherwise use '127.0.0.1'. This value is different from VM host name. |
| Path |Relative path of the probe. The valid path starts from '/'. |
| Interval |Probe interval in seconds. This value is the time interval between two consecutive probes. |
| Time-out |Probe time-out in seconds. If a valid response is not received within this time-out period, the probe is marked as failed.  |
| Unhealthy threshold |Probe retry count. The back-end server is marked down after the consecutive probe failure count reaches the unhealthy threshold. |

> [!IMPORTANT]
> If Application Gateway is configured for a single site, by default the Host name should be specified as '127.0.0.1', unless otherwise configured in custom probe.
> For reference a custom probe is sent to \<protocol\>://\<host\>:\<port\>\<path\>. The port used will be the same port as defined in the back-end HTTP settings.

## NSG considerations

If there is a network security group (NSG) on an application gateway subnet, port ranges 65503-65534 must be opened on the application gateway subnet for inbound traffic. These ports are required for the backend health API to work.

Additionally, outbound Internet connectivity can't be blocked, and inbound traffic coming from the AzureLoadBalancer tag must be allowed.

## Next steps
After learning about Application Gateway health monitoring, you can configure a [custom health probe](application-gateway-create-probe-portal.md) in the Azure portal or a [custom health probe](application-gateway-create-probe-ps.md) using PowerShell and the Azure Resource Manager deployment model.

[1]: ./media/application-gateway-probe-overview/appgatewayprobe.png
