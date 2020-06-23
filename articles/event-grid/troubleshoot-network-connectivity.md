---
title: Troubleshoot network connectivity issues - Azure Event Grid | Microsoft Docs
description: This article provides information on troubleshooting network connectivity issues with Azure Event Grid.
services: event-grid
documentationcenter: na
author: batrived

ms.service: event-grid
ms.devlang: na
ms.topic: article
ms.date: 06/21/2020
ms.author: batrived
---

# Troubleshoot connectivity issues - Azure Event Grid

There are various reasons for client applications not able to connect to an Event Grid topic/domain. The connectivity issues that you experience may be permanent or transient. If the issue happens all the time (permanent), you may want to check the your organization's firewall settings, IP firewall settings, service tags, private endpoints, and more. For transient issues, running commands to check dropped packets, and obtaining network traces may help with troubleshooting the issues.

This article provides tips for troubleshooting connectivity issues with Azure Event Grid.

## Troubleshoot permanent connectivity issues

If the application isn't able to connect to the event grid at all, follow steps from this section to troubleshoot the issue.

### Check if there is a service outage

Check for the Azure Event Grid service outage on the [Azure service status site](https://azure.microsoft.com/status/).

### Check if the ports required to communicate with Event Grid aren't blocked by organization's firewall

Verify that ports used in communicating with Azure Event Grid aren't blocked on your organization's firewall. See the following table for the outbound ports you need to open to communicate with Azure Event Grid.

| Protocol | Ports |
| -------- | ----- |
| HTTPS    | 443   |

Here is a sample command that checks whether the 443 port is blocked.

```powershell
.\psping.exe -n 25 -i 1 -q {sampletopicname}.{region}-{suffix}.eventgrid.azure.net:443 -nobanner
```

On Linux:

```shell
telnet {sampletopicname}.{region}-{suffix}.eventgrid.azure.net 443
```

### Verify that IP addresses are allowed in your corporate firewall

When you are working with Azure, sometimes you have to allow specific IP address ranges or URLs in your corporate firewall or proxy to access all Azure services you are using or trying to use. Verify that the traffic is allowed on IP addresses used by Event Grid. For IP addresses used by Azure Event Grid: see [Azure IP Ranges and Service Tags - Public Cloud](https://www.microsoft.com/download/details.aspx?id=56519) and [Service tag - AzureEventGrid](network-security.md#service-tags).

> [!NOTE]
> New IP addresses could be added to AzureEventGrid service tag, though it's not usual. So it's good to do a weekly check on the service tags.

### Verify that AzureEventGrid service tag is allowed in your network security groups

If your application is running inside a subnet and if there is a associated network security group, confirm if either internet outbound is allowed or AzureEventGrid service tag is allowed. Please see [Service Tags](../virtual-network/service-tags-overview.md)

### Check the IP Firewall settings for your Topic/Domain

Check that the public IP address of the machine on which the application is running isn't blocked by the EventGrid topic/domain IP firewall.

By default, Event Grid topics/domains are accessible from internet as long as the request comes with valid authentication and authorization. With IP firewall, you can restrict it further to only a set of IPv4 addresses or IPv4 address ranges in [CIDR (Classless Inter-Domain Routing)](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation.

The IP firewall rules are applied at the Event Grid topic/domain level. Therefore, the rules apply to all connections from clients using any supported protocol. Any connection attempt from an IP address that does not match an allowed IP rule on the Event Grid topic/domain is rejected as forbidden. The response does not mention the IP rule.

For more information, see [Configure IP firewall rules for an Azure Event Grid topic/domain](configure-firewall.md).

#### Find the IP addresses blocked by IP Firewall

Enable diagnostic logs for Event Grid topic/domain [Enable diagnostic logs](enable-diagnostic-logs-topic.md#enable-diagnostic-logs-for-a-custom-topic). You will see the IP address for the connection that's denied.

```json
{
  "time": "2019-11-01T00:17:13.4389048Z",
  "resourceId": "/SUBSCRIPTIONS/SAMPLE-SUBSCTIPTION-ID/RESOURCEGROUPS/SAMPLE-RESOURCEGROUP-NAME/PROVIDERS/MICROSOFT.EVENTGRID/TOPICS/SAMPLE-TOPIC-NAME",
  "category": "PublishFailures",
  "operationName": "Post",
  "message": "inputEventsCount=null, requestUri=https://SAMPLE-TOPIC-NAME.region-suffix.eventgrid.azure.net/api/events, publisherInfo=PublisherInfo(category=User, inputSchema=EventGridEvent, armResourceId=/SUBSCRIPTIONS/SAMPLE-SUBSCTIPTION-ID/RESOURCEGROUPS/SAMPLE-RESOURCEGROUP-NAME/PROVIDERS/MICROSOFT.EVENTGRID/TOPICS/SAMPLE-TOPIC-NAME), httpStatusCode=Forbidden, errorType=ClientIPRejected, errorMessage=Publishing to SAMPLE-TOPIC-NAME.{region}-{suffix}.EVENTGRID.AZURE.NET by client {clientIp} is rejected due to IpAddress filtering rules."
}
```

### Check if the EventGrid topic/domain can be accessed using only a private endpoint

If the Event Grid topic/domain is configured to be accessible only via private endpoint, confirm that the client application is accessing the topic/domain over the private endpoint. To confirm this, check if the client application is running inside a subnet and there is a private endpoint for Event Grid topic/domain in that subnet.

[Azure Private Link service](../private-link/private-link-overview.md) enables you to access Azure Event Grid over a **private endpoint** in your virtual network. A private endpoint is a network interface that connects you privately and securely to a service powered by Azure Private Link. The private endpoint uses a private IP address from your VNet, effectively bringing the service into your VNet. All traffic to the service can be routed through the private endpoint, so no gateways, NAT devices, ExpressRoute or VPN connections, or public IP addresses are needed. Traffic between your virtual network and the service traverses over the Microsoft backbone network, eliminating exposure from the public Internet. You can connect to an instance of an Azure resource, giving you the highest level of granularity in access control.

For more information, see [Configure private endpoints](configure-private-endpoints.md).

## Troubleshoot transient connectivity issues

If you are experiencing intermittent connectivity issues, go through the following sections for troubleshooting tips.

### Run the command to check dropped packets

When there are intermittent connectivity issues, run the following command to check if there are any dropped packets. This command will try to establish 25 different TCP connections every 1 second with the service. Then, you can check how many of them succeeded/failed and also see TCP connection latency. You can download the `psping` tool from [here](/sysinternals/downloads/psping).

```shell
.\psping.exe -n 25 -i 1 -q {sampletopicname}.{region}-{suffix}.eventgrid.azure.net:443 -nobanner
```

You can use equivalent commands if you're using other tools such as `tcpping` [tcpping.exe](https://www.elifulkerson.com/projects/tcping.php).

Obtain a network trace if the previous steps don't help and analyze it using tools such as [Wireshark](https://www.wireshark.org/). Contact [Microsoft Support](https://support.microsoft.com/) if needed.

### Service upgrades/restarts

Transient connectivity issues may occur because of backend service upgrades and restarts. When they occur, you may see the following symptoms:

- There may be a drop in incoming messages/requests.
- The log file may contain error messages.
- The applications may be disconnected from the service for a few seconds.
- Requests may be momentarily throttled.

Catching these transient errors, backing off and then retrying the call will ensure that your code is resilient to these transient issues.

## Next steps

If you need more help, post your issue in the [Stack Overflow forum](https://stackoverflow.com/questions/tagged/azure-eventgrid) or open a [support ticket](https://azure.microsoft.com/support/options/).
