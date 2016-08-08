

<properties
   pageTitle="Health monitoring overview for Azure Application Gateway | Microsoft Azure"
   description="Learn about the monitoring capabilities in Azure Application Gateway"
   services="application-gateway"
   documentationCenter="na"
   authors="georgewallace"
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
   ms.date="03/03/2016"
   ms.author="gwallace" />

# Application Gateway health monitoring overview


Azure Application Gateway by default monitors the health of all resources in its back-end pool and automatically removes any resource considered unhealthy from the pool. Application Gateway continues to monitor the unhealthy instances and adds them back to the healthy back-end pool once they become available and respond to health probes.

In addition to using default health probe monitoring, you can also customize the health probe to suit your application's requirements. In this article, we will cover both default and custom health probes.

## Default health probe

An application gateway automatically configures a default health probe when you don't set up any custom probe configuration. The monitoring behavior works by making an HTTP request to the IP addresses configured for the back-end pool.

For example: You configure your application gateway to use back-end servers A, B, and C to receive HTTP network traffic on port 80. The default health monitoring tests the three servers every 30 seconds for a healthy HTTP response. A healthy HTTP response has a [status code](https://msdn.microsoft.com/library/aa287675.aspx) between 200 and 399.

If the default probe check fails for server A, the application gateway removes it from its back-end pool, and network traffic stops flowing to this server. The default probe still continues to check for server A every 30 seconds. When server A responds successfully to one request from a default health probe, it is added back as healthy to the back-end pool, and traffic starts flowing to the server again.

The default probe looks only at http://127.0.0.1:<port> to determine health status. If you need to configure the health probe to go to a custom URL or modify any other settings, you must use custom probes as described below.

### Default health probe settings

|Probe property | Value | Description|
|---|---|---|
| Probe URL| http://127.0.0.1/ | URL path |
| Interval | 30 | Probe interval in seconds |
| Time-out  | 30 | Probe time-out in seconds |
| Unhealthy threshold | 3 | Probe retry count. The back-end server is marked down after the consecutive probe failure count reaches the unhealthy threshold. |


## Custom health probe

Custom probes allow you to have a more granular control over the health monitoring. When using custom probes, you can configure the probe interval, the URL and path to test, and how many failed responses to accept before marking the back-end pool instance as unhealthy.


### Custom health probe settings

|Probe property| Description|
|---|---|
| Name | Name of the probe. This name is used to refer to the probe in back-end HTTP settings. |
| Protocol | Protocol used to send the probe. HTTP is the only valid protocol. |
| Host |  Host name to send the probe. |
| Path | Relative path of the probe. The valid path starts from '/'. The probe is sent to <protocol>://<host>:<port><path> |
| Interval | Probe interval in seconds. This is the time interval between two consecutive probes.|
| Time-out | Probe time-out in seconds. The probe is marked as failed if a valid response is not received within this time-out period. |
| Unhealthy threshold | Probe retry count. The back-end server is marked down after the consecutive probe failure count reaches the unhealthy threshold. |

## Next steps

After learning about Application Gateway health monitoring, you can configure a [custom health probe](application-gateway-create-probe-ps.md) for Azure Resource Manager or a [custom health probe](application-gateway-create-probe-classic-ps.md) for the Azure classic deployment model.
