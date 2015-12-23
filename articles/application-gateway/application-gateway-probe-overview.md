

<properties 
   pageTitle="Create custom probe for Application Gateway using PowerShell in Resource Manager | Microsoft Azure"
   description="Learn how to create custom probe for Application Gateway using PowerShell in Resource Manager"
   services="application-gateway"
   documentationCenter="na"
   authors="joaoma"
   manager="carmonm"
   editor=""
   tags="azure-resource-manager"
/>
<tags  
   ms.service="application-gateway"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="12/17/2015"
   ms.author="joaoma" />

# Health monitoring


Azure Application Gateway by default monitors the health of all resources in its back end pool and automatically removes any resource considered unhealthy from the pool. Application Gateway continues to monitor the unhealthy instances and adds them back to healthy back end pool, once they become available and respond to health probes.

In addition to default health probe monitoring, you can also customize the health probe to suit your application's requirements. In this article we will cover both default and custom health probes.

## Default health probe

An application gateway automatically configures a default health probe when you don't set up any custom probe configuration. The monitoring behavior works by making an HTTP request to the IP addresses configured for back end pool.

For example: You configure your application gateway to use back end servers A, B and C to receive HTTP network traffic on port 80. The default health monitoring tests the three servers every 30 seconds for a healthy HTTP response. A healthy HTTP response has a [status code](https://msdn.microsoft.com/library/aa287675.aspx) between 200 and 399.

If the default probe check fails for server A, the application gateway removes it from its back end pool, and network traffic stops flowing to this server. The default probe still continues to check for server A every 30 seconds. When server A responds successfully to one request from a default health probe, it is added back as healthy to the back end pool and traffic starts flowing to the server again.

The default probe uses only the IP addresses to check on the status. If you want to verify health by testing connectivity to a URL, you must use custom probe.

### Default health probe settings

|Probe properties | Value | Description|
|---|---|---|
| Probe URL| http[s]://127.0.0.1/ | URL path |
| Interval | 30 | probe interval in seconds |
| Timeout  | 30 | probe timeout in seconds |
| Unhealthy Threshold | 3 | Probe retry count. Back end server is marked down after consecutive probe failure count reaches an unhealthy threshold |


## Custom health probe 

Custom probes allow you to have a more granular control over the heath monitoring. When using custom probes you can configure the probe interval, the URL and path to test, and how many failed responses to accept before marking the back end pool instance as unhealthy.


### Custom health probe settings

|Probe properties| Description|
|---|---|
| Name | Name of probe. This name is used to refer probe in backend Http settings |
| Protocol | Protocol used to send probe. Http is the only valid protocols. We might support Https in future release |
| Host |  Host name to send probe |
| Path | Relative path of probe. Valid path starts from '/'. Probe is sent to <Protocol>://<host><path> |
| Interval | Probe interval in seconds. This is the time interval between two consecutive probes| 
| Timeout | Probe timeout in seconds. Probe marked as failed if valid response is not received with this timeout period |
| Unhealthy Threshold | Probe retry count. Back end server is marked down after consecutive probe failure count reaches an unhealthy threshold |

## Next steps

After lerning about monitoring, you can configure a [custom health probe](application-gateway-create-probe-ps.md) for Azure Resource manager or configure [custom health probe](application-gateway-create-probe-classic-ps.md) for Azure classic deployment model.